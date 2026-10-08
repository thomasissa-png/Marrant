/**
 * s18 : parcours Storytelling (contenu validé, livré INACTIF).
 * Contenu (`parcours-storytelling-s18.json`) : 6 étapes, XP, dayNumber, positions des
 * bonnes réponses, zéro tiret cadratin, « blague » seulement dans « blague à tiroirs »,
 * vannes trouvées par leur texte exact ; interrupteur de publication ; suite de fin
 * classée (spec s17 §5.5) ; tâche de démarrage idempotente.
 */
import storytelling from "../../../../../docs/content/parcours-storytelling-s18.json";
import vannesActives from "../../../../../docs/content/vannes-actives-s17.json";
import parcoursSeed from "../../../../../docs/content/parcours-seed.json";
import conseilsSeed from "../../../../../docs/content/conseils-seed.json";
import { pickSuite } from "@/components/parcours/path-completion-card";

const seed = storytelling.parcours;
const meta = storytelling._meta;
const lettres = (s: { quiz: Array<{ correctIndex: number }> }) => s.quiz.map((q) => "ABCD"[q.correctIndex]).join("");

function allStrings(value: unknown): string[] {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(allStrings);
  if (value && typeof value === "object") return Object.values(value).flatMap(allStrings);
  return [];
}

describe("contenu du parcours Storytelling", () => {
  it("fiche : slug, order 4, 6 semaines, 20 min/semaine, niveau sans « Expert »", () => {
    expect(seed).toMatchObject({
      slug: "storytelling",
      title: "Parcours Storytelling",
      order: 4,
      duration: "6 semaines",
      timePerWeek: "20 min/semaine",
      difficulty: "INTERMEDIAIRE",
      difficultyLabel: "DEBUTANT → INTERMEDIAIRE",
      nextParcoursRanking: ["machine-a-cafe", "repartie", "confiance", "pro"],
    });
    expect(seed.description.startsWith("Il y a toujours quelqu'un pour dire « et donc ? »")).toBe(true);
    expect(seed.testimonial.startsWith("Imagine Samir.")).toBe(true);
    expect(allStrings(seed).some((t) => /expert/i.test(t))).toBe(false);
  });

  it("6 étapes : XP 50 à 200 (700 + 100 de fin), dayNumber 3 à 38, seule l'étape 1 gratuite", () => {
    expect(seed.steps.map((s) => s.week)).toEqual([1, 2, 3, 4, 5, 6]);
    expect(seed.steps.map((s) => s.moduleXp)).toEqual([50, 75, 100, 125, 150, 200]);
    expect(seed.steps.reduce((n, s) => n + s.moduleXp, 0)).toBe(700);
    expect(seed.steps.map((s) => s.dayNumber)).toEqual([3, 10, 17, 24, 31, 38]);
    expect(seed.steps.map((s) => s.free)).toEqual([true, false, false, false, false, false]);
    expect(seed.steps.map((s) => s.moduleTitle)).toEqual([
      "Ton anecdote, coupée au plus court",
      "Des personnages qu'on entend",
      "Faire le bilan de ton raté",
      "Une chute qui se lit de deux façons",
      "Un détour qui ne perd personne",
      "Un détail qui revient à la fin",
    ]);
  });

  it("conseils des étapes : titres en base (vanne au callback), protection sous le défi de l'étape 3", () => {
    expect(seed.steps.map((s) => s.tipTitle)).toEqual([
      "Raconter une anecdote en 3 actes",
      "La technique du personnage",
      "Rigoler de ses échecs",
      "Le twist final",
      "La blague à tiroirs",
      "Le callback : faire revenir une vanne au bon moment",
    ]);
    const protection = seed.steps.map((s) => ("exerciceProtection" in s ? s.exerciceProtection : null));
    expect(protection.filter(Boolean)).toHaveLength(1);
    expect(protection[2]).toMatch(/^Un raté léger, jamais une blessure récente\./);
  });

  it("positions des bonnes réponses : celles des fichiers validés, jamais deux de suite au même rang", () => {
    expect(seed.steps.map(lettres)).toEqual(["DB", "ACBD", "CDAB", "DACB", "CBDA", "BDCAD"]);
    const suite = seed.steps.map(lettres).join("");
    for (let i = 1; i < suite.length; i++) expect(suite[i]).not.toBe(suite[i - 1]);
    seed.steps.flatMap((s) => s.quiz).forEach((q) => {
      expect(q.options).toHaveLength(4);
      expect(q.explanation.startsWith(`La ${"ABCD"[q.correctIndex]}.`)).toBe(true);
    });
  });

  it("vidéos : 2 par étape (obligatoire puis facultative), une seule à l'étape 6, chacune légendée", () => {
    expect(seed.steps.map((s) => s.videos.length)).toEqual([2, 2, 2, 2, 2, 1]);
    expect(seed.steps[5].videos[0].youtubeId).toBe("eYhWcDdI3rM");
    expect(seed.steps[5].moduleFormat).toBe("Un conseil, un défi, 5 vannes, une vidéo, un petit quiz.");
    seed.steps.flatMap((s) => s.videos).forEach((v) => expect(v.why.length).toBeGreaterThan(40));
    const ids = seed.steps.flatMap((s) => s.videos.map((v) => v.youtubeId));
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("aucun tiret cadratin, « blague » seulement dans « blague à tiroirs »", () => {
    const textes = allStrings([seed, meta.conseilsReactives, meta.defisRetouches, meta.vannesNeuvesEtape5]);
    textes.forEach((t) => {
      expect(t).not.toContain("—");
      expect(t.replace(/blague à tiroirs/gi, "")).not.toMatch(/blague/i);
    });
  });
});

describe("vannes des étapes", () => {
  const actives = new Set(
    (vannesActives as Array<{ content?: string }>).flatMap((v) => (typeof v.content === "string" ? [v.content] : [])),
  );
  const s17 = new Set(
    (parcoursSeed as Array<{ steps: Array<{ jokeContents?: string[] }> }>).flatMap((p) =>
      p.steps.flatMap((s) => s.jokeContents ?? []),
    ),
  );

  it("5 par étape, 30 textes distincts, aucun déjà utilisé dans les 13 étapes s17", () => {
    seed.steps.forEach((s) => expect(s.jokeContents).toHaveLength(5));
    const all = seed.steps.flatMap((s) => s.jokeContents);
    expect(new Set(all).size).toBe(30);
    all.forEach((c) => expect(s17.has(c)).toBe(false));
  });

  it("étapes 1 à 4 et 6 : les 25 vannes existent, actives, par leur texte exact", () => {
    const etapes = seed.steps.filter((s) => s.week !== 5).flatMap((s) => s.jokeContents);
    expect(etapes).toHaveLength(25);
    expect(etapes.filter((c) => !actives.has(c))).toEqual([]);
  });

  it("étape 5 : les 5 vannes neuves (forme « Parenthèse : … Bref. »), à créer, technique « Le tiroir »", () => {
    const etape5 = seed.steps[4].jokeContents;
    expect(meta.vannesNeuvesEtape5.map((v) => v.content)).toEqual(etape5);
    meta.vannesNeuvesEtape5.forEach((v) => {
      expect(actives.has(v.content)).toBe(false);
      expect(v.content).toMatch(/ Parenthèse : [a-zà-ÿ].+ Bref\.$/);
      expect(v.punchline.length).toBeGreaterThan(10);
      expect(v.comedyTechnique).toBe("Le tiroir");
      expect(v.techniqueExplanation).toContain("« Bref. »");
      expect(["SITUATION", "SOIREES", "BOULOT"]).toContain(v.category);
    });
  });
});

describe("conseils réactivés et seed des conseils", () => {
  const byTitle = new Map((conseilsSeed as Array<{ title: string; exercise: string; content: string }>).map((t) => [t.title, t]));

  it("les 3 ids de l'audit s14, titres inchangés, textes identiques dans conseils-seed.json", () => {
    expect(meta.conseilsReactives.map((c) => c.id)).toEqual([
      "cmmp8ozsx000mqk63ux155ma1",
      "cmmp8ozsx000tqk63yhagsgqi",
      "cmmp8ozsx0012qk63kxfsux75",
    ]);
    meta.conseilsReactives.forEach((c) => {
      expect(byTitle.get(c.title)).toMatchObject({ content: c.content, exercise: c.exercise });
    });
    // Étape 1 : le défi du conseil est celui de l'étape (DÉFI COUPE), sans retouche.
    expect(meta.conseilsReactives[0].exercise.startsWith("DÉFI COUPE :")).toBe(true);
  });

  it("repli solo de l'étape 3 dans le seed ; défi B de l'étape 6 réservé à la publication", () => {
    const [r3, r6] = meta.defisRetouches;
    expect(byTitle.get("Rigoler de ses échecs")?.exercise.endsWith(r3.ajouterALaFin)).toBe(true);
    expect(r6.ajouterALaFin.startsWith("Tu travailles ton anecdote du parcours Storytelling ?")).toBe(true);
    expect(byTitle.get(r6.tipTitle)?.exercise).not.toContain("Storytelling");
  });
});

describe("suite de fin classée (spec s17 §5.5)", () => {
  const fait = { completedSteps: [1, 2, 3], completedAt: "2026-10-01" };
  const enCours = (iso: string) => ({ completedSteps: [1], completedAt: null, lastActivityAt: iso });
  const p = (slug: string, progress: object | null = null) => ({
    slug,
    title: `Parcours ${slug}`,
    personaTagline: `accroche ${slug}`,
    progress: progress as never,
  });
  const ranking = ["storytelling", "repartie", "machine-a-cafe", "pro"];

  it("SU-01 : rien de commencé, premier du classement ; parcours absent (pro) ignoré", () => {
    const paths = [p("machine-a-cafe"), p("repartie"), p("confiance", fait), p("storytelling")];
    expect(pickSuite(paths, "confiance", "repartie", ranking)).toMatchObject({ slug: "storytelling", accroche: "accroche storytelling" });
  });

  it("Storytelling inactif (absent de l'API) : comportement s17 conservé, Répartie avec sa phrase", () => {
    const paths = [p("machine-a-cafe"), p("repartie"), p("confiance", fait)];
    expect(pickSuite(paths, "confiance", "repartie", ranking)).toMatchObject({ slug: "repartie", accroche: null });
  });

  it("SU-02 / SU-09 : un parcours en cours passe d'abord, le plus récemment touché en tête", () => {
    const paths = [
      p("machine-a-cafe", enCours("2026-10-02T10:00:00Z")),
      p("repartie", enCours("2026-10-05T10:00:00Z")),
      p("confiance", fait),
      p("storytelling"),
    ];
    expect(pickSuite(paths, "confiance", "repartie", ranking)).toMatchObject({ slug: "repartie" });
  });

  it("SU-03 / SU-04 / SU-06 : jamais un parcours terminé ni le courant ; tout fini = carnet", () => {
    const paths = [p("machine-a-cafe", fait), p("repartie", fait), p("confiance", fait), p("storytelling")];
    expect(pickSuite(paths, "confiance", "repartie", ranking)).toMatchObject({ slug: "storytelling" });
    expect(pickSuite([p("storytelling", fait), p("confiance", fait)], "storytelling", "machine-a-cafe")).toEqual({
      kind: "tout-fini",
    });
  });

  it("SU-12 : un parcours hors classement reste candidat, après les classés", () => {
    const paths = [p("nouveau"), p("machine-a-cafe"), p("storytelling", fait)];
    expect(pickSuite(paths, "storytelling", "machine-a-cafe", ["machine-a-cafe"])).toMatchObject({ slug: "machine-a-cafe" });
    expect(pickSuite([p("nouveau"), p("storytelling", fait)], "storytelling", null, ["machine-a-cafe"])).toMatchObject({
      slug: "nouveau",
    });
  });
});
