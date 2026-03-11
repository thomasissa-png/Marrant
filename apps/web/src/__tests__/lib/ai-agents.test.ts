import { getPersonaForDay, PERSONAS } from "@/lib/ai/personas";
import { validateMonthlyPlan } from "@/lib/ai/plan-validator";

// Mock the Anthropic SDK
jest.mock("@anthropic-ai/sdk", () => {
  return jest.fn().mockImplementation(() => ({
    messages: {
      create: jest.fn(),
    },
  }));
});

// Mock prisma
jest.mock("@/lib/prisma", () => ({
  prisma: {
    contentPlan: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    contentPlanEntry: {
      update: jest.fn(),
    },
    joke: {
      findMany: jest.fn().mockResolvedValue([]),
      create: jest.fn(),
      count: jest.fn().mockResolvedValue(10),
      findFirst: jest.fn(),
    },
    tip: {
      findMany: jest.fn().mockResolvedValue([]),
      create: jest.fn(),
      count: jest.fn().mockResolvedValue(10),
      findFirst: jest.fn(),
    },
    video: {
      findMany: jest.fn().mockResolvedValue([]),
      count: jest.fn().mockResolvedValue(5),
      findFirst: jest.fn(),
    },
    dailyContent: {
      findUnique: jest.fn().mockResolvedValue(null),
      findMany: jest.fn().mockResolvedValue([]),
      create: jest.fn(),
    },
  },
}));

describe("Personas", () => {
  it("has 3 personas defined", () => {
    expect(Object.keys(PERSONAS)).toHaveLength(3);
    expect(PERSONAS.YANIS).toBeDefined();
    expect(PERSONAS.SOPHIE).toBeDefined();
    expect(PERSONAS.MARC).toBeDefined();
  });

  it("each persona has required fields", () => {
    for (const persona of Object.values(PERSONAS)) {
      expect(persona.name).toBeTruthy();
      expect(persona.age).toBeGreaterThan(0);
      expect(persona.description).toBeTruthy();
      expect(persona.interests.length).toBeGreaterThan(0);
      expect(persona.tone).toBeTruthy();
      expect(persona.jokeCategories.length).toBeGreaterThan(0);
      expect(persona.tipCategories.length).toBeGreaterThan(0);
      expect(persona.tipDifficulty).toBeTruthy();
    }
  });

  it("rotates personas correctly over days", () => {
    expect(getPersonaForDay(1)).toBe("YANIS");
    expect(getPersonaForDay(2)).toBe("SOPHIE");
    expect(getPersonaForDay(3)).toBe("MARC");
    expect(getPersonaForDay(4)).toBe("YANIS");
    expect(getPersonaForDay(5)).toBe("SOPHIE");
    expect(getPersonaForDay(6)).toBe("MARC");
  });

  it("handles day 31 correctly", () => {
    expect(getPersonaForDay(31)).toBe("YANIS");
  });

  it("Yanis has youth-oriented categories", () => {
    expect(PERSONAS.YANIS.jokeCategories).toContain("ECOLE");
    expect(PERSONAS.YANIS.jokeCategories).toContain("GAMING");
    expect(PERSONAS.YANIS.jokeCategories).toContain("RESEAUX_SOCIAUX");
    expect(PERSONAS.YANIS.tipDifficulty).toBe("DEBUTANT");
  });

  it("Sophie has work-oriented categories", () => {
    expect(PERSONAS.SOPHIE.jokeCategories).toContain("BOULOT");
    expect(PERSONAS.SOPHIE.jokeCategories).toContain("SITUATION");
    expect(PERSONAS.SOPHIE.tipDifficulty).toBe("INTERMEDIAIRE");
  });

  it("Marc has reconstruction-oriented categories", () => {
    expect(PERSONAS.MARC.jokeCategories).toContain("COUPLE");
    expect(PERSONAS.MARC.jokeCategories).toContain("PARENTS");
    expect(PERSONAS.MARC.tipDifficulty).toBe("INTERMEDIAIRE");
  });
});

describe("Plan Validator", () => {
  const validCategories = ["TIMING", "AUTODERISION", "OBSERVATION", "REPARTIE"];

  it("returns all days even if AI returns fewer entries", () => {
    const raw = [
      { dayOfMonth: 1, category: "TIMING", theme: "Sujet 1", targetPersona: "YANIS" },
      { dayOfMonth: 3, category: "OBSERVATION", theme: "Sujet 3", targetPersona: "MARC" },
    ];

    const result = validateMonthlyPlan(raw, 5, validCategories, getPersonaForDay);
    expect(result).toHaveLength(5);
    expect(result[0].category).toBe("TIMING");
    expect(result[1].theme).toBe("Contenu du jour 2"); // filled default
    expect(result[2].category).toBe("OBSERVATION");
  });

  it("corrects invalid categories", () => {
    const raw = [
      { dayOfMonth: 1, category: "INVALIDE", theme: "Test", targetPersona: "YANIS" },
    ];

    const result = validateMonthlyPlan(raw, 1, validCategories, getPersonaForDay);
    expect(validCategories).toContain(result[0].category);
  });

  it("corrects invalid personas", () => {
    const raw = [
      { dayOfMonth: 1, category: "TIMING", theme: "Test", targetPersona: "INCONNU" },
    ];

    const result = validateMonthlyPlan(raw, 1, validCategories, getPersonaForDay);
    expect(result[0].targetPersona).toBe("YANIS"); // day 1 = YANIS
  });

  it("handles empty AI response", () => {
    const result = validateMonthlyPlan([], 28, validCategories, getPersonaForDay);
    expect(result).toHaveLength(28);
    result.forEach((entry, i) => {
      expect(entry.dayOfMonth).toBe(i + 1);
      expect(entry.theme).toBeTruthy();
      expect(validCategories).toContain(entry.category);
    });
  });

  it("handles duplicate dayOfMonth entries (keeps first)", () => {
    const raw = [
      { dayOfMonth: 1, category: "TIMING", theme: "Premier", targetPersona: "YANIS" },
      { dayOfMonth: 1, category: "OBSERVATION", theme: "Doublon", targetPersona: "SOPHIE" },
    ];

    const result = validateMonthlyPlan(raw, 1, validCategories, getPersonaForDay);
    expect(result[0].theme).toBe("Premier");
  });

  it("ignores out-of-range dayOfMonth", () => {
    const raw = [
      { dayOfMonth: 0, category: "TIMING", theme: "Invalid", targetPersona: "YANIS" },
      { dayOfMonth: 32, category: "TIMING", theme: "Invalid", targetPersona: "YANIS" },
      { dayOfMonth: 1, category: "TIMING", theme: "Valid", targetPersona: "YANIS" },
    ];

    const result = validateMonthlyPlan(raw, 3, validCategories, getPersonaForDay);
    expect(result[0].theme).toBe("Valid");
    expect(result[1].theme).toBe("Contenu du jour 2"); // default
  });

  it("fills empty theme with default", () => {
    const raw = [
      { dayOfMonth: 1, category: "TIMING", theme: "", targetPersona: "YANIS" },
    ];

    const result = validateMonthlyPlan(raw, 1, validCategories, getPersonaForDay);
    expect(result[0].theme).toBe("Contenu du jour 1");
  });
});

describe("Joke Agent", () => {
  let generateDailyJoke: typeof import("@/lib/ai/agents/joke-agent").generateDailyJoke;
  let mockAnthropicCreate: jest.Mock;

  beforeEach(async () => {
    jest.resetModules();
    const Anthropic = (await import("@anthropic-ai/sdk")).default as jest.Mock;
    mockAnthropicCreate = jest.fn();
    Anthropic.mockImplementation(() => ({
      messages: { create: mockAnthropicCreate },
    }));
    const mod = await import("@/lib/ai/agents/joke-agent");
    generateDailyJoke = mod.generateDailyJoke;
  });

  it("generates a joke with valid structure", async () => {
    mockAnthropicCreate.mockResolvedValue({
      content: [
        {
          type: "text",
          text: JSON.stringify({
            content: "Setup de la blague",
            punchline: "La chute",
            category: "BOULOT",
            type: "ONE_LINER",
            maturityLevel: 1,
          }),
        },
      ],
    });

    const joke = await generateDailyJoke({
      persona: "SOPHIE",
      plannedCategory: "BOULOT",
      plannedTheme: "La réunion du lundi",
      recentJokes: [],
      monthlyPlanSummary: "Plan test",
    });

    expect(joke.content).toBe("Setup de la blague");
    expect(joke.punchline).toBe("La chute");
    expect(joke.category).toBe("BOULOT");
    expect(joke.type).toBe("ONE_LINER");
    expect(joke.maturityLevel).toBe(1);
  });

  it("falls back to planned category on invalid category", async () => {
    mockAnthropicCreate.mockResolvedValue({
      content: [
        {
          type: "text",
          text: JSON.stringify({
            content: "Blague",
            punchline: "Chute",
            category: "INVALIDE",
            type: "CLASSIQUE",
            maturityLevel: 1,
          }),
        },
      ],
    });

    const joke = await generateDailyJoke({
      persona: "YANIS",
      plannedCategory: "ECOLE",
      plannedTheme: "Les devoirs",
      recentJokes: [],
      monthlyPlanSummary: "",
    });

    expect(joke.category).toBe("ECOLE");
  });

  it("throws on empty content", async () => {
    mockAnthropicCreate.mockResolvedValue({
      content: [
        {
          type: "text",
          text: JSON.stringify({
            content: "",
            punchline: "",
            category: "BOULOT",
            type: "CLASSIQUE",
            maturityLevel: 1,
          }),
        },
      ],
    });

    await expect(
      generateDailyJoke({
        persona: "SOPHIE",
        plannedCategory: "BOULOT",
        plannedTheme: "Test",
        recentJokes: [],
        monthlyPlanSummary: "",
      })
    ).rejects.toThrow("contenu ou punchline vide");
  });

  it("throws on invalid JSON response", async () => {
    mockAnthropicCreate.mockResolvedValue({
      content: [{ type: "text", text: "pas du json" }],
    });

    await expect(
      generateDailyJoke({
        persona: "MARC",
        plannedCategory: "COUPLE",
        plannedTheme: "Test",
        recentJokes: [],
        monthlyPlanSummary: "",
      })
    ).rejects.toThrow();
  });

  it("truncates excessively long content", async () => {
    mockAnthropicCreate.mockResolvedValue({
      content: [
        {
          type: "text",
          text: JSON.stringify({
            content: "A".repeat(2000),
            punchline: "B".repeat(1000),
            category: "BOULOT",
            type: "STORY",
            maturityLevel: 1,
          }),
        },
      ],
    });

    const joke = await generateDailyJoke({
      persona: "SOPHIE",
      plannedCategory: "BOULOT",
      plannedTheme: "Test",
      recentJokes: [],
      monthlyPlanSummary: "",
    });

    expect(joke.content.length).toBeLessThanOrEqual(1000);
    expect(joke.punchline.length).toBeLessThanOrEqual(500);
  });
});

describe("Tip Agent", () => {
  let generateDailyTip: typeof import("@/lib/ai/agents/tip-agent").generateDailyTip;
  let mockAnthropicCreate: jest.Mock;

  beforeEach(async () => {
    jest.resetModules();
    const Anthropic = (await import("@anthropic-ai/sdk")).default as jest.Mock;
    mockAnthropicCreate = jest.fn();
    Anthropic.mockImplementation(() => ({
      messages: { create: mockAnthropicCreate },
    }));
    const mod = await import("@/lib/ai/agents/tip-agent");
    generateDailyTip = mod.generateDailyTip;
  });

  it("generates a tip with valid structure", async () => {
    mockAnthropicCreate.mockResolvedValue({
      content: [
        {
          type: "text",
          text: JSON.stringify({
            title: "Maîtrise la pause",
            content: "La pause est ton arme secrète...",
            category: "TIMING",
            difficulty: "DEBUTANT",
            example: "Quand tu racontes une histoire...",
            exercise: "Aujourd'hui, fais une pause de 2 secondes...",
          }),
        },
      ],
    });

    const tip = await generateDailyTip({
      persona: "YANIS",
      plannedCategory: "TIMING",
      plannedTheme: "Les pauses dans l'humour",
      recentTips: [],
      monthlyPlanSummary: "",
    });

    expect(tip.title).toBe("Maîtrise la pause");
    expect(tip.category).toBe("TIMING");
    expect(tip.difficulty).toBe("DEBUTANT");
    expect(tip.example).toBeTruthy();
    expect(tip.exercise).toBeTruthy();
  });

  it("throws on empty required fields", async () => {
    mockAnthropicCreate.mockResolvedValue({
      content: [
        {
          type: "text",
          text: JSON.stringify({
            title: "Ok",
            content: "Ok",
            category: "TIMING",
            difficulty: "DEBUTANT",
            example: "",
            exercise: "Ok",
          }),
        },
      ],
    });

    await expect(
      generateDailyTip({
        persona: "YANIS",
        plannedCategory: "TIMING",
        plannedTheme: "Test",
        recentTips: [],
        monthlyPlanSummary: "",
      })
    ).rejects.toThrow("champs obligatoires sont vides");
  });
});

describe("Video Agent", () => {
  let selectDailyVideo: typeof import("@/lib/ai/agents/video-agent").selectDailyVideo;
  let mockAnthropicCreate: jest.Mock;

  beforeEach(async () => {
    jest.resetModules();
    const Anthropic = (await import("@anthropic-ai/sdk")).default as jest.Mock;
    mockAnthropicCreate = jest.fn();
    Anthropic.mockImplementation(() => ({
      messages: { create: mockAnthropicCreate },
    }));
    const mod = await import("@/lib/ai/agents/video-agent");
    selectDailyVideo = mod.selectDailyVideo;
  });

  const mockVideos = [
    {
      id: "v1",
      title: "Timing comique",
      channelName: "Humour TV",
      category: "TIMING",
      difficulty: "DEBUTANT",
      technique: "Pause",
      description: "Comment maîtriser le timing",
    },
    {
      id: "v2",
      title: "L'art du storytelling",
      channelName: "Stand-up FR",
      category: "STORYTELLING",
      difficulty: "INTERMEDIAIRE",
      technique: "Narration",
      description: "Raconter des histoires drôles",
    },
  ];

  it("selects a video from available list", async () => {
    mockAnthropicCreate.mockResolvedValue({
      content: [
        {
          type: "text",
          text: JSON.stringify({ videoId: "v1", reason: "Correspond au thème" }),
        },
      ],
    });

    const result = await selectDailyVideo({
      persona: "YANIS",
      plannedCategory: "TIMING",
      plannedTheme: "Le timing",
      availableVideos: mockVideos,
      recentVideoIds: [],
      monthlyPlanSummary: "",
    });

    expect(result.videoId).toBe("v1");
  });

  it("excludes recently used videos", async () => {
    mockAnthropicCreate.mockResolvedValue({
      content: [
        {
          type: "text",
          text: JSON.stringify({ videoId: "v2", reason: "v1 déjà utilisée" }),
        },
      ],
    });

    const result = await selectDailyVideo({
      persona: "SOPHIE",
      plannedCategory: "STORYTELLING",
      plannedTheme: "Narration",
      availableVideos: mockVideos,
      recentVideoIds: ["v1"],
      monthlyPlanSummary: "",
    });

    expect(result.videoId).toBe("v2");
  });

  it("falls back to first video when all have been used", async () => {
    const result = await selectDailyVideo({
      persona: "MARC",
      plannedCategory: "TIMING",
      plannedTheme: "Test",
      availableVideos: mockVideos,
      recentVideoIds: ["v1", "v2"],
      monthlyPlanSummary: "",
    });

    expect(result.videoId).toBe("v1");
    expect(result.reason).toContain("Rotation");
  });

  it("throws when no videos available", async () => {
    await expect(
      selectDailyVideo({
        persona: "YANIS",
        plannedCategory: "TIMING",
        plannedTheme: "Test",
        availableVideos: [],
        recentVideoIds: [],
        monthlyPlanSummary: "",
      })
    ).rejects.toThrow("aucune vidéo disponible");
  });

  it("falls back when AI returns invalid video ID", async () => {
    mockAnthropicCreate.mockResolvedValue({
      content: [
        {
          type: "text",
          text: JSON.stringify({ videoId: "inexistant", reason: "test" }),
        },
      ],
    });

    const result = await selectDailyVideo({
      persona: "SOPHIE",
      plannedCategory: "TIMING",
      plannedTheme: "Test",
      availableVideos: mockVideos,
      recentVideoIds: [],
      monthlyPlanSummary: "",
    });

    expect(["v1", "v2"]).toContain(result.videoId);
  });
});

describe("AI Client utilities", () => {
  it("extractJson extracts first valid JSON object", async () => {
    const { extractJson } = await import("@/lib/ai/client");
    const result = extractJson<{ a: number }>('Some text {"a": 1} more text');
    expect(result).toEqual({ a: 1 });
  });

  it("extractJson throws on no JSON", async () => {
    const { extractJson } = await import("@/lib/ai/client");
    expect(() => extractJson("no json here")).toThrow("aucun objet trouvé");
  });

  it("extractJsonArray extracts JSON array", async () => {
    const { extractJsonArray } = await import("@/lib/ai/client");
    const result = extractJsonArray<{ x: number }>('Prefix [{"x": 1}, {"x": 2}] suffix');
    expect(result).toEqual([{ x: 1 }, { x: 2 }]);
  });

  it("getResponseText extracts text from Anthropic response", async () => {
    const { getResponseText } = await import("@/lib/ai/client");
    const response = { content: [{ type: "text" as const, text: "hello" }] };
    expect(getResponseText(response as never)).toBe("hello");
  });
});
