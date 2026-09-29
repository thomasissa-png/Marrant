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
    headline: "Ces techniques, entraîne-les dans un parcours guidé",
    bullets: [
      "Un exercice concret par jour, 10 min max",
      "Des situations que tu connais : le chambrage entre potes, la pique en TD, le raté à rattraper",
      "Des XP à chaque étape validée, pour mesurer le chemin parcouru",
    ],
    cta: "Découvrir le parcours Répartie",
  },
  "apprendre-humour": {
    slug: "repartie",
    title: "Parcours Répartie",
    duration: "4 semaines",
    headline: "Passe de la théorie à la pratique",
    bullets: [
      "4 semaines sur les fondamentaux de la répartie : rebondir, tenir un silence, retourner une pique",
      "Des exercices à tester le soir même, en soirée ou en coloc",
      "À chaque étape, un conseil, des vannes, une vidéo et un petit quiz",
    ],
    cta: "Commencer le parcours Répartie",
  },
  "apprendre-des-pros": {
    slug: "repartie",
    title: "Parcours Répartie",
    duration: "4 semaines",
    headline: "Pique les techniques que tu viens de lire, proprement",
    bullets: [
      "Chaque étape s'appuie sur une vidéo de stand-up, décortiquée",
      "De vrais humoristes, avec ce qu'il faut regarder de près chez eux",
      "Le but : trouver ton style, pas faire une copie carbone du leur",
    ],
    cta: "Ouvrir le parcours Répartie",
  },
  "techniques-delivery": {
    slug: "repartie",
    title: "Parcours Répartie",
    duration: "4 semaines",
    headline: "Le timing, ça s'entraîne plus que ça ne se lit",
    bullets: [
      "Une étape entière sur le rythme et les silences",
      "Des vannes avec le timing intégré, à dire à voix haute",
      "4 semaines pour que ta chute arrive au bon moment, et pas juste après",
    ],
    cta: "Travailler ton timing",
  },
  "types-humour": {
    slug: "repartie",
    title: "Parcours Répartie",
    duration: "4 semaines",
    headline: "Trouve ton registre et entraîne-le",
    bullets: [
      "Du chambrage bienveillant à l'impro : tu vois vite dans quel registre tu es à l'aise",
      "Une étape par semaine, chacune un cran au-dessus de la précédente",
      "Résultats visibles sous 2-3 semaines",
    ],
    cta: "Lancer le parcours",
  },
  "douleurs-personas": {
    slug: "confiance",
    title: "Parcours Confiance",
    duration: "6 semaines",
    headline: "Reprends confiance, une conversation à la fois",
    bullets: [
      "6 semaines à ton rythme, sans personne pour te pousser sur scène",
      "Des étapes pensées pour les moments où c'est dur : reprendre après une pause, trouver ta place dans un groupe qui rit",
      "Le rire revient d'abord pour toi, puis il se partage",
    ],
    cta: "Commencer le parcours Confiance",
  },
  "humour-contexte": {
    slug: "machine-a-cafe",
    title: "Parcours Machine à Café",
    duration: "3 semaines",
    headline: "Sois drôle au bureau sans avoir l'air d'essayer",
    bullets: [
      "15 min/semaine, tenable même en pleine deadline",
      "Des vannes courtes, le bon moment pour les placer et des anecdotes qu'on écoute jusqu'au bout",
      "Zéro blague de manager, promis",
    ],
    cta: "Rejoindre le parcours Machine à Café",
  },
  "fort-volume": {
    slug: "machine-a-cafe",
    title: "Parcours Machine à Café",
    duration: "3 semaines",
    headline: "Des blagues toutes faites à ta propre voix",
    bullets: [
      "Choisis la vanne qui colle au moment, pas celle que tu as apprise par cœur",
      "Place ta chute sans prévenir tout le monde que « t'en as une bonne »",
      "3 semaines, 15 min/semaine, l'équivalent d'une pause café un peu longue",
    ],
    cta: "Ouvrir le parcours",
  },
  saisonnier: {
    slug: "machine-a-cafe",
    title: "Parcours Machine à Café",
    duration: "3 semaines",
    headline: "Garde ces réflexes bien après la saison",
    bullets: [
      "3 semaines pour te faire une base qui sert en toute saison",
      "Des réflexes qui marchent au repas de Noël comme à la rentrée ou au bureau",
      "Des XP à chaque étape, pour que ça tienne plus longtemps que les décorations de Noël",
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
