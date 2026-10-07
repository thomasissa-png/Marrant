"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/ui/progress-bar";
import { trackUmami } from "@/lib/umami";
import { formatDifficulty, withEmojiPresentation } from "@/lib/parcours-labels";
import { stripEmDashes } from "@/lib/em-dash";
import { canAccessParcoursStep, isPremiumPlan } from "@/lib/parcours-access";
import { buildAbonnementUrl } from "@/lib/premium-return";
import {
  derniereValidation,
  formatDateConseillee,
  PARCOURS_BONUS_FIN_XP,
  prochaineEtapeConseillee,
  totalParcoursXp,
} from "@/lib/parcours-xp";
import { readParcoursSrc } from "@/lib/parcours-tracking";
import { ecrireProgressionCache, lireProgressionCache } from "@/lib/parcours-progress-cache";
import { useUserStore } from "@/stores/user-store";
import { RAPPEL_PARCOURS_API } from "@/app/(dashboard)/profil/rappel-parcours-toggle";
import {
  etapeContexteTexte,
  progressionVisiteurTexte,
  prochaineEtapeTexte,
  APERCU_INTRO,
  CHARGEMENT_PREMIUM,
  PROCHAINE_ETAPE_DISPONIBLE,
  RAPPEL_LIEN,
  TITRES_SECTIONS,
  totalXpTexte,
  XP_GAIN,
} from "@/config/textes/parcours";
import { etapeAfficheEchec, ParcoursStepCard } from "@/components/parcours/parcours-step-card";
import { PathCompletionCard } from "@/components/parcours/path-completion-card";
import type { PathData, StatutParcours, Step, UserProgress } from "@/components/parcours/parcours-types";

export type { PathData, UserProgress } from "@/components/parcours/parcours-types";

interface ByslugResponse {
  path?: PathData;
  userProgress?: UserProgress | null;
  stepValidations?: Array<{ stepOrder: number; completedAt: string }>;
}

function firstIncomplete(steps: Step[], completed: number[]): number | null {
  return steps.find((s) => !completed.includes(s.order))?.order ?? null;
}

/** Étape visée par l'ancre `#etape-N` des liens d'entrée (lot C), lue côté navigateur. */
function readHashStep(): number | null {
  if (typeof window === "undefined") return null;
  const match = window.location.hash.match(/^#etape-(\d{1,3})$/);
  return match ? Number(match[1]) : null;
}

/**
 * Étape à ouvrir : celle de l'ancre si elle est accessible (déjà faite, à
 * reprendre, ou aperçu d'un non-abonné), sinon la première non faite.
 */
function stepToOpen(steps: Step[], completed: number[], hashStep: number | null): number | null {
  const next = firstIncomplete(steps, completed);
  const target = hashStep !== null ? steps.find((s) => s.order === hashStep) : undefined;
  if (target && (next === null || target.order <= next || target.locked)) return target.order;
  return next;
}

export function ParcoursDetail({
  slug,
  initialPath = null,
  initialProgress = null,
}: {
  slug: string;
  /** Contenu pré-rendu côté serveur (ISR) : étape 1 complète, aperçu des étapes 2+. */
  initialPath?: PathData | null;
  /** Progression pré-chargée (null : chargée côté navigateur après la session). */
  initialProgress?: UserProgress | null;
}) {
  const [path, setPath] = useState<PathData | null>(initialPath);
  const [progress, setProgress] = useState<UserProgress | null>(initialProgress);
  const [isLoading, setIsLoading] = useState<boolean>(!initialPath);
  const [fetchError, setFetchError] = useState(false);
  // s17 tour 2 : état du chargement abonné (HTML ISR) : « attente » tant que l'API n'a pas répondu.
  const [enrich, setEnrich] = useState<"attente" | "ok" | "echec">("attente");
  const [reloadKey, setReloadKey] = useState(0);
  const [lastValidation, setLastValidation] = useState<string | null>(null);
  const [nextRecommended, setNextRecommended] = useState<string | null>(null);
  const [serverXpTotal, setServerXpTotal] = useState<number | null>(null);
  const [retours, setRetours] = useState<Record<number, string>>({});
  const [expandedStep, setExpandedStep] = useState<number | null>(() =>
    initialPath ? firstIncomplete(initialPath.steps, initialProgress?.completedSteps ?? []) : null,
  );
  const [completing, setCompleting] = useState<number | null>(null);
  // s17 tour 3 (QA) : l'échec de validation s'affiche dans la carte de l'étape, près de « Valider ».
  const [completionError, setCompletionError] = useState<{ order: number; message: string } | null>(null);
  // s17 tour 1 (UXV-1-01, DES-1-01, bugs 1 et 3 QA) : résultat affiché dans la carte validée,
  // sans minuterie ; l'annonce vocale reste dans une zone permanente.
  const [stepResults, setStepResults] = useState<Record<number, { xp: string | null; rythme: string | null }>>({});
  const [annonce, setAnnonce] = useState("");
  // s17 tour 1 (UXV-1-02) : invitation au rappel seulement pour un compte qui y a droit et ne l'a pas activé.
  const [rappelInvite, setRappelInvite] = useState(false);
  const [quizDone, setQuizDone] = useState<Set<number>>(new Set());
  const quizStorageKey = `parcours-quiz-done:${slug}`;
  const openTrigger = useRef<"auto" | "manuel">("auto");
  const openedSteps = useRef<Set<number>>(new Set());
  const openedAt = useRef<Map<number, number>>(new Map());
  const openTracked = useRef(false);
  const focusAfterValidation = useRef<{ validee: number; suivante: number } | "fin" | null>(null);
  const completionHeading = useRef<HTMLHeadingElement>(null);
  const hashStep = useRef<number | null>(null);
  // s17 tour 4 (QA) : étape d'arrivée par ancre à recaler une fois le chargement abonné terminé.
  const ancreARecaler = useRef<number | null>(null);
  const cacheApplique = useRef(false);
  const reessayerRef = useRef<HTMLButtonElement>(null);

  const { status, data: session } = useSession();
  const storeUser = useUserStore((s) => s.user);
  // Plan lu dans la session ou dans le store : l'un ou l'autre suffit (l'API tranche en dernier).
  const isPremium =
    status === "authenticated" &&
    (isPremiumPlan((session?.user as { plan?: string } | undefined)?.plan) || isPremiumPlan(storeUser?.plan));
  const statut: StatutParcours = isPremium ? "premium" : status === "authenticated" ? "membre" : "visiteur";
  // Valider une étape (étape 1 comprise) fait partie de Premium (s15 §1.1).
  const userId = (session?.user as { id?: string } | undefined)?.id;
  const abonnementHref = buildAbonnementUrl(`/parcours/${slug}`, "monthly", "parcours-etape");

  // T29 : quiz réussis gardés pendant l'onglet (détour par l'inscription).
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(quizStorageKey);
      if (raw) setQuizDone(new Set(JSON.parse(raw) as number[]));
    } catch {
      // sessionStorage indisponible : on repart de zéro.
    }
  }, [quizStorageKey]);

  useEffect(() => {
    if (quizDone.size === 0) return;
    try {
      sessionStorage.setItem(quizStorageKey, JSON.stringify([...quizDone]));
    } catch {
      // Sans stockage, le quiz reste à refaire.
    }
  }, [quizDone, quizStorageKey]);

  const applyServerData = useCallback((data: ByslugResponse) => {
    if (data.path?.steps) setPath(data.path);
    if (data.userProgress) setProgress(data.userProgress);
    if (data.path?.steps) ecrireProgressionCache(slug, userId, data.userProgress ?? null);
    // Ouverture directe sur l'étape visée ou à reprendre (UX-11).
    const next = data.path?.steps
      ? stepToOpen(data.path.steps, data.userProgress?.completedSteps ?? [], hashStep.current)
      : null;
    // UXV-1-03 : parcours terminé sans ancre = toutes les étapes repliées (next vaut alors null).
    if (next !== null || data.userProgress?.completedAt) setExpandedStep(next);
    setLastValidation(derniereValidation(data.stepValidations));
  }, [slug, userId]);

  useEffect(() => {
    if (initialPath) {
      // HTML ISR = aperçu des étapes 2+ : l'API (plan vérifié en base) apporte le contenu d'un abonné.
      if (status !== "authenticated") return;
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 10_000);
      let annule = false;
      setEnrich("attente");
      // s17 tour 2 : dernière progression connue affichée tout de suite (jamais « 0/N » par défaut).
      const cache = lireProgressionCache(slug, userId);
      if (cache && !cacheApplique.current) {
        cacheApplique.current = true;
        setProgress((prev) => prev ?? cache);
        setExpandedStep(stepToOpen(initialPath.steps, cache.completedSteps, hashStep.current ?? readHashStep()));
      }
      fetch(`/api/parcours/by-slug/${encodeURIComponent(slug)}`, { signal: controller.signal })
        .then((res) => (res.ok ? res.json() : Promise.reject(new Error(String(res.status)))))
        .then((data: ByslugResponse) => {
          if (annule) return;
          applyServerData(data);
          setEnrich("ok");
        })
        .catch(() => {
          if (annule) return;
          // FS-09 : plus d'attente silencieuse ; s17 tour 2 : message et « Réessayer » au niveau de la page.
          setEnrich("echec");
          trackUmami("parcours-erreur", { parcours: slug, etape: 0, motif: "chargement" });
        })
        .finally(() => clearTimeout(timer));
      return () => {
        annule = true;
        clearTimeout(timer);
        controller.abort();
      };
    }

    // Repli historique : pas de rendu serveur, chargement complet côté navigateur.
    fetch(`/api/parcours/by-slug/${encodeURIComponent(slug)}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data: ByslugResponse | null) => {
        if (data?.path) applyServerData(data);
        else setFetchError(true);
      })
      .catch(() => setFetchError(true))
      .finally(() => setIsLoading(false));
  }, [slug, initialPath, status, reloadKey, applyServerData, userId]);

  // s17 tour 2 (DES-2-01) : nouvel échec après « Réessayer » = focus rendu au bouton (le précédent a disparu).
  useEffect(() => {
    if (enrich === "echec" && reloadKey > 0) reessayerRef.current?.focus();
  }, [enrich, reloadKey]);

  // Ancre #etape-N à l'arrivée (HTML ISR) : l'étape s'ouvre et vient à l'écran.
  useEffect(() => {
    hashStep.current = readHashStep();
    if (!initialPath || hashStep.current === null) return;
    const target = stepToOpen(initialPath.steps, initialProgress?.completedSteps ?? [], hashStep.current);
    if (target === null) return;
    setExpandedStep(target);
    ancreARecaler.current = target;
    requestAnimationFrame(() => document.getElementById(`etape-${target}`)?.scrollIntoView?.({ block: "start" }));
    // Lecture unique à l'arrivée.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // s17 tour 4 (QA) : le défilement d'arrivée est calculé sur la page longue du HTML ISR ; quand le
  // chargement abonné aboutit (contenu) ou échoue (message), la page raccourcit et la carte passait
  // sous l'en-tête fixe. Recalage unique sous l'en-tête (scroll-mt-28), sans toucher au focus.
  useEffect(() => {
    if (ancreARecaler.current === null || enrich === "attente") return;
    const cible = expandedStep ?? ancreARecaler.current;
    ancreARecaler.current = null;
    document.getElementById(`etape-${cible}`)?.scrollIntoView?.({ behavior: "instant", block: "start" });
  }, [enrich, expandedStep]);

  // parcours-ouvert : une fois par affichage, session résolue (data-analyst §5.1).
  useEffect(() => {
    if (status === "loading" || openTracked.current) return;
    openTracked.current = true;
    trackUmami("parcours-ouvert", { parcours: slug, statut, src: readParcoursSrc() });
  }, [status, slug, statut]);

  // Retours déjà donnés sur les exercices (abonné, route du lot A).
  const pathId = path?.id ?? "";
  const tracksProgress = isPremium && pathId !== "" && !pathId.startsWith("seed-");
  useEffect(() => {
    if (!tracksProgress) return;
    fetch(`/api/parcours/${encodeURIComponent(pathId)}/retour`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { retours?: Array<{ stepOrder: number; retour: string }> } | null) => {
        if (!data?.retours) return;
        setRetours(Object.fromEntries(data.retours.map((r) => [r.stepOrder, r.retour])));
      })
      .catch(() => {
        // Facultatif : sans historique, les boutons restent simplement vides.
      });
  }, [tracksProgress, pathId]);

  useEffect(() => {
    if (!tracksProgress) return;
    const controller = new AbortController();
    fetch(RAPPEL_PARCOURS_API, { signal: controller.signal })
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { eligible?: boolean; enabled?: boolean } | null) => {
        setRappelInvite(data?.eligible === true && data.enabled !== true);
      })
      .catch(() => {
        // Sans réponse, pas d'invitation (jamais de lien vers une commande absente).
      });
    return () => controller.abort();
  }, [tracksProgress]);

  /** Appels secondaires de l'abonné (quiz = pratique D3, retour d'exercice) : jamais bloquants. */
  const postQuiet = (route: "quiz" | "retour", body: Record<string, string | number>) => {
    if (!tracksProgress) return;
    fetch(`/api/parcours/${encodeURIComponent(pathId)}/${route}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }).catch(() => {
      // Rien à montrer : la série ou le retour seront comptés à la prochaine action.
    });
  };

  // etape-ouverte : une fois par étape et par affichage, session résolue.
  useEffect(() => {
    if (status === "loading" || expandedStep === null) return;
    if (!openedAt.current.has(expandedStep)) openedAt.current.set(expandedStep, Date.now());
    if (openedSteps.current.has(expandedStep)) return;
    openedSteps.current.add(expandedStep);
    trackUmami("etape-ouverte", { parcours: slug, etape: expandedStep, statut, declencheur: openTrigger.current });
    openTrigger.current = "auto";
  }, [expandedStep, status, slug, statut]);

  // Après validation : focus sur l'étape suivante ou sur la carte de fin (UX-05 d, UX-09 d).
  // s17 tour 1 : la carte validée (gain d'XP, date conseillée) est calée sous l'en-tête
  // (scroll-mt-28, DES-3-05), l'étape suivante ouverte juste en dessous.
  useEffect(() => {
    const target = focusAfterValidation.current;
    if (target === null) return;
    focusAfterValidation.current = null;
    const reduit = typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const behavior: ScrollBehavior = reduit ? "auto" : "smooth";
    if (target === "fin") {
      completionHeading.current?.scrollIntoView?.({ behavior, block: "start" });
      completionHeading.current?.focus({ preventScroll: true });
      return;
    }
    document.getElementById(`etape-${target.validee}`)?.scrollIntoView?.({ behavior, block: "start" });
    document.getElementById(`etape-${target.suivante}-entete`)?.focus({ preventScroll: true });
  }, [progress, expandedStep]);

  const toggleStep = (order: number, isExpanded: boolean) => {
    openTrigger.current = "manuel";
    setExpandedStep(isExpanded ? null : order);
  };

  const handleCompleteStep = async (stepOrder: number) => {
    if (!path || !isPremium) {
      window.location.assign(abonnementHref);
      return;
    }
    setCompleting(stepOrder);
    setCompletionError(null);
    try {
      const res = await fetch(`/api/parcours/${path.id}/progress`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stepOrder }),
      });
      if (res.ok) {
        const data = (await res.json()) as {
          progress?: UserProgress;
          xpGained?: number;
          pathCompleted?: boolean;
          nextRecommendedAt?: string | null;
          pathXpTotal?: number;
        };
        const pathCompleted = data.pathCompleted === true;
        const base = data.progress ?? { completedSteps: [], currentStep: stepOrder, completedAt: null };
        const completed = [...new Set([...(base.completedSteps ?? []), stepOrder])];
        // A2 : la fin vient du serveur (`pathCompleted` ou `completedAt`), jamais d'un seuil d'XP.
        const completedAt = base.completedAt ?? (pathCompleted ? new Date().toISOString() : null);
        setProgress({ ...base, completedSteps: completed, completedAt });
        ecrireProgressionCache(slug, userId, { ...base, completedSteps: completed, completedAt });
        setLastValidation(new Date().toISOString());
        setNextRecommended(data.nextRecommendedAt ?? null);
        // Total réel lu côté serveur (lot A), étapes + bonus de fin.
        if (typeof data.pathXpTotal === "number") setServerXpTotal(data.pathXpTotal);
        const opened = openedAt.current.get(stepOrder);
        trackUmami("parcours-etape", {
          parcours: slug,
          etape: stepOrder,
          etapes: path.steps.length,
          termine: pathCompleted ? "oui" : "non",
          ...(opened !== undefined && { duree_s: Math.min(3600, Math.round((Date.now() - opened) / 1000)) }),
        });
        if (pathCompleted) {
          const started = base.startedAt ? new Date(base.startedAt).getTime() : NaN;
          trackUmami("parcours-termine", {
            parcours: slug,
            jours: Number.isNaN(started) ? 0 : Math.max(0, Math.floor((Date.now() - started) / 86_400_000)),
            etapes: path.steps.length,
          });
        }
        const xp = data.xpGained ?? 0;
        const xpTexte = xp > 0 ? (pathCompleted ? XP_GAIN.fin(xp, PARCOURS_BONUS_FIN_XP) : XP_GAIN.etape(xp)) : null;
        // Étalon 3.3 A : date du serveur si elle est à venir, sinon 7 jours après cette validation.
        const serveur = data.nextRecommendedAt ? new Date(data.nextRecommendedAt) : null;
        const dateConseillee =
          serveur && serveur.getTime() > Date.now() ? serveur : prochaineEtapeConseillee(new Date().toISOString());
        const rythme = pathCompleted
          ? null
          : dateConseillee
            ? prochaineEtapeTexte(formatDateConseillee(dateConseillee))
            : PROCHAINE_ETAPE_DISPONIBLE;
        setStepResults((prev) => ({ ...prev, [stepOrder]: { xp: xpTexte, rythme } }));
        setAnnonce([xpTexte, rythme].filter(Boolean).join(" "));
        const nextStep = path.steps.find((s) => s.order > stepOrder && !completed.includes(s.order));
        if (pathCompleted || !nextStep) {
          focusAfterValidation.current = "fin";
          setExpandedStep(null);
        } else {
          focusAfterValidation.current = { validee: stepOrder, suivante: nextStep.order };
          setExpandedStep(nextStep.order);
        }
      } else {
        const err = (await res.json().catch(() => null)) as { error?: string; code?: string } | null;
        // Codes du lot A → motifs fermés de data-analyst §5.1 (« ordre » = refus d'ordre conseillé).
        const motif =
          res.status === 429 ? "limite" : res.status === 403 || res.status === 409 ? "refus" : "serveur";
        trackUmami("parcours-erreur", { parcours: slug, etape: stepOrder, motif });
        setCompletionError({
          order: stepOrder,
          message:
            res.status === 429
              ? "Doucement, tu cliques plus vite que ton ombre. Attends un instant et réessaie."
              : err?.code === "ordre" && err.error
                ? err.error
                : "L'étape n'a pas voulu se valider. Réessaie.",
        });
      }
    } catch {
      trackUmami("parcours-erreur", { parcours: slug, etape: stepOrder, motif: "reseau" });
      setCompletionError({ order: stepOrder, message: "La connexion a lâché en route. Vérifie ton réseau et réessaie." });
    } finally {
      setCompleting(null);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4" aria-busy="true">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="py-8">
              <div className="h-6 w-2/3 rounded bg-background-elevated" />
              <div className="mt-3 h-4 w-full rounded bg-background-elevated" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!path || fetchError) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-text-secondary">
            {fetchError
              ? "Ce parcours ne veut pas se charger pour l'instant. Réessaie un peu plus tard."
              : "Ce parcours n'existe pas, ou plus."}{" "}
            <Link href="/parcours" className="text-accent-link underline underline-offset-2">
              Voir tous les parcours
            </Link>
          </p>
        </CardContent>
      </Card>
    );
  }

  const completedSteps = progress?.completedSteps ?? [];
  const totalSteps = path.steps.length;
  const isPathCompleted = !!progress?.completedAt;
  const totalXp = serverXpTotal ?? totalParcoursXp(path.steps);
  const isSeedFallback = path.id.startsWith("seed-");
  // s17 tour 2 : HTML ISR = progression inconnue tant que l'API (ou le cache du compte) ne l'a pas donnée.
  const attendApi = !!initialPath && status === "authenticated";
  const chargementPremium = isPremium && attendApi && enrich === "attente";
  const echecPremium = isPremium && attendApi && enrich === "echec";
  const progressionConnue = progress !== null || !attendApi || enrich === "ok";
  // D1 : ordre conseillé pour l'abonné seulement. s17 tour 2 : pas de verrou tant que la progression est inconnue.
  const etapeVerrouillee = (stepIndex: number) =>
    isPremium &&
    progressionConnue &&
    !completedSteps.includes(path.steps[stepIndex].order) &&
    !path.steps.slice(0, stepIndex).every((s) => completedSteps.includes(s.order));
  const etapeAccessible = (order: number) => canAccessParcoursStep(order, isPremium ? "PREMIUM" : null);
  // s17 tour 3 (UXV-3-01) : étape dépliée qui affiche l'échec = elle porte l'alerte et le seul « Réessayer ».
  const etapeEnEchec = path.steps.findIndex((step, i) =>
    etapeAfficheEchec({
      step,
      isExpanded: expandedStep === step.order,
      isSequentiallyLocked: etapeVerrouillee(i),
      isPremiumLocked: !etapeAccessible(step.order),
      loadFailed: enrich === "echec",
    }),
  );
  // D2 (étalon 3.3 A) : date du serveur (lot A) si fournie, sinon 7 jours après la
  // dernière validation connue ; date passée = « La prochaine étape t'attend. ».
  const showRythme = isPremium && !isPathCompleted && completedSteps.length > 0 && (!!nextRecommended || !!lastValidation);
  const nextDate = !showRythme
    ? null
    : nextRecommended && new Date(nextRecommended).getTime() > Date.now()
      ? new Date(nextRecommended)
      : prochaineEtapeConseillee(lastValidation);

  // s17 tour 2 (DES-2-11) : parcours terminé, l'argumentaire (intro, « Pour qui ? ») passe après la carte de fin.
  const argumentaire = (
    <>
      <p className="mt-4 text-text-secondary">{stripEmDashes(path.description)}</p>
      {(path.personaTagline || path.testimonial) && (
        <section aria-labelledby="parcours-pour-qui" className="mt-4">
          <h2 id="parcours-pour-qui" className="font-display text-lg font-bold">{TITRES_SECTIONS.pourQui}</h2>
          {path.personaTagline && (
            <p className="mt-2 text-sm font-medium text-accent-link">{path.personaTagline}</p>
          )}
          {path.testimonial && (
            <p className="mt-3 rounded-lg bg-accent-primary/5 p-3 text-sm italic text-text-secondary">
              {stripEmDashes(path.testimonial)}
            </p>
          )}
        </section>
      )}
    </>
  );

  return (
    <>
      <div className="mb-8">
        <nav aria-label="Fil d'Ariane" className="mb-4 text-sm text-text-muted">
          <Link href="/" className="hover:text-text-primary max-md:py-3.5">Accueil</Link>
          <span className="mx-2">/</span>
          <Link href="/parcours" className="hover:text-text-primary max-md:py-3.5">Parcours</Link>
          <span className="mx-2">/</span>
          <span className="text-text-secondary">{path.title}</span>
        </nav>

        <div className="flex items-center gap-3">
          <span className="text-4xl" aria-hidden="true">{withEmojiPresentation(path.icon)}</span>
          <div>
            <h1 className="font-display text-3xl font-bold">{path.title}</h1>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <Badge variant="primary">{formatDifficulty(path.difficultyLabel ?? path.difficulty)}</Badge>
              <span className="text-sm text-text-muted">{path.duration}</span>
            </div>
          </div>
        </div>
        {!isPathCompleted && argumentaire}
      </div>

      {/* DES-1-16 : carte resserrée (une ligne pour le visiteur). */}
      <Card className={isPremium ? "mb-8" : "mb-8 py-3"} aria-busy={chargementPremium || undefined}>
        <CardContent className={isPremium ? "py-2" : ""}>
          {isPremium ? (
            <>
              {/* Libellé passé à la barre : nom accessible de la progressbar (axe, s16).
                  s17 tour 2 : progression inconnue = squelette, jamais « 0/N » par défaut. */}
              {progressionConnue ? (
                <ProgressBar
                  label={isPathCompleted ? "Parcours terminé !" : `${completedSteps.length}/${totalSteps} étapes complétées`}
                  value={completedSteps.length}
                  max={totalSteps}
                  variant="gradient"
                />
              ) : (
                chargementPremium && (
                  <div aria-hidden="true" data-testid="progression-squelette" className="animate-pulse motion-reduce:animate-none">
                    <div className="mb-1 h-4 w-40 rounded bg-background-elevated" />
                    <div className="h-2 w-full rounded-full bg-background-elevated" />
                  </div>
                )
              )}
              {chargementPremium && (
                <p role="status" className="mt-2 text-sm text-text-muted">{CHARGEMENT_PREMIUM.enCours}</p>
              )}
              {/* s17 tour 2 (DES-2-01, UXV-2-01) : échec signalé au niveau de la page, progression gardée.
                  s17 tour 3 (UXV-3-01) : étape dépliée en échec, le haut reste neutre (ni bouton ni alerte). */}
              {echecPremium && etapeEnEchec >= 0 && (
                <p className="mt-2 text-sm text-text-muted" data-testid="echec-premium-neutre">
                  {CHARGEMENT_PREMIUM.echecTexte}
                </p>
              )}
              {echecPremium && etapeEnEchec < 0 && (
                <div role="alert" className="mt-3 rounded-lg border-l-2 border-error-text bg-error/10 p-3 text-sm text-error-text">
                  <p className="font-semibold">{CHARGEMENT_PREMIUM.echec}</p>
                  <p className="mt-1">{CHARGEMENT_PREMIUM.echecTexte}</p>
                  <Button
                    ref={reessayerRef}
                    variant="outline"
                    className="mt-3 min-h-[44px] w-full border-text-muted hover:border-text-primary sm:w-auto"
                    onClick={() => setReloadKey((k) => k + 1)}
                  >
                    {CHARGEMENT_PREMIUM.reessayer}
                  </Button>
                </div>
              )}
              {/* DES-1-16 : total à gagner en secondaire, pour ne pas le lire comme un gain.
                  s17 tour 2 (DES-2-05) : parcours terminé, la carte de fin dit déjà l'XP gagné. */}
              {!isPathCompleted && (
                <p className="mt-2 text-right text-sm text-text-secondary">
                  {totalXpTexte(totalXp, PARCOURS_BONUS_FIN_XP)}
                </p>
              )}
              {showRythme && (
                <p className="mt-2 text-sm text-text-secondary">
                  {nextDate ? prochaineEtapeTexte(formatDateConseillee(nextDate)) : PROCHAINE_ETAPE_DISPONIBLE}
                </p>
              )}
              {!isPathCompleted && rappelInvite && (
                <p className="mt-2 text-xs text-text-muted">
                  {RAPPEL_LIEN.texte}{" "}
                  <Link
                    href="/profil#rappel-parcours"
                    className="inline-flex min-h-[44px] items-center text-accent-link underline underline-offset-2 sm:min-h-0"
                  >
                    {RAPPEL_LIEN.lien}
                  </Link>
                </p>
              )}
            </>
          ) : (
            // QA-13 : pas de barre immobile pour un non-abonné.
            <p className="text-sm text-text-secondary">{progressionVisiteurTexte(totalSteps)}</p>
          )}
        </CardContent>
      </Card>

      {/* Zone d'annonce permanente du gain d'XP (UX-05, UX-09 c) : elle ne se démonte pas avec l'étape.
          s17 tour 1 : le texte visible est dans la carte validée ; ici, l'annonce vocale seule (plus de 16 px morts). */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {annonce}
      </div>

      {/* UXV-1-03 : parcours terminé, la carte de fin et le bilan passent avant « Le programme ». */}
      {isPathCompleted && (
        <PathCompletionCard
          ref={completionHeading}
          slug={slug}
          title={path.title}
          totalXp={totalXp}
          stepTitles={path.steps.map((s) => s.moduleTitle ?? s.tip.title)}
          retours={retours}
          nextParcours={path.nextParcours}
          nextParcoursReason={path.nextParcoursReason}
        />
      )}
      {isPathCompleted && <div className="mb-8">{argumentaire}</div>}

      <h2 className="mb-4 font-display text-xl font-bold">{TITRES_SECTIONS.programme}</h2>
      {!isPremium && <p className="mb-4 text-sm text-text-secondary">{APERCU_INTRO}</p>}
      <div className="space-y-4" role="list" aria-label="Étapes du parcours" aria-busy={chargementPremium || undefined}>
        {path.steps.map((step, stepIndex) => {
          const isCompleted = completedSteps.includes(step.order);
          return (
            <ParcoursStepCard
              key={step.id}
              step={step}
              slug={slug}
              timePerWeek={path.timePerWeek}
              isPremium={isPremium}
              isCompleted={isCompleted}
              isExpanded={expandedStep === step.order}
              // D1 : le visiteur ouvre l'aperçu ; règle de l'abonné dans etapeVerrouillee.
              isSequentiallyLocked={etapeVerrouillee(stepIndex)}
              isPremiumLocked={!etapeAccessible(step.order)}
              previousOrder={path.steps[stepIndex - 1]?.order ?? null}
              isQuizDone={quizDone.has(step.order)}
              isSeedFallback={isSeedFallback}
              completing={completing === step.order}
              abonnementHref={abonnementHref}
              loadFailed={enrich === "echec"}
              onRetryLoad={() => setReloadKey((k) => k + 1)}
              reessayerRef={stepIndex === etapeEnEchec ? reessayerRef : undefined}
              onToggle={() => toggleStep(step.order, expandedStep === step.order)}
              onQuizComplete={(score, total) => {
                setQuizDone((prev) => new Set(prev).add(step.order));
                trackUmami("quiz-etape-termine", { parcours: slug, etape: step.order, score, total, statut });
                postQuiet("quiz", { stepOrder: step.order });
              }}
              retour={retours[step.order] ?? null}
              onRetour={(resultat) => {
                setRetours((prev) => ({ ...prev, [step.order]: resultat }));
                postQuiet("retour", { stepOrder: step.order, retour: resultat });
              }}
              onComplete={() => handleCompleteStep(step.order)}
              erreurValidation={completionError?.order === step.order ? completionError.message : null}
              resultat={stepResults[step.order] ?? null}
              contexte={stepIndex === 0 ? etapeContexteTexte(path.title, path.duration) : null}
            />
          );
        })}
      </div>

      {/* UX-06 : pas de « parcours suivant » en cours de route pour un abonné. */}
      {!isPathCompleted && !isPremium && path.nextParcours && (
        <div className="mt-8 rounded-lg border border-border p-4 text-center">
          <p className="text-sm text-text-muted">
            Tu y prends goût ?{" "}
            <Link
              href={`/parcours/${path.nextParcours}?src=suite`}
              className="text-accent-link underline underline-offset-2"
            >
              Jette un œil au parcours suivant
            </Link>
          </p>
        </div>
      )}
    </>
  );
}
