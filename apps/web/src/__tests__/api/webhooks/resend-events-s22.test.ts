/**
 * @jest-environment node
 *
 * POST /api/webhooks/resend-events (s22) : rebonds et plaintes Resend.
 *  - Signature Svix : valide, invalide, expirée, en-têtes absents, secret absent (503).
 *  - Rebond définitif et plainte : lettre du mois désinscrite, lettre de la semaine
 *    arrêtée, `emailOptOut`, prospect en opposition, alerte admin, adresse jamais en clair.
 *  - Rebond temporaire : rien. Rejeu : rien de plus, pas de seconde alerte. Adresse inconnue.
 */
import { signerSvix } from "@/lib/delivrabilite/svix";

type Abonne = { email: string; status: string; unsubscribedAt: Date | null; ipAddress: string | null };
type Compte = { id: string; email: string; emailOptOut: boolean };
type Pref = { userId: string; enabled: boolean; stopOrigin: string | null };
type Lead = { email: string; optOut: boolean; status: string };

const base = {
  abonnes: [] as Abonne[],
  comptes: [] as Compte[],
  prefs: [] as Pref[],
  leads: [] as Lead[],
  memoire: new Map<string, unknown>(),
};
const egal = (a: string, f: { equals: string; mode?: string }) => a.toLowerCase() === f.equals.toLowerCase();

jest.mock("@/lib/prisma", () => ({
  prisma: {
    newsletterSubscriber: {
      updateMany: jest.fn(async ({ where, data }: { where: { email: { equals: string }; status: { not: string } }; data: Partial<Abonne> }) => {
        const cibles = base.abonnes.filter((a) => egal(a.email, where.email) && a.status !== where.status.not);
        cibles.forEach((a) => Object.assign(a, data));
        return { count: cibles.length };
      }),
    },
    user: {
      findMany: jest.fn(async ({ where }: { where: { email: { equals: string } } }) =>
        base.comptes.filter((c) => egal(c.email, where.email)).map((c) => ({ id: c.id })),
      ),
      updateMany: jest.fn(async ({ where }: { where: { id: { in: string[] }; emailOptOut: boolean } }) => {
        const cibles = base.comptes.filter((c) => where.id.in.includes(c.id) && c.emailOptOut === where.emailOptOut);
        cibles.forEach((c) => (c.emailOptOut = true));
        return { count: cibles.length };
      }),
    },
    premiumLetterPreference: {
      updateMany: jest.fn(async ({ where, data }: { where: { userId: { in: string[] } }; data: Partial<Pref> }) => {
        const cibles = base.prefs.filter((p) => where.userId.in.includes(p.userId) && p.enabled);
        cibles.forEach((p) => Object.assign(p, data));
        return { count: cibles.length };
      }),
    },
    ceoLead: {
      updateMany: jest.fn(async ({ where, data }: { where: { email: { equals: string } }; data: Partial<Lead> }) => {
        const cibles = base.leads.filter((l) => egal(l.email, where.email) && !l.optOut);
        cibles.forEach((l) => Object.assign(l, data));
        return { count: cibles.length };
      }),
    },
    ceoMemory: {
      findUnique: jest.fn(async ({ where }: { where: { namespace_key: { namespace: string; key: string } } }) => {
        const k = `${where.namespace_key.namespace}:${where.namespace_key.key}`;
        return base.memoire.has(k) ? { value: base.memoire.get(k) } : null;
      }),
      upsert: jest.fn(async ({ create }: { create: { namespace: string; key: string; value: unknown } }) => {
        base.memoire.set(`${create.namespace}:${create.key}`, create.value);
        return create;
      }),
    },
  },
}));

const alertes: Array<{ cle: string; sujet: string; html: string }> = [];
jest.mock("@/lib/admin-alerts", () => ({
  recordAdminAlert: jest.fn(async (a: { cle: string; sujet: string; html: string }) => {
    alertes.push(a);
    return true;
  }),
}));

import { POST } from "@/app/api/webhooks/resend-events/route";
const { classerAlerte } = jest.requireActual("@/lib/admin-alerts") as typeof import("@/lib/admin-alerts");

const SECRET = `whsec_${Buffer.from("cle-de-test-resend-events-s22-32o").toString("base64")}`;
const ADRESSE = "Yanis.Test@exemple.fr";
let consoles: jest.SpyInstance[] = [];

function requete(evt: unknown, o: { id?: string; ts?: number; secret?: string; signature?: string; sans?: boolean } = {}) {
  const corps = JSON.stringify(evt);
  const id = o.id ?? "msg_1";
  const ts = o.ts ?? Math.floor(Date.now() / 1000);
  const headers: Record<string, string> = o.sans
    ? {}
    : { "svix-id": id, "svix-timestamp": String(ts), "svix-signature": o.signature ?? signerSvix(corps, id, ts, o.secret ?? SECRET) };
  return new Request("https://deviens-marrant.fr/api/webhooks/resend-events", { method: "POST", body: corps, headers });
}

const rebond = (type: string, to: string[] = [ADRESSE]) => ({
  type: "email.bounced",
  created_at: "2026-10-25T10:00:00Z",
  data: { email_id: "e1", to, subject: "Lettre", bounce: { type, subType: "General", message: "x" } },
});
const plainte = (to: string[] = [ADRESSE]) => ({ type: "email.complained", data: { email_id: "e2", to } });

function journaux(): string {
  return consoles.flatMap((s) => s.mock.calls.map((c: unknown[]) => c.map(String).join(" "))).join("\n");
}

beforeEach(() => {
  process.env.RESEND_EVENTS_WEBHOOK_SECRET = SECRET;
  base.abonnes = [{ email: "yanis.test@exemple.fr", status: "CONFIRMED", unsubscribedAt: null, ipAddress: "h" }];
  base.comptes = [{ id: "u1", email: "yanis.test@exemple.fr", emailOptOut: false }];
  base.prefs = [{ userId: "u1", enabled: true, stopOrigin: null }];
  base.leads = [{ email: "yanis.test@exemple.fr", optOut: false, status: "NEW" }];
  base.memoire.clear();
  alertes.length = 0;
  consoles = [jest.spyOn(console, "log").mockImplementation(), jest.spyOn(console, "warn").mockImplementation(), jest.spyOn(console, "error").mockImplementation()];
});
afterEach(() => consoles.forEach((s) => s.mockRestore()));

describe("signature Svix", () => {
  it("valide : 200", async () => {
    expect((await POST(requete(rebond("Transient")))).status).toBe(200);
  });
  it("invalide (autre secret) : 401, rien d'écrit", async () => {
    const autre = `whsec_${Buffer.from("un-autre-secret-de-signature-xyz").toString("base64")}`;
    const res = await POST(requete(rebond("Permanent"), { secret: autre }));
    expect(res.status).toBe(401);
    expect(base.abonnes[0].status).toBe("CONFIRMED");
  });
  it("corps modifié après signature : 401", async () => {
    const ts = Math.floor(Date.now() / 1000);
    const signature = signerSvix(JSON.stringify(rebond("Transient")), "msg_1", ts, SECRET);
    expect((await POST(requete(rebond("Permanent"), { ts, signature }))).status).toBe(401);
  });
  it("expirée (horodatage de plus de 5 min) : 401", async () => {
    const res = await POST(requete(rebond("Permanent"), { ts: Math.floor(Date.now() / 1000) - 6 * 60 }));
    expect(res.status).toBe(401);
    expect(base.comptes[0].emailOptOut).toBe(false);
  });
  it("en-têtes absents : 401", async () => {
    expect((await POST(requete(rebond("Permanent"), { sans: true }))).status).toBe(401);
  });
  it("rotation : une des signatures listées suffit", async () => {
    const evt = rebond("Transient");
    const ts = Math.floor(Date.now() / 1000);
    const bonne = signerSvix(JSON.stringify(evt), "msg_1", ts, SECRET);
    expect((await POST(requete(evt, { ts, signature: `v1,AAAA ${bonne}` }))).status).toBe(200);
  });
  it("secret absent ou gabarit : 503", async () => {
    process.env.RESEND_EVENTS_WEBHOOK_SECRET = "whsec_...";
    expect((await POST(requete(rebond("Permanent")))).status).toBe(503);
    delete process.env.RESEND_EVENTS_WEBHOOK_SECRET;
    expect((await POST(requete(rebond("Permanent")))).status).toBe(503);
  });
});

describe("rebond définitif et plainte", () => {
  it("rebond Permanent : tout est arrêté, alerte B, adresse jamais en clair", async () => {
    const res = await POST(requete(rebond("Permanent")));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true, action: "traite", adresses: 1 });
    expect(base.abonnes[0]).toMatchObject({ status: "UNSUBSCRIBED", ipAddress: null });
    expect(base.abonnes[0].unsubscribedAt).toBeInstanceOf(Date);
    expect(base.prefs[0]).toMatchObject({ enabled: false, stopOrigin: "rebond" });
    expect(base.comptes[0].emailOptOut).toBe(true);
    expect(base.leads[0]).toMatchObject({ optOut: true, status: "OPT_OUT" });
    expect(alertes.map((a) => a.cle)).toEqual(["delivrabilite-rebond-definitif"]);
    expect(classerAlerte("delivrabilite-rebond-definitif").classe).toBe("B");
    const tout = `${journaux()}\n${JSON.stringify(alertes)}`;
    expect(tout.toLowerCase()).not.toContain("yanis.test");
    expect(tout).toContain("exemple.fr");
  });

  it("plainte : tout est arrêté (origine plainte), alerte A", async () => {
    expect((await POST(requete(plainte(), { id: "msg_p" }))).status).toBe(200);
    expect(base.abonnes[0].status).toBe("UNSUBSCRIBED");
    expect(base.prefs[0].stopOrigin).toBe("plainte");
    expect(base.comptes[0].emailOptOut).toBe(true);
    expect(alertes.map((a) => a.cle)).toEqual(["email-plainte"]);
    expect(classerAlerte("email-plainte").classe).toBe("A");
    expect(JSON.stringify(alertes).toLowerCase()).not.toContain("yanis.test");
  });

  it("rebond temporaire (Transient) ou indéterminé : rien", async () => {
    for (const [i, type] of ["Transient", "Undetermined", ""].entries()) {
      const res = await POST(requete(rebond(type), { id: `msg_t${i}` }));
      expect(await res.json()).toMatchObject({ action: "rebond-temporaire" });
    }
    expect(base.abonnes[0].status).toBe("CONFIRMED");
    expect(base.prefs[0].enabled).toBe(true);
    expect(base.comptes[0].emailOptOut).toBe(false);
    expect(alertes).toHaveLength(0);
  });

  it("rejeu du même svix-id : rien de plus, pas de seconde alerte", async () => {
    await POST(requete(rebond("Permanent"), { id: "msg_r" }));
    // Réabonnement entre-temps : le rejeu ne doit pas le défaire.
    base.abonnes[0].status = "CONFIRMED";
    const res = await POST(requete(rebond("Permanent"), { id: "msg_r" }));
    expect(await res.json()).toMatchObject({ action: "deja-traite" });
    expect(base.abonnes[0].status).toBe("CONFIRMED");
    expect(alertes).toHaveLength(1);
  });

  it("second événement (autre id) pour une adresse déjà traitée : aucune écriture, aucune alerte", async () => {
    await POST(requete(rebond("Permanent"), { id: "msg_a" }));
    alertes.length = 0;
    const res = await POST(requete(rebond("Permanent"), { id: "msg_b" }));
    expect(await res.json()).toMatchObject({ action: "traite" });
    expect(alertes).toHaveLength(0);
  });

  it("adresse inconnue : 200, rien d'écrit, pas d'alerte", async () => {
    const res = await POST(requete(rebond("Permanent", ["Inconnu <personne@ailleurs.fr>"]), { id: "msg_i" }));
    expect(await res.json()).toMatchObject({ action: "traite", adresses: 1 });
    expect(base.abonnes[0].status).toBe("CONFIRMED");
    expect(base.comptes[0].emailOptOut).toBe(false);
    expect(alertes).toHaveLength(0);
    expect(journaux()).not.toContain("personne@");
  });

  it("boîte du domaine (contact@) : rien désinscrit, alerte A de MX", async () => {
    base.comptes.push({ id: "u2", email: "contact@deviens-marrant.fr", emailOptOut: false });
    await POST(requete(rebond("Permanent", ["contact@deviens-marrant.fr"]), { id: "msg_c" }));
    expect(base.comptes[1].emailOptOut).toBe(false);
    expect(alertes.map((a) => a.cle)).toEqual(["email-rebond-interne"]);
  });

  it("autre type d'événement (email.delivered) : 200 ignoré", async () => {
    const res = await POST(requete({ type: "email.delivered", data: { to: [ADRESSE] } }, { id: "msg_d" }));
    expect(await res.json()).toMatchObject({ action: "ignore" });
    expect(base.comptes[0].emailOptOut).toBe(false);
  });

  it("JSON invalide mais signé : 400", async () => {
    const ts = Math.floor(Date.now() / 1000);
    const corps = "pas du json";
    const req = new Request("https://deviens-marrant.fr/api/webhooks/resend-events", {
      method: "POST",
      body: corps,
      headers: { "svix-id": "msg_j", "svix-timestamp": String(ts), "svix-signature": signerSvix(corps, "msg_j", ts, SECRET) },
    });
    expect((await POST(req)).status).toBe(400);
  });
});

describe("vérification Svix : vecteur de référence de la documentation Svix", () => {
  const { verifierSignatureSvix } = jest.requireActual("@/lib/delivrabilite/svix") as typeof import("@/lib/delivrabilite/svix");
  const ref = {
    corps: '{"test": 2432232314}',
    id: "msg_p5jXN8AQM9LWM0D4loKWxJek",
    timestamp: "1614265330",
    signature: "v1,g0hM9SsE+OTPJTGt/tmIKtSyZlE3uFJELVlNIOLJ1OE=",
    secret: "whsec_MfKQ9r8GKYqrTwjUPD8ILPZIo2LaLaSw",
  };
  it("signature publiée acceptée à la bonne date", () => {
    expect(verifierSignatureSvix({ ...ref, maintenant: new Date(1614265330_000) })).toBe("ok");
  });
  it("même signature refusée 6 min plus tard (expirée)", () => {
    expect(verifierSignatureSvix({ ...ref, maintenant: new Date(1614265330_000 + 6 * 60_000) })).toBe("expiree");
  });
});
