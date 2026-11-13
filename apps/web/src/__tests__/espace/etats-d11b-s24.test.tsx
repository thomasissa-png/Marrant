/**
 * Lot D11b (s24), défauts de la recette D11 corrigés dans les composants de l'espace (interrupteur simulé
 * ouvert pour la page « S'entraîner », jamais le code livré) :
 * - Q-6 / @ux D-4 (critère 8) : rafale sans carte montrable = « C'est tout pour aujourd'hui », jamais un
 *   bouton au sous-titre vide ;
 * - @ux D-3 : `?marche=n` sans mission servable = une ligne et un lien vers la marche ouverte ; les 5
 *   marches du contenu servi ont chacune une mission pour un abonné neuf ;
 * - @ux D-1 : la semaine 4 ne promet « Écouter, repérer » que si une fiche est publiée ;
 * - Q-4 (@design D1, critère 25) : ligne de fiche qui passe à la ligne, titre de 128 px au moins ;
 * - Q-5 (@design D4, critère 21) : bordure du bouton « Réessayer » du profil au token `border-input`.
 */
import { readFileSync } from "fs";
import { join } from "path";
import { render, screen, within } from "@testing-library/react";

jest.mock("@/config/espace-client", () => ({ ...jest.requireActual("@/config/espace-client"), ESPACE_CLIENT_PUBLIE: true }));
jest.mock("@/lib/espace/garde", () => ({ garderEspace: async () => ({ userId: "u1" }) }));
const rafale = jest.fn();
jest.mock("@/lib/espace/cartes-serveur", () => ({ lireRafale: (...a: unknown[]) => rafale(...a) }));
const retours = jest.fn();
jest.mock("@/lib/espace/missions-serveur", () => ({ lireRetoursMission: (...a: unknown[]) => retours(...a) }));
jest.mock("next/navigation", () => ({ useRouter: () => ({ refresh: jest.fn(), push: jest.fn() }), usePathname: () => "/mon-espace/s-entrainer" }));

import SEntrainerPage from "@/app/(dashboard)/mon-espace/s-entrainer/page";
import { CartesDuJour } from "@/components/espace/aujourdhui/cartes-du-jour";
import { QuatreSemaines } from "@/components/espace/quatre-semaines";
import { LignesFiches } from "@/components/espace/parcours/lignes-fiches";
import { ErreurProfil } from "@/components/espace/profil/erreur-profil";
import { ecouterPublie } from "@/lib/espace/ecouter-publie";
import { marcheDeRepli, missionDeMarche, missionsServiesValidees, type NumeroMarche } from "@/lib/espace/missions";
import { etapeDecoupee } from "@/lib/espace/parcours-fiches";
import { TEXTES_AUJOURDHUI as A } from "@/config/textes/espace-aujourdhui";
import { TEXTES_CARTES as T, TEXTES_MISSION as M } from "@/config/textes/espace-cartes";
import { TEXTES_PARCOURS_ESPACE as P } from "@/config/textes/espace-caps";
import ecouter from "@/data/espace/ecouter.json";

const ETAT_VIDE = { cartes: [], faites: [], fini: false, catalogue: new Map(), cetteSemaine: 0, compteARebours: { visible: false, durees: [], proposition: null } };

beforeEach(() => {
  rafale.mockReset();
  retours.mockReset();
});

describe("Q-6 / @ux D-4 : rafale sans carte", () => {
  it("0 carte, moteur « non fini » : l'état « C'est tout pour aujourd'hui », ni bouton ni sous-titre vide", () => {
    render(<CartesDuJour cartes={[]} href="/mon-espace/s-entrainer" fini={false} />);
    expect(screen.getByText(A.rafale.fini)).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: A.rafale.bouton })).toBeNull();
    expect(screen.queryByRole("list")).toBeNull();
  });

  it("cartes sans titre (catalogue qui ne les connaît plus) : traitées comme absentes", () => {
    render(<CartesDuJour cartes={[{ titre: "", href: "#carte-1", nouvelle: true }]} href="/mon-espace/s-entrainer" fini={false} />);
    expect(screen.getByText(A.rafale.fini)).toBeInTheDocument();
    expect(screen.queryByRole("link")).toBeNull();
  });

  it("une carte montrable : le bouton et un sous-titre non vide, comme avant", () => {
    render(<CartesDuJour cartes={[{ titre: "La poêle", href: "#carte-1", nouvelle: true }]} href="/mon-espace/s-entrainer" fini={false} />);
    expect(screen.getByRole("link", { name: A.rafale.bouton })).toBeInTheDocument();
    expect(screen.getByText(A.rafale.sousTitre(1, 0, 0))).toBeInTheDocument();
  });

  it("« S'entraîner » sans carte montrable : « C'est tout pour aujourd'hui » même si le moteur n'a pas dit fini", async () => {
    rafale.mockResolvedValue({ ...ETAT_VIDE, cartes: [{ carteId: "inconnue.c1", nouvelle: true }] });
    retours.mockResolvedValue([]);
    render(await SEntrainerPage({ searchParams: {} }));
    expect(screen.getByText(T.fini)).toBeInTheDocument();
  });
});

describe("@ux D-3 : mission d'une marche", () => {
  const missions = missionsServiesValidees();

  it("contenu servi : chaque marche 1 à 5 a une mission pour un abonné neuf", () => {
    for (const n of [1, 2, 3, 4, 5] as NumeroMarche[]) expect(missionDeMarche(missions, [], n)).not.toBeNull();
  });

  it("marche toute essayée : une ligne et le lien vers la marche la plus proche qui a une mission, jamais une page muette", async () => {
    const essais = missions.filter((m) => m.marche === 3).map((m) => ({ missionId: m.id, marche: 3, retour: "essaye-bof" as const }));
    expect(missionDeMarche(missions, essais, 3)).toBeNull();
    const repli = marcheDeRepli(missions, essais, 3);
    expect(repli).not.toBeNull();
    expect(repli).not.toBe(3);
    rafale.mockResolvedValue({ ...ETAT_VIDE, fini: true });
    retours.mockResolvedValue(essais);
    render(await SEntrainerPage({ searchParams: { marche: "3" } }));
    const vide = screen.getByTestId("mission-vide");
    expect(within(vide).getByText(M.aucuneMission)).toBeInTheDocument();
    expect(within(vide).getByRole("link", { name: M.voirLaMarche(repli as number) })).toHaveAttribute("href", `/mon-espace/s-entrainer?marche=${repli}#mission`);
  });

  it("aucune marche n'a plus de mission : la ligne seule, sans lien", () => {
    const tout = missions.map((m) => ({ missionId: m.id, marche: m.marche, retour: "essaye-bof" as const }));
    expect(marcheDeRepli(missions, tout, 3)).toBeNull();
  });

  it("sans `?marche=` et sans mission ouverte : rien de plus (la mission reste facultative)", async () => {
    rafale.mockResolvedValue({ ...ETAT_VIDE, fini: true });
    retours.mockResolvedValue(missions.map((m) => ({ missionId: m.id, marche: m.marche, retour: "essaye-bof" as const })));
    render(await SEntrainerPage({ searchParams: {} }));
    expect(screen.queryByTestId("mission-vide")).toBeNull();
  });
});

describe("@ux D-1 : semaine 4 et « Écouter, repérer »", () => {
  const semaine4 = () => screen.getAllByRole("listitem")[3];

  it("contenu servi aujourd'hui : `ecouter.json` vide, donc non publié", () => {
    expect(ecouter).toEqual([]);
    expect(ecouterPublie()).toBe(false);
    expect(ecouterPublie({})).toBe(false);
  });

  it("non publié : la ligne sans « Écouter », les 3 premières mot pour mot", () => {
    render(<QuatreSemaines etape={null} ecouterPublie={false} />);
    expect(screen.getAllByRole("listitem")).toHaveLength(4);
    expect(semaine4()).not.toHaveTextContent(/Écouter/);
    expect(semaine4()).toHaveTextContent(P.semaines.semaine4SansEcouter.texte);
    expect(P.semaines.semaine4SansEcouter.texte).toBe("l'étape suivante, une mission en face.");
  });

  it("calendrier de « Parcours » : la réponse de l'API décide ; avant elle (chargement, erreur), la ligne sans « Écouter »", () => {
    const source = readFileSync(join(__dirname, "../../components/espace/parcours/parcours-espace.tsx"), "utf8");
    expect(source).toContain("ecouterPublie={caps?.ecouterPublie === true}");
  });

  it("publié : la ligne validée, avec « Écouter, repérer »", () => {
    render(<QuatreSemaines etape={null} ecouterPublie />);
    expect(semaine4()).toHaveTextContent(/Écouter, repérer/);
  });
});

describe("Q-4 et Q-5 : 200 % de texte et contraste des bordures", () => {
  it("ligne de fiche : passe à la ligne, titre de 128 px au moins (jamais une lettre par ligne)", () => {
    expect(etapeDecoupee("machine-a-cafe", 1)).not.toBeNull();
    const etape = { order: 1, tip: { title: "Un titre de conseil assez long pour passer à la ligne" }, videos: [] };
    const { container } = render(<LignesFiches slug="machine-a-cafe" etape={etape} />);
    const lignes = container.querySelectorAll("li");
    expect(lignes.length).toBeGreaterThan(0);
    for (const ligne of Array.from(lignes)) {
      expect(ligne.className).toMatch(/\bflex-wrap\b/);
      expect(ligne.children[1].className).toContain("min-w-[min(8rem,100%)]");
      expect(ligne.children[1].className).not.toMatch(/\bmin-w-0\b/);
    }
  });

  it("« Réessayer » du profil : bordure `border-input` (3,3:1 sur carte), `text-muted` au survol", () => {
    render(<ErreurProfil onReessayer={() => undefined} />);
    const bouton = screen.getByRole("button");
    expect(bouton.className).toMatch(/\bborder-border-input\b/);
    expect(bouton.className).toMatch(/\bhover:border-text-muted\b/);
    expect(bouton.className).not.toMatch(/(^|\s)border-border(\s|$)/);
  });
});
