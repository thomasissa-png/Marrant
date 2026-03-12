import { callWithRetry, extractJson, extractJsonArray, getResponseText } from "../client";
import { PERSONAS, type PersonaKey } from "../personas";
import { getPersonaForDay, buildPersonaRotationPrompt } from "../personas";
import { validateMonthlyPlan } from "../plan-validator";
import { TONALITY_BRIEF } from "./marketing-agent";

const TIP_CATEGORIES = [
  "TIMING", "AUTODERISION", "OBSERVATION", "REPARTIE",
  "STORYTELLING", "ABSURDE", "JEUX_DE_MOTS",
] as const;

interface VideoSelection {
  videoId: string;
  reason: string;
}

interface VideoAgentContext {
  persona: PersonaKey;
  plannedCategory: string;
  plannedTheme: string;
  availableVideos: Array<{
    id: string;
    title: string;
    channelName: string;
    category: string;
    difficulty: string;
    technique: string;
    description: string;
  }>;
  recentVideoIds: string[];
  monthlyPlanSummary: string;
}

/**
 * L'agent vidéo sélectionne la meilleure vidéo existante pour le jour.
 * Il ne crée pas de vidéos mais curate intelligemment le catalogue.
 */
export async function selectDailyVideo(ctx: VideoAgentContext): Promise<VideoSelection> {
  const persona = PERSONAS[ctx.persona];

  // Filtrer les vidéos déjà sélectionnées récemment
  const eligibleVideos = ctx.availableVideos.filter(
    (v) => !ctx.recentVideoIds.includes(v.id)
  );

  if (eligibleVideos.length === 0) {
    // Si toutes les vidéos ont été utilisées, réinitialiser
    const fallback = ctx.availableVideos[0];
    if (!fallback) throw new Error("Agent Vidéos : aucune vidéo disponible");
    return { videoId: fallback.id, reason: "Rotation complète — reprise du catalogue" };
  }

  // Si peu de vidéos, sélection directe par catégorie
  if (eligibleVideos.length <= 3) {
    const match = eligibleVideos.find((v) => v.category === ctx.plannedCategory) ?? eligibleVideos[0];
    return { videoId: match.id, reason: `Sélection par catégorie ${ctx.plannedCategory}` };
  }

  const systemPrompt = `Tu es l'Agent Vidéos de deviensmarrant.fr — un curateur expert en contenu humoristique.

TON RÔLE : Sélectionner LA meilleure vidéo du jour parmi le catalogue existant.

PERSONA CIBLE : ${persona.name} (${persona.age} ans)
- Profil : ${persona.description}
- Ton attendu : ${persona.tone}

THÈME DU JOUR : ${ctx.plannedTheme}
CATÉGORIE VISÉE : ${ctx.plannedCategory}

VIDÉOS DISPONIBLES (non utilisées récemment) :
${eligibleVideos.map((v, i) => `${i + 1}. [ID: ${v.id}] "${v.title}" par ${v.channelName} — ${v.category}/${v.difficulty} — Technique: ${v.technique}`).join("\n")}

DIRECTIVE TONALITÉ (Agent Marketing) :
- Voix : "${TONALITY_BRIEF.voice}"
- Ton vidéo : ${TONALITY_BRIEF.videoGuidelines.tone}
- Descriptions : ${TONALITY_BRIEF.videoGuidelines.descriptions}
- Techniques : ${TONALITY_BRIEF.videoGuidelines.techniques}

RÈGLES :
1. Privilégie la catégorie "${ctx.plannedCategory}" si possible
2. Adapte au niveau du persona (${persona.tipDifficulty})
3. Si aucune vidéo ne correspond exactement, choisis la plus pertinente pour le thème

Réponds UNIQUEMENT en JSON :
{"videoId": "ID_EXACT_DE_LA_VIDEO", "reason": "Pourquoi cette vidéo"}`;

  const response = await callWithRetry({
    model: "claude-sonnet-4-20250514",
    max_tokens: 300,
    system: systemPrompt,
    messages: [
      {
        role: "user",
        content: `Quelle vidéo recommander aujourd'hui pour ${persona.name} sur le thème "${ctx.plannedTheme}" ?`,
      },
    ],
  });

  const text = getResponseText(response);
  const parsed = extractJson<VideoSelection>(text);

  // Valider que le videoId existe
  const validVideo = eligibleVideos.find((v) => v.id === parsed.videoId);
  if (!validVideo) {
    const fallback = eligibleVideos.find((v) => v.category === ctx.plannedCategory) ?? eligibleVideos[0];
    return { videoId: fallback.id, reason: "Fallback — ID invalide corrigé" };
  }

  return parsed;
}

/**
 * Génère le plan mensuel de vidéos via l'IA
 */
export async function generateVideoMonthlyPlan(
  month: number,
  year: number,
  daysInMonth: number
): Promise<Array<{ dayOfMonth: number; category: string; theme: string; targetPersona: string }>> {
  const response = await callWithRetry({
    model: "claude-sonnet-4-20250514",
    max_tokens: 4000,
    system: `Tu es le planificateur de l'Agent Vidéos de deviensmarrant.fr.

Tu dois créer un plan de curation vidéo pour ${daysInMonth} jours (${month}/${year}).

Les vidéos sont des tutoriels/analyses de stand-up et techniques d'humour.
CATÉGORIES VIDÉO : ${TIP_CATEGORIES.join(", ")}
DIFFICULTÉS : DEBUTANT, INTERMEDIAIRE, EXPERT

3 PERSONAS en rotation :
${buildPersonaRotationPrompt("tipCategories")}

RÈGLES :
1. Varier les catégories sur le mois
2. Les thèmes doivent aider à choisir la vidéo la plus pertinente
3. Progression logique par persona

Réponds UNIQUEMENT en JSON :
[{"dayOfMonth": 1, "category": "TIMING", "theme": "Comment bien placer ses pauses comiques", "targetPersona": "YANIS"}, ...]`,
    messages: [
      {
        role: "user",
        content: `Génère le plan vidéo pour ${month}/${year} (${daysInMonth} jours).`,
      },
    ],
  });

  const text = getResponseText(response);
  const raw = extractJsonArray<{ dayOfMonth: number; category: string; theme: string; targetPersona: string }>(text);

  return validateMonthlyPlan(raw, daysInMonth, TIP_CATEGORIES as unknown as readonly string[], getPersonaForDay);
}
