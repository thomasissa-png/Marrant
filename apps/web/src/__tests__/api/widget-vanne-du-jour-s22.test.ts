/**
 * @jest-environment node
 *
 * s22, widget « La vanne du jour » : sélection (liste blanche ∩ pool validé,
 * DATING/SOIREES/COUPLE refusées, choix déterministe), API (503 sans vanne,
 * 403 domaine bloqué, aucun champ interdit, CORS, cache) et page d'iframe
 * (noindex, sans cookie ni Umami côté visiteur, repli neutre en 200).
 * v2 : jour UTC (convention du site), clé de cache liée à la liste, mesure.
 */
type Row = {
  id: string;
  content: string;
  punchline: string;
  category: string;
  isActive: boolean;
  copyVerdict: string | null;
  comedyTechnique: string | null;
  techniqueExplanation: string | null;
  howToApply: string | null;
  maturityLevel: number;
  generatedByAI: boolean;
};

const row = (id: string, category: string, extra: Partial<Row> = {}): Row => ({
  id,
  content: `Amorce ${id}`,
  punchline: `Chute ${id}`,
  category,
  isActive: true,
  copyVerdict: "GARDER",
  comedyTechnique: "Technique secrète",
  techniqueExplanation: "Explication premium",
  howToApply: "Exercice premium",
  maturityLevel: 1,
  generatedByAI: true,
  ...extra,
});

let mockRows: Row[] = [];
let mockIds: string[] = [];
let mockBloques: string[] = [];
let mockPublie = true;

type Where = {
  isActive?: boolean;
  copyVerdict?: string;
  comedyTechnique?: { not: null };
  id?: { in: string[] };
  category?: { notIn: string[] };
};
const mockFindMany = jest.fn(({ where }: { where: Where }) =>
  Promise.resolve(
    mockRows
      .filter(
        (r) =>
          r.isActive === where.isActive &&
          r.copyVerdict === where.copyVerdict &&
          (where.comedyTechnique ? r.comedyTechnique !== null : true) &&
          (where.id ? where.id.in.includes(r.id) : true) &&
          (where.category ? !where.category.notIn.includes(r.category) : true),
      )
      .sort((a, b) => a.id.localeCompare(b.id)),
  ),
);
jest.mock("@/lib/prisma", () => ({ prisma: { joke: { findMany: (a: { where: Where }) => mockFindMany(a) } } }));
jest.mock("@/config/widget-vanne-du-jour", () => {
  const actual = jest.requireActual("@/config/widget-vanne-du-jour");
  return {
    ...actual,
    get WIDGET_VANNE_DU_JOUR_PUBLIE() {
      return mockPublie;
    },
    get WIDGET_JOKE_IDS() {
      return mockIds;
    },
    get DOMAINES_BLOQUES() {
      return mockBloques;
    },
  };
});

import { GET, OPTIONS } from "@/app/api/widget/v1/vanne-du-jour/route";
import { GET as GET_EMBED } from "@/app/embed/vanne-du-jour/route";
import {
  dayNumber,
  isDomaineBloque,
  pickWidgetVanne,
  secondsUntilUtcMidnight,
  widgetDateKey,
  widgetListFingerprint,
  widgetSharedMaxAge,
} from "@/lib/widget/vanne-du-jour";
import { doitCompterAffichage, pointAffichage } from "@/lib/widget/mesure";
import { readFileSync } from "fs";
import { join } from "path";

const api = (headers: Record<string, string> = {}) =>
  GET(new Request("https://deviens-marrant.fr/api/widget/v1/vanne-du-jour", { headers }));
const embed = (headers: Record<string, string> = {}, query = "") =>
  GET_EMBED(new Request(`https://deviens-marrant.fr/embed/vanne-du-jour${query}`, { headers }));

beforeEach(() => {
  mockFindMany.mockClear();
  mockPublie = true;
  mockBloques = [];
  mockRows = [row("a1", "ABSURDE"), row("b2", "BOULOT"), row("c3", "ECOLE"), row("d4", "DATING"), row("e5", "SOIREES"), row("f6", "COUPLE"), row("g7", "PARENTS", { copyVerdict: "REECRIRE" }), row("h8", "GAMING")];
  mockIds = ["a1", "b2", "c3", "d4", "e5", "f6", "g7"];
});

describe("sélection de la vanne du jour du widget", () => {
  it("liste blanche ∩ pool validé : jamais une vanne hors liste, jamais DATING/SOIREES/COUPLE ni non GARDER", async () => {
    const servies = new Set<string>();
    for (let d = 1; d <= 60; d++) {
      const v = await pickWidgetVanne(`2026-11-${String((d % 28) + 1).padStart(2, "0")}`);
      servies.add(v!.amorce.replace("Amorce ", ""));
    }
    expect([...servies].sort()).toEqual(["a1", "b2", "c3"]);
    const where = mockFindMany.mock.calls[0][0].where;
    expect(where).toMatchObject({ isActive: true, copyVerdict: "GARDER", comedyTechnique: { not: null } });
    expect(where.category).toEqual({ notIn: ["DATING", "SOIREES", "COUPLE"] });
  });

  it("déterministe : même jour, même vanne ; jours consécutifs, rotation par id", async () => {
    const a = await pickWidgetVanne("2026-11-03");
    const b = await pickWidgetVanne("2026-11-03");
    expect(a).toEqual(b);
    const n = dayNumber("2026-11-03");
    const ordre = ["a1", "b2", "c3"];
    expect(a!.amorce).toBe(`Amorce ${ordre[n % 3]}`);
    expect((await pickWidgetVanne("2026-11-04"))!.amorce).toBe(`Amorce ${ordre[(n + 1) % 3]}`);
  });

  it("liste vide → null sans requête ; liste réduite aux exclues → null", async () => {
    expect(await pickWidgetVanne("2026-11-03", [])).toBeNull();
    expect(mockFindMany).not.toHaveBeenCalled();
    expect(await pickWidgetVanne("2026-11-03", ["d4", "e5", "f6", "g7"])).toBeNull();
  });

  it("jour UTC comme la vanne du jour du site (todayUTC), cache partagé borné à minuit UTC et 1 h", () => {
    expect(widgetDateKey(new Date("2026-10-24T23:30:00Z"))).toBe("2026-10-24");
    expect(widgetDateKey(new Date("2026-10-25T00:00:00Z"))).toBe("2026-10-25");
    expect(secondsUntilUtcMidnight(new Date("2026-11-03T23:30:00Z"))).toBe(1800);
    expect(widgetSharedMaxAge(new Date("2026-11-03T23:30:00Z"))).toBe(1800);
    expect(widgetSharedMaxAge(new Date("2026-11-03T08:00:00Z"))).toBe(3600);
  });

  it("empreinte de la liste : stable, change au moindre retrait ou ajout", () => {
    expect(widgetListFingerprint(["a1", "b2"])).toMatch(/^[0-9a-f]{8}$/);
    expect(widgetListFingerprint(["a1", "b2"])).toBe(widgetListFingerprint(["a1", "b2"]));
    expect(widgetListFingerprint(["a1"])).not.toBe(widgetListFingerprint(["a1", "b2"]));
    expect(widgetListFingerprint(["a1"], ["DATING"])).not.toBe(widgetListFingerprint(["a1"], ["SOIREES"]));
  });

  it("domaines bloqués : domaine et sous-domaines, rien d'autre", () => {
    expect(isDomaineBloque("exemple.fr", ["exemple.fr"])).toBe(true);
    expect(isDomaineBloque("blog.exemple.fr", ["exemple.fr"])).toBe(true);
    expect(isDomaineBloque("pasexemple.fr", ["exemple.fr"])).toBe(false);
    expect(isDomaineBloque(null, ["exemple.fr"])).toBe(false);
  });
});

describe("GET /api/widget/v1/vanne-du-jour", () => {
  it("JSON minimal, aucun champ interdit, UTM avec le domaine hôte", async () => {
    const res = await api({ origin: "https://www.blog-hote.fr" });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(Object.keys(body).sort()).toEqual(["amorce", "attribution", "chute", "date", "license", "type", "url"]);
    expect(body.type).toBe("vanne");
    const texte = JSON.stringify(body);
    for (const interdit of ["Technique secrète", "Explication premium", "Exercice premium", "comedyTechnique", "maturityLevel", "generatedByAI", "category", "\"id\""]) {
      expect(texte).not.toContain(interdit);
    }
    const url = new URL(body.url);
    expect(url.pathname).toMatch(/^\/vannes\//);
    expect(Object.fromEntries(url.searchParams)).toEqual({ utm_source: "widget", utm_medium: "embed", utm_campaign: "vanne-du-jour", utm_content: "blog-hote.fr" });
    expect(body.attribution).toEqual({ name: "Deviens Marrant", url: "https://deviens-marrant.fr/", required: true });
  });

  it("en-têtes : CORS lecture seule, noindex, cache partagé jusqu'à minuit Paris ou 1 h", async () => {
    const res = await api();
    expect(res.headers.get("access-control-allow-origin")).toBe("*");
    expect(res.headers.get("access-control-allow-methods")).toBe("GET, OPTIONS");
    expect(res.headers.get("access-control-allow-credentials")).toBeNull();
    expect(res.headers.get("x-robots-tag")).toBe("noindex");
    expect(res.headers.get("set-cookie")).toBeNull();
    const sMaxAge = Number(/s-maxage=(\d+)/.exec(res.headers.get("cache-control") ?? "")![1]);
    expect(sMaxAge).toBeGreaterThan(0);
    expect(sMaxAge).toBeLessThanOrEqual(3600);
    expect(new URL((await res.json()).url).searchParams.get("utm_content")).toBe("inconnu");
    expect((await OPTIONS()).status).toBe(204);
  });

  it("liste vide → 503 propre, jamais une vanne", async () => {
    mockIds = [];
    const res = await api();
    expect(res.status).toBe(503);
    expect(res.headers.get("retry-after")).toBe("3600");
    const body = await res.json();
    expect(body).toEqual({ type: "vanne", error: "indisponible" });
  });

  it("aucune vanne encore valide → 503", async () => {
    mockIds = ["d4", "g7"];
    expect((await api()).status).toBe(503);
  });

  it("base en erreur → 503, pas de 500", async () => {
    mockFindMany.mockRejectedValueOnce(new Error("db"));
    expect((await api()).status).toBe(503);
  });

  it("non publié → 503", async () => {
    mockPublie = false;
    expect((await api()).status).toBe(503);
    expect(mockFindMany).not.toHaveBeenCalled();
  });

  it("domaine bloqué (Origin ou Referer) → 403 sans vanne", async () => {
    mockBloques = ["site-bloque.fr"];
    const cas: Record<string, string>[] = [{ origin: "https://site-bloque.fr" }, { referer: "https://www.site-bloque.fr/page" }];
    for (const h of cas) {
      const res = await api(h);
      expect(res.status).toBe(403);
      expect(JSON.stringify(await res.json())).not.toContain("Amorce");
    }
  });
});

describe("GET /embed/vanne-du-jour", () => {
  it("noindex, sans cookie, sans Umami, sans gabarit du site, liens de marque et de fiche", async () => {
    const res = await embed();
    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toContain("text/html");
    expect(res.headers.get("set-cookie")).toBeNull();
    const html = await res.text();
    expect(html).toContain('<meta name="robots" content="noindex">');
    expect(html).not.toContain('rel="canonical"');
    expect(html).not.toMatch(/umami|_next|application\/ld\+json/i);
    expect(html).toContain('lang="fr"');
    expect(html).toContain(">Révéler la chute</button>");
    expect(html).toMatch(/<a class="marque" data-utm href="https:\/\/deviens-marrant\.fr\/\?utm_source=widget[^"]*" target="_blank" rel="noopener">Deviens Marrant/);
    expect(html).toMatch(/href="https:\/\/deviens-marrant\.fr\/vannes\/[^"]+" target="_blank" rel="noopener">Pourquoi ça marche/);
    // Lien de marque dans le pied ancré (jamais hors du cadre), schéma de couleurs déclaré.
    expect(html).toMatch(/<footer class="pied">.*Deviens Marrant.*<\/footer><\/main>/);
    expect(html).toContain('<meta name="color-scheme" content="light dark">');
    expect(html).not.toContain("Technique secrète");
    expect(html).not.toContain("—");
    expect(Buffer.byteLength(html)).toBeLessThan(8000);
  });

  it("thème : liste blanche (auto par défaut)", async () => {
    expect(await (await embed({}, "?theme=clair")).text()).toContain('class="t-clair"');
    expect(await (await embed({}, "?theme=<script>")).text()).toContain('class="t-auto"');
  });

  it("échappe le texte de la vanne", async () => {
    mockRows = [row("a1", "ABSURDE", { content: '<img src=x onerror="alert(1)">' })];
    mockIds = ["a1"];
    const html = await (await embed()).text();
    expect(html).not.toContain("<img");
    expect(html).toContain("&lt;img");
  });

  it("liste vide ou non publié → repli neutre sans vanne ni phrase non validée, en 200 (aucune erreur chez l'hôte)", async () => {
    for (const regler of [() => (mockIds = []), () => (mockPublie = false)]) {
      regler();
      const res = await embed();
      expect(res.status).toBe(200);
      const html = await res.text();
      expect(html).not.toContain("Amorce");
      expect(html).not.toContain("Révéler la chute");
      expect(html).not.toMatch(/revient/);
      expect(html).toContain('class="repli"');
      expect(html).toContain("Deviens Marrant");
    }
  });

  it("domaine bloqué (Referer, point final, sous-domaine) → page neutre sans vanne, jamais en cache partagé", async () => {
    mockBloques = ["site-bloque.fr"];
    for (const referer of ["https://blog.site-bloque.fr/", "https://site-bloque.fr./page"]) {
      const r = await embed({ referer });
      expect(r.status).toBe(200);
      expect(await r.text()).not.toContain("Amorce");
    }
    const res = await embed({ referer: "https://blog.site-bloque.fr/" });
    expect(res.headers.get("cache-control")).toBe("private, no-store");
    expect(await res.text()).not.toContain("Amorce");
    expect((await embed({ referer: "https://autre-site.fr/" })).status).toBe(200);
  });
});

describe("liste blanche réelle (selection-finale.md)", () => {
  const IDS_REELS: readonly string[] = jest.requireActual("@/config/widget-vanne-du-jour").WIDGET_JOKE_IDS;
  it("93 identifiants distincts, au-dessus du plancher de 90", () => {
    expect(IDS_REELS).toHaveLength(93);
    expect(new Set(IDS_REELS).size).toBe(93);
  });
});

describe("mesure des affichages (Analytics Engine)", () => {
  const UA = "Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 Chrome/130 Safari/537.36";
  it("compte les hôtes tiers, jamais le site (aperçu), le local ni les robots", () => {
    expect(doitCompterAffichage("blog-hote.fr", UA)).toBe(true);
    expect(doitCompterAffichage(null, UA)).toBe(true);
    for (const h of ["deviens-marrant.fr", "localhost", "127.0.0.1", "marrant.thomas.workers.dev"]) expect(doitCompterAffichage(h, UA)).toBe(false);
    expect(doitCompterAffichage("blog-hote.fr", "Googlebot/2.1")).toBe(false);
    expect(doitCompterAffichage("blog-hote.fr", "Mozilla/5.0 HeadlessChrome/130")).toBe(false);
    expect(doitCompterAffichage("blog-hote.fr", null)).toBe(false);
  });

  it("point de données : le domaine hôte seulement", () => {
    expect(pointAffichage("blog-hote.fr")).toEqual({ blobs: ["blog-hote.fr"], indexes: ["blog-hote.fr"] });
    expect(pointAffichage(null)).toEqual({ blobs: ["inconnu"], indexes: ["inconnu"] });
    expect(pointAffichage("a".repeat(200)).indexes[0]).toHaveLength(96);
  });

  it("hors Workers (tests, Node) : aucun appel réseau, la réponse ne dépend pas de la mesure", async () => {
    const fetchSpy = jest.spyOn(globalThis, "fetch");
    const res = await embed({ referer: "https://blog-hote.fr/", "user-agent": UA });
    expect(res.status).toBe(200);
    expect(fetchSpy).not.toHaveBeenCalled();
    fetchSpy.mockRestore();
  });
});

describe("hauteur selon la largeur (revue @design v2, N1)", () => {
  const cfg = jest.requireActual("@/config/widget-vanne-du-jour");
  it("même courbe dans les deux gabarits et widget.js, repli 420 px avant la courbe", () => {
    const courbe = cfg.WIDGET_IFRAME_HEIGHT_CSS as string;
    expect(courbe).toBe("clamp(340px,calc(340px + (672px - 100vw) * .6),560px)");
    expect(cfg.widgetIframeSnippet()).toContain(`height:420px;height:${courbe}`);
    expect(cfg.widgetScriptSnippet()).toContain(`min-height:420px;min-height:${courbe}`);
    const js = readFileSync(join(__dirname, "../../../public/widget.js"), "utf8");
    expect(js).toContain(`height:420px;height:${courbe}`);
    expect(js).toContain('"height", "420"');
  });
});

describe("répartition du vide et révélation sans mouvement (revue @design v3)", () => {
  it("entretoises 2:3 dans la zone de la vanne, chute et bouton dans la même cellule", async () => {
    const html = await (await embed()).text();
    expect(html).toContain('.k::before{content:"";flex:2 1 0}.k::after{content:"";flex:3 1 0}');
    expect(html).toMatch(/<div class="cellule"><p id="c" class="chute" tabindex="-1">[^<]*<\/p><button id="b"/);
    // La chute est cachée mais en place avant le clic (visibility), jamais retirée du flux.
    expect(html).toContain(".js .chute{visibility:hidden}");
    expect(html).not.toContain(".js .chute,.js .pourquoi{display:none}");
  });
});
