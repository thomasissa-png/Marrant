/**
 * Tâches de démarrage idempotentes — exécutées UNE fois au boot du serveur
 * (depuis `instrumentation.ts register()`), AVANT le scheduler récurrent.
 *
 * Objectif "deploy auto-suffisant" : ce qui ne peut pas passer par le build
 * Replit (`prisma db push` synchronise le SCHÉMA mais ne joue pas les
 * migrations de DONNÉES, et `prisma db seed` est bloqué en production) est
 * rattrapé ici, de façon idempotente et fail-safe.
 *
 * RÈGLES :
 *  - Chaque tâche est idempotente (relançable à chaque boot sans effet de bord).
 *  - Chaque tâche est fail-safe : une erreur (ex. DB froide Neon) est loggée
 *    mais NE bloque PAS le démarrage du serveur ni les autres tâches.
 *  - Aucune tâche ne déclenche d'appel LLM ni de coût (pure DB).
 */
import { prisma } from "@/lib/prisma";

/**
 * Auto-seed du singleton CeoConfig avec des défauts FAIL-SAFE.
 * Délègue à `ensureCeoConfig` (idempotent, gère la race condition 2 workers).
 * Garantit qu'après un deploy, le CEO démarre DÉSACTIVÉ et SÛR, sans aucune
 * insertion SQL manuelle.
 */
async function ensureCeoConfigTask(): Promise<void> {
  try {
    const { ensureCeoConfig } = await import("@/lib/ai/ceo-helpers");
    const cfg = await ensureCeoConfig();
    console.log(
      `[startup] CeoConfig OK (enabled=${cfg.enabled}, dryRun=${cfg.dryRun}).`,
    );
  } catch (err) {
    console.error("[startup] ensureCeoConfig échoué (non bloquant) :", err);
  }
}

/**
 * Cleanup des SocialPost au format obsolète WILD_CARD (retiré de l'enum en s8).
 *
 * Pourquoi ici et pas uniquement en migration SQL : le deploy Replit applique
 * le schéma via `prisma db push` (pas `prisma migrate deploy`), donc la
 * migration de DONNÉES `8_cleanup_wildcard_socialpost` ne serait pas jouée
 * automatiquement. On la rejoue ici, idempotente.
 *
 * Idempotent : le `WHERE` ne matche plus rien une fois les lignes en REJECTED.
 * `format::text` (raw SQL) évite l'erreur "invalid input value for enum" car
 * WILD_CARD n'est plus un label valide de SocialFormat.
 */
async function cleanupWildcardSocialPostsTask(): Promise<void> {
  try {
    const affected = await prisma.$executeRawUnsafe(
      `UPDATE "SocialPost" SET "status" = 'REJECTED' WHERE "format"::text = 'WILD_CARD' AND "status" <> 'REJECTED'`,
    );
    if (affected > 0) {
      console.log(`[startup] Cleanup WILD_CARD : ${affected} post(s) passé(s) en REJECTED.`);
    }
  } catch (err) {
    // Si l'enum ne contient pas/plus WILD_CARD, le cast ::text le gère. Toute
    // autre erreur (DB froide) est non bloquante — le prochain boot rattrapera.
    console.error("[startup] cleanupWildcardSocialPosts échoué (non bloquant) :", err);
  }
}

/**
 * Exécute toutes les tâches de démarrage séquentiellement.
 * Appelée une seule fois depuis `register()` (au boot, avant le scheduler).
 */
export async function runStartupTasks(): Promise<void> {
  await ensureCeoConfigTask();
  await cleanupWildcardSocialPostsTask();
}
