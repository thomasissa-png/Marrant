import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PAGES_ETAT } from "@/config/textes/parcours";

/**
 * Parcours inconnu (QA-11, SEO-11) : 404 rendue dans le layout du site (menu
 * et pied de page), avec le chemin vers les parcours. La consigne robots
 * `noindex` vient de generateMetadata (une seule, plus de « index, follow »).
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
