/**
 * s22 : page /developers, documentation en anglais de l'API publique de la vanne
 * du jour (textes de config/textes/developers.ts, @copywriter + @legal), lien
 * depuis la page du programme.
 */
import { render, screen } from "@testing-library/react";
import { frTypo } from "@/lib/fr-typo";

// Pas de `let` : les imports (et le calcul de `metadata`) passent avant son initialisation.
type Etat = { mockWidgetPublie?: boolean };
const setPublie = (v: boolean) => ((globalThis as Etat).mockWidgetPublie = v);
jest.mock("@/config/widget-vanne-du-jour", () => {
  const actual = jest.requireActual("@/config/widget-vanne-du-jour");
  return {
    ...actual,
    get WIDGET_VANNE_DU_JOUR_PUBLIE() {
      return (globalThis as { mockWidgetPublie?: boolean }).mockWidgetPublie !== false;
    },
  };
});
jest.mock("next/navigation", () => ({
  notFound: jest.fn(() => {
    throw new Error("NEXT_NOT_FOUND");
  }),
}));

import Page, { metadata } from "@/app/(dashboard)/developers/page";
import Programme from "@/app/(dashboard)/integrer-la-vanne-du-jour/page";
import {
  CHAMPS,
  ERREURS,
  H1,
  PAGE_TITLE,
  TEXTE_CORS_CACHE,
  TEXTE_ENDPOINT,
  TEXTE_INTRO,
  TEXTE_LICENCE_CONDITIONS,
  TEXTE_LICENCE_USAGE,
  TEXTE_VIE_PRIVEE,
} from "@/config/textes/developers";

const ENDPOINT = "https://deviens-marrant.fr/api/widget/v1/vanne-du-jour";

beforeEach(() => {
  setPublie(true);
});

/** Codes (<dt><code>) de la <dl> qui suit le H2 donné. */
function codesDl(container: HTMLElement, h2: string): (string | null)[] {
  const titre = [...container.querySelectorAll("h2")].find((h) => h.textContent === h2);
  const dl = titre?.nextElementSibling;
  expect(dl?.tagName).toBe("DL");
  return [...dl!.querySelectorAll("dt code")].map((c) => c.textContent);
}

describe("page /developers", () => {
  it("H1 « French Joke of the Day API », repris par le JSON-LD WebAPI, contenu en anglais (lang=en)", () => {
    const { container } = render(<Page />);
    expect(H1).toBe("French Joke of the Day API");
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe(H1);
    expect(container.querySelector('div[lang="en"] h1')).toBeTruthy();
    const jsonLd = [...container.querySelectorAll('script[type="application/ld+json"]')].map((s) => JSON.parse(s.innerHTML));
    const api = jsonLd.find((d) => d["@type"] === "WebAPI");
    expect(api?.name).toBe(H1);
    expect(api?.isAccessibleForFree).toBe(true);
    expect(api?.offers).toEqual({ "@type": "Offer", price: 0, priceCurrency: "EUR" });
  });

  it("intro, endpoint, CORS et cache, vie privée : textes s22 v2", () => {
    const { container } = render(<Page />);
    const textes = [...container.querySelectorAll("p")].map((p) => p.textContent);
    expect(TEXTE_INTRO).toMatch(/^Free JSON API, no key, HTTPS, CORS enabled\. /);
    expect(TEXTE_ENDPOINT).toContain("no parameters. The endpoint responds to GET (JSON) and OPTIONS (CORS preflight, 204 with no body).");
    expect(TEXTE_CORS_CACHE).toContain("(the 429 below is the only exception)");
    expect(TEXTE_CORS_CACHE).toMatch(/so jokes come back over time\.$/);
    expect(TEXTE_VIE_PRIVEE).toContain("may appear in our hosting provider's technical logs.");
    expect(TEXTE_VIE_PRIVEE).not.toContain("used only to serve");
    for (const t of [TEXTE_INTRO, TEXTE_ENDPOINT, TEXTE_CORS_CACHE, TEXTE_VIE_PRIVEE]) expect(textes).toContain(t);
  });

  it("endpoint, curl -i, fetch en module avec contrôle de res.ok", () => {
    const { container } = render(<Page />);
    const codes = [...container.querySelectorAll("pre code")].map((c) => c.textContent ?? "");
    expect(codes).toContain(`GET ${ENDPOINT}`);
    expect(codes).toContain(`curl -i ${ENDPOINT}`);
    const fetchJs = codes.find((c) => c.includes("fetch("))!;
    expect(fetchJs.split("\n")[0]).toBe('// <div id="joke" lang="fr"></div> then, in a <script type="module">:');
    expect(fetchJs.split("\n")[1]).toBe("try {");
    expect(fetchJs).toContain(`await fetch("${ENDPOINT}")`);
    expect(fetchJs).toContain("  if (res.ok) {");
    expect(fetchJs).toContain("} catch {\n  // Network error or rate limit (the 429 has no CORS header): show nothing.\n}");
    expect(fetchJs).not.toContain("innerHTML");
  });

  it("les 7 champs, nom en <code>, dans l'ordre", () => {
    const { container } = render(<Page />);
    expect(codesDl(container, "Fields")).toEqual(["type", "date", "amorce", "chute", "url", "attribution", "license"]);
    expect(CHAMPS).toHaveLength(7);
    const desc = (nom: string) => CHAMPS.find((c) => c.nom === nom)?.description;
    expect(desc("type")).toBe('Always "vanne" (French for "joke") in this version. If you get another value, do not reject the response.');
    expect(desc("amorce")).toBe(
      "The setup of the joke. Plain UTF-8 text, no HTML, with French typography: it may contain curly apostrophes (’), French quotation marks (« ») and no-break spaces (U+00A0), for example before : ; ! ?, plus an invisible word joiner (U+2060) after the hyphen of some compound words. Strip U+2060 if you search, compare or read the text aloud.",
    );
    expect(desc("chute")).toBe("The punchline. Same format as amorce.");
  });

  it("renvois « License section below » : liens vers #license, texte inchangé", () => {
    const { container } = render(<Page />);
    const liens = [...container.querySelectorAll('dd a[href="#license"]')];
    expect(liens.map((a) => a.textContent)).toEqual(["License section", "License section"]);
    expect(liens.map((a) => a.closest("dd")?.textContent)).toEqual([
      CHAMPS.find((c) => c.nom === "attribution")?.description,
      CHAMPS.find((c) => c.nom === "license")?.description,
    ]);
    expect(container.querySelector("#license")).toBeTruthy();
  });

  it("erreurs en liste <dl> : 503, 403, 429 (429 venu du CDN, sans CORS ni JSON)", () => {
    const { container } = render(<Page />);
    expect(codesDl(container, "Errors")).toEqual(["503", "403", "429"]);
    expect(ERREURS.find((e) => e.code === "429")?.description).toContain("no CORS header");
    expect(ERREURS.find((e) => e.code === "503")?.description).toContain(
      '("unavailable"): no joke can be served right now. The response carries Retry-After: 3600, so wait at least an hour before trying again.',
    );
    expect(ERREURS.find((e) => e.code === "403")?.description).toContain(
      '("access denied"): the calling site, read from the Origin or Referer header, has been blocked (abuse or inappropriate content, see License and terms).',
    );
  });

  it("exemple de réponse indenté, JSON valide", () => {
    const { container } = render(<Page />);
    const json = [...container.querySelectorAll("pre code")].map((c) => c.textContent ?? "").find((c) => c.startsWith("{"));
    expect(json).toContain('\n  "type": "vanne",');
    expect(JSON.parse(json!).attribution.required).toBe(true);
  });

  it("section #license : 3 paragraphes, URL de la version française cliquable", () => {
    const { container } = render(<Page />);
    const h2 = container.querySelector("h2#license");
    expect(h2?.textContent).toBe("License and terms");
    const textes = [...container.querySelectorAll("p")].map((p) => p.textContent);
    expect(textes).toContain(TEXTE_LICENCE_USAGE);
    expect(textes).toContain(TEXTE_LICENCE_CONDITIONS);
    const foi = container.querySelector('a[href="https://deviens-marrant.fr/integrer-la-vanne-du-jour#licence"]');
    expect(foi?.textContent).toBe("https://deviens-marrant.fr/integrer-la-vanne-du-jour#licence");
  });

  it("lien interne vers le programme, contact mailto, aucune typo française, aucun tiret cadratin", () => {
    const { container } = render(<Page />);
    const widget = container.querySelector('a[href="/integrer-la-vanne-du-jour"]');
    expect(widget?.textContent).toBe("/integrer-la-vanne-du-jour");
    expect(widget?.closest("p")?.textContent).toBe(
      "A copy-and-paste widget (iframe or script tag) is available at /integrer-la-vanne-du-jour. That page is in French.",
    );
    const contact = container.querySelector('a[href="mailto:contact@deviens-marrant.fr"]');
    expect(contact?.textContent).toBe("contact@deviens-marrant.fr");
    expect(contact?.closest("p")?.textContent).toBe("Questions or problems with the API: contact@deviens-marrant.fr.");
    expect(contact?.closest("p")?.previousElementSibling).toBe(widget?.closest("p"));
    expect(container.textContent).not.toMatch(/[  ]/);
    expect(container.textContent).not.toMatch(/[—–]/);
  });

  it("metadata : titre absolu, canonical /developers (liens ?ref= d'annuaire), og en_US", () => {
    expect(metadata.title).toEqual({ absolute: PAGE_TITLE });
    expect(metadata.alternates?.canonical).toBe("/developers");
    expect(metadata.robots).toBeUndefined();
    expect(metadata.openGraph).toMatchObject({ locale: "en_US", url: "https://deviens-marrant.fr/developers" });
  });

  it("widget fermé → notFound()", () => {
    setPublie(false);
    expect(() => Page()).toThrow("NEXT_NOT_FOUND");
  });
});

describe("page du programme : lien vers /developers", () => {
  it("phrase après le paragraphe de l'API, avant la licence, hrefLang en", () => {
    const { container } = render(<Programme />);
    const lien = container.querySelector('a[href="/developers"]')!;
    expect(lien.getAttribute("hreflang")).toBe("en");
    expect(lien.textContent).toBe(frTypo("Documentation de l'API (en anglais)"));
    const p = lien.closest("p")!;
    expect(p.textContent).toBe(frTypo("Toute la documentation est sur la page ") + frTypo("Documentation de l'API (en anglais)") + ".");
    expect(p.previousElementSibling?.textContent).toContain("Les règles d");
    expect(p.nextElementSibling?.textContent).toMatch(/^Licence d.usage/);
  });
});
