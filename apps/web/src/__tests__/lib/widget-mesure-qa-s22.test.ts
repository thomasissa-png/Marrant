/**
 * @jest-environment node
 *
 * QA indépendante tour 2 (s22), adaptée en itération 3 au nouveau mécanisme :
 * mesure des affichages du widget (`src/lib/widget/mesure.ts`) par Cloudflare
 * Workers Analytics Engine (liaison `WIDGET_AFFICHAGES`), sur le chemin Workers
 * que les tests @fullstack ne couvrent pas.
 * Garanties inchangées : aucune donnée du visiteur (IP, User-Agent, Referer
 * complet, chemin de l'hôte, cookie), réponse jamais retardée, écriture en
 * panne sans effet ni journal, aucun envoi pour l'aperçu, le local, les robots,
 * et désormais aucun appel réseau vers un tiers.
 */
type EtatQa = { workers: boolean; contexte: boolean; liaison: boolean; writeDataPoint: jest.Mock };
const etat = (): EtatQa => (globalThis as unknown as { __qaMesure: EtatQa }).__qaMesure;
(globalThis as unknown as { __qaMesure: EtatQa }).__qaMesure = { workers: false, contexte: true, liaison: true, writeDataPoint: jest.fn() };

// Lecture différée de l'état (jest.mock est remonté au-dessus des déclarations).
jest.mock("@/lib/runtime-env", () => ({
  isCloudflareWorkers: () => (globalThis as unknown as { __qaMesure?: { workers: boolean } }).__qaMesure?.workers === true,
}));
jest.mock("@opennextjs/cloudflare", () => ({
  getCloudflareContext: () => {
    const e = (globalThis as unknown as { __qaMesure: EtatQa }).__qaMesure;
    if (!e.contexte) throw new Error("hors requête");
    return { env: e.liaison ? { WIDGET_AFFICHAGES: { writeDataPoint: e.writeDataPoint } } : {}, ctx: { waitUntil: jest.fn() } };
  },
}));
jest.mock("@/config/widget-vanne-du-jour", () => ({
  ...jest.requireActual("@/config/widget-vanne-du-jour"),
  WIDGET_VANNE_DU_JOUR_PUBLIE: true,
}));
jest.mock("@/lib/widget/vanne-du-jour", () => ({
  ...jest.requireActual("@/lib/widget/vanne-du-jour"),
  getWidgetVanneDuJour: jest.fn(async () => ({
    type: "vanne",
    date: "2026-10-24",
    amorce: "Amorce de test.",
    chute: "Chute de test.",
    fichePath: "/vannes/test-abc",
  })),
}));

import { readFileSync } from "fs";
import { join } from "path";
import { compterAffichage, WIDGET_AE_BINDING } from "@/lib/widget/mesure";
import { GET as embedGET } from "@/app/embed/vanne-du-jour/route";

const UA_VISITEUR = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Version/17.0 Mobile/15E148 Safari/604.1";
const IP_VISITEUR = "203.0.113.77";
let fetchMock: jest.Mock;
let consoleSpies: jest.SpyInstance[];
let write: jest.Mock;

beforeEach(() => {
  etat().workers = true;
  etat().contexte = true;
  etat().liaison = true;
  write = etat().writeDataPoint;
  write.mockReset();
  fetchMock = jest.fn(async () => new Response("{}", { status: 200 }));
  (globalThis as { fetch: unknown }).fetch = fetchMock;
  consoleSpies = (["log", "info", "warn", "error", "debug"] as const).map((m) => jest.spyOn(console, m).mockImplementation(() => {}));
});
afterEach(() => consoleSpies.forEach((s) => s.mockRestore()));

function requete(referer: string | null, extra: Record<string, string> = {}) {
  const headers: Record<string, string> = { "user-agent": UA_VISITEUR, "x-forwarded-for": IP_VISITEUR, "cf-connecting-ip": IP_VISITEUR, cookie: "session=secret", ...extra };
  if (referer) headers.referer = referer;
  return new Request("https://deviens-marrant.fr/embed/vanne-du-jour?theme=sombre", { headers });
}

describe("mesure du widget sous Workers (QA tour 2, Analytics Engine en itération 3)", () => {
  it("page d'iframe : un seul point écrit, domaine seul, rien du visiteur, aucun appel réseau", async () => {
    const res = await embedGET(requete("https://www.blog-hote.fr/articles/ma-page-privee?email=jean%40exemple.fr#x"));
    expect(res.status).toBe(200);
    expect(write).toHaveBeenCalledTimes(1);
    expect(write.mock.calls[0]).toEqual([{ blobs: ["blog-hote.fr"], indexes: ["blog-hote.fr"] }]);
    const point = JSON.stringify(write.mock.calls[0]);
    for (const fuite of [IP_VISITEUR, "iPhone", "Mozilla", "articles", "ma-page-privee", "email", "jean", "session", "secret", "sombre"]) expect(point).not.toContain(fuite);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("la réponse n'attend rien : écriture synchrone, non attendue, aucune promesse confiée au runtime", async () => {
    const debut = Date.now();
    const res = await embedGET(requete("https://blog-hote.fr/"));
    expect(res.status).toBe(200);
    expect(await res.text()).toContain("Amorce de test.");
    expect(Date.now() - debut).toBeLessThan(500);
    expect(write.mock.results[0].value).toBeUndefined();
  });

  it("écriture en panne (quota, erreur) : page servie, jamais d'exception ni de journal", async () => {
    write.mockImplementation(() => {
      throw new Error("quota");
    });
    const res = await embedGET(requete("https://blog-hote.fr/"));
    expect(res.status).toBe(200);
    expect(await res.text()).toContain("Amorce de test.");
    consoleSpies.forEach((s) => expect(s).not.toHaveBeenCalled());
  });

  it("liaison absente au runtime : no-op silencieux", async () => {
    etat().liaison = false;
    const res = await embedGET(requete("https://blog-hote.fr/"));
    expect(res.status).toBe(200);
    expect(write).not.toHaveBeenCalled();
    consoleSpies.forEach((s) => expect(s).not.toHaveBeenCalled());
  });

  it("aucune écriture : aperçu du site, local, workers.dev, robots, sans User-Agent", async () => {
    for (const ref of ["https://deviens-marrant.fr/integrer-la-vanne-du-jour", "https://www.deviens-marrant.fr/", "http://localhost:3000/", "http://127.0.0.1:8787/", "https://marrant.thomas.workers.dev/"]) {
      await embedGET(requete(ref));
    }
    await embedGET(requete("https://blog-hote.fr/", { "user-agent": "Mozilla/5.0 (compatible; Googlebot/2.1)" }));
    await embedGET(requete("https://blog-hote.fr/", { "user-agent": "facebookexternalhit/1.1" }));
    compterAffichage("blog-hote.fr", null);
    expect(write).not.toHaveBeenCalled();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("hors contexte de requête Workers, ou hors Workers : pas d'écriture, pas d'exception", () => {
    etat().contexte = false;
    expect(() => compterAffichage("blog-hote.fr", UA_VISITEUR)).not.toThrow();
    etat().contexte = true;
    etat().workers = false;
    expect(() => compterAffichage("blog-hote.fr", UA_VISITEUR)).not.toThrow();
    expect(write).not.toHaveBeenCalled();
  });

  it("sans Referer : compté sous « inconnu » (aucune autre donnée)", async () => {
    await embedGET(requete(null));
    expect(write.mock.calls[0][0]).toEqual({ blobs: ["inconnu"], indexes: ["inconnu"] });
  });

  it("plus aucun tiers : ni Umami ni User-Agent imité dans le code de mesure ; liaison déclarée dans wrangler.jsonc", () => {
    const code = readFileSync(join(__dirname, "../../lib/widget/mesure.ts"), "utf8");
    expect(code).not.toMatch(/umami\.is|api\/send|fetch\(|User-Agent"/);
    const wrangler = readFileSync(join(__dirname, "../../../wrangler.jsonc"), "utf8");
    expect(wrangler).toMatch(new RegExp(`"analytics_engine_datasets"[\\s\\S]*"binding": "${WIDGET_AE_BINDING}"`));
  });
});
