/** @jest-environment node */
/**
 * Tests — cartes sociales « piste A » (audit visuels s15) :
 * typographie française, composition des carrousels, étiquettes.
 */
import { renderToStaticMarkup } from "react-dom/server";
import { typo, NBSP, NNBSP } from "@/lib/social/typo";
import {
  carrouselVanne,
  carrouselArticle,
  carrouselConseil,
  carteVanneUnique,
  carteArticleUnique,
  extraireListe,
  surtitreExtrait,
  texteAccompagnement,
  LINKEDIN_AVANT_VOIR_PLUS,
} from "@/lib/social/carrousel-piste-a";
import { segmentsLigne } from "@/lib/social/templates/cartes-piste-a";
import { readFileSync } from "fs";
import { join } from "path";
import { enregistrerPolice } from "@/lib/social/mesure-texte";

// Mêmes polices que le rendu : la mise en lignes mesure les vrais glyphes.
beforeAll(() => {
  for (const [poids, f] of [[700, "PlusJakartaSans-Bold.ttf"], [800, "PlusJakartaSans-ExtraBold.ttf"]] as const) {
    const b = readFileSync(join(process.cwd(), "public", "fonts", f));
    enregistrerPolice("Plus Jakarta Sans", poids, b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength) as ArrayBuffer);
  }
});

const html = (el: React.ReactElement) => renderToStaticMarkup(el);
/** Texte visible, espaces insécables normalisées (blocs flex rendus séparément). */
const texte = (el: React.ReactElement) =>
  html(el)
    .replace(/<[^>]+>/g, " ")
    .replace(/&#x27;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/[\s\u00A0\u202F\u2009]+/g, " ")
    // une ligne = plusieurs segments (ponctuation rapprochée) : on recolle
    .replace(/ ([.,…’])/g, "$1")
    .replace(/’ /g, "’");

describe("typo()", () => {
  it("remplace l'apostrophe droite par ’", () => {
    expect(typo("L'audioguide s'est éteint")).toBe("L’audioguide s’est éteint");
  });

  it("met une insécable avant : et une fine insécable avant ; ? !", () => {
    expect(typo("Blagues d'Halloween : 8 vannes")).toContain(`Halloween${NBSP}:`);
    expect(typo("T'es beau aujourd'hui!")).toContain(`aujourd’hui${NNBSP}!`);
    expect(typo("On mange quoi ?")).toContain(`quoi${NNBSP}?`);
    expect(typo("Ok ?!")).toBe(`Ok${NNBSP}?!`);
  });

  it("convertit les guillemets droits et imbriqués (« » puis “ ”)", () => {
    expect(typo('Il dit "salut".')).toContain(`«${NBSP}salut${NBSP}».`);
    expect(typo("« Ma carte disait « la timidité ». »")).toContain(`“la${NBSP}timidité”`);
  });

  it("colle le nombre au mot suivant et les petits mots au mot suivant", () => {
    expect(typo("Les 7 autres vannes")).toContain(`7${NBSP}autres`);
    expect(typo("faire rire à travers un écran")).toContain(`à${NBSP}travers`);
  });

  it("colle les deux derniers mots, sans former de bloc de plus de 18 caractères", () => {
    expect(typo("J'ai hoché la tête pendant deux heures.")).toMatch(new RegExp(`deux${NBSP}heures\\.$`));
    const t = typo("On n'en a jamais parlé.");
    expect(t).toContain(`a${NBSP}jamais${NBSP}parlé.`);
    expect(typo("pour ta soirée magnifiquement déguisée")).not.toContain(`magnifiquement${NBSP}déguisée`);
  });

  it("traite chaque ligne comme un paragraphe", () => {
    expect(typo("Une ligne ici\nDeux lignes là").split("\n")).toHaveLength(2);
  });
});

describe("carrousels piste A v3", () => {
  it("vanne : 2 slides 4:5, amorce puis chute sur aplat, sans étiquette ni pagination", () => {
    const slides = carrouselVanne({ amorce: "Amorce ici.", chute: ["Chute là."] });
    expect(slides).toHaveLength(2);
    slides.forEach((s) => expect([s.width, s.height]).toEqual([1080, 1350]));
    const s1 = html(slides[0].element);
    expect(texte(slides[0].element)).toContain("Amorce ici.");
    expect(texte(slides[0].element)).not.toContain("Chute");
    expect(s1).toContain("Glisse");
    expect(s1).not.toMatch(/\d\/\d/);
    expect(s1).not.toMatch(/La Vanne|Article|Conseil/i);
    expect(s1).not.toContain("«"); // chevron réservé à la réplique
    expect(html(slides[1].element)).toContain("#6D28D9");
    expect(texte(slides[1].element)).toContain("Chute là.");
  });

  it("vanne : texte alternatif = amorce sur la slide 1, amorce + chute sur la slide 2", () => {
    const [a, b] = carrouselVanne({ amorce: "L'amorce.", chute: ["La chute.", "Second temps."] });
    expect(a.alt).toBe("L'amorce.");
    expect(b.alt).toBe("L'amorce. La chute. Second temps.");
  });

  it("article : couverture, amorce de l'extrait, chute sur aplat, fin avec bouton « Lien en bio »", () => {
    const slides = carrouselArticle({
      titre: "Blagues d'Halloween : 8 vannes pour ta soirée déguisée",
      extrait: { rang: 2, amorce: "J'ai passé la soirée à expliquer mon costume.", chute: "À minuit, guide de musée." },
    });
    expect(slides).toHaveLength(4);
    expect(html(slides[0].element)).toContain("Article");
    expect(html(slides[0].element)).toContain(">8<");
    expect(texte(slides[1].element)).toContain("Vanne n° 2 sur 8");
    expect(texte(slides[1].element)).not.toContain("minuit"); // jamais amorce et chute ensemble
    expect(texte(slides[2].element)).toContain("À minuit, guide de musée.");
    expect(texte(slides[2].element)).not.toContain("costume");
    expect(texte(slides[3].element)).toContain("Les 7 autres vannes");
    expect(texte(slides[3].element)).toContain("Lien en bio");
    expect(texte(slides[3].element)).not.toContain("sur deviens-marrant.fr");
    expect(slides[2].alt).toBe("J'ai passé la soirée à expliquer mon costume. À minuit, guide de musée.");
  });

  it("article sans extrait : couverture + fin seulement", () => {
    expect(carrouselArticle({ titre: "Humour en visio : faire rire" })).toHaveLength(2);
  });

  it("surtitreExtrait : nom au singulier repris du titre", () => {
    expect(surtitreExtrait("vannes", 2, 8)).toBe("Vanne n° 2 sur 8");
    expect(surtitreExtrait("accroches", 3, 5)).toBe("Accroche n° 3 sur 5");
  });

  it("conseil : situation, réplique (chevron), principe + bouton ; LinkedIn = lien en commentaire", () => {
    const c = {
      titreConseil: "L'ironie bienveillante",
      situation: "Ton pote arrive en retard.",
      replique: ["Pile à l'heure."],
      principe: "Le sourire et le ton font tout le travail.",
    };
    const slides = carrouselConseil(c);
    expect(slides).toHaveLength(3);
    expect(html(slides[0].element)).toContain("Conseil");
    expect(texte(slides[0].element)).toContain("L’ironie bienveillante");
    expect(texte(slides[1].element)).toContain("«");
    expect(texte(slides[1].element)).toContain("Pile à l’heure.");
    expect(texte(slides[2].element)).toContain("Le sourire et le ton font tout le travail.");
    expect(texte(slides[2].element)).toContain("Lien en bio");
    expect(texte(carrouselConseil(c, "linkedin")[2].element)).toContain("Lien en commentaire");
  });

  it("aucun texte sous 28 px, pied et étiquettes ≥ 32 px, ni ancien gabarit", () => {
    const tous = [
      ...carrouselVanne({ amorce: "A.", chute: ["B."] }),
      ...carrouselArticle({ titre: "Titre : 5 accroches", extrait: { rang: 1, amorce: "A.", chute: "B." } }),
      ...carrouselConseil({ titreConseil: "T", situation: "S.", replique: ["R."], principe: "P." }),
    ].map((s) => html(s.element));
    for (const h of tous) {
      const tailles = [...h.matchAll(/font-size:(\d+)px/g)].map((m) => Number(m[1]));
      expect(Math.min(...tailles)).toBeGreaterThanOrEqual(32);
      expect(h).not.toMatch(/italic|linear-gradient/);
      expect(h).toContain("deviens-marrant.fr");
      expect(h).toContain("Plus Jakarta Sans");
    }
  });

  it("chaque ligne est un bloc sans retour automatique, sans espace insécable affichée", () => {
    const h = html(carrouselVanne({ amorce: "Dans le TGV, la seule prise qui marche est sous le siège d'un inconnu.", chute: ["x."] })[0].element);
    expect(h).toContain("white-space:pre");
    expect(h).not.toMatch(/[\u00A0\u202F]/);
  });

  it("segmentsLigne rapproche point, virgule et apostrophe", () => {
    const s = segmentsLigne("TGV, la seule d’un inconnu.");
    expect(s.find((x) => x.texte === ",")?.avant).toBeLessThan(0);
    expect(s.find((x) => x.texte === ".")?.avant).toBeLessThan(0);
    expect(s.find((x) => x.texte === "’")?.apres).toBeLessThan(0);
    expect(s.map((x) => x.texte).join("")).toBe("TGV, la seule d’un inconnu.");
  });
});

describe("déclinaisons X et LinkedIn", () => {
  const tgv = { amorce: "Dans le TGV, la seule prise.", chute: ["Chute."] };

  it("vanne : chute seule en 1600×900 (X) et 1200×627 (LinkedIn), alt = amorce + chute", () => {
    const x = carteVanneUnique("x", tgv);
    const li = carteVanneUnique("linkedin", tgv);
    expect([x.width, x.height]).toEqual([1600, 900]);
    expect([li.width, li.height]).toEqual([1200, 627]);
    expect(html(x.element)).not.toMatch(/\d\/\d/);
    expect(texte(x.element)).not.toContain("TGV");
    expect(x.alt).toBe("Dans le TGV, la seule prise. Chute.");
    expect(texteAccompagnement(tgv)).toBe("Dans le TGV, la seule prise.");
  });

  it("LinkedIn : amorce > 140 caractères = repli sur une carte amorce + chute", () => {
    const longue = { amorce: "a".repeat(80) + " " + "b".repeat(70), chute: ["Chute."] };
    expect(longue.amorce.length).toBeGreaterThan(LINKEDIN_AVANT_VOIR_PLUS);
    expect(texte(carteVanneUnique("linkedin", longue).element)).toContain("Chute.");
    expect(texte(carteVanneUnique("linkedin", longue).element)).toContain("aaaa");
    expect(texte(carteVanneUnique("x", longue).element)).not.toContain("aaaa");
  });

  it("article : couverture X avec étiquette, LinkedIn sans étiquette", () => {
    const li = carteArticleUnique("linkedin", "Se présenter avec humour : 5 accroches qui passent");
    expect(html(li.element)).not.toContain("Article");
    const x = carteArticleUnique("x", "Titre : 5 vannes");
    expect(html(x.element)).toContain("Article");
    expect([x.width, x.height]).toEqual([1600, 900]);
    expect(x.alt).toBe("Titre : 5 vannes");
  });

  it("extraireListe lit le nombre et le nom de la liste", () => {
    expect(extraireListe("Se présenter avec humour : 5 accroches qui passent")).toEqual({
      nombre: 5,
      nom: "accroches",
    });
    expect(extraireListe("Humour en visio")).toBeNull();
  });
});
