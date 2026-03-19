import { render, screen } from "@testing-library/react";

const notFoundError = new Error("NEXT_NOT_FOUND");

jest.mock("next/navigation", () => ({
  notFound: jest.fn(() => {
    throw notFoundError;
  }),
}));

const { notFound } = require("next/navigation");

jest.mock("@/components/seo/json-ld", () => ({
  JsonLd: ({ data }: { data: Record<string, unknown> }) => (
    <script data-testid="json-ld" type="application/ld+json">
      {JSON.stringify(data)}
    </script>
  ),
  buildBreadcrumbJsonLd: (items: { name: string; url: string }[]) => ({
    "@type": "BreadcrumbList",
    itemListElement: items,
  }),
  buildArticleJsonLd: (article: Record<string, unknown>) => ({
    "@type": "Article",
    headline: article.title,
  }),
  buildFaqJsonLd: (faqs: { question: string; answer: string }[]) => ({
    "@type": "FAQPage",
    mainEntity: faqs,
  }),
  buildItemListJsonLd: (items: { name: string; url: string; position: number }[]) => ({
    "@type": "ItemList",
    itemListElement: items,
  }),
}));

const mockArticlesData = [
  {
    slug: "comment-devenir-drole",
    title: "Comment devenir drôle : le guide",
    excerpt:
      "\"Être drôle, c'est inné.\" Faux. La science et les humoristes prouvent le contraire.",
    content: "Premier paragraphe.\n\nDeuxième paragraphe.",
    date: "2026-03-10",
    readingTime: "12 min",
    category: "GUIDE",
  },
  {
    slug: "comment-avoir-de-la-repartie",
    title: "Comment avoir de la répartie : techniques",
    excerpt: "Tu restes muet quand on te lance une pique ?",
    content: "Contenu de l'article.",
    date: "2026-03-05",
    readingTime: "10 min",
    category: "REPARTIE",
  },
];

jest.mock("@/lib/blog-articles", () => {
  const articles = [
    {
      slug: "comment-devenir-drole",
      title: "Comment devenir drôle : le guide",
      excerpt:
        "\"Être drôle, c'est inné.\" Faux. La science et les humoristes prouvent le contraire.",
      content: "Premier paragraphe.\n\nDeuxième paragraphe.",
      date: "2026-03-10",
      readingTime: "12 min",
      category: "GUIDE",
    },
    {
      slug: "comment-avoir-de-la-repartie",
      title: "Comment avoir de la répartie : techniques",
      excerpt: "Tu restes muet quand on te lance une pique ?",
      content: "Contenu de l'article.",
      date: "2026-03-05",
      readingTime: "10 min",
      category: "REPARTIE",
    },
  ];
  return {
    blogArticles: articles,
    getArticleBySlug: (slug: string) =>
      articles.find((a: { slug: string }) => a.slug === slug),
  };
});

jest.mock("@/lib/prisma", () => ({
  prisma: {
    blogArticle: {
      findMany: jest.fn().mockResolvedValue([]),
      findUnique: jest.fn().mockResolvedValue(null),
    },
  },
}));

jest.mock("@/lib/blog-clusters", () => ({
  getRelatedSlugs: () => [],
  getNextInCluster: () => null,
  getPrevInCluster: () => null,
  getClusterForSlug: () => undefined,
}));

import BlogPage from "@/app/(dashboard)/blog/page";
import BlogArticlePage, {
  generateStaticParams,
  generateMetadata,
} from "@/app/(dashboard)/blog/[slug]/page";

describe("BlogPage — listing", () => {
  beforeEach(async () => {
    const BlogPageResolved = await BlogPage({ searchParams: {} });
    render(BlogPageResolved);
  });

  it("renders the page title", () => {
    expect(
      screen.getByText(
        "Comment devenir drôle : guides et techniques d'humour"
      )
    ).toBeInTheDocument();
  });

  it("renders the page description", () => {
    expect(
      screen.getByText(/Guides pratiques pour devenir drôle/)
    ).toBeInTheDocument();
  });

  it("renders article cards with titles", () => {
    expect(
      screen.getByText("Comment devenir drôle : le guide")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Comment avoir de la répartie : techniques")
    ).toBeInTheDocument();
  });

  it("renders category badges", () => {
    expect(screen.getAllByText("GUIDE").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("REPARTIE").length).toBeGreaterThanOrEqual(1);
  });

  it("renders excerpts", () => {
    expect(
      screen.getByText("Tu restes muet quand on te lance une pique ?")
    ).toBeInTheDocument();
  });

  it("renders dates and reading times", () => {
    expect(screen.getByText("2026-03-10")).toBeInTheDocument();
    expect(screen.getByText("12 min de lecture")).toBeInTheDocument();
  });

  it("renders links to article pages", () => {
    const links = screen.getAllByRole("link");
    const hrefs = links.map((l) => l.getAttribute("href"));
    expect(hrefs).toContain("/blog/comment-devenir-drole");
    expect(hrefs).toContain("/blog/comment-avoir-de-la-repartie");
  });

  it("renders breadcrumb navigation", () => {
    const breadcrumb = screen.getByLabelText("Fil d'Ariane");
    expect(breadcrumb).toBeInTheDocument();
    expect(screen.getByText("Accueil")).toBeInTheDocument();
  });

  it("renders JSON-LD structured data", () => {
    const jsonLdScripts = document.querySelectorAll('[data-testid="json-ld"]');
    expect(jsonLdScripts.length).toBeGreaterThanOrEqual(1);
  });
});

describe("BlogArticlePage — article detail", () => {
  it("renders article content and metadata", async () => {
    const Page = await BlogArticlePage({
      params: { slug: "comment-devenir-drole" },
    });
    render(Page);
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Comment devenir drôle : le guide",
      })
    ).toBeInTheDocument();
    expect(screen.getAllByText("GUIDE").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("2026-03-10")).toBeInTheDocument();
    expect(screen.getByText("12 min de lecture")).toBeInTheDocument();
  });

  it("renders content paragraphs", async () => {
    const Page = await BlogArticlePage({
      params: { slug: "comment-devenir-drole" },
    });
    render(Page);
    expect(screen.getByText("Premier paragraphe.")).toBeInTheDocument();
    expect(screen.getByText("Deuxième paragraphe.")).toBeInTheDocument();
  });

  it("renders CTA section with link to register", async () => {
    const Page = await BlogArticlePage({
      params: { slug: "comment-devenir-drole" },
    });
    render(Page);
    expect(
      screen.getByText("Envie de passer à l'action ?")
    ).toBeInTheDocument();
    expect(screen.getByText("Commencer à 0,99 €/mois")).toBeInTheDocument();
    const ctaLink = screen.getByText("Commencer à 0,99 €/mois").closest("a");
    expect(ctaLink).toHaveAttribute("href", "/register");
  });

  it("renders breadcrumb navigation", async () => {
    const Page = await BlogArticlePage({
      params: { slug: "comment-devenir-drole" },
    });
    render(Page);
    const breadcrumb = screen.getByLabelText("Fil d'Ariane");
    expect(breadcrumb).toBeInTheDocument();
  });

  it("renders related articles section", async () => {
    const Page = await BlogArticlePage({
      params: { slug: "comment-devenir-drole" },
    });
    render(Page);
    expect(
      screen.getByText("Continue ta progression")
    ).toBeInTheDocument();
  });

  it("calls notFound for invalid slug", async () => {
    await expect(async () => {
      const Page = await BlogArticlePage({
        params: { slug: "article-inexistant" },
      });
      render(Page);
    }).rejects.toThrow("NEXT_NOT_FOUND");
    expect(notFound).toHaveBeenCalled();
  });
});

describe("BlogArticlePage — static generation", () => {
  it("generateStaticParams returns all slugs", () => {
    const params = generateStaticParams();
    expect(params).toEqual([
      { slug: "comment-devenir-drole" },
      { slug: "comment-avoir-de-la-repartie" },
    ]);
  });

  it("generateMetadata returns article title and description", async () => {
    const metadata = await generateMetadata({
      params: { slug: "comment-devenir-drole" },
    });
    expect(metadata.title).toContain("Comment devenir drôle");
    expect(metadata.description).toContain("Être drôle");
  });

  it("generateMetadata returns fallback for invalid slug", async () => {
    const metadata = await generateMetadata({ params: { slug: "nope" } });
    expect(metadata.title).toBe("Article introuvable");
  });
});
