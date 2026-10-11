import {
  parcoursWeeks,
  PREMIUM_ANNUAL_EQUIVALENT_LABEL,
  PREMIUM_ANNUAL_PRICE_LABEL,
  PREMIUM_ANNUAL_SAVINGS_LABEL,
} from "@/config/premium";
import { FAQ_REGULARITE, FAQ_SERIE_XP } from "@/config/textes/entrees-parcours";

const PRICE_FAQ_QUESTION = "2,99 €/mois, c’est vraiment tout ? Pas de frais cachés ?";

export const faqs = [
  {
    question: "Est-ce que je peux vraiment apprendre à être drôle ?",
    answer:
      "Oui. L\u2019humour n\u2019est pas un talent inné, c\u2019est une compétence qui se travaille. La science va dans ce sens : Crawford et Caltabiano (2011, Journal of Positive Psychology) ont montré qu\u2019un programme d\u2019humour de 8 semaines améliorait significativement le bien-être émotionnel. Comme un muscle, plus tu pratiques, plus tu progresses. Nos membres gagnent en moyenne 50 XP par semaine et voient une vraie différence en quelques jours.",
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
      `Avec une pratique quotidienne de 5-10 minutes, tu peux voir une vraie différence en 2 à 4 semaines. Le Parcours Machine à Café dure ${parcoursWeeks("machine-a-cafe")} semaines, le Parcours Répartie ${parcoursWeeks("repartie")} semaines, et le Parcours Confiance ${parcoursWeeks("confiance")} semaines. ${FAQ_REGULARITE}`,
  },
  {
    question: "C\u2019est quoi la répartie exactement ?",
    answer:
      "La répartie, c\u2019est la capacité à répondre rapidement et avec à-propos, souvent avec humour, à une remarque ou une situation. Elle repose sur des techniques précises comme l\u2019accusé de réception, le rebond sur mot-clé, ou le retournement. Ces techniques s\u2019apprennent et se perfectionnent avec la pratique.",
  },
  {
    question: "Comment avoir de la répartie sans être méchant ?",
    answer:
      "La vraie répartie, ce n\u2019est pas écraser l\u2019autre. C\u2019est créer un moment drôle et léger, même quand la remarque de départ était piquante. L\u2019objectif, c\u2019est que tout le monde rie, y compris la personne qui t\u2019a lancé la remarque. Des techniques comme l\u2019autodérision ou le redirect absurde permettent de désamorcer sans blesser.",
  },
  {
    question: PRICE_FAQ_QUESTION,
    answer:
      "C’est le prix, point. Pas de frais cachés, pas de reconduction surprise. Tu annules en 1 clic depuis ton profil, sans avoir à envoyer un email ou appeler un numéro. Paiement sécurisé par Stripe.",
  },
  {
    question:
      "C\u2019est quoi la différence avec juste regarder des vidéos YouTube ?",
    // s17 (PM-12, UX-04) : série et XP décrites telles qu'elles fonctionnent (texte provisoire).
    answer:
      `YouTube te montre des humoristes. Nous, on t’apprend leurs techniques. Chaque vidéo est analysée avec la technique utilisée (timing, autodérision, observation...), chaque conseil vient avec un exercice concret. ${FAQ_SERIE_XP} C’est la différence entre regarder du tennis et prendre des cours de tennis.`,
  },
  {
    question: "Comment devenir marrant si je n\u2019ai pas le \u00AB sens de l\u2019humour \u00BB ?",
    answer:
      "Tout le monde a un sens de l\u2019humour : il est peut-être juste en sommeil. Les personnes qui se décrivent comme \u00AB pas drôles \u00BB pensent souvent des choses drôles mais ne les disent pas par peur du jugement. Nos exercices t\u2019aident à libérer cet humour intérieur progressivement, en commençant par des situations à faible enjeu.",
  },
];

/** Réponse prix quand la formule annuelle est disponible (prix Stripe annuel configuré). */
const ANNUAL_PRICE_FAQ_ANSWER = `C’est le prix, point. Tu préfères payer à l’année ? C’est ${PREMIUM_ANNUAL_PRICE_LABEL} en une fois, ${PREMIUM_ANNUAL_EQUIVALENT_LABEL} (${PREMIUM_ANNUAL_SAVINGS_LABEL}). Pas de frais cachés. L’abonnement se renouvelle à la fin de chaque période (mois ou année) tant que tu ne l’annules pas, et tu annules en 1 clic depuis ton profil, sans avoir à envoyer un email ou appeler un numéro. Paiement sécurisé par Stripe.`;

/**
 * FAQ Premium selon la disponibilité de l'annuel, lue côté serveur
 * (`isAnnualPlanAvailable()`). Sans annuel : `faqs` à l'identique.
 */
export function getPremiumFaqs(annualAvailable: boolean): typeof faqs {
  if (!annualAvailable) return faqs;
  return faqs.map((faq) =>
    faq.question === PRICE_FAQ_QUESTION ? { ...faq, answer: ANNUAL_PRICE_FAQ_ANSWER } : faq,
  );
}
