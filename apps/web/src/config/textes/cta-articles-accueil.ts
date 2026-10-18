/**
 * Blocs d'appel s21, partie A : éléments globaux, articles, accueil, en-tête.
 *
 * FICHIER UNIQUE des textes de la partie A : aucun texte de ces blocs n'est écrit en dur
 * dans un composant.
 *
 * Source : textes finaux VALIDÉS du 18/10/2026 (`docs/copy/cta-s21/textes-finaux-valides.md`) :
 * B1, B2, B4+B5, B6, B18 inchangés depuis le tour 13 ; B3 en version du tour 17.
 *
 * Règles : tutoiement, zéro tiret cadratin, UTF-8. Aucun nombre écrit en dur : prix depuis
 * `config/premium.ts`, nombre de parcours depuis `PARCOURS_COUNT` / `PREMIUM_PARCOURS`,
 * titres d'étapes depuis `config/parcours-etapes.ts` (copie du seed vérifiée par un test),
 * annuel seulement si `isAnnualPlanAvailable()` (lu côté serveur, passé en paramètre ici).
 */
import {
  ESPACE_INSECABLE,
  PARCOURS_COUNT,
  PREMIUM_ANNUAL_MONTHLY_EQUIVALENT_CENTS,
  PREMIUM_ANNUAL_PRICE_CENTS,
  PREMIUM_ANNUAL_PRICE_LABEL,
  PREMIUM_ANNUAL_SAVINGS_CENTS,
  PREMIUM_MONTHLY_PRICE_CENTS,
  PREMIUM_PARCOURS,
  PREMIUM_PRICE_LABEL,
  formatEuros,
} from "@/config/premium";
import { titreEtape } from "@/config/parcours-etapes";
import { REASSURANCE_PAIEMENT } from "@/config/textes/offre";
import { PARCOURS_NOMS, type ParcoursSlug } from "@/lib/entrees-parcours";

/**
 * Libellé de la section des articles (menu, pied de page, fil d'Ariane,
 * BreadcrumbList). [CHOIX UTILISATEUR] du 18/10/2026 : « Blog » devient
 * « Articles » ; l'adresse `/blog` et les slugs ne changent pas.
 */
export const LIBELLE_SECTION_ARTICLES = "Articles";

// ─── Briques communes (nombres lus à la source) ─────────────────────────────

/** « · » des libellés d'ouverture : espace insécable avant, le prix passe à la ligne avec lui. */
const POINT_MEDIAN = `${ESPACE_INSECABLE}· `;

/** Minutes par semaine d'un parcours publié (config/premium.ts), `NaN` s'il n'est pas publié. */
export const minutesParSemaine = (slug: string): number =>
  Number.parseInt(PREMIUM_PARCOURS.find((p) => p.slug === slug)?.timePerWeek ?? "", 10);

/** Nombre d'étapes d'un parcours publié, `null` s'il n'est pas publié. */
export const etapesDuParcours = (slug: string): number | null =>
  PREMIUM_PARCOURS.find((p) => p.slug === slug)?.weeks ?? null;

const MINUTES = PREMIUM_PARCOURS.map((p) => minutesParSemaine(p.slug)).filter((m) => Number.isFinite(m));

/** « 15 à 20 minutes » : min et max de `{D}` sur les parcours publiés. */
export const DUREE_ETAPES =
  Math.min(...MINUTES) === Math.max(...MINUTES)
    ? `${Math.min(...MINUTES)} minutes`
    : `${Math.min(...MINUTES)} à ${Math.max(...MINUTES)} minutes`;

/**
 * `OUVRIR` : « Ouvrir les 5 parcours · 2,99 €/mois » (B2, B4+B5, B16). Repli « tous les
 * parcours » si le compte tombe à 1 ou 0. `prix` : libellé de la formule (annuel pour B16).
 */
export function libelleOuvrirParcours(count: number = PARCOURS_COUNT, prix: string = PREMIUM_PRICE_LABEL): string {
  const quoi = count >= 2 ? `les ${count} parcours` : "tous les parcours";
  return `Ouvrir ${quoi}${POINT_MEDIAN}${prix}`;
}

/** `OUVRIR_P` : « Ouvrir {P} en entier · 2,99 €/mois » (lien de B12, bouton de B13). */
export const libelleOuvrirUnParcours = (slug: ParcoursSlug): string =>
  `Ouvrir ${PARCOURS_NOMS[slug]} en entier${POINT_MEDIAN}${PREMIUM_PRICE_LABEL}`;

/**
 * `OUVRIR_ACCUEIL` (B3 seulement, tour 16) : « Ouvrir les 5 parcours, de la coloc à
 * l'afterwork · 2,99 €/mois ». « De la coloc » = carte de Répartie, « à l'afterwork » = carte
 * de Machine à Café : repli sur `OUVRIR` si l'un des deux n'est plus publié ou s'il reste
 * moins de 5 parcours (`colocAfterworkVrai`, même condition pour B10 `[S15]`).
 */
export function colocAfterworkVrai(parcours: readonly { slug: string }[] = PREMIUM_PARCOURS): boolean {
  const publies = new Set(parcours.map((p) => p.slug));
  return parcours.length >= 5 && publies.has("repartie") && publies.has("machine-a-cafe");
}

export function libelleOuvrirAccueil(parcours: readonly { slug: string }[] = PREMIUM_PARCOURS): string {
  return colocAfterworkVrai(parcours)
    ? `Ouvrir les ${parcours.length} parcours, de la coloc à l'afterwork${POINT_MEDIAN}${PREMIUM_PRICE_LABEL}`
    : libelleOuvrirParcours(parcours.length);
}

/** « Premium, l'abonnement du site : 2,99 € TTC par mois[, ou 24,99 € TTC par an (2,08 € par mois)]. » */
function prixPremiumTtc(annuelDisponible: boolean): string {
  const mensuel = `${formatEuros(PREMIUM_MONTHLY_PRICE_CENTS)} TTC par mois`;
  const annuel = `, ou ${formatEuros(PREMIUM_ANNUAL_PRICE_CENTS)} TTC par an (${formatEuros(PREMIUM_ANNUAL_MONTHLY_EQUIVALENT_CENTS)} par mois)`;
  return `Premium, l'abonnement du site : ${mensuel}${annuelDisponible ? annuel : ""}.`;
}

// ─── B6. Bouton d'en-tête ───────────────────────────────────────────────────

/**
 * B6 : « 2,99 €/mois » (espace insécable avant « € »), vers `/abonnement?src=header`.
 * Nom accessible : le libellé visible d'abord (WCAG 2.5.3), puis ce que fait le lien.
 */
export const EN_TETE = {
  bouton: PREMIUM_PRICE_LABEL,
  nomAccessible: `${formatEuros(PREMIUM_MONTHLY_PRICE_CENTS)} par mois : voir l'offre Premium`,
} as const;

// ─── B1. Encart du milieu des articles ──────────────────────────────────────

/**
 * B1 (`DemoVanne variante="milieu"`). La situation montrée est la fiche OFFERTE du carnet du
 * mois (`lib/carnet.ts`, champs `offerte` et `accroche`) : « offerte ce mois-ci » et
 * « Gratuit, sans compte » ne sont vrais que pour elle.
 */
export const DEMO_VANNE = {
  /** [S1] */
  surtitre: "La situation offerte ce mois-ci",
  /** [S2] : `accroche` de la fiche puis ce qu'on te dit. */
  situation: (accroche: string, onTeDit: string) => `${accroche}, et on te lance : « ${onTeDit} »`,
  /** [S3] */
  question: "Tu réponds quoi ?",
  /** [S6] : ouvre la même fiche sur /carnet. */
  bouton: "Voir la réplique",
  /** [S7] : la seconde phrase seulement si le carnet compte plus d'une fiche. */
  note: (autresSituations: boolean) =>
    `Gratuit, sans compte : la réplique, pourquoi elle marche et quoi dire si ça se tend.${
      autresSituations ? " Chaque mois, de nouvelles situations arrivent dans Premium, l'abonnement du site." : ""
    }`,
} as const;

// ─── B2. Bloc de fin d'article ──────────────────────────────────────────────

/**
 * B2 (`ArticleCta`, variante « fin ») : un plein (étape 1 gratuite), le lien `OUVRIR` dessous,
 * puis la note [S9]. [S1] « Parcours Répartie · 4 semaines » : `TEXTES_BLOC_FIN.surtitre`.
 */
export const BLOC_FIN = {
  /** [S6] : bouton plein de l'étape 1, par parcours (autres parcours : `etape1GratuiteBouton`). */
  boutonEtape1: { repartie: "Tester mes premières répliques, gratuit" } as Readonly<Partial<Record<string, string>>>,
  /** Lien sous le plein : `OUVRIR`. */
  lienAbonnement: libelleOuvrirParcours(),
  /** [S9] : annuel seulement si `isAnnualPlanAvailable()`. */
  note: (annuelDisponible: boolean) => `${prixPremiumTtc(annuelDisponible)} ${REASSURANCE_PAIEMENT}`,
  /**
   * Surcharges par article (prioritaires sur config/blog-cta.ts et encarts-blog-s20.ts).
   * Article n°1 : [S8] titre, [S5'] scène (« cinquante vannes » : l'article en compte
   * cinquante ; à paramétrer si le texte est repris ailleurs), [S9] note.
   */
  parArticle: {
    "meilleures-blagues-droles-2026": {
      titre: "La vanne qui sort de ta bouche, pas de ton téléphone",
      texte:
        `Tu viens de lire cinquante vannes. Le jour où on te chambre, tu n'auras pas le temps de les chercher dans ton téléphone : ça se joue en une seconde, et ça s'entraîne. Une étape par semaine, ${minutesParSemaine("repartie")} minutes : tes premières répliques, le rythme et les silences, les piques qu'on retourne avec le sourire, et la vanne tombée à plat qui devient une deuxième chance. À chaque étape, un défi à tenter, en vrai ou à l'écrit. La première se lit tout de suite, sans compte.`,
      noteS9: true,
    },
  } as Readonly<Partial<Record<string, { titre?: string; texte?: string; noteS9?: boolean }>>>,
} as const;

// ─── B18. La lettre par e-mail dans l'article ───────────────────────────────

/**
 * B18, formulaire complet en bas d'article. La vanne de la ligne 1 : avant le premier envoi
 * (05/11/2026) celle-ci ; ensuite, la dernière vanne DÉJÀ envoyée.
 * `ligneRepliee` : textes validés de la ligne repliée du milieu d'article, NON posée (accord
 * de Thomas et de @legal requis, `docs/design/cta-forme-place-s21.md` §4.4).
 */
export const LETTRE_ARTICLE = {
  titre: "La vanne du mois, et la méthode pour écrire la tienne",
  phrase: [
    "« J'ai pris un chien pour me faire des amis. Il en a plein. Moi, je tiens la laisse. » Voilà le genre de vanne que tu reçois chaque mois, avec ce qui la fait marcher.",
    "Et surtout trois étapes pour fabriquer la tienne, avec un exemple.",
  ],
  reassurance:
    "La lettre est gratuite, sans compte. En fin de message, une lecture à suivre et un mot sur Premium, notre abonnement. Désinscription en un clic.",
  ligneRepliee: { phrase: "Chaque mois, une vanne et de quoi écrire la tienne.", bouton: "Recevoir par e-mail" },
} as const;

// ─── B3. Haut de l'accueil (version du tour 17, validée) ─────────────────────

/**
 * [S20] : « Les {N - 1} suivantes » et le titre de l'étape payante citée (3e de Répartie)
 * sont lus dans la donnée. Limite dure : 200 caractères (test, décision du tour 17). Si l'étape citée n'existe
 * plus, la clause « dont « … » » disparaît.
 */
export function noteAccueilHaut(slug: ParcoursSlug = "repartie"): string {
  const n = etapesDuParcours(slug) ?? 0;
  const citee = titreEtape(slug, 3);
  const dont = citee && n >= 3 ? `, dont « ${citee} »,` : ",";
  return `Sans compte : l'étape 1 du parcours ${PARCOURS_NOMS[slug]} (conseil, défi, 5 vannes, 2 vidéos, quiz). Les ${n - 1} suivantes${dont} c'est Premium, résiliable depuis ton profil.`;
}

/** B3 : le plein mène à l'étape 1 de Répartie, le lien `OUVRIR_ACCUEIL` à /abonnement. */
export const ACCUEIL_HAUT = {
  /** [S19] */
  bouton: "Tester mes premières répliques, gratuit",
  lien: libelleOuvrirAccueil(),
  /** [S20] */
  note: noteAccueilHaut(),
} as const;

// ─── B4 + B5. Carte Premium de l'accueil ────────────────────────────────────

/** Une ligne par parcours publié, dans l'ordre du texte validé. */
const LIGNES_PARCOURS: readonly { slug: ParcoursSlug; ligne: string }[] = [
  { slug: "repartie", ligne: "pour répondre quand on te chambre" },
  { slug: "machine-a-cafe", ligne: "pour faire rire à la pause sans forcer" },
  { slug: "boulot", ligne: "pour le lundi à 9 h sans le ton de compte rendu" },
  { slug: "confiance", ligne: "pour retrouver ta légèreté" },
  { slug: "storytelling", ligne: "pour que ta chute arrive avant le dessert" },
];

/** B4 + B5 : plein `OUVRIR` vers /abonnement?src=accueil-premium ; contour : étape 1 de Répartie. */
export const CARTE_PREMIUM = {
  /** [S10] */
  titre: "Et si ton « j'aurais dû dire » devenait un « j'ai dit » ?",
  /** [S11] en trois blocs : paragraphe, intro + `<ul>`, paragraphe. */
  intro: {
    scene: "La table qui rit, et c'est ta réplique qui l'a lancée.",
    listeIntro: `Un seul prix ouvre les ${PARCOURS_COUNT} parcours, et l'étape 1 de chacun se lit gratuitement :`,
    liste: LIGNES_PARCOURS.filter(({ slug }) => PREMIUM_PARCOURS.some((p) => p.slug === slug)).map(
      ({ slug, ligne }) => `${PARCOURS_NOMS[slug]} ${ligne}`,
    ),
    /** Mêmes lignes, nom et suite séparés pour le balisage (nom en gras, revue design P2-7) : texte identique. */
    listeParties: LIGNES_PARCOURS.filter(({ slug }) => PREMIUM_PARCOURS.some((p) => p.slug === slug)).map(
      ({ slug, ligne }) => ({ nom: PARCOURS_NOMS[slug], suite: ligne }),
    ),
    fin: `Une fois abonné, tout est ouvert d'un coup : ${DUREE_ETAPES} par étape, avec un défi à tenter, dans la vie ou à l'écrit.`,
  },
  /** En-tête de carte « Premium · 2,99 €/mois » : unité sous le montant en gros. */
  prixUnite: "/mois",
  /** [S12] : l'annuel seulement si `isAnnualPlanAvailable()`. */
  ligneTarif: (annuelDisponible: boolean) =>
    annuelDisponible
      ? `Ou ${PREMIUM_ANNUAL_PRICE_LABEL} (${formatEuros(PREMIUM_ANNUAL_MONTHLY_EQUIVALENT_CENTS)}/mois, ${formatEuros(PREMIUM_ANNUAL_SAVINGS_CENTS)} économisés). Prix TTC.`
      : "Prix TTC.",
  /** Bouton plein (visiteur) : `OUVRIR`. */
  bouton: libelleOuvrirParcours(),
  /** Bouton contour : étape 1 de Répartie. */
  contour: "Tester mes premières répliques, gratuit",
  /** [S13] */
  reassurance: "Tu as 14 jours pour te faire rembourser ton premier paiement, et tu résilies depuis ton profil quand tu veux.",
  /** Chiffre fixe validé par Thomas (29/09/2026). */
  inscrits: `Déjà 1${ESPACE_INSECABLE}500+ inscrits, et toi ?`,
} as const;
