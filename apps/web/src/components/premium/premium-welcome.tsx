"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { PREMIUM_WELCOME_PARAM, PREMIUM_WELCOME_VALUE } from "@/config/premium";
import { OFFRE_NOM } from "@/config/textes/offre";
import { BIENVENUE_PREMIUM } from "@/config/textes/abonnement-vente";
import { frTypo } from "@/lib/fr-typo";
import { LETTRE_HEBDO_PROMESSE } from "@/config/lettre-hebdo-promesse-temporaire";
import { useParcoursAReprendre } from "@/hooks/use-parcours-a-reprendre";
import { FAVORI_PARAM, lireDrapeauFavori } from "@/lib/favori-apres-paiement";

/**
 * Message de bienvenue après paiement (décision Thomas, 03/10/2026) : affiché
 * sur la page de retour (intention d'origine ou /parcours) quand l'URL porte
 * `?premium=bienvenue` (posé par /abonnement/success). Fermable.
 * Texte (textes-trajet-v3 BV1 à BV3) : favori ajouté (drapeau `favori=JOKE|TIP|VIDEO`, posé par
 * /abonnement/success seulement si l'ajout a réussi), sinon progression à reprendre, sinon défaut.
 */
export function PremiumWelcome() {
  const searchParams = useSearchParams();
  const [dismissed, setDismissed] = useState(false);

  if (dismissed || searchParams?.get(PREMIUM_WELCOME_PARAM) !== PREMIUM_WELCOME_VALUE) {
    return null;
  }
  return <Bienvenue favori={lireDrapeauFavori(searchParams?.get(FAVORI_PARAM))} onClose={() => setDismissed(true)} />;
}

/** Bannière affichée : la progression n'est lue (`/api/user/progress`) qu'à ce moment-là. */
function Bienvenue({ favori, onClose }: { favori: ReturnType<typeof lireDrapeauFavori>; onClose: () => void }) {
  const aReprendre = useParcoursAReprendre();
  const texte = favori ? BIENVENUE_PREMIUM.favori[favori] : aReprendre ? BIENVENUE_PREMIUM.reprise : BIENVENUE_PREMIUM.texte;

  return (
    <div
      role="status"
      className="mb-6 flex items-start justify-between gap-3 rounded-xl border border-accent-primary/40 bg-accent-primary/10 p-4"
    >
      <div>
        <p className="font-semibold text-text-primary">Bienvenue dans {OFFRE_NOM}</p>
        <p className="mt-1 text-sm text-text-secondary" data-testid="bienvenue-texte">{frTypo(texte)}</p>
        {LETTRE_HEBDO_PROMESSE && <p className="mt-1 text-sm text-text-secondary">{frTypo(BIENVENUE_PREMIUM.lettre)}</p>}
      </div>
      <button
        type="button"
        onClick={onClose}
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-text-muted hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary"
        aria-label="Fermer le message de bienvenue"
      >
        <span aria-hidden="true">×</span>
      </button>
    </div>
  );
}
