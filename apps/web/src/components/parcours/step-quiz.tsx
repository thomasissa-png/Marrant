"use client";

import { useEffect, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { frenchQuizQuotes } from "@/lib/parcours-labels";
import { stripEmDashes } from "@/lib/em-dash";
import { frTypo } from "@/lib/fr-typo";
import {
  QUIZ_CORRECTION,
  QUIZ_FIN_BOUTON,
  QUIZ_LETTRE_VOCALE,
  quizFinVisiteur,
  quizLettre,
} from "@/config/textes/parcours";
import type { QuizQuestion } from "@/components/parcours/parcours-types";

/**
 * Quiz d'une étape. Accessibilité (F17, QA-06, UX-09) : la correction est
 * écrite (« Bonne réponse » / « Pas tout à fait » + la bonne réponse) et
 * marquée par une icône, pas seulement par la couleur ; elle est annoncée
 * par une zone vocale toujours présente ; le focus passe sur « Question
 * suivante ». Fin de quiz : « Tu peux valider » seulement pour un abonné (D1).
 * s17 tour 1 (UXV-1-04, DES-1-05) : le visiteur n'a plus de « Continuer » qui
 * fait disparaître le quiz ; le quiz est compté à la fin, un bouton discret
 * « Refaire le quiz » le relance. Un seul bouton plein à l'écran (l'offre).
 */
export function StepQuiz({
  quiz,
  canValidate,
  onComplete,
}: {
  quiz: QuizQuestion[];
  /** Abonné Premium : peut valider l'étape après le quiz. */
  canValidate: boolean;
  onComplete: (score: number, total: number) => void;
}) {
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const nextRef = useRef<HTMLButtonElement>(null);

  const q = quiz[currentQ];
  const showResult = selected !== null;
  const isRight = selected === q?.correctIndex;

  useEffect(() => {
    if (showResult) nextRef.current?.focus();
  }, [showResult]);

  const handleAnswer = (index: number) => {
    if (showResult) return;
    setSelected(index);
    if (index === q.correctIndex) setScore((s) => s + 1);
  };

  const handleNext = () => {
    if (currentQ < quiz.length - 1) {
      setCurrentQ((c) => c + 1);
      setSelected(null);
      return;
    }
    setFinished(true);
    // Visiteur : quiz compté dès la fin (événement quiz-etape-termine), sans bouton à cliquer.
    if (!canValidate) onComplete(score, quiz.length);
  };

  const restart = () => {
    setCurrentQ(0);
    setSelected(null);
    setScore(0);
    setFinished(false);
  };

  if (finished && !canValidate) {
    // Étalon 3.2 B : une ligne de résultat ; « Valider l'étape fait partie de Premium. » suit dans la page.
    return (
      <div className="rounded-lg border border-accent-primary/20 bg-accent-primary/5 p-4 text-center" role="status">
        <p className="font-display text-lg font-bold">{quizFinVisiteur(score, quiz.length)}</p>
        {/* s17 tour 2 (DES-2-02) : contour lisible (≈ 5,9:1), survol visible. */}
        <Button
          variant="outline"
          className="mt-3 min-h-[44px] w-full border-text-muted hover:border-text-primary sm:w-auto"
          onClick={restart}
        >
          {QUIZ_FIN_BOUTON.visiteur}
        </Button>
      </div>
    );
  }

  if (finished) {
    const allCorrect = score === quiz.length;
    return (
      <div className="rounded-lg border border-accent-primary/20 bg-accent-primary/5 p-4 text-center" role="status">
        <p className="font-display text-lg font-bold">
          {allCorrect ? "Sans faute !" : `${score}/${quiz.length} bonnes réponses`}
        </p>
        <p className="mt-1 text-sm text-text-secondary">
          {allCorrect
            ? "Tu as tout compris. Tu peux valider l'étape."
            : "Pas de souci, ce quiz ne compte pas : la vraie épreuve, c'est ta prochaine conversation. Tu peux valider l'étape."}
        </p>
        <Button
          variant="outline"
          className="mt-3 min-h-[44px] w-full border-text-muted hover:border-text-primary sm:w-auto"
          onClick={() => onComplete(score, quiz.length)}
        >
          {QUIZ_FIN_BOUTON.abonne}
        </Button>
      </div>
    );
  }

  const correction = !showResult
    ? ""
    : isRight
      ? `${QUIZ_CORRECTION.juste}.`
      : `${QUIZ_CORRECTION.faux}. ${QUIZ_CORRECTION.bonneReponse(frTypo(frenchQuizQuotes(stripEmDashes(q.options[q.correctIndex]))))}`;

  return (
    // DES-1-12 : conteneur du quiz, lettres en pastille, explication en encadré.
    <div className="space-y-3 rounded-lg border border-border bg-background-elevated/40 p-4">
      <Badge variant="secondary">
        Quiz {currentQ + 1}/{quiz.length}
      </Badge>
      <p className="text-base font-medium text-text-primary" id={`quiz-q-${currentQ}`}>
        {frTypo(frenchQuizQuotes(q.question))}
      </p>
      <div className="space-y-2" role="group" aria-labelledby={`quiz-q-${currentQ}`}>
        {q.options.map((opt, i) => {
          const isCorrectOption = showResult && i === q.correctIndex;
          const isWrongPick = showResult && i === selected && i !== q.correctIndex;
          let className =
            "flex min-h-[44px] w-full items-start gap-3 rounded-lg border p-3 text-left text-sm transition-all focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-primary";
          // DES-1-02 : texte d'erreur en `error-text` (AA), `error` pour bordure et fond.
          if (isCorrectOption) className += " border-success bg-success/10 text-success";
          else if (isWrongPick) className += " border-error bg-error/10 text-error-text";
          else if (showResult) className += " border-border bg-background-card text-text-muted";
          else className += " border-border bg-background-card hover:border-accent-primary hover:bg-background-elevated cursor-pointer";
          // Pastille en contour : un fond teinté ferait passer la lettre sous 4,5:1.
          const pastille = isCorrectOption
            ? "border-success text-success"
            : isWrongPick
              ? "border-error-text text-error-text"
              : "border-border-hover bg-background-elevated text-text-primary";
          return (
            <button
              key={i}
              type="button"
              className={className}
              onClick={() => handleAnswer(i)}
              aria-disabled={showResult || undefined}
              aria-pressed={showResult ? i === selected : undefined}
            >
              {/* Lettre visible (les explications disent « La A : … ») ; lue « Réponse A : … ». */}
              <span
                aria-hidden="true"
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs font-bold ${pastille}`}
                data-testid="quiz-lettre"
              >
                {quizLettre(i)}
              </span>
              {isCorrectOption && <span aria-hidden="true" className="leading-6">✓</span>}
              {isWrongPick && <span aria-hidden="true" className="leading-6">✗</span>}
              <span className="leading-6">
                <span className="sr-only">{QUIZ_LETTRE_VOCALE(quizLettre(i))}</span>
                {frTypo(frenchQuizQuotes(stripEmDashes(opt)))}
              </span>
              {isCorrectOption && <span className="sr-only"> ({QUIZ_CORRECTION.juste})</span>}
            </button>
          );
        })}
      </div>
      {/* Zone vocale toujours montée : la correction est annoncée dès qu'elle s'écrit. */}
      <div role="status" aria-live="polite" aria-atomic="true" className="text-sm">
        {showResult && (
          <div
            className={`rounded-lg border-l-2 bg-background-elevated p-3 leading-relaxed ${
              isRight ? "border-success" : "border-error-text"
            }`}
          >
            <p className={`font-medium ${isRight ? "text-success" : "text-text-primary"}`}>
              <span aria-hidden="true">{isRight ? "✓ " : "✗ "}</span>
              {correction}
            </p>
            {q.explanation && <p className="mt-1 text-text-secondary">{frTypo(stripEmDashes(q.explanation))}</p>}
          </div>
        )}
      </div>
      {showResult && (
        <div className="flex justify-end">
          <Button ref={nextRef} variant="primary" className="min-h-[44px] w-full sm:w-auto" onClick={handleNext}>
            {currentQ < quiz.length - 1 ? "Question suivante" : "Voir le résultat"}
          </Button>
        </div>
      )}
    </div>
  );
}
