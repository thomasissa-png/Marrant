/**
 * Pool strict des vannes sociales (plan v3 §1-§2, barre D1 : au niveau, ≥ 8,5 chez
 * les 2 relecteurs à l'aveugle). Lu par le Worker (alerte « stock < 14 » par réseau)
 * et par `prepare-social-month.ts --pool` (fichier exporté depuis cette liste).
 *
 * Source : `docs/social/preparation/stock-vannes-resultat-s15.md` (41 au niveau, 05/10/2026)
 * moins Alexa V100 (exemptée, post validé X1) = 40, plus 2 du pilote P0 (07/10) = 42, identifiants via la clé du
 * croisement (`aveugle-stock-lot-CLE-ne-pas-ouvrir.json`), ordre : note moyenne des 2
 * relecteurs décroissante, puis numéro V.
 * MISE À JOUR À CHAQUE VAGUE (14 hors lot notées le 07/10, pilote P0, V1 à V4) :
 * ajouter les identifiants validés à leur rang, commit, déploiement normal.
 */
export const POOL_STRICT: string[] = [
  "cs14jk04b4bc8bbf8a2d8a05", // V019 : 9,0 / 9,0
  "cs14jke5d015b07714055538", // V025 : 9,0 / 9,0
  "cs14jk0c96df8dc97a67e3f6", // V044 : 9,0 / 9,0
  "cs14jkdf1cef669030ec828a", // V045 : 9,0 / 9,0
  "cs14jk34c841ef6e1abadb11", // V070 : 9,0 / 9,0
  "cs14jka3336e7e90a453a9d6", // V083 : 9,0 / 9,0
  "cs14jkdb222991fcbf194845", // V087 : 9,0 / 9,0
  "cs14jk50c85bb0d73deaebaf", // V014 : 9,0 / 8,5
  "cs14jk18882246f6446df2b7", // V033 : 9,0 / 8,5
  "cs14jk4fe660e7238281ce47", // V043 : 8,5 / 9,0
  "cs14jk2fd7c7c96d7815407d", // V059 : 8,5 / 9,0
  "cmni62ad30005s60yc7qnog31", // V061 : 9,0 / 8,5
  "cs14jkafa211aede70b92cc8", // V076 : 8,5 / 9,0
  "cs14jkffeab1620070f2263e", // V079 : 8,5 / 9,0
  "cs14jk2ef0aabfbf4784ad82", // V101 : 8,5 / 9,0
  "cmnz0jqsx000rs60xrbrqm8kk", // V105 : 9,0 / 8,5
  "cs14jk9a9e7a1b8e0e16264e", // V111 : 8,5 / 9,0
  "cmmnsqn15006kth63res9rqp9", // V007 : 8,5 / 8,5
  "cmmnsqn120000th63o435xsb0", // V009 : 8,5 / 8,5
  "cmmnsqn130038th63fxn1wvhn", // V011 : 8,5 / 8,5
  "cs14jke10b58d158ae638560", // V013 : 8,5 / 8,5
  "cs14jk29357d022f6880a69e", // V015 : 8,5 / 8,5
  "cmmnsqn130033th63b54ux45o", // V028 : 8,5 / 8,5
  "cs14jk90226d6abb90287724", // V035 : 8,5 / 8,5
  "cs14jka7e683e43af915bb60", // V037 : 8,5 / 8,5
  "cs14jkd11f7913f8177df395", // V040 : 8,5 / 8,5
  "cs14jkd9058d03e24961004a", // V041 : 8,5 / 8,5
  "cs14jk177b62432b07f5d17a", // V046 : 8,5 / 8,5
  "cs14jk72ac436450535a3c29", // V047 : 8,5 / 8,5
  "cs14jk0761c9f2d885762bb5", // V049 : 8,5 / 8,5
  "cs14jk7911857c4ff09eb025", // V050 : 8,5 / 8,5
  "cs14jk76ca7ad32cce9041ce", // V055 : 8,5 / 8,5
  "cs14jkbc3334e2de46753dcf", // V058 : 8,5 / 8,5
  "cs14jk577fa779cb48fa9b55", // V060 : 8,5 / 8,5
  "cs14jk55b4243d4d1c132b97", // V064 : 8,5 / 8,5
  "cs14jkc4a2c545e132b38a92", // V066 : 8,5 / 8,5
  "cmonlkgeu000ds60wu0gazutb", // V074 : 8,5 / 8,5
  "cs14jk4f97079b992f85eeb1", // V094 : 8,5 / 8,5
  "cs14jkb9ba433a0746280280", // V096 : 8,5 / 8,5
  "cs14jkee5c537f7286c1da98", // V097 : 8,5 / 8,5
  // Pilote P0 (06/10, `docs/social/pilote-p0/resultat-p0.md`), insérées au catalogue le 07/10.
  "cp05d2c3950800b7575c12ce6", // P0-072 : 8,5 / 8,5
  "cp0465e601e49c114994d1a00", // P0-041 : 8 / 8,5, égale l'étalon Alexa en duel chez les 2
];
