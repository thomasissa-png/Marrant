"use client";

import { frTypo } from "@/lib/fr-typo";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { buttonVariants } from "@/components/ui/button";
import { LIEN_L2 } from "@/components/ui/liens";
import { buildAbonnementUrl } from "@/lib/premium-return";
import { parcoursEtape1Href, type ParcoursSlug } from "@/lib/entrees-parcours";
import { isPremiumPlan } from "@/lib/parcours-access";
import { cn } from "@/lib/utils";
import { BLOC_APPEL, BOUTON_BLOC_APPEL, TITRE_BLOC_APPEL } from "@/components/layout/gabarit";
import { BLOC_EXERCICE, BLOC_EXERCICE_ABONNE_TITRE, type FicheType } from "@/config/textes/cta-pages";
import { Reassurance } from "@/components/ui/reassurance";
import { contenuAffiche } from "@/lib/tip-prose";

interface BlocExerciceProps {
  type: FicheType;
  /** Chemin de la fiche, retrouvée après paiement. */
  returnTo: string;
  /** Parcours de l'étape 1 gratuite proposée en lien. */
  parcours: ParcoursSlug;
  /** Exercice affiché aux abonnés (vanne : `howToApply`). Absent : rien pour un abonné. */
  exercice?: string | null;
}

/**
 * Bloc d'appel des fiches vanne, conseil et vidéo (concision v5, textes-v5-b §2) : titre,
 * une phrase, un plein payant, la REASS dessous, puis le lien gratuit `GRATUIT_P`.
 * Composant client : les fiches sont en ISR, la session ne se lit pas côté serveur.
 */
export function BlocExercice({ type, returnTo, parcours, exercice }: BlocExerciceProps) {
  const { data: session, status } = useSession();
  const t = BLOC_EXERCICE[type];
  const isPremium =
    status === "authenticated" && isPremiumPlan((session?.user as { plan?: string } | undefined)?.plan);

  if (isPremium) {
    if (!exercice) return null;
    return (
      <section className={cn("mt-8", BLOC_APPEL)} data-bloc-exercice={type}>
        <h2 className={TITRE_BLOC_APPEL}>{BLOC_EXERCICE_ABONNE_TITRE}</h2>
        <p className="mt-2 text-sm text-text-secondary">{contenuAffiche(exercice)}</p>
      </section>
    );
  }

  return (
    <section
      aria-labelledby={`bloc-exercice-${type}`}
      className={cn("mt-8", BLOC_APPEL)}
      data-bloc-exercice={type}
    >
      <h2 id={`bloc-exercice-${type}`} className={TITRE_BLOC_APPEL}>
        {frTypo(t.titre)}
      </h2>
      <p className="mt-2 text-sm text-text-secondary">{frTypo(t.texte)}</p>
      {/* Revue visuelle s21 : même bloc d'appel que les murs des listes (bouton à la largeur de son texte dès 640 px). */}
      <div className="mt-4">
        <Link
          href={buildAbonnementUrl(returnTo, "monthly", `exercice-${type}`)}
          className={cn(buttonVariants({ variant: "primary", size: "lg" }), BOUTON_BLOC_APPEL)}
          data-fiche-cta="premium"
        >
          {t.bouton}
        </Link>
      </div>
      <Reassurance />
      {/* s21 concision (18/10) : un seul bouton plein par bloc, le gratuit devient un lien texte (L2). */}
      <div className="-mb-3 mt-1">
        <Link href={parcoursEtape1Href(parcours, "fiche")} className={LIEN_L2} data-fiche-cta="etape-1">
          {frTypo(t.contour(parcours))}
        </Link>
      </div>
    </section>
  );
}
