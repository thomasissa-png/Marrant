import { callWithRetry, extractJson, getResponseText } from "../client";
import { PERSONAS, type PersonaKey } from "../personas";
import { TONALITY_BRIEF } from "./marketing-agent";

// ───────────────────────────────────────────────────────────────────
// Agent Stand-Up Director — Directeur Artistique de deviens-marrant.fr
//
// Rôle : gardien qualité de TOUS les contenus du site.
// Chaque vanne, conseil, sélection vidéo et article de blog
// DOIT passer par sa validation avant publication.
//
// Architecture de validation : 2 niveaux
// 1. GATES PROGRAMMATIQUES — checks binaires (PASS/FAIL), pas de LLM
//    → Exécutés AVANT la validation IA. 1 FAIL = rejet immédiat.
// 2. VALIDATION IA — le directeur évalue la qualité artistique
//    → Exécutée seulement si toutes les gates passent.
//
// Vision : faire de deviens-marrant.fr le site n°1 du stand-up
// français ET la plateforme de formation au stand-up n°1 en France.
// ───────────────────────────────────────────────────────────────────

// ─── GATES PROGRAMMATIQUES — Checks binaires non-négociables ─────

interface GateResult {
  gate: string;
  pass: boolean;
  reason: string;
}

/**
 * Gates pour les vannes — chaque gate est un check binaire.
 * 1 FAIL = rejet automatique, pas besoin de passer par le LLM.
 */
export function runJokeGates(joke: JokeToValidate): GateResult[] {
  const results: GateResult[] = [];
  const content = joke.content.trim();
  const punchline = joke.punchline.trim();
  const fullText = `${content} ${punchline}`.toLowerCase();

  // G-J1 — Punchline non vide
  results.push({
    gate: "G-J1 Punchline existe",
    pass: punchline.length >= 3,
    reason: punchline.length < 3 ? "Punchline vide ou trop courte" : "OK",
  });

  // G-J2 — Punchline plus courte que le setup
  const setupWords = content.split(/\s+/).length;
  const punchWords = punchline.split(/\s+/).length;
  results.push({
    gate: "G-J2 Punchline < Setup",
    pass: punchWords <= setupWords,
    reason: punchWords > setupWords
      ? `Punchline (${punchWords} mots) plus longue que setup (${setupWords} mots)`
      : "OK",
  });

  // G-J3 — Pas d'objets qui parlent
  const objetPattern = /(?:un |une |le |la |l')(?:stylo|crayon|fourchette|couteau|miroir|chaise|table|porte|mur|frigo|micro-ondes|télé)\s+(?:dit|demande|répond|murmure|crie|chuchote)/i;
  results.push({
    gate: "G-J3 Pas d'objets qui parlent",
    pass: !objetPattern.test(fullText),
    reason: objetPattern.test(fullText) ? "Objet inanimé qui parle détecté" : "OK",
  });

  // G-J4 — Pas de persona leak
  const personaPattern = /\b(yanis|sophie|marc)\b/i;
  results.push({
    gate: "G-J4 Pas de persona leak",
    pass: !personaPattern.test(fullText),
    reason: personaPattern.test(fullText) ? `Persona interne détecté` : "OK",
  });

  // G-J5 — Longueur totale < 60 mots
  const totalWords = fullText.split(/\s+/).length;
  results.push({
    gate: "G-J5 Longueur < 60 mots",
    pass: totalWords <= 60,
    reason: totalWords > 60 ? `${totalWords} mots (max 60)` : "OK",
  });

  // G-J6 — Punchline ≠ constat (heuristique)
  // Si la punchline commence par un pronom + verbe passé simple/imparfait
  // et ne contient aucun mot de twist (comme, genre, en fait, finalement, tellement, carrément)
  const twistMarkers = /comme|genre|en fait|finalement|tellement|carrément|sauf que|mais|du coup.*pas|jamais|toujours|même pas|déjà/i;
  const pureConstat = /^(il|elle|c'|ça|j'|je|ils|on)\s+(était|avait|a |est |étai)/i;
  const isConstat = pureConstat.test(punchline) && !twistMarkers.test(punchline);
  results.push({
    gate: "G-J6 Punchline ≠ constat",
    pass: !isConstat,
    reason: isConstat
      ? "La punchline ressemble à un constat/explication, pas à un twist comique"
      : "OK",
  });

  // G-J7 — Pas de format Carambar (Q&A basique sans twist)
  const carambarPattern = /^(pourquoi|comment|qu['']est[- ]ce que?|quel|quelle)\s/i;
  const isQA = carambarPattern.test(content) && !twistMarkers.test(punchline);
  results.push({
    gate: "G-J7 Pas de format Carambar",
    pass: !isQA,
    reason: isQA ? "Format Q&A basique sans twist (type Carambar)" : "OK",
  });

  return results;
}

/**
 * Gates pour les conseils.
 */
export function runTipGates(tip: TipToValidate): GateResult[] {
  const results: GateResult[] = [];
  const fullText = `${tip.title} ${tip.content} ${tip.example} ${tip.exercise}`.toLowerCase();

  // G-T1 — Pas de persona leak
  const personaPattern = /\b(yanis|sophie|marc)\b/i;
  results.push({
    gate: "G-T1 Pas de persona leak",
    pass: !personaPattern.test(fullText),
    reason: personaPattern.test(fullText) ? "Persona interne détecté" : "OK",
  });

  // G-T2 — Exercice au format DÉFI
  results.push({
    gate: "G-T2 Format DÉFI",
    pass: /défi/i.test(tip.exercise),
    reason: !/défi/i.test(tip.exercise) ? "L'exercice ne commence pas par DÉFI" : "OK",
  });

  // G-T3 — Contenu minimum 60 mots
  const contentWords = tip.content.split(/\s+/).length;
  results.push({
    gate: "G-T3 Contenu ≥ 60 mots",
    pass: contentWords >= 60,
    reason: contentWords < 60 ? `${contentWords} mots (min 60)` : "OK",
  });

  // G-T4 — Exemple contient du dialogue
  const hasDialogue = /[«»"""'']|— |:\s/.test(tip.example);
  results.push({
    gate: "G-T4 Exemple avec dialogue",
    pass: hasDialogue,
    reason: !hasDialogue ? "L'exemple ne contient pas de dialogue concret" : "OK",
  });

  return results;
}

/**
 * Gates pour les articles blog.
 */
export function runBlogGates(article: { title: string; excerpt: string; content: string; slug: string }): GateResult[] {
  const results: GateResult[] = [];
  const fullText = `${article.title} ${article.excerpt} ${article.content}`;
  const contentLower = fullText.toLowerCase();

  // G-B1 — Pas de persona leak
  const personaPattern = /\b(yanis|sophie|marc)\b/i;
  results.push({
    gate: "G-B1 Pas de persona leak",
    pass: !personaPattern.test(contentLower),
    reason: personaPattern.test(contentLower) ? "Persona interne détecté" : "OK",
  });

  // G-B2 — Titre < 60 chars
  results.push({
    gate: "G-B2 Titre < 60 chars",
    pass: article.title.length <= 60,
    reason: article.title.length > 60 ? `${article.title.length} chars (max 60)` : "OK",
  });

  // G-B3 — Excerpt < 155 chars
  results.push({
    gate: "G-B3 Excerpt < 155 chars",
    pass: article.excerpt.length <= 155,
    reason: article.excerpt.length > 155 ? `${article.excerpt.length} chars (max 155)` : "OK",
  });

  // G-B4 — Minimum 5 liens internes
  const internalLinks = (article.content.match(/\/(vannes|conseils|videos|parcours|blog\/[a-z])/g) || []).length;
  results.push({
    gate: "G-B4 Min 5 liens internes",
    pass: internalLinks >= 5,
    reason: internalLinks < 5 ? `${internalLinks} liens internes (min 5)` : "OK",
  });

  // G-B5 — Minimum 1000 mots
  const wordCount = article.content.split(/\s+/).length;
  results.push({
    gate: "G-B5 Min 1000 mots",
    pass: wordCount >= 1000,
    reason: wordCount < 1000 ? `${wordCount} mots (min 1000)` : "OK",
  });

  // G-B6 — FAQ presente
  const hasFaq = /faq|questions?\s+(fréquentes|courantes)|##.*\?/i.test(article.content);
  results.push({
    gate: "G-B6 FAQ présente",
    pass: hasFaq,
    reason: !hasFaq ? "Pas de section FAQ détectée" : "OK",
  });

  // G-B7 — Pas de refs legacy en excès (Jamel, Gad, Foresti, Kev Adams max 1)
  const legacyRefs = (contentLower.match(/jamel|gad elmaleh|foresti|kev adams/g) || []).length;
  results.push({
    gate: "G-B7 Refs legacy ≤ 1",
    pass: legacyRefs <= 1,
    reason: legacyRefs > 1 ? `${legacyRefs} refs legacy (max 1)` : "OK",
  });

  return results;
}

/**
 * Applique les gates programmatiques et rejette automatiquement si 1+ FAIL.
 * Retourne null si toutes les gates passent (→ continuer vers validation IA).
 * Retourne un ValidationResult REJECTED si 1+ gate échoue.
 */
function applyGates(gates: GateResult[], contentType: string): ValidationResult | null {
  const failed = gates.filter((g) => !g.pass);

  if (failed.length === 0) return null; // toutes les gates passent

  return {
    verdict: "REJECTED",
    score: 0,
    strengths: [],
    issues: failed.map((g) => `❌ ${g.gate} — ${g.reason}`),
    directorNote: `Rejet automatique par ${failed.length} gate(s) programmatique(s) [${contentType}]. Pas besoin de validation IA — les critères de base ne sont pas remplis.`,
  };
}

// ─── Types de validation ──────────────────────────────────────────

export type ContentType = "JOKE" | "TIP" | "VIDEO" | "BLOG" | "SITE_COPY";

// ─── Type pour l'audit du contenu statique du site ──────────────

export interface SiteCopyToAudit {
  pageName: string;
  section: string;
  currentText: string;
  context: string; // description du rôle de ce texte (hero, CTA, description, etc.)
}

export interface SiteCopyAuditResult {
  pageName: string;
  section: string;
  verdict: ValidationVerdict;
  score: number;
  currentText: string;
  suggestedText: string;
  issues: string[];
  directorNote: string;
}

export interface FullSiteAuditResult {
  date: string;
  overallScore: number;
  totalPages: number;
  totalSections: number;
  results: SiteCopyAuditResult[];
  priorityFixes: string[];
  directorSummary: string;
}

export type ValidationVerdict = "APPROVED" | "NEEDS_REVISION" | "REJECTED";

export interface ValidationResult {
  verdict: ValidationVerdict;
  score: number; // 1-10
  strengths: string[];
  issues: string[];
  revision?: string; // suggestion de réécriture si NEEDS_REVISION
  directorNote: string; // note du directeur artistique
}

export interface JokeToValidate {
  content: string;
  punchline: string;
  category: string;
  type: string;
  maturityLevel: number;
}

export interface TipToValidate {
  title: string;
  content: string;
  category: string;
  difficulty: string;
  example: string;
  exercise: string;
}

export interface VideoSelectionToValidate {
  videoId: string;
  videoTitle: string;
  channelName: string;
  category: string;
  technique: string;
  reason: string;
}

export interface BlogArticleToValidate {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  targetKeyword: string;
}

export interface EditorialVision {
  month: string;
  themeOfTheMonth: string;
  weeklyThemes: Array<{
    week: number;
    theme: string;
    focusPersona: PersonaKey;
    jokeDirection: string;
    tipDirection: string;
    videoDirection: string;
    blogDirection: string;
  }>;
  qualityPriorities: string[];
  standupReferences: string[];
  directorManifesto: string;
}

interface ContentBatchItem {
  type: ContentType;
  persona: PersonaKey;
  content: JokeToValidate | TipToValidate | VideoSelectionToValidate | BlogArticleToValidate;
}

export interface BatchReviewResult {
  date: string;
  overallScore: number;
  coherenceScore: number;
  diversityScore: number;
  items: Array<{
    type: ContentType;
    verdict: ValidationVerdict;
    score: number;
    note: string;
  }>;
  directorFeedback: string;
}

// ─── System Prompt — L'ADN du Directeur Artistique ───────────────

function buildDirectorIdentity(): string {
  return `Tu es le DIRECTEUR ARTISTIQUE de deviens-marrant.fr — la plateforme qui forme les gens à l'humour et au stand-up en France.

═══════════════════════════════════════
QUI TU ES
═══════════════════════════════════════

Tu es un directeur artistique de festival de stand-up de classe internationale. Tu as l'exigence d'un Jamel Debbouze qui programme le Jamel Comedy Club, l'œil d'un directeur du Montreux Comedy, et la modernité d'un découvreur de talents qui a repéré Fary, Paul Mirabel et Roman Frayssinet avant tout le monde.

Tu ne produis PAS le contenu. Tu le VALIDES. Tu es le dernier rempart entre le contenu et l'utilisateur. Si tu laisses passer un contenu médiocre, c'est la réputation du site qui en prend un coup.

═══════════════════════════════════════
TA MISSION — DOUBLE OBJECTIF
═══════════════════════════════════════

1. SITE N°1 DU STAND-UP FRANÇAIS
   deviens-marrant.fr doit devenir LA référence en ligne pour le stand-up francophone.
   Chaque contenu publié doit être au niveau d'un showcase professionnel.
   On ne publie pas du "correct" — on publie du "je dois envoyer ça à mon pote".

2. PLATEFORME DE FORMATION AU STAND-UP N°1 EN FRANCE
   Chaque conseil doit être aussi précis qu'un cours de master class.
   Chaque exercice doit produire un résultat mesurable.
   Chaque vidéo analysée doit enseigner une technique identifiable.
   On forme les gens POUR DE VRAI — pas du divertissement passif.

═══════════════════════════════════════
TES 3 PUBLICS — NON NÉGOCIABLE
═══════════════════════════════════════

Chaque contenu doit servir au moins UN de ces personas :

${Object.entries(PERSONAS).map(([key, p]) => `• ${p.name} (${p.age} ans) — ${p.description}
  Intérêts : ${p.interests.join(", ")}
  Ton : ${p.tone}`).join("\n\n")}

Si un contenu ne sert AUCUN de ces 3 personas, il n'a rien à faire sur le site.

═══════════════════════════════════════
VOIX DE MARQUE — "${TONALITY_BRIEF.voice}"
═══════════════════════════════════════
${TONALITY_BRIEF.principles.map(p => `- ${p}`).join("\n")}

INTERDIT :
${TONALITY_BRIEF.doNot.map(d => `- ${d}`).join("\n")}

═══════════════════════════════════════
TES RÉFÉRENCES — LE STANDARD DE QUALITÉ
═══════════════════════════════════════

HUMORISTES DE RÉFÉRENCE (la barre de qualité) :
- Paul Mirabel : escalade comique, naturel absolu, le mec que tu as l'impression de connaître
- Fary : surprise permanente, pivots, énergie, références pop culture
- Roman Frayssinet : observation chirurgicale, timing parfait, simplicité létale
- Blanche Gardin : autodérision puissante, silences qui tuent, courage du propos
- Waly Dia : efficacité maximum, zéro mot en trop, punchlines chirurgicales
- Panayotis Pascot : vulnérabilité comme force, storytelling émotionnel
- Pierre Croce : format court, réseaux sociaux, accessibilité, pédagogie naturelle
- Inès Reg : énergie brute, authenticité, pont entre stand-up et social media

NIVEAU D'EXIGENCE :
Imagine que chaque contenu sera présenté devant ces 8 humoristes.
Est-ce qu'ils diraient "ouais, pas mal" ou "c'est nul, recommence" ?
Tu ne laisses passer que les "ouais, pas mal" minimum.

═══════════════════════════════════════
CRITÈRES DE VALIDATION UNIVERSELS
═══════════════════════════════════════

Quel que soit le type de contenu, ces 5 critères s'appliquent TOUJOURS :

1. LE TEST DU POTE : "Est-ce que tu enverrais ça à ton meilleur pote ?"
   → Si non, le contenu n'est pas assez bon.

2. LE TEST DU CONCRET : "Après avoir lu/vu ça, je sais EXACTEMENT quoi faire."
   → Si c'est vague, flou ou théorique, c'est rejeté.

3. LE TEST DU DOUBLON : "Est-ce que ça existe déjà sur le site sous une autre forme ?"
   → Si oui, soit c'est un angle vraiment neuf, soit c'est du remplissage.

4. LE TEST DU PERSONA : "Quel persona est servi ? Comment ?"
   → Chaque contenu doit avoir un persona cible clair.

5. LE TEST DE LA BARRE : "Est-ce que c'est au niveau site n°1 du stand-up français ?"
   → Pas au niveau d'un blog perso. Au niveau du LEADER DU MARCHÉ.`;
}

// ─── Validation d'une vanne ──────────────────────────────────────

export async function validateJoke(
  joke: JokeToValidate,
  persona: PersonaKey,
): Promise<ValidationResult> {
  // ── Gates programmatiques (binaires, pas de LLM) ──
  const gates = runJokeGates(joke);
  const gateReject = applyGates(gates, "JOKE");
  if (gateReject) {
    console.log(`[Director] Vanne rejetée par gates: ${gates.filter(g => !g.pass).map(g => g.gate).join(", ")}`);
    return gateReject;
  }

  const p = PERSONAS[persona];

  const response = await callWithRetry({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1000,
    system: buildDirectorIdentity(),
    messages: [
      {
        role: "user",
        content: `VALIDATION VANNE — pour ${p.name} (${p.age} ans)

Setup : "${joke.content}"
Punchline : "${joke.punchline}"
Catégorie : ${joke.category} | Type : ${joke.type} | Maturité : ${joke.maturityLevel}

Évalue cette vanne avec ton exigence de directeur artistique.

CRITÈRES SPÉCIFIQUES VANNES :
- La punchline est-elle plus COURTE que le setup ? (obligatoire)
- ${p.name} peut-il/elle la sortir CE SOIR en soirée et faire RIRE ? (pas sourire — RIRE)
- Y a-t-il un vrai twist ou c'est prévisible ?
- Est-ce relatable pour ${p.name} (${p.interests.slice(0, 4).join(", ")}) ?
- Est-ce que ça respecte le ton de la marque (jamais vulgaire, jamais forcé) ?
- Pas d'objets qui parlent, pas de format Carambar, pas d'autodérision triste sans punch

TEST CRITIQUE — PUNCHLINE OU CONSTAT ?
La punchline doit contenir un RETOURNEMENT COMIQUE (twist, exagération, absurde, double sens, comparaison inattendue).
Si la punchline est juste une EXPLICATION de la situation, un CONSTAT logique, ou la SUITE de l'histoire → c'est PAS une vanne, c'est une anecdote. Score max 5.
Exemples :
- ❌ "J'ai attendu le bus 20 min sous la pluie. Il était à l'arrêt d'en face." → CONSTAT (c'est juste ce qui s'est passé, pas de twist)
- ✅ "J'ai attendu le bus 20 min sous la pluie. Le bus m'a vu et il a accéléré." → TWIST (le bus est personnifié, comportement inattendu)
- ❌ "J'ai oublié mon parapluie. Il pleuvait." → CONSTAT
- ✅ "J'ai oublié mon parapluie. Mon karma non." → TWIST (personnification abstraite)

VERDICT :
- APPROVED (score ≥ 9) : excellence — publiable en l'état, au niveau du site n°1, fait RIRE à voix haute
- NEEDS_REVISION (score 7-8) : l'idée est bonne mais l'exécution peut être meilleure — propose une réécriture
- REJECTED (score ≤ 6) : ne passe pas le test stand-up, recommencer de zéro

Réponds en JSON :
{
  "verdict": "APPROVED|NEEDS_REVISION|REJECTED",
  "score": 1-10,
  "strengths": ["Ce qui marche"],
  "issues": ["Ce qui ne va pas"],
  "revision": "Si NEEDS_REVISION : ta version améliorée du setup + punchline",
  "directorNote": "Ton avis de directeur artistique en 1-2 phrases"
}`,
      },
    ],
  });

  const text = getResponseText(response);
  const result = parseValidationResult(text);

  // Guard programmatique : rejet auto si persona interne dans le contenu
  const jokeText = `${joke.content} ${joke.punchline}`;
  return guardAgainstPersonaLeak(jokeText, result);
}

// ─── Validation d'un conseil ─────────────────────────────────────

export async function validateTip(
  tip: TipToValidate,
  persona: PersonaKey,
): Promise<ValidationResult> {
  // ── Gates programmatiques (binaires, pas de LLM) ──
  const gates = runTipGates(tip);
  const gateReject = applyGates(gates, "TIP");
  if (gateReject) {
    console.log(`[Director] Conseil rejeté par gates: ${gates.filter(g => !g.pass).map(g => g.gate).join(", ")}`);
    return gateReject;
  }

  const p = PERSONAS[persona];

  const response = await callWithRetry({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1000,
    system: buildDirectorIdentity(),
    messages: [
      {
        role: "user",
        content: `VALIDATION CONSEIL — pour ${p.name} (${p.age} ans)

Titre : "${tip.title}"
Contenu : "${tip.content}"
Catégorie : ${tip.category} | Difficulté : ${tip.difficulty}
Exemple : "${tip.example}"
Exercice : "${tip.exercise}"

Évalue ce conseil avec ton exigence de directeur de formation.

CRITÈRES SPÉCIFIQUES CONSEILS :
- ${p.name} peut-il/elle l'appliquer AUJOURD'HUI et constater un résultat ? (pas "cette semaine")
- Le conseil enseigne-t-il UNE technique claire et identifiable ?
- L'exemple montre-t-il la technique EN ACTION avec un dialogue concret ?
- L'exercice est-il formulé comme un DÉFI motivant (format "DÉFI [NOM] : ...") ?
- Le contenu fait-il au moins 60 mots sans filler ?
- Est-ce au niveau d'un VRAI cours de stand-up / impro professionnel ?
- Le conseil sert-il la mission "plateforme de formation n°1" ?

VERDICT :
- APPROVED (score ≥ 9) : excellence — publiable, enseigne vraiment quelque chose, niveau coach pro
- NEEDS_REVISION (score 7-8) : la technique est bonne mais l'exécution manque de punch — propose des corrections
- REJECTED (score ≤ 6) : trop générique, pas actionnable, ou doublon

Réponds en JSON :
{
  "verdict": "APPROVED|NEEDS_REVISION|REJECTED",
  "score": 1-10,
  "strengths": ["Ce qui marche"],
  "issues": ["Ce qui ne va pas"],
  "revision": "Si NEEDS_REVISION : corrections précises à apporter",
  "directorNote": "Ton avis en 1-2 phrases"
}`,
      },
    ],
  });

  const text = getResponseText(response);
  const result = parseValidationResult(text);

  // Guard programmatique : rejet auto si persona interne dans le contenu
  const tipText = `${tip.title} ${tip.content} ${tip.example || ""} ${tip.exercise || ""}`;
  return guardAgainstPersonaLeak(tipText, result);
}

// ─── Validation d'une sélection vidéo ────────────────────────────

export async function validateVideoSelection(
  video: VideoSelectionToValidate,
  persona: PersonaKey,
): Promise<ValidationResult> {
  const p = PERSONAS[persona];

  const response = await callWithRetry({
    model: "claude-sonnet-4-20250514",
    max_tokens: 800,
    system: buildDirectorIdentity(),
    messages: [
      {
        role: "user",
        content: `VALIDATION SÉLECTION VIDÉO — pour ${p.name} (${p.age} ans)

Vidéo : "${video.videoTitle}" par ${video.channelName}
Catégorie : ${video.category} | Technique : ${video.technique}
Raison de sélection : "${video.reason}"

CRITÈRES SPÉCIFIQUES VIDÉOS :
- La vidéo enseigne-t-elle une technique IDENTIFIABLE que ${p.name} peut reproduire ?
- Le niveau est-il adapté à ${p.name} (${p.tipDifficulty ?? "intermédiaire"}) ?
- La chaîne contribue-t-elle à la diversité du catalogue ? (objectif : aucune chaîne > 25%)
- La raison de sélection est-elle pertinente par rapport au persona ?
- Cette vidéo fait-elle progresser ${p.name} ou c'est juste du divertissement ?

VERDICT :
- APPROVED (score ≥ 9) : excellence — sélection pédagogique parfaite, la vidéo fait progresser le persona
- NEEDS_REVISION (score 7-8) : vidéo acceptable mais la raison ou la catégorie pourrait être mieux justifiée
- REJECTED (score ≤ 6) : mauvais match persona/technique ou chaîne surreprésentée

Réponds en JSON :
{
  "verdict": "APPROVED|NEEDS_REVISION|REJECTED",
  "score": 1-10,
  "strengths": ["Ce qui marche"],
  "issues": ["Ce qui ne va pas"],
  "revision": "Si NEEDS_REVISION : suggestion alternative",
  "directorNote": "Ton avis en 1-2 phrases"
}`,
      },
    ],
  });

  const text = getResponseText(response);
  return parseValidationResult(text);
}

// ─── Validation d'un article de blog ─────────────────────────────

export async function validateBlogArticle(
  article: BlogArticleToValidate,
): Promise<ValidationResult> {
  // ── Gates programmatiques (binaires, pas de LLM) ──
  const gates = runBlogGates(article);
  const gateReject = applyGates(gates, "BLOG");
  if (gateReject) {
    console.log(`[Director] Article rejeté par gates: ${gates.filter(g => !g.pass).map(g => g.gate).join(", ")}`);
    return gateReject;
  }

  // Tronquer le contenu pour rester dans les limites du prompt
  // 12000 chars couvre ~85% d'un article de 2000 mots (FAQ, CTA, liens internes inclus)
  const truncatedContent = article.content.slice(0, 12000);

  const response = await callWithRetry({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1200,
    system: buildDirectorIdentity(),
    messages: [
      {
        role: "user",
        content: `VALIDATION ARTICLE BLOG — SEO + Qualité

Titre : "${article.title}"
Slug : ${article.slug}
Mot-clé cible : "${article.targetKeyword}"
Catégorie : ${article.category}
Extrait : "${article.excerpt}"

Début du contenu (à évaluer) :
"""
${truncatedContent}
"""

CRITÈRES QUALITÉ CONTENU :
- L'article contient-il au minimum 3 traits d'humour / vannes ORIGINALES ?
- Le lecteur SOURIT-il au moins 3 fois ? (le blog est la DÉMO du produit)
- Les références sont-elles modernes ? (Paul Mirabel, Fary, Roman Frayssinet > Jamel, Gad, Foresti)
- Au moins 2 personas sont-ils touchés avec des exemples concrets de LEUR vie ?
- Le format est-il varié (pas un énième listicle) ?
- L'article enseigne-t-il quelque chose de CONCRET et ACTIONNABLE ?
- Est-ce au niveau d'un article de LEADER DU MARCHÉ ?

CRITÈRES SEO — NON NÉGOCIABLES POUR LE N°1 :
- Le mot-clé "${article.targetKeyword}" est-il présent dans : l'intro (1er paragraphe), au moins 2-3 sous-titres H2/H3, et la conclusion ?
- Le titre fait-il moins de 60 caractères et contient-il le mot-clé naturellement ?
- L'extrait/meta description fait-il 150-155 caractères et incite-t-il au clic ?
- Y a-t-il au moins 5 liens internes vers /vannes, /parcours, /conseils, /videos, ou d'autres articles ?
- La structure utilise-t-elle des H2 et H3 clairs (pas de mur de texte) ?
- Y a-t-il des listes à puces, du gras sur les termes clés, et des FAQ en fin d'article (schema FAQ) ?
- Le contenu fait-il entre 1500 et 2500 mots ? (ni trop court pour le SEO, ni trop long pour le lecteur)
- Le mot-clé n'est-il PAS sur-optimisé ? (pas de keyword stuffing — intégration naturelle)

CRITÈRES CONVERSION — LE BLOG DOIT VENDRE :
- L'article a-t-il un CTA clair vers /parcours, /vannes ou /conseils ?
- Si c'est un article "douleur" (timidité, moqueries, muet, rupture) : valide-t-il l'émotion AVANT de proposer des solutions ?
- Si c'est un article "apprendre des pros" : chaque technique est-elle ACTIONNABLE aujourd'hui (pas juste de l'analyse passive) ?
- L'article ne contient-il PAS de liens sortants vers YouTube ou des concurrents ?

ANTI-CANNIBALISATION :
- Le slug/titre ne cannibalise-t-il pas un article existant du site ?
- Le mot-clé principal est-il distinct des articles déjà publiés ?

INTERDICTION ABSOLUE — PERSONAS INTERNES :
- L'article NE DOIT JAMAIS mentionner les noms de personas internes : "Yanis", "Sophie", "Marc".
- Ces personas sont des outils de conception INTERNES, pas du contenu visible.
- Un visiteur qui lit "Sophie au bureau" ou "Yanis en soirée" ne comprend rien — c'est comme montrer les coulisses au public.
- À la place, utiliser le "tu" direct ou des descriptions génériques ("au bureau", "en soirée", "quand tu reprends confiance").
- Si le contenu mentionne un de ces prénoms dans un contexte persona → REJECTED automatiquement.

VERDICT :
- APPROVED (score ≥ 9) : excellence — publiable, drôle ET instructif, au niveau n°1, le lecteur sourit 3+ fois
- NEEDS_REVISION (score 7-8) : le fond est bon mais il manque de l'humour, des exemples concrets, ou des liens internes
- REJECTED (score ≤ 6) : pas drôle, trop générique, ou cannibalise un article existant

Réponds en JSON :
{
  "verdict": "APPROVED|NEEDS_REVISION|REJECTED",
  "score": 1-10,
  "strengths": ["Ce qui marche"],
  "issues": ["Ce qui ne va pas"],
  "revision": "Si NEEDS_REVISION : corrections précises à apporter",
  "directorNote": "Ton avis de directeur artistique en 1-2 phrases"
}`,
      },
    ],
  });

  const text = getResponseText(response);
  const result = parseValidationResult(text);

  // Guard programmatique : rejet auto si persona interne dans le contenu
  return guardAgainstPersonaLeak(article.content, result);
}

// ─── Vision éditoriale mensuelle ─────────────────────────────────

export async function generateEditorialVision(
  month: number,
  year: number,
): Promise<EditorialVision> {
  const monthNames = [
    "janvier", "février", "mars", "avril", "mai", "juin",
    "juillet", "août", "septembre", "octobre", "novembre", "décembre",
  ];

  const response = await callWithRetry({
    model: "claude-sonnet-4-20250514",
    max_tokens: 3000,
    system: buildDirectorIdentity(),
    messages: [
      {
        role: "user",
        content: `VISION ÉDITORIALE — ${monthNames[month - 1]} ${year}

En tant que Directeur Artistique, définis la vision éditoriale du mois pour TOUS les agents (Vannes, Conseils, Vidéos, Blog SEO).

Cette vision doit :
1. Définir UN thème fédérateur du mois (lié à la saison/actualité)
2. Décliner ce thème en 4 sous-thèmes hebdomadaires
3. Pour chaque semaine, donner une direction créative à chaque agent
4. Définir les priorités qualité du mois
5. Lister les humoristes de référence à citer ce mois-ci
6. Écrire ton MANIFESTE du mois : 3-5 phrases qui rappellent l'ambition du site

RAPPEL : L'objectif est double — site n°1 du stand-up français ET plateforme de formation n°1.
Les 3 personas (Yanis 20 ans, Sophie 26 ans, Marc 34 ans) doivent TOUS être servis chaque semaine.

Réponds en JSON :
{
  "month": "${monthNames[month - 1]} ${year}",
  "themeOfTheMonth": "Le thème fédérateur",
  "weeklyThemes": [
    {
      "week": 1,
      "theme": "Sous-thème de la semaine",
      "focusPersona": "YANIS|SOPHIE|MARC",
      "jokeDirection": "Direction créative pour l'Agent Vannes",
      "tipDirection": "Direction créative pour l'Agent Conseils",
      "videoDirection": "Direction de curation pour l'Agent Vidéos",
      "blogDirection": "Direction éditoriale pour l'Agent Blog SEO"
    }
  ],
  "qualityPriorities": ["3-5 priorités qualité pour le mois"],
  "standupReferences": ["Humoristes à citer/étudier ce mois-ci"],
  "directorManifesto": "Ton manifeste du mois — rappel de l'ambition"
}`,
      },
    ],
  });

  const text = getResponseText(response);
  const parsed = extractJson<EditorialVision>(text);

  // Validation
  if (!parsed.themeOfTheMonth?.trim()) {
    throw new Error("Stand-Up Director : thème du mois manquant");
  }
  if (!Array.isArray(parsed.weeklyThemes) || parsed.weeklyThemes.length === 0) {
    throw new Error("Stand-Up Director : thèmes hebdomadaires manquants");
  }
  if (!parsed.directorManifesto?.trim()) {
    throw new Error("Stand-Up Director : manifeste du directeur manquant");
  }

  return parsed;
}

// ─── Revue de batch quotidien ────────────────────────────────────

export async function reviewContentBatch(
  items: ContentBatchItem[],
  date: string,
): Promise<BatchReviewResult> {
  const itemDescriptions = items.map((item, i) => {
    const p = PERSONAS[item.persona];
    let desc = `${i + 1}. [${item.type}] Pour ${p.name} (${p.age} ans)\n`;

    switch (item.type) {
      case "JOKE": {
        const j = item.content as JokeToValidate;
        desc += `   Setup: "${j.content}"\n   Punchline: "${j.punchline}"\n   Cat: ${j.category}`;
        break;
      }
      case "TIP": {
        const t = item.content as TipToValidate;
        desc += `   Titre: "${t.title}"\n   Cat: ${t.category} | Diff: ${t.difficulty}`;
        break;
      }
      case "VIDEO": {
        const v = item.content as VideoSelectionToValidate;
        desc += `   Vidéo: "${v.videoTitle}" par ${v.channelName}\n   Technique: ${v.technique}`;
        break;
      }
      case "BLOG": {
        const b = item.content as BlogArticleToValidate;
        desc += `   Article: "${b.title}"\n   Mot-clé: ${b.targetKeyword}`;
        break;
      }
    }
    return desc;
  }).join("\n\n");

  const response = await callWithRetry({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1500,
    system: buildDirectorIdentity(),
    messages: [
      {
        role: "user",
        content: `REVUE QUOTIDIENNE — ${date}

Voici les contenus prévus pour publication aujourd'hui :

${itemDescriptions}

En tant que Directeur Artistique, évalue :
1. Chaque contenu individuellement (verdict + score + note)
2. La COHÉRENCE de l'ensemble (les 3 contenus du jour forment-ils un tout intéressant ?)
3. La DIVERSITÉ (les sujets sont-ils suffisamment variés ?)
4. Le NIVEAU GLOBAL (est-ce digne du site n°1 du stand-up français ?)

Réponds en JSON :
{
  "date": "${date}",
  "overallScore": 1-10,
  "coherenceScore": 1-10,
  "diversityScore": 1-10,
  "items": [
    {
      "type": "JOKE|TIP|VIDEO|BLOG",
      "verdict": "APPROVED|NEEDS_REVISION|REJECTED",
      "score": 1-10,
      "note": "Avis en 1 phrase"
    }
  ],
  "directorFeedback": "Ton feedback global sur la journée de contenu"
}`,
      },
    ],
  });

  const text = getResponseText(response);
  const parsed = extractJson<BatchReviewResult>(text);

  // Validation
  if (!Array.isArray(parsed.items) || parsed.items.length === 0) {
    throw new Error("Stand-Up Director : revue de batch vide");
  }
  if (typeof parsed.overallScore !== "number" || parsed.overallScore < 1 || parsed.overallScore > 10) {
    parsed.overallScore = 5;
  }
  if (typeof parsed.coherenceScore !== "number" || parsed.coherenceScore < 1 || parsed.coherenceScore > 10) {
    parsed.coherenceScore = 5;
  }
  if (typeof parsed.diversityScore !== "number" || parsed.diversityScore < 1 || parsed.diversityScore > 10) {
    parsed.diversityScore = 5;
  }

  // Valider les verdicts individuels
  const validVerdicts: ValidationVerdict[] = ["APPROVED", "NEEDS_REVISION", "REJECTED"];
  for (const item of parsed.items) {
    if (!validVerdicts.includes(item.verdict)) {
      item.verdict = "NEEDS_REVISION";
    }
    if (typeof item.score !== "number" || item.score < 1 || item.score > 10) {
      item.score = 5;
    }
  }

  return parsed;
}

// ─── Helper : parser et valider le résultat de validation ────────

function parseValidationResult(text: string): ValidationResult {
  const parsed = extractJson<ValidationResult>(text);

  // Valider le verdict
  const validVerdicts: ValidationVerdict[] = ["APPROVED", "NEEDS_REVISION", "REJECTED"];
  if (!validVerdicts.includes(parsed.verdict)) {
    parsed.verdict = "NEEDS_REVISION";
  }

  // Valider le score
  if (typeof parsed.score !== "number" || parsed.score < 1 || parsed.score > 10) {
    parsed.score = 5;
  }

  // Garantir les tableaux
  if (!Array.isArray(parsed.strengths)) parsed.strengths = [];
  if (!Array.isArray(parsed.issues)) parsed.issues = [];

  // Garantir la note du directeur
  if (!parsed.directorNote?.trim()) {
    parsed.directorNote = "Évaluation complétée.";
  }

  // Cohérence verdict/score — seuil universel 9/10
  if (parsed.score >= 9) {
    parsed.verdict = "APPROVED";
  } else if (parsed.score >= 7) {
    parsed.verdict = "NEEDS_REVISION";
  } else {
    parsed.verdict = "REJECTED";
  }

  return parsed;
}

// ─── Validation d'une nouvelle vidéo découverte ─────────────────

export interface NewVideoToValidate {
  youtubeId: string;
  title: string;
  channelName: string;
  duration: string;
  category: string;
  difficulty: string;
  description: string;
  technique: string;
  learnings: string[];
  exercise: string;
}

/**
 * Valide une nouvelle vidéo découverte automatiquement avant ajout au catalogue.
 * Critères plus stricts que validateVideoSelection : on valide le contenu enrichi
 * (description, learnings, exercice) en plus de la pertinence pédagogique.
 */
export async function validateNewVideo(
  video: NewVideoToValidate,
  channelDistribution: Record<string, number>,
  totalCatalogSize: number,
): Promise<ValidationResult> {
  const channelPct = channelDistribution[video.channelName]
    ? Math.round((channelDistribution[video.channelName] / totalCatalogSize) * 100)
    : 0;

  const response = await callWithRetry({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1000,
    system: buildDirectorIdentity(),
    messages: [
      {
        role: "user",
        content: `VALIDATION NOUVELLE VIDÉO — Ajout au catalogue permanent

Vidéo : "${video.title}" par ${video.channelName}
YouTube ID : ${video.youtubeId} | Durée : ${video.duration}
Catégorie : ${video.category} | Difficulté : ${video.difficulty}
Technique : ${video.technique}

Description enrichie :
"${video.description}"

Learnings (${video.learnings.length}) :
${video.learnings.map((l, i) => `${i + 1}. ${l}`).join("\n")}

Exercice :
"${video.exercise}"

DIVERSITÉ DE CHAÎNE :
${video.channelName} représente actuellement ${channelPct}% du catalogue (${channelDistribution[video.channelName] ?? 0}/${totalCatalogSize} vidéos).
Règle : aucune chaîne au-dessus de 25%.

CRITÈRES SPÉCIFIQUES — AJOUT CATALOGUE :
1. La vidéo est-elle du VRAI stand-up ou humour pédagogique ? (pas un vlog, podcast, compilation)
2. La description commence-t-elle par "Regarde pour apprendre..." et nomme-t-elle une TECHNIQUE précise ?
3. Les learnings nomment-ils des TECHNIQUES en MAJUSCULES reproductibles ?
4. L'exercice suit-il le format "DÉFI [NOM] : ..." et est-il faisable AUJOURD'HUI ?
5. La catégorie et difficulté sont-elles correctes ?
6. La chaîne contribue-t-elle à la DIVERSITÉ du catalogue ? (${channelPct}% actuellement)
7. Cette vidéo apporte-t-elle quelque chose de NOUVEAU au catalogue ? (pas de doublon de technique)

VERDICT :
- APPROVED (score ≥ 7) : vidéo enrichie de qualité, prête pour le catalogue
- NEEDS_REVISION (score 4-6) : l'enrichissement peut être amélioré — propose des corrections
- REJECTED (score ≤ 3) : vidéo non pertinente ou chaîne surreprésentée

Réponds en JSON :
{
  "verdict": "APPROVED|NEEDS_REVISION|REJECTED",
  "score": 1-10,
  "strengths": ["Ce qui marche"],
  "issues": ["Ce qui ne va pas"],
  "revision": "Si NEEDS_REVISION : corrections de la description/learnings/exercice",
  "directorNote": "Ton avis en 1-2 phrases"
}`,
      },
    ],
  });

  const text = getResponseText(response);
  const result = parseValidationResult(text);

  // Guard : rejet si persona leak dans le contenu enrichi
  const fullText = `${video.description} ${video.learnings.join(" ")} ${video.exercise}`;
  return guardAgainstPersonaLeak(fullText, result);
}

// ─── Guard : personas internes ne doivent JAMAIS apparaître dans le contenu public ─

const INTERNAL_PERSONA_NAMES = /\b(Yanis|Sophie|Marc)\b/;

/**
 * Vérifie qu'un contenu public ne mentionne pas les personas internes.
 * Retourne le résultat modifié avec REJECTED si détecté.
 */
export function guardAgainstPersonaLeak(
  content: string,
  result: ValidationResult,
): ValidationResult {
  const match = content.match(INTERNAL_PERSONA_NAMES);
  if (match) {
    return {
      ...result,
      verdict: "REJECTED",
      score: Math.min(result.score, 2),
      issues: [
        ...result.issues,
        `PERSONA LEAK : le prénom interne "${match[0]}" apparaît dans le contenu public. Les personas (Yanis/Sophie/Marc) sont des outils internes invisibles pour les visiteurs. Utiliser "tu" ou une description de situation à la place.`,
      ],
      directorNote: `Rejet automatique : persona interne "${match[0]}" détecté dans le contenu. Réécrire sans mention de prénoms internes.`,
    };
  }
  return result;
}

// ─── Réécriture par le Directeur — dernier recours après 3 échecs ─

/**
 * Le Directeur réécrit lui-même une vanne qui a échoué 3 fois la validation.
 * Il reçoit la dernière version + tous les retours de validation pour produire
 * une version publiable.
 */
export async function directorRewriteJoke(
  failedJoke: JokeToValidate,
  lastValidation: ValidationResult,
  persona: PersonaKey,
): Promise<JokeToValidate> {
  const p = PERSONAS[persona];

  const response = await callWithRetry({
    model: "claude-sonnet-4-20250514",
    max_tokens: 600,
    system: buildDirectorIdentity(),
    messages: [
      {
        role: "user",
        content: `RÉÉCRITURE DIRECTEUR — La vanne a échoué 3 validations.
C'est à TOI de la réécrire pour qu'elle soit publiable.

DERNIÈRE VERSION (rejetée) :
Setup : "${failedJoke.content}"
Punchline : "${failedJoke.punchline}"
Catégorie : ${failedJoke.category} | Type : ${failedJoke.type}

PROBLÈMES IDENTIFIÉS :
${lastValidation.issues.map(i => `- ${i}`).join("\n")}
${lastValidation.revision ? `\nSUGGESTION PRÉCÉDENTE : ${lastValidation.revision}` : ""}

PERSONA CIBLE : ${p.name} (${p.age} ans) — ${p.description}
Intérêts : ${p.interests.join(", ")}

MISSION : Réécris cette vanne en corrigeant TOUS les problèmes.
Tu es le directeur artistique — montre l'exemple. Produis une vanne que ${p.name} peut sortir ce soir.

Réponds en JSON :
{
  "content": "Setup réécrit",
  "punchline": "Punchline réécrite",
  "category": "${failedJoke.category}",
  "type": "${failedJoke.type}",
  "maturityLevel": ${failedJoke.maturityLevel}
}`,
      },
    ],
  });

  const text = getResponseText(response);
  const parsed = extractJson<JokeToValidate>(text);

  if (!parsed.content?.trim() || !parsed.punchline?.trim()) {
    throw new Error("Stand-Up Director : réécriture vanne — contenu vide");
  }

  parsed.content = parsed.content.trim().slice(0, 1000);
  parsed.punchline = parsed.punchline.trim().slice(0, 500);

  return parsed;
}

/**
 * Le Directeur réécrit lui-même un conseil qui a échoué 3 fois la validation.
 */
export async function directorRewriteTip(
  failedTip: TipToValidate,
  lastValidation: ValidationResult,
  persona: PersonaKey,
): Promise<TipToValidate> {
  const p = PERSONAS[persona];

  const response = await callWithRetry({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1500,
    system: buildDirectorIdentity(),
    messages: [
      {
        role: "user",
        content: `RÉÉCRITURE DIRECTEUR — Le conseil a échoué 3 validations.
C'est à TOI de le réécrire pour qu'il soit publiable.

DERNIÈRE VERSION (rejetée) :
Titre : "${failedTip.title}"
Contenu : "${failedTip.content}"
Exemple : "${failedTip.example}"
Exercice : "${failedTip.exercise}"
Catégorie : ${failedTip.category} | Difficulté : ${failedTip.difficulty}

PROBLÈMES IDENTIFIÉS :
${lastValidation.issues.map(i => `- ${i}`).join("\n")}
${lastValidation.revision ? `\nSUGGESTION PRÉCÉDENTE : ${lastValidation.revision}` : ""}

PERSONA CIBLE : ${p.name} (${p.age} ans) — ${p.description}
Intérêts : ${p.interests.join(", ")}

MISSION : Réécris ce conseil en corrigeant TOUS les problèmes.
Le conseil doit enseigner UNE technique claire, avec un exemple concret et un DÉFI faisable aujourd'hui.

Réponds en JSON :
{
  "title": "Titre réécrit (5-8 mots)",
  "content": "Contenu réécrit (120-180 mots, zéro filler)",
  "category": "${failedTip.category}",
  "difficulty": "${failedTip.difficulty}",
  "example": "Exemple réécrit avec dialogue concret",
  "exercise": "DÉFI [NOM] : exercice réécrit, faisable aujourd'hui"
}`,
      },
    ],
  });

  const text = getResponseText(response);
  const parsed = extractJson<TipToValidate>(text);

  if (!parsed.title?.trim() || !parsed.content?.trim() || !parsed.example?.trim() || !parsed.exercise?.trim()) {
    throw new Error("Stand-Up Director : réécriture conseil — champs vides");
  }

  parsed.title = parsed.title.trim().slice(0, 200);
  parsed.content = parsed.content.trim().slice(0, 2000);
  parsed.example = parsed.example.trim().slice(0, 1000);
  parsed.exercise = parsed.exercise.trim().slice(0, 1000);

  return parsed;
}

/**
 * Le Directeur réécrit lui-même un article de blog qui a échoué 3 fois la validation.
 * Retourne uniquement les champs modifiables (pas le slug/keyword).
 */
export async function directorRewriteBlogArticle(
  failedArticle: BlogArticleToValidate,
  lastValidation: ValidationResult,
): Promise<{ title: string; excerpt: string; content: string; category: string }> {
  const truncatedContent = failedArticle.content.slice(0, 4000);

  const response = await callWithRetry({
    model: "claude-sonnet-4-20250514",
    max_tokens: 8000,
    system: buildDirectorIdentity(),
    messages: [
      {
        role: "user",
        content: `RÉÉCRITURE DIRECTEUR — L'article a échoué 3 validations.
C'est à TOI de le réécrire pour qu'il soit publiable.

ARTICLE REJETÉ :
Titre : "${failedArticle.title}"
Mot-clé cible : "${failedArticle.targetKeyword}"
Catégorie : ${failedArticle.category}
Extrait : "${failedArticle.excerpt}"

Début du contenu rejeté :
"""
${truncatedContent}
"""

PROBLÈMES IDENTIFIÉS :
${lastValidation.issues.map(i => `- ${i}`).join("\n")}
${lastValidation.revision ? `\nCORRECTIONS DEMANDÉES : ${lastValidation.revision}` : ""}

MISSION : Réécris cet article en corrigeant TOUS les problèmes.
Rappels :
- Minimum 3 traits d'humour / vannes originales
- Refs modernes (Paul Mirabel, Fary, Roman Frayssinet, Blanche Gardin)
- Au moins 2 personas touchés
- Mot-clé "${failedArticle.targetKeyword}" intégré naturellement (intro, 2-3 H2, conclusion)
- Au moins 5 liens internes (/vannes, /parcours, /conseils, /videos)
- 1500-2500 mots
- Structure claire H2/H3, listes, gras, FAQ en fin

Réponds en JSON :
{
  "title": "Titre réécrit (< 60 chars, contient le mot-clé)",
  "excerpt": "Extrait réécrit (150 chars max)",
  "content": "Article complet réécrit (1500-2500 mots)",
  "category": "${failedArticle.category}"
}`,
      },
    ],
  });

  const text = getResponseText(response);
  const parsed = extractJson<{ title: string; excerpt: string; content: string; category: string }>(text);

  if (!parsed.title?.trim() || !parsed.content?.trim()) {
    throw new Error("Stand-Up Director : réécriture article — contenu vide");
  }

  parsed.title = parsed.title.trim().slice(0, 200);
  parsed.excerpt = (parsed.excerpt ?? "").trim().slice(0, 200);
  parsed.content = parsed.content.trim();

  return parsed;
}

// ─── Audit du contenu statique du site ──────────────────────────
//
// Audite les textes visibles par les visiteurs : headings, descriptions,
// CTAs, marketing copy, FAQ, glossaire, etc. Applique les 5 tests
// universels + les standards de la marque.
// ─────────────────────────────────────────────────────────────────

/**
 * Audite une liste de textes statiques du site (headings, descriptions,
 * CTAs, etc.) et retourne des suggestions d'amélioration.
 *
 * Usage typique : passer tous les textes user-facing d'une ou plusieurs
 * pages pour obtenir un rapport complet du Directeur Artistique.
 */
export async function auditSiteContent(
  copies: SiteCopyToAudit[],
): Promise<FullSiteAuditResult> {
  const copyDescriptions = copies
    .map(
      (c, i) =>
        `${i + 1}. [${c.pageName}] — ${c.section}
   Contexte : ${c.context}
   Texte actuel :
   """
   ${c.currentText.slice(0, 500)}
   """`,
    )
    .join("\n\n");

  const response = await callWithRetry({
    model: "claude-sonnet-4-20250514",
    max_tokens: 8000,
    system: buildDirectorIdentity(),
    messages: [
      {
        role: "user",
        content: `AUDIT CONTENU STATIQUE DU SITE — Tout ce que les visiteurs voient

Tu audites les textes VISIBLES par les visiteurs de deviens-marrant.fr.
Ce sont les textes qui font la première impression. Ils doivent incarner
la voix de la marque, servir les 3 personas et être au niveau du site n°1.

VOICI LES TEXTES À AUDITER :

${copyDescriptions}

CRITÈRES D'AUDIT — CHAQUE TEXTE DOIT :

1. VOIX DE MARQUE : tutoiement, ton complice, jamais corporate ni condescendant
2. PERSONAS : au moins un des 3 personas (Yanis/Sophie/Marc) doit se reconnaître
3. HUMOUR : le site est dédié à l'humour — les textes doivent refléter ça (sans forcer)
4. CONCRET : pas de promesses vagues — des résultats tangibles
5. MODERNE : références actuelles (Paul Mirabel, Fary, Roman Frayssinet, Blanche Gardin > Gad, Foresti, Jamel)
6. SEO : mots-clés naturellement intégrés dans les headings et descriptions
7. CTA CLAIR : chaque page doit pousser vers une action (s'inscrire, explorer, commencer un parcours)
8. COHÉRENCE : les textes entre pages doivent être cohérents (mêmes promesses, mêmes chiffres)

RÉFÉRENCES HUMORISTES — RÈGLE NON NÉGOCIABLE :
- Prioritaires (toujours en premier) : Paul Mirabel, Fary, Roman Frayssinet, Blanche Gardin, Waly Dia
- Legacy (max 1 mention, jamais en première position) : Gad Elmaleh, Florence Foresti, Jamel Debbouze

ANTI-PATTERNS À DÉTECTER :
- Texte trop long ou trop formel pour le ton du site
- Références d'humoristes datées en position principale
- Promesses génériques ("des centaines de...") sans spécificité
- Manque d'humour dans un site... d'humour
- Incohérence entre pages (chiffres différents, promesses contradictoires)
- Persona oublié (un des 3 n'est jamais adressé)

Pour chaque texte, donne :
- Un verdict (APPROVED / NEEDS_REVISION / REJECTED)
- Un score (1-10)
- Les problèmes identifiés
- Une suggestion de réécriture si score < 8

Réponds en JSON :
{
  "date": "${new Date().toISOString().slice(0, 10)}",
  "overallScore": 1-10,
  "totalPages": ${new Set(copies.map((c) => c.pageName)).size},
  "totalSections": ${copies.length},
  "results": [
    {
      "pageName": "...",
      "section": "...",
      "verdict": "APPROVED|NEEDS_REVISION|REJECTED",
      "score": 1-10,
      "currentText": "Début du texte actuel...",
      "suggestedText": "Réécriture suggérée (si score < 8, sinon identique)",
      "issues": ["Problème 1", "Problème 2"],
      "directorNote": "Avis en 1-2 phrases"
    }
  ],
  "priorityFixes": ["Les 3-5 corrections les plus urgentes"],
  "directorSummary": "Résumé global : forces du site, faiblesses, recommandations"
}`,
      },
    ],
  });

  const text = getResponseText(response);
  const parsed = extractJson<FullSiteAuditResult>(text);

  // Validation basique
  if (!Array.isArray(parsed.results) || parsed.results.length === 0) {
    throw new Error("Stand-Up Director : audit site — résultats vides");
  }
  if (
    typeof parsed.overallScore !== "number" ||
    parsed.overallScore < 1 ||
    parsed.overallScore > 10
  ) {
    parsed.overallScore = 5;
  }

  // Valider les verdicts individuels
  const validVerdicts: ValidationVerdict[] = [
    "APPROVED",
    "NEEDS_REVISION",
    "REJECTED",
  ];
  for (const result of parsed.results) {
    if (!validVerdicts.includes(result.verdict)) {
      result.verdict = "NEEDS_REVISION";
    }
    if (
      typeof result.score !== "number" ||
      result.score < 1 ||
      result.score > 10
    ) {
      result.score = 5;
    }
    if (!Array.isArray(result.issues)) {
      result.issues = [];
    }
  }

  if (!Array.isArray(parsed.priorityFixes)) {
    parsed.priorityFixes = [];
  }
  if (!parsed.directorSummary?.trim()) {
    parsed.directorSummary = "Audit complété.";
  }

  return parsed;
}

// ─── Types pour validation social media ─────────────────────────

export interface SocialPostToValidate {
  platform: string;
  format: string;
  hook: string;
  content: string;
  threadParts?: string[];
  cta: string;
  hashtags: string[];
}

// ─── Validation d'un post social ────────────────────────────────

export async function validateSocialPost(
  post: SocialPostToValidate,
  persona: PersonaKey,
): Promise<ValidationResult> {
  const p = PERSONAS[persona];

  const response = await callWithRetry({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1000,
    system: buildDirectorIdentity(),
    messages: [
      {
        role: "user",
        content: `VALIDATION POST SOCIAL — ${post.platform} (${post.format}) pour ${p.name} (${p.age} ans)

Hook : "${post.hook}"
Contenu : "${post.content}"
${post.threadParts?.length ? `Thread (${post.threadParts.length} parties) :\n${post.threadParts.map((t, i) => `  ${i + 1}. "${t}"`).join("\n")}` : ""}
CTA : "${post.cta}"
Hashtags : ${post.hashtags.join(", ")}

═══ 10 CRITÈRES DE VALIDATION SOCIAL (TOUS obligatoires) ═══

1. HOOK TEST (poids x2) :
   Les 5 premiers mots créent-ils une TENSION (contradiction, spécificité bizarre, interpellation directe) ?
   → "Waly Dia parle PLUS FORT" = ✅ contradiction = scroll-stopping
   → "La technique du silence de 3 secondes" = ✅ spécificité bizarre
   → "Astuce humour du jour !" = ❌ description plate = REJETÉ
   → "Petit thread sur..." = ❌ aucune tension = REJETÉ
   → Le hook fait-il ≤ 5 mots ? S'il dépasse = NEEDS_REVISION

2. ANTI-IA TEST (poids x3 — LE PLUS IMPORTANT) :
   Le post pourrait-il avoir été écrit par ChatGPT ? Si OUI = REJETÉ IMMÉDIAT.
   Red flags automatiques (1 seul = REJETÉ) :
   - "Dans un monde où..." / "Il est important de..." / "Force est de constater..."
   - "N'hésitez pas à..." / "Découvrez comment..." / "Saviez-vous que..."
   - "En conclusion" / "Pour résumer" / "Par ailleurs" / "De plus" / "En outre"
   - Adverbes creux : "véritablement", "réellement", "absolument", "littéralement"
   - Formulations passives : "il peut être observé que", "il convient de souligner"
   - Vocabulaire robot : "pertinent", "optimiser", "impactant", "paradigme", "levier"
   - Questions rhétoriques creuses : "Mais alors, qu'est-ce que l'humour ?"
   - Listes à puces dans un tweet
   Le post doit sonner comme un HUMAIN qui tape sur son téléphone — phrases incomplètes, parenthèses, tirets, mots familiers, détails spécifiques.

3. COPYWRITING TEST (poids x2) :
   Le post a-t-il un RYTHME de stand-up ?
   → Phrases courtes. Ruptures de ton. Setup → twist.
   → Pas de paragraphes lisses de 3 lignes sans surprise
   → Au moins UN trait d'humour (vanne, observation drôle, autodérision)
   → Si le post est 100% sérieux/informatif = NEEDS_REVISION minimum

4. STANDALONE TEST :
   Quelqu'un qui ne connaît PAS deviens-marrant.fr comprend et apprécie ce post ?
   → Le post fonctionne seul dans un feed, sans contexte

5. SHARE TEST (poids x2) :
   "${p.name} envoie ça à son/sa meilleur(e) pote en 2 secondes" ?
   → Pas "intéressant" — DRÔLE, SURPRENANT, ou UTILE AU POINT D'ENVOYER

6. CTA TEST :
   Le CTA est-il INVISIBLE ou ABSENT ? On ne doit pas sentir qu'on vend un truc.
   → RÈGLE : max 1 post sur 5 doit contenir un lien vers le site. Si le champ CTA est vide (""), c'est NORMAL et VOULU.
   → Si le CTA est présent : BON = "50+ techniques → deviens-marrant.fr" / simplement le lien, sec. MAUVAIS = "Découvrez plus sur notre site !" / "N'hésitez pas à visiter..." / "Suivez-nous !"
   → Si le CTA a un point d'exclamation ou du vocabulaire marketing = NEEDS_REVISION

7. VOIX & BRAND TEST :
   Ton complice, mature, jamais corporate ? Max 2 émojis, jamais en ouverture ?
   → Le post sonne comme "le pote drôle et bienveillant" — pas comme un CM, pas comme un prof
   → VOIX ÉQUIPE : on parle au "on" (l'équipe), JAMAIS au "je" (un individu). "on a compilé" ✅ / "j'ai compilé" ❌ / "on fait notre pub" ✅ / "je fais ma pub" ❌
   → Si le post utilise "je" pour parler de la marque/du site = NEEDS_REVISION

8. ANTI-GENERIC TEST :
   Un compte lambda / un bot pourrait poster EXACTEMENT ça ?
   → Si oui = REJETÉ. Interdits : "Complète cette vanne", "Note de 1 à 10", "Tag un ami", "Like si..."
   → Le post a-t-il notre ADN unique (techniques de stand-up + humour + progression) ?

9. PLATFORM-NATIVE TEST :
   Le format exploite les codes SPÉCIFIQUES de ${post.platform} ?
   → Twitter : max 280 chars, punchline sèche, pas de hashtags dans le corps
   → LinkedIn : sauts de ligne, première phrase choc seule, max 1300 chars, PAS de broetry, PAS de "agree?", PAS de faux storytelling "Il y a 3 ans..."
   → Thread : chaque tweet autonome ET donne envie du suivant, dernier = CTA

10. PERSONA TEST :
    ${p.name} (${p.age} ans, ${p.interests.slice(0, 4).join(", ")}) scrolle et s'arrête sur CE post ?
    → Le sujet, le ton et le vocabulaire correspondent à son quotidien

11. DIVERSITÉ HUMORISTES TEST :
    Si le post cite un humoriste, est-ce TOUJOURS le même (Fary, Paul Mirabel, Blanche Gardin) ?
    → On a 8 humoristes prioritaires : Paul Mirabel, Fary, Roman Frayssinet, Blanche Gardin, Waly Dia, Panayotis Pascot, Pierre Croce, Inès Reg
    → Si le post cite un humoriste qui revient trop souvent (plus de 2 posts consécutifs avec le même) = NEEDS_REVISION
    → Vérifier que Roman Frayssinet, Waly Dia, Panayotis Pascot, Pierre Croce, Inès Reg ne sont pas systématiquement ignorés

VERDICT — BARRE HAUTE (on ne publie que l'excellence) :
- APPROVED (score ≥ 9) : micro-performance de stand-up, shareable immédiatement, indistinguable d'un post d'humoriste pro
- NEEDS_REVISION (score 7-8) : le potentiel est là mais il manque le twist, le hook, ou la spécificité — propose une réécriture
- REJECTED (score ≤ 6) : générique, sent l'IA, format dialogue/anecdote fictive, engagement bait, ou hors-marque

CRITÈRES DE REJET AUTOMATIQUE (score ≤ 3, REJECTED immédiat) :
- Format "dialogue reconstitué" : "Moi : ... / Mon pote : ..." ou "Prof : ... / Moi : ..." — c'est le format le plus saturé de Twitter, n'importe quel compte à 500 followers le fait
- Anecdote fictive de coloc/bureau sans technique de stand-up — on n'est pas un compte humour générique
- Aucun lien avec le stand-up, les techniques d'humour, ou la progression — le post ne sert pas la marque
- Punchline prévisible — si on voit la chute arriver, c'est raté

Réponds en JSON :
{
  "verdict": "APPROVED|NEEDS_REVISION|REJECTED",
  "score": 1-10,
  "strengths": ["Ce qui marche"],
  "issues": ["Ce qui ne va pas"],
  "revision": "Si NEEDS_REVISION : ta version améliorée",
  "directorNote": "Ton avis en 1-2 phrases"
}`,
      },
    ],
  });

  const text = getResponseText(response);
  return parseSocialValidationResult(text);
}

/**
 * Parseur spécifique pour la validation social media.
 * Seuils plus élevés : APPROVED ≥ 9, NEEDS_REVISION 7-8, REJECTED ≤ 6.
 */
function parseSocialValidationResult(text: string): ValidationResult {
  const parsed = extractJson<ValidationResult>(text);

  const validVerdicts: ValidationVerdict[] = ["APPROVED", "NEEDS_REVISION", "REJECTED"];
  if (!validVerdicts.includes(parsed.verdict)) {
    parsed.verdict = "NEEDS_REVISION";
  }

  if (typeof parsed.score !== "number" || parsed.score < 1 || parsed.score > 10) {
    parsed.score = 5;
  }

  if (!Array.isArray(parsed.strengths)) parsed.strengths = [];
  if (!Array.isArray(parsed.issues)) parsed.issues = [];

  if (!parsed.directorNote?.trim()) {
    parsed.directorNote = "Évaluation complétée.";
  }

  // Cohérence verdict/score — seuils social (≥9 = APPROVED, 7-8 = NEEDS_REVISION, ≤6 = REJECTED)
  if (parsed.score >= 9) {
    parsed.verdict = "APPROVED";
  } else if (parsed.score >= 7) {
    parsed.verdict = "NEEDS_REVISION";
  } else {
    parsed.verdict = "REJECTED";
  }

  return parsed;
}

// ─── Réécriture d'un post social par le Directeur ───────────────

export async function directorRewriteSocialPost(
  failedPost: SocialPostToValidate,
  lastValidation: ValidationResult,
  persona: PersonaKey,
): Promise<{ hook: string; content: string; threadParts?: string[]; cta: string; hashtags: string[] }> {
  const p = PERSONAS[persona];

  const response = await callWithRetry({
    model: "claude-sonnet-4-20250514",
    max_tokens: failedPost.format === "THREAD" ? 2000 : 800,
    system: buildDirectorIdentity(),
    messages: [
      {
        role: "user",
        content: `RÉÉCRITURE DIRECTEUR — Le post social a échoué 3 validations.
C'est à TOI de le réécrire. Tu es un auteur de stand-up, pas un CM. Écris comme un HUMAIN.

POST REJETÉ (${failedPost.platform} — ${failedPost.format}) :
Hook : "${failedPost.hook}"
Contenu : "${failedPost.content}"
${failedPost.threadParts?.length ? `Thread :\n${failedPost.threadParts.map((t, i) => `  ${i + 1}. "${t}"`).join("\n")}` : ""}

PROBLÈMES :
${lastValidation.issues.map((i) => `- ${i}`).join("\n")}
${lastValidation.revision ? `\nSUGGESTION : ${lastValidation.revision}` : ""}

PERSONA : ${p.name} (${p.age} ans) — ${p.description}

═══ CONTRAINTES DE RÉÉCRITURE ═══
1. ANTI-IA : aucun mot/formulation qui sent ChatGPT ("découvrez", "n'hésitez pas", "il est important", "en conclusion", adverbes creux, transitions lisses)
2. HUMOUR : au moins UN trait drôle (observation, autodérision, vanne, twist)
3. HOOK : ≤ 5 mots, crée une TENSION (contradiction, spécificité bizarre, interpellation)
4. CTA : invisible et humain SI présent — sinon le champ cta doit être vide (""). Max 1 post sur 5 avec un lien vers le site. Pas de marketing language, pas de point d'exclamation
5. RYTHME : phrases courtes, ruptures de ton, comme à l'oral — pas de paragraphes lisses
6. PLATEFORME : ${failedPost.platform === "LINKEDIN" ? "max 1300 chars, sauts de ligne, première phrase seule et choc, PAS de broetry/guru/agree?" : failedPost.platform === "TWITTER" ? "max 280 chars, punchline sèche, pas de hashtags dans le corps" : "adapté aux codes de la plateforme"}
7. Le post doit pouvoir être envoyé par ${p.name} à son meilleur pote
8. VOIX ÉQUIPE : on parle au "on" (l'équipe), JAMAIS au "je" (un individu). "on a compilé" ✅ / "j'ai compilé" ❌

Réponds en JSON :
{
  "hook": "Hook réécrit (≤ 5 mots, tension)",
  "content": "Post complet réécrit (HUMAIN, drôle, stand-up tone)",
  ${failedPost.format === "THREAD" ? '"threadParts": ["Tweet 1", "..."],' : ""}
  "cta": "CTA invisible et humain",
  "hashtags": ["2-4 hashtags"]
}`,
      },
    ],
  });

  const text = getResponseText(response);
  const parsed = extractJson<{ hook: string; content: string; threadParts?: string[]; cta: string; hashtags: string[] }>(text);

  if (!parsed.hook?.trim() || !parsed.content?.trim()) {
    throw new Error("Stand-Up Director : réécriture social post — contenu vide");
  }

  parsed.hook = parsed.hook.trim().slice(0, 200);
  parsed.content = parsed.content.trim().slice(0, 3000);
  parsed.cta = (parsed.cta ?? "").trim().slice(0, 200);
  if (!Array.isArray(parsed.hashtags)) parsed.hashtags = [];

  return parsed;
}
