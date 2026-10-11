import { randomBytes } from "crypto";

/** Génère un token opaque URL-safe (32 octets → 43 caractères base64url). */
export function generateOpaqueToken(): string {
  return randomBytes(32).toString("base64url");
}

/** URL de confirmation (double opt-in). */
export function buildConfirmUrl(baseUrl: string, token: string): string {
  return `${baseUrl.replace(/\/$/, "")}/api/newsletter/confirm/${encodeURIComponent(token)}`;
}

/** URL de désinscription. */
export function buildUnsubscribeUrl(baseUrl: string, token: string): string {
  return `${baseUrl.replace(/\/$/, "")}/api/newsletter/unsubscribe/${encodeURIComponent(token)}`;
}

