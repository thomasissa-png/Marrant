// Mock the AI client to avoid loading @anthropic-ai/sdk in test environment
jest.mock("@/lib/ai/client", () => ({
  callWithRetry: jest.fn(),
  extractJson: jest.fn(),
  getResponseText: jest.fn(),
}));

jest.mock("@/lib/ai/agents/marketing-agent", () => ({
  TONALITY_BRIEF: {
    voice: "Le pote drôle et bienveillant",
    principles: [],
    doNot: [],
  },
}));

import {
  filterRelevantOpportunities,
  type HaroOpportunity,
} from "@/lib/ai/agents/haro-agent";

describe("HARO Agent — filterRelevantOpportunities", () => {
  const makeOpportunity = (
    query: string,
    category = "general",
    outlet?: string,
  ): HaroOpportunity => ({
    id: `test-${Math.random()}`,
    source: "HARO",
    query,
    category,
    outlet,
  });

  it("filters in humor-related opportunities", () => {
    const opportunities = [
      makeOpportunity("Looking for experts on humor in the workplace"),
      makeOpportunity("Best investment strategies for 2026"),
    ];
    const result = filterRelevantOpportunities(opportunities);
    expect(result.relevant).toHaveLength(1);
    expect(result.relevant[0].query).toContain("humor");
    expect(result.filtered).toBe(1);
    expect(result.total).toBe(2);
  });

  it("filters in communication-related opportunities", () => {
    const opportunities = [
      makeOpportunity("Tips for improving communication skills"),
    ];
    const result = filterRelevantOpportunities(opportunities);
    expect(result.relevant).toHaveLength(1);
  });

  it("filters in confiance en soi opportunities", () => {
    const opportunities = [
      makeOpportunity("Comment développer la confiance en soi"),
    ];
    const result = filterRelevantOpportunities(opportunities);
    expect(result.relevant).toHaveLength(1);
  });

  it("filters in dating / social skills opportunities", () => {
    const opportunities = [
      makeOpportunity("Best dating tips for introverts"),
    ];
    const result = filterRelevantOpportunities(opportunities);
    expect(result.relevant).toHaveLength(1);
  });

  it("filters in stand-up related opportunities", () => {
    const opportunities = [
      makeOpportunity("French stand-up comedy scene", "entertainment"),
    ];
    const result = filterRelevantOpportunities(opportunities);
    expect(result.relevant).toHaveLength(1);
  });

  it("filters in French language opportunities", () => {
    const opportunities = [
      makeOpportunity("Techniques pour être drôle en soirée"),
    ];
    const result = filterRelevantOpportunities(opportunities);
    expect(result.relevant).toHaveLength(1);
  });

  it("filters in leadership and management", () => {
    const opportunities = [
      makeOpportunity("How leadership improves with humor", "management"),
    ];
    const result = filterRelevantOpportunities(opportunities);
    expect(result.relevant).toHaveLength(1);
  });

  it("filters out completely irrelevant topics", () => {
    const opportunities = [
      makeOpportunity("Best protein powder for bodybuilding"),
      makeOpportunity("Cryptocurrency market analysis 2026"),
      makeOpportunity("Real estate investing in rural areas"),
    ];
    const result = filterRelevantOpportunities(opportunities);
    expect(result.relevant).toHaveLength(0);
    expect(result.filtered).toBe(3);
  });

  it("matches on outlet name too", () => {
    const opportunities = [
      makeOpportunity(
        "Looking for expert quotes",
        "lifestyle",
        "Comedy Central France",
      ),
    ];
    const result = filterRelevantOpportunities(opportunities);
    // "comedy" is in RELEVANT_TOPICS
    expect(result.relevant).toHaveLength(1);
  });

  it("handles empty array", () => {
    const result = filterRelevantOpportunities([]);
    expect(result.relevant).toHaveLength(0);
    expect(result.total).toBe(0);
    expect(result.filtered).toBe(0);
  });

  it("handles mixed relevant and irrelevant", () => {
    const opportunities = [
      makeOpportunity("How to be funny at work"),
      makeOpportunity("Best vegan recipes"),
      makeOpportunity("Storytelling techniques for presentations"),
      makeOpportunity("Car insurance comparison"),
      makeOpportunity("Overcoming shyness and social anxiety"),
    ];
    const result = filterRelevantOpportunities(opportunities);
    expect(result.relevant).toHaveLength(3);
    expect(result.filtered).toBe(2);
  });

  it("is case insensitive", () => {
    const opportunities = [
      makeOpportunity("HUMOUR et CRÉATIVITÉ dans le MANAGEMENT"),
    ];
    const result = filterRelevantOpportunities(opportunities);
    expect(result.relevant).toHaveLength(1);
  });
});
