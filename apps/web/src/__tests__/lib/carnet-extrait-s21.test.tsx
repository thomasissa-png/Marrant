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
import { carnetExtraitSurtitre } from "@/config/textes/carnet-extrait";
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
    expect(deMoisSeul("2026-10")).toBe("d'octobre");
    expect(deMoisSeul("2026-11")).toBe("de novembre");
    expect(deMoisSeul("2027-04")).toBe("d'avril");
    expect(deMoisSeul("2027-08")).toBe("d'août");
    expect(deMoisSeul("2026-12")).toBe("de décembre");
  });

  it("mois invalide : null ; deCarnetMonth garde l'année", () => {
    expect(deMoisSeul("2026-13")).toBeNull();
    expect(deMoisSeul("n'importe quoi")).toBeNull();
    expect(deCarnetMonth("2026-10")).toBe("d'octobre 2026");
  });
});

describe("surtitre de l'extrait (concision v5 : plus de phrase d'intro)", () => {
  it("surtitre calculé, jamais « octobre » ni « Situation 1 » en dur", () => {
    expect(carnetExtraitSurtitre("d'octobre", 15)).toBe("Carnet d'octobre · Situation 15, offerte");
    expect(carnetExtraitSurtitre("de novembre", 10)).toBe("Carnet de novembre · Situation 10, offerte");
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
    expect(screen.getByText("Carnet d'octobre · Situation 15, offerte")).toBeInTheDocument();
  });

  it("carnet réel de novembre 2026 après bascule : « Situation 10, offerte »", () => {
    const json = fs.readFileSync(path.join(__dirname, "..", "..", "data", "carnet", "2026-11.json"), "utf8");
    const reel = parseCarnets([JSON.parse(json)]);
    const extrait = getCarnetExtrait(reel, NOV_2);
    expect(extrait?.fiche.id).toBe("2026-11-10");
    expect(extrait?.numero).toBe(10);
    render(<CarnetExtraitBloc extrait={extrait!} />);
    expect(screen.getByText("Carnet de novembre · Situation 10, offerte")).toBeInTheDocument();
  });

  it("prend le nouveau mois dès qu'il est ouvert", () => {
    const extrait = getCarnetExtrait([carnet("2026-10", 15), carnet("2026-11", 12)], NOV_2);
    expect(extrait?.mois).toBe("2026-11");
    expect(extrait?.totalFiches).toBe(12);
  });
});

describe("CarnetExtraitBloc", () => {
  it("rend le surtitre, le titre, la fiche sans « Si ça se tend » ni « À toi de jouer », et le lien (plus d'intro)", () => {
    render(<CarnetExtraitBloc extrait={{ mois: "2026-10", fiche: fiche(1), totalFiches: 15, numero: 1 }} />);
    expect(screen.getByText("Carnet d'octobre · Situation 1, offerte")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "Le carnet, en vrai" })).toBeInTheDocument();
    expect(screen.queryByText(/autres situations du mois/)).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 3, name: "Titre 1" })).toBeInTheDocument();
    for (const t of ["Situation 1", "On te dit 1", "Réponse 1", "Pourquoi 1"]) {
      expect(screen.getByText(t)).toBeInTheDocument();
    }
    const html = document.body.innerHTML;
    for (const absent of ["SI_TENDU_1", "EXERCICE_1", "Si ça se tend", "À toi de jouer", "Contexte 1", "· offerte<"]) {
      expect(html).not.toContain(absent);
    }
    expect(screen.getByRole("link", { name: "Lire la fiche en entier" })).toHaveAttribute("href", "/carnet#fiche-f1");
  });

  it("aucune intro, quel que soit le nombre de fiches", () => {
    const { unmount } = render(<CarnetExtraitBloc extrait={{ mois: "2026-11", fiche: fiche(1), totalFiches: 2, numero: 1 }} />);
    expect(screen.getByText("Carnet de novembre · Situation 1, offerte")).toBeInTheDocument();
    expect(screen.queryByText(/situations? du mois/)).not.toBeInTheDocument();
    unmount();
    render(<CarnetExtraitBloc extrait={{ mois: "2026-11", fiche: fiche(1), totalFiches: 1, numero: 1 }} />);
    expect(screen.queryByText(/situations? du mois/)).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "Le carnet, en vrai" })).toBeInTheDocument();
  });

  it("aucun bloc si le carnet est vide", () => {
    const { container } = render(<CarnetExtraitBloc extrait={{ mois: "2026-10", fiche: fiche(1), totalFiches: 0, numero: 1 }} />);
    expect(container).toBeEmptyDOMElement();
  });
});
