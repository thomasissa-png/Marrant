/**
 * Tests — lib/startup-tasks.ts (tâches de démarrage idempotentes, s10).
 *
 * Couvre :
 *  - ensureCeoConfigTask : délègue à ensureCeoConfig, fail-safe (ne throw pas).
 *  - cleanupWildcardSocialPostsTask : UPDATE raw idempotent, fail-safe.
 *  - runStartupTasks : enchaîne les deux, ne crashe pas si une échoue.
 */

const mockEnsureCeoConfig = jest.fn();
const mockExecuteRawUnsafe = jest.fn();

jest.mock("@/lib/prisma", () => ({
  prisma: {
    $executeRawUnsafe: (sql: string) => mockExecuteRawUnsafe(sql),
  },
}));

jest.mock("@/lib/ai/ceo-helpers", () => ({
  ensureCeoConfig: () => mockEnsureCeoConfig(),
}));

import { runStartupTasks } from "@/lib/startup-tasks";

beforeEach(() => {
  jest.clearAllMocks();
  mockEnsureCeoConfig.mockResolvedValue({ enabled: false, dryRun: true });
  mockExecuteRawUnsafe.mockResolvedValue(0);
  jest.spyOn(console, "log").mockImplementation(() => undefined);
  jest.spyOn(console, "error").mockImplementation(() => undefined);
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe("runStartupTasks", () => {
  it("auto-seed CeoConfig et lance le cleanup WILD_CARD", async () => {
    await runStartupTasks();
    expect(mockEnsureCeoConfig).toHaveBeenCalledTimes(1);
    expect(mockExecuteRawUnsafe).toHaveBeenCalledTimes(1);
    const sql = mockExecuteRawUnsafe.mock.calls[0][0] as string;
    expect(sql).toContain("UPDATE \"SocialPost\"");
    expect(sql).toContain("'REJECTED'");
    expect(sql).toContain("\"format\"::text = 'WILD_CARD'");
  });

  it("cleanup idempotent : 0 ligne affectée ne lève aucune erreur", async () => {
    mockExecuteRawUnsafe.mockResolvedValueOnce(0);
    await expect(runStartupTasks()).resolves.toBeUndefined();
  });

  it("fail-safe : une erreur ensureCeoConfig ne bloque pas le cleanup", async () => {
    mockEnsureCeoConfig.mockRejectedValueOnce(new Error("DB froide"));
    await runStartupTasks();
    // Le cleanup doit quand même tourner malgré l'échec du seed.
    expect(mockExecuteRawUnsafe).toHaveBeenCalledTimes(1);
  });

  it("fail-safe : une erreur cleanup ne fait pas crasher runStartupTasks", async () => {
    mockExecuteRawUnsafe.mockRejectedValueOnce(new Error("enum invalide"));
    await expect(runStartupTasks()).resolves.toBeUndefined();
  });
});
