/**
 * Applications dont le navigateur intégré bloque Google (erreur
 * `disallowed_useragent`) : le bouton Google y est désactivé sur /register et
 * /login (stratégie v5 §2.4). Une application où Google fonctionne le garde
 * actif. Valeurs à confirmer par le test sur appareil (v5 §2.6) et à corriger
 * ici seulement (une ligne par application).
 *
 * [HYPOTHÈSE : Instagram, Facebook et LinkedIn ouvrent les liens dans une vue
 * web intégrée, que Google refuse ; X ouvre un onglet système (Safari View
 * Controller sur iOS, onglet personnalisé Chrome sur Android) où Google
 * fonctionne. À reproduire sur appareil avant le J0 de chaque réseau.]
 */
export const GOOGLE_BLOQUE_PAR_APP = {
  instagram: true,
  facebook: true,
  linkedin: true,
  x: false,
} as const;

export type InAppName = keyof typeof GOOGLE_BLOQUE_PAR_APP;
