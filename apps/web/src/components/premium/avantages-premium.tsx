"use client";

import { useContentStats } from "@/hooks/use-content-stats";
import { AVANTAGES_COMPTEURS, AVANTAGES_PREMIUM } from "@/config/textes/avantages-premium";

/**
 * Composant UNIQUE des avantages Premium (s21 concision, choix de Thomas du 18/10) :
 * 4 lignes, texte lu dans `AVANTAGES_PREMIUM` (config/textes/avantages-premium.ts), rien
 * en dur ici. Utilisé sur /abonnement et la carte Premium de l'accueil ; retiré du mur
 * du carnet (étalon 4 : « Enlevé : les 4 avantages »).
 */
export function AvantagesPremium({ className = "space-y-3" }: { className?: string }) {
  const stats = useContentStats();
  const compteurs = [
    stats.jokes > 0 ? `${stats.jokes}+ vannes` : null,
    stats.tips > 0 ? `${stats.tips}+ conseils` : null,
    stats.videos > 0 ? `${stats.videos}+ vidéos analysées` : null,
  ].filter(Boolean);
  const remplacement = compteurs.length > 0 ? ` (${compteurs.join(", ")})` : "";

  return (
    <ul className={`${className} text-sm text-text-secondary`} data-testid="avantages-premium">
      {AVANTAGES_PREMIUM.map(({ fort, suite }) => (
        <li key={fort} className="flex items-start gap-2">
          <span className="mt-0.5 text-success" aria-hidden="true">✓</span>
          <span>
            <strong>{fort}</strong>
            {suite.replace(AVANTAGES_COMPTEURS, remplacement)}
          </span>
        </li>
      ))}
    </ul>
  );
}
