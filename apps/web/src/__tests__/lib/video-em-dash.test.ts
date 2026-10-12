/**
 * Tests s20 : retrait des tirets cadratins des fiches vidéo (décision Thomas du
 * 12/10). Ponctuation seulement : aucun mot changé, marqueur `DataPatch` par
 * fiche dans la même transaction, `note.before` = champs d'origine, idempotent.
 * + gabarit de méta de /videos/[slug] sans « — ».
 */
const mockVideoFindMany = jest.fn();
const mockVideoUpdate = jest.fn((a: unknown) => ({ op: "video.update", a }));
const mockPatchFindUnique = jest.fn();
const mockPatchCreate = jest.fn((a: unknown) => ({ op: "dataPatch.create", a }));
const mockTransaction = jest.fn(async (ops: unknown[]) => ops);

jest.mock("@/lib/prisma", () => ({
  prisma: {
    video: {
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

import {
  countEmDashes,
  stripVideoEmDashes,
  stripVideoEmDashesTask,
  VIDEO_EM_DASH_PATCH_VERSION,
} from "@/lib/video-em-dash";

/** Fiche type, extraits réels de la base (lecture seule du 12/10). */
const AVEC_TIRETS = {
  id: "v1",
  youtubeId: "t7fgrrRVyaU",
  description:
    "Regarde pour apprendre la TECHNIQUE DE L'ETHNOLOGUE. Élodie Poux observe l'école maternelle comme une anthropologue étudierait une tribu — avec distance et faux sérieux.",
  technique: "Ethnologue",
  learnings: [
    "TECHNIQUE DE L'ETHNOLOGUE : observe un lieu familier (bureau, école, transport) comme un chercheur qui découvre une civilisation — la distance crée le décalage comique",
    "Sans tiret ici",
  ],
  exercise: "Choisis un lieu — ton bureau — et décris-le comme un explorateur.",
};
const SANS_TIRET = {
  id: "v2",
  youtubeId: "abcdefghijk",
  description: "Une fiche propre.",
  technique: "Timing",
  learnings: null,
  exercise: null,
};

const words = (v: unknown) => (JSON.stringify(v ?? "").match(/[\p{L}\p{N}]+/gu) ?? []).join(" ");

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(console, "log").mockImplementation(() => undefined);
  jest.spyOn(console, "error").mockImplementation(() => undefined);
  mockVideoFindMany.mockResolvedValue([AVEC_TIRETS, SANS_TIRET]);
  mockPatchFindUnique.mockResolvedValue(null);
});
afterEach(() => jest.restoreAllMocks());

describe("stripVideoEmDashes", () => {
  it("retire tous les « — » sans changer un mot ; fiche sans tiret → null", () => {
    const after = stripVideoEmDashes(AVEC_TIRETS)!;
    expect(countEmDashes(AVEC_TIRETS)).toBe(4);
    expect(countEmDashes(after)).toBe(0);
    for (const k of ["description", "technique", "learnings", "exercise"] as const) {
      expect(words(after[k])).toBe(words(AVEC_TIRETS[k]));
    }
    expect(after.learnings![1]).toBe("Sans tiret ici");
    expect(stripVideoEmDashes(SANS_TIRET)).toBeNull();
  });
});

describe("stripVideoEmDashesTask", () => {
  it("update + marqueur dans la même transaction, note.before = champs d'origine, champs modifiés seulement", async () => {
    await stripVideoEmDashesTask();
    expect(mockTransaction).toHaveBeenCalledTimes(1);
    const [ops] = mockTransaction.mock.calls[0];
    expect(ops).toHaveLength(2);

    const update = mockVideoUpdate.mock.calls[0][0] as { where: { id: string }; data: Record<string, unknown> };
    expect(update.where).toEqual({ id: "v1" });
    expect(Object.keys(update.data).sort()).toEqual(["description", "exercise", "learnings"]);
    expect(JSON.stringify(update.data)).not.toContain("—");

    const patch = mockPatchCreate.mock.calls[0][0] as { data: { patchId: string; note: string } };
    expect(patch.data.patchId).toBe(`video-em-dash:v${VIDEO_EM_DASH_PATCH_VERSION}:t7fgrrRVyaU`);
    const note = JSON.parse(patch.data.note);
    expect(note.before).toEqual({
      description: AVEC_TIRETS.description,
      technique: AVEC_TIRETS.technique,
      learnings: AVEC_TIRETS.learnings,
      exercise: AVEC_TIRETS.exercise,
    });
    expect(note.removed).toBe(4);
    expect(console.log).toHaveBeenCalledWith(
      "[startup] tirets cadratins vidéos v1 : 1 fiche(s) corrigée(s) (4 tiret(s)), 0 déjà patchée(s).",
    );
  });

  it("idempotent : marqueur présent → aucune écriture ; fiche sans tiret jamais lue ni marquée", async () => {
    mockPatchFindUnique.mockResolvedValue({ patchId: "video-em-dash:v1:t7fgrrRVyaU" });
    await stripVideoEmDashesTask();
    expect(mockTransaction).not.toHaveBeenCalled();
    expect(mockVideoUpdate).not.toHaveBeenCalled();
    expect(mockPatchFindUnique).toHaveBeenCalledTimes(1);
    expect(console.log).toHaveBeenCalledWith(
      "[startup] tirets cadratins vidéos v1 : 0 fiche(s) corrigée(s) (0 tiret(s)), 1 déjà patchée(s).",
    );
  });

  it("2e passage sur le texte corrigé : rien à faire", async () => {
    mockVideoFindMany.mockResolvedValue([{ ...AVEC_TIRETS, ...stripVideoEmDashes(AVEC_TIRETS) }]);
    await stripVideoEmDashesTask();
    expect(mockPatchFindUnique).not.toHaveBeenCalled();
    expect(mockTransaction).not.toHaveBeenCalled();
  });

  it("fail-safe : erreur DB sur une fiche → pas de throw, les autres continuent", async () => {
    mockVideoFindMany.mockResolvedValue([AVEC_TIRETS, { ...AVEC_TIRETS, id: "v3", youtubeId: "zzzzzzzzzzz" }]);
    mockTransaction.mockRejectedValueOnce(new Error("boom"));
    await expect(stripVideoEmDashesTask()).resolves.toBeUndefined();
    expect(mockTransaction).toHaveBeenCalledTimes(2);
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining("1 fiche(s) corrigée(s)"));
  });

  it("lecture impossible → pas de throw, aucune écriture", async () => {
    mockVideoFindMany.mockRejectedValue(new Error("db down"));
    await expect(stripVideoEmDashesTask()).resolves.toBeUndefined();
    expect(mockTransaction).not.toHaveBeenCalled();
  });
});
