"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CONTACT_EMAIL } from "@/config/textes/paiement";
import { TEXTES_RESILIATION as T } from "@/config/textes/resiliation";

/**
 * Erreur de rendu de /resiliation et /resiliation/confirmee. Pas de `loading.tsx` dans ce segment :
 * il ferait streamer un 200 avant `notFound()` (interrupteur fermé) et `redirect()` (connexion),
 * comme la régression s17 des parcours (QA-11). Textes repris de la copie validée (§1 et §3).
 */
export default function ResiliationError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="mx-auto max-w-xl">
      <h1 className="font-display text-3xl font-bold md:text-4xl">{T.titre}</h1>
      <Card role="alert" className="mt-6 p-5 hover:border-border md:p-6">
        <p className="text-text-primary">Ça n’a pas marché de notre côté.</p>
        <p className="mt-1 text-sm text-text-secondary">
          Une question sur ta résiliation :{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} className="text-accent-link underline underline-offset-4">
            {CONTACT_EMAIL}
          </a>
          .
        </p>
        <Button variant="primary" size="lg" className="mt-4 w-full sm:w-auto" onClick={reset}>
          {T.reessayer}
        </Button>
      </Card>
    </div>
  );
}
