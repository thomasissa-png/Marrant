/**
 * Tests — Cohérence de seo-redirects.ts avec next.config.js.
 *
 * Le tableau `SEO_REDIRECTS` (TS) est dupliqué manuellement dans
 * `next.config.js` (CJS) parce que Next ne peut pas importer un module TS
 * dans sa config. Ce test empêche la dérive en comparant les deux sources.
 */
import { SEO_REDIRECTS, UNPUBLISHED_STATIC_SLUGS, DB_LOSER_SLUGS, hasRedirect } from "@/lib/seo-redirects";

// Charge next.config.js (CJS) pour extraire son tableau redirects.
// Le path est relatif à apps/web (jest cwd). On passe par un import CJS
// wrapper qui masque l'expression `require` pour la lint config Next.
function loadNextConfig(): {
  redirects?: () => Promise<Array<{ source: string; destination: string; permanent: boolean }>>;
} {
  // eslint-disable-next-line
  return require("../../../next.config.js");
}
const nextConfig = loadNextConfig();

describe("SEO_REDIRECTS", () => {
  it("contient les 8 paires de cannibalisation s11", () => {
    const s11Sources = SEO_REDIRECTS.filter((r) =>
      r.reason?.startsWith("Cannibalisation s11"),
    ).map((r) => r.source);
    // 8 paires attendues
    expect(s11Sources).toHaveLength(8);
    expect(s11Sources).toEqual(
      expect.arrayContaining([
        "/blog/ne-plus-rester-muet-en-groupe",
        "/blog/je-ne-sais-jamais-quoi-repondre",
        "/blog/timing-humour-ralentir",
        "/blog/raconter-blague-sans-massacrer",
        "/blog/jeux-de-mots-technique-3-etapes",
        "/blog/humour-apres-rupture",
        "/blog/blagues-courtes-vs-longues",
        "/blog/apprendre-la-repartie-methode-30-jours",
      ]),
    );
  });

  it("chaque redirect est permanent (301, pas 302)", () => {
    for (const r of SEO_REDIRECTS) {
      expect(r.permanent).toBe(true);
    }
  });

  it("aucune destination pointant vers une source (pas de chaîne A→B→C)", () => {
    const sources = new Set(SEO_REDIRECTS.map((r) => r.source));
    for (const r of SEO_REDIRECTS) {
      expect(sources.has(r.destination)).toBe(false);
    }
  });

  it("les destinations existent : slug ne se trouve pas dans UNPUBLISHED_STATIC_SLUGS ou DB_LOSER_SLUGS", () => {
    const dbLosers = new Set(DB_LOSER_SLUGS);
    for (const r of SEO_REDIRECTS) {
      const destSlug = r.destination.replace("/blog/", "");
      // Une destination ne doit pas être un slug dépublié.
      expect(UNPUBLISHED_STATIC_SLUGS.has(destSlug)).toBe(false);
      expect(dbLosers.has(destSlug)).toBe(false);
    }
  });
});

describe("next.config.js redirects()", () => {
  it("est déclaré (mode server, pas mobile export)", () => {
    // En mode server, redirects est une function. En mode mobile (BUILD_TARGET=mobile),
    // elle est absente. On test le path server ici.
    if (process.env.BUILD_TARGET === "mobile") {
      expect(nextConfig.redirects).toBeUndefined();
      return;
    }
    expect(typeof nextConfig.redirects).toBe("function");
  });

  it("contient tous les sources de SEO_REDIRECTS (pas de dérive TS ↔ CJS)", async () => {
    if (process.env.BUILD_TARGET === "mobile" || !nextConfig.redirects) return;

    const nextRedirects = await nextConfig.redirects();
    const nextSources = new Set(nextRedirects.map((r) => r.source));

    for (const r of SEO_REDIRECTS) {
      expect(nextSources.has(r.source)).toBe(true);
    }
  });

  it("les destinations concordent entre TS et CJS", async () => {
    if (process.env.BUILD_TARGET === "mobile" || !nextConfig.redirects) return;

    const nextRedirects = await nextConfig.redirects();
    const nextBySource = new Map(nextRedirects.map((r) => [r.source, r.destination]));

    for (const r of SEO_REDIRECTS) {
      expect(nextBySource.get(r.source)).toBe(r.destination);
    }
  });
});

describe("UNPUBLISHED_STATIC_SLUGS", () => {
  it("contient exactement 5 slugs statiques (les 5 paires où la version DB gagne)", () => {
    expect(UNPUBLISHED_STATIC_SLUGS.size).toBe(5);
    expect(UNPUBLISHED_STATIC_SLUGS.has("timing-humour-ralentir")).toBe(true);
    expect(UNPUBLISHED_STATIC_SLUGS.has("raconter-blague-sans-massacrer")).toBe(true);
    expect(UNPUBLISHED_STATIC_SLUGS.has("jeux-de-mots-technique-3-etapes")).toBe(true);
    expect(UNPUBLISHED_STATIC_SLUGS.has("humour-apres-rupture")).toBe(true);
    expect(UNPUBLISHED_STATIC_SLUGS.has("blagues-courtes-vs-longues")).toBe(true);
  });
});

describe("DB_LOSER_SLUGS", () => {
  it("contient exactement 3 slugs DB (les 3 paires où le statique gagne)", () => {
    expect(DB_LOSER_SLUGS).toHaveLength(3);
    expect(DB_LOSER_SLUGS).toEqual(
      expect.arrayContaining([
        "ne-plus-rester-muet-en-groupe",
        "je-ne-sais-jamais-quoi-repondre",
        "apprendre-la-repartie-methode-30-jours",
      ]),
    );
  });

  it("chaque DB_LOSER apparaît comme source dans SEO_REDIRECTS", () => {
    const sources = new Set(SEO_REDIRECTS.map((r) => r.source));
    for (const slug of DB_LOSER_SLUGS) {
      expect(sources.has(`/blog/${slug}`)).toBe(true);
    }
  });
});

// ─── Lot 1 : slug pérenne + helpers ───
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

describe("kind: rename — seules les vraies renommées touchent la base", () => {
  it("seul le slug daté est un renommage ; aucune redirection de cannibalisation ne l'est", () => {
    const renames = SEO_REDIRECTS.filter((r) => r.kind === "rename").map((r) => r.source);
    expect(renames).toEqual(["/blog/meilleures-blagues-droles-2026"]);
    for (const slug of DB_LOSER_SLUGS) {
      const r = SEO_REDIRECTS.find((x) => x.source === `/blog/${slug}`);
      expect(r?.kind).toBeUndefined();
    }
  });
});
