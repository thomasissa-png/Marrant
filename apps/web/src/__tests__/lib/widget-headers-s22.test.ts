/**
 * @jest-environment node
 *
 * s22, widget « La vanne du jour » : /embed/vanne-du-jour SEULEMENT est
 * encadrable (pas de X-Frame-Options DENY, `frame-ancestors *`, noindex) et
 * TOUTES les autres routes, y compris /embed/<autre>, gardent exactement leurs
 * en-têtes d'avant s22 (QA m1). /widget.js est un fichier de la couche assets :
 * ses en-têtes viennent de public/_headers, pas de next.config (QA m7).
 */
import { createHash } from "crypto";
import { readFileSync } from "fs";
import { join } from "path";
import { getPathMatch } from "next/dist/shared/lib/router/utils/path-match";

const nextConfig = require("../../../next.config.js");
const { EMBED_INLINE_SCRIPT } = require("../../lib/widget/embed-script.data.cjs");

type Header = { key: string; value: string };
type Rule = { source: string; headers: Header[] };

/** En-têtes effectifs d'un chemin : règles dans l'ordre, la dernière valeur d'une clé l'emporte (doc Next). */
async function headersFor(pathname: string): Promise<Record<string, string>> {
  const rules: Rule[] = await nextConfig.headers();
  const out: Record<string, string> = {};
  for (const rule of rules) {
    if (!getPathMatch(rule.source, { strict: true })(pathname)) continue;
    for (const h of rule.headers) out[h.key] = h.value;
  }
  return out;
}

// Copie des en-têtes de next.config.js AVANT s22 (git, commit de départ de la branche).
const SITE_CSP =
  "default-src 'self'; script-src 'self' 'unsafe-inline' https://cloud.umami.is https://js.stripe.com; style-src 'self' 'unsafe-inline'; img-src 'self' https: data:; font-src 'self' data:; connect-src 'self' https:; frame-src https://www.youtube-nocookie.com https://checkout.stripe.com https://js.stripe.com; object-src 'none'; base-uri 'self'";
const AVANT_S22: Record<string, string> = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "X-XSS-Protection": "1; mode=block",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  "Strict-Transport-Security": "max-age=15552000",
  "Content-Security-Policy": SITE_CSP,
};

describe("en-têtes hors /embed/* : inchangés", () => {
  it.each(["/", "/vannes", "/vannes/une-vanne-abc123", "/api/daily", "/api/widget/v1/vanne-du-jour", "/blog/un-article", "/embedded", "/embed", "/embed/", "/embed/inconnu", "/embed/vanne-du-jour/x", "/embed/vanne-du-jour-bis"])(
    "%s garde exactement les en-têtes d'avant s22",
    async (path) => {
      expect(await headersFor(path)).toEqual(AVANT_S22);
    },
  );

  it("/lettre/* garde son Referrer-Policy same-origin (s21)", async () => {
    expect(await headersFor("/lettre/confirmer")).toEqual({ ...AVANT_S22, "Referrer-Policy": "same-origin" });
  });

  it("la règle générale reste la première (lue par csp-frame-src.test.ts), dans le même ordre", async () => {
    const rules: Rule[] = await nextConfig.headers();
    expect(rules[0].headers.map((h) => h.key)).toEqual(Object.keys(AVANT_S22));
  });

  it("/integrer-la-vanne-du-jour : seule la CSP change, avec 'self' ajouté en frame-src (aperçu)", async () => {
    const h = await headersFor("/integrer-la-vanne-du-jour");
    expect(h["Content-Security-Policy"]).toBe(SITE_CSP.replace("frame-src ", "frame-src 'self' "));
    expect({ ...h, "Content-Security-Policy": SITE_CSP }).toEqual(AVANT_S22);
  });
});

describe("/widget.js (couche assets Cloudflare, public/_headers)", () => {
  it("cache 1 h et nosniff", () => {
    const h = readFileSync(join(__dirname, "../../../public/_headers"), "utf8");
    expect(h).toMatch(/\/widget\.js\n  Cache-Control: public, max-age=3600, stale-while-revalidate=86400\n  X-Content-Type-Options: nosniff/);
  });
});

describe("/embed/vanne-du-jour : encadrable, noindex, reste de la sécurité intact", () => {
  it("pas de X-Frame-Options, frame-ancestors *, noindex", async () => {
    const h = await headersFor("/embed/vanne-du-jour");
    expect(h["X-Frame-Options"]).toBeUndefined();
    expect(h["Content-Security-Policy"]).toContain("frame-ancestors *");
    expect(h["X-Robots-Tag"]).toBe("noindex");
  });

  it("garde nosniff, HSTS, Referrer-Policy, Permissions-Policy, X-XSS-Protection", async () => {
    const h = await headersFor("/embed/vanne-du-jour");
    for (const key of Object.keys(AVANT_S22)) {
      if (key === "X-Frame-Options" || key === "Content-Security-Policy") continue;
      expect(h[key]).toBe(AVANT_S22[key]);
    }
  });

  it("CSP fermée : default-src 'none', un seul script autorisé par son empreinte exacte", async () => {
    const csp = (await headersFor("/embed/vanne-du-jour"))["Content-Security-Policy"];
    const hash = createHash("sha256").update(EMBED_INLINE_SCRIPT, "utf8").digest("base64");
    expect(csp).toContain("default-src 'none'");
    expect(csp).toContain(`script-src 'sha256-${hash}'`);
    expect(csp).not.toContain("unsafe-eval");
    expect(csp).not.toContain("umami");
  });
});
