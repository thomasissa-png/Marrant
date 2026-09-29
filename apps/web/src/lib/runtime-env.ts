/**
 * Détection du runtime d'exécution (migration Cloudflare, étape B).
 *
 * - Replit / Node (`next start`, standalone) : `navigator` est absent (Node < 21)
 *   ou vaut "Node.js/<version>" (Node ≥ 21) → false.
 * - Cloudflare Workers (workerd, via OpenNext) : `navigator.userAgent` vaut
 *   exactement "Cloudflare-Workers" → true.
 *
 * Sans effet de bord, utilisable au niveau module (pas besoin du contexte de requête).
 */
export function isCloudflareWorkers(): boolean {
  return (
    typeof navigator !== "undefined" &&
    typeof navigator.userAgent === "string" &&
    navigator.userAgent === "Cloudflare-Workers"
  );
}
