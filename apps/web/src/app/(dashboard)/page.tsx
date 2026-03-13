import { Button } from "@/components/ui/button";
import { DailyContent } from "@/components/home/daily-content";
import { HeroSection } from "@/components/home/hero-section";
import { FeatureCards } from "@/components/home/feature-cards";
import { PremiumCta } from "@/components/home/premium-cta";
import { HomeCta } from "@/components/home/home-cta";
import Link from "next/link";

export default function HomePage() {
  return (
    <>
      {/* Hero section */}
      <HeroSection />

      {/* Contenu du jour (dynamique) */}
      <DailyContent />

      {/* Sections principales — blagues, conseils, vidéos */}
      <FeatureCards />

      {/* Section "Tu te reconnais ?" — les 3 personas avec lien parcours */}
      <section className="py-12">
        <h2 className="font-display mb-8 text-center text-3xl font-bold md:text-4xl">
          Tu te reconnais ?
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          {/* Sophie — parcours le plus court en premier */}
          <div className="rounded-xl border border-border bg-background-card p-6">
            <p className="text-2xl">☕</p>
            <h3 className="mt-3 text-lg font-bold text-text-primary">
              &quot;Je n&apos;ai jamais rien de drôle à dire&quot;
            </h3>
            <p className="mt-2 text-sm text-text-secondary">
              Pause café, afterwork, dîner entre amis... tu voudrais avoir la
              blague qui fait mouche au bon moment ? On te donne des blagues
              courtes et mémorisables. Maintiens ton streak pour ne rien oublier.
            </p>
            <Link href="/parcours" className="mt-4 inline-block text-sm font-medium text-accent-primary hover:underline">
              Parcours Machine à Café · 3 semaines →
            </Link>
          </div>

          {/* Yanis */}
          <div className="rounded-xl border border-border bg-background-card p-6">
            <p className="text-2xl">⚡</p>
            <h3 className="mt-3 text-lg font-bold text-text-primary">
              &quot;Je reste muet quand on me chambre&quot;
            </h3>
            <p className="mt-2 text-sm text-text-secondary">
              Tu as 16-20 ans et tu aimerais avoir de la répartie avec tes potes
              sans rester planté là ? On t&apos;apprend les bases avec des
              exercices simples et encourageants. Gagne des XP chaque jour et suis ta progression.
            </p>
            <Link href="/parcours" className="mt-4 inline-block text-sm font-medium text-accent-primary hover:underline">
              Parcours Répartie · 4 semaines →
            </Link>
          </div>

          {/* Marc */}
          <div className="rounded-xl border border-border bg-background-card p-6">
            <p className="text-2xl">🌱</p>
            <h3 className="mt-3 text-lg font-bold text-text-primary">
              &quot;J&apos;ai perdu ma légèreté&quot;
            </h3>
            <p className="mt-2 text-sm text-text-secondary">
              Après une période difficile, tu veux retrouver ton humour et ta
              confiance dans tes interactions ? Blagues, techniques de
              storytelling et auto-dérision. Suis ta progression avec les XP et les streaks.
            </p>
            <Link href="/parcours" className="mt-4 inline-block text-sm font-medium text-accent-primary hover:underline">
              Parcours Confiance · 6 semaines →
            </Link>
          </div>
        </div>
      </section>

      {/* CTA principal */}
      <HomeCta />

      {/* CTA Offres — abonnement d'abord, coaching en dessous */}
      <PremiumCta />
    </>
  );
}
