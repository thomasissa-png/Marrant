/**
 * Tests — Instagram Pipeline (client + image generator + templates)
 */

// ─── Mocks ───────────────────────────────────────────────────────

// Mock fetch for Meta Graph API calls
const mockFetch = jest.fn();
global.fetch = mockFetch;

// Mock fs/promises — readFile returns a fake font buffer (local fonts self-hosted)
jest.mock("fs/promises", () => ({
  readFile: jest.fn().mockResolvedValue(Buffer.alloc(100)),
}));

// Mock satori
jest.mock("satori", () => {
  return jest.fn().mockResolvedValue("<svg>mock</svg>");
});

// Mock resvg-js
jest.mock("@resvg/resvg-js", () => ({
  Resvg: jest.fn().mockImplementation(() => ({
    render: () => ({
      asPng: () => new Uint8Array([137, 80, 78, 71]), // PNG magic bytes
    }),
  })),
}));

// ─── Instagram Client Tests ──────────────────────────────────────

describe("instagram-client", () => {
  const ENV_BACKUP = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = {
      ...ENV_BACKUP,
      INSTAGRAM_ACCESS_TOKEN: "test-token",
      INSTAGRAM_BUSINESS_ID: "123456",
    };
    mockFetch.mockReset();
  });

  afterAll(() => {
    process.env = ENV_BACKUP;
  });

  describe("isInstagramConfigured", () => {
    it("retourne true quand les 2 secrets sont présents", () => {
      const { isInstagramConfigured } = require("@/lib/social/instagram-client");
      expect(isInstagramConfigured()).toBe(true);
    });

    it("retourne false quand INSTAGRAM_ACCESS_TOKEN manque", () => {
      delete process.env.INSTAGRAM_ACCESS_TOKEN;
      const { isInstagramConfigured } = require("@/lib/social/instagram-client");
      expect(isInstagramConfigured()).toBe(false);
    });

    it("retourne false quand INSTAGRAM_BUSINESS_ID manque", () => {
      delete process.env.INSTAGRAM_BUSINESS_ID;
      const { isInstagramConfigured } = require("@/lib/social/instagram-client");
      expect(isInstagramConfigured()).toBe(false);
    });
  });

  describe("postImage", () => {
    it("suit le flow 3 étapes : container → wait → publish", async () => {
      const { postImage } = require("@/lib/social/instagram-client");

      // Step 1: Create container
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ id: "container-1" }),
      });

      // Step 2: Wait for container (FINISHED)
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ status_code: "FINISHED" }),
      });

      // Step 3: Publish
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ id: "post-123" }),
      });

      const result = await postImage("https://example.com/image.png", "Test caption");
      expect(result).toBe("post-123");
      expect(mockFetch).toHaveBeenCalledTimes(3);

      // Vérifier que le 1er appel crée le container avec image_url
      const firstCallBody = mockFetch.mock.calls[0][1].body;
      expect(firstCallBody).toContain("image_url=");
      expect(firstCallBody).toContain("caption=");
    });

    it("throw si credentials manquantes", async () => {
      delete process.env.INSTAGRAM_ACCESS_TOKEN;
      const { postImage } = require("@/lib/social/instagram-client");

      await expect(postImage("url", "caption")).rejects.toThrow(
        "Instagram API credentials manquantes",
      );
    });

    it("throw si l'API retourne une erreur", async () => {
      const { postImage } = require("@/lib/social/instagram-client");

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        text: () => Promise.resolve("Bad Request"),
      });

      await expect(
        postImage("https://example.com/img.png", "cap"),
      ).rejects.toThrow("Instagram API 400");
    });
  });

  describe("postCarousel", () => {
    it("crée des containers enfants + carousel parent + publie", async () => {
      const { postCarousel } = require("@/lib/social/instagram-client");

      const imageUrls = [
        "https://example.com/slide1.png",
        "https://example.com/slide2.png",
        "https://example.com/slide3.png",
      ];

      // 3 child containers
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ id: "child-1" }),
      });
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ id: "child-2" }),
      });
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ id: "child-3" }),
      });

      // 3 waits for children (FINISHED)
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ status_code: "FINISHED" }),
      });
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ status_code: "FINISHED" }),
      });
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ status_code: "FINISHED" }),
      });

      // Parent carousel container
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ id: "carousel-1" }),
      });

      // Wait for carousel
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ status_code: "FINISHED" }),
      });

      // Publish
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ id: "post-carousel-123" }),
      });

      const result = await postCarousel(imageUrls, "Test carousel");
      expect(result).toBe("post-carousel-123");
    });

    it("rejette si moins de 2 images", async () => {
      const { postCarousel } = require("@/lib/social/instagram-client");
      await expect(postCarousel(["one.png"], "cap")).rejects.toThrow(
        "2-10 images requises",
      );
    });

    it("rejette si plus de 10 images", async () => {
      const { postCarousel } = require("@/lib/social/instagram-client");
      const urls = Array(11).fill("img.png");
      await expect(postCarousel(urls, "cap")).rejects.toThrow(
        "2-10 images requises",
      );
    });
  });

  describe("getInstagramMetrics", () => {
    it("retourne les métriques d'un post", async () => {
      const { getInstagramMetrics } = require("@/lib/social/instagram-client");

      // Basic metrics
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({ like_count: 42, comments_count: 5 }),
      });

      // Insights
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            data: [
              { name: "impressions", values: [{ value: 1200 }] },
              { name: "reach", values: [{ value: 800 }] },
              { name: "saved", values: [{ value: 15 }] },
              { name: "shares", values: [{ value: 3 }] },
            ],
          }),
      });

      const m = await getInstagramMetrics("post-123");
      expect(m.likes).toBe(42);
      expect(m.comments).toBe(5);
      expect(m.impressions).toBe(1200);
      expect(m.reach).toBe(800);
      expect(m.saves).toBe(15);
      expect(m.shares).toBe(3);
    });

    it("retourne des zéros si l'appel échoue", async () => {
      const { getInstagramMetrics } = require("@/lib/social/instagram-client");

      mockFetch.mockRejectedValueOnce(new Error("Network error"));

      const m = await getInstagramMetrics("post-fail");
      expect(m.likes).toBe(0);
      expect(m.impressions).toBe(0);
    });
  });
});

// ─── Image Generator Tests ───────────────────────────────────────

describe("image-generator", () => {
  beforeEach(() => {
    mockFetch.mockReset();
    // Mock font fetch
    mockFetch.mockResolvedValue({
      ok: true,
      arrayBuffer: () => Promise.resolve(new ArrayBuffer(100)),
    });
  });

  it("generateTechniqueDuJour retourne un Buffer PNG", async () => {
    const { generateTechniqueDuJour } = require("@/lib/social/image-generator");

    const buf = await generateTechniqueDuJour({
      technique: "Le Callback",
      description: "Reprendre un élément mentionné plus tôt pour créer un effet de surprise.",
    });

    expect(Buffer.isBuffer(buf)).toBe(true);
    expect(buf.length).toBeGreaterThan(0);
  });

  it("generateLaVanne retourne un Buffer PNG", async () => {
    const { generateLaVanne } = require("@/lib/social/image-generator");

    const buf = await generateLaVanne({
      setup: "Mon ex m'a dit que je ne l'écoutais jamais.",
      punchline: "Du moins c'est ce que je crois qu'elle a dit.",
      category: "Observation",
    });

    expect(Buffer.isBuffer(buf)).toBe(true);
  });

  it("generateDecryptageCarousel retourne un Buffer par slide", async () => {
    const { generateDecryptageCarousel } = require("@/lib/social/image-generator");

    const slides = [
      { title: "Intro", content: "Le setup" },
      { title: "Étape 1", content: "Premier point" },
      { title: "Récap", content: "Résumé final" },
    ];

    const buffers = await generateDecryptageCarousel(slides);
    expect(buffers).toHaveLength(3);
    buffers.forEach((buf) => expect(Buffer.isBuffer(buf)).toBe(true));
  });

  it("generateLeDefi retourne un Buffer PNG", async () => {
    const { generateLeDefi } = require("@/lib/social/image-generator");

    const buf = await generateLeDefi({
      challenge: "Place une vanne en réunion demain",
      context: "Le moment le plus naturel : quand quelqu'un fait un constat évident.",
      persona: "SOPHIE",
    });

    expect(Buffer.isBuffer(buf)).toBe(true);
  });
});

// ─── Template Structure Tests ────────────────────────────────────

describe("instagram-templates", () => {
  it("exporte les 4 templates + COLORS + BRAND", () => {
    const templates = require("@/lib/social/templates/instagram-templates");
    expect(templates.TechniqueDuJour).toBeDefined();
    expect(templates.LaVanne).toBeDefined();
    expect(templates.DecryptageSlide).toBeDefined();
    expect(templates.LeDefi).toBeDefined();
    expect(templates.COLORS).toBeDefined();
    expect(templates.BRAND).toBe("deviens-marrant.fr");
  });

  it("COLORS contient les bonnes valeurs de la charte", () => {
    const { COLORS } = require("@/lib/social/templates/instagram-templates");
    expect(COLORS.bg).toBe("#0D0D0D");
    expect(COLORS.accent).toBe("#8B5CF6");
    expect(COLORS.textPrimary).toBe("#FFFFFF");
    expect(COLORS.textSecondary).toBe("#B3B3B3");
  });
});
