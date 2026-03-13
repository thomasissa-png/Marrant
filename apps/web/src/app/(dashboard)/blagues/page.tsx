import type { Metadata } from "next";
import { Suspense } from "react";
import { BlaguesList } from "@/components/blagues/blagues-list";

export const metadata: Metadata = {
  title: "Blagues | Deviens drôle avec des centaines de blagues",
  description:
    "Tu cherches LA blague à ressortir en soirée ou à la machine à café ? Des centaines de blagues classées par catégorie. Révèle la chute d'un clic !",
};

export default function BlaguesPage() {
  return (
    <>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold md:text-4xl">
          Blagues
        </h1>
        <p className="mt-2 text-text-secondary">
          Des centaines de blagues triées par catégorie, à ressortir entre
          potes, à la machine à café ou en soirée. Clique pour révéler la
          chute, et sauvegarde tes préférées.
        </p>
      </div>

      <Suspense fallback={null}>
        <BlaguesList />
      </Suspense>
    </>
  );
}
