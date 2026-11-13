import { readFileSync } from "node:fs";
import { join } from "node:path";
import { test, expect, localSeulement, requete } from "../support/base-locale";

/**
 * Espace client, lot D7 (s24) : migrations 25 (`EquipeFil`, `EquipeMessage`) et 26
 * (`EspaceCompte.premierPasLe`) jouées DEUX fois de suite sur la base jetable (plan §2 règle 5) ; la 2e
 * passe doit réussir. Puis contrôle de forme : valeurs fermées (type, statut, auteur, étiquettes de
 * scène), unicité de la clé d'envoi, texte de 1 à 10 000 caractères, cascade fil puis compte.
 */
const dossier = join(__dirname, "../../../apps/web/prisma/migrations");
const jouer = async (nom: string) => requete(readFileSync(join(dossier, nom, "migration.sql"), "utf8"));
const colonnes = async (table: string) =>
  (await requete<{ column_name: string }>(`SELECT column_name FROM information_schema.columns WHERE table_name = $1 ORDER BY 1`, [table])).map(
    (c) => c.column_name,
  );

test.describe("migrations de l'espace, lot D7", () => {
  localSeulement();

  test("25 et 26 rejouables (2 passes) ; contraintes et cascade", async () => {
    for (let passe = 1; passe <= 2; passe++) {
      await jouer("25_espace_questions_s24");
      await jouer("26_espace_premier_pas_s24");
    }
    expect(await colonnes("EquipeFil")).toEqual(["cle", "creeLe", "dernierMessageLe", "id", "ouvertParAbonneLe", "sceneBut", "sceneOu", "statut", "type", "userId"]);
    expect(await colonnes("EquipeMessage")).toEqual(["auteur", "cle", "corps", "creeLe", "emailEnvoyeLe", "filId", "id"]);
    expect(await colonnes("EspaceCompte")).toContain("premierPasLe");

    const id = `e2e-d7-${Date.now().toString(36)}`;
    await requete(`INSERT INTO "User" (id, email, "updatedAt") VALUES ($1, $2, now())`, [id, `${id}@example.com`]);
    const rejet = (sql: string, params: unknown[]) => expect(requete(sql, params)).rejects.toThrow();

    await requete(`INSERT INTO "EquipeFil" (id, "userId", type, cle) VALUES ($1, $2, 'SITUATION', 'k1')`, [`${id}-f1`, id]);
    await rejet(`INSERT INTO "EquipeFil" (id, "userId", type, cle) VALUES ($1, $2, 'QUESTION', 'k1')`, [`${id}-f2`, id]);
    await rejet(`INSERT INTO "EquipeFil" (id, "userId", type, cle) VALUES ($1, $2, 'AUTRE', 'k2')`, [`${id}-f3`, id]);
    await rejet(`INSERT INTO "EquipeFil" (id, "userId", type, cle, statut) VALUES ($1, $2, 'QUESTION', 'k3', 'FERME')`, [`${id}-f4`, id]);
    await requete(`UPDATE "EquipeFil" SET "sceneOu" = 'boulot', "sceneBut" = 'autre' WHERE id = $1`, [`${id}-f1`]);
    await rejet(`UPDATE "EquipeFil" SET "sceneOu" = 'piscine' WHERE id = $1`, [`${id}-f1`]);
    await rejet(`UPDATE "EquipeFil" SET "sceneBut" = 'briller' WHERE id = $1`, [`${id}-f1`]);

    await requete(`INSERT INTO "EquipeMessage" (id, "filId", auteur, corps, cle) VALUES ($1, $2, 'ABONNE', 'x', 'm1')`, [`${id}-m1`, `${id}-f1`]);
    await rejet(`INSERT INTO "EquipeMessage" (id, "filId", auteur, corps, cle) VALUES ($1, $2, 'ABONNE', 'y', 'm1')`, [`${id}-m2`, `${id}-f1`]);
    await rejet(`INSERT INTO "EquipeMessage" (id, "filId", auteur, corps) VALUES ($1, $2, 'ROBOT', 'y')`, [`${id}-m3`, `${id}-f1`]);
    await rejet(`INSERT INTO "EquipeMessage" (id, "filId", auteur, corps) VALUES ($1, $2, 'EQUIPE', '')`, [`${id}-m4`, `${id}-f1`]);
    await requete(`INSERT INTO "EquipeMessage" (id, "filId", auteur, corps) VALUES ($1, $2, 'EQUIPE', $3)`, [`${id}-m5`, `${id}-f1`, "r".repeat(10_000)]);
    await rejet(`INSERT INTO "EquipeMessage" (id, "filId", auteur, corps) VALUES ($1, $2, 'EQUIPE', $3)`, [`${id}-m6`, `${id}-f1`, "r".repeat(10_001)]);

    // « Retirer de mon historique » : le fil part avec ses messages.
    await requete(`INSERT INTO "EquipeFil" (id, "userId", type, cle) VALUES ($1, $2, 'QUESTION', 'k9')`, [`${id}-f9`, id]);
    await requete(`INSERT INTO "EquipeMessage" (id, "filId", auteur, corps) VALUES ($1, $2, 'ABONNE', 'z')`, [`${id}-m9`, `${id}-f9`]);
    await requete(`DELETE FROM "EquipeFil" WHERE id = $1`, [`${id}-f9`]);
    expect((await requete<{ n: number }>(`SELECT count(*)::int AS n FROM "EquipeMessage" WHERE "filId" = $1`, [`${id}-f9`]))[0].n).toBe(0);

    await requete(`INSERT INTO "EspaceCompte" ("userId", "premierPasLe", "updatedAt") VALUES ($1, now(), now())`, [id]);
    await requete(`DELETE FROM "User" WHERE id = $1`, [id]);
    const [{ fils }] = await requete<{ fils: number }>(`SELECT count(*)::int AS fils FROM "EquipeFil" WHERE "userId" = $1`, [id]);
    const [{ messages }] = await requete<{ messages: number }>(`SELECT count(*)::int AS messages FROM "EquipeMessage" WHERE "filId" LIKE $1`, [`${id}-%`]);
    expect([fils, messages]).toEqual([0, 0]);
  });
});
