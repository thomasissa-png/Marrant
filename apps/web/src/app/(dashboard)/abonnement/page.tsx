import { AbonnementView } from "@/components/premium/abonnement-view";
import { CarnetExtraitBloc } from "@/components/carnet/carnet-extrait";
import { getCarnetExtrait } from "@/lib/carnet";
import { isAnnualPlanAvailable } from "@/lib/premium-plan-availability";

// Rendu : SSR dynamique (`dynamic = "force-dynamic"` dans layout.tsx). La
// disponibilité de l'annuel est lue au rendu dans le secret serveur
// STRIPE_PREMIUM_ANNUAL_PRICE_ID : posé ou retiré sans redéploiement de code.
// Session et paiement restent côté client (AbonnementView). L'extrait du carnet
// (lot 2 s21) est rendu ici, côté serveur : lib/carnet ne part jamais au client.
export default function AbonnementPage() {
  const extrait = getCarnetExtrait();
  return (
    <AbonnementView
      annualAvailable={isAnnualPlanAvailable()}
      carnetExtrait={extrait ? <CarnetExtraitBloc extrait={extrait} /> : null}
    />
  );
}
