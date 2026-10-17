/**
 * « Ta question à l'équipe » : côté abonné (routes /api/equipe-questions).
 * Toutes les fonctions supposent l'interrupteur vérifié par l'appelant.
 * Accès : plan PREMIUM lu EN BASE (jamais dans le jeton de session).
 */
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { VERSION_CASE_REUTILISATION } from "@/config/equipe-questions";
import {
  calculerEcheance,
  debutFenetreGardeFou,
  estPremium,
  gardeFouAtteint,
  type NouvelleQuestion,
  type StatutExtrait,
  type StatutQuestion,
} from "./regles";
import { envoyerAccuse } from "./emails";

export type Refus = { ok: false; code: "premium" | "garde-fou" | "introuvable" | "etat" };

type Abonne = { id: string; plan: string; email: string; name: string | null };

export async function chargerAbonne(userId: string): Promise<Abonne | null> {
  const u = await prisma.user.findUnique({ where: { id: userId }, select: { id: true, plan: true, email: true, name: true } });
  return u ? { ...u, plan: String(u.plan) } : null;
}

/** Vue abonné d'une question : jamais le brouillon, jamais les champs internes. */
export type QuestionAbonne = {
  id: string;
  situation: string;
  retour: string | null;
  statut: StatutQuestion;
  receivedAt: Date;
  dueAt: Date;
  reponse: string | null;
  sentAt: Date | null;
  reutilisationAcceptee: boolean;
  extraitTexte: string | null;
  extraitStatut: StatutExtrait;
};

type Ligne = QuestionAbonne & Record<string, unknown>;

export function vueAbonne(q: Ligne): QuestionAbonne {
  const envoyee = q.statut === "ENVOYEE";
  const extraitVisible = q.extraitStatut !== "AUCUN";
  return {
    id: q.id,
    situation: q.situation,
    retour: q.retour ?? null,
    statut: q.statut,
    receivedAt: q.receivedAt,
    dueAt: q.dueAt,
    reponse: envoyee ? (q.reponse ?? null) : null,
    sentAt: envoyee ? (q.sentAt ?? null) : null,
    reutilisationAcceptee: q.reutilisationAcceptee,
    extraitTexte: extraitVisible ? (q.extraitTexte ?? null) : null,
    extraitStatut: q.extraitStatut,
  };
}

/**
 * Création d'une question. Idempotente : la clé envoyée par le navigateur est
 * préfixée par l'id du compte ; un double clic renvoie la même question.
 */
export async function creerQuestion(
  userId: string,
  entree: NouvelleQuestion,
  now: Date = new Date(),
): Promise<{ ok: true; question: QuestionAbonne; email: string; creee: boolean } | Refus> {
  const abonne = await chargerAbonne(userId);
  if (!abonne || !estPremium(abonne.plan)) return { ok: false, code: "premium" };

  const idempotencyKey = `${userId}:${entree.idempotencyKey}`;
  const existante = await prisma.equipeQuestion.findUnique({ where: { idempotencyKey } });
  if (existante) return { ok: true, question: vueAbonne(existante as Ligne), email: abonne.email, creee: false };

  const recentes = await prisma.equipeQuestion.count({
    where: { userId, receivedAt: { gte: debutFenetreGardeFou(now) }, statut: { not: "ECARTEE" } },
  });
  if (gardeFouAtteint(recentes)) return { ok: false, code: "garde-fou" };

  const dueAt = calculerEcheance(now);
  let creee;
  try {
    creee = await prisma.equipeQuestion.create({
      data: {
        userId,
        situation: entree.situation,
        retour: entree.retour ? entree.retour : null,
        receivedAt: now,
        dueAt,
        idempotencyKey,
        origine: "site",
        // Preuve écrite côté serveur : version, date, jamais le texte du navigateur.
        reutilisationAcceptee: entree.reutilisation === true,
        reutilisationVersion: entree.reutilisation ? VERSION_CASE_REUTILISATION : null,
        reutilisationAt: entree.reutilisation ? now : null,
      },
    });
  } catch (err) {
    // Double clic simultané : la contrainte unique a joué, on renvoie la première.
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      const deja = await prisma.equipeQuestion.findUnique({ where: { idempotencyKey } });
      if (deja) return { ok: true, question: vueAbonne(deja as Ligne), email: abonne.email, creee: false };
    }
    throw err;
  }

  // Accusé attendu AVANT la réponse HTTP ; un échec n'annule pas la question
  // (alerte A enregistrée par lib/email.ts, la réponse arrivera quand même).
  try {
    await envoyerAccuse(abonne.email, abonne.name, dueAt);
  } catch (err) {
    console.error("[equipe-questions] Accusé non envoyé :", err instanceof Error ? err.message : err);
  }
  return { ok: true, question: vueAbonne(creee as Ligne), email: abonne.email, creee: true };
}

export async function listerQuestions(userId: string): Promise<{ ok: true; questions: QuestionAbonne[] } | Refus> {
  const abonne = await chargerAbonne(userId);
  if (!abonne || !estPremium(abonne.plan)) return { ok: false, code: "premium" };
  const lignes = await prisma.equipeQuestion.findMany({ where: { userId }, orderBy: { receivedAt: "desc" } });
  return { ok: true, questions: lignes.map((q) => vueAbonne(q as Ligne)) };
}

export async function lireQuestion(userId: string, id: string): Promise<{ ok: true; question: QuestionAbonne } | Refus> {
  const abonne = await chargerAbonne(userId);
  if (!abonne || !estPremium(abonne.plan)) return { ok: false, code: "premium" };
  const q = await prisma.equipeQuestion.findFirst({ where: { id, userId } });
  return q ? { ok: true, question: vueAbonne(q as Ligne) } : { ok: false, code: "introuvable" };
}

/** Effacement immédiat (RGPD art. 17), réservé à l'auteur. */
export async function supprimerQuestion(userId: string, id: string): Promise<{ ok: true } | Refus> {
  const abonne = await chargerAbonne(userId);
  if (!abonne || !estPremium(abonne.plan)) return { ok: false, code: "premium" };
  const { count } = await prisma.equipeQuestion.deleteMany({ where: { id, userId } });
  return count > 0 ? { ok: true } : { ok: false, code: "introuvable" };
}

/**
 * Accord par extrait (@legal Q4) : seul un clic sur « Publier » vaut accord,
 * pour le texte exact affiché. Changement d'avis possible tant que la lettre
 * n'est pas partie (le lot de la lettre verrouillera l'extrait envoyé).
 */
export async function deciderExtrait(
  userId: string,
  id: string,
  decision: "publier" | "refuser",
  /** Texte exact affiché à l'abonné : l'accord ne vaut que pour celui-là. */
  texteVu: string,
  now: Date = new Date(),
): Promise<{ ok: true; extraitStatut: StatutExtrait } | Refus> {
  const abonne = await chargerAbonne(userId);
  if (!abonne || !estPremium(abonne.plan)) return { ok: false, code: "premium" };
  const q = await prisma.equipeQuestion.findFirst({ where: { id, userId } });
  if (!q) return { ok: false, code: "introuvable" };
  if (q.extraitStatut === "AUCUN" || !q.extraitTexte) return { ok: false, code: "etat" };
  // Texte modifié entre l'affichage et le clic : aucun accord, on relit.
  if (q.extraitTexte.trim() !== texteVu.trim()) return { ok: false, code: "etat" };
  const extraitStatut: StatutExtrait = decision === "publier" ? "ACCEPTE" : "REFUSE";
  await prisma.equipeQuestion.update({ where: { id }, data: { extraitStatut, extraitDecisionAt: now } });
  return { ok: true, extraitStatut };
}
