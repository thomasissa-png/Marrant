/**
 * @jest-environment node
 *
 * QA indépendante tour 2 (s22) : mesure des affichages du widget
 * (`src/lib/widget/mesure.ts`) sur le chemin Workers, que les tests @fullstack
 * ne couvrent pas (ils restent hors Workers, donc sans envoi).
 * Vérifie : aucune donnée du visiteur (IP, User-Agent, Referer complet, chemin
 * de l'hôte), réponse jamais retardée, Umami lent ou en panne sans effet,
 * erreurs avalées sans journal, aucun envoi pour l'aperçu, le local, les robots.
 */
type EtatQa = { workers: boolean; contexte: boolean; waitUntil: jest.Mock };
const etat = (): EtatQa => (globalThis as unknown as { __qaMesure: EtatQa }).__qaMesure;
(globalThis as unknown as { __qaMesure: EtatQa }).__qaMesure = { workers: false, contexte: true, waitUntil: jest.fn() };

// Lecture différée de l'état (jest.mock est remonté au-dessus des déclarations).
jest.mock("@/lib/runtime-env", () => ({
  isCloudflareWorkers: () => (globalThis as unknown as { __qaMesure?: { workers: boolean } }).__qaMesure?.workers === true,
}));
jest.mock("@opennextjs/cloudflare", () => ({
  getCloudflareContext: () => {
    const e = (globalThis as unknown as { __qaMesure: { contexte: boolean; waitUntil: jest.Mock } }).__qaMesure;
    if (!e.contexte) throw new Error("hors requête");
    return { ctx: { waitUntil: e.waitUntil } };
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

import { compterAffichage, envoyerAffichage, UMAMI_SEND_URL, WIDGET_MESURE_USER_AGENT } from "@/lib/widget/mesure";
import { GET as embedGET } from "@/app/embed/vanne-du-jour/route";

const ID = "0a1b2c3d-1111-2222-3333-444455556666";
const UA_VISITEUR = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Version/17.0 Mobile/15E148 Safari/604.1";
const IP_VISITEUR = "203.0.113.77";
const envAvant = { ...process.env };
let fetchMock: jest.Mock;
let consoleSpies: jest.SpyInstance[];

let waitUntil: jest.Mock;
beforeEach(() => {
  etat().workers = true;
  etat().contexte = true;
  waitUntil = etat().waitUntil;
  waitUntil.mockReset();
  process.env.UMAMI_WEBSITE_ID = ID;
  fetchMock = jest.fn(async () => new Response("{}", { status: 200 }));
  (globalThis as { fetch: unknown }).fetch = fetchMock;
  consoleSpies = (["log", "info", "warn", "error", "debug"] as const).map((m) => jest.spyOn(console, m).mockImplementation(() => {}));
});
afterEach(() => {
  process.env = { ...envAvant };
  consoleSpies.forEach((s) => s.mockRestore());
});

function requete(referer: string | null, extra: Record<string, string> = {}) {
  const headers: Record<string, string> = { "user-agent": UA_VISITEUR, "x-forwarded-for": IP_VISITEUR, "cf-connecting-ip": IP_VISITEUR, cookie: "session=secret", ...extra };
  if (referer) headers.referer = referer;
  return new Request("https://deviens-marrant.fr/embed/vanne-du-jour?theme=sombre", { headers });
}

describe("mesure du widget sous Workers (QA tour 2)", () => {
  it("page d'iframe : un seul envoi via waitUntil, domaine seul, rien du visiteur", async () => {
    const res = await embedGET(requete("https://www.blog-hote.fr/articles/ma-page-privee?email=jean%40exemple.fr#x"));
    expect(res.status).toBe(200);
    expect(waitUntil).toHaveBeenCalledTimes(1);
    await waitUntil.mock.calls[0][0];
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe(UMAMI_SEND_URL);
    expect(init.method).toBe("POST");
    expect(init.headers).toEqual({ "Content-Type": "application/json", "User-Agent": WIDGET_MESURE_USER_AGENT });
    const corps = init.body as string;
    expect(JSON.parse(corps).payload).toEqual({
      website: ID,
      hostname: "blog-hote.fr",
      url: "/embed/vanne-du-jour",
      language: "fr",
      name: "widget-affichage",
      data: { domaine: "blog-hote.fr", theme: "sombre" },
    });
    for (const fuite of [IP_VISITEUR, "iPhone", "articles", "ma-page-privee", "email", "jean", "session", "secret"]) expect(corps).not.toContain(fuite);
  });

  it("la réponse n'attend jamais Umami (envoi suspendu indéfiniment)", async () => {
    fetchMock.mockImplementation(() => new Promise(() => {}));
    const debut = Date.now();
    const res = await embedGET(requete("https://blog-hote.fr/"));
    expect(res.status).toBe(200);
    expect(await res.text()).toContain("Amorce de test.");
    expect(Date.now() - debut).toBeLessThan(500);
    expect(waitUntil).toHaveBeenCalledTimes(1);
  });

  it("Umami lent : envoi abandonné par le délai (5 s), résolu à false, sans journal", async () => {
    const timeoutSpy = jest.spyOn(AbortSignal, "timeout");
    timeoutSpy.mockImplementationOnce(() => {
      const c = new AbortController();
      setTimeout(() => c.abort(new DOMException("délai", "TimeoutError")), 20);
      return c.signal;
    });
    fetchMock.mockImplementation((_u: string, init: RequestInit) => new Promise((_r, rej) => init.signal!.addEventListener("abort", () => rej(init.signal!.reason))));
    await expect(envoyerAffichage(ID, "blog-hote.fr", "auto")).resolves.toBe(false);
    expect(timeoutSpy).toHaveBeenCalledWith(5000);
    timeoutSpy.mockRestore();
    consoleSpies.forEach((s) => expect(s).not.toHaveBeenCalled());
  });

  it("Umami en panne (réseau, 500, 403) : false, jamais d'exception ni de journal", async () => {
    fetchMock.mockRejectedValueOnce(new TypeError("fetch failed"));
    await expect(envoyerAffichage(ID, "blog-hote.fr", "auto")).resolves.toBe(false);
    for (const status of [500, 403, 429]) {
      fetchMock.mockResolvedValueOnce(new Response("non", { status }));
      await expect(envoyerAffichage(ID, "blog-hote.fr", "auto")).resolves.toBe(false);
    }
    consoleSpies.forEach((s) => expect(s).not.toHaveBeenCalled());
  });

  it("aucun envoi : aperçu du site, local, workers.dev, robots, sans User-Agent, identifiant absent ou factice", async () => {
    for (const ref of ["https://deviens-marrant.fr/integrer-la-vanne-du-jour", "https://www.deviens-marrant.fr/", "http://localhost:3000/", "http://127.0.0.1:8787/", "https://marrant.thomas.workers.dev/"]) {
      await embedGET(requete(ref));
    }
    await embedGET(requete("https://blog-hote.fr/", { "user-agent": "Mozilla/5.0 (compatible; Googlebot/2.1)" }));
    await embedGET(requete("https://blog-hote.fr/", { "user-agent": "facebookexternalhit/1.1" }));
    compterAffichage("blog-hote.fr", null, "auto");
    process.env.UMAMI_WEBSITE_ID = "";
    process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx";
    compterAffichage("blog-hote.fr", UA_VISITEUR, "auto");
    expect(waitUntil).not.toHaveBeenCalled();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("hors contexte de requête Workers : pas d'envoi, pas d'exception", () => {
    etat().contexte = false;
    expect(() => compterAffichage("blog-hote.fr", UA_VISITEUR, "auto")).not.toThrow();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("sans Referer : compté sous « inconnu » (aucune autre donnée)", async () => {
    await embedGET(requete(null));
    await waitUntil.mock.calls[0][0];
    expect(JSON.parse(fetchMock.mock.calls[0][1].body).payload.data).toEqual({ domaine: "inconnu", theme: "sombre" });
  });

  it("le User-Agent fixe n'est pas reconnu comme robot par le filtre du widget lui-même", () => {
    const { doitCompterAffichage } = jest.requireActual("@/lib/widget/mesure");
    expect(doitCompterAffichage("blog-hote.fr", WIDGET_MESURE_USER_AGENT)).toBe(true);
  });
});
