/**
 * @jest-environment node
 *
 * Lettre de la semaine (s21, US-H1, H2, H3) : API de préférence, arrêt par jeton, arrêt en
 * un clic (RFC 8058). La base est simulée par les fonctions de `lib/lettre/hebdo` (testées à
 * part) ; ici : statuts HTTP, interrupteurs, session, limite, GET sans effet.
 */
let mockInscriptions = true;
jest.mock("@/config/lettre", () => ({
  ...jest.requireActual("@/config/lettre"),
  get LETTRE_HEBDO_INSCRIPTIONS_OUVERTES() {
    return mockInscriptions;
  },
}));

const getServerSession = jest.fn();
jest.mock("next-auth", () => ({ getServerSession: (...a: unknown[]) => getServerSession(...a) }));
jest.mock("@/lib/auth", () => ({ authOptions: {} }));

let mockLimite = true;
jest.mock("@/lib/rate-limit", () => ({
  getClientIp: () => "1.2.3.4",
  retryAfterSeconds: () => 42,
  sharedRateLimit: jest.fn(async () => ({ allowed: mockLimite, remaining: 0, resetAt: 0 })),
}));

const mockUser = { value: null as null | Record<string, unknown> };
jest.mock("@/lib/prisma", () => ({ prisma: { user: { findUnique: jest.fn(async () => mockUser.value) } } }));

const activer = jest.fn(async () => "activee");
const arreter = jest.fn(async () => "arretee");
const arreterParJeton = jest.fn(async (): Promise<string> => "arretee");
jest.mock("@/lib/lettre/hebdo", () => ({
  ...jest.requireActual("@/lib/lettre/hebdo"),
  activerLettreHebdo: (...a: unknown[]) => (activer as jest.Mock)(...a),
  arreterLettreHebdo: (...a: unknown[]) => (arreter as jest.Mock)(...a),
  arreterLettreHebdoParJeton: (...a: unknown[]) => (arreterParJeton as jest.Mock)(...a),
}));

import { NextRequest } from "next/server";
import { GET as getPreference, PUT as putPreference } from "@/app/api/lettre-premium/preference/route";
import { POST as postArret } from "@/app/api/lettre-premium/arret/route";
import { GET as getUnClic, POST as postUnClic } from "@/app/api/lettre-premium/arret-un-clic/route";

const JETON = "Q3x".padEnd(43, "a");
const avant = new Date("2026-11-01T10:00:00Z");

function compte(p: Record<string, unknown> = {}, pref: Record<string, unknown> | null = null) {
  return { id: "u1", email: "marc@x.fr", plan: "PREMIUM", emailVerified: avant, emailOptOut: false, updatedAt: avant, accounts: [], premiumLetter: pref, subscription: null, ...p };
}
const put = (corps: unknown) =>
  putPreference(new Request("http://localhost/api/lettre-premium/preference", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(corps) }));

beforeEach(() => {
  mockInscriptions = true;
  mockLimite = true;
  mockUser.value = compte();
  getServerSession.mockResolvedValue({ user: { id: "u1" } });
  jest.clearAllMocks();
});

describe("Préférence (réglage du profil ; s22 inscription d'office)", () => {
  it("H1-11 : inscriptions fermées, GET et activation en 404 (case absente)", async () => {
    mockInscriptions = false;
    expect((await getPreference()).status).toBe(404);
    expect((await put({ enabled: true, origine: "paiement" })).status).toBe(404);
    expect(activer).not.toHaveBeenCalled();
  });

  it("H3-10 (esprit) : inscriptions fermées, l'ARRÊT depuis le profil marche toujours", async () => {
    mockInscriptions = false;
    expect((await put({ enabled: false, origine: "profil" })).status).toBe(200);
    expect(arreter).toHaveBeenCalledWith("u1", "profil", expect.any(Date));
  });

  it("H1-7 / H1-9 : sans session 401, aucune écriture", async () => {
    getServerSession.mockResolvedValue(null);
    expect((await getPreference()).status).toBe(401);
    expect((await put({ enabled: true, origine: "profil" })).status).toBe(401);
    expect(activer).not.toHaveBeenCalled();
  });

  it("H1-9 : membre sans Premium 403", async () => {
    mockUser.value = compte({ plan: "FREE" });
    expect((await put({ enabled: true, origine: "profil" })).status).toBe(403);
    expect(activer).not.toHaveBeenCalled();
  });

  it("s22 (correction du 25/10) : adresse jamais vérifiée, compte à mot de passe : reprise acceptée (200), GET sans champ de vérification", async () => {
    mockUser.value = compte({ emailVerified: null, accounts: [] });
    expect((await put({ enabled: true, origine: "profil" })).status).toBe(200);
    expect(activer).toHaveBeenCalledWith("u1", "profil", expect.any(Date));
    const etat = await (await getPreference()).json();
    expect(etat).toMatchObject({ eligible: true, enabled: true, mensuelleSuspendue: true });
    expect(etat).not.toHaveProperty("adresseVerifiee");
  });

  it("400 : corps invalide, origine inconnue, ou texte de consentement envoyé par le navigateur (jamais lu)", async () => {
    expect((await put({ enabled: "oui", origine: "profil" })).status).toBe(400);
    expect((await put({ enabled: true, origine: "admin" })).status).toBe(400);
    expect((await put({ enabled: true, origine: "profil", consentText: "autre texte" })).status).toBe(400);
  });

  it("H1-2 : activation au paiement, origine écrite par le serveur", async () => {
    const res = await put({ enabled: true, origine: "paiement" });
    expect(res.status).toBe(200);
    expect(activer).toHaveBeenCalledWith("u1", "paiement", expect.any(Date));
  });

  it("H1-4 : cochée puis décochée au paiement, arrêt d'origine paiement", async () => {
    await put({ enabled: false, origine: "paiement" });
    expect(arreter).toHaveBeenCalledWith("u1", "paiement", expect.any(Date));
  });

  it("429 avec Retry-After au-delà de 10 requêtes par minute", async () => {
    mockLimite = false;
    const res = await put({ enabled: true, origine: "profil" });
    expect(res.status).toBe(429);
    expect(res.headers.get("Retry-After")).toBe("42");
  });

  it("403 si la requête vient d'un autre site", async () => {
    const res = await putPreference(
      new Request("http://localhost/api/lettre-premium/preference", { method: "PUT", headers: { Origin: "https://ailleurs.example", "Content-Type": "application/json" }, body: "{}" }),
    );
    expect(res.status).toBe(403);
  });

  it("s22 / H2-5 : GET, Premium sans ligne = inscrit d'office (réglage activé), fin prévue si résiliation en fin de période, jamais de jeton", async () => {
    mockUser.value = compte({ subscription: { cancelAtPeriodEnd: true, currentPeriodEnd: new Date("2026-12-03T10:00:00Z") } });
    const office = await (await getPreference()).json();
    expect(office).toMatchObject({ eligible: true, enabled: true, opposition: false, mensuelleSuspendue: true, email: "marc@x.fr", finPrevue: "2026-12-03T10:00:00.000Z" });
    mockUser.value = compte({}, { enabled: true, stoppedAt: null, stopOrigin: null, unsubscribeToken: JETON });
    const actif = await getPreference();
    const texte = await actif.text();
    expect(texte).not.toContain(JETON);
    expect(JSON.parse(texte)).toMatchObject({ enabled: true });
  });

  it("s22 : GET, arrêt explicite = réglage désactivé ; fin-premium (réabonné) = activé ; opposition globale signalée", async () => {
    mockUser.value = compte({}, { enabled: false, stoppedAt: avant, stopOrigin: "lien-email", unsubscribeToken: JETON });
    expect(await (await getPreference()).json()).toMatchObject({ enabled: false, mensuelleSuspendue: false });
    mockUser.value = compte({}, { enabled: false, stoppedAt: avant, stopOrigin: "fin-premium", unsubscribeToken: JETON });
    expect(await (await getPreference()).json()).toMatchObject({ enabled: true, mensuelleSuspendue: true });
    mockUser.value = compte({ emailOptOut: true });
    expect(await (await getPreference()).json()).toMatchObject({ opposition: true, mensuelleSuspendue: false });
  });
});

describe("Arrêt en un clic (sans session, toujours possible)", () => {
  const post = (corps: unknown) =>
    postArret(new NextRequest("http://localhost/api/lettre-premium/arret", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(corps) }));

  it("H3-2 : bouton de la page = POST, 200", async () => {
    const res = await post({ token: JETON });
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ arretee: true, deja: false });
    expect(arreterParJeton).toHaveBeenCalledWith(JETON, expect.any(Date));
  });

  it("H3-7 : déjà arrêtée, 200 deja", async () => {
    arreterParJeton.mockResolvedValueOnce("deja-arretee");
    expect(await (await post({ token: JETON })).json()).toEqual({ arretee: true, deja: true });
  });

  it("H3-6 : jeton inconnu 404 sans fuite ; jeton mal formé 400", async () => {
    arreterParJeton.mockResolvedValueOnce("inconnu");
    const res = await post({ token: JETON });
    expect(res.status).toBe(404);
    expect(JSON.stringify(await res.json())).not.toMatch(/compte|@/);
    expect((await post({ token: "court" })).status).toBe(400);
  });

  it("H3-8 : 429 au-delà de 20 par minute et par IP", async () => {
    mockLimite = false;
    expect((await post({ token: JETON })).status).toBe(429);
    expect(arreterParJeton).not.toHaveBeenCalled();
  });

  it("H3-10 : interrupteurs fermés, l'arrêt FONCTIONNE", async () => {
    mockInscriptions = false;
    expect((await post({ token: JETON })).status).toBe(200);
  });

  it("H3-3 : POST List-Unsubscribe=One-Click du client de messagerie, immédiat, sans contrôle d'origine", async () => {
    const res = await postUnClic(
      new NextRequest(`http://localhost/api/lettre-premium/arret-un-clic?token=${JETON}`, {
        method: "POST",
        headers: { Origin: "https://mail.google.com", "Content-Type": "application/x-www-form-urlencoded" },
        body: "List-Unsubscribe=One-Click",
      }),
    );
    expect(res.status).toBe(200);
    expect(arreterParJeton).toHaveBeenCalledTimes(1);
  });

  it("H3-1 : GET de l'URL un clic (scanner de liens) : AUCUN effet, renvoi vers la page du bouton", async () => {
    const res = await getUnClic(new NextRequest(`http://localhost/api/lettre-premium/arret-un-clic?token=${JETON}`));
    expect(res.status).toBe(303);
    expect(res.headers.get("location")).toContain(`/lettre/premium/arreter?token=${JETON}`);
    expect(arreterParJeton).not.toHaveBeenCalled();
  });
});
