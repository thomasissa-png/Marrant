/**
 * « Ta question à l'équipe » (V1, s22) : rendu de l'encadré du profil et des textes juridiques.
 *  - Encadré : seulement pour un Premium, interrupteur ouvert ; rien pour un compte sans
 *    Premium ni interrupteur fermé.
 *  - États : vide, envoi, succès (champ vidé), erreurs (vide, trop long, envoi impossible,
 *    trop d'envois, session expirée) avec le texte conservé dans le champ.
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
  PRESTATAIRES_QUESTION_EQUIPE,
  QUESTION_EQUIPE_DELAI,
  QUESTION_EQUIPE_UI as T,
} from "@/config/textes/question-equipe-s22";
import { courbe, lie, sansGluon } from "../helpers/texte-normalise";

const texte = (el: Element | null) => sansGluon(el?.textContent ?? "").replace(/\s+/g, " ").trim();
const attendu = (t: string) => sansGluon(lie(courbe(t))).replace(/\s+/g, " ");
const fetchMock = jest.fn();
const QUESTION = "Mon chef me chambre sur mes pulls en réunion, et je reste muet à chaque fois.";

function utilisateur(plan: "PREMIUM" | "FREE") {
  jest.mocked(useUserStore).mockReturnValue({
    user: { id: "u1", name: "Jean", email: "jean@test.fr", plan, level: "NOVICE", xp: 0, streak: 0, lastActiveAt: null, stats: { jokesRead: 0, tipsCompleted: 0, videosWatched: 0, totalFavorites: 0, pathsCompleted: 0 } },
    isLoading: false,
    fetchUser: jest.fn(),
  } as unknown as ReturnType<typeof useUserStore>);
}
const champ = () => screen.getByLabelText(T.libelle) as HTMLTextAreaElement;
const reponse = (status: number, corps: Record<string, unknown>) => ({ ok: status < 300, status, json: async () => corps });

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
    expect(screen.getByRole("button", { name: T.bouton })).toBeEnabled();
    const lien = screen.getByRole("link", { name: T.mention.lien });
    expect(lien.getAttribute("href")).toBe("/confidentialite#question-equipe");
    expect(texte(screen.getByTestId("question-equipe-statut"))).toBe("");
  });

  it("envoi vide : erreur « vide » (role alert), aucun appel, focus sur le champ", () => {
    render(<QuestionEquipeCard />);
    fireEvent.change(champ(), { target: { value: "   " } });
    fireEvent.click(screen.getByRole("button", { name: T.bouton }));
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
    fireEvent.click(screen.getByRole("button", { name: T.bouton }));
    expect(texte(screen.getByRole("alert"))).toContain("dépasse 1 000 caractères");
    expect(champ().value).toBe(long);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("succès : « Envoi en cours » puis message de succès (aria-live), champ vidé, Umami sans contenu", async () => {
    let finir: (v: unknown) => void = () => {};
    fetchMock.mockReturnValueOnce(new Promise((r) => (finir = r)));
    render(<QuestionEquipeCard />);
    fireEvent.change(champ(), { target: { value: QUESTION } });
    fireEvent.click(screen.getByRole("button", { name: T.bouton }));
    expect(screen.getByRole("button", { name: T.envoiEnCours })).toBeDisabled();
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("/api/question-equipe");
    expect(JSON.parse((init as RequestInit).body as string)).toEqual({ question: QUESTION });
    await act(async () => finir(reponse(200, { envoye: true })));
    const statut = screen.getByTestId("question-equipe-statut");
    expect(statut).toHaveAttribute("aria-live", "polite");
    expect(texte(statut)).toBe(attendu(T.succes));
    expect(champ().value).toBe("");
    expect(trackUmami).toHaveBeenCalledWith("question-equipe-envoyee");
    for (const appel of jest.mocked(trackUmami).mock.calls) expect(JSON.stringify(appel)).not.toContain("chambre");
  });

  it.each([
    ["session expirée (401)", 401, "session", "Reconnecte-toi"],
    ["trop d'envois (429)", 429, "trop", "Trop d’envois en peu de temps"],
    ["envoi impossible (503)", 503, "envoi", "contact@deviens-marrant.fr"],
    ["non-Premium côté serveur (403)", 403, "non-premium", "contact@deviens-marrant.fr"],
  ])("%s : message d'erreur, texte conservé dans le champ", async (_, status, code, extrait) => {
    fetchMock.mockResolvedValueOnce(reponse(status, { error: code }));
    render(<QuestionEquipeCard />);
    fireEvent.change(champ(), { target: { value: QUESTION } });
    fireEvent.click(screen.getByRole("button", { name: T.bouton }));
    await waitFor(() => expect(screen.getByRole("alert")).toBeInTheDocument());
    expect(texte(screen.getByRole("alert"))).toContain(extrait);
    expect(champ().value).toBe(QUESTION);
    expect(document.activeElement).toBe(champ());
    for (const appel of jest.mocked(trackUmami).mock.calls) expect(JSON.stringify(appel)).not.toContain("chambre");
  });

  it("réseau coupé : « envoi impossible », texte conservé", async () => {
    fetchMock.mockRejectedValueOnce(new Error("réseau"));
    render(<QuestionEquipeCard />);
    fireEvent.change(champ(), { target: { value: QUESTION } });
    fireEvent.click(screen.getByRole("button", { name: T.bouton }));
    await waitFor(() => expect(texte(screen.getByRole("alert"))).toContain("Ton message n’est pas parti"));
    expect(champ().value).toBe(QUESTION);
  });
});

describe("Textes juridiques : publiés avec l'ouverture, jamais avant", () => {
  it("interrupteur fermé : ni section 9, ni IONOS, ni outils de rédaction ; CGU article 10 inchangé ; date inchangée", () => {
    mockOuvert = false;
    const conf = render(<ConfidentialitePage />).container;
    expect(conf.querySelector("#question-equipe")).toBeNull();
    expect(texte(conf)).not.toMatch(/Ta question|IONOS|Outils de rédaction|messages à l’équipe/);
    expect(texte(conf)).toContain("Dernière mise à jour : 17 octobre 2026");
    const cgu = render(<CGUPage />).container;
    expect(cgu.querySelector("section#lettre h2")?.textContent).toBe("10. La lettre");
    expect(texte(cgu)).not.toMatch(/Ta question/);
  });

  it("interrupteur ouvert : section 9 mot pour mot (ancre), partie 4 complétée, date de publication", () => {
    const conf = render(<ConfidentialitePage />).container;
    const s9 = conf.querySelector("section#question-equipe");
    expect(s9?.querySelector("h2")?.textContent).toBe(attendu(CONFIDENTIALITE_QUESTION_EQUIPE.titre));
    for (const p of CONFIDENTIALITE_QUESTION_EQUIPE.puces) expect(texte(s9)).toContain(attendu(p));
    const tout = texte(conf);
    expect(tout).toContain(`Resend : ${attendu(PRESTATAIRES_QUESTION_EQUIPE.resendRole)}`);
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
});
