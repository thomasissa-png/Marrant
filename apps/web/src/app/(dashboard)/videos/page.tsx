import type { Metadata } from "next";
import { Suspense } from "react";
import { VideosGrid } from "@/components/videos/videos-grid";

export const metadata: Metadata = {
  title: "Vidéos stand-up | Apprends des meilleurs humoristes français",
  description:
    "Regarde des extraits de stand-up français annotés avec les techniques d'humour utilisées. Gad Elmaleh, Blanche Gardin, Fary, Paul Mirabel...",
};

export default function VideosPage() {
  return (
    <>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold md:text-4xl">
          Vidéos stand-up
        </h1>
        <p className="mt-2 text-text-secondary">
          Regarde comment les meilleurs humoristes français construisent
          leurs blagues et leurs punchlines. Chaque vidéo est annotée avec
          la technique utilisée. Idéal pour comprendre et reproduire ce qui
          fait rire.
        </p>
      </div>

      <Suspense fallback={null}>
        <VideosGrid />
      </Suspense>
    </>
  );
}
