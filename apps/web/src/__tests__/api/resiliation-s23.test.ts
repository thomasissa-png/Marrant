/**
 * @jest-environment node
 *
 * POST /api/user/subscription/resiliation (s23, décision de Thomas du 06/11 : raison demandée AVANT).
 *  - Interrupteur fermé : 404, aucun appel Stripe.
 *  - Ordre : Stripe `cancel_at_period_end: true` D'ABORD (mensuel et annuel), puis motif, puis accusé.
 *  - Échec d'écriture du motif : résiliation réussie quand même, accusé envoyé.
 *  - Idempotence : double clic (même clé) = un accusé, une ligne ; déjà résilié = ni Stripe, ni e-mail.
 *  - Cas limites : sans abonnement, Premium sans client Stripe, App Store, erreur Stripe.
 *  - Anti-doublon avec le webhook : la clé d'accusé est réservée par l'écran, libérée si Stripe échoue.
 */
let mockOuvert = true;
jest.mock("@/config/resiliation", () => ({
  ...jest.requireActual("@/config/resiliation"),
  get RESILIATION_PAGE_OUVERTE() {
    return mockOuvert;
  },
}));

const getServerSession = jest.fn();
jest.mock("next-auth", () => ({ getServerSession: (...a: unknown[]) => getServerSession(...a) }));
jest.mock("@/lib/auth", () => ({ authOptions: {} }));
jest.mock("@/lib/rate-limit", () => {
  const reel = jest.requireActual("@/lib/rate-limit");
  return {
    ...reel,
    sharedRateLimit: jest.fn(async (scope: string, key: string, o: { maxRequests: number; windowMs: number }) => reel.rateLimit(`${scope}:${key}:${Math.random()}`, o)),
  };
});

const journal: string[] = [];
const stripeUpdate = jest.fn();
const portailCree = jest.fn(async (..._a: unknown[]) => ({ url: "https://billing.stripe.test/session" }));
jest.mock("@/lib/stripe", () => ({
  getStripe: () => ({
    billingPortal: { sessions: { create: (...a: unknown[]) => portailCree(...a) } },
    subscriptions: {
      update: (...a: unknown[]) => {
        journal.push("stripe");
        return stripeUpdate(...a);
      },
    },
  }),
}));
jest.mock("@/lib/account", () => ({ getSubscriptionSummary: jest.fn(async () => null) }));
const envoiClient = jest.fn(async (..._a: unknown[]) => true);
const envoiEquipe = jest.fn(async (..._a: unknown[]) => undefined);
jest.mock("@/lib/email", () => ({
  trySendTransactionalTextEmail: (...a: unknown[]) => {
    journal.push("email");
    return envoiClient(...a);
  },
  sendAdminHtmlEmail: (...a: unknown[]) => envoiEquipe(...a),
}));
const alerte = jest.fn(async (..._a: unknown[]) => true);
jest.mock("@/lib/admin-alerts", () => ({ recordAdminAlert: (...a: unknown[]) => alerte(...a) }));

type Sub = {
  id: string; userId: string; status: string; stripeCustomerId: string | null; stripeSubscriptionId: string | null;
  currentPeriodEnd: Date | null; cancelAtPeriodEnd: boolean; billingInterval: string | null; priceAmountCents: number | null; createdAt: Date;
};
const db = {
  users: new Map<string, { email: string | null; name: string | null; plan: string }>(),
  subs: new Map<string, Sub>(),
  events: new Map<string, { eventId: string; receivedAt: Date }>(),
  feedback: [] as Array<Record<string, unknown>>,
  feedbackEnPanne: false,
};
const p2002 = () => Object.assign(new Error("unique"), { code: "P2002" });
jest.mock("@/lib/prisma", () => ({
  prisma: {
    user: { findUnique: jest.fn(async ({ where }: { where: { id: string } }) => db.users.get(where.id) ?? null) },
    subscription: {
      findUnique: jest.fn(async ({ where }: { where: { userId: string } }) => {
        const s = db.subs.get(where.userId);
        return s ? { ...s } : null;
      }),
      update: jest.fn(async ({ where, data }: { where: { id: string }; data: Partial<Sub> }) => {
        const s = Array.from(db.subs.values()).find((x) => x.id === where.id);
        if (s) Object.assign(s, data);
        return s;
      }),
    },
    webhookEvent: {
      create: jest.fn(async ({ data }: { data: { eventId: string; receivedAt: Date } }) => {
        if (db.events.has(data.eventId)) throw p2002();
        db.events.set(data.eventId, { eventId: data.eventId, receivedAt: data.receivedAt });
        return data;
      }),
      updateMany: jest.fn(async ({ where, data }: { where: { eventId: string; receivedAt: { lt: Date } }; data: { receivedAt: Date } }) => {
        const e = db.events.get(where.eventId);
        if (e && e.receivedAt < where.receivedAt.lt) {
          e.receivedAt = data.receivedAt;
          return { count: 1 };
        }
        return { count: 0 };
      }),
      deleteMany: jest.fn(async ({ where }: { where: { eventId: string } }) => ({ count: db.events.delete(where.eventId) ? 1 : 0 })),
    },
    cancellationFeedback: {
      create: jest.fn(async ({ data }: { data: Record<string, unknown> }) => {
        journal.push("motif");
        if (db.feedbackEnPanne) throw Object.assign(new Error("relation does not exist"), { code: "P2021" });
        if (db.feedback.some((f) => f.requestKey === data.requestKey)) throw p2002();
        db.feedback.push(data);
        return data;
      }),
    },
  },
}));

import { POST } from "@/app/api/user/subscription/resiliation/route";
import { POST as portail } from "@/app/api/user/subscription/portal/route";
import { formatEuros } from "@/config/premium";
import { ACCUSE_FENETRE_MS, cleAccuseResiliation, reserverAccuseResiliation } from "@/lib/resiliation";

const FIN = new Date("2026-12-01T10:00:00Z");
const MAINTENANT = new Date("2026-11-06T10:00:00Z");
let n = 0;
const uuid = () => `00000000-0000-4000-8000-${String(++n).padStart(12, "0")}`;

function compte(opts: Partial<Sub> & { plan?: string; sansSub?: boolean } = {}): string {
  const id = `u${++n}`;
  db.users.set(id, { email: `${id}@x.fr`, name: "Yanis Martin", plan: opts.plan ?? "PREMIUM" });
  if (!opts.sansSub) {
    db.subs.set(id, {
      id: `sub-row-${id}`, userId: id, status: "ACTIVE", stripeCustomerId: `cus_${id}`, stripeSubscriptionId: `sub_${id}`,
      currentPeriodEnd: FIN, cancelAtPeriodEnd: false, billingInterval: "month", priceAmountCents: 199,
      createdAt: new Date("2026-10-01T10:00:00Z"), ...opts,
    });
  }
  getServerSession.mockResolvedValue({ user: { id } });
  return id;
}
const stripeOk = (interval = "month", montant = 199) =>
  stripeUpdate.mockImplementation(async (id: string) => ({
    id, status: "active", cancel_at_period_end: true, cancel_at: Math.floor(FIN.getTime() / 1000),
    items: { data: [{ current_period_end: Math.floor(FIN.getTime() / 1000), price: { unit_amount: montant, recurring: { interval } } }] },
  }));
const requete = (corps: unknown, headers: Record<string, string> = {}) =>
  new Request("https://deviens-marrant.fr/api/user/subscription/resiliation", {
    method: "POST",
    headers: { "content-type": "application/json", origin: "https://deviens-marrant.fr", "sec-fetch-site": "same-origin", ...headers },
    body: typeof corps === "string" ? corps : JSON.stringify(corps),
  });
const resilier = async (corps: unknown = { reasons: ["prix"], comment: "", cle: uuid() }, headers?: Record<string, string>) => {
  const res = await POST(requete(corps, headers));
  return { status: res.status, corps: (await res.json()) as Record<string, unknown> };
};

beforeEach(() => {
  mockOuvert = true;
  journal.length = 0;
  db.feedback.length = 0;
  db.feedbackEnPanne = false;
  db.events.clear();
  stripeUpdate.mockReset();
  envoiClient.mockClear();
  envoiEquipe.mockClear();
  alerte.mockClear();
  (["log", "warn", "error"] as const).forEach((m) => jest.spyOn(console, m).mockImplementation(() => {}));
  jest.useFakeTimers({ now: MAINTENANT, doNotFake: ["nextTick", "setImmediate", "queueMicrotask", "setTimeout", "clearTimeout"] });
});
afterEach(() => {
  jest.useRealTimers();
  jest.restoreAllMocks();
});

describe("interrupteur et accès", () => {
  it("fermé : 404, aucun appel Stripe, aucun e-mail", async () => {
    mockOuvert = false;
    compte();
    const r = await resilier();
    expect(r.status).toBe(404);
    expect(stripeUpdate).not.toHaveBeenCalled();
    expect(envoiClient).not.toHaveBeenCalled();
  });
  it("sans session : 401", async () => {
    getServerSession.mockResolvedValue(null);
    expect((await resilier()).status).toBe(401);
    expect(stripeUpdate).not.toHaveBeenCalled();
  });
  it("autre site : 403 (même contrôle d'origine que les routes sensibles)", async () => {
    compte();
    const r = await resilier({ cle: uuid() }, { origin: "https://pirate.example", "sec-fetch-site": "cross-site" });
    expect(r.status).toBe(403);
    expect(stripeUpdate).not.toHaveBeenCalled();
  });
});

describe("ordre : Stripe d'abord, puis motif, puis accusé", () => {
  it("mensuel : cancel_at_period_end, clé d'idempotence, date de fin lue chez Stripe", async () => {
    stripeOk();
    const id = compte({ currentPeriodEnd: new Date("2026-11-30T00:00:00Z") });
    const cle = uuid();
    const r = await resilier({ reasons: ["prix", "temps"], comment: "  Trop cher pour moi en ce moment.  ", cle });
    expect(r.status).toBe(200);
    expect(r.corps).toEqual({ etat: "resilie", dateFin: FIN.toISOString(), formule: "monthly" });
    expect(stripeUpdate).toHaveBeenCalledWith(`sub_${id}`, { cancel_at_period_end: true }, { idempotencyKey: `resiliation-${id}-${cle}` });
    expect(journal).toEqual(["stripe", "motif", "email"]);
    expect(db.subs.get(id)).toMatchObject({ cancelAtPeriodEnd: true, currentPeriodEnd: FIN });
    expect(db.feedback).toHaveLength(1);
    expect(db.feedback[0]).toMatchObject({ userId: id, reasons: ["temps", "prix"], comment: "Trop cher pour moi en ce moment.", formule: "monthly", tenureDays: 36, source: "ecran", requestKey: cle });
    expect(Object.keys(db.feedback[0])).not.toEqual(expect.arrayContaining(["email", "ip"]));
    const [to, sujet, texte, type] = envoiClient.mock.calls[0] as [string, string, string, string];
    expect([to, type]).toEqual([`${id}@x.fr`, "resiliation"]);
    expect(sujet).toBe("C’est noté : ton Premium s’arrête le 1er décembre 2026");
    expect(texte).toContain("Salut Yanis,");
    expect(texte).toContain(`Formule : Premium mensuel, ${formatEuros(199)} TTC par mois`);
    expect(texte).toContain("Fin du contrat : 1er décembre 2026");
    expect(texte).toContain("Merci d’avoir répondu à la question.");
    expect(texte).toContain("/profil#abonnement");
    expect(texte).not.toContain("—");
  });
  it("annuel : même appel Stripe, ligne de renouvellement dans l'accusé", async () => {
    stripeOk("year", 1699);
    const id = compte({ billingInterval: "year", priceAmountCents: 1699 });
    const r = await resilier({ cle: uuid() });
    expect(r.corps).toMatchObject({ etat: "resilie", formule: "annual" });
    expect(stripeUpdate.mock.calls[0][1]).toEqual({ cancel_at_period_end: true });
    const texte = envoiClient.mock.calls[0][2] as string;
    expect(texte).toContain(`Premium annuel, ${formatEuros(1699)} TTC par an`);
    expect(texte).toContain(`Le renouvellement de ${formatEuros(1699)} TTC par an n’aura pas lieu.`);
    expect(texte).not.toContain("Merci d’avoir répondu");
    expect(db.subs.get(id)?.cancelAtPeriodEnd).toBe(true);
  });
  it("échec d'écriture du motif : la résiliation reste réussie et l'accusé part", async () => {
    stripeOk();
    compte();
    db.feedbackEnPanne = true;
    const r = await resilier({ reasons: ["essai"], comment: "SECRET-MOT", cle: uuid() });
    expect(r.status).toBe(200);
    expect(r.corps.etat).toBe("resilie");
    expect(journal).toEqual(["stripe", "motif", "email"]);
    const logs = (console.error as jest.Mock).mock.calls.flat().join(" ");
    expect(logs).not.toContain("SECRET-MOT");
  });
  it("question facultative : sans raison ni mot, aucune ligne, résiliation faite", async () => {
    stripeOk();
    compte();
    const r = await resilier({ cle: uuid() });
    expect(r.corps.etat).toBe("resilie");
    expect(db.feedback).toHaveLength(0);
    expect(journal).toEqual(["stripe", "email"]);
  });
  it("motif invalide : raisons inconnues ignorées, mot tronqué à 500, corps illisible jamais bloquant", async () => {
    stripeOk();
    compte();
    await resilier({ reasons: ["prix", "inconnue", 42, "prix"], comment: "x".repeat(800), cle: uuid() });
    expect(db.feedback[0]).toMatchObject({ reasons: ["prix"] });
    expect((db.feedback[0].comment as string).length).toBe(500);
    compte();
    const r = await resilier("pas du json");
    expect(r.status).toBe(200);
    expect(r.corps.etat).toBe("resilie");
  });
});

describe("idempotence et cas limites", () => {
  it("double clic (même clé, en parallèle) : un seul accusé, une seule ligne de motif", async () => {
    stripeOk();
    compte();
    const corps = { reasons: ["essai"], comment: "", cle: uuid() };
    const [a, b] = await Promise.all([resilier(corps), resilier(corps)]);
    expect([a.status, b.status]).toEqual([200, 200]);
    expect(envoiClient).toHaveBeenCalledTimes(1);
    expect(db.feedback).toHaveLength(1);
    expect(new Set(stripeUpdate.mock.calls.map((c) => (c[2] as { idempotencyKey: string }).idempotencyKey)).size).toBe(1);
  });
  it("rechargement ou 2e onglet après succès : deja_resilie, ni Stripe, ni e-mail, ni motif", async () => {
    stripeOk();
    compte();
    await resilier({ reasons: ["prix"], cle: uuid() });
    journal.length = 0;
    const r = await resilier({ reasons: ["temps"], cle: uuid() });
    expect(r.corps).toEqual({ etat: "deja_resilie", dateFin: FIN.toISOString(), formule: "monthly" });
    expect(journal).toEqual([]);
    expect(db.feedback).toHaveLength(1);
  });
  it("déjà résilié en base : deja_resilie sans appel Stripe", async () => {
    compte({ cancelAtPeriodEnd: true });
    const r = await resilier();
    expect(r.status).toBe(200);
    expect(r.corps.etat).toBe("deja_resilie");
    expect(stripeUpdate).not.toHaveBeenCalled();
    expect(envoiClient).not.toHaveBeenCalled();
  });
  it("sans abonnement (compte gratuit) : 409 aucun", async () => {
    compte({ plan: "FREE", sansSub: true });
    const r = await resilier();
    expect(r).toEqual({ status: 409, corps: { etat: "aucun" } });
    expect(stripeUpdate).not.toHaveBeenCalled();
  });
  it("Premium sans client Stripe : 202 transmis, e-mail à l'équipe et accusé de demande, pas de cul-de-sac", async () => {
    const id = compte({ sansSub: true });
    const r = await resilier({ reasons: ["autre"], comment: "offert", cle: uuid() });
    expect(r.status).toBe(202);
    expect(r.corps.etat).toBe("transmis");
    expect(stripeUpdate).not.toHaveBeenCalled();
    expect(envoiEquipe).toHaveBeenCalledTimes(1);
    expect(envoiEquipe.mock.calls[0][1]).toContain(id);
    expect(envoiEquipe.mock.calls[0][1]).not.toContain(`${id}@x.fr`);
    expect(envoiClient.mock.calls[0][1]).toBe("Ta demande de résiliation est bien reçue");
    expect(db.feedback).toHaveLength(1);
  });
  it("App Store (appli, sans client Stripe) : 409 app_store, rien d'envoyé", async () => {
    compte({ sansSub: true });
    const r = await resilier({ cle: uuid() }, { origin: "capacitor://localhost" });
    expect(r).toEqual({ status: 409, corps: { etat: "app_store" } });
    expect(envoiEquipe).not.toHaveBeenCalled();
  });
  it("erreur Stripe : 202 transmis, équipe prévenue, accusé de demande, pas de « C'est noté », clé libérée", async () => {
    stripeUpdate.mockRejectedValue(Object.assign(new Error("boom"), { type: "StripeConnectionError", code: "ECONNRESET" }));
    const id = compte();
    const r = await resilier({ reasons: ["prix"], cle: uuid() });
    expect(r.status).toBe(202);
    expect(r.corps).toEqual({ etat: "transmis", dateFin: FIN.toISOString(), formule: "monthly" });
    expect(envoiEquipe).toHaveBeenCalledTimes(1);
    expect(envoiEquipe.mock.calls[0][1]).toContain("StripeConnectionError");
    expect(alerte).toHaveBeenCalledWith(expect.objectContaining({ cle: "paiement-resiliation-a-faire" }));
    expect(envoiClient).toHaveBeenCalledTimes(1);
    expect(envoiClient.mock.calls[0][1]).toBe("Ta demande de résiliation est bien reçue");
    expect(db.subs.get(id)?.cancelAtPeriodEnd).toBe(false);
    expect(db.events.has(cleAccuseResiliation(`sub_${id}`))).toBe(false);
    expect(db.feedback).toHaveLength(1);
    // « Réessayer » : l'équipe n'est pas prévenue une 2e fois dans les 24 h.
    await resilier({ reasons: ["prix"], cle: uuid() });
    expect(envoiEquipe).toHaveBeenCalledTimes(1);
  });
});

describe("anti-doublon de l'accusé avec le webhook", () => {
  it("après l'écran, le webhook ne renvoie pas l'accusé ; une nouvelle résiliation 10 min plus tard, si", async () => {
    stripeOk();
    const id = compte();
    await resilier({ cle: uuid() });
    expect(await reserverAccuseResiliation(`sub_${id}`, MAINTENANT)).toBe(false);
    expect(await reserverAccuseResiliation(`sub_${id}`, new Date(MAINTENANT.getTime() + ACCUSE_FENETRE_MS + 1000))).toBe(true);
  });
  it("résiliation par le portail (clé libre) : le webhook envoie", async () => {
    expect(await reserverAccuseResiliation("sub_portail", MAINTENANT)).toBe(true);
  });
});

describe("portail Stripe : parcours « resilier »", () => {
  const demande = () =>
    portail(
      new Request("https://deviens-marrant.fr/api/user/subscription/portal", {
        method: "POST",
        headers: { "content-type": "application/json", origin: "https://deviens-marrant.fr", "sec-fetch-site": "same-origin" },
        body: JSON.stringify({ parcours: "resilier" }),
      }),
    );
  it("interrupteur ouvert : renvoyé vers /resiliation, aucun appel Stripe", async () => {
    compte();
    const res = await demande();
    expect(await res.json()).toEqual({ url: "/resiliation", cible: true });
    expect(stripeUpdate).not.toHaveBeenCalled();
    expect(portailCree).not.toHaveBeenCalled();
  });
  it("interrupteur fermé : parcours « resilier » du portail Stripe comme avant, jamais /resiliation (@reviewer O3)", async () => {
    mockOuvert = false;
    const id = compte();
    const res = await demande();
    expect(await res.json()).toEqual({ url: "https://billing.stripe.test/session", cible: true });
    expect(portailCree).toHaveBeenCalledWith(
      expect.objectContaining({ customer: `cus_${id}`, flow_data: expect.objectContaining({ type: "subscription_cancel" }) }),
    );
  });
});

describe("base indisponible avant toute action (@reviewer O1, @legal O4)", () => {
  const sansBase = (email: string | null = "abonne@x.fr") => {
    getServerSession.mockResolvedValue({ user: { id: "u-panne", email } });
    (require("@/lib/rate-limit").sharedRateLimit as jest.Mock).mockRejectedValueOnce(new Error("Can't reach database server"));
  };
  it("503 : e-mail à l'équipe « Stripe n’a pas été appelé », accusé de demande à l'adresse de la session", async () => {
    sansBase();
    const r = await resilier();
    expect(r.status).toBe(503);
    expect(stripeUpdate).not.toHaveBeenCalled();
    expect(envoiEquipe).toHaveBeenCalledTimes(1);
    const html = envoiEquipe.mock.calls[0][1] as string;
    expect(html).toContain("Base indisponible au moment de la demande depuis l’écran /resiliation : Stripe n’a pas été appelé.");
    expect(html).not.toContain("La résiliation Stripe a échoué");
    expect(html).toContain("L’abonné a reçu « Ta demande de résiliation est bien reçue »");
    expect(envoiClient).toHaveBeenCalledTimes(1);
    expect(envoiClient.mock.calls[0][0]).toBe("abonne@x.fr");
    expect(envoiClient.mock.calls[0][1]).toBe("Ta demande de résiliation est bien reçue");
  });
  it("503 sans adresse dans la session : l'équipe sait que l'abonné n'a reçu aucun e-mail", async () => {
    sansBase(null);
    const r = await resilier();
    expect(r.status).toBe(503);
    expect(envoiEquipe.mock.calls[0][1]).toContain("L’abonné n’a reçu aucun e-mail");
    expect(envoiClient).not.toHaveBeenCalled();
  });
  it("base ET e-mail indisponibles : 500 (l'écran invite à réessayer, sans promesse), aucun accusé", async () => {
    sansBase();
    envoiEquipe.mockRejectedValueOnce(new Error("resend down"));
    const r = await resilier();
    expect(r.status).toBe(500);
    expect(envoiClient).not.toHaveBeenCalled();
  });
});

describe("accusé de demande : délai et date d'effet (@legal O5)", () => {
  it("délai provisoire « sous un jour ouvré » et date de la demande qui compte", async () => {
    stripeUpdate.mockRejectedValue(Object.assign(new Error("boom"), { type: "StripeAPIError" }));
    compte();
    await resilier();
    const texte = envoiClient.mock.calls[0][2] as string;
    expect(texte).toContain("On s’occupe de ta résiliation et on te confirme par e-mail sous un jour ouvré. Ta demande date du ");
    expect(texte).toContain(" : c’est cette date qui compte, même si on la finalise plus tard. Tu gardes Premium jusqu’au 1er décembre 2026.");
    expect(texte).not.toContain("—");
  });
  it("date de la demande écrite une seule fois (@reviewer R4)", async () => {
    stripeUpdate.mockRejectedValue(Object.assign(new Error("boom"), { type: "StripeAPIError" }));
    compte();
    await resilier();
    const texte = envoiClient.mock.calls[0][2] as string;
    expect(texte).toContain("Ta demande de résiliation est bien reçue.\n");
    expect(texte.match(/demande du |demande date du /g)).toHaveLength(1);
  });
  it("accès offert (sans client Stripe) : « jusqu’à la fin de ton accès Premium », jamais « période payée » (@reviewer R1)", async () => {
    compte({ sansSub: true });
    await resilier();
    const texte = envoiClient.mock.calls[0][2] as string;
    expect(texte).toContain("Tu gardes Premium jusqu’à la fin de ton accès Premium.");
    expect(texte).not.toContain("période payée");
  });
});

describe("accusé « C’est noté » en impayé (@legal O7, statut lu avant l’appel Stripe)", () => {
  const PUCES_IMPAYE = [
    "- Tu gardes l’accès Premium jusqu’au 1er décembre 2026, sauf si la facture en cours reste impayée.",
    "- Ton dernier paiement n’a pas abouti : cette facture peut encore être prélevée. Aucun autre prélèvement ensuite.",
  ];
  it("PAST_DUE : puces 1 et 2 remplacées par le texte prudent, aucun « Aucun nouveau prélèvement »", async () => {
    stripeOk();
    compte({ status: "PAST_DUE" });
    expect((await resilier()).status).toBe(200);
    const texte = envoiClient.mock.calls[0][2] as string;
    PUCES_IMPAYE.forEach((l) => expect(texte).toContain(l));
    expect(texte).not.toContain("Aucun nouveau prélèvement");
    expect(texte).not.toContain("—");
  });
  it("ACTIVE : puces habituelles, « Aucun nouveau prélèvement après cette date. »", async () => {
    stripeOk();
    compte();
    await resilier();
    const texte = envoiClient.mock.calls[0][2] as string;
    expect(texte).toContain("- Tu gardes l’accès Premium jusqu’au 1er décembre 2026.\n- Aucun nouveau prélèvement après cette date.");
    expect(texte).not.toContain("sauf si la facture");
  });
});
