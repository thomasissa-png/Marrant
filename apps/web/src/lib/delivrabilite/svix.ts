/**
 * Vérification des signatures Svix (webhooks Resend), sans dépendance : 25 lignes de
 * `node:crypto` valent mieux qu'un paquet de plus dans le Worker.
 *
 * Schéma Svix (identique pour tous les webhooks Resend) :
 *  - en-têtes `svix-id`, `svix-timestamp` (secondes Unix), `svix-signature` ;
 *  - contenu signé = `${svix-id}.${svix-timestamp}.${corps brut}` ;
 *  - HMAC-SHA256 en base64, clé = partie base64 du secret après `whsec_` ;
 *  - `svix-signature` = liste séparée par des espaces de `v1,<base64>` (rotation de
 *    secret : plusieurs signatures, une seule doit correspondre) ;
 *  - horodatage refusé au-delà de 5 minutes d'écart (anti-rejeu d'une capture ancienne).
 *
 * Chaque point de terminaison Resend a SON secret de signature (`whsec_…`, affiché dans
 * le tableau de bord du point de terminaison) : un secret par route.
 */
import { createHmac, timingSafeEqual } from "node:crypto";

/** Écart maximal accepté entre `svix-timestamp` et l'horloge du serveur. */
export const SVIX_TOLERANCE_S = 5 * 60;

export type ResultatSignature = "ok" | "secret-absent" | "en-tetes-absents" | "expiree" | "invalide";

/** Secret plausible : préfixe `whsec_`, partie base64 non vide, pas un gabarit. */
export function secretSvixValide(secret: string | undefined): secret is string {
  if (!secret) return false;
  const s = secret.trim();
  if (!s.startsWith("whsec_") || s.length < 20) return false;
  return !/\.\.\.|x{4,}|placeholder|changeme|your_/i.test(s);
}

export function verifierSignatureSvix(p: {
  corps: string;
  id: string | null;
  timestamp: string | null;
  signature: string | null;
  secret: string | undefined;
  maintenant?: Date;
}): ResultatSignature {
  if (!secretSvixValide(p.secret)) return "secret-absent";
  if (!p.id || !p.timestamp || !p.signature) return "en-tetes-absents";

  const ts = Number(p.timestamp);
  if (!Number.isInteger(ts)) return "invalide";
  const nowS = Math.floor((p.maintenant ?? new Date()).getTime() / 1000);
  if (Math.abs(nowS - ts) > SVIX_TOLERANCE_S) return "expiree";

  const cle = Buffer.from(p.secret.trim().slice("whsec_".length), "base64");
  if (cle.length === 0) return "secret-absent";
  const attendue = createHmac("sha256", cle).update(`${p.id}.${p.timestamp}.${p.corps}`).digest();

  for (const partie of p.signature.split(" ")) {
    const [version, valeur] = partie.split(",", 2);
    if (version !== "v1" || !valeur) continue;
    const fournie = Buffer.from(valeur, "base64");
    if (fournie.length === attendue.length && timingSafeEqual(fournie, attendue)) return "ok";
  }
  return "invalide";
}

/** Signature Svix d'un corps (tests, outils locaux). Jamais utilisée pour vérifier. */
export function signerSvix(corps: string, id: string, timestamp: number, secret: string): string {
  const cle = Buffer.from(secret.slice("whsec_".length), "base64");
  return `v1,${createHmac("sha256", cle).update(`${id}.${timestamp}.${corps}`).digest("base64")}`;
}
