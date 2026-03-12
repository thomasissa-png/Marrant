import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  message = "Oups, on a raté notre entrée.",
  onRetry,
}: ErrorStateProps) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center py-12 text-center">
        <span className="text-5xl" role="img" aria-label="erreur">
          😵
        </span>
        <p className="mt-4 text-lg font-medium text-text-primary">{message}</p>
        <p className="mt-2 text-sm text-text-secondary">
          Pas de panique, même les meilleurs humoristes ratent des blagues.
        </p>
        {onRetry && (
          <Button variant="primary" size="sm" className="mt-4" onClick={onRetry}>
            Réessayer
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
