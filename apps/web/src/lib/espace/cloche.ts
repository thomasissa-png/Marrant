/**
 * Contenu du panneau de la cloche (s24, lot D8 ; architecture v20 2.9 ; étalon E5 §1.5, `aujourdhui.html`).
 *
 * - Pastille et nom du bouton : le nombre de fils dont la réponse de l'équipe n'est pas lue (état « lu »
 *   = `EquipeFil.ouvertParAbonneLe`, posé à l'ouverture du FIL, jamais à celle du panneau). Jamais le
 *   nombre de lignes du panneau.
 * - « L'équipe t'a répondu » : une ligne par fil non ouvert (type du fil, date de la réponse, lien vers le fil).
 * - Nouveautés, calculées à la volée, SANS état « lu » (aucune migration) :
 *   « Nouveau ce mois-ci » : le carnet du mois (publié le 1er du mois), les fiches neuves portant
 *   `publieLe` (situations : « De nouvelles situations » ; constructions, vocabulaire, formules, écoute et
 *   humour noir : « Nouveau dans la Bibliothèque », sans nom de sujet) ; « Nouvelle lettre » le seul jour
 *   de son premier envoi réussi (`lib/espace/lettres.ts` : jamais avant l'envoi).
 * - Plafond de regroupement (2.9 : une ligne par jour, au plus une par type et par semaine) : lu ici au plus
 *   strict, une ligne par type sur le mois (le groupe dit « ce mois-ci » : deux lignes identiques ne
 *   s'afficheraient jamais) et une ligne par jour ; les 5 dernières nouveautés au plus, lettre comprise.
 * - Jamais un bonus de cap (les chargeurs de fiches ne le servent dans aucune liste), jamais une fiche
 *   reprise d'une lettre pas encore envoyée, jamais une date future. Aucun e-mail, aucune notification
 *   du navigateur ou du téléphone, rien qui naisse de l'absence de l'abonné.
 */
import { prisma } from "@/lib/prisma";
import { currentParisMonth, getAllCarnets, listPublishedCarnets, type Carnet } from "@/lib/carnet";
import { chargeursFiches, type creerChargeurs } from "@/lib/espace/fiches";
import type { TypeFiche } from "@/lib/espace/fiches-schema";
import { envoyeesSiBesoin, fichesVisibles, listerLettres, type DbLettres } from "@/lib/espace/lettres";
import { reponsesNonLues } from "@/lib/espace/questions";
import type { ContenuCloche, GenreNouveaute, LigneLettre, LigneNouveaute } from "@/lib/espace/cloche-types";
import { ESPACE_ACCUEIL } from "@/config/espace-client";

export type { ContenuCloche, GenreNouveaute, LigneLettre, LigneNouveaute, LigneReponse } from "@/lib/espace/cloche-types";

/** Les 5 dernières nouveautés au plus, lettre du jour comprise (2.9). */
export const NOUVEAUTES_MAX = 5;

/** Types de fiche annoncés, et leur ligne. Jeux, séances, bilans et « à plat » ne sont pas listés par 2.9. */
export const GENRE_PAR_TYPE: Partial<Record<TypeFiche, Exclude<GenreNouveaute, "carnet">>> = {
  situation: "situations",
  construction: "bibliotheque",
  vocabulaire: "bibliotheque",
  formule: "bibliotheque",
  ecouter: "bibliotheque",
  "humour-noir": "bibliotheque",
};

export const HREF_GENRE: Record<Exclude<GenreNouveaute, "carnet">, string> = {
  situations: `${ESPACE_ACCUEIL}/quoi-repondre`,
  bibliotheque: `${ESPACE_ACCUEIL}/bibliotheque`,
};

const ORDRE: GenreNouveaute[] = ["carnet", "situations", "bibliotheque"];
const PARIS = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Paris", year: "numeric", month: "2-digit", day: "2-digit" });

/** Jour civil de Paris, « AAAA-MM-JJ ». */
export const jourDeParis = (d: Date): string => PARIS.format(d);

/**
 * Plafond de regroupement : nouveautés du mois de Paris en cours, publiées au plus tard aujourd'hui ; la plus
 * récente d'abord ; une ligne par type ; une ligne par jour (à jour égal, l'ordre carnet, situations,
 * Bibliothèque) ; `max` lignes au plus.
 */
export function regrouper(evenements: readonly LigneNouveaute[], maintenant: Date, max: number = NOUVEAUTES_MAX): LigneNouveaute[] {
  const aujourdhui = jourDeParis(maintenant);
  const mois = aujourdhui.slice(0, 7);
  const tries = evenements
    .filter((e) => e.le <= aujourdhui && e.le.startsWith(mois))
    .sort((a, b) => b.le.localeCompare(a.le) || ORDRE.indexOf(a.genre) - ORDRE.indexOf(b.genre));
  const genres = new Set<GenreNouveaute>();
  const jours = new Set<string>();
  const lignes: LigneNouveaute[] = [];
  for (const e of tries) {
    if (lignes.length >= max) break;
    if (genres.has(e.genre) || jours.has(e.le)) continue;
    genres.add(e.genre);
    jours.add(e.le);
    lignes.push(e);
  }
  return lignes;
}

/** Le carnet du mois de Paris, s'il est publié : nouveauté datée du 1er du mois. */
export function nouveauteCarnet(carnets: Carnet[], maintenant: Date): LigneNouveaute | null {
  const mois = currentParisMonth(maintenant);
  const carnet = listPublishedCarnets(carnets, maintenant).find((c) => c.mois === mois);
  return carnet ? { genre: "carnet", le: `${mois}-01`, href: `/carnet/${mois}` } : null;
}

/** Fiches neuves (`publieLe`) des types annoncés, hors reprises de lettres pas encore envoyées. */
export async function nouveautesFiches(
  userId: string,
  maintenant: Date,
  db: DbLettres = prisma,
  chargeurs: ReturnType<typeof creerChargeurs> = chargeursFiches,
): Promise<LigneNouveaute[]> {
  const acces = { acces: "ouvert" as const, userId };
  const fiches = (Object.keys(GENRE_PAR_TYPE) as TypeFiche[]).flatMap((type) => chargeurs.listerFiches(type, acces)).filter((f) => f.publieLe);
  if (fiches.length === 0) return [];
  const visibles = fichesVisibles(fiches, await envoyeesSiBesoin(db, fiches, maintenant));
  return visibles.map((f) => {
    const genre = GENRE_PAR_TYPE[f.type]!;
    return { genre, le: f.publieLe!, href: HREF_GENRE[genre] };
  });
}

/** Lettre du jour : la plus récente envoyée aujourd'hui (Paris), sinon rien. */
export async function lettreDuJour(maintenant: Date, db: DbLettres = prisma): Promise<LigneLettre | null> {
  const aujourdhui = jourDeParis(maintenant);
  const l = (await listerLettres(db, maintenant)).find((x) => jourDeParis(x.envoyeeLe) === aujourdhui);
  return l ? { numero: l.numero, titre: l.titre, href: `${ESPACE_ACCUEIL}/lettres/${l.numero}` } : null;
}

/** Tout le contenu du panneau pour un abonné actif. */
export async function lireCloche(userId: string, maintenant: Date = new Date()): Promise<ContenuCloche> {
  const [reponses, fiches, lettre] = await Promise.all([reponsesNonLues(userId), nouveautesFiches(userId, maintenant), lettreDuJour(maintenant)]);
  const carnet = nouveauteCarnet(getAllCarnets(), maintenant);
  const nouveautes = regrouper([...(carnet ? [carnet] : []), ...fiches], maintenant, NOUVEAUTES_MAX - (lettre ? 1 : 0));
  return {
    nonLues: reponses.length,
    reponses: reponses.map((r) => ({ ...r, href: `${ESPACE_ACCUEIL}/questions/${r.id}` })),
    nouveautes,
    lettre,
  };
}
