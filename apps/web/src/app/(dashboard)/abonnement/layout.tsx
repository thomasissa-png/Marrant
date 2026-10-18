import type { Metadata } from "next";
import { JsonLd, buildFaqJsonLd, buildProductJsonLd } from "@/components/seo/json-ld";
import { getPremiumFaqs } from "@/lib/faqs";
import { getContentStatsRounded } from "@/lib/content-stats-server";
import { isAnnualPlanAvailable } from "@/lib/premium-plan-availability";
import { PARCOURS_COUNT, PREMIUM_ANNUAL_PRICE_LABEL, PREMIUM_PRICE_LABEL } from "@/config/premium";

// Rendu dynamique (s14, 04/10/2026) : l'annuel (page, JSON-LD, FAQ, metadata)
// dépend du secret serveur STRIPE_PREMIUM_ANNUAL_PRICE_ID, lu à chaque requête.
export const dynamic = "force-dynamic";

// Alerte Ahrefs (s20) au-delà de 160 caractères : marge à 155.
const META_DESCRIPTION_MAX = 155;

export async function generateMetadata(): Promise<Metadata> {
  // Décision Thomas (03/10/2026) : les parcours complets sont la valeur
  // principale ; compteurs dynamiques, aucun chiffre en dur.
  const stats = await getContentStatsRounded();
  const catalogue = [
    stats.jokes > 0 ? `${stats.jokes}+ vannes` : null,
    stats.tips > 0 ? `${stats.tips}+ conseils` : null,
    stats.videos > 0 ? `${stats.videos}+ vidéos` : null,
  ].filter(Boolean);
  const annual = isAnnualPlanAvailable() ? ` ou ${PREMIUM_ANNUAL_PRICE_LABEL}` : "";
  const catalogueText = catalogue.length > 0 ? `, ${catalogue.join(", ")}` : "";
  const full = `Les ${PARCOURS_COUNT} parcours en entier (première étape offerte)${catalogueText}. Premium à ${PREMIUM_PRICE_LABEL}${annual}, résiliable en ligne.`;
  // Repli sans compteurs si un compteur fait déborder la limite.
  const short = `Les ${PARCOURS_COUNT} parcours en entier (première étape offerte) et toutes les listes, à ${PREMIUM_PRICE_LABEL}${annual}, résiliable en ligne.`;
  return {
    title: `Abonnement Premium : ${PREMIUM_PRICE_LABEL}`,
    description: full.length <= META_DESCRIPTION_MAX ? full : short,
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
  const annualAvailable = isAnnualPlanAvailable();
  return (
    <>
      <JsonLd data={buildProductJsonLd({ annualAvailable })} />
      <JsonLd data={buildFaqJsonLd(getPremiumFaqs(annualAvailable))} />
      {children}
    </>
  );
}
