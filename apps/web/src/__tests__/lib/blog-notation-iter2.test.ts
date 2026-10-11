/**
 * @jest-environment node
 *
 * Notation iter2 de /blog/meilleures-blagues-droles-2026 (docs/growth/notation-article-blagues-2026-iter2.md) :
 * D1 « À lire ensuite » sans doublon avec Suivant / Précédent, D2 citations imbriquées
 * en “…” dans les vannes (rendu seul), D3 libellés de cluster lisibles par un visiteur.
 */
import { getArticleBySlug } from "@/lib/blog-articles";
import { renderMarkdown } from "@/components/ui/markdown-renderer";
import { pickRelatedArticles } from "@/lib/blog-related";
import { BLOG_CLUSTERS, getClusterForSlug, getNextInCluster, getPrevInCluster } from "@/lib/blog-clusters";

const NBSP = String.fromCharCode(0xa0);
const a = (slug: string) => ({ slug });
const slugs = (list: { slug: string }[]) => list.map((x) => x.slug);

describe("D1 : « À lire ensuite » ne reprend pas Suivant / Précédent", () => {
  it("retire la carte Suivant et complète avec le suivant du même cluster", () => {
    const related = pickRelatedArticles(
      { cluster: [a("c1"), a("c2"), a("c3"), a("c4")], sameCategory: [a("k1")], others: [a("o1")] },
      ["c1", null],
    );
    expect(slugs(related)).toEqual(["c2", "c3", "c4"]);
  });

  it("retire Suivant et Précédent ; plus d'article du cluster : moins de cartes", () => {
    const related = pickRelatedArticles(
      { cluster: [a("c1"), a("c2"), a("c3")], sameCategory: [a("k1")], others: [a("o1")] },
      ["c1", "c3"],
    );
    expect(slugs(related)).toEqual(["c2"]);
  });

  it("garde les compléments catégorie / récents déjà retenus, sans en ajouter", () => {
    const related = pickRelatedArticles(
      { cluster: [a("c1")], sameCategory: [a("k1"), a("k2")], others: [a("o1")] },
      ["c1"],
    );
    expect(slugs(related)).toEqual(["k1", "k2"]);
  });

  it("sans navigation cluster : comportement inchangé (3 premières cartes)", () => {
    const related = pickRelatedArticles(
      { cluster: [], sameCategory: [a("k1"), a("k2")], others: [a("o1"), a("o2")] },
      [undefined, null],
    );
    expect(slugs(related)).toEqual(["k1", "k2", "o1"]);
  });

  it("meilleures-blagues-droles-2026 : la carte Suivant n'est plus la 1re carte", () => {
    const slug = "meilleures-blagues-droles-2026";
    const next = getNextInCluster(slug);
    expect(next).toBe("phrases-droles-conversations");
    const cluster = getClusterForSlug(slug)!;
    const others = [cluster.pillarSlug, ...cluster.satelliteSlugs].filter((s) => s !== slug).map(a);
    const related = pickRelatedArticles({ cluster: others, sameCategory: [], others: [] }, [next, getPrevInCluster(slug)]);
    expect(slugs(related)).not.toContain(next);
    expect(slugs(related)).toEqual(cluster.satelliteSlugs.slice(1, 4));
  });
});

describe("D2 : citation dans une vanne en “…” (rendu seul)", () => {
  const article = getArticleBySlug("meilleures-blagues-droles-2026")!;
  const stored = new Map(
    [...article.content.matchAll(/^\*\*(\d+)\.\*\* («[^\n]+»)$/gm)].map((m) => [Number(m[1]), m[2]]),
  );
  const html = renderMarkdown(article.content, { shareJokes: true });
  const visible = (n: number): string => {
    const start = html.indexOf(`<div id="vanne-${n}"`);
    const p = html.slice(html.indexOf("<p", start));
    const line = p.slice(0, Math.min(...["<br/>", "</p>"].map((t) => p.indexOf(t)).filter((i) => i >= 0)));
    return line.replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").replace(/&quot;/g, '"');
  };
  const words = (s: string) => s.match(/[\p{L}\p{N}]+/gu) ?? [];

  it("n°39 et n°45 : un seul niveau de « … », la citation en “…”", () => {
    expect(visible(39)).toBe(
      `39. «${NBSP}“Tu fais quoi${NBSP}?” Le message le plus stressant de la langue française. Parce que la vraie question, c'est ce que tu VAS faire. Pour eux.${NBSP}»`,
    );
    expect(visible(45)).toBe(
      `45. «${NBSP}Ma banque m'a écrit${NBSP}: “Merci pour votre fidélité, vous êtes un client précieux.” Même ma banque me friendzone.${NBSP}»`,
    );
  });

  it("aucune des 50 vannes tronquée ni doublement guillemetée", () => {
    expect(stored.size).toBe(50);
    for (const [n, joke] of stored) {
      const v = visible(n);
      expect(v.startsWith(`${n}. «`)).toBe(true);
      expect(v.endsWith("»")).toBe(true);
      expect(v.match(/«/g)).toHaveLength(1);
      expect(v.match(/»/g)).toHaveLength(1);
      expect(v).not.toContain('"');
      expect(words(v)).toEqual([String(n), ...words(joke)]);
    }
  });

  it("texte stocké inchangé : guillemets droits dans la source, partage sur le texte brut", () => {
    expect(stored.get(45)).toContain('"Merci pour votre fidélité, vous êtes un client précieux."');
    expect(html).toContain('data-share-vanne="39" data-text="« &quot;Tu fais quoi ?&quot; Le message');
  });
});

describe("D3 : libellés de cluster lisibles par un visiteur", () => {
  it("libellés client des clusters CATALOGUE, saisonnier et situations", () => {
    const name = (id: string) => BLOG_CLUSTERS.find((c) => c.id === id)?.name;
    expect(name("fort-volume")).toBe("Blagues et vannes à ressortir");
    expect(name("saisonnier")).toBe("Humour de saison");
    expect(name("douleurs-personas")).toBe("Quand l'humour coince");
    expect(getClusterForSlug("meilleures-blagues-droles-2026")?.name).toBe("Blagues et vannes à ressortir");
  });

  it("aucun jargon interne dans un libellé affiché", () => {
    const JARGON = /acquisition|volume|mots-clés|trafic|douleur|persona|cluster|seo|contenu|livraison|\(/i;
    const EM_DASH = String.fromCharCode(0x2014);
    for (const c of BLOG_CLUSTERS) {
      expect(c.name).not.toMatch(JARGON);
      expect(c.name).not.toContain(EM_DASH);
    }
  });
});
