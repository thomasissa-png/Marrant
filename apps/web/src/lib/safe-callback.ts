/**
 * Sanitize a callbackUrl passed via query string.
 *
 * Anti open-redirect: n'autorise QUE les chemins relatifs internes
 * (commencent par "/" et ne contiennent ni scheme, ni protocol-relative "//",
 * ni caractères de contrôle). Sinon renvoie null.
 *
 * Utilisé par les pages d'auth (register, login) pour respecter le retour
 * demandé par l'utilisateur sans risque de redirection externe.
 */
export function sanitizeCallbackUrl(raw: string | null | undefined): string | null {
  if (!raw || typeof raw !== "string") return null;
  if (raw.length === 0 || raw.length > 512) return null;
  // Refuser caractères de contrôle / whitespace non-visible AVANT trim
  // (sinon `\n` en fin de chaîne serait avalé silencieusement)
  if (/[\u0000-\u001F\u007F]/.test(raw)) return null;

  const trimmed = raw.trim();
  if (trimmed.length === 0) return null;

  // Refuser protocol-relative (//evil.com) et absolute URL (http://..., javascript:...)
  if (trimmed.startsWith("//")) return null;
  if (!trimmed.startsWith("/")) return null;
  // Refuser tout ce qui ressemble à un scheme
  if (/^\/+[a-z][a-z0-9+.-]*:/i.test(trimmed)) return null;
  // Refuser \\evil.com (Windows-style)
  if (trimmed.includes("\\")) return null;

  return trimmed;
}

/**
 * Résout la destination post-authentification.
 *
 * Priorité :
 * 1. callbackUrl sûr (fourni par le lien d'invitation ou une CTA guardée)
 * 2. fallback (par défaut "/onboarding" pour l'inscription)
 */
export function resolvePostAuthRedirect(
  rawCallback: string | null | undefined,
  fallback: string,
): string {
  return sanitizeCallbackUrl(rawCallback) ?? fallback;
}
