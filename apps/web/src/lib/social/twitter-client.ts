import crypto from "crypto";

// ───────────────────────────────────────────────────────────────────
// Twitter API v2 Client — deviens-marrant.fr
//
// Gère : publication de tweets, threads, récupération analytics.
// Auth : OAuth 1.0a (User Context) pour poster au nom du compte.
//
// Secrets Replit nécessaires :
//   TWITTER_API_KEY, TWITTER_API_SECRET,
//   TWITTER_ACCESS_TOKEN, TWITTER_ACCESS_SECRET
// ───────────────────────────────────────────────────────────────────

const API_BASE = "https://api.twitter.com/2";

interface TwitterConfig {
  apiKey: string;
  apiSecret: string;
  accessToken: string;
  accessSecret: string;
}

function getConfig(): TwitterConfig {
  const apiKey = process.env.TWITTER_API_KEY;
  const apiSecret = process.env.TWITTER_API_SECRET;
  const accessToken = process.env.TWITTER_ACCESS_TOKEN;
  const accessSecret = process.env.TWITTER_ACCESS_SECRET;

  if (!apiKey || !apiSecret || !accessToken || !accessSecret) {
    throw new Error(
      "Twitter API credentials manquantes. Configure TWITTER_API_KEY, TWITTER_API_SECRET, TWITTER_ACCESS_TOKEN, TWITTER_ACCESS_SECRET dans les Secrets Replit.",
    );
  }

  return { apiKey, apiSecret, accessToken, accessSecret };
}

// ─── OAuth 1.0a Signature ───────────────────────────────────────

function percentEncode(str: string): string {
  return encodeURIComponent(str).replace(
    /[!'()*]/g,
    (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`,
  );
}

function generateOAuthSignature(
  method: string,
  url: string,
  params: Record<string, string>,
  config: TwitterConfig,
): string {
  const sortedKeys = Object.keys(params).sort();
  const paramString = sortedKeys
    .map((k) => `${percentEncode(k)}=${percentEncode(params[k])}`)
    .join("&");

  const signatureBase = [
    method.toUpperCase(),
    percentEncode(url),
    percentEncode(paramString),
  ].join("&");

  const signingKey = `${percentEncode(config.apiSecret)}&${percentEncode(config.accessSecret)}`;

  return crypto
    .createHmac("sha1", signingKey)
    .update(signatureBase)
    .digest("base64");
}

function buildAuthHeader(
  method: string,
  fullUrl: string,
  config: TwitterConfig,
): string {
  // OAuth 1.0a requires query params to be separated from the base URL
  // and included in the signature base string alongside OAuth params
  const urlObj = new URL(fullUrl);
  const baseUrl = `${urlObj.origin}${urlObj.pathname}`;

  const oauthParams: Record<string, string> = {
    oauth_consumer_key: config.apiKey,
    oauth_nonce: crypto.randomBytes(16).toString("hex"),
    oauth_signature_method: "HMAC-SHA1",
    oauth_timestamp: Math.floor(Date.now() / 1000).toString(),
    oauth_token: config.accessToken,
    oauth_version: "1.0",
  };

  // Merge query params into the signature params (OAuth 1.0a spec)
  const allParams: Record<string, string> = { ...oauthParams };
  urlObj.searchParams.forEach((value, key) => {
    allParams[key] = value;
  });

  const signature = generateOAuthSignature(method, baseUrl, allParams, config);
  oauthParams["oauth_signature"] = signature;

  const headerParts = Object.keys(oauthParams)
    .sort()
    .map((k) => `${percentEncode(k)}="${percentEncode(oauthParams[k])}"`)
    .join(", ");

  return `OAuth ${headerParts}`;
}

// ─── API Calls ──────────────────────────────────────────────────

export interface TweetResponse {
  data: {
    id: string;
    text: string;
  };
}

export interface TweetMetrics {
  impressions: number;
  likes: number;
  retweets: number;
  replies: number;
  urlClicks: number;
}

const MAX_TWEET_LENGTH = 280;

/**
 * Publie un tweet simple.
 * @returns L'ID du tweet publié.
 */
export async function postTweet(text: string): Promise<string> {
  if (text.length > MAX_TWEET_LENGTH) {
    throw new Error(
      `Tweet trop long (${text.length}/${MAX_TWEET_LENGTH} caractères). Tronque ou reformule.`,
    );
  }
  const config = getConfig();
  const url = `${API_BASE}/tweets`;
  const authHeader = buildAuthHeader("POST", url, config);

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: authHeader,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Twitter API error ${response.status}: ${error}`);
  }

  const data = (await response.json()) as TweetResponse;
  return data.data.id;
}

/**
 * Publie un tweet en réponse à un autre (pour les threads).
 */
export async function postReply(
  text: string,
  replyToId: string,
): Promise<string> {
  if (text.length > MAX_TWEET_LENGTH) {
    throw new Error(
      `Reply trop long (${text.length}/${MAX_TWEET_LENGTH} caractères).`,
    );
  }
  const config = getConfig();
  const url = `${API_BASE}/tweets`;
  const authHeader = buildAuthHeader("POST", url, config);

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: authHeader,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text,
      reply: { in_reply_to_tweet_id: replyToId },
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Twitter API reply error ${response.status}: ${error}`);
  }

  const data = (await response.json()) as TweetResponse;
  return data.data.id;
}

/**
 * Publie un thread (série de tweets en réponse).
 * @returns L'ID du premier tweet du thread.
 */
export async function postThread(tweets: string[]): Promise<string> {
  if (tweets.length === 0) {
    throw new Error("Thread vide — au moins 1 tweet requis");
  }

  // Premier tweet
  const firstId = await postTweet(tweets[0]);
  let lastId = firstId;

  // Tweets suivants en réponse au précédent
  for (let i = 1; i < tweets.length; i++) {
    // Small delay to avoid rate limiting
    await new Promise((resolve) => setTimeout(resolve, 500));
    lastId = await postReply(tweets[i], lastId);
  }

  return firstId;
}

/**
 * Récupère les métriques d'un tweet.
 * Nécessite un accès Twitter API v2 avec les champs metrics.
 */
export async function getTweetMetrics(
  tweetId: string,
): Promise<TweetMetrics> {
  const config = getConfig();
  // Only request public_metrics — non_public_metrics requires elevated API access
  const url = `${API_BASE}/tweets/${tweetId}?tweet.fields=public_metrics`;
  const authHeader = buildAuthHeader("GET", url, config);

  const response = await fetch(url, {
    method: "GET",
    headers: { Authorization: authHeader },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(
      `Twitter metrics error ${response.status}: ${error}`,
    );
  }

  const data = await response.json();
  const pub = data.data?.public_metrics || {};

  return {
    impressions: pub.impression_count ?? 0,
    likes: pub.like_count ?? 0,
    retweets: pub.retweet_count ?? 0,
    replies: pub.reply_count ?? 0,
    urlClicks: 0, // Requires elevated API access — not available on free tier
  };
}

/**
 * Vérifie que les credentials Twitter sont configurées.
 * Retourne true si les 4 secrets sont présents.
 */
export function isTwitterConfigured(): boolean {
  return !!(
    process.env.TWITTER_API_KEY &&
    process.env.TWITTER_API_SECRET &&
    process.env.TWITTER_ACCESS_TOKEN &&
    process.env.TWITTER_ACCESS_SECRET
  );
}
