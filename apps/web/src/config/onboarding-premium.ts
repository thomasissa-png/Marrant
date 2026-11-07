/**
 * Onboarding Premium s23 : E0 (bienvenue), E1 (J5) et E2 (J21).
 * Textes approuvés par Thomas le 07/11/2026 (`docs/copy/onboarding-premium-s23-emails.md`
 * v4.2, commit ad24ba7) : repris mot pour mot dans `config/textes/paiement.ts` (E0) et
 * `config/textes/onboarding-premium.ts` (E1, E2). Toute modification fait perdre l'approbation.
 * Cadre @legal : `docs/legal/onboarding-e1-resilies-s23.md` (C1 à C8).
 *
 * INTERRUPTEUR FERMÉ : la production reste strictement inchangée (bienvenue actuel envoyé
 * comme aujourd'hui, aucun E1 ni E2, aucune écriture de journal, lien d'arrêt en 404).
 * Ouverture : go écrit de Thomas, C8 (phrase d'information dans la confidentialité) en ligne
 * AVANT, et `UNSUBSCRIBE_HMAC_SECRET` présent (sans lui, rien ne part).
 */
import { QUESTION_EQUIPE_DESTINATAIRE } from "@/config/question-equipe";

export const ONBOARDING_PREMIUM_OUVERT: boolean = false;

/** Jours calendaires de Paris depuis la souscription (J0 = jour du bienvenue). */
export const ONBOARDING_JOURS = { E1: 5, E2: 21 } as const;
export type EtapeOnboarding = keyof typeof ONBOARDING_JOURS;

/**
 * Glissement au premier jour libre : l'e-mail peut partir du jour prévu jusqu'à 6 jours après
 * (7 jours au total). Au-delà, il n'est pas envoyé (journalisé `aucun-jour-libre`).
 */
export const ONBOARDING_FENETRE_JOURS = 7;

/** Heure de Paris du passage (même tâche que le rappel des parcours, juste après lui). */
export const ONBOARDING_HEURE_PARIS = 9;

/** Réponses à E1 et E2 : alex@ (« Réponds à cet e-mail, on lit tout »). */
export const ONBOARDING_REPLY_TO = QUESTION_EQUIPE_DESTINATAIRE;

/** Provenance des liens vers les parcours (`PARCOURS_SRC`), sans identifiant (C6). */
export const ONBOARDING_SRC = "onboarding-premium";

/** Chemin du lien d'arrêt « un clic, sans connexion ». */
export const ONBOARDING_ARRET_CHEMIN = "/api/onboarding-premium/arret";
