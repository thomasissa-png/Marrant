/**
 * @jest-environment node
 *
 * Lot D10 (s24), suites du D9 : compteurs ANONYMES de l'espace (architecture v20 7.7 point 6 ; avis @legal
 * `docs/legal/espace-d9-mesure-s24.md` points 6 et 7) et durée de conservation de `UsageEvent` (point 3).
 * Règles codées et testées : a) jamais de lecture jour par jour sous 15 abonnés actifs ; b) liste fermée, aucune
 * clé croisée (formule, cap atteint, réponse « à l'aise ») ; c) ni IP, ni cookie, ni identifiant à l'écriture ni
 * dans le journal. Interrupteur simulé (jamais le code livré).
 */
import { readFileSync, readdirSync, statSync } from "fs";
import { join, relative } from "path";

jest.mock("@/lib/prisma", () => ({ prisma: {} }));

import {
  COMPTEURS_ANONYMES,
  agregerCompteurs,
  compterAnonyme,
  estCompteurAdmis,
  libellePeriode,
  periodeLecture,
  valeurBonus,
  type CompteurDb,
} from "@/lib/espace/compteurs";
import { DUREE_CONSERVATION_USAGE_MOIS, limiteConservation, purgerUsageEvents } from "@/lib/mesure/conservation-usage";

const SRC = join(__dirname, "..", "..");
const RACINE = join(SRC, "..");

function base() {
  const appels: unknown[] = [];
  const db: CompteurDb = {
    espaceCompteur: {
      upsert: jest.fn(async (a) => {
        appels.push(a);
        return {};
      }),
    },
  };
  return { db, appels };
}

describe("écriture d'un compteur anonyme", () => {
  const maintenant = new Date("2026-11-20T22:30:00Z");

  it("fermé : rien n'est écrit", async () => {
    const { db } = base();
    expect(await compterAnonyme({ cle: "ouverture", valeur: "cloche" }, { db, publie: false })).toBe(false);
    expect(db.espaceCompteur.upsert).not.toHaveBeenCalled();
  });

  it("ouvert : jour, clé, valeur et nombre, rien d'autre (aucun compte, aucune heure)", async () => {
    const { db, appels } = base();
    for (const valeur of ["cloche", "coin-humour-noir", "archive-lettres", "bonus-3"] as const) {
      expect(await compterAnonyme({ cle: "ouverture", valeur }, { db, publie: true, maintenant })).toBe(true);
    }
    expect(await compterAnonyme({ cle: "action", valeur: "replique-ecrite" }, { db, publie: true, maintenant })).toBe(true);
    const a = appels[0] as { where: { jour_cle_valeur: Record<string, unknown> }; create: Record<string, unknown>; update: Record<string, unknown> };
    expect(Object.keys(a.create).sort()).toEqual(["cle", "jour", "n", "valeur"]);
    expect(Object.keys(a.where.jour_cle_valeur).sort()).toEqual(["cle", "jour", "valeur"]);
    expect(a.update).toEqual({ n: { increment: 1 } });
    expect((a.create.jour as Date).toISOString()).toBe("2026-11-20T00:00:00.000Z");
  });

  it("b) hors liste fermée : rien n'est écrit", async () => {
    const { db } = base();
    const faux = [
      { cle: "ouverture", valeur: "bonus-6" },
      { cle: "ouverture", valeur: "cloche:annual" },
      { cle: "formule", valeur: "annual" },
      { cle: "aise", valeur: "PLAIRE" },
    ] as unknown as Parameters<typeof compterAnonyme>[0][];
    for (const c of faux) expect(await compterAnonyme(c, { db, publie: true })).toBe(false);
    expect(db.espaceCompteur.upsert).not.toHaveBeenCalled();
  });

  it("c) échec d'écriture : `false`, journal avec le seul nom de l'erreur", async () => {
    const erreur = jest.spyOn(console, "error").mockImplementation(() => undefined);
    const db: CompteurDb = { espaceCompteur: { upsert: jest.fn(async () => Promise.reject(Object.assign(new Error("compte u1 ip 1.2.3.4"), { name: "PrismaClientKnownRequestError" }))) } };
    expect(await compterAnonyme({ cle: "ouverture", valeur: "cloche" }, { db, publie: true })).toBe(false);
    const ecrit = erreur.mock.calls.flat().map(String).join("\n");
    expect(ecrit).toContain("PrismaClientKnownRequestError");
    expect(ecrit).not.toMatch(/u1|1\.2\.3\.4/);
    erreur.mockRestore();
  });
});

describe("b) liste fermée, aucune clé croisée", () => {
  it("clés et valeurs : ni formule, ni cap atteint, ni réponse « à l'aise », ni séparateur de croisement", () => {
    expect(Object.keys(COMPTEURS_ANONYMES).sort()).toEqual(["action", "ouverture", "toucher", "une-autre"]);
    const valeurs = Object.values(COMPTEURS_ANONYMES).flat();
    for (const v of valeurs) {
      expect(v).toMatch(/^[a-z]+(-[a-z0-9]+)*$/);
      expect(v).not.toMatch(/month|year|annuel|mensuel|formule|cap-|potes|plaire|partout|aise/i);
    }
    expect(estCompteurAdmis("ouverture", "bonus-5")).toBe(true);
    expect(estCompteurAdmis("constructor", "x")).toBe(false);
    expect(valeurBonus(2)).toBe("bonus-2");
    expect(valeurBonus(7)).toBeNull();
  });
});

describe("a) lecture : jamais jour par jour sous 15 abonnés actifs", () => {
  const lignes = [
    { jour: new Date("2026-11-16T00:00:00Z"), cle: "ouverture", valeur: "cloche", n: 1 },
    { jour: new Date("2026-11-18T00:00:00Z"), cle: "ouverture", valeur: "cloche", n: 2 },
    { jour: new Date("2026-11-23T00:00:00Z"), cle: "ouverture", valeur: "cloche", n: 1 },
    { jour: new Date("2026-11-18T00:00:00Z"), cle: "intrus", valeur: "x", n: 9 },
  ];
  it("14 abonnés : par semaine (lundi), lignes hors liste ignorées", () => {
    expect(periodeLecture(14)).toBe("semaine");
    expect(agregerCompteurs(lignes, 14)).toEqual([
      { periode: "semaine du 16/11/2026", cle: "ouverture", valeur: "cloche", n: 3 },
      { periode: "semaine du 23/11/2026", cle: "ouverture", valeur: "cloche", n: 1 },
    ]);
  });
  it("15 abonnés : jour par jour permis", () => {
    expect(periodeLecture(15)).toBe("jour");
    expect(agregerCompteurs(lignes, 15).map((l) => l.periode)).toEqual(["16/11/2026", "18/11/2026", "23/11/2026"]);
    expect(libellePeriode(new Date("2026-11-22T00:00:00Z"), "semaine")).toBe("semaine du 16/11/2026");
  });
});

describe("c) sources : aucun identifiant, aucune IP, aucun cookie passés aux compteurs", () => {
  const fichiers = (d: string): string[] => readdirSync(d).flatMap((e) => (statSync(join(d, e)).isDirectory() ? fichiers(join(d, e)) : [join(d, e)]));
  it("chaque appel de `compterAnonyme` ne reçoit qu'une clé et une valeur fermées", () => {
    const appels = fichiers(SRC)
      .filter((f) => /\.(ts|tsx)$/.test(f) && !f.includes("__tests__"))
      .flatMap((f) => [...readFileSync(f, "utf8").matchAll(/compterAnonyme\(([^;]*?)\);/g)].map((m) => [relative(SRC, f), m[1]]));
    expect(appels.length).toBeGreaterThanOrEqual(6);
    for (const [, args] of appels) expect(args).not.toMatch(/userId|garde\.|ip|cookie|headers|session/i);
  });
  it("le module des compteurs ne lit ni en-têtes, ni cookies, ni IP", () => {
    const code = readFileSync(join(SRC, "lib/espace/compteurs.ts"), "utf8").replace(/\/\*[\s\S]*?\*\//g, "");
    expect(code).not.toMatch(/headers\(|cookies\(|x-forwarded|cf-connecting|userId/);
  });
  it("D10 : plus aucun `cloche_ouverte`, `bonus_ouvert`, `replique_ecrite`, `question_envoyee` écrit dans le code", () => {
    const code = fichiers(SRC)
      .filter((f) => /\.(ts|tsx)$/.test(f) && !f.includes("__tests__"))
      .map((f) => readFileSync(f, "utf8").replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, ""))
      .join("\n");
    expect(code).not.toMatch(/"(cloche_ouverte|bonus_ouvert|replique_ecrite|question_envoyee)"/);
  });
});

describe("durée de conservation de `UsageEvent` (constante unique, 13 mois validés par Thomas le 13/11)", () => {
  it("13 mois, limite calculée en UTC", () => {
    expect(DUREE_CONSERVATION_USAGE_MOIS).toBe(13);
    expect(limiteConservation(new Date("2027-12-20T10:00:00Z")).toISOString()).toBe("2026-11-20T10:00:00.000Z");
  });
  it("lecture seule par défaut ; `ecrire` efface avant la limite", async () => {
    const db = { usageEvent: { count: jest.fn(async () => 4), deleteMany: jest.fn(async () => ({ count: 4 })) } };
    const maintenant = new Date("2027-12-20T10:00:00Z");
    expect(await purgerUsageEvents(db, { maintenant })).toBe(4);
    expect(db.usageEvent.deleteMany).not.toHaveBeenCalled();
    expect(await purgerUsageEvents(db, { maintenant, ecrire: true })).toBe(4);
    expect(db.usageEvent.deleteMany).toHaveBeenCalledWith({ where: { occurredAt: { lt: new Date("2026-11-20T10:00:00Z") } } });
  });
  // Lot D10b (décision de la session) : la purge est programmée par le planificateur existant, inerte fermé ;
  // le détail est testé dans `purge-usage-d10b-s24.test.ts`. Ici : seul ce planificateur l'appelle.
  it("la purge n'est programmée que par le planificateur existant (ni route, ni autre cron)", () => {
    const code = fichiers(SRC)
      .filter((f) => /\.(ts|tsx)$/.test(f) && !f.includes("__tests__") && !f.endsWith("conservation-usage.ts") && !f.endsWith("scheduler/jobs.ts"))
      .map((f) => readFileSync(f, "utf8"))
      .join("\n");
    expect(code).not.toContain("purgerUsageEvents");
    expect(readFileSync(join(RACINE, "scripts/purger-usage-events.ts"), "utf8")).toContain('process.argv.includes("--ecrire")');
  });

  const fichiers = (d: string): string[] => readdirSync(d).flatMap((e) => (statSync(join(d, e)).isDirectory() ? fichiers(join(d, e)) : [join(d, e)]));
});
