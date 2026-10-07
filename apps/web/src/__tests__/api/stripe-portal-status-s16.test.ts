/**
 * @jest-environment node
 *
 * s16 (07/10/2026), reco 3 : un abonné en impayé (PAST_DUE) garde l'accès au
 * portail Stripe (changer de carte) et /api/stripe/status expose l'état de
 * l'abonnement pour /profil (lot B). Reco 8 : clés d'alerte `auth-` et `email-`
 * en classe A.
 */
const getServerSession = jest.fn();
jest.mock("next-auth", () => ({ getServerSession: (...a: unknown[]) => getServerSession(...a) }));
jest.mock("@/lib/auth", () => ({ authOptions: {} }));
const createPortalSession = jest.fn();
jest.mock("@/lib/stripe", () => ({ createPortalSession: (...a: unknown[]) => createPortalSession(...a) }));
const prisma = { user: { findUnique: jest.fn() }, subscription: { findUnique: jest.fn() } };
jest.mock("@/lib/prisma", () => ({
  get prisma() {
    return prisma;
  },
}));

import { POST as portal } from "@/app/api/stripe/portal/route";
import { GET as status } from "@/app/api/stripe/status/route";
import { classerAlerte, recordAuthFailureAlert, type AlertDb } from "@/lib/admin-alerts";

beforeEach(() => {
  jest.clearAllMocks();
  getServerSession.mockResolvedValue({ user: { id: "user-1" } });
  createPortalSession.mockResolvedValue("https://billing.stripe.com/p/1");
});

describe("portail Stripe", () => {
  it("compte FREE en impayé avec client Stripe : portail ouvert (aucune condition de plan)", async () => {
    prisma.subscription.findUnique.mockResolvedValue({ stripeCustomerId: "cus_1" });
    const res = await portal();
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ url: "https://billing.stripe.com/p/1" });
    expect(prisma.user.findUnique).not.toHaveBeenCalled();
  });

  it("sans client Stripe : 404 avec un message humain", async () => {
    prisma.subscription.findUnique.mockResolvedValue(null);
    const res = await portal();
    expect(res.status).toBe(404);
    expect((await res.json()).error).toMatch(/contact@deviens-marrant\.fr/);
  });

  it("panne Stripe : 500 sans « Erreur serveur »", async () => {
    prisma.subscription.findUnique.mockResolvedValue({ stripeCustomerId: "cus_1" });
    createPortalSession.mockRejectedValue(new Error("down"));
    jest.spyOn(console, "error").mockImplementation(() => {});
    const res = await portal();
    expect(res.status).toBe(500);
    expect((await res.json()).error).not.toBe("Erreur serveur");
  });
});

describe("GET /api/stripe/status", () => {
  it("impayé : Premium conservé, paymentIssue, portail disponible, dates", async () => {
    prisma.user.findUnique.mockResolvedValue({ plan: "PREMIUM" });
    prisma.subscription.findUnique.mockResolvedValue({
      status: "PAST_DUE",
      stripeCustomerId: "cus_1",
      billingInterval: "month",
      priceAmountCents: 299,
      currentPeriodEnd: new Date("2026-11-07T00:00:00Z"),
      cancelAtPeriodEnd: false,
    });
    const res = await status();
    expect(await res.json()).toEqual({
      plan: "PREMIUM",
      subscriptionStatus: "PAST_DUE",
      paymentIssue: true,
      portalAvailable: true,
      billingInterval: "month",
      priceAmountCents: 299,
      currentPeriodEnd: "2026-11-07T00:00:00.000Z",
      cancelAtPeriodEnd: false,
    });
  });

  it("aucun abonnement : champs neutres, compatibles avec l'existant ({ plan })", async () => {
    prisma.user.findUnique.mockResolvedValue({ plan: "FREE" });
    prisma.subscription.findUnique.mockResolvedValue(null);
    const body = await (await status()).json();
    expect(body).toMatchObject({ plan: "FREE", subscriptionStatus: null, paymentIssue: false, portalAvailable: false });
  });

  it("visiteur : 401", async () => {
    getServerSession.mockResolvedValue(null);
    expect((await status()).status).toBe(401);
  });
});

describe("alertes classe A (s16)", () => {
  it.each(["auth-connexion-google", "email-envoi-reinitialisation", "stripe-reconciliation", "paiement-activation-echec"])(
    "%s : classe A",
    (cle) => expect(classerAlerte(cle).classe).toBe("A"),
  );

  it("abonnement-impaye : classe B (information, aucune action de Thomas)", () => {
    expect(classerAlerte("abonnement-impaye").classe).toBe("B");
  });

  it("recordAuthFailureAlert : clé auth-connexion-google, code nettoyé", async () => {
    const upsert = jest.fn().mockResolvedValue({});
    const db = { ceoMemory: { findUnique: jest.fn().mockResolvedValue(null), upsert, findMany: jest.fn(), deleteMany: jest.fn() } };
    jest.spyOn(console, "warn").mockImplementation(() => {});
    await expect(recordAuthFailureAlert("OAuthCallback<script>", "", db as unknown as AlertDb)).resolves.toBe(true);
    const value = upsert.mock.calls[0][0].create.value;
    expect(value.cle).toBe("auth-connexion-google");
    expect(value.classe).toBe("A");
    expect(value.sujet).toBe("Connexion Google en échec (OAuthCallbackscript)");
  });
});
