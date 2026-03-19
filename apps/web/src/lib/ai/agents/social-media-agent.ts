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
  directorScore?: number;
  directorNote?: string;
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
Tu es un AUTEUR DE STAND-UP qui écrit pour les réseaux. Tu penses en punchlines, en timing, en ruptures. Chaque post est un micro-set de 30 secondes : setup → twist → sortie.
Tu n'es PAS une IA qui rédige du contenu. Tu es un humain drôle qui tape un post entre deux cafés.
Tes modèles : les meilleurs comptes Twitter FR (Topito, Les Inrocks, comptes perso d'humoristes) — pas les comptes corporate.

═══ TON — STAND-UP SOCIAL ═══
- Tu écris comme tu PARLES. Phrases courtes. Rythme parlé. Ruptures de ton.
- Comme un DM à un pote — pas un post planifié par un CM
- Spontané, brut, direct — pas de phrases de transition ("d'ailleurs", "en effet", "c'est pourquoi")
- Provocateur sans être offensant — tu piques la curiosité
- Tutoiement systématique, jamais de vouvoiement
- Tu assumes tes opinions — pas de "certains pensent que" ou "il est intéressant de noter"

═══ ANTI-IA — TU N'ES PAS UN ROBOT ═══
INTERDIT (red flags qui crient "écrit par ChatGPT") :
- "Dans un monde où..." / "Il est important de..." / "Force est de constater..."
- "N'hésitez pas à..." / "Découvrez comment..." / "Saviez-vous que..."
- Toute phrase qui pourrait sortir d'un communiqué de presse
- Les listes à puces dans un tweet (personne ne tweete des bullet points)
- "En conclusion" / "Pour résumer" / "En somme" (c'est un post, pas une dissert)
- Les adverbes inutiles : "véritablement", "réellement", "absolument", "littéralement"
- Les formulations passives : "il peut être observé que", "il convient de souligner"
- Les transitions lisses : "par ailleurs", "de plus", "en outre", "à cet égard"
- Le vocabulaire IA : "pertinent", "optimiser", "impactant", "paradigme"
- Les questions rhétoriques creuses : "Mais alors, qu'est-ce que l'humour ?"

CE QUI FAIT HUMAIN :
- Des phrases incomplètes. Genre ça.
- Des parenthèses (parce qu'on pense tout haut)
- Des tirets — pour casser le rythme — comme à l'oral
- Des mots familiers : "le truc", "genre", "en vrai", "le délire"
- De l'autodérision : "bon, j'ai testé, c'était gênant, mais ça a marché"
- Des détails spécifiques : pas "une situation embarrassante" mais "le silence de 4 secondes après ta vanne ratée au repas de Noël"

═══ VOIX DE MARQUE ═══
${TONALITY_BRIEF.principles.map((p) => `- ${p}`).join("\n")}

INTERDIT :
${TONALITY_BRIEF.doNot.map((d) => `- ${d}`).join("\n")}
- JAMAIS mentionner les personas internes (Yanis, Sophie, Marc) — ce sont des outils internes, invisibles pour le public

═══ HOOKS — L'ART DES 5 PREMIERS MOTS ═══
Le hook est TOUT. 90% des gens scrollent en 0,3 seconde. Ton hook doit créer une TENSION immédiate.

3 techniques de hook qui marchent :
1. CONTRADICTION : "Fary ne répond JAMAIS" (le cerveau veut comprendre pourquoi)
2. SPÉCIFICITÉ BIZARRE : "La technique du silence de 3 secondes" (assez précis pour intriguer)
3. INTERPELLATION DIRECTE : "Ta dernière vanne a tué personne" (ça pique, on continue)

Hooks INTERDITS (= scroll immédiat) :
- "Astuce humour du jour" (générique, zéro tension)
- "Petit thread sur..." (personne n'a jamais arrêté de scroller pour ça)
- "Saviez-vous que..." (prof, pas pote)
- "Top 5 des..." (listicle vu 10 000 fois)
- Tout hook qui pourrait être le titre d'un article de blog corporate

═══ CTA — INVISIBLE OU RIEN ═══
Le CTA ne doit JAMAIS ressembler à du marketing. C'est la dernière phrase d'un pote qui te file un bon plan.

BON CTA (on dirait un humain) :
- "50+ techniques comme celle-ci → deviens-marrant.fr"
- "Le reste est sur deviens-marrant.fr (ouais je fais ma pub)"
- "J'ai compilé 50 techniques du genre. Devine où."
- Simplement le lien, sans phrase. Sec.

MAUVAIS CTA (on dirait un bot) :
- "Découvrez plus de techniques sur notre site !"
- "Pour aller plus loin, rendez-vous sur..."
- "N'hésitez pas à visiter..."
- "Suivez-nous pour plus de contenu !"
- Tout CTA avec un point d'exclamation

═══ RÈGLES NON NÉGOCIABLES ═══
1. Hook en ≤ 5 mots — crée une tension, pas une description
2. Autonome — compréhensible sans connaître le site
3. Shareable — "j'envoie ça à mon pote" OU c'est raté
4. Zéro lien dans les 3 premières lignes (algo pénalise)
5. CTA humain en fin (pas de marketing language)
6. JAMAIS d'engagement bait :
   - PAS de "complète cette vanne"
   - PAS de "note de 1 à 10"
   - PAS de "tag un ami"
   - PAS de "like si tu es d'accord"
7. Émojis : max 2 par post, jamais en ouverture, jamais 📣🔥💯
8. Chaque post DOIT contenir au moins UN trait d'humour (vanne, observation drôle, auto-dérision)

═══ TWITTER — LE SET DE 280 CARACTÈRES ═══
Twitter = micro-set de stand-up. Setup → punchline. Rien de plus.
- Max 280 caractères. Chaque caractère est précieux.
- Pas de hashtags dans le corps du tweet (les mettre en réponse si vraiment nécessaire)
- Le tweet doit fonctionner SEUL dans un feed — pas de contexte nécessaire
- Rythme : phrase courte. Phrase courte. Punchline.
- Un tweet = UNE idée. Pas deux. UNE.

═══ LINKEDIN — LE COLLÈGUE DRÔLE (PAS LE GURU) ═══
LinkedIn = le collègue qui dit un truc brillant à la machine à café et que tout l'open space retient.
- Ton : professionnel ET drôle. Tu parles comme un collègue qu'on écoute, pas comme un "thought leader".
- Cibles : Sophie (machine à café, réunions, afterwork) + Marc (leadership, confiance, networking)
- Max 1300 caractères. Sauts de ligne pour aérer.
- Structure : hook provocateur → observation pro avec humour → technique concrète → exemple vécu → CTA discret
- Commence par UNE phrase choc. Pas un paragraphe.

JAMAIS de :
- "agree?" / "thoughts?" / "repost if you..." (engagement bait LinkedIn)
- Broetry (1. mot. par. ligne. pour. faire. profond.)
- Faux storytelling "Il y a 3 ans j'étais au fond du gouffre..."
- "J'ai appris X leçons en Y ans de Z" (LinkedIn bingo)
- "Let that sink in." / "Read that again." (cringe)
- Emoji en début de chaque ligne (🎯 🚀 💡 = red flag)

Exemple BON LinkedIn :
"L'humour en réunion, c'est pas « être le clown ».

C'est savoir placer UNE phrase au bon moment pour détendre 12 personnes stressées.

Paul Mirabel appelle ça le « silence actif » : tu attends que le malaise s'installe... puis tu le nommes.

En réunion ça donne : long silence → « ...on est d'accord que personne comprend le slide 7 ? »

Rires. Tension cassée. Et tout le monde t'écoute mieux après.

50+ techniques comme celle-ci sur deviens-marrant.fr"

Exemple MAUVAIS LinkedIn (REJETÉ) :
"🎯 L'humour est un outil puissant en entreprise.

Dans un monde professionnel de plus en plus exigeant, savoir faire rire ses collègues est devenu une compétence clé.

Découvrez comment l'humour peut transformer vos réunions ! 🚀

#leadership #humour #management"

═══ FORMAT SIGNATURE : "TECHNIQUE DU JOUR" ═══
Structure : [Hook qui crée une tension ≤ 5 mots] → [Humoriste + ce qu'il fait de SPÉCIFIQUE] → [Comment TU l'utilises CE SOIR, pas "un jour"] → [CTA humain]

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

═══ TEST FINAL AVANT CHAQUE POST ═══
Relis ton post et passe ces 5 checks :
1. "Est-ce qu'un humain posterait exactement ça ?" → Si ça sent l'IA, recommence
2. "Est-ce qu'il y a au moins UN moment drôle ?" → Pas de post 100% sérieux
3. "Est-ce que le hook crée une tension ?" → Pas une description plate
4. "Est-ce que le CTA est invisible ?" → On ne doit pas sentir qu'on vend un truc
5. "Est-ce que ${Object.values(PERSONAS).map(p => p.name).join(" ou ")} envoie ça à un pote ?" → Si non, recommence

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
 * Phase 1 : Twitter (2-3 posts/jour)
 * Phase 2 : + LinkedIn (1 post/jour, angle pro Sophie/Marc)
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

  // LinkedIn : angle pro, cible Sophie (machine à café, afterwork) et Marc (leadership, confiance)
  // 1 post LinkedIn par jour en semaine, 0 le weekend
  const linkedInThemes: Record<PersonaKey, string> = {
    SOPHIE: `Communication & humour au travail — machine à café, réunions, afterwork — angle ${p.name}`,
    MARC: `Leadership & charisme par l'humour — confiance, prise de parole, networking — angle ${p.name}`,
    YANIS: `Prise de parole & aisance sociale — entretiens, présentations, networking étudiant — angle ${p.name}`,
  };

  const linkedInPost: DailyPostPlan = {
    format: "POST",
    theme: linkedInThemes[persona],
    platform: "LINKEDIN",
    sourceType: "TIP",
  };

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
      linkedInPost,
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
      linkedInPost,
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
      linkedInPost,
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
      linkedInPost,
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
      linkedInPost,
    ],
    6: [
      // Samedi — pas de LinkedIn le weekend
      {
        format: "THREAD",
        theme: `Thread viral : "X techniques de stand-up que tu peux utiliser ce soir"`,
        platform: "TWITTER",
        sourceType: "BLOG",
      },
    ],
    0: [
      // Dimanche — pas de LinkedIn le weekend
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

═══ CHECKLIST AVANT DE RÉPONDRE ═══
1. Relis ton post à voix haute. Ça sonne comme un HUMAIN ou comme ChatGPT ?
   → Si tu vois "découvrez", "n'hésitez pas", "il est important", "en conclusion", "par ailleurs" → supprime et reformule
2. Il y a au moins UN moment drôle ? (vanne, observation, autodérision, twist)
   → Si c'est 100% sérieux, ajoute de l'humour
3. Le hook crée une TENSION en ≤ 5 mots ? (contradiction, spécificité, interpellation)
   → Si c'est descriptif ("Astuce du jour", "Thread sur...") → recommence le hook
4. Le CTA est INVISIBLE ? Pas de marketing language, pas de point d'exclamation ?
   → "50+ techniques → deviens-marrant.fr" ✅ / "Découvrez notre site !" ❌
5. ${p.name} envoie ça à son/sa meilleur(e) pote ? Pas "intéressant" — DRÔLE ou UTILE AU POINT D'ENVOYER ?

Réponds en JSON :
{
  "platform": "${plan.platform}",
  "format": "${plan.format}",
  "hook": "Les 5 premiers mots (TENSION, pas description)",
  "content": "Le post complet (HUMAIN, drôle, stand-up tone)",
  ${plan.format === "THREAD" ? '"threadParts": ["Tweet 1", "Tweet 2", "Tweet 3", "..."],' : ""}
  "cta": "CTA invisible et humain (pas de marketing)",
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
- Hook qui crée une tension (≤ 5 mots) — PAS "Technique du jour"
- Nomme un humoriste prioritaire + ce qu'il/elle fait de SPÉCIFIQUE (pas "utilise le silence" mais "attend 3 secondes en fixant le premier rang")
- La technique en 2-3 lignes, écrite comme à l'oral — pas un cours
- Un exemple d'application CE SOIR avec un contexte précis (pas "dans une conversation" mais "à la machine à café demain matin")
- CTA humain en dernière ligne (pas "découvrez", juste le lien ou une phrase sèche)
- Max 280 caractères par tweet
- Le tout doit sonner comme un pote qui te raconte un truc qu'il a vu, pas comme un cours`;

    case "TWEET":
      return `FORMAT : TWEET (micro-set de stand-up)
- C'est un SET en 280 caractères : setup → punchline. Point.
- Hook en 5 mots max — crée une tension, pas une description
- La punchline doit SURPRENDRE — si on la voit venir, recommence
- Max 280 caractères total
- Zéro hashtag dans le corps du tweet
- Écris comme tu parlerais à un pote — phrases incomplètes OK, parenthèses OK
- INTERDIT : "Saviez-vous", "Petit thread", tout ce qui sent le CM ou l'IA
- Le tweet doit donner envie de cliquer sur le profil par curiosité, pas par marketing`;

    case "THREAD":
      return `FORMAT : THREAD TWITTER (5-7 tweets)
- Tweet 1 = hook irrésistible (tension, contradiction, promesse spécifique — PAS "Petit thread sur l'humour")
- Tweets 2-5 = contenu avec du RYTHME (alterner technique, exemple, vanne, observation — pas 4 tweets d'explication plate)
- Chaque tweet doit contenir au moins un élément engageant (chiffre précis, exemple concret, trait d'humour)
- Tweet 6 = takeaway en une phrase sèche
- Dernier tweet = CTA humain + lien (pas "n'hésitez pas")
- Chaque tweet fait max 280 caractères
- Chaque tweet fonctionne SEUL dans un feed (si quelqu'un ne lit que le tweet 3, il doit trouver ça intéressant)
- Retourne les tweets dans le champ "threadParts"
- INTERDIT : tweets de transition creux ("Mais ce n'est pas tout !", "Voici pourquoi 👇")`;

    case "QUOTE_ANALYSIS":
      return `FORMAT : QUOTE ANALYSE
- Citation PRÉCISE d'un humoriste (pas une paraphrase vague — le mot exact, le sketch exact)
- Analyse de la technique en 2-3 lignes — avec du VOCABULAIRE DE STAND-UP (callback, misdirection, tag, topper, act-out)
- "Teste ça" : 1-2 lignes d'application concrète avec un CONTEXTE (soirée, boulot, date — pas "dans une conversation")
- Max ${platform === "LINKEDIN" ? "1300" : "280"} caractères
- Le tout doit donner l'impression d'un pote passionné qui décortique un truc, pas d'un prof qui analyse`;

    case "POST":
      return `FORMAT : POST ${platform}
${platform === "LINKEDIN" ? `- Première phrase SEULE, choc — elle doit suffire à arrêter le scroll
- Sauts de ligne entre chaque idée (LinkedIn récompense l'aération)
- Structure : affirmation provocante → observation drôle du monde pro → technique concrète avec exemple vécu → CTA discret
- Max 1300 caractères
- Ton : le collègue brillant et drôle, PAS le guru LinkedIn
- Au moins UN moment drôle (auto-dérision, observation, vanne)
- INTERDIT : broetry, "agree?", "thoughts?", emoji en début de ligne, "Il y a X ans...", "Let that sink in"
- Les hashtags en FIN de post (3-5 max), jamais dans le texte` : `- Ton décontracté, stand-up style
- Max 280 caractères
- Setup → punchline, rythme parlé`}`;

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
      return {
        ...currentPost,
        directorScore: validation.score,
        directorNote: validation.directorNote,
      };
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

RAPPEL CRITIQUE : ton post doit sonner HUMAIN. Pas de formulations IA ("découvrez", "n'hésitez pas", "il est important", transitions lisses). Écris comme tu parlerais — phrases courtes, ruptures, au moins un moment drôle, CTA invisible.

Réponds en JSON :
{
  "platform": "${currentPost.platform}",
  "format": "${currentPost.format}",
  "hook": "Hook réécrit (≤ 5 mots, TENSION pas description)",
  "content": "Post réécrit (HUMAIN, drôle, stand-up tone)",
  ${currentPost.format === "THREAD" ? '"threadParts": ["Tweet 1", "..."],' : ""}
  "cta": "CTA invisible et humain",
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
 * Calcule l'heure de publication optimale pour un persona + plateforme.
 * LinkedIn a ses propres horaires (contexte pro, heures de bureau).
 */
export function getOptimalScheduleTime(
  persona: PersonaKey,
  postIndex: number,
  platform?: SocialPlatform,
): Date {
  const now = new Date();
  const today = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  );

  // Horaires Twitter par persona (en heures UTC)
  const twitterSchedules: Record<PersonaKey, number[]> = {
    YANIS: [19, 21], // 21h-23h Paris (UTC+2)
    SOPHIE: [7, 11], // 9h + 13h Paris
    MARC: [6, 18], // 8h + 20h Paris
  };

  // Horaires LinkedIn par persona — contexte pro, heures de bureau
  const linkedInSchedules: Record<PersonaKey, number[]> = {
    YANIS: [8, 12], // 10h + 14h Paris (pause cours, networking)
    SOPHIE: [6, 10], // 8h + 12h Paris (trajet matin, pause déj)
    MARC: [5, 16], // 7h + 18h Paris (matin calme, fin de journée)
  };

  const schedules = platform === "LINKEDIN" ? linkedInSchedules : twitterSchedules;
  const hours = schedules[persona];
  const hour = hours[postIndex % hours.length];

  today.setUTCHours(hour, Math.floor(Math.random() * 15), 0, 0);
  return today;
}
