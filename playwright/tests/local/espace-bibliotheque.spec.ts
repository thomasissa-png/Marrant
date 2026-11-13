import { mkdirSync } from "node:fs";
import { join } from "node:path";
import type { Browser, Cookie, Page } from "@playwright/test";
import { test, expect, localSeulement, creerCompte, connecter, requete } from "../support/base-locale";
import { TEXTES_BIBLIOTHEQUE as BI, TEXTES_BILAN as B, TEXTES_COIN as N, TEXTES_LETTRES as L, TEXTES_QUOI_REPONDRE as Q } from "@/config/textes/espace-bibliotheque";
import { TEXTES_CARTES as C } from "@/config/textes/espace-cartes";
import { TEXTES_ESPACE_NAVIGATION as NAV } from "@/config/textes/espace-navigation";

/**
 * Espace client, lot D6 (s24, plan §3) : « Quoi répondre » (filtres, états), Bibliothèque (3 blocs), coin
 * « Humour noir, fait bien » (geste « Entrer » au clavier, focus au titre, « Sortir »), « Plus », Lettres
 * (aucune lettre avant son envoi), fiche et bilan du parcours. Fermé (CI) : tout est la 404. Ouvert
 * (`E2E_ESPACE_OUVERT=1`) : serveur construit interrupteur OUVERT avec les FIXTURES copiées dans
 * `data/espace/{situations,humour-noir,bilans,constructions}.json` (bascule temporaire, rétablie par `trap`).
 */
const ESPACE_OUVERT = process.env.E2E_ESPACE_OUVERT === "1";
const CAPTURES = process.env.E2E_CAPTURES_D6 ?? "";
/** Reste du D6, fait au lot D5b : captures dans `docs/captures/s24-d5b`. */
const CAPTURES_D5B = process.env.E2E_CAPTURES_D5B ?? "";
const MOT_DE_PASSE = "E2e-espace-bibliotheque-D6";
const NOUVELLES = ["/mon-espace/quoi-repondre", "/mon-espace/bibliotheque", "/mon-espace/lettres", "/mon-espace/lettres/2026-W46", "/mon-espace/fiche/situation/coloc-la-poele"];

async function compte(browser: Browser): Promise<{ email: string; cookies: Cookie[] }> {
  const email = `e2e-espace-d6-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}@example.com`;
  await creerCompte(email, MOT_DE_PASSE, "PREMIUM");
  const contexte = await browser.newContext();
  await connecter(await contexte.newPage(), email, MOT_DE_PASSE);
  const cookies = await contexte.cookies();
  await contexte.close();
  return { email, cookies };
}

async function capturer(page: Page, nom: string, dossier = CAPTURES, recharger = false) {
  if (!dossier) return;
  mkdirSync(dossier, { recursive: true });
  for (const [l, h, s] of [[320, 700, "320"], [375, 812, "375"], [768, 1024, "768"], [1280, 900, "1280"], [188, 406, "375-200pc"]] as const) {
    await page.setViewportSize({ width: l, height: h });
    // Filtres repliés : l'état fermé ne se voit qu'au chargement (le passage à 640 px les ouvre).
    if (recharger) await page.reload();
    await page.waitForTimeout(300);
    await page.screenshot({ path: join(dossier, `${nom}-${s}.png`), fullPage: true });
  }
  await page.setViewportSize({ width: 375, height: 812 });
}

/** « Tu avais une réponse ? » : attend la fin de « Prends ton temps » (3 s), puis touche. */
async function repondre(page: Page, portee: ReturnType<Page["locator"]>, nom: string) {
  await expect(portee.getByText(C.prendsTonTemps)).toBeHidden({ timeout: 6_000 });
  await portee.getByRole("button", { name: nom, exact: true }).click();
}

const debordement = (page: Page) => page.evaluate(() => Math.max(...Array.from(document.querySelectorAll("main *")).map((e) => e.getBoundingClientRect().right)));

test.describe("espace client, Quoi répondre, Bibliothèque, Lettres (s24, lot D6)", () => {
  localSeulement();

  test("interrupteur fermé : pages et route du coin = 404, aucun témoin posé", async ({ browser, page }) => {
    test.skip(ESPACE_OUVERT, "régime fermé seulement");
    await page.context().addCookies((await compte(browser)).cookies);
    for (const chemin of NOUVELLES) expect([chemin, (await page.goto(chemin))?.status()]).toEqual([chemin, 404]);
    const r = await page.request.post("/api/espace/humour-noir", { data: { entrer: true } });
    expect(r.status()).toBe(404);
    expect(r.headers()["set-cookie"]).toBeUndefined();
    const appels: string[] = [];
    page.on("request", (q) => q.url().includes("/api/espace") && appels.push(q.url()));
    for (const chemin of ["/vannes", "/carnet", "/favoris"]) await page.goto(chemin);
    expect(appels).toEqual([]);
  });

  test.describe("interrupteur ouvert, fixtures", () => {
    test.skip(!ESPACE_OUVERT, "E2E_ESPACE_OUVERT=1 requis (serveur construit ouvert, fixtures copiées)");

    test("« Quoi répondre » : liste, filtre, vide avec « Raconte-la à l'équipe » ; reprise de lettre après l'envoi seulement", async ({ browser, page }) => {
      const { email, cookies } = await compte(browser);
      await page.context().addCookies(cookies);
      await page.setViewportSize({ width: 375, height: 812 });
      await page.goto("/mon-espace/quoi-repondre");
      await expect(page.getByRole("heading", { level: 1, name: Q.titre })).toBeVisible();
      await expect(page.locator('a[aria-current="page"]', { hasText: NAV.rubriques.quoiRepondre })).toHaveCount(1);
      await expect(page.locator('[data-fiche="coloc-la-poele"]')).toBeVisible();
      await expect(page.locator('[data-fiche="apres-l-expose"]')).toHaveCount(0);
      await capturer(page, "quoi-repondre-liste");
      // Reste du D6 (arbitrage @ux D6 n°1) : sous 640 px, filtres repliés, la liste dans le premier écran.
      const replies = page.locator("[data-filtres-replies]");
      await expect(replies).not.toHaveAttribute("open", "");
      await expect(replies.locator("summary")).toHaveText(`${Q.filtreOu} ${Q.filtrePour}`);
      expect((await replies.locator("summary").boundingBox())!.height).toBeGreaterThanOrEqual(44);
      await expect(page.getByRole("link", { name: Q.univers.coloc, exact: true })).toBeHidden();
      const yLigne = await page.locator('[data-fiche="coloc-la-poele"]').evaluate((e) => e.getBoundingClientRect().top + window.scrollY);
      expect(yLigne).toBeLessThan(812);
      await capturer(page, "quoi-repondre-replie", CAPTURES_D5B, true);
      await replies.locator("summary").click();
      await expect(replies).toHaveAttribute("open", "");
      await capturer(page, "quoi-repondre-ouvert", CAPTURES_D5B);
      await page.getByRole("link", { name: Q.univers.coloc, exact: true }).click();
      await expect(page).toHaveURL(/\?ou=coloc$/);
      await expect(page.getByRole("link", { name: Q.univers.coloc, exact: true })).toHaveAttribute("aria-current", "true");
      // Choisir une puce garde le bloc ouvert ; le summary nomme la valeur choisie.
      await expect(replies).toHaveAttribute("open", "");
      await expect(replies.locator("summary")).toHaveText(Q.univers.coloc);
      await capturer(page, "quoi-repondre-filtre", CAPTURES_D5B);
      await page.getByRole("link", { name: Q.pourQuoiFaire["prendre-la-parole"], exact: true }).click();
      await expect(page.getByTestId("quoi-repondre-vide")).toContainText(Q.vide);
      await expect(page.getByRole("link", { name: Q.raconte })).toHaveAttribute("href", "/mon-espace/questions");
      await capturer(page, "quoi-repondre-vide");
      // La lettre W46 part (première ligne ENVOYE) : la reprise arrive, l'archive aussi ; W47, datée demain, nulle part.
      await requete(`INSERT INTO "NewsletterSend" (id, "issueId", email, status, "sentAt", "updatedAt") SELECT $1, id, $2, 'ENVOYE', now() - interval '1 day', now() FROM "NewsletterIssue" WHERE "periodKey" = '2026-W46'`, [`${email}-46`, email]);
      await requete(`INSERT INTO "NewsletterSend" (id, "issueId", email, status, "sentAt", "updatedAt") SELECT $1, id, $2, 'ENVOYE', now() + interval '1 day', now() FROM "NewsletterIssue" WHERE "periodKey" = '2026-W47'`, [`${email}-47`, email]);
      try {
        await page.goto("/mon-espace/quoi-repondre?pour=repondre-chambrage");
        await page.locator('[data-fiche="apres-l-expose"]').click();
        const vu = page.getByRole("link", { name: /^Vu dans la lettre du / });
        await expect(vu).toHaveAttribute("href", "/mon-espace/lettres/2026-W46");
        await capturer(page, "fiche-reprise-lettre");
        await page.goto("/mon-espace/lettres");
        await expect(page.locator("[data-lettre]")).toHaveCount(1);
        await expect(page.locator('[data-lettre="2026-W46"]')).toContainText(/^La lettre du /);
        await capturer(page, "lettres");
        await page.locator('[data-lettre="2026-W46"]').click();
        await expect(page.getByRole("heading", { level: 1 })).toContainText("Tu avais un train ?");
        expect(await page.locator("main").innerText()).not.toMatch(/€|invitation-premium/);
        await capturer(page, "lettre");
        expect((await page.goto("/mon-espace/lettres/2026-W47"))?.status()).toBe(404);
      } finally {
        await requete(`DELETE FROM "NewsletterSend" WHERE email = $1`, [email]);
      }
    });

    test("fiche : répliques après « Tu avais une réponse ? » ; bilan : retour complet, renvoi, onglet « Parcours »", async ({ browser, page }) => {
      await page.context().addCookies((await compte(browser)).cookies);
      await page.setViewportSize({ width: 375, height: 812 });
      await page.goto("/mon-espace/fiche/situation/coloc-la-poele");
      await expect(page.getByTestId("fiche-suite")).toHaveCount(0);
      await repondre(page, page.locator("main"), C.reponses.MOITIE);
      await expect(page.getByTestId("fiche-suite")).toContainText(C.registres.joueuse);
      await capturer(page, "fiche-situation");
      await page.goto("/mon-espace/fiche/bilan/bilan-confiance");
      await expect(page.getByRole("heading", { level: 1, name: B.h1 })).toBeVisible();
      await expect(page.locator('a[aria-current="page"]', { hasText: NAV.rubriques.parcours })).toHaveCount(1);
      const carte = page.locator('[data-bilan="laquelle"]').first();
      await capturer(page, "bilan-avant");
      // Reste du D6 (arbitrage @ux D6 n°2) : à 200 %, options lisibles, aucun débordement.
      await page.setViewportSize({ width: 188, height: 406 });
      expect(await debordement(page)).toBeLessThanOrEqual(188 + 1);
      await capturer(page, "bilan-options", CAPTURES_D5B);
      await repondre(page, carte, C.reponses.OUI);
      await carte.getByRole("button", { name: /^A/ }).click();
      await expect(carte.getByTestId("bilan-retour")).toContainText(B.pasCelleLa);
      await expect(carte.getByRole("link", { name: B.deuxiemeTour("Énoncer la règle non écrite") })).toBeVisible();
      await expect(carte.getByRole("button", { name: /^B/ })).toBeDisabled();
      await capturer(page, "bilan-retour");
      await page.setViewportSize({ width: 188, height: 406 });
      expect(await debordement(page)).toBeLessThanOrEqual(188 + 1);
    });

    test("Bibliothèque : 3 blocs ; coin : rien avant « Entrer » (clavier, focus au titre), état gardé, « Sortir »", async ({ browser, page }) => {
      await page.context().addCookies((await compte(browser)).cookies);
      await page.setViewportSize({ width: 375, height: 812 });
      await page.goto("/mon-espace/bibliotheque");
      for (const t of [BI.blocVannes, BI.blocTechniques, N.titre]) await expect(page.getByRole("heading", { level: 2, name: t })).toBeVisible();
      await expect(page.getByRole("link", { name: "Boulot" })).toHaveAttribute("href", "/vannes/theme/boulot");
      // Reste du D6 (arbitrage @ux D6 n°3, validé par Thomas) : le catalogue public en trois liens.
      const catalogue = page.getByTestId("bibliotheque-catalogue");
      for (const c of BI.catalogue) await expect(catalogue.getByRole("link", { name: c.label, exact: true })).toHaveAttribute("href", c.href);
      for (const a of await catalogue.getByRole("link").all()) expect((await a.boundingBox())!.height).toBeGreaterThanOrEqual(44);
      await capturer(page, "bibliotheque-catalogue", CAPTURES_D5B);
      await expect(page.getByRole("link", { name: /Comment c'est construit : La règle de trois/ })).toBeVisible();
      expect(await page.content()).not.toContain("Qui est dans la pièce");
      await capturer(page, "bibliotheque-seuil");
      const entrer = page.getByRole("button", { name: N.entrer });
      expect((await entrer.boundingBox())!.height).toBeGreaterThanOrEqual(44);
      await entrer.focus();
      await page.keyboard.press("Enter");
      await expect(page.getByRole("heading", { level: 2, name: N.titre })).toBeFocused();
      await expect(page.getByRole("link", { name: /Qui est dans la pièce/ })).toBeVisible();
      await capturer(page, "bibliotheque-coin-entre");
      await page.reload();
      await expect(page.getByRole("link", { name: /Qui est dans la pièce/ })).toBeVisible();
      await page.getByRole("button", { name: N.sortir }).click();
      await expect(page.getByRole("button", { name: N.entrer })).toBeFocused();
      await page.reload();
      expect(await page.content()).not.toContain("Qui est dans la pièce");
      await page.goto("/mon-espace/fiche/humour-noir/hn-qui-est-dans-la-piece");
      await expect(page.getByRole("button", { name: N.entrer })).toBeVisible();
      expect(await page.content()).not.toContain("Qui est dans la pièce");
      await page.setViewportSize({ width: 188, height: 406 });
      expect(await debordement(page)).toBeLessThanOrEqual(188 + 1);
    });

    test("« Plus » : groupes « S'entraîner », « Mon contenu », « Le reste » ; Lettres vide sans lettre envoyée", async ({ browser, page }) => {
      await page.context().addCookies((await compte(browser)).cookies);
      await page.setViewportSize({ width: 1280, height: 900 });
      await page.goto("/mon-espace/lettres");
      await expect(page.getByRole("heading", { level: 1, name: L.titre })).toBeVisible();
      await expect(page.locator("[data-lettre]")).toHaveCount(0);
      // Reste du D6 (arbitrage @ux D6 n°5, validé par Thomas) : état vide et sortie vers « Aujourd'hui ».
      await expect(page.getByText(L.vide)).toBeVisible();
      await expect(page.getByRole("link", { name: L.allerAujourdhui })).toHaveAttribute("href", "/mon-espace");
      await capturer(page, "lettres-vide", CAPTURES_D5B);
      await page.setViewportSize({ width: 1280, height: 900 });
      await page.getByRole("button", { name: NAV.rubriques.plus }).click();
      const menu = page.getByRole("menu", { name: NAV.menuPlus.nom });
      await expect(menu.getByRole("menuitem", { name: NAV.menuPlus.sEntrainer })).toBeVisible();
      for (const g of [NAV.menuPlus.groupeMonContenu, NAV.menuPlus.groupeLeReste]) await expect(menu.getByText(g, { exact: true })).toBeVisible();
      for (const l of [NAV.menuPlus.favoris, NAV.menuPlus.mesRepliques, NAV.menuPlus.lettres]) await expect(menu.getByRole("menuitem", { name: l })).toBeVisible();
      await capturer(page, "menu-plus");
    });
  });
});
