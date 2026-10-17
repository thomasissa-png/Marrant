/**
 * « Ta question à l'équipe » : e-mails (texte seul, aucun pixel ni lien réécrit).
 * Pas de copie du texte de la question dans l'accusé (minimisation, spec §2.4).
 * L'envoi passe par `lib/email.ts` (alerte A enregistrée si Resend refuse).
 */
import { ADMIN_EMAIL, sendTransactionalTextEmail } from "@/lib/email";
import { salutation } from "@/lib/emails/annual-renewal-reminder";
import { adresseAlerteAdmin, CHEMIN_QUESTIONS } from "@/config/equipe-questions";
import { EMAILS_ADMIN_EQUIPE, EMAILS_EQUIPE } from "@/config/textes/equipe-questions";
import { debutSujet, formaterDateLimite } from "./regles";

export function baseUrl(): string {
  return (process.env.NEXTAUTH_URL || "https://deviens-marrant.fr").replace(/\/$/, "");
}

export function lienQuestion(id?: string): string {
  return `${baseUrl()}${CHEMIN_QUESTIONS}${id ? `/${id}` : ""}`;
}

export function rendreAccuse(prenom: string | null, dueAt: Date) {
  return { sujet: EMAILS_EQUIPE.accuse.sujet, texte: EMAILS_EQUIPE.accuse.corps(salutation(prenom), formaterDateLimite(dueAt)) };
}

export function rendreReponse(prenom: string | null, situation: string, reponse: string, id: string) {
  return {
    sujet: EMAILS_EQUIPE.reponse.sujet(debutSujet(situation)),
    texte: EMAILS_EQUIPE.reponse.corps(salutation(prenom), reponse.trim(), lienQuestion(id)),
  };
}

export function rendreEcartee(prenom: string | null) {
  return { sujet: EMAILS_EQUIPE.ecartee.sujet, texte: EMAILS_EQUIPE.ecartee.corps(salutation(prenom), lienQuestion()) };
}

export function rendreExtrait(prenom: string | null, extrait: string, id: string) {
  return { sujet: EMAILS_EQUIPE.extrait.sujet, texte: EMAILS_EQUIPE.extrait.corps(salutation(prenom), extrait.trim(), lienQuestion(id)) };
}

export async function envoyerAccuse(to: string, prenom: string | null, dueAt: Date): Promise<void> {
  const { sujet, texte } = rendreAccuse(prenom, dueAt);
  await sendTransactionalTextEmail(to, sujet, texte, "equipe-accuse");
}

export async function envoyerReponseEmail(to: string, prenom: string | null, situation: string, reponse: string, id: string): Promise<void> {
  const { sujet, texte } = rendreReponse(prenom, situation, reponse, id);
  await sendTransactionalTextEmail(to, sujet, texte, "equipe-reponse");
}

export async function envoyerEcartee(to: string, prenom: string | null): Promise<void> {
  const { sujet, texte } = rendreEcartee(prenom);
  await sendTransactionalTextEmail(to, sujet, texte, "equipe-ecartee");
}

export async function envoyerExtrait(to: string, prenom: string | null, extrait: string, id: string): Promise<void> {
  const { sujet, texte } = rendreExtrait(prenom, extrait, id);
  await sendTransactionalTextEmail(to, sujet, texte, "equipe-extrait");
}

/**
 * Alerte interne : jamais l'e-mail ni le nom de l'abonné, ni le texte de la
 * question (la file du back-office fait foi). Seulement des identifiants
 * opaques et des échéances.
 */
export async function envoyerAlerteAdmin(
  type: "arrivee" | "echeance",
  questions: { id: string; dueAt: Date }[],
): Promise<void> {
  const sujet = type === "arrivee" ? EMAILS_ADMIN_EQUIPE.arrivee(questions.length) : EMAILS_ADMIN_EQUIPE.echeance(questions.length);
  const lignes = questions.map((q) => `- ${q.id} : échéance ${formaterDateLimite(q.dueAt)}`);
  const texte = `${lignes.join("\n")}\n\nFile : ${baseUrl()}/admin/equipe-questions`;
  await sendTransactionalTextEmail(adresseAlerteAdmin(ADMIN_EMAIL), sujet, texte, "equipe-alerte-admin");
}
