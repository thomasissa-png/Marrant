/**
 * Lot V7 — filtre anti-séries des vannes générées (joke-series-guard.ts).
 * 100 % programmatique : aucun appel LLM, aucun mock réseau.
 * Les setups « série » viennent de l'export prod du 30/09/2026
 * (docs/copy/audit-vannes-s14/export-vannes-actives.txt).
 */
import {
  AVOID_LIST_MAX_CHARS,
  AVOID_LIST_MAX_ENTRIES,
  MAX_ACTIVE_PER_AMORCE,
  NEAR_DUPLICATE_THRESHOLD,
  amorceWords,
  buildAvoidListPrompt,
  buildJokeSeriesGuard,
  clusterSetups,
  contentWords,
  detectTics,
  jaccard,
  normalizeSetup,
  type ExistingJokeSetup,
} from "@/lib/ai/joke-series-guard";
import { JOKE_FLOOR_ETALONS } from "@/lib/ai/joke-quality-bar";

const active = (content: string): ExistingJokeSetup => ({ content, isActive: true });
const inactive = (content: string): ExistingJokeSetup => ({ content, isActive: false });

// Série « resto » réelle (export prod)
const RESTO = [
  "Mon copain : 'Choisis le resto samedi, ça m'est égal.' J'ai choisi un vegan.",
  "Mon copain : 'Choisis le resto, ça m'est égal.'",
  "Mon copain m'a demandé de choisir le resto pour samedi soir.",
  "Mon copain m'a dit 'choisis toi le resto pour samedi, ça m'est égal'.",
];

describe("normalisation et similarité", () => {
  it("normalise casse, accents, apostrophes et ponctuation", () => {
    expect(normalizeSetup("J’ai  ÉTÉ « là »... ")).toBe("j ai ete la");
  });

  it("ignore les mots-outils et absorbe les flexions (troncature 5 lettres)", () => {
    const a = contentWords("Mon copain m'a dit : choisis le resto");
    const b = contentWords("Mon copain veut que je choisisse un resto");
    expect(a.has("chois")).toBe(true);
    expect(b.has("chois")).toBe(true);
    expect(a.has("le")).toBe(false);
  });

  it("Jaccard : 1 sur ensembles identiques, 0 si l'un est vide", () => {
    const s = new Set(["a", "b"]);
    expect(jaccard(s, new Set(["a", "b"]))).toBe(1);
    expect(jaccard(s, new Set())).toBe(0);
    expect(jaccard(new Set(["a", "b"]), new Set(["b", "c"]))).toBeCloseTo(1 / 3);
  });

  it("l'amorce se limite aux 12 premiers mots", () => {
    const long = "Mon copain m'a dit de choisir le resto pour samedi soir et ensuite on verra bien pour les desserts du dimanche";
    expect(amorceWords(long).has("desse")).toBe(false);
  });
});

describe("rejet des quasi-doublons (actifs ET inactifs)", () => {
  it(`rejette un setup quasi identique (seuil ${NEAR_DUPLICATE_THRESHOLD})`, () => {
    const guard = buildJokeSeriesGuard([active(RESTO[0])]);
    const r = guard.check({ content: "Mon copain : « Choisis le resto samedi, ça m'est égal. »", punchline: "Il a pris la carte." });
    expect(r).toMatchObject({ ok: false, reason: "near-duplicate" });
  });

  it("compare aussi aux vannes inactives (retirées par l'audit)", () => {
    const guard = buildJokeSeriesGuard([inactive("J'ai regardé la programmation de Coachella pendant 20 minutes.")]);
    const r = guard.check({ content: "J'ai regardé la programmation de Solidays pendant 20 minutes.", punchline: "Je connais deux noms." });
    expect(r).toMatchObject({ ok: false, reason: "near-duplicate" });
  });

  it("laisse passer une vanne sur un thème voisin mais une situation différente", () => {
    const guard = buildJokeSeriesGuard(RESTO.map(active));
    const r = guard.check({ content: "Le serveur m'a demandé si tout allait bien.", punchline: "J'ai dit oui. Il a vu mon assiette." });
    expect(r).toEqual({ ok: true });
  });

  it("les 4 étalons passent contre un catalogue sans rapport", () => {
    const guard = buildJokeSeriesGuard([...RESTO.map(active), active("J'ai attendu mon bus sous la pluie ce matin pendant 20 minutes.")]);
    for (const e of JOKE_FLOOR_ETALONS) {
      expect(guard.check({ content: e.setup, punchline: e.punchline })).toEqual({ ok: true });
    }
  });

  it("catalogue vide ou illisible → aucun rejet de série", () => {
    const guard = buildJokeSeriesGuard([]);
    expect(guard.size).toBe(0);
    expect(guard.avoidListPrompt).toBe("");
    expect(guard.check({ content: RESTO[0], punchline: "x" })).toEqual({ ok: true });
  });
});

describe(`plafond : au plus ${MAX_ACTIVE_PER_AMORCE} vannes actives par amorce`, () => {
  // Même amorce (12 premiers mots), suites différentes : aucun quasi-doublon,
  // mais la même série. C'est le cas que le plafond doit couvrir.
  const bus = [
    "Ce matin j'ai attendu le bus sous la pluie battante pendant vingt minutes. Le chauffeur m'a salué en passant sans s'arrêter.",
    "Ce matin j'ai attendu le bus sous la pluie battante pendant une heure. Une voisine m'a apporté un café et une serviette.",
    "Ce matin j'ai attendu le bus sous la pluie battante pendant longtemps. Mon téléphone a proposé de me commander une barque.",
  ];
  const candidate = {
    content: "Ce matin j'ai attendu le bus sous la pluie battante pendant des siècles. Un pigeon s'est abrité sous mon manteau.",
    punchline: "Il avait l'air de connaître les horaires.",
  };

  it("vérifie que le candidat n'est pas un quasi-doublon (pré-condition du test)", () => {
    for (const b of bus) {
      expect(jaccard(contentWords(candidate.content), contentWords(b))).toBeLessThan(NEAR_DUPLICATE_THRESHOLD);
    }
  });

  it("2 actives sur l'amorce → la 3e passe", () => {
    const guard = buildJokeSeriesGuard(bus.slice(0, 2).map(active));
    expect(guard.check(candidate)).toEqual({ ok: true });
  });

  it("3 actives sur l'amorce → la 4e est rejetée", () => {
    const guard = buildJokeSeriesGuard(bus.map(active));
    expect(guard.check(candidate)).toMatchObject({ ok: false, reason: "series-cap" });
  });

  it("les inactives ne comptent pas dans le plafond", () => {
    const guard = buildJokeSeriesGuard([...bus.slice(0, 2).map(active), inactive(bus[2])]);
    expect(guard.check(candidate)).toEqual({ ok: true });
  });
});

describe("tics du générateur (audit s14)", () => {
  it.each([
    ["J'ai dit oui en 2019. Je réfléchis depuis 2019.", "« depuis 2019 »"],
    ["J'ai enfin compris pourquoi on dit que l'amour fait pleurer.", "« j'ai enfin compris pourquoi on dit que »"],
    ["J'ai pris ma retraite pendant la réunion.", "« j'ai pris ma retraite pendant »"],
    ["Il m'a regardé... longtemps.", "points de suspension"],
    ["Il m'a regardé… longtemps.", "points de suspension"],
  ])("détecte %s", (text, label) => {
    expect(detectTics(text)).toContain(label);
  });

  it("rejette une vanne dont la chute contient un tic", () => {
    const guard = buildJokeSeriesGuard([]);
    const r = guard.check({ content: "Mon mec m'a offert des fleurs.", punchline: "J'ai enfin compris pourquoi on dit que l'amour fait pleurer." });
    expect(r).toMatchObject({ ok: false, reason: "tic" });
  });

  it("n'accuse pas les étalons", () => {
    for (const e of JOKE_FLOOR_ETALONS) expect(detectTics(`${e.setup} ${e.punchline}`)).toEqual([]);
  });
});

describe("liste compacte des amorces à éviter", () => {
  it("regroupe les séries et ignore les amorces uniques", () => {
    const clusters = clusterSetups([...RESTO.map(active), inactive(RESTO[1]), active("Mon GPS m'a dit de tourner à droite.")]);
    expect(clusters).toHaveLength(1);
    expect(clusters[0]).toMatchObject({ total: 5, active: 4 });
  });

  it("respecte le budget (entrées et caractères)", () => {
    const many = Array.from({ length: 200 }, (_, i) => ({
      label: `Amorce numéro ${i} avec une situation assez longue pour peser dans le budget`,
      total: 200 - i,
      active: 1,
    }));
    const prompt = buildAvoidListPrompt(many);
    const lines = prompt.split("\n").filter((l) => l.startsWith("- "));
    expect(lines.length).toBeLessThanOrEqual(AVOID_LIST_MAX_ENTRIES);
    expect(lines.join("\n").length).toBeLessThanOrEqual(AVOID_LIST_MAX_CHARS);
    expect(lines[0]).toContain("(x200)");
  });

  it("le guard expose la liste prête à injecter", () => {
    const guard = buildJokeSeriesGuard(RESTO.map(active));
    expect(guard.avoidListPrompt).toContain("AMORCES DÉJÀ EXPLOITÉES");
    expect(guard.avoidListPrompt).toContain("(x4)");
  });
});
