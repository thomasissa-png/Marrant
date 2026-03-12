import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Fusionne les classes Tailwind avec gestion des conflits
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Niveaux utilisateur avec seuils XP
 */
export const USER_LEVELS = {
  NOVICE: { label: "Novice", minXp: 0, icon: "🌱" },
  APPRENTI: { label: "Apprenti", minXp: 100, icon: "📚" },
  FARCEUR: { label: "Farceur", minXp: 500, icon: "🃏" },
  COMIQUE: { label: "Comique", minXp: 1500, icon: "🎭" },
  LEGENDE: { label: "Légende", minXp: 5000, icon: "👑" },
} as const;

/**
 * Limites du plan gratuit
 */
export const FREE_LIMITS = {
  JOKES: 10,
  TIPS: 5,
  VIDEOS: 5,
  MAX_FAVORITES: 20,
} as const;

/**
 * Formate une date en français
 */
export function formatDateFr(date: Date): string {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}
