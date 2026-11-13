/**
 * Coin « Humour noir, fait bien » (s24, lot D6 ; architecture v20 3.12, décision C12 ; étalon E6).
 *
 * Choix @fullstack (plan lot D6, « filtre côté navigateur ou témoin lu par le serveur ») : un TÉMOIN lu
 * par le serveur, le cookie `COOKIE_COIN`, posé et retiré seulement par `api/espace/humour-noir` (geste
 * « Entrer », bouton « Sortir »). Il est gardé dans le navigateur (aucune donnée de compte, aucune
 * écriture en base), HttpOnly, et il suffit au serveur pour ne rien envoyer avant le geste : le contenu
 * du coin n'est ni dans le HTML ni dans une réponse d'API tant que le navigateur n'est pas « entré ».
 *
 * Vannes repérées (`Joke.humourNoir`, lot D3) : jamais dans la vanne du jour, le toucher ni la rafale
 * (`lib/espace/vanne.ts`, `api/daily`) ; pour un abonné dont le navigateur n'est pas entré, absentes aussi
 * de la recherche de l'en-tête et des favoris (`filtreHumourNoir`, appelé par `api/search` et
 * `api/favorites`, interrupteur ouvert seulement). Le catalogue public (`/vannes`, ses thèmes), hors
 * espace, reste ce qu'il est (critère 11) : c'est pourquoi la promesse n'est pas écrite (porte G6).
 */
import type { Prisma } from "@prisma/client";
import { ESPACE_CLIENT_PUBLIE } from "@/config/espace-client";

export const COOKIE_COIN = "dm_coin_humour_noir";
export const VALEUR_ENTREE = "entre";
/** Un an : l'état « entré » se garde jusqu'à « Sortir » (ou effacement du navigateur). */
export const DUREE_COIN_SECONDES = 365 * 86_400;

/**
 * Porte G6 : la promesse « l'espace n'affiche jamais ce contenu sans le geste « Entrer » » n'est écrite que
 * si le repérage couvre TOUTES les vannes d'humour noir actives ET si la liste « Vannes » de la
 * Bibliothèque les cache. Ni l'un ni l'autre aujourd'hui (repérage au chantier, liste = page publique) :
 * `false`, aucun texte de promesse n'est rendu. Le passer à `true` est un commit séparé, sur go de Thomas.
 */
export const PROMESSE_ECRITE = false;

/** Le navigateur est-il « entré » ? (valeur brute du cookie) */
export function coinEntre(valeur: string | undefined | null): boolean {
  return valeur === VALEUR_ENTREE;
}

/**
 * Filtre des vannes servies à un abonné (recherche, favoris) : sans le geste « Entrer », aucune vanne
 * repérée. Interrupteur fermé, visiteur, compte FREE : aucun filtre (réponses d'aujourd'hui, inchangées).
 */
export function filtreHumourNoir(estAbonne: boolean, lireCookie: () => string | undefined | null): Prisma.JokeWhereInput {
  // Le témoin n'est lu qu'interrupteur ouvert et pour un abonné (fermé : aucune lecture de plus).
  if (!ESPACE_CLIENT_PUBLIE || !estAbonne || coinEntre(lireCookie())) return {};
  return { humourNoir: false };
}

/** Garde un favori : une vanne repérée n'est rendue que si le filtre l'autorise. */
export function favoriAutorise(joke: { humourNoir?: boolean } | null | undefined, filtre: Prisma.JokeWhereInput): boolean {
  return !(filtre.humourNoir === false && joke?.humourNoir === true);
}
