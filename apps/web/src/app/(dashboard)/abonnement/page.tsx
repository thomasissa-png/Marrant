import { AbonnementView } from "@/components/premium/abonnement-view";
import { CarnetExtraitBloc } from "@/components/carnet/carnet-extrait";
import { getCarnetExtrait } from "@/lib/carnet";
import { parcoursSlugFromHref } from "@/lib/entrees-parcours";
import { sanitizeReturnTo } from "@/lib/premium-return";
import { isAnnualPlanAvailable } from "@/lib/premium-plan-availability";
import { lireConnecteServeur } from "@/lib/session-serveur";

// Rendu : SSR dynamique (`dynamic = "force-dynamic"` dans layout.tsx). La
// disponibilité de l'annuel est lue au rendu dans le secret serveur
// STRIPE_PREMIUM_ANNUAL_PRICE_ID : posé ou retiré sans redéploiement de code.
// Paiement côté client (AbonnementView) ; session lue aussi au rendu (CLS, s21). L'extrait du carnet
// (lot 2 s21) est rendu ici, côté serveur : lib/carnet ne part jamais au client.
// Le parcours d'origine (`returnTo`) est lu ici aussi, pour que le titre et le lien
// « Pas encore sûr ? » soient dans le HTML (aucun saut).
export default async function AbonnementPage({
  searchParams = {},
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const extrait = getCarnetExtrait();
  const brut = typeof searchParams.returnTo === "string" ? searchParams.returnTo : null;
  const origine = parcoursSlugFromHref(sanitizeReturnTo(brut) ?? undefined);
  const connecteServeur = await lireConnecteServeur();
  return (
    <AbonnementView
      annualAvailable={isAnnualPlanAvailable()}
      connecteServeur={connecteServeur}
      parcoursOrigine={origine}
      carnetExtrait={extrait ? <CarnetExtraitBloc extrait={extrait} /> : null}
    />
  );
}
