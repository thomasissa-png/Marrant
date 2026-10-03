/**
 * Fixture du carnet mensuel (tests) : indépendante du contenu réel de
 * src/data/carnet/. Chaque champ réservé porte un marqueur unique pour
 * détecter toute fuite dans une vue non Premium ou dans le HTML.
 */
import type { Carnet, CarnetFiche } from "@/lib/carnet";

export const SECRET_FIELDS = [
  "situation",
  "onTeDit",
  "reponse",
  "pourquoi",
  "siTendu",
  "exercice",
] as const satisfies readonly (keyof CarnetFiche)[];

function fiche(mois: string, n: number): CarnetFiche {
  const tag = `${mois}-F${n}`;
  return {
    id: `${mois}-${n}`,
    titre: `Titre ${tag}`,
    contexte: `Contexte ${tag}`,
    situation: `SITUATION_SECRETE_${tag}`,
    onTeDit: `ON_TE_DIT_SECRET_${tag}`,
    reponse: `REPONSE_SECRETE_${tag}`,
    pourquoi: `POURQUOI_SECRET_${tag}`,
    siTendu: `SI_TENDU_SECRET_${tag}`,
    exercice: `EXERCICE_SECRET_${tag}`,
  };
}

function carnet(mois: string, count: number): Carnet {
  return {
    mois,
    titre: `Carnet ${mois}`,
    intro: `Intro ${mois}`,
    fiches: Array.from({ length: count }, (_, i) => fiche(mois, i + 1)),
  };
}

export const CARNET_FIXTURES: Carnet[] = [
  carnet("2026-09", 3),
  carnet("2026-11", 4),
  carnet("2026-10", 5),
];
