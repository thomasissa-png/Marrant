/**
 * Carnet mensuel de situations de répartie (décision Thomas, 03/10/2026).
 *
 * SERVER ONLY : ce module ne doit être importé que par des Server Components ou
 * des routes (le paquet `server-only` n'est pas installé ; un test vérifie
 * qu'aucun fichier "use client" ne l'importe). Le contenu complet des fiches ne
 * doit jamais quitter le serveur pour un visiteur non Premium.
 *
 * Source : un JSON par mois dans `src/data/carnet/AAAA-MM.json`, préparé à
 * l'avance (pas de base, pas d'IA). Les fichiers sont embarqués au build par
 * `require.context` : ajouter un mois = déposer le JSON, rien d'autre à
 * enregistrer. Un mois n'est visible qu'une fois commencé (heure de Paris).
 */
import { z } from "zod";
import { isPremiumPlan } from "@/lib/parcours-access";

declare global {
  namespace NodeJS {
    interface Require {
      /** Fourni par webpack au build (absent sous Jest). */
      context?: (
        directory: string,
        useSubdirectories: boolean,
        regExp: RegExp,
      ) => { keys(): string[]; (id: string): unknown };
    }
  }
}

/** Longueur maximale de l'`accroche` d'une fiche (encart des articles, s21). */
export const CARNET_ACCROCHE_MAX = 110;

const ficheSchema = z.object({
  id: z.string().min(1),
  titre: z.string().min(1),
  contexte: z.string().min(1),
  situation: z.string().min(1),
  onTeDit: z.string().min(1),
  reponse: z.string().min(1),
  pourquoi: z.string().min(1),
  siTendu: z.string().min(1),
  exercice: z.string().min(1),
  /**
   * s21 (blocs d'appel, B1) : LA fiche offerte du mois, lisible en entier sans compte
   * (une seule par carnet). Absente partout : `fiches[0]` sert de repli.
   * Règle de choix (annexe tour 4 §5) : un chambrage adressé au lecteur.
   */
  offerte: z.boolean().optional(),
  /**
   * s21 (B1) : amorce de la situation pour l'encart des articles (`DemoVanne`),
   * « {contexte}. {détail} » ; l'encart y ajoute « , et on te lance : « {onTeDit} » ».
   */
  accroche: z.string().min(1).max(CARNET_ACCROCHE_MAX).optional(),
});

const carnetSchema = z
  .object({
    mois: z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/),
    titre: z.string().min(1),
    intro: z.string().min(1),
    fiches: z.array(ficheSchema).min(1),
  })
  .refine((c) => c.fiches.filter((f) => f.offerte === true).length <= 1, {
    message: "une seule fiche « offerte » par carnet",
    path: ["fiches"],
  });

export type CarnetFiche = z.infer<typeof ficheSchema>;
export type Carnet = z.infer<typeof carnetSchema>;

/** Fiche non offerte, vue par un non-abonné : titre et contexte seulement. */
export interface CarnetFicheApercu {
  id: string;
  titre: string;
  contexte: string;
}

/** Ce qui peut être rendu pour un visiteur donné (jamais plus). */
export interface CarnetView {
  mois: string;
  titre: string;
  intro: string;
  premium: boolean;
  /** Fiches complètes : toutes pour un Premium, la première seulement sinon. */
  fiches: CarnetFiche[];
  /** Fiches réservées, réduites au titre et au contexte (vide pour un Premium). */
  apercus: CarnetFicheApercu[];
  totalFiches: number;
  /** Position réelle de chaque fiche dans le carnet (id → index + 1), offerte comprise. */
  numeros: Record<string, number>;
}

/** Nombre de fiches offertes en entier aux non-abonnés. */
export const CARNET_FREE_FICHES = 1;

/**
 * Fiche offerte du carnet (s21) : celle marquée `offerte`, sinon la première.
 * Seule source de l'accès gratuit : /carnet, l'extrait de /abonnement et l'encart
 * des articles montrent toujours la même fiche.
 */
export function ficheOfferte(carnet: Carnet): CarnetFiche {
  return carnet.fiches.find((f) => f.offerte === true) ?? carnet.fiches[0];
}

/** Valide un contenu brut ; les fichiers invalides sont écartés (et signalés). */
export function parseCarnets(raw: unknown[]): Carnet[] {
  const carnets: Carnet[] = [];
  for (const item of raw) {
    const parsed = carnetSchema.safeParse(item);
    if (parsed.success) carnets.push(parsed.data);
    else console.error("[carnet] fichier invalide écarté :", parsed.error.issues[0]);
  }
  return carnets;
}

function loadCarnetFiles(): unknown[] {
  try {
    const ctx = require.context!("../data/carnet", false, /^\.\/\d{4}-\d{2}\.json$/);
    return ctx.keys().map((key) => ctx(key));
  } catch {
    // Jest : pas de require.context (les tests passent leurs fixtures).
    return [];
  }
}

let cache: Carnet[] | null = null;

/** Tous les carnets embarqués au build, validés. */
export function getAllCarnets(): Carnet[] {
  if (!cache) cache = parseCarnets(loadCarnetFiles());
  return cache;
}

/** Mois courant « AAAA-MM » à Paris (un carnet s'ouvre à minuit, heure française). */
export function currentParisMonth(now: Date = new Date()): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Paris",
    year: "numeric",
    month: "2-digit",
  }).formatToParts(now);
  const year = parts.find((p) => p.type === "year")?.value;
  const month = parts.find((p) => p.type === "month")?.value;
  return `${year}-${month}`;
}

/** Carnets déjà ouverts, du plus récent au plus ancien (les mois futurs restent cachés). */
export function listPublishedCarnets(
  carnets: Carnet[] = getAllCarnets(),
  now: Date = new Date(),
): Carnet[] {
  const current = currentParisMonth(now);
  return carnets
    .filter((c) => c.mois <= current)
    .sort((a, b) => (a.mois < b.mois ? 1 : a.mois > b.mois ? -1 : 0));
}

export function listCarnetMonths(carnets?: Carnet[], now?: Date): string[] {
  return listPublishedCarnets(carnets, now).map((c) => c.mois);
}

/** Carnet courant : le plus récent dont le mois est commencé. */
export function getCurrentCarnet(carnets?: Carnet[], now?: Date): Carnet | null {
  return listPublishedCarnets(carnets, now)[0] ?? null;
}

/** Carnet d'un mois donné, seulement s'il est déjà ouvert. */
export function getCarnetByMonth(mois: string, carnets?: Carnet[], now?: Date): Carnet | null {
  return listPublishedCarnets(carnets, now).find((c) => c.mois === mois) ?? null;
}

/** Vue servie pour ce plan : complète pour un Premium, aperçu sinon. */
export function carnetViewForPlan(carnet: Carnet, plan: string | null | undefined): CarnetView {
  const premium = isPremiumPlan(plan);
  // s21 : la fiche gratuite suit le champ `offerte` (repli : la première) ; les autres
  // restent dans l'ordre du carnet (de la moins tendue à la plus tendue).
  const offerte = ficheOfferte(carnet);
  const offertes = premium ? carnet.fiches : [offerte];
  const reservees = premium ? [] : carnet.fiches.filter((f) => f !== offerte);
  return {
    mois: carnet.mois,
    titre: carnet.titre,
    intro: carnet.intro,
    premium,
    fiches: offertes.map((f) => ({ ...f })),
    apercus: reservees.map((f) => ({ id: f.id, titre: f.titre, contexte: f.contexte })),
    totalFiches: carnet.fiches.length,
    numeros: Object.fromEntries(carnet.fiches.map((f, i) => [f.id, i + 1])),
  };
}

const MOIS_FR = [
  "janvier", "février", "mars", "avril", "mai", "juin",
  "juillet", "août", "septembre", "octobre", "novembre", "décembre",
];

/** « 2026-10 » → « octobre 2026 ». */
export function formatCarnetMonth(mois: string): string {
  const [year, month] = mois.split("-");
  const name = MOIS_FR[Number(month) - 1];
  return name ? `${name} ${year}` : mois;
}

/** Élision devant voyelle : « d'octobre », « de novembre ». */
function avecElision(label: string): string {
  return /^[aeiouâéèêîôû]/i.test(label) ? `d'${label}` : `de ${label}`;
}

/** « 2026-10 » → « d'octobre 2026 », « 2026-11 » → « de novembre 2026 » (élision). */
export function deCarnetMonth(mois: string): string {
  return avecElision(formatCarnetMonth(mois));
}

/**
 * « 2026-10 » → « d'octobre », « 2026-11 » → « de novembre » : nom du mois seul,
 * sans l'année (extrait du carnet sur /abonnement, lot 2 s21). Mois invalide : null.
 */
export function deMoisSeul(mois: string): string | null {
  const name = MOIS_FR[Number(mois.split("-")[1]) - 1];
  return name ? avecElision(name) : null;
}

/** Extrait du carnet affiché sur /abonnement : la fiche offerte du mois en cours. */
export interface CarnetExtrait {
  mois: string;
  fiche: CarnetFiche;
  totalFiches: number;
  /** Position réelle de la fiche offerte dans le carnet (index + 1). */
  numero: number;
}

/**
 * Fiche offerte à tous (`ficheOfferte`, s21) du carnet du mois
 * en cours à Paris. Null si le carnet du mois n'est pas encore déposé : le bloc
 * ne doit jamais montrer le carnet d'un mois passé comme « du mois » (condition
 * de mise en ligne du duel carnet, lot 2 s21 tour 2).
 */
export function getCarnetExtrait(carnets?: Carnet[], now: Date = new Date()): CarnetExtrait | null {
  const carnet = getCurrentCarnet(carnets, now);
  if (!carnet || carnet.mois !== currentParisMonth(now)) return null;
  const fiche = ficheOfferte(carnet);
  if (!fiche) return null;
  return {
    mois: carnet.mois,
    fiche: { ...fiche },
    totalFiches: carnet.fiches.length,
    numero: carnet.fiches.indexOf(fiche) + 1,
  };
}

/** Encart des articles (s21, B1) : le strict nécessaire de la fiche offerte, rien de plus. */
export interface CarnetDemo {
  mois: string;
  fiche: { id: string; titre: string; accroche: string; onTeDit: string };
  totalFiches: number;
}

/**
 * Fiche offerte du mois en cours pour l'encart `DemoVanne` des articles. Null si le
 * carnet du mois n'est pas déposé ou si la fiche offerte n'a pas d'`accroche` :
 * l'encart ne s'affiche pas (vide propre, spec §2.6), jamais une situation de substitution.
 * La réplique n'en sort pas : elle se lit sur /carnet, au clic.
 */
export function getCarnetDemo(carnets?: Carnet[], now: Date = new Date()): CarnetDemo | null {
  const extrait = getCarnetExtrait(carnets, now);
  const accroche = extrait?.fiche.accroche;
  if (!extrait || !accroche) return null;
  const { id, titre, onTeDit } = extrait.fiche;
  return { mois: extrait.mois, fiche: { id, titre, accroche, onTeDit }, totalFiches: extrait.totalFiches };
}
