/**
 * Caps et bonus, côté serveur (s24, lot D4). Lectures agrégées (une requête par table, pas de N+1),
 * écriture des annonces faites (`CapAnnonce`), recalcul unique silencieux de l'ouverture.
 * Importé seulement par `api/espace/caps`, les pages `/mon-espace/**` (404 interrupteur fermé) et
 * `scripts/recalcul-caps.ts` (lancé à l'ouverture par @infrastructure) : jamais d'écriture fermé.
 */
import type { PrismaClient } from "@prisma/client";
import { getStepXpFromSeed, PATH_COMPLETION_BONUS_XP, effectiveStreak } from "@/lib/progression";
import {
  annoncesAFaire,
  capDepuisXp,
  marquesSilencieuses,
  niveauRecalcule,
  xpDeDeblocage,
  type AnnonceAFaire,
  type BonusRange,
  type MarqueAnnonce,
  type NumeroCap,
  type TypeAnnonce,
} from "@/lib/espace/caps";
import { noterCapsAtteints } from "@/lib/mesure/evenements-espace";
import { isPremiumPlan } from "@/lib/parcours-access";

/** Sous-ensemble Prisma lu et écrit ici (client réel, transaction ou double de test). */
export type DbCaps = Pick<PrismaClient, "user" | "userPathStepCompletion" | "userPathProgress" | "capAnnonce">;

export interface EtatCaps {
  xp: number;
  serie: number;
  capAffiche: NumeroCap;
  capDeblocage: NumeroCap;
  xpDeblocage: number;
  annonce: AnnonceAFaire;
}

/** XP de déblocage d'un compte : étapes validées (table par étape) et parcours terminés. */
export async function lireXpDeblocage(db: DbCaps, userId: string): Promise<number> {
  const [etapes, termines] = await Promise.all([
    db.userPathStepCompletion.findMany({
      where: { userId },
      select: { stepOrder: true, learningPath: { select: { slug: true } } },
    }),
    db.userPathProgress.findMany({
      where: { userId, completedAt: { not: null } },
      select: { learningPath: { select: { slug: true } } },
    }),
  ]);
  return xpDeDeblocage(
    etapes.map((e) => ({ slug: e.learningPath.slug, ordre: e.stepOrder })),
    termines.map((t) => t.learningPath.slug),
    getStepXpFromSeed,
    PATH_COMPLETION_BONUS_XP,
  );
}

/** Cap de déblocage (5.5) : mêmes seuils, sur les seuls XP d'étapes et de bonus de fin. */
export async function lireCapDeblocage(db: DbCaps, userId: string): Promise<NumeroCap> {
  return capDepuisXp(await lireXpDeblocage(db, userId));
}

/**
 * État complet pour la carte « Ton cap » et l'annonce. `bonusRanges` = bonus effectivement rangés
 * (fiches présentes, lot C8) : un bonus absent n'est jamais annoncé.
 */
export async function lireEtatCaps(db: DbCaps, userId: string, bonusRanges: readonly BonusRange[]): Promise<EtatCaps> {
  const [compte, xpDeblocage, faites] = await Promise.all([
    db.user.findUnique({ where: { id: userId }, select: { xp: true, streak: true, lastPracticeAt: true } }),
    lireXpDeblocage(db, userId),
    db.capAnnonce.findMany({ where: { userId }, select: { type: true, numero: true } }),
  ]);
  const xp = compte?.xp ?? 0;
  const capAffiche = capDepuisXp(xp);
  const capDeblocage = capDepuisXp(xpDeblocage);
  return {
    xp,
    serie: compte ? effectiveStreak(compte.streak, compte.lastPracticeAt) : 0,
    capAffiche,
    capDeblocage,
    xpDeblocage,
    annonce: annoncesAFaire({
      capAffiche,
      capDeblocage,
      dejaFaites: faites.map((f) => ({ type: f.type as TypeAnnonce, numero: f.numero as NumeroCap })),
      bonusRanges,
    }),
  };
}

/**
 * Écrit les annonces faites, une ligne par (compte, type, numéro), doublons ignorés. Lot D9 : une annonce
 * de cap MONTRÉE (`silencieux = false`) écrit aussi `cap_atteint` avec le seul numéro ; le recalcul
 * silencieux de l'ouverture n'en écrit aucun.
 */
export async function marquerAnnonces(
  db: DbCaps,
  userId: string,
  marques: readonly MarqueAnnonce[],
  silencieux: boolean,
  maintenant: Date = new Date(),
): Promise<number> {
  if (marques.length === 0) return 0;
  const { count } = await db.capAnnonce.createMany({
    data: marques.map((m) => ({ userId, type: m.type, numero: m.numero, silencieux, annonceLe: maintenant })),
    skipDuplicates: true,
  });
  if (!silencieux) await noterCapsAtteints(userId, marques.filter((m) => m.type === "CAP").map((m) => m.numero));
  return count;
}

export interface BilanRecalcul {
  comptes: number;
  niveauxReleves: number;
  lignesSilencieuses: number;
}

/**
 * Recalcul UNIQUE de l'ouverture (niveaux-xp-s24.md 3.0, 5.4 ; lot D4) : pour chaque compte ABONNÉ ACTIF
 * (plan PREMIUM en base, même notion que la garde de l'espace) ayant des XP ou une étape validée,
 * `User.level` relevé au cap des nouveaux seuils (jamais abaissé), et
 * chaque cap atteint et bonus gagné marqué annoncé en SILENCIEUX (aucune phrase, aucun événement
 * « cap atteint »). `appliquer = false` : lecture seule, bilan seulement. Rejouable sans effet.
 */
export async function recalculerCapsSilencieux(db: DbCaps, appliquer: boolean): Promise<BilanRecalcul> {
  // Lot D10b (minimisation, relecture @reviewer T6 a) : abonnés actifs seulement, pour que la politique de
  // confidentialité (« si tu es abonné ») dise vrai. Filtre en base ET relu ici (une base qui renverrait plus
  // n'écrit rien pour un compte non abonné).
  const lus = await db.user.findMany({
    where: { plan: "PREMIUM", OR: [{ xp: { gt: 0 } }, { pathStepCompletions: { some: {} } }] },
    select: { id: true, xp: true, level: true, plan: true },
  });
  const comptes = lus.filter((c) => isPremiumPlan(c.plan));
  const bilan: BilanRecalcul = { comptes: comptes.length, niveauxReleves: 0, lignesSilencieuses: 0 };
  for (const c of comptes) {
    const niveau = niveauRecalcule(c.level, c.xp);
    const marques = marquesSilencieuses(capDepuisXp(c.xp), capDepuisXp(await lireXpDeblocage(db, c.id)));
    if (niveau !== c.level) bilan.niveauxReleves += 1;
    if (!appliquer) {
      bilan.lignesSilencieuses += marques.length;
      continue;
    }
    if (niveau !== c.level) await db.user.update({ where: { id: c.id }, data: { level: niveau } });
    bilan.lignesSilencieuses += await marquerAnnonces(db, c.id, marques, true);
  }
  return bilan;
}
