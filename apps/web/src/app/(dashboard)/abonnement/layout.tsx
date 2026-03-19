import type { Metadata } from "next";
import { JsonLd, buildFaqJsonLd, buildProductJsonLd } from "@/components/seo/json-ld";
import { faqs as faqSectionFaqs } from "@/lib/faqs";

export const metadata: Metadata = {
  title: "Abonnement Premium — 0,99 €/mois",
  description:
    "Accède à toutes les vannes, conseils, vidéos et parcours pour devenir drôle. Sans engagement, annulable à tout moment.",
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
