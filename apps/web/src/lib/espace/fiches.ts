/**
 * Chargeurs des fiches neuves de l'espace client (s24, lot D1 du plan
 * `docs/espace-client/plan-developpement-s24.md` §3).
 *
 * - Contenu en fichiers (`src/data/espace/*.json`), validé par `fiches-schema.ts` au premier
 *   appel (jamais au chargement du module : un fichier invalide ne casse que l'espace).
 * - Tout retour passe par `fichesSelonPlan` (`lib/champs-premium.ts`) : un compte qui n'est
 *   pas abonné actif (accès lu EN BASE par `lib/espace/garde.ts`) ne reçoit aucune fiche.
 * - Un bonus de cap n'est dans AUCUNE liste (3.13) : `listerFiches` et `trouverFiche` ne le
 *   voient jamais ; seuls `bonusOuverts` et `trouverBonus` le servent, cap atteint.
 * - Importé seulement par `/mon-espace` et `api/espace` (404 interrupteur fermé). Les
 *   fixtures de `lib/espace/fixtures/` ne sont jamais importées ici (test).
 */
import type { AccesEspace } from "@/lib/espace/garde";
import { fichesSelonPlan } from "@/lib/champs-premium";
import {
  FICHIERS_ESPACE,
  validerBonus,
  validerFichier,
  type Fiche,
  type FicheBonus,
  type TypeFiche,
} from "@/lib/espace/fiches-schema";
import situations from "@/data/espace/situations.json";
import constructions from "@/data/espace/constructions.json";
import vocabulaire from "@/data/espace/vocabulaire.json";
import formules from "@/data/espace/formules.json";
import ecouter from "@/data/espace/ecouter.json";
import aPlat from "@/data/espace/a-plat.json";
import jeux from "@/data/espace/jeux.json";
import bilans from "@/data/espace/bilans.json";
import seances from "@/data/espace/seances.json";
import humourNoir from "@/data/espace/humour-noir.json";
import bonus from "@/data/espace/bonus.json";

type NomFichier = keyof typeof FICHIERS_ESPACE;
export type SourcesFiches = { fiches: Record<NomFichier, unknown>; bonus: unknown };
export type FicheDeType<T extends TypeFiche> = Extract<Fiche, { type: T }>;

interface Contenu {
  parType: Map<TypeFiche, Fiche[]>;
  parId: Map<string, Fiche>;
  bonus: FicheBonus[];
}

function valider(sources: SourcesFiches): Contenu {
  const parType = new Map<TypeFiche, Fiche[]>();
  const parId = new Map<string, Fiche>();
  for (const nom of Object.keys(FICHIERS_ESPACE) as NomFichier[]) {
    const type = FICHIERS_ESPACE[nom];
    const fiches = validerFichier(type, sources.fiches[nom]);
    parType.set(type, fiches);
    for (const f of fiches) {
      if (parId.has(f.id)) throw new Error(`Fiche de l'espace : id en double entre fichiers (${f.id})`);
      parId.set(f.id, f);
    }
  }
  const lesBonus = validerBonus(sources.bonus);
  for (const b of lesBonus) {
    if (parId.has(b.id)) throw new Error(`Bonus de cap présent dans une liste de fiches (${b.id})`);
  }
  return { parType, parId, bonus: lesBonus };
}

const abonneActif = (acces: AccesEspace) => acces.acces === "ouvert";

/** Fabrique de chargeurs ; la production utilise `chargeursFiches`, les tests leurs fixtures. */
export function creerChargeurs(sources: SourcesFiches) {
  let cache: Contenu | null = null;
  const contenu = () => (cache ??= valider(sources));
  /** Bonus ouverts : cap atteint par les XP d'étapes et de bonus de fin (3.13, Q10). */
  const bonusOuverts = (capAtteint: number, acces: AccesEspace): FicheBonus[] =>
    fichesSelonPlan(
      contenu().bonus.filter((b) => b.cap <= capAtteint),
      abonneActif(acces),
    );

  return {
    /** Fiches d'un type, dans l'ordre du fichier ; liste vide hors abonné actif. */
    listerFiches<T extends TypeFiche>(type: T, acces: AccesEspace): FicheDeType<T>[] {
      const fiches = (contenu().parType.get(type) ?? []) as FicheDeType<T>[];
      return fichesSelonPlan(fiches, abonneActif(acces));
    },
    /** Une fiche par son id stable ; jamais un bonus ; null hors abonné actif. */
    trouverFiche(id: string, acces: AccesEspace): Fiche | null {
      const fiche = contenu().parId.get(id);
      return fichesSelonPlan(fiche ? [fiche] : [], abonneActif(acces))[0] ?? null;
    },
    /** Bonus ouverts : cap atteint par les XP d'étapes et de bonus de fin (3.13, Q10). */
    bonusOuverts,
    /** Un bonus non ouvert est introuvable, comme une adresse inexistante (3.13). */
    trouverBonus(id: string, capAtteint: number, acces: AccesEspace): FicheBonus | null {
      return bonusOuverts(capAtteint, acces).find((b) => b.id === id) ?? null;
    },
  };
}

/** Sources servies en production : uniquement `src/data/espace/*.json`. */
export const SOURCES_SERVIES: SourcesFiches = {
  fiches: {
    situations,
    constructions,
    vocabulaire,
    formules,
    ecouter,
    "a-plat": aPlat,
    jeux,
    bilans,
    seances,
    "humour-noir": humourNoir,
  },
  bonus,
};

export const chargeursFiches = creerChargeurs(SOURCES_SERVIES);
