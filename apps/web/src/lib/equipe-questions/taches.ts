/**
 * « Ta question à l'équipe » : tâche planifiée (chaque tick du planificateur).
 *
 * 1. Alerte « question reçue » à l'adresse d'administration configurée :
 *    groupée, au plus `ALERTE_ARRIVEE_MAX_PAR_JOUR` e-mail par jour de Paris
 *    (règle du 06/10 : moins d'e-mails ; une question arrivée après l'e-mail
 *    du jour part dans celui du lendemain, toujours bien avant 48 h).
 * 2. Alerte « échéance proche » : une fois par question, quand il reste moins
 *    de `ALERTE_ECHEANCE_HEURES_RESTANTES` heures sans réponse envoyée
 *    (non plafonnée : c'est l'action urgente de la journée).
 * 3. Mode `relecture_automatique` SEULEMENT : envoi des réponses relues par la
 *    grille. En `validation_humaine` (défaut), cette étape ne fait rien.
 * 4. Purge (@legal Q3) : questions des comptes sans Premium depuis plus de
 *    `CONSERVATION_MOIS_APRES_FIN` mois.
 */
import { prisma } from "@/lib/prisma";
import {
  ALERTE_ECHEANCE_HEURES_RESTANTES,
  CONSERVATION_MOIS_APRES_FIN,
  modeValidation,
} from "@/config/equipe-questions";
import { envoyerAlerteAdmin } from "./emails";
import { envoyerReponse } from "./circuit";
import { estPremium } from "./regles";

export const ALERTE_ARRIVEE_MAX_PAR_JOUR = 1;
const EN_COURS = ["RECUE", "BROUILLON", "RELUE"] as const;

function jourParis(d: Date): string {
  return new Intl.DateTimeFormat("fr-CA", { timeZone: "Europe/Paris" }).format(d);
}

export type BilanTache = { arrivees: number; echeances: number; envoisAuto: number; purgees: number };

export async function executerTacheQuestions(now: Date = new Date()): Promise<BilanTache> {
  const bilan: BilanTache = { arrivees: 0, echeances: 0, envoisAuto: 0, purgees: 0 };

  // 1. Arrivées
  const nouvelles = await prisma.equipeQuestion.findMany({
    where: { alerteArriveeAt: null, statut: { in: [...EN_COURS] } },
    orderBy: { dueAt: "asc" },
  });
  if (nouvelles.length > 0) {
    const recentes = await prisma.equipeQuestion.findMany({
      where: { alerteArriveeAt: { gte: new Date(now.getTime() - 26 * 3_600_000) } },
    });
    const dejaAujourdhui = new Set(
      recentes.map((q) => (q.alerteArriveeAt ? q.alerteArriveeAt.getTime() : 0)).filter((t) => t > 0 && jourParis(new Date(t)) === jourParis(now)),
    ).size;
    if (dejaAujourdhui < ALERTE_ARRIVEE_MAX_PAR_JOUR) {
      await envoyerAlerteAdmin("arrivee", nouvelles.map((q) => ({ id: q.id, dueAt: q.dueAt })));
      await prisma.equipeQuestion.updateMany({ where: { id: { in: nouvelles.map((q) => q.id) } }, data: { alerteArriveeAt: now } });
      bilan.arrivees = nouvelles.length;
    }
  }

  // 2. Échéances proches
  const proches = await prisma.equipeQuestion.findMany({
    where: {
      alerteEcheanceAt: null,
      statut: { in: [...EN_COURS] },
      dueAt: { lte: new Date(now.getTime() + ALERTE_ECHEANCE_HEURES_RESTANTES * 3_600_000) },
    },
    orderBy: { dueAt: "asc" },
  });
  if (proches.length > 0) {
    await envoyerAlerteAdmin("echeance", proches.map((q) => ({ id: q.id, dueAt: q.dueAt })));
    await prisma.equipeQuestion.updateMany({ where: { id: { in: proches.map((q) => q.id) } }, data: { alerteEcheanceAt: now } });
    bilan.echeances = proches.length;
  }

  // 3. Envoi automatique : uniquement si le mode a été choisi par Thomas
  if (modeValidation() === "relecture_automatique") {
    const relues = await prisma.equipeQuestion.findMany({ where: { statut: "RELUE", relueMode: "automatique" } });
    for (const q of relues) {
      const r = await envoyerReponse(q.id, "tache", now);
      if (r.ok && !r.deja) bilan.envoisAuto += 1;
    }
  }

  // 4. Purge
  bilan.purgees = await purgerQuestionsExpirees(now);
  return bilan;
}

/** Fin de la conservation : N mois après la fin de l'abonnement (ou, à défaut, la dernière activité). */
export async function purgerQuestionsExpirees(now: Date = new Date()): Promise<number> {
  const limite = new Date(now);
  limite.setUTCMonth(limite.getUTCMonth() - CONSERVATION_MOIS_APRES_FIN);
  const candidates = await prisma.equipeQuestion.findMany({
    where: { receivedAt: { lt: limite } },
    include: { user: { select: { plan: true, subscription: { select: { currentPeriodEnd: true, updatedAt: true } } } } },
  });
  const aPurger = candidates
    .filter((q) => {
      if (estPremium(String(q.user.plan))) return false;
      const fin = q.user.subscription?.currentPeriodEnd ?? q.user.subscription?.updatedAt ?? q.sentAt ?? q.receivedAt;
      return fin < limite;
    })
    .map((q) => q.id);
  if (aPurger.length === 0) return 0;
  const { count } = await prisma.equipeQuestion.deleteMany({ where: { id: { in: aPurger } } });
  return count;
}
