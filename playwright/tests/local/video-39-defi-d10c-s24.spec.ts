import { mkdirSync } from "node:fs";
import { join } from "node:path";
import { randomBytes } from "node:crypto";
import { test, expect, localSeulement, creerCompte, connecter, requete } from "../support/base-locale";
import { buildVideoSlug } from "@/lib/catalogue-slug";

/**
 * Lot D10c (s24, décision Thomas du 13/11) : fiche vidéo publique 39 (Aymeric Lompret), défi lu par un
 * abonné Premium (`/api/fiches/exercice`, base) : « Relativise. » « Justement, … » en deux répliques,
 * zéro tiret cadratin. CI : base neuve du seed corrigé ; base déjà en ligne : tâche `video-defi-39-s24`.
 * `E2E_CAPTURES_D10C` : capture sombre 375 (`docs/captures/s24-d10c`) ; `E2E_D10C_AVANT=1` : passage
 * « avant » (capture seule, sans l'assertion du nouveau texte).
 */
const CAPTURES = process.env.E2E_CAPTURES_D10C ?? "";
const AVANT = process.env.E2E_D10C_AVANT === "1";
const MOT_DE_PASSE = "E2e-video-39-d10c";

test.describe("fiche vidéo 39 : défi sans tiret cadratin (D10c)", () => {
  localSeulement();

  test("abonné Premium : le défi montre deux répliques, aucun « — »", async ({ browser }) => {
    const [video] = await requete<{ id: string; title: string }>(`SELECT id, title FROM "Video" WHERE "youtubeId" = 'itrLXrwG18c'`);
    test.skip(!video, "fiche 39 absente de la base jetable");
    const email = `e2e-d10c-${Date.now().toString(36)}-${randomBytes(2).toString("hex")}@example.com`;
    await creerCompte(email, MOT_DE_PASSE, "PREMIUM");
    const contexte = await browser.newContext({
      viewport: { width: 375, height: 812 },
      extraHTTPHeaders: { "cf-connecting-ip": `10.${[1, 2, 3].map(() => randomBytes(1)[0]).join(".")}` },
    });
    const page = await contexte.newPage();
    await connecter(page, email, MOT_DE_PASSE);
    await page.goto(`/videos/${buildVideoSlug(video)}`);
    const defi = page.locator('[data-bloc-exercice="video"] p').filter({ hasText: "CONTRE-INJONCTION" });
    await expect(defi).toBeVisible({ timeout: 20_000 });
    if (!AVANT) {
      await expect(defi).toContainText("« Relativise. » « Justement,");
      await expect(defi).not.toContainText("—");
    }
    if (CAPTURES) {
      mkdirSync(CAPTURES, { recursive: true });
      await defi.scrollIntoViewIfNeeded();
      await page.screenshot({ path: join(CAPTURES, `fiche-video-39-${AVANT ? "avant" : "apres"}-375.png`) });
      await page.screenshot({ path: join(CAPTURES, `fiche-video-39-${AVANT ? "avant" : "apres"}-375-pleine.png`), fullPage: true });
    }
    await contexte.close();
  });
});
