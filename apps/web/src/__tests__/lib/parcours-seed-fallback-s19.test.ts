/**
 * s19 (B1 rendu itération 1) : le repli seed (page construite avant l'activation du parcours,
 * ou base en panne) sert au visiteur l'étape 1 EN ENTIER (conseil, exemple, défi) quand le
 * fichier de contenu porte le conseil, et seulement l'aperçu des étapes 2+ (D1).
 */
jest.mock("@/lib/prisma", () => ({ prisma: {} }));

import boulot from "../../../../../docs/content/parcours-boulot-s19.json";
import storytelling from "../../../../../docs/content/parcours-storytelling-s18.json";
import { estRepliSeed, redactParcoursForPlan, type ParcoursStepPayload } from "@/lib/parcours-preview";
import { seedTipTexts } from "@/lib/parcours-data";

type DataModule = typeof import("@/lib/parcours-data");

/** Module de données avec les deux parcours publiés (interrupteur simulé, fichier commité intact). */
function dataPublie(): DataModule {
  let data: DataModule | undefined;
  jest.isolateModules(() => {
    jest.doMock("@/config/parcours-publication", () => ({ STORYTELLING_PUBLIE: true, BOULOT_PUBLIE: true }));
    data = require("@/lib/parcours-data") as DataModule;
  });
  return data!;
}

function vueVisiteur(slug: string) {
  const path = dataPublie().buildPathFromSeed(slug);
  expect(path).not.toBeNull();
  return redactParcoursForPlan(path as unknown as { id: string; steps: ParcoursStepPayload[] }, null);
}

describe("repli seed : étape 1 visiteur complète (Boulot, Storytelling)", () => {
  const CAS = [
    { slug: "boulot", conseil: boulot._meta.conseils.find((c) => c.etape === 1)! },
    {
      slug: "storytelling",
      conseil: storytelling._meta.conseilsReactives.find((c) => c.title === storytelling.parcours.steps[0].tipTitle)!,
    },
  ];

  it.each(CAS)("$slug : conseil, exemple et défi de l'étape 1, textes exacts du fichier", ({ slug, conseil }) => {
    const path = vueVisiteur(slug);
    const step1 = path.steps[0];
    expect(estRepliSeed(path)).toBe(true);
    expect(step1.locked).toBeFalsy();
    expect(step1.tip.exercise.trim()).not.toBe("");
    expect(step1.tip.example.trim()).not.toBe("");
    expect(step1.tip.content).toBe(conseil.content);
    expect(step1.tip.example).toBe(conseil.example);
    expect(step1.tip.exercise).toBe(conseil.exercise);
    // Sinon la règle T28 de la carte masque « Le conseil ».
    expect(step1.tip.content.trim()).not.toBe(step1.moduleDetail?.trim());
  });

  it.each(CAS)("$slug : étapes 2+ en aperçu, aucun texte de conseil envoyé au visiteur", ({ slug }) => {
    const path = vueVisiteur(slug);
    for (const step of path.steps.slice(1)) {
      expect(step.locked).toBe(true);
      expect(step.tip).toMatchObject({ content: "", example: "", exercise: "" });
      expect(step.quiz).toEqual([]);
      expect(step.videos).toEqual([]);
    }
  });

  it("Boulot Premium sur le repli : les 6 conseils du fichier, par étape", () => {
    const path = dataPublie().buildPathFromSeed("boulot")!;
    path.steps.forEach((step, i) => {
      const c = boulot._meta.conseils.find((x) => x.etape === i + 1)!;
      expect(step.tip.exercise).toBe(c.exercise);
    });
  });
});

describe("repli seed : parcours dont le fichier ne porte pas le conseil", () => {
  it("parcours-seed.json n'a aucun conseil : rien d'inventé, la page relit la base (estRepliSeed)", () => {
    const data = dataPublie();
    for (const slug of ["machine-a-cafe", "repartie", "confiance"]) {
      const seed = data.getSeedForSlug(slug)!;
      expect(seedTipTexts(seed).size).toBe(0);
      const path = data.buildPathFromSeed(slug)!;
      expect(path.steps[0].tip.exercise).toBe("");
      expect(estRepliSeed(path)).toBe(true);
    }
  });

  it("estRepliSeed : vrai pour seed-<slug> seulement", () => {
    expect(estRepliSeed({ id: "seed-boulot" })).toBe(true);
    expect(estRepliSeed({ id: "clx0boulot" })).toBe(false);
    expect(estRepliSeed(null)).toBe(false);
  });
});
