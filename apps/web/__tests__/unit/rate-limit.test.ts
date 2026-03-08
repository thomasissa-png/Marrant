import { rateLimit } from "@/lib/rate-limit";

describe("rateLimit — limiteur de requêtes en mémoire", () => {
  it("autorise les premières requêtes", () => {
    const result = rateLimit("test-allow-1", { maxRequests: 5, windowMs: 60_000 });
    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(4);
  });

  it("décompte le remaining correctement", () => {
    const id = "test-count-" + Date.now();
    const opts = { maxRequests: 3, windowMs: 60_000 };

    const r1 = rateLimit(id, opts);
    expect(r1.remaining).toBe(2);

    const r2 = rateLimit(id, opts);
    expect(r2.remaining).toBe(1);

    const r3 = rateLimit(id, opts);
    expect(r3.remaining).toBe(0);
  });

  it("bloque après dépassement du maximum", () => {
    const id = "test-block-" + Date.now();
    const opts = { maxRequests: 2, windowMs: 60_000 };

    rateLimit(id, opts);
    rateLimit(id, opts);
    const r3 = rateLimit(id, opts);
    expect(r3.allowed).toBe(false);
    expect(r3.remaining).toBe(0);
  });

  it("réinitialise après expiration de la fenêtre", () => {
    const id = "test-reset-" + Date.now();
    const opts = { maxRequests: 1, windowMs: 1 }; // 1ms window

    rateLimit(id, opts);

    // Attendre que la fenêtre expire
    const start = Date.now();
    while (Date.now() - start < 5) {
      // busy wait 5ms
    }

    const result = rateLimit(id, opts);
    expect(result.allowed).toBe(true);
  });

  it("isole les identifiants différents", () => {
    const opts = { maxRequests: 1, windowMs: 60_000 };

    const r1 = rateLimit("user-A-" + Date.now(), opts);
    const r2 = rateLimit("user-B-" + Date.now(), opts);

    expect(r1.allowed).toBe(true);
    expect(r2.allowed).toBe(true);
  });

  it("retourne un resetAt dans le futur", () => {
    const now = Date.now();
    const result = rateLimit("test-reset-at-" + now, { maxRequests: 10, windowMs: 60_000 });
    expect(result.resetAt).toBeGreaterThan(now);
    expect(result.resetAt).toBeLessThanOrEqual(now + 60_000 + 100);
  });
});
