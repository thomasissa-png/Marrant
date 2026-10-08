/**
 * @jest-environment node
 *
 * Repli du mix de formats (mix-formats-s15.md §2, §3, §6 ; [CHOIX UTILISATEUR] du 06/10) : case sans vanne au
 * niveau = conseil, ligne d'article notée, carrousel R9, quiz seul ou relais LinkedIn, dans l'ordre et sous les
 * plafonds ; textes pris UNIQUEMENT dans textes-formats-valides.json, chacun une fois ; fichier vide = erreur claire.
 * Données simulées, aucune base.
 */
import { buildLotV5, controlerLot, type LotInput, type LotResult } from "../../../scripts/content/social-lot-v5";
import { fichierLot } from "../../../scripts/content/social-lot-v5-export";
import { FORMULES } from "../../../scripts/content/social-lot-v5-config";
import { lireTextesFormats, ordreRepli, type TexteFormat } from "../../../scripts/content/social-lot-v5-mix";
import { ARTICLES, catalogue } from "../helpers/lot-v5-fixtures";
import { longueurX } from "../../lib/social/longueur-x";
import fs from "node:fs";
import path from "node:path";

const SEMAINE = { lot: "mix-test", debut: "2026-11-02", fin: "2026-11-08" };
/** Pool réduit à un id inconnu : aucune vanne au niveau, toutes les cases passent au repli. */
const lot = (textesFormats: TexteFormat[], extra: Partial<LotInput> = {}): LotResult =>
  buildLotV5({ pool: catalogue(), articles: ARTICLES, recents: [], seed: "test", ...SEMAINE, autorisees: ["aucune-vanne"], textesFormats, ...extra });
const sansTexte = (r: LotResult) => r.errors.filter((e) => /repli du mix/.test(e));
const de = (r: LotResult, date: string, pf: string) => r.posts.find((p) => p.date === date && p.platform === pf);

const conseilX = (n: number): TexteFormat => ({ id: `conseil-x-${n}`, format: "conseil", reseau: "TWITTER", notes: [8.5, 8], source: "test",
  texte: `La remarque chirurgicale ${n} : tes potes débattent du meilleur kebab. Une seule phrase, quand ils reprennent leur souffle.` });
const conseilIg = (n: number): TexteFormat => ({ id: `conseil-ig-${n}`, format: "conseil", reseau: "INSTAGRAM", notes: [8, 8], source: "test",
  cartes: [`Tes potes débattent du kebab ${n}.`, `Une seule phrase, au bon moment ${n}.`], legende: `À envoyer à qui débat du kebab ${n}.` });
const ligneX = (n: number): TexteFormat => ({ id: `ligne-x-${n}`, format: "ligne", reseau: "TWITTER", notes: [8.5, 9], source: "test",
  article: "se-presenter-avec-humour", texte: "Tu avais une phrase géniale. Le quatrième vient de la dire." });
const QUIZ: TexteFormat = { id: "quiz-1", format: "quiz", reseau: "TWITTER", notes: [8, 8], source: "test", profils: ["Taquin", "Storyteller"],
  texte: "Le Taquin a toujours la bonne réplique. Le Storyteller transforme une anecdote en sketch." };
const relaisLi = (n: number): TexteFormat => ({ id: `relais-li-${n}`, format: "relaisLinkedIn", reseau: "LINKEDIN", notes: [8.5, 8.5], source: "test",
  article: "humour-en-visio-reunion-en-ligne", texte: `Tu lances une phrase légère en visio ${n} et il ne se passe rien. Voici les ressorts de l'humour en visio :` });
const CARROUSEL: TexteFormat = { id: "carrousel-t005", format: "carrousel", reseau: "INSTAGRAM", notes: [8.5, 8.5], source: "test", jokeId: "t005",
  cartes: ["J'ai raconté l'histoire numéro 5 au travail.", "Mon voisin a compris la 5.", "Pourquoi ça fait rire : le voisin comprend avant tout le monde.",
    "À toi de jouer : raconte ton histoire à un voisin.", FORMULES.renvoiQuizBio], legende: "À envoyer à ton voisin qui comprend tout." };

describe("fichier des textes validés", () => {
  it("fichier vide : aucune case omise, une erreur claire par créneau et par format", () => {
    const r = lot([]);
    const e = sansTexte(r);
    expect(r.posts).toHaveLength(0);
    // X 5, Instagram 5, LinkedIn 2 : 12 cases, 12 erreurs, dans l'ordre des dates.
    expect(e).toHaveLength(12);
    expect(e).toContain("2026-11-03 TWITTER : créneau du 03/11 (X) : repli du mix sans texte validé (format attendu : conseil ; à défaut : ligne d'article notée).");
    expect(e.find((x) => x.startsWith("2026-11-04 TWITTER"))).toMatch(/format attendu : quiz seul ; à défaut : conseil, ligne d'article notée/);
    expect(e.find((x) => x.startsWith("2026-11-04 INSTAGRAM"))).toMatch(/format attendu : carrousel R9 ; à défaut : conseil/);
    expect(e.find((x) => x.startsWith("2026-11-03 LINKEDIN"))).toMatch(/format attendu : relais LinkedIn à angle travail\) ; articles de 7 jours au plus : humour-en-visio-reunion-en-ligne \(02\/11, thème bureau\)/);
    expect(e.map((x) => x.slice(0, 10))).toEqual(e.map((x) => x.slice(0, 10)).sort());
  });

  it("lecture : JSON vide accepté ; entrée non conforme refusée avec son motif", () => {
    expect(lireTextesFormats('{ "textes": [] }', "f.json")).toEqual({ textes: [], erreurs: [] });
    expect(lireTextesFormats("pas du json", "f.json").erreurs[0]).toMatch(/f\.json : JSON illisible/);
    const mauvais = [
      { ...conseilX(1), reseau: "LINKEDIN" },
      { ...conseilX(2), notes: [7.5, 9] },
      { ...conseilX(3), texte: `${"a".repeat(271)}` },
      { ...conseilX(4), texte: "Une phrase. https://deviens-marrant.fr" },
      { ...QUIZ, texte: `Intro. ${FORMULES.quizCourt}` },
      { ...CARROUSEL, cartes: CARROUSEL.cartes!.slice(0, 2) },
    ];
    const { textes, erreurs } = lireTextesFormats(JSON.stringify({ textes: [...mauvais, conseilX(5), conseilX(5)] }), "f.json");
    expect(textes.map((t) => t.id)).toEqual(["conseil-x-5"]);
    expect(erreurs.join("\n")).toMatch(/conseil-x-1 : conseil sur LinkedIn interdit/);
    expect(erreurs.join("\n")).toMatch(/conseil-x-2 : notes 7.5 \/ 9 sous la barre du format \(8/);
    expect(erreurs.join("\n")).toMatch(/conseil-x-3 : conseil X de 271 caractères \(plafond 270\)/);
    expect(erreurs.join("\n")).toMatch(/conseil-x-4 : lien dans le texte/);
    expect(erreurs.join("\n")).toMatch(/quiz-1 : quiz seul : texte sans la formule/);
    expect(erreurs.join("\n")).toMatch(/carrousel-t005 : Instagram : 5 cartes exactes attendues/);
    expect(erreurs.join("\n")).toMatch(/conseil-x-5 : id en double/);
  });
});

describe("barres et champs du lot 1b (08/10)", () => {
  it("barres : conseil 8 chez les 2 accepté (plan §3), relais LinkedIn 8,5 chez les 2 exigé", () => {
    const entrees = [{ ...conseilX(1), notes: [8, 8] }, { ...relaisLi(1), notes: [8.5, 8] }, { ...relaisLi(2), notes: [8.5, 8.5] }];
    const { textes, erreurs } = lireTextesFormats(JSON.stringify({ textes: entrees }), "f.json");
    expect(textes.map((t) => t.id)).toEqual(["conseil-x-1", "relais-li-2"]);
    expect(erreurs).toEqual(["f.json, relais-li-1 : notes 8.5 / 8 sous la barre du format (8.5 chez les 2 relecteurs)."]);
  });

  it("surtitre : conseil Instagram seulement, 4 mots au plus ; créneau AAAA-MM-JJ", () => {
    const entrees = [{ ...conseilIg(1), surtitre: "Le carnet d'absurdités" }, { ...conseilX(2), surtitre: "La remarque" },
      { ...conseilIg(3), surtitre: "Une technique beaucoup trop longue" }, { ...conseilX(4), creneau: "10/11/2026" }];
    const { textes, erreurs } = lireTextesFormats(JSON.stringify({ textes: entrees }), "f.json");
    expect(textes.map((t) => t.id)).toEqual(["conseil-ig-1"]);
    expect(erreurs.join("\n")).toMatch(/conseil-x-2 : « surtitre » réservé au conseil Instagram/);
    expect(erreurs.join("\n")).toMatch(/conseil-ig-3 : surtitre de 5 mots/);
    expect(erreurs.join("\n")).toMatch(/entrée 4 : creneau créneau AAAA-MM-JJ/);
    expect(lot(textes).posts.find((p) => p.mix?.texte === "conseil-ig-1")?.note).toMatch(/Surtitre de la carte 1 : « Le carnet d'absurdités »/);
  });

  it("créneau : le texte sert sa case, quel que soit l'ordre du fichier ; après la fin du lot, jamais pris", () => {
    const r = lot([{ ...conseilX(1), creneau: "2026-11-06" }, conseilX(2), { ...conseilX(3), creneau: "2026-11-20" }]);
    expect(de(r, "2026-11-03", "TWITTER")).toMatchObject({ mix: { texte: "conseil-x-2" } });
    expect(de(r, "2026-11-06", "TWITTER")).toMatchObject({ mix: { texte: "conseil-x-1" } });
    expect(r.posts.some((p) => p.mix?.texte === "conseil-x-3")).toBe(false);
  });

  it("fichier versionné du lot 1b : 13 textes conformes (10 conseils, 3 relais LinkedIn), créneaux tranchés", () => {
    const chemin = path.resolve(__dirname, "../../../../../docs/social/preparation/textes-formats-valides.json");
    const { textes, erreurs } = lireTextesFormats(fs.readFileSync(chemin, "utf-8"), chemin);
    expect(erreurs).toEqual([]);
    expect(textes.filter((t) => t.format === "conseil")).toHaveLength(10);
    expect(textes.filter((t) => t.format === "relaisLinkedIn").map((t) => `${t.creneau} ${t.article}`)).toEqual([
      "2026-11-05 blagues-de-couple-drole", "2026-11-10 chambrer-sans-blesser-entre-potes", "2026-11-12 voeux-drole-nouvelle-annee"]);
    for (const t of textes.filter((x) => x.reseau === "TWITTER")) expect(longueurX(t.texte!)).toBeLessThanOrEqual(270);
  });

  it("créneau tenu par une vanne au niveau : la vanne garde la case, le texte est rendu au repli (avertissement)", () => {
    const base = lot([conseilX(9)], { autorisees: ["t005"] });
    const vanne = base.posts.find((p) => p.vannes.includes("t005"))!;
    const t = { ...(vanne.platform === "INSTAGRAM" ? conseilIg(1) : conseilX(1)), creneau: vanne.date };
    const r = lot([t], { autorisees: ["t005"] });
    expect(r.posts.find((p) => p.date === vanne.date && p.platform === vanne.platform)?.vannes).toEqual(["t005"]);
    const sert = r.posts.find((p) => p.mix?.texte === t.id)!;
    expect(sert.date).not.toBe(vanne.date);
    expect(r.warnings.join("\n")).toMatch(new RegExp(`Texte ${t.id} .*case tenue par .*t005 .*texte rendu au repli`));
  });
});

describe("ordre du repli (mix §2)", () => {
  it("ordre par case : jamais de conseil sur LinkedIn, quiz puis conseil le mercredi X, carrousel le mercredi Instagram", () => {
    expect(ordreRepli("TWITTER", "VANNE")).toEqual(["conseil", "ligne"]);
    expect(ordreRepli("TWITTER", "RELAIS_LUNDI")).toEqual(["conseil", "ligne"]);
    expect(ordreRepli("TWITTER", "VANNE_QUIZ")).toEqual(["quiz", "conseil", "ligne"]);
    expect(ordreRepli("INSTAGRAM", "DECRYPTAGE")).toEqual(["carrousel", "conseil", "ligne"]);
    expect(ordreRepli("LINKEDIN", "LI_MARDI")).toEqual(["relaisLinkedIn"]);
    expect(ordreRepli("LINKEDIN", "LI_JEUDI")).not.toContain("conseil");
  });

  it("conseil d'abord, ligne d'article ensuite ; mardi et vendredi servis avant les autres jours", () => {
    const r = lot([ligneX(1), conseilX(1), conseilX(2)]);
    expect(de(r, "2026-11-03", "TWITTER")).toMatchObject({ type: "CONSEIL", mix: { format: "conseil", texte: "conseil-x-1" }, lien: null, sourceType: "ORIGINAL", sourceId: "conseil-x-1" });
    expect(de(r, "2026-11-06", "TWITTER")).toMatchObject({ type: "CONSEIL", mix: { texte: "conseil-x-2" } });
    // Lundi : plus de conseil, la ligne d'article notée prend la case (sans lien, clé 90 jours de la ligne).
    const lundi = de(r, "2026-11-02", "TWITTER")!;
    expect(lundi).toMatchObject({ type: "VANNE", origine: "MIX", mix: { format: "ligne" }, lien: null, sourceId: "ligne-x-1" });
    expect(lundi.vannes[0]).toMatch(/^se-presenter-avec-humour#/);
    expect(sansTexte(r).find((e) => e.startsWith("2026-11-05 TWITTER"))).toMatch(/format attendu : conseil/);
    expect(r.posts.map((p) => `${p.date}${p.platform}`)).toEqual([...r.posts].sort((a, b) => a.date.localeCompare(b.date)).map((p) => `${p.date}${p.platform}`));
  });

  it("conseil X : texte exact, 270 au plus, sans lien ; Instagram : 2 cartes et légende « À envoyer à »", () => {
    const r = lot([conseilX(1), conseilIg(1)]);
    const x = de(r, "2026-11-03", "TWITTER")!;
    expect(x.content).toBe(conseilX(1).texte);
    const ig = de(r, "2026-11-03", "INSTAGRAM")!;
    expect(ig).toMatchObject({ type: "CONSEIL", cartes: conseilIg(1).cartes, content: conseilIg(1).legende, lien: null });
    expect(ig.imageUrls).toHaveLength(2);
    expect(r.errors.filter((e) => /2026-11-03 (TWITTER|INSTAGRAM)/.test(e))).toEqual([]);
  });

  it("quiz seul le mercredi X (formule du quiz + lien), puis 1 mercredi sur 2 : conseil la semaine suivante", () => {
    const r = lot([QUIZ, { ...QUIZ, id: "quiz-2", profils: ["Absurde"] }, ...[1, 2, 3, 4, 5, 6, 7, 8].map(conseilX)], { debut: "2026-11-16", fin: "2026-11-28" });
    const q = de(r, "2026-11-18", "TWITTER")!;
    expect(q).toMatchObject({ type: "QUIZ", mix: { texte: "quiz-1" } });
    expect(q.content).toContain(`${FORMULES.quizCourt} https://deviens-marrant.fr/quiz-humour?utm_source=x`);
    expect(q.content.startsWith(QUIZ.texte!)).toBe(true);
    expect(de(r, "2026-11-25", "TWITTER")).toMatchObject({ type: "CONSEIL" });
    expect(r.posts.filter((p) => p.type === "QUIZ")).toHaveLength(1);
  });
});

describe("plafonds (mix §2 et §6)", () => {
  it("8 conseils par semaine au plus : les 2 cases restantes attendent une ligne d'article", () => {
    const r = lot([...[1, 2, 3, 4, 5].map(conseilX), ...[1, 2, 3, 4, 5].map(conseilIg)]);
    expect(r.posts.filter((p) => p.type === "CONSEIL")).toHaveLength(8);
    const jeudi = sansTexte(r).filter((e) => e.startsWith("2026-11-05 TWITTER") || e.startsWith("2026-11-05 INSTAGRAM"));
    expect(jeudi).toHaveLength(2);
    for (const e of jeudi) expect(e).toMatch(/format attendu : ligne d'article notée\)/);
    expect(r.posts.filter((p) => p.platform === "LINKEDIN" && p.type === "CONSEIL")).toEqual([]);
  });

  it("relais LinkedIn à angle travail : 2 par semaine au plus en repli, avec lien et garde d'article, sans erreur « 2 relais »", () => {
    const r = lot([relaisLi(1), relaisLi(2), relaisLi(3), conseilX(1)]);
    const li = r.posts.filter((p) => p.platform === "LINKEDIN");
    expect(li.map((p) => p.mix?.texte)).toEqual(["relais-li-1", "relais-li-2"]);
    for (const p of li) {
      expect(p).toMatchObject({ type: "RELAIS", article: "humour-en-visio-reunion-en-ligne" });
      expect(p.content.split("\n").pop()).toMatch(/^https:\/\/deviens-marrant\.fr\/blog\/humour-en-visio-reunion-en-ligne\?utm_source=linkedin/);
    }
    expect(controlerLot(r.posts).errors.filter((e) => /relais LinkedIn/.test(e))).toEqual([]);
    expect(r.posts.some((p) => p.platform === "LINKEDIN" && p.mix?.format === "conseil")).toBe(false);
  });

  it("relais LinkedIn : article hors thème bureau seulement si le texte porte l'angle travail ; article de plus de 7 jours refusé", () => {
    const voeux = { ...relaisLi(1), article: "voeux-drole-nouvelle-annee" };
    const semaine = { debut: "2026-11-09", fin: "2026-11-15" };
    expect(lot([voeux], semaine).posts.filter((p) => p.platform === "LINKEDIN")).toHaveLength(0);
    const r = lot([{ ...voeux, angleTravail: true }], semaine);
    expect(r.posts.filter((p) => p.platform === "LINKEDIN").map((p) => `${p.date} ${p.article}`)).toEqual(["2026-11-12 voeux-drole-nouvelle-annee"]);
    // Le 10/11, la visio (02/11) a 8 jours : aucun article possible, erreur explicite.
    expect(sansTexte(r).find((e) => e.startsWith("2026-11-10 LINKEDIN"))).toMatch(/aucun article de 7 jours au plus : relais impossible/);
  });
});

describe("carrousel R9 et registre", () => {
  const recents = [{ date: "2026-10-06", sourceId: "t005", platform: "TWITTER" }];

  it("vanne publiée sur X depuis 28 jours : carrousel du mercredi Instagram, 5 threadParts, compteur 90 jours remis à zéro", () => {
    const r = lot([CARROUSEL], { recents, autorisees: ["t005"] });
    const c = de(r, "2026-11-04", "INSTAGRAM")!;
    expect(c).toMatchObject({ type: "DECRYPTAGE", origine: "MIX", vannes: ["t005"], sourceType: "JOKE", sourceId: "t005", content: CARROUSEL.legende });
    expect(c.cartes).toEqual(CARROUSEL.cartes);
    expect(c.imageUrls).toHaveLength(4);
    expect(r.errors.filter((e) => e.startsWith("2026-11-04 INSTAGRAM"))).toEqual([]);
    // Le registre des 90 jours s'applique : la vanne n'est plus tirée nulle part dans le lot.
    expect(r.posts.filter((p) => p.vannes.includes("t005"))).toHaveLength(1);
    expect(controlerLot(r.posts).errors.filter((e) => /t005/.test(e))).toEqual([]);
  });

  it("refus R9 : 1re diffusion sur Instagram, moins de 28 jours, déjà réutilisée, cartes différentes de la vanne", () => {
    const refus = (rec: typeof recents, t: TexteFormat = CARROUSEL) => de(lot([t], { recents: rec, autorisees: ["t005"] }), "2026-11-04", "INSTAGRAM");
    expect(refus([{ ...recents[0], platform: "INSTAGRAM" }])).toBeUndefined();
    expect(refus([{ ...recents[0], date: "2026-10-12" }])).toBeUndefined();
    expect(refus([...recents, { date: "2026-10-20", sourceId: "t005", platform: "INSTAGRAM" }])).toBeUndefined();
    expect(refus(recents, { ...CARROUSEL, cartes: ["Autre amorce.", ...CARROUSEL.cartes!.slice(1)] })).toBeUndefined();
  });

  it("chaque texte une seule fois : jamais rejoué dans le lot, ni s'il est déjà en base", () => {
    const r = lot([conseilX(1)]);
    expect(r.posts.filter((p) => p.mix?.texte === "conseil-x-1")).toHaveLength(1);
    const deja = lot([conseilX(1)], { recents: [{ date: "2026-10-23", sourceId: "conseil-x-1", platform: "TWITTER" }] });
    expect(deja.posts.filter((p) => p.mix?.texte === "conseil-x-1")).toHaveLength(0);
  });
});

describe("lot 1a inchangé", () => {
  it("un lot sans case vide ne change pas, que le fichier des textes soit vide ou plein", () => {
    const META_1A = { lot: "relance-s15", debut: "2026-10-12", fin: "2026-10-18" };
    const tous = [QUIZ, CARROUSEL, ligneX(1), relaisLi(1), ...[1, 2, 3].map(conseilX), ...[1, 2, 3].map(conseilIg)];
    const sans = buildLotV5({ pool: catalogue(), articles: ARTICLES, recents: [], seed: "test", ...META_1A });
    const vide = buildLotV5({ pool: catalogue(), articles: ARTICLES, recents: [], seed: "test", ...META_1A, textesFormats: [] });
    const plein = buildLotV5({ pool: catalogue(), articles: ARTICLES, recents: [], seed: "test", ...META_1A, textesFormats: tous });
    expect(sans.errors).toEqual([]);
    expect(plein.posts.some((p) => p.mix)).toBe(false);
    for (const r of [vide, plein]) {
      expect(JSON.stringify(fichierLot(r.posts, "test", META_1A, r.replis))).toBe(JSON.stringify(fichierLot(sans.posts, "test", META_1A, sans.replis)));
      expect(r.errors).toEqual(sans.errors);
    }
  });
});
