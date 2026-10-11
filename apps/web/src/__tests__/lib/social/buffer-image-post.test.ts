/**
 * @jest-environment node
 *
 * Tests — mutation Buffer `createPost` avec image (Instagram), s14.
 *
 * Cause prouvée des 41 échecs Instagram : la mutation envoyait
 * `assets: { images: [...] }` ; Buffer répondait
 * `Field "images" is not defined by type "AssetInput". Did you mean "image"?`.
 * Schéma officiel (developers.buffer.com/types/AssetInput.html) : `assets` est une
 * liste d'`AssetInput`, chacun portant exactement une variante (`image`, `video`,
 * `document`) ; `ImageAssetInput.url: String!`.
 *
 * Aucun appel réseau réel : `global.fetch` est mocké.
 */

const bufferFetch = jest.fn();
(global as { fetch: unknown }).fetch = bufferFetch;

import {
  createBufferImagePost,
  createBufferPost,
  getBufferFinishedPosts,
  getBufferPostStatus,
  MAX_CAROUSEL_IMAGES,
} from "@/lib/social/buffer-client";

function okJson(body: unknown) {
  return { ok: true, status: 200, json: async () => body, text: async () => JSON.stringify(body) };
}

function sentQueries(): string[] {
  return bufferFetch.mock.calls.map(
    (call) => (JSON.parse((call[1] as { body: string }).body) as { query: string }).query,
  );
}

describe("createBufferImagePost : mutation conforme au schéma AssetInput", () => {
  const IMAGE_URL = "https://deviens-marrant.fr/api/social/stored-image?key=social-images%2Fabc.png";

  beforeEach(() => {
    bufferFetch.mockReset();
    process.env.BUFFER_ACCESS_TOKEN = "test-token";
    process.env.BUFFER_ORGANIZATION_ID = "org-1";
    process.env.BUFFER_CHANNEL_INSTAGRAM = "chan-ig";
    bufferFetch.mockImplementation(async (_url: string, init: { body: string }) => {
      const { query } = JSON.parse(init.body) as { query: string };
      if (query.includes("GetScheduledCount")) return okJson({ data: { posts: { edges: [] } } });
      return okJson({
        data: { createPost: { post: { id: "buf-42", text: "x", assets: [{ id: "a1", mimeType: "image/png" }] } } },
      });
    });
  });

  it("envoie assets comme liste d'AssetInput avec la variante image", async () => {
    const id = await createBufferImagePost("INSTAGRAM", "Amorce\nChute", IMAGE_URL);
    expect(id).toBe("buf-42");

    const mutation = sentQueries().find((q) => q.includes("createPost"));
    expect(mutation).toBeDefined();
    expect(mutation).toContain(`assets: [{ image: { url: ${JSON.stringify(IMAGE_URL)} } }]`);
    expect(mutation).not.toMatch(/\bimages\s*:/);
  });

  it("conserve les métadonnées Instagram obligatoires", async () => {
    await createBufferImagePost("INSTAGRAM", "Amorce\nChute", IMAGE_URL);
    const mutation = sentQueries().find((q) => q.includes("createPost")) ?? "";
    expect(mutation).toContain("metadata: { instagram: { type: post, shouldShareToFeed: true } }");
    expect(mutation).toContain('channelId: "chan-ig"');
  });

  it("remonte le message MutationError de Buffer", async () => {
    bufferFetch.mockImplementation(async (_url: string, init: { body: string }) => {
      const { query } = JSON.parse(init.body) as { query: string };
      if (query.includes("GetScheduledCount")) return okJson({ data: { posts: { edges: [] } } });
      return okJson({ data: { createPost: { message: "Canal à reconnecter" } } });
    });
    await expect(createBufferImagePost("INSTAGRAM", "t", IMAGE_URL)).rejects.toThrow(
      "Buffer createImagePost error: Canal à reconnecter",
    );
  });
});

describe("carrousel Instagram (s15 cycle 3, vérifié sur brouillon Buffer réel le 05/10)", () => {
  beforeEach(() => {
    bufferFetch.mockReset();
    process.env.BUFFER_ACCESS_TOKEN = "test-token";
    process.env.BUFFER_ORGANIZATION_ID = "org-1";
    process.env.BUFFER_CHANNEL_INSTAGRAM = "chan-ig";
    process.env.BUFFER_CHANNEL_LINKEDIN = "chan-li";
    bufferFetch.mockImplementation(async (_url: string, init: { body: string }) => {
      const { query } = JSON.parse(init.body) as { query: string };
      if (query.includes("GetScheduledCount")) return okJson({ data: { posts: { edges: [] } } });
      return okJson({ data: { createPost: { post: { id: "buf-c", text: "x", assets: [] } } } });
    });
  });

  it("envoie N assets image dans l'ordre, type post (carousel refusé pour Instagram), avec texte alternatif", async () => {
    await createBufferImagePost("INSTAGRAM", "Amorce", ["https://a/1.png", "https://a/2.png"], undefined, undefined, "Amorce. Chute.");
    const m = sentQueries().find((q) => q.includes("createPost")) ?? "";
    expect(m).toContain(
      'assets: [{ image: { url: "https://a/1.png", metadata: { altText: "Amorce. Chute." } } }, { image: { url: "https://a/2.png", metadata: { altText: "Amorce. Chute." } } }]',
    );
    expect(m).toContain("type: post");
    expect(m).not.toContain("type: carousel");
  });

  it("refuse 0 image ou plus de 10 images avant tout appel", async () => {
    await expect(createBufferImagePost("INSTAGRAM", "t", [])).rejects.toThrow("invalid");
    const onze = Array.from({ length: MAX_CAROUSEL_IMAGES + 1 }, (_, i) => `https://a/${i}.png`);
    await expect(createBufferImagePost("INSTAGRAM", "t", onze)).rejects.toThrow("invalid");
    expect(bufferFetch).not.toHaveBeenCalled();
  });

  it("LinkedIn : premier commentaire dans metadata.linkedin.firstComment", async () => {
    await createBufferPost("LINKEDIN", "Titre\nLien en commentaire.", undefined, false, { firstComment: "https://x/y?utm_source=linkedin" });
    const m = sentQueries().find((q) => q.includes("createPost")) ?? "";
    expect(m).toContain('metadata: { linkedin: { firstComment: "https://x/y?utm_source=linkedin" } }');
  });
});

describe("relecture Buffer : pagination (D4) et lecture par identifiant (D2)", () => {
  beforeEach(() => {
    bufferFetch.mockReset();
    process.env.BUFFER_ACCESS_TOKEN = "test-token";
    process.env.BUFFER_ORGANIZATION_ID = "org-1";
  });

  const page = (ids: string[], next: string | null) =>
    okJson({
      data: {
        posts: {
          edges: ids.map((id) => ({ node: { id, status: "sent", sentAt: null, externalLink: null, channelService: "x", error: null } })),
          pageInfo: { endCursor: next, hasNextPage: next !== null },
        },
      },
    });

  it("suit le curseur jusqu'à trouver tous les identifiants voulus", async () => {
    bufferFetch
      .mockResolvedValueOnce(page(["a", "b"], "c1"))
      .mockResolvedValueOnce(page(["c", "d"], "c2"))
      .mockResolvedValueOnce(page(["e"], null));
    const posts = await getBufferFinishedPosts({ wantedIds: ["c"] });
    expect(posts.map((p) => p.id)).toEqual(["a", "b", "c", "d"]);
    expect(bufferFetch).toHaveBeenCalledTimes(2);
    expect(sentQueries()[1]).toContain('after: "c1"');
  });

  it("s'arrête à maxPages", async () => {
    bufferFetch.mockImplementation(async () => page(["z"], "next"));
    await getBufferFinishedPosts({ wantedIds: ["absent"], maxPages: 3 });
    expect(bufferFetch).toHaveBeenCalledTimes(3);
  });

  it("post supprimé chez Buffer : null (NOT_FOUND) ; autre erreur : remontée", async () => {
    bufferFetch.mockResolvedValueOnce(okJson({ errors: [{ message: "Post not found for id: x", extensions: { code: "NOT_FOUND" } }], data: null }));
    await expect(getBufferPostStatus("x")).resolves.toBeNull();
    bufferFetch.mockResolvedValueOnce(okJson({ errors: [{ message: "Internal" }], data: null }));
    await expect(getBufferPostStatus("y")).rejects.toThrow("Internal");
  });
});
