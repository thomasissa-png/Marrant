/**
 * Textes des cartes de la rafale, du geste d'une fiche et des missions (s24, lot D5 du plan
 * `docs/espace-client/plan-developpement-s24.md`). Aucun texte neuf :
 * - libellés validés : `docs/copy/libelles-espace-e5-s24.md` (numéro entre parenthèses), mot pour mot ;
 * - textes de carte, du geste et de la note : maquettes validées `docs/espace-client/etalons/e5/carte-rafale.html`
 *   et `mission.html` (étalon E5 v7.1), elles-mêmes reprises de l'étalon E1.1 et de l'architecture v20 (2.2, 2.4, 2.7) ;
 * - « Ta première phrase d'abord » : architecture v20 2.2 (prises de parole courtes).
 * Les guillemets de premier niveau « » font partie du texte affiché. Contrôle automatique : zéro tiret
 * cadratin, zéro émoji (`__tests__/espace/cartes-s24.test.ts`).
 */
import { TEXTES_AUJOURDHUI } from "@/config/textes/espace-aujourdhui";

export const TEXTES_CARTES = {
  /** Titre collé de la rafale, « Si tu as 5 minutes » (7), repris d'« Aujourd'hui ». */
  eyebrow: TEXTES_AUJOURDHUI.rafale.titre,
  nouvelle: TEXTES_AUJOURDHUI.rafale.nouvelle, // (5)
  aRevoir: TEXTES_AUJOURDHUI.rafale.aRevoir, // (5)
  fini: TEXTES_AUJOURDHUI.rafale.fini,
  accroche: TEXTES_AUJOURDHUI.rafale.accroche, // §3
  scene: "La scène",
  contexte: "Le contexte",
  reponseDabord: "Ta réponse d'abord",
  premierePhraseDabord: "Ta première phrase d'abord",
  consigne: "Avant de lire la suite, dis ta réponse à voix haute, ou dans ta tête : ça compte aussi. Rien n'est noté.",
  prendsTonTemps: "Prends ton temps",
  question: "Tu avais une réponse ?",
  reponses: { OUI: "Oui", MOITIE: "À moitié", RIEN: "Rien" },
  /** (17) : « Oui » n'a aucune ligne. */
  regle: (jours: number) => `Cette carte reviendra dans ${jours} jours.`,
  laquelle: "Ici, tu sors laquelle ?", // (16)
  registres: { sure: "La sûre", joueuse: "La joueuse", risquee: "La risquée" },
  /** « Ici : la joueuse. » (maquette, règle de la carte). */
  ici: (registre: string) => `Ici : ${registre.toLowerCase()}.`,
  repliqueDerniereFois: "Ta réplique la dernière fois : ",
  ambiances: { detendue: "détendue", tendue: "tendue" },
  pourquoi: "Le pourquoi",
  echec: "L'enregistrement n'a pas abouti.", // (19), première phrase
} as const;

/** Geste d'une fiche, son retour et « Ma réplique à moi » (maquette `carte-rafale.html`, 2.7). */
export const TEXTES_GESTE = {
  aToi: "À toi",
  tonRetour: "Ton retour", // (18)
  retours: { "pas-essaye": "Pas essayé", "essaye-bof": "Essayé, bof", "essaye-ca-a-marche": "Essayé, ça a marché" },
  fait: "Fait",
  note: {
    label: "Ma réplique à moi",
    placeholder: "Écris ta version, en une phrase",
    enregistrer: "Enregistrer",
    reessayer: "Réessayer",
    supprimer: "Supprimer", // (19)
    annuler: "Annuler", // (19)
    enregistree: "Enregistrée",
    supprimee: "Supprimée", // (19)
    confirmer: "Supprimer cette réplique ?", // (19)
    echec: "L'enregistrement n'a pas abouti. Ton texte est toujours là.", // (19)
    /** (19) : « {n} / {max} caractères » une fois le plafond fixé. */
    compteur: (n: number, max: number) => `${n} / ${max} caractères`,
  },
} as const;

/** Missions en 5 marches (2.4) : libellés (25) et (26), maquette `mission.html`. */
export const TEXTES_MISSION = {
  titre: "Mission",
  marche: (n: number) => `Marche ${n}`, // (25), sans total
  titresMarches: {
    1: "À voix haute, sans public",
    2: "À un proche, par message",
    3: "À un pote, en face",
    4: "Dans un petit groupe",
    5: "Avec quelqu'un que tu connais peu",
  } as Record<1 | 2 | 3 | 4 | 5, string>,
  facultative: "Facultative", // (25)
  voirLaMarche: (n: number) => `Voir la marche ${n}`, // (26)
  autreSituation: "Une autre situation, même marche", // (26)
  aPlat: "Quand ça tombe à plat",
  raconte: "Raconte-nous ce qui s'est passé",
} as const;
