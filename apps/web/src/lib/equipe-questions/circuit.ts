/**
 * « Ta question à l'équipe » : circuit du back-office.
 *
 *   RECUE -> BROUILLON -> RELUE -> ENVOYEE        (ECARTEE hors flux)
 *
 * - Préparation : le lot exporté (sans identité) est préparé EN SESSION par les
 *   agents, puis importé (`importerBrouillons`). Aucun appel d'IA ici : le
 *   `Preparateur` n'est qu'un emplacement, désactivé (`PREPARATEUR_ACTIF`).
 * - Validation : en `validation_humaine` (défaut), seul `marquerRelue` (clic
 *   admin) mène à RELUE et seul `envoyerReponse` (clic admin) envoie.
 *   En `relecture_automatique` (non activé, décision de Thomas), un brouillon
 *   conforme à la grille passe RELUE à l'import et part par la tâche planifiée.
 * - Envoi idempotent : réservation atomique, un seul e-mail même en double clic.
 */
import { prisma } from "@/lib/prisma";
import { LIMITES, modeValidation, VERSION_ACCORD_EXTRAIT } from "@/config/equipe-questions";
import { calculerEcheance, defautsGrille, estEnCours, type StatutQuestion } from "./regles";
import { envoyerEcartee, envoyerExtrait, envoyerReponseEmail } from "./emails";

export type ResultatCircuit =
  | { ok: true; statut: StatutQuestion; deja?: boolean }
  | { ok: false; code: "introuvable" | "etat" | "grille" | "envoi" | "reutilisation" | "compte"; defauts?: string[] };

/** Réservation d'envoi plus vieille que ce délai = envoi interrompu, reprenable. */
const RESERVATION_EXPIREE_MS = 10 * 60 * 1000;

/**
 * Emplacement de la préparation automatique des brouillons. Désactivé : la
 * préparation se fait en session (export, rédaction, import). Brancher ici un
 * préparateur (via `src/lib/ai/`) seulement après la décision de Thomas.
 */
export interface Preparateur {
  preparer(question: { id: string; situation: string; retour: string | null }): Promise<string>;
}
export const PREPARATEUR_ACTIF: Preparateur | null = null;

export async function listerFile(statut?: StatutQuestion) {
  return prisma.equipeQuestion.findMany({
    where: statut ? { statut } : {},
    orderBy: { dueAt: "asc" },
  });
}

/** Lot à préparer : id opaque + texte, SANS e-mail, nom ni id de compte. Sensibles exclues. */
export async function exporterLot(): Promise<{ id: string; situation: string; retour: string | null }[]> {
  const lignes = await prisma.equipeQuestion.findMany({
    where: { statut: "RECUE", sensible: false },
    orderBy: { dueAt: "asc" },
  });
  return lignes.map((q) => ({ id: q.id, situation: q.situation, retour: q.retour ?? null }));
}

/** Import des brouillons préparés en session. Brouillon non conforme à la grille = refusé. */
export async function importerBrouillons(
  items: { id: string; brouillon: string }[],
  now: Date = new Date(),
): Promise<{ importes: string[]; refuses: { id: string; defauts: string[] }[] }> {
  const importes: string[] = [];
  const refuses: { id: string; defauts: string[] }[] = [];
  const auto = modeValidation() === "relecture_automatique";
  for (const item of items) {
    const texte = item.brouillon.trim();
    const defauts = defautsGrille(texte);
    if (defauts.length > 0) {
      refuses.push({ id: item.id, defauts });
      continue;
    }
    const q = await prisma.equipeQuestion.findUnique({ where: { id: item.id } });
    if (!q || (q.statut !== "RECUE" && q.statut !== "BROUILLON")) {
      refuses.push({ id: item.id, defauts: [q ? "etat" : "introuvable"] });
      continue;
    }
    await prisma.equipeQuestion.update({
      where: { id: item.id },
      data: {
        brouillon: texte,
        brouillonSource: "agents",
        brouillonAt: now,
        reponse: texte,
        reponseModifieeParAdmin: false,
        statut: auto && !q.sensible ? "RELUE" : "BROUILLON",
        relueAt: auto && !q.sensible ? now : null,
        relueMode: auto && !q.sensible ? "automatique" : null,
      },
    });
    importes.push(item.id);
  }
  return { importes, refuses };
}

/** Texte final édité par l'admin. Modifier une réponse relue annule la relecture. */
export async function enregistrerReponse(id: string, texte: string, now: Date = new Date()): Promise<ResultatCircuit> {
  const q = await prisma.equipeQuestion.findUnique({ where: { id } });
  if (!q) return { ok: false, code: "introuvable" };
  if (!estEnCours(q.statut)) return { ok: false, code: "etat" };
  const reponse = texte.trim().slice(0, LIMITES.reponseMax);
  await prisma.equipeQuestion.update({
    where: { id },
    data: {
      reponse,
      reponseModifieeParAdmin: q.brouillon != null && q.brouillon.trim() !== reponse,
      brouillonSource: q.brouillonSource ?? "admin",
      brouillonAt: q.brouillonAt ?? now,
      statut: "BROUILLON",
      relueAt: null,
      relueMode: null,
    },
  });
  return { ok: true, statut: "BROUILLON" };
}

/** Clic « Marquer relue » : texte figé, grille obligatoire. */
export async function marquerRelue(id: string, now: Date = new Date()): Promise<ResultatCircuit> {
  const q = await prisma.equipeQuestion.findUnique({ where: { id } });
  if (!q) return { ok: false, code: "introuvable" };
  if (q.statut !== "BROUILLON" || !q.reponse) return { ok: false, code: "etat" };
  const defauts = defautsGrille(q.reponse);
  if (defauts.length > 0) return { ok: false, code: "grille", defauts };
  await prisma.equipeQuestion.update({ where: { id }, data: { statut: "RELUE", relueAt: now, relueMode: "humaine" } });
  return { ok: true, statut: "RELUE" };
}

/**
 * Envoi de la réponse. `declencheur` : `admin` (clic) ou `tache` (mode
 * automatique). En `validation_humaine`, seule une réponse relue À LA MAIN part,
 * et seulement sur clic admin.
 */
export async function envoyerReponse(
  id: string,
  declencheur: "admin" | "tache",
  now: Date = new Date(),
): Promise<ResultatCircuit> {
  const q = await prisma.equipeQuestion.findUnique({ where: { id } });
  if (!q) return { ok: false, code: "introuvable" };
  if (q.statut === "ENVOYEE") return { ok: true, statut: "ENVOYEE", deja: true };
  if (q.statut !== "RELUE" || !q.reponse) return { ok: false, code: "etat" };
  if (modeValidation() === "validation_humaine" && (declencheur !== "admin" || q.relueMode !== "humaine")) {
    return { ok: false, code: "etat" };
  }
  const defauts = defautsGrille(q.reponse);
  if (defauts.length > 0) return { ok: false, code: "grille", defauts };

  const reserve = await prisma.equipeQuestion.updateMany({
    where: {
      id,
      statut: "RELUE",
      OR: [{ envoiReserveAt: null }, { envoiReserveAt: { lt: new Date(now.getTime() - RESERVATION_EXPIREE_MS) } }],
    },
    data: { envoiReserveAt: now },
  });
  if (reserve.count === 0) {
    const apres = await prisma.equipeQuestion.findUnique({ where: { id } });
    return apres?.statut === "ENVOYEE" ? { ok: true, statut: "ENVOYEE", deja: true } : { ok: false, code: "etat" };
  }

  const user = await prisma.user.findUnique({ where: { id: q.userId }, select: { email: true, name: true } });
  if (!user) return { ok: false, code: "compte" };
  try {
    await envoyerReponseEmail(user.email, user.name, q.situation, q.reponse, q.id);
  } catch {
    await prisma.equipeQuestion.updateMany({ where: { id, statut: "RELUE" }, data: { envoiReserveAt: null } });
    return { ok: false, code: "envoi" };
  }
  await prisma.equipeQuestion.update({ where: { id }, data: { statut: "ENVOYEE", sentAt: now } });
  return { ok: true, statut: "ENVOYEE" };
}

/** Clic « Écarter » : l'abonné reçoit toujours un message, la question ne compte plus. */
export async function ecarter(id: string, now: Date = new Date()): Promise<ResultatCircuit> {
  const q = await prisma.equipeQuestion.findUnique({ where: { id } });
  if (!q) return { ok: false, code: "introuvable" };
  if (q.statut === "ECARTEE") return { ok: true, statut: "ECARTEE", deja: true };
  if (!estEnCours(q.statut)) return { ok: false, code: "etat" };
  const { count } = await prisma.equipeQuestion.updateMany({
    where: { id, statut: q.statut },
    data: { statut: "ECARTEE", ecarteeAt: now },
  });
  if (count === 0) return { ok: false, code: "etat" };
  const user = await prisma.user.findUnique({ where: { id: q.userId }, select: { email: true, name: true } });
  if (user) {
    try {
      await envoyerEcartee(user.email, user.name);
    } catch {
      return { ok: false, code: "envoi" };
    }
  }
  return { ok: true, statut: "ECARTEE" };
}

export async function marquerSensible(id: string, sensible: boolean): Promise<ResultatCircuit> {
  const q = await prisma.equipeQuestion.findUnique({ where: { id } });
  if (!q) return { ok: false, code: "introuvable" };
  await prisma.equipeQuestion.update({ where: { id }, data: { sensible } });
  return { ok: true, statut: q.statut };
}

/**
 * Proposition d'un extrait (texte exact) pour la lettre Premium. Possible
 * seulement si la case a été cochée ET la réponse envoyée. L'abonné doit
 * cliquer « Publier » ; sans réponse, rien n'est publié.
 */
export async function proposerExtrait(id: string, texte: string, now: Date = new Date()): Promise<ResultatCircuit> {
  const q = await prisma.equipeQuestion.findUnique({ where: { id } });
  if (!q) return { ok: false, code: "introuvable" };
  if (!q.reutilisationAcceptee) return { ok: false, code: "reutilisation" };
  if (q.statut !== "ENVOYEE") return { ok: false, code: "etat" };
  const extrait = texte.trim();
  const defauts = defautsGrille(extrait).filter((d) => d !== "signature");
  if (extrait.length > LIMITES.extraitMax) defauts.push("trop-long");
  if (defauts.length > 0) return { ok: false, code: "grille", defauts };
  await prisma.equipeQuestion.update({
    where: { id },
    data: {
      extraitTexte: extrait,
      extraitStatut: "PROPOSE",
      extraitVersion: VERSION_ACCORD_EXTRAIT,
      extraitProposeAt: now,
      extraitDecisionAt: null,
    },
  });
  const user = await prisma.user.findUnique({ where: { id: q.userId }, select: { email: true, name: true } });
  if (user) {
    try {
      await envoyerExtrait(user.email, user.name, extrait, q.id);
    } catch {
      return { ok: false, code: "envoi" };
    }
  }
  return { ok: true, statut: q.statut };
}

/** Question reçue hors site (pilote §8) : saisie admin pour un compte existant. */
export async function creerQuestionAdmin(
  entree: { email: string; situation: string; retour?: string | null },
  now: Date = new Date(),
): Promise<{ ok: true; id: string } | { ok: false; code: "compte" }> {
  const user = await prisma.user.findUnique({ where: { email: entree.email.trim().toLowerCase() }, select: { id: true } });
  if (!user) return { ok: false, code: "compte" };
  const q = await prisma.equipeQuestion.create({
    data: {
      userId: user.id,
      situation: entree.situation.trim(),
      retour: entree.retour?.trim() || null,
      receivedAt: now,
      dueAt: calculerEcheance(now),
      idempotencyKey: `admin:${user.id}:${now.getTime()}:${Math.random().toString(36).slice(2, 10)}`,
      origine: "admin",
    },
  });
  return { ok: true, id: q.id };
}
