import type { Metadata } from "next";
import Link from "next/link";
import {
  JsonLd,
  buildBreadcrumbJsonLd,
  buildDefinedTermListJsonLd,
} from "@/components/seo/json-ld";
import { PageHeader } from "@/components/layout/page-header";
import { frTypo } from "@/lib/fr-typo";
import { buttonVariants } from "@/components/ui/button";
import { glossary } from "@/lib/glossary";

/** Ancre d'un terme : même règle que l'URL du JSON-LD DefinedTerm. */
const termAnchor = (term: string) => term.toLowerCase().replace(/\s+/g, "-");

export const metadata: Metadata = {
  title: `Glossaire humour : ${glossary.length} termes clés`,
  description:
    `Punchline, timing, callback, one-liner : le dico de l'humour qui explique ${glossary.length} termes clés des pros, chacun avec un exemple concret pour bien le replacer.`,
  keywords: [
    "définition répartie",
    "qu'est-ce que la répartie",
    "timing humour définition",
    "autodérision définition",
    "glossaire humour",
    "vocabulaire humour",
  ],
  alternates: { canonical: "https://deviens-marrant.fr/glossaire" },
};

export default function GlossairePage() {
  return (
    <>
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "Accueil", url: "https://deviens-marrant.fr" },
          { name: "Glossaire", url: "https://deviens-marrant.fr/glossaire" },
        ])}
      />
      <JsonLd
        data={buildDefinedTermListJsonLd(
          glossary.map((item) => ({
            term: item.term,
            definition: item.definition,
            url: `https://deviens-marrant.fr/glossaire#${termAnchor(item.term)}`,
          })),
        )}
      />
      <nav aria-label="Fil d'Ariane" className="mb-4 text-sm text-text-muted">
        <Link href="/" className="hover:text-text-primary max-md:py-3.5">Accueil</Link>
        <span className="mx-2">/</span>
        <span className="text-text-secondary">Glossaire</span>
      </nav>

      <PageHeader
        title={<>Glossaire humour&nbsp;: les termes à connaître pour devenir drôle</>}
        lead={
          <>
            Répartie, timing, autodérision, punchline… Les mots que les
            humoristes utilisent entre eux, expliqués simplement et avec des
            exemples concrets. Parce que savoir comment s&apos;appelle une
            technique, c&apos;est déjà un peu savoir s&apos;en servir.
          </>
        }
      />

      {/* T49 : index collant des termes (libellés = termes existants), sous le header sticky */}
      <nav
        aria-label="Glossaire"
        className="sticky top-16 z-30 mb-6 border-b border-border bg-background/90 backdrop-blur-md"
      >
        {/* À partir de 1024 px, l'index passe à la ligne au lieu de couper un terme (« Accusé de réception »). */}
        <ul className="flex snap-x gap-0 overflow-x-auto py-1 lg:flex-wrap lg:overflow-visible">
          {glossary.map((item) => (
            <li key={item.term} className="shrink-0 snap-start">
              <a
                href={`#${termAnchor(item.term)}`}
                className="inline-flex min-h-[44px] items-center whitespace-nowrap rounded-md px-2 text-sm text-text-secondary transition-colors hover:bg-background-elevated hover:text-text-primary"
              >
                {item.term}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="max-w-4xl space-y-6">
        {glossary.map((item) => (
          <section
            key={item.term}
            id={termAnchor(item.term)}
            className="scroll-mt-32 rounded-xl border border-border bg-background-card p-6 lg:scroll-mt-44"
          >
            <h2 className="font-display text-xl font-bold text-text-primary">
              {item.term}
            </h2>
            <p className="mt-3 max-w-3xl leading-relaxed text-text-secondary">
              {frTypo(item.definition)}
            </p>
            <Link
              href={item.related}
              className="mt-3 inline-block text-sm font-medium text-accent-link hover:underline"
            >
              {item.relatedLabel} →
            </Link>
          </section>
        ))}
      </div>

      {/* Cross-linking SEO */}
      <nav className="mt-12 border-t border-border pt-8">
        <h2 className="font-display mb-4 text-xl font-bold">Passe de la théorie à la pratique</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <Link href="/vannes" className="rounded-lg border border-border bg-background-card p-4 transition-colors hover:border-accent-primary/40">
            <h3 className="text-sm font-semibold text-text-primary">Vannes et blagues drôles</h3>
            <p className="mt-1 text-xs text-text-secondary">Repère le setup, la punchline et le timing dans des vannes prêtes à ressortir.</p>
          </Link>
          <Link href="/conseils" className="rounded-lg border border-border bg-background-card p-4 transition-colors hover:border-accent-primary/40">
            <h3 className="text-sm font-semibold text-text-primary">Conseils de répartie</h3>
            <p className="mt-1 text-xs text-text-secondary">Techniques concrètes de timing, autodérision et storytelling.</p>
          </Link>
          <Link href="/a-propos" className="rounded-lg border border-border bg-background-card p-4 transition-colors hover:border-accent-primary/40">
            <h3 className="text-sm font-semibold text-text-primary">À propos</h3>
            <p className="mt-1 text-xs text-text-secondary">Qui est derrière deviens-marrant.fr, et pourquoi on pense que l&apos;humour s&apos;apprend.</p>
          </Link>
        </div>
      </nav>

      {/* CTA */}
      <div className="mt-12 rounded-lg border border-border bg-background-card p-6 text-center">
        <p className="font-display text-xl font-bold text-text-primary">
          Le vocabulaire, c&apos;est fait. Place aux rires.
        </p>
        <p className="mt-2 text-text-secondary">
          Des exercices concrets, des parcours étape par étape et tes XP pour
          voir le chemin parcouru. Connaître le mot « callback », c&apos;est
          bien ; en placer un au dîner de samedi, c&apos;est mieux.
        </p>
        <Link href="/abonnement" className={buttonVariants({ variant: "primary", size: "lg", className: "mt-4" })}>
          Commencer à 2,99 €/mois
        </Link>
      </div>
    </>
  );
}
