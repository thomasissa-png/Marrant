import Link from "next/link";
import { TEXTES_FICHE_LIGNE } from "@/config/textes/espace-bibliotheque";
import type { LigneFiche } from "@/lib/espace/lignes-fiches";
import { cn } from "@/lib/utils";
import { frEspace } from "@/lib/fr-typo";
import { frEspaceProfond } from "@/lib/fr-typo";

// Lot D11c : textes de l'interface avec la typographie de l'espace (espaces insécables, `frEspace`).
const T = frEspaceProfond(TEXTES_FICHE_LIGNE);

/**
 * Liste de fiches (s24, lot D6 ; maquette `bibliotheque.html`, classes `.fiches` et `.fiche`) : lignes de
 * 56 px au moins, titre, marque d'un bonus au-dessus, statut « Voir » ou « Fait » en texte (jamais la
 * couleur seule). Sous 300 px, le statut passe sous le titre. `avecDuree` : « {n} min » après le titre
 * (anatomie 2.7, durée affichée ; toujours pour un bonus, comme la maquette).
 */
/**
 * Relecture des captures nav s24, tour 2 (ux N2, reviewer FD-B2) : à l'affichage seulement, « Vocabulaire : quand on
 * te lance une pique » sous le titre « Vocabulaire » devient « Quand on te lance une pique » ; « Réunion : … » sous
 * « Réunion et entretien » perd aussi son préfixe. Un préfixe qui ne commence pas le titre du groupe est gardé
 * (« Fac : … » sous « Études et fac »). La donnée (titre de la fiche) ne change pas.
 */
const PREFIXE = /^([^:«»\n]{1,40}?)\s*:\s+([\s\S]+)$/;
const norme = (t: string) => t.normalize("NFD").replace(/\p{M}/gu, "").replace(/’/g, "'").toLowerCase().trim();
export function sansPrefixe(titre: string, groupe: string): string {
  const m = PREFIXE.exec(titre);
  if (!m || !norme(groupe).startsWith(norme(m[1]))) return titre;
  const reste = m[2];
  return reste.charAt(0).toLocaleUpperCase("fr") + reste.slice(1);
}

/**
 * `deuxColonnes` (v5 §3, gabarit B des pages neuves de l'espace) : 1 colonne, 2 dès 768 px, quand la liste
 * prend la pleine coque (Quoi répondre) ; une liste dans un bloc de la Bibliothèque reste en 1 colonne.
 */
export function ListeFiches({
  lignes,
  avecDuree = false,
  labelledBy,
  deuxColonnes = false,
  groupe,
}: {
  lignes: readonly LigneFiche[];
  avecDuree?: boolean;
  labelledBy?: string;
  deuxColonnes?: boolean;
  /** Titre du groupe au-dessus de la liste : son nom n'est pas répété en tête de chaque ligne (`sansPrefixe`). */
  groupe?: string;
}) {
  if (lignes.length === 0) return null;
  return (
    <ul className={cn("grid grid-cols-1 gap-2", deuxColonnes && "md:grid-cols-2 md:gap-x-6")} aria-labelledby={labelledBy}>
      {lignes.map((l) => (
        <li key={l.id}>
          <Link
            href={l.href}
            data-fiche={l.id}
            className="flex min-h-14 items-center gap-3 rounded-md border border-border bg-background-light px-3 py-2 transition-colors hover:border-border-hover hover:bg-background-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-link max-e300:grid max-e300:grid-cols-1 max-e300:gap-1"
          >
            <span className="min-w-0 flex-1 text-sm text-text-primary [overflow-wrap:anywhere]">
              {l.marque && <small className="mb-0.5 block text-xs font-semibold text-accent-link">{frEspace(l.marque)}</small>}
              {frEspace(groupe ? sansPrefixe(l.titre, groupe) : l.titre)}
              {(avecDuree || l.marque) && <span className="text-text-secondary"> · {T.minutes(l.minutes)}</span>}
            </span>
            {/* Relecture des captures nav s24 (ux F1) : la ligne entière est le lien ; « Fait » quand c'est fait,
                sinon un chevron (plus de « Voir » répété sur chaque ligne). */}
            {l.fait ? (
              <span className="flex-none justify-self-start rounded-full border border-accent-link px-2 py-0.5 text-xs font-semibold text-accent-link">{T.fait}</span>
            ) : (
              <svg className="h-4 w-4 flex-none text-text-muted max-e300:hidden" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            )}
          </Link>
        </li>
      ))}
    </ul>
  );
}
