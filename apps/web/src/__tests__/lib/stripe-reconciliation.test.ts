/**
 * @jest-environment node
 *
 * s16 (07/10/2026, reco 8) : réconciliation quotidienne Stripe ↔ base
 * (lib/billing/stripe-reconciliation.ts) et son job planifié (4h UTC, verrou
 * du jour conservé après succès). Stripe et base entièrement simulés.
 */
const tryAcquireLock = jest.fn();
const releaseLock = jest.fn();
jest.mock("@/lib/job-lock", () => ({
  tryAcquireLock: (...a: unknown[]) => tryAcquireLock(...a),
  releaseLock: (...a: unknown[]) => releaseLock(...a),
  buildJobLockKey: (name: string) => `${name}:key`,
}));
jest.mock("@/lib/prisma", () => ({ prisma: { tag: "prisma" } }));
jest.mock("@/lib/stripe", () => ({ getStripe: () => ({ tag: "stripe" }) }));
const runStripeReconciliationMock = jest.fn();
jest.mock("@/lib/billing/stripe-reconciliation", () => {
  const actual = jest.requireActual("@/lib/billing/stripe-reconciliation");
  return { ...actual, runStripeReconciliation: (...a: unknown[]) => runStripeReconciliationMock(...a) };
});

import { createSchedulerJobs } from "@/lib/scheduler/jobs";

const actual = jest.requireActual("@/lib/billing/stripe-reconciliation") as typeof import("@/lib/billing/stripe-reconciliation");

function iterable<T>(items: T[]) {
  return {
    async *[Symbol.asyncIterator]() {
      yield* items;
    },
  };
}

function deps(opts: {
  subs: Array<{ id: string; status: string; customer: string }>;
  rows: Array<{ userId: string; stripeSubscriptionId: string | null; status: string }>;
  premium: string[];
  events?: Array<{ id: string; type: string; created: number }>;
}) {
  const record = jest.fn().mockResolvedValue(true);
  const eventsList = jest.fn().mockReturnValue(iterable(opts.events ?? []));
  return {
    record,
    eventsList,
    deps: {
      stripe: {
        subscriptions: { list: jest.fn().mockReturnValue(iterable(opts.subs)) },
        events: { list: eventsList },
      } as never,
      db: {
        subscription: { findMany: jest.fn().mockResolvedValue(opts.rows.map((r) => ({ stripeCustomerId: null, ...r }))) },
        user: { findMany: jest.fn().mockResolvedValue(opts.premium.map((id) => ({ id }))) },
      },
      record,
    },
  };
}

const NOW = new Date("2026-10-08T04:05:00Z");

describe("runStripeReconciliation", () => {
  it("base et Stripe d'accord : aucune alerte", async () => {
    const d = deps({
      subs: [{ id: "sub_1", status: "active", customer: "cus_1" }, { id: "sub_old", status: "canceled", customer: "cus_2" }],
      rows: [{ userId: "u1", stripeSubscriptionId: "sub_1", status: "ACTIVE" }],
      premium: ["u1"],
    });
    const res = await actual.runStripeReconciliation(NOW, d.deps);
    expect(res.payeSansPremium).toEqual([]);
    expect(res.premiumSansAbonnement).toEqual([]);
    expect(d.record).not.toHaveBeenCalled();
    // Livraisons webhook : 3 derniers jours, échecs seulement
    expect(d.eventsList).toHaveBeenCalledWith(
      expect.objectContaining({ delivery_success: false, created: { gte: Math.floor(NOW.getTime() / 1000) - 3 * 86_400 } }),
    );
  });

  it("payé sans Premium, Premium sans abonnement, doublon : une alerte A stripe-reconciliation", async () => {
    const d = deps({
      subs: [
        { id: "sub_paye", status: "active", customer: "cus_1" },
        { id: "sub_impaye", status: "past_due", customer: "cus_1" },
      ],
      rows: [
        { userId: "u1", stripeSubscriptionId: "sub_paye", status: "ACTIVE" },
        { userId: "u2", stripeSubscriptionId: "sub_resilie", status: "ACTIVE" },
      ],
      premium: ["u2"],
    });
    const res = await actual.runStripeReconciliation(NOW, d.deps);
    expect(res.payeSansPremium).toHaveLength(2);
    expect(res.premiumSansAbonnement).toEqual(["utilisateur u2"]);
    expect(res.doublons).toEqual(["client cus_1 : sub_paye, sub_impaye"]);
    expect(d.record).toHaveBeenCalledTimes(1);
    expect(d.record.mock.calls[0][0].cle).toBe("stripe-reconciliation");
  });

  it("événements non livrés : alerte A stripe-webhook-livraison", async () => {
    const d = deps({ subs: [], rows: [], premium: [], events: [{ id: "evt_1", type: "checkout.session.completed", created: 1_791_000_000 }] });
    const res = await actual.runStripeReconciliation(NOW, d.deps);
    expect(res.evenementsNonLivres).toHaveLength(1);
    expect(d.record).toHaveBeenCalledWith(expect.objectContaining({ cle: "stripe-webhook-livraison" }));
  });
});

describe("runStripeReconciliationJob (planificateur)", () => {
  const { runStripeReconciliationJob } = createSchedulerJobs(jest.fn());

  beforeEach(() => {
    jest.clearAllMocks();
    tryAcquireLock.mockResolvedValue(true);
    runStripeReconciliationMock.mockResolvedValue({
      stripeEnCours: 0,
      payeSansPremium: [],
      premiumSansAbonnement: [],
      doublons: [],
      evenementsNonLivres: [],
    });
    process.env.STRIPE_SECRET_KEY = "sk_live_abcdefghijklmnop";
  });

  it("hors fenêtre 4h UTC : rien", async () => {
    await runStripeReconciliationJob(new Date("2026-10-08T05:00:00Z"));
    expect(tryAcquireLock).not.toHaveBeenCalled();
  });

  it("clé Stripe absente : rien", async () => {
    process.env.STRIPE_SECRET_KEY = "";
    await runStripeReconciliationJob(NOW);
    expect(tryAcquireLock).not.toHaveBeenCalled();
  });

  it("4h UTC : verrou du jour, réconciliation, verrou CONSERVÉ (une passe par jour)", async () => {
    await runStripeReconciliationJob(NOW);
    expect(tryAcquireLock).toHaveBeenCalledWith("stripe-reconciliation:key", 2 * 60 * 60 * 1000);
    expect(runStripeReconciliationMock).toHaveBeenCalledWith(NOW, { stripe: { tag: "stripe" }, db: { tag: "prisma" } });
    expect(releaseLock).not.toHaveBeenCalled();
  });

  it("échec : verrou relâché pour retenter au tick suivant, le tick ne casse pas", async () => {
    runStripeReconciliationMock.mockRejectedValue(new Error("stripe down"));
    const spy = jest.spyOn(console, "error").mockImplementation(() => {});
    await expect(runStripeReconciliationJob(NOW)).resolves.toBeUndefined();
    expect(releaseLock).toHaveBeenCalledWith("stripe-reconciliation:key");
    spy.mockRestore();
  });
});
