import Anthropic from "@anthropic-ai/sdk";
import { logLLMUsage, extractUsage } from "./usage-log";
// Import dynamique côté callWithRetry pour éviter la dépendance circulaire
// (failure-alert.ts importe LlmRefusalError depuis ce fichier).

// Client Anthropic partagé — singleton pour tous les agents
export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

/**
 * Modèle Sonnet centralisé — source de vérité pour TOUS les agents.
 *
 * Pointer ici le dernier Sonnet stable utilisé en prod. Modifier cette
 * constante migre d'un coup tous les agents qui l'importent (au lieu de
 * chasser les `"claude-sonnet-4-20250514"` hardcodés dans chaque fichier).
 *
 * Incident s11 : `claude-sonnet-4-20250514` a été retiré par Anthropic le
 * 15/06/2026 → toute la génération (vannes, conseils, blog, social, vidéos)
 * échouait silencieusement depuis. Migré vers Claude Sonnet 5.5
 * (`claude-sonnet-5-5`, $2/$10 par MTok). Haiku n'est plus utilisé : le
 * triage CEO et la validation Director passent par Sonnet 5.5 en effort `low`.
 *
 * Différences d'API gérées centralement dans `callWithRetry` :
 * - réflexion adaptative toujours active → la réponse peut commencer par un
 *   bloc `thinking` : lire le texte via `getResponseText()` (par type, jamais
 *   `content[0]`) ;
 * - la réflexion compte dans `max_tokens` → marge ajoutée automatiquement ;
 * - effort explicite (défaut `low`, recommandé pour la génération de contenu) ;
 * - `stop_reason: "refusal"` → `LlmRefusalError` (non retentée).
 *
 * Surcharge sans redéploiement de code : secret Replit `ANTHROPIC_SONNET_MODEL`
 * (ex. au prochain retrait, cf. https://platform.claude.com/docs/en/about-claude/model-deprecations).
 *
 * Usage :
 *   import { SONNET_MODEL } from "@/lib/ai/client";
 *   await callWithRetry({ model: SONNET_MODEL, ... });
 */
export const SONNET_MODEL =
  process.env.ANTHROPIC_SONNET_MODEL?.trim() || "claude-sonnet-5-5";

/** Modèle Opus centralisé (rapport hebdo CEO). Surcharge : `ANTHROPIC_OPUS_MODEL`. */
export const OPUS_MODEL =
  process.env.ANTHROPIC_OPUS_MODEL?.trim() || "claude-opus-5-5";

type Effort = NonNullable<Anthropic.OutputConfig["effort"]>;
const EFFORTS: readonly Effort[] = ["low", "medium", "high", "xhigh", "max"];

/**
 * Effort par défaut appliqué aux appels qui n'en précisent pas.
 * `low` = point de départ recommandé pour la génération de contenu
 * (réflexion courte, sautée sur les requêtes simples). Surcharge globale :
 * secret `ANTHROPIC_EFFORT` ; surcharge par appel : `output_config.effort`.
 */
export const DEFAULT_EFFORT: Effort = EFFORTS.includes(
  process.env.ANTHROPIC_EFFORT?.trim() as Effort,
)
  ? (process.env.ANTHROPIC_EFFORT!.trim() as Effort)
  : "low";

/**
 * Marge de tokens ajoutée à `max_tokens` pour la réflexion (qui compte dans
 * `max_tokens` même quand son texte n'est pas renvoyé). Sans cette marge, une
 * réponse JSON pourrait être tronquée. Les tokens non générés ne sont pas facturés.
 */
export const THINKING_HEADROOM_TOKENS = 4000;

/** Le modèle a décliné la requête (`stop_reason: "refusal"`). Non retentée. */
export class LlmRefusalError extends Error {
  constructor(public readonly category: string | null) {
    super(`LLM refusal${category ? ` (${category})` : ""}`);
    this.name = "LlmRefusalError";
  }
}

/**
 * Applique les réglages propres aux modèles actuels : effort explicite et
 * marge de réflexion dans `max_tokens`. N'écrase jamais un effort fourni.
 */
export function applyModelDefaults(
  params: Anthropic.MessageCreateParamsNonStreaming,
): Anthropic.MessageCreateParamsNonStreaming {
  return {
    ...params,
    max_tokens: params.max_tokens + THINKING_HEADROOM_TOKENS,
    output_config: {
      ...params.output_config,
      effort: params.output_config?.effort ?? DEFAULT_EFFORT,
    },
  };
}

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
 * Construit un bloc `system` cacheable pour l'API Anthropic.
 *
 * Usage : wrapper un prompt STABLE (identité agent, règles métier, exemples
 * qui ne changent jamais d'un appel à l'autre) pour bénéficier du prompt
 * caching Anthropic (jusqu'à -90% sur les tokens input facturés).
 *
 * **Règles d'or** :
 * 1. Ne cacher QUE le contenu qui ne varie pas entre appels. Tout ce qui est
 *    variable (persona du jour, contexte, items récents) doit rester dans un
 *    deuxième bloc non caché OU dans `messages`.
 * 2. Le bloc caché doit être au MOINS 1024 tokens (Sonnet/Opus) ou
 *    2048 tokens (Haiku), sinon Anthropic n'applique pas le cache.
 * 3. L'ordre compte : le bloc caché doit être EN PREMIER dans le tableau.
 *
 * Exemple :
 * ```ts
 * system: [
 *   buildCachedSystemBlock(buildAgentIdentity()), // stable, ~1500 tokens
 *   { type: "text", text: dynamicContext },        // variable, non caché
 * ]
 * ```
 */
export function buildCachedSystemBlock(text: string): Anthropic.TextBlockParam {
  return { type: "text", text, cache_control: { type: "ephemeral" } };
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
  const request = applyModelDefaults(params);

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await anthropic.messages.create(request);

      // Refus du modèle : HTTP 200 mais pas de contenu exploitable. Tokens
      // facturés → loggés, puis erreur non retentable (même requête = même refus).
      if (response.stop_reason === "refusal") {
        const refusal = new LlmRefusalError(response.stop_details?.category ?? null);
        if (meta) {
          void logLLMUsage({
            agent: meta.agent,
            fn: meta.fn,
            model: params.model,
            usage: extractUsage(response),
            durationMs: Date.now() - startedAt,
            success: false,
            errorMessage: refusal.message,
          });
        }
        throw refusal;
      }

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
      if (!isRetryable || attempt === maxRetries) {
        // Alerte admin sur panne structurelle non-retryable (modèle retiré,
        // auth cassée, quota épuisé). `notifyLLMFailure` filtre lui-même :
        // silent-fail, throttlé 24h par type, et ignore les LlmRefusalError.
        // Import dynamique pour couper la dépendance circulaire client.ts
        // ↔ failure-alert.ts (qui importe LlmRefusalError d'ici).
        void import("./failure-alert").then(({ notifyLLMFailure }) =>
          notifyLLMFailure({
            error,
            model: params.model,
            agent: meta?.agent,
            fn: meta?.fn,
          }),
        ).catch(() => {
          /* silent-fail final — l'alerte ne doit jamais casser le pipeline */
        });
        break;
      }

      // Backoff exponentiel avec jitter pour éviter le thundering herd
      const baseDelay = Math.pow(2, attempt + 1) * 1000; // 2s, 4s
      const jitter = Math.random() * 500;
      await new Promise((resolve) => setTimeout(resolve, baseDelay + jitter));
    }
  }

  // Logging échec : si meta fourni, on enregistre un row success=false pour
  // tracker les retries coûteux (avec message d'erreur). Ces rows n'ont pas
  // de tokens car l'appel n'a jamais abouti. (Un refus est déjà loggé avec
  // ses tokens réels ci-dessus.)
  if (meta && !(lastError instanceof LlmRefusalError)) {
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
  // Lire par type, jamais par position : avec la réflexion adaptative, la
  // réponse peut commencer par un (ou plusieurs) bloc(s) `thinking`.
  return response.content
    .filter((block): block is Anthropic.TextBlock => block.type === "text")
    .map((block) => block.text)
    .join("");
}
