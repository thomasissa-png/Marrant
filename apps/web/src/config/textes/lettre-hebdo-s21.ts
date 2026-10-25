/**
 * Textes de la lettre de la semaine (hebdomadaire Premium, s21, 19/10).
 *
 * Deux sources, jamais mélangées :
 *  - (L) avis @legal `docs/legal/lettre-hebdo-premium-s21.md` : textes EXACTS, mot pour
 *    mot (case §2.1, ligne §2.2, pied §2.3, page d'arrêt §3, CGU §4.1, confidentialité
 *    §4.2, fin de Premium §6.1, suppression §6.3, proposition §6.5). Les mentions (O) de
 *    l'avis ne doivent pas disparaître. Toute reformulation repasse l'aveugle (règle d'or).
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

/** (L §2.1) Texte de la case, identique au paiement et au profil, stocké sous `LETTRE_HEBDO_CONSENT_VERSION`. */
export const LETTRE_HEBDO_CASE =
  "Oui, je veux recevoir la lettre de la semaine, chaque jeudi : une scène du carnet, la réplique et l'exercice. Elle fait partie de mon abonnement et je peux l'arrêter en un clic, sans le résilier.";

/** (L §2.2) Ligne sous la case. « Confidentialité » est un lien vers `/confidentialite#lettre` (O). */
export const LETTRE_HEBDO_LIGNE_SOUS_CASE = {
  avantLien: (email: string) =>
    `La lettre de la semaine arrive à ${email}. Si tu reçois déjà la lettre du mois, elle est mise en pause tant que tu reçois celle de la semaine, puis reprend quand tu arrêtes. deviens-marrant SAS, l'éditeur du site, est responsable de l'usage de ton adresse pour cette lettre. Détails et droits : `,
  lien: "Confidentialité",
  apresLien: ".",
};

/** (S §5 H1, H2) États de la case : propositions de la spec, à relire à l'aveugle (P3). */
export const LETTRE_HEBDO_UI = {
  titre: "La lettre de la semaine",
  enregistrement: "Enregistrement…",
  succesActivation: (email: string) =>
    `C'est noté. Tu la recevras chaque jeudi, à ${email}. Tu peux l'arrêter à tout moment depuis ton profil.`,
  succesArret: "C'est arrêté. Ton abonnement continue.",
  erreurPaiement:
    "L'enregistrement n'a pas abouti, et c'est de notre côté. La case est décochée : réessaie dans un instant, ou règle-le depuis ton profil.",
  erreurProfil: "L'enregistrement n'a pas abouti, et c'est de notre côté. La case est restée dans son état précédent.",
  /** « Ta session a expiré. Reconnecte-toi pour régler la lettre. », « Reconnecte-toi » en lien. */
  sessionExpiree: { avant: "Ta session a expiré. ", lien: "Reconnecte-toi", apres: " pour régler la lettre." },
  pasActivee: "Pas activée",
  activeeDepuis: (date: string) => `Activée depuis le ${date}`,
  adresseNonVerifiee: "Confirme ton adresse e-mail pour recevoir la lettre",
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
  "Une situation te laisse sans réplique ? Pose ta question à l'équipe depuis ton profil : en général, réponse sous 1 à 2 jours ouvrés.";

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
    "Tu reçois cette lettre parce que tu es abonné Premium et que tu as choisi de la recevoir.",
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
 * pré-en-tête et ligne du carnet : propositions de la spec, NON validées.
 * `valide: false` : tout numéro est bloqué (marqueur `[À COMPLÉTER`) jusqu'au gel
 * du gabarit après relecture à l'aveugle (P3), même interrupteur ouvert.
 */
export const GABARIT_HEBDO = {
  valide: false,
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

/** (L §4.1) CGU, article 10 « La lettre » : trois ajouts, à la suite du paragraphe existant. */
export const CGU_LETTRE_HEBDO = [
  "La lettre de la semaine fait partie de l'abonnement Premium, mais elle est facultative : tu choisis de la recevoir (la case n'est jamais cochée d'avance, au paiement comme dans ton profil) et tu peux l'arrêter en un clic, sans résilier. Elle est envoyée chaque semaine, le jeudi, à l'adresse e-mail de ton compte, tant que ton accès Premium est actif. Elle reprend des contenus de Premium (une scène du carnet, la réplique et l'exercice) et ne contient aucune offre commerciale. Elle s'arrête quand ton accès Premium prend fin : les numéros déjà reçus restent dans ta boîte, et elle ne reprend pas toute seule si tu te réabonnes, tu la réactives toi-même.",
  "Tant que tu reçois la lettre de la semaine, la lettre du mois est mise en pause. Elle reprend quand tu arrêtes la lettre de la semaine ou quand ton abonnement prend fin, si tu y es toujours inscrit.",
  "Un numéro peut être décalé ou sauté une semaine, par exemple après un incident technique. Pour un numéro isolé, aucun numéro de remplacement ni aucune compensation ne sont dus : la lettre est un plus de ton abonnement, et ton accès à Premium reste entier. Si la lettre devait s'arrêter durablement ou changer en profondeur, on te le dit par e-mail, et tu peux résilier quand tu veux. Cela ne te prive pas des droits que la loi te garantit.",
] as const;

/** (L §4.2) Confidentialité, section « 8. La lettre » et partie 7. */
export const CONFIDENTIALITE_LETTRE_HEBDO = {
  donnees:
    "Lettre de la semaine, si tu l'actives (abonnés Premium) : ton choix, c'est-à-dire la date, la version du texte que tu as accepté et l'endroit où tu l'as fait (page de paiement ou profil), puis, si tu l'arrêtes, la date et la façon dont tu l'as fait (lien dans l'e-mail, profil, ou demande à contact@deviens-marrant.fr). On garde aussi un code personnel qui sert au lien d'arrêt, et un journal des envois (quel numéro, à quelle adresse). La lettre est envoyée à l'adresse e-mail de ton compte. Aucune adresse IP n'est gardée pour ce choix.",
  finalite:
    "T'envoyer la lettre de la semaine, si tu l'as activée : exécution du contrat, car elle fait partie de ton abonnement Premium. Tu l'actives toi-même avec une case, et tu peux l'arrêter à tout moment : on s'arrête alors.",
  destinataires:
    "Lettre de la semaine : l'envoi passe par notre prestataire Resend (voir la partie 4). L'équipe voit, dans son espace d'administration, si ta lettre est activée et depuis quand.",
  duree:
    "Lettre de la semaine : ton choix est gardé tant que ton compte existe. Si tu l'arrêtes ou si ton abonnement prend fin, on garde la date et la façon dont elle s'est arrêtée, pour respecter ton choix et ne pas t'écrire de nouveau sans que tu le demandes. Le journal des envois est gardé 12 mois. Quand tu supprimes ton compte, ton choix, sa trace et le journal des envois à ton adresse sont effacés tout de suite.",
  droits:
    "Tu peux arrêter la lettre de la semaine à tout moment, avec le lien en bas de chaque numéro ou depuis ton profil, sans toucher à ton abonnement. Ce qui t'a été envoyé avant reste valable.",
} as const;

/** (L §6.1, §6.3) Phrases facultatives de fin d'abonnement et de suppression de compte. */
export const LETTRE_HEBDO_FIN_PREMIUM = "La lettre de la semaine s'arrête avec ton accès Premium. Si tu es inscrit à la lettre du mois, elle reprend.";
export const LETTRE_HEBDO_SUPPRESSION =
  "Sont aussi effacés : ton choix pour la lettre de la semaine, le journal de ses envois, et ton inscription à la lettre du mois faite avec l'adresse de ton compte.";

/**
 * (L §6.5) Proposition unique aux abonnés existants : BROUILLON de l'avis @legal, à
 * passer à l'aveugle puis à faire valider par Thomas (règle commune 10). Envoyée
 * seulement par l'action admin, avec aperçu, inscriptions ouvertes (après la
 * publication des textes CGU et confidentialité), une fois par compte.
 */
export const PROPOSITION_LETTRE_HEBDO = {
  sujet: "La lettre de la semaine est dans ton abonnement",
  corps: (baseUrl: string) => {
    const base = sansBarre(baseUrl);
    return [
      "Salut,",
      "",
      "La lettre de la semaine est maintenant comprise dans ton abonnement Premium : une scène du carnet, la réplique et l'exercice. Tu la reçois par e-mail, chaque jeudi, une fois que tu l'as activée.",
      "",
      `Elle est facultative. Tant que tu ne coches pas la case, rien ne change pour toi. Pour la recevoir : ${base}/profil#lettre`,
      "",
      `Tu peux l'arrêter en un clic, sans toucher à ton abonnement. Si tu reçois déjà la lettre du mois, elle est mise en pause tant que tu reçois celle de la semaine. Les conditions sont dans l'article 10 des CGU : ${base}/cgu#lettre`,
      "",
      "Tu ne recevras pas d'autre message à ce sujet.",
      "",
      "L'Équipe Deviens Marrant",
      "",
      "--",
      "Tu reçois ce message parce que tu es abonné Premium : il t'informe d'une fonction de ton abonnement.",
      `Éditeur : ${LETTRE_MENTION_EDITEUR_NUMERO}. Contact : ${LETTRE_CONTACT}.`,
      `Tu ne veux plus recevoir d'e-mails autres que ceux de ton compte et de ton abonnement ? Écris-nous à ${LETTRE_CONTACT}.`,
      `Confidentialité : ${base}/confidentialite#lettre`,
    ].join("\n");
  },
};
