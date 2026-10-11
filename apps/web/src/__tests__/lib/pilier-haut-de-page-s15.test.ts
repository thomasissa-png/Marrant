/**
 * @jest-environment node
 *
 * Haut de page du pilier `comment-devenir-drole` (s15, GO Thomas 06/10) :
 * étalons 1A (En bref), 2A (title = H1) et 3B (paragraphe ajouté après
 * celui de l'oncle, conservé intact). Source : docs/copy/etalons-pilier-s15.md.
 */
import { blogArticles } from "@/lib/blog-articles";

const TITLE = "Comment devenir drôle : 5 piliers et un plan sur 30 jours";
const pilier = blogArticles.find((a) => a.slug === "comment-devenir-drole");

const EN_BREF =
  "> **En bref :** Pour devenir drôle, note chaque jour une situation absurde, reformule-la en 3 versions, teste la meilleure sur un proche, puis réutilise ce qui a fait sourire. 5 à 10 minutes par jour pendant 30 jours suffisent à la plupart des gens pour sentir la différence : l'humour est une compétence, pas un talent inné.";
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
    const [head] = (pilier?.content ?? "").split("\n## ");
    expect(head.trim().split("\n\n")).toEqual([EN_BREF, ONCLE, PROGRAMME]);
  });

  it("l'En bref ne mentionne plus « 3 leviers » ni « 8 semaines »", () => {
    const bref = (pilier?.content ?? "").split("\n")[0];
    expect(bref).not.toMatch(/leviers|semaines/);
  });

  it("excerpt et updatedAt inchangés", () => {
    expect(pilier?.excerpt).toBe(
      "Devenir drôle, ça s'apprend, n'en déplaise à l'oncle qui répète « t'es drôle ou tu l'es pas » : les 5 piliers, ce qu'en dit la science et un plan sur 30 jours."
    );
    expect(pilier?.updatedAt).toBe("2026-10-06");
  });

  it("aucun tiret cadratin ajouté dans le haut de page", () => {
    const [head] = (pilier?.content ?? "").split("\n## ");
    expect(head).not.toContain("—");
    expect(TITLE).not.toContain("—");
  });
});
