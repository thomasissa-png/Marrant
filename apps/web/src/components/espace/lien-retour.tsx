import Link from "next/link";
import type { ReactNode } from "react";

/**
 * Lien « retour » des pages de détail de l'espace (lot D11c, revue d'harmonie défaut 10) : un seul
 * composant, en tête de page, vers la liste parente (Bibliothèque, Quoi répondre, Parcours, Mes questions,
 * Lettres). Texte secondaire, chevron gauche décoratif, cible de 44 px. Le nom du lien est celui de la liste.
 */
export function LienRetour({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      data-lien-retour
      className="-ml-1 inline-flex min-h-11 items-center gap-1 self-start rounded-md pr-2 text-sm text-text-secondary transition-colors hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary"
    >
      <svg aria-hidden="true" className="h-4 w-4 flex-none" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
      </svg>
      {children}
    </Link>
  );
}
