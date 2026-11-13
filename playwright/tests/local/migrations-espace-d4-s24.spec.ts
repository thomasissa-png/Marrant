import { readFileSync } from "node:fs";
import { join } from "node:path";
import { test, expect, localSeulement, requete } from "../support/base-locale";

/**
 * Espace client, lot D4 (s24) : migration 22 (`CapAnnonce`) jouée DEUX fois de suite sur la base
 * jetable (plan §2 règle 5) ; la 2e passe doit réussir. Puis contrôle de forme : unicité
 * (compte, type, numéro), type parmi CAP et BONUS, numéro de 1 à 5, cascade à la suppression du compte.
 */
const dossier = join(__dirname, "../../../apps/web/prisma/migrations");

test.describe("migration de l'espace, lot D4", () => {
  localSeulement();

  test("22 rejouable (2 passes) ; contraintes et cascade", async () => {
    const sql = readFileSync(join(dossier, "22_espace_caps_s24", "migration.sql"), "utf8");
    for (let passe = 1; passe <= 2; passe++) await requete(sql);
    const colonnes = await requete<{ column_name: string }>(
      `SELECT column_name FROM information_schema.columns WHERE table_name = 'CapAnnonce' ORDER BY 1`,
    );
    expect(colonnes.map((c) => c.column_name)).toEqual(["annonceLe", "id", "numero", "silencieux", "type", "userId"]);

    const id = `e2e-d4-${Date.now().toString(36)}`;
    await requete(`INSERT INTO "User" (id, email, "updatedAt") VALUES ($1, $2, now())`, [id, `${id}@example.com`]);
    await requete(`INSERT INTO "CapAnnonce" (id, "userId", type, numero, silencieux) VALUES ($1, $2, 'CAP', 2, true)`, [`${id}-a`, id]);
    await expect(requete(`INSERT INTO "CapAnnonce" (id, "userId", type, numero) VALUES ($1, $2, 'CAP', 2)`, [`${id}-b`, id])).rejects.toThrow();
    await expect(requete(`INSERT INTO "CapAnnonce" (id, "userId", type, numero) VALUES ($1, $2, 'XP', 3)`, [`${id}-c`, id])).rejects.toThrow();
    await expect(requete(`INSERT INTO "CapAnnonce" (id, "userId", type, numero) VALUES ($1, $2, 'BONUS', 6)`, [`${id}-d`, id])).rejects.toThrow();
    await requete(`DELETE FROM "User" WHERE id = $1`, [id]);
    const [{ reste }] = await requete<{ reste: number }>(`SELECT count(*)::int AS reste FROM "CapAnnonce" WHERE "userId" = $1`, [id]);
    expect(reste).toBe(0);
  });
});
