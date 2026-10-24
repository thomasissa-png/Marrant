/**
 * @jest-environment node
 *
 * QA indépendante s22 (docs/qa/qa-widget-s22-v1.md), widget « La vanne du jour » :
 * données toxiques (XSS dans la vanne, le Referer, le thème), domaines bloqués aux
 * bornes, double garde des catégories exclues, champs publics, cohérence de
 * public/widget.js avec la configuration, cache edge.
 * Les `it.failing` décrivent un défaut ouvert : ils passent tant que le défaut
 * existe et cassent quand il est corrigé (retirer alors `.failing`).
 */
import { readFileSync } from "fs";
import path from "path";
import { gzipSync } from "zlib";

type Row = { id: string; content: string; punchline: string; category: string; [k: string]: unknown };
let mockRows: Row[] = [];
let mockIds: string[] = [];
let mockPublie = true;
// Prisma simulé qui IGNORE le filtre : seule la double garde du code protège.
const mockFindMany = jest.fn(() => Promise.resolve([...mockRows].sort((a, b) => a.id.localeCompare(b.id))));
jest.mock("@/lib/prisma", () => ({ prisma: { joke: { findMany: () => mockFindMany() } } }));
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
  };
});

import { GET } from "@/app/api/widget/v1/vanne-du-jour/route";
import { GET as GET_EMBED } from "@/app/embed/vanne-du-jour/route";
import { renderEmbedVanne, EMBED_INLINE_SCRIPT } from "@/lib/widget/embed-html";
import { getWidgetVanneDuJour, hostFromHeader, isDomaineBloque, parisDateKey, pickWidgetVanne } from "@/lib/widget/vanne-du-jour";
import {
  WIDGET_EMBED_PATH,
  WIDGET_IFRAME_HEIGHT,
  WIDGET_IFRAME_SANDBOX,
  WIDGET_IFRAME_TITLE,
  widgetScriptSnippet,
} from "@/config/widget-vanne-du-jour";

const TOXIQUES = [
  `<img src=x onerror=alert(1)>`,
  `<svg onload=alert(2)>`,
  `&#x3C;script&#x3E;alert(3)&#x3C;/script&#x3E;`,
  `</script><script>alert(4)</script>`,
  `<math><mtext></p><img src=x onerror=alert(5)>`,
  `" onmouseover="alert(6)`,
];

beforeEach(() => {
  mockFindMany.mockClear();
  mockPublie = true;
  mockRows = [];
  mockIds = [];
  delete (globalThis as { caches?: unknown }).caches;
});

describe("XSS : contenu de la vanne, Referer, thème", () => {
  it.each(TOXIQUES)("vecteur %s : aucune balise ni attribut injecté", (v) => {
    const html = renderEmbedVanne({ type: "vanne", date: "2026-10-24", amorce: v, chute: v, fichePath: `/vannes/x${v}` });
    expect(html.match(/<script>/g)).toHaveLength(1);
    expect(html).toContain(`<script>${EMBED_INLINE_SCRIPT}</script>`);
    expect(html).not.toMatch(/<(img|svg|math|mtext)\b/i);
    expect(html).not.toMatch(/<[^>]*\son\w+\s*=/i); // attribut d\'événement DANS une balise
    // Les href restent des URL du site, sans guillemet libre.
    for (const href of html.match(/href="[^"]*"/g) ?? []) expect(href).toMatch(/^href="https:\/\/deviens-marrant\.fr\//);
  });

  it("Referer et thème hostiles : page servie identique au repli neutre, sans écho", async () => {
    mockPublie = false;
    const res = await GET_EMBED(
      new Request(`https://deviens-marrant.fr${WIDGET_EMBED_PATH}?theme=%22%3E%3Csvg%20onload%3Dalert(1)%3E`, {
        headers: { referer: `https://evil.example/"><script>alert(1)</script>` },
      }),
    );
    const html = await res.text();
    expect(html).toContain('class="t-auto"');
    expect(html).not.toMatch(/evil|alert|<svg/);
    expect(res.headers.get("set-cookie")).toBeNull();
  });

  it("hostFromHeader : schémas et formes hostiles → null ou domaine nu", () => {
    expect(hostFromHeader("javascript:alert(1)")).toBeNull();
    expect(hostFromHeader("data:text/html,<b>")).toBeNull();
    expect(hostFromHeader("null")).toBeNull();
    expect(hostFromHeader("pas une url")).toBeNull();
    expect(hostFromHeader("https://WWW.Exemple.FR:8443/a?b#c")).toBe("exemple.fr");
    expect(hostFromHeader("https://exémple.fr/")).toBe("xn--exmple-cva.fr");
  });
});

describe("domaines bloqués aux bornes", () => {
  const liste = ["exemple.fr"];
  it("ni préfixe, ni suffixe trompeur", () => {
    expect(isDomaineBloque("evilexemple.fr", liste)).toBe(false);
    expect(isDomaineBloque("exemple.fr.evil.com", liste)).toBe(false);
    expect(isDomaineBloque("a.b.exemple.fr", liste)).toBe(true);
    expect(isDomaineBloque(hostFromHeader("https://WWW.EXEMPLE.fr/x"), liste)).toBe(true);
  });
  // DÉFAUT QA s22 (mineur) : le point final du FQDN contourne le blocage.
  it.failing("« exemple.fr. » (FQDN avec point final) est bloqué", () => {
    expect(isDomaineBloque(hostFromHeader("https://exemple.fr./"), liste)).toBe(true);
  });
});

describe("sélection : double garde et champs publics", () => {
  it("base qui ignore le filtre : jamais DATING, SOIREES, COUPLE même en liste blanche", async () => {
    mockRows = ["DATING", "SOIREES", "COUPLE"].map((c, i) => ({ id: `x${i}`, content: "A", punchline: "B", category: c }));
    mockIds = mockRows.map((r) => r.id);
    for (const day of ["2026-10-24", "2026-10-25", "2026-10-26"]) expect(await pickWidgetVanne(day, mockIds)).toBeNull();
  });

  it("API : exactement 7 champs, rien de la ligne Joke même si la base renvoie tout", async () => {
    mockRows = [{ id: "a1", content: "Amorce", punchline: "Chute", category: "BOULOT", techniqueExplanation: "PREMIUM", howToApply: "PREMIUM", comedyTechnique: "TECH", videoUrl: "VIDEO", copyVerdict: "GARDER", isPremium: true }];
    mockIds = ["a1"];
    const res = await GET(new Request("https://deviens-marrant.fr/api/widget/v1/vanne-du-jour"));
    const body = await res.json();
    expect(Object.keys(body).sort()).toEqual(["amorce", "attribution", "chute", "date", "license", "type", "url"]);
    expect(JSON.stringify(body)).not.toMatch(/PREMIUM|TECH|VIDEO|GARDER|a1"/);
  });

  it("jour de Paris : bascule à minuit Paris (22:00 UTC en heure d'été), pas à minuit UTC", () => {
    expect(parisDateKey(new Date("2026-10-24T21:59:59Z"))).toBe("2026-10-24");
    expect(parisDateKey(new Date("2026-10-24T22:00:00Z"))).toBe("2026-10-25");
    expect(parisDateKey(new Date("2026-12-31T23:00:00Z"))).toBe("2027-01-01");
  });
});

describe("cache edge (Cache API)", () => {
  function fauxCache() {
    const store = new Map<string, string>();
    (globalThis as { caches?: unknown }).caches = {
      default: {
        match: async (k: Request) => (store.has(k.url) ? new Response(store.get(k.url)) : undefined),
        put: async (k: Request, r: Response) => void store.set(k.url, await r.text()),
      },
    };
  }

  // DÉFAUT QA s22 (majeur) : clé = jour seulement. Une vanne retirée en urgence de
  // WIDGET_JOKE_IDS (redéploiement) reste servie jusqu'à minuit Paris par chaque
  // point de présence qui l'a déjà en cache (caches.default survit aux déploiements).
  it.failing("une vanne retirée de la liste blanche n'est plus servie le jour même", async () => {
    fauxCache();
    const now = new Date("2026-10-24T10:00:00Z");
    mockRows = [{ id: "a1", content: "Vanne retirée", punchline: "Chute", category: "BOULOT" }];
    mockIds = ["a1"];
    expect((await getWidgetVanneDuJour(now))?.amorce).toBe("Vanne retirée");
    mockRows = [{ id: "b2", content: "Vanne sûre", punchline: "Chute", category: "BOULOT" }];
    mockIds = ["b2"];
    expect((await getWidgetVanneDuJour(now))?.amorce).toBe("Vanne sûre");
  });
});

describe("public/widget.js", () => {
  const src = readFileSync(path.join(__dirname, "../../../public/widget.js"), "utf8");

  it("moins de 2 Ko, sans API dangereuse ni stockage", () => {
    expect(Buffer.byteLength(src)).toBeLessThan(2048);
    expect(gzipSync(src).length).toBeLessThan(1024);
    expect(src).not.toMatch(/innerHTML|outerHTML|document\.write|eval\(|new Function|cookie|localStorage|sessionStorage|fetch\(|XMLHttpRequest/);
  });

  it("mêmes titre, hauteur, sandbox et chemin que la configuration (code dupliqué)", () => {
    expect(src).toContain(`f.title = "${WIDGET_IFRAME_TITLE}"`);
    expect(src).toContain(`"height", "${WIDGET_IFRAME_HEIGHT}"`);
    expect(src).toContain(`height:${WIDGET_IFRAME_HEIGHT}px`);
    expect(src).toContain(`"sandbox", "${WIDGET_IFRAME_SANDBOX}"`);
    expect(src).toContain(`"${WIDGET_EMBED_PATH}"`);
    expect(WIDGET_IFRAME_SANDBOX).not.toContain("allow-same-origin");
  });

  // DÉFAUT QA s22 (majeur) : le format B insère 240 px sans place réservée. Mesuré
  // sous Chromium (banc QA, hôte simple) : décalage de mise en page 0,094 à 1 280 px
  // et 0,309 à 375 px, sans interaction (CLS « mauvais » au-delà de 0,25).
  it.failing("le code à copier du format B réserve la hauteur avant l'exécution du script", () => {
    expect(widgetScriptSnippet()).toMatch(new RegExp(`(min-)?height:\\s*${WIDGET_IFRAME_HEIGHT}px`));
  });

  it("n'accepte la hauteur que de sa propre iframe, bornée", () => {
    expect(src).toContain("e.source !== f.contentWindow");
    expect(src).toMatch(/h <= 900/);
  });
});
