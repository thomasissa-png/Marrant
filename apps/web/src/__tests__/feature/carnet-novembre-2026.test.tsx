/**
 * Carnet de novembre 2026 (validé à l'aveugle, `docs/copy/carnet/novembre/carnet-2026-11.json`) :
 * le fichier embarqué passe le schéma, reste caché jusqu'au 01/11 00:00 Paris (heure
 * d'hiver : 2026-10-31T23:00:00Z), puis devient le carnet courant avec sa fiche offerte
 * `2026-11-10` sur /carnet, l'extrait de /abonnement et l'encart des articles.
 */
import crypto from "crypto";
import fs from "fs";
import path from "path";
import { render, screen } from "@testing-library/react";
import CarnetCurrentPage from "@/app/(dashboard)/carnet/page";
import { DemoVanne } from "@/components/blog/demo-vanne";
import { CarnetExtraitBloc } from "@/components/carnet/carnet-extrait";
import { DEMO_VANNE } from "@/config/textes/cta-articles-accueil";
import type { Carnet } from "@/lib/carnet";
import { readSessionPlan } from "@/lib/session-plan";

const DATA = path.join(__dirname, "..", "..", "data", "carnet");
/**
 * Empreinte de la source validée (`docs/copy/carnet/novembre/carnet-2026-11.json`, commit e6f5584,
 * sha256 44b3a8c7…cac8c), seule la clé `intro` remplacée par le texte de la concision v5
 * (`docs/copy/cta-s21/concision/textes-v5-c.md` §6) : aucun autre octet ne bouge.
 */
const SHA256_VALIDE = "e2b15d0f38422b7baf72eeaf814697702786d04a8c62a0c244fb02b1985b270a";

function lire(fichier: string): unknown {
  return JSON.parse(fs.readFileSync(path.join(DATA, fichier), "utf8"));
}

const AVANT_MINUIT = new Date("2026-10-31T22:59:59Z"); // 31/10 23:59:59 Paris
const MINUIT = new Date("2026-10-31T23:00:00Z"); // 01/11 00:00:00 Paris (UTC+1)

let mockNow = MINUIT;

jest.mock("@/lib/session-plan", () => ({ readSessionPlan: jest.fn() }));
jest.mock("@/hooks/use-content-stats", () => ({
  useContentStats: () => ({ jokes: 0, tips: 0, videos: 0 }),
}));
jest.mock("next-auth/react", () => ({ useSession: () => ({ data: null, status: "unauthenticated" }) }));
jest.mock("next/navigation", () => ({
  notFound: () => {
    throw new Error("NEXT_NOT_FOUND");
  },
}));
jest.mock("@/lib/carnet", () => {
  const actual = jest.requireActual("@/lib/carnet");
  const fsm = jest.requireActual("fs");
  const p = jest.requireActual("path");
  const dir = p.join(__dirname, "..", "..", "data", "carnet");
  const carnets = actual.parseCarnets(
    ["2026-10.json", "2026-11.json"].map((f: string) => JSON.parse(fsm.readFileSync(p.join(dir, f), "utf8"))),
  );
  return {
    ...actual,
    getCurrentCarnet: () => actual.getCurrentCarnet(carnets, mockNow),
    listCarnetMonths: () => actual.listCarnetMonths(carnets, mockNow),
  };
});

// Fonctions réelles (le module importé est remplacé par la fabrique ci-dessus).
const actual = jest.requireActual<typeof import("@/lib/carnet")>("@/lib/carnet");
const { CARNET_ACCROCHE_MAX, carnetViewForPlan, getCarnetDemo, getCarnetExtrait, getCurrentCarnet, listCarnetMonths, parseCarnets } =
  actual;
const carnets: Carnet[] = actual.parseCarnets([lire("2026-10.json"), lire("2026-11.json")]);
const novembre = carnets.find((c) => c.mois === "2026-11")!;
const norm = (s: string) => s.replace(/[  ]/g, " ").replace(/⁠/g, "").replace(/’/g, "'");
const t = (el: HTMLElement) => norm(el.textContent ?? "");

describe("fichier 2026-11.json", () => {
  it("octets identiques à la version validée à l'aveugle (sha256 de docs/copy/carnet/novembre/carnet-2026-11.json, intro v5)", () => {
    const empreinte = crypto.createHash("sha256").update(fs.readFileSync(path.join(DATA, "2026-11.json"))).digest("hex");
    expect(empreinte).toBe(SHA256_VALIDE);
  });

  it("passe le schéma : 30 fiches, une seule offerte (2026-11-10), accroches présentes et courtes", () => {
    expect(parseCarnets([lire("2026-11.json")])).toHaveLength(1);
    expect(novembre.mois).toBe("2026-11");
    expect(novembre.fiches).toHaveLength(30);
    expect(new Set(novembre.fiches.map((f) => f.id)).size).toBe(30);
    expect(novembre.fiches.filter((f) => f.offerte === true).map((f) => f.id)).toEqual(["2026-11-10"]);
    for (const f of novembre.fiches) {
      expect(f.accroche).toBeTruthy();
      expect(f.accroche!.length).toBeLessThanOrEqual(CARNET_ACCROCHE_MAX);
    }
  });
});

describe("bascule à minuit, heure de Paris (31/10 → 01/11, heure d'hiver)", () => {
  it("31/10 23:59:59 Paris : novembre caché, octobre courant", () => {
    expect(getCurrentCarnet(carnets, AVANT_MINUIT)?.mois).toBe("2026-10");
    expect(listCarnetMonths(carnets, AVANT_MINUIT)).toEqual(["2026-10"]);
    expect(getCarnetExtrait(carnets, AVANT_MINUIT)?.fiche.id).toBe("2026-10-15");
    expect(getCarnetDemo(carnets, AVANT_MINUIT)?.fiche.id).toBe("2026-10-15");
  });

  it("01/11 00:00:00 Paris : novembre courant, fiche offerte 2026-11-10 partout", () => {
    expect(getCurrentCarnet(carnets, MINUIT)?.mois).toBe("2026-11");
    expect(listCarnetMonths(carnets, MINUIT)).toEqual(["2026-11", "2026-10"]);
    const vue = carnetViewForPlan(novembre, null);
    expect(vue.fiches.map((f) => f.id)).toEqual(["2026-11-10"]);
    expect(vue.apercus).toHaveLength(29);
    expect(getCarnetExtrait(carnets, MINUIT)?.fiche.id).toBe("2026-11-10");
    expect(getCarnetExtrait(carnets, MINUIT)?.totalFiches).toBe(30);
    expect(getCarnetExtrait(carnets, AVANT_MINUIT)?.numero).toBe(15);
    expect(getCarnetExtrait(carnets, MINUIT)?.numero).toBe(10);
    expect(getCarnetDemo(carnets, MINUIT)?.fiche.id).toBe("2026-11-10");
  });
});

describe("/carnet non abonné, de part et d'autre de minuit", () => {
  const planMock = readSessionPlan as jest.Mock;
  beforeEach(() => planMock.mockResolvedValue(null));

  it("31/10 23:59:59 Paris : carnet d'octobre, rien de novembre dans le HTML", async () => {
    mockNow = AVANT_MINUIT;
    const { container } = render(await CarnetCurrentPage({}));
    const html = container.innerHTML;
    expect(html).toContain('id="fiche-2026-10-15"');
    expect(html).not.toContain("2026-11");
    for (const f of novembre.fiches) expect(html).not.toContain(f.reponse);
    expect(t(screen.getByTestId("carnet-paywall-bouton"))).toBe("Voir tout le carnet · 2,99 €/mois");
    // Numéro = position réelle dans le carnet : offerte 15e ; liste verrouillée réduite à 3 titres (v5).
    expect(html).toContain(">Situation 15 · offerte<");
    expect(html).toContain(">Situation 3<");
    expect(html).not.toContain(">Situation 4<");
    expect(screen.getByText("Et 11 autres répliques")).toBeInTheDocument();
    expect(html).not.toContain(">Situation 1 · offerte<");
  });

  it("01/11 00:00:00 Paris : carnet de novembre, fiche 2026-11-10 en entier, « Il en reste 29 »", async () => {
    mockNow = MINUIT;
    const { container } = render(await CarnetCurrentPage({}));
    const html = container.innerHTML;
    const offerte = novembre.fiches.find((f) => f.id === "2026-11-10")!;
    expect(html).toContain('id="fiche-2026-11-10"');
    expect(html).toContain(">Situation 10 · offerte<");
    expect(html).toContain(">Situation 3<");
    expect(html).not.toContain(">Situation 30<");
    expect(screen.getByText("Et 26 autres répliques")).toBeInTheDocument();
    expect(screen.getByText("Du premier froid aux préparatifs de Noël, des répliques qui montent d’un cran.")).toBeInTheDocument();
    for (const champ of ["situation", "onTeDit", "reponse", "pourquoi", "siTendu", "exercice"] as const) {
      expect(html.replace(/’/g, "'").replace(/\u00a0|&nbsp;/g, " ")).toContain(offerte[champ]);
    }
    novembre.fiches.filter((x) => x !== offerte).forEach((f, i) => {
      if (i < 3) expect(html).toContain(f.titre);
      expect(html).not.toContain(f.reponse);
      expect(html).not.toContain(f.siTendu);
    });
    expect(t(screen.getByRole("heading", { name: /^Ça, c.était la réplique offerte/ }))).toBe(
      "Ça, c'était la réplique offerte. Il en reste 29.",
    );
    const bouton = screen.getByTestId("carnet-paywall-bouton");
    expect(t(bouton)).toBe("Voir tout le carnet · 2,99 €/mois");
    expect(bouton.closest("a") ?? bouton).toHaveAttribute("href", "/abonnement?returnTo=%2Fcarnet&src=carnet");
  });
});

describe("consommateurs de la fiche offerte au 01/11 (encart des articles, extrait de /abonnement)", () => {
  it("DemoVanne : accroche et réplique lancée de 2026-11-10, lien vers sa fiche", () => {
    const demo = getCarnetDemo(carnets, MINUIT)!;
    const offerte = novembre.fiches.find((f) => f.id === "2026-11-10")!;
    render(<DemoVanne demo={demo} position="milieu-1" parcours="repartie" />);
    const aside = screen.getByRole("complementary", { name: DEMO_VANNE.surtitre });
    expect(aside).toHaveAttribute("data-blog-cta-fiche", "2026-11-10");
    expect(t(aside)).toContain(norm(DEMO_VANNE.situation(offerte.accroche!, offerte.onTeDit)));
    expect(aside.innerHTML).not.toContain(offerte.reponse);
    expect(screen.getByRole("link", { name: DEMO_VANNE.bouton })).toHaveAttribute(
      "href",
      "/carnet?src=blog-demo-milieu-1#fiche-2026-11-10",
    );
    expect(aside.innerHTML).not.toMatch(/\.\s*,\s*et on te lance|,,/);
  });

  it("extrait de /abonnement : carnet de novembre, fiche 2026-11-10 (plus d'intro « autres situations »)", () => {
    const extrait = getCarnetExtrait(carnets, MINUIT)!;
    render(<CarnetExtraitBloc extrait={extrait} />);
    expect(screen.getByRole("heading", { level: 3, name: /^Le gratin «\s+intéressant\s+»$/ })).toBeInTheDocument();
    expect(screen.queryByText(/autres situations du mois/)).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Lire la fiche en entier" })).toHaveAttribute("href", "/carnet#fiche-2026-11-10");
  });
});
