/**
 * /register et /login dans un navigateur intégré (v5 §2.4 et §2.5) :
 * e-mail avant Google pour tous, Google désactivé seulement là où il est
 * refusé, bascule qui garde callbackUrl, src, origine et contenu, copie du
 * lien en premier sur iOS.
 */
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RegisterPage from "@/app/(auth)/register/page";
import LoginPage from "@/app/(auth)/login/page";
import { UA } from "@/__tests__/helpers/user-agents";

const mockSignIn = jest.fn();
let mockSearchParams = new URLSearchParams();
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn(), refresh: jest.fn() }),
  useSearchParams: () => mockSearchParams,
}));
jest.mock("next-auth/react", () => ({
  signIn: (...args: unknown[]) => mockSignIn(...args),
}));
const mockTrack = jest.fn();
jest.mock("@/lib/umami", () => ({
  trackUmami: (...args: unknown[]) => mockTrack(...args),
}));

const REGISTER_MESSAGE =
  "Google n'accepte pas l'inscription depuis cette application. Inscris-toi par e-mail, ou ouvre le site dans ton navigateur.";

function setUserAgent(ua: string) {
  jest.spyOn(window.navigator, "userAgent", "get").mockReturnValue(ua);
}

beforeEach(() => {
  jest.restoreAllMocks();
  mockSignIn.mockReset();
  mockTrack.mockReset();
  mockSearchParams = new URLSearchParams();
  window.sessionStorage.clear();
});

describe("/register", () => {
  it("e-mail avant Google pour tous, sans order-first (Safari : Google actif, aucun message)", async () => {
    setUserAgent(UA.safariIos);
    render(<RegisterPage />);
    const submit = screen.getByRole("button", { name: "Créer mon compte" });
    const google = screen.getByRole("button", { name: /S'inscrire avec Google/ });
    expect(submit.compareDocumentPosition(google) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(google.className).not.toMatch(/order-first/);
    await waitFor(() => expect(google).toBeEnabled());
    expect(screen.queryByText(REGISTER_MESSAGE)).not.toBeInTheDocument();
  });

  it.each(["chromeAndroid", "xAndroid"] as const)("%s : Google actif", async (key) => {
    setUserAgent(UA[key]);
    render(<RegisterPage />);
    await userEvent.click(screen.getByRole("button", { name: /S'inscrire avec Google/ }));
    expect(mockSignIn).toHaveBeenCalledWith("google", expect.any(Object));
    expect(screen.queryByTestId("in-app-notice")).not.toBeInTheDocument();
  });

  it("Instagram iOS : Google désactivé avec message, copie en premier, bascule complète", async () => {
    setUserAgent(UA.instagramIos);
    window.sessionStorage.setItem("marrant-origine", "instagram");
    window.sessionStorage.setItem("marrant-contenu", "bio-article");
    mockSearchParams = new URLSearchParams("callbackUrl=/onboarding&src=blog-mon-article");
    const writeText = jest.fn().mockResolvedValue(undefined);
    Object.defineProperty(window.navigator, "clipboard", { value: { writeText }, configurable: true });

    render(<RegisterPage />);
    const google = screen.getByRole("button", { name: /S'inscrire avec Google/ });
    await waitFor(() => expect(google).toBeDisabled());
    expect(screen.getByText(REGISTER_MESSAGE)).toBeInTheDocument();
    expect(google).toHaveAttribute("aria-describedby", "google-in-app-notice");

    const copy = screen.getByRole("button", { name: "Copier le lien" });
    const open = screen.getByRole("link", { name: "Ouvrir dans mon navigateur" });
    expect(copy.compareDocumentPosition(open) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    const expected =
      "http://localhost/register?callbackUrl=%2Fonboarding&src=blog-mon-article&origine=instagram&contenu=bio-article";
    expect(open).toHaveAttribute("href", expected);

    await userEvent.click(copy);
    expect(writeText).toHaveBeenCalledWith(expected);
    expect(await screen.findByText("Lien copié. Colle-le dans ton navigateur.")).toBeInTheDocument();

    await userEvent.click(google);
    expect(mockSignIn).not.toHaveBeenCalled();
    expect(mockTrack).not.toHaveBeenCalled();
  });

  it("Instagram Android : « Ouvrir dans mon navigateur » en premier (URL intent en https, voir in-app-browser.test)", async () => {
    setUserAgent(UA.instagramAndroid);
    mockSearchParams = new URLSearchParams("src=quiz&callbackUrl=/parcours/repartie");
    render(<RegisterPage />);
    const open = await screen.findByRole("link", { name: "Ouvrir dans mon navigateur" });
    const copy = screen.getByRole("button", { name: "Copier le lien" });
    expect(open.compareDocumentPosition(copy) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(open.getAttribute("href")).toBe(
      "http://localhost/register?callbackUrl=%2Fparcours%2Frepartie&src=quiz",
    );
  });

  it("copie impossible : le lien s'affiche à copier à la main", async () => {
    setUserAgent(UA.linkedinIos);
    Object.defineProperty(window.navigator, "clipboard", { value: undefined, configurable: true });
    document.execCommand = jest.fn().mockReturnValue(false);
    render(<RegisterPage />);
    await userEvent.click(await screen.findByRole("button", { name: "Copier le lien" }));
    expect(await screen.findByLabelText("Copie le lien à la main :")).toHaveValue("http://localhost/register");
  });
});

describe("/login", () => {
  it("LinkedIn : même traitement, bascule vers /login avec destination et attribution", async () => {
    setUserAgent(UA.linkedinAndroid);
    window.sessionStorage.setItem("marrant-origine", "linkedin");
    window.sessionStorage.setItem("marrant-contenu", "relais");
    mockSearchParams = new URLSearchParams("callbackUrl=/favoris");
    render(<LoginPage />);
    const google = screen.getByRole("button", { name: /Continuer avec Google/ });
    await waitFor(() => expect(google).toBeDisabled());
    expect(
      screen.getByText(
        "Google n'accepte pas la connexion depuis cette application. Connecte-toi par e-mail, ou ouvre le site dans ton navigateur.",
      ),
    ).toBeInTheDocument();
    const open = screen.getByRole("link", { name: "Ouvrir dans mon navigateur" });
    expect(open.getAttribute("href")).toBe("http://localhost/login?callbackUrl=%2Ffavoris&origine=linkedin&contenu=relais");
    await userEvent.click(google);
    expect(mockSignIn).not.toHaveBeenCalled();
  });

  it("Chrome : Google actif, aucun message", async () => {
    setUserAgent(UA.chromeDesktop);
    render(<LoginPage />);
    await userEvent.click(screen.getByRole("button", { name: /Continuer avec Google/ }));
    expect(mockSignIn).toHaveBeenCalledWith("google", expect.any(Object));
    expect(screen.queryByTestId("in-app-notice")).not.toBeInTheDocument();
  });
});
