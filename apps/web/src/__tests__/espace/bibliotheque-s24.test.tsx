/**
 * Espace client, lot D6 (s24, plan §3) : « Quoi répondre » (filtres), Bibliothèque (lignes), coin « Humour
 * noir, fait bien » (DOM sans contenu avant « Entrer », focus au titre, « Sortir »), page d'une fiche et
 * bilan du parcours (format de `lib/espace/fiches-schema.ts`, fixtures jamais servies), textes.
 */
import { act, fireEvent, render, screen, within } from "@testing-library/react";
import * as TEXTES from "@/config/textes/espace-bibliotheque";
import { TEXTES_CARTES as C } from "@/config/textes/espace-cartes";
import { POUR_QUOI_FAIRE, UNIVERS, validerFichier } from "@/lib/espace/fiches-schema";
import { filtrerSituations, hrefFiltre, lireFiltres, type FicheQuoiRepondre } from "@/lib/espace/quoi-repondre";
import { CoinHumourNoir } from "@/components/espace/coin-humour-noir";
import { ListeFiches } from "@/components/espace/liste-fiches";
import { FicheVue } from "@/components/espace/fiche";
import { PRENDS_TON_TEMPS_MS } from "@/components/espace/carte/boutons-reponse";
import QuoiRepondreChargement from "@/app/(dashboard)/mon-espace/quoi-repondre/loading";
import QuoiRepondreErreur from "@/app/(dashboard)/mon-espace/quoi-repondre/error";
import humourNoir from "@/lib/espace/fixtures/humour-noir.json";
import bilans from "@/lib/espace/fixtures/bilan-confiance.json";
import poele from "@/lib/espace/fixtures/situation-coloc-la-poele.json";
import reprise from "@/lib/espace/fixtures/situation-reprise-lettre-w46.json";
// Lot D11c : rendu avec la typographie de l'espace (espaces insécables), noms accessibles compris.
import { frEspace } from "@/lib/fr-typo";

jest.mock("next/navigation", () => ({ useRouter: () => ({ refresh: jest.fn(), push: jest.fn() }), usePathname: () => "/" }));

const { TEXTES_BILAN: B, TEXTES_COIN: N, TEXTES_QUOI_REPONDRE: Q } = TEXTES;
const fichesHn = validerFichier("humour-noir", humourNoir);
const [bilan] = validerFichier("bilan", bilans);
const situations = validerFichier("situation", [poele, reprise]) as FicheQuoiRepondre[];

describe("textes du lot D6", () => {
  const tout = JSON.stringify(TEXTES) + [N.titre, B.deuxiemeTour("x")].join(" ");
  it("zéro tiret cadratin, zéro émoji, aucune promesse « jamais sans le geste » (porte G6)", () => {
    expect(tout).not.toMatch(/—/);
    expect(tout).not.toMatch(/\p{Extended_Pictographic}/u);
    expect(tout).not.toMatch(/n'affiche jamais|ne télécharge jamais/);
  });
  it("libellés validés mot pour mot", () => {
    expect([N.titre, N.phrase, N.entrer]).toEqual(["Humour noir, fait bien", "Ici, on rit de sujets graves, avec ceux qui te connaissent.", "Entrer"]);
    expect([Q.filtreOu, Q.filtrePour, Q.vide, Q.raconte]).toEqual(["Où et avec qui ?", "Pour quoi faire ?", "Ta situation n'est pas dans la liste ?", "Raconte-la à l'équipe"]);
    expect([B.eyebrow, B.titre, B.laquelle, B.pasCelleLa]).toEqual(["Bilan du parcours", "Refais une situation", "Laquelle ressortir ici ?", "Pas celle-là cette fois."]);
    expect(TEXTES.TEXTES_LETTRES.titreLettre({ semaine: 4, jour: 12, mois: 10 })).toBe("La lettre du jeudi 12 novembre");
    expect(TEXTES.TEXTES_LETTRES.vuDans("La lettre du jeudi 12 novembre")).toBe("Vu dans la lettre du jeudi 12 novembre");
    expect(Object.keys(Q.univers)).toEqual([...UNIVERS]);
    expect(Object.keys(Q.pourQuoiFaire)).toEqual([...POUR_QUOI_FAIRE]);
  });
});

describe("« Quoi répondre » : filtres", () => {
  it("valeur hors liste ignorée, jamais une erreur", () => {
    expect(lireFiltres({ ou: "lune", pour: ["desamorcer", "x"] })).toEqual({ ou: null, pour: "desamorcer" });
  });
  it("filtre par univers et par but ; « Quand ça tombe à plat » sous « Rattraper un faux pas »", () => {
    expect(filtrerSituations(situations, { ou: "coloc", pour: null }).map((f) => f.id)).toEqual(["coloc-la-poele"]);
    expect(filtrerSituations(situations, { ou: null, pour: "repondre-chambrage" }).map((f) => f.id)).toEqual(["apres-l-expose"]);
    expect(filtrerSituations(situations, { ou: "coloc", pour: "prendre-la-parole" })).toEqual([]);
    const aPlat = { ...situations[0], type: "a-plat", pourQuoiFaire: undefined } as unknown as FicheQuoiRepondre;
    expect(filtrerSituations([aPlat], { ou: null, pour: "rattraper-faux-pas" })).toHaveLength(1);
  });
  it("un second clic retire le filtre, l'autre est gardé", () => {
    const base = "/mon-espace/quoi-repondre";
    expect(hrefFiltre(base, { ou: null, pour: null }, "ou", "coloc")).toBe(`${base}?ou=coloc`);
    expect(hrefFiltre(base, { ou: "coloc", pour: "desamorcer" }, "ou", "coloc")).toBe(`${base}?pour=desamorcer`);
  });
});

describe("liste de fiches", () => {
  it("statut « Voir » ou « Fait » en texte, marque d'un bonus et durée", () => {
    render(
      <ListeFiches
        lignes={[
          { id: "a", titre: "Comment c'est construit : Le faux secret", href: "/x", minutes: 5, fait: false },
          { id: "b", titre: "Titre", href: "/y", minutes: 6, fait: true, marque: "Bonus du cap 3 · Tu avances bien" },
        ]}
      />,
    );
    const [a, b] = screen.getAllByRole("link");
    expect(a).toHaveTextContent("Comment c'est construit : Le faux secretVoir");
    expect(b).toHaveTextContent("Bonus du cap 3 · Tu avances bienTitre · 6 minFait");
  });
});

describe("coin « Humour noir, fait bien »", () => {
  const LIGNES = fichesHn.map((f) => ({ id: f.id, titre: f.titre, href: `/mon-espace/fiche/humour-noir/${f.id}`, minutes: 5, fait: false }));
  const fetchAvant = global.fetch;
  afterEach(() => {
    global.fetch = fetchAvant;
  });

  it("avant « Entrer » : titre, phrase, bouton ; AUCUN contenu dans le DOM", () => {
    const { container } = render(<CoinHumourNoir lignesInitiales={null} />);
    expect(screen.getByRole("heading", { level: 2, name: N.titre })).toBeInTheDocument();
    expect(screen.getByText(N.phrase)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: N.entrer })).toHaveAttribute("aria-expanded", "false");
    for (const f of fichesHn) expect(container.innerHTML).not.toContain(f.titre);
    expect(container.querySelector("#coin-contenu")).toBeNull();
    expect(screen.queryByRole("button", { name: N.sortir })).toBeNull();
  });

  it("« Entrer » : contenu servi par l'API, focus au titre ; « Sortir » : contenu retiré, focus rendu à « Entrer »", async () => {
    const appel = jest.fn(async (_u: string, init: RequestInit) => {
      const entrer = JSON.parse(String(init.body)).entrer as boolean;
      return { ok: true, json: async () => ({ lignes: entrer ? LIGNES : [] }) } as Response;
    });
    global.fetch = appel as unknown as typeof fetch;
    render(<CoinHumourNoir lignesInitiales={null} />);
    await act(async () => fireEvent.click(screen.getByRole("button", { name: N.entrer })));
    expect(appel).toHaveBeenCalledWith("/api/espace/humour-noir", expect.objectContaining({ method: "POST", body: JSON.stringify({ entrer: true }) }));
    expect(screen.getByRole("link", { name: /Qui est dans la pièce/ })).toBeInTheDocument();
    expect(document.activeElement).toBe(screen.getByRole("heading", { level: 2, name: N.titre }));
    await act(async () => fireEvent.click(screen.getByRole("button", { name: N.sortir })));
    expect(screen.queryByRole("link", { name: /Qui est dans la pièce/ })).toBeNull();
    expect(document.activeElement).toBe(screen.getByRole("button", { name: N.entrer }));
  });

  it("échec : rien ne change, phrase d'échec annoncée", async () => {
    global.fetch = jest.fn(async () => ({ ok: false }) as Response) as unknown as typeof fetch;
    render(<CoinHumourNoir lignesInitiales={null} />);
    await act(async () => fireEvent.click(screen.getByRole("button", { name: N.entrer })));
    expect(screen.getByRole("status")).toHaveTextContent(C.echec);
    expect(screen.queryByRole("link")).toBeNull();
  });
});

describe("page d'une fiche et bilan du parcours", () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());
  const toucher = (nom: string) => {
    act(() => jest.advanceTimersByTime(PRENDS_TON_TEMPS_MS));
    fireEvent.click(screen.getAllByRole("button", { name: nom })[0]);
  };

  it("situation : répliques absentes du DOM avant « Tu avais une réponse ? » ; « Vu dans la lettre du … »", () => {
    const [s] = validerFichier("situation", [reprise]);
    const { container } = render(<FicheVue fiche={s} retour={null} replique={null} lettre={{ titre: "Vu dans la lettre du jeudi 12 novembre", href: "/mon-espace/lettres/2026-W46" }} />);
    expect(screen.getByRole("link", { name: "Vu dans la lettre du jeudi 12 novembre" })).toHaveAttribute("href", "/mon-espace/lettres/2026-W46");
    const r = s.type === "situation" ? s.contenu.repliques.joueuse.texte : "";
    expect(container.innerHTML).not.toContain(r);
    toucher(C.reponses.RIEN);
    expect(screen.getByTestId("fiche-suite")).toHaveTextContent(r);
  });

  it("bilan : « Laquelle ressortir ici ? » après le toucher ; erreur = « Pas celle-là » + retour + renvoi ; choix verrouillé", () => {
    render(<FicheVue fiche={bilan} retour={null} replique={null} lettre={null} />);
    expect(screen.getByRole("heading", { level: 1, name: B.h1 })).toBeInTheDocument();
    const carte = screen.getAllByRole("region", { name: B.titre })[0];
    expect(within(carte).queryByText(B.laquelle)).toBeNull();
    act(() => jest.advanceTimersByTime(PRENDS_TON_TEMPS_MS));
    fireEvent.click(within(carte).getByRole("button", { name: C.reponses.OUI }));
    fireEvent.click(within(carte).getByRole("button", { name: /^A/ }));
    const retour = within(carte).getByTestId("bilan-retour");
    expect(retour).toHaveTextContent(B.pasCelleLa);
    expect(within(retour).getByRole("link", { name: frEspace(B.deuxiemeTour("Énoncer la règle non écrite")) })).toHaveAttribute("href", "/parcours/confiance#etape-1");
    expect(within(carte).getByRole("button", { name: /^A/ })).toHaveAttribute("aria-pressed", "true");
    expect(within(carte).getByRole("button", { name: /^B/ })).toBeDisabled();
  });

  it("bilan : la bonne réponse montre le retour seul", () => {
    render(<FicheVue fiche={bilan} retour={null} replique={null} lettre={null} />);
    const carte = screen.getAllByRole("region", { name: B.titre })[0];
    act(() => jest.advanceTimersByTime(PRENDS_TON_TEMPS_MS));
    fireEvent.click(within(carte).getByRole("button", { name: C.reponses.RIEN }));
    fireEvent.click(within(carte).getByRole("button", { name: /^B/ }));
    const retour = within(carte).getByTestId("bilan-retour");
    expect(retour).not.toHaveTextContent(B.pasCelleLa);
    expect(within(retour).queryByRole("link")).toBeNull();
  });
});

describe("« Quoi répondre » : états chargement et erreur", () => {
  it("chargement : le titre et des lignes décoratives, sans texte neuf", () => {
    const { container } = render(<QuoiRepondreChargement />);
    expect(screen.getByRole("heading", { level: 1, name: Q.titre })).toBeInTheDocument();
    expect(container.querySelectorAll('[aria-hidden="true"]')).toHaveLength(3);
    expect(container.textContent).toBe(Q.titre);
  });
  it("erreur : « Réessayer » relance, repli vers le carnet du mois", () => {
    const reset = jest.fn();
    render(<QuoiRepondreErreur error={new Error("x")} reset={reset} />);
    fireEvent.click(screen.getByRole("button", { name: Q.reessayer }));
    expect(reset).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("link", { name: Q.carnet })).toHaveAttribute("href", "/carnet");
    expect(document.body.textContent).not.toMatch(/x$|Error/);
  });
});
