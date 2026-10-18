/**
 * Audit conversion s20, lot 1 (« montrer l'offre ») : encarts au fil du texte,
 * article n°1, bloc de fin unique, 5 parcours, carte de phrases-droles avant la FAQ.
 */
import { render, screen } from "@testing-library/react";

jest.mock("next-auth/react", () => ({
  useSession: jest.fn(() => ({ data: null, status: "unauthenticated" })),
  SessionProvider: ({ children }: { children: React.ReactNode }) => children,
}));
jest.mock("next/navigation", () => ({
  notFound: jest.fn(() => {
    throw new Error("NEXT_NOT_FOUND");
  }),
  useRouter: () => ({ push: jest.fn(), replace: jest.fn(), back: jest.fn() }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => "/blog",
}));
// s21 : l'encart du milieu montre la fiche offerte du carnet du mois (DemoVanne).
jest.mock("@/lib/carnet", () => jest.requireActual("../helpers/carnet-octobre").mockCarnetOctobre());
jest.mock("@/lib/prisma", () => ({
  prisma: { blogArticle: { findMany: jest.fn().mockResolvedValue([]), findUnique: jest.fn().mockResolvedValue(null) } },
}));

import BlogArticlePage from "@/app/(dashboard)/blog/[slug]/page";
import { renderMarkdownSections } from "@/components/ui/markdown-renderer";
import { computeEncartPlacements, visibleTextLength, type BlogSection } from "@/lib/blog-encarts";
import { resolveArticleParcours } from "@/lib/blog-parcours";
import { PARCOURS_SLUGS, parcoursEtape1Href, type ParcoursSlug } from "@/lib/entrees-parcours";
import { TEXTES_PARCOURS_BLOG } from "@/config/textes/encarts-blog-s20";
import { BLOC_FIN } from "@/config/textes/cta-articles-accueil";
import { PARCOURS_SEED_JSON } from "@/lib/parcours-seed";
import { normalise } from "../helpers/texte-normalise";

const follows = (a: Node, b: Node) => Boolean(a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING);
const h2 = (container: HTMLElement, startsWith: string) =>
  [...container.querySelectorAll("[data-blog-body] h2")].find((h) => h.textContent?.startsWith(startsWith))!;

/** Article de N sections H2 (poids relatifs `poids`, égaux par défaut) et une intro courte. */
function article(n: number, poids: number[] = Array(n).fill(1)): string {
  const phrase = "Une phrase de section assez longue pour peser dans le calcul du placement. ";
  return ["Intro.", ...poids.map((w, i) => `## Section ${i + 1}\n\n${phrase.repeat(4 * w)}`)].join("\n\n");
}
const partLue = (sections: BlogSection[], apresIndex: number) =>
  sections.slice(0, apresIndex + 1).reduce((s, x) => s + x.weight, 0) / sections.reduce((s, x) => s + x.weight, 0);
function sectionsOf(content: string): BlogSection[] {
  return renderMarkdownSections(content).map((s) => ({ heading: s.heading, weight: visibleTextLength(s.html) }));
}

describe("placement de l'encart automatique", () => {
  it("2 H2 : aucun encart", () => {
    expect(computeEncartPlacements("article-x", "REPARTIE", sectionsOf(article(2)))).toEqual([]);
  });

  it("3 H2 : un encart après la fin d'une section, jamais après la dernière", () => {
    const placements = computeEncartPlacements("article-x", "REPARTIE", sectionsOf(article(3)));
    expect(placements).toHaveLength(1);
    expect(placements[0]).toMatchObject({ apresIndex: 1, position: "milieu-1", parcours: "repartie" });
  });

  it("6 H2 : un encart entre 35 et 45 % du texte quand une fin de section y tombe", () => {
    const sections = sectionsOf(article(6, [2, 1, 1, 2, 2, 2]));
    const placements = computeEncartPlacements("article-x", "REPARTIE", sections);
    expect(placements).toHaveLength(1);
    const lu = partLue(sections, placements[0].apresIndex);
    expect(lu).toBeGreaterThanOrEqual(0.35);
    expect(lu).toBeLessThanOrEqual(0.45);
  });

  it("6 H2 égaux : la fin de section la plus proche de 40 %", () => {
    const sections = sectionsOf(article(6));
    const [p] = computeEncartPlacements("article-x", "REPARTIE", sections);
    const ecart = (i: number) => Math.abs(partLue(sections, i) - 0.4);
    for (let i = 1; i < sections.length - 1; i++) expect(ecart(p.apresIndex)).toBeLessThanOrEqual(ecart(i));
  });

  it("rendu découpé = rendu d'un bloc, ancres uniques sur tout l'article", () => {
    const sections = renderMarkdownSections("## A\n\nx\n\n## A\n\ny");
    expect(sections.map((s) => s.heading)).toEqual([null, "A", "A"]);
    expect(sections[2].html).toContain('id="a-2"');
  });
});

async function renderArticle(slug: string) {
  return render(await BlogArticlePage({ params: { slug } }));
}

describe("article n°1 : un seul encart, la démonstration (s21, B1)", () => {
  it("après la section soirée, plus de milieu-2 ; bouton plein vers la fiche offerte du carnet", async () => {
    const { container } = await renderArticle("meilleures-blagues-droles-2026");
    const encarts = [...container.querySelectorAll<HTMLElement>("[data-blog-body] [data-blog-cta-position]")];
    expect(encarts.map((e) => [e.dataset.blogCtaPosition, e.dataset.blogCtaParcours, e.dataset.blogCtaFiche])).toEqual([
      ["milieu-1", "repartie", "2026-10-15"],
    ]);
    const soiree = h2(container, "Quelles blagues sortir en soirée");
    const bureau = h2(container, "Quelles blagues au bureau");
    expect(follows(soiree, encarts[0]) && follows(encarts[0], bureau)).toBe(true);
    const liens = encarts[0].querySelectorAll("a");
    expect(liens).toHaveLength(1);
    expect(liens[0]).toHaveAttribute("href", "/carnet?src=blog-demo-milieu-1#fiche-2026-10-15");
    expect(liens[0]).toHaveAttribute("data-blog-cta", "demo-fiche");
    expect(encarts[0]).toHaveTextContent("Tu parles toujours aussi peu ?");
  });
});

describe("bloc de fin unique (s21, B2)", () => {
  it.each(["meilleures-blagues-droles-2026", "comment-devenir-drole", "phrases-droles-conversations"])(
    "%s : étape 1 en PLEIN (seul plein) puis lien payant, lettre, articles liés, FAQ en dernier",
    async (slug) => {
      const { container } = await renderArticle(slug);
      const blocs = container.querySelectorAll<HTMLElement>("[data-blog-bloc-fin]");
      expect(blocs).toHaveLength(1);
      const links = [...blocs[0].querySelectorAll<HTMLAnchorElement>("a[data-blog-cta]")];
      expect(links.map((a) => a.dataset.blogCta)).toEqual(["etape-1", "abonnement"]);
      expect(links[0].className).toContain("bg-accent-secondary-hover");
      expect(links[1].className).not.toContain("bg-accent-secondary-hover");
      expect(links[1].className).toContain("underline");
      expect(links[1]).toHaveTextContent(normalise(BLOC_FIN.lienAbonnement));
      expect(links[1].getAttribute("href")).toContain(`src=blog-${slug}`);
      expect(blocs[0].querySelector("ul")).toBeNull();
      // Ordre de la spec §3.1 : bloc de fin, lettre, cluster / « À lire ensuite », FAQ.
      const lettre = container.querySelector('[data-blog-zone="lettre"]')!;
      const related = container.querySelector('[data-blog-zone="related"]')!;
      expect(follows(blocs[0], lettre) && follows(lettre, related)).toBe(true);
      const faq = screen.queryByText("Questions fréquentes");
      if (faq) expect(follows(related, faq)).toBe(true);
      expect(container.querySelector('[data-blog-zone="parcours"]')).toBeNull();
    },
  );

  it("article n°1 : textes du tour 16 (titre, scène, note [S9] sans annuel tant qu'il n'est pas configuré)", async () => {
    const { container } = await renderArticle("meilleures-blagues-droles-2026");
    const bloc = container.querySelector<HTMLElement>("[data-blog-bloc-fin]")!;
    expect(bloc).toHaveTextContent("La vanne qui sort de ta bouche, pas de ton téléphone");
    expect(bloc).toHaveTextContent(/Tu viens de lire cinquante vannes\..*Une étape par semaine, 20 minutes.*La première se lit tout de suite, sans compte\./);
    expect(bloc).toHaveTextContent(/Ouvrir les \d parcours\s·\s2,99\s€\/mois/);
    expect(bloc).toHaveTextContent("Tester mes premières répliques, gratuit");
    expect(bloc).toHaveTextContent(/2,99\s€ TTC par mois\. Tu as 14 jours/);
    expect(bloc).not.toHaveTextContent("24,99");
  });

  it("phrases-droles-conversations : la FAQ vient après le bloc de fin (Répartie)", async () => {
    const { container } = await renderArticle("phrases-droles-conversations");
    const bloc = container.querySelector<HTMLElement>("[data-blog-bloc-fin]")!;
    expect(bloc.dataset.blogCtaParcours).toBe("repartie");
    expect(follows(bloc, screen.getByText("Questions fréquentes"))).toBe(true);
  });
});

describe("les 5 parcours", () => {
  const CINQ: ParcoursSlug[] = ["repartie", "machine-a-cafe", "confiance", "storytelling", "boulot"];

  it("publiés, avec une route d'étape 1 (seed) et des textes de bloc de fin", () => {
    expect([...PARCOURS_SLUGS].sort()).toEqual([...CINQ].sort());
    const seedSlugs = PARCOURS_SEED_JSON.map((p) => p.slug);
    for (const slug of CINQ) {
      expect(seedSlugs).toContain(slug);
      expect(parcoursEtape1Href(slug, "blog-milieu")).toBe(`/parcours/${slug}?src=blog-milieu#etape-1`);
      expect(TEXTES_PARCOURS_BLOG[slug].finBoutonEtape1).toBeTruthy();
    }
  });

  it("la table par slug est prioritaire sur le cluster, pour chacun des 5", () => {
    jest.isolateModules(() => {
      jest.doMock("@/config/blog-encarts", () => ({
        PARCOURS_PAR_ARTICLE: Object.fromEntries(CINQ.map((p) => [`article-${p}`, p])),
      }));
      const { resolveArticleParcours: resolve } = jest.requireActual<typeof import("@/lib/blog-parcours")>("@/lib/blog-parcours");
      for (const p of CINQ) expect(resolve(`article-${p}`, "CONTEXTE")).toBe(p);
    });
  });

  it("sans entrée : cluster puis Répartie (s20 : fort-volume → Répartie, humour-contexte → Boulot)", () => {
    expect(resolveArticleParcours("blagues-travail-faire-rire-pro", "CONTEXTE")).toBe("boulot");
    expect(resolveArticleParcours("conversation-machine-a-cafe", "CONTEXTE")).toBe("machine-a-cafe");
    expect(resolveArticleParcours("je-suis-pas-drole-comment-changer", "PSYCHOLOGIE")).toBe("confiance");
    expect(resolveArticleParcours("article-inconnu", undefined)).toBe("repartie");
    expect(resolveArticleParcours("meilleures-blagues-droles-2026", "CATALOGUE")).toBe("repartie");
  });
});

describe("textes provisoires (config/textes/encarts-blog-s20)", () => {
  it("zéro tiret cadratin, aucune mention d'IA", () => {
    const tout = JSON.stringify({ TEXTES_PARCOURS_BLOG });
    expect(tout).not.toContain("—");
    expect(tout.toLowerCase()).not.toMatch(/\bia\b|intelligence artificielle|gpt/);
  });
});
