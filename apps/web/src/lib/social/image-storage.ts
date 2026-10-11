// ───────────────────────────────────────────────────────────────────
// Image Storage — Replit Object Storage
//
// Upload les images Instagram dans Replit Object Storage,
// puis retourne une URL publique via la route /api/social/stored-image.
//
// Le Repl doit être en mode "Always On" pour que Buffer puisse
// télécharger les images à tout moment.
//
// Cloudflare Workers (migration étape B) : Replit Object Storage n'existe
// pas → bucket R2 lié au binding `SOCIAL_IMAGES` (mêmes clés
// `social-images/<postId>.png`, même URL publique). Sur Replit, le chemin
// ci-dessous est inchangé.
// ───────────────────────────────────────────────────────────────────

import { isCloudflareWorkers } from "@/lib/runtime-env";

/** Sous-ensemble de l'API R2Bucket utilisé ici (évite les types workerd globaux). */
interface R2BucketLike {
  put(key: string, value: ArrayBuffer | Uint8Array, options?: { httpMetadata?: { contentType?: string } }): Promise<unknown>;
  get(key: string): Promise<{ arrayBuffer(): Promise<ArrayBuffer> } | null>;
  delete(key: string): Promise<void>;
}

/**
 * Client de stockage compatible Workers : adapte le bucket R2 à la même
 * interface que le client Replit (uploadFromBytes / downloadAsBytes / delete).
 */
function getR2Client(): any { // eslint-disable-line
  try {
    const { getCloudflareContext } = require("@opennextjs/cloudflare") as typeof import("@opennextjs/cloudflare");
    const bucket = (getCloudflareContext().env as unknown as Record<string, unknown>).SOCIAL_IMAGES as
      | R2BucketLike
      | undefined;
    if (!bucket) {
      console.warn("[image-storage] Binding R2 SOCIAL_IMAGES absent — stockage indisponible.");
      return null;
    }
    return {
      uploadFromBytes: async (key: string, bytes: Buffer) => {
        await bucket.put(key, new Uint8Array(bytes), { httpMetadata: { contentType: "image/png" } });
        return { ok: true };
      },
      downloadAsBytes: async (key: string) => {
        const obj = await bucket.get(key);
        if (!obj) return { ok: false };
        return { ok: true, value: new Uint8Array(await obj.arrayBuffer()) };
      },
      delete: async (key: string) => {
        await bucket.delete(key);
        return { ok: true };
      },
    };
  } catch (error) {
    console.warn(
      "[image-storage] R2 non disponible:",
      error instanceof Error ? error.message : error,
    );
    return null;
  }
}

// Import dynamique pour eviter un crash si le module n'est pas disponible
let storageClient: any = null; // eslint-disable-line

/**
 * Initialise le client Replit Object Storage (singleton).
 */
function getClient(): any {
  // Workers : client R2 résolu à chaque appel (binding lié à la requête courante).
  if (isCloudflareWorkers()) return getR2Client();
  if (storageClient) return storageClient;

  try {
    const { Client } = require("@replit/object-storage"); // eslint-disable-line
    storageClient = new Client();
    return storageClient;
  } catch (error) {
    console.warn(
      "[image-storage] Replit Object Storage non disponible:",
      error instanceof Error ? error.message : error,
    );
    return null;
  }
}

/**
 * Construit l'URL publique de l'image via la route /api/social/stored-image.
 * Utilise le domaine de production en priorité.
 */
function buildImageUrl(key: string): string {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://deviens-marrant.fr";
  return `${siteUrl.replace(/\/$/, "")}/api/social/stored-image?key=${encodeURIComponent(key)}`;
}

/**
 * Upload un PNG dans Replit Object Storage et retourne une URL publique.
 *
 * @param postId - ID du SocialPost (utilisé comme clé de stockage)
 * @param pngBuffer - Buffer PNG à uploader
 * @param slide - Index de slide (défaut 0)
 * @returns URL de l'image ou null si l'upload échoue
 */
export async function uploadPostImage(
  postId: string,
  pngBuffer: Buffer,
  slide = 0,
): Promise<string | null> {
  const client = getClient();
  if (!client) return null;

  const key = slide > 0
    ? `social-images/${postId}_slide${slide}.png`
    : `social-images/${postId}.png`;

  try {
    await client.uploadFromBytes(key, pngBuffer);

    const imageUrl = buildImageUrl(key);
    console.log(`[image-storage] Image uploadée: ${key} → ${imageUrl}`);
    return imageUrl;
  } catch (error) {
    console.error(
      `[image-storage] Erreur upload ${key}:`,
      error instanceof Error ? error.message : error,
    );
    return null;
  }
}

/**
 * Récupère une image depuis Replit Object Storage.
 */
export async function getStoredImage(key: string): Promise<Buffer | null> {
  const client = getClient();
  if (!client) return null;

  try {
    const result = await client.downloadAsBytes(key);
    if (!result.ok) return null;
    return Buffer.from(result.value);
  } catch (error) {
    console.error(
      `[image-storage] Erreur lecture ${key}:`,
      error instanceof Error ? error.message : error,
    );
    return null;
  }
}

/**
 * Supprime une image de Replit Object Storage.
 */
export async function deletePostImage(postId: string): Promise<void> {
  const client = getClient();
  if (!client) return;

  try {
    await client.delete(`social-images/${postId}.png`);
  } catch {
    // Silencieux — pas grave si la suppression échoue
  }
}
