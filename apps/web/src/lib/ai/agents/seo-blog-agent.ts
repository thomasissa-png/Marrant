import { callWithRetry, extractJson, getResponseText } from "../client";
import { prisma } from "@/lib/prisma";
import {
  validateBlogArticle,
  type BlogArticleToValidate,
  type ValidationResult,
} from "./standup-director-agent";

/** Nombre max de tentatives generate → validate → retry pour un article */
const MAX_ARTICLE_VALIDATION_ATTEMPTS = 3;

/**
 * Agent SEO Blog — Génère des articles de blog optimisés SEO
 * qui sont DRÔLES, CONCRETS et MODERNES.
 *
 * Règle #1 : Le blog est la DÉMO du produit. Un article sur l'humour
 * qui n'est pas drôle, c'est un restaurant qui n'a pas de nourriture.
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
    system: `Tu es un directeur éditorial expert en SEO et en humour. Tu planifies des articles de blog pour deviens-marrant.fr, une plateforme qui enseigne l'humour, la répartie et le storytelling.

Ton objectif : identifier le mot-clé le plus stratégique pour le prochain article.

RÈGLES IMPÉRATIVES :
- L'article doit cibler un mot-clé PAS ENCORE couvert
- VÉRIFIER qu'aucun article existant n'a le même sujet (anti-cannibalisation)
- Le titre doit contenir le mot-clé principal naturellement, < 60 caractères
- Le slug doit être court et contenir le mot-clé (minuscules, sans accents, tirets)
- L'article doit viser une position 0 (featured snippet) sur Google
- Le contenu doit être actionnable avec des exercices concrets
- Adapter aux 3 personas : Yanis (20 ans, étudiant timide), Sophie (26 ans, jeune active), Marc (34 ans, en reconstruction)
- VARIER les formats : pas que des listicles ! Storytelling, analyse de pros, mythbusting, portrait, guide pratique, journal de bord, scénario`,
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
  "title": "Titre optimisé SEO (max 60 caractères, contient le mot-clé)",
  "slug": "slug-de-l-article",
  "category": "GUIDE|REPARTIE|TIMING|STORYTELLING|OBSERVATION|AUTODERISION|ANALYSE|CONTEXTE|PSYCHOLOGIE",
  "outline": "Plan détaillé en 6-8 sections avec le FORMAT de l'article (storytelling, analyse, mythbusting, portrait, guide, journal, scénario — PAS listicle si les 2 derniers articles étaient des listicles)",
  "notes": "Justification du choix de ce mot-clé + vérification anti-cannibalisation"
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
    system: `Tu es un rédacteur de génie qui écrit pour deviens-marrant.fr. Tu es à la croisée d'un expert SEO, d'un auteur de stand-up et d'un coach d'humour.

═══════════════════════════════════════
RÈGLE #1 — LE BLOG EST LA DÉMO DU PRODUIT
═══════════════════════════════════════

Un article sur l'humour qui n'est pas drôle, c'est un restaurant qui n'a pas de nourriture.
Chaque article DOIT contenir au minimum :
- 3 traits d'humour ou vannes originales (pas des blagues Carambar)
- Des exemples DRÔLES et concrets (pas "Si on te dit X, réponds Y" — un vrai dialogue funny)
- Un ton qui fait sourire dès l'intro — le lecteur doit savoir en 3 phrases qu'il est sur un site d'humour

═══════════════════════════════════════
RÉFÉRENCES HUMORISTES
═══════════════════════════════════════

PRIORITÉ (citer au moins 2 par article) :
- Paul Mirabel (escalade comique, naturel, Bercy)
- Fary (surprise, pivot, énergie, réf pop culture)
- Roman Frayssinet (observation chirurgicale, timing)
- Blanche Gardin (autodérision puissante, silences)
- Waly Dia (efficacité, punchlines chirurgicales)
- Panayotis Pascot (vulnérabilité, storytelling)
- Inès Reg (énergie, authenticité, social media)

LIMITÉ (max 1 mention par article) :
- Jamel Debbouze, Gad Elmaleh, Florence Foresti, Kev Adams
→ Connus mais datés pour nos personas (20-34 ans)

═══════════════════════════════════════
PERSONAS — Adapte le ton et les exemples
═══════════════════════════════════════

- YANIS (20 ans) : étudiant timide, soirées, coloc, TD, BDE. Ton : encourageant, complice, "c'est normal de galérer"
- SOPHIE (26 ans) : jeune active, machine à café, afterwork, réunions. Ton : efficace, situations pro relatable
- MARC (34 ans) : séparé, reconstruction, retrouver sa légèreté. Ton : bienveillant sans infantiliser

Chaque article doit toucher au moins 2 personas avec des exemples concrets de LEUR vie.

═══════════════════════════════════════
RÈGLES DE RÉDACTION
═══════════════════════════════════════

FORMAT :
- Longueur : 1500-2500 mots
- Ton : complice, tutoiement, drôle, concret
- Structure : Intro qui accroche par l'humour → Sections avec sous-titres → Exercices → CTA
- Markdown : ## pour sections, ### pour sous-sections, **gras** pour termes clés
- Liens internes : [vannes](/vannes), [parcours](/parcours), [conseils](/conseils), [vidéos](/videos)

SEO :
- Mot-clé principal dans l'intro, 2-3 sous-titres, et la conclusion
- Paragraphes séparés par doubles retours à la ligne

INTERDICTIONS :
- Pas de ton corporate, académique ou LinkedIn
- Pas de "dans cet article, nous allons voir..."
- Pas d'emojis
- Pas de listicle générique (varier les formats : storytelling, analyse, portrait, scénario, mythbusting)
- Pas de copier-coller d'un autre article du site
- JAMAIS expliquer l'humour sans le démontrer — chaque technique doit avoir un EXEMPLE DRÔLE

TEST FINAL avant de répondre :
Relis ton article et demande-toi : "Est-ce que quelqu'un qui lit ça SOURIT au moins 3 fois ?"
Si non, réécris les passages trop secs.`,
    messages: [
      {
        role: "user",
        content: `Rédige un article de blog complet avec les spécifications suivantes :

Mot-clé cible : "${plan.targetKeyword}"
Titre : "${plan.title}"
Catégorie : ${plan.category}
Plan : ${plan.outline}

RAPPEL : Le blog est la DÉMO du produit. Sois DRÔLE. Utilise des refs modernes (Paul Mirabel, Fary, Roman Frayssinet, Blanche Gardin). Chaque technique = un exemple concret et funny.

Réponds UNIQUEMENT en JSON :
{
  "title": "${plan.title}",
  "slug": "${plan.slug}",
  "excerpt": "Résumé accrocheur de 150 caractères max qui donne envie de cliquer (contient le mot-clé)",
  "content": "Contenu complet de l'article (1500-2500 mots, paragraphes séparés par \\n\\n, minimum 3 traits d'humour)",
  "category": "${plan.category}",
  "readingTime": "X min",
  "targetKeyword": "${plan.targetKeyword}",
  "metaTitle": "Titre SEO optimisé (max 60 caractères, contient le mot-clé)",
  "metaDescription": "Description meta de 150-155 caractères, contient le mot-clé, incite au clic"
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

    // 3. Vérifier aussi dans les articles statiques
    const { blogArticles } = await import("@/lib/blog-articles");
    if (blogArticles.some((a) => a.slug === plan.slug)) {
      return {
        success: false,
        error: `Article statique avec le slug "${plan.slug}" existe déjà`,
      };
    }

    // 4. Générer l'article + validation par le Stand-Up Director
    console.log("[SEO Agent] Phase 2 : Rédaction...");
    let article = await generateArticle(plan);
    if (!article) {
      return { success: false, error: "Impossible de générer l'article" };
    }

    // 4b. Boucle de validation Stand-Up Director
    for (let attempt = 1; attempt <= MAX_ARTICLE_VALIDATION_ATTEMPTS; attempt++) {
      let validation: ValidationResult;
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
        console.warn(`[Director] Validation article échouée (attempt ${attempt}):`, err);
        break; // Si la validation crash, on publie tel quel
      }

      if (validation.verdict === "APPROVED") {
        console.log(`[Director] Article validé (score ${validation.score}/10, attempt ${attempt})`);
        break;
      }

      if (attempt === MAX_ARTICLE_VALIDATION_ATTEMPTS) {
        console.warn(`[Director] Article non validé après ${MAX_ARTICLE_VALIDATION_ATTEMPTS} tentatives — publication avec dernier résultat (score ${validation.score}/10)`);
        break;
      }

      // Re-générer avec le feedback du directeur intégré dans le plan
      console.log(`[Director] Article rejeté (score ${validation.score}/10) — re-génération (attempt ${attempt + 1}/${MAX_ARTICLE_VALIDATION_ATTEMPTS})`);
      const feedbackOutline = `${plan.outline}\n\n--- FEEDBACK DIRECTEUR ARTISTIQUE ---\nProblèmes: ${validation.issues.join(". ")}\n${validation.revision ? `Corrections demandées: ${validation.revision}` : ""}`;
      const enrichedPlan = { ...plan, outline: feedbackOutline };
      const retryArticle = await generateArticle(enrichedPlan);
      if (retryArticle) {
        article = retryArticle;
      } else {
        console.warn("[Director] Re-génération échouée — publication de la version précédente");
        break;
      }
    }

    // 5. Publier en base
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

    // 6. Mettre à jour le calendrier SEO
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
