import { render } from "@testing-library/react";
import {
  JsonLd,
  organizationJsonLd,
  websiteJsonLd,
  buildFaqJsonLd,
  buildArticleJsonLd,
  buildBreadcrumbJsonLd,
  buildCourseJsonLd,
  BLOG_OG_IMAGE_SEGMENT,
  OFFICIAL_SOCIAL_PROFILES,
  getSocialProfiles,
} from "@/components/seo/json-ld";
const { djb2Hash } = require("next/dist/shared/lib/hash") as { djb2Hash: (s: string) => number };

describe("JsonLd component", () => {
  it("renders a script tag with application/ld+json type", () => {
    const data = { "@type": "WebSite", name: "Test" };
    const { container } = render(<JsonLd data={data} />);
    const script = container.querySelector('script[type="application/ld+json"]');
    expect(script).toBeInTheDocument();
    expect(script?.innerHTML).toBe(JSON.stringify(data));
  });

  it("échappe « < » pour qu'un texte « </script> » ne ferme pas la balise", () => {
    const data = { name: "a </script><script>alert(1)</script>" };
    const { container } = render(<JsonLd data={data} />);
    const script = container.querySelector('script[type="application/ld+json"]');
    expect(script?.innerHTML).not.toContain("</script>");
    expect(JSON.parse(script?.innerHTML ?? "{}")).toEqual(data);
  });
});

describe("BLOG_OG_IMAGE_SEGMENT", () => {
  it("correspond au suffixe que Next.js donne à /(dashboard)/blog/[slug]/opengraph-image", () => {
    // Même calcul que next/dist/lib/metadata/get-metadata-route (getMetadataRouteSuffix).
    const suffix = djb2Hash("/(dashboard)/blog/[slug]").toString(36).slice(0, 6);
    expect(BLOG_OG_IMAGE_SEGMENT).toBe(`opengraph-image-${suffix}`);
  });
});

describe("organizationJsonLd", () => {
  it("has correct schema type and properties", () => {
    expect(organizationJsonLd["@context"]).toBe("https://schema.org");
    expect(organizationJsonLd["@type"]).toBe("Organization");
    expect(organizationJsonLd.name).toBe("deviens-marrant.fr");
    expect(organizationJsonLd.url).toBe("https://deviens-marrant.fr");
    // logo est un ImageObject complet (url + width + height) — requis par Google Rich Results
    expect(organizationJsonLd.logo).toMatchObject({
      "@type": "ImageObject",
      width: 512,
      height: 512,
    });
    expect((organizationJsonLd.logo as { url: string }).url).toContain("icon-512.png");
  });

  it("émet les comptes sociaux officiels dans sameAs (lot S3c, confirmés par Thomas)", () => {
    // Le module a été chargé sans NEXT_PUBLIC_SOCIAL_PROFILES par défaut dans jest.setup.
    if (!process.env.NEXT_PUBLIC_SOCIAL_PROFILES) {
      expect(organizationJsonLd.sameAs).toEqual([
        "https://www.instagram.com/deviensmarrant/",
        "https://x.com/deviensmarrant",
        "https://www.linkedin.com/company/deviens-marrant",
      ]);
    }
  });

  it("NEXT_PUBLIC_SOCIAL_PROFILES reste une surcharge de la liste officielle", () => {
    expect(getSocialProfiles(undefined)).toEqual([...OFFICIAL_SOCIAL_PROFILES]);
    expect(getSocialProfiles("")).toEqual([...OFFICIAL_SOCIAL_PROFILES]);
    expect(getSocialProfiles("pas-une-url")).toEqual([...OFFICIAL_SOCIAL_PROFILES]);
    expect(getSocialProfiles(" https://a.test/x , https://b.test/y ")).toEqual([
      "https://a.test/x",
      "https://b.test/y",
    ]);
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
    // Sans updatedAt, dateModified fallback sur datePublished
    expect(result.dateModified).toBe("2026-03-13");
    expect(result.mainEntityOfPage["@id"]).toContain("/blog/test-article");
    expect(result.inLanguage).toBe("fr-FR");
    expect(result.wordCount).toBe(5);
    expect(result.articleSection).toBe("GUIDE");
    // image doit pointer vers l'OG dynamique par article (pas /og-image.png qui 404)
    // (même URL que og:image, suffixe du groupe de routes compris — sinon 404)
    expect(result.image).toBe(`https://deviens-marrant.fr/blog/test-article/${BLOG_OG_IMAGE_SEGMENT}`);
  });

  it("uses updatedAt for dateModified when provided (vrai updatedAt DB)", () => {
    const article = {
      title: "T",
      excerpt: "E",
      date: "2026-01-01",
      updatedAt: "2026-03-15",
      slug: "t",
      readingTime: "1 min",
      category: "GUIDE",
      content: "a",
    };
    const result = buildArticleJsonLd(article);
    expect(result.datePublished).toBe("2026-01-01");
    expect(result.dateModified).toBe("2026-03-15");
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
    // provider.logo reste une string simple (schema Course accepte les deux formats)
    expect(String(result.provider.logo)).toContain("icon-512.png");
    expect(result.hasCourseInstance.courseMode).toBe("online");
    expect(result.hasCourseInstance.courseWorkload).toBe("P4W");
    expect(result.url).toContain("/parcours/repartie");
    expect(result.educationalLevel).toBe("Intermediate");
    // numberOfLessons retiré : non reconnu par Schema.org Course
    expect(result.offers.price).toBe("2.99");
    expect(result.offers.priceCurrency).toBe("EUR");
    expect(result.offers.category).toBe("Paid");
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
    expect((result as { numberOfLessons?: number }).numberOfLessons).toBeUndefined();
  });
});
