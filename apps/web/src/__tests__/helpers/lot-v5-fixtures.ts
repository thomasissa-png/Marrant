/**
 * Fixtures du lot v5 (catalogue simulé, articles) partagées par les tests de
 * scripts/content/social-lot-v5*.ts. Helper de test (ignoré comme suite).
 */
import { FIXES } from "../../../scripts/content/social-lot-v5-fixes";
import type { ArticleLot } from "../../../scripts/content/social-lot-v5";
import type { CatalogueJoke } from "../../../scripts/content/social-month-plan";

export function catalogue(): CatalogueJoke[] {
  const ids = new Set<string>();
  for (const f of FIXES) if (f.vanne?.jokeId) ids.add(f.vanne.jokeId);
  ids.add("cs14jk69eb578cce484b6f87");
  const fixes = [...ids].map((id, i) => ({ id, setup: `J'ai une vanne fixe ${i}.`, punchline: `Elle tombe juste ${i}.`, isActive: true, verdict: "GARDER", category: "BOULOT" }));
  const tirage = Array.from({ length: 180 }, (_, i) => ({
    id: `t${String(i).padStart(3, "0")}`, setup: `J'ai raconté l'histoire numéro ${i} au travail.`, punchline: `Mon voisin a compris la ${i}.`,
    isActive: true, verdict: "GARDER", category: i % 4 === 0 ? "BOULOT" : "SITUATION",
  }));
  return [...fixes, ...tirage];
}
const halloween = Array.from({ length: 8 }, (_, i) => `### ${i + 1}. T\n> « J'ai porté le costume ${i + 1}. »\n>\n> « On m'a pris pour un meuble ${i + 1}. »\n**Pourquoi ça marche :** le costume parle à ta place.\n**À toi de jouer :** choisis un objet de ta maison.`).join("\n");
const anniversaire = Array.from({ length: 21 }, (_, i) => `**${i + 1}.** Joyeux anniversaire. J'ai écrit le message ${i + 1} trop tard. Tu l'as lu avant moi.`).join("\n");
export const ARTICLES: ArticleLot[] = [
  { slug: "blagues-halloween-soiree-deguisee", title: "Blagues d'Halloween : 8 vannes pour ta soirée déguisée", category: "CATALOGUE", date: "2026-10-05", content: halloween },
  { slug: "se-presenter-avec-humour", title: "Se présenter avec humour : 5 accroches qui passent", category: "PRATIQUE", date: "2026-10-12",
    content: "Le tour de table commence à gauche et tu comptes les places : tu es sixième. Tu avais une phrase géniale. Le quatrième vient de la dire. Au final, tu dis ton prénom." },
  { slug: "message-anniversaire-drole-par-situation", title: "Message d'anniversaire drôle : 21 textes par situation", category: "CATALOGUE", date: "2026-10-22", content: anniversaire },
  { slug: "blagues-sur-l-ia-assistants-vocaux", title: "Blagues sur l'IA : 6 vannes sur nos assistants vocaux", category: "CATALOGUE", date: "2026-10-26", content: "" },
  { slug: "humour-en-visio-reunion-en-ligne", title: "Humour en visio : faire rire à travers un écran", category: "CONTEXTE", date: "2026-11-02", content: "> « J'ai coupé ma caméra. »\n>\n> « Personne n'a vu la différence. »" },
  { slug: "toast-drole-discours-qui-fait-rire", title: "Toast drôle : la structure d'un discours qui fait rire", category: "GUIDE", date: "2026-11-30",
    content: "> J'ai tapé sur mon verre pour demander le silence. Quelqu'un a demandé « c'est pour un mariage ? ». J'ai dit non. Il y a eu de la déception.\n\n> J'ai préparé mon toast sur une fiche, avec mes meilleures phrases soulignées. Dans le trac, j'ai tout lu, sauf les phrases soulignées." },
  { slug: "voeux-drole-nouvelle-annee", title: "Vœux drôles nouvelle année : messages prêts à envoyer", category: "CATALOGUE", date: "2026-11-12",
    content: Array.from({ length: 12 }, (_, i) => `**${i + 1}.** Bonne année. J'ai tenu ma résolution ${i + 1} une heure.`).join("\n") },
];
