/**
 * Verrou d'approbation de la lettre de la semaine (s22, décision de Thomas du 25/10 :
 * « chaque numéro doit être approuvé par Thomas avant envoi »).
 *
 * `statut: "VALIDE"` (fichier `data/lettre/hebdo-premium.json`, relecture à l'aveugle) ne
 * suffit plus : un numéro ne part que s'il porte AUSSI une approbation posée par l'action
 * admin « Approuver ce numéro » (Abonnés › Lettre, derrière ADMIN_PASSWORD), et seulement
 * pour le contenu exact affiché à ce moment-là :
 *  - l'admin renvoie l'empreinte du texte qu'il a lu ; le serveur refuse (409) si le numéro
 *    a changé entre-temps ;
 *  - l'empreinte approuvée est stockée (`approvedHash`) ; la tâche d'envoi la recalcule sur
 *    le numéro en base et refuse tout écart (objet, pré-en-tête, corps, date d'envoi), quel
 *    que soit le chemin de la modification (synchronisation, écriture directe en base) ;
 *  - la synchronisation au démarrage efface l'approbation dès que le contenu change.
 * Rien ne l'ouvre automatiquement : ni interrupteur, ni date, ni statut.
 */
import { createHash } from "crypto";
import { prisma } from "@/lib/prisma";
import { semaineValide } from "@/lib/lettre/calendrier";

export interface ContenuNumero {
  subject: string;
  preheader: string | null;
  bodyText: string;
  scheduledFor: Date;
}

export interface ApprobationNumero extends ContenuNumero {
  approvedAt: Date | null;
  approvedHash: string | null;
}

/** Qui a approuvé : la console admin n'a qu'un accès (ADMIN_PASSWORD, celui de Thomas). */
export const APPROUVE_PAR_ADMIN = "admin";

/** Empreinte SHA-256 de ce qui part (objet, pré-en-tête, corps préparé, date d'envoi). */
export function empreinteNumero(n: ContenuNumero): string {
  const charge = JSON.stringify([n.subject, n.preheader ?? "", n.bodyText, n.scheduledFor.toISOString()]);
  return createHash("sha256").update(charge, "utf8").digest("hex");
}

/** Vrai seulement si une approbation existe ET porte sur le contenu actuel. */
export function approbationValide(n: ApprobationNumero): boolean {
  return n.approvedAt !== null && n.approvedHash !== null && n.approvedHash === empreinteNumero(n);
}

/** Champs à remettre à zéro quand le contenu d'un numéro change. */
export const SANS_APPROBATION = { approvedAt: null, approvedBy: null, approvedHash: null } as const;

export type ResultatApprobation = "approuve" | "introuvable" | "non-valide" | "deja-envoye" | "contenu-modifie";

/**
 * Action admin explicite. `empreinte` = celle du texte affiché à l'admin (GET des numéros) :
 * si le numéro a changé depuis, rien n'est approuvé.
 */
export async function approuverNumeroHebdo(p: { semaine: string; empreinte: string; now: Date; par?: string }): Promise<ResultatApprobation> {
  if (!semaineValide(p.semaine)) return "introuvable";
  const numero = await prisma.newsletterIssue.findUnique({
    where: { audience_periodKey: { audience: "HEBDO_PREMIUM", periodKey: p.semaine } },
  });
  if (!numero) return "introuvable";
  if (numero.status === "ENVOYE") return "deja-envoye";
  if (numero.status !== "VALIDE") return "non-valide";
  if (empreinteNumero(numero) !== p.empreinte) return "contenu-modifie";
  // L'empreinte stockée est celle que l'admin a lue : si le contenu change juste après,
  // elle ne correspond plus et la tâche d'envoi refuse le numéro.
  const maj = await prisma.newsletterIssue.updateMany({
    where: { id: numero.id, status: "VALIDE" },
    data: { approvedAt: p.now, approvedBy: p.par ?? APPROUVE_PAR_ADMIN, approvedHash: p.empreinte },
  });
  return maj.count === 1 ? "approuve" : "non-valide";
}

/** Retrait explicite (admin) : le numéro ne part plus tant qu'il n'est pas réapprouvé. */
export async function retirerApprobationHebdo(semaine: string): Promise<"retire" | "introuvable" | "deja-envoye"> {
  if (!semaineValide(semaine)) return "introuvable";
  const numero = await prisma.newsletterIssue.findUnique({
    where: { audience_periodKey: { audience: "HEBDO_PREMIUM", periodKey: semaine } },
  });
  if (!numero) return "introuvable";
  if (numero.status === "ENVOYE") return "deja-envoye";
  await prisma.newsletterIssue.update({ where: { id: numero.id }, data: { ...SANS_APPROBATION } });
  return "retire";
}
