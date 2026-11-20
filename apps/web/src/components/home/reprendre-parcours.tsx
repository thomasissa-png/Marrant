"use client";

import { ESPACE_CLIENT_PUBLIE } from "@/config/espace-client";
import { frTypo } from "@/lib/fr-typo";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { parcoursEtapeHref, type ParcoursAReprendre, type ParcoursEntreeSrc } from "@/lib/entrees-parcours";
import { useParcoursAReprendre } from "@/hooks/use-parcours-a-reprendre";
import { REPRENDRE } from "@/config/textes/entrees-parcours";
import { Bandeau, PastillesDa, emojiParcours } from "@/components/espace/da-espace";

/**
 * « Reprendre ton parcours » en tête de l'accueil abonné et du profil
 * (reco 5, UX-03). Rien pour un visiteur, un compte sans Premium, ou un
 * abonné sans parcours en cours.
 */
type ReprendreProps = { src: Extract<ParcoursEntreeSrc, "accueil" | "profil">; className?: string };

export function ReprendreParcours(props: ReprendreProps) {
  return <ReprendreParcoursBloc {...props} aReprendre={useParcoursAReprendre()} />;
}

/** s17 tour 2 (DES-2-08) : bloc seul, pour l'accueil qui lit déjà le parcours à reprendre (une seule requête). */
export function ReprendreParcoursBloc({
  src,
  className,
  aReprendre,
}: ReprendreProps & { aReprendre: ParcoursAReprendre | null }) {
  if (!aReprendre) return null;
  // s26 contrôle d'ensemble, aperçus : dans le Profil de l'espace ouvert seulement, la DA de l'accueil (bandeau violet,
  // émoji du parcours, titre en pastille violette). L'accueil et l'espace fermé : rendu d'avant, au caractère près.
  const da = ESPACE_CLIENT_PUBLIE && src === "profil";

  return (
    <section
      aria-labelledby="reprendre-parcours-titre"
      data-testid="reprendre-parcours"
      className={cn("rounded-xl border border-accent-primary/40 bg-accent-primary/10 p-5 text-left", da && "relative overflow-hidden", className)}
    >
      {da ? (
        <>
          <Bandeau />
          {/* Pastille violette malgré la neutralisation des cartes partagées du Profil (`ECHELLE_CARTES_PARTAGEES`). */}
          <PastillesDa as="h2" id="reprendre-parcours-titre" className="[&_.rounded-full]:!bg-accent-primary/20 [&_.rounded-full]:!text-accent-link" emoji={emojiParcours(aReprendre.slug)} pastille={REPRENDRE.titre} />
        </>
      ) : (
        <h2 id="reprendre-parcours-titre" className="font-display text-lg font-bold text-text-primary">
          {REPRENDRE.titre}
        </h2>
      )}
      <p className="mt-1 text-sm text-text-secondary">
        {/* Relecture des captures nav s24 (reviewer FD2) : interrupteur de l'espace ouvert seulement, apostrophes
            typographiques dans le titre de l'étape ; fermé, la ligne d'aujourd'hui. */}
        {(ESPACE_CLIENT_PUBLIE ? frTypo : (t: string) => t)(REPRENDRE.ligne(aReprendre.title, aReprendre.etape, aReprendre.totalSteps, aReprendre.titreEtape))}
      </p>
      <Link
        href={parcoursEtapeHref(aReprendre.slug, aReprendre.etape, src)}
        className={cn(buttonVariants({ variant: "primary", size: "lg" }), "mt-4 w-full sm:w-auto")}
      >
        {REPRENDRE.bouton(aReprendre.etape)}
      </Link>
    </section>
  );
}
