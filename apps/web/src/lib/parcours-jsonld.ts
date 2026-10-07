/**
 * Données structurées des parcours (SEO-04, audit s17) :
 * - une seule entité Course par parcours, avec un `@id` stable, publiée sur sa
 *   page détail ; le hub /parcours n'en publie plus de copie (ItemList de liens) ;
 * - prix lu dans `config/premium` (jamais écrit en dur) ;
 * - niveau lu dans le seed (FS-11), aucun tiret cadratin dans les noms.
 */
import { ORGANIZATION_ID } from "@/components/seo/json-ld";
import { PREMIUM_MONTHLY_PRICE_CENTS } from "@/config/premium";
import { stripEmDashes } from "@/lib/em-dash";

const BASE_URL = "https://deviens-marrant.fr";

export function parcoursUrl(slug: string): string {
  return `${BASE_URL}/parcours/${slug}`;
}

/** `@id` de l'entité Course d'un parcours, partagé par la page détail et le hub. */
export function parcoursCourseId(slug: string): string {
  return `${parcoursUrl(slug)}#course`;
}

/** « 2.99 » : format schema.org, depuis le prix affiché du mensuel. */
export function premiumMonthlyPriceSchema(): string {
  return (PREMIUM_MONTHLY_PRICE_CENTS / 100).toFixed(2);
}

function educationalLevel(difficulty: string): string {
  switch (difficulty) {
    case "INTERMEDIAIRE":
      return "Intermediate";
    case "EXPERT":
      return "Advanced";
    default:
      return "Beginner";
  }
}

export function buildParcoursCourseJsonLd(course: {
  slug: string;
  name: string;
  description: string;
  weeks: number;
  difficulty: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    "@id": parcoursCourseId(course.slug),
    name: stripEmDashes(course.name),
    description: stripEmDashes(course.description),
    url: parcoursUrl(course.slug),
    provider: { "@id": ORGANIZATION_ID },
    inLanguage: "fr-FR",
    educationalLevel: educationalLevel(course.difficulty),
    // Étape 1 lisible sans compte, la suite avec l'abonnement : le cours n'est
    // pas gratuit en entier (description : « première étape gratuite »).
    isAccessibleForFree: false,
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "online",
      courseWorkload: `P${course.weeks}W`,
    },
    offers: {
      "@type": "Offer",
      price: premiumMonthlyPriceSchema(),
      priceCurrency: "EUR",
      availability: "https://schema.org/InStock",
      url: `${BASE_URL}/abonnement`,
      category: "Paid",
    },
  };
}

/** Hub /parcours : liste des parcours, sans redéfinir les cours. */
export function buildParcoursItemListJsonLd(items: ReadonlyArray<{ slug: string; name: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${BASE_URL}/parcours#liste`,
    name: "Parcours Deviens Marrant",
    numberOfItems: items.length,
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: parcoursUrl(item.slug),
      name: stripEmDashes(item.name),
    })),
  };
}
