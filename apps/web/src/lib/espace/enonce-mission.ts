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

/**
 * v7 tour 2 (piste Mission) : l'accroche de la tuile Mission d'« Aujourd'hui », le DÉBUT de l'énoncé affiché (préfixe
 * « DÉFI XXX : » retiré) en phrases ENTIÈRES : la première, puis les suivantes tant que le tout reste sous `max`
 * caractères (règle du début du conseil du jour, plafond plus haut : la tuile est plus large). Jamais une phrase coupée au milieu. Fin de phrase :
 * « . ! ? … » suivi d'un espace et d'une majuscule (« nul en... » entre guillemets ne coupe pas).
 */
export function accrocheMission(enonce: readonly string[], max = 240): string {
  const premier = (enonceAffiche(enonce)[0] ?? "").replace(/\s+/g, " ").trim();
  // Sans lookbehind (module aussi chargé côté navigateur, anciens Safari) : chaque phrase jusqu'à sa ponctuation finale.
  const phrases = premier.match(/[\s\S]+?[.!?…](?=\s+[A-ZÀÂÉÈÊÎÔÛÇ«]|$)|[\s\S]+$/gu)?.map((p) => p.trim()) ?? [premier];
  let sortie = phrases[0] ?? "";
  for (const p of phrases.slice(1)) {
    if (`${sortie} ${p}`.length > max) break;
    sortie = `${sortie} ${p}`;
  }
  return sortie;
}
