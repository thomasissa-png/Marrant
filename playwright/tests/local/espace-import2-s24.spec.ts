import { mkdirSync } from "node:fs";
import { join } from "node:path";
import type { Page } from "@playwright/test";
import { test, expect, localSeulement, creerCompte, connecter } from "../support/base-locale";
import { TEXTES_BILAN as B, TEXTES_FICHE as T } from "@/config/textes/espace-bibliotheque";
import { TEXTES_CARTES as C } from "@/config/textes/espace-cartes";

/**
 * Import 2 du contenu de l'espace (s24) sur le VRAI contenu (serveur construit interrupteur ouvert,
 * bascule temporaire rétablie par `trap`) : séance, vocabulaire, C1b fiche 7 (récit), C6a fiche 9, bilan
 * (renvoi calculé, geste affiché une fois), « Les pires réponses ». `E2E_CAPTURES_IMPORT2` : dossier des
 * captures sombres 375 et 1280 (`docs/captures/s24-import2`).
 */
const ESPACE_OUVERT = process.env.E2E_ESPACE_OUVERT === "1";
const FIXTURES_ESPACE = process.env.E2E_FIXTURES_ESPACE === "1";
const CAPTURES = process.env.E2E_CAPTURES_IMPORT2 ?? "";
const MOT_DE_PASSE = "E2e-espace-import2-s24";

async function capturer(page: Page, nom: string) {
  if (!CAPTURES) return;
  mkdirSync(CAPTURES, { recursive: true });
  for (const [l, h] of [[375, 812], [1280, 900]] as const) {
    await page.setViewportSize({ width: l, height: h });
    await page.waitForTimeout(300);
    await page.screenshot({ path: join(CAPTURES, `${nom}-${l}.png`), fullPage: true });
  }
  await page.setViewportSize({ width: 375, height: 812 });
}

async function toucher(page: Page, portee = page.locator("main")) {
  await expect(portee.getByText(C.prendsTonTemps).first()).toBeHidden({ timeout: 6_000 });
  await portee.getByRole("button", { name: C.reponses.RIEN, exact: true }).first().click();
}

test.describe("espace client, import 2 (s24), vrai contenu", () => {
  localSeulement();
  test.skip(!ESPACE_OUVERT || FIXTURES_ESPACE, "E2E_ESPACE_OUVERT=1 requis, serveur construit avec le vrai contenu");

  test.beforeEach(async ({ page }) => {
    const email = `e2e-import2-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}@example.com`;
    await creerCompte(email, MOT_DE_PASSE, "PREMIUM");
    await connecter(page, email, MOT_DE_PASSE);
    await page.setViewportSize({ width: 375, height: 812 });
  });

  test("séance : rubriques, grille du bilan, geste ; vocabulaire : lien seulement s'il existe ; C1b fiche 7 en récit", async ({ page }) => {
    await page.goto("/mon-espace/fiche/seance/seance-dix-chambrages-dix-secondes");
    for (const t of [T.seance.pourQuiQuand, T.seance.ilTeFaut, T.seance.tuProduis, T.seance.renvois]) await expect(page.getByRole("heading", { name: t, exact: true })).toBeVisible();
    await expect(page.getByTestId("seance-grille").getByRole("listitem")).toHaveCount(3);
    await expect(page.getByTestId("geste-fiche")).toContainText("Ressors-la à voix haute ce soir.");
    await capturer(page, "seance");

    await page.goto("/mon-espace/fiche/vocabulaire/vocabulaire-quand-on-te-lance-une-pique");
    await expect(page.getByRole("heading", { name: "Esprit de l'escalier" })).toBeVisible();
    await expect(page.getByRole("link", { name: T.definitionComplete })).toHaveCount(3);
    await capturer(page, "vocabulaire");

    await page.goto("/mon-espace/fiche/construction/le-callback");
    await expect(page.locator("main")).toContainText("On te demande comment tu t'y retrouves dans ton sac : « Tout a sa place. »");
    await expect(page.locator("main")).not.toContainText("« On te demande");
    await expect(page.getByTestId("geste-grille").getByRole("listitem")).toHaveCount(3);
    await capturer(page, "construction-callback");
  });

  test("C6a fiche 9 : rubrique, le silence sans guillemets, « Si le blanc dure » ; « Les pires réponses »", async ({ page }) => {
    await page.goto("/mon-espace/fiche/a-plat/a-plat-le-blanc");
    await expect(page.getByRole("heading", { name: "De quel blanc parle-t-on" })).toBeVisible();
    await toucher(page);
    await expect(page.getByTestId("fiche-suite")).toContainText("Le silence. Tu souris");
    await expect(page.getByTestId("fiche-suite")).not.toContainText("« Le silence.");
    await expect(page.getByRole("heading", { name: "Si le blanc dure" })).toBeVisible();
    await capturer(page, "a-plat-le-blanc");

    await page.goto("/mon-espace/fiche/jeu/les-pires-reponses-1");
    await page.getByText(T.ceQuOnAuraitPuDire).click();
    await expect(page.locator("details")).toContainText("B.");
    await capturer(page, "jeu-les-pires-reponses");
  });

  test("bilan : renvoi calculé vers l'étape du quiz, « à voix haute » affiché une fois", async ({ page }) => {
    await page.goto("/mon-espace/fiche/bilan/bilan-machine-a-cafe");
    await expect(page.locator('[data-bilan="voix-haute"]')).toHaveCount(0);
    const carte = page.locator('[data-bilan="laquelle"]').first();
    await toucher(page, carte);
    await carte.getByRole("button", { name: /^A/ }).click();
    await expect(carte.getByRole("link", { name: B.deuxiemeTour("L'humour à la machine à café") })).toHaveAttribute("href", "/parcours/machine-a-cafe#etape-1");
    await capturer(page, "bilan");
  });
});
