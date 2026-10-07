"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { tipProse } from "@/lib/tip-prose";
import { ETAPE_LIBRE_BADGE } from "@/config/textes/offre";
import {
  CHARGEMENT_ETAPE,
  dureeEtapeTexte,
  ETAPE_APERCU_LIBELLE,
  etapeOrdreTexte,
  LIENS_FICHES,
} from "@/config/textes/parcours";
import { PARCOURS_ETAPE_XP_DEFAUT } from "@/lib/parcours-xp";
import { StepQuiz } from "@/components/parcours/step-quiz";
import {
  ExerciseFeedback,
  LockedStepPreview,
  type Resultat,
  StepJokes,
  ValidationWall,
  VideoCard,
} from "@/components/parcours/step-blocks";
import type { Step } from "@/components/parcours/parcours-types";

const LOCK_PATH =
  "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z";

function LockIcon({ className }: { className: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d={LOCK_PATH} />
    </svg>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="mb-1 text-sm font-semibold text-text-primary">{title}</h4>
      {children}
    </div>
  );
}

export interface ParcoursStepCardProps {
  step: Step;
  slug: string;
  timePerWeek?: string | null;
  isPremium: boolean;
  isCompleted: boolean;
  isExpanded: boolean;
  /** Abonné : étape après une étape non validée (ordre conseillé). */
  isSequentiallyLocked: boolean;
  /** Non-abonné : étape 2+ ouverte en aperçu (D1). */
  isPremiumLocked: boolean;
  previousOrder: number | null;
  isQuizDone: boolean;
  isSeedFallback: boolean;
  completing: boolean;
  abonnementHref: string;
  loadFailed: boolean;
  onRetryLoad: () => void;
  onToggle: () => void;
  onQuizComplete: (score: number, total: number) => void;
  onComplete: () => void;
  /** Retour déjà enregistré sur l'exercice (abonné). */
  retour?: string | null;
  onRetour?: (resultat: Resultat) => void;
}

export function ParcoursStepCard(props: ParcoursStepCardProps) {
  const { step, slug, isPremium, isCompleted, isExpanded, isSequentiallyLocked, isPremiumLocked } = props;
  const canExpand = !isSequentiallyLocked;
  const stepXp = step.moduleXp ?? PARCOURS_ETAPE_XP_DEFAUT;
  const hasQuiz = !!step.quiz && step.quiz.length > 0;
  const title = step.moduleTitle ?? step.tip.title;
  const muted = isSequentiallyLocked || isPremiumLocked;

  return (
    <Card
      role="listitem"
      // Ancre des liens d'entrée (lot C) : /parcours/<slug>#etape-N.
      id={`etape-${step.order}`}
      className={`scroll-mt-24 ${isCompleted ? "border-accent-primary/30 bg-accent-primary/5" : muted ? "border-dashed" : ""}`}
    >
      <CardHeader
        id={`etape-${step.order}-entete`}
        role={canExpand ? "button" : undefined}
        tabIndex={canExpand ? 0 : undefined}
        aria-expanded={canExpand ? isExpanded : undefined}
        // Pas d'aria-label : le nom vocal = le texte visible (QA-05) ; focus visible (UX-09 a).
        className={`rounded-t-xl focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-primary ${canExpand ? "cursor-pointer" : "cursor-default"}`}
        onClick={() => canExpand && props.onToggle()}
        onKeyDown={(e) => {
          if (!canExpand) return;
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            props.onToggle();
          }
        }}
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <div
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                isCompleted ? "bg-accent-primary text-white" : muted ? "bg-background-elevated text-text-muted opacity-60" : "bg-background-elevated text-text-muted"
              }`}
              aria-hidden="true"
            >
              {isCompleted ? (
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              ) : muted ? (
                <LockIcon className="h-4 w-4" />
              ) : (
                step.order
              )}
            </div>
            <div>
              <CardTitle className={`text-base ${muted ? "text-text-muted" : ""}`}>
                <span className="sr-only">Étape {step.order} : </span>
                {title}
                {isCompleted && <span className="sr-only"> (validée)</span>}
              </CardTitle>
              <div className="mt-1 flex flex-wrap items-center gap-2">
                <span className={`text-xs ${muted ? "text-text-muted" : "text-accent-link"}`}>+{stepXp} XP</span>
                {(step.free || step.order === 1) && <Badge variant="primary">{ETAPE_LIBRE_BADGE}</Badge>}
                {isPremiumLocked && !isCompleted && (
                  <span className="text-xs text-text-muted">{ETAPE_APERCU_LIBELLE}</span>
                )}
                {isSequentiallyLocked && props.previousOrder !== null && (
                  <span className="text-xs text-text-muted">{etapeOrdreTexte(props.previousOrder)}</span>
                )}
              </div>
            </div>
          </div>
          {canExpand ? (
            <svg
              className={`h-5 w-5 shrink-0 text-text-muted transition-transform ${isExpanded ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          ) : (
            <LockIcon className="h-5 w-5 shrink-0 text-text-muted/50" />
          )}
        </div>
      </CardHeader>

      {isExpanded && canExpand && (
        <CardContent className="pt-0">
          {isPremiumLocked ? (
            <LockedStepPreview step={step} slug={slug} />
          ) : step.locked ? (
            props.loadFailed ? (
              <div className="rounded-lg bg-background-elevated p-4 text-center text-sm text-text-secondary" role="alert">
                <p>{CHARGEMENT_ETAPE.echec}</p>
                <Button variant="primary" size="sm" className="mt-3" onClick={props.onRetryLoad}>
                  {CHARGEMENT_ETAPE.reessayer}
                </Button>
              </div>
            ) : (
              <p className="rounded-lg bg-background-elevated p-4 text-center text-sm text-text-secondary" role="status">
                {CHARGEMENT_ETAPE.enCours}
              </p>
            )
          ) : (
            <StepContent {...props} hasQuiz={hasQuiz} />
          )}
        </CardContent>
      )}
    </Card>
  );
}

function StepContent(props: ParcoursStepCardProps & { hasQuiz: boolean }) {
  const { step, slug, isPremium, isCompleted, isQuizDone, isSeedFallback, hasQuiz } = props;
  return (
    <div className="space-y-5">
      {step.why && (
        <div className="rounded-lg bg-background-elevated p-3">
          <p className="text-sm font-medium text-accent-link">Pourquoi cette étape ?</p>
          <p className="mt-1 text-sm text-text-secondary">{step.why}</p>
        </div>
      )}

      {step.moduleDetail && (
        <Section title="Ce que tu vas apprendre">
          <p className="text-sm text-text-secondary">{step.moduleDetail}</p>
          {step.moduleFormat && <p className="mt-2 text-xs text-text-muted">Format : {step.moduleFormat}</p>}
          {props.timePerWeek && <p className="mt-1 text-xs text-text-muted">{dureeEtapeTexte(props.timePerWeek)}</p>}
        </Section>
      )}

      {/* Conseil : masqué s'il répète mot pour mot le bloc précédent (T28). */}
      {step.tip.content && step.tip.content.trim() !== step.moduleDetail?.trim() && (
        <Section title="Le conseil">
          <p className="text-sm text-text-secondary">{tipProse(step.tip.content)}</p>
          {step.tipHref && (
            <Link href={step.tipHref} className="mt-1 inline-block py-2 text-xs text-accent-link underline underline-offset-2">
              {LIENS_FICHES.conseil}
            </Link>
          )}
        </Section>
      )}

      {step.tip.example && (
        <Section title="Exemple concret">
          <p className="rounded-lg bg-background-elevated p-3 text-sm italic text-text-secondary">{tipProse(step.tip.example)}</p>
        </Section>
      )}

      {step.tip.exercise && (
        <Section title="Exercice pratique">
          <p className="rounded-lg border border-accent-primary/20 bg-accent-primary/5 p-3 text-sm text-text-secondary">
            {tipProse(step.tip.exercise)}
          </p>
          <div className="mt-3">
            <ExerciseFeedback slug={slug} etape={step.order} initial={props.retour} onSelect={props.onRetour} />
          </div>
        </Section>
      )}

      <StepJokes step={step} isPremium={isPremium} />

      {step.videos && step.videos.length > 0 && (
        <div>
          <h4 className="mb-2 text-sm font-semibold text-text-primary">Vidéos à regarder</h4>
          <div className="grid gap-3 sm:grid-cols-2">
            {step.videos.map((v) => (
              <VideoCard key={v.youtubeId} video={v} />
            ))}
          </div>
        </div>
      )}

      {hasQuiz && !isQuizDone && !isCompleted && (
        <div>
          <h4 className="mb-2 text-sm font-semibold text-text-primary">Petit quiz avant de valider</h4>
          <StepQuiz quiz={step.quiz!} canValidate={isPremium} onComplete={props.onQuizComplete} />
        </div>
      )}

      {hasQuiz && isQuizDone && !isCompleted && isPremium && (
        <p className="text-center text-sm font-medium text-accent-link">Quiz bouclé, tu peux valider l&apos;étape</p>
      )}

      {!isCompleted && isPremium && !isSeedFallback && hasQuiz && !isQuizDone && (
        <Button variant="primary" className="w-full cursor-not-allowed opacity-50" disabled>
          Termine le quiz pour valider cette étape
        </Button>
      )}

      {!isCompleted && isPremium && !isSeedFallback && (!hasQuiz || isQuizDone) && (
        <Button variant="primary" className="w-full" onClick={props.onComplete} disabled={props.completing}>
          {props.completing ? "On valide…" : "Valider cette étape"}
        </Button>
      )}

      {!isCompleted && isPremium && isSeedFallback && (
        <p className="text-center text-sm text-text-muted">Le suivi de ta progression arrive bientôt sur ce parcours.</p>
      )}

      {isCompleted && <p className="text-center text-sm font-medium text-accent-link">Étape validée</p>}

      {!isPremium && !isCompleted && step.order === 1 && <ValidationWall slug={slug} href={props.abonnementHref} />}
    </div>
  );
}
