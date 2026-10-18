/**
 * Testing Library normalise le texte du DOM (`\s+` → espace) : une espace insécable
 * rendue devient une espace ordinaire. Pour chercher un texte de config qui en contient
 * (prix « 2,99 €/mois »), normaliser l'attendu de la même façon.
 */
export const normalise = (texte: string): string => texte.replace(/\s+/g, " ").trim();
