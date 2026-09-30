export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // `<` échappé : un texte venu de la base (vanne, titre, FAQ) contenant
      // « </script> » fermerait sinon la balise et casserait la page.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

const BASE_URL = "https://deviens-marrant.fr";

/**
 * Identifiants d'entité stables (GEO / knowledge graph) : chaque bloc JSON-LD
 * qui parle de la marque ou de l'auteur référence le MÊME @id, pour que les
 * moteurs consolident une seule entité au lieu de N objets anonymes.
 */
export const ORGANIZATION_ID = `${BASE_URL}/#organization`;
export const WEBSITE_ID = `${BASE_URL}/#website`;
export const AUTHOR_ID = `${BASE_URL}/a-propos#alex-durand`;

/**
 * Suffixe que Next.js 14 ajoute aux routes d'image OG d'un segment situé dans
 * un groupe de routes (`(dashboard)`) : djb2("/(dashboard)/blog/[slug]") en
 * base 36, 6 caractères. L'URL réelle est donc
 * `/blog/<slug>/opengraph-image-1z0cf4` ; `/blog/<slug>/opengraph-image`
 * renvoie 404. Test de garde : `__tests__/ui/json-ld.test.tsx`.
 */
export const BLOG_OG_IMAGE_SEGMENT = "opengraph-image-1z0cf4";

/**
 * Person schema for author — improves E-E-A-T signals for LLMs (GEO).
 * LLMs (ChatGPT, Perplexity, Claude) use Person schema to attribute expertise.
 * Description alignée mot pour mot sur la page /a-propos (cohérence d'entité).
 */
export const authorPersonJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": AUTHOR_ID,
  name: "Alex Durand",
  url: `${BASE_URL}/a-propos`,
  mainEntityOfPage: `${BASE_URL}/a-propos`,
  description:
    "Fondateur de deviens-marrant.fr, passionné de stand-up et de pédagogie.",
  jobTitle: "Fondateur",
  knowsAbout: [
    "Stand-up comedy",
    "Écriture comique",
    "Techniques de répartie",
    "Psychologie de l'humour",
    "Humour français contemporain",
    "Formation à l'humour",
  ],
  worksFor: {
    "@type": "Organization",
    "@id": ORGANIZATION_ID,
    name: "deviens-marrant.fr",
    url: BASE_URL,
  },
};

/**
 * CollectionPage schema builder — helps LLMs recognize catalog pages.
 */
export function buildCollectionPageJsonLd(collection: {
  name: string;
  description: string;
  url: string;
  numberOfItems: number;
  relatedArticles?: { title: string; url: string }[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: collection.name,
    description: collection.description,
    url: collection.url,
    inLanguage: "fr-FR",
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: collection.numberOfItems,
    },
    ...(collection.relatedArticles &&
      collection.relatedArticles.length > 0 && {
        hasPart: collection.relatedArticles.map((a) => ({
          "@type": "Article",
          headline: a.title,
          url: a.url,
        })),
      }),
  };
}

/**
 * Comptes sociaux officiels de la marque, confirmés par Thomas le 30/09/2026
 * (lot S3c s14, audit SEO P0-3). Source unique du `sameAs` de l'Organization.
 */
export const OFFICIAL_SOCIAL_PROFILES = [
  "https://www.instagram.com/deviensmarrant/",
  "https://x.com/deviensmarrant",
  "https://www.linkedin.com/company/deviens-marrant",
] as const;

/**
 * Profils émis dans `sameAs`. NEXT_PUBLIC_SOCIAL_PROFILES (URLs séparées par
 * des virgules) reste une surcharge : si elle contient au moins une URL
 * valide, elle remplace la liste officielle.
 */
export function getSocialProfiles(raw = process.env.NEXT_PUBLIC_SOCIAL_PROFILES): string[] {
  const override = (raw ?? "")
    .split(",")
    .map((u) => u.trim())
    .filter((u) => u.length > 0 && /^https?:\/\//.test(u));
  return override.length > 0 ? override : [...OFFICIAL_SOCIAL_PROFILES];
}

const socialProfiles = getSocialProfiles();

export const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": ORGANIZATION_ID,
  name: "deviens-marrant.fr",
  // Nom de marque utilisé en signature (« L'Équipe Deviens Marrant ») et sur
  // les réseaux : aide les moteurs à relier les deux graphies à la même entité.
  alternateName: "Deviens Marrant",
  url: BASE_URL,
  // ImageObject complet (width + height requis par les Rich Results Google
  // pour Organization.logo — sinon le logo est ignoré).
  logo: {
    "@type": "ImageObject",
    url: `${BASE_URL}/icon-512.png`,
    width: 512,
    height: 512,
  },
  description:
    "La plateforme francophone pour apprendre à devenir drôle, avoir de la répartie et progresser en humour.",
  founder: {
    "@type": "Person",
    "@id": AUTHOR_ID,
    name: "Alex Durand",
  },
  contactPoint: {
    "@type": "ContactPoint",
    email: "contact@deviens-marrant.fr",
    contactType: "customer service",
    availableLanguage: "French",
  },
  sameAs: socialProfiles,
};

export const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": WEBSITE_ID,
  name: "deviens-marrant.fr",
  alternateName: "Deviens Marrant",
  url: BASE_URL,
  publisher: { "@id": ORGANIZATION_ID },
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
  /**
   * ISO date de dernière modification. Doit refléter le vrai updatedAt de la
   * source (colonne DB BlogArticle.updatedAt côté DB, champ updatedAt côté
   * statique). Si absent → fallback sur date de publication.
   */
  updatedAt?: string;
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
    dateModified: article.updatedAt || article.date,
    author: [
      {
        "@type": "Person",
        "@id": AUTHOR_ID,
        name: "Alex Durand",
        url: `${BASE_URL}/a-propos`,
      },
      {
        "@type": "Organization",
        "@id": ORGANIZATION_ID,
        name: "deviens-marrant.fr",
        url: BASE_URL,
      },
    ],
    publisher: {
      "@type": "Organization",
      "@id": ORGANIZATION_ID,
      name: "deviens-marrant.fr",
      logo: {
        "@type": "ImageObject",
        url: `${BASE_URL}/icon-512.png`,
        width: 512,
        height: 512,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${BASE_URL}/blog/${article.slug}`,
    },
    // Chaque article a son propre opengraph-image dynamique — même URL que og:image
    // (suffixe du groupe de routes inclus, sinon 404 : voir BLOG_OG_IMAGE_SEGMENT).
    image: `${BASE_URL}/blog/${article.slug}/${BLOG_OG_IMAGE_SEGMENT}`,
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

// Map human-readable duration to ISO 8601
function toIso8601Duration(duration: string): string {
  const match = duration.match(/(\d+)\s*semaine/i);
  if (match) return `P${match[1]}W`;
  return duration;
}

// Map difficulty to schema.org educationalLevel
function toEducationalLevel(difficulty?: string): string {
  switch (difficulty) {
    case "DEBUTANT": return "Beginner";
    case "INTERMEDIAIRE": return "Intermediate";
    case "EXPERT": return "Advanced";
    default: return "Beginner";
  }
}

export function buildProductJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "deviens-marrant.fr Premium",
    description:
      "Accès complet : vannes, conseils, vidéos stand-up analysées, parcours structurés et contenu quotidien pour devenir drôle.",
    // /og-image.png retournait 404 → OG dynamique Next.js (opengraph-image.tsx)
    image: [
      `${BASE_URL}/opengraph-image`,
      `${BASE_URL}/icon-512.png`,
    ],
    brand: {
      "@type": "Brand",
      name: "deviens-marrant.fr",
    },
    offers: {
      "@type": "Offer",
      price: "0.99",
      priceCurrency: "EUR",
      availability: "https://schema.org/InStock",
      url: `${BASE_URL}/abonnement`,
      priceValidUntil: "2026-12-31",
      category: "Subscription",
      seller: {
        "@type": "Organization",
        name: "deviens-marrant.fr",
      },
    },
  };
}

export function buildHowToJsonLd(howTo: {
  name: string;
  description: string;
  steps: { name: string; text: string }[];
  totalTime?: string; // ISO 8601 duration, e.g. "PT30M"
}) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: howTo.name,
    description: howTo.description,
    ...(howTo.totalTime && { totalTime: howTo.totalTime }),
    step: howTo.steps.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: step.name,
      text: step.text,
    })),
    inLanguage: "fr-FR",
  };
}

export function buildDefinedTermListJsonLd(
  terms: { term: string; definition: string; url: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "DefinedTermSet",
    name: "Glossaire humour",
    description:
      "Les 12 termes clés de l'humour expliqués : répartie, timing, punchline, callback et plus.",
    url: `${BASE_URL}/glossaire`,
    hasDefinedTerm: terms.map((t) => ({
      "@type": "DefinedTerm",
      name: t.term,
      description: t.definition,
      url: t.url,
      inDefinedTermSet: `${BASE_URL}/glossaire`,
    })),
  };
}

export function buildCourseJsonLd(course: {
  name: string;
  description: string;
  duration: string;
  slug?: string;
  difficulty?: string;
  stepsCount?: number;
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
      logo: `${BASE_URL}/icon-512.png`,
    },
    ...(course.slug && { url: `${BASE_URL}/parcours/${course.slug}` }),
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "online",
      courseWorkload: toIso8601Duration(course.duration),
    },
    educationalLevel: toEducationalLevel(course.difficulty),
    // numberOfLessons n'existe pas dans Schema.org Course → utiliser numberOfCredits ou hasPart
    // Le plus simple et valide : ne rien mettre, l'info est déjà dans la description
    inLanguage: "fr-FR",
    isAccessibleForFree: false,
    offers: {
      "@type": "Offer",
      price: "0.99",
      priceCurrency: "EUR",
      availability: "https://schema.org/InStock",
      url: `${BASE_URL}/abonnement`,
      category: "Paid",
    },
  };
}
