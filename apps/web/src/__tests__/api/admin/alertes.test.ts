/**
 * @jest-environment node
 *
 * GET /api/admin/alertes (s15, 06/10/2026) : route lue chaque matin par la
 * session. Protégée par Bearer ADMIN_PASSWORD ; chaque lecture est datée (filet
 * 48 h du digest), sauf `?apercu=1`.
 */
const mockRows = new Map<string, { namespace: string; key: string; value: unknown }>();
jest.mock("@/lib/prisma", () => {
  const id = (w: { namespace_key: { namespace: string; key: string } }) => `${w.namespace_key.namespace}|${w.namespace_key.key}`;
  return {
    prisma: {
      ceoMemory: {
        findUnique: async ({ where }: { where: { namespace_key: { namespace: string; key: string } } }) => mockRows.get(id(where)) ?? null,
        upsert: async (a: { where: { namespace_key: { namespace: string; key: string } }; create: { namespace: string; key: string; value: unknown }; update: { value: unknown } }) => {
          const prev = mockRows.get(id(a.where));
          mockRows.set(id(a.where), prev ? { ...prev, ...a.update } : { ...a.create });
          return null;
        },
        findMany: async ({ where }: { where: { namespace: string } }) => [...mockRows.values()].filter((r) => r.namespace === where.namespace),
        deleteMany: async () => null,
      },
    },
  };
});

import { NextRequest } from "next/server";
import { GET } from "@/app/api/admin/alertes/route";
import { getDerniereLecture, recordAdminAlert } from "@/lib/admin-alerts";

const req = (qs = "", auth: string | null = "Bearer secret") =>
  new NextRequest(`https://deviens-marrant.fr/api/admin/alertes${qs}`, { headers: auth ? { authorization: auth } : {} });

beforeEach(() => {
  mockRows.clear();
  process.env.ADMIN_PASSWORD = "secret";
  jest.spyOn(console, "warn").mockImplementation(() => undefined);
});

describe("GET /api/admin/alertes", () => {
  it("401 sans Bearer ou avec un mauvais mot de passe", async () => {
    expect((await GET(req("", null))).status).toBe(401);
    expect((await GET(req("", "Bearer faux"))).status).toBe(401);
    expect(await getDerniereLecture()).toBeNull();
  });

  it("500 si ADMIN_PASSWORD absent", async () => {
    delete process.env.ADMIN_PASSWORD;
    expect((await GET(req())).status).toBe(500);
  });

  it("liste date, type, réseau, détail ; date la lecture", async () => {
    await recordAdminAlert({ cle: "social-file-basse-instagram", sujet: "File Instagram basse : 3 jour(s)", html: "<p>Couvre 3 jours.</p>" });
    await recordAdminAlert({ cle: "social-token-buffer", sujet: "Token Buffer expire", html: "<p>Régénère.</p>" });
    const res = await GET(req());
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toMatchObject({ success: true, lecturePrecedente: null, total: 2, nouvelles: 2 });
    const fb = body.alertes.find((a: { type: string }) => a.type === "social-file-basse");
    expect(fb).toMatchObject({ classe: "B", reseau: "instagram", detail: "Couvre 3 jours.", occurrences: 1, nouvelle: true });
    expect(typeof fb.date).toBe("string");
    expect(await getDerniereLecture()).toBeInstanceOf(Date);
    // 2e lecture : plus rien de nouveau.
    const again = await (await GET(req())).json();
    expect(again.nouvelles).toBe(0);
  });

  it("?classe=A filtre ; ?apercu=1 ne date pas la lecture", async () => {
    await recordAdminAlert({ cle: "social-file-basse-x", sujet: "File X basse", html: "x" });
    await recordAdminAlert({ cle: "llm-budget", sujet: "Coupe-circuit", html: "x" });
    const body = await (await GET(req("?classe=A&apercu=1"))).json();
    expect(body.alertes.map((a: { cle: string }) => a.cle)).toEqual(["llm-budget"]);
    expect(await getDerniereLecture()).toBeNull();
  });
});
