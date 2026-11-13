/**
 * Textes de l'écran « Mes répliques » et de la ligne sous « Ce soir, c'est plutôt ? » (s24, lot D5).
 * Aucun texte neuf : libellés validés `docs/copy/libelles-espace-e5-s24.md` (numéro entre parenthèses),
 * état vide : architecture v20 2.7 (validé), maquette `docs/espace-client/etalons/e5/mes-repliques.html`.
 * Titre : la ligne du menu « Plus » (`espace-navigation.ts`), reprise par import.
 */
import { TEXTES_ESPACE_NAVIGATION } from "@/config/textes/espace-navigation";
import { TEXTES_GESTE } from "@/config/textes/espace-cartes";

export const TEXTES_REPLIQUES = {
  titre: TEXTES_ESPACE_NAVIGATION.menuPlus.mesRepliques,
  vide: "Tu n'as pas encore écrit de réplique. Elles apparaissent ici.", // 2.7
  modifier: "Modifier", // (28)
  annuler: "Annuler", // (28)
  supprimer: TEXTES_GESTE.note.supprimer,
  enregistrer: TEXTES_GESTE.note.enregistrer,
  confirmer: TEXTES_GESTE.note.confirmer,
  supprimee: TEXTES_GESTE.note.supprimee,
  echec: TEXTES_GESTE.note.echec,
  label: TEXTES_GESTE.note.label,
  lectureSeule: "Tes répliques sont gardées. Tu peux les relire et les supprimer.", // (28)
  /** (28) : catégorie en minuscule (« soirée », « boulot », « famille », « rencard »). */
  pourCategorie: (categorie: string) => `Tes répliques à toi pour ${categorie.toLowerCase()}`,
  monProfil: "Mon profil", // (v6)
} as const;
