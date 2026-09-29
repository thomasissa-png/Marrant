/**
 * @jest-environment node
 *
 * Tests — Gates vannes s11 (G-J10 anti-répétition d'amorce, G-J11 anti-mention IA)
 * + Gates conseils s11 (G-T6 anti-mention IA) + helper extractSetupAmorce.
 */
jest.mock("@/lib/ai/client", () => ({
  anthropic: {},
  SONNET_MODEL: "claude-sonnet-mock",
  HAIKU_MODEL: "claude-haiku-mock",
  buildCachedSystemBlock: (text: string) => ({ type: "text", text, cache_control: { type: "ephemeral" } }),
  callWithRetry: jest.fn(),
  extractJson: jest.fn(),
  extractJsonArray: jest.fn(),
  getResponseText: jest.fn(),
}));

import { runJokeGates, runTipGates } from "@/lib/ai/agents/standup-director-agent";
import { extractSetupAmorce } from "@/lib/ai/agents/joke-agent";

const JOKE_BASELINE = {
  content: "J'ai demandé à mon dentiste s'il allait faire mal.",
  punchline: "Il a souri avant de répondre. J'ai pas aimé ce sourire.",
  category: "AUTODERISION",
  type: "STORY",
  maturityLevel: 1,
};

const TIP_BASELINE = {
  title: "Le silence après le rire",
  content:
    "Tu places une vanne, ça marche, et là ton réflexe c'est d'enchaîner. Erreur. " +
    "Laisse le silence faire son travail. Compte cinq secondes. Souris. Bois une gorgée. " +
    "Ce que tu obtiens : le rire se prolonge tout seul, tu passes pour quelqu'un qui maîtrise, " +
    "et tu évites le classique 'non mais sérieusement' qui casse la magie. Les meilleurs stand-uppers " +
    "utilisent tous cette technique — regarde n'importe quel spectacle live, la punchline claque, ils " +
    "posent le micro, ils attendent, ils reprennent. Le silence est ton meilleur allié quand tu débutes.",
  category: "TIMING",
  difficulty: "DEBUTANT",
  example:
    "Tu dis : « J'ai commencé la muscu. » Ton pote demande : « Ah ouais et alors ? » " +
    "Tu réponds : « Bah j'ai commencé. » Silence. Tu souris. Ton pote rit.",
  exercise: "DÉFI SILENCE : la prochaine fois que tu fais rire, tiens-toi à 5 secondes sans rien ajouter.",
};

describe("extractSetupAmorce", () => {
  it("prend les 12 premiers mots normalisés, retire la casse et les guillemets", () => {
    expect(extractSetupAmorce("J'ai demandé à mon dentiste s'il allait faire mal.")).toBe(
      "j'ai demandé à mon dentiste s'il allait faire mal",
    );
  });

  it("s'arrête au premier point / point-virgule", () => {
    expect(extractSetupAmorce("Ma collègue m'a dit un truc. Ensuite j'ai répondu.")).toBe(
      "ma collègue m'a dit un truc",
    );
  });

  it("gère les chaînes vides sans crash", () => {
    expect(extractSetupAmorce("")).toBe("");
  });
});

describe("G-J10 — anti-répétition d'amorce", () => {
  it("PASS quand aucune amorce récente n'est fournie (règle du doute : on ne bloque pas)", () => {
    const gates = runJokeGates(JOKE_BASELINE);
    const g = gates.find((r) => r.gate === "G-J10 Anti-répétition d'amorce");
    expect(g?.pass).toBe(true);
  });

  it("FAIL quand une vanne récente partage l'ouverture (≥ 5 mots identiques)", () => {
    const gates = runJokeGates(JOKE_BASELINE, {
      recentSetups: [
        "J'ai demandé à mon dentiste s'il allait me faire un devis.",
      ],
    });
    const g = gates.find((r) => r.gate === "G-J10 Anti-répétition d'amorce");
    expect(g?.pass).toBe(false);
    expect(g?.reason).toMatch(/Amorce trop proche/);
  });

  it("PASS quand seuls quelques mots d'ouverture matchent (< 5)", () => {
    const gates = runJokeGates(JOKE_BASELINE, {
      recentSetups: ["J'ai demandé pardon à ma prof de piano hier soir."],
    });
    const g = gates.find((r) => r.gate === "G-J10 Anti-répétition d'amorce");
    expect(g?.pass).toBe(true);
  });

  it("PASS quand l'amorce de la vanne courante est trop courte pour matcher", () => {
    const gates = runJokeGates(
      { ...JOKE_BASELINE, content: "Bref." },
      { recentSetups: ["Bref. J'ai raté."] },
    );
    const g = gates.find((r) => r.gate === "G-J10 Anti-répétition d'amorce");
    expect(g?.pass).toBe(true);
  });
});

describe("G-J11 — anti-mention IA dans les vannes", () => {
  it("PASS quand aucune mention IA n'est présente", () => {
    const gates = runJokeGates(JOKE_BASELINE);
    const g = gates.find((r) => r.gate === "G-J11 Anti-mention IA");
    expect(g?.pass).toBe(true);
  });

  it("FAIL quand la vanne mentionne ChatGPT", () => {
    const gates = runJokeGates({
      ...JOKE_BASELINE,
      punchline: "ChatGPT m'a répondu la même chose que ma mère.",
    });
    const g = gates.find((r) => r.gate === "G-J11 Anti-mention IA");
    expect(g?.pass).toBe(false);
  });

  it("FAIL quand la vanne mentionne Alexa / Siri", () => {
    const gates = runJokeGates({
      ...JOKE_BASELINE,
      content: "J'ai demandé à Alexa de m'expliquer ma vie.",
    });
    const g = gates.find((r) => r.gate === "G-J11 Anti-mention IA");
    expect(g?.pass).toBe(false);
  });

  it("FAIL quand la vanne évoque 'l'IA'", () => {
    const gates = runJokeGates({
      ...JOKE_BASELINE,
      punchline: "J'ai décidé de laisser l'IA gérer ma vie sentimentale.",
    });
    const g = gates.find((r) => r.gate === "G-J11 Anti-mention IA");
    expect(g?.pass).toBe(false);
  });
});

describe("G-T6 — anti-mention IA dans les conseils", () => {
  it("PASS sur le conseil baseline", () => {
    const gates = runTipGates(TIP_BASELINE);
    const g = gates.find((r) => r.gate === "G-T6 Anti-mention IA");
    expect(g?.pass).toBe(true);
  });

  it("FAIL quand l'exemple utilise ChatGPT", () => {
    const gates = runTipGates({
      ...TIP_BASELINE,
      example: "Tu demandes à ChatGPT de te donner une vanne, il te donne un pun raté.",
    });
    const g = gates.find((r) => r.gate === "G-T6 Anti-mention IA");
    expect(g?.pass).toBe(false);
  });

  it("FAIL quand le contenu mentionne 'assistant vocal'", () => {
    const gates = runTipGates({
      ...TIP_BASELINE,
      content: TIP_BASELINE.content + " Un assistant vocal peut aussi t'aider à répéter.",
    });
    const g = gates.find((r) => r.gate === "G-T6 Anti-mention IA");
    expect(g?.pass).toBe(false);
  });
});


describe("G-J11 — pas de faux positif sur les prénoms / signes", () => {
  it("« Claude » prénom et « Gémeaux/Gemini » astro ne déclenchent pas le gate", () => {
    const gates = runJokeGates({
      content: "Mon oncle Claude dit qu'il est Gemini ascendant sieste.",
      punchline: "Il a raison : il dort sous tous les signes.",
      category: "SITUATION",
      type: "ONE_LINER",
      maturityLevel: 1,
    } as never);
    expect(gates.find((g) => g.gate.startsWith("G-J11"))?.pass).toBe(true);
  });

  it("« Claude AI » reste détecté", () => {
    const gates = runJokeGates({
      content: "J'ai demandé à Claude AI de me trouver une vanne.",
      punchline: "Il m'a proposé de parler de la météo.",
      category: "SITUATION",
      type: "ONE_LINER",
      maturityLevel: 1,
    } as never);
    expect(gates.find((g) => g.gate.startsWith("G-J11"))?.pass).toBe(false);
  });
});
