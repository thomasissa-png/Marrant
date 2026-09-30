/**
 * Coupe-circuit budget LLM (incident s14, demande fondateur : « jamais de
 * facture à 100 € »).
 *
 * Appelé par `callWithRetry` (src/lib/ai/client.ts) AVANT chaque
 * `anthropic.messages.create`. C'est l'unique point d'appel au SDK du projet :
 * crons, agents ET route membre /api/ai (via src/lib/claude.ts) sont couverts.
 *
 * Deux seuils sur la somme de `LlmUsageLog.costUsd` :
 *   - 24 h glissantes      : `LLM_DAILY_BUDGET_USD`   (défaut 5 $)
 *   - mois calendaire UTC  : `LLM_MONTHLY_BUDGET_USD` (défaut 40 $)
 * Au-delà (ou si la dépense ne peut pas être lue) : AUCUN appel, on lève
 * `LlmBudgetExceededError` (non retentée), on logge, et on envoie au plus UNE
 * alerte e-mail admin par jour UTC (throttle persistant via `JobLock`).
 *
 * Fail-closed assumé : si Postgres ne répond pas, on n'appelle pas le LLM
 * (sans base, la dépense ne serait de toute façon pas comptée).
 */
import { prisma } from "@/lib/prisma";

export const DEFAULT_DAILY_BUDGET_USD = 5;
export const DEFAULT_MONTHLY_BUDGET_USD = 40;

export type LlmBudgetScope = "daily" | "monthly" | "unavailable";

export class LlmBudgetExceededError extends Error {
  constructor(
    public readonly scope: LlmBudgetScope,
    public readonly spentUsd: number,
    public readonly limitUsd: number,
  ) {
    super(
      scope === "unavailable"
        ? "Budget LLM : dépense illisible (base indisponible), appel bloqué par précaution"
        : `Budget LLM ${scope === "daily" ? "24 h" : "mensuel"} atteint : ${spentUsd.toFixed(2)} $ ≥ ${limitUsd} $`,
    );
    this.name = "LlmBudgetExceededError";
  }
}

export function isLlmBudgetExceededError(error: unknown): error is LlmBudgetExceededError {
  return error instanceof LlmBudgetExceededError
    || (error instanceof Error && error.name === "LlmBudgetExceededError");
}

function readBudget(name: string, fallback: number): number {
  const raw = process.env[name]?.trim();
  if (!raw) return fallback;
  const value = Number(raw);
  return Number.isFinite(value) && value > 0 ? value : fallback;
}

export function getLlmBudgets(): { dailyUsd: number; monthlyUsd: number } {
  return {
    dailyUsd: readBudget("LLM_DAILY_BUDGET_USD", DEFAULT_DAILY_BUDGET_USD),
    monthlyUsd: readBudget("LLM_MONTHLY_BUDGET_USD", DEFAULT_MONTHLY_BUDGET_USD),
  };
}

/** Dépense enregistrée : 24 h glissantes et mois calendaire UTC en cours. */
export async function getLlmSpend(now: Date = new Date()): Promise<{ last24hUsd: number; monthUsd: number }> {
  const since24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const monthStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
  const [day, month] = await Promise.all([
    prisma.llmUsageLog.aggregate({ _sum: { costUsd: true }, where: { createdAt: { gte: since24h } } }),
    prisma.llmUsageLog.aggregate({ _sum: { costUsd: true }, where: { createdAt: { gte: monthStart } } }),
  ]);
  return { last24hUsd: day._sum.costUsd ?? 0, monthUsd: month._sum.costUsd ?? 0 };
}

/** Clé JobLock du throttle d'alerte : une par jour UTC. */
export function budgetAlertLockKey(now: Date): string {
  return `llm-budget-alert-${now.toISOString().slice(0, 10)}`;
}

/** Au plus une alerte par jour UTC. Silent-fail total (ne lève jamais). */
export async function notifyBudgetExceeded(
  error: LlmBudgetExceededError,
  context: { agent?: string; fn?: string } = {},
  now: Date = new Date(),
): Promise<void> {
  try {
    const { tryAcquireLock } = await import("@/lib/job-lock");
    // TTL 25 h : la clé est datée, le TTL ne sert qu'au ménage.
    const canSend = await tryAcquireLock(budgetAlertLockKey(now), 25 * 60 * 60 * 1000);
    if (!canSend) return;
    const { dailyUsd, monthlyUsd } = getLlmBudgets();
    const { sendAdminAlert } = await import("@/lib/email");
    await sendAdminAlert(
      `[Marrant] Coupe-circuit LLM déclenché (${error.scope})`,
      `<p><strong>Tous les appels LLM sont bloqués</strong> jusqu'à ce que la dépense repasse sous les seuils.</p>
<ul>
<li>Motif : ${error.message}</li>
<li>Seuils : ${dailyUsd} $ / 24 h glissantes, ${monthlyUsd} $ / mois UTC (variables LLM_DAILY_BUDGET_USD, LLM_MONTHLY_BUDGET_USD)</li>
<li>Premier appel bloqué : ${context.agent ?? "?"} / ${context.fn ?? "?"} à ${now.toISOString()}</li>
</ul>
<p>Contrôle : SELECT sum("costUsd") FROM "LlmUsageLog" WHERE "createdAt" &gt;= now() - interval '24 hours'. Une seule alerte par jour.</p>`,
    );
  } catch (err) {
    console.warn(`[llm-budget] Échec envoi alerte : ${err instanceof Error ? err.message : String(err)}`);
  }
}

/**
 * Lève `LlmBudgetExceededError` si un seuil est atteint (ou si la dépense est
 * illisible). À appeler juste avant chaque appel SDK.
 */
export async function assertLlmBudget(
  context: { agent?: string; fn?: string } = {},
  now: Date = new Date(),
): Promise<void> {
  const { dailyUsd, monthlyUsd } = getLlmBudgets();
  let breach: LlmBudgetExceededError | null = null;
  try {
    const spend = await getLlmSpend(now);
    if (spend.last24hUsd >= dailyUsd) breach = new LlmBudgetExceededError("daily", spend.last24hUsd, dailyUsd);
    else if (spend.monthUsd >= monthlyUsd) breach = new LlmBudgetExceededError("monthly", spend.monthUsd, monthlyUsd);
  } catch (err) {
    console.error("[llm-budget] Lecture de la dépense impossible, appel bloqué :", err);
    breach = new LlmBudgetExceededError("unavailable", 0, 0);
  }
  if (!breach) return;
  console.error(`[llm-budget] ${breach.message} (${context.agent ?? "?"}/${context.fn ?? "?"})`);
  await notifyBudgetExceeded(breach, context, now);
  throw breach;
}
