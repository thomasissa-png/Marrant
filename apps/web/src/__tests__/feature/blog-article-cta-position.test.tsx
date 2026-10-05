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

const mockAuthModal = jest.fn((_props: Record<string, unknown>) => null);
jest.mock("@/components/auth/auth-modal", () => ({
  AuthModal: (props: Record<string, unknown>) => mockAuthModal(props),
}));

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
  beforeEach(() => mockAuthModal.mockClear());

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
    expect(mockAuthModal).toHaveBeenCalledWith(
      expect.objectContaining({ callbackUrl: "/onboarding?src=blog-meilleures-blagues-droles-2026" }),
    );
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
    expect(mockAuthModal).toHaveBeenCalledWith(
      expect.objectContaining({ callbackUrl: "/onboarding?src=blog-comment-devenir-drole" }),
    );
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
      { slug: "creer-ses-propres-blagues", title: "Créer ses propres blagues", category: "CATALOGUE", readingTime: "8 min", publishedAt: new Date("2026-04-01") },
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
