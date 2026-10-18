import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-lg font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          // s21 (revue design P2-6) : anneau #A78BFA (≈ 7:1 sur carte), l'ancien #7C3AED faisait 2,9:1 (WCAG 1.4.11).
          "bg-accent-secondary-hover text-white hover:bg-accent-secondary focus-visible:ring-accent-link",
        /** @deprecated Violet plein, lu comme un niveau 1 : utiliser `primary` (Premium) ou `outline-accent` (niveau 2). */
        secondary:
          "bg-accent-secondary text-white hover:bg-accent-secondary-hover focus-visible:ring-accent-secondary",
        ghost:
          "text-text-secondary hover:bg-background-elevated hover:text-text-primary focus-visible:ring-accent-primary",
        /** Utilitaire seulement (annuler, retour, voir tout) : bordure neutre. */
        outline:
          "border border-border text-text-primary hover:bg-background-elevated hover:border-border-hover focus-visible:ring-accent-primary",
        /**
         * Niveau 2, UNIQUE variante (revue design s21 M3) : toute action gratuite qui
         * entre dans le produit (étape 1 d'un parcours, lettre, extrait du carnet).
         * Bordure violette à 80 % (environ 3,2:1 sur le fond, WCAG 1.4.11). Le niveau 1
         * (`primary`, plein) reste réservé à Premium. Aucune surcharge locale de bordure.
         */
        "outline-accent":
          "border border-accent-primary/80 text-text-primary hover:bg-background-elevated hover:border-accent-primary focus-visible:ring-accent-primary",
        danger:
          "bg-error text-white hover:bg-error/90 focus-visible:ring-error",
      },
      size: {
        sm: "h-8 px-3 text-sm max-md:h-11",
        md: "h-10 px-4 text-sm max-md:h-11",
        lg: "h-12 px-6 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
