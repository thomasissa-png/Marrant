/**
 * « Ta question à l'équipe » (V1, s22) : rendu de l'encadré du profil et des textes juridiques.
 *  - Encadré : seulement pour un Premium, interrupteur ouvert ; rien pour un compte sans
 *    Premium ni interrupteur fermé.
 *  - États : vide, envoi, succès (champ vidé), erreurs (vide, trop long, envoi impossible,
 *    trop d'envois, plus Premium, session expirée) avec le texte conservé dans le champ.
 *  - Tour 2 s22 : textes v2 (aucun « renvoie » ni « réessaie » faux), conservation CGU 7 et
 *    confidentialité 6 publiée avec le service.
 *  - Umami : événements sans aucun contenu de la question.
 *  - Confidentialité (section 9, partie 4) et CGU (article 10) : publiées seulement
 *    interrupteur ouvert ; délai CGU « au plus tard 3 jours ouvrés », jamais 7 jours.
 */
let mockOuvert = true;
jest.mock("@/config/question-equipe", () => ({
  ...jest.requireActual("@/config/question-equipe"),
  get QUESTION_EQUIPE_OUVERTE() {
    return mockOuvert;
  },
  get QUESTION_EQUIPE_DATE_TEXTES() {
    return mockOuvert ? "12 novembre 2026" : "";
  },
}));
jest.mock("@/lib/umami", () => ({ trackUmami: jest.fn(), trackUmamiWhenReady: jest.fn() }));
jest.mock("next-auth/react", () => ({ useSession: jest.fn(() => ({ status: "authenticated" })) }));
jest.mock("@/stores/user-store", () => ({ useUserStore: jest.fn() }));

import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import CGUPage from "@/app/(dashboard)/cgu/page";
import ConfidentialitePage from "@/app/(dashboard)/confidentialite/page";
import { ProfilDashboard } from "@/components/profil/profil-dashboard";
import { QuestionEquipeCard } from "@/components/profil/question-equipe-card";
import { trackUmami } from "@/lib/umami";
import { useUserStore } from "@/stores/user-store";
import * as configReelle from "@/config/question-equipe";
import {
  CGU_QUESTION_EQUIPE,
  CONFIDENTIALITE_QUESTION_EQUIPE,
  CONSERVATION_QUESTION_EQUIPE,
  PRESTATAIRES_QUESTION_EQUIPE,
  QUESTION_EQUIPE_DELAI,
  QUESTION_EQUIPE_UI as T,
} from "@/config/textes/question-equipe-s22";
import { courbe, lie, sansGluon } from "../helpers/texte-normalise";

const texte = (el: Element | null) => sansGluon(el?.textContent ?? "").replace(/\s+/g, " ").trim();
const attendu = (t: string) => sansGluon(lie(courbe(t))).replace(/\s+/g, " ");
const fetchMock = jest.fn();
/** Libellé tel qu'affiché (apostrophe typographique posée au rendu). */
const BOUTON = (nom: string) => sansGluon(nom).replace(/\s+/g, " ") === attendu(T.bouton);
const QUESTION = "Mon chef me chambre sur mes pulls en réunion, et je reste muet à chaque fois.";

function utilisateur(plan: "PREMIUM" | "FREE") {
  jest.mocked(useUserStore).mockReturnValue({
    user: { id: "u1", name: "Jean", email: "jean@test.fr", plan, level: "NOVICE", xp: 0, streak: 0, lastActiveAt: null, stats: { jokesRead: 0, tipsCompleted: 0, videosWatched: 0, totalFavorites: 0, pathsCompleted: 0 } },
    isLoading: false,
    fetchUser: jest.fn(),
  } as unknown as ReturnType<typeof useUserStore>);
}
const champ = () => screen.getByLabelText(T.libelle) as HTMLTextAreaElement;
const reponse = (status: number, corps: Record<string, unknown>, entetes: Record<string, string> = {}) => ({
  ok: status < 300,
  status,
  headers: new Headers(entetes),
  json: async () => corps,
});

beforeEach(() => {
  mockOuvert = true;
  fetchMock.mockReset();
  fetchMock.mockResolvedValue(reponse(200, { parcours: [] }));
  global.fetch = fetchMock as unknown as typeof fetch;
  jest.mocked(trackUmami).mockClear();
});

describe("Encadré dans le profil : Premium seulement, interrupteur ouvert", () => {
  it("Premium, interrupteur ouvert : encadré rendu sous la carte abonnement", () => {
    utilisateur("PREMIUM");
    render(<ProfilDashboard />);
    const encadre = screen.getByTestId("question-equipe");
    expect(texte(encadre)).toContain(attendu(T.titre));
    expect(texte(encadre)).toContain(attendu(QUESTION_EQUIPE_DELAI));
    // Juste après la carte abonnement.
    expect(encadre.previousElementSibling?.id).toBe("abonnement");
  });

  it("compte sans Premium : rien", () => {
    utilisateur("FREE");
    render(<ProfilDashboard />);
    expect(screen.queryByTestId("question-equipe")).not.toBeInTheDocument();
    expect(document.body.textContent).not.toMatch(/Ta question/);
  });

  it("interrupteur fermé : rien, même pour un Premium", () => {
    mockOuvert = false;
    utilisateur("PREMIUM");
    render(<ProfilDashboard />);
    expect(screen.queryByTestId("question-equipe")).not.toBeInTheDocument();
    expect(document.body.textContent).not.toMatch(/Ta question/);
  });

  it("le vrai interrupteur est fermé, ou ouvert avec une date de publication des textes", () => {
    const reel = jest.requireActual("@/config/question-equipe") as typeof configReelle;
    expect(reel.QUESTION_EQUIPE_OUVERTE === false || reel.QUESTION_EQUIPE_DATE_TEXTES.length > 0).toBe(true);
  });
});

describe("Formulaire : états et accessibilité", () => {
  it("état vide : libellé, aide, compteur, bouton, mention avec lien vers la section 9", () => {
    render(<QuestionEquipeCard />);
    expect(champ().value).toBe("");
    expect(champ().getAttribute("aria-describedby")).toMatch(/aide.*compteur/);
    expect(texte(screen.getByTestId("question-equipe"))).toContain("0 / 1 000 caractères");
    expect(screen.getByRole("button", { name: BOUTON })).toBeEnabled();
    const lien = screen.getByRole("link", { name: T.mention.lien });
    expect(lien.getAttribute("href")).toBe("/confidentialite#question-equipe");
    expect(texte(screen.getByTestId("question-equipe-statut"))).toBe("");
  });

  it("envoi vide : erreur « vide » (role alert), aucun appel, focus sur le champ", () => {
    render(<QuestionEquipeCard />);
    fireEvent.change(champ(), { target: { value: "   " } });
    fireEvent.click(screen.getByRole("button", { name: BOUTON }));
    expect(texte(screen.getByRole("alert"))).toBe(attendu(T.erreurs.vide));
    expect(fetchMock).not.toHaveBeenCalled();
    expect(document.activeElement).toBe(champ());
    expect(champ()).toHaveAttribute("aria-invalid", "true");
  });

  it("trop long : compteur en erreur, message « trop long », texte conservé, aucun appel", () => {
    render(<QuestionEquipeCard />);
    const long = "a".repeat(1001);
    fireEvent.change(champ(), { target: { value: long } });
    expect(texte(screen.getByTestId("question-equipe"))).toContain("1 001 / 1 000 caractères");
    fireEvent.click(screen.getByRole("button", { name: BOUTON }));
    expect(texte(screen.getByRole("alert"))).toContain("dépasse 1 000 caractères");
    expect(champ().value).toBe(long);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("succès : « Envoi en cours » puis message de succès (aria-live), champ vidé, Umami sans contenu", async () => {
    let finir: (v: unknown) => void = () => {};
    fetchMock.mockReturnValueOnce(new Promise((r) => (finir = r)));
    render(<QuestionEquipeCard />);
    fireEvent.change(champ(), { target: { value: QUESTION } });
    fireEvent.click(screen.getByRole("button", { name: BOUTON }));
    expect(screen.getByRole("button", { name: T.envoiEnCours })).toBeDisabled();
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("/api/question-equipe");
    expect(JSON.parse((init as RequestInit).body as string)).toEqual({ question: QUESTION, tentative: expect.stringMatching(/^\d{13}-[A-Za-z0-9]{8,40}$/) });
    await act(async () => finir(reponse(200, { envoye: true })));
    const statut = screen.getByTestId("question-equipe-statut");
    // Conteneur live toujours présent (revue design C2), succès en bloc visible.
    expect(statut.closest("[role=status]")).toHaveAttribute("aria-live", "polite");
    expect(statut.className).toMatch(/border-success/);
    expect(texte(statut)).toBe(attendu(T.succes));
    expect(champ().value).toBe("");
    expect(trackUmami).toHaveBeenCalledWith("question-equipe-envoyee");
    for (const appel of jest.mocked(trackUmami).mock.calls) expect(JSON.stringify(appel)).not.toContain("chambre");
  });

  it.each([
    ["session expirée (401)", 401, "session", "Reconnecte-toi"],
    ["trop d'envois (429, limite du jour)", 429, "trop", "Trop d’envois pour le moment. Réessaie plus tard"],
    ["envoi impossible (503)", 503, "envoi", "Ton message n’est pas parti"],
    ["plus Premium côté serveur (403)", 403, "non-premium", "ton abonnement n’est plus actif"],
  ])("%s : message d'erreur, texte conservé dans le champ", async (_, status, code, extrait) => {
    fetchMock.mockResolvedValueOnce(reponse(status, { error: code }, status === 429 ? { "Retry-After": "7200" } : {}));
    render(<QuestionEquipeCard />);
    fireEvent.change(champ(), { target: { value: QUESTION } });
    fireEvent.click(screen.getByRole("button", { name: BOUTON }));
    await waitFor(() => expect(screen.getByRole("alert")).toBeInTheDocument());
    expect(texte(screen.getByRole("alert"))).toContain(extrait);
    expect(champ().value).toBe(QUESTION);
    expect(document.activeElement).toBe(champ());
    for (const appel of jest.mocked(trackUmami).mock.calls) expect(JSON.stringify(appel)).not.toContain("chambre");
  });

  it("trop d'envois avec Retry-After ≤ 15 min : « dans quelques minutes »", async () => {
    fetchMock.mockResolvedValueOnce(reponse(429, { error: "trop" }, { "Retry-After": "300" }));
    render(<QuestionEquipeCard />);
    fireEvent.change(champ(), { target: { value: QUESTION } });
    fireEvent.click(screen.getByRole("button", { name: BOUTON }));
    await waitFor(() => expect(texte(screen.getByRole("alert"))).toBe(attendu(T.erreurs.tropCourt)));
  });

  it("plus Premium (403) : lien vers l'abonnement, bouton grisé, aucun « réessaie »", async () => {
    fetchMock.mockResolvedValueOnce(reponse(403, { error: "non-premium" }));
    render(<QuestionEquipeCard />);
    fireEvent.change(champ(), { target: { value: QUESTION } });
    fireEvent.click(screen.getByRole("button", { name: BOUTON }));
    await waitFor(() => expect(screen.getByRole("alert")).toBeInTheDocument());
    expect(screen.getByRole("link", { name: T.erreurs.nonPremium.lien }).getAttribute("href")).toBe("/abonnement");
    expect(screen.getByRole("button", { name: BOUTON })).toBeDisabled();
    expect(texte(screen.getByRole("alert"))).not.toMatch(/éessaie/);
  });

  it("envoi impossible et trop d'envois : adresse de l'équipe en lien mailto", async () => {
    fetchMock.mockResolvedValueOnce(reponse(503, { error: "envoi" }));
    render(<QuestionEquipeCard />);
    fireEvent.change(champ(), { target: { value: QUESTION } });
    fireEvent.click(screen.getByRole("button", { name: BOUTON }));
    await waitFor(() => expect(screen.getByRole("alert")).toBeInTheDocument());
    expect(screen.getByRole("link", { name: "contact@deviens-marrant.fr" }).getAttribute("href")).toBe("mailto:contact@deviens-marrant.fr");
  });

  it("aucun « renvoie » quand rien n'est parti ; « réessaie » seulement là où c'est vrai", () => {
    const sansReessai = [T.erreurs.vide, T.erreurs.tropLong("1 000"), T.erreurs.session.apres, T.erreurs.nonPremium.avant];
    for (const t of sansReessai) expect(t).not.toMatch(/renvoie|éessaie/i);
    for (const t of [T.erreurs.envoi.avant, T.erreurs.trop.avant]) expect(t).not.toMatch(/renvoie|quelques minutes/i);
  });

  it("réseau coupé : « envoi impossible », texte conservé", async () => {
    fetchMock.mockRejectedValueOnce(new Error("réseau"));
    render(<QuestionEquipeCard />);
    fireEvent.change(champ(), { target: { value: QUESTION } });
    fireEvent.click(screen.getByRole("button", { name: BOUTON }));
    await waitFor(() => expect(texte(screen.getByRole("alert"))).toContain("Ton message n’est pas parti"));
    expect(champ().value).toBe(QUESTION);
  });
});

describe("Textes juridiques : publiés avec l'ouverture, jamais avant", () => {
  it("interrupteur fermé : ni section 9, ni IONOS, ni outils de rédaction ; CGU article 10 inchangé ; date inchangée", () => {
    mockOuvert = false;
    const conf = render(<ConfidentialitePage />).container;
    expect(conf.querySelector("#question-equipe")).toBeNull();
    expect(texte(conf)).not.toMatch(/Ta question|IONOS|Gmail|Outils de rédaction|messages à l’équipe/);
    expect(texte(conf)).toContain("Dernière mise à jour : 17 octobre 2026");
    const cgu = render(<CGUPage />).container;
    expect(cgu.querySelector("section#lettre h2")?.textContent).toBe("10. La lettre");
    expect(texte(cgu)).not.toMatch(/Ta question/);
    // Correction de cohérence toujours publiée (avis @legal §4.3, modification 1).
    expect(texte(cgu)).toContain("les données de ton compte sont effacées");
    expect(texte(conf)).toContain("Les données de ton compte sont conservées tant que ton compte existe, sauf les exceptions indiquées dans cette partie.");
  });

  it("interrupteur ouvert : section 9 mot pour mot (ancre), partie 4 complétée, date de publication", () => {
    const conf = render(<ConfidentialitePage />).container;
    const s9 = conf.querySelector("section#question-equipe");
    expect(s9?.querySelector("h2")?.textContent).toBe(attendu(CONFIDENTIALITE_QUESTION_EQUIPE.titre));
    for (const p of CONFIDENTIALITE_QUESTION_EQUIPE.puces) expect(texte(s9)).toContain(attendu(p));
    const tout = texte(conf);
    expect(tout).toContain(`Resend : ${attendu(PRESTATAIRES_QUESTION_EQUIPE.resendRole)}`);
    // contact@ chez IONOS, transféré vers Gmail : Google déclaré pour les messages à l'équipe.
    expect(tout).toContain(`Google : ${attendu(PRESTATAIRES_QUESTION_EQUIPE.googleRole)}`);
    expect(tout).toMatch(/IONOS : .*transfère tes messages à l’équipe vers sa messagerie Gmail/);
    for (const a of PRESTATAIRES_QUESTION_EQUIPE.ajouts) expect(tout).toContain(`${a.nom} : ${attendu(a.role)}`);
    expect(tout).toContain("Dernière mise à jour : 12 novembre 2026");
  });

  it("interrupteur ouvert : CGU article 10 renommé et complété, au plus tard 3 jours ouvrés, jamais 7 jours", () => {
    const cgu = render(<CGUPage />).container;
    const art10 = cgu.querySelector("section#lettre");
    expect(art10?.querySelector("h2")?.textContent).toBe(attendu(CGU_QUESTION_EQUIPE.titre));
    expect(texte(art10)).toContain(attendu(CGU_QUESTION_EQUIPE.texte));
    expect(texte(art10)).toContain("au plus tard sous 3 jours ouvrés");
    expect(texte(cgu)).not.toMatch(/7 jours/);
    expect(texte(cgu)).toContain("Dernière mise à jour : 12 novembre 2026");
  });

  it("interrupteur ouvert : conservation propre des échanges en CGU 7 et confidentialité 6 ; fermé : absente", () => {
    const cgu = render(<CGUPage />).container;
    expect(texte(cgu.querySelector("[data-testid=cgu-conservation-question-equipe]"))).toBe(attendu(CONSERVATION_QUESTION_EQUIPE.cgu));
    const conf = render(<ConfidentialitePage />).container;
    expect(texte(conf.querySelector("[data-testid=confidentialite-conservation-question-equipe]"))).toBe(attendu(CONSERVATION_QUESTION_EQUIPE.confidentialite));
    expect(texte(conf)).toMatch(/alex@deviens-marrant\.fr, hébergée chez IONOS/);
    mockOuvert = false;
    expect(render(<CGUPage />).container.querySelector("[data-testid=cgu-conservation-question-equipe]")).toBeNull();
    expect(render(<ConfidentialitePage />).container.querySelector("[data-testid=confidentialite-conservation-question-equipe]")).toBeNull();
  });
});

describe("Tentative (idempotence s22) : même texte renvoyé = même tentative", () => {
  const tentatives = () =>
    fetchMock.mock.calls
      .filter(([url]) => url === "/api/question-equipe")
      .map(([, init]) => (JSON.parse((init as RequestInit).body as string) as { tentative: string }).tentative);
  const envoyerTexte = async (valeur: string) => {
    fireEvent.change(champ(), { target: { value: valeur } });
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: BOUTON }));
    });
  };

  it("échec puis renvoi du même texte : même tentative ; texte modifié : nouvelle ; après succès : nouvelle", async () => {
    fetchMock.mockResolvedValueOnce(reponse(503, { error: "envoi" }));
    render(<QuestionEquipeCard />);
    await envoyerTexte(QUESTION);
    fetchMock.mockResolvedValueOnce(reponse(503, { error: "envoi" }));
    await envoyerTexte(QUESTION);
    fetchMock.mockResolvedValueOnce(reponse(200, { envoye: true }));
    await envoyerTexte(`${QUESTION} Une précision.`);
    fetchMock.mockResolvedValueOnce(reponse(200, { envoye: true }));
    await envoyerTexte(`${QUESTION} Une précision.`);
    const [a, b, c, d] = tentatives();
    expect(a).toMatch(/^\d{13}-[A-Za-z0-9]{8,40}$/);
    expect(b).toBe(a);
    expect(c).not.toBe(a);
    expect(d).not.toBe(c);
  });

  it("même texte renvoyé plus de 10 minutes après : nouvelle tentative", async () => {
    let maintenant = Date.UTC(2026, 10, 12, 10, 0);
    const spy = jest.spyOn(Date, "now").mockImplementation(() => maintenant);
    try {
      fetchMock.mockResolvedValue(reponse(503, { error: "envoi" }));
      render(<QuestionEquipeCard />);
      await envoyerTexte(QUESTION);
      maintenant += 11 * 60_000;
      await envoyerTexte(QUESTION);
      const [a, b] = tentatives();
      expect(b).not.toBe(a);
      expect(Number(b.split("-")[0])).toBe(maintenant);
    } finally {
      spy.mockRestore();
    }
  });
});
