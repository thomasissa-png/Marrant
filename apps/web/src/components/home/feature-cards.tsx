"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { useContentStats } from "@/hooks/use-content-stats";

const features = [
  {
    emoji: "😂",
    getTitle: (count: number) =>
      count > 0 ? `${count}+ vannes prêtes à ressortir` : "Vannes prêtes à ressortir",
    description:
      "École, boulot, couple, soirées : les vannes sont rangées par situation, pour que tu trouves la bonne avant que le moment soit passé.",
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
      "Timing, auto-dérision, storytelling : chaque technique arrive avec un exemple concret et un exercice à tester dès ce midi, à table.",
    cta: "Découvrir les techniques",
    href: "/conseils",
    variant: "primary" as const,
    gradient: "from-accent-secondary to-accent-primary",
  },
  {
    emoji: "🎬",
    getTitle: (count: number): ReactNode =>
      count > 0 ? (
        <>
          {count}+ vidéos de <span className="whitespace-nowrap">stand-up</span> décryptées
        </>
      ) : (
        <>
          Vidéos <span className="whitespace-nowrap">stand-up</span> décryptées
        </>
      ),
    description:
      "Les meilleurs extraits d'humoristes français, démontés technique par technique pour que tu repartes avec leur mécanique, pas seulement avec le fou rire.",
    cta: "Regarder les vidéos",
    href: "/videos",
    variant: "primary" as const,
    gradient: "from-accent-primary via-accent-secondary to-accent-primary",
  },
];

/** Lien vers une fiche réelle (libellé = titre ou début du contenu, sans texte ajouté). */
export interface FeatureExample {
  href: string;
  label: string;
}

interface FeatureCardsProps {
  /**
   * Quelques fiches par carte (vannes, conseils, vidéos), dans l'ordre des cartes.
   * Rendues dans le HTML de l'accueil pour le maillage interne (lot S1 s14, P0-1).
   */
  examples?: FeatureExample[][];
}

export function FeatureCards({ examples }: FeatureCardsProps = {}) {
  const stats = useContentStats();
  const counts = [stats.jokes, stats.tips, stats.videos];

  return (
    <section className="py-12 md:py-16">
      <h2 className="font-display mb-8 text-center text-3xl font-bold md:text-4xl">
        Trois outils pour arrêter de rire{" "}
        <span className="text-gradient">par politesse</span>
      </h2>
      <div className="grid gap-6 md:grid-cols-3">
        {features.map((feature, i) => (
          <div
            key={feature.href}
            className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-background-card transition-colors hover:border-accent-primary/40"
          >
            <div className={`h-1 bg-gradient-to-r ${feature.gradient}`} />
            <div className="flex flex-1 flex-col p-6">
              <span className="text-3xl" aria-hidden="true">
                {feature.emoji}
              </span>
              <h3 className="mt-3 font-display text-lg font-bold text-text-primary">
                {feature.getTitle(counts[i])}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                {feature.description}
              </p>
              {examples?.[i]?.length ? (
                <ul className="mt-4 space-y-1">
                  {examples[i].map((example) => (
                    <li key={example.href}>
                      <Link href={example.href} className="line-clamp-2 py-1 text-sm text-accent-link hover:underline">
                        {example.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : null}
              <Link href={feature.href} className="mt-auto self-start pt-5">
                <Button
                  variant={feature.variant}
                  size="sm"
                  className="h-auto min-h-8 whitespace-normal py-1.5 text-left leading-snug max-md:h-auto max-md:min-h-11"
                >
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
