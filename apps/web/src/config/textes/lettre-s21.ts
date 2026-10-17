/**
 * Textes de la lettre mensuelle gratuite (s21).
 *
 * Sources : `docs/ux/lettre-inscription-s21.md` (§2, §3, §5, libellé V1 recommandé)
 * et `docs/legal/lettre-et-questions-s21.md` (L1 case v2 et mention sous le
 * bouton, L3 pied des e-mails, L6 périmètre de la désinscription).
 * Versions VALIDÉES à l'aveugle (s21, 17/10), mot pour mot : packs
 * `docs/copy/lettre-mensuelle-s21/pack-relecture-textes-lettre*.md` (tour 1 et
 * tour 2) ; « Bloc N » = numéro du duel. Toute modification repasse la relecture
 * à l'aveugle (règle d'or s18). Tant que `LETTRE_INSCRIPTIONS_OUVERTES` est fermé, aucun de
 * ces textes n'est visible ni envoyé.
 * Vocabulaire : « la lettre », « recevoir », « te désinscrire » ; jamais
 * « newsletter » ni « abonnement » à l'écran (réservés à Premium).
 * Zéro tiret cadratin (test `lettre-s21.test.ts`).
 *
 * Typographie (s21, vérification visuelle @qa) : les textes s'écrivent ici avec
 * des espaces ordinaires, identiques aux packs validés ; les objets exportés
 * passent par `insecables()`, qui lie « : ; ! ? » et « … » au mot voisin par une
 * espace insécable (jamais « : Confidentialité » en début de ligne, ni dans les
 * e-mails texte). Aucun mot changé. Test : `lettre-insecables-s21.test.ts`.
 */

import { LETTRE_MENTION_EDITEUR_NUMERO, LETTRE_PENDING_JOURS } from "@/config/lettre";
import { frPonctuation } from "@/lib/fr-typo";

export const LETTRE_CONTACT = "contact@deviens-marrant.fr";

/** Chaînes et fonctions qui rendent une chaîne : même forme, insécables posées. */
type Insecables<T> = T extends string
  ? string
  : T extends (...args: infer A) => string
    ? (...args: A) => string
    : { readonly [K in keyof T]: Insecables<T[K]> };

/**
 * Pose les insécables sur toutes les chaînes de `valeur` (et sur le retour de
 * ses fonctions), sauf aux chemins de `garder` (métadonnées : jamais de
 * typographie de rendu dans `metadata`, convention de `lib/fr-typo`).
 */
function insecables<T>(valeur: T, garder: readonly string[] = [], chemin = ""): Insecables<T> {
  if (garder.includes(chemin)) return valeur as Insecables<T>;
  if (typeof valeur === "string") return frPonctuation(valeur) as Insecables<T>;
  if (typeof valeur === "function") {
    const rendre = valeur as (...args: unknown[]) => string;
    return ((...args: unknown[]) => frPonctuation(rendre(...args))) as Insecables<T>;
  }
  const sortie: Record<string, unknown> = {};
  for (const [cle, v] of Object.entries(valeur as Record<string, unknown>)) {
    sortie[cle] = insecables(v, garder, chemin ? `${chemin}.${cle}` : cle);
  }
  return sortie as Insecables<T>;
}

const TEXTES_SOURCE = {
  /** Bloc 1 (tour 2, duel 1, A). Repris dans `page.metaTitre`. */
  titre: "Une vanne décryptée, chaque mois",
  phrase: "Tu la reçois par e-mail, avec un exercice pour t'entraîner.",
  formulaire: {
    /** Bloc 2 (tour 2, duel 2, B). */
    label: "Ton adresse e-mail",
    placeholder: "toi@exemple.fr",
    /**
     * Bloc 3 (tour 1, duel 3, B). Texte EXACT de la case (@legal L1).
     * Le modifier = changer LETTRE_CONSENT_VERSION et archiver l'ancien texte
     * dans `CONSENTEMENTS_LETTRE_ARCHIVES`.
     */
    case: "Oui, je veux recevoir la lettre de Deviens Marrant une fois par mois. Elle contient une vanne décryptée et parfois une mention de Premium. Je peux me désinscrire en un clic, à tout moment.",
    bouton: "Envoie-moi la lettre",
    /** Bloc 5 (tour 1, duel 5, B). */
    boutonEnvoi: "Envoi de l'e-mail",
    attenteLongue: "Ça traîne un peu, patiente quelques secondes.",
    reassurance: "Gratuit, sans compte.",
    /** Mention sous le bouton (@legal L1, bloc 3) ; `lienConfidentialite` est le lien final. */
    mention: "Ton adresse ne sert qu'à t'envoyer la lettre. deviens-marrant SAS, l'éditeur du site, en est responsable. Détails et droits :",
    lienConfidentialite: "Confidentialité",
  },
  /** Bloc 4 (tour 1, duel 4, A). */
  erreurs: {
    email: "Cette adresse n'a pas l'air complète. Un exemple : toi@exemple.fr",
    case: "Coche la case, sans ça on ne peut pas t'envoyer la lettre.",
    reseau: "L'envoi n'a pas abouti, et c'est de notre côté. Ce que tu as saisi reste dans le champ : réessaie dans un instant.",
    limite: "Il y a eu beaucoup d'essais d'un coup. Attends une minute et réessaie.",
  },
  /** Bloc 5 (tour 1, duel 5, B). */
  succes: {
    titre: "Regarde ta boîte mail.",
    texte: "On t'a envoyé un e-mail. Ouvre le lien qu'il contient et touche le bouton « Confirmer mon adresse » : sans ça, tu ne reçois rien.",
    aide: "Rien au bout de quelques minutes ? Jette un œil aux spams et aux promotions.",
    renvoyer: "Renvoyer l'e-mail",
    /** `{s}` = secondes restantes. */
    renvoyerDans: "Renvoyer l'e-mail dans {s} s",
    changer: "Mauvaise adresse ? La corriger",
  },
  /** Drapeau d'appareil (LETTRE_DRAPEAU_JOURS) : ligne courte à la place du formulaire. Bloc 5. */
  drapeau: {
    texte: "Il reste à confirmer ton adresse : regarde ta boîte mail.",
    renvoyer: "Renvoyer l'e-mail",
  },
  piedDePage: "La lettre du mois",
  /**
   * Place de la lettre sur le site (intégration s21, 17/10), validé à l'aveugle :
   * pack `docs/copy/lettre-mensuelle-s21/pack-relecture-place-sur-le-site.md`.
   * `menu` : duel 1, version A. `accueil` : duel 2, version A (titre et phrase
   * repris du bloc 1, réassurance du formulaire, lien nouveau).
   */
  menu: "La lettre",
  accueil: {
    titre: "Une vanne décryptée, chaque mois",
    phrase: "Tu la reçois par e-mail, avec un exercice pour t'entraîner. Gratuit, sans compte.",
    lien: "Voir la lettre",
  },
  page: {
    /** Bloc 6 (tour 2, duel 6, B). */
    metaTitre: "La lettre : une vanne décryptée, chaque mois",
    metaDescription: "Une vanne, ce qui la fait marcher et un exercice pour t'entraîner, dans ta boîte mail. Gratuit, sans compte.",
    dernierNumero: "À quoi ça ressemble : le dernier numéro",
    /** Bloc 7 (tour 1, duel 7, A). */
    confirmer: {
      titre: "Dernière étape.",
      texte: "Un tap pour confirmer que tu veux recevoir la lettre.",
      bouton: "Confirmer mon adresse",
    },
    /** Bloc 8 (tour 2, duel 8, A). */
    desinscrire: {
      titre: "Arrêter la lettre ?",
      /** @legal L6 : périmètre de la désinscription. */
      texte: "Tu ne recevras plus la lettre du mois. Si tu as un compte ou un abonnement Premium, leurs e-mails (facture, sécurité, rappel avant un renouvellement annuel) continuent : ils sont obligatoires.",
      bouton: "Me désinscrire",
    },
  },
  statuts: {
    /** Bloc 7 (tour 1, duel 7, A ; titre neutre validé à l'aveugle, relecture neutre tour 2, duel 1). */
    confirmee: {
      titre: "C'est bon, c'est confirmé.",
      texte: "Une lettre par mois, avec une vanne décryptée.",
      /* Pas de ligne « Le prochain numéro arrive le… » : date jamais affichée (Thomas, 17/10). */
      lien: "Voir la vanne du jour et son décryptage",
      lienHref: "/blague-du-jour",
    },
    /** Bloc 8 (tour 2, duel 8, A). */
    desinscrit: {
      titre: "C'est fait, tu ne recevras plus la lettre.",
      lien: "Mauvais bouton ? Te réinscrire",
    },
    /** Bloc 9 (tour 2, duel 9, B). L'adresse de contact devient un lien `mailto:` à l'affichage. */
    invalide: {
      titre: "Ce lien ne marche plus : il a peut-être expiré ou déjà servi.",
      texte: `Pour t'inscrire, utilise le formulaire de cette page. Pour te désinscrire, écris-nous à ${LETTRE_CONTACT}.`,
    },
    erreur: {
      titre: `Un souci de notre côté. Réessaie ce lien dans quelques minutes, et écris-nous à ${LETTRE_CONTACT} si ça persiste.`,
    },
  },
} as const;

export const TEXTES_LETTRE = insecables(TEXTES_SOURCE, ["page.metaTitre", "page.metaDescription"]);

/**
 * `<title>` des pages à bouton (revue s21 m6) : chaînes SOURCE, sans les insécables
 * de rendu (jamais de typographie de rendu dans `metadata`, convention de
 * `lib/fr-typo`). Le titre affiché dans la page reste celui de `TEXTES_LETTRE`.
 */
export const TITRES_META_LETTRE = {
  confirmer: TEXTES_SOURCE.page.confirmer.titre,
  desinscrire: TEXTES_SOURCE.page.desinscrire.titre,
} as const;

/**
 * Textes de consentement déjà présentés, gardés pour la preuve des
 * consentements donnés sous une version antérieure (`consentText` stocké en
 * base = `<version> : <texte de la case>`). Ne jamais supprimer une entrée.
 */
export const CONSENTEMENTS_LETTRE_ARCHIVES = {
  "lettre-mensuelle-v1": {
    case: "Oui, je veux recevoir la lettre de Deviens Marrant une fois par mois : une vanne décryptée, parfois avec une mention de Premium. Je peux me désinscrire en un clic, à tout moment.",
    mention: "Ton e-mail sert à t'envoyer la lettre, rien d'autre. deviens-marrant SAS en est responsable. Détails et droits :",
  },
} as const;

/** Pied légal commun (@legal L3) : identité, contact, confidentialité. */
function piedLegal(baseUrl: string): string[] {
  return [`Éditeur : deviens-marrant SAS. Contact : ${LETTRE_CONTACT}.`, `Confidentialité : ${baseUrl.replace(/\/$/, "")}/confidentialite`];
}

/**
 * E-mails automatiques : versions validées à l'aveugle (s21, blocs 10 à 13).
 * Texte seul : aucun pixel ni lien suivi (@legal L4, B4).
 * Partent de `EMAIL_FROM` (noreply@), `Reply-To` contact@, signés « L'Équipe Deviens Marrant ».
 */
const EMAILS_SOURCE = {
  /** Bloc 10 (tour 1, duel 10, B). */
  confirmation: {
    sujet: "Une dernière étape pour recevoir la lettre",
    corps: (lienConfirmer: string, baseUrl: string) =>
      [
        "Salut,",
        "",
        "Quelqu'un (sûrement toi) a demandé à recevoir la lettre de Deviens Marrant avec cette adresse : une vanne décryptée, une fois par mois.",
        "",
        `Pour confirmer, ouvre ce lien et touche le bouton « ${TEXTES_LETTRE.page.confirmer.bouton} ». Il est valable ${LETTRE_PENDING_JOURS} jours.`,
        lienConfirmer,
        "",
        `Ce n'était pas toi ? Ignore ce message : tu ne recevras rien, et l'adresse sera effacée au bout de ${LETTRE_PENDING_JOURS} jours.`,
        "",
        "L'Équipe Deviens Marrant",
        "",
        "--",
        ...piedLegal(baseUrl),
      ].join("\n"),
  },
  /** Bloc 11 (tour 2, duel 11, B). */
  dejaInscrit: {
    sujet: "Tu reçois déjà la lettre",
    corps: (lienDesinscrire: string, baseUrl: string) =>
      [
        "Salut,",
        "",
        "Une demande d'inscription vient d'être faite avec cette adresse, mais elle reçoit déjà la lettre : rien à faire de ton côté. Un numéro arrive une fois par mois.",
        "",
        "Si tu veux arrêter, le lien de désinscription est en bas de ce message.",
        "",
        "L'Équipe Deviens Marrant",
        "",
        "--",
        ...piedLegal(baseUrl),
        `Se désinscrire : ${lienDesinscrire}`,
      ].join("\n"),
  },
  /** Bloc 12 (tour 1, duel 12, B) : texte inchangé. */
  reconfirmation: {
    sujet: "Tu veux toujours recevoir la lettre ?",
    corps: (lienConfirmer: string, lienDesinscrire: string, baseUrl: string) =>
      [
        "Salut,",
        "",
        "Tu reçois la lettre de Deviens Marrant depuis 2 ans. On vérifie que tu veux la garder.",
        "",
        "Pour continuer, ouvre ce lien puis touche le bouton :",
        lienConfirmer,
        "",
        "Sans clic de ta part dans les 30 jours, on te désinscrit. Rien d'autre à faire.",
        "",
        "L'Équipe Deviens Marrant",
        "",
        "--",
        ...piedLegal(baseUrl),
        `Se désinscrire maintenant : ${lienDesinscrire}`,
      ].join("\n"),
  },
  /** Bloc 13 (tour 1, duel 13, A ; 1re ligne neutre validée à l'aveugle, relecture neutre tour 1, duel 2, B). Pied ajouté à chaque numéro mensuel (le corps vient de `NewsletterIssue.bodyText`). */
  piedNumero: (lienDesinscrire: string, baseUrl: string) =>
    [
      "",
      "--",
      "Tu reçois cette lettre parce que tu l'as demandée sur deviens-marrant.fr.",
      `Éditeur : ${LETTRE_MENTION_EDITEUR_NUMERO}. Contact : ${LETTRE_CONTACT}.`,
      `Se désinscrire : ${lienDesinscrire}`,
      ...piedLegal(baseUrl).slice(1),
    ].join("\n"),
} as const;

export const EMAILS_LETTRE = insecables(EMAILS_SOURCE);
