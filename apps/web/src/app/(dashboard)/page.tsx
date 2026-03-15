import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { DailyContent } from "@/components/home/daily-content";
import { HeroSection } from "@/components/home/hero-section";
import { FeatureCards } from "@/components/home/feature-cards";
import dynamic from "next/dynamic";
const PremiumCta = dynamic(() => import("@/components/home/premium-cta").then(m => ({ default: m.PremiumCta })), { ssr: true });
const HomeCta = dynamic(() => import("@/components/home/home-cta").then(m => ({ default: m.HomeCta })), { ssr: true });
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
  description: "Blagues, conseils d'humour, vidéos de stand-up analysées et parcours structurés pour devenir plus drôle au quotidien. Rejoins la communauté francophone de l'humour.",
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

      {/* Prochainement — fonctionnalités à venir pour les abonnés */}
      <section className="py-16">
        <div className="mb-4 flex items-center justify-center gap-3">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent to-accent-primary/30" />
          <Badge variant="premium">Abonnés</Badge>
          <div className="h-px flex-1 bg-gradient-to-l from-transparent to-accent-primary/30" />
        </div>
        <h2 className="font-display mb-3 text-center text-3xl font-bold md:text-4xl">
          Prochainement
        </h2>
        <p className="mx-auto mb-10 max-w-2xl text-center text-text-secondary">
          On bosse dur pour te proposer encore plus de contenu et d&apos;outils
          pour devenir la personne la plus drôle de ton entourage.
        </p>

        <div className="grid gap-6 md:grid-cols-2">
          {/* WhatsApp quotidien */}
          <Card className="relative overflow-hidden border-accent-primary/20 bg-gradient-to-br from-background-card to-accent-primary/5">
            <CardHeader>
              <div className="mb-2 flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-primary/10">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5 text-accent-primary"
                    aria-hidden="true"
                  >
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                </div>
                <Badge variant="primary">Bientôt</Badge>
              </div>
              <CardTitle>Vannes, vidéos et conseils du jour par WhatsApp</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Reçois chaque jour ta dose d&apos;humour directement sur WhatsApp
              </CardDescription>
            </CardContent>
          </Card>

          {/* Nouveaux parcours */}
          <Card className="relative overflow-hidden border-accent-primary/20 bg-gradient-to-br from-background-card to-accent-secondary/5">
            <CardHeader>
              <div className="mb-2 flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-secondary/10">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5 text-accent-secondary"
                    aria-hidden="true"
                  >
                    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
                  </svg>
                </div>
                <Badge variant="primary">Bientôt</Badge>
              </div>
              <CardTitle>De nouveaux parcours</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Des parcours encore plus poussés pour maîtriser l&apos;art de la
                répartie et du storytelling
              </CardDescription>
            </CardContent>
          </Card>

          {/* Communauté */}
          <Card className="relative overflow-hidden border-accent-primary/20 bg-gradient-to-br from-background-card to-accent-primary/5">
            <CardHeader>
              <div className="mb-2 flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-primary/10">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5 text-accent-primary"
                    aria-hidden="true"
                  >
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>
                <Badge variant="primary">Bientôt</Badge>
              </div>
              <CardTitle>Une communauté</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Échange avec d&apos;autres passionnés d&apos;humour, partage tes
                meilleures vannes et progresse ensemble
              </CardDescription>
            </CardContent>
          </Card>

          {/* Et bien plus encore */}
          <Card className="relative overflow-hidden border-accent-primary/20 bg-gradient-to-br from-background-card to-accent-secondary/5">
            <CardHeader>
              <div className="mb-2 flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-secondary/10">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5 text-accent-secondary"
                    aria-hidden="true"
                  >
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                </div>
                <Badge variant="primary">Bientôt</Badge>
              </div>
              <CardTitle>Et bien plus encore...</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                On te prépare plein de surprises pour t&apos;aider à devenir
                encore plus drôle
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  );
}
