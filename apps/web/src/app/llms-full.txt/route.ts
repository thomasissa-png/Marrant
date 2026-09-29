import { NextResponse } from "next/server";
import { blogArticles } from "@/lib/blog-articles";
import { prisma } from "@/lib/prisma";

/**
 * llms-full.txt — version étendue de llms.txt pour les crawlers LLM (GEO).
 *
 * Inclut le contenu markdown complet des articles publiés (statiques + DB)
 * afin de rendre le catalogue éditorial ingérable en un seul fetch.
 * Rendu dynamique avec revalidation d'une heure.
 */
export const revalidate = 3600;

const BASE_URL = "https://deviens-marrant.fr";

interface FullArticle {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  date: string;
}

const RESOURCE_PAGES = [
  { path: "/glossaire", label: "Glossaire humour", summary: "12 termes clés de l'humour expliqués : répartie, timing, punchline, callback, tag, misdirection, deadpan, one-liner, autodérision, storytelling, absurde, observation." },
  { path: "/anatomie-vanne", label: "Anatomie d'une vanne", summary: "Structure setup + punchline décortiquée avec exemples concrets. Comment construire une vanne qui déclenche vraiment le rire." },
  { path: "/quiz-humour", label: "Quiz humour", summary: "Quiz pour identifier ton style d'humour dominant en 10 questions (autodérision, absurde, observation, jeu de mots, timing…)." },
  { path: "/parcours/machine-a-cafe", label: "Parcours Machine à Café", summary: "Parcours débutant de 3 semaines pour avoir des vannes et anecdotes à ressortir au bureau et en afterwork." },
  { path: "/parcours/repartie", label: "Parcours Répartie", summary: "Parcours intermédiaire de 4 semaines pour développer sa répartie avec des exercices concrets et ne plus rester muet." },
  { path: "/parcours/confiance", label: "Parcours Confiance", summary: "Parcours de 6 semaines pour retrouver confiance en soi grâce à l'humour, bienveillant et progressif." },
];

async function collectFullArticles(): Promise<FullArticle[]> {
  const staticArticles: FullArticle[] = blogArticles.map((a) => ({
    slug: a.slug,
    title: a.title,
    excerpt: a.excerpt,
    content: a.content,
    category: a.category,
    date: a.date,
  }));

  let dbArticlesList: FullArticle[] = [];
  try {
    const dbArticles = await prisma.blogArticle.findMany({
      where: { isPublished: true },
      select: {
        slug: true,
        title: true,
        excerpt: true,
        content: true,
        category: true,
        publishedAt: true,
        createdAt: true,
      },
      orderBy: { publishedAt: "desc" },
    });
    dbArticlesList = dbArticles.map((a) => ({
      slug: a.slug,
      title: a.title,
      excerpt: a.excerpt || "",
      content: a.content || "",
      category: a.category,
      date: (a.publishedAt || a.createdAt).toISOString().split("T")[0],
    }));
  } catch {
    // DB indispo — on continue avec les statiques.
  }

  const seen = new Set(staticArticles.map((a) => a.slug));
  for (const article of dbArticlesList) {
    if (!seen.has(article.slug)) {
      staticArticles.push(article);
      seen.add(article.slug);
    }
  }

  return staticArticles.sort((a, b) => b.date.localeCompare(a.date));
}

function renderLlmsFullTxt(articles: FullArticle[]): string {
  const lines: string[] = [];
  lines.push("# deviens-marrant.fr — version complète");
  lines.push("");
  lines.push(
    "> La plateforme francophone pour apprendre à devenir drôle, avoir de la répartie et progresser en humour.",
  );
  lines.push("");
  lines.push("## Sommaire");
  lines.push("");
  lines.push(`- ${articles.length} articles de blog`);
  lines.push(`- ${RESOURCE_PAGES.length} pages ressources et parcours`);
  lines.push("- Sections principales : vannes, conseils, vidéos, parcours, blog");
  lines.push("");
  lines.push("## Public cible");
  lines.push("");
  lines.push("- Étudiants timides (16-25 ans) qui veulent avoir de la répartie");
  lines.push("- Jeunes actifs (25-35 ans) qui cherchent à alimenter leurs conversations au bureau et en soirée");
  lines.push("- Adultes en reconstruction (30-40 ans) qui veulent retrouver leur humour et leur confiance");
  lines.push("");
  lines.push("## Pages ressources");
  lines.push("");
  for (const resource of RESOURCE_PAGES) {
    lines.push(`### ${resource.label}`);
    lines.push("");
    lines.push(`URL : ${BASE_URL}${resource.path}`);
    lines.push("");
    lines.push(resource.summary);
    lines.push("");
  }
  lines.push("## Articles de blog");
  lines.push("");
  for (const article of articles) {
    lines.push(`### ${article.title}`);
    lines.push("");
    lines.push(`URL : ${BASE_URL}/blog/${article.slug}`);
    lines.push(`Catégorie : ${article.category}`);
    lines.push(`Publié : ${article.date}`);
    lines.push("");
    lines.push(`Résumé : ${article.excerpt}`);
    lines.push("");
    lines.push(article.content);
    lines.push("");
    lines.push("---");
    lines.push("");
  }
  return lines.join("\n");
}

export async function GET() {
  try {
    const articles = await collectFullArticles();
    const body = renderLlmsFullTxt(articles);
    return new NextResponse(body, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
      },
    });
  } catch (err) {
    console.error("[llms-full.txt] Erreur génération :", err);
    return new NextResponse(
      "# deviens-marrant.fr\n\nContenu temporairement indisponible.\n",
      {
        status: 200,
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      },
    );
  }
}
