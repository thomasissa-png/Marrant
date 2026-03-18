"use client";

import { create } from "zustand";

interface UserProfile {
  id: string;
  name: string | null;
  email: string;
  plan: "FREE" | "PREMIUM";
  level: "NOVICE" | "APPRENTI" | "FARCEUR" | "COMIQUE" | "LEGENDE";
  xp: number;
  streak: number;
  lastActiveAt: string | null;
  stats: {
    jokesRead: number;
    tipsCompleted: number;
    videosWatched: number;
    totalFavorites: number;
    pathsCompleted: number;
  };
}

interface UserState {
  user: UserProfile | null;
  isLoading: boolean;
  fetchUser: () => Promise<void>;
  addXp: (amount: number, action: string) => Promise<void>;
  reset: () => void;
}

export const useUserStore = create<UserState>((set, get) => ({
  user: null,
  isLoading: false,

  fetchUser: async () => {
    set({ isLoading: true });
    try {
      const res = await fetch("/api/user");
      if (res.ok) {
        const data = await res.json();
        set({ user: data.user, isLoading: false });
      } else {
        set({ user: null, isLoading: false });
      }
    } catch {
      set({ user: null, isLoading: false });
    }
  },

  addXp: async (amount: number, action: string) => {
    const { user } = get();
    if (!user) return;

    try {
      const res = await fetch("/api/user/xp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, action }),
      });
      if (res.ok) {
        const data = await res.json();
        set({ user: { ...user, xp: data.xp, level: data.level } });
      }
    } catch {
      // Silencieux en cas d'erreur réseau
    }
  },

  reset: () => set({ user: null, isLoading: false }),
}));
