import type { Metadata } from "next";
import { ConseilsList } from "@/components/conseils/conseils-list";

export const metadata: Metadata = {
  title: "Conseils humour — Progresse du débutant à l'expert",
  description:
    "Conseils pratiques et actionnables pour maîtriser le timing, la répartie, le storytelling et l'auto-dérision. Exercices inclus.",
};

export default function ConseilsPage() {
  return (
    <>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold md:text-4xl">
          Conseils humour &amp; répartie
        </h1>
        <p className="mt-2 text-text-secondary">
          Techniques de répartie, timing, storytelling, auto-dérision — chaque
          conseil vient avec un exemple concret et un exercice à tester
          dès aujourd&apos;hui. Du débutant qui manque de confiance au confirmé
          qui veut affiner son jeu.
        </p>
      </div>

      <ConseilsList />
    </>
  );
}
