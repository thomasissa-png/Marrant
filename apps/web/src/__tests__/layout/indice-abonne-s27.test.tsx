/**
 * s27 D2 (`docs/qa/parcours-abonne-s27.md`) : un abonné voyait 1,8 à 2,1 s l'offre du visiteur (« Tout ouvrir »,
 * cadenas, « Essayer ce conseil · 1,99 €/mois ») sur les fiches en ISR, le temps que la session soit lue.
 * Correction (`lib/indice-lecteur.ts`) : cookie d'indice lu par un script de <head> avant l'affichage, attribut sur
 * <html>, règle CSS qui masque les éléments marqués `data-masque-abonne`. Ici : le script, les marques, l'entretien
 * de l'indice par `IndiceLecteur`, la règle CSS. Le middleware : `indice-abonne-middleware-s27.test.ts`.
 */
import { readFileSync } from "fs";
import path from "path";
import { render } from "@testing-library/react";

jest.mock("@/config/espace-client", () => ({ ...jest.requireActual("@/config/espace-client"), ESPACE_CLIENT_PUBLIE: true }));
jest.mock("next/navigation", () => ({
  usePathname: jest.fn(() => "/conseils/lironie-bienveillante"),
  useRouter: () => ({ push: jest.fn(), replace: jest.fn(), refresh: jest.fn(), prefetch: jest.fn() }),
  useSearchParams: () => new URLSearchParams(),
}));
jest.mock("next-auth/react", () => ({ useSession: jest.fn(), signOut: jest.fn() }));

import { EnTeteUniversel } from "@/components/layout/en-tete-universel";
import { BlocExercice } from "@/components/premium/bloc-exercice";
import { IndiceLecteur } from "@/components/providers/indice-lecteur";
import { ATTRIBUT_INDICE_LECTEUR, SCRIPT_INDICE_LECTEUR, aCookieDeSession, indiceDepuisPlan, lireIndiceLecteur } from "@/lib/indice-lecteur";

const { useSession } = jest.requireMock("next-auth/react") as { useSession: jest.Mock };
const VISITEUR = { data: null, status: "unauthenticated" };
const CHARGEMENT = { data: null, status: "loading" };

function viderCookies() {
  for (const c of document.cookie.split(";")) {
    const nom = c.split("=")[0].trim();
    if (nom) document.cookie = `${nom}=; Path=/; Max-Age=0`;
  }
  document.documentElement.removeAttribute(ATTRIBUT_INDICE_LECTEUR);
}

beforeAll(() => {
  class RO {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  Object.assign(globalThis, { ResizeObserver: RO });
  global.fetch = jest.fn(async () => ({ ok: false, json: async () => ({}) })) as unknown as typeof fetch;
});
beforeEach(() => {
  viderCookies();
  useSession.mockReturnValue(VISITEUR);
});

describe("indice abonné : fonctions pures", () => {
  it("valeur selon le plan, lecture stricte du cookie, cookie de session reconnu (http, https, morceaux)", () => {
    expect(indiceDepuisPlan("PREMIUM")).toBe("abonne");
    expect(indiceDepuisPlan("FREE")).toBe("compte");
    expect(indiceDepuisPlan(undefined)).toBe("compte");
    expect(lireIndiceLecteur("a=1; dm_lecteur=abonne; b=2")).toBe("abonne");
    expect(lireIndiceLecteur("dm_lecteur=compte")).toBe("compte");
    expect(lireIndiceLecteur("dm_lecteur=admin")).toBeNull();
    expect(lireIndiceLecteur("xdm_lecteur=abonne")).toBeNull();
    expect(aCookieDeSession(["next-auth.session-token"])).toBe(true);
    expect(aCookieDeSession(["__Secure-next-auth.session-token.0"])).toBe(true);
    expect(aCookieDeSession(["next-auth.csrf-token", "dm_lecteur"])).toBe(false);
  });
});

describe("script de <head> (avant tout affichage)", () => {
  const executer = () => new Function(SCRIPT_INDICE_LECTEUR)();

  it("cookie « abonne » : attribut posé sur <html>", () => {
    document.cookie = "dm_lecteur=abonne; Path=/";
    executer();
    expect(document.documentElement.getAttribute(ATTRIBUT_INDICE_LECTEUR)).toBe("abonne");
  });

  it.each([["aucun cookie (visiteur)", ""], ["compte sans abonnement", "dm_lecteur=compte"]])("%s : rien n'est posé", (_, cookie) => {
    if (cookie) document.cookie = `${cookie}; Path=/`;
    executer();
    expect(document.documentElement.hasAttribute(ATTRIBUT_INDICE_LECTEUR)).toBe(false);
  });

  it("feuille de style : les éléments marqués sont masqués sous l'attribut", () => {
    const css = readFileSync(path.join(__dirname, "../../styles/globals.css"), "utf8");
    expect(css).toMatch(/html\[data-indice-lecteur="abonne"\] \[data-masque-abonne\] \{\s*display: none !important;/);
  });
});

describe("éléments du visiteur marqués (HTML servi pendant la lecture de la session)", () => {
  it("en-tête : bouton d'offre « Tout ouvrir », « Connexion » et cadenas de la bande", () => {
    useSession.mockReturnValue(CHARGEMENT);
    const { container } = render(<EnTeteUniversel />);
    const prix = container.querySelector("[data-en-tete-prix]");
    expect(prix).not.toBeNull();
    expect(prix).toHaveAttribute("data-masque-abonne");
    const connexion = Array.from(container.querySelectorAll("a")).find((a) => a.getAttribute("href")?.startsWith("/login"));
    expect(connexion).toHaveAttribute("data-masque-abonne");
    const cadenas = container.querySelectorAll("[data-rubrique] svg");
    expect(cadenas.length).toBeGreaterThan(0);
    cadenas.forEach((svg) => expect(svg).toHaveAttribute("data-masque-abonne"));
  });

  it("abonné connu : plus aucun élément marqué dans l'en-tête (rien de l'abonné n'est masqué)", () => {
    useSession.mockReturnValue({ data: { user: { id: "u1", plan: "PREMIUM" } }, status: "authenticated" });
    const { container } = render(<EnTeteUniversel />);
    expect(container.querySelector("[data-masque-abonne]")).toBeNull();
  });

  it("fiche : le bloc « Essayer ce conseil · 1,99 €/mois » est marqué", () => {
    useSession.mockReturnValue(CHARGEMENT);
    const { container } = render(<BlocExercice type="conseil" returnTo="/conseils/a" parcours="repartie" ficheId="t1" />);
    const bloc = container.querySelector("[data-bloc-exercice]");
    expect(bloc).toHaveAttribute("data-masque-abonne");
    expect(bloc?.querySelector('a[href^="/abonnement"]')).not.toBeNull();
  });
});

describe("IndiceLecteur : entretien de l'indice une fois la session lue", () => {
  it("abonné : cookie « abonne » et attribut posés", () => {
    useSession.mockReturnValue({ data: { user: { plan: "PREMIUM" } }, status: "authenticated" });
    render(<IndiceLecteur />);
    expect(lireIndiceLecteur(document.cookie)).toBe("abonne");
    expect(document.documentElement.getAttribute(ATTRIBUT_INDICE_LECTEUR)).toBe("abonne");
  });

  it("indice périmé (abonnement terminé) : « compte », attribut retiré, l'offre réapparaît", () => {
    document.cookie = "dm_lecteur=abonne; Path=/";
    document.documentElement.setAttribute(ATTRIBUT_INDICE_LECTEUR, "abonne");
    useSession.mockReturnValue({ data: { user: { plan: "FREE" } }, status: "authenticated" });
    render(<IndiceLecteur />);
    expect(lireIndiceLecteur(document.cookie)).toBe("compte");
    expect(document.documentElement.hasAttribute(ATTRIBUT_INDICE_LECTEUR)).toBe(false);
  });

  it("déconnecté : cookie effacé", () => {
    document.cookie = "dm_lecteur=abonne; Path=/";
    render(<IndiceLecteur />);
    expect(lireIndiceLecteur(document.cookie)).toBeNull();
    expect(document.documentElement.hasAttribute(ATTRIBUT_INDICE_LECTEUR)).toBe(false);
  });

  it("session en cours de lecture : rien ne change (l'indice posé avant l'affichage reste)", () => {
    document.cookie = "dm_lecteur=abonne; Path=/";
    document.documentElement.setAttribute(ATTRIBUT_INDICE_LECTEUR, "abonne");
    useSession.mockReturnValue(CHARGEMENT);
    render(<IndiceLecteur />);
    expect(lireIndiceLecteur(document.cookie)).toBe("abonne");
    expect(document.documentElement.getAttribute(ATTRIBUT_INDICE_LECTEUR)).toBe("abonne");
  });
});
