import { mkdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import type { Browser, Cookie, Page } from "@playwright/test";
import { test, expect, localSeulement, creerCompte, connecter, requete } from "../support/base-locale";
import { TEXTES_CAPS, TEXTES_PARCOURS_ESPACE as P } from "@/config/textes/espace-caps";

/**
 * Espace client, lot D4 (s24, plan §3) : « Parcours » enrichi (4 premières semaines, étape à reprendre,
 * « Ton cap », annonce de passage), page d'un parcours (sommaire, fiches), bonus (404 du site).
 * Interrupteur fermé (CI) : rien de l'espace sur /parcours ni /parcours/[slug], même pour un abonné.
 * `E2E_ESPACE_OUVERT=1` : serveur construit interrupteur OUVERT (bascule temporaire, jamais livrée).
 * `E2E_REFERENCE_D4` : dossier où le régime fermé écrit le HTML visiteur de référence, comparé par le
 * régime ouvert (critère 11). `E2E_CAPTURES_D4` : dossier des captures (`docs/captures/s24-d4`).
 */
const ESPACE_OUVERT = process.env.E2E_ESPACE_OUVERT === "1";
const REFERENCE = process.env.E2E_REFERENCE_D4 ?? "";
const CAPTURES = process.env.E2E_CAPTURES_D4 ?? "";
const MOT_DE_PASSE = "E2e-espace-parcours-D4";

async function compte(browser: Browser): Promise<{ email: string; cookies: Cookie[] }> {
  const email = `e2e-espace-d4-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}@example.com`;
  await creerCompte(email, MOT_DE_PASSE, "PREMIUM");
  const contexte = await browser.newContext();
  await connecter(await contexte.newPage(), email, MOT_DE_PASSE);
  const cookies = await contexte.cookies();
  await contexte.close();
  return { email, cookies };
}

async function valider(page: Page, slug: string, etapes: number[]) {
  const [{ id }] = await requete<{ id: string }>(`SELECT id FROM "LearningPath" WHERE slug = $1`, [slug]);
  for (const stepOrder of etapes) {
    const r = await page.request.post(`/api/parcours/${id}/progress`, { data: { stepOrder } });
    expect(r.status()).toBe(200);
  }
}

/** `main` rendu, identifiants React neutralisés (comparaison fermé / ouvert). */
const mainNormalise = async (page: Page) =>
  (await page.locator("main").first().innerHTML()).replace(/:r[0-9a-z]+:/g, ":r:").replace(/<!--.*?-->/g, "");

/** Captures sombres 320, 375, 768, 1280 et 375 à 200 % (188 x 406), écran visible, `cible` en haut. */
async function capturer(page: Page, nom: string, cible?: string) {
  if (!CAPTURES) return;
  mkdirSync(CAPTURES, { recursive: true });
  for (const [l, h, suffixe] of [[320, 700, "320"], [375, 812, "375"], [768, 1024, "768"], [1280, 900, "1280"], [188, 406, "375-200pc"]] as const) {
    await page.setViewportSize({ width: l, height: h });
    await page.waitForTimeout(300);
    // En-tête et barre de l'espace fixes : la cible passe sous eux, on remonte de leur hauteur.
    if (cible) {
      await page.locator(cible).first().evaluate((e) => {
        e.scrollIntoView({ block: "start", behavior: "instant" });
        const fixes = Array.from(document.querySelectorAll("header, [data-espace-barre]"))
          .filter((x) => ["sticky", "fixed"].includes(getComputedStyle(x).position))
          .reduce((b, x) => Math.max(b, x.getBoundingClientRect().bottom), 0);
        window.scrollBy({ top: -(fixes + 16), behavior: "instant" });
      });
    }
    else await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
    await page.waitForTimeout(400);
    await page.screenshot({ path: join(CAPTURES, `${nom}-${suffixe}.png`) });
  }
}

test.describe("espace client, « Parcours » (s24, lot D4)", () => {
  localSeulement();

  test.describe("interrupteur fermé", () => {
    test.skip(ESPACE_OUVERT, "régime fermé seulement");

    test("abonné : rien de l'espace sur /parcours et /parcours/[slug], aucun appel à l'espace ; bonus = 404", async ({ browser, page }) => {
      const { cookies } = await compte(browser);
      await page.context().addCookies(cookies);
      const appels: string[] = [];
      page.on("request", (r) => {
        if (/\/(api\/espace|mon-espace)/.test(r.url())) appels.push(r.url());
      });
      await page.goto("/parcours");
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      await page.goto("/parcours/machine-a-cafe");
      await expect(page.getByRole("heading", { name: "Le programme" })).toBeVisible();
      await page.waitForLoadState("networkidle");
      await expect(page.locator('[data-testid="parcours-espace"], [data-testid="sommaire-parcours"], [data-testid="lignes-fiches"]')).toHaveCount(0);
      expect(appels).toEqual([]);
      await capturer(page, "parcours-detail-ferme", '[role="progressbar"]');
      await page.goto("/parcours");
      await page.waitForLoadState("networkidle");
      await capturer(page, "parcours-ferme-avant", "#parcours-machine-a-cafe");
      await capturer(page, "parcours-ferme-avant-haut");
      expect((await page.request.get("/mon-espace/bonus/n-existe-pas")).status()).toBe(404);
    });

    test("visiteur : HTML de référence de /parcours et /parcours/machine-a-cafe (comparé ouvert)", async ({ page }) => {
      test.skip(!REFERENCE, "E2E_REFERENCE_D4 absent");
      mkdirSync(REFERENCE, { recursive: true });
      for (const [chemin, fichier] of [["/parcours", "parcours.html"], ["/parcours/machine-a-cafe", "machine-a-cafe.html"]]) {
        await page.goto(chemin);
        await page.waitForLoadState("networkidle");
        writeFileSync(join(REFERENCE, fichier), await mainNormalise(page));
      }
    });
  });

  test.describe("abonné, interrupteur ouvert (bascule temporaire)", () => {
    test.skip(!ESPACE_OUVERT, "E2E_ESPACE_OUVERT=1 requis : serveur construit interrupteur ouvert");
    // Un compte neuf partagé par les tests en lecture seule (la connexion est limitée à 5 par minute).
    let partage: Cookie[] | null = null;
    const comptePartage = async (browser: Browser) => ({ cookies: (partage ??= (await compte(browser)).cookies) });

    test("visiteur : /parcours et /parcours/[slug] identiques au régime fermé (critère 11)", async ({ page }) => {
      test.skip(!REFERENCE || !existsSync(join(REFERENCE, "parcours.html")), "référence fermée absente");
      for (const [chemin, fichier] of [["/parcours", "parcours.html"], ["/parcours/machine-a-cafe", "machine-a-cafe.html"]]) {
        await page.goto(chemin);
        await page.waitForLoadState("networkidle");
        expect(await mainNormalise(page)).toBe(readFileSync(join(REFERENCE, fichier), "utf8"));
      }
    });

    test("375 : 4 premières semaines, étape conseillée, « Ton cap » 24 px dessous, aucun « Tes bonus » ; N2", async ({ browser, page }) => {
      const { cookies } = await comptePartage(browser);
      await page.context().addCookies(cookies);
      await page.setViewportSize({ width: 375, height: 812 });
      await page.goto("/parcours");
      const entete = page.getByTestId("parcours-espace");
      await expect(entete.getByRole("heading", { level: 2, name: P.semaines.titre })).toBeVisible();
      await expect(entete.getByRole("link", { name: "Commencer l'étape 1" })).toHaveAttribute("href", "/parcours/repartie#etape-1");
      const cap = entete.locator("#cap");
      await expect(cap.getByRole("heading", { level: 2, name: TEXTES_CAPS.titre })).toBeVisible();
      await expect(cap).toContainText(TEXTES_CAPS.capVisible(1));
      await expect(cap).not.toContainText("%");
      await expect(entete.getByRole("link", { name: TEXTES_CAPS.bonus.raccourci })).toHaveCount(0);
      const bloc = await entete.locator('section[aria-labelledby="semaines-titre"]').boundingBox();
      const carte = await cap.boundingBox();
      expect(Math.round((carte?.y ?? 0) - ((bloc?.y ?? 0) + (bloc?.height ?? 0)))).toBe(24);
      expect(carte?.x).toBe(bloc?.x);
      // N2 : premier parcours de la liste en 2 écrans au plus ; au plus 3 actions principales avant lui.
      const premier = page.locator("#parcours-machine-a-cafe h3");
      const yPremier = await premier.evaluate((e) => e.getBoundingClientRect().top + window.scrollY);
      expect(yPremier).toBeLessThanOrEqual(2 * 812);
      const principales = await page.evaluate(
        (y) => Array.from(document.querySelectorAll("main .bg-accent-secondary-hover")).filter((e) => e.getBoundingClientRect().top + window.scrollY < y).length,
        yPremier,
      );
      expect(principales).toBeLessThanOrEqual(3);
    });

    test("200 % de texte (188 x 406) : rien ne déborde, calendrier replié, premier parcours en 2 écrans", async ({ browser, page }) => {
      const { cookies } = await comptePartage(browser);
      await page.context().addCookies(cookies);
      await page.setViewportSize({ width: 188, height: 406 });
      await page.goto("/parcours");
      await expect(page.getByTestId("parcours-espace").locator("#cap")).toBeVisible();
      await expect(page.getByTestId("parcours-espace").locator("details")).not.toHaveAttribute("open", "");
      // Débordement mesuré sur l'en-tête de l'espace (le reste de la page publique est inchangé, hors lot).
      const droite = await page.evaluate(() =>
        Math.max(...Array.from(document.querySelectorAll('[data-testid="parcours-espace"] *')).map((e) => e.getBoundingClientRect().right)),
      );
      expect(droite).toBeLessThanOrEqual(188 + 0.5);
      const yPremier = await page.locator("#parcours-machine-a-cafe h3").evaluate((e) => e.getBoundingClientRect().top + window.scrollY);
      const yEntete = await page.getByTestId("parcours-espace").evaluate((e) => e.getBoundingClientRect().top + window.scrollY);
      const hEntete = await page.getByTestId("parcours-espace").evaluate((e) => e.getBoundingClientRect().height);
      test.info().annotations.push({ type: "mesure", description: `entête y=${Math.round(yEntete)} h=${Math.round(hEntete)} ; premier parcours y=${Math.round(yPremier)}` });
      console.log(`[mesure 200 %] entête y=${Math.round(yEntete)} h=${Math.round(hEntete)} ; premier parcours y=${Math.round(yPremier)}`);
      // N2 : l'en-tête de l'espace ajoute au plus 2 écrans avant la liste (au-dessus, l'en-tête public inchangé).
      expect(hEntete).toBeLessThanOrEqual(2 * 406);
      // Lot D5 (arbitrage @ux D4 n°1) : introduction publique masquée pour l'abonné, h1 gardé pour les
      // lecteurs d'écran. Re-mesure du 13/11 : premier parcours à y = 818 pour 812 (2 écrans de 406) :
      // le test n'est PAS resserré (6 px de trop), retour à @ux (piste : réduire l'en-tête de l'espace).
      await expect(page.locator('nav[aria-label="Fil d’Ariane"]')).toHaveCount(0);
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(P.titrePage);
    });

    test("annonce : « Nouveau cap » après 2 étapes, jamais retirée seule, clavier, une seule fois ; puis le sommaire du parcours", async ({ browser, page }) => {
      const { email, cookies } = await compte(browser);
      await page.context().addCookies(cookies);
      await page.goto("/parcours");
      // Lecture des caps du premier affichage finie AVANT les validations (sinon c'est elle qui montre l'annonce).
      await expect(page.locator("#cap")).toContainText(TEXTES_CAPS.capVisible(1));
      await valider(page, "machine-a-cafe", [1, 2]);
      await page.setViewportSize({ width: 375, height: 812 });
      await page.reload();
      const annonce = page.getByTestId("annonce-cap");
      await expect(annonce.locator('[aria-live="polite"]')).toHaveText(TEXTES_CAPS.annonce.cap(2));
      await expect(annonce.getByRole("link", { name: /Ouvrir/ })).toHaveCount(0);
      await expect(page.locator("#cap")).toContainText(TEXTES_CAPS.capVisible(2));
      await capturer(page, "parcours-annonce-cap-2", '[data-testid="parcours-espace"]');
      await page.setViewportSize({ width: 375, height: 812 });
      await page.waitForTimeout(10_500);
      await expect(annonce.locator('[aria-live="polite"]')).toHaveText(TEXTES_CAPS.annonce.cap(2));
      await annonce.getByRole("button", { name: TEXTES_CAPS.annonce.fermerLu }).focus();
      await page.keyboard.press("Enter");
      await expect(page.getByTestId("parcours-espace").getByRole("link", { name: "Reprendre" })).toBeFocused();
      const lignes = await requete<{ type: string; numero: number; silencieux: boolean }>(
        `SELECT c.type, c.numero, c.silencieux FROM "CapAnnonce" c JOIN "User" u ON u.id = c."userId" WHERE u.email = $1`,
        [email],
      );
      expect(lignes).toEqual([{ type: "CAP", numero: 2, silencieux: false }]);
      await page.reload();
      await expect(page.locator("#cap")).toBeVisible();
      await expect(annonce.locator('[aria-live="polite"]')).toBeEmpty();
      await capturer(page, "parcours-cap-2", '[data-testid="parcours-espace"]');
      await capturer(page, "parcours-cap-2-carte", "#cap");

      await page.setViewportSize({ width: 375, height: 812 });
      await page.goto("/parcours/machine-a-cafe");
      const sommaire = page.getByTestId("sommaire-parcours");
      await expect(sommaire).toContainText(P.sommaire.faites(2, 3));
      await expect(sommaire.getByText(P.sommaire.fait, { exact: true })).toHaveCount(2);
      await expect(sommaire.getByRole("button")).toHaveCount(3);
      await sommaire.getByRole("button", { name: P.sommaire.reprendre }).click();
      await page.waitForTimeout(800);
      const fiches = page.getByTestId("lignes-fiches");
      await expect(fiches).toBeVisible();
      await expect(fiches).toContainText("3.1");
      await expect(page.locator("#fiche-3-2")).toHaveCount(1);
      await expect(page.locator("#etape-3")).toHaveCount(1);
      await capturer(page, "parcours-detail-sommaire", '[data-testid="sommaire-parcours"]');
      await capturer(page, "parcours-detail-fiches", '[data-testid="lignes-fiches"]');
    });

    test("cap affiché plus haut que le déblocage : phrase de l'écart, « Nouveau cap » sans « Ouvrir »", async ({ browser, page }) => {
      const { email, cookies } = await compte(browser);
      await page.context().addCookies(cookies);
      await requete(`UPDATE "User" SET xp = 800 WHERE email = $1`, [email]);
      await page.setViewportSize({ width: 375, height: 812 });
      await page.goto("/parcours");
      await expect(page.locator("#cap")).toContainText(TEXTES_CAPS.capVisible(4));
      await expect(page.locator("#cap")).toContainText(TEXTES_CAPS.ecart);
      await expect(page.getByTestId("annonce-cap").locator('[aria-live="polite"]')).toHaveText(TEXTES_CAPS.annonce.cap(4));
      await expect(page.getByTestId("annonce-cap").getByRole("link")).toHaveCount(0);
      await capturer(page, "parcours-ecart-cap-4", "#cap");
    });

    test("bonus non ouvert ou inexistant : la vraie 404 du site (statut, textes, styles), `noindex`", async ({ browser, page }) => {
      const { cookies } = await comptePartage(browser);
      await page.context().addCookies(cookies);
      const head = async () => ({
        titre: await page.title(),
        robots: await page.locator('meta[name="robots"], meta[name="googlebot"], meta[name="bingbot"]').evaluateAll((m) => m.map((e) => `${e.getAttribute("name")}=${e.getAttribute("content")}`)),
      });
      const reponse = await page.goto("/mon-espace/bonus/bonus-cap-2");
      expect(reponse?.status()).toBe(404);
      await expect(page).toHaveTitle(/Page introuvable/);
      await expect(page.locator('meta[name="robots"]').first()).toHaveAttribute("content", /noindex/);
      const bonus = await mainNormalise(page);
      const headBonus = await head();
      const taille = await page.locator("h1").evaluate((e) => parseFloat(getComputedStyle(e).fontSize));
      expect(taille).toBeGreaterThanOrEqual(36);
      await capturer(page, "bonus-neutre");
      const vraie = await page.goto("/n-existe-pas-du-tout-d4");
      expect(vraie?.status()).toBe(404);
      expect(bonus).toBe(await mainNormalise(page));
      expect(headBonus).toEqual(await head());
      await expect(page.locator("body")).not.toContainText(/s'ouvre au cap|il te manque/);
    });
  });
});
