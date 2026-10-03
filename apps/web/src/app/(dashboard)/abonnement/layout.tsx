import type { Metadata } from "next";
import { JsonLd, buildFaqJsonLd, buildProductJsonLd } from "@/components/seo/json-ld";
import { faqs as faqSectionFaqs } from "@/lib/faqs";
import { getContentStatsRounded } from "@/lib/content-stats-server";

export async function generateMetadata(): Promise<Metadata> {
  const stats = await getContentStatsRounded();
  const jokes = stats.jokes > 0 ? `${stats.jokes}+ vannes` : "des centaines de vannes";
  const tips = stats.tips > 0 ? `${stats.tips}+ conseils` : "des dizaines de conseils";
  const videos = stats.videos > 0 ? `${stats.videos}+ vidéos` : "des dizaines de vidéos";
  return {
    title: "Abonnement Premium : 4,99 €/mois",
    description: `${jokes}, ${tips}, ${videos} analysées, 3 parcours : tout pour devenir drôle à 4,99 €/mois. Sans engagement, tu annules quand tu veux.`,
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
