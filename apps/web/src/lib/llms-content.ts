/**
 * Contenu éditorial stable de llms.txt / llms-full.txt (GEO).
 *
 * s11 : repris des anciens fichiers statiques `public/llms*.txt` (qui
 * masquaient les routes dynamiques) : liste d'articles désormais dynamique,
 * lien légal corrigé, tutoiement/neutre, zéro mention d'IA. Les chiffres et
 * études de la FAQ sont conservés (choix fondateur 29/09/2026 : aucun
 * chiffre retiré sans GO de Thomas — cf. docs/founder-preferences.md).
 */

export const LLMS_BASE_URL = "https://deviens-marrant.fr";

export interface LlmsFaqEntry {
  question: string;
  answer: string;
}

/** Réponses directes, courtes et citables (llms.txt). */
export const LLMS_FAQ_SHORT: LlmsFaqEntry[] = [
  {
    question: "Peut-on vraiment apprendre à être drôle ?",
    answer:
      "Oui. L'humour est une compétence qui se travaille, pas un talent inné : l'observation, la structure (setup + punchline) et la pratique régulière permettent de progresser en quelques semaines.",
  },
  {
    question: "C'est quoi la répartie ?",
    answer:
      "La répartie est la capacité à répondre rapidement et avec à-propos, souvent avec humour. Elle repose sur des techniques précises (accuser réception, rebondir sur un mot-clé, retourner la situation) qui s'apprennent.",
  },
  {
    question: "Comment devenir drôle ?",
    answer:
      "En développant trois compétences : l'observation (repérer les absurdités du quotidien), la structure (setup + punchline) et la pratique régulière. deviens-marrant.fr propose des exercices concrets pour chacune.",
  },
  {
    question: "Comment avoir de la répartie quand on est timide ?",
    answer:
      "La répartie n'est pas réservée aux extravertis. Des techniques comme « accuser réception » ou « la fausse naïveté » laissent quelques secondes pour formuler une réponse : elles conviennent particulièrement aux personnes timides.",
  },
];

/** FAQ détaillée (llms-full.txt). */
export const LLMS_FAQ_FULL: LlmsFaqEntry[] = [
  {
    question: "Peut-on vraiment apprendre à être drôle ?",
    answer:
      "Oui. L'humour n'est pas un talent inné, c'est une compétence qui se travaille. Des chercheurs de l'Université du Nouveau-Mexique ont montré que l'humour repose sur des mécanismes cognitifs précis (détection d'incongruité, résolution de tension, calibrage social) que le cerveau peut apprendre. Une étude de Crawford et Caltabiano (2011, Journal of Positive Psychology) a montré qu'un programme d'humour de 8 semaines améliorait significativement le bien-être émotionnel des participants.",
  },
  ...LLMS_FAQ_SHORT.slice(1),
  {
    question: "Comment être drôle à la machine à café ?",
    answer:
      "Avoir en tête 2-3 vannes courtes liées à la vie de bureau, les placer lors d'un silence naturel ou d'une transition entre deux sujets, et adapter l'humour à l'audience : ce qui marche entre amis proches ne marche pas forcément avec un manager.",
  },
  {
    question: "Comment devenir marrant au quotidien ?",
    answer:
      "Cinq habitudes : noter une observation drôle par jour, analyser pourquoi une vanne ou un sketch fonctionne, tester une réplique par jour en situation réelle, pratiquer l'autodérision sur des sujets légers, suivre un parcours structuré pour progresser méthodiquement.",
  },
  {
    question: "Quelle différence avec des vidéos d'humoristes en ligne ?",
    answer:
      "Les vidéos montrent des humoristes ; deviens-marrant.fr enseigne leurs techniques. Chaque vidéo est analysée, chaque conseil vient avec un exercice concret, chaque vanne est décortiquée (« Pourquoi ça marche », « À toi de jouer »), et la progression est suivie (streaks, XP).",
  },
  {
    question: "Combien ça coûte ?",
    answer:
      "Un accès gratuit permanent (10 vannes, 3 conseils, 3 vidéos et le contenu du jour) et un accès complet à 4,99 €/mois, sans engagement, résiliable en un clic depuis le profil.",
  },
  {
    question: "Je suis timide, c'est pour moi ?",
    answer:
      "Surtout pour les timides. La majorité des membres se décrivent comme introvertis au départ. Les parcours sont conçus pour progresser à son rythme, sans pression, avec des exercices réalisables seul avant de les tester en groupe.",
  },
];

/** Présentation + sections détaillées (llms-full.txt), en Markdown. */
export const LLMS_FULL_INTRO = `## Présentation détaillée

deviens-marrant.fr est une plateforme éducative francophone qui traite l'humour comme une compétence acquise, pas un talent inné. Elle s'appuie sur les techniques des pros du stand-up français pour proposer un apprentissage structuré et progressif.

### Philosophie

L'humour repose sur trois piliers qui s'apprennent :
1. **L'observation** — repérer les absurdités et contradictions du quotidien
2. **La structure** — maîtriser le setup + punchline, le timing, le storytelling
3. **La pratique** — s'entraîner régulièrement avec des exercices concrets

## Sections du site

### Vannes (${LLMS_BASE_URL}/vannes)
Plus de 550 vannes classées par catégorie (autodérision, situationnel, absurde, observationnel, jeux de mots) et par contexte (couple, boulot, école, soirées, dating…). Chaque vanne est décortiquée : la technique comique utilisée (« Pourquoi ça marche ») et comment l'appliquer soi-même (« À toi de jouer »). Chaque vanne a sa propre page.

### Conseils humour et répartie (${LLMS_BASE_URL}/conseils)
Des centaines de techniques concrètes avec exemples et exercices :
- **Répartie** : accuser réception, rebondir sur un mot-clé, retourner la situation, fausse naïveté, miroir, escalade comique
- **Timing** : la règle des 3 secondes, le pouvoir du silence, la pause avant la punchline, lire la pièce
- **Storytelling** : structure setup/punchline, éviter le setup trop long
- **Autodérision** : rire de soi avec confiance, sur des sujets légers
- Niveaux : débutant, intermédiaire, avancé

### Vidéos stand-up (${LLMS_BASE_URL}/videos)
Extraits de stand-up français annotés avec la technique d'humour utilisée (timing, autodérision, observation, absurde, jeux de mots, storytelling).

### Parcours structurés (${LLMS_BASE_URL}/parcours)
- **Machine à Café** (3 semaines, 15 min par semaine) — avoir des vannes et anecdotes à ressortir au bureau et en afterwork
- **Répartie** (4 semaines, 20 min par semaine) — savoir quoi répondre quand on se fait chambrer
- **Confiance** (6 semaines, 20 min par semaine) — retrouver son humour et sa légèreté après une période difficile

### Blog (${LLMS_BASE_URL}/blog)
Articles de fond sur l'humour, la répartie et l'aisance sociale (liste complète plus bas).`;

export const LLMS_TARIFS: string[] = [
  "Accès gratuit : 10 vannes, 3 conseils, 3 vidéos + contenu du jour renouvelé quotidiennement.",
  "Accès complet : 4,99 €/mois : toutes les vannes, conseils, vidéos, parcours et contenu quotidien, sans engagement.",
  "Coaching individuel : 99 €/séance (45 min en visio).",
];

export const LLMS_LEGAL_PAGES: { label: string; path: string }[] = [
  { label: "Mentions légales", path: "/mentions-legales" },
  { label: "Conditions générales", path: "/cgu" },
  { label: "Politique de confidentialité", path: "/confidentialite" },
  { label: "Droit de rétractation", path: "/retractation" },
];

export function renderFaq(entries: LlmsFaqEntry[], headingLevel: "##" | "###" = "###"): string[] {
  const lines: string[] = [];
  for (const { question, answer } of entries) {
    lines.push(`${headingLevel} ${question}`);
    lines.push("");
    lines.push(answer);
    lines.push("");
  }
  return lines;
}
