import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { VannesList } from "@/components/vannes/vannes-list";
import {
  JsonLd,
  buildBreadcrumbJsonLd,
} from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title: "Vannes et blagues drôles classées par catégorie",
  description:
    "Des centaines de vannes drôles à ressortir en soirée, au boulot ou entre amis. Classées par catégorie, chute cachée. Deviens la personne drôle du groupe.",
  keywords: [
    "vanne drôle",
    "blague du jour",
    "vanne du jour",
    "blagues courtes",
    "vannes à ressortir",
    "blagues entre amis",
  ],
  alternates: { canonical: "https://deviens-marrant.fr/vannes" },
};

export default function VannesPage() {
  return (
    <>
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "Accueil", url: "https://deviens-marrant.fr" },
          { name: "Vannes", url: "https://deviens-marrant.fr/vannes" },
        ])}
      />
      <nav aria-label="Fil d'Ariane" className="mb-4 text-sm text-text-muted">
        <Link href="/" className="hover:text-text-primary">Accueil</Link>
        <span className="mx-2">/</span>
        <span className="text-text-secondary">Vannes</span>
      </nav>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold md:text-4xl">
          Vannes drôles à ressortir en toute occasion
        </h1>
        <p className="mt-2 text-text-secondary">
          Boulot, couple, soirées, école, gaming — trouve la vanne parfaite
          pour chaque situation. Clique pour révéler la chute, sauvegarde tes
          préférées, et ressors-les ce soir. La théorie, c&apos;est bien.
          Avoir une vanne prête, c&apos;est mieux.
        </p>
      </div>

      <Suspense fallback={null}>
        <VannesList />
      </Suspense>

      {/* Cross-linking SEO */}
      <nav className="mt-12 border-t border-border pt-8">
        <h2 className="font-display mb-4 text-xl font-bold">Continue ta progression</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <Link href="/conseils" className="rounded-lg border border-border bg-background-card p-4 transition-colors hover:border-accent-primary/40">
            <h3 className="text-sm font-semibold text-text-primary">Conseils de répartie</h3>
            <p className="mt-1 text-xs text-text-secondary">Apprends les techniques pour avoir de la répartie et placer tes vannes au bon moment.</p>
          </Link>
          <Link href="/videos" className="rounded-lg border border-border bg-background-card p-4 transition-colors hover:border-accent-primary/40">
            <h3 className="text-sm font-semibold text-text-primary">Vidéos stand-up analysées</h3>
            <p className="mt-1 text-xs text-text-secondary">Regarde comment les pros construisent leurs blagues et apprends leurs techniques.</p>
          </Link>
          <Link href="/blog" className="rounded-lg border border-border bg-background-card p-4 transition-colors hover:border-accent-primary/40">
            <h3 className="text-sm font-semibold text-text-primary">Blog humour</h3>
            <p className="mt-1 text-xs text-text-secondary">Guides complets pour devenir drôle, avoir de la répartie et développer ton humour.</p>
          </Link>
        </div>
      </nav>
    </>
  );
}
