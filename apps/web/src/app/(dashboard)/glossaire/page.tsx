import type { Metadata } from "next";
import { pageShareMeta } from "@/lib/seo-meta";
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
import { FIN_DE_PAGE_PARCOURS_ETAPE_1, GLOSSAIRE_FIN } from "@/config/textes/cta-pages";
import { REASSURANCE_UNIQUE } from "@/config/textes/offre";
import { LIEN_L2 } from "@/components/ui/liens";
import { BLOC_APPEL, BOUTON_BLOC_APPEL, TITRE_BLOC_APPEL } from "@/components/layout/gabarit";
import { cn } from "@/lib/utils";
import { parcoursEtape1Href } from "@/lib/entrees-parcours";
import { MasqueSiPremium } from "@/components/home/masque-si-premium";
import { buildAbonnementUrl } from "@/lib/premium-return";

/** Ancre d'un terme : même règle que l'URL du JSON-LD DefinedTerm. */
const termAnchor = (term: string) => term.toLowerCase().replace(/\s+/g, "-");

const PAGE_URL = "https://deviens-marrant.fr/glossaire";
const PAGE_TITLE = `Glossaire humour : ${glossary.length} termes clés`;
const PAGE_DESCRIPTION =
  `Punchline, timing, callback, one-liner : le dico de l’humour qui explique ${glossary.length} termes clés des pros, chacun avec un exemple concret pour bien le replacer.`;

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  keywords: [
    "définition répartie",
    "qu’est-ce que la répartie",
    "timing humour définition",
    "autodérision définition",
    "glossaire humour",
    "vocabulaire humour",
  ],
  alternates: { canonical: PAGE_URL },
  // SEO s21 : aperçu de partage propre à la page (og:url), au lieu de celui de l'accueil.
  ...pageShareMeta({ title: PAGE_TITLE, description: PAGE_DESCRIPTION, url: PAGE_URL }),
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
      <nav aria-label="Fil d’Ariane" className="mb-4 text-sm text-text-muted">
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
            exemples concrets. Parce que savoir comment s’appelle une
            technique, c’est déjà un peu savoir s’en servir.
          </>
        }
      />

      {/* T49 : index collant des termes (libellés = termes existants), sous le header sticky */}
      <nav
        aria-label="Glossaire"
        className="sticky top-16 z-30 mb-6 border-b border-border bg-background/90 backdrop-blur-md"
      >
        {/* À partir de 1024 px, l'index passe à la ligne au lieu de couper un terme (« Accusé de réception »).
            Revue visuelle s21 (R30) : en dessous, fondu de 24 px à droite comme repère de défilement. */}
        <ul className="flex snap-x gap-0 overflow-x-auto py-1 [mask-image:linear-gradient(to_right,#000_calc(100%-24px),transparent)] [scrollbar-width:none] lg:flex-wrap lg:overflow-visible lg:[mask-image:none] [&::-webkit-scrollbar]:hidden">
          {glossary.map((item) => (
            <li key={item.term} className="shrink-0 snap-start">
              <a
                href={`#${termAnchor(item.term)}`}
                className="inline-flex min-h-[44px] items-center whitespace-nowrap rounded-md px-2 text-sm text-text-secondary transition-colors hover:bg-background-elevated hover:text-text-primary"
              >
                {frTypo(item.term)}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* Revue visuelle s21 : définitions sur la pleine colonne, comme l'index et « Passe de la théorie à la pratique » ;
          R31 : 2 colonnes dès 1 024 px comme /conseils (pages sœurs), cartes de même hauteur par rangée. */}
      <div className="grid gap-6 lg:grid-cols-2 lg:[&>*:last-child:nth-child(odd)]:col-span-2">
        {glossary.map((item) => (
          <section
            key={item.term}
            id={termAnchor(item.term)}
            className="flex h-full scroll-mt-32 flex-col rounded-xl border border-border bg-background-card p-6 lg:scroll-mt-44"
          >
            <h2 className="font-display text-xl font-bold text-text-primary">
              {frTypo(item.term)}
            </h2>
            <p className="mt-3 max-w-3xl leading-relaxed text-text-secondary">
              {frTypo(item.definition)}
            </p>
            <Link
              href={item.related}
              className="mt-auto inline-flex min-h-11 items-center self-start pt-1 text-sm font-medium text-accent-link hover:underline"
            >
              {frTypo(item.relatedLabel)} →
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
            <p className="mt-1 text-xs text-text-secondary">Qui est derrière deviens-marrant.fr, et pourquoi on pense que l’humour s’apprend.</p>
          </Link>
        </div>
      </nav>

      {/* CTA. s21 (revue v2) : masqué pour un abonné Premium ; source `glossaire` suivie
          jusqu'à `checkout-ouvert` (m-1). Textes : concision v5 (config/textes/cta-pages.ts). */}
      <MasqueSiPremium>
      {/* Revue visuelle s21 : même bloc d'appel que les murs et les fins d'article (contenu à gauche). */}
      <div className={cn("mt-12", BLOC_APPEL)} data-testid="glossaire-fin">
        <p className={TITRE_BLOC_APPEL}>{frTypo(GLOSSAIRE_FIN.titre)}</p>
        <p className="mt-2 text-text-secondary">{frTypo(GLOSSAIRE_FIN.paragraphe)}</p>
        <div className="mt-4">
          <Link href={buildAbonnementUrl(null, "monthly", "glossaire")} className={cn(buttonVariants({ variant: "primary", size: "lg" }), BOUTON_BLOC_APPEL)}>
            {frTypo(GLOSSAIRE_FIN.bouton)}
          </Link>
        </div>
        <p className="mt-2 text-xs text-text-muted">{frTypo(REASSURANCE_UNIQUE)}</p>
        <div className="-mb-3 mt-1">
          <Link href={parcoursEtape1Href(FIN_DE_PAGE_PARCOURS_ETAPE_1, "glossaire-etape1")} className={LIEN_L2}>
            {frTypo(GLOSSAIRE_FIN.lienEtape1)}
          </Link>
        </div>
      </div>
      </MasqueSiPremium>
    </>
  );
}
