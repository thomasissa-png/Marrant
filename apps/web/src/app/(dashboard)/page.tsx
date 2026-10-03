import type { Metadata } from "next";
import { DailyContent } from "@/components/home/daily-content";
import { HeroSection } from "@/components/home/hero-section";
import { FeatureCards } from "@/components/home/feature-cards";
import { getContentStatsRounded } from "@/lib/content-stats-server";
import { getHomeFeatureExamples } from "@/lib/catalogue-pages";
import dynamic from "next/dynamic";
const PremiumCta = dynamic(() => import("@/components/home/premium-cta").then(m => ({ default: m.PremiumCta })), { ssr: true });
const HomeCta = dynamic(() => import("@/components/home/home-cta").then(m => ({ default: m.HomeCta })), { ssr: true });
const UpcomingFeatures = dynamic(() => import("@/components/home/upcoming-features").then(m => ({ default: m.UpcomingFeatures })), { ssr: true });
import { JsonLd, buildFaqJsonLd } from "@/components/seo/json-ld";
import { faqs as faqSectionFaqs } from "@/lib/faqs";
import Link from "next/link";

const homepageFaqs = [
  {
    question: "Comment devenir drôle quand on n'est pas drôle ?",
    answer:
      "L'humour n'est pas un talent inné, c'est une compétence qui se travaille. Avec des exercices progressifs (vannes à ressortir, techniques de répartie, analyse de stand-up), tu peux devenir plus drôle en quelques semaines. Nos parcours structurés te guident pas à pas.",
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
      "L'accès complet coûte 2,99 €/mois. Tu accèdes à toutes les vannes, tous les conseils, toutes les vidéos analysées, les parcours structurés et le contenu du jour. Annulation en 1 clic, sans engagement.",
  },
];

// FAQPage = UNIQUEMENT les questions visibles sur la page (règle Google :
// un balisage FAQ doit refléter du contenu affiché). La FAQ visible de la home
// est `FaqSection` (rendue via PremiumCta) → `faqSectionFaqs`.
// `homepageFaqs` n'est affiché nulle part : exclu du JSON-LD (passe SEO s11).
// Conservé tel quel (chiffres compris) en attendant l'arbitrage de Thomas :
// l'afficher dans une section visible (puis le réintégrer ici) ou le supprimer.
// Voir docs/seo/passe-finale-s11.md §3.
const allFaqs = [...faqSectionFaqs];
void homepageFaqs;

export async function generateMetadata(): Promise<Metadata> {
  const stats = await getContentStatsRounded();
  const jokes = stats.jokes > 0 ? `${stats.jokes}+ vannes` : "des vannes";
  const tips = stats.tips > 0 ? `${stats.tips}+ conseils` : "des dizaines de conseils";
  const videos = stats.videos > 0 ? `${stats.videos}+ vidéos` : "des dizaines de vidéos";
  return {
    title: "Devenir drôle et avoir de la répartie",
    description: `Devenir drôle, ça s'apprend : ${jokes} à ressortir, ${tips} de répartie et ${videos} de stand-up décortiquées pour sortir la bonne réplique à temps.`,
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
}

// Stratégie de rendu : statique + ISR (revalidation portée par les unstable_cache :
// compteurs 5 min, listes 1 h). Les liens vers les fiches (FeatureCards) sont dans le
// HTML ; sans base au build, les cartes s'affichent sans liens jusqu'à la revalidation.
export default async function HomePage() {
  const featureExamples = await getHomeFeatureExamples();
  return (
    <>
      <JsonLd data={buildFaqJsonLd(allFaqs)} />

      {/* Hero section */}
      <HeroSection />

      {/* Contenu du jour (dynamique) */}
      <DailyContent />

      {/* Sections principales — blagues, conseils, vidéos */}
      <FeatureCards examples={featureExamples} />

      {/* Section "Tu te reconnais ?" — les 3 personas avec lien parcours */}
      <section className="py-12 md:py-16">
        <h2 className="font-display mb-8 text-center text-3xl font-bold md:text-4xl">
          Tu te reconnais ?
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          {/* Sophie — parcours le plus court en premier */}
          <div className="flex flex-col rounded-xl border border-border bg-background-card p-6">
            <p className="text-2xl">☕️</p>
            <h3 className="mt-3 font-display text-lg font-bold text-text-primary">
              «&nbsp;Je n&apos;ai jamais rien de drôle à dire&nbsp;»
            </h3>
            <p className="mt-2 flex-1 text-sm text-text-secondary">
              Pause café, afterwork, dîner entre amis : la bonne vanne te vient
              toujours, mais dans le métro du retour. On te donne des vannes
              courtes à ressortir sur le moment, et un streak pour garder le rythme.
            </p>
            <Link href="/parcours/machine-a-cafe" className="mt-4 inline-flex min-h-[44px] items-center text-sm font-medium text-accent-link hover:underline">
              Parcours Machine à Café · 3 semaines →
            </Link>
          </div>

          {/* Yanis */}
          <div className="flex flex-col rounded-xl border border-border bg-background-card p-6">
            <p className="text-2xl">⚡️</p>
            <h3 className="mt-3 font-display text-lg font-bold text-text-primary">
              «&nbsp;Je reste muet quand on me chambre&nbsp;»
            </h3>
            <p className="mt-2 flex-1 text-sm text-text-secondary">
              Tes potes se chambrent, tu cherches quoi répondre, et quand tu
              trouves, la conversation est passée à autre chose. On t&apos;apprend
              les réflexes de base avec des exercices simples, et tes XP te
              montrent que tu avances.
            </p>
            <Link href="/parcours/repartie" className="mt-4 inline-flex min-h-[44px] items-center text-sm font-medium text-accent-link hover:underline">
              Parcours Répartie · 4 semaines →
            </Link>
          </div>

          {/* Marc */}
          <div className="flex flex-col rounded-xl border border-border bg-background-card p-6">
            <p className="text-2xl">🌱</p>
            <h3 className="mt-3 font-display text-lg font-bold text-text-primary">
              «&nbsp;J&apos;ai perdu ma légèreté&nbsp;»
            </h3>
            <p className="mt-2 flex-1 text-sm text-text-secondary">
              Après une période compliquée, ton humour n&apos;est pas parti, il
              est juste rouillé. Blagues, storytelling et auto-dérision pour le
              remettre en route à ton rythme, avec tes XP et ton streak pour
              mesurer le chemin parcouru.
            </p>
            <Link href="/parcours/confiance" className="mt-4 inline-flex min-h-[44px] items-center text-sm font-medium text-accent-link hover:underline">
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
