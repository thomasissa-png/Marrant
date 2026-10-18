/**
 * Lettre mensuelle gratuite (s21, spec UX `docs/ux/lettre-inscription-s21.md`).
 *
 * Deux interrupteurs indépendants (intégration s21, 17/10 : l'ancien
 * `LETTRE_OUVERTE` commandait à la fois le formulaire et les envois ; décision
 * de Thomas : inscriptions ouvertes dès la mise en ligne, avant le n°1).
 *
 * `LETTRE_INSCRIPTIONS_OUVERTES` (ce qui se voit) :
 *  - `false` : composant d'inscription absent des 3 emplacements, lien de pied
 *    de page absent, `/lettre` et `/lettre/confirmer` en 404 (sauf la
 *    désinscription, toujours possible), `POST /api/newsletter` en 410,
 *    confirmation en 404, aucun e-mail de reconfirmation.
 *  - `true` : formulaire, page `/lettre`, double opt-in et reconfirmation actifs.
 *
 * `LETTRE_ENVOIS_OUVERTS` (ce qui part) : la tâche mensuelle n'envoie un numéro
 * que si cet interrupteur est ouvert ET que sa date d'envoi est passée (premier
 * jeudi du mois à 8 h, Paris, jamais avant la date plancher) ET qu'aucun
 * marqueur `[À COMPLÉTER` n'y reste. Les dates restent donc le vrai verrou ;
 * l'interrupteur sert d'arrêt d'urgence (le passer à `false` stoppe tout envoi
 * sans fermer les inscriptions).
 *
 * La désinscription et l'entretien de la liste (purge des non confirmés à 7 j,
 * traces à 3 ans) fonctionnent quel que soit l'état des interrupteurs.
 *
 * Module sans dépendance : importable côté client.
 */
export const LETTRE_INSCRIPTIONS_OUVERTES = true;
export const LETTRE_ENVOIS_OUVERTS = true;

/**
 * Marqueur de trou à combler : tant qu'il figure dans un numéro tel qu'il
 * partirait (objet, corps, pied), le numéro n'est PAS envoyé (`envoi.ts`,
 * `numeroEnvoyable`). Test : `lettre-numeros-s21.test.ts`.
 */
export const MARQUEUR_A_COMPLETER = "[À COMPLÉTER";

/**
 * Mention d'éditeur du pied des NUMÉROS (`docs/copy/lettre-mensuelle-s21/numeros-1-a-6.md`
 * §1.5, `{{mention_editeur}}`). Décision de Thomas du 17/10 : « deviens-marrant SAS »,
 * identique à la mention sous le bouton. Le garde-fou `MARQUEUR_A_COMPLETER` reste
 * actif : un marqueur réintroduit ici bloquerait de nouveau l'envoi.
 */
export const LETTRE_MENTION_EDITEUR_NUMERO: string = "deviens-marrant SAS";

/**
 * Emplacements du composant (spec §1). `page` = /lettre. `parcours` = fin de l'étape 1 d'un
 * parcours (visiteur), ligne repliée sous la REASS (concision v5, textes-v5-b §6).
 */
export const LETTRE_EMPLACEMENTS = ["article", "quiz", "page", "parcours"] as const;
export type LettreEmplacement = (typeof LETTRE_EMPLACEMENTS)[number];

/**
 * Version du consentement. Toute modification du texte de la case
 * (`TEXTES_LETTRE.formulaire.case`) = nouvelle version (spec §2.3), l'ancien
 * texte reste dans `CONSENTEMENTS_LETTRE_ARCHIVES` (preuve des consentements
 * déjà donnés).
 *  - `lettre-mensuelle-v1` : texte « v2 » de @legal L1 (jamais présenté au
 *    public : interrupteur resté fermé).
 *  - `lettre-mensuelle-v2` : texte validé à l'aveugle le 17/10 (s21, duel 3 B),
 *    réserve @legal R1.
 * Le serveur stocke `<version> : <texte exact>`, jamais le texte du navigateur.
 */
export const LETTRE_CONSENT_VERSION = "lettre-mensuelle-v2";

/**
 * Lien « Confidentialité » sous le bouton : section lettre de la page
 * Confidentialité (réserve @legal R2). Section « 8. La lettre » publiée avec les
 * inscriptions (intégration s21, B7), test `dashboard/lettre-mentions-s21`.
 */
export const LETTRE_CONFIDENTIALITE_ANCRE = "lettre";
export const LETTRE_CONFIDENTIALITE_HREF = `/confidentialite#${LETTRE_CONFIDENTIALITE_ANCRE}`;

/*
 * Durées et plafonds (décisions @legal s21, `docs/legal/lettre-et-questions-s21.md` L4).
 * [HYPOTHÈSES à valider par un avocat, A3] : valeurs centralisées ici, jamais ailleurs.
 */
/** Lien de confirmation valable 7 jours ; au-delà, l'inscrit non confirmé est effacé. */
export const LETTRE_PENDING_JOURS = 7;

/**
 * Drapeau d'appareil après un envoi réussi (spec §2.4, état « déjà inscrit ») :
 * « vérifie ta boîte » n'a plus de sens après l'expiration du lien et
 * l'effacement de l'adresse non confirmée, d'où la même durée.
 */
export const LETTRE_STORAGE_KEY = "dm-lettre";
export const LETTRE_DRAPEAU_JOURS = LETTRE_PENDING_JOURS;

/** Délai minimal entre deux e-mails de confirmation à la même adresse (bouton « Renvoyer »). */
export const LETTRE_RENVOI_SECONDES = 60;

/** E-mails de confirmation au plus par adresse et par inscription. */
export const LETTRE_CONFIRMATIONS_MAX = 2;
/** Un e-mail « déjà dans la liste » au plus par adresse sur cette durée (anti-harcèlement, @legal duel 11). */
export const LETTRE_DEJA_INSCRIT_HEURES = 24;
/** Reconfirmation demandée par e-mail 24 mois après la dernière confirmation. */
export const LETTRE_RECONFIRMATION_MOIS = 24;
/** Sans clic sous 30 jours après la demande de reconfirmation : désinscription. */
export const LETTRE_RECONFIRMATION_DELAI_JOURS = 30;
/** Trace de désinscription (adresse, dates, version du consentement) gardée 3 ans. */
export const LETTRE_TRACE_DESINSCRIPTION_ANS = 3;

/** Délais côté navigateur (spec §2.4, état Envoi). */
export const LETTRE_ATTENTE_LONGUE_MS = 8_000;
export const LETTRE_ABANDON_MS = 15_000;

/** Envoi mensuel : destinataires traités au plus par passage du planificateur (15 min). */
export const LETTRE_LOT_PAR_PASSAGE = 200;
/** Essais au plus par destinataire et par numéro (échec Resend). */
export const LETTRE_ESSAIS_MAX = 3;

/** Valeur de `NewsletterSubscriber.source` (spec §7.2 point 11). */
export function lettreSource(emplacement: LettreEmplacement, slug?: string | null): string {
  if (emplacement === "article" && slug) return `article:${slug}`.slice(0, 190);
  return emplacement;
}

/** Emplacement relu depuis `source` (mesure `lettre-confirmee`, jamais depuis l'e-mail). */
export function emplacementDeSource(source: string | null | undefined): LettreEmplacement | null {
  if (!source) return null;
  const tete = source.split(":")[0];
  return (LETTRE_EMPLACEMENTS as readonly string[]).includes(tete) ? (tete as LettreEmplacement) : null;
}
