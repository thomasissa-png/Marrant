/**
 * Textes DÉJÀ EN LIGNE retouchés par l'espace client (s24, lot D10 ; plan §6, lignes T1, T3, T7, T8, T11).
 * Chaque version n'est servie qu'interrupteur `ESPACE_CLIENT_PUBLIE` ouvert ; fermé, le texte actuel est
 * servi au caractère près. GO DE THOMAS OBLIGATOIRE LIGNE PAR LIGNE (porte G8) avant l'ouverture :
 * `docs/espace-client/textes-en-ligne-d10-a-valider.md` (texte actuel, texte proposé, où, pourquoi).
 *
 * Sources, mot pour mot :
 * - T1, T3 : décision Q8 de Thomas (`docs/founder-preferences.md`, 12/11, l. 169) ;
 * - T7 : `docs/legal/espace-client-s24-phrases.md`, bloc 2, « CGU art. 10 » : première retouche, puis
 *   (lot D10b) la VARIANTE de @legal en phrase séparée (relectures reviewer et elon : le délai reste
 *   attaché à la réponse) ;
 * - T8 : lot D10b, réécriture de la relecture @elon (« écris-la dans Mes questions ») ;
 * - T11 : brief §3.8 et architecture v20 2.6 ; lot D10b : a) partie non nulle seule (@elon, @reviewer),
 *   b) ligne selon les nombres (@reviewer). Pluriels accordés au nombre.
 * T1 et T3 ne sont servis que si les 4 fiches bonus sont publiées (`lib/espace/bonus-publies.ts`).
 * Contrôle automatique : zéro tiret cadratin, zéro émoji (`__tests__/espace/profil-d10-s24.test.tsx`).
 */
import { CGU_QUESTION_EQUIPE } from "@/config/textes/question-equipe-s22";

/** T1 : ligne AJOUTÉE sous le sous-titre de `/abonnement` (titre et sous-titre inchangés). */
export const LIGNE_BONUS_OFFRE = "Et à chaque cap franchi dans les parcours, un bonus en plus.";

/** T3 : puce AJOUTÉE à l'e-mail de bienvenue E0, juste après celle des parcours (E0 à réapprouver). */
export const PUCE_BONUS_E0 = `- ${LIGNE_BONUS_OFFRE}`;

/**
 * T7 : CGU article 10. Lot D10b : la 2e phrase reste telle qu'elle est (délai de la réponse) ; on ajoute
 * la phrase séparée de @legal juste après elle. Seule la 1re retouche (« ton espace (Mes questions) ») reste.
 */
export const PHRASE_RETROUVER_CGU = "Tu retrouves ensuite ta question et sa réponse dans ton espace.";
export const CGU_QUESTION_EQUIPE_ESPACE = CGU_QUESTION_EQUIPE.texte
  .replace("tu peux écrire à l'équipe depuis ton profil", "tu peux écrire à l'équipe depuis ton espace (Mes questions)")
  .replace("en cas de retard, on te prévient. ", `en cas de retard, on te prévient. ${PHRASE_RETROUVER_CGU} `);

/** T8 : l'encadré « Ta question à l'équipe » du profil devient une ligne de lien vers « Mes questions ». */
export const PROFIL_LIGNE_QUESTIONS = {
  avant: "Ta question à l'équipe : écris-la dans ",
  lien: "Mes questions",
  apres: ".",
} as const;

const pluriel = (n: number, un: string, plusieurs: string) => `${n} ${n > 1 ? plusieurs : un}`;

/**
 * T11 : lignes de l'ancien abonné sur `/abonnement`. a) étapes et favoris : la ligne d'origine si les deux
 * sont au-dessus de 0, sinon la seule partie non nulle (lot D10b) ; b) questions et répliques : la phrase
 * qui correspond à ce qui existe (lot D10b, jamais un historique de questions vide annoncé).
 */
export const ANCIEN_ABONNE = {
  progression: (etapes: number, favoris: number) =>
    `Tes favoris et ta progression sont gardés : ${pluriel(etapes, "étape faite", "étapes faites")}, ${pluriel(favoris, "favori", "favoris")}.`,
  etapesSeules: (etapes: number) => `Ta progression est gardée : ${pluriel(etapes, "étape faite", "étapes faites")}.`,
  favorisSeuls: (favoris: number) => `Tes favoris sont gardés : ${pluriel(favoris, "favori", "favoris")}.`,
  historique: "Ton historique de questions et tes répliques sont gardés.",
  questionsSeules: "Ton historique de questions est gardé.",
  repliquesSeules: "Tes répliques sont gardées.",
} as const;
