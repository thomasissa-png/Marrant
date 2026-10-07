/**
 * Progression des parcours (s17) : niveaux, série de jours sur la pratique,
 * XP d'étape et de fin, rythme doux.
 *
 * - Niveaux (FS-07) : un seul barème, partagé par la validation d'étape et
 *   `/api/user/xp` (avant : niveau jamais recalculé à la validation).
 * - Série de jours (D3, FS-05, UX-04) : comptée sur la PRATIQUE (étape
 *   validée, quiz d'étape terminé), en jour civil de Paris, plus sur la
 *   connexion. `effectiveStreak` remet l'affichage à 0 si la série est rompue.
 * - Rythme doux (D2) : prochaine étape conseillée 7 jours après la dernière
 *   validation ; rien n'est bloqué.
 */
import parcoursSeed from "../../../../docs/content/parcours-seed.json";
import { parisParts } from "@/lib/analytics/weekly-visits-period";

export const XP_THRESHOLDS = {
  NOVICE: 0,
  APPRENTI: 100,
  FARCEUR: 500,
  COMIQUE: 1500,
  LEGENDE: 5000,
} as const;

export type UserLevelName = keyof typeof XP_THRESHOLDS;

export function calculateLevel(xp: number): UserLevelName {
  if (xp >= XP_THRESHOLDS.LEGENDE) return "LEGENDE";
  if (xp >= XP_THRESHOLDS.COMIQUE) return "COMIQUE";
  if (xp >= XP_THRESHOLDS.FARCEUR) return "FARCEUR";
  if (xp >= XP_THRESHOLDS.APPRENTI) return "APPRENTI";
  return "NOVICE";
}

/** Bonus de fin de parcours (inchangé depuis s14). */
export const PATH_COMPLETION_BONUS_XP = 100;
/** XP d'une étape absente du seed. */
export const DEFAULT_STEP_XP = 20;
/** Rythme doux (D2) : jours entre une validation et la prochaine étape conseillée. */
export const NEXT_STEP_DELAY_DAYS = 7;

interface SeedStep {
  week: number;
  moduleXp?: number;
}
interface SeedPath {
  slug: string;
  steps: SeedStep[];
}
const SEED = parcoursSeed as SeedPath[];

/** XP d'une étape (valeur `moduleXp` du seed, 20 par défaut). */
export function getStepXpFromSeed(pathSlug: string | null, stepOrder: number): number {
  if (!pathSlug) return DEFAULT_STEP_XP;
  const seed = SEED.find((p) => p.slug === pathSlug);
  const step = seed?.steps.find((s) => s.week === stepOrder);
  return step?.moduleXp ?? DEFAULT_STEP_XP;
}

/** Total d'XP d'un parcours, bonus de fin COMPRIS (UX-05 c : 325 et non 225 pour Machine à Café). */
export function getPathXpTotal(pathSlug: string, stepOrders: number[]): number {
  return stepOrders.reduce((sum, order) => sum + getStepXpFromSeed(pathSlug, order), 0) + PATH_COMPLETION_BONUS_XP;
}

/** Numéro de jour civil de Paris (jours depuis l'époque), pour comparer deux dates. */
export function parisDayNumber(date: Date): number {
  const p = parisParts(date);
  return Math.floor(Date.UTC(p.year, p.month - 1, p.day) / 86_400_000);
}

/** Nouvelle série après une pratique à `now`. Même jour : inchangée ; veille : +1 ; sinon : 1. */
export function nextStreak(streak: number, lastPracticeAt: Date | null, now: Date): number {
  if (!lastPracticeAt) return 1;
  const diff = parisDayNumber(now) - parisDayNumber(lastPracticeAt);
  if (diff <= 0) return Math.max(streak, 1);
  if (diff === 1) return streak + 1;
  return 1;
}

/** Série à afficher : 0 si la dernière pratique date d'avant-hier ou plus (série rompue). */
export function effectiveStreak(streak: number, lastPracticeAt: Date | null, now: Date = new Date()): number {
  if (!lastPracticeAt) return 0;
  return parisDayNumber(now) - parisDayNumber(lastPracticeAt) <= 1 ? streak : 0;
}

/** Date conseillée pour l'étape suivante (D2), ISO. */
export function nextRecommendedAt(lastCompletedAt: Date): string {
  return new Date(lastCompletedAt.getTime() + NEXT_STEP_DELAY_DAYS * 86_400_000).toISOString();
}

/** Sous-ensemble Prisma utilisé pour la pratique (client ou transaction). */
export interface PracticeDb {
  user: {
    findUnique(args: {
      where: { id: string };
      select: { streak: true; lastPracticeAt: true };
    }): Promise<{ streak: number; lastPracticeAt: Date | null } | null>;
    update(args: {
      where: { id: string };
      data: { streak: number; lastPracticeAt: Date; lastActiveAt: Date };
    }): Promise<unknown>;
  };
}

/** Enregistre une pratique (série de jours). Retourne la série à jour. */
export async function recordPractice(db: PracticeDb, userId: string, now: Date = new Date()): Promise<number> {
  const user = await db.user.findUnique({ where: { id: userId }, select: { streak: true, lastPracticeAt: true } });
  if (!user) return 0;
  const streak = nextStreak(user.streak, user.lastPracticeAt, now);
  await db.user.update({ where: { id: userId }, data: { streak, lastPracticeAt: now, lastActiveAt: now } });
  return streak;
}

/** Valeurs fermées du retour d'exercice (PM-06, avis @legal C13). */
export const RETOURS_EXERCICE = ["pas-essaye", "essaye-bof", "essaye-ca-a-marche"] as const;
export type RetourExercice = (typeof RETOURS_EXERCICE)[number];
