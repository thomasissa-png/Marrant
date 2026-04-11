import {
  callWithRetry,
  extractJson,
  extractJsonArray,
  getResponseText,
  SONNET_MODEL,
} from "../client";
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
  otherAgentsCategories?: { joke: string; tip: string };
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

  const systemPrompt = `Tu es l'Agent Vidéos de deviens-marrant.fr — un directeur artistique de festival de stand-up.

Tu sélectionnes la vidéo du jour comme un programmateur sélectionne un spectacle pour son festival : avec exigence, pertinence et connaissance du public.

═══════════════════════════════════════
MISSION : Choisir LA vidéo qui fera le plus progresser ${persona.name} aujourd'hui.
Pas la plus populaire, pas la plus drôle — celle qui enseigne le mieux la technique du jour.
═══════════════════════════════════════

PERSONA CIBLE : ${persona.name} (${persona.age} ans)
- Profil : ${persona.description}
- Ton : ${persona.tone}
- Niveau : ${persona.tipDifficulty}

THÈME DU JOUR : ${ctx.plannedTheme}
CATÉGORIE VISÉE : ${ctx.plannedCategory}

VIDÉOS DISPONIBLES :
${eligibleVideos.map((v, i) => `${i + 1}. [ID: ${v.id}] "${v.title}" par ${v.channelName} — ${v.category}/${v.difficulty} — Technique: ${v.technique}`).join("\n")}

VOIX DE MARQUE : "${TONALITY_BRIEF.voice}"
- ${TONALITY_BRIEF.videoGuidelines.tone}
- ${TONALITY_BRIEF.videoGuidelines.techniques}

═══════════════════════════════════════
CRITÈRES DE SÉLECTION — Par ordre de priorité
═══════════════════════════════════════

1. **PERTINENCE PÉDAGOGIQUE** : La vidéo doit illustrer la technique "${ctx.plannedTheme}" de manière évidente. ${persona.name} doit pouvoir nommer CE QU'IL/ELLE A APPRIS après l'avoir vue.

2. **NIVEAU ADAPTÉ** : Pour ${persona.name} (niveau ${persona.tipDifficulty}), évite les vidéos trop avancées (frustrantes) ou trop basiques (ennuyeuses). Le sweet spot : un cran au-dessus de son confort.

3. **DIVERSITÉ QUOTIDIENNE** : Aujourd'hui la vanne porte sur "${ctx.otherAgentsCategories?.joke ?? "?"}" et le conseil sur "${ctx.otherAgentsCategories?.tip ?? "?"}". La vidéo DOIT aborder un angle DIFFÉRENT — 3 sujets distincts dans la journée.

4. **DIVERSITÉ DE CHAÎNE** : Rééquilibrage progressif obligatoire. Montreux Comedy représente ~36% du catalogue — privilégie SYSTÉMATIQUEMENT les autres chaînes à qualité égale (Jamel Comedy Club, France Inter, YouHumour, Sugar Sammy, Pierre Croce, chaînes d'artistes, etc.). Ne choisis Montreux Comedy que si c'est la seule vidéo pertinente pour la technique du jour.

5. **CATÉGORIE** : Privilégie "${ctx.plannedCategory}" si possible. Si aucune vidéo ne correspond, choisis celle dont la technique est la plus transférable au thème du jour.

6. **ENRICHISSEMENT** : Quand de nouvelles vidéos sont ajoutées au catalogue, elles doivent venir de chaînes sous-représentées. Objectif : aucune chaîne au-dessus de 25% du catalogue total.

═══════════════════════════════════════
FORMAT DE RÉPONSE — JSON STRICT
═══════════════════════════════════════
{"videoId": "ID_EXACT_DE_LA_VIDEO", "reason": "En 1 phrase : pourquoi cette vidéo est la meilleure pour ${persona.name} aujourd'hui"}`;

  const response = await callWithRetry({
    model: SONNET_MODEL,
    max_tokens: 300,
    system: systemPrompt,
    messages: [
      {
        role: "user",
        content: `Vidéo du jour — Thème : "${ctx.plannedTheme}" | Catégorie : ${ctx.plannedCategory} | Pour : ${persona.name} (${persona.age} ans, niveau ${persona.tipDifficulty})

Quelle vidéo va faire le plus PROGRESSER ${persona.name} aujourd'hui sur "${ctx.plannedTheme}" ?
Choisis celle qui enseigne le mieux la technique, pas juste la plus drôle.`,
      },
    ],
  }, 2, { agent: "video-agent", fn: "selectDailyVideo" });

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
    model: SONNET_MODEL,
    max_tokens: 4000,
    system: `Tu es le planificateur de l'Agent Vidéos de deviens-marrant.fr.

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
  }, 2, { agent: "video-agent", fn: "generateVideoMonthlyPlan" });

  const text = getResponseText(response);
  const raw = extractJsonArray<{ dayOfMonth: number; category: string; theme: string; targetPersona: string }>(text);

  return validateMonthlyPlan(raw, daysInMonth, TIP_CATEGORIES as unknown as readonly string[], getPersonaForDay);
}
