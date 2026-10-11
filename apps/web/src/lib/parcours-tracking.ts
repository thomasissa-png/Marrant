/**
 * Provenance d'une ouverture de parcours (data-analyst §5.1 et §5.3) : lue
 * dans `?src=` côté navigateur (la page reste en cache ISR). Liste fermée :
 * toute autre valeur devient `direct` (avis @legal s17, aucune donnée libre).
 */
export const PARCOURS_SRC = [
  "hub",
  "blog",
  "accueil",
  "header",
  "onboarding",
  "suite",
  "liens",
  // Liens d'entrée du lot C (s17) : quiz humour, fiches catalogue, offre, profil.
  "quiz",
  "fiche",
  "abonnement",
  "profil",
  // Lien de l'e-mail de rappel (lot A, D7).
  "rappel",
  "direct",
] as const;

export type ParcoursSrc = (typeof PARCOURS_SRC)[number];

export function normalizeParcoursSrc(raw: string | null | undefined): ParcoursSrc {
  const value = (raw ?? "").trim().toLowerCase();
  return (PARCOURS_SRC as readonly string[]).includes(value) ? (value as ParcoursSrc) : "direct";
}

export function readParcoursSrc(): ParcoursSrc {
  if (typeof window === "undefined") return "direct";
  try {
    return normalizeParcoursSrc(new URLSearchParams(window.location.search).get("src"));
  } catch {
    return "direct";
  }
}
