/**
 * @jest-environment node
 *
 * Espace client, lot D5 (s24), côté serveur, interrupteur OUVERT (simulé ici, jamais le code livré) :
 * réponses aux cartes (double clic = une ligne, hors rafale refusé), note renvoyée APRÈS la réponse,
 * « Fait », missions, « Ma réplique à moi » (une par fiche, plafond, vide refusé, lecture seule après la
 * résiliation, suppression acceptée), aucune trace du texte (journaux, `UsageEvent`, Umami), ni série ni
 * XP. Base simulée en mémoire ; contenu : fixtures (jamais servies).
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

type Ligne = Record<string, unknown>;
const tables: Record<string, Ligne[]> = {};
const t = (n: string) => (tables[n] ??= []);
let seq = 0;
const egal = (l: Ligne, where: Record<string, unknown>): boolean =>
  Object.entries(where).every(([k, v]) => {
    if (v && typeof v === "object" && !(v instanceof Date)) {
      const o = v as Record<string, unknown>;
      if ("gte" in o) return (l[k] as Date) >= (o.gte as Date);
      if (k.includes("_")) return egal(l, o);
      return true;
    }
    return l[k] === v;
  });
function modele(nom: string) {
  return {
    findMany: jest.fn(async (a: { where?: Record<string, unknown> } = {}) => t(nom).filter((l) => egal(l, a.where ?? {}))),
    findUnique: jest.fn(async (a: { where: Record<string, unknown> }) => t(nom).find((l) => egal(l, a.where)) ?? null),
    count: jest.fn(async (a: { where?: Record<string, unknown> } = {}) => t(nom).filter((l) => egal(l, a.where ?? {})).length),
    create: jest.fn(async (a: { data: Ligne }) => {
      // Unicité (compte, clé) comme en base : le second d'un double clic échoue en P2002.
      if (a.data.cle && t(nom).some((x) => x.userId === a.data.userId && x.cle === a.data.cle)) throw Object.assign(new Error("unique"), { code: "P2002" });
      const l = { id: `id${++seq}`, creeLe: new Date(), choixJuste: null, ...a.data };
      t(nom).push(l);
      return l;
    }),
    update: jest.fn(async (a: { where: Record<string, unknown>; data: Ligne }) => {
      const l = t(nom).find((x) => egal(x, a.where))!;
      Object.assign(l, a.data);
      return l;
    }),
    updateMany: jest.fn(async () => ({ count: 0 })),
    // Lot D7 : premier pas figé au « Fait » (`figerPremierPas`).
    createMany: jest.fn(async () => ({ count: 1 })),
    upsert: jest.fn(async (a: { where: Record<string, unknown>; create: Ligne; update: Ligne }) => {
      const l = t(nom).find((x) => egal(x, a.where));
      if (l) {
        for (const [k, v] of Object.entries(a.update)) l[k] = v && typeof v === "object" && "increment" in (v as object) ? (l[k] as number) + 1 : v;
        return l;
      }
      const n = { id: `id${++seq}`, nbRevues: 0, nbRates: 0, ...a.create };
      t(nom).push(n);
      return n;
    }),
    deleteMany: jest.fn(async (a: { where: Record<string, unknown> }) => {
      const avant = t(nom).length;
      tables[nom] = t(nom).filter((l) => !egal(l, a.where));
      return { count: avant - t(nom).length };
    }),
  };
}
const plan = { valeur: "PREMIUM" as string, ancien: false };
const mockDb = {
  user: {
    findUnique: jest.fn(async (a: { select: Record<string, unknown> }) =>
      "plan" in a.select
        ? { plan: plan.valeur, subscription: plan.ancien ? { stripeSubscriptionId: "sub_1" } : null }
        : { subscription: { createdAt: new Date("2026-11-01T10:00:00Z") }, espaceCompte: null },
    ),
    update: jest.fn(),
  },
  carteSuivi: modele("carteSuivi"),
  carteReponse: modele("carteReponse"),
  ficheFait: modele("ficheFait"),
  missionRetour: modele("missionRetour"),
  userReplique: modele("userReplique"),
  espaceCompte: modele("espaceCompte"),
  usageEvent: modele("usageEvent"),
  // Lot D10 : réplique nouvelle = compteur anonyme (aucun compte).
  espaceCompteur: modele("espaceCompteur"),
  // Lot D9 : opposition à la mesure lue avant chaque écriture (aucune ici).
  webhookEvent: { findUnique: jest.fn(async () => null) },
  $transaction: jest.fn(async (ops: Promise<unknown>[]) => Promise.all(ops)),
};
jest.mock("@/lib/prisma", () => ({ get prisma() { return mockDb; } }));
jest.mock("@/config/espace-client", () => ({ ...jest.requireActual("@/config/espace-client"), ESPACE_CLIENT_PUBLIE: true }));
const getServerSession = jest.fn();
jest.mock("next-auth", () => ({ getServerSession: (...a: unknown[]) => getServerSession(...a) }));
jest.mock("@/lib/auth", () => ({ authOptions: {} }));
jest.mock("@/lib/rate-limit", () => ({ sharedRateLimit: jest.fn(async () => ({ allowed: true, remaining: 1, resetAt: 0 })), retryAfterSeconds: () => 1 }));
const recordPractice = jest.fn();
jest.mock("@/lib/progression", () => ({ ...jest.requireActual("@/lib/progression"), recordPractice: (...a: unknown[]) => recordPractice(...a) }));
jest.mock("@/data/espace/missions.json", () => jest.requireActual("@/lib/espace/fixtures/missions.json"));
jest.mock("@/lib/espace/fiches", () => {
  const reel = jest.requireActual("@/lib/espace/fiches");
  const vide = Object.fromEntries(
    ["situations", "constructions", "vocabulaire", "formules", "ecouter", "a-plat", "jeux", "bilans", "seances", "humour-noir"].map((n) => [n, []]),
  );
  return {
    ...reel,
    chargeursFiches: reel.creerChargeurs({
      fiches: {
        ...vide,
        situations: [jest.requireActual("@/lib/espace/fixtures/situation-coloc-la-poele.json"), jest.requireActual("@/lib/espace/fixtures/situation-rencontre-le-retard.json")],
      },
      bonus: [],
    }),
  };
});

import { POST as repondre } from "@/app/api/espace/carte/[id]/reponse/route";
import { GET as cartes } from "@/app/api/espace/cartes/route";
import { POST as ficheFait } from "@/app/api/espace/fiche-fait/route";
import { PUT as ecrire, DELETE as effacer } from "@/app/api/espace/replique/route";
import { GET as lister } from "@/app/api/espace/repliques/route";
import { POST as retourMission } from "@/app/api/espace/mission/retour/route";
import { auMoinsUneFicheFaite } from "@/lib/espace/fiche-fait";

const req = (corps: unknown, methode = "POST", url = "http://localhost/api/espace/x") =>
  new Request(url, { method: methode, body: JSON.stringify(corps), headers: { "Content-Type": "application/json" } });
const CLE = "cle-test-0001";
const SECRET = "Ma phrase secrète, à ne jamais journaliser";

let journal: jest.SpyInstance[] = [];
beforeEach(() => {
  for (const k of Object.keys(tables)) delete tables[k];
  jest.clearAllMocks();
  plan.valeur = "PREMIUM";
  plan.ancien = false;
  getServerSession.mockResolvedValue({ user: { id: "u1" } });
  journal = (["log", "info", "warn", "error", "debug"] as const).map((m) => jest.spyOn(console, m).mockImplementation(() => undefined));
});
afterEach(() => {
  const ecrit = journal.flatMap((s) => s.mock.calls.flat().map((x) => String(x)));
  expect(ecrit.join("\n")).not.toContain(SECRET);
  for (const s of journal) s.mockRestore();
});

describe("cartes de la rafale", () => {
  it("rafale du jour : la situation d'entrée (contexte 1), « Nouvelle »", async () => {
    const corps = await (await cartes()).json();
    expect(corps.cartes).toEqual([{ id: "coloc-la-poele.c1", titre: "Coloc : la poêle", nouvelle: true, autreContexte: false }]);
    expect(corps.fini).toBe(false);
  });

  it("double clic : une seule ligne `CarteReponse` (clé d'idempotence)", async () => {
    const params = { params: { id: "coloc-la-poele.c1" } };
    const [a, b] = await Promise.all([repondre(req({ cle: CLE, reponse: "OUI" }), params), repondre(req({ cle: CLE, reponse: "OUI" }), params)]);
    expect([a.status, b.status]).toEqual([200, 200]);
    await repondre(req({ cle: CLE, reponse: "OUI" }), params);
    expect(t("carteReponse")).toHaveLength(1);
    expect(t("carteSuivi")).toHaveLength(1);
  });

  it("carte hors de la rafale du jour : 409 ; carte inconnue : 404 ; valeur hors liste : 400", async () => {
    expect((await repondre(req({ cle: CLE, reponse: "OUI" }), { params: { id: "coloc-la-poele.c2" } })).status).toBe(409);
    expect((await repondre(req({ cle: CLE, reponse: "OUI" }), { params: { id: "inconnue.c1" } })).status).toBe(404);
    expect((await repondre(req({ cle: CLE, reponse: "PEUT-ETRE" }), { params: { id: "coloc-la-poele.c1" } })).status).toBe(400);
  });

  it("« Rien » : retour à J+2 ; choix raté : J+2 ; choix juste enregistré une seule fois", async () => {
    const params = { params: { id: "coloc-la-poele.c1" } };
    await repondre(req({ cle: CLE, reponse: "RIEN" }), params);
    const due = (t("carteSuivi")[0].dueLe as Date).getTime() - Date.now();
    expect(Math.round(due / 86_400_000)).toBe(2);
    const choix = await (await repondre(req({ cle: CLE, choix: "sure" }), params)).json();
    expect(choix).toEqual({ ok: true, juste: false });
    expect(t("carteSuivi")[0].nbRates).toBe(1);
    const encore = await (await repondre(req({ cle: CLE, choix: "joueuse" }), params)).json();
    expect(encore.juste).toBe(false);
  });

  it("la réponse ne touche ni la série (`recordPractice`) ni les XP ni le cap", async () => {
    await repondre(req({ cle: CLE, reponse: "OUI" }), { params: { id: "coloc-la-poele.c1" } });
    expect(recordPractice).not.toHaveBeenCalled();
    expect(mockDb.user.update).not.toHaveBeenCalled();
    expect(await auMoinsUneFicheFaite("u1")).toBe(true);
  });

  it("la note de l'abonné n'arrive qu'avec la réponse ; « Ta réplique la dernière fois » en révision", async () => {
    t("userReplique").push({ userId: "u1", ficheId: "coloc-la-poele", texte: SECRET, modifieLe: new Date() });
    const premiere = await (await cartes()).json();
    expect(JSON.stringify(premiere)).not.toContain(SECRET);
    const corps = await (await repondre(req({ cle: CLE, reponse: "OUI" }), { params: { id: "coloc-la-poele.c1" } })).json();
    expect(corps).toMatchObject({ revision: false, replique: SECRET });
  });
});

describe("« Fait » par fiche", () => {
  it("« Essayé, bof » pose Fait, « Pas essayé » le retire ; fiche sans geste ou inconnue : 404", async () => {
    expect((await ficheFait(req({ ficheId: "coloc-la-poele", retour: "essaye-bof" }))).status).toBe(200);
    expect(t("ficheFait")).toHaveLength(1);
    await ficheFait(req({ ficheId: "coloc-la-poele", retour: "essaye-ca-a-marche" }));
    expect(t("ficheFait")).toHaveLength(1);
    await ficheFait(req({ ficheId: "coloc-la-poele", retour: "pas-essaye" }));
    expect(t("ficheFait")).toHaveLength(0);
    expect((await ficheFait(req({ ficheId: "inconnue", retour: "essaye-bof" }))).status).toBe(404);
  });
});

describe("« Ma réplique à moi »", () => {
  it("une réplique par fiche (la seconde remplace), longueur maximale, vide refusé", async () => {
    expect((await ecrire(req({ ficheId: "coloc-la-poele", texte: "Première" }, "PUT"))).status).toBe(200);
    expect((await ecrire(req({ ficheId: "coloc-la-poele", texte: SECRET }, "PUT"))).status).toBe(200);
    expect(t("userReplique")).toHaveLength(1);
    expect(t("userReplique")[0].texte).toBe(SECRET);
    expect((await ecrire(req({ ficheId: "coloc-la-poele", texte: "x".repeat(201) }, "PUT"))).status).toBe(400);
    expect((await ecrire(req({ ficheId: "coloc-la-poele", texte: "   " }, "PUT"))).status).toBe(400);
    expect((await ecrire(req({ ficheId: "inconnue", texte: "Une phrase" }, "PUT"))).status).toBe(404);
  });

  it("après la résiliation : lecture seule (ajout et modification refusés), suppression acceptée", async () => {
    t("userReplique").push({ userId: "u1", ficheId: "coloc-la-poele", texte: SECRET, modifieLe: new Date() });
    plan.valeur = "FREE";
    plan.ancien = true;
    expect((await ecrire(req({ ficheId: "coloc-la-poele", texte: "Autre" }, "PUT"))).status).toBe(403);
    const liste = await (await lister(new Request("http://localhost/api/espace/repliques"))).json();
    expect(liste).toMatchObject({ lectureSeule: true, repliques: [{ ficheId: "coloc-la-poele", texte: SECRET }] });
    expect((await effacer(req({ ficheId: "coloc-la-poele" }, "DELETE"))).status).toBe(200);
    expect(t("userReplique")).toHaveLength(0);
  });

  it("compte jamais abonné : 403 partout", async () => {
    plan.valeur = "FREE";
    expect((await effacer(req({ ficheId: "coloc-la-poele" }, "DELETE"))).status).toBe(403);
    expect((await lister(new Request("http://localhost/api/espace/repliques"))).status).toBe(403);
  });

  it("ligne « pour {catégorie} » : seulement les fiches de l'univers correspondant", async () => {
    t("userReplique").push({ userId: "u1", ficheId: "rencontre-le-retard", texte: "Au rencard", modifieLe: new Date() });
    t("userReplique").push({ userId: "u1", ficheId: "coloc-la-poele", texte: "En coloc", modifieLe: new Date() });
    const rencard = await (await lister(new Request("http://localhost/api/espace/repliques?categorie=rencard"))).json();
    expect(rencard.repliques.map((r: { texte: string }) => r.texte)).toEqual(["Au rencard"]);
    const soiree = await (await lister(new Request("http://localhost/api/espace/repliques?categorie=soiree"))).json();
    expect(soiree.repliques).toEqual([]);
  });

  it("le texte n'est jamais écrit ailleurs que dans `UserReplique` ; D10 : réplique NOUVELLE = compteur anonyme, sans compte", async () => {
    await ecrire(req({ ficheId: "coloc-la-poele", texte: SECRET }, "PUT"));
    await ecrire(req({ ficheId: "coloc-la-poele", texte: `${SECRET} bis` }, "PUT"));
    expect(mockDb.usageEvent.create).not.toHaveBeenCalled();
    expect(mockDb.espaceCompteur.upsert).toHaveBeenCalledTimes(1);
    const compteur = mockDb.espaceCompteur.upsert.mock.calls[0][0] as { create: Record<string, unknown> };
    expect(compteur.create).toMatchObject({ cle: "action", valeur: "replique-ecrite", n: 1 });
    expect(Object.keys(compteur.create).sort()).toEqual(["cle", "jour", "n", "valeur"]);
    expect(JSON.stringify(mockDb.espaceCompteur.upsert.mock.calls)).not.toMatch(/u1|coloc-la-poele/);
    const autres = Object.entries(tables).filter(([n]) => n !== "userReplique");
    expect(JSON.stringify(autres)).not.toContain(SECRET);
  });

  it("erreur de base : 503, journal sans le texte", async () => {
    mockDb.userReplique.upsert.mockRejectedValueOnce(Object.assign(new Error(`échec avec ${SECRET}`), { code: "P2002" }));
    expect((await ecrire(req({ ficheId: "coloc-la-poele", texte: SECRET }, "PUT"))).status).toBe(503);
    expect(journal[3].mock.calls.flat().join(" ")).toContain("P2002");
  });
});

describe("missions", () => {
  it("retour enregistré une fois par clé ; deux « Pas essayé » : marche d'en dessous", async () => {
    const corps = { missionId: "confiance-faux-secret-message", retour: "pas-essaye" };
    await retourMission(req({ ...corps, cle: "mission-cle-1" }));
    await retourMission(req({ ...corps, cle: "mission-cle-1" }));
    expect(t("missionRetour")).toHaveLength(1);
    const r = await (await retourMission(req({ ...corps, cle: "mission-cle-2" }))).json();
    expect(r).toMatchObject({ suite: "pas2", marche: 1 });
    expect((await retourMission(req({ ...corps, missionId: "inconnue", cle: "mission-cle-3" }))).status).toBe(404);
  });
});

describe("confinement des répliques (2.7)", () => {
  const SRC = join(__dirname, "../..");
  const fichiers = (d: string): string[] =>
    readdirSync(d).flatMap((f) => (statSync(join(d, f)).isDirectory() ? fichiers(join(d, f)) : [join(d, f)]));

  it("aucun fichier de l'outil d'admin ne lit `UserReplique` ni la bibliothèque des répliques", () => {
    const admin = fichiers(SRC).filter((f) => /(^|\/)(api\/admin|admin)\//.test(relative(SRC, f)));
    expect(admin.length).toBeGreaterThan(0);
    for (const f of admin) expect(readFileSync(f, "utf8")).not.toMatch(/userReplique|UserReplique|lib\/espace\/repliques/);
  });

  it("aucun envoi Umami ni `UsageEvent` dans le code des répliques", () => {
    const code = fichiers(SRC)
      .filter((f) => /(repliques?|note-replique|liste-repliques|replique)/.test(f) && !f.includes("__tests__"))
      .map((f) => readFileSync(f, "utf8"))
      .join("\n");
    // Appels réels seulement (les commentaires citent la règle) : tracker Umami, table `UsageEvent`, mesure d'usage.
    // Lot D10 : seul le compteur anonyme de l'espace est admis (`lib/espace/compteurs`, test ci-dessus).
    expect(code).not.toMatch(/umami\.track|window\.umami|\.usageEvent\.|@\/lib\/mesure\/|@\/lib\/analytics\//);
  });
});
