/**
 * @jest-environment node
 *
 * Contrôle @reviewer du lot 1b (E1 à E5) : renvois des relais limités aux formules exactes de la v5 (l.32), aucun
 * renvoi neuf ; relais Instagram sans « À envoyer à... » = « légende manquante » ; vanne rendue au pool sans cascade.
 * Données simulées, aucune base.
 */
import { buildLotV5, controlerLegendesInstagram, type ArticleLot } from "../../../scripts/content/social-lot-v5";
import { RENDUES_AU_POOL } from "../../../scripts/content/social-lot-v5-fixes";
import { LEGENDES_IG } from "../../../scripts/content/social-lot-v5-legendes";
import { textesNeufs } from "../../../scripts/content/social-lot-v5-export";
import { ARTICLES, catalogue } from "../helpers/lot-v5-fixtures";

const SEMAINE = { lot: "renvois-test", debut: "2026-10-26", fin: "2026-11-01" };
const APPLI: ArticleLot = {
  slug: "premier-message-drole-appli-de-rencontre", title: "Premier message drôle appli de rencontre : quoi écrire", category: "CATALOGUE",
  date: "2026-10-29",
  content: [
    "**1. Sa bio dit : « Je cuisine. »**", "", "> J'ai remplacé le citron par du vinaigre. Les invités ont été très polis.", "",
    "**2. Sa photo montre un chat.**", "", "> Un chat bloquait mon escalier. Je lui ai dit « pardon ». Puis j'ai attendu.", "",
    "**3. Sa photo montre un chien.**", "", "> J'ai déjà dit « assis » à un inconnu dans le tram. Il s'est assis.", "",
    "## Et après le premier message ?", "", "> Mon date a enregistré mon numéro. Elle a tapé « Antoine bar ». Je suis devenu un endroit.",
  ].join("\n"),
};
/** Vanne du catalogue citée dans l'article, hors des messages numérotés (cas du X du 29/10 : « Antoine bar »). */
const BAR = { id: "jbar", setup: "Mon date a enregistré mon numéro. Elle a tapé « Antoine bar ».", punchline: "Je suis devenu un endroit.",
  isActive: true, verdict: "GARDER", category: "SITUATION" };
const lot = (articles: ArticleLot[], pool = [BAR, ...catalogue()]) => buildLotV5({ pool, articles, recents: [], seed: "test", ...SEMAINE });

describe("renvois des relais : formules exactes de la v5 seulement", () => {
  const r = lot([...ARTICLES, APPLI]);
  const x = r.posts.find((p) => p.date === "2026-10-29" && p.platform === "TWITTER")!;
  const ig = r.posts.find((p) => p.date === "2026-10-29" && p.platform === "INSTAGRAM")!;

  it("CATALOGUE sans nombre dans le titre, X : « Les N autres sont prêts à copier : », N = messages numérotés hors vanne montrée", () => {
    expect(x).toMatchObject({ type: "RELAIS", vannes: ["jbar"] });
    expect(x.content).toContain("Les 3 autres sont prêts à copier : https://deviens-marrant.fr/blog/premier-message-drole-appli-de-rencontre");
  });

  it("CATALOGUE, vanne hors de l'article : pas de « Les N autres », erreur « renvoi manquant »", () => {
    const sans = lot([...ARTICLES, APPLI], catalogue());
    const x2 = sans.posts.find((p) => p.date === "2026-10-29" && p.platform === "TWITTER")!;
    expect(x2.content).not.toMatch(/autres/);
    expect(sans.errors.some((e) => e.startsWith("2026-10-29 TWITTER RELAIS : renvoi manquant"))).toBe(true);
  });

  it("Instagram sans formule v5 : légende retenue seule (ou manquante), erreur « renvoi manquant », aucun texte neuf", () => {
    expect(ig.content).not.toMatch(/lien en bio|autres exemples/);
    expect(r.errors).toContain("2026-10-29 INSTAGRAM RELAIS : renvoi manquant pour premier-message-drole-appli-de-rencontre (catégorie CATALOGUE) : aucune formule exacte de la v5, à relire à l'aveugle (lot-1b-textes-a-relire.md).");
    expect(textesNeufs(r.posts)).toEqual([]);
  });
});

describe("contrôle @reviewer du lot 1b", () => {
  it("E4 : relais IG du 22/10 sur la ligne n°4, sans légende tant qu'elle n'est pas relue (« légende manquante »)", () => {
    const r = buildLotV5({ pool: catalogue(), articles: ARTICLES, recents: [], seed: "test", lot: "e4", debut: "2026-10-19", fin: "2026-10-25" });
    const p = r.posts.find((x) => x.cle === "relais-ig-22-10")!;
    expect(p.sourceId).toBe("message-anniversaire-drole-par-situation#4");
    expect(p.content).toBe("");
    expect(controlerLegendesInstagram(r.posts, r.replis).errors.some((e) => e.includes("légende manquante pour la vanne message-anniversaire-drole-par-situation#4"))).toBe(true);
  });

  it("E5 : la légende « homonyme » (V050) n'est plus servie", () => {
    expect(LEGENDES_IG.cs14jk7911857c4ff09eb025).toBeUndefined();
  });

  it("E1 : la BU est rendue au pool pour le lot suivant, jamais tirée dans le lot 1b", () => {
    expect(RENDUES_AU_POOL).toEqual([expect.objectContaining({ jokeId: "cp05d2c3950800b7575c12ce6", du: "2026-10-19", tirableDes: "2026-11-16" })]);
  });
});
