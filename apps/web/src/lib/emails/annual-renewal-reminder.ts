/**
 * Email de rappel de reconduction de la formule annuelle (article L.215-1 du
 * Code de la consommation). Objet et corps repris À L'IDENTIQUE de
 * docs/legal/annuel-renouvellement-s14.md, section 2 (texte @legal, 04/10/2026).
 * Ne pas reformuler ici : toute modification passe d'abord par ce document.
 * Exception s16 (07/10/2026, audit parcours, défauts D13 et D6) : « ton compte
 * repasse en gratuit » (offre gratuite supprimée) et « Résilier votre contrat »
 * (tutoiement) corrigés ici ; le document @legal est à aligner.
 *
 * Email transactionnel dédié : texte simple, ni contenu promotionnel ni lien
 * de désabonnement marketing.
 */
import { formatEuros } from "@/config/premium";

export interface AnnualRenewalReminderVars {
  /** Prénom de l'abonné ; absent → « Salut, » (aucun prénom inventé). */
  prenom: string | null;
  /** Date de reconduction (current_period_end de l'abonnement Stripe). */
  renewalDate: Date;
  /** Montant réel du prix annuel de l'abonnement, en centimes (ex. 2499). */
  amountCents: number;
  /** URL de gestion de l'abonnement (profil, d'où part le portail Stripe). */
  manageUrl: string;
}

export interface RenderedEmail {
  subject: string;
  text: string;
}

/** « 12 novembre 2026 », « 1er décembre 2026 » : jour complet en français, fuseau Europe/Paris. */
export function formatRenewalDate(date: Date): string {
  const parts = new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Europe/Paris",
  }).formatToParts(date);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  const day = get("day") === "1" ? "1er" : get("day");
  return `${day} ${get("month")} ${get("year")}`;
}

/** Premier mot du nom affiché, nettoyé ; vide → null. */
export function firstNameFrom(name: string | null | undefined): string | null {
  const first = (name ?? "").trim().split(/\s+/)[0] ?? "";
  return first ? first : null;
}

export function renderAnnualRenewalReminder(vars: AnnualRenewalReminderVars): RenderedEmail {
  const dateRenouvellement = formatRenewalDate(vars.renewalDate);
  const montant = formatEuros(vars.amountCents);
  const salutation = vars.prenom ? `Salut ${vars.prenom},` : "Salut,";

  const subject = `Ton abonnement annuel Deviens Marrant se renouvelle le ${dateRenouvellement}`;

  const text = `${salutation}

Ton abonnement annuel Premium à Deviens Marrant va être renouvelé automatiquement. On te prévient pour que tu décides en connaissance de cause.

============================================
RENOUVELLEMENT AUTOMATIQUE
Date de renouvellement : ${dateRenouvellement}
Montant : ${montant} TTC pour 12 mois, prélevé sur ton moyen de paiement enregistré
Pour ne pas renouveler : résilie avant le ${dateRenouvellement}
============================================

Si tu ne fais rien, ton abonnement est reconduit pour un an et ${montant} est prélevé à cette date. Si tu résilies, tu gardes ton accès Premium jusqu'à la fin de la période déjà payée, puis ton abonnement s'arrête, sans nouveau prélèvement.

Pour gérer ou résilier ton abonnement : ${vars.manageUrl}
Tu peux aussi passer par ton profil, bouton « Résilier ton contrat ». Un email te confirme la résiliation et sa date d'effet.

Tu peux résilier à tout moment, même après un renouvellement : la résiliation prend alors effet à la fin de la période en cours.

Une question ? contact@deviens-marrant.fr

L'Équipe Deviens Marrant
`;

  return { subject, text };
}
