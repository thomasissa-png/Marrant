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
    "Apprends l'humour avec Fary, Paul Mirabel, Blanche Gardin, Roman Frayssinet et Waly Dia. Chaque vidéo annotée : timing, répartie, autodérision, storytelling.",
  keywords: [
    "stand-up français",
    "vidéos humour analysées",
    "Paul Mirabel techniques",
    "Blanche Gardin humour",
    "Fary stand-up",
    "apprendre humour vidéo",
  ],
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
          Fary, Paul Mirabel, Blanche Gardin, Roman Frayssinet, Waly Dia — on
          décortique leurs meilleurs passages. Chaque vidéo est annotée avec la
          technique utilisée : timing, autodérision, observation, storytelling.
          Tu regardes, tu comprends le mécanisme, tu le reproduis.
        </p>
      </div>

      <Suspense fallback={null}>
        <VideosGrid />
      </Suspense>

      {/* Cross-linking SEO */}
      <nav className="mt-12 border-t border-border pt-8">
        <h2 className="font-display mb-4 text-xl font-bold">Continue ta progression</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <Link href="/vannes" className="rounded-lg border border-border bg-background-card p-4 transition-colors hover:border-accent-primary/40">
            <h3 className="text-sm font-semibold text-text-primary">Vannes et blagues drôles</h3>
            <p className="mt-1 text-xs text-text-secondary">Des centaines de vannes classées par catégorie, prêtes à ressortir.</p>
          </Link>
          <Link href="/conseils" className="rounded-lg border border-border bg-background-card p-4 transition-colors hover:border-accent-primary/40">
            <h3 className="text-sm font-semibold text-text-primary">Conseils de répartie</h3>
            <p className="mt-1 text-xs text-text-secondary">Techniques concrètes pour avoir de la répartie et devenir plus drôle.</p>
          </Link>
          <Link href="/parcours" className="rounded-lg border border-border bg-background-card p-4 transition-colors hover:border-accent-primary/40">
            <h3 className="text-sm font-semibold text-text-primary">Parcours structurés</h3>
            <p className="mt-1 text-xs text-text-secondary">Deviens drôle pas à pas avec des parcours de 3 à 6 semaines.</p>
          </Link>
        </div>
      </nav>
    </>
  );
}
