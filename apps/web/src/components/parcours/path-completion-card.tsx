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
  personaTagline?: string | null;
  progress?: { completedSteps?: number[]; completedAt: string | null; lastActivityAt?: string | null } | null;
}

type Suite =
  | { kind: "chargement" }
  | { kind: "parcours"; slug: string; nom: string; accroche?: string | null }
  | { kind: "tout-fini" };

function nomCourt(slug: string, titre: string): string {
  return PREMIUM_PARCOURS.find((p) => p.slug === slug)?.name ?? titre.replace(/^Parcours\s+/i, "");
}

function timeOf(iso: string | null | undefined): number {
  const t = iso ? Date.parse(iso) : Number.NaN;
  return Number.isNaN(t) ? 0 : t;
}

/**
 * Suite de fin dynamique (spec s17 §5.5, s18). Candidats : parcours actifs (la liste
 * de l'API), sauf le courant et sauf tout parcours terminé. Ordre : les parcours EN
 * COURS d'abord, de la dernière validation à la plus ancienne ; puis les non commencés
 * dans l'ordre du classement (`nextParcoursRanking`) ; un parcours absent du classement
 * passe après, dans l'ordre du catalogue. Sans classement : le parcours conseillé
 * (`nextParcours`, lot D s17) d'abord. Si tout est fini : le carnet du mois.
 */
export function pickSuite(
  paths: ApiPath[],
  currentSlug: string,
  conseille?: string | null,
  ranking: readonly string[] = [],
): Suite {
  const ouverts = paths.filter((p) => p.slug !== currentSlug && !p.progress?.completedAt);
  const enCours = ouverts
    .filter((p) => (p.progress?.completedSteps?.length ?? 0) > 0)
    .sort((a, b) => timeOf(b.progress?.lastActivityAt) - timeOf(a.progress?.lastActivityAt));
  const classement = ranking.length > 0 ? ranking : conseille ? [conseille] : [];
  const rang = (slug: string) => {
    const i = classement.indexOf(slug);
    return i === -1 ? classement.length : i;
  };
  const nonCommences = ouverts
    .filter((p) => !enCours.includes(p))
    .map((p, ordre) => ({ p, ordre }))
    .sort((a, b) => rang(a.p.slug) - rang(b.p.slug) || a.ordre - b.ordre)
    .map(({ p }) => p);
  const next = [...enCours, ...nonCommences][0];
  if (!next) return { kind: "tout-fini" };
  // §5.5 point 5 : la phrase du parcours conseillé est affichée par la carte ; sinon l'accroche du candidat.
  const accroche = next.slug === conseille ? null : (next.personaTagline ?? null);
  return { kind: "parcours", slug: next.slug, nom: nomCourt(next.slug, next.title), accroche };
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
    nextParcoursRanking?: readonly string[];
  }
>(function PathCompletionCard(
  { slug, title, totalXp, stepTitles, retours, nextParcours, nextParcoursReason, nextParcoursRanking },
  ref,
) {
  const [suite, setSuite] = useState<Suite>({ kind: "chargement" });
  // Clé stable (le tableau change de référence à chaque rendu).
  const rankingKey = (nextParcoursRanking ?? []).join(",");

  useEffect(() => {
    let cancelled = false;
    const fallback: Suite = nextParcours
      ? { kind: "parcours", slug: nextParcours, nom: nomCourt(nextParcours, nextParcours) }
      : { kind: "tout-fini" };
    fetch("/api/parcours")
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { paths?: ApiPath[] } | null) => {
        if (cancelled) return;
        setSuite(data?.paths ? pickSuite(data.paths, slug, nextParcours, rankingKey ? rankingKey.split(",") : []) : fallback);
      })
      .catch(() => {
        if (!cancelled) setSuite(fallback);
      });
    return () => {
      cancelled = true;
    };
  }, [slug, nextParcours, rankingKey]);

  const valeurs = Object.values(retours);
  const essayes = valeurs.filter((r) => r === "essaye-bof" || r === "essaye-ca-a-marche").length;
  const reussis = valeurs.filter((r) => r === "essaye-ca-a-marche").length;

  return (
    // s17 tour 1 (DES-1-07) : pastille de succès, titre / XP / suite centrés, bilan dans un bloc aligné à gauche.
    <Card className="mb-8 border-accent-primary/30 bg-accent-primary/5">
      <CardContent className="py-8 text-center">
        <div
          className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent-primary text-white"
          aria-hidden="true"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 ref={ref} tabIndex={-1} className="scroll-mt-[196px] font-display text-2xl font-bold focus:outline-none">
          {FIN_PARCOURS.titre(title)}
        </h2>
        <p className="mx-auto mt-2 max-w-md text-balance text-text-secondary">{FIN_PARCOURS.sousTitre}</p>
        <p className="mt-4 text-sm font-medium text-accent-link">{FIN_PARCOURS.xp(stepTitles.length, totalXp)}</p>
        {(stepTitles.length > 0 || essayes >= 1) && (
          <div className="mx-auto mt-6 max-w-md border-t border-border pt-4 text-left">
            {stepTitles.length > 0 && (
              <>
                <p className="text-sm font-semibold text-text-primary">{FIN_PARCOURS.acquis}</p>
                <ul className="mt-2 space-y-1.5 text-sm text-text-secondary">
                  {stepTitles.map((t) => (
                    <li key={t} className="flex items-start gap-2">
                      <svg
                        className="mt-0.5 h-4 w-4 shrink-0 text-accent-link"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        strokeWidth={3}
                        aria-hidden="true"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </>
            )}
            {essayes >= 1 && <p className="mt-3 text-sm text-text-secondary">{FIN_PARCOURS.exercices(essayes, reussis)}</p>}
          </div>
        )}
        {suite.kind === "parcours" && (
          <div className="mt-6">
            {(suite.slug === nextParcours ? nextParcoursReason : suite.accroche) && (
              // s17 tour 2 (DES-2-05) : même largeur que le bilan (une seule colonne de lecture).
              // s18 (§5.5 point 5) : phrase du parcours conseillé, sinon accroche du parcours proposé.
              <p className="mx-auto max-w-md text-sm text-text-secondary">
                {suite.slug === nextParcours ? nextParcoursReason : suite.accroche}
              </p>
            )}
            <Link
              href={`/parcours/${suite.slug}?src=suite`}
              className={`${buttonVariants({ variant: "primary", size: "lg" })} mt-3 h-auto min-h-[44px] w-full whitespace-normal text-balance py-2 sm:w-auto`}
            >
              {FIN_PARCOURS.suite(suite.nom)}
            </Link>
          </div>
        )}
        {suite.kind === "tout-fini" && (
          <p className="mx-auto mt-6 max-w-md text-sm text-text-secondary">
            {FIN_PARCOURS.carnetAvant}
            <Link href="/carnet" className="inline-flex min-h-[44px] items-center text-accent-link underline underline-offset-2">
              {FIN_PARCOURS.carnet}
            </Link>
            .
          </p>
        )}
      </CardContent>
    </Card>
  );
});
