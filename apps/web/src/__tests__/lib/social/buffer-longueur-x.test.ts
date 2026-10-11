/**
 * @jest-environment node
 *
 * Non-régression R1 (s15, cycle 6) : le dernier filet de `buffer-client`
 * comptait la longueur brute contre 280 pour X, alors que X compte un lien
 * pour 23 caractères. Le post X du 07/10 (quiz, plus de 280 bruts à cause du
 * lien UTM, moins de 270 comptés par X) aurait été refusé « Contenu trop long »
 * et passé en FAILED.
 *
 * Le VRAI `buffer-client` est appelé : seul `global.fetch` est simulé.
 */

import { readFileSync } from "fs";
import path from "path";

const bufferFetch = jest.fn();
(global as { fetch: unknown }).fetch = bufferFetch;

import {
  BufferContentTooLongError,
  createBufferImagePost,
  createBufferPost,
} from "@/lib/social/buffer-client";
import { longueurX } from "@/lib/social/longueur-x";

interface PostLot {
  platform: string;
  content: string;
  scheduledAt: string;
}

const LOT = path.resolve(__dirname, "../../../../../../docs/social/preparation/lot-semaine0.json");
const lot = JSON.parse(readFileSync(LOT, "utf8")) as { posts: PostLot[] };
const postX0710 = lot.posts.find((p) => p.platform === "TWITTER" && p.scheduledAt.startsWith("2026-10-07"));

function okJson(body: unknown) {
  return { ok: true, status: 200, json: async () => body, text: async () => JSON.stringify(body) };
}

function mutations(): string[] {
  return bufferFetch.mock.calls
    .map((call) => (JSON.parse((call[1] as { body: string }).body) as { query: string }).query)
    .filter((q) => q.includes("createPost"));
}

describe("buffer-client : longueur X comptée comme X (lien = 23)", () => {
  beforeEach(() => {
    bufferFetch.mockReset();
    process.env.BUFFER_ACCESS_TOKEN = "test-token";
    process.env.BUFFER_ORGANIZATION_ID = "org-1";
    process.env.BUFFER_CHANNEL_TWITTER = "chan-x";
    bufferFetch.mockImplementation(async (_url: string, init: { body: string }) => {
      const { query } = JSON.parse(init.body) as { query: string };
      if (query.includes("GetScheduledCount")) return okJson({ data: { posts: { edges: [] } } });
      return okJson({ data: { createPost: { post: { id: "buf-x", text: "t", assets: [] } } } });
    });
  });

  // Texte lu dans le lot (313 bruts / 229 X au diagnostic, 328 / 244 après le pont du
  // quiz du cycle 6) : ce qui compte, plus de 280 bruts mais au plus 270 comptés par X.
  it("le lot contient bien le post X du 07/10 : plus de 280 bruts, au plus 270 comptés par X (limite de la route)", () => {
    expect(postX0710).toBeDefined();
    expect(postX0710!.content.length).toBeGreaterThan(280);
    expect(longueurX(postX0710!.content)).toBeLessThanOrEqual(270);
  });

  it("createBufferPost : le texte exact du 07/10 part chez Buffer", async () => {
    await expect(createBufferPost("TWITTER", postX0710!.content)).resolves.toBe("buf-x");
    const m = mutations();
    expect(m).toHaveLength(1);
    expect(m[0]).toContain(JSON.stringify(postX0710!.content));
  });

  it("createBufferImagePost : même calcul sur le chemin avec image", async () => {
    await expect(createBufferImagePost("TWITTER", postX0710!.content, "https://a/1.png")).resolves.toBe("buf-x");
    expect(mutations()).toHaveLength(1);
  });

  it("au-delà de 280 comptés par X : refus avant tout appel", async () => {
    const lien = "https://deviens-marrant.fr/quiz-humour?utm_source=x&utm_content=quiz";
    const texte = `${"a".repeat(257)} ${lien}`; // 257 + 1 + 23 = 281
    expect(longueurX(texte)).toBe(281);
    await expect(createBufferPost("TWITTER", texte)).rejects.toBeInstanceOf(BufferContentTooLongError);
    await expect(createBufferImagePost("TWITTER", texte, "https://a/1.png")).rejects.toBeInstanceOf(BufferContentTooLongError);
    expect(bufferFetch).not.toHaveBeenCalled();
  });

  it("autres réseaux : longueur brute inchangée", async () => {
    process.env.BUFFER_CHANNEL_LINKEDIN = "chan-li";
    const texte = `${"a".repeat(1290)} https://deviens-marrant.fr/x`; // 1318 bruts > 1300
    await expect(createBufferPost("LINKEDIN", texte)).rejects.toBeInstanceOf(BufferContentTooLongError);
  });
});
