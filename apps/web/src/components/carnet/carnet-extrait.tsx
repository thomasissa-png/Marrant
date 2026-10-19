import Link from "next/link";
import { CarnetFicheCard } from "@/components/carnet/carnet-fiche-card";
import { deMoisSeul, type CarnetExtrait } from "@/lib/carnet";
import { CARNET_EXTRAIT_LIEN, CARNET_EXTRAIT_TITRE, carnetExtraitSurtitre } from "@/config/textes/carnet-extrait";
import { CARNET_VENTE } from "@/config/textes/abonnement-vente";
import { frTypo } from "@/lib/fr-typo";

/**
 * « Le carnet, en vrai » sur /abonnement (lot 2 s21, §5.5) : la fiche offerte du
 * carnet du mois en cours, citée telle quelle. Server Component : la fiche est
 * déjà publique sur /carnet (`CARNET_FREE_FICHES`), aucun contenu payant ici.
 */
export function CarnetExtraitBloc({ extrait }: { extrait: CarnetExtrait }) {
  const deMois = deMoisSeul(extrait.mois);
  if (!deMois || extrait.totalFiches < 1) return null;

  return (
    <section
      aria-labelledby="abonnement-carnet-titre"
      data-testid="abonnement-carnet-extrait"
      // Revue visuelle s21 (R17) : même écart de section que la FAQ (carte, carnet, FAQ).
      className="mt-12 space-y-4 md:mt-16"
    >
      <header className="space-y-1 text-center">
        {/* Trajet de conversion s21 (textes-trajet-v1 §1.4) : amorce avant le surtitre. */}
        <p className="pb-1 text-sm text-text-secondary">{frTypo(CARNET_VENTE.amorce)}</p>
        <p className="text-xs font-semibold uppercase tracking-wider text-accent-link">
          {carnetExtraitSurtitre(deMois, extrait.numero)}
        </p>
        <h2 id="abonnement-carnet-titre" className="font-display text-2xl font-bold text-text-primary">
          {CARNET_EXTRAIT_TITRE}
        </h2>
      </header>

      <CarnetFicheCard fiche={extrait.fiche} numero={extrait.numero} extrait />

      {/* Ligne du reste (calculée sur le carnet du mois), puis le lien discret : il sort de la
          page, ce n'est pas un bouton (un seul plein à l'écran, @ux §5). */}
      <div className="text-center">
        {extrait.totalFiches > 1 && (
          <p className="text-sm text-text-secondary" data-testid="abonnement-carnet-reste">
            {frTypo(CARNET_VENTE.reste(extrait.totalFiches - 1))}
          </p>
        )}
        <Link
          href={`/carnet#fiche-${extrait.fiche.id}`}
          className="inline-flex min-h-[44px] items-center text-sm font-medium text-accent-link underline underline-offset-4 hover:text-text-primary"
        >
          {CARNET_EXTRAIT_LIEN}
        </Link>
      </div>
    </section>
  );
}
