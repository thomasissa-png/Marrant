"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { trackUmami } from "@/lib/umami";

export default function ParcoursError({
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  const params = useParams<{ slug?: string }>();
  const slug = typeof params?.slug === "string" ? params.slug : "";
  // data-analyst §5.1 : erreur visible par l'utilisateur, sans détail technique.
  useEffect(() => {
    if (slug) trackUmami("parcours-erreur", { parcours: slug, etape: 0, motif: "serveur" });
  }, [slug]);
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <Card>
        <CardContent className="py-12 text-center">
          <h1 className="font-display text-xl font-bold text-text-primary">
            Ce parcours a raté son entrée en scène
          </h1>
          <p className="mt-2 text-sm text-text-secondary">
            Le souci vient de chez nous, pas de toi. Réessaie, ou retourne à la liste des parcours.
          </p>
          <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Button variant="primary" size="sm" onClick={reset}>
              Réessayer
            </Button>
            <Link href="/parcours" className={buttonVariants({ variant: "outline", size: "sm" })}>
              Voir tous les parcours
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
