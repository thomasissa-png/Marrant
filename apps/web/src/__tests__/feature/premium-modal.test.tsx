import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PremiumModal } from "@/components/premium/premium-modal";
import { FENETRE_GARANTIE, FENETRE_PREMIUM, fenetreLienEtape1 } from "@/config/textes/cta-pages";

jest.mock("next-auth/react", () => ({ useSession: jest.fn() }));
jest.mock("@/hooks/use-content-stats", () => ({
  useContentStats: () => ({ jokes: 100, tips: 100, videos: 50, members: 0 }),
}));
jest.mock("@/components/ui/toast", () => ({ toast: jest.fn() }));
const mockTrack = jest.fn();
jest.mock("@/lib/umami", () => ({ trackUmami: (...args: unknown[]) => mockTrack(...args) }));

const { useSession } = require("next-auth/react");

const T = FENETRE_PREMIUM;

describe("PremiumModal (s21 B11 : un titre, une intro et un bouton par geste)", () => {
  afterEach(() => window.history.pushState({}, "", "/"));

  it.each([
    ["vanne", "Garde-la pour le soir où tu en auras besoin"],
    ["conseil", "Garde-le pour le soir où tu en auras besoin"],
    ["video", "Garde-la pour le soir où tu en auras besoin"],
  ] as const)("favori sur un(e) %s : titre accordé", (contenu, titre) => {
    useSession.mockReturnValue({ status: "unauthenticated" });
    render(<PremiumModal isOpen onClose={jest.fn()} reason="favoris" contenu={contenu} />);
    expect(screen.getByRole("heading", { name: titre })).toBeInTheDocument();
    expect(screen.getByText(T.favori[contenu].intro)).toBeInTheDocument();
    expect(screen.getByText(T.favori[contenu].avantage)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: T.favori[contenu].bouton })).toBeInTheDocument();
  });

  it("vote : titre et bouton dédiés", () => {
    useSession.mockReturnValue({ status: "unauthenticated" });
    render(<PremiumModal isOpen onClose={jest.fn()} reason="vote" />);
    expect(screen.getByRole("heading", { name: T.vote.vanne.titre })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Je m'abonne et je vote" })).toBeInTheDocument();
  });

  it("carte floutée : filtre par catégorie sur /vannes, par niveau et catégorie ailleurs", () => {
    useSession.mockReturnValue({ status: "unauthenticated" });
    const { rerender } = render(<PremiumModal isOpen onClose={jest.fn()} reason="carte" contenu="vanne" />);
    expect(screen.getByText(T.carte.vanne.avantage)).toBeInTheDocument();
    expect(T.carte.vanne.avantage).toContain("le filtre par catégorie");
    rerender(<PremiumModal isOpen onClose={jest.fn()} reason="carte" contenu="conseil" />);
    expect(screen.getByText(T.carte.conseil.avantage)).toBeInTheDocument();
    expect(T.carte.conseil.avantage).toContain("les filtres par niveau et par catégorie");
  });

  it("plus de « Droit de rétractation » ni de « Sans engagement » ; une seule ligne de garantie (choix du 18/10)", () => {
    useSession.mockReturnValue({ status: "unauthenticated" });
    render(<PremiumModal isOpen onClose={jest.fn()} reason="favoris" />);
    const text = document.body.textContent ?? "";
    expect(text).not.toMatch(/rétractation|Sans engagement/i);
    expect(screen.getAllByText(FENETRE_GARANTIE)).toHaveLength(1);
    expect(screen.getByText("TTC / mois")).toBeInTheDocument();
  });

  it("lien discret vers l'étape 1 gratuite (Répartie par défaut, parcours passé sinon)", () => {
    useSession.mockReturnValue({ status: "unauthenticated" });
    const { rerender } = render(<PremiumModal isOpen onClose={jest.fn()} reason="favoris" />);
    expect(screen.getByRole("link", { name: fenetreLienEtape1("repartie") }).getAttribute("href")).toMatch(
      /^\/parcours\/repartie\?/,
    );
    rerender(<PremiumModal isOpen onClose={jest.fn()} reason="favoris" parcours="confiance" />);
    expect(screen.getByRole("link", { name: fenetreLienEtape1("confiance") })).toBeInTheDocument();
  });

  it("anonyme : inscription puis /abonnement avec retour à la page courante", async () => {
    window.history.pushState({}, "", "/vannes?page=2");
    useSession.mockReturnValue({ status: "unauthenticated" });
    render(<PremiumModal isOpen onClose={jest.fn()} reason="favoris" />);
    const href = screen.getByRole("link", { name: T.favori.vanne.bouton }).getAttribute("href") ?? "";
    const params = new URL(href, "https://deviens-marrant.fr").searchParams;
    expect(href.startsWith("/register?")).toBe(true);
    expect(params.get("callbackUrl")).toBe("/abonnement?returnTo=%2Fvannes%3Fpage%3D2");
    expect(params.get("src")).toBe("modale-favoris");
  });

  it("connecté : clic paiement mesuré, checkout avec returnTo de la page courante", async () => {
    window.history.pushState({}, "", "/parcours/repartie");
    useSession.mockReturnValue({ status: "authenticated" });
    const fetchMock = jest.fn().mockResolvedValue({ ok: false, status: 500, json: async () => ({}) });
    global.fetch = fetchMock as unknown as typeof fetch;
    render(<PremiumModal isOpen onClose={jest.fn()} reason="carte" />);
    await userEvent.click(screen.getByRole("button", { name: T.carte.vanne.bouton }));
    expect(mockTrack).toHaveBeenCalledWith("abonnement-clic", {
      formule: "mensuel",
      src: "modale-carte",
      declencheur: "manuel",
      statut: "membre",
    });
    expect(fetchMock).toHaveBeenCalledWith("/api/stripe/checkout", expect.objectContaining({ method: "POST" }));
    expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toEqual({ returnTo: "/parcours/repartie" });
  });

  describe("mesure (audit parcours s16, lot C)", () => {
    beforeEach(() => mockTrack.mockClear());

    it("ouverture : mur-vu avec le type de mur", () => {
      useSession.mockReturnValue({ status: "unauthenticated" });
      render(<PremiumModal isOpen onClose={jest.fn()} reason="favoris" />);
      expect(mockTrack).toHaveBeenCalledWith("mur-vu", { type: "modale-favoris", src: "modale" });
    });

    it("fermée : aucun mur-vu", () => {
      useSession.mockReturnValue({ status: "unauthenticated" });
      render(<PremiumModal isOpen={false} onClose={jest.fn()} reason="vote" />);
      expect(mockTrack).not.toHaveBeenCalledWith("mur-vu", expect.anything());
    });

    it("visiteur : clic vers l'abonnement mesuré avec sa source", async () => {
      useSession.mockReturnValue({ status: "unauthenticated" });
      const onClose = jest.fn();
      render(<PremiumModal isOpen onClose={onClose} reason="vote" />);
      await userEvent.click(screen.getByRole("link", { name: T.vote.vanne.bouton }));
      expect(mockTrack).toHaveBeenCalledWith("abonnement-clic", {
        formule: "mensuel",
        src: "modale-vote",
        statut: "visiteur",
      });
      expect(onClose).toHaveBeenCalled();
    });
  });
});
