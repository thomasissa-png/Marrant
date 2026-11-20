import { notFound, redirect } from "next/navigation";
import { ESPACE_CLIENT_PUBLIE } from "@/config/espace-client";
import { getCarnetByMonth, listCarnetMonths } from "@/lib/carnet";
import { isPremiumPlan } from "@/lib/parcours-access";
import { readSessionCompte } from "@/lib/session-plan";
import { hrefListeCarnet, numeroDe } from "@/lib/espace/carnet-liste";

/**
 * s26 carnet liste et détail : gardes de `/carnet/<mois>/<n>`, posées AU-DESSUS du `loading.tsx` de la fiche pour que
 * les statuts soient vrais (404, 307) et non une redirection dans le flux (même règle que Quoi répondre).
 * Fermé : 404 en premier, avant toute lecture (l'adresse n'existait pas). Ouvert : mois non publié ou numéro hors du
 * carnet, 404 ; visiteur et inscrit gratuit, 307 vers la liste du mois (aperçu : fiche offerte, titres fermés, offre),
 * jamais une fiche réservée.
 */
export const dynamic = "force-dynamic";

export default async function FicheCarnetLayout({ children, params }: { children: React.ReactNode; params: { mois: string; n: string } }) {
  if (!ESPACE_CLIENT_PUBLIE) notFound();
  const carnet = getCarnetByMonth(params.mois);
  if (!carnet || numeroDe(params.n, carnet.fiches.length) === null) notFound();
  const compte = await readSessionCompte();
  if (!isPremiumPlan(compte?.plan)) redirect(hrefListeCarnet(carnet.mois, carnet.mois === listCarnetMonths()[0]));
  return <>{children}</>;
}
