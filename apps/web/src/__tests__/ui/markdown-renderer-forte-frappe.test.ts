/**
 * Partage par ligne des articles à forte frappe importés en base : markdown réel
 * produit par l'import (scripts/content/import-article, même parseur que le
 * dry-run), FAQ retirée comme sur la page (lib/blog-faq).
 * - A1 : lignes « **N.** texte » sans guillemets, indication en italique dessous ;
 * - A3 : titre « **N. Situation** » puis message en blockquote, ses « » restent « » ;
 * - A4 : « **N.** « … » » avec des « » imbriqués, 2e niveau rendu en “…” ;
 * - B2 : « **N.** « … » » avec des « » imbriqués, 2e niveau rendu en “…”.
 */
import fs from "node:fs";
import path from "node:path";
import { nestedGuillemets, renderMarkdown } from "@/components/ui/markdown-renderer";
import { FORTE_FRAPPE_PARCOURS, FORTE_FRAPPE_SHARE, shareLabel, shareTitle } from "@/config/blog-forte-frappe";
import { splitTrailingFaq } from "@/lib/blog-faq";
import { parseArticleMarkdown, toBlogArticleRow } from "../../../scripts/content/article-markdown";

const DOCS = path.resolve(__dirname, "../../../../../docs/copy/articles-forte-frappe");

function importedContent(file: string): string {
  const parsed = parseArticleMarkdown(fs.readFileSync(path.join(DOCS, file), "utf8"));
  return splitTrailingFaq(toBlogArticleRow(parsed, new Date("2026-10-29T05:00:00Z")).content).content;
}

/** Profondeur maximale de « » (2 = guillemets français imbriqués). */
function maxGuillemetDepth(text: string): number {
  let depth = 0;
  let max = 0;
  for (const c of text) {
    if (c === "«") max = Math.max(max, ++depth);
    if (c === "»") depth--;
  }
  return max;
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

describe("A2 importé : lignes « **N.** texte », envoi du texte seul", () => {
  const content = importedContent("A2-voeux-drole-nouvelle-annee.md");
  const html = renderMarkdown(content, { shareJokes: true });

  it("27 emplacements numérotés (aucun message collé à un paragraphe), 7 H2", () => {
    expect(slots(html).map((s) => s.n)).toEqual(Array.from({ length: 27 }, (_, i) => i + 1));
    expect(html.match(/<h2 id=/g)).toHaveLength(7);
  });

  it("texte partagé = le message seul", () => {
    const texts = slots(html).map((s) => s.text);
    expect(texts[19]).toBe("Bonne année à tous. Je vous écris depuis le balcon, le seul endroit où ça capte. Il y a du monde.");
    for (const text of texts) expect(text).not.toMatch(/^\d|\*|→|À minuit/);
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

  it("texte partagé = le blockquote seul, sans guillemets ajoutés ni numéro ; « » du message conservés", () => {
    const texts = slots(html).map((s) => s.text);
    expect(texts[0]).toBe("Le dimanche, tout est fermé. J'ai déjà remplacé le citron par du vinaigre. Les invités ont été très polis.");
    expect(texts[1]).toMatch(/^Ma dernière blague en réunion a reçu un «\s?merci pour l'info\s?»\.$/);
    expect(texts).toContainEqual(expect.stringMatching(/^«\s?Plus tard\s?», j'ai dit ça à ma vaisselle/));
    for (const text of texts) expect(text).not.toMatch(/^>|^\d|“|”|\*/);
  });

  it("affichage : « » du message conservés (1er niveau, notation A3 iter3), titres inchangés", () => {
    const quote = /<blockquote[^>]*>([^]*?)<\/blockquote><\/div>/.exec(html.slice(html.indexOf('id="vanne-2"')))![1];
    expect(quote).toMatch(/«.merci pour l/);
    expect(quote).not.toMatch(/[“”]/);
    expect(html).toMatch(/Sa bio dit.:.«.Cherche quelqu/);
  });

  it("sans l'option (slug hors liste) : rendu d'origine, « » conservés", () => {
    const plain = renderMarkdown(content);
    expect(plain).not.toContain("data-share-vanne");
    expect(plain).toMatch(/réunion a reçu un «/);
  });
});

describe("A4 importé : vannes « … » qui citent des « … » (notation A4 iter3)", () => {
  const content = importedContent("A4-blagues-de-couple.md");
  const html = renderMarkdown(content, { shareJokes: true });

  it("30 emplacements ; 2e niveau en “…”, affiché et partagé", () => {
    expect(slots(html).map((s) => s.n)).toEqual(Array.from({ length: 30 }, (_, i) => i + 1));
    const shared = slots(html)[2].text;
    expect(shared.match(/«/g)).toHaveLength(1);
    expect(shared).toContain("“j");
    const shown = html.slice(html.indexOf('id="vanne-3"'), html.indexOf('id="vanne-4"'));
    expect(shown.match(/«/g)).toHaveLength(2); // 1 dans data-text, 1 affiché (indication n°3 sans « »)
  });

  it("aucun « » imbriqué dans un « » à l'affichage ni au partage", () => {
    for (let n = 1; n <= 30; n++) {
      const start = html.indexOf(`<div id="vanne-${n}"`);
      const shown = html.slice(start, html.indexOf("</div>", start)).replace(/<[^>]+>/g, "");
      expect(maxGuillemetDepth(shown)).toBeLessThan(2);
    }
    for (const { text } of slots(html)) expect(maxGuillemetDepth(text)).toBeLessThan(2);
    expect(slots(html).filter((s) => s.text.includes("“"))).toHaveLength(10);
  });
});

describe("nestedGuillemets : « » à deux niveaux, rendu seul (notation B2 iter2)", () => {
  it("2e niveau en “…”, un seul niveau ou imbrication déséquilibrée inchangés", () => {
    expect(nestedGuillemets("« Il dit « bonsoir ». Fin. »")).toBe("« Il dit “bonsoir”. Fin. »");
    expect(nestedGuillemets("« Un » puis « deux »")).toBe("« Un » puis « deux »");
    expect(nestedGuillemets("« Il dit « bonsoir ». Fin.")).toBe("« Il dit « bonsoir ». Fin.");
    expect(nestedGuillemets("« a « b « c » » »")).toBe("« a « b « c » » »");
  });
});

describe("B2 importé : lignes « **N.** « … » » à guillemets imbriqués", () => {
  const file = "B2-blagues-de-gamer.md";
  const source = fs.readFileSync(path.join(DOCS, file), "utf8");
  const content = importedContent(file);
  const html = renderMarkdown(content, { shareJokes: true });
  const blockOf = (n: number) => {
    const start = html.indexOf(`<div id="vanne-${n}"`);
    return html.slice(start, html.indexOf("</div>", start));
  };

  it("24 emplacements numérotés", () => {
    expect(slots(html).map((s) => s.n)).toEqual(Array.from({ length: 24 }, (_, i) => i + 1));
  });

  it("affichage : aucun « » imbriqué, 2e niveau en “…” ; texte stocké intact", () => {
    for (let n = 1; n <= 24; n++) {
      expect(maxGuillemetDepth(blockOf(n).replace(/<[^>]+>/g, ""))).toBeLessThan(2);
    }
    expect(blockOf(7)).toMatch(/dit “bonsoir à tous”\. Quatre hommes de trente ans ont répondu “bonsoir madame”\./);
    expect(source).toContain("dit « bonsoir à tous ». Quatre");
    expect(content).toContain("dit « bonsoir à tous ». Quatre");
  });

  it("texte partagé cohérent avec A3 : 2e niveau en “…”, guillemets extérieurs conservés", () => {
    const texts = slots(html).map((s) => s.text);
    for (const text of texts) {
      expect(text).toMatch(/^« .* »$/);
      expect(text.slice(1, -1)).not.toMatch(/[«»]/);
    }
    expect(texts[17]).toBe("« Ma grand-mère est niveau 4 812 dans son jeu de bonbons. Je suis niveau 60 dans mon jeu de rôle. Elle m'a dit “c'est un bon début”. »");
    expect(texts.filter((t) => t.includes("“"))).toHaveLength(9);
  });

  it("n°18 : « 4 812 » insécable à l'affichage", () => {
    expect(blockOf(18)).toContain(`niveau 4${String.fromCharCode(0xa0)}812`);
  });
});

describe("Libellé du bouton de partage (notation A5 iter2)", () => {
  it("A5 : « Partager l'idée n°N », titre adapté, mode with-url conservé", () => {
    expect(FORTE_FRAPPE_SHARE["blagues-poisson-d-avril-adultes"]).toBe("with-url");
    expect(shareLabel("blagues-poisson-d-avril-adultes", "with-url", "3")).toBe("Partager l'idée n°3");
    expect(shareTitle("blagues-poisson-d-avril-adultes")).toBe("Idée de poisson d'avril - deviens-marrant.fr");
  });

  it("les autres slugs ne bougent pas", () => {
    expect(shareLabel("blagues-de-gamer-jeux-video", "with-url", "7")).toBe("Partager la vanne n°7");
    expect(shareLabel("voeux-drole-nouvelle-annee", "text-only", "2")).toBe("Envoyer le message n°2");
    expect(shareTitle("blagues-de-gamer-jeux-video")).toBe("Vanne - deviens-marrant.fr");
    expect(FORTE_FRAPPE_PARCOURS["blagues-de-gamer-jeux-video"]).toBe("repartie");
  });
});
