// ───────────────────────────────────────────────────────────────────
// LinkedIn API Client — deviens-marrant.fr
//
// Gère : publication de posts texte, récupération analytics.
// Auth : OAuth 2.0 Bearer Token (3-legged flow, token obtenu manuellement).
//
// Secrets Replit nécessaires :
//   LINKEDIN_ACCESS_TOKEN  — Bearer token (scope: w_member_social, r_liteprofile)
//   LINKEDIN_PERSON_ID     — ID ou URN (ex: "AbCdEf" ou "urn:li:person:AbCdEf")
//
// API docs : https://learn.microsoft.com/en-us/linkedin/consumer/integrations/self-serve/share-on-linkedin
// ───────────────────────────────────────────────────────────────────

const API_BASE = "https://api.linkedin.com/v2";
const MAX_POST_LENGTH = 3000; // LinkedIn limite les posts à 3000 caractères

interface LinkedInConfig {
  accessToken: string;
  personUrn: string;
}

function getConfig(): LinkedInConfig {
  const accessToken = process.env.LINKEDIN_ACCESS_TOKEN;
  const personId = process.env.LINKEDIN_PERSON_ID;

  if (!accessToken || !personId) {
    throw new Error(
      "LinkedIn API credentials manquantes. Configure LINKEDIN_ACCESS_TOKEN et LINKEDIN_PERSON_ID dans les Secrets Replit.",
    );
  }

  // Normalise le personId en URN complet
  const personUrn = personId.startsWith("urn:li:")
    ? personId
    : `urn:li:person:${personId}`;

  return { accessToken, personUrn };
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

// ─── Helpers ────────────────────────────────────────────────────

function handleErrorResponse(status: number, body: string): never {
  if (status === 401) {
    throw new Error(
      `LinkedIn token expiré (401). Les tokens LinkedIn expirent après 60 jours. Régénère LINKEDIN_ACCESS_TOKEN dans les Secrets Replit.`,
    );
  }
  throw new Error(`LinkedIn API error ${status}: ${body}`);
}

function parsePostId(response: Response): string | null {
  return response.headers.get("X-RestLi-Id");
}

async function parsePostIdFallback(response: Response): Promise<string> {
  try {
    const data = (await response.json()) as LinkedInPostResponse;
    return data.id || "unknown";
  } catch {
    return "unknown";
  }
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

  const response = await fetch(`${API_BASE}/ugcPosts`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.accessToken}`,
      "Content-Type": "application/json",
      "X-Restli-Protocol-Version": "2.0.0",
    },
    body: JSON.stringify({
      author: config.personUrn,
      lifecycleState: "PUBLISHED",
      specificContent: {
        "com.linkedin.ugc.ShareContent": {
          shareCommentary: { text },
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

  const response = await fetch(`${API_BASE}/ugcPosts`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.accessToken}`,
      "Content-Type": "application/json",
      "X-Restli-Protocol-Version": "2.0.0",
    },
    body: JSON.stringify({
      author: config.personUrn,
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
  const url = `${API_BASE}/socialActions/${encodedUrn}`;

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
    process.env.LINKEDIN_PERSON_ID
  );
}
