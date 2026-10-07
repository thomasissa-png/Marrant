"use client";

import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { parcoursEtapeHref, type ParcoursAReprendre, type ParcoursEntreeSrc } from "@/lib/entrees-parcours";
import { useParcoursAReprendre } from "@/hooks/use-parcours-a-reprendre";
import { REPRENDRE } from "@/config/textes/entrees-parcours";

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

  return (
    <section
      aria-labelledby="reprendre-parcours-titre"
      data-testid="reprendre-parcours"
      className={cn("rounded-xl border border-accent-primary/40 bg-accent-primary/10 p-5 text-left", className)}
    >
      <h2 id="reprendre-parcours-titre" className="font-display text-lg font-bold text-text-primary">
        {REPRENDRE.titre}
      </h2>
      <p className="mt-1 text-sm text-text-secondary">
        {REPRENDRE.ligne(aReprendre.title, aReprendre.etape, aReprendre.totalSteps, aReprendre.titreEtape)}
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
