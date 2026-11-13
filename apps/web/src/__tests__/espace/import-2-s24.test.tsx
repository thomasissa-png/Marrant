/**
 * Import 2 du contenu de l'espace (s24) : séances, vocabulaire, C1b fiche 7 (récit), C6a fiches 9 et 10,
 * paliers P3 ; finitions de rendu (grille du geste, retours à la ligne, renvoi calculé du bilan, geste du
 * bilan affiché une fois, lettre des « pires réponses »). Contenu réel lu dans `data/espace` (jamais modifié).
 */
import { render, screen, within } from "@testing-library/react";
import { FicheVue } from "@/components/espace/fiche";
import { TEXTES_BILAN as B, TEXTES_FICHE as T } from "@/config/textes/espace-bibliotheque";
import { validerFichier, type Fiche } from "@/lib/espace/fiches-schema";
import { renvoiDeBilan } from "@/lib/espace/bilan-renvoi";
import { HREF_ENTREE_COIN } from "@/lib/espace/humour-noir";
import seances from "@/data/espace/seances.json";
import vocabulaire from "@/data/espace/vocabulaire.json";
import constructions from "@/data/espace/constructions.json";
import aPlat from "@/data/espace/a-plat.json";
import bilans from "@/data/espace/bilans.json";
import jeux from "@/data/espace/jeux.json";
import situations from "@/data/espace/situations.json";
import humourNoir from "@/data/espace/humour-noir.json";

jest.mock("next/navigation", () => ({ useRouter: () => ({ refresh: jest.fn(), push: jest.fn() }), usePathname: () => "/" }));

const par = <F extends Fiche>(liste: F[], id: string): F => {
  const f = liste.find((x) => x.id === id);
  if (!f) throw new Error(`fiche absente : ${id}`);
  return f;
};
const vue = (fiche: Fiche) => render(<FicheVue fiche={fiche} retour={null} replique={null} lettre={null} />);

describe("import 2 : volumes et paliers", () => {
  it("6 séances (1 P2, 5 P3), 8 vocabulaires, 12 constructions, 10 « à plat »", () => {
    const s = validerFichier("seance", seances);
    expect(s).toHaveLength(6);
    expect(s.map((x) => x.palier).sort()).toEqual(["P2", "P3", "P3", "P3", "P3", "P3"]);
    expect(validerFichier("vocabulaire", vocabulaire)).toHaveLength(8);
    expect(validerFichier("construction", constructions)).toHaveLength(12);
    expect(validerFichier("a-plat", aPlat)).toHaveLength(10);
  });

  it("P3 : 15 situations (réunion et entretien, commerces, prise de parole) ; constructions : la combinaison seule", () => {
    const p3 = validerFichier("situation", situations).filter((x) => x.palier === "P3");
    expect(p3).toHaveLength(15);
    expect(new Set(p3.map((x) => x.type === "situation" && x.univers))).toEqual(new Set(["reunion-entretien", "commerces-voisins-transports", "prise-de-parole"]));
    expect(validerFichier("construction", constructions).filter((x) => x.palier === "P3").map((x) => x.id)).toEqual(["la-combinaison-de-deux-mecanismes"]);
  });

  it("vocabulaire : 40 mots, 12 avec « Définition complète » (aucun lien inventé), emploi attesté par fiche", () => {
    const mots = validerFichier("vocabulaire", vocabulaire).flatMap((f) => (f.type === "vocabulaire" ? f.contenu.mots : []));
    expect(mots).toHaveLength(40);
    expect(mots.filter((m) => m.definitionComplete)).toHaveLength(12);
    for (const f of validerFichier("vocabulaire", vocabulaire)) expect(f.type === "vocabulaire" && f.contenu.emploiAtteste.length).toBeGreaterThan(0);
  });
});

describe("import 2 : écrans", () => {
  it("séance : rubriques du lot, grille du bilan en liste, geste « faire »", () => {
    const f = validerFichier("seance", seances)[0];
    vue(f);
    for (const t of [T.seance.pourQuiQuand, T.seance.ilTeFaut, T.seance.tuProduis, `${T.seance.versionPossible} (phrase 2)`, T.seance.renvois]) {
      expect(screen.getByRole("heading", { name: t })).toBeInTheDocument();
    }
    expect(within(screen.getByTestId("seance-grille")).getAllByRole("listitem")).toHaveLength(3);
    expect(screen.getByTestId("geste-fiche")).toHaveTextContent("Redis ta réplique deux fois ce soir, pour l'avoir en bouche à la prochaine pique.");
  });

  it("vocabulaire : mot neuf sans lien, mot du glossaire avec son lien ; l'emploi attesté n'est jamais affiché", () => {
    const f = validerFichier("vocabulaire", vocabulaire)[0];
    const { container } = vue(f);
    expect(screen.getAllByRole("link", { name: T.definitionComplete })).toHaveLength(3);
    expect(container.textContent).not.toContain(f.type === "vocabulaire" ? f.contenu.emploiAtteste : "x");
  });

  it("construction en récit (C1b fiche 7) : aucun guillemet ajouté ; grille du geste affichée", () => {
    const f = par(validerFichier("construction", constructions), "le-callback");
    const { container } = vue(f);
    expect(f.type === "construction" && f.contenu.forme).toBe("recit");
    expect(container.textContent).not.toContain("« On te demande");
    expect(container.textContent).not.toContain("« « ");
    expect(within(screen.getByTestId("geste-grille")).getAllByRole("listitem")).toHaveLength(3);
  });

  it("« à plat » fiche 9 : rubrique avant les répliques ; fiche 10 : lien vers l'entrée du coin, hors du geste", () => {
    const liste = validerFichier("a-plat", aPlat);
    const f9 = par(liste, "a-plat-le-blanc");
    const premier = vue(f9);
    expect(screen.getByRole("heading", { name: "De quel blanc parle-t-on" })).toBeInTheDocument();
    premier.unmount();
    const { unmount } = vue(par(liste, "a-plat-lire-la-salle-et-savoir-s-arreter"));
    expect(screen.getByRole("link", { name: "Rire de sujets graves, sans blesser : la limite" })).toHaveAttribute("href", HREF_ENTREE_COIN);
    expect(screen.getByTestId("geste-fiche")).not.toHaveTextContent("Rire de sujets graves");
    unmount();
  });

  it("retours à la ligne conservés (texte du coin à deux paragraphes)", () => {
    const f = validerFichier("humour-noir", humourNoir).find(
      (x) => x.type === "humour-noir" && x.contenu.forme === "limite" && x.contenu.blocs.some((b) => b.texte.includes("\n")),
    );
    if (!f) throw new Error("aucun texte à deux paragraphes");
    const { container } = vue(f);
    const p = [...container.querySelectorAll("p")].find((x) => x.textContent?.includes("\n"));
    expect(p?.className).toContain("whitespace-pre-line");
  });
});

describe("import 2 : bilans", () => {
  const liste = validerFichier("bilan", bilans);

  it("chaque « laquelle » porte l'étape de son quiz ; le renvoi est calculé (titre du conseil, ancre de l'étape)", () => {
    for (const b of liste) {
      if (b.type !== "bilan") continue;
      for (const e of b.contenu.elements) if (e.forme === "laquelle") expect(e.etape).toBeGreaterThan(0);
      expect(JSON.stringify(b)).not.toContain("renvoi");
    }
    expect(renvoiDeBilan("confiance", 1)).toEqual({ titre: "Énoncer la règle non écrite", href: "/parcours/confiance#etape-1" });
    expect(renvoiDeBilan("confiance", 99)).toBeNull();
    expect(renvoiDeBilan("inconnu", 1)).toBeNull();
  });

  it("le « à voix haute » n'est affiché qu'une fois (dans le geste)", () => {
    const b = par(liste, "bilan-machine-a-cafe");
    const consigne = b.geste?.consigne ?? "";
    const { container } = vue(b);
    expect(container.textContent?.split(consigne).length).toBe(2);
    expect(container.querySelector('[data-bilan="voix-haute"]')).toBeNull();
  });

  it("deuxième tour : le lien suit l'étape du quiz", () => {
    const b = par(liste, "bilan-machine-a-cafe");
    if (b.type !== "bilan" || b.contenu.elements[0].forme !== "laquelle") throw new Error("forme");
    expect(renvoiDeBilan("machine-a-cafe", b.contenu.elements[0].etape)?.href).toBe("/parcours/machine-a-cafe#etape-1");
    expect(B.deuxiemeTour("x")).toBe("La fiche « x » mérite un deuxième tour.");
  });
});

describe("« Les pires réponses » : la lettre affichée est la bonne réponse du jeu", () => {
  it("la lettre de « Ce qu'on aurait pu dire » est celle que le retour désigne pour le critère de la consigne", () => {
    const pires = validerFichier("jeu", jeux).filter((j) => j.type === "jeu" && j.contenu.famille === "les-pires-reponses");
    expect(pires).toHaveLength(4);
    for (const j of pires) {
      if (j.type !== "jeu") continue;
      expect(j.contenu.consigne).toMatch(/Laquelle (ferme le plus l'échange|met le plus la personne sur la défensive) \?$/);
      const lettre = /^([ABC])\.$/.exec(j.contenu.ceQuOnAuraitPuDire[0])?.[1];
      const designee = /^(?:La personne rit de son histoire : )?([ABC]) /.exec(j.contenu.explication ?? "")?.[1];
      expect(lettre).toBeDefined();
      expect(lettre).toBe(designee);
    }
  });
});
