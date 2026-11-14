import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { NOT_FOUND_ROBOTS } from "@/lib/seo-meta";

/**
 * Head de toute 404 sans not-found.tsx plus proche (/nimporte-quoi, /vannes/…,
 * /conseils/…, /videos/…, /blog/…) : une seule balise robots (`noindex` de Next),
 * plus de « index, follow » ni de `bingbot: index` hérités du layout racine.
 */
export const metadata: Metadata = { title: "Page introuvable", ...NOT_FOUND_ROBOTS };

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <span className="text-8xl" role="img" aria-label="visage perplexe">
        🤔
      </span>
      <h1 className="mt-6 font-display text-4xl font-bold md:text-5xl">
        Oups, cette page a oublié sa{" "}
        <span className="text-gradient">punchline</span>
      </h1>
      <p className="mt-4 max-w-md text-lg text-text-secondary">
        Cette page n’existe pas, ou plus. Les vannes, elles, sont toujours là.
      </p>
      {/* Lot D11c (revue d'harmonie, défaut 6) : à 375 px, l'un sous l'autre et de même largeur (chaque libellé
          sur une ligne) ; côte à côte dès 640 px. Emoji gardé (décision de Thomas). */}
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4">
        <Link href="/" className="w-full sm:w-auto">
          <Button variant="primary" size="lg" className="w-full">
            Retour à l’accueil
          </Button>
        </Link>
        <Link href="/vannes" className="w-full sm:w-auto">
          <Button variant="outline" size="lg" className="w-full">
            Voir les vannes
          </Button>
        </Link>
      </div>
    </main>
  );
}
