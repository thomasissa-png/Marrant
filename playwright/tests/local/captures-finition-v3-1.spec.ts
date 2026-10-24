import path from "node:path";
import { randomBytes } from "node:crypto";
import type { Page } from "@playwright/test";
import { test, expect, localSeulement } from "../support/base-locale";

/**
 * Recaptures de la passe de finition du tour 3 (écrans touchés seulement), en 375 × 700 et 320 × 640 :
 * /abonnement premier écran mensuel et annuel (T1 en-tête, T2 mur), fenêtre T4, fin d'étape 1 T3,
 * réponse ouverte de « Et si j'arrête ? », /abonnement à 1 280 px.
 * Sur demande seulement : `CAPTURES_TRAJETS=1`. Sortie : docs/design/conversion-s21/trajets-v3-1/.
 */
const SORTIE = path.join(__dirname, "..", "..", "..", "docs", "design", "conversion-s21", "trajets-v3-1");
const TAILLES = [
  { nom: "375x700", width: 375, height: 700 },
  { nom: "320x640", width: 320, height: 640 },
] as const;

async function capture(page: Page, dossier: string, nom: string, pleine = false) {
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(SORTIE, dossier, `${nom}.png`), fullPage: pleine, animations: "disabled" });
}

async function preparer(page: Page, largeur: number, hauteur: number) {
  await page.setExtraHTTPHeaders({ "cf-connecting-ip": `10.${[1, 2, 3].map(() => randomBytes(1)[0]).join(".")}` });
  await page.setViewportSize({ width: largeur, height: hauteur });
}

test.describe("Recaptures de la finition du tour 3", () => {
  localSeulement();
  test.skip(process.env.CAPTURES_TRAJETS !== "1", "captures sur demande : CAPTURES_TRAJETS=1");
  test.setTimeout(120_000);

  for (const t of TAILLES) {
    for (const [trajet, chemin] of [
      ["T1-en-tete", "/abonnement?returnTo=%2Fconseils&src=header"],
      ["T2-mur-vannes", "/abonnement?returnTo=%2Fvannes&src=mur-vannes"],
    ] as const) {
      test(`${trajet} : /abonnement premier écran, mensuel et annuel, ${t.nom}`, async ({ page }) => {
        await preparer(page, t.width, t.height);
        await page.goto(chemin);
        await expect(page.getByTestId("abonnement-suite")).toBeVisible();
        await capture(page, `${trajet}/${t.nom}`, "02-abonnement-premier-ecran-mensuel");
        await page.getByTestId("formule-annual").click();
        await expect(page.getByTestId("abonnement-bouton-achat")).toHaveText(/16,99/);
        await capture(page, `${trajet}/${t.nom}`, "02-abonnement-premier-ecran-annuel");
      });
    }

    test(`T4 fenêtre Premium (étoile d'une vanne), ${t.nom}`, async ({ page }) => {
      await preparer(page, t.width, t.height);
      await page.goto("/vannes");
      await page.getByRole("button", { name: /Ajouter aux favoris/ }).first().click();
      await expect(page.getByRole("dialog")).toContainText("Premium ouvre aussi tout le catalogue");
      await capture(page, `T4-fenetre-premium/${t.nom}`, "02-fenetre");
    });

    test(`T3 fin d'étape 1 (quiz fait), ${t.nom}`, async ({ page }) => {
      await preparer(page, t.width, t.height);
      await page.goto("/parcours/repartie");
      for (let i = 0; i < 10; i++) {
        const options = page.locator('[role="group"][aria-labelledby^="quiz-q-"] button');
        if ((await options.count()) === 0) break;
        await options.first().click();
        await page.getByRole("button", { name: /^(Question suivante|Voir le résultat)$/ }).click();
      }
      const carte = page.locator("[data-fin-etape-1]");
      await expect(carte).toContainText(/Étape 2 sur \d/);
      await page.waitForTimeout(600);
      const aller = async (sel: string, decalage: number) =>
        page.locator(sel).first().evaluate((el, d) => {
          document.documentElement.style.scrollBehavior = "auto";
          window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - d, behavior: "instant" as ScrollBehavior });
        }, decalage);
      await aller("[data-fin-etape-1]", 72);
      await capture(page, `T3-fin-etape-1/${t.nom}`, "01a-carte-etape-2");
      // Sous la carte : la liste des étapes sans l'étape 2 répétée, puis la lettre gratuite.
      await aller("[data-fin-etape-1] a[data-fin-etape-1-cta='premium']", 120);
      await capture(page, `T3-fin-etape-1/${t.nom}`, "01b-suite-liste-et-lettre");
    });

    test(`FAQ « Et si j'arrête ? » ouverte, ${t.nom}`, async ({ page }) => {
      await preparer(page, t.width, t.height);
      await page.goto("/abonnement?src=header");
      const question = page.locator("details summary").filter({ hasText: /Et si j.arrête/ });
      await question.scrollIntoViewIfNeeded();
      await question.click();
      await expect(page.locator("details[open]")).toContainText("Tes favoris et ta progression restent enregistrés.");
      await question.evaluate((el) => {
        document.documentElement.style.scrollBehavior = "auto";
        window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 80, behavior: "instant" as ScrollBehavior });
      });
      await capture(page, `FAQ-et-si-j-arrete/${t.nom}`, "faq-et-si-j-arrete-ouverte");
    });
  }

  test("/abonnement à 1 280 px (visiteur)", async ({ page }) => {
    await preparer(page, 1280, 800);
    await page.goto("/abonnement?src=header");
    await capture(page, "desktop-1280", "abonnement-premier-ecran");
    await capture(page, "desktop-1280", "abonnement-complete", true);
  });
});
