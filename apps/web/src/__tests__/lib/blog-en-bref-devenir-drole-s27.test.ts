/**
 * @jest-environment node
 *
 * s27 (25/11/2026, décision de Thomas « Aligne puis met en ligne ») : encadré « En bref » de
 * `comment-devenir-drole` remplacé par la section « FAIT FOI » de `docs/copy/en-bref-devenir-drole-s27.md`
 * (relecture à l'aveugle @reviewer). Le reste de l'article est couvert par les empreintes
 * (`blog-em-dash-static`, `pilier-haut-de-page-s15`), l'ancien encadré étant remis par `sansAjoutsPosterieurs`.
 */
import { readFileSync } from "fs";
import path from "path";
import { renderMarkdownSections } from "@/components/ui/markdown-renderer";
import { getArticleBySlug } from "@/lib/blog-articles";
import { NBSP } from "@/lib/fr-typo";
import { EN_BREF_DEVENIR_DROLE_S27, PARAGRAPHES_TETE_S27, sansAjoutsPosterieurs } from "../helpers/blog-ajouts-posterieurs";

const DOC = path.resolve(__dirname, "../../../../../docs/copy/en-bref-devenir-drole-s27.md");
const { slug, avant, apres } = EN_BREF_DEVENIR_DROLE_S27;
const article = getArticleBySlug(slug)!;
const occurrences = (texte: string, motif: string) => texte.split(motif).length - 1;

/** Encadrés « > **En bref :** » de la section « FAIT FOI » du doc (lue à chaque exécution). */
function encadresQuiFontFoi(): string[] {
  const section = readFileSync(DOC, "utf8").split("FAIT FOI").slice(1).join("FAIT FOI");
  return section.split("\n").filter((l) => l.startsWith("> **En bref :**"));
}

describe("s27 : En bref de comment-devenir-drole", () => {
  it("la section FAIT FOI du doc contient un seul encadré, identique au caractère près au texte du code", () => {
    expect(encadresQuiFontFoi()).toEqual([apres]);
  });

  it("l'encadré en ligne est la version FAIT FOI, une seule fois, et l'ancien a disparu", () => {
    expect(occurrences(article.content, apres)).toBe(1);
    expect(article.content).not.toContain(avant);
    expect(article.content).not.toContain("note chaque jour une situation absurde");
  });

  it("placé juste après le paragraphe de tête s27, en premier bloc « En bref » du corps", () => {
    expect(article.content.startsWith(`${PARAGRAPHES_TETE_S27[slug]}\n\n${apres}\n\n`)).toBe(true);
  });

  it("hors encadré et paragraphe de tête, l'article est celui d'avant s27 (title, excerpt, corps, FAQ, date)", () => {
    const avantS27 = sansAjoutsPosterieurs(article);
    expect(avantS27.content.startsWith(`${avant}\n\n`)).toBe(true);
    expect(article.content.replace(`${PARAGRAPHES_TETE_S27[slug]}\n\n`, "").replace(apres, avant)).toBe(avantS27.content);
    expect(article.title).toBe(avantS27.title);
    expect(article.excerpt).toBe(avantS27.excerpt);
    expect(article.faqs).toEqual(avantS27.faqs);
    expect(article.updatedAt).toBe("2026-10-12");
  });

  it("typographie : aucun tiret cadratin, aucune espace insécable (cohérence avec les autres encadrés)", () => {
    expect(apres).not.toContain("—");
    expect(apres).not.toContain(NBSP);
  });

  it("rendu en blockquote juste après le paragraphe de tête", () => {
    const html = renderMarkdownSections(article.content)[0].html;
    const p = html.indexOf("</p>");
    const bq = html.indexOf("<blockquote");
    expect(bq).toBeGreaterThan(p);
    expect(html.slice(bq)).toContain("En bref");
    expect(html.slice(bq)).toContain("réflexe de noter ce qui fait rire");
  });
});
