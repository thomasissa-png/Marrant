/**
 * Écran /resiliation (s23) : bouton « Confirmer la résiliation » TOUJOURS actif (jamais `disabled`,
 * jamais conditionné à la réponse), question FACULTATIVE (7 raisons non cochées, champ libre non
 * requis), textes de la copie, saisie conservée en erreur, page finale (merci et ligne d'aide).
 * Interrupteur fermé : pied de page et carte abonnement vers le parcours actuel (portail Stripe).
 */
import { act, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// Interrupteur lu au rendu (jamais au chargement du module) : drapeau global, sans zone morte.
const drapeau = globalThis as { __RESILIATION_OUVERTE__?: boolean };
jest.mock("@/config/resiliation", () => ({
  ...jest.requireActual("@/config/resiliation"),
  get RESILIATION_PAGE_OUVERTE() {
    return (globalThis as { __RESILIATION_OUVERTE__?: boolean }).__RESILIATION_OUVERTE__ === true;
  },
}));
const mockPush = jest.fn();
const mockRefresh = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush, refresh: mockRefresh }),
  useSearchParams: () => new URLSearchParams(),
}));
const mockTrack = jest.fn();
jest.mock("@/lib/umami", () => ({ trackUmami: (...a: unknown[]) => mockTrack(...a) }));
jest.mock("next-auth/react", () => ({ useSession: () => ({ data: null, status: "unauthenticated" }), signOut: jest.fn() }));
jest.mock("@/components/ui/toast", () => ({ toast: jest.fn() }));

import { ResiliationFormulaire } from "@/components/resiliation/resiliation-formulaire";
import { RecapContrat } from "@/components/resiliation/recap-contrat";
import { AideApresResiliation, raisonPourAide } from "@/components/resiliation/aide-apres-resiliation";
import { Footer } from "@/components/layout/footer";
import { AbonnementCard } from "@/components/profil/abonnement-card";
import { RESILIATION_RAISONS } from "@/config/resiliation";
import { TEXTES_RESILIATION as T } from "@/config/textes/resiliation";

const mockFetch = jest.fn();
const repondre = (status: number, body: Record<string, unknown>) =>
  mockFetch.mockResolvedValue({ ok: status >= 200 && status < 300, status, json: () => Promise.resolve(body) });

const recap = (
  <RecapContrat compte="Yanis, yanis@x.fr" formule="Premium mensuel" prix="1,99 € TTC par mois" dateFin="1er décembre 2026" renouvellement={null} badge="formule" />
);
const ecran = () => render(<ResiliationFormulaire recap={recap} />);
const bouton = () => screen.getByRole("button", { name: /Confirmer la résiliation|Réessayer|On résilie/ });

beforeEach(() => {
  global.fetch = mockFetch as unknown as typeof fetch;
  mockFetch.mockReset();
  mockPush.mockReset();
  mockTrack.mockReset();
  drapeau.__RESILIATION_OUVERTE__ = false;
  sessionStorage.clear();
});

describe("écran /resiliation", () => {
  it("récapitulatif, question facultative et 7 raisons non cochées, dans l'ordre de la copie", () => {
    ecran();
    expect(screen.getByRole("heading", { level: 2, name: T.recapTitre })).toBeInTheDocument();
    expect(screen.getByText("1er décembre 2026")).toBeInTheDocument();
    expect(screen.getByText(T.garderJusquau("1er décembre 2026"))).toBeInTheDocument();
    expect(screen.getByText(T.aucunPrelevement)).toBeInTheDocument();
    const groupe = screen.getByRole("group", { name: /Qu’est-ce qui n’a pas collé \? Facultatif/ });
    expect(within(groupe).getByText(T.questionAide)).toBeInTheDocument();
    const cases = within(groupe).getAllByRole("checkbox");
    expect(cases.map((c) => c.closest("label")?.textContent)).toEqual(RESILIATION_RAISONS.map((r) => r.libelle));
    cases.forEach((c) => {
      expect(c).not.toBeChecked();
      expect(c).not.toBeRequired();
    });
    const champ = screen.getByLabelText(/Un mot de plus \?/);
    expect(champ).not.toBeRequired();
    expect(champ).toHaveAttribute("maxLength", "500");
    expect(screen.getByText("0/500")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: T.garder })).toHaveAttribute("href", "/profil#abonnement");
    expect(document.body.textContent).not.toMatch(/—|votre|tu vas nous manquer/);
  });

  it("bouton toujours actif sans aucune réponse : la résiliation part avec une liste vide", async () => {
    repondre(200, { etat: "resilie", dateFin: "2026-12-01T10:00:00.000Z", formule: "monthly" });
    ecran();
    expect(bouton()).toBeEnabled();
    expect(bouton()).not.toHaveAttribute("disabled");
    expect(bouton()).not.toHaveAttribute("aria-disabled");
    await userEvent.click(bouton());
    const corps = JSON.parse(mockFetch.mock.calls[0][1].body as string);
    expect(corps.reasons).toEqual([]);
    expect(corps.comment).toBe("");
    expect(corps.cle).toMatch(/^[0-9a-f-]{36}$/);
    await waitFor(() => expect(mockPush).toHaveBeenCalledWith("/resiliation/confirmee"));
    expect(JSON.parse(sessionStorage.getItem("resiliation-reponse") ?? "{}")).toEqual({ raisons: [], repondu: false });
    expect(mockTrack).toHaveBeenCalledWith("resiliation-confirmee");
  });

  it("cocher puis décocher ne change jamais l'état du bouton", async () => {
    ecran();
    const essai = screen.getByRole("checkbox", { name: "Je voulais juste essayer" });
    await userEvent.click(essai);
    expect(bouton()).toBeEnabled();
    await userEvent.click(essai);
    expect(bouton()).toBeEnabled();
    await userEvent.click(screen.getByRole("checkbox", { name: "Autre" }));
    expect(bouton()).toBeEnabled();
  });

  it("envoi : « On résilie… », aria-busy et aria-disabled (jamais disabled), double clic ignoré", async () => {
    let finir: (v: unknown) => void = () => {};
    mockFetch.mockReturnValue(new Promise((r) => (finir = r)));
    ecran();
    await userEvent.click(screen.getByRole("checkbox", { name: "Trop cher pour moi" }));
    await userEvent.click(bouton());
    expect(bouton()).toHaveTextContent(T.envoi);
    expect(bouton()).toHaveAttribute("aria-disabled", "true");
    expect(bouton()).not.toHaveAttribute("disabled");
    await userEvent.click(bouton());
    expect(mockFetch).toHaveBeenCalledTimes(1);
    await act(async () => finir({ ok: true, status: 200, json: () => Promise.resolve({ etat: "resilie" }) }));
  });

  it("erreur Stripe (202) : bandeau d'alerte, « Réessayer » actif, saisie conservée, nouvelle clé", async () => {
    repondre(202, { etat: "transmis" });
    ecran();
    await userEvent.click(screen.getByRole("checkbox", { name: "Pas le temps en ce moment" }));
    await userEvent.type(screen.getByLabelText(/Un mot de plus \?/), "Je reviendrai");
    await userEvent.click(bouton());
    expect(await screen.findByRole("alert")).toHaveTextContent(T.erreurStripe);
    expect(bouton()).toHaveTextContent(T.reessayer);
    expect(bouton()).toBeEnabled();
    expect(screen.getByRole("checkbox", { name: "Pas le temps en ce moment" })).toBeChecked();
    expect(screen.getByLabelText(/Un mot de plus \?/)).toHaveValue("Je reviendrai");
    const cle1 = JSON.parse(mockFetch.mock.calls[0][1].body as string).cle;
    await userEvent.click(bouton());
    expect(JSON.parse(mockFetch.mock.calls[1][1].body as string).cle).not.toBe(cle1);
  });

  it("pas de réponse du serveur : message hors ligne, sans promesse", async () => {
    mockFetch.mockRejectedValue(new TypeError("Failed to fetch"));
    ecran();
    await userEvent.click(bouton());
    expect(await screen.findByRole("alert")).toHaveTextContent(T.horsLigne);
  });

  it("App Store : message Apple", async () => {
    repondre(409, { etat: "app_store" });
    ecran();
    await userEvent.click(bouton());
    expect(await screen.findByRole("alert")).toHaveTextContent(T.appStore);
  });
});

describe("page finale", () => {
  it("merci et une ligne d'aide selon la première raison ; rien sans réponse", () => {
    expect(raisonPourAide(["prix", "essai"])).toBe("essai");
    expect(raisonPourAide(["autre"])).toBeNull();
    sessionStorage.setItem("resiliation-reponse", JSON.stringify({ raisons: ["prix"], repondu: true }));
    const { unmount } = render(<AideApresResiliation dateFin="1er décembre 2026" />);
    expect(screen.getByText("Merci d’avoir répondu.")).toBeInTheDocument();
    expect(document.body.textContent).toContain("Après le 1er décembre 2026, la vanne du jour et la première étape de chaque parcours restent libres.");
    expect(screen.getByRole("link", { name: "chaque parcours" })).toHaveAttribute("href", "/parcours");
    unmount();
    render(<AideApresResiliation dateFin={null} />);
    expect(screen.queryByText("Merci d’avoir répondu.")).not.toBeInTheDocument();
  });
});

describe("interrupteur RESILIATION_PAGE_OUVERTE", () => {
  const resiliationPied = () => screen.getByRole("link", { name: "Résilier ton contrat" });
  const actif = {
    status: "ACTIVE" as const, formule: "monthly" as const, priceCents: 199, currentPeriodEnd: "2026-12-01T10:00:00.000Z",
    cancelAtPeriodEnd: false, hasPortal: true, hasStripeSubscription: true,
  };
  const carte = () => (
    <AbonnementCard plan="PREMIUM" onCheckout={jest.fn()} isCheckoutLoading={false} abonnement={{ summary: actif, openPortal: jest.fn(), portalLoading: null }} />
  );

  it("fermé (défaut) : la constante du dépôt est à false", () => {
    expect(jest.requireActual("@/config/resiliation").RESILIATION_PAGE_OUVERTE).toBe(false);
  });
  it("fermé : pied de page vers /profil#abonnement, carte avec le bouton du portail Stripe (parcours actuel)", async () => {
    render(<Footer />);
    expect(resiliationPied()).toHaveAttribute("href", "/profil#abonnement");
    const openPortal = jest.fn();
    render(<AbonnementCard plan="PREMIUM" onCheckout={jest.fn()} isCheckoutLoading={false} abonnement={{ summary: actif, openPortal, portalLoading: null }} />);
    await userEvent.click(screen.getByRole("button", { name: "Résilier ton contrat" }));
    expect(openPortal).toHaveBeenCalledWith("resilier");
  });
  it("ouvert : pied de page et carte vers /resiliation (simple lien, même libellé)", () => {
    drapeau.__RESILIATION_OUVERTE__ = true;
    render(<Footer />);
    expect(resiliationPied()).toHaveAttribute("href", "/resiliation");
    render(carte());
    const liens = screen.getAllByRole("link", { name: "Résilier ton contrat" });
    expect(liens.every((l) => l.getAttribute("href") === "/resiliation")).toBe(true);
    expect(screen.queryByRole("button", { name: "Résilier ton contrat" })).not.toBeInTheDocument();
  });
});
