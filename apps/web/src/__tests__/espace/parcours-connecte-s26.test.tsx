/**
 * s26 parcours connecté (`docs/design/parcours-connecte-s26.md` §2.1, §2.2, §3 ; `docs/ux/parcours-connecte-s26.md` §4,
 * §5) : briques de l'espace ouvert. Carte « En cours » (rangée 1 + « Ton cap » en ligne, squelette, échec), calendrier
 * en 2x2 puis 4 colonnes dès 1280, pied d'étape (retour vers la carte du parcours, étape suivante), liste du visiteur
 * en liens d'ancre, sommaire replié sous 1024 px. Aucun texte nouveau : tout est lu dans les textes existants.
 */
import { fireEvent, render, screen, within } from "@testing-library/react";

jest.mock("@/lib/umami", () => ({ trackUmami: jest.fn() }));

import { CarteEnCours } from "@/components/espace/parcours/carte-en-cours";
import { ListeEtapesVisiteur, PiedEtape } from "@/components/espace/parcours/navigation-etapes";
import { QuatreSemaines } from "@/components/espace/quatre-semaines";
import { SommaireParcours } from "@/components/espace/parcours/sommaire-parcours";
import { TonCap } from "@/components/espace/ton-cap";
import { trackUmami } from "@/lib/umami";
import { lirePosition, noterPosition, recalerPosition } from "@/lib/espace/recaler-ancre";
import { TEXTES_CAPS } from "@/config/textes/espace-caps";
import { ETAPE_LIBRE_BADGE } from "@/config/textes/offre";
import { progressionVisiteurTexte } from "@/config/textes/parcours";

const ETAPE = { slug: "repartie", titreParcours: "Répartie", ordre: 2, total: 5, titreEtape: "Rebondir", enCours: true, href: "/parcours/repartie#etape-2" };
const CAPS = { cap: 2 as const, serie: 3, ecart: false };

describe("carte « En cours »", () => {
  it("rangée 1 (étape et LE plein) puis « Ton cap » en ligne derrière un filet, barre sur 4 colonnes", () => {
    const { container } = render(<CarteEnCours etat="ok" etape={ETAPE} caps={CAPS} />);
    const carte = screen.getByTestId("carte-en-cours");
    expect(within(carte).getByRole("heading", { level: 2, name: "Répartie" })).toBeInTheDocument();
    const bouton = within(carte).getByRole("link", { name: "Reprendre" });
    expect(bouton).toHaveAttribute("href", "/parcours/repartie#etape-2");
    expect(bouton.className.split(" ")).toEqual(expect.arrayContaining(["lg:col-span-3", "lg:self-center", "lg:justify-self-end", "w-full", "sm:w-auto"]));
    const cap = container.querySelector("#cap") as HTMLElement;
    expect(cap.getAttribute("aria-labelledby")).toBe("ton-cap-titre");
    expect(cap.className.split(" ")).toEqual(expect.arrayContaining(["lg:col-span-8"]));
    expect(cap.className).not.toMatch(/lg:sticky|(^|\s)before:hidden|rounded-xl|\bp-6\b/);
    expect((cap.parentElement as HTMLElement).className.split(" ")).toEqual(expect.arrayContaining(["mt-6", "border-t", "pt-6"]));
    expect(container.querySelector("[data-barre-etapes]")?.className).toContain("lg:col-span-4");
  });

  it("nouvel abonné (étape conseillée) : pas de barre, « Ton cap » sur 12 colonnes", () => {
    const { container } = render(<CarteEnCours etat="ok" etape={{ ...ETAPE, ordre: 1, enCours: false }} caps={CAPS} />);
    expect(container.querySelector("[data-barre-etapes]")).toBeNull();
    expect((container.querySelector("#cap") as HTMLElement).className).toContain("lg:col-span-12");
  });

  it("chargement : squelette `aria-busy` sans `min-h` ; échec : rien", () => {
    const { container, rerender } = render(<CarteEnCours etat="attente" etape={null} caps={null} />);
    const squelette = screen.getByTestId("carte-en-cours-squelette");
    expect(squelette).toHaveAttribute("aria-busy", "true");
    expect(container.innerHTML).not.toContain("min-h-");
    rerender(<CarteEnCours etat="echec" etape={null} caps={null} />);
    expect(container.innerHTML).toBe("");
  });

  it("« Ton cap » sans variante : rendu d'avant (cadre, titre 20 px)", () => {
    const { container } = render(<TonCap cap={1} serie={0} ecart={false} />);
    expect((container.querySelector("#ton-cap-titre") as HTMLElement).className).toBe("font-display text-xl font-bold text-text-primary");
    render(<TonCap enLigne cap={1} serie={0} ecart />);
    expect(screen.getAllByText(TEXTES_CAPS.serieZero.replace(/ /g, " "), { exact: false }).length).toBeGreaterThan(0);
  });
});

describe("Tes 4 premières semaines", () => {
  it("2x2 dès 768, 4 colonnes dès 1280, filet horizontal par cellule, étiquette puis texte", () => {
    const { container } = render(<QuatreSemaines ecouterPublie />);
    const ol = container.querySelector("ol") as HTMLElement;
    expect(ol.className.split(" ")).toEqual(expect.arrayContaining(["md:grid-cols-2", "xl:grid-cols-4"]));
    expect(ol.className).not.toContain("lg:grid-cols-4");
    for (const li of Array.from(ol.children)) {
      expect(li.className.split(" ")).toEqual(expect.arrayContaining(["border-t", "pt-4"]));
      expect(li.className).not.toContain("grid-cols-[auto_minmax(0,1fr)]");
    }
    expect(screen.queryByRole("link")).toBeNull();
  });
});

describe("/parcours/[slug] : navigation entre étapes", () => {
  it("pied d'étape : « Retour : Parcours » vers la carte du parcours, puis l'étape suivante (ouverture par `allerAEtape`)", () => {
    const aller = jest.fn();
    render(<PiedEtape slug="repartie" suivante={{ order: 3, titre: "Relancer" }} allerAEtape={aller} />);
    expect(screen.getByRole("link", { name: /Retour/ })).toHaveAttribute("href", "/parcours#parcours-repartie");
    const suivante = screen.getByRole("link", { name: /Relancer/ });
    expect(suivante).toHaveAttribute("href", "#etape-3");
    fireEvent.click(suivante);
    expect(aller).toHaveBeenCalledWith(3);
    expect(trackUmami).toHaveBeenCalledWith("lien-etape-clic", { parcours: "repartie", etape: 3 });
  });

  it("dernière étape : pas de lien « suivante »", () => {
    render(<PiedEtape slug="repartie" suivante={null} allerAEtape={jest.fn()} />);
    expect(screen.getAllByRole("link")).toHaveLength(1);
  });

  // s26 parcours connecté, tour 2 : test changé (raison : sous 1024 px, la liste du visiteur passe dans un `details`
  // FERMÉ dont le résumé porte la ligne d'offre, UX §4 ; dès 1024 px, liste dépliée dont les lignes s'étirent à la hauteur
  // de la carte ; deux rendus choisis par CSS seul, la page est rendue côté serveur).
  it("visiteur : ligne d'offre puis liens d'ancre, « Lecture libre » sur l'étape 1 seulement, aucun bouton ; replié sous 1024 px", () => {
    const aller = jest.fn();
    const { container } = render(<ListeEtapesVisiteur slug="repartie" etapes={[{ order: 1, titre: "Un", libre: true }, { order: 2, titre: "Deux", libre: false }]} allerAEtape={aller} />);
    const large = container.querySelector("[data-liste-large]") as HTMLElement;
    const repliee = container.querySelector("details[data-liste-repliee]") as HTMLDetailsElement;
    expect(large.className.split(" ")).toEqual(expect.arrayContaining(["hidden", "lg:flex", "lg:flex-1", "lg:flex-col"]));
    expect(repliee.className.split(" ")).toContain("lg:hidden");
    expect(repliee.open).toBe(false);
    expect(within(repliee.querySelector("summary") as HTMLElement).getByText(progressionVisiteurTexte())).toBeInTheDocument();
    expect(screen.getAllByText(progressionVisiteurTexte())).toHaveLength(2);
    for (const liste of [large, repliee.querySelector("ol") as HTMLElement]) {
      const liens = within(liste).getAllByRole("link");
      expect(liens.map((l) => l.getAttribute("href"))).toEqual(["#etape-1", "#etape-2"]);
      expect(within(liste).getAllByText(ETAPE_LIBRE_BADGE)).toHaveLength(1);
      expect(liens[0].className.split(" ")).toEqual(expect.arrayContaining(["min-h-11", "flex-1"]));
    }
    expect(screen.queryByRole("button")).toBeNull();
    fireEvent.click(within(large).getAllByRole("link")[1]);
    expect(aller).toHaveBeenCalledWith(2);
  });

  it("sommaire de l'abonné : `details` dont le résumé porte « n sur N étapes » et la barre ; replié sous 1024 px", () => {
    const mq = window.matchMedia;
    window.matchMedia = ((q: string) => ({ matches: false, media: q, addEventListener: jest.fn(), removeEventListener: jest.fn() })) as unknown as typeof window.matchMedia;
    try {
      const { container } = render(<SommaireParcours etapes={[{ order: 1, titre: "Un" }, { order: 2, titre: "Deux" }]} faites={[1]} onOuvrir={jest.fn()} />);
      const details = screen.getByTestId("sommaire-parcours");
      expect(details.tagName).toBe("DETAILS");
      expect((details as HTMLDetailsElement).open).toBe(false);
      const resume = container.querySelector("summary") as HTMLElement;
      expect(within(resume).getByRole("progressbar")).toHaveAttribute("aria-valuenow", "1");
    } finally {
      window.matchMedia = mq;
    }
  });
});

// s26 parcours connecté, tour 2 (`docs/captures/s26/tour-2-quoi-repondre-parcours/MESURES.md` B2, B3) : retour du
// navigateur, sommaire de l'en-tête 7/5, resserrages sous 300 px.
describe("tour 2 : retour du navigateur et en-tête 7/5", () => {
  it("la position quittée est notée dans l'entrée d'historique courante, état de Next conservé, puis relue", () => {
    window.history.replaceState({ __NA: true, arbre: "x" }, "");
    expect(lirePosition()).toBeNull();
    noterPosition({ etape: 3, y: 4390 });
    expect(window.history.state).toEqual({ __NA: true, arbre: "x", parcoursPosition: { etape: 3, y: 4390 } });
    expect(lirePosition()).toEqual({ etape: 3, y: 4390 });
    window.history.replaceState({ parcoursPosition: { etape: "3", y: "a" } }, "");
    expect(lirePosition()).toBeNull();
    window.history.replaceState(null, "");
  });

  it("recalerPosition rend le défilement noté", () => {
    const scrollTo = jest.fn();
    const avant = window.scrollTo;
    window.scrollTo = scrollTo as unknown as typeof window.scrollTo;
    try {
      recalerPosition(2755)();
      expect(scrollTo).toHaveBeenCalledWith({ top: 2755, behavior: "instant" });
    } finally {
      window.scrollTo = avant;
    }
  });

  it("sommaire : lignes de 48 px dès 1024 px, qui se partagent la hauteur de la carte étirée", () => {
    const { container } = render(<SommaireParcours etapes={[{ order: 1, titre: "Un" }, { order: 2, titre: "Deux" }]} faites={[]} onOuvrir={jest.fn()} />);
    const details = screen.getByTestId("sommaire-parcours");
    expect(details.className.split(" ")).toEqual(expect.arrayContaining(["lg:flex", "lg:flex-1", "lg:flex-col", "lg:[&::details-content]:flex"]));
    expect((container.querySelector("ol") as HTMLElement).className.split(" ")).toEqual(expect.arrayContaining(["lg:flex", "lg:flex-1", "lg:mt-2"]));
    for (const li of Array.from(container.querySelectorAll("li"))) {
      expect(li.className.split(" ")).toEqual(expect.arrayContaining(["lg:flex-1", "lg:py-0.5"]));
      expect(li.className).not.toMatch(/min-h-/);
    }
  });

  it("200 % de texte : filet de « Ton cap » resserré sous 300 px", () => {
    const { container } = render(<CarteEnCours etat="ok" etape={ETAPE} caps={CAPS} />);
    const cap = container.querySelector("#cap") as HTMLElement;
    expect(cap.className.split(" ")).toContain("max-e300:gap-y-1");
    expect((cap.parentElement as HTMLElement).className.split(" ")).toEqual(expect.arrayContaining(["max-e300:mt-2", "max-e300:pt-2"]));
  });
});
