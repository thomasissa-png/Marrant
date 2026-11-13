import { test as base, expect, type Page } from "@playwright/test";
import { randomBytes, scryptSync } from "node:crypto";
import { cheminRetourPaiement } from "@/lib/premium-return";
import { LETTRE_HEBDO_INSCRIPTIONS_OUVERTES } from "@/config/lettre";

/**
 * Socle des tests de bout en bout LOCAUX (projet `local`) : ils écrivent en base
 * (inscription à la lettre, comptes de test) et ne tournent JAMAIS contre la
 * production. Conditions : `E2E_BASE_URL` sur localhost / 127.0.0.1 et
 * `E2E_DATABASE_URL` vers la base jetable du serveur testé.
 */
export const BASE_URL = (process.env.E2E_BASE_URL || "http://localhost:5000").replace(/\/$/, "");
const BASE_DONNEES = process.env.E2E_DATABASE_URL ?? "";
const HOTE_LOCAL = /^(localhost|127\.0\.0\.1)$/.test(new URL(BASE_URL).hostname);

/** À appeler en tête de chaque describe local : saute tout hors environnement jetable. */
export function localSeulement() {
  test.skip(!HOTE_LOCAL, "tests locaux : jamais contre un site en ligne");
  test.skip(!BASE_DONNEES, "E2E_DATABASE_URL absente : base jetable requise");
}

interface ClientPg {
  connect(): Promise<void>;
  query<T>(sql: string, params?: unknown[]): Promise<{ rows: T[] }>;
  end(): Promise<void>;
}
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { Client } = require("pg") as { Client: new (cfg: { connectionString: string }) => ClientPg };

/** Une requête sur la base jetable (connexion ouverte puis fermée). */
export async function requete<T>(sql: string, params: unknown[] = []): Promise<T[]> {
  const client = new Client({ connectionString: BASE_DONNEES });
  await client.connect();
  try {
    return (await client.query<T>(sql, params)).rows;
  } finally {
    await client.end();
  }
}

/** Même hachage que `apps/web/src/lib/password.ts` (scrypt N=2^15, sel hexadécimal). */
function hacher(motDePasse: string): string {
  const sel = randomBytes(16).toString("hex");
  const cle = scryptSync(motDePasse, sel, 64, { N: 32768, r: 8, p: 1, maxmem: 64 * 1024 * 1024 });
  return `${sel}:${cle.toString("hex")}`;
}

export type PlanCompte = "FREE" | "PREMIUM";

/** Crée (ou remet à zéro) un compte à mot de passe sur la base jetable. */
export async function creerCompte(email: string, motDePasse: string, plan: PlanCompte): Promise<void> {
  const id = `e2e${randomBytes(10).toString("hex")}`;
  await requete(
    `INSERT INTO "User" (id, email, name, "passwordHash", plan, "emailVerified", "createdAt", "updatedAt")
     VALUES ($1, $2, 'E2E', $3, $4::"Plan", now(), now(), now())
     ON CONFLICT (email) DO UPDATE SET "passwordHash" = EXCLUDED."passwordHash", plan = EXCLUDED.plan, "updatedAt" = now()`,
    [id, email, hacher(motDePasse), plan],
  );
}

/** Connexion par le formulaire de /login, comme un humain. */
export async function connecter(page: Page, email: string, motDePasse: string): Promise<void> {
  await page.goto("/login");
  await page.getByLabel(/e-?mail/i).fill(email);
  await page.locator("#password").fill(motDePasse);
  await page.getByRole("button", { name: "Se connecter" }).click();
  // Lot D11b : espace ouvert, l'arrivée passe par `/api/espace/arrivee` (303) ; on attend la page d'arrivée
  // au repos (10 s au plus), sinon un `goto` immédiat coupe la redirection et les requêtes de session en vol (NextAuth
  // relance alors `/api/auth/_log`, qui empêchait `networkidle` dans `conversion-v2-s21`).
  await expect(page).not.toHaveURL(/\/login|\/api\/espace\/arrivee/, { timeout: 20_000 });
  await page.waitForLoadState("networkidle", { timeout: 10_000 }).catch(() => undefined);
}

/**
 * Lot D11b (Q-2) : chaque test local a sa propre adresse de visiteur (`cf-connecting-ip`, comme Cloudflare),
 * même mécanisme que les specs qui la posaient déjà (`concision-s21`, `conversion-v2-s21`…). La limite de
 * production (30 connexions par adresse en 15 min, `lib/auth.ts`) reste intacte : la suite complète, interrupteur
 * ouvert, ne la partage plus entre tous ses tests. Une spec qui pose son adresse (`test.use`, `setExtraHTTPHeaders`,
 * contexte à elle) garde la sienne.
 */
export const adresseVisiteur = () => `10.${[1, 2, 3].map(() => randomBytes(1)[0]).join(".")}`;
const test = base.extend({
  extraHTTPHeaders: async ({}, use) => {
    await use({ "cf-connecting-ip": adresseVisiteur() });
  },
});

export { test, expect };

/**
 * Faux Stripe des tests locaux (QA conversion s21, m4) : la `success_url` EXACTE de `lib/stripe.ts`
 * (même fonction `cheminRetourPaiement` : intention validée, `formule=annuel` pour l'annuel), à partir
 * du corps envoyé à `/api/stripe/checkout`.
 */
export function urlRetourStripeSimule(corps: { returnTo?: string; plan?: string }): string {
  return cheminRetourPaiement(corps.returnTo ?? null, corps.plan === "annual" ? "annual" : "monthly", "cs_test_e2e_local");
}

/**
 * Retour de paiement (s22, inscription d'office) : inscriptions à la lettre de la semaine ouvertes =
 * la page montre une ligne selon l'état du compte (plus de case) et un bouton vers la page d'origine, sans
 * redirection automatique. On clique ce bouton une fois sa cible finale posée (favori ajouté,
 * `data-pret="oui"`). Fermées : redirection, rien à faire.
 */
export async function quitterRetourPaiement(page: Page): Promise<void> {
  if (!LETTRE_HEBDO_INSCRIPTIONS_OUVERTES) return;
  const bouton = page.locator('[data-testid="retour-paiement-continuer"][data-pret="oui"]');
  await expect(bouton).toBeVisible({ timeout: 60_000 });
  // Compte de test Premium sans arrêt ni opposition : variante « reçoit » de la ligne (selon l'état, relecture B1).
  await expect(page.getByTestId("lettre-hebdo-paiement")).toHaveAttribute("data-etat", "recoit");
  await expect(page.getByTestId("lettre-hebdo-paiement")).toHaveText(/^Chaque jeudi, la lettre de la semaine arrive dans ta boîte\s:\selle est incluse dans ton abonnement\./);
  await expect(page.getByRole("checkbox")).toHaveCount(0);
  await bouton.click();
}

/**
 * Régime de l'espace client du serveur testé (lot D11b, Q-2) : `E2E_ESPACE_OUVERT=1` quand le serveur a été
 * construit interrupteur OUVERT (job CI `e2e-local`, matrice `ouvert`, ou bascule locale temporaire).
 */
export const ESPACE_OUVERT = process.env.E2E_ESPACE_OUVERT === "1";

/**
 * Arrivée après le paiement, dans les deux régimes. Fermé : la page d'origine avec `premium=bienvenue`.
 * Ouvert (décision C14, lot D3) : « Aujourd'hui », `/mon-espace?depuis=<origine>` (favori compris dans
 * l'origine, le premier pas s'en sert), plus le drapeau `favori=<TYPE>` si le favori a été ajouté.
 * Renvoie l'adresse d'arrivée et l'origine retenue (chemin seul).
 */
export async function attendreArriveePaiement(page: Page): Promise<{ url: URL; origine: string }> {
  if (!ESPACE_OUVERT) {
    await page.waitForURL(/premium=bienvenue/, { timeout: 60_000 });
    const url = new URL(page.url());
    return { url, origine: url.pathname };
  }
  await page.waitForURL(/\/mon-espace(\?|$)/, { timeout: 60_000 });
  const url = new URL(page.url());
  expect(url.pathname).toBe("/mon-espace");
  await expect(page.getByRole("heading", { level: 1, name: /^Aujourd.hui$/ })).toBeVisible({ timeout: 20_000 });
  const depuis = url.searchParams.get("depuis") ?? "";
  return { url, origine: depuis.split(/[?#]/)[0] };
}
