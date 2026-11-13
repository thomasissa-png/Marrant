/**
 * Interrupteur de l'espace client Premium (s24, lot D0 du plan
 * `docs/espace-client/plan-developpement-s24.md`, règle commune n°1).
 *
 * `false` (fermé) : toute page `/mon-espace/**` répond la vraie 404 du site
 * (`notFound()` dans le layout ET dans la garde de chaque page), toute route
 * `api/espace/**` répond 404 JSON avant toute lecture ou écriture en base, aucun
 * composant de l'espace n'est monté, les arrivées après connexion et après
 * paiement restent celles d'aujourd'hui (`lib/espace/arrivee.ts`). Les pages
 * publiques (`/profil`, `/parcours`, `/favoris`, en-tête, pied de page) sont
 * celles de la production, octet pour octet (test d'inertie).
 * `true` (ouvert) : l'espace est servi aux abonnés actifs (plan relu en base).
 *
 * Activation : un seul déploiement « tout d'un coup », sur go écrit de Thomas
 * (plan §7, lot D12) : passer à `true`, commit, déploiement. Voir REPLIT_ACTIONS.md
 * (entrée « À DÉPLOYER (s24) »). Module sans dépendance : importable côté client.
 */
export const ESPACE_CLIENT_PUBLIE: boolean = false;

/** « Aujourd'hui », page d'accueil de l'espace (architecture v20, décision C14). */
export const ESPACE_ACCUEIL = "/mon-espace";

/** Destination des comptes sans abonnement actif, ancien abonné compris (règle existante, brief §3.8). */
export const ESPACE_REDIRECTION_SANS_ABONNEMENT = "/abonnement";

/** Préfixe des routes d'API de l'espace (404 JSON interrupteur fermé). */
export const ESPACE_API_PREFIXE = "/api/espace/";

/**
 * Lot D11b (Q-1) : en-tête de requête posé par le middleware, interrupteur ouvert seulement, avec
 * l'adresse demandée sous `/mon-espace` (chemin + paramètres). Le layout de l'espace n'a pas accès
 * à l'adresse dans Next 14 : sans lui, le retour de connexion retombait sur « Aujourd'hui ».
 * Toujours réécrit par le middleware (une valeur envoyée par le navigateur est remplacée) et
 * repassé par `sanitizeCallbackUrl` dans la garde.
 */
export const EN_TETE_CHEMIN_ESPACE = "x-marrant-chemin-espace";
