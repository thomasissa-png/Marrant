import Link from "next/link";
import { parcoursEtape1Href } from "@/lib/entrees-parcours";
import type { FicheParcoursRef } from "@/lib/entrees-parcours-fiches";
import { FICHE_PARCOURS } from "@/config/textes/entrees-parcours";
import { buttonVariants } from "@/components/ui/button";
import { LIEN_L2 } from "@/components/premium/mur-liste";
import { cn } from "@/lib/utils";

type FicheType = "vanne" | "conseil" | "video";

/**
 * Bloc « Dans un parcours » des fiches vannes, conseils et vidéos (SEO-06, s17 lot C).
 * Composant serveur, rendu dans le HTML ISR (aucune donnée de session).
 * Aucun parcours n'utilise la fiche → rien n'est affiché.
 * Le lien mène toujours à l'étape 1 (lecture libre, `?src=fiche`).
 * s21 (revue design P1-1) : si le bloc d'exercice de la fiche propose déjà un contour vers
 * l'étape 1 du même parcours (`parcoursBloc`), le lien passe en L2 (plus de doublon de contour).
 */
export function FicheParcoursLien({
  type,
  refs,
  parcoursBloc = null,
}: {
  type: FicheType;
  refs: readonly FicheParcoursRef[];
  parcoursBloc?: string | null;
}) {
  const ref = refs[0];
  if (!ref) return null;
  const doublon = parcoursBloc === ref.slug;

  return (
    <aside
      aria-label={FICHE_PARCOURS.titre}
      data-testid="fiche-parcours-lien"
      className="mt-6 rounded-xl border border-border bg-background-card p-5"
    >
      {/* s17 tour 1 (DES-1-14) : étiquette violette comme « Pourquoi ça marche », lien en bouton (texte inchangé). */}
      <p className="text-xs font-semibold uppercase tracking-wide text-accent-link">{FICHE_PARCOURS.titre}</p>
      <p className="mt-2 text-sm text-text-secondary">{FICHE_PARCOURS[type](ref.etape, ref.slug)}</p>
      <Link
        href={parcoursEtape1Href(ref.slug, "fiche")}
        className={
          doublon
            ? cn(LIEN_L2, "mt-2")
            : cn(
                // Niveau 2 (étape 1 gratuite) : variante unique `outline-accent` (revue design s21 M3).
                buttonVariants({ variant: "outline-accent" }),
                "mt-3 h-auto min-h-[44px] w-full whitespace-normal py-2 text-center [text-wrap:balance] sm:w-auto",
              )
        }
        data-niveau={doublon ? "l2" : "contour"}
      >
        {FICHE_PARCOURS.lien(ref.slug)}
      </Link>
    </aside>
  );
}
