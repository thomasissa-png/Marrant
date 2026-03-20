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
): Promise<string> {
  const channelId = getChannelId(platform);

  const dueAtStr = dueAt ? dueAt.toISOString() : new Date(Date.now() + 5 * 60 * 1000).toISOString();

  const query = `
    mutation CreatePost {
      createPost(input: {
        text: ${JSON.stringify(text)},
        channelId: "${channelId}",
        schedulingType: automatic,
        mode: customSchedule,
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
): Promise<string> {
  const channelId = getChannelId(platform);

  const dueAtStr = dueAt ? dueAt.toISOString() : new Date(Date.now() + 5 * 60 * 1000).toISOString();

  const query = `
    mutation CreateImagePost {
      createPost(input: {
        text: ${JSON.stringify(text)},
        channelId: "${channelId}",
        schedulingType: automatic,
        mode: customSchedule,
        dueAt: "${dueAtStr}",
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
 * Buffer ne supporte pas nativement les threads, donc on publie le premier tweet
 * et on ajoute une note que les tweets suivants seront dans les réponses.
 *
 * Pour un vrai thread, on concatène les parties avec des séparateurs.
 * Alternative : publier chaque partie séparément avec un délai.
 *
 * @returns L'ID du premier post Buffer.
 */
export async function createBufferThread(
  parts: string[],
  dueAt?: Date,
): Promise<string> {
  if (parts.length === 0) {
    throw new Error("Thread vide — au moins 1 tweet requis");
  }

  // Pour les threads, on publie la première partie via Buffer
  // Les threads Twitter natifs ne sont pas supportés par Buffer API
  // On publie donc chaque partie comme un tweet séparé, espacé de 2 minutes
  const firstId = await createBufferPost("TWITTER", parts[0], dueAt);

  const baseTime = dueAt ? dueAt.getTime() : Date.now() + 5 * 60 * 1000;

  for (let i = 1; i < parts.length; i++) {
    const partDueAt = new Date(baseTime + i * 2 * 60 * 1000); // +2 min entre chaque
    await createBufferPost("TWITTER", parts[i], partDueAt);
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
        organizationId: "${config.organizationId}"
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
          organizationId: "${config.organizationId}",
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
