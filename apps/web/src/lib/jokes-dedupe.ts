/**
 * Dédoublonnage des vannes à l'affichage (passe UX s12, T12).
 * La base contient des copies d'une même vanne (générations successives) :
 * on ne les supprime pas en base (recopiée telle quelle à la bascule),
 * on ne les affiche qu'une fois.
 */

/** Clé de comparaison : casse, espaces et formes Unicode neutralisés. */
export function jokeContentKey(content: string): string {
  return content.normalize("NFKC").toLowerCase().replace(/\s+/g, " ").trim();
}

/**
 * Garde la première occurrence de chaque contenu, dans l'ordre reçu
 * (donc la plus récente si la liste est triée par date décroissante).
 */
export function dedupeJokesByContent<T extends { content: string }>(jokes: readonly T[]): T[] {
  const seen = new Set<string>();
  const unique: T[] = [];
  for (const joke of jokes) {
    const key = jokeContentKey(joke.content);
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push(joke);
  }
  return unique;
}
