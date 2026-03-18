import type { Metadata } from "next";
import Link from "next/link";
import { ParcoursContent } from "@/components/parcours/parcours-content";
import { FaqSection } from "@/components/home/faq-section";
import {
  JsonLd,
  buildBreadcrumbJsonLd,
  buildCourseJsonLd,
  buildFaqJsonLd,
} from "@/components/seo/json-ld";
import { faqs as faqSectionFaqs } from "@/components/home/faq-section";

export const metadata: Metadata = {
  title: "Parcours humour — deviens drôle",
  description:
    "3 parcours pour devenir drôle : Machine à Café (3 sem.), Répartie (4 sem.), Confiance (6 sem.). 15 min/semaine suffisent.",
  keywords: [
    "cours humour en ligne",
    "parcours répartie",
    "formation humour",
    "exercices humour débutant",
    "apprendre humour pas à pas",
    "devenir drôle en ligne",
  ],
  alternates: { canonical: "https://deviens-marrant.fr/parcours" },
};

export default function ParcoursPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "Accueil", url: "https://deviens-marrant.fr" },
          { name: "Parcours", url: "https://deviens-marrant.fr/parcours" },
        ])}
      />
      <JsonLd
        data={buildCourseJsonLd({
          name: "Parcours Machine à Café — Deviens drôle au bureau",
          description:
            "Apprends à avoir des blagues et anecdotes à ressortir au bureau et en afterwork en 3 semaines.",
          duration: "3 semaines",
          slug: "machine-a-cafe",
          difficulty: "DEBUTANT",
          stepsCount: 3,
        })}
      />
      <JsonLd
        data={buildCourseJsonLd({
          name: "Parcours Répartie — Aie toujours une réponse prête",
          description:
            "Développe ta répartie en 4 semaines avec des techniques concrètes pour ne plus rester muet.",
          duration: "4 semaines",
          slug: "repartie",
          difficulty: "INTERMEDIAIRE",
          stepsCount: 4,
        })}
      />
      <JsonLd
        data={buildCourseJsonLd({
          name: "Parcours Confiance — Retrouve ton humour et ta légèreté",
          description:
            "Parcours de 6 semaines pour retrouver confiance en soi grâce à l'humour après une période difficile.",
          duration: "6 semaines",
          slug: "confiance",
          difficulty: "INTERMEDIAIRE",
          stepsCount: 6,
        })}
      />
      <nav aria-label="Fil d'Ariane" className="mb-4 text-sm text-text-muted">
        <Link href="/" className="hover:text-text-primary">Accueil</Link>
        <span className="mx-2">/</span>
        <span className="text-text-secondary">Parcours</span>
      </nav>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold md:text-4xl">
          Parcours humour : deviens drôle pas à pas
        </h1>
        <p className="mt-2 text-text-secondary">
          3 parcours structurés pour progresser en humour : machine à café,
          répartie et confiance. 15 min/semaine, des exercices concrets et
          des XP à gagner.
        </p>
      </div>
      <ParcoursContent />

      <JsonLd data={buildFaqJsonLd(faqSectionFaqs)} />

      {/* Cross-linking SEO */}
      <nav className="mt-12 border-t border-border pt-8">
        <h2 className="font-display mb-4 text-xl font-bold">Explore aussi</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <Link href="/abonnement" className="rounded-lg border border-border bg-background-card p-4 transition-colors hover:border-accent-primary/40">
            <h3 className="text-sm font-semibold text-text-primary">Abonnement 0,99 &euro;/mois</h3>
            <p className="mt-1 text-xs text-text-secondary">Accès complet à tous les parcours, vannes, conseils et vidéos.</p>
          </Link>
          <Link href="/conseils" className="rounded-lg border border-border bg-background-card p-4 transition-colors hover:border-accent-primary/40">
            <h3 className="text-sm font-semibold text-text-primary">Conseils de répartie</h3>
            <p className="mt-1 text-xs text-text-secondary">66 techniques concrètes avec exemples et exercices.</p>
          </Link>
          <Link href="/glossaire" className="rounded-lg border border-border bg-background-card p-4 transition-colors hover:border-accent-primary/40">
            <h3 className="text-sm font-semibold text-text-primary">Glossaire humour</h3>
            <p className="mt-1 text-xs text-text-secondary">Les termes clés pour comprendre les techniques des pros.</p>
          </Link>
        </div>
      </nav>

      {/* FAQ */}
      <div className="mt-16">
        <FaqSection />
      </div>
    </div>
  );
}
