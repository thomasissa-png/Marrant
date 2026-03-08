import { getVideoDetails, getEmbedUrl, getThumbnailUrl } from "@/lib/youtube";

describe("getEmbedUrl", () => {
  it("returns correct embed URL", () => {
    expect(getEmbedUrl("abc123")).toBe("https://www.youtube.com/embed/abc123");
  });

  it("encodes special characters in videoId", () => {
    expect(getEmbedUrl("a&b=c")).toBe(
      `https://www.youtube.com/embed/${encodeURIComponent("a&b=c")}`
    );
  });
});

describe("getThumbnailUrl", () => {
  it("returns high quality by default", () => {
    expect(getThumbnailUrl("abc123")).toBe(
      "https://img.youtube.com/vi/abc123/hqdefault.jpg"
    );
  });

  it("returns default quality", () => {
    expect(getThumbnailUrl("abc123", "default")).toBe(
      "https://img.youtube.com/vi/abc123/default.jpg"
    );
  });

  it("returns medium quality", () => {
    expect(getThumbnailUrl("abc123", "medium")).toBe(
      "https://img.youtube.com/vi/abc123/mqdefault.jpg"
    );
  });

  it("returns maxres quality", () => {
    expect(getThumbnailUrl("abc123", "maxres")).toBe(
      "https://img.youtube.com/vi/abc123/maxresdefault.jpg"
    );
  });

  it("encodes special characters", () => {
    expect(getThumbnailUrl("a/b")).toContain(encodeURIComponent("a/b"));
  });
});

describe("getVideoDetails", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
    global.fetch = jest.fn();
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("returns null when YOUTUBE_API_KEY is not set", async () => {
    delete process.env.YOUTUBE_API_KEY;
    const result = await getVideoDetails("abc");
    expect(result).toBeNull();
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("calls YouTube API with correct URL", async () => {
    process.env.YOUTUBE_API_KEY = "test-key";
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        items: [
          {
            id: "abc",
            snippet: {
              title: "Test Video",
              channelTitle: "Test Channel",
              description: "A description",
              thumbnails: { high: { url: "https://thumb.jpg" } },
            },
            contentDetails: { duration: "PT5M30S" },
          },
        ],
      }),
    });

    await getVideoDetails("abc");
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("id=abc&key=test-key")
    );
  });

  it("returns parsed video details", async () => {
    process.env.YOUTUBE_API_KEY = "test-key";
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        items: [
          {
            id: "abc",
            snippet: {
              title: "Test Video",
              channelTitle: "Test Channel",
              description: "Desc",
              thumbnails: { high: { url: "https://thumb.jpg" } },
            },
            contentDetails: { duration: "PT5M30S" },
          },
        ],
      }),
    });

    const result = await getVideoDetails("abc");
    expect(result).toEqual({
      id: "abc",
      title: "Test Video",
      channelName: "Test Channel",
      duration: "PT5M30S",
      thumbnailUrl: "https://thumb.jpg",
      description: "Desc",
    });
  });

  it("returns null on API error", async () => {
    process.env.YOUTUBE_API_KEY = "test-key";
    (global.fetch as jest.Mock).mockResolvedValue({ ok: false, status: 403 });
    const result = await getVideoDetails("abc");
    expect(result).toBeNull();
  });

  it("returns null when no items returned", async () => {
    process.env.YOUTUBE_API_KEY = "test-key";
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ items: [] }),
    });
    const result = await getVideoDetails("abc");
    expect(result).toBeNull();
  });
});
