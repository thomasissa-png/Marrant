import { readFileSync } from "node:fs";
import { join } from "node:path";
import { test, expect, localSeulement, requete } from "../support/base-locale";

/**
 * Espace client, lot D5 (s24) : migrations 23 (`CarteSuivi`, `CarteReponse`) et 24 (`FicheFait`,
 * `MissionRetour`, `UserReplique`) jouées DEUX fois de suite sur la base jetable (plan §2 règle 5) ;
 * la 2e passe doit réussir. Puis contrôle de forme : unicités (compte et carte, compte et clé, compte
 * et fiche), valeurs fermées, plafond de la réplique, cascade à la suppression du compte.
 */
const dossier = join(__dirname, "../../../apps/web/prisma/migrations");
const jouer = async (nom: string) => requete(readFileSync(join(dossier, nom, "migration.sql"), "utf8"));
const colonnes = async (table: string) =>
  (await requete<{ column_name: string }>(`SELECT column_name FROM information_schema.columns WHERE table_name = $1 ORDER BY 1`, [table])).map(
    (c) => c.column_name,
  );

test.describe("migrations de l'espace, lot D5", () => {
  localSeulement();

  test("23 et 24 rejouables (2 passes) ; contraintes et cascade", async () => {
    for (let passe = 1; passe <= 2; passe++) {
      await jouer("23_espace_cartes_s24");
      await jouer("24_espace_fiches_s24");
    }
    expect(await colonnes("CarteSuivi")).toEqual(["carteId", "derniereReponse", "dueLe", "id", "nbRates", "nbRevues", "premiereVueLe", "updatedAt", "userId"]);
    expect(await colonnes("CarteReponse")).toEqual(["carteId", "choixJuste", "cle", "compteARebours", "id", "repondueLe", "reponse", "revision", "userId"]);
    expect(await colonnes("FicheFait")).toEqual(["faitLe", "ficheId", "id", "retour", "userId"]);
    expect(await colonnes("MissionRetour")).toEqual(["cle", "creeLe", "id", "marche", "missionId", "retour", "userId"]);
    expect(await colonnes("UserReplique")).toEqual(["creeLe", "ficheId", "id", "modifieLe", "texte", "userId"]);

    const id = `e2e-d5-${Date.now().toString(36)}`;
    await requete(`INSERT INTO "User" (id, email, "updatedAt") VALUES ($1, $2, now())`, [id, `${id}@example.com`]);
    const rejet = (sql: string, params: unknown[]) => expect(requete(sql, params)).rejects.toThrow();

    await requete(`INSERT INTO "CarteSuivi" (id, "userId", "carteId", "updatedAt") VALUES ($1, $2, 'a.c1', now())`, [`${id}-s1`, id]);
    await rejet(`INSERT INTO "CarteSuivi" (id, "userId", "carteId", "updatedAt") VALUES ($1, $2, 'a.c1', now())`, [`${id}-s2`, id]);
    await rejet(`INSERT INTO "CarteSuivi" (id, "userId", "carteId", "derniereReponse", "updatedAt") VALUES ($1, $2, 'b.c1', 'PEUT', now())`, [`${id}-s3`, id]);

    await requete(`INSERT INTO "CarteReponse" (id, "userId", "carteId", reponse, cle) VALUES ($1, $2, 'a.c1', 'OUI', 'k1')`, [`${id}-r1`, id]);
    await rejet(`INSERT INTO "CarteReponse" (id, "userId", "carteId", reponse, cle) VALUES ($1, $2, 'a.c1', 'OUI', 'k1')`, [`${id}-r2`, id]);
    await rejet(`INSERT INTO "CarteReponse" (id, "userId", "carteId", reponse, cle) VALUES ($1, $2, 'a.c1', 'BOF', 'k2')`, [`${id}-r3`, id]);
    await rejet(`INSERT INTO "CarteReponse" (id, "userId", "carteId", reponse, cle, "compteARebours") VALUES ($1, $2, 'a.c1', 'OUI', 'k3', 0)`, [`${id}-r4`, id]);

    await requete(`INSERT INTO "FicheFait" (id, "userId", "ficheId", retour) VALUES ($1, $2, 'f', 'essaye-bof')`, [`${id}-f1`, id]);
    await rejet(`INSERT INTO "FicheFait" (id, "userId", "ficheId", retour) VALUES ($1, $2, 'f', 'essaye-bof')`, [`${id}-f2`, id]);
    await rejet(`INSERT INTO "FicheFait" (id, "userId", "ficheId", retour) VALUES ($1, $2, 'g', 'pas-essaye')`, [`${id}-f3`, id]);

    await requete(`INSERT INTO "MissionRetour" (id, "userId", "missionId", marche, retour, cle) VALUES ($1, $2, 'm', 2, 'pas-essaye', 'c1')`, [`${id}-m1`, id]);
    await rejet(`INSERT INTO "MissionRetour" (id, "userId", "missionId", marche, retour, cle) VALUES ($1, $2, 'm', 2, 'pas-essaye', 'c1')`, [`${id}-m2`, id]);
    await rejet(`INSERT INTO "MissionRetour" (id, "userId", "missionId", marche, retour, cle) VALUES ($1, $2, 'm', 6, 'pas-essaye', 'c2')`, [`${id}-m3`, id]);

    await requete(`INSERT INTO "UserReplique" (id, "userId", "ficheId", texte, "modifieLe") VALUES ($1, $2, 'f', $3, now())`, [`${id}-u1`, id, "x".repeat(200)]);
    await rejet(`INSERT INTO "UserReplique" (id, "userId", "ficheId", texte, "modifieLe") VALUES ($1, $2, 'f', 'autre', now())`, [`${id}-u2`, id]);
    await rejet(`INSERT INTO "UserReplique" (id, "userId", "ficheId", texte, "modifieLe") VALUES ($1, $2, 'g', $3, now())`, [`${id}-u3`, id, "x".repeat(201)]);
    await rejet(`INSERT INTO "UserReplique" (id, "userId", "ficheId", texte, "modifieLe") VALUES ($1, $2, 'h', '', now())`, [`${id}-u4`, id]);

    await requete(`DELETE FROM "User" WHERE id = $1`, [id]);
    for (const table of ["CarteSuivi", "CarteReponse", "FicheFait", "MissionRetour", "UserReplique"]) {
      const [{ reste }] = await requete<{ reste: number }>(`SELECT count(*)::int AS reste FROM "${table}" WHERE "userId" = $1`, [id]);
      expect([table, reste]).toEqual([table, 0]);
    }
  });
});
