import type { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Parcours — Bientôt disponible",
  description: "Les parcours d'apprentissage structurés arrivent bientôt sur deviensmarrant.fr.",
};

export default function ParcoursPage() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Card className="mx-auto max-w-lg text-center">
        <CardContent className="py-12">
          <Badge variant="primary" className="mb-4">
            Bientôt disponible
          </Badge>
          <h1 className="font-display text-3xl font-bold">
            Les parcours arrivent bientôt
          </h1>
          <p className="mx-auto mt-3 max-w-md text-text-secondary">
            Des programmes pas à pas pour progresser de zéro à l&apos;aise en
            humour. Inscris-toi pour être prévenu dès le lancement.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link href="/register">
              <Button variant="primary" size="lg">
                Commencer — 0,99 €/mois
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline" size="lg">
                Retour à l&apos;accueil
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
