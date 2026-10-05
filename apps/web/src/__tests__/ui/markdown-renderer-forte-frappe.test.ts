/**
 * Partage par ligne des articles à forte frappe importés en base : markdown réel
 * produit par l'import (scripts/content/import-article, même parseur que le
 * dry-run), FAQ retirée comme sur la page (lib/blog-faq).
 * - A1 : lignes « **N.** texte » sans guillemets, indication en italique dessous ;
 * - A3 : titre « **N. Situation** » puis message en blockquote.
 */
import fs from "node:fs";
import path from "node:path";
import { renderMarkdown } from "@/components/ui/markdown-renderer";
import { splitTrailingFaq } from "@/lib/blog-faq";
import { parseArticleMarkdown, toBlogArticleRow } from "../../../scripts/content/article-markdown";

const DOCS = path.resolve(__dirname, "../../../../../docs/copy/articles-forte-frappe");

function importedContent(file: string): string {
  const parsed = parseArticleMarkdown(fs.readFileSync(path.join(DOCS, file), "utf8"));
  return splitTrailingFaq(toBlogArticleRow(parsed, new Date("2026-10-29T05:00:00Z")).content).content;
}

const slots = (html: string) =>
  [...html.matchAll(/data-share-vanne="(\d+)" data-text="([^"]*)"/g)].map((m) => ({ n: Number(m[1]), text: m[2] }));

describe("A1 importé : lignes « **N.** texte » sans guillemets", () => {
  const content = importedContent("A1-message-anniversaire-drole.md");
  const html = renderMarkdown(content, { shareJokes: true });

  it("21 emplacements numérotés, H2 intacts, rien sans l'option", () => {
    expect(slots(html).map((s) => s.n)).toEqual(Array.from({ length: 21 }, (_, i) => i + 1));
    expect(html.match(/<h2 id=/g)).toHaveLength(6);
    expect(renderMarkdown(content)).not.toContain("data-share-vanne");
  });

  it("texte partagé = la ligne seule : ni numéro, ni indication, ni markdown", () => {
    const [first] = slots(html);
    expect(first.text).toBe("Joyeux anniversaire. J'ai cherché une photo de nous deux. J'ai trouvé toi, toi, toi et mon pouce.");
    for (const { text } of slots(html)) {
      expect(text).not.toMatch(/^\d|\*|→|\]\(|WhatsApp, premier message/);
      expect(text.length).toBeGreaterThan(20);
    }
  });
});

describe("A3 importé : titre « **N. Situation** » puis message en blockquote", () => {
  const content = importedContent("A3-premier-message-appli-rencontre.md");
  const html = renderMarkdown(content, { shareJokes: true });

  it("un emplacement par message, ancré sur son titre", () => {
    expect(slots(html).map((s) => s.n)).toEqual(Array.from({ length: 18 }, (_, i) => i + 1)); // 18 depuis le découpage « un message par numéro » (05/10)
    expect(html).toContain('<div id="vanne-1" class="flow-root scroll-mt-20"><span data-share-vanne="1"');
    // Le titre de situation reste affiché, le message reste un blockquote.
    expect(html).toMatch(/<div id="vanne-1"[^]*?Sa bio dit[^]*?<blockquote[^]*?Le dimanche, tout est fermé\.[^]*?<\/blockquote><\/div>/);
  });

  it("texte partagé = le blockquote seul, sans guillemets ajoutés ni numéro ; « » imbriqués en “…”", () => {
    const texts = slots(html).map((s) => s.text);
    expect(texts[0]).toBe("Le dimanche, tout est fermé. J'ai déjà remplacé le citron par du vinaigre. Les invités ont été très polis.");
    expect(texts[1]).toBe("Ma dernière blague en réunion a reçu un “merci pour l'info”.");
    expect(texts).toContain("“Plus tard”, j'ai dit ça à ma vaisselle il y a une semaine. Prends ton temps.");
    for (const text of texts) expect(text).not.toMatch(/^>|^\d|«|»|\*/);
  });

  it("affichage : « » imbriqués du message en “…”, titres inchangés", () => {
    const quote = /<blockquote[^>]*>([^]*?)<\/blockquote><\/div>/.exec(html.slice(html.indexOf('id="vanne-2"')))![1];
    expect(quote).toContain("“merci pour l");
    expect(quote).not.toMatch(/[«»]/);
    expect(html).toMatch(/Sa bio dit.:.«.Cherche quelqu/);
  });

  it("sans l'option (slug hors liste) : rendu d'origine, « » conservés", () => {
    const plain = renderMarkdown(content);
    expect(plain).not.toContain("data-share-vanne");
    expect(plain).toMatch(/réunion a reçu un «/);
  });
});
