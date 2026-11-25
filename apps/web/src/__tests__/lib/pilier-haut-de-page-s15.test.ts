/**
 * @jest-environment node
 *
 * Haut de page du pilier `comment-devenir-drole` (s15, GO Thomas 06/10) :
 * étalons 1A (En bref), 2A (title = H1) et 3B (paragraphe ajouté après
 * celui de l'oncle, conservé intact). Source : docs/copy/etalons-pilier-s15.md.
 */
import { blogArticles } from "@/lib/blog-articles";
import { EN_BREF_DEVENIR_DROLE_S27, PARAGRAPHES_TETE_S27, sansAjoutsPosterieurs } from "../helpers/blog-ajouts-posterieurs";

const TITLE = "Comment devenir drôle : 5 piliers et un plan sur 30 jours";
const pilier = blogArticles.find((a) => a.slug === "comment-devenir-drole");
// s27 : paragraphe de tête ajouté avant l'En bref (blog-paragraphes-tete-s27.test.ts) et En bref remplacé
// (blog-en-bref-devenir-drole-s27.test.ts) ; les étalons s15 sont vérifiés sans ces deux modifications.
const pilierS15 = pilier && sansAjoutsPosterieurs(pilier);

// Étalon 1A (s15), tel que figé avant s27.
const EN_BREF = EN_BREF_DEVENIR_DROLE_S27.avant;
// s27 (25/11/2026, « Aligne puis met en ligne ») : version FAIT FOI de docs/copy/en-bref-devenir-drole-s27.md.
const EN_BREF_S27 = EN_BREF_DEVENIR_DROLE_S27.apres;
const ONCLE =
  "\"Soit t'es drôle, soit tu l'es pas.\" Celui qui dit ça, c'est souvent l'oncle qui raconte la même blague sur les blondes depuis 2003. Il est \"né drôle\", paraît-il. **L'humour est une compétence**, pas un chromosome : ça s'apprend.";
const PROGRAMME =
  "Reste à savoir comment. Au programme : pourquoi les humoristes ne sont pas « nés drôles » (ils ont enchaîné les bides avant de remplir des salles), ce que la science dit de l'apprentissage, les 5 piliers, puis un plan sur 30 jours pour passer de « comprendre » à « produire ». Quand tu voudras t'entraîner séance par séance, direction nos [10 exercices pour développer ton humour](/blog/exercices-developper-humour).";

describe("pilier comment-devenir-drole : haut de page s15", () => {
  it("existe, slug inchangé", () => {
    expect(pilier).toBeDefined();
  });

  it("2A : title (= H1) aligné, ≤ 60 caractères", () => {
    expect(pilier?.title).toBe(TITLE);
    expect(TITLE.length).toBeLessThanOrEqual(60);
  });

  it("1A + 3B : En bref, oncle intact puis paragraphe programme, avant le premier H2", () => {
    const [head] = (pilierS15?.content ?? "").split("\n## ");
    expect(head.trim().split("\n\n")).toEqual([EN_BREF, ONCLE, PROGRAMME]);
  });

  it("s27 : seules modifications du haut de page, le paragraphe de tête puis l'En bref remplacé", () => {
    const [head] = (pilier?.content ?? "").split("\n## ");
    expect(head.trim().split("\n\n")).toEqual([PARAGRAPHES_TETE_S27["comment-devenir-drole"], EN_BREF_S27, ONCLE, PROGRAMME]);
  });

  it("l'En bref ne mentionne plus « 3 leviers » ni « 8 semaines »", () => {
    const bref = (pilierS15?.content ?? "").split("\n")[0];
    expect(bref).not.toMatch(/leviers|semaines/);
    expect(EN_BREF_S27).not.toMatch(/leviers|semaines/);
  });

  it("excerpt inchangé, updatedAt = audit s20 (12/10)", () => {
    expect(pilier?.excerpt).toBe(
      "Devenir drôle, ça s'apprend, n'en déplaise à l'oncle qui répète « t'es drôle ou tu l'es pas » : les 5 piliers, ce qu'en dit la science et un plan sur 30 jours."
    );
    // 2026-10-06 (s15) puis 2026-10-12 : corrections de l'audit s20 (docs/copy/application-audit-code-s20.md).
    expect(pilier?.updatedAt).toBe("2026-10-12");
  });

  it("aucun tiret cadratin ajouté dans le haut de page", () => {
    const [head] = (pilier?.content ?? "").split("\n## ");
    expect(head).not.toContain("—");
    expect(TITLE).not.toContain("—");
  });
});
