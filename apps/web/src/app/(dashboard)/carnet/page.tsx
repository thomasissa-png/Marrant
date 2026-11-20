// Stratégie de rendu : SSR dynamique (jamais de cache partagé).
// Le contenu dépend du plan lu en base : un abonné reçoit le carnet complet,
// un visiteur non Premium la fiche offerte (lib/carnet `ficheOfferte`) + les titres/contextes des autres.
// Le filtrage se fait ICI, côté serveur : rien d'autre n'est dans le HTML ni
// dans le JS client. Contenu payant : noindex, absent du sitemap.
import type { Metadata } from "next";
import { NOINDEX_ROBOTS } from "@/lib/seo-meta";
import { CarnetAVenir, CarnetPage, carnetSrc } from "@/components/carnet/carnet-page";
import { carnetViewForPlan, getCurrentCarnet, listCarnetMonths } from "@/lib/carnet";
import { readSessionCompte } from "@/lib/session-plan";
import { noterPremiereFois } from "@/lib/mesure/evenements-usage";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Le carnet de répartie du mois",
  description:
    "Chaque mois, des situations du quotidien et la réplique qui va avec : ce qu’on te dit, quoi répondre, pourquoi ça marche et quoi faire si ça se tend.",
  ...NOINDEX_ROBOTS,
};

export default async function CarnetCurrentPage({ searchParams }: { searchParams?: { src?: string | string[]; contexte?: string | string[] } }) {
  const carnet = getCurrentCarnet();

  // s26 : mois sans carnet, `CarnetAVenir` (rendu fermé d’avant, déplacé sans retouche ; tuile alignée à gauche ouvert).
  if (!carnet) return <CarnetAVenir />;

  const compte = await readSessionCompte();
  const plan = compte?.plan ?? null;
  // s24 mesure (lot 0) : carnet complet servi à un abonné = premier accès Premium. Rendu inchangé.
  await noterPremiereFois("premier_acces_premium", plan, compte?.userId, "carnet");
  return (
    <CarnetPage
      view={carnetViewForPlan(carnet, plan)}
      months={listCarnetMonths()}
      returnTo="/carnet"
      src={carnetSrc(searchParams?.src)}
      visiteur={!compte}
      contexte={searchParams?.contexte}
    />
  );
}
