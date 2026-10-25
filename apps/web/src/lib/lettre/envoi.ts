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
 *  - (s22, décision de Thomas du 25/10) Numéro approuvé par Thomas dans l'admin pour son
 *    contenu exact (`approbationValide`, même verrou que la lettre de la semaine) ; sinon
 *    `nonApprouve = true`, alerte « en attente », rien n'est envoyé, même interrupteur
 *    ouvert. Approuvé après l'heure prévue : part au passage suivant de la tâche (toutes
 *    les 15 min), tant que le mois de Paris du numéro n'est pas fini ; au-delà, plus rien.
 *  - (s22, décision de Thomas du 25/10 : la lettre du mois est l'une des lettres des abonnés Premium)
 *    Deux canaux, un seul e-mail par adresse :
 *    (1) canal Premium : les destinataires de la lettre de la semaine (`destinatairesHebdo`, fonction
 *        unique ; aucun tant que `LETTRE_HEBDO_ENVOIS_OUVERTS` est fermé) reçoivent la version Premium
 *        (`versionPremium` : sans le bloc d'invitation) avec le pied, le lien et les en-têtes d'arrêt
 *        de la lettre de la semaine. Cette semaine-là, aucune lettre réservée (`semaineDeLaMensuelle`) ;
 *    (2) canal gratuit : `CONFIRMED` hors canal Premium (dédoublonnage), moins les oppositions
 *        globales (`User.emailOptOut`, prospects `CeoLead` opposés), sauf confirmation de la lettre
 *        POSTÉRIEURE à l'opposition (L6 ; date d'opposition majorée par `updatedAt`, donc prudente).
 *        Un compte Premium (il a arrêté la lettre de la semaine) reçoit la version Premium avec le
 *        pied gratuit ; les autres, la version gratuite (texte relu, invitation comprise) ;
 *    (3) canal compte (s22, décision de Thomas du 25/10 : comptes gratuits inscrits d'office) :
 *        `destinatairesCompte` (fonction unique, `compte.ts`), hors canaux 1 et 2 et hors oppositions,
 *        version sans invitation, pied « tu as un compte », désinscription en un clic (durable).
 *  - Jamais deux lettres dans la semaine : si une lettre réservée est déjà partie la semaine en
 *    cours (ou la précédente, rattrapée), la lettre du mois attend le jeudi suivant à 8 h.
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
import { aHeureParis, envoiSemaine, finSemaine, LETTRE_HEURE_ENVOI_PARIS, LETTRE_JOUR_ENVOI, semaineIsoParis } from "@/lib/lettre/calendrier";
import { avecJetonsHebdo, destinatairesHebdo } from "@/lib/lettre/hebdo";
import { contientMarqueurInvitation, decouperInvitation, versionGratuite, versionPremium } from "@/lib/lettre/invitation-premium";
import { corpsNumeroHebdo, enTetesArretHebdo } from "@/lib/lettre/rendu-hebdo";
import { motifsInterdits } from "@/lib/lettre/numeros-hebdo";
import { avecJetonsCompte, destinatairesCompte } from "@/lib/lettre/compte";
import { visibleBlogArticleWhere } from "@/lib/blog-visibility";
import { approbationValide } from "@/lib/lettre/approbation-hebdo";

const moisFormat = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Paris", year: "numeric", month: "2-digit" });

/** Période d'un numéro mensuel : « AAAA-MM » au calendrier de Paris. */
export function periodeMensuelle(now: Date): string {
  const parts = moisFormat.formatToParts(now);
  const an = parts.find((p) => p.type === "year")?.value ?? "0000";
  const mois = parts.find((p) => p.type === "month")?.value ?? "00";
  return `${an}-${mois}`;
}

// Jour d'envoi (jeudi, 8 h Paris) et heure de Paris : `calendrier.ts`, partagé avec l'hebdo.
export { LETTRE_JOUR_ENVOI, LETTRE_HEURE_ENVOI_PARIS } from "@/lib/lettre/calendrier";

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
  /**
   * Numéro trouvé mais bloqué : un marqueur `[À COMPLÉTER` y figure (pied compris), marqueurs de
   * l'invitation Premium mal posés, ou version Premium non conforme (`motifs`, interdits de l'hebdo).
   */
  bloque: boolean;
  /** (s22) Motifs du blocage de la version Premium (`motifsInterdits`, marqueurs). */
  motifs: string[];
  /** (s22) Numéro VALIDE mais pas approuvé par Thomas pour son contenu actuel : rien ne part. */
  nonApprouve: boolean;
  numero: string | null;
  candidats: number;
  envoyes: number;
  echecs: number;
  /** (s22) Destinataires servis par le canal Premium (version Premium, pied de la lettre de la semaine). */
  canalPremium: number;
  /** (s22) Inscrits gratuits déjà servis par le canal Premium : un seul e-mail par adresse. */
  dedoublonnes: number;
  /** (s22) Comptes gratuits servis par le canal compte (version sans invitation, pied « tu as un compte »). */
  canalCompte: number;
  exclusOpposition: number;
  dejaTraites: number;
  termine: boolean;
}

interface Opposition {
  date: Date;
}

/**
 * Corps complet d'un numéro, canal gratuit : texte préparé + pied (identité, désinscription,
 * confidentialité). Insécables posées avant « : ; ! ? » au rendu (texte stocké intact), comme l'objet.
 * s22 : version gratuite (texte relu, marqueurs de l'invitation retirés) ; `premium` : version sans
 * l'invitation (compte Premium inscrit à la lettre du mois). Marqueurs mal posés : texte brut (le
 * numéro est alors bloqué à l'envoi, `decouperInvitation`).
 */
export function corpsNumero(bodyText: string, baseUrl: string, unsubscribeToken: string, options: { premium?: boolean } = {}): string {
  const texte = (options.premium ? versionPremium(bodyText) : versionGratuite(bodyText)) ?? bodyText;
  return `${frPonctuation(texte.trimEnd())}\n${EMAILS_LETTRE.piedNumero(buildUnsubscribeUrl(baseUrl, unsubscribeToken), baseUrl)}`;
}

/** Corps complet d'un numéro, canal compte (s22) : version sans invitation + pied « tu as un compte ». */
export function corpsNumeroCompte(bodyText: string, baseUrl: string, unsubscribeToken: string): string {
  const texte = versionPremium(bodyText) ?? bodyText;
  return `${frPonctuation(texte.trimEnd())}\n${EMAILS_LETTRE.piedNumeroCompte(buildUnsubscribeUrl(baseUrl, unsubscribeToken), baseUrl)}`;
}

/** Corps complet d'un numéro, canal Premium : version Premium + pied et lien d'arrêt de la lettre de la semaine. */
export function corpsNumeroPremium(bodyText: string, baseUrl: string, token: string, questionOuverte?: boolean): string {
  return corpsNumeroHebdo(versionPremium(bodyText) ?? bodyText, baseUrl, token, questionOuverte);
}

/**
 * Semaine de la lettre du mois (s22, décision de Thomas du 25/10) : vrai si la lettre du mois du mois
 * en cours (Paris) est partie pendant `semaine`, ou si elle est due (date prévue avant la fin de
 * `semaine`) et pas encore partie : pas approuvée, reportée, en cours. Cette semaine-là, aucune lettre
 * réservée ne part (`envoi-hebdo.ts`) : jamais deux lettres dans la même semaine. Faux si
 * `LETTRE_ENVOIS_OUVERTS` est fermé (elle ne partira pas) ou s'il n'y a pas de numéro VALIDE.
 */
export async function semaineDeLaMensuelle(semaine: string, now: Date): Promise<boolean> {
  const fin = finSemaine(semaine);
  if (!LETTRE_ENVOIS_OUVERTS || !fin) return false;
  const mensuelle = await prisma.newsletterIssue.findUnique({
    where: { audience_periodKey: { audience: "MENSUELLE", periodKey: periodeMensuelle(now) } },
    select: { status: true, scheduledFor: true, sentAt: true },
  });
  if (!mensuelle) return false;
  if (mensuelle.status === "ENVOYE") return mensuelle.sentAt !== null && semaineIsoParis(mensuelle.sentAt) === semaine;
  return mensuelle.status === "VALIDE" && mensuelle.scheduledFor.getTime() < fin.getTime();
}

/** Une lettre réservée (hebdo) a-t-elle commencé à partir pour `semaine` ? */
async function lettreReserveePartie(semaine: string): Promise<boolean> {
  const hebdo = await prisma.newsletterIssue.findUnique({
    where: { audience_periodKey: { audience: "HEBDO_PREMIUM", periodKey: semaine } },
    select: { id: true, status: true },
  });
  if (!hebdo) return false;
  if (hebdo.status === "ENVOYE") return true;
  const envoyes = await prisma.newsletterSend.findMany({ where: { issueId: hebdo.id, status: "ENVOYE" }, select: { email: true } });
  return envoyes.length > 0;
}

/**
 * Garde-fou « jamais deux lettres dans la semaine » (cas d'un numéro chargé ou daté après coup) : une
 * lettre réservée est déjà partie cette semaine → la lettre du mois attend le jeudi suivant à 8 h ;
 * partie la semaine précédente alors que la lettre du mois était déjà due → attend le jeudi 8 h de
 * cette semaine. Renvoie le créneau à attendre, ou `null`.
 */
async function creneauApresLettreReservee(now: Date, scheduledFor: Date): Promise<Date | null> {
  const semaine = semaineIsoParis(now);
  const fin = finSemaine(semaine);
  if (fin && (await lettreReserveePartie(semaine))) return prochainCreneauLettre(fin);
  const jeudi = envoiSemaine(semaine);
  if (!jeudi || now.getTime() >= jeudi.getTime()) return null;
  const precedente = semaineIsoParis(new Date(jeudi.getTime() - 7 * 86_400_000));
  const finPrecedente = finSemaine(precedente);
  if (finPrecedente && scheduledFor.getTime() < finPrecedente.getTime() && (await lettreReserveePartie(precedente))) return jeudi;
  return null;
}

/** Adresses (minuscules) des comptes Premium : version sans invitation, même par le canal gratuit. */
async function adressesPremium(): Promise<Set<string>> {
  const comptes = await prisma.user.findMany({ where: { plan: "PREMIUM" }, select: { email: true, plan: true } });
  return new Set(comptes.filter((u) => u.plan === "PREMIUM" && u.email).map((u) => (u.email as string).toLowerCase()));
}

async function listesExclusion(): Promise<{ oppositions: Map<string, Opposition> }> {
  const users = await prisma.user.findMany({
    where: { emailOptOut: true },
    select: { email: true, emailOptOut: true, updatedAt: true },
  });
  const leads = await prisma.ceoLead.findMany({
    where: { email: { not: null }, OR: [{ optOut: true }, { status: "OPT_OUT" }] },
    select: { email: true, updatedAt: true },
  });
  const oppositions = new Map<string, Opposition>();
  const noterOpposition = (email: string, date: Date) => {
    const cle = email.toLowerCase();
    const avant = oppositions.get(cle);
    if (!avant || avant.date < date) oppositions.set(cle, { date });
  };
  for (const u of users) {
    if (u.email && u.emailOptOut) noterOpposition(u.email, u.updatedAt);
  }
  for (const l of leads) if (l.email) noterOpposition(l.email, l.updatedAt);
  return { oppositions };
}

/** Un destinataire d'un numéro : adresse (minuscules) et message rendu à la demande. */
export interface CibleEnvoi {
  email: string;
  message: () => { subject: string; text: string; headers: Record<string, string> };
}

export interface CompteurEnvoi {
  candidats: number;
  envoyes: number;
  echecs: number;
  dejaTraites: number;
}

/**
 * Boucle commune « réserver puis envoyer » (mensuelle et hebdo, une seule logique de
 * verrou). Ligne `NewsletterSend` réservée AVANT l'envoi (unique numéro + adresse) :
 * un passage relancé ou concurrent n'envoie jamais deux fois. Échec retenté jusqu'à
 * `LETTRE_ESSAIS_MAX`, au plus `LETTRE_LOT_PAR_PASSAGE` envois par passage.
 * Renvoie le nombre d'adresses qui restent à traiter (0 = numéro terminé).
 */
export async function envoyerLot(
  issueId: string,
  journal: ReadonlyArray<{ id: string; email: string; status: string; attempts: number }>,
  cibles: readonly CibleEnvoi[],
  envoyer: EnvoyerEmail,
  libelle: string,
  r: CompteurEnvoi,
): Promise<number> {
  const parEmail = new Map(journal.map((j) => [j.email, j]));
  let restants = 0;
  let traitesCePassage = 0;
  for (const cible of cibles) {
    const email = cible.email;
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
          data: { issueId, email, status: "RESERVE", attempts: 1 },
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
      const m = cible.message();
      await avecDelai(envoyer(email, m.subject, m.text, m.headers), LETTRE_EMAIL_TIMEOUT_MS, libelle);
      await prisma.newsletterSend.update({ where: { id: idLigne }, data: { status: "ENVOYE", sentAt: new Date(), error: null } });
      r.envoyes++;
    } catch (err) {
      const message = (err instanceof Error ? err.message : String(err)).replace(/[^\s@]+@[^\s@]+/g, "[adresse]").slice(0, 300);
      await prisma.newsletterSend.update({ where: { id: idLigne }, data: { status: "ECHEC", error: message } });
      r.echecs++;
      if (essais < LETTRE_ESSAIS_MAX) restants++;
    }
  }
  return restants;
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
    motifs: [],
    nonApprouve: false,
    numero: null,
    candidats: 0,
    envoyes: 0,
    echecs: 0,
    canalPremium: 0,
    dedoublonnes: 0,
    canalCompte: 0,
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
  // Verrou d'approbation (s22) : avant tout autre contrôle, comme pour la lettre de la semaine.
  if (!approbationValide(numero)) {
    r.nonApprouve = true;
    return r;
  }
  // Aucun numéro ne part avec un trou (mention d'éditeur @legal, etc.).
  const rendu = [numero.subject, numero.preheader ?? "", corpsNumero(numero.bodyText, deps.baseUrl, "jeton")].join("\n");
  // s22 : version Premium (sans invitation, pied hebdo), dérivée du même texte approuvé ; elle respecte
  // les interdits commerciaux de la lettre de la semaine (avis @legal C1), sinon rien ne part.
  const renduPremium = [numero.subject, numero.preheader ?? "", corpsNumeroPremium(numero.bodyText, deps.baseUrl, "jeton")].join("\n");
  const renduCompte = corpsNumeroCompte(numero.bodyText, deps.baseUrl, "jeton");
  if (decouperInvitation(numero.bodyText) === null || [rendu, renduPremium, renduCompte].some(contientMarqueurInvitation)) {
    r.motifs.push("marqueurs de l'invitation Premium mal posés");
  }
  r.motifs.push(...motifsInterdits(renduPremium).filter((m) => m !== "marqueur [À COMPLÉTER"));
  if (rendu.includes(MARQUEUR_A_COMPLETER) || r.motifs.length > 0) {
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

  // Jamais deux lettres dans la semaine : une lettre réservée déjà partie (cas d'un numéro chargé
  // après coup) fait attendre la lettre du mois. Un envoi déjà commencé se termine sans attendre.
  if (journal.length === 0) {
    const creneau = await creneauApresLettreReservee(now, numero.scheduledFor);
    if (creneau) {
      r.reporte = true;
      r.prochainEnvoi = creneau;
      return r;
    }
  }

  const { oppositions } = await listesExclusion();
  const sujet = frPonctuation(numero.subject);
  // Canal Premium (s22) : les destinataires de la lettre de la semaine, jeton d'arrêt créé à l'envoi.
  const premium = await avecJetonsHebdo(await destinatairesHebdo(), now);
  const parCanalPremium = new Set(premium.map((d) => d.email));
  const cibles: CibleEnvoi[] = premium.map((d) => ({
    email: d.email,
    message: () => ({
      subject: sujet,
      text: corpsNumeroPremium(numero.bodyText, deps.baseUrl, d.unsubscribeToken),
      headers: enTetesArretHebdo(deps.baseUrl, d.unsubscribeToken),
    }),
  }));
  r.canalPremium = cibles.length;
  const comptesPremium = await adressesPremium();
  const abonnes = await prisma.newsletterSubscriber.findMany({
    where: { status: "CONFIRMED" },
    select: { email: true, unsubscribeToken: true, confirmedAt: true },
    orderBy: { createdAt: "asc" },
  });
  for (const a of abonnes) {
    const email = a.email.toLowerCase();
    if (parCanalPremium.has(email)) {
      r.dedoublonnes++;
      continue;
    }
    const opposition = oppositions.get(email);
    if (opposition && (!a.confirmedAt || a.confirmedAt <= opposition.date)) {
      r.exclusOpposition++;
      continue;
    }
    cibles.push({
      email,
      message: () => ({
        subject: sujet,
        text: corpsNumero(numero.bodyText, deps.baseUrl, a.unsubscribeToken, { premium: comptesPremium.has(email) }),
        headers: enTetesDesinscription(deps.baseUrl, a.unsubscribeToken),
      }),
    });
  }
  // Canal compte (s22) : comptes gratuits inscrits d'office, une seule fois par adresse.
  const servis = new Set(cibles.map((c) => c.email));
  const comptes = (await destinatairesCompte()).filter((d) => !servis.has(d.email) && !oppositions.has(d.email));
  for (const d of await avecJetonsCompte(comptes)) {
    cibles.push({
      email: d.email,
      message: () => ({
        subject: sujet,
        text: corpsNumeroCompte(numero.bodyText, deps.baseUrl, d.unsubscribeToken),
        headers: enTetesDesinscription(deps.baseUrl, d.unsubscribeToken),
      }),
    });
    r.canalCompte++;
  }
  const restants = await envoyerLot(numero.id, journal, cibles, deps.envoyer, "Numéro de la lettre", r);

  if (restants === 0) {
    await prisma.newsletterIssue.update({ where: { id: numero.id }, data: { status: "ENVOYE", sentAt: now } });
    r.termine = true;
  }
  return r;
}
