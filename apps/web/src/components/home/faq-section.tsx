import { faqs } from "@/lib/faqs";
import { PREMIUM_PRICE_LABEL } from "@/config/premium";
import { ESPACE_CLIENT_PUBLIE } from "@/config/espace-client";
import { MasqueSiPremium } from "@/components/home/masque-si-premium";
import { frTypo } from "@/lib/fr-typo";
import { cn } from "@/lib/utils";
import { COLONNE_LECTURE, MESURE_TEXTE } from "@/components/layout/gabarit";
import { TEXTE, TEXTE_FORT, TITRE_CARTE } from "@/components/espace/typo";
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
  /**
   * v6 tour 5, arbitrage 1 (/parcours, interrupteur ouvert) : avec `align="left"`, titre centré comme l'accueil,
   * même taille et même marge ; les questions gardent la pleine largeur de la colonne. Absent : inchangé.
   */
  titreCentre?: boolean;
  /**
   * s26 (/parcours et /vannes, interrupteur ouvert seulement, `docs/design/parcours-vannes-s26.md` §3.4) : titre à
   * gauche sur 4 colonnes, questions sur 8 dès 1024 px, séparateurs au lieu des cadres. Classes seules : mêmes
   * éléments, mêmes textes. Absent : inchangé.
   */
  disposition?: "split";
}

/**
 * FAQ en accordéon fermé (`<details>` natif, aucun état) : un seul composant pour toutes les pages.
 * s21 (QA m3) : plus de « use client » ; rendue par le serveur (accueil, listes), sans JS.
 * (passe s12 : UX T19/T46, design T11).
 */
export function FaqSection({ items, title = "Questions fréquentes", align = "center", titreCentre = false, disposition }: FaqSectionProps = {}) {
  const left = align === "left";
  const split = disposition === "split";
  const liste = items ?? faqs;
  // Décision de Thomas du 14/11, interrupteur de l'espace ouvert : dans la FAQ de /parcours (seule page qui prend la
  // liste par défaut, sans `items`), la question du prix (« {prix}, c'est vraiment tout ? ») n'est pas montrée à
  // l'abonné : masquée dans le navigateur, HTML serveur et données structurées inchangés. Fermé : rien ne change.
  const prixMasqueAbonne = ESPACE_CLIENT_PUBLIE && items === undefined;
  return (
    <div className={split ? "lg:grid lg:grid-cols-12 lg:gap-6" : left ? undefined : COLONNE_LECTURE}>
      <h2
        className={split ? cn(TITRE_CARTE, "mb-4 lg:col-span-4 lg:mb-0") : cn(
          "font-display font-bold text-text-primary",
          // Revue visuelle s21 (R29) : titre secondaire, même taille que « Derniers articles » et la lettre.
          left ? (titreCentre ? "mb-4 text-center text-xl" : "mb-4 text-xl") : "mb-8 text-center text-xl md:text-2xl",
        )}
      >
        {title}
      </h2>
      <div className={split ? "divide-y divide-border border-y border-border lg:col-span-8" : "space-y-4"}>
        {liste.map((faq) => {
          const details = (
          <details
            key={faq.question}
            className={split ? "group" : "group rounded-xl border border-border bg-background-card"}
          >
            <summary
              className={split
                ? cn("flex min-h-12 cursor-pointer list-none items-center justify-between gap-4 py-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary [&::-webkit-details-marker]:hidden", TEXTE_FORT)
                : "flex min-h-[44px] cursor-pointer list-none items-center justify-between gap-2 p-4 text-sm font-semibold text-text-primary [&::-webkit-details-marker]:hidden"}
            >
              {frTypo(faq.question)}
              <svg
                className={split ? "h-4 w-4 shrink-0 text-text-secondary transition-transform group-open:rotate-180" : "h-4 w-4 shrink-0 text-text-muted transition-transform group-open:rotate-180"}
                aria-hidden="true"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <p className={split ? cn("pb-4", TEXTE, MESURE_TEXTE) : cn("px-4 pb-4 text-sm text-text-secondary", MESURE_TEXTE)}>{frTypo(faq.answer)}</p>
          </details>
          );
          return prixMasqueAbonne && faq.question.startsWith(PREMIUM_PRICE_LABEL) ? (
            <MasqueSiPremium key={faq.question}>{details}</MasqueSiPremium>
          ) : (
            details
          );
        })}
      </div>
    </div>
  );
}
