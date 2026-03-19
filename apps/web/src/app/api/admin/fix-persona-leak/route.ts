import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

/**
 * POST /api/admin/fix-persona-leak
 *
 * One-shot script: scans all published BlogArticles in DB and replaces
 * internal persona names (Yanis, Sophie, Marc) with generic alternatives.
 *
 * Protected by CRON_SECRET. Safe to run multiple times (idempotent).
 */

// Replacement rules — order matters (longer patterns first to avoid partial matches)
const REPLACEMENTS: Array<[RegExp, string]> = [
  // Full sentences with persona names addressing the reader
  [/\bYanis, Sophie, Marc\b/g, "Que tu sois étudiant, jeune actif ou en pleine reconstruction"],
  [/\bYanis, Sophie et Marc\b/g, "Que tu sois étudiant, jeune actif ou en pleine reconstruction"],
  [/\bSophie, si tu veux\b/g, "Si tu veux"],
  [/\bYanis, si tu veux\b/g, "Si tu veux"],
  [/\bMarc, si tu veux\b/g, "Si tu veux"],
  // "Pour Sophie au bureau" → "Au bureau"
  [/\bPour Sophie au bureau\b/g, "Au bureau"],
  [/\bPour Sophie\b/g, "Au bureau"],
  [/\bPour Yanis\b/g, "En soirée"],
  [/\bPour Marc\b/g, "Quand tu reprends confiance"],
  // "Sophie pourrait dire" → "tu pourrais dire"
  [/\bSophie pourrait\b/g, "tu pourrais"],
  [/\bYanis pourrait\b/g, "tu pourrais"],
  [/\bMarc pourrait\b/g, "tu pourrais"],
  // "Marc qui reprend confiance" → "Reprendre confiance"
  [/\bMarc qui reprend\b/g, "Reprendre"],
  [/\bMarc qui\b/g, "Quand tu"],
  [/\bSophie qui\b/g, "Quand tu"],
  [/\bYanis qui\b/g, "Quand tu"],
  // Standalone persona names in context
  [/\bcomme Yanis\b/g, "comme toi"],
  [/\bcomme Sophie\b/g, "comme toi"],
  [/\bcomme Marc\b/g, "comme toi"],
];

// Final catch-all: any remaining "Yanis"/"Sophie"/"Marc" used as persona references
// Only applied if surrounded by common persona-context words
const CATCH_ALL: Array<[RegExp, string]> = [
  [/\bYanis\b/g, "tu"],
  [/\bSophie\b/g, "tu"],
  [/\bMarc\b/g, "tu"],
];

function cleanPersonaNames(text: string): { cleaned: string; replacements: string[] } {
  let result = text;
  const applied: string[] = [];

  for (const [pattern, replacement] of REPLACEMENTS) {
    const before = result;
    result = result.replace(pattern, replacement);
    if (result !== before) {
      applied.push(`${pattern.source} → "${replacement}"`);
    }
  }

  // Catch-all: only if the name is still present after specific replacements
  for (const [pattern, replacement] of CATCH_ALL) {
    const before = result;
    result = result.replace(pattern, replacement);
    if (result !== before) {
      applied.push(`catch-all: ${pattern.source} → "${replacement}"`);
    }
  }

  return { cleaned: result, replacements: applied };
}

export async function POST(request: Request) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const personaPattern = /\b(Yanis|Sophie|Marc)\b/;

  // Find all published articles containing persona names
  const allArticles = await prisma.blogArticle.findMany({
    where: { isPublished: true },
    select: { id: true, slug: true, title: true, content: true, excerpt: true },
  });

  const affected: Array<{
    slug: string;
    title: string;
    fields: string[];
    replacements: string[];
  }> = [];

  for (const article of allArticles) {
    const contentHasPersona = personaPattern.test(article.content);
    const excerptHasPersona = personaPattern.test(article.excerpt);
    const titleHasPersona = personaPattern.test(article.title);

    if (!contentHasPersona && !excerptHasPersona && !titleHasPersona) {
      continue;
    }

    const fields: string[] = [];
    const allReplacements: string[] = [];
    const updateData: Record<string, string> = {};

    if (contentHasPersona) {
      const { cleaned, replacements } = cleanPersonaNames(article.content);
      updateData.content = cleaned;
      fields.push("content");
      allReplacements.push(...replacements);
    }

    if (excerptHasPersona) {
      const { cleaned, replacements } = cleanPersonaNames(article.excerpt);
      updateData.excerpt = cleaned;
      fields.push("excerpt");
      allReplacements.push(...replacements);
    }

    if (titleHasPersona) {
      const { cleaned, replacements } = cleanPersonaNames(article.title);
      updateData.title = cleaned;
      fields.push("title");
      allReplacements.push(...replacements);
    }

    await prisma.blogArticle.update({
      where: { id: article.id },
      data: updateData,
    });

    affected.push({
      slug: article.slug,
      title: article.title,
      fields,
      replacements: allReplacements,
    });
  }

  return NextResponse.json({
    success: true,
    totalScanned: allArticles.length,
    totalFixed: affected.length,
    articles: affected,
  });
}

/**
 * GET — Dry run: shows which articles would be affected without modifying.
 */
export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const personaPattern = /\b(Yanis|Sophie|Marc)\b/g;

  const allArticles = await prisma.blogArticle.findMany({
    where: { isPublished: true },
    select: { slug: true, title: true, content: true, excerpt: true },
  });

  const affected: Array<{
    slug: string;
    title: string;
    matches: string[];
  }> = [];

  for (const article of allArticles) {
    const allText = `${article.title} ${article.excerpt} ${article.content}`;
    const matches = allText.match(personaPattern);
    if (matches && matches.length > 0) {
      affected.push({
        slug: article.slug,
        title: article.title,
        matches: Array.from(new Set(matches)),
      });
    }
  }

  return NextResponse.json({
    dryRun: true,
    totalScanned: allArticles.length,
    totalAffected: affected.length,
    articles: affected,
    usage: "POST pour appliquer les corrections",
  });
}
