import { mkdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { randomBytes } from "node:crypto";
import type { Browser, Cookie, Page } from "@playwright/test";
import { test, expect, localSeulement, creerCompte, connecter, requete } from "../support/base-locale";
import { ANCIEN_ABONNE, CGU_QUESTION_EQUIPE_ESPACE, LIGNE_BONUS_OFFRE, PHRASE_RETROUVER_CGU, PROFIL_LIGNE_QUESTIONS } from "@/config/textes/espace-textes-en-ligne";
import { CONFIDENTIALITE_ESPACE } from "@/config/textes/espace-confidentialite";
import { validerBonus } from "@/lib/espace/fiches-schema";
import { QUESTION_EQUIPE_UI } from "@/config/textes/question-equipe-s22";
import { TEXTES_API, TEXTES_ABONNEMENT } from "@/config/textes/compte";
import { TEXTES_QUESTIONS as Q } from "@/config/textes/espace-questions";
import { TEXTES_REPLIQUES as R } from "@/config/textes/espace-repliques";
import { LIBELLE_RENONCER_CONTRAT } from "@/config/textes/paiement";
import { TEXTES_PRENOM } from "@/config/textes/compte";

/**
 * Lot D10 (s24) : « Mon profil » (réglages), `/abonnement` de l'ancien abonné (plan §3 « Lot D10 », lignes PW).
 * - Fermé (CI) : `/profil`, `/profil#abonnement`, `/profil#rappel-parcours` répondent et montrent leur ancre ;
 *   rien de neuf (ni ligne « Mes questions », ni ligne des bonus, ni ligne de l'ancien abonné).
 * - Ouvert (`E2E_ESPACE_OUVERT=1`, bascule temporaire rétablie par `trap`) : 5 états de « Mon profil » (défaut,
 *   chargement, vide, erreur, succès) ; ancien abonné redirigé de `/mon-espace` vers `/abonnement` avec ses
 *   lignes (n > 0) et son historique en lecture seule sur `/profil` ; compte FREE sans historique : aucune ligne.
 * `E2E_CAPTURES_D10` : captures sombres 320, 375, 768, 1280 et 375 à 200 % (`docs/captures/s24-d10`), « avant »
 * dans le passage fermé, « après » dans le passage ouvert.
 */
const ESPACE_OUVERT = process.env.E2E_ESPACE_OUVERT === "1";
const CAPTURES = process.env.E2E_CAPTURES_D10 ?? "";
const MOT_DE_PASSE = "E2e-espace-profil-d10";
const SUFFIXE = ESPACE_OUVERT ? "apres" : "avant";
/** Lot D10b : `E2E_CAPTURES_LARGEURS=375,1280` limite les captures à ces largeurs (défaut : toutes). */
const LARGEURS = (process.env.E2E_CAPTURES_LARGEURS ?? "").split(",").filter(Boolean);
const typo = (t: string) => t.replace(/'/g, "’");
/**
 * Lot D10b : la ligne des bonus n'est servie que si les 4 fiches bonus sont publiées (même règle que
 * `bonusTousPublies`, recopiée ici : le typage E2E ne lit pas les fichiers JSON importés).
 */
const BONUS_PUBLIES = (() => {
  try {
    const lus = validerBonus(JSON.parse(readFileSync(join(__dirname, "../../../apps/web/src/data/espace/bonus.json"), "utf8")));
    return [2, 3, 4, 5].every((cap) => lus.some((b) => b.cap === cap));
  } catch {
    return false;
  }
})();

async function capturer(page: Page, nom: string) {
  if (!CAPTURES) return;
  mkdirSync(CAPTURES, { recursive: true });
  for (const [l, h, s] of [[320, 700, "320"], [375, 812, "375"], [768, 1024, "768"], [1280, 900, "1280"], [188, 406, "375-200pc"]] as const) {
    if (LARGEURS.length > 0 && !LARGEURS.includes(s)) continue;
    await page.setViewportSize({ width: l, height: h });
    await page.waitForTimeout(300);
    await page.screenshot({ path: join(CAPTURES, `${nom}-${SUFFIXE}-${s}.png`), fullPage: true });
  }
  await page.setViewportSize({ width: 375, height: 812 });
}

/**
 * Une seule connexion par compte (cookies réutilisés), avec sa propre adresse de visiteur (`cf-connecting-ip`,
 * comme Cloudflare, patron de `conversion-v2-s21.spec.ts`) : la limite de connexions de l'adresse « local »
 * partagée par la suite (`LOGIN_LIMITS.parIp`, 30 par 15 minutes) n'est pas entamée.
 */
async function compte(browser: Browser, plan: "PREMIUM" | "FREE", nom: string): Promise<{ id: string; cookies: Cookie[] }> {
  const email = `e2e-d10-${nom}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}@example.com`;
  await creerCompte(email, MOT_DE_PASSE, plan);
  const [{ id }] = await requete<{ id: string }>(`SELECT id FROM "User" WHERE email = $1`, [email]);
  const contexte = await browser.newContext({ extraHTTPHeaders: { "cf-connecting-ip": `10.${[1, 2, 3].map(() => randomBytes(1)[0]).join(".")}` } });
  await connecter(await contexte.newPage(), email, MOT_DE_PASSE);
  const cookies = await contexte.cookies();
  await contexte.close();
  return { id, cookies };
}

/** Ancien abonné : plan FREE, abonnement Stripe déjà créé ; étapes, favoris, une question, une réplique. */
async function poserHistorique(id: string): Promise<void> {
  const [p] = await requete<{ id: string }>(`SELECT id FROM "LearningPath" WHERE "isActive" ORDER BY slug LIMIT 1`);
  for (const ordre of [1, 2]) {
    await requete(`INSERT INTO "UserPathStepCompletion" (id, "userId", "learningPathId", "stepOrder") VALUES ($1, $2, $3, $4)`, [`${id}c${ordre}`, id, p.id, ordre]);
  }
  const [j] = await requete<{ id: string }>(`SELECT id FROM "Joke" ORDER BY "createdAt" LIMIT 1`);
  await requete(`INSERT INTO "UserFavorite" (id, "userId", "contentType", "jokeId") VALUES ($1, $2, 'JOKE', $3)`, [`${id}f`, id, j.id]);
  const fil = `e2ed10${randomBytes(6).toString("hex")}`;
  await requete(`INSERT INTO "EquipeFil" (id, "userId", type, cle, statut, "creeLe", "dernierMessageLe") VALUES ($1, $2, 'QUESTION', $1, 'REPONDU', now(), now())`, [fil, id]);
  await requete(`INSERT INTO "EquipeMessage" (id, "filId", auteur, corps, "creeLe") VALUES ($1, $2, 'ABONNE', 'Avant ma résiliation', now())`, [`${fil}a`, fil]);
  await requete(`INSERT INTO "EquipeMessage" (id, "filId", auteur, corps, "creeLe") VALUES ($1, $2, 'EQUIPE', 'Réponse de l''équipe', now())`, [`${fil}e`, fil]);
  await requete(`INSERT INTO "UserReplique" (id, "userId", "ficheId", texte, "modifieLe") VALUES ($1, $2, 'coloc-la-poele', 'Ma réplique gardée', now())`, [`${id}r`, id]);
}

let abonne: { id: string; cookies: Cookie[] };
let ancien: { id: string; cookies: Cookie[] };

test.describe("lot D10, « Mon profil » et `/abonnement`", () => {
  localSeulement();
  test.describe.configure({ mode: "serial" });
  test.beforeAll(async ({ browser }) => {
    abonne = await compte(browser, "PREMIUM", "abonne");
    ancien = await compte(browser, "FREE", "ancien");
    await requete(`INSERT INTO "Subscription" (id, "userId", "stripeSubscriptionId", "updatedAt") VALUES ($1, $2, $3, now())`, [`${ancien.id}s`, ancien.id, `sub_e2e_${ancien.id}`]);
  });

  test("`/profil`, `#abonnement`, `#rappel-parcours` : 200 et ancres présentes", async ({ page }) => {
    await page.context().addCookies(abonne.cookies);
    for (const chemin of ["/profil", "/profil#abonnement", "/profil#rappel-parcours"]) {
      expect([chemin, (await page.request.get(chemin, { maxRedirects: 0 })).status()]).toEqual([chemin, 200]);
      await page.goto("about:blank");
      await page.goto(chemin);
      await expect(page.locator("h1")).toHaveText("Mon profil");
      await expect(page.locator("#abonnement")).toBeVisible();
      await expect(page.locator("#rappel-parcours")).toBeAttached();
    }
    await expect(page.getByRole("button", { name: TEXTES_ABONNEMENT.resilier })).toBeVisible();
    await expect(page.locator("main").getByRole("link", { name: LIBELLE_RENONCER_CONTRAT })).toBeVisible();
  });

  test("vide (abonné sans parcours)", async ({ page }) => {
    await page.context().addCookies(abonne.cookies);
    await page.goto("/profil");
    await expect(page.getByText("Tu n’as pas encore commencé de parcours.", { exact: false })).toBeVisible();
    await capturer(page, "profil-vide");
  });

  test("défaut (abonné, parcours en cours)", async ({ page }) => {
    await page.context().addCookies(abonne.cookies);
    const id = abonne.id;
    const [p] = await requete<{ id: string }>(`SELECT id FROM "LearningPath" WHERE "isActive" ORDER BY slug LIMIT 1`);
    await requete(`INSERT INTO "UserPathProgress" (id, "userId", "learningPathId", "currentStep", "completedSteps", "startedAt") VALUES ($1, $2, $3, 2, ARRAY[1], now())`, [`${id}p`, id, p.id]);
    await requete(`INSERT INTO "UserPathStepCompletion" (id, "userId", "learningPathId", "stepOrder") VALUES ($1, $2, $3, 1)`, [`${id}c1`, id, p.id]);
    await page.goto("/profil");
    await expect(page.locator("#abonnement")).toBeVisible();
    if (ESPACE_OUVERT) {
      await expect(page.getByTestId("profil-ligne-mes-questions").getByRole("link", { name: PROFIL_LIGNE_QUESTIONS.lien })).toHaveAttribute("href", "/mon-espace/questions");
      await expect(page.getByRole("button", { name: QUESTION_EQUIPE_UI.bouton })).toHaveCount(0);
    } else {
      await expect(page.getByTestId("profil-ligne-mes-questions")).toHaveCount(0);
    }
    await capturer(page, "profil-defaut");
  });

  test("chargement (compte lu lentement)", async ({ page }) => {
    await page.context().addCookies(abonne.cookies);
    await page.route("**/api/user", async (route) => {
      await new Promise((r) => setTimeout(r, 15_000));
      await route.continue().catch(() => undefined);
    });
    await page.goto("/profil", { waitUntil: "domcontentloaded" });
    await expect(page.locator(".animate-pulse").first()).toBeVisible();
    await capturer(page, "profil-chargement");
    await page.unrouteAll({ behavior: "ignoreErrors" });
  });

  test("erreur (compte illisible)", async ({ page }) => {
    await page.context().addCookies(abonne.cookies);
    await page.route("**/api/user", (route) => route.fulfill({ status: 500, body: "{}", contentType: "application/json" }));
    await page.goto("/profil");
    if (ESPACE_OUVERT) {
      await expect(page.getByRole("alert").filter({ hasText: TEXTES_API.erreurServeur })).toBeVisible();
      await expect(page.getByRole("button", { name: "Réessayer" })).toBeVisible();
    } else {
      // Fermé : comportement d'aujourd'hui (squelette), inchangé.
      await expect(page.locator(".animate-pulse").first()).toBeVisible();
    }
    await capturer(page, "profil-erreur");
  });

  test("succès (réglage enregistré : prénom)", async ({ page }) => {
    // Le message de `?upgrade=success` n'apparaît pas (écart existant, signalé : l'effet de la page part avant
    // celui du fournisseur de messages) ; l'état de succès montré est celui d'un réglage enregistré.
    await page.context().addCookies(abonne.cookies);
    await page.goto("/profil");
    await page.locator("#profil-prenom").fill("Yanis");
    await page.getByRole("button", { name: TEXTES_PRENOM.bouton }).click();
    await expect(page.getByRole("status").filter({ hasText: TEXTES_PRENOM.succes })).toBeVisible();
    // Captures : le message dure 3 s, il est redemandé à chaque largeur (écran visible, message fixe en bas).
    if (CAPTURES) {
      mkdirSync(CAPTURES, { recursive: true });
      for (const [l, h, suffixe] of [[320, 700, "320"], [375, 812, "375"], [768, 1024, "768"], [1280, 900, "1280"], [188, 406, "375-200pc"]] as const) {
        await page.setViewportSize({ width: l, height: h });
        await page.locator("#profil-prenom").scrollIntoViewIfNeeded();
        await page.getByRole("button", { name: TEXTES_PRENOM.bouton }).click();
        await expect(page.getByRole("status").filter({ hasText: TEXTES_PRENOM.succes }).last()).toBeVisible();
        await page.screenshot({ path: join(CAPTURES, `profil-succes-${SUFFIXE}-${suffixe}.png`) });
      }
    }
  });

  test("ancien abonné : `/mon-espace` vers `/abonnement` avec ses lignes ; `/profil` en lecture seule", async ({ page }) => {
    await page.context().addCookies(ancien.cookies);
    await poserHistorique(ancien.id);
    const lignes = page.getByTestId("abonnement-ancien-abonne");
    if (ESPACE_OUVERT) {
      await page.goto("/mon-espace");
      await expect(page).toHaveURL(/\/abonnement/);
      await expect(lignes).toContainText(ANCIEN_ABONNE.progression(2, 1).replace(/'/g, "’"));
      await expect(lignes).toContainText(ANCIEN_ABONNE.historique);
      // Lot D10b : ligne des bonus seulement si les 4 fiches bonus sont publiées (aujourd'hui : non).
      if (BONUS_PUBLIES) await expect(page.getByTestId("abonnement-ligne-bonus")).toHaveText(LIGNE_BONUS_OFFRE);
      else await expect(page.getByTestId("abonnement-ligne-bonus")).toHaveCount(0);
    } else {
      await page.goto("/abonnement");
      await expect(lignes).toHaveCount(0);
      await expect(page.getByTestId("abonnement-ligne-bonus")).toHaveCount(0);
    }
    await page.evaluate(() => window.scrollTo(0, 0));
    await capturer(page, "abonnement-ancien-abonne");
    await page.goto("/profil");
    const historique = page.getByTestId("profil-historique-lecture-seule");
    if (ESPACE_OUVERT) {
      await expect(historique.getByRole("heading", { name: Q.titre })).toBeVisible();
      await expect(historique.getByRole("heading", { name: R.titre })).toBeVisible();
      await expect(historique).toContainText("Avant ma résiliation");
      await expect(historique).toContainText("Ma réplique gardée");
      await expect(historique.getByRole("button", { name: Q.ecrire.bouton })).toHaveCount(0);
    } else {
      await expect(historique).toHaveCount(0);
    }
    await capturer(page, "profil-ancien-abonne");
  });

  test("lot D10b, ancien abonné sans favori ni question : seules les parties non nulles", async ({ page }) => {
    for (const table of ["UserFavorite", "EquipeFil"]) await requete(`DELETE FROM "${table}" WHERE "userId" = $1`, [ancien.id]);
    await page.context().addCookies(ancien.cookies);
    await page.goto("/abonnement");
    const lignes = page.getByTestId("abonnement-ancien-abonne");
    if (ESPACE_OUVERT) {
      await expect(lignes.locator("p")).toHaveText([typo(ANCIEN_ABONNE.etapesSeules(2)), typo(ANCIEN_ABONNE.repliquesSeules)]);
      await expect(lignes).not.toContainText("questions");
    } else {
      await expect(lignes).toHaveCount(0);
    }
    await page.evaluate(() => window.scrollTo(0, 0));
    await capturer(page, "abonnement-ancien-abonne-partiel");
  });

  test("compte FREE sans historique : aucune ligne sur `/abonnement`, rien sur `/profil`", async ({ page }) => {
    // Même compte, historique effacé : plus rien à dire, aucune ligne.
    for (const table of ["UserPathStepCompletion", "UserFavorite", "EquipeFil", "UserReplique"]) {
      await requete(`DELETE FROM "${table}" WHERE "userId" = $1`, [ancien.id]);
    }
    await page.context().addCookies(ancien.cookies);
    await page.goto("/abonnement");
    await expect(page.getByTestId("abonnement-ancien-abonne")).toHaveCount(0);
    await page.goto("/profil");
    await expect(page.getByTestId("profil-historique-lecture-seule")).toHaveCount(0);
  });

  test("lot D10b, confidentialité et CGU : versions finales ouvertes, texte d'aujourd'hui fermé", async ({ page }) => {
    await page.goto("/confidentialite");
    const espace = page.getByTestId("confidentialite-espace");
    if (ESPACE_OUVERT) {
      for (const t of [CONFIDENTIALITE_ESPACE.donneesCaps, CONFIDENTIALITE_ESPACE.donneesReplique, CONFIDENTIALITE_ESPACE.donneesLu, CONFIDENTIALITE_ESPACE.mesure]) {
        await expect(espace.filter({ hasText: typo(t).slice(0, 60) })).toHaveCount(1);
      }
      await expect(page.locator("main")).toContainText(typo(CONFIDENTIALITE_ESPACE.neonRole));
    } else {
      await expect(espace).toHaveCount(0);
    }
    await capturer(page, "confidentialite");
    await page.goto("/cgu");
    if (ESPACE_OUVERT) await expect(page.locator("main")).toContainText(typo(PHRASE_RETROUVER_CGU));
    else await expect(page.locator("main")).not.toContainText(typo(PHRASE_RETROUVER_CGU));
    expect(CGU_QUESTION_EQUIPE_ESPACE).toContain(PHRASE_RETROUVER_CGU);
    await page.getByText(typo("Tu restes titulaire de ce que tu écris"), { exact: false }).first().scrollIntoViewIfNeeded();
    await capturer(page, "cgu");
  });
});
