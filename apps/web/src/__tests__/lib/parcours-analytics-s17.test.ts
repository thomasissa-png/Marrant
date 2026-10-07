/**
 * @jest-environment node
 *
 * s17 (lot A, data-analyst §6 et §7) : bloc « Parcours » du rapport du lundi,
 * 3 alertes des parcours, exclusion des comptes de test.
 */
const fetchUmamiMetrics = jest.fn();
const fetchUmamiPathMetrics = jest.fn();
jest.mock("@/lib/analytics/umami", () => ({
  fetchUmamiMetrics: (...a: unknown[]) => fetchUmamiMetrics(...a),
  fetchUmamiPathMetrics: (...a: unknown[]) => fetchUmamiPathMetrics(...a),
  getUmamiConfig: () => ({ apiKey: "k", websiteId: "w" }),
}));

import { emailsExclus } from "@/lib/analytics/comptes-test";
import { buildParcoursSectionHtml, buildWeeklyParcours, type ParcoursDbCounts } from "@/lib/analytics/weekly-parcours";
import { abonnesSansDemarrage, runParcoursAlertes, suiviMuetActif, type AlertesParcoursDb } from "@/lib/analytics/parcours-alertes";

const CONFIG = { apiKey: "k", websiteId: "w" };
const WINDOW = { startAt: Date.parse("2026-09-28T00:00:00Z"), endAt: Date.parse("2026-10-05T00:00:00Z") };

const COUNTS: ParcoursDbCounts = {
  activation: { eligibles: 2, actives48h: 1 },
  passage: [
    { slug: "repartie", etape: 1, ontValide: 2 },
    { slug: "repartie", etape: 2, ontValide: 1 },
  ],
  completion: [{ slug: "repartie", commences: 2, termines: 1, medianeJours: 9.5 }],
  suivant: { finis: 1, autreDemarre: 0 },
  rythme: { abonnes: 1, semainesActives: 2, semainesEcoulees: 3 },
  retourJ7: { eligibles: 2, revenus: 1 },
  validationsSemaine: 3,
};

beforeEach(() => {
  jest.clearAllMocks();
  fetchUmamiPathMetrics.mockResolvedValue([
    { x: "/parcours", y: 4 },
    { x: "/parcours/repartie", y: 6 },
    { x: "/blog/x", y: 50 },
  ]);
  fetchUmamiMetrics.mockResolvedValue([
    { x: "parcours-ouvert", y: 5 },
    { x: "parcours-etape", y: 2 },
    { x: "abonnement-clic", y: 9 },
  ]);
});

describe("comptes de test (ANALYTICS_EMAILS_EXCLUS)", () => {
  it("liste séparée par virgules ou espaces, casse ignorée, doublons retirés", () => {
    expect(emailsExclus({ ANALYTICS_EMAILS_EXCLUS: "A@x.fr, b@y.fr\nA@X.fr pasunmail" })).toEqual(["a@x.fr", "b@y.fr"]);
    expect(emailsExclus({})).toEqual([]);
  });
});

describe("bloc « Parcours » du lundi", () => {
  it("transmet la liste d'exclusion aux requêtes et somme les vues /parcours*", async () => {
    const countDb = jest.fn().mockResolvedValue(COUNTS);
    const w = await buildWeeklyParcours(CONFIG, WINDOW, countDb, ["test@x.fr"]);
    expect(countDb).toHaveBeenCalledWith(new Date(WINDOW.startAt), new Date(WINDOW.endAt), ["test@x.fr"]);
    expect(w.pagesVues).toBe(10);
    expect(w.events?.["parcours-ouvert"]).toBe(5);
  });

  it("HTML : nombres ET dénominateurs, jamais de pourcentage, écart base/Umami", async () => {
    const html = buildParcoursSectionHtml(await buildWeeklyParcours(CONFIG, WINDOW, jest.fn().mockResolvedValue(COUNTS), []));
    expect(html).toContain("Parcours de la semaine");
    expect(html).toContain("1 sur 2"); // activation
    expect(html).toContain("1→2 : 1 sur 2");
    expect(html).toContain("médiane 9,5 j");
    expect(html).toContain("2 sur 3 (1 abonné(s))");
    expect(html).toContain("3 / 2 (écart 1)");
    expect(html.replace(/<[^>]+>/g, "")).not.toContain("%");
    expect(html).not.toContain("—");
  });

  it("source en panne : n.d. et avertissement, jamais d'exception", async () => {
    fetchUmamiMetrics.mockRejectedValue(new Error("Umami 500"));
    const w = await buildWeeklyParcours(CONFIG, WINDOW, jest.fn().mockRejectedValue(new Error("base froide")), []);
    expect(w.db).toBeNull();
    expect(w.events).toBeNull();
    const html = buildParcoursSectionHtml(w);
    expect(html).toContain("n.d.");
    expect(html).toContain("Section partielle");
  });
});

describe("alertes des parcours (§7)", () => {
  const NOW = new Date("2026-10-08T04:05:00Z");
  const db = (rows: Array<{ createdAt: Date; user: { email: string } }>) =>
    ({ subscription: { findMany: jest.fn().mockResolvedValue(rows) } }) as unknown as AlertesParcoursDb;

  it("sans démarrage : fenêtre 72-96 h, aucune étape, comptes de test exclus", async () => {
    const d = db([
      { createdAt: new Date("2026-10-04T10:00:00Z"), user: { email: "vrai@x.fr" } },
      { createdAt: new Date("2026-10-04T11:00:00Z"), user: { email: "TEST@x.fr" } },
    ]);
    const dates = await abonnesSansDemarrage(d, NOW, ["test@x.fr"]);
    expect(dates).toHaveLength(1);
    const where = (d.subscription.findMany as jest.Mock).mock.calls[0][0].where;
    expect(where.createdAt.gte.toISOString()).toBe("2026-10-04T04:05:00.000Z");
    expect(where.createdAt.lt.toISOString()).toBe("2026-10-05T04:05:00.000Z");
    expect(where.user.pathStepCompletions).toEqual({ none: {} });
  });

  it("enregistre l'alerte de classe B sans e-mail ni identifiant", async () => {
    const record = jest.fn().mockResolvedValue(true);
    await runParcoursAlertes(NOW, { db: db([{ createdAt: new Date("2026-10-04T10:00:00Z"), user: { email: "vrai@x.fr" } }]), umami: null, record });
    expect(record).toHaveBeenCalledTimes(1);
    const arg = record.mock.calls[0][0];
    expect(arg.cle).toBe("parcours-sans-demarrage");
    expect(JSON.stringify(arg)).not.toContain("vrai@x.fr");
  });

  it("suivi muet : inactif sans date de mise en ligne ou avant 7 jours", () => {
    expect(suiviMuetActif(NOW, {})).toBe(false);
    expect(suiviMuetActif(NOW, { PARCOURS_SUIVI_ACTIF_DEPUIS: "2026-10-05" })).toBe(false);
    expect(suiviMuetActif(NOW, { PARCOURS_SUIVI_ACTIF_DEPUIS: "2026-09-30" })).toBe(true);
  });

  it("suivi muet : ≥ 5 vues /parcours/<slug> et 0 parcours-ouvert → alerte", async () => {
    process.env.PARCOURS_SUIVI_ACTIF_DEPUIS = "2026-09-01";
    fetchUmamiMetrics.mockResolvedValue([{ x: "abonnement-clic", y: 1 }]);
    const record = jest.fn().mockResolvedValue(true);
    const res = await runParcoursAlertes(NOW, { db: db([]), umami: CONFIG, record });
    expect(res.suiviMuet).toBe(true);
    expect(record).toHaveBeenCalledWith(expect.objectContaining({ cle: "parcours-suivi-muet" }));
    delete process.env.PARCOURS_SUIVI_ACTIF_DEPUIS;
  });
});
