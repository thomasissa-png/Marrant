/**
 * Textes de l'écran « Aujourd'hui » de l'espace client (s24, lot D3 du plan
 * `docs/espace-client/plan-developpement-s24.md`). Aucun texte neuf :
 * - libellés : `docs/copy/libelles-espace-e5-s24.md` (numéros entre parenthèses), mot pour mot ;
 * - titres de blocs, scène par défaut, puces : maquette validée `docs/espace-client/etalons/e5/aujourdhui.html` ;
 * - « Tu as fait le tour de celles-ci : ouvre la Bibliothèque » : architecture v20 4.4 ;
 * - question C9 et ses quatre réponses : décision de Thomas du 12/11 (`founder-preferences.md`, architecture 4.2) ;
 * - série : `SERIE` de `config/textes/parcours.ts` (validé s17), repris par import, jamais recopié ;
 * - information sous la question C9 : `docs/legal/espace-c9-information-s24.md` (@legal, porte G9), mot pour mot.
 * Contrôle automatique : zéro tiret cadratin, zéro émoji (`__tests__/espace/aujourdhui-s24.test.tsx`).
 */

export const TEXTES_AUJOURDHUI = {
  titre: "Aujourd'hui",
  premierPas: {
    eyebrow: "Ton premier pas", // (1)
    bouton: "Commencer", // (2)
    duree: (minutes: number) => `${minutes} min`, // (29)
    /** Scène par défaut, sans signal (architecture 4.2 ; E1.2 entrée 4), telle que rendue dans la maquette. */
    sceneParDefaut: "Quelqu'un te lance « Tiens, tu as changé quelque chose, non ? »",
  },
  repere: (n: number) => (n > 1 ? `${n} cartes cette semaine` : "1 carte cette semaine"), // architecture 4.4 (a)
  etape: {
    enCours: "Étape en cours", // (9)
    conseillee: "Étape conseillée", // (9)
    reprendre: "Reprendre",
    commencerEtape1: "Commencer l'étape 1",
  },
  rafale: {
    accroche:
      "La bonne réponse qui te vient en quittant la pièce : l'esprit de l'escalier. Ici, tu t'entraînes à la dire à temps.", // §3
    titre: "Si tu as 5 minutes", // (7)
    bouton: "Les cartes du jour", // (7)
    nouvelle: "Nouvelle", // (5)
    aRevoir: "À revoir", // (5)
    fini: "C'est tout pour aujourd'hui",
    /**
     * (4) : « 1 situation nouvelle, 2 cartes à revoir », singulier et variantes. Second contexte d'une
     * situation déjà vue (arbitrage @ux D5, validé par Thomas le 13/11) : « 1 autre contexte » /
     * « {n} autres contextes », jamais compté dans « situation nouvelle ».
     */
    sousTitre: (nouvelles: number, aRevoir: number, autresContextes: number = 0): string => {
      const n = nouvelles > 0 ? `${nouvelles} situation nouvelle` : "";
      const r = aRevoir > 0 ? `${aRevoir} ${aRevoir > 1 ? "cartes" : "carte"} à revoir` : "";
      const a = autresContextes > 0 ? (autresContextes > 1 ? `${autresContextes} autres contextes` : "1 autre contexte") : "";
      return [n, r, a].filter(Boolean).join(", ");
    },
  },
  jour: {
    titre: "Contenu du jour",
    vanne: "Vanne du jour",
    conseil: "Conseil du jour",
    video: "Vidéo du jour",
    toucher: "Ce soir, c'est plutôt ?",
    peuImporte: "Peu importe",
    uneAutre: "Une autre",
    geste: "À toi : ressors-la à voix haute ce soir.", // (8)
    tourFait: "Tu as fait le tour de celles-ci : ouvre la Bibliothèque",
    annonceCategorie: (categorie: string) => `Vanne affichée : ${categorie}`, // (12)
    annonceDuJour: "Vanne du jour affichée", // (12)
    annonceAutre: "Une autre vanne affichée", // (12)
    /** Repli si le contenu du jour ne se charge pas : les portes du catalogue (libellés de l'en-tête). */
    repli: { vannes: "Vannes", conseils: "Conseils", videos: "Vidéos" },
  },
  categories: {
    soiree: "Soirée",
    boulot: "Boulot",
    famille: "Famille",
    rencard: "Rencard",
  },
  mois: {
    titre: "Ton mois",
  },
  aise: {
    /** Décision C9 (12/11), posée une fois, après le premier pas. */
    question: "Où veux-tu être plus à l'aise ?",
    reponses: { POTES: "Entre potes", BOULOT: "Au boulot", PLAIRE: "Pour plaire", PARTOUT: "Partout" },
    /** Libellé (19), première phrase : la seconde (« Ton texte est toujours là. ») ne vaut pas ici. */
    echec: "L'enregistrement n'a pas abouti.",
    /**
     * Information RGPD sous la question (@legal, `docs/legal/espace-c9-information-s24.md`, « Phrase à
     * afficher sous la question »), mot pour mot. Sans la variante « Pour la changer, écris à… » (au choix
     * du fondateur, non tranché). Draft à faire valider par un avocat avant ouverture.
     */
    information:
      "Ta réponse sert à choisir les situations qu'on te propose. Elle reste sur ton compte, et elle est effacée si tu supprimes ton compte.",
  },
} as const;
