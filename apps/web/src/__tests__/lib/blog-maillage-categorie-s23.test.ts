/**
 * s23 (crawl Ahrefs du 28/10) : un article publié en base et rattaché à un cluster
 * par sa seule catégorie n'était proposé en « À lire ensuite » nulle part (4 articles
 * à un seul lien entrant, /blog). Il comble désormais les places restées vides après
 * Suivant / Précédent, sans jamais remplacer une carte existante.
 */
jest.mock("@/lib/prisma", () => ({
  prisma: { blogArticle: { findMany: jest.fn().mockResolvedValue([]), findUnique: jest.fn() } },
}));

import { prisma } from "@/lib/prisma";
import { loadBlogArticleNavigation, type BlogArticleData } from "@/lib/blog-article-page";
import { pickRelatedArticles } from "@/lib/blog-related";
import { blogArticles } from "@/lib/blog-articles";

const findMany = prisma.blogArticle.findMany as jest.Mock;
const a = (slug: string) => ({ slug });
const slugs = (list: { slug: string }[]) => list.map((x) => x.slug);

function dbRow(slug: string, category: string, publishedAt: string) {
  return { slug, title: `Titre ${slug}`, category, readingTime: "6 min", isPublished: true, publishedAt: new Date(publishedAt) };
}

/** Articles en base relevés en production le 31/10 (catégorie, date de publication). */
const ROWS = [
  dbRow("humour-en-colocation-desamorcer-tensions", "REPARTIE", "2026-10-19"),
  dbRow("avoir-confiance-en-soi-grace-a-l-humour", "PSYCHOLOGIE", "2026-04-27"),
  dbRow("etre-plus-a-l-aise-en-societe", "PSYCHOLOGIE", "2026-04-06"),
  dbRow("comment-improviser-des-blagues", "GUIDE", "2026-03-30"),
  dbRow("se-presenter-avec-humour", "PRATIQUE", "2026-10-12"),
  dbRow("premier-message-drole-appli-de-rencontre", "CATALOGUE", "2026-10-29"),
  dbRow("blagues-sur-l-ia-assistants-vocaux", "CATALOGUE", "2026-10-26"),
  dbRow("message-anniversaire-drole-par-situation", "CATALOGUE", "2026-10-22"),
  dbRow("blagues-halloween-soiree-deguisee", "CATALOGUE", "2026-10-05"),
];

function staticArticle(slug: string): BlogArticleData {
  const found = blogArticles.find((x) => x.slug === slug);
  if (!found) throw new Error(`article statique absent : ${slug}`);
  return found as BlogArticleData;
}

async function related(article: BlogArticleData, rows = ROWS) {
  findMany.mockResolvedValueOnce(rows);
  return slugs((await loadBlogArticleNavigation(article)).relatedArticles);
}

describe("pickRelatedArticles : categoryFill", () => {
  it("comble seulement les places vides, après le cluster", () => {
    const r = pickRelatedArticles(
      { cluster: [a("c1"), a("c2"), a("c3")], sameCategory: [a("k1")], others: [], categoryFill: [a("f1"), a("f2")] },
      ["c1", "c3"],
    );
    expect(slugs(r)).toEqual(["c2", "f1", "f2"]);
  });

  it("ne remplace jamais une des 3 cartes de base", () => {
    const r = pickRelatedArticles(
      { cluster: [a("c1"), a("c2")], sameCategory: [a("k1")], others: [], categoryFill: [a("f1")] },
      [],
    );
    expect(slugs(r)).toEqual(["c1", "c2", "k1"]);
  });
});

describe("loadBlogArticleNavigation : articles rattachés par catégorie", () => {
  beforeEach(() => findMany.mockReset());

  it.each([
    ["repartie-debutant-5-etapes", "humour-en-colocation-desamorcer-tensions"],
    ["timidite-et-humour", "humour-en-colocation-desamorcer-tensions"],
    ["jamais-quoi-repondre-techniques", "avoir-confiance-en-soi-grace-a-l-humour"],
    ["humour-quotidien-8-habitudes", "comment-improviser-des-blagues"],
    ["comment-faire-rire-une-fille", "blagues-halloween-soiree-deguisee"],
    ["comment-faire-rire-un-homme", "blagues-halloween-soiree-deguisee"],
  ])("%s propose %s", async (page, cible) => {
    expect(await related(staticArticle(page))).toContain(cible);
  });

  // Cartes relevées en production le 31/10, avant correctif, suivies de l'ajout.
  it.each([
    ["timidite-et-humour", ["comment-avoir-de-la-repartie"], ["humour-en-colocation-desamorcer-tensions"]],
    ["jamais-quoi-repondre-techniques", ["je-suis-pas-drole-comment-changer", "rester-muet-en-groupe"], ["avoir-confiance-en-soi-grace-a-l-humour"]],
    ["humour-quotidien-8-habitudes", ["pourquoi-blagues-marchent-pas", "erreurs-blagues"], ["comment-improviser-des-blagues"]],
    ["comment-faire-rire-une-fille", ["meilleures-blagues-droles-2026"], ["message-anniversaire-drole-par-situation", "blagues-halloween-soiree-deguisee"]],
    ["comment-devenir-drole", ["exercices-developper-humour", "pourquoi-blagues-marchent-pas", "erreurs-blagues"], []],
  ])("%s : cartes existantes gardées, places vides comblées", async (page, avant, ajout) => {
    expect(await related(staticArticle(page))).toEqual([...avant, ...ajout]);
  });

  it("page d'un article en base hors liste de cluster : inchangée", async () => {
    const coloc = { ...staticArticle("timidite-et-humour"), slug: "humour-en-colocation-desamorcer-tensions", category: "REPARTIE" };
    expect(await related(coloc)).toEqual(await related(coloc, []));
  });
});
