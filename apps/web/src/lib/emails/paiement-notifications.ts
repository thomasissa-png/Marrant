/**
 * E-mails transactionnels du tunnel d'achat (s16, 07/10/2026) : confirmation
 * d'abonnement (L.221-13, sert aussi de bienvenue), paiement refusé,
 * confirmation de résiliation (D.215-3). Textes provisoires dans
 * `config/textes/paiement.ts`.
 *
 * Ces fonctions NE LÈVENT JAMAIS : elles partent après un traitement de
 * paiement déjà réussi, un e-mail raté ne doit pas faire rejouer le webhook.
 * L'échec d'envoi est enregistré en alerte A `email-envoi-<type>` par lib/email.
 *
 * Lot E (s16) : textes validés (étalons 2, 3, 5c). Avant chaque envoi, le rendu
 * final passe par le garde-fou des champs variables : s'il trouve « undefined »,
 * une date en anglais, etc., l'e-mail part quand même (confirmation légale) et
 * une alerte A `email-rendu-<type>` est enregistrée (digest du matin).
 */
import { prisma } from "@/lib/prisma";
import { recordAdminAlert } from "@/lib/admin-alerts";
import { problemesDeRendu } from "@/lib/emails/garde-fou-rendu";
import { trySendTransactionalTextEmail } from "@/lib/email";
import { firstNameFrom } from "@/lib/emails/annual-renewal-reminder";
import {
  emailConfirmationAbonnement,
  emailConfirmationResiliation,
  emailPaiementRefuse,
} from "@/config/textes/paiement";

async function destinataire(userId: string): Promise<{ email: string; prenom: string | null } | null> {
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { email: true, name: true } });
  if (!user?.email) return null;
  return { email: user.email, prenom: firstNameFrom(user.name) };
}

async function envoyer(
  userId: string,
  kind: "confirmation-abonnement" | "paiement-refuse" | "resiliation",
  rendu: (prenom: string | null) => { subject: string; text: string },
): Promise<boolean> {
  try {
    const d = await destinataire(userId);
    if (!d) {
      console.warn(`[email:${kind}] Aucun e-mail pour l'utilisateur ${userId}`);
      return false;
    }
    const { subject, text } = rendu(d.prenom);
    const problemes = problemesDeRendu(`${subject}\n${text}`);
    if (problemes.length > 0) {
      await recordAdminAlert({
        cle: `email-rendu-${kind}`,
        sujet: `E-mail « ${kind} » : champ variable mal rempli`,
        html: `<p>Problèmes : ${problemes.join(", ")}</p><p>Utilisateur ${userId}. L'e-mail est parti quand même : vérifier les données Stripe et le nom du compte.</p>`,
      });
    }
    return await trySendTransactionalTextEmail(d.email, subject, text, kind);
  } catch (err) {
    console.error(`[email:${kind}] Préparation impossible :`, err instanceof Error ? err.message : err);
    return false;
  }
}

export function notifySubscriptionConfirmed(
  userId: string,
  v: { interval: string | null; montantCents: number | null; dateSouscription: Date; prochainRenouvellement: Date | null },
): Promise<boolean> {
  return envoyer(userId, "confirmation-abonnement", (prenom) => emailConfirmationAbonnement({ prenom, ...v }));
}

export function notifyPaymentFailed(
  userId: string,
  v: { montantCents: number | null; datePrevue: Date | null },
): Promise<boolean> {
  return envoyer(userId, "paiement-refuse", (prenom) => emailPaiementRefuse({ prenom, ...v }));
}

export function notifyCancellationScheduled(userId: string, finAcces: Date | null): Promise<boolean> {
  return envoyer(userId, "resiliation", (prenom) => emailConfirmationResiliation({ prenom, finAcces }));
}
