/**
 * Recalcul UNIQUE des caps (s24, espace client, lot D4 ; niveaux-xp-s24.md 3.0, 5.4, 2.6).
 * À lancer UNE fois à l'ouverture de l'espace, par @infrastructure, APRÈS : correction de la route
 * d'XP (porte G3), vérification 2.6, remise à niveau des 3 comptes de test de Thomas (Q6, porte G4).
 *
 * - Comptes traités : ABONNÉS ACTIFS seulement (plan PREMIUM en base ; lot D10b, minimisation : la
 *   politique de confidentialité dit « si tu es abonné »). Un compte non abonné n'est ni lu ni écrit.
 * - `User.level` relevé aux nouveaux seuils (0, 100, 300, 700, 2 300), jamais abaissé.
 * - Chaque cap atteint et chaque bonus gagné (étapes et bonus de fin) marqué dans `CapAnnonce` avec
 *   `silencieux = true` : aucune phrase de passage, aucun événement « cap atteint ».
 * - Rejouable : une 2e passe n'écrit rien (doublons ignorés, niveaux déjà relevés).
 *
 * Par défaut : LECTURE SEULE (bilan). `--appliquer` : écrit.
 * Usage (depuis apps/web, base visée dans DATABASE_URL) :
 *   npx tsx --tsconfig scripts/tsconfig.scripts.json scripts/recalcul-caps.ts [--appliquer]
 */
import { PrismaClient } from "@prisma/client";
import { recalculerCapsSilencieux } from "../src/lib/espace/caps-serveur";

async function main() {
  const appliquer = process.argv.includes("--appliquer");
  const prisma = new PrismaClient();
  try {
    const bilan = await recalculerCapsSilencieux(prisma, appliquer);
    console.log(
      [
        appliquer ? "Recalcul appliqué (silencieux)." : "Lecture seule : rien n'est écrit (ajouter --appliquer).",
        `comptes abonnés actifs lus : ${bilan.comptes}`,
        `niveaux relevés : ${bilan.niveauxReleves}`,
        appliquer
          ? `lignes silencieuses écrites : ${bilan.lignesSilencieuses}`
          : `lignes silencieuses candidates (celles déjà présentes seront ignorées) : ${bilan.lignesSilencieuses}`,
      ].join("\n"),
    );
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((erreur) => {
  console.error(erreur);
  process.exit(1);
});
