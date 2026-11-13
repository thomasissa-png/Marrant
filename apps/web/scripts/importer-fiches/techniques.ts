/**
 * « Comment c'est construit » (C1a, C1b), « Formules à détourner » (C3a, C3b) et « Vocabulaire » (C1c).
 */
import { Ecart, estCitation, sansGuillemets, sansParenthese, section, slug, titreAffiche, type Bloc } from "./md";

const sansNumero = (l: string) => l.replace(/^\d+\.\s*/, "");

/** Nombre de citations « … » d'une ligne. */
const citations = (t: string) => (t.match(/«[^«»]*»/g) ?? []).length;

/**
 * Trois essais : « Essai N : « … » » puis le verdict ; « Essai 3 : l'exemple. Verdict » = texte null.
 * Forme « récit » (import 2, C1b fiche 7) : l'essai est un récit qui contient au moins une citation, gardé tel quel.
 */
function essais(lignes: string[], recit = false) {
  const sortie: { texte: string | null; verdict: string }[] = [];
  for (let i = 0; i < lignes.length; i++) {
    const m = /^Essai \d+ : (.*)$/.exec(lignes[i]);
    if (!m) continue;
    const exemple = /^l'exemple\.\s*(.*)$/.exec(m[1]);
    if (exemple) {
      sortie.push({ texte: null, verdict: exemple[1] });
      continue;
    }
    if (recit ? citations(m[1]) === 0 : !estCitation(m[1])) throw new Ecart(`essai sans phrase entre « » : ${m[1]}`);
    const verdict = lignes[i + 1];
    if (!verdict || /^Essai \d+ :/.test(verdict)) throw new Ecart(`essai sans verdict : ${m[1]}`);
    sortie.push({ texte: recit ? m[1] : sansGuillemets(m[1]), verdict });
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
  if (exemple.length !== 1) throw new Ecart("exemple attendu en une ligne");
  // Import 2 : un exemple qui n'est pas une seule phrase citée mais un récit à plusieurs citations
  // (C1b fiche 7) passe en forme « récit » : exemple et essais gardés tels qu'écrits.
  const recit = !estCitation(exemple[0]) && citations(exemple[0]) >= 2;
  if (!recit && !estCitation(exemple[0])) throw new Ecart("exemple attendu en une phrase entre « » ou en récit à plusieurs citations");
  return {
    contenu: {
      schemaEnUneLigne: section(bloc, "Le schéma, en une ligne").join("\n"),
      exemple: recit ? exemple[0] : sansGuillemets(exemple[0]),
      commentCestFait: section(bloc, "Comment c'est fait"),
      essais: essais(section(bloc, "Trois essais, un seul tient"), recit),
      regle: section(bloc, "La règle").join("\n"),
      erreur: section(bloc, "L'erreur que tout le monde fait").join("\n"),
      ...(recit ? { forme: "recit" as const } : {}),
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

const EN_DEUX_TEMPS = "En deux temps : ";
const PAS_CONFONDRE = "À ne pas confondre avec : ";
const DEFINITION = "Définition complète :";

/**
 * Vocabulaire (E3, lot C1c), import 2 : titre et accroche (première section, au nom de la fiche), cinq
 * mots (définition, « En deux temps », « À ne pas confondre avec », « Définition complète »), « À toi :
 * placer ». « Définition complète » : chemin seulement s'il est écrit (`/glossaire`) ; les 28 mots neufs
 * gardent `[lien à décider, mot neuf]`, retiré par la lecture : aucun lien inventé. L'emploi attesté est
 * donné par fiche (« [note interne] Sources : … ») : il va, tel qu'écrit, dans le champ interne de la fiche.
 */
export function vocabulaire(bloc: Bloc) {
  const titre = titreAffiche(bloc.titre.replace(/^Fiche \d+\.\s*/, ""));
  const [tete, ...reste] = bloc.sections;
  if (!tete || tete.label !== titre || tete.lignes.length !== 1) throw new Ecart("première section : le titre de la fiche puis son accroche en une ligne");
  const aToi = reste.find((s) => /^À toi : /.test(s.label));
  if (!aToi || aToi.lignes.length === 0) throw new Ecart("« À toi » absent");
  const verbe = aToi.label.replace(/^À toi : /, "").normalize("NFD").replace(/\p{M}/gu, "");
  const mots = reste.filter((s) => s !== aToi).map((s) => {
    const [enClair, deux, confondre, definition, ...trop] = s.lignes;
    if (trop.length || !enClair) throw new Ecart(`mot « ${s.label} » : ${s.lignes.length} lignes, 4 attendues`);
    const m = /^(En deux temps[^:]*:)\s*(.+)$/.exec(deux ?? "");
    if (!m) throw new Ecart(`mot « ${s.label} » : « En deux temps » absent`);
    if (!confondre?.startsWith(PAS_CONFONDRE)) throw new Ecart(`mot « ${s.label} » : « À ne pas confondre avec » absent`);
    if (!definition?.startsWith(DEFINITION)) throw new Ecart(`mot « ${s.label} » : « Définition complète » absente`);
    const lien = definition.slice(DEFINITION.length).replace(/`/g, "").trim();
    if (lien && !/^\/\S*$/.test(lien)) throw new Ecart(`mot « ${s.label} » : définition complète illisible (${lien})`);
    return {
      mot: s.label,
      enClair,
      exempleEnDeuxTemps: m[2],
      ...(`${m[1]} ` !== EN_DEUX_TEMPS ? { libelleEnDeuxTemps: m[1] } : {}),
      aNePasConfondreAvec: confondre.slice(PAS_CONFONDRE.length),
      ...(lien ? { definitionComplete: lien } : {}),
    };
  });
  const sources = bloc.notes.find((n) => /^Sources : /.test(n));
  if (!sources) throw new Ecart("emploi attesté absent (« [note interne] Sources : »)");
  return {
    id: slug(sansParenthese(titre)),
    titre,
    type: "vocabulaire",
    corps: {
      contenu: { theme: tete.lignes[0], emploiAtteste: sources.slice("Sources : ".length), mots },
      geste: { verbe, consigne: aToi.lignes.join("\n") },
    },
  };
}
