/**
 * Admin, Abonnés › Lettre : numéros à relire et approuver (s22), lettre de la semaine ET
 * lettre du mois (mensuelle, chantier A s22). Chaque numéro est rendu tel qu'il partira (objet, pré-en-tête, corps et pied réel, lien
 * d'arrêt factice) avec son empreinte : « Approuver ce numéro » renvoie cette empreinte,
 * le serveur refuse si le numéro a changé depuis l'affichage.
 * s22 (décision de Thomas du 25/10) : la lettre du mois part aussi aux abonnés Premium, en version
 * Premium (sans l'invitation, pied de la lettre de la semaine), rendue ici avec la version gratuite :
 * une seule approbation couvre les deux. Sa semaine n'a pas de lettre réservée.
 */
import { z } from "zod";
import { frPonctuation } from "@/lib/fr-typo";
import { corpsNumeroHebdo } from "@/lib/lettre/envoi-hebdo";
import { corpsNumero, corpsNumeroPremium, periodeMensuelle } from "@/lib/lettre/envoi";
import { semaineIsoParis } from "@/lib/lettre/calendrier";
import { destinatairesHebdo } from "@/lib/lettre/hebdo";
import { approbationValide, empreinteNumero, type AudienceApprobation } from "@/lib/lettre/approbation-hebdo";

/** Du jeudi 8 h au lundi 0 h : un numéro reste approuvable tant que sa semaine n'est pas finie. */
const JEUDI_A_FIN_SEMAINE_MS = (3 * 24 + 16) * 3600 * 1000;

const SEMAINE = z.string().regex(/^\d{4}-W\d{2}$/);
const MOIS = z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/);
const EMPREINTE = z.string().regex(/^[0-9a-f]{64}$/);

/** Corps admin → (audience, période). `semaine` : lettre de la semaine ; `mois` : lettre du mois. */
export interface CibleApprobation {
  audience: AudienceApprobation;
  periode: string;
}
const cible = (d: { semaine?: string; mois?: string }): CibleApprobation =>
  d.mois !== undefined ? { audience: "MENSUELLE", periode: d.mois } : { audience: "HEBDO_PREMIUM", periode: d.semaine ?? "" };

export const approbationBody = z
  .union([z.object({ semaine: SEMAINE, empreinte: EMPREINTE }), z.object({ mois: MOIS, empreinte: EMPREINTE })])
  .transform((d) => ({ ...cible(d), empreinte: d.empreinte }));
export const retraitBody = z.union([z.object({ semaine: SEMAINE }), z.object({ mois: MOIS })]).transform(cible);

export interface NumeroHebdoAdmin {
  /** HEBDO_PREMIUM (lettre de la semaine) ou MENSUELLE (lettre du mois). */
  audience: AudienceApprobation;
  /** Semaine ISO (hebdo) ou mois AAAA-MM (mensuelle) : clé à renvoyer (`semaine` ou `mois`). */
  semaine: string;
  statut: "BROUILLON" | "VALIDE";
  envoiPrevu: string;
  objet: string;
  preEntete: string | null;
  /** Texte complet tel qu'il part (pied compris, lien d'arrêt factice). Lettre du mois : version gratuite. */
  texte: string;
  /** (s22) Lettre du mois : version Premium telle qu'elle part aux abonnés (sinon `null`). */
  textePremium: string | null;
  /** (s22) Lettre du mois : nombre d'abonnés Premium qui la reçoivent à la place de la lettre réservée. */
  abonnesPremium: number | null;
  /** (s22) Lettre de la semaine : semaine prévue de la lettre du mois, ce numéro ne part pas. */
  semaineMensuelle: boolean;
  empreinte: string;
  /** Approbation en cours ET portant sur ce contenu exact. */
  approuve: boolean;
  approuveLe: string | null;
  approuvePar: string | null;
  /** Approbation posée puis contenu modifié : à réapprouver. */
  approbationPerimee: boolean;
}

export async function listerNumerosHebdoAdmin(now: Date, baseUrl: string): Promise<NumeroHebdoAdmin[]> {
  const { prisma } = await import("@/lib/prisma");
  const numeros = await prisma.newsletterIssue.findMany({
    where: {
      status: { in: ["BROUILLON", "VALIDE"] },
      OR: [
        { audience: "HEBDO_PREMIUM", scheduledFor: { gt: new Date(now.getTime() - JEUDI_A_FIN_SEMAINE_MS) } },
        // Mensuelle : approuvable jusqu'à la fin de son mois (la tâche l'envoie jusque-là).
        { audience: "MENSUELLE", periodKey: { gte: periodeMensuelle(now) } },
      ],
    },
    orderBy: { scheduledFor: "asc" },
    take: 30,
  });
  const semainesMensuelle = new Set(numeros.filter((n) => n.audience === "MENSUELLE" && n.status === "VALIDE").map((n) => semaineIsoParis(n.scheduledFor)));
  const abonnesPremium = numeros.some((n) => n.audience === "MENSUELLE") ? (await destinatairesHebdo()).length : 0;
  return numeros.map((n) => {
    const valide = approbationValide(n);
    const mensuelle = n.audience === "MENSUELLE";
    return {
      audience: mensuelle ? "MENSUELLE" : "HEBDO_PREMIUM",
      semaine: n.periodKey,
      statut: n.status === "VALIDE" ? "VALIDE" : "BROUILLON",
      envoiPrevu: n.scheduledFor.toISOString(),
      objet: frPonctuation(n.subject),
      preEntete: n.preheader,
      texte: mensuelle ? corpsNumero(n.bodyText, baseUrl, "apercu-sans-effet") : corpsNumeroHebdo(n.bodyText, baseUrl, "apercu-sans-effet"),
      textePremium: mensuelle ? corpsNumeroPremium(n.bodyText, baseUrl, "apercu-sans-effet") : null,
      abonnesPremium: mensuelle ? abonnesPremium : null,
      semaineMensuelle: !mensuelle && semainesMensuelle.has(n.periodKey),
      empreinte: empreinteNumero(n),
      approuve: valide,
      approuveLe: valide && n.approvedAt ? n.approvedAt.toISOString() : null,
      approuvePar: valide ? n.approvedBy : null,
      approbationPerimee: n.approvedAt !== null && !valide,
    };
  });
}
