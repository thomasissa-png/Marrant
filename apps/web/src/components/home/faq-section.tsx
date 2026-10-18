import { faqs } from "@/lib/faqs";
import { frTypo } from "@/lib/fr-typo";
import { cn } from "@/lib/utils";
import { COLONNE_LECTURE, MESURE_TEXTE } from "@/components/layout/gabarit";
export { faqs };

export interface FaqItem {
  question: string;
  answer: string;
}

interface FaqSectionProps {
  /** Questions à afficher (par défaut : FAQ générale du site). */
  items?: readonly FaqItem[];
  title?: string;
  /**
   * "left" : pages catalogue et de lecture, pleine largeur de la colonne (mêmes bords que les blocs
   * voisins, revue visuelle s21). "center" : colonne de lecture centrée (accueil, abonnement).
   */
  align?: "center" | "left";
}

/**
 * FAQ en accordéon fermé (`<details>` natif, aucun état) : un seul composant pour toutes les pages.
 * s21 (QA m3) : plus de « use client » ; rendue par le serveur (accueil, listes), sans JS.
 * (passe s12 : UX T19/T46, design T11).
 */
export function FaqSection({ items = faqs, title = "Questions fréquentes", align = "center" }: FaqSectionProps = {}) {
  const left = align === "left";
  return (
    <div className={left ? undefined : COLONNE_LECTURE}>
      <h2
        className={cn(
          "font-display font-bold text-text-primary",
          left ? "mb-4 text-xl" : "mb-8 text-center text-2xl",
        )}
      >
        {title}
      </h2>
      <div className="space-y-4">
        {items.map((faq) => (
          <details
            key={faq.question}
            className="group rounded-xl border border-border bg-background-card"
          >
            <summary className="flex min-h-[44px] cursor-pointer list-none items-center justify-between gap-2 p-4 text-sm font-semibold text-text-primary [&::-webkit-details-marker]:hidden">
              {frTypo(faq.question)}
              <svg
                className="h-4 w-4 shrink-0 text-text-muted transition-transform group-open:rotate-180"
                aria-hidden="true"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <p className={cn("px-4 pb-4 text-sm text-text-secondary", MESURE_TEXTE)}>{faq.answer}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
