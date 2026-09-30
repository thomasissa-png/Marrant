/**
 * @jest-environment node
 *
 * Lot T2 (régressions de la bascule Cloudflare, s14) :
 * 1. IndexNow : aucun fichier statique public/indexnow-key.txt (il masquerait la
 *    route src/app/indexnow-key.txt qui sert process.env.INDEXNOW_KEY).
 * 2. Cache : public/_headers pose un cache immuable sur /_next/static/* et un cache
 *    court sur polices/icônes ; le Worker pose le même en-tête sur les chunks
 *    servis via run_worker_first.
 * 3. HSTS 6 mois, sans includeSubDomains ni preload, sur toutes les réponses Next.
 */
import { existsSync, readFileSync } from "fs";
import { join } from "path";

jest.mock("../../../.open-next/worker.js", () => ({ default: { fetch: jest.fn() } }), { virtual: true });

const nextConfig = require("../../../next.config.js");
import { withImmutableCache, IMMUTABLE_CACHE_CONTROL, restoreRedirectLocation } from "../../../cloudflare/worker";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

const WEB_ROOT = join(__dirname, "../../..");

/** Parse minimal du format _headers de Cloudflare : chemin → { en-tête: valeur }. */
function parseHeadersFile(content: string): Record<string, Record<string, string>> {
  const rules: Record<string, Record<string, string>> = {};
  let current: string | null = null;
  for (const raw of content.split("\n")) {
    if (!raw.trim() || raw.trim().startsWith("#")) continue;
    if (!/^\s/.test(raw)) {
      current = raw.trim();
      rules[current] = {};
    } else if (current) {
      const idx = raw.indexOf(":");
      rules[current][raw.slice(0, idx).trim().toLowerCase()] = raw.slice(idx + 1).trim();
    }
  }
  return rules;
}

describe("IndexNow : pas de clé statique concurrente", () => {
  it("public/indexnow-key.txt n'existe pas (la route dynamique fait foi)", () => {
    expect(existsSync(join(WEB_ROOT, "public/indexnow-key.txt"))).toBe(false);
    expect(existsSync(join(WEB_ROOT, "src/app/indexnow-key.txt/route.ts"))).toBe(true);
  });
});

describe("public/_headers (couche assets Cloudflare)", () => {
  const rules = parseHeadersFile(readFileSync(join(WEB_ROOT, "public/_headers"), "utf-8"));

  it("cache immuable 1 an sur /_next/static/*", () => {
    expect(rules["/_next/static/*"]["cache-control"]).toBe(IMMUTABLE_CACHE_CONTROL);
  });

  it.each(["/fonts/*", "/favicon.ico", "/favicon.png", "/favicon.svg", "/apple-touch-icon.png", "/icon-192.png", "/icon-512.png"])(
    "cache 1 jour + stale-while-revalidate sur %s",
    (path) => {
      const value = rules[path]?.["cache-control"] ?? "";
      expect(value).toContain("max-age=86400");
      expect(value).toContain("stale-while-revalidate");
      expect(value).not.toContain("immutable");
    },
  );

  it("chaque règle d'icône/police vise un fichier réellement présent dans public/", () => {
    for (const path of Object.keys(rules)) {
      if (path.startsWith("/_next/")) continue;
      expect(existsSync(join(WEB_ROOT, "public", path.replace("/*", "")))).toBe(true);
    }
  });
});

describe("Worker : chunks servis via run_worker_first", () => {
  it("pose le cache immuable sur une réponse 200", () => {
    const res = withImmutableCache(new Response("js", { status: 200, headers: { "Cache-Control": "public, max-age=0, must-revalidate", "Content-Type": "text/javascript" } }));
    expect(res.headers.get("Cache-Control")).toBe(IMMUTABLE_CACHE_CONTROL);
    expect(res.headers.get("Content-Type")).toBe("text/javascript");
    expect(res.status).toBe(200);
  });

  it("ne met jamais une 404 en cache 1 an", () => {
    const res = withImmutableCache(new Response("nope", { status: 404, headers: { "Cache-Control": "no-store" } }));
    expect(res.headers.get("Cache-Control")).toBe("no-store");
  });
});

describe("HSTS (next.config.js headers())", () => {
  it("max-age=15552000 sans includeSubDomains ni preload, sur toutes les routes", async () => {
    const rules = await nextConfig.headers();
    const all = rules.find((r: { source: string }) => r.source === "/(.*)");
    const hsts = all.headers.find((h: { key: string }) => h.key === "Strict-Transport-Security");
    expect(hsts.value).toBe("max-age=15552000");
  });
});

describe("Worker : redirection mise en cache ISR sans Location (lot S2)", () => {
  // Balise produite par Next 14.2 (make-get-server-inserted-html) pour permanentRedirect().
  const meta = renderToStaticMarkup(
    createElement("meta", { id: "__next-page-redirect", httpEquiv: "refresh", content: "0;url=/vannes" }),
  );
  const html = `<!DOCTYPE html><html><head>${meta}</head><body></body></html>`;

  it("restaure Location depuis la balise meta de Next sur un 308 HTML", async () => {
    const res = await restoreRedirectLocation(
      new Response(html, { status: 308, headers: { "Content-Type": "text/html; charset=utf-8" } }),
    );
    expect(res.status).toBe(308);
    expect(res.headers.get("Location")).toBe("/vannes");
    expect(await res.text()).toBe(html);
  });

  it("ne touche pas à une redirection qui a déjà sa Location", async () => {
    const original = new Response(null, { status: 308, headers: { Location: "/conseils" } });
    expect(await restoreRedirectLocation(original)).toBe(original);
  });

  it("ne touche pas aux réponses 200 (streaming intact)", async () => {
    const original = new Response(html, { status: 200, headers: { "Content-Type": "text/html" } });
    expect(await restoreRedirectLocation(original)).toBe(original);
  });
});
