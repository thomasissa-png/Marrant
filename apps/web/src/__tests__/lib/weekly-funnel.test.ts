/**
 * @jest-environment node
 *
 * Audit parcours s16 (reco 17) : funnel du rapport du lundi en chiffres
 * absolus, et conversion de l'admin hors des 11 anciens comptes gratuits.
 */
const fetchUmamiMetrics = jest.fn();
const fetchUmamiPathMetrics = jest.fn();
jest.mock("@/lib/analytics/umami", () => ({
  fetchUmamiMetrics: (...a: unknown[]) => fetchUmamiMetrics(...a),
  fetchUmamiPathMetrics: (...a: unknown[]) => fetchUmamiPathMetrics(...a),
}));

import {
  LEGACY_FREE_CUTOFF,
  buildFunnelSectionHtml,
  buildWeeklyFunnel,
  conversionHorsAnciensComptes,
  type FunnelDbCounts,
} from "@/lib/analytics/weekly-funnel";

const config = { apiKey: "k", websiteId: "w" };
const week = { startAt: Date.UTC(2026, 8, 27, 22), endAt: Date.UTC(2026, 9, 4, 21, 59) };
const db: FunnelDbCounts = {
  comptesCrees: 3,
  paiements: 2,
  resiliations: 1,
  resiliationsProgrammees: 1,
  abonnesActifs: 2,
  mrrCents: 299 + 2499 / 12,
};

beforeEach(() => {
  jest.clearAllMocks();
  fetchUmamiPathMetrics.mockResolvedValue([
    { x: "/abonnement", y: 8 },
    { x: "/abonnement/", y: 1 },
    { x: "/abonnement/success", y: 4 },
  ]);
  fetchUmamiMetrics.mockResolvedValue([
    { x: "mur-vu", y: 12 },
    { x: "abonnement-clic", y: 5 },
    { x: "inscription-echec", y: 1 },
    { x: "blog-scroll", y: 40 },
  ]);
});

describe("buildWeeklyFunnel", () => {
  it("assemble Umami et base sur la semaine du rapport", async () => {
    const countDb = jest.fn().mockResolvedValue(db);
    const funnel = await buildWeeklyFunnel(config, week, countDb);
    expect(countDb).toHaveBeenCalledWith(new Date(week.startAt), new Date(week.endAt));
    expect(fetchUmamiPathMetrics).toHaveBeenCalledWith(config, week.startAt, week.endAt, 10, "/abonnement");
    expect(funnel).toEqual({
      vuesAbonnement: 9,
      mursVus: 12,
      clicsAbonnement: 5,
      echecsInscription: 1,
      db,
      warnings: [],
    });
  });

  it("ne lève jamais : source illisible = n.d. et avertissement", async () => {
    fetchUmamiMetrics.mockRejectedValue(new Error("HTTP 500"));
    const funnel = await buildWeeklyFunnel(config, week, jest.fn().mockRejectedValue(new Error("base KO")));
    expect(funnel.mursVus).toBeNull();
    expect(funnel.db).toBeNull();
    expect(funnel.vuesAbonnement).toBe(9);
    expect(funnel.warnings).toEqual(["événements Umami : HTTP 500", "base : base KO"]);
    const html = buildFunnelSectionHtml(funnel);
    expect(html).toContain("Section partielle");
    expect(html).toContain("n.d.");
  });
});

describe("buildFunnelSectionHtml", () => {
  it("les 6 chiffres demandés, en absolu, revenu en euros", async () => {
    const html = buildFunnelSectionHtml(await buildWeeklyFunnel(config, week, async () => db));
    for (const label of [
      "Vues de /abonnement",
      "Comptes créés",
      "Paiements reçus (Stripe)",
      "Résiliations effectives",
      "Abonnés actifs",
      "Revenu mensuel récurrent",
    ]) {
      expect(html).toContain(label);
    }
    expect(html).toContain("5,07 €");
    expect(html).not.toContain("Section partielle");
    expect(html).not.toContain("—");
  });
});

describe("conversion de l'admin hors anciens comptes gratuits", () => {
  it("exclut les comptes FREE antérieurs à la fin du compte gratuit", () => {
    // 13 comptes dont 11 anciens gratuits : 2 abonnés sur 2 comptes récents = 100 %.
    expect(conversionHorsAnciensComptes(2, 13, 11)).toBe("100.0");
    expect(conversionHorsAnciensComptes(1, 15, 11)).toBe("25.0");
    expect(conversionHorsAnciensComptes(0, 11, 11)).toBe("0.0");
  });

  it("date de coupure = déploiement s15 (06/10/2026 07:45, Paris)", () => {
    expect(LEGACY_FREE_CUTOFF.toISOString()).toBe("2026-10-06T05:45:00.000Z");
  });
});
