// ───────────────────────────────────────────────────────────────────
// Image Storage — Replit Object Storage + GCS Signed URLs
//
// Upload les images Instagram dans Replit Object Storage (GCS),
// puis genere des signed URLs GCS directes accessibles 24/7,
// meme si le Repl dort.
//
// Architecture :
// 1. Upload via @replit/object-storage (auth automatique, pas de config)
// 2. Signed URL via @google-cloud/storage (meme bucket GCS, auth ADC)
// 3. Fallback : URL via route Next.js /api/social/stored-image
//
// La signed URL a une duree de vie de 7 jours — largement suffisant
// car les posts Instagram sont publies dans les 24h suivant la
// generation.
//
// Secrets Replit necessaires :
//   GCS_BUCKET_NAME — Nom du bucket GCS Replit Object Storage
//                     (visible dans .replit [objectStorage] defaultBucketID
//                      ou Settings > Object Storage > Bucket ID)
// ───────────────────────────────────────────────────────────────────

// Import dynamique pour eviter un crash si le module n'est pas disponible
// (standalone build ou environnement hors Replit)
let storageClient: any = null; // eslint-disable-line
let gcsStorage: any = null; // eslint-disable-line

/**
 * Initialise le client Replit Object Storage (singleton).
 * Retourne null si l'environnement ne supporte pas Object Storage.
 */
function getClient(): any {
  if (storageClient) return storageClient;

  try {
    // Import dynamique — ne crashe pas si @replit/object-storage n'est pas installe
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
 * Initialise le client Google Cloud Storage (singleton).
 * Sur Replit, l'auth GCS est automatique via Application Default Credentials.
 * Retourne null si le package n'est pas installe ou si la config manque.
 */
function getGcsStorage(): any {
  if (gcsStorage) return gcsStorage;

  try {
    const { Storage } = require("@google-cloud/storage"); // eslint-disable-line
    gcsStorage = new Storage();
    return gcsStorage;
  } catch (error) {
    console.warn(
      "[image-storage] @google-cloud/storage non disponible — fallback URL dynamique:",
      error instanceof Error ? error.message : error,
    );
    return null;
  }
}

/**
 * Genere une signed URL GCS pour un objet dans le bucket Replit.
 * La signed URL est accessible directement par Buffer, meme si le Repl dort.
 *
 * @param key - Cle de l'objet dans le bucket (ex: social-images/xxx.png)
 * @param expiresInDays - Duree de vie de l'URL en jours (defaut 7)
 * @returns Signed URL ou null si la generation echoue
 */
async function generateSignedUrl(
  key: string,
  expiresInDays = 7,
): Promise<string | null> {
  const storage = getGcsStorage();
  if (!storage) return null;

  const bucketName = process.env.GCS_BUCKET_NAME;
  if (!bucketName) {
    console.warn(
      "[image-storage] GCS_BUCKET_NAME non configure. " +
      "Ajoute le Bucket ID de Replit Object Storage dans les Secrets Replit " +
      "(visible dans Settings > Object Storage ou .replit [objectStorage] defaultBucketID).",
    );
    return null;
  }

  try {
    const options = {
      version: "v4" as const,
      action: "read" as const,
      expires: Date.now() + expiresInDays * 24 * 60 * 60 * 1000,
    };

    const [url] = await storage
      .bucket(bucketName)
      .file(key)
      .getSignedUrl(options);

    return url;
  } catch (error) {
    console.error(
      `[image-storage] Erreur generation signed URL pour ${key}:`,
      error instanceof Error ? error.message : error,
    );
    return null;
  }
}

/**
 * Construit une URL de fallback via la route Next.js /api/social/stored-image.
 * Utilisee si la generation de signed URL GCS echoue.
 * ATTENTION : cette URL necessite que le Repl soit actif.
 */
function buildFallbackUrl(key: string): string | null {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (siteUrl) {
    return `${siteUrl}/api/social/stored-image?key=${encodeURIComponent(key)}`;
  }

  const replSlug = process.env.REPL_SLUG || "";
  const replOwner = process.env.REPL_OWNER || "";
  if (replSlug && replOwner) {
    return `https://${replSlug}.${replOwner}.repl.co/api/social/stored-image?key=${encodeURIComponent(key)}`;
  }

  const devDomain = process.env.REPLIT_DEV_DOMAIN;
  if (devDomain) {
    return `https://${devDomain}/api/social/stored-image?key=${encodeURIComponent(key)}`;
  }

  return null;
}

/**
 * Upload un PNG dans Replit Object Storage et retourne une URL directe.
 *
 * Strategie d'URL (par ordre de priorite) :
 * 1. Signed URL GCS — accessible 24/7, meme si le Repl dort (7 jours)
 * 2. Fallback URL Next.js — necessite que le Repl soit actif
 *
 * @param postId - ID du SocialPost (utilise comme cle de stockage)
 * @param pngBuffer - Buffer PNG a uploader
 * @param slide - Index de slide pour les carousel (defaut 0)
 * @returns URL de l'image (signed GCS ou fallback), ou null si l'upload echoue
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

    // 1. Essayer de generer une signed URL GCS directe (accessible 24/7)
    const signedUrl = await generateSignedUrl(key);
    if (signedUrl) {
      console.log(`[image-storage] Image uploadee avec signed URL GCS: ${key}`);
      return signedUrl;
    }

    // 2. Fallback : URL via route Next.js (necessite que le Repl soit actif)
    const fallbackUrl = buildFallbackUrl(key);
    if (fallbackUrl) {
      console.warn(
        `[image-storage] Signed URL GCS indisponible — fallback URL dynamique: ${key}. ` +
        "Configure GCS_BUCKET_NAME et installe @google-cloud/storage pour des URLs 24/7.",
      );
      return fallbackUrl;
    }

    console.warn("[image-storage] Aucune URL disponible pour servir l'image");
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
 * Recupere une image depuis Replit Object Storage.
 *
 * @param key - Cle de stockage
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
    // Silencieux — pas grave si la suppression echoue
  }
}
