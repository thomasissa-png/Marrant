import {
  slugifyText,
  buildCatalogueSlug,
  parseShortIdFromSlug,
  buildJokeSlug,
  buildTipSlug,
  buildVideoSlug,
  SHORT_ID_LENGTH,
} from "@/lib/catalogue-slug";

describe("catalogue-slug — slugifyText", () => {
  it("met en minuscules et remplace les accents", () => {
    expect(slugifyText("Élève à l'école")).toBe("eleve-a-lecole");
  });

  it("supprime les caractères spéciaux et collapse les tirets", () => {
    expect(slugifyText("Vanne !!! ---   drôle ??? ")).toBe("vanne-drole");
  });

  it("retourne une chaîne vide sur entrée vide", () => {
    expect(slugifyText("")).toBe("");
  });

  it("coupe proprement au dernier tiret sous maxLength", () => {
    const long = "un-conseil-vraiment-tres-long-qui-depasse-la-limite-imposee";
    const out = slugifyText(long, 30);
    expect(out.length).toBeLessThanOrEqual(30);
    expect(out.endsWith("-")).toBe(false);
  });

  it("gère œ et æ", () => {
    expect(slugifyText("Cœur & Sœur æquilibre")).toBe("coeur-soeur-aequilibre");
  });
});

describe("catalogue-slug — buildCatalogueSlug + parseShortIdFromSlug", () => {
  const id = "clx1a2b3c4d5e6f7g8h9";

  it("génère un slug avec suffixe = 10 premiers caractères de l'id", () => {
    const slug = buildCatalogueSlug("Ma vanne géniale", id);
    expect(slug.startsWith("ma-vanne-geniale-")).toBe(true);
    expect(slug.endsWith(id.slice(0, SHORT_ID_LENGTH))).toBe(true);
  });

  it("gère un texte vide en retournant uniquement le shortId", () => {
    const slug = buildCatalogueSlug("", id);
    expect(slug).toBe(id.slice(0, SHORT_ID_LENGTH));
  });

  it("round-trip : parse retrouve le shortId depuis le slug généré", () => {
    const slug = buildCatalogueSlug("Un conseil drôle !", id);
    const parsed = parseShortIdFromSlug(slug);
    expect(parsed).toBe(id.slice(0, SHORT_ID_LENGTH));
  });

  it("parse retourne null pour un slug sans suffixe id valide", () => {
    expect(parseShortIdFromSlug("juste-un-slug-normal")).toBe(null);
    expect(parseShortIdFromSlug("")).toBe(null);
  });

  it("parse accepte un shortId seul (backward compat)", () => {
    const short = "clx1a2b3c4";
    expect(parseShortIdFromSlug(short)).toBe(short);
  });
});

describe("catalogue-slug — helpers spécifiques", () => {
  it("buildJokeSlug utilise content", () => {
    const slug = buildJokeSlug({ id: "cabcdefghi123", content: "Une vanne" });
    expect(slug).toBe("une-vanne-cabcdefghi");
  });

  it("buildTipSlug utilise title", () => {
    const slug = buildTipSlug({ id: "cabcdefghi123", title: "Un titre" });
    expect(slug).toBe("un-titre-cabcdefghi");
  });

  it("buildVideoSlug utilise title", () => {
    const slug = buildVideoSlug({ id: "cabcdefghi123", title: "Une vidéo top" });
    expect(slug).toBe("une-video-top-cabcdefghi");
  });
});
