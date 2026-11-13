/**
 * Module sans dépendance (importé par la carte, côté navigateur : jamais `missions.ts` ni son JSON).
 * Lot D10 (décision de la session) : le préfixe « DÉFI XXX : » des défis importés est retiré À L'AFFICHAGE
 * seulement ; `missions.json` garde l'énoncé mot pour mot (cité du seed). La première lettre restante passe
 * en majuscule (la phrase commençait après les deux-points). Les autres paragraphes ne changent pas.
 */
const PREFIXE_DEFI = /^DÉFI [^:]{1,40} :\s+/u;

export function enonceAffiche(enonce: readonly string[]): string[] {
  return enonce.map((p, i) => {
    if (i > 0 || !PREFIXE_DEFI.test(p)) return p;
    const reste = p.replace(PREFIXE_DEFI, "");
    return reste.charAt(0).toLocaleUpperCase("fr-FR") + reste.slice(1);
  });
}
