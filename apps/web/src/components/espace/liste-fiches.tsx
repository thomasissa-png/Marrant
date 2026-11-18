import Link from "next/link";
import { TEXTES_FICHE_LIGNE } from "@/config/textes/espace-bibliotheque";
import type { LigneFiche } from "@/lib/espace/lignes-fiches";
import { cn } from "@/lib/utils";
import { frEspace, frEspaceProfond } from "@/lib/fr-typo";
import { Chevron, Coche } from "@/components/espace/aujourdhui/tableau";
import { ETIQUETTE, META, TEXTE_FORT } from "@/components/espace/typo";

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
 * s26 (Bibliothèque, `docs/ux/rubriques-premium-s26.md` §2.2) : la prochaine ligne à faire d'un bloc (première sans
 * « Fait ») prend `TEXTE_FORT` et ce filet de 2 px à gauche (pas un aplat). Constante seule : un seul changement.
 */
export const FILET_PROCHAINE = "border-l-2 border-l-text-primary";

/** Première ligne sans « Fait », dans l'ordre de la liste (null : tout est fait). */
export const prochaineLigne = (lignes: readonly LigneFiche[]) => lignes.find((l) => !l.fait) ?? null;

/** Progression d'une liste : lignes « Fait » sur le total (données déjà chargées, `idsFaits`). */
export const compteFaits = (lignes: readonly { fait: boolean }[]) => ({ faits: lignes.filter((l) => l.fait).length, total: lignes.length });

/** Compteur « faits/total » (chiffres seuls, aucun texte neuf), à droite d'un titre de bloc. */
export function CompteFaits({ faits, total }: { faits: number; total: number }) {
  return (
    <span className={cn("flex-none tabular-nums", META)} data-compte-faits>
      {faits}/{total}
    </span>
  );
}

/**
 * `deuxColonnes` (v5 §3, gabarit B des pages neuves de l'espace) : 1 colonne, 2 dès 768 px, quand la liste
 * prend la pleine coque (Quoi répondre) ; une liste dans un bloc de la Bibliothèque reste en 1 colonne.
 * s26 (typo s25 §1-§2) : rayons 12 px, titre en 14/400 blanc, marque de bonus en `ETIQUETTE`, « Fait » neutre avec
 * la coche `success` (plus de pastille violette ni de 12 px), chevron gris secondaire.
 */
export function ListeFiches({
  lignes,
  avecDuree = false,
  labelledBy,
  deuxColonnes = false,
  groupe,
  marquerProchaine = false,
}: {
  lignes: readonly LigneFiche[];
  avecDuree?: boolean;
  labelledBy?: string;
  deuxColonnes?: boolean;
  /** Titre du groupe au-dessus de la liste : son nom n'est pas répété en tête de chaque ligne (`sansPrefixe`). */
  groupe?: string;
  /** Bibliothèque (s26) : marque la prochaine ligne à faire (`FILET_PROCHAINE`, `TEXTE_FORT`). */
  marquerProchaine?: boolean;
}) {
  if (lignes.length === 0) return null;
  const prochaine = marquerProchaine ? prochaineLigne(lignes) : null;
  return (
    <ul className={cn("grid grid-cols-1 gap-2", deuxColonnes && "md:grid-cols-2 md:gap-x-6")} aria-labelledby={labelledBy}>
      {lignes.map((l) => {
        const estProchaine = prochaine?.id === l.id;
        return (
          <li key={l.id}>
            <Link
              href={l.href}
              data-fiche={l.id}
              data-prochaine={estProchaine ? "" : undefined}
              className={cn(
                "flex min-h-14 items-center gap-4 rounded-xl border border-border bg-background-light px-4 py-2 transition-colors hover:border-border-hover hover:bg-background-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary max-e300:grid max-e300:grid-cols-1 max-e300:gap-2",
                estProchaine && FILET_PROCHAINE,
              )}
            >
              <span className={cn("min-w-0 flex-1 [overflow-wrap:anywhere]", estProchaine ? TEXTE_FORT : `${META} text-text-primary`)}>
                {l.marque && <span className={cn("block", ETIQUETTE)}>{frEspace(l.marque)}</span>}
                {frEspace(groupe ? sansPrefixe(l.titre, groupe) : l.titre)}
                {(avecDuree || l.marque) && <span className={META}> · {T.minutes(l.minutes)}</span>}
              </span>
              {/* Relecture des captures nav s24 (ux F1) : la ligne entière est le lien ; « Fait » quand c'est fait,
                  sinon un chevron (plus de « Voir » répété sur chaque ligne). */}
              {l.fait ? (
                <span className={cn("inline-flex flex-none items-center gap-2 justify-self-start", META)} data-fait>
                  <Coche className="h-4 w-4 text-success" />
                  {T.fait}
                </span>
              ) : (
                <Chevron className="text-text-secondary max-e300:hidden" />
              )}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
