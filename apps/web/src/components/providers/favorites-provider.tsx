"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useFavoritesStore } from "@/stores/favorites-store";

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const { status } = useSession();
  const fetchFavorites = useFavoritesStore((s) => s.fetchFavorites);

  useEffect(() => {
    if (status === "authenticated") {
      fetchFavorites();
    }
  }, [status, fetchFavorites]);

  return <>{children}</>;
}
