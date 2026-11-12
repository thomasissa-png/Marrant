/**
 * @jest-environment node
 *
 * s24 lot 0 (QA tour 1, correction 10) : un achat dans l'application (RevenueCat, INITIAL_PURCHASE)
 * écrit aussi la ligne `souscription` (détail `iap`, heure de l'événement, clé stable au rejeu).
 * Renouvellement : pas une souscription. Écriture en échec : 200 et Premium activé.
 */
const usageCreate = jest.fn();
const prismaMock = {
  webhookEvent: { findUnique: jest.fn().mockResolvedValue(null), create: jest.fn().mockResolvedValue({}) },
  user: { update: jest.fn().mockResolvedValue({}) },
  usageEvent: { create: (...a: unknown[]) => usageCreate(...a) },
  $transaction: jest.fn(),
};
jest.mock("@/lib/prisma", () => ({ prisma: prismaMock }));
jest.mock("@/lib/lettre/hebdo", () => ({ finPremiumLettreHebdo: jest.fn() }));

import type { NextRequest } from "next/server";

process.env.REVENUECAT_WEBHOOK_SECRET = "secret-factice-revenuecat";
const { POST } = require("@/app/api/iap/revenuecat-webhook/route") as { POST: (r: NextRequest) => Promise<Response> };

const livrer = (type: string, id = `rc_${Math.random()}`) =>
  POST(
    new Request("http://localhost/api/iap/revenuecat-webhook", {
      method: "POST",
      headers: { authorization: "Bearer secret-factice-revenuecat" },
      body: JSON.stringify({ event: { id, type, app_user_id: "user-iap", event_timestamp_ms: 1_762_000_000_000 } }),
    }) as unknown as NextRequest,
  );

beforeEach(() => {
  usageCreate.mockReset().mockResolvedValue({});
  jest.spyOn(console, "warn").mockImplementation(() => undefined);
});
afterEach(() => jest.restoreAllMocks());

it("INITIAL_PURCHASE : Premium et une ligne souscription « iap » à l'heure de l'événement", async () => {
  expect((await livrer("INITIAL_PURCHASE")).status).toBe(200);
  expect(prismaMock.user.update).toHaveBeenCalledWith(expect.objectContaining({ data: { plan: "PREMIUM" } }));
  expect(usageCreate).toHaveBeenCalledWith({
    data: {
      userId: "user-iap",
      type: "souscription",
      detail: "iap",
      occurredAt: new Date(1_762_000_000_000),
      dedupKey: "souscription:user-iap:1762000000",
    },
  });
});

it("RENEWAL : pas une souscription", async () => {
  await livrer("RENEWAL");
  expect(usageCreate).not.toHaveBeenCalled();
});

it("écriture en échec : 200", async () => {
  usageCreate.mockRejectedValue(new Error("table absente"));
  expect((await livrer("INITIAL_PURCHASE")).status).toBe(200);
});
