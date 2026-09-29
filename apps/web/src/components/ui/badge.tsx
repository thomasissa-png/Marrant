import { type HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex shrink-0 items-center whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-background-elevated text-text-secondary",
        primary: "bg-accent-primary/20 text-accent-link",
        secondary: "bg-accent-secondary/30 text-violet-200",
        success: "bg-success/20 text-success",
        error: "bg-error/20 text-error",
        premium:
          "bg-gradient-to-r from-accent-primary/20 to-accent-secondary/20 text-accent-link",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
