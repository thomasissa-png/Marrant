"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Chargement } from "@/components/ui/chargement";
import { trackUmami } from "@/lib/umami";
import { RESILIATION_GARDER_HREF } from "@/config/resiliation";
import { TEXTES_RESILIATION as T } from "@/config/textes/resiliation";

/**
 * Barre d'action collée en bas (spec design §6) : fond OPAQUE, zone de sécurité iOS, bouton plein
 * « Confirmer la résiliation » puis lien discret « Garder mon abonnement » (ordre DOM = tabulation).
 * Le bouton n'est jamais `disabled` (il serait grisé) : pendant l'envoi, `aria-disabled` + clics ignorés.
 */
export function BarreConfirmation({ envoi, lent, reessayer }: { envoi: boolean; lent: boolean; reessayer: boolean }) {
  return (
    <div className="sticky bottom-0 z-20 -mx-4 mt-8 border-t border-border bg-background px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 sm:mx-0 sm:px-0">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-6">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          aria-disabled={envoi || undefined}
          className={envoi ? "w-full cursor-wait sm:w-auto" : "w-full sm:w-auto"}
        >
          {envoi ? <Chargement texte={T.envoi} /> : reessayer ? T.reessayer : T.confirmer}
        </Button>
        <Link
          href={RESILIATION_GARDER_HREF}
          onClick={() => trackUmami("resiliation-gardee")}
          className="inline-flex min-h-11 items-center justify-center text-sm text-text-secondary underline underline-offset-4 hover:text-text-primary focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-link focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          {T.garder}
        </Link>
      </div>
      <p role="status" aria-live="polite" className="text-sm text-text-secondary empty:hidden">
        {envoi && lent ? T.lent : ""}
      </p>
      <span className="sr-only" aria-live="polite">
        {envoi ? T.envoi : ""}
      </span>
    </div>
  );
}
