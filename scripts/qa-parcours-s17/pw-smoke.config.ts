// Enveloppe QA locale de la config du repo (aucune modification du repo) :
// - cible forcée sur l'instance locale (E2E_BASE_URL=http://localhost:5000, jamais la prod) ;
// - Chromium ne résout QUE localhost : aucune requête externe (Umami, Stripe, YouTube...).
import base from "/home/user/Marrant/playwright/playwright.config";

if (process.env.E2E_BASE_URL !== "http://localhost:5000") {
  throw new Error("pw-smoke.config.ts : E2E_BASE_URL doit valoir http://localhost:5000 (instance locale uniquement).");
}

const args = ["--host-resolver-rules=MAP * ~NOTFOUND, EXCLUDE localhost"];

export default {
  ...base,
  testDir: "/home/user/Marrant/playwright/tests",
  outputDir: process.env.QA_PW_OUT || "/tmp/claude-0/-home-user-Marrant/bd072092-6ee5-586f-8f47-6fd05fa5f334/scratchpad/qa-local/pw-results",
  reporter: [["list"]],
  workers: 2,
  webServer: undefined,
  projects: (base.projects || [])
    .filter((p) => p.name !== "achat")
    .map((p) => ({
      ...p,
      use: { ...p.use, launchOptions: { executablePath: "/opt/pw-browsers/chromium", args } },
    })),
};
