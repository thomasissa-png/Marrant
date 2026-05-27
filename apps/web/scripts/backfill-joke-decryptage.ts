/**
 * Script de back-fill du décryptage pédagogique des vannes existantes (Phase 1b).
 *
 * Parcourt toutes les vannes dont `comedyTechnique IS NULL` (non encore décryptées),
 * génère le décryptage via l'agent Vannes (Sonnet) et met à jour la DB.
 *
 * Caractéristiques :
 *  - Idempotent : ne traite QUE les vannes non décryptées → relançable sans doublon.
 *  - Robuste : try/catch par vanne → un échec n'interrompt pas le batch.
 *  - Throttling : pause entre appels pour ménager l'API Anthropic + Neon.
 *
 * Lancement sur Replit (depuis apps/web) :
 *   1. Test à blanc sur 5 vannes :
 *        npx tsx scripts/backfill-joke-decryptage.ts --dry-run --limit=5
 *   2. Test réel sur 5 vannes (écrit en DB) :
 *        npx tsx scripts/backfill-joke-decryptage.ts --limit=5
 *   3. Run complet (les ~289 vannes restantes) :
 *        npx tsx scripts/backfill-joke-decryptage.ts
 *
 * Options :
 *   --dry-run     Log ce qui serait fait, n'écrit RIEN en DB.
 *   --limit=N     Ne traite que N vannes (test). Sans limite = tout le reliquat.
 *   --delay=MS    Pause entre appels en ms (défaut 400).
 */

import { prisma } from "@/lib/prisma";
import { generateJokeDecryptage } from "@/lib/ai/agents/joke-agent";

interface BackfillOptions {
  dryRun: boolean;
  limit: number | null;
  delayMs: number;
}

function parseArgs(argv: string[]): BackfillOptions {
  const opts: BackfillOptions = { dryRun: false, limit: null, delayMs: 400 };
  for (const arg of argv) {
    if (arg === "--dry-run") opts.dryRun = true;
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

// Aperçu court du setup pour des logs lisibles.
function preview(content: string, max = 40): string {
  const clean = content.replace(/\s+/g, " ").trim();
  return clean.length > max ? `${clean.slice(0, max)}…` : clean;
}

export async function backfillJokeDecryptage(
  options: BackfillOptions
): Promise<{ total: number; success: number; failed: number }> {
  const { dryRun, limit, delayMs } = options;

  const jokes = await prisma.joke.findMany({
    where: { comedyTechnique: null },
    select: { id: true, content: true, punchline: true, category: true, type: true },
    orderBy: { createdAt: "asc" },
    ...(limit ? { take: limit } : {}),
  });

  const total = jokes.length;
  const mode = dryRun ? " (DRY-RUN — aucune écriture)" : "";
  console.log(`[backfill] ${total} vanne(s) à décrypter${mode}.`);

  let success = 0;
  let failed = 0;

  for (let i = 0; i < jokes.length; i++) {
    const joke = jokes[i];
    const position = `${i + 1}/${total}`;

    try {
      const decryptage = await generateJokeDecryptage({
        content: joke.content,
        punchline: joke.punchline,
        category: joke.category,
        type: joke.type,
      });

      if (!dryRun) {
        await prisma.joke.update({
          where: { id: joke.id },
          data: {
            comedyTechnique: decryptage.comedyTechnique,
            techniqueExplanation: decryptage.techniqueExplanation,
            howToApply: decryptage.howToApply,
          },
        });
      }

      success++;
      console.log(
        `[backfill] ${position} — "${preview(joke.content)}" → "${decryptage.comedyTechnique}"${dryRun ? " (non écrit)" : ""}`
      );
    } catch (error) {
      failed++;
      const message = error instanceof Error ? error.message : String(error);
      console.error(`[backfill] ${position} — ÉCHEC pour ${joke.id} ("${preview(joke.content)}") : ${message}`);
    }

    // Throttle entre appels (sauf après le dernier).
    if (i < jokes.length - 1 && delayMs > 0) {
      await sleep(delayMs);
    }
  }

  console.log(`[backfill] Terminé : ${success} succès, ${failed} échec(s) sur ${total}.`);
  if (failed > 0) {
    console.log("[backfill] Relance le script pour retenter les échecs (idempotent : ne reprend que les null).");
  }

  return { total, success, failed };
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
