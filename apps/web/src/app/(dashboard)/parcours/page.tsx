import type { Metadata } from "next";
import { ParcoursList } from "@/components/parcours/parcours-list";

export const metadata: Metadata = {
  title: "Parcours — Progresse étape par étape",
  description: "Suis des parcours d'apprentissage structurés pour maîtriser l'humour en quelques semaines.",
};

export default function ParcoursPage() {
  return (
    <>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold md:text-4xl">
          Parcours d&apos;apprentissage
        </h1>
        <p className="mt-2 text-text-secondary">
          Tu veux progresser mais tu ne sais pas par où commencer ? Suis un
          parcours guidé étape par étape — du débutant qui manque de répartie
          au comique en herbe qui veut monter sur scène. Gagne de l&apos;XP
          à chaque exercice complété.
        </p>
      </div>
      <ParcoursList />
    </>
  );
}
