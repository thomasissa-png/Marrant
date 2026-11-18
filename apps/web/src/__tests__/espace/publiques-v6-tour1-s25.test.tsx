/**
 * v6 tour 1, lot 2 (pages publiques vues en régime ouvert), plan `plan-corrections-v6-tour-1.md` points 1, 8 à 13.
 * Chaque correction n'existe qu'interrupteur ouvert ; fermé, le rendu d'avant (vérifié ici sur chaque composant, et au
 * caractère près par `inertie-espace.test.tsx`).
 */
import { TextEncoder } from "util";
import { act, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const etat = globalThis as { __V6T1_OUVERT__?: boolean };
jest.mock("@/config/espace-client", () => ({
  ...jest.requireActual("@/config/espace-client"),
  get ESPACE_CLIENT_PUBLIE() {
    return (globalThis as { __V6T1_OUVERT__?: boolean }).__V6T1_OUVERT__ === true;
  },
}));
jest.mock("next/navigation", () => ({
  usePathname: () => "/",
  useRouter: () => ({ push: jest.fn(), replace: jest.fn(), refresh: jest.fn(), prefetch: jest.fn() }),
  useSearchParams: () => new URLSearchParams(),
}));
const useSession = jest.fn(() => ({ data: null, status: "unauthenticated" }));
jest.mock("next-auth/react", () => ({ useSession: () => useSession() }));
jest.mock("@/components/espace/profil/historique-profil", () => ({ HistoriqueProfil: () => null }));
jest.mock("@/lib/umami",() => ({ trackUmami: jest.fn(), trackUmamiWhenReady: jest.fn() }));

Object.assign(globalThis, { TextEncoder });
const { renderToStaticMarkup } = jest.requireActual<typeof import("react-dom/server")>("react-dom/server");

import { Card } from "@/components/ui/card";
import { RangeeDefilante } from "@/components/vannes/rangee-defilante";
import { MurListe } from "@/components/premium/mur-liste";
import { CarteFloutee } from "@/components/premium/carte-floutee";
import { LettrePageInscription } from "@/components/lettre/lettre-page-inscription";
import { CarnetPage } from "@/components/carnet/carnet-page";
import { carnetViewForPlan, parseCarnets } from "@/lib/carnet";
import { readFileSync } from "fs";
import { join } from "path";
import { TEXTES_LETTRE } from "@/config/textes/lettre-s21";
import ProfilPage from "@/app/(dashboard)/profil/page";
import { ParcoursContent } from "@/components/parcours/parcours-content";
import { getParcoursCatalogue } from "@/lib/parcours-catalogue";

const ouvrir = (ouvert: boolean) => {
  etat.__V6T1_OUVERT__ = ouvert;
};
afterAll(() => {
  delete etat.__V6T1_OUVERT__;
});
beforeEach(() => ouvrir(false));

describe("point 1 : carte à filet (langue de l'accueil)", () => {
  it("sans `filet` : la carte d'avant, au caractère près", () => {
    const avant = '<div class="rounded-lg border border-border bg-background-card transition-colors duration-200 hover:border-border-hover p-6">x</div>';
    expect(renderToStaticMarkup(<Card className="p-6">x</Card>)).toBe(avant);
    expect(renderToStaticMarkup(<Card className="p-6" filet={false}>x</Card>)).toBe(avant);
  });

  it("avec `filet` : `overflow-hidden rounded-xl` et filet `h-1` dégradé de l'accueil en premier enfant", () => {
    const { container } = render(<Card filet>x</Card>);
    const carte = container.firstElementChild as HTMLElement;
    expect(carte.className).toEqual(expect.stringContaining("rounded-xl"));
    expect(carte.className).not.toContain("rounded-lg");
    expect(carte.className).toEqual(expect.stringContaining("overflow-hidden"));
    const filet = carte.firstElementChild as HTMLElement;
    expect(filet).toHaveAttribute("data-filet");
    expect(filet).toHaveAttribute("aria-hidden", "true");
    expect(filet.className).toContain("h-1 bg-gradient-to-r from-accent-primary to-accent-secondary");
  });
});

describe("point 8 : rangée des catégories, chevrons de 44 px", () => {
  const scrollBy = jest.fn();
  beforeAll(() => {
    Object.defineProperty(HTMLElement.prototype, "scrollWidth", { configurable: true, get: () => 1350 });
    Object.defineProperty(HTMLElement.prototype, "clientWidth", { configurable: true, get: () => 1216 });
    Object.assign(HTMLElement.prototype, { scrollBy });
  });
  afterAll(() => {
    delete (HTMLElement.prototype as { scrollWidth?: number }).scrollWidth;
    delete (HTMLElement.prototype as { clientWidth?: number }).clientWidth;
  });

  it("rangée qui déborde : chevron droit (44 px, hors tabulation, sans libellé), qui fait défiler", async () => {
    const { container } = render(
      <RangeeDefilante label="Catégories de vannes">
        <button type="button">Toutes</button>
      </RangeeDefilante>,
    );
    expect(screen.getByRole("tablist", { name: "Catégories de vannes" })).toBeInTheDocument();
    const droite = container.querySelector('[data-chevron="droite"]') as HTMLButtonElement;
    expect(droite).toHaveAttribute("aria-hidden", "true");
    expect(droite).toHaveAttribute("tabindex", "-1");
    expect(droite.className).toContain("h-11 w-11");
    expect(droite.className).toContain("lg:inline-flex");
    expect(container.querySelector('[data-chevron="gauche"]')).toBeNull();
    await userEvent.click(droite);
    expect(scrollBy).toHaveBeenCalledWith({ left: 320, behavior: "smooth" });
  });

  it("rangée défilée jusqu'au bout : chevron gauche seul", () => {
    const { container } = render(
      <RangeeDefilante label="Catégories de vannes">
        <button type="button">Toutes</button>
      </RangeeDefilante>,
    );
    const rangee = screen.getByRole("tablist");
    Object.defineProperty(rangee, "scrollLeft", { configurable: true, value: 134 });
    act(() => {
      rangee.dispatchEvent(new Event("scroll"));
    });
    expect(container.querySelector('[data-chevron="gauche"]')).not.toBeNull();
    expect(container.querySelector('[data-chevron="droite"]')).toBeNull();
  });
});

describe("point 9 : réassurance alignée sur son bloc", () => {
  const reassurance = () => document.querySelector("[data-reassurance]") as HTMLElement;

  it("mur de liste, ouvert : carte à filet, réassurance à gauche", () => {
    ouvrir(true);
    const { container } = render(<MurListe liste="vannes" />);
    expect(container.querySelector("[data-mur-liste] > [data-filet]")).not.toBeNull();
    expect(reassurance().className).toContain("text-left");
    expect(reassurance().className).not.toContain("text-center");
  });

  it("mur de liste, fermé : inchangé (pas de filet, réassurance centrée)", () => {
    const { container } = render(<MurListe liste="vannes" />);
    expect(container.querySelector("[data-filet]")).toBeNull();
    expect(reassurance().className).toContain("text-center");
  });

  it("carte floutée : filet ouvert seulement", () => {
    ouvrir(true);
    const { container, unmount } = render(<CarteFloutee onOuvrir={() => undefined} />);
    expect(container.querySelector("button > [data-filet]")).not.toBeNull();
    unmount();
    ouvrir(false);
    expect(render(<CarteFloutee onOuvrir={() => undefined} />).container.querySelector("[data-filet]")).toBeNull();
  });
});

describe("point 10 : /lettre, inscription", () => {
  it("ouvert : titre centré, formulaire dans une carte à filet, « Envoie-moi la lettre » en plein", () => {
    ouvrir(true);
    const { container } = render(<LettrePageInscription />);
    expect(container.querySelector("header")?.className).toContain("text-center");
    const carte = container.querySelector("[data-lettre-carte]") as HTMLElement;
    expect(carte.className).toContain("rounded-xl");
    expect(carte.querySelector(":scope > [data-filet]")).not.toBeNull();
    const bouton = within(carte).getByRole("button", { name: TEXTES_LETTRE.formulaire.bouton });
    expect(bouton.className).toContain("bg-accent-secondary-hover");
    expect(bouton.className).not.toContain("border-accent-primary/80");
  });

  it("fermé : en-tête à gauche, pas de carte, bouton en contour", () => {
    const { container } = render(<LettrePageInscription />);
    expect(container.querySelector("header")?.className ?? "").not.toContain("text-center");
    expect(container.querySelector("[data-lettre-carte]")).toBeNull();
    expect(screen.getByRole("button", { name: TEXTES_LETTRE.formulaire.bouton }).className).toContain("border-accent-primary/80");
  });
});

describe("point 11 : carnet de l'abonné, sommaire en tête", () => {
  const lire = (f: string): unknown => JSON.parse(readFileSync(join(__dirname, "..", "..", "data", "carnet", f), "utf8"));
  const [precedent, courant] = parseCarnets([lire("2026-10.json"), lire("2026-11.json")]);
  const mois = [courant.mois, precedent.mois];
  const page = (plan: string | null) => (
    <CarnetPage view={carnetViewForPlan(courant, plan)} months={mois} returnTo="/carnet" src="carnet" />
  );

  // v6 tour 3, point 9 : « Les carnets précédents » descend APRÈS les fiches (il ne coiffe plus les fiches du mois).
  it("ouvert, abonné : sommaire des fiches (ancres existantes), fiches, puis carnets précédents en fin de page", () => {
    ouvrir(true);
    const { container } = render(page("PREMIUM"));
    const sommaire = container.querySelector("[data-carnet-sommaire]") as HTMLElement;
    expect(sommaire).toHaveAttribute("aria-labelledby", "carnet-titre");
    expect(screen.getByRole("heading", { level: 1 })).toHaveAttribute("id", "carnet-titre");
    const liens = within(sommaire).getAllByRole("link");
    expect(liens).toHaveLength(courant.fiches.length);
    for (const lien of liens) {
      const cible = (lien.getAttribute("href") ?? "").slice(1);
      expect(container.querySelector(`[id="${cible}"]`)).not.toBeNull();
    }
    const archives = container.querySelector('[aria-labelledby="carnet-archives"]') as HTMLElement;
    const fiches = container.querySelectorAll('[id^="fiche-"]');
    const premiereFiche = fiches[0] as HTMLElement;
    const derniereFiche = fiches[fiches.length - 1] as HTMLElement;
    expect(sommaire.compareDocumentPosition(premiereFiche) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(derniereFiche.compareDocumentPosition(archives) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    // s26 (18/11, filet violet des cartes retiré) : fiches au cadre neutre, sans filet.
    expect(container.querySelector("[data-filet]")).toBeNull();
    // s26 : « Retour au sommaire » après chacune des fiches.
    expect(container.querySelectorAll("[data-carnet-retour-sommaire]")).toHaveLength(courant.fiches.length);
  });

  // s26 (`docs/ux/favoris-carnet-s26.md` §2.2) : offre EN HAUT (hero 8/4, `OffreApercu`), fiche offerte puis fin d'extrait
  // (même lien, même source), programme fermé à part ; aucun filet ; réassurance à gauche.
  it("ouvert, visiteur (s26) : pas de sommaire ; offre en haut, fiche offerte, fin d'extrait, programme fermé", () => {
    ouvrir(true);
    const { container } = render(page(null));
    expect(container.querySelector("[data-carnet-sommaire]")).toBeNull();
    expect(container.querySelector("[data-filet]")).toBeNull();
    const haut = (container.querySelector("[data-carnet-hero] [data-apercu-offre]") as HTMLElement).querySelector("a") as HTMLElement;
    const fin = screen.getByTestId("carnet-paywall-bouton");
    expect(haut.getAttribute("href")).toBe("/abonnement?returnTo=%2Fcarnet&src=carnet");
    expect(fin.getAttribute("href")).toBe(haut.getAttribute("href"));
    const fiche = container.querySelector('[id^="fiche-"]') as HTMLElement;
    expect(haut.compareDocumentPosition(fiche) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(fiche.compareDocumentPosition(fin) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(container.querySelectorAll("[data-carnet-programme] li")).toHaveLength(3);
    // Réassurance de la fin d'extrait à gauche (celle du bloc d'offre suit le style d'`OffreApercu`).
    expect((fin.parentElement?.querySelector("[data-reassurance]") as HTMLElement).className).toContain("text-left");
  });

  it("fermé, abonné : pas de sommaire, carnets précédents en bas, aucun filet", () => {
    const { container } = render(page("PREMIUM"));
    expect(container.querySelector("[data-carnet-sommaire]")).toBeNull();
    expect(container.querySelector("[data-filet]")).toBeNull();
    expect(screen.getByRole("heading", { level: 1 })).not.toHaveAttribute("id");
    const archives = container.querySelector('[aria-labelledby="carnet-archives"]') as HTMLElement;
    expect(archives.className).toBe("mt-10");
    expect(container.lastElementChild?.lastElementChild).toBe(archives);
  });
});

describe("point 12 : /parcours de l'abonné, un seul plein", () => {
  const catalogue = getParcoursCatalogue();
  const boutons = () =>
    screen.getAllByRole("button").filter((b) => /Commencer ce parcours|Continuer ce parcours|Revoir/.test(b.textContent ?? ""));
  const pleins = () => boutons().filter((b) => b.className.includes("bg-accent-secondary-hover"));

  function progression(slug: string | null) {
    global.fetch = jest.fn(async () => ({
      ok: true,
      json: async () => ({
        paths: slug ? [{ slug, steps: [1, 2, 3, 4].map((order) => ({ order })), progress: { completedSteps: [1], completedAt: null } }] : [],
      }),
    })) as unknown as typeof fetch;
  }

  beforeEach(() => {
    useSession.mockReturnValue({ data: { user: { id: "u1", plan: "PREMIUM" } }, status: "authenticated" } as never);
  });
  afterEach(() => {
    useSession.mockReturnValue({ data: null, status: "unauthenticated" });
  });

  it("ouvert, parcours en cours : son bouton seul en plein, les autres en contour", async () => {
    ouvrir(true);
    const enCours = catalogue[catalogue.length - 1].slug;
    progression(enCours);
    render(<ParcoursContent parcours={catalogue} />);
    await screen.findByText("Continuer ce parcours");
    expect(pleins()).toHaveLength(1);
    expect(pleins()[0].closest(`#parcours-${enCours}`)).not.toBeNull();
    expect(boutons().filter((b) => b.className.includes("border-accent-primary/80"))).toHaveLength(catalogue.length - 1);
  });

  it("ouvert, aucun parcours entamé : le parcours conseillé (Répartie) seul en plein", async () => {
    ouvrir(true);
    progression(null);
    render(<ParcoursContent parcours={catalogue} />);
    await act(async () => undefined);
    expect(pleins()).toHaveLength(1);
    expect(pleins()[0].closest("#parcours-repartie")).not.toBeNull();
  });

  it("fermé : un plein par carte, comme avant", async () => {
    progression(catalogue[0].slug);
    render(<ParcoursContent parcours={catalogue} />);
    await screen.findByText("Continuer ce parcours");
    expect(pleins()).toHaveLength(catalogue.length);
  });
});

describe("point 13 : profil", () => {
  it("ouvert : plus de place réservée au-dessus du H1", () => {
    ouvrir(true);
    const html = renderToStaticMarkup(<ProfilPage searchParams={{}} />);
    // v6 tour 3, point 1 : en-tête centré comme le hero de l'accueil.
    expect(html.startsWith('<div class="mb-8 text-center"><h1')).toBe(true);
  });
});
