"use client";

import { createContext, useContext } from "react";
import { etapeDecoupee, type BlocReference } from "@/lib/espace/parcours-fiches";
import { TEXTES_PARCOURS_ESPACE } from "@/config/textes/espace-caps";
import { QUIZ_TITRE, VANNES_ETAPE } from "@/config/textes/parcours";
import { frTypoParcours, frEspaceProfond } from "@/lib/fr-typo";
import { Chevron, Coche } from "@/components/espace/aujourdhui/tableau";
import { META, META_FORT } from "@/components/espace/typo";
import { cn } from "@/lib/utils";
// Lot D11c : textes de l'interface avec la typographie de l'espace (espaces insécables, `frEspace`).
const P = frEspaceProfond(TEXTES_PARCOURS_ESPACE);

/** s26 parcours, tour 5 (D2 de la relecture design v2) : lignes non soulignées, soulignement au survol et au focus seulement. */
const SOULIGNE_SURVOL = "underline-offset-2 group-hover:underline group-focus-visible:underline";

/** Ancre d'une fiche dans l'étape : `fiche-N-M` (architecture v20 5.1). */
export const ancreFiche = (etape: number, rang: number) => `fiche-${etape}-${rang}`;

export interface EtapeVue {
  order: number;
  tip: { title: string };
  videos?: ReadonlyArray<{ youtubeId: string; title: string; artist?: string }> | null;
  /** Vannes servies à l'abonné : sans elles, la carte n'a pas de bloc « Vannes à pratiquer ». */
  jokes?: ReadonlyArray<unknown> | null;
  quiz?: ReadonlyArray<unknown> | null;
}

/**
 * s26 parcours, tour 5 (faute dure F1 de la relecture UX v2 : « 2.2 Vannes à pratiquer » menait sur un repère sans bloc) :
 * la carte d'étape de l'abonné rend-elle le bloc de cette fiche ? Mêmes conditions que `parcours-step-card.tsx` (vannes
 * reçues, vidéo présente, quiz affiché tant qu'il n'est ni fini ni l'étape validée). Une fiche sans bloc n'est pas listée :
 * chaque ligne mène à un bloc titré de son nom.
 */
export function blocRendu(ref: BlocReference, etape: EtapeVue, etat: { etapeFaite: boolean; quizFait: boolean }): boolean {
  switch (ref.bloc) {
    case "conseil":
      return etape.tip.title.trim() !== "";
    case "vannes":
      return (etape.jokes?.length ?? 0) > 0;
    case "video":
      return !!etape.videos?.some((v) => v.youtubeId === ref.youtubeId);
    case "quiz":
      return (etape.quiz?.length ?? 0) > 0 && !etat.quizFait && !etat.etapeFaite;
  }
}

/**
 * s26 parcours, tour 5 : sous-étape choisie, partagée par le menu d'étapes et la liste de la carte (sous 1024). Un seul
 * état actif : la fiche choisie ; sans choix dans l'étape, la première fiche d'une étape non validée.
 */
export const FicheActiveContexte = createContext<{ active: string | null; choisir: (ancre: string) => void } | null>(null);

/** Libellé d'une fiche : un texte déjà en ligne (titre du conseil, titres de blocs, titre de la vidéo). */
export function libelleFiche(ref: BlocReference, etape: EtapeVue): string {
  switch (ref.bloc) {
    case "conseil":
      return etape.tip.title;
    case "vannes":
      return VANNES_ETAPE.titre;
    case "video": {
      const v = etape.videos?.find((x) => x.youtubeId === ref.youtubeId);
      return v ? (v.artist ? `${v.title} · ${v.artist}` : v.title) : "";
    }
    case "quiz":
      return QUIZ_TITRE.abonne;
  }
}

/**
 * Fiches d'une étape (découpage `data/espace/parcours-fiches.json`, lot D4) : « N.M » et le libellé du bloc existant,
 * vers son ancre `#fiche-N-M`. Aucun texte d'étape réécrit. Chargé à la demande (`next/dynamic`) dans la carte d'étape.
 * Lot D11b (Q-4, @design D1) : ligne qui passe à la ligne et titre de 128 px au moins (jamais une lettre par ligne à 200 %).
 * s26 parcours v2 (`docs/design/parcours-connecte-v2-s26.md` §3) : la ligne ENTIÈRE est le lien (44 px), chevron seul à
 * droite ; plus de « Voir » (cinq liens au même nom). Fiche active (choisie, sinon première fiche d'une étape non
 * validée) : filet blanc de 2 px et titre en méta forte ; étape validée : coche et titres gris, « Fait » lu. `variante`
 * « menu » : sous l'étape active du menu d'étapes (`pl-14 pr-6`, sans cadre). Tour 5 : sans soulignement au repos ; dans
 * la page d'un parcours (`FicheActiveContexte`), le clic amène le bloc de la fiche sous l'en-tête collant.
 */
export function LignesFiches({
  slug,
  etape,
  etapeFaite = false,
  quizFait = false,
  variante = "carte",
  className,
}: {
  slug: string;
  etape: EtapeVue;
  etapeFaite?: boolean;
  quizFait?: boolean;
  variante?: "carte" | "menu";
  className?: string;
}) {
  const contexte = useContext(FicheActiveContexte);
  const decoupe = etapeDecoupee(slug, etape.order);
  if (!decoupe) return null;
  const lignes = decoupe.fiches
    .filter((f) => blocRendu(f.ref, etape, { etapeFaite, quizFait }))
    .map((f) => ({ ...f, titre: libelleFiche(f.ref, etape) }))
    .filter((f) => f.titre !== "");
  if (lignes.length === 0) return null;
  const menu = variante === "menu";
  const choisie = lignes.some((f) => f.ancre === contexte?.active) ? contexte?.active : null;
  return (
    <ol
      className={cn(menu ? "pb-2" : "divide-y divide-border overflow-hidden rounded-xl border border-border", className)}
      data-testid={menu ? "lignes-fiches-menu" : "lignes-fiches"}
    >
      {lignes.map((f, i) => {
        const active = choisie ? f.ancre === choisie : !etapeFaite && i === 0;
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
              <span className={cn("flex-none tabular-nums", SOULIGNE_SURVOL, active ? META_FORT : META)}>{f.numero}</span>
              <span
                className={cn(
                  "min-w-[min(8rem,100%)] flex-1 [overflow-wrap:anywhere]",
                  SOULIGNE_SURVOL,
                  active ? META_FORT : etapeFaite ? META : cn(META, "text-text-primary"),
                )}
              >
                {frTypoParcours(f.titre)}
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
