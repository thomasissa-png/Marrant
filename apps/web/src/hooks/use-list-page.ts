"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { parsePageParam, withPageParam } from "@/lib/list-pagination";

/**
 * Page courante d'une liste catalogue, synchronisée avec `?page=N` (lot S1 s14).
 *
 * - Valeur initiale = page rendue par le serveur (pas de décalage à l'hydratation).
 * - Changer de page met l'URL à jour (history.pushState, sans rechargement) :
 *   l'URL reste partageable et identique au lien crawlable.
 * - Précédent / suivant du navigateur : la page suit l'URL.
 */
export function useListPage(initialPage = 1) {
  const searchParams = useSearchParams();
  const urlPage = parsePageParam(searchParams.get("page"));
  const [page, setPage] = useState(initialPage);

  useEffect(() => {
    setPage(urlPage);
  }, [urlPage]);

  const goToPage = useCallback((next: number) => {
    setPage(next);
    window.history.pushState(null, "", withPageParam(window.location.pathname, window.location.search, next));
  }, []);

  /** Retour en page 1 (changement de filtre) : l'URL perd son `?page=`. */
  const resetPage = useCallback(() => {
    setPage(1);
    window.history.replaceState(null, "", withPageParam(window.location.pathname, window.location.search, 1));
  }, []);

  return { page, goToPage, resetPage };
}
