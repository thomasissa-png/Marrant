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
});

const carnetSchema = z.object({
  mois: z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/),
  titre: z.string().min(1),
  intro: z.string().min(1),
  fiches: z.array(ficheSchema).min(1),
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
}

/** Nombre de fiches offertes en entier aux non-abonnés. */
export const CARNET_FREE_FICHES = 1;

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
  const offertes = premium ? carnet.fiches : carnet.fiches.slice(0, CARNET_FREE_FICHES);
  const reservees = premium ? [] : carnet.fiches.slice(CARNET_FREE_FICHES);
  return {
    mois: carnet.mois,
    titre: carnet.titre,
    intro: carnet.intro,
    premium,
    fiches: offertes.map((f) => ({ ...f })),
    apercus: reservees.map((f) => ({ id: f.id, titre: f.titre, contexte: f.contexte })),
    totalFiches: carnet.fiches.length,
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
