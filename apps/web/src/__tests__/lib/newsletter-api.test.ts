/**
 * @jest-environment node
 *
 * POST /api/newsletter : lettre mensuelle s21, bi-état selon l'interrupteur.
 *  - Fermé (défaut) : 410 neutre, aucune lecture ni écriture (comme depuis le 01/10).
 *  - Ouvert : double opt-in, consentement versionné écrit par le serveur, empreinte
 *    d'IP (jamais l'IP), pas d'agent utilisateur, réponse identique quel que soit
 *    le statut de l'adresse (anti-fuite), plafonds d'e-mails.
 */
let mockOuvert = false;
jest.mock("@/config/lettre", () => ({
  ...jest.requireActual("@/config/lettre"),
  get LETTRE_OUVERTE() {
    return mockOuvert;
  },
}));

jest.mock("@/lib/prisma", () => ({
  prisma: {
    newsletterSubscriber: { findUnique: jest.fn(), create: jest.fn(), update: jest.fn() },
  },
}));

jest.mock("@/lib/email", () => ({ sendServiceTextEmail: jest.fn() }));

jest.mock("@/lib/rate-limit", () => ({
  ...jest.requireActual("@/lib/rate-limit"),
  sharedRateLimit: jest.fn(),
}));

import { POST } from "@/app/api/newsletter/route";
import { prisma } from "@/lib/prisma";
import { sendServiceTextEmail } from "@/lib/email";
import { sharedRateLimit } from "@/lib/rate-limit";
import { LETTRE_CONSENT_TEXT } from "@/lib/lettre/inscription";
import { TEXTES_LETTRE } from "@/config/textes/lettre-s21";

const db = prisma.newsletterSubscriber as unknown as Record<"findUnique" | "create" | "update", jest.Mock>;
const envoi = sendServiceTextEmail as jest.Mock;
const limite = sharedRateLimit as jest.Mock;

const SECRET = "s".repeat(40);

function requete(body: unknown, headers: Record<string, string> = {}) {
  return new Request("http://localhost:3000/api/newsletter", {
    method: "POST",
    headers: { "content-type": "application/json", "cf-connecting-ip": "203.0.113.9", ...headers },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

const valide = { email: "  Yanis@Exemple.FR ", consent: true, emplacement: "article", slug: "meilleures-blagues-droles-2026" };

function abonne(champs: Record<string, unknown>) {
  return {
    id: "sub1",
    email: "yanis@exemple.fr",
    source: "article:x",
    status: "PENDING",
    consentText: "x",
    consentAt: new Date(),
    confirmationToken: "c".repeat(43),
    unsubscribeToken: "u".repeat(43),
    confirmationSentAt: null,
    confirmationSendCount: 1,
    ipAddress: null,
    ...champs,
  };
}

beforeEach(() => {
  jest.clearAllMocks();
  mockOuvert = false;
  process.env.UNSUBSCRIBE_HMAC_SECRET = SECRET;
  process.env.NEXTAUTH_URL = "https://deviens-marrant.fr";
  limite.mockResolvedValue({ allowed: true, remaining: 4, resetAt: Date.now() + 60_000 });
  envoi.mockResolvedValue(undefined);
  db.findUnique.mockResolvedValue(null);
  db.create.mockResolvedValue({});
  db.update.mockResolvedValue({});
});

describe("POST /api/newsletter, interrupteur fermé", () => {
  it("répond 410 avec un message neutre, sans lecture ni écriture en base ni e-mail", async () => {
    const res = await POST(requete(valide));
    expect(res.status).toBe(410);
    const body = await res.json();
    expect(body.error).toBe("Les inscriptions sont fermées pour le moment.");
    expect(body.error).not.toMatch(/semaine|—/);
    expect(db.create).not.toHaveBeenCalled();
    expect(db.update).not.toHaveBeenCalled();
    expect(db.findUnique).not.toHaveBeenCalled();
    expect(envoi).not.toHaveBeenCalled();
  });
});

describe("POST /api/newsletter, interrupteur ouvert", () => {
  beforeEach(() => {
    mockOuvert = true;
  });

  it("nouvelle adresse : PENDING, consentement serveur, empreinte d'IP, pas d'agent utilisateur, e-mail de confirmation", async () => {
    const res = await POST(requete({ ...valide, consentText: "texte trafiqué par le navigateur" }, { "user-agent": "Mozilla/5.0" }));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });

    const data = db.create.mock.calls[0][0].data;
    expect(data.email).toBe("yanis@exemple.fr");
    expect(data.status).toBe("PENDING");
    expect(data.source).toBe("article:meilleures-blagues-droles-2026");
    expect(data.consentText).toBe(LETTRE_CONSENT_TEXT);
    expect(data.consentText).toBe(`lettre-mensuelle-v1 : ${TEXTES_LETTRE.formulaire.case}`);
    expect(data.consentText).toContain("Premium");
    expect(data.ipAddress).toMatch(/^[0-9a-f]{32}$/);
    expect(data.ipAddress).not.toContain("203.0.113.9");
    expect(data.userAgent).toBeNull();
    expect(data.confirmationSendCount).toBe(1);

    expect(envoi).toHaveBeenCalledTimes(1);
    const [to, , texte, kind, options] = envoi.mock.calls[0];
    expect(to).toBe("yanis@exemple.fr");
    expect(kind).toBe("lettre-confirmation");
    expect(options.replyTo).toBe("contact@deviens-marrant.fr");
    expect(texte).toContain(`https://deviens-marrant.fr/lettre/confirmer?token=${data.confirmationToken}`);
    expect(texte).toContain("Éditeur : deviens-marrant SAS");
    expect(texte).not.toMatch(/\/api\/newsletter\/confirm/);
  });

  it("e-mail invalide : 400 code email, rien écrit", async () => {
    const res = await POST(requete({ ...valide, email: "toi@" }));
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ code: "email" });
    expect(db.create).not.toHaveBeenCalled();
  });

  it("case non cochée : 400 code case, rien écrit", async () => {
    const res = await POST(requete({ ...valide, consent: false }));
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ code: "case" });
    expect(db.create).not.toHaveBeenCalled();
  });

  it("champ piège rempli : même réponse 200, rien écrit ni envoyé", async () => {
    const res = await POST(requete({ ...valide, "site-web": "http://spam" }));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
    expect(db.findUnique).not.toHaveBeenCalled();
    expect(envoi).not.toHaveBeenCalled();
  });

  it("adresse déjà confirmée : MÊME réponse, e-mail « déjà dans la liste » avec désinscription en un clic", async () => {
    db.findUnique.mockResolvedValue(abonne({ status: "CONFIRMED", confirmationSentAt: new Date(Date.now() - 48 * 3600_000) }));
    const res = await POST(requete(valide));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
    const [, sujet, texte, , options] = envoi.mock.calls[0];
    expect(sujet).toBe("Tu es déjà dans la liste");
    expect(texte).toContain(`/lettre/desinscrire?token=${"u".repeat(43)}`);
    expect(options.headers["List-Unsubscribe"]).toBe(`<https://deviens-marrant.fr/api/newsletter/unsubscribe/${"u".repeat(43)}>`);
    expect(options.headers["List-Unsubscribe-Post"]).toBe("List-Unsubscribe=One-Click");
    expect(db.update.mock.calls[0][0].data.status).toBeUndefined();
  });

  it("adresse confirmée relancée sous 24 h : même réponse, aucun e-mail", async () => {
    db.findUnique.mockResolvedValue(abonne({ status: "CONFIRMED", confirmationSentAt: new Date(Date.now() - 3600_000) }));
    const res = await POST(requete(valide));
    expect(await res.json()).toEqual({ ok: true });
    expect(envoi).not.toHaveBeenCalled();
  });

  it("PENDING relancé sous 60 s : même réponse, aucun e-mail", async () => {
    db.findUnique.mockResolvedValue(abonne({ confirmationSentAt: new Date(Date.now() - 10_000) }));
    const res = await POST(requete(valide));
    expect(await res.json()).toEqual({ ok: true });
    expect(envoi).not.toHaveBeenCalled();
  });

  it("PENDING : 2e e-mail de confirmation possible, 3e jamais (plafond @legal L4)", async () => {
    db.findUnique.mockResolvedValue(abonne({ confirmationSentAt: new Date(Date.now() - 120_000), confirmationSendCount: 1 }));
    await POST(requete(valide));
    expect(envoi).toHaveBeenCalledTimes(1);
    expect(db.update.mock.calls[0][0].data.confirmationSendCount).toEqual({ increment: 1 });

    envoi.mockClear();
    db.findUnique.mockResolvedValue(abonne({ confirmationSentAt: new Date(Date.now() - 120_000), confirmationSendCount: 2 }));
    const res = await POST(requete(valide));
    expect(await res.json()).toEqual({ ok: true });
    expect(envoi).not.toHaveBeenCalled();
  });

  it("désinscrit qui revient : nouveau cycle PENDING avec un NOUVEAU jeton de confirmation", async () => {
    db.findUnique.mockResolvedValue(abonne({ status: "UNSUBSCRIBED", confirmationSentAt: new Date(Date.now() - 86400_000) }));
    await POST(requete(valide));
    const data = db.update.mock.calls[0][0].data;
    expect(data.status).toBe("PENDING");
    expect(data.confirmationToken).not.toBe("c".repeat(43));
    expect(data.consentText).toBe(LETTRE_CONSENT_TEXT);
    expect(envoi.mock.calls[0][2]).toContain(data.confirmationToken);
  });

  it("trop d'essais depuis une IP : 429 avec Retry-After", async () => {
    limite.mockResolvedValueOnce({ allowed: false, remaining: 0, resetAt: Date.now() + 30_000 });
    const res = await POST(requete(valide));
    expect(res.status).toBe(429);
    expect(Number(res.headers.get("Retry-After"))).toBeGreaterThan(0);
    expect(db.findUnique).not.toHaveBeenCalled();
  });

  it("limite par adresse atteinte : réponse identique, aucun e-mail (anti-fuite)", async () => {
    limite.mockResolvedValueOnce({ allowed: true, remaining: 4, resetAt: 0 }).mockResolvedValueOnce({ allowed: false, remaining: 0, resetAt: 0 });
    const res = await POST(requete(valide));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
    expect(envoi).not.toHaveBeenCalled();
  });

  it("échec d'envoi de l'e-mail : 500 code serveur, sans adresse dans la réponse", async () => {
    envoi.mockRejectedValue(new Error("Resend : refus"));
    const res = await POST(requete(valide));
    expect(res.status).toBe(500);
    expect(await res.json()).toEqual({ code: "serveur" });
  });

  it("requête venant d'un autre site : 403", async () => {
    const res = await POST(requete(valide, { origin: "https://pirate.example" }));
    expect(res.status).toBe(403);
    expect(db.findUnique).not.toHaveBeenCalled();
  });

  it("sans JavaScript (formulaire HTML) : même traitement, redirection 303 vers /lettre?statut=verifie", async () => {
    const form = new URLSearchParams({ email: "yanis@exemple.fr", consent: "true", emplacement: "quiz" });
    const res = await POST(
      new Request("http://localhost:3000/api/newsletter", {
        method: "POST",
        headers: { "content-type": "application/x-www-form-urlencoded" },
        body: form.toString(),
      }),
    );
    expect(res.status).toBe(303);
    expect(res.headers.get("location")).toBe("https://deviens-marrant.fr/lettre?statut=verifie");
    expect(db.create.mock.calls[0][0].data.source).toBe("quiz");
  });

  it("formulaire HTML sans case cochée : redirection vers statut=saisie-case", async () => {
    const form = new URLSearchParams({ email: "yanis@exemple.fr", emplacement: "page" });
    const res = await POST(
      new Request("http://localhost:3000/api/newsletter", {
        method: "POST",
        headers: { "content-type": "application/x-www-form-urlencoded" },
        body: form.toString(),
      }),
    );
    expect(res.headers.get("location")).toBe("https://deviens-marrant.fr/lettre?statut=saisie-case");
    expect(db.create).not.toHaveBeenCalled();
  });
});
