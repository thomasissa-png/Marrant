/**
 * Jeux (C4a à C4c), « Quand ça tombe à plat » (C6a), bilans (C6b), séances (C6c), coin humour noir (C7).
 */
import { Ecart, estCitation, sansGuillemets, section, slug, type Bloc } from "./md";
import { replique, scene } from "./situations";

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

export function aPlat(bloc: Bloc) {
  const enTrop = bloc.sections.map((s) => s.label).filter((l) => !CONNUES_A_PLAT.has(l));
  if (enTrop.length) throw new Ecart(`section sans champ dans le schéma « à plat » : ${enTrop.join(", ")}`);
  if (bloc.avant.length) throw new Ecart(`texte hors section : ${bloc.avant[0]}`);
  const r = (n: string) => replique(section(bloc, `La ${n}`));
  return {
    contenu: {
      scene: scene(section(bloc, "La scène")),
      repliques: { sure: r("sûre"), joueuse: r("joueuse"), risquee: r("risquée") },
      quandMonterDUnCran: choisirSouple(section(bloc, "Comment choisir")),
      erreur: section(bloc, "L'erreur que tout le monde fait").join("\n"),
    },
    geste: { verbe: "choisir", consigne: section(bloc, "À toi").join("\n") },
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
    const options = s.filter((l) => /^- [A-C]\)/.test(l)).map(option);
    if (options.length !== 3) throw new Ecart(`Laquelle ${n} : ${options.length} options`);
    return {
      forme: "laquelle" as const,
      contexte: cite(champ(s, "Contexte")),
      options: options as [string, string, string],
      bonneReponse: Number(/^(\d)/.exec(champ(s, "bonneReponse"))?.[1]),
      retour: cite(champ(s, "Retour")),
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

const SEANCE_HORS_SCHEMA = ["Pour qui, quand", "Il te faut", "Tu produis", "Une version possible", "Renvois"];

/** Séance de 20 minutes : le schéma n'a que 4 étapes (consigne seule) et aucun champ pour le reste. */
export function seance(bloc: Bloc): never {
  const enTrop = bloc.sections.map((s) => s.label).filter((l) => SEANCE_HORS_SCHEMA.some((x) => l.startsWith(x)));
  throw new Ecart(`sections sans champ dans le schéma « séance » : ${enTrop.join(", ")} ; aucun texte de geste (verbe « faire »)`);
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
