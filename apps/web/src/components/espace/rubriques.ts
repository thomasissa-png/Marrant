import { ESPACE_ACCUEIL } from "@/config/espace-client";
import { PREMIUM_PARCOURS } from "@/config/premium";
import { TEXTES_ESPACE_NAVIGATION as T } from "@/config/textes/espace-navigation";
import { LIBELLE_SECTION_ARTICLES } from "@/config/textes/cta-articles-accueil";
import { TEXTES_LETTRE } from "@/config/textes/lettre-s21";

/**
 * Navigation v6 (s25, `docs/ux/navigation-v6-menu-rubriques.md`, maquette D validée le 15/11) : liste de la bande
 * des rubriques (§1, ordre unique pour les 3 états), rubrique allumée (§4, une seule fonction pour tous les états)
 * et parent de chaque page de détail de l'espace (« Retour : … », gardé sur les pages A ; supprimé sur les pages de
 * premier niveau, la bande est le retour).
 * Tout est fixé par l'adresse seule : ni état de session, ni paramètre d'adresse.
 * Module sans dépendance serveur : importable par l'en-tête (client) et les pages (serveur).
 */
export type CleRubrique =
  | "aujourdhui"
  | "parcours"
  | "quoiRepondre"
  | "bibliotheque"
  | "sEntrainer"
  | "vannes"
  | "conseils"
  | "videos"
  | "articles"
  | "lettre"
  | "favoris"
  | "carnet"
  | "mesQuestions"
  | "mesRepliques";

/** 1 : espace Premium ; 2 : gratuit pour tous ; 3 : raccourcis ; « plus » : liste du bouton « … ». */
export type GroupeRubrique = 1 | 2 | 3 | "plus";

export interface Rubrique {
  cle: CleRubrique;
  href: string;
  label: string;
  groupe: GroupeRubrique;
}

/** Bande des rubriques, dans l'ordre du §1 (mêmes adresses pour tous : le non-abonné y trouve l'aperçu). */
export const RUBRIQUES: readonly Rubrique[] = [
  { cle: "aujourdhui", href: ESPACE_ACCUEIL, label: T.bande.aujourdhui, groupe: 1 },
  { cle: "parcours", href: "/parcours", label: T.parcours, groupe: 1 },
  { cle: "quoiRepondre", href: `${ESPACE_ACCUEIL}/quoi-repondre`, label: T.index.quoiRepondre, groupe: 1 },
  { cle: "bibliotheque", href: `${ESPACE_ACCUEIL}/bibliotheque`, label: T.index.bibliotheque, groupe: 1 },
  { cle: "sEntrainer", href: `${ESPACE_ACCUEIL}/s-entrainer`, label: T.index.sEntrainer, groupe: 1 },
  { cle: "vannes", href: "/vannes", label: "Vannes", groupe: 2 },
  { cle: "conseils", href: "/conseils", label: "Conseils", groupe: 2 },
  { cle: "videos", href: "/videos", label: "Vidéos", groupe: 2 },
  { cle: "articles", href: "/blog", label: LIBELLE_SECTION_ARTICLES, groupe: 2 },
  { cle: "lettre", href: "/lettre", label: TEXTES_LETTRE.menu, groupe: 2 },
  { cle: "favoris", href: "/favoris", label: T.index.favoris, groupe: 3 },
  { cle: "carnet", href: "/carnet", label: T.index.carnet, groupe: 3 },
  { cle: "mesQuestions", href: `${ESPACE_ACCUEIL}/questions`, label: T.index.mesQuestions, groupe: "plus" },
  { cle: "mesRepliques", href: `${ESPACE_ACCUEIL}/repliques`, label: T.index.mesRepliques, groupe: "plus" },
];

/**
 * Rubrique payante (cadenas et nom « {rubrique}, rubrique Premium » pour le non-abonné, §2). Favoris aussi (arbitrage
 * de la session du 15/11 : `/favoris` est réservé à l'abonné par le middleware ; page d'aperçu au lot B).
 */
export const estPremium = (r: Rubrique) => r.groupe === 1 || r.groupe === "plus" || r.cle === "favoris";

const rubrique = (cle: CleRubrique) => RUBRIQUES.find((r) => r.cle === cle) as Rubrique;

/** Page exacte ou sous-page (`/blog/<slug>` garde « Articles »). Même règle que `isActivePath` du site. */
export function sousAdresse(pathname: string | null, href: string): boolean {
  if (!pathname) return false;
  return pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));
}

/** Types de fiche rangés par rubrique (§4 ; `a-plat`, `jeu`, `seance` comme dans la v5 §7, FD4). */
const FICHES_PAR_RUBRIQUE: Record<string, CleRubrique> = {
  situation: "quoiRepondre",
  "a-plat": "quoiRepondre",
  jeu: "sEntrainer",
  seance: "sEntrainer",
  construction: "bibliotheque",
  vocabulaire: "bibliotheque",
  formule: "bibliotheque",
  ecouter: "bibliotheque",
  "humour-noir": "bibliotheque",
};

/** Parcours d'un bilan, déduit de l'identifiant de la fiche (`bilan-repartie` : `repartie`, §4.3). */
export function parcoursDuBilan(idFiche: string): { slug: string; nom: string } | null {
  const slug = idFiche.replace(/^bilan-/, "");
  const p = PREMIUM_PARCOURS.find((x) => x.slug === slug);
  return p ? { slug: p.slug, nom: p.name } : null;
}

export interface Parent {
  href: string;
  label: string;
}

/**
 * Parent d'une page de l'espace (« Retour : {label} »), ou `null`. v6 §4 : gardé sur les pages A (fiches, bonus,
 * question, lettre), qui ramènent à leur liste ; rien sur Aujourd'hui ni sur les rubriques de la bande (la bande est
 * le retour). `/mon-espace/lettres` (308 vers `/lettre` depuis le lot C) et ses lettres ramènent à « La lettre ».
 */
export function parentEspace(pathname: string | null): Parent | null {
  if (!pathname || !pathname.startsWith(`${ESPACE_ACCUEIL}/`)) return null;
  const [, , section, type, id] = pathname.split("/");
  const vers = (cle: CleRubrique): Parent => ({ href: rubrique(cle).href, label: rubrique(cle).label });
  if (section === "fiche") {
    if (type === "bilan") {
      const p = id ? parcoursDuBilan(decodeURIComponent(id)) : null;
      return p ? { href: `/parcours/${p.slug}`, label: p.nom } : vers("parcours");
    }
    const cle = type ? FICHES_PAR_RUBRIQUE[type] : undefined;
    return cle ? vers(cle) : null;
  }
  if (section === "bonus" && type) return vers("bibliotheque");
  // s26 liste et détail : une fiche de Quoi répondre (`/mon-espace/quoi-repondre/[id]`) ramène à sa liste.
  if (section === "quoi-repondre" && type) return vers("quoiRepondre");
  // Lot C (s25) : `/mon-espace/lettres` renvoie en 308 vers `/lettre`, qui sert l'archive à l'abonné.
  if (section === "lettres") return vers("lettre");
  if (section === "questions" && type) return vers("mesQuestions");
  return null;
}

export type EtatLecteur = "visiteur" | "gratuit" | "abonne";

/**
 * Rubrique allumée (v6 §4, une seule fonction pour les 3 états) : la clé d'une rubrique de la bande (une rubrique du
 * groupe « plus » allume « … »), « compte » sur `/profil`, `null` ailleurs (accueil, abonnement, pages hors rubrique).
 */
export function rubriqueAllumee(pathname: string | null): CleRubrique | "compte" | null {
  if (!pathname) return null;
  if (pathname === "/profil") return "compte";
  if (pathname === ESPACE_ACCUEIL) return "aujourdhui";
  if (sousAdresse(pathname, ESPACE_ACCUEIL)) {
    const [, , section, type] = pathname.split("/");
    if (section === "fiche") return type === "bilan" ? "parcours" : (type && FICHES_PAR_RUBRIQUE[type]) || null;
    // s26 liste et détail : `/mon-espace/quoi-repondre/[id]` allume Quoi répondre (sous-adresse de la rubrique).
    if (section === "quoi-repondre") return "quoiRepondre";
    if (section === "bonus") return "bibliotheque";
    if (section === "lettres") return "lettre";
  }
  for (const r of RUBRIQUES) {
    if (r.cle !== "aujourdhui" && sousAdresse(pathname, r.href)) return r.cle;
  }
  return null;
}
