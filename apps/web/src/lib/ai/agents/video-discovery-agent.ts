import { callWithRetry, extractJson, extractJsonArray, getResponseText } from "../client";
import { TONALITY_BRIEF } from "./marketing-agent";
import type { YouTubeVideoDetails } from "../../youtube";
import {
  searchVideos,
  getChannelVideos,
  getMultipleVideoDetails,
} from "../../youtube";

// ───────────────────────────────────────────────────────────────────
// Agent Video Discovery — Découverte et enrichissement de vidéos
//
// Rôle : Trouver de nouvelles vidéos stand-up/humour sur YouTube,
// les enrichir avec description pédagogique, learnings et exercice,
// puis les soumettre à la validation du Stand-Up Director.
//
// Pipeline :
//   1. Surveiller les chaînes favorites (watchlist)
//   2. Chercher par mots-clés stand-up FR
//   3. Filtrer les doublons et vidéos non pertinentes
//   4. Enrichir via IA (description, learnings, exercice)
//   5. Validation par le Stand-Up Director
//   6. Sauvegarde en DB
// ───────────────────────────────────────────────────────────────────

// ─── Watchlist de chaînes à surveiller ──────────────────────────

export interface WatchedChannel {
  channelId: string;
  name: string;
  priority: "high" | "medium" | "low";
}

/**
 * Chaînes favorites à surveiller pour de nouvelles vidéos.
 * Priorité donnée aux chaînes sous-représentées dans le catalogue.
 */
export const WATCHED_CHANNELS: WatchedChannel[] = [
  // Artistes prioritaires — chaînes sous-représentées
  { channelId: "UCkMtL9Nf4bMCIVs_aocYBbQ", name: "Paul Mirabel", priority: "high" },
  { channelId: "UCKeEZy9IZfiuRHsBJGNOX8w", name: "Fary", priority: "high" },
  { channelId: "UCijTbAN4tY18hBxzaFgK6YA", name: "Roman Frayssinet", priority: "high" },
  { channelId: "UCFjMNR73-OTVzRoN_Fb1oew", name: "Blanche Gardin", priority: "high" },
  { channelId: "UCVOMgFi4pvJFAEFUIg6Uhow", name: "Pierre Croce", priority: "high" },

  // Émissions et festivals — variété
  { channelId: "UCpKizUvhpG1gpdHkC5uT2TA", name: "Jamel Comedy Club", priority: "high" },
  { channelId: "UC0MRdaoetj_hnJLBUyrNYuA", name: "France Inter", priority: "medium" },
  { channelId: "UCORGvol9PSR12oBeJtijpXA", name: "YouHumour", priority: "high" },
  { channelId: "UCPJJPsYQmbcqYF-qbNpxxIQ", name: "Campus Comedy Tour", priority: "medium" },
  { channelId: "UCm0AvPAWEBcJt9TvxgkfSwg", name: "Tarmac", priority: "medium" },

  // Artistes individuels
  { channelId: "UC_Hkqe0af1sR0IVCfhLnHOA", name: "Waly Dia", priority: "medium" },
  { channelId: "UCY0jVXmMqDuHbIGLshxefKA", name: "Panayotis Pascot", priority: "medium" },
  { channelId: "UCz-bWuaGfo2eFPDmy2C6ceg", name: "Inès Reg", priority: "medium" },
  { channelId: "UCJM-X9sJLT3XKNF5tJ_YXnQ", name: "Sugar Sammy", priority: "low" },
  { channelId: "UCXW0h2ZPmU6Dz8L9FNnaWFQ", name: "Nordine Ganso", priority: "medium" },
];

// ─── Mots-clés de recherche stand-up FR ──────────────────────────

const SEARCH_QUERIES = [
  "stand-up français 2026",
  "one man show français humour",
  "sketch humour français",
  "technique stand-up comédie",
  "humoriste français spectacle",
  "stand-up comedy France",
  "monologue humour français",
  "spectacle humour 2026",
  "nouvelle scène humour français",
  "comédie stand-up francophone",
];

// ─── Types ───────────────────────────────────────────────────────

const VIDEO_CATEGORIES = [
  "TIMING", "AUTODERISION", "OBSERVATION", "REPARTIE",
  "STORYTELLING", "ABSURDE", "JEUX_DE_MOTS",
] as const;

type VideoCategory = typeof VIDEO_CATEGORIES[number];

const VIDEO_DIFFICULTIES = ["DEBUTANT", "INTERMEDIAIRE", "EXPERT"] as const;
type VideoDifficulty = typeof VIDEO_DIFFICULTIES[number];

export interface DiscoveredVideo {
  youtubeId: string;
  title: string;
  channelName: string;
  duration: string;
  category: VideoCategory;
  difficulty: VideoDifficulty;
  description: string;
  technique: string;
  learnings: string[];
  exercise: string;
}

export interface DiscoveryResult {
  discoveredCount: number;
  enrichedCount: number;
  validatedCount: number;
  videos: DiscoveredVideo[];
  skippedReasons: string[];
}

// ─── Découverte de vidéos candidates ─────────────────────────────

/**
 * Découvre des vidéos candidates depuis les chaînes surveillées
 * et les recherches par mots-clés.
 */
export async function discoverCandidateVideos(
  existingYoutubeIds: string[],
  options: {
    targetCount?: number;
    publishedAfterMonths?: number;
  } = {},
): Promise<YouTubeVideoDetails[]> {
  const targetCount = options.targetCount ?? 30;
  const monthsBack = options.publishedAfterMonths ?? 6;
  const publishedAfter = new Date();
  publishedAfter.setMonth(publishedAfter.getMonth() - monthsBack);
  const publishedAfterISO = publishedAfter.toISOString();

  const existingSet = new Set(existingYoutubeIds);
  const seenIds = new Set<string>();
  const candidates: YouTubeVideoDetails[] = [];

  // 1. Chercher dans les chaînes surveillées (priorité haute d'abord)
  const sortedChannels = [...WATCHED_CHANNELS].sort((a, b) => {
    const order = { high: 0, medium: 1, low: 2 };
    return order[a.priority] - order[b.priority];
  });

  for (const channel of sortedChannels) {
    if (candidates.length >= targetCount) break;

    try {
      const videos = await getChannelVideos(channel.channelId, {
        maxResults: 10,
        publishedAfter: publishedAfterISO,
      });

      const newVideoIds = videos
        .filter((v) => !existingSet.has(v.videoId) && !seenIds.has(v.videoId))
        .map((v) => v.videoId);

      for (const id of newVideoIds) {
        seenIds.add(id);
      }

      if (newVideoIds.length > 0) {
        const details = await getMultipleVideoDetails(newVideoIds);
        candidates.push(...details);
      }
    } catch (err) {
      console.error(`Erreur chaîne ${channel.name}:`, err);
    }
  }

  // 2. Compléter avec des recherches par mots-clés si pas assez
  if (candidates.length < targetCount) {
    const shuffledQueries = [...SEARCH_QUERIES].sort(() => Math.random() - 0.5);

    for (const query of shuffledQueries.slice(0, 3)) {
      if (candidates.length >= targetCount) break;

      try {
        const results = await searchVideos(query, {
          maxResults: 10,
          publishedAfter: publishedAfterISO,
          videoDuration: "medium", // 4-20 min — bonne durée pour du stand-up
        });

        const newVideoIds = results
          .filter((v) => !existingSet.has(v.videoId) && !seenIds.has(v.videoId))
          .map((v) => v.videoId);

        for (const id of newVideoIds) {
          seenIds.add(id);
        }

        if (newVideoIds.length > 0) {
          const details = await getMultipleVideoDetails(newVideoIds);
          candidates.push(...details);
        }
      } catch (err) {
        console.error(`Erreur recherche "${query}":`, err);
      }
    }
  }

  return candidates;
}

// ─── Filtrage IA des vidéos pertinentes ──────────────────────────

/**
 * Utilise l'IA pour filtrer les vidéos non pertinentes
 * (pas du stand-up, pas en français, trop courte, contenu inadapté).
 */
export async function filterRelevantVideos(
  candidates: YouTubeVideoDetails[],
  channelDistribution: Record<string, number>,
  totalCatalogSize: number,
): Promise<{ videoId: string; title: string; channelName: string; duration: string; relevanceReason: string }[]> {
  if (candidates.length === 0) return [];

  const channelInfo = Object.entries(channelDistribution)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([name, count]) => `${name}: ${count} vidéos (${Math.round((count / totalCatalogSize) * 100)}%)`)
    .join("\n");

  const videoList = candidates.map((v, i) =>
    `${i + 1}. [${v.id}] "${v.title}" par ${v.channelName} — durée: ${v.duration}\n   Description: ${v.description.slice(0, 150)}...`,
  ).join("\n");

  const response = await callWithRetry({
    model: "claude-sonnet-4-20250514",
    max_tokens: 2000,
    system: `Tu es le filtre qualité de deviens-marrant.fr pour la sélection de vidéos pédagogiques de stand-up/humour.

Tu FILTRES les vidéos YouTube pour ne garder que celles qui :
1. Sont du VRAI stand-up ou humour français (pas de vlogs, podcasts longs, compilations, clips musicaux)
2. Montrent une TECHNIQUE d'humour identifiable et reproductible
3. Durent entre 3 et 20 minutes (idéal : 5-12 min)
4. Sont en français
5. Sont d'une qualité pro ou semi-pro (pas de vidéos amateurs filmées au téléphone)

DIVERSITÉ DE CHAÎNE — Répartition actuelle du catalogue (${totalCatalogSize} vidéos) :
${channelInfo}

RÈGLE : Privilégier les chaînes SOUS-REPRÉSENTÉES. Aucune chaîne ne doit dépasser 25% du catalogue.
Si une chaîne est déjà au-dessus de 25%, ses vidéos ne passent QUE si elles sont exceptionnellement pédagogiques.`,
    messages: [
      {
        role: "user",
        content: `Filtre ces ${candidates.length} vidéos candidates. Garde UNIQUEMENT celles qui sont pertinentes pour notre catalogue pédagogique de stand-up.

${videoList}

Réponds en JSON — un tableau des vidéos RETENUES :
[{"videoId": "ID", "title": "Titre", "channelName": "Chaîne", "duration": "PT...", "relevanceReason": "Pourquoi cette vidéo est pertinente"}]

Ne garde que les vidéos vraiment pertinentes. Mieux vaut en garder 5 excellentes que 15 moyennes.`,
      },
    ],
  });

  const text = getResponseText(response);
  return extractJsonArray<{ videoId: string; title: string; channelName: string; duration: string; relevanceReason: string }>(text);
}

// ─── Enrichissement IA d'une vidéo ───────────────────────────────

/**
 * Enrichit une vidéo avec description pédagogique, learnings et exercice.
 * L'IA analyse le titre et la description YouTube pour produire un contenu
 * de qualité formation.
 */
export async function enrichVideo(
  video: YouTubeVideoDetails,
): Promise<DiscoveredVideo | null> {
  try {
    const response = await callWithRetry({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1500,
      system: `Tu es l'Agent Vidéos de deviens-marrant.fr — tu enrichis des vidéos YouTube de stand-up pour en faire du matériel pédagogique.

${TONALITY_BRIEF.voice}

MISSION : Transformer une vidéo brute en fiche pédagogique qui ENSEIGNE une technique d'humour identifiable.

CATÉGORIES DISPONIBLES : ${VIDEO_CATEGORIES.join(", ")}
DIFFICULTÉS : ${VIDEO_DIFFICULTIES.join(", ")}

RÈGLES :
1. La DESCRIPTION doit commencer par "Regarde pour apprendre..." — elle vend la technique, pas la vidéo
2. Les LEARNINGS (2-4) doivent nommer des TECHNIQUES précises en MAJUSCULES (ex: "TECHNIQUE DU FAUX NAÏF")
3. L'EXERCICE doit suivre le format "DÉFI [NOM] : [action concrète faisable aujourd'hui]"
4. La TECHNIQUE doit être un seul mot-clé parmi : Observation, Timing, Autodérision, Absurde, Storytelling, Répartie, Jeux de mots, Escalade, Callback, Misdirection, Silence, Exagération, Analogie
5. Ton : encourageant, complice, comme un pote qui te file un bon plan`,
      messages: [
        {
          role: "user",
          content: `Enrichis cette vidéo YouTube pour notre catalogue :

Titre : "${video.title}"
Chaîne : ${video.channelName}
Durée : ${video.duration}
Description YouTube : "${video.description.slice(0, 500)}"

Réponds en JSON STRICT :
{
  "category": "TIMING|AUTODERISION|OBSERVATION|REPARTIE|STORYTELLING|ABSURDE|JEUX_DE_MOTS",
  "difficulty": "DEBUTANT|INTERMEDIAIRE|EXPERT",
  "description": "Regarde pour apprendre... (80-150 mots, technique identifiable)",
  "technique": "Un mot-clé technique",
  "learnings": ["TECHNIQUE EN MAJUSCULES : explication pratique (2-4 items)"],
  "exercise": "DÉFI [NOM] : exercice concret faisable aujourd'hui"
}`,
        },
      ],
    });

    const text = getResponseText(response);
    const enrichment = extractJson<{
      category: string;
      difficulty: string;
      description: string;
      technique: string;
      learnings: string[];
      exercise: string;
    }>(text);

    // Valider la catégorie
    const category = VIDEO_CATEGORIES.includes(enrichment.category as VideoCategory)
      ? (enrichment.category as VideoCategory)
      : "OBSERVATION";

    const difficulty = VIDEO_DIFFICULTIES.includes(enrichment.difficulty as VideoDifficulty)
      ? (enrichment.difficulty as VideoDifficulty)
      : "INTERMEDIAIRE";

    if (!enrichment.description?.trim() || !enrichment.technique?.trim() || !enrichment.exercise?.trim()) {
      console.error(`Enrichissement incomplet pour ${video.id}`);
      return null;
    }

    if (!Array.isArray(enrichment.learnings) || enrichment.learnings.length === 0) {
      console.error(`Learnings manquants pour ${video.id}`);
      return null;
    }

    return {
      youtubeId: video.id,
      title: video.title,
      channelName: video.channelName,
      duration: video.duration,
      category,
      difficulty,
      description: enrichment.description.trim(),
      technique: enrichment.technique.trim(),
      learnings: enrichment.learnings.map((l) => l.trim()),
      exercise: enrichment.exercise.trim(),
    };
  } catch (err) {
    console.error(`Erreur enrichissement vidéo ${video.id}:`, err);
    return null;
  }
}

// ─── Pipeline complet de découverte mensuelle ────────────────────

/**
 * Pipeline complet : découverte → filtrage → enrichissement.
 * Retourne les vidéos prêtes pour validation par le Stand-Up Director.
 */
export async function runMonthlyDiscovery(
  existingYoutubeIds: string[],
  channelDistribution: Record<string, number>,
  totalCatalogSize: number,
  targetNewVideos: number = 10,
): Promise<DiscoveryResult> {
  const result: DiscoveryResult = {
    discoveredCount: 0,
    enrichedCount: 0,
    validatedCount: 0,
    videos: [],
    skippedReasons: [],
  };

  // 1. Découvrir des vidéos candidates
  const candidates = await discoverCandidateVideos(existingYoutubeIds, {
    targetCount: targetNewVideos * 3, // On cherche 3x plus pour filtrer
    publishedAfterMonths: 6,
  });
  result.discoveredCount = candidates.length;

  if (candidates.length === 0) {
    result.skippedReasons.push("Aucune vidéo candidate trouvée");
    return result;
  }

  // 2. Filtrer via IA
  const filtered = await filterRelevantVideos(
    candidates,
    channelDistribution,
    totalCatalogSize,
  );

  if (filtered.length === 0) {
    result.skippedReasons.push("Aucune vidéo retenue après filtrage IA");
    return result;
  }

  // 3. Enrichir les vidéos retenues (limiter au nombre cible + marge)
  const toEnrich = filtered.slice(0, targetNewVideos + 5);
  const enrichedVideos: DiscoveredVideo[] = [];

  for (const video of toEnrich) {
    if (enrichedVideos.length >= targetNewVideos) break;

    // Récupérer les détails complets de la vidéo
    const details = candidates.find((c) => c.id === video.videoId);
    if (!details) {
      result.skippedReasons.push(`Détails manquants pour ${video.videoId}`);
      continue;
    }

    const enriched = await enrichVideo(details);
    if (enriched) {
      enrichedVideos.push(enriched);
    } else {
      result.skippedReasons.push(`Enrichissement échoué pour "${video.title}"`);
    }
  }

  result.enrichedCount = enrichedVideos.length;
  result.videos = enrichedVideos;

  return result;
}
