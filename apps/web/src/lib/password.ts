import { randomBytes, scrypt, timingSafeEqual } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

// N=32768 (2^15), r=8, p=1 — renforcé vs défaut Node.js (N=16384)
// maxmem relevé pour supporter N élevé (128 * N * r = 32 Mo)
const SCRYPT_OPTIONS = { N: 32768, r: 8, p: 1, maxmem: 64 * 1024 * 1024 };
const KEY_LENGTH = 64;

/**
 * Hash un mot de passe avec scrypt (async, ne bloque pas l'event loop)
 */
export async function hash(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const derivedKey = (await scryptAsync(password, salt, KEY_LENGTH, SCRYPT_OPTIONS)) as Buffer;
  return `${salt}:${derivedKey.toString("hex")}`;
}

/**
 * Vérifie un mot de passe contre son hash (async)
 */
export async function verify(
  password: string,
  storedHash: string
): Promise<boolean> {
  const [salt, key] = storedHash.split(":");
  if (!salt || !key) return false;
  const derivedKey = (await scryptAsync(password, salt, KEY_LENGTH, SCRYPT_OPTIONS)) as Buffer;
  const keyBuffer = Buffer.from(key, "hex");
  if (derivedKey.length !== keyBuffer.length) return false;
  return timingSafeEqual(derivedKey, keyBuffer);
}
