"use client";

import type { MouseEvent } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { listPageHref } from "@/lib/list-pagination";

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

/**
 * Pagination Précédent / Page X / Y / Suivant des listes catalogue (lot S1 s14).
 * Même rendu que les anciens boutons ; les pages accessibles sont de vrais liens
 * `<a href="?page=N">` (crawlables sans JS). Page sans voisine : bouton désactivé.
 */
export function ListPagination({ basePath, page, totalPages, onNavigate }: ListPaginationProps) {
  if (totalPages <= 1) return null;

  const link = (target: number, label: string) => {
    const onClick = (e: MouseEvent<HTMLAnchorElement>) => {
      // Ctrl/Cmd/Maj + clic, clic molette : comportement natif du navigateur.
      if (!onNavigate || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
      e.preventDefault();
      onNavigate(target);
    };
    return (
      <a href={listPageHref(basePath, target)} onClick={onClick} className={buttonVariants({ variant: "ghost", size: "sm" })}>
        {label}
      </a>
    );
  };

  return (
    <nav aria-label="Pagination" className="mt-8 flex items-center justify-center gap-4">
      {page > 1 ? (
        link(page - 1, "Précédent")
      ) : (
        <Button variant="ghost" size="sm" disabled>
          Précédent
        </Button>
      )}
      <span className="text-sm text-text-secondary">
        Page {page} / {totalPages}
      </span>
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
