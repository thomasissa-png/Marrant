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
      hashtags: ["#humour", "#répartie", "#deviensmarrant"],
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
