import type { Metadata } from "next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { VideosGrid } from "@/components/videos/videos-grid";

export const metadata: Metadata = {
  title: "Vidéos stand-up — Apprends des meilleurs humoristes français",
  description:
    "Regarde des extraits de stand-up français annotés avec les techniques d'humour utilisées. Gad Elmaleh, Blanche Gardin, Fary, Paul Mirabel...",
};

export default function VideosPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold md:text-4xl">
            Vidéos stand-up
          </h1>
          <p className="mt-2 text-text-secondary">
            Apprends des meilleurs humoristes français avec des extraits annotés.
          </p>
        </div>

        <VideosGrid />
      </main>
      <Footer />
    </>
  );
}
