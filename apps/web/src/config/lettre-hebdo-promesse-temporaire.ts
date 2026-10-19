/**
 * TEMPORAIRE (branche claude/marrant-conversion, s21) : drapeau de la promesse « lettre par e-mail
 * chaque semaine » sur /abonnement (4e avantage, ligne du tableau, phrase de bienvenue).
 *
 * La vraie constante `LETTRE_HEBDO_PROMESSE` est créée par la branche claude/marrant-lettre-hebdo.
 * À la fusion, UN SEUL des deux fichiers reste : supprimer celui-ci et faire pointer les imports
 * (`grep -rn "lettre-hebdo-promesse-temporaire" apps/web/src`) vers la constante de la lettre.
 *
 * `false` tant que l'envoi hebdomadaire réel n'existe pas (premier envoi prévu le 12/11/2026,
 * `docs/copy/conversion-s21/textes-trajet-v1.md` §1.6) : aucune ligne qui nomme la lettre ne s'affiche.
 */
export const LETTRE_HEBDO_PROMESSE: boolean = false;
