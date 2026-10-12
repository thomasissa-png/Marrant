/**
 * Liens contextuels S4 (maillage s20) : phrases de liaison ajoutées aux
 * articles de blog stockés EN BASE. Source : `docs/copy/liens-s4-s20.md`
 * (§6 tour 2 pour les appariements 2, 11, 12 ; §7 tour 3 pour 8 et 10),
 * phrases validées à l'aveugle par deux relecteurs (règle d'or P0 s18).
 * Les appariements statiques (1, 5, 7, 14) sont édités directement dans
 * `blog-articles.ts` ; 3, 4, 6, 9, 13 ne sont PAS appliqués.
 *
 * Remplacement exact « avant » → « après » (pas de bump de
 * `blog-article-rewrites.json` `_meta.version`, qui réécrirait les 9 articles).
 *
 * Garanties :
 *  - Idempotent : marqueur `DataPatch` "blog-liens-s4-s20:v1:<slug>" posé dans
 *    la MÊME transaction que l'update → 2e passage = 0 update.
 *  - Strict : chaque chaîne « avant » doit apparaître EXACTEMENT une fois dans
 *    le contenu courant ; sinon erreur journalisée, article non touché, pas de
 *    marqueur (la tâche réessaie au passage suivant). Les remplacements d'un
 *    même article sont tout-ou-rien.
 *  - Déjà présent : si toutes les phrases « après » sont déjà là (base
 *    réalignée depuis le JSON, qui les contient) et aucune chaîne « avant »,
 *    marqueur posé sans toucher l'article.
 *  - Réversible : `DataPatch.note` garde le contenu d'origine (champ `before`) :
 *      UPDATE "BlogArticle" b SET content = (d.note::json->>'before')
 *      FROM "DataPatch" d WHERE d."patchId" = 'blog-liens-s4-s20:v1:' || b.slug
 *        AND d.note::json->>'before' IS NOT NULL;
 *  - `updatedAt` mis à jour seulement pour l'article réellement modifié.
 *  - Fail-safe : erreur DB sur un slug → journalisée, les autres continuent.
 *  - SANS IA.
 */
import { prisma } from "@/lib/prisma";
import { withDbRetry } from "@/lib/db-retry";

export const BLOG_LIENS_S4_S20_PATCH_VERSION = 1;

export interface BlogLinkReplacement {
  /** Numéro d'appariement de `docs/copy/liens-s4-s20.md` §1. */
  appariement: number;
  before: string;
  after: string;
}

export interface BlogLinkPatch {
  slug: string;
  replacements: BlogLinkReplacement[];
}

export const BLOG_LIENS_S4_S20_PATCHES: readonly BlogLinkPatch[] = [
  {
    // Appariements 2 (lettre I, §6) et 12 (lettre D, §6).
    slug: "comment-improviser-des-blagues",
    replacements: [
      {
        appariement: 2,
        before: "et en tire des **punchlines** qui tapent juste.\n\n## 2. Technique du rebond",
        after:
          "et en tire des **punchlines** qui tapent juste. Si la pause café te fait plus peur que la réunion, voilà comment [tenir la conversation à la machine à café](/blog/conversation-machine-a-cafe).\n\n## 2. Technique du rebond",
      },
      {
        appariement: 12,
        before: "pour 80% des situations sociales.\n\n## 5. Gérer l'échec : transformer un flop en rebond",
        after:
          "pour 80% des situations sociales.\n\nLe jour où une phrase ne suffit plus, on t'explique comment [raconter une histoire drôle](/blog/storytelling-drole-5-structures), avec l'escalade et le pivot en renfort.\n\n## 5. Gérer l'échec : transformer un flop en rebond",
      },
    ],
  },
  {
    // Appariement 11 (lettre A, §6).
    slug: "comment-raconter-une-blague-sans-la-rater",
    replacements: [
      {
        appariement: 11,
        before: "Dans la seconde, rien ne dépasse.\n\nDernier réglage : le placement.",
        after:
          "Dans la seconde, rien ne dépasse. Quand c'est toute une anecdote à construire, pioche dans nos [5 structures de storytelling drôle](/blog/storytelling-drole-5-structures) : elles te donnent le plan.\n\nDernier réglage : le placement.",
      },
    ],
  },
  {
    // Appariement 8 (lettre Y, §7).
    slug: "blague-drole-7-criteres-pepite",
    replacements: [
      {
        appariement: 8,
        before: "On les passe en revue un par un, avec une grille pour tester les tiennes à la fin.\n\n## MYTHE BRISÉ",
        after:
          "On les passe en revue un par un, avec une grille pour tester les tiennes à la fin. L'envers du décor, c'est aussi [comment les pros construisent leurs blagues](/blog/techniques-humoristes-pros).\n\n## MYTHE BRISÉ",
      },
    ],
  },
  {
    // Appariement 10 (lettre V, §7).
    slug: "blague-courte-arme-secrete-humour",
    replacements: [
      {
        appariement: 10,
        before:
          "une vanne courte tombe aussi vite qu'elle est partie. Si tu en veux d'autres, notre [abonnement](/abonnement) en propose 50 nouvelles chaque mois.",
        after:
          "une vanne courte tombe aussi vite qu'elle est partie. Dans le même esprit, on a rangé [40 citations drôles avec leur mode d'emploi](/blog/citation-drole) par situation. Si tu en veux d'autres, notre [abonnement](/abonnement) en propose 50 nouvelles chaque mois.",
      },
    ],
  },
];

/** Nombre d'occurrences (non chevauchantes) de `needle` dans `haystack`. */
export function countOccurrences(haystack: string, needle: string): number {
  if (!needle) return 0;
  let count = 0;
  let from = 0;
  for (;;) {
    const i = haystack.indexOf(needle, from);
    if (i === -1) return count;
    count++;
    from = i + needle.length;
  }
}

export type LinkPatchOutcome =
  | { status: "apply"; content: string }
  | { status: "already-present" }
  | { status: "error"; reason: string };

/**
 * Calcule le nouveau contenu (pure, sans DB). Tout-ou-rien : la moindre
 * chaîne « avant » absente ou multiple → erreur, contenu inchangé.
 */
export function computeLinkPatch(content: string, replacements: readonly BlogLinkReplacement[]): LinkPatchOutcome {
  const allPresent = replacements.every(
    (r) => countOccurrences(content, r.after) === 1 && countOccurrences(content, r.before) === 0,
  );
  if (allPresent) return { status: "already-present" };

  let next = content;
  for (const r of replacements) {
    const n = countOccurrences(next, r.before);
    if (n !== 1) {
      return {
        status: "error",
        reason: `appariement ${r.appariement} : chaîne « avant » trouvée ${n} fois (attendu : 1)`,
      };
    }
    const i = next.indexOf(r.before);
    next = next.slice(0, i) + r.after + next.slice(i + r.before.length);
  }
  return { status: "apply", content: next };
}

export async function applyBlogLiensS4S20Task(): Promise<void> {
  const version = BLOG_LIENS_S4_S20_PATCH_VERSION;
  let applied = 0;
  let sentences = 0;
  let skipped = 0;
  let alreadyPresent = 0;
  let errors = 0;

  for (const patch of BLOG_LIENS_S4_S20_PATCHES) {
    const patchId = `blog-liens-s4-s20:v${version}:${patch.slug}`;
    try {
      const existing = await withDbRetry(
        () => prisma.dataPatch.findUnique({ where: { patchId } }),
        { label: `blog-liens-s4-s20:check(${patch.slug})` },
      );
      if (existing) {
        skipped++;
        continue;
      }

      const article = await withDbRetry(
        () =>
          prisma.blogArticle.findUnique({
            where: { slug: patch.slug },
            select: { id: true, content: true, isPublished: true },
          }),
        { label: `blog-liens-s4-s20:find(${patch.slug})` },
      );
      if (!article || !article.isPublished) {
        errors++;
        console.error(
          `[startup] liens S4 s20 : article "${patch.slug}" introuvable ou non publié, non modifié.`,
        );
        continue;
      }

      const outcome = computeLinkPatch(article.content, patch.replacements);
      const appariements = patch.replacements.map((r) => r.appariement);

      if (outcome.status === "error") {
        errors++;
        console.error(`[startup] liens S4 s20 : "${patch.slug}" non modifié, ${outcome.reason}.`);
        continue;
      }

      if (outcome.status === "already-present") {
        await withDbRetry(
          () =>
            prisma.dataPatch.create({
              data: {
                patchId,
                note: JSON.stringify({ patch: "blog-liens-s4-s20", version, slug: patch.slug, appariements, alreadyPresent: true }),
              },
            }),
          { label: `blog-liens-s4-s20:mark(${patch.slug})` },
        );
        alreadyPresent++;
        continue;
      }

      const note = JSON.stringify({
        patch: "blog-liens-s4-s20",
        version,
        slug: patch.slug,
        appariements,
        before: article.content,
      });
      await withDbRetry(
        () =>
          prisma.$transaction([
            prisma.blogArticle.update({
              where: { id: article.id },
              data: { content: outcome.content, updatedAt: new Date() },
            }),
            prisma.dataPatch.create({ data: { patchId, note } }),
          ]),
        { label: `blog-liens-s4-s20:apply(${patch.slug})` },
      );
      applied++;
      sentences += patch.replacements.length;
    } catch (err) {
      errors++;
      console.error(`[startup] liens S4 s20 échoué pour "${patch.slug}" (non bloquant) :`, err);
    }
  }

  console.log(
    `[startup] liens S4 s20 v${version} : ${applied} article(s) modifié(s) (${sentences} phrase(s)), ${skipped} déjà patché(s), ${alreadyPresent} déjà présent(s), ${errors} en erreur.`,
  );
}
