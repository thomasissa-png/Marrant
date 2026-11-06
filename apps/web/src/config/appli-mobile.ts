/**
 * Origines de l'appli mobile Capacitor (`capacitor://localhost` iOS, `https://localhost` Android).
 * Sans dépendance serveur : lue par `lib/same-site.ts` (contrôle d'origine) et par l'écran
 * /resiliation (abonnement App Store détecté à l'ouverture, UX O5).
 */
export const ORIGINES_APPLI_MOBILE: readonly string[] = ["capacitor://localhost", "https://localhost"];
