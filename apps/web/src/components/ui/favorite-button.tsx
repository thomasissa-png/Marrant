"use client";

import { useSession } from "next-auth/react";
import { useFavoritesStore } from "@/stores/favorites-store";
import { useUserStore } from "@/stores/user-store";
import { toast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";

interface FavoriteButtonProps {
  contentType: "JOKE" | "TIP" | "VIDEO";
  contentId: string;
  className?: string;
}

export function FavoriteButton({ contentType, contentId, className }: FavoriteButtonProps) {
  const { status } = useSession();
  const { isFavorite, addFavorite, removeFavorite, getFavoriteId } = useFavoritesStore();
  const user = useUserStore((s) => s.user);

  if (status !== "authenticated") return null;
  if (user?.plan !== "PREMIUM") return null;

  const isFav = isFavorite(contentType, contentId);
  const favId = getFavoriteId(contentType, contentId);

  const handleClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isFav && favId) {
      await removeFavorite(favId);
    } else {
      await addFavorite(contentType, contentId);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        "flex h-8 w-8 items-center justify-center rounded-full transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary",
        isFav
          ? "bg-accent-primary/20 text-accent-primary scale-110"
          : "bg-background-elevated text-text-muted hover:text-accent-primary hover:bg-accent-primary/10",
        className
      )}
      aria-label={isFav ? "Retirer des favoris" : "Ajouter aux favoris"}
    >
      <svg
        className="h-4 w-4"
        fill={isFav ? "currentColor" : "none"}
        stroke="currentColor"
        viewBox="0 0 24 24"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
        />
      </svg>
    </button>
  );
}
