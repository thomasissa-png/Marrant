import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { ConseilsList } from "@/components/conseils/conseils-list";
import {
  JsonLd,
  buildBreadcrumbJsonLd,
} from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title: "Conseils humour et répartie — techniques pour devenir drôle",
  description:
    "Comment avoir de la répartie, maîtriser le timing et devenir plus drôle au quotidien. Techniques concrètes avec exemples et exercices, du débutant timide au confirmé. Apprends la répartie, le storytelling et l'autodérision pas à pas.",
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
          Apprends les techniques de répartie, de timing et de storytelling
          utilisées par les meilleurs humoristes français. Chaque conseil vient
          avec un exemple concret et un exercice à tester dès aujourd&apos;hui.
          Que tu sois timide et débutant ou confirmé qui veut affiner son jeu,
          progresse à ton rythme vers un humour plus naturel.
        </p>
      </div>

      <Suspense fallback={null}>
        <ConseilsList />
      </Suspense>
    </>
  );
}
