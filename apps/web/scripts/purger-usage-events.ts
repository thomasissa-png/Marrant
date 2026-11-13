/**
 * Purge de la mesure d'usage rattachée au compte (`UsageEvent`) au-delà de la durée de conservation
 * (s24, lot D10 ; `src/lib/mesure/conservation-usage.ts`, `DUREE_CONSERVATION_USAGE_MOIS`,
 * [HYPOTHÈSE : 13 mois] à fixer par Thomas). Programmée nulle part tant que la durée n'est pas fixée.
 *
 * Par défaut : LECTURE SEULE (nombre d'événements concernés). `--ecrire` : efface.
 * Usage (depuis apps/web, base visée dans DATABASE_URL) :
 *   npx tsx --tsconfig scripts/tsconfig.scripts.json scripts/purger-usage-events.ts [--ecrire]
 */
import { PrismaClient } from "@prisma/client";
import { DUREE_CONSERVATION_USAGE_MOIS, limiteConservation, purgerUsageEvents } from "../src/lib/mesure/conservation-usage";

async function main() {
  const ecrire = process.argv.includes("--ecrire");
  const prisma = new PrismaClient();
  try {
    const n = await purgerUsageEvents(prisma, { ecrire });
    const limite = limiteConservation().toISOString().slice(0, 10);
    console.log(
      ecrire
        ? `Purge faite : ${n} événement(s) antérieur(s) au ${limite} effacé(s) (durée ${DUREE_CONSERVATION_USAGE_MOIS} mois).`
        : `Lecture seule : ${n} événement(s) antérieur(s) au ${limite} seraient effacés (ajouter --ecrire).`,
    );
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((erreur) => {
  console.error(erreur instanceof Error ? erreur.name : "erreur");
  process.exit(1);
});
