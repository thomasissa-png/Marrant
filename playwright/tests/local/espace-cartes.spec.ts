import { mkdirSync } from "node:fs";
import { join } from "node:path";
import type { Browser, Cookie, Page } from "@playwright/test";
import { test, expect, localSeulement, creerCompte, connecter, requete } from "../support/base-locale";
import { TEXTES_CARTES as T, TEXTES_COMPTE_A_REBOURS as CR, TEXTES_GESTE as G, TEXTES_MISSION as M } from "@/config/textes/espace-cartes";
import { TEXTES_REPLIQUES as R } from "@/config/textes/espace-repliques";
import { TEXTES_AUJOURDHUI as A } from "@/config/textes/espace-aujourdhui";
import { SERIE } from "@/config/textes/parcours";

/**
 * Espace client, lot D5 (s24, plan §3) : rafale (« Quel registre ? », révision), « Ma réplique à moi »,
 * « Fait », missions, « Mes répliques », états 2 et 3 d'« Aujourd'hui » ; arbitrages @ux D4 (N2 à 200 %,
 * série unique sur /profil). Interrupteur fermé (CI) : `/mon-espace/s-entrainer`, `/mon-espace/repliques`
 * et les routes neuves sont la 404. `E2E_ESPACE_OUVERT=1` : serveur construit interrupteur OUVERT, avec
 * les FIXTURES copiées dans `data/espace/situations.json` et `missions.json` (bascule temporaire de la
 * copie de travail, rétablie par `trap`, jamais livrée). `E2E_CAPTURES_D5` : dossier des captures.
 */
const ESPACE_OUVERT = process.env.E2E_ESPACE_OUVERT === "1";
/**
 * Import 2 (s24) : les tests écrits pour les fixtures (« @fixtures-espace ») tournent sur un serveur construit
 * avec le jeu dédié `playwright/fixtures/espace` (installé par `installer.mjs` dans une copie de travail
 * basculée, rétablie ensuite ; jamais servi), et sont sautés sur le serveur construit avec le vrai contenu.
 */
const FIXTURES_ESPACE = process.env.E2E_FIXTURES_ESPACE === "1";
const CAPTURES = process.env.E2E_CAPTURES_D5 ?? "";
// Lot D5b : captures du compte à rebours et de la limite de la réplique (`docs/captures/s24-d5b`).
const MOT_DE_PASSE = "E2e-espace-cartes-D5";
const NOTE = "Je la rends en échange de la paix des ménages";

async function compte(browser: Browser): Promise<{ id: string; cookies: Cookie[] }> {
  const email = `e2e-espace-d5-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}@example.com`;
  await creerCompte(email, MOT_DE_PASSE, "PREMIUM");
  const contexte = await browser.newContext();
  await connecter(await contexte.newPage(), email, MOT_DE_PASSE);
  const cookies = await contexte.cookies();
  await contexte.close();
  const [{ id }] = await requete<{ id: string }>(`SELECT id FROM "User" WHERE email = $1`, [email]);
  return { id, cookies };
}

const debordement = (page: Page) =>
  page.evaluate(() => Math.max(...Array.from(document.querySelectorAll("main *")).map((e) => e.getBoundingClientRect().right)));

async function capturer(page: Page, nom: string, cible?: string) {
  if (!CAPTURES) return;
  mkdirSync(CAPTURES, { recursive: true });
  for (const [l, h, suffixe] of [[320, 700, "320"], [375, 812, "375"], [768, 1024, "768"], [1280, 900, "1280"], [188, 406, "375-200pc"]] as const) {
    await page.setViewportSize({ width: l, height: h });
    await page.waitForTimeout(300);
    if (cible) {
      await page.locator(cible).first().evaluate((e) => {
        e.scrollIntoView({ block: "start", behavior: "instant" });
        const fixes = Array.from(document.querySelectorAll("header, [data-espace-barre]"))
          .filter((x) => ["sticky", "fixed"].includes(getComputedStyle(x).position))
          .reduce((b, x) => Math.max(b, x.getBoundingClientRect().bottom), 0);
        window.scrollBy({ top: -(fixes + 16), behavior: "instant" });
      });
    } else await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
    await page.waitForTimeout(400);
    await page.screenshot({ path: join(CAPTURES, `${nom}-${suffixe}.png`) });
  }
}

/** Répond à la carte : attend « Prends ton temps », puis le bouton. */
async function repondre(page: Page, carte: string, reponse: string) {
  const c = page.locator(`[data-carte="${carte}"]`);
  await expect(c.getByText(T.prendsTonTemps)).toBeHidden({ timeout: 6_000 });
  await c.getByRole("button", { name: reponse, exact: true }).click();
  return c;
}

test.describe("espace client, cartes, répliques, missions (s24, lot D5)", () => {
  localSeulement();

  test("interrupteur fermé : pages et routes neuves = 404, aucun appel à l'espace", async ({ browser, page }) => {
    test.skip(ESPACE_OUVERT, "régime fermé seulement");
    const { cookies } = await compte(browser);
    await page.context().addCookies(cookies);
    for (const chemin of ["/mon-espace/s-entrainer", "/mon-espace/repliques"]) {
      const r = await page.goto(chemin);
      expect([chemin, r?.status()]).toEqual([chemin, 404]);
    }
    for (const [url, methode] of [
      ["/api/espace/cartes", "GET"],
      ["/api/espace/carte/coloc-la-poele.c1/reponse", "POST"],
      ["/api/espace/fiche-fait", "POST"],
      ["/api/espace/replique", "PUT"],
      ["/api/espace/replique", "DELETE"],
      ["/api/espace/repliques", "GET"],
      ["/api/espace/mission/retour", "POST"],
    ] as const) {
      const r = await page.request.fetch(url, { method: methode, data: methode === "GET" ? undefined : { cle: "abcdefgh" } });
      expect([url, methode, r.status()]).toEqual([url, methode, 404]);
    }
    const appels: string[] = [];
    page.on("request", (r) => {
      if (r.url().includes("/api/espace")) appels.push(r.url());
    });
    await page.goto("/profil");
    await expect(page.getByText(SERIE.titre, { exact: true })).toBeVisible();
    expect(appels).toEqual([]);
  });

  test.describe("abonné, interrupteur ouvert, fixtures", () => {
    test.skip(!ESPACE_OUVERT, "E2E_ESPACE_OUVERT=1 requis : serveur construit interrupteur ouvert");

    test("carte nouvelle : « Prends ton temps », réponse, choix, règle, geste ; « Fait » ; note enregistrée @fixtures-espace", async ({ browser, page }) => {
      test.skip(!FIXTURES_ESPACE, "fixtures dédiées : serveur construit avec playwright/fixtures/espace (E2E_FIXTURES_ESPACE=1)");
      const { id, cookies } = await compte(browser);
      await page.context().addCookies(cookies);
      await requete(`INSERT INTO "UserReplique" (id, "userId", "ficheId", texte, "modifieLe") VALUES ($1, $2, 'coloc-la-poele', $3, now())`, [`${id}-r`, id, NOTE]);
      await page.goto("/mon-espace/s-entrainer");
      const c = page.locator('[data-carte="coloc-la-poele.c1"]');
      await expect(c.getByText(T.nouvelle, { exact: true })).toBeVisible();
      // La note n'est PAS dans la page avant la réponse (pas seulement masquée).
      expect(await page.content()).not.toContain(NOTE);
      await expect(c.getByRole("button", { name: T.reponses.OUI })).toHaveAttribute("aria-disabled", "true");
      await capturer(page, "carte-avant-reponse", '[data-carte="coloc-la-poele.c1"]');
      await page.setViewportSize({ width: 375, height: 812 });
      await repondre(page, "coloc-la-poele.c1", T.reponses.RIEN);
      await expect(c.getByText(T.regle(2))).toBeVisible();
      await expect(c.getByTestId("replique-derniere-fois")).toHaveCount(0);
      await c.getByRole("button", { name: /La joueuse/ }).click();
      await expect(c.getByText(T.ici(T.registres.joueuse))).toBeVisible();
      await expect(c.getByLabel(G.note.label)).toHaveValue(NOTE);
      await c.getByRole("button", { name: G.retours["essaye-ca-a-marche"] }).click();
      await expect(c.getByText(G.fait, { exact: true })).toBeVisible();
      await capturer(page, "carte-apres-choix", '[data-carte="coloc-la-poele.c1"] [data-testid="geste-fiche"]');
      await page.setViewportSize({ width: 375, height: 812 });
      await c.getByLabel(G.note.label).fill("Elle a pris ses marques, moi aussi");
      await c.getByRole("button", { name: G.note.enregistrer }).click();
      await expect(c.getByRole("status").filter({ hasText: G.note.enregistree })).toBeVisible();
      const [{ n }] = await requete<{ n: number }>(`SELECT count(*)::int AS n FROM "CarteReponse" WHERE "userId" = $1`, [id]);
      expect(n).toBe(1);
      const [{ f }] = await requete<{ f: number }>(`SELECT count(*)::int AS f FROM "FicheFait" WHERE "userId" = $1`, [id]);
      expect(f).toBe(1);
      // Rafale faite : « C'est tout pour aujourd'hui » ; « Aujourd'hui » passe à l'état 3.
      await page.goto("/mon-espace/s-entrainer");
      await expect(page.getByText(T.fini)).toBeVisible();
      await page.goto("/mon-espace");
      await expect(page.getByTestId("etape-en-cours")).toBeVisible();
      await expect(page.getByText(A.rafale.fini)).toBeVisible();
      await expect(page.getByText(A.repere(1))).toBeVisible();
      await capturer(page, "aujourdhui-reprise");
    });

    test("carte de révision : la réplique de l'abonné n'apparaît qu'après la réponse", async ({ browser, page }) => {
      const { id, cookies } = await compte(browser);
      await page.context().addCookies(cookies);
      await requete(`INSERT INTO "UserReplique" (id, "userId", "ficheId", texte, "modifieLe") VALUES ($1, $2, 'coloc-la-poele', $3, now())`, [`${id}-r`, id, NOTE]);
      await requete(
        `INSERT INTO "CarteSuivi" (id, "userId", "carteId", "derniereReponse", "dueLe", "premiereVueLe", "updatedAt") VALUES ($1, $2, 'coloc-la-poele.c1', 'RIEN', now() - interval '1 day', now() - interval '3 days', now())`,
        [`${id}-s`, id],
      );
      await page.goto("/mon-espace/s-entrainer");
      const c = page.locator('[data-carte="coloc-la-poele.c1"]');
      await expect(c.getByText(T.aRevoir, { exact: true })).toBeVisible();
      expect(await page.content()).not.toContain(NOTE);
      await repondre(page, "coloc-la-poele.c1", T.reponses.OUI);
      await expect(c.getByTestId("replique-derniere-fois")).toContainText(NOTE);
      await capturer(page, "carte-revision-apres-reponse", '[data-carte="coloc-la-poele.c1"] [data-testid="replique-derniere-fois"]');
    });

    test("« Aujourd'hui », état 2 : premier pas fait, « Les cartes du jour », question C9 ; mission en lien secondaire @fixtures-espace", async ({ browser, page }) => {
      test.skip(!FIXTURES_ESPACE, "fixtures dédiées : serveur construit avec playwright/fixtures/espace (E2E_FIXTURES_ESPACE=1)");
      const { id, cookies } = await compte(browser);
      await page.context().addCookies(cookies);
      await requete(`INSERT INTO "FicheFait" (id, "userId", "ficheId", retour) VALUES ($1, $2, 'coloc-la-poele', 'essaye-bof')`, [`${id}-f`, id]);
      await page.goto("/mon-espace");
      await expect(page.getByRole("link", { name: A.premierPas.bouton, exact: true })).toHaveCount(0);
      await expect(page.getByRole("link", { name: A.rafale.bouton })).toBeVisible();
      await expect(page.getByText(A.rafale.sousTitre(1, 0))).toBeVisible();
      await expect(page.getByText(A.aise.question)).toBeVisible();
      await expect(page.getByTestId("mission-lien")).toContainText(M.titresMarches[1]);
      await capturer(page, "aujourdhui-rafale");
    });

    test("mission : « ça a marché » vers la marche d'au-dessus ; « bof » ; deux « Pas essayé » vers la marche 1 @fixtures-espace", async ({ browser, page }) => {
      test.skip(!FIXTURES_ESPACE, "fixtures dédiées : serveur construit avec playwright/fixtures/espace (E2E_FIXTURES_ESPACE=1)");
      const { cookies } = await compte(browser);
      await page.context().addCookies(cookies);
      await page.goto("/mon-espace/s-entrainer?marche=2#mission");
      const m = page.locator("#mission");
      await expect(m.getByRole("heading", { name: M.titresMarches[2] })).toBeVisible();
      await expect(m.getByText(M.facultative)).toBeVisible();
      await capturer(page, "mission", "#mission");
      await page.setViewportSize({ width: 375, height: 812 });
      await m.getByRole("button", { name: G.retours["pas-essaye"] }).click();
      await expect(m.getByRole("link")).toHaveCount(0);
      await m.getByRole("button", { name: G.retours["pas-essaye"] }).click();
      await expect(m.getByRole("link", { name: M.voirLaMarche(1) })).toBeVisible();
      await page.goto("/mon-espace/s-entrainer?marche=2&autre=x#mission");
      await m.getByRole("button", { name: G.retours["essaye-bof"] }).click();
      await expect(m.getByRole("link", { name: M.autreSituation })).toBeVisible();
      await expect(m.getByRole("link", { name: M.raconte })).toBeVisible();
      await page.goto("/mon-espace/s-entrainer?marche=2#mission");
      await m.getByRole("button", { name: G.retours["essaye-ca-a-marche"] }).click();
      await expect(m.getByRole("link", { name: M.voirLaMarche(3) })).toBeVisible();
      await capturer(page, "mission-suite-marche", "#mission");
    });

    test("« Mes répliques » : vide, liste, modifier, confirmer, supprimée", async ({ browser, page }) => {
      const { id, cookies } = await compte(browser);
      await page.context().addCookies(cookies);
      await page.goto("/mon-espace/repliques");
      await expect(page.getByText(R.vide)).toBeVisible();
      await capturer(page, "repliques-vide");
      await requete(`INSERT INTO "UserReplique" (id, "userId", "ficheId", texte, "modifieLe") VALUES ($1, $2, 'coloc-la-poele', $3, now())`, [`${id}-r`, id, NOTE]);
      await page.goto("/mon-espace/repliques");
      await expect(page.getByText(`« ${NOTE} »`)).toBeVisible();
      await expect(page.getByRole("link", { name: "Coloc : la poêle" })).toBeVisible();
      await capturer(page, "repliques-liste");
      await page.setViewportSize({ width: 375, height: 812 });
      await page.getByRole("button", { name: R.modifier }).click();
      await page.getByLabel(R.label).fill("Version modifiée");
      await page.getByRole("button", { name: R.enregistrer }).click();
      await expect(page.getByText("« Version modifiée »")).toBeVisible();
      await page.getByRole("button", { name: R.supprimer }).click();
      await expect(page.getByRole("button", { name: R.annuler })).toBeFocused();
      await capturer(page, "repliques-confirmer", "main");
      await page.setViewportSize({ width: 375, height: 812 });
      await page.getByRole("group", { name: R.confirmer }).getByRole("button", { name: R.supprimer }).click();
      await expect(page.getByRole("status").filter({ hasText: R.supprimee })).toBeVisible();
      const [{ n }] = await requete<{ n: number }>(`SELECT count(*)::int AS n FROM "UserReplique" WHERE "userId" = $1`, [id]);
      expect(n).toBe(0);
    });

    test("échec d'enregistrement : le texte reste, « Réessayer » @fixtures-espace", async ({ browser, page }) => {
      test.skip(!FIXTURES_ESPACE, "fixtures dédiées : serveur construit avec playwright/fixtures/espace (E2E_FIXTURES_ESPACE=1)");
      const { cookies } = await compte(browser);
      await page.context().addCookies(cookies);
      await page.goto("/mon-espace/s-entrainer");
      const c = await repondre(page, "coloc-la-poele.c1", T.reponses.OUI);
      await c.getByRole("button", { name: /La sûre/ }).click();
      await page.route("**/api/espace/replique", (r) => r.fulfill({ status: 503, json: { error: "indisponible" } }));
      await c.getByLabel(G.note.label).fill("Une phrase à garder");
      await c.getByRole("button", { name: G.note.enregistrer }).click();
      await expect(c.getByText(G.note.echec)).toBeVisible();
      await expect(c.getByLabel(G.note.label)).toHaveValue("Une phrase à garder");
      await expect(c.getByRole("button", { name: G.note.reessayer })).toBeVisible();
    });

    test("D5b, compte à rebours : proposition « 7 secondes », décompte, fin annoncée, retour visible à 10, durée enregistrée @fixtures-espace", async ({ browser, page }) => {
      test.skip(!FIXTURES_ESPACE, "fixtures dédiées : serveur construit avec playwright/fixtures/espace (E2E_FIXTURES_ESPACE=1)");
      const { id, cookies } = await compte(browser);
      await page.context().addCookies(cookies);
      // Semaine précédente (même jour, 7 jours avant) : 10 cartes à 10 secondes, dont 7 « Oui ».
      for (let i = 0; i < 10; i++) {
        await requete(
          `INSERT INTO "CarteReponse" (id, "userId", "carteId", reponse, "compteARebours", cle, "repondueLe") VALUES ($1, $2, $3, $4, 10, $5, now() - interval '7 days')`,
          [`${id}-a${i}`, id, `ancienne-${i}.c1`, i < 7 ? "OUI" : "RIEN", `${id}-cle-${i}`],
        );
      }
      await page.setViewportSize({ width: 375, height: 812 });
      await page.goto("/mon-espace/s-entrainer");
      const c = page.locator('[data-carte="coloc-la-poele.c1"]');
      await expect(c.getByText(CR.proposition(7, 10))).toBeVisible();
      const dix = c.getByRole("button", { name: CR.nom(10) });
      await expect(dix).toHaveText(CR.libelle(10));
      await expect(dix).toHaveAttribute("aria-pressed", "false");
      await capturer(page, "rafale-compte-a-rebours-proposition", '[data-carte="coloc-la-poele.c1"] [data-compte-a-rebours]');
      await page.setViewportSize({ width: 375, height: 812 });
      await c.getByRole("button", { name: CR.essayer(7) }).click();
      await expect(c.getByText(CR.proposition(7, 10))).toHaveCount(0);
      await expect(c.getByRole("button", { name: CR.nom(7) })).toHaveAttribute("aria-pressed", "true");
      await expect(c.getByRole("timer", { name: CR.minuteur })).toContainText(/Il reste \d secondes?/);
      await expect(c.getByText(T.prendsTonTemps)).toHaveCount(0);
      await capturer(page, "rafale-compte-a-rebours-actif", '[data-carte="coloc-la-poele.c1"] [data-compte-a-rebours]');
      await page.setViewportSize({ width: 375, height: 812 });
      // Retour visible à la durée précédente, puis 7 de nouveau.
      await dix.click();
      await expect(dix).toHaveAttribute("aria-pressed", "true");
      await c.getByRole("button", { name: CR.nom(7) }).click();
      await expect(c.getByRole("status").filter({ hasText: CR.passees(7) })).toBeVisible({ timeout: 10_000 });
      await expect(c.getByRole("timer")).toHaveCount(0);
      await capturer(page, "rafale-compte-a-rebours-fin", '[data-carte="coloc-la-poele.c1"] [data-compte-a-rebours]');
      await page.setViewportSize({ width: 375, height: 812 });
      await c.getByRole("button", { name: T.reponses.OUI, exact: true }).click();
      await expect(c.getByRole("heading", { name: T.laquelle })).toBeVisible();
      // L'écriture suit le clic (le titre s'affiche avant la réponse de l'API) : lecture répétée.
      await expect
        .poll(async () => (await requete<{ duree: number }>(`SELECT "compteARebours" AS duree FROM "CarteReponse" WHERE "userId" = $1 AND "carteId" = 'coloc-la-poele.c1'`, [id]))[0]?.duree ?? null)
        .toBe(7);
      // Rien n'est noté : aucun mot de note ni de sanction dans la carte.
      expect(await c.innerText()).not.toMatch(/score|note sur|trop lent|raté|perdu/i);
    });

    test("D5b, « Ma réplique à moi » : un collage de 300 caractères est coupé à 200, message de limite @fixtures-espace", async ({ browser, page }) => {
      test.skip(!FIXTURES_ESPACE, "fixtures dédiées : serveur construit avec playwright/fixtures/espace (E2E_FIXTURES_ESPACE=1)");
      const { cookies } = await compte(browser);
      await page.context().addCookies(cookies);
      await page.setViewportSize({ width: 375, height: 812 });
      await page.goto("/mon-espace/s-entrainer");
      const c = await repondre(page, "coloc-la-poele.c1", T.reponses.OUI);
      await c.getByRole("button", { name: /La sûre/ }).click();
      const champ = c.getByLabel(G.note.label);
      await champ.fill("Je la rends propre, mais je garde le droit de la juger. ".repeat(6));
      await expect(champ).toHaveValue(/^.{200}$/s);
      await expect(c.getByText(G.note.compteur(200, 200))).toBeVisible();
      await expect(c.getByRole("status").filter({ hasText: G.note.limite(200) })).toBeVisible();
      await capturer(page, "replique-limite", '[data-carte="coloc-la-poele.c1"] form:has(textarea)');
      // À 200 % : le compteur reste sur une ligne.
      await page.setViewportSize({ width: 188, height: 406 });
      const compteur = c.getByText(G.note.compteur(200, 200));
      const lignes = await compteur.evaluate((e) => Math.round(e.getBoundingClientRect().height / parseFloat(getComputedStyle(e).lineHeight)));
      expect(lignes).toBe(1);
      // Le serveur refuse au-delà (400), sans troncature.
      const r = await page.request.put("/api/espace/replique", { data: { ficheId: "coloc-la-poele", texte: "a".repeat(201) } });
      expect(r.status()).toBe(400);
    });

    test("200 % de texte (188 x 406) : aucun débordement, cibles de 44 px", async ({ browser, page }) => {
      const { id, cookies } = await compte(browser);
      await page.context().addCookies(cookies);
      await requete(`INSERT INTO "UserReplique" (id, "userId", "ficheId", texte, "modifieLe") VALUES ($1, $2, 'coloc-la-poele', $3, now())`, [`${id}-r`, id, NOTE]);
      await page.setViewportSize({ width: 188, height: 406 });
      for (const chemin of ["/mon-espace/s-entrainer", "/mon-espace/repliques", "/mon-espace/s-entrainer?marche=2"]) {
        await page.goto(chemin);
        expect([chemin, await debordement(page)]).toEqual([chemin, expect.any(Number)]);
        expect(await debordement(page)).toBeLessThanOrEqual(188.5);
        const petits = await page.evaluate(() =>
          Array.from(document.querySelectorAll("main button, main a"))
            .filter((e) => (e as HTMLElement).offsetParent !== null)
            .map((e) => e.getBoundingClientRect().height)
            .filter((h) => h < 44),
        );
        expect([chemin, petits]).toEqual([chemin, []]);
      }
    });

    test("arbitrage @ux D4 n°2 : /profil, une seule occurrence de la série (« Ton cap »)", async ({ browser, page }) => {
      const { cookies } = await compte(browser);
      await page.context().addCookies(cookies);
      await page.setViewportSize({ width: 375, height: 812 });
      await page.goto("/profil");
      await expect(page.locator("#ton-cap-titre")).toBeVisible();
      await expect(page.getByText(SERIE.titre, { exact: true })).toHaveCount(0);
      if (CAPTURES) {
        mkdirSync(CAPTURES, { recursive: true });
        for (const [l, h, s] of [[375, 812, "375"], [188, 406, "375-200pc"], [768, 1024, "768"]] as const) {
          await page.setViewportSize({ width: l, height: h });
          await page.locator("#ton-cap-titre").scrollIntoViewIfNeeded();
          await page.waitForTimeout(400);
          await page.screenshot({ path: join(CAPTURES, `profil-${s}.png`) });
        }
      }
    });
  });
});
