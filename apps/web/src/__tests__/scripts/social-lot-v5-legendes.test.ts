/**
 * @jest-environment node
 *
 * Notation cycle 8 (@reviewer K5 d, @social S6, S7, S8) :
 *  - V028 et V060, réservées à un carrousel de décryptage, ne sont jamais tirées (ni tirage, ni repli) ;
 *    V028 n'est publiée que par le post fixe du 21/10 (carte vanne simple, 07/10) ;
 *  - X du 12/10 : relais abandonné, vanne du pool sans renvoi ni lien (CASES_VANNE) ;
 *  - légendes Instagram « À envoyer à... », sans pied « deviens-marrant.fr » ni lien, 80 caractères au plus ;
 *  - la légende suit la vanne (`LEGENDES_IG`), un relais Instagram = légende + renvoi.
 */
import { buildLotV5, controlerLegendesInstagram, controlerLot, type LotPost } from "../../../scripts/content/social-lot-v5";
import { CASES_VANNE, FIXES, RESERVEES_CARROUSEL } from "../../../scripts/content/social-lot-v5-fixes";
import { LEGENDES_IG, LEGENDE_MAX, ecartsLegende, tournure } from "../../../scripts/content/social-lot-v5-legendes";
import { FORMULES } from "../../../scripts/content/social-lot-v5-config";
import { longueurX } from "../../lib/social/longueur-x";
import { ARTICLES, catalogue } from "../helpers/lot-v5-fixtures";

const V028 = "cmmnsqn130033th63b54ux45o";
const V060 = "cs14jk577fa779cb48fa9b55";
const M = { lot: "legendes", debut: "2026-10-19", fin: "2026-10-25" };
const joke = (id: string, n: number) => ({ id, setup: `J'ai une vanne réservée ${n}.`, punchline: `Elle attend son carrousel ${n}.`, isActive: true, verdict: "GARDER", category: "SITUATION" });
const arts = ARTICLES.map((a) => ({ ...a, aGarder: a.date >= M.debut }));

describe("vannes réservées à un carrousel (V028, V060)", () => {
  const pool = [joke(V028, 1), joke(V060, 2), joke("temoin", 3), ...catalogue()];
  // --pool : ordre du fichier, les meilleures d'abord. Les 2 réservées sont en tête : sans exclusion, elles partiraient.
  const autorisees = [V028, V060, "temoin", ...catalogue().map((j) => j.id)];
  const r = buildLotV5({ pool, articles: arts, recents: [], seed: "test", autorisees, ...M });
  const tous = [...r.posts, ...r.replis];

  it("la liste contient exactement V028 (21/10) et V060 (09/12), pas V083", () => {
    expect(RESERVEES_CARROUSEL.map((x) => [x.jokeId, x.date])).toEqual([[V028, "2026-10-21"], [V060, "2026-12-09"]]);
    expect(RESERVEES_CARROUSEL.some((x) => x.jokeId === "cs14jka3336e7e90a453a9d6")).toBe(false);
  });

  it("témoin : la 3e de la liste est bien tirée (l'ordre --pool est suivi)", () => {
    expect(tous.some((p) => p.vannes.includes("temoin"))).toBe(true);
  });

  it("V028 : seulement le post fixe du 21/10 (carte vanne simple, 2 cartes, légende R07) ; V060 absente", () => {
    expect(tous.filter((p) => p.vannes.includes(V060))).toEqual([]);
    const v028 = tous.filter((p) => p.vannes.includes(V028));
    expect(v028.map((p) => [p.cle, p.date, p.platform, p.type, p.origine, p.cartes.length])).toEqual([["IG-21-10", "2026-10-21", "INSTAGRAM", "VANNE", "V5", 2]]);
    expect(v028[0].content).toBe("À envoyer à qui a déjà décroché un « pas mal » et l'a gardé précieusement.");
    expect(controlerLot(r.posts).errors.join("\n")).not.toMatch(/réservée au carrousel/);
  });

  it("X3 du 21/10 : renvoi = FORMULES.quizCourt, sans « Humour d'Observateur », longueurX ≤ 270", () => {
    const x3 = r.posts.find((p) => p.cle === "X3")!;
    expect(x3.content).toContain(FORMULES.quizCourt);
    expect(x3.content).not.toMatch(/Humour d'Observateur/);
    expect(longueurX(x3.content)).toBeLessThanOrEqual(270);
  });

  it("controlerLot : une réservée tirée est une erreur bloquante", () => {
    const tire = r.posts.find((p) => p.origine === "TIRAGE")!;
    const faux: LotPost = { ...tire, vannes: [V028] };
    expect(controlerLot([faux]).errors.join("\n")).toMatch(/cmmnsqn130033th63b54ux45o réservée au carrousel du 2026-10-21/);
  });
});

describe("ecartsLegende et tournure", () => {
  it("légende conforme : aucun écart", () => {
    expect(ecartsLegende("À envoyer à ton tuteur de stage.")).toEqual([]);
  });
  it("pied, lien, tête et longueur sont signalés", () => {
    expect(ecartsLegende("À envoyer à ton tuteur de stage. deviens-marrant.fr").join()).toMatch(/deviens-marrant/);
    expect(ecartsLegende("À envoyer à toi. https://x.co").join()).toMatch(/lien/);
    expect(ecartsLegende("Les 20 autres textes : lien en bio.").join()).toMatch(/sans « À envoyer à »/);
    expect(ecartsLegende(`À envoyer à ${"a".repeat(LEGENDE_MAX)}`).join()).toMatch(/plafond 80/);
  });
  it("tournures", () => {
    expect(tournure("À envoyer à celui qui répare tout, bientôt.")).toBe("celui qui");
    expect(tournure("À envoyer à qui a un date pour Halloween.")).toBe("qui");
    expect(tournure("À envoyer à ta mère, juste pour voir.")).toBe("ton/ta");
    expect(tournure("À envoyer à ceux qui se disputent pour dîner.")).toBe("ceux qui");
  });
});

describe("légendes du code", () => {
  it("les légendes de LEGENDES_IG sont toutes conformes", () => {
    expect(Object.entries(LEGENDES_IG).filter(([, l]) => ecartsLegende(l).length)).toEqual([]);
  });
  it("aucune légende de FIXES ne porte le pied, et le pied n'est plus une formule", () => {
    expect(FIXES.filter((f) => /deviens-marrant/i.test(f.legende ?? ""))).toEqual([]);
    expect(Object.values(FORMULES)).not.toContain("deviens-marrant.fr");
  });
});

describe("légende Instagram rattachée à la vanne", () => {
  // Une légende pour toute clé (vannes du catalogue et lignes d'article `slug#rang`).
  const legendes = new Proxy({} as Record<string, string>, { get: (_, k) => (typeof k === "string" ? `À envoyer à qui a lu la ${k}.` : undefined) });
  const r = buildLotV5({ pool: catalogue(), articles: arts, recents: [], seed: "test", legendes, ...M });

  it("une vanne Instagram tirée reçoit la légende de sa vanne, sans pied", () => {
    const ig = r.posts.filter((p) => p.platform === "INSTAGRAM" && p.origine === "TIRAGE" && p.type === "VANNE");
    expect(ig.length).toBeGreaterThan(0);
    for (const p of ig) expect(p.content).toBe(`À envoyer à qui a lu la ${p.vannes[0]}.`);
  });

  it("légendes fournies pour toutes les vannes : 0 erreur de légende", () => {
    expect(controlerLegendesInstagram(r.posts, r.replis).errors).toEqual([]);
  });

  it("vanne sans légende : erreur bloquante qui nomme la vanne", () => {
    const sans = buildLotV5({ pool: catalogue(), articles: arts, recents: [], seed: "test", legendes: {}, ...M });
    const e = controlerLegendesInstagram(sans.posts, sans.replis).errors;
    expect(e.some((x) => /légende manquante pour la vanne t\d{3}/.test(x))).toBe(true);
  });

  it("même tournure sur 2 posts Instagram consécutifs : avertissement", () => {
    const ig = r.posts.filter((p) => p.platform === "INSTAGRAM").slice(0, 2).map((p) => ({ ...p, content: "À envoyer à celui qui lit." }));
    expect(controlerLegendesInstagram(ig).warnings.join()).toMatch(/même tournure « celui qui »/);
  });
});

describe("plafond « copain / copine » ([HYPOTHÈSE], avertissement seulement)", () => {
  const r = buildLotV5({ pool: catalogue(), articles: arts, recents: [], seed: "test", ...M });
  const base = r.posts.filter((p) => p.platform === "TWITTER").slice(0, 3);
  const avec = (texte: string) => base.map((p) => ({ ...p, content: texte }));

  it("3 posts la même semaine : 1 avertissement, 0 erreur", () => {
    const c = controlerLot(avec("Mon copain a dit « je m'en occupe »."));
    expect(c.warnings.filter((w) => /copain \/ copine » 3 fois/.test(w))).toHaveLength(1);
    expect(c.errors.filter((e) => /copain/.test(e))).toEqual([]);
  });
  it("2 posts : rien ; « copains » compte, « copainte » non", () => {
    expect(controlerLot(avec("Ma copine a trié.").slice(0, 2)).warnings.join()).not.toMatch(/copain/);
    expect(controlerLot(avec("Mes copains rient.")).warnings.join()).toMatch(/3 fois/);
    expect(controlerLot(avec("Une copainte rit.")).warnings.join()).not.toMatch(/copain/);
  });
});

describe("garde de bio sur les relais Instagram (S8)", () => {
  it("légende « … lien en bio. » : avertissement de pose de la veille", () => {
    const r = buildLotV5({ pool: catalogue(), articles: arts, recents: [], seed: "test", ...M });
    const ig = { ...r.posts.find((p) => p.platform === "INSTAGRAM")!, cartes: [], content: "À envoyer à ton hôte d'anniversaire. Les 20 autres textes : lien en bio." };
    expect(controlerLegendesInstagram([ig]).warnings.join()).toMatch(/lien en bio » : ne part telle quelle que si/);
  });
});

describe("X du 12/10 : relais abandonné, vanne du pool sans renvoi (CASES_VANNE)", () => {
  const S1 = { lot: "relance-s15", debut: "2026-10-12", fin: "2026-10-18" };
  const arts1 = ARTICLES.map((a) => ({ ...a, aGarder: a.date >= S1.debut }));
  const autorisees = catalogue().map((j) => j.id);
  const r = buildLotV5({ pool: catalogue(), articles: arts1, recents: [], seed: "test", autorisees, ...S1 });
  const x = r.posts.find((p) => p.date === "2026-10-12" && p.platform === "TWITTER")!;

  it("aucun post fixe X le 12/10, une case CASES_VANNE", () => {
    expect(FIXES.some((f) => f.date === "2026-10-12" && f.platform === "TWITTER")).toBe(false);
    expect(CASES_VANNE.map((c) => [c.date, c.platform])).toEqual([["2026-10-12", "TWITTER"]]);
  });

  it("vanne tirée du pool, sans lien, sans renvoi, sans article ni repli, à 12:30", () => {
    expect([x.type, x.origine, x.heure, x.lien, x.article, x.repli]).toEqual(["VANNE", "TIRAGE", "12:30", null, null, null]);
    expect(autorisees).toContain(x.vannes[0]);
    expect(x.content).not.toMatch(/https?:|se-presenter|tour de table/);
    expect(r.replis.some((p) => p.repliDe === x.id)).toBe(false);
  });

  it("tirée après le lot : elle ne prend aucune vanne aux autres tirages X (rang --pool plus bas), rang du post gardé", () => {
    const rangDe = (p: LotPost) => autorisees.indexOf(p.vannes[0]);
    const autresX = r.posts.filter((p) => p !== x && p.platform === "TWITTER" && p.origine === "TIRAGE");
    expect(autresX.length).toBeGreaterThan(0);
    for (const p of autresX) expect(rangDe(p)).toBeLessThan(rangDe(x));
    const autres = r.posts.filter((p) => p !== x);
    expect(autres.some((p) => p.vannes.includes(x.vannes[0]))).toBe(false);
    expect(r.posts.map((p) => p.date)).toEqual([...r.posts.map((p) => p.date)].sort());
  });
});
