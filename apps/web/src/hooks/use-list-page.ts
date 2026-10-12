"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { parsePageParam, withPageParam } from "@/lib/list-pagination";

/**
 * Page courante d'une liste catalogue, synchronisée avec `?page=N` (lot S1 s14).
 *
 * - Valeur initiale = page rendue par le serveur (pas de décalage à l'hydratation).
 * - Changer de page met l'URL à jour (history.pushState, sans rechargement) :
 *   l'URL reste partageable et identique au lien crawlable.
 * - Précédent / suivant du navigateur : la page suit l'URL.
 * - s20 (relecture UX de la pagination) : après un changement de page, retour
 *   instantané en haut de la liste (`listRef`, conteneur `ListResults`) puis focus sur
 *   ce conteneur (le lien cliqué disparaît : le focus n'est pas perdu). Défilement
 *   jamais animé : `behavior: "instant"` passe outre le `scroll-behavior: smooth`
 *   global, et respecte donc `prefers-reduced-motion` d'office.
 */
export function useListPage(initialPage = 1) {
  const searchParams = useSearchParams();
  const urlPage = parsePageParam(searchParams.get("page"));
  const [page, setPage] = useState(initialPage);
  /** Vrai après une navigation par la pagination : déclenche l'annonce « Page N sur Y ». */
  const [announce, setAnnounce] = useState(false);
  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setPage(urlPage);
  }, [urlPage]);

  const goToPage = useCallback((next: number) => {
    setPage(next);
    setAnnounce(true);
    window.history.pushState(null, "", withPageParam(window.location.pathname, window.location.search, next));
    const list = listRef.current;
    if (list) {
      list.scrollIntoView({ block: "start", behavior: "instant" });
      list.focus({ preventScroll: true });
    }
  }, []);

  /** Retour en page 1 (changement de filtre) : l'URL perd son `?page=`. */
  const resetPage = useCallback(() => {
    setPage(1);
    setAnnounce(false);
    window.history.replaceState(null, "", withPageParam(window.location.pathname, window.location.search, 1));
  }, []);

  return { page, goToPage, resetPage, listRef, announce };
}
