/**
 * Tests CEO Backlinks — module remplaçant haro-agent.ts (Phase 5.B.2).
 *
 * Couvre :
 *  - Filtre topics pertinents (96 topics calibrés)
 *  - Score de pertinence (0-10 basé sur nombre de matches)
 *  - Présence des templates pour les 8 sources supportées
 *  - Bio collective "L'Équipe Deviens Marrant" (jamais "Alex")
 */
import {
  CEO_BACKLINK_TOPICS,
  CEO_TEAM_BIO,
  CEO_BACKLINK_TEMPLATES,
  isRelevantBacklinkOpportunity,
  scoreBacklinkRelevance,
  type BacklinkSource,
} from "@/lib/ai/ceo-backlinks";

describe("CEO Backlinks — CEO_BACKLINK_TOPICS", () => {
  // CONSTAT s10 (Groupe 5) : la liste réelle compte 94 topics, pas 96 comme
  // annoncé dans le commentaire du module (ligne 21 ceo-backlinks.ts) et le
  // mémo s9. Discordance documentée → handoff @qa pour décider :
  //   (a) ajouter 2 topics manquants,
  //   (b) corriger le commentaire à 94.
  // Le test verrouille la cardinalité actuelle pour anti-régression.
  it("contient EXACTEMENT 94 topics (lecture réelle s10 — voir handoff Groupe 5)", () => {
    expect(CEO_BACKLINK_TOPICS.length).toBe(94);
  });

  it("contient au moins 80 topics (couverture humour/comm/social/pro/perso)", () => {
    expect(CEO_BACKLINK_TOPICS.length).toBeGreaterThanOrEqual(80);
  });

  it("ne contient AUCUN doublon (Set === Array length)", () => {
    const uniqueCount = new Set(CEO_BACKLINK_TOPICS).size;
    expect(uniqueCount).toBe(CEO_BACKLINK_TOPICS.length);
  });

  it("ne contient aucune string vide ni espace seul", () => {
    for (const topic of CEO_BACKLINK_TOPICS) {
      expect(topic).toBeTruthy();
      expect(topic.trim().length).toBeGreaterThan(0);
      expect(topic).toBe(topic.trim()); // pas d'espaces parasites
    }
  });

  it("toutes les entrées sont en lowercase (assumption case-insensitive)", () => {
    for (const topic of CEO_BACKLINK_TOPICS) {
      expect(topic).toBe(topic.toLowerCase());
    }
  });

  it("inclut les keywords humour pur français", () => {
    expect(CEO_BACKLINK_TOPICS).toEqual(
      expect.arrayContaining(["humour", "drôle", "rire", "blague"]),
    );
  });

  it("inclut stand-up / comédie / improvisation", () => {
    expect(CEO_BACKLINK_TOPICS).toEqual(
      expect.arrayContaining(["stand-up", "comédie", "improvisation"]),
    );
  });

  it("inclut les soft skills (communication, charisme, prise de parole)", () => {
    expect(CEO_BACKLINK_TOPICS).toEqual(
      expect.arrayContaining(["communication", "charisme", "prise de parole"]),
    );
  });

  it("inclut les variations EN (humor, comedy, public speaking, networking)", () => {
    expect(CEO_BACKLINK_TOPICS).toEqual(
      expect.arrayContaining(["humor", "comedy", "public speaking", "networking"]),
    );
  });
});

describe("CEO Backlinks — CEO_TEAM_BIO", () => {
  it("commence par 'L'Équipe Deviens Marrant' (signature collective)", () => {
    expect(CEO_TEAM_BIO).toMatch(/^L'Équipe Deviens Marrant/);
  });

  it("ne contient JAMAIS le prénom 'Alex' (signature interdite)", () => {
    expect(CEO_TEAM_BIO).not.toMatch(/\bAlex\b/);
  });

  it("mentionne deviens-marrant.fr (domaine canonique)", () => {
    expect(CEO_TEAM_BIO.toLowerCase()).toContain("deviens-marrant.fr");
  });

  it("cite au moins 1 humoriste de référence", () => {
    const humoristes = ["Paul Mirabel", "Fary", "Blanche Gardin", "Roman Frayssinet", "Waly Dia"];
    const citedCount = humoristes.filter((h) => CEO_TEAM_BIO.includes(h)).length;
    expect(citedCount).toBeGreaterThanOrEqual(1);
  });
});

describe("CEO Backlinks — CEO_BACKLINK_TEMPLATES", () => {
  const expectedSources: BacklinkSource[] = [
    "HARO",
    "CONNECTIVELY",
    "SOURCEBOTTLE",
    "RSS_FEED",
    "BLOGGER",
    "PODCAST",
    "DIRECTORY",
    "EXCHANGE",
  ];

  it("expose un template pour chacune des 8 sources", () => {
    for (const src of expectedSources) {
      expect(CEO_BACKLINK_TEMPLATES[src]).toBeDefined();
      expect(CEO_BACKLINK_TEMPLATES[src].tone).toMatch(/^(tutoiement|vouvoiement)$/);
    }
  });

  it("HARO et SOURCEBOTTLE imposent le vouvoiement (presse)", () => {
    expect(CEO_BACKLINK_TEMPLATES.HARO.tone).toBe("vouvoiement");
    expect(CEO_BACKLINK_TEMPLATES.SOURCEBOTTLE.tone).toBe("vouvoiement");
  });

  it("BLOGGER, PODCAST, RSS_FEED, EXCHANGE imposent le tutoiement (confraternel)", () => {
    expect(CEO_BACKLINK_TEMPLATES.BLOGGER.tone).toBe("tutoiement");
    expect(CEO_BACKLINK_TEMPLATES.PODCAST.tone).toBe("tutoiement");
    expect(CEO_BACKLINK_TEMPLATES.RSS_FEED.tone).toBe("tutoiement");
    expect(CEO_BACKLINK_TEMPLATES.EXCHANGE.tone).toBe("tutoiement");
  });

  it("HARO bannit explicitement les mots SEO/backlink/guest post", () => {
    expect(CEO_BACKLINK_TEMPLATES.HARO.bannedWords).toEqual(
      expect.arrayContaining(["backlink", "SEO", "guest post"]),
    );
  });

  it("chaque template expose tone, maxWords, structure, bannedWords, example", () => {
    const expectedSources: BacklinkSource[] = [
      "HARO",
      "CONNECTIVELY",
      "SOURCEBOTTLE",
      "RSS_FEED",
      "BLOGGER",
      "PODCAST",
      "DIRECTORY",
      "EXCHANGE",
    ];
    for (const src of expectedSources) {
      const tpl = CEO_BACKLINK_TEMPLATES[src];
      expect(tpl).toHaveProperty("tone");
      expect(tpl).toHaveProperty("maxWords");
      expect(tpl).toHaveProperty("structure");
      expect(tpl).toHaveProperty("bannedWords");
      expect(tpl).toHaveProperty("example");
      expect(typeof tpl.maxWords).toBe("number");
      expect(tpl.maxWords).toBeGreaterThan(0);
      expect(Array.isArray(tpl.bannedWords)).toBe(true);
      expect(typeof tpl.example).toBe("string");
      expect(tpl.example.length).toBeGreaterThan(0);
    }
  });

  it("aucun template ne mentionne 'Alex' ni 'IA' / 'intelligence artificielle' dans son example", () => {
    const expectedSources: BacklinkSource[] = [
      "HARO",
      "CONNECTIVELY",
      "SOURCEBOTTLE",
      "RSS_FEED",
      "BLOGGER",
      "PODCAST",
      "DIRECTORY",
      "EXCHANGE",
    ];
    for (const src of expectedSources) {
      const example = CEO_BACKLINK_TEMPLATES[src].example;
      expect(example).not.toMatch(/\bAlex\b/);
      expect(example).not.toMatch(/intelligence artificielle/i);
      expect(example).not.toMatch(/\bGPT\b/);
      expect(example).not.toMatch(/\bChatGPT\b/);
    }
  });

  it("chaque template impose maxWords ≤ 120 (limite voix Marrant courte)", () => {
    for (const src of Object.keys(CEO_BACKLINK_TEMPLATES) as BacklinkSource[]) {
      expect(CEO_BACKLINK_TEMPLATES[src].maxWords).toBeLessThanOrEqual(120);
    }
  });
});

describe("CEO Backlinks — isRelevantBacklinkOpportunity", () => {
  it("matche une question sur l'humour", () => {
    expect(
      isRelevantBacklinkOpportunity({
        query: "How to develop humor in a corporate setting?",
        category: "communication",
      }),
    ).toBe(true);
  });

  it("matche une question sur la prise de parole", () => {
    expect(
      isRelevantBacklinkOpportunity({
        query: "Conseils pour la prise de parole en réunion",
      }),
    ).toBe(true);
  });

  it("rejette une question hors-thème (crypto, automobile)", () => {
    expect(
      isRelevantBacklinkOpportunity({
        query: "Best Bitcoin mining hardware in 2026",
        category: "crypto",
      }),
    ).toBe(false);
  });

  it("rejette une chaîne vide", () => {
    expect(isRelevantBacklinkOpportunity({ query: "" })).toBe(false);
  });

  it("matche en case-insensitive (HUMOUR, Humour, humour)", () => {
    expect(isRelevantBacklinkOpportunity({ query: "HUMOUR" })).toBe(true);
    expect(isRelevantBacklinkOpportunity({ query: "Humour" })).toBe(true);
    expect(isRelevantBacklinkOpportunity({ query: "huMoUr" })).toBe(true);
  });

  it("matche dans le champ category (pas que query)", () => {
    expect(
      isRelevantBacklinkOpportunity({
        query: "Random topic about cars",
        category: "stand-up",
      }),
    ).toBe(true);
  });

  it("matche dans le champ outlet (presse spécialisée)", () => {
    expect(
      isRelevantBacklinkOpportunity({
        query: "Looking for sources",
        outlet: "Comedy Central podcast",
      }),
    ).toBe(true);
  });

  it("ignore les champs category/outlet absents (undefined-safe)", () => {
    expect(
      isRelevantBacklinkOpportunity({ query: "humour" }),
    ).toBe(true);
    expect(
      isRelevantBacklinkOpportunity({ query: "humour", category: undefined }),
    ).toBe(true);
  });

  it("matche les keywords avec accents (drôle, anxiété)", () => {
    expect(isRelevantBacklinkOpportunity({ query: "drôle" })).toBe(true);
    expect(
      isRelevantBacklinkOpportunity({ query: "L'anxiété au travail" }),
    ).toBe(true);
  });
});

describe("CEO Backlinks — scoreBacklinkRelevance", () => {
  it("retourne 0 sur une chaîne vide", () => {
    expect(scoreBacklinkRelevance({ query: "" })).toBe(0);
  });

  it("retourne un score plus élevé quand plusieurs topics matchent", () => {
    const single = scoreBacklinkRelevance({ query: "humour" });
    const multi = scoreBacklinkRelevance({
      query: "humour, stand-up, prise de parole, charisme, networking",
    });
    expect(multi).toBeGreaterThan(single);
  });

  it("sature à 10 STRICTEMENT (jamais > 10 même avec 20+ matches)", () => {
    // Concat de tous les topics → garantit ≥ 20 matches
    const allTopics = CEO_BACKLINK_TOPICS.join(" ");
    const score = scoreBacklinkRelevance({ query: allTopics });
    expect(score).toBe(10);
    expect(score).not.toBeGreaterThan(10);
  });

  it("retourne 0 sur un sujet hors-thème (crypto)", () => {
    expect(
      scoreBacklinkRelevance({
        query: "Bitcoin mining ROI 2026",
        category: "crypto",
      }),
    ).toBe(0);
  });

  it("retourne 2 pour 1 match unique faible (matches × 2)", () => {
    // "humour" est dans la liste → 1 match × 2 = 2
    expect(scoreBacklinkRelevance({ query: "humour" })).toBe(2);
  });

  it("retourne 4 pour 2 matches distincts", () => {
    // "humour" + "stand-up" = 2 matches × 2 = 4
    expect(
      scoreBacklinkRelevance({ query: "humour stand-up" }),
    ).toBe(4);
  });

  it("matche en case-insensitive (HUMOUR Stand-Up = 4)", () => {
    expect(scoreBacklinkRelevance({ query: "HUMOUR Stand-Up" })).toBe(4);
  });

  it("agrège matches sur query + category + outlet (champs concat)", () => {
    const score = scoreBacklinkRelevance({
      query: "humour",
      category: "stand-up",
      outlet: "comedy podcast",
    });
    // humour + stand-up + comedy + podcast → 4 matches × 2 = 8
    expect(score).toBeGreaterThanOrEqual(6);
    expect(score).toBeLessThanOrEqual(10);
  });
});
