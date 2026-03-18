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
// Vision : faire de deviens-marrant.fr le site n°1 du stand-up
// français ET la plateforme de formation au stand-up n°1 en France.
//
// Hiérarchie : supervise les agents Vannes, Conseils, Vidéos et
// Blog SEO. Travaille en pair avec l'Agent Marketing.
// ───────────────────────────────────────────────────────────────────

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

VERDICT :
- APPROVED (score ≥ 7) : publiable en l'état, au niveau du site n°1
- NEEDS_REVISION (score 4-6) : l'idée est bonne mais l'exécution peut être meilleure — propose une réécriture
- REJECTED (score ≤ 3) : ne passe pas le test stand-up, recommencer de zéro

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
  return parseValidationResult(text);
}

// ─── Validation d'un conseil ─────────────────────────────────────

export async function validateTip(
  tip: TipToValidate,
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
- APPROVED (score ≥ 7) : publiable, enseigne vraiment quelque chose
- NEEDS_REVISION (score 4-6) : la technique est bonne mais l'exécution manque de punch — propose des corrections
- REJECTED (score ≤ 3) : trop générique, pas actionnable, ou doublon

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
  return parseValidationResult(text);
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
- APPROVED (score ≥ 6) : bonne sélection pédagogique
- NEEDS_REVISION (score 4-5) : vidéo acceptable mais la raison ou la catégorie pourrait être mieux justifiée
- REJECTED (score ≤ 3) : mauvais match persona/technique ou chaîne surreprésentée

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
  // Tronquer le contenu pour rester dans les limites du prompt
  const truncatedContent = article.content.slice(0, 6000);

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

ANTI-CANNIBALISATION :
- Le slug/titre ne cannibalise-t-il pas un article existant du site ?
- Le mot-clé principal est-il distinct des articles déjà publiés ?

VERDICT :
- APPROVED (score ≥ 7) : publiable, drôle ET instructif, au niveau n°1
- NEEDS_REVISION (score 4-6) : le fond est bon mais il manque de l'humour, des exemples concrets, ou des liens internes
- REJECTED (score ≤ 3) : pas drôle, trop générique, ou cannibalise un article existant

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
  return parseValidationResult(text);
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

  // Cohérence verdict/score
  if (parsed.score >= 7 && parsed.verdict === "REJECTED") {
    parsed.verdict = "APPROVED";
  }
  if (parsed.score <= 3 && parsed.verdict === "APPROVED") {
    parsed.verdict = "NEEDS_REVISION";
  }

  return parsed;
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
