/**
 * Archive « Lettres » de l'espace (s24, lot D6 ; architecture v20 2.8, décision C5).
 *
 * Source : la table d'envoi, jamais les brouillons. Une lettre (`NewsletterIssue`, lettre de la semaine
 * ou lettre du mois) n'existe ici qu'à partir de son PREMIER envoi réussi (`NewsletterSend` ENVOYE,
 * `sentAt` passé) : avant, elle n'est visible nulle part (archive, « Quoi répondre », rafale, fiche).
 * Elle est montrée telle qu'envoyée aux abonnés : objet et texte approuvés, version Premium (sans le bloc
 * `[[invitation-premium]]`, donc sans prix), mêmes insécables qu'à l'envoi, datée de son envoi
 * (« La lettre du jeudi 12 novembre »), jamais « ancienne » ni « archive ». Les plus récentes d'abord,
 * lettres antérieures à l'abonnement comprises. Le pied personnel (lien d'arrêt) n'est pas repris.
 * Marqueurs mal posés : la lettre n'est pas montrée (elle n'a pas pu partir).
 */
import type { PrismaClient } from "@prisma/client";
import { versionPremium } from "@/lib/lettre/invitation-premium";
import { frPonctuation } from "@/lib/fr-typo";
import { TEXTES_LETTRES } from "@/config/textes/espace-bibliotheque";

export type DbLettres = Pick<PrismaClient, "newsletterIssue">;

export interface LettreArchive {
  numero: string;
  envoyeeLe: Date;
  titre: string;
  objet: string;
}

export interface LettreLue extends LettreArchive {
  corps: string;
}

/** Numéro d'une lettre : celui de la table (« 2026-W46 », lettre de la semaine ; « 2026-11 », lettre du mois). */
export const NUMERO_LETTRE = /^\d{4}-(?:W\d{2}|\d{2})$/;

const PARIS = new Intl.DateTimeFormat("en-US", { timeZone: "Europe/Paris", weekday: "short", day: "numeric", month: "numeric" });
const SEMAINE = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/** « La lettre du jeudi 12 novembre » : jour de l'envoi, à Paris. */
export function titreLettre(envoyeeLe: Date): string {
  const parts = PARIS.formatToParts(envoyeeLe);
  const val = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  return TEXTES_LETTRES.titreLettre({ semaine: SEMAINE.indexOf(val("weekday")), jour: Number(val("day")), mois: Number(val("month")) - 1 });
}

const envoiPasse = (maintenant: Date) => ({ status: "ENVOYE" as const, sentAt: { not: null, lte: maintenant } });

async function lireEnvoyees(db: DbLettres, maintenant: Date, numero?: string) {
  return db.newsletterIssue.findMany({
    where: { ...(numero ? { periodKey: numero } : {}), sends: { some: envoiPasse(maintenant) } },
    select: {
      periodKey: true,
      subject: true,
      bodyText: true,
      sends: { where: envoiPasse(maintenant), orderBy: { sentAt: "asc" }, take: 1, select: { sentAt: true } },
    },
  });
}

type Envoyee = Awaited<ReturnType<typeof lireEnvoyees>>[number];

function versionMontree(l: Envoyee): LettreLue | null {
  const envoyeeLe = l.sends[0]?.sentAt;
  const corps = versionPremium(l.bodyText);
  if (!envoyeeLe || corps === null) return null;
  return { numero: l.periodKey, envoyeeLe, titre: titreLettre(envoyeeLe), objet: frPonctuation(l.subject), corps: frPonctuation(corps.trimEnd()) };
}

/** Archive : toutes les lettres envoyées, les plus récentes d'abord. */
export async function listerLettres(db: DbLettres, maintenant: Date = new Date()): Promise<LettreArchive[]> {
  const lettres = (await lireEnvoyees(db, maintenant)).map(versionMontree).filter((l): l is LettreLue => l !== null);
  return lettres
    .sort((a, b) => b.envoyeeLe.getTime() - a.envoyeeLe.getTime())
    .map(({ numero, envoyeeLe, titre, objet }) => ({ numero, envoyeeLe, titre, objet }));
}

/** Une lettre envoyée, ou null (numéro inconnu, pas encore envoyée : comme une adresse inexistante). */
export async function lireLettre(db: DbLettres, numero: string, maintenant: Date = new Date()): Promise<LettreLue | null> {
  if (!NUMERO_LETTRE.test(numero)) return null;
  const lettres = (await lireEnvoyees(db, maintenant, numero)).map(versionMontree).filter((l): l is LettreLue => l !== null);
  return lettres.sort((a, b) => a.envoyeeLe.getTime() - b.envoyeeLe.getTime())[0] ?? null;
}

/** Numéros des lettres envoyées et leur titre (fiches reprises : « Vu dans la lettre du … »). */
export async function lettresEnvoyees(db: DbLettres, maintenant: Date = new Date()): Promise<Map<string, string>> {
  return new Map((await listerLettres(db, maintenant)).map((l) => [l.numero, l.titre]));
}

/** Une fiche reprise d'une lettre n'est servie qu'une fois la lettre envoyée. */
export function fichesVisibles<T extends { repriseDeLettre?: string }>(fiches: readonly T[], envoyees: ReadonlyMap<string, string>): T[] {
  return fiches.filter((f) => !f.repriseDeLettre || envoyees.has(f.repriseDeLettre));
}

/** Lecture des lettres seulement si une fiche en reprend une (aucune requête sinon). */
export async function envoyeesSiBesoin(
  db: DbLettres,
  fiches: readonly { repriseDeLettre?: string }[],
  maintenant: Date = new Date(),
): Promise<Map<string, string>> {
  return fiches.some((f) => f.repriseDeLettre) ? lettresEnvoyees(db, maintenant) : new Map();
}
