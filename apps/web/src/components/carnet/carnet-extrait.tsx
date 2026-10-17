import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { CarnetFicheCard } from "@/components/carnet/carnet-fiche-card";
import { deMoisSeul, type CarnetExtrait } from "@/lib/carnet";
import {
  CARNET_EXTRAIT_LIEN,
  CARNET_EXTRAIT_TITRE,
  carnetExtraitIntro,
  carnetExtraitSurtitre,
} from "@/config/textes/carnet-extrait";
import { cn } from "@/lib/utils";

/**
 * « Le carnet, en vrai » sur /abonnement (lot 2 s21, §5.5) : la fiche offerte du
 * carnet du mois en cours, citée telle quelle. Server Component : la fiche est
 * déjà publique sur /carnet (`CARNET_FREE_FICHES`), aucun contenu payant ici.
 */
export function CarnetExtraitBloc({ extrait }: { extrait: CarnetExtrait }) {
  const deMois = deMoisSeul(extrait.mois);
  if (!deMois || extrait.totalFiches < 1) return null;
  const intro = carnetExtraitIntro(extrait.totalFiches - 1);

  return (
    <section
      aria-labelledby="abonnement-carnet-titre"
      data-testid="abonnement-carnet-extrait"
      className="mt-6 space-y-4"
    >
      <header className="space-y-1 text-center">
        <p className="text-xs font-semibold uppercase tracking-wider text-accent-link">
          {carnetExtraitSurtitre(deMois)}
        </p>
        <h2 id="abonnement-carnet-titre" className="font-display text-2xl font-bold text-text-primary">
          {CARNET_EXTRAIT_TITRE}
        </h2>
        {intro && <p className="text-sm text-text-secondary">{intro}</p>}
      </header>

      <CarnetFicheCard fiche={extrait.fiche} numero={1} extrait />

      <div className="text-center">
        <Link
          href={`/carnet#fiche-${extrait.fiche.id}`}
          className={cn(
            buttonVariants({ variant: "outline-accent", size: "lg" }),
            "h-auto min-h-12 px-4 py-2",
          )}
        >
          {CARNET_EXTRAIT_LIEN}
        </Link>
      </div>
    </section>
  );
}
