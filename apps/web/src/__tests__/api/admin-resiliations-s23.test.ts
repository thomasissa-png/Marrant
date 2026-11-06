/**
 * @jest-environment node
 *
 * GET /api/admin/resiliations (s23, @reviewer O3) et purge des réponses (@legal O3) : sans jeton 401 ;
 * table absente (migration 17 pas jouée) : 200 `{ disponible: false }` ; comptes seulement, jamais de
 * mot libre ni d'identifiant dans la réponse. Purge : lignes de plus de 24 mois, table absente = 0.
 */
const findMany = jest.fn();
const deleteMany = jest.fn();
jest.mock("@/lib/prisma", () => ({
  prisma: { cancellationFeedback: { findMany: (...a: unknown[]) => findMany(...a), deleteMany: (...a: unknown[]) => deleteMany(...a) } },
}));

import { NextRequest } from "next/server";
import { GET } from "@/app/api/admin/resiliations/route";
import { purgerMotifsResiliation } from "@/lib/resiliation-conservation";

const MAINTENANT = new Date("2026-11-06T10:00:00Z");
const requete = (jeton?: string) =>
  new NextRequest("https://deviens-marrant.fr/api/admin/resiliations", { headers: jeton ? { authorization: `Bearer ${jeton}` } : {} });
const absente = () => Object.assign(new Error('The table "public.CancellationFeedback" does not exist'), { code: "P2021" });

beforeEach(() => {
  findMany.mockReset();
  deleteMany.mockReset();
  process.env.ADMIN_PASSWORD = "admin-test-secret";
  jest.spyOn(console, "error").mockImplementation(() => {});
});
afterEach(() => jest.restoreAllMocks());

describe("GET /api/admin/resiliations", () => {
  it("sans jeton ou mauvais jeton : 401, aucune lecture", async () => {
    expect((await GET(requete())).status).toBe(401);
    expect((await GET(requete("faux"))).status).toBe(401);
    expect(findMany).not.toHaveBeenCalled();
  });

  it("table absente : 200 { disponible: false }", async () => {
    findMany.mockRejectedValue(absente());
    const res = await GET(requete("admin-test-secret"));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual(expect.objectContaining({ disponible: false }));
  });

  it("comptes seulement : ni mot libre ni identifiant dans la réponse", async () => {
    findMany.mockResolvedValue([
      { reasons: ["prix", "temps"], comment: "Je m’appelle Léa Martin", createdAt: new Date("2026-11-01T10:00:00Z") },
      { reasons: ["prix"], comment: null, createdAt: new Date("2026-01-01T10:00:00Z") },
    ]);
    const res = await GET(requete("admin-test-secret"));
    const corps = await res.json();
    expect(res.status).toBe(200);
    expect(corps).toEqual(expect.objectContaining({ disponible: true, reponses: 2, avecMot: 1 }));
    expect(corps.parRaison.find((r: { code: string }) => r.code === "prix").total).toBe(2);
    const texte = JSON.stringify(corps);
    expect(texte).not.toContain("Léa");
    expect(texte).not.toMatch(/userId|comment"/);
    expect(findMany.mock.calls[0][0].select).toEqual({ reasons: true, comment: true, createdAt: true });
  });
});

describe("purge des réponses à la résiliation (24 mois, provisoire)", () => {
  it("efface les lignes créées avant now - 24 mois", async () => {
    deleteMany.mockResolvedValue({ count: 3 });
    await expect(purgerMotifsResiliation(MAINTENANT)).resolves.toBe(3);
    expect(deleteMany).toHaveBeenCalledWith({ where: { createdAt: { lt: new Date("2024-11-06T10:00:00Z") } } });
  });
  it("table absente : 0, aucune erreur", async () => {
    deleteMany.mockRejectedValue(absente());
    await expect(purgerMotifsResiliation(MAINTENANT)).resolves.toBe(0);
  });
  it("autre erreur : remontée (journalisée par la tâche du matin)", async () => {
    deleteMany.mockRejectedValue(new Error("timeout"));
    await expect(purgerMotifsResiliation(MAINTENANT)).rejects.toThrow("timeout");
  });
});

describe("purge branchée sur la tâche quotidienne existante (aucun nouveau cron)", () => {
  it("runLettreHebdoEntretienJob (4 h, Paris) appelle purgerMotifsResiliation dans un essai à part", () => {
    const fs = require("fs") as typeof import("fs");
    const path = require("path") as typeof import("path");
    const jobs = fs.readFileSync(path.join(__dirname, "../../lib/scheduler/jobs.ts"), "utf8");
    const tache = jobs.slice(jobs.indexOf("const runLettreHebdoEntretienJob"), jobs.indexOf("const runLettreEntretienJob"));
    expect(tache).toContain("purgerMotifsResiliation(now)");
    expect(tache.match(/try \{/g)?.length).toBe(2);
    expect(fs.readdirSync(path.join(__dirname, "../../app/api/cron")).some((d) => /resiliation/.test(d))).toBe(false);
  });
});
