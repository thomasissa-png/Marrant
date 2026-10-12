/**
 * s20 : les descriptions des fiches vidéo font 250 à 420 caractères. La méta de
 * /videos/[slug] (description, Open Graph, Twitter) est limitée à 155 caractères,
 * coupée en fin de phrase, sinon au dernier mot + « … ».
 */
import { buildCatalogueSlug } from "@/lib/catalogue-slug";
import { buildVideoMetaDescription, fitDescription, VIDEO_META_DESCRIPTION_MAX } from "@/lib/seo-meta";
import videoContent from "@/data/video-content-s20.json";

const findMany = jest.fn();
jest.mock("@/lib/prisma", () => ({
  prisma: { video: { findMany: (...a: unknown[]) => findMany(...a) } },
}));
jest.mock("@/lib/db-retry", () => ({
  withDbRetry: <T,>(fn: () => Promise<T>) => fn(),
}));
jest.mock("next/navigation", () => ({
  notFound: () => {
    throw new Error("NEXT_NOT_FOUND");
  },
  permanentRedirect: (url: string) => {
    throw new Error(`NEXT_REDIRECT:${url}`);
  },
}));

const ID = "cmvideometa155000001";
const TITLE = "Le faux naïf";
const S1 = "Roman Frayssinet met « l'intelligence » des animaux entre guillemets dans son titre, et ce petit pli ironique donne déjà le ton.";
const S2 = "Un bon terrain pour étudier le faux naïf : décrire un comportement ordinaire avec des mots trop grands pour lui.";

describe("buildVideoMetaDescription (155 car.)", () => {
  it("coupe à la fin de la dernière phrase complète qui tient", () => {
    const out = buildVideoMetaDescription({ channelName: "Roman Frayssinet", description: `${S1} ${S2}` });
    expect(out).toBe(`Roman Frayssinet : ${S1}`);
    expect(out.length).toBeLessThanOrEqual(VIDEO_META_DESCRIPTION_MAX);
  });

  it("aucune phrase assez longue ne tient : dernier mot entier + « … »", () => {
    const long = "Un comportement ordinaire décrit avec des mots trop grands pour lui, puis une deuxième idée, puis une troisième, et encore une quatrième jusqu'à dépasser largement la limite fixée.";
    const out = buildVideoMetaDescription({ channelName: "Chaîne", description: long });
    expect(out.length).toBeLessThanOrEqual(VIDEO_META_DESCRIPTION_MAX);
    expect(out.endsWith("…")).toBe(true);
    const sansEllipse = out.slice(0, -1);
    expect(`Chaîne : ${long}`.startsWith(sansEllipse)).toBe(true);
    expect(`Chaîne : ${long}`[sansEllipse.length]).toMatch(/[\s,]/); // coupe entre deux mots
  });

  it("phrase qui finit pile au 155e caractère : gardée entière", () => {
    const sentence = `${"a".repeat(150)} fin.`; // 155 car.
    expect(fitDescription(`${sentence} Suite qui dépasse.`, 155)).toBe(sentence);
  });

  it("toutes les fiches du JSON s20 : ≤ 155 car., sans « — »", () => {
    for (const f of (videoContent as { fiches: { cible: { description: string } }[] }).fiches) {
      const out = buildVideoMetaDescription({ channelName: "Chaîne Officielle", description: f.cible.description });
      expect(out.length).toBeLessThanOrEqual(VIDEO_META_DESCRIPTION_MAX);
      expect(out).not.toContain("—");
      expect(out.endsWith(".") || out.endsWith("!") || out.endsWith("?") || out.endsWith("…")).toBe(true);
    }
  });
});

describe("/videos/[slug] : méta, OG et Twitter ≤ 155 car.", () => {
  it("description longue → même méta tronquée partout", async () => {
    findMany.mockResolvedValue([
      {
        id: ID,
        isActive: true,
        title: TITLE,
        youtubeId: "brlY_DMoaRk",
        channelName: "Roman Frayssinet",
        description: `${S1} ${S2} Regarde-le pour voir comment un œil décalé suffit à rendre drôle ce que tout le monde a déjà vu.`,
        technique: "Faux naïf",
        category: "OBSERVATION",
        difficulty: "DEBUTANT",
        learnings: [],
        exercise: null,
        updatedAt: new Date("2026-10-12"),
        createdAt: new Date("2026-03-01"),
      },
    ]);
    const page = require("@/app/(dashboard)/videos/[slug]/page");
    const meta = await page.generateMetadata({ params: { slug: buildCatalogueSlug(TITLE, ID) } });
    expect(meta.description).toBe(`Roman Frayssinet : ${S1}`);
    expect(meta.openGraph.description).toBe(meta.description);
    expect(meta.twitter.description).toBe(meta.description);
  });
});
