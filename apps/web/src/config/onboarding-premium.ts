/**
 * Onboarding Premium s23 : E0 (bienvenue), E1 (J5), E1b (J12) et E2 (J21).
 * E1b (« pose-nous ta question ») approuvé par Thomas le 08/11/2026 (« go », commit 3586113),
 * repris mot pour mot dans `config/textes/onboarding-premium.ts`.
 * Textes approuvés par Thomas le 07/11/2026 (`docs/copy/onboarding-premium-s23-emails.md`
 * v4.2, commit ad24ba7) : repris mot pour mot dans `config/textes/paiement.ts` (E0) et
 * `config/textes/onboarding-premium.ts` (E1, E2). Toute modification fait perdre l'approbation.
 * Cadre @legal : `docs/legal/onboarding-e1-resilies-s23.md` (C1 à C8).
 *
 * INTERRUPTEUR OUVERT le 08/11/2026 (go écrit de Thomas ; `UNSUBSCRIBE_HMAC_SECRET` présent en
 * production, sans lui rien ne part). Seules les souscriptions postérieures à l'ouverture reçoivent
 * E1, E1b et E2 : la tâche ne lit que les ancres J0 (`onboarding-premium:E0:<userId>`), écrites
 * par le bienvenue s23, donc jamais pour un abonné antérieur. Retour arrière : repasser à `false`
 * (bienvenue actuel, aucun E1, E1b ni E2, aucune écriture de journal ; le lien d'arrêt reste actif).
 * C8 (puce de la confidentialité, partie 3) est publiée par ce même interrupteur. Suivi Resend :
 * E1, E1b et E2 partent en texte seul, sans option de suivi (le SDK n'en a pas par envoi : réglage du
 * domaine, open/click tracking vérifiés désactivés sur deviens-marrant.fr le 08/11/2026).
 */
import { QUESTION_EQUIPE_DESTINATAIRE } from "@/config/question-equipe";

export const ONBOARDING_PREMIUM_OUVERT: boolean = true;

/** Jours calendaires de Paris depuis la souscription (J0 = jour du bienvenue). */
export const ONBOARDING_JOURS = { E1: 5, E1b: 12, E2: 21 } as const;
export type EtapeOnboarding = keyof typeof ONBOARDING_JOURS;

/**
 * Glissement au premier jour libre : l'e-mail peut partir du jour prévu jusqu'à 6 jours après
 * (7 jours au total). Au-delà, il n'est pas envoyé (journalisé `aucun-jour-libre`).
 */
export const ONBOARDING_FENETRE_JOURS = 7;

/**
 * E1b : glissement « au plus tard J19 » (jamais la veille ni le jour d'E2, au moins un jour libre
 * entre les deux) : fenêtre propre, de J12 à J19 inclus. Au-delà : `saute:aucun-jour-libre`.
 */
export const ONBOARDING_E1B_AU_PLUS_TARD = 19;

/** Heure de Paris du passage (même tâche que le rappel des parcours, juste après lui). */
export const ONBOARDING_HEURE_PARIS = 9;

/** Réponses à E1, E1b et E2 : alex@ (« Réponds à cet e-mail, on lit tout »). */
export const ONBOARDING_REPLY_TO = QUESTION_EQUIPE_DESTINATAIRE;

/** Provenance des liens vers les parcours (`PARCOURS_SRC`), sans identifiant (C6). */
export const ONBOARDING_SRC = "onboarding-premium";

/** Chemin du lien d'arrêt « un clic, sans connexion ». */
export const ONBOARDING_ARRET_CHEMIN = "/api/onboarding-premium/arret";

/**
 * Date de la puce C8 de la confidentialité (« Dernière mise à jour », prise en compte seulement
 * interrupteur ouvert) : date d'ouverture, 8 novembre 2026.
 */
export const ONBOARDING_DATE_TEXTES = "8 novembre 2026";
