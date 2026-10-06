import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = process.env.EMAIL_FROM ?? "Deviens Marrant <noreply@deviens-marrant.fr>";

/** Destinataire des emails internes (alertes, rapports). */
export const ADMIN_EMAIL = "alex@deviens-marrant.fr";

/*
 * s15 (06/10/2026) : `sendAdminAlert` (un e-mail par alerte) est supprimé. Les
 * alertes passent par `lib/admin-alerts.ts` (enregistrées) et le seul e-mail
 * d'alerte est le digest quotidien (`lib/admin-digest.ts`, via sendAdminHtmlEmail).
 */

export async function sendPasswordResetEmail(
  to: string,
  resetUrl: string
): Promise<void> {
  await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: "Réinitialise ton mot de passe — Deviens Marrant",
    html: `
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px; color: #1a1a1a;">
  <h2 style="color: #7c3aed; margin-bottom: 8px;">Deviens Marrant 🎤</h2>
  <p>Salut,</p>
  <p>Tu as demandé à changer ton mot de passe. Un clic sur le bouton ci-dessous et tu en choisis un nouveau :</p>
  <a href="${resetUrl}" style="display: inline-block; background: #7c3aed; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 16px 0;">Réinitialiser mon mot de passe</a>
  <p style="font-size: 14px; color: #666;">Ce lien expire dans <strong>1 heure</strong>.</p>
  <p style="font-size: 14px; color: #666;">Si tu n'as pas fait cette demande, ignore cet email : ton mot de passe actuel reste valable.</p>
  <p style="font-size: 14px; color: #666;">P.S. : oublier un mot de passe, ça arrive à tout le monde. Oublier la chute d'une blague aussi, mais ça, on s'en occupe.</p>
  <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;">
  <p style="font-size: 12px; color: #999;">deviens-marrant.fr — Deviens dr&ocirc;le, un exercice &agrave; la fois.</p>
</body>
</html>`,
  });
}

/**
 * Email transactionnel en texte simple (rappel légal de reconduction de
 * l'annuel, s14). Lève une erreur si l'envoi échoue ou si Resend n'est pas
 * configuré : l'appelant marque alors l'envoi en échec pour le retenter.
 */
export async function sendTransactionalTextEmail(
  to: string,
  subject: string,
  text: string,
): Promise<void> {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY non configurée : email transactionnel non envoyé");
  }
  const { error } = await resend.emails.send({ from: FROM_EMAIL, to, subject, text });
  if (error) {
    throw new Error(`Resend : ${error.message}`);
  }
}

/**
 * Email interne HTML à l'admin (rapport hebdomadaire des visites). Lève une
 * erreur si Resend n'est pas configuré ou refuse l'envoi : l'appelant libère
 * alors son verrou pour retenter au tick suivant.
 */
export async function sendAdminHtmlEmail(subject: string, html: string): Promise<void> {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY non configurée : email interne non envoyé");
  }
  const { error } = await resend.emails.send({ from: FROM_EMAIL, to: ADMIN_EMAIL, subject, html });
  if (error) {
    throw new Error(`Resend : ${error.message}`);
  }
}
