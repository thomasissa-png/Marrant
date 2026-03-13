"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useContentStats } from "@/hooks/use-content-stats";

const features = [
  {
    emoji: "😂",
    getTitle: (count: number) =>
      count > 0 ? `${count}+ vannes prêtes à ressortir` : "Vannes prêtes à ressortir",
    description:
      "École, boulot, couple, soirées — trouve la vanne parfaite pour chaque situation. Classées par catégorie, prêtes à mémoriser.",
    cta: "Voir les vannes",
    href: "/vannes",
    variant: "primary" as const,
    gradient: "from-accent-primary to-accent-secondary",
  },
  {
    emoji: "💡",
    getTitle: (count: number) =>
      count > 0 ? `${count}+ techniques de répartie` : "Techniques de répartie",
    description:
      "Timing, auto-dérision, storytelling — chaque conseil avec un exemple concret et un exercice à tester aujourd'hui.",
    cta: "Découvrir les techniques",
    href: "/conseils",
    variant: "secondary" as const,
    gradient: "from-accent-secondary to-accent-primary",
  },
  {
    emoji: "🎬",
    getTitle: (count: number) =>
      count > 0 ? `${count}+ vidéos de stand-up décryptées` : "Vidéos stand-up décryptées",
    description:
      "Les meilleurs extraits d'humoristes français, analysés technique par technique. Apprends en regardant les pros.",
    cta: "Regarder les vidéos",
    href: "/videos",
    variant: "primary" as const,
    gradient: "from-accent-primary via-accent-secondary to-accent-primary",
  },
];

export function FeatureCards() {
  const stats = useContentStats();
  const counts = [stats.jokes, stats.tips, stats.videos];

  return (
    <section className="py-12">
      <h2 className="font-display mb-8 text-center text-3xl font-bold md:text-4xl">
        Tout ce qu&apos;il te faut pour{" "}
        <span className="text-gradient">progresser</span>
      </h2>
      <div className="grid gap-6 md:grid-cols-3">
        {features.map((feature, i) => (
          <div
            key={feature.href}
            className="group relative overflow-hidden rounded-xl border border-border bg-background-card transition-colors hover:border-accent-primary/40"
          >
            <div className={`h-1 bg-gradient-to-r ${feature.gradient}`} />
            <div className="p-6">
              <span className="text-3xl" aria-hidden="true">
                {feature.emoji}
              </span>
              <h3 className="mt-3 font-display text-lg font-bold text-text-primary">
                {feature.getTitle(counts[i])}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                {feature.description}
              </p>
              <Link href={feature.href}>
                <Button variant={feature.variant} size="sm" className="mt-5">
                  {feature.cta} →
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
