/**
 * Instrumentation coûts API Anthropic — écriture d'un log par appel LLM.
 *
 * Ce module existe pour transformer les hypothèses sur les coûts en data
 * factuelle. Chaque appel à `callWithRetry` enregistre un row dans `LlmUsageLog`
 * avec le nombre de tokens facturés, le coût en USD calculé localement, et
 * les tokens de cache (reads + writes) quand le prompt caching est activé.
 *
 * Règles de conception :
 * - **Silent-fail obligatoire** : si la DB crash ou si la migration n'a pas
 *   encore été appliquée, on log en console mais on ne throw PAS. L'instrumentation
 *   ne doit JAMAIS bloquer un pipeline de génération.
 * - **Pas de batching** : le volume attendu est de 30-120 appels/jour, un INSERT
 *   par appel est négligeable devant la latence d'une requête LLM (2-20s).
 * - **Constantes de prix versionnées** : les tarifs Anthropic sont codés en dur,
 *   datés, et référencés à leur source. À vérifier périodiquement (voir commentaire).
 */

import type Anthropic from "@anthropic-ai/sdk";
import { prisma } from "@/lib/prisma";

/**
 * Tarifs Anthropic par modèle — USD per million tokens.
 * Vérifié le 11/04/2026 via https://www.anthropic.com/pricing.
 *
 * Format : input / output / cache_read / cache_write (prompt caching).
 * Le prompt caching Anthropic facture :
 *   - cache write = 1.25x le prix input standard (5 min TTL)
 *   - cache read = 0.10x le prix input standard
 *
 * À ajouter si un nouveau modèle est introduit : l'agent qui l'utilise doit
 * patcher ce fichier en même temps que son appel pour garantir le calcul du coût.
 */
export const PRICING = {
  // Sonnet 4 (modèle principal utilisé en production)
  "claude-sonnet-4-20250514": { input: 3, output: 15, cacheRead: 0.3, cacheWrite: 3.75 },
  // Alias court utilisé parfois dans les frontmatters agents
  "claude-sonnet-4-5": { input: 3, output: 15, cacheRead: 0.3, cacheWrite: 3.75 },
  "claude-sonnet-4-6": { input: 3, output: 15, cacheRead: 0.3, cacheWrite: 3.75 },
  // Opus 4.6 (non utilisé actuellement mais prix référencé pour future migration)
  "claude-opus-4-6": { input: 5, output: 25, cacheRead: 0.5, cacheWrite: 6.25 },
  // Haiku 4.5 (cible des validates Director dans le commit 5 de l'audit IA)
  "claude-haiku-4-5-20251001": { input: 1, output: 5, cacheRead: 0.1, cacheWrite: 1.25 },
} as const;

export type SupportedModel = keyof typeof PRICING;

/**
 * Shape minimale du champ `usage` renvoyé par l'API Anthropic.
 * Volontairement réduit aux champs qu'on consomme pour rester découplé du SDK.
 */
export interface UsageStats {
  input_tokens: number;
  output_tokens: number;
  cache_read_input_tokens?: number | null;
  cache_creation_input_tokens?: number | null;
}

/**
 * Calcule le coût USD d'un appel LLM à partir des tokens facturés.
 *
 * Formule : (input × prix_input + output × prix_output + cacheRead × prix_cacheRead
 *            + cacheCreation × prix_cacheWrite) / 1_000_000
 *
 * Modèle inconnu → retourne 0 + warning console (on ne throw pas pour ne pas
 * casser un pipeline qui fonctionne — le coût sera simplement loggé à 0).
 */
export function computeCost(model: string, usage: UsageStats): number {
  const pricing = PRICING[model as SupportedModel];
  if (!pricing) {
    console.warn(`[llm-usage] Modèle inconnu "${model}" — coût calculé à 0. Ajouter à PRICING dans usage-log.ts.`);
    return 0;
  }

  const input = usage.input_tokens ?? 0;
  const output = usage.output_tokens ?? 0;
  const cacheRead = usage.cache_read_input_tokens ?? 0;
  const cacheCreation = usage.cache_creation_input_tokens ?? 0;

  const cost =
    (input * pricing.input +
      output * pricing.output +
      cacheRead * pricing.cacheRead +
      cacheCreation * pricing.cacheWrite) /
    1_000_000;

  return cost;
}

/**
 * Paramètres acceptés par `logLLMUsage`.
 * Le champ `meta` identifie l'agent + la fonction appelante (pour agrégation).
 */
export interface LogLLMUsageParams {
  agent: string;
  fn: string;
  model: string;
  usage: UsageStats;
  durationMs?: number;
  success?: boolean;
  errorMessage?: string | null;
}

/**
 * Enregistre un row dans `LlmUsageLog`. Silent-fail obligatoire : toute erreur
 * DB est loggée en console mais n'est JAMAIS propagée.
 *
 * Cas d'échec attendus et tolérés :
 * - Migration pas encore appliquée → `P2021` ("table not found") : on skip
 * - DB inaccessible → erreur réseau : on skip
 * - Modèle inconnu dans PRICING → coût = 0 + warning (pas une erreur DB)
 */
export async function logLLMUsage(params: LogLLMUsageParams): Promise<void> {
  try {
    const { agent, fn, model, usage, durationMs, success = true, errorMessage } = params;
    const costUsd = computeCost(model, usage);

    await prisma.llmUsageLog.create({
      data: {
        agent,
        fn,
        model,
        inputTokens: usage.input_tokens ?? 0,
        outputTokens: usage.output_tokens ?? 0,
        cacheReadTokens: usage.cache_read_input_tokens ?? 0,
        cacheCreationTokens: usage.cache_creation_input_tokens ?? 0,
        costUsd,
        durationMs: durationMs ?? null,
        success,
        errorMessage: errorMessage ?? null,
      },
    });
  } catch (err) {
    // Silent-fail total : le logging ne doit JAMAIS casser le pipeline.
    console.error("[llm-usage] Échec écriture log :", err);
  }
}

/**
 * Helper pour extraire le champ `usage` d'une réponse Anthropic typée.
 * Permet au caller de ne pas importer le type `Anthropic.Message` à chaque
 * appel du log.
 */
export function extractUsage(response: Anthropic.Message): UsageStats {
  return {
    input_tokens: response.usage?.input_tokens ?? 0,
    output_tokens: response.usage?.output_tokens ?? 0,
    // Cast car ces champs existent dans les réponses SDK récentes mais peuvent
    // ne pas être typés dans toutes les versions.
    cache_read_input_tokens:
      (response.usage as unknown as { cache_read_input_tokens?: number })?.cache_read_input_tokens ?? 0,
    cache_creation_input_tokens:
      (response.usage as unknown as { cache_creation_input_tokens?: number })?.cache_creation_input_tokens ?? 0,
  };
}
