"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { tipProse } from "@/lib/tip-prose";
import { ETAPE_LIBRE_BADGE } from "@/config/textes/offre";
import {
  CHARGEMENT_ETAPE,
  dureeEtapeTexte,
  VIDEOS_ETAPE,
  ETAPE_APERCU_LIBELLE,
  etapeOrdreTexte,
  LIENS_FICHES,
  QUIZ_TITRE,
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

/**
 * s17 tour 3 (UXV-3-01) : la carte affiche-t-elle le bloc d'échec du chargement ? Règle unique,
 * lue aussi par la page : un seul « Réessayer » et une seule alerte à l'écran (celle de l'étape dépliée).
 */
export function etapeAfficheEchec(p: {
  step: Pick<Step, "locked">;
  isExpanded: boolean;
  isSequentiallyLocked: boolean;
  isPremiumLocked: boolean;
  loadFailed: boolean;
}): boolean {
  return p.isExpanded && !p.isSequentiallyLocked && !p.isPremiumLocked && !!p.step.locked && p.loadFailed;
}

const LOCK_PATH =
  "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z";

function LockIcon({ className }: { className: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d={LOCK_PATH} />
    </svg>
  );
}

/** s17 tour 1 (DES-1-06) : titres de bloc lisibles d'un coup d'œil, corps à longueur de ligne lisible. */
const SECTION_TITRE = "mb-2 font-display text-base font-bold text-text-primary";
const CORPS_LECTURE = "max-w-[68ch] text-base leading-7 text-text-secondary sm:text-[15px]";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className={SECTION_TITRE}>{title}</h4>
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
  /** s17 tour 3 : focus rendu au « Réessayer » de l'étape après un nouvel échec. */
  reessayerRef?: React.Ref<HTMLButtonElement>;
  onToggle: () => void;
  onQuizComplete: (score: number, total: number) => void;
  onComplete: () => void;
  /** s17 tour 3 (QA) : échec de la validation de CETTE étape, affiché au-dessus de « Valider ». */
  erreurValidation?: string | null;
  /** Retour déjà enregistré sur l'exercice (abonné). */
  retour?: string | null;
  onRetour?: (resultat: Resultat) => void;
  /**
   * s17 tour 1 (UXV-1-01, DES-1-01) : gain d'XP et date conseillée, affichés dans
   * la carte qui vient d'être validée, sans minuterie.
   */
  resultat?: { xp: string | null; rythme: string | null } | null;
  /** s17 tour 1 (UXV-1-06) : repère « Parcours Répartie · 4 semaines » au-dessus du titre. */
  contexte?: string | null;
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
      // s17 tour 3 (DES-3-05) : 112 px sous la barre fixe (64 px), « Le programme » reste entier au-dessus de l'étape 1.
      className={`scroll-mt-28 ${isCompleted ? "border-accent-primary/30 bg-accent-primary/5" : muted ? "border-dashed" : ""}`}
    >
      <CardHeader
        id={`etape-${step.order}-entete`}
        role={canExpand ? "button" : undefined}
        tabIndex={canExpand ? 0 : undefined}
        aria-expanded={canExpand ? isExpanded : undefined}
        // Pas d'aria-label : le nom vocal = le texte visible (QA-05) ; focus visible (UX-09 a).
        // DES-1-04 : pas de marge basse sous un en-tête replié (16 px dessus, 0 dessous + padding de la carte).
        // s17 tour 3 (DES-3-05) : déplié, 8 px sous l'en-tête pour que l'anneau de focus (2 + 2 px) ne touche pas le bloc suivant.
        // s17 tour 4 (QA) : survol = titre souligné et chevron éclairci (en-tête dépliable seulement).
        className={`rounded-t-xl ${isExpanded && canExpand ? "mb-2" : "pb-0"} focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-primary ${canExpand ? "group cursor-pointer" : "cursor-default"}`}
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
                isCompleted ? "bg-accent-primary text-white" : "bg-background-elevated text-text-muted"
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
              {props.contexte && (
                // Répète le H1 : masqué au lecteur d'écran (nom du bouton « Étape 1 : … » inchangé).
                <p aria-hidden="true" className="mb-0.5 text-xs font-semibold uppercase tracking-wide text-accent-link">
                  {props.contexte}
                </p>
              )}
              {/* DES-1-11 : titre verrouillé en secondaire (tentant, pas éteint). */}
              <CardTitle
                className={`text-base decoration-text-muted underline-offset-4 group-hover:underline ${muted ? "text-text-secondary" : ""}`}
              >
                <span className="sr-only">Étape {step.order} : </span>
                {title}
                {isCompleted && <span className="sr-only"> (validée)</span>}
              </CardTitle>
              <div className="mt-1 flex flex-wrap items-center gap-2">
                {/* s17 tour 2 (DES-2-04) : pas de « +N XP » statique au-dessus du gain qui vient d'être affiché. */}
                {!(isCompleted && props.resultat?.xp) && (
                  <span className={`text-xs ${muted ? "text-text-muted" : "text-accent-link"}`}>+{stepXp} XP</span>
                )}
                {(step.free || step.order === 1) && <Badge variant="primary">{ETAPE_LIBRE_BADGE}</Badge>}
                {isPremiumLocked && !isCompleted && <Badge variant="premium">{ETAPE_APERCU_LIBELLE}</Badge>}
                {isSequentiallyLocked && props.previousOrder !== null && (
                  <span className="text-xs text-text-muted">{etapeOrdreTexte(props.previousOrder)}</span>
                )}
              </div>
            </div>
          </div>
          {canExpand ? (
            <svg
              className={`h-5 w-5 shrink-0 text-text-muted transition-transform group-hover:text-text-primary ${isExpanded ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          ) : (
            <LockIcon className="h-5 w-5 shrink-0 text-text-muted" />
          )}
        </div>
      </CardHeader>

      {/* Hors de l'en-tête : le nom vocal du bouton reste « Étape N : titre ». Annonce : zone aria-live de la page. */}
      {isCompleted && props.resultat && (props.resultat.xp || props.resultat.rythme) && (
        <div className="mt-2 pl-11 text-sm" data-testid="etape-resultat">
          {props.resultat.xp && (
            <p className="text-base font-bold text-accent-link animate-scale-in motion-reduce:animate-none">{props.resultat.xp}</p>
          )}
          {props.resultat.rythme && <p className="mt-0.5 text-text-secondary">{props.resultat.rythme}</p>}
        </div>
      )}

      {isExpanded && canExpand && (
        <CardContent className="pt-0">
          {isPremiumLocked ? (
            <LockedStepPreview step={step} slug={slug} />
          ) : step.locked ? (
            // s17 tour 2 (DES-2-01, UXV-2-01) : bloc d'échec en error-text.
            // s17 tour 3 (UXV-3-01, DES-3-06) : étape dépliée en échec = c'est elle qui porte l'alerte, la phrase
            // rassurante et le seul « Réessayer » ; la carte de progression reste neutre (voir etapeAfficheEchec).
            props.loadFailed ? (
              <div
                role="alert"
                data-testid="etape-echec"
                className="rounded-lg border-l-2 border-error-text bg-error/10 p-3 text-sm text-error-text"
              >
                <p className="font-semibold">{CHARGEMENT_ETAPE.progressionIntacte}</p>
                <p className="mt-1">{CHARGEMENT_ETAPE.echec}</p>
                <Button
                  ref={props.reessayerRef}
                  variant="outline"
                  className="mt-3 min-h-[44px] w-full border-text-muted hover:border-text-primary sm:w-auto"
                  onClick={props.onRetryLoad}
                >
                  {CHARGEMENT_ETAPE.reessayer}
                </Button>
              </div>
            ) : (
              <div aria-busy="true" className="min-h-[160px] space-y-3 rounded-lg bg-background-elevated/40 p-4">
                <p role="status" className="text-sm text-text-muted">{CHARGEMENT_ETAPE.enCours}</p>
                <div aria-hidden="true" data-testid="etape-squelette" className="space-y-3 animate-pulse motion-reduce:animate-none">
                  <div className="h-4 w-full rounded bg-background-elevated" />
                  <div className="h-4 w-[90%] rounded bg-background-elevated" />
                  <div className="h-4 w-[60%] rounded bg-background-elevated" />
                </div>
              </div>
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
  const validerRef = useRef<HTMLButtonElement>(null);
  // s17 tour 3 (QA) : échec de validation = focus rendu à « Valider » (désactivé pendant l'envoi, il l'avait perdu).
  const { erreurValidation, completing } = props;
  useEffect(() => {
    if (erreurValidation && !completing) validerRef.current?.focus();
  }, [erreurValidation, completing]);
  return (
    <div className="space-y-6">
      {step.why && (
        <div className="rounded-lg bg-background-elevated p-3">
          <p className="text-sm font-medium text-accent-link">Pourquoi cette étape ?</p>
          <p className="mt-1 text-sm text-text-secondary">{step.why}</p>
        </div>
      )}

      {step.moduleDetail && (
        <Section title="Ce que tu vas apprendre">
          <p className={CORPS_LECTURE}>{step.moduleDetail}</p>
          {step.moduleFormat && <p className="mt-2 text-xs text-text-muted">Format : {step.moduleFormat}</p>}
          {props.timePerWeek && (
            <p className="mt-1 text-xs text-text-muted">
              {dureeEtapeTexte(props.timePerWeek, (step.videos?.length ?? 0) > 0)}
            </p>
          )}
        </Section>
      )}

      {/* Conseil : masqué s'il répète mot pour mot le bloc précédent (T28). */}
      {step.tip.content && step.tip.content.trim() !== step.moduleDetail?.trim() && (
        <Section title="Le conseil">
          <p className={CORPS_LECTURE}>{tipProse(step.tip.content)}</p>
          {step.tipHref && (
            <Link href={step.tipHref} className="inline-flex min-h-[44px] items-center text-sm text-accent-link underline underline-offset-2">
              {LIENS_FICHES.conseil}
            </Link>
          )}
        </Section>
      )}

      {step.tip.example && (
        <Section title="Exemple concret">
          <p className="whitespace-pre-line rounded-lg bg-background-elevated p-3 text-sm italic text-text-secondary">{tipProse(step.tip.example)}</p>
        </Section>
      )}

      {step.tip.exercise && (
        <Section title="Exercice pratique">
          <p className="whitespace-pre-line rounded-lg border border-accent-primary/20 bg-accent-primary/5 p-3 text-sm text-text-secondary">
            {tipProse(step.tip.exercise)}
          </p>
          {step.exerciceProtection && <p className="mt-2 text-sm text-text-secondary">{step.exerciceProtection}</p>}
          <div className="mt-3">
            <ExerciseFeedback
              slug={slug}
              etape={step.order}
              initial={props.retour}
              isPremium={isPremium}
              onSelect={props.onRetour}
            />
          </div>
        </Section>
      )}

      <StepJokes step={step} isPremium={isPremium} />

      {step.videos && step.videos.length > 0 && (
        // DES-1-06 : filet avant la zone facultative.
        <div className="border-t border-border pt-6">
          <h4 className={SECTION_TITRE}>{VIDEOS_ETAPE.titre}</h4>
          <div className="grid gap-3 sm:grid-cols-2">
            {step.videos.map((v) => (
              <VideoCard key={v.youtubeId} video={v} />
            ))}
          </div>
        </div>
      )}

      {/* Visiteur : le quiz reste affiché une fois fini (résultat, « Refaire le quiz »), UXV-1-04. */}
      {hasQuiz && (!isQuizDone || !isPremium) && !isCompleted && (
        <div className="border-t border-border pt-6">
          <h4 className={SECTION_TITRE}>{isPremium ? QUIZ_TITRE.abonne : QUIZ_TITRE.visiteur}</h4>
          <StepQuiz quiz={step.quiz!} canValidate={isPremium} onComplete={props.onQuizComplete} />
        </div>
      )}

      {hasQuiz && isQuizDone && !isCompleted && isPremium && (
        <p className="text-center text-sm font-medium text-accent-link">Quiz bouclé, tu peux valider l&apos;étape</p>
      )}

      {!isCompleted && isPremium && !isSeedFallback && hasQuiz && !isQuizDone && (
        // s17 tour 2 (DES-2-03, UXV-2-02) : gris lisible (≈ 7:1), aria-disabled pour que la consigne soit lue.
        <Button
          variant="primary"
          aria-disabled="true"
          className="w-full cursor-not-allowed border border-border bg-background-elevated text-text-secondary hover:bg-background-elevated"
          onClick={(e) => e.preventDefault()}
        >
          Termine le quiz pour valider cette étape
        </Button>
      )}

      {!isCompleted && isPremium && !isSeedFallback && (!hasQuiz || isQuizDone) && (
        <div className="space-y-3">
          {/* s17 tour 3 (QA) : message à côté du bouton cliqué, quiz et bouton conservés, pas de doublon en haut. */}
          {erreurValidation && (
            <p role="alert" className="rounded-lg border-l-2 border-error-text bg-error/10 p-3 text-sm text-error-text">
              {erreurValidation}
            </p>
          )}
          <Button
            ref={validerRef}
            variant="primary"
            className="w-full disabled:opacity-80"
            onClick={props.onComplete}
            disabled={props.completing}
          >
            {/* s17 tour 2 (DES-2-03) : « On valide… » lisible, avec un indicateur 16 px. */}
            {props.completing && (
              <span
                aria-hidden="true"
                className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent motion-reduce:animate-none"
              />
            )}
            {props.completing ? "On valide…" : "Valider cette étape"}
          </Button>
        </div>
      )}

      {!isCompleted && isPremium && isSeedFallback && (
        <p className="text-center text-sm text-text-muted">Le suivi de ta progression arrive bientôt sur ce parcours.</p>
      )}

      {isCompleted && <p className="text-center text-sm font-medium text-accent-link">Étape validée</p>}

      {!isPremium && !isCompleted && step.order === 1 && <ValidationWall slug={slug} href={props.abonnementHref} quizPending={hasQuiz && !isQuizDone} />}
    </div>
  );
}
