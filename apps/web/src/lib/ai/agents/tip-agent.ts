import { callWithRetry, extractJson, extractJsonArray, getResponseText } from "../client";
import { PERSONAS, type PersonaKey } from "../personas";
import { getPersonaForDay } from "../personas";
import { validateMonthlyPlan } from "../plan-validator";

const TIP_CATEGORIES = [
  "TIMING", "AUTODERISION", "OBSERVATION", "REPARTIE",
  "STORYTELLING", "ABSURDE", "JEUX_DE_MOTS",
] as const;

const TIP_DIFFICULTIES = ["DEBUTANT", "INTERMEDIAIRE", "EXPERT"] as const;

interface GeneratedTip {
  title: string;
  content: string;
  category: string;
  difficulty: string;
  example: string;
  exercise: string;
}

interface TipAgentContext {
  persona: PersonaKey;
  plannedCategory: string;
  plannedTheme: string;
  recentTips: Array<{ title: string; category: string; difficulty: string }>;
  monthlyPlanSummary: string;
}

export async function generateDailyTip(ctx: TipAgentContext): Promise<GeneratedTip> {
  const persona = PERSONAS[ctx.persona];

  const systemPrompt = `Tu es l'Agent Conseils de deviensmarrant.fr — un coach en humour et répartie avec 20 ans d'expérience.

TON RÔLE : Créer UN conseil pratique et actionnable par jour.

PERSONA CIBLE AUJOURD'HUI : ${persona.name} (${persona.age} ans)
- Profil : ${persona.description}
- Centres d'intérêt : ${persona.interests.join(", ")}
- Ton attendu : ${persona.tone}
- Niveau recommandé : ${persona.tipDifficulty}

CATÉGORIES VALIDES : ${TIP_CATEGORIES.join(", ")}
DIFFICULTÉS VALIDES : ${TIP_DIFFICULTIES.join(", ")}

RÈGLES STRICTES :
1. Le conseil doit être PRATIQUE — testable immédiatement
2. L'exemple doit être CONCRET et adapté à la vie de ${persona.name}
3. L'exercice doit être réalisable dans la journée
4. La catégorie DOIT être "${ctx.plannedCategory}"
5. La difficulté doit correspondre au persona (${persona.tipDifficulty})
6. Le titre doit être percutant et donner envie de lire
7. Le contenu fait 150-200 mots, précis, jamais généraliste

IMPORTANT — NE PAS RÉPÉTER :
Voici les ${ctx.recentTips.length} derniers conseils publiés :
${ctx.recentTips.map((t, i) => `${i + 1}. [${t.category}/${t.difficulty}] ${t.title}`).join("\n")}

PLAN DU MOIS :
${ctx.monthlyPlanSummary}

Réponds UNIQUEMENT en JSON valide :
{
  "title": "Titre percutant (5-8 mots)",
  "content": "Explication détaillée (150-200 mots)",
  "category": "${ctx.plannedCategory}",
  "difficulty": "${persona.tipDifficulty}",
  "example": "Exemple concret adapté à ${persona.name}",
  "exercise": "Exercice pratique pour aujourd'hui"
}`;

  const response = await callWithRetry({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1200,
    system: systemPrompt,
    messages: [
      {
        role: "user",
        content: `Génère le conseil du jour.
Thème prévu : "${ctx.plannedTheme}"
Catégorie : ${ctx.plannedCategory}
Persona : ${persona.name} (${persona.age} ans, ${persona.description})

Crée un conseil qui aide ${persona.name} à progresser concrètement aujourd'hui.`,
      },
    ],
  });

  const text = getResponseText(response);
  const parsed = extractJson<GeneratedTip>(text);

  // Validation des champs obligatoires
  if (!parsed.title?.trim() || !parsed.content?.trim() || !parsed.example?.trim() || !parsed.exercise?.trim()) {
    throw new Error("Agent Conseils : un ou plusieurs champs obligatoires sont vides");
  }

  // Validation et fallback des enums
  if (!TIP_CATEGORIES.includes(parsed.category as (typeof TIP_CATEGORIES)[number])) {
    parsed.category = ctx.plannedCategory;
  }
  if (!TIP_DIFFICULTIES.includes(parsed.difficulty as (typeof TIP_DIFFICULTIES)[number])) {
    parsed.difficulty = persona.tipDifficulty;
  }

  // Tronquer si excessivement long
  parsed.title = parsed.title.trim().slice(0, 200);
  parsed.content = parsed.content.trim().slice(0, 2000);
  parsed.example = parsed.example.trim().slice(0, 1000);
  parsed.exercise = parsed.exercise.trim().slice(0, 1000);

  return parsed;
}

/**
 * Génère le plan mensuel de conseils via l'IA
 */
export async function generateTipMonthlyPlan(
  month: number,
  year: number,
  daysInMonth: number
): Promise<Array<{ dayOfMonth: number; category: string; theme: string; targetPersona: string }>> {
  const response = await callWithRetry({
    model: "claude-sonnet-4-20250514",
    max_tokens: 4000,
    system: `Tu es le planificateur de l'Agent Conseils de deviensmarrant.fr.

Tu dois créer un plan de contenu pour ${daysInMonth} jours (${month}/${year}).

3 PERSONAS à servir en rotation :
- Jour 1, 4, 7... → YANIS (17 ans) : niveau DEBUTANT, catégories = REPARTIE, AUTODERISION, TIMING, ABSURDE
- Jour 2, 5, 8... → SOPHIE (26 ans) : niveau INTERMEDIAIRE, catégories = TIMING, OBSERVATION, STORYTELLING, JEUX_DE_MOTS
- Jour 3, 6, 9... → MARC (34 ans) : niveau INTERMEDIAIRE, catégories = STORYTELLING, AUTODERISION, REPARTIE, OBSERVATION, TIMING

RÈGLES :
1. Progression pédagogique sur le mois (les conseils s'enchaînent logiquement)
2. Varier les catégories — pas 2 jours consécutifs identiques
3. Les thèmes doivent être spécifiques (pas "être drôle" mais "placer une vanne en réunion")
4. Adapter les thèmes à la saison/contexte du mois

Réponds UNIQUEMENT en JSON — un tableau de ${daysInMonth} objets :
[{"dayOfMonth": 1, "category": "REPARTIE", "theme": "Répondre quand on te chambre en classe", "targetPersona": "YANIS"}, ...]`,
    messages: [
      {
        role: "user",
        content: `Génère le plan de conseils pour ${month}/${year} (${daysInMonth} jours).`,
      },
    ],
  });

  const text = getResponseText(response);
  const raw = extractJsonArray<{ dayOfMonth: number; category: string; theme: string; targetPersona: string }>(text);

  return validateMonthlyPlan(raw, daysInMonth, TIP_CATEGORIES as unknown as readonly string[], getPersonaForDay);
}
