/**
 * Import du contenu validé de l'espace client (s24, plan `docs/espace-client/plan-developpement-s24.md`
 * §3 lot D1 et §5) : Markdown de `docs/copy/espace/` vers `src/data/espace/*.json`.
 *
 * - Jamais de JSON écrit à la main : ce script est la seule voie d'entrée du contenu (le test
 *   `src/__tests__/espace/import-contenu-s24.test.ts` échoue si un JSON diffère de la sortie de l'import).
 * - Aucune réécriture : une fiche dont le texte ne tient pas dans le schéma est ÉCARTÉE et signalée.
 * - Chaque fiche est validée par `fiches-schema.ts` (fiche par fiche, puis fichier par fichier).
 * - Répliques reprises (jeux « Quelle réplique ? », « Choisis la chute », bilans) vérifiées mot pour mot.
 * - Hors import : Écouter (E4 en attente de réécoute, G7), bonus (passages à choisir), vannes du coin.
 *
 * Usage (depuis apps/web) :
 *   npx tsx --tsconfig scripts/tsconfig.scripts.json scripts/importer-fiches.ts          (bilan seul)
 *   npx tsx --tsconfig scripts/tsconfig.scripts.json scripts/importer-fiches.ts --ecrire (écrit les JSON)
 * Code de sortie 1 si une réplique reprise ne correspond pas à sa source.
 */
import { writeFileSync } from "fs";
import { join } from "path";
import { construireImport, enJson } from "./importer-fiches/construire";

const DATA = join(__dirname, "..", "src", "data", "espace");

function main() {
  const ecrire = process.argv.includes("--ecrire");
  const { parFichier, refus, controles } = construireImport();
  const fautes = controles.filter((c) => !c.ok);
  const total = [...parFichier.values()].reduce((s, l) => s + l.length, 0);

  console.log("Fiches importées par fichier :");
  for (const [nom, liste] of parFichier) console.log(`  ${nom.padEnd(14)} ${liste.length}`);
  console.log(`  total          ${total}`);
  console.log(`\nÉcartées (${refus.length}) :`);
  for (const r of refus) console.log(`  [${r.type}] ${r.ref} : ${r.raison}`);
  console.log(`\nRépliques reprises vérifiées : ${controles.length - fautes.length}/${controles.length} identiques à leur source`);
  for (const c of controles.filter((x) => x.note)) console.log(`  note ${c.ou} : ${c.note}`);
  for (const c of fautes) console.log(`  ÉCART ${c.ou} : « ${c.replique} »`);

  if (fautes.length) {
    console.error("\nImport refusé : une réplique reprise ne correspond pas à sa source.");
    process.exit(1);
  }
  if (!ecrire) return console.log("\nBilan seul (aucun fichier écrit). Ajouter --ecrire pour écrire les JSON.");
  for (const [nom, liste] of parFichier) writeFileSync(join(DATA, `${nom}.json`), enJson(liste), "utf8");
  console.log(`\nÉcrit : ${[...parFichier.keys()].map((n) => `${n}.json`).join(", ")}`);
}

main();
