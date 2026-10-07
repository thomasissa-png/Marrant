/**
 * @jest-environment node
 *
 * s17 lot E : « Reprendre ton parcours » au format de l'étalon 3.4 A, avec le
 * titre de l'étape suivante (`nextStepTitle`, lu dans le seed comme la liste /parcours).
 */
const getServerSession = jest.fn();
jest.mock("next-auth", () => ({ getServerSession: (...a: unknown[]) => getServerSession(...a) }));
jest.mock("@/lib/auth", () => ({ authOptions: {} }));

const findMany = jest.fn();
jest.mock("@/lib/prisma", () => ({ prisma: { userPathProgress: { findMany: (...a: unknown[]) => findMany(...a) } } }));

import { GET } from "@/app/api/user/progress/route";
import { getSeedForSlug } from "@/lib/parcours-data";

const steps = (n: number) => Array.from({ length: n }, (_, i) => ({ id: `s${i + 1}`, order: i + 1 }));

function row(slug: string, completed: number[], total: number) {
  return {
    learningPathId: `lp-${slug}`,
    completedSteps: completed,
    completedAt: null,
    startedAt: new Date("2026-10-01T00:00:00.000Z"),
    learningPath: { slug, title: `Parcours ${slug}`, icon: "x", steps: steps(total) },
  };
}

beforeEach(() => {
  jest.clearAllMocks();
  getServerSession.mockResolvedValue({ user: { id: "u1" } });
});

describe("/api/user/progress : titre de l'étape à reprendre", () => {
  it("parcours de 6 étapes, 2 faites : étape 3 et son titre du seed", async () => {
    findMany.mockResolvedValue([row("confiance", [1, 2], 6)]);
    const body = await (await GET()).json();
    const attendu = getSeedForSlug("confiance")!.steps.find((s) => s.week === 3)!.moduleTitle;
    expect(body.parcours[0]).toMatchObject({ nextStepOrder: 3, nextStepTitle: attendu });
    expect(attendu).toBeTruthy();
  });

  it("parcours fini : ni étape ni titre ; parcours inconnu du seed : titre null", async () => {
    findMany.mockResolvedValue([row("machine-a-cafe", [1, 2, 3], 3), row("slug-inconnu", [], 2)]);
    const body = await (await GET()).json();
    expect(body.parcours[0]).toMatchObject({ nextStepOrder: null, nextStepTitle: null });
    expect(body.parcours[1]).toMatchObject({ nextStepOrder: 1, nextStepTitle: null });
  });
});
