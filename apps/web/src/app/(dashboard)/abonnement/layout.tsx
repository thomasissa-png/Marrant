import type { Metadata } from "next";
import { JsonLd, buildFaqJsonLd, buildProductJsonLd } from "@/components/seo/json-ld";
import { faqs as faqSectionFaqs } from "@/lib/faqs";
import { getContentStatsRounded } from "@/lib/content-stats-server";

export async function generateMetadata(): Promise<Metadata> {
  // Décision Thomas (03/10/2026) : les parcours complets sont la valeur
  // principale ; compteurs dynamiques, aucun chiffre en dur.
  const stats = await getContentStatsRounded();
  const catalogue = [
    stats.jokes > 0 ? `${stats.jokes}+ vannes` : null,
    stats.tips > 0 ? `${stats.tips}+ conseils` : null,
    stats.videos > 0 ? `${stats.videos}+ vidéos analysées` : null,
  ].filter(Boolean);
  const catalogueText = catalogue.length > 0 ? ` et toutes les listes (${catalogue.join(", ")})` : " et toutes les listes";
  return {
    title: "Abonnement Premium : 4,99 €/mois",
    description: `Les 3 parcours en entier (première étape offerte)${catalogueText}, à 4,99 €/mois. Sans engagement, tu annules quand tu veux.`,
    alternates: {
      canonical: "https://deviens-marrant.fr/abonnement",
    },
  };
}

export default function AbonnementLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <JsonLd data={buildProductJsonLd()} />
      <JsonLd data={buildFaqJsonLd(faqSectionFaqs)} />
      {children}
    </>
  );
}
