import Link from "next/link";
import { parentEspace } from "@/components/espace/rubriques";
import { TEXTES_ESPACE_NAVIGATION as N } from "@/config/textes/espace-navigation";
import { frEspace } from "@/lib/fr-typo";
import { PLACE_REPERE } from "@/components/layout/gabarit";

/**
 * Lien « Retour : {parent} » des pages de l'espace (v5 §4.3) : un seul composant, en tête de page,
 * aligné sur la colonne (gabarit A) ou sur le logo (gabarit B). Parent fixé par le type de page, jamais
 * par l'historique. Texte secondaire, chevron gauche décoratif, cible de 44 px.
 */
export function LienRetour({
  href,
  label,
  onClick,
}: {
  href: string;
  label: string;
  /** s26 liste et détail : « Retour » de Quoi répondre, `router.back()` quand on vient de la liste. */
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
}) {
  // Relecture des captures nav s24, tour 2 : 36 px de haut comme le fil d'Ariane du site (`PLACE_REPERE`) ; la
  // cible du lien garde 44 px (elle déborde de 12 px en haut et en bas, sans rien chevaucher).
  return (
    <div className={`${PLACE_REPERE} flex items-center`}>
    <Link
      href={href}
      onClick={onClick}
      data-lien-retour
      className="-ml-1 inline-flex min-h-11 items-center gap-1 self-start rounded-md pr-2 text-sm text-text-secondary transition-colors hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary"
    >
      <svg aria-hidden="true" className="h-4 w-4 flex-none" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
      </svg>
      {frEspace(N.retour(label))}
    </Link>
    </div>
  );
}

/**
 * Retour de la page à l'adresse `chemin` (table du §4.3) ; rien pour Aujourd'hui et les pages publiques.
 * s25, navigation v6 (§4) : rien non plus pour les rubriques de premier niveau de la bande (Quoi répondre,
 * Bibliothèque, S'entraîner, Mes questions, Mes répliques) : la bande est le retour, « Retour : Mon espace » disparaît.
 * `/mon-espace/lettres` ramène à « La lettre ». Règles dans `parentEspace` (`rubriques.ts`).
 */
export function RetourDe({ chemin }: { chemin: string }) {
  const parent = parentEspace(chemin);
  return parent ? <LienRetour href={parent.href} label={parent.label} /> : null;
}
