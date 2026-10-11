/**
 * Tests du helper de retry Neon cold start (P1 ouvert s8 → résolu s10).
 *
 * Cible : `apps/web/src/lib/db-retry.ts`.
 * Vérifie :
 *  - succès au 1er essai (pas de retry, pas d'attente)
 *  - retry sur P1001 puis succès (2e, 3e essai)
 *  - re-throw après maxAttempts épuisées
 *  - re-throw IMMÉDIAT sur erreur non-connexion (P2002, validation)
 *  - backoff exponentiel respecté (timers mockés)
 *  - détection des messages réseau (ECONNREFUSED, etc.)
 *
 * Pattern timers : `jest.useFakeTimers()` + on avance les timers manuellement
 * entre les rejets pour ne pas attendre réellement.
 */
import { withDbRetry, isConnectionError } from "@/lib/db-retry";

/** Construit une erreur Prisma-like avec un code. */
function prismaError(code: string, message = "prisma error"): Error & { code: string } {
  const err = new Error(message) as Error & { code: string };
  err.code = code;
  return err;
}

describe("isConnectionError", () => {
  it("détecte le code Prisma P1001", () => {
    expect(isConnectionError(prismaError("P1001", "Can't reach database server"))).toBe(true);
  });

  it("détecte le message 'Can't reach database server' (sans code)", () => {
    expect(isConnectionError(new Error("Can't reach database server at ...neon.tech:5432"))).toBe(true);
  });

  it("détecte 'Connection terminated'", () => {
    expect(isConnectionError(new Error("Connection terminated unexpectedly"))).toBe(true);
  });

  it("détecte ECONNREFUSED et ETIMEDOUT", () => {
    expect(isConnectionError(new Error("connect ECONNREFUSED 10.0.0.1:5432"))).toBe(true);
    expect(isConnectionError(new Error("read ETIMEDOUT"))).toBe(true);
  });

  it("NE détecte PAS P2002 (unique constraint)", () => {
    expect(isConnectionError(prismaError("P2002", "Unique constraint failed"))).toBe(false);
  });

  it("NE détecte PAS une erreur de validation générique", () => {
    expect(isConnectionError(new Error("Invalid value for argument"))).toBe(false);
  });

  it("gère null / undefined / non-objets sans crash", () => {
    expect(isConnectionError(null)).toBe(false);
    expect(isConnectionError(undefined)).toBe(false);
    expect(isConnectionError("string")).toBe(false);
    expect(isConnectionError(42)).toBe(false);
  });
});

describe("withDbRetry — succès sans retry", () => {
  it("retourne la valeur au 1er essai (fn appelée 1 fois)", async () => {
    const fn = jest.fn().mockResolvedValueOnce("ok");
    const result = await withDbRetry(fn);
    expect(result).toBe("ok");
    expect(fn).toHaveBeenCalledTimes(1);
  });
});

describe("withDbRetry — retry sur erreur connexion", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.spyOn(console, "warn").mockImplementation(() => {});
  });
  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it("échec P1001 puis succès au 2e essai", async () => {
    const fn = jest
      .fn()
      .mockRejectedValueOnce(prismaError("P1001"))
      .mockResolvedValueOnce("recovered");

    const promise = withDbRetry(fn, { label: "test" });
    // Laisse passer le 1er échec + le setTimeout du backoff.
    await jest.runAllTimersAsync();
    const result = await promise;

    expect(result).toBe("recovered");
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it("échec P1001 ×2 puis succès au 3e essai", async () => {
    const fn = jest
      .fn()
      .mockRejectedValueOnce(prismaError("P1001"))
      .mockRejectedValueOnce(new Error("Can't reach database server"))
      .mockResolvedValueOnce("third-time-lucky");

    const promise = withDbRetry(fn);
    await jest.runAllTimersAsync();
    const result = await promise;

    expect(result).toBe("third-time-lucky");
    expect(fn).toHaveBeenCalledTimes(3);
  });

  it("échec P1001 ×3 → re-throw la dernière erreur après maxAttempts", async () => {
    const lastErr = prismaError("P1001", "Can't reach database server — final");
    const fn = jest
      .fn()
      .mockRejectedValueOnce(prismaError("P1001", "attempt 1"))
      .mockRejectedValueOnce(prismaError("P1001", "attempt 2"))
      .mockRejectedValueOnce(lastErr);

    const promise = withDbRetry(fn);
    // attache le catch avant d'avancer les timers (évite unhandled rejection)
    const assertion = expect(promise).rejects.toBe(lastErr);
    await jest.runAllTimersAsync();
    await assertion;
    expect(fn).toHaveBeenCalledTimes(3);
  });

  it("respecte maxAttempts custom (2 essais)", async () => {
    const fn = jest
      .fn()
      .mockRejectedValueOnce(prismaError("P1001"))
      .mockRejectedValueOnce(prismaError("P1001"));

    const promise = withDbRetry(fn, { maxAttempts: 2 });
    const assertion = expect(promise).rejects.toBeDefined();
    await jest.runAllTimersAsync();
    await assertion;
    expect(fn).toHaveBeenCalledTimes(2);
  });
});

describe("withDbRetry — re-throw immédiat sur erreur non-connexion", () => {
  it("P2002 (unique constraint) → throw sans retry (fn appelée 1 fois)", async () => {
    const err = prismaError("P2002", "Unique constraint failed");
    const fn = jest.fn().mockRejectedValueOnce(err);
    await expect(withDbRetry(fn)).rejects.toBe(err);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("erreur de validation générique → throw sans retry", async () => {
    const err = new Error("Invalid value provided");
    const fn = jest.fn().mockRejectedValueOnce(err);
    await expect(withDbRetry(fn)).rejects.toBe(err);
    expect(fn).toHaveBeenCalledTimes(1);
  });
});

describe("withDbRetry — backoff exponentiel", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.spyOn(console, "warn").mockImplementation(() => {});
  });
  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it("attend baseMs puis baseMs*2 entre les essais (500ms, 1000ms)", async () => {
    const setTimeoutSpy = jest.spyOn(global, "setTimeout");
    const fn = jest
      .fn()
      .mockRejectedValueOnce(prismaError("P1001"))
      .mockRejectedValueOnce(prismaError("P1001"))
      .mockResolvedValueOnce("ok");

    const promise = withDbRetry(fn, { baseMs: 500 });
    await jest.runAllTimersAsync();
    await promise;

    const delays = setTimeoutSpy.mock.calls.map((c) => c[1]);
    expect(delays).toContain(500); // 500 * 2^0
    expect(delays).toContain(1000); // 500 * 2^1
  });

  it("respecte baseMs custom (100ms → 200ms)", async () => {
    const setTimeoutSpy = jest.spyOn(global, "setTimeout");
    const fn = jest
      .fn()
      .mockRejectedValueOnce(prismaError("P1001"))
      .mockRejectedValueOnce(prismaError("P1001"))
      .mockResolvedValueOnce("ok");

    const promise = withDbRetry(fn, { baseMs: 100 });
    await jest.runAllTimersAsync();
    await promise;

    const delays = setTimeoutSpy.mock.calls.map((c) => c[1]);
    expect(delays).toContain(100);
    expect(delays).toContain(200);
  });
});
