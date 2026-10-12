/**
 * @jest-environment node
 *
 * Corrections s20 de la version s11 (`docs/copy/corrections-s11-s20.md`) :
 * 32 corrections validées à l'aveugle (§4, sauf C02, C03, C13, C18, C21, C26
 * remplacées par leur version §9), appliquées dans `blog-article-rewrites.json`
 * (v4). Le JSON est aussi débarrassé de ses tirets cadratins hors titres
 * (`stripEmDashes`) : une réapplication n'en réinjecte plus.
 */
import rewrites from "@/data/blog-article-rewrites.json";
import { stripEmDashes } from "@/lib/em-dash";
import { BLOG_EM_DASH_PATCH_VERSION } from "@/lib/startup-tasks";

type Field = "content" | "metaDescription";
interface Entry {
  slug: string;
  excerpt: string;
  metaDescription: string;
  content: string;
}
const file = rewrites as { _meta: { version: number }; rewrites: Entry[] };
const bySlug = new Map(file.rewrites.map((r) => [r.slug, r]));
const count = (text: string, needle: string) => text.split(needle).length - 1;
const HEADING_RE = /^\s{0,3}(>\s*)*#{1,6}\s/;

/** « Après » exacts (C26 : la ligne en gras « Les codes … à connaître » est supprimée). */
const AFTERS: { id: string; slug: string; field: Field; after: string }[] = [
  { id: "C01", slug: "avoir-confiance-en-soi-grace-a-l-humour", field: "content", after: "Les neurosciences vont dans ce sens : quand une blague te fait rire, ton cerveau active son circuit de la récompense, celui qui s'allume aussi quand on remporte une victoire. Sans le short et sans les courbatures." },
  { id: "C02", slug: "avoir-confiance-en-soi-grace-a-l-humour", field: "content", after: "Les autres le remarquent aussi : des chercheurs de la Wharton School et de la Harvard Business School ont montré qu'une blague bien choisie fait paraître son auteur plus sûr de lui et plus compétent, donc mieux placé dans le groupe. À condition qu'elle tombe au bon moment : une blague déplacée fait l'effet inverse." },
  { id: "C03", slug: "blague-courte-arme-secrete-humour", field: "content", after: "Regarde Roman Frayssinet : ses spectacles sont pleins d'anecdotes et de digressions, mais ce qui fait éclater la salle, c'est la phrase qui tombe au bon endroit. Un setup court, une chute plus courte encore, et c'est parti." },
  { id: "C04", slug: "blague-courte-arme-secrete-humour", field: "content", after: "Les humoristes le savent depuis toujours : ce qui est court se retient mieux et se ressort plus facilement. Nos [conseils](/conseils) partent du même principe : court, clair, facile à ressortir." },
  { id: "C05", slug: "blague-courte-arme-secrete-humour", field: "content", after: "**Un silence d'une seconde avant la chute**" },
  { id: "C06", slug: "blague-courte-arme-secrete-humour", field: "content", after: "Chacune est pensée pour son contexte : au mauvais endroit, une vanne courte tombe aussi vite qu'elle est partie." },
  { id: "C07", slug: "blague-courte-arme-secrete-humour", field: "content", after: "Si tu en veux d'autres, notre [abonnement](/abonnement) débloque toutes les vannes du catalogue, avec leur décryptage." },
  { id: "C08", slug: "blague-courte-arme-secrete-humour", field: "metaDescription", after: "Blague courte, l'arme secrète de l'humour : anatomie d'une vanne qui marche, 3 pièges à éviter, méthode pour raccourcir et 15 exemples à ressortir." },
  { id: "C09", slug: "blague-drole-7-criteres-pepite", field: "content", after: "Bienvenue dans le club, très fréquenté, de ceux qui confondent \"blague qui me fait rire\" et \"blague qui fait rire\"." },
  { id: "C10", slug: "blague-drole-7-criteres-pepite", field: "content", after: "**Exemple dans la veine de Fary :**" },
  { id: "C11", slug: "blague-drole-7-criteres-pepite", field: "content", after: "→ Inattendu (certaines feuilles étaient dans la famille avant le narrateur) mais cohérent : à force de resservir chaque année, le papier finit par avoir de l'ancienneté." },
  { id: "C12", slug: "blague-drole-7-criteres-pepite", field: "metaDescription", after: "Pourquoi ta blague ne fait rire que toi ? Les 7 critères d'une blague drôle, de la surprise au timing, et une grille pour tester les tiennes." },
  { id: "C13", slug: "citation-drole", field: "content", after: "Quelques-unes revisitent des classiques, et on cite l'auteur quand on le connaît. Les autres, tu peux les ressortir comme si elles venaient de toi." },
  { id: "C14", slug: "citation-drole", field: "content", after: "39. **\"Cette année m'a appris que j'étais plus résistant que prévu. Et plus créatif pour les excuses.\"**" },
  { id: "C14", slug: "citation-drole", field: "content", after: "*Pour faire le bilan d'une année difficile. Remplace « cette année » par l'année que tu préfères oublier.*" },
  { id: "C15", slug: "citation-drole", field: "content", after: "Ici, l'humour est la seule chose sérieuse dans la vie. Alors prends ces citations au sérieux... mais pas trop quand même." },
  { id: "C16", slug: "comment-improviser-des-blagues", field: "content", after: "Tu relies cette observation à quelque chose de familier : ton stagiaire, qui essaie de paraître pro. Dans ta tête, ça donne :" },
  { id: "C16", slug: "comment-improviser-des-blagues", field: "content", after: "\"Et si je demandais à mon stagiaire d'expliquer la synergie collaborative ?\"" },
  { id: "C16", slug: "comment-improviser-des-blagues", field: "content", after: "\"Il me regarderait 5 secondes, puis il proposerait une pause café.\"" },
  { id: "C17", slug: "comment-improviser-des-blagues", field: "content", after: "Quand un humoriste fait rire toute une salle avec une remarque sur le prix du parking, il ne l'a pas forcément écrite dans son salon." },
  { id: "C18", slug: "comment-improviser-des-blagues", field: "content", after: "Certains **schémas humoristiques** reviennent d'un sketch à l'autre, et tu peux les piquer sans scrupule. En voici 5, à garder sous le coude :" },
  { id: "C19", slug: "comment-improviser-des-blagues", field: "content", after: "il part de ce qu'il observe autour de lui (la société, l'actualité, le quotidien), le relie à des situations que tout le monde connaît, et en tire des **punchlines** qui tapent juste." },
  { id: "C20", slug: "comment-raconter-une-blague-sans-la-rater", field: "content", after: "**Roman Frayssinet** sait exactement quand marquer un temps d'arrêt pour laisser la tension monter : écoute ses silences avant certaines punchlines, tu verras qu'il laisse la salle attendre. En conversation, c'est plus discret : une micro-pause d'une seconde environ avant la chute suffit à créer l'attente qui décuple l'effet." },
  { id: "C21", slug: "comment-raconter-une-blague-sans-la-rater", field: "content", after: "Une seconde de pause avant la punchline, et un sourire peut devenir un éclat de rire." },
  { id: "C22", slug: "comment-raconter-une-blague-sans-la-rater", field: "content", after: "**Waly Dia** en est un bon exemple : ses punchlines vont droit au but, sans un mot de trop." },
  { id: "C23", slug: "comment-raconter-une-blague-sans-la-rater", field: "content", after: "**2,99 €/mois** : beaucoup moins cher que le silence après une blague massacrée." },
  { id: "C24", slug: "etre-plus-a-l-aise-en-societe", field: "content", after: "- \"Mal. J'ai pas su quoi dire.\"" },
  { id: "C25", slug: "etre-plus-a-l-aise-en-societe", field: "content", after: "Waly Dia dégage une assurance naturelle : il occupe son espace sans s'en excuser." },
  { id: "C26", slug: "etre-plus-a-l-aise-en-societe", field: "content", after: "- **L'heure d'arrivée** : à un dîner, 15 minutes de retard passent pour de la décontraction. 45 minutes, pour de l'irrespect déguisé en nonchalance. En soirée, c'est beaucoup plus souple." },
  { id: "C27", slug: "etre-plus-a-l-aise-en-societe", field: "content", after: "Tes petites bizarreries, c'est souvent ce dont on se souviendra après ton départ, et plutôt en bien." },
  { id: "C28", slug: "jeu-de-mots-drole-techniques-creer", field: "content", after: "En conversation, garde la version qui se comprend du premier coup : l'inversion de deux éléments d'une même phrase. Techniquement, on n'inverse plus des sons mais des mots, et ça s'appelle un chiasme : le cousin sage de la contrepèterie. \"Avant, je rangeais pour recevoir. Maintenant, je reçois pour me forcer à ranger.\"" },
  { id: "C29", slug: "techniques-humoristes-pros", field: "content", after: "Ce sont les **techniques d'humoristes** à appliquer en premier, et aucune ne demande d'être né drôle." },
  { id: "C30", slug: "techniques-humoristes-pros", field: "content", after: "Waly Dia maîtrise l'art de la pause : ce silence juste avant la chute qui fait toute la différence entre une vanne qui tombe à plat et une punchline qui explose." },
  { id: "C31", slug: "techniques-humoristes-pros", field: "content", after: "Maintenant que tu connais les **techniques d'humoristes**, voici comment les tester sans risquer le malaise :" },
  { id: "C32", slug: "techniques-humoristes-pros", field: "content", after: "> **CLEF :** Ces techniques, c'est comme un instrument de musique" },
];

/** « Avant » s11 : plus aucun ne doit rester (hors C16 ligne 1, préfixe de son « après »). */
const BEFORES: { id: string; slug: string; field: Field; before: string }[] = [
  { id: "C01", slug: "avoir-confiance-en-soi-grace-a-l-humour", field: "content", before: "Les neurosciences vont dans ce sens : quand tu fais rire quelqu'un, ton cerveau active les mêmes zones que lors d'une victoire sportive. Sans le short et sans les courbatures." },
  { id: "C02", slug: "avoir-confiance-en-soi-grace-a-l-humour", field: "content", before: "Une étude de l'Université de Stanford a montré que les personnes qui utilisent l'humour dans leurs interactions sociales développent une confiance en eux 40% plus élevée que la moyenne. L'explication tient en une phrase : l'humour crée du lien tout de suite." },
  { id: "C03", slug: "blague-courte-arme-secrete-humour", field: "content", before: "Regarde Roman Frayssinet : ses meilleures punchlines durent moins de 5 secondes. Un setup de 5 mots, une chute de 4, et la salle est déjà partie." },
  { id: "C04", slug: "blague-courte-arme-secrete-humour", field: "content", before: "Une étude de l'Université de Stanford sur la mémorisation humoristique va dans le même sens : les blagues de moins de 15 mots sont retenues 3 fois plus longtemps que celles de plus de 50 mots. Nos [conseils](/conseils) partent du même principe : court, clair, facile à ressortir." },
  { id: "C05", slug: "blague-courte-arme-secrete-humour", field: "content", before: "**Un silence de 0,5 seconde avant la chute**" },
  { id: "C06", slug: "blague-courte-arme-secrete-humour", field: "content", before: "Chacune est pensée pour son contexte : sortie au mauvais endroit, une vanne courte tombe aussi vite qu'elle est partie." },
  { id: "C07", slug: "blague-courte-arme-secrete-humour", field: "content", before: "Si tu en veux d'autres, notre [abonnement](/abonnement) en propose 50 nouvelles chaque mois." },
  { id: "C08", slug: "blague-courte-arme-secrete-humour", field: "metaDescription", before: "La blague courte, arme secrète de l'humour : l'anatomie d'une vanne qui marche, 3 pièges à éviter, la méthode pour raccourcir et 15 exemples par situation." },
  { id: "C09", slug: "blague-drole-7-criteres-pepite", field: "content", before: "Bienvenue dans le club des 90% de gens qui confondent \"blague qui me fait rire\" et \"blague qui fait rire\"." },
  { id: "C10", slug: "blague-drole-7-criteres-pepite", field: "content", before: "**Exemple de Fary :**" },
  { id: "C11", slug: "blague-drole-7-criteres-pepite", field: "content", before: "→ Inattendu (on compare un enfant à du papier cadeau) mais cohérent : à force de resservir chaque année, le papier finit par avoir de l'ancienneté." },
  { id: "C12", slug: "blague-drole-7-criteres-pepite", field: "metaDescription", before: "Une blague drôle qui marche vraiment coche 7 critères, de la surprise à la règle des 3 secondes : la grille pour reconnaître une pépite avant de la raconter." },
  { id: "C13", slug: "citation-drole", field: "content", before: "Une précision honnête : quelques-unes revisitent des classiques (l'auteur est cité quand on en est sûr), toutes les autres sont des formules maison. Pas de faux Churchill ici : tu peux les ressortir comme si elles venaient de toi." },
  { id: "C14", slug: "citation-drole", field: "content", before: "39. **\"2024 m'a appris que j'étais plus résistant que prévu. Et plus créatif pour les excuses.\"**" },
  { id: "C14", slug: "citation-drole", field: "content", before: "*Pour faire le bilan d'une année difficile. Remplace 2024 par l'année que tu préfères oublier.*" },
  { id: "C15", slug: "citation-drole", field: "content", before: "Comme dit la formule : \"L'humour, c'est la seule chose sérieuse dans la vie.\" Alors prends ces citations au sérieux... mais pas trop quand même." },
  { id: "C16", slug: "comment-improviser-des-blagues", field: "content", before: "\"Mon stagiaire, explique-moi la synergie collaborative.\"" },
  { id: "C16", slug: "comment-improviser-des-blagues", field: "content", before: "\"Il m'a regardé 5 secondes et m'a proposé de faire une pause café.\"" },
  { id: "C17", slug: "comment-improviser-des-blagues", field: "content", before: "Quand un humoriste fait rire 15 000 personnes à Bercy avec une remarque sur le prix du parking, il ne l'a pas forcément écrite dans son salon." },
  { id: "C18", slug: "comment-improviser-des-blagues", field: "content", before: "Il existe des **schémas humoristiques** qui fonctionnent dans 90% des situations. Voici les 5 incontournables :" },
  { id: "C19", slug: "comment-improviser-des-blagues", field: "content", before: "il part de nos petites habitudes du quotidien, les relie à des situations que tout le monde connaît, et en tire des **punchlines** qui tapent juste." },
  { id: "C20", slug: "comment-raconter-une-blague-sans-la-rater", field: "content", before: "**Roman Frayssinet** sait exactement quand marquer un temps d'arrêt pour laisser la tension monter : chronomètre ses silences, tu en trouveras de 3 à 5 secondes avant certaines punchlines. En conversation, c'est plus discret : une micro-pause de 2-3 secondes avant la chute suffit à créer l'attente qui décuple l'effet." },
  { id: "C21", slug: "comment-raconter-une-blague-sans-la-rater", field: "content", before: "Une pause de 2-3 secondes avant la punchline transforme un sourire en éclat de rire." },
  { id: "C22", slug: "comment-raconter-une-blague-sans-la-rater", field: "content", before: "**Waly Dia** en est un bon exemple : ses punchlines font rarement plus de 10 mots." },
  { id: "C23", slug: "comment-raconter-une-blague-sans-la-rater", field: "content", before: "**2,99 EUR/mois** : beaucoup moins cher que le silence après une blague massacrée." },
  { id: "C24", slug: "etre-plus-a-l-aise-en-societe", field: "content", before: "- \"Ça me rappelle que je ne sais jamais quoi dire.\"" },
  { id: "C25", slug: "etre-plus-a-l-aise-en-societe", field: "content", before: "Waly Dia dégage une assurance naturelle, pas parce qu'il mesure 2 mètres, mais parce qu'il occupe son espace sans s'en excuser." },
  { id: "C26", slug: "etre-plus-a-l-aise-en-societe", field: "content", before: "**Les codes universels à connaître :**\n" },
  { id: "C26", slug: "etre-plus-a-l-aise-en-societe", field: "content", before: "- **Le timing des salutations** : 15 minutes de retard, c'est de la décontraction. 45 minutes, c'est de l'irrespect déguisé en nonchalance." },
  { id: "C27", slug: "etre-plus-a-l-aise-en-societe", field: "content", before: "Tes petites bizarreries, c'est ce dont on parlera après ton départ, et en bien." },
  { id: "C28", slug: "jeu-de-mots-drole-techniques-creer", field: "content", before: "En conversation, garde la version qui se comprend du premier coup : l'inversion de deux éléments d'une même phrase. \"Avant, je rangeais pour recevoir. Maintenant, je reçois pour me forcer à ranger.\"" },
  { id: "C29", slug: "techniques-humoristes-pros", field: "content", before: "Ce sont les **techniques humoristes à appliquer** en premier, et aucune ne demande d'être né drôle." },
  { id: "C30", slug: "techniques-humoristes-pros", field: "content", before: "Waly Dia maîtrise l'art de la pause : ce silence de 2-3 secondes avant la chute qui fait toute la différence entre une vanne qui tombe à plat et une punchline qui explose." },
  { id: "C31", slug: "techniques-humoristes-pros", field: "content", before: "Maintenant que tu connais les **techniques humoristes à appliquer**, voici comment les tester sans risquer le malaise :" },
  { id: "C32", slug: "techniques-humoristes-pros", field: "content", before: "> **CLEF FINALE :** Ces techniques, c'est comme un instrument de musique" },
];

describe("corrections s20 de la version s11 (blog-article-rewrites.json v4)", () => {
  it("version 4 (réapplication des 9 articles au boot), tirets base laissés en v3", () => {
    expect(file._meta.version).toBe(4);
    expect(BLOG_EM_DASH_PATCH_VERSION).toBe(3);
  });

  it("couvre exactement les 32 corrections C01 à C32", () => {
    const ids = [...new Set(AFTERS.map((a) => a.id))].sort();
    expect(ids).toEqual(Array.from({ length: 32 }, (_, i) => `C${String(i + 1).padStart(2, "0")}`));
  });

  it.each(AFTERS.map((a, i) => [`${a.id} #${i}`, a] as const))("%s : « après » présent une seule fois", (_n, a) => {
    const entry = bySlug.get(a.slug);
    expect(entry).toBeDefined();
    expect(count(entry![a.field], a.after)).toBe(1);
  });

  it.each(BEFORES.map((b, i) => [`${b.id} #${i}`, b] as const))("%s : « avant » absent", (_n, b) => {
    expect(count(bySlug.get(b.slug)![b.field], b.before)).toBe(0);
  });

  it("passage R : la liste suit directement « Voici les essentiels : »", () => {
    const content = bySlug.get("etre-plus-a-l-aise-en-societe")!.content;
    expect(content).toContain("Voici les essentiels :\n\n- **L'heure d'arrivée** :");
    expect(content).not.toContain("codes de base à connaître");
  });

  it.each(file.rewrites.map((r) => [r.slug, r] as const))(
    "%s : aucun tiret cadratin hors titres (content, metaDescription), stripEmDashes sans effet",
    (_slug, r) => {
      for (const text of [r.content, r.metaDescription]) {
        const lines = text.split("\n").filter((l) => l.includes("—") && !HEADING_RE.test(l));
        expect(lines).toEqual([]);
        expect(stripEmDashes(text)).toBe(text);
      }
    },
  );
});
