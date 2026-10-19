/**
 * Lot 2 s21 : extrait du carnet sur /abonnement (docs/copy/lot2-boutons-abonnement-s21.md §5.5).
 * Condition de mise en ligne du duel carnet : mois, fiche 1 et nombre d'autres
 * situations calculés, rien en dur ; singulier si n = 1, aucune phrase si n = 0.
 */
import fs from "fs";
import path from "path";
import { render, screen } from "@testing-library/react";
import {
  deCarnetMonth,
  deMoisSeul,
  getCarnetExtrait,
  parseCarnets,
  type Carnet,
  type CarnetFiche,
} from "@/lib/carnet";
import { CarnetExtraitBloc } from "@/components/carnet/carnet-extrait";

function fiche(n: number): CarnetFiche {
  return {
    id: `f${n}`,
    titre: `Titre ${n}`,
    contexte: `Contexte ${n}`,
    situation: `Situation ${n}`,
    onTeDit: `On te dit ${n}`,
    reponse: `Réponse ${n}`,
    pourquoi: `Pourquoi ${n}`,
    siTendu: `SI_TENDU_${n}`,
    exercice: `EXERCICE_${n}`,
  };
}

function carnet(mois: string, count: number): Carnet {
  return { mois, titre: `Carnet ${mois}`, intro: "Intro", fiches: Array.from({ length: count }, (_, i) => fiche(i + 1)) };
}

const OCT_17 = new Date("2026-10-17T12:00:00Z");
const NOV_2 = new Date("2026-11-02T12:00:00Z");

describe("deMoisSeul : nom du mois sans l'année, avec élision", () => {
  it("« d'octobre », « de novembre », « d'avril », « d'août », « de décembre »", () => {
    expect(deMoisSeul("2026-10")).toBe("d’octobre");
    expect(deMoisSeul("2026-11")).toBe("de novembre");
    expect(deMoisSeul("2027-04")).toBe("d’avril");
    expect(deMoisSeul("2027-08")).toBe("d’août");
    expect(deMoisSeul("2026-12")).toBe("de décembre");
  });

  it("mois invalide : null ; deCarnetMonth garde l'année", () => {
    expect(deMoisSeul("2026-13")).toBeNull();
    expect(deMoisSeul("n'importe quoi")).toBeNull();
    expect(deCarnetMonth("2026-10")).toBe("d’octobre 2026");
  });
});

describe("getCarnetExtrait : carnet du mois en cours seulement", () => {
  it("renvoie la fiche 1 et le total du carnet du mois", () => {
    const extrait = getCarnetExtrait([carnet("2026-10", 15)], OCT_17);
    expect(extrait?.mois).toBe("2026-10");
    expect(extrait?.fiche.id).toBe("f1");
    expect(extrait?.totalFiches).toBe(15);
    expect(extrait?.numero).toBe(1);
  });

  it("null si le carnet du mois n'est pas déposé (jamais le carnet d'un mois passé)", () => {
    expect(getCarnetExtrait([carnet("2026-10", 15)], NOV_2)).toBeNull();
    expect(getCarnetExtrait([], OCT_17)).toBeNull();
  });

  it("carnet réel d'octobre 2026 : la fiche offerte (s21) « Le premier rendez-vous silencieux », 14 autres situations", () => {
    const json = fs.readFileSync(path.join(__dirname, "..", "..", "data", "carnet", "2026-10.json"), "utf8");
    const reel = parseCarnets([JSON.parse(json)]);
    const extrait = getCarnetExtrait(reel, OCT_17);
    expect(extrait?.fiche.titre).toBe("Le premier rendez-vous silencieux");
    expect(extrait?.fiche.reponse).toBe("Donne-moi la nuit. Demain, je t'envoie un message magnifique.");
    expect(extrait?.totalFiches).toBe(15);
    expect(extrait?.numero).toBe(15);
    render(<CarnetExtraitBloc extrait={extrait!} />);
    // textes-trajet-v2 A06 à A08 : chapeau calculé, deux bulles, plus de numéro de situation.
    expect(screen.getByText("La situation offerte d’octobre, et la réplique qui va avec.")).toBeInTheDocument();
    expect(screen.getByText("Tu parles toujours aussi peu ?")).toBeInTheDocument();
    // frTypo : trait d’union insécable (U+2060) après « Donne- ».
    expect(document.body.textContent?.replace(/\u2060/g, "").replace(/\s/g, " ")).toContain("Donne-moi la nuit. Demain, je t’envoie un message magnifique.");
    expect(document.body.textContent).not.toMatch(/Situation 15/);
  });

  it("carnet réel de novembre 2026 après bascule : « Situation 10, offerte »", () => {
    const json = fs.readFileSync(path.join(__dirname, "..", "..", "data", "carnet", "2026-11.json"), "utf8");
    const reel = parseCarnets([JSON.parse(json)]);
    const extrait = getCarnetExtrait(reel, NOV_2);
    expect(extrait?.fiche.id).toBe("2026-11-10");
    expect(extrait?.numero).toBe(10);
    render(<CarnetExtraitBloc extrait={extrait!} />);
    expect(screen.getByText("La situation offerte de novembre, et la réplique qui va avec.")).toBeInTheDocument();
    expect(document.body.textContent).not.toMatch(/Situation 10/);
  });

  it("prend le nouveau mois dès qu'il est ouvert", () => {
    const extrait = getCarnetExtrait([carnet("2026-10", 15), carnet("2026-11", 12)], NOV_2);
    expect(extrait?.mois).toBe("2026-11");
    expect(extrait?.totalFiches).toBe(12);
  });
});

describe("CarnetExtraitBloc", () => {
  it("v2 A06 à A09, v3 E02 et E04 : titre, chapeau, scène (titre de la fiche), deux bulles, aucun surtitre ni lien", () => {
    render(<CarnetExtraitBloc extrait={{ mois: "2026-10", fiche: fiche(1), totalFiches: 15, numero: 1 }} />);
    expect(screen.getByRole("heading", { level: 2, name: "Le carnet, en vrai" })).toBeInTheDocument();
    expect(screen.getByTestId("abonnement-carnet-chapeau")).toHaveTextContent("La situation offerte d’octobre, et la réplique qui va avec.");
    expect(screen.queryByText(/autres situations du mois/)).not.toBeInTheDocument();
    for (const t of ["On te dit", "Tu réponds", "On te dit 1", "Réponse 1"]) {
      expect(screen.getByText(t)).toBeInTheDocument();
    }
    expect(screen.getByText("Les 14 autres s’ouvrent avec Premium.")).toBeInTheDocument();
    // v3 E02 : la scène, entre le chapeau et « On te dit ».
    const scene = screen.getByRole("heading", { level: 3, name: "Titre 1" });
    const chapeau = screen.getByTestId("abonnement-carnet-chapeau");
    expect(chapeau.compareDocumentPosition(scene) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(scene.compareDocumentPosition(screen.getByText("On te dit")) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    const html = document.body.innerHTML;
    for (const absent of ["Situation 1", "Pourquoi 1", "Pourquoi ça marche", "SI_TENDU_1", "EXERCICE_1", "Si ça se tend", "À toi de jouer", "Contexte 1", "offerte<"]) {
      expect(html).not.toContain(absent);
    }
    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(1);
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });

  it("aucune intro, quel que soit le nombre de fiches", () => {
    const { unmount } = render(<CarnetExtraitBloc extrait={{ mois: "2026-11", fiche: fiche(1), totalFiches: 2, numero: 1 }} />);
    expect(screen.getByText("La situation offerte de novembre, et la réplique qui va avec.")).toBeInTheDocument();
    expect(screen.queryByText(/situations? du mois/)).not.toBeInTheDocument();
    expect(screen.getByText("L’autre s’ouvre avec Premium.")).toBeInTheDocument();
    unmount();
    render(<CarnetExtraitBloc extrait={{ mois: "2026-11", fiche: fiche(1), totalFiches: 1, numero: 1 }} />);
    expect(screen.queryByText(/situations? du mois/)).not.toBeInTheDocument();
    expect(screen.queryByText(/s’ouvrent? avec Premium/)).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "Le carnet, en vrai" })).toBeInTheDocument();
  });

  it("aucun bloc si le carnet est vide", () => {
    const { container } = render(<CarnetExtraitBloc extrait={{ mois: "2026-10", fiche: fiche(1), totalFiches: 0, numero: 1 }} />);
    expect(container).toBeEmptyDOMElement();
  });
});
