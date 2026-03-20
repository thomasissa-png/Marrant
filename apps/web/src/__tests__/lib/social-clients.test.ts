/**
 * Tests — Twitter & LinkedIn Social Clients
 */

// ─── Mocks ───────────────────────────────────────────────────────

const mockFetch = jest.fn();
global.fetch = mockFetch;

// Mock crypto for OAuth signature
jest.mock("crypto", () => ({
  randomBytes: jest.fn().mockReturnValue({
    toString: () => "abcdef1234567890abcdef1234567890",
  }),
  createHmac: jest.fn().mockReturnValue({
    update: jest.fn().mockReturnValue({
      digest: () => "mock-signature-base64",
    }),
  }),
}));

// ─── Twitter Client Tests ──────────────────────────────────────

describe("twitter-client", () => {
  const ENV_BACKUP = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = {
      ...ENV_BACKUP,
      TWITTER_API_KEY: "test-api-key",
      TWITTER_API_SECRET: "test-api-secret",
      TWITTER_ACCESS_TOKEN: "test-access-token",
      TWITTER_ACCESS_SECRET: "test-access-secret",
    };
    mockFetch.mockReset();
  });

  afterAll(() => {
    process.env = ENV_BACKUP;
  });

  describe("isTwitterConfigured", () => {
    it("retourne true quand les 4 secrets sont présents", () => {
      const { isTwitterConfigured } = require("@/lib/social/twitter-client");
      expect(isTwitterConfigured()).toBe(true);
    });

    it("retourne false quand TWITTER_ACCESS_SECRET manque", () => {
      delete process.env.TWITTER_ACCESS_SECRET;
      const { isTwitterConfigured } = require("@/lib/social/twitter-client");
      expect(isTwitterConfigured()).toBe(false);
    });

    it("retourne false quand TWITTER_API_KEY manque", () => {
      delete process.env.TWITTER_API_KEY;
      const { isTwitterConfigured } = require("@/lib/social/twitter-client");
      expect(isTwitterConfigured()).toBe(false);
    });
  });

  describe("postTweet", () => {
    it("publie un tweet et retourne l'ID", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: { id: "tweet-123", text: "Hello" } }),
      });

      const { postTweet } = require("@/lib/social/twitter-client");
      const id = await postTweet("Hello world");

      expect(id).toBe("tweet-123");
      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.twitter.com/2/tweets",
        expect.objectContaining({
          method: "POST",
          headers: expect.objectContaining({
            "Content-Type": "application/json",
          }),
          body: JSON.stringify({ text: "Hello world" }),
        }),
      );
    });

    it("rejette un tweet de plus de 280 caractères", async () => {
      const { postTweet } = require("@/lib/social/twitter-client");
      const longText = "x".repeat(281);
      await expect(postTweet(longText)).rejects.toThrow("trop long");
    });

    it("throw sur erreur API", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 403,
        text: async () => "Forbidden",
      });

      const { postTweet } = require("@/lib/social/twitter-client");
      await expect(postTweet("test")).rejects.toThrow("Twitter API error 403");
    });

    it("throw quand les credentials manquent", async () => {
      delete process.env.TWITTER_API_KEY;
      const { postTweet } = require("@/lib/social/twitter-client");
      await expect(postTweet("test")).rejects.toThrow("credentials manquantes");
    });
  });

  describe("postThread", () => {
    it("publie un thread de 3 tweets", async () => {
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ data: { id: "tweet-1", text: "Part 1" } }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ data: { id: "tweet-2", text: "Part 2" } }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ data: { id: "tweet-3", text: "Part 3" } }),
        });

      const { postThread } = require("@/lib/social/twitter-client");
      const firstId = await postThread(["Part 1", "Part 2", "Part 3"]);

      expect(firstId).toBe("tweet-1");
      expect(mockFetch).toHaveBeenCalledTimes(3);

      // Les 2e et 3e appels doivent inclure reply.in_reply_to_tweet_id
      const secondCallBody = JSON.parse(mockFetch.mock.calls[1][1].body);
      expect(secondCallBody.reply).toEqual({ in_reply_to_tweet_id: "tweet-1" });

      const thirdCallBody = JSON.parse(mockFetch.mock.calls[2][1].body);
      expect(thirdCallBody.reply).toEqual({ in_reply_to_tweet_id: "tweet-2" });
    });

    it("rejette un thread vide", async () => {
      const { postThread } = require("@/lib/social/twitter-client");
      await expect(postThread([])).rejects.toThrow("Thread vide");
    });
  });

  describe("getTweetMetrics", () => {
    it("retourne les métriques d'un tweet", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: {
            public_metrics: {
              impression_count: 1000,
              like_count: 50,
              retweet_count: 10,
              reply_count: 5,
            },
          },
        }),
      });

      const { getTweetMetrics } = require("@/lib/social/twitter-client");
      const metrics = await getTweetMetrics("tweet-123");

      expect(metrics).toEqual({
        impressions: 1000,
        likes: 50,
        retweets: 10,
        replies: 5,
        urlClicks: 0,
      });
    });

    it("throw sur erreur API metrics", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        text: async () => "Unauthorized",
      });

      const { getTweetMetrics } = require("@/lib/social/twitter-client");
      await expect(getTweetMetrics("tweet-123")).rejects.toThrow("401");
    });
  });
});

// ─── LinkedIn Client Tests ──────────────────────────────────────

describe("linkedin-client", () => {
  const ENV_BACKUP = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = {
      ...ENV_BACKUP,
      LINKEDIN_ACCESS_TOKEN: "test-linkedin-token",
      LINKEDIN_ORGANIZATION_ID: "987654321",
    };
    mockFetch.mockReset();
  });

  afterAll(() => {
    process.env = ENV_BACKUP;
  });

  describe("isLinkedInConfigured", () => {
    it("retourne true quand les 2 secrets sont présents", () => {
      const { isLinkedInConfigured } = require("@/lib/social/linkedin-client");
      expect(isLinkedInConfigured()).toBe(true);
    });

    it("retourne false quand LINKEDIN_ACCESS_TOKEN manque", () => {
      delete process.env.LINKEDIN_ACCESS_TOKEN;
      const { isLinkedInConfigured } = require("@/lib/social/linkedin-client");
      expect(isLinkedInConfigured()).toBe(false);
    });

    it("retourne false quand LINKEDIN_ORGANIZATION_ID manque", () => {
      delete process.env.LINKEDIN_ORGANIZATION_ID;
      const { isLinkedInConfigured } = require("@/lib/social/linkedin-client");
      expect(isLinkedInConfigured()).toBe(false);
    });
  });

  describe("postLinkedIn", () => {
    it("publie un post texte via la nouvelle Posts API", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: new Map([["x-restli-id", "urn:li:share:123"]]),
        json: async () => ({ id: "urn:li:share:123" }),
      });

      const { postLinkedIn } = require("@/lib/social/linkedin-client");
      const id = await postLinkedIn("Test post LinkedIn");

      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.linkedin.com/rest/posts",
        expect.objectContaining({
          method: "POST",
          headers: expect.objectContaining({
            Authorization: "Bearer test-linkedin-token",
            "LinkedIn-Version": "202401",
            "Content-Type": "application/json",
          }),
        }),
      );

      // Vérifie le body de la nouvelle Posts API
      const body = JSON.parse(mockFetch.mock.calls[0][1].body);
      expect(body.author).toBe("urn:li:organization:987654321");
      expect(body.commentary).toBe("Test post LinkedIn");
      expect(body.visibility).toBe("PUBLIC");
      expect(body.distribution).toBeDefined();
      expect(body.lifecycleState).toBe("PUBLISHED");
      // Vérifie qu'on n'utilise plus l'ancien format UGC
      expect(body.specificContent).toBeUndefined();
    });

    it("rejette un post de plus de 3000 caractères", async () => {
      const { postLinkedIn } = require("@/lib/social/linkedin-client");
      const longText = "x".repeat(3001);
      await expect(postLinkedIn(longText)).rejects.toThrow("trop long");
    });

    it("throw sur erreur 401 (token expiré)", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        text: async () => "Unauthorized",
      });

      const { postLinkedIn } = require("@/lib/social/linkedin-client");
      await expect(postLinkedIn("test")).rejects.toThrow("token expiré");
    });

    it("throw sur erreur 403 avec message diagnostic", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 403,
        text: async () => "Not enough permissions",
      });

      const { postLinkedIn } = require("@/lib/social/linkedin-client");
      await expect(postLinkedIn("test")).rejects.toThrow("accès refusé (403)");
    });

    it("throw quand les credentials manquent", async () => {
      delete process.env.LINKEDIN_ACCESS_TOKEN;
      const { postLinkedIn } = require("@/lib/social/linkedin-client");
      await expect(postLinkedIn("test")).rejects.toThrow("credentials manquantes");
    });

    it("construit l'URN automatiquement depuis l'ID numérique", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: new Map([["x-restli-id", "urn:li:share:456"]]),
        json: async () => ({ id: "urn:li:share:456" }),
      });

      const { postLinkedIn } = require("@/lib/social/linkedin-client");
      await postLinkedIn("Test");

      const body = JSON.parse(mockFetch.mock.calls[0][1].body);
      expect(body.author).toBe("urn:li:organization:987654321");
    });

    it("accepte un URN complet comme LINKEDIN_ORGANIZATION_ID", async () => {
      process.env.LINKEDIN_ORGANIZATION_ID = "urn:li:organization:111222333";

      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: new Map([["x-restli-id", "urn:li:share:789"]]),
        json: async () => ({ id: "urn:li:share:789" }),
      });

      const { postLinkedIn } = require("@/lib/social/linkedin-client");
      await postLinkedIn("Test URN");

      const body = JSON.parse(mockFetch.mock.calls[0][1].body);
      expect(body.author).toBe("urn:li:organization:111222333");
    });
  });

  describe("postLinkedInWithLink", () => {
    it("publie un post avec lien article via la nouvelle Posts API", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: new Map([["x-restli-id", "urn:li:share:link-post"]]),
        json: async () => ({ id: "urn:li:share:link-post" }),
      });

      const { postLinkedInWithLink } = require("@/lib/social/linkedin-client");
      await postLinkedInWithLink(
        "Check this article!",
        "https://deviens-marrant.fr/blog/test",
        "Mon titre",
        "Ma description",
      );

      const body = JSON.parse(mockFetch.mock.calls[0][1].body);
      expect(body.content.article.source).toBe("https://deviens-marrant.fr/blog/test");
      expect(body.content.article.title).toBe("Mon titre");
      expect(body.content.article.description).toBe("Ma description");
      // Vérifie qu'on n'utilise plus l'ancien format UGC
      expect(body.specificContent).toBeUndefined();
    });
  });

  describe("getLinkedInMetrics", () => {
    it("retourne les métriques d'un post", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          likesSummary: { totalLikes: 25 },
          commentsSummary: { totalFirstLevelComments: 3 },
        }),
      });

      const { getLinkedInMetrics } = require("@/lib/social/linkedin-client");
      const metrics = await getLinkedInMetrics("urn:li:share:123");

      expect(metrics).toEqual({
        impressions: 0,
        likes: 25,
        comments: 3,
        shares: 0,
        clicks: 0,
      });
    });

    it("retourne des zéros sur erreur API", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      const { getLinkedInMetrics } = require("@/lib/social/linkedin-client");
      const metrics = await getLinkedInMetrics("urn:li:share:123");

      expect(metrics).toEqual({
        impressions: 0,
        likes: 0,
        comments: 0,
        shares: 0,
        clicks: 0,
      });
    });
  });
});
