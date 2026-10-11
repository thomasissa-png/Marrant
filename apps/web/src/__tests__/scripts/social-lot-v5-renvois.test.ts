/**
 * @jest-environment node
 *
 * Contrôle @reviewer du lot 1b (E1 à E5) : renvois des relais limités aux formules exactes de la v5 (l.32), aucun
 * renvoi neuf ; relais Instagram sans « À envoyer à... » = « légende manquante » ; vanne rendue au pool sans cascade.
 * Révision 7 (aveugle-1b-r7-resultat.md) : renvois et légendes tranchés à l'aveugle versés ; repli du 19/10 IG
 * (légende retenue seule, sans renvoi) sans erreur, pour ce seul relais. Données simulées, aucune base.
 */
import { buildLotV5, controlerLegendesInstagram, type ArticleLot } from "../../../scripts/content/social-lot-v5";
import { RENDUES_AU_POOL } from "../../../scripts/content/social-lot-v5-fixes";
import { LEGENDES_IG, LEGENDE_MAX } from "../../../scripts/content/social-lot-v5-legendes";
import { RELAIS_IG_SANS_RENVOI, RENVOIS_RELUS, cleRenvoi } from "../../../scripts/content/social-lot-v5-renvois";
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
  it("E4 : relais IG du 22/10 sur la ligne n°4, légende 1C relue à l'aveugle + renvoi généré (79 caractères)", () => {
    const r = buildLotV5({ pool: catalogue(), articles: ARTICLES, recents: [], seed: "test", lot: "e4", debut: "2026-10-19", fin: "2026-10-25" });
    const p = r.posts.find((x) => x.cle === "relais-ig-22-10")!;
    expect(p.sourceId).toBe("message-anniversaire-drole-par-situation#4");
    expect(p.content).toBe("À envoyer à celle qui « dit juste un mot ». Les 20 autres textes : lien en bio.");
    expect(p.content).toHaveLength(79);
    expect(controlerLegendesInstagram(r.posts, r.replis).errors.filter((e) => e.includes("relais-ig-22-10"))).toEqual([]);
  });

  it("E5 : la légende « homonyme » (V050) est remplacée par 2C, relue à l'aveugle", () => {
    expect(LEGENDES_IG.cs14jk7911857c4ff09eb025).toBe("À envoyer à celle qui était la troisième Léa de sa classe.");
    expect(Object.values(LEGENDES_IG)).not.toContain("À envoyer à ton homonyme.");
  });

  it("E1 : la BU est rendue au pool pour le lot suivant, jamais tirée dans le lot 1b", () => {
    expect(RENDUES_AU_POOL).toEqual([expect.objectContaining({ jokeId: "cp05d2c3950800b7575c12ce6", du: "2026-10-19", tirableDes: "2026-11-16" })]);
  });
});

describe("révision 7 : renvois tranchés à l'aveugle et repli du 19/10 IG", () => {
  const cle29 = (pf: "TWITTER" | "INSTAGRAM", vanne: string) => cleRenvoi(pf, APPLI.slug, vanne);
  const avec = (o: { renvoisRelus?: Record<string, string>; relaisIgSansRenvoi?: ReadonlySet<string> }, pool = catalogue()) =>
    buildLotV5({ pool, articles: [...ARTICLES, APPLI], recents: [], seed: "test", ...SEMAINE, ...o });
  const base = avec({ renvoisRelus: {}, relaisIgSansRenvoi: new Set() });
  const x = base.posts.find((p) => p.date === "2026-10-29" && p.platform === "TWITTER")!;
  const ig = base.posts.find((p) => p.date === "2026-10-29" && p.platform === "INSTAGRAM")!;
  const erreur = (r: typeof base, pf: string) => r.errors.some((e) => e.startsWith(`2026-10-29 ${pf} RELAIS : renvoi manquant`));

  it("renvoi relu servi pour son réseau, son article et sa vanne seulement : origine « relu à l'aveugle », aucune erreur", () => {
    const r = avec({ renvoisRelus: { [cle29("TWITTER", x.sourceId)]: "Écrire à un match :" } });
    const x2 = r.posts.find((p) => p.date === "2026-10-29" && p.platform === "TWITTER")!;
    expect(x2.content).toContain("Écrire à un match : https://deviens-marrant.fr/blog/premier-message-drole-appli-de-rencontre");
    expect(x2.segments).toContainEqual({ texte: "Écrire à un match :", origine: "AVEUGLE" });
    expect(erreur(r, "TWITTER")).toBe(false);
    expect(textesNeufs(r.posts)).toEqual([]);
    // Autre vanne (clé différente) : rien n'est servi, l'erreur reste.
    expect(erreur(avec({ renvoisRelus: { [cle29("TWITTER", "autre-vanne")]: "Écrire à un match :" } }), "TWITTER")).toBe(true);
  });

  it("repli IG (légende retenue seule) : pas d'erreur « renvoi manquant », avertissement, texte inchangé", () => {
    expect(erreur(base, "INSTAGRAM")).toBe(true);
    const r = avec({ relaisIgSansRenvoi: new Set([cle29("INSTAGRAM", ig.sourceId)]) });
    const ig2 = r.posts.find((p) => p.date === "2026-10-29" && p.platform === "INSTAGRAM")!;
    expect(erreur(r, "INSTAGRAM")).toBe(false);
    expect(ig2.content).toBe(ig.content);
    expect(ig2.content).not.toMatch(/lien en bio/);
    expect(r.warnings.some((w) => w.startsWith("2026-10-29 INSTAGRAM RELAIS : aucun renvoi au niveau") && w.includes("légende retenue seule"))).toBe(true);
  });

  it("le repli ne vaut que pour Instagram et pour la vanne listée", () => {
    expect(erreur(avec({ relaisIgSansRenvoi: new Set([cle29("TWITTER", x.sourceId)]) }), "TWITTER")).toBe(true);
    expect(erreur(avec({ relaisIgSansRenvoi: new Set([cle29("INSTAGRAM", "autre-vanne")]) }), "INSTAGRAM")).toBe(true);
  });

  it("tables versées : 4 renvois mot pour mot, un seul repli (19/10 IG, vanne du concert), légendes de relais dans les 80", () => {
    expect(Object.values(RENVOIS_RELUS).sort()).toEqual([
      "4 autres moments de visio, et que faire si la chute tombe à plat :",
      "Le silence en visio : lien en bio.",
      "Les 5 situations de coloc, avec la phrase qui détend et celle qui envenime :",
      "Écrire à un match : lien en bio.",
    ].sort());
    expect([...RELAIS_IG_SANS_RENVOI]).toEqual(["INSTAGRAM|humour-en-colocation-desamorcer-tensions|cs14jkd9058d03e24961004a"]);
    expect(LEGENDES_IG.cs14jkd9058d03e24961004a).toBe("À envoyer à la sœur qui a « vu » Beyoncé.");
    for (const [k, rv] of Object.entries(RENVOIS_RELUS)) {
      if (!k.startsWith("INSTAGRAM|")) { expect(rv.endsWith(" :")).toBe(true); continue; }
      expect(`${LEGENDES_IG[k.split("|")[2]]} ${rv}`.length).toBeLessThanOrEqual(LEGENDE_MAX);
    }
  });
});
