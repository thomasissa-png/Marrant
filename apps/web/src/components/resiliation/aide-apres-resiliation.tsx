"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CLE_REPONSE_SESSION, RESILIATION_CODES, type RaisonResiliation } from "@/config/resiliation";
import { AIDES_APRES_RESILIATION, TEXTES_RESILIATION_CONFIRMEE as T } from "@/config/textes/resiliation";

type RaisonAvecAide = keyof typeof AIDES_APRES_RESILIATION;

/** Première raison (ordre de la liste) qui a une ligne d'aide ; « autre » ou mot seul : aucune. */
export function raisonPourAide(raisons: readonly string[]): RaisonAvecAide | null {
  const premiere = RESILIATION_CODES.find((code) => raisons.includes(code));
  if (!premiere || premiere === "autre") return null;
  return premiere as Exclude<RaisonResiliation, "autre">;
}

/**
 * Page finale : « Merci d'avoir répondu. » seulement si une raison ou un mot a été donné, puis une
 * seule ligne d'aide selon la première raison cochée (textes §2). Réponse lue dans la mémoire de
 * l'onglet (jamais dans l'URL), effacée après lecture : un rechargement n'affiche plus rien.
 */
export function AideApresResiliation({ dateFin }: { dateFin: string | null }) {
  const [reponse, setReponse] = useState<{ raisons: string[]; repondu: boolean } | null>(null);

  useEffect(() => {
    try {
      const brut = sessionStorage.getItem(CLE_REPONSE_SESSION);
      if (!brut) return;
      sessionStorage.removeItem(CLE_REPONSE_SESSION);
      const lu = JSON.parse(brut) as { raisons?: unknown; repondu?: unknown };
      const raisons = Array.isArray(lu.raisons) ? lu.raisons.filter((r): r is string => typeof r === "string") : [];
      setReponse({ raisons, repondu: lu.repondu === true });
    } catch {
      // Mémoire illisible : rien à afficher.
    }
  }, []);

  if (!reponse?.repondu) return null;
  const code = raisonPourAide(reponse.raisons);
  const aide = code ? AIDES_APRES_RESILIATION[code] : null;
  const avant = aide?.avant.replace("{dateFin}", dateFin ?? "").replace("Après le , ", "Après la fin du contrat, ") ?? "";
  const lien = "text-accent-link underline underline-offset-4 hover:text-text-primary focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-link";

  return (
    <div className="mt-4 space-y-2 text-sm text-text-secondary">
      <p>{T.merci}</p>
      {aide && (
        <p>
          {avant}
          {aide.href.startsWith("mailto:") ? (
            <a href={aide.href} className={lien}>
              {aide.lien}
            </a>
          ) : (
            <Link href={aide.href} className={lien}>
              {aide.lien}
            </Link>
          )}
          {aide.apres}
        </p>
      )}
    </div>
  );
}
