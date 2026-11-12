"use client";

import { frTypo } from "@/lib/fr-typo";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
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
import { useVuMesure } from "@/hooks/use-vu-mesure";
import { signalerAcces } from "@/lib/mesure/signal-acces";

interface BlocExerciceProps {
  type: FicheType;
  /** Chemin de la fiche, retrouvée après paiement. */
  returnTo: string;
  /** Parcours de l'étape 1 gratuite proposée en lien. */
  parcours: ParcoursSlug;
  /**
   * Id de la fiche (s23 : conseil et vidéo, puis vanne le 08/11) dont l'exercice (vanne :
   * `howToApply` ; vidéo : aussi les points clés) est chargé par `/api/fiches/exercice` pour
   * un abonné seulement, jamais passé en prop : la page ISR est la même pour tous et la prop
   * finirait dans le payload RSC public. Absent : rien pour un abonné.
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
export function BlocExercice({ type, returnTo, parcours, ficheId }: BlocExerciceProps) {
  const { data: session, status } = useSession();
  const t = BLOC_EXERCICE[type];
  const isPremium =
    status === "authenticated" && isPremiumPlan((session?.user as { plan?: string } | undefined)?.plan);
  const charge = isPremium && ficheId ? `/api/fiches/exercice?type=${type}&id=${encodeURIComponent(ficheId)}` : null;
  // Contenu rattaché à sa requête : passer d'une fiche à l'autre (même instance) n'affiche jamais l'ancien.
  const [reponse, setReponse] = useState<{ url: string; contenu: ContenuAbonne } | null>(null);
  const contenu = reponse && reponse.url === charge ? reponse.contenu : null;

  useEffect(() => {
    if (!charge) return;
    const ctrl = new AbortController();
    const delai = setTimeout(() => ctrl.abort(), 5000);
    fetch(charge, { signal: ctrl.signal, credentials: "same-origin" })
      .then((res) => (res.ok ? (res.json() as Promise<ContenuAbonne>) : null))
      .then((data) => {
        if (data) setReponse({ url: charge, contenu: { exercice: data.exercice ?? null, pointsCles: data.pointsCles ?? [] } });
      })
      // Échec ou délai : rien d'affiché, comme une fiche sans exercice.
      .catch(() => undefined)
      .finally(() => clearTimeout(delai));
    return () => {
      clearTimeout(delai);
      ctrl.abort();
    };
  }, [charge]);

  // s24 mesure (lot 0, §5.2) : le bloc réservé compte quand il est réellement à l'écran (moitié
  // visible pendant 1 s), jamais au chargement de la fiche. Rendu inchangé.
  const blocAbonne = useRef<HTMLElement>(null);
  const blocAffiche = isPremium && !!contenu && (!!contenu.exercice || contenu.pointsCles.length > 0);
  useVuMesure(() => blocAbonne.current, blocAffiche, charge ?? "", () => signalerAcces({ type: "exercice", fiche: type }));

  if (isPremium) {
    const texte = contenu?.exercice || null;
    const pointsCles = contenu?.pointsCles ?? [];
    if (!texte && pointsCles.length === 0) return null;
    return (
      <section ref={blocAbonne} className={cn("mt-8", BLOC_APPEL)} data-bloc-exercice={type}>
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
