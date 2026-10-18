import { AbonnementView } from "@/components/premium/abonnement-view";
import { CarnetExtraitBloc } from "@/components/carnet/carnet-extrait";
import { CarteEtapeSuivante } from "@/components/premium/carte-etape-suivante";
import { getCarnetExtrait } from "@/lib/carnet";
import { getSeedForSlug } from "@/lib/parcours-data";
import { parcoursSlugFromHref } from "@/lib/entrees-parcours";
import { sanitizeReturnTo } from "@/lib/premium-return";
import { isAnnualPlanAvailable } from "@/lib/premium-plan-availability";
import { frTypoParcours } from "@/lib/fr-typo";
import { MUR_PARCOURS } from "@/config/textes/cta-pages";
import { lireConnecteServeur } from "@/lib/session-serveur";

// Rendu : SSR dynamique (`dynamic = "force-dynamic"` dans layout.tsx). La
// disponibilité de l'annuel est lue au rendu dans le secret serveur
// STRIPE_PREMIUM_ANNUAL_PRICE_ID : posé ou retiré sans redéploiement de code.
// Paiement côté client (AbonnementView) ; session lue aussi au rendu (CLS, s21). L'extrait du carnet
// (lot 2 s21) est rendu ici, côté serveur : lib/carnet ne part jamais au client.
// s21 B16 : le parcours d'origine (`returnTo`) est lu ici aussi, pour que le
// surtitre, le titre et la carte « Étape 2 » soient dans le HTML (aucun saut).
// s21 (CLS) : la session est lue ici aussi, pour rendre directement la version connectée.
export default async function AbonnementPage({
  searchParams = {},
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const extrait = getCarnetExtrait();
  const brut = typeof searchParams.returnTo === "string" ? searchParams.returnTo : null;
  const origine = parcoursSlugFromHref(sanitizeReturnTo(brut) ?? undefined);
  const parcoursCarte = origine ?? MUR_PARCOURS;
  const etape2 = getSeedForSlug(parcoursCarte)?.steps[1];
  const connecteServeur = await lireConnecteServeur();
  return (
    <AbonnementView
      annualAvailable={isAnnualPlanAvailable()}
      connecteServeur={connecteServeur}
      parcoursOrigine={origine}
      etapeSuivante={
        etape2 ? (
          <CarteEtapeSuivante
            parcours={parcoursCarte}
            numero={2}
            titre={etape2.moduleTitle}
            apercu={frTypoParcours(etape2.moduleDetail || etape2.why)}
            format={etape2.moduleFormat}
            className="mt-6"
          />
        ) : null
      }
      carnetExtrait={extrait ? <CarnetExtraitBloc extrait={extrait} /> : null}
    />
  );
}
