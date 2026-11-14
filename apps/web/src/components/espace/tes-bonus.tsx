import Link from "next/link";
import { TEXTES_CAPS } from "@/config/textes/espace-caps";
import { frEspaceProfond } from "@/lib/fr-typo";

// Lot D11c : textes de l'interface avec la typographie de l'espace (espaces insécables, `frEspace`).
const T = frEspaceProfond(TEXTES_CAPS);

/**
 * Raccourci « Tes bonus » (niveaux-xp-s24.md 3.0, 5.4 ; maquette `parcours.html#bonus`) : juste après
 * la carte « Ton cap », vers la fiche du dernier bonus ouvert. N'existe PAS tant qu'aucun bonus
 * n'est ouvert : rien d'écrit, aucune phrase d'attente (critère 14).
 */
export function TesBonus({ bonus }: { bonus: ReadonlyArray<{ cap: number; href: string }> }) {
  if (bonus.length === 0) return null;
  const dernier = [...bonus].sort((a, b) => b.cap - a.cap)[0];
  return (
    <Link
      href={dernier.href}
      className="flex min-h-11 items-center justify-between rounded-lg border border-border-input px-4 py-2 text-sm font-semibold text-text-primary transition-colors hover:border-text-muted hover:bg-background-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary"
    >
      <span>{T.bonus.raccourci}</span>
      <svg className="h-4 w-4 text-text-muted" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
      </svg>
    </Link>
  );
}
