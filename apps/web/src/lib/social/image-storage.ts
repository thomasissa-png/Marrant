// ───────────────────────────────────────────────────────────────────
// Image Storage — Replit Object Storage for Instagram images
//
// Pré-génère les images Instagram et les upload dans Replit Object
// Storage pour que Buffer puisse les télécharger à tout moment,
// même si le Repl dort.
//
// Fallback : si Object Storage n'est pas disponible, retourne null
// et le pipeline utilise l'URL dynamique /api/social/image.
// ───────────────────────────────────────────────────────────────────

// Import dynamique pour éviter un crash si le module n'est pas disponible
// (standalone build ou environnement hors Replit)
let storageClient: any = null; // eslint-disable-line

/**
 * Initialise le client Object Storage (singleton).
 * Retourne null si l'environnement ne supporte pas Object Storage.
 */
function getClient(): any {
  if (storageClient) return storageClient;

  try {
    // Import dynamique — ne crashe pas si @replit/object-storage n'est pas installé
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
 * Upload un PNG dans Replit Object Storage.
 *
 * @param postId - ID du SocialPost (utilisé comme clé de stockage)
 * @param pngBuffer - Buffer PNG à uploader
 * @param slide - Index de slide pour les carousel (défaut 0)
 * @returns URL publique de l'image, ou null si l'upload échoue
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

    // Replit Object Storage sert les fichiers via une URL publique
    // Format : https://<repl-slug>.<user>.repl.co/object-storage/<key>
    // Mais on utilise l'API Object Storage pour générer l'URL
    const replSlug = process.env.REPL_SLUG || "";
    const replOwner = process.env.REPL_OWNER || "";

    if (replSlug && replOwner) {
      const url = `https://${replSlug}.${replOwner}.repl.co/api/social/stored-image?key=${encodeURIComponent(key)}`;
      console.log(`[image-storage] Image uploadée: ${key} → ${url}`);
      return url;
    }

    // Fallback: utiliser NEXT_PUBLIC_SITE_URL
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
    if (siteUrl) {
      const url = `${siteUrl}/api/social/stored-image?key=${encodeURIComponent(key)}`;
      console.log(`[image-storage] Image uploadée: ${key} → ${url}`);
      return url;
    }

    // Dernier recours : Replit dev domain
    const devDomain = process.env.REPLIT_DEV_DOMAIN;
    if (devDomain) {
      const url = `https://${devDomain}/api/social/stored-image?key=${encodeURIComponent(key)}`;
      console.log(`[image-storage] Image uploadée: ${key} → ${url}`);
      return url;
    }

    console.warn("[image-storage] Aucune URL publique disponible pour servir l'image");
    return null;
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
 *
 * @param key - Clé de stockage
 * @returns Buffer PNG ou null si introuvable
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
 *
 * @param postId - ID du SocialPost
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
