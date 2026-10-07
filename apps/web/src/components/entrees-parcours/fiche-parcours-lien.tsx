import Link from "next/link";
import { parcoursEtape1Href } from "@/lib/entrees-parcours";
import type { FicheParcoursRef } from "@/lib/entrees-parcours-fiches";
import { FICHE_PARCOURS } from "@/config/textes/entrees-parcours";

type FicheType = "vanne" | "conseil" | "video";

/**
 * Bloc « Dans un parcours » des fiches vannes, conseils et vidéos (SEO-06, s17 lot C).
 * Composant serveur, rendu dans le HTML ISR (aucune donnée de session).
 * Aucun parcours n'utilise la fiche → rien n'est affiché.
 * Le lien mène toujours à l'étape 1 (lecture libre, `?src=fiche`).
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
      <p className="text-xs font-medium uppercase tracking-wider text-text-muted">{FICHE_PARCOURS.titre}</p>
      <p className="mt-2 text-sm text-text-secondary">{FICHE_PARCOURS[type](ref.etape, ref.slug)}</p>
      <Link
        href={parcoursEtape1Href(ref.slug, "fiche")}
        className="mt-3 inline-flex min-h-[44px] items-center text-sm font-semibold text-accent-link underline underline-offset-4 hover:text-text-primary"
      >
        {FICHE_PARCOURS.lien(ref.slug)}
      </Link>
    </aside>
  );
}
