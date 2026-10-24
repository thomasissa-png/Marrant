/**
 * @jest-environment node
 *
 * Liens contextuels S4 (maillage s20, `docs/copy/liens-s4-s20.md` §6 et §7) :
 * 9 phrases validées à l'aveugle. 4 dans les articles statiques (1, 5, 7, 14),
 * 5 en base via `applyBlogLiensS4S20Task` (2, 8, 10, 11, 12), reportées dans
 * `blog-article-rewrites.json`. Appariements 3, 4, 6, 9, 13 NON appliqués.
 */
import { getArticleBySlug } from "@/lib/blog-articles";
import { renderMarkdown } from "@/components/ui/markdown-renderer";
import { REDIRECTED_BLOG_SLUGS, UNPUBLISHED_STATIC_SLUGS } from "@/lib/seo-redirects";
import { BLOG_LIENS_S4_S20_PATCHES } from "@/lib/blog-liens-s4-s20";
import rewrites from "@/data/blog-article-rewrites.json";
import { sansGluon } from "../helpers/texte-normalise";

const STATIC_LINKS = [
  {
    appariement: 1,
    slug: "phrases-droles-conversations",
    target: "conversation-machine-a-cafe",
    anchor: "la conversation à la machine à café",
    phrase:
      "Reste à savoir quoi dire entre deux vannes : notre guide sur [la conversation à la machine à café](/blog/conversation-machine-a-cafe) s'en occupe.",
  },
  {
    appariement: 5,
    slug: "autoderision-interactions",
    target: "se-presenter-avec-humour",
    anchor: "te présenter avec humour",
    phrase:
      "Même principe au tour de table, avec une petite formule en trois temps pour [te présenter avec humour](/blog/se-presenter-avec-humour).",
  },
  {
    appariement: 7,
    slug: "exercices-developper-humour",
    target: "techniques-humoristes-pros",
    anchor: "les techniques des humoristes pros",
    phrase:
      "Au début, les ficelles passent inaperçues : on a décortiqué [les techniques des humoristes pros](/blog/techniques-humoristes-pros), sept en tout.",
  },
  {
    appariement: 14,
    slug: "comment-avoir-de-la-repartie",
    target: "timidite-et-humour",
    anchor: "oser faire rire quand on est timide",
    phrase:
      "C'est peut-être toi, et on t'a préparé un guide pour [oser faire rire quand on est timide](/blog/timidite-et-humour), palier par palier.",
  },
] as const;

/** Texte visible du rendu : balises retirées, entités et espaces typographiques normalisés. */
const visibleText = (html: string): string =>
  html
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&#x27;/g, "'")
    .replace(/[  ]/g, " ")
    .replace(/’/g, "'");
const unlink = (md: string) => md.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
const paragraphs = (content: string) => content.split("\n\n").filter((p) => p.trim());

describe("liens S4 s20 : articles statiques", () => {
  describe.each(STATIC_LINKS.map((l) => [l.appariement, l] as const))("appariement %i", (_n, link) => {
    const article = getArticleBySlug(link.slug);

    it("la phrase validée est présente une seule fois, au caractère près", () => {
      expect(article).toBeDefined();
      expect(article!.content.split(link.phrase).length - 1).toBe(1);
    });

    it("le rendu contient le lien et la phrase visible", () => {
      const html = renderMarkdown(article!.content);
      expect(html).toContain(`<a href="/blog/${link.target}" class="text-accent-link underline underline-offset-2">${link.anchor}</a>`);
      expect(sansGluon(visibleText(html))).toContain(unlink(link.phrase));
    });

    it("ni en FAQ ni dans le dernier paragraphe", () => {
      const faqs = (article!.faqs ?? []).map((f) => f.answer).join("\n");
      expect(faqs).not.toContain(link.target);
      const paras = paragraphs(article!.content);
      expect(paras[paras.length - 1]).not.toContain(link.phrase);
    });

    it("cible publiée (non redirigée, non dépubliée) et aucun tiret cadratin", () => {
      expect(REDIRECTED_BLOG_SLUGS.includes(link.target)).toBe(false);
      expect(UNPUBLISHED_STATIC_SLUGS.has(link.target)).toBe(false);
      expect(link.phrase).not.toContain("—");
    });
  });

  it("appariements écartés (3) et non validés (9) absents", () => {
    expect(getArticleBySlug("phrases-droles-conversations")!.content).not.toContain("(/blog/citation-drole)");
  });
});

describe("liens S4 s20 : articles en base (tâche + copie JSON)", () => {
  const json = new Map(
    (rewrites as { rewrites: { slug: string; content?: string }[] }).rewrites.map((r) => [r.slug, r.content ?? ""]),
  );

  it("couvre exactement les appariements 2, 8, 10, 11, 12", () => {
    const nums = BLOG_LIENS_S4_S20_PATCHES.flatMap((p) => p.replacements.map((r) => r.appariement)).sort((a, b) => a - b);
    expect(nums).toEqual([2, 8, 10, 11, 12]);
  });

  describe.each(BLOG_LIENS_S4_S20_PATCHES.map((p) => [p.slug, p] as const))("%s", (slug, patch) => {
    it("la copie JSON contient chaque « après » une fois et plus aucun « avant »", () => {
      const content = json.get(slug) ?? "";
      for (const r of patch.replacements) {
        expect(content.split(r.after).length - 1).toBe(1);
        expect(content.split(r.before).length - 1).toBe(0);
      }
    });

    it("l'ajout ne retire aucun mot, sans tiret cadratin, cible non redirigée", () => {
      for (const r of patch.replacements) {
        const words = (s: string) => s.match(/[\p{L}\p{N}]+/gu) ?? [];
        const added = words(r.after).length - words(r.before).length;
        expect(added).toBeGreaterThan(0);
        // « après » = « avant » + une insertion d'un seul tenant (rien retiré).
        let pre = 0;
        while (pre < r.before.length && r.before[pre] === r.after[pre]) pre++;
        let suf = 0;
        while (suf < r.before.length - pre && r.before[r.before.length - 1 - suf] === r.after[r.after.length - 1 - suf]) suf++;
        expect(pre + suf).toBe(r.before.length);
        expect(r.after).not.toContain("—");
        const targets = [...r.after.matchAll(/\(\/blog\/([^)]+)\)/g)].map((m) => m[1]);
        for (const t of targets) expect(REDIRECTED_BLOG_SLUGS.includes(t)).toBe(false);
      }
    });
  });
});
