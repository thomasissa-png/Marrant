/**
 * @jest-environment node
 *
 * s27 (25/11/2026, décision de Thomas « Je suis tes recos. Avance maximale ») : paragraphes de tête
 * de 4 articles et 2 phrases de lien dans l'article blagues. Textes copiés au caractère près de la
 * section « FONT FOI » de `docs/copy/paragraphes-tete-s27-final.md`. Le reste des articles est
 * couvert par les empreintes (`blog-em-dash-static`, ajouts retirés par `sansAjoutsPosterieurs`).
 */
import { readFileSync } from "fs";
import path from "path";
import { renderMarkdownSections } from "@/components/ui/markdown-renderer";
import { blogArticles, getArticleBySlug } from "@/lib/blog-articles";
import { NBSP } from "@/lib/fr-typo";
import { LIENS_BLAGUES_S27, PARAGRAPHES_TETE_S27, sansAjoutsPosterieurs, sansRemplacements } from "../helpers/blog-ajouts-posterieurs";

const DOC = path.resolve(__dirname, "../../../../../docs/copy/paragraphes-tete-s27-final.md");
const BLAGUES = "meilleures-blagues-droles-2026";

/** Textes de la dernière section « FONT FOI » du doc, numérotés 1 à 6, sans les guillemets extérieurs. */
function textesQuiFontFoi(): Record<number, string> {
  const section = readFileSync(DOC, "utf8").split("FONT FOI").pop() ?? "";
  const textes: Record<number, string> = {};
  for (const ligne of section.split("\n")) {
    const m = ligne.match(/^(\d)\. .*? : « (.*) »$/);
    if (m) textes[Number(m[1])] = m[2];
  }
  return textes;
}

const occurrences = (texte: string, motif: string) => texte.split(motif).length - 1;

describe("s27 : paragraphes de tête et liens de l'article blagues", () => {
  const doc = textesQuiFontFoi();

  it("les 6 textes du code sont ceux du doc qui fait foi, au caractère près", () => {
    expect(Object.keys(doc)).toHaveLength(6);
    expect(Object.values(PARAGRAPHES_TETE_S27)).toEqual([doc[1], doc[2], doc[3], doc[4]]);
    expect(LIENS_BLAGUES_S27.map((l) => l.phrase)).toEqual([doc[5], doc[6]]);
  });

  it("espaces insécables : 5 dans le texte observationnel (guillemets et « ? »), aucune ailleurs", () => {
    const [devenir, repartie, autoderision, observationnel] = Object.values(PARAGRAPHES_TETE_S27);
    expect(occurrences(observationnel, NBSP)).toBe(5);
    expect(observationnel).toContain(`«${NBSP}mais pourquoi ils font tous ça${NBSP}?${NBSP}»`);
    expect(observationnel).toContain(`«${NBSP}c'est tellement vrai${NBSP}»`);
    for (const t of [devenir, repartie, autoderision, ...LIENS_BLAGUES_S27.map((l) => l.phrase)]) {
      expect(t).not.toContain(NBSP);
    }
  });

  it("zéro tiret cadratin dans les 6 textes", () => {
    for (const t of [...Object.values(PARAGRAPHES_TETE_S27), ...LIENS_BLAGUES_S27.map((l) => l.phrase)]) {
      expect(t).not.toContain("—");
    }
  });

  describe.each(Object.entries(PARAGRAPHES_TETE_S27))("%s", (slug, texte) => {
    const article = getArticleBySlug(slug)!;

    it("premier paragraphe du corps, exact, présent une seule fois, suivi d'une ligne vide", () => {
      expect(article.content.startsWith(`${texte}\n\n`)).toBe(true);
      expect(occurrences(article.content, texte)).toBe(1);
    });

    it("le corps qui suit est l'ancien corps, inchangé (hors remplacement s27 déclaré : En bref de comment-devenir-drole)", () => {
      expect(sansRemplacements(slug, article.content.slice(texte.length + 2))).toBe(sansAjoutsPosterieurs(article).content);
    });

    it("rendu en paragraphe ordinaire, premier élément du corps, avant tout bloc « En bref »", () => {
      const html = renderMarkdownSections(article.content)[0].html;
      // Même balise que tout paragraphe de corps du blog (aucun style propre), en tête de la 1re section.
      expect(html.startsWith('<p class="mt-4 text-text-secondary">')).toBe(true);
      const premierP = html.slice(0, html.indexOf("</p>"));
      expect(premierP).toContain(texte.split(",")[0].replace(/'/g, "’").slice(0, 12));
      expect(premierP).not.toMatch(/<blockquote|En bref/);
      if (sansAjoutsPosterieurs(article).content.startsWith(">")) {
        expect(html.indexOf("<blockquote")).toBeGreaterThan(html.indexOf("</p>"));
      }
    });
  });

  describe("article blagues : 2 phrases de lien", () => {
    const article = getArticleBySlug(BLAGUES)!;
    const slugs = new Set(blogArticles.map((a) => a.slug));

    it.each(LIENS_BLAGUES_S27.map((l) => [l.href, l] as const))("%s : à la suite exacte de sa phrase, même paragraphe", (_, lien) => {
      expect(occurrences(article.content, lien.phrase)).toBe(1);
      expect(article.content).toContain(`${lien.apres} ${lien.phrase}\n`);
      expect(occurrences(article.content, lien.apres)).toBe(1);
    });

    it.each(LIENS_BLAGUES_S27.map((l) => [l.href, l] as const))("%s : lien markdown vers un article existant, rendu en lien interne", (_, lien) => {
      expect(lien.phrase).toContain(`](${lien.href})`);
      expect(slugs.has(lien.href.replace("/blog/", ""))).toBe(true);
      const html = renderMarkdownSections(lien.phrase).map((s) => s.html).join("");
      expect(html).toContain(`<a href="${lien.href}" class="text-accent-link underline underline-offset-2">`);
    });

    it("hors des 2 phrases, le corps est inchangé", () => {
      let sans = article.content;
      for (const l of LIENS_BLAGUES_S27) sans = sans.replace(` ${l.phrase}`, "");
      expect(sans).toBe(sansAjoutsPosterieurs(article).content);
    });
  });
});
