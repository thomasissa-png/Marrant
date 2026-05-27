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
import { withDbRetry } from "@/lib/db-retry";
import jokeDecryptages from "@/data/joke-decryptages.json";

/** Une entrée de décryptage pré-rédigé, matchée sur le `content` de la vanne. */
interface JokeDecryptageEntry {
  content: string;
  comedyTechnique: string;
  techniqueExplanation: string;
  howToApply: string;
}

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
 * Application INSTANTANÉE des décryptages pédagogiques pré-rédigés (289 vannes).
 *
 * Remplace l'ancien back-fill IA progressif (50/jour via Sonnet) : les 289
 * décryptages du catalogue sont rédigés à la main et bundlés dans
 * `src/data/joke-decryptages.json` (indexé par `content`). Au boot, on les
 * applique en UNE passe, SANS aucun appel LLM ni coût.
 *
 * Objectif fondateur : "quand je déploie, le catalogue est décrypté
 * intégralement et instantanément".
 *
 * Garanties :
 *  - SANS IA : pure lecture fichier statique + update DB.
 *  - Idempotent : on ne cible QUE les vannes `comedyTechnique IS NULL`. Une fois
 *    appliquées, les passes suivantes ne touchent plus rien (0 update).
 *  - Robuste : `withDbRetry` sur chaque requête (cold start Neon) + try/catch
 *    global → ne bloque JAMAIS le boot.
 *  - Match par `content` : la DB utilise des CUID (pas l'id numérique du seed),
 *    donc le décryptage est joint sur le texte exact de la vanne.
 *  - Batch de 50 updates pour ménager Neon (free tier).
 *
 * Note : les NOUVELLES vannes quotidiennes (generateDailyJoke) reçoivent leur
 * décryptage via l'IA à la génération — cette tâche ne concerne QUE le catalogue
 * pré-rédigé existant.
 */
async function applyJokeDecryptagesTask(): Promise<void> {
  const entries = jokeDecryptages as JokeDecryptageEntry[];
  const total = entries.length;

  try {
    // Index par content pour un match O(1) (le content est unique par vanne seed).
    const byContent = new Map(entries.map((e) => [e.content, e]));

    // On ne lit QUE les vannes non décryptées (idempotence + charge minimale).
    const pending = await withDbRetry(
      () =>
        prisma.joke.findMany({
          where: { comedyTechnique: null },
          select: { id: true, content: true },
        }),
      { label: "apply-decryptages:findPending" },
    );

    let applied = 0;
    let skippedNoMatch = 0;
    const BATCH = 50;

    for (let i = 0; i < pending.length; i += BATCH) {
      const slice = pending.slice(i, i + BATCH);
      await Promise.all(
        slice.map(async (joke) => {
          const entry = byContent.get(joke.content);
          if (!entry) {
            // Vanne absente du fichier (ex. ancienne vanne IA sans décryptage).
            // On laisse null — sans crash. Le décryptage IA reste possible ailleurs.
            skippedNoMatch++;
            return;
          }
          await withDbRetry(
            () =>
              prisma.joke.update({
                where: { id: joke.id },
                data: {
                  comedyTechnique: entry.comedyTechnique,
                  techniqueExplanation: entry.techniqueExplanation,
                  howToApply: entry.howToApply,
                },
              }),
            { label: "apply-decryptages:update" },
          );
          applied++;
        }),
      );
    }

    const skipNote = skippedNoMatch > 0 ? ` (${skippedNoMatch} sans match fichier)` : "";
    console.log(`[startup] décryptages appliqués : ${applied}/${total}${skipNote}.`);
  } catch (err) {
    console.error("[startup] applyJokeDecryptages échoué (non bloquant) :", err);
  }
}

/**
 * Exécute toutes les tâches de démarrage séquentiellement.
 * Appelée une seule fois depuis `register()` (au boot, avant le scheduler).
 */
export async function runStartupTasks(): Promise<void> {
  await ensureCeoConfigTask();
  await cleanupWildcardSocialPostsTask();
  await applyJokeDecryptagesTask();
}

// Export nommé pour les tests unitaires (sans passer par runStartupTasks).
export { applyJokeDecryptagesTask };
