import { AbonnementView } from "@/components/premium/abonnement-view";
import { CarnetExtraitBloc } from "@/components/carnet/carnet-extrait";
import { TableauGratuitPremium } from "@/components/premium/tableau-gratuit-premium";
import { CARNET_FREE_FICHES, getCarnetExtrait } from "@/lib/carnet";
import { parcoursSlugFromHref } from "@/lib/entrees-parcours";
import { AUTO_CHECKOUT_PARAM, AUTO_CHECKOUT_VALUE, sanitizeReturnTo } from "@/lib/premium-return";
import { isAnnualPlanAvailable } from "@/lib/premium-plan-availability";
import { lireConnecteServeur } from "@/lib/session-serveur";
import { origineAbonnement } from "@/lib/abonnement-accroche";
import { lignesTableau } from "@/config/textes/abonnement-vente";
import { LETTRE_HEBDO_PROMESSE } from "@/config/lettre-hebdo-promesse-temporaire";
import { estRetourSansPaiement } from "@/lib/checkout-tracking";
import { ESPACE_CLIENT_PUBLIE } from "@/config/espace-client";
import { LIGNE_BONUS_OFFRE } from "@/config/textes/espace-textes-en-ligne";
import { lignesAncienAbonne } from "@/lib/espace/ancien-abonne";
import { bonusTousPublies } from "@/lib/espace/bonus-publies";

// Rendu : SSR dynamique (`dynamic = "force-dynamic"` dans layout.tsx). La disponibilité de
// l'annuel est lue au rendu (secret serveur STRIPE_PREMIUM_ANNUAL_PRICE_ID). Paiement côté client
// (AbonnementView) ; session lue aussi au rendu (CLS, s21). Rendus ici, côté serveur, pour être dans
// le HTML sans saut (trajet de conversion s21) : accroche d'origine (`src`, `returnTo`), tableau
// Gratuit / Premium, extrait du carnet (lib/carnet ne part jamais au client), et la page d'attente
// d'après inscription (`auto=1` avec une session : plus de flash de la page de vente avant Stripe).
// s24 lot D10 (plan §6 T1 et T11) : interrupteur de l'espace ouvert seulement, ligne des bonus sous le
// sous-titre et lignes de l'ancien abonné au-dessus de l'offre ; fermé, rien n'est lu ni rendu en plus.
// Lot D10b : la ligne des bonus seulement si les 4 fiches bonus sont publiées (`bonusTousPublies`).
export default async function AbonnementPage({
  searchParams = {},
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const lire = (cle: string) => (typeof searchParams[cle] === "string" ? (searchParams[cle] as string) : null);
  const extrait = getCarnetExtrait();
  const returnTo = lire("returnTo");
  const origine = parcoursSlugFromHref(sanitizeReturnTo(returnTo) ?? undefined);
  const { accroche, ligneMiseEnAvant } = origineAbonnement(lire("src"), returnTo);
  const connecteServeur = await lireConnecteServeur();
  const ancienAbonne = connecteServeur ? await lignesAncienAbonne() : [];
  const params = new URLSearchParams(
    Object.entries(searchParams).flatMap(([k, v]) => (typeof v === "string" ? [[k, v]] : [])),
  );
  const retourInscription =
    connecteServeur && lire(AUTO_CHECKOUT_PARAM) === AUTO_CHECKOUT_VALUE && !estRetourSansPaiement(params);
  const lignes = lignesTableau({
    carnet: extrait !== null && extrait.totalFiches >= 1,
    carnetGratuit: CARNET_FREE_FICHES,
    lettre: LETTRE_HEBDO_PROMESSE,
  });
  return (
    <AbonnementView
      annualAvailable={isAnnualPlanAvailable()}
      connecteServeur={connecteServeur}
      parcoursOrigine={origine}
      accroche={accroche}
      retourInscription={retourInscription}
      planInitial={lire("plan") === "annual" ? "annual" : "monthly"}
      tableau={<TableauGratuitPremium lignes={lignes} ligneMiseEnAvant={ligneMiseEnAvant} />}
      carnetExtrait={extrait ? <CarnetExtraitBloc extrait={extrait} /> : null}
      {...(ESPACE_CLIENT_PUBLIE ? { ligneBonus: bonusTousPublies() ? LIGNE_BONUS_OFFRE : null, lignesAncienAbonne: ancienAbonne } : {})}
    />
  );
}
