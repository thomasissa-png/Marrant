/**
 * @jest-environment node
 *
 * s22, widget « La vanne du jour » : sélection (liste blanche ∩ pool validé,
 * DATING/SOIREES/COUPLE refusées, choix déterministe), API (503 sans vanne,
 * 403 domaine bloqué, aucun champ interdit, CORS, cache) et page d'iframe
 * (noindex, sans cookie ni Umami, repli neutre).
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
import { dayNumber, isDomaineBloque, parisDateKey, pickWidgetVanne, secondsUntilParisMidnight } from "@/lib/widget/vanne-du-jour";

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

  it("jour et minuit de Paris (heure d'hiver et d'été)", () => {
    expect(parisDateKey(new Date("2026-11-03T23:30:00Z"))).toBe("2026-11-04");
    expect(secondsUntilParisMidnight(new Date("2026-11-03T22:00:00Z"))).toBe(3600);
    expect(secondsUntilParisMidnight(new Date("2026-07-01T21:30:00Z"))).toBe(1800);
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
    expect(html).toMatch(/<a data-utm href="https:\/\/deviens-marrant\.fr\/\?utm_source=widget[^"]*" target="_blank" rel="noopener">Deviens Marrant/);
    expect(html).toMatch(/href="https:\/\/deviens-marrant\.fr\/vannes\/[^"]+" target="_blank" rel="noopener">Pourquoi ça marche/);
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

  it("liste vide → repli neutre sans vanne (503)", async () => {
    mockIds = [];
    const res = await embed();
    expect(res.status).toBe(503);
    const html = await res.text();
    expect(html).not.toContain("Amorce");
    expect(html).not.toContain("Révéler la chute");
    expect(html).toContain("Deviens Marrant");
  });

  it("domaine bloqué (Referer) → page neutre sans vanne (403), jamais en cache partagé", async () => {
    mockBloques = ["site-bloque.fr"];
    const res = await embed({ referer: "https://blog.site-bloque.fr/" });
    expect(res.status).toBe(403);
    expect(res.headers.get("cache-control")).toBe("private, no-store");
    expect(await res.text()).not.toContain("Amorce");
    expect((await embed({ referer: "https://autre-site.fr/" })).status).toBe(200);
  });
});
