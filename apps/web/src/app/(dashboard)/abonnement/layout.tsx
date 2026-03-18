import type { Metadata } from "next";
import { JsonLd, buildFaqJsonLd } from "@/components/seo/json-ld";
import { faqs as faqSectionFaqs } from "@/components/home/faq-section";

export const metadata: Metadata = {
  title: "Abonnement — 0,99 €/mois",
  description:
    "Abonne-toi à deviens-marrant.fr pour accéder à toutes les vannes, conseils, vidéos stand-up et parcours. Sans engagement, annulable à tout moment.",
  alternates: { canonical: "https://deviens-marrant.fr/abonnement" },
};

export default function AbonnementLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <JsonLd data={buildFaqJsonLd(faqSectionFaqs)} />
      {children}
    </>
  );
}
