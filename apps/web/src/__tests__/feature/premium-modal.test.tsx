import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PremiumModal } from "@/components/premium/premium-modal";

jest.mock("next-auth/react", () => ({ useSession: jest.fn() }));
jest.mock("@/hooks/use-content-stats", () => ({
  useContentStats: () => ({ jokes: 100, tips: 100, videos: 50, members: 0 }),
}));
jest.mock("@/components/ui/toast", () => ({ toast: jest.fn() }));
const mockTrack = jest.fn();
jest.mock("@/lib/umami", () => ({ trackUmami: (...args: unknown[]) => mockTrack(...args) }));

const { useSession } = require("next-auth/react");

describe("PremiumModal (offre vraie, 03/10)", () => {
  afterEach(() => window.history.pushState({}, "", "/"));

  it("favoris : dit clairement que les favoris font partie de Premium", () => {
    useSession.mockReturnValue({ status: "unauthenticated" });
    render(<PremiumModal isOpen onClose={jest.fn()} reason="favoris" />);
    expect(screen.getByRole("heading", { name: "Les favoris font partie de Premium" })).toBeInTheDocument();
    expect(screen.getByText("Les 3 parcours en entier")).toBeInTheDocument();
  });

  it("raison vote (s15) : titre dédié", () => {
    useSession.mockReturnValue({ status: "unauthenticated" });
    render(<PremiumModal isOpen onClose={jest.fn()} reason="vote" />);
    expect(
      screen.getByRole("heading", { name: "Le vote sur les nouveautés fait partie de Premium" }),
    ).toBeInTheDocument();
  });

  it("ne vend ni le contenu quotidien ni des filtres avancés", () => {
    useSession.mockReturnValue({ status: "unauthenticated" });
    render(<PremiumModal isOpen onClose={jest.fn()} />);
    const text = document.body.textContent ?? "";
    // Seul contenu mensuel vendu : le carnet, qui existe (décision 03/10/2026).
    expect(text).toContain("Le carnet mensuel de situations de répartie");
    expect(text.replace("(nouveau chaque mois)", "")).not.toMatch(/Contenu quotidien|Filtres avancés|illimit|chaque mois|annuel/i);
    expect(text).toContain("La première étape de chaque parcours est offerte");
  });

  it("anonyme : inscription puis /abonnement avec retour à la page courante", async () => {
    window.history.pushState({}, "", "/vannes?page=2");
    useSession.mockReturnValue({ status: "unauthenticated" });
    render(<PremiumModal isOpen onClose={jest.fn()} reason="favoris" />);
    // s15 : lien direct /register (plus de 2e modale), destination et source conservées.
    const href = screen.getByText("Créer mon compte et m'abonner").closest("a")?.getAttribute("href") ?? "";
    const params = new URL(href, "https://deviens-marrant.fr").searchParams;
    expect(href.startsWith("/register?")).toBe(true);
    expect(params.get("callbackUrl")).toBe("/abonnement?returnTo=%2Fvannes%3Fpage%3D2");
    expect(params.get("src")).toBe("modale-favoris");
  });

  it("connecté : clic paiement mesuré (abonnement-clic, source modale)", async () => {
    useSession.mockReturnValue({ status: "authenticated" });
    global.fetch = jest.fn().mockResolvedValue({ ok: false, status: 500, json: async () => ({}) }) as unknown as typeof fetch;
    render(<PremiumModal isOpen onClose={jest.fn()} reason="defaut" />);
    await userEvent.click(screen.getByText("Active mon accès · 2,99 €/mois"));
    expect(mockTrack).toHaveBeenCalledWith("abonnement-clic", {
      formule: "mensuel",
      src: "modale-defaut",
      declencheur: "manuel",
      statut: "membre",
    });
  });

  it("connecté : checkout avec returnTo de la page courante", async () => {
    window.history.pushState({}, "", "/parcours/repartie");
    useSession.mockReturnValue({ status: "authenticated" });
    const fetchMock = jest.fn().mockResolvedValue({ ok: false, json: async () => ({}) });
    global.fetch = fetchMock as unknown as typeof fetch;
    render(<PremiumModal isOpen onClose={jest.fn()} />);
    await userEvent.click(screen.getByText("Active mon accès · 2,99 €/mois"));
    expect(fetchMock).toHaveBeenCalledWith("/api/stripe/checkout", expect.objectContaining({ method: "POST" }));
    expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toEqual({ returnTo: "/parcours/repartie" });
  });

  describe("audit parcours s16 (lot C)", () => {
    beforeEach(() => mockTrack.mockClear());

    it("ouverture : mur-vu avec le type de mur", () => {
      useSession.mockReturnValue({ status: "unauthenticated" });
      render(<PremiumModal isOpen onClose={jest.fn()} reason="favoris" />);
      expect(mockTrack).toHaveBeenCalledWith("mur-vu", { type: "modale-favoris", src: "modale" });
    });

    it("fermée : aucun mur-vu", () => {
      useSession.mockReturnValue({ status: "unauthenticated" });
      render(<PremiumModal isOpen={false} onClose={jest.fn()} />);
      expect(mockTrack).not.toHaveBeenCalledWith("mur-vu", expect.anything());
    });

    it("visiteur : clic vers l'abonnement mesuré avec sa source", async () => {
      useSession.mockReturnValue({ status: "unauthenticated" });
      const onClose = jest.fn();
      render(<PremiumModal isOpen onClose={onClose} reason="vote" />);
      await userEvent.click(screen.getByText("Créer mon compte et m'abonner"));
      expect(mockTrack).toHaveBeenCalledWith("abonnement-clic", {
        formule: "mensuel",
        src: "modale-vote",
        statut: "visiteur",
      });
      expect(onClose).toHaveBeenCalled();
    });

    it("réassurance TTC, 14 jours, résiliation près du bouton ; nom Premium", () => {
      useSession.mockReturnValue({ status: "authenticated" });
      render(<PremiumModal isOpen onClose={jest.fn()} />);
      expect(screen.getByText("Prix TTC · remboursé sous 14 jours · résiliable en ligne")).toBeInTheDocument();
      expect(screen.getByRole("heading", { name: "Passe à Premium" })).toBeInTheDocument();
      expect(document.body.textContent).not.toMatch(/accès complet/i);
    });
  });
});
