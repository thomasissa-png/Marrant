import { render, screen } from "@testing-library/react";
import { ABONNEMENT_CTA, ABONNEMENT_HAUT_PAR_PARCOURS } from "@/config/textes/cta-pages";
import userEvent from "@testing-library/user-event";
import AbonnementPage from "@/app/(dashboard)/abonnement/page";
import { AbonnementView } from "@/components/premium/abonnement-view";
import { BOULOT_PUBLIE, STORYTELLING_PUBLIE } from "@/config/parcours-publication";

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

describe("s21 B16 : /abonnement visiteur", () => {
  it.each([
    ["machine-a-cafe", "Ta réplique pendant la réunion, pas dans l'ascenseur d'après"],
    ["boulot", "Ta réplique pendant la réunion, pas dans l'ascenseur d'après"],
    ["confiance", "Le rire, à ton rythme, sans te forcer"],
    ["storytelling", "Ta réplique pendant la soirée, pas dans le bus du retour"],
  ] as const)("parcours d'origine %s : surtitre et titre dédiés", (slug, titre) => {
    useSession.mockReturnValue({ status: "unauthenticated" });
    render(<AbonnementView annualAvailable={false} parcoursOrigine={slug} />);
    expect(screen.getByRole("heading", { level: 1, name: titre })).toBeInTheDocument();
    expect(screen.getByTestId("abonnement-surtitre")).toHaveTextContent(ABONNEMENT_HAUT_PAR_PARCOURS[slug].surtitre);
  });

  it("[S32] sous le bouton, carte « Étape 2 » avant l'extrait du carnet", () => {
    useSession.mockReturnValue({ status: "unauthenticated" });
    const { container } = render(
      <AbonnementView
        annualAvailable={false}
        etapeSuivante={<div data-testid="carte-etape-2" />}
        carnetExtrait={<div data-testid="carnet" />}
      />,
    );
    expect(screen.getByTestId("abonnement-suite")).toHaveTextContent(ABONNEMENT_CTA.suite);
    const html = container.innerHTML;
    expect(html.indexOf("abonnement-bouton-achat")).toBeLessThan(html.indexOf("abonnement-suite"));
    expect(html.indexOf("abonnement-suite")).toBeLessThan(html.indexOf("reassurance-paiement"));
    expect(html.indexOf("carte-etape-2")).toBeLessThan(html.indexOf('data-testid="carnet"'));
  });
});

describe("AbonnementPage (s12 T45)", () => {
  it("visiteur : un seul bloc Premium, plus de bloc « Compte gratuit » (s15)", () => {
    useSession.mockReturnValue({ status: "unauthenticated" });
    render(<AbonnementPage />);
    expect(screen.queryByText("Compte gratuit")).not.toBeInTheDocument();
    expect(screen.queryByText(/Crée ton compte gratuit/)).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Premium" })).toBeInTheDocument();
    // Surtitre, H1 et sous-titre validés ensemble à l'aveugle (lot 2 s21, tour 3) ;
    // décision Thomas 17/10 : le H1 validé remplace « Accéder aux parcours complets ».
    expect(
      screen.getByRole("heading", { level: 1, name: "Ta réplique pendant la soirée, pas dans le bus du retour" }),
    ).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Accéder aux parcours complets" })).not.toBeInTheDocument();
    // s21 B16 : surtitre par parcours d'origine, défaut = Répartie (tour 4).
    expect(screen.getByTestId("abonnement-surtitre")).toHaveTextContent(
      "Pour toi si tu trouves la bonne réponse, mais avec un temps de retard",
    );
    expect(
      screen.getByText(
        "5 parcours pour t'entraîner, une étape par semaine, 15 à 20 minutes selon le parcours. La première étape de chacun reste en lecture libre.",
      ),
    ).toBeInTheDocument();
    expect(document.body.textContent).not.toMatch(/compte gratuit|sans carte/i);
    // Fin de l'offre de lancement (01/10/2026) : plus aucun badge « Prix de lancement ».
    expect(screen.queryByText("Prix de lancement")).not.toBeInTheDocument();
  });

  it("lot 2 s21 : premier écran visiteur mot pour mot et dans l'ordre, bouton avant les avantages (§5.2, §5.3)", () => {
    useSession.mockReturnValue({ status: "unauthenticated" });
    render(<AbonnementView annualAvailable carnetExtrait={null} />);
    // Texte perçu (vue et lecteur d'écran) : sans les lignes de la formule non choisie,
    // gardées invisibles et `aria-hidden` pour la stabilité de la mise en page (revue design s21 m2).
    const perceptible = document.body.cloneNode(true) as HTMLElement;
    perceptible.querySelectorAll("[aria-hidden='true']").forEach((el) => el.remove());
    const texte = (perceptible.textContent ?? "").replace(/\s+/g, " ");
    const lignes = [
      "Pour toi si tu trouves la bonne réponse, mais avec un temps de retard",
      "Ta réplique pendant la soirée, pas dans le bus du retour",
      "5 parcours pour t'entraîner, une étape par semaine, 15 à 20 minutes selon le parcours. La première étape de chacun reste en lecture libre.",
      "Premium",
      "Mensuel",
      "Annuel",
      "plus de 3 mois offerts",
      // « 2,99 € » et « TTC / mois » : deux spans séparés par l'espacement flex (gap), sans espace dans le texte.
      "2,99 €",
      "TTC / mois",
      "Ou 24,99 €/an, soit 2,08 € par mois et 10,89 € économisés par an.",
      "Ouvrir les 5 parcours · 2,99 €/mois",
      // s21 B16 : [S32] juste sous le bouton, avant la garantie.
      "Deux étapes : ton compte, puis le paiement sécurisé par Stripe.",
      "Tu as 14 jours pour te faire rembourser ton premier paiement, et tu résilies en ligne quand tu veux.",
      "Droit de rétractation · Paiement sécurisé par Stripe",
      // §5.2 / §7 point 3 (choix de Thomas) : les avantages viennent APRÈS le bouton d'achat.
      "Les 5 parcours en entier",
      "Le carnet mensuel de situations de répartie",
      "Tes favoris",
      "Les listes complètes",
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

  it("lot 2 s21 : l'extrait du carnet s'insère après la carte, avant « Pas encore sûr ? »", () => {
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

  it("paid CTA keeps /abonnement as the destination", () => {
    useSession.mockReturnValue({ status: "unauthenticated" });
    render(<AbonnementPage />);
    const params = registerParams("Ouvrir les 5 parcours · 2,99 €/mois");
    expect(params.get("callbackUrl")).toBe("/abonnement");
    expect(params.get("src")).toBe("abonnement");
  });

  it("shows only the paid card with the checkout button to signed-in users", () => {
    useSession.mockReturnValue({ status: "authenticated" });
    render(<AbonnementPage />);
    expect(screen.queryByText("Compte gratuit")).not.toBeInTheDocument();
    expect(screen.getByText("Active mon accès · 2,99 €/mois")).toBeInTheDocument();
  });

  describe("offre Premium vraie (décision Thomas 03/10)", () => {
    afterEach(() => window.history.pushState({}, "", "/"));

    it("met les 3 parcours en avant et ne vend plus le gratuit ni l'inexistant", () => {
      useSession.mockReturnValue({ status: "unauthenticated" });
      render(<AbonnementPage />);
      expect(screen.getByText(`Les ${3 + (STORYTELLING_PUBLIE ? 1 : 0) + (BOULOT_PUBLIE ? 1 : 0)} parcours en entier`)).toBeInTheDocument();
      const text = document.body.textContent ?? "";
      expect(text).toContain("Machine à Café (15 min/semaine), Répartie (20 min/semaine), Confiance (20 min/semaine)");
      expect(text).toContain("La première étape de chaque parcours est offerte");
      // Seul contenu mensuel vendu : le carnet, qui existe (décision 03/10/2026).
      expect(text).toContain("Le carnet mensuel de situations de répartie");
      expect(text.replace("(nouveau chaque mois)", "")).not.toMatch(/Contenu quotidien|Filtres avancés|illimit|chaque mois|annuel|par an/i);
      expect(text).not.toContain("\u2014");
    });

    it("anonyme : le CTA payant garde l'intention d'origine (returnTo)", async () => {
      window.history.pushState({}, "", "/abonnement?returnTo=%2Fparcours%2Frepartie");
      useSession.mockReturnValue({ status: "unauthenticated" });
      render(<AbonnementPage />);
      expect(registerParams("Ouvrir les 5 parcours · 2,99 €/mois").get("callbackUrl")).toBe(
        "/abonnement?returnTo=%2Fparcours%2Frepartie",
      );
    });

    it("connecté : returnTo transmis au checkout, valeur externe ignorée", async () => {
      useSession.mockReturnValue({ status: "authenticated" });
      const fetchMock = jest.fn().mockResolvedValue({ ok: false, status: 500, json: async () => ({}) });
      global.fetch = fetchMock as unknown as typeof fetch;

      window.history.pushState({}, "", "/abonnement?returnTo=%2Fparcours%2Fconfiance");
      const { unmount } = render(<AbonnementPage />);
      await userEvent.click(screen.getByText("Active mon accès · 2,99 €/mois"));
      expect(JSON.parse(checkoutCalls(fetchMock)[0][1].body)).toEqual({ returnTo: "/parcours/confiance" });
      unmount();

      window.history.pushState({}, "", "/abonnement?returnTo=https%3A%2F%2Fevil.example");
      render(<AbonnementPage />);
      await userEvent.click(screen.getByText("Active mon accès · 2,99 €/mois"));
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
    it.each([undefined, "", "price_XXXXXXXXXXXXXXXXXXXX"])("valeur %p : aucune trace de l'annuel", (value) => {
      if (value === undefined) delete process.env.STRIPE_PREMIUM_ANNUAL_PRICE_ID;
      else process.env.STRIPE_PREMIUM_ANNUAL_PRICE_ID = value;
      useSession.mockReturnValue({ status: "authenticated" });
      render(<AbonnementPage />);
      expect(screen.queryByRole("radio")).not.toBeInTheDocument();
      expect(screen.getByText("Active mon accès · 2,99 €/mois")).toBeInTheDocument();
      expect(document.body.textContent).not.toMatch(/24,99|annuel|par an|\/an/i);
    });

    it("?plan=annual ignoré : le checkout reste mensuel (corps historique)", async () => {
      delete process.env.STRIPE_PREMIUM_ANNUAL_PRICE_ID;
      window.history.pushState({}, "", "/abonnement?plan=annual");
      useSession.mockReturnValue({ status: "authenticated" });
      render(<AbonnementPage />);
      await userEvent.click(screen.getByText("Active mon accès · 2,99 €/mois"));
      expect(JSON.parse(checkoutCalls(fetchMock)[0][1].body)).toEqual({});
    });
  });

  describe("avec STRIPE_PREMIUM_ANNUAL_PRICE_ID", () => {
    beforeEach(() => {
      process.env.STRIPE_PREMIUM_ANNUAL_PRICE_ID = "price_test_annual_1";
    });

    it("sélecteur de formule, mensuel coché par défaut", () => {
      useSession.mockReturnValue({ status: "authenticated" });
      render(<AbonnementPage />);
      expect(screen.getByRole("radio", { name: "Mensuel" })).toBeChecked();
      expect(screen.getByRole("radio", { name: "Annuel" })).not.toBeChecked();
      expect(screen.getByText("Active mon accès · 2,99 €/mois")).toBeInTheDocument();
    });

    it("annuel : 24,99 €/an, soit 2,08 € par mois, plus de 3 mois offerts et 10,89 € économisés (D5 s16), envoi plan=annual", async () => {
      useSession.mockReturnValue({ status: "authenticated" });
      render(<AbonnementPage />);
      await userEvent.click(screen.getByRole("radio", { name: "Annuel" }));
      expect(screen.getByText("24,99 €")).toBeInTheDocument();
      expect(
        screen.getByText("soit 2,08 € par mois, plus de 3 mois offerts, 10,89 € économisés par an"),
      ).toBeInTheDocument();
      expect(document.body.textContent).not.toMatch(/4 mois/);
      const text = document.body.textContent ?? "";
      expect(text).not.toMatch(/4 mois/);
      expect(text).not.toContain("—");
      await userEvent.click(screen.getByText("Active mon accès · 24,99 €/an"));
      expect(JSON.parse(checkoutCalls(fetchMock)[0][1].body)).toEqual({ plan: "annual" });
    });

    it("lot 2 s21 : dès l'état mensuel, l'annuel est montré et « plus de 3 mois offerts » n'est dit qu'une fois", async () => {
      useSession.mockReturnValue({ status: "unauthenticated" });
      render(<AbonnementPage />);
      expect(screen.getByTestId("annuel-mois-offerts")).toHaveTextContent("plus de 3 mois offerts");
      expect(screen.getByTestId("annuel-ligne-mensuel")).toHaveTextContent(
        "Ou 24,99 €/an, soit 2,08 € par mois et 10,89 € économisés par an.",
      );
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
      expect(screen.getByText(/^soit 2,08/).parentElement).toHaveAttribute("aria-hidden", "true");
      expect(compte(texteAccessible(document.body))).toBe(1);
    });

    it("mensuel choisi : corps historique, sans plan", async () => {
      useSession.mockReturnValue({ status: "authenticated" });
      render(<AbonnementPage />);
      await userEvent.click(screen.getByText("Active mon accès · 2,99 €/mois"));
      expect(JSON.parse(checkoutCalls(fetchMock)[0][1].body)).toEqual({});
    });

    it("anonyme : le choix annuel survit à l'inscription (callback plan=annual + returnTo)", async () => {
      window.history.pushState({}, "", "/abonnement?returnTo=%2Fcarnet");
      useSession.mockReturnValue({ status: "unauthenticated" });
      render(<AbonnementPage />);
      await userEvent.click(screen.getByRole("radio", { name: "Annuel" }));
      expect(registerParams("Ouvrir les 5 parcours · 24,99 €/an").get("callbackUrl")).toBe(
        "/abonnement?returnTo=%2Fcarnet&plan=annual",
      );
    });

    it("?plan=annual préselectionne l'annuel", () => {
      window.history.pushState({}, "", "/abonnement?plan=annual");
      useSession.mockReturnValue({ status: "authenticated" });
      render(<AbonnementPage />);
      expect(screen.getByRole("radio", { name: "Annuel" })).toBeChecked();
    });
  });

  describe("mesure Umami du tunnel (s15)", () => {
    beforeEach(() => mockTrack.mockClear());
    afterEach(() => window.history.pushState({}, "", "/"));

    it("retour Stripe sans paiement (upgrade=cancel) : abonnement-annule", () => {
      window.history.pushState({}, "", "/abonnement?upgrade=cancel");
      useSession.mockReturnValue({ status: "authenticated" });
      render(<AbonnementPage />);
      expect(mockTrack).toHaveBeenCalledWith("abonnement-annule");
    });

    it("visite normale : aucun abonnement-annule", () => {
      useSession.mockReturnValue({ status: "authenticated" });
      render(<AbonnementPage />);
      expect(mockTrack).not.toHaveBeenCalledWith("abonnement-annule");
    });

    it("clic paiement : abonnement-clic avec formule et source", async () => {
      useSession.mockReturnValue({ status: "authenticated" });
      global.fetch = jest.fn().mockResolvedValue({ ok: false, status: 500, json: async () => ({}) }) as unknown as typeof fetch;
      render(<AbonnementPage />);
      await userEvent.click(screen.getByText("Active mon accès · 2,99 €/mois"));
      expect(mockTrack).toHaveBeenCalledWith("abonnement-clic", {
        formule: "mensuel",
        src: "abonnement",
        declencheur: "manuel",
        statut: "membre",
      });
    });
  });
});
