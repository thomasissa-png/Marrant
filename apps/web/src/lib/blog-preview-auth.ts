/**
 * Autorisation de l'aperçu blog (`/blog/apercu/[slug]`).
 *
 * Accès par ADMIN_PASSWORD, deux voies :
 *  - `Authorization: Bearer <ADMIN_PASSWORD>` (script de captures, curl) ;
 *  - `?cle=<ADMIN_PASSWORD>` : le middleware pose un cookie signé de 2 h puis
 *    redirige sans le paramètre. Le cookie ne contient pas le mot de passe :
 *    `<expiration>.<HMAC-SHA256(ADMIN_PASSWORD, "blog-apercu:<expiration>")>`.
 *
 * Web Crypto uniquement (middleware edge et runtime Node). Comparaisons en temps
 * constant : SHA-256 des deux côtés puis XOR, la longueur saisie ne fuit pas.
 */
import { BLOG_PREVIEW_MAX_AGE_S } from "@/config/blog-preview";

function utf8(value: string) {
  return new TextEncoder().encode(value);
}

function adminPassword(): string | null {
  const value = process.env.ADMIN_PASSWORD;
  // Mot de passe absent ou vide : l'aperçu reste fermé (jamais ouvert par défaut).
  return value && value.trim() ? value : null;
}

async function sha256(value: string): Promise<Uint8Array> {
  return new Uint8Array(await crypto.subtle.digest("SHA-256", utf8(value)));
}

/** Égalité de deux chaînes en temps constant (indépendant de la longueur saisie). */
export async function safeEqual(provided: string, expected: string): Promise<boolean> {
  const [a, b] = await Promise.all([sha256(provided), sha256(expected)]);
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}

/** Vrai si `candidate` est ADMIN_PASSWORD (faux si la variable est absente). */
export async function isAdminPassword(candidate: string | null | undefined): Promise<boolean> {
  const expected = adminPassword();
  if (!expected || !candidate) return false;
  return safeEqual(candidate, expected);
}

/** Mot de passe extrait de `Authorization: Bearer …`, sinon null. */
export function bearerToken(authorization: string | null | undefined): string | null {
  const match = /^Bearer\s+(.+)$/i.exec(authorization?.trim() ?? "");
  return match ? match[1].trim() : null;
}

async function sign(exp: number, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    utf8(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const mac = new Uint8Array(await crypto.subtle.sign("HMAC", key, utf8(`blog-apercu:${exp}`)));
  return Array.from(mac, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

/** Valeur du cookie d'aperçu, valable BLOG_PREVIEW_MAX_AGE_S. Null si ADMIN_PASSWORD absent. */
export async function createPreviewToken(now: number = Date.now()): Promise<string | null> {
  const secret = adminPassword();
  if (!secret) return null;
  const exp = Math.floor(now / 1000) + BLOG_PREVIEW_MAX_AGE_S;
  return `${exp}.${await sign(exp, secret)}`;
}

/** Vrai si le cookie est signé avec l'ADMIN_PASSWORD courant et non expiré. */
export async function isValidPreviewToken(
  token: string | null | undefined,
  now: number = Date.now(),
): Promise<boolean> {
  const secret = adminPassword();
  if (!secret || !token) return false;
  const match = /^(\d{1,12})\.([0-9a-f]{64})$/.exec(token);
  if (!match) return false;
  const exp = Number(match[1]);
  if (exp * 1000 <= now) return false;
  return safeEqual(match[2], await sign(exp, secret));
}

/** Autorisation d'une requête d'aperçu : Bearer valide OU cookie signé valide. */
export async function isPreviewAuthorized(input: {
  authorization?: string | null;
  cookie?: string | null;
}): Promise<boolean> {
  if (await isAdminPassword(bearerToken(input.authorization))) return true;
  return isValidPreviewToken(input.cookie);
}
