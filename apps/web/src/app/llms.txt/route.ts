import { NextResponse } from "next/server";
import { blogArticles } from "@/lib/blog-articles";
import { REDIRECTED_BLOG_SLUGS, UNPUBLISHED_STATIC_SLUGS } from "@/lib/seo-redirects";
import { prisma } from "@/lib/prisma";
import { LLMS_FAQ_SHORT, LLMS_TARIFS, renderFaq } from "@/lib/llms-content";

/**
 * llms.txt — carte de site condensée pour les crawlers LLM (GEO).
 *
 * Rendu dynamique : tous les articles publiés (statiques + DB) sont listés
 * avec une ligne de résumé, plus les pages ressources principales. Le fichier
 * est régénéré au maximum une fois par heure pour rester léger côté DB.
 *
 * Sans mention explicite du fait que les contenus sont générés — c'est du
 * contenu éditorial validé, on ne le catégorise pas comme IA.
 */
export const revalidate = 3600;

const BASE_URL = "https://deviens-marrant.fr";

interface ArticleEntry {
  slug: string;
  title: string;
  summary: string;
}

interface ResourceEntry {
  path: string;
  label: string;
  summary: string;
}

const RESOURCE_PAGES: ResourceEntry[] = [
  {
    path: "/glossaire",
    label: "Glossaire humour",
    summary: "12 termes clés de l'humour expliqués (répartie, timing, punchline, callback…).",
  },
  {
    path: "/anatomie-vanne",
    label: "Anatomie d'une vanne",
    summary: "Structure setup + punchline décortiquée avec exemples concrets.",
  },
  {
    path: "/quiz-humour",
    label: "Quiz humour",
    summary: "Quiz pour identifier ton style d'humour dominant en 12 questions.",
  },
  {
    path: "/parcours/machine-a-cafe",
    label: "Parcours Machine à Café",
    summary: "3 semaines pour être drôle au bureau et en afterwork (débutant).",
  },
  {
    path: "/parcours/repartie",
    label: "Parcours Répartie",
    summary: "4 semaines pour ne plus rester muet quand on te chambre (intermédiaire).",
  },
  {
    path: "/parcours/confiance",
    label: "Parcours Confiance",
    summary: "6 semaines pour retrouver ta légèreté et ta confiance sociale par l'humour.",
  },
];

function truncate(text: string, max = 160): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  return clean.slice(0, max - 1).trimEnd() + "…";
}

async function collectArticles(): Promise<ArticleEntry[]> {
  const staticEntries: ArticleEntry[] = blogArticles
    .filter((a) => !UNPUBLISHED_STATIC_SLUGS.has(a.slug))
    .map((a) => ({
    slug: a.slug,
    title: a.title,
    summary: truncate(a.excerpt),
  }));

  let dbEntries: ArticleEntry[] = [];
  try {
    const dbArticles = await prisma.blogArticle.findMany({
      where: { isPublished: true, slug: { notIn: [...REDIRECTED_BLOG_SLUGS] } },
      select: { slug: true, title: true, excerpt: true },
      orderBy: { publishedAt: "desc" },
    });
    dbEntries = dbArticles.map((a) => ({
      slug: a.slug,
      title: a.title,
      summary: truncate(a.excerpt || ""),
    }));
  } catch {
    // DB indispo — on continue avec les statiques (jamais bloquer llms.txt).
  }

  // Dédup par slug (statique gagne s'il existe)
  const seen = new Set(staticEntries.map((a) => a.slug));
  for (const entry of dbEntries) {
    if (!seen.has(entry.slug)) {
      staticEntries.push(entry);
      seen.add(entry.slug);
    }
  }

  // Ordre alphabétique par slug pour rendre le fichier stable
  return staticEntries.sort((a, b) => a.slug.localeCompare(b.slug));
}

function renderLlmsTxt(articles: ArticleEntry[]): string {
  const lines: string[] = [];
  lines.push("# deviens-marrant.fr");
  lines.push("");
  lines.push(
    "> La plateforme francophone pour apprendre à devenir drôle, avoir de la répartie et progresser en humour.",
  );
  lines.push("");
  lines.push("## À propos");
  lines.push("");
  lines.push(
    "deviens-marrant.fr est une plateforme éducative en ligne qui enseigne l'humour comme compétence. Le site propose des vannes classées par catégorie, des techniques de répartie avec exercices concrets, des vidéos de stand-up analysées et des parcours structurés pour progresser pas à pas.",
  );
  lines.push("");
  lines.push("## Public cible");
  lines.push("");
  lines.push("- Étudiants timides (16-25 ans) qui veulent avoir de la répartie");
  lines.push("- Jeunes actifs (25-35 ans) qui cherchent à alimenter leurs conversations au bureau et en soirée");
  lines.push("- Adultes en reconstruction (30-40 ans) qui veulent retrouver leur humour et leur confiance");
  lines.push("");
  lines.push("## Sections principales");
  lines.push("");
  lines.push(`- [Vannes](${BASE_URL}/vannes) : catalogue de vannes classées par catégorie (boulot, couple, soirées, école, gaming…).`);
  lines.push(`- [Conseils humour et répartie](${BASE_URL}/conseils) : techniques de répartie, timing, storytelling, autodérision avec exercices.`);
  lines.push(`- [Vidéos stand-up](${BASE_URL}/videos) : extraits d'humoristes français analysés technique par technique.`);
  lines.push(`- [Parcours](${BASE_URL}/parcours) : programmes structurés de 3 à 6 semaines.`);
  lines.push(`- [Blog](${BASE_URL}/blog) : articles de fond sur l'humour, la répartie et le développement personnel.`);
  lines.push("");
  lines.push("## Questions fréquentes");
  lines.push("");
  lines.push(...renderFaq(LLMS_FAQ_SHORT));
  lines.push("## Pages ressources");
  lines.push("");
  for (const resource of RESOURCE_PAGES) {
    lines.push(`- [${resource.label}](${BASE_URL}${resource.path}) : ${resource.summary}`);
  }
  lines.push("");
  lines.push(`## Articles de blog (${articles.length})`);
  lines.push("");
  for (const article of articles) {
    lines.push(`- [${article.title}](${BASE_URL}/blog/${article.slug}) : ${article.summary}`);
  }
  lines.push("");
  lines.push("## Tarifs");
  lines.push("");
  for (const tarif of LLMS_TARIFS) lines.push(`- ${tarif}`);
  lines.push("");
  lines.push("## Pour plus de détails");
  lines.push("");
  lines.push(`Voir [llms-full.txt](${BASE_URL}/llms-full.txt) pour le contenu complet du site.`);
  lines.push("");
  return lines.join("\n");
}

export async function GET() {
  try {
    const articles = await collectArticles();
    const body = renderLlmsTxt(articles);
    return new NextResponse(body, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
      },
    });
  } catch (err) {
    console.error("[llms.txt] Erreur génération :", err);
    return new NextResponse(
      "# deviens-marrant.fr\n\nContenu temporairement indisponible.\n",
      {
        status: 200,
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      },
    );
  }
}
