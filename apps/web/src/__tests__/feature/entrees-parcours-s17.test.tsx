/**
 * s17 lot C : entrées et maillage vers l'étape 1 des parcours (reco 5, 14, QA-13, SEO-06/07/08).
 */
import { render, screen } from "@testing-library/react";
import {
  parcoursEtape1Href,
  parcoursSlugFromHref,
  pickParcoursAReprendre,
  type ParcoursProgressSummary,
} from "@/lib/entrees-parcours";
import { findParcoursForJoke, findParcoursForVideo, refsFromDbSteps } from "@/lib/entrees-parcours-fiches";
import { FicheParcoursLien } from "@/components/entrees-parcours/fiche-parcours-lien";
import { resolveArticleParcours } from "@/components/blog/blog-article-parcours-maillage";
import { QUIZ_PROFILES } from "@/components/quiz/quiz-data";
import { computeParcoursDates } from "@/lib/sitemap-parcours";
import { renderLlmsParcoursProgramme } from "@/lib/llms-parcours";
import blaguesSeed from "../../../../../docs/content/blagues-seed.json";

const row = (p: Partial<ParcoursProgressSummary>): ParcoursProgressSummary => ({
  slug: "repartie",
  title: "Parcours Répartie",
  completedSteps: 0,
  totalSteps: 4,
  completedAt: null,
  nextStepOrder: 1,
  startedAt: "2026-10-01T00:00:00.000Z",
  ...p,
});

describe("liens d'entrée vers l'étape 1", () => {
  it("construit l'URL de l'étape 1 avec la provenance", () => {
    expect(parcoursEtape1Href("confiance", "fiche")).toBe("/parcours/confiance?src=fiche#etape-1");
  });
  it("retrouve le slug d'un lien de parcours, jamais celui de la liste", () => {
    expect(parcoursSlugFromHref("/parcours/repartie")).toBe("repartie");
    expect(parcoursSlugFromHref("/parcours/repartie?src=blog#etape-1")).toBe("repartie");
    expect(parcoursSlugFromHref("/parcours")).toBeNull();
    expect(parcoursSlugFromHref("/parcours/inconnu")).toBeNull();
    expect(parcoursSlugFromHref(undefined)).toBeNull();
  });
});

describe("parcours à reprendre (accueil abonné, profil)", () => {
  it("rien sans progression (visiteur ou abonné qui n'a pas commencé)", () => {
    expect(pickParcoursAReprendre([])).toBeNull();
  });
  it("parcours de 6 étapes : reprend à l'étape suivante", () => {
    const r = pickParcoursAReprendre([
      row({ slug: "confiance", title: "Parcours Confiance", totalSteps: 6, completedSteps: 4, nextStepOrder: 5 }),
    ]);
    expect(r).toEqual({ slug: "confiance", title: "Parcours Confiance", etape: 5, totalSteps: 6, completedSteps: 4 });
  });
  it("ignore un parcours terminé, garde le plus avancé des parcours en cours", () => {
    const r = pickParcoursAReprendre([
      row({ slug: "machine-a-cafe", totalSteps: 3, completedSteps: 3, nextStepOrder: null, completedAt: "2026-10-05T00:00:00.000Z" }),
      row({ slug: "repartie", totalSteps: 4, completedSteps: 1, nextStepOrder: 2 }),
      row({ slug: "confiance", totalSteps: 6, completedSteps: 3, nextStepOrder: 4 }),
    ]);
    expect(r?.slug).toBe("confiance");
    expect(r?.etape).toBe(4);
  });
  it("à égalité, le plus récent", () => {
    const r = pickParcoursAReprendre([
      row({ slug: "repartie", completedSteps: 2, nextStepOrder: 3, startedAt: "2026-09-01T00:00:00.000Z" }),
      row({ slug: "confiance", totalSteps: 4, completedSteps: 2, nextStepOrder: 3, startedAt: "2026-10-02T00:00:00.000Z" }),
    ]);
    expect(r?.slug).toBe("confiance");
  });
});

describe("fiches vannes, conseils, vidéos → parcours", () => {
  it("vidéo utilisée par deux parcours : étape la plus basse d'abord", () => {
    expect(findParcoursForVideo("GKJKPlf6EqA")).toEqual([{ slug: "machine-a-cafe", etape: 1 }]);
    expect(findParcoursForVideo("K-oIyXvLUeg")).toEqual([
      { slug: "machine-a-cafe", etape: 2 },
      { slug: "repartie", etape: 2 },
    ]);
  });
  it("vidéo absente des parcours : aucun lien", () => {
    expect(findParcoursForVideo("inexistant")).toEqual([]);
  });
  it("vanne retrouvée par son texte (casse et espaces neutralisés)", () => {
    const seed7 = (blaguesSeed as { id: number; content: string }[]).find((j) => j.id === 7)!;
    expect(findParcoursForJoke(`  ${seed7.content.toUpperCase()} `)).toContainEqual({ slug: "machine-a-cafe", etape: 1 });
    expect(findParcoursForJoke("Une vanne qui n'existe dans aucun parcours.")).toEqual([]);
  });
  it("conseil : étapes en base, parcours inactifs exclus", () => {
    expect(
      refsFromDbSteps([
        { order: 3, learningPath: { slug: "repartie", isActive: true } },
        { order: 1, learningPath: { slug: "confiance", isActive: false } },
        { order: 2, learningPath: { slug: "storytelling", isActive: true } },
      ]),
    ).toEqual([{ slug: "repartie", etape: 3 }]);
  });
  it("bloc de fiche : rien sans parcours, sinon lien vers l'étape 1 avec src=fiche", () => {
    const { container, rerender } = render(<FicheParcoursLien type="video" refs={[]} />);
    expect(container).toBeEmptyDOMElement();
    rerender(<FicheParcoursLien type="conseil" refs={[{ slug: "repartie", etape: 3 }]} />);
    expect(screen.getByText("Ce conseil est l'étape 3 du parcours Répartie.")).toBeInTheDocument();
    expect(screen.getByRole("link")).toHaveAttribute("href", "/parcours/repartie?src=fiche#etape-1");
  });
});

describe("règle thématique des articles (encart et CTA)", () => {
  it.each([
    ["comment-avoir-de-la-repartie", "REPARTIE", "repartie"],
    ["premier-message-drole-appli-de-rencontre", "DATING", "confiance"],
    ["message-anniversaire-drole-par-situation", "CATALOGUE", "repartie"],
    ["slug-inconnu-xyz", undefined, "repartie"],
  ])("%s → %s", (slug, category, expected) => {
    expect(resolveArticleParcours(slug, category)).toBe(expected);
  });
});

describe("quiz d'humour : un des 3 parcours par profil", () => {
  it("chaque profil recommande un parcours existant, et les 3 sont couverts", () => {
    const slugs = Object.values(QUIZ_PROFILES).map((p) => p.recommendedParcours);
    for (const s of slugs) expect(["machine-a-cafe", "repartie", "confiance"]).toContain(s);
    expect(new Set(slugs).size).toBe(3);
  });
});

describe("sitemap et llms-full", () => {
  it("lastmod : la plus récente des dates (code, parcours, conseils)", () => {
    const base = new Date("2026-10-07");
    const d = computeParcoursDates(
      [
        { slug: "repartie", updatedAt: new Date("2026-09-01"), steps: [{ tip: { updatedAt: new Date("2026-10-20") } }] },
        { slug: "confiance", updatedAt: new Date("2026-09-01"), steps: [{ tip: null }] },
      ],
      base,
    );
    expect(d.bySlug.repartie.toISOString().slice(0, 10)).toBe("2026-10-20");
    expect(d.bySlug.confiance).toEqual(base);
    expect(d.hub.toISOString().slice(0, 10)).toBe("2026-10-20");
  });
  it("programme public des 3 parcours, « première étape gratuite », jamais « cours gratuit »", () => {
    const text = renderLlmsParcoursProgramme().join("\n");
    for (const slug of ["machine-a-cafe", "repartie", "confiance"]) {
      expect(text).toContain(`https://deviens-marrant.fr/parcours/${slug}#etape-1`);
    }
    expect(text).toContain("première étape gratuite");
    expect(text).not.toMatch(/cours gratuit/i);
    expect(text).not.toContain("—");
  });
});
