/**
 * Répliques reprises mot pour mot : les jeux « Quelle réplique ? » contre leurs situations, « Choisis la
 * chute » contre la vanne du site, les bilans contre les seeds de parcours (ligne citée par le lot).
 */
import { readFileSync } from "fs";
import { join } from "path";
import { RACINE, lireLot } from "./md";

type F = { id: string; type: string; titre: string; contenu: Record<string, unknown> };
export interface Controle {
  ou: string;
  replique: string;
  ok: boolean;
  note?: string;
}

/** Comparaison typographique seulement : guillemets et apostrophes neutralisés, espaces réduits. */
export const neutre = (t: string) =>
  t
    .replace(/‘([^’]*)’/g, " $1 ")
    .replace(/[’']/g, "'")
    .replace(/[«»“”"‘]/g, " ")
    .replace(/\s+/g, " ")
    .replace(/ ([.,!?;:])/g, "$1")
    .replace(/\.\.\./g, "…")
    .trim();

const lignesFichier = (rel: string) => readFileSync(join(RACINE, rel), "utf8").split("\n");

export function verifierJeux(fiches: F[]): Controle[] {
  const parId = new Map(fiches.map((f) => [f.id, f]));
  const sortie: Controle[] = [];
  for (const j of fiches.filter((f) => f.type === "jeu")) {
    const c = j.contenu as { famille: string; matiere?: string[]; situationsReprises?: string[]; ceQuOnAuraitPuDire: string[]; consigne: string };
    if (c.famille === "quelle-replique") {
      const s = parId.get(c.situationsReprises?.[0] ?? "");
      const textes = s ? Object.values((s.contenu as { repliques: Record<string, { texte: string }> }).repliques).map((r) => r.texte) : [];
      for (const m of c.matiere ?? []) {
        const texte = /^[A-C]\.\s*«\s*(.+?)\s*»$/.exec(m)?.[1] ?? m;
        sortie.push({ ou: `${j.id} (${s?.id ?? "situation introuvable"})`, replique: texte, ok: textes.includes(texte) });
      }
    }
    if (c.famille === "choisis-la-chute") {
      const [contenu, chute] = lignesFichier("docs/content/vannes-actives-s19.json").slice(676, 678).map((l) => JSON.parse(`{${l.trim().replace(/,$/, "")}}`) as Record<string, string>);
      const vraie = /«\s*(.+?)\s*»/.exec(c.ceQuOnAuraitPuDire[0])?.[1] ?? "";
      sortie.push({ ou: `${j.id} (vannes-actives-s19.json l. 678)`, replique: vraie, ok: vraie === chute.punchline });
      const debut = /«\s*(.+)\s*»\s*Laquelle/.exec(c.consigne)?.[1] ?? "";
      sortie.push({ ou: `${j.id} (vannes-actives-s19.json l. 677)`, replique: debut, ok: neutre(debut) === neutre(contenu.content), note: "guillemets intérieurs “ ” au lieu de « » (décision du tour C4a)" });
    }
  }
  return sortie;
}

const SEEDS: Record<string, string> = {
  S: "docs/content/parcours-seed.json",
  ST: "docs/content/parcours-storytelling-s18.json",
  BO: "docs/content/parcours-boulot-s19.json",
};

/**
 * Bilans : chaque citation suivie de sa source « (S l.59) » doit se trouver, au signe près (guillemets
 * neutralisés), sur cette ligne du seed ; puis chaque option importée doit être cette citation.
 */
export function verifierBilans(fiches: F[]): Controle[] {
  const sortie: Controle[] = [];
  const cites = new Set<string>();
  for (const ligne of lireLot("c6b-bilans.md").split("\n")) {
    const m = /«\s*(.+?)\s*»(?:\s*\([^)]*\))?\s*\((S|ST|BO) l\.(\d+)\)\s*$/.exec(ligne);
    if (!m) continue;
    let [, texte] = m;
    const [, , seed, n] = m;
    const interne = /“(.+)”/.exec(texte);
    // « Dis-la à voix haute » : la réplique à dire est entre “ ” dans la consigne.
    if (interne && ligne.startsWith("Consigne :")) texte = interne[1];
    const source = lignesFichier(SEEDS[seed])[Number(n) - 1] ?? "";
    const valeur = /:\s*"(.*)",?\s*$/.exec(source)?.[1] ?? source.trim().replace(/^"|",?$/g, "");
    sortie.push({ ou: `C6b, ${seed} l.${n}`, replique: texte, ok: neutre(valeur).includes(neutre(texte)) });
    cites.add(texte);
  }
  // Étapes « dans l'ordre » citées entre « » : leur source est donnée par plage (« S l.471 et l.473 »).
  const tousSeeds = Object.values(SEEDS).flatMap(lignesFichier).map(neutre);
  for (const ligne of lireLot("c6b-bilans.md").split("\n")) {
    const m = /^- [a-c]\)\s*«\s*(.+?)\s*»\s*$/.exec(ligne);
    if (m) sortie.push({ ou: "C6b, étape « dans l'ordre »", replique: m[1], ok: tousSeeds.some((l) => l.includes(neutre(m[1]))) });
  }
  for (const b of fiches.filter((f) => f.type === "bilan")) {
    const elements = (b.contenu as { elements: { forme: string; options?: string[] }[] }).elements;
    for (const o of elements.flatMap((e) => e.options ?? [])) {
      const base = o.replace(/\s\(tu le penses vraiment\)$/, "");
      sortie.push({ ou: `${b.id}, option importée`, replique: o, ok: cites.has(base), note: base !== o ? "indication « (tu le penses vraiment) » hors citation, gardée" : undefined });
    }
  }
  return sortie;
}
