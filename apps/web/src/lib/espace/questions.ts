/**
 * « Mes questions » (s24, lot D7 ; architecture v20 2.6 ; maquette `mes-questions.html`).
 *
 * - Un fil par envoi (type PROBLEME, SITUATION ou QUESTION), messages de l'abonné et de l'équipe,
 *   gardés en base sans effacement, sauf « Retirer de mon historique » (suppression du fil, demande
 *   de l'abonné, décision C10 a) ou suppression du compte (cascade et `deleteAccount`).
 * - Le texte n'est JAMAIS journalisé (erreurs : nom et code seulement), ni écrit dans `UsageEvent`,
 *   ni envoyé à Umami. Aucune analyse du texte, aucune détection (décision C10 b).
 * - Limites reprises de `api/question-equipe` : 1 000 caractères (`QUESTION_EQUIPE_MAX`, même
 *   nettoyage que `validerQuestion`), 3 envois par 10 minutes et 10 par jour (`QUESTION_EQUIPE_LIMITES`).
 * - Un abonné ne lit ni n'écrit que ses fils : toute lecture passe par (`id`, `userId`) ; un fil d'un
 *   autre compte est introuvable (404), jamais révélé.
 * - « En retard » : 3 jours ouvrés (lundi à vendredi, heure de Paris) écoulés depuis le dernier message
 *   de l'abonné sans réponse (étalon : envoyé le vendredi 6, en retard le jeudi 12).
 * - État « lu » : `ouvertParAbonneLe` posé à l'ouverture du fil ; une réponse est non lue tant que le
 *   fil n'a pas été ouvert après elle (2.9 : ouvrir le panneau de la cloche ne suffit pas).
 */
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { validerQuestion } from "@/lib/question-equipe";
import { FORMAT_CLE } from "@/lib/espace/api";
import { TYPES_QUESTION, type FilListe, type TypeQuestion } from "@/lib/espace/questions-types";

export { SCENES_BUT, SCENES_OU, TYPES_QUESTION, type FilListe, type MessageListe, type TypeQuestion } from "@/lib/espace/questions-types";

/** Réponse de l'équipe : plafond de la colonne (contrainte CHECK de la migration 25). */
export const REPONSE_EQUIPE_MAX = 10_000;

/** Seuil « En retard » (2.6) et alerte interne [HYPOTHÈSE plan D7 : plus de 10 fils en attente]. */
export const JOURS_OUVRES_RETARD = 3;
export const ALERTE_ATTENTE = 10;

const texteAbonne = z.string().transform((brut, ctx) => {
  const v = validerQuestion(brut);
  if (!v.ok) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: v.erreur });
    return z.NEVER;
  }
  return v.question;
});

export const corpsEnvoi = z.object({ type: z.enum(TYPES_QUESTION), message: texteAbonne, cle: z.string().regex(FORMAT_CLE) }).strict();
export const corpsContinuer = z.object({ message: texteAbonne, cle: z.string().regex(FORMAT_CLE) }).strict();

/** Erreur de validation lisible par le navigateur : « vide » ou « trop-long », sinon « valeur ». */
export function erreurDeTexte(e: z.ZodError): "vide" | "trop-long" | "valeur" {
  const m = e.issues.find((i) => i.path[0] === "message")?.message;
  return m === "vide" || m === "trop-long" ? m : "valeur";
}

const PARIS = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Paris", year: "numeric", month: "2-digit", day: "2-digit" });
/** Jour civil de Paris, en millisecondes UTC à minuit (pour compter des jours entiers). */
const jourParis = (d: Date) => Date.parse(`${PARIS.format(d)}T00:00:00Z`);

/** Jours ouvrés (lundi à vendredi) entièrement écoulés entre le jour de `depuis` et celui de `maintenant`. */
export function joursOuvresEcoules(depuis: Date, maintenant: Date): number {
  let n = 0;
  for (let j = jourParis(depuis) + 86_400_000; j < jourParis(maintenant); j += 86_400_000) {
    const jour = new Date(j).getUTCDay();
    if (jour !== 0 && jour !== 6) n++;
  }
  return n;
}

type Ligne = {
  id: string;
  type: string;
  statut: string;
  creeLe: Date;
  dernierMessageLe: Date;
  ouvertParAbonneLe: Date | null;
  messages: { auteur: string; corps: string; creeLe: Date }[];
};

/** Mise en forme d'un fil pour l'abonné (dates ISO, retard, non lu). */
export function versListe(f: Ligne, maintenant: Date = new Date()): FilListe {
  const messages = [...f.messages].sort((a, b) => a.creeLe.getTime() - b.creeLe.getTime());
  const derniereEquipe = messages.filter((m) => m.auteur === "EQUIPE").at(-1);
  const dernierAbonne = messages.filter((m) => m.auteur === "ABONNE").at(-1);
  const enAttente = f.statut === "EN_ATTENTE";
  return {
    id: f.id,
    type: f.type as TypeQuestion,
    statut: enAttente ? "EN_ATTENTE" : "REPONDU",
    creeLe: f.creeLe.toISOString(),
    dernierMessageLe: f.dernierMessageLe.toISOString(),
    enRetard: enAttente && joursOuvresEcoules(dernierAbonne?.creeLe ?? f.creeLe, maintenant) >= JOURS_OUVRES_RETARD,
    nonLu: !enAttente && Boolean(derniereEquipe) && (!f.ouvertParAbonneLe || f.ouvertParAbonneLe < derniereEquipe!.creeLe),
    messages: messages.map((m) => ({ auteur: m.auteur === "EQUIPE" ? "EQUIPE" : "ABONNE", corps: m.corps, creeLe: m.creeLe.toISOString() })),
  };
}

const SELECTION = {
  id: true,
  type: true,
  statut: true,
  creeLe: true,
  dernierMessageLe: true,
  ouvertParAbonneLe: true,
  messages: { select: { auteur: true, corps: true, creeLe: true }, orderBy: { creeLe: "asc" as const } },
} as const;

/** Historique de l'abonné, le plus récent d'abord (lisible aussi après la résiliation). */
export async function listerFils(userId: string, maintenant: Date = new Date()): Promise<FilListe[]> {
  const fils = await prisma.equipeFil.findMany({ where: { userId }, select: SELECTION, orderBy: { dernierMessageLe: "desc" } });
  return fils.map((f) => versListe(f, maintenant));
}

/** Un fil de l'abonné, ou null (inexistant ou d'un autre compte : jamais distingués). */
export async function lireFil(userId: string, id: string, maintenant: Date = new Date()): Promise<FilListe | null> {
  const f = await prisma.equipeFil.findFirst({ where: { id, userId }, select: SELECTION });
  return f ? versListe(f, maintenant) : null;
}

/**
 * Fils dont la réponse de l'équipe n'est pas lue (cloche, lot D8) : une ligne par fil, la réponse la plus
 * récente d'abord ; disparaît dès que le fil est ouvert (`ouvertParAbonneLe`), jamais à l'ouverture du panneau.
 */
export async function reponsesNonLues(userId: string): Promise<{ id: string; type: TypeQuestion; reponduLe: string }[]> {
  const fils = await prisma.equipeFil.findMany({ where: { userId, statut: "REPONDU" }, select: SELECTION });
  return fils
    .map((f) => versListe(f))
    .filter((f) => f.nonLu)
    .map((f) => ({ id: f.id, type: f.type, reponduLe: f.messages.filter((m) => m.auteur === "EQUIPE").at(-1)!.creeLe }))
    .sort((a, b) => b.reponduLe.localeCompare(a.reponduLe));
}

/** Réponses de l'équipe non lues (pastille de la cloche, lot D8) : le nombre de fils non ouverts. */
export async function compterNonLues(userId: string): Promise<number> {
  return (await reponsesNonLues(userId)).length;
}

const estDoublon = (e: unknown) => (e as { code?: unknown } | null)?.code === "P2002";

/**
 * Nouvel envoi : un fil et son premier message, dans une transaction. Double clic (même clé) : le fil
 * déjà créé est renvoyé, aucune seconde ligne.
 */
export async function creerFil(userId: string, type: TypeQuestion, corps: string, cle: string): Promise<{ id: string; nouveau: boolean }> {
  try {
    const maintenant = new Date();
    const fil = await prisma.equipeFil.create({
      data: { userId, type, cle, creeLe: maintenant, dernierMessageLe: maintenant, messages: { create: { auteur: "ABONNE", corps, cle, creeLe: maintenant } } },
      select: { id: true },
    });
    return { id: fil.id, nouveau: true };
  } catch (e) {
    if (!estDoublon(e)) throw e;
    const deja = await prisma.equipeFil.findUnique({ where: { userId_cle: { userId, cle } }, select: { id: true } });
    if (!deja) throw e;
    return { id: deja.id, nouveau: false };
  }
}

/**
 * « Continuer » : un message ajouté à un fil RÉPONDU de l'abonné ; le fil repasse en attente.
 * `introuvable` (autre compte ou inexistant), `en-attente` (pas encore de réponse), sinon ok.
 */
export async function continuerFil(
  userId: string,
  filId: string,
  corps: string,
  cle: string,
): Promise<{ ok: true; nouveau: boolean } | { ok: false; raison: "introuvable" | "en-attente" }> {
  const fil = await prisma.equipeFil.findFirst({ where: { id: filId, userId }, select: { statut: true } });
  if (!fil) return { ok: false, raison: "introuvable" };
  const deja = await prisma.equipeMessage.findUnique({ where: { filId_cle: { filId, cle } }, select: { id: true } });
  if (deja) return { ok: true, nouveau: false };
  if (fil.statut !== "REPONDU") return { ok: false, raison: "en-attente" };
  const maintenant = new Date();
  try {
    await prisma.$transaction([
      prisma.equipeMessage.create({ data: { filId, auteur: "ABONNE", corps, cle, creeLe: maintenant } }),
      prisma.equipeFil.update({ where: { id: filId }, data: { statut: "EN_ATTENTE", dernierMessageLe: maintenant } }),
    ]);
  } catch (e) {
    if (estDoublon(e)) return { ok: true, nouveau: false };
    throw e;
  }
  return { ok: true, nouveau: true };
}

/**
 * « Retirer de mon historique » (décision de Thomas du 13/11 : effacement définitif) : les messages PUIS le
 * fil sont SUPPRIMÉS en base, dans une transaction (aucune suppression logique, aucune colonne d'état ;
 * la cascade `EquipeMessage` vers `EquipeFil` de la migration 25 reste une seconde garantie). Fil d'un
 * autre compte : rien n'est touché (filtre sur le compte dans les deux suppressions).
 */
export async function retirerFil(userId: string, filId: string): Promise<boolean> {
  const [, fil] = await prisma.$transaction([
    prisma.equipeMessage.deleteMany({ where: { filId, fil: { userId } } }),
    prisma.equipeFil.deleteMany({ where: { id: filId, userId } }),
  ]);
  return fil.count > 0;
}

/** Ouverture du fil par l'abonné : les réponses déjà là deviennent lues. */
export async function marquerOuvert(userId: string, filId: string, maintenant: Date = new Date()): Promise<boolean> {
  const { count } = await prisma.equipeFil.updateMany({ where: { id: filId, userId }, data: { ouvertParAbonneLe: maintenant } });
  return count > 0;
}

/** Journal d'erreur SANS le texte : nom et code de l'erreur seulement. */
export function journaliserQuestions(contexte: string, error: unknown): void {
  const e = error as { name?: unknown; code?: unknown } | null;
  const nom = typeof e?.name === "string" ? e.name : "Erreur";
  const code = typeof e?.code === "string" ? ` ${e.code}` : "";
  console.error(`[espace/questions/${contexte}] échec : ${nom}${code}`);
}
