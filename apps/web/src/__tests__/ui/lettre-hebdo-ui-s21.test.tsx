/**
 * Lettre de la semaine (s21) : rendu des écrans.
 *  - CGU, confidentialité, suppression de compte : textes de l'avis @legal publiés SEULEMENT
 *    inscriptions ouvertes (jamais de promesse avant l'ouverture).
 *  - Case (paiement et profil) : absente interrupteur fermé ou sans Premium ; jamais cochée
 *    d'avance ; ligne sous la case avec le lien Confidentialité ; erreur = retour à l'état précédent.
 *  - Page d'arrêt : l'ouverture n'envoie rien ; seul le bouton envoie le POST.
 */
let mockInscriptions = false;
jest.mock("@/config/lettre", () => ({
  ...jest.requireActual("@/config/lettre"),
  get LETTRE_HEBDO_INSCRIPTIONS_OUVERTES() {
    return mockInscriptions;
  },
  LETTRE_HEBDO_DATE_TEXTES: "9 novembre 2026",
}));
jest.mock("@/lib/umami", () => ({ trackUmamiWhenReady: jest.fn() }));

import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import CGUPage from "@/app/(dashboard)/cgu/page";
import ConfidentialitePage from "@/app/(dashboard)/confidentialite/page";
import { LettreHebdoCase } from "@/components/lettre/lettre-hebdo-case";
import { ArretLettreHebdo } from "@/components/lettre/arret-lettre-hebdo";
import { CGU_LETTRE_HEBDO, CONFIDENTIALITE_LETTRE_HEBDO, LETTRE_HEBDO_ARRET, LETTRE_HEBDO_CASE, LETTRE_HEBDO_UI } from "@/config/textes/lettre-hebdo-s21";
import { courbe, lie, sansGluon } from "../helpers/texte-normalise";

const texte = (el: Element | null) => sansGluon(el?.textContent ?? "").replace(/\s+/g, " ").trim();
const attendu = (t: string) => sansGluon(lie(courbe(t))).replace(/\s+/g, " ");
const fetchMock = jest.fn();

beforeEach(() => {
  mockInscriptions = false;
  fetchMock.mockReset();
  global.fetch = fetchMock as unknown as typeof fetch;
});

describe("Textes juridiques : publiés avec l'ouverture des inscriptions, jamais avant", () => {
  it("inscriptions fermées : rien sur la lettre de la semaine, date de mise à jour inchangée", () => {
    for (const Page of [CGUPage, ConfidentialitePage]) {
      const { container, unmount } = render(<Page />);
      expect(texte(container)).not.toMatch(/lettre de la semaine/i);
      expect(texte(container)).toContain("Dernière mise à jour : 17 octobre 2026");
      unmount();
    }
  });

  it("inscriptions ouvertes : 3 ajouts de l'article 10 des CGU et 5 ajouts de la confidentialité, mot pour mot, date du jour", () => {
    mockInscriptions = true;
    const cgu = render(<CGUPage />).container;
    const article10 = texte(cgu.querySelector("section#lettre"));
    for (const t of CGU_LETTRE_HEBDO) expect(article10).toContain(attendu(t));
    expect(texte(cgu)).toContain("Dernière mise à jour : 9 novembre 2026");
    const conf = texte(render(<ConfidentialitePage />).container);
    for (const t of Object.values(CONFIDENTIALITE_LETTRE_HEBDO)) expect(conf).toContain(attendu(t));
  });
});

describe("Case de la lettre (paiement, profil)", () => {
  const etat = (p: Record<string, unknown> = {}) => ({
    ok: true,
    status: 200,
    json: async () => ({ eligible: true, enabled: false, activatedAt: null, finPrevue: null, adresseVerifiee: true, email: "yanis.m@exemple.fr", mensuelleSuspendue: false, ...p }),
  });

  it("inscriptions fermées : absente, aucune requête", () => {
    const { container } = render(<LettreHebdoCase emplacement="profil" />);
    expect(container).toBeEmptyDOMElement();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("H2-9 : compte sans Premium (eligible false) : section absente", async () => {
    mockInscriptions = true;
    fetchMock.mockResolvedValueOnce(etat({ eligible: false }));
    const { container } = render(<LettreHebdoCase emplacement="profil" />);
    await waitFor(() => expect(fetchMock).toHaveBeenCalled());
    expect(container).toBeEmptyDOMElement();
  });

  it("H1-1 / H2-1 : case DÉCOCHÉE, texte exact, ligne avec l'adresse et le lien Confidentialité, statut « Pas activée »", async () => {
    mockInscriptions = true;
    fetchMock.mockResolvedValueOnce(etat());
    render(<LettreHebdoCase emplacement="profil" />);
    const caseLettre = await screen.findByRole("checkbox");
    expect(caseLettre).not.toBeChecked();
    expect(texte(document.body)).toContain(attendu(LETTRE_HEBDO_CASE));
    expect(texte(document.body)).toContain("La lettre de la semaine arrive à yanis.m@exemple.fr.");
    expect(screen.getByRole("link", { name: "Confidentialité" })).toHaveAttribute("href", "/confidentialite#lettre");
    expect(screen.getByTestId("lettre-hebdo-statut")).toHaveTextContent(LETTRE_HEBDO_UI.pasActivee);
  });

  it("H1-2 : coche = PUT { enabled: true, origine: paiement } puis « C'est noté »", async () => {
    mockInscriptions = true;
    fetchMock.mockResolvedValueOnce(etat()).mockResolvedValueOnce({ ok: true, status: 200, json: async () => ({ enabled: true }) });
    render(<LettreHebdoCase emplacement="paiement" />);
    fireEvent.click(await screen.findByRole("checkbox"));
    await waitFor(() => expect(screen.getByRole("checkbox")).toBeChecked());
    const [url, init] = fetchMock.mock.calls[1];
    expect(url).toBe("/api/lettre-premium/preference");
    expect(JSON.parse(init.body)).toEqual({ enabled: true, origine: "paiement" });
    expect(await screen.findByText(/C.est noté\. Tu la recevras chaque jeudi/)).toBeInTheDocument();
  });

  it("H1-6 : erreur serveur, la case redevient décochée et le message exact s'affiche", async () => {
    mockInscriptions = true;
    fetchMock.mockResolvedValueOnce(etat()).mockResolvedValueOnce({ ok: false, status: 500, json: async () => ({}) });
    render(<LettreHebdoCase emplacement="paiement" />);
    fireEvent.click(await screen.findByRole("checkbox"));
    await waitFor(() => expect(screen.getByRole("status")).toHaveTextContent(/c.est de notre côté/));
    expect(screen.getByRole("checkbox")).not.toBeChecked();
  });

  it("H1-7 : session expirée, lien de reconnexion vers le profil, case inchangée", async () => {
    mockInscriptions = true;
    fetchMock.mockResolvedValueOnce(etat()).mockResolvedValueOnce({ ok: false, status: 401, json: async () => ({}) });
    render(<LettreHebdoCase emplacement="profil" />);
    fireEvent.click(await screen.findByRole("checkbox"));
    expect(await screen.findByRole("link", { name: "Reconnecte-toi" })).toHaveAttribute("href", "/login?callbackUrl=/profil");
    expect(screen.getByRole("checkbox")).not.toBeChecked();
  });

  it("H2-10 : adresse non vérifiée, la phrase remplace la case", async () => {
    mockInscriptions = true;
    fetchMock.mockResolvedValueOnce(etat({ adresseVerifiee: false }));
    render(<LettreHebdoCase emplacement="profil" />);
    await waitFor(() => expect(texte(document.body)).toContain(attendu(LETTRE_HEBDO_UI.adresseNonVerifiee)));
    expect(screen.queryByRole("checkbox")).toBeNull();
  });
});

describe("Page d'arrêt", () => {
  it("H3-1 : l'ouverture n'envoie rien ; textes exacts de l'avis ; le bouton envoie le POST puis « C'est arrêté »", async () => {
    render(<ArretLettreHebdo token={"j".repeat(43)} />);
    expect(fetchMock).not.toHaveBeenCalled();
    expect(texte(document.body)).toContain(attendu(LETTRE_HEBDO_ARRET.defaut));
    fetchMock.mockResolvedValueOnce({ ok: true, status: 200, json: async () => ({ arretee: true, deja: false }) });
    fireEvent.click(screen.getByRole("button", { name: LETTRE_HEBDO_ARRET.bouton }));
    await waitFor(() => expect(texte(document.body)).toContain(attendu(LETTRE_HEBDO_ARRET.succes)));
    expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toEqual({ token: "j".repeat(43) });
  });

  it("lien sans jeton valable : « Ce lien ne fonctionne plus », aucun bouton", () => {
    render(<ArretLettreHebdo token={null} />);
    expect(texte(document.body)).toContain(attendu(LETTRE_HEBDO_ARRET.lienInconnu));
    expect(screen.queryByRole("button")).toBeNull();
  });
});
