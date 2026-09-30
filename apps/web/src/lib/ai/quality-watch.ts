/**
 * Contrôle qualité du matin (lot Q4, s14) : « rien de moyen » dans le contenu
 * du jour.
 *
 * Pour la date du jour (UTC) :
 *  1. Vanne du jour → validateJoke avec la barre des étalons (dailyGeneration).
 *     Sous la barre (verdict ≠ APPROVED) → remplacée dans DailyContent par une
 *     vanne du pool validé (GARDER, déterministe). Validation impossible (API)
 *     → remplacée seulement si la vanne n'est pas déjà GARDER.
 *  2. Conseil du jour → gates programmatiques Q3 (content-gates). Tirets
 *     cadratins corrigés en base ; vulgarité / vouvoiement / mention IA →
 *     remplacé par un conseil du stock qui passe les gates.
 *  3. UN e-mail récap à l'admin (sendAdminAlert, Resend) seulement s'il y a eu
 *     un remplacement ou un défaut.
 *
 * Coût : au plus 1 appel LLM par jour (validateJoke). Idempotent via un verrou
 * JobLock daté (sauf `force`). Pas branché au planificateur ici : la route
 * /api/cron/quality-watch est appelée par l'orchestrateur (voir handoff).
 */
import { prisma } from "@/lib/prisma";
import { todayUTC, getDayOfYear } from "./date-utils";
import { getPersonaForDay } from "./personas";
import { validateJoke, type JokeToValidate } from "./agents/standup-director-agent";
import { pickValidatedJoke } from "./daily-joke-pool";
import { applyContentGates } from "./content-gates";

export const QUALITY_WATCH_LOCK_TTL_MS = 20 * 60 * 60 * 1000;
/** Conseils du stock examinés (sans LLM) pour trouver un remplaçant propre. */
const MAX_TIP_CANDIDATES = 20;
const TIP_FIELDS = ["title", "content", "example", "exercise"] as const;

export interface QualityWatchResult {
  date: string;
  skipped?: string;
  llmCalls: number;
  joke: {
    id: string | null;
    verdict?: string;
    score?: number;
    replacedBy?: string;
    issues: string[];
  };
  tip: {
    id: string | null;
    emDashFixed: boolean;
    replacedBy?: string;
    issues: string[];
  };
  defects: string[];
  emailed: boolean;
}

export async function runQualityWatch(
  options: { now?: Date; force?: boolean } = {},
): Promise<QualityWatchResult> {
  const now = options.now ?? new Date();
  const date = options.now ? startOfUtcDay(now) : todayUTC();
  const result: QualityWatchResult = {
    date: date.toISOString().slice(0, 10),
    llmCalls: 0,
    joke: { id: null, issues: [] },
    tip: { id: null, emDashFixed: false, issues: [] },
    defects: [],
    emailed: false,
  };

  if (!options.force) {
    const { tryAcquireLock, buildJobLockKey } = await import("@/lib/job-lock");
    const acquired = await tryAcquireLock(buildJobLockKey("quality-watch", date), QUALITY_WATCH_LOCK_TTL_MS);
    if (!acquired) {
      result.skipped = "Contrôle déjà fait aujourd'hui (verrou)";
      return result;
    }
  }

  const daily = await prisma.dailyContent.findUnique({
    where: { date },
    include: { joke: true, tip: true },
  });
  if (!daily) {
    result.defects.push("Aucun contenu du jour en base (DailyContent absent) : le site affiche le repli déterministe.");
    await sendRecap(result);
    return result;
  }

  const dayOfYear = getDayOfYear(date);
  await checkJoke(daily.joke, date, dayOfYear, result);
  await checkTip(daily.tip, date, dayOfYear, result);

  if (result.joke.replacedBy || result.tip.replacedBy || result.defects.length > 0) {
    await sendRecap(result);
  }
  console.log(
    `[QualityWatch] ${result.date} : vanne ${result.joke.verdict ?? "?"}${result.joke.replacedBy ? " → remplacée" : ""}, conseil ${result.tip.replacedBy ? "remplacé" : "ok"}, défauts ${result.defects.length}, e-mail ${result.emailed ? "envoyé" : "non"}.`,
  );
  return result;
}

type DailyJoke = {
  id: string;
  content: string;
  punchline: string;
  category: string;
  type: string;
  maturityLevel: number;
  copyVerdict: string | null;
} | null;

async function checkJoke(joke: DailyJoke, date: Date, dayOfYear: number, result: QualityWatchResult) {
  if (!joke) {
    result.defects.push("Vanne du jour introuvable.");
    return;
  }
  result.joke.id = joke.id;

  let underBar: boolean;
  try {
    result.llmCalls++;
    const validation = await validateJoke(
      {
        content: joke.content,
        punchline: joke.punchline,
        category: joke.category,
        type: joke.type,
        maturityLevel: joke.maturityLevel,
      } satisfies JokeToValidate,
      getPersonaForDay(date.getUTCDate()),
      { dailyGeneration: true },
    );
    result.joke.verdict = validation.verdict;
    result.joke.score = validation.score;
    result.joke.issues = validation.issues.slice(0, 3);
    underBar = validation.verdict !== "APPROVED";
  } catch (err) {
    result.joke.verdict = "VALIDATION_IMPOSSIBLE";
    result.defects.push(`Validation de la vanne impossible : ${err instanceof Error ? err.message : String(err)}`);
    // Sans avis du Director, seule une vanne déjà validée (GARDER) reste.
    underBar = joke.copyVerdict !== "GARDER";
  }
  if (!underBar) return;

  const replacement = await pickValidatedJoke(dayOfYear, { excludeIds: [joke.id] });
  if (!replacement) {
    result.defects.push("Vanne du jour sous la barre, mais aucune vanne validée (GARDER) disponible pour la remplacer.");
    return;
  }
  await prisma.dailyContent.update({ where: { date }, data: { jokeId: replacement.id } });
  result.joke.replacedBy = replacement.id;
}

type DailyTip = {
  id: string;
  title: string;
  content: string;
  example: string;
  exercise: string;
} | null;

async function checkTip(tip: DailyTip, date: Date, dayOfYear: number, result: QualityWatchResult) {
  if (!tip) {
    result.defects.push("Conseil du jour introuvable.");
    return;
  }
  result.tip.id = tip.id;
  const report = applyContentGates(tip, TIP_FIELDS, `conseil du jour ${tip.id}`);

  if (report.ok) {
    if (report.emDashFieldsFixed > 0) {
      await prisma.tip.update({ where: { id: tip.id }, data: pickTipFields(report.value) });
      // Correction automatique : pas un défaut à signaler par e-mail.
      result.tip.emDashFixed = true;
    }
    return;
  }

  result.tip.issues = report.rejections.map((r) => `${r.code} (${r.field} : « ${r.match} »)`);
  const replacement = await findCleanStockTip(tip.id, dayOfYear);
  if (!replacement) {
    result.defects.push(`Conseil du jour rejeté (${result.tip.issues.join(" ; ")}) et aucun conseil du stock propre trouvé.`);
    return;
  }
  await prisma.dailyContent.update({ where: { date }, data: { tipId: replacement.id } });
  result.tip.replacedBy = replacement.id;
}

async function findCleanStockTip(excludeId: string, dayOfYear: number): Promise<{ id: string } | null> {
  const where = { isActive: true, id: { not: excludeId } };
  const count = await prisma.tip.count({ where });
  if (count === 0) return null;
  const candidates = await prisma.tip.findMany({
    where,
    orderBy: { id: "asc" },
    skip: dayOfYear % count,
    take: Math.min(MAX_TIP_CANDIDATES, count),
    select: { id: true, title: true, content: true, example: true, exercise: true },
  });
  for (const candidate of candidates) {
    const report = applyContentGates(candidate, TIP_FIELDS, `conseil du stock ${candidate.id}`);
    if (!report.ok) continue;
    if (report.emDashFieldsFixed > 0) {
      await prisma.tip.update({ where: { id: candidate.id }, data: pickTipFields(report.value) });
    }
    return { id: candidate.id };
  }
  return null;
}

function pickTipFields(t: { title: string; content: string; example: string; exercise: string }) {
  return { title: t.title, content: t.content, example: t.example, exercise: t.exercise };
}

function startOfUtcDay(d: Date): Date {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

async function sendRecap(result: QualityWatchResult): Promise<void> {
  const lines: string[] = [];
  if (result.joke.replacedBy) {
    lines.push(
      `Vanne du jour sous la barre (verdict ${result.joke.verdict ?? "?"}, score ${result.joke.score ?? "?"}/10) : ${result.joke.id} remplacée par ${result.joke.replacedBy} (pool validé).${result.joke.issues.length ? ` Motifs : ${result.joke.issues.join(" ; ")}` : ""}`,
    );
  }
  if (result.tip.replacedBy) {
    lines.push(`Conseil du jour ${result.tip.id} remplacé par ${result.tip.replacedBy} : ${result.tip.issues.join(" ; ")}`);
  }
  lines.push(...result.defects);
  if (result.tip.emDashFixed) lines.push("Conseil du jour : tirets cadratins corrigés automatiquement.");
  const body = `<p>Contrôle qualité du matin, ${result.date} :</p><ul>${lines.map((l) => `<li>${escapeHtml(l)}</li>`).join("")}</ul>`;
  try {
    const { sendAdminAlert } = await import("@/lib/email");
    await sendAdminAlert(`[Marrant] Contrôle qualité du ${result.date} : ${lines.length} point(s)`, body);
    result.emailed = true;
  } catch (err) {
    console.warn("[QualityWatch] Envoi du récap impossible :", err);
  }
}
