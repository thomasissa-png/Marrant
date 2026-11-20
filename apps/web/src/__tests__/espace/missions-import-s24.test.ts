/**
 * @jest-environment node
 *
 * Import des missions (s24) : `missions.json` est EXACTEMENT la sortie de l'import, et chaque défi est
 * vérifié par script contre son seed (jusqu'ici contrôlé à la main seulement). Contrôle indépendant de
 * celui de l'import : relit les seeds et la table sans passer par `controlerCitation`.
 * Diff zéro sur les seeds (P0 s11) : empreinte SHA-256 des deux fichiers figée au commit 04467bd3 ; une
 * modification d'un seed fait échouer ce test (les missions qui le citent sont alors à revalider).
 * D10c (s24, décision Thomas du 13/11) : empreinte du seed vidéo mise à jour pour UNE seule retouche,
 * l. 706 (fiche 39, champ exercise) : « Relativise. — Justement » devient « Relativise. » « Justement »
 * (le tiret cadratin remplacé par « » « », 1 caractère retiré, 3 posés) ; aucune autre ligne ne change
 * (ancienne empreinte 13e31701175c5e3dfb184915e552387ac7d670cd8dcbc4b071769c039398166c). La mission
 * video-39, revalidée, est importée : 107 missions.
 * s26 (remplacement des vidéos à risque, `src/data/video-remplacements-s26.json`) : empreinte du seed
 * vidéo mise à jour, 26 lignes changées SUR PLACE (aucune ajoutée ni retirée, AUCUN champ `exercise`
 * touché : citations des missions valides, missions.json inchangé) : fiches 14, 21, 58, 59 (youtubeId,
 * title, channelName ; duration et recommendedTimestamp vidés ; description, category et learnings de
 * la production s20 v1) et 68 (youtubeId JNo86HEt86w et durée, posés en production en s20).
 * (ancienne empreinte 397ec8b3a3073ba735ae7172e86cf3a1e833b6e861b0e3647c6acb6b59031e39).
 * s26, 2e lot (go de Thomas du 20/11) : 28 lignes changées SUR PLACE, fiches 5, 15, 57 (youtubeId, title,
 * channelName ; duration vidée, recommendedTimestamp de la 57 vidé, ligne gardée ; description et learnings
 * de la cible s26). AUCUN champ `exercise` touché (les missions video-5, video-15, video-57 citent l'ancien
 * défi, toujours au caractère et à la ligne près) : missions.json inchangé
 * (ancienne empreinte 68a2f945c4e740cb03998fd25cf23bfb1d4b28bba356c21f8565951ff19439c3).
 */
import { createHash } from "crypto";
import { readFileSync } from "fs";
import { join } from "path";
import { construireImport, enJson } from "../../../scripts/importer-fiches/construire";
import { lireSuites, SEEDS_MISSIONS, SUITES_MISSIONS, TABLE_MISSIONS } from "../../../scripts/importer-fiches/missions";
import { validerMissions } from "@/lib/espace/missions";

const RACINE = join(__dirname, "..", "..", "..", "..", "..");
const lire = (chemin: string) => readFileSync(join(RACINE, chemin), "utf8");
const servies = validerMissions(JSON.parse(readFileSync(join(__dirname, "..", "..", "data", "espace", "missions.json"), "utf8")));
const { missions: resultat } = construireImport();

const EMPREINTES_SEEDS: Record<keyof typeof SEEDS_MISSIONS, string> = {
  conseil: "3271f7ec83289ce1adc7297923947c16869ea99aeee160bda0543e0ad5bf97db",
  video: "244938616def878ba0cc94536e4cfaae3956af012e68dec1136c4b96b0bdf9ed",
};

/** Ligne de la table (sections 2 et 3) d'un id : [défi, « l. N », marche]. */
function ligneTable(id: string): [string, string, string] {
  const brute = lire(TABLE_MISSIONS)
    .split("\n")
    .filter((l) => l.startsWith(`| ${id} |`))[0];
  const c = brute.slice(2, -2).split(" | ");
  return [c[1], c[2], c[3]];
}

describe("missions importées (table d'étiquetage + suites génériques)", () => {
  it("missions.json est la sortie de l'import, au caractère près", () => {
    expect(readFileSync(join(__dirname, "..", "..", "data", "espace", "missions.json"), "utf8")).toBe(enJson(resultat.missions));
  });

  it("aucun écart de citation : 127 défis lus, 107 missions étiquetées, 20 hors missions", () => {
    expect(resultat.ecarts).toEqual([]);
    expect(resultat.lignes).toHaveLength(127);
    expect(resultat.lignes.filter((l) => l.marche !== null)).toHaveLength(107);
    expect(resultat.horsMissions).toHaveLength(20);
  });

  it("video-39 (marche 1) importée après correction du seed (D10c) : aucune écartée, 107 missions servies", () => {
    expect(resultat.ecartees).toEqual([]);
    expect(servies).toHaveLength(107);
    const parMarche = [1, 2, 3, 4, 5].map((n) => servies.filter((m) => m.marche === n).length);
    expect(parMarche).toEqual([44, 10, 39, 6, 8]);
    expect(servies.find((m) => m.id === "video-39")?.enonce.join(" ")).toContain("« Relativise. » « Justement, j'ai relativisé");
    for (const m of servies) expect(m.enonce.join(" ")).not.toContain("—");
  });

  it("chaque énoncé est le champ exercise de son seed, mot pour mot, à la ligne indiquée par la table", () => {
    const seeds = Object.fromEntries(
      Object.entries(SEEDS_MISSIONS).map(([s, chemin]) => [s, { brut: lire(chemin).split("\n"), json: JSON.parse(lire(chemin)) }]),
    ) as Record<string, { brut: string[]; json: { id: number; exercise: string }[] }>;
    for (const m of servies) {
      const [source, id] = m.id.split("-");
      const exercise = seeds[source].json.find((e) => e.id === Number(id))?.exercise;
      expect({ id: m.id, texte: m.enonce.join("\n\n") }).toEqual({ id: m.id, texte: exercise });
      const [defi, ligne] = ligneTable(m.id);
      expect(defi.replace(/<br><br>/g, "\n\n")).toBe(exercise);
      const n = Number(/^l\. (\d+)$/.exec(ligne)?.[1]);
      const champ = seeds[source].brut[n - 1].trim().replace(/,$/, "");
      expect(champ.startsWith('"exercise": ')).toBe(true);
      expect(JSON.parse(champ.slice('"exercise": '.length))).toBe(exercise);
    }
  });

  it("la marche de chaque mission est celle de la table ; les hors missions sont ceux de la section 5", () => {
    for (const m of servies) expect(ligneTable(m.id)[2]).toBe(String(m.marche));
    const section5 = lire(TABLE_MISSIONS).split("## 5.")[1].split("## 6.")[0];
    const listes = [...section5.matchAll(/^\| ((?:conseil|video)-\d+) \|/gm)].map((x) => x[1]);
    expect([...resultat.horsMissions].sort()).toEqual([...listes].sort());
    for (const id of listes) expect(servies.find((m) => m.id === id)).toBeUndefined();
    const servis = new Set(servies.map((m) => m.id));
    const attendus = resultat.lignes.filter((l) => l.marche !== null && !resultat.ecartees.some((e) => e.id === l.id)).map((l) => l.id);
    expect([...servis].sort()).toEqual([...attendus].sort());
  });

  it("suites : le texte validé de la marche (reco A), zéro tiret cadratin", () => {
    const suites = lireSuites(lire(SUITES_MISSIONS));
    for (const m of servies) expect(m.suites).toEqual(suites.get(m.marche));
    expect(suites.get(1)?.marche).toBe("Bien joué : dit à voix haute, c'est déjà dit pour de bon. Marche suivante : à un proche, par message.");
    expect(suites.get(3)?.bof).toBe("En face, une réplique ne fait pas toujours mouche du premier coup.");
    for (const s of suites.values()) expect(`${s.marche} ${s.bof}`).not.toMatch(/—/);
  });

  it.each(Object.entries(SEEDS_MISSIONS))("seed %s inchangé (diff zéro, P0 s11)", (source, chemin) => {
    const empreinte = createHash("sha256").update(readFileSync(join(RACINE, chemin))).digest("hex");
    expect(empreinte).toBe(EMPREINTES_SEEDS[source as keyof typeof SEEDS_MISSIONS]);
  });
});
