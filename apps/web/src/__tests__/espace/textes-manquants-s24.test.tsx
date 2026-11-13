/**
 * Textes manquants de l'import 2 (s24), validés le 13/11 (`docs/copy/espace/textes-manquants-import2-s24.md`,
 * reco en gras, tours 2 et 3) : gestes « À toi » des séances posés par l'import, libellé de la réponse des
 * « Pires réponses » et message de la cloche posés par l'écran. Chaque texte est relu dans le document.
 */
import { render, screen } from "@testing-library/react";
import seances from "@/data/espace/seances.json";
import jeux from "@/data/espace/jeux.json";
import { validerFichier } from "@/lib/espace/fiches-schema";
import { CorpsJeu } from "@/components/espace/fiche/corps-divers";
import { TEXTES_FICHE as T } from "@/config/textes/espace-bibliotheque";
import { TEXTES_CLOCHE } from "@/config/textes/espace-cloche";
import { erreurCloche, gestesSeances, libellesPiresReponses } from "../../../scripts/importer-fiches/textes-manquants";

describe("textes manquants de l'import 2, mot pour mot", () => {
  it("les 6 séances portent leur geste validé, dans l'ordre des séances du lot C6c", () => {
    const gestes = gestesSeances();
    const servies = validerFichier("seance", seances);
    expect(servies).toHaveLength(6);
    servies.forEach((s, i) => expect(s.geste?.consigne).toBe(gestes.get(i + 1)));
    expect(gestes.get(2)).toBe("Ce soir, redis ta première phrase une fois à voix haute, pour qu'elle passe en douce au repas que tu as choisi.");
    expect(gestes.get(6)).toBe("Ce soir, après une de tes phrases, devine le nombre de signaux et sors la clôture qui va avec, ou rien s'il n'y en a aucun.");
  });

  it("« Les pires réponses » : libellé des jeux 1, 2, 4, et celui du jeu 3", () => {
    const { defaut, jeu3 } = libellesPiresReponses();
    expect(T.reponsePiresReponses.defaut).toBe(defaut);
    expect(T.reponsePiresReponses.parJeu["les-pires-reponses-3"]).toBe(jeu3);
    expect(Object.keys(T.reponsePiresReponses.parJeu)).toEqual(["les-pires-reponses-3"]);
    const pires = validerFichier("jeu", jeux).filter((j) => j.type === "jeu" && j.contenu.famille === "les-pires-reponses");
    for (const j of pires) {
      if (j.type !== "jeu") continue;
      const { unmount } = render(<CorpsJeu c={j.contenu} id={j.id} />);
      const attendu = j.id === "les-pires-reponses-3" ? jeu3 : defaut;
      expect(screen.getByText(attendu, { selector: "summary" })).toBeInTheDocument();
      expect(screen.queryByText(T.ceQuOnAuraitPuDire)).toBeNull();
      unmount();
    }
  });

  it("les autres jeux gardent « Ce qu'on aurait pu dire »", () => {
    const autre = validerFichier("jeu", jeux).find((j) => j.type === "jeu" && j.contenu.famille !== "les-pires-reponses");
    if (!autre || autre.type !== "jeu") throw new Error("aucun autre jeu");
    render(<CorpsJeu c={autre.contenu} id={autre.id} />);
    expect(screen.getByText(T.ceQuOnAuraitPuDire, { selector: "summary" })).toBeInTheDocument();
  });

  it("cloche qui ne charge pas : la reco B ; zéro tiret cadratin dans les trois textes", () => {
    expect(TEXTES_CLOCHE.erreur).toBe(erreurCloche());
    const tout = [TEXTES_CLOCHE.erreur, T.reponsePiresReponses.defaut, ...Object.values(T.reponsePiresReponses.parJeu), ...gestesSeances().values()].join(" ");
    expect(tout).not.toMatch(/—/);
  });
});
