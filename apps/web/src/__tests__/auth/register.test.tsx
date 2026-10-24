import { render, screen, waitFor } from "@testing-library/react";
import { REGISTER_CTA } from "@/config/textes/cta-pages";
import userEvent from "@testing-library/user-event";
import RegisterPage from "@/app/(auth)/register/page";
import { lie } from "../helpers/texte-normalise";

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
    // textes-trajet-v2 G01, G02, G06 : titre, rappel de formule, Stripe nommé ; plus d'« Étape 1 sur 2 ».
    expect(screen.queryByText("Étape 1 sur 2")).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1, name: "Ton compte, puis le paiement" })).toBeInTheDocument();
    expect(screen.getByTestId("register-rappel-offre").textContent?.replace(/\s/g, " ")).toBe("Premium, 1,99 €/mois.");
    expect(screen.getByTestId("register-stripe")).toHaveTextContent("Paiement sécurisé par Stripe.");
    expect(screen.queryByText(/Étape 2 : le paiement/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Retour à l/)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/^Prénom/)).not.toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Mot de passe")).toBeInTheDocument();
  });

  it("s21 concision : plus de champ prénom, Google en premier, lien d'étape gratuite sous « Déjà un compte ? »", () => {
    mockSearchParams.set("callbackUrl", "/abonnement?returnTo=%2Fparcours%2Fconfiance");
    const { container } = render(<RegisterPage />);
    const ids = Array.from(container.querySelectorAll("input")).map((i) => i.id);
    expect(ids).toEqual(["email", "password"]);
    expect(container.querySelector("#name")).toBeNull();
    // Google avant le premier champ et avant le bouton d'envoi.
    const form = container.querySelector("form")!;
    const google = screen.getByRole("button", { name: /Continuer avec Google/ });
    const email = screen.getByLabelText("Email");
    const envoi = screen.getByRole("button", { name: REGISTER_CTA.bouton });
    expect(google.compareDocumentPosition(email) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(google.compareDocumentPosition(envoi) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(form.contains(google)).toBe(true);
    const lien = screen.getByRole("link", { name: REGISTER_CTA.lienEtape1("confiance") });
    // Revue v3 m3 : source propre à /register (n'est plus comptée `abonnement`).
    expect(lien).toHaveAttribute("href", "/parcours/confiance?src=register-etape1#etape-1");
    const html = container.innerHTML;
    expect(html.indexOf("Déjà un compte")).toBeLessThan(html.indexOf('href="/parcours/confiance'));
    mockSearchParams.delete("callbackUrl");
  });

  it("s21 B17 : sans parcours d'origine, l'étape 1 de Répartie", () => {
    render(<RegisterPage />);
    expect(screen.getByRole("link", { name: REGISTER_CTA.lienEtape1("repartie") })).toBeInTheDocument();
  });

  it("s21 concision : inscription envoyée sans prénom (e-mail et mot de passe seuls)", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({ ok: true, json: async () => ({ user: { id: "u" } }) });
    mockSignIn.mockResolvedValue({ ok: true });
    render(<RegisterPage />);
    await userEvent.type(screen.getByLabelText("Email"), "jean@test.fr");
    await userEvent.type(screen.getByLabelText("Mot de passe"), "password1234545");
    await userEvent.click(screen.getByRole("button", { name: REGISTER_CTA.bouton }));
    await waitFor(() => expect(global.fetch).toHaveBeenCalled());
    expect(JSON.parse((global.fetch as jest.Mock).mock.calls[0][1].body)).toEqual({
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
    expect(screen.getByText("Continuer avec Google")).toBeInTheDocument();
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

      await userEvent.type(screen.getByLabelText("Email"), "jean@test.fr");
    await userEvent.type(screen.getByLabelText("Mot de passe"), "password1234545");
    await userEvent.click(screen.getByRole("button", { name: REGISTER_CTA.bouton }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "jean@test.fr", password: "password1234545" }),
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
      await userEvent.type(screen.getByLabelText("Email"), "jean@test.fr");
    await userEvent.type(screen.getByLabelText("Mot de passe"), "password12345");
    await userEvent.click(screen.getByRole("button", { name: REGISTER_CTA.bouton }));

    expect(screen.getByText("On prépare ton compte…")).toBeInTheDocument();
  });

  it("calls Google signIn with /abonnement?auto=1 callback when no callbackUrl", async () => {
    render(<RegisterPage />);
    await userEvent.click(screen.getByText("Continuer avec Google"));
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
      // Rappel de la formule annuelle choisie (v2 G02, correction @legal).
      expect(screen.getByTestId("register-rappel-offre").textContent?.replace(/\s/g, " ")).toBe(
        "Premium, 16,99 €/an, renouvelé chaque année, sauf résiliation.",
      );
    });

    it("e-mail déjà inscrit (409) : message et lien « Connecte-toi » qui garde la destination", async () => {
      mockSearchParams.set("callbackUrl", "/abonnement?plan=annual");
      (global.fetch as jest.Mock).mockResolvedValue({ ok: false, status: 409, json: async () => ({ error: "Un compte avec cet email existe déjà" }) });
      render(<RegisterPage />);
      await fillAndSubmit();
      await waitFor(() => expect(screen.getByRole("alert")).toHaveTextContent(lie("Cet e-mail a déjà un compte. Connecte-toi pour reprendre ton abonnement.")));
      const links = screen.getAllByRole("link", { name: "Connecte-toi" });
      expect(links[0]).toHaveAttribute("href", "/login?callbackUrl=%2Fabonnement%3Fplan%3Dannual");
      expect(mockPush).not.toHaveBeenCalled();
    });

    it("Google : destination + marqueur + source conservés", async () => {
      mockSearchParams.set("callbackUrl", "/parcours/repartie");
      mockSearchParams.set("src", "parcours");
      render(<RegisterPage />);
      await userEvent.click(screen.getByText("Continuer avec Google"));
      expect(mockSignIn).toHaveBeenCalledWith("google", {
        // s21 (QA M1) : source déjà dans la cible, jamais en double.
        callbackUrl: "/abonnement?returnTo=%2Fparcours%2Frepartie&src=parcours&auto=1&auth=inscription-google",
      });
    });

    it("source invalide ignorée (jamais de donnée libre envoyée)", async () => {
      mockSearchParams.set("src", "jean@test.fr");
      render(<RegisterPage />);
      await userEvent.click(screen.getByText("Continuer avec Google"));
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
      expect(screen.getByRole("alert")).toHaveTextContent("L’inscription avec Google n’a pas abouti");
    });
  });

});
