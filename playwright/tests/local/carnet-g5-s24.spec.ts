import { mkdirSync } from "node:fs";
import { join } from "node:path";
import type { Page } from "@playwright/test";
import { test, expect, localSeulement, creerCompte, connecter } from "../support/base-locale";

/**
 * Carnet public, corrections de la porte G5 (s24, lot D5b ; `docs/copy/espace/g5-corrections-carnet.md`,
 * diff réel `g5-diff-reel.md`). Page publique déjà en ligne : les textes corrigés sont visibles dès le
 * déploiement, interrupteur de l'espace fermé comme ouvert. Abonné Premium (toutes les fiches visibles).
 * `E2E_CARNET_AVANT=1` : serveur construit avec les JSON d'AVANT les corrections (bascule temporaire),
 * captures seulement. `E2E_CAPTURES_D5B` : dossier des captures (`docs/captures/s24-d5b`).
 */
const AVANT = process.env.E2E_CARNET_AVANT === "1";
const CAPTURES = process.env.E2E_CAPTURES_D5B ?? "";
const MOT_DE_PASSE = "E2e-carnet-G5-D5b";

async function abonne(page: Page) {
  const email = `e2e-carnet-g5-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}@example.com`;
  await creerCompte(email, MOT_DE_PASSE, "PREMIUM");
  await connecter(page, email, MOT_DE_PASSE);
}

async function capturer(page: Page, nom: string, cible: string) {
  if (!CAPTURES) return;
  mkdirSync(CAPTURES, { recursive: true });
  for (const [l, h, suffixe] of [[320, 700, "320"], [375, 812, "375"], [768, 1024, "768"], [1280, 900, "1280"], [188, 406, "375-200pc"]] as const) {
    await page.setViewportSize({ width: l, height: h });
    await page.waitForTimeout(300);
    await page.locator(cible).first().evaluate((e) => {
      e.scrollIntoView({ block: "start", behavior: "instant" });
      const fixes = Array.from(document.querySelectorAll("header"))
        .filter((x) => ["sticky", "fixed"].includes(getComputedStyle(x).position))
        .reduce((b, x) => Math.max(b, x.getBoundingClientRect().bottom), 0);
      window.scrollBy({ top: -(fixes + 16), behavior: "instant" });
    });
    await page.waitForTimeout(300);
    await page.screenshot({ path: join(CAPTURES, `${nom}-${AVANT ? "avant" : "apres"}-${suffixe}.png`) });
  }
}

const norm = (s: string) => s.replace(/[  ]/g, " ").replace(/⁠/g, "").replace(/’/g, "'");

test.describe("carnet public, corrections G5 (s24, lot D5b)", () => {
  localSeulement();

  test("novembre : 11-21, 11-22 et 11-30 corrigés ; 11-29 garde « oui » sur la page du carnet", async ({ page }) => {
    await abonne(page);
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/carnet/2026-11");
    const f21 = page.locator("#fiche-2026-11-21");
    const f22 = page.locator("#fiche-2026-11-22");
    await expect(f21).toBeVisible();
    if (!AVANT) {
      const t21 = norm(await f21.innerText());
      expect(t21).toContain("En avance au pot");
      expect(t21).toContain("Je viens dire au revoir à Philippe. Quelqu'un peut me le montrer ?");
      expect(t21).not.toContain("premier arrivé");
      const t22 = norm(await f22.innerText());
      expect(t22).toContain("On m'a dit « à bientôt » à l'inscription. Je n'ai pas voulu les brusquer.");
      expect(t22).not.toContain("en bus");
      expect(norm(await page.locator("#fiche-2026-11-30").innerText())).toContain("Depuis qu'on a commandé, je sens la dette.");
      expect(norm(await page.locator("#fiche-2026-11-29").innerText())).toContain("Tu viens de dire « oui » sans m'écouter.");
    }
    await capturer(page, "carnet-novembre-11-21", "#fiche-2026-11-21");
    await capturer(page, "carnet-novembre-11-22", "#fiche-2026-11-22");
  });

  test("octobre : 10-09 et 10-04 corrigés, plus de « Le rire tombe sur »", async ({ page }) => {
    await abonne(page);
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/carnet/2026-10");
    await expect(page.locator("#fiche-2026-10-09")).toBeVisible();
    if (!AVANT) {
      expect(norm(await page.locator("#fiche-2026-10-09").innerText())).toContain("Mon professeur a remercié mes parents par écrit.");
      expect(norm(await page.locator("#fiche-2026-10-04").innerText())).toContain("Dans le salon, un inconnu te raconte sa randonnée");
      expect(norm(await page.locator("main").innerText())).not.toContain("Le rire tombe sur");
    }
    await capturer(page, "carnet-octobre-10-09", "#fiche-2026-10-09");
  });
});
