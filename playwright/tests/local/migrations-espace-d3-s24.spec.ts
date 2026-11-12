import { readFileSync } from "node:fs";
import { join } from "node:path";
import { test, expect, localSeulement, requete } from "../support/base-locale";

/**
 * Espace client, lot D3 (s24) : migrations 19, 20 et 21 jouées DEUX fois de suite sur la base
 * jetable (plan §2 règle 5) ; la 2e passe doit réussir. Puis contrôle de forme : colonne
 * `humourNoir` à false partout, `EspaceCompteur` sans aucune colonne d'identifiant d'abonné.
 */
const MIGRATIONS = ["19_reperage_humour_noir_s24", "20_espace_compte_s24", "21_espace_compteurs_s24"];
const dossier = join(__dirname, "../../../apps/web/prisma/migrations");

test.describe("migrations de l'espace, lot D3", () => {
  localSeulement();

  test("19 à 21 rejouables (2 passes) ; forme attendue", async () => {
    for (let passe = 1; passe <= 2; passe++) {
      for (const nom of MIGRATIONS) {
        await requete(readFileSync(join(dossier, nom, "migration.sql"), "utf8"));
      }
    }
    const [{ marquees }] = await requete<{ marquees: number }>(`SELECT count(*)::int AS marquees FROM "Joke" WHERE "humourNoir"`);
    expect(marquees).toBe(0);
    const colonnes = await requete<{ column_name: string }>(
      `SELECT column_name FROM information_schema.columns WHERE table_name = 'EspaceCompteur' ORDER BY 1`,
    );
    expect(colonnes.map((c) => c.column_name)).toEqual(["cle", "id", "jour", "n", "valeur"]);
    await expect(requete(`INSERT INTO "EspaceCompte" ("userId", aise) VALUES ('inexistant', 'SOIREE')`)).rejects.toThrow();
  });
});
