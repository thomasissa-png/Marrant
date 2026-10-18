import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PremiumModal } from "@/components/premium/premium-modal";
import { FENETRE_PREMIUM } from "@/config/textes/cta-pages";
import { REASSURANCE_UNIQUE } from "@/config/textes/offre";

jest.mock("next-auth/react", () => ({ useSession: jest.fn() }));
jest.mock("@/hooks/use-content-stats", () => ({
  useContentStats: () => ({ jokes: 100, tips: 100, videos: 50, members: 0 }),
}));
jest.mock("@/components/ui/toast", () => ({ toast: jest.fn() }));
const mockTrack = jest.fn();
jest.mock("@/lib/umami", () => ({ trackUmami: (...args: unknown[]) => mockTrack(...args) }));

const { useSession } = require("next-auth/react");

const T = FENETRE_PREMIUM;

describe("PremiumModal (concision v5 : titre, prix, plein, REASS par geste)", () => {
  afterEach(() => window.history.pushState({}, "", "/"));

  it.each([
    ["vanne", "Mets-la de côté", "Je m’abonne et je la garde"],
    ["conseil", "Garde-le sous le coude", "Je m’abonne et je le garde"],
    ["video", "Garde-la pour la revoir", "Je m’abonne et je la garde"],
  ] as const)("favori sur un(e) %s : titre et bouton v5", (contenu, titre, bouton) => {
    useSession.mockReturnValue({ status: "unauthenticated" });
    render(<PremiumModal isOpen onClose={jest.fn()} reason="favoris" contenu={contenu} />);
    expect(screen.getByRole("heading", { name: titre })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: bouton })).toBeInTheDocument();
  });

  it("vote : titre et bouton dédiés", () => {
    useSession.mockReturnValue({ status: "unauthenticated" });
    render(<PremiumModal isOpen onClose={jest.fn()} reason="vote" />);
    expect(T.vote.vanne.titre).toBe("Voter, et tout le reste : Premium");
    expect(screen.getByRole("heading", { name: /^Voter, et tout le reste\s:\sPremium$/ })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Je m’abonne et je vote" })).toBeInTheDocument();
  });

  it("carte floutée : même titre et même bouton pour les 3 listes", () => {
    useSession.mockReturnValue({ status: "unauthenticated" });
    const { rerender } = render(<PremiumModal isOpen onClose={jest.fn()} reason="carte" contenu="vanne" />);
    expect(screen.getByRole("heading", { name: "Le reste de la liste est juste derrière" })).toBeInTheDocument();
    rerender(<PremiumModal isOpen onClose={jest.fn()} reason="carte" contenu="conseil" />);
    expect(screen.getByRole("link", { name: "Je m’abonne et j’ouvre toute la liste" })).toBeInTheDocument();
  });

  it.each([
    ["favoris", "vanne"],
    ["vote", "conseil"],
    ["carte", "video"],
  ] as const)("4 éléments visibles seulement (%s, %s), visiteur et compte connecté", (reason, contenu) => {
    for (const status of ["unauthenticated", "authenticated"] as const) {
      useSession.mockReturnValue({ status, data: status === "authenticated" ? { user: { plan: "FREE" } } : undefined });
      const { unmount } = render(<PremiumModal isOpen onClose={jest.fn()} reason={reason} contenu={contenu} />);
      const t = T[reason === "favoris" ? "favori" : reason][contenu];
      const texte = (document.body.textContent ?? "").replace(/\u00a0/g, " ");
      expect(texte).toBe(`${t.titre}2,99 €TTC / mois${t.bouton}${REASSURANCE_UNIQUE}`.replace(/\u00a0/g, " "));
      expect(texte).not.toMatch(/Deux étapes|reste là|Avec Premium|étape 1|rétractation|Sans engagement/i);
      unmount();
    }
  });

  it("anonyme : inscription puis /abonnement avec retour à la page courante", async () => {
    window.history.pushState({}, "", "/vannes?page=2");
    useSession.mockReturnValue({ status: "unauthenticated" });
    render(<PremiumModal isOpen onClose={jest.fn()} reason="favoris" />);
    const href = screen.getByRole("link", { name: T.favori.vanne.bouton }).getAttribute("href") ?? "";
    const params = new URL(href, "https://deviens-marrant.fr").searchParams;
    expect(href.startsWith("/register?")).toBe(true);
    // s21 (QA M1) : la source revient avec le callback, jusqu'à checkout-ouvert.
    expect(params.get("callbackUrl")).toBe("/abonnement?returnTo=%2Fvannes%3Fpage%3D2&src=modale-favoris");
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

    it("visiteur : clic vers l’abonnement mesuré avec sa source", async () => {
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
