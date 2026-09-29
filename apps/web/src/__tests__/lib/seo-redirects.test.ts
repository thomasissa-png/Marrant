import { SEO_REDIRECTS, hasRedirect } from "@/lib/seo-redirects";

describe("SEO_REDIRECTS", () => {
  it("re-exporte les données CJS depuis seo-redirects.data.cjs (une seule source de vérité)", () => {
    expect(Array.isArray(SEO_REDIRECTS)).toBe(true);
    expect(SEO_REDIRECTS.length).toBeGreaterThan(0);
  });

  it("toutes les redirections sont permanentes (301) — préserve le PageRank", () => {
    for (const redirect of SEO_REDIRECTS) {
      expect(redirect.permanent).toBe(true);
    }
  });

  it("chaque source commence par un slash", () => {
    for (const redirect of SEO_REDIRECTS) {
      expect(redirect.source.startsWith("/")).toBe(true);
      expect(redirect.destination.startsWith("/")).toBe(true);
    }
  });

  it("aucune source ne pointe vers elle-même", () => {
    for (const redirect of SEO_REDIRECTS) {
      expect(redirect.source).not.toBe(redirect.destination);
    }
  });

  it("aucune boucle A → B → A", () => {
    const map = new Map(SEO_REDIRECTS.map((r) => [r.source, r.destination]));
    for (const redirect of SEO_REDIRECTS) {
      const next = map.get(redirect.destination);
      if (next) {
        expect(next).not.toBe(redirect.source);
      }
    }
  });

  it("chaque source est unique (pas de conflit de règle)", () => {
    const sources = SEO_REDIRECTS.map((r) => r.source);
    const unique = new Set(sources);
    expect(unique.size).toBe(sources.length);
  });

  it("slug daté 2026 → slug pérenne (fix session 11)", () => {
    const dated = SEO_REDIRECTS.find(
      (r) => r.source === "/blog/meilleures-blagues-droles-2026",
    );
    expect(dated).toBeDefined();
    expect(dated?.destination).toBe("/blog/meilleures-blagues-droles");
    expect(dated?.permanent).toBe(true);
  });

  it("hasRedirect() détecte les sources existantes (idempotence)", () => {
    expect(hasRedirect("/blog/meilleures-blagues-droles-2026")).toBe(true);
    expect(hasRedirect("/blog/slug-inexistant-xyz")).toBe(false);
  });
});
