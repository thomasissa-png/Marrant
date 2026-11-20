/**
 * s26 parcours, tour 8 (relectures à l'aveugle v5 : `docs/design/relectures/v5-quoi-repondre-parcours-s26-design.md`,
 * parties Parcours ; `docs/ux/relectures/v5-quoi-repondre-parcours-s26-ux.md` D1 à D4). Briques de l'espace ouvert (mesures
 * au pixel : `playwright/tests/local/parcours-connecte-s26.spec.ts`, « tour 8 ») :
 * - magasin du parcours en cours : slug ET lien du « Reprendre » (repris en contour dans la carte du parcours) ;
 * - menu : pastille de la barre compacte = étape lue, « Retour : Parcours » en tête dès 1024, colonne de statut commune ;
 * - sous-étape cible : anneau fin tant qu'elle l'est (contexte), en plus du contour de 1,5 s ;
 * - vignette : deux lignes de titre, bouton de lecture remonté sous 360 px.
 */
import { act, render } from "@testing-library/react";
import parcoursSeed from "../../../../../docs/content/parcours-seed.json";

jest.mock("@/config/espace-client", () => ({ ...jest.requireActual("@/config/espace-client"), ESPACE_CLIENT_PUBLIE: true }));
jest.mock("next/navigation", () => ({ useRouter: () => ({ push: jest.fn(), refresh: jest.fn() }) }));
jest.mock("@/lib/umami", () => ({ trackUmami: jest.fn() }));

import { MenuEtapes } from "@/components/espace/parcours/menu-etapes";
import { FicheActiveContexte } from "@/components/espace/parcours/lignes-fiches";
import { ParcoursStepCard } from "@/components/parcours/parcours-step-card";
import { VideoCard } from "@/components/parcours/step-blocks";
import { fichesAffichees } from "@/lib/espace/sous-etapes";
import { noterParcoursEnCours, useLienParcoursEnCours, useParcoursEnCours } from "@/lib/espace/parcours-en-cours";
import type { Step } from "@/components/parcours/parcours-types";

type EtapeJson = { week: number; tipTitle: string; jokeContents?: string[]; videos?: Array<{ youtubeId: string; artist: string; title: string; why: string }>; quiz?: Step["quiz"] };
const SEED = (parcoursSeed as Array<{ slug: string; steps: EtapeJson[] }>).find((p) => p.slug === "machine-a-cafe")!;
const classes = (e: Element | null | undefined) => (e?.getAttribute("class") ?? "").split(" ");

const ETAPES = [
  { order: 1, titre: "Un", libre: true },
  { order: 2, titre: "Deux", verrouillee: true },
  { order: 3, titre: "Trois", verrouillee: true },
];

describe("s26 parcours, tour 8 : menu d'étapes", () => {
  it("barre compacte : l'étape LUE (`avanceeBarre`), l'en-tête du menu garde l'étape à reprendre", () => {
    const { container } = render(
      <MenuEtapes slug="s" titre="Machine à Café" avancee="Étape 3 sur 3" avanceeBarre="Étape 2 sur 3" etapes={ETAPES} faites={[1, 2]} active={2} onChoisir={jest.fn()} />,
    );
    expect(container.querySelector("[data-menu-bascule]")?.textContent).toBe("Étape 2 sur 3");
    expect(container.querySelector("[data-menu-etapes]")?.textContent).toContain("Étape 3 sur 3");
    // Sans `avanceeBarre` (visiteur, gratuit, parcours fini) : l'avancée, inchangée.
    const sans = render(<MenuEtapes slug="s" titre="T" avancee="Étape 3 sur 3" etapes={ETAPES} faites={[]} active={2} onChoisir={jest.fn()} />);
    expect(sans.container.querySelector("[data-menu-bascule]")?.textContent).toBe("Étape 3 sur 3");
  });

  it("dès 1024 px, « Retour : Parcours » en tête de la carte du menu (masqué sous 1024, la barre compacte l'a déjà)", () => {
    const { container } = render(
      <MenuEtapes slug="s" titre="T" avancee="x" etapes={ETAPES} faites={[]} active={1} onChoisir={jest.fn()} retour={<a href="/parcours#parcours-s">Retour</a>} />,
    );
    const tete = container.querySelector("[data-menu-etapes] [data-retour-menu]");
    expect(tete?.querySelector("a")?.getAttribute("href")).toBe("/parcours#parcours-s");
    expect(classes(tete)).toContain("max-lg:hidden");
    // Premier contenu de la carte, avant le titre du parcours.
    expect(tete?.compareDocumentPosition(container.querySelector("#menu-etapes-titre")!)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
    const sans = render(<MenuEtapes slug="s" titre="T" avancee="x" etapes={ETAPES} faites={[]} active={1} onChoisir={jest.fn()} />);
    expect(sans.container.querySelector("[data-retour-menu]")).toBeNull();
  });

  it("visiteur : « Lecture libre » et cadenas dans la même colonne (largeur fixe, alignés à droite)", () => {
    const { container } = render(<MenuEtapes slug="s" titre="T" avancee="x" etapes={ETAPES} faites={[]} active={1} onChoisir={jest.fn()} />);
    const libre = container.querySelector("[data-statut='libre']");
    const cadenas = container.querySelectorAll("[data-statut='verrouillee']");
    expect(cadenas).toHaveLength(2);
    for (const e of [libre, ...Array.from(cadenas)]) expect(classes(e)).toEqual(expect.arrayContaining(["w-28", "flex-none", "justify-end"]));
    expect(libre?.getAttribute("class")).toBe(cadenas[0].getAttribute("class"));
    expect(classes(libre?.firstElementChild)).toContain("whitespace-nowrap");
  });
});

describe("s26 parcours, tour 8 : sous-étape cible et vignettes", () => {
  const e = SEED.steps.find((s) => s.week === 2)!;
  const step: Step = {
    id: "s2",
    order: 2,
    dayNumber: 14,
    tip: { id: "t2", title: e.tipTitle, content: "Contenu", category: "GENERAL", difficulty: "DEBUTANT", example: "", exercise: "" },
    moduleXp: 50,
    jokes: (e.jokeContents ?? []).map((c, i) => ({ id: `j${i}`, content: c, punchline: "Chute", technique: null, href: `/vannes/j${i}` })),
    videos: e.videos ?? [],
    quiz: e.quiz ?? [],
  };
  const rendre = (active: string | null) =>
    render(
      <FicheActiveContexte.Provider value={{ active, choisir: jest.fn() }}>
        <ParcoursStepCard
          step={step}
          slug="machine-a-cafe"
          isPremium
          isCompleted={false}
          isExpanded
          isPremiumLocked={false}
          isQuizDone={false}
          isSeedFallback={false}
          completing={false}
          abonnementHref="/abonnement"
          loadFailed={false}
          onRetryLoad={jest.fn()}
          onToggle={jest.fn()}
          onQuizComplete={jest.fn()}
          onComplete={jest.fn()}
          ancresFiches
        />
      </FicheActiveContexte.Provider>,
    );

  it("seul le bloc de la sous-étape cible porte l'anneau fin (`data-fiche-cible`), aucun sans cible", () => {
    const video = fichesAffichees("machine-a-cafe", step, { etapeFaite: false, quizFait: false }).find((f) => f.cle.startsWith("video:"))!;
    const { container } = rendre(video.ancre);
    const cibles = container.querySelectorAll("[data-fiche-cible]");
    expect(cibles).toHaveLength(1);
    expect(cibles[0].id).toBe(video.ancre);
    expect(classes(cibles[0])).toEqual(expect.arrayContaining(["data-[fiche-cible]:outline", "data-[fiche-cible]:outline-1", "data-[fiche-reperee]:!outline-2"]));
    // Carte vidéo à la hauteur de sa cellule (rangée égale).
    expect(classes(cibles[0])).toContain("[&>div]:h-full");
    expect(rendre(null).container.querySelectorAll("[data-fiche-cible]")).toHaveLength(0);
  });

  it("vignette titrée : bouton de lecture remonté sous 360 px seulement ; sans titre incrusté, inchangé", () => {
    const v = { youtubeId: "abc", title: "Le mariage", artist: "Jason Brokerss", why: "Pourquoi" };
    const lecture = (c: HTMLElement) => c.querySelector("button > div");
    const avec = render(<VideoCard video={v} titreIncruste />).container;
    expect(classes(lecture(avec))).toEqual(expect.arrayContaining(["-translate-y-3", "[@container(min-width:360px)]:translate-y-0"]));
    const sans = render(<VideoCard video={v} />).container;
    expect(lecture(sans)?.getAttribute("class")).toBe(
      "relative z-10 flex h-14 w-14 items-center justify-center rounded-full bg-red-600 shadow-lg transition-transform group-hover/play:scale-110",
    );
  });
});

describe("s26 parcours, tour 8 : magasin du parcours en cours", () => {
  it("slug et lien notés ensemble, effacés ensemble", () => {
    let slug: string | null = "x";
    let lien: string | null = "x";
    function Lecteur() {
      slug = useParcoursEnCours();
      lien = useLienParcoursEnCours();
      return null;
    }
    render(<Lecteur />);
    expect([slug, lien]).toEqual([null, null]);
    act(() => noterParcoursEnCours("repartie", "/parcours/repartie#etape-2"));
    expect([slug, lien]).toEqual(["repartie", "/parcours/repartie#etape-2"]);
    act(() => noterParcoursEnCours(null, "/parcours/repartie#etape-2"));
    expect([slug, lien]).toEqual([null, null]);
  });
});
