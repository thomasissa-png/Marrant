import { callWithRetry, extractJson, getResponseText } from "../client";
import { prisma } from "@/lib/prisma";

/**
 * Agent SEO — Génère des articles de blog optimisés pour le référencement.
 * Fonctionne en 2 phases :
 * 1. Planification : analyse les mots-clés manquants et planifie le calendrier
 * 2. Rédaction : génère un article complet optimisé SEO
 */

// Mots-clés cibles prioritaires, regroupés par intention de recherche
const TARGET_KEYWORDS = [
  // Requêtes principales (volume élevé)
  "comment devenir drôle",
  "devenir drôle",
  "comment devenir marrant",
  "devenir marrant",
  "avoir de la répartie",
  "comment avoir de la répartie",
  "devenir plus drôle",
  "apprendre à être drôle",
  "comment faire rire",
  "être drôle en société",
  // Requêtes longue traîne liées aux personas
  "avoir de la répartie quand on est timide",
  "comment être drôle à la machine à café",
  "comment être plus drôle en soirée",
  "retrouver son humour après une rupture",
  "comment avoir de la conversation au travail",
  "comment ne pas rester muet quand on me chambre",
  "comment faire rire ses amis",
  "comment raconter une blague sans la rater",
  "exercices pour devenir plus drôle",
  "développer son sens de l'humour",
  // Requêtes connexes
  "techniques de storytelling humour",
  "comment improviser des blagues",
  "les différents types d'humour",
  "comment être plus à l'aise en société",
  "comment briser la glace avec humour",
  "avoir confiance en soi grâce à l'humour",
  "comment être le mec drôle du groupe",
  "apprendre la répartie",
  "cours d'humour en ligne",
  "progression humour débutant",
];

interface ArticlePlan {
  targetKeyword: string;
  title: string;
  slug: string;
  category: string;
  outline: string;
  notes: string;
}

interface GeneratedArticle {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  readingTime: string;
  targetKeyword: string;
  metaTitle: string;
  metaDescription: string;
}

/**
 * Phase 1 : Planification SEO — Analyse les articles existants et les mots-clés
 * déjà couverts, puis planifie le prochain article à écrire.
 */
export async function planNextArticle(): Promise<ArticlePlan | null> {
  // Récupérer les articles déjà publiés (statiques + DB)
  const { blogArticles } = await import("@/lib/blog-articles");
  const dbArticles = await prisma.blogArticle.findMany({
    where: { isPublished: true },
    select: { title: true, targetKeyword: true, slug: true },
  });

  const existingTitles = [
    ...blogArticles.map((a) => a.title),
    ...dbArticles.map((a) => a.title),
  ];
  const existingKeywords = [
    ...blogArticles.map((a) => a.slug),
    ...dbArticles.map((a) => a.targetKeyword),
  ];

  // Vérifier les entrées du calendrier déjà planifiées
  const plannedEntries = await prisma.seoCalendar.findMany({
    where: { status: "PLANNED" },
    select: { targetKeyword: true },
  });
  const plannedKeywords = plannedEntries.map((e) => e.targetKeyword);

  const response = await callWithRetry({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1500,
    system: `Tu es un expert SEO francophone spécialisé dans le domaine de l'humour et du développement personnel. Tu planifies des articles de blog pour deviens-marrant.fr, une plateforme qui enseigne l'humour, la répartie et le storytelling.

Ton objectif : identifier le mot-clé le plus stratégique pour le prochain article et proposer un plan optimisé pour le référencement Google et les LLM (ChatGPT, Perplexity, Claude).

Règles :
- L'article doit cibler un mot-clé pas encore couvert ou insuffisamment couvert
- Le titre doit contenir le mot-clé principal naturellement
- Le slug doit être court et contenir le mot-clé (en minuscules, sans accents, tirets)
- L'article doit viser une position 0 (featured snippet) sur Google
- Le contenu doit être actionnable, avec des exemples concrets et des exercices
- Adapter le ton aux 3 personas : Yanis (20 ans, étudiant timide), Sophie (26 ans, jeune active), Marc (34 ans, en reconstruction)`,
    messages: [
      {
        role: "user",
        content: `Voici les articles déjà publiés :
${existingTitles.map((t) => `- ${t}`).join("\n")}

Voici les mots-clés déjà planifiés mais pas encore publiés :
${plannedKeywords.map((k) => `- ${k}`).join("\n") || "Aucun"}

Voici la liste complète des mots-clés cibles :
${TARGET_KEYWORDS.map((k) => `- ${k}`).join("\n")}

Choisis LE mot-clé le plus stratégique à cibler maintenant (celui qui n'est pas encore couvert et qui a le plus de potentiel) et propose un plan d'article.

Réponds UNIQUEMENT en JSON :
{
  "targetKeyword": "le mot-clé principal ciblé",
  "title": "Titre optimisé SEO (max 65 caractères, contient le mot-clé)",
  "slug": "slug-de-l-article",
  "category": "GUIDE|REPARTIE|TIMING|STORYTELLING|OBSERVATION|AUTODERISION",
  "outline": "Plan détaillé de l'article en 6-8 sections",
  "notes": "Justification du choix de ce mot-clé"
}`,
      },
    ],
  });

  const text = getResponseText(response);
  try {
    return extractJson<ArticlePlan>(text);
  } catch {
    console.error("Erreur parsing plan SEO:", text);
    return null;
  }
}

/**
 * Phase 2 : Rédaction — Génère l'article complet à partir du plan.
 */
export async function generateArticle(
  plan: ArticlePlan,
): Promise<GeneratedArticle | null> {
  const response = await callWithRetry({
    model: "claude-sonnet-4-20250514",
    max_tokens: 8000,
    system: `Tu es un rédacteur SEO expert et un passionné d'humour. Tu rédiges des articles de blog pour deviens-marrant.fr.

RÈGLES DE RÉDACTION :
- Longueur : 2000-3000 mots
- Ton : complice, bienveillant, tutoiement, exemples concrets du quotidien
- Structure : Introduction accrocheuse → Sections avec sous-titres → Exercices pratiques → CTA vers deviens-marrant.fr
- SEO : Le mot-clé principal doit apparaître naturellement dans l'intro, 2-3 sous-titres, et la conclusion
- Personas : Référencer les situations des 3 personas (étudiant timide, jeune active au bureau, adulte en reconstruction)
- Références : Citer des humoristes français (Jamel Debbouze, Gad Elmaleh, Florence Foresti, Blanche Gardin, Fary, Paul Mirabel)
- Format : Texte brut avec paragraphes séparés par des doubles retours à la ligne. Pas de markdown (#, *, etc.)
- Les sous-titres sont des lignes de texte seules (sans # ni mise en forme)
- Chaque section doit avoir un contenu actionnable (pas juste de la théorie)
- Terminer par un CTA naturel vers deviens-marrant.fr

INTERDICTIONS :
- Pas de ton corporate ou académique
- Pas de listes à puces (intègre les points dans le texte narratif)
- Pas d'emojis
- Pas de "dans cet article, nous allons voir..."
- Pas de plagiat — contenu 100% original`,
    messages: [
      {
        role: "user",
        content: `Rédige un article de blog complet avec les spécifications suivantes :

Mot-clé cible : "${plan.targetKeyword}"
Titre : "${plan.title}"
Catégorie : ${plan.category}
Plan : ${plan.outline}

Réponds UNIQUEMENT en JSON :
{
  "title": "${plan.title}",
  "slug": "${plan.slug}",
  "excerpt": "Résumé accrocheur de 150-200 caractères qui donne envie de cliquer (contient le mot-clé)",
  "content": "Contenu complet de l'article (2000-3000 mots, paragraphes séparés par \\n\\n)",
  "category": "${plan.category}",
  "readingTime": "X min",
  "targetKeyword": "${plan.targetKeyword}",
  "metaTitle": "Titre SEO optimisé (max 60 caractères, contient le mot-clé)",
  "metaDescription": "Description meta de 150-160 caractères, contient le mot-clé, incite au clic"
}`,
      },
    ],
  });

  const text = getResponseText(response);
  try {
    return extractJson<GeneratedArticle>(text);
  } catch {
    console.error("Erreur parsing article SEO:", text.slice(0, 500));
    return null;
  }
}

/**
 * Pipeline complet : planifier → générer → publier → mettre à jour le calendrier.
 */
export async function publishWeeklyArticle(): Promise<{
  success: boolean;
  article?: { title: string; slug: string };
  error?: string;
}> {
  try {
    // 1. Planifier
    console.log("[SEO Agent] Phase 1 : Planification...");
    const plan = await planNextArticle();
    if (!plan) {
      return { success: false, error: "Impossible de planifier l'article" };
    }
    console.log(`[SEO Agent] Mot-clé ciblé : "${plan.targetKeyword}"`);

    // 2. Vérifier que l'article n'existe pas déjà
    const existing = await prisma.blogArticle.findUnique({
      where: { slug: plan.slug },
    });
    if (existing) {
      return {
        success: false,
        error: `Article avec le slug "${plan.slug}" existe déjà`,
      };
    }

    // 3. Générer l'article
    console.log("[SEO Agent] Phase 2 : Rédaction...");
    const article = await generateArticle(plan);
    if (!article) {
      return { success: false, error: "Impossible de générer l'article" };
    }

    // 4. Publier en base
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

    // 5. Mettre à jour le calendrier SEO
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
        notes: plan.notes,
      },
      update: {
        status: "PUBLISHED",
        articleId: dbArticle.id,
        articleTitle: article.title,
        notes: plan.notes,
      },
    });

    console.log(`[SEO Agent] Article publié : "${article.title}"`);

    return {
      success: true,
      article: { title: article.title, slug: article.slug },
    };
  } catch (error) {
    console.error("[SEO Agent] Erreur:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * Planification du calendrier SEO pour les 4 prochaines semaines.
 * Analyse les articles existants et planifie les prochains mots-clés à cibler.
 */
export async function updateSeoCalendar(): Promise<{
  planned: { week: number; keyword: string }[];
}> {
  const now = new Date();
  const currentWeek = getISOWeekNumber(now);
  const year = now.getFullYear();
  const planned: { week: number; keyword: string }[] = [];

  // Vérifier les 4 prochaines semaines
  for (let i = 0; i < 4; i++) {
    const targetWeek = currentWeek + i;
    const targetYear = targetWeek > 52 ? year + 1 : year;
    const normalizedWeek = targetWeek > 52 ? targetWeek - 52 : targetWeek;

    const existing = await prisma.seoCalendar.findUnique({
      where: {
        weekNumber_year: { weekNumber: normalizedWeek, year: targetYear },
      },
    });

    if (!existing) {
      // Planifier cette semaine
      const plan = await planNextArticle();
      if (plan) {
        await prisma.seoCalendar.create({
          data: {
            weekNumber: normalizedWeek,
            year: targetYear,
            targetKeyword: plan.targetKeyword,
            articleTitle: plan.title,
            status: "PLANNED",
            notes: plan.notes,
          },
        });
        planned.push({ week: normalizedWeek, keyword: plan.targetKeyword });
      }
    }
  }

  return { planned };
}

function getISOWeekNumber(date: Date): number {
  const d = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()),
  );
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}
