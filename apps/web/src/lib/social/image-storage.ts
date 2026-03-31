// ───────────────────────────────────────────────────────────────────
// Image Storage — Replit Object Storage
//
// Upload les images Instagram dans Replit Object Storage,
// puis retourne une URL publique via la route /api/social/stored-image.
//
// Le Repl doit être en mode "Always On" pour que Buffer puisse
// télécharger les images à tout moment.
// ───────────────────────────────────────────────────────────────────

// Import dynamique pour eviter un crash si le module n'est pas disponible
let storageClient: any = null; // eslint-disable-line

/**
 * Initialise le client Replit Object Storage (singleton).
 */
function getClient(): any {
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
 * Le Repl doit être "Always On" pour que Buffer puisse y accéder.
 */
function buildImageUrl(key: string): string | null {
  // 1. URL du site custom (production)
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (siteUrl) {
    return `${siteUrl.replace(/\/$/, "")}/api/social/stored-image?key=${encodeURIComponent(key)}`;
  }

  // 2. Domaine dev Replit
  const devDomain = process.env.REPLIT_DEV_DOMAIN;
  if (devDomain) {
    return `https://${devDomain}/api/social/stored-image?key=${encodeURIComponent(key)}`;
  }

  // 3. Slug + owner Replit (legacy)
  const replSlug = process.env.REPL_SLUG || "";
  const replOwner = process.env.REPL_OWNER || "";
  if (replSlug && replOwner) {
    return `https://${replSlug}.${replOwner}.repl.co/api/social/stored-image?key=${encodeURIComponent(key)}`;
  }

  return null;
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
    if (imageUrl) {
      console.log(`[image-storage] Image uploadée: ${key} → ${imageUrl}`);
      return imageUrl;
    }

    console.warn("[image-storage] Aucune URL disponible (NEXT_PUBLIC_SITE_URL ou REPLIT_DEV_DOMAIN manquant)");
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
