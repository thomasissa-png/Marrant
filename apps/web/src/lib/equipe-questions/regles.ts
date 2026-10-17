/**
 * « Ta question à l'équipe » : règles pures (aucun accès base, aucun envoi).
 * Partagées par les routes abonné, le back-office et les tâches planifiées.
 */
import { z } from "zod";
import {
  DELAI_REPONSE_HEURES,
  GARDE_FOU,
  LIMITES,
  SIGNATURE_EQUIPE,
} from "@/config/equipe-questions";
import { DEBUT_SUJET_MOTS, TEXTES_EQUIPE_ETATS as E } from "@/config/textes/equipe-questions";

export type StatutQuestion = "RECUE" | "BROUILLON" | "RELUE" | "ENVOYEE" | "ECARTEE";
export type StatutExtrait = "AUCUN" | "PROPOSE" | "ACCEPTE" | "REFUSE";

const HEURE_MS = 3_600_000;

/** « Abonné » = plan PREMIUM en base (même notion que les parcours et favoris). */
export function estPremium(plan: string | null | undefined): boolean {
  return plan === "PREMIUM";
}

/** Corps du POST abonné. Messages = textes exacts de la spec §2.3. */
export const schemaNouvelleQuestion = z.object({
  situation: z
    .string()
    .transform((s) => s.trim())
    .superRefine((s, ctx) => {
      if (s.length < LIMITES.situationMin) ctx.addIssue({ code: "custom", message: E.situationCourte });
      else if (s.length > LIMITES.situationMax)
        ctx.addIssue({ code: "custom", message: E.situationLongue(s.length - LIMITES.situationMax) });
    }),
  retour: z
    .string()
    .optional()
    .nullable()
    .transform((s) => (s ?? "").trim())
    .superRefine((s, ctx) => {
      if (s.length > LIMITES.retourMax) ctx.addIssue({ code: "custom", message: E.retourLong(s.length - LIMITES.retourMax) });
    }),
  reutilisation: z.boolean().optional().default(false),
  idempotencyKey: z.string().trim().min(8).max(100),
});
export type NouvelleQuestion = z.infer<typeof schemaNouvelleQuestion>;

/** Échéance visée : réception + 48 h. */
export function calculerEcheance(receivedAt: Date): Date {
  return new Date(receivedAt.getTime() + DELAI_REPONSE_HEURES * HEURE_MS);
}

/** Début de la fenêtre glissante du garde-fou. */
export function debutFenetreGardeFou(now: Date): Date {
  return new Date(now.getTime() - GARDE_FOU.fenetreJours * 24 * HEURE_MS);
}

/** Garde-fou invisible : `true` si une nouvelle question doit être refusée poliment. */
export function gardeFouAtteint(questionsDansFenetre: number): boolean {
  return questionsDansFenetre >= GARDE_FOU.maxQuestions;
}

/** Date limite lisible, heure de Paris : « dimanche 19 octobre à 14 h 05 ». */
export function formaterDateLimite(d: Date): string {
  const jour = new Intl.DateTimeFormat("fr-FR", {
    timeZone: "Europe/Paris",
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(d);
  const parts = new Intl.DateTimeFormat("fr-FR", {
    timeZone: "Europe/Paris",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(d);
  const h = Number(parts.find((p) => p.type === "hour")?.value ?? "0");
  const m = parts.find((p) => p.type === "minute")?.value ?? "00";
  return `${jour} à ${h} h ${m}`;
}

/** Objet de l'e-mail de réponse : premiers mots de la situation. */
export function debutSujet(situation: string): string {
  const mots = situation.replace(/\s+/g, " ").trim().split(" ");
  const debut = mots.slice(0, DEBUT_SUJET_MOTS).join(" ").replace(/[.,;:!?]+$/, "");
  return mots.length > DEBUT_SUJET_MOTS ? `${debut}…` : debut;
}

/**
 * Grille automatique (spec §3.2, critères vérifiables par machine) appliquée à
 * tout brouillon importé et à toute réponse avant envoi : zéro tiret cadratin,
 * zéro émoji, aucune mention d'outil, signature présente, longueur bornée.
 * Retourne la liste des défauts (vide = conforme). Elle ne remplace pas la
 * relecture : en mode `validation_humaine`, elle s'ajoute au clic de Thomas.
 */
const EMOJI = /\p{Extended_Pictographic}/u;
const MENTION_OUTIL = /intelligence artificielle|\bIA\b|\bAI\b|chatgpt|\bLLM\b|mod[eè]le de langage|\bClaude\b/i;

export function defautsGrille(texte: string): string[] {
  const defauts: string[] = [];
  const t = texte.trim();
  if (!t) return ["vide"];
  if (t.includes("—")) defauts.push("tiret-cadratin");
  if (EMOJI.test(t)) defauts.push("emoji");
  if (MENTION_OUTIL.test(t)) defauts.push("mention-outil");
  if (!t.endsWith(SIGNATURE_EQUIPE)) defauts.push("signature");
  if (t.length > LIMITES.reponseMax) defauts.push("trop-long");
  return defauts;
}

/** Libellé admin du statut (back-office). */
export const LIBELLES_STATUT_ADMIN: Record<StatutQuestion, string> = {
  RECUE: "Reçue",
  BROUILLON: "Brouillon",
  RELUE: "Relue",
  ENVOYEE: "Envoyée",
  ECARTEE: "Écartée",
};

/** Une question « en cours » attend encore une réponse. */
export function estEnCours(statut: StatutQuestion): boolean {
  return statut === "RECUE" || statut === "BROUILLON" || statut === "RELUE";
}
