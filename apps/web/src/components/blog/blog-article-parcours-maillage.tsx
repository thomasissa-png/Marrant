import Link from "next/link";
import { resolveCluster } from "@/lib/blog-clusters";

/**
 * Maillage contextuel article → parcours individuel.
 *
 * Placé JUSTE AVANT le CTA final de la page article. Un autre lot refond
 * le CTA de fin — ne pas y toucher (composant séparé).
 *
 * Le parcours suggéré dépend du cluster de l'article :
 * - techniques-repartie, apprendre-humour, apprendre-des-pros, techniques-delivery,
 *   types-humour → /parcours/repartie
 * - douleurs-personas → /parcours/confiance
 * - humour-contexte, fort-volume, saisonnier → /parcours/machine-a-cafe
 *
 * Fallback : si le cluster est inconnu (article DB orphelin), on tombe sur
 * /parcours/repartie (le plus large).
 */

interface ParcoursHint {
  slug: "repartie" | "machine-a-cafe" | "confiance";
  title: string;
  duration: string;
  headline: string;
  bullets: string[];
  cta: string;
}

const PARCOURS_BY_CLUSTER: Record<string, ParcoursHint> = {
  "techniques-repartie": {
    slug: "repartie",
    title: "Parcours Répartie",
    duration: "4 semaines",
    headline: "Applique ces techniques dans un parcours guidé",
    bullets: [
      "Un exercice concret par jour, 10 min max",
      "Situations réelles (chambrage, moquerie, silence gênant)",
      "Progression mesurable — XP, streak, checkpoints",
    ],
    cta: "Découvrir le parcours Répartie",
  },
  "apprendre-humour": {
    slug: "repartie",
    title: "Parcours Répartie",
    duration: "4 semaines",
    headline: "Passe de la théorie à la pratique",
    bullets: [
      "4 semaines de fondamentaux : setup, punchline, timing",
      "Exercices testés le soir même en soirée",
      "Retour du terrain intégré à chaque étape",
    ],
    cta: "Commencer le parcours Répartie",
  },
  "apprendre-des-pros": {
    slug: "repartie",
    title: "Parcours Répartie",
    duration: "4 semaines",
    headline: "Vole les techniques que tu viens de lire — proprement",
    bullets: [
      "Chaque étape s'appuie sur une technique stand-up analysée",
      "Vidéos courtes + exercice associé",
      "Ton style émerge, pas une copie carbone",
    ],
    cta: "Ouvrir le parcours Répartie",
  },
  "techniques-delivery": {
    slug: "repartie",
    title: "Parcours Répartie",
    duration: "4 semaines",
    headline: "Le timing s'entraîne — pas seulement se lit",
    bullets: [
      "Exercices d'articulation, silence, débit",
      "Enregistrements courts pour te réécouter",
      "4 semaines pour rendre ta chute audible",
    ],
    cta: "Travailler ton timing",
  },
  "types-humour": {
    slug: "repartie",
    title: "Parcours Répartie",
    duration: "4 semaines",
    headline: "Trouve ton registre et entraîne-le",
    bullets: [
      "Le parcours s'adapte à ton style (autodérision, absurde, observation)",
      "Un défi par jour dans ta zone de confort — puis un cran au-dessus",
      "Résultats visibles sous 2-3 semaines",
    ],
    cta: "Lancer le parcours",
  },
  "douleurs-personas": {
    slug: "confiance",
    title: "Parcours Confiance",
    duration: "6 semaines",
    headline: "Reprends confiance dans tes interactions",
    bullets: [
      "6 semaines douces, sans pression, sans jugement",
      "Micro-exercices adaptés aux moments difficiles (après rupture, rester muet en groupe)",
      "Le rire revient d'abord pour toi — puis pour les autres",
    ],
    cta: "Commencer le parcours Confiance",
  },
  "humour-contexte": {
    slug: "machine-a-cafe",
    title: "Parcours Machine à Café",
    duration: "3 semaines",
    headline: "Sois drôle au bureau — sans jamais forcer",
    bullets: [
      "15 min/semaine — tenable même en pleine deadline",
      "Vannes pro, anecdotes courtes, timing pause-café",
      "Zéro blague de manager, promis",
    ],
    cta: "Rejoindre le parcours Machine à Café",
  },
  "fort-volume": {
    slug: "machine-a-cafe",
    title: "Parcours Machine à Café",
    duration: "3 semaines",
    headline: "Passe des blagues catalogue à ta propre voix",
    bullets: [
      "Apprends à choisir la vanne qui fitte le moment",
      "Exercices pour placer une punchline sans t'annoncer",
      "3 semaines, 15 min/semaine — sans excuse",
    ],
    cta: "Ouvrir le parcours",
  },
  saisonnier: {
    slug: "machine-a-cafe",
    title: "Parcours Machine à Café",
    duration: "3 semaines",
    headline: "Un parcours pour ancrer ces réflexes toute l'année",
    bullets: [
      "3 semaines pour bâtir une base solide, saison indifférente",
      "Exercices reproductibles à Noël, à la rentrée, au bureau",
      "Progression mesurable — pas de coup unique",
    ],
    cta: "Découvrir le parcours",
  },
};

const DEFAULT_HINT = PARCOURS_BY_CLUSTER["techniques-repartie"];

export function BlogArticleParcoursMaillage({
  articleSlug,
  articleCategory,
}: {
  articleSlug: string;
  articleCategory?: string;
}) {
  const cluster = resolveCluster(articleSlug, articleCategory);
  const hint = (cluster && PARCOURS_BY_CLUSTER[cluster.id]) || DEFAULT_HINT;

  return (
    <aside
      aria-label="Parcours recommandé"
      className="mt-12 rounded-lg border border-border bg-background-elevated p-6"
    >
      <p className="text-xs font-medium uppercase tracking-wider text-text-muted">
        Parcours recommandé · {hint.duration}
      </p>
      <h2 className="mt-2 font-display text-xl font-bold text-text-primary">
        {hint.headline}
      </h2>
      <p className="mt-1 text-sm text-text-secondary">{hint.title}</p>
      <ul className="mt-4 space-y-2 text-sm text-text-secondary">
        {hint.bullets.map((b) => (
          <li key={b} className="flex gap-2">
            <span aria-hidden className="text-accent-primary">
              →
            </span>
            <span>{b}</span>
          </li>
        ))}
      </ul>
      <div className="mt-5">
        <Link
          href={`/parcours/${hint.slug}`}
          className="inline-flex items-center gap-2 rounded-md border border-accent-primary/40 bg-accent-primary/10 px-4 py-2 text-sm font-semibold text-accent-primary transition-colors hover:bg-accent-primary/20"
        >
          {hint.cta}
        </Link>
      </div>
    </aside>
  );
}
