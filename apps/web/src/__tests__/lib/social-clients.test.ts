/**
 * Tests — Buffer Social Client (remplace Twitter/LinkedIn/Instagram directs)
 */

// ─── Mocks ───────────────────────────────────────────────────────

const mockFetch = jest.fn();
global.fetch = mockFetch;

/** Mock response for quota check (getBufferQueueCount) — returns 0 posts in queue */
const mockQuotaCheckResponse = () => ({
  ok: true,
  json: async () => ({
    data: {
      posts: { edges: [] },
    },
  }),
});

// ─── Buffer Client Tests ────────────────────────────────────────

describe("buffer-client", () => {
  const ENV_BACKUP = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = {
      ...ENV_BACKUP,
      BUFFER_ACCESS_TOKEN: "test-buffer-token",
      BUFFER_ORGANIZATION_ID: "org-123",
      BUFFER_CHANNEL_TWITTER: "ch-twitter-456",
      BUFFER_CHANNEL_LINKEDIN: "ch-linkedin-789",
      BUFFER_CHANNEL_INSTAGRAM: "ch-instagram-012",
    };
    mockFetch.mockReset();
  });

  afterAll(() => {
    process.env = ENV_BACKUP;
  });

  describe("isBufferConfigured", () => {
    it("retourne true quand token et org ID sont présents", () => {
      const { isBufferConfigured } = require("@/lib/social/buffer-client");
      expect(isBufferConfigured()).toBe(true);
    });

    it("retourne false quand BUFFER_ACCESS_TOKEN manque", () => {
      delete process.env.BUFFER_ACCESS_TOKEN;
      const { isBufferConfigured } = require("@/lib/social/buffer-client");
      expect(isBufferConfigured()).toBe(false);
    });

    it("retourne false quand BUFFER_ORGANIZATION_ID manque", () => {
      delete process.env.BUFFER_ORGANIZATION_ID;
      const { isBufferConfigured } = require("@/lib/social/buffer-client");
      expect(isBufferConfigured()).toBe(false);
    });
  });

  describe("isChannelConfigured", () => {
    it("retourne true pour TWITTER quand le channel est configuré", () => {
      const { isChannelConfigured } = require("@/lib/social/buffer-client");
      expect(isChannelConfigured("TWITTER")).toBe(true);
    });

    it("retourne true pour LINKEDIN quand le channel est configuré", () => {
      const { isChannelConfigured } = require("@/lib/social/buffer-client");
      expect(isChannelConfigured("LINKEDIN")).toBe(true);
    });

    it("retourne true pour INSTAGRAM quand le channel est configuré", () => {
      const { isChannelConfigured } = require("@/lib/social/buffer-client");
      expect(isChannelConfigured("INSTAGRAM")).toBe(true);
    });

    it("retourne false quand le channel manque", () => {
      delete process.env.BUFFER_CHANNEL_TWITTER;
      const { isChannelConfigured } = require("@/lib/social/buffer-client");
      expect(isChannelConfigured("TWITTER")).toBe(false);
    });
  });

  describe("createBufferPost", () => {
    it("envoie un post texte Twitter via GraphQL", async () => {
      mockFetch
        .mockResolvedValueOnce(mockQuotaCheckResponse()) // quota check
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            data: {
              createPost: {
                post: { id: "buffer-post-123", text: "Hello Twitter!" },
              },
            },
          }),
        });

      const { createBufferPost } = require("@/lib/social/buffer-client");
      const id = await createBufferPost("TWITTER", "Hello Twitter!", new Date("2026-03-20T12:00:00Z"));

      expect(id).toBe("buffer-post-123");
      // Second call is the actual post (first is quota check)
      expect(mockFetch).toHaveBeenCalledTimes(2);

      const body = JSON.parse(mockFetch.mock.calls[1][1].body);
      expect(body.query).toContain("ch-twitter-456");
      expect(body.query).toContain("Hello Twitter!");
    });

    it("envoie un post LinkedIn via GraphQL", async () => {
      mockFetch
        .mockResolvedValueOnce(mockQuotaCheckResponse()) // quota check
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            data: {
              createPost: {
                post: { id: "buffer-li-456", text: "Hello LinkedIn!" },
              },
            },
          }),
        });

      const { createBufferPost } = require("@/lib/social/buffer-client");
      const id = await createBufferPost("LINKEDIN", "Hello LinkedIn!");

      expect(id).toBe("buffer-li-456");

      const body = JSON.parse(mockFetch.mock.calls[1][1].body);
      expect(body.query).toContain("ch-linkedin-789");
    });

    it("throw quand le channel n'est pas configuré", async () => {
      delete process.env.BUFFER_CHANNEL_TWITTER;
      const { createBufferPost } = require("@/lib/social/buffer-client");
      await expect(createBufferPost("TWITTER", "test")).rejects.toThrow(
        "Channel Buffer non configuré pour TWITTER",
      );
    });

    it("throw quand les credentials manquent", async () => {
      delete process.env.BUFFER_ACCESS_TOKEN;
      const { createBufferPost } = require("@/lib/social/buffer-client");
      await expect(createBufferPost("TWITTER", "test")).rejects.toThrow(
        "credentials manquantes",
      );
    });

    it("throw sur erreur 401 (token invalide)", async () => {
      mockFetch
        .mockResolvedValueOnce(mockQuotaCheckResponse()) // quota check
        .mockResolvedValueOnce({
          ok: false,
          status: 401,
          text: async () => "Unauthorized",
        });

      const { createBufferPost } = require("@/lib/social/buffer-client");
      await expect(createBufferPost("TWITTER", "test")).rejects.toThrow(
        "token invalide (401)",
      );
    });

    it("throw sur erreur 403 (permissions)", async () => {
      mockFetch
        .mockResolvedValueOnce(mockQuotaCheckResponse()) // quota check
        .mockResolvedValueOnce({
          ok: false,
          status: 403,
          text: async () => "Forbidden",
        });

      const { createBufferPost } = require("@/lib/social/buffer-client");
      await expect(createBufferPost("TWITTER", "test")).rejects.toThrow(
        "accès refusé (403)",
      );
    });

    it("throw sur MutationError dans la réponse GraphQL", async () => {
      mockFetch
        .mockResolvedValueOnce(mockQuotaCheckResponse()) // quota check
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            data: {
              createPost: {
                message: "Post content too long for this channel",
              },
            },
          }),
        });

      const { createBufferPost } = require("@/lib/social/buffer-client");
      await expect(createBufferPost("TWITTER", "test")).rejects.toThrow(
        "Post content too long",
      );
    });

    it("throw sur erreurs GraphQL dans la réponse", async () => {
      mockFetch
        .mockResolvedValueOnce(mockQuotaCheckResponse()) // quota check
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            errors: [{ message: "Invalid channel ID" }],
          }),
        });

      const { createBufferPost } = require("@/lib/social/buffer-client");
      await expect(createBufferPost("TWITTER", "test")).rejects.toThrow(
        "Invalid channel ID",
      );
    });

    it("throw BufferQueueFullError quand la queue est pleine", async () => {
      // 10 posts déjà dans la queue
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: {
            posts: {
              edges: Array.from({ length: 10 }, (_, i) => ({ node: { id: `p${i}` } })),
            },
          },
        }),
      });

      const { createBufferPost, BufferQueueFullError } = require("@/lib/social/buffer-client");
      await expect(createBufferPost("TWITTER", "test")).rejects.toThrow(BufferQueueFullError);
    });
  });

  describe("createBufferImagePost", () => {
    it("envoie un post avec image pour Instagram", async () => {
      mockFetch
        .mockResolvedValueOnce(mockQuotaCheckResponse()) // quota check
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            data: {
              createPost: {
                post: {
                  id: "buffer-ig-789",
                  text: "Instagram post",
                  assets: [{ id: "asset-1", mimeType: "image/png" }],
                },
              },
            },
          }),
        });

      const { createBufferImagePost } = require("@/lib/social/buffer-client");
      const id = await createBufferImagePost(
        "INSTAGRAM",
        "Instagram post",
        "https://deviens-marrant.fr/api/social/image?postId=123",
      );

      expect(id).toBe("buffer-ig-789");

      const body = JSON.parse(mockFetch.mock.calls[1][1].body);
      expect(body.query).toContain("ch-instagram-012");
      expect(body.query).toContain("images");
      expect(body.query).toContain("deviens-marrant.fr");
    });

    it("ajoute les hashtags en fin de texte pour Instagram", async () => {
      mockFetch
        .mockResolvedValueOnce(mockQuotaCheckResponse()) // quota check
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            data: {
              createPost: {
                post: {
                  id: "buffer-ig-fc",
                  text: "Post avec hashtags\n\n#standup #humour #comedy",
                  assets: [{ id: "asset-1", mimeType: "image/png" }],
                },
              },
            },
          }),
        });

      const { createBufferImagePost } = require("@/lib/social/buffer-client");
      const id = await createBufferImagePost(
        "INSTAGRAM",
        "Post avec hashtags",
        "https://deviens-marrant.fr/api/social/image?postId=456",
        undefined,
        "#standup #humour #comedy",
      );

      expect(id).toBe("buffer-ig-fc");

      const body = JSON.parse(mockFetch.mock.calls[1][1].body);
      // Hashtags should be in the text, not as firstComment
      expect(body.query).not.toContain("firstComment");
      expect(body.query).toContain("#standup #humour #comedy");
    });

    it("n'ajoute pas de hashtags quand non fournis", async () => {
      mockFetch
        .mockResolvedValueOnce(mockQuotaCheckResponse()) // quota check
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            data: {
              createPost: {
                post: {
                  id: "buffer-ig-no-fc",
                  text: "Sans hashtags",
                  assets: [],
                },
              },
            },
          }),
        });

      const { createBufferImagePost } = require("@/lib/social/buffer-client");
      await createBufferImagePost(
        "INSTAGRAM",
        "Sans hashtags",
        "https://deviens-marrant.fr/api/social/image?postId=789",
      );

      const body = JSON.parse(mockFetch.mock.calls[1][1].body);
      expect(body.query).not.toContain("firstComment");
    });
  });

  describe("createBufferThread", () => {
    it("publie chaque partie du thread séparément", async () => {
      // 1 quota check + 3 tweets = 4 appels API
      mockFetch
        .mockResolvedValueOnce(mockQuotaCheckResponse()) // quota check for 3 slots
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            data: { createPost: { post: { id: "thread-1", text: "Part 1" } } },
          }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            data: { createPost: { post: { id: "thread-2", text: "Part 2" } } },
          }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            data: { createPost: { post: { id: "thread-3", text: "Part 3" } } },
          }),
        });

      const { createBufferThread } = require("@/lib/social/buffer-client");
      const firstId = await createBufferThread(["Part 1", "Part 2", "Part 3"]);

      expect(firstId).toBe("thread-1");
      expect(mockFetch).toHaveBeenCalledTimes(4); // 1 quota + 3 posts
    });

    it("rejette un thread vide", async () => {
      const { createBufferThread } = require("@/lib/social/buffer-client");
      await expect(createBufferThread([])).rejects.toThrow("Thread vide");
    });
  });

  describe("getBufferChannels", () => {
    it("retourne la liste des channels", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: {
            channels: [
              {
                id: "ch-1",
                name: "deviens-marrant",
                displayName: "Deviens Marrant",
                service: "twitter",
                avatar: "https://...",
                isQueuePaused: false,
              },
              {
                id: "ch-2",
                name: "deviens-marrant-linkedin",
                displayName: "Deviens Marrant",
                service: "linkedin",
                avatar: "https://...",
                isQueuePaused: false,
              },
            ],
          },
        }),
      });

      const { getBufferChannels } = require("@/lib/social/buffer-client");
      const channels = await getBufferChannels();

      expect(channels).toHaveLength(2);
      expect(channels[0].service).toBe("twitter");
      expect(channels[1].service).toBe("linkedin");
    });
  });

  describe("getBufferScheduledPosts", () => {
    it("retourne les posts en attente de publication", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: {
            posts: {
              edges: [
                { node: { id: "p1", text: "Post 1", createdAt: "2026-03-20" } },
                { node: { id: "p2", text: "Post 2", createdAt: "2026-03-20" } },
              ],
            },
          },
        }),
      });

      const { getBufferScheduledPosts } = require("@/lib/social/buffer-client");
      const posts = await getBufferScheduledPosts();

      expect(posts).toHaveLength(2);
      expect(posts[0].id).toBe("p1");
    });
  });
});
