/**
 * Puces « Ce que tu vas apprendre » : « TITRE EN MAJUSCULES : explication ».
 * Sépare le titre de l'explication pour le rendu (titre en gras, casse phrase
 * s'il est entièrement en majuscules). Le texte stocké n'est pas modifié.
 */
export function splitLearning(learning: string): { title: string; rest: string } | null {
  const k = learning.indexOf(" : ");
  if (k <= 0) return null;
  const raw = learning.slice(0, k);
  const title = raw === raw.toUpperCase() ? raw.charAt(0) + raw.slice(1).toLowerCase() : raw;
  return { title, rest: learning.slice(k) };
}
