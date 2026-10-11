/**
 * Tests — CEO email footer (HMAC unsubscribe + footer enforcement)
 *
 * Module sous test : `apps/web/src/lib/email/ceo-email-footer.ts`
 *
 * Couvre (Phase 5.D Groupe 2 / @qa plan §3) :
 *   - generateUnsubscribeToken : déterminisme, format `<base64url>.<hmac16>`
 *   - verifyUnsubscribeToken   : round-trip, tampering détecté (signature, payload)
 *   - buildUnsubscribeUrl      : URL absolue + encodage URI safe
 *   - enforceEmailFooter (HTML + text) : idempotence, insertion avant </body>
 *   - Edge cases : email vide, accents, secret manquant ou trop court
 *
 * Note s10 (cross-review s9 MINEUR) : le token HMAC n'a pas d'expiration —
 * choix accepté s9 (un lien unsubscribe doit fonctionner indéfiniment, sinon
 * désinscription bloquée si email lu tardivement).
 *
 * TODO s11 : si une politique d'expiration est introduite (ex. 90j), ajouter
 * un timestamp signé dans le payload + verify within window.
 */

import { createHmac } from "node:crypto";

const ORIGINAL_ENV = { ...process.env };

/** Secret HMAC de référence — assez long (>=32 char) pour passer la garde. */
const TEST_SECRET = "test-secret-".padEnd(64, "x");

/**
 * Recharge le module à chaque test : `getUnsubscribeHmacSecret` lit
 * `process.env.UNSUBSCRIBE_HMAC_SECRET` à chaque appel, donc en pratique
 * resetModules n'est pas indispensable, mais garantit une isolation totale
 * (pattern setupDirectorWithFlag du fichier standup-director-haiku.test.ts).
 */
async function loadModule(envOverrides: Record<string, string | undefined> = {}) {
  jest.resetModules();
  process.env = { ...ORIGINAL_ENV };
  process.env.UNSUBSCRIBE_HMAC_SECRET = TEST_SECRET;
  for (const [k, v] of Object.entries(envOverrides)) {
    if (v === undefined) {
      delete process.env[k];
    } else {
      process.env[k] = v;
    }
  }
  return import("@/lib/email/ceo-email-footer");
}

afterAll(() => {
  process.env = { ...ORIGINAL_ENV };
});

// ─── generateUnsubscribeToken ────────────────────────────────────────────

describe("generateUnsubscribeToken", () => {
  it("retourne un token au format `<base64url>.<hmac16>`", async () => {
    const mod = await loadModule();
    const token = mod.generateUnsubscribeToken("alex@example.com");
    const parts = token.split(".");
    expect(parts).toHaveLength(2);
    const [payload, signature] = parts;
    expect(payload).toMatch(/^[A-Za-z0-9_-]+$/); // base64url
    expect(signature).toMatch(/^[a-f0-9]{16}$/); // 16 chars hex (8 bytes HMAC tronqué)
  });

  it("est déterministe (même input + même secret → même output)", async () => {
    const mod = await loadModule();
    const a = mod.generateUnsubscribeToken("alex@example.com");
    const b = mod.generateUnsubscribeToken("alex@example.com");
    expect(a).toBe(b);
  });

  it("normalise (trim + lowercase) avant encodage", async () => {
    const mod = await loadModule();
    const a = mod.generateUnsubscribeToken("  Alex@Example.COM  ");
    const b = mod.generateUnsubscribeToken("alex@example.com");
    expect(a).toBe(b);
  });

  it("utilise HMAC-SHA256 reproductible avec crypto natif", async () => {
    const mod = await loadModule();
    const email = "alex@example.com";
    const expectedPayload = Buffer.from(email).toString("base64url");
    const expectedSig = createHmac("sha256", TEST_SECRET)
      .update(expectedPayload)
      .digest("hex")
      .slice(0, 16);
    expect(mod.generateUnsubscribeToken(email)).toBe(`${expectedPayload}.${expectedSig}`);
  });

  it("supporte les emails avec caractères spéciaux (+tag, accents, dot-local)", async () => {
    const mod = await loadModule();
    for (const addr of [
      "alex+marketing@example.com",
      "héloïse@déjà-vu.fr",
      "first.last@example.co.uk",
      "x@y.z",
    ]) {
      const token = mod.generateUnsubscribeToken(addr);
      expect(token).toMatch(/^[A-Za-z0-9_-]+\.[a-f0-9]{16}$/);
    }
  });

  it("throw si UNSUBSCRIBE_HMAC_SECRET absent", async () => {
    const mod = await loadModule({ UNSUBSCRIBE_HMAC_SECRET: undefined });
    expect(() => mod.generateUnsubscribeToken("alex@example.com")).toThrow(
      /UNSUBSCRIBE_HMAC_SECRET/,
    );
  });

  it("throw si UNSUBSCRIBE_HMAC_SECRET trop court (<32 chars)", async () => {
    const mod = await loadModule({ UNSUBSCRIBE_HMAC_SECRET: "short" });
    expect(() => mod.generateUnsubscribeToken("alex@example.com")).toThrow(/32 chars/);
  });
});

// ─── verifyUnsubscribeToken ──────────────────────────────────────────────

describe("verifyUnsubscribeToken", () => {
  it("round-trip : verify(generate(email)) === email normalisé", async () => {
    const mod = await loadModule();
    const token = mod.generateUnsubscribeToken("Alex@Example.com");
    expect(mod.verifyUnsubscribeToken(token)).toBe("alex@example.com");
  });

  it("retourne null si la signature a été altérée (1 char modifié)", async () => {
    const mod = await loadModule();
    const token = mod.generateUnsubscribeToken("alex@example.com");
    const [payload, sig] = token.split(".");
    // flip 1 char hex (a→b, 0→1, etc.)
    const flipped = sig[0] === "a" ? "b" + sig.slice(1) : "a" + sig.slice(1);
    expect(mod.verifyUnsubscribeToken(`${payload}.${flipped}`)).toBeNull();
  });

  it("retourne null si le payload base64 a été altéré", async () => {
    const mod = await loadModule();
    const token = mod.generateUnsubscribeToken("alex@example.com");
    const [payload, sig] = token.split(".");
    const flipped = "Z" + payload.slice(1);
    expect(mod.verifyUnsubscribeToken(`${flipped}.${sig}`)).toBeNull();
  });

  it("retourne null si format invalide (zéro point)", async () => {
    const mod = await loadModule();
    expect(mod.verifyUnsubscribeToken("plainstring")).toBeNull();
  });

  it("retourne null si format invalide (>2 segments)", async () => {
    const mod = await loadModule();
    expect(mod.verifyUnsubscribeToken("a.b.c")).toBeNull();
  });

  it("retourne null si chaîne vide", async () => {
    const mod = await loadModule();
    expect(mod.verifyUnsubscribeToken("")).toBeNull();
  });

  it("retourne null si tronqué (signature partielle)", async () => {
    const mod = await loadModule();
    const token = mod.generateUnsubscribeToken("alex@example.com");
    const truncated = token.slice(0, token.length - 4);
    expect(mod.verifyUnsubscribeToken(truncated)).toBeNull();
  });

  it("retourne null si le token a été signé avec un AUTRE secret", async () => {
    // Génère avec secret A, vérifie avec secret B → doit échouer.
    const modA = await loadModule({ UNSUBSCRIBE_HMAC_SECRET: "secretA-".padEnd(64, "a") });
    const token = modA.generateUnsubscribeToken("alex@example.com");

    const modB = await loadModule({ UNSUBSCRIBE_HMAC_SECRET: "secretB-".padEnd(64, "b") });
    expect(modB.verifyUnsubscribeToken(token)).toBeNull();
  });

  it("préserve les caractères spéciaux après round-trip", async () => {
    const mod = await loadModule();
    for (const addr of ["alex+tag@example.com", "héloïse@déjà-vu.fr"]) {
      const token = mod.generateUnsubscribeToken(addr);
      expect(mod.verifyUnsubscribeToken(token)).toBe(addr.trim().toLowerCase());
    }
  });

  // TODO s11 : ajouter expiration timestamp dans payload + verify within window.
  // Aujourd'hui (s10) : un token est valide indéfiniment — choix produit accepté
  // s9 (cross-review MINEUR cde7430). Si politique change → enrichir payload
  // avec `<base64url(email)>.<expiresAt>.<hmac16>` et reject si Date.now() > expiresAt.
  it("[TODO s11] documente l'absence d'expiration (token vieux 1 an reste valide)", async () => {
    const mod = await loadModule();
    const token = mod.generateUnsubscribeToken("alex@example.com");
    // Simule un saut de Date.now() (mais le module ne lit pas l'horloge → reste valide).
    jest.useFakeTimers().setSystemTime(new Date("2030-01-01"));
    expect(mod.verifyUnsubscribeToken(token)).toBe("alex@example.com");
    jest.useRealTimers();
  });
});

// ─── buildUnsubscribeUrl ─────────────────────────────────────────────────

describe("buildUnsubscribeUrl", () => {
  it("retourne une URL absolue avec token URL-encodé", async () => {
    const mod = await loadModule({ NEXT_PUBLIC_BASE_URL: "https://deviens-marrant.fr" });
    const url = mod.buildUnsubscribeUrl("alex@example.com");
    expect(url).toMatch(/^https:\/\/deviens-marrant\.fr\/api\/unsubscribe\?token=/);
  });

  it("utilise le fallback host si NEXT_PUBLIC_BASE_URL absent", async () => {
    const mod = await loadModule({ NEXT_PUBLIC_BASE_URL: undefined });
    const url = mod.buildUnsubscribeUrl("alex@example.com");
    expect(url).toContain("https://deviens-marrant.fr/api/unsubscribe?token=");
  });

  it("URL-encode le token (signature contient des hex safe, mais le `.` reste)", async () => {
    const mod = await loadModule({ NEXT_PUBLIC_BASE_URL: "https://example.com" });
    const url = mod.buildUnsubscribeUrl("alex@example.com");
    const tokenInUrl = url.split("token=")[1];
    // Pas d'espaces ni d'apostrophes brutes
    expect(tokenInUrl).not.toContain(" ");
    expect(tokenInUrl).not.toContain("\n");
  });

  it("le token extrait de l'URL passe verifyUnsubscribeToken", async () => {
    const mod = await loadModule({ NEXT_PUBLIC_BASE_URL: "https://example.com" });
    const url = mod.buildUnsubscribeUrl("alex@example.com");
    const tokenEnc = url.split("token=")[1];
    const token = decodeURIComponent(tokenEnc);
    expect(mod.verifyUnsubscribeToken(token)).toBe("alex@example.com");
  });
});

// ─── enforceEmailFooter (HTML) ───────────────────────────────────────────

describe("enforceEmailFooter (HTML)", () => {
  it("ajoute le footer si absent + contient le marker idempotence", async () => {
    const mod = await loadModule();
    const out = mod.enforceEmailFooter("<html><body><p>Hello</p></body></html>", "alex@example.com");
    expect(out).toContain("<!-- CEO_FOOTER_V1 -->");
    expect(out).toContain("Tu reçois cet email parce que");
    expect(out).toContain("L'Équipe Deviens Marrant");
  });

  it("est idempotent (double appel = 1 seul footer)", async () => {
    const mod = await loadModule();
    const html = "<html><body>Hi</body></html>";
    const once = mod.enforceEmailFooter(html, "alex@example.com");
    const twice = mod.enforceEmailFooter(once, "alex@example.com");
    expect(twice).toBe(once);
    // Compte les markers : doit être exactement 1
    expect((twice.match(/CEO_FOOTER_V1/g) ?? []).length).toBe(1);
  });

  it("insère AVANT </body> quand la balise existe", async () => {
    const mod = await loadModule();
    const html = "<html><body><p>Hi</p></body></html>";
    const out = mod.enforceEmailFooter(html, "alex@example.com");
    const footerIdx = out.indexOf("CEO_FOOTER_V1");
    const closingIdx = out.lastIndexOf("</body>");
    expect(footerIdx).toBeGreaterThan(0);
    expect(footerIdx).toBeLessThan(closingIdx);
  });

  it("append à la fin si pas de </body>", async () => {
    const mod = await loadModule();
    const html = "<p>Plain fragment, no body tag</p>";
    const out = mod.enforceEmailFooter(html, "alex@example.com");
    expect(out.indexOf("CEO_FOOTER_V1")).toBeGreaterThan(out.indexOf("</p>"));
  });

  it("contient un lien unsubscribe valide (verify round-trip)", async () => {
    const mod = await loadModule({ NEXT_PUBLIC_BASE_URL: "https://example.com" });
    const out = mod.enforceEmailFooter("<body>Hi</body>", "alex@example.com");
    const match = out.match(/href="(https:\/\/example\.com\/api\/unsubscribe\?token=[^"]+)"/);
    expect(match).not.toBeNull();
    if (!match) return;
    const tokenEnc = match[1].split("token=")[1];
    const token = decodeURIComponent(tokenEnc);
    expect(mod.verifyUnsubscribeToken(token)).toBe("alex@example.com");
  });

  it("inclut l'adresse postale via env ADRESSE_POSTALE", async () => {
    const mod = await loadModule({ ADRESSE_POSTALE: "10 rue Test, 75001 Paris" });
    const out = mod.enforceEmailFooter("<body></body>", "alex@example.com");
    expect(out).toContain("10 rue Test, 75001 Paris");
  });

  it("utilise le placeholder si ADRESSE_POSTALE absent", async () => {
    const mod = await loadModule({ ADRESSE_POSTALE: undefined });
    const out = mod.enforceEmailFooter("<body></body>", "alex@example.com");
    expect(out).toContain("ADRESSE_POSTALE_PLACEHOLDER");
  });

  it("survit à un body adversariel (script, emoji, 100KB)", async () => {
    const mod = await loadModule();
    const big =
      "<body><script>alert('x')</script>🏠 émoji " +
      "x".repeat(100_000) +
      "</body>";
    const out = mod.enforceEmailFooter(big, "alex@example.com");
    expect(out).toContain("CEO_FOOTER_V1");
    // Le footer ne doit pas avoir corrompu le contenu
    expect(out).toContain("<script>alert('x')</script>");
    expect(out).toContain("🏠");
  });
});

// ─── enforceEmailFooterText ──────────────────────────────────────────────

describe("enforceEmailFooterText", () => {
  it("ajoute le footer texte si absent", async () => {
    const mod = await loadModule();
    const out = mod.enforceEmailFooterText("Hello", "alex@example.com");
    expect(out).toContain("--- CEO_FOOTER_V1 ---");
    expect(out).toContain("Se désinscrire :");
    expect(out).toContain("L'Équipe Deviens Marrant");
  });

  it("est idempotent (double appel = 1 footer)", async () => {
    const mod = await loadModule();
    const once = mod.enforceEmailFooterText("Hi", "alex@example.com");
    const twice = mod.enforceEmailFooterText(once, "alex@example.com");
    expect(twice).toBe(once);
    expect((twice.match(/CEO_FOOTER_V1/g) ?? []).length).toBe(1);
  });

  it("contient un lien unsubscribe valide en plain-text", async () => {
    const mod = await loadModule({ NEXT_PUBLIC_BASE_URL: "https://example.com" });
    const out = mod.enforceEmailFooterText("Hi", "alex@example.com");
    const match = out.match(/Se désinscrire : (https:\/\/[^\s]+)/);
    expect(match).not.toBeNull();
    if (!match) return;
    const url = new URL(match[1]);
    const token = url.searchParams.get("token");
    expect(token).not.toBeNull();
    expect(mod.verifyUnsubscribeToken(token!)).toBe("alex@example.com");
  });

  it("expose les liens politique de confidentialité + adresse", async () => {
    const mod = await loadModule({
      NEXT_PUBLIC_BASE_URL: "https://example.com",
      ADRESSE_POSTALE: "1 rue X, Paris",
    });
    const out = mod.enforceEmailFooterText("Body", "alex@example.com");
    expect(out).toContain("https://example.com/confidentialite");
    expect(out).toContain("1 rue X, Paris");
  });
});
