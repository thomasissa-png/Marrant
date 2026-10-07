"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/ui/progress-bar";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { recommendParcours, type ParcoursRecommendation } from "@/lib/parcours-orientation";
import { withEmojiPresentation } from "@/lib/parcours-labels";
import { stripEmDashes } from "@/lib/em-dash";
import type { ParcoursCatalogueItem } from "@/lib/parcours-catalogue";
import { ETAPE_LIBRE_BADGE } from "@/config/textes/offre";
import { LISTE_PARCOURS } from "@/config/textes/parcours";
import { trackUmami } from "@/lib/umami";
import { isPremiumPlan } from "@/lib/parcours-access";
import Link from "next/link";
import { totalParcoursXp } from "@/lib/parcours-xp";

// Les données arrivent du Server Component (app/(dashboard)/parcours/(liste)/page.tsx) :
// le seed complet (quiz, vidéos, vannes) ne doit plus être embarqué côté client.

// ==============================
// Mini quiz d'orientation parcours
// ==============================

type QuizResult = ParcoursRecommendation;

const ORIENTATION_QUESTIONS = [
  {
    question: "Dans quelle situation tu voudrais être plus drôle ?",
    options: [
      { label: "Au boulot, en réunion, à la pause", value: "work", emoji: "☕" },
      { label: "En soirée, avec mes potes, en coloc", value: "social", emoji: "🎉" },
      { label: "Partout, je veux retrouver ma légèreté", value: "global", emoji: "🌱" },
    ],
  },
  {
    question: "Qu'est-ce qui coince le plus ?",
    options: [
      { label: "Je n'ai jamais rien de drôle à raconter", value: "content", emoji: "📝" },
      { label: "Je ne sais pas quoi répondre sur le moment", value: "repartie", emoji: "⚡" },
      { label: "J'ai perdu confiance en moi", value: "confiance", emoji: "💪" },
    ],
  },
];

function OrientationQuiz({
  onShowParcours,
  statut,
}: {
  onShowParcours: (slug: string) => void;
  statut: "visiteur" | "membre" | "premium";
}) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [result, setResult] = useState<QuizResult | null>(null);
  const router = useRouter();

  const handleAnswer = (value: string) => {
    const newAnswers = [...answers, value];
    setAnswers(newAnswers);
    if (step < ORIENTATION_QUESTIONS.length - 1) {
      setStep(step + 1);
    } else {
      const reco = recommendParcours(newAnswers);
      setResult(reco);
      // data-analyst §5.1 : verdict du quiz d'orientation.
      trackUmami("orientation-resultat", { parcours: reco.slug, statut });
    }
  };

  const handleReset = () => {
    setStep(0);
    setAnswers([]);
    setResult(null);
  };

  if (result) {
    return (
      <Card className="p-4 text-center sm:p-6">
        <CardContent>
          <p className="text-sm font-medium text-accent-link">Ton point de départ :</p>
          <h3 className="mt-2 font-display text-xl font-bold">{result.title}</h3>
          <p className="mt-2 text-sm text-text-secondary">{result.reason}</p>
          <div className="mt-4 flex flex-col items-center gap-2 sm:flex-row sm:justify-center">
            <Button variant="primary" size="sm" onClick={() => onShowParcours(result.slug)}>
              Voir ce parcours
            </Button>
            <Button variant="ghost" size="sm" onClick={handleReset}>
              Refaire le quiz
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const q = ORIENTATION_QUESTIONS[step];
  return (
    <Card className="p-4 sm:p-6">
      <CardContent>
        <div className="mb-4 flex items-center justify-between">
          <Badge variant="primary">Question {step + 1}/{ORIENTATION_QUESTIONS.length}</Badge>
          <div className="flex gap-1">
            {ORIENTATION_QUESTIONS.map((_, i) => (
              <div
                key={i}
                className={`h-2 w-6 rounded-full transition-colors ${
                  i <= step ? "bg-accent-primary" : "bg-background-elevated"
                }`}
              />
            ))}
          </div>
        </div>
        <h3 className="mb-4 font-display text-lg font-bold">{q.question}</h3>
        <div className="flex flex-col gap-2 sm:flex-row">
          {q.options.map((o) => (
            <button
              key={o.value}
              onClick={() => handleAnswer(o.value)}
              className="flex flex-1 items-center gap-2 rounded-lg border border-border bg-background-card p-3 text-left text-sm font-medium transition-all hover:border-accent-primary hover:bg-background-elevated active:scale-[0.98]"
            >
              <span className="text-xl" aria-hidden="true">{withEmojiPresentation(o.emoji)}</span>
              {o.label}
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// ==============================
// Main component
// ==============================

interface HubProgress {
  completed: number;
  total: number;
  done: boolean;
  nextStep: number | null;
}

interface ApiPath {
  slug: string;
  steps?: Array<{ order: number }>;
  progress?: { completedSteps: number[]; completedAt: string | null } | null;
}

export function ParcoursContent({ parcours }: { parcours: ParcoursCatalogueItem[] }) {
  const { status, data: session } = useSession();
  const router = useRouter();
  const [userProgress, setUserProgress] = useState<Record<string, HubProgress>>({});
  // Programmes repliés par défaut (T24) ; le quiz d'orientation ouvre celui qu'il conseille (T23).
  const [openSlugs, setOpenSlugs] = useState<Set<string>>(new Set());
  const statut =
    status !== "authenticated"
      ? "visiteur"
      : isPremiumPlan((session?.user as { plan?: string } | undefined)?.plan)
        ? "premium"
        : "membre";

  const setProgrammeOpen = (slug: string, open: boolean) => {
    setOpenSlugs((prev) => {
      if (prev.has(slug) === open) return prev;
      const next = new Set(prev);
      if (open) next.add(slug);
      else next.delete(slug);
      return next;
    });
  };

  const showParcours = (slug: string) => {
    setProgrammeOpen(slug, true);
    requestAnimationFrame(() => {
      const title = document.getElementById(`parcours-title-${slug}`);
      title?.scrollIntoView({ behavior: "smooth", block: "start" });
      title?.focus({ preventScroll: true });
    });
  };

  // Progression de la personne connectée : correspondance par slug (FS-13 b), un seul appel.
  useEffect(() => {
    if (status !== "authenticated") return;
    fetch("/api/parcours")
      .then((res) => (res.ok ? res.json() : { paths: [] }))
      .then((data: { paths?: ApiPath[] }) => {
        const result: Record<string, HubProgress> = {};
        for (const p of data.paths ?? []) {
          if (!p.progress) continue;
          const orders = (p.steps ?? []).map((s) => s.order);
          const completed = new Set(p.progress.completedSteps);
          result[p.slug] = {
            completed: completed.size,
            total: orders.length,
            done: !!p.progress.completedAt,
            nextStep: orders.find((o) => !completed.has(o)) ?? null,
          };
        }
        setUserProgress(result);
      })
      .catch(() => {
        // Sans progression, la liste reste utilisable telle quelle.
      });
  }, [status]);

  const reprise = parcours.find((p) => {
    const prog = userProgress[p.slug];
    return prog && !prog.done && prog.completed > 0 && prog.nextStep !== null;
  });

  // s17 tour 2 (UXV-2-05) : abonné qui a entamé un parcours = ses cartes d'abord, le quiz d'orientation après.
  const parcoursEntame = statut === "premium" && Object.values(userProgress).some((p) => p.completed > 0);
  const quizOrientation = (
    <div className={parcoursEntame ? "mt-10" : "mb-10"}>
      <h2 className="mb-4 font-display text-xl font-bold">
        Quel parcours est fait pour toi ?
      </h2>
      <OrientationQuiz onShowParcours={showParcours} statut={statut} />
    </div>
  );

  // L'étape 1 se lit sans compte : « Commencer ce parcours » mène au parcours
  // pour tout le monde (s15 §2.7, avant : /register pour un visiteur).
  const handleCta = (slug: string) => {
    router.push(`/parcours/${slug}?src=hub`);
  };

  return (
    <>
      {/* Reprise pour la personne qui a un parcours en cours (UX-11) */}
      {reprise && userProgress[reprise.slug]?.nextStep && (
        <div className="mb-8 rounded-lg border border-accent-primary/40 bg-accent-primary/5 p-4 text-center">
          <Link
            href={`/parcours/${reprise.slug}?src=hub#etape-${userProgress[reprise.slug].nextStep}`}
            className={buttonVariants({ variant: "primary" })}
          >
            {LISTE_PARCOURS.reprendre}
          </Link>
          <p className="mt-2 text-sm text-text-secondary">
            {LISTE_PARCOURS.repriseLigne(
              reprise.title,
              userProgress[reprise.slug].nextStep as number,
              userProgress[reprise.slug].total || reprise.modules.length,
              reprise.modules[(userProgress[reprise.slug].nextStep as number) - 1]?.title ?? null,
            )}
          </p>
        </div>
      )}

      {!parcoursEntame && quizOrientation}

      {/* Parcours cards */}
      <div className="flex flex-col gap-6">
        {parcours.map((p) => {
          // QA-07 : total réel, bonus de fin compris.
          const totalXp = totalParcoursXp(p.modules.map((m) => ({ moduleXp: m.xp })));
          const prog = userProgress[p.slug];
          const progressValue = prog ? prog.completed : 0;
          const isDone = !!prog?.done;
          const progressMax = prog ? prog.total : p.modules.length;
          return (
            <Card key={p.title} className="p-4 sm:p-6" id={`parcours-${p.slug}`}>
              <CardHeader className="pb-2">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <Badge variant="primary">{p.difficulty}</Badge>
                  <span className="text-sm text-text-secondary">
                    {p.duration}
                  </span>
                  <span aria-hidden="true" className="hidden text-sm text-text-muted sm:inline">·</span>
                  <span className="text-sm text-text-muted">{p.timePerWeek}</span>
                  <span aria-hidden="true" className="hidden text-sm text-text-muted sm:inline">·</span>
                  <span className="text-sm text-text-muted">{totalXp} XP à gagner</span>
                  {isDone && <Badge variant="success">{LISTE_PARCOURS.termine}</Badge>}
                </div>
                <CardTitle className="mt-3 text-2xl">
                  <span id={`parcours-title-${p.slug}`} tabIndex={-1} className="scroll-mt-24 focus:outline-none">
                    <span className="mr-2" aria-hidden="true">{p.emoji}</span>
                    {p.title}
                  </span>
                </CardTitle>
                <p className="mt-1 text-sm font-medium text-accent-link">
                  {p.persona}
                </p>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-text-secondary">{stripEmDashes(p.description)}</p>

                {/* Testimonial */}
                <p className="mb-6 rounded-lg bg-accent-primary/5 p-3 text-sm italic text-text-secondary">
                  {stripEmDashes(p.testimonial)}
                </p>

                {/* Progression : affichée seulement une fois le parcours commencé (T26) */}
                {progressValue > 0 && (
                  <div className="mb-6">
                    {/* Libellé passé à la barre : nom accessible de la progressbar (axe, s16). */}
                    <ProgressBar label={`${progressValue}/${progressMax} étapes`} value={progressValue} max={progressMax} />
                    <p className="mt-2 text-right text-xs text-text-muted">{totalXp} XP à gagner</p>
                  </div>
                )}

                {/* Programme replié par défaut (T24) */}
                <details
                  className="group mb-6"
                  open={openSlugs.has(p.slug)}
                  onToggle={(e) => setProgrammeOpen(p.slug, e.currentTarget.open)}
                >
                  <summary className="flex min-h-[44px] cursor-pointer list-none items-center justify-between gap-2 rounded-md border border-border px-3 text-sm font-semibold uppercase tracking-wider text-text-secondary hover:text-text-primary [&::-webkit-details-marker]:hidden">
                    Programme
                    <svg className="h-4 w-4 shrink-0 transition-transform group-open:rotate-180" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <ol className="mt-3 space-y-2">
                    {p.modules.map((m) => (
                      <li
                        key={m.week}
                        className="flex flex-col gap-2 rounded-md bg-background-elevated p-3 sm:flex-row sm:items-start sm:gap-3"
                      >
                        <Badge variant="secondary" className="w-fit shrink-0 whitespace-nowrap sm:mt-0.5 sm:w-[5.25rem] sm:justify-center">
                          {m.week}
                        </Badge>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-medium text-text-primary">
                              {m.title}
                            </span>
                            {m.free && (
                              <Badge variant="success">{ETAPE_LIBRE_BADGE}</Badge>
                            )}
                          </div>
                          <p className="mt-1 text-sm text-text-secondary">
                            {m.detail}
                          </p>
                          <p className="mt-1 text-xs text-text-muted">
                            Format : {m.format}
                          </p>
                          <span className="mt-1 inline-block text-xs text-accent-link">
                            +{m.xp} XP
                          </span>
                        </div>
                      </li>
                    ))}
                  </ol>
                </details>

                <div className="flex flex-col gap-2">
                  <Button
                    variant="primary"
                    size="lg"
                    className="w-full sm:w-auto"
                    onClick={() => handleCta(p.slug)}
                  >
                    {isDone ? LISTE_PARCOURS.revoir : progressValue > 0 ? "Continuer ce parcours" : "Commencer ce parcours"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {parcoursEntame && quizOrientation}
    </>
  );
}
