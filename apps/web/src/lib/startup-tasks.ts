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
 *  - Aucune tâche ne déclenche d'appel LLM (pure DB), SAUF
 *    `backfillMissingJokeDecryptagesTask` (lot borné, coupable via
 *    `SKIP_JOKE_DECRYPTAGE_AI_BACKFILL=1`).
 */
import { prisma } from "@/lib/prisma";
import { withDbRetry } from "@/lib/db-retry";
import jokeDecryptages from "@/data/joke-decryptages.json";
import weakJokes from "@/data/weak-jokes.json";
import blogArticleFixes from "@/data/blog-article-fixes.json";
import blogArticleRewrites from "@/data/blog-article-rewrites.json";
import { DB_LOSER_SLUGS } from "@/lib/seo-redirects";
import { stripEmDashesWithStats } from "@/lib/em-dash";
import { applyParcoursContentTask } from "@/lib/parcours-content-sync";
// Seeds du catalogue (source de vérité de la refonte copy s11) — même procédé
// d'import relatif que `components/parcours/parcours-content.tsx`.
import blaguesSeed from "../../../../docs/content/blagues-seed.json";
import conseilsSeed from "../../../../docs/content/conseils-seed.json";
import videosSeed from "../../../../docs/content/videos-seed.json";
import parcoursSeed from "../../../../docs/content/parcours-seed.json";

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

    // Deux passes distinctes :
    //  1. NULL → back-fill (identique historique) sur TOUTES les vannes.
    //  2. Vannes seed (generatedByAI=false) : override le décryptage si le
    //     fichier de référence diffère de la DB — le fichier fait AUTORITÉ
    //     pour le catalogue seed (audit s11 : décryptages retravaillés).
    //     Ne JAMAIS toucher aux vannes generatedByAI=true (leur décryptage
    //     est propre à leur version IA).
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

    // Passe autoritaire : override sur les vannes SEED uniquement, si le
    // décryptage stocké diffère du fichier (source de vérité pour le catalogue).
    let overridden = 0;
    const seedJokes = await withDbRetry(
      () =>
        prisma.joke.findMany({
          where: { generatedByAI: false, comedyTechnique: { not: null } },
          select: {
            id: true,
            content: true,
            comedyTechnique: true,
            techniqueExplanation: true,
            howToApply: true,
          },
        }),
      { label: "apply-decryptages:findSeed" },
    );

    for (let i = 0; i < seedJokes.length; i += BATCH) {
      const slice = seedJokes.slice(i, i + BATCH);
      await Promise.all(
        slice.map(async (joke) => {
          const entry = byContent.get(joke.content);
          if (!entry) return;
          const differs =
            entry.comedyTechnique !== joke.comedyTechnique ||
            entry.techniqueExplanation !== joke.techniqueExplanation ||
            entry.howToApply !== joke.howToApply;
          if (!differs) return;
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
            { label: "apply-decryptages:override" },
          );
          overridden++;
        }),
      );
    }

    const skipNote = skippedNoMatch > 0 ? ` (${skippedNoMatch} sans match fichier)` : "";
    const overrideNote = overridden > 0 ? `, ${overridden} seed override` : "";
    console.log(`[startup] décryptages appliqués : ${applied}/${total}${skipNote}${overrideNote}.`);
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
 * Applique les réécritures d'articles de blog (s11 charte refonte copy).
 *
 * Contexte : la charte s11 impose une réécriture globale des articles publiés.
 * Un autre agent produit les nouvelles versions dans
 * `src/data/blog-article-rewrites.json` (format : `{ _meta: { version }, rewrites: [...] }`).
 * Cette tâche applique chaque réécriture UNE SEULE FOIS par (slug, version) via
 * un marqueur persistant `DataPatch` (patchId "blog-rewrite:v<version>:<slug>").
 *
 * Format d'une entrée :
 *   {
 *     "slug": "comment-devenir-drole",
 *     "title": "…",            // optionnel
 *     "excerpt": "…",          // optionnel
 *     "metaTitle": "…",        // optionnel
 *     "metaDescription": "…",  // optionnel
 *     "content": "…"           // optionnel (Markdown)
 *   }
 *
 * Garanties :
 *  - Idempotent : DataPatch.patchId unique → 2e boot skip (0 update).
 *  - Ciblé : ne touche que les articles PUBLIÉS existants (skip silencieux sinon).
 *  - Fail-safe : erreur DB par slug → non bloquant (les autres slugs continuent).
 *  - SANS IA : pure copie de champs depuis JSON → DB.
 *  - Réversibilité : supprimer la ligne DataPatch correspondante rejoue le rewrite
 *    au prochain boot. Bumper `_meta.version` force la réapplication de TOUT le
 *    fichier (nouveau patchId → aucun marqueur existant).
 */
interface BlogArticleRewriteEntry {
  slug: string;
  title?: string;
  excerpt?: string;
  metaTitle?: string;
  metaDescription?: string;
  content?: string;
}

interface BlogArticleRewritesFile {
  _meta?: { version?: number };
  rewrites?: BlogArticleRewriteEntry[];
}

async function applyBlogArticleRewritesTask(): Promise<void> {
  const file = blogArticleRewrites as BlogArticleRewritesFile;
  const version = file._meta?.version ?? 1;
  const rewrites = file.rewrites ?? [];
  if (rewrites.length === 0) return;

  let applied = 0;
  let skipped = 0;
  let missing = 0;

  for (const entry of rewrites) {
    if (!entry.slug || typeof entry.slug !== "string") continue;
    const patchId = `blog-rewrite:v${version}:${entry.slug}`;

    try {
      // Marqueur idempotence : si déjà appliqué pour cette version, skip.
      const existing = await withDbRetry(
        () => prisma.dataPatch.findUnique({ where: { patchId } }),
        { label: `blog-rewrite:check(${entry.slug})` },
      );
      if (existing) {
        skipped++;
        continue;
      }

      const article = await withDbRetry(
        () =>
          prisma.blogArticle.findUnique({
            where: { slug: entry.slug },
            select: { id: true, isPublished: true },
          }),
        { label: `blog-rewrite:find(${entry.slug})` },
      );

      if (!article || !article.isPublished) {
        // Article absent ou non publié → skip silencieux, ne pas marquer patché
        // (permet une réapplication automatique si l'article est publié plus tard).
        missing++;
        continue;
      }

      const update: {
        title?: string;
        excerpt?: string;
        metaTitle?: string;
        metaDescription?: string;
        content?: string;
        updatedAt: Date;
      } = { updatedAt: new Date() };
      if (typeof entry.title === "string" && entry.title.trim()) update.title = entry.title;
      if (typeof entry.excerpt === "string" && entry.excerpt.trim()) update.excerpt = entry.excerpt;
      if (typeof entry.metaTitle === "string" && entry.metaTitle.trim()) update.metaTitle = entry.metaTitle;
      if (typeof entry.metaDescription === "string" && entry.metaDescription.trim()) update.metaDescription = entry.metaDescription;
      if (typeof entry.content === "string" && entry.content.trim()) update.content = entry.content;

      // Si l'entrée n'apporte AUCUN champ utile → ne pas toucher l'article ni
      // consommer un marqueur (défensif contre les entrées mal formées).
      if (Object.keys(update).length === 1) {
        continue;
      }

      await withDbRetry(
        () =>
          prisma.$transaction([
            prisma.blogArticle.update({
              where: { id: article.id },
              data: update,
            }),
            prisma.dataPatch.create({
              data: { patchId, note: `blog-rewrite v${version} slug=${entry.slug}` },
            }),
          ]),
        { label: `blog-rewrite:apply(${entry.slug})` },
      );
      applied++;
    } catch (err) {
      console.error(
        `[startup] applyBlogArticleRewrites échoué pour "${entry.slug}" (non bloquant) :`,
        err,
      );
    }
  }

  if (applied > 0 || skipped > 0 || missing > 0) {
    console.log(
      `[startup] réécritures blog v${version} : ${applied} appliquée(s), ${skipped} déjà patchée(s), ${missing} article(s) introuvable(s).`,
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
 * Réécrit, dans les articles de blog publiés en base, les liens internes qui
 * pointent vers une URL redirigée (fusion, cannibalisation, renommage) pour
 * qu'ils visent directement la destination finale : pas de saut de redirection
 * pour les lecteurs ni pour les moteurs (budget de crawl, PageRank).
 *
 * Couvre les liens relatifs `/blog/x` et absolus `https://deviens-marrant.fr/blog/x`,
 * uniquement quand le slug est suivi d'une fin de lien (`)`, `"`, `#`, `?`, espace
 * ou fin de chaîne) — `/blog/x-suite` n'est jamais touché. Idempotent : une fois
 * réécrit, le lien ne matche plus aucune source.
 */
async function rewriteRedirectedBlogLinksTask(): Promise<void> {
  const { SEO_REDIRECTS } = await import("@/lib/seo-redirects");
  const blogRedirects = SEO_REDIRECTS.filter(
    (r) => r.source.startsWith("/blog/") && r.destination.startsWith("/blog/"),
  );
  if (blogRedirects.length === 0) return;

  const escape = (v: string) => v.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const rules = blogRedirects.map((r) => ({
    pattern: new RegExp(
      `((?:https://deviens-marrant\\.fr)?)${escape(r.source)}(?=[)"'#?\\s]|$)`,
      "g",
    ),
    destination: r.destination,
  }));

  try {
    const articles = await withDbRetry(
      () =>
        prisma.blogArticle.findMany({
          where: {
            isPublished: true,
            OR: blogRedirects.map((r) => ({ content: { contains: r.source } })),
          },
          select: { id: true, slug: true, content: true },
        }),
      { label: "rewrite-blog-links:findMany" },
    );

    let touched = 0;
    for (const article of articles) {
      let content = article.content;
      for (const rule of rules) {
        content = content.replace(rule.pattern, `$1${rule.destination}`);
      }
      if (content === article.content) continue;
      await withDbRetry(
        () =>
          prisma.blogArticle.update({
            where: { id: article.id },
            data: { content, updatedAt: new Date() },
          }),
        { label: `rewrite-blog-links:update(${article.slug})` },
      );
      touched += 1;
    }
    if (touched > 0) {
      console.log(`[startup] liens internes vers URLs redirigées réécrits : ${touched} article(s).`);
    }
  } catch (err) {
    console.error("[startup] rewriteRedirectedBlogLinks échoué (non bloquant) :", err);
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
  // [CHOIX UTILISATEUR] Thomas 01/10 (s14) : aucune IA ne produit seule.
  // Interrupteur CONTENT_GENERATION_ENABLED ≠ "true" (défaut) → aucun décryptage
  // généré en base ; les décryptages manquants passent par un fichier préparé et relu.
  const { isContentGenerationEnabled } = await import("@/lib/scheduler/prepared-content");
  if (!isContentGenerationEnabled()) {
    console.log("[startup] backfill IA décryptages coupé (CONTENT_GENERATION_ENABLED ≠ true).");
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

/*
 * Application au boot de la refonte de contenu du catalogue (s11, passe 2).
 * (Documentation de `applyCatalogueContentTask`, en fin de bloc.)
 *
 * Pourquoi au boot : toute la refonte vit dans les fichiers de seed
 * (`docs/content/*-seed.json` + `src/data/joke-decryptages.json`), or
 * `prisma/seed-data.ts` s'arrête en `NODE_ENV=production` (cas du build Replit,
 * documenté s10). On NE lève PAS ce garde-fou : le seed recrée les étapes des
 * parcours et désactive des contenus (risque pour la progression et les
 * favoris des membres). Cette tâche n'applique donc QUE des textes :
 *  - Vannes (`generatedByAI: false` uniquement) : match par `content` = nouveau
 *    texte OU l'un des `previousContent` → `content`, `punchline` + décryptage
 *    (`joke-decryptages.json`, indexé par le NOUVEAU content). Si le nouveau
 *    texte existe déjà en base, l'alias n'est PAS renommé (pas de doublon).
 *  - Conseils (`generatedByAI: false`) : match par `title` OU `previousTitle`
 *    → `content`, `example`, `exercise` (+ `title` si match par alias).
 *  - Vidéos : match par `youtubeId` → `description`, `technique`, `learnings`,
 *    `exercise`. Les vidéos absentes du seed ne sont pas touchées.
 *  - Parcours : match par `slug` → `description` seulement (titres et étapes
 *    intacts).
 *
 * Garanties : jamais de création, suppression ni (dés)activation ; update
 * seulement si le texte diffère ; lots de 50 ; `withDbRetry` + try/catch par
 * section → ne bloque JAMAIS le boot. Marqueur `DataPatch`
 * `catalogue-content:v<version>` écrit APRÈS succès complet des 4 sections
 * (échec partiel → pas de marqueur → le boot suivant réessaie, sans risque
 * puisque tout est idempotent).
 */
/**
 * Version du patch catalogue. BUMP MANUEL (1 → 2…) après toute nouvelle
 * réécriture des fichiers de seed : nouveau patchId → la tâche se rejoue une
 * fois au boot suivant. Supprimer la ligne `DataPatch` a le même effet.
 */
const CATALOGUE_CONTENT_PATCH_VERSION = 1;
const CATALOGUE_CONTENT_PATCH_ID = `catalogue-content:v${CATALOGUE_CONTENT_PATCH_VERSION}`;
const CATALOGUE_PATCH_BATCH = 50;

interface CatalogueJokeSeed {
  content: string;
  punchline: string;
  previousContent?: string | string[];
}
interface CatalogueTipSeed {
  title: string;
  content: string;
  example: string;
  exercise: string;
  previousTitle?: string | string[];
}
interface CatalogueVideoSeed {
  youtubeId: string;
  description: string;
  technique: string;
  learnings?: string[];
  exercise?: string | null;
}
interface CatalogueParcoursSeed {
  slug: string;
  description: string;
}

interface CataloguePatchOp<T> {
  id: string;
  data: T;
  renamed: boolean;
}

interface CatalogueSectionResult {
  updated: number;
  renamed: number;
  unchanged: number;
  missing: number;
  aliasSkipped: number;
}

function toAliasList(value: string | string[] | undefined): string[] {
  if (!value) return [];
  return (Array.isArray(value) ? value : [value]).filter(
    (a) => typeof a === "string" && a.length > 0,
  );
}

async function runCatalogueOps<T>(
  ops: CataloguePatchOp<T>[],
  apply: (op: CataloguePatchOp<T>) => Promise<unknown>,
  label: string,
): Promise<void> {
  for (let i = 0; i < ops.length; i += CATALOGUE_PATCH_BATCH) {
    const slice = ops.slice(i, i + CATALOGUE_PATCH_BATCH);
    await Promise.all(slice.map((op) => withDbRetry(() => apply(op), { label })));
  }
}

function emptyCatalogueResult(): CatalogueSectionResult {
  return { updated: 0, renamed: 0, unchanged: 0, missing: 0, aliasSkipped: 0 };
}

/**
 * Choisit les lignes cibles d'une entrée seed : d'abord celles dont la clé vaut
 * déjà le nouveau texte ; sinon la 1re ligne libre portant un alias (renommage).
 * Une ligne n'est revendiquée qu'une fois (`claimed`) ; un alias égal à une clé
 * du seed n'est jamais utilisé (il appartient à une autre entrée).
 */
function pickCatalogueTargets<R extends { id: string }>(
  key: string,
  aliases: string[],
  byKey: Map<string, R[]>,
  seedKeys: Set<string>,
  claimed: Set<string>,
  result: CatalogueSectionResult,
): { rows: R[]; renamed: boolean } {
  const free = (k: string) => (byKey.get(k) ?? []).filter((r) => !claimed.has(r.id));
  const direct = free(key);
  const usableAliases = aliases.filter((a) => a !== key && !seedKeys.has(a));
  if (direct.length > 0) {
    if (usableAliases.some((a) => free(a).length > 0)) result.aliasSkipped++;
    return { rows: direct, renamed: false };
  }
  for (const alias of usableAliases) {
    const candidate = free(alias)[0];
    if (candidate) return { rows: [candidate], renamed: true };
  }
  return { rows: [], renamed: false };
}

function groupByKey<R>(rows: R[], key: (r: R) => string): Map<string, R[]> {
  const map = new Map<string, R[]>();
  for (const row of rows) {
    const k = key(row);
    const list = map.get(k);
    if (list) list.push(row);
    else map.set(k, [row]);
  }
  return map;
}

interface CatalogueJokeData {
  content?: string;
  punchline?: string;
  comedyTechnique?: string;
  techniqueExplanation?: string;
  howToApply?: string;
}

async function patchCatalogueJokes(): Promise<CatalogueSectionResult> {
  const result = emptyCatalogueResult();
  const seed = (blaguesSeed as CatalogueJokeSeed[]).filter(
    (j) => typeof j.content === "string" && j.content.length > 0,
  );
  const decByContent = new Map(
    (jokeDecryptages as JokeDecryptageEntry[]).map((d) => [d.content, d]),
  );
  const rows = await withDbRetry(
    () =>
      prisma.joke.findMany({
        where: { generatedByAI: false },
        select: {
          id: true,
          content: true,
          punchline: true,
          comedyTechnique: true,
          techniqueExplanation: true,
          howToApply: true,
        },
      }),
    { label: "catalogue-content:jokes:findMany" },
  );
  const byContent = groupByKey(rows, (r) => r.content);
  const seedKeys = new Set(seed.map((j) => j.content));
  const claimed = new Set<string>();
  const ops: CataloguePatchOp<CatalogueJokeData>[] = [];

  for (const joke of seed) {
    const { rows: targets, renamed } = pickCatalogueTargets(
      joke.content,
      toAliasList(joke.previousContent),
      byContent,
      seedKeys,
      claimed,
      result,
    );
    if (targets.length === 0) {
      result.missing++;
      continue;
    }
    const dec = decByContent.get(joke.content);
    for (const row of targets) {
      claimed.add(row.id);
      const data: CatalogueJokeData = {};
      if (row.content !== joke.content) data.content = joke.content;
      if (typeof joke.punchline === "string" && row.punchline !== joke.punchline) {
        data.punchline = joke.punchline;
      }
      if (dec) {
        if (row.comedyTechnique !== dec.comedyTechnique) data.comedyTechnique = dec.comedyTechnique;
        if (row.techniqueExplanation !== dec.techniqueExplanation) {
          data.techniqueExplanation = dec.techniqueExplanation;
        }
        if (row.howToApply !== dec.howToApply) data.howToApply = dec.howToApply;
      }
      if (Object.keys(data).length === 0) {
        result.unchanged++;
        continue;
      }
      ops.push({ id: row.id, data, renamed });
    }
  }

  await runCatalogueOps(
    ops,
    (op) => prisma.joke.update({ where: { id: op.id }, data: op.data }),
    "catalogue-content:jokes:update",
  );
  result.updated = ops.length;
  result.renamed = ops.filter((op) => op.renamed).length;
  return result;
}

interface CatalogueTipData {
  title?: string;
  content?: string;
  example?: string;
  exercise?: string;
}

async function patchCatalogueTips(): Promise<CatalogueSectionResult> {
  const result = emptyCatalogueResult();
  const seed = (conseilsSeed as CatalogueTipSeed[]).filter(
    (t) => typeof t.title === "string" && t.title.length > 0,
  );
  const rows = await withDbRetry(
    () =>
      prisma.tip.findMany({
        where: { generatedByAI: false },
        select: { id: true, title: true, content: true, example: true, exercise: true },
      }),
    { label: "catalogue-content:tips:findMany" },
  );
  const byTitle = groupByKey(rows, (r) => r.title);
  const seedKeys = new Set(seed.map((t) => t.title));
  const claimed = new Set<string>();
  const ops: CataloguePatchOp<CatalogueTipData>[] = [];

  for (const tip of seed) {
    const { rows: targets, renamed } = pickCatalogueTargets(
      tip.title,
      toAliasList(tip.previousTitle),
      byTitle,
      seedKeys,
      claimed,
      result,
    );
    if (targets.length === 0) {
      result.missing++;
      continue;
    }
    for (const row of targets) {
      claimed.add(row.id);
      const data: CatalogueTipData = {};
      if (row.title !== tip.title) data.title = tip.title;
      if (typeof tip.content === "string" && row.content !== tip.content) data.content = tip.content;
      if (typeof tip.example === "string" && row.example !== tip.example) data.example = tip.example;
      if (typeof tip.exercise === "string" && row.exercise !== tip.exercise) {
        data.exercise = tip.exercise;
      }
      if (Object.keys(data).length === 0) {
        result.unchanged++;
        continue;
      }
      ops.push({ id: row.id, data, renamed });
    }
  }

  await runCatalogueOps(
    ops,
    (op) => prisma.tip.update({ where: { id: op.id }, data: op.data }),
    "catalogue-content:tips:update",
  );
  result.updated = ops.length;
  result.renamed = ops.filter((op) => op.renamed).length;
  return result;
}

interface CatalogueVideoData {
  description?: string;
  technique?: string;
  learnings?: string[];
  exercise?: string;
}

async function patchCatalogueVideos(): Promise<CatalogueSectionResult> {
  const result = emptyCatalogueResult();
  const seed = (videosSeed as CatalogueVideoSeed[]).filter(
    (v) => typeof v.youtubeId === "string" && v.youtubeId.length > 0,
  );
  const rows = await withDbRetry(
    () =>
      prisma.video.findMany({
        where: { youtubeId: { in: seed.map((v) => v.youtubeId) } },
        select: { id: true, youtubeId: true, description: true, technique: true, learnings: true, exercise: true },
      }),
    { label: "catalogue-content:videos:findMany" },
  );
  const byYoutubeId = new Map(rows.map((r) => [r.youtubeId, r]));
  const ops: CataloguePatchOp<CatalogueVideoData>[] = [];

  for (const video of seed) {
    const row = byYoutubeId.get(video.youtubeId);
    if (!row) {
      result.missing++;
      continue;
    }
    const data: CatalogueVideoData = {};
    if (typeof video.description === "string" && row.description !== video.description) {
      data.description = video.description;
    }
    if (typeof video.technique === "string" && row.technique !== video.technique) {
      data.technique = video.technique;
    }
    if (
      Array.isArray(video.learnings) &&
      JSON.stringify(row.learnings) !== JSON.stringify(video.learnings)
    ) {
      data.learnings = video.learnings;
    }
    if (typeof video.exercise === "string" && row.exercise !== video.exercise) {
      data.exercise = video.exercise;
    }
    if (Object.keys(data).length === 0) {
      result.unchanged++;
      continue;
    }
    ops.push({ id: row.id, data, renamed: false });
  }

  await runCatalogueOps(
    ops,
    (op) => prisma.video.update({ where: { id: op.id }, data: op.data }),
    "catalogue-content:videos:update",
  );
  result.updated = ops.length;
  return result;
}

async function patchCatalogueParcours(): Promise<CatalogueSectionResult> {
  const result = emptyCatalogueResult();
  const seed = (parcoursSeed as CatalogueParcoursSeed[]).filter(
    (p) => typeof p.slug === "string" && typeof p.description === "string",
  );
  const rows = await withDbRetry(
    () =>
      prisma.learningPath.findMany({
        where: { slug: { in: seed.map((p) => p.slug) } },
        select: { id: true, slug: true, description: true },
      }),
    { label: "catalogue-content:parcours:findMany" },
  );
  const bySlug = new Map(rows.map((r) => [r.slug, r]));
  const ops: CataloguePatchOp<{ description: string }>[] = [];

  for (const path of seed) {
    const row = bySlug.get(path.slug);
    if (!row) {
      result.missing++;
      continue;
    }
    if (row.description === path.description) {
      result.unchanged++;
      continue;
    }
    ops.push({ id: row.id, data: { description: path.description }, renamed: false });
  }

  await runCatalogueOps(
    ops,
    (op) => prisma.learningPath.update({ where: { id: op.id }, data: op.data }),
    "catalogue-content:parcours:update",
  );
  result.updated = ops.length;
  return result;
}

function formatCatalogueResult(name: string, r: CatalogueSectionResult): string {
  const extras = [
    r.renamed > 0 ? `${r.renamed} renommé(s)` : "",
    `${r.unchanged} inchangé(s)`,
    r.missing > 0 ? `${r.missing} absent(s) en base` : "",
    r.aliasSkipped > 0 ? `${r.aliasSkipped} alias ignoré(s) (doublon évité)` : "",
  ].filter(Boolean);
  return `${name} ${r.updated} mis à jour (${extras.join(", ")})`;
}

async function applyCatalogueContentTask(): Promise<void> {
  try {
    const existing = await withDbRetry(
      () => prisma.dataPatch.findUnique({ where: { patchId: CATALOGUE_CONTENT_PATCH_ID } }),
      { label: "catalogue-content:check" },
    );
    if (existing) {
      console.log(`[startup] catalogue ${CATALOGUE_CONTENT_PATCH_ID} déjà appliqué (skip).`);
      return;
    }

    const sections: Array<[string, () => Promise<CatalogueSectionResult>]> = [
      ["vannes", patchCatalogueJokes],
      ["conseils", patchCatalogueTips],
      ["vidéos", patchCatalogueVideos],
      ["parcours", patchCatalogueParcours],
    ];
    const summaries: string[] = [];
    let failed = 0;
    for (const [name, run] of sections) {
      try {
        summaries.push(formatCatalogueResult(name, await run()));
      } catch (err) {
        failed++;
        console.error(`[startup] catalogue : section ${name} échouée (non bloquant) :`, err);
      }
    }
    const summary = summaries.join(" ; ");
    console.log(`[startup] catalogue ${CATALOGUE_CONTENT_PATCH_ID} : ${summary}.`);

    if (failed > 0) {
      console.warn(
        `[startup] catalogue : ${failed} section(s) en échec → marqueur NON écrit (réessai au prochain boot).`,
      );
      return;
    }
    await withDbRetry(
      () =>
        prisma.dataPatch.upsert({
          where: { patchId: CATALOGUE_CONTENT_PATCH_ID },
          create: { patchId: CATALOGUE_CONTENT_PATCH_ID, note: summary.slice(0, 2000) },
          update: {},
        }),
      { label: "catalogue-content:mark" },
    );
  } catch (err) {
    console.error("[startup] applyCatalogueContent échoué (non bloquant) :", err);
  }
}

/**
 * Retrait des tirets cadratins (« — ») du corps des articles de blog en base
 * (règle projet n°12, décision fondateur s12). Pendant DB de la passe faite à la
 * main sur `blog-articles.ts`.
 *
 * Applique `stripEmDashes` (ponctuation seulement : aucun mot changé ; titres
 * `#`, liens, code intouchés) au champ `content` des articles PUBLIÉS qui
 * contiennent un « — ». title / excerpt / metaTitle / metaDescription ne sont
 * JAMAIS touchés (intouchables SEO).
 *
 * Garanties (même modèle que `applyBlogArticleRewritesTask`) :
 *  - Idempotent : marqueur `DataPatch` "blog-em-dash:v<version>:<slug>" posé
 *    dans la MÊME transaction que l'update → 2e boot = 0 update. Un article
 *    dont seul un titre contient « — » n'est ni modifié ni marqué.
 *  - Réversible : `DataPatch.note` garde le contenu d'origine (JSON, champ
 *    `before`). Retour arrière :
 *      UPDATE "BlogArticle" b SET content = (d.note::json->>'before')
 *      FROM "DataPatch" d WHERE d."patchId" = 'blog-em-dash:v1:' || b.slug;
 *  - Fail-safe : erreur DB sur un slug → loggée, les autres continuent.
 *  - SANS IA. Doit tourner APRÈS les tâches qui réécrivent `content`
 *    (fix / rewrite / liens) : si une réécriture future réinjecte des tirets,
 *    bumper `BLOG_EM_DASH_PATCH_VERSION`.
 */
const BLOG_EM_DASH_PATCH_VERSION = 1;

async function stripBlogEmDashesTask(): Promise<void> {
  const version = BLOG_EM_DASH_PATCH_VERSION;
  let articles: { id: string; slug: string; content: string }[];
  try {
    articles = await withDbRetry(
      () =>
        prisma.blogArticle.findMany({
          where: { isPublished: true, content: { contains: "—" } },
          select: { id: true, slug: true, content: true },
        }),
      { label: "blog-em-dash:list" },
    );
  } catch (err) {
    console.error("[startup] stripBlogEmDashes : lecture échouée (non bloquant) :", err);
    return;
  }

  let applied = 0;
  let skipped = 0;
  let dashes = 0;
  for (const article of articles) {
    const patchId = `blog-em-dash:v${version}:${article.slug}`;
    try {
      const existing = await withDbRetry(
        () => prisma.dataPatch.findUnique({ where: { patchId } }),
        { label: `blog-em-dash:check(${article.slug})` },
      );
      if (existing) {
        skipped++;
        continue;
      }

      const { text, stats } = stripEmDashesWithStats(article.content);
      if (text === article.content) continue; // tirets seulement dans les titres

      const replaced = Object.values(stats).reduce((sum, n) => sum + n, 0);
      const note = JSON.stringify({ patch: "blog-em-dash", version, slug: article.slug, stats, before: article.content });
      await withDbRetry(
        () =>
          prisma.$transaction([
            prisma.blogArticle.update({
              where: { id: article.id },
              data: { content: text, updatedAt: new Date() },
            }),
            prisma.dataPatch.create({ data: { patchId, note } }),
          ]),
        { label: `blog-em-dash:apply(${article.slug})` },
      );
      applied++;
      dashes += replaced;
    } catch (err) {
      console.error(`[startup] stripBlogEmDashes échoué pour "${article.slug}" (non bloquant) :`, err);
    }
  }

  if (applied > 0 || skipped > 0) {
    console.log(
      `[startup] tirets cadratins blog v${version} : ${applied} article(s) corrigé(s) (${dashes} tiret(s)), ${skipped} déjà patché(s).`,
    );
  }
}

/**
 * Rattrapage de la relecture des statuts Buffer (s15, 05/10/2026) : au boot,
 * les posts PUBLISHED non confirmés des 7 derniers jours sont relus chez Buffer
 * (le post Instagram du 02/10, en erreur chez Buffer, passe en FAILED + alerte).
 * Idempotent (même logique que le job horaire), sans IA, non bloquant.
 */
async function reconcileBufferPostStatusesTask(): Promise<void> {
  try {
    const { runBufferStatusCheck } = await import("@/lib/social/buffer-status-check");
    const res = await runBufferStatusCheck(new Date());
    if (res?.error) {
      console.warn(`[startup] Relecture Buffer : Buffer injoignable, aucun changement (${res.error}).`);
    } else if (res && (res.confirmed + res.failed + res.missing + res.unconfirmed > 0)) {
      console.log(
        `[startup] Relecture Buffer : ${res.confirmed} confirmé(s), ${res.failed} en FAILED, ${res.missing} introuvable(s), ${res.unconfirmed} non confirmé(s).`,
      );
    }
  } catch (err) {
    console.error("[startup] Relecture des statuts Buffer échouée (non bloquant) :", err);
  }
}

/**
 * Exécute toutes les tâches de démarrage séquentiellement.
 * Appelée une seule fois depuis `register()` (au boot, avant le scheduler).
 */
export async function runStartupTasks(): Promise<void> {
  await ensureCeoConfigTask();
  await cleanupWildcardSocialPostsTask();
  await reconcileBufferPostStatusesTask();
  // AVANT applyJokeDecryptagesTask : renomme les vannes (previousContent →
  // nouveau content) pour que le match par content des décryptages porte
  // ensuite sur les textes réécrits (même fichier source → aucune contradiction).
  await applyCatalogueContentTask();
  // APRÈS le catalogue : parcours, étapes et retouches de défi s17 (lot D).
  await applyParcoursContentTask();
  await applyJokeDecryptagesTask();
  await deactivateWeakJokesTask();
  await fixPublishedBlogArticlesTask();
  await applyBlogArticleRewritesTask();
  await depublishCannibalizedDbArticlesTask();
  await backfillMissingJokeDecryptagesTask();
  await convergeBlogSlugRedirectsTask();
  await rewriteRedirectedBlogLinksTask();
  // EN DERNIER : après toute tâche qui réécrit `content` des articles.
  await stripBlogEmDashesTask();
}

// Export nommé pour les tests unitaires (sans passer par runStartupTasks).
export {
  applyCatalogueContentTask,
  CATALOGUE_CONTENT_PATCH_ID,
  applyJokeDecryptagesTask,
  deactivateWeakJokesTask,
  fixPublishedBlogArticlesTask,
  applyBlogArticleRewritesTask,
  depublishCannibalizedDbArticlesTask,
  backfillMissingJokeDecryptagesTask,
  convergeBlogSlugRedirectsTask,
  rewriteRedirectedBlogLinksTask,
  stripBlogEmDashesTask,
  BLOG_EM_DASH_PATCH_VERSION,
  reconcileBufferPostStatusesTask,
};
