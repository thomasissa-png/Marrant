/**
 * Les avantages Premium : source UNIQUE du texte, rendue par `AvantagesPremium`
 * (components/premium/avantages-premium.tsx), sur /abonnement seulement.
 *
 * Trajet de conversion s21 (19/10) : étalon A choisi par Thomas, mot pour mot
 * (`docs/copy/conversion-s21/textes-trajet-v1.md` §1.2). 3 lignes au lancement ; la 4e (lettre,
 * formulation @legal avec l'opt-in) seulement quand `LETTRE_HEBDO_PROMESSE` est vrai.
 * Les favoris sortent de la liste : ils vivent dans le tableau Gratuit / Premium.
 */
import { PARCOURS_COUNT } from "@/config/premium";

export const AVANTAGES_PREMIUM: readonly [string, string, string] = [
  "Tout le catalogue : vannes, conseils, vidéos",
  `Les ${PARCOURS_COUNT} parcours, de la première à la dernière étape`,
  "Un nouveau carnet de répartie chaque mois",
];

/** 4e avantage, seulement avec l'envoi hebdomadaire réel. */
export const AVANTAGE_LETTRE = "Une lettre par e-mail chaque semaine, si tu la veux.";

export function avantagesPremium(lettre: boolean): readonly string[] {
  return lettre ? [...AVANTAGES_PREMIUM, AVANTAGE_LETTRE] : AVANTAGES_PREMIUM;
}
