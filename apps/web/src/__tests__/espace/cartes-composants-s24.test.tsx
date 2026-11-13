/**
 * Espace client, lot D5 (s24), composants : la note de l'abonné n'est PAS dans le DOM avant « Tu avais
 * une réponse ? » (pas seulement masquée) ; « Prends ton temps » (boutons en attente, jamais bloquants) ;
 * ligne de règle ; note « ma réplique à moi » (enregistrée, échec sans perte, confirmation, supprimée) ;
 * « Mes répliques » (vide, modifier, confirmer, supprimée, lecture seule) ; mission (trois suites).
 */
import { act, fireEvent, render, screen } from "@testing-library/react";
import situationPoele from "@/lib/espace/fixtures/situation-coloc-la-poele.json";
import missionsFixtures from "@/lib/espace/fixtures/missions.json";
import { ficheSchema, type Fiche } from "@/lib/espace/fiches-schema";
import { cartesDesSituations } from "@/lib/espace/rafale";
import { CarteRegistre } from "@/components/espace/carte/carte-registre";
import { NoteReplique } from "@/components/espace/carte/note-replique";
import { ListeRepliques } from "@/components/espace/repliques/liste-repliques";
import { MissionCarte, type MissionVue } from "@/components/espace/mission/mission-carte";
import { PRENDS_TON_TEMPS_MS } from "@/components/espace/carte/boutons-reponse";
import { TEXTES_CARTES as T, TEXTES_GESTE as G, TEXTES_MISSION as M } from "@/config/textes/espace-cartes";
import { TEXTES_REPLIQUES as R } from "@/config/textes/espace-repliques";

const NOTE = "Ma version à moi, jamais avant la réponse";
const carte = cartesDesSituations([ficheSchema.parse(situationPoele) as Extract<Fiche, { type: "situation" }>])[0];

type Reponse = { ok: boolean; corps: unknown };
let reponses: Reponse[] = [];
const appels: Array<{ url: string; init?: RequestInit }> = [];
beforeEach(() => {
  reponses = [];
  appels.length = 0;
  global.fetch = jest.fn(async (url: RequestInfo | URL, init?: RequestInit) => {
    appels.push({ url: String(url), init });
    const r = reponses.shift() ?? { ok: true, corps: { ok: true } };
    return { ok: r.ok, json: async () => r.corps } as Response;
  }) as unknown as typeof fetch;
  jest.useFakeTimers();
});
afterEach(() => jest.useRealTimers());

async function attendre() {
  await act(async () => {
    await Promise.resolve();
    await Promise.resolve();
  });
}

describe("carte « Quel registre ? » en révision", () => {
  it("la note n'est dans le DOM qu'après la réponse ; boutons en attente pendant « Prends ton temps »", async () => {
    render(<CarteRegistre carte={carte} nouvelle={false} ancre="carte-1" />);
    expect(document.body.innerHTML).not.toContain(NOTE);
    expect(screen.getByText(T.prendsTonTemps)).toBeInTheDocument();
    const oui = screen.getByRole("button", { name: T.reponses.OUI });
    expect(oui).toHaveAttribute("aria-disabled", "true");
    fireEvent.click(oui);
    expect(appels).toHaveLength(0);
    act(() => jest.advanceTimersByTime(PRENDS_TON_TEMPS_MS));
    expect(screen.queryByText(T.prendsTonTemps)).toBeNull();
    reponses.push({ ok: true, corps: { ok: true, revision: true, replique: NOTE, retour: null } });
    fireEvent.click(screen.getByRole("button", { name: T.reponses.OUI }));
    await attendre();
    expect(screen.getByTestId("replique-derniere-fois")).toHaveTextContent(`${T.repliqueDerniereFois}${NOTE}`);
    expect(JSON.parse(String(appels[0].init?.body))).toMatchObject({ reponse: "OUI", compteARebours: null });
    expect(screen.getByRole("heading", { name: T.laquelle })).toBeInTheDocument();
  });

  it("choix, règle « Ici : la joueuse. », puis geste, « Ton retour » et note pré-remplie", async () => {
    render(<CarteRegistre carte={carte} nouvelle={true} ancre="carte-1" />);
    act(() => jest.advanceTimersByTime(PRENDS_TON_TEMPS_MS));
    reponses.push({ ok: true, corps: { ok: true, revision: false, replique: NOTE, retour: null } });
    fireEvent.click(screen.getByRole("button", { name: T.reponses.RIEN }));
    await attendre();
    expect(screen.getByText(T.regle(2))).toBeInTheDocument();
    // Première vue : pas de « Ta réplique la dernière fois ».
    expect(screen.queryByTestId("replique-derniere-fois")).toBeNull();
    reponses.push({ ok: true, corps: { ok: true, juste: false } });
    fireEvent.click(screen.getByRole("button", { name: /La sûre/ }));
    await attendre();
    expect(screen.getByText(T.ici(T.registres.joueuse))).toBeInTheDocument();
    expect(screen.getByLabelText(G.note.label)).toHaveValue(NOTE);
    expect(screen.getByRole("group", { name: G.tonRetour })).toBeInTheDocument();
  });

  it("« Oui » n'a aucune ligne de règle ; « À moitié » : 7 jours", async () => {
    const { unmount } = render(<CarteRegistre carte={carte} nouvelle={true} ancre="c" />);
    act(() => jest.advanceTimersByTime(PRENDS_TON_TEMPS_MS));
    fireEvent.click(screen.getByRole("button", { name: T.reponses.MOITIE }));
    await attendre();
    expect(screen.getByText(T.regle(7))).toBeInTheDocument();
    unmount();
    render(<CarteRegistre carte={carte} nouvelle={true} ancre="d" />);
    act(() => jest.advanceTimersByTime(PRENDS_TON_TEMPS_MS));
    fireEvent.click(screen.getByRole("button", { name: T.reponses.OUI }));
    await attendre();
    expect(screen.queryByText(/reviendra/)).toBeNull();
  });
});

describe("« Ma réplique à moi »", () => {
  it("enregistrée ; échec sans perte puis « Réessayer » ; confirmation (focus « Annuler ») ; supprimée", async () => {
    render(<NoteReplique ficheId="coloc-la-poele" initiale={null} />);
    const champ = screen.getByLabelText(G.note.label);
    expect(champ).toHaveAttribute("placeholder", G.note.placeholder);
    expect(screen.getByText(G.note.compteur(0, 200))).toBeInTheDocument();
    fireEvent.change(champ, { target: { value: "Une phrase" } });
    reponses.push({ ok: false, corps: {} });
    fireEvent.click(screen.getByRole("button", { name: G.note.enregistrer }));
    await attendre();
    expect(screen.getByRole("status")).toHaveTextContent(G.note.echec);
    expect(champ).toHaveValue("Une phrase");
    fireEvent.click(screen.getByRole("button", { name: G.note.reessayer }));
    await attendre();
    expect(screen.getByRole("status")).toHaveTextContent(G.note.enregistree);
    fireEvent.click(screen.getByRole("button", { name: G.note.supprimer }));
    act(() => jest.runOnlyPendingTimers());
    expect(screen.getByRole("group", { name: G.note.confirmer })).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: G.note.supprimer })).toHaveLength(1);
    fireEvent.click(screen.getByRole("button", { name: G.note.supprimer }));
    await attendre();
    expect(screen.getByRole("status")).toHaveTextContent(G.note.supprimee);
    expect(champ).toHaveValue("");
    expect(appels.map((a) => a.init?.method)).toEqual(["PUT", "PUT", "DELETE"]);
  });

  it("vide : rien n'est envoyé", () => {
    render(<NoteReplique ficheId="coloc-la-poele" initiale={null} />);
    expect(screen.getByRole("button", { name: G.note.enregistrer })).toBeDisabled();
  });
});

describe("« Mes répliques »", () => {
  const ligne = { ficheId: "coloc-la-poele", texte: NOTE, titre: "Coloc : la poêle", href: "/mon-espace/fiche/situation/coloc-la-poele", modifieLe: "" };

  it("vide : texte validé, sans reproche", () => {
    render(<ListeRepliques initiales={[]} lectureSeule={false} />);
    expect(screen.getByText(R.vide)).toBeInTheDocument();
  });

  it("modifier (la réplique n'est pas affichée deux fois), confirmer, supprimée", async () => {
    render(<ListeRepliques initiales={[ligne]} lectureSeule={false} />);
    expect(screen.getByRole("link", { name: ligne.titre })).toHaveAttribute("href", ligne.href);
    fireEvent.click(screen.getByRole("button", { name: R.modifier }));
    expect(screen.queryByText(`« ${NOTE} »`)).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: R.annuler }));
    fireEvent.click(screen.getByRole("button", { name: R.supprimer }));
    expect(screen.getByRole("group", { name: R.confirmer })).toBeInTheDocument();
    fireEvent.click(screen.getAllByRole("button", { name: R.supprimer })[0]);
    await attendre();
    expect(screen.getByRole("status")).toHaveTextContent(R.supprimee);
    expect(screen.getByText(R.vide)).toBeInTheDocument();
  });

  it("lecture seule : ni « Modifier », la suppression reste", () => {
    render(<ListeRepliques initiales={[ligne]} lectureSeule />);
    expect(screen.getByText(R.lectureSeule)).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: R.modifier })).toBeNull();
    expect(screen.getByRole("button", { name: R.supprimer })).toBeInTheDocument();
  });
});

describe("mission : trois suites selon le retour", () => {
  const m = missionsFixtures[0] as MissionVue;

  it("« Marche 2 », titre, « Facultative » ; « ça a marché » : « Voir la marche 3 »", async () => {
    render(<MissionCarte mission={m} hrefAPlat={null} />);
    expect(screen.getByText(M.marche(2))).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: M.titresMarches[2] })).toBeInTheDocument();
    reponses.push({ ok: true, corps: { suite: "marche" } });
    fireEvent.click(screen.getByRole("button", { name: G.retours["essaye-ca-a-marche"] }));
    await attendre();
    expect(screen.getByText(m.suites.marche!)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: M.voirLaMarche(3) })).toHaveAttribute("href", "/mon-espace/s-entrainer?marche=3#mission");
  });

  it("« bof » : autre situation, « Quand ça tombe à plat », « Raconte-nous ce qui s'est passé »", async () => {
    render(<MissionCarte mission={m} hrefAPlat="/mon-espace/fiche/a-plat/x" />);
    reponses.push({ ok: true, corps: { suite: "bof" } });
    fireEvent.click(screen.getByRole("button", { name: G.retours["essaye-bof"] }));
    await attendre();
    expect(screen.getByText(m.suites.bof!)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: M.autreSituation })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: M.aPlat })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: M.raconte })).toHaveAttribute("href", "/mon-espace/questions");
  });

  it("« Pas essayé » : rien ; deux fois : « Voir la marche 1 », sans commentaire", async () => {
    render(<MissionCarte mission={m} hrefAPlat={null} />);
    reponses.push({ ok: true, corps: { suite: "pas" } });
    fireEvent.click(screen.getByRole("button", { name: G.retours["pas-essaye"] }));
    await attendre();
    expect(screen.queryByRole("link")).toBeNull();
    reponses.push({ ok: true, corps: { suite: "pas2" } });
    fireEvent.click(screen.getByRole("button", { name: G.retours["pas-essaye"] }));
    await attendre();
    expect(screen.getByRole("link", { name: M.voirLaMarche(1) })).toBeInTheDocument();
    expect(screen.queryByText(m.suites.bof!)).toBeNull();
    const cles = appels.map((a) => JSON.parse(String(a.init?.body)).cle);
    expect(new Set(cles).size).toBe(2);
  });
});
