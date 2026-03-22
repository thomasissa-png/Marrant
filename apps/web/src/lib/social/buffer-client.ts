// ───────────────────────────────────────────────────────────────────
// Buffer GraphQL API Client — deviens-marrant.fr
//
// Remplace les clients Twitter/LinkedIn/Instagram directs.
// Buffer gère la publication sur toutes les plateformes via un seul token.
//
// API : GraphQL endpoint https://api.buffer.com
// Docs : https://developers.buffer.com
//
// Secrets Replit nécessaires :
//   BUFFER_ACCESS_TOKEN       — API token (Settings > API dans Buffer)
//   BUFFER_ORGANIZATION_ID    — ID de l'organisation Buffer
//   BUFFER_CHANNEL_TWITTER    — Channel ID du profil Twitter dans Buffer
//   BUFFER_CHANNEL_LINKEDIN   — Channel ID de la page LinkedIn dans Buffer
//   BUFFER_CHANNEL_INSTAGRAM  — Channel ID du profil Instagram dans Buffer (optionnel, phase 3)
// ───────────────────────────────────────────────────────────────────

const BUFFER_API = "https://api.buffer.com";

// ─── Types ──────────────────────────────────────────────────────

export type BufferPlatform = "TWITTER" | "LINKEDIN" | "INSTAGRAM";

interface BufferConfig {
  accessToken: string;
  organizationId: string;
}

export interface BufferChannel {
  id: string;
  name: string;
  displayName: string;
  service: string;
  avatar: string;
  isQueuePaused: boolean;
}

export interface BufferPostResult {
  id: string;
  text: string;
}

export interface BufferError {
  message: string;
}

// ─── Config ─────────────────────────────────────────────────────

function getConfig(): BufferConfig {
  const accessToken = process.env.BUFFER_ACCESS_TOKEN;
  const organizationId = process.env.BUFFER_ORGANIZATION_ID;

  if (!accessToken || !organizationId) {
    throw new Error(
      "Buffer API credentials manquantes. Configure BUFFER_ACCESS_TOKEN et BUFFER_ORGANIZATION_ID dans les Secrets Replit.",
    );
  }

  return { accessToken, organizationId };
}

/**
 * Retourne le Channel ID Buffer pour une plateforme donnée.
 */
function getChannelId(platform: BufferPlatform): string {
  const envMap: Record<BufferPlatform, string> = {
    TWITTER: "BUFFER_CHANNEL_TWITTER",
    LINKEDIN: "BUFFER_CHANNEL_LINKEDIN",
    INSTAGRAM: "BUFFER_CHANNEL_INSTAGRAM",
  };

  const channelId = process.env[envMap[platform]];
  if (!channelId) {
    throw new Error(
      `Channel Buffer non configuré pour ${platform}. Ajoute ${envMap[platform]} dans les Secrets Replit.`,
    );
  }

  return channelId;
}

// ─── GraphQL Helper ─────────────────────────────────────────────

async function bufferGraphQL<T>(
  query: string,
  accessToken?: string,
): Promise<T> {
  const token = accessToken || getConfig().accessToken;

  const response = await fetch(BUFFER_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ query }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    if (response.status === 401) {
      throw new Error(
        "Buffer token invalide (401). Vérifie BUFFER_ACCESS_TOKEN dans les Secrets Replit.",
      );
    }
    if (response.status === 403) {
      throw new Error(
        `Buffer accès refusé (403). Vérifie les permissions du token. Détails : ${errorText}`,
      );
    }
    throw new Error(`Buffer API error ${response.status}: ${errorText}`);
  }

  const data = await response.json();

  if (data.errors && data.errors.length > 0) {
    throw new Error(
      `Buffer GraphQL error: ${data.errors.map((e: { message: string }) => e.message).join(", ")}`,
    );
  }

  return data.data as T;
}

// ─── Quota Management ───────────────────────────────────────────

/**
 * Limite du plan gratuit Buffer : 10 posts schedulés par channel.
 * On garde une marge de 2 pour éviter les race conditions.
 */
const BUFFER_MAX_SCHEDULED = 10;
const BUFFER_SAFETY_MARGIN = 2;
const BUFFER_EFFECTIVE_LIMIT = BUFFER_MAX_SCHEDULED - BUFFER_SAFETY_MARGIN;

/**
 * Erreur spécifique quand la queue Buffer est pleine.
 * Permet au caller de distinguer "queue full" d'une erreur réseau/auth.
 */
export class BufferQueueFullError extends Error {
  public readonly currentCount: number;
  public readonly platform: BufferPlatform;

  constructor(platform: BufferPlatform, currentCount: number, slotsNeeded: number) {
    super(
      `Buffer queue pleine pour ${platform}: ${currentCount}/${BUFFER_MAX_SCHEDULED} slots occupés, ${slotsNeeded} demandé(s). Réessayer plus tard.`,
    );
    this.name = "BufferQueueFullError";
    this.currentCount = currentCount;
    this.platform = platform;
  }
}

/**
 * Compte les posts actuellement schedulés dans Buffer pour un channel donné.
 * Utilise la query GraphQL posts filtrée par channelId + status scheduled.
 */
export async function getBufferQueueCount(platform: BufferPlatform): Promise<number> {
  const config = getConfig();
  const channelId = getChannelId(platform);

  const query = `
    query GetScheduledCount {
      posts(
        input: {
          organizationId: ${JSON.stringify(config.organizationId)},
          filter: { status: [scheduled], channelIds: [${JSON.stringify(channelId)}] }
        }
      ) {
        edges {
          node {
            id
          }
        }
      }
    }
  `;

  const data = await bufferGraphQL<{
    posts: { edges: Array<{ node: { id: string } }> };
  }>(query);

  return data.posts.edges.length;
}

/**
 * Vérifie qu'il reste assez de slots dans la queue Buffer pour un channel.
 * Lève BufferQueueFullError si la limite serait dépassée.
 *
 * @param platform - La plateforme cible
 * @param slotsNeeded - Nombre de slots nécessaires (1 pour un post, N pour un thread)
 */
async function ensureQuotaAvailable(platform: BufferPlatform, slotsNeeded: number): Promise<void> {
  try {
    const currentCount = await getBufferQueueCount(platform);

    if (currentCount + slotsNeeded > BUFFER_EFFECTIVE_LIMIT) {
      throw new BufferQueueFullError(platform, currentCount, slotsNeeded);
    }

    if (currentCount >= BUFFER_EFFECTIVE_LIMIT - 1) {
      console.warn(
        `[Buffer] ⚠️ Queue ${platform} presque pleine: ${currentCount}/${BUFFER_MAX_SCHEDULED} slots occupés (limite effective: ${BUFFER_EFFECTIVE_LIMIT})`,
      );
    }
  } catch (error) {
    // Si c'est une BufferQueueFullError, on la propage
    if (error instanceof BufferQueueFullError) throw error;
    // Si la vérification échoue (réseau, etc.), on laisse passer
    // pour ne pas bloquer la publication sur une erreur de quota check
    console.warn(`[Buffer] Quota check échoué pour ${platform}, publication quand même:`, error);
  }
}

// ─── API Calls ──────────────────────────────────────────────────

/**
 * Publie un post texte sur une plateforme via Buffer.
 * Le post est schedulé à l'heure spécifiée par dueAt.
 * Si dueAt n'est pas fourni, Buffer publie selon son queue automatique.
 *
 * @returns L'ID du post Buffer créé.
 */
export async function createBufferPost(
  platform: BufferPlatform,
  text: string,
  dueAt?: Date,
  _skipQuotaCheck = false,
): Promise<string> {
  // Quota check (sauf si appelé depuis createBufferThread qui fait son propre check)
  if (!_skipQuotaCheck) {
    await ensureQuotaAvailable(platform, 1);
  }

  const channelId = getChannelId(platform);

  // Si dueAt est dans le passé, publier dans 2 min (Buffer refuse les dates passées)
  const minFuture = new Date(Date.now() + 2 * 60 * 1000);
  const effectiveDueAt = dueAt && dueAt > minFuture ? dueAt : minFuture;
  const dueAtStr = effectiveDueAt.toISOString();

  const query = `
    mutation CreatePost {
      createPost(input: {
        text: ${JSON.stringify(text)},
        channelId: ${JSON.stringify(channelId)},
        schedulingType: automatic,
        mode: customScheduled,
        dueAt: "${dueAtStr}"
      }) {
        ... on PostActionSuccess {
          post {
            id
            text
          }
        }
        ... on MutationError {
          message
        }
      }
    }
  `;

  const data = await bufferGraphQL<{
    createPost:
      | { post: { id: string; text: string } }
      | { message: string };
  }>(query);

  // Check if it's an error response
  if ("message" in data.createPost) {
    throw new Error(`Buffer createPost error: ${data.createPost.message}`);
  }

  return data.createPost.post.id;
}

/**
 * Publie un post avec image sur une plateforme via Buffer (pour Instagram).
 * Buffer gère l'upload et la publication de l'image.
 *
 * @returns L'ID du post Buffer créé.
 */
export async function createBufferImagePost(
  platform: BufferPlatform,
  text: string,
  imageUrl: string,
  dueAt?: Date,
  firstComment?: string,
): Promise<string> {
  await ensureQuotaAvailable(platform, 1);

  const channelId = getChannelId(platform);

  // Si dueAt est dans le passé, publier dans 2 min (Buffer refuse les dates passées)
  const minFuture = new Date(Date.now() + 2 * 60 * 1000);
  const effectiveDueAt = dueAt && dueAt > minFuture ? dueAt : minFuture;
  const dueAtStr = effectiveDueAt.toISOString();

  // Instagram first comment : hashtags en commentaire (meilleur pour l'algo)
  const firstCommentBlock = firstComment
    ? `firstComment: ${JSON.stringify(firstComment)},`
    : "";

  const query = `
    mutation CreateImagePost {
      createPost(input: {
        text: ${JSON.stringify(text)},
        channelId: ${JSON.stringify(channelId)},
        schedulingType: automatic,
        mode: customScheduled,
        dueAt: "${dueAtStr}",
        ${firstCommentBlock}
        assets: {
          images: [{ url: ${JSON.stringify(imageUrl)} }]
        }
      }) {
        ... on PostActionSuccess {
          post {
            id
            text
            assets {
              id
              mimeType
            }
          }
        }
        ... on MutationError {
          message
        }
      }
    }
  `;

  const data = await bufferGraphQL<{
    createPost:
      | { post: { id: string; text: string; assets: Array<{ id: string; mimeType: string }> } }
      | { message: string };
  }>(query);

  if ("message" in data.createPost) {
    throw new Error(`Buffer createImagePost error: ${data.createPost.message}`);
  }

  return data.createPost.post.id;
}

/**
 * Publie un thread Twitter via Buffer.
 * Chaque partie est publiée comme un tweet séparé, espacé de 2 min.
 *
 * Note plan gratuit Buffer : 10 posts schedulés/channel max.
 * Les threads sont publiés en quasi-immédiat (dueAt = maintenant + 1-2 min par partie)
 * pour ne pas monopoliser les slots de scheduling.
 * Le paramètre dueAt est ignoré pour les threads — ils partent immédiatement.
 *
 * @returns L'ID du premier post Buffer.
 */
export async function createBufferThread(
  parts: string[],
  _dueAt?: Date,
): Promise<string> {
  if (parts.length === 0) {
    throw new Error("Thread vide — au moins 1 tweet requis");
  }

  // Quota check : un thread consomme N slots (1 par partie)
  await ensureQuotaAvailable("TWITTER", parts.length);

  // Publication quasi-immédiate : 1 min dans le futur + 2 min entre chaque partie
  // Libère les slots de scheduling rapidement (important pour plan gratuit Buffer)
  const baseTime = Date.now() + 60 * 1000; // +1 min
  const firstId = await createBufferPost("TWITTER", parts[0], new Date(baseTime), true);

  for (let i = 1; i < parts.length; i++) {
    const partDueAt = new Date(baseTime + i * 2 * 60 * 1000);
    await createBufferPost("TWITTER", parts[i], partDueAt, true);
  }

  return firstId;
}

/**
 * Récupère la liste des channels (profils sociaux) connectés dans Buffer.
 * Utile pour trouver les Channel IDs à configurer dans les Secrets.
 */
export async function getBufferChannels(): Promise<BufferChannel[]> {
  const config = getConfig();

  const query = `
    query GetChannels {
      channels(input: {
        organizationId: ${JSON.stringify(config.organizationId)}
      }) {
        id
        name
        displayName
        service
        avatar
        isQueuePaused
      }
    }
  `;

  const data = await bufferGraphQL<{ channels: BufferChannel[] }>(query);
  return data.channels;
}

/**
 * Récupère les posts schedulés dans Buffer (pour suivi/analytics).
 */
export async function getBufferScheduledPosts(): Promise<
  Array<{ id: string; text: string; createdAt: string }>
> {
  const config = getConfig();

  const query = `
    query GetScheduledPosts {
      posts(
        input: {
          organizationId: ${JSON.stringify(config.organizationId)},
          sort: [{ field: dueAt, direction: asc }],
          filter: { status: [scheduled] }
        }
      ) {
        edges {
          node {
            id
            text
            createdAt
          }
        }
      }
    }
  `;

  const data = await bufferGraphQL<{
    posts: { edges: Array<{ node: { id: string; text: string; createdAt: string } }> };
  }>(query);

  return data.posts.edges.map((e) => e.node);
}

// ─── Configuration Check ────────────────────────────────────────

/**
 * Vérifie que Buffer est configuré (token + org ID).
 */
export function isBufferConfigured(): boolean {
  return !!(
    process.env.BUFFER_ACCESS_TOKEN &&
    process.env.BUFFER_ORGANIZATION_ID
  );
}

/**
 * Vérifie qu'un channel est configuré pour une plateforme.
 */
export function isChannelConfigured(platform: BufferPlatform): boolean {
  const envMap: Record<BufferPlatform, string> = {
    TWITTER: "BUFFER_CHANNEL_TWITTER",
    LINKEDIN: "BUFFER_CHANNEL_LINKEDIN",
    INSTAGRAM: "BUFFER_CHANNEL_INSTAGRAM",
  };
  return !!process.env[envMap[platform]];
}
