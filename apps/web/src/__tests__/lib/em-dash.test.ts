/**
 * @jest-environment node
 *
 * Tests : stripEmDashes (retrait des tirets cadratins, ponctuation seulement).
 * Cas réels tirés des articles de blog (statiques et base).
 */
import { stripEmDashes, stripEmDashesWithStats } from "@/lib/em-dash";

const cases: [string, string, string][] = [
  [
    "incise avec virgules internes → parenthèses",
    "L'humour s'appuie sur 3 leviers — observation, surprise, timing — que n'importe qui peut développer.",
    "L'humour s'appuie sur 3 leviers (observation, surprise, timing) que n'importe qui peut développer.",
  ],
  [
    "incise simple → virgules",
    "**Panayotis Pascot** peut raconter un truc banal — genre faire ses courses — et c'est hilarant.",
    "**Panayotis Pascot** peut raconter un truc banal, genre faire ses courses, et c'est hilarant.",
  ],
  [
    "explication → deux-points",
    "Ton cerveau sait déjà faire tout ça — il le fait chaque fois que tu comprends une blague.",
    "Ton cerveau sait déjà faire tout ça : il le fait chaque fois que tu comprends une blague.",
  ],
  [
    "connecteur « et » → virgule",
    "tu vas voir la différence dans tes interactions — et les gens le sentiront avant toi.",
    "tu vas voir la différence dans tes interactions, et les gens le sentiront avant toi.",
  ],
  [
    "« pas » → virgule",
    "La règle d'or : rester calme, sourire, et viser le rire — pas la blessure.",
    "La règle d'or : rester calme, sourire, et viser le rire, pas la blessure.",
  ],
  [
    "deux-points déjà présent → virgule",
    "> **À retenir :** L'humour n'est pas un talent inné — c'est une compétence cognitive.",
    "> **À retenir :** L'humour n'est pas un talent inné, c'est une compétence cognitive.",
  ],
  [
    "deux-points déjà présent + majuscule → point",
    "**Étape 1 — Installer les réflexes (première semaine) :**",
    "**Étape 1. Installer les réflexes (première semaine) :**",
  ],
  [
    "élément de liste en gras → deux-points",
    "1. **Étape 1 — Observer.** Note chaque jour une situation absurde.",
    "1. **Étape 1 : Observer.** Note chaque jour une situation absurde.",
  ],
  [
    "« ce qui » → virgule",
    "Simple, efficace, et ça prouve que tu écoutes — ce qui est déjà mieux que 80% des gens.",
    "Simple, efficace, et ça prouve que tu écoutes, ce qui est déjà mieux que 80% des gens.",
  ],
  [
    "« Que tu … — » → virgule",
    "Que tu cherches à alimenter tes conversations au bureau — la structure setup/punchline va transformer tes anecdotes.",
    "Que tu cherches à alimenter tes conversations au bureau, la structure setup/punchline va transformer tes anecdotes.",
  ],
  [
    "incise en tête de phrase → parenthèses + virgule de détachement",
    "Avec 5 minutes par jour — 3 phrases filet à ressortir, écoute active — la plupart voient une vraie amélioration.",
    "Avec 5 minutes par jour (3 phrases filet à ressortir, écoute active), la plupart voient une vraie amélioration.",
  ],
  [
    "citation entre guillemets terminée par « ? » → deux-points, pas de point",
    '- **"Ça va ?"** — Question rhétorique.',
    '- **"Ça va ?"** : Question rhétorique.',
  ],
  [
    "lien Markdown conservé → deux-points après le lien",
    "Se tromper de moment fait partie des [5 erreurs qui tuent tes blagues](/blog/erreurs-blagues) — l'erreur 5 détaille tout.",
    "Se tromper de moment fait partie des [5 erreurs qui tuent tes blagues](/blog/erreurs-blagues) : l'erreur 5 détaille tout.",
  ],
  [
    "puce à libellé en gras suivie d'une réplique → deux-points (pas de virgule)",
    '- **Le catastrophiste** — "Et si personne ne rit ? Et si je vexe quelqu\'un ?"',
    '- **Le catastrophiste** : "Et si personne ne rit ? Et si je vexe quelqu\'un ?"',
  ],
  [
    "après une réplique entre guillemets → deux-points, même si la phrase en a déjà un",
    '- **"Lui, au moins, quelqu\'un va le brancher."** — "Brancher", c\'est recharger ou draguer : le téléphone a plus de chance que toi',
    '- **"Lui, au moins, quelqu\'un va le brancher."** : "Brancher", c\'est recharger ou draguer : le téléphone a plus de chance que toi',
  ],
];

describe("stripEmDashes", () => {
  it.each(cases)("%s", (_label, input, expected) => {
    expect(stripEmDashes(input)).toBe(expected);
  });

  it("ne touche jamais les lignes de titre", () => {
    const md = "## Type 1 : L'observationnel — \"C'est tellement vrai\"\n\nCorps — suite.";
    expect(stripEmDashes(md)).toBe("## Type 1 : L'observationnel — \"C'est tellement vrai\"\n\nCorps : suite.");
  });

  it("ne touche ni le code inline, ni les blocs de code, ni le texte des liens", () => {
    const md = "Voir `a — b` et [x — y](/z) — fin.\n```\ncode — brut\n```";
    expect(stripEmDashes(md)).toBe("Voir `a — b` et [x — y](/z) : fin.\n```\ncode — brut\n```");
  });

  it("supprime le tiret de dialogue en début de ligne", () => {
    const r = stripEmDashesWithStats("— T'as vu l'heure ?\n— Oui.");
    expect(r.text).toBe("T'as vu l'heure ?\nOui.");
    expect(r.stats.dialogue).toBe(2);
  });

  it("ponctuation forte avant le tiret → nouvelle phrase", () => {
    const r = stripEmDashesWithStats("C'est drôle ? — Pas toujours.");
    expect(r.text).toBe("C'est drôle ? Pas toujours.");
    expect(r.stats.period).toBe(1);
  });

  it("compte les remplacements par type", () => {
    const r = stripEmDashesWithStats(cases.map((c) => c[1]).join("\n"));
    const total = Object.values(r.stats).reduce((s, n) => s + n, 0);
    expect(total).toBe(18);
    expect(r.text).not.toContain("—");
  });

  it("idempotent et neutre sur un texte sans tiret cadratin", () => {
    const once = stripEmDashes(cases[0][1]);
    expect(stripEmDashes(once)).toBe(once);
    expect(stripEmDashes("Texte – avec demi-cadratin et trait-d'union.")).toBe(
      "Texte – avec demi-cadratin et trait-d'union.",
    );
  });
});
