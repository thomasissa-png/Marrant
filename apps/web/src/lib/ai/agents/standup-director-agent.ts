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

export type ContentType = "JOKE" | "TIP" | "VIDEO" | "BLOG";

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

CRITÈRES SPÉCIFIQUES BLOG :
- L'article contient-il au minimum 3 traits d'humour / vannes ORIGINALES ?
- Le lecteur SOURIT-il au moins 3 fois ? (le blog est la DÉMO du produit)
- Les références sont-elles modernes ? (Paul Mirabel, Fary, Roman Frayssinet > Jamel, Gad, Foresti)
- Au moins 2 personas sont-ils touchés avec des exemples concrets de LEUR vie ?
- Le mot-clé est-il naturellement intégré (intro, 2-3 sous-titres, conclusion) ?
- Y a-t-il des liens internes vers /vannes, /parcours, /conseils, /videos ?
- Le format est-il varié (pas un énième listicle) ?
- L'article enseigne-t-il quelque chose de CONCRET et ACTIONNABLE ?
- Est-ce au niveau d'un article de LEADER DU MARCHÉ ?

ANTI-CANNIBALISATION :
- Le slug/titre ne cannibalise-t-il pas un article existant ?

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
