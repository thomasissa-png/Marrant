import { randomBytes } from "node:crypto";
import { test, expect, localSeulement, requete } from "../support/base-locale";
import { lignesAbonnes, SQL_SANS_SOUSCRIPTION, SQL_TABLEAU_ABONNES, type LigneBrute } from "@/lib/mesure/tableau-abonnes";

/**
 * s24 lot 0 (QA tour 1, correction 12) : la requête de lecture de la mesure d'usage EXÉCUTÉE sur la
 * base jetable (Postgres du job e2e-local), avec le jeu piégé du rapport QA : deux souscriptions du
 * même compte, pratiques de part et d'autre de minuit à Paris, fin de la fenêtre J7, résiliation avec
 * motif, renouvellement, bienvenue (ancre E0), clic « résilier ». Lecture en transaction READ ONLY.
 * Comptes créés puis supprimés (cascade) : la base est laissée telle quelle.
 */
test.describe.configure({ mode: "serial" });

const suffixe = randomBytes(6).toString("hex");
const A = `mesA${suffixe}`;
const B = `mesB${suffixe}`;
const ev = (user: string, type: string, detail: string | null, quand: string) =>
  requete(`INSERT INTO "UsageEvent" (id, "userId", type, detail, "occurredAt") VALUES ($1, $2, $3, $4, $5::timestamp)`, [
    `ev${randomBytes(8).toString("hex")}`, user, type, detail, quand,
  ]);

test.describe("mesure d'usage : requête de lecture sur Postgres", () => {
  localSeulement();

  test.beforeAll(async () => {
    for (const id of [A, B]) {
      await requete(
        `INSERT INTO "User" (id, email, plan, "createdAt", "updatedAt") VALUES ($1, $2, 'PREMIUM'::"Plan", now(), now())`,
        [id, `${id}@e2e.local`],
      );
    }
    const [parcours] = await requete<{ id: string }>(`SELECT id FROM "LearningPath" ORDER BY id LIMIT 1`);
    await ev(A, "souscription", "month", "2026-10-01 10:00:00");
    await ev(A, "premier_acces_premium", "liste-vannes", "2026-10-01 10:04:00");
    // Étape validée à 23 h 30 à Paris (21 h 30 UTC), quiz à 0 h 30 à Paris le lendemain (22 h 30 UTC) :
    // 2 jours de Paris, 1 seul jour UTC.
    await requete(
      `INSERT INTO "UserPathStepCompletion" (id, "userId", "learningPathId", "stepOrder", "completedAt") VALUES ($1, $2, $3, 1, '2026-10-01 21:30:00')`,
      [`c${suffixe}`, A, parcours.id],
    );
    await ev(A, "jour_pratique", "quiz", "2026-10-01 22:30:00");
    await ev(A, "jour_pratique", "quiz", "2026-10-08 10:30:00"); // après la fin de J7 (10 h 00 UTC) : exclu
    await ev(A, "renouvellement_paye", "month", "2026-11-01 10:00:00");
    await ev(A, "souscription", "month", "2026-11-10 08:00:00");
    await ev(A, "premier_acces_premium", "carnet", "2026-11-10 09:00:00");
    await requete(`INSERT INTO "WebhookEvent" (id, "eventId", provider) VALUES ($1, $2, 'interne')`, [
      `w${suffixe}`, `onboarding-premium:E0:${A}`,
    ]);
    await ev(B, "souscription", "year", "2026-10-05 08:00:00");
    await ev(B, "portail_ouvert", "resilier", "2026-10-05 08:07:00");
    await ev(B, "resiliation_programmee", "too_expensive", "2026-10-05 08:10:00");
  });

  test.afterAll(async () => {
    await requete(`DELETE FROM "WebhookEvent" WHERE "eventId" = $1`, [`onboarding-premium:E0:${A}`]);
    await requete(`DELETE FROM "User" WHERE id = ANY($1)`, [[A, B]]);
  });

  test("une ligne par souscription, sans identifiant, délais, fuseau de Paris, J7 et cohorte", async () => {
    const [{ lignes }] = await requete<{ lignes: LigneBrute[] }>(
      `SELECT coalesce(json_agg(t), '[]'::json) AS lignes FROM (${SQL_TABLEAU_ABONNES}) t`,
    );
    expect(JSON.stringify(lignes)).not.toContain(A);
    const calc = lignesAbonnes(lignes, new Date("2026-12-15T12:00:00Z"));
    const a1 = calc.find((l) => l.souscrit.toISOString() === "2026-10-01T10:00:00.000Z");
    const a2 = calc.find((l) => l.souscrit.toISOString() === "2026-11-10T08:00:00.000Z");
    const b = calc.find((l) => l.souscrit.toISOString() === "2026-10-05T08:00:00.000Z");
    expect(a1).toMatchObject({ premierAccesMs: 4 * 60_000, premierContenu: "liste-vannes", joursPratiqueJ7: 2, bienvenue: true, actifDeuxiemePrelevement: "oui" });
    expect(a1?.ahaMs).toBe(11.5 * 3_600_000);
    expect(a2).toMatchObject({ premierAccesMs: 60 * 60_000, premierContenu: "carnet" });
    expect(a2?.abonne).toBe(`${a1?.abonne}2`);
    expect(b).toMatchObject({ clicResilierMs: 7 * 60_000, resiliationMs: 10 * 60_000, motif: "too_expensive", premierAccesMs: null });
    expect(b?.abonne).not.toBe(a1?.abonne);
  });

  test("lecture seule : les deux requêtes passent en transaction READ ONLY, une écriture y est refusée", async () => {
    await requete(`BEGIN READ ONLY; ${SQL_TABLEAU_ABONNES}; ${SQL_SANS_SOUSCRIPTION}; COMMIT`);
    const [{ n }] = await requete<{ n: number }>(SQL_SANS_SOUSCRIPTION);
    expect(n).toBeGreaterThanOrEqual(0);
    await expect(
      requete(`BEGIN READ ONLY; INSERT INTO "UsageEvent" (id, "userId", type) VALUES ('ro${suffixe}', '${A}', 'aha'); COMMIT`),
    ).rejects.toThrow(/read-only/);
  });
});
