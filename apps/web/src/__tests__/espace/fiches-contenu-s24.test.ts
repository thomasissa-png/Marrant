/**
 * @jest-environment node
 *
 * Lot D1 de l'espace client (s24, `docs/espace-client/plan-developpement-s24.md` §3) : schéma
 * des fiches, fichiers servis, règles d'écriture, geste, bonus hors de toute liste, chargeurs
 * passés par `champs-premium`, fixtures jamais servies.
 *
 * Fixtures (`lib/espace/fixtures/`) : B1 de `docs/copy/espace/qr1-situations.md` et fiche 2 de
 * `docs/copy/espace/c1a-comment-c-est-construit.md`, textes mot pour mot (guillemets extérieurs
 * retirés). [HYPOTHÈSE de fixture] palier P2 et 5 minutes pour les deux (architecture 3.2 et 4.2 ;
 * non écrits dans les fichiers de copy). La fixture de bonus est factice.
 */
import { readdirSync, readFileSync, statSync } from "fs";
import { join, relative } from "path";
import type { AccesEspace } from "@/lib/espace/garde";
import {
  FICHIERS_ESPACE,
  FICHIER_BONUS,
  bonusSchema,
  ficheSchema,
  problemeGeste,
  validerBonus,
  validerFichier,
  type Fiche,
  type FicheBonus,
} from "@/lib/espace/fiches-schema";
import { SOURCES_SERVIES, creerChargeurs, type SourcesFiches } from "@/lib/espace/fiches";
import situationB1 from "@/lib/espace/fixtures/situation-rencontre-le-retard.json";
import constructionFiche2 from "@/lib/espace/fixtures/construction-la-regle-de-trois.json";
import bonusFactice from "@/lib/espace/fixtures/bonus-factice-cap-2.json";

const SRC = join(__dirname, "..", "..");
const DATA = join(SRC, "data", "espace");
const FIXTURES = join(SRC, "lib", "espace", "fixtures");
const TIRET_CADRATIN = "—";
/** Concurrents nommés dans `project-context.md` (l. 33) ; règle commune n°9. */
const CONCURRENTS = ["cours florent", "poisson fécond", "charisma on command"];

const lireJson = (chemin: string): unknown => JSON.parse(readFileSync(chemin, "utf8"));
const jsonDe = (dossier: string) => readdirSync(dossier).filter((f) => f.endsWith(".json")).map((f) => join(dossier, f));
const cloner = <T>(v: T): T => JSON.parse(JSON.stringify(v)) as T;

function textes(v: unknown): string[] {
  if (typeof v === "string") return [v];
  if (Array.isArray(v)) return v.flatMap(textes);
  if (v && typeof v === "object") return Object.values(v).flatMap(textes);
  return [];
}

const ABONNE: AccesEspace = { acces: "ouvert", userId: "u1" };
const NON_PREMIUM: AccesEspace[] = [
  { acces: "connexion" },
  { acces: "abonnement", userId: "u2", ancienAbonne: false },
  { acces: "abonnement", userId: "u3", ancienAbonne: true },
];

function sourcesFixtures(): SourcesFiches {
  const fiches = Object.fromEntries(Object.keys(FICHIERS_ESPACE).map((nom) => [nom, []])) as unknown as SourcesFiches["fiches"];
  return { fiches: { ...fiches, situations: [situationB1], constructions: [constructionFiche2] }, bonus: [bonusFactice] };
}

describe("fichiers servis (src/data/espace)", () => {
  it("un fichier par type, plus les bonus, et rien d'autre", () => {
    const attendus = [...Object.keys(FICHIERS_ESPACE), FICHIER_BONUS].map((n) => `${n}.json`).sort();
    expect(readdirSync(DATA).sort()).toEqual(attendus);
  });

  it.each(Object.entries(FICHIERS_ESPACE))("%s.json respecte le schéma de son type", (nom, type) => {
    expect(() => validerFichier(type, lireJson(join(DATA, `${nom}.json`)))).not.toThrow();
  });

  it("bonus.json respecte le schéma des bonus", () => {
    expect(() => validerBonus(lireJson(join(DATA, `${FICHIER_BONUS}.json`)))).not.toThrow();
  });

  it("les chargeurs de production valident tout le contenu servi", () => {
    expect(() => creerChargeurs(SOURCES_SERVIES).listerFiches("situation", ABONNE)).not.toThrow();
  });
});

describe("règles d'écriture sur tous les JSON (servis et fixtures)", () => {
  const fichiers = [...jsonDe(DATA), ...jsonDe(FIXTURES)];
  it.each(fichiers.map((f) => [relative(SRC, f), f]))("%s : aucun tiret cadratin, aucun émoji, aucun concurrent", (_n, f) => {
    for (const t of textes(lireJson(f))) {
      expect(t).not.toContain("—");
      expect(t).not.toMatch(/\p{Extended_Pictographic}/u);
      for (const c of CONCURRENTS) expect(t.toLowerCase()).not.toContain(c);
    }
  });
});

describe("le schéma colle au contenu réel (fixtures)", () => {
  it("la situation B1 de QR1 et la fiche 2 de C1a sont valides", () => {
    expect(ficheSchema.safeParse(situationB1).success).toBe(true);
    expect(ficheSchema.safeParse(constructionFiche2).success).toBe(true);
    expect(bonusSchema.safeParse(bonusFactice).success).toBe(true);
  });

  it("une situation exige trois répliques avec leur pourquoi et deux contextes de rafale au moins", () => {
    const sansPourquoi = cloner(situationB1) as { contenu: { repliques: { risquee: { pourquoi?: string } } } };
    delete sansPourquoi.contenu.repliques.risquee.pourquoi;
    expect(ficheSchema.safeParse(sansPourquoi).success).toBe(false);
    const unContexte = cloner(situationB1);
    unContexte.contenu.contextesRafale = unContexte.contenu.contextesRafale.slice(0, 1);
    expect(ficheSchema.safeParse(unContexte).success).toBe(false);
  });

  it("un contexte de rafale a une seule bonne réponse, parmi sûre, joueuse, risquée", () => {
    const deux = cloner(situationB1) as unknown as { contenu: { contextesRafale: { bonneReponse: unknown }[] } };
    deux.contenu.contextesRafale[0].bonneReponse = ["sure", "joueuse"];
    expect(ficheSchema.safeParse(deux).success).toBe(false);
  });

  it("un id qui n'est pas stable (majuscules, espaces) est refusé", () => {
    expect(ficheSchema.safeParse({ ...cloner(situationB1), id: "Le retard" }).success).toBe(false);
  });

  it("Écouter : citation vérifiée, transcription par une personne, fin après le début", () => {
    const base = { ...cloner(bonusFactice), type: "ecouter", palier: "P3" } as Record<string, unknown> & typeof bonusFactice;
    delete (base as Record<string, unknown>).nature;
    delete (base as Record<string, unknown>).cap;
    expect(ficheSchema.safeParse(base).success).toBe(true);
    const sansVerif = cloner(base);
    delete (sansVerif.contenu.citations[0] as { citationVerifieePar?: string }).citationVerifieePar;
    expect(ficheSchema.safeParse(sansVerif).success).toBe(false);
    const sansTranscription = cloner(base);
    delete (sansTranscription.contenu as { transcritePar?: string }).transcritePar;
    expect(ficheSchema.safeParse(sansTranscription).success).toBe(false);
    const aRebours = cloner(base);
    aRebours.contenu.passage.fin = { minute: 0, seconde: 5 };
    expect(ficheSchema.safeParse(aRebours).success).toBe(false);
  });

  it("un fichier refuse une fiche d'un autre type et un id en double", () => {
    expect(() => validerFichier("construction", [situationB1])).toThrow();
    expect(() => validerFichier("situation", [situationB1, situationB1])).toThrow();
  });
});

describe("toute fiche à geste porte son geste", () => {
  const servies = Object.entries(FICHIERS_ESPACE).flatMap(([nom, type]) => validerFichier(type, lireJson(join(DATA, `${nom}.json`))));
  const bonus = validerBonus(lireJson(join(DATA, `${FICHIER_BONUS}.json`)));
  const fixtures: (Fiche | FicheBonus)[] = [ficheSchema.parse(situationB1), ficheSchema.parse(constructionFiche2), bonusSchema.parse(bonusFactice)];

  it("fiches servies, bonus et fixtures : geste présent et admis pour leur type", () => {
    expect([...servies, ...bonus, ...fixtures].map(problemeGeste).filter(Boolean)).toEqual([]);
  });

  it("une fiche sans geste, ou avec un geste d'un autre type, est refusée", () => {
    const sansGeste = cloner(situationB1) as { geste?: unknown };
    delete sansGeste.geste;
    expect(ficheSchema.safeParse(sansGeste).success).toBe(false);
    expect(ficheSchema.safeParse({ ...cloner(situationB1), geste: { ...situationB1.geste, verbe: "ecrire" } }).success).toBe(false);
  });

  it("Comment c'est construit exige sa grille de 3 questions", () => {
    const sansGrille = cloner(constructionFiche2) as { geste: { grille?: unknown } };
    delete sansGrille.geste.grille;
    expect(ficheSchema.safeParse(sansGrille).success).toBe(false);
  });
});

describe("un bonus n'est dans aucune liste", () => {
  it("aucun id de bonus.json n'apparaît dans un fichier de fiches", () => {
    const idsBonus = new Set(validerBonus(lireJson(join(DATA, `${FICHIER_BONUS}.json`))).map((b) => b.id));
    const idsListes = Object.keys(FICHIERS_ESPACE).flatMap((nom) => textes(lireJson(join(DATA, `${nom}.json`))));
    expect(idsListes.filter((t) => idsBonus.has(t))).toEqual([]);
  });

  it("les listes et la recherche par id ne servent jamais un bonus", () => {
    const c = creerChargeurs(sourcesFixtures());
    const listes = Object.values(FICHIERS_ESPACE).flatMap((type) => c.listerFiches(type, ABONNE));
    expect(listes.map((f) => f.id)).toEqual(["rencontre-le-retard", "la-regle-de-trois"]);
    expect(c.trouverFiche("fixture-bonus-cap-2", ABONNE)).toBeNull();
  });

  it("un bonus n'est servi qu'une fois son cap atteint, sinon introuvable", () => {
    const c = creerChargeurs(sourcesFixtures());
    expect(c.bonusOuverts(1, ABONNE)).toEqual([]);
    expect(c.trouverBonus("fixture-bonus-cap-2", 1, ABONNE)).toBeNull();
    expect(c.bonusOuverts(2, ABONNE).map((b) => b.id)).toEqual(["fixture-bonus-cap-2"]);
    expect(c.trouverBonus("fixture-bonus-cap-2", 5, ABONNE)?.cap).toBe(2);
  });

  it("un bonus glissé dans une liste fait échouer le chargement", () => {
    const s = sourcesFixtures();
    const doublon = { ...cloner(constructionFiche2), id: "fixture-bonus-cap-2" };
    const c = creerChargeurs({ ...s, fiches: { ...s.fiches, constructions: [constructionFiche2, doublon] } });
    expect(() => c.listerFiches("situation", ABONNE)).toThrow(/Bonus de cap/);
  });

  it("deux bonus pour le même cap sont refusés", () => {
    expect(() => validerBonus([bonusFactice, { ...cloner(bonusFactice), id: "autre-bonus" }])).toThrow();
  });
});

describe("chargeurs : passage par champs-premium", () => {
  it("abonné actif : fiches servies", () => {
    const c = creerChargeurs(sourcesFixtures());
    expect(c.listerFiches("situation", ABONNE)).toHaveLength(1);
    expect(c.trouverFiche("la-regle-de-trois", ABONNE)?.type).toBe("construction");
  });

  it.each(NON_PREMIUM.map((a) => [a.acces, a]))("compte %s : aucune fiche, aucun bonus", (_n, acces) => {
    const c = creerChargeurs(sourcesFixtures());
    for (const type of Object.values(FICHIERS_ESPACE)) expect(c.listerFiches(type, acces)).toEqual([]);
    expect(c.trouverFiche("rencontre-le-retard", acces)).toBeNull();
    expect(c.bonusOuverts(5, acces)).toEqual([]);
    expect(c.trouverBonus("fixture-bonus-cap-2", 5, acces)).toBeNull();
  });

  it("un contenu invalide n'échoue qu'au premier appel, jamais au chargement du module", () => {
    const s = sourcesFixtures();
    const c = creerChargeurs({ ...s, fiches: { ...s.fiches, situations: [{ id: "x" }] } });
    expect(() => c.listerFiches("situation", ABONNE)).toThrow();
  });
});

describe("fixtures jamais servies, chargeurs confinés à l'espace", () => {
  function sources(dossier: string): string[] {
    return readdirSync(dossier).flatMap((entree) => {
      const chemin = join(dossier, entree);
      if (statSync(chemin).isDirectory()) return entree === "node_modules" ? [] : sources(chemin);
      return /\.(ts|tsx)$/.test(entree) ? [chemin] : [];
    });
  }
  const fichiers = sources(SRC).map((f) => [relative(SRC, f).split("\\").join("/"), readFileSync(f, "utf8")] as const);

  it("aucun fichier hors tests n'importe les fixtures", () => {
    const fautifs = fichiers.filter(([f, t]) => !f.startsWith("__tests__/") && /["'][^"'\n]*espace\/fixtures[^"'\n]*["']/.test(t)).map(([f]) => f);
    expect(fautifs).toEqual([]);
  });

  it("le contenu et les chargeurs ne sont importés que par lib/espace, /mon-espace, api/espace et les tests", () => {
    const permis = [/^lib\/espace\//, /^app\/\(dashboard\)\/mon-espace\//, /^app\/api\/espace\//, /^components\/espace\//, /^__tests__\//];
    const fautifs = fichiers
      .filter(([f]) => !permis.some((p) => p.test(f)))
      .filter(([, t]) => /["']@\/(data\/espace\/|lib\/espace\/fiches)/.test(t))
      .map(([f]) => f);
    expect(fautifs).toEqual([]);
  });
});
