/**
 * @jest-environment node
 *
 * Tests — Gates blog s11 lot 3 (G-B19 à G-B23).
 *
 * Renforcement du prompt seo-blog-agent contre les défauts détectés en prod
 * (audit s11) : staccato IA, témoignages fictifs, structure scolaire,
 * mention IA, citations d'humoristes non vérifiables.
 */
// Mock du client Anthropic — évite l'erreur "browser-like env" en jsdom
// (le standup-director-agent importe transitively @/lib/ai/client).
jest.mock("@/lib/ai/client", () => ({
  anthropic: {},
  SONNET_MODEL: "claude-sonnet-mock",
  HAIKU_MODEL: "claude-haiku-mock",
  buildCachedSystemBlock: (text: string) => ({ type: "text", text, cache_control: { type: "ephemeral" } }),
  callWithRetry: jest.fn(),
  extractJson: jest.fn(),
  getResponseText: jest.fn(),
}));

import { runBlogGates } from "@/lib/ai/agents/standup-director-agent";

const VALID_BASELINE = {
  title: "Comment devenir drôle : le guide qui marche",
  slug: "test-slug",
  excerpt: "Une méthode concrète pour progresser en humour, testée sur des dizaines de personnes.",
  content:
    // Contenu long, minimal, qui passe les gates existantes (mots, H2, liens…).
    "Tu veux devenir plus drôle sans passer par la case ridicule. Ça tombe bien : la méthode existe.\n\n" +
    "## Pourquoi tu galères ?\n\n" +
    "Tu n'es pas seul dans cette galère. Voici les 3 raisons principales.\n\n" +
    "1. Tu essaies trop fort — l'humour se travaille mais ne se force pas.\n" +
    "2. Tu copies au lieu d'observer.\n" +
    "3. Tu attends d'avoir la vanne parfaite avant d'oser.\n\n" +
    "> **CLEF :** Le meilleur exercice, c'est de sortir 3 vannes ratées avant d'attendre la parfaite.\n\n" +
    "## Comment progresser étape par étape ?\n\n" +
    "Va voir [nos vannes](/vannes), lis [nos conseils](/conseils), regarde [nos vidéos](/videos), " +
    "démarre un [parcours](/parcours), consulte [nos articles](/blog/comment-avoir-de-la-repartie), " +
    "abonne-toi via [notre abonnement](/abonnement), lis [notre à-propos](/a-propos) et " +
    "explore [le glossaire](/glossaire).\n\n" +
    "1. Observe.\n2. Note.\n3. Teste.\n\n" +
    "## FAQ\n\n" +
    "Comment devenir drôle rapidement ? Commence par pratiquer 10 minutes par jour.\n\n" +
    "1. Une vanne courte.\n2. Un contexte réel.\n3. Un feedback honnête.\n\n" +
    "Voilà de quoi te lancer. " +
    // Padding words pour atteindre 1500 mots minimum.
    Array.from({ length: 1500 }, () => "mot").join(" "),
  targetKeyword: "devenir drôle",
};

function gateFor(name: string, results: ReturnType<typeof runBlogGates>) {
  return results.find((r) => r.gate.startsWith(name));
}

describe("G-B19 Anti-staccato IA", () => {
  it("PASS baseline : pas de staccato", () => {
    const g = gateFor("G-B19", runBlogGates(VALID_BASELINE));
    expect(g?.pass).toBe(true);
  });

  it.each([
    ["Boom.", "Boom."],
    ["Boom, connexion créée.", "Boom,"],
    ["Plot twist : ton silence est ton super-pouvoir.", "Plot twist :"],
    ["STOP.", "STOP."],
    ["Voilà.", "Voilà."],
    ["Fin.", "Fin."],
  ])("FAIL sur staccato \"%s\"", (fragment) => {
    const content = `Intro paragraphe standard.\n\n${fragment}\n\nParagraphe suivant.`;
    const g = gateFor("G-B19", runBlogGates({ ...VALID_BASELINE, content }));
    expect(g?.pass).toBe(false);
  });

  it("PASS pour \"Boom\" utilisé dans une phrase construite (pas en fragment isolé)", () => {
    const content =
      "Ce type de vanne fait boom dans les soirées où tout le monde se prend au sérieux. " +
      VALID_BASELINE.content;
    const g = gateFor("G-B19", runBlogGates({ ...VALID_BASELINE, content }));
    expect(g?.pass).toBe(true);
  });
});

describe("G-B20 Anti-témoignage fictif Prénom NN ans", () => {
  it("PASS baseline", () => {
    const g = gateFor("G-B20", runBlogGates(VALID_BASELINE));
    expect(g?.pass).toBe(true);
  });

  it.each([
    "Lucas, 21 ans, étudiant en commerce",
    "Marine, 28 ans, chargée de com",
    "Kevin, 35 ans, en reconstruction",
    "Émilie, 30 ans, ingénieure",
    "Léo, 24 ans, développeur",
  ])("FAIL sur témoignage fictif \"%s\"", (testimonial) => {
    const content = `Un cas concret : ${testimonial}. Il/elle a testé la méthode.`;
    const g = gateFor("G-B20", runBlogGates({ ...VALID_BASELINE, content }));
    expect(g?.pass).toBe(false);
  });

  it("PASS pour formulation anonymisée acceptable", () => {
    const content =
      "Un cas concret : un étudiant en commerce, 20-25 ans, a testé cette technique. " +
      VALID_BASELINE.content;
    const g = gateFor("G-B20", runBlogGates({ ...VALID_BASELINE, content }));
    expect(g?.pass).toBe(true);
  });
});

describe("G-B21 Anti-structure scolaire", () => {
  it("PASS baseline", () => {
    const g = gateFor("G-B21", runBlogGates(VALID_BASELINE));
    expect(g?.pass).toBe(true);
  });

  it.each([
    "## Semaine 1 : Maîtriser les bases",
    "## Jours 1-3 : Le Rebond",
    "### Jours 4-7 : Les Questions Magiques",
    "## Semaines 1-2 : Fondations",
  ])("FAIL sur structure scolaire \"%s\"", (heading) => {
    const content = `Intro.\n\n${heading}\n\nParagraphe.`;
    const g = gateFor("G-B21", runBlogGates({ ...VALID_BASELINE, content }));
    expect(g?.pass).toBe(false);
  });

  it("PASS pour progression narrative acceptable", () => {
    const content =
      "Intro.\n\n## Les premiers pas — poser les deux réflexes de base\n\nParagraphe.";
    const g = gateFor("G-B21", runBlogGates({ ...VALID_BASELINE, content }));
    expect(g?.pass).toBe(true);
  });
});

describe("G-B22 Anti-mention IA", () => {
  it("PASS baseline", () => {
    const g = gateFor("G-B22", runBlogGates(VALID_BASELINE));
    expect(g?.pass).toBe(true);
  });

  it.each([
    "Nouveaux contenus générés par IA chaque semaine",
    "Notre IA analyse les vannes du catalogue",
    "Contenu généré par intelligence artificielle",
    "Testé avec ChatGPT",
    "Selon Claude, cette technique fonctionne",
    "GPT-4 confirme cette analyse",
  ])("FAIL sur mention IA \"%s\"", (mention) => {
    const content = `${mention}. ${VALID_BASELINE.content}`;
    const g = gateFor("G-B22", runBlogGates({ ...VALID_BASELINE, content }));
    expect(g?.pass).toBe(false);
  });
});

describe("G-B23 Anti-citation attribuée sans source", () => {
  it("PASS baseline", () => {
    const g = gateFor("G-B23", runBlogGates(VALID_BASELINE));
    expect(g?.pass).toBe(true);
  });

  it.each([
    'Comme le dit Fary : "L\'humour c\'est la politesse du désespoir."',
    'Selon Paul Mirabel : "Le silence est ton meilleur ami."',
    'D\'après Roman Frayssinet, "L\'observation est tout."',
    'Comme dit Blanche Gardin : "Il faut savoir se moquer de soi."',
    'Pour reprendre Waly Dia : "L\'humour est un métier."',
  ])("FAIL sur citation attribuée \"%s\"", (attribution) => {
    const content = `Intro paragraphe. ${attribution}\n\nSuite du texte. ${VALID_BASELINE.content}`;
    const g = gateFor("G-B23", runBlogGates({ ...VALID_BASELINE, content }));
    expect(g?.pass).toBe(false);
  });

  it("PASS pour référence humoriste sans citation entre guillemets", () => {
    const content =
      "Fary utilise souvent l'escalade — partir d'une observation banale et pousser jusqu'à l'absurde. Paul Mirabel excelle dans le naturel non forcé. " +
      VALID_BASELINE.content;
    const g = gateFor("G-B23", runBlogGates({ ...VALID_BASELINE, content }));
    expect(g?.pass).toBe(true);
  });

  it("PASS pour formulation impersonnelle acceptable", () => {
    const content =
      'Comme dirait un stand-upper : "L\'humour c\'est du travail, pas du talent." ' +
      VALID_BASELINE.content;
    const g = gateFor("G-B23", runBlogGates({ ...VALID_BASELINE, content }));
    expect(g?.pass).toBe(true);
  });
});
