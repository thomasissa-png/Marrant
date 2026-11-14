import { FINE, NBSP, frEspace } from "@/lib/fr-typo";

/**
 * Texte attendu tel que le lit Testing Library dans l'espace : la typographie d'affichage (`frEspace` :
 * apostrophes et guillemets de premier niveau), espaces insécables ramenées à des espaces ordinaires comme le
 * fait le normaliseur par défaut des requêtes par texte (relecture des captures nav s24).
 */
const INSECABLES = new RegExp(`[${FINE}${NBSP}]`, "g");
export const apo = (texte: string): string => frEspace(texte).replace(INSECABLES, " ");
