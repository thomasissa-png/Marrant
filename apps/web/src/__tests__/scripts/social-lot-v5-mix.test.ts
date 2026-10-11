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
import { PLAFONDS_MIX, partiesConseilIg, caseConseilNominale, conseilPermis, lireTextesFormats, ordreRepli, type TexteFormat } from "../../../scripts/content/social-lot-v5-mix";
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
    // Seul post : l'étalon V-A, post fixe du LinkedIn du 03/11 (contrôle @reviewer du lot 1b, E1).
    expect(r.posts.map((p) => p.cle)).toEqual(["LI-visio-03-11"]);
    // X 5, Instagram 5, LinkedIn 2 : 12 cases, 11 erreurs (LinkedIn du 03/11 servi), dans l'ordre des dates.
    expect(e).toHaveLength(11);
    expect(e).toContain("2026-11-03 TWITTER : créneau du 03/11 (X) : repli du mix sans texte validé (format attendu : conseil ; à défaut : ligne d'article notée).");
    expect(e.find((x) => x.startsWith("2026-11-04 TWITTER"))).toMatch(/format attendu : quiz seul ; à défaut : conseil, ligne d'article notée/);
    expect(e.find((x) => x.startsWith("2026-11-04 INSTAGRAM"))).toMatch(/format attendu : carrousel R9 ; à défaut : conseil/);
    expect(e.find((x) => x.startsWith("2026-11-05 LINKEDIN"))).toMatch(/format attendu : relais LinkedIn à angle travail\) ; articles de 7 jours au plus : humour-en-visio-reunion-en-ligne \(02\/11, thème bureau\)/);
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
    const p = lot(textes).posts.find((x) => x.mix?.texte === "conseil-ig-1")!;
    expect(p.note).toMatch(/Surtitre « Le carnet d'absurdités » de la carte 1 \(rendu à part/);
    // Gabarit carte conseil : [surtitre, carte 1, carte 2], cartes mot pour mot (plus de « Technique : » dans le texte).
    expect(p.cartes).toEqual(["Le carnet d'absurdités", ...conseilIg(1).cartes!]);
    expect(p.imageUrls).toHaveLength(2);
  });

  it("partiesConseilIg : [surtitre, carte 1, carte 2], textes intacts ; sans surtitre rien ne change", () => {
    expect(partiesConseilIg(["Premier rendez-vous.", "Réplique."], "La fausse naïveté")).toEqual(["La fausse naïveté", "Premier rendez-vous.", "Réplique."]);
    expect(partiesConseilIg(["A.", "B."])).toEqual(["A.", "B."]);
  });

  it("créneau : le texte sert sa case, quel que soit l'ordre du fichier ; après la fin du lot, jamais pris", () => {
    const r = lot([{ ...conseilX(1), creneau: "2026-11-06" }, conseilX(2), { ...conseilX(3), creneau: "2026-11-20" }]);
    expect(de(r, "2026-11-03", "TWITTER")).toMatchObject({ mix: { texte: "conseil-x-2" } });
    expect(de(r, "2026-11-06", "TWITTER")).toMatchObject({ mix: { texte: "conseil-x-1" } });
    expect(r.posts.some((p) => p.mix?.texte === "conseil-x-3")).toBe(false);
  });

  it("fichier versionné du lot 1b : 19 textes conformes (10 conseils nominaux, 5 de repli, 1 carrousel R9, 3 relais LinkedIn)", () => {
    const chemin = path.resolve(__dirname, "../../../../../docs/social/preparation/textes-formats-valides.json");
    const { textes, erreurs } = lireTextesFormats(fs.readFileSync(chemin, "utf-8"), chemin);
    expect(erreurs).toEqual([]);
    expect(textes).toHaveLength(19);
    expect(textes.filter((t) => t.format === "conseil" && t.role !== "repli")).toHaveLength(10);
    // Repli du 10/10 (aveugle-1b-repli-resultat.md, tours 1 à 3) : K59, K42, K53, K63 et K76 sur leur créneau.
    expect(textes.filter((t) => t.role === "repli").map((t) => `${t.creneau} ${t.reseau}`)).toEqual([
      "2026-11-09 TWITTER", "2026-11-09 INSTAGRAM", "2026-11-12 TWITTER", "2026-11-05 INSTAGRAM", "2026-11-12 INSTAGRAM"]);
    expect(textes.filter((t) => t.format === "carrousel").map((t) => `${t.creneau} ${t.jokeId}`)).toEqual(["2026-11-04 cs14jk34c841ef6e1abadb11"]);
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
    // Jeudi : jamais de conseil nominal ; ligne d'article notée, sinon conseil de repli S1 seulement (décision du 10/10).
    expect(sansTexte(r).find((e) => e.startsWith("2026-11-05 TWITTER"))).toMatch(/format attendu : ligne d'article notée ; à défaut : conseil\)/);
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
  it("conseils nominaux jamais le lundi ni le jeudi : 6 conseils sur la semaine, lundi et jeudi attendent une ligne ou un repli S1", () => {
    const r = lot([...[1, 2, 3, 4, 5].map(conseilX), ...[1, 2, 3, 4, 5].map(conseilIg)]);
    expect(r.posts.filter((p) => p.type === "CONSEIL")).toHaveLength(6);
    expect(PLAFONDS_MIX.conseilsParSemaine).toBe(8);
    const lunJeu = sansTexte(r).filter((e) => /^2026-11-0[25] (TWITTER|INSTAGRAM)/.test(e));
    expect(lunJeu).toHaveLength(4);
    for (const e of lunJeu) expect(e).toMatch(/format attendu : ligne d'article notée ; à défaut : conseil\)/);
    expect(r.posts.filter((p) => p.platform === "LINKEDIN" && p.type === "CONSEIL")).toEqual([]);
  });

  it("relais LinkedIn à angle travail : 2 par semaine au plus en repli, avec lien et garde d'article, sans erreur « 2 relais »", () => {
    const r = lot([relaisLi(1), relaisLi(2), relaisLi(3), conseilX(1)]);
    const li = r.posts.filter((p) => p.platform === "LINKEDIN");
    // L'étalon V-A (post fixe du 03/11) compte dans les 2 relais de la semaine.
    expect(li.map((p) => p.cle ?? p.mix?.texte)).toEqual(["LI-visio-03-11", "relais-li-1"]);
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

describe("cases de conseil nominales (plan §3, décision du 08/10)", () => {
  const FICHIER = path.resolve(__dirname, "../../../../../docs/social/preparation/textes-formats-valides.json");
  const reels = () => lireTextesFormats(fs.readFileSync(FICHIER, "utf-8"), FICHIER).textes;
  const LOT_1B = { lot: "relance-s15", debut: "2026-10-19", fin: "2026-11-15" };
  const jour = (d: string) => new Date(`${d}T12:00:00Z`).getUTCDay();

  it("vendredi avant le 03/11, mardi et vendredi ensuite ; X et Instagram ; jamais LinkedIn, lundi, jeudi ni exception", () => {
    for (const pf of ["TWITTER", "INSTAGRAM"] as const) {
      expect(caseConseilNominale("2026-10-23", pf)).toBe(true);
      expect(caseConseilNominale("2026-10-27", pf)).toBe(false);
      expect(caseConseilNominale("2026-11-03", pf)).toBe(true);
      expect(caseConseilNominale("2026-11-06", pf)).toBe(true);
      expect(caseConseilNominale("2026-10-30", pf)).toBe(false);
      expect(caseConseilNominale("2026-11-27", pf)).toBe(false);
    }
    expect(caseConseilNominale("2026-11-05", "LINKEDIN")).toBe(false);
    expect([conseilPermis("2026-11-09"), conseilPermis("2026-11-12"), conseilPermis("2026-11-10"), conseilPermis("2026-11-11")]).toEqual([false, false, true, true]);
    // Lundi et jeudi : ligne notée, puis conseil de repli S1 seulement (décision du 10/10) ; jours d'exception : aucun conseil.
    expect(ordreRepli("TWITTER", "RELAIS_JEUDI", "2026-11-12")).toEqual(["ligne", "conseil"]);
    expect(ordreRepli("INSTAGRAM", "RELAIS_LUNDI", "2026-11-09")).toEqual(["ligne", "conseil"]);
    expect(ordreRepli("TWITTER", "VANNE", "2026-10-30")).toEqual(["ligne"]);
    expect(ordreRepli("TWITTER", "VANNE_QUIZ", "2026-11-04")).toEqual(["quiz", "conseil", "ligne"]);
  });

  it("lecture : un conseil à créneau hors case nominale est refusé", () => {
    const entrees = [{ ...conseilX(1), creneau: "2026-11-09" }, { ...conseilX(2), creneau: "2026-10-27" }, { ...conseilIg(3), creneau: "2026-10-30" },
      { ...conseilX(4), creneau: "2026-11-10" }];
    const { textes, erreurs } = lireTextesFormats(JSON.stringify({ textes: entrees }), "f.json");
    expect(textes.map((t) => t.id)).toEqual(["conseil-x-4"]);
    for (const id of ["conseil-x-1", "conseil-x-2", "conseil-ig-3"]) expect(erreurs.join("\n")).toMatch(new RegExp(`${id} : créneau .* hors case de conseil nominale`));
  });

  it("conseil nominal prioritaire : il passe avant la vanne, qui retourne au tirage (aucun texte rendu)", () => {
    const base = lot([], { autorisees: undefined, debut: "2026-11-03", fin: "2026-11-03" });
    const v = de(base, "2026-11-03", "TWITTER")!.vannes[0];
    expect(v).toBeTruthy();
    // Pool réduit à cette seule vanne : sans le conseil, elle tiendrait le mardi X.
    expect(de(lot([], { autorisees: [v], debut: "2026-11-03", fin: "2026-11-03" }), "2026-11-03", "TWITTER")!.vannes).toEqual([v]);
    const r = lot([{ ...conseilX(1), creneau: "2026-11-03" }], { autorisees: [v], debut: "2026-11-03", fin: "2026-11-03" });
    expect(de(r, "2026-11-03", "TWITTER")).toMatchObject({ type: "CONSEIL", mix: { texte: "conseil-x-1" } });
    expect(de(r, "2026-11-03", "TWITTER")!.note).toMatch(/^Case de conseil nominale/);
    expect(r.warnings.join("\n")).not.toMatch(/texte rendu au repli/);
    // La vanne n'est pas consommée par la case du conseil : elle reste au tirage des autres cases.
    const ailleurs = r.posts.filter((p) => p.vannes.includes(v));
    expect(ailleurs).toHaveLength(1);
    expect(ailleurs[0].platform).not.toBe("TWITTER");
  });

  it("fichier versionné, stock plein : K36 et K26 le ven. 23/10, K28 et K30 le mar. 03/11, aucun conseil nominal lundi ou jeudi", () => {
    for (const autorisees of [undefined, ["aucune-vanne"]]) {
      const r = lot(reels(), { ...LOT_1B, autorisees });
      expect(de(r, "2026-10-23", "TWITTER")?.mix?.texte).toBe("cmptbp7nv002bs60xscu5ixmx");
      expect(de(r, "2026-10-23", "INSTAGRAM")?.mix?.texte).toBe("cmny1tkhw000rs60wsolieluq");
      expect(de(r, "2026-11-03", "TWITTER")?.mix?.texte).toBe("cmmw0tqkc000smw62bo1yfeyg");
      expect(de(r, "2026-11-03", "INSTAGRAM")?.mix?.texte).toBe("cmq0gw85z00nas60xc0gno2ka");
      const conseils = r.posts.filter((p) => p.type === "CONSEIL");
      expect(conseils.length).toBeGreaterThanOrEqual(4);
      // Conseils de repli (role « repli », décision du 10/10) : tout jour ouvré ; les nominaux jamais lundi ni jeudi.
      const repli = new Set(reels().filter((t) => t.role === "repli").map((t) => t.id));
      for (const p of conseils) {
        if (!repli.has(p.mix?.texte ?? "")) expect([1, 4]).not.toContain(jour(p.date));
        expect(p.platform).not.toBe("LINKEDIN");
      }
    }
  });
});

describe("relais LinkedIn validés sur leur créneau (mix §2, plan §2, décision du 08/10)", () => {
  // Jeudi 05/11 : aucun article ce jour-là, la case LinkedIn tire une vanne (X et Instagram aussi, dans l'ordre du pool).
  const JEUDI = { debut: "2026-11-05", fin: "2026-11-05" };
  const relais = { ...relaisLi(1), creneau: "2026-11-05" };

  it("vannes au niveau hors thème bureau : le relais garde sa case, avant la vanne", () => {
    const autorisees = ["t001", "t002", "t003"];
    // Sans le relais, la case LinkedIn tient une vanne hors thème bureau : il y a bien des vannes au niveau.
    const temoin = de(lot([], { ...JEUDI, autorisees }), "2026-11-05", "LINKEDIN")!;
    expect(temoin.type).toBe("VANNE");
    expect(temoin.mix).toBeUndefined();
    expect(temoin.vannes).toEqual(["t003"]);
    const r = lot([relais], { ...JEUDI, autorisees });
    const li = de(r, "2026-11-05", "LINKEDIN")!;
    expect(li).toMatchObject({ type: "RELAIS", origine: "MIX", mix: { format: "relaisLinkedIn", texte: "relais-li-1" }, article: "humour-en-visio-reunion-en-ligne" });
    expect(li.note).toMatch(/^Relais LinkedIn validé sur son créneau/);
    expect(r.posts.some((p) => p.vannes.includes("t003"))).toBe(false);
    expect(r.warnings.join("\n")).not.toMatch(/relais-li-1 .*texte rendu au repli/);
    expect(r.errors.filter((e) => e.startsWith("2026-11-05"))).toEqual([]);
  });

  it("vanne de thème bureau au niveau, libre : elle garde la priorité, le relais est rendu au repli", () => {
    // t004 : thème bureau (BOULOT), libre pour LinkedIn (X et Instagram prennent t001 et t002).
    const autorisees = ["t001", "t002", "t004"];
    const r = lot([relais], { ...JEUDI, autorisees });
    const li = de(r, "2026-11-05", "LINKEDIN")!;
    expect(li).toMatchObject({ type: "VANNE", vannes: ["t004"] });
    expect(li.mix).toBeUndefined();
    expect(li.note).toMatch(/Vanne de thème bureau au niveau : passe avant le relais validé relais-li-1/);
    expect(r.posts.some((p) => p.mix?.texte === "relais-li-1")).toBe(false);
    expect(r.warnings.join("\n")).toMatch(/Texte relais-li-1 .*plan §2 : une vanne de thème bureau passe avant le relais.*texte rendu au repli/);
  });
});

describe("conseil de repli S1 (plan §3, décision du 10/10) et carrousel R9 à 28 jours", () => {
  const repli = (t: TexteFormat, creneau?: string): TexteFormat => ({ ...t, role: "repli", ...(creneau ? { creneau } : {}) });
  const ids = (entrees: TexteFormat[]) => lireTextesFormats(JSON.stringify({ textes: entrees }), "f.json");

  it("repli un jeudi : accepté à la lecture et posé sur sa case X et Instagram, avant une ligne libre", () => {
    const entrees = [repli(conseilX(1), "2026-11-05"), repli(conseilIg(2), "2026-11-05")];
    const { textes, erreurs } = ids(entrees);
    expect(erreurs).toEqual([]);
    expect(textes.map((t) => t.id)).toEqual(["conseil-x-1", "conseil-ig-2"]);
    const r = lot([ligneX(9), ...textes], { debut: "2026-11-05", fin: "2026-11-05" });
    expect(de(r, "2026-11-05", "TWITTER")).toMatchObject({ type: "CONSEIL", origine: "MIX", mix: { format: "conseil", texte: "conseil-x-1" }, lien: null });
    expect(de(r, "2026-11-05", "INSTAGRAM")).toMatchObject({ type: "CONSEIL", mix: { texte: "conseil-ig-2" }, content: conseilIg(2).legende });
    expect(r.errors.filter((e) => /^2026-11-05 (TWITTER|INSTAGRAM)/.test(e))).toEqual([]);
  });

  it("repli sans créneau : sert le lundi et le jeudi ; le conseil nominal (sans role) n'y va jamais", () => {
    const r = lot([repli(conseilX(1)), repli(conseilX(2)), conseilX(3)], { debut: "2026-11-02", fin: "2026-11-05" });
    // Mardi d'abord (1er texte libre), puis par date : le lundi prend le 2e repli, le mercredi le nominal.
    expect(r.posts.filter((p) => p.platform === "TWITTER").map((p) => `${p.date} ${p.mix?.texte}`)).toEqual([
      "2026-11-02 conseil-x-2", "2026-11-03 conseil-x-1", "2026-11-04 conseil-x-3"]);
    const nominalSeul = lot([conseilX(3)], { debut: "2026-11-05", fin: "2026-11-05" });
    expect(de(nominalSeul, "2026-11-05", "TWITTER")).toBeUndefined();
  });

  it("nominal un jeudi : refusé à la lecture (sans role ou role « nominal ») ; repli hors jour ouvré, exception ou LinkedIn : refusé", () => {
    const { textes, erreurs } = ids([{ ...conseilX(1), creneau: "2026-11-05" }, { ...conseilX(2), role: "nominal", creneau: "2026-11-12" },
      repli(conseilX(3), "2026-11-07"), repli(conseilIg(4), "2026-10-30"), { ...repli(conseilX(5), "2026-11-05"), reseau: "LINKEDIN" },
      { ...QUIZ, role: "repli" }]);
    expect(textes).toEqual([]);
    const tout = erreurs.join("\n");
    for (const id of ["conseil-x-1", "conseil-x-2"]) expect(tout).toMatch(new RegExp(`${id} : créneau 2026-11-(05|12) hors case de conseil nominale.*« role » « repli »`));
    for (const id of ["conseil-x-3", "conseil-ig-4"]) expect(tout).toMatch(new RegExp(`${id} : créneau .* hors case de conseil de repli`));
    expect(tout).toMatch(/conseil-x-5 : conseil sur LinkedIn interdit/);
    expect(tout).toMatch(/quiz-1 : « role » réservé au conseil/);
  });

  it("9e conseil de la semaine refusé : à la lecture (créneaux) et au tirage (8 posés au plus)", () => {
    const jours = ["2026-11-02", "2026-11-03", "2026-11-04", "2026-11-05", "2026-11-06"];
    const neuf = [...jours.map((d, i) => repli(conseilX(i + 1), d)), ...jours.slice(0, 4).map((d, i) => repli(conseilIg(i + 1), d))];
    const { textes, erreurs } = ids(neuf);
    expect(textes).toHaveLength(8);
    expect(erreurs).toEqual(["f.json, conseil-ig-4 : 9e conseil de la semaine du 02/11 (8 au plus, nominaux compris)."]);
    // Le lundi suivant ouvre une nouvelle semaine.
    expect(ids([...neuf.slice(0, 8), repli(conseilIg(4), "2026-11-09")]).erreurs).toEqual([]);
    // Au tirage : 10 cases X et Instagram vides, 10 conseils de repli libres, 8 posés.
    const r = lot([...[1, 2, 3, 4, 5].map((n) => repli(conseilX(n))), ...[1, 2, 3, 4, 5].map((n) => repli(conseilIg(n)))]);
    expect(r.posts.filter((p) => p.type === "CONSEIL")).toHaveLength(PLAFONDS_MIX.conseilsParSemaine);
    expect(sansTexte(r).filter((e) => /(TWITTER|INSTAGRAM)/.test(e))).toHaveLength(2);
  });

  it("carrousel R9 : vanne publiée en base depuis 27 jours refusée, depuis 28 jours acceptée (5 parties, légende)", () => {
    const carrousel = (date: string) => lot([CARROUSEL], { recents: [{ date, sourceId: "t005", platform: "TWITTER" }], autorisees: ["t005"] });
    const a27 = carrousel("2026-10-08");
    expect(de(a27, "2026-11-04", "INSTAGRAM")).toBeUndefined();
    expect(a27.warnings).toContain("Carrousel carrousel-t005 (t005) : publiée depuis 27 jours (28 au moins, mix §3), non utilisé.");
    const a28 = carrousel("2026-10-07");
    expect(de(a28, "2026-11-04", "INSTAGRAM")).toMatchObject({ type: "DECRYPTAGE", mix: { format: "carrousel", texte: "carrousel-t005" }, cartes: CARROUSEL.cartes, content: CARROUSEL.legende });
    expect(de(a28, "2026-11-04", "INSTAGRAM")!.cartes).toHaveLength(5);
    // Jamais publiée en base : refusée, avec son motif.
    expect(lot([CARROUSEL], { autorisees: ["t005"] }).warnings).toContain("Carrousel carrousel-t005 (t005) : vanne jamais publiée en base, non utilisé.");
    // Lecture : créneau hors mercredi refusé.
    expect(ids([{ ...CARROUSEL, creneau: "2026-11-05" }]).erreurs.join("\n")).toMatch(/carrousel R9 : créneau 2026-11-05 hors mercredi/);
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
