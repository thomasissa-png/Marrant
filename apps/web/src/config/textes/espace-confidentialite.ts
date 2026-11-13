/**
 * Politique de confidentialité, ajouts de l'espace client (s24, lot D4, porte G9) : question C9
 * « Où veux-tu être plus à l'aise ? ». Source : `docs/legal/espace-c9-information-s24.md` (@legal,
 * « Ligne à ajouter à confidentialite/page.tsx »), mot pour mot, sans le point final des puces (style
 * des listes de la page). Draft à faire valider par un avocat avant ouverture.
 *
 * NON PUBLIÉ : rendu seulement interrupteur `ESPACE_CLIENT_PUBLIE` ouvert (même mécanique que la
 * résiliation et l'onboarding : la date de mise à jour ne bouge qu'une fois ouvert).
 */

/**
 * Date de mise en ligne de ces lignes, au format « 12 novembre 2026 ». VIDE tant que l'espace n'est pas
 * ouvert (aucune date inventée) : à remplir le jour du déploiement de l'ouverture (REPLIT_ACTIONS.md,
 * entrée « À DÉPLOYER (s24) : lot D4 »). Vide = la date de la page ne change pas.
 */
export const ESPACE_DATE_TEXTES = "";

export const CONFIDENTIALITE_ESPACE = {
  /** Partie 2 (données), nouvelle puce. */
  donnees:
    "Ta réponse à la question « Où veux-tu être plus à l'aise ? » (entre potes, au boulot, pour plaire ou partout), la date de ta réponse et la date où on t'a proposé une situation de rencontre, si tu es abonné",
  /** Partie 3 (base), nouvelle puce. */
  base: "Choisir les situations qu'on te propose selon ta réponse : exécution du contrat",
  /**
   * Partie 6 (durée) : la phrase existante (« La date de chaque étape validée et tes retours sur les
   * exercices sont gardés tant que ton compte existe, et effacés avec lui. ») complétée par « ta réponse
   * sur l'endroit où tu veux être plus à l'aise ». [À VÉRIFIER @legal : place de l'ajout dans la phrase.]
   */
  dureeEtapes:
    "La date de chaque étape validée, tes retours sur les exercices et ta réponse sur l'endroit où tu veux être plus à l'aise sont gardés tant que ton compte existe, et effacés avec lui.",
  /**
   * Partie 5 (cookies), puce juste après « Cookies essentiels » : `docs/legal/espace-d6-cookie-coin-s24.md`
   * point 2, mot pour mot, sauf la durée : « 1 an » devient « 6 mois » (point 3, option prudente retenue
   * par la session le 13/11, `DUREE_COIN_SECONDES`). [À VÉRIFIER @legal : mention de l'effacement à la
   * déconnexion, ajouté pour le poste partagé.]
   */
  /**
   * Partie 9 (« Ta question à l'équipe »), lot D7 (plan §6 T5) : `docs/legal/espace-client-s24-phrases.md`,
   * bloc 2, puces 1 et 4 proposées, mot pour mot (clé = rang de la puce remplacée, à partir de 0). Go de
   * Thomas requis avant l'ouverture (plan §6 : chaque ligne déjà en ligne qu'on touche).
   */
  questions: {
    0: "Ce qu'on reçoit : le texte de ta question (1 000 caractères au plus) et l'adresse e-mail de ton compte, pour te répondre. Le site garde ta question et notre réponse dans sa base de données, pour que tu retrouves ton historique dans « Mes questions », et les envoie aussi par e-mail à l'équipe.",
    3: "Combien de temps : dans ton espace, ta question et notre réponse sont gardées tant que ton compte existe, et effacées avec lui. Leurs copies par e-mail restent dans les boîtes de l'équipe au plus 6 mois après notre dernier échange, même si tu supprimes ton compte avant, puis sont effacées. Tu peux demander leur effacement plus tôt.",
  } as Readonly<Record<number, string>>,
  cookie:
    "Coin « Humour noir » de ton espace : si tu cliques sur « Entrer », un petit cookie gardé dans ton navigateur retient ton choix pendant 6 mois, pour ne pas te le redemander. Il ne contient aucune donnée sur toi et sert seulement à ça. Tu l'effaces en cliquant sur « Sortir » ou depuis ton navigateur.",
} as const;
