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
//   BUFFER_CHANNEL_INSTAGRAM  — Channel ID du profil Instagram dans Buffer
// ───────────────────────────────────────────────────────────────────

import { longueurX } from "./longueur-x";

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
  /** Buffer a perdu l'autorisation du réseau : plus rien ne part (s15). */
  isDisconnected?: boolean;
  isLocked?: boolean;
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
  timeoutMs?: number,
): Promise<T> {
  const token = accessToken || getConfig().accessToken;

  const response = await fetch(BUFFER_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ query }),
    ...(timeoutMs ? { signal: AbortSignal.timeout(timeoutMs) } : {}),
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

// ─── Hard Guards (anti-erreur Buffer 400) ──────────────────────

/**
 * Limites strictes par plateforme pour éviter les erreurs Buffer 400.
 * - Twitter : 280 chars (hard limit Twitter API). Marge à 280 ici car la validation
 *   métier (G-S5) est à 270 — ce guard est le dernier filet avant l'API.
 * - LinkedIn : 1300 chars (limite recommandée pour visibilité algo)
 * - Instagram : 2200 chars (hard limit Instagram caption)
 */
const PLATFORM_HARD_LIMITS: Record<BufferPlatform, number> = {
  TWITTER: 280,
  LINKEDIN: 1300,
  INSTAGRAM: 2200,
};

/**
 * Erreur spécifique quand le contenu dépasse la limite de la plateforme.
 * Levée AVANT l'appel Buffer pour éviter les erreurs 400 cascade.
 */
export class BufferContentTooLongError extends Error {
  public readonly platform: BufferPlatform;
  public readonly contentLength: number;
  public readonly limit: number;

  constructor(platform: BufferPlatform, contentLength: number, limit: number) {
    super(
      `Contenu trop long pour ${platform} : ${contentLength} chars (max ${limit}). Le post doit être raccourci ou splitté en thread avant publication.`,
    );
    this.name = "BufferContentTooLongError";
    this.platform = platform;
    this.contentLength = contentLength;
    this.limit = limit;
  }
}

/**
 * Vérifie que le contenu respecte la limite de caractères de la plateforme.
 * Lève BufferContentTooLongError si dépassement (hard guard avant appel API).
 */
function ensureContentLength(platform: BufferPlatform, content: string): void {
  const limit = PLATFORM_HARD_LIMITS[platform];
  // X compte un lien pour 23 caractères (s15) : même calcul que la route publish-social.
  const n = platform === "TWITTER" ? longueurX(content) : content.length;
  if (n > limit) {
    throw new BufferContentTooLongError(platform, n, limit);
  }
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
  options: { firstComment?: string } = {},
): Promise<string> {
  // ─── Hard guard taille (avant tout appel API) ───
  // Évite la cascade Buffer 400 "post cannot exceed N characters"
  ensureContentLength(platform, text);

  // Quota check (sauf appel interne qui a déjà vérifié le quota).
  // Fils X interdits depuis s15 (X = posts simples) : plus de createBufferThread.
  if (!_skipQuotaCheck) {
    await ensureQuotaAvailable(platform, 1);
  }

  const channelId = getChannelId(platform);

  // Si dueAt est dans le passé, publier dans 2 min (Buffer refuse les dates passées)
  const minFuture = new Date(Date.now() + 2 * 60 * 1000);
  const effectiveDueAt = dueAt && dueAt > minFuture ? dueAt : minFuture;
  const dueAtStr = effectiveDueAt.toISOString();

  // Instagram requiert le metadata shouldShareToFeed même pour un post texte
  // (cas rare mais possible — si Instagram tombe sur ce path sans image, l'API
  // Buffer rejette sans le metadata. Voir createBufferImagePost pour le cas standard).
  // LinkedIn : lien en premier commentaire (stratégie v2), champ
  // LinkedInPostMetadataInput.firstComment vérifié par introspection (s15).
  const metadataBlock = platform === "INSTAGRAM"
    ? `,\n        metadata: { instagram: { type: post, shouldShareToFeed: true } }`
    : platform === "LINKEDIN" && options.firstComment
      ? `,\n        metadata: { linkedin: { firstComment: ${JSON.stringify(options.firstComment)} } }`
      : "";

  const query = `
    mutation CreatePost {
      createPost(input: {
        text: ${JSON.stringify(text)},
        channelId: ${JSON.stringify(channelId)},
        schedulingType: automatic,
        mode: customScheduled,
        dueAt: "${dueAtStr}"${metadataBlock}
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

/** Carrousel Instagram : 1 à 10 images (limite Instagram), dans l'ordre. */
export const MAX_CAROUSEL_IMAGES = 10;

/**
 * Publie un post avec une ou plusieurs images via Buffer (Instagram : carrousel
 * dès 2 images). Vérifié par introspection et brouillon réel le 05/10/2026 :
 * un carrousel Instagram = `metadata.instagram.type: post` + plusieurs `assets`
 * (le type `carousel` est refusé pour Instagram) ; chaque image accepte un
 * texte alternatif (`ImageMetadataInput.altText`).
 *
 * @returns L'ID du post Buffer créé.
 */
export async function createBufferImagePost(
  platform: BufferPlatform,
  text: string,
  imageUrls: string | string[],
  dueAt?: Date,
  hashtags?: string,
  altText?: string,
): Promise<string> {
  const urls = (Array.isArray(imageUrls) ? imageUrls : [imageUrls]).filter(Boolean);
  if (urls.length === 0 || urls.length > MAX_CAROUSEL_IMAGES) {
    throw new Error(`Buffer createImagePost invalid : ${urls.length} image(s), 1 à ${MAX_CAROUSEL_IMAGES} attendue(s).`);
  }
  // Hashtags ajoutés en fin de texte (Buffer ne supporte pas firstComment)
  const fullText = hashtags ? `${text}\n\n${hashtags}` : text;

  // ─── Hard guard taille (avant tout appel API) ───
  // On vérifie le texte FINAL (avec hashtags) — c'est ce que Buffer recevra
  ensureContentLength(platform, fullText);

  await ensureQuotaAvailable(platform, 1);

  const channelId = getChannelId(platform);

  // Si dueAt est dans le passé, publier dans 2 min (Buffer refuse les dates passées)
  const minFuture = new Date(Date.now() + 2 * 60 * 1000);
  const effectiveDueAt = dueAt && dueAt > minFuture ? dueAt : minFuture;
  const dueAtStr = effectiveDueAt.toISOString();

  // Instagram requiert :
  //   - type : post, story, ou reel (enum GraphQL ; carrousel = post à plusieurs images)
  //   - shouldShareToFeed : Boolean! REQUIRED par Buffer API
  // Buffer GraphQL : metadata.instagram (NOT subprofile — ce champ n'existe pas)
  const metadataBlock = platform === "INSTAGRAM"
    ? `,\n        metadata: { instagram: { type: post, shouldShareToFeed: true } }`
    : "";
  const alt = altText?.trim() ? `, metadata: { altText: ${JSON.stringify(altText.trim().slice(0, 1000))} }` : "";
  const assets = urls.map((u) => `{ image: { url: ${JSON.stringify(u)}${alt} } }`).join(", ");

  const query = `
    mutation CreateImagePost {
      createPost(input: {
        text: ${JSON.stringify(fullText)},
        channelId: ${JSON.stringify(channelId)},
        schedulingType: automatic,
        mode: customScheduled,
        dueAt: "${dueAtStr}",
        assets: [${assets}]${metadataBlock}
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
        isDisconnected
        isLocked
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

/** Statut réel d'un post chez Buffer (relecture s15, 05/10/2026). */
export interface BufferPostStatus {
  id: string;
  status: string; // draft | error | needs_approval | scheduled | sending | sent
  dueAt?: string | null;
  sentAt: string | null;
  externalLink: string | null;
  channelService: string | null;
  error: { message: string | null; rawError: string | null; supportUrl: string | null } | null;
}

const STATUS_FIELDS = `id status dueAt sentAt externalLink channelService error { message rawError supportUrl }`;

/**
 * Une page de posts Buffer terminés (envoyés ou en erreur), les plus récents
 * d'abord, avec le curseur de la page suivante. Timeout 5 s.
 */
export async function getBufferFinishedPostsPage(
  after?: string | null,
  first = 100,
): Promise<{ posts: BufferPostStatus[]; endCursor: string | null; hasNextPage: boolean }> {
  const config = getConfig();
  const afterArg = after ? `, after: ${JSON.stringify(after)}` : "";
  const query = `
    query GetFinishedPosts {
      posts(
        input: {
          organizationId: ${JSON.stringify(config.organizationId)},
          sort: [{ field: dueAt, direction: desc }],
          filter: { status: [sent, error] }
        },
        first: ${Math.max(1, Math.floor(first))}${afterArg}
      ) {
        edges { node { ${STATUS_FIELDS} } }
        pageInfo { endCursor hasNextPage }
      }
    }
  `;
  const data = await bufferGraphQL<{
    posts: { edges: Array<{ node: BufferPostStatus }> | null; pageInfo: { endCursor: string | null; hasNextPage: boolean } };
  }>(query, config.accessToken, 5_000);
  return {
    posts: (data.posts.edges ?? []).map((e) => e.node),
    endCursor: data.posts.pageInfo?.endCursor ?? null,
    hasNextPage: !!data.posts.pageInfo?.hasNextPage,
  };
}

/**
 * Posts Buffer terminés, page après page (s15 cycle 3, défaut D4) : on
 * s'arrête dès que tous les `wantedIds` sont trouvés, faute de page suivante,
 * ou après `maxPages` pages (100 posts chacune).
 */
export async function getBufferFinishedPosts(
  opts: { wantedIds?: Iterable<string>; maxPages?: number } = {},
): Promise<BufferPostStatus[]> {
  const wanted = new Set(opts.wantedIds ?? []);
  const maxPages = opts.maxPages ?? 5;
  const out: BufferPostStatus[] = [];
  let after: string | null = null;
  for (let page = 0; page < maxPages; page++) {
    const res = await getBufferFinishedPostsPage(after);
    out.push(...res.posts);
    for (const p of res.posts) wanted.delete(p.id);
    if (!res.hasNextPage || !res.endCursor || (opts.wantedIds && wanted.size === 0)) break;
    after = res.endCursor;
  }
  return out;
}

/**
 * Statut d'un post Buffer par identifiant (relecture des posts absents des
 * pages : programmés, en cours d'envoi, ou supprimés chez Buffer).
 * Retourne `null` si Buffer ne connaît pas (plus) ce post (NOT_FOUND).
 */
export async function getBufferPostStatus(id: string): Promise<BufferPostStatus | null> {
  const config = getConfig();
  const query = `query GetPost { post(input: { id: ${JSON.stringify(id)} }) { ${STATUS_FIELDS} } }`;
  try {
    const data = await bufferGraphQL<{ post: BufferPostStatus }>(query, config.accessToken, 5_000);
    return data.post;
  } catch (err) {
    if (err instanceof Error && /not found/i.test(err.message)) return null;
    throw err;
  }
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

/** Channel ID Buffer configuré pour chaque plateforme (absent = non configuré). */
export function getConfiguredChannelIds(): Partial<Record<BufferPlatform, string>> {
  const out: Partial<Record<BufferPlatform, string>> = {};
  const envMap: Record<BufferPlatform, string> = {
    TWITTER: "BUFFER_CHANNEL_TWITTER",
    LINKEDIN: "BUFFER_CHANNEL_LINKEDIN",
    INSTAGRAM: "BUFFER_CHANNEL_INSTAGRAM",
  };
  for (const [platform, env] of Object.entries(envMap) as Array<[BufferPlatform, string]>) {
    const id = process.env[env];
    if (id) out[platform] = id;
  }
  return out;
}
