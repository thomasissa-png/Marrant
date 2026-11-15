/**
 * Fiche réelle montrée par chaque page d'aperçu (nav v6, recommandation 2 validée par Thomas le 15/11 :
 * « la première fiche réelle de chaque rubrique, liste à confirmer, rien d'inventé »).
 *
 * Identifiants FIGÉS ici (et non « la première du fichier » recalculée à chaque build) : une fiche ajoutée en
 * tête d'un fichier ne change pas l'aperçu sans l'accord de Thomas. Liste à confirmer :
 * `docs/espace-client/travail-en-cours/apercus-fiches-a-confirmer.md`.
 * - Aujourd'hui : la situation du premier pas par défaut (`ENTREE_PAR_DEFAUT`), première fiche que voit un abonné ;
 * - Quoi répondre : première situation de `situations.json` ;
 * - Bibliothèque : première fiche listée (« Écouter, repérer » est vide) : première de `constructions.json` ;
 * - S'entraîner : première fiche de ses types (jeu, séance) : première de `jeux.json` ;
 * - Mes répliques : la consigne « À toi » de la première situation, là où s'écrit une réplique (aucune
 *   réplique d'abonné n'est montrée ni inventée) ;
 * - Mes questions : aucune fiche ; l'état « Mes envois » sans envoi, déjà validé (`EtatVideQuestions`) ;
 * - Favoris : aucune fiche ; l'état vide existant de la page (`TEXTES_APERCU.favorisVide`).
 * Lecture directe des fichiers validés (`validerFichier`), hors chargeurs de l'abonné : ces trois fiches sont
 * publiques par nature dès qu'elles sont ici. Jamais une reprise de lettre (contrôlé par le test).
 */
import situations from "@/data/espace/situations.json";
import constructions from "@/data/espace/constructions.json";
import jeux from "@/data/espace/jeux.json";
import { validerFichier, type Fiche, type TypeFiche } from "@/lib/espace/fiches-schema";
import { ENTREE_PAR_DEFAUT } from "@/lib/espace/premier-pas";
import type { RubriqueApercu } from "@/config/textes/espace-apercu";

type FicheApercu = { type: Extract<TypeFiche, "situation" | "construction" | "jeu">; id: string };

export const FICHES_APERCU: Record<Exclude<RubriqueApercu, "mesQuestions" | "favoris">, FicheApercu> = {
  aujourdhui: { type: "situation", id: ENTREE_PAR_DEFAUT },
  quoiRepondre: { type: "situation", id: "coloc-la-poele" },
  bibliotheque: { type: "construction", id: "le-faux-secret" },
  sEntrainer: { type: "jeu", id: "quelle-replique-1" },
  mesRepliques: { type: "situation", id: "coloc-la-poele" },
};

const SOURCES: Record<FicheApercu["type"], unknown> = { situation: situations, construction: constructions, jeu: jeux };

/** La fiche d'aperçu d'une rubrique ; lève une erreur si l'identifiant a disparu des données. */
export function ficheApercu(rubrique: keyof typeof FICHES_APERCU): Fiche {
  const { type, id } = FICHES_APERCU[rubrique];
  const fiche = validerFichier(type, SOURCES[type]).find((f) => f.id === id);
  if (!fiche) throw new Error(`Aperçu ${rubrique} : fiche ${type} « ${id} » introuvable`);
  return fiche;
}
