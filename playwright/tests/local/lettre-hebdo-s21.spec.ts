import { randomBytes } from "node:crypto";
import type { Page } from "@playwright/test";
import { test, expect, localSeulement, creerCompte, requete } from "../support/base-locale";
import { LETTRE_HEBDO_INSCRIPTIONS_OUVERTES } from "@/config/lettre";
import { LETTRE_HEBDO_ARRET } from "@/config/textes/lettre-hebdo-s21";

/**
 * Lettre de la semaine (hebdo Premium, s21) : case du profil et page d'arrêt en un clic,
 * sur base jetable (projet `local`, jamais en production).
 *  - Page d'arrêt : marche interrupteurs fermés ; l'ouverture (GET) ne change rien ; le bouton
 *    arrête l'HEBDO seule (`stopOrigin = lien-email`) ; « déjà arrêtée » ; lien inconnu ;
 *    POST RFC 8058 du client de messagerie ; `noindex`, `Referrer-Policy: same-origin` (jeton jamais transmis ailleurs).
 *  - Réglage du profil (s22, inscription d'office) : interrupteur `LETTRE_HEBDO_INSCRIPTIONS_OUVERTES`
 *    fermé = section absente ; ouvert (état déployé) = réglage « Je reçois la lettre de la semaine »
 *    ACTIVÉ pour un Premium sans ligne ; le désactiver crée l'arrêt explicite (origine `profil`), le
 *    réactiver le lève.
 */
const MOT_DE_PASSE = "E2e-lettre-hebdo-2026!";
const jeton = () => `e2eHebdo_${randomBytes(18).toString("hex")}`;

async function compteAvecLettre(email: string, token: string, enabled = true): Promise<string> {
  await creerCompte(email, MOT_DE_PASSE, "PREMIUM");
  const [{ id }] = await requete<{ id: string }>(`SELECT id FROM "User" WHERE email = $1`, [email]);
  await requete(`DELETE FROM "PremiumLetterPreference" WHERE "userId" = $1`, [id]);
  await requete(
    `INSERT INTO "PremiumLetterPreference" (id, "userId", enabled, "activatedAt", "consentVersion", "activationOrigin", "unsubscribeToken", "updatedAt")
     VALUES ($1, $2, $3, now(), 'lettre-hebdo-premium-v1', 'profil', $4, now())`,
    [`e2e${randomBytes(8).toString("hex")}`, id, enabled, token],
  );
  return id;
}

/** Comme `connecter`, après hydratation de /login (serveur de dev : sinon le formulaire part en GET natif). */
async function seConnecter(page: Page, email: string): Promise<void> {
  await page.goto("/login");
  await page.waitForLoadState("networkidle");
  await page.getByLabel(/e-?mail/i).fill(email);
  await page.locator("#password").fill(MOT_DE_PASSE);
  await page.getByRole("button", { name: "Se connecter" }).click();
  await expect(page).not.toHaveURL(/\/login/, { timeout: 30_000 });
}

const preference = async (userId: string) =>
  (await requete<{ enabled: boolean; stopOrigin: string | null; activationOrigin: string | null }>(
    `SELECT enabled, "stopOrigin", "activationOrigin" FROM "PremiumLetterPreference" WHERE "userId" = $1`,
    [userId],
  ))[0];

test.describe("Page d'arrêt de la lettre de la semaine", () => {
  localSeulement();

  for (const largeur of [375, 1280]) {
    test(`${largeur} px : GET sans effet, bouton = arrêt de l'hebdo seule, puis « déjà arrêtée »`, async ({ page }) => {
      await page.setViewportSize({ width: largeur, height: largeur < 768 ? 812 : 800 });
      const token = jeton();
      const userId = await compteAvecLettre(`e2e-hebdo-arret-${largeur}@exemple.fr`, token);

      const reponse = await page.goto(`/lettre/premium/arreter?token=${token}`);
      expect(reponse?.status()).toBe(200);
      expect(reponse?.headers()["referrer-policy"]).toBe("same-origin");
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
      await expect(page.getByRole("heading", { level: 1 })).toContainText("Arrêter la lettre de la semaine");
      // Un scanner de liens qui ouvre la page n'arrête personne.
      expect((await preference(userId)).enabled).toBe(true);

      await page.getByRole("button", { name: LETTRE_HEBDO_ARRET.bouton }).click();
      await expect(page.getByTestId("arret-lettre-hebdo")).toContainText("C’est arrêté.");
      expect(await preference(userId)).toMatchObject({ enabled: false, stopOrigin: "lien-email" });

      await page.goto(`/lettre/premium/arreter?token=${token}`);
      await page.getByRole("button", { name: LETTRE_HEBDO_ARRET.bouton }).click();
      await expect(page.getByTestId("arret-lettre-hebdo")).toContainText("déjà arrêtée");
    });
  }

  test("lien inconnu : « Ce lien ne fonctionne plus », rien n'est écrit", async ({ page }) => {
    await page.goto(`/lettre/premium/arreter?token=${jeton()}`);
    await page.getByRole("button", { name: LETTRE_HEBDO_ARRET.bouton }).click();
    await expect(page.getByTestId("arret-lettre-hebdo")).toContainText("Ce lien ne fonctionne plus");
  });

  test("en-tête List-Unsubscribe-Post : POST en un clic du client de messagerie, immédiat", async ({ request }) => {
    const token = jeton();
    const userId = await compteAvecLettre("e2e-hebdo-un-clic@exemple.fr", token);
    const res = await request.post(`/api/lettre-premium/arret-un-clic?token=${token}`, { form: { "List-Unsubscribe": "One-Click" } });
    expect(res.status()).toBe(200);
    expect(await preference(userId)).toMatchObject({ enabled: false, stopOrigin: "lien-email" });
  });
});

test.describe("Réglage de la lettre de la semaine dans le profil (inscription d'office)", () => {
  localSeulement();

  test("interrupteur fermé : section absente pour un Premium (aucune promesse)", async ({ page }) => {
    test.skip(LETTRE_HEBDO_INSCRIPTIONS_OUVERTES, "interrupteur ouvert : voir le test suivant");
    await creerCompte("e2e-hebdo-profil-ferme@exemple.fr", MOT_DE_PASSE, "PREMIUM");
    await seConnecter(page, "e2e-hebdo-profil-ferme@exemple.fr");
    await page.goto("/profil");
    await expect(page.getByRole("heading", { level: 1, name: "Mon profil" })).toBeVisible();
    await page.waitForLoadState("networkidle");
    await expect(page.getByTestId("lettre-hebdo-profil")).toHaveCount(0);
    expect(await page.content()).not.toMatch(/lettre de la semaine/i);
  });

  for (const largeur of [375, 1280]) {
    test(`${largeur} px, interrupteur ouvert : activé d'office, désactiver = arrêt en base, réactiver = reprise`, async ({ page }) => {
      test.skip(!LETTRE_HEBDO_INSCRIPTIONS_OUVERTES, "interrupteur fermé : section absente (test précédent)");
      await page.setViewportSize({ width: largeur, height: largeur < 768 ? 812 : 800 });
      const email = `e2e-hebdo-profil-${largeur}@exemple.fr`;
      await creerCompte(email, MOT_DE_PASSE, "PREMIUM");
      const [{ id }] = await requete<{ id: string }>(`SELECT id FROM "User" WHERE email = $1`, [email]);
      await requete(`DELETE FROM "PremiumLetterPreference" WHERE "userId" = $1`, [id]);
      await seConnecter(page, email);
      await page.goto("/profil#lettre");

      const section = page.getByTestId("lettre-hebdo-profil");
      await expect(section).toBeVisible();
      const reglage = section.getByRole("switch", { name: "Je reçois la lettre de la semaine" });
      await expect(reglage).toBeChecked();
      await expect(section).not.toContainText("Pas activée");
      await expect(section.getByRole("checkbox")).toHaveCount(0);
      await expect(section.getByRole("link", { name: "Confidentialité" })).toHaveAttribute("href", "/confidentialite#lettre");
      // Inscrit d'office : aucune ligne écrite à l'affichage.
      expect(await preference(id)).toBeUndefined();

      await reglage.click();
      await expect(section).toContainText("C’est arrêté. Ton abonnement continue.");
      await expect(reglage).not.toBeChecked();
      expect(await preference(id)).toMatchObject({ enabled: false, stopOrigin: "profil" });
      await page.reload();
      await expect(page.getByTestId("lettre-hebdo-profil").getByRole("switch")).not.toBeChecked();

      await page.getByTestId("lettre-hebdo-profil").getByRole("switch").click();
      await expect(page.getByTestId("lettre-hebdo-profil")).toContainText("C’est noté.");
      expect(await preference(id)).toMatchObject({ enabled: true, stopOrigin: null, activationOrigin: "profil" });
    });
  }
});
