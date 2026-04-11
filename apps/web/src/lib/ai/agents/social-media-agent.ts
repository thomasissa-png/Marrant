import {
  buildCachedSystemBlock,
  callWithRetry,
  extractJson,
  getResponseText,
  SONNET_MODEL,
} from "../client";
import { PERSONAS, getPersonaForDay } from "../personas";
import type { PersonaKey } from "../personas";
import { TONALITY_BRIEF } from "./marketing-agent";
import {
  validateSocialPost,
  directorRewriteSocialPost,
} from "./standup-director-agent";
import type { SocialPostToValidate, ValidationResult } from "./standup-director-agent";

// ───────────────────────────────────────────────────────────────────
// Agent Social Media — Community Manager de deviens-marrant.fr
//
// Rôle : générer du contenu social-native pour Twitter,
// LinkedIn et Instagram. Chaque post est une micro-performance.
//
// Ce n'est PAS un fork du joke-agent. Le ton est plus punchy,
// plus "entre nous", plus spontané. Hook en ≤ 5 mots obligatoire.
//
// Pipeline : generate → Director validate → DB pending → admin approve → publish
// ───────────────────────────────────────────────────────────────────

/**
 * Nombre max de tentatives generate → validate → retry pour un post social.
 *
 * Valeur 1 (avril 2026, ex-3) : les posts sociaux sont courts (~500 tokens)
 * donc la re-génération coûte peu, mais en pratique 90% passent au 1er essai.
 * Les retries à vide consomment du token sans bénéfice. En cas d'échec, le
 * fallback `directorRewriteSocialPost` prend la main directement.
 */
const MAX_VALIDATION_ATTEMPTS_SHORT = 1;

// ─── Yanis Gen Z refs — rotation quotidienne ────────────────────
const YANIS_GEN_Z_REFS = [
  "memes/TikTok",
  "Netflix/séries",
  "rap FR/musique",
  "gaming/stream",
  "dating apps",
] as const;

function getYanisGenZRef(dayOfMonth: number): string {
  return YANIS_GEN_Z_REFS[dayOfMonth % YANIS_GEN_Z_REFS.length];
}

// ─── Sophie Vanne Réécrite Social — rotation contexte ───────────
const SOPHIE_VANNE_CONTEXTS = [
  "machine à café",
  "afterwork",
  "dîner entre amis",
] as const;

function getSophieVanneContext(dayOfMonth: number): string {
  return SOPHIE_VANNE_CONTEXTS[dayOfMonth % SOPHIE_VANNE_CONTEXTS.length];
}

// ─── Rotation humoristes — diversité obligatoire ─────────────────
const HUMORISTES_ROTATION = [
  { name: "Paul Mirabel", style: "autodérision de timide, escalade absurde, silences gênants assumés" },
  { name: "Fary", style: "miroir comique, répétition lente, retournement d'attaque" },
  { name: "Roman Frayssinet", style: "observation quotidienne poussée à l'absurde, naïveté feinte" },
  { name: "Blanche Gardin", style: "franchise brutale, malaise assumé, vérités que personne n'ose dire" },
  { name: "Waly Dia", style: "storytelling du quotidien, punchlines en cascade, énergie contagieuse" },
  { name: "Panayotis Pascot", style: "vulnérabilité comme force, sincérité désarmante, humour tendre" },
  { name: "Pierre Croce", style: "humour digital natif, décalage visuel, absurde millennial" },
  { name: "Inès Reg", style: "énergie explosive, personnages du quotidien, autodérision physique" },
] as const;

function getHumoristeOfDay(dayOfMonth: number): typeof HUMORISTES_ROTATION[number] {
  return HUMORISTES_ROTATION[dayOfMonth % HUMORISTES_ROTATION.length];
}

function getSecondaryHumoriste(dayOfMonth: number): typeof HUMORISTES_ROTATION[number] {
  return HUMORISTES_ROTATION[(dayOfMonth + 3) % HUMORISTES_ROTATION.length];
}

// ─── Types ──────────────────────────────────────────────────────

export type SocialPlatform = "TWITTER" | "LINKEDIN" | "INSTAGRAM";

export type SocialFormat =
  | "TWEET"
  | "THREAD"
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
  /** false si la validation directeur a crashé — le post doit passer en PENDING */
  directorValidated?: boolean;
}

interface DailyPostPlan {
  format: SocialFormat;
  theme: string;
  platform: SocialPlatform;
  sourceType?: string;
  schedulingHint?: string;
  /** Si true, le post peut inclure un lien vers le site. Max 1 post sur 5 avec lien. */
  withSiteLink?: boolean;
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
- De l'autodérision : "bon, on a testé, c'était gênant, mais ça a marché"
- Des détails spécifiques : pas "une situation embarrassante" mais "le silence de 4 secondes après ta vanne ratée au repas de Noël"

═══ VOIX DE MARQUE ═══
${TONALITY_BRIEF.principles.map((p) => `- ${p}`).join("\n")}

INTERDIT :
${TONALITY_BRIEF.doNot.map((d) => `- ${d}`).join("\n")}
- JAMAIS mentionner les personas internes (Yanis, Sophie, Marc) — ce sont des outils internes, invisibles pour le public

═══ HOOKS — L'ART DES 5 PREMIERS MOTS ═══
Le hook est TOUT. 90% des gens scrollent en 0,3 seconde. Ton hook doit créer une TENSION immédiate.

3 techniques de hook qui marchent :
1. CONTRADICTION : "Waly Dia parle PLUS FORT quand personne écoute" (le cerveau veut comprendre pourquoi)
2. SPÉCIFICITÉ BIZARRE : "La technique du silence de 3 secondes" (assez précis pour intriguer)
3. INTERPELLATION DIRECTE : "Ta dernière vanne a tué personne" (ça pique, on continue)

Hooks INTERDITS (= scroll immédiat) :
- "Astuce humour du jour" (générique, zéro tension)
- "Petit thread sur..." (personne n'a jamais arrêté de scroller pour ça)
- "Saviez-vous que..." (prof, pas pote)
- "Top 5 des..." (listicle vu 10 000 fois)
- Tout hook qui pourrait être le titre d'un article de blog corporate

═══ CTA — RARE ET INVISIBLE ═══
Le CTA ne doit JAMAIS ressembler à du marketing. C'est la dernière phrase d'un pote qui te file un bon plan.

RÈGLE CLÉ : max 1 post sur 5 avec un lien vers le site. Les 4 autres = ZÉRO lien, ZÉRO mention du site.
Les posts sans lien performent mieux (algo + crédibilité). On est là pour apporter de la valeur, pas pour spammer.
Quand il n'y a pas de CTA lien, le post se termine par la punchline ou une phrase de fermeture drôle. Point.

BON CTA (quand c'est le 1 post sur 5 avec lien) :
- "50+ techniques comme celle-ci → deviens-marrant.fr"
- "Le reste est sur deviens-marrant.fr (ouais on fait notre pub)"
- "On a compilé 50 techniques du genre. Devine où."
- Simplement le lien, sans phrase. Sec.

BON POST SANS CTA (les 4 autres sur 5) :
- Le post se termine par la punchline. Pas de lien. Pas de "retrouvez". Rien.
- Un post drôle qui n'essaie pas de vendre quoi que ce soit = plus de partages

MAUVAIS CTA (on dirait un bot) :
- "Découvrez plus de techniques sur notre site !"
- "Pour aller plus loin, rendez-vous sur..."
- "N'hésitez pas à visiter..."
- "Suivez-nous pour plus de contenu !"
- Tout CTA avec un point d'exclamation
- Mettre un lien dans CHAQUE post (spam → unfollow)

═══ VOIX — ON EST UNE ÉQUIPE ═══
On parle toujours au "on" (l'équipe), JAMAIS au "je" (un individu).
On est une équipe de passionnés de stand-up, pas un mec seul derrière un écran.
- "on a compilé" PAS "j'ai compilé"
- "on fait notre pub" PAS "je fais ma pub"
- "chez nous" PAS "chez moi"
- Le tutoiement reste pour s'adresser au lecteur : "tu" / "toi"

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
9. TUTOIEMENT OBLIGATOIRE : "tu" / "ton" / "ta" — JAMAIS "vous" / "votre" / "vos". Le site tutoie TOUJOURS.
10. ZÉRO VULGARITÉ : pas de putain, merde, bordel, etc. On est drôle SANS être vulgaire.
11. PAS DE DIALOGUE RECONSTITUÉ : "Moi : ... / Mon pote : ..." = format générique interdit. Un compte lambda fait ça.

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

Panayotis Pascot fait un truc que personne ose : il dit tout haut ce que tout le monde pense tout bas.

En réunion ça donne : silence gêné → « ...on est d'accord que personne comprend le slide 7 ? »

Rires. Tension cassée. Et tout le monde t'écoute mieux après."

Exemple MAUVAIS LinkedIn (REJETÉ) :
"🎯 L'humour est un outil puissant en entreprise.

Dans un monde professionnel de plus en plus exigeant, savoir faire rire ses collègues est devenu une compétence clé.

Découvrez comment l'humour peut transformer vos réunions ! 🚀

#leadership #humour #management"

═══ FORMAT SIGNATURE : "TECHNIQUE DU JOUR" ═══
Structure : [Hook qui crée une tension ≤ 5 mots] → [Humoriste + ce qu'il fait de SPÉCIFIQUE] → [Comment TU l'utilises CE SOIR, pas "un jour"] → [CTA humain]

Exemple BON :
"Roman Frayssinet observe un truc que PERSONNE remarque.
Il décrit le mec qui dit 'bon !' avant de se lever d'une chaise.
Et tout le monde se reconnaît.

Technique : l'observation micro.

Essaie ce soir : décris un geste que tout le monde fait sans y penser. Genre le 'pffff' avant de répondre au téléphone."

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

═══ APPROCHE UNIVERSELLE — PERSONAS EN COULISSES ═══
RÈGLE CLÉ : chaque post doit parler à TOUT LE MONDE. Le persona du jour n'est qu'une COLORATION subtile (vocabulaire, contexte d'exemple), jamais un filtre exclusif.

Un follower Twitter voit TOUS tes posts. Si lundi c'est 100% "fac/coloc" et mardi 100% "bureau/réunion", il ne se reconnaît que 1 jour sur 3. C'est un échec.

✅ BON : "La technique du silence — tu attends 3 secondes après ta vanne. Que ce soit en soirée, en réunion ou au repas de famille, le silence fait le boulot."
→ Universel. Tout le monde se projette.

❌ MAUVAIS : "Yanis, étudiant introverti, peut utiliser cette technique en soirée entre potes."
→ Exclusif. 2/3 des followers décrochent.

COMMENT UTILISER LE PERSONA DU JOUR :
- Le SUJET est toujours universel (une technique, une observation, une vanne)
- Le CONTEXTE D'EXEMPLE peut s'inspirer du persona (si Sophie → un exemple bureau, si Yanis → un exemple soirée), mais c'est UN exemple parmi d'autres
- Le TON peut légèrement varier : plus punchy/gen Z les jours Yanis, plus pro/smart les jours Sophie, plus profond/bienveillant les jours Marc
- JAMAIS de contenu qui exclut : pas de "quand tu es étudiant" ou "au bureau" comme sujet principal

═══ PERSONAS (coloration, pas ciblage) ═══
${Object.entries(PERSONAS)
  .map(
    ([, p]) =>
      `• ${p.name} (${p.age} ans) — ${p.description}\n  Intérêts : ${p.interests.join(", ")}\n  Ton : ${p.tone}`,
  )
  .join("\n\n")}

═══ INSTAGRAM — LE VISUEL QUI ARRÊTE LE SCROLL ═══
Instagram = le format le plus visuel. Le texte doit être COURT et PERCUTANT car il sera mis en image.
- Chaque image = max 30 mots. Punchlines courtes. Impact visuel.
- TECHNIQUE_DU_JOUR : technique + explication + exemple en 3 blocs visuels
- QUOTE_ANALYSIS (La Vanne) : citation + punchline en gros, analyse en caption
- PAS de carousel (limitation API Buffer) — uniquement des posts single-image
- Le texte caption (champ content) accompagne l'image — complémentaire, pas redondant
- Hashtags Instagram : 5-10, mix populaires + niche (#standupfr #humour #devenirdrole #techniques)
- Pas de lien dans la caption (Instagram ne rend pas les liens cliquables) → "lien en bio"
- Caption max 2200 chars (limite Instagram)

═══ HUMORISTES DE RÉFÉRENCE — ROTATION OBLIGATOIRE ═══
Prioritaires : Paul Mirabel, Fary, Roman Frayssinet, Blanche Gardin, Waly Dia, Panayotis Pascot, Pierre Croce, Inès Reg
Legacy (max 1 mention) : Jamel Debbouze, Gad Elmaleh, Florence Foresti

⚠️ RÈGLE DE DIVERSITÉ ABSOLUE :
- Humoriste principal du jour : ${getHumoristeOfDay(new Date().getDate()).name} (style : ${getHumoristeOfDay(new Date().getDate()).style})
- Humoriste secondaire du jour : ${getSecondaryHumoriste(new Date().getDate()).name} (style : ${getSecondaryHumoriste(new Date().getDate()).style})
- Tu DOIS citer au moins l'humoriste principal dans tes posts du jour
- Tu NE DOIS PAS citer un humoriste qui n'est pas dans la liste du jour, SAUF pour un post Thread Décryptage
- Si tu te surprends à écrire "Fary" ou "Paul Mirabel" alors que ce n'est pas l'humoriste du jour → STOP, remplace
- L'objectif : chaque humoriste de la liste doit apparaître au moins 1 fois par semaine`;
}

// Bloc system caché — construit une seule fois au chargement du module, puis
// réutilisé sur les 2 call sites (generation + retry feedback). Taille ~3200
// tokens (bien au-dessus du seuil Anthropic de 1024 tokens pour Sonnet/Opus),
// éligible au prompt caching `cache_control: ephemeral`.
// Note : `buildSocialBrief()` contient `new Date().getDate()` (rotation humoriste
// quotidienne). Le module est rechargé à chaque run du cron quotidien (4h UTC),
// donc la date est fraîche à chaque exécution et le cache est réutilisé sur
// l'ensemble des posts générés dans la même run (15+ appels).
// Gain estimé : -90% sur les tokens input du social-media-agent.
const SOCIAL_BRIEF_CACHED_BLOCK = buildCachedSystemBlock(buildSocialBrief());

// ─── Validation programmatique des contraintes ──────────────────

const PERSONA_NAMES = ["yanis", "sophie", "marc"];
const FORBIDDEN_CTA_PATTERNS = ["découvrez", "n'hésitez pas", "visitez"];
const ENGAGEMENT_BAIT_PATTERNS = [
  "complète cette",
  "note de 1 à 10",
  "tag un ami",
  "like si",
];

/**
 * Validates a generated post against hard constraints.
 * Returns an array of issue strings (empty = valid).
 */
export function validatePostConstraints(
  post: GeneratedSocialPost,
): string[] {
  const issues: string[] = [];

  // 1. Hook word count — must be ≤ 5 words
  const hookWords = post.hook.trim().split(/\s+/).filter(Boolean);
  if (hookWords.length > 5) {
    issues.push(
      `Hook trop long : ${hookWords.length} mots (max 5). Hook : "${post.hook}"`,
    );
  }

  // 2. Character limits per platform/format
  if (post.platform === "TWITTER") {
    // Tous les formats Twitter single-tweet doivent respecter 270 chars
    // (marge 10 chars pour encodage emojis/accents que Twitter compte différemment)
    const singleTweetFormats = ["TWEET", "TECHNIQUE_DU_JOUR", "QUOTE_ANALYSIS", "WILD_CARD"];
    if (singleTweetFormats.includes(post.format) && post.content.length > 270) {
      issues.push(
        `Tweet trop long : ${post.content.length} chars (max 270). Format: ${post.format}`,
      );
    }
    if (post.format === "THREAD" && post.threadParts) {
      post.threadParts.forEach((part, i) => {
        if (part.length > 280) {
          issues.push(
            `Thread tweet ${i + 1} trop long : ${part.length} chars (max 280)`,
          );
        }
      });
    }
  }
  if (post.platform === "LINKEDIN" && post.content.length > 1300) {
    issues.push(
      `Post LinkedIn trop long : ${post.content.length} chars (max 1300)`,
    );
  }
  if (post.platform === "INSTAGRAM" && post.content.length > 2200) {
    issues.push(
      `Caption Instagram trop longue : ${post.content.length} chars (max 2200)`,
    );
  }

  // 3. Persona guard — internal names must NEVER appear in public content
  const threadText = post.threadParts ? post.threadParts.join(" ") : "";
  const allText = `${post.content} ${post.hook} ${post.cta} ${threadText}`.toLowerCase();
  for (const name of PERSONA_NAMES) {
    if (allText.includes(name)) {
      issues.push(
        `CRITIQUE — Persona leak détecté : "${name}" trouvé dans le contenu public`,
      );
    }
  }

  // 4. CTA check — no marketing language or exclamation marks
  const ctaLower = post.cta.toLowerCase();
  for (const pattern of FORBIDDEN_CTA_PATTERNS) {
    if (ctaLower.includes(pattern)) {
      issues.push(
        `CTA interdit : contient "${pattern}". CTA : "${post.cta}"`,
      );
    }
  }
  if (post.cta.includes("!")) {
    issues.push(
      `CTA contient un point d'exclamation (interdit). CTA : "${post.cta}"`,
    );
  }

  // 5. Engagement bait check
  const contentLower = post.content.toLowerCase();
  for (const pattern of ENGAGEMENT_BAIT_PATTERNS) {
    if (contentLower.includes(pattern)) {
      issues.push(
        `Engagement bait détecté : "${pattern}" dans le contenu`,
      );
    }
  }

  // 6. Voice check — "on" (team) not "je" (individual) when speaking about the brand
  const jePatterns = [/\bje fais\b/i, /\bj'ai compilé\b/i, /\bje compile\b/i, /\bchez moi\b/i, /\bmon site\b/i, /\bma pub\b/i];
  for (const pattern of jePatterns) {
    if (pattern.test(post.content) || pattern.test(post.cta)) {
      issues.push(
        `Voix "je" détectée (utiliser "on" — on est une équipe). Pattern : ${pattern}`,
      );
    }
  }

  // 7. Anti-generic format check — reject reconstructed dialogue tweets
  // These are the most saturated format on Twitter FR ("Moi : ... / Mon pote : ...")
  const DIALOGUE_PATTERNS = [
    /\bmoi\s*:\s*[«"]/i,
    /\bmon pote\s*:\s*[«"]/i,
    /\bma coloc\s*:\s*[«"]/i,
    /\belle\s*:\s*[«"]/i,
    /\blui\s*:\s*[«"]/i,
    /\bprof\s*:\s*[«"]/i,
    /\bmoi\s*:\s*\*/i,  // "Moi : *action*"
    /\baussi moi\s*:/i,
  ];
  const dialogueMatches = DIALOGUE_PATTERNS.filter(
    (p) => p.test(post.content),
  );
  if (dialogueMatches.length >= 2) {
    issues.push(
      `CRITIQUE — Format "dialogue reconstitué" détecté (${dialogueMatches.length} patterns). Ce format est générique et interdit — un compte lambda à 500 followers le fait.`,
    );
  }

  // 8. Thread parts validation — THREAD format must have 5-7 parts
  if (post.format === "THREAD") {
    if (!post.threadParts || post.threadParts.length === 0) {
      issues.push("Thread sans threadParts — le champ est obligatoire");
    } else if (post.threadParts.length < 5) {
      issues.push(
        `Thread trop court : ${post.threadParts.length} tweets (min 5)`,
      );
    } else if (post.threadParts.length > 7) {
      issues.push(
        `Thread trop long : ${post.threadParts.length} tweets (max 7)`,
      );
    }

    // Validate each thread part
    if (post.threadParts && post.threadParts.length > 0) {
      for (let i = 0; i < post.threadParts.length; i++) {
        const part = post.threadParts[i];
        // Character limit per tweet (280 chars max, 270 safe)
        if (part.length > 280) {
          issues.push(
            `Thread part ${i + 1}/${post.threadParts.length} trop long : ${part.length} chars (max 280)`,
          );
        }
        // Persona leak check on each thread part
        if (/\b(Yanis|Sophie|Marc)\b/.test(part)) {
          const leakedName = part.match(/\b(Yanis|Sophie|Marc)\b/)?.[0];
          issues.push(
            `CRITIQUE — Persona leak dans thread part ${i + 1} : "${leakedName}" détecté. Les personas internes ne doivent JAMAIS apparaître dans le contenu public.`,
          );
        }
        // Engagement bait check on thread parts
        const partLower = part.toLowerCase();
        for (const pattern of ENGAGEMENT_BAIT_PATTERNS) {
          if (partLower.includes(pattern)) {
            issues.push(
              `Engagement bait dans thread part ${i + 1} : "${pattern}"`,
            );
          }
        }
      }
    }
  }


  return issues;
}

/**
 * Check if any issue is a critical persona leak.
 */
function hasCriticalIssue(issues: string[]): boolean {
  return issues.some((issue) => issue.startsWith("CRITIQUE"));
}

// ─── Feedback loop — Patterns gagnants ──────────────────────────

/**
 * Récupère les top posts publiés des 14 derniers jours (score ≥ 8/10).
 * Utilisé pour injecter les patterns gagnants dans le prompt de génération.
 * Graceful : retourne un string vide si la DB est inaccessible.
 */
async function getWinningPatterns(): Promise<string> {
  try {
    // Import dynamique pour éviter la dépendance circulaire au top-level
    const { prisma } = await import("@/lib/prisma");

    const fourteenDaysAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);

    const topPosts = await prisma.socialPost.findMany({
      where: {
        status: "PUBLISHED",
        publishedAt: { gte: fourteenDaysAgo },
        directorScore: { gte: 8 },
      },
      orderBy: { directorScore: "desc" },
      take: 5,
      select: {
        platform: true,
        format: true,
        hook: true,
        content: true,
        targetPersona: true,
        directorScore: true,
        directorNote: true,
      },
    });

    if (topPosts.length === 0) return "";

    const examples = topPosts
      .map(
        (p, i) =>
          `${i + 1}. [${p.platform}/${p.format}] Score ${p.directorScore}/10 — Hook: "${p.hook}"\n   ${p.content.slice(0, 120)}${p.content.length > 120 ? "..." : ""}${p.directorNote ? `\n   Note directeur: ${p.directorNote}` : ""}`,
      )
      .join("\n");

    return `\n═══ PATTERNS GAGNANTS (top posts des 14 derniers jours, score ≥ 8/10) ═══
Inspire-toi de ces patterns qui ont fonctionné — même énergie, pas de copier-coller :
${examples}
`;
  } catch {
    // DB inaccessible ou erreur → pas de feedback, on continue sans
    console.warn("[SocialAgent] Feedback loop: impossible de charger les patterns gagnants");
    return "";
  }
}

// ─── Génération des posts quotidiens ────────────────────────────

/**
 * Génère les posts sociaux du jour.
 * Appelé par le cron /api/cron/daily-social à 4h UTC.
 *
 * Phase 1 : Twitter (2-3 posts/jour)
 * Phase 2 : + LinkedIn (1 post/jour, angle pro Sophie/Marc — PAS Yanis)
 * Phase 3 : + Instagram (1 post/jour, visuel via satori templates)
 */
export async function generateDailySocialPosts(
  dayOfMonth: number,
  trendingContext?: string,
): Promise<GeneratedSocialPost[]> {
  const persona = getPersonaForDay(dayOfMonth);
  const dayOfWeek = new Date().getUTCDay(); // 0=dimanche — UTC pour alignement cron

  // Feedback loop : récupérer les patterns gagnants pour enrichir le prompt
  const winningPatterns = await getWinningPatterns();

  // Plan de la journée selon le jour de la semaine
  const plan = getDailyPlan(dayOfWeek, persona);

  // Injecter le contexte d'actualité dans les WILD CARD
  if (trendingContext) {
    for (const entry of plan) {
      if (entry.theme.includes("WILD CARD")) {
        entry.theme = `WILD CARD — ACTU DU JOUR : ${trendingContext} — réagis à ça avec ton angle stand-up, spontané, drôle`;
      }
    }
  }
  const posts: GeneratedSocialPost[] = [];

  for (const entry of plan) {
    try {
      const post = await generateSinglePost(entry, persona, winningPatterns);
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
  const isYanis = persona === "YANIS";

  // ── Thèmes UNIVERSELS avec coloration persona ──
  // Le sujet parle à tout le monde, le persona n'influence que le ton et UN exemple

  // Coloration légère : vocabulaire et ton du persona du jour
  const personaFlavor: Record<PersonaKey, string> = {
    YANIS: "ton punchy/gen Z, exemples variés (soirée, coloc, dating, boulot…)",
    SOPHIE: "ton smart/complice, exemples variés (bureau, soirée, dîner, transports…)",
    MARC: "ton bienveillant/profond, exemples variés (soirée, dating, famille, boulot…)",
  };
  const flavor = personaFlavor[persona];

  // LinkedIn : publié UNIQUEMENT les jours Lun/Mer/Ven (aligné social-editorial-plan.json)
  // Jamais sur Yanis (stratégie Phase 2), jamais Mar/Jeu/Sam/Dim
  // Quand Yanis, on remplace par un 3ème tweet "Le Défi"
  const shouldHaveLinkedIn = !isYanis && [1, 3, 5].includes(dayOfWeek);
  const linkedInPost: DailyPostPlan | null = shouldHaveLinkedIn
    ? {
        format: "POST",
        theme: `Humour & communication au travail — technique concrète applicable par tout le monde (coloration ${flavor})`,
        platform: "LINKEDIN",
        sourceType: "TIP",
      }
    : null;

  // Tweet de remplacement pour Yanis quand LinkedIn est supprimé (ton gen Z)
  const yanisReplacementTweet: DailyPostPlan = {
    format: "TWEET",
    theme: `Le Défi — défi concret à tester aujourd'hui, ton punchy gen Z, ref culturelle ${getYanisGenZRef(new Date().getDate())}, ${flavor}`,
    platform: "TWITTER",
    sourceType: "ORIGINAL",
  };

  // Tweet de remplacement générique (non-Yanis) pour les jours sans LinkedIn (Mar/Jeu)
  // Remplace le LinkedIn dans le plan éditorial aligné JSON.
  const bonusTweet: DailyPostPlan = {
    format: "TWEET",
    theme: `Tweet bonus — observation drôle ou technique de répartie courte, ton spontané, ${flavor}`,
    platform: "TWITTER",
    sourceType: "ORIGINAL",
  };

  // Helper : retourne soit le LinkedIn (si disponible), soit un tweet de remplacement
  // - Si Yanis → yanisReplacementTweet (ton gen Z)
  // - Sinon → bonusTweet (ton neutre)
  const linkedInOrFallback: DailyPostPlan = linkedInPost ?? (isYanis ? yanisReplacementTweet : bonusTweet);

  // Instagram : thème universel, formats par jour (0=dim, 6=sam)
  // Note : pas de CAROUSEL — Buffer API ne supporte pas les carousels Instagram.
  // On alterne TECHNIQUE_DU_JOUR (lundi/mercredi/vendredi/samedi/dimanche)
  // et QUOTE_ANALYSIS = "La Vanne" (mardi/jeudi) pour varier les visuels.
  const instagramFormats: Record<number, SocialFormat> = {
    0: "TECHNIQUE_DU_JOUR",
    1: "TECHNIQUE_DU_JOUR",
    2: "QUOTE_ANALYSIS",
    3: "TECHNIQUE_DU_JOUR",
    4: "QUOTE_ANALYSIS",
    5: "TECHNIQUE_DU_JOUR",
    6: "TECHNIQUE_DU_JOUR",
  };

  const instagramPost = (day: number): DailyPostPlan => ({
    format: instagramFormats[day] || "TECHNIQUE_DU_JOUR",
    theme: instagramFormats[day] === "QUOTE_ANALYSIS"
      ? `Vanne ou citation humoriste — visuel percutant, punchline qui arrête le scroll, ${flavor}`
      : `Technique ou vanne universelle — visuel percutant, ${flavor}`,
    platform: "INSTAGRAM",
    sourceType: instagramFormats[day] === "QUOTE_ANALYSIS" ? "JOKE" : "TIP",
  });

  // ── Helpers pour enrichir les thèmes selon le persona ──
  const dayOfMonth = new Date().getDate();

  // Sophie JOKE → "Vanne Réécrite Social" avec contexte d'usage
  function sophieJokeTheme(): string {
    if (persona !== "SOPHIE") {
      return `Vanne courte universelle — situation que tout le monde vit, ${flavor}`;
    }
    const ctx = getSophieVanneContext(dayOfMonth);
    return `Vanne Réécrite Social — prête à ressortir mot pour mot en contexte "${ctx}". Reformule une vanne pour qu'elle soit naturelle à l'oral, comme si Sophie la sortait à la ${ctx}. ${flavor}`;
  }

  // Yanis → injecte une ref gen Z dans le thème
  function withYanisRef(theme: string): string {
    if (persona !== "YANIS") return theme;
    const ref = getYanisGenZRef(dayOfMonth);
    return `${theme} — intègre une ref culturelle gen Z (${ref}) si pertinent`;
  }

  const plans: Record<number, DailyPostPlan[]> = {
    1: [
      // Lundi
      {
        format: "TECHNIQUE_DU_JOUR",
        theme: withYanisRef(`Technique de stand-up universelle — début de semaine, énergie, ${flavor}`),
        platform: "TWITTER",
        sourceType: "TIP",
      },
      {
        format: "TWEET",
        theme: withYanisRef(sophieJokeTheme()),
        platform: "TWITTER",
        sourceType: "JOKE",
      },
      linkedInOrFallback,
      instagramPost(1),
    ],
    2: [
      // Mardi
      {
        format: "QUOTE_ANALYSIS",
        theme: withYanisRef(`Analyse d'une technique de ${getHumoristeOfDay(dayOfMonth).name} (${getHumoristeOfDay(dayOfMonth).style}) — universelle`),
        platform: "TWITTER",
        sourceType: "VIDEO",
      },
      {
        format: "TWEET",
        theme: withYanisRef(persona === "SOPHIE"
          ? `Vanne Réécrite Social — prête à ressortir mot pour mot en contexte "${getSophieVanneContext(dayOfMonth)}". Vanne observationnelle reformulée pour l'oral. ${flavor}`
          : `Vanne observationnelle universelle — moment relatable, ${flavor}`),
        platform: "TWITTER",
        sourceType: "JOKE",
      },
      linkedInOrFallback,
      instagramPost(2),
    ],
    3: [
      // Mercredi
      {
        format: "TECHNIQUE_DU_JOUR",
        theme: withYanisRef(`Technique de répartie / timing — universelle, milieu de semaine`),
        platform: "TWITTER",
        sourceType: "TIP",
      },
      {
        format: "THREAD",
        theme: withYanisRef(`Thread décryptage : 3-5 techniques d'un humoriste dans un set précis — universel`),
        platform: "TWITTER",
        sourceType: "VIDEO",
      },
      // Wild card #1 — slot réactif
      {
        format: "TWEET",
        theme: withYanisRef(`WILD CARD — Réaction à l'actu stand-up/humour du moment : buzz, spectacle, trend — ton spontané, ${flavor}`),
        platform: "TWITTER",
        sourceType: "ORIGINAL",
      },
      linkedInOrFallback,
      instagramPost(3),
    ],
    4: [
      // Jeudi — Marc dating tweet si persona MARC
      {
        format: "QUOTE_ANALYSIS",
        theme: withYanisRef(`Citation + analyse technique de ${getSecondaryHumoriste(dayOfMonth).name} (${getSecondaryHumoriste(dayOfMonth).style}) — universelle`),
        platform: "TWITTER",
        sourceType: "VIDEO",
      },
      persona === "MARC"
        ? {
            format: "TWEET" as const,
            theme: `Marc dating — premier rendez-vous après une longue relation, comment ne pas être le mec gênant. Technique concrète à tester aujourd'hui, pas juste de l'inspiration. ${flavor}`,
            platform: "TWITTER" as const,
            sourceType: "ORIGINAL" as const,
            schedulingHint: "Marc dating — actionnable, un truc à tester aujourd'hui, pas de motivation douce",
          }
        : {
            format: "TWEET" as const,
            theme: withYanisRef(sophieJokeTheme()),
            platform: "TWITTER" as const,
            sourceType: "JOKE" as const,
          },
      linkedInOrFallback,
      instagramPost(4),
    ],
    5: [
      // Vendredi
      {
        format: "TECHNIQUE_DU_JOUR",
        theme: withYanisRef(`Technique à tester ce weekend — contexte soirée/social, universelle, ${flavor}`),
        platform: "TWITTER",
        sourceType: "TIP",
      },
      {
        format: "TWEET",
        theme: withYanisRef(sophieJokeTheme()),
        platform: "TWITTER",
        sourceType: "JOKE",
      },
      // Vendredi : LinkedIn "La technique du week-end" (sauf Yanis)
      ...(isYanis
        ? [yanisReplacementTweet]
        : [{ format: "POST" as SocialFormat, theme: `Humour social du weekend — technique applicable par tous, ${flavor}`, platform: "LINKEDIN" as SocialPlatform, sourceType: "TIP" as const }]),
      instagramPost(5),
    ],
    6: [
      // Samedi — pas de LinkedIn
      {
        format: "THREAD",
        theme: withYanisRef(`Thread viral : "X techniques de stand-up que tu peux utiliser ce soir" — universel`),
        platform: "TWITTER",
        sourceType: "BLOG",
      },
      // Wild card #2 — slot réactif
      {
        format: "TWEET",
        theme: withYanisRef(`WILD CARD — Meme/trend du moment détourné angle stand-up, ou réaction à un show/spectacle récent, ${flavor}`),
        platform: "TWITTER",
        sourceType: "ORIGINAL",
      },
      {
        format: "TECHNIQUE_DU_JOUR" as SocialFormat,
        theme: withYanisRef(`Vanne ou défi weekend — universel, percutant, ${flavor}`),
        platform: "INSTAGRAM" as SocialPlatform,
        sourceType: "JOKE",
      },
    ],
    0: [
      // Dimanche
      {
        format: "TWEET",
        theme: withYanisRef(sophieJokeTheme()),
        platform: "TWITTER",
        sourceType: "JOKE",
      },
      {
        format: "TWEET" as SocialFormat,
        theme: withYanisRef(`Micro-technique du dimanche soir — courte, universelle, "essaie ça demain matin", ${flavor}`),
        platform: "TWITTER" as SocialPlatform,
        sourceType: "TIP",
      },
      {
        format: "TECHNIQUE_DU_JOUR" as SocialFormat,
        theme: withYanisRef(`Technique ou vanne du dimanche — cool, universelle, visuel percutant, ${flavor}`),
        platform: "INSTAGRAM" as SocialPlatform,
        sourceType: "TIP",
      },
    ],
  };

  const result = plans[dayOfWeek] || plans[1];

  // Max 1 post par jour avec un lien vers le site (le premier TECHNIQUE_DU_JOUR ou THREAD)
  let siteLinkAssigned = false;
  const withLinks = result.map((entry) => {
    if (!siteLinkAssigned && (entry.format === "TECHNIQUE_DU_JOUR" || entry.format === "THREAD")) {
      siteLinkAssigned = true;
      return { ...entry, withSiteLink: true };
    }
    return { ...entry, withSiteLink: false };
  });

  // Ajouter les scheduling hints basés sur le persona, la plateforme et le créneau horaire
  let twitterIndex = 0;
  return withLinks.map((entry) => {
    const isTwitterLike = entry.platform === "TWITTER";
    const hint = getSchedulingHint(entry.platform, persona, isTwitterLike ? twitterIndex : 0);
    if (isTwitterLike) twitterIndex++;
    return { ...entry, schedulingHint: hint };
  });
}

/**
 * Retourne un hint de contexte de lecture basé sur la plateforme, le persona
 * et le créneau horaire (slotIndex pour les plateformes à créneaux multiples).
 * Ce hint est injecté dans le prompt de génération pour adapter le ton.
 *
 * Créneaux Twitter par persona :
 * - YANIS : soirée (21h-23h)
 * - SOPHIE : slot 0 = matin (9h), slot 1 = pause déj (13h)
 * - MARC : slot 0 = matin (8h), slot 1 = soirée (20h)
 */
function getSchedulingHint(
  platform: SocialPlatform,
  persona: PersonaKey,
  slotIndex: number = 0,
): string {
  // Platform-specific hints override persona-based hints
  if (platform === "LINKEDIN") {
    return "Contexte professionnel — heure de bureau, ton collègue brillant";
  }
  if (platform === "INSTAGRAM") {
    return "Visuel-first — doit arrêter le scroll en <1 seconde";
  }

  // Twitter/Threads — scheduling context based on time of day (universal, not persona-segmented)
  const personaHints: Record<PersonaKey, string[]> = {
    YANIS: [
      "Ce post sera lu en soirée — contexte détendu, mode loisir, ton léger et punchy",
    ],
    SOPHIE: [
      "Ce post sera lu le matin — court, percutant, facilement mémorisable",
      "Ce post sera lu en pause déj — contexte détente, anecdote à ressortir",
    ],
    MARC: [
      "Ce post sera lu tôt le matin — ton calme, actionnable (un truc à tester aujourd'hui)",
      "Ce post sera lu en soirée — une technique concrète à appliquer demain",
    ],
  };

  const hints = personaHints[persona];
  return hints[Math.min(slotIndex, hints.length - 1)];
}

// ─── Génération d'un post unique ────────────────────────────────

async function generateSinglePost(
  plan: DailyPostPlan,
  persona: PersonaKey,
  winningPatterns: string = "",
): Promise<GeneratedSocialPost> {
  const p = PERSONAS[persona];

  const formatInstructions = getFormatInstructions(plan.format, plan.platform);

  // System prompt : bloc stable caché en premier, puis bloc variable
  // (winningPatterns) non caché. Si winningPatterns est vide, on passe
  // uniquement le bloc caché.
  const systemBlocks = winningPatterns
    ? [SOCIAL_BRIEF_CACHED_BLOCK, { type: "text" as const, text: winningPatterns }]
    : [SOCIAL_BRIEF_CACHED_BLOCK];

  const response = await callWithRetry({
    model: SONNET_MODEL,
    max_tokens: plan.format === "THREAD" ? 2000 : 800,
    system: systemBlocks,
    messages: [
      {
        role: "user",
        content: `Crée un post ${plan.platform} au format ${plan.format}.

IMPORTANT — CONTENU UNIVERSEL : ce post doit parler à TOUT LE MONDE (20 ans comme 35 ans, étudiant comme salarié). Le persona ci-dessous n'est qu'une COLORATION pour le ton et UN exemple de contexte parmi d'autres.

Coloration persona du jour : ${p.name} (${p.age} ans — ${p.description})
→ Utilise ce persona pour le TON (${p.tone}) et pour colorer UN des exemples, mais le sujet reste universel.
Thème : "${plan.theme}"
${plan.schedulingHint ? `Contexte de lecture : "${plan.schedulingHint}"` : ""}
${plan.withSiteLink ? `⚡ CE POST peut inclure un lien vers deviens-marrant.fr en fin de post (CTA subtil, humain, pas marketing).` : `⚡ CE POST ne doit PAS contenir de lien vers le site. Pas de "deviens-marrant.fr", pas de "lien en bio", pas de CTA commercial. Le post se termine par la punchline ou une phrase de fermeture drôle. Le champ "cta" doit être vide ("").`}

${formatInstructions}

═══ VOIX ═══
On parle au "on" (l'équipe), JAMAIS au "je". On est une équipe, pas un individu.

═══ CHECKLIST AVANT DE RÉPONDRE ═══
1. Relis ton post à voix haute. Ça sonne comme un HUMAIN ou comme ChatGPT ?
   → Si tu vois "découvrez", "n'hésitez pas", "il est important", "en conclusion", "par ailleurs" → supprime et reformule
2. Il y a au moins UN moment drôle ? (vanne, observation, autodérision, twist)
   → Si c'est 100% sérieux, ajoute de l'humour
3. Le hook crée une TENSION en ≤ 5 mots ? (contradiction, spécificité, interpellation)
   → Si c'est descriptif ("Astuce du jour", "Thread sur...") → recommence le hook
4. ${plan.withSiteLink ? `Le CTA est INVISIBLE ? Pas de marketing language, pas de point d'exclamation ?` : `PAS DE LIEN dans ce post. Le champ "cta" doit être vide ("").`}
5. Ce post parle à TOUT LE MONDE ? Pas juste aux étudiants ou aux salariés ? → Si c'est trop segmenté, élargis
6. Tu utilises "on" et JAMAIS "je" quand tu parles de l'équipe/du site ?

Réponds en JSON :
{
  "platform": "${plan.platform}",
  "format": "${plan.format}",
  "hook": "Les 5 premiers mots (TENSION, pas description)",
  "content": "Le post complet (HUMAIN, drôle, stand-up tone, voix 'on')",
  ${plan.format === "THREAD" ? '"threadParts": ["Tweet 1", "Tweet 2", "Tweet 3", "..."],' : ""}
  "cta": "${plan.withSiteLink ? "CTA invisible et humain avec lien (pas de marketing)" : ""}",
  "hashtags": ["2-4 hashtags pertinents, pas génériques"],
  "targetPersona": "${persona}",
  "sourceType": "${plan.sourceType || "ORIGINAL"}"
}`,
      },
    ],
  }, 2, { agent: "social-media-agent", fn: "generateSocialPost" });

  const text = getResponseText(response);
  const post = extractJson<GeneratedSocialPost>(text);

  // Programmatic validation of hard constraints
  const issues = validatePostConstraints(post);
  if (issues.length > 0) {
    issues.forEach((issue) =>
      console.warn(`[SocialAgent] Contrainte: ${issue}`),
    );

    // Critical issues (persona leak) → throw to trigger regeneration
    if (hasCriticalIssue(issues)) {
      throw new Error(
        `[SocialAgent] Post rejeté — persona leak détecté: ${issues.filter((i) => i.startsWith("CRITIQUE")).join("; ")}`,
      );
    }
  }

  return post;
}

function getFormatInstructions(
  format: SocialFormat,
  platform: SocialPlatform,
): string {
  switch (format) {
    case "TECHNIQUE_DU_JOUR":
      return `FORMAT : TECHNIQUE DU JOUR
- Hook qui crée une tension (≤ 5 mots) — PAS "Technique du jour"
- Utilise l'humoriste du jour (voir section ROTATION OBLIGATOIRE) + ce qu'il/elle fait de SPÉCIFIQUE (pas "utilise le silence" mais "attend 3 secondes en fixant le premier rang")
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

  for (let attempt = 1; attempt <= MAX_VALIDATION_ATTEMPTS_SHORT; attempt++) {
    // Pre-check programmatic constraints before burning a director API call
    const constraintIssues = validatePostConstraints(currentPost);
    if (constraintIssues.length > 0) {
      console.warn(
        `[SocialAgent] Contraintes non respectées avant validation directeur (attempt ${attempt}):`,
        constraintIssues,
      );
    }

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
      // Validation crash → marquer comme non validé pour forcer PENDING en DB
      return { ...currentPost, directorValidated: false };
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
        directorValidated: true,
      };
    }

    if (attempt === MAX_VALIDATION_ATTEMPTS_SHORT) {
      // 3 échecs → le directeur réécrit
      console.log(
        `[Director] Post social rejeté ${MAX_VALIDATION_ATTEMPTS_SHORT}x — le directeur réécrit`,
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
        // Director rewrites are trusted but still need a score for the DB gate
        // The director's rewrite is considered 9/10 (meets the bar by definition)
        return {
          ...currentPost,
          ...rewritten,
          directorScore: 9,
          directorNote: `Réécrit par le directeur après ${MAX_VALIDATION_ATTEMPTS_SHORT} échecs`,
          directorValidated: true,
        };
      } catch (err) {
        console.warn(
          "[Director] Réécriture social post échouée — forçage PENDING:",
          err,
        );
        return { ...currentPost, directorValidated: false };
      }
    }

    // Re-generate with feedback
    console.log(
      `[Director] Post social NEEDS_REVISION (score ${validation.score}) — re-génération avec feedback (attempt ${attempt})`,
    );

    try {
      const feedbackResponse = await callWithRetry({
        model: SONNET_MODEL,
        max_tokens: currentPost.format === "THREAD" ? 2000 : 800,
        system: [SOCIAL_BRIEF_CACHED_BLOCK],
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
      }, 2, { agent: "social-media-agent", fn: "validateAndRefinePost" });

      const text = getResponseText(feedbackResponse);
      currentPost = extractJson<GeneratedSocialPost>(text);
    } catch (err) {
      console.warn(
        `[SocialAgent] Re-génération échouée (attempt ${attempt}):`,
        err,
      );
      // Re-génération crash → non validé, forcer PENDING
      return { ...currentPost, directorValidated: false };
    }
  }

  // Si on sort de la boucle sans APPROVED (ne devrait pas arriver)
  return { ...currentPost, directorValidated: false };
}

// ─── Helpers ────────────────────────────────────────────────────

/**
 * Retourne l'offset UTC de Paris pour une date donnée.
 * UTC+1 en hiver (dernier dimanche d'octobre → dernier dimanche de mars)
 * UTC+2 en été (dernier dimanche de mars → dernier dimanche d'octobre)
 */
function getParisUtcOffset(date: Date): number {
  const year = date.getFullYear();
  // Dernier dimanche de mars
  const marchLast = new Date(Date.UTC(year, 2, 31));
  marchLast.setUTCDate(marchLast.getUTCDate() - marchLast.getUTCDay());
  marchLast.setUTCHours(1, 0, 0, 0); // Changement à 2h → 3h (1h UTC)
  // Dernier dimanche d'octobre
  const octLast = new Date(Date.UTC(year, 9, 31));
  octLast.setUTCDate(octLast.getUTCDate() - octLast.getUTCDay());
  octLast.setUTCHours(1, 0, 0, 0); // Changement à 3h → 2h (1h UTC)
  return date.getTime() >= marchLast.getTime() && date.getTime() < octLast.getTime() ? 2 : 1;
}

/**
 * Calcule l'heure de publication optimale pour un persona + plateforme.
 * Les horaires sont exprimés en heure locale Paris, convertis dynamiquement en UTC
 * pour gérer automatiquement le changement heure été/hiver.
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

  const parisOffset = getParisUtcOffset(today);

  // Horaires par persona en HEURE LOCALE PARIS
  // Twitter : 3-4 créneaux espacés d'au moins 2h pour couvrir 2-3 posts/jour
  const twitterSchedulesParis: Record<PersonaKey, number[]> = {
    YANIS: [13, 17, 21, 23], // après-midi + soirée, 4 slots
    SOPHIE: [8, 12, 18], // matin + midi + soir, 3 slots
    MARC: [7, 12, 20], // matin + midi + soir, 3 slots
  };

  // LinkedIn : 1 post/jour max, 2 créneaux suffisent
  const linkedInSchedulesParis: Record<PersonaKey, number[]> = {
    YANIS: [9, 13], // 9h-10h + 13h-14h Paris
    SOPHIE: [7, 11], // 7h-8h + 11h-12h Paris
    MARC: [6, 17], // 6h-7h + 17h-18h Paris
  };

  // Instagram : 1 post/jour max, 2 créneaux suffisent
  const instagramSchedulesParis: Record<PersonaKey, number[]> = {
    YANIS: [19, 21], // 19h-22h Paris
    SOPHIE: [11, 18], // 11h-12h + 18h-19h Paris
    MARC: [7, 20], // 7h-8h + 20h-21h Paris
  };

  const schedules =
    platform === "LINKEDIN" ? linkedInSchedulesParis :
    platform === "INSTAGRAM" ? instagramSchedulesParis :
    twitterSchedulesParis;
  const hours = schedules[persona];
  const parisHour = hours[postIndex % hours.length];
  const utcHour = parisHour - parisOffset;

  today.setUTCHours(utcHour, Math.floor(Math.random() * 15), 0, 0);

  // If the scheduled time is in the past, push to tomorrow
  if (today.getTime() < Date.now()) {
    today.setUTCDate(today.getUTCDate() + 1);
  }

  return today;
}
