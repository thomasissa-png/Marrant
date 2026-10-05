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
    expect(after50).toContain("- [Autodérision](/vannes/theme/autoderision)");
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
      text: "Le compte gratuit t'ouvre ton contenu quotidien et la première étape de chaque parcours : de quoi t'entraîner à les placer au bon moment, pas juste à les connaître.",
      primaryLabel: "Créer mon compte gratuit",
      note: "Gratuit, sans carte. Les vannes de cette page restent en accès libre, compte ou pas.",
    });
    // La vanne décryptée du jour est publique : le CTA ne la vend plus comme avantage du compte.
    expect(Object.values(BLOG_CTA_BY_SLUG[SLUG]).join(" ")).not.toMatch(/vanne décryptée/);
    // « Sans carte » une seule fois.
    expect(Object.values(BLOG_CTA_BY_SLUG[SLUG]).join(" ").match(/sans carte/gi)).toHaveLength(1);
  });
});

describe("meilleures-blagues-droles-2026 : notation iter1", () => {
  it("C1 : sommaire en 2e paragraphe, avec l'ancre Inclassables", () => {
    const paragraphs = article.content.split("\n\n");
    expect(paragraphs[1].startsWith("Va direct à ta situation : ")).toBe(true);
    expect(paragraphs[1]).toContain("[Inclassables](#les-pepites-inclassables)");
    expect(paragraphs[2].startsWith("Chaque vanne ici a passé un test simple")).toBe(true);
    expect(html).toContain('<h2 id="les-pepites-inclassables"');
    expect(article.content).not.toContain("c'est un muscle, et cet article est ta salle de sport");
  });

  it("C2 : le lien machine à café mène au parcours Machine à Café", () => {
    expect(article.content).toContain("[devenir la personne qu'on attend à la machine à café](/parcours/machine-a-cafe)");
    expect(routeExists("/parcours/machine-a-cafe")).toBe(true);
    // /conseils garde son lien en fin d'article.
    expect(article.content).toContain("](/conseils)");
  });

  it("C3, C9, C10 : plus de doublon blague du jour, plus de « Toi aussi », plus de gabarit « Plus de vannes de »", () => {
    expect(article.content.match(/avec sa chute et son décryptage/g)).toHaveLength(1);
    expect(article.content).toContain("→ **[La blague du jour](/blague-du-jour)** : celle d'aujourd'hui, et demain une autre.");
    expect(article.content).not.toContain("Toi aussi.");
    expect(article.content).not.toMatch(/Plus de vannes (de|pour)/);
  });

  it("C7 : un emplacement Partager par vanne, H2 intacts, rien sans l'option", () => {
    const shared = renderMarkdown(article.content, { shareJokes: true });
    const slots = [...shared.matchAll(/data-share-vanne="(\d+)"/g)].map((m) => Number(m[1]));
    expect(slots).toEqual(Array.from({ length: 50 }, (_, i) => i + 1));
    expect(shared.match(/<h2 id=/g)).toHaveLength(8);
    for (let n = 1; n <= 50; n++) expect(shared).toContain(`<div id="vanne-${n}"`);
    expect(html).not.toContain("data-share-vanne");
    // Texte partagé = la vanne entière, guillemets échappés pour l'attribut.
    expect(shared).toContain(
      'data-share-vanne="1" data-text="« J\'ai mis mon réveil 30 minutes plus tôt pour &quot;avoir du temps pour moi le matin&quot;. Le temps pour moi c\'est appuyer sur snooze 6 fois. Techniquement, c\'est un choix. »"',
    );
  });

  it("C8 : thèmes après la vanne 50 en puces de 44 px", () => {
    const shared = renderMarkdown(article.content);
    for (const theme of ["boulot", "couple", "dating", "soirees", "famille", "gaming", "autoderision"]) {
      expect(shared).toContain(`<li><a href="/vannes/theme/${theme}" class="inline-flex min-h-[44px] items-center`);
    }
  });

  it("aucun « 1 500+ » ajouté dans le corps", () => {
    expect(article.content).not.toMatch(/1[\s ]?500/);
  });
});
