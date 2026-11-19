/**
 * v6 tour 5 (s25), plan `docs/espace-client/travail-en-cours/plan-corrections-v6-tour-5.md`, arbitrages 1 à 4.
 * Chaque correction n'existe qu'interrupteur ouvert ; fermé, les classes d'avant (vérifiées ici composant par
 * composant, et au caractère près par `inertie-espace.test.tsx`). Aucun texte nouveau.
 */
import { TextEncoder } from "util";
import { act, fireEvent, render, screen, within } from "@testing-library/react";

jest.mock("@/config/espace-client", () => ({
  ...jest.requireActual("@/config/espace-client"),
  get ESPACE_CLIENT_PUBLIE() {
    return (globalThis as { __V6T5_OUVERT__?: boolean }).__V6T5_OUVERT__ === true;
  },
}));
jest.mock("@/config/resiliation", () => ({
  ...jest.requireActual("@/config/resiliation"),
  get RESILIATION_PAGE_OUVERTE() {
    return (globalThis as { __V6T5_RESILIATION__?: boolean }).__V6T5_RESILIATION__ === true;
  },
}));
jest.mock("next/navigation", () => ({
  usePathname: () => "/parcours",
  useRouter: () => ({ push: jest.fn(), replace: jest.fn(), refresh: jest.fn(), prefetch: jest.fn() }),
  useSearchParams: () => new URLSearchParams(),
}));
const useSession = jest.fn(() => ({ data: null as unknown, status: "unauthenticated" }));
jest.mock("next-auth/react", () => ({ useSession: () => useSession(), signOut: jest.fn() }));
jest.mock("@/lib/umami", () => ({ trackUmami: jest.fn(), trackUmamiWhenReady: jest.fn() }));
jest.mock("@/lib/prisma", () => ({ prisma: {} }));
jest.mock("@/lib/content-stats-server", () => ({ getContentStatsRounded: async () => ({ jokes: 0, tips: 120, videos: 0 }) }));
jest.mock("@/stores/favorites-store", () => ({ useFavoritesStore: jest.fn() }));
jest.mock("@/stores/user-store", () => ({ useUserStore: jest.fn() }));

Object.assign(globalThis, { TextEncoder });
const { renderToStaticMarkup } = jest.requireActual<typeof import("react-dom/server")>("react-dom/server");

import ParcoursPage from "@/app/(dashboard)/parcours/(liste)/page";
import { ParcoursContent } from "@/components/parcours/parcours-content";
import { ParcoursDetail, type PathData } from "@/components/parcours/parcours-detail";
import { ParcoursEspace } from "@/components/espace/parcours/parcours-espace";
import { FaqSection } from "@/components/home/faq-section";
import { getParcoursCatalogue } from "@/lib/parcours-catalogue";
import { TonCap } from "@/components/espace/ton-cap";
import { CapProfil } from "@/components/espace/cap-profil";
import { AbonnementCard } from "@/components/profil/abonnement-card";
import { FavorisList } from "@/components/favoris/favoris-list";
import { useFavoritesStore } from "@/stores/favorites-store";
import { useUserStore } from "@/stores/user-store";
import { TEXTES_ABONNEMENT } from "@/config/textes/compte";
import { LIBELLE_RENONCER_CONTRAT } from "@/config/textes/paiement";
import { TITRES_SECTIONS } from "@/config/textes/parcours";

const etat = globalThis as { __V6T5_OUVERT__?: boolean; __V6T5_RESILIATION__?: boolean };
const ouvrir = (ouvert: boolean) => {
  etat.__V6T5_OUVERT__ = ouvert;
};
const PREMIUM = { data: { user: { id: "u1", name: "Yanis", plan: "PREMIUM" } }, status: "authenticated" };
const classes = (e: Element | null) => (e as HTMLElement).className.split(" ");
const titre = (c: HTMLElement, texte: string) =>
  Array.from(c.querySelectorAll("h2")).find((h) => h.textContent?.replace(/\s+/g, " ").trim() === texte) as HTMLElement;

afterAll(() => {
  delete etat.__V6T5_OUVERT__;
  delete etat.__V6T5_RESILIATION__;
});
beforeEach(() => {
  ouvrir(false);
  etat.__V6T5_RESILIATION__ = false;
  useSession.mockReturnValue({ data: null, status: "unauthenticated" });
  global.fetch = jest.fn().mockResolvedValue({ ok: false, status: 500, json: async () => ({}) }) as unknown as typeof fetch;
});

describe("arbitrage 1 : /parcours, titres de section centrés comme l'accueil", () => {
  const TITRES_LISTE = ["Quel parcours est fait pour toi ?", "Explore aussi", "Questions fréquentes"];

  // s26 (`docs/design/parcours-vannes-s26.md` §1.1) : titres de section à gauche, 20/600 (`TITRE_CARTE`).
  it("liste, ouvert : « Quel parcours… », « Explore aussi », « Questions fréquentes » à gauche, 20/600", async () => {
    ouvrir(true);
    const { container } = render(<div dangerouslySetInnerHTML={{ __html: renderToStaticMarkup(await ParcoursPage()) }} />);
    for (const t of TITRES_LISTE) {
      const h2 = titre(container, t);
      expect(classes(h2)).toEqual(expect.arrayContaining(["text-xl", "font-semibold"]));
      expect(classes(h2)).not.toContain("text-center");
      expect(h2.className).not.toMatch(/md:text-2xl/);
    }
  });

  it("liste, fermé : classes d'avant, aucun titre centré", async () => {
    const { container } = render(<div dangerouslySetInnerHTML={{ __html: renderToStaticMarkup(await ParcoursPage()) }} />);
    expect(titre(container, "Quel parcours est fait pour toi ?").className).toBe("mb-4 font-display text-xl font-bold");
    expect(titre(container, "Explore aussi").className).toBe("font-display mb-4 text-xl font-bold");
    expect(titre(container, "Questions fréquentes").className).toBe("font-display font-bold text-text-primary mb-4 text-xl");
  });

  it("FAQ : `titreCentre` ne centre que le titre ; sans lui, rendu d'avant", () => {
    const avec = render(<FaqSection align="left" titreCentre />).container;
    expect(classes(titre(avec, "Questions fréquentes"))).toEqual(expect.arrayContaining(["text-center", "mb-4", "text-xl"]));
    expect((avec.firstElementChild as HTMLElement).className).toBe("");
    const sans = render(<FaqSection align="left" />).container;
    expect(titre(sans, "Questions fréquentes").className).toBe("font-display font-bold text-text-primary mb-4 text-xl");
  });

  // s26 (§1.2) : « Les parcours » à gauche, dans la colonne de 8.
  it("abonné, ouvert : « Les parcours » à gauche, colonne de 8", async () => {
    ouvrir(true);
    useSession.mockReturnValue(PREMIUM);
    const { container } = render(<ParcoursEspace />);
    await act(async () => undefined);
    expect(classes(titre(container, "Les parcours"))).toEqual(expect.arrayContaining(["text-xl", "lg:col-span-8"]));
    expect(classes(titre(container, "Les parcours"))).not.toContain("text-center");
  });

  // s26 (§1.1) : quiz compact à gauche dans les 4 colonnes de droite du hero.
  it("quiz d'orientation : à gauche ouvert comme fermé", async () => {
    const catalogue = getParcoursCatalogue();
    ouvrir(true);
    const ouvert = render(<ParcoursContent parcours={catalogue} />);
    await act(async () => undefined);
    expect(classes(titre(ouvert.container, "Quel parcours est fait pour toi ?"))).not.toContain("text-center");
    expect(classes(titre(ouvert.container, "Quel parcours est fait pour toi ?").parentElement)).toContain("lg:col-start-9");
    ouvert.unmount();
    ouvrir(false);
    const ferme = render(<ParcoursContent parcours={catalogue} />);
    await act(async () => undefined);
    expect(classes(titre(ferme.container, "Quel parcours est fait pour toi ?"))).not.toContain("text-center");
  });
});

describe("arbitrage 1 : /parcours/repartie, « Pour qui ? », « Le programme » et intro", () => {
  const chemin = (): PathData =>
    ({
      id: "p",
      title: "Parcours Répartie",
      description: "Une description du parcours.",
      slug: "repartie",
      duration: "4 semaines",
      difficulty: "DEBUTANT",
      timePerWeek: "20 min/semaine",
      icon: "⚡",
      personaTagline: "Pour toi si tu trouves la réplique trop tard.",
      testimonial: "Un témoignage.",
      nextParcours: null,
      nextParcoursReason: null,
      steps: [1, 2].map((order) => ({
        id: `s${order}`,
        order,
        dayNumber: order * 7,
        tip: { id: `t${order}`, title: `Conseil ${order}`, content: "", category: "GENERAL", difficulty: "DEBUTANT", example: "", exercise: "" },
        moduleTitle: `Module ${order}`,
        moduleXp: 50,
        free: order === 1,
        locked: order > 1,
        quiz: [],
        videos: [],
      })),
    }) as unknown as PathData;

  beforeEach(() => {
    localStorage.clear();
    window.history.replaceState(null, "", "/parcours/repartie");
  });

  // s26 (`docs/design/parcours-vannes-s26.md` §2) : titres et intro alignés à gauche dans la colonne de 8, échelle `typo.ts`.
  it("ouvert : titres et intro à gauche, colonne de 8, échelle `typo.ts`", async () => {
    ouvrir(true);
    const { container } = render(<ParcoursDetail slug="repartie" initialPath={chemin()} />);
    await act(async () => undefined);
    const programme = titre(container, TITRES_SECTIONS.programme);
    expect(classes(programme)).toEqual(expect.arrayContaining(["text-xl", "font-semibold", "lg:col-span-8"]));
    expect(classes(programme)).not.toContain("text-center");
    const pourQui = titre(container, TITRES_SECTIONS.pourQui);
    expect(classes(pourQui)).toEqual(expect.arrayContaining(["text-base", "font-semibold"]));
    expect(classes(pourQui)).not.toContain("text-center");
    expect(classes(pourQui.parentElement)).toContain("max-w-2xl");
    expect(classes(pourQui.parentElement)).not.toContain("mx-auto");
    const intro = screen.getByText("Une description du parcours.");
    expect(classes(intro)).toContain("max-w-2xl");
    expect(classes(intro)).not.toContain("text-center");
  });

  it("fermé : classes d'avant", async () => {
    const { container } = render(<ParcoursDetail slug="repartie" initialPath={chemin()} />);
    await act(async () => undefined);
    expect(titre(container, TITRES_SECTIONS.programme).className).toBe("mb-4 font-display text-xl font-bold");
    const pourQui = titre(container, TITRES_SECTIONS.pourQui);
    expect(pourQui.className).toBe("font-display text-lg font-bold");
    expect((pourQui.parentElement as HTMLElement).className).toBe("mt-4");
    expect(screen.getByText("Une description du parcours.").className).toBe("mt-4 text-pretty text-text-secondary");
  });
});

describe("arbitrage 2 : profil, « Ton cap » aux mesures des cartes voisines", () => {
  it("profil (ouvert) : `p-4` sans `md:p-6`, titre `text-lg` comme `CardTitle`", async () => {
    ouvrir(true);
    const { container } = render(<CapProfil xp={120} serie={2} className="md:col-span-2" />);
    await act(async () => undefined);
    const carte = container.querySelector("#cap") as HTMLElement;
    expect(classes(carte)).toContain("p-4");
    expect(classes(carte)).not.toContain("md:p-6");
    expect(classes(carte.querySelector("h2"))).toEqual(expect.arrayContaining(["text-lg"]));
    expect(classes(carte.querySelector("h2"))).not.toContain("text-xl");
  });

  it("Parcours et Aujourd'hui : carte d'avant (`md:p-6`, `text-xl`)", () => {
    const { container } = render(<TonCap cap={1} serie={0} ecart={false} />);
    const carte = container.querySelector("#cap") as HTMLElement;
    expect(classes(carte)).toEqual(expect.arrayContaining(["p-4", "md:p-6"]));
    expect((carte.querySelector("h2") as HTMLElement).className).toBe("font-display text-xl font-bold text-text-primary");
  });
});

describe("arbitrage 3 : carte Abonnement, cibles de 44 px", () => {
  const abonnement = {
    summary: { status: "ACTIVE", hasPortal: true, hasStripeSubscription: true, cancelAtPeriodEnd: false, formule: "monthly", priceCents: 199, currentPeriodEnd: "2026-12-09T09:00:00.000Z" },
    openPortal: jest.fn(),
    portalLoading: null,
  } as unknown as Parameters<typeof AbonnementCard>[0]["abonnement"];
  const carte = () => render(<AbonnementCard plan="PREMIUM" onCheckout={jest.fn()} isCheckoutLoading={false} abonnement={abonnement} />);

  it.each([false, true])("ouvert (page de résiliation ouverte : %s) : « Gérer », « Changer de formule », « Résilier » en `md:h-11`", (resiliation) => {
    ouvrir(true);
    etat.__V6T5_RESILIATION__ = resiliation;
    carte();
    for (const nom of [TEXTES_ABONNEMENT.gerer, TEXTES_ABONNEMENT.changerFormule]) {
      expect(classes(screen.getByRole("button", { name: nom }))).toEqual(expect.arrayContaining(["md:h-11", "max-md:h-11"]));
    }
    const resilier = screen.getByRole(resiliation ? "link" : "button", { name: TEXTES_ABONNEMENT.resilier });
    expect(classes(resilier)).toEqual(expect.arrayContaining(["md:h-11", "max-md:h-11"]));
  });

  it("ouvert : « Renoncer au contrat ici » est une cible de 44 px, texte et soulignement inchangés", () => {
    ouvrir(true);
    carte();
    const lien = screen.getByRole("link", { name: LIBELLE_RENONCER_CONTRAT });
    expect(classes(lien)).toEqual(expect.arrayContaining(["inline-flex", "min-h-11", "items-center", "underline", "text-text-muted"]));
    expect(lien).toHaveAttribute("href", "/retractation");
    expect(classes(lien.parentElement)).toEqual(expect.arrayContaining(["text-xs"]));
  });

  it("fermé : classes d'avant", () => {
    carte();
    for (const nom of [TEXTES_ABONNEMENT.gerer, TEXTES_ABONNEMENT.changerFormule, TEXTES_ABONNEMENT.resilier]) {
      expect(classes(screen.getByRole("button", { name: nom }))).not.toContain("md:h-11");
    }
    const lien = screen.getByRole("link", { name: LIBELLE_RENONCER_CONTRAT });
    expect(lien.className).toBe("text-text-muted underline underline-offset-2 hover:text-text-secondary");
    expect((lien.parentElement as HTMLElement).className).toBe("mt-4 text-xs");
  });
});

describe("arbitrage 4 : Favoris, cartes dépliables annoncées comme des boutons", () => {
  const FAVORIS = [
    { id: "f1", contentType: "JOKE", jokeId: "j1", tipId: null, videoId: null, createdAt: "2024-01-01", tip: null, video: null,
      joke: { content: "Une vanne drôle", punchline: "Et la chute qui tue", category: "ABSURDE", type: "ONE_LINER", comedyTechnique: null } },
    { id: "f2", contentType: "TIP", jokeId: null, tipId: "t1", videoId: null, createdAt: "2024-01-02", joke: null, video: null,
      tip: { title: "Un super conseil", content: "Le contenu du conseil", category: "TIMING", difficulty: "DEBUTANT", example: "Exemple concret", exercise: "" } },
  ];
  beforeEach(() => {
    useSession.mockReturnValue(PREMIUM);
    jest.mocked(useUserStore).mockImplementation(((sel: (s: Record<string, unknown>) => unknown) => sel({ user: { plan: "PREMIUM" } })) as never);
    jest.mocked(useFavoritesStore).mockReturnValue({ favorites: FAVORIS, isLoading: false, fetchFavorites: jest.fn(), removeFavorite: jest.fn() } as never);
    global.fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => ({ liked: false, disliked: false, likes: 0, dislikes: 0 }) }) as unknown as typeof fetch;
  });
  const carteDe = (texte: string) => screen.getByText(texte).closest("[tabindex='0']") as HTMLElement;

  it("ouvert : aucun `role=\"button\"` sur la carte (elle contient « Retirer » et le partage : pas de contrôles imbriqués), dépli et clavier conservés", async () => {
    ouvrir(true);
    render(<FavorisList />);
    await act(async () => undefined);
    const vanne = carteDe("Une vanne drôle");
    const conseil = carteDe("Un super conseil");
    for (const c of [vanne, conseil]) {
      expect(c).not.toHaveAttribute("role");
      expect(c).not.toHaveAttribute("aria-expanded");
    }
    expect(within(vanne).getByText("Clique pour la chute")).toBeInTheDocument();
    fireEvent.keyDown(vanne, { key: "Enter" });
    expect(within(vanne).getByText("Et la chute qui tue")).toBeInTheDocument();
    fireEvent.click(conseil);
    expect(within(conseil).getByText("Exemple concret")).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: "Retirer des favoris" })).toHaveLength(2);
  });

  it("fermé : ni rôle ni état ajoutés", async () => {
    render(<FavorisList />);
    await act(async () => undefined);
    for (const c of [carteDe("Une vanne drôle"), carteDe("Un super conseil")]) {
      expect(c).not.toHaveAttribute("role");
      expect(c).not.toHaveAttribute("aria-expanded");
    }
  });
});
