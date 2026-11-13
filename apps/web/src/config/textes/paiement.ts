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
import { ESPACE_CLIENT_PUBLIE } from "@/config/espace-client";
import { PUCE_BONUS_E0 } from "@/config/textes/espace-textes-en-ligne";
import {
  formatEuros,
  PARCOURS_COUNT,
  PREMIUM_PARCOURS,
  PREMIUM_ANNUAL_PRICE_CENTS,
  PREMIUM_ANNUAL_SAVINGS_CENTS,
  PREMIUM_MONTHLY_PRICE_CENTS,
  type PremiumPlan,
} from "@/config/premium";
import { TEXTES_ABONNEMENT } from "@/config/textes/compte";
import { ANNUEL_MOIS_OFFERTS_LABEL, prixTtcLabel } from "@/config/textes/offre";
import { RETRACTATION_PERIMETRE } from "@/config/textes/juridique";
import { salutation } from "@/lib/emails/annual-renewal-reminder";

export const CONTACT_EMAIL = "contact@deviens-marrant.fr";
export const SIGNATURE = "L’Équipe Deviens Marrant";

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
 * Lot G (retouche @legal point 13 validée par Thomas, founder-preferences
 * 07/10/2026) : ouverture « obligation de paiement » (L.221-14), qui reprend
 * « Premium : {prix} » de l'étalon ; mensuel : « prélevé chaque mois jusqu'à
 * ta résiliation ». Bouton Stripe : `submit_type: "subscribe"` + locale fr
 * = « S'abonner » (lib/stripe.ts). Longueur vérifiée par les tests (≤ 1 200).
 */
export const LIBELLE_BOUTON_STRIPE = "S’abonner";

export function texteStripeSubmit(plan: PremiumPlan): string {
  const prix =
    plan === "annual"
      ? `${prixTtcLabel("annual")}, renouvelé chaque année`
      : `${prixTtcLabel("monthly")}, prélevé chaque mois jusqu’à ta résiliation`;
  const lien = (chemin: string) => `[${siteDomaine()}${chemin}](${siteUrl()}${chemin})`;
  return `En cliquant sur « ${LIBELLE_BOUTON_STRIPE} », tu passes une commande avec obligation de paiement : Premium, ${prix}. Tu as 14 jours pour te faire rembourser (formulaire : ${lien("/retractation")}). Tu résilies en ligne depuis ton profil, quand tu veux : ton accès reste ouvert jusqu’à la fin de la période payée. En payant, tu acceptes les CGU : ${lien("/cgu")}`;
}

// PROVISOIRE s16, étalon à valider
export const TEXTES_CHECKOUT = {
  dejaAbonne:
    "Tu as déjà un abonnement Premium. Pour changer de formule ou mettre ta carte à jour, passe par ton profil.",
  impaye:
    "Ton dernier paiement n’est pas passé. Mets ta carte à jour depuis ton profil pour garder ton accès : pas besoin de te réabonner.",
  /** Lien affiché sous dejaAbonne / impaye (/abonnement, modale Premium, accueil). Lot D. */
  lienProfil: "Aller à mon profil",
} as const;

// PROVISOIRE s16, étalon à valider
export const TEXTES_PORTAIL = {
  aucunAbonnement: "On ne trouve pas d’abonnement sur ton compte. Écris-nous à " + CONTACT_EMAIL + " si tu penses que c’est une erreur.",
  indisponible: "La gestion de l’abonnement ne répond pas pour le moment. Réessaie dans un instant.",
  connexion: "Connecte-toi pour gérer ton abonnement.",
} as const;

// PROVISOIRE s16, étalon à valider (sauf la partie « connexion », VALIDÉ s16, étalon 5a.2)
export const TEXTES_SUCCESS = {
  // Concision v5 (textes-v5-c §5) : paiement vérifié, juste avant le retour automatique.
  pretTitre: "Paiement reçu !",
  pretTexte: "Merci. Ton accès s’active…",
  /** Plein vers la destination d'origine (`returnTo`, sinon /parcours) : trajet de conversion s21 §4. */
  pretBouton: "Continuer",
  verificationTitre: "On vérifie ton paiement",
  verificationTexte: "Quelques secondes, le temps de confirmer avec notre service de paiement.",
  // VALIDÉ s16 (étalon 5a.2) : client non connecté.
  connexionTitre: "Connecte-toi pour retrouver ton abonnement",
  connexionTexte:
    "Tu n’es pas connecté sur cet appareil, alors on ne peut pas confirmer ton paiement d’ici. Si tu viens de t’abonner, connecte-toi : ton accès apparaîtra dans ton profil.",
  connexionBouton: "Me connecter",
  connexionLienAvant: "Pas encore abonné ? ",
  connexionLien: "Voir Premium",
  nonVerifieTitre: "On n’arrive pas à confirmer ton paiement",
  nonVerifieTexte:
    "On n’a pas encore de confirmation de ton paiement. Si tu as bien été débité, pas d’inquiétude : écris-nous à " +
    CONTACT_EMAIL +
    " et on active ton accès à la main.",
  reessayer: "Réessayer",
} as const;

/**
 * Formule légale de la fonction de rétractation (D.221-5, audit s23
 * `docs/legal/retractation-conformite-s23.md`, ligne 2) : pied de page, titre de
 * /retractation, carte abonnement du profil, page « Paiement reçu » et bouton de
 * l'étape 1 du formulaire.
 */
export const LIBELLE_RENONCER_CONTRAT = "Renoncer au contrat ici";

// PROVISOIRE s16, étalon à valider. s23 (audit rétractation, P0) : deux étapes
// (saisie puis récapitulatif à confirmer), nom et prénom, date d'achat facultative.
export const TEXTES_RETRACTATION_FORM = {
  placeholderEmail: "ton@email.fr",
  placeholderNom: "Marie Dupont",
  placeholderMotif: "Dis-nous pourquoi tu te rétractes (facultatif)",
  labelNom: "Prénom et nom *",
  labelEmail: "Adresse e-mail du compte *",
  labelDateAchat: "Date d’achat (facultatif)",
  labelMotif: "Motif (facultatif)",
  envoi: "Envoi en cours…",
  /** Étape 1 : rien n'est envoyé, on passe au récapitulatif. */
  bouton: LIBELLE_RENONCER_CONTRAT,
  recapTitre: "Vérifie ta demande",
  recapTexte:
    "Rien n’est encore envoyé. Ta demande part quand tu cliques sur « Confirmer la rétractation », et tu reçois un accusé de réception par e-mail.",
  recapNom: "Prénom et nom",
  recapEmail: "Adresse e-mail du compte",
  recapDateAchat: "Date d’achat",
  recapMotif: "Motif",
  recapNonIndique: "non indiqué",
  /** Étape 2 : seul ce bouton envoie la demande (D.221-5). */
  confirmer: "Confirmer la rétractation",
  modifier: "Modifier",
  succesTitre: "Ta demande de rétractation est bien enregistrée.",
  succesTexte:
    "On t’a envoyé un e-mail de confirmation. Tu ne le vois pas sous 1 heure ? Regarde dans tes spams, ou écris-nous à",
  succesSansEmail:
    "On n’a pas réussi à t’envoyer l’e-mail de confirmation, mais ta demande est bien enregistrée. Pour en garder une trace, écris-nous aussi à",
  erreurValidation: "Vérifie ton nom, ton adresse e-mail et la date d’achat.",
  erreurTropDeDemandes: "Tu as déjà envoyé plusieurs demandes. On les traite : pas besoin de recommencer.",
  erreurServeur: "L’envoi n’a pas marché. Réessaie, ou écris-nous directement à",
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
À l’attention de Deviens Marrant, ${CONTACT_EMAIL} :
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
 * Lot G : paragraphe « Droit de rétractation » remplacé mot pour mot par le
 * texte @legal (point 3), validé par Thomas (founder-preferences 07/10/2026).
 */
/** Valeurs calculées du bloc de confirmation (communes au bienvenue actuel et au bienvenue s23). */
function donneesConfirmation(v: ConfirmationAbonnementVars) {
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
    ? `\nAvec l’annuel, tu as ${ANNUEL_MOIS_OFFERTS_LABEL} : ${formatEuros(PREMIUM_ANNUAL_SAVINGS_CENTS)} économisés par rapport au mensuel.\n`
    : "";
  return { url, annuel, montant, prix, souscription, prochain, finRetractation, ligneAnnuelle };
}

/**
 * Bloc contractuel (L.221-13), de « Ton abonnement Premium est activé » à la ligne des CGU,
 * MOT POUR MOT pour les deux bienvenues. `apresResilier` : ligne collée sous « Résilier : … »
 * (phrase 5 C du bienvenue s23, mensuel seulement), vide sinon.
 */
function blocConfirmation(d: ReturnType<typeof donneesConfirmation>, apresResilier = ""): string {
  const { url, annuel, montant, prix, souscription, prochain, finRetractation, ligneAnnuelle } = d;
  return `Ton abonnement Premium est activé. Bienvenue, et merci pour ta confiance.

Voici ta confirmation :
- Formule : Premium ${annuel ? "annuel" : "mensuel"}
- Prix : ${prix}
- Souscrit le : ${dateLongue(souscription)}
- Prochain prélèvement : ${dateLongue(prochain)}, ${montant} TTC. L’abonnement se reconduit automatiquement à cette date, jusqu’à ce que tu le résilies.
${ligneAnnuelle}
Résilier : en ligne, à tout moment, depuis ton profil, bouton « ${TEXTES_ABONNEMENT.resilier} » : ${url}/profil. Ton accès reste ouvert jusqu’à la fin de la période payée.${apresResilier ? `\n${apresResilier}` : ""}

Droit de rétractation : tu as 14 jours à partir d’aujourd’hui, soit au moins jusqu’au ${dateLongue(finRetractation)}, pour te rétracter sans donner de motif. On te rembourse alors l’intégralité de ce que tu as payé (mensuel comme annuel), sous 14 jours maximum après ta demande. Il suffit de remplir ce formulaire : ${url}/retractation.

Les CGU qui s’appliquent à ton abonnement : ${url}/cgu.`;
}

/**
 * Confirmation de commande (L.221-13), qui sert aussi d'e-mail de bienvenue.
 * VALIDÉ s16 : étalon 2, corps A + objet 2.2, mot pour mot. Adaptations :
 * « rubrique « Gérer mon abonnement » » → bouton réel « Résilier ton contrat »
 * (libellé unique s16) ; le modèle légal de formulaire de rétractation
 * (L.221-5) est joint après la signature.
 * Lot G : paragraphe « Droit de rétractation » remplacé mot pour mot par le
 * texte @legal (point 3), validé par Thomas (founder-preferences 07/10/2026).
 * s23 : envoyé tant que `ONBOARDING_PREMIUM_OUVERT` est fermé (sinon `emailBienvenuePremium`).
 */
export function emailConfirmationAbonnement(v: ConfirmationAbonnementVars): EmailRendu {
  const d = donneesConfirmation(v);
  return {
    subject: "Bienvenue dans Premium, ton abonnement est confirmé",
    text: `${salutation(v.prenom)}

${blocConfirmation(d)}

Tout est ouvert. Pour démarrer, choisis un parcours : ${d.url}/parcours.

À très vite,
${SIGNATURE}

============================================
${formulaireTypeRetractation()}
`,
  };
}

/** Conditions de rendu du bienvenue s23 (lignes `[si …]` du fichier approuvé). */
export interface BienvenuePremiumConditions {
  /** `[si carnet]` : `getCarnetExtrait()` non null (un carnet est publié). */
  carnet: boolean;
  /** `[si état recoit]` : l'abonné reçoit la lettre du jeudi (`recoitHebdo`). */
  lettre: boolean;
  /** `[si question]` : `QUESTION_EQUIPE_OUVERTE`. */
  question: boolean;
}

/** « A, B, C et D » : noms des parcours de l'offre (`PREMIUM_PARCOURS`, sans le rythme). */
export function listeParcoursNoms(noms: readonly string[] = PREMIUM_PARCOURS.map((p) => p.name)): string {
  if (noms.length <= 1) return noms.join("");
  return `${noms.slice(0, -1).join(", ")} et ${noms[noms.length - 1]}`;
}

/**
 * Bienvenue Premium s23 (E0), APPROUVÉ par Thomas le 07/11/2026 (« et j'approuve »,
 * `docs/copy/onboarding-premium-s23-emails.md` v4.2, commit ad24ba7) : MOT POUR MOT.
 * Liste généraliste conditionnelle, « Par où commencer », bloc contractuel inchangé
 * (`blocConfirmation`, commun avec l'e-mail actuel), phrase 5 C pour le mensuel seulement.
 * Envoyé seulement si `ONBOARDING_PREMIUM_OUVERT` (lib/emails/paiement-notifications.ts).
 */
export function emailBienvenuePremium(v: ConfirmationAbonnementVars & BienvenuePremiumConditions): EmailRendu {
  const d = donneesConfirmation(v);
  const puces = [
    "- Les vannes, les conseils et les vidéos : tout, sans limite, et les filtres pour trouver vite ce qui colle à ta situation.",
    `- Les parcours : les ${PARCOURS_COUNT}, en entier, de la première à la dernière étape.`,
    // s24 lot D10 (plan §6 T3, décision Q8) : ligne des bonus, interrupteur de l'espace ouvert seulement ; E0 à réapprouver.
    ESPACE_CLIENT_PUBLIE ? PUCE_BONUS_E0 : null,
    v.carnet ? "- Le carnet de répartie : chaque mois, des situations et leurs répliques, carnets passés compris." : null,
    "- Les exercices des vannes, conseils et vidéos : de quoi t’entraîner, pas seulement lire.",
    "- Tes favoris, ta progression et ta série de jours de pratique : ce qui te plaît sous la main, et où tu en es.",
    v.lettre ? "- La lettre du jeudi : chaque semaine par e-mail, un clic pour l’arrêter." : null,
    v.question ? "- « Ta question à l’équipe » : écris-nous depuis ton profil, on te répond." : null,
    "- Le rappel de parcours : un e-mail pour ne pas perdre le fil, à activer depuis ton profil.",
  ].filter((l): l is string => l !== null);
  const phrase5C = d.annuel
    ? ""
    : `Prends ton temps pour te faire un avis : d’ici le ${dateLongue(d.prochain)}, tout est ouvert, et tu pourras encore résilier la veille.`;
  return {
    subject: "Ton abonnement est confirmé : Premium est ouvert, sers-toi",
    text: `${salutation(v.prenom)} voici tout ce que Premium t’ouvre, et par où commencer.

${puces.join("\n")}

Par où commencer : la première étape d’un parcours, au choix parmi ${listeParcoursNoms()}. ${d.url}/parcours

${blocConfirmation(d, phrase5C)}

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
    subject: "Ton paiement n’est pas passé, ton Premium reste actif",
    text: `${salutation(v.prenom)}

Le prélèvement de ton abonnement Premium${details ? ` (${details})` : ""} n’est pas passé. Ça arrive : carte expirée, plafond atteint, vérification de la banque.

Rien n’est coupé pour l’instant : ton accès Premium reste ouvert pendant que le prélèvement est retenté automatiquement dans les prochains jours.

Si ta carte a changé ou si ta banque a bloqué le paiement, tu peux la mettre à jour ici : ${url}/profil.

Si le paiement reste impossible à la fin des tentatives, l’abonnement s’arrête et l’accès Premium se ferme. Tu pourras te réabonner quand tu veux.

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
  const jusquau = fin ? `jusqu’au ${dateLongue(fin)}` : "jusqu’à la fin de la période payée";
  return {
    subject: fin ? `C’est noté : ton Premium s’arrête le ${dateLongue(fin)}` : "Ta résiliation est confirmée",
    text: `${salutation(v.prenom)}

Ta résiliation est bien prise en compte. Tu gardes l’accès Premium ${jusquau}, puis l’abonnement s’arrête : aucun nouveau prélèvement.

Tu peux te réabonner quand tu veux : ${url}/abonnement. Les premières étapes des parcours restent en lecture libre.

Merci d’avoir bossé ton humour avec nous.

${SIGNATURE}
`,
  };
}

export interface RetractationVars {
  email: string;
  /** Prénom et nom saisis dans la déclaration (s23, D.221-5). Absent (anciens appels) : ligne omise. */
  nom?: string | null;
  dateAchat: Date | null;
  motif: string | null;
  recueLe: Date;
  reference: string;
  /** Prénom du compte trouvé pour cet e-mail (lot E) ; absent → « Salut, ». */
  prenom?: string | null;
  /**
   * Date de PREMIÈRE souscription du compte (création de sa ligne d'abonnement,
   * jamais un renouvellement), lot G. Absente (pas de compte, achat sur
   * l'appli) → délai inconnu. Une ligne plus ancienne que l'abonnement en
   * cours (réabonnement) ne peut que donner « dépassé » : jamais de promesse
   * de remboursement à tort.
   */
  premiereSouscription?: Date | null;
}

export type DelaiRetractation = "dans-le-delai" | "depasse" | "inconnu";

/** Jour de Paris comparable (AAAAMMJJ). */
function jourParis(date: Date): number {
  const { annee, mois, jour } = partiesParis(date);
  return annee * 10_000 + mois * 100 + jour;
}

/**
 * Demande reçue au plus tard le 14e jour (Paris) après la première souscription
 * (lot G, règle de Thomas : premier paiement seulement). Le report au jour
 * ouvrable suivant n'est pas appliqué ici : « dépassé » n'entraîne aucun refus
 * automatique, seulement un accusé sans promesse et une vérification par Thomas.
 */
export function delaiRetractation(premiereSouscription: Date | null | undefined, recueLe: Date): DelaiRetractation {
  const debut = dateValide(premiereSouscription ?? null);
  if (!debut) return "inconnu";
  return jourParis(recueLe) <= jourParis(ajouterJoursParis(debut, 14)) ? "dans-le-delai" : "depasse";
}

// Accusé de rétractation (lot G). `remboursementDansLeDelai` : PROVISOIRE s16 (inchangé) ;
// `remboursementSousCondition` : texte exact @legal (point 7, réserve 1).
export const TEXTES_ACCUSE_RETRACTATION = {
  remboursementDansLeDelai:
    "On te rembourse sous 14 jours maximum, sur le moyen de paiement utilisé pour l’achat. Ton abonnement est alors arrêté : plus aucun prélèvement.",
  remboursementSousCondition:
    "Si ta demande est faite dans les 14 jours qui suivent ta souscription, on te rembourse sous 14 jours maximum, sur le moyen de paiement utilisé. Ton abonnement est alors arrêté.",
} as const;

/**
 * Accusé de réception de la demande de rétractation, au client (support durable). PROVISOIRE s16 (hors étalons).
 * Lot G : « On te rembourse » sans condition seulement si la demande arrive dans
 * les 14 jours de la première souscription ; sinon texte conditionnel @legal,
 * suivi du périmètre (premier paiement seulement).
 * s23 (audit rétractation, P0 n°5) : l'accusé reprend tout le contenu de la
 * déclaration (nom, e-mail, date d'achat et motif s'ils sont fournis), avec la
 * date et l'heure de réception (D.221-5).
 */
export function emailAccuseRetractation(v: RetractationVars): EmailRendu {
  const dateAchat = dateValide(v.dateAchat);
  const nom = v.nom?.trim() ? `\nNom : ${v.nom.trim()}` : "";
  const achat = dateAchat ? `\nDate d’achat indiquée : le ${dateLongue(dateAchat)}` : "";
  const motif = v.motif?.trim() ? `\nMotif indiqué : ${v.motif.trim()}` : "";
  const recue = dateValide(v.recueLe) ?? new Date();
  const remboursement =
    delaiRetractation(v.premiereSouscription, recue) === "dans-le-delai"
      ? TEXTES_ACCUSE_RETRACTATION.remboursementDansLeDelai
      : `${TEXTES_ACCUSE_RETRACTATION.remboursementSousCondition} ${RETRACTATION_PERIMETRE}`;
  return {
    subject: "On a bien reçu ta demande de rétractation",
    text: `${salutation(v.prenom)}

On a bien reçu ta demande de rétractation, le ${dateHeure(recue)}.

Référence : ${v.reference}${nom}
Adresse du compte : ${v.email}${achat}${motif}

${remboursement}

Garde cet e-mail : c’est la preuve de ta demande.

Une question ? ${CONTACT_EMAIL}

${SIGNATURE}
`,
  };
}

const LIGNE_DELAI_ADMIN: Record<DelaiRetractation, (debut: string) => string> = {
  "dans-le-delai": (debut) => `dans le délai de 14 jours (première souscription le ${debut})`,
  depasse: (debut) =>
    `DÉPASSÉ d’après la première souscription (le ${debut}). Remboursement dû seulement pour le premier paiement d’un abonnement : vérifier dans Stripe la date de début de l’abonnement en cours (réabonnement possible).`,
  inconnu: () => "INCONNU (aucun abonnement enregistré pour cet e-mail) : vérifier dans Stripe.",
};

/** Notification interne (admin) : demande de rétractation à traiter sous 14 jours. */
export function emailAdminRetractation(v: RetractationVars & { compteTrouve: boolean }): EmailRendu {
  const debut = dateValide(v.premiereSouscription ?? null);
  const delai = delaiRetractation(debut, v.recueLe);
  return {
    subject: `[Rétractation] Demande ${v.reference} à rembourser sous 14 jours`,
    text: `Nouvelle demande de rétractation.

Reçue le : ${dateHeure(v.recueLe)}
Date limite de remboursement : ${dateLongue(ajouterJoursParis(v.recueLe, 14))} (demande + 14 jours)
Référence : ${v.reference}
Nom indiqué : ${v.nom?.trim() || "non renseigné"}
E-mail saisi :${v.email} (${v.compteTrouve ? "compte trouvé" : "AUCUN compte avec cet e-mail"})
Date d’achat indiquée : ${v.dateAchat ? dateLongue(v.dateAchat) : "non renseignée"}
Délai de rétractation : ${LIGNE_DELAI_ADMIN[delai](debut ? dateLongue(debut) : "")}
Motif : ${v.motif || "non renseigné"}

À faire dans Stripe : rembourser le paiement (remboursement total). Le site résilie alors l’abonnement automatiquement et repasse le compte sans Premium.
`,
  };
}
