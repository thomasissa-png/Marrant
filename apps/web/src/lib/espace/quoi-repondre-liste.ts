/**
 * s26 liste et détail (`docs/ux/liste-detail-quoi-repondre-s26.md` §0 à §3) : la liste légère de « Quoi répondre »,
 * partagée par le layout (serveur) et la colonne de liste (navigateur). Module sans dépendance (ni schéma zod, ni
 * base) : importable côté client. Les filtres valides sont fournis par le serveur (listes fermées du schéma) ; une
 * valeur inconnue est ignorée, comme `lireFiltres`.
 */

/** Une ligne de la liste : titre, durée, lieu (`sans-lieu` : « Rattraper un faux pas »), buts, « Fait ». */
export interface LigneQuoiRepondre {
  id: string;
  titre: string;
  minutes: number;
  lieu: string;
  /** Univers de la fiche (filtre « Où et avec qui ? »), `null` pour une fiche « à plat ». */
  univers: string | null;
  buts: readonly string[];
  fait: boolean;
}

export interface FiltresListe {
  ou: string | null;
  pour: string | null;
}

export const ADRESSE_LISTE_QUOI_REPONDRE = "/mon-espace/quoi-repondre";

/** Filtres lus dans la query, validés contre les listes fermées données par le serveur. */
export function filtresDeQuery(lire: (cle: string) => string | null, valides: { ou: readonly string[]; pour: readonly string[] }): FiltresListe {
  const ou = lire("ou");
  const pour = lire("pour");
  return { ou: ou && valides.ou.includes(ou) ? ou : null, pour: pour && valides.pour.includes(pour) ? pour : null };
}

/** Query des filtres (`?ou=&pour=`), reportée sur chaque lien de fiche ; chaîne vide sans filtre. */
export function queryFiltres(filtres: FiltresListe): string {
  const q = new URLSearchParams();
  if (filtres.ou) q.set("ou", filtres.ou);
  if (filtres.pour) q.set("pour", filtres.pour);
  const s = q.toString();
  return s ? `?${s}` : "";
}

/** Adresse d'une fiche de la rubrique, filtres compris. */
export const hrefFicheListe = (id: string, filtres: FiltresListe) => `${ADRESSE_LISTE_QUOI_REPONDRE}/${id}${queryFiltres(filtres)}`;

/** Même règle que `filtrerSituations` (serveur), sur les lignes légères. */
export function filtrerLignes<L extends Pick<LigneQuoiRepondre, "univers" | "buts">>(lignes: readonly L[], filtres: FiltresListe): L[] {
  return lignes.filter((l) => (!filtres.ou || l.univers === filtres.ou) && (!filtres.pour || l.buts.includes(filtres.pour)));
}

/**
 * Fiche ouverte d'office (panneau sans id, dès 1024) : la première sans « Fait » dans l'ordre de la liste filtrée,
 * sinon la première du filtre ; `null` seulement quand le filtre est vide.
 */
export function ficheParDefaut<L extends { id: string }>(ordre: readonly L[], faits: ReadonlySet<string>): L | null {
  return ordre.find((l) => !faits.has(l.id)) ?? ordre[0] ?? null;
}

/** Fiche suivante dans l'ordre de la liste filtrée (traverse les lieux) ; `null` : dernière du filtre ou hors filtre. */
export function suivanteDe<L extends { id: string }>(ordre: readonly L[], id: string): L | null {
  const i = ordre.findIndex((l) => l.id === id);
  return i >= 0 && i + 1 < ordre.length ? ordre[i + 1] : null;
}

/**
 * s26 liste et détail, tour 4 (relecture UX F4 : « Situation suivante » sautait une situation non faite, que la page
 * liste proposait pourtant) : la prochaine situation SANS « Fait » dans l'ordre de la liste filtrée, la fiche exclue.
 * - Fiche faite (ou hors filtre) : la première non faite du filtre, celle que la page liste et le panneau d'office
 *   (`ficheParDefaut`) proposent à l'arrivée ; une situation non faite laissée plus haut n'est plus sautée.
 * - Fiche NON faite (l'abonné la passe) : la première non faite APRÈS elle, en reprenant au début du filtre ; sinon deux
 *   fiches non faites se renverraient l'une à l'autre sans fin.
 * Rien d'autre à faire dans le filtre : la règle d'avant (`suivanteDe`, la suivante dans l'ordre, `null` en fin).
 */
export function prochaineNonFaite<L extends { id: string }>(ordre: readonly L[], id: string, faits: ReadonlySet<string>): L | null {
  const i = ordre.findIndex((l) => l.id === id);
  const candidates = i < 0 || faits.has(id) ? ordre : [...ordre.slice(i + 1), ...ordre.slice(0, i)];
  return candidates.find((l) => l.id !== id && !faits.has(l.id)) ?? suivanteDe(ordre, id);
}

/** Clés `sessionStorage` (spec UX §2 et §3) : défilement de la colonne de liste (dès 1024) et de la page liste (< 1024). */
export const cleDefilementListe = (f: FiltresListe) => `qr:liste:${f.ou ?? ""}:${f.pour ?? ""}`;
export const cleDefilementPage = (f: FiltresListe) => `qr:page:${f.ou ?? ""}:${f.pour ?? ""}`;
/** Fiche ouverte depuis la page liste (< 1024) : son « Retour » est alors `router.back()`. */
export const CLE_DEPUIS_LISTE = "qr:depuis-liste";
/** s26 liste et détail, tour 4 : dernière fiche quittée (adresse et heure), pour ramener la page liste sur sa ligne. */
export const CLE_FICHE_QUITTEE = "qr:fiche-quittee";
