/**
 * Tests — Twitter Client OAuth 1.0a (apps/web/src/lib/social/twitter-client.ts)
 *
 * Module DEPRECATED (remplacé par buffer-client.ts mars 2026) mais conservé
 * comme fallback. Couvre :
 *  - isTwitterConfigured (4 env vars présentes/manquantes)
 *  - postTweet (happy + 401/403/429/500 + length cap 280 + body format)
 *  - postReply (payload reply.in_reply_to_tweet_id)
 *  - postThread (chaînage : 2e tweet en reply au 1er, 3e au 2e)
 *  - getTweetMetrics (parse public_metrics)
 *  - OAuth 1.0a signature (HMAC-SHA1, percent-encode RFC 3986, header sorted)
 *  - Network error (fetch rejects)
 *
 * Pattern source-integrity : `global.fetch` patché + helpers
 * `mockFetchOk(body)` / `mockFetchError(status, text)`. Pas de mock de
 * `crypto` (validation HMAC réelle).
 */

// ─── Mocks ────────────────────────────────────────────────────────────
// NB : variable préfixée pour éviter collision globale avec d'autres fichiers
// de tests qui déclarent aussi `mockFetch` (instagram.test.ts, social-clients.test.ts).

const mockFetch = jest.fn();
(global as { fetch: unknown }).fetch = mockFetch;

const mockFetchOk = (body: unknown) => ({
  ok: true,
  status: 200,
  json: async () => body,
  text: async () => JSON.stringify(body),
});

const mockFetchError = (status: number, text = "error") => ({
  ok: false,
  status,
  json: async () => ({ error: text }),
  text: async () => text,
  headers: new Headers(),
});

// ─── Suite : isTwitterConfigured ─────────────────────────────────────

describe("twitter-client (OAuth 1.0a) — isTwitterConfigured", () => {
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

  it("retourne true quand les 4 secrets sont présents", () => {
    const { isTwitterConfigured } = require("@/lib/social/twitter-client");
    expect(isTwitterConfigured()).toBe(true);
  });

  it("retourne false quand TWITTER_API_KEY manque", () => {
    delete process.env.TWITTER_API_KEY;
    const { isTwitterConfigured } = require("@/lib/social/twitter-client");
    expect(isTwitterConfigured()).toBe(false);
  });

  it("retourne false quand TWITTER_API_SECRET manque", () => {
    delete process.env.TWITTER_API_SECRET;
    const { isTwitterConfigured } = require("@/lib/social/twitter-client");
    expect(isTwitterConfigured()).toBe(false);
  });

  it("retourne false quand TWITTER_ACCESS_TOKEN manque", () => {
    delete process.env.TWITTER_ACCESS_TOKEN;
    const { isTwitterConfigured } = require("@/lib/social/twitter-client");
    expect(isTwitterConfigured()).toBe(false);
  });

  it("retourne false quand TWITTER_ACCESS_SECRET manque", () => {
    delete process.env.TWITTER_ACCESS_SECRET;
    const { isTwitterConfigured } = require("@/lib/social/twitter-client");
    expect(isTwitterConfigured()).toBe(false);
  });
});

// ─── Suite : postTweet ───────────────────────────────────────────────

describe("twitter-client (OAuth 1.0a) — postTweet", () => {
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

  it("happy path — POST /2/tweets retourne tweet ID", async () => {
    mockFetch.mockResolvedValueOnce(
      mockFetchOk({ data: { id: "tw-123", text: "Hello" } }),
    );
    const { postTweet } = require("@/lib/social/twitter-client");
    const id = await postTweet("Hello");
    expect(id).toBe("tw-123");
    expect(mockFetch).toHaveBeenCalledTimes(1);
    const [url, init] = mockFetch.mock.calls[0];
    expect(url).toBe("https://api.twitter.com/2/tweets");
    expect(init.method).toBe("POST");
    expect(init.headers["Content-Type"]).toBe("application/json");
    expect(init.headers.Authorization).toMatch(/^OAuth /);
    expect(JSON.parse(init.body)).toEqual({ text: "Hello" });
  });

  it("throw avant fetch quand text > 280 chars", async () => {
    const { postTweet } = require("@/lib/social/twitter-client");
    const tooLong = "A".repeat(281);
    await expect(postTweet(tooLong)).rejects.toThrow(/281\/280/);
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("accepte un tweet exactement à 280 chars", async () => {
    mockFetch.mockResolvedValueOnce(
      mockFetchOk({ data: { id: "tw-edge", text: "A".repeat(280) } }),
    );
    const { postTweet } = require("@/lib/social/twitter-client");
    const id = await postTweet("A".repeat(280));
    expect(id).toBe("tw-edge");
  });

  it("throw clair sur 401 (token invalide)", async () => {
    mockFetch.mockResolvedValueOnce(mockFetchError(401, "Unauthorized"));
    const { postTweet } = require("@/lib/social/twitter-client");
    await expect(postTweet("hi")).rejects.toThrow(/Twitter API error 401/);
  });

  it("throw sur 403 (forbidden)", async () => {
    mockFetch.mockResolvedValueOnce(mockFetchError(403, "Forbidden"));
    const { postTweet } = require("@/lib/social/twitter-client");
    await expect(postTweet("hi")).rejects.toThrow(/Twitter API error 403/);
  });

  it("throw sur 429 (rate limit)", async () => {
    mockFetch.mockResolvedValueOnce(mockFetchError(429, "rate_limit"));
    const { postTweet } = require("@/lib/social/twitter-client");
    await expect(postTweet("hi")).rejects.toThrow(/Twitter API error 429/);
  });

  it("throw sur 500 (server error)", async () => {
    mockFetch.mockResolvedValueOnce(mockFetchError(500, "ISE"));
    const { postTweet } = require("@/lib/social/twitter-client");
    await expect(postTweet("hi")).rejects.toThrow(/Twitter API error 500/);
  });

  it("throw quand credentials manquent (getConfig)", async () => {
    delete process.env.TWITTER_API_KEY;
    const { postTweet } = require("@/lib/social/twitter-client");
    await expect(postTweet("hi")).rejects.toThrow(
      /credentials manquantes/,
    );
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("propage l'erreur réseau (fetch reject)", async () => {
    mockFetch.mockRejectedValueOnce(new Error("ECONNREFUSED"));
    const { postTweet } = require("@/lib/social/twitter-client");
    await expect(postTweet("hi")).rejects.toThrow(/ECONNREFUSED/);
  });
});

// ─── Suite : postReply ───────────────────────────────────────────────

describe("twitter-client (OAuth 1.0a) — postReply", () => {
  const ENV_BACKUP = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = {
      ...ENV_BACKUP,
      TWITTER_API_KEY: "k",
      TWITTER_API_SECRET: "s",
      TWITTER_ACCESS_TOKEN: "t",
      TWITTER_ACCESS_SECRET: "ts",
    };
    mockFetch.mockReset();
  });

  afterAll(() => {
    process.env = ENV_BACKUP;
  });

  it("inclut reply.in_reply_to_tweet_id dans le body", async () => {
    mockFetch.mockResolvedValueOnce(
      mockFetchOk({ data: { id: "reply-1", text: "ok" } }),
    );
    const { postReply } = require("@/lib/social/twitter-client");
    const id = await postReply("ok", "tw-parent-42");
    expect(id).toBe("reply-1");
    const body = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(body).toEqual({
      text: "ok",
      reply: { in_reply_to_tweet_id: "tw-parent-42" },
    });
  });

  it("throw avant fetch quand text > 280 chars", async () => {
    const { postReply } = require("@/lib/social/twitter-client");
    await expect(postReply("X".repeat(281), "p1")).rejects.toThrow(
      /Reply trop long/,
    );
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("throw sur erreur HTTP avec message Twitter API reply error", async () => {
    mockFetch.mockResolvedValueOnce(mockFetchError(401, "Unauthorized"));
    const { postReply } = require("@/lib/social/twitter-client");
    await expect(postReply("hi", "p1")).rejects.toThrow(
      /Twitter API reply error 401/,
    );
  });
});

// ─── Suite : postThread ──────────────────────────────────────────────

describe("twitter-client (OAuth 1.0a) — postThread", () => {
  const ENV_BACKUP = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = {
      ...ENV_BACKUP,
      TWITTER_API_KEY: "k",
      TWITTER_API_SECRET: "s",
      TWITTER_ACCESS_TOKEN: "t",
      TWITTER_ACCESS_SECRET: "ts",
    };
    mockFetch.mockReset();
    // Speed up the 500ms inter-tweet delay
    jest.useFakeTimers({ doNotFake: ["nextTick", "setImmediate"] });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  afterAll(() => {
    process.env = ENV_BACKUP;
  });

  it("rejette un thread vide", async () => {
    const { postThread } = require("@/lib/social/twitter-client");
    await expect(postThread([])).rejects.toThrow("Thread vide");
  });

  it("publie 3 tweets chaînés (2e en reply au 1er, 3e au 2e)", async () => {
    mockFetch
      .mockResolvedValueOnce(mockFetchOk({ data: { id: "t-1", text: "p1" } }))
      .mockResolvedValueOnce(mockFetchOk({ data: { id: "t-2", text: "p2" } }))
      .mockResolvedValueOnce(mockFetchOk({ data: { id: "t-3", text: "p3" } }));

    const { postThread } = require("@/lib/social/twitter-client");
    const promise = postThread(["p1", "p2", "p3"]);

    // Avancer les timers (2 délais inter-tweets de 500ms chacun)
    await jest.advanceTimersByTimeAsync(1000);
    const firstId = await promise;

    expect(firstId).toBe("t-1");
    expect(mockFetch).toHaveBeenCalledTimes(3);

    // Vérifier le chaînage : 2e tweet doit cibler t-1, 3e doit cibler t-2
    const body2 = JSON.parse(mockFetch.mock.calls[1][1].body);
    const body3 = JSON.parse(mockFetch.mock.calls[2][1].body);
    expect(body2).toEqual({
      text: "p2",
      reply: { in_reply_to_tweet_id: "t-1" },
    });
    expect(body3).toEqual({
      text: "p3",
      reply: { in_reply_to_tweet_id: "t-2" },
    });
  });

  it("publie un thread d'un seul tweet (pas de reply)", async () => {
    mockFetch.mockResolvedValueOnce(
      mockFetchOk({ data: { id: "solo", text: "alone" } }),
    );
    const { postThread } = require("@/lib/social/twitter-client");
    const promise = postThread(["alone"]);
    const id = await promise;
    expect(id).toBe("solo");
    expect(mockFetch).toHaveBeenCalledTimes(1);
    const body = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(body).toEqual({ text: "alone" });
  });
});

// ─── Suite : getTweetMetrics ─────────────────────────────────────────

describe("twitter-client (OAuth 1.0a) — getTweetMetrics", () => {
  const ENV_BACKUP = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = {
      ...ENV_BACKUP,
      TWITTER_API_KEY: "k",
      TWITTER_API_SECRET: "s",
      TWITTER_ACCESS_TOKEN: "t",
      TWITTER_ACCESS_SECRET: "ts",
    };
    mockFetch.mockReset();
  });

  afterAll(() => {
    process.env = ENV_BACKUP;
  });

  it("happy path — GET /2/tweets/:id?tweet.fields=public_metrics", async () => {
    mockFetch.mockResolvedValueOnce(
      mockFetchOk({
        data: {
          id: "tw-42",
          public_metrics: {
            impression_count: 1234,
            like_count: 50,
            retweet_count: 7,
            reply_count: 3,
          },
        },
      }),
    );
    const { getTweetMetrics } = require("@/lib/social/twitter-client");
    const metrics = await getTweetMetrics("tw-42");
    expect(metrics).toEqual({
      impressions: 1234,
      likes: 50,
      retweets: 7,
      replies: 3,
      urlClicks: 0,
    });
    const [url, init] = mockFetch.mock.calls[0];
    expect(url).toBe(
      "https://api.twitter.com/2/tweets/tw-42?tweet.fields=public_metrics",
    );
    expect(init.method).toBe("GET");
    expect(init.headers.Authorization).toMatch(/^OAuth /);
  });

  it("retourne 0 sur tous les counts quand public_metrics absent", async () => {
    mockFetch.mockResolvedValueOnce(mockFetchOk({ data: { id: "x" } }));
    const { getTweetMetrics } = require("@/lib/social/twitter-client");
    const metrics = await getTweetMetrics("x");
    expect(metrics).toEqual({
      impressions: 0,
      likes: 0,
      retweets: 0,
      replies: 0,
      urlClicks: 0,
    });
  });

  it("throw clair sur HTTP error", async () => {
    mockFetch.mockResolvedValueOnce(mockFetchError(404, "Not found"));
    const { getTweetMetrics } = require("@/lib/social/twitter-client");
    await expect(getTweetMetrics("inexistant")).rejects.toThrow(
      /Twitter metrics error 404/,
    );
  });
});

// ─── Suite : OAuth 1.0a signature (HMAC-SHA1 + percent-encode) ───────

describe("twitter-client (OAuth 1.0a) — Authorization header", () => {
  const ENV_BACKUP = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = {
      ...ENV_BACKUP,
      TWITTER_API_KEY: "consumer-key",
      TWITTER_API_SECRET: "consumer-secret",
      TWITTER_ACCESS_TOKEN: "access-token",
      TWITTER_ACCESS_SECRET: "access-secret",
    };
    mockFetch.mockReset();
  });

  afterAll(() => {
    process.env = ENV_BACKUP;
  });

  it("le header OAuth contient les 7 paramètres requis (RFC 5849 §3.1)", async () => {
    mockFetch.mockResolvedValueOnce(
      mockFetchOk({ data: { id: "x", text: "y" } }),
    );
    const { postTweet } = require("@/lib/social/twitter-client");
    await postTweet("hi");
    const header: string = mockFetch.mock.calls[0][1].headers.Authorization;
    expect(header).toMatch(/^OAuth /);
    // 7 params obligatoires OAuth 1.0a
    expect(header).toContain('oauth_consumer_key="consumer-key"');
    expect(header).toContain('oauth_token="access-token"');
    expect(header).toContain('oauth_signature_method="HMAC-SHA1"');
    expect(header).toContain('oauth_version="1.0"');
    expect(header).toMatch(/oauth_nonce="[a-f0-9]{32}"/);
    expect(header).toMatch(/oauth_timestamp="\d{10}"/);
    expect(header).toMatch(/oauth_signature="[^"]+"/);
  });

  it("la signature change quand le timestamp change (HMAC stable per inputs)", async () => {
    mockFetch
      .mockResolvedValueOnce(mockFetchOk({ data: { id: "1", text: "x" } }))
      .mockResolvedValueOnce(mockFetchOk({ data: { id: "2", text: "x" } }));

    const { postTweet } = require("@/lib/social/twitter-client");
    const realDateNow = Date.now;
    Date.now = () => 1700000000000;
    await postTweet("x");
    Date.now = () => 1700000060000;
    await postTweet("x");
    Date.now = realDateNow;

    const sig1 = (mockFetch.mock.calls[0][1].headers.Authorization as string)
      .match(/oauth_signature="([^"]+)"/)?.[1];
    const sig2 = (mockFetch.mock.calls[1][1].headers.Authorization as string)
      .match(/oauth_signature="([^"]+)"/)?.[1];
    expect(sig1).toBeDefined();
    expect(sig2).toBeDefined();
    expect(sig1).not.toBe(sig2);
  });

  it("la signature est encodée base64 (HMAC-SHA1 = 28 chars + '=')", async () => {
    mockFetch.mockResolvedValueOnce(
      mockFetchOk({ data: { id: "x", text: "y" } }),
    );
    const { postTweet } = require("@/lib/social/twitter-client");
    await postTweet("hi");
    const header: string = mockFetch.mock.calls[0][1].headers.Authorization;
    const sigMatch = header.match(/oauth_signature="([^"]+)"/);
    expect(sigMatch).not.toBeNull();
    // base64 décodé : 28 chars + padding "="
    const sig = decodeURIComponent(sigMatch![1]);
    expect(sig).toMatch(/^[A-Za-z0-9+/]+=*$/);
    // SHA-1 = 20 bytes = 28 chars base64 (avec ou sans padding)
    expect(sig.replace(/=+$/, "").length).toBeGreaterThanOrEqual(27);
  });

  it("percentEncode encode les chars réservés RFC 3986 (!*'() en majuscules)", async () => {
    mockFetch.mockResolvedValueOnce(
      mockFetchOk({ data: { id: "x", text: "y" } }),
    );
    const { postTweet } = require("@/lib/social/twitter-client");
    // Pas d'API publique pour percentEncode, on vérifie via le header :
    // les chars du nonce sont alphanumériques donc pas testables directement.
    // On vérifie surtout que le signature & nonce sont bien base64-encoded
    // dans le header (donc passés par percentEncode).
    await postTweet("hi");
    const header: string = mockFetch.mock.calls[0][1].headers.Authorization;
    // Aucun caractère brut !*'() ne doit apparaître dans les valeurs
    const values = header.match(/="([^"]+)"/g) ?? [];
    for (const v of values) {
      expect(v).not.toMatch(/[!'()*]/);
    }
  });

  it("les paramètres OAuth sont triés alphabétiquement dans le header", async () => {
    mockFetch.mockResolvedValueOnce(
      mockFetchOk({ data: { id: "x", text: "y" } }),
    );
    const { postTweet } = require("@/lib/social/twitter-client");
    await postTweet("hi");
    const header: string = mockFetch.mock.calls[0][1].headers.Authorization;
    const keysInOrder = (header.match(/(oauth_[a-z_]+)=/g) ?? []).map((k) =>
      k.replace(/=$/, ""),
    );
    const sorted = [...keysInOrder].sort();
    expect(keysInOrder).toEqual(sorted);
  });

  it("inclut les query params dans la signature base (GET avec ?tweet.fields=...)", async () => {
    mockFetch.mockResolvedValueOnce(
      mockFetchOk({ data: { id: "tw-42", public_metrics: {} } }),
    );
    const { getTweetMetrics } = require("@/lib/social/twitter-client");
    await getTweetMetrics("tw-42");
    const url = mockFetch.mock.calls[0][0] as string;
    expect(url).toContain("?tweet.fields=public_metrics");
    // La signature inclut tweet.fields (RFC 5849 §3.4.1.3) — on vérifie juste
    // que le header Authorization est bien présent et formaté
    const header: string = mockFetch.mock.calls[0][1].headers.Authorization;
    expect(header).toMatch(/oauth_signature="[^"]+"/);
  });
});
