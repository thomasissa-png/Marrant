/**
 * s22 (24/10/2026, décision Thomas, dernière ligne de docs/founder-preferences.md) :
 * ligne de backlink en HTML normal APRÈS le cadre, dans les deux codes à copier
 * (iframe et script, thèmes auto, clair et sombre). Lien suivi (aucun `rel`),
 * ancre de marque seule, vers l'accueil, sans UTM. Pour le script : après le
 * `<div>` conteneur, pas dedans (présente sans JavaScript).
 * La ligne attendue est recopiée ici, pas importée : toute dérive casse le test.
 */
import { WIDGET_ORIGIN, widgetIframeSnippet, widgetScriptSnippet } from "@/config/widget-vanne-du-jour";

const LIGNE =
  '<p style="margin:6px 0 0;font:13px/1.4 system-ui,sans-serif">La vanne du jour par <a href="https://deviens-marrant.fr/">Deviens Marrant</a></p>';
const THEMES = [undefined, "clair", "sombre"] as const;

function parse(html: string): HTMLElement {
  const doc = new DOMParser().parseFromString(`<!doctype html><body>${html}</body>`, "text/html");
  return doc.body;
}

describe.each([
  ["iframe", widgetIframeSnippet, "IFRAME"],
  ["script", widgetScriptSnippet, "DIV"],
] as const)("code à copier (%s) : ligne de backlink", (_nom, gabarit, cadre) => {
  it.each(THEMES)("thème %s : ligne exacte, en dernier, juste après le cadre", (theme) => {
    const code = gabarit(WIDGET_ORIGIN, theme);
    expect(code.endsWith(LIGNE)).toBe(true);
    expect(code.split(LIGNE)).toHaveLength(2);
    const body = parse(code);
    const enfants = [...body.children];
    expect(enfants.map((e) => e.tagName)).toEqual([cadre, "P"]);
    expect(enfants[1].previousElementSibling).toBe(enfants[0]);
  });

  it.each(THEMES)("thème %s : lien suivi (aucun rel), ancre « Deviens Marrant », href = accueil sans UTM", (theme) => {
    const body = parse(gabarit(WIDGET_ORIGIN, theme));
    const liens = [...body.querySelectorAll("a")];
    expect(liens).toHaveLength(1);
    const a = liens[0];
    expect(a.hasAttribute("rel")).toBe(false);
    expect(a.hasAttribute("target")).toBe(false);
    expect(a.textContent).toBe("Deviens Marrant");
    expect(a.getAttribute("href")).toBe("https://deviens-marrant.fr/");
    expect(a.getAttribute("href")).not.toMatch(/[?#]/);
    expect(a.parentElement!.textContent).toBe("La vanne du jour par Deviens Marrant");
  });
});

it("script : la ligne est HORS du conteneur (présente sans JavaScript)", () => {
  const body = parse(widgetScriptSnippet());
  const div = body.querySelector("div")!;
  expect(div.querySelector("p, a")).toBeNull();
  expect(div.children).toHaveLength(1);
  expect(div.firstElementChild!.tagName).toBe("SCRIPT");
  expect(div.nextElementSibling!.tagName).toBe("P");
});

it("les URL suivent l'origine passée (environnement de test)", () => {
  const o = "http://localhost:5089";
  for (const code of [widgetIframeSnippet(o), widgetScriptSnippet(o, "sombre")]) {
    expect(parse(code).querySelector("p a")!.getAttribute("href")).toBe(`${o}/`);
  }
});

it("aucun tiret cadratin dans les codes à copier", () => {
  for (const t of THEMES) for (const code of [widgetIframeSnippet(WIDGET_ORIGIN, t), widgetScriptSnippet(WIDGET_ORIGIN, t)]) {
    expect(code).not.toContain("—");
  }
});
