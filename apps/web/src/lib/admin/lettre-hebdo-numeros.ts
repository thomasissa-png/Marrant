/**
 * Admin, Abonnés › Lettre : numéros de la lettre de la semaine à relire et approuver (s22).
 * Chaque numéro est rendu tel qu'il partira (objet, pré-en-tête, corps et pied réel, lien
 * d'arrêt factice) avec son empreinte : « Approuver ce numéro » renvoie cette empreinte,
 * le serveur refuse si le numéro a changé depuis l'affichage.
 */
import { z } from "zod";
import { frPonctuation } from "@/lib/fr-typo";
import { corpsNumeroHebdo } from "@/lib/lettre/envoi-hebdo";
import { approbationValide, empreinteNumero } from "@/lib/lettre/approbation-hebdo";

/** Du jeudi 8 h au lundi 0 h : un numéro reste approuvable tant que sa semaine n'est pas finie. */
const JEUDI_A_FIN_SEMAINE_MS = (3 * 24 + 16) * 3600 * 1000;

export const approbationBody = z.object({
  semaine: z.string().regex(/^\d{4}-W\d{2}$/),
  empreinte: z.string().regex(/^[0-9a-f]{64}$/),
});
export const retraitBody = z.object({ semaine: z.string().regex(/^\d{4}-W\d{2}$/) });

export interface NumeroHebdoAdmin {
  semaine: string;
  statut: "BROUILLON" | "VALIDE";
  envoiPrevu: string;
  objet: string;
  preEntete: string | null;
  /** Texte complet tel qu'il part (pied compris, lien d'arrêt factice). */
  texte: string;
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
    where: { audience: "HEBDO_PREMIUM", status: { in: ["BROUILLON", "VALIDE"] }, scheduledFor: { gt: new Date(now.getTime() - JEUDI_A_FIN_SEMAINE_MS) } },
    orderBy: { scheduledFor: "asc" },
    take: 20,
  });
  return numeros.map((n) => {
    const valide = approbationValide(n);
    return {
      semaine: n.periodKey,
      statut: n.status === "VALIDE" ? "VALIDE" : "BROUILLON",
      envoiPrevu: n.scheduledFor.toISOString(),
      objet: frPonctuation(n.subject),
      preEntete: n.preheader,
      texte: corpsNumeroHebdo(n.bodyText, baseUrl, "apercu-sans-effet"),
      empreinte: empreinteNumero(n),
      approuve: valide,
      approuveLe: valide && n.approvedAt ? n.approvedAt.toISOString() : null,
      approuvePar: valide ? n.approvedBy : null,
      approbationPerimee: n.approvedAt !== null && !valide,
    };
  });
}
