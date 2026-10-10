/**
 * @jest-environment node
 *
 * Lignes d'article notées au niveau (`lignes-articles-notes.json`, « = » chez les 2 relecteurs) : elles entrent au
 * tirage du relais de LEUR article, même avec `--pool strict` (ids du catalogue seulement), en premier après les
 * vannes du catalogue citées dans l'article (plan-execution-s15.md §2, mix-formats-s15.md §2 : « relais, ligne notée »).
 * Règles gardées : mot pour mot depuis l'article en base, registre des 90 jours (clé et texte), aucune ligne d'un
 * article de messages hors de son relais, Instagram seulement avec une légende validée. Données simulées, aucune base.
 */
import fs from "node:fs";
import path from "node:path";
import { buildLotV5, type ArticleLot, type LotInput, type LotResult } from "../../../scripts/content/social-lot-v5";
import { fichierLot } from "../../../scripts/content/social-lot-v5-export";
import { lireLignesNotees, type LigneNotee } from "../../../scripts/content/social-lignes-notees";
import { ARTICLES, catalogue } from "../helpers/lot-v5-fixtures";
import { longueurX } from "../../lib/social/longueur-x";

const SEMAINE = { lot: "notees-test", debut: "2026-11-02", fin: "2026-11-08" };
const COUPLE = "blagues-de-couple-drole";
const VISIO = "humour-en-visio-reunion-en-ligne";
const FAQ = "J'ai lu ton message. J'ai fait la vaisselle avant le deuxième paragraphe, par peur du troisième.";
const couple: ArticleLot = { slug: COUPLE, title: "Blagues de couple : 30 vannes pour chaque moment", category: "CATALOGUE", date: "2026-11-05",
  content: Array.from({ length: 30 }, (_, i) => `**${i + 1}.** J'ai dit à ma copine le secret ${i + 1}. Elle l'a raconté à sa mère avant moi.`).join("\n") };
const visio: ArticleLot = { slug: VISIO, title: "Humour en visio : faire rire à travers un écran", category: "CONTEXTE", date: "2026-11-02",
  content: `## 1. Avant la réunion\n\n> « Je me suis connecté en avance. J'ai passé dix minutes seul avec mon visage. »\n\n## FAQ\n\n${FAQ}` };
const articles = [...ARTICLES.filter((a) => a.slug !== VISIO), visio, couple];
const ligne = (slug: string, rang: number | null, texte: string): LigneNotee => ({ slug, rang, texte });
const N5: LigneNotee = ligne(COUPLE, 5, "J'ai dit à ma copine le secret 5. Elle l'a raconté à sa mère avant moi.");
/** Pool strict réduit à un id inconnu : aucune vanne du catalogue au niveau, seules les lignes notées peuvent servir. */
const lot = (lignesNotees: LigneNotee[] = [], extra: Partial<LotInput> = {}): LotResult =>
  buildLotV5({ pool: catalogue(), articles, recents: [], seed: "test", ...SEMAINE, autorisees: ["aucune-vanne"], lignesNotees, ...extra });
const de = (r: LotResult, date: string, pf: string) => r.posts.find((p) => p.date === date && p.platform === pf);

describe("lignes notées au relais de leur article", () => {
  it("constat : sans elles, --pool strict ne tire aucune ligne d'article (relais X du 05/11 vide, au repli du mix)", () => {
    const r = lot();
    expect(de(r, "2026-11-05", "TWITTER")).toBeUndefined();
    expect(r.errors.join("\n")).toMatch(/2026-11-05 TWITTER : créneau du 05\/11 \(X\) : repli du mix sans texte validé/);
  });

  it("avec elles : le relais X du 05/11 est servi par la ligne, mot pour mot, avec renvoi et lien de l'article", () => {
    const r = lot([N5]);
    const p = de(r, "2026-11-05", "TWITTER")!;
    expect(p.type).toBe("RELAIS");
    expect(p.vannes).toEqual([`${COUPLE}#5`]);
    expect(p.article).toBe(COUPLE);
    expect(p.content).toContain("le secret 5. Elle l'a raconté à sa mère avant moi.");
    expect(p.content).toContain("Les 29 autres sont prêtes à copier :");
    expect(p.lien).toMatch(/\/blog\/blagues-de-couple-drole\?utm_source=x&/);
    expect(longueurX(p.content)).toBeLessThanOrEqual(270);
    expect(r.errors.join("\n")).not.toMatch(/2026-11-05 TWITTER/);
  });

  it("rang nul (FAQ, introduction) : texte présent tel quel, clé du texte normalisé", () => {
    const r = lot([ligne(VISIO, null, FAQ)]);
    const p = de(r, "2026-11-02", "TWITTER")!;
    expect(p.type).toBe("RELAIS");
    expect(p.vannes[0]).toMatch(/^humour-en-visio-reunion-en-ligne#jailutonmessage/);
    expect(p.content).toContain("par peur du troisième.");
  });

  it("rang qui désigne une autre ligne : la ligne reconnue au même texte garde sa clé", () => {
    // Le rang 1 du fichier est la section « 1. », la ligne reconnue par l'extracteur porte le rang 1 de l'article.
    const r = lot([ligne(VISIO, 1, "Je me suis connecté en avance. J'ai passé dix minutes seul avec mon visage.")]);
    expect(de(r, "2026-11-02", "TWITTER")!.vannes).toEqual([`${VISIO}#1`]);
  });

  it("texte introuvable mot pour mot dans l'article en base : avertissement, jamais tirée", () => {
    const r = lot([ligne(COUPLE, 5, "J'ai dit à ma copine un autre secret. Elle l'a gardé.")]);
    expect(r.warnings.join("\n")).toMatch(/Ligne notée blagues-de-couple-drole#5 : introuvable mot pour mot/);
    expect(de(r, "2026-11-05", "TWITTER")).toBeUndefined();
  });

  it("Instagram : jamais sans sa légende validée ; avec elle, la légende porte le renvoi", () => {
    expect(de(lot([N5]), "2026-11-05", "INSTAGRAM")).toBeUndefined();
    const r = lot([N5, ligne(COUPLE, 6, "J'ai dit à ma copine le secret 6. Elle l'a raconté à sa mère avant moi.")],
      { legendes: { [`${COUPLE}#6`]: "À envoyer à qui garde mal les secrets." } });
    // X tire d'abord (la 5, sans légende requise), Instagram prend la seule ligne qui a sa légende.
    expect(de(r, "2026-11-05", "TWITTER")!.vannes).toEqual([`${COUPLE}#5`]);
    const ig = de(r, "2026-11-05", "INSTAGRAM")!;
    expect(ig.vannes).toEqual([`${COUPLE}#6`]);
    expect(ig.content).toBe("À envoyer à qui garde mal les secrets. Les 29 autres vannes : lien en bio.");
  });

  it("une ligne notée ne sert jamais une autre case que le relais de son article", () => {
    const r = lot([N5, ligne(VISIO, null, FAQ)]);
    const avecNotee = r.posts.filter((p) => p.vannes.some((k) => k.startsWith(`${COUPLE}#`) || k.startsWith(`${VISIO}#`)));
    expect(avecNotee.map((p) => [p.date, p.platform, p.article])).toEqual([["2026-11-02", "TWITTER", VISIO], ["2026-11-05", "TWITTER", COUPLE]]);
  });
});

describe("règles du tirage gardées", () => {
  it("registre des 90 jours : une ligne postée il y a moins de 90 jours n'est pas reprise", () => {
    const r = lot([N5], { recents: [{ date: "2026-09-01", sourceId: `${COUPLE}#5`, platform: "TWITTER" }] });
    expect(de(r, "2026-11-05", "TWITTER")).toBeUndefined();
  });

  it("pas de doublon avec une vanne du catalogue : la ligne identique à une vanne déjà diffusée garde l'id du catalogue", () => {
    const pool = [...catalogue(), { id: "cat-secret", setup: "J'ai dit à ma copine le secret 5.", punchline: "Elle l'a raconté à sa mère avant moi.",
      isActive: true, verdict: "GARDER", category: "COUPLE" }];
    const r = lot([N5], { pool, recents: [{ date: "2026-10-20", sourceId: "cat-secret", platform: "INSTAGRAM" }] });
    expect(de(r, "2026-11-05", "TWITTER")).toBeUndefined();
    const libre = lot([N5], { pool });
    expect(de(libre, "2026-11-05", "TWITTER")!.vannes).toEqual(["cat-secret"]);
  });

  it("article de messages : ses lignes notées ne sortent jamais de son relais (ni tirage, ni repli)", () => {
    const anniv = ARTICLES.find((a) => a.slug === "message-anniversaire-drole-par-situation")!;
    const notees = [1, 2, 3].map((n) => ligne(anniv.slug, n, `Joyeux anniversaire. J'ai écrit le message ${n} trop tard. Tu l'as lu avant moi.`));
    const r = buildLotV5({ pool: catalogue(), articles, recents: [], seed: "test", lot: "notees-msg", debut: "2026-10-23", fin: "2026-11-08",
      autorisees: ["aucune-vanne"], lignesNotees: notees });
    expect([...r.posts, ...r.replis].filter((p) => p.vannes.some((k) => k.startsWith(`${anniv.slug}#`)))).toEqual([]);
  });
});

describe("lecture du fichier", () => {
  it("garde les lignes au niveau ; incohérence et doublon = erreur", () => {
    const e = (o: object) => ({ slug: COUPLE, rang: 5, texte: "t", note1: "=", note2: "=", auNiveau: true, date: "2026-11-05", ...o });
    const r = lireLignesNotees(JSON.stringify([e({}), e({ rang: 6, note2: "<", auNiveau: false }), e({ rang: 7, note1: "<" }), e({})]), "f.json");
    expect(r.lignes).toEqual([{ slug: COUPLE, rang: 5, texte: "t" }]);
    expect(r.erreurs.join("\n")).toMatch(/entrée 3 .*auNiveau true incohérent avec les notes < \/ =/);
    expect(r.erreurs.join("\n")).toMatch(/entrée 4 : ligne blagues-de-couple-drole#5 en double/);
    expect(lireLignesNotees("{", "f.json").erreurs[0]).toMatch(/JSON illisible/);
  });

  it("le fichier du dépôt se lit sans erreur, avec 5 lignes au niveau pour blagues-de-couple-drole", () => {
    const chemin = path.resolve(__dirname, "../../../../../docs/social/preparation/lignes-articles-notes.json");
    const r = lireLignesNotees(fs.readFileSync(chemin, "utf-8"), chemin);
    expect(r.erreurs).toEqual([]);
    expect(r.lignes.filter((l) => l.slug === COUPLE)).toHaveLength(5);
  });
});

describe("lot 1a inchangé", () => {
  it("avec les lignes notées du dépôt, le 1a (12/10 au 18/10) est identique à l'octet", () => {
    const chemin = path.resolve(__dirname, "../../../../../docs/social/preparation/lignes-articles-notes.json");
    const { lignes } = lireLignesNotees(fs.readFileSync(chemin, "utf-8"), chemin);
    const META_1A = { lot: "relance-s15", debut: "2026-10-12", fin: "2026-10-18" };
    const sans = buildLotV5({ pool: catalogue(), articles: ARTICLES, recents: [], seed: "test", ...META_1A });
    const avec = buildLotV5({ pool: catalogue(), articles: ARTICLES, recents: [], seed: "test", ...META_1A, lignesNotees: lignes });
    expect(JSON.stringify(fichierLot(avec.posts, "test", META_1A, avec.replis))).toBe(JSON.stringify(fichierLot(sans.posts, "test", META_1A, sans.replis)));
    expect(avec.errors).toEqual(sans.errors);
  });
});
