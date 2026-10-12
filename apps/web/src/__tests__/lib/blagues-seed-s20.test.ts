/**
 * Tests s20 : seed des vannes aligné sur la base (décision Thomas du 12/10,
 * `docs/qa/diagnostic-vannes-s11-s20.md`) + garde-fou du seed de développement.
 *
 * - les 6 vannes actives portent le texte EN BASE (relu à l'aveugle en s14),
 *   au caractère près, sans alias : aucune tâche ni seed ne peut les renommer ;
 * - les 184 vannes inactives revenues à l'ancien texte sont retirées du seed
 *   (aucune réactivation possible au texte s11) ;
 * - conseils : 9 actifs alignés sur la base (8 + callback), 31 inactifs retirés ;
 * - `checkSeedTarget` refuse une base non vierge sans confirmation liée à l'hôte.
 */
import { createHash } from "crypto";
import blaguesSeed from "../../../../../docs/content/blagues-seed.json";
import conseilsSeed from "../../../../../docs/content/conseils-seed.json";
import { checkSeedTarget, databaseHost, SEED_CONFIRM_ENV } from "@/lib/seed-guard";

type SeedJoke = { id: number; content: string; punchline: string; previousContent?: string | string[] };
const seed = blaguesSeed as SeedJoke[];
const aliases = (j: SeedJoke) =>
  !j.previousContent ? [] : Array.isArray(j.previousContent) ? j.previousContent : [j.previousContent];

/** Textes lus en base de prod le 12/10 (lecture seule), identiques à Replit. */
const ACTIVES_EN_BASE: Array<[number, string, string]> = [
  [2, "Mon psy m'a dit que je devais arrêter de me comparer aux autres.", "J'ai vérifié, les autres n'ont pas ce problème."],
  [18, "J'ai dit à mon chat qu'on allait chez le vétérinaire.", "Depuis, il cherche « droits des animaux » sur mon ordinateur."],
  [80, "J'ai dit à Alexa de me raconter une blague.", "Elle m'a lu mon historique de recherches."],
  [109, "Mon ambition dans la vie, c'est d'être aussi confiant...", "Que le mec qui répond « à peu près » quand on lui demande s'il sait nager."],
  [266, "Elle m'a demandé ce que je faisais dans la vie.", "J'ai dit « des erreurs, principalement ». Elle a ri. Puis elle est partie."],
  [323, "J'ai mis mon réveil en face du lit pour être obligé de me lever.", "Maintenant je dors par terre, à côté du réveil."],
];

/** Identifiants seed des 184 vannes inactives en base (ancien texte), retirées. */
const RETIREES = [3,4,5,6,8,9,12,13,21,22,23,25,27,31,35,36,38,39,43,46,47,49,50,51,56,57,58,59,60,63,64,65,66,67,68,72,73,75,79,83,84,87,90,91,93,94,95,99,102,110,113,114,115,118,120,122,124,125,128,129,130,132,133,134,138,141,142,145,146,148,150,153,155,156,157,158,160,161,163,165,166,169,170,177,185,187,188,189,190,192,194,196,197,198,200,202,204,205,206,208,210,211,212,214,215,217,218,220,222,224,225,227,230,231,233,234,235,240,241,242,243,244,246,247,250,254,256,260,263,264,265,267,268,270,272,273,274,275,278,279,280,281,282,287,290,291,292,293,294,295,298,299,301,302,303,304,305,306,309,310,311,312,313,314,315,318,320,321,324,326,328,329,333,335,336,337,338,339,340,341,342,343,346,347];

describe("blagues-seed.json (s20)", () => {
  it("les 6 vannes actives portent le texte en base, au caractère près, sans alias", () => {
    for (const [id, content, punchline] of ACTIVES_EN_BASE) {
      const joke = seed.find((j) => j.id === id);
      expect(joke).toBeDefined();
      expect(joke!.content).toBe(content);
      expect(joke!.punchline).toBe(punchline);
      expect(joke!.previousContent).toBeUndefined();
    }
  });

  it("aucune autre entrée n'a pour alias le texte d'une des 6 (pas de renommage possible)", () => {
    const textes = new Set(ACTIVES_EN_BASE.map(([, c]) => c));
    expect(seed.flatMap(aliases).filter((a) => textes.has(a))).toEqual([]);
    expect(seed.filter((j) => textes.has(j.content))).toHaveLength(6);
  });

  it("les 184 vannes inactives sont retirées, rien d'autre", () => {
    expect(RETIREES).toHaveLength(184);
    const ids = new Set(seed.map((j) => j.id));
    expect(RETIREES.filter((id) => ids.has(id))).toEqual([]);
    expect(seed).toHaveLength(264 - 184);
    expect(ids.size).toBe(seed.length);
  });
});

describe("conseils-seed.json (s20, `docs/qa/diagnostic-conseils-videos-s11-s20.md`)", () => {
  type SeedTip = { id: number; title: string; content: string; example: string; exercise: string; previousTitle?: unknown };
  const tips = conseilsSeed as SeedTip[];
  /**
   * Empreinte sha256 (16 premiers caractères) de [title, content, example, exercise]
   * des lignes lues en base de prod le 12/10 (lecture seule) : 8 actifs du
   * groupe C + le callback (n° 6, défi Storytelling étape 6).
   */
  const ALIGNES_EN_BASE: Array<[number, string]> = [
    [1, "878ffe36bbfd26c3"],
    [3, "9dd90f4a353f3545"],
    [4, "fcb1954172253f87"],
    [6, "2961a26d64fd2004"],
    [12, "5a6379a9aaa9e4a6"],
    [14, "ecd75f9ae090f7b4"],
    [18, "0e4326bad0523c01"],
    [40, "804e33786087f984"],
    [45, "5e3c212240c2a615"],
  ];
  /** Les 31 conseils inactifs restés à l'ancien texte (groupe A), retirés. */
  const RETIRES = [7,15,22,26,27,28,29,32,33,36,37,38,41,43,44,52,54,55,56,60,61,62,64,65,66,67,68,73,74,75,77];

  it("les 9 conseils alignés portent le texte en base, au caractère près, sans alias", () => {
    for (const [id, empreinte] of ALIGNES_EN_BASE) {
      const tip = tips.find((t) => t.id === id)!;
      const hash = createHash("sha256")
        .update(JSON.stringify([tip.title, tip.content, tip.example, tip.exercise]))
        .digest("hex")
        .slice(0, 16);
      expect([id, hash]).toEqual([id, empreinte]);
      expect(tip.previousTitle).toBeUndefined();
    }
  });

  it("les 31 conseils inactifs sont retirés, rien d'autre", () => {
    expect(RETIRES).toHaveLength(31);
    const ids = new Set(tips.map((t) => t.id));
    expect(RETIRES.filter((id) => ids.has(id))).toEqual([]);
    expect(tips).toHaveLength(69 - 31);
  });
});

describe("checkSeedTarget (garde-fou du seed de développement)", () => {
  const URL_TEST = "postgresql://u:p@ep-test-123.eu-central-1.aws.neon.tech/neondb?sslmode=require";
  const HOST = "ep-test-123.eu-central-1.aws.neon.tech";

  it("base vierge : autorisé sans variable", () => {
    expect(checkSeedTarget({ users: 0, dataPatches: 0 }, URL_TEST, undefined).allowed).toBe(true);
  });

  it("base avec utilisateurs ou marqueurs : refusé sans confirmation", () => {
    const d1 = checkSeedTarget({ users: 12, dataPatches: 0 }, URL_TEST, undefined);
    const d2 = checkSeedTarget({ users: 0, dataPatches: 40 }, URL_TEST, undefined);
    expect(d1.allowed).toBe(false);
    expect(d2.allowed).toBe(false);
    expect(d1.reason).toContain(`${SEED_CONFIRM_ENV}=${HOST}`);
  });

  it("confirmation acceptée seulement si elle vaut l'hôte exact de DATABASE_URL", () => {
    const state = { users: 3, dataPatches: 5 };
    expect(checkSeedTarget(state, URL_TEST, "1").allowed).toBe(false);
    expect(checkSeedTarget(state, URL_TEST, "ep-autre.neon.tech").allowed).toBe(false);
    expect(checkSeedTarget(state, undefined, HOST).allowed).toBe(false);
    expect(checkSeedTarget(state, URL_TEST, HOST).allowed).toBe(true);
  });

  it("databaseHost : hôte ou null", () => {
    expect(databaseHost(URL_TEST)).toBe(HOST);
    expect(databaseHost(undefined)).toBeNull();
    expect(databaseHost("pas une url")).toBeNull();
  });
});
