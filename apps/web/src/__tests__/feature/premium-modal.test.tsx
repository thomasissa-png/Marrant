import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PremiumModal } from "@/components/premium/premium-modal";
import { FENETRE_COMPTE, FENETRE_PREMIUM } from "@/config/textes/cta-pages";
import { REASSURANCE_UNIQUE } from "@/config/textes/offre";
import { lie, sansGluon } from "../helpers/texte-normalise";

jest.mock("next-auth/react", () => ({ useSession: jest.fn() }));
jest.mock("@/hooks/use-content-stats", () => ({
  useContentStats: () => ({ jokes: 100, tips: 100, videos: 50, members: 0 }),
}));
jest.mock("@/components/ui/toast", () => ({ toast: jest.fn() }));
const mockTrack = jest.fn();
jest.mock("@/lib/umami", () => ({ trackUmami: (...args: unknown[]) => mockTrack(...args) }));

const { useSession } = require("next-auth/react");

const T = FENETRE_PREMIUM;

describe("PremiumModal (textes-trajet-v2 §2.4 : titre, rappel, ligne Premium, prix, plein, ligne compte, REASS)", () => {
  afterEach(() => window.history.pushState({}, "", "/"));

  it.each([
    // Variante B du §6 point 8 : la vanne est ajoutée aux favoris après le paiement (prouvé en E2E local).
    ["vanne", "Garde-la avec Premium", "S’abonner et la garder"],
    ["conseil", "Les favoris, c’est Premium", "S’abonner et tout ouvrir"],
    ["video", "Les favoris, c’est Premium", "S’abonner et tout ouvrir"],
  ] as const)("favori sur un(e) %s : titre et bouton v2", (contenu, titre, bouton) => {
    useSession.mockReturnValue({ status: "unauthenticated" });
    render(<PremiumModal isOpen onClose={jest.fn()} reason="favoris" contenu={contenu} />);
    expect(screen.getByRole("heading", { name: lie(titre) })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: bouton })).toBeInTheDocument();
  });

  it("vote : titre et bouton dédiés", () => {
    useSession.mockReturnValue({ status: "unauthenticated" });
    render(<PremiumModal isOpen onClose={jest.fn()} reason="vote" />);
    expect(T.vote.vanne.titre).toBe("Voter, et tout le reste : Premium");
    expect(screen.getByRole("heading", { name: /^Voter, et tout le reste\s:\sPremium$/ })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "S’abonner et voter" })).toBeInTheDocument();
  });

  it("carte floutée : même titre et même bouton pour les 3 listes", () => {
    useSession.mockReturnValue({ status: "unauthenticated" });
    const { rerender } = render(<PremiumModal isOpen onClose={jest.fn()} reason="carte" contenu="vanne" />);
    expect(screen.getByRole("heading", { name: "Le reste de la liste est juste derrière" })).toBeInTheDocument();
    rerender(<PremiumModal isOpen onClose={jest.fn()} reason="carte" contenu="conseil" />);
    expect(screen.getByRole("link", { name: "S’abonner et ouvrir la liste" })).toBeInTheDocument();
  });

  it.each([
    ["favoris", "vanne"],
    ["vote", "conseil"],
    ["carte", "video"],
  ] as const)("éléments visibles dans l'ordre (%s, %s) ; ligne compte pour le visiteur seulement", (reason, contenu) => {
    for (const status of ["unauthenticated", "authenticated"] as const) {
      useSession.mockReturnValue({ status, data: status === "authenticated" ? { user: { plan: "FREE" } } : undefined });
      const { unmount } = render(<PremiumModal isOpen onClose={jest.fn()} reason={reason} contenu={contenu} />);
      const t = T[reason === "favoris" ? "favori" : reason][contenu];
      const texte = sansGluon(document.body.textContent ?? "").replace(/\u00a0/g, " ");
      const compte = status === "unauthenticated" ? FENETRE_COMPTE : "";
      // Sans aperçu fourni : aucun rappel rendu (vide propre, W02).
      expect(texte).toBe(`${t.titre}${t.ligne ?? ""}1,99 €/mois${t.bouton}${compte}${REASSURANCE_UNIQUE}`.replace(/\u00a0/g, " "));
      expect(texte).not.toContain("TTC");
      expect(screen.queryByTestId("fenetre-rappel")).not.toBeInTheDocument();
      expect(texte).not.toMatch(/Deux étapes|reste là|étape 1|rétractation|Sans engagement/i);
      // Ancienne phrase « Avec Premium, … » (majuscule) ; « Garde-la avec Premium » (v2, §6 point 8) est permis.
      expect(texte).not.toMatch(/Avec Premium/);
      unmount();
    }
  });

  it("W02, v3 CT2 : rappel = phrases entières jusqu'à ≈ 110 caractères, guillemets français", () => {
    useSession.mockReturnValue({ status: "unauthenticated" });
    // La vanne réelle de T4 (75 caractères) : entière, sans « … ».
    const vanne = "Pour ta valise de départ, chacun a cotisé selon ses moyens. Moi, dix euros.";
    const { unmount } = render(<PremiumModal isOpen onClose={jest.fn()} reason="favoris" contenu="vanne" apercu={vanne} />);
    const lire = () => sansGluon(screen.getByTestId("fenetre-rappel").textContent ?? "").replace(/[\u00a0\u202f]/g, " ");
    expect(lire()).toBe(`« ${vanne} »`);
    // Ordre : titre, rappel, ligne Premium.
    const html = document.body.innerHTML;
    expect(html.indexOf("fenetre-rappel")).toBeLessThan(html.indexOf("Premium ouvre aussi"));
    unmount();
    // Première phrase trop longue : coupe au mot, jamais au milieu d'un mot, « … ».
    const long = `${"Une phrase vraiment très longue ".repeat(5)}qui dépasse largement la limite fixée.`;
    render(<PremiumModal isOpen onClose={jest.fn()} reason="favoris" contenu="vanne" apercu={long} />);
    const rappel = lire();
    expect(rappel).toMatch(/^« Une phrase .*\w… »$/);
    const coeur = rappel.slice(2, -3);
    expect(coeur.length).toBeLessThanOrEqual(110);
    expect(long.startsWith(coeur)).toBe(true);
    expect(long[coeur.length]).toBe(" ");
  });

  it("favori : l'élément cliqué est mémorisé dans returnTo, jusqu'au paiement (visiteur et compte gratuit)", async () => {
    window.history.pushState({}, "", "/vannes?page=2");
    useSession.mockReturnValue({ status: "unauthenticated" });
    const { unmount } = render(
      <PremiumModal isOpen onClose={jest.fn()} reason="favoris" contenu="vanne" favori={{ contentType: "JOKE", contentId: "cj42" }} />,
    );
    const href = screen.getByRole("link", { name: T.favori.vanne.bouton }).getAttribute("href") ?? "";
    const callback = new URL(href, "https://deviens-marrant.fr").searchParams.get("callbackUrl") ?? "";
    const returnTo = new URL(callback, "https://deviens-marrant.fr").searchParams.get("returnTo");
    expect(returnTo).toBe("/vannes?page=2&favori=JOKE.cj42");
    unmount();

    useSession.mockReturnValue({ status: "authenticated" });
    const fetchMock = jest.fn().mockResolvedValue({ ok: false, status: 500, json: async () => ({}) });
    global.fetch = fetchMock as unknown as typeof fetch;
    render(<PremiumModal isOpen onClose={jest.fn()} reason="favoris" contenu="conseil" favori={{ contentType: "TIP", contentId: "ct7" }} />);
    await userEvent.click(screen.getByRole("button", { name: T.favori.conseil.bouton }));
    expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toEqual({ returnTo: "/vannes?page=2&favori=TIP.ct7" });
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
