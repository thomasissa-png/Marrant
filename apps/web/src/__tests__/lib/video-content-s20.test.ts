/**
 * Tests s20 : application des contenus des fiches vidéo (décision Thomas du 12/10).
 * Garde-fou par empreinte, marqueur `DataPatch` par fiche dans la même
 * transaction, `note.before` pour le retour arrière, champs optionnels,
 * changement de youtubeId (fiche 68), catégorie, résumé ; + contrôle du JSON.
 */
jest.mock("@/lib/prisma", () => ({ prisma: {} }));
jest.mock("@/lib/db-retry", () => ({
  withDbRetry: <T,>(fn: () => Promise<T>) => fn(),
}));

import {
  applyVideoContentS20Task,
  videoTextFingerprint,
  type VideoContentS20Fiche,
  type VideoContentS20File,
  type VideoContentS20Row,
} from "@/lib/video-content-s20";
import videoContent from "@/data/video-content-s20.json";

const ROW: VideoContentS20Row = {
  id: "cmrow000000000000001",
  youtubeId: "U80fwIfPC4M",
  title: "Dany Boon - Le culturiste",
  channelName: "Dany Boon",
  category: "ABSURDE",
  description: "Ancienne description.",
  learnings: ["Ancien 1", "Ancien 2"],
  exercise: "Ancien exercice.",
};
const CIBLE = {
  description: "Nouvelle description.",
  learnings: ["TECHNIQUE A : un.", "TECHNIQUE B : deux.", "TECHNIQUE C : trois.", "TECHNIQUE D : quatre."],
  exercise: "Nouvel exercice.",
};
const fiche = (over: Partial<VideoContentS20Fiche> = {}, row: VideoContentS20Row = ROW): VideoContentS20Fiche => ({
  seedId: 68,
  youtubeId: row.youtubeId,
  attendu: videoTextFingerprint(row),
  source: "s11-corrige",
  cible: { ...CIBLE },
  ...over,
});
const file = (...fiches: VideoContentS20Fiche[]): VideoContentS20File => ({ _meta: { version: 1 }, fiches });

let rows: VideoContentS20Row[];
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
    update: jest.fn((a: { where: { id: string }; data: Record<string, unknown> }) => ({ op: "video.update", a })),
  },
  $transaction: jest.fn(async (ops: unknown[]) => ops),
};
const run = (f: VideoContentS20File) =>
  applyVideoContentS20Task(db as unknown as Parameters<typeof applyVideoContentS20Task>[0], f);
const updateData = () => db.video.update.mock.calls[0][0].data;
const note = () => JSON.parse(db.dataPatch.create.mock.calls[0][0].data.note);

beforeEach(() => {
  jest.clearAllMocks();
  rows = [{ ...ROW, learnings: [...(ROW.learnings ?? [])] }];
  markers = new Set();
  jest.spyOn(console, "log").mockImplementation(() => undefined);
  jest.spyOn(console, "warn").mockImplementation(() => undefined);
  jest.spyOn(console, "error").mockImplementation(() => undefined);
});
afterEach(() => jest.restoreAllMocks());

describe("videoTextFingerprint", () => {
  it("16 hex, sensible à l'ordre des learnings et à NULL vs []", () => {
    const fp = videoTextFingerprint(ROW);
    expect(fp).toMatch(/^[0-9a-f]{16}$/);
    expect(videoTextFingerprint({ ...ROW, learnings: ["Ancien 2", "Ancien 1"] })).not.toBe(fp);
    expect(videoTextFingerprint({ ...ROW, learnings: null })).not.toBe(videoTextFingerprint({ ...ROW, learnings: [] }));
    expect(videoTextFingerprint({ ...ROW, exercise: null })).not.toBe(videoTextFingerprint({ ...ROW, exercise: "" }));
  });
});

describe("applyVideoContentS20Task", () => {
  it("applique la cible : update + marqueur dans UNE transaction, before = anciennes valeurs", async () => {
    const r = await run(file(fiche()));
    expect(db.$transaction).toHaveBeenCalledTimes(1);
    expect(db.$transaction.mock.calls[0][0]).toHaveLength(2);
    expect(db.video.update.mock.calls[0][0].where).toEqual({ id: ROW.id });
    const data = updateData();
    expect(data).toMatchObject(CIBLE);
    expect(data.updatedAt).toBeInstanceOf(Date);
    expect(Object.keys(data).sort()).toEqual(["description", "exercise", "learnings", "updatedAt"]);
    expect(db.dataPatch.create.mock.calls[0][0].data.patchId).toBe("video-content-s20:v1:U80fwIfPC4M");
    expect(note()).toMatchObject({
      videoId: ROW.id,
      seedId: 68,
      before: { description: ROW.description, learnings: ROW.learnings, exercise: ROW.exercise },
    });
    expect(r.summary).toBe("contenus vidéo s20 v1 : 1 fiche(s) mise(s) à jour, 0 refus garde-fou, 0 déjà faite(s)");
  });

  it("GARDE-FOU : empreinte différente → aucune écriture, pas de marqueur, refus journalisé", async () => {
    rows[0].learnings = ["Ancien 1", "Ancien 2 retouché à la main"];
    const r = await run(file(fiche()));
    expect(db.$transaction).not.toHaveBeenCalled();
    expect(db.video.update).not.toHaveBeenCalled();
    expect(db.dataPatch.create).not.toHaveBeenCalled();
    expect(r.refused).toBe(1);
    expect(String((console.error as jest.Mock).mock.calls[0][0])).toContain("GARDE-FOU");
  });

  it("base injoignable à la lecture des marqueurs → aucune écriture, pas de throw", async () => {
    db.dataPatch.findMany.mockRejectedValueOnce(new Error("DB froide"));
    const r = await run(file(fiche()));
    expect(db.video.findUnique).not.toHaveBeenCalled();
    expect(db.$transaction).not.toHaveBeenCalled();
    expect(r.failed).toBe(1);
  });

  it("idempotent : marqueur présent → saut, aucune lecture de la fiche", async () => {
    markers.add("video-content-s20:v1:U80fwIfPC4M");
    const r = await run(file(fiche()));
    expect(db.video.findUnique).not.toHaveBeenCalled();
    expect(db.$transaction).not.toHaveBeenCalled();
    expect(r.done).toBe(1);
    expect(r.summary).toBe("contenus vidéo s20 v1 : 0 fiche(s) mise(s) à jour, 0 refus garde-fou, 1 déjà faite(s)");
  });

  it("champs optionnels : seuls ceux présents ET différents partent (title, channelName, category)", async () => {
    await run(file(fiche({ cible: { ...CIBLE, title: "Dany Boon - Le culturiste (version officielle)", channelName: "Dany Boon", category: "TIMING" } })));
    const data = updateData();
    expect(data.title).toBe("Dany Boon - Le culturiste (version officielle)");
    expect(data.category).toBe("TIMING");
    expect(data).not.toHaveProperty("channelName"); // identique en base
    expect(data).not.toHaveProperty("youtubeId");
    expect(note().before).toMatchObject({ title: ROW.title, category: "ABSURDE" });
    expect(note().before).not.toHaveProperty("channelName");
  });

  it("catégorie hors enum TipCategory → refus, aucune écriture", async () => {
    const r = await run(file(fiche({ cible: { ...CIBLE, category: "PHYSIQUE" } })));
    expect(db.$transaction).not.toHaveBeenCalled();
    expect(r.refused).toBe(1);
  });

  it("youtubeId changé (fiche 68) : id libre → update, marqueur sur l'ancien id, before.youtubeId", async () => {
    await run(file(fiche({ cible: { ...CIBLE, youtubeId: "JNo86HEt86w" } })));
    expect(db.video.findUnique).toHaveBeenCalledWith(expect.objectContaining({ where: { youtubeId: "JNo86HEt86w" } }));
    expect(updateData().youtubeId).toBe("JNo86HEt86w");
    expect(db.dataPatch.create.mock.calls[0][0].data.patchId).toBe("video-content-s20:v1:U80fwIfPC4M");
    expect(note().before.youtubeId).toBe("U80fwIfPC4M");
  });

  it("youtubeId cible déjà porté par une autre ligne → refus, aucune écriture", async () => {
    rows.push({ ...ROW, id: "cmautre0000000000002", youtubeId: "JNo86HEt86w" });
    const r = await run(file(fiche({ cible: { ...CIBLE, youtubeId: "JNo86HEt86w" } })));
    expect(db.$transaction).not.toHaveBeenCalled();
    expect(r.refused).toBe(1);
  });

  it("résumé : mises à jour, refus, déjà faites, absentes ; une erreur DB n'arrête pas les autres", async () => {
    const autre: VideoContentS20Row = { ...ROW, id: "cmrow000000000000003", youtubeId: "abcdefghijk" };
    const casse: VideoContentS20Row = { ...ROW, id: "cmrow000000000000004", youtubeId: "zzzzzzzzzzz" };
    rows.push(autre, casse);
    markers.add("video-content-s20:v1:abcdefghijk");
    db.$transaction.mockImplementation(async (ops: unknown[]) => {
      const u = ops[0] as { a: { where: { id: string } } };
      if (u.a.where.id === casse.id) throw new Error("DB froide");
      return ops;
    });
    const r = await run(
      file(
        fiche(),
        fiche({ seedId: 2, attendu: "0000000000000000" }),
        fiche({ seedId: 3 }, autre),
        fiche({ seedId: 4, youtubeId: "absenteABCD" }),
        fiche({ seedId: 5 }, casse),
      ),
    );
    expect(r).toMatchObject({ updated: 1, refused: 1, done: 1, missing: 1, failed: 1 });
    expect(r.summary).toBe(
      "contenus vidéo s20 v1 : 1 fiche(s) mise(s) à jour, 1 refus garde-fou, 1 déjà faite(s) (1 absente(s) en base, 1 erreur(s) DB)",
    );
  });
});

describe("src/data/video-content-s20.json", () => {
  const data = videoContent as VideoContentS20File;
  const raw = JSON.stringify(data);

  it("ni « — » ni « À VÉRIFIER »", () => {
    expect(raw).not.toContain("—");
    expect(raw).not.toMatch(/À VÉRIFIER/i);
  });

  it("chaque fiche : empreinte 16 hex, description et exercice non vides, 4 learnings non vides", () => {
    expect(data.fiches.length).toBeGreaterThan(0);
    for (const f of data.fiches) {
      expect(f.attendu).toMatch(/^[0-9a-f]{16}$/);
      expect(f.cible.description.trim()).not.toBe("");
      expect(f.cible.exercise.trim()).not.toBe("");
      expect(f.cible.learnings).toHaveLength(4);
      for (const l of f.cible.learnings) expect(l.trim()).not.toBe("");
    }
  });

  it("catégories dans l'enum, youtubeId uniques avant et après", () => {
    const enumValues = ["TIMING", "AUTODERISION", "OBSERVATION", "REPARTIE", "STORYTELLING", "ABSURDE", "JEUX_DE_MOTS"];
    const before = data.fiches.map((f) => f.youtubeId);
    const after = data.fiches.map((f) => f.cible.youtubeId ?? f.youtubeId);
    expect(new Set(before).size).toBe(before.length);
    expect(new Set(after).size).toBe(after.length);
    for (const f of data.fiches) {
      if (f.cible.category !== undefined) expect(enumValues).toContain(f.cible.category);
      if (f.cible.youtubeId !== undefined) expect(f.cible.youtubeId).toMatch(/^[A-Za-z0-9_-]{11}$/);
    }
  });
});
