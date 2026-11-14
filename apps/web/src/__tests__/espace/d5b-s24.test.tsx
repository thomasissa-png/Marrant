/**
 * Espace client, lot D5b (s24), composants : correctif d'affichage de 11-29 (« » intérieurs en “ ”),
 * compte à rebours facultatif (libellés validés, `role="timer"`, `aria-pressed`, nom accessible, retour
 * visible à la durée précédente, jamais de note ni de blocage), plafond de « Ma réplique à moi » (collage
 * coupé à 200, message de limite), second contexte en « Nouvelle » avec « 1 autre contexte ».
 */
import { act, fireEvent, render, screen, within } from "@testing-library/react";
import carnetNovembre from "@/data/carnet/2026-11.json";
import situationPoele from "@/lib/espace/fixtures/situation-coloc-la-poele.json";
import { parseCarnets } from "@/lib/carnet";
import { ficheSchema, type Fiche } from "@/lib/espace/fiches-schema";
import { cartesDesSituations, cartesDuCarnet } from "@/lib/espace/rafale";
import type { EtatCompteARebours } from "@/lib/espace/compte-a-rebours";
import { CarteEtToi } from "@/components/espace/carte/carte-et-toi";
import { CarteRegistre } from "@/components/espace/carte/carte-registre";
import { FournisseurCompteARebours } from "@/components/espace/carte/compte-a-rebours";
import { entreGuillemets } from "@/components/espace/carte/citation";
import { NoteReplique } from "@/components/espace/carte/note-replique";
import { REPLIQUE_MAX_CLIENT } from "@/components/espace/carte/limites";
import { PRENDS_TON_TEMPS_MS } from "@/components/espace/carte/boutons-reponse";
import { CartesDuJour } from "@/components/espace/aujourdhui/cartes-du-jour";
import { TEXTES_CARTES as T, TEXTES_COMPTE_A_REBOURS as C, TEXTES_GESTE as G } from "@/config/textes/espace-cartes";
import { TEXTES_AUJOURDHUI as A } from "@/config/textes/espace-aujourdhui";
import { frEspace } from "@/lib/fr-typo";

type Situation = Extract<Fiche, { type: "situation" }>;
const fiche1129 = parseCarnets([carnetNovembre])[0].fiches.find((f) => f.id === "2026-11-29")!;
const carte1129 = cartesDuCarnet([fiche1129])[0];
const carteRegistre = cartesDesSituations([ficheSchema.parse(situationPoele) as Situation])[0];

const appels: Array<{ url: string; init?: RequestInit }> = [];
beforeEach(() => {
  appels.length = 0;
  global.fetch = jest.fn(async (url: RequestInfo | URL, init?: RequestInit) => {
    appels.push({ url: String(url), init });
    return { ok: true, json: async () => ({ ok: true, revision: false, replique: null, retour: null }) } as Response;
  }) as unknown as typeof fetch;
  jest.useFakeTimers();
});
afterEach(() => jest.useRealTimers());

const attendre = () =>
  act(async () => {
    await Promise.resolve();
    await Promise.resolve();
  });

const ETAT: EtatCompteARebours = { visible: true, durees: [10], proposition: null };
const avecCompte = (etat: EtatCompteARebours, ui: React.ReactElement) => render(<FournisseurCompteARebours etat={etat}>{ui}</FournisseurCompteARebours>);

describe("11-29 : citation intérieure au second niveau (section F des corrections G5)", () => {
  it("le JSON garde « oui » ; la carte « Et toi ? » affiche « Tu viens de dire “oui” sans m'écouter. »", () => {
    expect(fiche1129.onTeDit).toBe("Tu viens de dire « oui » sans m'écouter.");
    render(<CarteEtToi carte={carte1129} nouvelle ancre="carte-1" />);
    expect(screen.getByText("« Tu viens de dire “oui” sans m'écouter. »")).toBeInTheDocument();
    expect(document.body.textContent).not.toContain("« oui »");
  });

  it("même rendu sur une carte « Quel registre ? » ; sans citation intérieure, texte inchangé", () => {
    const carte = { ...carteRegistre, scene: { ...carteRegistre.scene, onTeDit: "Tu as dit « jamais » hier." } };
    render(<CarteRegistre carte={carte} nouvelle ancre="carte-1" />);
    expect(screen.getByText("« Tu as dit “jamais” hier. »")).toBeInTheDocument();
    // Lot D11c : guillemets liés au texte (fine insécable après «, insécable avant »).
    expect(entreGuillemets("Rien à citer.")).toBe(frEspace("« Rien à citer. »"));
    expect(entreGuillemets("A « b » c")).toBe(frEspace("« A “b” c »"));
  });
});

describe("compte à rebours facultatif", () => {
  it("absent à la toute première carte (ou sans fournisseur) : aucune puce", () => {
    const { unmount } = avecCompte({ visible: false, durees: [10], proposition: null }, <CarteEtToi carte={carte1129} nouvelle ancre="carte-1" />);
    expect(screen.queryByRole("button", { name: C.nom(10) })).toBeNull();
    unmount();
    render(<CarteEtToi carte={carte1129} nouvelle ancre="carte-1" />);
    expect(screen.queryByRole("button", { name: C.nom(10) })).toBeNull();
  });

  it("libellé, nom accessible, `aria-pressed`, décompte nommé « Temps restant », une seule annonce à la fin", async () => {
    avecCompte(ETAT, <CarteRegistre carte={carteRegistre} nouvelle ancre="carte-1" />);
    const puce = screen.getByRole("button", { name: "10 secondes pour répondre, compte à rebours" });
    expect(puce).toHaveTextContent("10 secondes pour répondre");
    expect(puce).toHaveAttribute("aria-pressed", "false");
    expect(screen.getByText(T.prendsTonTemps)).toBeInTheDocument();
    fireEvent.click(puce);
    expect(puce).toHaveAttribute("aria-pressed", "true");
    // « Prends ton temps » masqué pendant le décompte, boutons actifs (rien ne se bloque).
    expect(screen.queryByText(T.prendsTonTemps)).toBeNull();
    expect(screen.getByRole("button", { name: T.reponses.OUI })).not.toHaveAttribute("aria-disabled");
    const minuteur = screen.getByRole("timer", { name: "Temps restant" });
    expect(minuteur).toHaveTextContent("Il reste 10 secondes");
    expect(minuteur).not.toHaveAttribute("aria-live");
    act(() => jest.advanceTimersByTime(9_000));
    expect(screen.getByRole("timer")).toHaveTextContent("Il reste 1 seconde");
    const statut = screen.getAllByRole("status").find((s) => s.closest("[data-compte-a-rebours]"))!;
    expect(statut).toHaveTextContent("");
    act(() => jest.advanceTimersByTime(1_000));
    expect(screen.queryByRole("timer")).toBeNull();
    expect(statut).toHaveTextContent("Les 10 secondes sont passées.");
    // Les trois boutons restent là ; la durée part avec la réponse ; ni note ni sanction.
    fireEvent.click(screen.getByRole("button", { name: T.reponses.RIEN }));
    await attendre();
    expect(JSON.parse(String(appels[0].init?.body))).toMatchObject({ reponse: "RIEN", compteARebours: 10 });
    expect(document.body.textContent).not.toMatch(/note|score|raté|trop lent|perdu/i);
    expect(screen.queryByRole("button", { name: C.nom(10) })).toBeNull();
  });

  it("un second toucher l'arrête : la réponse part sans compte à rebours", async () => {
    avecCompte(ETAT, <CarteEtToi carte={carte1129} nouvelle ancre="carte-1" />);
    const puce = screen.getByRole("button", { name: C.nom(10) });
    fireEvent.click(puce);
    fireEvent.click(puce);
    expect(puce).toHaveAttribute("aria-pressed", "false");
    expect(screen.queryByRole("timer")).toBeNull();
    act(() => jest.advanceTimersByTime(PRENDS_TON_TEMPS_MS));
    fireEvent.click(screen.getByRole("button", { name: T.reponses.OUI }));
    await attendre();
    expect(JSON.parse(String(appels[0].init?.body))).toMatchObject({ reponse: "OUI", compteARebours: null });
  });

  it("proposition de raccourcir : texte validé, « Essayer 7 secondes », puis retour visible à 10", () => {
    avecCompte({ visible: true, durees: [10], proposition: { essayer: 7, garder: 10 } }, <CarteEtToi carte={carte1129} nouvelle ancre="carte-1" />);
    expect(screen.getByText("Envie d'essayer avec 7 secondes ? Tu peux revenir à 10 quand tu veux.")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Essayer 7 secondes" }));
    expect(screen.queryByText(/Envie d'essayer/)).toBeNull();
    expect(screen.getByRole("button", { name: C.nom(7) })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("timer")).toHaveTextContent("Il reste 7 secondes");
    // Moyen visible de revenir à la durée précédente.
    const dix = screen.getByRole("button", { name: C.nom(10) });
    fireEvent.click(dix);
    expect(dix).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("timer")).toHaveTextContent("Il reste 10 secondes");
  });

  it("refus « Garder 10 secondes » : aucun message, décompte habituel ; 5 secondes proposées depuis 7", () => {
    const { unmount } = avecCompte({ visible: true, durees: [10], proposition: { essayer: 7, garder: 10 } }, <CarteEtToi carte={carte1129} nouvelle ancre="carte-1" />);
    fireEvent.click(screen.getByRole("button", { name: "Garder 10 secondes" }));
    expect(screen.queryByText(/Envie d'essayer/)).toBeNull();
    expect(screen.queryByRole("button", { name: C.nom(7) })).toBeNull();
    expect(screen.getByRole("timer")).toHaveTextContent("Il reste 10 secondes");
    // Aucun message après le refus : le seul statut du compte à rebours reste vide.
    const statut = screen.getAllByRole("status").find((s) => s.closest("[data-compte-a-rebours]"))!;
    expect(statut).toHaveTextContent("");
    unmount();
    avecCompte({ visible: true, durees: [10, 7], proposition: { essayer: 5, garder: 7 } }, <CarteEtToi carte={carte1129} nouvelle ancre="carte-1" />);
    expect(screen.getByText("Envie d'essayer avec 5 secondes ? Tu peux revenir à 7 quand tu veux.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Garder 7 secondes" })).toBeInTheDocument();
  });

  it("la proposition n'apparaît que sur la première carte de la page", () => {
    avecCompte({ visible: true, durees: [10], proposition: { essayer: 7, garder: 10 } }, <CarteEtToi carte={carte1129} nouvelle ancre="carte-2" />);
    expect(screen.queryByText(/Envie d'essayer/)).toBeNull();
    expect(screen.getByRole("button", { name: C.nom(10) })).toBeInTheDocument();
  });
});

describe("« Ma réplique à moi » : plafond de 200 caractères", () => {
  it("coller 300 caractères : 200 gardés, « C'est la limite : 200 caractères. », compteur « 200 / 200 caractères »", () => {
    render(<NoteReplique ficheId="coloc-la-poele" initiale={null} />);
    const champ = screen.getByRole("textbox", { name: G.note.label }) as HTMLTextAreaElement;
    expect(champ).toHaveAttribute("maxLength", String(REPLIQUE_MAX_CLIENT));
    expect(screen.getByText("0 / 200 caractères")).toBeInTheDocument();
    fireEvent.change(champ, { target: { value: "a".repeat(300) } });
    expect(champ.value).toHaveLength(200);
    expect(screen.getByText("200 / 200 caractères")).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("C'est la limite : 200 caractères.");
    // Compteur sans alerte (ni rouge ni gras), sur sa ligne.
    const compteur = screen.getByText("200 / 200 caractères");
    expect(compteur.className).toContain("whitespace-nowrap");
    expect(compteur.className).not.toMatch(/red|danger|error|font-bold|font-semibold/);
    fireEvent.change(champ, { target: { value: "a".repeat(199) } });
    expect(screen.getByRole("status")).toHaveTextContent("");
    expect(screen.getByText("199 / 200 caractères")).toBeInTheDocument();
  });
});

describe("second contexte d'une situation déjà vue", () => {
  it("étiquette « Nouvelle », sous-titre « 1 autre contexte » (jamais « situation nouvelle » ni « À revoir »)", () => {
    render(<CartesDuJour fini={false} href="/mon-espace/s-entrainer" cartes={[{ titre: "La poêle", href: "#carte-1", nouvelle: true, autreContexte: true }]} />);
    const liste = screen.getByRole("list");
    expect(within(liste).getByText(A.rafale.nouvelle)).toBeInTheDocument();
    expect(within(liste).queryByText(A.rafale.aRevoir)).toBeNull();
    expect(screen.getByText("1 autre contexte")).toBeInTheDocument();
    expect(document.body.textContent).not.toContain("situation nouvelle");
  });

  it("pluriel « 2 autres contextes » ; avec une situation nouvelle, chacun son compte", () => {
    expect(A.rafale.sousTitre(0, 0, 2)).toBe("2 autres contextes");
    expect(A.rafale.sousTitre(1, 0, 1)).toBe("1 situation nouvelle, 1 autre contexte");
    expect(A.rafale.sousTitre(1, 2)).toBe("1 situation nouvelle, 2 cartes à revoir");
  });
});
