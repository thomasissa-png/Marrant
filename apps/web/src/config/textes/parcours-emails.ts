/**
 * Textes serveur des parcours (lot A, s17) : messages des API de progression,
 * case et gabarit du rappel e-mail sur demande (D7), page d'arrêt du rappel.
 *
 * Règles : tutoiement, aucun tiret cadratin, aucune mention IA, signature
 * « L'Équipe Deviens Marrant ». E-mail de SERVICE (avis @legal §1, C6) :
 * étape suivante, date conseillée, lien vers l'étape ; zéro offre, prix,
 * article de blog ou réseau social.
 */

// s17, aligné sur les étalons
export const TEXTES_PROGRESSION_API = {
  authRequise: "Connecte-toi pour suivre ta progression.",
  corpsInvalide: "La demande est arrivée incomplète. Réessaie.",
  etapeInvalide: "Cette étape n'existe pas dans ce parcours.",
  parcoursIntrouvable: "Ce parcours est introuvable.",
  reserveePremium: "Le suivi des étapes fait partie de Premium.",
  limite: "Trop de tentatives. Réessaie dans une minute.",
  /** Abonné qui valide une étape avant la précédente (ordre conseillé). */
  ordre: (etapeAttendue: number) => `Valide d'abord l'étape ${etapeAttendue}, la suite s'ouvre juste après.`,
  serveur: "L'étape n'a pas voulu se valider. Réessaie dans un instant.",
  retourInvalide: "Ce retour n'est pas reconnu.",
} as const;

/**
 * Case du rappel (profil, lot C) : texte affiché à côté, recopié tel quel
 * (avis @legal C1). Changer le texte = changer la version : la version vue
 * est enregistrée à l'activation (preuve du consentement).
 */
// s17, validé (texte juridique @legal C1, conservé tel quel : le modifier impose de changer la version ; même contenu que l'étalon 3.7 A)
export const RAPPEL_PARCOURS_CONSENTEMENT = {
  version: "s17-v1",
  texte: "Reçois chaque semaine un e-mail pour reprendre ton parcours. Tu peux l'arrêter à tout moment.",
} as const;

export const JOURS_SEMAINE = ["lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi", "dimanche"] as const;

export interface RappelParcoursContenu {
  prenom: string | null;
  parcoursTitre: string;
  etapeNumero: number;
  etapeTitre: string;
  /** Date conseillée déjà formatée (« mardi 14 octobre »), null si l'étape est déjà conseillée. */
  dateConseillee: string | null;
  lienEtape: string;
  lienArret: string;
  lienChangerJour: string;
  /** Date de la demande formatée (« 7 octobre 2026 »). */
  dateDemande: string;
  jourChoisi: string;
}

// s17, validé (étalon 3.7 : objet 7.2, corps A ; date conseillée : étalon 3.3 A ; pied : texte de service @legal C6)
export function rappelParcoursEmail(c: RappelParcoursContenu): { subject: string; text: string } {
  const bonjour = c.prenom ? `Salut ${c.prenom},` : "Salut,";
  const dateLigne = c.dateConseillee
    ? [`Prochaine étape conseillée le ${c.dateConseillee}. Tu peux y aller dès maintenant si tu veux.`, ""]
    : [];
  return {
    subject: c.prenom ? `${c.prenom}, ta prochaine étape t'attend` : "Ta prochaine étape t'attend",
    text: [
      bonjour,
      "",
      "Tu as demandé un rappel chaque semaine : le voici.",
      "",
      `Ta prochaine étape dans le parcours ${c.parcoursTitre} : l'étape ${c.etapeNumero}, « ${c.etapeTitre} ». Un conseil, un défi et un petit quiz, de quoi remplir tes 15 à 20 minutes de la semaine.`,
      "",
      ...dateLigne,
      `Reprendre mon parcours : ${c.lienEtape}`,
      "",
      "Plus envie de ce rappel ? Un clic suffit, le lien d'arrêt est tout en bas.",
      "",
      "L'Équipe Deviens Marrant",
      "deviens-marrant.fr",
      "",
      "---",
      `Tu reçois cet e-mail parce que tu as demandé un rappel de ton parcours le ${c.dateDemande}, chaque ${c.jourChoisi}.`,
      `Arrêter ce rappel (un clic, sans connexion) : ${c.lienArret}`,
      `Changer de jour : ${c.lienChangerJour}`,
      "Une question ? Réponds à contact@deviens-marrant.fr.",
    ].join("\n"),
  };
}

/** Page affichée après le clic sur le lien d'arrêt (C7). */
// s17, aligné sur les étalons
export const TEXTES_ARRET_RAPPEL = {
  okTitre: "Rappel arrêté",
  ok: "C'est fait : tu ne recevras plus le rappel de ton parcours. Tes autres e-mails (paiement, compte) ne changent pas. Tu peux le réactiver quand tu veux depuis ton profil.",
  invalideTitre: "Lien invalide",
  invalide: "Ce lien d'arrêt ne marche pas. Tu peux couper le rappel depuis ton profil, ou nous écrire à contact@deviens-marrant.fr.",
  erreurTitre: "Petit souci",
  erreur: "Le rappel n'a pas pu être arrêté. Réessaie dans un instant ou écris-nous à contact@deviens-marrant.fr.",
  retour: "Retour au site",
} as const;

/** Messages de l'API de préférence du rappel (profil, lot C). */
// s17, aligné sur les étalons
export const TEXTES_RAPPEL_API = {
  authRequise: "Connecte-toi pour régler ton rappel.",
  reservePremium: "Le rappel de parcours fait partie de Premium.",
  invalide: "Choisis un jour de la semaine pour ton rappel.",
  serveur: "Ton réglage n'a pas été enregistré. Réessaie dans un instant.",
} as const;
