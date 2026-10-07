import { test as base, expect, type Page, type Request } from "@playwright/test";
import path from "node:path";

/**
 * Socle commun des tests E2E.
 *
 * Garde « lecture seule » (suite @smoke, jouable en prod) : toute requête non GET
 * vers le site est BLOQUÉE et fait échouer le test, sauf la courte liste
 * ci-dessous, vérifiée dans le code comme sans écriture métier ni e-mail :
 * - NextAuth credentials avec un compte inexistant (`authorize` : findUnique puis null) ;
 * - forgot-password sur une adresse en `.invalid` (route : aucun jeton, aucun envoi
 *   si l'utilisateur n'existe pas) ;
 * - reset-password avec un jeton faux (400 avant toute écriture).
 * Depuis s16 (lot B), ces 3 routes incrémentent un compteur de limitation de débit
 * (table JobLock, clé hachée, purgée automatiquement) : seule écriture tolérée.
 *
 * Mesure d'audience : Umami et Cloudflare Insights sont coupés pour ne pas
 * polluer le funnel `mur-vu` → `abonnement-vu` → `abonnement-clic` de la prod.
 */
const POST_AUTORISES: RegExp[] = [
  /\/api\/auth\/callback\/credentials(\?|$)/,
  /\/api\/auth\/forgot-password$/,
  /\/api\/auth\/reset-password$/,
  /\/api\/auth\/_log$/,
];

const MESURE_AUDIENCE = /(umami\.is|cloudflareinsights\.com)/;

export const BASE_URL = (process.env.E2E_BASE_URL || "http://localhost:5000").replace(/\/$/, "");
export const EST_PROD = /(^|\.)deviens-marrant\.fr$/.test(new URL(BASE_URL).hostname);

/**
 * Adresse garantie inexistante (TLD réservé, RFC 2606) : aucun envoi possible.
 * Unique par test : la limite de connexion s16 (10 essais / 15 min par e-mail)
 * ne doit pas bloquer des lancements rapprochés.
 */
export function emailInexistant(): string {
  return `qa-e2e-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}@example.invalid`;
}

type Fixtures = {
  /** Requêtes d'écriture bloquées pendant le test (rapportées en échec). */
  ecrituresBloquees: string[];
};

export const test = base.extend<Fixtures>({
  ecrituresBloquees: [
    async ({ context }, use) => {
      const bloquees: string[] = [];
      await context.route(MESURE_AUDIENCE, (route) => route.abort("blockedbyclient"));
      await context.route(
        (url) => url.origin === new URL(BASE_URL).origin,
        (route, request: Request) => {
          const methode = request.method();
          if (methode === "GET" || methode === "HEAD" || methode === "OPTIONS") return route.fallback();
          if (POST_AUTORISES.some((re) => re.test(request.url()))) {
            if (/forgot-password/.test(request.url())) {
              const corps = request.postData() ?? "";
              if (!corps.includes("@example.invalid")) {
                bloquees.push(`${methode} ${request.url()} (adresse hors .invalid)`);
                return route.abort("blockedbyclient");
              }
            }
            return route.fallback();
          }
          bloquees.push(`${methode} ${request.url()}`);
          return route.abort("blockedbyclient");
        },
      );
      await use(bloquees);
      expect(bloquees, "Écriture tentée pendant un test en lecture seule").toEqual([]);
    },
    { auto: true },
  ],
});

export { expect };

/** Projet mobile (gabarit iPhone 13) ? */
export function estMobile(page: Page): boolean {
  return (page.viewportSize()?.width ?? 1440) < 1024;
}

/** Paramètres d'un lien relatif ou absolu, lus comme le ferait le navigateur. */
export function lireUrl(href: string | null): URL {
  expect(href, "lien sans href").toBeTruthy();
  return new URL(href as string, BASE_URL);
}

const AXE_SOURCE = path.join(
  path.dirname(require.resolve("axe-core/package.json", { paths: [path.join(__dirname, "../../../apps/web")] })),
  "axe.min.js",
);

export type ViolationAxe = { id: string; impact: string | null; nodes: number; cibles: string[] };

/**
 * axe-core (WCAG 2.0/2.1/2.2 A et AA) sur la page courante. Retourne les
 * violations (impact, nombre de nœuds, 3 premières cibles) pour un message lisible.
 */
export async function auditAxe(page: Page): Promise<ViolationAxe[]> {
  await page.addScriptTag({ path: AXE_SOURCE });
  const violations = await page.evaluate(async () => {
    // @ts-expect-error axe injecté dans la page
    const r = await window.axe.run(document, {
      runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"] },
    });
    return r.violations.map((v: { id: string; impact: string | null; nodes: { target: string[] }[] }) => ({
      id: v.id,
      impact: v.impact,
      nodes: v.nodes.length,
      cibles: v.nodes.slice(0, 3).map((n) => n.target.join(" ")),
    }));
  });
  return violations as ViolationAxe[];
}
