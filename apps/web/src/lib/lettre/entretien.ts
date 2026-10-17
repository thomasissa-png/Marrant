/**
 * Entretien quotidien de la liste de la lettre (s21, @legal L4). Durées dans `config/lettre.ts`.
 *
 *  1. Inscrits jamais confirmés : effacés après 7 jours.
 *  2. Reconfirmation à 24 mois (interrupteur ouvert seulement : c'est un e-mail) :
 *     nouveau jeton, e-mail avec bouton ; sans clic sous 30 jours, désinscription.
 *  3. Trace de désinscription (adresse, dates, version du consentement) effacée après 3 ans.
 */
import { prisma } from "@/lib/prisma";
import {
  LETTRE_OUVERTE,
  LETTRE_PENDING_JOURS,
  LETTRE_RECONFIRMATION_DELAI_JOURS,
  LETTRE_RECONFIRMATION_MOIS,
  LETTRE_TRACE_DESINSCRIPTION_ANS,
} from "@/config/lettre";
import { EMAILS_LETTRE } from "@/config/textes/lettre-s21";
import { avecDelai, enTetesDesinscription, LETTRE_EMAIL_TIMEOUT_MS, type EnvoyerEmail } from "@/lib/lettre/inscription";
import { buildConfirmUrl, buildUnsubscribeUrl, generateOpaqueToken } from "@/lib/newsletter";

const JOUR_MS = 24 * 3600 * 1000;
/** Demandes de reconfirmation envoyées au plus par passage. */
const RECONFIRMATIONS_PAR_PASSAGE = 50;

export interface EntretienResultat {
  pendingEffaces: number;
  reconfirmationsEnvoyees: number;
  reconfirmationsEchec: number;
  desinscritsSansReponse: number;
  tracesEffacees: number;
}

function moisAvant(now: Date, mois: number): Date {
  const d = new Date(now);
  d.setUTCMonth(d.getUTCMonth() - mois);
  return d;
}

export async function entretenirLettre(
  now: Date,
  deps: { envoyer: EnvoyerEmail; baseUrl: string },
): Promise<EntretienResultat> {
  const r: EntretienResultat = { pendingEffaces: 0, reconfirmationsEnvoyees: 0, reconfirmationsEchec: 0, desinscritsSansReponse: 0, tracesEffacees: 0 };

  r.pendingEffaces = (
    await prisma.newsletterSubscriber.deleteMany({
      where: { status: "PENDING", consentAt: { lt: new Date(now.getTime() - LETTRE_PENDING_JOURS * JOUR_MS) } },
    })
  ).count;

  r.desinscritsSansReponse = (
    await prisma.newsletterSubscriber.updateMany({
      where: { status: "CONFIRMED", reconfirmRequestedAt: { lt: new Date(now.getTime() - LETTRE_RECONFIRMATION_DELAI_JOURS * JOUR_MS) } },
      data: { status: "UNSUBSCRIBED", unsubscribedAt: now, ipAddress: null, userAgent: null, reconfirmRequestedAt: null },
    })
  ).count;

  r.tracesEffacees = (
    await prisma.newsletterSubscriber.deleteMany({
      where: { status: "UNSUBSCRIBED", unsubscribedAt: { lt: moisAvant(now, LETTRE_TRACE_DESINSCRIPTION_ANS * 12) } },
    })
  ).count;

  if (!LETTRE_OUVERTE) return r;

  const aReconfirmer = await prisma.newsletterSubscriber.findMany({
    where: { status: "CONFIRMED", reconfirmRequestedAt: null, confirmedAt: { lt: moisAvant(now, LETTRE_RECONFIRMATION_MOIS) } },
    select: { id: true, email: true, unsubscribeToken: true },
    take: RECONFIRMATIONS_PAR_PASSAGE,
  });
  for (const a of aReconfirmer) {
    const confirmationToken = generateOpaqueToken();
    await prisma.newsletterSubscriber.update({ where: { id: a.id }, data: { confirmationToken, reconfirmRequestedAt: now } });
    try {
      const { sujet, corps } = EMAILS_LETTRE.reconfirmation;
      await avecDelai(
        deps.envoyer(
          a.email,
          sujet,
          corps(buildConfirmUrl(deps.baseUrl, confirmationToken), buildUnsubscribeUrl(deps.baseUrl, a.unsubscribeToken), deps.baseUrl),
          enTetesDesinscription(deps.baseUrl, a.unsubscribeToken),
        ),
        LETTRE_EMAIL_TIMEOUT_MS,
        "Reconfirmation de la lettre",
      );
      r.reconfirmationsEnvoyees++;
    } catch {
      // Pas d'e-mail parti : pas de délai de 30 jours qui court. Retenté au passage suivant.
      await prisma.newsletterSubscriber.update({ where: { id: a.id }, data: { reconfirmRequestedAt: null } });
      r.reconfirmationsEchec++;
    }
  }
  return r;
}
