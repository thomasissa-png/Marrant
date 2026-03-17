"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function ParcoursError({
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <Card>
        <CardContent className="py-12 text-center">
          <h2 className="font-display text-xl font-bold text-text-primary">
            Impossible de charger ce parcours
          </h2>
          <p className="mt-2 text-sm text-text-secondary">
            Une erreur est survenue. Tu peux réessayer ou retourner à la liste des parcours.
          </p>
          <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Button variant="primary" size="sm" onClick={reset}>
              Réessayer
            </Button>
            <Link href="/parcours">
              <Button variant="outline" size="sm">
                Voir tous les parcours
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
