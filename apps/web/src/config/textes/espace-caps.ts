/**
 * Textes des caps, des bonus et de la page « Parcours » de l'espace client (s24, lot D4 du plan
 * `docs/espace-client/plan-developpement-s24.md`). Aucun texte neuf :
 * - noms des caps, « cap n sur 5 », annonces, phrase de l'écart, « Tes bonus », « Bonus du cap N · {nom} » :
 *   `docs/espace-client/niveaux-xp-s24.md` v10.1 (3.0, 3.4, 5.4, Q10), validé par Thomas le 12/11, mot pour mot ;
 * - « Ton cap », « Ouvrir », « Fermer », noms accessibles « Ouvrir le bonus : {titre} » et « Fermer l'annonce »,
 *   « Étape n sur N », « {durée} · Facultatif » : maquettes E5 validées (`etalons/e5/parcours.html`,
 *   `bonus.html`, `docs/design/etalon-e5-s24.md` v8.1) ;
 * - « Tes 4 premières semaines », ses quatre lignes, « Les parcours » : `docs/copy/libelles-espace-e5-s24.md`
 *   (lignes 13 et 14), mot pour mot ;
 * - « Voir », « Fait », « Reprendre », « Commencer » : architecture v20 (6.1 point 8, 4.4) et libellés (2) ;
 *   « {n} sur {total} étapes » : plan, lot D4.
 * Interdits de 5.4 et critère 13 (test) : ni « verrouillé », ni « cadenas », ni « débloquer », ni « exclusif »,
 * ni « réservé », ni « il te manque », ni pourcentage, ni « XP restants », ni tiret cadratin, ni émoji.
 */
import type { NumeroCap } from "@/lib/espace/caps";

// Lot D10 : apostrophe typographique dans « Tu t’échauffes » (règle du texte visible du site,
// `typographie-s21.spec.ts`) : la carte « Ton cap » s'affiche sur `/profil`, page vérifiée par cette règle.
const NOMS: Record<NumeroCap, string> = {
  1: "Tu t’échauffes",
  2: "Tu te lances",
  3: "Tu avances bien",
  4: "Tu enchaînes",
  5: "Tu connais la maison",
};

export const TEXTES_CAPS = {
  titre: "Ton cap",
  noms: NOMS,
  /**
   * État zéro de la série dans « Ton cap » et « Ton mois » (décision de Thomas du 13/11,
   * `docs/founder-preferences.md` ; règle 3.0 point 6 de `niveaux-xp-s24.md` : pas de mot « étape »).
   * `SERIE.zero` (`parcours.ts`) reste celui du profil public, interrupteur fermé.
   */
  serieZero: "Ta série démarre à ta prochaine pratique.",
  /** Texte visible : le nom d'abord, le mot ensuite, toujours avec l'échelle (3.0 point 1). */
  capVisible: (n: NumeroCap) => `${NOMS[n]} · cap ${n} sur 5`,
  /** Texte lu (les repères sont masqués aux lecteurs d'écran). */
  capLu: (n: NumeroCap) => `${NOMS[n]}, cap ${n} sur 5`,
  /** 5.4 et Q10, mot pour mot : seulement quand le cap affiché dépasse le cap de déblocage. */
  ecart:
    "Ton cap compte tous les points gagnés depuis ton arrivée ; les bonus s'ouvrent avec tes étapes et tes bonus de parcours.",
  /** 3.0 : phrase d'XP vraie pour tout compte (critère 11). */
  xpDepuisArrivee: (xp: number) => `${xp} XP gagnés depuis ton arrivée`,
  annonce: {
    cap: (n: NumeroCap) => `Nouveau cap : ${NOMS[n]}.`,
    bonus: (titre: string) => `Un bonus s'ouvre dans la Bibliothèque : ${titre}.`,
    ouvrir: "Ouvrir",
    ouvrirLu: (titre: string) => `Ouvrir le bonus : ${titre}`,
    fermer: "Fermer",
    fermerLu: "Fermer l'annonce",
    groupe: "Annonce",
  },
  bonus: {
    raccourci: "Tes bonus",
    marque: (n: NumeroCap) => `Bonus du cap ${n} · ${NOMS[n]}`,
    duree: (minutes: number) => `${minutes} min · Facultatif`,
  },
  /**
   * Fiche bonus (maquette `bonus.html`, titres de section de l'étalon E4 « Écouter, repérer », grille de
   * l'architecture 2.4). « Les phrases citées, en texte » et « Facultatif » : [HYPOTHÈSE] de la maquette
   * v8.1, à confirmer par @copywriter avec le contenu des bonus (lot C8).
   */
  fiche: {
    titrePassage: (titre: string) => `Écouter, repérer : ${titre}`,
    avantDeLancer: "Avant de lancer la vidéo",
    lePassage: "Le passage",
    reperes: "Trois choses à repérer",
    mecanisme: "Le mécanisme",
    chezToi: "Chez toi",
    apresEcoute: "5 minutes, après l'écoute",
    citations: "Les phrases citées, en texte",
    grille: "Ta grille",
    grilleAide: "oui ou non, rien n'est enregistré",
    oui: "Oui",
    non: "Non",
  },
} as const;

export const TEXTES_PARCOURS_ESPACE = {
  semaines: {
    titre: "Tes 4 premières semaines", // (13)
    lignes: [
      { semaine: "Semaine 1 :", texte: "le faux secret, une mission à voix haute. Le parcours peut attendre." },
      { semaine: "Semaine 2 :", texte: "une étape, un mot de vocabulaire, une mission à envoyer par message." },
      { semaine: "Semaine 3 :", texte: "l'étape suivante, une séance de 20 minutes, une mission en face." },
      { semaine: "Semaine 4 :", texte: "l'étape suivante, un exercice « Écouter, repérer », une mission en face." },
    ],
    /**
     * Lot D11b (@ux D-1) : ligne 4 tant qu'aucune fiche « Écouter, repérer » n'est publiée (`ecouterPublie`).
     * Aucune version validée sans « Écouter » n'existe (`docs/copy/libelles-espace-e5-s24.md` ligne 13) :
     * la mention seule est retirée, le reste mot pour mot. [À VALIDER] par Thomas.
     */
    semaine4SansEcouter: { semaine: "Semaine 4 :", texte: "l'étape suivante, une mission en face." },
  },
  listeParcours: "Les parcours", // (14)
  /** h1 de l'abonné (lecteurs d'écran), arbitrage @ux D4 n°1 : le nom de la rubrique de la barre (« Parcours »). */
  titrePage: "Parcours",
  etapeSurTotal: (n: number, total: number) => `Étape ${n} sur ${total}`,
  /** Page d'un parcours, abonné : barre globale et liste numérotée (plan, lot D4). */
  sommaire: {
    faites: (n: number, total: number) => `${n} sur ${total} étapes`,
    voir: "Voir",
    reprendre: "Reprendre",
    commencer: "Commencer",
    fait: "Fait",
  },
} as const;
