// Constantes YouTube
const YOUTUBE_API_BASE = "https://www.googleapis.com/youtube/v3";

interface YouTubeVideoDetails {
  id: string;
  title: string;
  channelName: string;
  duration: string;
  thumbnailUrl: string;
  description: string;
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
    duration: video.contentDetails.duration,
    thumbnailUrl: video.snippet.thumbnails.high?.url ?? "",
    description: video.snippet.description,
  };
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
