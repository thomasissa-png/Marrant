/**
 * Script de publication manuelle des articles planifiés en retard.
 * Suit le processus de production complet :
 * 1. Lit le seo-editorial-plan.json
 * 2. Génère chaque article via generateArticle()
 * 3. Valide via validateBlogArticle() du Stand-Up Director
 * 4. Si rejeté 3x → directorRewriteBlogArticle()
 * 5. Sauvegarde en DB + met à jour le plan
 *
 * Usage: npx tsx apps/web/scripts/publish-planned-articles.ts
 */

import { resolve } from "path";
import { readFileSync, writeFileSync } from "fs";

// Setup path aliases pour @/
const tsConfigPaths = require("tsconfig-paths");
tsConfigPaths.register({
  baseUrl: resolve(__dirname, ".."),
  paths: { "@/*": ["src/*"] },
});

import { prisma } from "@/lib/prisma";
import { generateArticle } from "@/lib/ai/agents/seo-blog-agent";
import {
  validateBlogArticle,
  directorRewriteBlogArticle,
  type BlogArticleToValidate,
  type ValidationResult,
} from "@/lib/ai/agents/standup-director-agent";
import { getClusterForSlug } from "@/lib/blog-clusters";

const MAX_VALIDATION_ATTEMPTS = 3;

interface EditorialArticle {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  keywordPrimary: string;
  keywordSecondary: string;
  cluster: string;
  type: string;
  persona: string;
  category: string;
  scheduledWeek: number;
  status: string;
  internalLinks: string[];
  wordCountTarget: number;
  formatNote: string;
}

function getISOWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}

async function publishPlannedArticles() {
  const planPath = resolve(__dirname, "../../../seo-editorial-plan.json");
  const plan = JSON.parse(readFileSync(planPath, "utf-8"));

  const currentWeek = getISOWeekNumber(new Date());
  console.log(`\n📅 Semaine actuelle: ${currentWeek}\n`);

  // Trouver les articles planifiés dont la semaine est passée ou en cours
  const overdueArticles: EditorialArticle[] = plan.plannedArticles.filter(
    (a: EditorialArticle) => a.status === "planned" && a.scheduledWeek <= currentWeek
  );

  if (overdueArticles.length === 0) {
    console.log("✅ Aucun article en retard !");
    return;
  }

  console.log(`📝 ${overdueArticles.length} article(s) en retard:\n`);
  for (const a of overdueArticles) {
    console.log(`  - [Sem ${a.scheduledWeek}] "${a.title}" (${a.category}, ${a.type})`);
  }
  console.log();

  const results: Array<{ slug: string; success: boolean; error?: string }> = [];

  for (const planned of overdueArticles) {
    console.log(`\n${"=".repeat(60)}`);
    console.log(`🎯 Publication: "${planned.title}"`);
    console.log(`   Slug: ${planned.slug}`);
    console.log(`   Mot-clé: "${planned.keywordPrimary}"`);
    console.log(`   Catégorie: ${planned.category} | Type: ${planned.type}`);
    console.log(`${"=".repeat(60)}\n`);

    // Vérifier que l'article n'existe pas déjà
    const existingDB = await prisma.blogArticle.findUnique({
      where: { slug: planned.slug },
    });
    if (existingDB) {
      console.log(`⚠️  Article "${planned.slug}" existe déjà en DB — skip`);
      results.push({ slug: planned.slug, success: false, error: "Déjà en DB" });
      continue;
    }

    const { blogArticles } = await import("@/lib/blog-articles");
    if (blogArticles.some((a) => a.slug === planned.slug)) {
      console.log(`⚠️  Article "${planned.slug}" existe déjà en statique — skip`);
      results.push({ slug: planned.slug, success: false, error: "Déjà statique" });
      continue;
    }

    // Générer l'article
    const articlePlan = {
      targetKeyword: planned.keywordPrimary,
      title: planned.title,
      slug: planned.slug,
      category: planned.category,
      outline: planned.formatNote + (planned.internalLinks?.length
        ? `\n\nLiens internes obligatoires: ${planned.internalLinks.join(", ")}`
        : ""),
      notes: `Article planifié semaine ${planned.scheduledWeek}, cluster ${planned.cluster}, persona ${planned.persona}`,
    };

    console.log("[SEO Agent] Phase 2 : Rédaction...");
    let article = await generateArticle(articlePlan);
    if (!article) {
      console.error("❌ Impossible de générer l'article");
      results.push({ slug: planned.slug, success: false, error: "Génération échouée" });
      continue;
    }

    // Validation par le Stand-Up Director
    let validation: ValidationResult | null = null;
    let directorTookOver = false;

    for (let attempt = 1; attempt <= MAX_VALIDATION_ATTEMPTS; attempt++) {
      console.log(`\n[Director] Validation attempt ${attempt}/${MAX_VALIDATION_ATTEMPTS}...`);
      try {
        const toValidate: BlogArticleToValidate = {
          title: article.title,
          slug: article.slug,
          excerpt: article.excerpt,
          content: article.content,
          category: article.category,
          targetKeyword: article.targetKeyword,
        };
        validation = await validateBlogArticle(toValidate);
      } catch (err) {
        console.warn(`[Director] Validation crash (attempt ${attempt}):`, err);
        break;
      }

      console.log(`[Director] Score: ${validation.score}/10 | Verdict: ${validation.verdict}`);
      if (validation.strengths.length) {
        console.log(`   ✅ Forces: ${validation.strengths.join(", ")}`);
      }
      if (validation.issues.length) {
        console.log(`   ❌ Problèmes: ${validation.issues.join(", ")}`);
      }
      if (validation.directorNote) {
        console.log(`   📝 Note: ${validation.directorNote}`);
      }

      if (validation.verdict === "APPROVED") {
        console.log(`\n✅ Article APPROUVÉ par le directeur (score ${validation.score}/10)`);
        break;
      }

      if (attempt === MAX_VALIDATION_ATTEMPTS) {
        console.log(`\n🎬 3 échecs — le directeur RÉÉCRIT lui-même`);
        try {
          const toValidate: BlogArticleToValidate = {
            title: article.title,
            slug: article.slug,
            excerpt: article.excerpt,
            content: article.content,
            category: article.category,
            targetKeyword: article.targetKeyword,
          };
          const rewritten = await directorRewriteBlogArticle(toValidate, validation);
          article = {
            ...article,
            title: rewritten.title,
            excerpt: rewritten.excerpt,
            content: rewritten.content,
            category: rewritten.category,
            metaTitle: rewritten.title.slice(0, 60),
          };
          directorTookOver = true;
          console.log("✅ Article réécrit par le directeur — publication");
        } catch (err) {
          console.error("❌ Réécriture directeur échouée:", err);
        }
        break;
      }

      // Re-générer avec feedback
      console.log(`\n🔄 Re-génération avec feedback du directeur...`);
      const enrichedPlan = {
        ...articlePlan,
        outline: `${articlePlan.outline}\n\n--- FEEDBACK DIRECTEUR ARTISTIQUE ---\nProblèmes: ${validation.issues.join(". ")}\n${validation.revision ? `Corrections: ${validation.revision}` : ""}`,
      };
      const retryArticle = await generateArticle(enrichedPlan);
      if (retryArticle) {
        article = retryArticle;
      }
    }

    // Gate: ne publier que si APPROVED ou réécrit par directeur
    const score = validation?.score ?? 0;
    if (!directorTookOver && validation?.verdict !== "APPROVED" && score < 9) {
      console.error(`\n❌ Article NON PUBLIÉ — score ${score}/10 < 9`);
      results.push({ slug: planned.slug, success: false, error: `Score ${score}/10` });
      continue;
    }

    // Validation programmatique meta
    if (article.metaDescription && article.metaDescription.length > 155) {
      article = { ...article, metaDescription: article.metaDescription.slice(0, 152) + "..." };
    }
    if (article.metaTitle && article.metaTitle.length > 60) {
      article = { ...article, metaTitle: article.metaTitle.slice(0, 57) + "..." };
    }
    if (article.excerpt && article.excerpt.length > 155) {
      article = { ...article, excerpt: article.excerpt.slice(0, 152) + "..." };
    }

    // Anti-cannibalisation par mot-clé
    const existingByKeyword = await prisma.blogArticle.findFirst({
      where: { targetKeyword: article.targetKeyword, isPublished: true },
    });
    if (existingByKeyword) {
      console.error(`\n❌ Cannibalisation: mot-clé déjà ciblé par "${existingByKeyword.slug}"`);
      results.push({ slug: planned.slug, success: false, error: "Cannibalisation" });
      continue;
    }

    // Publier en DB
    const now = new Date();
    const dbArticle = await prisma.blogArticle.create({
      data: {
        slug: article.slug,
        title: article.title,
        excerpt: article.excerpt,
        content: article.content,
        category: article.category,
        readingTime: article.readingTime,
        targetKeyword: article.targetKeyword,
        metaTitle: article.metaTitle,
        metaDescription: article.metaDescription,
        isPublished: true,
        publishedAt: now,
        generatedByAI: true,
      },
    });

    // Post-publication checks
    const linkCount = (dbArticle.content.match(/\]\(\//g) || []).length;
    const wordCount = dbArticle.content.split(/\s+/).length;
    const blogLinkCount = (dbArticle.content.match(/\]\(\/blog\//g) || []).length;
    const cluster = getClusterForSlug(dbArticle.slug);

    console.log(`\n📊 Post-publication checks:`);
    console.log(`   Mots: ${wordCount} | Liens internes: ${linkCount} | Liens blog: ${blogLinkCount}`);
    console.log(`   Cluster: ${cluster?.id ?? "ORPHELIN (fallback catégorie)"}`);
    if (linkCount < 5) console.warn(`   ⚠️  Moins de 5 liens internes`);
    if (wordCount < 1000) console.warn(`   ⚠️  Moins de 1000 mots`);

    // Mettre à jour le calendrier SEO
    const weekNumber = getISOWeekNumber(now);
    const year = now.getFullYear();
    await prisma.seoCalendar.upsert({
      where: { weekNumber_year: { weekNumber, year } },
      create: {
        weekNumber,
        year,
        targetKeyword: article.targetKeyword,
        articleTitle: article.title,
        status: "PUBLISHED",
        articleId: dbArticle.id,
        notes: articlePlan.notes,
      },
      update: {
        status: "PUBLISHED",
        articleId: dbArticle.id,
        articleTitle: article.title,
      },
    });

    // Mettre à jour le statut dans le editorial plan JSON
    const articleInPlan = plan.plannedArticles.find((a: EditorialArticle) => a.slug === planned.slug);
    if (articleInPlan) {
      articleInPlan.status = "published";
      articleInPlan.publishedDate = now.toISOString().split("T")[0];
    }

    console.log(`\n✅ PUBLIÉ: "${article.title}" (${article.slug})`);
    results.push({ slug: planned.slug, success: true });
  }

  // Sauvegarder le plan mis à jour
  writeFileSync(planPath, JSON.stringify(plan, null, 2) + "\n", "utf-8");
  console.log(`\n📋 Plan éditorial mis à jour`);

  // Résumé
  console.log(`\n${"=".repeat(60)}`);
  console.log(`RÉSUMÉ`);
  console.log(`${"=".repeat(60)}`);
  const successes = results.filter((r) => r.success);
  const failures = results.filter((r) => !r.success);
  console.log(`✅ Publiés: ${successes.length}`);
  for (const s of successes) console.log(`   - ${s.slug}`);
  if (failures.length) {
    console.log(`❌ Échoués: ${failures.length}`);
    for (const f of failures) console.log(`   - ${f.slug}: ${f.error}`);
  }

  await prisma.$disconnect();
}

publishPlannedArticles().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
