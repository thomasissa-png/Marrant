"use client";

import { create } from "zustand";

interface Favorite {
  id: string;
  contentType: "JOKE" | "TIP" | "VIDEO";
  jokeId: string | null;
  tipId: string | null;
  videoId: string | null;
  createdAt: string;
  joke?: Record<string, unknown> | null;
  tip?: Record<string, unknown> | null;
  video?: Record<string, unknown> | null;
}

interface FavoritesState {
  favorites: Favorite[];
  isLoading: boolean;
  fetchFavorites: () => Promise<void>;
  addFavorite: (contentType: "JOKE" | "TIP" | "VIDEO", contentId: string) => Promise<boolean>;
  removeFavorite: (id: string) => Promise<boolean>;
  isFavorite: (contentType: "JOKE" | "TIP" | "VIDEO", contentId: string) => boolean;
  getFavoriteId: (contentType: "JOKE" | "TIP" | "VIDEO", contentId: string) => string | null;
}

export const useFavoritesStore = create<FavoritesState>((set, get) => ({
  favorites: [],
  isLoading: false,

  fetchFavorites: async () => {
    set({ isLoading: true });
    try {
      const res = await fetch("/api/favorites");
      if (res.ok) {
        const data = await res.json();
        set({ favorites: data.favorites, isLoading: false });
      } else {
        set({ isLoading: false });
      }
    } catch {
      set({ isLoading: false });
    }
  },

  addFavorite: async (contentType, contentId) => {
    try {
      const res = await fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contentType, contentId }),
      });
      if (res.ok) {
        const data = await res.json();
        set((state) => ({
          favorites: [data.favorite, ...state.favorites],
        }));
        return true;
      }
      return false;
    } catch {
      return false;
    }
  },

  removeFavorite: async (id) => {
    try {
      const res = await fetch(`/api/favorites/${id}`, { method: "DELETE" });
      if (res.ok) {
        set((state) => ({
          favorites: state.favorites.filter((f) => f.id !== id),
        }));
        return true;
      }
      return false;
    } catch {
      return false;
    }
  },

  isFavorite: (contentType, contentId) => {
    const { favorites } = get();
    return favorites.some((f) => {
      if (f.contentType !== contentType) return false;
      if (contentType === "JOKE") return f.jokeId === contentId;
      if (contentType === "TIP") return f.tipId === contentId;
      if (contentType === "VIDEO") return f.videoId === contentId;
      return false;
    });
  },

  getFavoriteId: (contentType, contentId) => {
    const { favorites } = get();
    const fav = favorites.find((f) => {
      if (f.contentType !== contentType) return false;
      if (contentType === "JOKE") return f.jokeId === contentId;
      if (contentType === "TIP") return f.tipId === contentId;
      if (contentType === "VIDEO") return f.videoId === contentId;
      return false;
    });
    return fav?.id ?? null;
  },
}));
