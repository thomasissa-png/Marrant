import { mkdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import type { Page } from "@playwright/test";
import { test, expect, localSeulement, creerCompte, connecter, requete } from "../support/base-locale";
import { TEXTES_GESTE as G, TEXTES_MISSION as M } from "@/config/textes/espace-cartes";
import { TEXTES_ESPACE_NAVIGATION as N, nomCloche } from "@/config/textes/espace-navigation";

/**
 * Lot D9 (s24) : mesure d'usage de l'espace et missions importées, sur le VRAI contenu.
 * - Fermé (CI) : un abonné qui parcourt le site public n'écrit AUCUN événement de l'espace.
 * - Ouvert (`E2E_ESPACE_OUVERT=1`, bascule temporaire rétablie par `trap`) : `espace_ouvert` une fois par
 *   jour, `cloche_ouverte` sans détail ; une mission par marche, énoncé du seed et suite validée de la
 *   marche. `E2E_CAPTURES_D9` : captures sombres 375 et 1280 (`docs/captures/s24-d9`).
 */
const ESPACE_OUVERT = process.env.E2E_ESPACE_OUVERT === "1";
const FIXTURES_ESPACE = process.env.E2E_FIXTURES_ESPACE === "1";
const CAPTURES = process.env.E2E_CAPTURES_D9 ?? "";
const MOT_DE_PASSE = "E2e-espace-mesure-d9";
const TYPES_ESPACE = ["espace_ouvert", "cloche_ouverte", "bonus_ouvert", "cap_atteint", "replique_ecrite", "question_envoyee"];

type MissionJson = { id: string; marche: number; enonce: string[]; suites: { marche?: string; bof?: string } };
const MISSIONS = JSON.parse(readFileSync(join(__dirname, "../../../apps/web/src/data/espace/missions.json"), "utf8")) as MissionJson[];
const premiere = (marche: number) => MISSIONS.find((m) => m.marche === marche);

async function capturer(page: Page, nom: string) {
  if (!CAPTURES) return;
  mkdirSync(CAPTURES, { recursive: true });
  for (const [l, h] of [[375, 812], [1280, 900]] as const) {
    await page.setViewportSize({ width: l, height: h });
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(300);
    // Page entière : la barre de rubriques collante ne recouvre pas le haut de la mission.
    await page.screenshot({ path: join(CAPTURES, `${nom}-${l}.png`), fullPage: true });
  }
  await page.setViewportSize({ width: 375, height: 812 });
}

async function evenements(email: string) {
  return requete<{ type: string; detail: string | null }>(
    `SELECT e.type, e.detail FROM "UsageEvent" e JOIN "User" u ON u.id = e."userId" WHERE u.email = $1 AND e.type = ANY($2::text[]) ORDER BY e."occurredAt"`,
    [email, TYPES_ESPACE],
  );
}

async function abonne(page: Page, nom: string) {
  const email = `e2e-d9-${nom}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}@example.com`;
  await creerCompte(email, MOT_DE_PASSE, "PREMIUM");
  await connecter(page, email, MOT_DE_PASSE);
  return email;
}

test.describe("lot D9, interrupteur fermé", () => {
  localSeulement();
  test.skip(ESPACE_OUVERT, "interrupteur fermé seulement");

  test("un abonné qui parcourt le site n'écrit aucun événement de l'espace", async ({ page }) => {
    const email = await abonne(page, "ferme");
    for (const chemin of ["/", "/vannes", "/parcours", "/profil", "/mon-espace", "/mon-espace/s-entrainer?marche=1"]) await page.goto(chemin);
    expect((await page.request.post("/api/espace/mesure", { data: { evenement: "cloche_ouverte" } })).status()).toBe(404);
    expect(await evenements(email)).toEqual([]);
  });
});

test.describe("lot D9, interrupteur ouvert, vrai contenu", () => {
  localSeulement();
  test.skip(!ESPACE_OUVERT || FIXTURES_ESPACE, "E2E_ESPACE_OUVERT=1 requis, serveur construit avec le vrai contenu");

  test("espace_ouvert une fois par jour ; cloche_ouverte sans détail ; aucun texte", async ({ page }) => {
    const email = await abonne(page, "mesure");
    await page.goto("/mon-espace");
    await page.goto("/mon-espace");
    await page.getByRole("button", { name: nomCloche(0) }).click();
    await expect(page.getByRole("dialog", { name: N.cloche.titre })).toBeVisible();
    await expect.poll(async () => (await evenements(email)).map((e) => e.type)).toEqual(["espace_ouvert", "cloche_ouverte"]);
    expect((await evenements(email)).every((e) => e.detail === null)).toBe(true);
    expect((await page.request.post("/api/espace/mesure", { data: { evenement: "texte libre" } })).status()).toBe(400);
  });

  for (const marche of [1, 2, 3, 4, 5]) {
    test(`marche ${marche} : la première mission, énoncé du seed, suite « ça a marché » validée`, async ({ page }) => {
      const mission = premiere(marche);
      expect(mission).toBeDefined();
      if (!mission) return;
      await abonne(page, `m${marche}`);
      await page.setViewportSize({ width: 375, height: 812 });
      await page.goto(`/mon-espace/s-entrainer?marche=${marche}#mission`);
      const m = page.locator("#mission");
      await expect(m).toHaveAttribute("data-mission", mission.id);
      await expect(m.getByRole("heading", { name: M.titresMarches[marche as 1 | 2 | 3 | 4 | 5] })).toBeVisible();
      for (const p of mission.enonce) await expect(m).toContainText(p);
      await expect(m).not.toContainText("—");
      await capturer(page, `mission-marche-${marche}`);
      await m.getByRole("button", { name: G.retours["essaye-ca-a-marche"] }).click();
      await expect(m.getByText(mission.suites.marche ?? "")).toBeVisible();
      await capturer(page, `mission-marche-${marche}-suite`);
    });
  }
});
