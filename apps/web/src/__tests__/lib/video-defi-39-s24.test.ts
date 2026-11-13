/**
 * @jest-environment node
 *
 * D10c (s24) : défi de la vidéo 39, tiret cadratin remplacé par « Relativise. » « Justement, … »
 * (décision Thomas du 13/11). Une fiche, un champ, garde-fou sur le texte en base, marqueur
 * DataPatch dans la même transaction, idempotent, aucune autre vidéo lue ni écrite.
 */
const mockVideoFindUnique = jest.fn();
const mockVideoFindMany = jest.fn();
const mockVideoUpdate = jest.fn((a: unknown) => ({ op: "video.update", a }));
const mockPatchFindUnique = jest.fn();
const mockPatchCreate = jest.fn((a: unknown) => ({ op: "dataPatch.create", a }));
const mockTransaction = jest.fn(async (ops: unknown[]) => ops);

jest.mock("@/lib/prisma", () => ({
  prisma: {
    video: {
      findUnique: (...a: unknown[]) => mockVideoFindUnique(...a),
      findMany: (...a: unknown[]) => mockVideoFindMany(...a),
      update: (a: unknown) => mockVideoUpdate(a),
    },
    dataPatch: {
      findUnique: (...a: unknown[]) => mockPatchFindUnique(...a),
      create: (a: unknown) => mockPatchCreate(a),
    },
    $transaction: (ops: unknown[]) => mockTransaction(ops),
  },
}));
jest.mock("@/lib/db-retry", () => ({
  withDbRetry: <T,>(fn: () => Promise<T>) => fn(),
}));

import videosSeed from "../../../../../docs/content/videos-seed.json";
import {
  applyVideoDefi39S24Task,
  deciderDefi39,
  VIDEO_DEFI_39_AVANTS,
  VIDEO_DEFI_39_CIBLE,
  VIDEO_DEFI_39_PATCH_ID,
  VIDEO_DEFI_39_YOUTUBE_ID,
} from "@/lib/video-defi-39-s24";

const seed = videosSeed as Array<{ id: number; youtubeId: string; exercise?: string | null }>;
/** Texte en base depuis s20 (lecture de la base jetable, identique à `video-content-s20.json`, fiche 39). */
const EN_BASE_S20 =
  "DÉFI CONTRE-INJONCTION : pendant 5 jours, note chaque soir une injonction entendue dans la journée (« Souris ! », « Ça va aller », « Relativise »). Le 6e jour, écris pour chacune une réponse honnête et drôle, par exemple : « Relativise. Justement, j'ai relativisé, c'est pour ça que je m'inquiète. » Garde celle que tu oserais vraiment dire.";

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(console, "log").mockImplementation(() => {});
  jest.spyOn(console, "error").mockImplementation(() => {});
});
afterEach(() => jest.restoreAllMocks());

describe("défi de la vidéo 39 (D10c s24)", () => {
  it("cible = champ exercise de la fiche 39 du seed, deux répliques, zéro tiret cadratin", () => {
    expect(VIDEO_DEFI_39_CIBLE).toBe(seed.find((v) => v.id === 39)?.exercise);
    expect(VIDEO_DEFI_39_CIBLE).toContain("« Relativise. » « Justement, j'ai relativisé, c'est pour ça que je m'inquiète. »");
    expect(VIDEO_DEFI_39_CIBLE).not.toContain("—");
  });

  it("aucun défi du seed vidéo ne porte de tiret cadratin", () => {
    for (const v of seed) expect(v.exercise ?? "").not.toContain("—");
  });

  it("textes d'avant acceptés : celui en base depuis s20 et celui à tiret ; un seul mot de ponctuation d'écart", () => {
    expect(VIDEO_DEFI_39_AVANTS[0]).toBe(EN_BASE_S20);
    expect(VIDEO_DEFI_39_AVANTS[1]).toBe(EN_BASE_S20.replace("Relativise. Justement", "Relativise. — Justement"));
    expect(deciderDefi39(EN_BASE_S20)).toBe("ecrire");
    expect(deciderDefi39(VIDEO_DEFI_39_AVANTS[1])).toBe("ecrire");
    expect(deciderDefi39(VIDEO_DEFI_39_CIBLE)).toBe("deja");
    expect(deciderDefi39(`${EN_BASE_S20} `)).toBe("refus");
    expect(deciderDefi39(null)).toBe("refus");
  });

  it("écrit la seule fiche 39, le seul champ exercise, avec le marqueur dans la même transaction", async () => {
    mockPatchFindUnique.mockResolvedValue(null);
    mockVideoFindUnique.mockResolvedValue({ id: "vid39", exercise: EN_BASE_S20 });
    await applyVideoDefi39S24Task();
    expect(mockVideoFindUnique).toHaveBeenCalledWith(
      expect.objectContaining({ where: { youtubeId: VIDEO_DEFI_39_YOUTUBE_ID } }),
    );
    expect(mockVideoFindMany).not.toHaveBeenCalled();
    expect(mockVideoUpdate).toHaveBeenCalledTimes(1);
    expect(mockVideoUpdate).toHaveBeenCalledWith({ where: { id: "vid39" }, data: { exercise: VIDEO_DEFI_39_CIBLE } });
    const create = mockPatchCreate.mock.calls[0][0] as { data: { patchId: string; note: string } };
    expect(create.data.patchId).toBe(VIDEO_DEFI_39_PATCH_ID);
    expect(JSON.parse(create.data.note)).toMatchObject({ videoId: "vid39", before: { exercise: EN_BASE_S20 } });
    expect(mockTransaction).toHaveBeenCalledTimes(1);
  });

  it("idempotent : marqueur présent, rien lu ni écrit", async () => {
    mockPatchFindUnique.mockResolvedValue({ patchId: VIDEO_DEFI_39_PATCH_ID });
    await applyVideoDefi39S24Task();
    expect(mockVideoFindUnique).not.toHaveBeenCalled();
    expect(mockTransaction).not.toHaveBeenCalled();
  });

  it("garde-fou : texte retouché depuis, refus sans écriture ; déjà au texte, rien", async () => {
    mockPatchFindUnique.mockResolvedValue(null);
    mockVideoFindUnique.mockResolvedValue({ id: "vid39", exercise: "Texte retouché à la main." });
    await applyVideoDefi39S24Task();
    expect(console.error).toHaveBeenCalledWith(expect.stringContaining("GARDE-FOU"));
    mockVideoFindUnique.mockResolvedValue({ id: "vid39", exercise: VIDEO_DEFI_39_CIBLE });
    await applyVideoDefi39S24Task();
    expect(mockTransaction).not.toHaveBeenCalled();
  });

  it("fail-safe : erreur de base journalisée, jamais levée", async () => {
    mockPatchFindUnique.mockRejectedValue(new Error("db down"));
    await expect(applyVideoDefi39S24Task()).resolves.toBeUndefined();
  });
});
