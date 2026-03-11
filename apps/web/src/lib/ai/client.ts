import Anthropic from "@anthropic-ai/sdk";

// Client Anthropic partagé — singleton pour tous les agents
export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

/**
 * Appel à l'API Anthropic avec retry et backoff exponentiel.
 * Retente jusqu'à 3 fois en cas d'erreur réseau, 5xx ou 429 (rate limit).
 */
export async function callWithRetry(
  params: Parameters<typeof anthropic.messages.create>[0],
  maxRetries = 2
): Promise<Anthropic.Message> {
  let lastError: unknown;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await anthropic.messages.create(params);
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
