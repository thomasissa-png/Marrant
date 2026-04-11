import { buildCachedSystemBlock, callWithRetry, extractJson, extractJsonArray, getResponseText } from "../client";
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

interface GeneratedJoke {
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

🟢 BON : "J'ai dit à mon pote que j'arrivais dans 5 minutes. J'étais encore en pyjama." → Relatable, court, twist crédible, tout le monde a vécu ça.
🟢 BON : "Mon seul talent caché c'est qu'après 30 ans, je l'ai toujours pas trouvé." → Autodérision avec punch, on rit de la formulation, pas de la tristesse.
🟢 BON : "Ma collègue m'a dit 'tu devrais sourire plus'. J'ai souri. Elle a regretté." → Comeback net, utilisable au bureau.

🔴 MAUVAIS : "Un stylo dit à un crayon : 'Tu manques de pointe.'" → Objet qui parle, jeu de mots forcé, personne ne raconte ça.
🔴 MAUVAIS : "Pourquoi le chat traverse la route ? Pour aller de l'autre côté." → Format Carambar, zéro twist.
🔴 MAUVAIS : "Je suis tellement seul que même mon ombre m'a quitté." → Autodérision triste sans retournement comique.

═══════════════════════════════════════
FORMAT DE RÉPONSE — JSON STRICT
═══════════════════════════════════════
{
  "content": "Le setup (1-2 phrases, max 25 mots, pose la situation)",
  "punchline": "La chute (1 phrase, max 15 mots, doit CLAQUER)",
  "category": "<catégorie planifiée>",
  "type": "ONE_LINER | SUBTIL | STORY | DIALOGUE | CLASSIQUE | ABSURDE | QA",
  "maturityLevel": 1
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
    model: "claude-sonnet-4-20250514",
    max_tokens: 600,
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

  return parsed;
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
    model: "claude-sonnet-4-20250514",
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
