/**
 * Version Premium de la lettre du mois (s22, décision de Thomas du 25/10 : la lettre du mois est l'une
 * des lettres des abonnés Premium). Un seul texte approuvé, deux versions dérivées sans IA ni regex :
 *  - version gratuite : le texte tel quel, marqueurs retirés (identique, mot pour mot, au texte relu) ;
 *  - version Premium : le texte SANS le bloc d'invitation Premium (« PS : … », « Voir l'offre
 *    Premium : …/abonnement… »), seule différence.
 *
 * Le bloc est délimité dans `data/lettre/numeros.json` par deux marqueurs explicites, chacun seul sur
 * sa ligne, entourés d'une ligne vide (paragraphe à part) :
 *
 *   …dernier paragraphe\n\n[[invitation-premium]]\nPS : …\nVoir l'offre Premium : …\n[[/invitation-premium]]\n\nRendez-vous…
 *
 * Les marqueurs font partie du texte stocké : l'empreinte d'approbation (`approvedHash`) couvre donc
 * les deux versions. Marqueurs absents : les deux versions sont identiques. Marqueurs mal posés
 * (un seul, deux fois, désordre, pas en paragraphe à part) : `null`, le numéro ne part pas.
 */

export const DEBUT_INVITATION_PREMIUM = "[[invitation-premium]]";
export const FIN_INVITATION_PREMIUM = "[[/invitation-premium]]";

const OUVERTURE = `\n\n${DEBUT_INVITATION_PREMIUM}\n`;
const FERMETURE = `\n${FIN_INVITATION_PREMIUM}\n\n`;

const occurrences = (texte: string, motif: string) => texte.split(motif).length - 1;

export interface DecoupeInvitation {
  avant: string;
  /** Bloc d'invitation, sans les marqueurs (`null` : aucune invitation dans ce numéro). */
  invitation: string | null;
  apres: string;
}

/** Découpe exacte du corps stocké, ou `null` si les marqueurs sont mal posés. */
export function decouperInvitation(corps: string): DecoupeInvitation | null {
  const debuts = occurrences(corps, DEBUT_INVITATION_PREMIUM);
  const fins = occurrences(corps, FIN_INVITATION_PREMIUM);
  if (debuts === 0 && fins === 0) return { avant: corps, invitation: null, apres: "" };
  if (debuts !== 1 || fins !== 1) return null;
  const i = corps.indexOf(OUVERTURE);
  const j = corps.indexOf(FERMETURE);
  if (i < 0 || j < 0 || j < i + OUVERTURE.length) return null;
  const invitation = corps.slice(i + OUVERTURE.length, j);
  if (invitation.trim().length === 0) return null;
  return { avant: corps.slice(0, i), invitation, apres: corps.slice(j + FERMETURE.length) };
}

/** Version gratuite : le texte relu, mot pour mot (marqueurs retirés). `null` si marqueurs mal posés. */
export function versionGratuite(corps: string): string | null {
  const d = decouperInvitation(corps);
  if (!d) return null;
  return d.invitation === null ? corps : `${d.avant}\n\n${d.invitation}\n\n${d.apres}`;
}

/** Version Premium : le texte relu sans le bloc d'invitation. `null` si marqueurs mal posés. */
export function versionPremium(corps: string): string | null {
  const d = decouperInvitation(corps);
  if (!d) return null;
  return d.invitation === null ? corps : `${d.avant}\n\n${d.apres}`;
}

/** Reste d'un marqueur dans un texte rendu (jamais envoyé). */
export function contientMarqueurInvitation(texte: string): boolean {
  return texte.includes("[[invitation-premium") || texte.includes("[[/invitation-premium");
}
