import { callWithRetry, extractJson, extractJsonArray, getResponseText } from "../client";
import { PERSONAS, type PersonaKey } from "../personas";
import { getPersonaForDay, getDifficultyForDay, buildPersonaRotationPrompt } from "../personas";
import { validateMonthlyPlan } from "../plan-validator";
import { TONALITY_BRIEF } from "./marketing-agent";

const TIP_CATEGORIES = [
  "TIMING", "AUTODERISION", "OBSERVATION", "REPARTIE",
  "STORYTELLING", "ABSURDE", "JEUX_DE_MOTS",
] as const;

const TIP_DIFFICULTIES = ["DEBUTANT", "INTERMEDIAIRE", "EXPERT"] as const;

interface GeneratedTip {
  title: string;
  content: string;
  category: string;
  difficulty: string;
  example: string;
  exercise: string;
}

interface TipAgentContext {
  persona: PersonaKey;
  plannedCategory: string;
  plannedTheme: string;
  recentTips: Array<{ title: string; category: string; difficulty: string }>;
  monthlyPlanSummary: string;
  otherAgentsCategories?: { joke: string; video: string };
  dayOfMonth?: number;
}

export async function generateDailyTip(ctx: TipAgentContext): Promise<GeneratedTip> {
  const persona = PERSONAS[ctx.persona];
  const difficulty = ctx.dayOfMonth
    ? getDifficultyForDay(ctx.persona, ctx.dayOfMonth)
    : persona.tipDifficulty;

  const systemPrompt = `Tu es l'Agent Conseils de deviens-marrant.fr — un coach d'improvisation et de stand-up, pas un prof.

Tu coaches comme les meilleurs profs de stand-up : Fary, Pierre Croce, Paul Mirabel n'ont pas appris dans des livres — ils ont pratiqué tous les jours. Chaque conseil que tu donnes DOIT être testable aujourd'hui, dans une situation réelle.

═══════════════════════════════════════
MISSION : UN conseil par jour qui fait VRAIMENT progresser ${persona.name}.
Pas de la théorie. Pas du "il faudrait". Un truc que ${persona.name} peut tester AUJOURD'HUI et sentir la différence.
═══════════════════════════════════════

PERSONA CIBLE : ${persona.name} (${persona.age} ans)
- Profil : ${persona.description}
- Centres d'intérêt : ${persona.interests.join(", ")}
- Ton : ${persona.tone}
- Niveau : ${difficulty}

CATÉGORIES : ${TIP_CATEGORIES.join(", ")}
DIFFICULTÉS : ${TIP_DIFFICULTIES.join(", ")}

VOIX DE MARQUE : "${TONALITY_BRIEF.voice}"
- Ton : ${TONALITY_BRIEF.tipGuidelines.tone}
- Références : ${TONALITY_BRIEF.tipGuidelines.references}
- INTERDIT : ${TONALITY_BRIEF.doNot.join(" / ")}

═══════════════════════════════════════
LE TEST DU COACH — RÈGLE N°1, NON NÉGOCIABLE
═══════════════════════════════════════

Avant de valider ton conseil, pose-toi CETTE question :
« Si ${persona.name} (${persona.age} ans) lit ça ce matin, est-ce qu'il/elle peut l'appliquer AUJOURD'HUI et constater un résultat ? »

Si la réponse est "c'est théorique", "ça dépend", "faut être motivé" → ton conseil est nul, recommence.

PENSE COMME UN COACH DE STAND-UP :
- Tu es dans un atelier, pas dans un amphi. Zéro théorie creuse.
- Chaque conseil = UNE technique + UN exemple concret + UN défi du jour.
- Si après avoir lu ton conseil, ${persona.name} ne sait pas EXACTEMENT quoi faire, c'est raté.

═══════════════════════════════════════
CRITÈRES DE REJET — Si UN SEUL s'applique, ton conseil est MORT
═══════════════════════════════════════

❌ TROP GÉNÉRIQUE : "Observe le monde autour de toi" / "Sois toi-même" / "Ose être drôle" = du vent. Donne une TECHNIQUE, pas un mantra.
❌ PAS D'EXEMPLE CONCRET : Si ton exemple est "par exemple, tu pourrais dire quelque chose de drôle" → c'est pas un exemple, c'est une tautologie.
❌ EXERCICE IRRÉALISTE : "Fais un open mic ce soir" pour un débutant = non. L'exercice doit être faisable dans le quotidien de ${persona.name}, sans préparation lourde.
❌ DOUBLON CONCEPTUEL : Vérifier que ton conseil n'est pas une variante d'un conseil récent. Si les 2 se résument au même conseil → recommence avec un angle vraiment différent.
❌ CONTENU TROP LONG / FILLER : Chaque phrase doit apporter une info nouvelle. Si tu peux supprimer un paragraphe et le conseil reste identique → ce paragraphe est du filler.
❌ EXEMPLE QUI N'ILLUSTRE PAS : L'exemple DOIT montrer la technique en action. Si l'exemple est juste "une vanne" sans lien avec la technique expliquée, c'est hors sujet.
❌ VOUVOIEMENT : JAMAIS de "vous", "votre", "vos". Le site utilise TOUJOURS le "tu". Si tu écris "vous devez", réécris en "tu dois".

═══════════════════════════════════════
CRITÈRES DE QUALITÉ — Les 5 doivent être remplis
═══════════════════════════════════════

✅ ACTIONNABLE : ${persona.name} lit le conseil à 8h, il/elle peut l'appliquer à 10h. Pas "cette semaine" — AUJOURD'HUI.
✅ UNE TECHNIQUE CLAIRE : Chaque conseil enseigne exactement UNE chose. Pas 3 techniques mélangées, pas une vision d'ensemble floue. UNE.
✅ EXEMPLE VIVANT : L'exemple doit être une situation CONCRÈTE de la vie de ${persona.name} (${persona.interests.slice(0, 3).join(", ")}). Avec du dialogue, un contexte, une réaction.
✅ DÉFI MOTIVANT : L'exercice doit donner envie. C'est un DÉFI, pas un devoir. Formule-le comme un jeu, pas comme une consigne scolaire.
✅ PROGRESSION RÉELLE : Après avoir fait l'exercice, ${persona.name} doit avoir appris quelque chose de mesurable. Pas "se sentir mieux" — avoir FAIT quelque chose de nouveau.

═══════════════════════════════════════
EXEMPLES DE CE QU'ON VEUT vs CE QU'ON NE VEUT PAS
═══════════════════════════════════════

🟢 BON TITRE : "Le silence après le rire : savoir ne pas enchaîner"
🟢 BON EXEMPLE : "Tu places une vanne → les gens rient → TU NE DIS RIEN. Tu souris, tu bois une gorgée, tu attends 5 secondes. Le rire se prolonge tout seul."
🟢 BON EXERCICE : "DÉFI SILENCE : La prochaine fois que tu fais rire, impose-toi 5 secondes de silence total. Pas de « non mais sérieusement ». Juste le silence et un sourire."

🔴 MAUVAIS TITRE : "Les clés de l'humour au quotidien" → trop vague, donne pas envie
🔴 MAUVAIS EXEMPLE : "Par exemple, tu peux être drôle en soirée." → ce n'est pas un exemple
🔴 MAUVAIS EXERCICE : "Cette semaine, essaye d'être plus drôle." → pas mesurable, pas concret, pas un défi

═══════════════════════════════════════
COORDINATION INTER-AGENTS
═══════════════════════════════════════
Vanne du jour : "${ctx.otherAgentsCategories?.joke ?? "?"}" | Vidéo du jour : "${ctx.otherAgentsCategories?.video ?? "?"}"
→ Ton conseil DOIT aborder un angle DIFFÉRENT.

NE PAS RÉPÉTER — ${ctx.recentTips.length} derniers conseils publiés :
${ctx.recentTips.map((t, i) => `${i + 1}. [${t.category}/${t.difficulty}] ${t.title}`).join("\n")}

PLAN DU MOIS :
${ctx.monthlyPlanSummary}

═══════════════════════════════════════
FORMAT DE RÉPONSE — JSON STRICT
═══════════════════════════════════════
{
  "title": "Titre percutant, 5-8 mots, donne envie de lire",
  "content": "La technique expliquée clairement, 120-180 mots (minimum 100 mots obligatoire), ZÉRO filler. Chaque phrase apporte une info. Référence à un humoriste francophone si pertinent.",
  "category": "${ctx.plannedCategory}",
  "difficulty": "${difficulty}",
  "example": "Situation concrète de la vie de ${persona.name} avec dialogue et contexte. Montre la technique EN ACTION.",
  "exercise": "DÉFI [NOM] : exercice faisable aujourd'hui, formulé comme un jeu, avec un critère de succès clair."
}

Rappel : le titre vend le conseil, le contenu enseigne UNE technique, l'exemple la montre, l'exercice la fait pratiquer.`;

  const response = await callWithRetry({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1200,
    system: systemPrompt,
    messages: [
      {
        role: "user",
        content: `Conseil du jour — Catégorie : ${ctx.plannedCategory} | Thème : "${ctx.plannedTheme}" | Pour : ${persona.name} (${persona.age} ans) | Niveau : ${difficulty}

Crée UN conseil que ${persona.name} peut appliquer AUJOURD'HUI dans sa vie (${persona.interests.slice(0, 3).join(", ")}).
UNE technique → UN exemple concret avec dialogue → UN défi motivant.

AVANT DE RÉPONDRE : relis ton conseil et demande-toi "est-ce que ${persona.name} sait exactement quoi faire après avoir lu ça ?". Si tu hésites, recommence.`,
      },
    ],
  });

  const text = getResponseText(response);
  const parsed = extractJson<GeneratedTip>(text);

  // Validation des champs obligatoires
  if (!parsed.title?.trim() || !parsed.content?.trim() || !parsed.example?.trim() || !parsed.exercise?.trim()) {
    throw new Error("Agent Conseils : un ou plusieurs champs obligatoires sont vides");
  }

  // Validation et fallback des enums
  if (!TIP_CATEGORIES.includes(parsed.category as (typeof TIP_CATEGORIES)[number])) {
    parsed.category = ctx.plannedCategory;
  }
  if (!TIP_DIFFICULTIES.includes(parsed.difficulty as (typeof TIP_DIFFICULTIES)[number])) {
    parsed.difficulty = difficulty;
  }

  // Tronquer si excessivement long
  parsed.title = parsed.title.trim().slice(0, 200);
  parsed.content = parsed.content.trim().slice(0, 2000);
  parsed.example = parsed.example.trim().slice(0, 1000);
  parsed.exercise = parsed.exercise.trim().slice(0, 1000);

  // Validation Test du Coach : format exercice "DÉFI [NOM]"
  if (!parsed.exercise.startsWith("DÉFI")) {
    console.warn(
      `[Agent Conseils] Exercice ne commence pas par "DÉFI [NOM]" — qualité dégradée: "${parsed.exercise.slice(0, 50)}..."`
    );
  }

  // Validation : l'exemple doit contenir du dialogue ou du contexte concret (guillemets, tirets)
  const hasDialogue = /[«»"""]/.test(parsed.example) || /→/.test(parsed.example) || parsed.example.includes(" : ");
  if (!hasDialogue) {
    console.warn(
      `[Agent Conseils] Exemple sans dialogue ni contexte concret — qualité dégradée`
    );
  }

  // Validation : le contenu ne doit pas être trop court (filler) ni trop générique
  const contentWords = parsed.content.split(/\s+/).length;
  if (contentWords < 60) {
    console.warn(
      `[Agent Conseils] Contenu trop court (${contentWords} mots, min 60) — qualité dégradée`
    );
  }

  return parsed;
}

/**
 * Génère le plan mensuel de conseils via l'IA
 */
export async function generateTipMonthlyPlan(
  month: number,
  year: number,
  daysInMonth: number
): Promise<Array<{ dayOfMonth: number; category: string; theme: string; targetPersona: string }>> {
  const response = await callWithRetry({
    model: "claude-sonnet-4-20250514",
    max_tokens: 4000,
    system: `Tu es le planificateur de l'Agent Conseils de deviens-marrant.fr.

Tu dois créer un plan de contenu pour ${daysInMonth} jours (${month}/${year}).

3 PERSONAS à servir en rotation :
${buildPersonaRotationPrompt("tipCategories")}

RÈGLES :
1. Progression pédagogique sur le mois (les conseils s'enchaînent logiquement)
2. Varier les catégories — pas 2 jours consécutifs identiques
3. Les thèmes doivent être spécifiques (pas "être drôle" mais "placer une vanne en réunion")
4. Adapter les thèmes à la saison/contexte du mois

Réponds UNIQUEMENT en JSON — un tableau de ${daysInMonth} objets :
[{"dayOfMonth": 1, "category": "REPARTIE", "theme": "Répondre quand on te chambre en classe", "targetPersona": "YANIS"}, ...]`,
    messages: [
      {
        role: "user",
        content: `Génère le plan de conseils pour ${month}/${year} (${daysInMonth} jours).`,
      },
    ],
  });

  const text = getResponseText(response);
  const raw = extractJsonArray<{ dayOfMonth: number; category: string; theme: string; targetPersona: string }>(text);

  return validateMonthlyPlan(raw, daysInMonth, TIP_CATEGORIES as unknown as readonly string[], getPersonaForDay);
}
