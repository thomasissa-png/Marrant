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
// UX O5 : l'origine de jsdom (http://localhost) joue l'appli mobile quand le test le demande.
jest.mock("@/config/appli-mobile", () => ({
  get ORIGINES_APPLI_MOBILE() {
    return (globalThis as { __APPLI__?: boolean }).__APPLI__ ? ["http://localhost"] : ["capacitor://localhost"];
  },
}));

import { ResiliationFormulaire } from "@/components/resiliation/resiliation-formulaire";
import { RecapContrat } from "@/components/resiliation/recap-contrat";
import { AideApresResiliation, raisonPourAide } from "@/components/resiliation/aide-apres-resiliation";
import { Footer } from "@/components/layout/footer";
import { AbonnementCard } from "@/components/profil/abonnement-card";
import { RESILIATION_RAISONS } from "@/config/resiliation";
import { AIDES_APRES_RESILIATION, TEXTES_RESILIATION as T } from "@/config/textes/resiliation";

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
  (globalThis as { __APPLI__?: boolean }).__APPLI__ = false;
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

  it("déjà résilié (2e onglet) : l'écran se relit, jamais la page finale qui promet un e-mail (@reviewer S3)", async () => {
    repondre(200, { etat: "deja_resilie", dateFin: null, formule: "monthly" });
    mockRefresh.mockReset();
    ecran();
    await userEvent.click(bouton());
    await waitFor(() => expect(mockRefresh).toHaveBeenCalled());
    expect(mockPush).not.toHaveBeenCalled();
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

  it("erreur Stripe : bandeau avec délai, « Tu n’as rien à refaire, mais tu peux réessayer tout de suite. » (UX O8, @legal O5, @reviewer R3)", () => {
    expect(T.erreurStripe).toBe(
      "Ça n’a pas marché de notre côté. Ta demande est bien enregistrée : on résilie pour toi sous un jour ouvré et on te le confirme par e-mail. Tu n’as rien à refaire, mais tu peux réessayer tout de suite.",
    );
  });

  it("accès offert, demande transmise (202) : bandeau sans échec, aucun « Réessayer », retour à l'accueil (@reviewer R1)", async () => {
    repondre(202, { etat: "transmis", dateFin: null, formule: null });
    render(<ResiliationFormulaire recap={recap} offert />);
    await userEvent.click(bouton());
    const alerte = await screen.findByRole("alert");
    expect(alerte).toHaveTextContent(
      "Ta demande est bien enregistrée : on s’occupe de ta résiliation sous un jour ouvré et on te confirme par e-mail. Tu n’as rien à refaire.",
    );
    expect(alerte).not.toHaveTextContent("Ça n’a pas marché");
    expect(screen.queryByRole("button", { name: /Réessayer|Confirmer la résiliation/ })).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: T.retourAccueil })).toHaveAttribute("href", "/");
  });

  it("base indisponible (503) : demande transmise, même bandeau que l'erreur Stripe", async () => {
    repondre(503, { error: "serveur" });
    ecran();
    await userEvent.click(bouton());
    expect(await screen.findByRole("alert")).toHaveTextContent(T.erreurStripe);
    expect(bouton()).toHaveTextContent(T.reessayer);
  });

  it("pas de réponse du serveur : message hors ligne, sans promesse, « Confirmer la résiliation » (UX O8)", async () => {
    mockFetch.mockRejectedValue(new TypeError("Failed to fetch"));
    ecran();
    await userEvent.click(bouton());
    expect(await screen.findByRole("alert")).toHaveTextContent(T.horsLigne);
    expect(bouton()).toHaveTextContent(T.confirmer);
  });

  it("refus du serveur (429, 403, 500) : message « refus », jamais « Pas de connexion » (UX O4)", async () => {
    for (const status of [429, 403, 500]) {
      repondre(status, { error: "x" });
      const { unmount } = ecran();
      await userEvent.click(bouton());
      const alerte = await screen.findByRole("alert");
      expect(alerte).toHaveTextContent(T.refus);
      expect(alerte).not.toHaveTextContent(T.horsLigne);
      expect(bouton()).toHaveTextContent(T.confirmer);
      unmount();
    }
  });

  it("App Store après clic : carte Apple seule, plus de bouton « Confirmer » (UX O5)", async () => {
    repondre(409, { etat: "app_store" });
    ecran();
    await userEvent.click(bouton());
    expect(await screen.findByTestId("resiliation-app-store")).toHaveTextContent(T.appStore);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: T.retourAccueil })).toHaveAttribute("href", "/");
  });

  it("App Store à l'ouverture : dans l'appli et sans client Stripe, carte Apple sans aucun clic (UX O5)", () => {
    (globalThis as { __APPLI__?: boolean }).__APPLI__ = true;
    render(<ResiliationFormulaire recap={recap} appStorePossible />);
    expect(screen.getByTestId("resiliation-app-store")).toHaveTextContent(T.appStore);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("App Store possible : au premier rendu (serveur), ni formulaire ni bouton avant le verdict (UX C2)", () => {
    // jsdom n'expose pas TextEncoder, requis par le rendu serveur de React.
    Object.assign(globalThis, { TextEncoder: (require("util") as typeof import("util")).TextEncoder });
    const { renderToString } = require("react-dom/server") as typeof import("react-dom/server");
    const html = renderToString(<ResiliationFormulaire recap={recap} appStorePossible />);
    expect(html).toContain('class="min-h-64" aria-hidden="true"');
    expect(html).not.toMatch(/<button|<form/);
    // Compte avec client Stripe : formulaire rendu dès le serveur (aucun délai ajouté).
    expect(renderToString(<ResiliationFormulaire recap={recap} />)).toContain(T.confirmer);
  });

  it("hors de l'appli, ou avec client Stripe : formulaire normal", () => {
    render(<ResiliationFormulaire recap={recap} appStorePossible />);
    expect(bouton()).toHaveTextContent(T.confirmer);
    (globalThis as { __APPLI__?: boolean }).__APPLI__ = true;
    ecran();
    expect(screen.getAllByRole("button", { name: T.confirmer })).toHaveLength(2);
  });

  it("session expirée (401) : saisie gardée dans l'onglet, reprise au retour puis effacée (UX O3)", async () => {
    repondre(401, { error: "session" });
    jest.spyOn(console, "error").mockImplementation(() => {}); // jsdom : navigation non implémentée
    const { unmount } = ecran();
    await userEvent.click(screen.getByRole("checkbox", { name: "Trop cher pour moi" }));
    await userEvent.type(screen.getByLabelText(/Un mot de plus \?/), "Plus tard");
    await userEvent.click(bouton());
    await waitFor(() => expect(sessionStorage.getItem("resiliation-saisie")).not.toBeNull());
    unmount();
    ecran();
    expect(screen.getByRole("checkbox", { name: "Trop cher pour moi" })).toBeChecked();
    expect(screen.getByLabelText(/Un mot de plus \?/)).toHaveValue("Plus tard");
    expect(sessionStorage.getItem("resiliation-saisie")).toBeNull();
  });

  it("mention d'information sous le champ libre, lien vers /confidentialite#resiliation (@legal O1)", () => {
    ecran();
    const mention = document.getElementById("resiliation-mot-mention");
    expect(mention?.textContent).toBe(
      "Ta réponse est facultative. Elle est rattachée à ton compte, lue par l’équipe pour améliorer le site, et effacée après 24 mois. N’y mets pas d’information sensible. Détails et droits : politique de confidentialité.",
    );
    expect(screen.getByRole("link", { name: "politique de confidentialité" })).toHaveAttribute("href", "/confidentialite#resiliation");
    expect(screen.getByLabelText(/Un mot de plus \?/).getAttribute("aria-describedby")).toContain("resiliation-mot-mention");
  });

  it("« Autre » sur 2 colonnes en PC (design O1), ligne de statut centrée sur mobile (design O2)", () => {
    ecran();
    expect(screen.getByRole("checkbox", { name: "Autre" }).closest("label")?.className).toContain("md:last:col-span-2");
    expect(screen.getByRole("status").className).toContain("text-center");
  });
});

describe("récapitulatif : accès offert sans abonnement Stripe (UX O7)", () => {
  it("« à la fin de ton accès Premium », sans ligne de prélèvement", () => {
    render(<RecapContrat compte="Léa, lea@x.fr" formule="Premium" prix={null} dateFin={null} renouvellement={null} badge="formule" offert />);
    expect(screen.getByText(T.recapFinInconnueOffert)).toBeInTheDocument();
    expect(screen.getByText(T.garderSansDate)).toBeInTheDocument();
    expect(screen.queryByText(T.aucunPrelevement)).not.toBeInTheDocument();
    expect(screen.queryByText(T.recapFinInconnue)).not.toBeInTheDocument();
  });
  it("lecture en échec (pas offert) : « période déjà payée » et ligne de prélèvement", () => {
    render(<RecapContrat compte="y@x.fr" formule="Premium" prix={null} dateFin={null} renouvellement={null} badge="formule" />);
    expect(screen.getByText(T.recapFinInconnue)).toBeInTheDocument();
    expect(screen.getByText(T.aucunPrelevement)).toBeInTheDocument();
  });
});

describe("ligne d'aide (composant NON rendu sur la page finale, UX O1)", () => {
  it("aucun chiffre non sourcé dans les lignes d'aide", () => {
    const tout = Object.values(AIDES_APRES_RESILIATION).map((a) => a.avant + a.lien + a.apres).join(" ");
    expect(tout).not.toMatch(/\d/);
  });
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
  it("fermé : carte du profil, « 1er décembre 2026 » comme sur /resiliation, jamais « 1 décembre » (UX C1)", () => {
    const { container } = render(carte());
    expect(container.textContent).toContain("Prochain prélèvement le 1er décembre 2026.");
    expect(container.textContent).toContain("jusqu’au 1er décembre 2026");
    expect(container.textContent).not.toMatch(/\b1 décembre/);
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
