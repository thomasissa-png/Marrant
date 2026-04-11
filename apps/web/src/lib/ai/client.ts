import Anthropic from "@anthropic-ai/sdk";
import { logLLMUsage, extractUsage } from "./usage-log";

// Client Anthropic partagé — singleton pour tous les agents
export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

/**
 * Métadonnées d'instrumentation attachées à un appel LLM.
 * Passer cet objet à `callWithRetry` pour que le coût de l'appel soit
 * enregistré dans `LlmUsageLog` avec le nom de l'agent et de la fonction
 * appelante (utilisé pour l'agrégation par `/api/admin/llm-usage`).
 */
export interface CallMeta {
  agent: string;
  fn: string;
}

/**
 * Appel à l'API Anthropic avec retry, backoff exponentiel et logging tokens.
 *
 * Retente jusqu'à 3 fois en cas d'erreur réseau, 5xx ou 429 (rate limit).
 *
 * Si `meta` est fourni, chaque appel (réussi OU échoué) est enregistré dans
 * `LlmUsageLog` avec les tokens facturés et le coût USD calculé. Le logging
 * est **silent-fail** : une erreur d'écriture DB ne bloquera pas le pipeline.
 *
 * Rétro-compatible : `meta` est optionnel — les call sites existants sans
 * instrumentation continuent de fonctionner (sans logging).
 */
export async function callWithRetry(
  params: Anthropic.MessageCreateParamsNonStreaming,
  maxRetries = 2,
  meta?: CallMeta,
): Promise<Anthropic.Message> {
  let lastError: unknown;
  const startedAt = Date.now();

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await anthropic.messages.create(params);

      // Logging succès : on capture les tokens facturés (input/output + cache).
      // Silent-fail : une erreur d'écriture ne doit pas casser le pipeline.
      if (meta) {
        void logLLMUsage({
          agent: meta.agent,
          fn: meta.fn,
          model: params.model,
          usage: extractUsage(response),
          durationMs: Date.now() - startedAt,
          success: true,
        });
      }

      return response;
    } catch (error) {
      lastError = error;

      // Vérifier si l'erreur est retryable
      const isRetryable = isRetryableError(error);
      if (!isRetryable || attempt === maxRetries) break;

      // Backoff exponentiel avec jitter pour éviter le thundering herd
      const baseDelay = Math.pow(2, attempt + 1) * 1000; // 2s, 4s
      const jitter = Math.random() * 500;
      await new Promise((resolve) => setTimeout(resolve, baseDelay + jitter));
    }
  }

  // Logging échec : si meta fourni, on enregistre un row success=false pour
  // tracker les retries coûteux (avec message d'erreur). Ces rows n'ont pas
  // de tokens car l'appel n'a jamais abouti.
  if (meta) {
    void logLLMUsage({
      agent: meta.agent,
      fn: meta.fn,
      model: params.model,
      usage: { input_tokens: 0, output_tokens: 0 },
      durationMs: Date.now() - startedAt,
      success: false,
      errorMessage: lastError instanceof Error ? lastError.message : String(lastError),
    });
  }

  throw lastError;
}

function isRetryableError(error: unknown): boolean {
  if (!(error instanceof Error)) return false;
  const msg = error.message;

  // Erreurs réseau
  if (msg.includes("fetch") || msg.includes("network") || msg.includes("ECONNRESET") ||
      msg.includes("ETIMEDOUT") || msg.includes("ECONNREFUSED") || msg.includes("EHOSTUNREACH")) {
    return true;
  }

  // Erreurs HTTP retryables
  if (msg.includes("429") || msg.includes("500") || msg.includes("502") ||
      msg.includes("503") || msg.includes("529")) {
    return true;
  }

  // Vérifier le code de statut si disponible (Anthropic SDK)
  if ("status" in error && typeof (error as { status: unknown }).status === "number") {
    const status = (error as { status: number }).status;
    return status === 429 || status >= 500;
  }

  return false;
}

/**
 * Extrait le premier objet JSON valide d'une chaîne.
 * Utilise un parser à compteur de accolades pour gérer le JSON imbriqué.
 */
export function extractJson<T>(text: string): T {
  const startIdx = text.indexOf("{");
  if (startIdx === -1) throw new Error("Réponse JSON invalide : aucun objet trouvé");

  let depth = 0;
  let inString = false;
  let escaped = false;

  for (let i = startIdx; i < text.length; i++) {
    const char = text[i];

    if (escaped) {
      escaped = false;
      continue;
    }

    if (char === "\\") {
      escaped = true;
      continue;
    }

    if (char === '"') {
      inString = !inString;
      continue;
    }

    if (inString) continue;

    if (char === "{") depth++;
    else if (char === "}") {
      depth--;
      if (depth === 0) {
        return JSON.parse(text.slice(startIdx, i + 1)) as T;
      }
    }
  }

  throw new Error("Réponse JSON invalide : objet JSON incomplet");
}

/**
 * Extrait le premier tableau JSON valide d'une chaîne.
 * Utilise un parser à compteur de crochets pour gérer le JSON imbriqué.
 */
export function extractJsonArray<T>(text: string): T[] {
  const startIdx = text.indexOf("[");
  if (startIdx === -1) throw new Error("Réponse JSON invalide : aucun tableau trouvé");

  let depth = 0;
  let inString = false;
  let escaped = false;

  for (let i = startIdx; i < text.length; i++) {
    const char = text[i];

    if (escaped) {
      escaped = false;
      continue;
    }

    if (char === "\\") {
      escaped = true;
      continue;
    }

    if (char === '"') {
      inString = !inString;
      continue;
    }

    if (inString) continue;

    if (char === "[") depth++;
    else if (char === "]") {
      depth--;
      if (depth === 0) {
        return JSON.parse(text.slice(startIdx, i + 1)) as T[];
      }
    }
  }

  throw new Error("Réponse JSON invalide : tableau JSON incomplet");
}

/**
 * Extrait le texte d'une réponse Anthropic (null-safe).
 */
export function getResponseText(response: Anthropic.Message): string {
  if (!response.content?.length) return "";
  return response.content[0].type === "text" ? response.content[0].text : "";
}
