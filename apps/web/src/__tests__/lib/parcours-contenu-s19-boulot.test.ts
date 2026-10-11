/**
 * s19 : parcours Boulot (contenu validé, livré INACTIF derrière BOULOT_PUBLIE).
 * Contenu (`parcours-boulot-s19.json`, extrait par `scripts/content/boulot-s19-extraire.py`) :
 * chaque texte se retrouve mot pour mot dans les documents validés, 6 étapes, XP,
 * dayNumber, positions des bonnes réponses, 5 vannes par étape dans l'ordre de V,
 * vannes en ligne contrôlées contre l'export du 11/10, conseils répliqués dans
 * conseils-seed.json, contrôles de contenu (import-boulot.md §6), protection IA.
 */
import fs from "fs";
import path from "path";
import boulot from "../../../../../docs/content/parcours-boulot-s19.json";
import vannesActives from "../../../../../docs/content/vannes-actives-s19.json";
import conseilsSeed from "../../../../../docs/content/conseils-seed.json";
import weakJokes from "@/data/weak-jokes.json";
import { VANNES_LIEES_AUX_PARCOURS } from "@/lib/parcours-vannes-protegees";

const ROOT = path.resolve(__dirname, "../../../../..");
const lire = (rel: string) => fs.readFileSync(path.join(ROOT, rel), "utf8");
const I = lire("docs/marrant/parcours-boulot-s19/import-boulot.md");
const E = lire("docs/copy/etalons-parcours-boulot-s19.md");
const P = lire("docs/copy/parcours-boulot-etapes-2-6-s19.md");
const V = lire("docs/marrant/parcours-boulot-s19/vannes-neuves/vannes-finales.md");
const SOURCES = [I, E, P, V, lire("docs/content/videos-seed.json"),
  ...[1, 2, 5, 6].map((n) => lire(`docs/copy/conseils-boulot-s19-v${n}.md`))].join("\n");

const seed = boulot.parcours;
const meta = boulot._meta;
const TEST_FINAL =
  "Avant de la sortir, un seul test : passerait-elle si toute l'équipe l'entendait ou la lisait, y compris la personne dont elle parle ?";
const lettres = (s: { quiz: Array<{ correctIndex: number }> }) => s.quiz.map((q) => "ABCD"[q.correctIndex]).join("");

function allStrings(value: unknown): string[] {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(allStrings);
  if (value && typeof value === "object") return Object.values(value).flatMap(allStrings);
  return [];
}

describe("fiche du parcours Boulot (import-boulot.md §1)", () => {
  it("slug, titre, ordre 5, 6 semaines à 15 min/semaine, suite Storytelling", () => {
    expect(seed).toMatchObject({
      slug: "boulot",
      title: "Parcours Boulot",
      pageTitle: "Parcours Boulot : oser une vanne sans te griller, 6 semaines",
      order: 5,
      duration: "6 semaines",
      timePerWeek: "15 min/semaine",
      difficulty: "DEBUTANT",
      difficultyLabel: "DEBUTANT → INTERMEDIAIRE",
      persona: "Sophie (26 ans, jeune active en CDI)",
      nextParcours: "storytelling",
      nextParcoursRanking: ["storytelling", "machine-a-cafe", "repartie", "confiance"],
    });
    expect(seed.pageTitle).toHaveLength(60);
  });

  it("metaDescription de 154 caractères, rythme et première étape gratuite", () => {
    expect(seed.metaDescription).toHaveLength(154);
    expect(seed.metaDescription).toContain("6 semaines à 15 min/semaine");
    expect(seed.metaDescription.endsWith("Première étape gratuite.")).toBe(true);
    expect(seed.metaDescription).not.toMatch(/drôle|bureau|humour|cours gratuit|IA/);
  });

  it("description, accroche et témoignage : colonne B (complice) des étalons §2", () => {
    const fiche = E.slice(E.indexOf("## 2. Fiche du parcours"), E.indexOf("## 3."));
    for (const k of ["description", "personaTagline", "testimonial"] as const) {
      expect(fiche).toContain(`| ${seed[k]} |\n`);
    }
    expect(seed.testimonial.startsWith("Imagine Anouk")).toBe(true);
  });
});

describe("6 étapes (import-boulot.md §2)", () => {
  it("XP 50 à 150 (600 + 100 de fin), dayNumber 3 à 38, seule l'étape 1 gratuite", () => {
    expect(seed.steps.map((s) => s.week)).toEqual([1, 2, 3, 4, 5, 6]);
    expect(seed.steps.map((s) => s.moduleXp)).toEqual([50, 75, 100, 100, 125, 150]);
    expect(seed.steps.reduce((n, s) => n + s.moduleXp, 0)).toBe(600);
    expect(seed.steps.map((s) => s.dayNumber)).toEqual([3, 10, 17, 24, 31, 38]);
    expect(seed.steps.map((s) => s.free)).toEqual([true, false, false, false, false, false]);
  });

  it("tipTitle = colonne « Conseil » de la table C2, mot pour mot", () => {
    const table = I.slice(I.indexOf("| Étape | `tipTitle`"), I.indexOf("Le `title` écrit"));
    const titres = Array.from(table.matchAll(/^\| \d \| ([^|`]+?) \|$/gm), (m) => m[1]);
    expect(seed.steps.map((s) => s.tipTitle)).toEqual(titres);
    expect(titres).toHaveLength(6);
  });

  it("moduleDetail : un saut de paragraphe, puis la phrase du test (étape 1 : version choix 6 B)", () => {
    seed.steps.forEach((s) => expect(s.moduleDetail.split("\n\n")).toHaveLength(2));
    expect(seed.steps[0].moduleDetail.split("\n\n")[1].startsWith("Un seul test pour toute la suite :")).toBe(true);
    seed.steps.slice(1).forEach((s) => expect(s.moduleDetail.endsWith(`\n\n${TEST_FINAL}`)).toBe(true));
    expect(P).toContain(`« ${TEST_FINAL} »`);
  });

  it("durée et retour d'exercice : étape 6 seule renseignée, notes aux étapes 2, 3 et 6", () => {
    const d = seed.steps.map((s) => ("dureeTexte" in s ? s.dureeTexte : null));
    expect(d.slice(0, 5)).toEqual([null, null, null, null, null]);
    expect(d[5]).toBe("Environ 20 min, hors vidéos : 10 min de lecture et de quiz, 10 min pour écrire ton toast.");
    const notes = seed.steps.map((s) => ("retourExerciceNote" in s ? Boolean(s.retourExerciceNote) : false));
    expect(notes).toEqual([false, true, true, false, false, true]);
  });

  it("vidéos : ids de §2, 2 aux étapes 1 à 4, une aux étapes 5 et 6, chacune légendée", () => {
    expect(seed.steps.map((s) => s.videos.map((v) => v.youtubeId))).toEqual([
      ["57Ip2k3us_8", "rldvVgHQSvo"], ["QGqA4va99rw", "zGT7TX66JFQ"], ["NebHsD_K9lM", "3v8Y4C9Q5hE"],
      ["DK7ASNHnKm4", "TDmd7JRlxFc"], ["ztKRY4eNUTA"], ["Fw14PLdtSyA"],
    ]);
    seed.steps.flatMap((s) => s.videos).forEach((v) => expect(v.why.length).toBeGreaterThan(40));
    expect(seed.steps.map((s) => s.moduleFormat.includes("une vidéo"))).toEqual([false, false, false, false, true, true]);
  });

  it("quiz : 19 questions, positions B D A | C B D | C A B | D C A | B C A | D B C A, jamais deux de suite", () => {
    expect(seed.steps.map(lettres)).toEqual(["BDA", "CBD", "CAB", "DCA", "BCA", "DBCA"]);
    const suite = seed.steps.map(lettres).join("");
    for (let i = 1; i < suite.length; i++) expect(suite[i]).not.toBe(suite[i - 1]);
    seed.steps.flatMap((s) => s.quiz).forEach((q) => {
      expect(q.options).toHaveLength(4);
      expect(q.explanation.startsWith(`La ${"ABCD"[q.correctIndex]}.`)).toBe(true);
    });
    // Étape 1 : guillemets gardés en Q1 et Q2 (phrases à écrire), retirés en Q3 (consignes).
    const [q1, q2, q3] = seed.steps[0].quiz;
    [...q1.options, ...q2.options].forEach((o) => expect(o).toMatch(/^« .+ »$/));
    q3.options.forEach((o) => expect(o).not.toMatch(/^«/));
  });
});

describe("textes = sources validées (aucun texte retapé)", () => {
  it("chaque texte du fichier de contenu se retrouve mot pour mot dans les documents validés", () => {
    const constantes = new Set(["boulot", "BOULOT", "ONE_LINER", "OBSERVATION", "STORYTELLING", "AUTODERISION",
      "ABSURDE", "💼", "6 semaines", "15 min/semaine", "DEBUTANT", "INTERMEDIAIRE", "DEBUTANT → INTERMEDIAIRE"]);
    const textes = allStrings([seed, meta.conseils, meta.vannesNeuves, meta.vannesEnLigne]).filter((t) => !constantes.has(t));
    const absents = textes.filter(
      (t) =>
        !SOURCES.includes(t) &&
        !SOURCES.includes(t.replace("\n\n", " `[saut de paragraphe (\\n\\n)]` ")) &&
        !SOURCES.includes(`« ${t} »`),
    );
    expect(absents).toEqual([]);
  });

  it("contrôles de contenu (§6) : zéro tiret cadratin, « blague », « carnet », marqueur entre crochets", () => {
    const textes = allStrings([seed, meta.conseils, meta.vannesNeuves]);
    textes.forEach((t) => {
      expect(t).not.toContain("—");
      expect(t).not.toMatch(/blague|carnet/i);
      expect(t).not.toMatch(/\[[^\]]*\]/);
    });
    // Aucun prénom de persona dans les textes affichés (le champ `persona` est une note de fiche).
    const { persona: _persona, ...affiches } = seed;
    expect(allStrings(affiches).some((t) => t.includes("Sophie"))).toBe(false);
  });
});

describe("vannes des étapes (import-boulot.md §4)", () => {
  const exportVannes = (vannesActives as { vannes: Array<{ id: string; content: string }> }).vannes;
  const byId = new Map(exportVannes.map((v) => [v.id, v.content]));
  const actives = new Set(exportVannes.map((v) => v.content));

  it("5 par étape, dans l'ordre des tableaux de V, 30 textes distincts", () => {
    seed.steps.forEach((s, i) => {
      const bloc = V.slice(V.indexOf(`### Étape ${i + 1} :`), V.indexOf(i < 5 ? `### Étape ${i + 2} :` : "## S-2"));
      const contents = Array.from(bloc.matchAll(/^\| [^|]+? \| [^|]+? \| (.+?) \| .+? \| .+? \|$/gm), (m) => m[1]).filter(
        (c) => c !== "content" && !c.startsWith("---"),
      );
      expect(s.jokeContents).toEqual(contents);
    });
    expect(new Set(seed.steps.flatMap((s) => s.jokeContents)).size).toBe(30);
  });

  it("20 en ligne : ids de §4.2, texte identique à l'export du 11/10 (actives)", () => {
    expect(meta.vannesEnLigne.map((v) => v.etape)).toEqual([1, 1, 2, 2, 2, 2, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 5, 6, 6, 6]);
    meta.vannesEnLigne.forEach((v) => expect(byId.get(v.id)).toBe(v.content));
    expect(meta.vannesEnLigne.map((v) => v.id)).toContain("cmmnsqn15007dth63pcggw13x");
  });

  it("10 neuves BOULOT : places de §4.1, absentes de l'export, décryptage dans les 3 champs", () => {
    expect(meta.vannesNeuves.map((v) => v.place)).toEqual([
      "V-1-1", "V-1-2", "V-1-3", "V-2-1", "V-3-1", "V-3-2", "V-3-3", "V-4-3", "V-6-2", "V-6-3",
    ]);
    meta.vannesNeuves.forEach((v) => {
      expect(actives.has(v.content)).toBe(false);
      expect(v).toMatchObject({ category: "BOULOT", type: "ONE_LINER" });
      expect(v.comedyTechnique).not.toMatch(/[.*]$/);
      expect(v.techniqueExplanation).not.toContain("À toi de jouer");
      expect(v.howToApply.startsWith("À toi de jouer : ")).toBe(true);
      expect(v.howToApply).toContain("Exemple : ");
    });
  });

  it("aucune vanne du parcours dans la liste des vannes faibles (désactivées au démarrage)", () => {
    const faibles = new Set(weakJokes as string[]);
    expect(seed.steps.flatMap((s) => s.jokeContents).filter((c) => faibles.has(c))).toEqual([]);
  });

  it("protection IA : les 30 vannes, dont les 2 marquées generatedByAI, hors de la relecture automatique", () => {
    const protegees = new Set(VANNES_LIEES_AUX_PARCOURS);
    seed.steps.flatMap((s) => s.jokeContents).forEach((c) => expect(protegees.has(c)).toBe(true));
    ["cmoxx7e56003xs60yyooxncw3", "cmnl01zwv004ss60y2ecodj9a"].forEach((id) =>
      expect(protegees.has(byId.get(id) as string)).toBe(true),
    );
  });
});

describe("conseils (import-boulot.md §3) et conseils-seed.json", () => {
  const byTitle = new Map(
    (conseilsSeed as Array<{ title: string; content: string; example: string; exercise: string; category: string; difficulty: string }>).map(
      (t) => [t.title, t],
    ),
  );

  it("6 conseils : ids des 4 existants, 2 créés, catégories et difficultés validées", () => {
    expect(meta.conseils.map((c) => c.id)).toEqual([
      null, "cmmw0tqkc000smw62bo1yfeyg", "cmmw0tr870014mw62jnung2qp", "cmmw0trc60016mw629l4o8rav",
      "cmmw0tra60015mw62l0360wm9", null,
    ]);
    expect(meta.conseils.map((c) => c.category)).toEqual([
      "OBSERVATION", "ABSURDE", "OBSERVATION", "STORYTELLING", "AUTODERISION", "STORYTELLING",
    ]);
    expect(meta.conseils.map((c) => c.title)).toEqual(seed.steps.map((s) => s.tipTitle));
  });

  it("PS de l'étape 2 : chute a, exemple d'une seule citation", () => {
    const ps = meta.conseils[1];
    expect(ps.example.endsWith("mais à mon reflet dans l'écran. »")).toBe(true);
    expect(ps.example.startsWith("« Bonjour Inès,")).toBe(true);
  });

  it("textes identiques dans conseils-seed.json (un rejeu du seed ne remet pas l'ancien texte)", () => {
    meta.conseils.forEach((c) =>
      expect(byTitle.get(c.title)).toMatchObject({
        content: c.content, example: c.example, exercise: c.exercise, category: c.category, difficulty: c.difficulty,
      }),
    );
  });
});
