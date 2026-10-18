import { PARCOURS_MAX_WEEKS, PARCOURS_MIN_WEEKS, PREMIUM_PRICE_LABEL } from "@/config/premium";
import { FAQ_REGULARITE, FAQ_SERIE_XP } from "@/config/textes/entrees-parcours";

const PRICE_FAQ_QUESTION = `${PREMIUM_PRICE_LABEL}, c’est vraiment tout ? Pas de frais cachés ?`;

export const faqs = [
  {
    question: "Est-ce que je peux vraiment apprendre à être drôle ?",
    answer:
      "Oui. L\u2019humour n\u2019est pas un talent inné, c\u2019est une compétence qui se travaille. La science va dans ce sens : Crawford et Caltabiano (2011, Journal of Positive Psychology) ont montré qu\u2019un programme d\u2019humour de 8 semaines améliorait significativement le bien-être émotionnel. Comme un muscle, plus tu pratiques, plus tu progresses. Nos membres gagnent en moyenne 50 XP par semaine et sentent la différence au fil des semaines.",
  },
  {
    question: "Comment devenir drôle quand on est timide ou introverti ?",
    answer:
      "Surtout pour toi. La majorité de nos membres se décrivent comme introvertis au départ. Être timide est même un avantage : les gens ne s\u2019attendent pas à ce que tu sois drôle, donc l\u2019effet de surprise est doublé. Les parcours sont conçus pour progresser à ton rythme, sans pression, avec des exercices que tu peux pratiquer seul avant de les tester en groupe.",
  },
  {
    question: "Combien de temps faut-il pour devenir plus drôle ?",
    // s17 (UX-04) : dernière phrase, deux rythmes dits clairement (texte provisoire).
    answer:
      `Avec une pratique quotidienne, même courte, tu peux voir une vraie différence en 2 à 4 semaines. Nos parcours durent de ${PARCOURS_MIN_WEEKS} à ${PARCOURS_MAX_WEEKS} semaines, à toi de choisir celui qui colle à ta situation. ${FAQ_REGULARITE}`,
  },
  {
    question: "C\u2019est quoi la répartie exactement ?",
    answer:
      "La répartie, c\u2019est la capacité à répondre rapidement et avec à-propos, souvent avec humour, à une remarque ou une situation. Elle repose sur des techniques précises comme l\u2019accusé de réception, le rebond sur mot-clé, ou le retournement. Ces techniques s\u2019apprennent et se perfectionnent avec la pratique.",
  },
  {
    question: "Comment avoir de la répartie sans être méchant ?",
    answer:
      "La vraie répartie, ce n\u2019est pas écraser l\u2019autre. C\u2019est créer un moment drôle et léger, même quand la remarque de départ était piquante. L\u2019objectif, c\u2019est que tout le monde rie, y compris la personne qui t\u2019a lancé la remarque. Des techniques comme l\u2019autodérision ou le détour par l’absurde permettent de désamorcer sans blesser.",
  },
  {
    question: PRICE_FAQ_QUESTION,
    answer:
      // Concision v5 (textes-v5-c §3) : réponse mensuelle (accueil, et /abonnement sans annuel).
      "C’est le prix, point. Ça se renouvelle chaque mois, tant que tu ne résilies pas.",
  },
  {
    question:
      "C\u2019est quoi la différence avec juste regarder des vidéos YouTube ?",
    // s17 (PM-12, UX-04) : série et XP décrites telles qu'elles fonctionnent (texte provisoire).
    answer:
      `YouTube te montre des humoristes. Nous, on t’apprend leurs techniques. Chaque vidéo est analysée avec la technique utilisée (timing, autodérision, observation…), chaque conseil vient avec un exercice concret. ${FAQ_SERIE_XP} C’est la différence entre regarder du tennis et prendre des cours de tennis.`,
  },
  {
    question: "Comment devenir marrant si je n\u2019ai pas le \u00AB sens de l\u2019humour \u00BB ?",
    answer:
      "Tout le monde a un sens de l\u2019humour : il est peut-être juste en sommeil. Les personnes qui se décrivent comme \u00AB pas drôles \u00BB pensent souvent des choses drôles mais ne les disent pas par peur du jugement. Nos exercices t\u2019aident à libérer cet humour intérieur progressivement, en commençant par des situations à faible enjeu.",
  },
];

/** Réponse prix quand la formule annuelle est disponible (concision v5, textes-v5-c §3). */
const ANNUAL_PRICE_FAQ_ANSWER = "C’est le prix, point. Ça se renouvelle chaque mois ou chaque année, tant que tu ne résilies pas.";

/**
 * FAQ de vente (concision v5) : les 4 questions qui lèvent le plus de freins à l'achat, seules
 * affichées sur l'accueil et /abonnement (JSON-LD identique) : apprendre, timide, prix, YouTube.
 * Les 4 autres restent dans `faqs` (/parcours, SEO).
 */
const QUESTIONS_VENTE: readonly string[] = [
  "Est-ce que je peux vraiment apprendre à être drôle ?",
  "Comment devenir drôle quand on est timide ou introverti ?",
  PRICE_FAQ_QUESTION,
  "C’est quoi la différence avec juste regarder des vidéos YouTube ?",
];
export const FAQ_VENTE: typeof faqs = QUESTIONS_VENTE.map((q) => {
  const faq = faqs.find((f) => f.question === q);
  if (!faq) throw new Error(`FAQ de vente : question introuvable (${q})`);
  return faq;
});

/**
 * FAQ de vente de /abonnement selon la disponibilité de l'annuel, lue côté serveur
 * (`isAnnualPlanAvailable()`). Sans annuel : `FAQ_VENTE` à l'identique.
 */
export function getPremiumFaqs(annualAvailable: boolean): typeof faqs {
  if (!annualAvailable) return FAQ_VENTE;
  return FAQ_VENTE.map((faq) =>
    faq.question === PRICE_FAQ_QUESTION ? { ...faq, answer: ANNUAL_PRICE_FAQ_ANSWER } : faq,
  );
}
