import type { Metadata } from "next";
import Link from "next/link";
import { ParcoursContent } from "@/components/parcours/parcours-content";
import { FaqSection } from "@/components/home/faq-section";
import {
  JsonLd,
  buildBreadcrumbJsonLd,
  buildFaqJsonLd,
} from "@/components/seo/json-ld";
import { fitTitle, websiteOpenGraph, websiteTwitter } from "@/lib/seo-meta";
import { buildParcoursItemListJsonLd } from "@/lib/parcours-jsonld";
import { faqs as faqSectionFaqs } from "@/lib/faqs";
import { getContentStatsRounded } from "@/lib/content-stats-server";
import { getParcoursCatalogue } from "@/lib/parcours-catalogue";
import { PARCOURS_COUNT, PREMIUM_PARCOURS, PREMIUM_PRICE_LABEL } from "@/config/premium";
import { listeFr } from "@/lib/liste-fr";

// Rendu : Server Component statique (ISR du layout) ; progression et quiz côté client.
// D8 (seo.md §6) : title « Cours d'humour en ligne » ; « première étape gratuite », jamais « cours gratuit ».
// s19 : noms des parcours lus dans PREMIUM_PARCOURS (déjà filtré par les interrupteurs de publication).
const NOMS_PARCOURS = PREMIUM_PARCOURS.map((p) => p.name);
const TITLE = `Cours d'humour en ligne : ${PARCOURS_COUNT} parcours pour devenir drôle`;
const DESCRIPTION =
  // s19 : « première étape gratuite » remonte en tête, la liste des noms grandit avec les parcours publiés
  // (150 caractères à 4 parcours, 158 à 5) : une coupure éventuelle ne mange que la fin.
  `${PARCOURS_COUNT} parcours pour devenir drôle (première étape gratuite) : ${NOMS_PARCOURS.join(", ")}. 15 à 20 min/semaine d'exercices concrets.`;
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
  openGraph: websiteOpenGraph({ title: TITLE, description: DESCRIPTION, url: PAGE_URL }),
  twitter: websiteTwitter({ title: TITLE, description: DESCRIPTION }),
};

export default async function ParcoursPage() {
  const stats = await getContentStatsRounded();
  const catalogue = getParcoursCatalogue();
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
          situation : {listeFr(NOMS_PARCOURS)}. Compte
          15 à 20 min/semaine selon le parcours, soit moins qu&apos;un épisode de
          série, avec des exercices concrets et des XP à gagner.
        </p>
      </div>
      {/* Liens SSR vers les parcours individuels, lus par les robots et les lecteurs d'écran
          (les cartes de ParcoursContent ouvrent le parcours par un bouton, sans lien).
          s17 tour 1 (UXV-1-11) : hors écran, pour ne plus présenter deux fois les parcours.
          s19 : générés depuis le catalogue (parcours publiés seulement), titre court de PREMIUM_PARCOURS. */}
      <ul className="sr-only">
        {catalogue.flatMap((p) => {
          const offre = PREMIUM_PARCOURS.find((o) => o.slug === p.slug);
          if (!offre) return [];
          return [
            <li key={p.slug}>
              <Link
                href={`/parcours/${p.slug}`}
                className="block rounded-lg border border-border bg-background-card p-4 transition-colors hover:border-accent-primary/40"
              >
                <h2 className="font-display text-base font-bold text-text-primary">{offre.name}</h2>
                <p className="mt-1 text-sm text-text-secondary">{p.description}</p>
              </Link>
            </li>,
          ];
        })}
      </ul>

      <ParcoursContent parcours={catalogue} />

      <JsonLd data={buildFaqJsonLd(faqSectionFaqs)} />

      {/* Cross-linking SEO */}
      <nav className="mt-12 border-t border-border pt-8">
        <h2 className="font-display mb-4 text-xl font-bold">Explore aussi</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <Link href="/abonnement" className="rounded-lg border border-border bg-background-card p-4 transition-colors hover:border-accent-primary/40">
            <h3 className="font-display text-base font-bold text-text-primary">Abonnement {PREMIUM_PRICE_LABEL}</h3>
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
