/**
 * @jest-environment node
 *
 * s26 lancement (runbook, bloquant `recalcul-caps.ts` en Prisma TCP, port 5432 fermé) : option `--neon` (adapter
 * Neon serverless par WebSocket), `--a-sec` par défaut (n'écrit rien), `--ecrire` explicite. URL lue dans une
 * variable nommée, jamais écrite dans le code ni affichée (hôte seul). Client injecté : aucune base, aucun réseau.
 * Essai réel du même chemin (fabrique par défaut, WebSocket) : base locale jetable, relais WebSocket local (rapport).
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";

const espionNeon = jest.fn();
jest.mock("@prisma/adapter-neon", () => {
  const vrai = jest.requireActual("@prisma/adapter-neon");
  class PrismaNeonEspion extends vrai.PrismaNeon {
    constructor(config: unknown, options?: unknown) {
      super(config, options);
      espionNeon(config);
    }
  }
  return { ...vrai, PrismaNeon: PrismaNeonEspion };
});

import { creerClient, executer, hoteDe, lireOptions, type ClientRecalcul } from "../../../scripts/recalcul-caps";

const URL_FACTICE = "postgresql://role:motdepasse-factice@ep-factice.eu-central-1.aws.neon.tech/neondb?sslmode=require";

function base() {
  const db = {
    user: {
      findMany: jest.fn(async () => [
        { id: "a", xp: 412, level: "NOVICE", plan: "PREMIUM" },
        { id: "f", xp: 900, level: "NOVICE", plan: "FREE" },
      ]),
      update: jest.fn(async () => ({})),
    },
    userPathStepCompletion: { findMany: jest.fn(async () => []) },
    userPathProgress: { findMany: jest.fn(async () => []) },
    capAnnonce: {
      findMany: jest.fn(async () => [{ type: "CAP", numero: 2 }]),
      createMany: jest.fn(async (a: { data: unknown[] }) => ({ count: a.data.length })),
    },
    $disconnect: jest.fn(async () => undefined),
  };
  return { db, fabrique: jest.fn(async () => db as unknown as ClientRecalcul) };
}

const lancer = async (argv: string[], env: Record<string, string> = { NEON_DATABASE_URL: URL_FACTICE }) => {
  const { db, fabrique } = base();
  const lignes: string[] = [];
  const code = await executer(argv, env as NodeJS.ProcessEnv, fabrique, (l) => lignes.push(l));
  return { db, fabrique, code, sortie: lignes.join("\n") };
};

describe("s26 lancement : options de recalcul-caps", () => {
  it("--neon seul = à sec ; --ecrire écrit ; sans --neon, l'usage s24 (--appliquer) est inchangé", () => {
    expect(lireOptions(["--neon"])).toEqual({ neon: true, ecrire: false, variableUrl: "NEON_DATABASE_URL" });
    expect(lireOptions(["--neon", "--a-sec"])).toMatchObject({ ecrire: false });
    expect(lireOptions(["--neon", "--ecrire", "--url-env=URL_PREVERSION"])).toEqual({ neon: true, ecrire: true, variableUrl: "URL_PREVERSION" });
    expect(lireOptions([])).toMatchObject({ neon: false, ecrire: false });
    expect(lireOptions(["--appliquer"])).toMatchObject({ neon: false, ecrire: true });
  });

  it("refuse toute ambiguïté : option inconnue, --a-sec avec --ecrire, --appliquer avec --neon, nom de variable invalide", () => {
    for (const argv of [["--neon", "--ecrir"], ["--neon", "--a-sec", "--ecrire"], ["--neon", "--appliquer"], ["--ecrire"], ["--neon", "--url-env=a b"]]) {
      expect(lireOptions(argv)).toHaveProperty("erreur");
    }
  });
});

describe("s26 lancement : exécution avec client injecté", () => {
  it("à sec par défaut : n'écrit rien, affiche ce qui serait écrit, lignes déjà présentes exclues", async () => {
    const { db, code, sortie, fabrique } = await lancer(["--neon"]);
    expect(code).toBe(0);
    expect(fabrique).toHaveBeenCalledWith({ neon: true, ecrire: false, variableUrl: "NEON_DATABASE_URL" }, URL_FACTICE);
    expect(db.user.update).not.toHaveBeenCalled();
    expect(db.capAnnonce.createMany).not.toHaveBeenCalled();
    expect(sortie).toContain("À sec : rien n'est écrit (ajouter --ecrire)");
    expect(sortie).toContain("compte a : niveau NOVICE -> FARCEUR ; CAP 3 ; BONUS aucun");
    expect(sortie).toContain("lignes silencieuses qui seraient écrites : 1");
    expect(sortie).not.toContain("compte f");
    expect(db.$disconnect).toHaveBeenCalled();
  });

  it("--ecrire : relève le niveau et écrit les lignes silencieuses (doublons ignorés en base)", async () => {
    const { db, code, sortie } = await lancer(["--neon", "--ecrire"]);
    expect(code).toBe(0);
    expect(db.user.update).toHaveBeenCalledWith({ where: { id: "a" }, data: { level: "FARCEUR" } });
    expect(db.capAnnonce.createMany).toHaveBeenCalledWith(expect.objectContaining({ skipDuplicates: true }));
    expect(sortie).toContain("Recalcul appliqué (silencieux).");
  });

  it("URL absente ou non Postgres : code 2, aucun client créé ; l'URL n'est jamais affichée (hôte seul)", async () => {
    const envs: Record<string, string>[] = [{}, { NEON_DATABASE_URL: "https://exemple.invalid" }];
    for (const env of envs) {
      const r = await lancer(["--neon"], env);
      expect(r.code).toBe(2);
      expect(r.fabrique).not.toHaveBeenCalled();
    }
    const { sortie } = await lancer(["--neon", "--url-env=AUTRE"], { AUTRE: URL_FACTICE });
    expect(sortie).toContain("Base visée (WebSocket Neon) : ep-factice.eu-central-1.aws.neon.tech/neondb");
    expect(sortie).not.toContain("motdepasse-factice");
    expect(hoteDe("pas une url")).toBe("(URL illisible)");
  });
});

describe("s26 lancement : client --neon", () => {
  it("PrismaClient sur l'adapter PrismaNeon (Pool WebSocket), URL passée telle quelle ; aucune connexion à la création", async () => {
    const client = await creerClient({ neon: true, ecrire: false, variableUrl: "NEON_DATABASE_URL" }, URL_FACTICE);
    expect(espionNeon).toHaveBeenCalledWith({ connectionString: URL_FACTICE });
    await client.$disconnect();
  });

  it("aucune URL ni nom de base écrit dans le script", () => {
    const src = readFileSync(join(__dirname, "../../../scripts/recalcul-caps.ts"), "utf8");
    expect(src).not.toMatch(/postgres(ql)?:\/\/[^"`\s]*@/);
    expect(src).not.toMatch(/neon\.tech/);
  });
});
