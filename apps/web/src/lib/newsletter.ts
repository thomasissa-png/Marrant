import { randomBytes } from "crypto";

/** Génère un token opaque URL-safe (32 octets → 43 caractères base64url). */
export function generateOpaqueToken(): string {
  return randomBytes(32).toString("base64url");
}

/** Jeton plausible (longueur bornée) avant toute lecture en base. */
export function isPlausibleToken(token: string | null | undefined): token is string {
  const t = token?.trim();
  return Boolean(t && t.length >= 20 && t.length <= 128 && /^[A-Za-z0-9_-]+$/.test(t));
}

function base(baseUrl: string): string {
  return baseUrl.replace(/\/$/, "");
}

/**
 * Lien de confirmation (double opt-in) envoyé par e-mail : ouvre `/lettre/confirmer` avec
 * un bouton « Confirmer mon adresse » (POST). Un scanner de liens qui suit le
 * lien (GET) ne confirme rien (spec s21 §7.2 point 10).
 * `token` est retiré des URL envoyées à Umami (`lib/umami-before-send.ts`).
 */
export function buildConfirmUrl(baseUrl: string, token: string): string {
  return `${base(baseUrl)}/lettre/confirmer?token=${encodeURIComponent(token)}`;
}

/** Lien de désinscription du CORPS de l'e-mail : page avec bouton (POST, @legal L5). */
export function buildUnsubscribeUrl(baseUrl: string, token: string): string {
  return `${base(baseUrl)}/lettre/desinscrire?token=${encodeURIComponent(token)}`;
}

/** Cible des en-têtes `List-Unsubscribe` / `List-Unsubscribe-Post` (RFC 8058, POST en un clic). */
export function buildOneClickUnsubscribeUrl(baseUrl: string, token: string): string {
  return `${base(baseUrl)}/api/newsletter/unsubscribe/${encodeURIComponent(token)}`;
}

/** Route POST de confirmation (bouton de la page /lettre). */
export function confirmActionPath(token: string): string {
  return `/api/newsletter/confirm/${encodeURIComponent(token)}`;
}

/** URL publique du site pour les liens d'e-mail. */
export function siteBaseUrl(): string {
  return process.env.NEXTAUTH_URL || "https://deviens-marrant.fr";
}
