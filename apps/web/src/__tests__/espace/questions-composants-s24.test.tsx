/**
 * Espace client, lot D7 (s24), « Mes questions » côté navigateur (maquette `mes-questions.html`) : libellés
 * validés mot pour mot, état vide (un exemple par type et le délai), envoi en cours puis envoyé, échec
 * (texte CONSERVÉ dans le champ, erreur reliée au champ), retard, répondu (ouvrir le fil le rend lu),
 * « Retirer », lecture seule (ni formulaire ni « Continuer », retrait possible, adresse de l'équipe),
 * préremplissage lu une fois côté navigateur (jamais dans l'adresse, jamais envoyé seul).
 */
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { act, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MesQuestions } from "@/components/espace/questions/mes-questions";
import { preparerQuestion } from "@/components/espace/questions/prefill";
import { TEXTES_QUESTIONS as Q, EMAIL_REPONSE_VALIDE } from "@/config/textes/espace-questions";
import type { FilListe } from "@/lib/espace/questions-types";

const fetchMock = jest.fn();
beforeEach(() => {
  fetchMock.mockReset();
  global.fetch = fetchMock as unknown as typeof fetch;
  window.sessionStorage.clear();
});
/** Réponse minimale (jsdom n'a pas `Response`). */
const faux = (status: number, corps: unknown, entetes: Record<string, string> = {}) => ({
  ok: status >= 200 && status < 300,
  status,
  headers: { get: (n: string) => entetes[n] ?? null },
  json: async () => corps,
});
const reponse = (status: number, corps: unknown, entetes: Record<string, string> = {}) => Promise.resolve(faux(status, corps, entetes));

const attente: FilListe = {
  id: "filattente01",
  type: "QUESTION",
  statut: "EN_ATTENTE",
  creeLe: "2026-11-10T09:00:00Z",
  dernierMessageLe: "2026-11-10T09:00:00Z",
  enRetard: false,
  nonLu: false,
  messages: [{ auteur: "ABONNE", corps: "Mon message", creeLe: "2026-11-10T09:00:00Z" }],
};
const repondu: FilListe = {
  ...attente,
  id: "filrepondu01",
  type: "SITUATION",
  statut: "REPONDU",
  creeLe: "2026-11-09T09:00:00Z",
  nonLu: true,
  messages: [
    { auteur: "ABONNE", corps: "La scène", creeLe: "2026-11-09T09:00:00Z" },
    { auteur: "EQUIPE", corps: "La réponse", creeLe: "2026-11-11T09:00:00Z" },
  ],
};

it("libellés validés : formulaire, types, délai, bouton ; aucun tiret cadratin dans les textes", () => {
  render(<MesQuestions initiaux={[attente]} lectureSeule={false} />);
  expect(screen.getByRole("heading", { name: "Écrire à l'équipe" })).toBeInTheDocument();
  expect(screen.getByRole("group", { name: "C'est à propos de quoi ?" })).toBeInTheDocument();
  expect(screen.getByRole("radio", { name: /Une question/ })).toBeChecked();
  expect(screen.getAllByRole("radio")).toHaveLength(3);
  expect(screen.getByLabelText("Ton message")).toHaveAccessibleDescription(/Évite les noms : décris la scène\. L'équipe répond en général sous 1 à 2 jours ouvrés/);
  expect(screen.getByRole("button", { name: "Envoyer à l'équipe" })).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: "Mes envois" })).toBeInTheDocument();
  expect(screen.getByText("Envoyé le 10 novembre")).toBeInTheDocument();
  expect(screen.getByText(Q.envois.enAttente)).toBeInTheDocument();
  expect(JSON.stringify(Q)).not.toContain("—");
  // Décision de Thomas du 13/11 : texte de l'e-mail validé ; l'envoi reste derrière l'interrupteur de
  // l'espace (preuve : `cloche-s24.test.ts`, « e-mail de réponse »).
  expect(EMAIL_REPONSE_VALIDE).toBe(true);
});

it("état vide : un exemple par type et la phrase sur le délai, jamais une liste vide", () => {
  render(<MesQuestions initiaux={[]} lectureSeule={false} />);
  const vide = document.querySelector("[data-etat='vide']") as HTMLElement;
  expect(within(vide).getByText("Par exemple, pour « Une question » :")).toBeInTheDocument();
  for (const t of ["QUESTION", "PROBLEME", "SITUATION"] as const) expect(within(vide).getByText(Q.types[t].exemple)).toBeInTheDocument();
  expect(within(vide).getByText(Q.ecrire.delai)).toBeInTheDocument();
});

it("envoi : « Envoi en cours », échec = texte conservé et erreur reliée au champ ; puis « Envoyé »", async () => {
  const u = userEvent.setup();
  render(<MesQuestions initiaux={[]} lectureSeule={false} />);
  await u.click(screen.getByRole("button", { name: "Envoyer à l'équipe" }));
  expect(screen.getByLabelText("Ton message")).toHaveAccessibleDescription(expect.stringContaining(Q.erreurs.vide));
  expect(fetchMock).not.toHaveBeenCalled();
  await u.type(screen.getByLabelText("Ton message"), "Une scène au boulot");
  let finir: (r: ReturnType<typeof faux>) => void = () => undefined;
  fetchMock.mockReturnValueOnce(new Promise<ReturnType<typeof faux>>((r) => (finir = r)));
  await u.click(screen.getByRole("button", { name: "Envoyer à l'équipe" }));
  expect(screen.getByRole("button", { name: "Envoi en cours" })).toBeDisabled();
  await act(async () => finir(faux(503, { error: "indisponible" })));
  expect(screen.getByLabelText("Ton message")).toHaveValue("Une scène au boulot");
  expect(screen.getByLabelText("Ton message")).toHaveAccessibleDescription(expect.stringContaining("On n'a pas pu confirmer l'envoi."));
  const cle = JSON.parse(fetchMock.mock.calls[0][1].body as string).cle as string;
  fetchMock.mockReturnValueOnce(reponse(200, { fil: { ...attente, id: "filnouveau01", messages: [{ ...attente.messages[0], corps: "Une scène au boulot" }] } }));
  await u.click(screen.getByRole("button", { name: "Envoyer à l'équipe" }));
  // Renvoi après échec : même clé (un seul fil si le premier envoi était en fait passé).
  expect(JSON.parse(fetchMock.mock.calls[1][1].body as string).cle).toBe(cle);
  await waitFor(() => expect(document.querySelector("[data-formulaire-question] [role='status']")).toHaveTextContent(Q.ecrire.envoye));
  expect(screen.getByLabelText("Ton message")).toHaveValue("");
  expect(screen.getByText("Une scène au boulot")).toBeInTheDocument();
});

it("retard, répondu (ouvrir le fil le rend lu, une fois), « Continuer », « Retirer »", async () => {
  const u = userEvent.setup();
  render(<MesQuestions initiaux={[repondu, { ...attente, enRetard: true }]} lectureSeule={false} />);
  expect(screen.getByText(Q.envois.enRetard)).toBeInTheDocument();
  fetchMock.mockReturnValue(reponse(200, { ok: true }));
  await u.click(screen.getByText("Répondu le 11 novembre"));
  expect(fetchMock).toHaveBeenCalledWith("/api/espace/questions/filrepondu01/ouvert", expect.objectContaining({ method: "POST" }));
  expect(screen.getByText("Réponse de l'équipe, le 11 novembre")).toBeInTheDocument();
  expect(screen.getByText("L'Équipe Deviens Marrant")).toBeInTheDocument();
  await u.click(screen.getByText("Répondu le 11 novembre"));
  await u.click(screen.getByText("Répondu le 11 novembre"));
  expect(fetchMock.mock.calls.filter((c) => String(c[0]).endsWith("/ouvert"))).toHaveLength(1);
  await u.click(screen.getByRole("button", { name: "Continuer" }));
  expect(screen.getAllByLabelText("Ton message")).toHaveLength(2);
  await u.click(screen.getAllByRole("button", { name: "Retirer de mon historique" })[1]);
  await u.click(within(await screen.findByRole("alertdialog")).getByRole("button", { name: "Retirer" }));
  expect(await screen.findByText("Question retirée de ton historique.")).toBeInTheDocument();
  expect(fetchMock).toHaveBeenCalledWith("/api/espace/questions/filattente01", expect.objectContaining({ method: "DELETE" }));
});

it("lecture seule (abonnement terminé) : ni formulaire ni « Continuer », retrait possible, adresse de l'équipe", async () => {
  const u = userEvent.setup();
  render(<MesQuestions initiaux={[repondu]} lectureSeule />);
  expect(screen.queryByRole("heading", { name: "Écrire à l'équipe" })).toBeNull();
  await u.click(screen.getByText("Répondu le 11 novembre"));
  expect(screen.queryByRole("button", { name: "Continuer" })).toBeNull();
  expect(screen.getByRole("button", { name: "Retirer de mon historique" })).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "contact@deviens-marrant.fr" })).toHaveAttribute("href", "mailto:contact@deviens-marrant.fr");
});

it("préremplissage : lu une fois depuis l'onglet, type et texte posés, rien d'envoyé, rien dans l'adresse", () => {
  preparerQuestion({ type: "SITUATION", texte: "Ma réplique à moi" });
  const { unmount } = render(<MesQuestions initiaux={[]} lectureSeule={false} />);
  expect(screen.getByLabelText("Ton message")).toHaveValue("Ma réplique à moi");
  expect(screen.getByRole("radio", { name: /Une situation à gérer/ })).toBeChecked();
  expect(fetchMock).not.toHaveBeenCalled();
  expect(window.location.href).not.toContain("r%C3%A9plique");
  unmount();
  render(<MesQuestions initiaux={[]} lectureSeule={false} />);
  expect(screen.getByLabelText("Ton message")).toHaveValue("");
});

it("aucun appel à Umami ni à la mesure d'usage dans les composants de « Mes questions »", () => {
  const dossier = join(__dirname, "../../components/espace/questions");
  for (const f of readdirSync(dossier)) expect([f, /umami|\/api\/mesure/i.test(readFileSync(join(dossier, f), "utf8"))]).toEqual([f, false]);
});
