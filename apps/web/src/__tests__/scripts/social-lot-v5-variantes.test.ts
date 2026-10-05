/**
 * @jest-environment node
 *
 * Lot v5 (s15, cycle 6) : test LinkedIn texte / image alterné à partir du 13/10
 * (`[variante:image]` / `[variante:texte]`, paires de même note si possible, compteur
 * par bras) et contrôle « pain » étendu aux posts déjà en base (30 jours tous réseaux).
 * Données simulées, aucune base.
 */
import fs from "node:fs";
import path from "node:path";
import { slidesDuPost } from "@/lib/social/generate-post-image";
import { POOL_STRICT } from "@/config/social-pool";
import { alternerVariantes, buildLotV5, controlerLot, eligibleCarteLinkedIn, type LotPost } from "../../../scripts/content/social-lot-v5";
import { PAIN_IDS } from "../../../scripts/content/social-lot-v5-config";
import { renderLotMarkdown, versLigne } from "../../../scripts/content/social-lot-v5-export";
import { notesDuTexte } from "../../../scripts/content/prepare-social-month";
import { ARTICLES, catalogue } from "../helpers/lot-v5-fixtures";

const lot = buildLotV5({ pool: catalogue(), articles: ARTICLES, recents: [{ date: "2026-10-02", sourceId: "t000" }], seed: "test" });
const li = lot.posts.filter((p) => p.platform === "LINKEDIN");

describe("test LinkedIn texte / image dans le lot", () => {
  it("dès le 13/10, chaque vanne éligible porte un bras ; relais avec lien et textes de marque restent hors test", () => {
    expect(lot.errors).toEqual([]);
    for (const p of li) expect(!!p.variante).toBe(eligibleCarteLinkedIn(p));
    expect(li.filter((p) => p.date < "2026-10-13").every((p) => !p.variante)).toBe(true);
    expect(li.find((p) => p.cle === "L1")?.variante).toBeDefined();
    expect(li.find((p) => p.cle === "L2")?.variante).toBeUndefined();
    expect(li.find((p) => p.cle === "L3")?.variante).toBeUndefined();
    expect(li.filter((p) => p.lien).every((p) => !p.variante)).toBe(true);
  });

  it("compteur par bras : équilibré à 1 près, cohérent avec les posts", () => {
    const v = lot.variantes;
    expect(v.image).toBe(li.filter((p) => p.variante === "image").length);
    expect(v.texte).toBe(li.filter((p) => p.variante === "texte").length);
    expect(v.image + v.texte).toBe(v.eligibles);
    expect(v.eligibles).toBeGreaterThan(10);
    expect(Math.abs(v.image - v.texte)).toBeLessThanOrEqual(1);
    expect(renderLotMarkdown(lot.posts, [], [], lot.stockEligible, "test")).toContain(`image ${v.image}, texte ${v.texte}, hors test ${li.length - v.eligibles}`);
  });

  it("bras image : threadParts [amorce, chute], 1 URL slide 0, marqueur ; le Worker sert bien 1 carte 4:5", () => {
    const img = li.find((p) => p.variante === "image")!;
    const ligne = versLigne(img);
    expect(ligne.threadParts).toEqual(img.lignes);
    expect(ligne.imageUrls).toEqual([`https://deviens-marrant.fr/api/social/image?postId=${img.id}&slide=0`]);
    expect(ligne.directorNote).toMatch(/^\[variante:image\] /);
    const slides = slidesDuPost({ ...ligne, platform: ligne.platform });
    expect(slides).toHaveLength(1);
    expect([slides![0].width, slides![0].height]).toEqual([1080, 1350]);
  });

  it("bras texte : post inchangé (aucune carte, aucune URL), marqueur [variante:texte]", () => {
    const txt = li.find((p) => p.variante === "texte")!;
    const ligne = versLigne(txt);
    expect([ligne.threadParts, ligne.imageUrls]).toEqual([[], []]);
    expect(ligne.directorNote).toMatch(/^\[variante:texte\] /);
    expect(slidesDuPost({ ...ligne, platform: ligne.platform })).toBeNull();
  });
});

describe("alternerVariantes : paires et ordre", () => {
  const modele = li.find((p) => p.variante)!;
  const serie = (...cles: string[]): LotPost[] => cles.map((k, i) => ({
    ...modele, id: `p${i}`, variante: undefined, vannes: [k], date: `2026-11-${String(3 + i * 2).padStart(2, "0")}`,
    scheduledAt: `2026-11-${String(3 + i * 2).padStart(2, "0")}T07:15:00.000Z`,
  }));
  const bras = (ps: LotPost[]) => ps.map((p) => p.variante).join(",");

  it("sans note : alternance simple, ordre inversé d'une paire à l'autre", () => {
    const ps = serie("a", "b", "c", "d");
    expect(alternerVariantes(ps)).toEqual({ eligibles: 4, image: 2, texte: 2, paires: 2, pairesMemeNote: 0 });
    expect(bras(ps)).toBe("image,texte,texte,image");
  });

  it("paires de même note dans les 2 posts suivants quand c'est possible", () => {
    const ps = serie("a", "b", "c", "d");
    const c = alternerVariantes(ps, { a: 9, b: 8.5, c: 9, d: 8.5 });
    expect(c.pairesMemeNote).toBe(2);
    // Paires (a, c) puis (b, d) : a image, c texte ; b texte, d image.
    expect(bras(ps)).toBe("image,texte,texte,image");
    const autre = serie("a", "b", "c", "d");
    alternerVariantes(autre, { a: 9, b: 9, c: 8.5, d: 8.5 });
    expect(bras(autre)).toBe("image,texte,texte,image");
  });

  it("nombre impair : le dernier va au bras le moins servi", () => {
    const ps = serie("a", "b", "c");
    expect(alternerVariantes(ps)).toMatchObject({ image: 2, texte: 1, paires: 1 });
    expect(ps.map((p) => p.variante)).toEqual(["image", "texte", "image"]);
  });
});

describe("« pain » : posts déjà en base compris (30 jours, tous réseaux)", () => {
  const base = lot.posts[0];
  const painLot = [{ ...base, date: "2026-10-20", vannes: ["zz1"], content: "« J'ai acheté du pain. »" }];

  it("un « pain » en base à moins de 30 jours du lot bloque, au-delà non", () => {
    const err = controlerLot(painLot, [{ date: "2026-10-01", sourceId: "x1", platform: "INSTAGRAM", texte: "À envoyer à... « Le pain est cuit. »" }]).errors.join(" ");
    expect(err).toMatch(/pain.*2026-10-01 en base INSTAGRAM x1, 2026-10-20/);
    expect(controlerLot(painLot, [{ date: "2026-09-10", sourceId: "x1", texte: "Du pain." }]).errors).toEqual([]);
  });

  it("vanne « pain » connue par son identifiant, même sans texte", () => {
    expect(PAIN_IDS.length).toBeGreaterThan(0);
    expect(controlerLot(painLot, [{ date: "2026-10-05", sourceId: PAIN_IDS[0] }]).errors.join(" ")).toMatch(/pain/);
  });

  it("deux « pain » tous deux en base : hors du lot, ignorés ; le lot sans « pain » passe", () => {
    const b = [{ date: "2026-10-01", sourceId: "x1", texte: "pain" }, { date: "2026-10-05", sourceId: "x2", texte: "pain" }];
    expect(controlerLot(lot.posts, b).errors).toEqual([]);
    expect(controlerLot([base, ...painLot], [{ date: "2026-10-02", sourceId: "x3", texte: "copain" }]).errors).toEqual([]);
  });
});

describe("notes du pool (paires de même note)", () => {
  it("lit les notes de src/config/social-pool.ts : moyenne des 2 relecteurs", () => {
    const notes = notesDuTexte(fs.readFileSync(path.join(process.cwd(), "src", "config", "social-pool.ts"), "utf-8"));
    expect(Object.keys(notes).sort()).toEqual([...POOL_STRICT].sort());
    expect(notes.cmonlkgeu000ds60wu0gazutb).toBe(8.5);
    expect(notes.cs14jk50c85bb0d73deaebaf).toBe(8.75);
    expect(notesDuTexte("t001 # V1 : 9 / 8,5\nsans note\n# commentaire 1 / 2")).toEqual({ t001: 8.75 });
  });
});
