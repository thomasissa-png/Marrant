import type { Metadata } from "next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ConseilsList } from "@/components/conseils/conseils-list";

export const metadata: Metadata = {
  title: "Conseils humour — Progresse du débutant à l'expert",
  description:
    "Conseils pratiques et actionnables pour maîtriser le timing, la répartie, le storytelling et l'auto-dérision. Exercices inclus.",
};

export default function ConseilsPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold md:text-4xl">
            Conseils humour
          </h1>
          <p className="mt-2 text-text-secondary">
            Progresse à ton rythme avec des conseils actionnables, des exemples
            concrets et des exercices pratiques.
          </p>
        </div>

        <ConseilsList />
      </main>
      <Footer />
    </>
  );
}
