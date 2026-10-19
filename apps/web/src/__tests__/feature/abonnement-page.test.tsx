import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AbonnementPage from "@/app/(dashboard)/abonnement/page";

// s21 (CLS) : la page lit la session au rendu ; ici, visiteur côté serveur (session client mockée).
const mockConnecteServeur = jest.fn(async () => false);
jest.mock("@/lib/session-serveur", () => ({ lireConnecteServeur: () => mockConnecteServeur() }));
import { AbonnementView } from "@/components/premium/abonnement-view";
import { envNeutre } from "../helpers/env-neutre";
import { apostropheSouple } from "../helpers/texte-normalise";

// s21 (QA m4) : indépendant de l'annuel et de NEXTAUTH_URL posés par le job e2e-local.
envNeutre("STRIPE_PREMIUM_ANNUAL_PRICE_ID", "NEXTAUTH_URL");

jest.mock("next-auth/react", () => ({
  useSession: jest.fn(),
}));

jest.mock("@/hooks/use-content-stats", () => ({
  useContentStats: () => ({ jokes: 600, tips: 400, videos: 80 }),
}));

jest.mock("@/components/ui/toast", () => ({ toast: jest.fn() }));

jest.mock("@/components/home/faq-section", () => ({
  FaqSection: () => <div data-testid="faq-section" />,
}));

const mockTrack = jest.fn();
jest.mock("@/lib/umami", () => ({
  trackUmami: (...args: unknown[]) => mockTrack(...args),
  trackUmamiWhenReady: (...args: unknown[]) => mockTrack(...args),
}));

const { useSession } = require("next-auth/react");

const MENSUEL = "S’abonner · 2,99 €/mois";
const ANNUEL = "S’abonner · 24,99 €/an";

/** Bouton d'achat du premier écran (visiteur : lien ; connecté : bouton). */
const boutonHaut = () => screen.queryByTestId("abonnement-bouton-achat") ?? screen.getByTestId("abonnement-bouton-haut");

/** s15 : les CTA anonymes sont des liens /register (plus de modale). */
function registerParams(): URLSearchParams {
  const href = screen.getByTestId("abonnement-bouton-achat").getAttribute("href") ?? "";
  expect(href.startsWith("/register")).toBe(true);
  return new URL(href, "https://deviens-marrant.fr").searchParams;
}

/** Appels au paiement seuls : /abonnement lit aussi /api/stripe/status au montage (lot F s16). */
function checkoutCalls(mock: jest.Mock) {
  return mock.mock.calls.filter(([url]) => url === "/api/stripe/checkout");
}

/** Texte perçu, espaces normalisés. */
const texteDe = (el: HTMLElement) => (el.textContent ?? "").replace(/[\s  ]+/g, " ");

beforeEach(() => mockConnecteServeur.mockResolvedValue(false));

describe("/abonnement visiteur, page de vente (trajet de conversion s21)", () => {
  it("ordre de la structure cible : accroche, titre, sous-titre, preuve, carte, tableau, carnet, « Pas encore sûr ? », bouton final, FAQ", () => {
    useSession.mockReturnValue({ status: "unauthenticated" });
    render(
      <AbonnementView
        annualAvailable
        accroche="Pour la suite des vannes"
        tableau={<section data-testid="tableau" />}
        carnetExtrait={<section data-testid="carnet" />}
      />,
    );
    const ordre = [
      "abonnement-accroche",
      "abonnement-preuve",
      "avantages-premium",
      "plan-selector",
      "abonnement-bouton-achat",
      "abonnement-suite",
      "reassurance-paiement",
      "abonnement-deja-compte",
      "tableau",
      "carnet",
      "abonnement-etape-1",
      "abonnement-bouton-bas",
      "faq-section",
      "abonnement-barre-collante",
    ].map((id) => screen.getByTestId(id));
    for (let i = 1; i < ordre.length; i++) {
      expect(ordre[i - 1].compareDocumentPosition(ordre[i]) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    }
    expect(screen.getByTestId("abonnement-accroche")).toHaveTextContent("Pour la suite des vannes");
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Premium ouvre tout Deviens Marrant");
    expect(texteDe(document.body)).toContain("Les listes ne s’arrêtent plus à la dixième vanne, les parcours vont au bout.");
    expect(texteDe(screen.getByTestId("abonnement-preuve"))).toBe("1 500+ inscrits bossent leur humour.");
  });

  it("carte d'offre : 3 avantages (lettre absente), 2 formules, bouton, suite, réassurance, « Déjà un compte ? »", () => {
    useSession.mockReturnValue({ status: "unauthenticated" });
    render(<AbonnementView annualAvailable />);
    const carte = screen.getByTestId("abonnement-offre");
    expect(within(carte).getByRole("heading", { level: 2 })).toHaveTextContent("Offre Premium");
    expect(within(screen.getByTestId("avantages-premium")).getAllByRole("listitem").map((li) => texteDe(li))).toEqual([
      "✓Tout le catalogue : vannes, conseils, vidéos",
      "✓Les 5 parcours, de la première à la dernière étape",
      "✓Un nouveau carnet de répartie chaque mois",
    ]);
    expect(texteDe(document.body)).not.toMatch(/lettre|chaque semaine/i);
    expect(texteDe(screen.getByTestId("formule-monthly"))).toBe("Mensuel 2,99 € TTC / mois");
    expect(texteDe(screen.getByTestId("formule-annual"))).toBe("Annuel 24,99 € TTC / an soit 2,08 € par mois plus de 3 mois offerts");
    expect(texteDe(boutonHaut())).toBe(MENSUEL);
    expect(screen.getByTestId("abonnement-suite")).toHaveTextContent("Tu crées ton compte, puis tu paies par carte.");
    expect(texteDe(screen.getByTestId("reassurance-paiement"))).toBe(
      "Premium : premier paiement remboursable sous 14 jours. Résiliable depuis ton profil.",
    );
    const deja = screen.getByTestId("abonnement-deja-compte");
    expect(texteDe(deja)).toBe("Déjà un compte ? Connecte-toi");
    // « Connecte-toi » : après connexion, retour ici avec `auto=1` (page d'attente puis paiement).
    const login = new URL(within(deja).getByRole("link").getAttribute("href") ?? "", "https://x.fr");
    expect(login.pathname).toBe("/login");
    expect(login.searchParams.get("callbackUrl")).toBe("/abonnement?auto=1");
    expect(texteDe(document.body).split("plus de 3 mois offerts")).toHaveLength(2);
    expect(texteDe(document.body)).not.toContain("Sans engagement, annulable");
  });

  it("« Pas encore sûr ? » : lien vers l'étape 1 du parcours d'origine, puis « Sans compte. »", () => {
    useSession.mockReturnValue({ status: "unauthenticated" });
    render(<AbonnementView annualAvailable={false} parcoursOrigine="confiance" />);
    const bloc = screen.getByTestId("abonnement-etape-1");
    expect(within(bloc).getByRole("heading", { level: 2 })).toHaveTextContent("Pas encore sûr ?");
    const lien = within(bloc).getByRole("link", { name: apostropheSouple(/^Tester l'étape\s1\sde Confiance, gratuite$/) });
    expect(lien).toHaveAttribute("href", "/parcours/confiance?src=abonnement#etape-1");
    expect(bloc).toHaveTextContent("Sans compte.");
  });

  it("bouton final et barre collante : même libellé, même destination que le bouton du haut", () => {
    useSession.mockReturnValue({ status: "unauthenticated" });
    render(<AbonnementView annualAvailable={false} />);
    const href = screen.getByTestId("abonnement-bouton-achat").getAttribute("href");
    for (const id of ["abonnement-bouton-bas", "abonnement-bouton-barre"]) {
      expect(texteDe(screen.getByTestId(id))).toBe(MENSUEL);
      expect(screen.getByTestId(id)).toHaveAttribute("href", href);
    }
    expect(screen.getByTestId("abonnement-suite-final")).toHaveTextContent("Tu crées ton compte, puis tu paies par carte.");
    expect(screen.getByTestId("reassurance-paiement-final")).toBeInTheDocument();
    // La barre n'a ni suite ni réassurance (textes-trajet-v1 §1.4).
    expect(within(screen.getByTestId("abonnement-barre-collante")).queryByText(/remboursable|Tu crées/)).toBeNull();
  });

  it("retour d'inscription (`auto=1`, session) : page d'attente, pas la page de vente", () => {
    useSession.mockReturnValue({ status: "loading" });
    render(<AbonnementView annualAvailable={false} connecteServeur retourInscription />);
    expect(screen.getByTestId("abonnement-attente")).toHaveTextContent("Te voilà connecté.On t’emmène au paiement…");
    expect(screen.queryByRole("heading", { name: "Premium ouvre tout Deviens Marrant" })).toBeNull();
    expect(screen.queryByTestId("abonnement-offre")).toBeNull();
  });
});

describe("AbonnementPage (serveur)", () => {
  afterEach(() => window.history.pushState({}, "", "/"));

  it("visiteur : un seul bloc Premium, titre unique, tableau rendu par le serveur ; accroche selon `src`", async () => {
    useSession.mockReturnValue({ status: "unauthenticated" });
    render(await AbonnementPage({ searchParams: { src: "exercice-conseil" } }));
    expect(screen.queryByText("Compte gratuit")).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1, name: "Premium ouvre tout Deviens Marrant" })).toBeInTheDocument();
    expect(screen.getByTestId("abonnement-accroche")).toHaveTextContent("Pour essayer ce conseil");
    const tableau = screen.getByTestId("abonnement-tableau");
    expect(within(tableau).getByRole("table")).toBeInTheDocument();
    expect(tableau.querySelector("tr[data-en-avant='oui']")).toHaveAttribute("data-ligne", "exercices");
    expect(tableau.querySelector("tr[data-ligne='lettre']")).toBeNull();
    expect(within(tableau).getAllByText("inclus")).toHaveLength(5);
    const text = document.body.textContent ?? "";
    expect(text).not.toMatch(/compte gratuit|sans carte|Prix de lancement|Contenu quotidien|Filtres avancés/i);
    expect(text).not.toContain("—");
  });

  it("en-tête : aucune accroche ; `auto=1` sans session côté serveur : page de vente", async () => {
    useSession.mockReturnValue({ status: "unauthenticated" });
    render(await AbonnementPage({ searchParams: { src: "header", auto: "1" } }));
    expect(screen.queryByTestId("abonnement-accroche")).toBeNull();
    expect(screen.queryByTestId("abonnement-attente")).toBeNull();
    expect(screen.getByTestId("abonnement-offre")).toBeInTheDocument();
  });

  it("`auto=1` avec session côté serveur : page d'attente dans le HTML (plus de flash) ; jamais après un retour annulé", async () => {
    mockConnecteServeur.mockResolvedValue(true);
    useSession.mockReturnValue({ status: "loading" });
    const { unmount } = render(await AbonnementPage({ searchParams: { auto: "1", src: "mur-vannes" } }));
    expect(screen.getByTestId("abonnement-attente")).toBeInTheDocument();
    unmount();
    render(await AbonnementPage({ searchParams: { auto: "1", paiement: "annule" } }));
    expect(screen.queryByTestId("abonnement-attente")).toBeNull();
  });

  it("visiteur : le bouton mène à /register, retour vers /abonnement, source `abonnement` par défaut", async () => {
    useSession.mockReturnValue({ status: "unauthenticated" });
    render(await AbonnementPage({}));
    const params = registerParams();
    expect(params.get("callbackUrl")).toBe("/abonnement");
    expect(params.get("src")).toBe("abonnement");
  });

  it("visiteur : intention (returnTo) et source d'entrée suivent jusqu'à /register", async () => {
    window.history.pushState({}, "", "/abonnement?returnTo=%2Fparcours%2Frepartie&src=parcours-apercu");
    useSession.mockReturnValue({ status: "unauthenticated" });
    render(await AbonnementPage({ searchParams: { returnTo: "/parcours/repartie", src: "parcours-apercu" } }));
    expect(screen.getByTestId("abonnement-accroche")).toHaveTextContent("Pour la suite de Répartie");
    const params = registerParams();
    expect(params.get("callbackUrl")).toBe("/abonnement?returnTo=%2Fparcours%2Frepartie&src=parcours-apercu");
    expect(params.get("src")).toBe("parcours-apercu");
  });

  it("compte connecté : bouton Stripe, ligne Stripe, sans « Déjà un compte ? » ni « Pas encore sûr ? »", async () => {
    useSession.mockReturnValue({ status: "authenticated" });
    render(await AbonnementPage({}));
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Premium ouvre tout Deviens Marrant");
    expect(screen.getByTestId("abonnement-bouton-haut")).toHaveTextContent(MENSUEL);
    expect(screen.getByTestId("paiement-stripe")).toHaveTextContent("Paiement sécurisé par Stripe");
    expect(screen.getByTestId("paiement-stripe-final")).toHaveTextContent("Paiement sécurisé par Stripe");
    expect(screen.queryByTestId("abonnement-suite")).toBeNull();
    expect(screen.queryByTestId("abonnement-deja-compte")).toBeNull();
    expect(screen.queryByTestId("abonnement-etape-1")).toBeNull();
  });

  it("connecté : returnTo transmis au checkout, valeur externe ignorée", async () => {
    useSession.mockReturnValue({ status: "authenticated" });
    const fetchMock = jest.fn().mockResolvedValue({ ok: false, status: 500, json: async () => ({}) });
    global.fetch = fetchMock as unknown as typeof fetch;
    window.history.pushState({}, "", "/abonnement?returnTo=%2Fparcours%2Fconfiance");
    const { unmount } = render(await AbonnementPage({}));
    await userEvent.click(screen.getByTestId("abonnement-bouton-haut"));
    expect(JSON.parse(checkoutCalls(fetchMock)[0][1].body)).toEqual({ returnTo: "/parcours/confiance" });
    unmount();
    window.history.pushState({}, "", "/abonnement?returnTo=https%3A%2F%2Fevil.example");
    render(await AbonnementPage({}));
    await userEvent.click(screen.getByTestId("abonnement-bouton-bas"));
    expect(JSON.parse(checkoutCalls(fetchMock)[1][1].body)).toEqual({});
  });
});

describe("AbonnementPage : formule annuelle 24,99 €/an (04/10/2026)", () => {
  const saved = process.env.STRIPE_PREMIUM_ANNUAL_PRICE_ID;
  const fetchMock = jest.fn();
  beforeEach(() => {
    fetchMock.mockReset().mockResolvedValue({ ok: false, status: 500, json: async () => ({}) });
    global.fetch = fetchMock as unknown as typeof fetch;
    window.history.pushState({}, "", "/abonnement");
  });
  afterEach(() => {
    if (saved === undefined) delete process.env.STRIPE_PREMIUM_ANNUAL_PRICE_ID;
    else process.env.STRIPE_PREMIUM_ANNUAL_PRICE_ID = saved;
    window.history.pushState({}, "", "/");
  });

  describe("sans STRIPE_PREMIUM_ANNUAL_PRICE_ID : mensuel seul, comme avant", () => {
    it.each([undefined, "", "price_XXXXXXXXXXXXXXXXXXXX"])("valeur %p : aucune trace de l’annuel", async (value) => {
      if (value === undefined) delete process.env.STRIPE_PREMIUM_ANNUAL_PRICE_ID;
      else process.env.STRIPE_PREMIUM_ANNUAL_PRICE_ID = value;
      useSession.mockReturnValue({ status: "authenticated" });
      render(await AbonnementPage({}));
      expect(screen.queryByRole("radio")).not.toBeInTheDocument();
      expect(texteDe(screen.getByTestId("formule-mensuel-seul"))).toBe("2,99 € TTC / mois");
      expect(screen.getByTestId("abonnement-bouton-haut")).toHaveTextContent(MENSUEL);
      expect(document.body.textContent).not.toMatch(/24,99|annuel|par an|\/an/i);
    });

    it("?plan=annual ignoré : le checkout reste mensuel (corps historique)", async () => {
      delete process.env.STRIPE_PREMIUM_ANNUAL_PRICE_ID;
      window.history.pushState({}, "", "/abonnement?plan=annual");
      useSession.mockReturnValue({ status: "authenticated" });
      render(await AbonnementPage({}));
      await userEvent.click(screen.getByTestId("abonnement-bouton-haut"));
      expect(JSON.parse(checkoutCalls(fetchMock)[0][1].body)).toEqual({});
    });
  });

  describe("avec STRIPE_PREMIUM_ANNUAL_PRICE_ID", () => {
    beforeEach(() => {
      process.env.STRIPE_PREMIUM_ANNUAL_PRICE_ID = "price_test_annual_1";
    });

    it("deux cartes radio, mensuel coché par défaut", async () => {
      useSession.mockReturnValue({ status: "authenticated" });
      render(await AbonnementPage({}));
      expect(screen.getByRole("radio", { name: /Mensuel/ })).toBeChecked();
      expect(screen.getByRole("radio", { name: /Annuel/ })).not.toBeChecked();
      expect(screen.getByTestId("abonnement-bouton-haut")).toHaveTextContent(MENSUEL);
    });

    it("annuel : les trois boutons suivent la formule, envoi plan=annual, jamais « 4 mois » ni « économisés »", async () => {
      useSession.mockReturnValue({ status: "authenticated" });
      render(await AbonnementPage({}));
      await userEvent.click(screen.getByRole("radio", { name: /Annuel/ }));
      for (const id of ["abonnement-bouton-haut", "abonnement-bouton-bas", "abonnement-bouton-barre"]) {
        expect(screen.getByTestId(id)).toHaveTextContent(ANNUEL);
      }
      const text = document.body.textContent ?? "";
      expect(text).not.toMatch(/Payé en une fois|économisés|4 mois/);
      expect(text).not.toContain("—");
      await userEvent.click(screen.getByTestId("abonnement-bouton-haut"));
      expect(JSON.parse(checkoutCalls(fetchMock)[0][1].body)).toEqual({ plan: "annual" });
    });

    it("anonyme : le choix annuel survit à l’inscription (callback plan=annual + returnTo)", async () => {
      window.history.pushState({}, "", "/abonnement?returnTo=%2Fcarnet");
      useSession.mockReturnValue({ status: "unauthenticated" });
      render(await AbonnementPage({ searchParams: { returnTo: "/carnet" } }));
      expect(screen.getByTestId("abonnement-accroche")).toHaveTextContent("Pour tout le carnet");
      await userEvent.click(screen.getByRole("radio", { name: /Annuel/ }));
      expect(screen.getByTestId("abonnement-bouton-achat")).toHaveTextContent(ANNUEL);
      expect(registerParams().get("callbackUrl")).toBe("/abonnement?returnTo=%2Fcarnet&plan=annual");
    });

    it("?plan=annual préselectionne l’annuel", async () => {
      window.history.pushState({}, "", "/abonnement?plan=annual");
      useSession.mockReturnValue({ status: "authenticated" });
      render(await AbonnementPage({}));
      expect(screen.getByRole("radio", { name: /Annuel/ })).toBeChecked();
    });
  });

  describe("mesure Umami du tunnel", () => {
    beforeEach(() => mockTrack.mockClear());

    it("retour Stripe sans paiement (upgrade=cancel) : abonnement-annule, bandeau d'une ligne", async () => {
      window.history.pushState({}, "", "/abonnement?upgrade=cancel");
      useSession.mockReturnValue({ status: "authenticated" });
      render(await AbonnementPage({}));
      expect(mockTrack).toHaveBeenCalledWith("abonnement-annule");
      expect(screen.getByTestId("paiement-annule").querySelectorAll("p")).toHaveLength(1);
      expect(screen.getByTestId("paiement-annule")).toHaveTextContent(
        "Paiement annulé, rien n’a été prélevé. Tu peux réessayer quand tu veux.",
      );
    });

    it("visite normale : aucun abonnement-annule", async () => {
      useSession.mockReturnValue({ status: "authenticated" });
      render(await AbonnementPage({}));
      expect(mockTrack).not.toHaveBeenCalledWith("abonnement-annule");
    });

    it("clic paiement : abonnement-clic avec formule, source et emplacement", async () => {
      useSession.mockReturnValue({ status: "authenticated" });
      render(await AbonnementPage({}));
      await userEvent.click(screen.getByTestId("abonnement-bouton-bas"));
      expect(mockTrack).toHaveBeenCalledWith("abonnement-clic", {
        formule: "mensuel",
        src: "abonnement",
        declencheur: "manuel",
        statut: "membre",
        emplacement: "bas",
      });
    });
  });
});
