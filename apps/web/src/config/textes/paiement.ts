/**
 * Textes client du lot A (paiement, e-mails transactionnels, rétractation),
 * audit parcours s16 (07/10/2026).
 *
 * PROVISOIRE s16, étalon à valider : la règle P0 du projet impose de calibrer
 * tout nouveau texte avec Thomas (étalons @copywriter). Tutoiement, zéro tiret
 * cadratin, signature « L'Équipe Deviens Marrant », aucune mention d'IA.
 * Exception : le modèle de formulaire de rétractation (annexe à l'article
 * R.221-1 du Code de la consommation) est un texte légal repris mot pour mot.
 */
import { formatEuros } from "@/config/premium";

export const CONTACT_EMAIL = "contact@deviens-marrant.fr";
export const SIGNATURE = "L'Équipe Deviens Marrant";

/** URL publique du site (liens des e-mails). */
export function siteUrl(): string {
  return (process.env.NEXTAUTH_URL || "https://deviens-marrant.fr").replace(/\/+$/, "");
}

/** « 7 octobre 2026 », « 1er novembre 2026 » (heure de Paris). */
export function dateLongue(date: Date): string {
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

/** « 7 octobre 2026 à 14:05 » (heure de Paris). */
export function dateHeure(date: Date): string {
  const heure = new Intl.DateTimeFormat("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Paris",
  }).format(date);
  return `${dateLongue(date)} à ${heure}`;
}

// PROVISOIRE s16, étalon à valider
export const TEXTES_CHECKOUT = {
  /** Sous le bouton de paiement de la page Stripe (custom_text.submit, 1200 caractères max). */
  stripeSubmit:
    "Prix TTC. Ton abonnement se renouvelle automatiquement et tu peux le résilier en ligne depuis ton profil, à tout moment. Tu changes d'avis ? On te rembourse sous 14 jours, sans justification.",
  dejaAbonne:
    "Tu as déjà un abonnement Premium. Pour changer de formule ou mettre ta carte à jour, passe par ton profil.",
  impaye:
    "Ton dernier paiement n'est pas passé. Mets ta carte à jour depuis ton profil pour garder ton accès : pas besoin de te réabonner.",
} as const;

// PROVISOIRE s16, étalon à valider
export const TEXTES_PORTAIL = {
  aucunAbonnement: "On ne trouve pas d'abonnement sur ton compte. Écris-nous à " + CONTACT_EMAIL + " si tu penses que c'est une erreur.",
  indisponible: "La gestion de l'abonnement ne répond pas pour le moment. Réessaie dans un instant.",
  connexion: "Connecte-toi pour gérer ton abonnement.",
} as const;

// PROVISOIRE s16, étalon à valider
export const TEXTES_SUCCESS = {
  verificationTitre: "On vérifie ton paiement",
  verificationTexte: "Quelques secondes, le temps de confirmer avec notre service de paiement.",
  connexionTitre: "Connecte-toi pour activer ton accès",
  connexionTexte:
    "Ta session a expiré. Connecte-toi avec le compte utilisé pour payer : on vérifie ton paiement et ton accès Premium s'active.",
  connexionBouton: "Se connecter",
  nonVerifieTitre: "On n'arrive pas à confirmer ton paiement",
  nonVerifieTexte:
    "On n'a pas encore de confirmation de ton paiement. Si tu as bien été débité, pas d'inquiétude : écris-nous à " +
    CONTACT_EMAIL +
    " et on active ton accès à la main.",
  reessayer: "Réessayer",
} as const;

// PROVISOIRE s16, étalon à valider
export const TEXTES_RETRACTATION_FORM = {
  placeholderEmail: "ton@email.fr",
  placeholderMotif: "Dis-nous pourquoi tu te rétractes (facultatif)",
  envoi: "Envoi en cours…",
  bouton: "Envoyer ma demande",
  succesTitre: "Ta demande de rétractation est bien enregistrée.",
  succesTexte:
    "On t'a envoyé un e-mail de confirmation. Tu ne le vois pas sous 1 heure ? Regarde dans tes spams, ou écris-nous à",
  succesSansEmail:
    "On n'a pas réussi à t'envoyer l'e-mail de confirmation, mais ta demande est bien enregistrée. Pour en garder une trace, écris-nous aussi à",
  erreurValidation: "Vérifie ton adresse e-mail et la date d'achat.",
  erreurTropDeDemandes: "Tu as déjà envoyé plusieurs demandes. On les traite : pas besoin de recommencer.",
  erreurServeur: "L'envoi n'a pas marché. Réessaie, ou écris-nous directement à",
} as const;

export { formatEuros };

// ==========================================================================
// E-mails transactionnels (texte simple, support durable). PROVISOIRE s16.
// ==========================================================================

export interface EmailRendu {
  subject: string;
  text: string;
}

function salut(prenom: string | null): string {
  return prenom ? `Salut ${prenom},` : "Salut,";
}

/** « Premium mensuel, 2,99 € TTC par mois » ; intervalle inconnu → libellé sans périodicité. */
export function libelleFormule(interval: string | null, montantCents: number | null): string {
  const nom = interval === "year" ? "Premium annuel" : interval === "month" ? "Premium mensuel" : "Premium";
  if (montantCents === null) return nom;
  const periode = interval === "year" ? " par an" : interval === "month" ? " par mois" : "";
  return `${nom}, ${formatEuros(montantCents)} TTC${periode}`;
}

/**
 * Modèle de formulaire de rétractation (annexe à l'article R.221-1 du Code de
 * la consommation), repris mot pour mot (vouvoiement imposé par le texte).
 * [D3] L'adresse géographique du vendeur sera ajoutée quand Thomas l'aura fournie.
 */
export function formulaireTypeRetractation(): string {
  return `MODÈLE DE FORMULAIRE DE RÉTRACTATION
(Veuillez compléter et renvoyer le présent formulaire uniquement si vous souhaitez vous rétracter du contrat.)
À l'attention de Deviens Marrant, ${CONTACT_EMAIL} :
Je/Nous (*) vous notifie/notifions (*) par la présente ma/notre (*) rétractation du contrat portant sur la vente du bien (*)/pour la prestation de services (*) ci-dessous :
Commandé le (*)/reçu le (*) :
Nom du (des) consommateur(s) :
Adresse du (des) consommateur(s) :
Signature du (des) consommateur(s) (uniquement en cas de communication du présent formulaire sur papier) :
Date :
(*) Rayez la mention inutile.`;
}

export interface ConfirmationAbonnementVars {
  prenom: string | null;
  interval: string | null;
  montantCents: number | null;
  dateSouscription: Date;
  prochainRenouvellement: Date | null;
}

/** Confirmation de commande (L.221-13), qui sert aussi d'e-mail de bienvenue. */
export function emailConfirmationAbonnement(v: ConfirmationAbonnementVars): EmailRendu {
  const url = siteUrl();
  const annuel = v.interval === "year";
  const reconduction = annuel ? "chaque année" : "chaque mois";
  const prochain = v.prochainRenouvellement
    ? `Prochain renouvellement : le ${dateLongue(v.prochainRenouvellement)}`
    : `Renouvellement : ${reconduction}, à la date anniversaire de ta souscription`;
  return {
    subject: "Bienvenue dans Premium : la confirmation de ton abonnement",
    text: `${salut(v.prenom)}

Bienvenue dans Premium ! Ton abonnement à Deviens Marrant est actif : tous les parcours, toutes les vannes et tes favoris sont ouverts.

Pour commencer : ${url}/parcours

============================================
TON ABONNEMENT
Formule : ${libelleFormule(v.interval, v.montantCents)}
Date de souscription : le ${dateLongue(v.dateSouscription)}
${prochain}
Reconduction : automatique ${reconduction}, jusqu'à ce que tu résilies
============================================

RÉSILIER
Tu peux résilier en ligne à tout moment depuis ton profil (${url}/profil), bouton « Résilier ton contrat ». Tu gardes ton accès jusqu'à la fin de la période déjà payée, sans nouveau prélèvement.

DROIT DE RÉTRACTATION
Tu as 14 jours à partir d'aujourd'hui pour changer d'avis, sans justification. On te rembourse alors sous 14 jours, sur le moyen de paiement utilisé.
Pour te rétracter, le plus simple : le formulaire en ligne ${url}/retractation
Tu peux aussi nous écrire à ${CONTACT_EMAIL}, ou utiliser le modèle ci-dessous.

${formulaireTypeRetractation()}

CONDITIONS GÉNÉRALES
Les conditions générales que tu as acceptées : ${url}/cgu

Garde cet e-mail : c'est la confirmation de ton contrat.

Une question ? ${CONTACT_EMAIL}

${SIGNATURE}
`,
  };
}

export interface PaiementRefuseVars {
  prenom: string | null;
  /** Page Stripe de la facture (payer avec une autre carte). */
  lienFacture: string | null;
}

export function emailPaiementRefuse(v: PaiementRefuseVars): EmailRendu {
  const url = siteUrl();
  const facture = v.lienFacture ? `\nTu peux aussi régler directement cette échéance avec une autre carte : ${v.lienFacture}\n` : "";
  return {
    subject: "Ton paiement Deviens Marrant n'est pas passé",
    text: `${salut(v.prenom)}

Le paiement de ton abonnement Premium n'est pas passé (carte expirée, plafond atteint, refus de la banque…). Ça arrive.

Ton accès Premium reste ouvert pendant qu'on réessaie le paiement dans les prochains jours. Pour qu'il passe, mets ta carte à jour depuis ton profil, bouton « Gérer mon abonnement » : ${url}/profil
${facture}
Surtout, ne reprends pas un nouvel abonnement : tu paierais deux fois.

Si rien ne change à la fin des nouvelles tentatives, ton abonnement s'arrête, sans autre prélèvement.

Une question ? ${CONTACT_EMAIL}

${SIGNATURE}
`,
  };
}

export interface ResiliationVars {
  prenom: string | null;
  /** Date de la demande de résiliation. */
  dateDemande: Date;
  /** Fin de l'accès Premium (fin de la période payée). */
  finAcces: Date | null;
}

/** Accusé de résiliation (D.215-3) : date de la demande et date d'effet. */
export function emailConfirmationResiliation(v: ResiliationVars): EmailRendu {
  const url = siteUrl();
  const fin = v.finAcces
    ? `Ton accès Premium reste ouvert jusqu'au ${dateLongue(v.finAcces)}. Ensuite, plus aucun prélèvement.`
    : "Ton accès Premium reste ouvert jusqu'à la fin de la période déjà payée. Ensuite, plus aucun prélèvement.";
  return {
    subject: "Ta résiliation Deviens Marrant est confirmée",
    text: `${salut(v.prenom)}

On confirme ta résiliation, demandée le ${dateHeure(v.dateDemande)}.

${fin}

Tu changes d'avis avant cette date ? Tu peux réactiver ton abonnement depuis ton profil : ${url}/profil

Garde cet e-mail : c'est la confirmation de ta résiliation.

Une question ? ${CONTACT_EMAIL}

${SIGNATURE}
`,
  };
}

export interface RetractationVars {
  email: string;
  dateAchat: Date | null;
  motif: string | null;
  recueLe: Date;
  reference: string;
}

/** Accusé de réception de la demande de rétractation, au client (support durable). */
export function emailAccuseRetractation(v: RetractationVars): EmailRendu {
  const achat = v.dateAchat ? `\nDate d'achat indiquée : le ${dateLongue(v.dateAchat)}` : "";
  return {
    subject: "On a bien reçu ta demande de rétractation",
    text: `Salut,

On a bien reçu ta demande de rétractation, le ${dateHeure(v.recueLe)}.

Référence : ${v.reference}
Adresse du compte : ${v.email}${achat}

On te rembourse sous 14 jours maximum, sur le moyen de paiement utilisé pour l'achat. Ton abonnement est alors arrêté : plus aucun prélèvement.

Garde cet e-mail : c'est la preuve de ta demande.

Une question ? ${CONTACT_EMAIL}

${SIGNATURE}
`,
  };
}

/** Notification interne (admin) : demande de rétractation à traiter sous 14 jours. */
export function emailAdminRetractation(v: RetractationVars & { compteTrouve: boolean }): EmailRendu {
  return {
    subject: `[Rétractation] Demande ${v.reference} à rembourser sous 14 jours`,
    text: `Nouvelle demande de rétractation.

Reçue le : ${dateHeure(v.recueLe)}
Référence : ${v.reference}
E-mail saisi : ${v.email} (${v.compteTrouve ? "compte trouvé" : "AUCUN compte avec cet e-mail"})
Date d'achat indiquée : ${v.dateAchat ? dateLongue(v.dateAchat) : "non renseignée"}
Motif : ${v.motif || "non renseigné"}

À faire dans Stripe : rembourser le paiement (remboursement total). Le site résilie alors l'abonnement automatiquement et repasse le compte sans Premium.
`,
  };
}
