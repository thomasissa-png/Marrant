import type { Metadata } from "next";
import { DailyContent } from "@/components/home/daily-content";
import { HeroSection } from "@/components/home/hero-section";
import { ACCUEIL_HAUT } from "@/config/textes/cta-articles-accueil";
import { FeatureCards } from "@/components/home/feature-cards";
import { getContentStatsRounded } from "@/lib/content-stats-server";
import { getHomeFeatureExamples } from "@/lib/catalogue-pages";
import { parcoursWeeks } from "@/config/premium";
import dynamic from "next/dynamic";
// s21 (QA m3) : composant serveur (îlots client à l'intérieur), import direct.
import { PremiumCta } from "@/components/home/premium-cta";
const LettreAccueil = dynamic(() => import("@/components/home/lettre-accueil").then(m => ({ default: m.LettreAccueil })), { ssr: true });
const UpcomingFeatures = dynamic(() => import("@/components/home/upcoming-features").then(m => ({ default: m.UpcomingFeatures })), { ssr: true });
import { JsonLd, buildFaqJsonLd } from "@/components/seo/json-ld";
import { FAQ_VENTE } from "@/lib/faqs";
import { AutresParcours } from "@/components/home/autres-parcours";
import { DerniersArticles } from "@/components/home/derniers-articles";
import { getDerniersArticles } from "@/lib/derniers-articles";
import Link from "next/link";
import { MARGE_ENCADRE } from "@/components/layout/gabarit";

// FAQPage = UNIQUEMENT les questions visibles sur la page (règle Google :
// un balisage FAQ doit refléter du contenu affiché). La FAQ visible de la home
// est `FaqSection` (rendue via PremiumCta) → `FAQ_VENTE` (concision v5 : 4 questions).
// L'ancien `homepageFaqs` (jamais affiché) a été supprimé (décision Thomas, 13/10/2026).
const allFaqs = [...FAQ_VENTE];

export async function generateMetadata(): Promise<Metadata> {
  const stats = await getContentStatsRounded();
  const jokes = stats.jokes > 0 ? `${stats.jokes}+ vannes` : "des vannes";
  const tips = stats.tips > 0 ? `${stats.tips}+ conseils` : "des dizaines de conseils";
  const videos = stats.videos > 0 ? `${stats.videos}+ vidéos` : "des dizaines de vidéos";
  return {
    title: "Devenir drôle et avoir de la répartie",
    description: `Devenir drôle, ça s’apprend : ${jokes} à ressortir, ${tips} de répartie et ${videos} de stand-up décortiquées pour sortir la bonne réplique à temps.`,
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
// Durée effective (constatée dans prerender-manifest, s20) : 300 s, le plus court des
// unstable_cache (compteurs). `revalidate = 3600` est le plafond si ce cache change :
// un article publié (jeudi) entre dans « Derniers articles » en 1 h au plus (S3b).
export const revalidate = 3600;

export default async function HomePage() {
  const [featureExamples, derniersArticles] = await Promise.all([getHomeFeatureExamples(), getDerniersArticles()]);
  return (
    <>
      <JsonLd data={buildFaqJsonLd(allFaqs)} />

      {/* Hero section */}
      <HeroSection textes={ACCUEIL_HAUT} />

      {/* Contenu du jour (dynamique) */}
      <DailyContent />

      {/* Sections principales — blagues, conseils, vidéos */}
      <FeatureCards examples={featureExamples} />

      {/* Section "Tu te reconnais ?" — les 3 personas avec lien parcours ; marge des cartes = « Trois outils » (T3-03) */}
      <section className="py-12 md:py-16">
        <h2 className="font-display mb-8 text-center text-3xl font-bold md:text-4xl">
          Tu te reconnais ?
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          {/* Sophie — parcours le plus court en premier */}
          <div className={`flex flex-col rounded-xl border border-border bg-background-card ${MARGE_ENCADRE}`}>
            <p className="text-3xl" aria-hidden="true">☕️</p>
            <h3 className="mt-3 font-display text-lg font-bold text-text-primary">
              «&nbsp;Je n’ai jamais rien de drôle à dire&nbsp;»
            </h3>
            <p className="mt-2 flex-1 text-sm text-text-secondary">
              Pause café, afterwork, dîner entre amis : la bonne vanne te vient
              toujours, mais dans le métro du retour. On te donne des vannes
              courtes à ressortir sur le moment, et une série de jours de pratique pour garder le rythme.
            </p>
            <Link href="/parcours/machine-a-cafe" className="mt-4 inline-flex min-h-[44px] items-center text-sm font-medium text-accent-link hover:underline">
              Parcours Machine à Café · {parcoursWeeks("machine-a-cafe")}&nbsp;semaines →
            </Link>
          </div>

          {/* Yanis */}
          <div className={`flex flex-col rounded-xl border border-border bg-background-card ${MARGE_ENCADRE}`}>
            <p className="text-3xl" aria-hidden="true">⚡️</p>
            <h3 className="mt-3 font-display text-lg font-bold text-text-primary">
              «&nbsp;Je reste muet quand on me chambre&nbsp;»
            </h3>
            <p className="mt-2 flex-1 text-sm text-text-secondary">
              Tes potes se chambrent, tu cherches quoi répondre, et quand tu
              trouves, la conversation est passée à autre chose. On t’apprend
              les réflexes de base avec des exercices simples, et tes XP te
              montrent que tu avances.
            </p>
            <Link href="/parcours/repartie" className="mt-4 inline-flex min-h-[44px] items-center text-sm font-medium text-accent-link hover:underline">
              Parcours Répartie · {parcoursWeeks("repartie")}&nbsp;semaines →
            </Link>
          </div>

          {/* Marc */}
          <div className={`flex flex-col rounded-xl border border-border bg-background-card ${MARGE_ENCADRE}`}>
            <p className="text-3xl" aria-hidden="true">🌱</p>
            <h3 className="mt-3 font-display text-lg font-bold text-text-primary">
              «&nbsp;J’ai perdu ma légèreté&nbsp;»
            </h3>
            <p className="mt-2 flex-1 text-sm text-text-secondary">
              Après une période compliquée, ton humour n’est pas parti, il
              est juste rouillé. Blagues, storytelling et autodérision pour le
              remettre en route à ton rythme, avec tes XP et ta série pour
              mesurer le chemin parcouru.
            </p>
            <Link href="/parcours/confiance" className="mt-4 inline-flex min-h-[44px] items-center text-sm font-medium text-accent-link hover:underline">
              Parcours Confiance · {parcoursWeeks("confiance")}&nbsp;semaines →
            </Link>
          </div>
        </div>

        {/* Maillage S3a : parcours publiés hors cartes (docs/seo/maillage-decouverte-s20.md §4) */}
        <AutresParcours />

        {/* Lien vers le pilier SEO (docs/seo/pilier-non-indexe-s15.md, L2) */}
        <p className="mt-8 text-center text-sm text-text-secondary">
          Tu veux d’abord comprendre le mécanisme&nbsp;? Lis notre guide{" "}
          <Link href="/blog/comment-devenir-drole" className="-my-3 inline-block py-3 font-medium text-accent-link underline underline-offset-2">
            comment devenir drôle
          </Link>
          .
        </p>
      </section>

      {/* Maillage S3b : 3 derniers articles visibles, hors pilier */}
      <DerniersArticles articles={derniersArticles} />

      {/* CTA Offre : abonnement Premium (coaching retiré le 13/10/2026). s21 (B4 + B5) : le bloc
          « Tu crois avoir tout essayé » (ancien home-cta.tsx) est fusionné dans cette carte et supprimé.
          Annuel lu au rendu (ISR) : [S12] ne le cite que s'il est configuré. */}
      <PremiumCta />

      {/* s21 : la lettre gratuite, lien discret après l'offre (interrupteur des inscriptions) */}
      <LettreAccueil />

      {/* Prochainement — fonctionnalités à venir avec votes */}
      <UpcomingFeatures />
    </>
  );
}
