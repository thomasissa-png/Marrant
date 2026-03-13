import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { VannesList } from "@/components/vannes/vannes-list";
import {
  JsonLd,
  buildBreadcrumbJsonLd,
} from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title: "Vannes et blagues drôles classées par catégorie — soirée, boulot, couple",
  description:
    "Des centaines de vannes drôles à ressortir en soirée, à la machine à café ou entre amis. Classées par catégorie (boulot, couple, école, soirées), avec la chute cachée. Deviens la personne drôle du groupe avec des vannes courtes et mémorisables.",
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
          Des centaines de vannes classées par catégorie — boulot, couple,
          soirées, école, gaming — à ressortir entre potes, à la machine à
          café ou en dîner. Clique pour révéler la chute et sauvegarde tes
          préférées. C&apos;est le premier pas pour devenir plus drôle au
          quotidien.
        </p>
      </div>

      <Suspense fallback={null}>
        <VannesList />
      </Suspense>
    </>
  );
}
