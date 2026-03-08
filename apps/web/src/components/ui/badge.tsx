import { type HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-background-elevated text-text-secondary",
        yellow: "bg-accent-yellow/20 text-accent-yellow",
        violet: "bg-accent-violet/20 text-accent-violet",
        success: "bg-success/20 text-success",
        error: "bg-error/20 text-error",
        premium:
          "bg-gradient-to-r from-accent-yellow/20 to-accent-violet/20 text-accent-yellow",
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
