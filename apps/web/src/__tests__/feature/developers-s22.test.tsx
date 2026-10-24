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
import { CHAMPS, H1, PAGE_TITLE, TEXTE_LICENCE_CONDITIONS, TEXTE_LICENCE_USAGE } from "@/config/textes/developers";

const ENDPOINT = "https://deviens-marrant.fr/api/widget/v1/vanne-du-jour";

beforeEach(() => {
  setPublie(true);
});

describe("page /developers", () => {
  it("H1, URL de l'endpoint, contenu en anglais (lang=en)", () => {
    const { container } = render(<Page />);
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe(H1);
    const codes = [...container.querySelectorAll("pre code")].map((c) => c.textContent);
    expect(codes).toContain(`GET ${ENDPOINT}`);
    expect(codes).toContain(`curl ${ENDPOINT}`);
    expect(container.querySelector('div[lang="en"] h1')).toBeTruthy();
  });

  it("les 7 champs, nom en <code>, dans l'ordre", () => {
    const { container } = render(<Page />);
    const noms = [...container.querySelectorAll("dt code")].map((c) => c.textContent);
    expect(noms).toEqual(["type", "date", "amorce", "chute", "url", "attribution", "license"]);
    expect(CHAMPS).toHaveLength(7);
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

  it("lien interne vers le programme, aucune typo française, aucun tiret cadratin", () => {
    const { container } = render(<Page />);
    expect(container.querySelector('a[href="/integrer-la-vanne-du-jour"]')?.textContent).toBe("/integrer-la-vanne-du-jour");
    expect(container.textContent).not.toMatch(/[  ]/);
    expect(container.textContent).not.toContain("—");
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
