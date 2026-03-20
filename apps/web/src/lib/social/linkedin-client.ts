// ───────────────────────────────────────────────────────────────────
// LinkedIn API Client — deviens-marrant.fr
//
// Gère : publication de posts texte sur la PAGE ENTREPRISE,
//        récupération analytics.
// Auth : OAuth 2.0 Bearer Token (3-legged flow, token obtenu manuellement).
//
// API : Posts API (v2) — remplace l'ancienne UGC Post API (dépréciée).
// Docs : https://learn.microsoft.com/en-us/linkedin/marketing/community-management/shares/posts-api
//
// Secrets Replit nécessaires :
//   LINKEDIN_ACCESS_TOKEN    — Bearer token (scopes: w_organization_social, r_organization_social)
//   LINKEDIN_ORGANIZATION_ID — ID numérique de la page entreprise (ex: "123456789")
//
// Page entreprise : https://www.linkedin.com/company/deviens-marrant
// ───────────────────────────────────────────────────────────────────

// ⚠️  DEPRECATED — Remplacé par buffer-client.ts (mars 2026)
// Ce fichier est conservé comme fallback mais ne doit PAS être utilisé
// pour de nouvelles fonctionnalités. Toute publication passe par Buffer.

const REST_BASE = "https://api.linkedin.com/rest";
const V2_BASE = "https://api.linkedin.com/v2";
const LINKEDIN_VERSION = "202401";
const MAX_POST_LENGTH = 3000;

interface LinkedInConfig {
  accessToken: string;
  authorUrn: string;
}

function getConfig(): LinkedInConfig {
  const accessToken = process.env.LINKEDIN_ACCESS_TOKEN;
  const orgId = process.env.LINKEDIN_ORGANIZATION_ID;

  if (!accessToken || !orgId) {
    throw new Error(
      "LinkedIn API credentials manquantes. Configure LINKEDIN_ACCESS_TOKEN et LINKEDIN_ORGANIZATION_ID dans les Secrets Replit.",
    );
  }

  // URN page entreprise
  const authorUrn = orgId.startsWith("urn:li:")
    ? orgId
    : `urn:li:organization:${orgId}`;

  return { accessToken, authorUrn };
}

// ─── Types ──────────────────────────────────────────────────────

export interface LinkedInMetrics {
  impressions: number;
  likes: number;
  comments: number;
  shares: number;
  clicks: number;
}

// ─── Helpers ────────────────────────────────────────────────────

function handleErrorResponse(status: number, body: string): never {
  if (status === 401) {
    throw new Error(
      `LinkedIn token expiré (401). Les tokens LinkedIn expirent après 60 jours. Régénère LINKEDIN_ACCESS_TOKEN dans les Secrets Replit.`,
    );
  }
  if (status === 403) {
    throw new Error(
      `LinkedIn accès refusé (403). Vérifie que le token a les scopes w_organization_social et r_organization_social, et que LINKEDIN_ORGANIZATION_ID est correct. Détails : ${body}`,
    );
  }
  throw new Error(`LinkedIn API error ${status}: ${body}`);
}

function parsePostId(response: Response): string | null {
  // La nouvelle Posts API retourne l'ID dans le header x-restli-id
  return response.headers.get("x-restli-id") || response.headers.get("X-RestLi-Id");
}

async function parsePostIdFallback(response: Response): Promise<string> {
  try {
    const data = await response.json();
    return data.id || "unknown";
  } catch {
    return "unknown";
  }
}

// ─── API Calls ──────────────────────────────────────────────────

/**
 * Publie un post texte sur LinkedIn via la Posts API (v2).
 * @returns L'URN du post publié (ex: "urn:li:share:123456789").
 */
export async function postLinkedIn(text: string): Promise<string> {
  if (text.length > MAX_POST_LENGTH) {
    throw new Error(
      `Post LinkedIn trop long (${text.length}/${MAX_POST_LENGTH} caractères). Tronque ou reformule.`,
    );
  }

  const config = getConfig();

  const response = await fetch(`${REST_BASE}/posts`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.accessToken}`,
      "Content-Type": "application/json",
      "LinkedIn-Version": LINKEDIN_VERSION,
      "X-Restli-Protocol-Version": "2.0.0",
    },
    body: JSON.stringify({
      author: config.authorUrn,
      commentary: text,
      visibility: "PUBLIC",
      distribution: {
        feedDistribution: "MAIN_FEED",
        targetEntities: [],
        thirdPartyDistributionChannels: [],
      },
      lifecycleState: "PUBLISHED",
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    handleErrorResponse(response.status, error);
  }

  const postId = parsePostId(response);
  if (postId) return postId;
  return parsePostIdFallback(response);
}

/**
 * Publie un post avec un lien article sur LinkedIn.
 * Le lien est affiché comme preview card native LinkedIn.
 */
export async function postLinkedInWithLink(
  text: string,
  articleUrl: string,
  title?: string,
  description?: string,
): Promise<string> {
  if (text.length > MAX_POST_LENGTH) {
    throw new Error(
      `Post LinkedIn trop long (${text.length}/${MAX_POST_LENGTH} caractères).`,
    );
  }

  const config = getConfig();

  const response = await fetch(`${REST_BASE}/posts`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.accessToken}`,
      "Content-Type": "application/json",
      "LinkedIn-Version": LINKEDIN_VERSION,
      "X-Restli-Protocol-Version": "2.0.0",
    },
    body: JSON.stringify({
      author: config.authorUrn,
      commentary: text,
      visibility: "PUBLIC",
      distribution: {
        feedDistribution: "MAIN_FEED",
        targetEntities: [],
        thirdPartyDistributionChannels: [],
      },
      content: {
        article: {
          source: articleUrl,
          title: title || undefined,
          description: description || undefined,
        },
      },
      lifecycleState: "PUBLISHED",
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    handleErrorResponse(response.status, error);
  }

  const postId = parsePostId(response);
  if (postId) return postId;
  return parsePostIdFallback(response);
}

/**
 * Récupère les métriques d'un post LinkedIn.
 */
export async function getLinkedInMetrics(
  postUrn: string,
): Promise<LinkedInMetrics> {
  const config = getConfig();

  const encodedUrn = encodeURIComponent(postUrn);
  const url = `${V2_BASE}/socialActions/${encodedUrn}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${config.accessToken}`,
      "X-Restli-Protocol-Version": "2.0.0",
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      console.error("[LinkedIn] Token expiré (401) — régénérer LINKEDIN_ACCESS_TOKEN");
    }
    return { impressions: 0, likes: 0, comments: 0, shares: 0, clicks: 0 };
  }

  const data = await response.json();

  return {
    impressions: 0,
    likes: data.likesSummary?.totalLikes ?? 0,
    comments: data.commentsSummary?.totalFirstLevelComments ?? 0,
    shares: 0,
    clicks: 0,
  };
}

/**
 * Vérifie que les credentials LinkedIn sont configurées.
 */
export function isLinkedInConfigured(): boolean {
  return !!(
    process.env.LINKEDIN_ACCESS_TOKEN &&
    process.env.LINKEDIN_ORGANIZATION_ID
  );
}
