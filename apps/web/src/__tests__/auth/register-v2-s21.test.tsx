/**
 * /register, trajet de conversion s21 tour 2 (textes-trajet-v2 G01 à G06) :
 * - phrase de contexte selon l'entrée (table §3), titre de l'étape 2 en fin d'étape 1 ;
 * - lien « Tester l'étape 1… » seulement sans clic d'achat (aucune source ou /login) ;
 * - ligne Stripe sous la réassurance ;
 * - variante du favori (§6 point 8) pour l'étoile d'une vanne ;
 * - inscription par e-mail : le paiement s'ouvre d'ici, attente dans le bouton (plus de page),
 *   `checkout-ouvert` avec la source d'entrée et la formule ; échec : repli sur /abonnement (`auto=1`).
 */
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RegisterPage from "@/app/(auth)/register/page";
import { REGISTER_CTA } from "@/config/textes/cta-pages";

const mockPush = jest.fn();
const mockSignIn = jest.fn();
const mockSearchParams = new URLSearchParams();
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush, refresh: jest.fn() }),
  useSearchParams: () => mockSearchParams,
}));
jest.mock("next-auth/react", () => ({ signIn: (...a: unknown[]) => mockSignIn(...a) }));
const mockTrack = jest.fn();
jest.mock("@/lib/umami", () => ({ trackUmami: (...a: unknown[]) => mockTrack(...a) }));

const rappel = () => (screen.getByTestId("register-rappel-offre").textContent ?? "").replace(/\s/g, " ");
const lienGratuit = () => screen.queryByRole("link", { name: /^Tester l/ });

function poser(params: Record<string, string>) {
  for (const k of [...mockSearchParams.keys()]) mockSearchParams.delete(k);
  for (const [k, v] of Object.entries(params)) mockSearchParams.set(k, v);
}

beforeEach(() => {
  jest.clearAllMocks();
  global.fetch = jest.fn();
});

describe("phrase de contexte et lien gratuit (G03 à G05)", () => {
  it("mur des vannes : la suite des vannes, plus de lien gratuit", () => {
    poser({ src: "mur-vannes", callbackUrl: "/abonnement?returnTo=%2Fvannes&src=mur-vannes" });
    render(<RegisterPage />);
    expect(rappel()).toBe("Premium, 2,99 €/mois. Après le paiement, la suite des vannes s’ouvre.");
    expect(lienGratuit()).toBeNull();
  });

  it("fin d'étape 1 : étape 2 avec son titre", () => {
    poser({ src: "parcours-etape", callbackUrl: "/abonnement?returnTo=%2Fparcours%2Frepartie" });
    render(<RegisterPage />);
    expect(rappel()).toBe("Premium, 2,99 €/mois. Après le paiement, l’étape 2 de Répartie s’ouvre : Le rythme et les silences.");
    expect(lienGratuit()).toBeNull();
  });

  it("en-tête, annuel : formule annuelle (correction @legal) puis « tout s'ouvre »", () => {
    poser({ src: "header", callbackUrl: "/abonnement?plan=annual&src=header" });
    render(<RegisterPage />);
    expect(rappel()).toBe("Premium, 24,99 €/an, renouvelé chaque année, sauf résiliation. Après le paiement, tout s’ouvre.");
    expect(lienGratuit()).toBeNull();
  });

  it("étoile d'une vanne (favori mémorisé) : variante « ta vanne est dans tes favoris »", () => {
    poser({ src: "modale-favoris", callbackUrl: "/abonnement?returnTo=%2Fvannes%3Ffavori%3DJOKE.j1&src=modale-favoris" });
    render(<RegisterPage />);
    expect(rappel()).toBe("Premium, 2,99 €/mois. Après le paiement, ta vanne est dans tes favoris.");
  });

  it("étoile d'un conseil : phrase de base (variante écrite pour la vanne seulement)", () => {
    poser({ src: "modale-favoris", callbackUrl: "/abonnement?returnTo=%2Fconseils%3Ffavori%3DTIP.t1&src=modale-favoris" });
    render(<RegisterPage />);
    expect(rappel()).toBe("Premium, 2,99 €/mois. Après le paiement, les favoris s’ouvrent.");
  });

  it.each([[{}], [{ src: "login" }]])("sans clic d'achat (%p) : aucune phrase, lien gratuit gardé", (params) => {
    poser(params);
    render(<RegisterPage />);
    expect(rappel()).toBe("Premium, 2,99 €/mois.");
    expect(lienGratuit()).toBeInTheDocument();
  });

  it("titre, réassurance, puis ligne Stripe (G01, G06)", () => {
    poser({ src: "header" });
    render(<RegisterPage />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Ton compte, puis le paiement");
    const reass = screen.getByTestId("register-reassurance");
    const stripe = screen.getByTestId("register-stripe");
    expect(stripe).toHaveTextContent(REGISTER_CTA.stripe);
    expect(reass.compareDocumentPosition(stripe) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });
});

describe("attente dans le bouton après l'inscription par e-mail", () => {
  async function inscrire() {
    await userEvent.type(screen.getByLabelText("Email"), "jean@test.fr");
    await userEvent.type(screen.getByLabelText("Mot de passe"), "password1234545");
    await userEvent.click(screen.getByRole("button", { name: REGISTER_CTA.bouton }));
  }

  it("paiement ouvert depuis /register : returnTo et formule envoyés, checkout-ouvert avec la source, aucune page d'attente", async () => {
    poser({ src: "mur-vannes", plan: "annual", callbackUrl: "/abonnement?returnTo=%2Fvannes&plan=annual&src=mur-vannes" });
    const assign = jest.fn();
    const original = window.location;
    Object.defineProperty(window, "location", { configurable: true, value: { ...original, set href(v: string) { assign(v); } } });
    let finir: (v: unknown) => void = () => undefined;
    (global.fetch as jest.Mock).mockImplementation((url: string) =>
      url === "/api/auth/register"
        ? Promise.resolve({ ok: true, json: async () => ({ user: { id: "u" } }) })
        : new Promise((r) => (finir = r)),
    );
    mockSignIn.mockResolvedValue({ error: null });
    render(<RegisterPage />);
    await inscrire();
    await waitFor(() => expect(screen.getByTestId("register-bouton")).toHaveTextContent("On t’emmène au paiement…"));
    expect(screen.getByTestId("register-bouton")).toBeDisabled();
    expect(screen.getByTestId("chargement")).toBeInTheDocument();
    const appel = (global.fetch as jest.Mock).mock.calls.find((c) => c[0] === "/api/stripe/checkout")!;
    expect(JSON.parse(appel[1].body)).toEqual({ returnTo: "/vannes", plan: "annual" });
    finir({ ok: true, json: async () => ({ url: "https://checkout.stripe.com/c/pay/cs_test" }) });
    await waitFor(() => expect(assign).toHaveBeenCalledWith("https://checkout.stripe.com/c/pay/cs_test"));
    expect(mockTrack).toHaveBeenCalledWith("checkout-ouvert", { src: "mur-vannes", formule: "annuel" });
    expect(mockPush).not.toHaveBeenCalled();
    Object.defineProperty(window, "location", { configurable: true, value: original });
  });

  it("échec du paiement (formule indisponible, réseau) : repli sur /abonnement auto=1, sans checkout-ouvert", async () => {
    poser({ src: "header", callbackUrl: "/abonnement?src=header" });
    (global.fetch as jest.Mock).mockImplementation((url: string) =>
      Promise.resolve(
        url === "/api/auth/register"
          ? { ok: true, json: async () => ({ user: { id: "u" } }) }
          : { ok: false, status: 503, json: async () => ({ error: "x" }) },
      ),
    );
    mockSignIn.mockResolvedValue({ error: null });
    render(<RegisterPage />);
    await inscrire();
    await waitFor(() => expect(mockPush).toHaveBeenCalledWith("/abonnement?src=header&auto=1"));
    expect(mockTrack).not.toHaveBeenCalledWith("checkout-ouvert", expect.anything());
  });
});
