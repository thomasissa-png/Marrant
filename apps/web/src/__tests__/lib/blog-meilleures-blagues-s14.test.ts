/**
 * @jest-environment node
 *
 * Audit growth s14 sur /blog/meilleures-blagues-droles-2026 (R1 à R5) :
 * ancres des H2, sorties vers des routes qui existent, 50 vannes intactes,
 * aucun humoriste nommé, zéro tiret cadratin.
 */
import { createHash } from "crypto";
import { existsSync } from "fs";
import path from "path";
import { getArticleBySlug } from "@/lib/blog-articles";
import { renderMarkdown } from "@/components/ui/markdown-renderer";
import { getVannesTheme } from "@/lib/vannes-themes";
import { BLOG_CTA_BY_SLUG } from "@/config/blog-cta";
import blogArticleRewrites from "@/data/blog-article-rewrites.json";

const SLUG = "meilleures-blagues-droles-2026";
const article = getArticleBySlug(SLUG)!;
const html = renderMarkdown(article.content);
const body = [article.content, ...(article.faqs ?? []).map((f) => `${f.question}\n${f.answer}`)].join("\n");
const links = [...article.content.matchAll(/\]\(([^)]+)\)/g)].map((m) => m[1]);

/** Empreinte des 50 vannes (ligne numérotée + note de jeu) à HEAD avant l'audit s14. */
const VANNES_SHA256 = "a3818503605421853febc78ed6ecf5519b1c099c54b835ae6273de82eb77ec54";

/** Liste reprise de ceo-backlinks.test.ts, complétée des autres noms cités sur le blog. */
const HUMORISTES = ["Paul Mirabel", "Mirabel", "Fary", "Blanche Gardin", "Gardin", "Roman Frayssinet", "Frayssinet", "Waly Dia", "Inès Reg"];

const SOMMAIRE = [
  "quelles-blagues-sortir-en-soiree-celles-qui-marchent-a-partir-de-22h",
  "quelles-blagues-au-bureau-le-lundi-matin-est-un-sport-de-combat",
  "comment-faire-rire-en-date-detendre-un-moment-genant",
  "les-vannes-en-famille-niveau-expert",
  "les-vannes-entre-potes-le-labo-d-essai",
  "les-vannes-whatsapp-reseaux",
];

/** Route statique ou dynamique de l'app (groupes de routes compris). */
function routeExists(href: string): boolean {
  const app = path.join(__dirname, "../../app");
  const segs = href.split(/[?#]/)[0].split("/").filter(Boolean);
  const candidates = ["", "(dashboard)", "(auth)"].map((g) => path.join(app, g));
  return candidates.some((root) => {
    let dir = root;
    for (const seg of segs) {
      if (existsSync(path.join(dir, seg))) dir = path.join(dir, seg);
      else if (existsSync(path.join(dir, "[slug]"))) dir = path.join(dir, "[slug]");
      else return false;
    }
    return existsSync(path.join(dir, "page.tsx"));
  });
}

describe("meilleures-blagues-droles-2026 : audit s14", () => {
  it("slug, titre, meta description et H1 inchangés", () => {
    expect(article.title).toBe("50 blagues drôles à ressortir en 2026");
    expect(article.excerpt).toBe(
      "Les 50 meilleures blagues courtes de 2026, testées et approuvées. Soirée, boulot, date, famille : la bonne vanne pour chaque situation.",
    );
  });

  it("les 50 vannes sont identiques au caractère près", () => {
    const vannes = article.content.match(/^\*\*\d+\.\*\* [\s\S]+?(?=\n\n)/gm) ?? [];
    expect(vannes).toHaveLength(50);
    expect(createHash("sha256").update(vannes.join("\n\n"), "utf8").digest("hex")).toBe(VANNES_SHA256);
  });

  it("chaque ancre du sommaire pointe vers un H2 rendu avec cet id", () => {
    const ids = [...html.matchAll(/<h2 id="([^"]+)"/g)].map((m) => m[1]);
    expect(ids).toHaveLength(8);
    for (const id of SOMMAIRE) {
      expect(ids).toContain(id);
      expect(links).toContain(`#${id}`);
    }
  });

  it("une sortie par grande section, vers un thème qui existe", () => {
    for (const theme of ["soirees", "boulot", "dating", "famille"]) {
      expect(article.content).toContain(`](/vannes/theme/${theme}).\n\n---`);
    }
    const themes = links.filter((l) => l.startsWith("/vannes/theme/")).map((l) => l.split("/").pop()!);
    expect(new Set(themes)).toEqual(new Set(["soirees", "boulot", "dating", "famille", "couple", "gaming", "autoderision"]));
    for (const t of themes) expect(getVannesTheme(t)).not.toBeNull();
  });

  it("bloc après la vanne 50 : blague du jour, thèmes, quiz", () => {
    const after50 = article.content.slice(article.content.indexOf("**50.**"), article.content.indexOf("## Comment bien raconter"));
    expect(after50).toContain("[la blague du jour](/blague-du-jour)");
    expect(after50).toContain("](/quiz-humour)");
    expect(after50).toContain("[autodérision](/vannes/theme/autoderision)");
    expect(article.content).toContain("→ **[La blague du jour](/blague-du-jour)**");
    expect(article.content).not.toContain("vannes du jour](/vannes)");
  });

  it("tout lien interne pointe vers une route qui existe", () => {
    const internal = links.filter((l) => l.startsWith("/"));
    expect(internal.length).toBeGreaterThan(10);
    for (const href of internal) expect([href, routeExists(href)]).toEqual([href, true]);
    // Route dynamique blog : l'article cible doit exister (statique, ou en base via les réécritures s11).
    const dbSlugs = new Set(blogArticleRewrites.rewrites.map((r) => r.slug));
    for (const href of internal.filter((l) => l.startsWith("/blog/"))) {
      const target = href.slice("/blog/".length);
      expect([href, Boolean(getArticleBySlug(target)) || dbSlugs.has(target)]).toEqual([href, true]);
    }
  });

  it("aucun humoriste nommé, aucune promesse de catalogue renouvelé", () => {
    for (const name of HUMORISTES) expect([name, body.includes(name)]).toEqual([name, false]);
    expect(body).not.toMatch(/renouvel/i);
  });

  it("zéro tiret cadratin dans le corps et la FAQ", () => {
    expect(body).not.toContain("—");
  });

  it("CTA de fin recadré, sans toucher au bouton Premium", () => {
    expect(BLOG_CTA_BY_SLUG[SLUG]).toEqual({
      title: "Tu les as lues. Reste à les sortir pour de vrai.",
      text: "Un compte gratuit te donne chaque jour une vanne décryptée et la première étape de chaque parcours, pour passer de la lecture à l'oral. Sans carte.",
      primaryLabel: "Créer mon compte gratuit",
    });
  });
});
