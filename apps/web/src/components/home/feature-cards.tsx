"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { contenuAffiche } from "@/lib/tip-prose";
import { useContentStats } from "@/hooks/use-content-stats";
import { MARGE_ENCADRE } from "@/components/layout/gabarit";

const features = [
  {
    emoji: "😂",
    getTitle: (count: number) =>
      count > 0 ? `${count}+ vannes prêtes à ressortir` : "Vannes prêtes à ressortir",
    description:
      "École, boulot, couple, soirées : les vannes sont rangées par situation, pour que tu trouves la bonne avant que le moment soit passé.",
    cta: "Voir les vannes",
    href: "/vannes",
    variant: "outline" as const,
    gradient: "from-accent-primary to-accent-secondary",
  },
  {
    emoji: "💡",
    getTitle: (count: number) =>
      count > 0 ? `${count}+ techniques de répartie` : "Techniques de répartie",
    description:
      "Timing, autodérision, storytelling : chaque technique arrive avec un exemple concret et un exercice à tester dès ce midi, à table.",
    cta: "Découvrir les techniques",
    href: "/conseils",
    variant: "outline" as const,
    gradient: "from-accent-secondary to-accent-primary",
  },
  {
    emoji: "🎬",
    getTitle: (count: number): ReactNode =>
      count > 0 ? (
        <>
          {count}+ vidéos de <span className="whitespace-nowrap">stand-⁠up</span> décryptées
        </>
      ) : (
        <>
          Vidéos <span className="whitespace-nowrap">stand-⁠up</span> décryptées
        </>
      ),
    description:
      "Les meilleurs extraits d’humoristes francophones, démontés technique par technique pour que tu repartes avec leur mécanique, pas seulement avec le fou rire.",
    cta: "Regarder les vidéos",
    href: "/videos",
    variant: "outline" as const,
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
            className="relative flex flex-col overflow-hidden rounded-xl border border-border bg-background-card"
          >
            <div className={`h-1 bg-gradient-to-r ${feature.gradient}`} />
            {/* Revue visuelle s21, tour 4 (T3-03) : même marge que les encadrés (16 px sous 400 px), les liens
                d'exemple gagnent 8 px de ligne à 375 px. */}
            <div className={`flex flex-1 flex-col ${MARGE_ENCADRE}`}>
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
                <ul className="mt-3">
                  {/* Revue visuelle s21 : liens d'exemple de 44 px de haut (cible tactile), sans interligne ajouté. */}
                  {examples[i].map((example) => (
                    <li key={example.href}>
                      {/* T2-05 : toute la largeur de la carte, fins de ligne équilibrées ; contenu de la base au rendu typographique (R27). */}
                      {/* Coupe à 2 lignes sur un span intérieur : sur le lien lui-même, la 3e ligne déborderait dans son padding. */}
                      <Link href={example.href} className="block w-full py-3 text-sm text-accent-link [text-wrap:pretty] hover:underline">
                        <span className="line-clamp-2">{contenuAffiche(example.label)}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : null}
              {/* Revue visuelle s21, tour 3 : de 768 à 1 023 px (3 cartes étroites), boutons pleine largeur et de même
                  hauteur (2 lignes), bas alignés d'une carte à l'autre ; la flèche reste liée au dernier mot. */}
              <div className="mt-auto self-start pt-5 md:max-lg:self-stretch">
                <Link
                  href={feature.href}
                  className={cn(
                    buttonVariants({ variant: feature.variant, size: "sm" }),
                    "h-auto min-h-8 whitespace-normal py-1.5 text-left leading-snug max-md:h-auto max-md:min-h-11 md:max-lg:flex md:max-lg:min-h-14 md:max-lg:w-full md:max-lg:justify-start",
                  )}
                >
                  {feature.cta}&nbsp;→
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
