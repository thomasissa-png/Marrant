import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

/**
 * Langue des cartes de l'accueil (v6 tour 1, arbitrage 1) : reprise exacte de la carte de
 * `home/daily-content.tsx`, `overflow-hidden rounded-xl` et un filet `h-1` dégradé violet en tête.
 * `CARTE_A_FILET` + `<FiletCarte />` pour un élément qui n'est pas une `Card` (lien, section).
 */
export const CARTE_A_FILET = "relative overflow-hidden rounded-xl";
export const FILET_CARTE =
  "pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-accent-primary to-accent-secondary";

/**
 * s26 (Parcours et Vannes, décision de Thomas du 18/11 étendue à ces pages) : filet masqué par une classe du parent,
 * sans retirer le `<span data-filet>` du HTML serveur (pages publiques : seuls les attributs `class` changent).
 */
export const FILET_MASQUE = "[&>[data-filet]]:hidden";

export function FiletCarte() {
  return <span aria-hidden="true" data-filet="" className={FILET_CARTE} />;
}

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Carte à filet (langue de l'accueil). Absent ou faux : la carte d'avant, au caractère près. */
  filet?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, filet = false, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-lg border border-border bg-background-card p-4 transition-colors duration-200 hover:border-border-hover",
        filet && CARTE_A_FILET,
        className
      )}
      {...props}
    >
      {filet && <FiletCarte />}
      {children}
    </div>
  )
);
Card.displayName = "Card";

const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex flex-col space-y-1.5 pb-4", className)}
      {...props}
    />
  )
);
CardHeader.displayName = "CardHeader";

const CardTitle = forwardRef<
  HTMLHeadingElement,
  HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("font-display text-lg font-bold text-text-primary", className)}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardDescription = forwardRef<
  HTMLParagraphElement,
  HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-text-secondary", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("", className)} {...props} />
  )
);
CardContent.displayName = "CardContent";

const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex items-center pt-4", className)}
      {...props}
    />
  )
);
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
