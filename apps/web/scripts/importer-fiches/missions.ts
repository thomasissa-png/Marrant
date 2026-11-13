/**
 * Import des missions (s24) : table `docs/espace-client/etiquetage-defis-marches-s24.md` (clôture, 107
 * missions, 20 hors missions) + suites génériques `docs/copy/espace/suites-missions-s24.md` (reco A).
 *
 * - L'énoncé est le champ `exercise` du seed, mot pour mot : la table le cite, l'import le vérifie contre
 *   le seed (par id ET à la ligne indiquée), un paragraphe par bloc séparé d'une ligne vide (`<br><br>`
 *   dans la table). Préfixe « DÉFI XXX : » gardé (aucune transformation, point 6.4 de la table).
 * - Une mission dont la citation diffère du seed, ou dont la ligne indiquée ne porte pas ce défi, est
 *   ÉCARTÉE et signalée, jamais corrigée. Les seeds ne sont que lus.
 * - Une mission dont le défi (cité mot pour mot) porte un tiret cadratin est ÉCARTÉE (règle commune 12 :
 *   zéro tiret cadratin dans le texte client ; corriger serait réécrire le seed) et listée dans `ecartees`
 *   (non bloquant, comme les fiches écartées de l'import) : le fondateur tranche.
 * - Suites : un texte « ça a marché » et un texte « bof » par marche, identiques pour toutes les missions
 *   d'une marche. `parcours` : non fourni (texte neuf à écrire à part), donc absent.
 */
import { readFileSync } from "fs";
import { join } from "path";
import { validerMissions, type Mission } from "../../src/lib/espace/missions";
import { RACINE } from "./md";

export const TABLE_MISSIONS = "docs/espace-client/etiquetage-defis-marches-s24.md";
export const SUITES_MISSIONS = "docs/copy/espace/suites-missions-s24.md";
export const SEEDS_MISSIONS = { conseil: "docs/content/conseils-seed.json", video: "docs/content/videos-seed.json" } as const;
type Source = keyof typeof SEEDS_MISSIONS;

export interface LigneTable {
  id: string;
  source: Source;
  idSeed: number;
  defi: string;
  ligne: number;
  /** 1 à 5, ou null si hors missions. */
  marche: number | null;
}
export interface EcartMission {
  id: string;
  raison: string;
}
export interface ImportMissions {
  missions: Mission[];
  lignes: LigneTable[];
  horsMissions: string[];
  /** Écarts de citation ou de table : bloquants (import refusé). */
  ecarts: EcartMission[];
  /** Missions conformes au seed mais écartées par une règle d'écriture (non bloquant, signalé). */
  ecartees: EcartMission[];
}

const lire = (chemin: string) => readFileSync(join(RACINE, chemin), "utf8");
const cellules = (ligne: string) => ligne.trim().replace(/^\|\s*/, "").replace(/\s*\|$/, "").split(" | ");

/** Lignes de la table (sections 2 et 3) : une par défi, `conseil-<id>` ou `video-<id>`. */
export function lireTable(md = lire(TABLE_MISSIONS)): { lignes: LigneTable[]; ecarts: EcartMission[] } {
  const lignes: LigneTable[] = [];
  const ecarts: EcartMission[] = [];
  let dansTable = false;
  for (const brute of md.split("\n")) {
    if (/^## /.test(brute)) dansTable = /^## [23]\. Table des \d+ défis/.test(brute);
    const m = /^\|\s*(conseil|video)-(\d+)\s*\|/.exec(brute);
    if (!dansTable || !m) continue;
    const c = cellules(brute);
    const id = `${m[1]}-${m[2]}`;
    if (c.length !== 6) {
      ecarts.push({ id, raison: `table : ${c.length} colonnes au lieu de 6` });
      continue;
    }
    const ligne = /^l\. (\d+)$/.exec(c[2]);
    const marche = /^([1-5])$/.exec(c[3]);
    if (!ligne || (!marche && !/^hors missions/.test(c[3]))) {
      ecarts.push({ id, raison: `table : ligne seed « ${c[2]} » ou marche « ${c[3]} » illisible` });
      continue;
    }
    lignes.push({
      id,
      source: m[1] as Source,
      idSeed: Number(m[2]),
      defi: c[1].replace(/<br><br>/g, "\n\n"),
      ligne: Number(ligne[1]),
      marche: marche ? Number(marche[1]) : null,
    });
  }
  return { lignes, ecarts };
}

/** Suites par marche : tableaux « Texte recommandé (A) » des sections 1 (`marche`) et 2 (`bof`). */
export function lireSuites(md = lire(SUITES_MISSIONS)): Map<number, { marche: string; bof: string }> {
  const parSection: Record<"marche" | "bof", Map<number, string>> = { marche: new Map(), bof: new Map() };
  let courante: "marche" | "bof" | null = null;
  for (const brute of md.split("\n")) {
    if (/^## /.test(brute)) courante = /^## 1\./.test(brute) ? "marche" : /^## 2\./.test(brute) ? "bof" : null;
    const m = /^\|\s*([1-5])\s*\|/.exec(brute);
    if (!courante || !m) continue;
    const n = Number(m[1]);
    if (parSection[courante].has(n)) throw new Error(`suites : marche ${n} en double (${courante})`);
    parSection[courante].set(n, cellules(brute)[1].trim());
  }
  const suites = new Map<number, { marche: string; bof: string }>();
  for (let n = 1; n <= 5; n++) {
    const marche = parSection.marche.get(n);
    const bof = parSection.bof.get(n);
    if (!marche || !bof) throw new Error(`suites : texte manquant pour la marche ${n}`);
    suites.set(n, { marche, bof });
  }
  return suites;
}

/** Contrôle d'une citation : identique au champ `exercise` du seed (par id) ET à la ligne indiquée. */
export function controlerCitation(l: LigneTable, seeds: Record<Source, { brut: string; json: { id: number; exercise?: string }[] }>): string | null {
  const seed = seeds[l.source];
  const entree = seed.json.find((e) => e.id === l.idSeed);
  if (!entree || typeof entree.exercise !== "string") return `id ${l.idSeed} absent de ${SEEDS_MISSIONS[l.source]} (ou sans exercise)`;
  if (entree.exercise !== l.defi) return `citation différente du champ exercise du seed (${premiereDifference(l.defi, entree.exercise)})`;
  const brute = seed.brut.split("\n")[l.ligne - 1] ?? "";
  const champ = /^\s*"exercise":\s*("(?:[^"\\]|\\.)*")\s*,?\s*$/.exec(brute);
  if (!champ || JSON.parse(champ[1]) !== l.defi) return `la ligne ${l.ligne} du seed ne porte pas ce défi`;
  return null;
}

function premiereDifference(a: string, b: string): string {
  let i = 0;
  while (i < a.length && a[i] === b[i]) i++;
  return `caractère ${i} : table « ${a.slice(Math.max(0, i - 15), i + 15)} » / seed « ${b.slice(Math.max(0, i - 15), i + 15)} »`;
}

export function lireSeeds() {
  const un = (s: Source) => {
    const brut = lire(SEEDS_MISSIONS[s]);
    return { brut, json: JSON.parse(brut) as { id: number; exercise?: string }[] };
  };
  return { conseil: un("conseil"), video: un("video") };
}

export function construireMissions(): ImportMissions {
  const { lignes, ecarts } = lireTable();
  const suites = lireSuites();
  const seeds = lireSeeds();
  const missions: Mission[] = [];
  const horsMissions: string[] = [];
  const ecartees: EcartMission[] = [];
  for (const l of lignes) {
    const faute = controlerCitation(l, seeds);
    if (faute) {
      ecarts.push({ id: l.id, raison: faute });
      continue;
    }
    if (l.marche === null) {
      horsMissions.push(l.id);
      continue;
    }
    if (l.defi.includes("—")) {
      ecartees.push({ id: l.id, raison: `tiret cadratin dans le défi du seed (marche ${l.marche}), règle commune 12 : non importée, texte non corrigé` });
      continue;
    }
    const s = suites.get(l.marche);
    if (!s) throw new Error(`suites absentes pour la marche ${l.marche}`);
    missions.push({ id: l.id, marche: l.marche as Mission["marche"], enonce: l.defi.split("\n\n"), suites: { marche: s.marche, bof: s.bof } });
  }
  return { missions: validerMissions(missions), lignes, horsMissions, ecarts, ecartees };
}
