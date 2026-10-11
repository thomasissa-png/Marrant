// Stratégie de rendu : SSR dynamique (jamais de cache partagé).
// Le contenu dépend du plan lu en base : un abonné reçoit le carnet complet,
// un visiteur non Premium la première fiche + les titres/contextes des autres.
// Le filtrage se fait ICI, côté serveur : rien d'autre n'est dans le HTML ni
// dans le JS client. Contenu payant : noindex, absent du sitemap.
import type { Metadata } from "next";
import Link from "next/link";
import { CarnetPage } from "@/components/carnet/carnet-page";
import { carnetViewForPlan, getCurrentCarnet, listCarnetMonths } from "@/lib/carnet";
import { readSessionPlan } from "@/lib/session-plan";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Le carnet de répartie du mois",
  description:
    "Chaque mois, des situations du quotidien et la réplique qui va avec : ce qu'on te dit, quoi répondre, pourquoi ça marche et quoi faire si ça se tend.",
  robots: { index: false, follow: false },
};

export default async function CarnetCurrentPage() {
  const carnet = getCurrentCarnet();

  if (!carnet) {
    return (
      <div className="mx-auto max-w-2xl py-12 text-center">
        <h1 className="font-display text-3xl font-bold">Le carnet du mois arrive</h1>
        <p className="mt-3 text-text-secondary">
          Les situations de ce mois sont encore en préparation. En attendant, entraîne ta répartie
          avec les parcours.
        </p>
        <Link href="/parcours" className="mt-4 inline-block text-accent-link hover:underline">
          Voir les parcours
        </Link>
      </div>
    );
  }

  const plan = await readSessionPlan();
  return (
    <CarnetPage
      view={carnetViewForPlan(carnet, plan)}
      months={listCarnetMonths()}
      returnTo="/carnet"
    />
  );
}
