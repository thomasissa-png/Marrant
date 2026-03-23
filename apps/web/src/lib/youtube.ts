// Constantes YouTube
const YOUTUBE_API_BASE = "https://www.googleapis.com/youtube/v3";

export interface YouTubeVideoDetails {
  id: string;
  title: string;
  channelName: string;
  channelId?: string;
  duration: string;
  thumbnailUrl: string;
  description: string;
  publishedAt?: string;
}

export interface YouTubeSearchResult {
  videoId: string;
  title: string;
  channelName: string;
  channelId: string;
  publishedAt: string;
  description: string;
  thumbnailUrl: string;
}

/**
 * Récupère les détails d'une vidéo YouTube via l'API Data v3
 */
export async function getVideoDetails(
  videoId: string
): Promise<YouTubeVideoDetails | null> {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) {
    console.error("YOUTUBE_API_KEY non configurée");
    return null;
  }

  const url = `${YOUTUBE_API_BASE}/videos?part=snippet,contentDetails&id=${videoId}&key=${apiKey}`;
  const response = await fetch(url);

  if (!response.ok) {
    console.error(`Erreur YouTube API: ${response.status}`);
    return null;
  }

  const data = await response.json();
  const video = data.items?.[0];

  if (!video) return null;

  return {
    id: video.id,
    title: video.snippet.title,
    channelName: video.snippet.channelTitle,
    channelId: video.snippet.channelId,
    duration: video.contentDetails.duration,
    thumbnailUrl: video.snippet.thumbnails.high?.url ?? "",
    description: video.snippet.description,
    publishedAt: video.snippet.publishedAt,
  };
}

/**
 * Recherche des vidéos YouTube par mots-clés.
 * Retourne les résultats triés par pertinence.
 */
export async function searchVideos(
  query: string,
  options: {
    maxResults?: number;
    publishedAfter?: string; // ISO 8601 date
    relevanceLanguage?: string;
    videoDuration?: "short" | "medium" | "long";
  } = {},
): Promise<YouTubeSearchResult[]> {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) {
    console.error("YOUTUBE_API_KEY non configurée");
    return [];
  }

  const params = new URLSearchParams({
    part: "snippet",
    type: "video",
    q: query,
    key: apiKey,
    maxResults: String(options.maxResults ?? 10),
    relevanceLanguage: options.relevanceLanguage ?? "fr",
    regionCode: "FR",
    order: "relevance",
    safeSearch: "moderate",
  });

  if (options.publishedAfter) {
    params.set("publishedAfter", options.publishedAfter);
  }
  if (options.videoDuration) {
    params.set("videoDuration", options.videoDuration);
  }

  const url = `${YOUTUBE_API_BASE}/search?${params.toString()}`;
  const response = await fetch(url);

  if (!response.ok) {
    console.error(`Erreur YouTube Search API: ${response.status}`);
    return [];
  }

  const data = await response.json();
  if (!data.items?.length) return [];

  return data.items.map((item: { id: { videoId: string }; snippet: { title: string; channelTitle: string; channelId: string; publishedAt: string; description: string; thumbnails: { high?: { url: string } } } }) => ({
    videoId: item.id.videoId,
    title: item.snippet.title,
    channelName: item.snippet.channelTitle,
    channelId: item.snippet.channelId,
    publishedAt: item.snippet.publishedAt,
    description: item.snippet.description,
    thumbnailUrl: item.snippet.thumbnails.high?.url ?? "",
  }));
}

/**
 * Récupère les dernières vidéos d'une chaîne YouTube.
 */
export async function getChannelVideos(
  channelId: string,
  options: {
    maxResults?: number;
    publishedAfter?: string;
  } = {},
): Promise<YouTubeSearchResult[]> {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) {
    console.error("YOUTUBE_API_KEY non configurée");
    return [];
  }

  const params = new URLSearchParams({
    part: "snippet",
    type: "video",
    channelId,
    key: apiKey,
    maxResults: String(options.maxResults ?? 15),
    order: "date",
  });

  if (options.publishedAfter) {
    params.set("publishedAfter", options.publishedAfter);
  }

  const url = `${YOUTUBE_API_BASE}/search?${params.toString()}`;
  const response = await fetch(url);

  if (!response.ok) {
    console.error(`Erreur YouTube Channel Videos API: ${response.status}`);
    return [];
  }

  const data = await response.json();
  if (!data.items?.length) return [];

  return data.items.map((item: { id: { videoId: string }; snippet: { title: string; channelTitle: string; channelId: string; publishedAt: string; description: string; thumbnails: { high?: { url: string } } } }) => ({
    videoId: item.id.videoId,
    title: item.snippet.title,
    channelName: item.snippet.channelTitle,
    channelId: item.snippet.channelId,
    publishedAt: item.snippet.publishedAt,
    description: item.snippet.description,
    thumbnailUrl: item.snippet.thumbnails.high?.url ?? "",
  }));
}

/**
 * Récupère les détails de plusieurs vidéos en un seul appel API.
 */
export async function getMultipleVideoDetails(
  videoIds: string[],
): Promise<YouTubeVideoDetails[]> {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey || videoIds.length === 0) return [];

  // L'API accepte max 50 IDs par requête
  const batches: string[][] = [];
  for (let i = 0; i < videoIds.length; i += 50) {
    batches.push(videoIds.slice(i, i + 50));
  }

  const results: YouTubeVideoDetails[] = [];

  for (const batch of batches) {
    const url = `${YOUTUBE_API_BASE}/videos?part=snippet,contentDetails&id=${batch.join(",")}&key=${apiKey}`;
    const response = await fetch(url);

    if (!response.ok) {
      console.error(`Erreur YouTube Batch API: ${response.status}`);
      continue;
    }

    const data = await response.json();
    if (!data.items?.length) continue;

    for (const video of data.items) {
      results.push({
        id: video.id,
        title: video.snippet.title,
        channelName: video.snippet.channelTitle,
        channelId: video.snippet.channelId,
        duration: video.contentDetails.duration,
        thumbnailUrl: video.snippet.thumbnails.high?.url ?? "",
        description: video.snippet.description,
        publishedAt: video.snippet.publishedAt,
      });
    }
  }

  return results;
}

/**
 * Génère l'URL d'embed YouTube
 */
export function getEmbedUrl(videoId: string): string {
  return `https://www.youtube.com/embed/${encodeURIComponent(videoId)}`;
}

/**
 * Génère l'URL de la miniature YouTube
 */
export function getThumbnailUrl(
  videoId: string,
  quality: "default" | "medium" | "high" | "maxres" = "high"
): string {
  const qualityMap = {
    default: "default",
    medium: "mqdefault",
    high: "hqdefault",
    maxres: "maxresdefault",
  };
  return `https://img.youtube.com/vi/${encodeURIComponent(videoId)}/${qualityMap[quality]}.jpg`;
}
