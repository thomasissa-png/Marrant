/**
 * @jest-environment node
 *
 * Test d'intégration (s15, cycle 7, QA condition 2) : la route publish-social avec le
 * VRAI `buffer-client` et le vrai rendu de carte. Seuls `fetch` (API Buffer), Prisma,
 * le verrou d'alerte et l'e-mail sont simulés. Textes exacts de
 * `docs/social/preparation/lot-semaine0.json` : LinkedIn texte, X avec lien (quiz),
 * Instagram 2 cartes, plus un LinkedIn `[variante:image]` éligible. Assertion sur la
 * mutation GraphQL réellement produite (texte, canal, date, assets, alt, métadonnées).
 */
import { readFileSync } from "fs";
import path from "path";

// Fetch réel conservé pour les URL `data:` (WASM de yoga, chargé par satori) ; tout autre appel hors Buffer échoue.
// (yoga appelle fetch dès son chargement : le simulacre doit répondre avant le 1er test.)
const fetchReel = global.fetch;
const CANAUX = { TWITTER: "ch-x", INSTAGRAM: "ch-ig", LINKEDIN: "ch-li" } as const;
const okJson = (body: unknown) => ({ ok: true, status: 200, json: async () => body, text: async () => JSON.stringify(body) });
async function repondre(url: string, init: { body: string }) {
  if (String(url).startsWith("data:")) return fetchReel(url);
  if (!String(url).startsWith("https://api.buffer.com")) throw new Error(`appel réseau inattendu : ${url}`);
  const { query } = JSON.parse(init.body) as { query: string };
  if (query.includes("GetChannels")) {
    return okJson({ data: { channels: Object.values(CANAUX).map((id) => ({ id, name: id, displayName: id, service: "x", avatar: "", isQueuePaused: false, isDisconnected: false, isLocked: false })) } });
  }
  if (query.includes("GetScheduledCount")) return okJson({ data: { posts: { edges: [] } } });
  return okJson({ data: { createPost: { post: { id: "buf-1", text: "t", assets: [] } } } });
}
const bufferFetch = jest.fn(repondre);
(global as { fetch: unknown }).fetch = bufferFetch;

const mockFindMany = jest.fn();
const mockUpdate = jest.fn();
jest.mock("@/lib/prisma", () => ({
  prisma: {
    socialPost: {
      findMany: (...a: unknown[]) => mockFindMany(...a),
      findUnique: jest.fn(),
      update: (...a: unknown[]) => mockUpdate(...a),
      updateMany: async () => ({ count: 0 }),
    },
    socialPlatformSetting: {
      findMany: async () => ["TWITTER", "INSTAGRAM", "LINKEDIN"].map((platform) => ({ platform, paused: false })),
      upsert: jest.fn(),
      updateMany: jest.fn(),
    },
  },
}));
jest.mock("@/lib/db-retry", () => ({ withDbRetry: (fn: () => unknown) => fn() }));
jest.mock("@/lib/job-lock", () => ({ ...jest.requireActual("@/lib/job-lock"), tryAcquireLock: async () => true, isLockHeld: async () => false }));
const mockAlert = jest.fn(async () => true);
// s15 (06/10) : alertes enregistrées (lib/admin-alerts), plus d'e-mail direct.
jest.mock("@/lib/admin-alerts", () => ({ recordAdminAlert: (...a: unknown[]) => mockAlert(...(a as [])) }));
jest.mock("@/lib/blog-article-page", () => ({ findBlogArticle: jest.fn(async () => ({})) }));

import { GET } from "@/app/api/cron/publish-social/route";

interface PostLot {
  id: string; platform: string; format: string; content: string; hook: string; cta: string | null; hashtags: string[];
  targetPersona: string; sourceType: string; threadParts: string[]; imageUrls: string[]; directorNote: string; scheduledAt: string;
}
const LOT = path.resolve(__dirname, "../../../../../../docs/social/preparation/lot-semaine0.json");
const lot = JSON.parse(readFileSync(LOT, "utf8")) as { posts: PostLot[] };
const duLot = (pf: string, jour: string) => {
  const p = lot.posts.find((x) => x.platform === pf && x.scheduledAt.startsWith(jour));
  if (!p) throw new Error(`post ${pf} ${jour} absent du lot`);
  return p;
};
const LI = duLot("LINKEDIN", "2026-10-06");
const X = duLot("TWITTER", "2026-10-07");
const IG = duLot("INSTAGRAM", "2026-10-06");

/** Ligne SocialPost telle que lue en base (JSON du lot + colonnes absentes du JSON). */
const enBase = (p: PostLot, extra: Partial<PostLot> = {}) => ({
  ...p, status: "APPROVED", imageUrl: null, ...extra, scheduledAt: new Date(extra.scheduledAt ?? p.scheduledAt),
});

async function publier(post: ReturnType<typeof enBase>) {
  mockFindMany.mockReset();
  mockFindMany.mockResolvedValueOnce([]).mockResolvedValueOnce([post]);
  const res = await GET(new Request("https://example.com/api/cron/publish-social?secret=s"));
  const body = (await res.json()) as { results?: Array<{ status: string; error?: string }> };
  return body.results?.map((r) => `${r.status}${r.error ? ` : ${r.error}` : ""}`) ?? [JSON.stringify(body)];
}

const requetes = (): string[] => bufferFetch.mock.calls.filter((c) => String(c[0]).startsWith("https://api.buffer.com")).map((c) => (JSON.parse((c[1] as { body: string }).body) as { query: string }).query);
/** Mutation createPost produite (une seule attendue par publication). */
function mutation(): string {
  const m = requetes().filter((q) => q.includes("createPost("));
  expect(m).toHaveLength(1);
  return m[0];
}
const chaines = (q: string, champ: string): string[] =>
  [...q.matchAll(new RegExp(`${champ}: ("(?:[^"\\\\]|\\\\.)*")`, "g"))].map((x) => JSON.parse(x[1]) as string);
const statutFinal = () => mockUpdate.mock.calls.map((c) => c[0].data.status).filter(Boolean).pop();

beforeEach(() => {
  jest.clearAllMocks();
  jest.useFakeTimers({ now: new Date("2026-10-05T20:00:00Z"), advanceTimers: true });
  Object.assign(process.env, {
    CRON_SECRET: "s", BUFFER_ACCESS_TOKEN: "test-token", BUFFER_ORGANIZATION_ID: "org-1",
    BUFFER_CHANNEL_TWITTER: CANAUX.TWITTER, BUFFER_CHANNEL_INSTAGRAM: CANAUX.INSTAGRAM, BUFFER_CHANNEL_LINKEDIN: CANAUX.LINKEDIN,
    NEXT_PUBLIC_SITE_URL: "https://deviens-marrant.fr",
  });
  mockUpdate.mockResolvedValue({});
  bufferFetch.mockClear();
  for (const k of ["error", "warn", "log"] as const) jest.spyOn(console, k).mockImplementation(() => undefined);
});
afterEach(() => jest.useRealTimers());

describe("publish-social + vrai buffer-client : textes exacts de lot-semaine0", () => {
  it("LinkedIn texte (06/10) : CreatePost, texte complet 2 lignes, canal LinkedIn, sans image ni 1er commentaire", async () => {
    expect(await publier(enBase(LI))).toEqual(["published"]);
    const q = mutation();
    expect(q).toContain("mutation CreatePost");
    expect(chaines(q, "text")).toEqual([LI.content]);
    expect(LI.content.split("\n")).toHaveLength(2);
    expect(chaines(q, "channelId")).toEqual([CANAUX.LINKEDIN]);
    expect(q).toContain(`dueAt: "${LI.scheduledAt}"`);
    expect(q).not.toContain("assets");
    expect(q).not.toContain("metadata");
    expect(statutFinal()).toBe("PUBLISHED");
  });

  it("X avec lien (07/10, quiz) : CreatePost, texte exact (plus de 280 bruts), lien UTM intact", async () => {
    expect(X.content.length).toBeGreaterThan(280);
    expect(await publier(enBase(X))).toEqual(["published"]);
    const q = mutation();
    expect(q).toContain("mutation CreatePost");
    expect(chaines(q, "text")).toEqual([X.content]);
    expect(chaines(q, "text")[0]).toContain("utm_source=x&utm_medium=social&utm_campaign=2026-10&utm_content=quiz");
    expect(chaines(q, "channelId")).toEqual([CANAUX.TWITTER]);
    expect(q).toContain(`dueAt: "${X.scheduledAt}"`);
    expect(q).not.toContain("assets");
    expect(statutFinal()).toBe("PUBLISHED");
  });

  it("Instagram 2 cartes (06/10) : CreateImagePost, légende exacte, 2 assets dans l'ordre, alt amorce + chute, type post", async () => {
    expect(await publier(enBase(IG))).toEqual(["published"]);
    const q = mutation();
    expect(q).toContain("mutation CreateImagePost");
    expect(chaines(q, "text")).toEqual([IG.content]);
    expect(chaines(q, "url")).toEqual(IG.imageUrls);
    const alts = chaines(q, "altText");
    expect(alts).toHaveLength(2);
    for (const alt of alts) {
      expect(alt).toContain(IG.threadParts[0]);
      expect(alt).toContain(IG.threadParts[1]);
    }
    expect(q).toContain("metadata: { instagram: { type: post, shouldShareToFeed: true } }");
    expect(chaines(q, "channelId")).toEqual([CANAUX.INSTAGRAM]);
    expect(statutFinal()).toBe("PUBLISHED");
  });

  it("LinkedIn [variante:image] éligible : carte rendue, amorce seule, 1 asset slide 0, alt amorce + chute, sans métadonnée Instagram", async () => {
    // Forme écrite par le script de lot (social-lot-v5.ts) : threadParts = lignes brutes [amorce, chute].
    const lignes = LI.content.split("\n").map((l) => l.replace(/[«»]/g, "").replace(/\s+/gu, " ").trim());
    const url = `https://deviens-marrant.fr/api/social/image?postId=${LI.id}&slide=0`;
    const post = enBase(LI, { directorNote: `[variante:image] ${LI.directorNote}`, threadParts: lignes, imageUrls: [url] });
    expect(await publier(post)).toEqual(["published"]);
    const q = mutation();
    expect(q).toContain("mutation CreateImagePost");
    expect(chaines(q, "text")).toEqual([LI.content.split("\n")[0]]);
    expect(chaines(q, "url")).toEqual([url]);
    const [alt] = chaines(q, "altText");
    expect(alt).toContain(lignes[0]);
    expect(alt).toContain(lignes[1]);
    expect(q).not.toContain("instagram");
    expect(chaines(q, "channelId")).toEqual([CANAUX.LINKEDIN]);
    // Rendu réussi : aucune note de repli, aucune alerte.
    expect(mockUpdate.mock.calls.some((c) => typeof c[0].data.directorNote === "string")).toBe(false);
    expect(mockAlert).not.toHaveBeenCalled();
    expect(statutFinal()).toBe("PUBLISHED");
  }, 30_000);
});
