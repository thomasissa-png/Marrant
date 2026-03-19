import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = process.env.EMAIL_FROM ?? "Deviens Marrant <noreply@deviens-marrant.fr>";

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
  <p>Tu as demandé à réinitialiser ton mot de passe. Clique sur le bouton ci-dessous :</p>
  <a href="${resetUrl}" style="display: inline-block; background: #7c3aed; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 16px 0;">Réinitialiser mon mot de passe</a>
  <p style="font-size: 14px; color: #666;">Ce lien expire dans <strong>1 heure</strong>.</p>
  <p style="font-size: 14px; color: #666;">Si tu n'as pas fait cette demande, ignore cet email.</p>
  <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;">
  <p style="font-size: 12px; color: #999;">deviens-marrant.fr — L'humour, ça s'apprend.</p>
</body>
</html>`,
  });
}
