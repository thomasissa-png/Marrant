import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { VideosGrid } from "@/components/videos/videos-grid";
import {
  JsonLd,
  buildBreadcrumbJsonLd,
} from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title:
    "Vidéos stand-up analysées — apprends l'humour des meilleurs humoristes",
  description:
    "Apprends à devenir drôle en regardant les meilleurs humoristes français : Gad Elmaleh, Blanche Gardin, Florence Foresti, Fary, Paul Mirabel. Chaque vidéo est annotée avec la technique d'humour utilisée (timing, répartie, autodérision, storytelling).",
  alternates: { canonical: "https://deviens-marrant.fr/videos" },
};

export default function VideosPage() {
  return (
    <>
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "Accueil", url: "https://deviens-marrant.fr" },
          { name: "Vidéos", url: "https://deviens-marrant.fr/videos" },
        ])}
      />
      <nav aria-label="Fil d'Ariane" className="mb-4 text-sm text-text-muted">
        <Link href="/" className="hover:text-text-primary">Accueil</Link>
        <span className="mx-2">/</span>
        <span className="text-text-secondary">Vidéos</span>
      </nav>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold md:text-4xl">
          Apprends à être drôle avec les meilleurs humoristes
        </h1>
        <p className="mt-2 text-text-secondary">
          Regarde comment Gad Elmaleh, Florence Foresti, Blanche Gardin, Fary et
          Paul Mirabel construisent leurs blagues et leurs punchlines. Chaque
          vidéo est annotée avec la technique utilisée — timing, autodérision,
          observation, storytelling. Le meilleur moyen de devenir drôle, c&apos;est
          d&apos;apprendre des pros.
        </p>
      </div>

      <Suspense fallback={null}>
        <VideosGrid />
      </Suspense>
    </>
  );
}
