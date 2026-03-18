import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { ConseilsList } from "@/components/conseils/conseils-list";
import {
  JsonLd,
  buildBreadcrumbJsonLd,
} from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title: "Conseils humour et répartie — techniques pour être drôle",
  description:
    "66 techniques concrètes pour avoir de la répartie et faire rire au quotidien. Avec exemples, dialogues et un défi à tester dès aujourd'hui.",
  keywords: [
    "avoir de la répartie",
    "comment avoir de la répartie",
    "techniques de répartie",
    "conseils humour",
    "exercices répartie",
    "autodérision",
    "storytelling humour",
  ],
  alternates: { canonical: "https://deviens-marrant.fr/conseils" },
};

export default function ConseilsPage() {
  return (
    <>
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "Accueil", url: "https://deviens-marrant.fr" },
          { name: "Conseils", url: "https://deviens-marrant.fr/conseils" },
        ])}
      />
      <nav aria-label="Fil d'Ariane" className="mb-4 text-sm text-text-muted">
        <Link href="/" className="hover:text-text-primary">Accueil</Link>
        <span className="mx-2">/</span>
        <span className="text-text-secondary">Conseils</span>
      </nav>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold md:text-4xl">
          Comment avoir de la répartie et devenir plus drôle
        </h1>
        <p className="mt-2 text-text-secondary">
          Répartie, timing, storytelling — les techniques des meilleurs
          humoristes français, expliquées comme si on était à la même table.
          Chaque conseil vient avec un exemple concret et un défi à tester
          aujourd&apos;hui. Pas de théorie creuse : tu lis, tu testes, tu
          progresses.
        </p>
      </div>

      <Suspense fallback={null}>
        <ConseilsList />
      </Suspense>

      {/* Cross-linking SEO */}
      <nav className="mt-12 border-t border-border pt-8">
        <h2 className="font-display mb-4 text-xl font-bold">Explore aussi</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <Link href="/vannes" className="rounded-lg border border-border bg-background-card p-4 transition-colors hover:border-accent-primary/40">
            <h3 className="text-sm font-semibold text-text-primary">Vannes et blagues drôles</h3>
            <p className="mt-1 text-xs text-text-secondary">Des centaines de vannes classées par catégorie à ressortir en soirée ou au boulot.</p>
          </Link>
          <Link href="/parcours" className="rounded-lg border border-border bg-background-card p-4 transition-colors hover:border-accent-primary/40">
            <h3 className="text-sm font-semibold text-text-primary">Parcours structurés</h3>
            <p className="mt-1 text-xs text-text-secondary">Progresse semaine après semaine avec des exercices concrets et des XP à gagner.</p>
          </Link>
          <Link href="/videos" className="rounded-lg border border-border bg-background-card p-4 transition-colors hover:border-accent-primary/40">
            <h3 className="text-sm font-semibold text-text-primary">Vidéos stand-up analysées</h3>
            <p className="mt-1 text-xs text-text-secondary">Apprends les techniques des meilleurs humoristes français en vidéo.</p>
          </Link>
        </div>
      </nav>
    </>
  );
}
