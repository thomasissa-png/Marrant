/**
 * Jeu de fixtures dédié aux tests Playwright « @fixtures-espace » (s24, import 2).
 *
 * Les 8 tests écrits pour les fixtures (reprise de la lettre W46, renvoi du bilan, carte
 * `coloc-la-poele.c1` en tête de rafale, missions) gardent LEURS données au lieu d'être recalés sur
 * le vrai contenu. Ce script remplace, dans une copie de travail DÉJÀ basculée (interrupteur ouvert,
 * rétablie par `trap` après le build), les fichiers `apps/web/src/data/espace/*.json` par ce jeu :
 * les fixtures de `apps/web/src/lib/espace/fixtures/` (celles de Jest), rien d'autre (fichiers vides).
 *
 * Jamais servi : refus si l'interrupteur est fermé (copie livrable) ; le test Jest
 * `import-contenu-s24` échoue si un JSON servi diffère de la sortie de l'import.
 * Usage (depuis apps/web) : node ../../playwright/fixtures/espace/installer.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const WEB = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "..", "apps", "web");
const FIXTURES = join(WEB, "src", "lib", "espace", "fixtures");
const DATA = join(WEB, "src", "data", "espace");

/** Fichier servi → fixtures qui le remplissent (dans cet ordre). */
const JEU = {
  situations: ["situation-coloc-la-poele.json", "situation-rencontre-le-retard.json", "situation-reprise-lettre-w46.json"],
  constructions: ["construction-la-regle-de-trois.json"],
  bilans: ["bilan-confiance.json"],
  "humour-noir": ["humour-noir.json"],
  missions: ["missions.json"],
};
const VIDES = ["vocabulaire", "formules", "ecouter", "a-plat", "jeux", "seances", "bonus"];

const interrupteur = readFileSync(join(WEB, "src", "config", "espace-client.ts"), "utf8");
if (!/ESPACE_CLIENT_PUBLIE: boolean = true;/.test(interrupteur)) {
  console.error("Refus : interrupteur fermé. Les fixtures ne s'installent que dans une copie basculée pour le test.");
  process.exit(1);
}
const lire = (f) => JSON.parse(readFileSync(join(FIXTURES, f), "utf8"));
for (const [nom, fichiers] of Object.entries(JEU)) {
  const fiches = fichiers.flatMap((f) => [lire(f)].flat());
  writeFileSync(join(DATA, `${nom}.json`), `${JSON.stringify(fiches, null, 2)}\n`);
}
for (const nom of VIDES) writeFileSync(join(DATA, `${nom}.json`), "[]\n");
console.log(`Fixtures installées : ${Object.keys(JEU).join(", ")} ; vides : ${VIDES.join(", ")}`);
