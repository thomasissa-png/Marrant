// ───────────────────────────────────────────────────────────────────
// LinkedIn API Client — deviens-marrant.fr
//
// Gère : publication de posts texte, récupération analytics.
// Auth : OAuth 2.0 Bearer Token (3-legged flow, token obtenu manuellement).
//
// Secrets Replit nécessaires :
//   LINKEDIN_ACCESS_TOKEN  — Bearer token (scope: w_member_social, r_liteprofile)
//   LINKEDIN_PERSON_ID     — URN de la personne (ex: "urn:li:person:AbCdEf")
//
// API docs : https://learn.microsoft.com/en-us/linkedin/consumer/integrations/self-serve/share-on-linkedin
// ───────────────────────────────────────────────────────────────────

const API_BASE = "https://api.linkedin.com/v2";
const MAX_POST_LENGTH = 3000; // LinkedIn limite les posts à 3000 caractères

interface LinkedInConfig {
  accessToken: string;
  personId: string;
}

function getConfig(): LinkedInConfig {
  const accessToken = process.env.LINKEDIN_ACCESS_TOKEN;
  const personId = process.env.LINKEDIN_PERSON_ID;

  if (!accessToken || !personId) {
    throw new Error(
      "LinkedIn API credentials manquantes. Configure LINKEDIN_ACCESS_TOKEN et LINKEDIN_PERSON_ID dans les Secrets Replit.",
    );
  }

  return { accessToken, personId };
}

// ─── Types ──────────────────────────────────────────────────────

interface LinkedInPostResponse {
  id: string; // URN du post (ex: "urn:li:share:123456789")
}

export interface LinkedInMetrics {
  impressions: number;
  likes: number;
  comments: number;
  shares: number;
  clicks: number;
}

// ─── API Calls ──────────────────────────────────────────────────

/**
 * Publie un post texte sur LinkedIn.
 * @returns L'URN du post publié (ex: "urn:li:share:123456789").
 */
export async function postLinkedIn(text: string): Promise<string> {
  if (text.length > MAX_POST_LENGTH) {
    throw new Error(
      `Post LinkedIn trop long (${text.length}/${MAX_POST_LENGTH} caractères). Tronque ou reformule.`,
    );
  }

  const config = getConfig();

  // LinkedIn API v2 — UGC Posts (recommandé pour les nouvelles intégrations)
  const response = await fetch(`${API_BASE}/ugcPosts`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.accessToken}`,
      "Content-Type": "application/json",
      "X-Restli-Protocol-Version": "2.0.0",
    },
    body: JSON.stringify({
      author: config.personId,
      lifecycleState: "PUBLISHED",
      specificContent: {
        "com.linkedin.ugc.ShareContent": {
          shareCommentary: {
            text,
          },
          shareMediaCategory: "NONE",
        },
      },
      visibility: {
        "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC",
      },
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`LinkedIn API error ${response.status}: ${error}`);
  }

  // LinkedIn renvoie le header X-RestLi-Id avec l'ID du post
  const postId = response.headers.get("X-RestLi-Id");
  if (postId) return postId;

  // Fallback : essayer de parser le body
  const data = (await response.json()) as LinkedInPostResponse;
  return data.id || "unknown";
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

  const response = await fetch(`${API_BASE}/ugcPosts`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.accessToken}`,
      "Content-Type": "application/json",
      "X-Restli-Protocol-Version": "2.0.0",
    },
    body: JSON.stringify({
      author: config.personId,
      lifecycleState: "PUBLISHED",
      specificContent: {
        "com.linkedin.ugc.ShareContent": {
          shareCommentary: { text },
          shareMediaCategory: "ARTICLE",
          media: [
            {
              status: "READY",
              originalUrl: articleUrl,
              title: title ? { text: title } : undefined,
              description: description ? { text: description } : undefined,
            },
          ],
        },
      },
      visibility: {
        "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC",
      },
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`LinkedIn API error ${response.status}: ${error}`);
  }

  const postId = response.headers.get("X-RestLi-Id");
  if (postId) return postId;

  const data = (await response.json()) as LinkedInPostResponse;
  return data.id || "unknown";
}

/**
 * Récupère les métriques d'un post LinkedIn.
 * Nécessite les scopes r_organization_social ou r_1st_connections_size.
 * Note : les analytics individuelles sont limitées sur l'API LinkedIn.
 */
export async function getLinkedInMetrics(
  postUrn: string,
): Promise<LinkedInMetrics> {
  const config = getConfig();

  const encodedUrn = encodeURIComponent(postUrn);
  const url = `${API_BASE}/socialActions/${encodedUrn}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${config.accessToken}`,
      "X-Restli-Protocol-Version": "2.0.0",
    },
  });

  if (!response.ok) {
    // Analytics might not be available — return zeroes
    return { impressions: 0, likes: 0, comments: 0, shares: 0, clicks: 0 };
  }

  const data = await response.json();

  return {
    impressions: 0, // Pas dispo via socialActions, nécessite organizationPageStatistics
    likes: data.likesSummary?.totalLikes ?? 0,
    comments: data.commentsSummary?.totalFirstLevelComments ?? 0,
    shares: 0, // Pas directement dispo
    clicks: 0, // Nécessite accès élevé
  };
}

/**
 * Vérifie que les credentials LinkedIn sont configurées.
 */
export function isLinkedInConfigured(): boolean {
  return !!(
    process.env.LINKEDIN_ACCESS_TOKEN &&
    process.env.LINKEDIN_PERSON_ID
  );
}
