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
 * Formate une date en français
 */
export function formatDateFr(date: Date): string {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

/**
 * Formate une date ISO « AAAA-MM-JJ » en français (« 13 mars 2026 »).
 * Valeur vide ou invalide : renvoyée telle quelle.
 */
export function formatIsoDateFr(iso: string): string {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return iso;
  const date = new Date(`${iso}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}
