/**
 * Jeton de réinitialisation du mot de passe (s16, reco 15).
 * Le jeton en clair ne vit que dans le lien envoyé par e-mail ; la base
 * (`VerificationToken.token`) ne stocke que son empreinte SHA-256. Une fuite
 * de la base ne permet donc pas de réinitialiser un mot de passe.
 */
import { createHash, randomBytes } from "crypto";

export const RESET_TOKEN_TTL_MS = 60 * 60 * 1000; // 1 heure

export function generateResetToken(): string {
  return randomBytes(32).toString("hex");
}

export function hashResetToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}
