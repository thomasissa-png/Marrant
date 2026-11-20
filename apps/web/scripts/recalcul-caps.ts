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
 * Connexions :
 * - par défaut, Prisma en TCP sur DATABASE_URL ; lecture seule, `--appliquer` écrit (usage s24) ;
 * - `--neon` (s26 lancement, port 5432 fermé) : adapter Neon serverless par WebSocket (443).
 *   URL lue dans la variable nommée par `--url-env=NOM` (défaut NEON_DATABASE_URL), jamais écrite ici.
 *   `--a-sec` (défaut) : calcule et affiche ce qui serait écrit, n'écrit rien. `--ecrire` : écrit.
 * Usage (depuis apps/web) :
 *   npx tsx --tsconfig scripts/tsconfig.scripts.json scripts/recalcul-caps.ts [--appliquer]
 *   NODE_USE_ENV_PROXY=1 npx tsx --tsconfig scripts/tsconfig.scripts.json scripts/recalcul-caps.ts --neon [--a-sec|--ecrire] [--url-env=NOM]
 */
import { PrismaClient } from "@prisma/client";
import { recalculerCapsSilencieux, type DbCaps, type DetailRecalcul } from "../src/lib/espace/caps-serveur";

export const VARIABLE_URL_NEON = "NEON_DATABASE_URL";

export interface OptionsRecalcul {
  neon: boolean;
  ecrire: boolean;
  variableUrl: string;
}

/** Client fermable : PrismaClient réel ou double de test (s26 lancement). */
export type ClientRecalcul = DbCaps & { $disconnect: () => Promise<void> };

/** Arguments → options ; toute ambiguïté (option inconnue, `--a-sec` avec `--ecrire`) est refusée. */
export function lireOptions(argv: readonly string[]): OptionsRecalcul | { erreur: string } {
  const neon = argv.includes("--neon");
  const variable = argv.find((a) => a.startsWith("--url-env="));
  const connues = new Set(["--neon", "--a-sec", "--ecrire", "--appliquer"]);
  const inconnue = argv.find((a) => !connues.has(a) && a !== variable);
  if (inconnue) return { erreur: `Option inconnue : ${inconnue}` };
  if (argv.includes("--a-sec") && argv.includes("--ecrire")) return { erreur: "--a-sec et --ecrire sont incompatibles." };
  if (!neon && (argv.includes("--a-sec") || argv.includes("--ecrire") || variable)) {
    return { erreur: "--a-sec, --ecrire et --url-env vont avec --neon (sans --neon : --appliquer)." };
  }
  if (neon && argv.includes("--appliquer")) return { erreur: "Avec --neon, écrire se demande par --ecrire." };
  const variableUrl = variable ? variable.slice("--url-env=".length) : VARIABLE_URL_NEON;
  if (!/^[A-Z_][A-Z0-9_]*$/.test(variableUrl)) return { erreur: `Nom de variable invalide : ${variableUrl}` };
  return { neon, ecrire: neon ? argv.includes("--ecrire") : argv.includes("--appliquer"), variableUrl };
}

/** Hôte seul (jamais l'utilisateur ni le mot de passe), pour vérifier la base visée avant d'écrire. */
export function hoteDe(url: string): string {
  try {
    const u = new URL(url);
    return `${u.hostname}${u.port ? `:${u.port}` : ""}${u.pathname}`;
  } catch {
    return "(URL illisible)";
  }
}

/** `--neon` : PrismaClient sur l'adapter Neon serverless (Pool WebSocket, transactions possibles). */
export async function creerClient(options: OptionsRecalcul, url: string): Promise<ClientRecalcul> {
  if (!options.neon) return new PrismaClient();
  const { PrismaNeon } = await import("@prisma/adapter-neon");
  return new PrismaClient({ adapter: new PrismaNeon({ connectionString: url }) });
}

function ligneDetail(d: DetailRecalcul): string {
  const niveau = d.niveauAvant === d.niveauApres ? `niveau ${d.niveauAvant} inchangé` : `niveau ${d.niveauAvant} -> ${d.niveauApres}`;
  const liste = (type: string) => d.marques.filter((m) => m.type === type).map((m) => m.numero).join(",") || "aucun";
  return `  compte ${d.id} : ${niveau} ; CAP ${liste("CAP")} ; BONUS ${liste("BONUS")}`;
}

/** Point d'entrée testable : renvoie le code de sortie. `fabrique` injectable (tests, base locale). */
export async function executer(
  argv: readonly string[],
  env: NodeJS.ProcessEnv,
  fabrique: (options: OptionsRecalcul, url: string) => Promise<ClientRecalcul> = creerClient,
  sortie: (ligne: string) => void = console.log,
): Promise<number> {
  const options = lireOptions(argv);
  if ("erreur" in options) {
    sortie(options.erreur);
    return 2;
  }
  const url = options.neon ? (env[options.variableUrl] ?? "") : "";
  if (options.neon && !/^postgres(ql)?:\/\//.test(url)) {
    sortie(`${options.variableUrl} absente ou invalide : rien n'est lu.`);
    return 2;
  }
  if (options.neon) sortie(`Base visée (WebSocket Neon) : ${hoteDe(url)}`);
  const client = await fabrique(options, url);
  try {
    const details: DetailRecalcul[] = [];
    const bilan = await recalculerCapsSilencieux(client, options.ecrire, (d) => details.push(d));
    const aSec = options.neon
      ? "À sec : rien n'est écrit (ajouter --ecrire). Ce qui serait écrit :"
      : "Lecture seule : rien n'est écrit (ajouter --appliquer). Ce qui serait écrit :";
    sortie(
      [
        options.ecrire ? "Recalcul appliqué (silencieux). Écrit :" : aSec,
        ...details.map(ligneDetail),
        `comptes abonnés actifs lus : ${bilan.comptes}`,
        `niveaux relevés : ${bilan.niveauxReleves}`,
        options.ecrire
          ? `lignes silencieuses écrites : ${bilan.lignesSilencieuses}`
          : `lignes silencieuses qui seraient écrites : ${bilan.lignesSilencieuses}`,
      ].join("\n"),
    );
    return 0;
  } finally {
    await client.$disconnect();
  }
}

if (require.main === module) {
  executer(process.argv.slice(2), process.env)
    .then((code) => {
      process.exitCode = code;
    })
    .catch((erreur) => {
      console.error(erreur);
      process.exit(1);
    });
}
