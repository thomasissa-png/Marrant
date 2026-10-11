/**
 * Lignes de vanne d'un article de blog (markdown `content` de BlogArticle), pour
 * les relais sociaux du lot v5 (s15). Logique pure, sans base.
 *
 * Reconnaît, mot pour mot :
 *  - les lignes numérotées des articles « à forte frappe » : `**N.** texte`
 *    (sauf celles qui contiennent un gabarit « [prénom] ») ;
 *  - les citations en bloc `> « … »`, `> amorce / chute` ou `> texte` (1 ou 2 lignes
 *    par bloc ; un bloc plus long est un discours, ignoré) ;
 *  - le décryptage qui suit : `**Pourquoi ça marche :**` et `**À toi de jouer :**`.
 * Une ligne collée au titre suivant (« …surveille.### 4. ») est coupée et signalée.
 */
import type { CatalogueJoke } from "./social-month-plan";

export interface LigneArticle {
  slug: string;
  /** Numéro affiché (`**N.**`), sinon rang de la vanne dans l'article (1 = première reconnue). */
  rang: number;
  /** Vanne citée dans l'article : `> « … »`, `> amorce / chute` ou ligne numérotée. */
  citee: boolean;
  /** Lignes de la vanne, sans les « » extérieurs (une paire par ligne au post, R6). */
  lignes: string[];
  /** Vanne du catalogue identique (texte normalisé), sinon undefined. */
  catalogueId?: string;
  pourquoi?: string;
  jouer?: string;
  /** Ligne coupée car collée à la suite du texte (défaut de l'article à corriger). */
  coupee?: boolean;
}

/** Normalisation pour comparer deux textes (casse, accents, ponctuation, guillemets). */
export function normaliser(t: string): string {
  return t.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]/g, "");
}

function sansGuillemetsExterieurs(l: string): string {
  const t = l.trim();
  if (t.startsWith("«") && t.endsWith("»")) return t.slice(1, -1).trim();
  return t;
}

/** Coupe ce qui est collé après la vanne (titre « ### », phrase sans espace). */
function couper(l: string): { texte: string; coupee: boolean } {
  let t = l;
  const titre = t.indexOf("###");
  if (titre > 0) t = t.slice(0, titre);
  const colle = t.match(/^(.*?[.!?»])(?=[A-ZÀ-ÖØ-Þ])/u);
  if (colle) t = colle[1];
  t = t.trim();
  return { texte: t, coupee: t !== l.trim() };
}

function premierePhrase(t: string): string {
  const m = t.match(/^(.+?[.!?])(?=\s|$)/u);
  return (m ? m[1] : t).trim();
}

export function extraireLignes(slug: string, contenu: string, catalogue: CatalogueJoke[] = []): LigneArticle[] {
  const out: LigneArticle[] = [];
  const lignes = contenu.split("\n");
  const etat: { courante: LigneArticle | null } = { courante: null };
  const ajouter = (brutes: string[], numero?: number) => {
    const coupes = brutes.map(couper);
    let l = coupes.map((c) => sansGuillemetsExterieurs(c.texte)).filter(Boolean);
    if (l.length === 1 && l[0].includes(" / ")) l = l[0].split(" / ").map((x) => x.trim());
    if (l.length === 0) return;
    const citee = numero !== undefined || brutes.every((b) => b.trim().startsWith("«")) || (brutes.length === 1 && brutes[0].includes(" / "));
    const v: LigneArticle = { slug, rang: numero ?? out.length + 1, lignes: l, citee, coupee: coupes.some((c) => c.coupee) || undefined };
    etat.courante = v;
    out.push(v);
  };
  for (let i = 0; i < lignes.length; i++) {
    const l = lignes[i];
    const num = l.match(/^\*\*(\d+)\.\*\*\s+(.+)$/);
    if (num) {
      if (!num[2].includes("[")) ajouter([num[2]], Number(num[1]));
      else etat.courante = null;
      continue;
    }
    if (/^\s*>/.test(l)) {
      const bloc: string[] = [];
      while (i < lignes.length && /^\s*>/.test(lignes[i])) {
        const c = lignes[i].replace(/^\s*>\s?/, "").trim();
        if (c) bloc.push(c);
        i++;
      }
      i--;
      const premier = bloc[0] ?? "";
      if (bloc.length === 0 || bloc.length > 2 || /^(\*|\d+\.|-)/.test(premier)) continue;
      ajouter(bloc);
      continue;
    }
    const pq = l.match(/^\*\*Pourquoi ça marche\s*:\*\*\s*(.+)$/);
    const c = etat.courante;
    if (pq && c && !c.pourquoi) c.pourquoi = premierePhrase(pq[1]);
    const tj = l.match(/^\*\*À toi de jouer\s*:\*\*\s*(.+)$/);
    if (tj && c && !c.jouer) c.jouer = premierePhrase(tj[1]);
  }
  const parTexte = catalogue.map((j) => ({ j, n: normaliser(`${j.setup}${j.punchline}`) }));
  for (const v of out) {
    const n = normaliser(v.lignes.join(""));
    const m = parTexte.find((c) => c.n.length > 20 && (n === c.n || (n.includes(c.n) && n.length - c.n.length < 40)));
    if (m) v.catalogueId = m.j.id;
  }
  return out;
}

/** Catégorie d'article et nombre de lignes : sert au renvoi du relais (v5 §1). */
export function nombreDuTitre(titre: string): number | null {
  const m = titre.match(/(\d+)\s+[A-Za-zÀ-ÿ]/);
  return m ? Number(m[1]) : null;
}
