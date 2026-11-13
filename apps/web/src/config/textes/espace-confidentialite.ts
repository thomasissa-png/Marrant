/**
 * Politique de confidentialité, ajouts de l'espace client (s24, lot D4, porte G9) : question C9
 * « Où veux-tu être plus à l'aise ? ». Source : `docs/legal/espace-c9-information-s24.md` (@legal,
 * « Ligne à ajouter à confidentialite/page.tsx »), mot pour mot, sans le point final des puces (style
 * des listes de la page). Draft à faire valider par un avocat avant ouverture.
 *
 * NON PUBLIÉ : rendu seulement interrupteur `ESPACE_CLIENT_PUBLIE` ouvert (même mécanique que la
 * résiliation et l'onboarding : la date de mise à jour ne bouge qu'une fois ouvert).
 *
 * Lot D10b (s24) : retouches des relectures à l'aveugle (`docs/espace-client/relecture-textes-d10-{reviewer,elon}.md`)
 * et phrases manquantes de @legal (`docs/legal/espace-d10-phrases-manquantes-s24.md`) ; table « D10b : retouche
 * → ligne » de `docs/espace-client/textes-en-ligne-d10-a-valider.md`.
 */
import { DUREE_CONSERVATION_USAGE_MOIS } from "@/lib/mesure/conservation-usage";

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
   * T6 a, lot D10b : réécriture de @elon (pluriel tenu, « notés aussi, sans annonce » lisible). « si tu es
   * abonné » est vrai : les lignes `CapAnnonce` ne s'écrivent qu'à l'écran d'un abonné, et le recalcul de
   * l'ouverture ne traite plus que les abonnés actifs (`recalculerCapsSilencieux`, faute relevée par @reviewer).
   */
  donneesCaps:
    "Les caps et les bonus qu'on t'a déjà annoncés, avec la date de chaque annonce (ceux que tu avais déjà atteints à l'ouverture de l'espace sont notés aussi, sans annonce), si tu es abonné",
  /** Lot D10b, @legal point 1 : partie 2, juste après `donneesCaps` ; base en partie 3 après `baseCaps`. */
  donneesReplique:
    "Les phrases que tu écris dans « Ma réplique à moi » (une par fiche) et leur date, si tu es abonné. On ne les lit pas pour t'analyser, et elles ne sont jamais ajoutées à nos mesures",
  baseReplique: "Garder et te réafficher les phrases que tu as écrites : exécution du contrat",
  /** Lot D10b, @legal point 2 : état « lu » de la cloche, partie 2 après `donneesReplique`, base en partie 3. */
  donneesLu: "La date à laquelle tu ouvres une réponse de l'équipe, pour afficher « lu » sur la cloche, si tu es abonné",
  baseLu: "T'indiquer ce que tu as déjà lu : exécution du contrat",
  baseCaps: "Ne t'annoncer qu'une seule fois chaque cap et chaque bonus : exécution du contrat",
  /**
   * T6 c, lot D10b : `mesure` raccourcie de @legal (point 3), qui corrige les deux fautes de @reviewer
   * (réplique et question ne sont que des compteurs anonymes ; plus de « jamais leur texte »). Sans point
   * final (style des puces). La durée vient de la constante de la purge, programmée lot D10b
   * (`DUREE_CONSERVATION_USAGE_MOIS`, [HYPOTHÈSE : 13 mois] à fixer par Thomas) : texte et purge ne divergent pas.
   */
  mesure: `Usage de ton espace, si tu es abonné : chaque jour où tu l'ouvres et chaque cap atteint (son numéro). On compte aussi, sans aucun lien avec ton compte, combien de fois certains écrans s'ouvrent (cloche, bonus, coin « Humour noir », archive « Lettres ») et combien de répliques et de questions sont écrites. Aucune adresse IP. Les données rattachées à ton compte sont gardées au plus ${DUREE_CONSERVATION_USAGE_MOIS} mois, et effacées plus tôt avec ton compte`,
  baseMesure:
    "Comprendre si ton espace te sert et où tu t'arrêtes, à partir d'événements rattachés à ton compte et lus sous forme anonymisée : intérêt légitime (tu peux t'y opposer, voir la partie 7)",
  /**
   * Lot D10 (plan §6 T6) : `docs/legal/espace-client-s24-phrases.md` bloc 2. Partie 4, rôle de Neon
   * (facultatif, un mot) ; partie 6, dernier paragraphe (`CONSERVATION_QUESTION_EQUIPE.confidentialite`)
   * dont seul le début change.
   */
  // T6 g, lot D10b (@reviewer) : les répliques sont aussi stockées chez Neon.
  neonRole: "base de données (compte, progression, abonnement, tes répliques, tes questions et nos réponses)",
  conservationQuestions:
    "Les copies par e-mail de tes questions à l'équipe et de nos réponses suivent leur propre durée (voir la partie 9) : elles restent dans les boîtes e-mail de l'équipe au plus 6 mois après notre dernier échange, même si tu supprimes ton compte avant, puis sont effacées. Tu peux demander leur effacement plus tôt à contact@deviens-marrant.fr.",
  /**
   * Partie 6 (durée) : la phrase existante (« La date de chaque étape validée et tes retours sur les
   * exercices sont gardés tant que ton compte existe, et effacés avec lui. ») complétée par « ta réponse
   * sur l'endroit où tu veux être plus à l'aise » (lot D4) puis, lot D10, par « la liste des caps et des
   * bonus déjà annoncés » : `docs/legal/espace-d4-confidentialite-s24.md` point (2) B, mot pour mot. Lot D10b
   * (T6 e, @reviewer) : « tes répliques » ajouté. Suivie de `dureeReplique` et `dureeLu` (@legal), phrases séparées.
   */
  dureeEtapes:
    "La date de chaque étape validée, tes retours sur les exercices, tes répliques, ta réponse sur l'endroit où tu veux être plus à l'aise et la liste des caps et des bonus déjà annoncés sont gardés tant que ton compte existe, et effacés avec lui.",
  dureeReplique:
    "Tes phrases de « Ma réplique à moi » sont gardées tant que ton compte existe, même si ton abonnement s'arrête : tu les relis alors sans pouvoir les modifier. Tu peux en supprimer une quand tu veux, et elles sont toutes effacées avec ton compte.",
  dureeLu: "La date d'ouverture d'une réponse est gardée avec ta question, tant que ton compte existe, et effacée avec lui.",
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
