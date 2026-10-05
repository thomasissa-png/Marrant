/**
 * @jest-environment node
 *
 * Script d'insertion du lot, pilote `neon-http` (s15 cycle 6) : avec l'adaptateur
 * PrismaNeonHTTP, `createMany` et `updateMany` ouvrent une transaction, refusée
 * (« Transactions are not supported in HTTP mode »). Insertion = UNE instruction
 * INSERT multi-lignes, annulation = UN UPDATE.
 *
 * Vrai PrismaClient + vrai PrismaNeonHTTP : seul `global.fetch` (l'API SQL HTTP
 * de Neon) est simulé. Aucune base.
 */

import path from "node:path";
import {
  COLONNES_INSERTION,
  annulerLot,
  insererLot,
  lireFichierLot,
  requeteAnnulation,
  requeteInsertion,
} from "../../../scripts/content/social-lot-v5-insert";

const LOT = path.resolve(__dirname, "../../../../../docs/social/preparation/lot-semaine0.json");
const URL_NEON = "postgresql://u:p@ep-test.eu-central-1.aws.neon.tech/db?sslmode=require";
const PARAMS_PAR_LIGNE = 17; // 19 colonnes, dont createdAt/updatedAt = NOW() (sans paramètre)

const f = lireFichierLot(LOT);

interface Envoi { query: string; params: unknown[] }
let envois: Envoi[] = [];
let compteExistant = "0";

/** Réponse de l'API SQL HTTP de Neon (mode tableau, texte brut). */
function reponse(body: Record<string, unknown>) {
  return new Response(JSON.stringify({ rowAsArray: true, rowCount: 0, fields: [], rows: [], command: "SELECT", ...body }), {
    status: 200,
    headers: { "content-type": "application/json" },
  });
}

beforeEach(() => {
  envois = [];
  compteExistant = "0";
  (global as { fetch: unknown }).fetch = jest.fn(async (_url: string, init: { body: string }) => {
    const b = JSON.parse(init.body) as Envoi;
    envois.push(b);
    const q = b.query;
    if (/^INSERT/i.test(q)) return reponse({ command: "INSERT", rowCount: b.params.length / PARAMS_PAR_LIGNE });
    if (/^UPDATE/i.test(q)) return reponse({ command: "UPDATE", rowCount: 7 });
    if (/GROUP BY/i.test(q)) {
      return reponse({ fields: [{ name: "_count$_all", dataTypeID: 20 }, { name: "status", dataTypeID: 25 }], rows: [["10", "APPROVED"]], rowCount: 1 });
    }
    if (/COUNT\(/i.test(q)) return reponse({ fields: [{ name: "_count$_all", dataTypeID: 20 }], rows: [[compteExistant]], rowCount: 1 });
    // Relecture après insertion : les lignes du fichier, telles que la base les rendrait,
    // colonnes dans l'ordre du SELECT de Prisma.
    const cols = q.slice(0, q.indexOf(" FROM ")).split(",").map((c) => (c.includes('"scheduledAt"') ? "scheduledAt" : c.includes('"platform"') ? "platform" : "id"));
    const valeur = (c: string, p: (typeof f.posts)[number]) =>
      c === "scheduledAt" ? p.scheduledAt.replace("T", " ").replace("Z", "") : c === "platform" ? p.platform : p.id;
    return reponse({
      fields: cols.map((c) => ({ name: c, dataTypeID: c === "scheduledAt" ? 1114 : 25 })),
      rows: f.posts.map((p) => cols.map((c) => valeur(c, p))),
      rowCount: f.posts.length,
    });
  });
  jest.spyOn(console, "warn").mockImplementation(() => undefined);
});

describe("requeteInsertion (fonction pure)", () => {
  it("une seule instruction INSERT, 19 colonnes, une ligne VALUES par post", () => {
    const q = requeteInsertion(f.posts);
    expect(q.sql.startsWith(`INSERT INTO "SocialPost" (${COLONNES_INSERTION.map((c) => `"${c}"`).join(", ")}) VALUES `)).toBe(true);
    expect(COLONNES_INSERTION).toHaveLength(19);
    expect(q.sql.match(/NOW\(\), NOW\(\)\)/g)).toHaveLength(f.posts.length);
    expect(q.values).toHaveLength(f.posts.length * PARAMS_PAR_LIGNE);
  });

  it("enums castés, tableaux en text[], scheduledAt en UTC explicite", () => {
    const q = requeteInsertion([f.posts[0]]);
    expect(q.sql).toContain('CAST(? AS "SocialPlatform")');
    expect(q.sql).toContain('CAST(? AS "SocialFormat")');
    expect(q.sql).toContain('CAST(? AS "SocialPostStatus")');
    expect(q.sql.match(/\?::text\[\]/g)).toHaveLength(3);
    expect(q.sql).toContain("?::int");
    expect(q.sql).toContain("(?::timestamptz AT TIME ZONE 'UTC')");
    const p = f.posts[0];
    expect(q.values).toEqual([
      p.id, p.platform, p.format, p.content, p.hook, p.cta, p.hashtags, p.targetPersona, p.sourceType, p.sourceId,
      p.threadParts, p.imageUrls, p.status, p.approvedBy, p.directorScore, p.directorNote, new Date(p.scheduledAt).toISOString(),
    ]);
  });

  it("refuse une liste vide", () => {
    expect(() => requeteInsertion([])).toThrow("Aucune ligne");
  });
});

describe("requeteAnnulation (fonction pure)", () => {
  it("UPDATE unique, même filtre que NON_ENVOYES, updatedAt = NOW()", () => {
    const q = requeteAnnulation("lot-semaine0", "note");
    expect(q.sql).toBe(
      'UPDATE "SocialPost" SET "status" = CAST(\'REJECTED\' AS "SocialPostStatus"), "directorNote" = ?, "updatedAt" = NOW() WHERE "approvedBy" = ? AND "status" = CAST(\'APPROVED\' AS "SocialPostStatus") AND "externalId" IS NULL AND "publishedAt" IS NULL',
    );
    expect(q.values).toEqual(["note", "lot-semaine0"]);
  });
});

describe("pilote neon-http, de bout en bout (vrai adaptateur, fetch simulé)", () => {
  it("--insert : garde-fous, UN INSERT, puis contrôle conforme", async () => {
    const r = await insererLot(f, "neon-http", URL_NEON);
    const inserts = envois.filter((e) => /^INSERT/i.test(e.query));
    expect(inserts).toHaveLength(1);
    expect(inserts[0].params).toHaveLength(f.posts.length * PARAMS_PAR_LIGNE);
    expect(envois.some((e) => /^(BEGIN|START TRANSACTION)/i.test(e.query))).toBe(false);
    expect(r.inseres).toBe(f.posts.length);
    expect(r.ecarts).toEqual([]);
  });

  it("--insert : un garde-fou déclenché, aucun INSERT", async () => {
    compteExistant = "2";
    await expect(insererLot(f, "neon-http", URL_NEON)).rejects.toThrow("insertion refusée");
    expect(envois.filter((e) => /^INSERT/i.test(e.query))).toHaveLength(0);
  });

  it("--rollback --confirmer : UN UPDATE, sans transaction", async () => {
    const r = await annulerLot(f.lot, "neon-http", URL_NEON, true, new Date("2026-10-05T20:00:00Z"));
    const updates = envois.filter((e) => /^UPDATE/i.test(e.query));
    expect(updates).toHaveLength(1);
    expect(updates[0].params).toEqual(["Lot semaine0 annulé (--rollback) le 2026-10-05T20:00:00.000Z.", "lot-semaine0"]);
    expect(r.annules).toBe(7);
    expect(r.avant).toEqual({ APPROVED: 10 });
  });

  it("--rollback sans --confirmer : comptage seul, aucun UPDATE", async () => {
    const r = await annulerLot(f.lot, "neon-http", URL_NEON, false, new Date());
    expect(envois.filter((e) => /^UPDATE/i.test(e.query))).toHaveLength(0);
    expect(r.annules).toBe(0);
  });
});
