/**
 * Premier pas de « Aujourd'hui » (s24, lot D3 ; architecture v20 4.2, ordre 1, et 4.4 état 1).
 * Module PUR, sans accès serveur : importé par la page (signal du lien de retour, résolu en base
 * par `premier-pas-serveur.ts`) et par le composant navigateur (résultat du quiz, même appareil).
 *
 * Ordre 1 : lien de retour vers un contenu précis (fiche du catalogue, étape), puis quiz, puis
 * lien de retour vers un parcours sans étape AUTRE que Répartie, puis scène par défaut.
 * `/parcours/repartie` sans étape = aucun signal (Répartie est déjà le défaut, C11).
 * Jamais « choisis un parcours ». Une seule action : « Commencer ».
 */
import { ESPACE_ACCUEIL } from "@/config/espace-client";
import { sanitizeReturnTo } from "@/lib/premium-return";
import { lireFavori, type ContenuFavori } from "@/lib/favori-apres-paiement";

export type ProfilQuiz = "OBSERVATEUR" | "STORYTELLER" | "ABSURDE" | "PUNCHLINEUR" | "TAQUIN";
const PROFILS: readonly ProfilQuiz[] = ["OBSERVATEUR", "STORYTELLER", "ABSURDE", "PUNCHLINEUR", "TAQUIN"];

/** Clé du résultat du quiz d'humour dans le navigateur (`components/quiz/viral-quiz.tsx`). */
export const CLE_QUIZ = "humor-quiz-viral";
/** Origine résolue gardée dans le navigateur après l'arrivée (le `depuis` ne voyage qu'une fois). */
export const CLE_ORIGINE = "espace-premier-pas-origine";
/** Paramètre de l'adresse d'arrivée qui porte le lien de retour d'origine (`lib/espace/arrivee.ts`). */
export const PARAM_DEPUIS = "depuis";

/** Parcours par défaut (C11) : son lien sans étape n'est pas un signal. */
export const PARCOURS_PAR_DEFAUT = "repartie";

/**
 * Les 5 situations d'entrée (QR1 A1 à A5, E1.1 et E1.2) et la scène par défaut (A5).
 * [HYPOTHÈSE : identifiants à poser tels quels à l'import de QR1 dans `data/espace/situations.json`.]
 */
export const ENTREES_QUIZ: Record<ProfilQuiz, string> = {
  OBSERVATEUR: "soiree-et-toi-tu-fais-quoi",
  STORYTELLER: "amis-quoi-de-neuf",
  ABSURDE: "boulot-ca-va",
  PUNCHLINEUR: "amis-tu-as-change-quelque-chose",
  TAQUIN: "coloc-la-poele",
};
export const ENTREE_PAR_DEFAUT = ENTREES_QUIZ.PUNCHLINEUR;
/** Durée de la scène par défaut (libellé 29, « 5 min »). */
export const MINUTES_PAR_DEFAUT = 5;

/** Adresse d'une fiche de l'espace (lot D6 : `mon-espace/fiche/[type]/[id]`). */
export const hrefFiche = (type: string, id: string) => `${ESPACE_ACCUEIL}/fiche/${type}/${id}`;

/** Ce que dit le lien de retour, avant lecture en base. */
export type Origine =
  | { genre: "fiche"; type: ContenuFavori; slug: string | null; id: string | null }
  | { genre: "etape"; parcours: string; etape: number }
  | { genre: "parcours"; parcours: string };

/** Origine lue en base : titre et adresse de la cible (null si introuvable). */
export type OrigineResolue = { genre: Origine["genre"]; titre: string; href: string };

/** Situation d'entrée disponible dans le contenu servi (titre et durée de la fiche). */
export type EntreeDisponible = { id: string; titre: string; minutes: number };

export type PremierPas = {
  source: "fiche" | "etape" | "quiz" | "parcours" | "defaut";
  titre: string;
  href: string;
  /** Durée affichée (« 5 min ») ; null quand la cible n'en porte pas. */
  minutes: number | null;
};

const SEGMENTS_FICHE: Record<string, ContenuFavori> = { vannes: "JOKE", conseils: "TIP", videos: "VIDEO" };

/** Lit le lien de retour (chemin interne sûr) ; null = aucun signal. */
export function lireOrigine(depuis: string | null | undefined): Origine | null {
  const sur = sanitizeReturnTo(depuis);
  if (!sur) return null;
  const [avantHash, hash = ""] = sur.split("#");
  const [chemin, query = ""] = avantHash.split("?");
  const favori = lireFavori(new URLSearchParams(query).get("favori"));
  if (favori) return { genre: "fiche", type: favori.contentType, slug: null, id: favori.contentId };
  const segments = chemin.split("/").filter(Boolean);
  if (segments.length === 2 && SEGMENTS_FICHE[segments[0]] && segments[1] !== "theme") {
    return { genre: "fiche", type: SEGMENTS_FICHE[segments[0]], slug: segments[1], id: null };
  }
  if (segments.length === 2 && segments[0] === "parcours") {
    const etape = /^etape-(\d{1,2})$/.exec(hash);
    if (etape) return { genre: "etape", parcours: segments[1], etape: Number(etape[1]) };
    return segments[1] === PARCOURS_PAR_DEFAUT ? null : { genre: "parcours", parcours: segments[1] };
  }
  return null;
}

/** Profil du quiz enregistré dans le navigateur (`{ profile }`), ou null. */
export function lireProfilQuiz(brut: string | null | undefined): ProfilQuiz | null {
  if (!brut) return null;
  try {
    const profil = (JSON.parse(brut) as { profile?: unknown }).profile;
    return PROFILS.includes(profil as ProfilQuiz) ? (profil as ProfilQuiz) : null;
  } catch {
    return null;
  }
}

/**
 * Choix du premier pas (ordre 1). `scene` = titre de la scène par défaut (texte validé), passé par
 * l'appelant pour garder ce module sans texte. Une entrée de quiz absente du contenu servi retombe
 * sur la scène par défaut (jamais une adresse qui n'existe pas).
 */
export function choisirPremierPas(
  origine: OrigineResolue | null,
  quiz: ProfilQuiz | null,
  entrees: readonly EntreeDisponible[],
  scene: string,
): PremierPas {
  if (origine && (origine.genre === "fiche" || origine.genre === "etape")) {
    return { source: origine.genre, titre: origine.titre, href: origine.href, minutes: null };
  }
  if (quiz) {
    const entree = entrees.find((e) => e.id === ENTREES_QUIZ[quiz]);
    if (entree) return { source: "quiz", titre: entree.titre, href: hrefFiche("situation", entree.id), minutes: entree.minutes };
  }
  if (origine && origine.genre === "parcours") {
    return { source: "parcours", titre: origine.titre, href: origine.href, minutes: null };
  }
  return { source: "defaut", titre: scene, href: hrefFiche("situation", ENTREE_PAR_DEFAUT), minutes: MINUTES_PAR_DEFAUT };
}
