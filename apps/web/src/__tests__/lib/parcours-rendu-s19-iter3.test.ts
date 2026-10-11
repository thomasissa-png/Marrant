/**
 * s19 (rendu itération 3) : coupe « Version sans risque » des 6 défis Boulot, typographie
 * (gluon après « Choisis- », « En 6 semaines ») et suite de fin (`pickSuite`, spec s17 §5.5).
 * Règle : affichage seul, le texte validé est restitué caractère pour caractère.
 */
import boulot from "../../../../../docs/content/parcours-boulot-s19.json";
import { decouperDefi, decouperRepli } from "@/components/parcours/parcours-step-card";
import { pickSuite } from "@/components/parcours/path-completion-card";
import { frTypo, frTypoParcours, frTypoTexte } from "@/lib/fr-typo";
import { publishedSeedJson } from "@/lib/parcours-seed";
import { tipProse } from "@/lib/tip-prose";

const NBSP = String.fromCharCode(0xa0);
const WJ = String.fromCharCode(0x2060);
const prose = (t: string) => frTypoParcours(tipProse(t));
const sansGluon = (t: string) => t.replaceAll(WJ, "");

/** Début attendu du repli, étape par étape (rendu-iter-2-ux.md §3, règle corrigée). */
const REPLIS: Array<[number, string]> = [
  [1, "Pas de réunion en vue, ou elle se passe en visio ?"],
  [2, "Pas de mail pro à envoyer aujourd'hui ?"],
  [3, "Pas de couloir aujourd'hui"],
  [4, "Pas d'afterwork à venir ?"],
  [5, "Personne ne te le demande aujourd'hui ?"],
  [6, "Aucun pot en vue ?"],
];
const DEFIS = boulot._meta.conseils.map((c) => c.exercise);

describe("Version sans risque : coupe au début de la dernière phrase interrogative (N4)", () => {
  it("les 6 défis Boulot : un seul « ? » hors citation", () => {
    expect(DEFIS).toHaveLength(6);
    for (const d of DEFIS) {
      const horsCitation = d.replace(/«[^»]*»/g, "");
      expect(horsCitation.split("?").length - 1).toBe(1);
    }
  });

  it.each(REPLIS)("étape %i : la coupe tombe sur « %s »", (etape, debut) => {
    for (const texte of [DEFIS[etape - 1], prose(DEFIS[etape - 1])]) {
      const parts = decouperRepli(texte);
      expect(parts).not.toBeNull();
      expect(parts![1].replaceAll(NBSP, " ").startsWith(debut)).toBe(true);
      // Concaténation = texte d'origine, au caractère près.
      expect(parts!.join("")).toBe(texte);
      // Le libellé « DÉFI X » reste dans la première partie.
      expect(decouperDefi(parts![0])).not.toBeNull();
    }
  });

  it("étape 5 : la question citée « tu fais quoi dans la vie ? » ne compte pas", () => {
    expect(DEFIS[4]).toContain("« tu fais quoi dans la vie ? »");
    expect(decouperRepli(DEFIS[4])![0]).toContain("« tu fais quoi dans la vie ? »");
  });

  it("zéro ou plus d'un « ? » hors citation : pas de coupe", () => {
    expect(decouperRepli("DÉFI X : écris une phrase. Dis-la.")).toBeNull();
    expect(decouperRepli("DÉFI X : prêt ? Pas encore ? Alors écris.")).toBeNull();
    expect(decouperRepli("Prêt ?")).toBeNull();
  });
});

describe("typographie : gluon après le trait d'union des impératifs à pronom (S1 @design)", () => {
  it("« Choisis-en », « écris-la », « relis-les », « dis-le-moi », « vas-y » ne se coupent plus", () => {
    expect(frTypoParcours("Choisis-en une et écris-la")).toBe(`Choisis-${WJ}en une et écris-${WJ}la`);
    expect(frTypoParcours("relis-les, dis-le-moi, vas-y")).toBe(`relis-${WJ}les, dis-${WJ}le-${WJ}moi, vas-${WJ}y`);
  });

  it("aucun autre trait d'union touché, idempotent", () => {
    expect(frTypoParcours("Peut-être, Jean-Yves, après-midi, entre-temps")).toBe("Peut-être, Jean-Yves, après-midi, entre-temps");
    expect(frTypoParcours("anti-leurre, porte-monnaie, sous-entendu")).toBe("anti-leurre, porte-monnaie, sous-entendu");
    expect(frTypoParcours(frTypoParcours("Choisis-en une"))).toBe(frTypoParcours("Choisis-en une"));
  });

  it("texte copié intact : seuls des gluons invisibles s'ajoutent à frTypo", () => {
    for (const d of DEFIS) expect(sansGluon(frTypoParcours(d))).toBe(frTypo(d));
    expect(prose(DEFIS[0])).toContain(`Choisis-${WJ}en`);
    expect(prose(DEFIS[0])).toContain(`relis-${WJ}les`);
  });

  it("« En 6 semaines » : « En » lié au nombre (S3 @design)", () => {
    expect(frTypoTexte("tu restes. En 6 semaines, tu apprends")).toBe(`tu restes. En${NBSP}6${NBSP}semaines, tu apprends`);
    // « Entre » n'est pas « En » : seule la règle de frTypo (chiffre + mot) s'applique.
    expect(frTypoTexte("Entre 6 et 8")).toBe(`Entre 6${NBSP}et 8`);
    const d = boulot.parcours.description;
    expect(sansGluon(frTypoTexte(d)).replaceAll(NBSP, " ")).toBe(d);
  });
});

type Path = Parameters<typeof pickSuite>[0][number];
const FAIT = { completedSteps: [1, 2, 3], completedAt: "2026-10-01T10:00:00Z" };
const seedDe = (boulotPublie: boolean) => publishedSeedJson(true, boulotPublie);
/** Parcours actifs servis par /api/parcours (un par entrée publiée), progression du compte. */
function api(boulotPublie: boolean, finis: string[]): Path[] {
  return seedDe(boulotPublie).map((s) => ({
    slug: s.slug,
    title: s.title,
    personaTagline: (s as { personaTagline?: string }).personaTagline ?? null,
    progress: finis.includes(s.slug) ? FAIT : null,
  }));
}
function suiteDe(slug: string, boulotPublie: boolean, finis: string[]) {
  const seed = seedDe(boulotPublie).find((s) => s.slug === slug)!;
  const s = seed as { nextParcours?: string | null; nextParcoursRanking?: string[] };
  return pickSuite(api(boulotPublie, finis), slug, s.nextParcours ?? null, s.nextParcoursRanking ?? []);
}

describe("suite de fin (spec s17 §5.5, SU-04) : jamais un parcours déjà fini", () => {
  it("Machine à Café puis Storytelling finis : Storytelling propose Répartie, pas Machine à Café", () => {
    expect(suiteDe("storytelling", false, ["machine-a-cafe", "storytelling"])).toMatchObject({
      kind: "parcours",
      slug: "repartie",
    });
  });

  it("Boulot publié (interrupteur simulé) : la fin de Machine à Café propose Boulot", () => {
    expect(suiteDe("machine-a-cafe", true, ["machine-a-cafe"])).toMatchObject({ kind: "parcours", slug: "boulot" });
  });

  it("Boulot masqué : la fin de Machine à Café propose Storytelling (comportement en ligne)", () => {
    expect(suiteDe("machine-a-cafe", false, ["machine-a-cafe"])).toMatchObject({ kind: "parcours", slug: "storytelling" });
  });

  it("Boulot publié, Machine à Café puis Storytelling finis : Storytelling propose Répartie", () => {
    expect(suiteDe("storytelling", true, ["machine-a-cafe", "storytelling"])).toMatchObject({ slug: "repartie" });
  });
});
