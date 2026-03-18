import type { Metadata } from "next";
import { DailyContent } from "@/components/home/daily-content";
import { HeroSection } from "@/components/home/hero-section";
import { FeatureCards } from "@/components/home/feature-cards";
import dynamic from "next/dynamic";
const PremiumCta = dynamic(() => import("@/components/home/premium-cta").then(m => ({ default: m.PremiumCta })), { ssr: true });
const HomeCta = dynamic(() => import("@/components/home/home-cta").then(m => ({ default: m.HomeCta })), { ssr: true });
const UpcomingFeatures = dynamic(() => import("@/components/home/upcoming-features").then(m => ({ default: m.UpcomingFeatures })), { ssr: true });
import { JsonLd, buildFaqJsonLd } from "@/components/seo/json-ld";
import Link from "next/link";

const homepageFaqs = [
  {
    question: "Comment devenir drôle quand on n'est pas drôle ?",
    answer:
      "L'humour n'est pas un talent inné, c'est une compétence qui se travaille. Avec des exercices progressifs (vannes à mémoriser, techniques de répartie, analyse de stand-up), tu peux devenir plus drôle en quelques semaines. Nos parcours structurés te guident pas à pas.",
  },
  {
    question: "Comment avoir de la répartie rapidement ?",
    answer:
      "La répartie repose sur des techniques précises : accuser réception, rebondir sur un mot-clé, retourner la situation. En pratiquant 5-10 minutes par jour avec nos exercices, tu peux voir une vraie différence en 2 à 4 semaines.",
  },
  {
    question: "Est-ce que je peux apprendre à être drôle en ligne ?",
    answer:
      "Oui, deviens-marrant.fr est une plateforme en ligne avec des vannes classées par catégorie, des conseils d'humour avec exercices concrets, des vidéos de stand-up analysées et des parcours structurés. Tu progresses à ton rythme depuis chez toi.",
  },
  {
    question: "Combien coûte deviens-marrant.fr ?",
    answer:
      "L'accès complet coûte 0,99 €/mois (prix de lancement). Tu accèdes à toutes les vannes, tous les conseils, toutes les vidéos analysées, les parcours structurés et le contenu du jour. Annulation en 1 clic, sans engagement.",
  },
];

export const metadata: Metadata = {
  title: "Deviens drôle et améliore ta répartie | deviens-marrant.fr",
  description: "Blagues, conseils d'humour, vidéos de stand-up analysées et parcours structurés pour devenir plus drôle au quotidien. Rejoins la communauté de l'humour.",
  keywords: [
    "comment devenir drôle",
    "devenir drôle",
    "avoir de la répartie",
    "apprendre à être drôle",
    "devenir marrant",
    "comment faire rire",
    "développer son humour",
  ],
  alternates: {
    canonical: "https://deviens-marrant.fr",
  },
};

export default function HomePage() {
  return (
    <>
      <JsonLd data={buildFaqJsonLd(homepageFaqs)} />

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
              Tu aimerais avoir de la répartie avec tes potes sans rester
              planté là ? On t&apos;apprend les bases avec des exercices simples
              et encourageants. Gagne des XP chaque jour et suis ta progression.
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

      {/* Prochainement — fonctionnalités à venir avec votes */}
      <UpcomingFeatures />
    </>
  );
}
