/**
 * @jest-environment node
 *
 * Trajet de conversion s21, tour 2 (arbitrage 5) : fuite de l'exercice dans les API des listes.
 * Le HTML public (`lib/catalogue-pages.ts`) vidait déjà les champs réservés ; les API qui
 * rechargent la liste côté client renvoyaient la ligne entière à un visiteur ou à un compte
 * gratuit (« Exercice » visible dans un conseil déplié, alors que le tableau dit « Exercices des
 * fiches : Non »). Attendu : vidés pour tout compte non Premium, intacts pour un Premium.
 */
const getServerSession = jest.fn();
jest.mock("next-auth", () => ({ getServerSession: (...a: unknown[]) => getServerSession(...a) }));
jest.mock("@/lib/auth", () => ({ authOptions: {} }));

const userFindUnique = jest.fn();
const jokeFindMany = jest.fn();
const tipFindMany = jest.fn();
const videoFindMany = jest.fn();
const videoCount = jest.fn();
jest.mock("@/lib/prisma", () => ({
  prisma: {
    user: { findUnique: (...a: unknown[]) => userFindUnique(...a) },
    joke: { findMany: (...a: unknown[]) => jokeFindMany(...a) },
    tip: { findMany: (...a: unknown[]) => tipFindMany(...a) },
    video: { findMany: (...a: unknown[]) => videoFindMany(...a), count: () => videoCount(), findFirst: jest.fn() },
    dailyContent: { findUnique: jest.fn().mockResolvedValue(null) },
  },
}));

import { NextRequest } from "next/server";
import { GET as getJokes } from "@/app/api/jokes/route";
import { GET as getTips } from "@/app/api/tips/route";
import { GET as getVideos } from "@/app/api/videos/route";

const VANNE = { id: "j1", content: "Une vanne", punchline: "Chute", category: "GENERAL", type: "ONE_LINER", howToApply: "CONSIGNE SECRETE", createdAt: new Date() };
const CONSEIL = { id: "t1", title: "Conseil", content: "Contenu", example: "Exemple public", exercise: "EXERCICE SECRET", category: "GENERAL", createdAt: new Date() };
const VIDEO = { id: "v1", title: "Vidéo", channelName: "Chaîne", learnings: ["POINT SECRET"], exercise: "EXERCICE VIDEO SECRET", createdAt: new Date() };

function seConnecter(plan: "PREMIUM" | "FREE" | null) {
  getServerSession.mockResolvedValue(plan ? { user: { id: "u1" } } : null);
  userFindUnique.mockResolvedValue(plan ? { plan } : null);
}

beforeEach(() => {
  jest.clearAllMocks();
  // Appel 1 : candidats (id + champ de dédoublonnage) ; appel 2 : lignes complètes de la page.
  jokeFindMany.mockImplementation(({ select }: { select?: unknown }) => Promise.resolve(select ? [{ id: "j1", content: "Une vanne" }] : [VANNE]));
  tipFindMany.mockImplementation(({ select }: { select?: unknown }) => Promise.resolve(select ? [{ id: "t1", title: "Conseil" }] : [CONSEIL]));
  videoFindMany.mockResolvedValue([VIDEO]);
  videoCount.mockResolvedValue(1);
});

const req = (chemin: string) => new NextRequest(`http://localhost${chemin}`);

describe.each([
  ["visiteur", null],
  ["compte gratuit", "FREE"],
] as const)("%s : champs réservés vidés", (_nom, plan) => {
  it("/api/tips : exercise vide, exemple gardé", async () => {
    seConnecter(plan);
    const corps = await (await getTips(req("/api/tips"))).json();
    expect(corps.tips).toHaveLength(1);
    expect(corps.tips[0].exercise).toBe("");
    expect(corps.tips[0].example).toBe("Exemple public");
    expect(JSON.stringify(corps)).not.toContain("SECRET");
  });

  it("/api/jokes : howToApply vide, vanne et chute gardées", async () => {
    seConnecter(plan);
    const corps = await (await getJokes(req("/api/jokes"))).json();
    expect(corps.jokes[0]).toMatchObject({ content: "Une vanne", punchline: "Chute", howToApply: null });
    expect(JSON.stringify(corps)).not.toContain("SECRET");
  });

  it("/api/videos : points clés et exercice vides", async () => {
    seConnecter(plan);
    const corps = await (await getVideos(req("/api/videos"))).json();
    expect(corps.videos[0]).toMatchObject({ title: "Vidéo", learnings: [], exercise: null });
    expect(JSON.stringify(corps)).not.toContain("SECRET");
  });
});

describe("Premium : champs réservés intacts", () => {
  it("les trois API renvoient l'exercice", async () => {
    seConnecter("PREMIUM");
    const [tips, jokes, videos] = await Promise.all([
      getTips(req("/api/tips")).then((r) => r.json()),
      getJokes(req("/api/jokes")).then((r) => r.json()),
      getVideos(req("/api/videos")).then((r) => r.json()),
    ]);
    expect(tips.tips[0].exercise).toBe("EXERCICE SECRET");
    expect(jokes.jokes[0].howToApply).toBe("CONSIGNE SECRETE");
    expect(videos.videos[0]).toMatchObject({ learnings: ["POINT SECRET"], exercise: "EXERCICE VIDEO SECRET" });
  });
});
