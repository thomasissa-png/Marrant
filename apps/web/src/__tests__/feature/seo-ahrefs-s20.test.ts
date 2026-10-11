/**
 * @jest-environment node
 *
 * Non-régression audit Ahrefs du 07/10/2026.
 * A. robots.txt : les variantes /register?callbackUrl=… et /abonnement?returnTo=…
 *    sont bloquées pour TOUS les user-agents, /abonnement nu reste explorable.
 * B. Open Graph : Next 14 remplace l'`openGraph` du layout en entier dès qu'une
 *    page en définit un (fusion superficielle). Les 15 pages signalées doivent
 *    donc exposer elles-mêmes og:title, og:description, og:image, og:url, og:type,
 *    et un bloc twitter propre (sinon titre/description Twitter de l'accueil).
 */
import type { Metadata } from "next";

jest.mock("next/font/google", () => ({
  Inter: () => ({ variable: "font-inter" }),
  Plus_Jakarta_Sans: () => ({ variable: "font-jakarta" }),
}));
jest.mock("@/lib/prisma", () => ({
  prisma: {
    learningPath: { findUnique: jest.fn().mockResolvedValue(null) },
    joke: { findMany: jest.fn().mockResolvedValue([]), count: jest.fn().mockResolvedValue(0) },
  },
}));
jest.mock("@/lib/session-plan", () => ({ readSessionPlan: jest.fn() }));
jest.mock("@/lib/db-retry", () => ({
  withDbRetry: <T,>(fn: () => Promise<T>) => fn(),
}));

import robots from "@/app/robots";
import { metadata as layoutMetadata } from "@/app/layout";
import { metadata as parcoursHub } from "@/app/(dashboard)/parcours/(liste)/page";
import {
  generateMetadata as parcoursMeta,
  generateStaticParams as parcoursParams,
} from "@/app/(dashboard)/parcours/[slug]/page";
import { metadata as anatomie } from "@/app/(dashboard)/anatomie-vanne/page";
import { generateMetadata as themeMeta } from "@/app/(dashboard)/vannes/theme/[slug]/page";
import { metadata as blagueDuJour } from "@/app/(dashboard)/blague-du-jour/page";
import { VANNES_THEMES } from "@/lib/vannes-themes";

/** Disallow d'un chemin selon la règle robots.txt (préfixe, `$` non utilisé ici). */
function isBlocked(disallow: string[], path: string): boolean {
  return disallow.some((rule) => path.startsWith(rule));
}

describe("robots.txt : variantes /register et /abonnement à paramètres", () => {
  const { rules } = robots();
  const groups = Array.isArray(rules) ? rules : [rules];

  it.each(groups.map((g) => [String(g.userAgent), g] as const))("%s", (_ua, group) => {
    const disallow = ([] as string[]).concat(group.disallow ?? []);
    expect(disallow).toEqual(expect.arrayContaining(["/register", "/abonnement?"]));
    expect(isBlocked(disallow, "/register?callbackUrl=%2Fvannes&src=header")).toBe(true);
    expect(isBlocked(disallow, "/abonnement?returnTo=%2Fvannes%2Fx&src=fiche")).toBe(true);
    // /abonnement nu (page de vente, dans le sitemap) reste explorable.
    expect(isBlocked(disallow, "/abonnement")).toBe(false);
    expect(isBlocked(disallow, "/vannes")).toBe(false);
  });
});

/** openGraph émis après fusion layout → page (remplacement en entier). */
function emittedOg(page: Metadata) {
  const og = (page.openGraph ?? layoutMetadata.openGraph) as Record<string, unknown>;
  const images = ([] as unknown[]).concat(og.images ?? []);
  return { og, images };
}

function expectCompleteOg(page: Metadata, url: string) {
  const { og, images } = emittedOg(page);
  expect(og.title).toBeTruthy();
  expect(og.description).toBeTruthy();
  expect(og.url).toBe(url);
  expect(og.type).toBe("website");
  expect(images.length).toBeGreaterThan(0);
  expectOwnTwitter(page);
}

/** twitter émis : propre à la page, jamais le titre/la description de l'accueil. */
function expectOwnTwitter(page: Metadata) {
  const home = layoutMetadata.twitter as Record<string, unknown>;
  const tw = (page.twitter ?? home) as Record<string, unknown>;
  expect(tw.card).toBe("summary_large_image");
  expect(tw.title).toBeTruthy();
  expect(tw.title).not.toBe(home.title);
  expect(tw.description).toBeTruthy();
  expect(tw.description).not.toBe(home.description);
  expect(([] as unknown[]).concat(tw.images ?? []).length).toBeGreaterThan(0);
}

const BASE = "https://deviens-marrant.fr";

describe("Open Graph complet sur les 15 pages de l'audit", () => {
  it("/parcours", () => expectCompleteOg(parcoursHub, `${BASE}/parcours`));
  it("/anatomie-vanne", () => expectCompleteOg(anatomie, `${BASE}/anatomie-vanne`));
  it("/blague-du-jour", () => expectCompleteOg(blagueDuJour, `${BASE}/blague-du-jour`));

  const parcours = parcoursParams().map((p) => p.slug);
  it("couvre au moins les 5 parcours publiés", () => expect(parcours.length).toBeGreaterThanOrEqual(5));
  it.each(parcours)("/parcours/%s", async (slug) => {
    expectCompleteOg(await parcoursMeta({ params: { slug } }), `${BASE}/parcours/${slug}`);
  });

  it.each(VANNES_THEMES.map((t) => t.slug))("/vannes/theme/%s", async (slug) => {
    const meta = await themeMeta({ params: { slug }, searchParams: {} });
    expectCompleteOg(meta, `${BASE}/vannes/theme/${slug}`);
  });

  it("/vannes/theme/<slug>?page=2 (même generateMetadata)", async () => {
    const slug = VANNES_THEMES[0].slug;
    const meta = await themeMeta({ params: { slug }, searchParams: { page: "2" } });
    const { og } = emittedOg(meta);
    expect(og.type).toBe("website");
    expect(String(og.url)).toContain(`/vannes/theme/${slug}`);
    expectOwnTwitter(meta);
  });
});
