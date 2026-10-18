import type { FicheParcoursRef } from "@/lib/entrees-parcours-fiches";
import { FICHE_PARCOURS } from "@/config/textes/entrees-parcours";

type FicheType = "vanne" | "conseil" | "video";

/**
 * Bloc « Dans un parcours » des fiches vannes, conseils et vidéos (SEO-06, s17 lot C).
 * Composant serveur, rendu dans le HTML ISR (aucune donnée de session).
 * Aucun parcours n'utilise la fiche → rien n'est affiché.
 * s21 concision v5 (textes-v5-b §2) : la carte garde son titre et sa phrase, sans lien (le lien
 * gratuit vers l'étape 1 est celui du bloc d'exercice, juste au-dessus).
 */
export function FicheParcoursLien({ type, refs }: { type: FicheType; refs: readonly FicheParcoursRef[] }) {
  const ref = refs[0];
  if (!ref) return null;

  return (
    <aside
      aria-label={FICHE_PARCOURS.titre}
      data-testid="fiche-parcours-lien"
      className="mt-6 rounded-xl border border-border bg-background-card p-5"
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-accent-link">{FICHE_PARCOURS.titre}</p>
      <p className="mt-2 text-sm text-text-secondary">{FICHE_PARCOURS[type](ref.etape, ref.slug)}</p>
    </aside>
  );
}
