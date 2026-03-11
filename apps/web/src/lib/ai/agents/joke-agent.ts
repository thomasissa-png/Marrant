import { callWithRetry, extractJson, extractJsonArray, getResponseText } from "../client";
import { PERSONAS, type PersonaKey } from "../personas";
import { getPersonaForDay } from "../personas";
import { validateMonthlyPlan } from "../plan-validator";

const JOKE_CATEGORIES = [
  "AUTODERISION", "SITUATION", "ABSURDE", "OBSERVATIONNEL",
  "JEUX_DE_MOTS", "CULTUREL", "COUPLE", "BOULOT",
  "ECOLE", "GAMING", "RESEAUX_SOCIAUX", "DATING", "SOIREES", "PARENTS",
] as const;

const JOKE_TYPES = [
  "SUBTIL", "CLASSIQUE", "ABSURDE", "ONE_LINER", "STORY", "DIALOGUE", "QA",
] as const;

interface GeneratedJoke {
  content: string;
  punchline: string;
  category: string;
  type: string;
  maturityLevel: number;
}

interface JokeAgentContext {
  persona: PersonaKey;
  plannedCategory: string;
  plannedTheme: string;
  recentJokes: Array<{ content: string; category: string; type: string }>;
  monthlyPlanSummary: string;
}

export async function generateDailyJoke(ctx: JokeAgentContext): Promise<GeneratedJoke> {
  const persona = PERSONAS[ctx.persona];

  const systemPrompt = `Tu es l'Agent Blagues de deviensmarrant.fr — un expert en humour francophone.

TON RÔLE : Créer UNE blague originale par jour, adaptée au public cible du site.

PERSONA CIBLE AUJOURD'HUI : ${persona.name} (${persona.age} ans)
- Profil : ${persona.description}
- Centres d'intérêt : ${persona.interests.join(", ")}
- Ton attendu : ${persona.tone}

CATÉGORIES VALIDES : ${JOKE_CATEGORIES.join(", ")}
TYPES VALIDES : ${JOKE_TYPES.join(", ")}

RÈGLES STRICTES :
1. La blague doit être ORIGINALE — jamais une blague connue
2. Humour intelligent, jamais vulgaire ou offensant
3. Structure claire : setup + chute percutante
4. Adaptée au persona cible (vocabulaire, références, situations)
5. La catégorie DOIT être "${ctx.plannedCategory}"
6. maturityLevel de 1 (tout public) à 3 max (jamais au-delà)
7. Le type doit varier — évite de répéter les types récents

IMPORTANT — NE PAS RÉPÉTER :
Voici les ${ctx.recentJokes.length} dernières blagues publiées (NE PAS les plagier ni s'en rapprocher) :
${ctx.recentJokes.map((j, i) => `${i + 1}. [${j.category}/${j.type}] ${j.content}`).join("\n")}

PLAN DU MOIS (contexte pour cohérence) :
${ctx.monthlyPlanSummary}

Réponds UNIQUEMENT en JSON valide :
{
  "content": "Le setup de la blague (2-3 phrases max)",
  "punchline": "La chute (1 phrase percutante)",
  "category": "${ctx.plannedCategory}",
  "type": "UN_DES_TYPES_VALIDES",
  "maturityLevel": 1
}`;

  const response = await callWithRetry({
    model: "claude-sonnet-4-20250514",
    max_tokens: 600,
    system: systemPrompt,
    messages: [
      {
        role: "user",
        content: `Génère la blague du jour.
Thème prévu : "${ctx.plannedTheme}"
Catégorie : ${ctx.plannedCategory}
Persona : ${persona.name} (${persona.age} ans)

Crée une blague originale qui fera sourire ${persona.name} dans son quotidien.`,
      },
    ],
  });

  const text = getResponseText(response);
  const parsed = extractJson<GeneratedJoke>(text);

  // Validation des champs obligatoires
  if (!parsed.content?.trim() || !parsed.punchline?.trim()) {
    throw new Error("Agent Blagues : contenu ou punchline vide");
  }

  // Validation et fallback des enums
  if (!JOKE_CATEGORIES.includes(parsed.category as (typeof JOKE_CATEGORIES)[number])) {
    parsed.category = ctx.plannedCategory;
  }
  if (!JOKE_TYPES.includes(parsed.type as (typeof JOKE_TYPES)[number])) {
    parsed.type = "CLASSIQUE";
  }
  if (!parsed.maturityLevel || parsed.maturityLevel < 1 || parsed.maturityLevel > 5) {
    parsed.maturityLevel = 1;
  }

  // Tronquer si excessivement long
  parsed.content = parsed.content.trim().slice(0, 1000);
  parsed.punchline = parsed.punchline.trim().slice(0, 500);

  return parsed;
}

/**
 * Génère le plan mensuel de blagues via l'IA
 */
export async function generateJokeMonthlyPlan(
  month: number,
  year: number,
  daysInMonth: number
): Promise<Array<{ dayOfMonth: number; category: string; theme: string; targetPersona: string }>> {
  const response = await callWithRetry({
    model: "claude-sonnet-4-20250514",
    max_tokens: 4000,
    system: `Tu es le planificateur de l'Agent Blagues de deviensmarrant.fr.

Tu dois créer un plan de contenu pour ${daysInMonth} jours (${month}/${year}).

3 PERSONAS à servir en rotation :
- Jour 1, 4, 7... → YANIS (17 ans, lycéen) : catégories favorites = ECOLE, GAMING, RESEAUX_SOCIAUX, AUTODERISION, ABSURDE, DATING
- Jour 2, 5, 8... → SOPHIE (26 ans, active) : catégories favorites = BOULOT, SITUATION, OBSERVATIONNEL, JEUX_DE_MOTS, COUPLE, CULTUREL, SOIREES
- Jour 3, 6, 9... → MARC (34 ans, en reconstruction) : catégories favorites = COUPLE, PARENTS, BOULOT, AUTODERISION, OBSERVATIONNEL, DATING, CULTUREL

RÈGLES :
1. Chaque persona doit avoir ses catégories variées sur le mois
2. Ne jamais faire 2 jours consécutifs avec la même catégorie
3. Chaque thème doit être unique et spécifique
4. Les thèmes doivent refléter la saison/actualité du mois

Réponds UNIQUEMENT en JSON — un tableau de ${daysInMonth} objets :
[{"dayOfMonth": 1, "category": "ECOLE", "theme": "La rentrée et les profs", "targetPersona": "YANIS"}, ...]`,
    messages: [
      {
        role: "user",
        content: `Génère le plan de blagues pour ${month}/${year} (${daysInMonth} jours).`,
      },
    ],
  });

  const text = getResponseText(response);
  const raw = extractJsonArray<{ dayOfMonth: number; category: string; theme: string; targetPersona: string }>(text);

  return validateMonthlyPlan(raw, daysInMonth, JOKE_CATEGORIES as unknown as readonly string[], getPersonaForDay);
}
