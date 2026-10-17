/**
 * Envoi de la lettre mensuelle (s21, spec §7.2 point 4 ; @legal L3, L4, L6).
 *
 *  - Rien ne part si `LETTRE_ENVOIS_OUVERTS` est fermé.
 *  - Jour d'envoi : premier jeudi du mois à 8 h, heure de Paris, jamais avant la
 *    date plancher (`dateEnvoiLettre`, imposée à `envoiPrevu` par le schéma).
 *  - Rien ne part si un marqueur `[À COMPLÉTER` figure dans le numéro rendu
 *    (objet, pré-en-tête, corps, pied) : `bloque = true`.
 *  - Rien ne part si un article du blog cité dans le numéro (lien
 *    `deviens-marrant.fr/blog/<slug>`) n'est pas en ligne au moment de l'envoi :
 *    article du code, ou article en base publié (`isPublished`) dont la date de
 *    publication est passée (`visibleBlogArticleWhere`, même règle que la page
 *    article). Le numéro est reporté (`reporte = true`, slugs manquants dans
 *    `articlesNonPublies`, alerte dans le journal de la tâche), puis part au
 *    premier créneau valable (jeudi 8 h, Paris) après la mise en ligne de
 *    l'article (`prochainEnvoi`), jamais au premier passage qui suit.
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
import { LETTRE_ESSAIS_MAX, LETTRE_LOT_PAR_PASSAGE, LETTRE_ENVOIS_OUVERTS, MARQUEUR_A_COMPLETER } from "@/config/lettre";
import { EMAILS_LETTRE } from "@/config/textes/lettre-s21";
import { avecDelai, enTetesDesinscription, LETTRE_EMAIL_TIMEOUT_MS, type EnvoyerEmail } from "@/lib/lettre/inscription";
import { buildUnsubscribeUrl } from "@/lib/newsletter";
import { frPonctuation } from "@/lib/fr-typo";
import { getArticleBySlug } from "@/lib/blog-articles";
import { visibleBlogArticleWhere } from "@/lib/blog-visibility";

const moisFormat = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Paris", year: "numeric", month: "2-digit" });

/** Période d'un numéro mensuel : « AAAA-MM » au calendrier de Paris. */
export function periodeMensuelle(now: Date): string {
  const parts = moisFormat.formatToParts(now);
  const an = parts.find((p) => p.type === "year")?.value ?? "0000";
  const mois = parts.find((p) => p.type === "month")?.value ?? "00";
  return `${an}-${mois}`;
}

/** Jour d'envoi : jeudi (`getUTCDay`), à 8 h heure de Paris (décision de Thomas, 17/10). */
export const LETTRE_JOUR_ENVOI = 4;
export const LETTRE_HEURE_ENVOI_PARIS = 8;

const heureParisFormat = new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Paris", hour: "2-digit", hourCycle: "h23" });

/** Instant « jour à HH:00, heure de Paris » (heure d'hiver UTC+1 ou d'été UTC+2). */
function aHeureParis(an: number, mois: number, jour: number, heure: number): Date {
  for (const decalage of [1, 2]) {
    const essai = new Date(Date.UTC(an, mois - 1, jour, heure - decalage));
    if (Number(heureParisFormat.format(essai)) === heure) return essai;
  }
  throw new Error(`Heure de Paris introuvable pour ${an}-${mois}-${jour} ${heure} h`);
}

/**
 * Date d'envoi d'un numéro (règle unique, décision de Thomas du 17/10) :
 * le PREMIER JEUDI du mois de `periode`, à 8 h heure de Paris. Si la date
 * plancher (publication de l'article cité) tombe après ce jeudi, le numéro
 * part le premier jeudi qui suit la date plancher (ou le jour même si c'est un
 * jeudi), toujours à 8 h. `null` si ce jeudi sort du mois de `periode` :
 * le numéro doit alors changer de mois (le schéma le refuse en l'état).
 */
export function dateEnvoiLettre(periode: string, datePlancher?: string | null): Date | null {
  const [an, mois] = periode.split("-").map(Number);
  const premier = new Date(Date.UTC(an, mois - 1, 1));
  let jour = 1 + ((LETTRE_JOUR_ENVOI - premier.getUTCDay() + 7) % 7);
  if (datePlancher) {
    const [pa, pm, pj] = datePlancher.split("-").map(Number);
    const plancher = new Date(Date.UTC(pa, pm - 1, pj));
    if (plancher.getTime() > Date.UTC(an, mois - 1, jour)) {
      const jeudi = new Date(plancher.getTime() + ((LETTRE_JOUR_ENVOI - plancher.getUTCDay() + 7) % 7) * 86_400_000);
      if (jeudi.getUTCFullYear() !== an || jeudi.getUTCMonth() !== mois - 1) return null;
      jour = jeudi.getUTCDate();
    }
  }
  return aHeureParis(an, mois, jour, LETTRE_HEURE_ENVOI_PARIS);
}

const jourParisFormat = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Paris", year: "numeric", month: "2-digit", day: "2-digit" });

/**
 * Premier créneau d'envoi valable (jeudi à 8 h, heure de Paris) à partir de
 * `apres`, `apres` compris. Sert au numéro reporté (revue s21 M1) : un article
 * cité mis en ligne le lundi à 0 h ne fait pas partir le numéro au passage de
 * 0 h 15, mais le jeudi suivant à 8 h.
 */
export function prochainCreneauLettre(apres: Date): Date {
  const [an, mois, jour] = jourParisFormat.format(apres).split("-").map(Number);
  const base = Date.UTC(an, mois - 1, jour);
  for (const semaines of [0, 1]) {
    const decalage = ((LETTRE_JOUR_ENVOI - new Date(base).getUTCDay() + 7) % 7) + semaines * 7;
    const jeudi = new Date(base + decalage * 86_400_000);
    const creneau = aHeureParis(jeudi.getUTCFullYear(), jeudi.getUTCMonth() + 1, jeudi.getUTCDate(), LETTRE_HEURE_ENVOI_PARIS);
    if (creneau.getTime() >= apres.getTime()) return creneau;
  }
  throw new Error("Créneau d'envoi introuvable");
}

/** Liens vers un article du blog du site (absolus, avec ou sans « www »), `?` et `#` exclus du slug. */
const LIEN_ARTICLE = /(?:https?:\/\/)?(?:www\.)?deviens-marrant\.fr\/blog\/([a-z0-9]+(?:-[a-z0-9]+)*)/gi;

/** Slugs des articles du blog cités dans un texte (sans doublon, dans l'ordre d'apparition). */
export function articlesCites(texte: string): string[] {
  return [...new Set([...texte.matchAll(LIEN_ARTICLE)].map((m) => m[1].toLowerCase()))];
}

/**
 * Articles cités qui ne sont PAS en ligne à `now` : ni article du code, ni
 * article en base visible (publié et date de publication passée). Lit la base
 * seulement si un article cité n'est pas dans le code.
 */
export async function articlesCitesNonPublies(slugs: readonly string[], now: Date): Promise<string[]> {
  return (await etatArticlesCites(slugs, now)).nonPublies;
}

/**
 * État des articles cités à `now` : ceux qui ne sont pas en ligne, et la date de
 * mise en ligne la plus récente des articles en base (`publishedAt`, `null` si
 * aucun n'est daté : article du code ou publié sans date).
 */
export async function etatArticlesCites(
  slugs: readonly string[],
  now: Date,
): Promise<{ nonPublies: string[]; enLigneDepuis: Date | null }> {
  const aVerifier = slugs.filter((s) => !getArticleBySlug(s));
  if (aVerifier.length === 0) return { nonPublies: [], enLigneDepuis: null };
  const enLigne = await prisma.blogArticle.findMany({
    where: { slug: { in: aVerifier }, ...visibleBlogArticleWhere(now) },
    select: { slug: true, publishedAt: true },
  });
  const visibles = new Set(enLigne.map((a) => a.slug));
  let enLigneDepuis: Date | null = null;
  for (const a of enLigne) {
    if (a.publishedAt && (!enLigneDepuis || a.publishedAt > enLigneDepuis)) enLigneDepuis = a.publishedAt;
  }
  return { nonPublies: aVerifier.filter((s) => !visibles.has(s)), enLigneDepuis };
}

export interface EnvoiResultat {
  ferme: boolean;
  /**
   * Numéro trouvé mais reporté : un article cité n'est pas encore en ligne
   * (`articlesNonPublies`), ou il vient de l'être et le numéro attend le
   * créneau suivant (`prochainEnvoi`).
   */
  reporte: boolean;
  /** Créneau (jeudi 8 h, Paris) auquel part un numéro reporté dont les articles sont en ligne. */
  prochainEnvoi: Date | null;
  /** Slugs des articles cités pas encore en ligne (vide sauf si `reporte`). */
  articlesNonPublies: string[];
  /** Numéro trouvé mais bloqué : un marqueur `[À COMPLÉTER` y figure (pied compris). */
  bloque: boolean;
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

/**
 * Corps complet d'un numéro : texte préparé + pied (identité, désinscription, confidentialité).
 * Insécables posées avant « : ; ! ? » au rendu (texte stocké intact), comme l'objet.
 */
export function corpsNumero(bodyText: string, baseUrl: string, unsubscribeToken: string): string {
  return `${frPonctuation(bodyText.trimEnd())}\n${EMAILS_LETTRE.piedNumero(buildUnsubscribeUrl(baseUrl, unsubscribeToken), baseUrl)}`;
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
    ferme: !LETTRE_ENVOIS_OUVERTS,
    reporte: false,
    prochainEnvoi: null,
    articlesNonPublies: [],
    bloque: false,
    numero: null,
    candidats: 0,
    envoyes: 0,
    echecs: 0,
    exclusPremiumHebdo: 0,
    exclusOpposition: 0,
    dejaTraites: 0,
    termine: false,
  };
  if (!LETTRE_ENVOIS_OUVERTS) return r;
  // Jamais avant le premier jeudi du mois à 8 h (Paris), même si la base dit plus tôt.
  const echeance = dateEnvoiLettre(periodeMensuelle(now));
  if (!echeance || now.getTime() < echeance.getTime()) return r;

  const numero = await prisma.newsletterIssue.findFirst({
    where: { audience: "MENSUELLE", periodKey: periodeMensuelle(now), status: "VALIDE", scheduledFor: { lte: now } },
  });
  if (!numero) return r;
  r.numero = numero.periodKey;
  // Aucun numéro ne part avec un trou (mention d'éditeur @legal, etc.).
  const rendu = [numero.subject, numero.preheader ?? "", corpsNumero(numero.bodyText, deps.baseUrl, "jeton")].join("\n");
  if (rendu.includes(MARQUEUR_A_COMPLETER)) {
    r.bloque = true;
    return r;
  }
  // Jamais de lien mort : chaque article cité doit être en ligne MAINTENANT (vérifié en
  // base à chaque passage, la date plancher du fichier ne suffit pas). Sinon : report.
  const articles = await etatArticlesCites(articlesCites(rendu), now);
  r.articlesNonPublies = articles.nonPublies;
  if (r.articlesNonPublies.length > 0) {
    r.reporte = true;
    return r;
  }
  const journal = await prisma.newsletterSend.findMany({
    where: { issueId: numero.id },
    select: { id: true, email: true, status: true, attempts: true },
  });
  // Numéro reporté (revue s21 M1) : l'article cité est en ligne depuis la date
  // d'envoi prévue ; le numéro part au créneau suivant (jeudi 8 h, Paris), jamais
  // au premier passage de 15 min. Un envoi déjà commencé (journal non vide) se
  // termine sans attendre.
  if (journal.length === 0 && articles.enLigneDepuis && articles.enLigneDepuis.getTime() > echeance.getTime()) {
    const creneau = prochainCreneauLettre(articles.enLigneDepuis);
    if (now.getTime() < creneau.getTime()) {
      r.reporte = true;
      r.prochainEnvoi = creneau;
      return r;
    }
  }

  const { hebdo, oppositions } = await listesExclusion();
  const abonnes = await prisma.newsletterSubscriber.findMany({
    where: { status: "CONFIRMED" },
    select: { email: true, unsubscribeToken: true, confirmedAt: true },
    orderBy: { createdAt: "asc" },
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
        deps.envoyer(email, frPonctuation(numero.subject), corpsNumero(numero.bodyText, deps.baseUrl, a.unsubscribeToken), enTetesDesinscription(deps.baseUrl, a.unsubscribeToken)),
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
