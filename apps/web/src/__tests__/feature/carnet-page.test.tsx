/**
 * Pages /carnet et /carnet/[mois] (Server Components) : le HTML d'un non-abonné
 * ne contient que la première fiche + titres/contextes des autres, puis l'appel
 * à l'abonnement (returnTo=/carnet) ; un abonné reçoit tout + les mois précédents.
 */
import { render, screen } from "@testing-library/react";
import CarnetCurrentPage, { metadata } from "@/app/(dashboard)/carnet/page";
import CarnetMonthPage from "@/app/(dashboard)/carnet/[mois]/page";
import { readSessionPlan } from "@/lib/session-plan";
import { CARNET_FIXTURES, SECRET_FIELDS } from "../helpers/carnet-fixture";

jest.mock("@/lib/session-plan", () => ({ readSessionPlan: jest.fn() }));
jest.mock("@/hooks/use-content-stats", () => ({
  useContentStats: () => ({ jokes: 0, tips: 0, videos: 0 }),
}));
jest.mock("next/navigation", () => ({
  notFound: () => {
    throw new Error("NEXT_NOT_FOUND");
  },
}));
jest.mock("@/lib/carnet", () => {
  const actual = jest.requireActual("@/lib/carnet");
  const { CARNET_FIXTURES: fixtures } = jest.requireActual("../helpers/carnet-fixture");
  const now = new Date("2026-10-03T12:00:00Z");
  return {
    ...actual,
    getCurrentCarnet: () => actual.getCurrentCarnet(fixtures, now),
    getCarnetByMonth: (mois: string) => actual.getCarnetByMonth(mois, fixtures, now),
    listCarnetMonths: () => actual.listCarnetMonths(fixtures, now),
  };
});

const planMock = readSessionPlan as jest.Mock;
const october = CARNET_FIXTURES.find((c) => c.mois === "2026-10")!;

async function renderCurrent() {
  return render(await CarnetCurrentPage({}));
}

describe("/carnet non Premium", () => {
  it.each([null, "FREE"])("plan %s : aperçu sans fuite dans le HTML", async (plan) => {
    planMock.mockResolvedValue(plan);
    const { container } = await renderCurrent();
    const html = container.innerHTML;

    for (const field of SECRET_FIELDS) expect(html).toContain(october.fiches[0][field]);
    // Concision v5 : « Au programme », 3 titres de fiches puis « Et N autres répliques ».
    october.fiches.slice(1).forEach((fiche, i) => {
      if (i < 3) {
        expect(html).toContain(fiche.titre);
        expect(html).toContain(fiche.contexte);
      } else {
        expect(html).not.toContain(fiche.titre);
      }
      for (const field of SECRET_FIELDS) expect(html).not.toContain(fiche[field]);
    });
    expect(html).not.toContain("2026-11");

    const n = october.fiches.length - 1;
    expect(screen.getByRole("heading", { name: "Au programme" })).toBeInTheDocument();
    expect(screen.getByText(`Et ${n - 3} autres répliques`)).toBeInTheDocument();
    const cta = screen.getByRole("link", { name: /^Voir tout le carnet\s·\s2,99\s€\/mois$/ });
    expect(cta).toHaveAttribute("href", "/abonnement?returnTo=%2Fcarnet&src=carnet");
    expect(html).not.toContain("—");
  });

  it("concision v5 : titre, paragraphe, bouton et REASS, mot pour mot, juste après la fiche offerte", async () => {
    planMock.mockResolvedValue(null);
    await renderCurrent();
    const n = october.fiches.length - 1;
    const t = (el: HTMLElement) => (el.textContent ?? "").replace(/\u00a0/g, " ").replace(/\u2060/g, "");
    expect(t(screen.getByRole("heading", { name: /^Ça, c.était la réplique offerte/ }))).toBe(`Ça, c'était la réplique offerte. Il en reste ${n}.`);
    expect(screen.getByText("Un nouveau carnet arrive chaque mois.")).toBeInTheDocument();
    expect(t(screen.getByTestId("carnet-paywall-bouton"))).toBe("Voir tout le carnet · 2,99 €/mois");
    expect(t(screen.getByText(/^Premium\s:\spremier paiement/))).toBe(
      "Premium : premier paiement remboursable sous 14 jours. Résiliable depuis ton profil.",
    );
    // Bloc d'achat avant la liste verrouillée.
    const bouton = screen.getByTestId("carnet-paywall-bouton");
    const liste = screen.getByRole("heading", { name: "Au programme" });
    expect(bouton.compareDocumentPosition(liste) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(document.body.textContent).not.toMatch(/autres situations du mois|Elles vont de la moins tendue/);
    expect(screen.queryByText(/Débloque tout le carnet|Commencer à/)).toBeNull();
  });
});

describe("/carnet Premium", () => {
  it("carnet complet du mois courant + accès aux mois précédents, sans paywall", async () => {
    planMock.mockResolvedValue("PREMIUM");
    const { container } = await renderCurrent();
    const html = container.innerHTML;

    for (const fiche of october.fiches) {
      for (const field of SECRET_FIELDS) expect(html).toContain(fiche[field]);
    }
    expect(screen.queryByRole("link", { name: /Voir tout le carnet/ })).toBeNull();
    expect(screen.getByRole("link", { name: "septembre 2026" })).toHaveAttribute("href", "/carnet/2026-09");
    expect(html).not.toContain("novembre 2026");
  });
});

describe("/carnet/[mois]", () => {
  it("mois précédent complet pour un Premium", async () => {
    planMock.mockResolvedValue("PREMIUM");
    render(await CarnetMonthPage({ params: { mois: "2026-09" } }));
    expect(screen.getByRole("heading", { level: 1, name: "Carnet 2026-09" })).toBeInTheDocument();
  });

  it("mois futur : 404 (même pour un Premium)", async () => {
    planMock.mockResolvedValue("PREMIUM");
    await expect(CarnetMonthPage({ params: { mois: "2026-11" } })).rejects.toThrow("NEXT_NOT_FOUND");
  });

  it("mois précédent en aperçu pour un non-abonné, retour vers ce mois après paiement", async () => {
    planMock.mockResolvedValue(null);
    const { container } = await render(await CarnetMonthPage({ params: { mois: "2026-09" } }));
    expect(container.innerHTML).not.toContain("REPONSE_SECRETE_2026-09-F2");
    expect(screen.getByRole("link", { name: /Voir tout le carnet/ })).toHaveAttribute(
      "href",
      "/abonnement?returnTo=%2Fcarnet%2F2026-09&src=carnet",
    );
  });
});

describe("source de mesure du bouton E1 (QA v2 MJ-1)", () => {
  const bouton = () => screen.getByTestId("carnet-paywall-bouton");

  it("arrivée depuis l'encart d'un article : la source d'origine suit le visiteur", async () => {
    planMock.mockResolvedValue(null);
    render(await CarnetCurrentPage({ searchParams: { src: "blog-demo-milieu-1" } }));
    expect(bouton()).toHaveAttribute("href", "/abonnement?returnTo=%2Fcarnet&src=blog-demo-milieu-1");
  });

  it.each([["Bad Src"], [["a", "b"]], [""]])("src d'arrivée invalide (%j) : repli sur carnet", async (src) => {
    planMock.mockResolvedValue("FREE");
    render(await CarnetCurrentPage({ searchParams: { src } }));
    expect(bouton()).toHaveAttribute("href", "/abonnement?returnTo=%2Fcarnet&src=carnet");
  });

  it("/carnet/[mois] garde aussi la source d'arrivée", async () => {
    planMock.mockResolvedValue(null);
    render(await CarnetMonthPage({ params: { mois: "2026-09" }, searchParams: { src: "header" } }));
    expect(bouton()).toHaveAttribute("href", "/abonnement?returnTo=%2Fcarnet%2F2026-09&src=header");
  });
});

describe("SEO", () => {
  it("/carnet est en noindex (contenu payant)", () => {
    expect(metadata.robots).toEqual({ index: false, follow: false });
  });
});
