export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

const BASE_URL = "https://deviens-marrant.fr";

export const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "deviens-marrant.fr",
  url: BASE_URL,
  logo: `${BASE_URL}/icon-512.png`,
  description:
    "La plateforme francophone pour apprendre à devenir drôle, avoir de la répartie et progresser en humour.",
  founder: {
    "@type": "Person",
    name: "Thomas Issa",
  },
  contactPoint: {
    "@type": "ContactPoint",
    email: "contact@deviens-marrant.fr",
    contactType: "customer service",
    availableLanguage: "French",
  },
};

export const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "deviens-marrant.fr",
  url: BASE_URL,
  description:
    "Apprends à devenir drôle, à avoir de la répartie et à faire rire ton entourage. Blagues, techniques, vidéos stand-up et parcours personnalisés.",
  inLanguage: "fr-FR",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${BASE_URL}/vannes?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

export function buildFaqJsonLd(
  faqs: { question: string; answer: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function buildArticleJsonLd(article: {
  title: string;
  excerpt: string;
  date: string;
  slug: string;
  readingTime: string;
  category: string;
  content: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    datePublished: article.date,
    dateModified: article.date,
    author: [
      {
        "@type": "Person",
        name: "Thomas Issa",
        url: `${BASE_URL}/a-propos`,
      },
      {
        "@type": "Organization",
        name: "deviens-marrant.fr",
        url: BASE_URL,
      },
    ],
    publisher: {
      "@type": "Organization",
      name: "deviens-marrant.fr",
      logo: {
        "@type": "ImageObject",
        url: `${BASE_URL}/icon-512.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${BASE_URL}/blog/${article.slug}`,
    },
    image: `${BASE_URL}/og-image.png`,
    articleSection: article.category,
    inLanguage: "fr-FR",
    wordCount: article.content.split(/\s+/).length,
  };
}

export function buildBreadcrumbJsonLd(
  items: { name: string; url: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function buildItemListJsonLd(
  items: { name: string; url: string; position: number }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: items.map((item) => ({
      "@type": "ListItem",
      position: item.position,
      name: item.name,
      url: item.url,
    })),
  };
}

export function buildVideoObjectJsonLd(video: {
  name: string;
  description: string;
  thumbnailUrl: string;
  uploadDate: string;
  contentUrl: string;
  embedUrl: string;
  duration?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: video.name,
    description: video.description,
    thumbnailUrl: video.thumbnailUrl,
    uploadDate: video.uploadDate,
    contentUrl: video.contentUrl,
    embedUrl: video.embedUrl,
    ...(video.duration && { duration: video.duration }),
    publisher: {
      "@type": "Organization",
      name: "deviens-marrant.fr",
      url: BASE_URL,
    },
    inLanguage: "fr-FR",
  };
}

export function buildCourseJsonLd(course: {
  name: string;
  description: string;
  duration: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name: course.name,
    description: course.description,
    provider: {
      "@type": "Organization",
      name: "deviens-marrant.fr",
      url: BASE_URL,
    },
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "online",
      courseWorkload: course.duration,
    },
    inLanguage: "fr-FR",
    isAccessibleForFree: false,
    offers: {
      "@type": "Offer",
      price: "0.99",
      priceCurrency: "EUR",
      availability: "https://schema.org/InStock",
    },
  };
}
