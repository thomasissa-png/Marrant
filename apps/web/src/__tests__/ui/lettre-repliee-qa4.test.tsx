/**
 * QA v4 m-7 : lettre repliée de la fin d'étape 1 chargée au dépliage (`LettreRepliee`).
 * Ligne seule au chargement, `lettre-vu` mesuré une fois (jamais deux après le dépliage),
 * formulaire importé au clic et affiché déplié (focus dans le champ), rien pour l'abonné,
 * rappel « à confirmer » chargé d'office si une inscription attend dans ce navigateur.
 */
import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

let mockSession: { data: unknown; status: string } = { data: null, status: "unauthenticated" };
jest.mock("next-auth/react", () => ({ useSession: () => mockSession }));
jest.mock("@/lib/umami", () => ({ trackUmami: jest.fn() }));

import { LettreRepliee } from "@/components/lettre/lettre-repliee";
import { trackUmami } from "@/lib/umami";
import { TEXTES_LETTRE } from "@/config/textes/lettre-s21";
import { FIN_ETAPE_1 } from "@/config/textes/cta-pages";

const track = trackUmami as jest.Mock;
let observes: ((entries: Partial<IntersectionObserverEntry>[]) => void)[] = [];

beforeEach(() => {
  track.mockClear();
  observes = [];
  window.localStorage.clear();
  mockSession = { data: null, status: "unauthenticated" };
  (window as unknown as { IntersectionObserver: unknown }).IntersectionObserver = class {
    constructor(cb: (entries: Partial<IntersectionObserverEntry>[]) => void) {
      observes.push(cb);
    }
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});

const vus = () => track.mock.calls.filter(([nom]) => nom === "lettre-vu");
const rendre = () => render(<LettreRepliee emplacement="parcours" slug="repartie" ligne={FIN_ETAPE_1.lettre.ligne} />);

it("ligne seule au chargement, lettre-vu une fois, formulaire déplié et focus au clic", async () => {
  const { container } = rendre();
  const ligne = screen.getByRole("button", { name: /^Lettre gratuite\s:\sune vanne décryptée par mois\.$/ });
  expect(ligne).toHaveAttribute("aria-expanded", "false");
  expect(container.querySelector("input")).toBeNull();
  act(() => observes.forEach((cb) => cb([{ isIntersecting: true, intersectionRatio: 1 }])));
  expect(vus()).toEqual([["lettre-vu", { emplacement: "parcours", slug: "repartie" }]]);

  await userEvent.click(ligne);
  const champ = await screen.findByPlaceholderText(TEXTES_LETTRE.formulaire.placeholder);
  expect(champ).toHaveFocus();
  expect(screen.getByRole("checkbox")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /^Lettre gratuite/ })).toHaveAttribute("aria-expanded", "true");
  act(() => observes.forEach((cb) => cb([{ isIntersecting: true, intersectionRatio: 1 }])));
  expect(vus()).toHaveLength(1);
});

it("abonné Premium : rien", () => {
  mockSession = { data: { user: { plan: "PREMIUM" } }, status: "authenticated" };
  const { container } = rendre();
  expect(container.innerHTML).toBe("");
});

it("inscription en attente dans ce navigateur : rappel affiché sans clic", async () => {
  window.localStorage.setItem("dm-lettre", new Date().toISOString());
  rendre();
  // Insécables du texte ramenées à des espaces, comme le fait Testing Library côté DOM.
  const rappel = TEXTES_LETTRE.drapeau.texte.replace(/\s+/g, " ");
  expect(await screen.findByText(rappel, { exact: false })).toBeInTheDocument();
  expect(screen.queryByRole("textbox")).toBeNull();
});
