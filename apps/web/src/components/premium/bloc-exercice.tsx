"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { buttonVariants } from "@/components/ui/button";
import { LIEN_L2 } from "@/components/premium/mur-liste";
import { buildAbonnementUrl } from "@/lib/premium-return";
import { parcoursEtape1Href, type ParcoursSlug } from "@/lib/entrees-parcours";
import { isPremiumPlan } from "@/lib/parcours-access";
import { cn } from "@/lib/utils";
import { BLOC_EXERCICE, BLOC_EXERCICE_ABONNE_TITRE, contourEtape1, lignePrixGarantie, type FicheType } from "@/config/textes/cta-pages";

interface BlocExerciceProps {
  type: FicheType;
  /** Chemin de la fiche, retrouvée après paiement. */
  returnTo: string;
  /** Parcours de l'étape 1 gratuite proposée en contour. */
  parcours: ParcoursSlug;
  /** Offre annuelle disponible (lue côté serveur). */
  annuel: boolean;
  /** Exercice affiché aux abonnés (vanne : `howToApply`). Absent : rien pour un abonné. */
  exercice?: string | null;
}

/**
 * Bloc d'appel des fiches vanne, conseil et vidéo (B8 à B10, cta-forme-place-s21 §3.3) :
 * un plein Premium, la ligne prix + garantie, un contour vers l'étape 1 gratuite,
 * puis « Voir toutes les … » en lien. Composant client : les fiches sont en ISR,
 * la session ne se lit pas côté serveur.
 */
export function BlocExercice({ type, returnTo, parcours, annuel, exercice }: BlocExerciceProps) {
  const { data: session, status } = useSession();
  const t = BLOC_EXERCICE[type];
  const isPremium =
    status === "authenticated" && isPremiumPlan((session?.user as { plan?: string } | undefined)?.plan);

  if (isPremium) {
    if (!exercice) return null;
    return (
      <section className="mt-8 rounded-lg border border-border bg-background-card p-5" data-bloc-exercice={type}>
        <h2 className="font-display text-lg font-bold text-text-primary">{BLOC_EXERCICE_ABONNE_TITRE}</h2>
        <p className="mt-2 text-sm text-text-secondary">{exercice}</p>
      </section>
    );
  }

  return (
    <section
      aria-labelledby={`bloc-exercice-${type}`}
      className="mt-8 rounded-lg border border-border bg-background-card p-5"
      data-bloc-exercice={type}
    >
      <h2 id={`bloc-exercice-${type}`} className="font-display text-lg font-bold text-text-primary">
        {t.titre}
      </h2>
      <p className="mt-2 text-sm text-text-secondary">{t.texte}</p>
      <Link
        href={buildAbonnementUrl(returnTo, "monthly", `exercice-${type}`)}
        className={cn(
          buttonVariants({ variant: "primary", size: "lg" }),
          "mt-4 h-auto min-h-12 w-full whitespace-normal py-2 text-center sm:w-auto",
        )}
        data-fiche-cta="premium"
      >
        {t.bouton}
      </Link>
      <p className="mt-2 text-xs text-text-muted">{lignePrixGarantie(annuel)}</p>
      <Link
        href={parcoursEtape1Href(parcours, "fiche")}
        className={cn(
          buttonVariants({ variant: "outline-accent", size: "lg" }),
          "mt-3 h-auto min-h-12 w-full whitespace-normal py-2 text-center sm:w-auto",
        )}
        data-fiche-cta="etape-1"
      >
        {contourEtape1(parcours)}
      </Link>
      <div className="mt-3">
        <Link href={t.toutVoirHref} className={LIEN_L2}>
          {t.toutVoir}
        </Link>
      </div>
    </section>
  );
}
