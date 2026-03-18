import { getPersonaForDay, getDifficultyForDay, PERSONAS } from "@/lib/ai/personas";
import { validateMonthlyPlan, harmonizeCrossAgentPlans } from "@/lib/ai/plan-validator";

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

  it("getDifficultyForDay returns DEBUTANT for Yanis always", () => {
    expect(getDifficultyForDay("YANIS", 1)).toBe("DEBUTANT");
    expect(getDifficultyForDay("YANIS", 15)).toBe("DEBUTANT");
    expect(getDifficultyForDay("YANIS", 31)).toBe("DEBUTANT");
  });

  it("getDifficultyForDay returns INTERMEDIAIRE for Sophie always", () => {
    expect(getDifficultyForDay("SOPHIE", 2)).toBe("INTERMEDIAIRE");
    expect(getDifficultyForDay("SOPHIE", 20)).toBe("INTERMEDIAIRE");
  });

  it("getDifficultyForDay alternates Marc between INTERMEDIAIRE and EXPERT", () => {
    // Semaine 1 (jours 1-7) = INTERMEDIAIRE
    expect(getDifficultyForDay("MARC", 3)).toBe("INTERMEDIAIRE");
    expect(getDifficultyForDay("MARC", 6)).toBe("INTERMEDIAIRE");
    // Semaine 2 (jours 8-14) = EXPERT
    expect(getDifficultyForDay("MARC", 9)).toBe("EXPERT");
    expect(getDifficultyForDay("MARC", 12)).toBe("EXPERT");
    // Semaine 3 (jours 15-21) = INTERMEDIAIRE
    expect(getDifficultyForDay("MARC", 15)).toBe("INTERMEDIAIRE");
    expect(getDifficultyForDay("MARC", 18)).toBe("INTERMEDIAIRE");
    // Semaine 4 (jours 22-28) = EXPERT
    expect(getDifficultyForDay("MARC", 24)).toBe("EXPERT");
    expect(getDifficultyForDay("MARC", 27)).toBe("EXPERT");
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

describe("Cross-Agent Plan Harmonization", () => {
  const tipCategories = ["TIMING", "AUTODERISION", "OBSERVATION", "REPARTIE", "STORYTELLING", "ABSURDE", "JEUX_DE_MOTS"] as const;

  function makePlan(categories: string[]): Array<{ dayOfMonth: number; category: string; theme: string; targetPersona: string }> {
    return categories.map((category, i) => ({
      dayOfMonth: i + 1,
      category,
      theme: `Thème jour ${i + 1}`,
      targetPersona: getPersonaForDay(i + 1),
    }));
  }

  it("resolves shared category conflicts between joke and tip", () => {
    const jokePlan = makePlan(["AUTODERISION", "BOULOT", "ECOLE"]);
    const tipPlan = makePlan(["AUTODERISION", "TIMING", "OBSERVATION"]);
    const videoPlan = makePlan(["TIMING", "OBSERVATION", "STORYTELLING"]);

    harmonizeCrossAgentPlans(jokePlan, tipPlan, videoPlan, tipCategories);

    // Jour 1 : joke=AUTODERISION, tip devrait avoir changé (plus AUTODERISION)
    expect(tipPlan[0].category).not.toBe("AUTODERISION");
    expect(tipCategories).toContain(tipPlan[0].category);
  });

  it("resolves shared category conflicts between joke and video", () => {
    const jokePlan = makePlan(["ABSURDE", "BOULOT", "ECOLE"]);
    const tipPlan = makePlan(["TIMING", "OBSERVATION", "REPARTIE"]);
    const videoPlan = makePlan(["ABSURDE", "OBSERVATION", "STORYTELLING"]);

    harmonizeCrossAgentPlans(jokePlan, tipPlan, videoPlan, tipCategories);

    // Jour 1 : joke=ABSURDE, video devrait avoir changé
    expect(videoPlan[0].category).not.toBe("ABSURDE");
    expect(tipCategories).toContain(videoPlan[0].category);
  });

  it("resolves tip vs video same category (same enum space)", () => {
    const jokePlan = makePlan(["BOULOT", "ECOLE", "GAMING"]);
    const tipPlan = makePlan(["TIMING", "OBSERVATION", "REPARTIE"]);
    const videoPlan = makePlan(["TIMING", "OBSERVATION", "REPARTIE"]);

    harmonizeCrossAgentPlans(jokePlan, tipPlan, videoPlan, tipCategories);

    // Chaque jour : tip ≠ video
    for (let i = 0; i < 3; i++) {
      expect(tipPlan[i].category).not.toBe(videoPlan[i].category);
    }
  });

  it("keeps joke category unchanged (priority)", () => {
    const jokePlan = makePlan(["AUTODERISION"]);
    const tipPlan = makePlan(["AUTODERISION"]);
    const videoPlan = makePlan(["AUTODERISION"]);

    harmonizeCrossAgentPlans(jokePlan, tipPlan, videoPlan, tipCategories);

    // Joke garde sa catégorie, tip et video changent
    expect(jokePlan[0].category).toBe("AUTODERISION");
    expect(tipPlan[0].category).not.toBe("AUTODERISION");
    expect(videoPlan[0].category).not.toBe("AUTODERISION");
    // Tip et video doivent aussi être différents entre eux
    expect(tipPlan[0].category).not.toBe(videoPlan[0].category);
  });

  it("handles non-shared joke categories gracefully (no conflict)", () => {
    const jokePlan = makePlan(["BOULOT", "ECOLE", "GAMING"]);
    const tipPlan = makePlan(["TIMING", "OBSERVATION", "REPARTIE"]);
    const videoPlan = makePlan(["STORYTELLING", "ABSURDE", "JEUX_DE_MOTS"]);

    const tipBefore = tipPlan.map((e) => e.category);
    const videoBefore = videoPlan.map((e) => e.category);

    harmonizeCrossAgentPlans(jokePlan, tipPlan, videoPlan, tipCategories);

    // Rien ne devrait changer — pas de conflit
    expect(tipPlan.map((e) => e.category)).toEqual(tipBefore);
    expect(videoPlan.map((e) => e.category)).toEqual(videoBefore);
  });

  it("ensures all 3 categories are different each day when possible", () => {
    // 31 jours avec des conflits potentiels
    const days = 31;
    const jokeCategories = Array.from({ length: days }, (_, i) =>
      ["AUTODERISION", "ABSURDE", "JEUX_DE_MOTS", "BOULOT", "ECOLE", "GAMING", "SITUATION"][i % 7]
    );
    const tipCats = Array.from({ length: days }, (_, i) =>
      ["AUTODERISION", "TIMING", "OBSERVATION", "REPARTIE", "STORYTELLING", "ABSURDE", "JEUX_DE_MOTS"][i % 7]
    );
    const videoCats = Array.from({ length: days }, (_, i) =>
      ["AUTODERISION", "TIMING", "OBSERVATION", "REPARTIE", "STORYTELLING", "ABSURDE", "JEUX_DE_MOTS"][i % 7]
    );

    const jokePlan = makePlan(jokeCategories);
    const tipPlan = makePlan(tipCats);
    const videoPlan = makePlan(videoCats);

    harmonizeCrossAgentPlans(jokePlan, tipPlan, videoPlan, tipCategories);

    // Tip et video ne doivent jamais être identiques
    for (let i = 0; i < days; i++) {
      expect(tipPlan[i].category).not.toBe(videoPlan[i].category);
    }
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

  it("clamps maturityLevel to 1-3 range", async () => {
    mockAnthropicCreate.mockResolvedValue({
      content: [
        {
          type: "text",
          text: JSON.stringify({
            content: "Setup",
            punchline: "Chute",
            category: "BOULOT",
            type: "CLASSIQUE",
            maturityLevel: 5,
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

    expect(joke.maturityLevel).toBe(1);
  });

  it("falls back to CLASSIQUE on invalid type", async () => {
    mockAnthropicCreate.mockResolvedValue({
      content: [
        {
          type: "text",
          text: JSON.stringify({
            content: "Setup",
            punchline: "Chute",
            category: "BOULOT",
            type: "INVALID_TYPE",
            maturityLevel: 2,
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

    expect(joke.type).toBe("CLASSIQUE");
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

  it("corrects invalid difficulty to persona default", async () => {
    mockAnthropicCreate.mockResolvedValue({
      content: [
        {
          type: "text",
          text: JSON.stringify({
            title: "Titre",
            content: "Contenu du conseil",
            category: "TIMING",
            difficulty: "INVALID_DIFF",
            example: "Exemple",
            exercise: "Exercice",
          }),
        },
      ],
    });

    const tip = await generateDailyTip({
      persona: "YANIS",
      plannedCategory: "TIMING",
      plannedTheme: "Test",
      recentTips: [],
      monthlyPlanSummary: "",
    });

    expect(tip.difficulty).toBe("DEBUTANT"); // YANIS tipDifficulty
  });

  it("corrects invalid category to planned category", async () => {
    mockAnthropicCreate.mockResolvedValue({
      content: [
        {
          type: "text",
          text: JSON.stringify({
            title: "Titre",
            content: "Contenu",
            category: "INVALID_CAT",
            difficulty: "DEBUTANT",
            example: "Exemple",
            exercise: "Exercice",
          }),
        },
      ],
    });

    const tip = await generateDailyTip({
      persona: "YANIS",
      plannedCategory: "REPARTIE",
      plannedTheme: "Test",
      recentTips: [],
      monthlyPlanSummary: "",
    });

    expect(tip.category).toBe("REPARTIE");
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

describe("Marketing Agent", () => {
  let generateSocialPost: typeof import("@/lib/ai/agents/marketing-agent").generateSocialPost;
  let generateShortVideoScript: typeof import("@/lib/ai/agents/marketing-agent").generateShortVideoScript;
  let generateSubAgentDirectives: typeof import("@/lib/ai/agents/marketing-agent").generateSubAgentDirectives;
  let mockAnthropicCreate: jest.Mock;

  beforeEach(async () => {
    jest.resetModules();
    const Anthropic = (await import("@anthropic-ai/sdk")).default as jest.Mock;
    mockAnthropicCreate = jest.fn();
    Anthropic.mockImplementation(() => ({
      messages: { create: mockAnthropicCreate },
    }));
    const mod = await import("@/lib/ai/agents/marketing-agent");
    generateSocialPost = mod.generateSocialPost;
    generateShortVideoScript = mod.generateShortVideoScript;
    generateSubAgentDirectives = mod.generateSubAgentDirectives;
  });

  it("generates a social post with valid structure", async () => {
    const mockPost = {
      platform: "TIKTOK",
      format: "REEL",
      targetPersona: "YANIS",
      hook: "Tu restes muet quand on te chambre ?",
      content: "Voici 3 techniques de répartie...",
      cta: "Lien en bio pour progresser",
      hashtags: ["#humour", "#répartie", "#deviens-marrant"],
      objective: "Acquisition persona jeune",
      kpi: "Taux d'engagement > 5%",
    };

    mockAnthropicCreate.mockResolvedValue({
      content: [{ type: "text", text: JSON.stringify(mockPost) }],
    });

    const post = await generateSocialPost({
      platform: "TIKTOK",
      theme: "Techniques de répartie pour ados",
      targetPersona: "YANIS",
    });

    expect(post.platform).toBe("TIKTOK");
    expect(post.targetPersona).toBe("YANIS");
    expect(post.hook).toBeTruthy();
    expect(post.cta).toBeTruthy();
    expect(post.hashtags.length).toBeGreaterThan(0);
  });

  it("generates a short video script with scenes", async () => {
    const mockScript = {
      title: "3 répliques qui tuent",
      targetPersona: "SOPHIE",
      platform: "INSTAGRAM_REELS",
      hook: "Ta collègue te lance une pique ?",
      scenes: [
        { timing: "0-2s", visual: "Face caméra", text: "Hook", audio: "Musique trending" },
        { timing: "2-15s", visual: "Texte animé", text: "3 répliques", audio: "Voix off" },
      ],
      cta: "Suivez pour + de répartie",
      duration: "15s",
      objective: "Notoriété de marque",
    };

    mockAnthropicCreate.mockResolvedValue({
      content: [{ type: "text", text: JSON.stringify(mockScript) }],
    });

    const script = await generateShortVideoScript({
      theme: "Répartie au bureau",
      targetPersona: "SOPHIE",
      platform: "INSTAGRAM_REELS",
    });

    expect(script.platform).toBe("INSTAGRAM_REELS");
    expect(script.scenes.length).toBeGreaterThan(0);
    expect(script.hook).toBeTruthy();
    expect(script.duration).toBeTruthy();
  });

  it("generates sub-agent directives for SEO, Design, UX", async () => {
    const mockDirective = {
      campaign: "Lancement V2",
      overallObjective: "Tripler les inscriptions en 30 jours",
      briefs: [
        {
          agent: "SEO",
          objective: "Optimiser les pages clés",
          context: "Lancement de la V2",
          deliverables: ["Audit SEO", "Mots-clés prioritaires"],
          constraints: ["Budget limité"],
          priority: "HIGH",
          deadline: "J+7",
          successCriteria: ["Top 3 sur 5 mots-clés"],
          personaFocus: ["YANIS", "SOPHIE"],
        },
        {
          agent: "DESIGN",
          objective: "Créer les visuels de campagne",
          context: "Assets pour réseaux sociaux",
          deliverables: ["Templates Reel", "Bannières"],
          constraints: ["Charte graphique violet/noir"],
          priority: "HIGH",
          deadline: "J+5",
          successCriteria: ["10 templates validés"],
          personaFocus: ["YANIS", "SOPHIE", "MARC"],
        },
        {
          agent: "UX",
          objective: "Optimiser le tunnel de conversion",
          context: "Funnel free → premium",
          deliverables: ["Wireframes A/B", "Recommandations CTA"],
          constraints: ["Mobile-first"],
          priority: "MEDIUM",
          deadline: "J+10",
          successCriteria: ["Conversion +20%"],
          personaFocus: ["MARC"],
        },
      ],
      coordinationNotes: "Le Design doit attendre les mots-clés SEO pour les visuels.",
    };

    mockAnthropicCreate.mockResolvedValue({
      content: [{ type: "text", text: JSON.stringify(mockDirective) }],
    });

    const directive = await generateSubAgentDirectives({
      campaign: "Lancement V2",
      objective: "Tripler les inscriptions",
      agents: ["SEO", "DESIGN", "UX"],
    });

    expect(directive.campaign).toBe("Lancement V2");
    expect(directive.briefs).toHaveLength(3);
    expect(directive.briefs.map((b) => b.agent)).toEqual(["SEO", "DESIGN", "UX"]);
    expect(directive.coordinationNotes).toBeTruthy();
    directive.briefs.forEach((brief) => {
      expect(brief.deliverables.length).toBeGreaterThan(0);
      expect(brief.successCriteria.length).toBeGreaterThan(0);
      expect(brief.personaFocus.length).toBeGreaterThan(0);
    });
  });

  it("throws on invalid JSON response", async () => {
    mockAnthropicCreate.mockResolvedValue({
      content: [{ type: "text", text: "pas du json valide" }],
    });

    await expect(
      generateSocialPost({
        platform: "TWITTER",
        theme: "Test",
        targetPersona: "MARC",
      })
    ).rejects.toThrow();
  });

  it("throws on empty hook in social post", async () => {
    mockAnthropicCreate.mockResolvedValue({
      content: [{ type: "text", text: JSON.stringify({
        platform: "TIKTOK",
        format: "REEL",
        targetPersona: "YANIS",
        hook: "",
        content: "Contenu",
        cta: "CTA",
        hashtags: [],
        objective: "Test",
        kpi: "Test",
      }) }],
    });

    await expect(
      generateSocialPost({
        platform: "TIKTOK",
        theme: "Test",
        targetPersona: "YANIS",
      })
    ).rejects.toThrow("hook");
  });

  it("throws on empty scenes in video script", async () => {
    mockAnthropicCreate.mockResolvedValue({
      content: [{ type: "text", text: JSON.stringify({
        title: "Test",
        targetPersona: "SOPHIE",
        platform: "INSTAGRAM_REELS",
        hook: "Hook",
        scenes: [],
        cta: "CTA",
        duration: "15s",
        objective: "Test",
      }) }],
    });

    await expect(
      generateShortVideoScript({
        theme: "Test",
        targetPersona: "SOPHIE",
        platform: "INSTAGRAM_REELS",
      })
    ).rejects.toThrow("scène");
  });

  it("truncates overly long hook in social post", async () => {
    mockAnthropicCreate.mockResolvedValue({
      content: [{ type: "text", text: JSON.stringify({
        platform: "TIKTOK",
        format: "REEL",
        targetPersona: "YANIS",
        hook: "A".repeat(500),
        content: "Contenu",
        cta: "CTA",
        hashtags: ["#test"],
        objective: "Test",
        kpi: "Test",
      }) }],
    });

    const post = await generateSocialPost({
      platform: "TIKTOK",
      theme: "Test",
      targetPersona: "YANIS",
    });

    expect(post.hook.length).toBeLessThanOrEqual(200);
  });
});

describe("AI Client utilities", () => {
  it("extractJson extracts first valid JSON object", async () => {
    const { extractJson } = await import("@/lib/ai/client");
    const result = extractJson<{ a: number }>('Some text {"a": 1} more text');
    expect(result).toEqual({ a: 1 });
  });

  it("extractJson handles nested JSON objects", async () => {
    const { extractJson } = await import("@/lib/ai/client");
    const nested = '{"data": {"inner": [1,2,3]}, "name": "test"}';
    const result = extractJson<{ data: { inner: number[] }; name: string }>(nested);
    expect(result.data.inner).toEqual([1, 2, 3]);
    expect(result.name).toBe("test");
  });

  it("extractJson throws on no JSON", async () => {
    const { extractJson } = await import("@/lib/ai/client");
    expect(() => extractJson("no json here")).toThrow("aucun objet trouvé");
  });

  it("extractJson throws on incomplete JSON", async () => {
    const { extractJson } = await import("@/lib/ai/client");
    expect(() => extractJson('{"incomplete": ')).toThrow("incomplet");
  });

  it("extractJsonArray extracts JSON array", async () => {
    const { extractJsonArray } = await import("@/lib/ai/client");
    const result = extractJsonArray<{ x: number }>('Prefix [{"x": 1}, {"x": 2}] suffix');
    expect(result).toEqual([{ x: 1 }, { x: 2 }]);
  });

  it("extractJsonArray handles nested arrays", async () => {
    const { extractJsonArray } = await import("@/lib/ai/client");
    const result = extractJsonArray<{ data: number[] }>('[{"data": [1,2,3]}]');
    expect(result[0].data).toEqual([1, 2, 3]);
  });

  it("getResponseText extracts text from Anthropic response", async () => {
    const { getResponseText } = await import("@/lib/ai/client");
    const response = { content: [{ type: "text" as const, text: "hello" }] };
    expect(getResponseText(response as never)).toBe("hello");
  });

  it("getResponseText returns empty string when content is empty", async () => {
    const { getResponseText } = await import("@/lib/ai/client");
    const response = { content: [] };
    expect(getResponseText(response as never)).toBe("");
  });
});

describe("Persona rotation helpers", () => {
  it("buildPersonaRotationPrompt generates consistent output", () => {
    const { buildPersonaRotationPrompt } = require("@/lib/ai/personas");
    const prompt = buildPersonaRotationPrompt("jokeCategories");
    expect(prompt).toContain("YANIS");
    expect(prompt).toContain("SOPHIE");
    expect(prompt).toContain("MARC");
    expect(prompt).toContain("ECOLE");
    expect(prompt).toContain("BOULOT");
    expect(prompt).toContain("COUPLE");
  });

  it("buildPersonaRotationPrompt includes difficulty for tipCategories", () => {
    const { buildPersonaRotationPrompt } = require("@/lib/ai/personas");
    const prompt = buildPersonaRotationPrompt("tipCategories");
    expect(prompt).toContain("DEBUTANT");
    expect(prompt).toContain("INTERMEDIAIRE");
  });
});

describe("Stand-Up Director Agent", () => {
  let validateJoke: typeof import("@/lib/ai/agents/standup-director-agent").validateJoke;
  let validateTip: typeof import("@/lib/ai/agents/standup-director-agent").validateTip;
  let validateVideoSelection: typeof import("@/lib/ai/agents/standup-director-agent").validateVideoSelection;
  let validateBlogArticle: typeof import("@/lib/ai/agents/standup-director-agent").validateBlogArticle;
  let generateEditorialVision: typeof import("@/lib/ai/agents/standup-director-agent").generateEditorialVision;
  let reviewContentBatch: typeof import("@/lib/ai/agents/standup-director-agent").reviewContentBatch;
  let mockAnthropicCreate: jest.Mock;

  beforeEach(async () => {
    jest.resetModules();
    const Anthropic = (await import("@anthropic-ai/sdk")).default as jest.Mock;
    mockAnthropicCreate = jest.fn();
    Anthropic.mockImplementation(() => ({
      messages: { create: mockAnthropicCreate },
    }));
    const mod = await import("@/lib/ai/agents/standup-director-agent");
    validateJoke = mod.validateJoke;
    validateTip = mod.validateTip;
    validateVideoSelection = mod.validateVideoSelection;
    validateBlogArticle = mod.validateBlogArticle;
    generateEditorialVision = mod.generateEditorialVision;
    reviewContentBatch = mod.reviewContentBatch;
  });

  it("validates a joke and returns APPROVED", async () => {
    mockAnthropicCreate.mockResolvedValue({
      content: [
        {
          type: "text",
          text: JSON.stringify({
            verdict: "APPROVED",
            score: 8,
            strengths: ["Twist net", "Relatable"],
            issues: [],
            directorNote: "Bonne vanne, publiable.",
          }),
        },
      ],
    });

    const result = await validateJoke(
      {
        content: "J'ai dit à mon pote que j'arrivais dans 5 minutes.",
        punchline: "J'étais encore en pyjama.",
        category: "SITUATION",
        type: "ONE_LINER",
        maturityLevel: 1,
      },
      "SOPHIE",
    );

    expect(result.verdict).toBe("APPROVED");
    expect(result.score).toBe(8);
    expect(result.strengths.length).toBeGreaterThan(0);
    expect(result.directorNote).toBeTruthy();
  });

  it("validates a joke and returns REJECTED", async () => {
    mockAnthropicCreate.mockResolvedValue({
      content: [
        {
          type: "text",
          text: JSON.stringify({
            verdict: "REJECTED",
            score: 2,
            strengths: [],
            issues: ["Objet qui parle", "Format Carambar"],
            directorNote: "Pas au niveau.",
          }),
        },
      ],
    });

    const result = await validateJoke(
      {
        content: "Un stylo dit à un crayon :",
        punchline: "Tu manques de pointe.",
        category: "JEUX_DE_MOTS",
        type: "CLASSIQUE",
        maturityLevel: 1,
      },
      "YANIS",
    );

    expect(result.verdict).toBe("REJECTED");
    expect(result.score).toBeLessThanOrEqual(3);
    expect(result.issues.length).toBeGreaterThan(0);
  });

  it("validates a tip and returns NEEDS_REVISION with suggestions", async () => {
    mockAnthropicCreate.mockResolvedValue({
      content: [
        {
          type: "text",
          text: JSON.stringify({
            verdict: "NEEDS_REVISION",
            score: 5,
            strengths: ["Bonne technique identifiée"],
            issues: ["Exemple pas assez concret"],
            revision: "Ajouter un dialogue concret dans l'exemple",
            directorNote: "L'idée est bonne, l'exécution peut être meilleure.",
          }),
        },
      ],
    });

    const result = await validateTip(
      {
        title: "Le silence après le rire",
        content: "Quand tu fais rire, ne parle pas. Laisse le silence faire son travail. C'est une technique de pro utilisée par tous les grands stand-uppers. Le silence amplifie le rire naturellement.",
        category: "TIMING",
        difficulty: "DEBUTANT",
        example: "Après une vanne, tais-toi pendant 5 secondes.",
        exercise: "DÉFI SILENCE : La prochaine fois que tu fais rire, impose-toi 5 secondes de silence.",
      },
      "YANIS",
    );

    expect(result.verdict).toBe("NEEDS_REVISION");
    expect(result.revision).toBeTruthy();
    expect(result.score).toBeGreaterThanOrEqual(4);
    expect(result.score).toBeLessThanOrEqual(6);
  });

  it("validates a video selection", async () => {
    mockAnthropicCreate.mockResolvedValue({
      content: [
        {
          type: "text",
          text: JSON.stringify({
            verdict: "APPROVED",
            score: 7,
            strengths: ["Bonne pertinence pédagogique", "Chaîne sous-représentée"],
            issues: [],
            directorNote: "Bon choix pour Marc.",
          }),
        },
      ],
    });

    const result = await validateVideoSelection(
      {
        videoId: "v1",
        videoTitle: "L'art du storytelling",
        channelName: "Stand-up FR",
        category: "STORYTELLING",
        technique: "Narration",
        reason: "Illustre parfaitement la progression narrative pour Marc",
      },
      "MARC",
    );

    expect(result.verdict).toBe("APPROVED");
    expect(result.score).toBeGreaterThanOrEqual(6);
  });

  it("validates a blog article", async () => {
    mockAnthropicCreate.mockResolvedValue({
      content: [
        {
          type: "text",
          text: JSON.stringify({
            verdict: "APPROVED",
            score: 8,
            strengths: ["Drôle", "Refs modernes", "SEO optimisé"],
            issues: [],
            directorNote: "Article au niveau du site n°1.",
          }),
        },
      ],
    });

    const result = await validateBlogArticle({
      title: "Comment avoir de la répartie : 7 techniques de stand-upper",
      slug: "comment-avoir-de-la-repartie",
      excerpt: "Tu restes muet quand on te chambre ? Voici les techniques des pros.",
      content: "Un long article avec du contenu drôle et instructif...",
      category: "REPARTIE",
      targetKeyword: "comment avoir de la répartie",
    });

    expect(result.verdict).toBe("APPROVED");
    expect(result.score).toBeGreaterThanOrEqual(7);
  });

  it("generates an editorial vision for a month", async () => {
    const mockVision = {
      month: "avril 2026",
      themeOfTheMonth: "Le renouveau printanier de l'humour",
      weeklyThemes: [
        {
          week: 1,
          theme: "Sortir de sa zone de confort",
          focusPersona: "YANIS",
          jokeDirection: "Vannes sur les premiers pas",
          tipDirection: "Techniques pour oser",
          videoDirection: "Vidéos de débutants qui réussissent",
          blogDirection: "Article sur les premiers open mics",
        },
        {
          week: 2,
          theme: "L'humour au travail",
          focusPersona: "SOPHIE",
          jokeDirection: "Vannes bureau",
          tipDirection: "Répartie en réunion",
          videoDirection: "Analyse timing pro",
          blogDirection: "Guide machine à café",
        },
      ],
      qualityPriorities: ["Exigence punchline", "Diversité formats"],
      standupReferences: ["Paul Mirabel", "Fary", "Roman Frayssinet"],
      directorManifesto: "Ce mois-ci, on monte le niveau.",
    };

    mockAnthropicCreate.mockResolvedValue({
      content: [{ type: "text", text: JSON.stringify(mockVision) }],
    });

    const vision = await generateEditorialVision(4, 2026);

    expect(vision.themeOfTheMonth).toBeTruthy();
    expect(vision.weeklyThemes.length).toBeGreaterThan(0);
    expect(vision.weeklyThemes[0].focusPersona).toBe("YANIS");
    expect(vision.qualityPriorities.length).toBeGreaterThan(0);
    expect(vision.directorManifesto).toBeTruthy();
  });

  it("throws on missing editorial vision fields", async () => {
    mockAnthropicCreate.mockResolvedValue({
      content: [
        {
          type: "text",
          text: JSON.stringify({
            month: "avril 2026",
            themeOfTheMonth: "",
            weeklyThemes: [],
            qualityPriorities: [],
            standupReferences: [],
            directorManifesto: "",
          }),
        },
      ],
    });

    await expect(generateEditorialVision(4, 2026)).rejects.toThrow("thème du mois manquant");
  });

  it("reviews a content batch", async () => {
    const mockReview = {
      date: "2026-03-18",
      overallScore: 7,
      coherenceScore: 8,
      diversityScore: 7,
      items: [
        { type: "JOKE", verdict: "APPROVED", score: 8, note: "Bonne vanne" },
        { type: "TIP", verdict: "APPROVED", score: 7, note: "Conseil solide" },
        { type: "VIDEO", verdict: "NEEDS_REVISION", score: 5, note: "Chaîne surreprésentée" },
      ],
      directorFeedback: "Bonne journée dans l'ensemble, revoir la sélection vidéo.",
    };

    mockAnthropicCreate.mockResolvedValue({
      content: [{ type: "text", text: JSON.stringify(mockReview) }],
    });

    const result = await reviewContentBatch(
      [
        {
          type: "JOKE",
          persona: "SOPHIE",
          content: {
            content: "Setup",
            punchline: "Punchline",
            category: "BOULOT",
            type: "ONE_LINER",
            maturityLevel: 1,
          },
        },
        {
          type: "TIP",
          persona: "SOPHIE",
          content: {
            title: "Titre",
            content: "Contenu",
            category: "TIMING",
            difficulty: "INTERMEDIAIRE",
            example: "Exemple",
            exercise: "DÉFI : exercice",
          },
        },
        {
          type: "VIDEO",
          persona: "SOPHIE",
          content: {
            videoId: "v1",
            videoTitle: "Vidéo",
            channelName: "Montreux Comedy",
            category: "STORYTELLING",
            technique: "Narration",
            reason: "Pertinent",
          },
        },
      ],
      "2026-03-18",
    );

    expect(result.overallScore).toBeGreaterThanOrEqual(1);
    expect(result.overallScore).toBeLessThanOrEqual(10);
    expect(result.items).toHaveLength(3);
    expect(result.items[0].verdict).toBe("APPROVED");
    expect(result.items[2].verdict).toBe("NEEDS_REVISION");
    expect(result.directorFeedback).toBeTruthy();
  });

  it("corrects invalid verdict in validation result", async () => {
    mockAnthropicCreate.mockResolvedValue({
      content: [
        {
          type: "text",
          text: JSON.stringify({
            verdict: "INVALID_VERDICT",
            score: 5,
            strengths: [],
            issues: [],
            directorNote: "Test",
          }),
        },
      ],
    });

    const result = await validateJoke(
      {
        content: "Setup",
        punchline: "Punchline",
        category: "BOULOT",
        type: "CLASSIQUE",
        maturityLevel: 1,
      },
      "SOPHIE",
    );

    expect(result.verdict).toBe("NEEDS_REVISION"); // fallback
  });

  it("clamps invalid score to default", async () => {
    mockAnthropicCreate.mockResolvedValue({
      content: [
        {
          type: "text",
          text: JSON.stringify({
            verdict: "APPROVED",
            score: 99,
            strengths: [],
            issues: [],
            directorNote: "Test",
          }),
        },
      ],
    });

    const result = await validateJoke(
      {
        content: "Setup",
        punchline: "Punchline",
        category: "BOULOT",
        type: "CLASSIQUE",
        maturityLevel: 1,
      },
      "SOPHIE",
    );

    expect(result.score).toBe(5); // clamped to default
  });

  it("enforces verdict/score coherence — high score cannot be REJECTED", async () => {
    mockAnthropicCreate.mockResolvedValue({
      content: [
        {
          type: "text",
          text: JSON.stringify({
            verdict: "REJECTED",
            score: 8,
            strengths: ["Tout est bien"],
            issues: [],
            directorNote: "Incohérent",
          }),
        },
      ],
    });

    const result = await validateJoke(
      {
        content: "Setup",
        punchline: "Punchline",
        category: "BOULOT",
        type: "CLASSIQUE",
        maturityLevel: 1,
      },
      "SOPHIE",
    );

    expect(result.verdict).toBe("APPROVED"); // corrected: score 8 cannot be REJECTED
  });

  it("enforces verdict/score coherence — low score cannot be APPROVED", async () => {
    mockAnthropicCreate.mockResolvedValue({
      content: [
        {
          type: "text",
          text: JSON.stringify({
            verdict: "APPROVED",
            score: 2,
            strengths: [],
            issues: ["Tout est mauvais"],
            directorNote: "Incohérent",
          }),
        },
      ],
    });

    const result = await validateTip(
      {
        title: "Titre",
        content: "Contenu du conseil assez long pour passer la validation des soixante mots minimum requis par l'agent conseils quand il génère un nouveau conseil quotidien",
        category: "TIMING",
        difficulty: "DEBUTANT",
        example: "Exemple concret",
        exercise: "DÉFI TEST : faire quelque chose",
      },
      "YANIS",
    );

    expect(result.verdict).toBe("NEEDS_REVISION"); // corrected: score 2 cannot be APPROVED
  });

  it("throws on invalid JSON response", async () => {
    mockAnthropicCreate.mockResolvedValue({
      content: [{ type: "text", text: "pas du json valide" }],
    });

    await expect(
      validateJoke(
        {
          content: "Setup",
          punchline: "Punchline",
          category: "BOULOT",
          type: "CLASSIQUE",
          maturityLevel: 1,
        },
        "MARC",
      ),
    ).rejects.toThrow();
  });

  it("throws on empty batch review", async () => {
    mockAnthropicCreate.mockResolvedValue({
      content: [
        {
          type: "text",
          text: JSON.stringify({
            date: "2026-03-18",
            overallScore: 7,
            coherenceScore: 8,
            diversityScore: 7,
            items: [],
            directorFeedback: "Rien à valider",
          }),
        },
      ],
    });

    await expect(
      reviewContentBatch([], "2026-03-18"),
    ).rejects.toThrow("revue de batch vide");
  });
});

describe("Date utilities", () => {
  it("todayUTC returns midnight UTC", () => {
    const { todayUTC } = require("@/lib/ai/date-utils");
    const today = todayUTC();
    expect(today.getUTCHours()).toBe(0);
    expect(today.getUTCMinutes()).toBe(0);
    expect(today.getUTCSeconds()).toBe(0);
  });

  it("getDayOfYear returns correct day", () => {
    const { getDayOfYear } = require("@/lib/ai/date-utils");
    // Jan 1 = day 1
    expect(getDayOfYear(new Date(Date.UTC(2026, 0, 1)))).toBe(1);
    // Feb 1 = day 32
    expect(getDayOfYear(new Date(Date.UTC(2026, 1, 1)))).toBe(32);
    // Dec 31 (non-leap year) = day 365
    expect(getDayOfYear(new Date(Date.UTC(2026, 11, 31)))).toBe(365);
  });
});
