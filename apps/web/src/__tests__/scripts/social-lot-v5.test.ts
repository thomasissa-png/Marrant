/**
 * @jest-environment node
 *
 * Lot de relance v5 (s15) : contrôles étendus (R6, LinkedIn 3 phrases, longueur X),
 * lignes d'article, grille X 5 / Instagram 5 / LinkedIn 2, heures de Paris des deux
 * côtés du passage à l'heure d'hiver, anti-répétition, Noël, « pain », sorties JSON.
 * Données simulées, aucune base.
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { nombreDeSlides, slidesDuPost, texteAlternatifDuPost } from "@/lib/social/generate-post-image";
import { longueurX } from "@/lib/social/longueur-x";
import { checkPost, nombreDePhrases, premierePersonne } from "../../../scripts/content/social-controls";
import { extraireLignes } from "../../../scripts/content/social-article-lines";
import { citerLigne, parisToUtc, vanneR6, type CatalogueJoke } from "../../../scripts/content/social-month-plan";
import { buildLotV5, controlerLot, deuxCartes, nombreDeCartes, type ArticleLot, type LotPost } from "../../../scripts/content/social-lot-v5";
import { FIXES } from "../../../scripts/content/social-lot-v5-fixes";
import { RESERVEES_NOEL } from "../../../scripts/content/social-lot-v5-config";
import { fichierLot, renderLotMarkdown, textesNeufs } from "../../../scripts/content/social-lot-v5-export";
import { lireFichierLot } from "../../../scripts/content/social-lot-v5-insert";

const L1 = "« Il y a un canapé dans l'espace détente de mon bureau. Personne ne s'y est jamais assis. »\n« Il est là pour prouver qu'on pourrait. »";
const L2 = "Ton manager t'écrit « t'as deux minutes ? » et rien d'autre. Tu passes les quatre minutes suivantes à t'inventer trois fautes graves, dont une dans un dossier que tu n'as jamais ouvert. Il voulait le code du photocopieur.";
const L3 = "Au tour de table, tu es le suivant, et celui d'avant vient d'évoquer sa boîte montée à 19 ans. Ta présentation commence par « Bonjour, moi c'est » et se termine au même endroit. Voici 5 accroches pour la prolonger, et comment trouver la tienne :\nhttps://deviens-marrant.fr/blog/se-presenter-avec-humour?utm_source=linkedin&utm_medium=social&utm_campaign=2026-10&utm_content=relais";

describe("contrôles étendus (social-controls)", () => {
  it("R6 : « je » admis entre « », refusé hors guillemets (j'ai compris)", () => {
    expect(checkPost({ platform: "TWITTER", text: "« J'ai dit oui. »\n« Il a ri. »", quoted: "", r6: true })).toEqual([]);
    expect(checkPost({ platform: "TWITTER", text: "J'ai dit oui.\nIl a ri.", quoted: "", r6: true })).toContain("« je » hors des « » (R6)");
    expect(premierePersonne("Au milieu de la soirée, j'ai proposé")).toBe(true);
    expect(premierePersonne("Avec un collègue, on a comparé nos salaires.")).toBe(true);
    expect(premierePersonne("Un pote a quitté le groupe.")).toBe(false);
  });

  it("LinkedIn : 3 phrases au plus (L1, L2, L3 passent ; une 4e phrase bloque)", () => {
    expect(nombreDePhrases(L1)).toBe(3);
    expect(nombreDePhrases(L2)).toBe(3);
    expect(nombreDePhrases(L3)).toBe(3);
    for (const t of [L1, L2, L3]) expect(checkPost({ platform: "LINKEDIN", text: t, quoted: "", r6: true })).toEqual([]);
    expect(checkPost({ platform: "LINKEDIN", text: `${L2} Il est reparti.`, quoted: "", r6: true })).toContain("LinkedIn : 4 phrases (max 3)");
  });

  it("X : longueur comptée par X (lien = 23, espace fine = 2) et plafond 270", () => {
    const lien = "https://deviens-marrant.fr/quiz-humour?utm_source=x&utm_medium=social&utm_campaign=2026-10&utm_content=quiz";
    expect(longueurX(`abc ${lien}`)).toBe(27);
    expect(longueurX("« a »")).toBe(5);
    expect(longueurX("« a »")).toBe(7);
    expect(checkPost({ platform: "TWITTER", text: `${"a".repeat(240)} ${lien}`, quoted: "" })).toEqual([]);
    expect(checkPost({ platform: "INSTAGRAM", text: "x".repeat(81), quoted: "", maxLength: 80 })[0]).toMatch(/trop long/);
  });

  it("citerLigne : une paire par ligne, « » intérieurs en “ ”", () => {
    expect(citerLigne("Elle a dit « non ».")).toBe("« Elle a dit “non”. »");
    expect(vanneR6(["A.", "B."], true)).toBe("« A. »\n« B. »");
    expect(vanneR6(["A.", "B."], false)).toBe("A.\nB.");
  });
});

describe("lignes d'article", () => {
  const contenu = [
    "> **En bref :** résumé.",
    "### 1. Titre",
    "> « J'ai fait ceci. »",
    ">",
    "> « Elle a fait cela. »",
    "**Pourquoi ça marche :** la chute arrive tard. Seconde phrase.",
    "**À toi de jouer :** repense à un moment gênant. Puis écris-le.",
    "> Mon chef a offert un mug. / Depuis, on se surveille.### 2. Suite",
    "**3.** Joyeux anniversaire. J'ai cherché une photo de nous deux. J'ai trouvé mon pouce.",
    "**4.** Joyeux anniversaire [prénom] ! Gabarit.",
    "> Discours 1.", "> Discours 2.", "> Discours 3.",
  ].join("\n");
  const cat: CatalogueJoke[] = [{ id: "jmug", setup: "Mon chef a offert un mug.", punchline: "Depuis, on se surveille.", isActive: true, verdict: "GARDER" }];
  const ls = extraireLignes("art", contenu, cat);

  it("reconnaît citations, amorce / chute, lignes numérotées ; ignore gabarits et discours", () => {
    expect(ls.map((l) => l.lignes)).toEqual([
      ["J'ai fait ceci.", "Elle a fait cela."],
      ["Mon chef a offert un mug.", "Depuis, on se surveille."],
      ["Joyeux anniversaire. J'ai cherché une photo de nous deux. J'ai trouvé mon pouce."],
    ]);
    expect(ls[2].rang).toBe(3);
  });

  it("décryptage (1re phrase), ligne collée signalée, correspondance au catalogue", () => {
    expect(ls[0].pourquoi).toBe("la chute arrive tard.");
    expect(ls[0].jouer).toBe("repense à un moment gênant.");
    expect(ls[1].coupee).toBe(true);
    expect(ls[1].catalogueId).toBe("jmug");
  });

  it("deux cartes : la chute part de la dernière phrase de plus de 3 mots", () => {
    expect(deuxCartes(["On m'a dit que le discours dispense de vaisselle. Le mien sera long. Joyeux anniversaire."]))
      .toEqual(["On m'a dit que le discours dispense de vaisselle.", "Le mien sera long. Joyeux anniversaire."]);
    expect(deuxCartes(["Une seule phrase."])).toBeNull();
  });
});

describe("heures de Paris et passage à l'heure d'hiver (dim. 25/10/2026)", () => {
  it.each([
    ["2026-10-23", 12, 30, "2026-10-23T10:30:00.000Z"],
    ["2026-10-23", 19, 30, "2026-10-23T17:30:00.000Z"],
    ["2026-10-23", 8, 15, "2026-10-23T06:15:00.000Z"],
    ["2026-10-26", 12, 30, "2026-10-26T11:30:00.000Z"],
    ["2026-10-26", 19, 30, "2026-10-26T18:30:00.000Z"],
    ["2026-10-27", 8, 15, "2026-10-27T07:15:00.000Z"],
  ])("%s %i:%i Paris → %s", (date, h, m, iso) => {
    expect(parisToUtc(date as string, h as number, m as number).toISOString()).toBe(iso);
  });
});

// ── Lot complet sur données simulées ──
function catalogue(): CatalogueJoke[] {
  const ids = new Set<string>();
  for (const f of FIXES) if (f.vanne?.jokeId) ids.add(f.vanne.jokeId);
  ids.add("cs14jk69eb578cce484b6f87");
  const fixes = [...ids].map((id, i) => ({ id, setup: `J'ai une vanne fixe ${i}.`, punchline: `Elle tombe juste ${i}.`, isActive: true, verdict: "GARDER", category: "BOULOT" }));
  const tirage = Array.from({ length: 180 }, (_, i) => ({
    id: `t${String(i).padStart(3, "0")}`, setup: `J'ai raconté l'histoire numéro ${i} au travail.`, punchline: `Mon voisin a compris la ${i}.`,
    isActive: true, verdict: "GARDER", category: i % 4 === 0 ? "BOULOT" : "SITUATION",
  }));
  return [...fixes, ...tirage];
}
const halloween = Array.from({ length: 8 }, (_, i) => `### ${i + 1}. T\n> « J'ai porté le costume ${i + 1}. »\n>\n> « On m'a pris pour un meuble ${i + 1}. »\n**Pourquoi ça marche :** le costume parle à ta place.\n**À toi de jouer :** choisis un objet de ta maison.`).join("\n");
const anniversaire = Array.from({ length: 21 }, (_, i) => `**${i + 1}.** Joyeux anniversaire. J'ai écrit le message ${i + 1} trop tard. Tu l'as lu avant moi.`).join("\n");
const ARTICLES: ArticleLot[] = [
  { slug: "blagues-halloween-soiree-deguisee", title: "Blagues d'Halloween : 8 vannes pour ta soirée déguisée", category: "CATALOGUE", date: "2026-10-05", content: halloween },
  { slug: "se-presenter-avec-humour", title: "Se présenter avec humour : 5 accroches qui passent", category: "PRATIQUE", date: "2026-10-12", content: "" },
  { slug: "message-anniversaire-drole-par-situation", title: "Message d'anniversaire drôle : 21 textes par situation", category: "CATALOGUE", date: "2026-10-22", content: anniversaire },
  { slug: "blagues-sur-l-ia-assistants-vocaux", title: "Blagues sur l'IA : 6 vannes sur nos assistants vocaux", category: "CATALOGUE", date: "2026-10-26", content: "" },
  { slug: "humour-en-visio-reunion-en-ligne", title: "Humour en visio : faire rire à travers un écran", category: "CONTEXTE", date: "2026-11-02", content: "> « J'ai coupé ma caméra. »\n>\n> « Personne n'a vu la différence. »" },
  { slug: "toast-drole-discours-qui-fait-rire", title: "Toast drôle : la structure d'un discours qui fait rire", category: "GUIDE", date: "2026-11-30",
    content: "> J'ai tapé sur mon verre pour demander le silence. Quelqu'un a demandé « c'est pour un mariage ? ». J'ai dit non. Il y a eu de la déception.\n\n> J'ai préparé mon toast sur une fiche, avec mes meilleures phrases soulignées. Dans le trac, j'ai tout lu, sauf les phrases soulignées." },
  { slug: "voeux-drole-nouvelle-annee", title: "Vœux drôles nouvelle année : messages prêts à envoyer", category: "CATALOGUE", date: "2026-11-12",
    content: Array.from({ length: 12 }, (_, i) => `**${i + 1}.** Bonne année. J'ai tenu ma résolution ${i + 1} une heure.`).join("\n") },
];
const lot = buildLotV5({ pool: catalogue(), articles: ARTICLES, recents: [{ date: "2026-10-02", sourceId: "t000" }], seed: "test" });
const parPf = (pf: string) => lot.posts.filter((p) => p.platform === pf);
const paris = (p: LotPost) => new Date(p.scheduledAt).toLocaleTimeString("fr-FR", { timeZone: "Europe/Paris", hour: "2-digit", minute: "2-digit" });

describe("lot de relance v5 (buildLotV5)", () => {
  it("aucune erreur, X 58, Instagram 58, LinkedIn 24 (silences du 11/11 et du 27/11)", () => {
    expect(lot.errors).toEqual([]);
    expect(controlerLot(lot.posts).errors).toEqual([]);
    expect([parPf("TWITTER").length, parPf("INSTAGRAM").length, parPf("LINKEDIN").length]).toEqual([58, 58, 24]);
    expect(lot.posts.some((p) => p.date === "2026-11-11" || p.date === "2026-11-27")).toBe(false);
  });

  it("heures de Paris fixes des deux côtés du 25/10 : X 12:30, Instagram 19:30, LinkedIn 08:15", () => {
    expect(new Set(parPf("TWITTER").map(paris))).toEqual(new Set(["12:30"]));
    expect(new Set(parPf("INSTAGRAM").map(paris))).toEqual(new Set(["19:30"]));
    expect(new Set(parPf("LINKEDIN").map(paris))).toEqual(new Set(["08:15"]));
  });

  it("les 9 posts validés sont à leur date, textes de marque inchangés", () => {
    const v = lot.posts.filter((p) => p.origine === "VALIDE");
    expect(v.map((p) => `${p.cle} ${p.date}`).sort()).toEqual([
      "IG1 2026-10-27", "IG2 2026-10-12", "IG3 2026-10-14", "L1 2026-10-15", "L2 2026-10-29", "L3 2026-10-13", "X1 2026-10-13", "X2 2026-10-22", "X3 2026-10-21",
    ]);
    expect(v.find((p) => p.cle === "L2")!.content).toBe(L2);
    expect(v.find((p) => p.cle === "L3")!.content).toBe(L3);
    expect(v.find((p) => p.cle === "IG3")!.imageUrls).toHaveLength(4);
  });

  it("LinkedIn du 24/12 déplacé au 23/12 ; Noël réservé à partir du 24/12", () => {
    expect(parPf("LINKEDIN").map((p) => p.date)).toContain("2026-12-23");
    expect(parPf("LINKEDIN").map((p) => p.date)).not.toContain("2026-12-24");
    for (const p of lot.posts) if (p.vannes.some((k) => RESERVEES_NOEL.includes(k))) expect(p.date >= "2026-12-24").toBe(true);
  });

  it("anti-répétition : aucune vanne deux fois, ni une vanne postée avant le lot", () => {
    const cles = lot.posts.flatMap((p) => p.vannes);
    expect(new Set(cles).size).toBe(cles.length);
    expect(cles).not.toContain("t000");
  });

  it("UTM v5 sur chaque lien, relais du lundi et du jeudi, quiz du mercredi", () => {
    for (const p of lot.posts) if (p.lien) expect(p.lien).toMatch(/utm_source=(x|linkedin)&utm_medium=social&utm_campaign=\d{4}-\d{2}&utm_content=(lundi|jeudi|quiz|saison|relais)$/);
    expect(lot.posts.find((p) => p.cle === "X2")!.lien).toContain("utm_campaign=2026-10&utm_content=jeudi");
    expect(lot.posts.find((p) => p.date === "2026-11-04" && p.platform === "TWITTER")!.lien).toContain("/quiz-humour?utm_source=x");
    expect(lot.posts.find((p) => p.date === "2026-12-31" && p.platform === "LINKEDIN")!.lien).toContain("utm_content=saison");
  });

  it("R6 : toute vanne à la 1re personne est entre « » sur X et LinkedIn", () => {
    for (const p of lot.posts.filter((x) => x.platform !== "INSTAGRAM" && x.vannes.length)) expect(p.content.startsWith("«")).toBe(true);
  });

  it("relais LinkedIn d'un article à angle bureau (visio) le mardi, au plus 1 par semaine", () => {
    const li = lot.posts.find((p) => p.date === "2026-11-03" && p.platform === "LINKEDIN")!;
    expect(li.type).toBe("RELAIS");
    expect(li.content.split("\n").pop()).toMatch(/^https:\/\/deviens-marrant\.fr\/blog\/humour-en-visio/);
  });

  it("déterministe : même graine, même lot", () => {
    const bis = buildLotV5({ pool: catalogue(), articles: ARTICLES, recents: [{ date: "2026-10-02", sourceId: "t000" }], seed: "test" });
    expect(bis.posts.map((p) => [p.id, p.content])).toEqual(lot.posts.map((p) => [p.id, p.content]));
  });

  it("textes neufs signalés (renvoi générique), formules v5 non signalées", () => {
    const neufs = textesNeufs(lot.posts).map((t) => t.texte);
    expect(neufs).toContain("Les autres exemples, et comment trouver le tien :");
    expect(neufs).not.toContain("Les 21 messages de l'article sont prêts à copier :");
    expect(renderLotMarkdown(lot.posts, [], [], lot.stockEligible, "test")).toContain("Textes NEUFS à faire passer à la relecture à l'aveugle");
  });
});

describe("contrôles du lot (controlerLot)", () => {
  const base = lot.posts[0];
  it("bloque une vanne répétée et deux « pain » à moins de 30 jours", () => {
    const doublon = [base, { ...base, date: "2026-11-02" }];
    expect(controlerLot(doublon).errors.join(" ")).toMatch(/anti-répétition/);
    const pain = [{ ...base, vannes: ["a"], content: "« Il est allé chercher du pain. »" }, { ...base, date: "2026-10-20", vannes: ["b"], content: "« Encore du pain. »" }];
    expect(controlerLot(pain).errors.join(" ")).toMatch(/pain/);
  });
});

describe("sorties : JSON d'insertion et carrousel de décryptage", () => {
  it("lignes APPROVED « thomas-s15 », formats par réseau, relues par lireFichierLot", () => {
    const f = fichierLot(lot.posts, "test");
    expect(f.total).toBe(140);
    expect(new Set(f.posts.map((p) => `${p.status}|${p.approvedBy}`))).toEqual(new Set(["APPROVED|thomas-s15"]));
    expect(f.posts.find((p) => p.platform === "INSTAGRAM")!.format).toBe("IMAGE_QUI_CLAQUE");
    expect(f.posts.find((p) => p.platform === "LINKEDIN")!.cta).toBeNull();
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "lot-"));
    const ok = path.join(dir, "ok.json");
    fs.writeFileSync(ok, JSON.stringify(f));
    expect(lireFichierLot(ok).total).toBe(140);
    const ko = path.join(dir, "ko.json");
    fs.writeFileSync(ko, JSON.stringify({ ...f, posts: f.posts.map((p, i) => (i === 0 ? { ...p, status: "PENDING" } : p)) }));
    expect(() => lireFichierLot(ko)).toThrow(/hors APPROVED/);
  });

  it("décryptage : 5 parties en base, 4 cartes rendues", () => {
    const post = { format: "IMAGE_QUI_CLAQUE", hook: "A", content: "deviens-marrant.fr", targetPersona: "YANIS",
      threadParts: ["J'ai fait\nceci.", "Chute.", "Pourquoi ça fait rire : x.", "À toi de jouer : y.", "Le quiz est dans le lien de la bio."] };
    expect(nombreDeCartes(post.threadParts)).toBe(4);
    expect(slidesDuPost(post)).toHaveLength(4);
    expect(nombreDeSlides(post)).toBe(4);
    expect(texteAlternatifDuPost(post)).toBe("J'ai fait ceci. Chute.");
  });
});
