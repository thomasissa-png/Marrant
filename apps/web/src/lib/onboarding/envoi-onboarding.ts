/**
 * Onboarding Premium s23 : envoi d'E1 (J5), E1b (J12) et E2 (J21), un passage par jour à 9 h (Paris), dans la
 * tâche du rappel des parcours (`runParcoursReminderJob`), APRÈS le rappel : aucun nouveau cron.
 *
 * Règles (fichier approuvé + cadre @legal C1 à C8) :
 *  - ancre J0 = journal E0 (bienvenue s23) ; jours calendaires de Paris ;
 *  - jamais le jeudi, ni un jour où l'abonné reçoit déjà un autre e-mail non transactionnel (lettre
 *    partie ce jour, lettre de la semaine encore due, rappel de parcours du jour), ni la veille ou le
 *    lendemain de son jour de rappel : glisse au premier jour libre, au plus `ONBOARDING_FENETRE_JOURS`
 *    jours (E1b : jusqu'à J19, `ONBOARDING_E1B_AU_PLUS_TARD`) ; sinon non envoyé, journalisé
 *    `saute:aucun-jour-libre` ;
 *  - E1b seulement si `QUESTION_EQUIPE_OUVERTE` (sinon `saute:question-equipe-fermee`) ;
 *  - arrêt avant envoi (C3) : lien d'arrêt, opposition (`emailOptOut`), plan non Premium (fin,
 *    remboursement), statut autre qu'ACTIVE ou TRIALING (paiement échoué), rétractation, compte supprimé ;
 *  - résiliation programmée (C1, C2) : E1 seulement, avec la phrase de tête et la fin d'accès EXACTE
 *    (journal FIN posé par le webhook, réserve 2) ; fin inconnue ou échue : rien ; E1b et E2 jamais ;
 *  - C7 : le motif de résiliation n'est jamais lu. C6 : aucun pixel, `?src=` sans identifiant ;
 *  - unicité : ligne de journal réservée AVANT l'envoi ; échec d'envoi : ligne libérée, nouvel essai
 *    au passage suivant (4 passages à 9 h).
 * Interrupteur fermé : ne lit ni n'écrit rien.
 */
import { ONBOARDING_E1B_AU_PLUS_TARD, ONBOARDING_FENETRE_JOURS, ONBOARDING_JOURS, ONBOARDING_PREMIUM_OUVERT, type EtapeOnboarding } from "@/config/onboarding-premium";
import { QUESTION_EQUIPE_OUVERTE } from "@/config/question-equipe";
import { emailOnboardingE1, emailOnboardingE1b, emailOnboardingE2, type EtapeOnboarding as EtapeParcours } from "@/config/textes/onboarding-premium";
import { parisMidnightUtc, parisParts } from "@/lib/analytics/weekly-visits-period";
import { problemesDeRendu } from "@/lib/emails/garde-fou-rendu";
import { firstNameFrom } from "@/lib/emails/annual-renewal-reminder";
import { titreEtapeSeed } from "@/lib/rappels/rappel-parcours";
import { cleJournal, PREFIXE_JOURNAL, secretArret, signerJetonOnboarding, typeJournal, urlArretOnboarding, type JournalDb } from "@/lib/onboarding/journal-onboarding";

export interface JournalRow {
  eventId: string;
  eventType: string | null;
  receivedAt: Date;
}

export interface UserOnboarding {
  id: string;
  email: string | null;
  name: string | null;
  plan: string;
  emailOptOut: boolean;
  subscription: { status: string; cancelAtPeriodEnd: boolean } | null;
  parcoursReminder: { enabled: boolean; weekday: number } | null;
}

interface ProgressRow {
  completedSteps: number[];
  learningPath: { slug: string; title: string; steps: { order: number }[] };
}

/** Sous-ensemble Prisma utilisé (injectable en test). */
export interface OnboardingDb extends JournalDb {
  webhookEvent: JournalDb["webhookEvent"] & {
    findMany(args: Record<string, unknown>): Promise<JournalRow[]>;
    update(args: { where: { eventId: string }; data: { eventType: string; processedAt: Date } }): Promise<unknown>;
    deleteMany(args: { where: { eventId: string } }): Promise<{ count: number }>;
  };
  user: { findUnique(args: Record<string, unknown>): Promise<UserOnboarding | null> };
  retractationRequest: { count(args: Record<string, unknown>): Promise<number> };
  newsletterSend: { count(args: Record<string, unknown>): Promise<number> };
  newsletterIssue: { findMany(args: Record<string, unknown>): Promise<{ id: string }[]> };
  userPathProgress: { findMany(args: Record<string, unknown>): Promise<ProgressRow[]> };
}

export interface OnboardingDeps {
  db: OnboardingDb;
  sendEmail: (to: string, subject: string, text: string, headers: Record<string, string>) => Promise<void>;
  baseUrl: string;
  /** `[si carnet]` (getCarnetExtrait non null). */
  carnet: boolean;
  /** Interrupteur (tests) ; défaut `ONBOARDING_PREMIUM_OUVERT`. */
  ouvert?: boolean;
  /** Service « Ta question à l'équipe » (tests) ; défaut `QUESTION_EQUIPE_OUVERTE`. */
  questionEquipeOuverte?: boolean;
}

export interface OnboardingResultat {
  ferme: boolean;
  secretAbsent: boolean;
  ancres: number;
  envoyes: number;
  sautes: number;
  reportes: number;
  echecs: number;
}

const JOUR_MS = 86_400_000;
const JEUDI = 4;

/** Numéro de jour civil de Paris (comparable par soustraction). */
export function jourParis(date: Date): number {
  const p = parisParts(date);
  return Date.UTC(p.year, p.month - 1, p.day) / JOUR_MS;
}

const ETAPES = ["E1", "E1b", "E2"] as const;

/** Dernier retard permis (en jours après le jour prévu) : 6 pour E1 et E2, J19 - J12 = 7 pour E1b. */
function retardMax(etape: EtapeOnboarding): number {
  return etape === "E1b" ? ONBOARDING_E1B_AU_PLUS_TARD - ONBOARDING_JOURS.E1b : ONBOARDING_FENETRE_JOURS - 1;
}

function voisins(a: number, b: number): boolean {
  const d = Math.abs(a - b);
  return d <= 1 || d === 6; // dimanche (7) et lundi (1) se touchent
}

/** Motif d'arrêt définitif (C3), ou null si l'abonné peut recevoir. */
export async function motifArret(db: OnboardingDb, u: UserOnboarding, j0: Date): Promise<string | null> {
  if (!u.email) return "sans-adresse";
  if (u.emailOptOut) return "opposition";
  if (u.plan !== "PREMIUM") return "fin-premium";
  const statut = u.subscription?.status ?? "AUCUN";
  if (statut === "PAST_DUE") return "paiement-echoue";
  if (statut !== "ACTIVE" && statut !== "TRIALING") return `statut-${statut.toLowerCase()}`;
  const retractations = await db.retractationRequest.count({
    where: { OR: [{ userId: u.id }, { email: { equals: u.email, mode: "insensitive" } }], createdAt: { gte: new Date(j0.getTime() - JOUR_MS) } },
  });
  return retractations > 0 ? "retractation" : null;
}

/** Jour déjà pris par un autre e-mail non transactionnel (ou jeudi) : l'e-mail glisse. */
export async function jourOccupe(db: OnboardingDb, u: UserOnboarding, now: Date): Promise<string | null> {
  const p = parisParts(now);
  if (p.weekday === JEUDI) return "jeudi";
  if (u.parcoursReminder?.enabled && voisins(u.parcoursReminder.weekday, p.weekday)) return "rappel-parcours";
  const debut = new Date(parisMidnightUtc(p.year, p.month, p.day));
  const fin = new Date(parisMidnightUtc(p.year, p.month, p.day + 1));
  const lettreDuJour = await db.newsletterSend.count({
    where: { email: u.email, OR: [{ sentAt: { gte: debut, lt: fin } }, { createdAt: { gte: debut, lt: fin } }] },
  });
  if (lettreDuJour > 0) return "lettre-du-jour";
  // Lettre de la semaine (ou du mois) due cette semaine, pas encore partie pour cette adresse : en retard possible.
  const lundi = new Date(parisMidnightUtc(p.year, p.month, p.day - (p.weekday - 1)));
  const enAttente = await db.newsletterIssue.findMany({
    where: { status: "VALIDE", scheduledFor: { gte: lundi, lte: now }, sends: { none: { email: u.email } } },
    select: { id: true },
  });
  return enAttente.length > 0 ? "lettre-en-retard" : null;
}

/** Prochaine étape d'un parcours en cours (même règle que le rappel : ≥ 1 étape validée, ≥ 1 restante). */
export async function etapeEnCours(db: OnboardingDb, userId: string): Promise<EtapeParcours | null> {
  const progressions = await db.userPathProgress.findMany({
    where: { userId, completedAt: null, learningPath: { isActive: true } },
    select: { completedSteps: true, learningPath: { select: { slug: true, title: true, steps: { select: { order: true } } } } },
  });
  for (const pr of progressions) {
    const orders = pr.learningPath.steps.map((s) => s.order).sort((a, b) => a - b);
    const prochaine = orders.find((o) => !pr.completedSteps.includes(o));
    if (pr.completedSteps.length > 0 && prochaine !== undefined) {
      return {
        parcoursTitre: pr.learningPath.title,
        parcoursSlug: pr.learningPath.slug,
        etapeNumero: prochaine,
        etapeTitre: titreEtapeSeed(pr.learningPath.slug, prochaine),
      };
    }
  }
  return null;
}

const SELECT_USER = {
  id: true,
  email: true,
  name: true,
  plan: true,
  emailOptOut: true,
  subscription: { select: { status: true, cancelAtPeriodEnd: true } },
  parcoursReminder: { select: { enabled: true, weekday: true } },
} as const;

async function sauter(db: OnboardingDb, etape: EtapeOnboarding, userId: string, motif: string, now: Date): Promise<void> {
  try {
    await db.webhookEvent.create({
      data: { eventId: cleJournal(etape, userId), provider: "interne", eventType: typeJournal(etape, `saute:${motif}`), receivedAt: now, processedAt: now },
    });
  } catch (err) {
    if ((err as { code?: unknown } | null)?.code !== "P2002") throw err;
  }
}

/** Un passage (le planificateur choisit l'heure). Ne lève que si la base est illisible. */
export async function runOnboardingPremium(now: Date, deps: OnboardingDeps): Promise<OnboardingResultat> {
  const r: OnboardingResultat = { ferme: false, secretAbsent: false, ancres: 0, envoyes: 0, sautes: 0, reportes: 0, echecs: 0 };
  if (!(deps.ouvert ?? ONBOARDING_PREMIUM_OUVERT)) {
    r.ferme = true;
    return r;
  }
  if (!secretArret()) {
    r.secretAbsent = true;
    return r;
  }
  const { db } = deps;
  const aujourdhui = jourParis(now);
  const recul = (ONBOARDING_JOURS.E2 + ONBOARDING_FENETRE_JOURS + 2) * JOUR_MS;
  const ancres = await db.webhookEvent.findMany({
    where: { eventId: { startsWith: `${PREFIXE_JOURNAL}:E0:` }, receivedAt: { gte: new Date(now.getTime() - recul) } },
    select: { eventId: true, eventType: true, receivedAt: true },
  });
  r.ancres = ancres.length;

  for (const ancre of ancres) {
    const userId = ancre.eventId.slice(`${PREFIXE_JOURNAL}:E0:`.length);
    const lignes = await db.webhookEvent.findMany({
      where: { eventId: { in: ([...ETAPES, "FIN", "ARRET"] as const).map((e) => cleJournal(e, userId)) } },
      select: { eventId: true, eventType: true, receivedAt: true },
    });
    const ligne = (e: EtapeOnboarding | "FIN" | "ARRET") => lignes.find((l) => l.eventId === cleJournal(e, userId));
    if (ligne("ARRET")) continue;

    let user: UserOnboarding | null | undefined;
    for (const etape of ETAPES) {
      if (ligne(etape)) continue;
      const retard = aujourdhui - (jourParis(ancre.receivedAt) + ONBOARDING_JOURS[etape]);
      if (retard < 0) continue;
      if (retard > retardMax(etape)) {
        await sauter(db, etape, userId, "aucun-jour-libre", now);
        r.sautes++;
        continue;
      }
      if (user === undefined) user = await db.user.findUnique({ where: { id: userId }, select: SELECT_USER });
      if (!user) break; // compte supprimé : rien n'est écrit
      const arret = await motifArret(db, user, ancre.receivedAt);
      const resilie = user.subscription?.cancelAtPeriodEnd === true;
      const fin = ligne("FIN")?.receivedAt ?? null;
      const motif =
        arret ??
        (etape === "E1b" && !(deps.questionEquipeOuverte ?? QUESTION_EQUIPE_OUVERTE) ? "question-equipe-fermee" : null) ??
        (resilie && etape !== "E1" ? "resiliation-programmee" : null) ??
        (resilie && !fin ? "fin-acces-inconnue" : null) ??
        (resilie && fin && fin.getTime() <= now.getTime() ? "fin-acces-echue" : null);
      if (motif) {
        await sauter(db, etape, userId, motif, now);
        r.sautes++;
        continue;
      }
      // Fenêtres disjointes (E1 : J5 à J11, E1b : J12 à J19, E2 : J21 à J27) : un e-mail d'accueil par jour au plus.
      if (await jourOccupe(db, user, now)) {
        r.reportes++;
        continue;
      }
      const token = signerJetonOnboarding(userId) as string;
      const lienArret = urlArretOnboarding(deps.baseUrl, token);
      const prenom = firstNameFrom(user.name);
      const rendu =
        etape === "E1"
          ? emailOnboardingE1({ prenom, finAcces: resilie ? fin : null, carnet: deps.carnet, etape: await etapeEnCours(db, userId), lienArret })
          : etape === "E1b"
            ? { ...emailOnboardingE1b({ prenom, lienArret }), version: "e1b" }
            : { ...emailOnboardingE2({ prenom, lienArret }), version: "e2" };
      if (problemesDeRendu(`${rendu.subject}\n${rendu.text}`).length > 0) {
        console.error(`[onboarding] ${etape} non envoyé : rendu incomplet (utilisateur ${userId}).`);
        await sauter(db, etape, userId, "rendu", now);
        r.sautes++;
        continue;
      }
      // Réservation AVANT l'envoi : un double passage ne renvoie jamais.
      try {
        await db.webhookEvent.create({
          data: { eventId: cleJournal(etape, userId), provider: "interne", eventType: typeJournal(etape, "reserve"), receivedAt: now, processedAt: now },
        });
      } catch (err) {
        if ((err as { code?: unknown } | null)?.code === "P2002") continue;
        throw err;
      }
      try {
        await deps.sendEmail(user.email as string, rendu.subject, rendu.text, {
          "List-Unsubscribe": `<${lienArret}>`,
          "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
        });
      } catch (err) {
        r.echecs++;
        console.error(`[onboarding] ${etape} en échec :`, err instanceof Error ? err.message : err);
        await db.webhookEvent.deleteMany({ where: { eventId: cleJournal(etape, userId) } });
        continue;
      }
      r.envoyes++;
      // Parti : la réservation reste quoi qu'il arrive (jamais de second envoi), seul le statut est précisé.
      const statut = `envoye:${rendu.version}${resilie ? ":resiliation-programmee" : ""}`;
      await db.webhookEvent
        .update({ where: { eventId: cleJournal(etape, userId) }, data: { eventType: typeJournal(etape, statut), processedAt: new Date() } })
        .catch((err: unknown) => console.warn("[onboarding] Statut d'envoi non mis à jour :", err instanceof Error ? err.message : err));
    }
  }
  return r;
}
