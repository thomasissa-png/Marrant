/**
 * Tests s20 : durées réelles des fiches vidéo (API YouTube du 13/10).
 * Garde-fou (durée en base === attendu), marqueur `DataPatch` dans la même
 * transaction, `note.before`, idempotence, absente, résumé ; formats ISO 8601
 * longs (heures) et courts ; contrôle du JSON (89 entrées valides) ; JSON-LD.
 */
jest.mock("@/lib/prisma", () => ({ prisma: {} }));
jest.mock("@/lib/db-retry", () => ({
  withDbRetry: <T,>(fn: () => Promise<T>) => fn(),
}));

import {
  applyVideoDurationsS20Task,
  formatVideoDurationsS20Summary,
  planVideoDurationS20,
  type VideoDurationS20Entry,
  type VideoDurationsS20File,
} from "@/lib/video-durations-s20";
import { isIsoVideoDuration } from "@/lib/video-duration-format";
import { buildVideoObjectJsonLd } from "@/components/seo/json-ld";
import durations from "@/data/video-durations-s20.json";

interface Row {
  id: string;
  youtubeId: string;
  duration: string;
}

const LONG: VideoDurationS20Entry = { youtubeId: "GO-E-pgBqa8", attendu: "PT55M00S", duree: "PT2H26M19S" };
const SHORT: VideoDurationS20Entry = { youtubeId: "short000001", attendu: "PT5M20S", duree: "PT1M51S" };
const file = (...videos: VideoDurationS20Entry[]): VideoDurationsS20File => ({ _meta: { version: 1 }, videos });

let rows: Row[];
let markers: Set<string>;
const db = {
  dataPatch: {
    findMany: jest.fn(async ({ where }: { where: { patchId: { startsWith: string } } }) =>
      [...markers].filter((m) => m.startsWith(where.patchId.startsWith)).map((patchId) => ({ patchId }))),
    create: jest.fn((a: { data: { patchId: string; note: string } }) => ({ op: "dataPatch.create", a })),
  },
  video: {
    findUnique: jest.fn(async ({ where }: { where: { youtubeId: string } }) =>
      rows.find((r) => r.youtubeId === where.youtubeId) ?? null),
    update: jest.fn((a: { where: { id: string }; data: { duration: string } }) => ({ op: "video.update", a })),
  },
  // Simule la base : applique l'update et pose le marqueur (pour tester l'idempotence).
  $transaction: jest.fn(async (ops: Array<{ op: string; a: { where?: { id: string }; data: Record<string, unknown> } }>) => {
    for (const o of ops) {
      if (o.op === "video.update") {
        const row = rows.find((r) => r.id === o.a.where?.id);
        if (row) row.duration = String(o.a.data.duration);
      } else markers.add(String(o.a.data.patchId));
    }
    return ops;
  }),
};
const run = (f: VideoDurationsS20File) =>
  applyVideoDurationsS20Task(db as unknown as Parameters<typeof applyVideoDurationsS20Task>[0], f);

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(console, "log").mockImplementation(() => {});
  jest.spyOn(console, "warn").mockImplementation(() => {});
  jest.spyOn(console, "error").mockImplementation(() => {});
  rows = [
    { id: "cmlong", youtubeId: LONG.youtubeId, duration: LONG.attendu },
    { id: "cmshort", youtubeId: SHORT.youtubeId, duration: SHORT.attendu },
  ];
  markers = new Set();
});

describe("applyVideoDurationsS20Task", () => {
  it("corrige une durée au garde-fou, marqueur et update dans la même transaction, note.before", async () => {
    const r = await run(file(LONG, SHORT));
    expect(r).toMatchObject({ updated: 2, refused: 0, done: 0, missing: 0, failed: 0 });
    expect(rows.map((x) => x.duration)).toEqual(["PT2H26M19S", "PT1M51S"]);
    expect(db.$transaction).toHaveBeenCalledTimes(2);
    const ops = db.$transaction.mock.calls[0][0];
    expect(ops.map((o: { op: string }) => o.op)).toEqual(["video.update", "dataPatch.create"]);
    const created = db.dataPatch.create.mock.calls[0][0].data;
    expect(created.patchId).toBe("video-duration-s20:v1:GO-E-pgBqa8");
    const note = JSON.parse(created.note);
    expect(note).toMatchObject({ videoId: "cmlong", before: { duration: "PT55M00S" }, after: "PT2H26M19S" });
  });

  it("GARDE-FOU : durée en base ≠ attendu → aucune écriture, pas de marqueur, erreur journalisée", async () => {
    rows[0].duration = "PT1H00M00S";
    const r = await run(file(LONG));
    expect(r).toMatchObject({ updated: 0, refused: 1 });
    expect(db.$transaction).not.toHaveBeenCalled();
    expect(db.video.update).not.toHaveBeenCalled();
    expect(markers.size).toBe(0);
    expect(rows[0].duration).toBe("PT1H00M00S");
    expect((console.error as jest.Mock).mock.calls.join(" ")).toContain("GARDE-FOU");
  });

  it("refuse une durée cible hors ISO 8601", async () => {
    const r = await run(file({ ...SHORT, duree: "1:51" }));
    expect(r.refused).toBe(1);
    expect(db.$transaction).not.toHaveBeenCalled();
  });

  it("idempotent : 2e exécution = 0 update, tout « déjà fait », une seule lecture des marqueurs", async () => {
    await run(file(LONG, SHORT));
    jest.clearAllMocks();
    const r = await run(file(LONG, SHORT));
    expect(r).toMatchObject({ updated: 0, done: 2, refused: 0 });
    expect(db.dataPatch.findMany).toHaveBeenCalledTimes(1);
    expect(db.video.findUnique).not.toHaveBeenCalled();
    expect(db.$transaction).not.toHaveBeenCalled();
  });

  it("vidéo absente en base : comptée, ignorée, sans marqueur", async () => {
    const r = await run(file({ youtubeId: "absente0001", attendu: "PT3M00S", duree: "PT3M1S" }));
    expect(r).toMatchObject({ missing: 1, updated: 0 });
    expect(markers.size).toBe(0);
  });

  it("non bloquante : base injoignable ou erreur DB par vidéo → jamais de throw", async () => {
    db.dataPatch.findMany.mockRejectedValueOnce(new Error("Neon froid"));
    await expect(run(file(LONG))).resolves.toMatchObject({ failed: 1, summary: expect.stringContaining("non exécutée") });
    db.video.findUnique.mockRejectedValueOnce(new Error("timeout"));
    const r = await run(file(LONG, SHORT));
    expect(r).toMatchObject({ failed: 1, updated: 1 });
  });

  it("résumé au format attendu", async () => {
    rows[1].duration = "PT9M";
    const r = await run(file(LONG, SHORT, { youtubeId: "absente0001", attendu: "PT1M", duree: "PT2M" }));
    expect(r.summary).toBe("durées vidéo s20 v1 : 1 corrigée(s), 1 refus garde-fou, 0 déjà faite(s), 1 absente(s)");
    expect(formatVideoDurationsS20Summary({ version: 1, updated: 0, refused: 0, done: 89, missing: 0, unchanged: 0, failed: 0 }))
      .toBe("durées vidéo s20 v1 : 0 corrigée(s), 0 refus garde-fou, 89 déjà faite(s), 0 absente(s)");
  });

  it("planVideoDurationS20 : déjà à la bonne durée → unchanged", () => {
    expect(planVideoDurationS20("PT3M", { youtubeId: "x", attendu: "PT3M", duree: "PT3M" })).toEqual({ kind: "unchanged" });
  });
});

describe("durées ISO 8601 longues et courtes", () => {
  it.each(["PT2H26M19S", "PT1H9M56S", "PT1H47M6S", "PT1H", "PT1M51S", "PT54S", "PT9M00S", "PT68M00S"])("%s est valide", (d) => {
    expect(isIsoVideoDuration(d)).toBe(true);
  });
  it.each(["", "PT", "1:51", "P1D", "PT1H2", "2:26:19", "PT-5M"])("« %s » est invalide", (d) => {
    expect(isIsoVideoDuration(d)).toBe(false);
  });

  it("JSON-LD VideoObject : durée > 1 h et < 2 min transmises telles quelles, invalide omise", () => {
    const base = { name: "n", description: "d", thumbnailUrl: "t", uploadDate: "u", contentUrl: "c", embedUrl: "e" };
    expect(buildVideoObjectJsonLd({ ...base, duration: "PT2H26M19S" }).duration).toBe("PT2H26M19S");
    expect(buildVideoObjectJsonLd({ ...base, duration: "PT1M51S" }).duration).toBe("PT1M51S");
    expect(buildVideoObjectJsonLd({ ...base, duration: "5:30" })).not.toHaveProperty("duration");
    expect(buildVideoObjectJsonLd(base)).not.toHaveProperty("duration");
  });
});

describe("src/data/video-durations-s20.json", () => {
  const data = durations as VideoDurationsS20File;
  it("89 entrées, youtubeId uniques, attendu et duree en ISO 8601", () => {
    expect(data._meta.version).toBe(1);
    expect(data.videos).toHaveLength(89);
    expect(new Set(data.videos.map((v) => v.youtubeId)).size).toBe(89);
    for (const v of data.videos) {
      expect(isIsoVideoDuration(v.attendu)).toBe(true);
      expect(isIsoVideoDuration(v.duree)).toBe(true);
    }
  });
  it("porte le nouvel id de la fiche Dany Boon (JNo86HEt86w), plus l'ancien", () => {
    const ids = data.videos.map((v) => v.youtubeId);
    expect(ids).toContain("JNo86HEt86w");
    expect(ids).not.toContain("U80fwIfPC4M");
  });
});
