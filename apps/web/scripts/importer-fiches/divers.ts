/**
 * Jeux (C4a à C4c), « Quand ça tombe à plat » (C6a), bilans (C6b), séances (C6c), coin humour noir (C7).
 */
import { Ecart, estCitation, nettoyer, sansGuillemets, section, slug, type Bloc } from "./md";
import { etapeDuQuiz } from "./seeds";
import { replique, scene } from "./situations";
import { gestesSeances } from "./textes-manquants";

export const FAMILLES_JEU: Record<string, string> = {
  "Quelle réplique ?": "quelle-replique",
  "Finis la phrase": "finis-la-phrase",
  "Trouve l'angle": "trouve-l-angle",
  "Change de registre": "change-de-registre",
  "Remets la chute": "remets-la-chute",
  "Les pires réponses": "les-pires-reponses",
  "Choisis la chute": "choisis-la-chute",
};
const FAMILLES_A_CHOIX = new Set(["quelle-replique", "choisis-la-chute", "les-pires-reponses"]);

/**
 * Un jeu garde ses lignes telles qu'écrites (lettres « A. », numéros, guillemets) : sa matière et ses
 * réponses mêlent répliques, lettres et observations, et l'écran les affiche sans rien ajouter.
 * Le geste reprend la phrase par laquelle « chaque jeu commence » (en-tête du lot).
 */
export function jeu(bloc: Bloc, nom: string, consigneGeste: string) {
  const famille = FAMILLES_JEU[nom];
  if (!famille) throw new Ecart(`famille de jeu inconnue : ${nom}`);
  const aDire = section(bloc, "Ce qu'on aurait pu dire", false);
  const aRelever = section(bloc, "Ce qu'on aurait pu relever", false);
  const chutes = [...section(bloc, "Chute d'origine", false), ...section(bloc, "Une autre chute", false)];
  const reponses = [...aDire, ...aRelever, ...chutes].map((l) => l.replace(/^- /, ""));
  if (reponses.length === 0) throw new Ecart("« Ce qu'on aurait pu dire » absent");
  const matiere = section(bloc, "Matière", false);
  return {
    contenu: {
      famille,
      consigne: section(bloc, "Consigne").join("\n"),
      ...(matiere.length ? { matiere } : {}),
      ceQuOnAuraitPuDire: reponses,
      explication: section(bloc, "Retour").join("\n"),
    },
    geste: { verbe: FAMILLES_A_CHOIX.has(famille) ? "choisir" : "ecrire", consigne: consigneGeste },
  };
}

/** « Comment choisir » en une ligne (C6a, C7) ou en deux (règle, puis « Sur cette scène »). */
export function choisirSouple(lignes: string[]) {
  if (lignes.length === 1) return { regle: lignes[0] };
  if (lignes.length === 2) return { regle: lignes[0], surCetteScene: lignes[1] };
  throw new Ecart(`« Comment choisir » en ${lignes.length} lignes`);
}

const CONNUES_A_PLAT = new Set(["La scène", "La sûre", "La joueuse", "La risquée", "Comment choisir", "L'erreur que tout le monde fait", "À toi", "Candidates de remplacement"]);
/** Import 2 (C6a fiches 9 et 10) : rubrique entre la scène et les répliques, titre gardé tel qu'écrit. */
const PRECISIONS_A_PLAT = new Set(["De quel blanc parle-t-on", "Trois signaux observables"]);
/** Import 2 (C6a fiche 9) : quatrième sortie, citation puis pourquoi. */
const SI_CA_DURE = "Si le blanc dure";

/**
 * Réplique d'une fiche « à plat » ; import 2 : une sortie écrite comme un geste, sans aucune citation
 * (C6a fiche 9, « Le silence. »), est gardée telle quelle et marquée `sansParole` (l'écran n'ajoute rien).
 */
function repliqueAPlat(lignes: string[]) {
  const l = lignes[0] ?? "";
  if (estCitation(l) || /«/.test(l) || lignes.length < 2) return replique(lignes);
  return { texte: l, pourquoi: lignes.slice(1).join("\n"), sansParole: true as const };
}

/** Lien neutre vers le coin (E6 §6) : une ligne citée suivie de la note « lien neutre vers le coin ». */
const NOTE_LIEN_COIN = /^(«[^«»]+»)\s*`\[note interne[^`]*lien neutre vers le coin[^`]*\]`\s*$/;

export function aPlat(bloc: Bloc, brut: string) {
  const enTrop = bloc.sections.map((s) => s.label).filter((l) => !CONNUES_A_PLAT.has(l) && !PRECISIONS_A_PLAT.has(l) && l !== SI_CA_DURE);
  if (enTrop.length) throw new Ecart(`section sans champ dans le schéma « à plat » : ${enTrop.join(", ")}`);
  if (bloc.avant.length) throw new Ecart(`texte hors section : ${bloc.avant[0]}`);
  const r = (n: string) => repliqueAPlat(section(bloc, `La ${n}`));
  const precisions = bloc.sections.filter((s) => PRECISIONS_A_PLAT.has(s.label));
  if (precisions.length > 1) throw new Ecart("deux rubriques entre la scène et les répliques");
  const dure = section(bloc, SI_CA_DURE, false);
  // La ligne du lien est lue dans le Markdown brut : sa note dit ce qu'elle est (jamais dans le geste).
  const lien = brut.split("\n").map((l) => NOTE_LIEN_COIN.exec(l.trim())?.[1]).find(Boolean);
  const aToi = section(bloc, "À toi").filter((l) => !lien || l !== nettoyer(lien));
  return {
    contenu: {
      scene: scene(section(bloc, "La scène")),
      repliques: { sure: r("sûre"), joueuse: r("joueuse"), risquee: r("risquée") },
      quandMonterDUnCran: choisirSouple(section(bloc, "Comment choisir")),
      erreur: section(bloc, "L'erreur que tout le monde fait").join("\n"),
      ...(precisions[0] ? { precision: { titre: precisions[0].brut, texte: precisions[0].lignes.join("\n") } } : {}),
      ...(dure.length ? { siCaDure: { titre: SI_CA_DURE, ...replique(dure) } } : {}),
      ...(lien ? { lienCoin: sansGuillemets(lien) } : {}),
    },
    geste: { verbe: "choisir", consigne: aToi.join("\n") },
  };
}

/** Option d'un bilan : lettre, citation, référence de source en fin de ligne retirées. */
function option(l: string): string {
  const sansLettre = l.replace(/^- [A-Ca-c]\)\s*/, "").replace(/\s*\((?:S|ST|BO) l\.[^)]*\)$/, "");
  const m = /^«\s*(.+?)\s*»\s*(.*)$/.exec(sansLettre);
  if (!m) return sansLettre;
  return m[2] ? `${m[1]} ${m[2]}` : m[1];
}
const champ = (lignes: string[], nom: string) => {
  const l = lignes.find((x) => x.startsWith(`${nom} : `) || x.startsWith(`\`${nom}\` : `));
  if (!l) throw new Ecart(`« ${nom} » absent`);
  return l.slice(l.indexOf(" : ") + 3).trim();
};
/** Valeur citée « … » d'un champ, référence de source finale retirée. */
const cite = (v: string) => sansGuillemets(v.replace(/\s*\((?:S|ST|BO) l\.[^)]*\)$/, ""));

export function bilan(bloc: Bloc) {
  const parcours = /\(`([a-z0-9-]+)`\)/.exec(bloc.titre)?.[1];
  if (!parcours) throw new Ecart("slug du parcours absent du titre");
  const laquelle = (n: number) => {
    const s = section(bloc, `Laquelle ${n}`);
    // Import 2 : « (quiz S l.57) » donne l'étape du quiz ; le renvoi est calculé par l'écran (3.10).
    const quiz = s.map((l) => /^\(quiz (S|ST|BO) l\.(\d+)\)$/.exec(l)).find(Boolean);
    if (!quiz) throw new Ecart(`Laquelle ${n} : source du quiz absente (« (quiz S l.N) »)`);
    const etape = etapeDuQuiz(quiz[1], Number(quiz[2]), parcours);
    const options = s.filter((l) => /^- [A-C]\)/.test(l)).map(option);
    if (options.length !== 3) throw new Ecart(`Laquelle ${n} : ${options.length} options`);
    return {
      forme: "laquelle" as const,
      contexte: cite(champ(s, "Contexte")),
      options: options as [string, string, string],
      bonneReponse: Number(/^(\d)/.exec(champ(s, "bonneReponse"))?.[1]),
      retour: cite(champ(s, "Retour")),
      etape,
    };
  };
  const o = section(bloc, "Dans l'ordre");
  const voix = section(bloc, "Dis-la à voix haute");
  const consigneVoix = cite(champ(voix, "Consigne"));
  return {
    parcours,
    contenu: {
      parcoursSlug: parcours,
      elements: [
        laquelle(1),
        laquelle(2),
        {
          forme: "ordre" as const,
          consigne: cite(champ(o, "Consigne")),
          etapes: o.filter((l) => /^- [a-c]\)/.test(l)).map(option),
          ordreCorrect: JSON.parse(/\[[\d,\s]+\]/.exec(champ(o, "ordreCorrect"))?.[0] ?? "null") as number[],
          retour: cite(champ(o, "Retour")),
        },
        { forme: "voix-haute" as const, consigne: consigneVoix },
      ],
    },
    geste: { verbe: "dire", consigne: consigneVoix },
  };
}

const ETAPES_SEANCE = [
  ["Échauffement", "echauffement"],
  ["Observation", "observation"],
  ["Essai", "essai"],
  ["Bilan", "bilan"],
] as const;
const RUBRIQUES_SEANCE = ["Pour qui, quand", "Il te faut", "Tu produis", "Renvois"];

/**
 * Geste « faire » d'une séance : le lot C6c n'écrit aucun « À toi » (les lignes `[Retour : …]` et
 * `[Ma réplique à moi : …]` sont des boutons d'écran). Les 6 gestes ont été écrits à part et validés
 * (`docs/copy/espace/textes-manquants-import2-s24.md` section 1, clôture du 13/11), lus par numéro de
 * séance ; ils remplacent le repli de l'import 2 (libellé n°8 de `libelles-espace-e5-s24.md`).
 */
const GESTES_SEANCES = gestesSeances();

/**
 * Séance de 20 minutes (C6c, import 2) : titre « Séance N (palier P…). Titre » ; « Pour qui, quand »,
 * « Il te faut », 4 étapes minutées (« Échauffement (3 min). »), la grille du bilan (1. 2. 3.), « Tu
 * produis », « Une version possible » (précision entre parenthèses facultative), « Renvois ».
 */
export function seance(bloc: Bloc) {
  const t = /^Séance (\d+) \(palier (\d)[^)]*\)\.\s*(.+)$/.exec(bloc.titre);
  if (!t) throw new Ecart(`titre de séance illisible : ${bloc.titre}`);
  const labels = bloc.sections.map((x) => x.label);
  const connus = (l: string) => RUBRIQUES_SEANCE.includes(l) || /^Une version possible( \([^)]+\))?$/.test(l) || ETAPES_SEANCE.some(([n]) => new RegExp(`^${n} \\(\\d+ min\\)$`).test(l));
  const enTrop = labels.filter((l) => !connus(l));
  if (enTrop.length) throw new Ecart(`section sans champ dans le schéma « séance » : ${enTrop.join(", ")}`);
  if (bloc.avant.length) throw new Ecart(`texte hors section : ${bloc.avant[0]}`);
  const un = (label: string) => section(bloc, label).join("\n");
  const etapes = ETAPES_SEANCE.map(([nomAffiche, nom]) => {
    const sec = bloc.sections.find((x) => new RegExp(`^${nomAffiche} \\((\\d+) min\\)$`).test(x.label));
    if (!sec || sec.lignes.length === 0) throw new Ecart(`étape « ${nomAffiche} » absente`);
    const minutes = Number(/\((\d+) min\)/.exec(sec.label)?.[1]);
    if (nom !== "bilan") return { nom, minutes, consigne: sec.lignes.join("\n") };
    const grille = sec.lignes.filter((l) => /^\d+\.\s/.test(l)).map((l) => l.replace(/^\d+\.\s*/, ""));
    if (grille.length !== 3) throw new Ecart(`grille du bilan de ${grille.length} questions, 3 attendues`);
    return { nom, minutes, consigne: sec.lignes.filter((l) => !/^\d+\.\s/.test(l)).join("\n"), grille };
  });
  const version = bloc.sections.find((x) => /^Une version possible/.test(x.label));
  if (!version || version.lignes.length === 0) throw new Ecart("« Une version possible » absente");
  const precision = /\(([^)]+)\)$/.exec(version.label)?.[1];
  const titre = t[3].trim();
  const geste = GESTES_SEANCES.get(Number(t[1]));
  if (!geste) throw new Ecart(`geste « À toi » absent pour la séance ${t[1]}`);
  return {
    id: `seance-${slug(titre)}`,
    titre,
    type: "seance",
    palier: `P${t[2]}`,
    duree: etapes.reduce((n, e) => n + e.minutes, 0),
    corps: {
      contenu: {
        pourQuiQuand: un("Pour qui, quand"),
        ilTeFaut: un("Il te faut"),
        etapes,
        tuProduis: un("Tu produis"),
        versionPossible: { ...(precision ? { precision } : {}), texte: version.lignes.join("\n") },
        renvois: un("Renvois"),
      },
      geste: { verbe: "faire", consigne: geste },
    },
  };
}

export function limite(bloc: Bloc) {
  const fin = (l: string) => /^À toi/.test(l);
  const blocs = bloc.sections
    .filter((s) => !["Le principe", "Si ça ne prend pas"].includes(s.label) && !fin(s.label))
    .map((s) => ({ titre: s.brut, texte: s.lignes.join("\n") }));
  const siPlat = section(bloc, "Si ça ne prend pas", false);
  const aToi = bloc.sections.find((s) => fin(s.label));
  if (!aToi) throw new Ecart("« À toi » absent");
  const consigne = aToi.lignes.join("\n");
  const verbe = /voix haute|réponds|\bdis\b/i.test(consigne) ? "dire" : /écri|note /i.test(consigne) ? "ecrire" : "choisir";
  return {
    contenu: {
      forme: "limite" as const,
      principe: section(bloc, "Le principe").join("\n"),
      blocs,
      ...(siPlat.length ? { siCaNePrendPas: siPlat.join("\n") } : {}),
    },
    geste: { verbe, consigne },
  };
}

export const idCoin = (titre: string) => `hn-${slug(titre)}`;
export { estCitation };
