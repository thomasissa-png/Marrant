import { randomBytes } from "node:crypto";
import path from "node:path";
import type { Locator, Page, Route } from "@playwright/test";
import { test, expect, localSeulement, requete, creerCompte, connecter } from "../support/base-locale";

/**
 * Captures du TRAJET ENCHAÎNÉ, tour 2 (grille docs/ux/trajet-conversion-s21.md §11 : 375 × 700 ET
 * 320 × 640, notées sur le plus étroit ; textes docs/copy/conversion-s21/textes-trajet-v2.md).
 * Stripe n'est pas capturable : `/api/stripe/checkout` est intercepté. Inscription par e-mail :
 * l'attente se fait dans le bouton de /register (capture « 05-avant-stripe »), le paiement est retenu
 * le temps de la capture. Retour de paiement (T1, T4) : paiement simulé comme dans
 * `conversion-v2-s21.spec.ts` (plan Premium en base, success_url de Stripe), capture de la page de retour.
 * Chaque trajet vérifie aussi que la source du clic arrive jusqu'à `checkout-ouvert`.
 *
 * Sur demande seulement : `CAPTURES_TRAJETS=1` (jamais en CI). Sortie :
 * docs/design/conversion-s21/trajets-v2/<trajet>/<taille>/.
 */
const SORTIE = path.join(__dirname, "..", "..", "..", "docs", "design", "conversion-s21", "trajets-v2");
const MDP = "MotDePasse-e2e-42";
const comptes: string[] = [];
const TAILLES = [
  { nom: "375x700", width: 375, height: 700 },
  { nom: "320x640", width: 320, height: 640 },
] as const;
type Taille = (typeof TAILLES)[number];
type Evenement = { nom: string; donnees: Record<string, unknown> };
type Fin = "stripe" | "bienvenue";

interface Contexte {
  page: Page;
  dossier: string;
  /** Libère le paiement retenu (après la capture de l'écran d'avant Stripe). */
  liberer: () => void;
  email: string;
}

async function preparer(page: Page, trajet: string, taille: Taille, fin: Fin = "stripe"): Promise<Contexte> {
  const email = `e2e-trajet-${randomBytes(4).toString("hex")}@example.com`;
  comptes.push(email);
  await page.setExtraHTTPHeaders({ "cf-connecting-ip": `10.${[1, 2, 3].map(() => randomBytes(1)[0]).join(".")}` });
  await page.addInitScript(() => {
    const faux = {
      track: (nom: string, donnees?: Record<string, unknown>) => {
        const liste = JSON.parse(sessionStorage.getItem("e2e-umami") ?? "[]");
        liste.push({ nom, donnees: donnees ?? {} });
        sessionStorage.setItem("e2e-umami", JSON.stringify(liste));
      },
    };
    Object.defineProperty(window, "umami", { get: () => faux, set: () => undefined, configurable: true });
  });
  let liberer: () => void = () => undefined;
  const retenu = new Promise<void>((r) => (liberer = r));
  await page.route("**/api/stripe/checkout", async (route: Route) => {
    const corps = JSON.parse(route.request().postData() ?? "{}") as Record<string, string>;
    await retenu;
    if (fin === "bienvenue") {
      await requete(`UPDATE "User" SET plan = 'PREMIUM'::"Plan", "updatedAt" = now() WHERE email = $1`, [email]);
      const retour = corps.returnTo ? `&returnTo=${encodeURIComponent(corps.returnTo)}` : "";
      await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ url: `/abonnement/success?session_id=cs_test_e2e_local${retour}` }) });
    } else {
      await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ url: "/?stripe-simule=1" }) });
    }
  });
  await page.setViewportSize({ width: taille.width, height: taille.height });
  return { page, dossier: path.join(SORTIE, trajet, taille.nom), liberer: () => liberer(), email };
}

async function capture(c: Contexte, nom: string, pleine = false) {
  await c.page.waitForTimeout(400);
  await c.page.screenshot({ path: path.join(c.dossier, `${nom}.png`), fullPage: pleine, animations: "disabled" });
}

/** Met l'élément cliqué au centre de l'écran, cadre visible, puis capture. */
async function captureClic(c: Contexte, nom: string, cible: Locator) {
  await cible.scrollIntoViewIfNeeded();
  await cible.evaluate((el) => el.scrollIntoView({ block: "center" }));
  await cible.evaluate((el) => ((el as HTMLElement).style.outline = "3px solid #F59E0B"));
  await capture(c, nom);
  await cible.evaluate((el) => ((el as HTMLElement).style.outline = ""));
}

async function abonnement(c: Contexte) {
  await expect(c.page).toHaveURL(/\/abonnement/);
  await expect(c.page.getByRole("heading", { level: 1 })).toBeVisible();
  await capture(c, "02-abonnement-premier-ecran");
  await capture(c, "03-abonnement-complete", true);
}

async function evenements(page: Page): Promise<Evenement[]> {
  return (await page.evaluate(() => JSON.parse(sessionStorage.getItem("e2e-umami") ?? "[]"))) as Evenement[];
}

/** /register, inscription ; l'attente dans le bouton est capturée, puis le paiement simulé part. */
async function inscription(c: Contexte, srcAttendue: string, fin: Fin = "stripe", formule = "mensuel") {
  await expect(c.page).toHaveURL(/\/register\?/);
  await expect(c.page.getByRole("heading", { level: 1 })).toBeVisible();
  await capture(c, "04-register");
  await c.page.locator("#email").fill(c.email);
  await c.page.locator("#password").fill(MDP);
  await c.page.getByRole("button", { name: /Créer mon compte/ }).click();
  await expect(c.page.getByTestId("register-bouton")).toHaveText("On t’emmène au paiement…", { timeout: 30_000 });
  await capture(c, "05-avant-stripe");
  c.liberer();
  if (fin === "bienvenue") {
    await c.page.waitForURL(/premium=bienvenue/, { timeout: 60_000 });
    await expect(c.page.getByText("Bienvenue dans Premium")).toBeVisible();
    await c.page.waitForTimeout(800);
    await capture(c, "06-retour-bienvenue");
  } else {
    await c.page.waitForURL(/stripe-simule=1/, { timeout: 30_000 });
  }
  const ouvert = (await evenements(c.page)).filter((e) => e.nom === "checkout-ouvert");
  expect(ouvert, JSON.stringify(ouvert)).toHaveLength(1);
  expect(ouvert[0].donnees).toMatchObject({ src: srcAttendue, formule });
}

const enTete = (page: Page) => page.getByRole("banner").locator("a[href='/abonnement?src=header']").filter({ visible: true }).first();

test.describe("Captures des trajets de conversion s21, tour 2 (375 × 700 et 320 × 640)", () => {
  localSeulement();
  test.skip(process.env.CAPTURES_TRAJETS !== "1", "captures sur demande : CAPTURES_TRAJETS=1");
  test.setTimeout(150_000);

  test.afterAll(async () => {
    if (!comptes.length) return;
    await requete(`DELETE FROM "UserFavorite" WHERE "userId" IN (SELECT id FROM "User" WHERE email = ANY($1))`, [comptes]);
    await requete(`DELETE FROM "User" WHERE email = ANY($1)`, [comptes]);
  });

  for (const taille of TAILLES) {
    test(`T1 en-tête (visiteur), jusqu'au retour de paiement, ${taille.nom}`, async ({ page }) => {
      const c = await preparer(page, "T1-en-tete", taille, "bienvenue");
      await page.goto("/conseils");
      const lien = enTete(page);
      await captureClic(c, "01-entree-clic", lien);
      await lien.click();
      await abonnement(c);
      await page.getByTestId("abonnement-bouton-achat").click();
      await inscription(c, "header", "bienvenue");
    });

    test(`T1 annuel (visiteur) jusqu'à l'attente, ${taille.nom}`, async ({ page }) => {
      const c = await preparer(page, "T1-annuel", taille);
      await page.goto("/conseils");
      await enTete(page).click();
      await page.getByTestId("formule-annual").click();
      await expect(page.getByTestId("renouvellement-annuel")).toBeVisible();
      await capture(c, "02-abonnement-annuel-premier-ecran");
      await capture(c, "03-abonnement-annuel-complete", true);
      await page.getByTestId("abonnement-bouton-achat").click();
      await expect(page.getByTestId("register-rappel-offre")).toContainText("24,99");
      await inscription(c, "header", "stripe", "annuel");
    });

    test(`T1 annuel, page d'attente brève (connexion), ${taille.nom}`, async ({ page }) => {
      const c = await preparer(page, "T1-annuel", taille);
      await creerCompte(c.email, MDP, "FREE");
      await connecter(page, c.email, MDP);
      await page.setViewportSize({ width: taille.width, height: taille.height });
      await page.goto("/abonnement?plan=annual&src=header&auto=1");
      await expect(page.getByTestId("abonnement-attente")).toBeVisible();
      await capture(c, "05b-page-attente-connexion");
      c.liberer();
    });

    test(`T2 mur de liste /vannes (visiteur), ${taille.nom}`, async ({ page }) => {
      const c = await preparer(page, "T2-mur-vannes", taille);
      await page.goto("/vannes");
      const bouton = page.getByRole("link", { name: /^Ouvrir la suite des vannes/ }).first();
      await captureClic(c, "01-entree-clic", bouton);
      await bouton.click();
      await abonnement(c);
      await page.getByTestId("abonnement-bouton-achat").click();
      await inscription(c, "mur-vannes");
    });

    test(`T3 fin d'étape 1 (visiteur), ${taille.nom}`, async ({ page }) => {
      const c = await preparer(page, "T3-fin-etape-1", taille);
      await page.goto("/parcours/repartie");
      // Fin d'étape 1 réelle : le quiz de l'étape 1 est fait (sinon variante courte, sans carte).
      for (let i = 0; i < 10; i++) {
        const options = page.locator('[role="group"][aria-labelledby^="quiz-q-"] button');
        if ((await options.count()) === 0) break;
        await options.first().click();
        await page.getByRole("button", { name: /^(Question suivante|Voir le résultat)$/ }).click();
      }
      const carte = page.locator("[data-fin-etape-1]");
      await expect(carte).toContainText(/Étape 2 sur \d/);
      await page.waitForTimeout(600);
      await carte.evaluate((el) => {
        const haut = el.getBoundingClientRect().top + window.scrollY - 72;
        document.documentElement.style.scrollBehavior = "auto";
        window.scrollTo({ top: haut, behavior: "instant" as ScrollBehavior });
      });
      await capture(c, "01a-carte-etape-2");
      const bouton = page.getByRole("link", { name: /^Passer à l’étape 2/ }).first();
      await captureClic(c, "01-entree-clic", bouton);
      await bouton.click();
      await expect(page.getByTestId("register-rappel-offre")).toContainText("l’étape 2 de Répartie s’ouvre");
      await inscription(c, "parcours-etape");
    });

    test(`T4 fenêtre Premium (visiteur, étoile d'une vanne), jusqu'au favori ajouté, ${taille.nom}`, async ({ page }) => {
      const c = await preparer(page, "T4-fenetre-premium", taille, "bienvenue");
      await page.goto("/vannes");
      const etoile = page.getByRole("button", { name: /Ajouter aux favoris/ }).first();
      await captureClic(c, "01-entree-clic", etoile);
      await etoile.click();
      const fenetre = page.getByRole("dialog");
      await expect(fenetre).toBeVisible();
      await capture(c, "02-fenetre");
      await fenetre.getByRole("link", { name: /^S’abonner/ }).click();
      await inscription(c, "modale-favoris", "bienvenue");
      await expect(page.getByRole("button", { name: "Retirer des favoris" }).first()).toBeVisible({ timeout: 20_000 });
      await page.getByRole("button", { name: "Retirer des favoris" }).first().scrollIntoViewIfNeeded();
      await capture(c, "07-etoile-pleine");
    });

    test(`T5 fin d'article (visiteur), ${taille.nom}`, async ({ page }) => {
      const c = await preparer(page, "T5-fin-article", taille);
      await page.goto("/blog/meilleures-blagues-droles-2026");
      const lien = page.locator("a[data-blog-cta='abonnement']").first();
      const src = new URL(`http://x${(await lien.getAttribute("href")) ?? ""}`).searchParams.get("src") ?? "";
      await captureClic(c, "01-entree-clic", lien);
      await lien.click();
      await abonnement(c);
      await page.getByTestId("abonnement-bouton-achat").click();
      await inscription(c, src);
    });

    for (const [trajet, depart, cible, src] of [
      ["C1-connecte-en-tete", "/conseils", "header", "header"],
      ["C2-connecte-mur-vannes", "/vannes", "mur", "mur-vannes"],
    ] as const) {
      test(`${trajet} (compte sans abonnement), ${taille.nom}`, async ({ page }) => {
        const c = await preparer(page, trajet, taille);
        await creerCompte(c.email, MDP, "FREE");
        await connecter(page, c.email, MDP);
        await page.setViewportSize({ width: taille.width, height: taille.height });
        await page.goto(depart);
        const lien = cible === "header" ? enTete(page) : page.getByRole("link", { name: /^Ouvrir la suite des vannes/ }).first();
        await captureClic(c, "01-entree-clic", lien);
        await lien.click();
        await abonnement(c);
        await page.getByTestId("abonnement-bouton-haut").click();
        await expect(page.getByTestId("abonnement-bouton-haut")).toHaveText("On t’emmène au paiement…");
        await capture(c, "04-avant-stripe");
        c.liberer();
        await page.waitForURL(/stripe-simule=1/, { timeout: 30_000 });
        expect((await evenements(page)).filter((e) => e.nom === "checkout-ouvert")[0]?.donnees).toMatchObject({ src });
      });
    }

    test(`FAQ ouverte, question prix, ${taille.nom}`, async ({ page }) => {
      const c = await preparer(page, "FAQ-prix", taille);
      await page.goto("/abonnement?src=header");
      const question = page.locator("details summary").filter({ hasText: /2,99\s€\/mois, c’est vraiment tout/ });
      await question.scrollIntoViewIfNeeded();
      await question.click();
      await expect(page.locator("details[open]")).toContainText("Les 14 jours courent dès ton abonnement");
      await question.evaluate((el) => el.scrollIntoView({ block: "start" }));
      await page.evaluate(() => window.scrollBy(0, -80));
      await capture(c, "faq-prix-ouverte");
      c.liberer();
    });
  }

  test("/abonnement à 1 280 px (visiteur)", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/abonnement?src=header");
    const c: Contexte = { page, dossier: path.join(SORTIE, "desktop-1280"), liberer: () => undefined, email: "" };
    await capture(c, "abonnement-premier-ecran");
    await capture(c, "abonnement-complete", true);
  });
});
