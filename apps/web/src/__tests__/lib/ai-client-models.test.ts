/**
 * Tests de la couche modèle de `lib/ai/client.ts` (migration s11 vers
 * Claude Sonnet 5.5 / Opus 5.5) : lecture du texte par type de bloc,
 * effort explicite, marge de réflexion, gestion des refus.
 */

jest.mock("@anthropic-ai/sdk", () => {
  return jest.fn().mockImplementation(() => ({
    messages: { create: jest.fn() },
  }));
});

jest.mock("@/lib/prisma", () => ({
  prisma: {
    llmUsageLog: { create: jest.fn().mockResolvedValue({}) },
  },
}));

const ORIGINAL_ENV = { ...process.env };

async function loadClient() {
  jest.resetModules();
  const Anthropic = (await import("@anthropic-ai/sdk")).default as unknown as jest.Mock;
  const create = jest.fn();
  Anthropic.mockImplementation(() => ({ messages: { create } }));
  const mod = await import("@/lib/ai/client");
  return { ...mod, create };
}

afterEach(() => {
  process.env = { ...ORIGINAL_ENV };
});

describe("lib/ai/client — modèles par défaut", () => {
  it("Sonnet 5.5 et Opus 5.5 par défaut, effort low", async () => {
    delete process.env.ANTHROPIC_SONNET_MODEL;
    delete process.env.ANTHROPIC_OPUS_MODEL;
    delete process.env.ANTHROPIC_EFFORT;
    const { SONNET_MODEL, OPUS_MODEL, DEFAULT_EFFORT } = await loadClient();
    expect(SONNET_MODEL).toBe("claude-sonnet-5-5");
    expect(OPUS_MODEL).toBe("claude-opus-5-5");
    expect(DEFAULT_EFFORT).toBe("low");
  });

  it("surcharges par variables d'environnement", async () => {
    process.env.ANTHROPIC_SONNET_MODEL = "claude-sonnet-x";
    process.env.ANTHROPIC_EFFORT = "medium";
    const { SONNET_MODEL, DEFAULT_EFFORT } = await loadClient();
    expect(SONNET_MODEL).toBe("claude-sonnet-x");
    expect(DEFAULT_EFFORT).toBe("medium");
  });

  it("effort invalide en env → retombe sur low", async () => {
    process.env.ANTHROPIC_EFFORT = "turbo";
    const { DEFAULT_EFFORT } = await loadClient();
    expect(DEFAULT_EFFORT).toBe("low");
  });
});

describe("applyModelDefaults", () => {
  it("ajoute la marge de réflexion et l'effort par défaut", async () => {
    const { applyModelDefaults, THINKING_HEADROOM_TOKENS } = await loadClient();
    const out = applyModelDefaults({
      model: "claude-sonnet-5-5",
      max_tokens: 500,
      messages: [{ role: "user", content: "x" }],
    });
    expect(out.max_tokens).toBe(500 + THINKING_HEADROOM_TOKENS);
    expect(out.output_config?.effort).toBe("low");
  });

  it("n'écrase jamais un effort fourni par l'appelant", async () => {
    const { applyModelDefaults } = await loadClient();
    const out = applyModelDefaults({
      model: "claude-opus-5-5",
      max_tokens: 2000,
      output_config: { effort: "medium" },
      messages: [{ role: "user", content: "x" }],
    });
    expect(out.output_config?.effort).toBe("medium");
  });
});

describe("getResponseText", () => {
  it("ignore les blocs thinking et concatène les blocs texte", async () => {
    const { getResponseText } = await loadClient();
    const text = getResponseText({
      content: [
        { type: "thinking", thinking: "", signature: "sig" },
        { type: "text", text: '{"a":' },
        { type: "text", text: "1}" },
      ],
    } as never);
    expect(text).toBe('{"a":1}');
  });

  it("réponse vide → chaîne vide", async () => {
    const { getResponseText } = await loadClient();
    expect(getResponseText({ content: [] } as never)).toBe("");
  });
});

describe("callWithRetry — refus du modèle", () => {
  it("stop_reason refusal → LlmRefusalError, sans nouvel essai", async () => {
    const { callWithRetry, LlmRefusalError, create } = await loadClient();
    create.mockResolvedValue({
      content: [],
      stop_reason: "refusal",
      stop_details: { type: "refusal", category: "general_harms", explanation: null },
      usage: { input_tokens: 10, output_tokens: 0 },
    });

    await expect(
      callWithRetry(
        { model: "claude-sonnet-5-5", max_tokens: 100, messages: [{ role: "user", content: "x" }] },
        2,
        { agent: "test", fn: "refusal" },
      ),
    ).rejects.toBeInstanceOf(LlmRefusalError);
    expect(create).toHaveBeenCalledTimes(1);
  });

  it("réponse normale → renvoyée telle quelle, requête enrichie", async () => {
    const { callWithRetry, create } = await loadClient();
    const response = {
      content: [{ type: "text", text: "ok" }],
      stop_reason: "end_turn",
      usage: { input_tokens: 1, output_tokens: 1 },
    };
    create.mockResolvedValue(response);

    const out = await callWithRetry({
      model: "claude-sonnet-5-5",
      max_tokens: 100,
      messages: [{ role: "user", content: "x" }],
    });

    expect(out).toBe(response);
    expect(create.mock.calls[0][0].output_config.effort).toBe("low");
  });
});

export {};
