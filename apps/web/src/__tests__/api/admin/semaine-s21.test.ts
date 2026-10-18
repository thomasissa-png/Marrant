/**
 * @jest-environment node
 *
 * GET /api/admin/semaine (s21, 18/10) : onglet « Semaine » de l'admin, mêmes
 * fonctions et même semaine que le rapport du lundi. Auth Bearer ADMIN_PASSWORD,
 * sections indépendantes (Umami absent : la base reste lue), comptes de test
 * exclus, aucune empreinte IP.
 */
const buildWeeklyVisitsReport = jest.fn();
jest.mock("@/lib/analytics/weekly-visits-report", () => ({
  buildWeeklyVisitsReport: (...a: unknown[]) => buildWeeklyVisitsReport(...a),
}));

const queryRaw = jest.fn();
const subscriptionCount = jest.fn();
const userCount = jest.fn();
const subscriptionFindMany = jest.fn();
let lettreAbsente = false;
const absente = () => Object.assign(new Error("relation \"NewsletterIssue\" does not exist"), { code: "P2021" });

jest.mock("@/lib/prisma", () => ({
  prisma: {
    user: {
      count: (a: unknown) => userCount(a),
      findMany: () => Promise.resolve([{ id: "compte-test" }]),
    },
    webhookEvent: {
      count: ({ where }: { where: { eventType: string } }) =>
        Promise.resolve({ "invoice.payment_succeeded": 2, "checkout.session.completed": 1, "customer.subscription.deleted": 1 }[where.eventType] ?? 0),
    },
    subscription: {
      count: (a: unknown) => subscriptionCount(a),
      findMany: (a: unknown) => subscriptionFindMany(a),
    },
    $queryRaw: (...a: unknown[]) => queryRaw(...a),
    joke: { count: () => Promise.resolve(5) },
    tip: { count: () => Promise.resolve(40) },
    video: { count: () => Promise.resolve(10) },
    dailyContent: {
      count: () => Promise.resolve(2),
      findFirst: () => Promise.resolve({ jokeId: "j", tipId: "t", videoId: null }),
    },
    socialPost: { findMany: () => Promise.resolve([]) },
    newsletterSubscriber: {
      groupBy: () => Promise.resolve([{ source: "quiz", status: "CONFIRMED", _count: { _all: 4 } }]),
      count: ({ where }: { where: { email: { in?: string[] } } }) => Promise.resolve(where.email.in ? 1 : 0),
    },
    newsletterIssue: {
      findFirst: () => (lettreAbsente ? Promise.reject(absente()) : Promise.resolve(null)),
      count: () => (lettreAbsente ? Promise.reject(absente()) : Promise.resolve(0)),
      findMany: () => (lettreAbsente ? Promise.reject(absente()) : Promise.resolve([])),
    },
  },
}));

import { NextRequest } from "next/server";
import { GET } from "@/app/api/admin/semaine/route";
import { computeReportPeriods } from "@/lib/analytics/weekly-visits-period";

const req = (qs = "", auth: string | null = "Bearer secret") =>
  new NextRequest(`https://deviens-marrant.fr/api/admin/semaine${qs}`, { headers: auth ? { authorization: auth } : {} });

beforeEach(() => {
  process.env.ADMIN_PASSWORD = "secret";
  process.env.ANALYTICS_EMAILS_EXCLUS = "test@marrant.fr";
  delete process.env.UMAMI_API_KEY;
  delete process.env.UMAMI_WEBSITE_ID;
  delete process.env.CONTENT_GENERATION_ENABLED;
  lettreAbsente = false;
  buildWeeklyVisitsReport.mockReset();
  queryRaw.mockReset().mockResolvedValue([]);
  userCount.mockReset().mockResolvedValue(3);
  subscriptionFindMany.mockReset().mockResolvedValue([
    { billingInterval: "month", priceAmountCents: 499 },
    { billingInterval: "month", priceAmountCents: 499 },
    { billingInterval: "year", priceAmountCents: 3999 },
  ]);
  // PAST_DUE : 1 ; abonnement du compte de test créé sur la période : 1 ; le reste : 0.
  subscriptionCount.mockReset().mockImplementation(({ where }: { where: { status?: string; userId?: { in?: string[] }; createdAt?: unknown } }) =>
    Promise.resolve(where.status === "PAST_DUE" ? 1 : where.userId?.in && where.createdAt ? 1 : 0),
  );
  jest.spyOn(console, "warn").mockImplementation(() => undefined);
  jest.spyOn(console, "error").mockImplementation(() => undefined);
});

const fetchOrigine = global.fetch;
afterEach(() => {
  global.fetch = fetchOrigine;
});

afterAll(() => {
  delete process.env.ANALYTICS_EMAILS_EXCLUS;
});

describe("GET /api/admin/semaine", () => {
  it("401 sans authentification ou avec un mauvais mot de passe ; 500 sans ADMIN_PASSWORD", async () => {
    expect((await GET(req("", null))).status).toBe(401);
    expect((await GET(req("", "Bearer faux"))).status).toBe(401);
    delete process.env.ADMIN_PASSWORD;
    expect((await GET(req())).status).toBe(500);
    expect(buildWeeklyVisitsReport).not.toHaveBeenCalled();
  });

  it("Umami absent : visites indisponibles, chiffres de la base lus par les fonctions du rapport", async () => {
    const res = await GET(req());
    expect(res.status).toBe(200);
    const s = await res.json();
    expect(s.visites).toBeNull();
    expect(s.visitesErreur).toMatch(/Umami non configuré/);
    expect(buildWeeklyVisitsReport).not.toHaveBeenCalled();
    expect(s.funnel.db).toMatchObject({
      comptesCrees: 3,
      // 2 paiements et 1 nouvel abonné Stripe, dont celui du compte de test : retiré.
      paiements: 1,
      nouveauxAbonnes: 0,
      resiliations: 1,
      comptesTestExclus: 1,
      abonnesActifs: 3,
      parFormule: { mensuel: 2, annuel: 1, inconnu: 0 },
    });
    // Ligne identique à l'e-mail du lundi.
    expect(s.lignes.funnel).toContainEqual(["Abonnés actifs (aujourd'hui)", "3 (2 mensuels, 1 annuel)"]);
    expect(s.funnel.mursVus).toBeNull();
    expect(s.stock).toMatchObject({ etat: "ok", coverage: { jokeDaysLeft: 7, tipDaysLeft: 42, status: "stale" } });
    expect(s.alertes.map((a: { texte: string }) => a.texte)).toEqual(
      expect.arrayContaining([expect.stringMatching(/Nouveau lot à préparer/), expect.stringMatching(/1 abonnement\(s\) impayé/)]),
    );
  });

  it("même semaine que l'e-mail du dernier lundi ; « glissante » = 7 derniers jours", async () => {
    buildWeeklyVisitsReport.mockRejectedValue(new Error("HTTP 503"));
    process.env.UMAMI_API_KEY = "cle-umami-test";
    process.env.UMAMI_WEBSITE_ID = "site-test";
    global.fetch = jest.fn().mockRejectedValue(new Error("réseau coupé")) as unknown as typeof fetch;
    const s = await (await GET(req())).json();
    const ancre = buildWeeklyVisitsReport.mock.calls[0][0] as Date;
    expect(s.periode.label).toBe(computeReportPeriods(ancre).current.label);
    expect(new Intl.DateTimeFormat("fr-FR", { timeZone: "Europe/Paris", weekday: "long", hour: "numeric" }).format(ancre)).toBe("lundi 07 h");
    expect(s.visitesErreur).toBe("Umami : HTTP 503");
    expect(s.funnel.db.comptesCrees).toBe(3);

    const g = await (await GET(req("?periode=glissante"))).json();
    expect(g.mode).toBe("glissante");
    expect(g.periode.label).toBe(computeReportPeriods(new Date()).current.label);
  });

  it("comptes de test exclus des abonnés actifs, du revenu, des comptes créés et des résiliations programmées", async () => {
    await GET(req());
    expect(userCount).toHaveBeenCalledWith({ where: expect.objectContaining({ id: { notIn: ["compte-test"] } }) });
    expect(subscriptionFindMany).toHaveBeenCalledWith(expect.objectContaining({ where: { status: "ACTIVE", userId: { notIn: ["compte-test"] } } }));
    expect(subscriptionCount).toHaveBeenCalledWith({ where: { status: "ACTIVE", cancelAtPeriodEnd: true, userId: { notIn: ["compte-test"] } } });
  });

  it("comptes de test exclus (parcours et lettre), aucune empreinte IP dans la réponse", async () => {
    const texte = await (await GET(req())).text();
    const s = JSON.parse(texte);
    const valeurs = queryRaw.mock.calls.flatMap((c) => (c[0] as { values: unknown[] }).values);
    expect(valeurs).toContainEqual(["test@marrant.fr"]);
    expect(s.lettre).toMatchObject({ etat: "ok", statuts: { confirmes: 4 }, comptesTestExclus: 1 });
    expect(texte).not.toMatch(/ipAddress|empreinte|Token/);
  });

  it("sans la migration 14 : section lettre lisible, numéros null", async () => {
    lettreAbsente = true;
    const s = await (await GET(req())).json();
    expect(s.lettre.etat).toBe("ok");
    expect(s.lettre.numeros).toBeNull();
  });
});
