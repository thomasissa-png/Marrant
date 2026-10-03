"use client";

import { useContentStats } from "@/hooks/use-content-stats";
import { PREMIUM_PARCOURS } from "@/config/premium";

/**
 * Liste unique des avantages Premium (page /abonnement, modale Premium,
 * carte d'accueil). Décision Thomas du 03/10/2026 : uniquement des puces
 * vraies. Les parcours complets sont la valeur principale ; « contenu
 * quotidien » (gratuit pour tous) et « filtres avancés » (inexistants) sont
 * retirés. Aucun contenu mensuel promis tant qu'il n'existe pas.
 */
export function PremiumBenefits({ className = "space-y-3" }: { className?: string }) {
  const stats = useContentStats();
  const parcoursList = PREMIUM_PARCOURS.map((p) => `${p.name} (${p.timePerWeek})`).join(", ");
  const counts = [
    stats.jokes > 0 ? `${stats.jokes}+ vannes` : null,
    stats.tips > 0 ? `${stats.tips}+ conseils` : null,
    stats.videos > 0 ? `${stats.videos}+ vidéos analysées` : null,
  ].filter(Boolean);

  return (
    <ul className={`${className} text-sm text-text-secondary`}>
      <li className="flex items-start gap-2">
        <span className="mt-0.5 text-success" aria-hidden="true">✓</span>
        <span>
          <strong>Les 3 parcours en entier</strong> : {parcoursList}. Chaque étape avec son
          conseil, ses vannes, ses vidéos et son quiz. La première étape de chaque parcours est offerte.
        </span>
      </li>
      <li className="flex items-start gap-2">
        <span className="mt-0.5 text-success" aria-hidden="true">✓</span>
        <span>
          <strong>Tes favoris</strong> : garde sous la main les vannes, conseils et vidéos à ressortir.
        </span>
      </li>
      <li className="flex items-start gap-2">
        <span className="mt-0.5 text-success" aria-hidden="true">✓</span>
        <span>
          <strong>Les listes complètes</strong>
          {counts.length > 0 ? ` (${counts.join(", ")})` : ""}, au lieu de 10 vannes, 3 conseils et
          3 vidéos en compte gratuit, avec le filtre par catégorie des vannes.
        </span>
      </li>
    </ul>
  );
}
