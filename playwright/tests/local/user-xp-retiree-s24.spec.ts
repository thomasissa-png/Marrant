import { test, expect, localSeulement } from "../support/base-locale";

/**
 * Retrait de `POST /api/user/xp` (s24, `docs/espace-client/niveaux-xp-s24.md` §2.5
 * point 5, décision Q1 « retirer ») : sur le serveur réel, la route ne répond plus
 * (404, ou 405 si un autre gestionnaire existait au même chemin), et aucune XP
 * n'est jamais renvoyée.
 */
test.describe("POST /api/user/xp retirée (s24)", () => {
  localSeulement();

  test("POST et GET répondent 404 ou 405, sans XP", async ({ request }) => {
    for (const reponse of [
      await request.post("/api/user/xp", { data: { amount: 500, action: "tip_read" } }),
      await request.get("/api/user/xp"),
    ]) {
      expect([404, 405]).toContain(reponse.status());
      expect(await reponse.text()).not.toMatch(/"xpGained"/);
    }
  });
});
