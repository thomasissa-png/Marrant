import { render, screen, waitFor } from "@testing-library/react";

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
}));

const mockArticlesData = [
  {
    slug: "techniques-repartie",
    title: "7 techniques de répartie qui marchent vraiment",
    excerpt: "Tu restes muet quand on te lance une pique ?",
    content: "Premier paragraphe.\n\nDeuxième paragraphe.",
    date: "2026-03-10",
    readingTime: "5 min",
    category: "REPARTIE",
  },
  {
    slug: "apprendre-etre-drole",
    title: "Peut-on vraiment apprendre à être drôle ?",
    excerpt: "Être drôle, c'est inné. Faux.",
    content: "Contenu de l'article.",
    date: "2026-03-05",
    readingTime: "4 min",
    category: "OBSERVATION",
  },
];

jest.mock("@/lib/blog-articles", () => {
  const articles = [
    {
      slug: "techniques-repartie",
      title: "7 techniques de répartie qui marchent vraiment",
      excerpt: "Tu restes muet quand on te lance une pique ?",
      content: "Premier paragraphe.\n\nDeuxième paragraphe.",
      date: "2026-03-10",
      readingTime: "5 min",
      category: "REPARTIE",
    },
    {
      slug: "apprendre-etre-drole",
      title: "Peut-on vraiment apprendre à être drôle ?",
      excerpt: "Être drôle, c'est inné. Faux.",
      content: "Contenu de l'article.",
      date: "2026-03-05",
      readingTime: "4 min",
      category: "OBSERVATION",
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

import BlogPage from "@/app/(dashboard)/blog/page";
import BlogArticlePage, {
  generateStaticParams,
  generateMetadata,
} from "@/app/(dashboard)/blog/[slug]/page";

describe("BlogPage — listing", () => {
  beforeEach(async () => {
    const BlogPageResolved = await BlogPage();
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
      screen.getByText(/Articles complets pour apprendre à devenir drôle/)
    ).toBeInTheDocument();
  });

  it("renders article cards with titles", () => {
    expect(
      screen.getByText("7 techniques de répartie qui marchent vraiment")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Peut-on vraiment apprendre à être drôle ?")
    ).toBeInTheDocument();
  });

  it("renders category badges", () => {
    expect(screen.getByText("REPARTIE")).toBeInTheDocument();
    expect(screen.getByText("OBSERVATION")).toBeInTheDocument();
  });

  it("renders excerpts", () => {
    expect(
      screen.getByText("Tu restes muet quand on te lance une pique ?")
    ).toBeInTheDocument();
  });

  it("renders dates and reading times", () => {
    expect(screen.getByText("2026-03-10")).toBeInTheDocument();
    expect(screen.getByText("5 min de lecture")).toBeInTheDocument();
  });

  it("renders links to article pages", () => {
    const links = screen.getAllByRole("link");
    const hrefs = links.map((l) => l.getAttribute("href"));
    expect(hrefs).toContain("/blog/techniques-repartie");
    expect(hrefs).toContain("/blog/apprendre-etre-drole");
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
      params: { slug: "techniques-repartie" },
    });
    render(Page);
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "7 techniques de répartie qui marchent vraiment",
      })
    ).toBeInTheDocument();
    expect(screen.getAllByText("REPARTIE").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("2026-03-10")).toBeInTheDocument();
    expect(screen.getByText("5 min de lecture")).toBeInTheDocument();
  });

  it("renders content paragraphs", async () => {
    const Page = await BlogArticlePage({
      params: { slug: "techniques-repartie" },
    });
    render(Page);
    expect(screen.getByText("Premier paragraphe.")).toBeInTheDocument();
    expect(screen.getByText("Deuxième paragraphe.")).toBeInTheDocument();
  });

  it("renders CTA section with link to register", async () => {
    const Page = await BlogArticlePage({
      params: { slug: "techniques-repartie" },
    });
    render(Page);
    expect(
      screen.getByText("Envie de passer à l'action ?")
    ).toBeInTheDocument();
    expect(screen.getByText("Essaie gratuitement")).toBeInTheDocument();
    const ctaLink = screen.getByText("Essaie gratuitement").closest("a");
    expect(ctaLink).toHaveAttribute("href", "/register");
  });

  it("renders breadcrumb navigation", async () => {
    const Page = await BlogArticlePage({
      params: { slug: "techniques-repartie" },
    });
    render(Page);
    const breadcrumb = screen.getByLabelText("Fil d'Ariane");
    expect(breadcrumb).toBeInTheDocument();
  });

  it("renders related articles section", async () => {
    const Page = await BlogArticlePage({
      params: { slug: "techniques-repartie" },
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
      { slug: "techniques-repartie" },
      { slug: "apprendre-etre-drole" },
    ]);
  });

  it("generateMetadata returns article title and description", async () => {
    const metadata = await generateMetadata({
      params: { slug: "techniques-repartie" },
    });
    expect(metadata.title).toContain("7 techniques de répartie");
    expect(metadata.description).toContain("Tu restes muet");
  });

  it("generateMetadata returns fallback for invalid slug", async () => {
    const metadata = await generateMetadata({ params: { slug: "nope" } });
    expect(metadata.title).toBe("Article introuvable");
  });
});
