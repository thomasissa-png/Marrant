/**
 * Les 4 avantages Premium : source UNIQUE du texte, rendue par `AvantagesPremium`
 * (components/premium/avantages-premium.tsx) sur /abonnement et la carte Premium de
 * l'accueil (s21 concision, choix de Thomas du 18/10, règle 11 et étalon 6).
 *
 * [PROVISOIRE] texte actuel repris mot pour mot (liste du 03/10/2026, puces vraies
 * seulement) en attendant les 4 lignes de @copywriter (≤ 9 mots par ligne, 30 mots en
 * tout). Pour les brancher : remplacer `fort` et `suite` ci-dessous, rien d'autre.
 *
 * `fort` est rendu en gras, `suite` à la suite (espace ou ponctuation de tête compris).
 * `{compteurs}` dans une `suite` = « (X+ vannes, X+ conseils, X+ vidéos analysées) »,
 * lu en direct dans le catalogue (vide tant que les chiffres ne sont pas chargés).
 */
import {
  FREE_JOKE_LIMIT,
  FREE_TIP_LIMIT,
  FREE_VIDEO_LIMIT,
  PARCOURS_COUNT,
  PREMIUM_PARCOURS,
} from "@/config/premium";

export interface AvantagePremium {
  fort: string;
  suite: string;
}

/** Repère remplacé par les compteurs du catalogue (voir en-tête). */
export const AVANTAGES_COMPTEURS = "{compteurs}";

const LISTE_PARCOURS = PREMIUM_PARCOURS.map((p) => `${p.name} (${p.timePerWeek})`).join(", ");

export const AVANTAGES_PREMIUM: readonly [AvantagePremium, AvantagePremium, AvantagePremium, AvantagePremium] = [
  {
    fort: `Les ${PARCOURS_COUNT} parcours en entier`,
    suite: ` : ${LISTE_PARCOURS}. Chaque étape avec son conseil, ses vannes, ses vidéos et son quiz. La première étape de chaque parcours est offerte.`,
  },
  {
    fort: "Le carnet mensuel de situations de répartie",
    suite: " (nouveau chaque mois) : ce qu'on te dit, quoi répondre, pourquoi ça marche et quoi faire si ça se tend.",
  },
  {
    fort: "Tes favoris",
    suite: " : garde sous la main les vannes, conseils et vidéos à ressortir.",
  },
  {
    fort: "Les listes complètes",
    suite: `${AVANTAGES_COMPTEURS}, au lieu de ${FREE_JOKE_LIMIT} vannes, ${FREE_TIP_LIMIT} conseils et ${FREE_VIDEO_LIMIT} vidéos sans abonnement, avec le filtre par catégorie des vannes.`,
  },
];
