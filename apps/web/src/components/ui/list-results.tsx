"use client";

import { forwardRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ListResultsProps {
  /** Chargement en cours (l'annonce attend l'arrivée des données). */
  isLoading: boolean;
  /**
   * Une AUTRE page est en cours de chargement alors qu'une liste non vide est affichée :
   * elle reste visible, atténuée, avec `aria-busy`. Faux pendant le simple
   * rafraîchissement client de la page rendue par le serveur (pas de clignotement).
   */
  pending: boolean;
  page: number;
  totalPages: number;
  /** Vrai après un changement de page par la pagination : annonce « Page N sur Y ». */
  announce: boolean;
  children: ReactNode;
}

/**
 * Conteneur des résultats d'une liste catalogue (s20, relecture UX de la pagination).
 * Cible du retour en haut de liste après changement de page (`useListPage` : défilement
 * instantané puis focus, d'où `tabIndex={-1}` et `scroll-mt-20` sous l'en-tête collant),
 * `aria-busy` + liste atténuée pendant le chargement, annonce lecteur d'écran à l'arrivée
 * des données.
 */
export const ListResults = forwardRef<HTMLDivElement, ListResultsProps>(function ListResults(
  { isLoading, pending, page, totalPages, announce, children },
  ref,
) {
  return (
    <div
      ref={ref}
      tabIndex={-1}
      aria-busy={pending}
      className={cn("scroll-mt-20 outline-none transition-opacity", pending && "opacity-60")}
    >
      {children}
      <p role="status" className="sr-only">
        {announce && !isLoading && totalPages > 1 ? `Page ${page} sur ${totalPages}` : ""}
      </p>
    </div>
  );
});
