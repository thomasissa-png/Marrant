/**
 * Espace client, reste du lot D6 (fait au lot D5b, s24 ; `docs/ux/arbitrages-d6-s24.md`, décisions de
 * Thomas du 13/11) : filtres de « Quoi répondre » repliés sous 640 px, liens du catalogue dans la
 * Bibliothèque, états vides des Lettres et du coin, liens de fiche étiquetés par le H1 et jamais deux au
 * même nom.
 */
import { fireEvent, render, screen, within } from "@testing-library/react";
import situationPoele from "@/lib/espace/fixtures/situation-coloc-la-poele.json";
import { ficheSchema } from "@/lib/espace/fiches-schema";
import { FiltresSituations, resumeFiltres } from "@/components/espace/filtres-situations";
import { BlocVannes } from "@/components/espace/bloc-bibliotheque";
import { ArchiveLettres } from "@/components/espace/archive-lettres";
import { CoinHumourNoir } from "@/components/espace/coin-humour-noir";
import { FicheVue } from "@/components/espace/fiche";
import { TEXTES_BIBLIOTHEQUE as B, TEXTES_COIN as C, TEXTES_LETTRES as L, TEXTES_QUOI_REPONDRE as Q } from "@/config/textes/espace-bibliotheque";
// Lot D11c : rendu avec la typographie de l'espace (espaces insécables), noms accessibles compris.
import { frEspace } from "@/lib/fr-typo";
import { apo } from "../helpers/typo-espace";

jest.mock("next/navigation", () => ({ useRouter: () => ({ refresh: jest.fn(), push: jest.fn() }), usePathname: () => "/mon-espace" }));

function largeur(deplie: boolean) {
  window.matchMedia = jest.fn().mockImplementation((q: string) => ({
    matches: deplie,
    media: q,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  })) as unknown as typeof window.matchMedia;
}

describe("« Quoi répondre » : filtres repliés sous 640 px", () => {
  it("375 px : un seul `details` fermé au chargement, les deux groupes dedans, summary nommé sans filtre", () => {
    largeur(false);
    const { container } = render(<FiltresSituations base="/mon-espace/quoi-repondre" filtres={{ ou: null, pour: null }} />);
    const details = container.querySelectorAll("details");
    expect(details).toHaveLength(1);
    expect(details[0].open).toBe(false);
    const summary = details[0].querySelector("summary")!;
    // Lot D7 (choix de Thomas du 13/11) : « Filtrer les cartes » sans filtre choisi.
    expect(summary).toHaveTextContent("Filtrer les cartes");
    expect(summary.className).toContain("min-h-11");
    // Titres H2 conservés, puces toujours dans le DOM (clavier et lecteur d'écran une fois ouvert).
    expect(within(details[0]).getAllByRole("heading", { level: 2 }).map((h) => h.textContent)).toEqual([frEspace(Q.filtreOu), frEspace(Q.filtrePour)]);
    expect(details[0].querySelectorAll("a[data-filtre]")).toHaveLength(17);
    fireEvent.click(summary);
    expect(details[0].open).toBe(true);
  });

  it("avec filtres : le summary nomme les valeurs choisies, jamais un nombre seul", () => {
    largeur(false);
    render(<FiltresSituations base="/mon-espace/quoi-repondre" filtres={{ ou: "soiree", pour: "desamorcer" }} />);
    expect(screen.getByText("Soirée, Désamorcer")).toBeInTheDocument();
    expect(resumeFiltres({ ou: "coloc", pour: null })).toBe("Coloc");
    expect(resumeFiltres({ ou: null, pour: "prendre-la-parole" })).toBe("Prendre la parole");
  });

  // s26 (`docs/design/rubriques-abonne-s26.md` §1.3) : repliés jusqu'à 1024 px (768 compris), puis rail ouvert sans
  // script ; deux instances, une seule affichée (`lg:hidden` / `hidden lg:block`), ids distincts.
  it("dès 1024 px : rail ouvert hors `details` (repli `lg:hidden`), sans script, ids distincts", () => {
    largeur(true);
    const { container } = render(<FiltresSituations base="/mon-espace/quoi-repondre" filtres={{ ou: null, pour: null }} />);
    const repli = container.querySelector("[data-filtres-replies]")!;
    const rail = container.querySelector("[data-filtres-rail]")!;
    expect(repli.className.split(" ")).toContain("lg:hidden");
    expect(rail.className.split(" ")).toEqual(expect.arrayContaining(["hidden", "lg:block"]));
    expect(repli.querySelector("details")!.open).toBe(false);
    expect(rail.querySelector("details")).toBeNull();
    expect(rail.querySelectorAll("a[data-filtre]")).toHaveLength(17);
    const ids = [...container.querySelectorAll("[id]")].map((e) => e.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("sous 300 px : puces pleine largeur", () => {
    largeur(false);
    const { container } = render(<FiltresSituations base="/mon-espace/quoi-repondre" filtres={{ ou: null, pour: null }} />);
    for (const a of Array.from(container.querySelectorAll("a[data-filtre]"))) expect(a.className).toContain("max-e300:w-full");
  });
});

describe("Bibliothèque : liens du catalogue", () => {
  it("« Vannes », « Conseils », « Vidéos » vers /vannes, /conseils, /videos, après les thèmes", () => {
    render(<BlocVannes ecouter={[]} />);
    const liste = screen.getByTestId("bibliotheque-catalogue");
    expect(within(liste).getAllByRole("link").map((a) => [a.textContent, a.getAttribute("href")])).toEqual([
      ["Vannes", "/vannes"],
      ["Conseils", "/conseils"],
      ["Vidéos", "/videos"],
    ]);
    expect(B.catalogue).toHaveLength(3);
  });
});

describe("états vides", () => {
  it("Lettres : « Tes lettres s'affichent ici dès leur envoi. » et « Aller à Aujourd'hui », sans `role=status`", () => {
    render(<ArchiveLettres lettres={[]} />);
    expect(screen.getByText(apo("Tes lettres s'affichent ici dès leur envoi."))).toBeInTheDocument();
    expect(screen.getByRole("link", { name: frEspace("Aller à Aujourd'hui") })).toHaveAttribute("href", "/mon-espace");
    expect(screen.queryByRole("status")).toBeNull();
    expect(L.vide).not.toMatch(/—/);
  });

  it("coin entré et vide : « Rien à lire dans ce coin, et rien n'y est caché. », « Sortir » reste", () => {
    render(<CoinHumourNoir lignesInitiales={[]} />);
    expect(screen.getByText(apo("Rien à lire dans ce coin, et rien n'y est caché."))).toBeInTheDocument();
    expect(screen.getByRole("button", { name: C.sortir })).toBeInTheDocument();
    expect(C.vide).not.toMatch(/—/);
  });

  it("coin non entré : ni texte vide ni contenu (seulement « Entrer »)", () => {
    render(<CoinHumourNoir lignesInitiales={null} />);
    expect(screen.queryByTestId("coin-vide")).toBeNull();
    expect(screen.getByRole("button", { name: C.entrer })).toBeInTheDocument();
  });
});

describe("liens d'une fiche", () => {
  const base = ficheSchema.parse(situationPoele);

  it("liste étiquetée par le titre de la fiche (H1)", () => {
    const fiche = ficheSchema.parse({ ...situationPoele, liens: ["/vannes/theme/soirees", "/conseils"] });
    render(<FicheVue fiche={fiche} retour={null} replique={null} lettre={null} />);
    const liste = screen.getByTestId("fiche-liens");
    const h1 = screen.getByRole("heading", { level: 1 });
    expect(liste).toHaveAttribute("aria-labelledby", h1.id);
    expect(screen.getByRole("list", { name: base.titre })).toBe(liste);
    const noms = within(liste).getAllByRole("link").map((a) => a.textContent);
    expect(new Set(noms).size).toBe(noms.length);
  });

  it("jamais deux liens au même nom : deux liens vers la même rubrique refusés par le schéma", () => {
    expect(ficheSchema.safeParse({ ...situationPoele, liens: ["/vannes/a", "/vannes/b"] }).success).toBe(false);
    expect(ficheSchema.safeParse({ ...situationPoele, liens: ["/vannes/a", "/videos/b"] }).success).toBe(true);
  });
});
