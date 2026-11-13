/**
 * Espace client, lot D8 (s24), cloche côté navigateur (maquette `aujourdhui.html#cloche=…`, architecture 2.9) :
 * nom accessible au singulier, au pluriel et « aucune », égal au nombre de réponses non lues et jamais au
 * nombre de lignes ; aucun `aria-live`, aucune relecture à intervalles ; ouvrir le panneau ne lit rien ;
 * lignes en liens de 44 px, sans pastille ; état vide ; toucher une ligne ferme le panneau.
 * Confirmation avant « Retirer de mon historique » (13/11) : dialogue d'alerte, focus piégé (d'abord sur
 * « Annuler »), Échap = Annuler, focus rendu au bouton d'origine ; « Retirer » efface, statut focalisé.
 */
import { act, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Cloche, ClocheEspace } from "@/components/espace/cloche";
import { MesQuestions } from "@/components/espace/questions/mes-questions";
import { nomCloche, TEXTES_ESPACE_NAVIGATION as T } from "@/config/textes/espace-navigation";
import { TEXTES_CLOCHE as C } from "@/config/textes/espace-cloche";
import { TEXTES_QUESTIONS as Q } from "@/config/textes/espace-questions";
import type { ContenuCloche } from "@/lib/espace/cloche-types";
import type { FilListe } from "@/lib/espace/questions-types";

const fetchMock = jest.fn();
beforeAll(() => {
  class RO {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  Object.assign(globalThis, { ResizeObserver: RO });
});
beforeEach(() => {
  fetchMock.mockReset();
  global.fetch = fetchMock as unknown as typeof fetch;
});
const repond = (corps: unknown, status = 200) => Promise.resolve({ ok: status < 300, status, headers: { get: () => null }, json: async () => corps });

const reponse = (id: string, jour: string) => ({ id, type: "SITUATION" as const, reponduLe: `2026-11-${jour}T09:00:00Z`, href: `/mon-espace/questions/${id}` });
const PLEIN: ContenuCloche = {
  nonLues: 1,
  reponses: [reponse("fil1", "11")],
  nouveautes: [
    { genre: "carnet", le: "2026-11-01", href: "/carnet/2026-11" },
    { genre: "situations", le: "2026-11-10", href: "/mon-espace/quoi-repondre" },
    { genre: "bibliotheque", le: "2026-11-09", href: "/mon-espace/bibliotheque" },
  ],
  lettre: { numero: "2026-W46", titre: "La lettre du jeudi 12 novembre", href: "/mon-espace/lettres/2026-W46" },
};
const VIDE: ContenuCloche = { nonLues: 0, reponses: [], nouveautes: [], lettre: null };

describe("cloche : nom accessible et pastille", () => {
  it.each([
    [0, "Notifications, aucune réponse non lue", []],
    [1, "Notifications, 1 réponse de l'équipe non lue", [reponse("a", "11")]],
    [2, "Notifications, 2 réponses de l'équipe non lues", [reponse("a", "11"), reponse("b", "12")]],
  ])("%i réponse(s) non lue(s), avec 3 nouveautés et une lettre : « %s »", (n, nom, reponses) => {
    const { container } = render(<Cloche contenu={{ ...PLEIN, nonLues: n, reponses }} />);
    expect(screen.getByRole("button", { name: nom })).toBeInTheDocument();
    expect(nomCloche(n)).toBe(nom);
    expect(container.querySelectorAll("[data-pastille]")).toHaveLength(n > 0 ? 1 : 0);
  });

  it("aucun aria-live ; lue au montage et au changement d'adresse seulement, jamais à intervalles ni à l'ouverture", async () => {
    jest.useFakeTimers();
    fetchMock.mockImplementation(() => repond(PLEIN));
    const { container, rerender } = render(<ClocheEspace pathname="/mon-espace" />);
    expect(await screen.findByRole("button", { name: nomCloche(1) })).toBeInTheDocument();
    fetchMock.mockImplementation(() => repond({ ...PLEIN, nonLues: 2, reponses: [reponse("a", "11"), reponse("b", "12")] }));
    await act(async () => {
      jest.advanceTimersByTime(10 * 60_000);
    });
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("button", { name: nomCloche(1) })).toBeInTheDocument();
    jest.useRealTimers();
    await userEvent.click(screen.getByRole("button", { name: nomCloche(1) }));
    expect(await screen.findByRole("dialog")).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledTimes(1); // ouvrir le panneau ne lit ni n'écrit rien
    expect(fetchMock.mock.calls[0][0]).toBe("/api/espace/cloche");
    expect(document.body.querySelector("[aria-live], [role='status'], [role='alert']")).toBeNull();
    expect(container.querySelector("[aria-live]")).toBeNull();
    await userEvent.keyboard("{Escape}");
    rerender(<ClocheEspace pathname="/mon-espace/questions/a" />);
    expect(await screen.findByRole("button", { name: nomCloche(2) })).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});

describe("cloche : panneau", () => {
  it("groupes et lignes validés ; chaque ligne est un lien de 44 px ; aucune pastille de ligne", async () => {
    render(<Cloche contenu={PLEIN} />);
    await userEvent.click(screen.getByRole("button", { name: nomCloche(1) }));
    const panneau = await screen.findByRole("dialog", { name: T.cloche.titre });
    expect(within(panneau).getAllByRole("heading", { level: 3 }).map((h) => h.textContent)).toEqual([C.groupes.reponses, C.groupes.nouveautes, C.groupes.lettre]);
    const liens = within(panneau).getAllByRole("link");
    expect(liens.map((l) => [l.textContent, l.getAttribute("href")])).toEqual([
      ["Une situation à gérerRépondu le 11 novembre", "/mon-espace/questions/fil1"],
      [C.lignes.carnet, "/carnet/2026-11"],
      [C.lignes.situations, "/mon-espace/quoi-repondre"],
      [C.lignes.bibliotheque, "/mon-espace/bibliotheque"],
      ["La lettre du jeudi 12 novembre", "/mon-espace/lettres/2026-W46"],
    ]);
    for (const l of liens) expect(l.className).toMatch(/\bmin-h-11\b/);
    expect(panneau.querySelector("[data-pastille]")).toBeNull();
    expect(panneau).not.toHaveTextContent(T.cloche.vide);
  });

  it("état vide : « Rien de nouveau. Reviens quand tu veux. » ; rien de chargé : aucune ligne ni phrase", async () => {
    const { unmount } = render(<Cloche contenu={VIDE} />);
    await userEvent.click(screen.getByRole("button", { name: nomCloche(0) }));
    expect(await screen.findByRole("dialog")).toHaveTextContent(T.cloche.vide);
    unmount();
    render(<Cloche contenu={null} />);
    await userEvent.click(screen.getByRole("button", { name: nomCloche(0) }));
    const panneau = await screen.findByRole("dialog");
    expect(panneau).not.toHaveTextContent(T.cloche.vide);
    expect(within(panneau).queryAllByRole("link")).toHaveLength(0);
  });

  it("toucher une ligne ferme le panneau", async () => {
    render(<Cloche contenu={PLEIN} />);
    await userEvent.click(screen.getByRole("button", { name: nomCloche(1) }));
    const lien = within(await screen.findByRole("dialog")).getByRole("link", { name: C.lignes.carnet });
    lien.addEventListener("click", (e) => e.preventDefault());
    await userEvent.click(lien);
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
  });
});

const ATTENTE: FilListe = {
  id: "filattente01",
  type: "QUESTION",
  statut: "EN_ATTENTE",
  creeLe: "2026-11-10T09:00:00Z",
  dernierMessageLe: "2026-11-10T09:00:00Z",
  enRetard: false,
  nonLu: false,
  messages: [{ auteur: "ABONNE", corps: "Mon message", creeLe: "2026-11-10T09:00:00Z" }],
};

describe("confirmation avant « Retirer de mon historique »", () => {
  it("dialogue d'alerte nommé par la question ; focus sur « Annuler », piégé ; Échap et « Annuler » n'effacent rien, focus rendu", async () => {
    const u = userEvent.setup();
    render(<MesQuestions initiaux={[ATTENTE]} lectureSeule={false} />);
    const origine = screen.getByRole("button", { name: Q.envois.retirer });
    await u.click(origine);
    const dialogue = await screen.findByRole("alertdialog", { name: Q.confirmationRetrait.question });
    const annuler = within(dialogue).getByRole("button", { name: "Annuler" });
    const retirer = within(dialogue).getByRole("button", { name: "Retirer" });
    expect(annuler).toHaveFocus();
    await u.tab();
    expect(retirer).toHaveFocus();
    await u.tab();
    expect(annuler).toHaveFocus();
    await u.tab({ shift: true });
    expect(retirer).toHaveFocus();
    await u.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("alertdialog")).toBeNull());
    expect(origine).toHaveFocus();
    await u.click(origine);
    await u.click(within(await screen.findByRole("alertdialog")).getByRole("button", { name: "Annuler" }));
    await waitFor(() => expect(origine).toHaveFocus());
    expect(fetchMock).not.toHaveBeenCalled();
    expect(screen.getByText("Mon message")).toBeInTheDocument();
  });

  it("« Retirer » : DELETE, puis « Question retirée de ton historique. » à la place du fil, avec le focus", async () => {
    const u = userEvent.setup();
    fetchMock.mockImplementation(() => repond({ ok: true }));
    render(<MesQuestions initiaux={[ATTENTE]} lectureSeule={false} />);
    await u.click(screen.getByRole("button", { name: Q.envois.retirer }));
    await u.click(within(await screen.findByRole("alertdialog")).getByRole("button", { name: "Retirer" }));
    const statut = await screen.findByText("Question retirée de ton historique.");
    await waitFor(() => expect(statut).toHaveFocus());
    expect(fetchMock).toHaveBeenCalledWith("/api/espace/questions/filattente01", expect.objectContaining({ method: "DELETE" }));
    expect(screen.queryByText("Mon message")).toBeNull();
    expect(screen.queryByRole("alertdialog")).toBeNull();
  });

  it("échec : rien d'effacé à l'écran, dialogue fermé, focus rendu au bouton, erreur affichée", async () => {
    const u = userEvent.setup();
    fetchMock.mockImplementation(() => repond({ error: "indisponible" }, 503));
    render(<MesQuestions initiaux={[ATTENTE]} lectureSeule={false} />);
    const origine = screen.getByRole("button", { name: Q.envois.retirer });
    await u.click(origine);
    await u.click(within(await screen.findByRole("alertdialog")).getByRole("button", { name: "Retirer" }));
    await waitFor(() => expect(screen.queryByRole("alertdialog")).toBeNull());
    await waitFor(() => expect(origine).toHaveFocus());
    expect(screen.getByText("Mon message")).toBeInTheDocument();
    expect(screen.getByText(new RegExp(Q.erreurs.envoi.avant.slice(0, 20).replace(/[.*+?^${}()|[\]\\]/g, "\\$&")))).toBeInTheDocument();
  });
});
