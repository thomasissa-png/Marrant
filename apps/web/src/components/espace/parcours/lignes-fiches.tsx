"use client";

import { createContext, useContext } from "react";
import { fichesAffichees, type EtapeVue } from "@/lib/espace/sous-etapes";
import { TEXTES_PARCOURS_ESPACE } from "@/config/textes/espace-caps";
import { frTypoParcours, frEspaceProfond, pointMedianInsecable } from "@/lib/fr-typo";
import { Chevron, Coche } from "@/components/espace/aujourdhui/tableau";
import { META } from "@/components/espace/typo";
import { cn } from "@/lib/utils";
// Lot D11c : textes de l'interface avec la typographie de l'espace (espaces insécables, `frEspace`).
const P = frEspaceProfond(TEXTES_PARCOURS_ESPACE);

/** s26 parcours, tour 5 (D2 de la relecture design v2) : lignes non soulignées, soulignement au survol et au focus seulement. */
const SOULIGNE_SURVOL = "underline-offset-2 group-hover:underline group-focus-visible:underline";

/** Ancre d'une sous-étape affichée « N.k » : `fiche-N-k` (s26 parcours, tour 7 : la numérotation affichée). */
export const ancreFiche = (etape: number, rang: number) => `fiche-${etape}-${rang}`;

export { blocRendu, libelleFiche, type EtapeVue } from "@/lib/espace/sous-etapes";

/**
 * s26 parcours, tour 5 : sous-étape choisie, partagée par le menu d'étapes et la liste de la carte (sous 1024). Un seul
 * état actif : la fiche choisie ; sans choix dans l'étape, la première fiche d'une étape non validée.
 */
export const FicheActiveContexte = createContext<{ active: string | null; choisir: (ancre: string) => void } | null>(null);

/**
 * Fiches d'une étape (découpage `data/espace/parcours-fiches.json`, lot D4) : « N.M » et le libellé du bloc existant,
 * vers son ancre `#fiche-N-M`. Aucun texte d'étape réécrit. Chargé à la demande (`next/dynamic`) dans la carte d'étape.
 * Lot D11b (Q-4, @design D1) : ligne qui passe à la ligne et titre de 128 px au moins (jamais une lettre par ligne à 200 %).
 * s26 parcours v2 (`docs/design/parcours-connecte-v2-s26.md` §3) : la ligne ENTIÈRE est le lien (44 px), chevron seul à
 * droite ; plus de « Voir » (cinq liens au même nom). Fiche active (choisie, sinon première fiche d'une étape non
 * validée) : filet blanc de 2 px et titre en blanc (tour 6 : même graisse que les autres) ; étape validée : coche et titres gris, « Fait » lu. `variante`
 * « menu » : sous l'étape active du menu d'étapes (`pl-14 pr-6`, sans cadre). Tour 5 : sans soulignement au repos ; dans
 * la page d'un parcours (`FicheActiveContexte`), le clic amène le bloc de la fiche sous l'en-tête collant.
 */
export function LignesFiches({
  slug,
  etape,
  etapeFaite = false,
  quizFait = false,
  variante = "carte",
  etapeAffichee = true,
  className,
}: {
  slug: string;
  etape: EtapeVue;
  etapeFaite?: boolean;
  quizFait?: boolean;
  variante?: "carte" | "menu";
  /** s26 parcours, tour 7 : faux pour les sous-étapes d'une étape du menu autre que celle affichée (aucune ligne active). */
  etapeAffichee?: boolean;
  className?: string;
}) {
  const contexte = useContext(FicheActiveContexte);
  // s26 parcours, tour 6 (D8 UX, D2 design v3 : « 2.1, 2.3, 2.4 », il manque une étape) : numéro par position parmi les
  // sous-étapes AFFICHÉES, le même dans le menu et dans la liste de la carte. Tour 7 : l'ancre suit ce numéro (`#fiche-2-2`
  // pour « 2.2 », `sous-etapes.ts`).
  const lignes = fichesAffichees(slug, etape, { etapeFaite, quizFait });
  if (lignes.length === 0) return null;
  const menu = variante === "menu";
  const choisie = lignes.some((f) => f.ancre === contexte?.active) ? contexte?.active : null;
  return (
    <ol
      className={cn(menu ? "pb-2" : "divide-y divide-border overflow-hidden rounded-xl border border-border", className)}
      data-testid={menu ? "lignes-fiches-menu" : "lignes-fiches"}
    >
      {lignes.map((f, i) => {
        // Tour 7 (menu figé) : sous une étape du menu qui n'est pas l'étape affichée, aucune ligne active.
        const active = choisie ? f.ancre === choisie : etapeAffichee && !etapeFaite && i === 0;
        return (
          <li key={f.ancre}>
            <a
              href={`#${f.ancre}`}
              data-fiche={f.ancre}
              data-fiche-active={active || undefined}
              aria-current={f.ancre === choisie ? "location" : undefined}
              onClick={
                contexte
                  ? (e) => {
                      e.preventDefault();
                      contexte.choisir(f.ancre);
                    }
                  : undefined
              }
              className={cn(
                "group relative flex min-h-11 flex-wrap items-center gap-x-3 gap-y-1 py-2 hover:bg-background-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent-primary before:absolute before:inset-y-0 before:left-0 before:w-0.5",
                menu ? "pl-14 pr-6" : "px-4",
                active && "before:bg-text-primary",
              )}
            >
              {/* s26 parcours, tour 6 (D3 design v3 : le gras de la ligne active la passait sur 2 lignes, menu +12 px) :
                  graisse constante, l'état actif est le filet et le blanc, les autres lignes en gris ; 0 px de saut. */}
              <span className={cn("flex-none tabular-nums", SOULIGNE_SURVOL, META, active && "text-text-primary")}>{f.numero}</span>
              <span
                className={cn(
                  "min-w-[min(8rem,100%)] flex-1 [overflow-wrap:anywhere]",
                  SOULIGNE_SURVOL,
                  META,
                  active && "text-text-primary",
                )}
              >
                {pointMedianInsecable(frTypoParcours(f.titre))}
              </span>
              {etapeFaite && (
                <span className="inline-flex flex-none items-center" data-statut="fait">
                  <Coche className="h-4 w-4 text-success" />
                  <span className="sr-only">{P.sommaire.fait}</span>
                </span>
              )}
              <Chevron className="text-text-secondary" />
            </a>
          </li>
        );
      })}
    </ol>
  );
}
