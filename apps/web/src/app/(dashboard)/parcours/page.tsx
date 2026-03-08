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
          Des programmes structurés pour progresser étape par étape. Complète les exercices pour gagner de l&apos;XP.
        </p>
      </div>
      <ParcoursList />
    </>
  );
}
