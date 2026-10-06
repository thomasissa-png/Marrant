"use client";

import { useContentStats } from "@/hooks/use-content-stats";
import {
  FREE_JOKE_LIMIT,
  FREE_TIP_LIMIT,
  FREE_VIDEO_LIMIT,
  PARCOURS_COUNT,
  PREMIUM_PARCOURS,
} from "@/config/premium";

/**
 * Liste unique des avantages Premium (page /abonnement, modale Premium,
 * carte d'accueil). Décision Thomas du 03/10/2026 : uniquement des puces
 * vraies. Les parcours complets sont la valeur principale ; « contenu
 * quotidien » (gratuit pour tous) et « filtres avancés » (inexistants) sont
 * retirés. Le carnet mensuel (page /carnet) est ajouté le 03/10/2026, une
 * fois le premier carnet écrit.
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
          <strong>Les {PARCOURS_COUNT} parcours en entier</strong> : {parcoursList}. Chaque étape avec son
          conseil, ses vannes, ses vidéos et son quiz. La première étape de chaque parcours est offerte.
        </span>
      </li>
      <li className="flex items-start gap-2">
        <span className="mt-0.5 text-success" aria-hidden="true">✓</span>
        <span>
          <strong>Le carnet mensuel de situations de répartie</strong> (nouveau chaque mois) :
          ce qu&apos;on te dit, quoi répondre, pourquoi ça marche et quoi faire si ça se tend.
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
          {counts.length > 0 ? ` (${counts.join(", ")})` : ""}, au lieu de {FREE_JOKE_LIMIT} vannes,{" "}
          {FREE_TIP_LIMIT} conseils et {FREE_VIDEO_LIMIT} vidéos sans abonnement, avec le filtre par catégorie des vannes.
        </span>
      </li>
    </ul>
  );
}
