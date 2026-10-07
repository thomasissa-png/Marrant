import { Resend } from "resend";
import { recordAdminAlert } from "@/lib/admin-alerts";
import { salutation } from "@/lib/emails/annual-renewal-reminder";

const FROM_EMAIL = process.env.EMAIL_FROM ?? "Deviens Marrant <noreply@deviens-marrant.fr>";

/** Destinataire des emails internes (alertes, rapports, demandes de rétractation). */
export const ADMIN_EMAIL = "alex@deviens-marrant.fr";

/*
 * s15 (06/10/2026) : `sendAdminAlert` (un e-mail par alerte) est supprimé. Les
 * alertes passent par `lib/admin-alerts.ts` (enregistrées) et le seul e-mail
 * d'alerte est le digest quotidien (`lib/admin-digest.ts`, via sendAdminHtmlEmail).
 *
 * s16 (07/10/2026) : client Resend créé à la première utilisation (le
 * constructeur lève sans clé), `{ error }` de Resend lu sur TOUS les envois, et
 * tout échec d'envoi à un client enregistre une alerte de classe A
 * `email-envoi-<type>` (digest du matin, un seul e-mail par jour).
 */
let _resend: Resend | null = null;
function getResend(): Resend {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY non configurée : e-mail non envoyé");
  }
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY);
  return _resend;
}

/** Type d'e-mail client, suffixe de la clé d'alerte `email-envoi-<type>`. */
export type TransactionalEmailKind =
  | "transactionnel"
  | "reinitialisation"
  | "rappel-annuel"
  | "confirmation-abonnement"
  | "paiement-refuse"
  | "resiliation"
  | "retractation-accuse"
  | "retractation-admin";

function domaineDe(to: string): string {
  return to.includes("@") ? to.split("@").pop() ?? "?" : "?";
}

/** Envoi brut + lecture de `{ error }` ; enregistre l'alerte A puis relance l'erreur. */
async function sendOrAlert(
  kind: TransactionalEmailKind,
  payload: { to: string; subject: string; text?: string; html?: string },
): Promise<void> {
  try {
    const { error } = await getResend().emails.send({ from: FROM_EMAIL, ...payload } as Parameters<Resend["emails"]["send"]>[0]);
    if (error) throw new Error(`Resend : ${error.message}`);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    // Jamais l'adresse complète dans l'alerte : seulement le domaine.
    await recordAdminAlert({
      cle: `email-envoi-${kind}`,
      sujet: `E-mail « ${kind} » non envoyé`,
      html: `<p>Destinataire : ...@${domaineDe(payload.to)}</p><p>Objet : ${payload.subject}</p><p>Erreur : ${message}</p><p>À vérifier : clé RESEND_API_KEY, domaine d'envoi, quota Resend.</p>`,
    });
    throw err instanceof Error ? err : new Error(message);
  }
}

/** Échappement HTML minimal des valeurs insérées dans un gabarit HTML. */
function escapeHtml(valeur: string): string {
  return valeur.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

/**
 * Gabarit de l'e-mail de réinitialisation (hors étalons s16, texte inchangé).
 * Lot E : salutation avec le prénom du compte (« Salut Marie-Hélène, »), repli
 * « Salut, » si absent. Exporté pour les tests et les aperçus.
 */
export function renderPasswordResetEmail(resetUrl: string, prenom: string | null = null): { subject: string; html: string } {
  return {
    subject: "Réinitialise ton mot de passe Deviens Marrant",
    html: `
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px; color: #1a1a1a;">
  <h2 style="color: #7c3aed; margin-bottom: 8px;">Deviens Marrant 🎤</h2>
  <p>${escapeHtml(salutation(prenom))}</p>
  <p>Tu as demandé à changer ton mot de passe. Un clic sur le bouton ci-dessous et tu en choisis un nouveau :</p>
  <a href="${resetUrl}" style="display: inline-block; background: #7c3aed; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 16px 0;">Réinitialiser mon mot de passe</a>
  <p style="font-size: 14px; color: #666;">Ce lien expire dans <strong>1 heure</strong>.</p>
  <p style="font-size: 14px; color: #666;">Si tu n'as pas fait cette demande, ignore cet email : ton mot de passe actuel reste valable.</p>
  <p style="font-size: 14px; color: #666;">P.S. : oublier un mot de passe, ça arrive à tout le monde. Oublier la chute d'une blague aussi, mais ça, on s'en occupe.</p>
  <p>L'Équipe Deviens Marrant</p>
  <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;">
  <p style="font-size: 12px; color: #999;">deviens-marrant.fr · Deviens dr&ocirc;le, un exercice &agrave; la fois.</p>
</body>
</html>`,
  };
}

export async function sendPasswordResetEmail(to: string, resetUrl: string, prenom: string | null = null): Promise<void> {
  const { subject, html } = renderPasswordResetEmail(resetUrl, prenom);
  await sendOrAlert("reinitialisation", { to, subject, html });
}

/**
 * Email transactionnel en texte simple (rappel légal de reconduction de
 * l'annuel, confirmations d'abonnement, de résiliation, rétractation…). Lève
 * une erreur si l'envoi échoue ou si Resend n'est pas configuré (alerte A
 * enregistrée avant) : l'appelant marque l'envoi en échec ou continue.
 */
export async function sendTransactionalTextEmail(
  to: string,
  subject: string,
  text: string,
  kind: TransactionalEmailKind = "transactionnel",
): Promise<void> {
  await sendOrAlert(kind, { to, subject, text });
}

/**
 * Variante qui ne lève jamais (notifications après un paiement déjà traité :
 * un e-mail raté ne doit pas faire rejouer le webhook). `true` si accepté.
 */
export async function trySendTransactionalTextEmail(
  to: string,
  subject: string,
  text: string,
  kind: TransactionalEmailKind,
): Promise<boolean> {
  try {
    await sendOrAlert(kind, { to, subject, text });
    return true;
  } catch (err) {
    console.error(`[email] Envoi « ${kind} » en échec :`, err instanceof Error ? err.message : err);
    return false;
  }
}

/**
 * Email interne HTML à l'admin (rapport hebdomadaire des visites, digest).
 * Lève une erreur si Resend n'est pas configuré ou refuse l'envoi : l'appelant
 * libère alors son verrou pour retenter au tick suivant. Pas d'alerte ici :
 * c'est le canal des alertes lui-même.
 */
export async function sendAdminHtmlEmail(subject: string, html: string): Promise<void> {
  const { error } = await getResend().emails.send({ from: FROM_EMAIL, to: ADMIN_EMAIL, subject, html });
  if (error) {
    throw new Error(`Resend : ${error.message}`);
  }
}
