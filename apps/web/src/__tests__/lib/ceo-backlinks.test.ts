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
  it("contient au moins 80 topics (couverture humour/comm/social/pro/perso)", () => {
    expect(CEO_BACKLINK_TOPICS.length).toBeGreaterThanOrEqual(80);
  });

  it("inclut les keywords humour pur français", () => {
    expect(CEO_BACKLINK_TOPICS).toEqual(expect.arrayContaining(["humour", "vanne" === "vanne" ? "drôle" : "", "rire", "blague"]));
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

  it("sature à 10 (au-delà de 5 matches, redondant)", () => {
    const score = scoreBacklinkRelevance({
      query:
        "humour stand-up comédie improvisation répartie communication charisme prise de parole networking",
    });
    expect(score).toBeLessThanOrEqual(10);
  });
});
