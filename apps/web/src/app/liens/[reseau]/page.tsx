import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LiensPageContent } from "@/components/liens/liens-page-content";
import { LIENS_RESEAUX, origineFromSegment } from "@/lib/liens";
import { NOT_FOUND_ROBOTS } from "@/lib/seo-meta";

// Stratégie de rendu : ISR 5 min, comme /liens. Deux routes seulement,
// prérendues : /liens/x (`utm_source=x`) et /liens/li (`utm_source=linkedin`) ;
// toute autre route renvoie 404 par `notFound()` (garde `origineFromSegment`).
// `dynamicParams = false` est volontairement absent : sur Cloudflare (OpenNext),
// il faisait répondre 404 aussi aux deux routes prérendues (constaté le 05/10).
export const revalidate = 300;
export const dynamicParams = true;

interface LiensReseauProps {
  params: { reseau: string };
}

export function generateStaticParams(): Array<LiensReseauProps["params"]> {
  return Object.keys(LIENS_RESEAUX).map((reseau) => ({ reseau }));
}

export function generateMetadata({ params }: LiensReseauProps): Metadata {
  // 404 : une seule consigne robots (celle de notFound()), sans bingbot hérité.
  if (!origineFromSegment(params.reseau ?? "")) return { title: "Page introuvable", ...NOT_FOUND_ROBOTS };
  return {
    title: "Liens",
    description: "Le dernier article, la vanne du jour et les parcours de deviens-marrant.fr.",
    alternates: { canonical: `https://deviens-marrant.fr/liens/${params.reseau}` },
    robots: { index: false, follow: true },
  };
}

export default async function LiensReseauPage({ params }: LiensReseauProps) {
  // Segment hors liste blanche (ex. `ig`) : 404.
  const origine = origineFromSegment(params.reseau ?? "");
  if (!origine) notFound();
  return LiensPageContent({ origine });
}
