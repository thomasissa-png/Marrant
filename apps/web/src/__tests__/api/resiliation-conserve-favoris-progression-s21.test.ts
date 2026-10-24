/**
 * @jest-environment node
 *
 * Preuve de la FAQ « Et si j'arrête ? » (textes-trajet-v3 Q01, arbitrage 4 du tour 3) : « Tes favoris
 * et ta progression restent enregistrés. » Si ce test tombe, la dernière phrase de Q01 est retirée.
 *
 * 1. Fin d'abonnement par le webhook Stripe (`customer.subscription.deleted`, puis
 *    `customer.subscription.updated` en `unpaid`) sur une base simulée AVEC état : après la
 *    rétrogradation (plan FREE, abonnement CANCELED), les lignes `userFavorite` et
 *    `userPathStepCompletion` existent toujours, et aucune méthode de ces deux tables n'a été appelée.
 * 2. Garde-fou du code : seules la suppression du compte par la personne (`lib/account.ts`) et le
 *    retrait d'un favori par la personne (`api/favorites/[id]`) suppriment ces lignes ; aucun cron,
 *    aucun webhook.
 */
import { readdirSync, readFileSync, statSync } from "fs";
import { join, relative } from "path";

const constructEvent = jest.fn();
jest.mock("@/lib/stripe", () => ({
  stripe: {
    webhooks: { constructEvent: (...a: unknown[]) => constructEvent(...a) },
    subscriptions: { retrieve: jest.fn(), list: jest.fn() },
    invoices: { retrieve: jest.fn() },
    charges: { retrieve: jest.fn() },
  },
  cancelStripeSubscriptionNow: jest.fn(),
}));
jest.mock("next/headers", () => ({ headers: async () => new Map([["stripe-signature", "sig_test"]]) }));
jest.mock("@/lib/admin-alerts", () => ({ ...jest.requireActual("@/lib/admin-alerts"), recordAdminAlert: jest.fn().mockResolvedValue(true) }));
jest.mock("@/lib/emails/paiement-notifications", () => ({
  notifySubscriptionConfirmed: jest.fn().mockResolvedValue(true),
  notifyPaymentFailed: jest.fn().mockResolvedValue(true),
  notifyCancellationScheduled: jest.fn().mockResolvedValue(true),
}));

type Ligne = Record<string, unknown>;
const base: Record<string, Ligne[]> = {};
const appelsProteges: string[] = [];
const PROTEGEES = new Set(["userFavorite", "userPathStepCompletion"]);

function trouver(table: string, where: Ligne): Ligne | undefined {
  return base[table]?.find((l) => Object.entries(where).every(([k, v]) => l[k] === v));
}

/** Base simulée avec état : lecture, mise à jour, création ; tout appel aux tables protégées est relevé. */
const prisma = new Proxy({} as Record<string, unknown>, {
  get(_cible, nom: string) {
    if (nom === "$transaction") return async (ops: Promise<unknown>[]) => Promise.all(ops);
    return new Proxy({} as Record<string, unknown>, {
      get(_m, methode: string) {
        return async (args: { where?: Ligne; data?: Ligne } = {}) => {
          if (PROTEGEES.has(nom)) appelsProteges.push(`${nom}.${methode}`);
          const table = (base[nom] ??= []);
          if (methode === "findUnique" || methode === "findFirst") return trouver(nom, args.where ?? {}) ?? null;
          if (methode === "findMany") return table.filter((l) => Object.entries(args.where ?? {}).every(([k, v]) => l[k] === v));
          if (methode === "update") {
            const l = trouver(nom, args.where ?? {});
            if (!l) throw new Error(`${nom} introuvable`);
            Object.assign(l, args.data);
            return l;
          }
          if (methode === "create") {
            table.push({ ...(args.data ?? {}) });
            return args.data;
          }
          if (methode === "delete" || methode === "deleteMany") {
            base[nom] = table.filter((l) => !Object.entries(args.where ?? {}).every(([k, v]) => l[k] === v));
            return { count: table.length - base[nom].length };
          }
          return null;
        };
      },
    });
  },
});
jest.mock("@/lib/prisma", () => ({
  get prisma() {
    return prisma;
  },
}));

import { NextRequest } from "next/server";
import { POST } from "@/app/api/stripe/webhook/route";

function semer() {
  for (const k of Object.keys(base)) delete base[k];
  appelsProteges.length = 0;
  base.user = [{ id: "user-1", plan: "PREMIUM" }];
  base.subscription = [{ id: "db_sub_1", userId: "user-1", stripeSubscriptionId: "sub_1", stripeCustomerId: "cus_1", status: "ACTIVE" }];
  base.userFavorite = [
    { id: "fav-1", userId: "user-1", contentType: "JOKE", jokeId: "j1" },
    { id: "fav-2", userId: "user-1", contentType: "TIP", tipId: "t1" },
  ];
  base.userPathStepCompletion = [
    { id: "c-1", userId: "user-1", stepId: "s1" },
    { id: "c-2", userId: "user-1", stepId: "s2" },
  ];
  base.webhookEvent = [];
}

async function livrer(type: string, objet: unknown) {
  constructEvent.mockReturnValue({ id: `evt_${Math.random()}`, type, data: { object: objet } });
  return POST(new NextRequest("http://localhost/api/stripe/webhook", { method: "POST", body: "{}" }));
}

const abonnementStripe = (status: string) => ({
  id: "sub_1",
  status,
  current_period_end: 1_791_072_000,
  cancel_at_period_end: false,
  items: { data: [{ price: { unit_amount: 299, recurring: { interval: "month" } } }] },
});

beforeEach(() => {
  semer();
  process.env.STRIPE_WEBHOOK_SECRET = "whsec_test";
  jest.spyOn(console, "log").mockImplementation(() => {});
  jest.spyOn(console, "error").mockImplementation(() => {});
});

describe("fin d'abonnement : favoris et progression conservés (preuve de Q01)", () => {
  it.each([
    ["customer.subscription.deleted", "canceled"],
    ["customer.subscription.updated", "unpaid"],
  ])("%s (%s) : plan FREE, et les lignes favoris et progression existent toujours", async (type, statut) => {
    const res = await livrer(type, abonnementStripe(statut));
    expect(res.status).toBe(200);
    expect(base.user[0].plan).toBe("FREE");
    expect(base.userFavorite.map((l) => l.id)).toEqual(["fav-1", "fav-2"]);
    expect(base.userPathStepCompletion.map((l) => l.id)).toEqual(["c-1", "c-2"]);
    expect(appelsProteges).toEqual([]);
  });
});

describe("garde-fou du code : qui peut supprimer favoris et progression ?", () => {
  it("seulement la suppression du compte (lib/account.ts) et le retrait d'un favori par la personne", () => {
    const racine = join(__dirname, "..", "..");
    const fautifs: string[] = [];
    const parcourir = (dossier: string) => {
      for (const nom of readdirSync(dossier)) {
        const chemin = join(dossier, nom);
        if (statSync(chemin).isDirectory()) {
          if (nom !== "__tests__") parcourir(chemin);
        } else if (/\.(ts|tsx)$/.test(nom)) {
          const code = readFileSync(chemin, "utf-8");
          if (/(userFavorite|userPathStepCompletion)\.delete(Many)?\(|DELETE FROM "(UserFavorite|UserPathStepCompletion)"/.test(code)) {
            fautifs.push(relative(racine, chemin));
          }
        }
      }
    };
    parcourir(racine);
    expect(fautifs.sort()).toEqual(["app/api/favorites/[id]/route.ts", "lib/account.ts"]);
    // Le webhook et les crons ne touchent jamais ces deux tables.
    expect(readFileSync(join(racine, "app/api/stripe/webhook/route.ts"), "utf-8")).not.toMatch(/userFavorite|userPathStepCompletion/);
  });
});
