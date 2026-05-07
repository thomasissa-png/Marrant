/**
 * Phase 5.D — Groupe 3 : Tests gates CEO programmatiques (G-CEO1/2/3/4).
 *
 * Cible : `apps/web/src/lib/ai/agents/standup-director-agent.ts` lignes 2475-2538
 * (`runCeoOutboundGates` — fonction pure synchrone, pas de LLM).
 *
 * Périmètre :
 *  - G-CEO1 : signature "L'Équipe Deviens Marrant" obligatoire sur EMAIL/BACKLINK_EMAIL
 *             + signature individuelle "Alex/Alexandre" interdite sur tous canaux.
 *  - G-CEO2 : zéro persona interne (Yanis/Sophie/Marc) — réutilise INTERNAL_PERSONA_NAMES.
 *  - G-CEO3 : zéro mention IA (regex AI_MENTIONS) — règle permanente fondateur s8.
 *             FAUX POSITIFS bloquants : "automatiquement", "agent immobilier", "désespère".
 *  - G-CEO4 : pattern invitation ressource (DM/COMMENT) — pas de "[→ lien]" inline.
 *
 * Stratégie : fonction pure → pas de mock Anthropic/Prisma nécessaire ici.
 * (Le helper `setupDirectorWithFlag` est conservé en référence dans
 * `standup-director-haiku.test.ts` mais inutile pour ces tests programmatiques.)
 */

// Mock Anthropic SDK — le module instancie le client au load (lib/ai/client.ts).
// On ne teste qu'une fonction pure (runCeoOutboundGates), donc le mock peut
// être minimal — pas d'appel `messages.create` attendu dans ces tests.
jest.mock("@anthropic-ai/sdk", () => {
  return jest.fn().mockImplementation(() => ({
    messages: { create: jest.fn() },
  }));
});

// Mock Prisma pour la même raison (callWithRetry log dans llmUsageLog).
jest.mock("@/lib/prisma", () => ({
  prisma: {
    llmUsageLog: { create: jest.fn().mockResolvedValue({}) },
  },
}));

import {
  runCeoOutboundGates,
  type CeoOutboundToValidate,
} from "@/lib/ai/agents/standup-director-agent";

// ─── Helpers ──────────────────────────────────────────────────────

type GateName =
  | "G-CEO1 Signature équipe"
  | "G-CEO2 Zéro persona nominatif"
  | "G-CEO3 Zéro mention IA"
  | "G-CEO4 Pattern invitation ressource";

function findGate(
  results: ReturnType<typeof runCeoOutboundGates>,
  gate: GateName,
) {
  return results.find((r) => r.gate === gate);
}

function buildEmail(content: string, subject = "Test"): CeoOutboundToValidate {
  return { channel: "EMAIL", subject, content };
}

function buildBacklinkEmail(content: string): CeoOutboundToValidate {
  return { channel: "BACKLINK_EMAIL", subject: "Pitch", content };
}

function buildDm(
  content: string,
  channel: CeoOutboundToValidate["channel"] = "DM_TWITTER",
): CeoOutboundToValidate {
  return { channel, content };
}

const SIGNATURE = "\n\nÀ bientôt,\nL'Équipe Deviens Marrant";

// ─── G-CEO1 : Signature équipe ────────────────────────────────────

describe("G-CEO1 — Signature équipe (EMAIL/BACKLINK_EMAIL)", () => {
  it("PASS — email avec signature 'L'Équipe Deviens Marrant'", () => {
    const results = runCeoOutboundGates(
      buildEmail(`Salut,\n\nMerci pour ton inscription.${SIGNATURE}`),
    );
    const gate = findGate(results, "G-CEO1 Signature équipe");
    expect(gate?.pass).toBe(true);
  });

  it("PASS — BACKLINK_EMAIL avec signature équipe", () => {
    const results = runCeoOutboundGates(
      buildBacklinkEmail(`Bonjour,\n\nNotre proposition...${SIGNATURE}`),
    );
    expect(findGate(results, "G-CEO1 Signature équipe")?.pass).toBe(true);
  });

  it("FAIL — email sans signature équipe (juste 'Cordialement')", () => {
    const results = runCeoOutboundGates(
      buildEmail("Salut,\n\nMerci pour ton inscription.\n\nCordialement,"),
    );
    const gate = findGate(results, "G-CEO1 Signature équipe");
    expect(gate?.pass).toBe(false);
    expect(gate?.reason).toMatch(/L'Équipe Deviens Marrant/);
  });

  it("FAIL — email signé 'Alex' (signature individuelle interdite)", () => {
    const results = runCeoOutboundGates(
      buildEmail("Salut,\n\nMerci pour ton inscription.\n\nAlex"),
    );
    const gate = findGate(results, "G-CEO1 Signature équipe");
    expect(gate?.pass).toBe(false);
    expect(gate?.reason).toMatch(/Alex/);
  });

  it("FAIL — email signé 'Alexandre' (signature individuelle interdite)", () => {
    const results = runCeoOutboundGates(
      buildEmail(
        `Salut,\n\nMerci pour ton inscription.${SIGNATURE}\n\nAlexandre`,
      ),
    );
    const gate = findGate(results, "G-CEO1 Signature équipe");
    expect(gate?.pass).toBe(false);
  });

  it("PASS — DM_TWITTER sans signature équipe (gate optionnelle)", () => {
    const results = runCeoOutboundGates(
      buildDm("Salut, j'ai vu ton thread sur la répartie. Sympa la chute.", "DM_TWITTER"),
    );
    expect(findGate(results, "G-CEO1 Signature équipe")?.pass).toBe(true);
  });

  it("PASS — DM_LINKEDIN sans signature équipe (gate optionnelle)", () => {
    const results = runCeoOutboundGates(
      buildDm("Salut, j'ai vu ton post.", "DM_LINKEDIN"),
    );
    expect(findGate(results, "G-CEO1 Signature équipe")?.pass).toBe(true);
  });

  it("FAIL — DM signé 'Alex' (interdit même hors email)", () => {
    const results = runCeoOutboundGates(
      buildDm("Salut, super thread.\n\nAlex", "DM_TWITTER"),
    );
    const gate = findGate(results, "G-CEO1 Signature équipe");
    expect(gate?.pass).toBe(false);
  });

  it("PASS — signature équipe insensible à la casse", () => {
    const results = runCeoOutboundGates(
      buildEmail("Salut\n\nl'équipe deviens marrant"),
    );
    expect(findGate(results, "G-CEO1 Signature équipe")?.pass).toBe(true);
  });
});

// ─── G-CEO2 : Zéro persona nominatif ──────────────────────────────

describe("G-CEO2 — Zéro persona nominatif (Yanis/Sophie/Marc)", () => {
  it("PASS — message sans aucun persona interne", () => {
    const results = runCeoOutboundGates(
      buildEmail(`Salut, merci pour ton inscription.${SIGNATURE}`),
    );
    expect(findGate(results, "G-CEO2 Zéro persona nominatif")?.pass).toBe(true);
  });

  it("FAIL — contient 'Yanis'", () => {
    const results = runCeoOutboundGates(
      buildEmail(`Yanis a partagé ton parcours.${SIGNATURE}`),
    );
    const gate = findGate(results, "G-CEO2 Zéro persona nominatif");
    expect(gate?.pass).toBe(false);
    expect(gate?.reason).toMatch(/Yanis/);
  });

  it("FAIL — contient 'Sophie'", () => {
    const results = runCeoOutboundGates(
      buildEmail(`Sophie a relu ton message.${SIGNATURE}`),
    );
    expect(
      findGate(results, "G-CEO2 Zéro persona nominatif")?.pass,
    ).toBe(false);
  });

  it("FAIL — contient 'Marc'", () => {
    const results = runCeoOutboundGates(
      buildEmail(`Marc nous a recommandés.${SIGNATURE}`),
    );
    expect(
      findGate(results, "G-CEO2 Zéro persona nominatif")?.pass,
    ).toBe(false);
  });

  it("FAIL — détecte le persona dans le subject", () => {
    const results = runCeoOutboundGates({
      channel: "EMAIL",
      subject: "Recommandation de Yanis",
      content: `Bonjour, voici la suite.${SIGNATURE}`,
    });
    expect(
      findGate(results, "G-CEO2 Zéro persona nominatif")?.pass,
    ).toBe(false);
  });

  it("PASS — substring sans word boundary ne matche pas (Marcel, Yanisson)", () => {
    // \b(Yanis|Sophie|Marc)\b → Marcel commence par Marc + 'el' donc ne matche pas
    // car \b(Marc)\b exige une frontière de mot après "Marc".
    const results = runCeoOutboundGates(
      buildEmail(`Marcel et Yanisson sont mentionnés.${SIGNATURE}`),
    );
    expect(
      findGate(results, "G-CEO2 Zéro persona nominatif")?.pass,
    ).toBe(true);
  });

  it("FAIL — 'Sophie Marceau' (homonyme actrice — sécurité prime)", () => {
    // Cas limite documenté plan §Groupe 3 #7 : par sécurité, le gate REJETTE
    // tout match "Sophie" même dans un nom complet d'homonyme.
    const results = runCeoOutboundGates(
      buildEmail(`Comme dirait Sophie Marceau...${SIGNATURE}`),
    );
    expect(
      findGate(results, "G-CEO2 Zéro persona nominatif")?.pass,
    ).toBe(false);
  });

  it("FAIL — DM contient 'Yanis'", () => {
    const results = runCeoOutboundGates(
      buildDm("Yanis a vu ton thread.", "DM_TWITTER"),
    );
    expect(
      findGate(results, "G-CEO2 Zéro persona nominatif")?.pass,
    ).toBe(false);
  });
});

// ─── G-CEO3 : Zéro mention IA (faux positifs MOYEN cross-review s9) ─

describe("G-CEO3 — Zéro mention IA", () => {
  describe("PASS — vrais négatifs", () => {
    it("PASS — message sans aucune mention IA", () => {
      const results = runCeoOutboundGates(
        buildEmail(`Salut, voici la suite de ton parcours.${SIGNATURE}`),
      );
      expect(findGate(results, "G-CEO3 Zéro mention IA")?.pass).toBe(true);
    });
  });

  describe("FAIL — vrais positifs (mentions IA bannies)", () => {
    const positiveCases: Array<[string, string]> = [
      ["IA", `Notre IA t'aide.${SIGNATURE}`],
      ["intelligence artificielle", `Powered by intelligence artificielle.${SIGNATURE}`],
      ["GPT", `Comme avec GPT, on peut...${SIGNATURE}`],
      ["Claude", `On utilise Claude pour répondre.${SIGNATURE}`],
      ["ChatGPT", `Testé sur ChatGPT.${SIGNATURE}`],
      ["LLM", `Notre LLM t'écoute.${SIGNATURE}`],
      ["agent IA", `Un agent IA va te répondre.${SIGNATURE}`],
      ["bot", `Tu parles avec un bot.${SIGNATURE}`],
      ["automatisation", `Grâce à l'automatisation.${SIGNATURE}`],
      ["powered by AI", `Solution powered by AI for you.${SIGNATURE}`],
      ["propulsé par", `Propulsé par notre tech.${SIGNATURE}`],
    ];

    for (const [label, content] of positiveCases) {
      it(`FAIL — mention "${label}" détectée`, () => {
        const results = runCeoOutboundGates(buildEmail(content));
        const gate = findGate(results, "G-CEO3 Zéro mention IA");
        expect(gate?.pass).toBe(false);
      });
    }
  });

  describe("FAUX POSITIFS — risque MOYEN cross-review s9", () => {
    /**
     * Si un seul de ces 3 cas REJETTE, c'est un BUG BLOQUANT.
     * Le test échouera → @fullstack signale à orchestrator au lieu de patcher
     * silencieusement le module sous test (consigne explicite Groupe 3).
     */
    it("PASS — \"j'ai automatiquement pensé à toi\" (faux positif 'automati')", () => {
      const results = runCeoOutboundGates(
        buildEmail(
          `Salut, j'ai automatiquement pensé à toi en voyant ce thread.${SIGNATURE}`,
        ),
      );
      const gate = findGate(results, "G-CEO3 Zéro mention IA");
      expect(gate?.pass).toBe(true);
    });

    it("PASS — \"agent immobilier\" (faux positif 'agent')", () => {
      const results = runCeoOutboundGates(
        buildEmail(
          `Mon cousin est agent immobilier et il fait le même métier.${SIGNATURE}`,
        ),
      );
      const gate = findGate(results, "G-CEO3 Zéro mention IA");
      expect(gate?.pass).toBe(true);
    });

    it("PASS — \"désespère pas\" (faux positif si regex trop large)", () => {
      const results = runCeoOutboundGates(
        buildEmail(
          `Désespère pas, on a tous galéré au début sur scène.${SIGNATURE}`,
        ),
      );
      const gate = findGate(results, "G-CEO3 Zéro mention IA");
      expect(gate?.pass).toBe(true);
    });

    it("PASS — 'AI' comme initiales nom propre (Anaïs Iverson) — cas limite", () => {
      // \bAI\b matcherait — donc on teste un cas où "AI" n'est pas isolé.
      // Cas limite documenté : "Anaïs Iverson" → pas d'initiales 'AI' isolées.
      const results = runCeoOutboundGates(
        buildEmail(`Comme dit Anaïs Iverson dans son livre.${SIGNATURE}`),
      );
      expect(findGate(results, "G-CEO3 Zéro mention IA")?.pass).toBe(true);
    });

    it("PASS — 'iA' lowercase au milieu d'un mot (raison)", () => {
      // \b(IA)\b avec 'i' insensitive matcherait "ia" mais pas dans "raIson"
      // car pas de frontière de mot avant le 'i'.
      const results = runCeoOutboundGates(
        buildEmail(`La raison est simple, c'est ta vie.${SIGNATURE}`),
      );
      expect(findGate(results, "G-CEO3 Zéro mention IA")?.pass).toBe(true);
    });

    it("PASS — 'Maia' (ne contient pas 'IA' avec frontière de mot)", () => {
      const results = runCeoOutboundGates(
        buildEmail(`Maia partage la même passion.${SIGNATURE}`),
      );
      expect(findGate(results, "G-CEO3 Zéro mention IA")?.pass).toBe(true);
    });
  });
});

// ─── G-CEO4 : Pattern invitation ressource (DM/COMMENT) ───────────

describe("G-CEO4 — Pattern invitation ressource (DM/COMMENT)", () => {
  it("PASS — DM_TWITTER avec invitation naturelle (pas de [→ lien])", () => {
    const results = runCeoOutboundGates(
      buildDm(
        "Si tu veux, on peut t'envoyer le parcours sur la répartie.",
        "DM_TWITTER",
      ),
    );
    expect(
      findGate(results, "G-CEO4 Pattern invitation ressource")?.pass,
    ).toBe(true);
  });

  it("FAIL — DM_TWITTER avec '[→ lien]' inline", () => {
    const results = runCeoOutboundGates(
      buildDm("Va voir [→ lien] pour le parcours répartie.", "DM_TWITTER"),
    );
    const gate = findGate(results, "G-CEO4 Pattern invitation ressource");
    expect(gate?.pass).toBe(false);
    expect(gate?.reason).toMatch(/lien/i);
  });

  it("FAIL — DM_LINKEDIN avec '[lien]' (variante simple)", () => {
    const results = runCeoOutboundGates(
      buildDm("Disponible ici [lien] sur le site.", "DM_LINKEDIN"),
    );
    expect(
      findGate(results, "G-CEO4 Pattern invitation ressource")?.pass,
    ).toBe(false);
  });

  it("FAIL — COMMENT_TWITTER avec '[→ lien]'", () => {
    const results = runCeoOutboundGates(
      buildDm("Plus d'infos [→ lien]", "COMMENT_TWITTER"),
    );
    expect(
      findGate(results, "G-CEO4 Pattern invitation ressource")?.pass,
    ).toBe(false);
  });

  it("PASS — DM_INSTAGRAM avec invitation propre", () => {
    const results = runCeoOutboundGates(
      buildDm(
        "Si tu veux on peut t'envoyer un parcours dédié, dis-moi.",
        "DM_INSTAGRAM",
      ),
    );
    expect(
      findGate(results, "G-CEO4 Pattern invitation ressource")?.pass,
    ).toBe(true);
  });

  it("PASS — gate non appliquée sur EMAIL (résultat absent)", () => {
    const results = runCeoOutboundGates(
      buildEmail(`Voici le lien: [→ lien]${SIGNATURE}`),
    );
    expect(findGate(results, "G-CEO4 Pattern invitation ressource")).toBeUndefined();
  });

  it("PASS — gate non appliquée sur BACKLINK_EMAIL", () => {
    const results = runCeoOutboundGates(
      buildBacklinkEmail(`Notre dossier: [→ lien]${SIGNATURE}`),
    );
    expect(findGate(results, "G-CEO4 Pattern invitation ressource")).toBeUndefined();
  });

  it("PASS — DM avec URL réelle (deviens-marrant.fr/...) — pattern non textuel '[lien]'", () => {
    // Le gate cible explicitement "[→ lien]" / "[lien]" textuel.
    // Une URL réelle ne déclenche PAS G-CEO4 (mais peut être attrapé par la
    // dual-pass LLM via critère 4 du prompt validateCeoOutbound).
    const results = runCeoOutboundGates(
      buildDm(
        "deviens-marrant.fr/parcours/repartie si ça t'intéresse.",
        "DM_TWITTER",
      ),
    );
    expect(
      findGate(results, "G-CEO4 Pattern invitation ressource")?.pass,
    ).toBe(true);
  });
});

// ─── Combinaisons multi-gates ─────────────────────────────────────

describe("Combinaisons gates CEO", () => {
  it("FAIL multiple — email signé 'Alex' + persona Yanis + mention IA", () => {
    const results = runCeoOutboundGates(
      buildEmail(`Yanis a propulsé par notre IA. Cordialement,\n\nAlex`),
    );
    expect(findGate(results, "G-CEO1 Signature équipe")?.pass).toBe(false);
    expect(
      findGate(results, "G-CEO2 Zéro persona nominatif")?.pass,
    ).toBe(false);
    expect(findGate(results, "G-CEO3 Zéro mention IA")?.pass).toBe(false);
  });

  it("PASS all 3 — email parfait", () => {
    const results = runCeoOutboundGates(
      buildEmail(
        `Salut, voici la suite de ton parcours sur la répartie.${SIGNATURE}`,
      ),
    );
    expect(results.every((g) => g.pass)).toBe(true);
    // Note : G-CEO4 absent sur EMAIL (par design).
    expect(results.length).toBe(3);
  });

  it("PASS all 4 — DM parfait (G-CEO1/2/3/4 présents)", () => {
    const results = runCeoOutboundGates(
      buildDm(
        "Salut, ton thread sur la répartie est top. Si tu veux on peut t'envoyer le parcours.",
        "DM_TWITTER",
      ),
    );
    expect(results.length).toBe(4);
    expect(results.every((g) => g.pass)).toBe(true);
  });

  it("Adversarial — input vide ne crash pas", () => {
    const results = runCeoOutboundGates({
      channel: "EMAIL",
      content: "",
    });
    // Email vide → pas de signature → G-CEO1 FAIL, le reste PASS.
    expect(findGate(results, "G-CEO1 Signature équipe")?.pass).toBe(false);
    expect(
      findGate(results, "G-CEO2 Zéro persona nominatif")?.pass,
    ).toBe(true);
    expect(findGate(results, "G-CEO3 Zéro mention IA")?.pass).toBe(true);
  });

  it("Adversarial — emoji + accents + 10KB content ne crash pas", () => {
    const big = "🏠 Voilà la suite, accents éàç. ".repeat(500);
    const results = runCeoOutboundGates(buildEmail(`${big}${SIGNATURE}`));
    expect(results.length).toBe(3);
    expect(findGate(results, "G-CEO1 Signature équipe")?.pass).toBe(true);
  });
});
