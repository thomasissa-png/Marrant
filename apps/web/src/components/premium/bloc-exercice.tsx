"use client";

import { frTypo } from "@/lib/fr-typo";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { buttonVariants } from "@/components/ui/button";
import { LIEN_L2 } from "@/components/ui/liens";
import { buildAbonnementUrl } from "@/lib/premium-return";
import { parcoursEtape1Href, type ParcoursSlug } from "@/lib/entrees-parcours";
import { isPremiumPlan } from "@/lib/parcours-access";
import { cn } from "@/lib/utils";
import { BLOC_APPEL, BOUTON_BLOC_APPEL, TITRE_BLOC_APPEL } from "@/components/layout/gabarit";
import {
  BLOC_EXERCICE,
  BLOC_EXERCICE_ABONNE_TITRE,
  BLOC_EXERCICE_POINTS_CLES,
  type FicheType,
} from "@/config/textes/cta-pages";
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
  /**
   * Conseil et vidéo (s23) : id de la fiche dont l'exercice (et les points clés d'une vidéo)
   * est chargé par `/api/fiches/exercice` pour un abonné seulement, jamais passé en prop :
   * la page ISR est la même pour tous et la prop finirait dans le payload RSC public.
   */
  ficheId?: string;
}

interface ContenuAbonne {
  exercice: string | null;
  pointsCles: string[];
}

/**
 * Bloc d'appel des fiches vanne, conseil et vidéo (concision v5, textes-v5-b §2) : titre,
 * une phrase, un plein payant, la REASS dessous, puis le lien gratuit `GRATUIT_P`.
 * Composant client : les fiches sont en ISR, la session ne se lit pas côté serveur.
 */
export function BlocExercice({ type, returnTo, parcours, exercice, ficheId }: BlocExerciceProps) {
  const { data: session, status } = useSession();
  const t = BLOC_EXERCICE[type];
  const isPremium =
    status === "authenticated" && isPremiumPlan((session?.user as { plan?: string } | undefined)?.plan);
  const charge = isPremium && !exercice && ficheId ? `/api/fiches/exercice?type=${type}&id=${encodeURIComponent(ficheId)}` : null;
  const [contenu, setContenu] = useState<ContenuAbonne | null>(null);

  useEffect(() => {
    if (!charge) return;
    const ctrl = new AbortController();
    const delai = setTimeout(() => ctrl.abort(), 5000);
    fetch(charge, { signal: ctrl.signal, credentials: "same-origin" })
      .then((res) => (res.ok ? (res.json() as Promise<ContenuAbonne>) : null))
      .then((data) => {
        if (data) setContenu({ exercice: data.exercice ?? null, pointsCles: data.pointsCles ?? [] });
      })
      // Échec ou délai : rien d'affiché, comme une fiche sans exercice.
      .catch(() => undefined)
      .finally(() => clearTimeout(delai));
    return () => {
      clearTimeout(delai);
      ctrl.abort();
    };
  }, [charge]);

  if (isPremium) {
    const texte = exercice || contenu?.exercice || null;
    const pointsCles = exercice ? [] : contenu?.pointsCles ?? [];
    if (!texte && pointsCles.length === 0) return null;
    return (
      <section className={cn("mt-8", BLOC_APPEL)} data-bloc-exercice={type}>
        {pointsCles.length > 0 && (
          <>
            <h2 className={TITRE_BLOC_APPEL}>{BLOC_EXERCICE_POINTS_CLES}</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-text-secondary" data-points-cles>
              {pointsCles.map((point, i) => (
                <li key={i}>{contenuAffiche(point)}</li>
              ))}
            </ul>
          </>
        )}
        {texte && (
          <>
            <h2 className={cn(TITRE_BLOC_APPEL, pointsCles.length > 0 && "mt-6")}>{BLOC_EXERCICE_ABONNE_TITRE}</h2>
            <p className="mt-2 text-sm text-text-secondary">{contenuAffiche(texte)}</p>
          </>
        )}
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
