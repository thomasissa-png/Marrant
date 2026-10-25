/**
 * Envoi de la lettre de la semaine (hebdo Premium, s21 ; spec §6.4, US-H4).
 * Mêmes garde-fous que la mensuelle (`envoi.ts`), même boucle `envoyerLot` :
 *  1. `LETTRE_HEBDO_ENVOIS_OUVERTS` fermé : rien.
 *  2. Avant le jeudi 8 h (Paris) de la semaine ISO en cours : rien. Après le dimanche
 *     soir : la semaine a changé, l'ancien numéro n'est plus lu (pas de rattrapage).
 *  3. Numéro PRÉPARÉ `HEBDO_PREMIUM` de la semaine, `VALIDE`, `scheduledFor` atteint ;
 *     absent : alerte, rien n'est envoyé (jamais de contenu au fil de l'eau).
 *  3 bis. (s22) Approuvé par Thomas dans l'admin, pour ce contenu exact (`approbationValide`) ;
 *     sinon alerte « en attente d'approbation », rien n'est envoyé. Approuvé plus tard dans la
 *     semaine : part au passage suivant (jusqu'au dimanche soir).
 *  4. Marqueur `[À COMPLÉTER` (gabarit non validé, pied) ou offre commerciale
 *     (`motifsInterdits`, avis @legal C1) dans le rendu : bloqué.
 *  5. Article du blog cité hors ligne, ou étape de parcours d'un parcours inactif : reporté.
 *  6. Destinataires = `destinatairesHebdo()` (fonction unique, aussi utilisée pour
 *     mettre la mensuelle en pause).
 *  7. Texte seul, aucun pixel ni lien suivi, `List-Unsubscribe` + `List-Unsubscribe-Post`
 *     vers l'arrêt propre au destinataire, pied légal de l'avis @legal §2.3.
 */
import { prisma } from "@/lib/prisma";
import { LETTRE_HEBDO_ARRET_CHEMIN, LETTRE_HEBDO_ENVOIS_OUVERTS, MARQUEUR_A_COMPLETER } from "@/config/lettre";
import { piedNumeroHebdo } from "@/config/textes/lettre-hebdo-s21";
import { frPonctuation } from "@/lib/fr-typo";
import { envoiSemaine, semaineIsoParis } from "@/lib/lettre/calendrier";
import { articlesCites, envoyerLot, etatArticlesCites, type CibleEnvoi } from "@/lib/lettre/envoi";
import { destinatairesHebdo } from "@/lib/lettre/hebdo";
import type { EnvoyerEmail } from "@/lib/lettre/inscription";
import { motifsInterdits } from "@/lib/lettre/numeros-hebdo";
import { approbationValide } from "@/lib/lettre/approbation-hebdo";

const base = (baseUrl: string) => baseUrl.replace(/\/$/, "");

/** Lien d'arrêt du CORPS : page avec bouton (GET sans effet, @legal L5). */
export function lienArretHebdo(baseUrl: string, token: string): string {
  return `${base(baseUrl)}${LETTRE_HEBDO_ARRET_CHEMIN}?token=${encodeURIComponent(token)}`;
}

/** En-têtes RFC 2369 + RFC 8058 : arrêt immédiat de l'HEBDO seule par le client de messagerie. */
export function enTetesArretHebdo(baseUrl: string, token: string): Record<string, string> {
  return {
    "List-Unsubscribe": `<${base(baseUrl)}/api/lettre-premium/arret-un-clic?token=${encodeURIComponent(token)}>`,
    "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
  };
}

/** Corps complet : texte préparé + pied hebdo (insécables posées au rendu, texte stocké intact). */
export function corpsNumeroHebdo(bodyText: string, baseUrl: string, token: string): string {
  return `${frPonctuation(bodyText.trimEnd())}\n${frPonctuation(piedNumeroHebdo(lienArretHebdo(baseUrl, token), baseUrl))}`;
}

const LIEN_PARCOURS = /https:\/\/deviens-marrant\.fr\/parcours\/([a-z0-9]+(?:-[a-z0-9]+)*)/gi;

/** Parcours cités (pont) qui ne sont pas actifs en base : lien mort, donc report. */
async function parcoursCitesInactifs(texte: string): Promise<string[]> {
  const slugs = [...new Set([...texte.matchAll(LIEN_PARCOURS)].map((m) => m[1].toLowerCase()))];
  if (slugs.length === 0) return [];
  const actifs = await prisma.learningPath.findMany({ where: { slug: { in: slugs }, isActive: true }, select: { slug: true } });
  const ok = new Set(actifs.map((p) => p.slug));
  return slugs.filter((s) => !ok.has(s));
}

export interface EnvoiHebdoResultat {
  ferme: boolean;
  semaine: string;
  /** Jeudi 8 h atteint, mais aucun numéro VALIDE pour la semaine : alerte. */
  sansNumero: boolean;
  /** (s22) Numéro VALIDE mais pas approuvé par Thomas pour son contenu actuel : rien ne part. */
  nonApprouve: boolean;
  bloque: boolean;
  /** Motifs du blocage (marqueur, offre commerciale). */
  motifs: string[];
  reporte: boolean;
  liensMorts: string[];
  numero: string | null;
  destinataires: number;
  candidats: number;
  envoyes: number;
  echecs: number;
  dejaTraites: number;
  termine: boolean;
}

/** Un passage de la tâche (toutes les 15 min). Ne lève que si la base est illisible. */
export async function envoyerLettreDeLaSemaine(
  now: Date,
  deps: { envoyer: EnvoyerEmail; baseUrl: string; envoisOuverts?: boolean },
): Promise<EnvoiHebdoResultat> {
  const ouverts = deps.envoisOuverts ?? LETTRE_HEBDO_ENVOIS_OUVERTS;
  const semaine = semaineIsoParis(now);
  const r: EnvoiHebdoResultat = {
    ferme: !ouverts,
    semaine,
    sansNumero: false,
    nonApprouve: false,
    bloque: false,
    motifs: [],
    reporte: false,
    liensMorts: [],
    numero: null,
    destinataires: 0,
    candidats: 0,
    envoyes: 0,
    echecs: 0,
    dejaTraites: 0,
    termine: false,
  };
  if (!ouverts) return r;
  const echeance = envoiSemaine(semaine);
  if (!echeance || now.getTime() < echeance.getTime()) return r;

  const numero = await prisma.newsletterIssue.findUnique({
    where: { audience_periodKey: { audience: "HEBDO_PREMIUM", periodKey: semaine } },
  });
  if (numero?.status === "ENVOYE") {
    r.numero = numero.periodKey;
    r.termine = true;
    return r;
  }
  if (!numero || numero.status !== "VALIDE" || numero.scheduledFor.getTime() > now.getTime()) {
    r.sansNumero = true;
    return r;
  }
  r.numero = numero.periodKey;
  if (!approbationValide(numero)) {
    r.nonApprouve = true;
    return r;
  }

  const rendu = [numero.subject, numero.preheader ?? "", corpsNumeroHebdo(numero.bodyText, deps.baseUrl, "jeton")].join("\n");
  r.motifs = motifsInterdits(rendu);
  if (rendu.includes(MARQUEUR_A_COMPLETER) || r.motifs.length > 0) {
    r.bloque = true;
    return r;
  }
  const articles = await etatArticlesCites(articlesCites(rendu), now);
  r.liensMorts = [...articles.nonPublies.map((s) => `blog/${s}`), ...(await parcoursCitesInactifs(rendu)).map((s) => `parcours/${s}`)];
  if (r.liensMorts.length > 0) {
    r.reporte = true;
    return r;
  }

  const destinataires = await destinatairesHebdo(ouverts);
  r.destinataires = destinataires.length;
  const journal = await prisma.newsletterSend.findMany({
    where: { issueId: numero.id },
    select: { id: true, email: true, status: true, attempts: true },
  });
  const cibles: CibleEnvoi[] = destinataires.map((d) => ({
    email: d.email,
    message: () => ({
      subject: frPonctuation(numero.subject),
      text: corpsNumeroHebdo(numero.bodyText, deps.baseUrl, d.unsubscribeToken),
      headers: enTetesArretHebdo(deps.baseUrl, d.unsubscribeToken),
    }),
  }));
  const restants = await envoyerLot(numero.id, journal, cibles, deps.envoyer, "Lettre de la semaine", r);
  if (restants === 0) {
    await prisma.newsletterIssue.update({ where: { id: numero.id }, data: { status: "ENVOYE", sentAt: now } });
    r.termine = true;
  }
  return r;
}
