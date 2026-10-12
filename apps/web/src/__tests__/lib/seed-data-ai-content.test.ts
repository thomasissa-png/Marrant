/**
 * @jest-environment node
 *
 * Relecture de code s11 — le seed (joué à chaque build Replit) ne doit JAMAIS
 * désactiver un contenu généré par l'IA. Les vannes et conseils étaient déjà
 * protégés (`generatedByAI: false`) ; les vidéos ne l'étaient pas : toute
 * vidéo découverte par le cron monthly-videos (absente du seed) était
 * désactivée à chaque déploiement.
 *
 * Le seed s'exécute à l'import : on remplace PrismaClient par un double qui
 * enregistre chaque appel, sur les vrais fichiers docs/content.
 */
type Call = { model: string; method: string; args: unknown };
const calls: Call[] = [];
/** s20 : garde-fou du seed. Base vierge par défaut (0 utilisateur, 0 DataPatch). */
const guardCounts: Record<string, number> = { user: 0, dataPatch: 0 };

jest.mock("@prisma/client", () => {
  const handler = (model: string) =>
    new Proxy(
      {},
      {
        get: (_t, method: string) => async (args: unknown) => {
          calls.push({ model, method, args });
          if (method === "count") {
            if (model in guardCounts) return guardCounts[model];
            return model === "dailyContent" ? 1 : 10;
          }
          if (method === "findMany") return [];
          if (method === "updateMany" || method === "deleteMany" || method === "createMany") return { count: 0 };
          return { id: `${model}-id` };
        },
      },
    );
  class PrismaClient {
    constructor() {
      return new Proxy(this, {
        get: (_t, prop: string) => (prop === "$disconnect" ? async () => undefined : handler(prop)),
      });
    }
  }
  return { PrismaClient };
});

async function flush() {
  for (let i = 0; i < 50; i++) await new Promise((r) => setImmediate(r));
}

describe("seed-data — contenus IA jamais désactivés", () => {
  const prevEnv = process.env.NODE_ENV;
  beforeAll(async () => {
    Object.assign(process.env, { NODE_ENV: "test" });
    jest.isolateModules(() => {
      require("../../../prisma/seed-data");
    });
    await flush();
  });
  afterAll(() => {
    Object.assign(process.env, { NODE_ENV: prevEnv });
  });

  it("toute désactivation (isActive=false) par critère de contenu exclut generatedByAI=true", () => {
    const deactivations = calls.filter(
      (c) =>
        c.method === "updateMany" &&
        ["joke", "tip", "video"].includes(c.model) &&
        (c.args as { data?: { isActive?: boolean } }).data?.isActive === false,
    );
    expect(deactivations.map((c) => c.model)).toContain("video");
    for (const c of deactivations) {
      const where = (c.args as { where: Record<string, unknown> }).where;
      // Soit un filtre par ids issus d'une requête generatedByAI=false, soit le filtre direct.
      if ("id" in where) continue;
      expect(where.generatedByAI).toBe(false);
    }
  });

  it("les requêtes de sélection des vannes/conseils à désactiver filtrent generatedByAI=false", () => {
    const selects = calls.filter(
      (c) =>
        c.method === "findMany" &&
        ["joke", "tip"].includes(c.model) &&
        (c.args as { where?: { isActive?: boolean } }).where?.isActive === true &&
        ("content" in ((c.args as { where: object }).where) || "title" in ((c.args as { where: object }).where)),
    );
    expect(selects.length).toBe(2);
    for (const c of selects) {
      expect((c.args as { where: { generatedByAI?: boolean } }).where.generatedByAI).toBe(false);
    }
  });
});

describe("seed-data — garde-fou s20 (base non vierge)", () => {
  const prevEnv = process.env.NODE_ENV;
  const prevConfirm = process.env.MARRANT_SEED_CONFIRM_HOST;
  let exitSpy: jest.SpyInstance;
  beforeAll(async () => {
    calls.length = 0;
    Object.assign(guardCounts, { user: 3, dataPatch: 40 });
    Object.assign(process.env, { NODE_ENV: "test" });
    delete process.env.MARRANT_SEED_CONFIRM_HOST;
    exitSpy = jest.spyOn(process, "exit").mockImplementation((() => undefined) as never);
    jest.spyOn(console, "error").mockImplementation(() => undefined);
    jest.isolateModules(() => {
      require("../../../prisma/seed-data");
    });
    await flush();
  });
  afterAll(() => {
    Object.assign(process.env, { NODE_ENV: prevEnv });
    if (prevConfirm !== undefined) process.env.MARRANT_SEED_CONFIRM_HOST = prevConfirm;
    Object.assign(guardCounts, { user: 0, dataPatch: 0 });
    jest.restoreAllMocks();
  });

  it("refus : sortie en erreur et aucune écriture", () => {
    expect(exitSpy).toHaveBeenCalledWith(1);
    const writes = calls.filter((c) =>
      ["create", "createMany", "update", "updateMany", "upsert", "delete", "deleteMany"].includes(c.method),
    );
    expect(writes).toEqual([]);
  });
});
