/**
 * Navigation v6, tour 2, lot 1 (espace) : `docs/espace-client/travail-en-cours/plan-corrections-v6-tour-2.md`,
 * points 1 à 7 et 12 (le point 10, redirection du middleware : `v6-tour2-lot1-middleware.test.ts`). Rendu ouvert
 * seulement (fermé : /mon-espace est la 404, `/favoris` garde ses classes d'avant, contrôlé ici et par
 * `inertie-espace.test.tsx`). Mesures en vrai navigateur : `playwright/tests/local/espace-v6-tour2-lot1.spec.ts`.
 */
import { readFileSync } from "fs";
import { join } from "path";
import { act, fireEvent, render, screen, within } from "@testing-library/react";

jest.mock("next/navigation", () => ({
  notFound: () => {
    throw new Error("NEXT_NOT_FOUND");
  },
  redirect: jest.fn(),
  useRouter: () => ({ refresh: jest.fn(), push: jest.fn() }),
  usePathname: () => "/mon-espace",
}));
jest.mock("next/server", () => ({ NextResponse: { json: jest.fn() } }));
jest.mock("next/headers", () => ({ headers: () => ({ get: () => null }) }));
jest.mock("next-auth", () => ({ getServerSession: jest.fn() }));
jest.mock("@/lib/auth", () => ({ authOptions: {} }));
jest.mock("@/lib/prisma", () => ({ prisma: {} }));

import seances from "@/data/espace/seances.json";
import { puce } from "@/components/espace/carte/styles";
import { ApercuRubrique } from "@/components/espace/apercu/apercu-rubrique";
import { BoutonsReponse, PRENDS_TON_TEMPS_MS } from "@/components/espace/carte/boutons-reponse";
import { NoteReplique } from "@/components/espace/carte/note-replique";
import { CorpsSeance, decouperConsigneNumerotee } from "@/components/espace/fiche/corps-divers";
import { FormulaireQuestion } from "@/components/espace/questions/formulaire";
import { ListeEnvois } from "@/components/espace/questions/liste-envois";
import type { FicheDeType } from "@/lib/espace/fiches";
import { frEspaceProfond } from "@/lib/fr-typo";

const SRC = join(__dirname, "../..");
const lire = (f: string) => readFileSync(join(SRC, f), "utf8");
const classes = (el: Element | null) => (el?.getAttribute("class") ?? "").split(/\s+/);
const RUBRIQUES = ["aujourdhui", "quoiRepondre", "bibliotheque", "sEntrainer", "mesQuestions", "mesRepliques", "favoris"] as const;

describe("point 1 : aperçu en une colonne centrée, offre dessous", () => {
  it.each(RUBRIQUES)("%s", (rubrique) => {
    const { container } = render(<ApercuRubrique rubrique={rubrique} visiteur />);
    const racine = container.querySelector("[data-apercu]") as HTMLElement;
    expect(classes(racine)).toEqual(expect.arrayContaining(["mx-auto", "max-w-3xl"]));
    expect(classes(racine.querySelector("header"))).toContain("text-center");
    expect(container.innerHTML).not.toMatch(/sticky|lg:grid-cols-12|lg:col-span/);
    const article = container.querySelector("article") as HTMLElement;
    const offre = container.querySelector("[data-apercu-offre]") as HTMLElement;
    // L'offre vient après l'exemple, dans la même colonne, contenu centré.
    expect(article.compareDocumentPosition(offre) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(article.parentElement).toBe(offre.parentElement);
    expect(classes(offre)).toEqual(expect.arrayContaining(["justify-center", "rounded-xl", "before:h-1"]));
    expect(within(offre).getAllByRole("link")).toHaveLength(2);
  });

  it("Mes questions : un seul filet (aucune carte à filet dans une carte à filet)", () => {
    const { container } = render(<ApercuRubrique rubrique="mesQuestions" visiteur />);
    const filets = Array.from(container.querySelectorAll("[class*='before:h-1']"));
    const imbriques = filets.filter((f) => filets.some((g) => g !== f && g.contains(f)));
    expect(imbriques).toEqual([]);
  });

  it("Favoris : les deux contenus réels l'un sous l'autre (v6 tour 3, arbitrage 4, remplace le côte à côte)", () => {
    expect(lire("components/espace/apercu/exemple.tsx")).toContain('"grid grid-cols-1 gap-4" data-apercu-fiche="favoris-exemples"');
  });
});

describe("point 2 : « Oui / À moitié / Rien » dans la langue des puces « Ton retour »", () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it("puce, 44 px, aucun aspect éteint pendant « Prends ton temps », choix coché", () => {
    const onRepondre = jest.fn();
    const { rerender } = render(<BoutonsReponse reponse={null} revision onRepondre={onRepondre} />);
    const boutons = within(screen.getByRole("group")).getAllByRole("button");
    expect(boutons).toHaveLength(3);
    for (const b of boutons) {
      for (const c of puce(false).split(" ")) expect(classes(b)).toContain(c);
      expect(classes(b)).toEqual(expect.arrayContaining(["min-h-11", "text-text-primary", "border-border-input"]));
      expect(b.className).not.toMatch(/aria-disabled:(text-text-muted|border-border\b)/);
      expect(b.getAttribute("aria-disabled")).toBe("true");
    }
    act(() => {
      jest.advanceTimersByTime(PRENDS_TON_TEMPS_MS);
    });
    fireEvent.click(boutons[1]);
    expect(onRepondre).toHaveBeenCalledWith("MOITIE");
    rerender(<BoutonsReponse reponse="MOITIE" revision onRepondre={onRepondre} />);
    const choisi = within(screen.getByRole("group")).getAllByRole("button")[1];
    expect(choisi.getAttribute("aria-pressed")).toBe("true");
    expect(classes(choisi)).toEqual(expect.arrayContaining(["border-2", "border-accent-link"]));
    expect(choisi.querySelector("svg")).not.toBeNull();
  });
});

describe("point 3 : « Ma réplique à moi », 96 px au moins, grandit avec le texte", () => {
  it("`min-h-24` (96 px), sans poignée ni défilement", () => {
    render(<NoteReplique ficheId="f1" initiale="Une réplique déjà écrite" />);
    const champ = screen.getByRole("textbox");
    expect(classes(champ)).toEqual(expect.arrayContaining(["min-h-24", "resize-none", "overflow-hidden"]));
  });
});

describe("point 4 : séance, étape « Observation » en liste numérotée, texte inchangé", () => {
  type Seance = { id: string; contenu: FicheDeType<"seance">["contenu"] };
  const liste = seances as unknown as Seance[];
  const dix = liste.find((s) => s.id === "seance-dix-chambrages-dix-secondes") as Seance;
  const observation = dix.contenu.etapes.find((e) => e.nom === "observation")?.consigne ?? "";

  it("découpe exacte : intro + 10 phrases, rien d'ajouté ni de perdu", () => {
    const d = decouperConsigneNumerotee(observation);
    expect(d?.items).toHaveLength(10);
    expect(`${d?.intro}\n${d?.items.map((t, i) => `${i + 1}. ${t}`).join(" ")}`).toBe(observation);
    // Avec la typographie de l'espace (espaces insécables), même découpe.
    expect(decouperConsigneNumerotee(frEspaceProfond(observation))?.items).toHaveLength(10);
  });

  it("toute autre consigne reste un paragraphe", () => {
    const autres = liste.flatMap((s) => s.contenu.etapes.map((e) => e.consigne)).filter((c) => c !== observation);
    for (const c of autres) expect(decouperConsigneNumerotee(c)).toBeNull();
    expect(decouperConsigneNumerotee("Intro\n1. un 3. trois")).toBeNull();
  });

  it("rendu : `<ol>` de 10 lignes", () => {
    render(<CorpsSeance c={frEspaceProfond(dix.contenu)} />);
    const ol = screen.getByTestId("seance-liste");
    expect(ol.tagName).toBe("OL");
    expect(within(ol).getAllByRole("listitem")).toHaveLength(10);
  });
});

describe("point 5 : S'entraîner, cartes pleine ligne (remplacé par le tour 3, puis par le tour 4, arbitrage 1)", () => {
  // s26 (`docs/design/rubriques-abonne-s26.md` §2.1, retour de Thomas : plus de colonne centrée seule) : la colonne
  // centrée du tour 4 est remplacée par la grille 7/5 (`rubriques-abonne-s26.test.tsx`).
  it("plus de mesure plafonnée dans une carte pleine ligne ; plus de colonne centrée, grille 7/5 (s26)", () => {
    const page = lire("app/(dashboard)/mon-espace/s-entrainer/page.tsx");
    expect(page).not.toContain("MESURE_PLEINE_LIGNE");
    expect(page).not.toContain("COLONNE_ENTRAINEMENT");
    expect(page).toMatch(/lg:col-span-7[\s\S]*lg:col-span-5/);
  });
});

describe("points 6 et 7 : Mes répliques et Mes questions, même coque, titres au même niveau", () => {
  it("Mes répliques : plus de colonne étroite centrée", () => {
    const page = lire("app/(dashboard)/mon-espace/repliques/page.tsx");
    expect(page).not.toContain("COLONNE_LECTURE");
    expect(page).not.toContain("mx-auto");
  });

  it("Mes questions : « Écrire à l'équipe » et « Mes envois » hors carte, mêmes classes", () => {
    render(
      <div>
        <FormulaireQuestion onEnvoye={jest.fn()} />
        <ListeEnvois envois={[]} lectureSeule={false} onMaj={jest.fn()} onRetire={jest.fn()} />
      </div>,
    );
    const [ecrire, envois] = screen.getAllByRole("heading", { level: 2 });
    expect(ecrire.className).toBe(envois.className);
    for (const titre of [ecrire, envois]) expect(titre.closest("[class*='before:h-1']")).toBeNull();
    expect(classes(document.querySelector("form"))).toEqual(expect.arrayContaining(["rounded-xl", "before:h-1"]));
  });
});

describe("point 12 : Favoris abonné, cibles de 44 px", () => {
  it("onglets et « Retirer » en `min-h-11` interrupteur ouvert seulement", () => {
    const source = lire("components/favoris/favoris-list.tsx");
    expect(source).toContain('const CIBLE_44 = ESPACE_CLIENT_PUBLIE ? " min-h-11" : "";');
    expect(source.match(/\$\{CIBLE_44\}/g)).toHaveLength(4);
    expect(source).toContain("className={CIBLE_44.trim() || undefined}");
    // « Partager » : cible de 44 px déjà portée par le bouton (pastille visible de 32 px).
    expect(lire("components/ui/share-button.tsx")).toContain("flex h-11 w-11");
  });
});
