import Anthropic from "@anthropic-ai/sdk";

// Client Anthropic partagé — singleton pour tous les agents
export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

/**
 * Appel à l'API Anthropic avec retry et backoff exponentiel.
 * Retente jusqu'à 3 fois en cas d'erreur réseau ou 5xx.
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
      const isRetryable =
        error instanceof Error &&
        (error.message.includes("fetch") ||
          error.message.includes("network") ||
          error.message.includes("ECONNRESET") ||
          error.message.includes("500") ||
          error.message.includes("502") ||
          error.message.includes("503") ||
          error.message.includes("529"));

      if (!isRetryable || attempt === maxRetries) break;

      const delay = Math.pow(2, attempt + 1) * 1000; // 2s, 4s
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}

/**
 * Extrait le premier objet JSON valide d'une chaîne (non-greedy).
 */
export function extractJson<T>(text: string): T {
  const jsonMatch = text.match(/\{[\s\S]*?\}/);
  if (!jsonMatch) throw new Error("Réponse JSON invalide : aucun objet trouvé");
  return JSON.parse(jsonMatch[0]) as T;
}

/**
 * Extrait le premier tableau JSON valide d'une chaîne (non-greedy).
 */
export function extractJsonArray<T>(text: string): T[] {
  const jsonMatch = text.match(/\[[\s\S]*\]/);
  if (!jsonMatch) throw new Error("Réponse JSON invalide : aucun tableau trouvé");
  return JSON.parse(jsonMatch[0]) as T[];
}

/**
 * Extrait le texte d'une réponse Anthropic.
 */
export function getResponseText(response: Anthropic.Message): string {
  return response.content[0].type === "text" ? response.content[0].text : "";
}
