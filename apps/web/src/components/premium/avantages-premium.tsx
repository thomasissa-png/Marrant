import { frTypo } from "@/lib/fr-typo";
import { AVANTAGES_PREMIUM } from "@/config/textes/avantages-premium";

/**
 * Composant UNIQUE des avantages Premium (s21 concision v5) : 4 lignes, texte lu dans
 * `AVANTAGES_PREMIUM` (config/textes/avantages-premium.ts), rien en dur ici. Utilisé sur
 * /abonnement seulement. Sans état ni compteur : composant serveur ou client indifféremment.
 */
export function AvantagesPremium({ className = "space-y-3" }: { className?: string }) {
  return (
    <ul className={`${className} text-sm text-text-secondary`} data-testid="avantages-premium">
      {AVANTAGES_PREMIUM.map((ligne) => (
        <li key={ligne} className="flex items-start gap-2">
          <span className="mt-0.5 text-success" aria-hidden="true">✓</span>
          <span>{frTypo(ligne)}</span>
        </li>
      ))}
    </ul>
  );
}
