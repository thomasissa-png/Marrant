/**
 * @jest-environment node
 *
 * Lot D3 de l'espace client (s24, `docs/espace-client/plan-developpement-s24.md` §3) :
 * premier pas (8 cas de l'ordre 1), arrivées après paiement et après connexion (fermé = celles
 * d'aujourd'hui), question C9 (une fois, liste fermée, 403 sans abonnement), toucher de la vanne
 * (jamais d'humour noir, jamais d'exercice), capteur anonyme, textes.
 * Interrupteur OUVERT seulement ici, par un mock (jamais dans le code livré).
 */
import { readFileSync } from "fs";
import { join } from "path";

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
const getServerSession = jest.fn();
jest.mock("next-auth", () => ({ getServerSession: (...a: unknown[]) => getServerSession(...a) }));
jest.mock("@/lib/auth", () => ({ authOptions: {} }));
jest.mock("@/lib/rate-limit", () => ({ sharedRateLimit: jest.fn(async () => ({ allowed: true, remaining: 1, resetAt: 0 })) }));
const prismaMock: Record<string, Record<string, jest.Mock>> = {
  user: { findUnique: jest.fn() },
  espaceCompte: { updateMany: jest.fn(), findUnique: jest.fn(), create: jest.fn() },
  espaceCompteur: { upsert: jest.fn() },
  joke: { count: jest.fn(), findFirst: jest.fn(), groupBy: jest.fn() },
};
jest.mock("@/lib/prisma", () => ({
  get prisma() {
    return prismaMock;
  },
}));

import { choisirPremierPas, lireOrigine, lireProfilQuiz, hrefFiche, ENTREES_QUIZ, type EntreeDisponible } from "@/lib/espace/premier-pas";
import { arriveeApresPaiement, urlArriveeConnexion } from "@/lib/espace/arrivee";
import { getPostPaymentDestination } from "@/lib/premium-return";
import { categoriesProposees, tirerVanne } from "@/lib/espace/vanne";
import { POST as postAise } from "@/app/api/espace/aise/route";
import { GET as getVanne } from "@/app/api/espace/vanne/route";
import { POST as postCompteur } from "@/app/api/espace/compteur/route";
import { GET as getArrivee } from "@/app/api/espace/arrivee/route";
import { TEXTES_AUJOURDHUI as T } from "@/config/textes/espace-aujourdhui";

const drapeau = globalThis as { __ESPACE_OUVERT__?: boolean };
const ACTIF = { plan: "PREMIUM", subscription: { stripeSubscriptionId: "sub_actif" } };
const GRATUIT = { plan: "FREE", subscription: null };
const ANCIEN = { plan: "FREE", subscription: { stripeSubscriptionId: "sub_fini" } };
const connecte = (compte: unknown) => {
  getServerSession.mockResolvedValue({ user: { id: "u1", plan: "PREMIUM" } });
  prismaMock.user.findUnique.mockResolvedValue(compte);
};
const SCENE = T.premierPas.sceneParDefaut;
const ENTREES: EntreeDisponible[] = Object.values(ENTREES_QUIZ).map((id) => ({ id, titre: `Titre ${id}`, minutes: 5 }));

beforeEach(() => {
  jest.clearAllMocks();
  drapeau.__ESPACE_OUVERT__ = true;
});
afterAll(() => {
  drapeau.__ESPACE_OUVERT__ = false;
});

describe("premier pas, ordre 1 (architecture 4.2)", () => {
  const fiche = { genre: "fiche" as const, titre: "La réclamation", href: "/conseils/la-reclamation-abc" };
  const etape = { genre: "etape" as const, titre: "Tes premières répliques", href: "/parcours/confiance#etape-2" };
  const parcours = { genre: "parcours" as const, titre: "Étape 1 de Boulot", href: "/parcours/boulot#etape-1" };

  it("1. retour vers une fiche du catalogue : la fiche, même avec un quiz", () => {
    expect(choisirPremierPas(fiche, "TAQUIN", ENTREES, SCENE)).toMatchObject({ source: "fiche", href: fiche.href });
  });
  it("2. retour vers une étape : l'étape, même avec un quiz", () => {
    expect(choisirPremierPas(etape, "ABSURDE", ENTREES, SCENE)).toMatchObject({ source: "etape", href: etape.href });
  });
  it("3. parcours sans étape autre que Répartie, sans quiz : l'étape 1 de ce parcours", () => {
    expect(choisirPremierPas(parcours, null, ENTREES, SCENE)).toMatchObject({ source: "parcours", href: parcours.href });
  });
  it("3 bis. parcours sans étape mais quiz : le quiz passe avant", () => {
    expect(choisirPremierPas(parcours, "OBSERVATEUR", ENTREES, SCENE).source).toBe("quiz");
  });
  it("4. /parcours/repartie sans étape = aucun signal", () => {
    expect(lireOrigine("/parcours/repartie")).toBeNull();
    expect(choisirPremierPas(null, null, ENTREES, SCENE)).toMatchObject({ source: "defaut", titre: SCENE, minutes: 5 });
  });
  it.each([
    ["OBSERVATEUR", ENTREES_QUIZ.OBSERVATEUR],
    ["STORYTELLER", ENTREES_QUIZ.STORYTELLER],
    ["ABSURDE", ENTREES_QUIZ.ABSURDE],
    ["PUNCHLINEUR", ENTREES_QUIZ.PUNCHLINEUR],
    ["TAQUIN", ENTREES_QUIZ.TAQUIN],
  ] as const)("5 à 7. quiz %s : sa situation d'entrée", (profil, id) => {
    expect(choisirPremierPas(null, profil, ENTREES, SCENE)).toMatchObject({ source: "quiz", href: hrefFiche("situation", id), minutes: 5 });
  });
  it("8. aucun signal : la scène par défaut « Tiens, tu as changé quelque chose, non ? »", () => {
    expect(choisirPremierPas(null, null, [], SCENE)).toEqual({ source: "defaut", titre: SCENE, href: hrefFiche("situation", ENTREES_QUIZ.PUNCHLINEUR), minutes: 5 });
  });
  it("entrée du quiz absente du contenu servi : la scène par défaut, jamais une adresse vide", () => {
    expect(choisirPremierPas(null, "TAQUIN", [], SCENE).source).toBe("defaut");
  });
  it("lecture du lien de retour", () => {
    expect(lireOrigine("/conseils/la-reclamation-abc")).toEqual({ genre: "fiche", type: "TIP", slug: "la-reclamation-abc", id: null });
    expect(lireOrigine("/vannes?favori=JOKE.abc123")).toEqual({ genre: "fiche", type: "JOKE", slug: null, id: "abc123" });
    expect(lireOrigine("/vannes/theme/boulot")).toBeNull();
    expect(lireOrigine("/parcours/confiance#etape-2")).toEqual({ genre: "etape", parcours: "confiance", etape: 2 });
    expect(lireOrigine("/parcours/repartie#etape-3")).toEqual({ genre: "etape", parcours: "repartie", etape: 3 });
    expect(lireOrigine("/parcours/boulot")).toEqual({ genre: "parcours", parcours: "boulot" });
    expect(lireOrigine("/blog/article")).toBeNull();
    expect(lireOrigine("//evil.example/vannes/x")).toBeNull();
    expect(lireOrigine("/abonnement?returnTo=%2Fvannes")).toBeNull();
  });
  it("lecture du quiz : profil connu seulement", () => {
    expect(lireProfilQuiz(JSON.stringify({ profile: "TAQUIN", completedAt: "x" }))).toBe("TAQUIN");
    expect(lireProfilQuiz(JSON.stringify({ profile: "AUTRE" }))).toBeNull();
    expect(lireProfilQuiz("{")).toBeNull();
  });
});

describe("arrivées (décision C14, connexion du 12/11)", () => {
  it("après paiement : fermé = destination d'aujourd'hui, ouvert = « Aujourd'hui » avec le lien de retour", () => {
    for (const r of ["/vannes?favori=JOKE.abc", "/parcours/confiance#etape-2", null]) {
      expect(arriveeApresPaiement(r, false)).toBe(getPostPaymentDestination(r));
    }
    expect(arriveeApresPaiement("/vannes?favori=JOKE.abc", true)).toBe("/mon-espace?depuis=%2Fvannes%3Ffavori%3DJOKE.abc");
    expect(arriveeApresPaiement("/abonnement", true)).toBe("/mon-espace");
  });

  it("après connexion, route fermée : 404 sans lecture", async () => {
    drapeau.__ESPACE_OUVERT__ = false;
    const r = await getArrivee(new Request("http://localhost/api/espace/arrivee"));
    expect(r.status).toBe(404);
    expect(getServerSession).not.toHaveBeenCalled();
  });

  it.each([
    ["abonné actif sans origine", ACTIF, null, "/mon-espace"],
    ["abonné actif avec origine", ACTIF, "/conseils/x", "/conseils/x"],
    ["ancien abonné", ANCIEN, "/conseils/x", "/abonnement"],
    ["compte gratuit sans origine", GRATUIT, null, "/vannes"],
    ["compte gratuit avec origine", GRATUIT, "/conseils/x", "/conseils/x"],
  ])("après connexion, %s : plan relu en base", async (_cas, compte, origine, attendu) => {
    connecte(compte);
    const r = await getArrivee(new Request(`http://localhost${urlArriveeConnexion(origine)}`));
    expect(r.status).toBe(303);
    const lieu = new URL(r.headers.get("location") ?? "");
    expect(`${lieu.pathname}${lieu.search}`).toBe(attendu);
  });

  it("après connexion Google : le marqueur de mesure suit la destination", async () => {
    connecte(ACTIF);
    const r = await getArrivee(new Request(`http://localhost${urlArriveeConnexion(null, "connexion-google")}`));
    expect(r.headers.get("location")).toContain("/mon-espace?auth=connexion-google");
  });
});

describe("question C9 « Où veux-tu être plus à l'aise ? »", () => {
  const poster = (corps: unknown) =>
    postAise(new Request("http://localhost/api/espace/aise", { method: "POST", body: JSON.stringify(corps) }));

  it("fermé : 404 sans lecture ; non Premium : 403 ; valeur hors liste : 400", async () => {
    drapeau.__ESPACE_OUVERT__ = false;
    expect((await poster({ aise: "POTES" })).status).toBe(404);
    drapeau.__ESPACE_OUVERT__ = true;
    connecte(GRATUIT);
    expect((await poster({ aise: "POTES" })).status).toBe(403);
    connecte(ACTIF);
    expect((await poster({ aise: "SOIREE" })).status).toBe(400);
    expect((await poster({ aise: "POTES", autre: 1 })).status).toBe(400);
    expect(prismaMock.espaceCompte.updateMany).not.toHaveBeenCalled();
  });

  it("enregistrée une fois : la première réponse reste", async () => {
    connecte(ACTIF);
    prismaMock.espaceCompte.updateMany.mockResolvedValue({ count: 0 });
    prismaMock.espaceCompte.findUnique.mockResolvedValueOnce(null);
    prismaMock.espaceCompte.create.mockResolvedValue({});
    expect(await (await poster({ aise: "BOULOT" })).json()).toEqual({ ok: true, deja: false });
    expect(prismaMock.espaceCompte.create).toHaveBeenCalledWith({ data: expect.objectContaining({ userId: "u1", aise: "BOULOT" }) });
    prismaMock.espaceCompte.findUnique.mockResolvedValueOnce({ aise: "BOULOT" });
    expect(await (await poster({ aise: "PARTOUT" })).json()).toEqual({ ok: true, deja: true });
    expect(prismaMock.espaceCompte.create).toHaveBeenCalledTimes(1);
  });
});

describe("toucher de la vanne et capteur", () => {
  it("tirage : jamais une vanne humour noir, servies au contenu du jour d'abord, vues exclues", async () => {
    prismaMock.joke.count.mockResolvedValue(3);
    prismaMock.joke.findFirst.mockResolvedValue({ id: "j1", content: "c", punchline: "p" });
    await tirerVanne("soiree", ["j0"]);
    const where = prismaMock.joke.findFirst.mock.calls[0][0].where;
    expect(where).toMatchObject({ isActive: true, humourNoir: false, category: "SOIREES", id: { notIn: ["j0"] }, dailyContents: { some: {} } });
    expect(prismaMock.joke.findFirst.mock.calls[0][0].select).toEqual({ id: true, content: true, punchline: true });
  });

  it("route : texte seul, jamais d'exercice ; 403 hors abonnement ; catégorie hors liste 400", async () => {
    connecte(GRATUIT);
    expect((await getVanne(new Request("http://localhost/api/espace/vanne?categorie=soiree"))).status).toBe(403);
    connecte(ACTIF);
    expect((await getVanne(new Request("http://localhost/api/espace/vanne?categorie=humour-noir"))).status).toBe(400);
    prismaMock.joke.count.mockResolvedValue(1);
    prismaMock.joke.findFirst.mockResolvedValue({ id: "j1", content: "c", punchline: "p", howToApply: "exercice" });
    const corps = await (await getVanne(new Request("http://localhost/api/espace/vanne?categorie=boulot&vues=a,b"))).json();
    expect(corps).toEqual({ vanne: { id: "j1", content: "c", punchline: "p" } });
  });

  it("seuil non fixé : aucune catégorie proposée (seul « Une autre » reste) ; fixé : celles qui l'atteignent", async () => {
    expect(await categoriesProposees()).toEqual([]);
    prismaMock.joke.groupBy.mockResolvedValue([
      { category: "SOIREES", _count: { _all: 31 } },
      { category: "BOULOT", _count: { _all: 10 } },
    ]);
    expect(await categoriesProposees(30)).toEqual(["soiree"]);
  });

  it("capteur : clé et valeur d'une liste fermée, aucun identifiant d'abonné écrit", async () => {
    connecte(ACTIF);
    const poster = (corps: unknown) =>
      postCompteur(new Request("http://localhost/api/espace/compteur", { method: "POST", body: JSON.stringify(corps) }));
    expect((await poster({ cle: "toucher", valeur: "humour-noir" })).status).toBe(400);
    expect((await poster({ cle: "vanne", valeur: "soiree" })).status).toBe(400);
    expect((await poster({ cle: "toucher", valeur: "soiree", userId: "u1" })).status).toBe(400);
    expect((await poster({ cle: "une-autre", valeur: "peu-importe" })).status).toBe(200);
    const ecrit = JSON.stringify(prismaMock.espaceCompteur.upsert.mock.calls);
    expect(ecrit).not.toContain("u1");
    expect(prismaMock.espaceCompteur.upsert).toHaveBeenCalledWith(
      expect.objectContaining({ create: expect.objectContaining({ cle: "une-autre", valeur: "peu-importe", n: 1 }) }),
    );
  });
});

describe("textes et fichiers", () => {
  const SRC = join(__dirname, "../..");
  it("espace-aujourdhui.ts : zéro tiret cadratin, zéro émoji, aucune mention d'IA, aucun échappement unicode", () => {
    const code = readFileSync(join(SRC, "config/textes/espace-aujourdhui.ts"), "utf8");
    expect(code).not.toMatch(/—/);
    expect(code).not.toMatch(/\p{Extended_Pictographic}/u);
    expect(code).not.toMatch(/\b(IA|intelligence artificielle)\b/);
    expect(code).not.toMatch(/\\u[0-9a-fA-F]{4}/);
  });
  it("migrations 19 à 21 : idempotentes par construction (IF NOT EXISTS, contraintes en bloc DO)", () => {
    for (const nom of ["19_reperage_humour_noir_s24", "20_espace_compte_s24", "21_espace_compteurs_s24"]) {
      const sql = readFileSync(join(SRC, "../prisma/migrations", nom, "migration.sql"), "utf8");
      const ordres = sql.split(";").map((o) => o.replace(/--.*$/gm, "").trim()).filter(Boolean);
      for (const o of ordres) {
        if (/^(CREATE TABLE|CREATE (UNIQUE )?INDEX|ALTER TABLE)/.test(o)) expect([nom, o]).toEqual([nom, expect.stringMatching(/IF NOT EXISTS/)]);
      }
      expect(sql).not.toMatch(/ADD CONSTRAINT(?![\s\S]*EXCEPTION WHEN duplicate_object)/);
    }
    expect(readFileSync(join(SRC, "../prisma/migrations/21_espace_compteurs_s24/migration.sql"), "utf8")).not.toMatch(/userId/);
  });
});
