import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface EmptyStateProps {
  emoji: string;
  emojiLabel: string;
  title: string;
  description?: string;
  ctaLabel?: string;
  ctaHref?: string;
}

export function EmptyState({ emoji, emojiLabel, title, description, ctaLabel, ctaHref }: EmptyStateProps) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center py-12 text-center">
        <span className="text-5xl" role="img" aria-label={emojiLabel}>
          {emoji}
        </span>
        <p className="mt-4 text-lg font-medium text-text-primary">{title}</p>
        {description && (
          <p className="mt-2 max-w-sm text-sm text-text-secondary">{description}</p>
        )}
        {ctaLabel && ctaHref && (
          <Link href={ctaHref} className="mt-4">
            <Button variant="primary" size="sm">
              {ctaLabel}
            </Button>
          </Link>
        )}
      </CardContent>
    </Card>
  );
}
