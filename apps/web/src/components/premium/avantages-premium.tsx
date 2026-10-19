import { frTypo } from "@/lib/fr-typo";
import { avantagesPremium } from "@/config/textes/avantages-premium";
import { LETTRE_HEBDO_PROMESSE } from "@/config/lettre-hebdo-promesse-temporaire";

/**
 * Composant UNIQUE des avantages Premium (trajet de conversion s21) : 3 lignes, 4 quand la
 * promesse de la lettre hebdomadaire est active. Texte lu dans `config/textes/avantages-premium.ts`,
 * rien en dur ici. Utilisé sur /abonnement seulement. Sans état : serveur ou client indifféremment.
 */
export function AvantagesPremium({
  className = "space-y-2",
  lettre = LETTRE_HEBDO_PROMESSE,
}: {
  className?: string;
  /** Promesse de la lettre (surchargée par les tests). */
  lettre?: boolean;
}) {
  return (
    <ul className={`${className} text-[15px] font-semibold leading-snug text-text-primary`} data-testid="avantages-premium">
      {avantagesPremium(lettre).map((ligne) => (
        <li key={ligne} className="flex items-start gap-2">
          <span className="w-5 shrink-0 text-center text-success" aria-hidden="true">✓</span>
          <span>{frTypo(ligne)}</span>
        </li>
      ))}
    </ul>
  );
}
