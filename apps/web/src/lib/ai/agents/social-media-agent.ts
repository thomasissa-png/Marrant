import { callWithRetry, extractJson, getResponseText } from "../client";
import { PERSONAS, type PersonaKey, getPersonaForDay } from "../personas";
import { TONALITY_BRIEF } from "./marketing-agent";
import {
  validateSocialPost,
  directorRewriteSocialPost,
  type SocialPostToValidate,
  type ValidationResult,
} from "./standup-director-agent";

// ───────────────────────────────────────────────────────────────────
// Agent Social Media — Community Manager de deviens-marrant.fr
//
// Rôle : générer du contenu social-native pour Twitter, Threads,
// LinkedIn et Instagram. Chaque post est une micro-performance.
//
// Ce n'est PAS un fork du joke-agent. Le ton est plus punchy,
// plus "entre nous", plus spontané. Hook en ≤ 5 mots obligatoire.
//
// Pipeline : generate → Director validate → DB pending → admin approve → publish
// ───────────────────────────────────────────────────────────────────

const MAX_VALIDATION_ATTEMPTS = 3;

// ─── Types ──────────────────────────────────────────────────────

export type SocialPlatform = "TWITTER" | "THREADS" | "LINKEDIN" | "INSTAGRAM";

export type SocialFormat =
  | "TWEET"
  | "THREAD"
  | "CAROUSEL"
  | "POST"
  | "QUOTE_ANALYSIS"
  | "TECHNIQUE_DU_JOUR";

export interface GeneratedSocialPost {
  platform: SocialPlatform;
  format: SocialFormat;
  hook: string;
  content: string;
  threadParts?: string[]; // For threads: array of individual tweets
  cta: string;
  hashtags: string[];
  targetPersona: PersonaKey;
  sourceType?: "JOKE" | "TIP" | "VIDEO" | "BLOG" | "ORIGINAL";
  sourceId?: string;
}

interface DailyPostPlan {
  format: SocialFormat;
  theme: string;
  platform: SocialPlatform;
  sourceType?: string;
}

// ─── System Prompt — Social-Native Brief ────────────────────────

function buildSocialBrief(): string {
  return `Tu es le COMMUNITY MANAGER de deviens-marrant.fr — la plateforme n°1 pour progresser en humour et stand-up en France.

═══ QUI TU ES ═══
Tu es un PERFORMER SOCIAL. Chaque post est un micro-spectacle de stand-up.
Tu n'es PAS un copier-coller du site. Tu RÉÉCRIS tout pour le format social.
Tu penses comme les meilleurs comptes humour français (Topito, Les Joies du Code) — mais avec notre angle unique : enseigner les techniques de stand-up.

═══ TON — PLUS PUNCHY QUE LE SITE ═══
- Chaque mot compte, 0 filler, 0 introduction inutile
- Comme un DM à un pote (pas un post corporate)
- Spontané — pas de structure "titre → explication → conclusion"
- Provocateur sans être offensant — pique la curiosité
- Tutoiement systématique

═══ VOIX DE MARQUE ═══
${TONALITY_BRIEF.principles.map((p) => `- ${p}`).join("\n")}

INTERDIT :
${TONALITY_BRIEF.doNot.map((d) => `- ${d}`).join("\n")}

═══ RÈGLES NON NÉGOCIABLES ═══
1. Hook en ≤ 5 mots — si le premier mot n'accroche pas, c'est raté
2. Autonome — compréhensible sans connaître le site
3. Shareable — "j'envoie ça à mon pote" OU c'est raté
4. Zéro lien dans les 3 premières lignes (algorithme pénalise)
5. CTA subtil en fin ("plus de techniques → lien en bio")
6. JAMAIS d'engagement bait générique :
   - PAS de "complète cette vanne"
   - PAS de "note de 1 à 10"
   - PAS de "tag un ami"
   - PAS de "like si tu es d'accord"
7. Émojis : max 2 par post, jamais en ouverture, jamais 📣🔥💯

═══ FORMAT SIGNATURE : "TECHNIQUE DU JOUR" ═══
Structure : [Hook accrocheur ≤ 5 mots] → [Humoriste + technique concrète] → [Comment TU l'utilises ce soir] → [CTA subtil]

Exemple BON :
"Fary ne répond JAMAIS à une attaque.
Il la répète. Lentement. Avec un sourire.
Et toute la salle se retourne contre l'attaquant.

Technique : le miroir comique.

Essaie ce soir : quelqu'un te chambre → répète sa phrase mot pour mot, plus lentement. Regarde sa tête.

50+ techniques comme celle-ci → deviens-marrant.fr"

Exemple MAUVAIS (REJETÉ) :
"📣 Astuce humour du jour !
Saviez-vous que les humoristes utilisent le silence ?
👇 Dites-nous en commentaire votre technique préférée !"

═══ PERSONAS ═══
${Object.entries(PERSONAS)
  .map(
    ([, p]) =>
      `• ${p.name} (${p.age} ans) — ${p.description}\n  Intérêts : ${p.interests.join(", ")}\n  Ton : ${p.tone}`,
  )
  .join("\n\n")}

═══ HUMORISTES DE RÉFÉRENCE ═══
Prioritaires : Paul Mirabel, Fary, Roman Frayssinet, Blanche Gardin, Waly Dia, Pierre Croce, Inès Reg
Legacy (max 1 mention) : Jamel Debbouze, Gad Elmaleh, Florence Foresti`;
}

// ─── Génération des posts quotidiens ────────────────────────────

/**
 * Génère les posts sociaux du jour.
 * Appelé par le cron /api/cron/daily-social à 4h UTC.
 *
 * Phase 1 : Twitter uniquement (2-3 posts/jour)
 */
export async function generateDailySocialPosts(
  dayOfMonth: number,
): Promise<GeneratedSocialPost[]> {
  const persona = getPersonaForDay(dayOfMonth);
  const dayOfWeek = new Date().getDay(); // 0=dimanche

  // Plan de la journée selon le jour de la semaine
  const plan = getDailyPlan(dayOfWeek, persona);
  const posts: GeneratedSocialPost[] = [];

  for (const entry of plan) {
    try {
      const post = await generateSinglePost(entry, persona);
      // Director validation pipeline
      const validated = await validateAndRefinePost(post, persona);
      posts.push(validated);
    } catch (err) {
      console.error(
        `[SocialAgent] Erreur génération ${entry.format}:`,
        err,
      );
      // Continue with other posts — don't fail the whole batch
    }
  }

  return posts;
}

function getDailyPlan(
  dayOfWeek: number,
  persona: PersonaKey,
): DailyPostPlan[] {
  const p = PERSONAS[persona];
  const plans: Record<number, DailyPostPlan[]> = {
    1: [
      // Lundi
      {
        format: "TECHNIQUE_DU_JOUR",
        theme: `Technique de stand-up pour ${p.name} — début de semaine, besoin d'énergie`,
        platform: "TWITTER",
        sourceType: "TIP",
      },
      {
        format: "TWEET",
        theme: `Vanne courte liée à ${p.interests[0]} — format micro-performance`,
        platform: "TWITTER",
        sourceType: "JOKE",
      },
    ],
    2: [
      // Mardi
      {
        format: "QUOTE_ANALYSIS",
        theme: `Analyse d'une technique d'un humoriste prioritaire`,
        platform: "TWITTER",
        sourceType: "VIDEO",
      },
      {
        format: "TWEET",
        theme: `Vanne observationnelle sur ${p.interests[1]}`,
        platform: "TWITTER",
        sourceType: "JOKE",
      },
    ],
    3: [
      // Mercredi
      {
        format: "TECHNIQUE_DU_JOUR",
        theme: `Technique de répartie / timing — milieu de semaine`,
        platform: "TWITTER",
        sourceType: "TIP",
      },
      {
        format: "THREAD",
        theme: `Thread décryptage : 3-5 techniques d'un humoriste dans un set précis`,
        platform: "TWITTER",
        sourceType: "VIDEO",
      },
    ],
    4: [
      // Jeudi
      {
        format: "QUOTE_ANALYSIS",
        theme: `Citation + analyse technique — humoriste moderne`,
        platform: "TWITTER",
        sourceType: "VIDEO",
      },
      {
        format: "TWEET",
        theme: `Vanne situation quotidienne ${p.name}`,
        platform: "TWITTER",
        sourceType: "JOKE",
      },
    ],
    5: [
      // Vendredi
      {
        format: "TECHNIQUE_DU_JOUR",
        theme: `Technique à tester ce weekend — contexte soirée/social`,
        platform: "TWITTER",
        sourceType: "TIP",
      },
      {
        format: "TWEET",
        theme: `Vanne weekend — léger, shareable, contexte soirée`,
        platform: "TWITTER",
        sourceType: "JOKE",
      },
    ],
    6: [
      // Samedi
      {
        format: "THREAD",
        theme: `Thread viral : "X techniques de stand-up que tu peux utiliser ce soir"`,
        platform: "TWITTER",
        sourceType: "BLOG",
      },
    ],
    0: [
      // Dimanche
      {
        format: "TWEET",
        theme: `Vanne légère dimanche — observation relatable, ton détendu`,
        platform: "TWITTER",
        sourceType: "JOKE",
      },
    ],
  };

  return plans[dayOfWeek] || plans[1];
}

// ─── Génération d'un post unique ────────────────────────────────

async function generateSinglePost(
  plan: DailyPostPlan,
  persona: PersonaKey,
): Promise<GeneratedSocialPost> {
  const p = PERSONAS[persona];

  const formatInstructions = getFormatInstructions(plan.format, plan.platform);

  const response = await callWithRetry({
    model: "claude-sonnet-4-20250514",
    max_tokens: plan.format === "THREAD" ? 2000 : 800,
    system: buildSocialBrief(),
    messages: [
      {
        role: "user",
        content: `Crée un post ${plan.platform} au format ${plan.format}.

Persona cible : ${p.name} (${p.age} ans — ${p.description})
Intérêts : ${p.interests.join(", ")}
Thème : "${plan.theme}"

${formatInstructions}

RAPPEL : hook ≤ 5 mots, autonome, shareable, zéro engagement bait, CTA subtil en fin.
Avant de répondre, relis ton post et demande-toi : "est-ce que ${p.name} envoie ça à son/sa meilleur(e) pote ?" Si non, recommence.

Réponds en JSON :
{
  "platform": "${plan.platform}",
  "format": "${plan.format}",
  "hook": "Les 5 premiers mots (scroll-stopping)",
  "content": "Le post complet",
  ${plan.format === "THREAD" ? '"threadParts": ["Tweet 1", "Tweet 2", "Tweet 3", "..."],' : ""}
  "cta": "CTA subtil de fin",
  "hashtags": ["2-4 hashtags pertinents, pas génériques"],
  "targetPersona": "${persona}",
  "sourceType": "${plan.sourceType || "ORIGINAL"}"
}`,
      },
    ],
  });

  const text = getResponseText(response);
  return extractJson<GeneratedSocialPost>(text);
}

function getFormatInstructions(
  format: SocialFormat,
  platform: SocialPlatform,
): string {
  switch (format) {
    case "TECHNIQUE_DU_JOUR":
      return `FORMAT : TECHNIQUE DU JOUR
- Nomme un humoriste prioritaire + la technique qu'il/elle utilise
- Explique la technique en 2-3 lignes max
- Donne un exemple concret d'application CE SOIR
- CTA vers le site en dernière ligne
- Max 280 caractères par tweet (ou 4-6 tweets si thread)
- Pas de titre "Technique du jour" — commence direct par le hook`;

    case "TWEET":
      return `FORMAT : TWEET (vanne social-native)
- RÉÉCRITURE d'une vanne pour le format Twitter — pas un copier-coller
- Hook en 5 mots max, punchline qui claque
- Max 280 caractères total
- Doit fonctionner SANS connaître le site
- Le post doit donner envie d'aller voir le profil`;

    case "THREAD":
      return `FORMAT : THREAD TWITTER (5-7 tweets)
- Tweet 1 = hook irrésistible + promesse de valeur
- Tweets 2-5 = contenu (techniques, exemples, exercices)
- Tweet 6 = récap / takeaway
- Dernier tweet = CTA vers le site
- Chaque tweet fait max 280 caractères
- Chaque tweet est autonome ET donne envie de lire le suivant
- Retourne les tweets dans le champ "threadParts"`;

    case "QUOTE_ANALYSIS":
      return `FORMAT : QUOTE ANALYSE
- Citation exacte ou paraphrase d'un passage d'humoriste
- Analyse de la technique utilisée en 2-3 lignes
- "Comment tu peux l'utiliser" en 1-2 lignes
- Max ${platform === "LINKEDIN" ? "1300" : "280"} caractères`;

    case "POST":
      return `FORMAT : POST ${platform}
- Adapté au format ${platform} (longueur, ton, structure)
- ${platform === "LINKEDIN" ? "Ton professionnel mais pas corporate — angle communication/leadership" : "Ton décontracté"}
- Max ${platform === "LINKEDIN" ? "1300" : "280"} caractères`;

    case "CAROUSEL":
      return `FORMAT : CAROUSEL INSTAGRAM (5-7 slides)
- Slide 1 = titre accrocheur (hook visuel)
- Slides 2-5 = contenu (1 idée par slide, phrases courtes)
- Slide 6 = récap / takeaway
- Slide 7 = CTA
- Chaque slide = max 30 mots
- Le texte de chaque slide va dans "threadParts"`;

    default:
      return "";
  }
}

// ─── Validation pipeline avec le Stand-Up Director ──────────────

async function validateAndRefinePost(
  post: GeneratedSocialPost,
  persona: PersonaKey,
): Promise<GeneratedSocialPost> {
  let currentPost = post;

  for (let attempt = 1; attempt <= MAX_VALIDATION_ATTEMPTS; attempt++) {
    let validation: ValidationResult | null = null;

    try {
      const toValidate: SocialPostToValidate = {
        platform: currentPost.platform,
        format: currentPost.format,
        hook: currentPost.hook,
        content: currentPost.content,
        threadParts: currentPost.threadParts,
        cta: currentPost.cta,
        hashtags: currentPost.hashtags,
      };
      validation = await validateSocialPost(toValidate, persona);
    } catch (err) {
      console.warn(
        `[Director] Validation social post échouée (attempt ${attempt}):`,
        err,
      );
      // If validation crashes, publish as-is (graceful fallback)
      break;
    }

    if (!validation) break; // Validation failed to return a result

    if (validation.verdict === "APPROVED") {
      console.log(
        `[Director] Post social validé (score ${validation.score}/10, attempt ${attempt})`,
      );
      return currentPost;
    }

    if (attempt === MAX_VALIDATION_ATTEMPTS) {
      // 3 échecs → le directeur réécrit
      console.log(
        `[Director] Post social rejeté ${MAX_VALIDATION_ATTEMPTS}x — le directeur réécrit`,
      );
      try {
        const toValidate: SocialPostToValidate = {
          platform: currentPost.platform,
          format: currentPost.format,
          hook: currentPost.hook,
          content: currentPost.content,
          threadParts: currentPost.threadParts,
          cta: currentPost.cta,
          hashtags: currentPost.hashtags,
        };
        const rewritten = await directorRewriteSocialPost(
          toValidate,
          validation,
          persona,
        );
        return { ...currentPost, ...rewritten };
      } catch (err) {
        console.warn(
          "[Director] Réécriture social post échouée — publication de la dernière version:",
          err,
        );
        return currentPost;
      }
    }

    // Re-generate with feedback
    console.log(
      `[Director] Post social NEEDS_REVISION (score ${validation.score}) — re-génération avec feedback (attempt ${attempt})`,
    );

    try {
      const feedbackResponse = await callWithRetry({
        model: "claude-sonnet-4-20250514",
        max_tokens: currentPost.format === "THREAD" ? 2000 : 800,
        system: buildSocialBrief(),
        messages: [
          {
            role: "user",
            content: `RÉÉCRITURE — Le directeur artistique a rejeté ton post.

POST REJETÉ :
"${currentPost.content}"

FEEDBACK DU DIRECTEUR :
${validation.issues.map((i) => `- ${i}`).join("\n")}
${validation.revision ? `\nSuggestion : ${validation.revision}` : ""}
Note : ${validation.directorNote}

RÉÉCRIS le post en corrigeant TOUS les problèmes.
Même format (${currentPost.format}), même persona (${persona}), même plateforme (${currentPost.platform}).

Réponds en JSON :
{
  "platform": "${currentPost.platform}",
  "format": "${currentPost.format}",
  "hook": "Hook réécrit (≤ 5 mots)",
  "content": "Post réécrit",
  ${currentPost.format === "THREAD" ? '"threadParts": ["Tweet 1", "..."],' : ""}
  "cta": "CTA réécrit",
  "hashtags": ["hashtags"],
  "targetPersona": "${persona}",
  "sourceType": "${currentPost.sourceType || "ORIGINAL"}"
}`,
          },
        ],
      });

      const text = getResponseText(feedbackResponse);
      currentPost = extractJson<GeneratedSocialPost>(text);
    } catch (err) {
      console.warn(
        `[SocialAgent] Re-génération échouée (attempt ${attempt}):`,
        err,
      );
      break;
    }
  }

  return currentPost;
}

// ─── Helpers ────────────────────────────────────────────────────

/**
 * Calcule l'heure de publication optimale pour un persona.
 */
export function getOptimalScheduleTime(
  persona: PersonaKey,
  postIndex: number,
): Date {
  const now = new Date();
  const today = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  );

  // Horaires optimaux par persona (en heures UTC)
  const schedules: Record<PersonaKey, number[]> = {
    YANIS: [19, 21], // 21h-23h Paris (UTC+2)
    SOPHIE: [7, 11], // 9h + 13h Paris
    MARC: [6, 18], // 8h + 20h Paris
  };

  const hours = schedules[persona];
  const hour = hours[postIndex % hours.length];

  today.setUTCHours(hour, Math.floor(Math.random() * 15), 0, 0);
  return today;
}
