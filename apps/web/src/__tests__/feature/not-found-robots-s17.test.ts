/**
 * @jest-environment node
 *
 * Non-régression s17 (correctifs de clôture) : toute 404 du site (/nimporte-quoi,
 * /vannes/<inconnu>, /conseils/<inconnu>, /videos/<inconnu>, /blog/<inconnu>,
 * /parcours/<inconnu>, /vannes/theme/<inconnu>, /carnet/<inconnu>, /liens/<inconnu>)
 * ne porte qu'UNE balise robots (le `noindex` posé par notFound()) et aucun
 * `bingbot: index` hérité du layout racine. Les pages valides gardent les leurs.
 *
 * Next 14 fusionne la metadata layout → page (ou not-found) : `robots` est
 * remplacé en entier, `other` est fusionné clé par clé, une meta au contenu vide
 * n'est pas émise (next/dist/lib/metadata/generate/meta.js).
 */
import type { Metadata } from "next";

jest.mock("next/font/google", () => ({
  Inter: () => ({ variable: "font-inter" }),
  Plus_Jakarta_Sans: () => ({ variable: "font-jakarta" }),
}));

const findMany = jest.fn();
const findUnique = jest.fn();
jest.mock("@/lib/prisma", () => ({
  prisma: {
    joke: { findMany: (...a: unknown[]) => findMany(...a), count: jest.fn().mockResolvedValue(0) },
    tip: { findMany: (...a: unknown[]) => findMany(...a) },
    video: { findMany: (...a: unknown[]) => findMany(...a) },
    blogArticle: { findUnique: (...a: unknown[]) => findUnique(...a) },
    learningPath: { findUnique: (...a: unknown[]) => findUnique(...a) },
  },
}));
jest.mock("@/lib/session-plan", () => ({ readSessionPlan: jest.fn() }));
jest.mock("@/lib/db-retry", () => ({
  withDbRetry: <T,>(fn: () => Promise<T>) => fn(),
}));

import { metadata as layoutMetadata } from "@/app/layout";
import { metadata as rootNotFound } from "@/app/not-found";
import { metadata as parcoursNotFound } from "@/app/(dashboard)/parcours/[slug]/not-found";
import { generateMetadata as vanneMeta } from "@/app/(dashboard)/vannes/[slug]/page";
import { generateMetadata as conseilMeta } from "@/app/(dashboard)/conseils/[slug]/page";
import { generateMetadata as videoMeta } from "@/app/(dashboard)/videos/[slug]/page";
import { generateMetadata as blogMeta } from "@/app/(dashboard)/blog/[slug]/page";
import { generateMetadata as parcoursMeta } from "@/app/(dashboard)/parcours/[slug]/page";
import { generateMetadata as themeMeta } from "@/app/(dashboard)/vannes/theme/[slug]/page";
import { generateMetadata as carnetMeta } from "@/app/(dashboard)/carnet/[mois]/page";
import { generateMetadata as liensMeta } from "@/app/liens/[reseau]/page";
import { blogArticles } from "@/lib/blog-articles";
import { VANNES_THEMES } from "@/lib/vannes-themes";

/** Balises robots/bingbot émises après fusion layout → page (règles de Next 14). */
function emitted(page: Metadata) {
  const robots = "robots" in page ? page.robots : layoutMetadata.robots;
  const other = { ...layoutMetadata.other, ...page.other };
  const bingbot = other.bingbot;
  return {
    robots,
    bingbot: bingbot === undefined || bingbot === "" ? null : String(bingbot),
  };
}

const INCONNU = { params: { slug: "slug-inexistant-zz" } };

describe("404 : une seule balise robots, aucun bingbot hérité", () => {
  beforeEach(() => {
    findMany.mockReset().mockResolvedValue([]);
    findUnique.mockReset().mockResolvedValue(null);
  });

  it("le layout racine pose bien index, follow et bingbot (sinon ce test ne prouve rien)", () => {
    expect(layoutMetadata.robots).toMatchObject({ index: true, follow: true });
    expect(String(layoutMetadata.other?.bingbot)).toContain("index, follow");
  });

  it.each([
    ["app/not-found.tsx (/nimporte-quoi et routes sans not-found dédié)", rootNotFound],
    ["parcours/[slug]/not-found.tsx", parcoursNotFound],
  ])("%s : ni robots ni bingbot", (_nom, meta) => {
    expect(meta).toHaveProperty("robots", null);
    expect(emitted(meta)).toEqual({ robots: null, bingbot: null });
  });

  it.each([
    ["vannes", () => vanneMeta(INCONNU)],
    ["conseils", () => conseilMeta(INCONNU)],
    ["vidéos", () => videoMeta(INCONNU)],
    ["blog", () => blogMeta(INCONNU)],
    ["parcours", () => parcoursMeta(INCONNU)],
    ["vannes/theme", () => themeMeta({ ...INCONNU, searchParams: {} })],
    ["carnet", async () => carnetMeta({ params: { mois: "1999-01" } })],
    ["liens", async () => liensMeta({ params: { reseau: "ig" } })],
  ])("generateMetadata %s pour un slug inconnu : ni robots ni bingbot index", async (_nom, run) => {
    const meta = await run();
    expect(meta).toHaveProperty("robots", null);
    expect(emitted(meta)).toEqual({ robots: null, bingbot: null });
  });

  it("une page valide (article de blog) garde index, follow et bingbot du layout", async () => {
    const meta = await blogMeta({ params: { slug: blogArticles[0].slug } });
    expect(meta).not.toHaveProperty("robots");
    const tags = emitted(meta);
    expect(tags.robots).toMatchObject({ index: true, follow: true });
    expect(tags.bingbot).toContain("index, follow");
  });

  it("une page valide (thème de vannes) garde index, follow", async () => {
    const meta = await themeMeta({ params: { slug: VANNES_THEMES[0].slug }, searchParams: {} });
    expect(meta).not.toHaveProperty("robots");
    expect(emitted(meta).robots).toMatchObject({ index: true, follow: true });
  });

  it("une page valide en noindex (liens) garde sa consigne actuelle", () => {
    expect(liensMeta({ params: { reseau: "x" } }).robots).toEqual({ index: false, follow: true });
  });
});
