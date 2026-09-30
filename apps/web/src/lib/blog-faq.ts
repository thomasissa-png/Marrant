/**
 * FAQ des articles de blog STOCKÉS EN BASE (s14).
 *
 * La table BlogArticle n'a pas de colonne FAQ : la FAQ d'un article importé
 * (scripts/content/import-article.ts) est stockée à la fin de `content`, au
 * format des brouillons docs/copy/articles-q4 :
 *
 *   ## FAQ              (ou « ## Questions fréquentes »)
 *   ### Question ?
 *   Réponse (un ou plusieurs paragraphes, texte brut).
 *
 * `splitTrailingFaq` la sort du markdown pour la rendre comme celle des
 * articles statiques (bloc « Questions fréquentes » + JSON-LD FAQPage).
 * Section non conforme (pas la dernière H2, question sans réponse, markdown
 * dans une réponse) → contenu laissé intact, FAQ vide : rendu markdown classique.
 */
export interface BlogFaq {
  question: string;
  answer: string;
}

const FAQ_HEADING = /^##[ \t]+(?:FAQ|Questions fréquentes)[ \t]*$/im;
/** Markdown non rendu dans un <dd> texte : lien, gras/italique, code, liste, citation, titre. */
const UNSUPPORTED_ANSWER_MARKDOWN = /\]\(|\*\*|__|`|^\s*[-*>#]\s|^\s*\d+\.\s/m;

export function splitTrailingFaq(content: string): { content: string; faqs: BlogFaq[] } {
  const untouched = { content, faqs: [] as BlogFaq[] };
  const match = FAQ_HEADING.exec(content);
  if (!match) return untouched;

  const section = content.slice(match.index + match[0].length);
  if (/^##[ \t]/m.test(section)) return untouched; // une H2 suit : pas la dernière section

  const blocks = section.split(/^###[ \t]+/m);
  if (blocks[0].trim() !== "") return untouched; // texte libre avant la première question

  const faqs: BlogFaq[] = [];
  for (const block of blocks.slice(1)) {
    const newline = block.indexOf("\n");
    const question = (newline === -1 ? block : block.slice(0, newline)).trim();
    const answer = (newline === -1 ? "" : block.slice(newline + 1))
      .split(/\n\s*\n/)
      .map((p) => p.replace(/\s*\n\s*/g, " ").trim())
      .filter(Boolean)
      .join(" ");
    if (!question || !answer || UNSUPPORTED_ANSWER_MARKDOWN.test(answer)) return untouched;
    faqs.push({ question, answer });
  }
  if (faqs.length === 0) return untouched;

  return { content: content.slice(0, match.index).trimEnd(), faqs };
}
