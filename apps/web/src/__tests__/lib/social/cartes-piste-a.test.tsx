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
} from "@/lib/social/carrousel-piste-a";
import { corpsSansDebordement } from "@/lib/social/templates/cartes-piste-a";

const html = (el: React.ReactElement) => renderToStaticMarkup(el);
/** Texte visible, espaces insécables normalisées (blocs flex rendus séparément). */
const texte = (el: React.ReactElement) =>
  html(el).replace(/<[^>]+>/g, " ").replace(/&#x27;/g, "'").replace(/[\s  ]+/g, " ");

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

describe("corpsSansDebordement()", () => {
  it("réduit le corps quand un bloc insécable ne tient pas dans la largeur", () => {
    expect(corpsSansDebordement(["Court."], 84, 800, 888)).toBe(84);
    expect(corpsSansDebordement(["anticonstitutionnellement"], 84, 800, 888)).toBeLessThan(84);
    expect(corpsSansDebordement(["x".repeat(200)], 84, 800, 888)).toBe(28);
  });
});

describe("carrousels piste A", () => {
  it("vanne : 2 slides 4:5, amorce puis chute sur aplat, sans étiquette", () => {
    const slides = carrouselVanne({ amorce: "Amorce ici.", chute: ["Chute là."] });
    expect(slides).toHaveLength(2);
    slides.forEach((s) => expect([s.width, s.height]).toEqual([1080, 1350]));
    const s1 = html(slides[0].element);
    expect(texte(slides[0].element)).toContain("Amorce ici.");
    expect(texte(slides[0].element)).not.toContain("Chute");
    expect(s1).toContain("Glisse");
    expect(s1).toContain("1/2");
    expect(s1).not.toMatch(/La Vanne|Article|Conseil/i);
    expect(html(slides[1].element)).toContain("#6D28D9");
    expect(texte(slides[1].element)).toContain("Chute là.");
  });

  it("article : étiquette ARTICLE, nombre géant, extrait et slide de fin", () => {
    const slides = carrouselArticle({
      titre: "Blagues d'Halloween : 8 vannes pour ta soirée déguisée",
      extrait: { rang: 2, amorce: "J'ai passé la soirée à expliquer mon costume.", chute: "À minuit." },
    });
    expect(slides).toHaveLength(3);
    expect(html(slides[0].element)).toContain("Article");
    expect(html(slides[0].element)).toContain(">8<");
    expect(texte(slides[1].element)).toContain("n° 2 sur 8");
    expect(texte(slides[2].element)).toContain("Les 7 autres vannes");
    expect(texte(slides[2].element)).toContain("Lien en bio");
  });

  it("article sans extrait : couverture + fin seulement", () => {
    expect(carrouselArticle({ titre: "Humour en visio : faire rire" })).toHaveLength(2);
  });

  it("conseil : étiquette CONSEIL, situation puis réplique", () => {
    const slides = carrouselConseil({
      titreConseil: "L'ironie bienveillante",
      situation: "Ton pote arrive en retard.",
      replique: ["Pile à l'heure."],
    });
    expect(slides).toHaveLength(2);
    expect(html(slides[0].element)).toContain("Conseil");
    expect(texte(slides[0].element)).toContain("L’ironie bienveillante");
    expect(texte(slides[1].element)).toContain("Pile à l’heure.");
  });

  it("aucun texte sous 28 px ni ancien gabarit (italique, badge, dégradé)", () => {
    const tous = [
      ...carrouselVanne({ amorce: "A.", chute: ["B."] }),
      ...carrouselArticle({ titre: "Titre : 5 accroches", extrait: { rang: 1, amorce: "A." } }),
      ...carrouselConseil({ titreConseil: "T", situation: "S.", replique: ["R."] }),
    ].map((s) => html(s.element));
    for (const h of tous) {
      const tailles = [...h.matchAll(/font-size:(\d+)px/g)].map((m) => Number(m[1]));
      expect(Math.min(...tailles)).toBeGreaterThanOrEqual(28);
      expect(h).not.toMatch(/italic|linear-gradient/);
      expect(h).toContain("deviens-marrant.fr");
    }
  });
});

describe("déclinaisons X et LinkedIn", () => {
  it("vanne : chute seule en 1600×900 (X) et 1200×627 (LinkedIn), sans pagination", () => {
    const x = carteVanneUnique("x", ["Chute."]);
    const li = carteVanneUnique("linkedin", ["Chute."]);
    expect([x.width, x.height]).toEqual([1600, 900]);
    expect([li.width, li.height]).toEqual([1200, 627]);
    expect(html(x.element)).not.toMatch(/\d\/\d/);
  });

  it("article LinkedIn : couverture sans étiquette de type", () => {
    const li = carteArticleUnique("linkedin", "Se présenter avec humour : 5 accroches qui passent");
    expect(html(li.element)).not.toContain("Article");
    expect(html(carteArticleUnique("x", "Titre : 5 vannes").element)).toContain("Article");
  });

  it("extraireListe lit le nombre et le nom de la liste", () => {
    expect(extraireListe("Se présenter avec humour : 5 accroches qui passent")).toEqual({
      nombre: 5,
      nom: "accroches",
    });
    expect(extraireListe("Humour en visio")).toBeNull();
  });
});
