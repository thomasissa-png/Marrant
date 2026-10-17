/**
 * Envoi de la lettre mensuelle (s21, spec §7.2 point 4 ; @legal L3, L4, L6).
 *
 *  - Rien ne part si `LETTRE_OUVERTE` est fermé.
 *  - Numéro PRÉPARÉ en base, statut VALIDE, période = mois de Paris en cours,
 *    `scheduledFor` atteint. Aucun numéro : rien n'est envoyé (jamais de contenu
 *    généré au fil de l'eau, règle du 01/10).
 *  - Destinataires : `CONFIRMED`, moins (1) les Premium qui reçoivent la lettre
 *    hebdomadaire (`PremiumLetterPreference.enabled`, avis produit §4 : un Premium
 *    sans hebdo garde la mensuelle), (2) les oppositions globales (`User.emailOptOut`,
 *    prospects `CeoLead` opposés), sauf confirmation de la lettre POSTÉRIEURE à
 *    l'opposition (L6 ; date d'opposition majorée par `updatedAt`, donc prudente).
 *  - Journal `NewsletterSend` réservé AVANT l'envoi (unique numéro + adresse) :
 *    une tâche relancée ou concurrente n'envoie jamais deux fois.
 *  - Texte seul, sans pixel ni lien suivi ; `List-Unsubscribe` + `List-Unsubscribe-Post`,
 *    lien de désinscription et pied légal dans le corps.
 */
import { prisma } from "@/lib/prisma";
import { LETTRE_ESSAIS_MAX, LETTRE_LOT_PAR_PASSAGE, LETTRE_OUVERTE } from "@/config/lettre";
import { EMAILS_LETTRE } from "@/config/textes/lettre-s21";
import { avecDelai, enTetesDesinscription, LETTRE_EMAIL_TIMEOUT_MS, type EnvoyerEmail } from "@/lib/lettre/inscription";
import { buildUnsubscribeUrl } from "@/lib/newsletter";

const moisFormat = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Paris", year: "numeric", month: "2-digit" });

/** Période d'un numéro mensuel : « AAAA-MM » au calendrier de Paris. */
export function periodeMensuelle(now: Date): string {
  const parts = moisFormat.formatToParts(now);
  const an = parts.find((p) => p.type === "year")?.value ?? "0000";
  const mois = parts.find((p) => p.type === "month")?.value ?? "00";
  return `${an}-${mois}`;
}

export interface EnvoiResultat {
  ferme: boolean;
  numero: string | null;
  candidats: number;
  envoyes: number;
  echecs: number;
  exclusPremiumHebdo: number;
  exclusOpposition: number;
  dejaTraites: number;
  termine: boolean;
}

interface Opposition {
  date: Date;
}

/** Corps complet d'un numéro : texte préparé + pied (identité, désinscription, confidentialité). */
export function corpsNumero(bodyText: string, baseUrl: string, unsubscribeToken: string): string {
  return `${bodyText.trimEnd()}\n${EMAILS_LETTRE.piedNumero(buildUnsubscribeUrl(baseUrl, unsubscribeToken), baseUrl)}`;
}

async function listesExclusion(): Promise<{ hebdo: Set<string>; oppositions: Map<string, Opposition> }> {
  const users = await prisma.user.findMany({
    where: { OR: [{ emailOptOut: true }, { plan: "PREMIUM", premiumLetter: { is: { enabled: true } } }] },
    select: { email: true, emailOptOut: true, plan: true, updatedAt: true, premiumLetter: { select: { enabled: true } } },
  });
  const leads = await prisma.ceoLead.findMany({
    where: { email: { not: null }, OR: [{ optOut: true }, { status: "OPT_OUT" }] },
    select: { email: true, updatedAt: true },
  });
  const hebdo = new Set<string>();
  const oppositions = new Map<string, Opposition>();
  const noterOpposition = (email: string, date: Date) => {
    const cle = email.toLowerCase();
    const avant = oppositions.get(cle);
    if (!avant || avant.date < date) oppositions.set(cle, { date });
  };
  for (const u of users) {
    if (!u.email) continue;
    if (u.plan === "PREMIUM" && u.premiumLetter?.enabled) hebdo.add(u.email.toLowerCase());
    if (u.emailOptOut) noterOpposition(u.email, u.updatedAt);
  }
  for (const l of leads) if (l.email) noterOpposition(l.email, l.updatedAt);
  return { hebdo, oppositions };
}

/** Un passage de la tâche (le planificateur choisit l'heure). Ne lève que si la base est illisible. */
export async function envoyerLettreDuMois(
  now: Date,
  deps: { envoyer: EnvoyerEmail; baseUrl: string },
): Promise<EnvoiResultat> {
  const r: EnvoiResultat = {
    ferme: !LETTRE_OUVERTE,
    numero: null,
    candidats: 0,
    envoyes: 0,
    echecs: 0,
    exclusPremiumHebdo: 0,
    exclusOpposition: 0,
    dejaTraites: 0,
    termine: false,
  };
  if (!LETTRE_OUVERTE) return r;

  const numero = await prisma.newsletterIssue.findFirst({
    where: { audience: "MENSUELLE", periodKey: periodeMensuelle(now), status: "VALIDE", scheduledFor: { lte: now } },
  });
  if (!numero) return r;
  r.numero = numero.periodKey;

  const { hebdo, oppositions } = await listesExclusion();
  const abonnes = await prisma.newsletterSubscriber.findMany({
    where: { status: "CONFIRMED" },
    select: { email: true, unsubscribeToken: true, confirmedAt: true },
    orderBy: { createdAt: "asc" },
  });
  const journal = await prisma.newsletterSend.findMany({
    where: { issueId: numero.id },
    select: { id: true, email: true, status: true, attempts: true },
  });
  const parEmail = new Map(journal.map((j) => [j.email, j]));

  let restants = 0;
  let traitesCePassage = 0;
  for (const a of abonnes) {
    const email = a.email.toLowerCase();
    if (hebdo.has(email)) {
      r.exclusPremiumHebdo++;
      continue;
    }
    const opposition = oppositions.get(email);
    if (opposition && (!a.confirmedAt || a.confirmedAt <= opposition.date)) {
      r.exclusOpposition++;
      continue;
    }
    const ligne = parEmail.get(email);
    if (ligne && (ligne.status !== "ECHEC" || ligne.attempts >= LETTRE_ESSAIS_MAX)) {
      r.dejaTraites++;
      continue;
    }
    r.candidats++;
    if (traitesCePassage >= LETTRE_LOT_PAR_PASSAGE) {
      restants++;
      continue;
    }

    // Réservation AVANT l'envoi : 0 ligne prise = un autre passage s'en occupe.
    let idLigne: string;
    let essais: number;
    if (!ligne) {
      try {
        const cree = await prisma.newsletterSend.create({
          data: { issueId: numero.id, email, status: "RESERVE", attempts: 1 },
          select: { id: true },
        });
        idLigne = cree.id;
        essais = 1;
      } catch {
        r.dejaTraites++;
        continue;
      }
    } else {
      const pris = await prisma.newsletterSend.updateMany({
        where: { id: ligne.id, status: "ECHEC", attempts: ligne.attempts },
        data: { status: "RESERVE", attempts: ligne.attempts + 1 },
      });
      if (pris.count === 0) {
        r.dejaTraites++;
        continue;
      }
      idLigne = ligne.id;
      essais = ligne.attempts + 1;
    }
    traitesCePassage++;

    try {
      await avecDelai(
        deps.envoyer(email, numero.subject, corpsNumero(numero.bodyText, deps.baseUrl, a.unsubscribeToken), enTetesDesinscription(deps.baseUrl, a.unsubscribeToken)),
        LETTRE_EMAIL_TIMEOUT_MS,
        "Numéro de la lettre",
      );
      await prisma.newsletterSend.update({ where: { id: idLigne }, data: { status: "ENVOYE", sentAt: new Date(), error: null } });
      r.envoyes++;
    } catch (err) {
      const message = (err instanceof Error ? err.message : String(err)).replace(/[^\s@]+@[^\s@]+/g, "[adresse]").slice(0, 300);
      await prisma.newsletterSend.update({ where: { id: idLigne }, data: { status: "ECHEC", error: message } });
      r.echecs++;
      if (essais < LETTRE_ESSAIS_MAX) restants++;
    }
  }

  if (restants === 0) {
    await prisma.newsletterIssue.update({ where: { id: numero.id }, data: { status: "ENVOYE", sentAt: now } });
    r.termine = true;
  }
  return r;
}
