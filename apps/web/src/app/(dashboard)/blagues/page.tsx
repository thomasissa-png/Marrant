import type { Metadata } from "next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { BlaguesList } from "@/components/blagues/blagues-list";

export const metadata: Metadata = {
  title: "Blagues — Deviens drôle avec des centaines de blagues",
  description:
    "Découvre des blagues triées par catégorie : auto-dérision, absurde, jeux de mots, observationnel. Révèle la chute d'un clic !",
};

export default function BlaguesPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold md:text-4xl">
            Blagues
          </h1>
          <p className="mt-2 text-text-secondary">
            Des centaines de blagues pour tous les goûts. Clique pour révéler la
            chute.
          </p>
        </div>

        <BlaguesList />
      </main>
      <Footer />
    </>
  );
}
