/**
 * Lot V7 — construction des prompts vannes (générateur + Director en mode
 * génération quotidienne). SDK Anthropic mocké : aucun appel réel.
 */
jest.mock("@anthropic-ai/sdk", () => jest.fn().mockImplementation(() => ({ messages: { create: jest.fn() } })));
jest.mock("@/lib/prisma", () => ({ prisma: { llmUsageLog: { create: jest.fn().mockResolvedValue({}) } } }));

import { JOKE_FLOOR_ETALONS, JOKE_QUALITY_BAR } from "@/lib/ai/joke-quality-bar";

type Block = { type: string; text: string; cache_control?: { type: string } };

const CTX = {
  persona: "SOPHIE" as const,
  plannedCategory: "BOULOT",
  plannedTheme: "La réunion du lundi",
  recentJokes: [{ content: "Mon chef dit que je suis l'homme de la situation.", category: "BOULOT", type: "ONE_LINER" }],
  monthlyPlanSummary: "Plan test",
  otherAgentsCategories: { tip: "TIMING", video: "OBSERVATION" },
};
const AVOID = "AMORCES DÉJÀ EXPLOITÉES DANS LE CATALOGUE :\n- Mon copain : Choisis le resto (x28)";

const ALEXA = {
  content: JOKE_FLOOR_ETALONS[0].setup,
  punchline: JOKE_FLOOR_ETALONS[0].punchline,
  category: "SITUATION",
  type: "ONE_LINER",
  maturityLevel: 1,
};

async function loadWithMock() {
  jest.resetModules();
  const Anthropic = (await import("@anthropic-ai/sdk")).default as unknown as jest.Mock;
  const create = jest.fn();
  Anthropic.mockImplementation(() => ({ messages: { create } }));
  const jokeAgent = await import("@/lib/ai/agents/joke-agent");
  const director = await import("@/lib/ai/agents/standup-director-agent");
  const client = await import("@/lib/ai/client");
  return { create, jokeAgent, director, client };
}

const json = (body: object) => ({ content: [{ type: "text", text: JSON.stringify(body) }], usage: {} });

describe("barre qualité V7", () => {
  it("contient les 4 étalons validés, les critères et les tics", () => {
    for (const e of JOKE_FLOOR_ETALONS) {
      expect(JOKE_QUALITY_BAR).toContain(e.setup);
      expect(JOKE_QUALITY_BAR).toContain(e.punchline);
    }
    expect(JOKE_QUALITY_BAR).toMatch(/non télégraphiée/);
    expect(JOKE_QUALITY_BAR).toMatch(/courte/);
    expect(JOKE_QUALITY_BAR).toMatch(/Logique/);
    expect(JOKE_QUALITY_BAR).toMatch(/Observation vraie/);
    expect(JOKE_QUALITY_BAR).toContain("depuis 2019");
    expect(JOKE_QUALITY_BAR).toContain("j'ai enfin compris pourquoi on dit que");
    expect(JOKE_QUALITY_BAR).toContain("points de suspension");
  });
});

describe("buildJokeSystemBlocks (générateur)", () => {
  it("préambule caché avec la barre V7, amorces à éviter cachées, contexte du jour non caché", async () => {
    const { jokeAgent } = await loadWithMock();
    const blocks = jokeAgent.buildJokeSystemBlocks({ ...CTX, avoidListPrompt: AVOID }) as Block[];
    expect(blocks).toHaveLength(3);
    expect(blocks[0].cache_control).toEqual({ type: "ephemeral" });
    expect(blocks[0].text).toContain(JOKE_QUALITY_BAR);
    expect(blocks[1]).toEqual({ type: "text", text: AVOID, cache_control: { type: "ephemeral" } });
    expect(blocks[2].cache_control).toBeUndefined();
    expect(blocks[2].text).toContain("PERSONA CIBLE AUJOURD'HUI");
  });

  it("sans liste d'amorces : 2 blocs, comme avant V7", async () => {
    const { jokeAgent } = await loadWithMock();
    expect(jokeAgent.buildJokeSystemBlocks(CTX)).toHaveLength(2);
    expect(jokeAgent.buildJokeSystemBlocks({ ...CTX, avoidListPrompt: "  " })).toHaveLength(2);
  });

  it("le générateur n'interdit plus les assistants / IA comme sujet (décision V6)", async () => {
    const { jokeAgent } = await loadWithMock();
    const stable = (jokeAgent.buildJokeSystemBlocks(CTX) as Block[])[0].text;
    expect(stable).not.toMatch(/MENTION D'IA \/ D'ASSISTANT VOCAL/);
    expect(stable).not.toMatch(/remplace-le par un humain/);
    expect(stable).not.toMatch(/on n'évoque JAMAIS l'IA/);
    expect(stable).toMatch(/Alexa, Siri, ChatGPT/);
  });

  it("generateDailyJoke envoie ces blocs, sans changer le modèle ni l'effort par défaut", async () => {
    const { create, jokeAgent, client } = await loadWithMock();
    create.mockResolvedValueOnce(
      json({ content: "Setup assez long pour la chute.", punchline: "Chute.", category: "BOULOT", type: "ONE_LINER", maturityLevel: 1, comedyTechnique: "X", techniqueExplanation: "Y", howToApply: "Z" }),
    );
    await jokeAgent.generateDailyJoke({ ...CTX, avoidListPrompt: AVOID });
    const params = create.mock.calls[0][0];
    expect(params.model).toBe(client.SONNET_MODEL);
    expect(params.output_config.effort).toBe(client.DEFAULT_EFFORT);
    expect(params.system).toEqual(jokeAgent.buildJokeSystemBlocks({ ...CTX, avoidListPrompt: AVOID }));
  });
});

describe("Director : G-J11 et validateJoke", () => {
  it("par défaut (copy-review), G-J11 rejette toujours l'étalon Alexa", async () => {
    const { director } = await loadWithMock();
    const g = director.runJokeGates(ALEXA).find((r) => r.gate === "G-J11 Anti-mention IA");
    expect(g?.pass).toBe(false);
  });

  it("en génération (allowAssistantSubject), l'étalon Alexa passe G-J11", async () => {
    const { director } = await loadWithMock();
    const g = director.runJokeGates(ALEXA, { allowAssistantSubject: true }).find((r) => r.gate === "G-J11 Anti-mention IA");
    expect(g?.pass).toBe(true);
  });

  it("validateJoke sans option : prompt inchangé (pas de barre V7, « Zéro mention d'IA »)", async () => {
    const { create, director } = await loadWithMock();
    create.mockResolvedValueOnce(json({ verdict: "APPROVED", score: 9, strengths: [], issues: [], directorNote: "" }));
    await director.validateJoke({ ...ALEXA, content: "J'ai dit à mon pote que j'arrivais dans 5 minutes.", punchline: "J'étais encore en pyjama." }, "SOPHIE");
    const msg = create.mock.calls[0][0].messages[0].content as string;
    expect(msg).toContain("Zéro mention d'IA");
    expect(msg).not.toContain(JOKE_QUALITY_BAR);
  });

  it("validateJoke dailyGeneration : barre V7 injectée et vanne Alexa soumise au LLM", async () => {
    const { create, director } = await loadWithMock();
    create.mockResolvedValueOnce(json({ verdict: "APPROVED", score: 9, strengths: [], issues: [], directorNote: "" }));
    const res = await director.validateJoke(ALEXA, "SOPHIE", { dailyGeneration: true });
    expect(create).toHaveBeenCalledTimes(1);
    const msg = create.mock.calls[0][0].messages[0].content as string;
    expect(msg).toContain(JOKE_QUALITY_BAR);
    expect(msg).not.toContain("Zéro mention d'IA");
    expect(res.verdict).toBe("APPROVED");
  });

  it("directorRewriteJoke porte la barre V7", async () => {
    const { create, director } = await loadWithMock();
    create.mockResolvedValueOnce(json({ content: "Nouveau setup un peu long.", punchline: "Chute.", category: "SITUATION", type: "ONE_LINER", maturityLevel: 1 }));
    await director.directorRewriteJoke(ALEXA, { verdict: "REJECTED", score: 5, strengths: [], issues: ["Télégraphiée"], directorNote: "" }, "SOPHIE");
    const msg = create.mock.calls[0][0].messages[0].content as string;
    expect(msg).toContain(JOKE_QUALITY_BAR);
    expect(msg).not.toMatch(/zéro mention d'IA/i);
  });
});
