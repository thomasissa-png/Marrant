/**
 * Textes DÉJÀ EN LIGNE retouchés par l'espace client (s24, lot D10 ; plan §6, lignes T1, T3, T7, T8, T11).
 * Chaque version n'est servie qu'interrupteur `ESPACE_CLIENT_PUBLIE` ouvert ; fermé, le texte actuel est
 * servi au caractère près. GO DE THOMAS OBLIGATOIRE LIGNE PAR LIGNE (porte G8) avant l'ouverture :
 * `docs/espace-client/textes-en-ligne-d10-a-valider.md` (texte actuel, texte proposé, où, pourquoi).
 *
 * Sources, mot pour mot :
 * - T1, T3 : décision Q8 de Thomas (`docs/founder-preferences.md`, 12/11, l. 169) ;
 * - T7 : `docs/legal/espace-client-s24-phrases.md`, bloc 2, « CGU art. 10 », deux retouches ;
 * - T8 : assemblage de deux libellés déjà validés (titre « Ta question à l'équipe » de l'encadré s22 et
 *   rubrique « Mes questions », décision C1) [PROPOSÉ : relecture à l'aveugle et go de Thomas] ;
 * - T11 : brief §3.8 et architecture v20 2.6 (lignes de l'ancien abonné), pluriels accordés au nombre.
 * Contrôle automatique : zéro tiret cadratin, zéro émoji (`__tests__/espace/profil-d10-s24.test.tsx`).
 */
import { CGU_QUESTION_EQUIPE } from "@/config/textes/question-equipe-s22";

/** T1 : ligne AJOUTÉE sous le sous-titre de `/abonnement` (titre et sous-titre inchangés). */
export const LIGNE_BONUS_OFFRE = "Et à chaque cap franchi dans les parcours, un bonus en plus.";

/** T3 : puce AJOUTÉE à l'e-mail de bienvenue E0, juste après celle des parcours (E0 à réapprouver). */
export const PUCE_BONUS_E0 = `- ${LIGNE_BONUS_OFFRE}`;

/** T7 : CGU article 10, les deux retouches de @legal appliquées à la phrase actuelle, rien d'autre. */
export const CGU_QUESTION_EQUIPE_ESPACE = CGU_QUESTION_EQUIPE.texte
  .replace("tu peux écrire à l'équipe depuis ton profil", "tu peux écrire à l'équipe depuis ton espace (Mes questions)")
  .replace(
    "L'équipe répond par e-mail, en général sous 1 à 2 jours ouvrés",
    "L'équipe répond par e-mail, et tu retrouves ta question et sa réponse dans ton espace, en général sous 1 à 2 jours ouvrés",
  );

/** T8 : l'encadré « Ta question à l'équipe » du profil devient une ligne de lien vers « Mes questions ». */
export const PROFIL_LIGNE_QUESTIONS = {
  avant: "Ta question à l'équipe : ",
  lien: "Mes questions",
} as const;

const pluriel = (n: number, un: string, plusieurs: string) => `${n} ${n > 1 ? plusieurs : un}`;

/** T11 : lignes de l'ancien abonné sur `/abonnement`, chacune seulement si ses nombres sont au-dessus de 0. */
export const ANCIEN_ABONNE = {
  progression: (etapes: number, favoris: number) =>
    `Tes favoris et ta progression sont gardés : ${pluriel(etapes, "étape faite", "étapes faites")}, ${pluriel(favoris, "favori", "favoris")}.`,
  historique: "Ton historique de questions et tes répliques sont gardés.",
} as const;
