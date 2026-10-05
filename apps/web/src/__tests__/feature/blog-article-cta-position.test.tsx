/**
 * Page article (notation iter1, C4, C7, C13) : article à CTA dédié = CTA juste
 * après le corps, avant FAQ et maillage ; autres articles = CTA en bas.
 * Boutons Partager montés sur les 50 vannes de /blog/meilleures-blagues-droles-2026 seulement.
 */
import { render, screen, within } from "@testing-library/react";

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

/** s15 : le bouton d'inscription est un lien direct /register (callback + source). */
function signupHref(container: HTMLElement): string | null {
  return container.querySelector('[data-blog-cta="inscription"] a')?.getAttribute("href") ?? null;
}

jest.mock("@/lib/prisma", () => ({
  prisma: {
    blogArticle: {
      findMany: jest.fn().mockResolvedValue([]),
      findUnique: jest.fn().mockResolvedValue(null),
    },
  },
}));

import BlogArticlePage from "@/app/(dashboard)/blog/[slug]/page";
import { blogArticles } from "@/lib/blog-articles";
import { prisma } from "@/lib/prisma";
import { REDIRECTED_BLOG_SLUGS } from "@/lib/seo-redirects";

const follows = (a: Node, b: Node) => Boolean(a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING);

async function renderArticle(slug: string) {
  const Page = await BlogArticlePage({ params: { slug } });
  return render(Page);
}

describe("Page article : position du CTA et partage", () => {

  it("meilleures-blagues : CTA juste après le corps, avant la FAQ, une seule fois", async () => {
    const { container } = await renderArticle("meilleures-blagues-droles-2026");
    const titles = screen.getAllByText("Tu les as lues. Reste à les sortir pour de vrai.");
    expect(titles).toHaveLength(1);
    const body = container.querySelector("[data-blog-body]")!;
    expect(follows(body, titles[0])).toBe(true);
    expect(follows(titles[0], screen.getByText("Questions fréquentes"))).toBe(true);
    expect(follows(titles[0], container.querySelector('[data-blog-zone="parcours"]')!)).toBe(true);
    expect(screen.getByText("Gratuit, sans carte. Les vannes de cette page restent en accès libre, compte ou pas.")).toBeInTheDocument();
    // Bouton Premium conservé (décision Thomas).
    expect(screen.getByText("Tout débloquer à 2,99 €/mois")).toBeInTheDocument();
    expect(signupHref(container)).toBe("/register?callbackUrl=%2Fonboarding&src=blog-meilleures-blagues-droles-2026");
  });

  it("meilleures-blagues : 50 boutons Partager, un par vanne", async () => {
    const { container } = await renderArticle("meilleures-blagues-droles-2026");
    const body = container.querySelector<HTMLElement>("[data-blog-body]")!;
    expect(within(body).getAllByRole("button", { name: /^Partager la vanne n°\d+$/ })).toHaveLength(50);
    expect(within(body).getByRole("button", { name: "Partager la vanne n°50" })).toBeInTheDocument();
  });

  it("autre article : CTA par défaut en bas, sans bouton Partager", async () => {
    const { container } = await renderArticle("comment-devenir-drole");
    const title = screen.getByText("Maintenant, reste à le dire à voix haute");
    expect(follows(container.querySelector('[data-blog-zone="parcours"]')!, title)).toBe(true);
    expect(container.querySelector("[data-share-vanne]")).toBeNull();
    expect(signupHref(container)).toBe("/register?callbackUrl=%2Fonboarding&src=blog-comment-devenir-drole");
  });
});

describe("Page article en base : articles à forte frappe (config/blog-forte-frappe)", () => {
  const CONTENT = [
    "Intro.",
    "## Quel message drôle envoyer à un pote pour son anniversaire ?",
    "**1.** Joyeux anniversaire [prénom] ! Personne n'a écrit. J'ai dû être **original**.\n*→ WhatsApp, premier message de la journée.*",
    "**2.** Joyeux anniversaire. Je te laisse ce vocal.\n*→ Vocal uniquement.*",
    "**3.** « Une vanne entre guillemets. »",
  ].join("\n\n");

  const dbArticle = (slug: string) => ({
    slug,
    title: "Titre",
    excerpt: "Extrait.",
    content: CONTENT,
    category: "CATALOGUE",
    readingTime: "6 min",
    targetKeyword: "mot-clé",
    metaTitle: null,
    metaDescription: null,
    isPublished: true,
    publishedAt: new Date("2026-01-01"),
    generatedByAI: false,
    createdAt: new Date("2026-01-01"),
    updatedAt: new Date("2026-01-01"),
  });

  async function renderDb(slug: string) {
    (prisma.blogArticle.findUnique as jest.Mock).mockResolvedValueOnce(dbArticle(slug));
    return renderArticle(slug);
  }

  it("A1 en base : un bouton par ligne numérotée, avec ou sans guillemets, texte partagé propre", async () => {
    const { container } = await renderDb("message-anniversaire-drole-par-situation");
    const body = container.querySelector<HTMLElement>("[data-blog-body]")!;
    expect(within(body).getAllByRole("button", { name: /^Envoyer le message n°\d+$/ })).toHaveLength(3);
    const texts = [...body.querySelectorAll<HTMLElement>("[data-share-vanne]")].map((el) => el.dataset.text);
    expect(texts).toEqual([
      "Joyeux anniversaire [prénom] ! Personne n'a écrit. J'ai dû être original.",
      "Joyeux anniversaire. Je te laisse ce vocal.",
      "« Une vanne entre guillemets. »",
    ]);
  });

  it("article de blagues en base (with-url) : libellé « Partager la vanne »", async () => {
    const { container } = await renderDb("blagues-de-gamer-jeux-video");
    const body = container.querySelector<HTMLElement>("[data-blog-body]")!;
    expect(within(body).getAllByRole("button", { name: /^Partager la vanne n°\d+$/ })).toHaveLength(3);
  });

  it("slug hors liste en base : aucun bouton Partager", async () => {
    const { container } = await renderDb("article-en-base-hors-liste");
    expect(container.querySelector("[data-share-vanne]")).toBeNull();
    expect(screen.queryByRole("button", { name: /^(Partager la vanne|Envoyer le message) n°/ })).toBeNull();
  });

  it("A1 en base : CTA dédié juste après le corps, avant le maillage", async () => {
    const { container } = await renderDb("message-anniversaire-drole-par-situation");
    const titles = screen.getAllByText("Le message, c'est fait. Reste le moment du gâteau.");
    expect(titles).toHaveLength(1);
    expect(follows(container.querySelector("[data-blog-body]")!, titles[0])).toBe(true);
    expect(follows(titles[0], container.querySelector('[data-blog-zone="parcours"]')!)).toBe(true);
    expect(screen.getByText("Gratuit, sans carte. Les messages de cette page restent en accès libre, compte ou pas.")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Créer mon compte gratuit" })).toBeInTheDocument();
  });
});

describe("Page article : « À lire ensuite » sans doublon (notation iter2, D1)", () => {
  const hrefs = (zone: Element | null) =>
    [...(zone?.querySelectorAll("a[href^='/blog/']") ?? [])].map((l) => l.getAttribute("href"));

  it("meilleures-blagues : la carte Suivant n'est pas reprise ; cluster épuisé, moins de cartes", async () => {
    const { container } = await renderArticle("meilleures-blagues-droles-2026");
    const nav = hrefs(container.querySelector('[data-blog-zone="cluster"]'));
    const related = hrefs(container.querySelector('[data-blog-zone="related"]'));
    expect(nav).toEqual(["/blog/phrases-droles-conversations"]);
    expect(related).toEqual(["/blog/comment-faire-rire-une-fille", "/blog/comment-faire-rire-un-homme"]);
  });

  it("meilleures-blagues : place libérée reprise par le suivant du cluster publié en base", async () => {
    (prisma.blogArticle.findMany as jest.Mock).mockResolvedValueOnce([
      { slug: "creer-ses-propres-blagues", title: "Créer ses propres blagues", category: "CATALOGUE", readingTime: "8 min", isPublished: true, publishedAt: new Date("2026-04-01") },
    ]);
    const { container } = await renderArticle("meilleures-blagues-droles-2026");
    const related = hrefs(container.querySelector('[data-blog-zone="related"]'));
    expect(related).toEqual(["/blog/comment-faire-rire-une-fille", "/blog/comment-faire-rire-un-homme", "/blog/creer-ses-propres-blagues"]);
  });

  it("aucun article ne propose 2 fois la même destination", async () => {
    const redirected = new Set<string>(REDIRECTED_BLOG_SLUGS);
    for (const { slug } of blogArticles.filter((a) => !redirected.has(a.slug))) {
      const { container, unmount } = await renderArticle(slug);
      const nav = hrefs(container.querySelector('[data-blog-zone="cluster"]'));
      const related = hrefs(container.querySelector('[data-blog-zone="related"]'));
      expect(related.filter((h) => nav.includes(h))).toEqual([]);
      expect(new Set(related).size).toBe(related.length);
      unmount();
    }
  });
});

describe("Page article : typographie FAQ et cartes, grille ajustée (notation iter3, E1 et E3)", () => {
  const NBSP = String.fromCharCode(0xa0);
  const grid = (container: HTMLElement) =>
    container.querySelector('[data-blog-zone="related"] .grid')!.className;

  it("meilleures-blagues : FAQ en typographie française, « ? » jamais orphelin", async () => {
    const { container } = await renderArticle("meilleures-blagues-droles-2026");
    const questions = [...container.querySelectorAll("dt")].map((dt) => dt.textContent ?? "");
    expect(questions.length).toBeGreaterThan(0);
    expect(questions[0]).toBe(`Comment trouver des blagues drôles à raconter${NBSP}?`);
    for (const text of [...questions, ...[...container.querySelectorAll("dd")].map((dd) => dd.textContent ?? "")]) {
      expect(text).not.toMatch(/ [:;!?»]/);
      expect(text).not.toContain(`${NBSP}${NBSP}`);
    }
  });

  it("titres des cartes Précédent/Suivant et « À lire ensuite » passés dans frTypo", async () => {
    const redirected = new Set<string>(REDIRECTED_BLOG_SLUGS);
    for (const { slug } of blogArticles.filter((a) => !redirected.has(a.slug))) {
      const { container, unmount } = await renderArticle(slug);
      const titles = container.querySelectorAll(
        '[data-blog-zone="cluster"] a p, [data-blog-zone="related"] a h3',
      );
      for (const t of titles) expect(t.textContent).not.toMatch(/ [:;!?»]|(\d) (?=[A-Za-zÀ-ÿ€%°])/);
      unmount();
    }
  });

  it("meilleures-blagues : 2 cartes « À lire ensuite » = 2 colonnes", async () => {
    const { container } = await renderArticle("meilleures-blagues-droles-2026");
    expect(container.querySelectorAll('[data-blog-zone="related"] a')).toHaveLength(2);
    expect(grid(container)).toContain("sm:grid-cols-2");
    expect(grid(container)).not.toContain("sm:grid-cols-3");
  });

  it("3 cartes « À lire ensuite » = 3 colonnes", async () => {
    (prisma.blogArticle.findMany as jest.Mock).mockResolvedValueOnce([
      { slug: "creer-ses-propres-blagues", title: "Créer ses propres blagues", category: "CATALOGUE", readingTime: "8 min", isPublished: true, publishedAt: new Date("2026-04-01") },
    ]);
    const { container } = await renderArticle("meilleures-blagues-droles-2026");
    expect(container.querySelectorAll('[data-blog-zone="related"] a')).toHaveLength(3);
    expect(grid(container)).toContain("sm:grid-cols-3");
    expect(grid(container)).not.toContain("sm:grid-cols-2");
  });
});
