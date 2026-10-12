"use client";

import type { CSSProperties, MouseEvent, ReactNode } from "react";
import { buttonVariants } from "@/components/ui/button";
import { listPageHref, paginationGridColumns, paginationItems } from "@/lib/list-pagination";
import { cn } from "@/lib/utils";

interface ListPaginationProps {
  /** Chemin de la liste, ex. "/vannes". */
  basePath: string;
  page: number;
  totalPages: number;
  /**
   * Navigation sans rechargement quand JS est actif (le lien reste crawlable).
   * Absent (liste rendue par le serveur seul, ex. pages thème) : lien classique.
   */
  onNavigate?: (page: number) => void;
}

const GHOST_SM = buttonVariants({ variant: "ghost", size: "sm" });
// Cible 44 px : sous 768 px (h-11 de buttonVariants sm) et sur écran tactile (tablette).
const COARSE = "[@media(pointer:coarse)]:h-11 [@media(pointer:coarse)]:min-w-11";
// Cellule de grille mobile : carré de 44 px centré dans sa colonne (écart visible avec les chevrons).
const MOBILE_CELL = "max-md:mx-auto max-md:h-11 max-md:w-11";
// Numéros : pas régulier de 1 à 12 (chiffres de largeur égale, largeur minimale commune).
const NUMBER_CELL = cn("px-1 tabular-nums md:min-w-8", MOBILE_CELL, COARSE);
// Précédent / Suivant : chevron bordé sous 768 px (« bordé = cliquable »), libellé ghost au-delà.
const STEP_CELL = cn(
  "max-md:border max-md:border-border max-md:px-0 max-md:text-text-primary max-md:hover:border-border-hover",
  MOBILE_CELL,
  COARSE,
);
const TAP = "touch-manipulation active:bg-background-elevated";

function StepContent({ direction }: { direction: "prev" | "next" }) {
  return (
    <>
      {/* Libellé présent dans le HTML ; masqué visuellement (sr-only, pas display:none) sous 768 px. */}
      <span className="max-md:sr-only">{direction === "prev" ? "Précédent" : "Suivant"}</span>
      <span aria-hidden="true" className="md:sr-only">
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d={direction === "prev" ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"} />
        </svg>
      </span>
    </>
  );
}

/**
 * Pagination des listes catalogue : Précédent, numéros, Suivant dans une seule liste
 * (lot S1 s14 ; numéros s20, spec `docs/seo/maillage-decouverte-s20.md` S1 ; arbitrage
 * des relectures design et UX dans `docs/seo/captures-maillage-s20/`).
 * - Toutes les pages accessibles sont de vrais liens `<a href="?page=N">` du HTML serveur,
 *   aucun lien masqué : la page N est à un clic de n'importe quelle page.
 * - Page courante : `<span aria-current="page">` violet (sélection du site), « sur Y » lu.
 * - Extrémité sans voisine : `<span aria-hidden>` de même taille (la grille ne bouge pas).
 * - Sous 768 px : grille à rangées égales (colonnes calculées au rendu serveur).
 */
export function ListPagination({ basePath, page, totalPages, onNavigate }: ListPaginationProps) {
  if (totalPages <= 1) return null;

  const items = paginationItems(page, totalPages);
  const { cols, colsXs } = paginationGridColumns(items.length + 2);

  const link = (target: number, content: ReactNode, className: string, ariaLabel: string) => {
    const onClick = (e: MouseEvent<HTMLAnchorElement>) => {
      // Ctrl/Cmd/Maj + clic, clic molette : comportement natif du navigateur.
      if (!onNavigate || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
      e.preventDefault();
      onNavigate(target);
    };
    return (
      <a href={listPageHref(basePath, target)} onClick={onClick} aria-label={ariaLabel} className={cn(GHOST_SM, className, TAP)}>
        {content}
      </a>
    );
  };

  const step = (direction: "prev" | "next") => {
    const target = direction === "prev" ? page - 1 : page + 1;
    const available = direction === "prev" ? page > 1 : page < totalPages;
    if (!available) {
      return (
        <span aria-hidden="true" className={cn(GHOST_SM, STEP_CELL, "pointer-events-none opacity-50")}>
          <StepContent direction={direction} />
        </span>
      );
    }
    const label = direction === "prev" ? `Page précédente (page ${target})` : `Page suivante (page ${target})`;
    return link(target, <StepContent direction={direction} />, STEP_CELL, label);
  };

  const gridStyle = { "--cols": cols, "--cols-xs": colsXs } as CSSProperties;

  return (
    <nav aria-label="Pagination" className="mt-8">
      <ol
        role="list"
        style={gridStyle}
        className={cn(
          "mx-auto grid w-full max-w-sm gap-0.5",
          "grid-cols-[repeat(var(--cols),minmax(0,1fr))] max-[359px]:grid-cols-[repeat(var(--cols-xs),minmax(0,1fr))]",
          "md:flex md:max-w-none md:flex-wrap md:items-center md:justify-center md:gap-1",
        )}
      >
        <li className="flex md:mr-3">{step("prev")}</li>
        {items.map((item, index) =>
          item === "ellipsis" ? (
            <li key={`ellipsis-${index}`} aria-hidden="true" className="flex">
              <span className={cn("inline-flex h-8 items-center justify-center text-sm text-text-secondary", NUMBER_CELL)}>…</span>
            </li>
          ) : (
            <li key={item} className="flex">
              {item === page ? (
                <span
                  aria-current="page"
                  className={cn(
                    GHOST_SM,
                    NUMBER_CELL,
                    "cursor-default bg-accent-secondary-hover font-semibold text-white hover:bg-accent-secondary-hover hover:text-white",
                  )}
                >
                  <span className="sr-only">Page </span>
                  {item}
                  <span className="sr-only"> sur {totalPages}</span>
                </span>
              ) : (
                link(item, String(item), NUMBER_CELL, `Page ${item}`)
              )}
            </li>
          ),
        )}
        <li className="flex md:ml-3">{step("next")}</li>
      </ol>
    </nav>
  );
}
