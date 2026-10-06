/**
 * Liens vers le pilier non indexé /blog/comment-devenir-drole (s15, L1 à L7).
 * Spec : docs/seo/pilier-non-indexe-s15.md §4.1 ; journal : docs/seo/liens-pilier-appliques-s15.md.
 * On teste les liens RENDUS (composants et HTML du markdown), pas seulement les données.
 */
import { render, screen, within } from "@testing-library/react";
import { renderMarkdown } from "@/components/ui/markdown-renderer";
import { blogArticles } from "@/lib/blog-articles";
import { Footer } from "@/components/layout/footer";

const PILIER = "/blog/comment-devenir-drole";
const LIEN_PILIER = `href="${PILIER}"`;

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn(), replace: jest.fn(), back: jest.fn() }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => "/",
}));

jest.mock("@/lib/prisma", () => ({
  prisma: { blogArticle: { findMany: jest.fn().mockResolvedValue([]) } },
}));

// Accueil : on isole la section personas (les autres blocs ont leurs propres tests).
jest.mock("next/dynamic", () => () => function DynamicStub() { return null; });
jest.mock("@/components/home/hero-section", () => ({ HeroSection: () => null }));
jest.mock("@/components/home/daily-content", () => ({ DailyContent: () => null }));
jest.mock("@/components/home/feature-cards", () => ({ FeatureCards: () => null }));
jest.mock("@/lib/catalogue-pages", () => ({ getHomeFeatureExamples: jest.fn().mockResolvedValue({}) }));
jest.mock("@/lib/content-stats-server", () => ({
  getContentStatsRounded: jest.fn().mockResolvedValue({ jokes: 0, tips: 0, videos: 0 }),
}));
jest.mock("@/components/seo/json-ld", () => ({
  JsonLd: () => null,
  buildFaqJsonLd: () => ({}),
  buildBreadcrumbJsonLd: () => ({}),
  buildItemListJsonLd: () => ({}),
}));

import HomePage from "@/app/(dashboard)/page";
import BlogPage from "@/app/(dashboard)/blog/page";

function article(slug: string) {
  const found = blogArticles.find((a) => a.slug === slug);
  if (!found) throw new Error(`article absent : ${slug}`);
  return found;
}

describe("L1 : footer (lien sitewide)", () => {
  it("rend « Comment devenir drôle » vers le pilier, juste avant Blog", () => {
    render(<Footer />);
    const lien = screen.getByRole("link", { name: "Comment devenir drôle" });
    expect(lien).toHaveAttribute("href", PILIER);
    const blog = screen.getByRole("link", { name: "Blog" });
    expect(lien.closest("li")?.nextElementSibling).toBe(blog.closest("li"));
  });
});

describe("L2 : accueil, sous les cartes « Tu te reconnais ? »", () => {
  it("rend le lien « comment devenir drôle » dans la section personas", async () => {
    render(await HomePage());
    const section = screen.getByText("Tu te reconnais ?").closest("section") as HTMLElement;
    const lien = within(section).getByRole("link", { name: "comment devenir drôle" });
    expect(lien).toHaveAttribute("href", PILIER);
    expect(lien.closest("p")).toHaveTextContent("Tu veux d'abord comprendre le mécanisme ? Lis notre guide comment devenir drôle.");
  });
});

describe("L3 : /blog, bloc « Commence ici »", () => {
  it("rend la carte vers le pilier au-dessus de la liste, sans nouveau titre Hn", async () => {
    render(await BlogPage());
    const bloc = screen.getByRole("complementary", { name: "Commence ici" });
    const lien = within(bloc).getByRole("link", { name: /Comment devenir drôle : 5 piliers et un plan sur 30 jours/ });
    expect(lien).toHaveAttribute("href", PILIER);
    expect(within(bloc).queryByRole("heading")).toBeNull();
  });
});

describe("L4 : article n°1, lien précoce", () => {
  it("lien vers le pilier dans l'intro (avant le premier H2) ET lien final conservé", () => {
    const { content } = article("meilleures-blagues-droles-2026");
    const intro = content.split("\n## ")[0];
    expect(renderMarkdown(intro)).toContain(LIEN_PILIER);
    expect(content.split("\n").slice(0, 20).join("\n")).toContain(`](${PILIER})`);
    expect(content.trimEnd().endsWith(`→ **[Comment devenir drôle](${PILIER})** : le guide complet avec plan d'action sur 30 jours.`)).toBe(true);
  });
});

describe("L5 : les 4 articles les mieux vus citent le pilier dans le corps", () => {
  it.each([
    ["comment-avoir-de-la-repartie", "devenir plus drôle"],
    ["5-types-humour-lequel-pour-toi", "comment devenir drôle"],
    ["phrases-droles-conversations", "le guide pour devenir drôle"],
    ["autoderision-interactions", "devenir drôle"],
  ])("%s : ancre « %s », hors du dernier paragraphe", (slug, ancre) => {
    const { content } = article(slug);
    expect(renderMarkdown(content)).toContain(`<a href="${PILIER}" class="text-accent-link hover:underline">${ancre}</a>`);
    const paragraphes = content.trimEnd().split("\n\n");
    expect(paragraphes[paragraphes.length - 1]).not.toContain(PILIER);
  });
});

describe("L6 et L7 : pilier", () => {
  const pilier = article("comment-devenir-drole");
  const html = renderMarkdown(pilier.content);

  it.each([
    "/blog/exercices-developper-humour",
    "/blog/humour-quotidien-8-habitudes",
    "/blog/comment-avoir-de-la-repartie",
    "/blog/pourquoi-blagues-marchent-pas",
    "/quiz-humour",
  ])("rend un lien sortant vers %s", (href) => {
    expect(html).toContain(`href="${href}"`);
  });

  it("chaque satellite cible existe en article statique (liens bidirectionnels)", () => {
    for (const slug of ["exercices-developper-humour", "humour-quotidien-8-habitudes", "comment-avoir-de-la-repartie", "pourquoi-blagues-marchent-pas"]) {
      expect(article(slug).content).toContain(`](${PILIER})`);
    }
  });

  it("updatedAt réel (s15), postérieur à la refonte du 29/09", () => {
    expect(pilier.updatedAt).toBe("2026-10-06");
  });

  it("H2, FAQ et humoristes intouchés, zéro tiret cadratin ajouté", () => {
    expect(pilier.content.match(/^## .+$/gm)).toEqual([
      "## Pourquoi pense-t-on que l'humour est un talent inné ?",
      "## Que dit la science sur l'apprentissage de l'humour ?",
      "## Quels sont les 5 piliers pour devenir drôle ?",
      "## Comment devenir drôle en 30 jours ? Le plan d'action",
      "## Quelles erreurs empêchent de devenir drôle ?",
      "## À qui ça s'adresse ?",
    ]);
    expect(pilier.faqs).toHaveLength(4);
    for (const nom of ["Paul Mirabel", "Fary", "Blanche Gardin", "Roman Frayssinet", "Panayotis Pascot", "Waly Dia", "Inès Reg"]) {
      expect(pilier.content).toContain(nom);
    }
    // Les 5 tirets cadratins préexistants (titres H3 « Pilier n — ») restent les seuls.
    expect(pilier.content.split("—").length - 1).toBe(5);
  });
});
