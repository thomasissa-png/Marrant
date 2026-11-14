import Link from "next/link";
import { TEXTES_MISSION } from "@/config/textes/espace-cartes";
import type { NumeroMarche } from "@/lib/espace/missions";
import { frEspaceProfond } from "@/lib/fr-typo";

// Lot D11c : textes de l'interface avec la typographie de l'espace (espaces insécables, `frEspace`).
const M = frEspaceProfond(TEXTES_MISSION);

/**
 * Mission ouverte, état 4 d'« Aujourd'hui » (architecture v20 4.4) : jamais l'action principale (aucun bouton
 * plein). Relecture des captures nav s24 (ux F6a) : une carte comme les autres de la colonne du jour, au lieu
 * d'une ligne flottante : « Mission · Marche n » (libellés existants), le titre de la marche en ligne entière
 * cliquable avec chevron, « Facultative » (libellé 25), vers la mission dans « S'entraîner ».
 */
export function MissionLien({ marche }: { marche: NumeroMarche }) {
  return (
    <section aria-labelledby="mission-lien-titre" className="rounded-lg border border-border bg-background-card p-4 md:p-6" data-testid="mission-lien">
      <p id="mission-lien-titre" className="text-xs font-semibold text-text-muted">
        {M.titre} · {M.marche(marche)}
      </p>
      <Link
        href="/mon-espace/s-entrainer#mission"
        className="-mx-2 mt-1 flex min-h-11 items-center justify-between gap-3 rounded-md px-2 text-base font-semibold text-text-primary transition-colors hover:text-accent-link focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary"
      >
        {M.titresMarches[marche]}
        <svg className="h-4 w-4 flex-none text-text-muted" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </Link>
      <p className="text-xs text-text-secondary">{M.facultative}</p>
    </section>
  );
}
