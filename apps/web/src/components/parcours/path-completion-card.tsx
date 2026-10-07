"use client";

import { forwardRef, useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { PREMIUM_PARCOURS } from "@/config/premium";
import { FIN_PARCOURS } from "@/config/textes/parcours";

interface ApiPath {
  slug: string;
  title: string;
  progress?: { completedAt: string | null } | null;
}

type Suite =
  | { kind: "chargement" }
  | { kind: "parcours"; slug: string; nom: string }
  | { kind: "tout-fini" };

function nomCourt(slug: string, titre: string): string {
  return PREMIUM_PARCOURS.find((p) => p.slug === slug)?.name ?? titre.replace(/^Parcours\s+/i, "");
}

/**
 * Suite non circulaire (UX-06) : premier parcours actif non terminé, dans
 * l'ordre du catalogue ; si tout est fini, le carnet du mois. Si la liste ne
 * se charge pas, repli sur le parcours suivant du seed.
 */
export function pickSuite(paths: ApiPath[], currentSlug: string): Suite {
  const next = paths.find((p) => p.slug !== currentSlug && !p.progress?.completedAt);
  return next ? { kind: "parcours", slug: next.slug, nom: nomCourt(next.slug, next.title) } : { kind: "tout-fini" };
}

/**
 * Bilan de fin (étalon 3.6 A validé) : titre, phrase maison, XP réels bonus
 * compris, ce qu'on sait faire, défis essayés (si au moins 1), suite.
 */
export const PathCompletionCard = forwardRef<
  HTMLHeadingElement,
  {
    slug: string;
    title: string;
    totalXp: number;
    stepTitles: string[];
    /** Retours d'exercice par étape (3 valeurs fermées). */
    retours: Record<number, string>;
    nextParcours?: string | null;
    nextParcoursReason?: string | null;
  }
>(function PathCompletionCard({ slug, title, totalXp, stepTitles, retours, nextParcours, nextParcoursReason }, ref) {
  const [suite, setSuite] = useState<Suite>({ kind: "chargement" });

  useEffect(() => {
    let cancelled = false;
    const fallback: Suite = nextParcours
      ? { kind: "parcours", slug: nextParcours, nom: nomCourt(nextParcours, nextParcours) }
      : { kind: "tout-fini" };
    fetch("/api/parcours")
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { paths?: ApiPath[] } | null) => {
        if (cancelled) return;
        setSuite(data?.paths ? pickSuite(data.paths, slug) : fallback);
      })
      .catch(() => {
        if (!cancelled) setSuite(fallback);
      });
    return () => {
      cancelled = true;
    };
  }, [slug, nextParcours]);

  const valeurs = Object.values(retours);
  const essayes = valeurs.filter((r) => r === "essaye-bof" || r === "essaye-ca-a-marche").length;
  const reussis = valeurs.filter((r) => r === "essaye-ca-a-marche").length;

  return (
    <Card className="mt-8 border-accent-primary/30 bg-accent-primary/5">
      <CardContent className="py-8 text-center">
        <h2 ref={ref} tabIndex={-1} className="font-display text-2xl font-bold focus:outline-none">
          {FIN_PARCOURS.titre(title)}
        </h2>
        <p className="mx-auto mt-2 max-w-md text-text-secondary">{FIN_PARCOURS.sousTitre}</p>
        <p className="mt-4 text-sm font-medium text-accent-link">{FIN_PARCOURS.xp(stepTitles.length, totalXp)}</p>
        {stepTitles.length > 0 && (
          <div className="mx-auto mt-4 max-w-md text-left">
            <p className="text-sm font-semibold text-text-primary">{FIN_PARCOURS.acquis}</p>
            <ul className="mt-1 list-disc pl-5 text-sm text-text-secondary">
              {stepTitles.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </div>
        )}
        {essayes >= 1 && <p className="mt-3 text-sm text-text-secondary">{FIN_PARCOURS.exercices(essayes, reussis)}</p>}
        {suite.kind === "parcours" && (
          <div className="mt-6">
            {suite.slug === nextParcours && nextParcoursReason && (
              <p className="text-sm text-text-secondary">{nextParcoursReason}</p>
            )}
            <Link
              href={`/parcours/${suite.slug}?src=suite`}
              className={`${buttonVariants({ variant: "primary", size: "lg" })} mt-3`}
            >
              {FIN_PARCOURS.suite(suite.nom)}
            </Link>
          </div>
        )}
        {suite.kind === "tout-fini" && (
          <p className="mt-6 text-sm text-text-secondary">
            {FIN_PARCOURS.carnetAvant}
            <Link href="/carnet" className="text-accent-link underline underline-offset-2">
              {FIN_PARCOURS.carnet}
            </Link>
            .
          </p>
        )}
      </CardContent>
    </Card>
  );
});
