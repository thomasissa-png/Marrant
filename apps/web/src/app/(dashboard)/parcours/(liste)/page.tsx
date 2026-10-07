import type { Metadata } from "next";
import Link from "next/link";
import { ParcoursContent } from "@/components/parcours/parcours-content";
import { FaqSection } from "@/components/home/faq-section";
import {
  JsonLd,
  buildBreadcrumbJsonLd,
  buildFaqJsonLd,
} from "@/components/seo/json-ld";
import { DEFAULT_OG_IMAGE, fitTitle } from "@/lib/seo-meta";
import { buildParcoursItemListJsonLd } from "@/lib/parcours-jsonld";
import { faqs as faqSectionFaqs } from "@/lib/faqs";
import { getContentStatsRounded } from "@/lib/content-stats-server";
import { getParcoursCatalogue } from "@/lib/parcours-catalogue";
import { PARCOURS_COUNT, PREMIUM_PARCOURS, parcoursWeeks } from "@/config/premium";

// Rendu : Server Component statique (ISR du layout) ; progression et quiz côté client.
// D8 (seo.md §6) : title « Cours d'humour en ligne » ; « première étape gratuite », jamais « cours gratuit ».
const TITLE = `Cours d'humour en ligne : ${PARCOURS_COUNT} parcours pour devenir drôle`;
const DESCRIPTION =
  `${PARCOURS_COUNT} parcours pour devenir drôle (Machine à Café, Répartie, Confiance) : 15 à 20 min/semaine, des exercices concrets, de l'XP. Première étape gratuite.`;
const PAGE_URL = "https://deviens-marrant.fr/parcours";

export const metadata: Metadata = {
  title: fitTitle(TITLE),
  description: DESCRIPTION,
  keywords: [
    "cours d'humour en ligne",
    "parcours répartie",
    "formation humour",
    "exercices humour débutant",
    "apprendre humour pas à pas",
    "devenir drôle en ligne",
  ],
  alternates: { canonical: PAGE_URL },
  // SEO-02 : aperçu de partage de /parcours (il pointait vers l'accueil).
  openGraph: { title: TITLE, description: DESCRIPTION, url: PAGE_URL, images: [DEFAULT_OG_IMAGE] },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, images: [DEFAULT_OG_IMAGE.url] },
};

export default async function ParcoursPage() {
  const stats = await getContentStatsRounded();
  return (
    <div className="mx-auto max-w-4xl">
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "Accueil", url: "https://deviens-marrant.fr" },
          { name: "Parcours", url: "https://deviens-marrant.fr/parcours" },
        ])}
      />
      {/* SEO-04 : une liste de liens ; chaque Course (avec @id) vit sur sa page détail. */}
      <JsonLd
        data={buildParcoursItemListJsonLd(
          PREMIUM_PARCOURS.map((p) => ({ slug: p.slug, name: `Parcours ${p.name}` })),
        )}
      />
      <nav aria-label="Fil d'Ariane" className="mb-4 text-sm text-text-muted">
        <Link href="/" className="hover:text-text-primary max-md:py-3.5">Accueil</Link>
        <span className="mx-2">/</span>
        <span className="text-text-secondary">Parcours</span>
      </nav>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold md:text-4xl">
          Parcours humour : deviens drôle pas à pas
        </h1>
        <p className="mt-2 text-text-secondary">
          {PARCOURS_COUNT} parcours pour progresser en humour, chacun taillé pour une
          situation : la machine à café, la répartie et la confiance. Compte
          15 à 20 min/semaine selon le parcours, soit moins qu&apos;un épisode de
          série, avec des exercices concrets et des XP à gagner.
        </p>
      </div>
      {/* Liens SSR vers les parcours individuels, lus par les robots et les lecteurs d'écran
          (les cartes de ParcoursContent ouvrent le parcours par un bouton, sans lien).
          s17 tour 1 (UXV-1-11) : hors écran, pour ne plus présenter deux fois les 3 parcours. */}
      <ul className="sr-only">
        <li>
          <Link
            href="/parcours/machine-a-cafe"
            className="block rounded-lg border border-border bg-background-card p-4 transition-colors hover:border-accent-primary/40"
          >
            <h2 className="font-display text-base font-bold text-text-primary">Machine à Café</h2>
            <p className="mt-1 text-sm text-text-secondary">{parcoursWeeks("machine-a-cafe")} semaines pour avoir enfin quelque chose à raconter entre deux gorgées de café, au bureau comme en afterwork.</p>
          </Link>
        </li>
        <li>
          <Link
            href="/parcours/repartie"
            className="block rounded-lg border border-border bg-background-card p-4 transition-colors hover:border-accent-primary/40"
          >
            <h2 className="font-display text-base font-bold text-text-primary">Répartie</h2>
            <p className="mt-1 text-sm text-text-secondary">{parcoursWeeks("repartie")} semaines pour trouver ta réplique pendant qu&apos;elle sert encore à quelque chose.</p>
          </Link>
        </li>
        <li>
          <Link
            href="/parcours/confiance"
            className="block rounded-lg border border-border bg-background-card p-4 transition-colors hover:border-accent-primary/40"
          >
            <h2 className="font-display text-base font-bold text-text-primary">Confiance</h2>
            <p className="mt-1 text-sm text-text-secondary">{parcoursWeeks("confiance")} semaines pour dérouiller ton humour après une période difficile, et la confiance qui va avec.</p>
          </Link>
        </li>
      </ul>

      <ParcoursContent parcours={getParcoursCatalogue()} />

      <JsonLd data={buildFaqJsonLd(faqSectionFaqs)} />

      {/* Cross-linking SEO */}
      <nav className="mt-12 border-t border-border pt-8">
        <h2 className="font-display mb-4 text-xl font-bold">Explore aussi</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <Link href="/abonnement" className="rounded-lg border border-border bg-background-card p-4 transition-colors hover:border-accent-primary/40">
            <h3 className="font-display text-base font-bold text-text-primary">Abonnement 2,99 &euro;/mois</h3>
            <p className="mt-1 text-sm text-text-secondary">Premium : tous les parcours, vannes, conseils et vidéos.</p>
          </Link>
          <Link href="/conseils" className="rounded-lg border border-border bg-background-card p-4 transition-colors hover:border-accent-primary/40">
            <h3 className="font-display text-base font-bold text-text-primary">Conseils de répartie</h3>
            <p className="mt-1 text-sm text-text-secondary">{stats.tips > 0 ? `${stats.tips}+` : "Des dizaines de"} techniques concrètes avec exemples et exercices.</p>
          </Link>
          <Link href="/glossaire" className="rounded-lg border border-border bg-background-card p-4 transition-colors hover:border-accent-primary/40">
            <h3 className="font-display text-base font-bold text-text-primary">Glossaire humour</h3>
            <p className="mt-1 text-sm text-text-secondary">Le vocabulaire des humoristes, expliqué sans jargon.</p>
          </Link>
        </div>
      </nav>

      {/* FAQ */}
      <section className="mt-12 border-t border-border pt-8">
        <FaqSection align="left" />
      </section>
    </div>
  );
}
