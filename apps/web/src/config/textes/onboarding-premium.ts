/**
 * Onboarding Premium s23 : E1 (J5) et E2 (J21), APPROUVÉS par Thomas le 07/11/2026
 * (« et j'approuve », `docs/copy/onboarding-premium-s23-emails.md` v4.2, commit ad24ba7).
 * Textes repris MOT POUR MOT : toute modification fait perdre l'approbation et repasse par Thomas.
 * Phrases de tête des résiliés programmés : texte @legal exact (`docs/legal/onboarding-e1-resilies-s23.md`).
 * Aucun chiffre en dur : `{N}` = PARCOURS_COUNT, `{weeks}` = PREMIUM_PARCOURS.
 */
import { PARCOURS_COUNT, PREMIUM_PARCOURS } from "@/config/premium";
import { ONBOARDING_SRC } from "@/config/onboarding-premium";
import { dateLongue, SIGNATURE, siteUrl, type EmailRendu } from "@/config/textes/paiement";
import { salutation } from "@/lib/emails/annual-renewal-reminder";

/** Signature d'E1, E1b et E2 : `SIGNATURE` suivie de « deviens-marrant.fr ». */
const SIGNATURE_ONBOARDING = `${SIGNATURE}
deviens-marrant.fr`;

function piedArret(lienArret: string): string {
  return `---
Tu reçois cet e-mail parce que tu as pris un abonnement Premium sur deviens-marrant.fr.
Arrêter ces e-mails d’accueil (un clic, sans connexion) : ${lienArret}`;
}

export const OBJET_E1 = "Une question ? Voilà ce qu’on fait ici";
export const OBJET_E1B = "Une situation où la répartie t’a manqué ?";
export const OBJET_E2 = "Trois semaines : qu’est-ce qui manque ?";

/** Prochaine étape d'un parcours en cours (version PARCOURS). */
export interface EtapeOnboarding {
  /** Titre du parcours ; vide : ligne d'étape supprimée, lien `{url}/parcours`. */
  parcoursTitre: string | null;
  parcoursSlug: string;
  etapeNumero: number;
  /** Titre de l'étape (seed) ; absent : repli « étape {n} sur {weeks} ». */
  etapeTitre: string | null;
}

export interface E1Vars {
  prenom: string | null;
  /** Fin de l'accès payé, SEULEMENT en résiliation programmée (phrase de tête @legal) ; sinon null. */
  finAcces: Date | null;
  /** `[si carnet]` : un carnet est publié. */
  carnet: boolean;
  /** Parcours en cours (au moins une étape validée, parcours non terminé) : version PARCOURS. */
  etape: EtapeOnboarding | null;
  lienArret: string;
}

export type VersionE1 = "generale" | "parcours";

function listeE1(carnet: boolean): string {
  return [
    "- Vannes : des blagues rangées par situation, à ressortir au bon moment.",
    "- Conseils : des techniques de répartie et d’humour, avec un défi à tester.",
    "- Vidéos : du stand-up français décortiqué, pour voir ce qui fait rire.",
    `- Parcours : ${PARCOURS_COUNT} au choix, une étape par semaine, pour progresser pas à pas.`,
    carnet ? "- Carnet : chaque mois, des situations et leurs répliques." : null,
    "- Glossaire : le dico de l’humour (punchline, timing, callback…).",
    "- Quiz : « Quel type d’humour es-tu ? », pour savoir d’où tu pars.",
  ]
    .filter((l): l is string => l !== null)
    .join("\n");
}

/** Ligne d'étape de la version PARCOURS, avec ses replis (null : ligne supprimée). */
export function ligneEtape(e: EtapeOnboarding): string | null {
  const titre = e.parcoursTitre?.trim();
  if (!titre) return null;
  const weeks = PREMIUM_PARCOURS.find((p) => p.slug === e.parcoursSlug)?.weeks ?? null;
  const etapeTitre = e.etapeTitre?.trim();
  if (etapeTitre) {
    const position = weeks ? `étape ${e.etapeNumero} sur ${weeks}` : `étape ${e.etapeNumero}`;
    return `Ta prochaine étape dans « ${titre} » : ${etapeTitre} (${position}).`;
  }
  const position = weeks ? `étape ${e.etapeNumero} sur ${weeks}` : `étape ${e.etapeNumero}`;
  return `Ta prochaine étape dans « ${titre} » : ${position}.`;
}

/** E1 (J5) : version PARCOURS si un parcours est en cours, sinon GÉNÉRALE. Objet unique. */
export function emailOnboardingE1(v: E1Vars): EmailRendu & { version: VersionE1 } {
  const url = siteUrl();
  const version: VersionE1 = v.etape ? "parcours" : "generale";
  const fin = v.finAcces ? dateLongue(v.finAcces) : null;
  const tete = fin
    ? `\nTon accès reste ouvert jusqu’au ${fin} : ${version === "parcours" ? "voici où tu en es." : "voici par où commencer."}`
    : "";
  const ligne = v.etape ? ligneEtape(v.etape) : null;
  const blocEtape = ligne ? `${ligne}\n\n` : "";
  const lien = v.etape
    ? `Reprendre mon parcours : ${ligne ? `${url}/parcours/${v.etape.parcoursSlug}` : `${url}/parcours`}?src=${ONBOARDING_SRC}`
    : `Pour commencer par un parcours : ${url}/parcours?src=${ONBOARDING_SRC}`;
  return {
    version,
    subject: OBJET_E1,
    text: `${salutation(v.prenom)}${tete}

${blocEtape}Une question, un doute, un truc qui manque ? Réponds à cet e-mail, on lit tout. Et pour t’y retrouver, voici tout ce qui t’attend sur le site :
${listeE1(v.carnet)}

Et dans ton profil : tes favoris, ta progression et le rappel de parcours, à activer si tu veux un e-mail pour ne pas perdre le fil.

${lien}

${SIGNATURE_ONBOARDING}

${piedArret(v.lienArret)}
`,
  };
}

export interface E1bVars {
  prenom: string | null;
  lienArret: string;
}

/**
 * E1b (J12) « pose-nous ta question », APPROUVÉ par Thomas le 08/11/2026 (« go », section E1b du
 * fichier approuvé, commit 3586113, objet A), mot pour mot. Lien `/profil` nu : pas de `?src=`
 * (aucun suivi) ni d'ancre (un fragment ne survit pas à la connexion, `callbackUrl` sans `#`).
 * Jamais aux résiliés programmés ; envoyé seulement si `QUESTION_EQUIPE_OUVERTE`.
 */
export function emailOnboardingE1b(v: E1bVars): EmailRendu {
  return {
    subject: OBJET_E1B,
    text: `${salutation(v.prenom)} raconte-nous, l’équipe te répond.

Un collègue qui te chambre devant tout le monde, un message que tu n’arrives pas à écrire : décris la situation dans « Ta question à l’équipe », sur ton profil, juste sous ton abonnement.

En général, réponse par e-mail sous 1 à 2 jours ouvrés. Rien n’est publié sans ton accord.

Poser ma question : ${siteUrl()}/profil

${SIGNATURE_ONBOARDING}

${piedArret(v.lienArret)}
`,
  };
}

export interface E2Vars {
  prenom: string | null;
  lienArret: string;
}

/** E2 (J21), étalon 4 A, jamais aux résiliés programmés (C2). */
export function emailOnboardingE2(v: E2Vars): EmailRendu {
  return {
    subject: OBJET_E2,
    text: `${salutation(v.prenom)} ça fait trois semaines que tu es là. Dis-nous ce qui t’a servi, ce qui t’a fait lever les yeux au ciel et ce qui manque. Réponds simplement à cet e-mail, on lit chaque réponse.

Une ligne suffit, même pour dire que tu n’as pas encore eu le temps.

${SIGNATURE_ONBOARDING}

${piedArret(v.lienArret)}
`,
  };
}

/**
 * Page du lien d'arrêt (s23, hors fichier approuvé, calque de `TEXTES_ARRET_RAPPEL`) :
 * validés par Thomas le 08/11/2026.
 */
export const TEXTES_ARRET_ONBOARDING = {
  okTitre: "E-mails d’accueil arrêtés",
  ok: "C’est fait : tu ne recevras plus nos e-mails d’accueil. Tes autres e-mails (paiement, compte, lettre) ne changent pas.",
  invalideTitre: "Lien invalide",
  invalide: "Ce lien d’arrêt ne marche pas. Écris-nous à contact@deviens-marrant.fr et on arrête ces e-mails pour toi.",
  erreurTitre: "Petit souci",
  erreur: "Les e-mails d’accueil n’ont pas pu être arrêtés. Réessaie dans un instant ou écris-nous à contact@deviens-marrant.fr.",
  retour: "Retour au site",
} as const;

/**
 * Confidentialité, partie 3 (cadre @legal C8, texte du 08/11/2026 adapté le 08/11 au passage à trois
 * e-mails, E1b approuvé, mot pour mot) : puce rendue
 * SEULEMENT interrupteur `ONBOARDING_PREMIUM_OUVERT` ouvert.
 */
export const CONFIDENTIALITE_ONBOARDING_PREMIUM =
  "Après ton abonnement, on t’envoie jusqu’à trois e-mails d’accueil, au bout de 5, 12 puis 21 jours, tant que ton accès est ouvert : exécution du contrat. Tu les arrêtes en un clic depuis le bas de chaque e-mail, sans te connecter, ou en répondant à l’e-mail ; ils ne contiennent ni pixel ni suivi des clics.";
