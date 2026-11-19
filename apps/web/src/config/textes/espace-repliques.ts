/**
 * Textes de l'écran « Mes répliques » et de la ligne sous « Ce soir, c'est plutôt ? » (s24, lot D5).
 * Aucun texte neuf : libellés validés `docs/copy/libelles-espace-e5-s24.md` (numéro entre parenthèses),
 * état vide : architecture v20 2.7 (validé), maquette `docs/espace-client/etalons/e5/mes-repliques.html`.
 * Titre : la ligne de l'index de « Mon espace » (`espace-navigation.ts`), reprise par import.
 */
import { TEXTES_ESPACE_NAVIGATION } from "@/config/textes/espace-navigation";
import { TEXTES_GESTE } from "@/config/textes/espace-cartes";

export const TEXTES_REPLIQUES = {
  titre: TEXTES_ESPACE_NAVIGATION.index.mesRepliques,
  vide: "Tu n'as pas encore écrit de réplique. Elles apparaissent ici.", // 2.7
  /** Relecture des captures nav s24 (ux F5) : sortie de l'état vide, vers « Quoi répondre ». Libellé validé par Thomas le 14/11. */
  ecrirePremiere: "Écrire ma première réplique",
  /** s26 (`docs/ux/questions-repliques-lettre-profil-s26.md` §2.2, emplacement `LIEN_AUTRE_REPLIQUE`) : lien de l'en-tête quand l'abonné a déjà des répliques. */
  // À VALIDER PAR THOMAS (s26), reco @copywriter, voir docs/copy/promesses-apercus-s26.md
  ecrireProchaine: "Écrire ma prochaine réplique",
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
