// Personas de référence — guident la sélection et la création de contenu

export const PERSONAS = {
  YANIS: {
    name: "Yanis",
    age: 17,
    description: "Lycéen introverti, veut progresser en répartie pour s'affirmer",
    interests: ["école", "gaming", "réseaux sociaux", "soirées", "dating"],
    tone: "encourageant, non intimidant, adapté aux ados",
    jokeCategories: ["ECOLE", "GAMING", "RESEAUX_SOCIAUX", "AUTODERISION", "ABSURDE", "DATING"],
    tipCategories: ["REPARTIE", "AUTODERISION", "TIMING", "ABSURDE"],
    tipDifficulty: "DEBUTANT",
  },
  SOPHIE: {
    name: "Sophie",
    age: 26,
    description: "Jeune active, veut alimenter ses conversations au bureau et entre amis",
    interests: ["boulot", "couple", "soirées", "situations sociales", "culture"],
    tone: "dynamique, complice, blagues courtes et mémorisables",
    jokeCategories: ["BOULOT", "SITUATION", "OBSERVATIONNEL", "JEUX_DE_MOTS", "COUPLE", "CULTUREL", "SOIREES"],
    tipCategories: ["TIMING", "OBSERVATION", "STORYTELLING", "JEUX_DE_MOTS"],
    tipDifficulty: "INTERMEDIAIRE",
  },
  MARC: {
    name: "Marc",
    age: 34,
    description: "Récemment séparé, veut retrouver confiance et humour dans ses interactions",
    interests: ["couple", "parents", "boulot", "soirées", "dating", "culture"],
    tone: "bienveillant sans infantiliser, profond, progression structurée",
    jokeCategories: ["COUPLE", "PARENTS", "BOULOT", "AUTODERISION", "OBSERVATIONNEL", "DATING", "CULTUREL"],
    tipCategories: ["STORYTELLING", "AUTODERISION", "REPARTIE", "OBSERVATION", "TIMING"],
    tipDifficulty: "INTERMEDIAIRE",
  },
} as const;

export type PersonaKey = keyof typeof PERSONAS;

const PERSONA_ORDER: PersonaKey[] = ["YANIS", "SOPHIE", "MARC"];

// Rotation des personas sur le mois pour assurer la variété
export function getPersonaForDay(dayOfMonth: number): PersonaKey {
  return PERSONA_ORDER[(dayOfMonth - 1) % 3];
}

/**
 * Génère la section "personas en rotation" pour les prompts de planification.
 * Source unique de vérité — évite la divergence entre prompts et code.
 */
export function buildPersonaRotationPrompt(
  categoryField: "jokeCategories" | "tipCategories"
): string {
  return PERSONA_ORDER.map((key, i) => {
    const p = PERSONAS[key];
    const days = `Jour ${i + 1}, ${i + 4}, ${i + 7}...`;
    const cats = p[categoryField].join(", ");
    const difficulty = categoryField === "tipCategories" ? ` (${p.tipDifficulty})` : "";
    return `- ${days} → ${key} (${p.name}, ${p.age} ans${difficulty}) : catégories = ${cats}`;
  }).join("\n");
}
