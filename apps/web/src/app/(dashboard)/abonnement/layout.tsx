import type { Metadata } from "next";
import { JsonLd, buildFaqJsonLd, buildProductJsonLd } from "@/components/seo/json-ld";
import { faqs as faqSectionFaqs } from "@/lib/faqs";

export const metadata: Metadata = {
  title: "Abonnement Premium — 0,99 €/mois",
  description:
    "290+ vannes, 60+ conseils, 80+ vidéos analysées, 3 parcours : tout pour devenir drôle à 0,99 €/mois. Sans engagement, tu annules quand tu veux.",
  alternates: {
    canonical: "https://deviens-marrant.fr/abonnement",
  },
};

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
