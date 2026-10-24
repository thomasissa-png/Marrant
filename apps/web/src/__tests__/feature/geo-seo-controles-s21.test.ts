/**
 * @jest-environment node
 *
 * s21, corrections des contrôles GEO (docs/geo/controle-geo-s21.md, C1 à C7) et
 * SEO (docs/seo/controle-seo-s21.md, À CORRIGER) avant la mise en ligne.
 */
import type { Metadata } from "next";

const mockBlogFindMany = jest.fn();
jest.mock("@/lib/prisma", () => ({
  prisma: {
    blogArticle: { findMany: (...a: unknown[]) => mockBlogFindMany(...a) },
    joke: { findMany: async () => [] },
    tip: { findMany: async () => [] },
    video: { findMany: async () => [] },
  },
}));
jest.mock("@/lib/content-stats-server", () => ({
  getContentStatsRounded: async () => ({ jokes: 140, tips: 120, videos: 80 }),
}));
jest.mock("@/lib/session-plan", () => ({ readSessionPlan: jest.fn() }));
// Jest n'embarque pas les carnets (pas de require.context) : un mois ouvert simulé.
jest.mock("@/lib/carnet", () => ({
  ...jest.requireActual("@/lib/carnet"),
  getCarnetByMonth: (mois: string) => (mois === "2026-10" ? { mois } : null),
}));
jest.mock("next/font/google", () => ({
  Inter: () => ({ variable: "font-inter" }),
  Plus_Jakarta_Sans: () => ({ variable: "font-jakarta" }),
}));

import { GET as llmsTxt } from "@/app/llms.txt/route";
import { GET as llmsFullTxt } from "@/app/llms-full.txt/route";
import { getLlmsFaqFull, getLlmsTarifs, LLMS_FAQ_FULL, LLMS_FULL_INTRO } from "@/lib/llms-content";
import { renderLlmsParcoursProgramme } from "@/lib/llms-parcours";
import { REASSURANCE_UNIQUE } from "@/config/textes/offre";
import { PREMIUM_PARCOURS } from "@/config/premium";
import { buildProductJsonLd, priceValidUntil } from "@/components/seo/json-ld";
import { metadata as layoutMetadata } from "@/app/layout";
import { metadata as lettreMeta } from "@/app/(dashboard)/lettre/page";
import { metadata as confirmerMeta } from "@/app/(dashboard)/lettre/confirmer/page";
import { metadata as desinscrireMeta } from "@/app/(dashboard)/lettre/desinscrire/page";
import { metadata as carnetMeta } from "@/app/(dashboard)/carnet/page";
import { generateMetadata as carnetMoisMeta } from "@/app/(dashboard)/carnet/[mois]/page";
import { metadata as registerMeta } from "@/app/(auth)/register/layout";
import { metadata as cguMeta } from "@/app/(dashboard)/cgu/page";
import { metadata as confidentialiteMeta } from "@/app/(dashboard)/confidentialite/page";
import { metadata as mentionsMeta } from "@/app/(dashboard)/mentions-legales/page";
import { metadata as retractationMeta } from "@/app/(dashboard)/retractation/page";
import { metadata as glossaireMeta } from "@/app/(dashboard)/glossaire/page";
import { metadata as aProposMeta } from "@/app/(dashboard)/a-propos/page";
import { metadata as blogMeta } from "@/app/(dashboard)/blog/page";
import { generateMetadata as abonnementMeta } from "@/app/(dashboard)/abonnement/layout";
import { generateMetadata as vannesMeta } from "@/app/(dashboard)/vannes/page";
import { generateMetadata as conseilsMeta } from "@/app/(dashboard)/conseils/page";
import { generateMetadata as videosMeta } from "@/app/(dashboard)/videos/page";

const EM = "—";

describe("GEO s21 : llms.txt et llms-full.txt", () => {
  beforeEach(() => mockBlogFindMany.mockReset().mockResolvedValue([]));

  it("C1 : réassurance du site mot pour mot, plus jamais « résiliable en ligne »", () => {
    for (const annuel of [false, true]) {
      expect(getLlmsTarifs(annuel)).toContain(REASSURANCE_UNIQUE);
      const cout = getLlmsFaqFull(annuel).find((f) => f.question === "Combien ça coûte ?")!;
      expect(cout.answer).toContain(REASSURANCE_UNIQUE);
      expect(cout.answer).toContain("la première étape de chaque parcours, la situation offerte du carnet du mois");
    }
    const tout = JSON.stringify([getLlmsTarifs(true), getLlmsFaqFull(true), LLMS_FAQ_FULL]);
    expect(tout).not.toContain("résiliable en ligne");
    expect(tout).not.toMatch(/garantie|satisfait ou remboursé/i);
  });

  it("C2 et C3 : intro de llms-full avec les parcours publiés, le carnet et la lettre, sans date", () => {
    for (const p of PREMIUM_PARCOURS) expect(LLMS_FULL_INTRO).toContain(`**${p.name}** (${p.weeks} semaines`);
    expect(LLMS_FULL_INTRO).toContain("### Carnet de répartie du mois (https://deviens-marrant.fr/carnet)");
    expect(LLMS_FULL_INTRO).toContain("### La lettre du mois (https://deviens-marrant.fr/lettre)");
    expect(LLMS_FULL_INTRO).not.toMatch(/novembre|octobre|05\/11|jeudi/i);
  });

  it("C5 : aucun tiret cadratin dans les textes llms, garde-fou appliqué à la sortie des deux routes", async () => {
    const statiques = [
      renderLlmsParcoursProgramme().join("\n"),
      getLlmsTarifs(true).join("\n"),
      JSON.stringify(getLlmsFaqFull(true)),
      LLMS_FULL_INTRO,
    ].join("\n");
    expect(statiques).not.toContain(EM);

    const article = {
      slug: "article-test-tiret-s21",
      title: "Article test",
      excerpt: `Une phrase ${EM} avec une incise ${EM} au milieu.`,
      content: `Le contenu ${EM} avec un tiret.`,
      category: "repartie",
      publishedAt: new Date("2026-10-01"),
      createdAt: new Date("2026-10-01"),
      updatedAt: new Date("2026-10-01"),
    };
    mockBlogFindMany.mockResolvedValue([article]);
    const court = await (await llmsTxt()).text();
    const complet = await (await llmsFullTxt()).text();
    expect(court).toContain("article-test-tiret-s21");
    expect(complet).toContain("article-test-tiret-s21");
    expect(court).not.toContain(EM);
    expect(complet).not.toContain(EM);
  });

  it("C2, C3 et C6 : llms.txt (carnet, lettre, « Articles ») et llms-full (8 pages ressources)", async () => {
    const court = await (await llmsTxt()).text();
    expect(court).toContain("- [Carnet de répartie du mois](https://deviens-marrant.fr/carnet):");
    expect(court).toContain("- [La lettre](https://deviens-marrant.fr/lettre):");
    expect(court).toContain("- [Articles](https://deviens-marrant.fr/blog):");
    expect(court).not.toContain("[Blog]");
    const complet = await (await llmsFullTxt()).text();
    for (const p of PREMIUM_PARCOURS) expect(complet).toContain(`URL : https://deviens-marrant.fr/parcours/${p.slug}`);
    expect(complet).toContain(`- ${3 + PREMIUM_PARCOURS.length} pages ressources et parcours`);
  });

  it("C7 : formule annuelle avec le libellé du site, jamais « par rapport au mensuel »", () => {
    const annuel = getLlmsTarifs(true).find((t) => t.startsWith("Premium en formule annuelle"))!;
    expect(annuel).toContain("mois offerts");
    expect(annuel).not.toContain("par rapport au mensuel");
  });
});

describe("GEO s21 (C4) : priceValidUntil calculé", () => {
  it("31/12 de l'année suivante, jamais une date figée", () => {
    expect(priceValidUntil(new Date("2026-10-18T12:00:00Z"))).toBe("2027-12-31");
    expect(priceValidUntil(new Date("2027-12-31T12:00:00Z"))).toBe("2028-12-31");
    const attendu = priceValidUntil();
    expect(buildProductJsonLd().offers).toMatchObject({ priceValidUntil: attendu });
    const offres = buildProductJsonLd({ annualAvailable: true }).offers as Array<Record<string, unknown>>;
    for (const o of offres) expect(o.priceValidUntil).toBe(attendu);
  });
});

/** Balise bingbot émise après fusion layout → page (Next fusionne `other` clé par clé). */
function bingbotEmis(page: Metadata): string | null {
  const b = { ...layoutMetadata.other, ...page.other }.bingbot;
  return b === undefined || b === "" ? null : String(b);
}

describe("SEO s21 : pages noindex sans bingbot index hérité", () => {
  it.each([
    ["/lettre", lettreMeta],
    ["/lettre/confirmer", confirmerMeta],
    ["/lettre/desinscrire", desinscrireMeta],
    ["/carnet", carnetMeta],
    ["/carnet/[mois]", carnetMoisMeta({ params: { mois: "2026-10" } })],
    ["/register", registerMeta],
  ])("%s : une seule consigne robots (noindex), aucun bingbot", (_page, meta) => {
    expect(String(layoutMetadata.other?.bingbot)).toContain("index, follow");
    expect(meta.robots).toEqual({ index: false, follow: false });
    expect(bingbotEmis(meta)).toBeNull();
  });
});

describe("SEO s21 : og:url propre et canonical", () => {
  const og = (m: Metadata) => (m.openGraph as { url?: string } | undefined)?.url;

  it.each([
    ["/cgu", cguMeta],
    ["/confidentialite", confidentialiteMeta],
    ["/mentions-legales", mentionsMeta],
    ["/retractation", retractationMeta],
    ["/glossaire", glossaireMeta],
    ["/a-propos", aProposMeta],
    ["/blog", blogMeta],
  ])("%s : canonical et og:url de la page", (path, meta) => {
    const url = `https://deviens-marrant.fr${path}`;
    expect(meta.alternates?.canonical).toBe(url);
    expect(og(meta)).toBe(url);
    expect(meta.twitter).toMatchObject({ title: meta.title, description: meta.description });
  });

  it("/abonnement et listes : og:url = canonical (page 2 comprise)", async () => {
    const abonnement = await abonnementMeta();
    expect(og(abonnement)).toBe("https://deviens-marrant.fr/abonnement");
    for (const [run, path] of [[vannesMeta, "/vannes"], [conseilsMeta, "/conseils"], [videosMeta, "/videos"]] as const) {
      const p1 = await run({ searchParams: {} } as never);
      expect(og(p1)).toBe(p1.alternates?.canonical);
      expect(og(p1)).toContain(path);
      const p2 = await run({ searchParams: { page: "2" } } as never);
      expect(og(p2)).toBe(p2.alternates?.canonical);
      expect(og(p2)).toContain("page=2");
    }
  });
});
