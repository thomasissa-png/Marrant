import { frTypo } from "@/lib/fr-typo";
import { ANCRE_CARNET_VENTE, avantagesPremium, RANG_AVANTAGE_CARNET } from "@/config/textes/avantages-premium";
import { LETTRE_HEBDO_PROMESSE } from "@/config/lettre-hebdo-promesse-temporaire";

/**
 * Composant UNIQUE des avantages Premium (trajet de conversion s21) : 3 lignes, 4 quand la
 * promesse de la lettre hebdomadaire est active. Texte lu dans `config/textes/avantages-premium.ts`,
 * rien en dur ici. Utilisé sur /abonnement seulement. Sans état : serveur ou client indifféremment.
 */
export function AvantagesPremium({
  className = "space-y-1 min-[400px]:space-y-2",
  lettre = LETTRE_HEBDO_PROMESSE,
  ancreCarnet = false,
}: {
  /** Finition du tour 3 : l'avantage du carnet mène au bloc « Le carnet, en vrai » (s'il est sur la page). */
  ancreCarnet?: boolean;
  className?: string;
  /** Promesse de la lettre (surchargée par les tests). */
  lettre?: boolean;
}) {
  return (
    <ul className={`${className} text-sm font-semibold min-[360px]:text-[15px] leading-snug text-text-primary`} data-testid="avantages-premium">
      {avantagesPremium(lettre).map((ligne, i) => (
        <li key={ligne} className="flex items-start gap-2">
          <span className="w-5 shrink-0 text-center text-success" aria-hidden="true">✓</span>
          {ancreCarnet && i === RANG_AVANTAGE_CARNET ? (
            // Lien discret (souligné pointillé) : même texte, vers l'exemple juste en dessous.
            <a
              href={`#${ANCRE_CARNET_VENTE}`}
              className="underline decoration-accent-link decoration-dotted decoration-2 underline-offset-4 hover:text-accent-link"
              data-testid="avantage-carnet-lien"
            >
              {frTypo(ligne)}
            </a>
          ) : (
            <span>{frTypo(ligne)}</span>
          )}
        </li>
      ))}
    </ul>
  );
}
