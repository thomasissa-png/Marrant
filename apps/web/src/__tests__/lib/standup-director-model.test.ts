/**
 * Tests du modèle utilisé par les validations Director (s11).
 *
 * La double passe Haiku 4.5 → Sonnet (flag ENABLE_HAIKU_VALIDATION) a été
 * supprimée : une seule passe Sonnet 5.5, même si l'ancien flag traîne encore
 * dans l'environnement. Ces tests protègent aussi les ajustements propres aux
 * modèles actuels appliqués par `callWithRetry` (effort explicite, marge de
 * réflexion dans max_tokens, lecture du texte par type de bloc).
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

type MockMessage = { content: Array<{ type: string; text?: string; thinking?: string }> };

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

  const Anthropic = (await import("@anthropic-ai/sdk")).default as unknown as jest.Mock;
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

const APPROVED_JOKE = {
  verdict: "APPROVED",
  score: 9,
  strengths: ["Twist net"],
  issues: [],
  directorNote: "OK",
};

const BORDERLINE_JOKE = {
  verdict: "NEEDS_REVISION",
  score: 6,
  strengths: ["Idée OK"],
  issues: ["Chute molle"],
  directorNote: "Borderline.",
};

describe("Stand-Up Director — modèle de validation (Sonnet 5.5, plus de Haiku)", () => {
  describe("validateJoke", () => {
    it("1 seul appel, sur claude-sonnet-5-5", async () => {
      const { validateJoke, mockAnthropicCreate } = await setupDirectorWithFlag(undefined);
      mockAnthropicCreate.mockResolvedValue(makeJsonResponse(APPROVED_JOKE));

      const result = await validateJoke(VALID_JOKE, "SOPHIE");

      expect(result.verdict).toBe("APPROVED");
      expect(mockAnthropicCreate).toHaveBeenCalledTimes(1);
      expect(mockAnthropicCreate.mock.calls[0][0].model).toBe("claude-sonnet-5-5");
    });

    it("ancien flag ENABLE_HAIKU_VALIDATION=true ignoré : 1 seul appel Sonnet, même sur score borderline", async () => {
      const { validateJoke, mockAnthropicCreate } = await setupDirectorWithFlag("true");
      mockAnthropicCreate.mockResolvedValue(makeJsonResponse(BORDERLINE_JOKE));

      await validateJoke(VALID_JOKE, "SOPHIE");

      expect(mockAnthropicCreate).toHaveBeenCalledTimes(1);
      expect(mockAnthropicCreate.mock.calls[0][0].model).toBe("claude-sonnet-5-5");
      expect(
        mockAnthropicCreate.mock.calls.some(([params]) => String(params.model).includes("haiku")),
      ).toBe(false);
    });

    it("envoie un effort explicite et une marge de réflexion dans max_tokens", async () => {
      const { validateJoke, mockAnthropicCreate } = await setupDirectorWithFlag(undefined);
      mockAnthropicCreate.mockResolvedValue(makeJsonResponse(APPROVED_JOKE));

      await validateJoke(VALID_JOKE, "SOPHIE");

      const params = mockAnthropicCreate.mock.calls[0][0];
      expect(params.output_config.effort).toBe("low");
      expect(params.max_tokens).toBeGreaterThan(4000);
      expect(params.thinking).toBeUndefined();
      expect(params.temperature).toBeUndefined();
    });

    it("lit le verdict quand la réponse commence par un bloc thinking", async () => {
      const { validateJoke, mockAnthropicCreate } = await setupDirectorWithFlag(undefined);
      mockAnthropicCreate.mockResolvedValue({
        content: [
          { type: "thinking", thinking: "" },
          { type: "text", text: JSON.stringify(APPROVED_JOKE) },
        ],
      });

      const result = await validateJoke(VALID_JOKE, "SOPHIE");

      expect(result.verdict).toBe("APPROVED");
      expect(result.score).toBe(9);
    });
  });

  describe("validateBlogArticle", () => {
    it("1 seul appel, sur claude-sonnet-5-5 (flag legacy ignoré)", async () => {
      const { validateBlogArticle, mockAnthropicCreate } = await setupDirectorWithFlag("true");
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
      expect(mockAnthropicCreate.mock.calls[0][0].model).toBe("claude-sonnet-5-5");
    });
  });
});

export {};
