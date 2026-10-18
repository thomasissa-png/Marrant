import { render, screen } from "@testing-library/react";
import { frTypo } from "@/lib/fr-typo";
import { ABONNEMENT_CTA, ABONNEMENT_HAUT_PAR_PARCOURS } from "@/config/textes/cta-pages";
import userEvent from "@testing-library/user-event";
import AbonnementPage from "@/app/(dashboard)/abonnement/page";

// s21 (CLS) : la page lit la session au rendu ; ici, visiteur côté serveur (session client mockée).
jest.mock("@/lib/session-serveur", () => ({ lireConnecteServeur: async () => false }));
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

/** s15 : les CTA anonymes sont des liens /register (plus de modale). */
function registerParams(text: string): URLSearchParams {
  const href = screen.getByText(text).closest("a")?.getAttribute("href") ?? "";
  expect(href.startsWith("/register")).toBe(true);
  return new URL(href, "https://deviens-marrant.fr").searchParams;
}

/** Appels au paiement seuls : /abonnement lit aussi /api/stripe/status au montage (lot F s16). */
function checkoutCalls(mock: jest.Mock) {
  return mock.mock.calls.filter(([url]) => url === "/api/stripe/checkout");
}

describe("/abonnement visiteur (concision v5, textes-v5-c §1)", () => {
  it.each([
    ["repartie", "Ta réplique en soirée, pas dans le bus du retour"],
    ["machine-a-cafe", "Faire rire au bureau, au bon moment"],
    ["boulot", "Faire rire au bureau, au bon moment"],
    ["confiance", "Rire à table, sans monter sur scène"],
    ["storytelling", "Ton histoire jusqu’à la chute, avant le « et donc ? »"],
  ] as const)("parcours d’origine %s : titre dédié, plus de surtitre, bouton OUVRIR unique", (slug, titre) => {
    useSession.mockReturnValue({ status: "unauthenticated" });
    render(<AbonnementView annualAvailable={false} parcoursOrigine={slug} />);
    expect(screen.getByRole("heading", { level: 1, name: frTypo(titre) })).toBeInTheDocument();
    expect(screen.queryByTestId("abonnement-surtitre")).toBeNull();
    expect(screen.getByTestId("abonnement-bouton-achat")).toHaveTextContent("Ouvrir les 5 parcours · 2,99 €/mois");
    expect(ABONNEMENT_HAUT_PAR_PARCOURS[slug].titre).toBe(titre);
  });

  it("suite sous le bouton, puis REASS ; extrait du carnet puis « Pas encore sûr ? » (parcours d’origine)", () => {
    useSession.mockReturnValue({ status: "unauthenticated" });
    const { container } = render(
      <AbonnementView annualAvailable={false} parcoursOrigine="confiance" carnetExtrait={<div data-testid="carnet" />} />,
    );
    expect(screen.getByTestId("abonnement-suite")).toHaveTextContent(ABONNEMENT_CTA.suite);
    expect(ABONNEMENT_CTA.suite).toBe("Ton compte, puis le paiement sécurisé.");
    const html = container.innerHTML;
    expect(html.indexOf("abonnement-bouton-achat")).toBeLessThan(html.indexOf("abonnement-suite"));
    expect(html.indexOf("abonnement-suite")).toBeLessThan(html.indexOf("reassurance-paiement"));
    expect(html.indexOf('data-testid="carnet"')).toBeLessThan(html.indexOf("abonnement-etape-1"));
    const lien = screen.getByRole("link", { name: apostropheSouple(/^Tester l'étape\s1\sde Confiance, gratuite$/) });
    expect(lien).toHaveAttribute("href", "/parcours/confiance?src=abonnement#etape-1");
    expect(screen.getByTestId("abonnement-etape-1")).toHaveTextContent(apostropheSouple(/^Pas encore sûr\s\?\sTester l'étape\s1\sde Confiance, gratuite$/));
    expect(document.body.textContent).not.toMatch(/Tu annules quand tu veux|Lis d'abord une étape|Étape 2 sur/);
  });
});

describe("AbonnementPage (s12 T45)", () => {
  it("visiteur : un seul bloc Premium, plus de bloc « Compte gratuit » (s15)", async () => {
    useSession.mockReturnValue({ status: "unauthenticated" });
    render(await AbonnementPage({}));
    expect(screen.queryByText("Compte gratuit")).not.toBeInTheDocument();
    expect(screen.queryByText(/Crée ton compte gratuit/)).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Premium" })).toBeInTheDocument();
    // Concision v5 : titre de Répartie par défaut, sous-titre unique, plus de surtitre.
    expect(screen.getByRole("heading", { level: 1, name: "Ta réplique en soirée, pas dans le bus du retour" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Accéder aux parcours complets" })).not.toBeInTheDocument();
    expect(screen.queryByTestId("abonnement-surtitre")).toBeNull();
    expect(screen.getByText(apostropheSouple(/^Pas d'attente entre les étapes, de 15 à 20 minutes chacune\.$/))).toBeInTheDocument();
    expect(document.body.textContent).not.toMatch(/compte gratuit|sans carte/i);
    // Fin de l'offre de lancement (01/10/2026) : plus aucun badge « Prix de lancement ».
    expect(screen.queryByText("Prix de lancement")).not.toBeInTheDocument();
  });

  it("lot 2 s21 : premier écran visiteur mot pour mot et dans l’ordre, bouton avant les avantages (§5.2, §5.3)", () => {
    useSession.mockReturnValue({ status: "unauthenticated" });
    render(<AbonnementView annualAvailable carnetExtrait={null} />);
    // Texte perçu (vue et lecteur d'écran) : sans les lignes de la formule non choisie,
    // gardées invisibles et `aria-hidden` pour la stabilité de la mise en page (revue design s21 m2).
    const perceptible = document.body.cloneNode(true) as HTMLElement;
    perceptible.querySelectorAll("[aria-hidden='true']").forEach((el) => el.remove());
    const texte = (perceptible.textContent ?? "").replace(/\s+/g, " ");
    const lignes = [
      "Ta réplique en soirée, pas dans le bus du retour",
      "Pas d’attente entre les étapes, de 15 à 20 minutes chacune.",
      "Premium",
      "Mensuel",
      "Annuel",
      "plus de 3 mois offerts",
      // « 2,99 € » et « TTC / mois » : deux spans séparés par l'espacement flex (gap), sans espace dans le texte.
      "2,99 €",
      "TTC / mois",
      "Ou 24,99 €/an, soit 2,08 € par mois.",
      "Ouvrir les 5 parcours · 2,99 €/mois",
      // Juste sous le bouton, avant la REASS.
      "Ton compte, puis le paiement sécurisé.",
      "Premium : premier paiement remboursable sous 14 jours. Résiliable depuis ton profil.",
      // Les avantages viennent APRÈS le bouton d'achat (bouton visible sans défiler).
      "Chaque parcours en entier",
      "Un nouveau carnet de répartie chaque mois",
      "Tout le catalogue : vannes, conseils, vidéos",
      "Tes favoris sous la main",
      "Pas encore sûr ? Tester l’étape 1 de Répartie, gratuite",
    ];
    let depuis = 0;
    for (const ligne of lignes) {
      const position = texte.indexOf(ligne, depuis);
      expect({ ligne, trouvee: position >= 0 }).toEqual({ ligne, trouvee: true });
      depuis = position + ligne.length;
    }
    // « plus de 3 mois offerts » une seule fois, plus de « Sans engagement » dans la carte.
    expect(texte.split("plus de 3 mois offerts")).toHaveLength(2);
    expect(texte).not.toContain("Sans engagement, annulable");
    expect(texte).not.toContain("Accéder aux parcours complets");
  });

  it("lot 2 s21 : l’extrait du carnet s’insère après la carte, avant « Pas encore sûr ? »", () => {
    useSession.mockReturnValue({ status: "unauthenticated" });
    render(<AbonnementView annualAvailable={false} carnetExtrait={<section data-testid="extrait-carnet" />} />);
    const extrait = screen.getByTestId("extrait-carnet");
    const etape1 = screen.getByTestId("abonnement-etape-1");
    const bouton = screen.getByText("Ouvrir les 5 parcours · 2,99 €/mois");
    expect(bouton.compareDocumentPosition(extrait) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(extrait.compareDocumentPosition(etape1) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    // Mensuel seul : pas de ligne « Sans engagement, annulable… » non plus.
    expect(document.body.textContent).not.toContain("Sans engagement, annulable");
  });

  it("paid CTA keeps /abonnement as the destination", async () => {
    useSession.mockReturnValue({ status: "unauthenticated" });
    render(await AbonnementPage({}));
    const params = registerParams("Ouvrir les 5 parcours · 2,99 €/mois");
    expect(params.get("callbackUrl")).toBe("/abonnement");
    expect(params.get("src")).toBe("abonnement");
  });

  it("shows only the paid card with the checkout button to signed-in users", async () => {
    useSession.mockReturnValue({ status: "authenticated" });
    render(await AbonnementPage({}));
    expect(screen.queryByText("Compte gratuit")).not.toBeInTheDocument();
    expect(screen.getByText("Ouvrir les 5 parcours · 2,99 €/mois")).toBeInTheDocument();
  });

  it("compte connecté : titre du parcours d’origine, sous-titre commun, ligne Stripe, sans pastille ni « Pas encore sûr ? »", async () => {
    useSession.mockReturnValue({ status: "authenticated" });
    render(await AbonnementPage({}));
    expect(screen.queryByText("Un abonnement, tout ouvert")).toBeNull();
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Ta réplique en soirée, pas dans le bus du retour");
    expect(screen.getByText(apostropheSouple(/^Pas d'attente entre les étapes/))).toBeInTheDocument();
    expect(screen.getByTestId("paiement-stripe")).toHaveTextContent("Paiement sécurisé par Stripe");
    expect(screen.queryByTestId("abonnement-suite")).toBeNull();
    expect(screen.queryByTestId("abonnement-etape-1")).toBeNull();
    expect(screen.getByRole("button", { name: /^Ouvrir les 5\sparcours\s·\s2,99\s€\/mois$/ })).toBeInTheDocument();
    expect(screen.queryByText(/Plus qu'une étape|Active ton accès|Active mon accès|Ton compte est prêt|tout s'ouvre d'un coup/)).toBeNull();
  });

  describe("offre Premium vraie (décision Thomas 03/10)", () => {
    afterEach(() => window.history.pushState({}, "", "/"));

    it("vend ce qui existe (parcours, carnet, catalogue, favoris), sans l’inexistant", async () => {
      useSession.mockReturnValue({ status: "unauthenticated" });
      render(await AbonnementPage({}));
      expect(screen.getByText("Chaque parcours en entier")).toBeInTheDocument();
      const text = document.body.textContent ?? "";
      // Seul contenu mensuel vendu : le carnet, qui existe (décision 03/10/2026).
      expect(text).toContain("Un nouveau carnet de répartie chaque mois");
      expect(text).not.toMatch(/Contenu quotidien|Filtres avancés|illimit|annuel|par an/i);
      expect(text).not.toContain("\u2014");
    });

    it("anonyme : le CTA payant garde l’intention d’origine (returnTo)", async () => {
      window.history.pushState({}, "", "/abonnement?returnTo=%2Fparcours%2Frepartie");
      useSession.mockReturnValue({ status: "unauthenticated" });
      render(await AbonnementPage({}));
      expect(registerParams("Ouvrir les 5 parcours · 2,99 €/mois").get("callbackUrl")).toBe(
        "/abonnement?returnTo=%2Fparcours%2Frepartie",
      );
    });

    it("connecté : returnTo transmis au checkout, valeur externe ignorée", async () => {
      useSession.mockReturnValue({ status: "authenticated" });
      const fetchMock = jest.fn().mockResolvedValue({ ok: false, status: 500, json: async () => ({}) });
      global.fetch = fetchMock as unknown as typeof fetch;

      window.history.pushState({}, "", "/abonnement?returnTo=%2Fparcours%2Fconfiance");
      const { unmount } = render(await AbonnementPage({}));
      await userEvent.click(screen.getByText("Ouvrir les 5 parcours · 2,99 €/mois"));
      expect(JSON.parse(checkoutCalls(fetchMock)[0][1].body)).toEqual({ returnTo: "/parcours/confiance" });
      unmount();

      window.history.pushState({}, "", "/abonnement?returnTo=https%3A%2F%2Fevil.example");
      render(await AbonnementPage({}));
      await userEvent.click(screen.getByText("Ouvrir les 5 parcours · 2,99 €/mois"));
      expect(JSON.parse(checkoutCalls(fetchMock)[1][1].body)).toEqual({});
    });
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
      expect(screen.getByText("Ouvrir les 5 parcours · 2,99 €/mois")).toBeInTheDocument();
      expect(document.body.textContent).not.toMatch(/24,99|annuel|par an|\/an/i);
    });

    it("?plan=annual ignoré : le checkout reste mensuel (corps historique)", async () => {
      delete process.env.STRIPE_PREMIUM_ANNUAL_PRICE_ID;
      window.history.pushState({}, "", "/abonnement?plan=annual");
      useSession.mockReturnValue({ status: "authenticated" });
      render(await AbonnementPage({}));
      await userEvent.click(screen.getByText("Ouvrir les 5 parcours · 2,99 €/mois"));
      expect(JSON.parse(checkoutCalls(fetchMock)[0][1].body)).toEqual({});
    });
  });

  describe("avec STRIPE_PREMIUM_ANNUAL_PRICE_ID", () => {
    beforeEach(() => {
      process.env.STRIPE_PREMIUM_ANNUAL_PRICE_ID = "price_test_annual_1";
    });

    it("sélecteur de formule, mensuel coché par défaut", async () => {
      useSession.mockReturnValue({ status: "authenticated" });
      render(await AbonnementPage({}));
      expect(screen.getByRole("radio", { name: "Mensuel" })).toBeChecked();
      expect(screen.getByRole("radio", { name: "Annuel" })).not.toBeChecked();
      expect(screen.getByText("Ouvrir les 5 parcours · 2,99 €/mois")).toBeInTheDocument();
    });

    it("annuel : 24,99 €/an, « Soit 2,08 € par mois, plus de 3 mois offerts. » (concision v5), envoi plan=annual", async () => {
      useSession.mockReturnValue({ status: "authenticated" });
      render(await AbonnementPage({}));
      await userEvent.click(screen.getByRole("radio", { name: "Annuel" }));
      expect(screen.getByText("24,99 €")).toBeInTheDocument();
      expect(screen.getByText("Soit 2,08 € par mois, plus de 3 mois offerts.")).toBeInTheDocument();
      expect(document.body.textContent).not.toMatch(/Payé en une fois|économisés/);
      expect(document.body.textContent).not.toMatch(/4 mois/);
      const text = document.body.textContent ?? "";
      expect(text).not.toMatch(/4 mois/);
      expect(text).not.toContain("—");
      await userEvent.click(screen.getByText("Ouvrir les 5 parcours · 24,99 €/an"));
      expect(JSON.parse(checkoutCalls(fetchMock)[0][1].body)).toEqual({ plan: "annual" });
    });

    it("lot 2 s21 : dès l’état mensuel, l’annuel est montré et « plus de 3 mois offerts » n’est dit qu’une fois", async () => {
      useSession.mockReturnValue({ status: "unauthenticated" });
      render(await AbonnementPage({}));
      expect(screen.getByTestId("annuel-mois-offerts")).toHaveTextContent("plus de 3 mois offerts");
      expect(screen.getByTestId("annuel-ligne-mensuel")).toHaveTextContent("Ou 24,99 €/an, soit 2,08 € par mois.");
      const compte = (t: string) => (t.match(/mois offerts/g) ?? []).length;
      /** Texte perçu : sans les éléments `aria-hidden` (invisibles, gardés pour la mise en page). */
      const texteAccessible = (racine: HTMLElement) => {
        const copie = racine.cloneNode(true) as HTMLElement;
        copie.querySelectorAll("[aria-hidden='true']").forEach((el) => el.remove());
        return copie.textContent ?? "";
      };
      expect(compte(texteAccessible(document.body))).toBe(1);
      expect(document.body.textContent).not.toContain("Sans engagement, annulable");
      expect(screen.getByText("2,99 €")).toBeInTheDocument();
      // Correctif s21 (QA 375 px) : la pastille est rattachée à « Annuel » (même colonne,
      // annoncée avec l'option), jamais à « Mensuel », quelle que soit la largeur.
      const pastille = screen.getByTestId("annuel-mois-offerts");
      const radioAnnuel = screen.getByRole("radio", { name: "Annuel" });
      const radioMensuel = screen.getByRole("radio", { name: "Mensuel" });
      expect(pastille.parentElement).toContainElement(radioAnnuel);
      expect(pastille.parentElement).not.toContainElement(radioMensuel);
      expect(radioAnnuel).toHaveAttribute("aria-describedby", pastille.id);
      expect(radioMensuel).not.toHaveAttribute("aria-describedby");
      // Annuel choisi : la ligne sous le prix le dit, la pastille s'efface (jamais deux fois
      // pour l'œil ni pour un lecteur d'écran). Revue design s21 m2 : effacée mais gardée
      // dans le flux (invisible, aria-hidden), pour que le prix et le bouton ne bougent pas.
      await userEvent.click(screen.getByRole("radio", { name: "Annuel" }));
      for (const id of ["annuel-mois-offerts", "annuel-ligne-mensuel"]) {
        expect(screen.getByTestId(id)).toHaveAttribute("aria-hidden", "true");
        expect(screen.getByTestId(id).className).toContain("invisible");
      }
      expect(radioAnnuel).not.toHaveAttribute("aria-describedby");
      expect(compte(texteAccessible(document.body))).toBe(1);
      // Retour au mensuel : les lignes de l'annuel s'effacent à leur tour.
      await userEvent.click(screen.getByRole("radio", { name: "Mensuel" }));
      expect(screen.getByTestId("annuel-ligne-mensuel")).not.toHaveAttribute("aria-hidden");
      // Revue design v2 (point 1) : la ligne d'économie porte elle-même aria-hidden ;
      // « Payé en une fois… » n'est rendu qu'en annuel.
      expect(screen.getByText(/^Soit 2,08/)).toHaveAttribute("aria-hidden", "true");
      expect(screen.queryByText(/^Payé en une fois/)).not.toBeInTheDocument();
      expect(compte(texteAccessible(document.body))).toBe(1);
    });

    it("mensuel choisi : corps historique, sans plan", async () => {
      useSession.mockReturnValue({ status: "authenticated" });
      render(await AbonnementPage({}));
      await userEvent.click(screen.getByText("Ouvrir les 5 parcours · 2,99 €/mois"));
      expect(JSON.parse(checkoutCalls(fetchMock)[0][1].body)).toEqual({});
    });

    it("anonyme : le choix annuel survit à l’inscription (callback plan=annual + returnTo)", async () => {
      window.history.pushState({}, "", "/abonnement?returnTo=%2Fcarnet");
      useSession.mockReturnValue({ status: "unauthenticated" });
      render(await AbonnementPage({}));
      await userEvent.click(screen.getByRole("radio", { name: "Annuel" }));
      expect(registerParams("Ouvrir les 5 parcours · 24,99 €/an").get("callbackUrl")).toBe(
        "/abonnement?returnTo=%2Fcarnet&plan=annual",
      );
    });

    it("?plan=annual préselectionne l’annuel", async () => {
      window.history.pushState({}, "", "/abonnement?plan=annual");
      useSession.mockReturnValue({ status: "authenticated" });
      render(await AbonnementPage({}));
      expect(screen.getByRole("radio", { name: "Annuel" })).toBeChecked();
    });
  });

  describe("mesure Umami du tunnel (s15)", () => {
    beforeEach(() => mockTrack.mockClear());
    afterEach(() => window.history.pushState({}, "", "/"));

    it("retour Stripe sans paiement (upgrade=cancel) : abonnement-annule", async () => {
      window.history.pushState({}, "", "/abonnement?upgrade=cancel");
      useSession.mockReturnValue({ status: "authenticated" });
      render(await AbonnementPage({}));
      expect(mockTrack).toHaveBeenCalledWith("abonnement-annule");
    });

    it("visite normale : aucun abonnement-annule", async () => {
      useSession.mockReturnValue({ status: "authenticated" });
      render(await AbonnementPage({}));
      expect(mockTrack).not.toHaveBeenCalledWith("abonnement-annule");
    });

    it("clic paiement : abonnement-clic avec formule et source", async () => {
      useSession.mockReturnValue({ status: "authenticated" });
      global.fetch = jest.fn().mockResolvedValue({ ok: false, status: 500, json: async () => ({}) }) as unknown as typeof fetch;
      render(await AbonnementPage({}));
      await userEvent.click(screen.getByText("Ouvrir les 5 parcours · 2,99 €/mois"));
      expect(mockTrack).toHaveBeenCalledWith("abonnement-clic", {
        formule: "mensuel",
        src: "abonnement",
        declencheur: "manuel",
        statut: "membre",
      });
    });
  });
});
