/**
 * Rendu du canal Premium (lettre de la semaine, s21 ; s22 : aussi la lettre du mois envoyée aux
 * abonnés Premium). Sans base : partagé par `envoi-hebdo.ts` (lettre réservée) et `envoi.ts` (lettre
 * du mois, version Premium), sans import circulaire. Réexporté par `envoi-hebdo.ts`.
 */
import { LETTRE_HEBDO_ARRET_CHEMIN } from "@/config/lettre";
import { ligneQuestionEquipeHebdo, piedNumeroHebdo } from "@/config/textes/lettre-hebdo-s21";
import { frPonctuation } from "@/lib/fr-typo";

const base = (baseUrl: string) => baseUrl.replace(/\/$/, "");

/** Lien d'arrêt du CORPS : page avec bouton (GET sans effet, @legal L5). */
export function lienArretHebdo(baseUrl: string, token: string): string {
  return `${base(baseUrl)}${LETTRE_HEBDO_ARRET_CHEMIN}?token=${encodeURIComponent(token)}`;
}

/** En-têtes RFC 2369 + RFC 8058 : arrêt immédiat des lettres Premium par le client de messagerie. */
export function enTetesArretHebdo(baseUrl: string, token: string): Record<string, string> {
  return {
    "List-Unsubscribe": `<${base(baseUrl)}/api/lettre-premium/arret-un-clic?token=${encodeURIComponent(token)}>`,
    "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
  };
}

/**
 * Corps complet : texte préparé (approuvé) + ligne « Ta question à l'équipe » si le service est
 * ouvert (s22) + pied hebdo. Insécables posées au rendu, texte stocké intact. Le texte préparé
 * seul entre dans l'empreinte d'approbation : la ligne et le pied n'y entrent pas.
 */
export function corpsNumeroHebdo(bodyText: string, baseUrl: string, token: string, questionOuverte?: boolean): string {
  const ligne = ligneQuestionEquipeHebdo(questionOuverte);
  return `${frPonctuation(bodyText.trimEnd())}${frPonctuation(ligne)}\n${frPonctuation(piedNumeroHebdo(lienArretHebdo(baseUrl, token), baseUrl))}`;
}
