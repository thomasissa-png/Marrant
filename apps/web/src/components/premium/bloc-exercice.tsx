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
import { BLOC_EXERCICE, BLOC_EXERCICE_ABONNE_TITRE, type FicheType } from "@/config/textes/cta-pages";
import { REASSURANCE_UNIQUE } from "@/config/textes/offre";

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
        {frTypo(t.titre)}
      </h2>
      <p className="mt-2 text-sm text-text-secondary">{frTypo(t.texte)}</p>
      {/* s21 (revue design P2-4) : les deux boutons ont la même largeur (max-w-lg), bords alignés à 1280. */}
      <Link
        href={buildAbonnementUrl(returnTo, "monthly", `exercice-${type}`)}
        className={cn(
          buttonVariants({ variant: "primary", size: "lg" }),
          "mt-4 h-auto min-h-12 w-full whitespace-normal py-2 text-center sm:max-w-lg",
        )}
        data-fiche-cta="premium"
      >
        {t.bouton}
      </Link>
      <p className="mt-2 text-xs text-text-muted">{frTypo(REASSURANCE_UNIQUE)}</p>
      {/* s21 concision (18/10) : un seul bouton plein par bloc, le gratuit devient un lien texte (L2). */}
      <div className="mt-1">
        <Link href={parcoursEtape1Href(parcours, "fiche")} className={LIEN_L2} data-fiche-cta="etape-1">
          {frTypo(t.contour(parcours))}
        </Link>
      </div>
    </section>
  );
}
