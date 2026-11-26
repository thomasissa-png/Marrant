/**
 * s27, défauts cosmétiques du parcours abonné (`docs/qa/parcours-abonne-s27.md`, D5 à D9), contrôlés en vrai navigateur
 * (`docs/captures/s27-corrections-abonne/`) ; ici, la régression.
 */
import { readFileSync } from "fs";
import path from "path";
import { render, screen } from "@testing-library/react";
import { BoutonsReponse } from "@/components/espace/carte/boutons-reponse";
import { TEXTES_SUCCESS } from "@/config/textes/paiement";
import { TEXTES_QUESTIONS } from "@/config/textes/espace-questions";
import { TEXTES_PARCOURS_ESPACE } from "@/config/textes/espace-caps";

const source = (fichier: string) => readFileSync(path.join(__dirname, "../..", fichier), "utf8");

describe("D5 : « Paiement reçu ! », accès déjà prêt", () => {
  it("plus de « Ton accès s'active… » (points de suspension qui faisaient croire à un chargement)", () => {
    expect(TEXTES_SUCCESS.pretTexte).toBe("Merci.");
    expect(TEXTES_SUCCESS.pretTexte).not.toMatch(/…|\.\.\.|s.active/);
  });
});

describe("D6 : « À moitié » ne se coupe plus au milieu du mot à 390 px", () => {
  it("coupure aux espaces seulement (`break-word`, plus `anywhere`), marge interne réduite sous 640 px", () => {
    render(<BoutonsReponse reponse="MOITIE" revision={false} onRepondre={jest.fn()} />);
    const bouton = screen.getByRole("button", { pressed: true });
    expect(bouton.className).toContain("[overflow-wrap:break-word]");
    expect(bouton.className).not.toContain("[overflow-wrap:anywhere]");
    expect(bouton.className).toContain("max-sm:!px-2");
  });
});

describe("D7 : compteur de « Mes envois » libellé", () => {
  it("« Répondu : 0 / 3 » (mot existant « Répondu »), plus de chiffres seuls", () => {
    expect(TEXTES_QUESTIONS.envois.compteur(0, 3)).toBe("Répondu : 0 / 3");
    expect(source("components/espace/questions/liste-envois.tsx")).toContain("Q.envois.compteur(repondues, fils.length)");
  });
});

describe("D8 et D9 : un seul titre principal par page", () => {
  it("D8 : fiche du carnet sous 1024, le h1 du carnet reste pour les lecteurs d'écran (plus masqué en entier)", () => {
    const s = source("components/espace/carnet/carnet-liste-detail.tsx");
    expect(s).toContain('ouverte && "max-lg:mb-0 max-lg:[&>:not(h1)]:hidden max-lg:[&>h1]:sr-only"');
    expect(s).not.toMatch(/intro=\{carnet\.intro\} className=\{cn\("mb-8", ouverte && "max-lg:hidden"\)\}/);
  });

  it.each([
    ["Bibliothèque", "app/(dashboard)/mon-espace/bibliotheque/page.tsx", "<PanneauTechnique {...panneau} niveauTitre={2} />"],
    ["Quoi répondre", "app/(dashboard)/mon-espace/quoi-repondre/page.tsx", "<PanneauFiche {...panneau} niveauTitre={2} />"],
  ])("D9 : %s, h1 de la rubrique hors du mode page (lecteur d'écran seul dès 1024), fiche du panneau en h2", (_, fichier, panneau) => {
    const s = source(fichier);
    expect(s.match(/<h1/g)).toHaveLength(1);
    expect(s).toContain('<header className="lg:sr-only">');
    expect(s.indexOf('<header className="lg:sr-only">')).toBeLessThan(s.indexOf('data-mode="page"'));
    expect(s).toContain(panneau);
  });

  it("D9 : la fiche du panneau choisit son niveau (h1 par défaut, h2 sur la page de liste)", () => {
    const s = source("components/espace/fiche.tsx");
    expect(s).toContain('const TitreFiche = niveauTitre === 2 ? "h2" : "h1";');
    expect(s).toContain('<TitreFiche id="fiche-titre" tabIndex={-1}');
  });
});

describe("Aujourd'hui : « Le parcours peut attendre » retiré (décision de Thomas du 26/11)", () => {
  it("la semaine 1 ne contredit plus « Étape conseillée » ; le reste du bloc est inchangé", () => {
    const lignes = TEXTES_PARCOURS_ESPACE.semaines.lignes;
    expect(JSON.stringify(TEXTES_PARCOURS_ESPACE)).not.toMatch(/parcours peut attendre/i);
    expect(lignes[0]).toEqual({ semaine: "Semaine 1 :", texte: "le faux secret, une mission à voix haute." });
    expect(lignes).toHaveLength(4);
  });
});
