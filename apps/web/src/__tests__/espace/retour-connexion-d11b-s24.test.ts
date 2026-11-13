/**
 * @jest-environment node
 *
 * Lot D11b (s24), recette D11 :
 * - Q-1 (critère 2 du brief) : un visiteur sur `/mon-espace/questions/…` revient à CETTE adresse après
 *   connexion. La garde du layout recevait `garderEspace()` sans chemin et redirigeait vers la connexion
 *   avec `callbackUrl=/mon-espace` avant la page. Le middleware transmet maintenant l'adresse demandée
 *   (en-tête de requête, ouvert seulement), le layout la passe à la garde.
 * - @ux D-5 : l'ancien abonné qui ouvre l'adresse d'un fil (lien « L'équipe t'a répondu ») arrive sur son
 *   historique en lecture seule (`/profil#mes-questions`), pas sur l'offre ; toute autre page : `/abonnement`.
 */
import { NextRequest } from "next/server";

jest.mock("@/config/espace-client", () => ({
  ...jest.requireActual("@/config/espace-client"),
  get ESPACE_CLIENT_PUBLIE() {
    return (globalThis as { __ESPACE_OUVERT__?: boolean }).__ESPACE_OUVERT__ === true;
  },
}));
jest.mock("next/navigation", () => ({
  notFound: () => {
    throw new Error("NEXT_NOT_FOUND");
  },
  redirect: (url: string) => {
    throw new Error(`NEXT_REDIRECT ${url}`);
  },
}));
const enTetes = new Map<string, string>();
const lectureEnTetes = jest.fn((nom: string) => enTetes.get(nom) ?? null);
jest.mock("next/headers", () => ({ headers: () => ({ get: (nom: string) => lectureEnTetes(nom) }) }));
const getServerSession = jest.fn();
jest.mock("next-auth", () => ({ getServerSession: (...a: unknown[]) => getServerSession(...a) }));
jest.mock("@/lib/auth", () => ({ authOptions: {} }));
const findUnique = jest.fn();
jest.mock("@/lib/prisma", () => ({ prisma: { user: { findUnique: (...a: unknown[]) => findUnique(...a) } } }));
const noter = jest.fn(async () => undefined);
jest.mock("@/lib/mesure/evenements-espace", () => ({ noterEvenementEspace: (...a: unknown[]) => noter(...(a as [])) }));

import { EN_TETE_CHEMIN_ESPACE } from "@/config/espace-client";
import { garderEspace, HISTORIQUE_QUESTIONS_PROFIL } from "@/lib/espace/garde";
import MonEspaceLayout from "@/app/(dashboard)/mon-espace/layout";
import { arriveeApresConnexion, urlArriveeConnexion } from "@/lib/espace/arrivee";
import middleware from "@/middleware";

const drapeau = globalThis as { __ESPACE_OUVERT__?: boolean };
const ANCIEN = { plan: "FREE", subscription: { stripeSubscriptionId: "sub_fini" } };
const GRATUIT = { plan: "FREE", subscription: null };
const ACTIF = { plan: "PREMIUM", subscription: { stripeSubscriptionId: "sub_actif" } };
const FIL = "/mon-espace/questions/clx0fil0000000000000001";

function requete(chemin: string, enTetesEnvoyes: Record<string, string> = {}) {
  return new NextRequest(new URL(chemin, "https://deviens-marrant.fr"), { headers: { host: "deviens-marrant.fr", ...enTetesEnvoyes } });
}
/** Valeur de l'en-tête de requête réécrit par le middleware (`NextResponse.next({ request })`). */
const transmis = (res: Response) => res.headers.get(`x-middleware-request-${EN_TETE_CHEMIN_ESPACE}`);

beforeAll(() => {
  process.env.NEXTAUTH_SECRET = "secret-de-test-d11b";
});
beforeEach(() => {
  drapeau.__ESPACE_OUVERT__ = true;
  enTetes.clear();
  lectureEnTetes.mockClear();
  getServerSession.mockReset();
  findUnique.mockReset();
});
afterAll(() => {
  drapeau.__ESPACE_OUVERT__ = false;
  delete process.env.NEXTAUTH_SECRET;
});

describe("Q-1 : retour de connexion sur la page demandée", () => {
  it("middleware ouvert : l'adresse demandée (chemin + paramètres, sans `_rsc`) est transmise au layout", async () => {
    expect(transmis(await middleware(requete(`${FIL}?_rsc=abc`)))).toBe(FIL);
    expect(transmis(await middleware(requete("/mon-espace/s-entrainer?marche=2")))).toBe("/mon-espace/s-entrainer?marche=2");
    expect(transmis(await middleware(requete("/mon-espace")))).toBe("/mon-espace");
  });

  it("middleware : une valeur envoyée par le navigateur est remplacée ; hors /mon-espace, rien n'est posé", async () => {
    expect(transmis(await middleware(requete(FIL, { [EN_TETE_CHEMIN_ESPACE]: "https://evil.example" })))).toBe(FIL);
    expect(transmis(await middleware(requete("/vannes")))).toBeNull();
    expect(transmis(await middleware(requete("/mon-espacex")))).toBeNull();
  });

  it("middleware fermé : réécriture vers la 404, aucun en-tête transmis (régime de production inchangé)", async () => {
    drapeau.__ESPACE_OUVERT__ = false;
    const res = await middleware(requete(FIL));
    expect(res.headers.get("x-middleware-rewrite")).toContain("/_espace-ferme");
    expect(transmis(res)).toBeNull();
  });

  it("layout, visiteur sur l'adresse d'un fil : connexion avec retour sur ce fil (lien de l'e-mail de réponse)", async () => {
    getServerSession.mockResolvedValue(null);
    enTetes.set(EN_TETE_CHEMIN_ESPACE, FIL);
    await expect(MonEspaceLayout({ children: null })).rejects.toThrow(`NEXT_REDIRECT /login?callbackUrl=${encodeURIComponent(FIL)}`);
    enTetes.set(EN_TETE_CHEMIN_ESPACE, "/mon-espace/questions");
    await expect(MonEspaceLayout({ children: null })).rejects.toThrow("NEXT_REDIRECT /login?callbackUrl=%2Fmon-espace%2Fquestions");
  });

  it("layout : adresse absente ou hors espace = « Aujourd'hui » (jamais un retour externe)", async () => {
    getServerSession.mockResolvedValue(null);
    await expect(MonEspaceLayout({ children: null })).rejects.toThrow("NEXT_REDIRECT /login?callbackUrl=%2Fmon-espace");
    enTetes.set(EN_TETE_CHEMIN_ESPACE, "//evil.example/mon-espace");
    await expect(MonEspaceLayout({ children: null })).rejects.toThrow("NEXT_REDIRECT /login?callbackUrl=%2Fmon-espace");
    enTetes.set(EN_TETE_CHEMIN_ESPACE, "/profil");
    await expect(MonEspaceLayout({ children: null })).rejects.toThrow("NEXT_REDIRECT /login?callbackUrl=%2Fmon-espace");
  });

  it("layout fermé : 404 sans lire l'en-tête ni la session", async () => {
    drapeau.__ESPACE_OUVERT__ = false;
    await expect(MonEspaceLayout({ children: null })).rejects.toThrow("NEXT_NOT_FOUND");
    expect(lectureEnTetes).not.toHaveBeenCalled();
    expect(getServerSession).not.toHaveBeenCalled();
  });

  it("layout, abonné actif : passe et note l'ouverture", async () => {
    getServerSession.mockResolvedValue({ user: { id: "u1" } });
    findUnique.mockResolvedValue(ACTIF);
    enTetes.set(EN_TETE_CHEMIN_ESPACE, FIL);
    await expect(MonEspaceLayout({ children: null })).resolves.toBeTruthy();
    expect(noter).toHaveBeenCalledWith({ type: "espace_ouvert" }, "u1");
  });
});

describe("@ux D-5 : ancien abonné sur l'adresse d'un fil", () => {
  it("fil d'une question : historique en lecture seule de « Mon profil »", async () => {
    getServerSession.mockResolvedValue({ user: { id: "u1" } });
    findUnique.mockResolvedValue(ANCIEN);
    expect(HISTORIQUE_QUESTIONS_PROFIL).toBe("/profil#mes-questions");
    await expect(garderEspace(FIL)).rejects.toThrow("NEXT_REDIRECT /profil#mes-questions");
    enTetes.set(EN_TETE_CHEMIN_ESPACE, FIL);
    await expect(MonEspaceLayout({ children: null })).rejects.toThrow("NEXT_REDIRECT /profil#mes-questions");
  });

  it("toute autre page de l'espace, ou un compte jamais abonné : l'offre, comme avant", async () => {
    getServerSession.mockResolvedValue({ user: { id: "u1" } });
    findUnique.mockResolvedValue(ANCIEN);
    for (const chemin of ["/mon-espace", "/mon-espace/questions", "/mon-espace/questions/", "/mon-espace/repliques", null]) {
      await expect(garderEspace(chemin)).rejects.toThrow("NEXT_REDIRECT /abonnement");
    }
    findUnique.mockResolvedValue(GRATUIT);
    await expect(garderEspace(FIL)).rejects.toThrow("NEXT_REDIRECT /abonnement");
  });
});

describe("Q-2 (QA m2) : session perdue au retour de Stripe, puis connexion", () => {
  const RETOUR = "/abonnement/success?session_id=cs_test&returnTo=%2Fvannes%3Ffavori%3DJOKE.j1";

  it("ouvert : l'arrivée reste la page de retour de paiement (favori ajouté, puis « Aujourd'hui »), quel que soit le plan lu", () => {
    for (const compte of ["abonne", "ancien-abonne", "gratuit"] as const) expect(arriveeApresConnexion(RETOUR, compte, true)).toBe(RETOUR);
    expect(new URL(`http://x${urlArriveeConnexion(RETOUR)}`).searchParams.get("origine")).toBe(RETOUR);
  });

  it("le reste de /abonnement* ne sert toujours pas d'arrivée à un abonné ; fermé, inchangé", () => {
    expect(arriveeApresConnexion("/abonnement?plan=annual", "abonne", true)).toBe("/mon-espace");
    expect(arriveeApresConnexion("/abonnement/successx", "abonne", true)).toBe("/mon-espace");
    expect(arriveeApresConnexion("//evil.example/abonnement/success", "abonne", true)).toBe("/mon-espace");
    expect(arriveeApresConnexion(RETOUR, "abonne", false)).toBe(RETOUR);
  });
});
