/**
 * Script de décryptage pédagogique des vannes (catalogue existant).
 *
 * Depuis s10, le décryptage du catalogue est appliqué AUTOMATIQUEMENT au boot
 * (sans IA) via `applyJokeDecryptagesTask` dans `runStartupTasks` : les 289
 * décryptages pré-rédigés (src/data/joke-decryptages.json) sont injectés en DB
 * en une passe, instantanément, à chaque déploiement.
 *
 * Ce script reste lançable manuellement pour deux usages :
 *  1. Mode "from-file" (DÉFAUT) : ré-appliquer les décryptages pré-rédigés
 *     hors d'un boot (debug, environnement local). Idempotent, SANS IA, SANS coût.
 *  2. Mode "--ai" (fallback) : générer via l'IA un décryptage pour d'éventuelles
 *     vannes restées `comedyTechnique: null` ET ABSENTES du fichier pré-rédigé
 *     (ex. vieilles vannes IA dont le décryptage manque). À n'utiliser qu'au
 *     besoin — le catalogue standard est intégralement couvert par le fichier.
 *
 * Lancement (depuis apps/web) :
 *   npx tsx scripts/backfill-joke-decryptage.ts            # from-file (défaut)
 *   npx tsx scripts/backfill-joke-decryptage.ts --dry-run  # log sans écrire
 *   npx tsx scripts/backfill-joke-decryptage.ts --ai       # IA fallback (vannes hors fichier)
 *
 * Options :
 *   --dry-run     Log ce qui serait fait, n'écrit RIEN en DB.
 *   --ai          Active la génération IA pour les vannes ABSENTES du fichier.
 *   --limit=N     Ne traite que N vannes (test). Sans limite = tout le reliquat.
 *   --delay=MS    Pause entre appels IA en ms (défaut 400, mode --ai uniquement).
 */

import { prisma } from "@/lib/prisma";
import { withDbRetry } from "@/lib/db-retry";
import jokeDecryptages from "@/data/joke-decryptages.json";

interface JokeDecryptageEntry {
  content: string;
  comedyTechnique: string;
  techniqueExplanation: string;
  howToApply: string;
}

interface BackfillOptions {
  dryRun: boolean;
  useAi: boolean;
  limit: number | null;
  delayMs: number;
}

function parseArgs(argv: string[]): BackfillOptions {
  const opts: BackfillOptions = { dryRun: false, useAi: false, limit: null, delayMs: 400 };
  for (const arg of argv) {
    if (arg === "--dry-run") opts.dryRun = true;
    else if (arg === "--ai") opts.useAi = true;
    else if (arg.startsWith("--limit=")) {
      const n = Number.parseInt(arg.slice("--limit=".length), 10);
      if (Number.isFinite(n) && n > 0) opts.limit = n;
    } else if (arg.startsWith("--delay=")) {
      const n = Number.parseInt(arg.slice("--delay=".length), 10);
      if (Number.isFinite(n) && n >= 0) opts.delayMs = n;
    }
  }
  return opts;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function preview(content: string, max = 40): string {
  const clean = content.replace(/\s+/g, " ").trim();
  return clean.length > max ? `${clean.slice(0, max)}…` : clean;
}

export async function backfillJokeDecryptage(
  options: BackfillOptions,
): Promise<{ total: number; success: number; failed: number; skipped: number }> {
  const { dryRun, useAi, limit, delayMs } = options;

  const entries = jokeDecryptages as JokeDecryptageEntry[];
  const byContent = new Map(entries.map((e) => [e.content, e]));

  const jokes = await withDbRetry(
    () =>
      prisma.joke.findMany({
        where: { comedyTechnique: null },
        select: { id: true, content: true, punchline: true, category: true, type: true },
        orderBy: { createdAt: "asc" },
        ...(limit ? { take: limit } : {}),
      }),
    { label: "backfill:findPending" },
  );

  const total = jokes.length;
  const mode = dryRun ? " (DRY-RUN — aucune écriture)" : "";
  console.log(`[backfill] ${total} vanne(s) non décryptée(s)${mode}.`);

  let success = 0;
  let failed = 0;
  let skipped = 0;

  for (let i = 0; i < jokes.length; i++) {
    const joke = jokes[i];
    const position = `${i + 1}/${total}`;
    const fileEntry = byContent.get(joke.content);

    try {
      let comedyTechnique: string;
      let techniqueExplanation: string;
      let howToApply: string;

      if (fileEntry) {
        // Chemin principal : décryptage pré-rédigé (SANS IA, SANS coût).
        comedyTechnique = fileEntry.comedyTechnique;
        techniqueExplanation = fileEntry.techniqueExplanation;
        howToApply = fileEntry.howToApply;
      } else if (useAi) {
        // Fallback IA : vanne absente du fichier → génération à la demande.
        const { generateJokeDecryptage } = await import("@/lib/ai/agents/joke-agent");
        const decryptage = await generateJokeDecryptage({
          content: joke.content,
          punchline: joke.punchline,
          category: joke.category,
          type: joke.type,
        });
        comedyTechnique = decryptage.comedyTechnique;
        techniqueExplanation = decryptage.techniqueExplanation;
        howToApply = decryptage.howToApply;
        if (delayMs > 0 && i < jokes.length - 1) await sleep(delayMs);
      } else {
        // Pas de fichier, IA désactivée → on laisse null (relançable avec --ai).
        skipped++;
        console.log(`[backfill] ${position} — "${preview(joke.content)}" → absent du fichier, skip (relance --ai).`);
        continue;
      }

      if (!dryRun) {
        await withDbRetry(
          () =>
            prisma.joke.update({
              where: { id: joke.id },
              data: { comedyTechnique, techniqueExplanation, howToApply },
            }),
          { label: "backfill:update" },
        );
      }

      success++;
      const src = fileEntry ? "fichier" : "IA";
      console.log(
        `[backfill] ${position} — "${preview(joke.content)}" → "${comedyTechnique}" (${src})${dryRun ? " (non écrit)" : ""}`,
      );
    } catch (error) {
      failed++;
      const message = error instanceof Error ? error.message : String(error);
      console.error(`[backfill] ${position} — ÉCHEC pour ${joke.id} ("${preview(joke.content)}") : ${message}`);
    }
  }

  console.log(`[backfill] Terminé : ${success} succès, ${skipped} skip, ${failed} échec(s) sur ${total}.`);
  if (skipped > 0) {
    console.log("[backfill] Vannes absentes du fichier non traitées — relance avec --ai pour les générer.");
  }
  if (failed > 0) {
    console.log("[backfill] Relance le script pour retenter les échecs (idempotent : ne reprend que les null).");
  }

  return { total, success, failed, skipped };
}

async function main(): Promise<void> {
  const options = parseArgs(process.argv.slice(2));
  try {
    await backfillJokeDecryptage(options);
  } finally {
    await prisma.$disconnect();
  }
}

// Exécution directe via tsx (pas lors d'un import en test).
if (require.main === module) {
  main().catch((error) => {
    console.error("[backfill] Erreur fatale :", error);
    process.exit(1);
  });
}
