import type { PersonaKey } from "./personas";

interface PlanEntry {
  dayOfMonth: number;
  category: string;
  theme: string;
  targetPersona: string;
}

const VALID_PERSONAS = ["YANIS", "SOPHIE", "MARC"];

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
