/**
 * Tests — lib/startup-tasks.ts (tâches de démarrage idempotentes, s10).
 *
 * Couvre :
 *  - ensureCeoConfigTask : délègue à ensureCeoConfig, fail-safe (ne throw pas).
 *  - cleanupWildcardSocialPostsTask : UPDATE raw idempotent, fail-safe.
 *  - applyJokeDecryptagesTask : applique les décryptages pré-rédigés depuis le
 *    fichier bundlé (SANS IA), idempotent (skip les déjà remplis), gère les
 *    vannes absentes du fichier, ne bloque pas le boot si la DB échoue.
 *  - runStartupTasks : enchaîne les trois, ne crashe pas si une échoue.
 */

const mockEnsureCeoConfig = jest.fn();
const mockExecuteRawUnsafe = jest.fn();
const mockJokeFindMany = jest.fn();
const mockJokeUpdate = jest.fn();
const mockJokeUpdateMany = jest.fn();
const mockBlogArticleFindUnique = jest.fn();
const mockBlogArticleUpdate = jest.fn();
const mockBlogArticleUpdateMany = jest.fn();
const mockBlogArticleFindMany = jest.fn();
const mockGenerateJokeDecryptage = jest.fn();

jest.mock("@/lib/prisma", () => ({
  prisma: {
    $executeRawUnsafe: (sql: string) => mockExecuteRawUnsafe(sql),
    joke: {
      findMany: (...args: unknown[]) => mockJokeFindMany(...args),
      update: (...args: unknown[]) => mockJokeUpdate(...args),
      updateMany: (...args: unknown[]) => mockJokeUpdateMany(...args),
    },
    blogArticle: {
      findUnique: (...args: unknown[]) => mockBlogArticleFindUnique(...args),
      update: (...args: unknown[]) => mockBlogArticleUpdate(...args),
      updateMany: (...args: unknown[]) => mockBlogArticleUpdateMany(...args),
      findMany: (...args: unknown[]) => mockBlogArticleFindMany(...args),
    },
  },
}));

jest.mock("@/lib/ai/agents/joke-agent", () => ({
  generateJokeDecryptage: (...args: unknown[]) => mockGenerateJokeDecryptage(...args),
}));

jest.mock("@/lib/ai/ceo-helpers", () => ({
  ensureCeoConfig: () => mockEnsureCeoConfig(),
}));

import {
  runStartupTasks,
  applyJokeDecryptagesTask,
  deactivateWeakJokesTask,
  fixPublishedBlogArticlesTask,
  depublishCannibalizedDbArticlesTask,
  backfillMissingJokeDecryptagesTask,
  rewriteRedirectedBlogLinksTask,
} from "@/lib/startup-tasks";
import jokeDecryptages from "@/data/joke-decryptages.json";
import weakJokes from "@/data/weak-jokes.json";
import blogArticleFixes from "@/data/blog-article-fixes.json";
import { DB_LOSER_SLUGS } from "@/lib/seo-redirects";

const fileEntry = (jokeDecryptages as Array<{ content: string; comedyTechnique: string }>)[0];
const weakContents = weakJokes as string[];

beforeEach(() => {
  jest.clearAllMocks();
  mockEnsureCeoConfig.mockResolvedValue({ enabled: false, dryRun: true });
  mockExecuteRawUnsafe.mockResolvedValue(0);
  mockJokeFindMany.mockResolvedValue([]);
  mockJokeUpdate.mockResolvedValue({});
  mockJokeUpdateMany.mockResolvedValue({ count: 0 });
  mockBlogArticleFindUnique.mockResolvedValue(null);
  mockBlogArticleUpdate.mockResolvedValue({});
  mockBlogArticleUpdateMany.mockResolvedValue({ count: 0 });
  mockBlogArticleFindMany.mockResolvedValue([]);
  mockGenerateJokeDecryptage.mockResolvedValue({
    comedyTechnique: "Test technique",
    techniqueExplanation: "Explication test",
    howToApply: "Application test",
  });
  jest.spyOn(console, "log").mockImplementation(() => undefined);
  jest.spyOn(console, "warn").mockImplementation(() => undefined);
  jest.spyOn(console, "error").mockImplementation(() => undefined);
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe("runStartupTasks", () => {
  it("auto-seed CeoConfig, cleanup WILD_CARD et applique les décryptages", async () => {
    await runStartupTasks();
    expect(mockEnsureCeoConfig).toHaveBeenCalledTimes(1);
    expect(mockExecuteRawUnsafe).toHaveBeenCalledTimes(1);
    const sql = mockExecuteRawUnsafe.mock.calls[0][0] as string;
    expect(sql).toContain("UPDATE \"SocialPost\"");
    expect(sql).toContain("'REJECTED'");
    expect(sql).toContain("\"format\"::text = 'WILD_CARD'");
    // applyJokeDecryptagesTask a interrogé les vannes non décryptées.
    expect(mockJokeFindMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { comedyTechnique: null } }),
    );
    // deactivateWeakJokesTask a désactivé les vannes faibles (soft delete).
    expect(mockJokeUpdateMany).toHaveBeenCalledTimes(1);
  });

  it("cleanup idempotent : 0 ligne affectée ne lève aucune erreur", async () => {
    mockExecuteRawUnsafe.mockResolvedValueOnce(0);
    await expect(runStartupTasks()).resolves.toBeUndefined();
  });

  it("fail-safe : une erreur ensureCeoConfig ne bloque pas le cleanup", async () => {
    mockEnsureCeoConfig.mockRejectedValueOnce(new Error("DB froide"));
    await runStartupTasks();
    expect(mockExecuteRawUnsafe).toHaveBeenCalledTimes(1);
  });

  it("fail-safe : une erreur cleanup ne fait pas crasher runStartupTasks", async () => {
    mockExecuteRawUnsafe.mockRejectedValueOnce(new Error("enum invalide"));
    await expect(runStartupTasks()).resolves.toBeUndefined();
  });
});

describe("applyJokeDecryptagesTask", () => {
  it("applique les 3 champs depuis le fichier pour une vanne null (sans IA)", async () => {
    // 1er findMany (comedyTechnique: null) → cette vanne. 2e findMany
    // (seed override, comedyTechnique: not null) → aucune vanne, la nôtre
    // vient d'être remplie.
    mockJokeFindMany.mockImplementationOnce(() =>
      Promise.resolve([{ id: "cuid-1", content: fileEntry.content }]),
    );
    mockJokeFindMany.mockImplementationOnce(() => Promise.resolve([]));

    await applyJokeDecryptagesTask();

    expect(mockJokeUpdate).toHaveBeenCalledWith({
      where: { id: "cuid-1" },
      data: {
        comedyTechnique: fileEntry.comedyTechnique,
        techniqueExplanation: expect.any(String),
        howToApply: expect.any(String),
      },
    });
  });

  it("idempotent : ne lit que les vannes comedyTechnique null", async () => {
    mockJokeFindMany.mockResolvedValue([]);
    await applyJokeDecryptagesTask();

    expect(mockJokeFindMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { comedyTechnique: null } }),
    );
    // Aucune vanne à traiter → aucun update.
    expect(mockJokeUpdate).not.toHaveBeenCalled();
  });

  it("gère une vanne absente du fichier : skip sans crash ni update", async () => {
    mockJokeFindMany.mockResolvedValue([
      { id: "cuid-orphan", content: "Vanne IA qui n'est pas dans le fichier pré-rédigé." },
    ]);

    await expect(applyJokeDecryptagesTask()).resolves.toBeUndefined();
    expect(mockJokeUpdate).not.toHaveBeenCalled();
  });

  it("traite un mix : applique les vannes du fichier, ignore les orphelines", async () => {
    // 1er findMany : pending (NULL). 2e findMany : seed override (pas de match
    // dans le fichier pour cuid-orphan → aucun update supplémentaire).
    mockJokeFindMany.mockImplementationOnce(() =>
      Promise.resolve([
        { id: "cuid-1", content: fileEntry.content },
        { id: "cuid-orphan", content: "Vanne hors fichier." },
      ]),
    );
    mockJokeFindMany.mockImplementationOnce(() => Promise.resolve([]));

    await applyJokeDecryptagesTask();

    expect(mockJokeUpdate).toHaveBeenCalledTimes(1);
    expect(mockJokeUpdate).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: "cuid-1" } }),
    );
  });

  it("fail-safe : une erreur DB (findMany) ne fait pas crasher le boot", async () => {
    // Erreur non-connexion → re-throw immédiat par withDbRetry (pas de backoff),
    // capturé par le try/catch global de la tâche.
    mockJokeFindMany.mockRejectedValue(new Error("relation \"Joke\" does not exist"));
    await expect(applyJokeDecryptagesTask()).resolves.toBeUndefined();
  });

  it("fail-safe : une erreur DB (update) ne fait pas crasher le boot", async () => {
    mockJokeFindMany.mockResolvedValue([{ id: "cuid-1", content: fileEntry.content }]);
    mockJokeUpdate.mockRejectedValue(new Error("write conflict"));
    await expect(applyJokeDecryptagesTask()).resolves.toBeUndefined();
  });

  it("s11 override seed : réécrit le décryptage d'une vanne seed quand le fichier diffère", async () => {
    // 1er findMany : aucune vanne NULL (déjà remplie).
    mockJokeFindMany.mockImplementationOnce(() => Promise.resolve([]));
    // 2e findMany : passe autoritaire seed. Vanne seed avec un vieux décryptage
    // différent du fichier → doit être réécrite.
    mockJokeFindMany.mockImplementationOnce(() =>
      Promise.resolve([
        {
          id: "cuid-seed",
          content: fileEntry.content,
          comedyTechnique: "ancien nom obsolète",
          techniqueExplanation: "ancienne explication",
          howToApply: "ancienne consigne",
        },
      ]),
    );

    await applyJokeDecryptagesTask();

    expect(mockJokeUpdate).toHaveBeenCalledWith({
      where: { id: "cuid-seed" },
      data: {
        comedyTechnique: fileEntry.comedyTechnique,
        techniqueExplanation: expect.any(String),
        howToApply: expect.any(String),
      },
    });
  });

  it("s11 override seed : ne touche pas une vanne seed déjà alignée avec le fichier", async () => {
    mockJokeFindMany.mockImplementationOnce(() => Promise.resolve([]));
    mockJokeFindMany.mockImplementationOnce(() =>
      Promise.resolve([
        {
          id: "cuid-seed",
          content: fileEntry.content,
          comedyTechnique: fileEntry.comedyTechnique,
          techniqueExplanation: (jokeDecryptages as Array<{ techniqueExplanation: string }>)[0].techniqueExplanation,
          howToApply: (jokeDecryptages as Array<{ howToApply: string }>)[0].howToApply,
        },
      ]),
    );

    await applyJokeDecryptagesTask();
    expect(mockJokeUpdate).not.toHaveBeenCalled();
  });
});

describe("deactivateWeakJokesTask", () => {
  it("soft delete : cible les 24 contents faibles encore actifs (isActive false)", async () => {
    mockJokeUpdateMany.mockResolvedValue({ count: 24 });

    await deactivateWeakJokesTask();

    expect(mockJokeUpdateMany).toHaveBeenCalledTimes(1);
    expect(mockJokeUpdateMany).toHaveBeenCalledWith({
      where: { content: { in: weakContents }, isActive: true },
      data: { isActive: false },
    });
  });

  it("match par content : utilise exactement la liste weak-jokes.json (24 entrées)", async () => {
    await deactivateWeakJokesTask();

    const arg = mockJokeUpdateMany.mock.calls[0][0] as {
      where: { content: { in: string[] } };
    };
    expect(arg.where.content.in).toHaveLength(24);
    // Source unique : pas de hardcode, on passe bien le fichier bundlé.
    expect(arg.where.content.in).toEqual(weakContents);
  });

  it("jamais de hard delete : seul isActive passe à false", async () => {
    await deactivateWeakJokesTask();

    const arg = mockJokeUpdateMany.mock.calls[0][0] as { data: Record<string, unknown> };
    expect(arg.data).toEqual({ isActive: false });
  });

  it("idempotent : 2e run sans vanne active matchée = 0 update (count 0)", async () => {
    mockJokeUpdateMany.mockResolvedValueOnce({ count: 24 });
    mockJokeUpdateMany.mockResolvedValueOnce({ count: 0 });

    await deactivateWeakJokesTask(); // 1re passe : 24 désactivées
    await deactivateWeakJokesTask(); // 2e passe : WHERE isActive:true ne matche plus rien

    expect(mockJokeUpdateMany).toHaveBeenCalledTimes(2);
    // La 2e passe renvoie count 0 — aucune erreur, idempotence garantie par le WHERE.
    expect(mockJokeUpdateMany.mock.results[1].value).resolves.toEqual({ count: 0 });
  });

  it("non bloquant : une erreur DB ne fait pas crasher le boot", async () => {
    mockJokeUpdateMany.mockRejectedValue(new Error("relation \"Joke\" does not exist"));
    await expect(deactivateWeakJokesTask()).resolves.toBeUndefined();
  });
});

// ─── s11 lot 3 ────────────────────────────────────────────────────────

describe("fixPublishedBlogArticlesTask (s11 lot 3)", () => {
  const fixes = (blogArticleFixes as { fixes: Array<{ slug: string; search?: string; replace?: string }> }).fixes;

  it("applique un remplacement ciblé si la chaîne est présente", async () => {
    // Prendre le 1er fix qui a search + replace pour un slug donné.
    const firstFix = fixes.find((f) => f.search && f.replace !== undefined);
    if (!firstFix) throw new Error("Fixture blog-article-fixes.json vide — impossible de tester");

    mockBlogArticleFindUnique.mockResolvedValue({
      id: "cuid-article",
      content: `Intro paragraphe.\n\n${firstFix.search}\n\nParagraphe suivant.`,
    });

    await fixPublishedBlogArticlesTask();

    expect(mockBlogArticleUpdate).toHaveBeenCalled();
    const updateCall = mockBlogArticleUpdate.mock.calls[0][0] as {
      where: { id: string };
      data: { content: string; updatedAt: Date };
    };
    expect(updateCall.where).toEqual({ id: "cuid-article" });
    expect(updateCall.data.content).toContain(firstFix.replace);
    expect(updateCall.data.content).not.toContain(firstFix.search);
    expect(updateCall.data.updatedAt).toBeInstanceOf(Date);
  });

  it("idempotent : ne touche pas updatedAt si aucun remplacement effectif", async () => {
    // Article qui ne contient AUCUNE des chaînes cibles.
    mockBlogArticleFindUnique.mockResolvedValue({
      id: "cuid-article",
      content: "Contenu sans aucun motif à corriger, en tutoiement, sans staccato ni témoignage fictif.",
    });

    await fixPublishedBlogArticlesTask();

    expect(mockBlogArticleUpdate).not.toHaveBeenCalled();
  });

  it("skip silencieusement les slugs absents en DB (article statique)", async () => {
    mockBlogArticleFindUnique.mockResolvedValue(null);

    await expect(fixPublishedBlogArticlesTask()).resolves.toBeUndefined();
    expect(mockBlogArticleUpdate).not.toHaveBeenCalled();
  });

  it("fail-safe : une erreur DB (findUnique) ne bloque pas le boot", async () => {
    mockBlogArticleFindUnique.mockRejectedValue(new Error("connection refused"));

    await expect(fixPublishedBlogArticlesTask()).resolves.toBeUndefined();
  });

  it("applique le tutoiement à la FAQ comment-devenir-drole (T05)", async () => {
    // Simule un article qui contient encore le vouvoiement.
    mockBlogArticleFindUnique.mockImplementation(
      async ({ where }: { where: { slug: string } }) => {
        if (where.slug === "comment-devenir-drole") {
          return {
            id: "cuid-cdd",
            content: "Commencez par observer les absurdités. Mémorisez 5 vannes. Pratiquez chaque jour.",
          };
        }
        return null;
      },
    );

    await fixPublishedBlogArticlesTask();

    expect(mockBlogArticleUpdate).toHaveBeenCalled();
    const finalContent = (mockBlogArticleUpdate.mock.calls[0][0] as {
      data: { content: string };
    }).data.content;
    expect(finalContent).toContain("Commence par");
    expect(finalContent).toMatch(/[Mm]émorise\b/);
    expect(finalContent).toContain("Pratique");
    expect(finalContent).not.toContain("Commencez par");
    expect(finalContent).not.toContain("Mémorisez");
  });

  it("anonymise les témoignages Lucas/Marine/Thomas dans ne-plus-rester-muet (T04)", async () => {
    mockBlogArticleFindUnique.mockImplementation(
      async ({ where }: { where: { slug: string } }) => {
        if (where.slug === "ne-plus-rester-muet-en-groupe") {
          return {
            id: "cuid-nprm",
            content:
              "Prenons Lucas, 21 ans, étudiant en école de commerce. Ou Marine, 28 ans, chargée de communication. Ou encore Thomas, 35 ans, en reconstruction après séparation.",
          };
        }
        return null;
      },
    );

    await fixPublishedBlogArticlesTask();

    const finalContent = (mockBlogArticleUpdate.mock.calls[0][0] as {
      data: { content: string };
    }).data.content;
    expect(finalContent).not.toMatch(/Lucas, 21 ans/);
    expect(finalContent).not.toMatch(/Marine, 28 ans/);
    expect(finalContent).not.toMatch(/Thomas, 35 ans/);
    expect(finalContent).toContain("un étudiant en école de commerce");
  });
});

describe("depublishCannibalizedDbArticlesTask (s11 lot 3)", () => {
  it("dépublie les 3 DB losers (isPublished false, WHERE isPublished true)", async () => {
    mockBlogArticleUpdateMany.mockResolvedValue({ count: 3 });

    await depublishCannibalizedDbArticlesTask();

    expect(mockBlogArticleUpdateMany).toHaveBeenCalledTimes(1);
    const call = mockBlogArticleUpdateMany.mock.calls[0][0] as {
      where: { slug: { in: string[] }; isPublished: boolean };
      data: { isPublished: boolean; updatedAt: Date };
    };
    expect(call.where.isPublished).toBe(true);
    expect(call.where.slug.in).toEqual(Array.from(DB_LOSER_SLUGS));
    expect(call.data.isPublished).toBe(false);
    expect(call.data.updatedAt).toBeInstanceOf(Date);
  });

  it("idempotent : 2e passe = 0 update car WHERE isPublished:true ne matche plus", async () => {
    mockBlogArticleUpdateMany.mockResolvedValueOnce({ count: 3 });
    mockBlogArticleUpdateMany.mockResolvedValueOnce({ count: 0 });

    await depublishCannibalizedDbArticlesTask();
    await depublishCannibalizedDbArticlesTask();

    expect(mockBlogArticleUpdateMany).toHaveBeenCalledTimes(2);
  });

  it("fail-safe : erreur DB non bloquante", async () => {
    mockBlogArticleUpdateMany.mockRejectedValue(new Error("connection refused"));
    await expect(depublishCannibalizedDbArticlesTask()).resolves.toBeUndefined();
  });
});

describe("backfillMissingJokeDecryptagesTask (s11 lot 3)", () => {
  // s14 : le backfill IA ne tourne que si l'interrupteur de génération est ouvert.
  beforeEach(() => {
    process.env.CONTENT_GENERATION_ENABLED = "true";
  });
  afterEach(() => {
    delete process.env.CONTENT_GENERATION_ENABLED;
  });

  it("interrupteur CONTENT_GENERATION_ENABLED coupé (s14) → aucune requête, aucun appel IA", async () => {
    delete process.env.CONTENT_GENERATION_ENABLED;
    await backfillMissingJokeDecryptagesTask();
    expect(mockJokeFindMany).not.toHaveBeenCalled();
    expect(mockGenerateJokeDecryptage).not.toHaveBeenCalled();
  });

  it("cible uniquement les vannes actives sans décryptage, batch borné", async () => {
    mockJokeFindMany.mockResolvedValue([
      { id: "cuid-1", content: "Vanne 1", punchline: "Chute 1", category: "ABSURDE", type: "SITUATION" },
    ]);

    await backfillMissingJokeDecryptagesTask();

    expect(mockJokeFindMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { comedyTechnique: null, isActive: true },
        take: expect.any(Number),
      }),
    );
    expect(mockGenerateJokeDecryptage).toHaveBeenCalledTimes(1);
    expect(mockJokeUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: "cuid-1" },
        data: expect.objectContaining({
          comedyTechnique: "Test technique",
          techniqueExplanation: "Explication test",
          howToApply: "Application test",
        }),
      }),
    );
  });

  it("désactivable via env flag (skip complet)", async () => {
    const prev = process.env.SKIP_JOKE_DECRYPTAGE_AI_BACKFILL;
    process.env.SKIP_JOKE_DECRYPTAGE_AI_BACKFILL = "1";
    try {
      await backfillMissingJokeDecryptagesTask();
      expect(mockJokeFindMany).not.toHaveBeenCalled();
      expect(mockGenerateJokeDecryptage).not.toHaveBeenCalled();
    } finally {
      process.env.SKIP_JOKE_DECRYPTAGE_AI_BACKFILL = prev;
    }
  });

  it("fail-safe : échec IA sur une vanne ne bloque pas les suivantes", async () => {
    mockJokeFindMany.mockResolvedValue([
      { id: "cuid-1", content: "V1", punchline: "C1", category: "ABSURDE", type: "SITUATION" },
      { id: "cuid-2", content: "V2", punchline: "C2", category: "ABSURDE", type: "SITUATION" },
    ]);
    mockGenerateJokeDecryptage
      .mockRejectedValueOnce(new Error("Anthropic 500"))
      .mockResolvedValueOnce({
        comedyTechnique: "T2",
        techniqueExplanation: "E2",
        howToApply: "A2",
      });

    await backfillMissingJokeDecryptagesTask();

    // 1 seul update (l'échec IA a skip la vanne 1).
    expect(mockJokeUpdate).toHaveBeenCalledTimes(1);
    expect(mockJokeUpdate).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: "cuid-2" } }),
    );
  });

  it("no-op si aucune vanne pending (0 findMany result)", async () => {
    mockJokeFindMany.mockResolvedValue([]);

    await backfillMissingJokeDecryptagesTask();

    expect(mockGenerateJokeDecryptage).not.toHaveBeenCalled();
    expect(mockJokeUpdate).not.toHaveBeenCalled();
  });
});


describe("rewriteRedirectedBlogLinksTask (s11)", () => {
  it("réécrit les liens relatifs et absolus vers la destination finale", async () => {
    mockBlogArticleFindMany.mockResolvedValue([
      {
        id: "a1",
        slug: "article-x",
        content:
          "Voir [ce guide](/blog/timing-humour-ralentir) et [celui-ci](https://deviens-marrant.fr/blog/blagues-courtes-vs-longues#intro).",
      },
    ]);

    await rewriteRedirectedBlogLinksTask();

    expect(mockBlogArticleUpdate).toHaveBeenCalledTimes(1);
    const call = mockBlogArticleUpdate.mock.calls[0][0] as {
      where: { id: string };
      data: { content: string; updatedAt: Date };
    };
    expect(call.where.id).toBe("a1");
    expect(call.data.content).toBe(
      "Voir [ce guide](/blog/timing-humour) et [celui-ci](https://deviens-marrant.fr/blog/blague-courte-arme-secrete-humour#intro).",
    );
    expect(call.data.updatedAt).toBeInstanceOf(Date);
  });

  it("ne touche pas un slug plus long qui commence pareil", async () => {
    mockBlogArticleFindMany.mockResolvedValue([
      { id: "a2", slug: "y", content: "[lien](/blog/timing-humour-ralentir-encore-plus)" },
    ]);
    await rewriteRedirectedBlogLinksTask();
    expect(mockBlogArticleUpdate).not.toHaveBeenCalled();
  });

  it("idempotent : aucun lien redirigé → aucune écriture", async () => {
    mockBlogArticleFindMany.mockResolvedValue([
      { id: "a3", slug: "z", content: "[ok](/blog/timing-humour)" },
    ]);
    await rewriteRedirectedBlogLinksTask();
    expect(mockBlogArticleUpdate).not.toHaveBeenCalled();
  });

  it("fail-safe : une erreur DB ne remonte pas", async () => {
    mockBlogArticleFindMany.mockRejectedValue(new Error("DB down"));
    await expect(rewriteRedirectedBlogLinksTask()).resolves.toBeUndefined();
  });
});
