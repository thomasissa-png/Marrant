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
import weakJokes from "@/data/weak-jokes.json";
import blogArticleFixes from "@/data/blog-article-fixes.json";
import { DB_LOSER_SLUGS } from "@/lib/seo-redirects";

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
 * Application INSTANTANÉE des décryptages pédagogiques pré-rédigés (265 vannes).
 *
 * Remplace l'ancien back-fill IA progressif (50/jour via Sonnet) : les 265
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
 * Désactivation (soft delete) des vannes faibles flaggées par les rédacteurs.
 *
 * Décision fondateur (s10) : qualité > quantité. 24 vannes faibles (Carambar,
 * clichés usés, chutes prévisibles) sont retirées du catalogue. La liste de
 * référence est `src/data/weak-jokes.json` (24 `content` exacts = les setups),
 * source unique bundlée au runtime.
 *
 * Soft delete : on passe `isActive = false` (JAMAIS de hard delete — le modèle
 * Joke porte des relations favorites/likes/dailyContents dont les FK
 * casseraient). Le catalogue filtre déjà sur `isActive`, donc les vannes
 * disparaissent du front sans perdre l'historique.
 *
 * Garanties :
 *  - Match par `content` : la DB prod utilise des CUID (pas l'id numérique du
 *    seed), donc on cible le texte exact du setup — même clé que
 *    applyJokeDecryptagesTask.
 *  - Idempotent : `WHERE isActive: true` → une fois désactivées, les passes
 *    suivantes ne touchent plus rien (0 update).
 *  - Robuste : `withDbRetry` (cold start Neon) + try/catch global → ne bloque
 *    JAMAIS le boot.
 *  - SANS IA : pure lecture fichier statique + updateMany.
 *
 * Réversibilité : remettre `isActive = true` en DB (ou retirer le content de
 * weak-jokes.json) suffit à réactiver une vanne.
 */
async function deactivateWeakJokesTask(): Promise<void> {
  const contents = weakJokes as string[];

  try {
    const result = await withDbRetry(
      () =>
        prisma.joke.updateMany({
          where: { content: { in: contents }, isActive: true },
          data: { isActive: false },
        }),
      { label: "deactivate-weak-jokes:updateMany" },
    );
    console.log(`[startup] vannes faibles désactivées : ${result.count}`);
  } catch (err) {
    console.error("[startup] deactivateWeakJokes échoué (non bloquant) :", err);
  }
}

/**
 * Corrections idempotentes des articles blog déjà publiés (s11 lot 3).
 *
 * Contexte : l'audit contenus s11 a identifié plusieurs P0/P1 sur les articles
 * en prod : FAQ pillar en vouvoiement (T05), citations mal attribuées à Fary
 * dans citation-drole (T06), témoignages fictifs "Lucas/Marine/Thomas 21/28/35
 * ans" dans ne-plus-rester-muet (T04), staccato IA résiduels "Boom.", "Plot
 * twist :", "STOP." (T07), structure scolaire "Semaine 1 / Jours 1-3" (T09).
 *
 * Approche : remplacements ciblés (search → replace), PAS de réécriture globale.
 * Les corrections sont bundlées dans `src/data/blog-article-fixes.json`
 * (source unique de vérité, versionnée en git).
 *
 * Garanties :
 *  - Idempotent : si la chaîne `search` n'est plus trouvée (déjà corrigée), la
 *    fix est skip. Une passe qui ne modifie rien ne touche pas `updatedAt`.
 *  - Fail-safe : erreur DB → non bloquant (prochain boot rattrape).
 *  - Ciblé : un slug non trouvé en DB est skip silencieusement (article
 *    peut-être statique, migré, ou en cours de migration).
 *  - SANS IA : pure manipulation de chaînes.
 *
 * NOTE : les articles STATIQUES (dans `blog-articles.ts`) ne sont PAS touchés
 * par cette tâche — ils sont corrigés directement en source (commits typiques).
 */
interface BlogArticleFix {
  slug: string;
  operation: "replace" | "replaceAll" | "setField";
  search?: string;
  replace?: string;
  field?: string;
  value?: unknown;
  reason?: string;
}

async function fixPublishedBlogArticlesTask(): Promise<void> {
  const fixes = (blogArticleFixes as { fixes: BlogArticleFix[] }).fixes ?? [];
  if (fixes.length === 0) return;

  // Grouper par slug pour n'ouvrir qu'une seule transaction par article.
  const bySlug = new Map<string, BlogArticleFix[]>();
  for (const fix of fixes) {
    if (!bySlug.has(fix.slug)) bySlug.set(fix.slug, []);
    bySlug.get(fix.slug)!.push(fix);
  }

  let articlesTouched = 0;
  let totalReplacements = 0;

  for (const [slug, slugFixes] of bySlug) {
    try {
      const article = await withDbRetry(
        () =>
          prisma.blogArticle.findUnique({
            where: { slug },
            select: { id: true, content: true },
          }),
        { label: `fix-blog:find:${slug}` },
      );

      if (!article) {
        // Article absent en DB (statique ou pas encore publié) — skip silencieux.
        continue;
      }

      let nextContent = article.content;
      let localReplacements = 0;

      for (const fix of slugFixes) {
        if (fix.operation === "replace" && fix.search && fix.replace !== undefined) {
          if (nextContent.includes(fix.search)) {
            nextContent = nextContent.replace(fix.search, fix.replace);
            localReplacements++;
          }
        } else if (fix.operation === "replaceAll" && fix.search && fix.replace !== undefined) {
          if (nextContent.includes(fix.search)) {
            // Split + join → replaceAll safe (pas de regex, pas d'échappement).
            const parts = nextContent.split(fix.search);
            if (parts.length > 1) {
              nextContent = parts.join(fix.replace);
              localReplacements += parts.length - 1;
            }
          }
        }
      }

      if (localReplacements > 0) {
        await withDbRetry(
          () =>
            prisma.blogArticle.update({
              where: { id: article.id },
              data: { content: nextContent, updatedAt: new Date() },
            }),
          { label: `fix-blog:update:${slug}` },
        );
        articlesTouched++;
        totalReplacements += localReplacements;
      }
    } catch (err) {
      console.error(
        `[startup] fixPublishedBlogArticles échoué pour "${slug}" (non bloquant) :`,
        err,
      );
    }
  }

  if (articlesTouched > 0) {
    console.log(
      `[startup] articles blog corrigés : ${articlesTouched} article(s), ${totalReplacements} remplacement(s).`,
    );
  }
}

/**
 * Dépublication idempotente des articles blog perdants de la cannibalisation s11.
 *
 * Contexte : l'audit SEO s11 (§3.3) a identifié 8 paires d'articles indexés en
 * doublon. Pour 3 de ces paires, la version DB est la perdante — on la passe
 * en `isPublished: false` (soft delete). Le lecteur qui tape l'URL est
 * 301-redirigé vers la version gardée via `next.config.js`.
 *
 * Les 5 autres paires ont un slug statique perdant (fichier `blog-articles.ts`)
 * — filtrés à la lecture dans `sitemap.ts` et `blog/page.tsx` via
 * `UNPUBLISHED_STATIC_SLUGS`. Aucune action DB nécessaire.
 *
 * Idempotent : `WHERE isPublished: true` → une fois dépubliés, les passes
 * suivantes ne touchent plus rien.
 */
async function depublishCannibalizedDbArticlesTask(): Promise<void> {
  if (DB_LOSER_SLUGS.length === 0) return;
  try {
    const result = await withDbRetry(
      () =>
        prisma.blogArticle.updateMany({
          where: {
            slug: { in: Array.from(DB_LOSER_SLUGS) },
            isPublished: true,
          },
          data: { isPublished: false, updatedAt: new Date() },
        }),
      { label: "depublish-cannibalized:updateMany" },
    );
    if (result.count > 0) {
      console.log(
        `[startup] articles cannibalisés dépubliés : ${result.count} (redirect 301 via next.config).`,
      );
    }
  } catch (err) {
    console.error(
      "[startup] depublishCannibalizedDbArticles échoué (non bloquant) :",
      err,
    );
  }
}

/**
 * Extension du back-fill décryptage : couvre TOUT le stock actif sans décryptage,
 * pas seulement les vannes du seed pré-rédigé.
 *
 * Contexte s11 : des vannes anciennes générées par l'IA (ex. la vanne du jour
 * du 29/09 créée le 26/03) sont restées `comedyTechnique IS NULL` parce
 * qu'elles ne matchent aucune entrée du fichier `joke-decryptages.json`. Le
 * front affiche alors "Décryptage à venir" — expérience dégradée.
 *
 * Cette tâche complète `applyJokeDecryptagesTask` : elle génère le décryptage
 * via l'IA pour les vannes restantes, en LOT BORNÉ pour maîtriser le coût
 * (par défaut 15 vannes par boot). Idempotence : on ne cible QUE les vannes
 * `comedyTechnique: null` ET `isActive: true` (pas de re-génération).
 *
 * Feature-flag : désactivé si `SKIP_JOKE_DECRYPTAGE_AI_BACKFILL=1` (utile en
 * CI/dev, ou pour couper les appels IA en cas de dépassement budget).
 *
 * Fail-safe : chaque erreur (échec agent, timeout Anthropic) est loggée mais
 * ne bloque pas les autres vannes ni le boot.
 */
const AI_BACKFILL_BATCH_SIZE = Number.parseInt(
  process.env.JOKE_DECRYPTAGE_AI_BACKFILL_BATCH ?? "15",
  10,
);

async function backfillMissingJokeDecryptagesTask(): Promise<void> {
  if (process.env.SKIP_JOKE_DECRYPTAGE_AI_BACKFILL === "1") {
    console.log("[startup] backfill IA décryptages désactivé (env flag).");
    return;
  }
  const batch = Number.isFinite(AI_BACKFILL_BATCH_SIZE) && AI_BACKFILL_BATCH_SIZE > 0
    ? AI_BACKFILL_BATCH_SIZE
    : 15;

  try {
    // Ne cible QUE le stock actif — pas les vannes soft-deleted.
    const pending = await withDbRetry(
      () =>
        prisma.joke.findMany({
          where: { comedyTechnique: null, isActive: true },
          select: { id: true, content: true, punchline: true, category: true, type: true },
          orderBy: { createdAt: "asc" },
          take: batch,
        }),
      { label: "backfill-ai:findPending" },
    );

    if (pending.length === 0) return;

    // Import dynamique : évite de charger l'agent IA (et sa dep Anthropic)
    // pour les boots où il n'y a rien à faire.
    const { generateJokeDecryptage } = await import(
      "@/lib/ai/agents/joke-agent"
    );

    let applied = 0;
    let failed = 0;

    for (const joke of pending) {
      try {
        const decryptage = await generateJokeDecryptage({
          content: joke.content,
          punchline: joke.punchline,
          category: joke.category,
          type: joke.type,
        });
        await withDbRetry(
          () =>
            prisma.joke.update({
              where: { id: joke.id },
              data: {
                comedyTechnique: decryptage.comedyTechnique,
                techniqueExplanation: decryptage.techniqueExplanation,
                howToApply: decryptage.howToApply,
              },
            }),
          { label: "backfill-ai:update" },
        );
        applied++;
      } catch (err) {
        failed++;
        console.warn(
          `[startup] backfill IA décryptage : échec pour joke ${joke.id} (non bloquant) :`,
          err instanceof Error ? err.message : err,
        );
      }
    }

    console.log(
      `[startup] backfill IA décryptages : ${applied}/${pending.length} appliqués${failed > 0 ? ` (${failed} échec)` : ""}.`,
    );
  } catch (err) {
    console.error("[startup] backfillMissingJokeDecryptages échoué (non bloquant) :", err);
  }
}

/**
 * Convergence DB des renommages de slug BlogArticle.
 *
 * Pourquoi ici et pas en migration SQL : les redirections vivent dans
 * `src/lib/seo-redirects.data.cjs` (source unique consommée par
 * next.config.js redirects()). Toute nouvelle redirection /blog/X → /blog/Y
 * doit renommer l'entrée DB correspondante sans bloquer le boot si la DB
 * est froide.
 *
 * Idempotent :
 *  - Si l'article `source` existe et pas la `destination` → renomme (slug).
 *  - Si les deux existent → laisse `destination` intact, désactive `source`
 *    (`isPublished: false`). La 301 prend alors le relais côté HTTP.
 *  - Si aucun n'existe → skip silencieux.
 *  - Fail-safe : chaque erreur est loguée mais ne casse pas le boot.
 *
 * SANS IA : pure logique DB + fichier statique.
 */
async function convergeBlogSlugRedirectsTask(): Promise<void> {
  // Import différé pour éviter le coût des redirects en test unitaire pur.
  const { SEO_REDIRECTS } = await import("@/lib/seo-redirects");

  // Uniquement les vrais renommages : une redirection de fusion/cannibalisation
  // vers un article statique renommerait sinon le perdant en base avec le slug
  // du gagnant (collision de slugs).
  const blogRedirects = SEO_REDIRECTS.filter(
    (r) =>
      r.kind === "rename" &&
      r.source.startsWith("/blog/") &&
      r.destination.startsWith("/blog/"),
  );

  let renamed = 0;
  let deactivated = 0;

  for (const redirect of blogRedirects) {
    const sourceSlug = redirect.source.replace(/^\/blog\//, "");
    const destinationSlug = redirect.destination.replace(/^\/blog\//, "");
    if (sourceSlug === destinationSlug) continue;

    try {
      const [sourceArticle, destinationArticle] = await Promise.all([
        withDbRetry(
          () => prisma.blogArticle.findUnique({ where: { slug: sourceSlug } }),
          { label: `blog-slug-converge:find(${sourceSlug})` },
        ),
        withDbRetry(
          () =>
            prisma.blogArticle.findUnique({
              where: { slug: destinationSlug },
            }),
          { label: `blog-slug-converge:find(${destinationSlug})` },
        ),
      ]);

      if (!sourceArticle) continue;

      if (destinationArticle) {
        if (sourceArticle.isPublished) {
          await withDbRetry(
            () =>
              prisma.blogArticle.update({
                where: { slug: sourceSlug },
                data: { isPublished: false },
              }),
            { label: `blog-slug-converge:deactivate(${sourceSlug})` },
          );
          deactivated += 1;
        }
        continue;
      }

      await withDbRetry(
        () =>
          prisma.blogArticle.update({
            where: { slug: sourceSlug },
            data: { slug: destinationSlug },
          }),
        { label: `blog-slug-converge:rename(${sourceSlug})` },
      );
      renamed += 1;
    } catch (err) {
      console.error(
        `[startup] convergeBlogSlug ${sourceSlug} → ${destinationSlug} échoué (non bloquant) :`,
        err,
      );
    }
  }

  if (renamed > 0 || deactivated > 0) {
    console.log(
      `[startup] slugs blog convergés : ${renamed} renommés, ${deactivated} désactivés.`,
    );
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
  await deactivateWeakJokesTask();
  await fixPublishedBlogArticlesTask();
  await depublishCannibalizedDbArticlesTask();
  await backfillMissingJokeDecryptagesTask();
  await convergeBlogSlugRedirectsTask();
}

// Export nommé pour les tests unitaires (sans passer par runStartupTasks).
export {
  applyJokeDecryptagesTask,
  deactivateWeakJokesTask,
  fixPublishedBlogArticlesTask,
  depublishCannibalizedDbArticlesTask,
  backfillMissingJokeDecryptagesTask,
  convergeBlogSlugRedirectsTask,
};
