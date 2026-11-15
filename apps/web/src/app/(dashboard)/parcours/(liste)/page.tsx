import { Fragment } from "react";
import { AxeEspace } from "@/components/espace/axe-espace";
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
import { buildAbonnementUrl } from "@/lib/premium-return";
import { MasqueSiPremium } from "@/components/home/masque-si-premium";
import { frTypoTexte } from "@/lib/fr-typo";
import { ESPACE_CLIENT_PUBLIE } from "@/config/espace-client";
import { ParcoursEspace } from "@/components/espace/parcours/parcours-espace";
import { CARTE_A_FILET, FiletCarte } from "@/components/ui/card";
import { cn } from "@/lib/utils";

// Rendu : Server Component statique (ISR du layout) ; progression et quiz côté client.
// D8 (seo.md §6) : title « Cours d'humour en ligne » ; « première étape gratuite », jamais « cours gratuit ».
// s19 : noms des parcours lus dans PREMIUM_PARCOURS (déjà filtré par les interrupteurs de publication).
const NOMS_PARCOURS = PREMIUM_PARCOURS.map((p) => p.name);
const TITLE = `Cours d’humour en ligne : ${PARCOURS_COUNT} parcours pour devenir drôle`;
const DESCRIPTION =
  // s19 : « première étape gratuite » remonte en tête, la liste des noms grandit avec les parcours publiés
  // (150 caractères à 4 parcours, 158 à 5) : une coupure éventuelle ne mange que la fin.
  `${PARCOURS_COUNT} parcours pour devenir drôle (première étape gratuite) : ${NOMS_PARCOURS.join(", ")}. 15 à 20 min/semaine d’exercices concrets.`;
const PAGE_URL = "https://deviens-marrant.fr/parcours";

export const metadata: Metadata = {
  title: fitTitle(TITLE),
  description: DESCRIPTION,
  keywords: [
    "cours d’humour en ligne",
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

const CARTE_EXPLORE_FERME = "rounded-lg border border-border bg-background-card p-4 transition-colors hover:border-accent-primary/40";
/** v6 tour 1, arbitrage 1 : interrupteur ouvert, cartes « Explore aussi » à filet (langue de l'accueil). */
const carteExplore = () => (ESPACE_CLIENT_PUBLIE ? cn(CARTE_EXPLORE_FERME, CARTE_A_FILET) : CARTE_EXPLORE_FERME);

/** Arbitrage @ux D4 n°1 (lot D5) : masque de l'introduction pour l'abonné, espace ouvert seulement. */
const MasqueIntroduction = ESPACE_CLIENT_PUBLIE ? MasqueSiPremium : Fragment;

/**
 * Lot D11c (revue d'harmonie, défaut 3) : colonne centrée de 768 px pour tout lecteur ; interrupteur ouvert,
 * l'abonné la voit sur l'axe de l'espace (`AxeEspace`, côté navigateur). Visiteur : même HTML (critère 11).
 */
function ColonneParcours({ children }: { children: React.ReactNode }) {
  if (!ESPACE_CLIENT_PUBLIE) return <div className="mx-auto max-w-3xl">{children}</div>;
  // v6 tour 3, point 12 : la page occupe la coque (liste des cartes en `lg:grid-cols-2`, `parcours-content.tsx`) ;
  // en-tête, en-tête de l'abonné, « Explore aussi » et FAQ gardent la colonne centrée de 768 px (`colonne()`).
  return <AxeEspace visiteur="w-full">{children}</AxeEspace>;
}

/** Colonne de lecture centrée des blocs autres que la liste des cartes, interrupteur ouvert seulement. */
const colonne = () => (ESPACE_CLIENT_PUBLIE ? "mx-auto max-w-3xl" : undefined);

export default async function ParcoursPage() {
  const stats = await getContentStatsRounded();
  const catalogue = getParcoursCatalogue();
  const introduction = (
    <>
      {/* Navigation v6 : fil d'Ariane visible retiré au premier niveau (la bande montre la rubrique), BreadcrumbList gardé. */}
      {!ESPACE_CLIENT_PUBLIE && (
        <nav aria-label="Fil d’Ariane" className="mb-4 text-sm text-text-muted">
          <Link href="/" className="hover:text-text-primary max-md:py-3.5">Accueil</Link>
          <span className="mx-2">/</span>
          <span className="text-text-secondary">Parcours</span>
        </nav>
      )}
      {/* v6 tour 3, point 1 (ouvert seulement) : H1 et sous-titre centrés comme le hero de l'accueil. */}
      <div className={ESPACE_CLIENT_PUBLIE ? "mx-auto mb-8 max-w-3xl text-center" : "mb-8"}>
        <h1 className="font-display text-3xl font-bold md:text-4xl">
          {/* v3 M6 : espace insécable avant « : » (jamais en début de ligne). */}
          Parcours humour&nbsp;: deviens drôle pas à pas
        </h1>
        <p className={ESPACE_CLIENT_PUBLIE ? "mx-auto mt-2 max-w-2xl text-text-secondary" : "mt-2 text-text-secondary"}>
          {PARCOURS_COUNT} parcours pour progresser en humour, chacun taillé pour une
          situation : {listeFr(NOMS_PARCOURS)}. Compte
          15 à 20 min/semaine selon le parcours, soit moins qu’un épisode de
          série, avec des exercices concrets.
        </p>
      </div>
    </>
  );

  return (
    <ColonneParcours>
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
      {/* Arbitrage @ux D4 n°1 (lot D5) : fil d'Ariane et introduction publique masqués pour l'abonné,
          espace ouvert seulement (côté navigateur, HTML public inchangé) ; son h1 est dans ParcoursEspace. */}
      <MasqueIntroduction>{introduction}</MasqueIntroduction>
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
                <p className="mt-1 text-sm text-text-secondary">{frTypoTexte(p.description)}</p>
              </Link>
            </li>,
          ];
        })}
      </ul>

      {/* s24 lot D4 : en-tête de l'abonné (4 premières semaines, étape à reprendre, « Ton cap »), côté
          navigateur, seulement interrupteur de l'espace ouvert : fermé, HTML de la page inchangé. */}
      {ESPACE_CLIENT_PUBLIE && (
        <div className={colonne()}>
          <ParcoursEspace />
        </div>
      )}
      <ParcoursContent parcours={catalogue} />

      <JsonLd data={buildFaqJsonLd(faqSectionFaqs)} />

      {/* Cross-linking SEO */}
      <nav className={cn("mt-12 border-t border-border pt-8", colonne())}>
        <h2 className="font-display mb-4 text-xl font-bold">Explore aussi</h2>
        {/* v6 tour 1, point 12 : interrupteur ouvert, deux colonnes quand l'abonné n'a que 2 cartes (Abonnement masqué),
            trois sinon ; cartes à filet de l'accueil. Fermé : inchangé. */}
        <div className={ESPACE_CLIENT_PUBLIE ? "grid gap-4 sm:grid-cols-2 sm:[&:has(>:nth-child(3))]:grid-cols-3" : "grid gap-4 sm:grid-cols-3"}>
          {/* s21 (revue v2 m-1) : source `parcours-liste`, suivie jusqu'à `checkout-ouvert`.
              QA v4 m-6 : masqué pour l'abonné (aucun prix pour lui). */}
          <MasqueSiPremium>
            <Link href={buildAbonnementUrl(null, "monthly", "parcours-liste")} className={carteExplore()}>
              {ESPACE_CLIENT_PUBLIE && <FiletCarte />}
              <h3 className="font-display text-base font-bold text-text-primary">Abonnement {PREMIUM_PRICE_LABEL}</h3>
              <p className="mt-1 text-sm text-text-secondary">Premium : tous les parcours, vannes, conseils et vidéos.</p>
            </Link>
          </MasqueSiPremium>
          <Link href="/conseils" className={carteExplore()}>
            {ESPACE_CLIENT_PUBLIE && <FiletCarte />}
            <h3 className="font-display text-base font-bold text-text-primary">Conseils de répartie</h3>
            <p className="mt-1 text-sm text-text-secondary">{stats.tips > 0 ? `${stats.tips}+` : "Des dizaines de"} techniques concrètes avec exemples et exercices.</p>
          </Link>
          <Link href="/glossaire" className={carteExplore()}>
            {ESPACE_CLIENT_PUBLIE && <FiletCarte />}
            <h3 className="font-display text-base font-bold text-text-primary">Glossaire humour</h3>
            <p className="mt-1 text-sm text-text-secondary">Le vocabulaire des humoristes, expliqué sans jargon.</p>
          </Link>
        </div>
      </nav>

      {/* FAQ */}
      <section className={cn("mt-12 border-t border-border pt-8", colonne())}>
        <FaqSection align="left" />
      </section>
    </ColonneParcours>
  );
}
