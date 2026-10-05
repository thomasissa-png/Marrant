/**
 * @jest-environment node
 *
 * Tests — GET /api/social/image, carte LinkedIn du test alterné (s15, v5 §8) :
 * un post LINKEDIN `[variante:image]` éligible reçoit 1 carte 4:5 1080×1350 (la
 * chute seule, gabarit violet d'Instagram), rendue en vrai PNG (satori + resvg,
 * polices de public/fonts). Les posts LinkedIn non éligibles gardent l'ancien rendu.
 */

const mockFindUnique = jest.fn();
jest.mock("@/lib/prisma", () => ({ prisma: { socialPost: { findUnique: (...a: unknown[]) => mockFindUnique(...a) } } }));

import { GET } from "@/app/api/social/image/route";
import { slidesDuPost, texteAlternatifDuPost } from "@/lib/social/generate-post-image";

const NB = " ";
const AMORCE = "Mon collègue revient de 4 jours à Rome et me raconte tout en détail.";
const CHUTE = "Ça fait 2h. On vient de récupérer les valises.";

const post = (directorNote: string | null, extra: Record<string, unknown> = {}) => ({
  id: "cmonlkgeu000ds60wu0gazutb", platform: "LINKEDIN", format: "POTE_AU_TAF", hook: AMORCE.slice(0, 80),
  content: `«${NB}${AMORCE}${NB}»\n«${NB}${CHUTE}${NB}»`, targetPersona: "SOPHIE", threadParts: [AMORCE, CHUTE],
  sourceType: "JOKE", directorNote, ...extra,
});

/** Largeur et hauteur lues dans l'en-tête IHDR du PNG. */
function dimensions(png: Buffer): [number, number] {
  expect(png.subarray(1, 4).toString("ascii")).toBe("PNG");
  return [png.readUInt32BE(16), png.readUInt32BE(20)];
}

const appeler = (slide = 0) => GET(new Request(`https://deviens-marrant.fr/api/social/image?postId=cmonlkgeu000ds60wu0gazutb&slide=${slide}`));

beforeEach(() => {
  mockFindUnique.mockReset();
  jest.spyOn(console, "warn").mockImplementation(() => undefined);
  jest.spyOn(console, "log").mockImplementation(() => undefined);
});

describe("/api/social/image : carte LinkedIn [variante:image]", () => {
  it("rend un PNG 1080×1350 (1 slide, slide hors bornes = même carte)", async () => {
    mockFindUnique.mockResolvedValue(post("[variante:image] Lot relance-s15 (VANNE, TIRAGE)"));
    const res = await appeler(0);
    expect(res.status).toBe(200);
    expect(res.headers.get("Content-Type")).toBe("image/png");
    const png = Buffer.from(await res.arrayBuffer());
    expect(dimensions(png)).toEqual([1080, 1350]);
    expect(png.length).toBeGreaterThan(10_000);
    const autre = Buffer.from(await (await appeler(3)).arrayBuffer());
    expect(dimensions(autre)).toEqual([1080, 1350]);
  }, 60_000);

  it("carte = chute seule (amorce dans le texte du post), alt = amorce + chute avec « »", () => {
    const p = post("[variante:image]");
    const slides = slidesDuPost(p);
    expect(slides).toHaveLength(1);
    const alt = texteAlternatifDuPost(p);
    expect(alt).toMatch(/^«.Mon collègue.*détail\..» «.Ça fait 2h.*valises\..»$/u);
    const html = JSON.stringify(slides![0].element.props);
    expect(html).toContain("valises");
    expect(html).not.toContain("Rome");
  });

  it("non éligible : sans marqueur, [variante:texte], amorce > 140, lien, texte qui ne reprend pas l'amorce", () => {
    const longue = `${"Mon collègue ".repeat(12)}revient.`;
    for (const p of [
      post(null),
      post("[variante:texte]"),
      post("[variante:image]", { content: `${longue}\n${CHUTE}`, threadParts: [longue, CHUTE] }),
      post("[variante:image]", { content: `${AMORCE}\n${CHUTE}\nhttps://deviens-marrant.fr/blog/x` }),
      post("[variante:image]", { content: `Autre amorce.\n${CHUTE}` }),
      post("[variante:image]", { platform: "TWITTER" }),
    ]) expect(slidesDuPost(p)).toBeNull();
  });

  it("post introuvable : 404", async () => {
    mockFindUnique.mockResolvedValue(null);
    expect((await appeler()).status).toBe(404);
  });
});
