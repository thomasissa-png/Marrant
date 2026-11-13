/**
 * Table des lots validés à importer et lecture de chacun en fiches brutes (avant validation du schéma).
 * Métadonnées absentes des Markdown (palier, durée, univers du coin) : règles de l'architecture v20
 * (tableau 3.2, anatomie 2.7), signalées `[HYPOTHÈSE]` quand le tableau ne tranche pas fiche par fiche.
 */
import { TEXTES_BILAN } from "../../src/config/textes/espace-bibliotheque";
import { Ecart, decouper, lireLot, sansGuillemets, sansParenthese, section, slug, titreAffiche, type Bloc } from "./md";
import { IDS_ENTREES, commentChoisir, corpsE11, entreeE12, geste, verbeCoin, verbeSituation } from "./situations";
import { construction, formule, vocabulaire } from "./techniques";
import { aPlat, bilan, choisirSouple, idCoin, jeu, limite, seance } from "./divers";

export interface Brute {
  lot: string;
  ref: string;
  fiche: Record<string, unknown>;
}
export interface Refus {
  lot: string;
  ref: string;
  type: string;
  raison: string;
}

/** Durée d'une leçon : « environ 5 minutes » (architecture 2.7) ; jeux « 3 à 5 minutes » (3.9). */
const DUREE = 5;

const UNIVERS: Record<string, string> = {
  Soirée: "soiree",
  Boulot: "boulot",
  "Réunion et entretien": "reunion-entretien",
  Amis: "amis",
  Famille: "famille",
  Rencontre: "rencontre",
  Couple: "couple",
  "Études et fac": "etudes-fac",
  "Prise de parole courte": "prise-de-parole",
  "Commerces, voisins, transports": "commerces-voisins-transports",
  Coloc: "coloc",
  "Messages et groupes": "messages-groupes",
};
/** [HYPOTHÈSE] univers des 5 situations du coin (lieu du titre ; le coin n'est jamais filtré par univers). */
const UNIVERS_COIN: Record<string, string> = {
  "Pause café": "boulot",
  "Dîner entre amis": "amis",
  Mairie: "commerces-voisins-transports",
  Réveillon: "soiree",
  "Groupe d'amis, par écrit": "messages-groupes",
};

/**
 * Paliers P3 (import 2). L'architecture v20 ne nomme aucune fiche P3 (tableau 3.2 ; 7.3 et 7.4 non plus) :
 * elle donne un critère et un nombre. Règles appliquées, signalées au rapport :
 * - situations, « 15 (supérieur, inconnu, groupe) » : les trois univers dont l'interlocuteur est l'un de
 *   ces trois mots, et eux seuls : « Réunion et entretien » (un supérieur, un recruteur), « Commerces,
 *   voisins, transports » (des inconnus), « Prise de parole courte » (un groupe) ; 5 + 5 + 5 = 15 ;
 * - constructions, « 3 (combiner deux mécanismes) » : la fiche dont le texte combine deux mécanismes, soit
 *   la seule « La combinaison de deux mécanismes » (C1b fiche 12) : 1 sur 3, les 2 autres ne sont pas
 *   écrites (à trancher, aucune fiche choisie au hasard).
 */
const UNIVERS_P3 = new Set(["reunion-entretien", "commerces-voisins-transports", "prise-de-parole"]);
const CONSTRUCTIONS_P3 = new Set(["la-combinaison-de-deux-mecanismes"]);

/** Markdown brut d'un bloc `## titre` (jusqu'au `---` ou au titre suivant), pour lire une note d'écran. */
function brutDuBloc(md: string, titre: string): string {
  const debut = md.indexOf(`## ${titre}`);
  if (debut < 0) return "";
  const reste = md.slice(debut + titre.length + 3);
  const fin = reste.search(/\n---\s*\n|\n## /);
  return fin < 0 ? reste : reste.slice(0, fin);
}

/** Identifiant de chaque situation par « QRn code » (pour les jeux qui la reprennent). */
export const SITUATIONS_PAR_CODE = new Map<string, string>();

function situations(lot: string, fichier: string, sortie: Brute[], refus: Refus[]) {
  for (const bloc of decouper(lireLot(fichier), 3, /^[A-Z]\d\.\s/)) {
    const [, code, reste] = /^([A-Z]\d)\.\s+(.*)$/.exec(bloc.titre) ?? [];
    const titre = titreAffiche(reste);
    const id = lot === "QR1" && IDS_ENTREES[code] ? IDS_ENTREES[code] : slug(sansParenthese(reste));
    const ref = `${lot} ${code}`;
    SITUATIONS_PAR_CODE.set(ref, id);
    try {
      const partie = sansParenthese(bloc.partie.replace(/^[A-Z]\.\s+/, ""));
      const nomUnivers = lot === "QR1" ? titre.split(" :")[0] : partie;
      const univers = UNIVERS[nomUnivers];
      if (!univers) throw new Ecart(`univers inconnu : ${nomUnivers}`);
      const e12 = bloc.sections.some((s) => s.label === "Le pourquoi");
      const aToi = section(bloc, "À toi");
      const g = geste(verbeSituation(aToi.join(" ")), aToi);
      const palier = lot === "QR1" && code.startsWith("A") ? "P1" : UNIVERS_P3.has(univers) ? "P3" : "P2";
      // « Ta première phrase d'abord » (QR5 P1 à P5) : « Comment choisir » écrit en un seul paragraphe.
      const premierePhrase = bloc.sections.some((s) => s.label === "Ta première phrase d'abord");
      const contenu = e12 ? entreeE12(bloc) : corpsE11(bloc, premierePhrase ? choisirSouple : commentChoisir);
      sortie.push({ lot, ref, fiche: { id, type: "situation", titre, univers, palier, dureeMinutes: DUREE, geste: g, contenu } });
    } catch (e) {
      refus.push({ lot, ref, type: "situation", raison: (e as Error).message });
    }
  }
}

type Lecteur = (bloc: Bloc) => { id: string; titre: string; type: string; extra?: Record<string, unknown>; palier?: string; duree?: number; corps: { contenu: unknown; geste: unknown } };

function parFiche(lot: string, fichier: string, niveau: 2 | 3, debut: RegExp, type: string, lire: Lecteur, sortie: Brute[], refus: Refus[]) {
  for (const bloc of decouper(lireLot(fichier), niveau, debut)) {
    const ref = `${lot} ${bloc.titre.split(/[.:]/)[0]}`;
    try {
      const f = lire(bloc);
      sortie.push({ lot, ref, fiche: { id: f.id, type: f.type, titre: f.titre, ...(f.extra ?? {}), palier: f.palier ?? "P2", dureeMinutes: f.duree ?? DUREE, geste: f.corps.geste, contenu: f.corps.contenu } });
    } catch (e) {
      refus.push({ lot, ref, type, raison: (e as Error).message });
    }
  }
}

const titreFiche = (b: Bloc) => titreAffiche(b.titre.replace(/^Fiche \d+\.\s*/, ""));
const idFiche = (b: Bloc) => slug(sansParenthese(b.titre.replace(/^Fiche \d+\.\s*/, "")));
export function lireTousLesLots(): { brutes: Brute[]; refus: Refus[] } {
  const brutes: Brute[] = [];
  const refus: Refus[] = [];
  const numeros = new Map<string, number>();
  SITUATIONS_PAR_CODE.clear();
  ["qr1", "qr2", "qr3", "qr4", "qr5", "qr6"].forEach((n) => situations(n.toUpperCase(), `${n}-situations.md`, brutes, refus));

  for (const lot of ["c1a", "c1b"])
    parFiche(lot.toUpperCase(), `${lot}-comment-c-est-construit.md`, 2, /^Fiche \d+\./, "construction", (b) => ({ id: idFiche(b), titre: titreFiche(b), type: "construction", palier: CONSTRUCTIONS_P3.has(idFiche(b)) ? "P3" : "P2", corps: construction(b) }), brutes, refus);
  parFiche("C1C", "c1c-vocabulaire.md", 2, /^Fiche \d+\./, "vocabulaire", (b) => vocabulaire(b), brutes, refus);
  for (const lot of ["c3a", "c3b"])
    parFiche(lot.toUpperCase(), `${lot}-formules.md`, 2, /^Fiche \d+\./, "formule", (b) => ({ id: `formules-${idFiche(b)}`, titre: titreFiche(b), type: "formule", corps: formule(b) }), brutes, refus);

  for (const lot of ["c4a", "c4b", "c4c"]) {
    const md = lireLot(`${lot}-jeux.md`);
    const intro = /Chaque jeu commence par : « (.+?) »/.exec(md)?.[1];
    parFiche(lot.toUpperCase(), `${lot}-jeux.md`, 2, /^Jeu \d+\./, "jeu", (b) => {
      if (!intro) throw new Ecart("phrase d'ouverture des jeux absente de l'en-tête du lot");
      const titre = titreAffiche(b.titre.replace(/^Jeu \d+\.\s*/, ""));
      const corps = jeu(b, sansParenthese(titre), intro);
      const famille = (corps.contenu as { famille: string }).famille;
      const n = (numeros.get(famille) ?? 0) + 1;
      numeros.set(famille, n);
      const reprise = /situation reprise : (QR\d) ([A-Z]\d)/.exec(b.titre);
      const situationsReprises = reprise ? [SITUATIONS_PAR_CODE.get(`${reprise[1]} ${reprise[2]}`) ?? `introuvable-${reprise[1]}-${reprise[2]}`] : undefined;
      const contenu = { ...(corps.contenu as object), ...(situationsReprises ? { situationsReprises } : {}) };
      return { id: `${famille}-${n}`, titre, type: "jeu", corps: { contenu, geste: corps.geste } };
    }, brutes, refus);
  }

  parFiche("C6A", "c6a-a-plat.md", 2, /^Fiche \d+\./, "a-plat", (b) => ({ id: `a-plat-${idFiche(b)}`, titre: titreFiche(b), type: "a-plat", corps: aPlat(b, brutDuBloc(lireLot("c6a-a-plat.md"), b.titre)) }), brutes, refus);
  parFiche("C6B", "c6b-bilans.md", 2, /^\d\.\s/, "bilan", (b) => {
    const nom = b.titre.replace(/^\d\.\s*/, "").replace(/\s*\(`[^`]*`\)\s*$/, "");
    const { parcours, contenu, geste: g } = bilan(b);
    return { id: `bilan-${parcours}`, titre: `${TEXTES_BILAN.eyebrow} ${nom}`, type: "bilan", corps: { contenu, geste: g } };
  }, brutes, refus);
  parFiche("C6C", "c6c-seances.md", 2, /^Séance \d+/, "seance", (b) => seance(b), brutes, refus);

  parFiche("C7", "c7-humour-noir.md", 3, /^Fiche \d+ :/, "humour-noir", (b) => {
    const titre = sansGuillemets(titreAffiche(b.titre.replace(/^Fiche \d+ :\s*/, "")));
    return { id: idCoin(titre), titre, type: "humour-noir", palier: "P3", corps: limite(b) };
  }, brutes, refus);
  parFiche("C7", "c7-humour-noir.md", 3, /^C7-\d\./, "humour-noir", (b) => {
    const titre = b.titre.replace(/^C7-\d\.\s*/, "");
    const univers = UNIVERS_COIN[titre.split(" :")[0]];
    if (!univers) throw new Ecart(`univers du coin inconnu : ${titre}`);
    const aToi = section(b, "À toi");
    const corps = corpsE11(b, choisirSouple);
    return { id: idCoin(titre), titre, type: "humour-noir", palier: "P3", extra: { univers }, corps: { contenu: { ...corps, forme: "situation" }, geste: geste(verbeCoin(aToi.join(" ")), aToi) } };
  }, brutes, refus);
  return { brutes, refus };
}
