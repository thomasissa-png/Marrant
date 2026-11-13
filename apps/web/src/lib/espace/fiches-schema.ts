/**
 * Schéma des fiches neuves de l'espace client (s24, lot D1 du plan
 * `docs/espace-client/plan-developpement-s24.md` §3 ; types de fiches :
 * `docs/espace-client/audit-contenu/architecture-contenu-v20.md` section 3, anatomie 2.7,
 * missions et grille 2.4, bonus des caps 3.13).
 *
 * Le contenu vit en fichiers (`src/data/espace/*.json`, un fichier par type), validés ici
 * avant d'être servis par `lib/espace/fiches.ts`. Les textes sont stockés SANS les guillemets
 * extérieurs « » (l'écran les pose) ; les guillemets intérieurs “ ” restent dans le texte.
 * Les champs internes (vérification des citations, emploi attesté) ne sont jamais affichés.
 */
import { z } from "zod";

/** Types de fiches (noms de travail internes, architecture 3.1 et 3.2), dans l'ordre du tableau 3.2. */
export const TYPES_FICHE = [
  "situation",
  "construction",
  "vocabulaire",
  "formule",
  "ecouter",
  "a-plat",
  "jeu",
  "bilan",
  "seance",
  "humour-noir",
] as const;
export type TypeFiche = (typeof TYPES_FICHE)[number];

/** Univers « Où et avec qui ? » des situations (architecture 3.3, tableau des 60). */
export const UNIVERS = [
  "coloc",
  "soiree",
  "amis",
  "famille",
  "couple",
  "rencontre",
  "boulot",
  "reunion-entretien",
  "etudes-fac",
  "messages-groupes",
  "prise-de-parole",
  "commerces-voisins-transports",
] as const;

/** Filtre « Pour quoi faire ? » (architecture 3.3). */
export const POUR_QUOI_FAIRE = [
  "desamorcer",
  "repondre-chambrage",
  "relancer-conversation",
  "rattraper-faux-pas",
  "prendre-la-parole",
] as const;

export const PALIERS = ["P1", "P2", "P3"] as const;

/** Gestes (architecture 3.2, colonne « Geste »). */
export const VERBES_GESTE = ["choisir", "dire", "tenter", "ecrire", "reconnaitre", "placer", "reperer", "faire"] as const;
export type VerbeGeste = (typeof VERBES_GESTE)[number];

/** Gestes admis par type (tableau 3.2). Un type présent ici finit par un geste : sa fiche DOIT le porter. */
export const GESTES_PAR_TYPE: Record<TypeFiche, readonly VerbeGeste[]> = {
  situation: ["choisir", "dire", "tenter"],
  construction: ["ecrire"],
  vocabulaire: ["reconnaitre", "placer"],
  formule: ["ecrire"],
  ecouter: ["reperer", "ecrire"],
  "a-plat": ["choisir"],
  jeu: ["choisir", "ecrire"],
  bilan: ["choisir", "dire"],
  seance: ["faire"],
  "humour-noir": ["choisir", "dire", "ecrire"],
};

/** Volumes V1 de fiches neuves par type (tableau 3.2) : 163 au total. Les 4 bonus sont comptés à part. */
export const VOLUMES_V1: Record<TypeFiche, number> = {
  situation: 60,
  construction: 12,
  vocabulaire: 8,
  formule: 12,
  ecouter: 12,
  "a-plat": 10,
  jeu: 30,
  bilan: 5,
  seance: 6,
  "humour-noir": 8,
};
export const VOLUME_BONUS = 4;

const texte = z.string().trim().min(1);
const REPLIQUES = ["sure", "joueuse", "risquee"] as const;

/** Identifiant stable : jamais changé une fois en ligne (favoris, « Fait », répliques s'y rattachent). */
export const idFiche = z
  .string()
  .max(80)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "id stable attendu : minuscules, chiffres et tirets");

/** Le geste de fin de fiche, « À toi » (anatomie 2.7, point 5 ; grille 2.4). */
export const gesteSchema = z
  .object({
    verbe: z.enum(VERBES_GESTE),
    consigne: texte,
    /** Marche de mission (2.4), de 1 (seul, à voix haute) à 5 (quelqu'un qu'on connaît peu). */
    marche: z.number().int().min(1).max(5).optional(),
    pourAllerPlusLoin: texte.optional(),
    /** Grille d'auto-contrôle : 3 questions oui ou non, rien d'enregistré (2.4). */
    grille: z.tuple([texte, texte, texte]).optional(),
  })
  .strict();

const minuteSeconde = z.object({ minute: z.number().int().min(0), seconde: z.number().int().min(0).max(59) }).strict();
const enSecondes = (m: z.infer<typeof minuteSeconde>) => m.minute * 60 + m.seconde;

const blocSchema = z.object({ titre: texte, texte }).strict();

/** Champs communs (anatomie 2.7) : titre, accroche, deux liens au plus, durée, palier, geste. */
const commun = {
  id: idFiche,
  titre: texte,
  accroche: texte.optional(),
  palier: z.enum(PALIERS),
  dureeMinutes: z.number().int().min(1).max(30),
  geste: gesteSchema.optional(),
  /** Deux liens vers le catalogue au plus, chemins internes. */
  liens: z.array(z.string().regex(/^\/[^\s]*$/, "chemin interne attendu")).max(2).optional(),
  /**
   * Lot D6 (architecture 2.8) : reprise d'une lettre, par son numéro (`NewsletterIssue.periodKey`,
   * « 2026-W46 » ou « 2026-11 »). La fiche n'est servie nulle part avant l'envoi de cette lettre.
   */
  repriseDeLettre: z.string().regex(/^\d{4}-(?:W\d{2}|\d{2})$/, "numéro de lettre attendu").optional(),
};

const repliqueSchema = z.object({ texte, pourquoi: texte }).strict();
const repliquesSchema = z.object({ sure: repliqueSchema, joueuse: repliqueSchema, risquee: repliqueSchema }).strict();

/** Un contexte de rafale : une seule bonne réponse (un seul registre), et pourquoi. */
export const contexteRafaleSchema = z.object({ contexte: texte, bonneReponse: z.enum(REPLIQUES), pourquoi: texte }).strict();

/** Corps d'une situation « Quoi répondre » (3.3), aussi celui des situations d'humour noir (3.12). */
const corpsSituation = {
  /** `premiere-phrase` : prise de parole courte, « Ta première phrase d'abord » (2.2). */
  forme: z.enum(["reponse", "premiere-phrase"]).default("reponse"),
  /** `suite` (lot D5) : la phrase qui suit la pique dans la scène (E1.1 : « Jeudi, c'était pâtes. »). */
  scene: z.object({ texte, onTeDit: texte.optional(), suite: texte.optional() }).strict(),
  repliques: repliquesSchema,
  /** « Comment choisir » : quand monter d'un cran (règle générale), puis sur cette scène. */
  quandMonterDUnCran: z.object({ regle: texte, surCetteScene: texte }).strict(),
  erreur: texte,
  contextesRafale: z.array(contexteRafaleSchema).min(2),
};

const situation = z
  .object({
    ...commun,
    type: z.literal("situation"),
    univers: z.enum(UNIVERS),
    pourQuoiFaire: z.array(z.enum(POUR_QUOI_FAIRE)).optional(),
    contenu: z.object(corpsSituation).strict(),
  })
  .strict();

const construction = z
  .object({
    ...commun,
    type: z.literal("construction"),
    contenu: z
      .object({
        schemaEnUneLigne: texte,
        exemple: texte,
        commentCestFait: z.array(texte).min(1),
        /** Trois essais, un seul tient (le troisième) ; `texte: null` = « l'exemple » (fiche 1, E2.1). */
        essais: z.tuple([
          z.object({ texte, verdict: texte }).strict(),
          z.object({ texte, verdict: texte }).strict(),
          z.object({ texte: texte.nullable(), verdict: texte }).strict(),
        ]),
        regle: texte,
        erreur: texte,
      })
      .strict(),
  })
  .strict();

const vocabulaire = z
  .object({
    ...commun,
    type: z.literal("vocabulaire"),
    contenu: z
      .object({
        theme: texte,
        mots: z
          .array(
            z
              .object({
                mot: texte,
                enClair: texte,
                exempleEnDeuxTemps: texte,
                aNePasConfondreAvec: texte,
                definitionComplete: z.string().regex(/^\/[^\s]*$/),
                /** Interne, jamais affiché : source de l'emploi attesté vérifié (architecture 3.5). */
                emploiAtteste: texte,
              })
              .strict(),
          )
          .length(5),
      })
      .strict(),
  })
  .strict();

const formule = z
  .object({
    ...commun,
    type: z.literal("formule"),
    contenu: z
      .object({
        regle: texte,
        piege: texte,
        limite: texte,
        detournements: z.array(z.object({ expression: texte, detournement: texte }).strict()).length(5),
        contreExemple: z.object({ texte, pourquoi: texte }).strict().optional(),
      })
      .strict(),
  })
  .strict();

/** Corps « Écouter, repérer » (3.7, étalon E4), aussi celui des bonus des caps 2 à 4 (3.13). */
const corpsEcouter = {
  humoriste: texte,
  passage: z
    .object({
      titre: texte,
      chaine: texte,
      url: z.string().url().startsWith("https://"),
      debut: minuteSeconde,
      fin: minuteSeconde,
      dureeTotale: minuteSeconde.optional(),
    })
    .strict(),
  /** Personne qui a transcrit le passage (jamais une transcription automatique seule). */
  transcritePar: texte,
  /** Citations réelles, mot pour mot, chacune vérifiée par un relecteur indépendant de l'auteur. */
  citations: z.array(z.object({ texte, citationVerifieePar: texte }).strict()).min(1),
  avantDeLancer: texte.optional(),
  observations: z.tuple([blocSchema, blocSchema, blocSchema]),
  mecanisme: texte,
  chezToi: texte,
};

const ecouter = z.object({ ...commun, type: z.literal("ecouter"), contenu: z.object(corpsEcouter).strict() }).strict();

/** « Quand ça tombe à plat » (3.8) : même structure que Quoi répondre, 3 sorties ; rafale facultative. */
const aPlat = z
  .object({
    ...commun,
    type: z.literal("a-plat"),
    univers: z.enum(UNIVERS).optional(),
    contenu: z
      .object({
        scene: corpsSituation.scene,
        repliques: repliquesSchema,
        quandMonterDUnCran: corpsSituation.quandMonterDUnCran.optional(),
        erreur: texte.optional(),
        contextesRafale: z.array(contexteRafaleSchema).min(2).optional(),
      })
      .strict(),
  })
  .strict();

/** Jeux (3.9) [PROVISOIRE : aucun jeu validé à ce jour ; le format se cale sur le premier lot C4]. */
const jeu = z
  .object({
    ...commun,
    type: z.literal("jeu"),
    contenu: z
      .object({
        famille: z.enum([
          "quelle-replique",
          "finis-la-phrase",
          "trouve-l-angle",
          "change-de-registre",
          "remets-la-chute",
          "les-pires-reponses",
        ]),
        consigne: texte,
        matiere: z.array(texte).optional(),
        /** « Quelle réplique ? » reprend des situations existantes, par leur id (aucune réplique neuve). */
        situationsReprises: z.array(idFiche).optional(),
        ceQuOnAuraitPuDire: z.array(texte).min(1),
        explication: texte.optional(),
      })
      .strict(),
  })
  .strict();

const elementBilan = z.discriminatedUnion("forme", [
  z
    .object({
      forme: z.literal("laquelle"),
      /** Lot D6 (libellés E5 §5, `mission.html#etat=bilan`) : la scène avant le contexte, facultative. */
      scene: texte.optional(),
      contexte: texte,
      options: z.tuple([texte, texte, texte]),
      bonneReponse: z.number().int().min(0).max(2),
      retour: texte,
      /** Lot D6 (3.10) : la fiche à revoir après une erreur, « … mérite un deuxième tour ». */
      renvoi: z.object({ titre: texte, href: z.string().regex(/^\/[^\s]*$/, "chemin interne attendu") }).strict().optional(),
    })
    .strict(),
  z
    .object({ forme: z.literal("ordre"), consigne: texte, etapes: z.array(texte).min(2), ordreCorrect: z.array(z.number().int().min(0)), retour: texte })
    .strict(),
  z.object({ forme: z.literal("voix-haute"), consigne: texte }).strict(),
]);

/** Le bilan du parcours (3.10) : 2 « laquelle », 1 « dans l'ordre », 1 « dis-la à voix haute ». */
const bilan = z
  .object({
    ...commun,
    type: z.literal("bilan"),
    contenu: z.object({ parcoursSlug: idFiche, elements: z.array(elementBilan).length(4) }).strict(),
  })
  .strict();

const etapeSeance = <N extends string>(nom: N) =>
  z.object({ nom: z.literal(nom), minutes: z.number().int().min(1), consigne: texte }).strict();

/** Séance de 20 minutes (3.11) : échauffement, observation, essai, bilan. */
const seance = z
  .object({
    ...commun,
    type: z.literal("seance"),
    contenu: z
      .object({
        etapes: z.tuple([etapeSeance("echauffement"), etapeSeance("observation"), etapeSeance("essai"), etapeSeance("bilan")]),
      })
      .strict(),
  })
  .strict();

/** Humour noir, fait bien (3.12, étalon E6) : 3 fiches sur la limite, 5 situations (la sûre par défaut). */
const humourNoir = z
  .object({
    ...commun,
    type: z.literal("humour-noir"),
    univers: z.enum(UNIVERS).optional(),
    contenu: z.discriminatedUnion("forme", [
      z.object({ forme: z.literal("limite"), principe: texte, blocs: z.array(blocSchema).min(1), siCaNePrendPas: texte.optional() }).strict(),
      z.object({ ...corpsSituation, forme: z.literal("situation") }).strict(),
    ]),
  })
  .strict();

const unionFiches = z.discriminatedUnion("type", [situation, construction, vocabulaire, formule, ecouter, aPlat, jeu, bilan, seance, humourNoir]);

/** Bonus des caps (3.13) : caps 2 à 4 = un passage au format « Écouter, repérer » ; cap 5 = « les coulisses de la maison ». */
const unionBonus = z.discriminatedUnion("nature", [
  z
    .object({
      ...commun,
      type: z.literal("bonus"),
      nature: z.literal("passage"),
      cap: z.union([z.literal(2), z.literal(3), z.literal(4)]),
      contenu: z.object(corpsEcouter).strict(),
    })
    .strict(),
  z
    .object({
      ...commun,
      type: z.literal("bonus"),
      nature: z.literal("coulisses"),
      cap: z.literal(5),
      /** [PROVISOIRE] format de `niveaux-xp-s24.md` 5.3, à caler sur la fiche écrite (lot C8). */
      contenu: z.object({ blocs: z.array(blocSchema).min(1) }).strict(),
    })
    .strict(),
]);

export type Fiche = z.infer<typeof unionFiches>;
export type FicheBonus = z.infer<typeof unionBonus>;
type FicheOuBonus = Fiche | FicheBonus;

/** Gestes admis pour une fiche ou un bonus ; liste vide = pas de geste exigé. */
export function gestesAttendus(fiche: FicheOuBonus): readonly VerbeGeste[] {
  if (fiche.type !== "bonus") return GESTES_PAR_TYPE[fiche.type];
  return fiche.nature === "passage" ? GESTES_PAR_TYPE.ecouter : [];
}

/** « Toute fiche à geste porte son geste » : null si conforme, sinon le problème. */
export function problemeGeste(fiche: FicheOuBonus): string | null {
  const attendus = gestesAttendus(fiche);
  if (attendus.length === 0) return null;
  if (!fiche.geste) return `${fiche.id} : geste manquant (${attendus.join(", ")})`;
  if (!attendus.includes(fiche.geste.verbe)) return `${fiche.id} : geste « ${fiche.geste.verbe} » hors de ${attendus.join(", ")}`;
  const grilleExigee = fiche.type === "construction" || fiche.type === "formule" || fiche.type === "ecouter" || fiche.type === "bonus";
  if (grilleExigee && !fiche.geste.grille) return `${fiche.id} : grille de 3 questions manquante (2.4)`;
  return null;
}

function controles(fiche: FicheOuBonus, ctx: z.RefinementCtx): void {
  const signaler = (message: string) => ctx.addIssue({ code: z.ZodIssueCode.custom, message });
  const geste = problemeGeste(fiche);
  if (geste) signaler(geste);
  if (fiche.type === "ecouter" || (fiche.type === "bonus" && fiche.nature === "passage")) {
    const { debut, fin } = fiche.contenu.passage;
    if (enSecondes(fin) <= enSecondes(debut)) signaler(`${fiche.id} : la fin du passage doit suivre son début`);
  }
  if (fiche.type === "seance") {
    const total = fiche.contenu.etapes.reduce((s, e) => s + e.minutes, 0);
    if (total !== fiche.dureeMinutes) signaler(`${fiche.id} : étapes de ${total} minutes pour une durée de ${fiche.dureeMinutes}`);
  }
  if (fiche.type === "bilan") {
    const formes = fiche.contenu.elements.map((e) => e.forme).sort().join(",");
    if (formes !== "laquelle,laquelle,ordre,voix-haute") signaler(`${fiche.id} : 2 « laquelle », 1 « ordre », 1 « voix haute » attendus`);
    for (const e of fiche.contenu.elements) {
      if (e.forme !== "ordre") continue;
      const tri = [...e.ordreCorrect].sort((a, b) => a - b);
      if (tri.length !== e.etapes.length || tri.some((v, i) => v !== i)) signaler(`${fiche.id} : ordreCorrect n'est pas un ordre des étapes`);
    }
  }
  if (fiche.type === "humour-noir") {
    if (fiche.palier !== "P3") signaler(`${fiche.id} : le coin humour noir est au palier 3 (3.2)`);
    if (fiche.contenu.forme === "situation" && !fiche.univers) signaler(`${fiche.id} : univers manquant`);
  }
}

export const ficheSchema = unionFiches.superRefine(controles);
export const bonusSchema = unionBonus.superRefine(controles);

/** Fichiers servis (`src/data/espace/<nom>.json`) et le type de fiche qu'ils contiennent. */
export const FICHIERS_ESPACE = {
  situations: "situation",
  constructions: "construction",
  vocabulaire: "vocabulaire",
  formules: "formule",
  ecouter: "ecouter",
  "a-plat": "a-plat",
  jeux: "jeu",
  bilans: "bilan",
  seances: "seance",
  "humour-noir": "humour-noir",
} as const satisfies Record<string, TypeFiche>;
export const FICHIER_BONUS = "bonus";

function idsUniques(fiches: readonly FicheOuBonus[], ctx: z.RefinementCtx): void {
  const vus = new Set<string>();
  for (const f of fiches) {
    if (vus.has(f.id)) ctx.addIssue({ code: z.ZodIssueCode.custom, message: `id en double : ${f.id}` });
    vus.add(f.id);
  }
}

/** Valide le contenu d'un fichier de fiches d'un type donné ; lève une erreur lisible sinon. */
export function validerFichier(type: TypeFiche, donnees: unknown): Fiche[] {
  return z
    .array(ficheSchema)
    .superRefine((fiches, ctx) => {
      idsUniques(fiches, ctx);
      for (const f of fiches) if (f.type !== type) ctx.addIssue({ code: z.ZodIssueCode.custom, message: `${f.id} : type ${f.type} dans le fichier des ${type}` });
    })
    .parse(donnees);
}

export function validerBonus(donnees: unknown): FicheBonus[] {
  return z
    .array(bonusSchema)
    .superRefine((bonus, ctx) => {
      idsUniques(bonus, ctx);
      const caps = bonus.map((b) => b.cap);
      if (new Set(caps).size !== caps.length) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "un seul bonus par cap" });
    })
    .parse(donnees);
}
