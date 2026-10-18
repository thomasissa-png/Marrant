import { render, screen, waitFor } from "@testing-library/react";
import { REGISTER_CTA } from "@/config/textes/cta-pages";
import userEvent from "@testing-library/user-event";
import RegisterPage from "@/app/(auth)/register/page";

const mockPush = jest.fn();
const mockRefresh = jest.fn();
const mockSignIn = jest.fn();

const mockSearchParams = new URLSearchParams();
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush, refresh: mockRefresh }),
  useSearchParams: () => mockSearchParams,
}));

jest.mock("next-auth/react", () => ({
  signIn: (...args: unknown[]) => mockSignIn(...args),
}));

const mockTrack = jest.fn();
jest.mock("@/lib/umami", () => ({
  trackUmami: (...args: unknown[]) => mockTrack(...args),
}));

async function fillAndSubmit() {
  await userEvent.type(screen.getByLabelText(/^Prénom/), "Jean");
  await userEvent.type(screen.getByLabelText("Email"), "jean@test.fr");
  await userEvent.type(screen.getByLabelText("Mot de passe"), "password1234545");
  await userEvent.click(screen.getByRole("button", { name: REGISTER_CTA.bouton }));
}

describe("RegisterPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
  });

  it("renders registration form", () => {
    render(<RegisterPage />);
    // Étalon 2.1 validé par Thomas (s15) : étape 1 sur 2, rappel formule et prix (TTC depuis s21).
    expect(screen.getByText("Étape 1 sur 2")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1, name: "Ton compte" })).toBeInTheDocument();
    expect(screen.getByText("Premium, 2,99 € TTC par mois, annulable à tout moment.")).toBeInTheDocument();
    expect(screen.getByText("Étape 2 : le paiement sécurisé, juste après.")).toBeInTheDocument();
    expect(screen.getByLabelText(/^Prénom/)).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Mot de passe")).toBeInTheDocument();
  });

  it("s21 B17 : prénom facultatif et en dernier, lien d'étape gratuite sous « Déjà un compte ? »", () => {
    mockSearchParams.set("callbackUrl", "/abonnement?returnTo=%2Fparcours%2Fconfiance");
    const { container } = render(<RegisterPage />);
    const ids = Array.from(container.querySelectorAll("input")).map((i) => i.id);
    expect(ids.indexOf("email")).toBeLessThan(ids.indexOf("password"));
    expect(ids.indexOf("password")).toBeLessThan(ids.indexOf("name"));
    expect(screen.getByLabelText(REGISTER_CTA.prenomLabel)).not.toBeRequired();
    const lien = screen.getByRole("link", { name: REGISTER_CTA.lienEtape1("confiance") });
    expect(lien).toHaveAttribute("href", "/parcours/confiance?src=abonnement#etape-1");
    const html = container.innerHTML;
    expect(html.indexOf("Déjà un compte")).toBeLessThan(html.indexOf('href="/parcours/confiance'));
    mockSearchParams.delete("callbackUrl");
  });

  it("s21 B17 : sans parcours d'origine, l'étape 1 de Répartie", () => {
    render(<RegisterPage />);
    expect(screen.getByRole("link", { name: REGISTER_CTA.lienEtape1("repartie") })).toBeInTheDocument();
  });

  it("s21 B17 : inscription sans prénom envoyée telle quelle", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({ ok: true, json: async () => ({ user: { id: "u" } }) });
    mockSignIn.mockResolvedValue({ ok: true });
    render(<RegisterPage />);
    await userEvent.type(screen.getByLabelText("Email"), "jean@test.fr");
    await userEvent.type(screen.getByLabelText("Mot de passe"), "password1234545");
    await userEvent.click(screen.getByRole("button", { name: REGISTER_CTA.bouton }));
    await waitFor(() => expect(global.fetch).toHaveBeenCalled());
    expect(JSON.parse((global.fetch as jest.Mock).mock.calls[0][1].body)).toEqual({
      name: "",
      email: "jean@test.fr",
      password: "password1234545",
    });
  });

  it("has submit button", () => {
    render(<RegisterPage />);
    expect(screen.getByRole("button", { name: REGISTER_CTA.bouton })).toBeInTheDocument();
  });

  it("has Google sign-up button", () => {
    render(<RegisterPage />);
    expect(screen.getByText("S'inscrire avec Google")).toBeInTheDocument();
  });

  it("has login link", () => {
    render(<RegisterPage />);
    expect(screen.getByText("Connecte-toi")).toBeInTheDocument();
  });

  it("shows password minimum length hint", () => {
    render(<RegisterPage />);
    expect(screen.getByText("Au moins 8 caractères")).toBeInTheDocument();
  });

  it("toggles password visibility", async () => {
    render(<RegisterPage />);
    const pwInput = screen.getByLabelText("Mot de passe");
    expect(pwInput).toHaveAttribute("type", "password");

    await userEvent.click(screen.getByLabelText("Afficher le mot de passe"));
    expect(pwInput).toHaveAttribute("type", "text");
  });

  it("posts to /api/auth/register and signs in on success", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ user: { id: "1" } }),
    });
    mockSignIn.mockResolvedValue({ error: null });

    render(<RegisterPage />);

    await userEvent.type(screen.getByLabelText(/^Prénom/), "Jean");
    await userEvent.type(screen.getByLabelText("Email"), "jean@test.fr");
    await userEvent.type(screen.getByLabelText("Mot de passe"), "password1234545");
    await userEvent.click(screen.getByRole("button", { name: REGISTER_CTA.bouton }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "Jean", email: "jean@test.fr", password: "password1234545" }),
      });
    });

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith("credentials", {
        email: "jean@test.fr",
        password: "password1234545",
        redirect: false,
      });
    });
  });

  it("redirects to /abonnement?auto=1 on success (no callbackUrl) : Stripe s'ouvre sans clic", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({}),
    });
    mockSignIn.mockResolvedValue({ error: null });

    render(<RegisterPage />);
    await userEvent.type(screen.getByLabelText(/^Prénom/), "Jean");
    await userEvent.type(screen.getByLabelText("Email"), "jean@test.fr");
    await userEvent.type(screen.getByLabelText("Mot de passe"), "password12345");
    await userEvent.click(screen.getByRole("button", { name: REGISTER_CTA.bouton }));

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/abonnement?auto=1");
    });
  });

  it("erreur API : message humain, jamais l'erreur brute (audit s16)", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => ({ error: "Erreur serveur" }),
    });

    render(<RegisterPage />);
    await userEvent.type(screen.getByLabelText(/^Prénom/), "Jean");
    await userEvent.type(screen.getByLabelText("Email"), "exists@test.fr");
    await userEvent.type(screen.getByLabelText("Mot de passe"), "password12345");
    await userEvent.click(screen.getByRole("button", { name: REGISTER_CTA.bouton }));

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent("Quelque chose a coincé de notre côté. Réessaie.");
    });
    expect(screen.queryByText("Erreur serveur")).not.toBeInTheDocument();
  });

  it("shows loading state", async () => {
    (global.fetch as jest.Mock).mockImplementation(() => new Promise(() => {}));
    render(<RegisterPage />);
    await userEvent.type(screen.getByLabelText(/^Prénom/), "Jean");
    await userEvent.type(screen.getByLabelText("Email"), "jean@test.fr");
    await userEvent.type(screen.getByLabelText("Mot de passe"), "password12345");
    await userEvent.click(screen.getByRole("button", { name: REGISTER_CTA.bouton }));

    expect(screen.getByText("On prépare ton compte…")).toBeInTheDocument();
  });

  it("calls Google signIn with /abonnement?auto=1 callback when no callbackUrl", async () => {
    render(<RegisterPage />);
    await userEvent.click(screen.getByText("S'inscrire avec Google"));
    // Marqueur de retour pour la mesure (AuthReturnTracker), s15.
    expect(mockSignIn).toHaveBeenCalledWith("google", { callbackUrl: "/abonnement?auto=1&auth=inscription-google" });
    expect(mockTrack).toHaveBeenCalledWith("inscription-envoi", { methode: "google", src: "direct", etape: "abonnement" });
  });

  describe("tunnel s15 : destination, source et mesure", () => {
    afterEach(() => {
      mockSearchParams.delete("callbackUrl");
      mockSearchParams.delete("src");
      mockSearchParams.delete("error");
    });

    it("email : inscription-envoi puis inscription-reussie avec la source", async () => {
      mockSearchParams.set("src", "blog-meilleures-blagues-droles-2026");
      (global.fetch as jest.Mock).mockResolvedValue({ ok: true, json: async () => ({ user: { id: "1" } }) });
      mockSignIn.mockResolvedValue({ error: null });
      render(<RegisterPage />);
      await fillAndSubmit();
      const data = { methode: "email", src: "blog-meilleures-blagues-droles-2026", etape: "abonnement" };
      await waitFor(() => expect(mockTrack).toHaveBeenCalledWith("inscription-reussie", data));
      expect(mockTrack).toHaveBeenCalledWith("inscription-envoi", data);
      // s21 (QA M1) : la source suit jusqu'au paiement (checkout-ouvert).
      expect(mockPush).toHaveBeenCalledWith("/abonnement?src=blog-meilleures-blagues-droles-2026&auto=1");
    });

    it("échec API : envoi mesuré, pas de réussite", async () => {
      (global.fetch as jest.Mock).mockResolvedValue({ ok: false, status: 500, json: async () => ({ error: "Erreur serveur" }) });
      render(<RegisterPage />);
      await fillAndSubmit();
      await waitFor(() => expect(screen.getByText("Quelque chose a coincé de notre côté. Réessaie.")).toBeInTheDocument());
      expect(mockTrack).toHaveBeenCalledWith("inscription-echec", {
        methode: "email",
        motif: "serveur",
        src: "direct",
        etape: "abonnement",
      });
      expect(mockTrack).toHaveBeenCalledWith("inscription-envoi", { methode: "email", src: "direct", etape: "abonnement" });
      expect(mockTrack).not.toHaveBeenCalledWith("inscription-reussie", expect.anything());
    });

    it("formule choisie sur /abonnement retrouvée après inscription", async () => {
      mockSearchParams.set("callbackUrl", "/abonnement?plan=annual");
      (global.fetch as jest.Mock).mockResolvedValue({ ok: true, json: async () => ({ user: { id: "1" } }) });
      mockSignIn.mockResolvedValue({ error: null });
      render(<RegisterPage />);
      await fillAndSubmit();
      await waitFor(() => expect(mockPush).toHaveBeenCalledWith("/abonnement?plan=annual&auto=1"));
      // Rappel de la formule annuelle choisie (validé à l'aveugle s21 : seul le prix change).
      expect(screen.getByText("Premium, 24,99 € TTC par an, annulable à tout moment.")).toBeInTheDocument();
    });

    it("e-mail déjà inscrit (409) : message et lien « Connecte-toi » qui garde la destination", async () => {
      mockSearchParams.set("callbackUrl", "/abonnement?plan=annual");
      (global.fetch as jest.Mock).mockResolvedValue({ ok: false, status: 409, json: async () => ({ error: "Un compte avec cet email existe déjà" }) });
      render(<RegisterPage />);
      await fillAndSubmit();
      await waitFor(() => expect(screen.getByRole("alert")).toHaveTextContent("Cet e-mail a déjà un compte. Connecte-toi pour reprendre ton abonnement."));
      const links = screen.getAllByRole("link", { name: "Connecte-toi" });
      expect(links[0]).toHaveAttribute("href", "/login?callbackUrl=%2Fabonnement%3Fplan%3Dannual");
      expect(mockPush).not.toHaveBeenCalled();
    });

    it("Google : destination + marqueur + source conservés", async () => {
      mockSearchParams.set("callbackUrl", "/parcours/repartie");
      mockSearchParams.set("src", "parcours");
      render(<RegisterPage />);
      await userEvent.click(screen.getByText("S'inscrire avec Google"));
      expect(mockSignIn).toHaveBeenCalledWith("google", {
        // s21 (QA M1) : source déjà dans la cible, jamais en double.
        callbackUrl: "/abonnement?returnTo=%2Fparcours%2Frepartie&src=parcours&auto=1&auth=inscription-google",
      });
    });

    it("source invalide ignorée (jamais de donnée libre envoyée)", async () => {
      mockSearchParams.set("src", "jean@test.fr");
      render(<RegisterPage />);
      await userEvent.click(screen.getByText("S'inscrire avec Google"));
      expect(mockTrack).toHaveBeenCalledWith("inscription-envoi", { methode: "google", src: "direct", etape: "abonnement" });
    });

    it("lien « Connecte-toi » garde la destination", () => {
      mockSearchParams.set("callbackUrl", "/abonnement");
      render(<RegisterPage />);
      expect(screen.getByRole("link", { name: "Connecte-toi" })).toHaveAttribute(
        "href",
        "/login?callbackUrl=%2Fabonnement",
      );
    });

    it("OAuthCallback : message compréhensible", () => {
      mockSearchParams.set("error", "OAuthCallback");
      render(<RegisterPage />);
      expect(screen.getByRole("alert")).toHaveTextContent("L'inscription avec Google n'a pas abouti");
    });
  });

});
