import { test, expect, type Page } from "@playwright/test";
import { randomBytes, scryptSync } from "node:crypto";
import { cheminRetourPaiement } from "@/lib/premium-return";

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
  await expect(page).not.toHaveURL(/\/login/, { timeout: 20_000 });
}

export { test, expect };

/**
 * Faux Stripe des tests locaux (QA conversion s21, m4) : la `success_url` EXACTE de `lib/stripe.ts`
 * (même fonction `cheminRetourPaiement` : intention validée, `formule=annuel` pour l'annuel), à partir
 * du corps envoyé à `/api/stripe/checkout`.
 */
export function urlRetourStripeSimule(corps: { returnTo?: string; plan?: string }): string {
  return cheminRetourPaiement(corps.returnTo ?? null, corps.plan === "annual" ? "annual" : "monthly", "cs_test_e2e_local");
}
