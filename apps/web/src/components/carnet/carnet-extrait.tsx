import { deMoisSeul, type CarnetExtrait } from "@/lib/carnet";
import { CARNET_EXTRAIT_TITRE } from "@/config/textes/carnet-extrait";
import { CARNET_VENTE } from "@/config/textes/abonnement-vente";
import { ANCRE_CARNET_VENTE } from "@/config/textes/avantages-premium";
import { frTypo } from "@/lib/fr-typo";

/**
 * « Le carnet, en vrai » sur /abonnement, juste sous la carte d'offre (textes-trajet-v2 A05 à A09) :
 * titre, chapeau (mois du carnet affiché), titre de la fiche (v3 E02), puis l'échange en deux bulles
 * de la fiche offerte du mois (« On te dit », « Tu réponds »), sans surtitre, sans « Pourquoi ça marche », sans lien qui
 * sort de la page. Server Component : la fiche est déjà publique sur /carnet (`CARNET_FREE_FICHES`).
 */
export function CarnetExtraitBloc({ extrait }: { extrait: CarnetExtrait }) {
  const deMois = deMoisSeul(extrait.mois);
  if (!deMois || extrait.totalFiches < 1) return null;

  return (
    <section
      id={ANCRE_CARNET_VENTE}
      aria-labelledby="abonnement-carnet-titre"
      data-testid="abonnement-carnet-extrait"
      // Cible de l'avantage 3 : arrivée sous l'en-tête collant.
      className="mx-auto mt-8 max-w-[560px] scroll-mt-20 space-y-3 md:mt-12"
    >
      <header className="space-y-1 text-center">
        <h2 id="abonnement-carnet-titre" className="font-display text-2xl font-bold text-text-primary">
          {CARNET_EXTRAIT_TITRE}
        </h2>
        <p className="text-sm text-text-secondary" data-testid="abonnement-carnet-chapeau">
          {frTypo(CARNET_VENTE.chapeau(deMois))}
        </p>
      </header>

      <div className="mx-auto max-w-[560px] space-y-2">
        {/* v3 E02 : la scène (titre de la fiche affichée, donnée) avant l'échange ; rien si vide. Centrée comme
            le titre et le chapeau du bloc (finition du tour 3). */}
        {extrait.fiche.titre?.trim() && (
          <h3 className="text-center text-sm font-semibold text-text-primary" data-testid="abonnement-carnet-scene">
            {frTypo(extrait.fiche.titre)}
          </h3>
        )}
        <div className="mr-8 rounded-2xl rounded-bl-sm bg-background-elevated p-3">
          <p className="text-xs font-medium text-text-secondary">On te dit</p>
          <p className="mt-1 text-sm italic text-text-primary">{frTypo(extrait.fiche.onTeDit)}</p>
        </div>
        <div className="ml-8 rounded-2xl rounded-br-sm border border-accent-primary/30 bg-accent-primary/10 p-3">
          <p className="text-xs font-medium text-accent-link">Tu réponds</p>
          <p className="mt-1 text-base font-semibold text-text-primary">{frTypo(extrait.fiche.reponse)}</p>
        </div>
      </div>

      {extrait.totalFiches > 1 && (
        <p className="text-center text-sm text-text-secondary" data-testid="abonnement-carnet-reste">
          {frTypo(CARNET_VENTE.reste(extrait.totalFiches - 1))}
        </p>
      )}
    </section>
  );
}
