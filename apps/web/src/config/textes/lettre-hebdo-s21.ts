/**
 * Textes de la lettre de la semaine (hebdomadaire Premium, s21, 19/10).
 *
 * Deux sources, jamais mélangées :
 *  - (L) avis @legal `docs/legal/lettre-hebdo-premium-s21.md` : textes EXACTS, mot pour
 *    mot (ligne §2.2, pied §2.3, page d'arrêt §3, CGU §4.1, confidentialité §4.2, fin de
 *    Premium §6.1, suppression §6.3), tels que mis en cohérence au §9 (s22, inscription
 *    d'office : plus de case ni de proposition). Les mentions (O) de l'avis ne doivent pas
 *    disparaître. Toute reformulation repasse l'aveugle (règle d'or).
 *  - (S) spec `docs/product/lettre-hebdo-premium-s21.md` : PROPOSITIONS non relues
 *    (états d'enregistrement, statut du profil, gabarit). À passer à l'aveugle (P3
 *    @copywriter) avant l'ouverture des inscriptions ; le gabarit est bloqué tant
 *    qu'il n'est pas validé (`GABARIT_HEBDO.valide`).
 * Rien de ce fichier n'est visible ni envoyé tant que les interrupteurs
 * `LETTRE_HEBDO_*` sont fermés (`config/lettre.ts`).
 * Zéro tiret cadratin (test `lettre-hebdo-textes-s21.test.ts`). Insécables posées au rendu.
 */
import { QUESTION_EQUIPE_OUVERTE } from "@/config/question-equipe";
import { LETTRE_MENTION_EDITEUR_NUMERO } from "@/config/lettre";
import { LETTRE_CONTACT } from "@/config/textes/lettre-s21";

const sansBarre = (baseUrl: string) => baseUrl.replace(/\/$/, "");

/**
 * s22 (inscription d'office, décision de Thomas du 25/10) : libellé du réglage du profil, activé par
 * défaut (désactiver = arrêt, réactiver = reprise). L'ancienne case (texte `lettre-hebdo-premium-v1`)
 * est supprimée : aucune ligne n'a jamais été enregistrée sous ce texte en production (vérifié le 25/10).
 */
export const LETTRE_HEBDO_REGLAGE = "Je reçois la lettre de la semaine";

/**
 * s22 (relecture à l'aveugle B1) : ligne du retour de paiement, SELON L'ÉTAT du compte (chaque variante
 * vraie pour qui la lit ; état illisible : aucune ligne).
 *  - `recoit` : Premium sans arrêt explicite ni opposition ;
 *  - `arretee` : arrêt explicite antérieur (il survit au réabonnement) ;
 *  - `opposition` : `User.emailOptOut` (même texte que le profil).
 */
export const LETTRE_HEBDO_INFO_PAIEMENT = {
  recoit: "Chaque jeudi, la lettre de la semaine arrive dans ta boîte : elle est incluse dans ton abonnement. Tu peux l'arrêter en un clic, depuis chaque lettre ou ton profil.",
  arretee: "Ta lettre de la semaine reste arrêtée, comme tu l'avais demandé. Tu peux la reprendre depuis ton profil.",
  opposition:
    "Tu nous as demandé de ne plus recevoir nos e-mails, hors ceux de ton compte et de ton abonnement : la lettre de la semaine ne t'est donc pas envoyée. Pour la recevoir, écris-nous à contact@deviens-marrant.fr.",
} as const;
export type EtatInfoPaiement = keyof typeof LETTRE_HEBDO_INFO_PAIEMENT;

/**
 * Ligne sous le réglage du profil (relecture à l'aveugle B2 : vraie réglage activé ou désactivé).
 * « Confidentialité » est un lien vers `/confidentialite#lettre` (O).
 */
export const LETTRE_HEBDO_LIGNE_REGLAGE = {
  avantLien: (email: string) =>
    `Incluse dans ton abonnement, elle part chaque jeudi à ${email} tant que ce réglage est activé. Si tu reçois aussi la lettre du mois, elle est en pause pendant ce temps, puis reprend quand tu arrêtes celle-ci. L'éditeur du site, deviens-marrant SAS, est responsable de l'usage de ton adresse pour cette lettre. Détails et droits : `,
  lien: "Confidentialité",
  apresLien: ".",
};

/** (S §5 H1, H2) États du réglage du profil. */
export const LETTRE_HEBDO_UI = {
  titre: "La lettre de la semaine",
  enregistrement: "Enregistrement…",
  succesActivation: (email: string) =>
    `C'est noté. Tu la recevras chaque jeudi, à ${email}. Tu peux l'arrêter ici ou depuis chaque lettre, en un clic.`,
  succesArret: "C'est arrêté. Ton abonnement continue.",
  erreurProfil: "L'enregistrement n'a pas abouti, et c'est de notre côté. Le réglage est resté dans son état précédent.",
  /** « Ta session a expiré. Reconnecte-toi pour régler la lettre. », « Reconnecte-toi » en lien. */
  sessionExpiree: { avant: "Ta session a expiré. ", lien: "Reconnecte-toi", apres: " pour régler la lettre." },
  /** s22 : opposition globale (`User.emailOptOut`) : aucune lettre ne part, quel que soit le réglage. */
  opposition: LETTRE_HEBDO_INFO_PAIEMENT.opposition,
  /** (L §6.1) remplace la phrase de la spec. */
  finPrevue: (date: string) => `Elle s'arrêtera avec ton accès Premium le ${date}.`,
} as const;

/** (L §3) Page d'arrêt `/lettre/premium/arreter`. */
export const LETTRE_HEBDO_ARRET = {
  metaTitre: "Arrêter la lettre de la semaine",
  titre: "Arrêter la lettre de la semaine ?",
  defaut:
    "Tu ne recevras plus la lettre de la semaine. Cet arrêt ne change rien à ton abonnement Premium. Les e-mails de ton compte et de ton abonnement (facture, sécurité, rappel avant un renouvellement annuel) continuent : ils sont obligatoires. Si tu es inscrit à la lettre du mois, elle reprend.",
  bouton: "Arrêter la lettre",
  enCours: "Arrêt en cours…",
  succes:
    "C'est arrêté. Tu ne recevras plus la lettre de la semaine. Cet arrêt ne change rien à ton abonnement. Si tu es inscrit à la lettre du mois, elle reprend. Tant que tu es abonné Premium, tu peux reprendre la lettre de la semaine depuis ton profil.",
  dejaArretee: "La lettre de la semaine est déjà arrêtée. Si tu es abonné Premium, tu peux la reprendre depuis ton profil.",
  lienInconnu:
    "Ce lien ne fonctionne plus. Si tu es abonné Premium, tu peux régler la lettre depuis ton profil. Sinon, écris-nous à contact@deviens-marrant.fr.",
  erreur: "L'arrêt n'a pas abouti, et c'est de notre côté. Réessaie dans un instant, ou écris-nous à contact@deviens-marrant.fr.",
} as const;

/**
 * (s22) Ligne « Ta question à l'équipe » de chaque numéro, texte retouché validé par la
 * relecture à l'aveugle (`docs/reviews/review-lettre-hebdo-w45-w46-s22.md`, T4). Posée par le
 * code à l'envoi, entre le texte préparé et le pied légal : hors empreinte d'approbation (ouvrir
 * ou fermer le service n'annule aucune approbation) et hors décompte de longueur. Affichée
 * seulement si `QUESTION_EQUIPE_OUVERTE` (jamais de promesse d'une fonction absente).
 */
export const LIGNE_QUESTION_EQUIPE_HEBDO =
  // Relecture finale s22 P3-4 : URL du profil en fin de ligne (e-mail en texte seul, lien cliquable, comme les liens des numéros).
  "Une situation te laisse sans réplique ? Pose ta question à l'équipe depuis ton profil : en général, réponse sous 1 à 2 jours ouvrés. https://deviens-marrant.fr/profil";

/** Bloc de la ligne « Ta question à l'équipe » (ligne vide + ligne), ou rien si le service est fermé. */
export function ligneQuestionEquipeHebdo(ouverte: boolean = QUESTION_EQUIPE_OUVERTE): string {
  return ouverte ? `\n\n${LIGNE_QUESTION_EQUIPE_HEBDO}` : "";
}

/** (L §2.3) Pied de chaque numéro, texte seul. */
export function piedNumeroHebdo(lienArret: string, baseUrl: string): string {
  const base = sansBarre(baseUrl);
  return [
    "",
    "--",
    // s22 (inscription d'office) : le pied ne dit plus « tu as choisi de la recevoir ». Hors empreinte d'approbation.
    "Tu reçois cette lettre parce qu'elle est incluse dans ton abonnement Premium.",
    `Éditeur : ${LETTRE_MENTION_EDITEUR_NUMERO}. Contact : ${LETTRE_CONTACT}.`,
    `Arrêter cette lettre en un clic (cela ne change rien à ton abonnement) : ${lienArret}`,
    `Confidentialité : ${base}/confidentialite#lettre`,
    `Mentions légales : ${base}/mentions-legales`,
  ].join("\n");
}

/**
 * (S §2.2) Gabarit d'un numéro. Libellés des blocs repris de la fiche du carnet
 * (`components/carnet/carnet-fiche-card.tsx` : « On te dit », « Tu réponds »,
 * « Pourquoi ça marche », « Si ça se tend », « À toi de jouer »). Salut, signature,
 * pré-en-tête et ligne du carnet : gabarit figé le 25/10 (s22, décision de Thomas).
 * `valide: true` : le marqueur `[À COMPLÉTER` du gabarit ne bloque plus ; chaque numéro reste
 * soumis à l'approbation de Thomas pour son contenu exact (`approbation-hebdo.ts`).
 */
export const GABARIT_HEBDO = {
  valide: true,
  preEntete: "La scène de la semaine, la réplique et l'exercice.",
  salut: "Salut,",
  onTeDit: "On te dit",
  reponse: "Tu réponds",
  pourquoi: "Pourquoi ça marche",
  siTendu: "Si ça se tend",
  exercice: "À toi de jouer",
  pont: "Pour prolonger",
  carnet: "Toutes les fiches du mois, dans ton carnet",
  fin: "À la semaine prochaine,",
  signature: "L'Équipe Deviens Marrant",
};
export type GabaritHebdo = typeof GABARIT_HEBDO;

/**
 * (L §4.1) CGU, article 10 « La lettre » : trois ajouts, à la suite du paragraphe existant.
 * s22 (inscription d'office) : 1er ajout mis en cohérence au minimum (plus de case ; exception de
 * l'opposition, relecture à l'aveugle B5).
 */
export const CGU_LETTRE_HEBDO = [
  "La lettre de la semaine est incluse dans l'abonnement Premium : tu la reçois sans rien faire, sauf si tu nous as demandé de ne plus recevoir nos e-mails, et tu peux l'arrêter en un clic, dans chaque lettre ou depuis ton profil, sans résilier. Elle est envoyée chaque semaine, le jeudi, à l'adresse e-mail de ton compte, tant que ton accès Premium est actif. Elle reprend des contenus de Premium (une scène du carnet, la réplique et l'exercice) et ne contient aucune offre commerciale. Elle s'arrête quand ton accès Premium prend fin : les numéros déjà reçus restent dans ta boîte. Si tu te réabonnes, elle reprend, sauf si tu l'avais arrêtée : ton arrêt reste valable, et tu peux la reprendre depuis ton profil.",
  "Tant que tu reçois la lettre de la semaine, la lettre du mois est mise en pause. Elle reprend quand tu arrêtes la lettre de la semaine ou quand ton abonnement prend fin, si tu y es toujours inscrit.",
  "Un numéro peut être décalé ou sauté une semaine, par exemple après un incident technique. Pour un numéro isolé, aucun numéro de remplacement ni aucune compensation ne sont dus : la lettre est un plus de ton abonnement, et ton accès à Premium reste entier. Si la lettre devait s'arrêter durablement ou changer en profondeur, on te le dit par e-mail, et tu peux résilier quand tu veux. Cela ne te prive pas des droits que la loi te garantit.",
] as const;

/**
 * (L §4.2) Confidentialité, section « 8. La lettre » et partie 7. s22 : mise en cohérence minimale
 * (plus de case ; relecture à l'aveugle B3, B4, M2, M3, M4).
 */
export const CONFIDENTIALITE_LETTRE_HEBDO = {
  donnees:
    "Lettre de la semaine (abonnés Premium, incluse dans l'abonnement) : la date du premier envoi, puis, si tu l'arrêtes ou la reprends, la date et la façon dont tu l'as fait (lien dans l'e-mail, profil, ou demande à contact@deviens-marrant.fr). On garde aussi un code personnel qui sert au lien d'arrêt, et un journal des envois (quel numéro, à quelle adresse). La lettre est envoyée à l'adresse e-mail de ton compte. Aucune adresse IP n'est gardée pour cette lettre.",
  finalite:
    "T'envoyer la lettre de la semaine : exécution du contrat, car elle est incluse dans ton abonnement Premium. Tu peux l'arrêter en un clic à tout moment : plus aucun numéro ne t'est envoyé.",
  destinataires:
    "Lettre de la semaine : l'envoi passe par notre prestataire Resend (voir la partie 4). L'équipe voit, dans son espace d'administration, si ta lettre est active ou arrêtée, et depuis quand.",
  duree:
    "Lettre de la semaine : ton choix est gardé tant que ton compte existe. Si tu l'arrêtes, on garde la date et la façon dont tu l'as fait, pour respecter ton arrêt, même si tu te réabonnes plus tard. Si ton abonnement prend fin, on garde la date de fin : si tu te réabonnes, la lettre reprend. Le journal des envois est gardé 12 mois. Quand tu supprimes ton compte, ton choix, sa trace et le journal des envois à ton adresse sont effacés tout de suite.",
  droits:
    "Tu peux arrêter la lettre de la semaine à tout moment, avec le lien en bas de chaque numéro ou depuis ton profil, sans toucher à ton abonnement. Les numéros déjà reçus restent dans ta boîte.",
} as const;

/** (L §6.1, §6.3) Phrases facultatives de fin d'abonnement et de suppression de compte. */
export const LETTRE_HEBDO_FIN_PREMIUM = "La lettre de la semaine s'arrête avec ton accès Premium. Si tu es inscrit à la lettre du mois, elle reprend.";
export const LETTRE_HEBDO_SUPPRESSION =
  "Sont aussi effacés : ton choix pour la lettre de la semaine, le journal de ses envois, et ton inscription à la lettre du mois faite avec l'adresse de ton compte.";
