import { randomBytes } from "node:crypto";
import { test, expect, localSeulement, creerCompte, connecter, ESPACE_OUVERT } from "../support/base-locale";
import { TEXTES_APERCU, type RubriqueApercu } from "@/config/textes/espace-apercu";
// s26 bouton Tout ouvrir : le bouton d'offre des aperçus est celui de l'en-tête ouvert.
import { EN_TETE_OUVERT } from "@/config/textes/cta-articles-accueil";

/**
 * Nav v6 (s25, lot B), en vrai navigateur sur la base jetable, interrupteur OUVERT seulement (`E2E_ESPACE_OUVERT=1` ;
 * fermé, ces adresses sont la 404 : `espace-inertie-s24`) :
 * - visiteur et inscrit gratuit : chaque rubrique Premium de la bande répond 200 À SON ADRESSE (aucune redirection),
 *   titre, sous-titre validé, une fiche réelle, un seul bouton d'offre ; `noindex, follow` dans la tête ;
 * - abonné actif : la rubrique, jamais l'aperçu.
 * Captures de contrôle (375 et 1280) : `E2E_CAPTURES_APERCU=<dossier>`.
 */
const MOT_DE_PASSE = "E2e-apercu-v6-2026!";
/** Oracle écrit en dur (spec v6 §1, groupe 1, « … » et Favoris ; Parcours : la page publique, hors aperçu). */
const RUBRIQUES: [RubriqueApercu, string][] = [
  ["aujourdhui", "/mon-espace"],
  ["quoiRepondre", "/mon-espace/quoi-repondre"],
  ["bibliotheque", "/mon-espace/bibliotheque"],
  ["sEntrainer", "/mon-espace/s-entrainer"],
  ["mesQuestions", "/mon-espace/questions"],
  ["mesRepliques", "/mon-espace/repliques"],
  ["favoris", "/favoris"],
];
const CAPTURES = process.env.E2E_CAPTURES_APERCU;

/** `E2E_APERCU_PREVERSION=1` : comptes de la préversion s25 (`docs/espace-client/outils-s25/README.md`) au lieu de comptes neufs. */
const PREVERSION = process.env.E2E_APERCU_PREVERSION === "1";
const motDePasse = () => (PREVERSION ? "preversion-s24" : MOT_DE_PASSE);

async function compte(plan: "FREE" | "PREMIUM"): Promise<string> {
  if (PREVERSION) return plan === "FREE" ? "inscrit-gratuit@preversion.test" : "abonne-en-cours@preversion.test";
  const email = `e2e-apercu-${plan.toLowerCase()}-${Date.now().toString(36)}-${randomBytes(2).toString("hex")}@example.com`;
  await creerCompte(email, MOT_DE_PASSE, plan);
  return email;
}

test.describe("@espace nav v6 : pages d'aperçu Premium (ouvert)", () => {
  localSeulement();
  test.skip(!ESPACE_OUVERT, "E2E_ESPACE_OUVERT=1 requis : serveur construit interrupteur ouvert");
  test.setTimeout(120_000);

  for (const lecteur of ["visiteur", "gratuit"] as const) {
    test(`${lecteur} : l'aperçu à l'adresse de chaque rubrique, sans redirection, noindex follow`, async ({ page }) => {
      if (lecteur === "gratuit") await connecter(page, await compte("FREE"), motDePasse());
      for (const [rubrique, adresse] of RUBRIQUES) {
        const reponse = await page.goto(adresse);
        expect(reponse?.status(), adresse).toBe(200);
        expect(new URL(page.url()).pathname, adresse).toBe(adresse);
        await expect(page.getByRole("heading", { level: 1 })).toHaveText(TEXTES_APERCU.titres[rubrique]);
        await expect(page.locator(`[data-apercu="${rubrique}"]`)).toBeVisible();
        await expect(page.locator("[data-apercu-fiche]")).toHaveCount(1);
        await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex, ?follow/);
        const offre = page.locator("[data-apercu-offre]");
        await expect(offre.getByRole("link", { name: EN_TETE_OUVERT.nomAccessible })).toHaveAttribute("href", new RegExp(`^/abonnement\\?returnTo=${encodeURIComponent(adresse)}`));
        await expect(offre.getByRole("link")).toHaveCount(lecteur === "visiteur" ? 2 : 1);
        await expect(page.locator("[data-lien-retour]")).toHaveCount(0);
        if (CAPTURES) {
          for (const largeur of [375, 1280]) {
            await page.setViewportSize({ width: largeur, height: largeur === 375 ? 812 : 800 });
            await page.screenshot({ path: `${CAPTURES}/${lecteur}-${rubrique}-${largeur}.png`, fullPage: true });
          }
          await page.setViewportSize({ width: 1280, height: 800 });
        }
      }
    });
  }

  test("abonné actif : chaque rubrique, jamais l'aperçu", async ({ page }) => {
    await connecter(page, await compte("PREMIUM"), motDePasse());
    for (const [rubrique, adresse] of RUBRIQUES) {
      const reponse = await page.goto(adresse);
      expect(reponse?.status(), adresse).toBe(200);
      expect(new URL(page.url()).pathname, adresse).toBe(adresse);
      await expect(page.locator("[data-apercu]"), rubrique).toHaveCount(0);
      // Têtes d'avant : l'espace en `noindex, nofollow`, `/favoris` en `noindex, follow`.
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", adresse === "/favoris" ? /noindex, ?follow/ : /noindex, ?nofollow/);
    }
  });
});
