import { randomBytes } from "node:crypto";
import { readFileSync } from "node:fs";
import path from "node:path";
import { test, expect, localSeulement, requete, creerCompte, connecter, ESPACE_OUVERT } from "../support/base-locale";

/**
 * Lot D11b (s24), recette D11, en vrai navigateur sur la base jetable (interrupteur OUVERT seulement,
 * `E2E_ESPACE_OUVERT=1` ; fermé, ces adresses sont la 404 : `espace-inertie-s24`) :
 * - Q-1 (critère 2) : visiteur sur l'adresse d'un fil de « Mes questions » (lien de l'e-mail « L'équipe t'a
 *   répondu ») : connexion, puis retour sur CE fil, pas sur « Aujourd'hui » ;
 * - @ux D-5 : ancien abonné sur la même adresse : son historique en lecture seule (`/profil#mes-questions`) ;
 * - @ux D-3 : `?marche=3` toute essayée : une ligne et le lien vers la marche la plus proche qui a une mission ;
 * - @ux D-7 : après « Fait » sur une fiche, « Aujourd'hui » reste visible (barre de rubriques) ;
 * - @ux D-1 : la semaine 4 du calendrier ne promet pas « Écouter, repérer » (aucune fiche publiée).
 */
const MOT_DE_PASSE = "E2e-retours-d11b-2026!";
const MISSIONS = JSON.parse(
  readFileSync(path.join(__dirname, "../../../apps/web/src/data/espace/missions.json"), "utf8"),
) as Array<{ id: string; marche: number }>;

async function compte(plan: "PREMIUM" | "FREE", nom: string): Promise<{ id: string; email: string }> {
  const email = `e2e-d11b-${nom}-${Date.now().toString(36)}-${randomBytes(2).toString("hex")}@example.com`;
  await creerCompte(email, MOT_DE_PASSE, plan);
  const [{ id }] = await requete<{ id: string }>(`SELECT id FROM "User" WHERE email = $1`, [email]);
  return { id, email };
}

async function fil(userId: string): Promise<string> {
  const id = `e2ed11b${randomBytes(6).toString("hex")}`;
  await requete(`INSERT INTO "EquipeFil" (id, "userId", type, cle, statut, "creeLe", "dernierMessageLe") VALUES ($1, $2, 'QUESTION', $1, 'REPONDU', now(), now())`, [id, userId]);
  await requete(`INSERT INTO "EquipeMessage" (id, "filId", auteur, corps, "creeLe") VALUES ($1, $2, 'ABONNE', 'Ma question D11b', now())`, [`${id}a`, id]);
  await requete(`INSERT INTO "EquipeMessage" (id, "filId", auteur, corps, "creeLe") VALUES ($1, $2, 'EQUIPE', 'Réponse D11b', now())`, [`${id}e`, id]);
  return id;
}

const premierPasFait = (userId: string) =>
  requete(`INSERT INTO "EspaceCompte" ("userId", "premierPasLe", "updatedAt") VALUES ($1, now(), now()) ON CONFLICT ("userId") DO UPDATE SET "premierPasLe" = now()`, [userId]);

test.describe("@espace D11b : retours et états (ouvert)", () => {
  localSeulement();
  test.skip(!ESPACE_OUVERT, "E2E_ESPACE_OUVERT=1 requis : serveur construit interrupteur ouvert");
  test.setTimeout(90_000);

  test("Q-1 : visiteur sur un fil, connexion, retour sur ce fil", async ({ page }) => {
    const abonne = await compte("PREMIUM", "q1");
    const id = await fil(abonne.id);
    const adresse = `/mon-espace/questions/${id}`;
    await page.goto(adresse);
    await expect(page).toHaveURL(/\/login\?/);
    expect(new URL(page.url()).searchParams.get("callbackUrl")).toBe(adresse);
    await page.getByLabel(/e-?mail/i).fill(abonne.email);
    await page.locator("#password").fill(MOT_DE_PASSE);
    await page.getByRole("button", { name: "Se connecter" }).click();
    await page.waitForURL((u) => u.pathname === adresse, { timeout: 30_000 });
    await expect(page.getByText("Réponse D11b")).toBeVisible();
  });

  test("@ux D-5 : ancien abonné sur l'adresse d'un fil : historique en lecture seule de « Mon profil »", async ({ page }) => {
    const ancien = await compte("FREE", "d5");
    await requete(`INSERT INTO "Subscription" (id, "userId", "stripeSubscriptionId", "updatedAt") VALUES ($1, $2, $3, now())`, [`${ancien.id}s`, ancien.id, `sub_e2e_${ancien.id}`]);
    const id = await fil(ancien.id);
    await connecter(page, ancien.email, MOT_DE_PASSE);
    await page.goto(`/mon-espace/questions/${id}`);
    await page.waitForURL((u) => u.pathname === "/profil", { timeout: 30_000 });
    expect(new URL(page.url()).hash).toBe("#mes-questions");
    await expect(page.locator("#mes-questions")).toBeVisible({ timeout: 20_000 });
    await expect(page.locator("#mes-questions").getByText(/^Répondu le /)).toBeVisible();
    // Toute autre page de l'espace : l'offre, comme avant.
    await page.goto("/mon-espace/questions");
    await expect(page).toHaveURL(/\/abonnement/);
  });

  test("@ux D-3 : marche 3 toute essayée : une ligne et le lien vers la marche ouverte", async ({ page }) => {
    const abonne = await compte("PREMIUM", "d3");
    for (const m of MISSIONS.filter((x) => x.marche === 3)) {
      await requete(`INSERT INTO "MissionRetour" (id, "userId", "missionId", marche, retour, cle) VALUES ($1, $2, $3, 3, 'essaye-bof', $1)`, [`${abonne.id}${m.id}`, abonne.id, m.id]);
    }
    await connecter(page, abonne.email, MOT_DE_PASSE);
    await page.goto("/mon-espace/s-entrainer?marche=3");
    const vide = page.getByTestId("mission-vide");
    await expect(vide).toContainText("Pas de mission pour cette marche pour l'instant.");
    const lien = vide.getByRole("link");
    await expect(lien).toHaveAttribute("href", /\/mon-espace\/s-entrainer\?marche=[1245]#mission$/);
    for (const n of [1, 2, 4, 5]) {
      await page.goto(`/mon-espace/s-entrainer?marche=${n}`);
      await expect(page.locator("#mission")).toBeVisible();
      await expect(page.getByTestId("mission-vide")).toHaveCount(0);
    }
  });

  test("@ux D-7 et D-1 : après « Fait », « Aujourd'hui » reste à portée ; semaine 4 sans « Écouter »", async ({ page }) => {
    const abonne = await compte("PREMIUM", "d7");
    await premierPasFait(abonne.id);
    await page.setViewportSize({ width: 375, height: 812 });
    await connecter(page, abonne.email, MOT_DE_PASSE);
    await page.goto("/mon-espace/fiche/situation/coloc-la-poele");
    await page.getByRole("button", { name: "Essayé, ça a marché" }).first().click();
    await expect(page.getByRole("button", { name: "Essayé, ça a marché" }).first()).toHaveAttribute("aria-pressed", "true", { timeout: 15_000 });
    const aujourdhui = page.locator("[data-espace-barre]").getByRole("link", { name: "Aujourd’hui" });
    await expect(aujourdhui).toBeInViewport();
    await aujourdhui.click();
    await expect(page).toHaveURL(/\/mon-espace$/);

    await page.goto("/parcours");
    const semaines = page.locator("section[aria-labelledby='semaines-titre'] li");
    await expect(semaines).toHaveCount(4);
    await expect(semaines.nth(3)).toHaveText(/^Semaine 4\s?:\s?l.étape suivante, une mission en face\.$/);
  });
});
