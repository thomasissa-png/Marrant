/**
 * Situations « Quoi répondre » (QR1 à QR6) et situations du coin (C7) : Markdown vers fiches.
 * Format E1.1 (scène, trois répliques et leur pourquoi, comment choisir, erreur, à toi, rafale) ;
 * format E1.2 pour QR1 A2 à A5 (étalon validé tel quel, voir `entreeE12`).
 */
import { ENTREES_QUIZ } from "../../src/lib/espace/premier-pas";
import { Ecart, estCitation, sansGuillemets, section, type Bloc } from "./md";

export type Registre = "sure" | "joueuse" | "risquee";
const REGISTRE: Record<string, Registre> = { sûre: "sure", joueuse: "joueuse", risquée: "risquee" };

/** Les 5 entrées du quiz gardent les identifiants posés au lot D3 (`premier-pas.ts`). */
export const IDS_ENTREES: Record<string, string> = {
  A1: ENTREES_QUIZ.TAQUIN,
  A2: ENTREES_QUIZ.OBSERVATEUR,
  A3: ENTREES_QUIZ.STORYTELLER,
  A4: ENTREES_QUIZ.ABSURDE,
  A5: ENTREES_QUIZ.PUNCHLINEUR,
};

/** « Pour aller plus loin : » fait partie du geste, dans un champ à part (anatomie 2.7). */
export function geste(verbe: string, lignes: string[]) {
  const texte = lignes.join("\n");
  const i = texte.indexOf(" Pour aller plus loin : ");
  if (i < 0) return { verbe, consigne: texte };
  return { verbe, consigne: texte.slice(0, i), pourAllerPlusLoin: texte.slice(i + " Pour aller plus loin : ".length) };
}

/** Verbe du geste d'une situation (choisir, dire, tenter), lu dans la consigne « À toi ». */
export function verbeSituation(consigne: string): "choisir" | "dire" | "tenter" {
  if (/voix haute/i.test(consigne)) return "dire";
  if (/^choisis/i.test(consigne)) return "choisir";
  return "tenter";
}

/** Scène : le texte, la phrase lancée seule sur sa ligne entre « », puis la suite. */
export function scene(lignes: string[]) {
  const i = lignes.findIndex(estCitation);
  if (i <= 0) return { texte: lignes.join(" ") };
  const suite = lignes.slice(i + 1).join(" ");
  return { texte: lignes.slice(0, i).join(" "), onTeDit: sansGuillemets(lignes[i]), ...(suite ? { suite } : {}) };
}

/** Une réplique : sa phrase entre « » sur la première ligne, son pourquoi ensuite. */
export function replique(lignes: string[]) {
  if (!estCitation(lignes[0] ?? "")) throw new Ecart(`réplique sans phrase entre « » : ${lignes[0] ?? "(vide)"}`);
  if (lignes.length < 2) throw new Ecart(`réplique sans pourquoi : ${lignes[0]}`);
  return { texte: sansGuillemets(lignes[0]), pourquoi: lignes.slice(1).join("\n") };
}

export function repliques(bloc: Bloc) {
  const de = (r: string) => replique(section(bloc, new RegExp(`^La ${r}( \\(par défaut\\))?$`)));
  return { sure: de("sûre"), joueuse: de("joueuse"), risquee: de("risquée") };
}

/** « 1. « contexte » : la joueuse. Pourquoi. » */
export function rafale(lignes: string[]) {
  return lignes.map((l) => {
    const m = /^\d+\.\s*«\s*(.+?)\s*»\s*:\s*la (sûre|joueuse|risquée)\.\s*(.+)$/.exec(l);
    if (!m) throw new Ecart(`contexte de rafale illisible : ${l.slice(0, 80)}`);
    return { contexte: m[1], bonneReponse: REGISTRE[m[2]], pourquoi: m[3] };
  });
}

/** Verbe du geste d'une situation du coin (choisir, dire, écrire). */
export function verbeCoin(consigne: string): "choisir" | "dire" | "ecrire" {
  if (/^écris/i.test(consigne)) return "ecrire";
  if (/\bdis\b|voix haute/i.test(consigne)) return "dire";
  return "choisir";
}

/** Comment choisir, format E1.1 : la règle générale, puis « Sur cette scène : ». */
export function commentChoisir(lignes: string[]) {
  if (lignes.length !== 2) throw new Ecart(`« Comment choisir » en ${lignes.length} ligne(s), 2 attendues (règle, puis « Sur cette scène »)`);
  return { regle: lignes[0], surCetteScene: lignes[1] };
}

/** Corps E1.1 commun à « Quoi répondre » et aux situations du coin. */
export function corpsE11(bloc: Bloc, choisir: (lignes: string[]) => { regle: string; surCetteScene?: string } = commentChoisir) {
  const premierePhrase = bloc.sections.some((s) => s.label === "Ta première phrase d'abord");
  return {
    forme: premierePhrase ? ("premiere-phrase" as const) : ("reponse" as const),
    scene: scene(section(bloc, "La scène")),
    repliques: repliques(bloc),
    quandMonterDUnCran: choisir(section(bloc, "Comment choisir")),
    erreur: section(bloc, "L'erreur que tout le monde fait").join("\n"),
    contextesRafale: rafale(section(bloc, /^Dans la rafale/)),
  };
}

/**
 * Entrées QR1 A2 à A5 (étalon E1.2, validé tel quel) : scène en un paragraphe, répliques en liste,
 * « Le pourquoi » en liste, « Quand monter d'un cran », « La règle », « L'erreur », « À toi ».
 * Correspondance [à confirmer] : « La règle » va dans `regle`, « Quand monter d'un cran » dans
 * `surCetteScene` ; un paragraphe libre entre la scène et les répliques (A2) va dans `scene.suite`.
 */
export function entreeE12(bloc: Bloc) {
  const lignesScene = section(bloc, "La scène");
  const texteScene = lignesScene[0];
  const libres = lignesScene.slice(1).filter((l) => !l.startsWith("- "));
  const puces = lignesScene.filter((l) => l.startsWith("- "));
  const lire = (puce: RegExp, depuis: string[]) => {
    const l = depuis.find((x) => puce.test(x));
    if (!l) throw new Ecart(`ligne absente : ${puce.source}`);
    return l.replace(puce, "").trim();
  };
  const pourquoi = section(bloc, "Le pourquoi");
  const r = (nom: string, court: string) => ({
    texte: sansGuillemets(lire(new RegExp(`^- La ${nom} :\\s*`), puces)),
    pourquoi: lire(new RegExp(`^- ${court} :\\s*`), pourquoi),
  });
  return {
    forme: "reponse" as const,
    scene: { texte: texteScene, ...(libres.length ? { suite: libres.join("\n") } : {}) },
    repliques: { sure: r("sûre", "Sûre"), joueuse: r("joueuse", "Joueuse"), risquee: r("risquée", "Risquée") },
    quandMonterDUnCran: { regle: section(bloc, "La règle").join("\n"), surCetteScene: section(bloc, "Quand monter d'un cran").join("\n") },
    erreur: section(bloc, "L'erreur").join("\n"),
    contextesRafale: rafale(section(bloc, /^Dans la rafale/)),
  };
}
