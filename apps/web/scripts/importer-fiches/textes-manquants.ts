/**
 * Textes manquants de l'import 2 (s24), validés à 10 à l'aveugle (tours 2 et 3, clôture du 13/11) :
 * `docs/copy/espace/textes-manquants-import2-s24.md`, reco = candidate en **gras**.
 *
 * - Section 1 : le geste « À toi » de chaque séance (affiché sans « À toi : », l'écran le pose), lu par
 *   numéro de séance (« Séance N » du lot C6c). Remplace le repli `GESTE_SEANCE` de l'import 2.
 * - Section 2 : libellé de la réponse des jeux « Les pires réponses » (jeux 1, 2, 4 : la reco ; jeu 3 :
 *   son propre libellé). Posé par l'écran (`config/textes/espace-bibliotheque.ts`) ; lu ici pour le test.
 * - Section 3 : message de la cloche qui ne charge pas (`config/textes/espace-cloche.ts`) ; idem.
 * Aucune réécriture : texte en gras tel qu'écrit, sans les ** ; une reco absente ou double = erreur.
 */
import { join } from "path";
import { readFileSync } from "fs";
import { RACINE } from "./md";

export const TEXTES_MANQUANTS = "docs/copy/espace/textes-manquants-import2-s24.md";

const lire = () => readFileSync(join(RACINE, TEXTES_MANQUANTS), "utf8");

function section(md: string, n: number): string {
  const morceau = md.split(new RegExp(`^## ${n}\\. `, "m"))[1];
  if (!morceau) throw new Error(`textes manquants : section ${n} absente`);
  return morceau.split(/^## /m)[0];
}

function seulGras(texte: string, ou: string): string {
  const gras = [...texte.matchAll(/\*\*([^*]+)\*\*/g)].map((m) => m[1].trim());
  if (gras.length !== 1) throw new Error(`textes manquants : ${gras.length} recos en gras pour ${ou}, 1 attendue`);
  return gras[0];
}

/** Geste « À toi » par numéro de séance (1 à 6). */
export function gestesSeances(md = lire()): Map<number, string> {
  const gestes = new Map<number, string>();
  for (const ligne of section(md, 1).split("\n")) {
    const m = /^\|\s*(\d+)\.\s[^|]+\|(.+)\|\s*$/.exec(ligne);
    if (m) gestes.set(Number(m[1]), seulGras(m[2], `la séance ${m[1]}`));
  }
  if (gestes.size !== 6) throw new Error(`textes manquants : ${gestes.size} gestes de séance, 6 attendus`);
  return gestes;
}

/** Libellé de la réponse des « Pires réponses » : celui des jeux 1, 2, 4 et celui du jeu 3. */
export function libellesPiresReponses(md = lire()): { defaut: string; jeu3: string } {
  const s = section(md, 2);
  const defaut = seulGras(s.split("\n").find((l) => /^- A /.test(l)) ?? "", "le libellé des jeux");
  const jeu3 = /Jeu 3 \([^)]*\) : « ([^»]+) »/.exec(s)?.[1].trim();
  if (!jeu3) throw new Error("textes manquants : libellé du jeu 3 absent");
  return { defaut, jeu3 };
}

/** Message de la cloche qui ne charge pas. */
export function erreurCloche(md = lire()): string {
  return seulGras(section(md, 3), "la cloche");
}
