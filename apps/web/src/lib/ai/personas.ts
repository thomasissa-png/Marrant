// Personas de référence — guident la sélection et la création de contenu

export const PERSONAS = {
  YANIS: {
    name: "Yanis",
    age: 20,
    description: "Étudiant introverti, veut progresser en répartie pour s'affirmer en soirées et dans sa vie sociale",
    interests: ["études", "gaming", "réseaux sociaux", "soirées", "dating", "colocation"],
    tone: "encourageant, complice, ton décontracté entre potes",
    jokeCategories: ["ECOLE", "GAMING", "RESEAUX_SOCIAUX", "AUTODERISION", "ABSURDE", "DATING", "SOIREES"],
    tipCategories: ["REPARTIE", "AUTODERISION", "TIMING", "ABSURDE"],
    tipDifficulty: "DEBUTANT",
  },
  SOPHIE: {
    name: "Sophie",
    age: 26,
    description: "Jeune active, veut alimenter ses conversations au bureau et entre amis",
    interests: ["boulot", "couple", "soirées", "situations sociales", "culture"],
    tone: "dynamique, complice, vannes courtes et mémorisables",
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
 * Retourne la difficulté du conseil pour un persona et un jour donnés.
 * Marc alterne entre INTERMEDIAIRE (semaines impaires) et EXPERT (semaines paires)
 * pour couvrir plus de niveaux sur le cycle de 3 jours.
 *
 * Cycle résultant : Yanis=DEBUTANT, Sophie=INTERMEDIAIRE, Marc=INTERMEDIAIRE/EXPERT
 */
export function getDifficultyForDay(personaKey: PersonaKey, dayOfMonth: number): string {
  const persona = PERSONAS[personaKey];
  if (personaKey !== "MARC") return persona.tipDifficulty;

  // Marc alterne par semaine : semaines 1,3 = INTERMEDIAIRE, semaines 2,4 = EXPERT
  const weekOfMonth = Math.ceil(dayOfMonth / 7);
  return weekOfMonth % 2 === 1 ? "INTERMEDIAIRE" : "EXPERT";
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
