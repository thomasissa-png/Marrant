/**
 * Tests — lib/startup-tasks.ts (tâches de démarrage idempotentes, s10).
 *
 * Couvre :
 *  - ensureCeoConfigTask : délègue à ensureCeoConfig, fail-safe (ne throw pas).
 *  - cleanupWildcardSocialPostsTask : UPDATE raw idempotent, fail-safe.
 *  - applyJokeDecryptagesTask : applique les décryptages pré-rédigés depuis le
 *    fichier bundlé (SANS IA), idempotent (skip les déjà remplis), gère les
 *    vannes absentes du fichier, ne bloque pas le boot si la DB échoue.
 *  - runStartupTasks : enchaîne les trois, ne crashe pas si une échoue.
 */

const mockEnsureCeoConfig = jest.fn();
const mockExecuteRawUnsafe = jest.fn();
const mockJokeFindMany = jest.fn();
const mockJokeUpdate = jest.fn();
const mockJokeUpdateMany = jest.fn();

jest.mock("@/lib/prisma", () => ({
  prisma: {
    $executeRawUnsafe: (sql: string) => mockExecuteRawUnsafe(sql),
    joke: {
      findMany: (...args: unknown[]) => mockJokeFindMany(...args),
      update: (...args: unknown[]) => mockJokeUpdate(...args),
      updateMany: (...args: unknown[]) => mockJokeUpdateMany(...args),
    },
  },
}));

jest.mock("@/lib/ai/ceo-helpers", () => ({
  ensureCeoConfig: () => mockEnsureCeoConfig(),
}));

import {
  runStartupTasks,
  applyJokeDecryptagesTask,
  deactivateWeakJokesTask,
} from "@/lib/startup-tasks";
import jokeDecryptages from "@/data/joke-decryptages.json";
import weakJokes from "@/data/weak-jokes.json";

const fileEntry = (jokeDecryptages as Array<{ content: string; comedyTechnique: string }>)[0];
const weakContents = weakJokes as string[];

beforeEach(() => {
  jest.clearAllMocks();
  mockEnsureCeoConfig.mockResolvedValue({ enabled: false, dryRun: true });
  mockExecuteRawUnsafe.mockResolvedValue(0);
  mockJokeFindMany.mockResolvedValue([]);
  mockJokeUpdate.mockResolvedValue({});
  mockJokeUpdateMany.mockResolvedValue({ count: 0 });
  jest.spyOn(console, "log").mockImplementation(() => undefined);
  jest.spyOn(console, "error").mockImplementation(() => undefined);
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe("runStartupTasks", () => {
  it("auto-seed CeoConfig, cleanup WILD_CARD et applique les décryptages", async () => {
    await runStartupTasks();
    expect(mockEnsureCeoConfig).toHaveBeenCalledTimes(1);
    expect(mockExecuteRawUnsafe).toHaveBeenCalledTimes(1);
    const sql = mockExecuteRawUnsafe.mock.calls[0][0] as string;
    expect(sql).toContain("UPDATE \"SocialPost\"");
    expect(sql).toContain("'REJECTED'");
    expect(sql).toContain("\"format\"::text = 'WILD_CARD'");
    // applyJokeDecryptagesTask a interrogé les vannes non décryptées.
    expect(mockJokeFindMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { comedyTechnique: null } }),
    );
    // deactivateWeakJokesTask a désactivé les vannes faibles (soft delete).
    expect(mockJokeUpdateMany).toHaveBeenCalledTimes(1);
  });

  it("cleanup idempotent : 0 ligne affectée ne lève aucune erreur", async () => {
    mockExecuteRawUnsafe.mockResolvedValueOnce(0);
    await expect(runStartupTasks()).resolves.toBeUndefined();
  });

  it("fail-safe : une erreur ensureCeoConfig ne bloque pas le cleanup", async () => {
    mockEnsureCeoConfig.mockRejectedValueOnce(new Error("DB froide"));
    await runStartupTasks();
    expect(mockExecuteRawUnsafe).toHaveBeenCalledTimes(1);
  });

  it("fail-safe : une erreur cleanup ne fait pas crasher runStartupTasks", async () => {
    mockExecuteRawUnsafe.mockRejectedValueOnce(new Error("enum invalide"));
    await expect(runStartupTasks()).resolves.toBeUndefined();
  });
});

describe("applyJokeDecryptagesTask", () => {
  it("applique les 3 champs depuis le fichier pour une vanne null (sans IA)", async () => {
    mockJokeFindMany.mockResolvedValue([{ id: "cuid-1", content: fileEntry.content }]);

    await applyJokeDecryptagesTask();

    expect(mockJokeUpdate).toHaveBeenCalledWith({
      where: { id: "cuid-1" },
      data: {
        comedyTechnique: fileEntry.comedyTechnique,
        techniqueExplanation: expect.any(String),
        howToApply: expect.any(String),
      },
    });
  });

  it("idempotent : ne lit que les vannes comedyTechnique null", async () => {
    mockJokeFindMany.mockResolvedValue([]);
    await applyJokeDecryptagesTask();

    expect(mockJokeFindMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { comedyTechnique: null } }),
    );
    // Aucune vanne à traiter → aucun update.
    expect(mockJokeUpdate).not.toHaveBeenCalled();
  });

  it("gère une vanne absente du fichier : skip sans crash ni update", async () => {
    mockJokeFindMany.mockResolvedValue([
      { id: "cuid-orphan", content: "Vanne IA qui n'est pas dans le fichier pré-rédigé." },
    ]);

    await expect(applyJokeDecryptagesTask()).resolves.toBeUndefined();
    expect(mockJokeUpdate).not.toHaveBeenCalled();
  });

  it("traite un mix : applique les vannes du fichier, ignore les orphelines", async () => {
    mockJokeFindMany.mockResolvedValue([
      { id: "cuid-1", content: fileEntry.content },
      { id: "cuid-orphan", content: "Vanne hors fichier." },
    ]);

    await applyJokeDecryptagesTask();

    expect(mockJokeUpdate).toHaveBeenCalledTimes(1);
    expect(mockJokeUpdate).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: "cuid-1" } }),
    );
  });

  it("fail-safe : une erreur DB (findMany) ne fait pas crasher le boot", async () => {
    // Erreur non-connexion → re-throw immédiat par withDbRetry (pas de backoff),
    // capturé par le try/catch global de la tâche.
    mockJokeFindMany.mockRejectedValue(new Error("relation \"Joke\" does not exist"));
    await expect(applyJokeDecryptagesTask()).resolves.toBeUndefined();
  });

  it("fail-safe : une erreur DB (update) ne fait pas crasher le boot", async () => {
    mockJokeFindMany.mockResolvedValue([{ id: "cuid-1", content: fileEntry.content }]);
    mockJokeUpdate.mockRejectedValue(new Error("write conflict"));
    await expect(applyJokeDecryptagesTask()).resolves.toBeUndefined();
  });
});

describe("deactivateWeakJokesTask", () => {
  it("soft delete : cible les 24 contents faibles encore actifs (isActive false)", async () => {
    mockJokeUpdateMany.mockResolvedValue({ count: 24 });

    await deactivateWeakJokesTask();

    expect(mockJokeUpdateMany).toHaveBeenCalledTimes(1);
    expect(mockJokeUpdateMany).toHaveBeenCalledWith({
      where: { content: { in: weakContents }, isActive: true },
      data: { isActive: false },
    });
  });

  it("match par content : utilise exactement la liste weak-jokes.json (24 entrées)", async () => {
    await deactivateWeakJokesTask();

    const arg = mockJokeUpdateMany.mock.calls[0][0] as {
      where: { content: { in: string[] } };
    };
    expect(arg.where.content.in).toHaveLength(24);
    // Source unique : pas de hardcode, on passe bien le fichier bundlé.
    expect(arg.where.content.in).toEqual(weakContents);
  });

  it("jamais de hard delete : seul isActive passe à false", async () => {
    await deactivateWeakJokesTask();

    const arg = mockJokeUpdateMany.mock.calls[0][0] as { data: Record<string, unknown> };
    expect(arg.data).toEqual({ isActive: false });
  });

  it("idempotent : 2e run sans vanne active matchée = 0 update (count 0)", async () => {
    mockJokeUpdateMany.mockResolvedValueOnce({ count: 24 });
    mockJokeUpdateMany.mockResolvedValueOnce({ count: 0 });

    await deactivateWeakJokesTask(); // 1re passe : 24 désactivées
    await deactivateWeakJokesTask(); // 2e passe : WHERE isActive:true ne matche plus rien

    expect(mockJokeUpdateMany).toHaveBeenCalledTimes(2);
    // La 2e passe renvoie count 0 — aucune erreur, idempotence garantie par le WHERE.
    expect(mockJokeUpdateMany.mock.results[1].value).resolves.toEqual({ count: 0 });
  });

  it("non bloquant : une erreur DB ne fait pas crasher le boot", async () => {
    mockJokeUpdateMany.mockRejectedValue(new Error("relation \"Joke\" does not exist"));
    await expect(deactivateWeakJokesTask()).resolves.toBeUndefined();
  });
});
