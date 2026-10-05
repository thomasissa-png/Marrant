/**
 * « À lire ensuite » des articles CATALOGUE en base (notation B4 iter1) :
 * plus de « Comment faire rire une fille » sous un message pour sa mère,
 * cartes de même intention, jamais d'article non publié ou programmé.
 */
jest.mock("@/lib/prisma", () => ({
  prisma: { blogArticle: { findMany: jest.fn().mockResolvedValue([]), findUnique: jest.fn() } },
}));

import { prisma } from "@/lib/prisma";
import { loadBlogArticleNavigation, type BlogArticleData } from "@/lib/blog-article-page";
import { curatedRelatedSlugs, FORTE_FRAPPE_ETALON_SLUG } from "@/lib/blog-related";
import { FORTE_FRAPPE_RELATED } from "@/config/blog-related-cards";
import { FORTE_FRAPPE_SLUGS } from "@/config/blog-forte-frappe";
import { blogArticles } from "@/lib/blog-articles";
import { getClusterForSlug } from "@/lib/blog-clusters";

const findMany = prisma.blogArticle.findMany as jest.Mock;
const FILLE = "comment-faire-rire-une-fille";
const DAY = 24 * 3600 * 1000;

function dbRow(slug: string, opts: { isPublished?: boolean; publishedAt?: Date | null } = {}) {
  return {
    slug,
    title: `Titre ${slug}`,
    category: "CATALOGUE",
    readingTime: "6 min",
    isPublished: opts.isPublished ?? true,
    publishedAt: opts.publishedAt === undefined ? new Date("2026-04-01") : opts.publishedAt,
  };
}

function dbArticle(slug: string, category = "CATALOGUE"): BlogArticleData {
  return { slug, title: slug, excerpt: "", content: "", date: "2026-05-01", readingTime: "6 min", category } as BlogArticleData;
}

async function relatedSlugs(slug: string, rows: ReturnType<typeof dbRow>[], category = "CATALOGUE") {
  findMany.mockResolvedValueOnce(rows);
  const nav = await loadBlogArticleNavigation(dbArticle(slug, category));
  return nav.relatedArticles.map((a) => a.slug);
}

const ALL_PUBLISHED = FORTE_FRAPPE_SLUGS.filter((s) => s !== FORTE_FRAPPE_ETALON_SLUG).map((s) => dbRow(s));

describe("« À lire ensuite » des articles CATALOGUE en base", () => {
  beforeEach(() => findMany.mockReset());

  it.each(["message-drole-fete-des-meres", "message-drole-fete-des-peres", "blagues-vacances-ete-entre-amis"])(
    "%s : jamais « Comment faire rire une fille », 3 cartes forte frappe",
    async (slug) => {
      const related = await relatedSlugs(slug, ALL_PUBLISHED);
      expect(related).not.toContain(FILLE);
      expect(related).toHaveLength(3);
      for (const s of related) expect([...FORTE_FRAPPE_SLUGS]).toContain(s);
    },
  );

  it("fête des mères : la fête des pères en premier, messages à envoyer", async () => {
    expect(await relatedSlugs("message-drole-fete-des-meres", ALL_PUBLISHED)).toEqual([
      "message-drole-fete-des-peres",
      "message-anniversaire-drole-par-situation",
      "voeux-drole-nouvelle-annee",
    ]);
  });

  it("aucun article forte frappe en base ne propose « Comment faire rire une fille » hors séduction / couple", async () => {
    const pertinent = new Set(["premier-message-drole-appli-de-rencontre", "blagues-de-couple-drole"]);
    for (const slug of FORTE_FRAPPE_SLUGS.filter((s) => !getClusterForSlug(s))) {
      const related = await relatedSlugs(slug, ALL_PUBLISHED);
      expect(related).not.toContain(slug);
      if (!pertinent.has(slug)) expect(related).not.toContain(FILLE);
    }
  });

  it("premier message (séduction) : faire rire une fille reste proposé, c'est le sujet", async () => {
    expect(await relatedSlugs("premier-message-drole-appli-de-rencontre", ALL_PUBLISHED)).toContain(FILLE);
  });

  it("article non publié ou programmé jamais proposé : la carte suivante prend sa place", async () => {
    const rows = [
      dbRow("message-drole-fete-des-peres", { publishedAt: new Date(Date.now() + 10 * DAY) }),
      dbRow("message-anniversaire-drole-par-situation", { isPublished: false }),
      dbRow("voeux-drole-nouvelle-annee"),
    ];
    const related = await relatedSlugs("message-drole-fete-des-meres", rows);
    expect(related).toEqual(["voeux-drole-nouvelle-annee", FORTE_FRAPPE_ETALON_SLUG]);
  });

  it("aucun autre article forte frappe publié : l'étalon seul, pas de remplissage hors sujet", async () => {
    expect(await relatedSlugs("message-drole-fete-des-meres", [])).toEqual([FORTE_FRAPPE_ETALON_SLUG]);
  });

  it("article CATALOGUE en base sans liste dédiée : étalon puis forte frappe, sans faire rire une fille", async () => {
    const related = await relatedSlugs("nouvel-article-catalogue", ALL_PUBLISHED);
    expect(related[0]).toBe(FORTE_FRAPPE_ETALON_SLUG);
    expect(related).not.toContain(FILLE);
  });

  it("étalon et articles d'autres catégories : règle générale inchangée", () => {
    expect(curatedRelatedSlugs(FORTE_FRAPPE_ETALON_SLUG, "CATALOGUE")).toBeNull();
    expect(curatedRelatedSlugs("article-guide-en-base", "GUIDE")).toBeNull();
  });
});

describe("config/blog-related-cards", () => {
  const known = new Set([...FORTE_FRAPPE_SLUGS, ...blogArticles.map((a) => a.slug)]);

  it("clés = articles forte frappe en base ; cibles = slugs connus, sans soi-même ni doublon", () => {
    for (const [slug, targets] of Object.entries(FORTE_FRAPPE_RELATED)) {
      expect(FORTE_FRAPPE_SLUGS).toContain(slug);
      expect(getClusterForSlug(slug)).toBeUndefined();
      for (const t of targets ?? []) expect(known.has(t)).toBe(true);
      expect(targets).not.toContain(slug);
      expect(new Set(targets).size).toBe(targets?.length);
    }
  });
});
