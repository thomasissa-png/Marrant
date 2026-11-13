/**
 * « Comment c'est construit » (C1a, C1b), « Formules à détourner » (C3a, C3b) et « Vocabulaire » (C1c).
 */
import { Ecart, estCitation, sansGuillemets, section, type Bloc } from "./md";

const sansNumero = (l: string) => l.replace(/^\d+\.\s*/, "");

/** Trois essais : « Essai N : « … » » puis le verdict ; « Essai 3 : l'exemple. Verdict » = texte null. */
function essais(lignes: string[]) {
  const sortie: { texte: string | null; verdict: string }[] = [];
  for (let i = 0; i < lignes.length; i++) {
    const m = /^Essai \d+ : (.*)$/.exec(lignes[i]);
    if (!m) continue;
    const exemple = /^l'exemple\.\s*(.*)$/.exec(m[1]);
    if (exemple) {
      sortie.push({ texte: null, verdict: exemple[1] });
      continue;
    }
    if (!estCitation(m[1])) throw new Ecart(`essai sans phrase entre « » : ${m[1]}`);
    const verdict = lignes[i + 1];
    if (!verdict || /^Essai \d+ :/.test(verdict)) throw new Ecart(`essai sans verdict : ${m[1]}`);
    sortie.push({ texte: sansGuillemets(m[1]), verdict });
  }
  if (sortie.length !== 3) throw new Ecart(`${sortie.length} essais, 3 attendus`);
  return sortie as [(typeof sortie)[0], (typeof sortie)[0], (typeof sortie)[0]];
}

/** Geste à grille : la consigne, puis « 1. … 2. … 3. … ». */
function gesteAGrille(lignes: string[]) {
  const grille = lignes.filter((l) => /^\d+\.\s/.test(l)).map(sansNumero);
  const consigne = lignes.filter((l) => !/^\d+\.\s/.test(l)).join("\n");
  if (grille.length !== 3) throw new Ecart(`grille de ${grille.length} questions, 3 attendues`);
  return { verbe: "ecrire", consigne, grille: grille as [string, string, string] };
}

export function construction(bloc: Bloc) {
  const exemple = section(bloc, "L'exemple");
  if (exemple.length !== 1 || !estCitation(exemple[0])) throw new Ecart("exemple attendu en une phrase entre « »");
  return {
    contenu: {
      schemaEnUneLigne: section(bloc, "Le schéma, en une ligne").join("\n"),
      exemple: sansGuillemets(exemple[0]),
      commentCestFait: section(bloc, "Comment c'est fait"),
      essais: essais(section(bloc, "Trois essais, un seul tient")),
      regle: section(bloc, "La règle").join("\n"),
      erreur: section(bloc, "L'erreur que tout le monde fait").join("\n"),
    },
    geste: gesteAGrille(section(bloc, "À toi")),
  };
}

/** Première citation « … » d'une ligne (la forme d'origine d'un détournement). */
function premiereCitation(l: string): string {
  const m = /«\s*(.+?)\s*»/.exec(l);
  if (!m) throw new Ecart(`expression sans « » : ${l}`);
  return m[1];
}

export function formule(bloc: Bloc) {
  const faites = section(bloc, "Deux déjà faites");
  const detournements: { expression: string; detournement: string }[] = [];
  for (let i = 0; i < faites.length; i += 2) {
    const fleche = faites[i + 1] ?? "";
    if (!fleche.startsWith("→ ")) throw new Ecart(`détournement fait sans « → » : ${faites[i]}`);
    detournements.push({ expression: sansGuillemets(faites[i]), detournement: sansGuillemets(fleche.slice(2)) });
  }
  const aToi = section(bloc, "Trois à toi");
  const consigne = aToi[0];
  for (let i = 1; i < aToi.length; i += 2) {
    const version = aToi[i + 1] ?? "";
    if (!/^\d+\.\s/.test(aToi[i]) || !estCitation(version)) throw new Ecart(`« à toi » illisible : ${aToi[i]}`);
    detournements.push({ expression: premiereCitation(aToi[i]), detournement: sansGuillemets(version) });
  }
  const suite = section(bloc, "Une suite qui ne détourne rien");
  const grilleLigne = suite.find((l) => l.startsWith("Puis la grille : "));
  if (!grilleLigne) throw new Ecart("grille absente (« Puis la grille : »)");
  const grille = grilleLigne
    .slice("Puis la grille : ".length)
    .split(/(?<=\?)\s+/)
    .map((q) => q.trim())
    .filter(Boolean);
  if (grille.length !== 3) throw new Ecart(`grille de ${grille.length} questions, 3 attendues`);
  const contre = /^«\s*(.+?)\s*»\s+(.+)$/.exec(suite[0]);
  if (!contre) throw new Ecart(`suite qui ne détourne rien illisible : ${suite[0]}`);
  return {
    contenu: {
      regle: section(bloc, "La règle").join("\n"),
      piege: section(bloc, "Le piège").join("\n"),
      limite: section(bloc, "La limite").join("\n"),
      detournements,
      contreExemple: { texte: contre[1], pourquoi: contre[2] },
    },
    geste: { verbe: "ecrire", consigne, grille: grille as [string, string, string] },
  };
}

/**
 * Vocabulaire (E3) : le schéma exige pour chaque mot une « Définition complète » en chemin interne et
 * l'emploi attesté (champ interne). La source garde `[lien à décider, mot neuf]` pour les 28 mots
 * neufs et ne donne les sources que par fiche : la fiche est signalée, jamais complétée ici.
 */
export function vocabulaire(bloc: Bloc): never {
  const mots = bloc.sections.slice(1).filter((s) => !/^À toi/.test(s.label));
  const sansLien = mots.filter((s) => {
    const l = s.lignes.find((x) => x.startsWith("Définition complète :")) ?? "";
    return !/^\/\S*$/.test(l.slice("Définition complète :".length).replace(/`/g, "").trim());
  });
  const raisons = [
    sansLien.length ? `${sansLien.length} mot(s) sans lien de définition complète (« lien à décider ») : ${sansLien.map((s) => s.label).join(", ")}` : "",
    `emploi attesté par mot absent (sources données par fiche) pour ${mots.length} mots`,
  ].filter(Boolean);
  throw new Ecart(raisons.join(" ; "));
}
