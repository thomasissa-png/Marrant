/**
 * Textes client du lot A (paiement, e-mails transactionnels, rétractation),
 * audit parcours s16 (07/10/2026).
 *
 * Lot E (07/10/2026) : les textes couverts par les étalons validés par Thomas
 * (`docs/copy/etalons-parcours-s16.md`, décision dans founder-preferences)
 * sont repris mot pour mot et marqués `VALIDÉ s16`. Les autres restent
 * `PROVISOIRE s16`. Tutoiement, zéro tiret cadratin, signature « L'Équipe
 * Deviens Marrant », aucune mention d'IA. Prix et dates viennent toujours des
 * données (config/premium.ts, Stripe), jamais en dur.
 * Exception : le modèle de formulaire de rétractation (annexe à l'article
 * R.221-1 du Code de la consommation) est un texte légal repris mot pour mot.
 */
import {
  formatEuros,
  PREMIUM_ANNUAL_PRICE_CENTS,
  PREMIUM_ANNUAL_SAVINGS_CENTS,
  PREMIUM_MONTHLY_PRICE_CENTS,
  type PremiumPlan,
} from "@/config/premium";
import { TEXTES_ABONNEMENT } from "@/config/textes/compte";
import { ANNUEL_MOIS_OFFERTS_LABEL, prixTtcLabel } from "@/config/textes/offre";
import { salutation } from "@/lib/emails/annual-renewal-reminder";

export const CONTACT_EMAIL = "contact@deviens-marrant.fr";
export const SIGNATURE = "L'Équipe Deviens Marrant";

/** URL publique du site (liens des e-mails). */
export function siteUrl(): string {
  return (process.env.NEXTAUTH_URL || "https://deviens-marrant.fr").replace(/\/+$/, "");
}

/** « deviens-marrant.fr » : l'adresse du site telle qu'on l'écrit en clair. */
export function siteDomaine(): string {
  return siteUrl().replace(/^https?:\/\//, "");
}

function partiesParis(date: Date): { annee: number; mois: number; jour: number } {
  const parts = new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: "Europe/Paris",
  }).formatToParts(date);
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value);
  return { annee: get("year"), mois: get("month"), jour: get("day") };
}

/**
 * Jour de Paris + n jours, au calendrier (insensible au changement d'heure :
 * souscrit le 20/10 à 00:30 → 3 novembre). Renvoie midi UTC de ce jour.
 */
export function ajouterJoursParis(date: Date, jours: number): Date {
  const { annee, mois, jour } = partiesParis(date);
  return new Date(Date.UTC(annee, mois - 1, jour + jours, 12));
}

/** Même jour le mois (ou l'an) suivant, borné au dernier jour du mois (31/01 → 28/02). */
export function ajouterPeriodeParis(date: Date, periode: "month" | "year"): Date {
  const { annee, mois, jour } = partiesParis(date);
  const cible = mois - 1 + (periode === "year" ? 12 : 1);
  const dernierJour = new Date(Date.UTC(annee, cible + 1, 0)).getUTCDate();
  return new Date(Date.UTC(annee, cible, Math.min(jour, dernierJour), 12));
}

/** Date exploitable (objet Date valide), sinon null. */
function dateValide(date: Date | null | undefined): Date | null {
  return date instanceof Date && !Number.isNaN(date.getTime()) ? date : null;
}

/** Montant exploitable en centimes (entier positif), sinon null. */
function centimesValides(cents: number | null | undefined): number | null {
  return typeof cents === "number" && Number.isInteger(cents) && cents > 0 ? cents : null;
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

/**
 * Texte sous le bouton de la page Stripe (`custom_text.submit.message`, 1 200
 * caractères max). VALIDÉ s16 (étalon 1, texte Stripe) : seule la formule
 * choisie est affichée. Stripe accepte les liens Markdown : le texte visible
 * reste l'adresse en clair de l'étalon, et elle est cliquable.
 */
export function texteStripeSubmit(plan: PremiumPlan): string {
  const prix = plan === "annual" ? `${prixTtcLabel("annual")}, renouvelé chaque année` : prixTtcLabel("monthly");
  const lien = (chemin: string) => `[${siteDomaine()}${chemin}](${siteUrl()}${chemin})`;
  return `Premium : ${prix}. Tu as 14 jours pour te faire rembourser (formulaire : ${lien("/retractation")}). Tu résilies en ligne depuis ton profil, quand tu veux : ton accès reste ouvert jusqu'à la fin de la période payée. En payant, tu acceptes les CGU : ${lien("/cgu")}`;
}

// PROVISOIRE s16, étalon à valider
export const TEXTES_CHECKOUT = {
  dejaAbonne:
    "Tu as déjà un abonnement Premium. Pour changer de formule ou mettre ta carte à jour, passe par ton profil.",
  impaye:
    "Ton dernier paiement n'est pas passé. Mets ta carte à jour depuis ton profil pour garder ton accès : pas besoin de te réabonner.",
  /** Lien affiché sous dejaAbonne / impaye (/abonnement, modale Premium, accueil). Lot D. */
  lienProfil: "Aller à mon profil",
} as const;

// PROVISOIRE s16, étalon à valider
export const TEXTES_PORTAIL = {
  aucunAbonnement: "On ne trouve pas d'abonnement sur ton compte. Écris-nous à " + CONTACT_EMAIL + " si tu penses que c'est une erreur.",
  indisponible: "La gestion de l'abonnement ne répond pas pour le moment. Réessaie dans un instant.",
  connexion: "Connecte-toi pour gérer ton abonnement.",
} as const;

// PROVISOIRE s16, étalon à valider (sauf la partie « connexion », VALIDÉ s16, étalon 5a.2)
export const TEXTES_SUCCESS = {
  verificationTitre: "On vérifie ton paiement",
  verificationTexte: "Quelques secondes, le temps de confirmer avec notre service de paiement.",
  // VALIDÉ s16 (étalon 5a.2) : client non connecté.
  connexionTitre: "Connecte-toi pour retrouver ton abonnement",
  connexionTexte:
    "Tu n'es pas connecté sur cet appareil, alors on ne peut pas confirmer ton paiement d'ici. Si tu viens de t'abonner, connecte-toi : ton accès apparaîtra dans ton profil.",
  connexionBouton: "Me connecter",
  connexionLienAvant: "Pas encore abonné ? ",
  connexionLien: "Voir Premium",
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
// E-mails transactionnels (texte simple, support durable).
// Chaque champ variable a un repli propre (prénom absent → « Salut, »,
// montant ou date manquants → tirés de config/premium ou phrase sans le
// champ) : jamais « undefined », « null » ni date en anglais. Rendus vérifiés
// par lib/emails/garde-fou-rendu.ts (tests + alerte à l'envoi).
// ==========================================================================

export interface EmailRendu {
  subject: string;
  text: string;
}

/** Formule de l'abonnement. Intervalle inconnu : déduit du montant, sinon mensuel (formule par défaut du checkout). */
export function formuleDe(interval: string | null | undefined, montantCents: number | null | undefined): PremiumPlan {
  if (interval === "year") return "annual";
  if (interval === "month") return "monthly";
  return centimesValides(montantCents) === PREMIUM_ANNUAL_PRICE_CENTS ? "annual" : "monthly";
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

/**
 * Confirmation de commande (L.221-13), qui sert aussi d'e-mail de bienvenue.
 * VALIDÉ s16 : étalon 2, corps A + objet 2.2, mot pour mot. Adaptations :
 * « rubrique « Gérer mon abonnement » » → bouton réel « Résilier ton contrat »
 * (libellé unique s16) ; le modèle légal de formulaire de rétractation
 * (L.221-5) est joint après la signature.
 */
export function emailConfirmationAbonnement(v: ConfirmationAbonnementVars): EmailRendu {
  const url = siteUrl();
  const plan = formuleDe(v.interval, v.montantCents);
  const annuel = plan === "annual";
  const prixDefaut = annuel ? PREMIUM_ANNUAL_PRICE_CENTS : PREMIUM_MONTHLY_PRICE_CENTS;
  const montant = formatEuros(centimesValides(v.montantCents) ?? prixDefaut);
  const prix = `${montant} TTC par ${annuel ? "an" : "mois"}`;
  const souscription = dateValide(v.dateSouscription) ?? new Date();
  const prochain = dateValide(v.prochainRenouvellement) ?? ajouterPeriodeParis(souscription, annuel ? "year" : "month");
  const finRetractation = ajouterJoursParis(souscription, 14);
  const ligneAnnuelle = annuel
    ? `\nAvec l'annuel, tu as ${ANNUEL_MOIS_OFFERTS_LABEL} : ${formatEuros(PREMIUM_ANNUAL_SAVINGS_CENTS)} économisés par rapport au mensuel.\n`
    : "";
  return {
    subject: "Bienvenue dans Premium, ton abonnement est confirmé",
    text: `${salutation(v.prenom)}

Ton abonnement Premium est activé. Bienvenue, et merci pour ta confiance.

Voici ta confirmation :
- Formule : Premium ${annuel ? "annuel" : "mensuel"}
- Prix : ${prix}
- Souscrit le : ${dateLongue(souscription)}
- Prochain prélèvement : ${dateLongue(prochain)}, ${montant} TTC. L'abonnement se reconduit automatiquement à cette date, jusqu'à ce que tu le résilies.
${ligneAnnuelle}
Résilier : en ligne, à tout moment, depuis ton profil, bouton « ${TEXTES_ABONNEMENT.resilier} » : ${url}/profil. Ton accès reste ouvert jusqu'à la fin de la période payée.

Droit de rétractation : tu as 14 jours à partir d'aujourd'hui, soit jusqu'au ${dateLongue(finRetractation)}, pour te rétracter et être remboursé, sans donner de motif. Il suffit de remplir ce formulaire : ${url}/retractation.

Les CGU qui s'appliquent à ton abonnement : ${url}/cgu.

Pour bien démarrer : ouvre un parcours et lance l'étape 2 (la première se lit déjà sans compte) : ${url}/parcours.

À très vite,
${SIGNATURE}

============================================
${formulaireTypeRetractation()}
`,
  };
}

export interface PaiementRefuseVars {
  prenom: string | null;
  /** Montant de l'échéance refusée, en centimes (facture Stripe `amount_due`). */
  montantCents: number | null;
  /** Date prévue du prélèvement (création de la facture Stripe). */
  datePrevue: Date | null;
}

/**
 * Premier prélèvement refusé (Premium conservé pendant les relances).
 * VALIDÉ s16 : étalon 3, corps A + objet 3.2, mot pour mot. Le bouton
 * « Mettre à jour ma carte » est le lien du profil (bouton du même nom).
 * Montant ou date absents : la parenthèse ne garde que ce qui est connu.
 */
export function emailPaiementRefuse(v: PaiementRefuseVars): EmailRendu {
  const url = siteUrl();
  const cents = centimesValides(v.montantCents);
  const date = dateValide(v.datePrevue);
  const details = [cents !== null ? `${formatEuros(cents)} TTC` : null, date ? `prévu le ${dateLongue(date)}` : null]
    .filter(Boolean)
    .join(", ");
  return {
    subject: "Ton paiement n'est pas passé, ton Premium reste actif",
    text: `${salutation(v.prenom)}

Le prélèvement de ton abonnement Premium${details ? ` (${details})` : ""} n'est pas passé. Ça arrive : carte expirée, plafond atteint, vérification de la banque.

Rien n'est coupé pour l'instant : ton accès Premium reste ouvert pendant que le prélèvement est retenté automatiquement dans les prochains jours.

Si ta carte a changé ou si ta banque a bloqué le paiement, tu peux la mettre à jour ici : ${url}/profil.

Si le paiement reste impossible à la fin des tentatives, l'abonnement s'arrête et l'accès Premium se ferme. Tu pourras te réabonner quand tu veux.

${SIGNATURE}
`,
  };
}

export interface ResiliationVars {
  prenom: string | null;
  /** Fin de l'accès Premium (fin de la période payée). */
  finAcces: Date | null;
}

/**
 * Confirmation de résiliation (L.215-1-1 : date de fin et effets).
 * VALIDÉ s16 : étalon 5c, objet 5c.3 + corps, mot pour mot. Date de fin
 * inconnue : objet 5c.1 (variante de l'étalon) et « la fin de la période payée ».
 */
export function emailConfirmationResiliation(v: ResiliationVars): EmailRendu {
  const url = siteUrl();
  const fin = dateValide(v.finAcces);
  const jusquau = fin ? `jusqu'au ${dateLongue(fin)}` : "jusqu'à la fin de la période payée";
  return {
    subject: fin ? `C'est noté : ton Premium s'arrête le ${dateLongue(fin)}` : "Ta résiliation est confirmée",
    text: `${salutation(v.prenom)}

Ta résiliation est bien prise en compte. Tu gardes l'accès Premium ${jusquau}, puis l'abonnement s'arrête : aucun nouveau prélèvement.

Tu peux te réabonner quand tu veux : ${url}/abonnement. Les premières étapes des parcours restent en lecture libre.

Merci d'avoir bossé ton humour avec nous.

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
  /** Prénom du compte trouvé pour cet e-mail (lot E) ; absent → « Salut, ». */
  prenom?: string | null;
}

/** Accusé de réception de la demande de rétractation, au client (support durable). PROVISOIRE s16 (hors étalons). */
export function emailAccuseRetractation(v: RetractationVars): EmailRendu {
  const dateAchat = dateValide(v.dateAchat);
  const achat = dateAchat ? `\nDate d'achat indiquée : le ${dateLongue(dateAchat)}` : "";
  return {
    subject: "On a bien reçu ta demande de rétractation",
    text: `${salutation(v.prenom)}

On a bien reçu ta demande de rétractation, le ${dateHeure(dateValide(v.recueLe) ?? new Date())}.

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
