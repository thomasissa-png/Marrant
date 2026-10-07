"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { YouTubePlayer } from "@/components/ui/youtube-player";
import { trackUmami } from "@/lib/umami";
import { stripEmDashes } from "@/lib/em-dash";
import { frTypo } from "@/lib/fr-typo";
import { buildAbonnementUrl } from "@/lib/premium-return";
import { VALIDATION_ETAPE } from "@/config/textes/offre";
import {
  APERCU_BAS,
  LIENS_FICHES,
  RETOUR_EXERCICE,
  VANNES_ETAPE,
} from "@/config/textes/parcours";
import type { Step, VideoRef } from "@/components/parcours/parcours-types";

/**
 * Aperçu d'une étape 2+ pour un non-abonné (D1, étalon 3.1 validé) : titre
 * (en-tête), ce qu'on y apprend, format, rien d'autre ; texte du bas et bouton
 * « Voir l'offre Premium » `src=parcours-apercu`. Aucun contenu payant reçu.
 */
export function LockedStepPreview({ step, slug }: { step: Step; slug: string }) {
  // Mur vu (audit s16 reco 17) : une fois par aperçu ouvert.
  useEffect(() => {
    trackUmami("mur-vu", { type: "parcours-etape", src: slug, etape: step.order });
  }, [slug, step.order]);
  return (
    <div className="space-y-3 rounded-lg bg-background-elevated p-4">
      {(step.moduleDetail || step.why) && (
        <div>
          <p className="text-sm font-medium text-accent-link">Ce que tu vas apprendre</p>
          <p className="mt-1 text-sm text-text-secondary">{step.moduleDetail || step.why}</p>
        </div>
      )}
      {step.moduleFormat && <p className="text-xs text-text-muted">Format : {step.moduleFormat}</p>}
      <div className="border-t border-border pt-3 text-center">
        <p className="text-sm text-text-secondary">{APERCU_BAS}</p>
        <Link
          href={buildAbonnementUrl(`/parcours/${slug}`, "monthly", "parcours-apercu")}
          className={`${buttonVariants({ variant: "primary", size: "sm" })} mt-3 min-h-[44px]`}
        >
          {VALIDATION_ETAPE.bouton}
        </Link>
      </div>
    </div>
  );
}

/** Mur de validation de l'étape 1 pour un non-abonné : `mur-vu` type `parcours-validation` (§5.2). */
export function ValidationWall({ slug, href }: { slug: string; href: string }) {
  useEffect(() => {
    trackUmami("mur-vu", { type: "parcours-validation", src: slug, etape: 1 });
  }, [slug]);
  return (
    <div className="text-center">
      <p className="text-sm text-text-secondary">{VALIDATION_ETAPE.texte}</p>
      <Link
        href={href}
        className={`${buttonVariants({ variant: "primary" })} mt-3 h-auto min-h-10 w-full whitespace-normal py-2 text-center leading-snug`}
      >
        {VALIDATION_ETAPE.bouton}
      </Link>
    </div>
  );
}

export function VideoCard({ video }: { video: VideoRef }) {
  return (
    <div className="overflow-hidden rounded-lg border border-border">
      {/* Lecteur intégré : on ne quitte plus le parcours au milieu d'une étape (T31) */}
      <div className="relative aspect-video bg-background-elevated">
        <YouTubePlayer youtubeId={video.youtubeId} title={`${video.title} de ${video.artist}`} />
      </div>
      <div className="p-3">
        <p className="text-sm font-medium text-text-primary">{video.artist}</p>
        <p className="text-xs text-text-secondary">{video.title}</p>
        <p className="mt-1 text-xs text-text-muted italic">{frTypo(stripEmDashes(video.why))}</p>
        {video.href && (
          <Link href={video.href} className="mt-2 inline-block py-2 text-xs text-accent-link underline underline-offset-2">
            {LIENS_FICHES.video}
          </Link>
        )}
      </div>
    </div>
  );
}

/**
 * Vannes de l'étape (D4). Abonné : les vannes actives servies par l'API, avec
 * lien vers leur fiche. Non-abonné (étape 1) : leur nombre, sans contenu.
 */
export function StepJokes({ step, isPremium }: { step: Step; isPremium: boolean }) {
  const jokes = step.jokes ?? [];
  if (isPremium && jokes.length > 0) {
    return (
      <div className="rounded-lg border border-accent-primary/20 bg-accent-primary/5 p-4">
        <h4 className="mb-3 text-sm font-semibold text-text-primary">{VANNES_ETAPE.titre}</h4>
        <ul className="space-y-3">
          {jokes.map((j) => (
            <li key={j.id} className="text-sm">
              <p className="text-text-primary">{frTypo(stripEmDashes(j.content))}</p>
              <p className="mt-1 font-medium text-text-secondary">{frTypo(stripEmDashes(j.punchline))}</p>
              <Link href={j.href} className="mt-1 inline-block py-1 text-xs text-accent-link underline underline-offset-2">
                {VANNES_ETAPE.voirFiche}
                <span className="sr-only"> : {j.technique ?? j.content}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    );
  }
  const count = step.jokeCount ?? step.jokeIds?.length ?? 0;
  if (isPremium || count === 0) return null;
  return (
    <div className="rounded-lg border border-accent-primary/20 bg-accent-primary/5 p-4">
      <h4 className="mb-2 text-sm font-semibold text-text-primary">{VANNES_ETAPE.titre}</h4>
      <p className="text-sm text-text-secondary">{VANNES_ETAPE.apercuVisiteur(count)}</p>
    </div>
  );
}

export type Resultat = (typeof RETOUR_EXERCICE.options)[number]["resultat"];

/**
 * Retour sur l'exercice (PM-06) : 3 valeurs fermées, facultatif, jamais exigé
 * pour valider, aucun champ libre ni stockage (avis @legal s17). Événement
 * `etape-retour {parcours, etape, resultat}` (data-analyst §5.1) pour le
 * visiteur SEULEMENT : pour un abonné, la donnée part en base via la route du
 * lot A (onSelect) et n'est pas recopiée dans Umami (avis @legal §2, réserve N2 s17).
 */
export function ExerciseFeedback({
  slug,
  etape,
  initial = null,
  isPremium = false,
  onSelect,
}: {
  slug: string;
  etape: number;
  /** Abonné Premium : aucun événement Umami (la base compte déjà). */
  isPremium?: boolean;
  /** Choix déjà enregistré (abonné). */
  initial?: string | null;
  /** Abonné : enregistrement serveur (`POST /api/parcours/[id]/retour`, lot A). */
  onSelect?: (resultat: Resultat) => void;
}) {
  const [choix, setChoix] = useState<Resultat | null>(null);
  const actif = choix ?? (RETOUR_EXERCICE.options.find((o) => o.resultat === initial)?.resultat ?? null);
  return (
    <div className="rounded-lg border border-border p-3">
      <p className="text-sm font-medium text-text-primary" id={`retour-${etape}`}>
        {RETOUR_EXERCICE.question}
      </p>
      <div className="mt-2 flex flex-col gap-2 sm:flex-row" role="group" aria-labelledby={`retour-${etape}`}>
        {RETOUR_EXERCICE.options.map((o) => (
          <Button
            key={o.resultat}
            type="button"
            size="sm"
            variant={actif === o.resultat ? "primary" : "outline"}
            aria-pressed={actif === o.resultat}
            onClick={() => {
              if (actif === o.resultat) return;
              setChoix(o.resultat);
              if (!isPremium) trackUmami("etape-retour", { parcours: slug, etape, resultat: o.resultat });
              onSelect?.(o.resultat);
            }}
          >
            {o.label}
          </Button>
        ))}
      </div>
      <p role="status" className="mt-2 text-xs text-text-muted">
        {choix ? RETOUR_EXERCICE.options.find((o) => o.resultat === choix)?.reponse : ""}
      </p>
    </div>
  );
}
