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

// Lettres de mot, accents français compris (sans \p{L} pour rester compatible ES2017).
const WORD = "A-Za-zÀ-ÖØ-öø-ÿŒœ";
const UPPER_RE = /^[A-ZÀ-ÖØ-ÞŒ]+$/;
const INVERTED_RE = /^[a-zß-öø-ÿœ][A-ZÀ-ÖØ-ÞŒ]+$/;

function swapCase(word: string): string {
  return Array.from(word)
    .map((c) => (c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()))
    .join("");
}

/**
 * Casse inversée par verrouillage majuscule dans la donnée (« eN GROUPE » pour
 * « En groupe ») : corrigée AU RENDU uniquement, la base n'est pas modifiée.
 * Déclencheur : un mot minuscule + majuscules (« eN »), forme qui n'existe pas en
 * français. On inverse ce mot et les mots tout en majuscules qui le suivent
 * immédiatement (même frappe). Tout autre texte est rendu tel quel.
 */
export function fixInvertedCase(text: string): string {
  if (!text) return text;
  const parts = text.split(new RegExp(`([${WORD}]+)`));
  let inRun = false;
  return parts
    .map((part, i) => {
      const isWord = i % 2 === 1;
      if (!isWord) {
        // Une ponctuation forte termine la frappe inversée.
        if (/[.!?:;]/.test(part)) inRun = false;
        return part;
      }
      if (INVERTED_RE.test(part)) {
        inRun = true;
        return swapCase(part);
      }
      if (inRun && part.length > 1 && UPPER_RE.test(part)) return part.toLowerCase();
      inRun = false;
      return part;
    })
    .join("");
}
