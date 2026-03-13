import { render, screen } from "@testing-library/react";

const notFoundError = new Error("NEXT_NOT_FOUND");

jest.mock("next/navigation", () => ({
  notFound: jest.fn(() => {
    throw notFoundError;
  }),
}));

const { notFound } = require("next/navigation");

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

import BlogPage from "@/app/(dashboard)/blog/page";
import BlogArticlePage, {
  generateStaticParams,
  generateMetadata,
} from "@/app/(dashboard)/blog/[slug]/page";

describe("BlogPage — listing", () => {
  beforeEach(() => {
    render(<BlogPage />);
  });

  it("renders the page title", () => {
    expect(screen.getByText("Blog humour et répartie")).toBeInTheDocument();
  });

  it("renders the page description", () => {
    expect(
      screen.getByText(/Articles pratiques pour progresser/)
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
});

describe("BlogArticlePage — article detail", () => {
  it("renders article content and metadata", () => {
    render(<BlogArticlePage params={{ slug: "techniques-repartie" }} />);
    expect(
      screen.getByText("7 techniques de répartie qui marchent vraiment")
    ).toBeInTheDocument();
    expect(screen.getByText("REPARTIE")).toBeInTheDocument();
    expect(screen.getByText("2026-03-10")).toBeInTheDocument();
    expect(screen.getByText("5 min de lecture")).toBeInTheDocument();
  });

  it("renders content paragraphs", () => {
    render(<BlogArticlePage params={{ slug: "techniques-repartie" }} />);
    expect(screen.getByText("Premier paragraphe.")).toBeInTheDocument();
    expect(screen.getByText("Deuxième paragraphe.")).toBeInTheDocument();
  });

  it("renders CTA section with link to register", () => {
    render(<BlogArticlePage params={{ slug: "techniques-repartie" }} />);
    expect(screen.getByText("Prêt à progresser ?")).toBeInTheDocument();
    expect(screen.getByText("Essaie gratuitement")).toBeInTheDocument();
    const ctaLink = screen.getByText("Essaie gratuitement").closest("a");
    expect(ctaLink).toHaveAttribute("href", "/register");
  });

  it("calls notFound for invalid slug", () => {
    expect(() =>
      render(<BlogArticlePage params={{ slug: "article-inexistant" }} />)
    ).toThrow("NEXT_NOT_FOUND");
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

  it("generateMetadata returns article title and description", () => {
    const metadata = generateMetadata({ params: { slug: "techniques-repartie" } });
    expect(metadata.title).toContain("7 techniques de répartie");
    expect(metadata.description).toContain("Tu restes muet");
  });

  it("generateMetadata returns fallback for invalid slug", () => {
    const metadata = generateMetadata({ params: { slug: "nope" } });
    expect(metadata.title).toBe("Article introuvable");
  });
});
