import { ESPACE_ACCUEIL } from "@/config/espace-client";
import { PREMIUM_PARCOURS } from "@/config/premium";
import { TEXTES_ESPACE_NAVIGATION as T } from "@/config/textes/espace-navigation";

/**
 * Navigation de l'espace dans l'en-tête unique du site (s24, `docs/ux/navigation-universelle-s24.md` v5,
 * §1, §4) : index de « Mon espace » (8 rubriques, carte « Dans ton espace » et menu mobile), parent de
 * chaque page (« Retour : … », §4.3) et élément allumé (barre et menu mobile, tableau du §1).
 * Tout est fixé par l'adresse seule : ni état de session, ni paramètre d'adresse.
 * Module sans dépendance serveur : importable par l'en-tête (client) et les pages (serveur).
 */
export type CleIndex = "quoiRepondre" | "bibliotheque" | "mesQuestions" | "sEntrainer" | "mesRepliques" | "lettres" | "favoris" | "carnet";

export interface EntreeIndex {
  cle: CleIndex;
  href: string;
  label: string;
}

/** Index de « Mon espace », dans l'ordre du §4.2 (une colonne de lignes de 44 px). */
export const INDEX_ESPACE: readonly EntreeIndex[] = [
  { cle: "quoiRepondre", href: `${ESPACE_ACCUEIL}/quoi-repondre`, label: T.index.quoiRepondre },
  { cle: "bibliotheque", href: `${ESPACE_ACCUEIL}/bibliotheque`, label: T.index.bibliotheque },
  { cle: "mesQuestions", href: `${ESPACE_ACCUEIL}/questions`, label: T.index.mesQuestions },
  { cle: "sEntrainer", href: `${ESPACE_ACCUEIL}/s-entrainer`, label: T.index.sEntrainer },
  { cle: "mesRepliques", href: `${ESPACE_ACCUEIL}/repliques`, label: T.index.mesRepliques },
  { cle: "lettres", href: `${ESPACE_ACCUEIL}/lettres`, label: T.index.lettres },
  { cle: "favoris", href: "/favoris", label: T.index.favoris },
  { cle: "carnet", href: "/carnet", label: T.index.carnet },
];

const entree = (cle: CleIndex) => INDEX_ESPACE.find((e) => e.cle === cle) as EntreeIndex;

/** Page exacte ou sous-page (`/blog/<slug>` garde « Articles »). Même règle que `isActivePath` du site. */
export function sousAdresse(pathname: string | null, href: string): boolean {
  if (!pathname) return false;
  return pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));
}

/** Types de fiche rangés par rubrique (§4.3 ; `a-plat`, `jeu`, `seance` comme dans la v5 §7, FD4). */
const FICHES_PAR_RUBRIQUE: Record<string, CleIndex> = {
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
  /** Ligne du menu mobile allumée sur cette page (§1 : page A, la ligne de son parent). */
  ligne: CleIndex | "parcours" | "monEspace";
}

/**
 * Parent d'une page de l'espace (« Retour : {label} », §4.3), ou `null` : Aujourd'hui, pages publiques
 * (`/favoris`, `/carnet` gardent leurs repères publics), adresse inconnue.
 */
export function parentEspace(pathname: string | null): Parent | null {
  if (!pathname || !pathname.startsWith(`${ESPACE_ACCUEIL}/`)) return null;
  const [, , section, type, id] = pathname.split("/");
  const versIndex = (cle: CleIndex): Parent => ({ href: entree(cle).href, label: entree(cle).label, ligne: cle });
  if (section === "fiche") {
    if (type === "bilan") {
      const p = id ? parcoursDuBilan(decodeURIComponent(id)) : null;
      return p ? { href: `/parcours/${p.slug}`, label: p.nom, ligne: "parcours" } : { href: "/parcours", label: T.parcours, ligne: "parcours" };
    }
    const cle = type ? FICHES_PAR_RUBRIQUE[type] : undefined;
    return cle ? versIndex(cle) : null;
  }
  if (section === "bonus" && type) return versIndex("bibliotheque");
  if (section === "lettres" && type) return versIndex("lettres");
  if (section === "questions" && type) return versIndex("mesQuestions");
  // Pages B de l'espace et S'entraîner (C) : « Retour : Mon espace ».
  const rubrique = INDEX_ESPACE.find((e) => e.href === `${ESPACE_ACCUEIL}/${section}`);
  if (rubrique && !type) return { href: ESPACE_ACCUEIL, label: T.monEspace, ligne: rubrique.cle };
  return null;
}

/**
 * Ligne allumée du menu mobile de l'abonné (§1) : sur une rubrique de l'index, sa propre ligne ; sur une
 * page A, la ligne de son parent ; « Mon espace » seulement sur Aujourd'hui. `null` : aucune ligne de
 * l'espace (les liens du site s'allument par leur adresse).
 */
export function ligneEspaceAllumee(pathname: string | null): CleIndex | "monEspace" | null {
  if (!pathname) return null;
  if (pathname === ESPACE_ACCUEIL) return "monEspace";
  if (sousAdresse(pathname, "/carnet")) return "carnet";
  if (pathname === "/favoris") return "favoris";
  const parent = parentEspace(pathname);
  if (!parent || parent.ligne === "parcours") return null;
  return parent.ligne;
}

export type EtatLecteur = "visiteur" | "gratuit" | "abonne";

/** Élément de la barre allumé (§1) : « monEspace », « compte », l'adresse d'un lien du site, ou `null`. */
export function elementBarreAllume(pathname: string | null, etat: EtatLecteur): string | null {
  if (!pathname) return null;
  if (etat === "abonne") {
    if (sousAdresse(pathname, `${ESPACE_ACCUEIL}/fiche/bilan`)) return "/parcours";
    if (sousAdresse(pathname, ESPACE_ACCUEIL) || sousAdresse(pathname, "/carnet") || pathname === "/favoris") return "monEspace";
    if (sousAdresse(pathname, "/lettre")) return null;
  }
  if (pathname === "/profil" || (etat === "gratuit" && pathname === "/favoris")) return "compte";
  for (const href of ["/parcours", "/vannes", "/conseils", "/videos", "/blog", "/lettre"]) {
    if (sousAdresse(pathname, href)) return href;
  }
  return null;
}
