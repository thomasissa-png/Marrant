/**
 * Longueur d'un post comptée par X (twitter-text v3) : chaque lien vaut 23
 * caractères, le latin et la ponctuation courante 1, les autres caractères 2.
 * Partagée par le cron publish-social et le contrôle du lot (scripts/content).
 */
function poidsX(cp: number): number {
  const un = (cp >= 0 && cp <= 0x10ff) || (cp >= 0x2000 && cp <= 0x200d) || (cp >= 0x2010 && cp <= 0x201f) || (cp >= 0x2032 && cp <= 0x2037);
  return un ? 1 : 2;
}

export const X_LONGUEUR_LIEN = 23;

export function longueurX(texte: string): number {
  const url = /https?:\/\/\S+/g;
  const liens = texte.match(url)?.length ?? 0;
  let n = 0;
  for (const ch of texte.replace(url, "")) n += poidsX(ch.codePointAt(0) ?? 0);
  return n + liens * X_LONGUEUR_LIEN;
}
