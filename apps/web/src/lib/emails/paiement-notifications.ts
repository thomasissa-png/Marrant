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
import { ONBOARDING_PREMIUM_OUVERT } from "@/config/onboarding-premium";
import { QUESTION_EQUIPE_OUVERTE } from "@/config/question-equipe";
import { LETTRE_HEBDO_INSCRIPTIONS_OUVERTES } from "@/config/lettre";
import { getCarnetExtrait } from "@/lib/carnet";
import { bonusTousPublies } from "@/lib/espace/bonus-publies";
import { recoitHebdo, SELECT_CANDIDAT_HEBDO } from "@/lib/lettre/hebdo";
import { noterAncreJ0 } from "@/lib/onboarding/journal-onboarding";
import {
  emailBienvenuePremium,
  emailConfirmationAbonnement,
  type BienvenuePremiumConditions,
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

type ConfirmationVars = { interval: string | null; montantCents: number | null; dateSouscription: Date; prochainRenouvellement: Date | null };

export function notifySubscriptionConfirmed(userId: string, v: ConfirmationVars): Promise<boolean> {
  // s23 : interrupteur fermé = bienvenue actuel, inchangé (aucune lecture ni écriture en plus).
  if (ONBOARDING_PREMIUM_OUVERT) return notifyBienvenuePremium(userId, v);
  return envoyer(userId, "confirmation-abonnement", (prenom) => emailConfirmationAbonnement({ prenom, ...v }));
}

/** Lignes `[si …]` du bienvenue s23. Base illisible : ligne de la lettre omise (jamais une promesse devinée). */
export async function conditionsBienvenue(userId: string): Promise<BienvenuePremiumConditions> {
  let lettre = false;
  try {
    const user = await prisma.user.findUnique({ where: { id: userId }, select: SELECT_CANDIDAT_HEBDO });
    lettre = LETTRE_HEBDO_INSCRIPTIONS_OUVERTES && user !== null && recoitHebdo(user);
  } catch (err) {
    console.warn("[email:confirmation-abonnement] État de la lettre illisible :", err instanceof Error ? err.message : err);
  }
  return { carnet: getCarnetExtrait() !== null, lettre, question: QUESTION_EQUIPE_OUVERTE, bonus: bonusTousPublies() };
}

/** Bienvenue s23 (E0), puis ancre J0 de l'onboarding (E1, E2) si l'e-mail est parti. */
async function notifyBienvenuePremium(userId: string, v: ConfirmationVars): Promise<boolean> {
  const conditions = await conditionsBienvenue(userId);
  const ok = await envoyer(userId, "confirmation-abonnement", (prenom) => emailBienvenuePremium({ prenom, ...v, ...conditions }));
  if (ok) await noterAncreJ0(prisma, userId, v.dateSouscription, new Date());
  return ok;
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
