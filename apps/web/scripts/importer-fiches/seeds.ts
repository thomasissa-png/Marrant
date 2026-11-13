/**
 * Import 2 (s24) : étape d'un quiz cité par le lot C6b (« (quiz S l.57) »), lue sur les lignes du seed.
 * La ligne doit tomber dans le tableau `quiz` d'une étape du parcours du bilan ; sinon la fiche est écartée.
 */
import { readFileSync } from "fs";
import { join } from "path";
import { Ecart, RACINE } from "./md";

const SEEDS: Record<string, string> = {
  S: "docs/content/parcours-seed.json",
  ST: "docs/content/parcours-storytelling-s18.json",
  BO: "docs/content/parcours-boulot-s19.json",
};

export function etapeDuQuiz(seed: string, ligne: number, parcours: string): number {
  const fichier = SEEDS[seed];
  if (!fichier) throw new Ecart(`seed inconnu : ${seed}`);
  const lignes = readFileSync(join(RACINE, fichier), "utf8").split("\n").slice(0, ligne);
  let slug = "";
  let week: number | null = null;
  let dansQuiz = false;
  for (const l of lignes) {
    const s = /^\s*"slug":\s*"([^"]+)"/.exec(l);
    if (s) slug = s[1];
    const w = /^\s*"week":\s*(\d+)/.exec(l);
    if (w) {
      week = Number(w[1]);
      dansQuiz = false;
    }
    if (/^\s*"quiz":\s*\[/.test(l)) dansQuiz = true;
  }
  if (slug !== parcours || week === null || !dansQuiz) throw new Ecart(`quiz ${seed} l.${ligne} hors des quiz du parcours ${parcours}`);
  return week;
}
