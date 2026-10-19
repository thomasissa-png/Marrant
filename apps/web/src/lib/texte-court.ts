/**
 * Règle de coupe unique des textes courts (textes-trajet-v3 CT1, CT2) : phrases ENTIÈRES tant que le
 * total tient en `max` caractères (≈ 110) ; si la première phrase seule les dépasse, coupe au mot et
 * « … ». Jamais une coupe au milieu d'un mot (remplace les 70 caractères du rappel de la fenêtre
 * Premium et le `line-clamp-3` de la carte « Étape 2 sur N »).
 */
export const TEXTE_COURT_MAX = 110;

/** Phrases avec leur ponctuation finale (. ! ? …), espaces normalisés. */
function phrases(texte: string): string[] {
  return texte.match(/[^.!?…]+(?:[.!?…]+[»"”)]*|$)/g)?.map((p) => p.trim()).filter(Boolean) ?? [];
}

export function phrasesEntieres(texte: string | null | undefined, max = TEXTE_COURT_MAX): string {
  const net = (texte ?? "").replace(/\s+/g, " ").trim();
  if (net.length <= max) return net;
  let garde = "";
  for (const p of phrases(net)) {
    const suivant = garde ? `${garde} ${p}` : p;
    if (suivant.length > max) break;
    garde = suivant;
  }
  if (garde) return garde;
  const coupe = net.slice(0, max);
  const espace = coupe.lastIndexOf(" ");
  return `${(espace > 0 ? coupe.slice(0, espace) : coupe).replace(/[\s,;:.!?…-]+$/, "")}…`;
}
