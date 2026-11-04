/**
 * @jest-environment node
 *
 * s23 (décision de Thomas du 04/11) : la réponse publique de /api/daily ne
 * contient que les champs affichés par l'accueil (liste fermée), exercice
 * « À toi de jouer » compris. Aucun champ interne ne doit fuiter.
 *
 * Le mock applique le `select` comme Prisma, sur des lignes COMPLÈTES (tous
 * les champs du schéma) : sans select, tout fuiterait et le test échouerait.
 */
type Row = Record<string, unknown>;
type Select = Record<string, true | { select: Select }>;

function applySelect(row: Row | null, select?: Select): Row | null {
  if (!row || !select) return row;
  const out: Row = {};
  for (const [key, rule] of Object.entries(select)) {
    out[key] = rule === true ? row[key] : applySelect(row[key] as Row | null, rule.select);
  }
  return out;
}

const DATES = { createdAt: new Date("2026-01-01"), updatedAt: new Date("2026-02-01") };
const REVIEW = { copyReviewedAt: new Date("2026-03-01"), copyReviewVersion: 2, copyVerdict: "GARDER" };

const JOKE_ROW: Row = {
  id: "joke-1", content: "Setup", punchline: "Chute", category: "BOULOT", maturityLevel: 1, type: "CLASSIQUE",
  isActive: true, generatedByAI: true, comedyTechnique: "Technique", techniqueExplanation: "Pourquoi",
  howToApply: "À toi de jouer", originalContent: "Ancien setup", originalPunchline: "Ancienne chute",
  ...REVIEW, ...DATES,
};
const TIP_ROW: Row = {
  id: "tip-1", title: "Titre", content: "Conseil", category: "TIMING", difficulty: "DEBUTANT", example: "Exemple",
  exercise: "Exercice", isActive: true, generatedByAI: true, originalTitle: "Ancien titre",
  originalContent: "Ancien conseil", ...REVIEW, ...DATES,
};
const VIDEO_ROW: Row = {
  id: "video-1", youtubeId: "abc", title: "Vidéo", channelName: "Chaîne", duration: "PT5M", category: "TIMING",
  difficulty: "DEBUTANT", description: "Description", technique: "Timing", learnings: ["A : b"], exercise: "Exo",
  isActive: true, generatedByAI: true, ...DATES,
};

const mockPrisma = {
  dailyContent: { findUnique: jest.fn() },
  joke: { count: jest.fn(), findFirst: jest.fn() },
  tip: { count: jest.fn(), findFirst: jest.fn() },
  video: { count: jest.fn(), findFirst: jest.fn() },
};
jest.mock("@/lib/prisma", () => ({
  get prisma() {
    return mockPrisma;
  },
}));

import { GET } from "@/app/api/daily/route";

const INTERNAL_FIELDS = [
  "originalContent", "originalPunchline", "originalTitle", "copyVerdict", "copyReviewVersion", "copyReviewedAt",
  "generatedByAI", "isActive", "createdAt", "updatedAt", "maturityLevel", "type", "description", "duration",
];
const HOME_FIELDS = {
  joke: ["id", "content", "punchline", "category", "comedyTechnique", "techniqueExplanation", "howToApply"],
  tip: ["id", "title", "content", "category", "difficulty", "example", "exercise"],
  video: ["id", "youtubeId", "title", "channelName", "category", "technique", "learnings", "exercise"],
};

function expectPublic(body: Record<string, Row>) {
  for (const kind of ["joke", "tip", "video"] as const) {
    expect(Object.keys(body[kind]).sort()).toEqual([...HOME_FIELDS[kind]].sort());
    for (const field of INTERNAL_FIELDS) expect(body[kind]).not.toHaveProperty(field);
  }
  expect(body.joke.howToApply).toBe("À toi de jouer");
  expect(body.joke.techniqueExplanation).toBe("Pourquoi");
}

const findFirstWithSelect = (row: Row) => ({ select }: { select?: Select }) =>
  Promise.resolve(applySelect(row, select));

beforeEach(() => {
  jest.clearAllMocks();
  mockPrisma.dailyContent.findUnique.mockImplementation(({ include, select }: { include?: unknown; select?: Select }) =>
    Promise.resolve(
      include ? { date: "2026-11-04", joke: JOKE_ROW, tip: TIP_ROW, video: VIDEO_ROW }
        : applySelect({ id: "dc", date: "2026-11-04", joke: JOKE_ROW, tip: TIP_ROW, video: VIDEO_ROW, ...DATES }, select),
    ),
  );
  mockPrisma.joke.findFirst.mockImplementation(findFirstWithSelect(JOKE_ROW));
  mockPrisma.tip.count.mockResolvedValue(3);
  mockPrisma.tip.findFirst.mockImplementation(findFirstWithSelect(TIP_ROW));
  mockPrisma.video.count.mockResolvedValue(2);
  mockPrisma.video.findFirst.mockImplementation(findFirstWithSelect(VIDEO_ROW));
});

describe("GET /api/daily — liste fermée de champs (s23)", () => {
  it("contenu du jour configuré : aucun champ interne, champs de l'accueil présents", async () => {
    const body = await (await GET()).json();
    expect(Object.keys(body).sort()).toEqual(["date", "joke", "tip", "video"]);
    expectPublic(body);
    expect(mockPrisma.dailyContent.findUnique.mock.calls[0][0]).not.toHaveProperty("include");
  });

  it("repli, pool validé (ligne entière renvoyée par pickValidatedJoke) : projetée sur la liste fermée", async () => {
    mockPrisma.dailyContent.findUnique.mockResolvedValue(null);
    mockPrisma.joke.count.mockResolvedValue(4);
    const body = await (await GET()).json();
    expectPublic(body);
    expect(body.joke.id).toBe("joke-1");
  });

  it("repli historique (pool validé vide) : aucun champ interne", async () => {
    mockPrisma.dailyContent.findUnique.mockResolvedValue(null);
    mockPrisma.joke.count.mockImplementation(({ where }: { where?: Row }) =>
      Promise.resolve(where?.copyVerdict === "GARDER" ? 0 : 7),
    );
    const body = await (await GET()).json();
    expectPublic(body);
  });
});
