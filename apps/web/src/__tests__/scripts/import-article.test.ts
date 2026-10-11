/**
 * @jest-environment node
 *
 * Import d'un article préparé (scripts/content/import-article.ts) : dry-run sur
 * les brouillons réels S1 (Halloween) et S8 (repas de famille), refus, et --update.
 */
import fs from "node:fs";
import path from "node:path";
import { formatChange, prepareImport, updateRow, type SqlQuery } from "../../../scripts/content/import-article";
import { parseMetadata } from "../../../scripts/content/article-markdown";

const DOCS = path.resolve(__dirname, "../../../../../docs/copy/articles-q4");
const S1 = fs.readFileSync(path.join(DOCS, "S1-halloween.md"), "utf-8");
const S8 = fs.readFileSync(path.join(DOCS, "S8-repas-de-famille.md"), "utf-8");
const NOW = new Date("2026-09-30T12:00:00Z");

/** Base simulée : slugs BlogArticle donnés, parcours et fiches catalogue actifs. */
function fakeDb(blog: Record<string, { isPublished: boolean; publishedAt: string | null } & Record<string, unknown>> = {}): SqlQuery {
  return async (sql, params = []) => {
    if (sql.includes(`from "BlogArticle"`)) {
      const row = blog[String(params[0])];
      return row ? [row] : [];
    }
    if (sql.includes(`from "LearningPath"`)) return params[0] === "repartie" ? [{ "?column?": 1 }] : [];
    return [];
  };
}

describe("parseMetadata", () => {
  it("lit les puces multi-clés « · » sans couper les listes de liens", () => {
    const meta = parseMetadata(S1);
    expect(meta["date de publication"]).toBe("2026-10-05 (lundi)");
    expect(meta.category).toBe("CATALOGUE");
    expect(meta.readingtime).toBe("6 min");
    expect(meta["liens internes"]).toContain("`/videos`");
  });
});

describe("dry-run sur S1-halloween.md", () => {
  it("produit la ligne BlogArticle non publiée, datée du lundi 05/10 05:00 UTC", async () => {
    const res = await prepareImport(S1, { now: NOW });
    expect(res.errors).toEqual([]);
    expect(res.row).toMatchObject({
      slug: "blagues-halloween-soiree-deguisee",
      title: "Blagues d'Halloween : 8 vannes pour ta soirée déguisée",
      category: "CATALOGUE",
      readingTime: "6 min",
      targetKeyword: "blagues halloween adultes",
      metaTitle: null,
      isPublished: false,
      publishedAt: "2026-10-05T05:00:00.000Z",
      generatedByAI: false,
    });
    expect(res.row.content.startsWith("> **En bref :** Entre adultes")).toBe(true);
    expect(res.row.content).not.toContain("## Métadonnées");
    expect(res.row.content).not.toContain("—");
    expect(res.row.content.trimEnd().endsWith("une raison de te répondre.")).toBe(true);
    expect(res.faqCount).toBe(4);
    expect(res.links).toHaveLength(10);
    expect(res.links.filter((l) => l.status === "missing")).toEqual([]);
  });

  it("avec la base : slug libre, tous les liens vérifiés", async () => {
    const q = fakeDb({ "blague-drole-7-criteres-pepite": { isPublished: true, publishedAt: "2026-05-19 01:11:09" } });
    const res = await prepareImport(S1, { now: NOW, q, strictLinks: true });
    expect(res.errors).toEqual([]);
    expect(res.links.every((l) => l.status === "ok")).toBe(true);
  });

  it("--heure-utc=6 : publication à 06:00 UTC", async () => {
    expect((await prepareImport(S1, { now: NOW, hourUtc: 6 })).row.publishedAt).toBe("2026-10-05T06:00:00.000Z");
  });
});

describe("dry-run sur S8-repas-de-famille.md", () => {
  it("produit la ligne BlogArticle du lundi 23/11 avec 5 questions de FAQ", async () => {
    const res = await prepareImport(S8, { now: NOW });
    expect(res.errors).toEqual([]);
    expect(res.row).toMatchObject({
      slug: "repas-de-famille-questions-genantes-humour",
      title: "Repas de famille : répondre aux questions gênantes",
      category: "REPARTIE",
      readingTime: "8 min",
      publishedAt: "2026-11-23T05:00:00.000Z",
      isPublished: false,
    });
    expect(res.faqCount).toBe(5);
  });

  it("lien vers un article planifié AVANT lui : accepté ; planifié APRÈS : refusé", async () => {
    const withLink = S8.replace("[parcours Répartie](/parcours/repartie)", "[S1](/blog/blagues-halloween-soiree-deguisee)");
    const before = fakeDb({ "blagues-halloween-soiree-deguisee": { isPublished: false, publishedAt: "2026-10-05 05:00:00" } });
    expect((await prepareImport(withLink, { now: NOW, q: before, strictLinks: true })).errors).toEqual([]);
    const after = fakeDb({ "blagues-halloween-soiree-deguisee": { isPublished: false, publishedAt: "2026-12-07 05:00:00" } });
    expect((await prepareImport(withLink, { now: NOW, q: after, strictLinks: true })).errors).toEqual([
      expect.stringContaining("/blog/blagues-halloween-soiree-deguisee"),
    ]);
  });
});

describe("refus", () => {
  const errorsOf = async (md: string, q?: SqlQuery) => (await prepareImport(md, { now: NOW, q, strictLinks: !!q })).errors;

  it("slug déjà en base", async () => {
    const q = fakeDb({ "blagues-halloween-soiree-deguisee": { isPublished: false, publishedAt: null } });
    expect(await errorsOf(S1, q)).toContainEqual(expect.stringContaining("déjà présent en base"));
  });

  it("slug déjà pris dans blog-articles.ts", async () => {
    const md = S1.replace("`blagues-halloween-soiree-deguisee`", "`comment-devenir-drole`");
    expect(await errorsOf(md)).toContainEqual(expect.stringContaining("déjà pris"));
  });

  it("tiret cadratin dans le titre ou le contenu", async () => {
    const md = S1.replace("8 vannes pour ta soirée", "8 vannes — pour ta soirée").replace("Cette année,", "Cette année —");
    const errors = await errorsOf(md);
    expect(errors.filter((e) => e.includes("Tiret cadratin"))).toHaveLength(2);
  });

  it("avertissement si la date n'est pas un jeudi (calendrier forte frappe, s14)", async () => {
    const warningsOf = async (md: string) => (await prepareImport(md, { now: NOW })).warnings;
    expect(await warningsOf(S1)).toContainEqual(expect.stringContaining("n'est pas un jeudi"));
    const jeudi = await warningsOf(S1.replace("2026-10-05 (lundi)", "2026-10-08 (jeudi)"));
    expect(jeudi.filter((w) => w.includes("n'est pas un"))).toHaveLength(0);
  });

  it("commentaire HTML dans le contenu (« <!-- FIN --> » en fin de FAQ, notation B1 iter2)", async () => {
    expect(await errorsOf(S1)).not.toContainEqual(expect.stringContaining("commentaire HTML"));
    const errors = await errorsOf(`${S1.trimEnd()}\n\n<!-- FIN -->\n`);
    expect(errors).toContainEqual(expect.stringContaining("commentaire HTML (« <!-- »)"));
  });

  it("liens internes inexistants, redirigés ou non vérifiables à l'écriture", async () => {
    const md = S1.replace("(/videos)", "(/page-fantome)")
      .replace("(/vannes/theme/soirees)", "(/vannes/theme/inconnu)")
      .replace("(/blog/comment-avoir-de-la-repartie)", "(/blog/techniques-repartie)");
    const errors = await errorsOf(md);
    expect(errors).toEqual(
      expect.arrayContaining([
        expect.stringContaining("/page-fantome"),
        expect.stringContaining("/vannes/theme/inconnu"),
        expect.stringContaining("redirige vers /blog/comment-avoir-de-la-repartie"),
      ]),
    );
    const offlineStrict = await prepareImport(S1, { now: NOW, strictLinks: true });
    expect(offlineStrict.errors).toContainEqual(expect.stringContaining("/parcours/repartie"));
  });

  it("date antérieure à la semaine en cours", async () => {
    expect(await errorsOf(S1.replace("2026-10-05 (lundi)", "2026-09-21 (lundi)"))).toContainEqual(
      expect.stringContaining("antérieure à la semaine en cours"),
    );
  });

  it("catégorie inconnue et FAQ non conforme", async () => {
    const md = S1.replace("**category** : CATALOGUE", "**category** : HALLOWEEN").replace(
      "Oui, et c'est même plus drôle",
      "Oui, voir [ici](/vannes), et c'est même plus drôle",
    );
    const errors = await errorsOf(md);
    expect(errors).toContainEqual(expect.stringContaining("Catégorie inconnue"));
    expect(errors).toContainEqual(expect.stringContaining("Section FAQ non conforme"));
  });
});

describe("--update (article programmé)", () => {
  const SLUG = "blagues-halloween-soiree-deguisee";
  /** Base simulée + l'article publié vers lequel pointe S1. */
  const db = (blog: Parameters<typeof fakeDb>[0] = {}) =>
    fakeDb({ "blague-drole-7-criteres-pepite": { isPublished: true, publishedAt: "2026-05-19 01:11:09" }, ...blog });
  const update = (q?: SqlQuery, md = S1) => prepareImport(md, { now: NOW, q, strictLinks: !!q, update: true });

  it("refus si l'article est absent de la base", async () => {
    const res = await update(db());
    expect(res.errors).toEqual([expect.stringContaining("absent de la base")]);
    expect(res.changes).toBeUndefined();
  });

  it("refus si l'article est déjà publié", async () => {
    const res = await update(db({ [SLUG]: { isPublished: true, publishedAt: "2026-10-05 05:00:00" } }));
    expect(res.errors).toEqual([expect.stringContaining("déjà publié, modification refusée")]);
  });

  it("refus si l'article est non publié mais retiré (publishedAt avant la semaine en cours)", async () => {
    const res = await update(db({ [SLUG]: { isPublished: false, publishedAt: "2026-05-04 05:00:00" } }));
    expect(res.errors).toEqual([expect.stringContaining("pas programmé")]);
  });

  it("article programmé : accepté, diff limité aux champs qui changent", async () => {
    const current = (await prepareImport(S1, { now: NOW })).row;
    const q = db({
      [SLUG]: {
        ...current,
        isPublished: false,
        publishedAt: "2026-10-05 05:00:00",
        title: "Ancien titre",
        content: `${current.content}\nLigne retirée`,
      },
    });
    const res = await update(q);
    expect(res.errors).toEqual([]);
    expect(res.changes?.map((c) => c.field)).toEqual(["title", "content"]);
    expect(res.changes?.[0]).toEqual({ field: "title", before: "Ancien titre", after: current.title });
    expect(formatChange(res.changes![1])).toContain("- Ligne retirée");

    const already = await update(db({ [SLUG]: { ...current, publishedAt: "2026-10-05 05:00:00" } }));
    expect(already.changes).toEqual([]);
  });

  it("article programmé : tous les champs à jour sont détectés (dont publishedAt et FAQ dans content)", async () => {
    const q = db({
      [SLUG]: {
        isPublished: false, publishedAt: "2026-10-12 05:00:00", title: "t", excerpt: "e", content: "c",
        category: "REPARTIE", readingTime: "2 min", metaTitle: "m", metaDescription: "d",
      },
    });
    const res = await update(q);
    expect(res.errors).toEqual([]);
    expect(res.changes?.map((c) => c.field)).toEqual([
      "title", "excerpt", "content", "category", "readingTime", "metaTitle", "metaDescription", "publishedAt",
    ]);
    expect(res.changes?.find((c) => c.field === "publishedAt")).toEqual({
      field: "publishedAt", before: "2026-10-12T05:00:00.000Z", after: "2026-10-05T05:00:00.000Z",
    });
    expect(res.changes?.find((c) => c.field === "metaTitle")?.after).toBeNull();
  });

  it("mêmes validations que l'import (tiret cadratin, catégorie)", async () => {
    const md = S1.replace("8 vannes pour ta soirée", "8 vannes — pour ta soirée").replace("**category** : CATALOGUE", "**category** : HALLOWEEN");
    const res = await update(db({ [SLUG]: { isPublished: false, publishedAt: "2026-10-05 05:00:00" } }), md);
    expect(res.errors).toEqual(
      expect.arrayContaining([expect.stringContaining("Tiret cadratin"), expect.stringContaining("Catégorie inconnue")]),
    );
  });

  it("lien vers un article planifié avant celui-ci : message « article planifié le …, avant celui-ci »", async () => {
    const withLink = S8.replace("[parcours Répartie](/parcours/repartie)", `[S1](/blog/${SLUG})`);
    const q = db({
      [SLUG]: { isPublished: false, publishedAt: "2026-10-05 05:00:00" },
      "repas-de-famille-questions-genantes-humour": { isPublished: false, publishedAt: "2026-11-23 05:00:00" },
    });
    const res = await prepareImport(withLink, { now: NOW, q, strictLinks: true, update: true });
    expect(res.errors).toEqual([]);
    expect(res.links.find((l) => l.path === `/blog/${SLUG}`)).toEqual({
      path: `/blog/${SLUG}`, status: "ok", reason: "article planifié le 2026-10-05, avant celui-ci",
    });
  });

  it("updateRow : n'écrit que sur une ligne non publiée, échoue sinon", async () => {
    const { row } = await prepareImport(S1, { now: NOW });
    const calls: { sql: string; params: unknown[] }[] = [];
    const q: SqlQuery = async (sql, params = []) => {
      calls.push({ sql, params });
      return [{ id: "c1" }];
    };
    await expect(updateRow(q, row)).resolves.toBe("c1");
    expect(calls[0].sql).toMatch(/^update "BlogArticle"/);
    expect(calls[0].sql).toContain(`where slug = $1 and "isPublished" = false`);
    expect(calls[0].sql).toContain(`"updatedAt" = now()`);
    expect(calls[0].params).toEqual([
      row.slug, row.title, row.excerpt, row.content, row.category, row.readingTime, null, row.metaDescription, row.publishedAt,
    ]);
    await expect(updateRow(async () => [], row)).rejects.toThrow("absent ou publié entre-temps");
  });
});
