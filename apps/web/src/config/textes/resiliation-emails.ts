/**
 * E-mails de la résiliation par l'écran /resiliation (s23, PROVISOIRES) : accusé « C'est noté »
 * (C1 + C2), accusé de demande en cas d'erreur Stripe, e-mail à l'équipe « on résilie pour toi ».
 * Source : `docs/copy/page-resiliation-s23-textes.md` §3. Texte seul, aucun pixel ni lien réécrit.
 * La résiliation par le portail Stripe garde `emailConfirmationResiliation` (`paiement.ts`, étalon 5c).
 */
import { formatEuros, PREMIUM_ANNUAL_PRICE_CENTS, PREMIUM_MONTHLY_PRICE_CENTS } from "@/config/premium";
import { CONTACT_EMAIL, SIGNATURE, dateHeure, dateLongue, siteUrl } from "@/config/textes/paiement";
import { TEXTES_RESILIATION as T } from "@/config/textes/resiliation";
import { RESILIATION_DELAI_EQUIPE } from "@/config/resiliation";
import { salutation } from "@/lib/emails/annual-renewal-reminder";

export type FormuleResiliation = "monthly" | "annual";

/** « Premium mensuel » / « Premium annuel » / « Premium » (formule inconnue). */
export function nomFormule(formule: FormuleResiliation | null): string {
  if (formule === "annual") return T.formuleAnnuelle;
  if (formule === "monthly") return T.formuleMensuelle;
  return T.formuleInconnue;
}

/**
 * Prix TTC avec périodicité : montant réel de l'abonnement (base ou Stripe) s'il est connu, sinon
 * le prix de la formule (`config/premium.ts`). Formule inconnue : null (ligne omise).
 */
export function prixFormule(formule: FormuleResiliation | null, cents: number | null): string | null {
  if (!formule) return null;
  const montant =
    typeof cents === "number" && Number.isInteger(cents) && cents > 0
      ? cents
      : formule === "annual"
        ? PREMIUM_ANNUAL_PRICE_CENTS
        : PREMIUM_MONTHLY_PRICE_CENTS;
  return `${formatEuros(montant)} TTC par ${formule === "annual" ? "an" : "mois"}`;
}

/** « Premium mensuel, 1,99 € TTC par mois » (prix omis s'il est inconnu). */
export function ligneFormule(formule: FormuleResiliation | null, cents: number | null): string {
  const prix = prixFormule(formule, cents);
  return prix ? `${nomFormule(formule)}, ${prix}` : nomFormule(formule);
}

export interface AccuseResiliationVars {
  prenom: string | null;
  formule: FormuleResiliation | null;
  priceCents: number | null;
  dateFin: Date | null;
  demandeLe: Date;
  /** Au moins une raison ou un mot donné : « Merci d'avoir répondu à la question. » */
  aRepondu: boolean;
  /** Statut PAST_DUE lu avant l'appel Stripe (@legal O7) : facture en cours encore prélevable. */
  impaye?: boolean;
}

function jusquau(fin: Date | null): string {
  return fin ? `jusqu’au ${dateLongue(fin)}` : "jusqu’à la fin de la période payée";
}

/** Accusé immédiat « C'est noté » (C1 + C2) : demande, formule, fin du contrat, effets, réactivation. */
export function emailAccuseResiliation(v: AccuseResiliationVars): { subject: string; text: string } {
  const fin = v.dateFin && !Number.isNaN(v.dateFin.getTime()) ? v.dateFin : null;
  const finTexte = fin ? dateLongue(fin) : "à la fin de la période payée";
  const annuel = v.formule === "annual" ? prixFormule("annual", v.priceCents) : null;
  const lignes = [
    salutation(v.prenom),
    "",
    `Ta résiliation est bien prise en compte (demande du ${dateHeure(v.demandeLe)}).`,
    "",
    `Formule : ${ligneFormule(v.formule, v.priceCents)}`,
    `Fin du contrat : ${finTexte}`,
    "",
    "Ce qui se passe maintenant :",
    ...(v.impaye
      ? [
          `- Tu gardes l’accès Premium ${jusquau(fin)}, sauf si la facture en cours reste impayée.`,
          `- Ton dernier paiement n’a pas abouti : cette facture peut encore être prélevée. Aucun autre prélèvement ensuite.`,
        ]
      : [`- Tu gardes l’accès Premium ${jusquau(fin)}.`, `- Aucun nouveau prélèvement après cette date.`]),
    ...(annuel && !v.impaye ? [`- Le renouvellement de ${annuel} n’aura pas lieu.`] : []),
    "- Ensuite, ton compte continue avec l’accès gratuit : tes favoris et ta progression restent enregistrés, les premières étapes des parcours restent en lecture libre.",
    "",
    `Tu as changé d’avis ? Tu peux réactiver ton abonnement ${jusquau(fin)} : ${siteUrl()}/profil#abonnement`,
    ...(v.aRepondu ? ["", "Merci d’avoir répondu à la question."] : []),
    "",
    `Une question sur ta résiliation : ${CONTACT_EMAIL}.`,
    "",
    SIGNATURE,
    "",
  ];
  return {
    subject: fin ? `C’est noté : ton Premium s’arrête le ${dateLongue(fin)}` : "Ta résiliation est confirmée",
    text: lignes.join("\n"),
  };
}

/** Accusé de DEMANDE (erreur Stripe, Premium sans client Stripe) : l'équipe résilie à la main. */
export function emailDemandeResiliationRecue(v: {
  prenom: string | null;
  dateFin: Date | null;
  demandeLe: Date;
  /** Accès offert, sans client Stripe (@reviewer R1) : ni « période payée ». */
  offert?: boolean;
}): {
  subject: string;
  text: string;
} {
  const fin = v.dateFin && !Number.isNaN(v.dateFin.getTime()) ? v.dateFin : null;
  return {
    subject: "Ta demande de résiliation est bien reçue",
    text: [
      salutation(v.prenom),
      "",
      // @reviewer R4 : la date de la demande est dite une seule fois, dans la phrase de @legal ci-dessous.
      "Ta demande de résiliation est bien reçue.",
      "",
      // @legal O5 : délai provisoire (`RESILIATION_DELAI_EQUIPE`) et date d'effet = date de la demande.
      `On s’occupe de ta résiliation et on te confirme par e-mail ${RESILIATION_DELAI_EQUIPE}. Ta demande date du ${dateHeure(v.demandeLe)} : c’est cette date qui compte, même si on la finalise plus tard. Tu gardes Premium ${fin ? `jusqu’au ${dateLongue(fin)}` : v.offert ? "jusqu’à la fin de ton accès Premium" : "jusqu’à la fin de la période payée"}.`,
      "",
      `Une question sur ta résiliation : ${CONTACT_EMAIL}.`,
      "",
      SIGNATURE,
      "",
    ].join("\n"),
  };
}

/**
 * E-mail à l'équipe : résiliation à faire à la main. Identifiant de compte seulement (jamais
 * l'adresse, ni le motif), date et heure de la demande, code d'erreur.
 */
export function emailEquipeResiliation(v: {
  userId: string;
  demandeLe: Date;
  cause: "stripe" | "sans-client-stripe" | "serveur";
  code: string;
  stripeSubscriptionId: string | null;
  /** Cause `serveur` : accusé de demande envoyé ensuite à l'adresse de la session (@legal O4). */
  accuseAbonne?: boolean;
}): { subject: string; html: string } {
  const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const pourquoi =
    v.cause === "stripe"
      ? "La résiliation Stripe a échoué depuis l’écran /resiliation."
      : v.cause === "serveur"
        ? "Base indisponible au moment de la demande depuis l’écran /resiliation : Stripe n’a pas été appelé."
        : "Compte Premium sans client Stripe.";
  const suite =
    v.cause === "serveur" && !v.accuseAbonne
      ? "L’abonné n’a reçu aucun e-mail ; l’écran lui a affiché « on résilie pour toi et on te le confirme par e-mail »."
      : "L’abonné a reçu « Ta demande de résiliation est bien reçue » : on résilie pour lui et on le lui confirme par e-mail.";
  return {
    subject: "Résiliation à faire à la main (écran /resiliation)",
    html: [
      `<p>${esc(pourquoi)} ${esc(suite)}</p>`,
      `<p>Compte : ${esc(v.userId)}<br>Abonnement Stripe : ${esc(v.stripeSubscriptionId ?? "aucun")}<br>Demande : ${esc(dateHeure(v.demandeLe))} (heure de Paris)<br>Code : ${esc(v.code)}</p>`,
      `<p>À faire : dans Stripe, « Annuler l’abonnement » à la fin de la période (jamais immédiatement). Le webhook enverra l’e-mail « C’est noté ». Sans client Stripe : retirer Premium à la date de fin et écrire à l’abonné.</p>`,
    ].join(""),
  };
}
