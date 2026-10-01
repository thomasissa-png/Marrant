/**
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

import { createBufferImagePost } from "@/lib/social/buffer-client";

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
