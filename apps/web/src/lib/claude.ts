import Anthropic from "@anthropic-ai/sdk";

// Client Anthropic — singleton
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Prompt système pour la génération de blagues
const JOKE_SYSTEM_PROMPT = `Tu es un expert en humour francophone, spécialisé dans l'humour mature et bienveillant.
Tu écris des blagues pour les 15-35 ans. Ton humour est intelligent, jamais vulgaire
gratuitement, jamais offensant. Tu maîtrises : l'absurde, l'auto-dérision,
l'observationnel, le jeu de mots élégant. Chaque blague a une structure claire
(setup + chute) et provoque un vrai sourire.

Réponds toujours en JSON avec le format :
{
  "content": "Le setup de la blague",
  "punchline": "La chute",
  "category": "AUTODERISION | SITUATION | ABSURDE | OBSERVATIONNEL | JEUX_DE_MOTS | CULTUREL | COUPLE | BOULOT"
}`;

// Prompt système pour les conseils personnalisés
const TIP_SYSTEM_PROMPT = `Tu es un coach en humour et répartie avec 20 ans d'expérience en stand-up.
Tu aides les gens à devenir drôles de façon naturelle et authentique.
Tes conseils sont pratiques, actionnables, illustrés d'exemples concrets.
Tu ne donnes jamais de conseils généralistes — toujours du spécifique, du testable.

Réponds toujours en JSON avec le format :
{
  "title": "Titre percutant du conseil",
  "content": "Explication détaillée (150-200 mots)",
  "example": "Exemple concret",
  "exercise": "Exercice pratique à faire"
}`;

// Prompt système pour l'analyse de répartie
const REPARTEE_SYSTEM_PROMPT = `Tu es un maître de la répartie avec un sens de l'humour affûté.
On te décrit une situation sociale et tu proposes 3 réponses humoristiques possibles,
de la plus subtile à la plus audacieuse. Chaque réponse est annotée avec la technique utilisée.

Réponds toujours en JSON avec le format :
{
  "responses": [
    { "text": "La réponse", "technique": "La technique utilisée", "level": "subtil | moyen | audacieux" }
  ]
}`;

/**
 * Génère une blague personnalisée avec Claude
 */
export async function generateJoke(preferences: {
  categories?: string[];
  level?: string;
}): Promise<{ content: string; punchline: string; category: string }> {
  const userMessage = `Génère une blague originale.${
    preferences.categories?.length
      ? ` Catégories préférées : ${preferences.categories.join(", ")}.`
      : ""
  }${preferences.level ? ` Niveau : ${preferences.level}.` : ""}`;

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 500,
    system: JOKE_SYSTEM_PROMPT,
    messages: [{ role: "user", content: userMessage }],
  });

  const text =
    response.content[0].type === "text" ? response.content[0].text : "";
  return JSON.parse(text);
}

/**
 * Génère un conseil personnalisé avec Claude
 */
export async function generateTip(context: {
  currentLevel?: string;
  weakCategories?: string[];
}): Promise<{
  title: string;
  content: string;
  example: string;
  exercise: string;
}> {
  const userMessage = `Génère un conseil d'humour personnalisé.${
    context.currentLevel ? ` Niveau actuel : ${context.currentLevel}.` : ""
  }${
    context.weakCategories?.length
      ? ` Points à améliorer : ${context.weakCategories.join(", ")}.`
      : ""
  }`;

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1000,
    system: TIP_SYSTEM_PROMPT,
    messages: [{ role: "user", content: userMessage }],
  });

  const text =
    response.content[0].type === "text" ? response.content[0].text : "";
  return JSON.parse(text);
}

/**
 * Analyse une situation et propose des réponses humoristiques
 */
export async function analyzeRepartee(
  situation: string
): Promise<{
  responses: Array<{ text: string; technique: string; level: string }>;
}> {
  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1000,
    system: REPARTEE_SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: `Situation : ${situation}\n\nPropose 3 réponses humoristiques.`,
      },
    ],
  });

  const text =
    response.content[0].type === "text" ? response.content[0].text : "";
  return JSON.parse(text);
}
