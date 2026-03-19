import type { PersonaKey } from "./personas";

export interface PlanEntry {
  dayOfMonth: number;
  category: string;
  theme: string;
  targetPersona: string;
}

const VALID_PERSONAS = ["YANIS", "SOPHIE", "MARC"];

/**
 * Catégories partagées entre vannes et conseils/vidéos.
 * Ce sont les seules qui risquent de créer une redondance inter-agents.
 */
const SHARED_CATEGORIES = ["AUTODERISION", "ABSURDE", "JEUX_DE_MOTS"];

/**
 * Valide et complète un plan mensuel généré par l'IA.
 * - Vérifie que chaque jour a une entrée
 * - Corrige les catégories/personas invalides
 * - Comble les jours manquants avec des valeurs par défaut
 */
export function validateMonthlyPlan(
  rawEntries: PlanEntry[],
  daysInMonth: number,
  validCategories: readonly string[],
  getPersona: (day: number) => PersonaKey
): PlanEntry[] {
  // Indexer les entrées par jour
  const entriesByDay = new Map<number, PlanEntry>();
  for (const entry of rawEntries) {
    if (
      typeof entry.dayOfMonth === "number" &&
      entry.dayOfMonth >= 1 &&
      entry.dayOfMonth <= daysInMonth &&
      !entriesByDay.has(entry.dayOfMonth)
    ) {
      entriesByDay.set(entry.dayOfMonth, entry);
    }
  }

  const result: PlanEntry[] = [];

  for (let day = 1; day <= daysInMonth; day++) {
    const existing = entriesByDay.get(day);
    const persona = getPersona(day);

    if (existing) {
      // Valider la catégorie
      if (!validCategories.includes(existing.category)) {
        existing.category = validCategories[day % validCategories.length];
      }
      // Valider le persona
      if (!VALID_PERSONAS.includes(existing.targetPersona)) {
        existing.targetPersona = persona;
      }
      // Valider le thème
      if (!existing.theme?.trim()) {
        existing.theme = `Contenu du jour ${day}`;
      }
      result.push(existing);
    } else {
      // Générer une entrée par défaut pour le jour manquant
      result.push({
        dayOfMonth: day,
        category: validCategories[day % validCategories.length],
        theme: `Contenu du jour ${day}`,
        targetPersona: persona,
      });
    }
  }

  return result;
}

/**
 * Harmonise les 3 plans mensuels pour garantir la diversité inter-agents.
 *
 * Pour chaque jour du mois :
 * 1. Détecte si 2+ agents ont la même catégorie (parmi les catégories partagées)
 * 2. Garde la catégorie du premier agent (vanne), réassigne les autres
 * 3. Vérifie que tip ≠ vidéo (même espace de catégories)
 *
 * Retourne les plans modifiés en place.
 */
export function harmonizeCrossAgentPlans(
  jokePlan: PlanEntry[],
  tipPlan: PlanEntry[],
  videoPlan: PlanEntry[],
  tipCategories: readonly string[]
): { jokePlan: PlanEntry[]; tipPlan: PlanEntry[]; videoPlan: PlanEntry[] } {
  const daysInMonth = Math.min(jokePlan.length, tipPlan.length, videoPlan.length);

  for (let i = 0; i < daysInMonth; i++) {
    const joke = jokePlan[i];
    const tip = tipPlan[i];
    const video = videoPlan[i];

    // 1. Résoudre tip vs joke : si le tip a la même catégorie partagée que la vanne
    if (SHARED_CATEGORIES.includes(tip.category) && tip.category === joke.category) {
      tip.category = pickAlternativeCategory(
        tip.category,
        [joke.category, video.category],
        tipCategories,
        i
      );
    }

    // 2. Résoudre vidéo vs joke : si la vidéo a la même catégorie partagée que la vanne
    if (SHARED_CATEGORIES.includes(video.category) && video.category === joke.category) {
      video.category = pickAlternativeCategory(
        video.category,
        [joke.category, tip.category],
        tipCategories,
        i
      );
    }

    // 3. Résoudre tip vs vidéo : même espace de catégories, ne doivent jamais être identiques
    if (tip.category === video.category) {
      video.category = pickAlternativeCategory(
        video.category,
        [tip.category, joke.category],
        tipCategories,
        i
      );
    }
  }

  return { jokePlan, tipPlan, videoPlan };
}

/**
 * Choisit une catégorie alternative qui n'est pas dans la liste d'exclusion.
 * Utilise le jour pour varier le choix de manière déterministe.
 */
function pickAlternativeCategory(
  currentCategory: string,
  excludeCategories: string[],
  validCategories: readonly string[],
  dayIndex: number
): string {
  const excluded = new Set([currentCategory, ...excludeCategories]);
  const alternatives = validCategories.filter((c) => !excluded.has(c));

  if (alternatives.length === 0) {
    // Fallback : au moins éviter la catégorie actuelle
    const fallbacks = validCategories.filter((c) => c !== currentCategory);
    return fallbacks[dayIndex % fallbacks.length] ?? currentCategory;
  }

  return alternatives[dayIndex % alternatives.length];
}
