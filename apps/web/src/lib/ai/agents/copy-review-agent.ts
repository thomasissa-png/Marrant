/**
 * Copy Review Agent — s11 refonte copy.
 *
 * Rôle : relire les contenus générés par IA (vannes + conseils, `generatedByAI=true`)
 * pour les aligner sur la charte s11. Ces contenus sont invisibles depuis
 * l'admin (≈ 340 vannes + 335 conseils en prod), donc la relecture doit être
 * AUTOMATIQUE, PRUDENTE, RÉVERSIBLE.
 *
 * Verdicts (charte s11) :
 *  - GARDER : la vanne/le conseil respecte la charte, on ne touche à rien.
 *      Vannes (lot Q2, s14) : GARDER seulement au niveau des étalons de la
 *      barre Alexa (joke-quality-bar) ; GARDER = éligible vanne du jour.
 *  - REECRIRE : idée bonne, exécution faible → même idée, meilleure exécution.
 *      Vannes : la réécriture est revalidée par validateJoke avec la barre
 *      (dailyGeneration) ; écrite seulement si APPROVED, sinon l'original
 *      reste marqué REECRIRE (hors vanne du jour). Conseils : Director ≥ 8.
 *  - RETIRER : idée irrattrapable (calembour phonétique, constat sans twist,
 *      blessant, doublon, mention IA). isActive → false, ligne conservée.
 *
 * Règles fondateur (prime sur tout) :
 *  - « On ne supprime pas des choses qui marchent simplement parce qu'on a
 *    un doute » → en cas d'hésitation, jamais RETIRER. Vannes : le doute mène
 *    à REECRIRE (barre Alexa, 30/09/2026). Conseils : le doute mène à GARDER.
 *  - Préférer REECRIRE à RETIRER dès que l'idée tient.
 *  - Ne JAMAIS retirer ou modifier un chiffre / une stat / une citation
 *    présent(e) dans un contenu gardé ou réécrit.
 *  - RETIRER exige une justification parmi une liste fermée. Toute autre
 *    raison → forcé à GARDER.
 *
 * Budget maîtrisé : lot borné par jour (COPY_REVIEW_BATCH, défaut 25 vannes
 * + 25 conseils). Kill-switch : COPY_REVIEW_ENABLED=false coupe le job.
 * Idempotent : on ne relit une entrée que si `copyReviewVersion` diffère de
 * la version courante de la charte (`COPY_REVIEW_VERSION`, défaut 1).
 */
import {
  buildCachedSystemBlock,
  callWithRetry,
  extractJson,
  getResponseText,
  SONNET_MODEL,
} from "../client";
import { JOKE_QUALITY_BAR } from "../joke-quality-bar";

export { COPY_REVIEW_VERSION, parseCopyReviewVersion } from "../copy-review-version";

/** Verdicts autorisés par le pipeline de relecture (charte s11). */
export type CopyReviewVerdict = "GARDER" | "REECRIRE" | "RETIRER";

/**
 * Motifs autorisés pour un verdict RETIRER (liste FERMÉE, garde-fou fondateur).
 * Toute autre raison → forcé à GARDER.
 */
export const ALLOWED_RETIRER_REASONS = [
  "calembour phonétique",
  "constat sans twist",
  "blessant",
  "doublon",
  "mention IA",
] as const;
export type RetirerReason = (typeof ALLOWED_RETIRER_REASONS)[number];

export interface JokeReviewInput {
  content: string;
  punchline: string;
  category: string;
  type: string;
  comedyTechnique?: string | null;
  techniqueExplanation?: string | null;
  howToApply?: string | null;
}

export interface TipReviewInput {
  title: string;
  content: string;
  example: string;
  exercise: string;
  category: string;
  difficulty: string;
}

export interface JokeReviewResult {
  verdict: CopyReviewVerdict;
  reason: string;
  /** Si REECRIRE : nouvelle version complète (vanne + décryptage). */
  rewritten?: {
    content: string;
    punchline: string;
    comedyTechnique: string;
    techniqueExplanation: string;
    howToApply: string;
  };
}

export interface TipReviewResult {
  verdict: CopyReviewVerdict;
  reason: string;
  /** Si REECRIRE : nouvelle version complète du conseil. */
  rewritten?: {
    title: string;
    content: string;
    example: string;
    exercise: string;
  };
}

// ─── System prompts stables (éligibles prompt caching) ───────────

const CHARTE_RECAP = `═══════════════════════════════════════
CHARTE DE RELECTURE — session 11 (validée fondateur 29/09/2026)
═══════════════════════════════════════

RÈGLES ABSOLUES (non négociables) :
1. AUCUN chiffre retiré, remplacé ou modifié. Statistiques, prix, durées, XP,
   nombres de membres — on garde tel quel. Si un chiffre semble faux, on
   le signale mais on n'y touche pas.
2. Le contenu ne dit JAMAIS qu'il a été écrit par une IA ("propulsé par une
   IA", "généré par IA", "en tant qu'IA") : si c'est le cas → RETIRER (raison
   "mention IA"). En revanche l'IA comme SUJET de vanne ou d'exemple
   (ChatGPT, Alexa, Siri, chatbot, assistant vocal) est AUTORISÉE, c'est un
   sujet d'actualité (choix fondateur 30/09/2026) : ne la remplace pas, ne
   la retire pas pour ce motif. On veut un peu de tout.
3. Tutoiement partout. Le site parle au lecteur avec "tu", pas "vous".
4. Zéro invention : ne crée pas de nouveau chiffre, témoignage, citation.
5. Zéro concurrent nommé.

BARRE QUALITÉ VANNE :
- Observateur auto-dérisoire avec un vrai retournement d'idée.
- Objectif : sourire NET + envie de la ressortir (la valeur est dans le décryptage).
- ❌ Calembour phonétique (chien → chat, coup de foudre → allergie qui coule) :
  si tu peux expliquer par "parce que ça sonne comme…", c'est raté.
- ❌ Constat ou dramatisation sans twist ("mon pull c'est ma survie").
- ❌ Vanne de comptoir, carambar, cliché daté, moquerie d'un groupe.
- ❌ Blague déjà connue ailleurs (classique d'Internet, meme recyclé, vanne de
  tonton), même bonne : elle est FAIBLE (choix fondateur 29/09/2026 — la
  promesse du site = des vannes qu'on n'a jamais entendues). Verdict :
  REECRIRE avec une vanne ORIGINALE sur la même situation (exception assumée
  à "même idée" : ici c'est l'idée qui est empruntée). Jamais RETIRER pour ce motif.
- ❌ Chute plus longue que le setup ; setup bavard.
- ❌ Vulgarité, vouvoiement, contenu qui dit avoir été écrit par une IA.

BARRE QUALITÉ CONSEIL :
- UNE technique claire, actionnable AUJOURD'HUI (pas "cette semaine").
- Exemple avec dialogue concret, pas d'exemple générique.
- Exercice au format "DÉFI [NOM] : …", faisable dans le quotidien.
- Zéro ton scolaire ("mémoriser" → "ressortir"), zéro jargon marketing.
- Zéro vocabulaire "coach" pour la marque (le site n'est pas un coach).

RÈGLE DES CHIFFRES : quand tu réécris, tu conserves TOUS les chiffres,
statistiques et citations présents dans l'original. Tu ne les remplaces
pas, tu ne les ajoutes pas.`;

/**
 * Verdicts vannes (lot Q2, s14, barre Alexa validée par Thomas le 30/09/2026) :
 * GARDER seulement au niveau des étalons, le doute mène à REECRIRE. Une vanne
 * REECRIRE non réécrite reste au catalogue mais n'est jamais vanne du jour.
 */
const JOKE_VERDICTS = `VERDICTS AUTORISÉS (vannes) :
- GARDER : uniquement si la vanne est au niveau des quatre étalons de la barre
  plancher ci-dessous (chute surprenante non télégraphiée, courte, logique,
  observation vraie, aucun tic listé). GARDER = la vanne peut être vanne du jour.
- REECRIRE : sous la barre, ou en cas de doute. Tu proposes une réécriture au
  niveau des étalons : même situation, meilleure exécution (ou vanne originale
  sur la même situation si l'idée est empruntée). Si l'idée ne permet pas
  d'atteindre la barre, REECRIRE quand même avec ta meilleure version : elle
  sera revalidée avant d'être écrite, l'original reste sinon.
- RETIRER : idée irrattrapable. Raison OBLIGATOIRE parmi la liste fermée :
  "calembour phonétique", "constat sans twist", "blessant", "doublon",
  "mention IA". Toute autre raison invalide le verdict → REECRIRE.

RÈGLE DU DOUTE (vannes) : si tu hésites entre GARDER et REECRIRE → REECRIRE.
Si tu hésites entre REECRIRE et RETIRER → REECRIRE. On ne supprime rien par
doute, mais on ne garde pas non plus une vanne moyenne comme vanne du jour.`;

/** Verdicts conseils : inchangés (règle fondateur du 29/09 : doute = GARDER). */
const TIP_VERDICTS = `VERDICTS AUTORISÉS (conseils) :
- GARDER : respecte la charte OU en cas de doute (règle fondateur : on ne
  supprime pas ce qui marche par doute).
- REECRIRE : bonne idée, exécution faible. Résultat : MÊME IDÉE, meilleure
  exécution. Préférer REECRIRE à RETIRER dès que l'idée tient.
- RETIRER : idée irrattrapable. Raison OBLIGATOIRE parmi la liste fermée :
  "calembour phonétique", "constat sans twist", "blessant", "doublon",
  "mention IA". Toute autre raison invalide le verdict → forcé à GARDER.

RÈGLE DU DOUTE : « on ne supprime pas des choses qui marchent simplement
parce qu'on a un doute ». Si tu hésites entre GARDER et REECRIRE → GARDER.
Si tu hésites entre REECRIRE et RETIRER → REECRIRE.`;

const JOKE_REVIEW_STABLE = `Tu es le relecteur qualité des vannes de deviens-marrant.fr.
Ta mission : appliquer la charte de relecture et la barre plancher des étalons.

${CHARTE_RECAP}

${JOKE_QUALITY_BAR}

${JOKE_VERDICTS}
(Une réécriture ne reprend jamais un étalon. L'exemple du howToApply est neuf lui aussi.)

DÉCRYPTAGE (obligatoire si REECRIRE) — même barre que le catalogue :
- comedyTechnique : nom court, pédagogique et réutilisable (ex. "L'exagération temporelle").
- techniqueExplanation : 2-3 phrases précises, tutoiement, pas académique.
- howToApply : une consigne actionnable + UN exemple réutilisable, différent de la vanne.

FORMAT DE RÉPONSE — JSON STRICT :
{
  "verdict": "GARDER" | "REECRIRE" | "RETIRER",
  "reason": "1-2 phrases qui justifient le verdict. Si RETIRER, DOIT contenir une des raisons fermées : calembour phonétique / constat sans twist / blessant / doublon / mention IA.",
  "rewritten": {                        // OBLIGATOIRE si verdict = REECRIRE, ABSENT sinon
    "content": "setup réécrit",
    "punchline": "chute réécrite (plus courte que le setup)",
    "comedyTechnique": "nom court",
    "techniqueExplanation": "2-3 phrases",
    "howToApply": "consigne + exemple"
  }
}`;

const TIP_REVIEW_STABLE = `Tu es le relecteur qualité des conseils IA de deviens-marrant.fr.
Ta mission : appliquer la charte de relecture s11 sur des conseils générés avant la charte.

${CHARTE_RECAP}

${TIP_VERDICTS}

ÉTALON DE FORME (niveau visé pour une réécriture) :
- Titre : percutant, 5-8 mots, donne envie.
- Contenu : UNE technique, 120-180 mots, tutoiement, zéro filler.
- Exemple : dialogue concret d'une situation quotidienne.
- Exercice : "DÉFI [NOM] : …", faisable aujourd'hui.

FORMAT DE RÉPONSE — JSON STRICT :
{
  "verdict": "GARDER" | "REECRIRE" | "RETIRER",
  "reason": "1-2 phrases. Si RETIRER, DOIT contenir une des raisons fermées : calembour phonétique / constat sans twist / blessant / doublon / mention IA.",
  "rewritten": {                       // OBLIGATOIRE si verdict = REECRIRE, ABSENT sinon
    "title": "titre réécrit",
    "content": "contenu réécrit (120-180 mots)",
    "example": "exemple avec dialogue",
    "exercise": "DÉFI [NOM] : …"
  }
}`;

const JOKE_REVIEW_CACHED_BLOCK = buildCachedSystemBlock(JOKE_REVIEW_STABLE);
const TIP_REVIEW_CACHED_BLOCK = buildCachedSystemBlock(TIP_REVIEW_STABLE);

// ─── Utilitaires de validation défensive ─────────────────────────

function normalizeVerdict(raw: unknown): CopyReviewVerdict | null {
  if (typeof raw !== "string") return null;
  const v = raw.trim().toUpperCase().replace(/[ÉÈÊË]/g, "E");
  if (v === "GARDER" || v === "KEEP") return "GARDER";
  if (v === "REECRIRE" || v === "REWRITE" || v === "RÉÉCRIRE") return "REECRIRE";
  if (v === "RETIRER" || v === "REMOVE" || v === "DELETE") return "RETIRER";
  return null;
}

function retirerJustified(reason: string): boolean {
  const r = (reason ?? "").toLowerCase();
  return ALLOWED_RETIRER_REASONS.some((allowed) => r.includes(allowed.toLowerCase()));
}

/**
 * Garde-fou fondateur : si un verdict RETIRER n'a PAS de raison dans la
 * liste fermée, on force GARDER. Idem si les données sont manifestement
 * incomplètes. La règle du doute prime : mieux garder que retirer.
 */
export function applyDoubtFallback<T extends { verdict: CopyReviewVerdict; reason: string }>(
  result: T,
): T {
  if (result.verdict === "RETIRER" && !retirerJustified(result.reason)) {
    return {
      ...result,
      verdict: "GARDER",
      reason: `[Garde-fou fondateur] Raison de RETIRER hors liste fermée ("${result.reason}") → GARDER par défaut.`,
    };
  }
  return result;
}

/**
 * Garde-fou vannes (lot Q2, barre Alexa) : plus jamais GARDER par doute.
 * RETIRER hors liste fermée → REECRIRE sans réécriture : l'original reste au
 * catalogue, marqué REECRIRE, donc hors vanne du jour.
 */
export function applyJokeDoubtFallback<T extends { verdict: CopyReviewVerdict; reason: string }>(
  result: T,
): T {
  if (result.verdict === "RETIRER" && !retirerJustified(result.reason)) {
    return {
      ...result,
      verdict: "REECRIRE",
      reason: `[Garde-fou fondateur] Raison de RETIRER hors liste fermée ("${result.reason}") → REECRIRE (hors vanne du jour).`,
    };
  }
  return result;
}

// ─── Appels LLM ──────────────────────────────────────────────────

export async function reviewJoke(input: JokeReviewInput): Promise<JokeReviewResult> {
  const response = await callWithRetry(
    {
      model: SONNET_MODEL,
      max_tokens: 900,
      system: [JOKE_REVIEW_CACHED_BLOCK],
      messages: [
        {
          role: "user",
          content: `Relis cette vanne (catégorie ${input.category}, type ${input.type}) :

Setup : ${input.content}
Chute : ${input.punchline}
${input.comedyTechnique ? `Décryptage actuel — technique : ${input.comedyTechnique}\nExplication : ${input.techniqueExplanation ?? "(vide)"}\nÀ toi de jouer : ${input.howToApply ?? "(vide)"}` : "Décryptage actuel : ABSENT"}

Applique la charte et la barre des étalons. GARDER seulement si la vanne est au niveau des étalons ; en cas de doute, REECRIRE. Ne modifie AUCUN chiffre présent dans l'original. Si tu réécris, produis aussi un décryptage complet.

Réponds UNIQUEMENT en JSON.`,
        },
      ],
    },
    2,
    { agent: "copy-review-agent", fn: "reviewJoke" },
  );

  const text = getResponseText(response);
  const parsed = extractJson<{
    verdict?: string;
    reason?: string;
    rewritten?: JokeReviewResult["rewritten"];
  }>(text);

  // Lot Q2 : verdict illisible = doute → REECRIRE sans réécriture (l'original
  // reste, hors vanne du jour). Plus jamais GARDER par défaut pour une vanne.
  const verdict = normalizeVerdict(parsed.verdict);
  const base: JokeReviewResult = {
    verdict: verdict ?? "REECRIRE",
    reason: (parsed.reason ?? "").trim() || "Verdict LLM manquant → REECRIRE par défaut (doute).",
  };

  if (base.verdict === "REECRIRE") {
    const rw = parsed.rewritten;
    if (
      !rw ||
      !rw.content?.trim() ||
      !rw.punchline?.trim() ||
      !rw.comedyTechnique?.trim() ||
      !rw.howToApply?.trim()
    ) {
      // Réécriture absente ou incomplète : on n'écrit rien, l'original reste
      // marqué REECRIRE (hors vanne du jour).
      return {
        verdict: "REECRIRE",
        reason: `${base.reason} [Garde-fou] Réécriture absente ou incomplète : original conservé, hors vanne du jour.`,
      };
    }
    base.rewritten = {
      content: rw.content.trim().slice(0, 500),
      punchline: rw.punchline.trim().slice(0, 200),
      comedyTechnique: rw.comedyTechnique.trim().slice(0, 200),
      techniqueExplanation: (rw.techniqueExplanation ?? "").trim().slice(0, 800),
      howToApply: rw.howToApply.trim().slice(0, 800),
    };
  }

  return applyJokeDoubtFallback(base);
}

export async function reviewTip(input: TipReviewInput): Promise<TipReviewResult> {
  const response = await callWithRetry(
    {
      model: SONNET_MODEL,
      max_tokens: 1100,
      system: [TIP_REVIEW_CACHED_BLOCK],
      messages: [
        {
          role: "user",
          content: `Relis ce conseil (catégorie ${input.category}, difficulté ${input.difficulty}) :

Titre : ${input.title}
Contenu : ${input.content}
Exemple : ${input.example}
Exercice : ${input.exercise}

Applique la charte s11. Rappel : en cas de doute, GARDER. Ne modifie AUCUN chiffre présent dans l'original. Si tu réécris, garde le format DÉFI [NOM] pour l'exercice.

Réponds UNIQUEMENT en JSON.`,
        },
      ],
    },
    2,
    { agent: "copy-review-agent", fn: "reviewTip" },
  );

  const text = getResponseText(response);
  const parsed = extractJson<{
    verdict?: string;
    reason?: string;
    rewritten?: TipReviewResult["rewritten"];
  }>(text);

  const verdict = normalizeVerdict(parsed.verdict);
  const base: TipReviewResult = {
    verdict: verdict ?? "GARDER",
    reason: (parsed.reason ?? "").trim() || "Verdict LLM manquant — GARDER par défaut.",
  };

  if (base.verdict === "REECRIRE") {
    const rw = parsed.rewritten;
    if (
      !rw ||
      !rw.title?.trim() ||
      !rw.content?.trim() ||
      !rw.example?.trim() ||
      !rw.exercise?.trim()
    ) {
      return {
        verdict: "GARDER",
        reason: `[Garde-fou] Réécriture incomplète renvoyée par le LLM — GARDER par défaut.`,
      };
    }
    base.rewritten = {
      title: rw.title.trim().slice(0, 200),
      content: rw.content.trim().slice(0, 2000),
      example: rw.example.trim().slice(0, 1000),
      exercise: rw.exercise.trim().slice(0, 1000),
    };
  }

  return applyDoubtFallback(base);
}
