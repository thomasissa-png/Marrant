/**
 * Lecture SEULE (s24, espace client, lot D3 ; brief 7.5 f, architecture 4.4) : nombre de vannes
 * tirables par catégorie du toucher « Ce soir, c'est plutôt ? » (actives, hors humour noir), dont
 * celles déjà servies au contenu du jour. Sert à FIXER `SEUIL_TOUCHER` (`src/lib/espace/vanne.ts`) :
 * aucun chiffre n'est supposé avant cette lecture en base de production (@data-analyst, @fullstack).
 * N'écrit rien. Aucune donnée personnelle lue.
 *
 * Usage (depuis apps/web, base visée dans DATABASE_URL) :
 *   npx tsx --tsconfig scripts/tsconfig.scripts.json scripts/lecture-vannes-categories.ts
 */
import { PrismaClient } from "@prisma/client";
import { CATEGORIES_TOUCHER, CATEGORIE_EN_BASE } from "../src/lib/espace/vanne";

async function main() {
  const prisma = new PrismaClient();
  try {
    const lignes: string[] = ["catégorie ; en base ; tirables (actives, hors humour noir) ; dont déjà servies au contenu du jour"];
    for (const c of CATEGORIES_TOUCHER) {
      const category = CATEGORIE_EN_BASE[c];
      const where = { category, isActive: true, humourNoir: false };
      const [tirables, servies] = await Promise.all([
        prisma.joke.count({ where }),
        prisma.joke.count({ where: { ...where, dailyContents: { some: {} } } }),
      ]);
      lignes.push(`${c} ; ${category} ; ${tirables} ; ${servies}`);
    }
    console.log(lignes.join("\n"));
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((erreur) => {
  console.error(erreur);
  process.exit(1);
});
