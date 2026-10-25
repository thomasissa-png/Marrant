/**
 * Lecture des textes relus (docs/copy/*.md), pour les tests « mot pour mot » des fichiers de
 * données (`data/lettre/numeros.json`, `data/lettre/hebdo-premium.json`). Même règle que le script
 * qui a généré ces fichiers : corps = lignes « > » sans le « > » (ou « > ») de tête ; une ligne « > »
 * vide = ligne vide ; espaces de fin de l'objet et du pré-en-tête retirés.
 */
import { readFileSync } from "fs";
import { join } from "path";
import { semaineIsoParis } from "@/lib/lettre/calendrier";

const DOCS_COPY = join(__dirname, "..", "..", "..", "..", "..", "docs", "copy");
const lignes = (fichier: string) => readFileSync(join(DOCS_COPY, fichier), "utf8").split("\n");
const sansChevron = (l: string) => l.replace(/^> ?/, "");

export interface LettreLue {
  cle: string;
  objet: string;
  preEntete: string;
  corps: string;
  /** Lettres du mois (fichier source) : en-tête du bloc. */
  datePlancher?: string | null;
  envoiPrevu?: string;
  numero?: number;
}

/** Lettres réservées « à lire » : blocs « ## Jeudi JJ/MM/AAAA », clé = semaine ISO du jeudi. */
export function lettresReserveesALire(fichier: string): LettreLue[] {
  const out: Array<LettreLue & { l: string[] }> = [];
  let cur: (LettreLue & { l: string[] }) | null = null;
  for (const l of lignes(fichier)) {
    const h = l.match(/^## Jeudi (\d{2})\/(\d{2})\/(\d{4})\s*$/);
    if (h) {
      cur = { cle: semaineIsoParis(new Date(Date.UTC(+h[3], +h[2] - 1, +h[1], 12))), objet: "", preEntete: "", corps: "", l: [] };
      out.push(cur);
      continue;
    }
    if (l.startsWith("## ")) cur = null;
    if (!cur) continue;
    const o = l.match(/^\*\*Objet :\*\* (.*)$/);
    const p = l.match(/^\*\*Pré-en-tête :\*\* (.*)$/);
    if (o) cur.objet = o[1].trimEnd();
    else if (p) cur.preEntete = p[1].trimEnd();
    else if (l.startsWith(">")) cur.l.push(sansChevron(l));
  }
  return out.map(({ l, ...n }) => ({ ...n, corps: l.join("\n") }));
}

/** Lettres du mois, fichier source (marqueurs d'invitation compris) : blocs « ## N. Jeudi … (période …) ». */
export function lettresDuMoisSource(fichier = "lettres-du-mois-s22.md"): LettreLue[] {
  const out: Array<LettreLue & { l: string[]; fini: boolean }> = [];
  let cur: (LettreLue & { l: string[]; fini: boolean }) | null = null;
  for (const l of lignes(fichier)) {
    const h = l.match(/^## (\d)\. Jeudi .*\(période (\d{4}-\d{2}), date plancher (null|\d{4}-\d{2}-\d{2}), envoi ([0-9T:+-]+)\)/);
    if (h) {
      cur = { cle: h[2], numero: Number(h[1]), datePlancher: h[3] === "null" ? null : h[3], envoiPrevu: h[4], objet: "", preEntete: "", corps: "", l: [], fini: false };
      out.push(cur);
      continue;
    }
    if (l.startsWith("## ")) cur = null;
    if (!cur || cur.fini) continue;
    const o = l.match(/^\*\*Objet\*\* \(\d+ car\.\) : (.*)$/);
    const p = l.match(/^\*\*Pré-en-tête\*\* : (.*)$/);
    if (o) cur.objet = o[1].trimEnd();
    else if (p) cur.preEntete = p[1].trimEnd();
    else if (cur.preEntete && l.startsWith(">")) cur.l.push(sansChevron(l));
    else if (cur.l.length > 0 && l.trim() !== "") cur.fini = true;
  }
  return out.map(({ l, fini: _fini, ...n }) => ({ ...n, corps: l.join("\n") }));
}

/** Lettres du mois « à lire » (encart Premium entre crochets au lieu des marqueurs) : blocs « ## N°k, jeudi … ». */
export function lettresDuMoisALire(fichier = "lettres-du-mois-s22-a-lire.md"): LettreLue[] {
  const out: Array<LettreLue & { l: string[] }> = [];
  let cur: (LettreLue & { l: string[] }) | null = null;
  for (const l of lignes(fichier)) {
    const h = l.match(/^## N°(\d), jeudi /);
    if (h) {
      cur = { cle: h[1], numero: Number(h[1]), objet: "", preEntete: "", corps: "", l: [] };
      out.push(cur);
      continue;
    }
    if (l.startsWith("## ")) cur = null;
    if (!cur) continue;
    const o = l.match(/^\*\*Objet :\*\* (.*)$/);
    const p = l.match(/^\*\*Pré-en-tête :\*\* (.*)$/);
    if (o) cur.objet = o[1].trimEnd();
    else if (p) cur.preEntete = p[1].trimEnd();
    else if (l.startsWith(">")) cur.l.push(sansChevron(l));
  }
  return out.map(({ l, ...n }) => ({ ...n, corps: l.join("\n") }));
}

/** Version « à lire » d'un corps source : marqueurs d'invitation remplacés par les crochets de l'encart. */
export function versionALire(corps: string): string {
  return corps
    .replace("[[invitation-premium]]", "**[Encart Premium, inscrits par adresse seulement]**")
    .replace("[[/invitation-premium]]", "**[Fin de l'encart]**");
}
