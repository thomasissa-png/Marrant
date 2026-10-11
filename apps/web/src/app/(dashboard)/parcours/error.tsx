"use client";

import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PAGES_ETAT } from "@/config/textes/parcours";

/** Erreur de la liste /parcours (FS-13 a) : plus l'écran générique de Next. */
export default function ParcoursListError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <Card>
        <CardContent className="py-12 text-center">
          <h1 className="font-display text-xl font-bold text-text-primary">{PAGES_ETAT.erreurListeTitre}</h1>
          <p className="mt-2 text-sm text-text-secondary">{PAGES_ETAT.erreurTexte}</p>
          <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Button variant="primary" size="sm" onClick={reset}>
              Réessayer
            </Button>
            <Link href="/" className={buttonVariants({ variant: "outline", size: "sm" })}>
              Retour à l&apos;accueil
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
