// Stratégie de rendu : SSR dynamique, comme /carnet (contenu filtré selon le
// plan lu en base, jamais de cache partagé). Un mois futur ou inconnu → 404.
// Contenu payant : noindex, absent du sitemap.
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CarnetPage } from "@/components/carnet/carnet-page";
import {
  carnetViewForPlan,
  deCarnetMonth,
  getCarnetByMonth,
  listCarnetMonths,
} from "@/lib/carnet";
import { NOT_FOUND_ROBOTS } from "@/lib/seo-meta";
import { readSessionPlan } from "@/lib/session-plan";

export const dynamic = "force-dynamic";

export function generateMetadata({ params }: { params: { mois: string } }): Metadata {
  // 404 : une seule consigne robots (celle de notFound()), sans bingbot hérité.
  if (!getCarnetByMonth(params.mois)) return { title: "Carnet introuvable", ...NOT_FOUND_ROBOTS };
  return {
    title: `Carnet de répartie ${deCarnetMonth(params.mois)}`,
    robots: { index: false, follow: false },
  };
}

export default async function CarnetMonthPage({ params }: { params: { mois: string } }) {
  const carnet = getCarnetByMonth(params.mois);
  if (!carnet) notFound();

  const plan = await readSessionPlan();
  return (
    <CarnetPage
      view={carnetViewForPlan(carnet, plan)}
      months={listCarnetMonths()}
      returnTo={`/carnet/${carnet.mois}`}
    />
  );
}
