"use client";

import { CARTE_VERROUILLEE_LABEL } from "@/config/textes/offre";

/**
 * Carte floutée des murs /vannes, /conseils, /videos (revue visuelle s21, verdict @design R10) :
 * un seul cadre pour les trois listes, bordure pleine (plus de pointillés), hauteur fixe, deux
 * barres floues et un cadenas à droite. Plus de grand carré de vignette vide, qui se lisait comme un
 * chargement raté. Toute la carte ouvre la fenêtre Premium ; aucun libellé visible (concision v5).
 */
export function CarteFloutee({ onOuvrir }: { onOuvrir: () => void }) {
  return (
    <button
      type="button"
      onClick={onOuvrir}
      aria-label={CARTE_VERROUILLEE_LABEL}
      className="group relative flex h-24 w-full items-center justify-between overflow-hidden rounded-lg border border-border bg-gradient-to-b from-background-card to-background px-5 text-left transition-colors hover:border-accent-primary/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary"
    >
      {/* Revue visuelle s21 (T2-10) : barres à gauche, cadenas à droite (il ne se pose plus dessus). */}
      <span aria-hidden="true" className="flex w-2/3 flex-col gap-2.5">
        <span className="block h-3 w-full rounded-full bg-background-elevated/60 blur-[1px]" />
        <span className="block h-3 w-2/3 rounded-full bg-background-elevated/60 blur-[1px]" />
      </span>
      <span aria-hidden="true" className="ml-4 shrink-0">
        <svg className="h-6 w-6 text-accent-link" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      </span>
    </button>
  );
}
