/**
 * Les avantages Premium : source UNIQUE du texte, rendue par `AvantagesPremium`
 * (components/premium/avantages-premium.tsx), sur /abonnement seulement.
 *
 * Trajet de conversion s21 (19/10) : étalon A choisi par Thomas, mot pour mot
 * (`docs/copy/conversion-s21/textes-trajet-v1.md` §1.2). 3 lignes au lancement ; la 4e (lettre,
 * formulation @legal avec l'opt-in) seulement quand `LETTRE_HEBDO_PROMESSE` est vrai.
 * Les favoris sortent de la liste : ils vivent dans le tableau Gratuit / Premium.
 * Tour 3 (textes-trajet-v3 E01) : l'avantage 1 porte une scène (« du boulot au rencard » : catégories
 * Boulot & Collègues, Couple & Dating) ; les unités restent dites par le tableau.
 */
import { PARCOURS_COUNT } from "@/config/premium";

export const AVANTAGES_PREMIUM: readonly [string, string, string] = [
  "Tout le catalogue, du boulot au rencard",
  `Les ${PARCOURS_COUNT} parcours, de la première à la dernière étape`,
  // Finition du tour 3 : dit ce qu'est un carnet ; lien vers « Le carnet, en vrai » (`ANCRE_CARNET_VENTE`).
  "Chaque mois, un carnet de situations et leurs répliques",
];

/** Ancre du bloc « Le carnet, en vrai » de /abonnement, cible de l'avantage 3. */
export const ANCRE_CARNET_VENTE = "le-carnet-en-vrai";
/** Rang de l'avantage du carnet (lien vers `ANCRE_CARNET_VENTE`). */
export const RANG_AVANTAGE_CARNET = 2;

/** 4e avantage, seulement avec l'envoi hebdomadaire réel. */
export const AVANTAGE_LETTRE = "Une lettre par e-mail chaque semaine, si tu la veux.";

export function avantagesPremium(lettre: boolean): readonly string[] {
  return lettre ? [...AVANTAGES_PREMIUM, AVANTAGE_LETTRE] : AVANTAGES_PREMIUM;
}
