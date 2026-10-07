import { defineConfig, devices } from "@playwright/test";
import { existsSync } from "node:fs";
import path from "node:path";

/**
 * Tests E2E des parcours (reco 20, audit parcours s16).
 *
 * - `E2E_BASE_URL` : site visé (ex. https://deviens-marrant.fr). Absent : serveur
 *   local `next dev` sur le port 5000, lancé depuis apps/web.
 * - Projets `desktop` et `iphone-13` : suite `@smoke`, lecture seule, jouable en prod.
 * - Projet `achat` : parcours complet avec Stripe en mode test. Skippé tout seul
 *   sans `STRIPE_TEST_SECRET_KEY` + `E2E_BASE_URL` d'un environnement de test.
 * - Chromium uniquement (WebKit non installé ici). `E2E_CHROMIUM_PATH` force un
 *   binaire précis (ex. /opt/pw-browsers/chromium/chrome-linux/chrome).
 */
const baseURL = process.env.E2E_BASE_URL?.replace(/\/$/, "") || "http://localhost:5000";
const local = !process.env.E2E_BASE_URL;
const chromiumPath = process.env.E2E_CHROMIUM_PATH;
const launchOptions = chromiumPath && existsSync(chromiumPath) ? { executablePath: chromiumPath } : {};

export default defineConfig({
  testDir: "./tests",
  outputDir: "./test-results",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : 4,
  timeout: 45_000,
  expect: { timeout: 10_000 },
  reporter: process.env.CI
    ? [["list"], ["html", { open: "never", outputFolder: "./playwright-report" }]]
    : [["list"]],
  use: {
    baseURL,
    locale: "fr-FR",
    timezoneId: "Europe/Paris",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    navigationTimeout: 30_000,
    actionTimeout: 15_000,
    launchOptions,
  },
  projects: [
    {
      name: "desktop",
      testMatch: /smoke\/.*\.spec\.ts/,
      use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } },
    },
    {
      name: "iphone-13",
      testMatch: /smoke\/.*\.spec\.ts/,
      // Gabarit iPhone 13 (viewport, DPR, tactile, user agent) rendu par Chromium.
      use: { ...devices["iPhone 13"], browserName: "chromium" },
    },
    {
      name: "achat",
      testMatch: /achat\/.*\.spec\.ts/,
      fullyParallel: false,
      timeout: 180_000,
      use: { ...devices["Desktop Chrome"], viewport: { width: 1280, height: 900 } },
    },
  ],
  webServer: local
    ? {
        command: "npm run dev",
        cwd: path.join(__dirname, "..", "apps", "web"),
        url: "http://localhost:5000",
        reuseExistingServer: true,
        timeout: 180_000,
      }
    : undefined,
});
