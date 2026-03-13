import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { BlaguesList } from "@/components/blagues/blagues-list";
import {
  JsonLd,
  buildBreadcrumbJsonLd,
} from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title: "Blagues drôles classées par catégorie — soirée, boulot, couple",
  description:
    "Des centaines de blagues drôles à ressortir en soirée, à la machine à café ou entre amis. Classées par catégorie (boulot, couple, école, soirées), avec la chute cachée. Deviens la personne drôle du groupe avec des blagues courtes et mémorisables.",
  alternates: { canonical: "https://deviens-marrant.fr/blagues" },
};

export default function BlaguesPage() {
  return (
    <>
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "Accueil", url: "https://deviens-marrant.fr" },
          { name: "Blagues", url: "https://deviens-marrant.fr/blagues" },
        ])}
      />
      <nav aria-label="Fil d'Ariane" className="mb-4 text-sm text-text-muted">
        <Link href="/" className="hover:text-text-primary">Accueil</Link>
        <span className="mx-2">/</span>
        <span className="text-text-secondary">Blagues</span>
      </nav>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold md:text-4xl">
          Blagues drôles à ressortir en toute occasion
        </h1>
        <p className="mt-2 text-text-secondary">
          Des centaines de blagues classées par catégorie — boulot, couple,
          soirées, école, gaming — à ressortir entre potes, à la machine à
          café ou en dîner. Clique pour révéler la chute et sauvegarde tes
          préférées. C&apos;est le premier pas pour devenir plus drôle au
          quotidien.
        </p>
      </div>

      <Suspense fallback={null}>
        <BlaguesList />
      </Suspense>
    </>
  );
}
