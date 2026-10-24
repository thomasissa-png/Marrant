/**
 * Ligne « Stock du contenu du jour » du rapport du lundi (décision de Thomas
 * du 18/10 : « quand on arrive fin de stock, faut préparer un nouveau lot »).
 *
 * Même calcul que le contrôle `stock` de /api/health (getStockCoverage,
 * prepared-content) : jours de vannes et de conseils jamais servis, jours déjà
 * planifiés compris. Sous STOCK_MIN_DAYS : « Nouveau lot à préparer », en
 * évidence. Au-dessus : une ligne discrète. Génération IA activée : rien (le
 * stock ne sert pas). Ne lève jamais.
 */
import type { StockCoverage } from "@/lib/scheduler/prepared-content";

/** Lecture du stock, injectable pour les tests ; null = génération activée. */
export type StockReader = () => Promise<StockCoverage | null>;

/** Lecture par défaut (rapport du lundi et page admin, s21). */
export const prismaStock: StockReader = async () => {
  const { getStockCoverage, isContentGenerationEnabled } = await import("@/lib/scheduler/prepared-content");
  if (isContentGenerationEnabled()) return null;
  const { todayUTC } = await import("@/lib/ai/date-utils");
  return getStockCoverage(todayUTC());
};

const STOCK_ILLISIBLE_HTML =
  '<p style="font-size:13px;color:#b45309;margin:16px 0 0;">Stock du contenu du jour : illisible (base), voir /api/health.</p>';

const jours = (n: number) => `${n} jour${n > 1 ? "s" : ""}`;

/** HTML de la ligne (vide si génération activée). */
export function buildStockLineHtml(stock: StockCoverage | null): string {
  if (!stock) return "";
  if (stock.jokeDaysLeft === null || stock.tipDaysLeft === null) return STOCK_ILLISIBLE_HTML;
  const detail = `${jours(stock.jokeDaysLeft)} de vannes et ${jours(stock.tipDaysLeft)} de conseils jamais utilisés`;
  if (stock.status === "ok") {
    return `<p style="font-size:12px;color:#6b7280;margin:16px 0 0;">Stock du contenu du jour : ${detail}.</p>`;
  }
  return `<p style="font-size:14px;font-weight:600;color:#b45309;margin:24px 0 8px;">Nouveau lot à préparer : il reste ${detail} (seuil ${stock.minDays} jours). À 0, le site recycle d'anciennes vannes et d'anciens conseils : il se répète.</p>`;
}

/** Ligne prête à insérer dans l'e-mail ; base illisible = ligne d'avertissement. */
export async function loadStockLineHtml(read: StockReader = prismaStock): Promise<string> {
  try {
    return buildStockLineHtml(await read());
  } catch (err) {
    console.warn(`[weekly-visits] Stock illisible : ${err instanceof Error ? err.message : "erreur"}`);
    return STOCK_ILLISIBLE_HTML;
  }
}
