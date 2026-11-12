import { ESPACE_ACCUEIL } from "@/config/espace-client";
import { TEXTES_ESPACE_NAVIGATION as T } from "@/config/textes/espace-navigation";
import { isActivePath } from "@/components/layout/mobile-nav";

/**
 * Rubriques de la barre de l'espace (décision C1, architecture v20 §6.2) et lignes du
 * menu « Plus ». Adresses : celles du plan (`plan-developpement-s24.md` lots D3 à D7) ;
 * les rubriques de contenu pointent vers les URL publiques existantes (aucune copie).
 */
export type CleRubrique = "aujourdhui" | "parcours" | "quoiRepondre" | "bibliotheque" | "mesQuestions" | "plus";

export interface Rubrique {
  cle: Exclude<CleRubrique, "plus">;
  href: string;
  label: string;
  /** Autres adresses dont cette rubrique est la porte (onglet actif). */
  portes?: string[];
}

export const RUBRIQUES: readonly Rubrique[] = [
  { cle: "aujourdhui", href: ESPACE_ACCUEIL, label: T.rubriques.aujourdhui },
  { cle: "parcours", href: "/parcours", label: T.rubriques.parcours },
  { cle: "quoiRepondre", href: `${ESPACE_ACCUEIL}/quoi-repondre`, label: T.rubriques.quoiRepondre, portes: ["/carnet"] },
  {
    cle: "bibliotheque",
    href: `${ESPACE_ACCUEIL}/bibliotheque`,
    label: T.rubriques.bibliotheque,
    // [HYPOTHÈSE] le catalogue public a pour porte le bloc « Vannes, conseils, vidéos » (6.2).
    portes: ["/vannes", "/conseils", "/videos"],
  },
  { cle: "mesQuestions", href: `${ESPACE_ACCUEIL}/questions`, label: T.rubriques.mesQuestions },
];

export interface LigneMenuPlus {
  href: string;
  label: string;
}

export interface GroupeMenuPlus {
  /** Titre de groupe (absent pour « S'entraîner », ligne seule en tête). */
  titre?: string;
  lignes: LigneMenuPlus[];
}

/** Menu « Plus » : 3 groupes (6.2, maquette `aujourdhui.html#plus`). */
export const MENU_PLUS: readonly GroupeMenuPlus[] = [
  { lignes: [{ href: `${ESPACE_ACCUEIL}/s-entrainer`, label: T.menuPlus.sEntrainer }] },
  {
    titre: T.menuPlus.groupeMonContenu,
    lignes: [
      { href: "/favoris", label: T.menuPlus.favoris },
      { href: `${ESPACE_ACCUEIL}/repliques`, label: T.menuPlus.mesRepliques },
    ],
  },
  {
    titre: T.menuPlus.groupeLeReste,
    lignes: [
      { href: `${ESPACE_ACCUEIL}/lettres`, label: T.menuPlus.lettres },
      { href: "/blog", label: T.menuPlus.articles },
      { href: "/quiz-humour", label: T.menuPlus.quiz },
    ],
  },
];

/**
 * Rubrique courante (`aria-current="page"`), ou `null` (accueil du site, `/profil`,
 * adresse inexistante : aucune rubrique). « Aujourd'hui » seulement sur `/mon-espace` exact.
 */
export function rubriqueActive(pathname: string | null): CleRubrique | null {
  if (!pathname) return null;
  if (pathname === ESPACE_ACCUEIL) return "aujourdhui";
  for (const r of RUBRIQUES) {
    if (r.cle === "aujourdhui") continue;
    if ([r.href, ...(r.portes ?? [])].some((h) => isActivePath(pathname, h))) return r.cle;
  }
  const lignesPlus = MENU_PLUS.flatMap((g) => g.lignes);
  if (lignesPlus.some((l) => isActivePath(pathname, l.href))) return "plus";
  return null;
}
