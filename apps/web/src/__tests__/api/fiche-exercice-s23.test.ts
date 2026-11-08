/**
 * @jest-environment node
 *
 * s23 : exercice des fiches conseil et vidéo (et points clés vidéo), puis « À toi de jouer » des
 * vannes (08/11), servi aux seuls abonnés Premium par `/api/fiches/exercice`, jamais dans la
 * page ISR publique.
 */
const getServerSession = jest.fn();
jest.mock("next-auth", () => ({ getServerSession: (...a: unknown[]) => getServerSession(...a) }));
jest.mock("@/lib/auth", () => ({ authOptions: {} }));

const userFindUnique = jest.fn();
const tipFindFirst = jest.fn();
const videoFindFirst = jest.fn();
const jokeFindFirst = jest.fn();
jest.mock("@/lib/prisma", () => ({
  prisma: {
    user: { findUnique: (...a: unknown[]) => userFindUnique(...a) },
    tip: { findFirst: (...a: unknown[]) => tipFindFirst(...a) },
    video: { findFirst: (...a: unknown[]) => videoFindFirst(...a) },
    joke: { findFirst: (...a: unknown[]) => jokeFindFirst(...a) },
  },
}));

import { NextRequest } from "next/server";
import { GET } from "@/app/api/fiches/exercice/route";

let n = 0;
function seConnecter(plan: "PREMIUM" | "FREE" | null) {
  n += 1; // un id par test : le quota en mémoire ne déborde pas d'un test à l'autre
  getServerSession.mockResolvedValue(plan ? { user: { id: `u${n}` } } : null);
  userFindUnique.mockResolvedValue(plan ? { plan } : null);
}

const req = (qs: string) => GET(new NextRequest(`http://localhost/api/fiches/exercice?${qs}`));

beforeEach(() => {
  jest.clearAllMocks();
  tipFindFirst.mockResolvedValue({ exercise: "EXERCICE CONSEIL" });
  videoFindFirst.mockResolvedValue({ exercise: "EXERCICE VIDEO", learnings: ["POINT 1", " ", "POINT 2"] });
  jokeFindFirst.mockResolvedValue({ howToApply: "EXERCICE VANNE" });
});

describe("/api/fiches/exercice", () => {
  it("Premium : exercice du conseil", async () => {
    seConnecter("PREMIUM");
    const res = await req("type=conseil&id=t1");
    expect(res.status).toBe(200);
    expect(res.headers.get("Cache-Control")).toBe("private, no-store");
    expect(await res.json()).toEqual({ exercice: "EXERCICE CONSEIL", pointsCles: [] });
    expect(tipFindFirst).toHaveBeenCalledWith(expect.objectContaining({ where: { id: "t1", isActive: true } }));
  });

  it("Premium : exercice et points clés de la vidéo (lignes vides retirées)", async () => {
    seConnecter("PREMIUM");
    const res = await req("type=video&id=v1");
    expect(await res.json()).toEqual({ exercice: "EXERCICE VIDEO", pointsCles: ["POINT 1", "POINT 2"] });
  });

  it("Premium : champs vides renvoyés vides", async () => {
    seConnecter("PREMIUM");
    tipFindFirst.mockResolvedValue({ exercise: "" });
    videoFindFirst.mockResolvedValue({ exercise: null, learnings: [] });
    expect(await (await req("type=conseil&id=t1")).json()).toEqual({ exercice: null, pointsCles: [] });
    expect(await (await req("type=video&id=v1")).json()).toEqual({ exercice: null, pointsCles: [] });
  });

  it("visiteur : 401, aucune lecture de fiche", async () => {
    seConnecter(null);
    const res = await req("type=video&id=v1");
    expect(res.status).toBe(401);
    expect(JSON.stringify(await res.json())).not.toContain("EXERCICE");
    expect(videoFindFirst).not.toHaveBeenCalled();
  });

  it("compte gratuit : 403, aucune lecture de fiche", async () => {
    seConnecter("FREE");
    const res = await req("type=conseil&id=t1");
    expect(res.status).toBe(403);
    expect(tipFindFirst).not.toHaveBeenCalled();
  });

  it("paramètres invalides : 400 ; fiche absente ou inactive : 404", async () => {
    seConnecter("PREMIUM");
    expect((await req("type=article&id=a1")).status).toBe(400);
    expect((await req("type=conseil")).status).toBe(400);
    tipFindFirst.mockResolvedValue(null);
    expect((await req("type=conseil&id=t9")).status).toBe(404);
  });

  describe("vanne (« À toi de jouer », 08/11)", () => {
    it("Premium : 200, howToApply de la vanne active, privé", async () => {
      seConnecter("PREMIUM");
      const res = await req("type=vanne&id=j1");
      expect(res.status).toBe(200);
      expect(res.headers.get("Cache-Control")).toBe("private, no-store");
      expect(await res.json()).toEqual({ exercice: "EXERCICE VANNE", pointsCles: [] });
      expect(jokeFindFirst).toHaveBeenCalledWith({ where: { id: "j1", isActive: true }, select: { howToApply: true } });
    });

    it("visiteur : 401, aucune lecture de vanne", async () => {
      seConnecter(null);
      const res = await req("type=vanne&id=j1");
      expect(res.status).toBe(401);
      expect(JSON.stringify(await res.json())).not.toContain("EXERCICE");
      expect(jokeFindFirst).not.toHaveBeenCalled();
    });

    it("compte gratuit : 403, aucune lecture de vanne", async () => {
      seConnecter("FREE");
      const res = await req("type=vanne&id=j1");
      expect(res.status).toBe(403);
      expect(JSON.stringify(await res.json())).not.toContain("EXERCICE");
      expect(jokeFindFirst).not.toHaveBeenCalled();
    });

    it("Premium : vanne sans exercice → null ; absente ou inactive → 404", async () => {
      seConnecter("PREMIUM");
      jokeFindFirst.mockResolvedValue({ howToApply: null });
      expect(await (await req("type=vanne&id=j1")).json()).toEqual({ exercice: null, pointsCles: [] });
      jokeFindFirst.mockResolvedValue(null);
      expect((await req("type=vanne&id=j9")).status).toBe(404);
    });
  });
});
