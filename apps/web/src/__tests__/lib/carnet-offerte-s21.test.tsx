/**
 * s21, blocs d'appel partie A (B1) : fiche offerte du carnet (`offerte`, `accroche`)
 * et encart `DemoVanne` des articles.
 * - une seule fiche offerte par carnet ; repli sur la première ;
 * - /carnet, l'extrait de /abonnement et l'encart montrent la même fiche ;
 * - octobre 2026 : « Le premier rendez-vous silencieux » (décision de conversion) ;
 * - l'encart : un plein vers la fiche, jamais la réplique dans le HTML, masqué pour Premium.
 */
import { render, screen } from "@testing-library/react";
import {
  CARNET_ACCROCHE_MAX,
  carnetViewForPlan,
  ficheOfferte,
  getCarnetDemo,
  getCarnetExtrait,
  parseCarnets,
  type Carnet,
} from "@/lib/carnet";
import { DemoVanne } from "@/components/blog/demo-vanne";
import { DEMO_VANNE } from "@/config/textes/cta-articles-accueil";
import { CARNET_FIXTURES } from "../helpers/carnet-fixture";
import { OCTOBRE_18, lireCarnetOctobre } from "../helpers/carnet-octobre";

const useSession = jest.fn(() => ({ data: null, status: "unauthenticated" }));
jest.mock("next-auth/react", () => ({ useSession: () => useSession() }));
jest.spyOn(console, "error").mockImplementation(() => {});

const october = CARNET_FIXTURES.find((c) => c.mois === "2026-10")!;
const avecOfferte = (index: number, accroche?: string): Carnet => ({
  ...october,
  fiches: october.fiches.map((f, i) => (i === index ? { ...f, offerte: true, ...(accroche ? { accroche } : {}) } : f)),
});

describe("schéma : offerte et accroche", () => {
  it("deux fiches offertes : carnet écarté", () => {
    const deux = { ...october, fiches: october.fiches.map((f, i) => (i < 2 ? { ...f, offerte: true } : f)) };
    expect(parseCarnets([deux])).toEqual([]);
  });
  it(`accroche de plus de ${CARNET_ACCROCHE_MAX} caractères : carnet écarté`, () => {
    expect(parseCarnets([avecOfferte(2, "x".repeat(CARNET_ACCROCHE_MAX + 1))])).toEqual([]);
    expect(parseCarnets([avecOfferte(2, "x".repeat(CARNET_ACCROCHE_MAX))])).toHaveLength(1);
  });
  it("aucune fiche offerte : la première sert de repli", () => {
    expect(ficheOfferte(october).id).toBe(october.fiches[0].id);
    expect(ficheOfferte(avecOfferte(3)).id).toBe(october.fiches[3].id);
  });
});

describe("accès gratuit : suit le champ offerte", () => {
  it("non abonné : la fiche offerte en entier, toutes les autres en aperçu, dans l'ordre", () => {
    const carnet = avecOfferte(3);
    const view = carnetViewForPlan(carnet, null);
    expect(view.fiches.map((f) => f.id)).toEqual([carnet.fiches[3].id]);
    expect(view.apercus.map((f) => f.id)).toEqual(carnet.fiches.filter((_, i) => i !== 3).map((f) => f.id));
    expect(JSON.stringify(view.apercus)).not.toContain(carnet.fiches[0].reponse);
  });
  it("Premium : toutes les fiches, ordre du carnet inchangé", () => {
    const carnet = avecOfferte(3);
    expect(carnetViewForPlan(carnet, "PREMIUM").fiches.map((f) => f.id)).toEqual(carnet.fiches.map((f) => f.id));
  });
});

describe("carnet réel d'octobre 2026", () => {
  const reel = parseCarnets([lireCarnetOctobre()]);
  it("une seule fiche offerte : 2026-10-15, accroche de 110 caractères au plus", () => {
    expect(reel).toHaveLength(1);
    const offertes = reel[0].fiches.filter((f) => f.offerte);
    expect(offertes.map((f) => f.id)).toEqual(["2026-10-15"]);
    expect(offertes[0].accroche!.length).toBeLessThanOrEqual(CARNET_ACCROCHE_MAX);
  });
  it("/carnet, extrait de /abonnement et encart d'article : la même fiche", () => {
    expect(carnetViewForPlan(reel[0], null).fiches[0].titre).toBe("Le premier rendez-vous silencieux");
    expect(getCarnetExtrait(reel, OCTOBRE_18)?.fiche.id).toBe("2026-10-15");
    expect(getCarnetDemo(reel, OCTOBRE_18)).toEqual({
      mois: "2026-10",
      fiche: {
        id: "2026-10-15",
        titre: "Le premier rendez-vous silencieux",
        accroche: "Premier rendez-vous, au dessert. Tu viens de dire ta troisième phrase de la soirée",
        onTeDit: "Tu parles toujours aussi peu ?",
      },
      totalFiches: 15,
    });
  });
  it("le soleil dans l'ascenseur (01) passe dans Premium", () => {
    const view = carnetViewForPlan(reel[0], "FREE");
    expect(view.apercus.map((f) => f.id)).toContain("2026-10-01");
    expect(JSON.stringify(view)).not.toContain("je parle dans un ascenseur");
  });
});

describe("getCarnetDemo : vide propre", () => {
  it("fiche offerte sans accroche, ou mois sans carnet : null", () => {
    expect(getCarnetDemo([avecOfferte(0)], OCTOBRE_18)).toBeNull();
    expect(getCarnetDemo([], OCTOBRE_18)).toBeNull();
    expect(getCarnetDemo(parseCarnets([lireCarnetOctobre()]), new Date("2026-11-02T10:00:00Z"))).toBeNull();
  });
});

describe("DemoVanne (B1)", () => {
  const demo = getCarnetDemo(parseCarnets([lireCarnetOctobre()]), OCTOBRE_18)!;
  beforeEach(() => useSession.mockReturnValue({ data: null, status: "unauthenticated" }));

  it("situation, question, un plein vers la fiche, note ; jamais la réplique", () => {
    const { container } = render(<DemoVanne demo={demo} position="milieu-1" parcours="repartie" />);
    expect(container.innerHTML).not.toContain("Donne-moi la nuit");
    const encart = screen.getByRole("complementary", { name: DEMO_VANNE.surtitre });
    expect(encart).toHaveTextContent(/Premier rendez-vous, au dessert\. Tu viens de dire ta troisième phrase de la soirée, et on te lance\s?:\s«\sTu parles toujours aussi peu\s\?\s»/);
    expect(encart).toHaveTextContent("Tu réponds quoi");
    const liens = screen.getAllByRole("link");
    expect(liens).toHaveLength(1);
    expect(liens[0]).toHaveTextContent(DEMO_VANNE.bouton);
    expect(liens[0]).toHaveAttribute("href", "/carnet?src=blog-demo-milieu-1#fiche-2026-10-15");
    expect(liens[0]).toHaveAttribute("data-blog-cta", "demo-fiche");
    expect(liens[0].className).toContain("bg-accent-secondary-hover"); // variante primary (plein)
    expect(encart).toHaveTextContent("Les autres situations, nouvelles chaque mois, sont dans Premium");
    expect(encart.className).not.toContain("border-l-");
  });

  it("carnet d'une seule situation : pas de phrase sur les autres", () => {
    render(<DemoVanne demo={{ ...demo, totalFiches: 1 }} position="milieu-1" parcours="repartie" />);
    expect(screen.getByRole("complementary")).not.toHaveTextContent("Les autres situations");
  });

  it("abonné Premium connecté : masqué", () => {
    useSession.mockReturnValue({ data: { user: { plan: "PREMIUM" } }, status: "authenticated" } as never);
    const { container } = render(<DemoVanne demo={demo} position="milieu-1" parcours="repartie" />);
    expect(container).toBeEmptyDOMElement();
  });

  it("textes : zéro tiret cadratin", () => {
    expect(JSON.stringify(DEMO_VANNE) + DEMO_VANNE.note(true)).not.toContain("—");
  });
});
