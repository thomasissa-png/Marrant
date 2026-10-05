import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LiensPageContent } from "@/components/liens/liens-page-content";
import { LIENS_RESEAUX, origineFromSegment } from "@/lib/liens";

// Stratégie de rendu : ISR 5 min, comme /liens. Deux routes seulement,
// prérendues : /liens/x (`utm_source=x`) et /liens/li (`utm_source=linkedin`) ;
// toute autre route renvoie 404 (dynamicParams = false), aucun paramètre lu
// côté serveur.
export const revalidate = 300;
export const dynamicParams = false;

interface LiensReseauProps {
  params: { reseau: string };
}

export function generateStaticParams(): Array<LiensReseauProps["params"]> {
  return Object.keys(LIENS_RESEAUX).map((reseau) => ({ reseau }));
}

export function generateMetadata({ params }: LiensReseauProps): Metadata {
  return {
    title: "Liens",
    description: "Le dernier article, la vanne du jour et les parcours de deviens-marrant.fr.",
    alternates: { canonical: `https://deviens-marrant.fr/liens/${params.reseau}` },
    robots: { index: false, follow: true },
  };
}

export default async function LiensReseauPage({ params }: LiensReseauProps) {
  // `params.reseau` est toujours `x` ou `li` (dynamicParams = false) : garde-fou.
  const origine = origineFromSegment(params.reseau ?? "");
  if (!origine) notFound();
  return LiensPageContent({ origine });
}
