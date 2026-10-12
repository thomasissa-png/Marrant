"use client";

import type { MouseEvent } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { listPageHref, paginationItems } from "@/lib/list-pagination";
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

// Mêmes classes que Précédent / Suivant (ghost, sm : 44 px de haut sous md).
// Largeur minimale = cible tactile carrée de 44 px sur mobile (32 px au-delà).
const PAGE_CELL = "min-w-8 max-md:min-w-11";

/**
 * Pagination des listes catalogue : Précédent, rangée de numéros, Suivant
 * (lot S1 s14, numéros ajoutés en s20 : spec `docs/seo/maillage-decouverte-s20.md` S1).
 * Toutes les pages accessibles sont de vrais liens `<a href="?page=N">` présents dans
 * le HTML serveur (aucun lien masqué) : la page N est à un clic de n'importe quelle page.
 * Page courante : `<span aria-current="page">` sans lien. Page sans voisine : bouton désactivé.
 */
export function ListPagination({ basePath, page, totalPages, onNavigate }: ListPaginationProps) {
  if (totalPages <= 1) return null;

  const link = (target: number, label: string, className?: string, ariaLabel?: string) => {
    const onClick = (e: MouseEvent<HTMLAnchorElement>) => {
      // Ctrl/Cmd/Maj + clic, clic molette : comportement natif du navigateur.
      if (!onNavigate || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
      e.preventDefault();
      onNavigate(target);
    };
    return (
      <a
        href={listPageHref(basePath, target)}
        onClick={onClick}
        aria-label={ariaLabel}
        className={cn(buttonVariants({ variant: "ghost", size: "sm" }), className)}
      >
        {label}
      </a>
    );
  };

  return (
    <nav aria-label="Pagination" className="mt-8 flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
      {page > 1 ? (
        link(page - 1, "Précédent")
      ) : (
        <Button variant="ghost" size="sm" disabled>
          Précédent
        </Button>
      )}
      <ol className="flex flex-wrap items-center justify-center gap-1">
        {paginationItems(page, totalPages).map((item, index) => (
          <li key={item === "ellipsis" ? `ellipsis-${index}` : item}>
            {item === "ellipsis" ? (
              <span className={cn("inline-flex items-center justify-center text-sm text-text-secondary", PAGE_CELL)}>
                …
              </span>
            ) : item === page ? (
              <span
                aria-current="page"
                className={cn(
                  buttonVariants({ variant: "ghost", size: "sm" }),
                  PAGE_CELL,
                  "bg-background-elevated text-text-primary",
                )}
              >
                <span className="sr-only">Page </span>
                {item}
              </span>
            ) : (
              link(item, String(item), PAGE_CELL, `Page ${item}`)
            )}
          </li>
        ))}
      </ol>
      {page < totalPages ? (
        link(page + 1, "Suivant")
      ) : (
        <Button variant="ghost" size="sm" disabled>
          Suivant
        </Button>
      )}
    </nav>
  );
}
