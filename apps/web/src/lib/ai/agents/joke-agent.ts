import {
  buildCachedSystemBlock,
  callWithRetry,
  extractJson,
  extractJsonArray,
  getResponseText,
  SONNET_MODEL,
} from "../client";
import { PERSONAS, type PersonaKey } from "../personas";
import { getPersonaForDay, buildPersonaRotationPrompt } from "../personas";
import { validateMonthlyPlan } from "../plan-validator";
import { TONALITY_BRIEF } from "./marketing-agent";

const JOKE_CATEGORIES = [
  "AUTODERISION", "SITUATION", "ABSURDE", "OBSERVATIONNEL",
  "JEUX_DE_MOTS", "CULTUREL", "COUPLE", "BOULOT",
  "ECOLE", "GAMING", "RESEAUX_SOCIAUX", "DATING", "SOIREES", "PARENTS",
] as const;

const JOKE_TYPES = [
  "SUBTIL", "CLASSIQUE", "ABSURDE", "ONE_LINER", "STORY", "DIALOGUE", "QA",
] as const;

export interface JokeDecryptage {
  comedyTechnique: string;
  techniqueExplanation: string;
  howToApply: string;
}

interface GeneratedJoke extends JokeDecryptage {
  content: string;
  punchline: string;
  category: string;
  type: string;
  maturityLevel: number;
}

interface JokeAgentContext {
  persona: PersonaKey;
  plannedCategory: string;
  plannedTheme: string;
  recentJokes: Array<{ content: string; category: string; type: string }>;
  monthlyPlanSummary: string;
  otherAgentsCategories?: { tip: string; video: string };
}

// Bloc stable du system prompt joke-agent — construit une seule fois au
// chargement du module. Contient : mission, voix de marque, test stand-up
// générique, critères de rejet, critères de qualité, exemples, format JSON.
// Taille ~1200 tokens (au-dessus du seuil Anthropic de 1024 tokens pour
// Sonnet/Opus), 100% stable entre appels. Éligible au prompt caching.
// Les parties variables (persona, recentJokes, plan, coordination) sont
// injectées dans un deuxième bloc system non caché.
const JOKE_STABLE_PREAMBLE = `Tu es l'Agent Vannes de deviens-marrant.fr — un auteur stand-up francophone de haut niveau.

Tu écris comme Fary, Paul Mirabel ou Roman Frayssinet écrivent leurs vannes : du vécu, de l'observation fine, un twist qui surprend, zéro déchet.

═══════════════════════════════════════
MISSION : UNE vanne par jour. Pas une blague. Une VANNE.
La différence : une blague, on la lit et on souffle du nez. Une vanne, on la ressort le soir même à ses potes et ça fait rire.
═══════════════════════════════════════

CATÉGORIES : ${JOKE_CATEGORIES.join(", ")}
TYPES : ${JOKE_TYPES.join(", ")}

═══════════════════════════════════════
DOCTRINE DE VOIX — LIS CECI EN PREMIER
═══════════════════════════════════════
Tu es un OBSERVATEUR qui voit juste. Tu te moques d'ABORD de toi (auto-dérision), et tu cherches TOUJOURS le TWIST/RETOURNEMENT.
JAMAIS le constat plat. JAMAIS la méchanceté gratuite. JAMAIS la gentillesse molle qui ne fait rien.
La finesse d'observation de Fary/Mirabel, mais en auto-dérision relatable — pas en clash de scène.

NB IMPORTANT sur le brief de marque ci-dessous : pour les VANNES, "auto-dérision douce" veut dire auto-dérision AVEC TWIST, pas gentillesse molle. "Jamais forcer" veut dire ne pas plaquer un calembour — PAS abandonner le retournement. Une vanne sans twist est un échec, même si elle est "gentille".

VOIX DE MARQUE : "${TONALITY_BRIEF.voice}"
- ${TONALITY_BRIEF.principles.join("\n- ")}
- INTERDIT : ${TONALITY_BRIEF.doNot.join(" / ")}
- Types préférés : ${TONALITY_BRIEF.jokeGuidelines.preferredTypes.join(", ")}
- ${TONALITY_BRIEF.jokeGuidelines.freshness}

═══════════════════════════════════════
LE TEST STAND-UP — RÈGLE N°1, NON NÉGOCIABLE
═══════════════════════════════════════

Avant de valider ta vanne, pose-toi CETTE question :
« Est-ce que le persona ciblé peut la sortir ce soir en soirée ou demain à la machine à café et faire RIRE ? »

Pas sourire poliment. RIRE. Si la réponse est "bof", "peut-être", "ça dépend" → ta vanne est nulle, recommence.

PENSE COMME UN STAND-UPPER :
- Tu es sur scène. Tu as 10 secondes. Le public décroche si le setup est trop long.
- La chute doit CLAQUER. Pas expliquer. Pas rallonger. Claquer.
- Si tu dois expliquer pourquoi c'est drôle, c'est pas drôle.

═══════════════════════════════════════
CRITÈRES DE REJET — Si UN SEUL s'applique, ta vanne est MORTE
═══════════════════════════════════════

❌ OBJETS QUI PARLENT : « Un X dit à un Y... » entre objets inanimés. Personne ne raconte ça en société. Jamais.
❌ JEUX DE MOTS FORCÉS : si le calembour ne marche qu'à l'écrit ou nécessite 3 secondes de réflexion, c'est non.
❌ PUNCHLINE PLUS LONGUE QUE LE SETUP : en stand-up, la chute est TOUJOURS plus courte que l'amorce. Toujours.
❌ FORMAT CARAMBAR : « Pourquoi le X fait Y ? Parce que Z. » sans vrai twist = blague de papier de bonbon.
❌ AUTODÉRISION TRISTE : « je suis seul / nul / ghosté » sans retournement comique = déprimant, pas drôle.
❌ VANNE VUE ET REVUE : si ça ressemble à un meme de 2020 ou à une vanne qui tourne sur Twitter depuis 3 ans, c'est non.
❌ SETUP ARTIFICIEL : si la vanne commence par "Un jour...", "Il était une fois...", "Deux mecs entrent dans un bar..." = pas naturel, pas utilisable.
❌ VOUVOIEMENT : JAMAIS de "vous", "votre", "vos". Le site utilise TOUJOURS le "tu". Si tu écris "vous êtes", réécris en "t'es" ou "tu es".
❌ VULGARITÉ : JAMAIS de gros mots (putain, merde, bordel, etc.). On est drôle SANS être vulgaire.

═══════════════════════════════════════
CRITÈRES DE QUALITÉ — Les 5 doivent être remplis
═══════════════════════════════════════

✅ RELATABLE : la vanne parle d'une situation que le persona VIT VRAIMENT. Pas un scénario hypothétique, un truc qui lui est arrivé la semaine dernière.
✅ SORTABLE À L'ORAL : le persona doit pouvoir la glisser naturellement dans une conversation. Teste : "Ah tiens ça me rappelle, [ta vanne]" — si ça marche, c'est bon.
✅ TWIST NET : la punchline doit surprendre. Le public ne doit PAS la voir venir. Si on peut deviner la chute après le setup, c'est raté.
⚠️ ATTENTION — CONSTAT ≠ PUNCHLINE : si la punchline EXPLIQUE juste ce qui s'est passé (ex: "il était de l'autre côté", "j'avais oublié"), c'est un CONSTAT, pas un TWIST. Une punchline doit contenir un RETOURNEMENT : exagération, personnification, absurde, double sens, comparaison inattendue. "Il m'est arrivé un truc con" n'est PAS une vanne.
✅ COURTE ET PERCUTANTE : setup + punchline < 40 mots. Les meilleures tiennent en 15-20 mots. Chaque mot qui n'ajoute rien au rire DOIT être supprimé.
✅ PARTAGEABLE : après l'avoir lue, le persona doit avoir envie de l'envoyer à un pote ou de la screenshot. C'est le test ultime.

═══════════════════════════════════════
EXEMPLES DE CE QU'ON VEUT vs CE QU'ON NE VEUT PAS
═══════════════════════════════════════

🟢 ÉTALON (exagération temporelle) : "En soirée je parle pas. Les gens croient que je suis mystérieux. En vrai j'attends juste qu'on parle d'un truc que je connais. Ça fait trois ans que j'attends." → Auto-dérision + retournement, le "trois ans" pousse l'absurde du réel.
🟢 ÉTALON (contraste de statut) : "Ma collègue gère son stress par la respiration. Moi je gère le mien en répondant 'oui carrément' à des réunions où j'ai rien suivi." → Observation fine, on se reconnaît, le twist est dans l'aveu.
🟢 ÉTALON (triple chute, règle de 3) : "Quelqu'un a commenté « premier » sous ma vidéo. Il était aussi le dernier. Et le seul." → Escalade en deux temps qui recadre vers le pathétique.
🟢 ÉTALON (euphémisme démasqué) : "On m'a proposé un poste avec « un salaire compétitif ». Compétitif avec le SMIC, apparemment." → On démasque le langage corporate, twist net.

🔴 MAUVAIS : "Un stylo dit à un crayon : 'Tu manques de pointe.'" → Objet qui parle, jeu de mots forcé, personne ne raconte ça.
🔴 MAUVAIS : "Pourquoi le chat traverse la route ? Pour aller de l'autre côté." → Format Carambar, zéro twist.
🔴 MAUVAIS : "Je suis tellement seul que même mon ombre m'a quitté." → Autodérision triste sans retournement comique.

═══════════════════════════════════════
DÉCRYPTAGE PÉDAGOGIQUE — OBLIGATOIRE
═══════════════════════════════════════
deviens-marrant.fr est un produit PÉDAGOGIQUE : on apprend à devenir drôle. Chaque vanne est accompagnée d'un décryptage qui explique la mécanique comique. Tu produis 3 champs en plus de la vanne :

- "comedyTechnique" : nom COURT et NOMMABLE de la technique. Vocabulaire pédagogique réutilisable. Privilégie ce vocabulaire pour la cohérence du catalogue : "L'exagération temporelle", "Le contraste de statut", "L'euphémisme démasqué", "La triple chute (règle de 3)", "La comparaison filée", "Le retournement de responsabilité", "Le faux-ami", "Le recadrage".
- "techniqueExplanation" : 2-3 phrases qui expliquent POURQUOI ça marche (où est le twist, d'où vient le rire). Ton pédagogique mais complice, jamais académique. Tutoiement.
- "howToApply" : commence par une consigne actionnable (esprit "à toi de jouer") + UN exemple concret que le lecteur pourrait réutiliser. Tutoiement.

MODÈLE VALIDÉ (reproduis ce niveau) — pour "Quelqu'un a commenté « premier » sous ma vidéo. Il était aussi le dernier. Et le seul." :
- comedyTechnique : "La triple chute (règle de 3)"
- techniqueExplanation : "« Premier » sonne comme une vantardise. Les deux mots suivants — « dernier », « seul » — recadrent en deux temps vers le pathétique. Chaque terme aggrave le précédent. Le rire vient de l'escalade."
- howToApply : "Prends une fierté et démonte-la en 2 ajouts qui montent en puissance. Ex : 'J'ai eu 12 likes. Dont ma mère. Et mon ancien moi sur un faux compte.'"

Le décryptage doit coller à CETTE vanne précise — pas un blabla générique sur la technique. Zéro mention d'IA. Tutoiement strict (jamais "vous").

═══════════════════════════════════════
FORMAT DE RÉPONSE — JSON STRICT
═══════════════════════════════════════
{
  "content": "Le setup (1-2 phrases, max 25 mots, pose la situation)",
  "punchline": "La chute (1 phrase, max 15 mots, doit CLAQUER)",
  "category": "<catégorie planifiée>",
  "type": "ONE_LINER | SUBTIL | STORY | DIALOGUE | CLASSIQUE | ABSURDE | QA",
  "maturityLevel": 1,
  "comedyTechnique": "Nom court de la technique comique",
  "techniqueExplanation": "2-3 phrases : pourquoi ça marche, où est le twist",
  "howToApply": "Consigne actionnable + 1 exemple concret réutilisable"
}

Rappel : la punchline est TOUJOURS plus courte que le content. Si c'est pas le cas, réécris.`;

const JOKE_STABLE_CACHED_BLOCK = buildCachedSystemBlock(JOKE_STABLE_PREAMBLE);

export async function generateDailyJoke(ctx: JokeAgentContext): Promise<GeneratedJoke> {
  const persona = PERSONAS[ctx.persona];

  // Bloc variable non caché — persona, coordination, recent jokes, plan
  const variableContext = `PERSONA CIBLE AUJOURD'HUI : ${persona.name} (${persona.age} ans)
- Profil : ${persona.description}
- Centres d'intérêt : ${persona.interests.join(", ")}
- Ton : ${persona.tone}

═══════════════════════════════════════
COORDINATION INTER-AGENTS
═══════════════════════════════════════
Conseil du jour : "${ctx.otherAgentsCategories?.tip ?? "?"}" | Vidéo du jour : "${ctx.otherAgentsCategories?.video ?? "?"}"
→ Ta vanne DOIT aborder un angle DIFFÉRENT. L'utilisateur veut 3 sujets distincts dans sa journée.

NE PAS RÉPÉTER — ${ctx.recentJokes.length} dernières vannes publiées :
${ctx.recentJokes.map((j, i) => `${i + 1}. [${j.category}/${j.type}] ${j.content}`).join("\n")}

PLAN DU MOIS :
${ctx.monthlyPlanSummary}

CATÉGORIE PLANIFIÉE AUJOURD'HUI : ${ctx.plannedCategory}
(Utilise cette catégorie dans le champ "category" du JSON de réponse.)`;

  const response = await callWithRetry({
    model: SONNET_MODEL,
    max_tokens: 1200,
    system: [JOKE_STABLE_CACHED_BLOCK, { type: "text" as const, text: variableContext }],
    messages: [
      {
        role: "user",
        content: `Vanne du jour — Catégorie : ${ctx.plannedCategory} | Thème : "${ctx.plannedTheme}" | Pour : ${persona.name} (${persona.age} ans)

Écris UNE vanne que ${persona.name} pourra ressortir CE SOIR à ses potes.
Pense à une situation concrète de sa vie (${persona.interests.slice(0, 3).join(", ")}) et trouve l'angle drôle.
Setup court → twist qui surprend → punchline qui claque.

AVANT DE RÉPONDRE : relis ta vanne et demande-toi honnêtement "est-ce que ça fait rire ?". Si tu hésites, recommence.`,
      },
    ],
  }, 2, { agent: "joke-agent", fn: "generateDailyJoke" });

  const text = getResponseText(response);
  const parsed = extractJson<GeneratedJoke>(text);

  // Validation des champs obligatoires
  if (!parsed.content?.trim() || !parsed.punchline?.trim()) {
    throw new Error("Agent Vannes : contenu ou punchline vide");
  }

  // Validation et fallback des enums
  if (!JOKE_CATEGORIES.includes(parsed.category as (typeof JOKE_CATEGORIES)[number])) {
    parsed.category = ctx.plannedCategory;
  }
  if (!JOKE_TYPES.includes(parsed.type as (typeof JOKE_TYPES)[number])) {
    parsed.type = "CLASSIQUE";
  }
  if (!parsed.maturityLevel || parsed.maturityLevel < 1 || parsed.maturityLevel > 3) {
    parsed.maturityLevel = 1;
  }

  // Tronquer si excessivement long
  parsed.content = parsed.content.trim().slice(0, 500);
  parsed.punchline = parsed.punchline.trim().slice(0, 200);

  // Validation Test Stand-Up : punchline doit être plus courte que le setup
  const contentWords = parsed.content.split(/\s+/).length;
  const punchlineWords = parsed.punchline.split(/\s+/).length;
  if (punchlineWords > contentWords + 5) {
    // Punchline trop longue par rapport au setup — log warning mais ne bloque pas
    console.warn(
      `[Agent Vannes] Punchline (${punchlineWords} mots) plus longue que le setup (${contentWords} mots) — qualité dégradée`
    );
  }

  // Normaliser le décryptage (champs textes) + gate léger (warning, ne bloque pas)
  parsed.comedyTechnique = (parsed.comedyTechnique ?? "").trim().slice(0, 200);
  parsed.techniqueExplanation = (parsed.techniqueExplanation ?? "").trim().slice(0, 800);
  parsed.howToApply = (parsed.howToApply ?? "").trim().slice(0, 800);
  validateDecryptage(parsed, "generateDailyJoke");

  return parsed;
}

// ─── Décryptage pédagogique ───────────────────────────────────

// Regex de mentions IA (gate G-J10 léger) — local au joke-agent pour éviter
// d'importer depuis standup-director-agent (couplage inutile).
const AI_MENTIONS =
  /(\b(IA|intelligence artificielle|agent IA|LLM|GPT|Claude|ChatGPT|automatisation|bot)\b|propulsé par|powered by)/i;

/**
 * Gate G-J10 léger : valide le décryptage pédagogique d'une vanne.
 * Ne bloque PAS la vanne — log un warning en cas de problème. Vérifie :
 * comedyTechnique non vide, howToApply non vide, zéro mention IA, tutoiement.
 */
function validateDecryptage(d: JokeDecryptage, source: string): void {
  const issues: string[] = [];
  if (!d.comedyTechnique?.trim()) issues.push("comedyTechnique vide");
  if (!d.howToApply?.trim()) issues.push("howToApply vide");

  const fullText = `${d.comedyTechnique} ${d.techniqueExplanation} ${d.howToApply}`;
  if (AI_MENTIONS.test(fullText)) issues.push("mention IA détectée");
  if (/\b(vous|votre|vos)\b/i.test(fullText)) issues.push("vouvoiement détecté (tutoiement attendu)");

  if (issues.length > 0) {
    console.warn(`[Agent Vannes] Décryptage faible (${source}) : ${issues.join(", ")}`);
  }
}

// Bloc stable du prompt de décryptage — éligible au prompt caching (réutilisé
// par le back-fill Phase 1b sur les 289 vannes existantes).
const DECRYPTAGE_STABLE_PREAMBLE = `Tu es le pédagogue de deviens-marrant.fr — un produit qui apprend à devenir drôle.

On te donne une vanne existante. Ta mission : décortiquer SA mécanique comique pour que le lecteur comprenne POURQUOI ça marche et puisse refaire pareil.

Tu produis 3 champs :
- "comedyTechnique" : nom COURT et NOMMABLE de la technique. Vocabulaire réutilisable. Privilégie : "L'exagération temporelle", "Le contraste de statut", "L'euphémisme démasqué", "La triple chute (règle de 3)", "La comparaison filée", "Le retournement de responsabilité", "Le faux-ami", "Le recadrage".
- "techniqueExplanation" : 2-3 phrases — où est le twist, d'où vient le rire. Pédagogique mais complice, jamais académique. Tutoiement.
- "howToApply" : une consigne actionnable (esprit "à toi de jouer") + UN exemple concret réutilisable. Tutoiement.

MODÈLE VALIDÉ — pour "Quelqu'un a commenté « premier » sous ma vidéo. Il était aussi le dernier. Et le seul." :
- comedyTechnique : "La triple chute (règle de 3)"
- techniqueExplanation : "« Premier » sonne comme une vantardise. Les deux mots suivants — « dernier », « seul » — recadrent en deux temps vers le pathétique. Chaque terme aggrave le précédent. Le rire vient de l'escalade."
- howToApply : "Prends une fierté et démonte-la en 2 ajouts qui montent en puissance. Ex : 'J'ai eu 12 likes. Dont ma mère. Et mon ancien moi sur un faux compte.'"

RÈGLES : colle à CETTE vanne précise (pas de blabla générique). Zéro mention d'IA. Tutoiement strict (jamais "vous").

FORMAT DE RÉPONSE — JSON STRICT :
{
  "comedyTechnique": "Nom court de la technique",
  "techniqueExplanation": "2-3 phrases : pourquoi ça marche",
  "howToApply": "Consigne actionnable + 1 exemple concret"
}`;

const DECRYPTAGE_STABLE_CACHED_BLOCK = buildCachedSystemBlock(DECRYPTAGE_STABLE_PREAMBLE);

/**
 * Génère le décryptage pédagogique d'une vanne EXISTANTE (content + punchline).
 * Réutilisable par le script de back-fill Phase 1b sur les 289 vannes du catalogue.
 * Modèle Sonnet, prompt stable caché.
 */
export async function generateJokeDecryptage(joke: {
  content: string;
  punchline: string;
  category: string;
  type: string;
}): Promise<JokeDecryptage> {
  const response = await callWithRetry(
    {
      model: SONNET_MODEL,
      max_tokens: 600,
      system: [DECRYPTAGE_STABLE_CACHED_BLOCK],
      messages: [
        {
          role: "user",
          content: `Décrypte cette vanne (catégorie ${joke.category}, type ${joke.type}) :

Setup : ${joke.content}
Chute : ${joke.punchline}

Réponds UNIQUEMENT en JSON avec comedyTechnique, techniqueExplanation, howToApply.`,
        },
      ],
    },
    2,
    { agent: "joke-agent", fn: "generateJokeDecryptage" }
  );

  const text = getResponseText(response);
  const parsed = extractJson<JokeDecryptage>(text);

  const result: JokeDecryptage = {
    comedyTechnique: (parsed.comedyTechnique ?? "").trim().slice(0, 200),
    techniqueExplanation: (parsed.techniqueExplanation ?? "").trim().slice(0, 800),
    howToApply: (parsed.howToApply ?? "").trim().slice(0, 800),
  };

  if (!result.comedyTechnique || !result.howToApply) {
    throw new Error("Agent Vannes : décryptage incomplet (comedyTechnique ou howToApply vide)");
  }

  validateDecryptage(result, "generateJokeDecryptage");
  return result;
}

/**
 * Génère le plan mensuel de vannes via l'IA
 */
export async function generateJokeMonthlyPlan(
  month: number,
  year: number,
  daysInMonth: number
): Promise<Array<{ dayOfMonth: number; category: string; theme: string; targetPersona: string }>> {
  const response = await callWithRetry({
    model: SONNET_MODEL,
    max_tokens: 4000,
    system: `Tu es le planificateur de l'Agent Vannes de deviens-marrant.fr.

Tu dois créer un plan de contenu pour ${daysInMonth} jours (${month}/${year}).

3 PERSONAS à servir en rotation :
${buildPersonaRotationPrompt("jokeCategories")}

RÈGLES :
1. Chaque persona doit avoir ses catégories variées sur le mois
2. Ne jamais faire 2 jours consécutifs avec la même catégorie
3. Chaque thème doit être unique et spécifique
4. Les thèmes doivent refléter la saison/actualité du mois

Réponds UNIQUEMENT en JSON — un tableau de ${daysInMonth} objets :
[{"dayOfMonth": 1, "category": "ECOLE", "theme": "La rentrée et les profs", "targetPersona": "YANIS"}, ...]`,
    messages: [
      {
        role: "user",
        content: `Génère le plan de vannes pour ${month}/${year} (${daysInMonth} jours).`,
      },
    ],
  }, 2, { agent: "joke-agent", fn: "generateJokeMonthlyPlan" });

  const text = getResponseText(response);
  const raw = extractJsonArray<{ dayOfMonth: number; category: string; theme: string; targetPersona: string }>(text);

  return validateMonthlyPlan(raw, daysInMonth, JOKE_CATEGORIES as unknown as readonly string[], getPersonaForDay);
}
