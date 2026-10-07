import { expect, type Page, type Frame } from "@playwright/test";

/**
 * Outils du parcours d'achat (@achat), Stripe en MODE TEST uniquement.
 *
 * Conditions (sinon les tests sont skippés, jamais joués) :
 * - `E2E_BASE_URL` fourni et différent de la prod (deviens-marrant.fr refusé) ;
 * - `STRIPE_TEST_SECRET_KEY` fourni, clé de mode test (préfixe sk_test_), la même
 *   que celle de l'environnement visé (sert à vérifier l'état chez Stripe et à
 *   nettoyer les abonnements créés).
 */
const BASE = process.env.E2E_BASE_URL ?? "";
const CLE = process.env.STRIPE_TEST_SECRET_KEY ?? "";

export function raisonDeSkipAchat(): string | null {
  if (!BASE) return "E2E_BASE_URL absent (environnement de test requis)";
  if (/(^|\.)deviens-marrant\.fr$/.test(new URL(BASE).hostname)) return "E2E_BASE_URL vise la prod : achat interdit";
  if (!CLE) return "STRIPE_TEST_SECRET_KEY absent";
  if (!/^sk_test_[A-Za-z0-9]{20,}$/.test(CLE)) return "STRIPE_TEST_SECRET_KEY n'est pas une clé de mode test";
  return null;
}

/** Adresse unique ; par défaut le puits de test Resend (aucune vraie boîte). */
export function adresseUnique(etiquette: string): string {
  const id = `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
  const domaine = process.env.E2E_EMAIL_DOMAIN ?? "resend.dev";
  const local = domaine === "resend.dev" ? `delivered+e2e-${etiquette}-${id}` : `e2e-${etiquette}-${id}`;
  return `${local}@${domaine}`;
}

export const MOT_DE_PASSE = "E2e-Marrant-2026!";

export const CARTES = {
  ok: "4242424242424242",
  refusee: "4000000000000002",
  troisDS: "4000002500003155",
} as const;

/** Appel direct à l'API Stripe (mode test) pour vérifier l'état réel. */
export async function stripeApi<T = Record<string, unknown>>(chemin: string, methode = "GET"): Promise<T> {
  const r = await fetch(`https://api.stripe.com/v1/${chemin}`, {
    method: methode,
    headers: { Authorization: `Bearer ${CLE}` },
  });
  const corps = (await r.json()) as T;
  expect(r.ok, `Stripe ${methode} ${chemin} : ${JSON.stringify(corps).slice(0, 300)}`).toBeTruthy();
  return corps;
}

type Abonnement = { id: string; status: string; cancel_at_period_end: boolean; items: { data: { price: { recurring: { interval: string } } }[] } };

export async function abonnementsStripe(email: string): Promise<Abonnement[]> {
  const clients = await stripeApi<{ data: { id: string }[] }>(`customers?email=${encodeURIComponent(email)}&limit=5`);
  const tous: Abonnement[] = [];
  for (const c of clients.data) {
    const subs = await stripeApi<{ data: Abonnement[] }>(`subscriptions?customer=${c.id}&status=all&limit=10`);
    tous.push(...subs.data);
  }
  return tous;
}

/** Filet de sécurité : résilie tout abonnement encore actif des adresses de test. */
export async function nettoyerStripe(emails: string[]): Promise<void> {
  for (const email of emails) {
    for (const s of await abonnementsStripe(email).catch(() => [])) {
      if (!["canceled", "incomplete_expired"].includes(s.status)) {
        await stripeApi(`subscriptions/${s.id}`, "DELETE").catch(() => undefined);
      }
    }
  }
}

/** Création de compte depuis /abonnement (mensuel ou annuel), jusqu'au Checkout Stripe. */
export async function inscriptionJusquAuCheckout(page: Page, email: string, plan: "monthly" | "annual") {
  await page.goto(plan === "annual" ? "/abonnement?plan=annual" : "/abonnement");
  await page.getByRole("link", { name: /^Commencer à/ }).click();
  await expect(page).toHaveURL(/\/register\?/);
  await page.locator("#name").fill("Testeur E2E");
  await page.locator("#email").fill(email);
  await page.locator("#password").fill(MOT_DE_PASSE);
  await page.getByRole("button", { name: "Créer mon compte" }).click();
  // Retour sur /abonnement?auto=1 qui ouvre le paiement tout seul.
  await page.waitForURL(/checkout\.stripe\.com/, { timeout: 45_000 });
}

/** Saisie de la carte sur la page Stripe Checkout hébergée (locale fr). */
export async function payerSurCheckout(page: Page, carte: string) {
  const accordeon = page.getByTestId("card-accordion-item-button");
  if (await accordeon.isVisible().catch(() => false)) await accordeon.click();
  await page.locator("#cardNumber").fill(carte);
  await page.locator("#cardExpiry").fill("12 / 34");
  await page.locator("#cardCvc").fill("123");
  await page.locator("#billingName").fill("Testeur E2E");
  const cp = page.locator("#billingPostalCode");
  if (await cp.isVisible().catch(() => false)) await cp.fill("75001");
  await page.getByTestId("hosted-payment-submit-button").click();
}

/** Valide le défi 3D Secure de test (iframes imbriquées de Stripe). */
export async function validerTroisDS(page: Page) {
  const cible = async (): Promise<Frame | null> => {
    for (const f of page.frames()) {
      if (await f.locator("#test-source-authorize-3ds").count().catch(() => 0)) return f;
    }
    return null;
  };
  await expect.poll(cible, { timeout: 30_000, message: "défi 3DS introuvable" }).not.toBeNull();
  const frame = (await cible()) as Frame;
  await frame.locator("#test-source-authorize-3ds").click();
}

/** Attend que /api/stripe/status (session du navigateur) donne le plan voulu. */
export async function attendrePlan(page: Page, plan: "PREMIUM" | "FREE", timeout = 60_000) {
  await expect
    .poll(async () => (await (await page.request.get("/api/stripe/status")).json()).plan, { timeout, intervals: [2_000] })
    .toBe(plan);
}
