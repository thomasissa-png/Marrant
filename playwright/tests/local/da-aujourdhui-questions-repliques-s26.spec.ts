import { mkdirSync } from "node:fs";
import { join } from "node:path";
import type { Browser, Cookie, Page } from "@playwright/test";
import { test, expect, localSeulement, creerCompte, connecter, requete, ESPACE_OUVERT } from "../support/base-locale";
import { TEXTES_CLOCHE } from "@/config/textes/espace-cloche";
import { TEXTES_REPLIQUES } from "@/config/textes/espace-repliques";
import { TEXTES_GESTE } from "@/config/textes/espace-cartes";
import { frEspace, frEspaceProfond } from "@/lib/fr-typo";

/**
 * s26 DA, aujourd'hui questions répliques (décision de Thomas du 20/11 ; `docs/ux/audit-trajets-connectes-s26.md`, T7
 * et T8). Espace ouvert seulement (`E2E_ESPACE_OUVERT=1`). T7 : une fois la réponse lue, la liste de Mes questions
 * garde un lien vers le fil ; la page du fil met la liste des fils à GAUCHE dès 1024. T8 : « Écrire ma prochaine
 * réplique » (et « Écrire ma première réplique ») ouvre un champ d'écriture visible et focalisé, en 1 clic. Les trois
 * pages : aucun vide de plus de 32 px dans les cartes à 1280 (sous la dernière ligne, entre deux lignes).
 * `E2E_CAPTURES_DA_AQR` : dossier des captures (abonné, 1280 x 900 et 375 x 812, une par page).
 */
const C = frEspaceProfond(TEXTES_CLOCHE);
const R = frEspaceProfond(TEXTES_REPLIQUES);
const G = frEspaceProfond(TEXTES_GESTE);
const MOT_DE_PASSE = "E2e-da-aqr-s26!";
const CAPTURES = process.env.E2E_CAPTURES_DA_AQR ?? "";

async function abonne(browser: Browser): Promise<{ id: string; cookies: Cookie[] }> {
  const email = `e2e-da-aqr-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}@example.com`;
  await creerCompte(email, MOT_DE_PASSE, "PREMIUM");
  const [{ id }] = await requete<{ id: string }>(`SELECT id FROM "User" WHERE email = $1`, [email]);
  const contexte = await browser.newContext();
  await connecter(await contexte.newPage(), email, MOT_DE_PASSE);
  const cookies = await contexte.cookies();
  await contexte.close();
  return { id, cookies };
}

/** Un fil posé en base (l'outil de l'équipe exige `ADMIN_PASSWORD`, absent ici), avec ou sans réponse. */
async function fil(userId: string, type: string, message: string, reponse?: string) {
  const id = `e2eaqr${Math.random().toString(36).slice(2, 14)}`;
  const quand = new Date(Date.now() - 2 * 86_400_000).toISOString();
  await requete(
    `INSERT INTO "EquipeFil" (id, "userId", type, cle, statut, "creeLe", "dernierMessageLe") VALUES ($1, $2, $3, $1, $4, $5::timestamptz, $5::timestamptz)`,
    [id, userId, type, reponse ? "REPONDU" : "EN_ATTENTE", quand],
  );
  await requete(`INSERT INTO "EquipeMessage" (id, "filId", auteur, corps, "creeLe") VALUES ($1, $2, 'ABONNE', $3, $4::timestamptz)`, [`${id}a`, id, message, quand]);
  if (reponse) await requete(`INSERT INTO "EquipeMessage" (id, "filId", auteur, corps, "creeLe") VALUES ($1, $2, 'EQUIPE', $3, now())`, [`${id}e`, id, reponse]);
  return id;
}

/**
 * Vides des cartes de `main` (celles qui portent le bandeau de l'accueil) : `bas` = vide sous la dernière ligne de
 * contenu au-delà de la marge intérieure, `creux` = plus grand écart entre deux lignes de contenu.
 */
const videsCartes = (page: Page) =>
  page.evaluate(() => {
    const cartes = Array.from(document.querySelectorAll("main [data-bandeau-da]")).map((b) => b.parentElement as HTMLElement);
    return cartes
      .filter((el) => el.getBoundingClientRect().height > 0)
      .map((el) => {
        const rects: { t: number; b: number }[] = [];
        const w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
        for (let n = w.nextNode(); n; n = w.nextNode()) {
          if (!n.textContent?.trim() || n.parentElement?.closest(".sr-only")) continue;
          const r = document.createRange();
          r.selectNodeContents(n);
          for (const x of Array.from(r.getClientRects())) if (x.height > 0) rects.push({ t: x.top, b: x.bottom });
        }
        for (const e of Array.from(el.querySelectorAll("svg,button,a,textarea,input,[data-barre-etapes],[data-segments-cap],.aspect-video,iframe"))) {
          const x = e.getBoundingClientRect();
          if (x.height > 0) rects.push({ t: x.top, b: x.bottom });
        }
        // Un filet haut (`border-t`) est une ligne de contenu (séparateur visible), comme dans la spec d'Aujourd'hui s25.
        for (const e of Array.from(el.querySelectorAll('[class*="border-t"]'))) {
          const x = e.getBoundingClientRect();
          if (parseFloat(getComputedStyle(e).borderTopWidth) > 0 && x.height > 0) rects.push({ t: x.top, b: x.top + 1 });
        }
        rects.sort((a, b) => a.t - b.t);
        const u: { t: number; b: number }[] = [];
        for (const r of rects) {
          const d = u[u.length - 1];
          if (d && r.t <= d.b + 0.5) d.b = Math.max(d.b, r.b);
          else u.push({ ...r });
        }
        const b = el.getBoundingClientRect();
        const cs = getComputedStyle(el);
        let creux = 0;
        for (let i = 1; i < u.length; i++) creux = Math.max(creux, u[i].t - u[i - 1].b);
        const bas = b.bottom - parseFloat(cs.borderBottomWidth) - parseFloat(cs.paddingBottom) - (u[u.length - 1]?.b ?? b.bottom);
        const nom = (el.getAttribute("aria-labelledby") ?? "") + (el.textContent ?? "").trim().slice(0, 40);
        return { nom, bas: Math.round(bas), creux: Math.round(creux) };
      });
  });

async function verifierVides(page: Page, quoi: string) {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.waitForTimeout(400);
  const v = await videsCartes(page);
  expect(v.length, `${quoi} : cartes à bandeau`).toBeGreaterThan(0);
  for (const c of v) {
    expect(c.bas, `${quoi}, vide de fin : ${c.nom}`).toBeLessThanOrEqual(32);
    expect(c.creux, `${quoi}, creux : ${c.nom}`).toBeLessThanOrEqual(32);
  }
}

async function capturer(page: Page, nom: string) {
  if (!CAPTURES) return;
  mkdirSync(CAPTURES, { recursive: true });
  for (const [l, h] of [[1280, 900], [375, 812]] as const) {
    await page.setViewportSize({ width: l, height: h });
    await page.waitForTimeout(500);
    await page.screenshot({ path: join(CAPTURES, `${nom}-${l}.png`) });
  }
}

const dansLEcran = (page: Page, sel: string) =>
  page.evaluate((s) => {
    const r = (document.querySelector(s) as HTMLElement).getBoundingClientRect();
    return r.top >= 0 && r.bottom <= window.innerHeight;
  }, sel);

test.describe("s26 DA, aujourd'hui questions répliques", () => {
  localSeulement();
  test.skip(!ESPACE_OUVERT, "espace ouvert seulement (E2E_ESPACE_OUVERT=1)");

  test("Aujourd'hui : bandeau et pastilles de l'accueil, un seul bouton plein, aucun vide > 32 px à 1280", async ({ browser }) => {
    const { cookies } = await abonne(browser);
    const contexte = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    await contexte.addCookies(cookies);
    const page = await contexte.newPage();
    await page.goto("/mon-espace");
    await expect(page.locator("[data-contenu-du-jour]")).toHaveAttribute("data-etat", /ok|erreur/);
    expect(await page.locator("main [data-bandeau-da]").count()).toBeGreaterThanOrEqual(3);
    await expect(page.locator("main [data-pastilles-da]").first()).toBeVisible();
    // Un seul aplat violet (bouton plein) dans `main`.
    const pleins = await page.evaluate(
      () => Array.from(document.querySelectorAll("main a, main button")).filter((e) => /bg-accent-secondary-hover|bg-accent-primary(\s|$)/.test(e.className) && e.getBoundingClientRect().height > 0).length,
    );
    expect(pleins).toBeLessThanOrEqual(1);
    await verifierVides(page, "Aujourd'hui");
    await capturer(page, "aujourdhui");
    await contexte.close();
  });

  for (const [largeur, hauteur] of [[1280, 900], [375, 812]] as const) {
    test(`T7 (${largeur}) : après lecture, la liste garde le lien vers le fil ; liste des fils à gauche dès 1024`, async ({ browser }) => {
      const { id, cookies } = await abonne(browser);
      const repondu = await fil(id, "SITUATION", "Mon collègue me chambre sur mes chaussettes.", "Réponds-lui : « Au moins, les miennes sont assorties. »");
      await fil(id, "QUESTION", "Est-ce que cette blague est lourde ?");
      const contexte = await browser.newContext({ viewport: { width: largeur, height: hauteur } });
      await contexte.addCookies(cookies);
      const page = await contexte.newPage();
      await page.goto("/mon-espace/questions");
      // Lecture par la tuile « réponse non lue » (le fil ouvert rend la réponse lue).
      await page.locator(`[data-reponse-non-lue="${repondu}"] a`).click();
      await expect(page).toHaveURL(new RegExp(`/mon-espace/questions/${repondu}$`));
      if (largeur >= 1024) {
        const [liste, detail] = await Promise.all([page.locator("[data-zone='liste']").boundingBox(), page.locator("[data-fil-colonne]").boundingBox()]);
        expect(liste && detail && liste.x + liste.width <= detail.x).toBe(true);
        await expect(page.locator(`[data-rail-fil="${repondu}"]`)).toHaveAttribute("aria-current", "page");
      } else {
        await expect(page.locator("[data-zone='liste']")).toBeHidden();
      }
      // La page du fil marque la réponse lue (appel `ouvert`) : attendre la fin des échanges avant de revenir.
      await page.waitForLoadState("networkidle");
      await page.goto("/mon-espace/questions");
      await expect(page.locator(`[data-reponse-non-lue="${repondu}"]`)).toHaveCount(0);
      if (largeur >= 1024) {
        // s26 contrôle d'ensemble, abonné (C6) : dès 1024, « Mes envois » est la liste de gauche du layout (cartes masquées) ;
        // le lien vers le fil lu est sa ligne, et la liste reste montée (même nœud) quand le fil s'ouvre à droite.
        const ligne = page.locator(`[data-zone='liste'] [data-rail-fil="${repondu}"]`);
        await expect(ligne).toBeVisible();
        await page.locator("[data-zone='liste'] [data-rail-fils]").evaluate((e) => e.setAttribute("data-marque-c6", ""));
        await ligne.click();
        await expect(page).toHaveURL(new RegExp(`/mon-espace/questions/${repondu}$`));
        await expect(page.locator("[data-rail-fils][data-marque-c6]"), "même nœud de liste").toHaveCount(1);
        await expect(ligne).toHaveAttribute("aria-current", "page");
      } else {
        const lien = page.locator(`[data-lien-fil="${repondu}"]`);
        await expect(lien).toBeVisible();
        await expect(lien).toHaveAccessibleName(new RegExp(C.groupes.reponses));
        await lien.click();
        await expect(page).toHaveURL(new RegExp(`/mon-espace/questions/${repondu}$`));
      }
      if (largeur === 1280) {
        await verifierVides(page, "Mes questions, fil");
        await page.goto("/mon-espace/questions");
        await verifierVides(page, "Mes questions");
        await capturer(page, "questions");
      }
      await contexte.close();
    });

    test(`T8 (${largeur}) : « Écrire ma première » puis « ma prochaine réplique » ouvrent un champ focalisé et visible en 1 clic`, async ({ browser }) => {
      const { cookies } = await abonne(browser);
      const contexte = await browser.newContext({ viewport: { width: largeur, height: hauteur } });
      await contexte.addCookies(cookies);
      const page = await contexte.newPage();
      await page.goto("/mon-espace/repliques");
      await page.getByRole("button", { name: R.ecrirePremiere }).click();
      const champ = page.getByLabel(R.label);
      await expect(champ).toBeFocused();
      expect(await dansLEcran(page, "[data-champ-replique]")).toBe(true);
      await champ.fill("Au moins, les miennes sont assorties.");
      await page.getByRole("button", { name: R.enregistrer }).click();
      await expect(page.getByRole("status").filter({ hasText: frEspace(G.note.enregistree) })).toBeVisible();
      await expect(page.locator("[data-replique]")).toHaveCount(1);
      await page.reload();
      // Un clic, le bouton visible de l'écran (en-tête sous 1024, tuile dès 1024 avec une ou deux répliques).
      await page.locator("[data-repliques-ecrire], [data-repliques-ecrire-tuile]").filter({ visible: true }).first().click();
      await expect(page.getByLabel(R.label)).toBeFocused();
      expect(await dansLEcran(page, "[data-champ-replique]")).toBe(true);
      if (largeur === 1280) {
        await verifierVides(page, "Mes répliques, champ ouvert");
        // Capture : le champ ouvert en 1 clic (T8).
        await capturer(page, "repliques");
        await page.keyboard.press("Escape");
        await expect(page.locator("[data-ecrire-replique]")).toHaveCount(0);
        await verifierVides(page, "Mes répliques");
      }
      await contexte.close();
    });
  }
});
