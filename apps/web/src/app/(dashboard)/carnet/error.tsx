"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function CarnetError({
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <Card>
        <CardContent className="py-12 text-center">
          <h2 className="font-display text-xl font-bold text-text-primary">
            Le carnet a raté son entrée en scène
          </h2>
          <p className="mt-2 text-sm text-text-secondary">
            Le souci vient de chez nous, pas de toi. Réessaie, ou va t&apos;entraîner sur les parcours.
          </p>
          <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Button variant="primary" size="sm" onClick={reset}>
              Réessayer
            </Button>
            <Link href="/parcours">
              <Button variant="outline" size="sm">
                Voir les parcours
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
