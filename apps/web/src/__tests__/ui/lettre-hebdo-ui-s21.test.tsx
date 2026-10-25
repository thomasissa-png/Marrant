/**
 * Lettre de la semaine (s21) : rendu des écrans.
 *  - CGU, confidentialité, suppression de compte : textes de l'avis @legal publiés SEULEMENT
 *    inscriptions ouvertes (jamais de promesse avant l'ouverture).
 *  - Réglage du profil (s22, inscription d'office) : absent interrupteur fermé ou sans Premium ;
 *    activé par défaut ; ligne avec le lien Confidentialité ; erreur = retour à l'état précédent.
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
// s22 : « Ta question à l'équipe » est ouverte ; ce fichier vérifie l'état SANS ce service
// (son état ouvert est couvert par `question-equipe-s22.test.tsx`).
jest.mock("@/config/question-equipe", () => ({
  ...jest.requireActual("@/config/question-equipe"),
  QUESTION_EQUIPE_OUVERTE: false,
  QUESTION_EQUIPE_DATE_TEXTES: "",
}));
jest.mock("@/lib/umami", () => ({ trackUmamiWhenReady: jest.fn() }));

import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import CGUPage from "@/app/(dashboard)/cgu/page";
import ConfidentialitePage from "@/app/(dashboard)/confidentialite/page";
import { LettreHebdoReglage } from "@/components/lettre/lettre-hebdo-reglage";
import { ArretLettreHebdo } from "@/components/lettre/arret-lettre-hebdo";
import { CGU_LETTRE_HEBDO, CONFIDENTIALITE_LETTRE_HEBDO, LETTRE_HEBDO_ARRET, LETTRE_HEBDO_LIGNE_REGLAGE, LETTRE_HEBDO_REGLAGE, LETTRE_HEBDO_UI } from "@/config/textes/lettre-hebdo-s21";
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

describe("Réglage du profil (s22 : inscription d'office)", () => {
  const etat = (p: Record<string, unknown> = {}) => ({
    ok: true,
    status: 200,
    json: async () => ({ eligible: true, enabled: true, opposition: false, finPrevue: null, email: "yanis.m@exemple.fr", mensuelleSuspendue: true, ...p }),
  });

  it("inscriptions fermées : absent, aucune requête", () => {
    const { container } = render(<LettreHebdoReglage />);
    expect(container).toBeEmptyDOMElement();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("H2-9 : compte sans Premium (eligible false) : section absente", async () => {
    mockInscriptions = true;
    fetchMock.mockResolvedValueOnce(etat({ eligible: false }));
    const { container } = render(<LettreHebdoReglage />);
    await waitFor(() => expect(fetchMock).toHaveBeenCalled());
    expect(container).toBeEmptyDOMElement();
  });

  it("s22 : réglage « Je reçois la lettre de la semaine » ACTIVÉ par défaut, ligne avec l'adresse et le lien Confidentialité, plus de case", async () => {
    mockInscriptions = true;
    fetchMock.mockResolvedValueOnce(etat());
    render(<LettreHebdoReglage />);
    const reglage = await screen.findByRole("switch", { name: LETTRE_HEBDO_REGLAGE });
    expect(reglage).toBeChecked();
    expect(screen.queryByRole("checkbox")).toBeNull();
    expect(texte(document.body)).toContain(attendu(LETTRE_HEBDO_LIGNE_REGLAGE.avantLien("yanis.m@exemple.fr")).trim());
    expect(screen.getByRole("link", { name: "Confidentialité" })).toHaveAttribute("href", "/confidentialite#lettre");
  });

  it("désactiver = PUT { enabled: false, origine: profil } puis « C'est arrêté » ; réactiver = PUT { enabled: true } puis « C'est noté »", async () => {
    mockInscriptions = true;
    fetchMock
      .mockResolvedValueOnce(etat())
      .mockResolvedValueOnce({ ok: true, status: 200, json: async () => ({ enabled: false }) })
      .mockResolvedValueOnce({ ok: true, status: 200, json: async () => ({ enabled: true }) });
    render(<LettreHebdoReglage />);
    fireEvent.click(await screen.findByRole("switch"));
    await waitFor(() => expect(screen.getByRole("switch")).not.toBeChecked());
    expect(JSON.parse(fetchMock.mock.calls[1][1].body)).toEqual({ enabled: false, origine: "profil" });
    expect(await screen.findByText(/C.est arrêté\. Ton abonnement continue\./)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("switch"));
    await waitFor(() => expect(screen.getByRole("switch")).toBeChecked());
    expect(fetchMock.mock.calls[2][0]).toBe("/api/lettre-premium/preference");
    expect(JSON.parse(fetchMock.mock.calls[2][1].body)).toEqual({ enabled: true, origine: "profil" });
    expect(await screen.findByText(/C.est noté\. Tu la recevras chaque jeudi/)).toBeInTheDocument();
  });

  it("arrêt explicite enregistré : réglage désactivé à l'ouverture", async () => {
    mockInscriptions = true;
    fetchMock.mockResolvedValueOnce(etat({ enabled: false, mensuelleSuspendue: false }));
    render(<LettreHebdoReglage />);
    expect(await screen.findByRole("switch")).not.toBeChecked();
  });

  it("H1-6 : erreur serveur, le réglage revient à son état précédent et le message exact s'affiche", async () => {
    mockInscriptions = true;
    fetchMock.mockResolvedValueOnce(etat()).mockResolvedValueOnce({ ok: false, status: 500, json: async () => ({}) });
    render(<LettreHebdoReglage />);
    fireEvent.click(await screen.findByRole("switch"));
    await waitFor(() => expect(screen.getByRole("status")).toHaveTextContent(attendu(LETTRE_HEBDO_UI.erreurProfil)));
    expect(screen.getByRole("switch")).toBeChecked();
  });

  it("H1-7 : session expirée, lien de reconnexion vers le profil, réglage inchangé", async () => {
    mockInscriptions = true;
    fetchMock.mockResolvedValueOnce(etat()).mockResolvedValueOnce({ ok: false, status: 401, json: async () => ({}) });
    render(<LettreHebdoReglage />);
    fireEvent.click(await screen.findByRole("switch"));
    expect(await screen.findByRole("link", { name: "Reconnecte-toi" })).toHaveAttribute("href", "/login?callbackUrl=/profil");
    expect(screen.getByRole("switch")).toBeChecked();
  });

  it("s22 (correction du 25/10) : aucune condition d'adresse vérifiée, le réglage s'affiche toujours pour un Premium", async () => {
    mockInscriptions = true;
    fetchMock.mockResolvedValueOnce(etat({ adresseVerifiee: false }));
    render(<LettreHebdoReglage />);
    expect(await screen.findByRole("switch")).toBeChecked();
    expect(texte(document.body)).not.toMatch(/Confirme ton adresse/);
  });

  it("s22 : opposition globale à nos e-mails : phrase d'explication, pas de réglage trompeur", async () => {
    mockInscriptions = true;
    fetchMock.mockResolvedValueOnce(etat({ opposition: true, mensuelleSuspendue: false }));
    render(<LettreHebdoReglage />);
    await waitFor(() => expect(texte(document.body)).toContain(attendu(LETTRE_HEBDO_UI.opposition)));
    expect(screen.queryByRole("switch")).toBeNull();
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
