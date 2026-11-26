/**
 * Indice « abonné » posé AVANT le premier affichage (s27, défaut D2 de `docs/qa/parcours-abonne-s27.md`).
 *
 * Les pages publiques (fiches, /vannes…) sont en ISR : leur HTML est celui du visiteur, la session n'est lue que
 * dans le navigateur (`useSession`). Sur un mobile lent, un abonné voyait pendant 1,8 à 2,1 s l'offre payante
 * (« Tout ouvrir », cadenas, « Essayer ce conseil · 1,99 €/mois ») avant la version abonné.
 *
 * Correction sans toucher au cache : un cookie lisible par le navigateur (`dm_lecteur`, jamais un secret : il ne
 * donne accès à rien, l'API relit toujours le plan en base) dit « ce navigateur est celui d'un abonné ». Un script
 * en ligne dans <head> le lit avant tout affichage et pose `data-indice-lecteur="abonne"` sur <html> ; la feuille de
 * style masque alors tout élément marqué `data-masque-abonne` (offre, cadenas, « Connexion »). Le visiteur n'a pas
 * le cookie : son HTML et son affichage sont inchangés. Choix le plus sûr pour l'abonné : tant que la session n'est
 * pas lue, rien de l'offre ; si l'indice était faux (abonnement terminé), l'offre apparaît une fois la session lue.
 *
 * Qui pose le cookie : le middleware (premier passage d'un navigateur connecté sans indice, plan lu dans le jeton),
 * puis `IndiceLecteur` dans le navigateur à chaque session lue (corrige un indice périmé, l'efface à la déconnexion).
 */
export const COOKIE_INDICE_LECTEUR = "dm_lecteur";
/** Attribut posé sur <html> par le script en ligne et par `IndiceLecteur`. */
export const ATTRIBUT_INDICE_LECTEUR = "data-indice-lecteur";
/** Durée de l'indice : celle de la session NextAuth (30 jours). */
export const DUREE_INDICE_LECTEUR_S = 30 * 24 * 60 * 60;

export type IndiceLecteur = "abonne" | "compte";

/** Valeur de l'indice pour un compte connecté (plan du jeton ou de la session). */
export function indiceDepuisPlan(plan: unknown): IndiceLecteur {
  return plan === "PREMIUM" ? "abonne" : "compte";
}

/** Lit l'indice dans une chaîne `document.cookie` (null : absent ou valeur inconnue). */
export function lireIndiceLecteur(cookies: string): IndiceLecteur | null {
  const m = new RegExp(`(?:^|;\\s*)${COOKIE_INDICE_LECTEUR}=(abonne|compte)(?:;|$)`).exec(cookies);
  return m ? (m[1] as IndiceLecteur) : null;
}

/**
 * Script en ligne de <head> (CSP du site : `'unsafe-inline'` déjà admis pour les scripts). Quelques octets, aucune
 * dépendance, ne lève jamais : sans cookie, il ne fait rien.
 */
export const SCRIPT_INDICE_LECTEUR = `try{if(/(?:^|;\\s*)${COOKIE_INDICE_LECTEUR}=abonne(?:;|$)/.test(document.cookie))document.documentElement.setAttribute("${ATTRIBUT_INDICE_LECTEUR}","abonne")}catch(e){}`;

/** Noms du cookie de session NextAuth (http, https, découpé en morceaux `.0`, `.1`…). */
export function aCookieDeSession(noms: readonly string[]): boolean {
  return noms.some((n) => /^(?:__Secure-)?next-auth\.session-token(?:\.\d+)?$/.test(n));
}
