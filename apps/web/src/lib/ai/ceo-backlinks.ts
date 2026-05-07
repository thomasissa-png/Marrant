/**
 * CEO Backlinks — module de support pour la génération de pitchs presse/blog/podcast.
 *
 * Ce module remplace l'ancien `haro-agent.ts` (supprimé en Phase 5.B.2). Il expose :
 *  - `CEO_BACKLINK_TOPICS` : liste de sujets pertinents pour deviens-marrant.fr
 *  - `CEO_TEAM_BIO` : bio courte signée "L'Équipe Deviens Marrant" (jamais "Alex")
 *  - `CEO_BACKLINK_TEMPLATES` : templates de pitch calibrés voix unifiée v3
 *  - `filterBacklinkOpportunities()` : filtrage par pertinence
 *
 * Sources externes supportées (`source`) :
 *  - `HARO`         : Help A Reporter Out (US, vouvoiement obligatoire)
 *  - `CONNECTIVELY` : ex-HARO, scraping fragile → migration RSS/Zapier (handoff Thomas)
 *  - `SOURCEBOTTLE` : journalistes AU/UK/FR
 *  - `RSS_FEED`     : flux RSS génériques (recommandation @legal s9)
 *  - `BLOGGER`      : blogs spécialisés (tutoiement OK)
 *  - `PODCAST`      : invitations podcasts (tutoiement OK)
 *  - `DIRECTORY`    : annuaires sectoriels (vouvoiement)
 *  - `EXCHANGE`     : échanges de liens entre sites partenaires
 */

// ─── Sujets pertinents (94 topics calibrés Marrant) ──────────────────────

/**
 * Liste des thèmes que l'agent CEO surveille pour proposer des pitchs.
 * Filtre case-insensitive sur `query + category + outlet` de chaque opportunité.
 *
 * Couvre 5 axes :
 *  1. Humour pur (humour, vanne, blague, comedy, stand-up...)
 *  2. Communication & soft skills (charisme, prise de parole, répartie...)
 *  3. Bien-être & social (relations, dating, networking, anxiété...)
 *  4. Pro & management (team building, leadership, créativité...)
 *  5. Développement perso (confiance, productivité, introversion...)
 */
export const CEO_BACKLINK_TOPICS: string[] = [
  // 1. Humour pur
  "humour", "humor", "funny", "drôle", "rire", "blague", "joke",
  "stand-up", "standup", "comédie", "comedy", "spectacle", "humoriste",
  "improvisation", "improv", "répartie", "wit", "witty",
  // 2. Communication & soft skills
  "communication", "soft skills", "prise de parole", "public speaking",
  "charisme", "charisma", "storytelling", "conversation", "tac au tac",
  // 3. Bien-être & social
  "bien-être", "wellbeing", "well-being", "relations sociales", "social skills",
  "dating", "rendez-vous", "ice breaker", "icebreaker", "networking",
  "stress", "anxiété", "timidité", "shyness", "introvert", "introverti",
  // 4. Pro & management
  "team building", "management", "leadership", "créativité", "creativity",
  "réunion", "meeting", "machine à café", "watercooler",
  // 5. Développement perso
  "confiance en soi", "self-confidence", "self confidence", "estime de soi",
  "développement personnel", "personal development", "personal growth",
  "productivité", "productivity",
  // Variations FR/EN supplémentaires
  "marrant", "drôlerie", "blagueur", "comique", "vanneur", "punchline",
  "one liner", "one-liner", "sketch", "improvisateur",
  "réseau social", "small talk", "conversation gênante",
  "premier rendez-vous", "rdv", "tinder", "bumble",
  "speech", "discours", "présentation", "pitch deck",
  "team cohesion", "esprit d'équipe", "ambiance bureau",
  "burn out", "burnout", "épuisement professionnel",
  "introversion", "extraversion", "personnalité",
  "phobie sociale", "social phobia", "anxiété sociale",
];

// ─── Bio collective (remplace ALEX_BIO de haro-agent) ────────────────────

/**
 * Bio courte signée "L'Équipe Deviens Marrant" — jamais "Alex".
 * Calibrée voix unifiée v3 + founder-preferences.md (signature collective P0 s8).
 * Utilisée en fin de pitch presse + footer email backlink.
 */
export const CEO_TEAM_BIO =
  "L'Équipe Deviens Marrant — deviens-marrant.fr est la plateforme francophone qui enseigne l'humour avec les techniques du stand-up professionnel. Plus de 290 vannes décortiquées, 60+ techniques répertoriées et 80+ vidéos analysées (Paul Mirabel, Fary, Blanche Gardin, Roman Frayssinet, Waly Dia).";

// ─── Templates de pitch (voix unifiée v3) ────────────────────────────────

/**
 * Templates de pitch par source. Le LLM Sonnet 4.6 reçoit ces templates en
 * exemples few-shot dans `pitchToBacklinkOpportunity()` pour produire un pitch
 * calibré voix Marrant + contraintes par source (vouvoiement HARO, tutoiement
 * blog/podcast).
 *
 * Calibration : exemples 11-15 de docs/copy/ceo-canonical-examples.md (backlinks).
 */
export const CEO_BACKLINK_TEMPLATES = {
  HARO: {
    tone: "vouvoiement",
    maxWords: 100,
    structure:
      "Hook (1 phrase observation drôle) → Insight expert citable (2-3 phrases techniques précises) → Bio + lien sobre.",
    bannedWords: ["backlink", "SEO", "guest post", "lien retour", "link building"],
    example: `Bonjour [Journaliste],

Sur le timing en humour, l'observation contre-intuitive : les pros du stand-up attendent en moyenne 3 secondes APRÈS la punchline avant de parler — pas avant. Paul Mirabel le fait quasi systématiquement, Blanche Gardin aussi. C'est cette pause qui fait rire, pas la vanne elle-même.

Si l'angle vous intéresse, je peux détailler 3 techniques précises avec timecodes vidéo.

—
${CEO_TEAM_BIO}
deviens-marrant.fr`,
  },
  CONNECTIVELY: {
    tone: "vouvoiement",
    maxWords: 100,
    structure: "Identique HARO (même API journalist-driven).",
    bannedWords: ["backlink", "SEO", "guest post"],
    example: "Identique HARO.",
  },
  SOURCEBOTTLE: {
    tone: "vouvoiement",
    maxWords: 80,
    structure: "Plus court que HARO (deadlines courtes). Hook + insight + dispo.",
    bannedWords: ["backlink", "SEO"],
    example: `Bonjour,

Sur la répartie en réunion : la technique du "callback" (rappel d'un détail dit 5 minutes plus tôt) est ce qui sépare les bons humoristes des excellents. Roman Frayssinet construit ses sketches entiers là-dessus.

Disponible pour préciser, deadline OK.

—
${CEO_TEAM_BIO}`,
  },
  RSS_FEED: {
    tone: "tutoiement",
    maxWords: 90,
    structure: "Approche douce, pas de hook commercial. Constat + offre de matière.",
    bannedWords: ["partenariat", "collaboration", "affiliation"],
    example: `Salut,

J'ai vu ton article sur [sujet]. Une observation qui complète bien : sur l'autodérision, la règle "punch yourself first" de Blanche Gardin marche en pro mais pas en couple — l'audience change la lecture du même geste.

Si tu veux des exemples décortiqués pour un prochain article, je peux t'envoyer 3 cas filmés.

—
${CEO_TEAM_BIO}`,
  },
  BLOGGER: {
    tone: "tutoiement",
    maxWords: 100,
    structure: "Même pattern que RSS_FEED. Tutoiement, ton confraternel.",
    bannedWords: ["backlink", "guest post", "partenariat rémunéré"],
    example: "Identique RSS_FEED.",
  },
  PODCAST: {
    tone: "tutoiement",
    maxWords: 120,
    structure: "Pitch invité podcast : sujet précis + 3 angles + dispo.",
    bannedWords: ["promo", "interview promo"],
    example: `Salut,

J'écoute [podcast] depuis l'épisode sur [épisode pertinent]. Si un jour tu veux creuser le sujet de l'humour comme outil de leadership (vs gag), j'ai 3 angles déjà testés en conf :

1. Pourquoi les meilleurs managers font 1 vanne/réunion (et pas 5).
2. Le "callback" comme outil de cohésion d'équipe.
3. Ce que Fary fait que la plupart des speakers ratent.

Dispo en visio ou Paris.

—
${CEO_TEAM_BIO}`,
  },
  DIRECTORY: {
    tone: "vouvoiement",
    maxWords: 60,
    structure: "Très court, factuel. Catégorie + URL + bio.",
    bannedWords: ["meilleur site", "n°1"],
    example: `Bonjour,

Je vous propose deviens-marrant.fr pour la catégorie [catégorie]. Plateforme francophone d'apprentissage de l'humour avec techniques de stand-up.

—
${CEO_TEAM_BIO}
deviens-marrant.fr`,
  },
  EXCHANGE: {
    tone: "tutoiement",
    maxWords: 80,
    structure: "Pas d'échange transactionnel. On propose de la valeur, on ne demande pas de lien.",
    bannedWords: ["échange de liens", "tu mets le mien je mets le tien", "linkback"],
    example: `Salut,

J'ai vu que tu écris sur [thème]. Si l'angle humour t'intéresse pour un futur article, j'ai des décryptages techniques (timecodes vidéo Paul Mirabel + Fary) que je partage volontiers.

Aucune contrepartie attendue, juste de la matière si ça sert.

—
${CEO_TEAM_BIO}`,
  },
} as const;

// ─── Filtrage des opportunités ───────────────────────────────────────────

export interface BacklinkOpportunityInput {
  query: string;
  category?: string;
  outlet?: string;
}

/**
 * Filtre les opportunités sur les 94 topics pertinents.
 * Retourne `true` si au moins 1 topic match (case-insensitive) dans
 * la concaténation `query + category + outlet`.
 */
export function isRelevantBacklinkOpportunity(
  opportunity: BacklinkOpportunityInput,
): boolean {
  const haystack = `${opportunity.query} ${opportunity.category ?? ""} ${opportunity.outlet ?? ""}`.toLowerCase();
  return CEO_BACKLINK_TOPICS.some((topic) => haystack.includes(topic.toLowerCase()));
}

/**
 * Score de pertinence simple (0-10) basé sur le nombre de topics matchés.
 * Utilisé en complément du score Director (qui valide la VOIX, pas la pertinence).
 */
export function scoreBacklinkRelevance(
  opportunity: BacklinkOpportunityInput,
): number {
  const haystack = `${opportunity.query} ${opportunity.category ?? ""} ${opportunity.outlet ?? ""}`.toLowerCase();
  const matches = CEO_BACKLINK_TOPICS.filter((topic) =>
    haystack.includes(topic.toLowerCase()),
  ).length;
  // Saturation à 10 (5 matches = score max — au-delà, redondant)
  return Math.min(10, matches * 2);
}

/** Type union des sources supportées (utilisé dans pitchToBacklinkOpportunity). */
export type BacklinkSource =
  | "HARO"
  | "CONNECTIVELY"
  | "SOURCEBOTTLE"
  | "RSS_FEED"
  | "BLOGGER"
  | "PODCAST"
  | "DIRECTORY"
  | "EXCHANGE";
