/**
 * Copy Review Runner — s11 charte de relecture.
 *
 * Traite un lot BORNÉ de vannes et de conseils IA (generatedByAI=true) selon
 * la charte s11. Le lot est piloté par `COPY_REVIEW_BATCH` (défaut 25 vannes
 * + 25 conseils). Idempotent : seuls les items dont `copyReviewVersion`
 * diffère de la version courante sont sélectionnés.
 *
 * Sécurités :
 *  - Kill-switch env `COPY_REVIEW_ENABLED` (défaut ACTIF — mais si "false", skip).
 *  - Chaque échec (LLM crash, DB down) est loggé, on continue avec l'item suivant.
 *  - REECRIRE : la nouvelle version passe par le Stand-Up Director avant
 *    d'écrire en DB. Score < 8 → on conserve l'original.
 *  - RETIRER : `isActive=false` (soft delete), la ligne reste (favoris/likes
 *    conservés — le UI filtre déjà sur isActive).
 *  - Réversibilité : `originalContent`/`originalPunchline` (Joke) et
 *    `originalTitle`/`originalContent` (Tip) sont écrits AVANT la réécriture.
 *    Rollback = copier `original*` dans `*` + reset `copyReviewedAt`.
 */
import { prisma } from "@/lib/prisma";
import { withDbRetry } from "@/lib/db-retry";
import {
  reviewJoke,
  reviewTip,
  COPY_REVIEW_VERSION,
  type JokeReviewResult,
  type TipReviewResult,
} from "@/lib/ai/agents/copy-review-agent";
import {
  validateJoke,
  validateTip,
  type JokeToValidate,
  type TipToValidate,
} from "@/lib/ai/agents/standup-director-agent";
import { getPersonaForDay } from "@/lib/ai/personas";

const DEFAULT_BATCH = 25;
const MIN_DIRECTOR_SCORE = 8;

function parsePositiveInt(raw: string | undefined, fallback: number): number {
  const n = Number.parseInt(raw ?? "", 10);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

/**
 * Vrai si la relecture est activée (défaut activée). Le kill-switch bloque
 * complètement le job — utile en cas de dépassement budget ou d'incident.
 */
export function isCopyReviewEnabled(): boolean {
  const v = (process.env.COPY_REVIEW_ENABLED ?? "").trim().toLowerCase();
  if (v === "false" || v === "0" || v === "off" || v === "no") return false;
  return true;
}

/**
 * TTL du verrou quotidien : couvre toute la fenêtre 3h-4h59 UTC du scheduler.
 * Le verrou n'est PAS relâché après le lot : sinon chaque tick de 15 min de la
 * fenêtre (8 ticks) relançait un lot → 8 × 25 vannes + 8 × 25 conseils par
 * jour au lieu d'un seul lot borné (relecture s11).
 */
export const COPY_REVIEW_DAILY_LOCK_TTL_MS = 3 * 60 * 60 * 1000;

/**
 * Point d'entrée du scheduler : un seul lot par jour UTC (verrou `JobLock`
 * daté, conservé jusqu'à expiration). Retourne `null` si le lot du jour a déjà
 * été pris (autre tick ou autre instance) ou si le kill-switch est actif.
 */
export async function runDailyCopyReviewOnce(now: Date = new Date()): Promise<CopyReviewStats | null> {
  if (!isCopyReviewEnabled()) return null;
  const { tryAcquireLock, buildJobLockKey } = await import("@/lib/job-lock");
  const acquired = await tryAcquireLock(
    buildJobLockKey("copy-review", now),
    COPY_REVIEW_DAILY_LOCK_TTL_MS,
  );
  if (!acquired) return null;
  return runCopyReviewBatch(now);
}

export interface CopyReviewStats {
  jokesProcessed: number;
  jokesKept: number;
  jokesRewritten: number;
  jokesRemoved: number;
  jokesGuarded: number; // réécriture rejetée par le Director → gardée
  tipsProcessed: number;
  tipsKept: number;
  tipsRewritten: number;
  tipsRemoved: number;
  tipsGuarded: number;
  errors: number;
}

function emptyStats(): CopyReviewStats {
  return {
    jokesProcessed: 0,
    jokesKept: 0,
    jokesRewritten: 0,
    jokesRemoved: 0,
    jokesGuarded: 0,
    tipsProcessed: 0,
    tipsKept: 0,
    tipsRewritten: 0,
    tipsRemoved: 0,
    tipsGuarded: 0,
    errors: 0,
  };
}

/**
 * Exécute une passe de relecture bornée. Retourne un stats consultable par le
 * scheduler / les tests. La date sert uniquement à sélectionner le persona
 * fictif utilisé pour la validation Director (persona du jour).
 */
export async function runCopyReviewBatch(now: Date = new Date()): Promise<CopyReviewStats> {
  const stats = emptyStats();
  if (!isCopyReviewEnabled()) {
    console.log("[copy-review] Kill-switch actif (COPY_REVIEW_ENABLED=false) — skip.");
    return stats;
  }

  const batchSize = parsePositiveInt(process.env.COPY_REVIEW_BATCH, DEFAULT_BATCH);
  const version = COPY_REVIEW_VERSION;

  // Persona déterministe pour la validation Director (le Director exige un persona).
  const dayOfMonth = now.getUTCDate();
  const persona = getPersonaForDay(dayOfMonth);

  // ─── Vannes ──
  try {
    const pendingJokes = await withDbRetry(
      () =>
        prisma.joke.findMany({
          where: {
            generatedByAI: true,
            isActive: true,
            OR: [{ copyReviewVersion: null }, { copyReviewVersion: { not: version } }],
          },
          select: {
            id: true,
            content: true,
            punchline: true,
            category: true,
            type: true,
            maturityLevel: true,
            comedyTechnique: true,
            techniqueExplanation: true,
            howToApply: true,
            originalContent: true,
            originalPunchline: true,
          },
          orderBy: { createdAt: "asc" },
          take: batchSize,
        }),
      { label: "copy-review:findPendingJokes" },
    );

    for (const joke of pendingJokes) {
      stats.jokesProcessed++;
      try {
        const review: JokeReviewResult = await reviewJoke({
          content: joke.content,
          punchline: joke.punchline,
          category: joke.category,
          type: joke.type,
          comedyTechnique: joke.comedyTechnique,
          techniqueExplanation: joke.techniqueExplanation,
          howToApply: joke.howToApply,
        });

        if (review.verdict === "GARDER") {
          await withDbRetry(
            () =>
              prisma.joke.update({
                where: { id: joke.id },
                data: {
                  copyReviewedAt: new Date(),
                  copyReviewVersion: version,
                  copyVerdict: "GARDER",
                },
              }),
            { label: "copy-review:markKeep-joke" },
          );
          stats.jokesKept++;
          continue;
        }

        if (review.verdict === "RETIRER") {
          await withDbRetry(
            () =>
              prisma.joke.update({
                where: { id: joke.id },
                data: {
                  isActive: false,
                  copyReviewedAt: new Date(),
                  copyReviewVersion: version,
                  copyVerdict: "RETIRER",
                },
              }),
            { label: "copy-review:remove-joke" },
          );
          stats.jokesRemoved++;
          continue;
        }

        // REECRIRE → valider avec le Stand-Up Director avant d'écrire.
        const rw = review.rewritten!;
        const proposal: JokeToValidate = {
          content: rw.content,
          punchline: rw.punchline,
          category: joke.category,
          type: joke.type,
          maturityLevel: joke.maturityLevel,
        };
        const validation = await validateJoke(proposal, persona);
        if (validation.verdict !== "REJECTED" && validation.score >= MIN_DIRECTOR_SCORE) {
          await withDbRetry(
            () =>
              prisma.joke.update({
                where: { id: joke.id },
                data: {
                  content: rw.content,
                  punchline: rw.punchline,
                  comedyTechnique: rw.comedyTechnique,
                  techniqueExplanation: rw.techniqueExplanation,
                  howToApply: rw.howToApply,
                  // Conserver la toute première version : une relecture
                  // ultérieure (COPY_REVIEW_VERSION incrémentée) ne doit pas
                  // écraser l'original par une version déjà réécrite.
                  originalContent: joke.originalContent ?? joke.content,
                  originalPunchline: joke.originalPunchline ?? joke.punchline,
                  copyReviewedAt: new Date(),
                  copyReviewVersion: version,
                  copyVerdict: "REECRIRE",
                },
              }),
            { label: "copy-review:rewrite-joke" },
          );
          stats.jokesRewritten++;
        } else {
          // Réécriture rejetée par le Director → on garde l'original mais on
          // marque la relecture pour ne pas re-tourner en boucle.
          await withDbRetry(
            () =>
              prisma.joke.update({
                where: { id: joke.id },
                data: {
                  copyReviewedAt: new Date(),
                  copyReviewVersion: version,
                  copyVerdict: "GARDER",
                },
              }),
            { label: "copy-review:keep-after-director-reject" },
          );
          stats.jokesGuarded++;
        }
      } catch (err) {
        stats.errors++;
        console.warn(
          `[copy-review] Vanne ${joke.id} — échec (non bloquant) :`,
          err instanceof Error ? err.message : err,
        );
      }
    }
  } catch (err) {
    stats.errors++;
    console.error("[copy-review] pipeline vannes échoué :", err);
  }

  // ─── Conseils ──
  try {
    const pendingTips = await withDbRetry(
      () =>
        prisma.tip.findMany({
          where: {
            generatedByAI: true,
            isActive: true,
            OR: [{ copyReviewVersion: null }, { copyReviewVersion: { not: version } }],
          },
          select: {
            id: true,
            title: true,
            content: true,
            example: true,
            exercise: true,
            category: true,
            difficulty: true,
            originalTitle: true,
            originalContent: true,
          },
          orderBy: { createdAt: "asc" },
          take: batchSize,
        }),
      { label: "copy-review:findPendingTips" },
    );

    for (const tip of pendingTips) {
      stats.tipsProcessed++;
      try {
        const review: TipReviewResult = await reviewTip({
          title: tip.title,
          content: tip.content,
          example: tip.example,
          exercise: tip.exercise,
          category: tip.category,
          difficulty: tip.difficulty,
        });

        if (review.verdict === "GARDER") {
          await withDbRetry(
            () =>
              prisma.tip.update({
                where: { id: tip.id },
                data: {
                  copyReviewedAt: new Date(),
                  copyReviewVersion: version,
                  copyVerdict: "GARDER",
                },
              }),
            { label: "copy-review:markKeep-tip" },
          );
          stats.tipsKept++;
          continue;
        }

        if (review.verdict === "RETIRER") {
          await withDbRetry(
            () =>
              prisma.tip.update({
                where: { id: tip.id },
                data: {
                  isActive: false,
                  copyReviewedAt: new Date(),
                  copyReviewVersion: version,
                  copyVerdict: "RETIRER",
                },
              }),
            { label: "copy-review:remove-tip" },
          );
          stats.tipsRemoved++;
          continue;
        }

        const rw = review.rewritten!;
        const proposal: TipToValidate = {
          title: rw.title,
          content: rw.content,
          category: tip.category,
          difficulty: tip.difficulty,
          example: rw.example,
          exercise: rw.exercise,
        };
        const validation = await validateTip(proposal, persona);
        if (validation.verdict !== "REJECTED" && validation.score >= MIN_DIRECTOR_SCORE) {
          await withDbRetry(
            () =>
              prisma.tip.update({
                where: { id: tip.id },
                data: {
                  title: rw.title,
                  content: rw.content,
                  example: rw.example,
                  exercise: rw.exercise,
                  originalTitle: tip.originalTitle ?? tip.title,
                  originalContent: tip.originalContent ?? tip.content,
                  copyReviewedAt: new Date(),
                  copyReviewVersion: version,
                  copyVerdict: "REECRIRE",
                },
              }),
            { label: "copy-review:rewrite-tip" },
          );
          stats.tipsRewritten++;
        } else {
          await withDbRetry(
            () =>
              prisma.tip.update({
                where: { id: tip.id },
                data: {
                  copyReviewedAt: new Date(),
                  copyReviewVersion: version,
                  copyVerdict: "GARDER",
                },
              }),
            { label: "copy-review:keep-after-director-reject-tip" },
          );
          stats.tipsGuarded++;
        }
      } catch (err) {
        stats.errors++;
        console.warn(
          `[copy-review] Conseil ${tip.id} — échec (non bloquant) :`,
          err instanceof Error ? err.message : err,
        );
      }
    }
  } catch (err) {
    stats.errors++;
    console.error("[copy-review] pipeline conseils échoué :", err);
  }

  console.log(
    `[copy-review] Batch v${version} terminé — vannes : ${stats.jokesKept} gardées / ${stats.jokesRewritten} réécrites / ${stats.jokesRemoved} retirées / ${stats.jokesGuarded} rollback director ; conseils : ${stats.tipsKept} gardés / ${stats.tipsRewritten} réécrits / ${stats.tipsRemoved} retirés / ${stats.tipsGuarded} rollback director ; erreurs ${stats.errors}.`,
  );

  return stats;
}
