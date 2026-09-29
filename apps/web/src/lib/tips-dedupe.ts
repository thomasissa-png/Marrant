import { jokeContentKey } from "@/lib/jokes-dedupe";

/**
 * Dédoublonnage des conseils à l'affichage (vérification finale s12, N12).
 * Même principe que les vannes (`jokes-dedupe.ts`) : la base contient des conseils
 * au titre identique (générations successives) ; rien n'est supprimé en base,
 * on n'en affiche qu'un par titre.
 */
export function tipTitleKey(title: string): string {
  return jokeContentKey(title);
}

/** Garde la première occurrence de chaque titre, dans l'ordre reçu. */
export function dedupeTipsByTitle<T extends { title: string }>(tips: readonly T[]): T[] {
  const seen = new Set<string>();
  const unique: T[] = [];
  for (const tip of tips) {
    const key = tipTitleKey(tip.title);
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push(tip);
  }
  return unique;
}
