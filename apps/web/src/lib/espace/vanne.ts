/**
 * Toucher de la vanne du contenu du jour, « Ce soir, c'est plutôt ? » (s24, lot D3 ; architecture
 * v20 4.4) et son capteur anonyme (7.7). Serveur seulement.
 *
 * - Catégories du toucher : soirée, boulot, famille, rencard (`JokeCategory` SOIREES, BOULOT,
 *   PARENTS, DATING) ; « Peu importe » = la vanne du jour.
 * - Tirage de « Une autre » dans la catégorie : d'abord les vannes déjà servies au contenu du jour,
 *   puis les autres actives ; jamais une vanne `humourNoir` ; jamais une vanne déjà montrée pendant
 *   la visite (liste tenue par le navigateur, rien sur le compte) ; aucune vanne n'est marquée
 *   comme servie (le stock d'inédits de `/api/health` n'est pas consommé).
 * - Réponse : texte de la vanne seulement (aucun exercice, aucun champ interne).
 * - Seuil minimal par catégorie : FIXÉ PAR LA LECTURE EN BASE (`scripts/lecture-vannes-categories.ts`),
 *   jamais supposé. Tant qu'il n'est pas fixé (null), aucune catégorie n'est proposée et seul
 *   « Une autre » reste (règle 4.4 : « si aucune catégorie n'atteint le seuil »).
 */
import type { JokeCategory, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export const CATEGORIES_TOUCHER = ["soiree", "boulot", "famille", "rencard"] as const;
export type CategorieToucher = (typeof CATEGORIES_TOUCHER)[number];

export const CATEGORIE_EN_BASE: Record<CategorieToucher, JokeCategory> = {
  soiree: "SOIREES",
  boulot: "BOULOT",
  famille: "PARENTS",
  rencard: "DATING",
};

/** [À FIXER : lecture en base de production, `scripts/lecture-vannes-categories.ts`, @data-analyst.] */
export const SEUIL_TOUCHER: number | null = null;

/** Exclusion du repérage humour noir (3.12), partagée avec la vanne du jour. */
export const HORS_HUMOUR_NOIR = { humourNoir: false } satisfies Prisma.JokeWhereInput;

const VANNE_TIRABLE = { isActive: true, ...HORS_HUMOUR_NOIR } satisfies Prisma.JokeWhereInput;

export type VanneToucher = { id: string; content: string; punchline: string };
const SELECT_VANNE = { id: true, content: true, punchline: true } satisfies Prisma.JokeSelect;

/** Catégories proposées : celles dont le nombre de vannes tirables atteint le seuil. */
export async function categoriesProposees(seuil: number | null = SEUIL_TOUCHER): Promise<CategorieToucher[]> {
  if (seuil === null) return [];
  const groupes = await prisma.joke.groupBy({
    by: ["category"],
    where: { ...VANNE_TIRABLE, category: { in: Object.values(CATEGORIE_EN_BASE) } },
    _count: { _all: true },
  });
  const nombre = new Map(groupes.map((g) => [g.category, g._count._all]));
  // « hors la vanne affichée » : une de moins que le stock.
  return CATEGORIES_TOUCHER.filter((c) => (nombre.get(CATEGORIE_EN_BASE[c]) ?? 0) - 1 >= seuil);
}

async function tirerDans(where: Prisma.JokeWhereInput): Promise<VanneToucher | null> {
  const total = await prisma.joke.count({ where });
  if (total === 0) return null;
  return prisma.joke.findFirst({ where, orderBy: { id: "asc" }, skip: Math.floor(Math.random() * total), select: SELECT_VANNE });
}

/** « Une autre » : déjà servies au contenu du jour d'abord, puis les autres actives. null = le tour est fait. */
export async function tirerVanne(categorie: CategorieToucher | null, dejaVues: readonly string[]): Promise<VanneToucher | null> {
  const base: Prisma.JokeWhereInput = {
    ...VANNE_TIRABLE,
    ...(categorie ? { category: CATEGORIE_EN_BASE[categorie] } : {}),
    ...(dejaVues.length > 0 ? { id: { notIn: [...dejaVues] } } : {}),
  };
  return (await tirerDans({ ...base, dailyContents: { some: {} } })) ?? tirerDans({ ...base, dailyContents: { none: {} } });
}

/** Capteur anonyme : liste fermée de clés et de valeurs, aucun identifiant d'abonné. */
export const CLES_COMPTEUR = ["toucher", "une-autre"] as const;
export const VALEURS_COMPTEUR = [...CATEGORIES_TOUCHER, "peu-importe"] as const;
export type CleCompteur = (typeof CLES_COMPTEUR)[number];
export type ValeurCompteur = (typeof VALEURS_COMPTEUR)[number];

/** Jour UTC (date seule) du compteur. */
export function jourCompteur(maintenant: Date = new Date()): Date {
  return new Date(Date.UTC(maintenant.getUTCFullYear(), maintenant.getUTCMonth(), maintenant.getUTCDate()));
}

export async function compter(cle: CleCompteur, valeur: ValeurCompteur, maintenant: Date = new Date()): Promise<void> {
  const jour = jourCompteur(maintenant);
  await prisma.espaceCompteur.upsert({
    where: { jour_cle_valeur: { jour, cle, valeur } },
    update: { n: { increment: 1 } },
    create: { jour, cle, valeur, n: 1 },
  });
}
