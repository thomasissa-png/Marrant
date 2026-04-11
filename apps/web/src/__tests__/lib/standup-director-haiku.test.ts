/**
 * Tests du feature flag ENABLE_HAIKU_VALIDATION sur les validations Director.
 *
 * Objectif : garantir que le chemin dual-pass (Haiku puis fallback Sonnet)
 * fait exactement ce qu'on attend :
 *
 *   ENABLE_HAIKU_VALIDATION=false (default) → 1 appel Sonnet uniquement
 *   ENABLE_HAIKU_VALIDATION=true  →
 *     - score Haiku >= 8  → 1 appel Haiku uniquement (APPROVED net)
 *     - score Haiku < 5   → 1 appel Haiku uniquement (REJECTED net)
 *     - score Haiku 5-7   → 1 appel Haiku puis 1 appel Sonnet (borderline)
 *
 * Ces tests protègent contre toute régression silencieuse :
 *   - Un PR qui casse le dual-pass ferait doubler les coûts à l'activation
 *   - Un PR qui inverse le feature flag activerait Haiku en prod par erreur
 */

// Mock the Anthropic SDK — même pattern que ai-agents.test.ts
jest.mock("@anthropic-ai/sdk", () => {
  return jest.fn().mockImplementation(() => ({
    messages: { create: jest.fn() },
  }));
});

// Mock prisma (llmUsageLog silent-fail dans callWithRetry)
jest.mock("@/lib/prisma", () => ({
  prisma: {
    llmUsageLog: { create: jest.fn().mockResolvedValue({}) },
  },
}));

const ORIGINAL_ENV = { ...process.env };

type MockMessage = { content: [{ type: "text"; text: string }] };

function makeJsonResponse(body: object): MockMessage {
  return {
    content: [{ type: "text", text: JSON.stringify(body) }],
  };
}

async function setupDirectorWithFlag(
  flag: "true" | "false" | undefined,
): Promise<{
  validateJoke: typeof import("@/lib/ai/agents/standup-director-agent").validateJoke;
  validateBlogArticle: typeof import("@/lib/ai/agents/standup-director-agent").validateBlogArticle;
  mockAnthropicCreate: jest.Mock;
}> {
  jest.resetModules();
  if (flag === undefined) {
    delete process.env.ENABLE_HAIKU_VALIDATION;
  } else {
    process.env.ENABLE_HAIKU_VALIDATION = flag;
  }

  const Anthropic = (await import("@anthropic-ai/sdk")).default as jest.Mock;
  const mockAnthropicCreate = jest.fn();
  Anthropic.mockImplementation(() => ({
    messages: { create: mockAnthropicCreate },
  }));

  const mod = await import("@/lib/ai/agents/standup-director-agent");
  return {
    validateJoke: mod.validateJoke,
    validateBlogArticle: mod.validateBlogArticle,
    mockAnthropicCreate,
  };
}

// Vanne qui passe tous les gates programmatiques (G-J1 à G-J8) : punchline
// courte, twist net, pas de constat, pas d'objet qui parle, pas de persona leak.
const VALID_JOKE = {
  content: "J'ai dit à mon pote que j'arrivais dans 5 minutes.",
  punchline: "J'étais encore en pyjama.",
  category: "SITUATION",
  type: "ONE_LINER" as const,
  maturityLevel: 1,
};

// Article qui passe tous les gates blog : min 1500 mots, 8 liens internes,
// 3 H2, FAQ, 3 listes numérotées, 1 blockquote CLEF, mot-clé dans intro.
// Reproduit le pattern du test ai-agents.test.ts ligne ~1247.
const VALID_ARTICLE_CONTENT =
  "Comment avoir de la répartie ? C'est la question que tout le monde se pose. " +
  "Découvre les techniques des pros du stand-up pour ne plus jamais rester muet. " +
  "/vannes /conseils /videos /parcours /blog/timing-humour /abonnement /a-propos /glossaire " +
  "\n\n## Comment développer ta répartie au quotidien ?\n\n" +
  "1. Observe les situations drôles autour de toi\n2. Note les répliques qui te font rire\n3. Entraîne-toi à reformuler\n\n" +
  "> **CLEF :** La répartie n'est pas un talent inné — c'est un muscle qui se travaille chaque jour.\n\n" +
  "## Quelles techniques utilisent les humoristes ?\n\n" +
  "1. Le pivot — changer de direction au dernier moment\n2. L'exagération — pousser le curseur à fond\n3. Le callback — rappeler un élément précédent\n\n" +
  "## Pourquoi la plupart des gens n'osent pas répondre ?\n\n" +
  "1. La peur du jugement\n2. Le manque de pratique\n3. L'absence de modèles\n\n" +
  "## FAQ - Questions fréquentes\n\n### Comment progresser en répartie ?\nEn pratiquant chaque jour. " +
  Array(200).fill("Contenu pertinent sur la répartie et l'humour au quotidien avec des exemples concrets.").join(" ");

const VALID_ARTICLE = {
  title: "Répartie : 7 techniques de stand-upper",
  slug: "comment-avoir-de-la-repartie",
  excerpt: "Tu restes muet quand on te chambre ? Voici les techniques des pros.",
  content: VALID_ARTICLE_CONTENT,
  category: "REPARTIE",
  targetKeyword: "répartie",
};

afterEach(() => {
  // Restaurer l'env vierge entre chaque test pour garantir l'isolation
  process.env = { ...ORIGINAL_ENV };
});

describe("Stand-Up Director — feature flag ENABLE_HAIKU_VALIDATION", () => {
  describe("validateJoke", () => {
    it("flag OFF (default) → 1 appel Sonnet uniquement", async () => {
      const { validateJoke, mockAnthropicCreate } = await setupDirectorWithFlag(
        undefined,
      );
      mockAnthropicCreate.mockResolvedValue(
        makeJsonResponse({
          verdict: "APPROVED",
          score: 9,
          strengths: ["Twist net"],
          issues: [],
          directorNote: "OK",
        }),
      );

      const result = await validateJoke(VALID_JOKE, "SOPHIE");

      expect(result.verdict).toBe("APPROVED");
      expect(mockAnthropicCreate).toHaveBeenCalledTimes(1);
      expect(mockAnthropicCreate.mock.calls[0][0].model).toBe(
        "claude-sonnet-4-20250514",
      );
    });

    it("flag OFF explicite (false) → 1 appel Sonnet uniquement", async () => {
      const { validateJoke, mockAnthropicCreate } = await setupDirectorWithFlag(
        "false",
      );
      mockAnthropicCreate.mockResolvedValue(
        makeJsonResponse({
          verdict: "APPROVED",
          score: 9,
          strengths: ["OK"],
          issues: [],
          directorNote: "OK",
        }),
      );

      await validateJoke(VALID_JOKE, "SOPHIE");

      expect(mockAnthropicCreate).toHaveBeenCalledTimes(1);
      expect(mockAnthropicCreate.mock.calls[0][0].model).toBe(
        "claude-sonnet-4-20250514",
      );
    });

    it("flag ON, score Haiku = 9 (APPROVED net) → 1 appel Haiku uniquement", async () => {
      const { validateJoke, mockAnthropicCreate } = await setupDirectorWithFlag(
        "true",
      );
      mockAnthropicCreate.mockResolvedValue(
        makeJsonResponse({
          verdict: "APPROVED",
          score: 9,
          strengths: ["OK"],
          issues: [],
          directorNote: "OK",
        }),
      );

      const result = await validateJoke(VALID_JOKE, "SOPHIE");

      expect(result.verdict).toBe("APPROVED");
      expect(result.score).toBe(9);
      expect(mockAnthropicCreate).toHaveBeenCalledTimes(1);
      expect(mockAnthropicCreate.mock.calls[0][0].model).toBe(
        "claude-haiku-4-5-20251001",
      );
    });

    it("flag ON, score Haiku = 4 (REJECTED net) → 1 appel Haiku uniquement", async () => {
      const { validateJoke, mockAnthropicCreate } = await setupDirectorWithFlag(
        "true",
      );
      mockAnthropicCreate.mockResolvedValue(
        makeJsonResponse({
          verdict: "REJECTED",
          score: 4,
          strengths: [],
          issues: ["Pas de twist", "Plate"],
          directorNote: "Recommencer.",
        }),
      );

      const result = await validateJoke(VALID_JOKE, "SOPHIE");

      expect(result.verdict).toBe("REJECTED");
      expect(mockAnthropicCreate).toHaveBeenCalledTimes(1);
      expect(mockAnthropicCreate.mock.calls[0][0].model).toBe(
        "claude-haiku-4-5-20251001",
      );
    });

    it("flag ON, score Haiku = 6 (borderline) → 1 appel Haiku PUIS 1 appel Sonnet", async () => {
      const { validateJoke, mockAnthropicCreate } = await setupDirectorWithFlag(
        "true",
      );
      // Pass 1 — Haiku retourne 6 (borderline)
      mockAnthropicCreate.mockResolvedValueOnce(
        makeJsonResponse({
          verdict: "NEEDS_REVISION",
          score: 6,
          strengths: ["Idée"],
          issues: ["Punchline molle"],
          directorNote: "Borderline.",
        }),
      );
      // Pass 2 — Sonnet tranche
      mockAnthropicCreate.mockResolvedValueOnce(
        makeJsonResponse({
          verdict: "APPROVED",
          score: 9,
          strengths: ["Twist net après relecture"],
          issues: [],
          directorNote: "Finalement OK.",
        }),
      );

      const result = await validateJoke(VALID_JOKE, "SOPHIE");

      expect(result.verdict).toBe("APPROVED");
      expect(result.score).toBe(9);
      expect(mockAnthropicCreate).toHaveBeenCalledTimes(2);
      expect(mockAnthropicCreate.mock.calls[0][0].model).toBe(
        "claude-haiku-4-5-20251001",
      );
      expect(mockAnthropicCreate.mock.calls[1][0].model).toBe(
        "claude-sonnet-4-20250514",
      );
    });

    it("flag ON, score Haiku = 5 (borne basse borderline) → Haiku PUIS Sonnet", async () => {
      const { validateJoke, mockAnthropicCreate } = await setupDirectorWithFlag(
        "true",
      );
      mockAnthropicCreate.mockResolvedValueOnce(
        makeJsonResponse({
          verdict: "REJECTED",
          score: 5,
          strengths: [],
          issues: ["Limite"],
          directorNote: "5 pile.",
        }),
      );
      mockAnthropicCreate.mockResolvedValueOnce(
        makeJsonResponse({
          verdict: "REJECTED",
          score: 4,
          strengths: [],
          issues: ["Confirmé faible"],
          directorNote: "Sonnet tranche.",
        }),
      );

      await validateJoke(VALID_JOKE, "SOPHIE");

      expect(mockAnthropicCreate).toHaveBeenCalledTimes(2);
    });

    it("flag ON, score Haiku = 7 (borne haute borderline) → Haiku PUIS Sonnet", async () => {
      const { validateJoke, mockAnthropicCreate } = await setupDirectorWithFlag(
        "true",
      );
      mockAnthropicCreate.mockResolvedValueOnce(
        makeJsonResponse({
          verdict: "NEEDS_REVISION",
          score: 7,
          strengths: ["Potentiel"],
          issues: ["Manque de twist"],
          directorNote: "Limite haute.",
        }),
      );
      mockAnthropicCreate.mockResolvedValueOnce(
        makeJsonResponse({
          verdict: "APPROVED",
          score: 9,
          strengths: ["OK"],
          issues: [],
          directorNote: "Sonnet tranche.",
        }),
      );

      await validateJoke(VALID_JOKE, "SOPHIE");

      expect(mockAnthropicCreate).toHaveBeenCalledTimes(2);
    });

    it("flag ON, score Haiku = 8 (juste au-dessus de borderline) → 1 appel Haiku uniquement", async () => {
      const { validateJoke, mockAnthropicCreate } = await setupDirectorWithFlag(
        "true",
      );
      mockAnthropicCreate.mockResolvedValue(
        makeJsonResponse({
          verdict: "NEEDS_REVISION",
          score: 8,
          strengths: ["OK"],
          issues: [],
          directorNote: "Presque APPROVED.",
        }),
      );

      await validateJoke(VALID_JOKE, "SOPHIE");

      // 8 est >= 8 donc pas de re-run Sonnet
      expect(mockAnthropicCreate).toHaveBeenCalledTimes(1);
      expect(mockAnthropicCreate.mock.calls[0][0].model).toBe(
        "claude-haiku-4-5-20251001",
      );
    });
  });

  describe("validateBlogArticle", () => {
    it("flag OFF (default) → 1 appel Sonnet uniquement", async () => {
      const { validateBlogArticle, mockAnthropicCreate } =
        await setupDirectorWithFlag(undefined);
      mockAnthropicCreate.mockResolvedValue(
        makeJsonResponse({
          verdict: "APPROVED",
          score: 9,
          strengths: ["Drôle et SEO"],
          issues: [],
          directorNote: "OK.",
        }),
      );

      const result = await validateBlogArticle(VALID_ARTICLE);

      expect(result.verdict).toBe("APPROVED");
      expect(mockAnthropicCreate).toHaveBeenCalledTimes(1);
      expect(mockAnthropicCreate.mock.calls[0][0].model).toBe(
        "claude-sonnet-4-20250514",
      );
    });

    it("flag ON, score Haiku = 6 (borderline) → Haiku PUIS Sonnet", async () => {
      const { validateBlogArticle, mockAnthropicCreate } =
        await setupDirectorWithFlag("true");
      mockAnthropicCreate.mockResolvedValueOnce(
        makeJsonResponse({
          verdict: "NEEDS_REVISION",
          score: 6,
          strengths: ["Fond OK"],
          issues: ["Manque d'humour"],
          directorNote: "Borderline.",
        }),
      );
      mockAnthropicCreate.mockResolvedValueOnce(
        makeJsonResponse({
          verdict: "APPROVED",
          score: 9,
          strengths: ["Validé après relecture"],
          issues: [],
          directorNote: "Sonnet tranche.",
        }),
      );

      const result = await validateBlogArticle(VALID_ARTICLE);

      expect(result.verdict).toBe("APPROVED");
      expect(mockAnthropicCreate).toHaveBeenCalledTimes(2);
      expect(mockAnthropicCreate.mock.calls[0][0].model).toBe(
        "claude-haiku-4-5-20251001",
      );
      expect(mockAnthropicCreate.mock.calls[1][0].model).toBe(
        "claude-sonnet-4-20250514",
      );
    });
  });
});
