import { AbonnementView } from "@/components/premium/abonnement-view";
import { isAnnualPlanAvailable } from "@/lib/premium-plan-availability";

// Rendu : SSR dynamique (`dynamic = "force-dynamic"` dans layout.tsx). La
// disponibilité de l'annuel est lue au rendu dans le secret serveur
// STRIPE_PREMIUM_ANNUAL_PRICE_ID : posé ou retiré sans redéploiement de code.
// Session et paiement restent côté client (AbonnementView).
export default function AbonnementPage() {
  return <AbonnementView annualAvailable={isAnnualPlanAvailable()} />;
}
