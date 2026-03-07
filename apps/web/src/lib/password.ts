import { randomBytes, scryptSync, timingSafeEqual } from "crypto";

/**
 * Hash un mot de passe avec scrypt (alternative native à bcrypt)
 */
export async function hash(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const derivedKey = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${derivedKey}`;
}

/**
 * Vérifie un mot de passe contre son hash
 */
export async function verify(
  password: string,
  storedHash: string
): Promise<boolean> {
  const [salt, key] = storedHash.split(":");
  if (!salt || !key) return false;
  const derivedKey = scryptSync(password, salt, 64);
  const keyBuffer = Buffer.from(key, "hex");
  return timingSafeEqual(derivedKey, keyBuffer);
}
