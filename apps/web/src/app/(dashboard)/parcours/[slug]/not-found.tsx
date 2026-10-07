import type { Metadata } from "next";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PAGES_ETAT } from "@/config/textes/parcours";
import { NOT_FOUND_ROBOTS } from "@/lib/seo-meta";

/**
 * Head de la 404 : Next 14 n'y lit pas generateMetadata de la page, seulement les
 * layouts et cette metadata. `robots: null` retire le « index, follow » hérité du
 * layout racine : il ne reste que le `noindex` posé par Next (une seule balise) ;
 * le `bingbot: index` du layout est neutralisé aussi (NOT_FOUND_ROBOTS).
 */
export const metadata: Metadata = { title: "Parcours introuvable", ...NOT_FOUND_ROBOTS };

/**
 * Parcours inconnu (QA-11, SEO-11) : 404 rendue dans le layout du site (menu
 * et pied de page), avec le chemin vers les parcours. Pas de loading.tsx au
 * niveau de [slug] ni au-dessus : il ferait streamer la page en 200 avant
 * notFound() (régression s17, voir parcours/(liste)/loading.tsx).
 */
export default function ParcoursNotFound() {
  return (
    <div className="mx-auto max-w-3xl py-12">
      <Card>
        <CardContent className="py-12 text-center">
          <h1 className="font-display text-2xl font-bold text-text-primary">{PAGES_ETAT.introuvableTitre}</h1>
          <p className="mt-2 text-sm text-text-secondary">{PAGES_ETAT.introuvableTexte}</p>
          <Link href="/parcours" className={`${buttonVariants({ variant: "primary" })} mt-6`}>
            {PAGES_ETAT.voirParcours}
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
