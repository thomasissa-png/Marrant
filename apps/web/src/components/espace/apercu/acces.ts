/**
 * Accès d'une rubrique Premium de la bande (nav v6 §2) : le visiteur et l'inscrit gratuit voient l'aperçu de la
 * rubrique À LA MÊME ADRESSE, sans redirection. Tous les autres comptes passent par la garde d'avant
 * (`garderEspace`), appelée ensuite par la page et le layout : l'abonné actif voit la rubrique ; l'ancien abonné
 * garde son arrivée sur `/abonnement` avec ses lignes « historique gardé » (architecture 2.6, non visé par la
 * spec v6, qui ne connaît que visiteur, inscrit gratuit et abonné).
 *
 * Interrupteur fermé : `notFound()` AVANT toute lecture (même ordre que `garderEspace`), la vraie 404.
 * Plan relu EN BASE (`lireAccesEspace`), jamais dans le jeton. Mis en cache le temps de la requête : la tête,
 * le layout et la page lisent la session une fois.
 * Les autres adresses de l'espace (fiches, bonus, fils de questions, lettres) ne passent jamais ici.
 */
import * as React from "react";
import { notFound } from "next/navigation";
import { ESPACE_ACCUEIL, ESPACE_CLIENT_PUBLIE } from "@/config/espace-client";
import { lireAccesEspace } from "@/lib/espace/garde";
import type { RubriqueApercu } from "@/config/textes/espace-apercu";

/** Lecteur qui reçoit l'aperçu ; `null` : la garde décide (abonné actif ou ancien abonné). */
export type LecteurApercu = "visiteur" | "gratuit" | null;

/** Adresse de chaque rubrique Premium qui a un aperçu (Parcours : la page publique `/parcours` l'est déjà). */
export const ADRESSES_APERCU: Record<RubriqueApercu, string> = {
  aujourdhui: ESPACE_ACCUEIL,
  quoiRepondre: `${ESPACE_ACCUEIL}/quoi-repondre`,
  bibliotheque: `${ESPACE_ACCUEIL}/bibliotheque`,
  sEntrainer: `${ESPACE_ACCUEIL}/s-entrainer`,
  mesQuestions: `${ESPACE_ACCUEIL}/questions`,
  mesRepliques: `${ESPACE_ACCUEIL}/repliques`,
  /** Hors `/mon-espace` : sa page passe par `components/espace/apercu/favoris-ouvert.tsx`, jamais par le layout. */
  favoris: "/favoris",
};

const ADRESSES = new Set(Object.values(ADRESSES_APERCU).filter((a) => a === ESPACE_ACCUEIL || a.startsWith(`${ESPACE_ACCUEIL}/`)));

/** Vrai pour l'adresse exacte d'une rubrique à aperçu de `/mon-espace` (paramètres et ancre ignorés). */
export function estAdresseApercu(chemin: string | null | undefined): boolean {
  if (!chemin) return false;
  return ADRESSES.has(chemin.split(/[?#]/)[0]);
}

/**
 * s26 liste et détail : adresse d'une fiche de Quoi répondre (`/mon-espace/quoi-repondre/[id]`). Visiteur et inscrit
 * gratuit n'y voient jamais de fiche ni de 404 : le layout de la rubrique les renvoie (307) vers l'aperçu de la liste.
 */
export function estFicheQuoiRepondre(chemin: string | null | undefined): boolean {
  if (!chemin) return false;
  return /^\/mon-espace\/quoi-repondre\/[^/]+\/?$/.test(chemin.split(/[?#]/)[0]);
}

// `cache` existe dans le React de Next (serveur) ; absent du React 18 de Jest : lecture simple, même résultat.
const parRequete: <T extends () => Promise<unknown>>(f: T) => T = React.cache ?? ((f) => f);

export const lireLecteurApercu = parRequete(async (): Promise<LecteurApercu> => {
  if (!ESPACE_CLIENT_PUBLIE) notFound();
  const acces = await lireAccesEspace();
  if (acces.acces === "connexion") return "visiteur";
  if (acces.acces === "abonnement" && !acces.ancienAbonne) return "gratuit";
  return null;
});
