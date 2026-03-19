import { render } from "@testing-library/react";
import {
  JsonLd,
  organizationJsonLd,
  websiteJsonLd,
  buildFaqJsonLd,
  buildArticleJsonLd,
  buildBreadcrumbJsonLd,
  buildCourseJsonLd,
} from "@/components/seo/json-ld";

describe("JsonLd component", () => {
  it("renders a script tag with application/ld+json type", () => {
    const data = { "@type": "WebSite", name: "Test" };
    const { container } = render(<JsonLd data={data} />);
    const script = container.querySelector('script[type="application/ld+json"]');
    expect(script).toBeInTheDocument();
    expect(script?.innerHTML).toBe(JSON.stringify(data));
  });
});

describe("organizationJsonLd", () => {
  it("has correct schema type and properties", () => {
    expect(organizationJsonLd["@context"]).toBe("https://schema.org");
    expect(organizationJsonLd["@type"]).toBe("Organization");
    expect(organizationJsonLd.name).toBe("deviens-marrant.fr");
    expect(organizationJsonLd.url).toBe("https://deviens-marrant.fr");
    expect(organizationJsonLd.logo).toContain("icon-512.png");
  });
});

describe("websiteJsonLd", () => {
  it("has correct schema type and properties", () => {
    expect(websiteJsonLd["@context"]).toBe("https://schema.org");
    expect(websiteJsonLd["@type"]).toBe("WebSite");
    expect(websiteJsonLd.name).toBe("deviens-marrant.fr");
    expect(websiteJsonLd.inLanguage).toBe("fr-FR");
  });
});

describe("buildFaqJsonLd", () => {
  it("builds valid FAQPage schema", () => {
    const faqs = [
      { question: "Q1?", answer: "A1" },
      { question: "Q2?", answer: "A2" },
    ];
    const result = buildFaqJsonLd(faqs);
    expect(result["@type"]).toBe("FAQPage");
    expect(result.mainEntity).toHaveLength(2);
    expect(result.mainEntity[0]["@type"]).toBe("Question");
    expect(result.mainEntity[0].name).toBe("Q1?");
    expect(result.mainEntity[0].acceptedAnswer.text).toBe("A1");
  });
});

describe("buildArticleJsonLd", () => {
  it("builds valid Article schema with all properties", () => {
    const article = {
      title: "Test Article",
      excerpt: "Test excerpt",
      date: "2026-03-13",
      slug: "test-article",
      readingTime: "5 min",
      category: "GUIDE",
      content: "word1 word2 word3 word4 word5",
    };
    const result = buildArticleJsonLd(article);
    expect(result["@type"]).toBe("Article");
    expect(result.headline).toBe("Test Article");
    expect(result.description).toBe("Test excerpt");
    expect(result.datePublished).toBe("2026-03-13");
    expect(result.mainEntityOfPage["@id"]).toContain("/blog/test-article");
    expect(result.inLanguage).toBe("fr-FR");
    expect(result.wordCount).toBe(5);
    expect(result.articleSection).toBe("GUIDE");
  });
});

describe("buildBreadcrumbJsonLd", () => {
  it("builds valid BreadcrumbList schema with positions", () => {
    const items = [
      { name: "Accueil", url: "https://deviens-marrant.fr" },
      { name: "Blog", url: "https://deviens-marrant.fr/blog" },
    ];
    const result = buildBreadcrumbJsonLd(items);
    expect(result["@type"]).toBe("BreadcrumbList");
    expect(result.itemListElement).toHaveLength(2);
    expect(result.itemListElement[0].position).toBe(1);
    expect(result.itemListElement[0].name).toBe("Accueil");
    expect(result.itemListElement[1].position).toBe(2);
    expect(result.itemListElement[1].name).toBe("Blog");
  });
});

describe("buildCourseJsonLd", () => {
  it("builds valid Course schema with pricing and ISO 8601 duration", () => {
    const course = {
      name: "Parcours Répartie",
      description: "Développe ta répartie en 4 semaines",
      duration: "4 semaines",
      slug: "repartie",
      difficulty: "INTERMEDIAIRE",
      stepsCount: 4,
    };
    const result = buildCourseJsonLd(course);
    expect(result["@type"]).toBe("Course");
    expect(result.name).toBe("Parcours Répartie");
    expect(result.provider.name).toBe("deviens-marrant.fr");
    expect(result.provider.logo).toContain("icon-512.png");
    expect(result.hasCourseInstance.courseMode).toBe("online");
    expect(result.hasCourseInstance.courseWorkload).toBe("P4W");
    expect(result.url).toContain("/parcours/repartie");
    expect(result.educationalLevel).toBe("Intermediate");
    expect(result.numberOfLessons).toBe(4);
    expect(result.offers.price).toBe("0.99");
    expect(result.offers.priceCurrency).toBe("EUR");
    expect(result.offers.url).toContain("/abonnement");
    expect(result.inLanguage).toBe("fr-FR");
  });

  it("handles missing optional properties", () => {
    const result = buildCourseJsonLd({
      name: "Test",
      description: "Desc",
      duration: "3 semaines",
    });
    expect(result.hasCourseInstance.courseWorkload).toBe("P3W");
    expect(result.educationalLevel).toBe("Beginner");
    expect(result.url).toBeUndefined();
    expect(result.numberOfLessons).toBeUndefined();
  });
});
