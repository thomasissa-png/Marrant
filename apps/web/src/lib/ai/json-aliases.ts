/**
 * Normalisation des clés JSON renvoyées par le LLM.
 *
 * Le modèle écrit parfois la clé en français (`"exercice"`) au lieu de
 * `"exercise"` (constaté le 30/09/2026, incident s14 : réécriture du conseil
 * par le Stand-Up Director rejetée pour « champs vides », conseil du jour perdu).
 */
export function withFrenchExerciseAlias<T extends { exercise?: string }>(
  parsed: T & { exercice?: unknown },
): T {
  if (!parsed.exercise?.trim() && typeof parsed.exercice === "string") {
    return { ...parsed, exercise: parsed.exercice };
  }
  return parsed;
}
