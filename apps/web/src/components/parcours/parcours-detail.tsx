"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Card, CardContent, FILET_MASQUE } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { CADRE_CARTE_NEUTRE } from "@/components/espace/carte/styles";
import { ECHELLE_CARTES_PARTAGEES, META, META_FORT, TEXTE, TEXTE_FORT, TITRE_CARTE, TITRE_PAGE } from "@/components/espace/typo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/ui/progress-bar";
import { trackUmami } from "@/lib/umami";
import { signalerAcces } from "@/lib/mesure/signal-acces";
import { formatDifficulty, withEmojiPresentation } from "@/lib/parcours-labels";
import { stripEmDashes } from "@/lib/em-dash";
import { frEspace, frTypoTexte } from "@/lib/fr-typo";
import { canAccessParcoursStep, isPremiumPlan } from "@/lib/parcours-access";
import { buildAbonnementUrl } from "@/lib/premium-return";
import { buildRegisterUrl } from "@/lib/auth-links";
import { estRepliSeed } from "@/lib/parcours-preview";
import {
  derniereValidation,
  formatDateConseillee,
  PARCOURS_BONUS_FIN_XP,
  prochaineEtapeConseillee,
  totalParcoursXp,
  xpGagnesParcours,
} from "@/lib/parcours-xp";
import { readParcoursSrc } from "@/lib/parcours-tracking";
import { ecrireProgressionCache, lireProgressionCache } from "@/lib/parcours-progress-cache";
import { useUserStore } from "@/stores/user-store";
import { RAPPEL_PARCOURS_API } from "@/app/(dashboard)/profil/rappel-parcours-toggle";
import {
  etapeContexteTexte,
  etapeLienTexte,
  progressionVisiteurTexte,
  prochaineEtapeTexte,
  CHARGEMENT_PREMIUM,
  PROCHAINE_ETAPE_DISPONIBLE,
  RAPPEL_LIEN,
  TITRES_SECTIONS,
  xpProgressionTexte,
  XP_GAIN,
} from "@/config/textes/parcours";
import { etapeAfficheEchec, ParcoursStepCard } from "@/components/parcours/parcours-step-card";
import { LettreRepliee } from "@/components/lettre/lettre-repliee";
import { FIN_ETAPE_1 } from "@/config/textes/cta-pages";
import { isParcoursSlug } from "@/lib/entrees-parcours";
import { PathCompletionCard } from "@/components/parcours/path-completion-card";
import type { AbonneInitial, PathData, StatutParcours, Step, UserProgress } from "@/components/parcours/parcours-types";
import { ESPACE_CLIENT_PUBLIE } from "@/config/espace-client";
import { MenuEtapes } from "@/components/espace/parcours/menu-etapes";
import { FicheActiveContexte, LignesFiches } from "@/components/espace/parcours/lignes-fiches";
import { PiedEtape } from "@/components/espace/parcours/navigation-etapes";
import { LienRetour } from "@/components/espace/lien-retour";
import { TEXTES_ESPACE_NAVIGATION } from "@/config/textes/espace-navigation";
import { TEXTES_PARCOURS_ESPACE } from "@/config/textes/espace-caps";
import { lirePosition, noterPosition, recalerAncre, recalerPosition, repererBloc, type PositionParcours } from "@/lib/espace/recaler-ancre";
import { AnnonceApresValidation } from "@/components/espace/parcours/annonce-apres-validation";

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
  if (match) return Number(match[1]);
  // s24 lot D4 : espace ouvert, `#fiche-N-M` ouvre l'étape N (fermé : ancre ignorée, comme aujourd'hui).
  const fiche = ESPACE_CLIENT_PUBLIE ? window.location.hash.match(/^#fiche-(\d{1,3})-\d{1,2}$/) : null;
  return fiche ? Number(fiche[1]) : null;
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

/**
 * s26 (`docs/design/parcours-vannes-s26.md` §2, interrupteur ouvert seulement) : la page pose une grille de 12 colonnes
 * dès 1024 px (`parcours/[slug]/page.tsx`) ; chaque bloc de ce composant y prend sa place par ses classes (aucun
 * élément ajouté ni déplacé dans le HTML) : colonne de 8 pour l'en-tête, le programme et la suite ; la carte de
 * progression (une ligne pour le visiteur, sommaire pour l'abonné) en rail collant de 4 à droite, sous l'en-tête
 * collant de 121 px (`lg:top-36`). Cadres neutres, filets violets masqués (décision du 18/11), échelle `typo.ts`.
 */
/*
 * s26 parcours connecté (`docs/design/parcours-connecte-s26.md` §3 ; `docs/ux/parcours-connecte-s26.md` §4, arbitrage du
 * 19/11 : plus de rail collant) : en-tête en 7/5 dès 1024 px (fil d'Ariane, titre et argumentaire à gauche, carte de
 * progression à droite, haut aligné sur le haut du H1 par `lg:mt-9`, même bas), puis programme et suite sur 12 colonnes.
 * Abonné qui a déjà validé une étape (argumentaire après le programme) : gauche réduite au titre, la carte passe sous
 * l'en-tête sur 12 colonnes (une carte de 5 colonnes à côté d'un titre seul laisserait 200 px vides à gauche).
 */
const COLONNE_DETAIL = "lg:col-span-12";
const EN_TETE_GAUCHE = "lg:col-span-7";
// s26 tour 2 : `lg:flex lg:flex-col`, le contenu (liste des étapes) remplit la carte étirée au lieu de laisser 100 px vides.
const CARTE_DROITE = "lg:col-span-5 lg:col-start-8 lg:row-start-1 lg:mt-9 lg:self-stretch lg:flex lg:flex-col";
/** s26 tour 3 : nombre d'étapes dès lequel le sommaire de l'abonné passe sous l'en-tête (12 colonnes au lieu de 7/5). */
const SOMMAIRE_SOUS_EN_TETE_DES = 5;
const ouvert = (classes: string, ferme?: string) => (ESPACE_CLIENT_PUBLIE ? classes : ferme);
/**
 * s26 tour 2 (P3, relectures du tour 1 : corps des étapes hors échelle, au moins 5 accents violets) : posé sur la liste
 * des étapes, interrupteur ouvert seulement, ramène à l'échelle `typo.ts` les blocs PARTAGÉS avec le site fermé
 * (`step-blocks.tsx`, `parcours-step-card.tsx`, `step-quiz.tsx`) sans toucher leur HTML fermé : 12 -> 14 px, 18 -> 20 px,
 * 500 et 700 -> 600, gris atténué -> secondaire, liens de fiche violets -> blancs (soulignés), rayons 12 px. Les fonds
 * et bords violets (classes à barre oblique, hors de portée d'un sélecteur Tailwind) sont neutralisés dans les composants.
 */
const ECHELLE_ETAPES = cn(ECHELLE_CARTES_PARTAGEES, "[&_.rounded-lg]:rounded-xl");
/** s26 parcours v2 : haut d'une étape ouverte par ancre ou lien (128 px de `scroll-padding-top` + 9 de marge d'ancre). */
const ANCRE_ETAPE = 137;
const useLayoutEffectNavigateur = typeof window === "undefined" ? useEffect : useLayoutEffect;
/** s26 parcours v2 : menu d'étapes et étape unique dès 1024 px (sans `matchMedia`, tests : étroit). */
const estLarge = () => typeof window !== "undefined" && typeof window.matchMedia === "function" && window.matchMedia("(min-width: 1024px)").matches;

export function ParcoursDetail({
  slug,
  initialPath = null,
  initialProgress = null,
  abonneInitial = null,
}: {
  slug: string;
  /** Contenu pré-rendu côté serveur (ISR) : étape 1 complète, aperçu des étapes 2+. */
  initialPath?: PathData | null;
  /** Progression pré-chargée (null : chargée côté navigateur après la session). */
  initialProgress?: UserProgress | null;
  /**
   * s26 parcours, tour 7 bis : abonné lu côté serveur (interrupteur ouvert seulement, `page.tsx`). Présent, la page naît
   * à sa forme finale (contenu complet, progression, étape à reprendre ouverte, rappel, retours) : plus de période de
   * chargement ni de remise en page, les lectures du navigateur ne font que rafraîchir. Fermé : ignoré.
   */
  abonneInitial?: AbonneInitial | null;
}) {
  const abonne = ESPACE_CLIENT_PUBLIE ? abonneInitial : null;
  const pathDepart = abonne?.path ?? initialPath;
  const progressDepart = abonne ? abonne.progress : initialProgress;
  const [path, setPath] = useState<PathData | null>(pathDepart);
  const [progress, setProgress] = useState<UserProgress | null>(progressDepart);
  const [isLoading, setIsLoading] = useState<boolean>(!initialPath);
  const [fetchError, setFetchError] = useState(false);
  // s17 tour 2 : état du chargement abonné (HTML ISR) : « attente » tant que l'API n'a pas répondu.
  const [enrich, setEnrich] = useState<"attente" | "ok" | "echec">(abonne ? "ok" : "attente");
  const [reloadKey, setReloadKey] = useState(0);
  const [lastValidation, setLastValidation] = useState<string | null>(() => (abonne ? derniereValidation(abonne.stepValidations) : null));
  const [nextRecommended, setNextRecommended] = useState<string | null>(null);
  const [serverXpTotal, setServerXpTotal] = useState<number | null>(null);
  const [retours, setRetours] = useState<Record<number, string>>(abonne?.retours ?? {});
  const [expandedStep, setExpandedStep] = useState<number | null>(() =>
    pathDepart ? firstIncomplete(pathDepart.steps, progressDepart?.completedSteps ?? []) : null,
  );
  const [completing, setCompleting] = useState<number | null>(null);
  // s17 tour 3 (QA) : l'échec de validation s'affiche dans la carte de l'étape, près de « Valider ».
  const [completionError, setCompletionError] = useState<{ order: number; message: string } | null>(null);
  // s17 tour 1 (UXV-1-01, DES-1-01, bugs 1 et 3 QA) : résultat affiché dans la carte validée,
  // sans minuterie ; l'annonce vocale reste dans une zone permanente.
  const [stepResults, setStepResults] = useState<Record<number, { xp: string | null; rythme: string | null }>>({});
  const [annonce, setAnnonce] = useState("");
  // s24 lot D4 : nombre d'étapes validées sur cette page (relance la lecture de l'annonce de cap).
  const [validationsEspace, setValidationsEspace] = useState(0);
  // s17 tour 1 (UXV-1-02) : invitation au rappel seulement pour un compte qui y a droit et ne l'a pas activé.
  const [rappelInvite, setRappelInvite] = useState(abonne?.rappelInvite ?? false);
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
  // s26 tour 2 : position notée au départ, rendue au retour du navigateur (étape ouverte et défilement).
  const positionARestaurer = useRef<PositionParcours | null>(null);
  const cacheApplique = useRef(false);
  const reessayerRef = useRef<HTMLButtonElement>(null);
  // s26 parcours v2 (`docs/design/parcours-connecte-v2-s26.md` §2), espace ouvert : dès 1024 px, une seule étape visible,
  // la dernière ouverte (gardée si on la replie) ; sous 1024, haut de l'en-tête cliqué noté avant l'ouverture, rendu après.
  const [etapeVue, setEtapeVue] = useState<number | null>(null);
  const enteteClique = useRef<{ order: number; top: number } | null>(null);
  const allerAEtapeRef = useRef<((order: number) => void) | null>(null);
  // s26 parcours, tour 5 (F1, relecture UX v2) : sous-étape choisie (`#fiche-N-M`), seul état actif des fiches ; fiche
  // d'arrivée par l'adresse, recalée à la place de l'étape une fois le chargement abonné fini.
  const [ficheActive, setFicheActive] = useState<string | null>(null);
  const ficheARecaler = useRef<string | null>(null);
  const allerAFicheRef = useRef<((ancre: string) => void) | null>(null);

  const { status, data: session } = useSession();
  const storeUser = useUserStore((s) => s.user);
  // Plan lu dans la session ou dans le store : l'un ou l'autre suffit (l'API tranche en dernier).
  // Tour 7 bis : abonné lu côté serveur = Premium dès le premier rendu (session encore en lecture), sauf déconnexion.
  const isPremium =
    (!!abonne && status !== "unauthenticated") ||
    (status === "authenticated" &&
      (isPremiumPlan((session?.user as { plan?: string } | undefined)?.plan) || isPremiumPlan(storeUser?.plan)));
  const statut: StatutParcours = isPremium ? "premium" : status === "authenticated" ? "membre" : "visiteur";
  // s24 lot D4 : page enrichie de l'espace (sommaire, fiches, annonce de cap), abonné et interrupteur ouvert.
  const espaceOuvert = ESPACE_CLIENT_PUBLIE && isPremium;
  // Valider une étape (étape 1 comprise) fait partie de Premium (s15 §1.1).
  const userId = (session?.user as { id?: string } | undefined)?.id ?? abonne?.userId;
  const abonnementHref = buildAbonnementUrl(`/parcours/${slug}`, "monthly", "parcours-etape");
  // s21 concision (18/10) : le plein de fin d'étape 1 mène droit à l'inscription (même tunnel que
  // les autres boutons d'achat : /register, puis paiement ouvert seul, retour au parcours), sans
  // passer par /abonnement. Compte déjà connecté : /abonnement, comme AuthCta.
  // Concision v5 : la source n'est portée qu'une fois, par /register (`src=parcours-etape`) ;
  // `getPostSignupRedirect` la reporte sur /abonnement après l'inscription (checkout-ouvert).
  // v6 tour 2, point 14 (interrupteur ouvert) : compte connecté, plus de `finEtape1Href`. Le plein garde la même
  // destination (`ValidationWall` retombe sur `href`, le même `abonnementHref`) et la ligne « D'abord ton compte, puis
  // le paiement. » (`LigneCompte`, rendue seulement avec `finEtape1Href`), fausse pour lui, est masquée ; rien à la
  // place. Fermé : inchangé.
  const finEtape1Href =
    statut === "visiteur"
      ? buildRegisterUrl({ callbackUrl: buildAbonnementUrl(`/parcours/${slug}`, "monthly"), src: "parcours-etape" })
      : ESPACE_CLIENT_PUBLIE
        ? undefined
        : abonnementHref;

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
    // s26 tour 2 : retour du navigateur, l'étape ouverte au départ est rouverte telle quelle.
    if (positionARestaurer.current) setExpandedStep(positionARestaurer.current.etape);
    else if (next !== null || data.userProgress?.completedAt) setExpandedStep(next);
    setLastValidation(derniereValidation(data.stepValidations));
  }, [slug, userId]);

  useEffect(() => {
    if (initialPath) {
      // HTML ISR = aperçu des étapes 2+ : l'API (plan vérifié en base) apporte le contenu d'un abonné.
      // s19 (B1 rendu) : HTML construit sur le repli seed (parcours pas encore actif au build, mis en
      // cache 1 h) = relecture silencieuse de la base pour le visiteur aussi ; échec = le repli reste.
      if (status === "unauthenticated" && estRepliSeed(initialPath)) {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 5_000);
        fetch(`/api/parcours/by-slug/${encodeURIComponent(slug)}`, { signal: controller.signal })
          .then((res) => (res.ok ? res.json() : null))
          .then((data: ByslugResponse | null) => {
            if (data?.path?.steps && !estRepliSeed(data.path)) setPath(data.path);
          })
          .catch(() => {
            // Le repli seed reste affiché.
          })
          .finally(() => clearTimeout(timer));
        return () => {
          clearTimeout(timer);
          controller.abort();
        };
      }
      if (status !== "authenticated") return;
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 10_000);
      let annule = false;
      // s26 parcours, tour 7 bis : abonné lu côté serveur, page déjà à sa forme finale ; la lecture ne fait que rafraîchir
      // (contenu, progression, dates), sans état de chargement, sans rouvrir d'étape, sans message si elle échoue.
      if (abonne) {
        fetch(`/api/parcours/by-slug/${encodeURIComponent(slug)}`, { signal: controller.signal })
          .then((res) => (res.ok ? res.json() : null))
          .then((data: ByslugResponse | null) => {
            if (annule || !data?.path?.steps) return;
            setPath(data.path);
            if (data.userProgress) setProgress(data.userProgress);
            ecrireProgressionCache(slug, userId, data.userProgress ?? null);
            setLastValidation(derniereValidation(data.stepValidations));
          })
          .catch(() => {
            // La version lue côté serveur reste affichée.
          })
          .finally(() => clearTimeout(timer));
        return () => {
          annule = true;
          clearTimeout(timer);
          controller.abort();
        };
      }
      setEnrich("attente");
      // s17 tour 2 : dernière progression connue affichée tout de suite (jamais « 0/N » par défaut).
      const cache = lireProgressionCache(slug, userId);
      if (cache && !cacheApplique.current) {
        cacheApplique.current = true;
        setProgress((prev) => prev ?? cache);
        setExpandedStep(
          positionARestaurer.current
            ? positionARestaurer.current.etape
            : stepToOpen(initialPath.steps, cache.completedSteps, hashStep.current ?? readHashStep()),
        );
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
  }, [slug, initialPath, status, reloadKey, applyServerData, userId, abonne]);

  // s17 tour 2 (DES-2-01) : nouvel échec après « Réessayer » = focus rendu au bouton (le précédent a disparu).
  useEffect(() => {
    if (enrich === "echec" && reloadKey > 0) reessayerRef.current?.focus();
  }, [enrich, reloadKey]);

  // s26 parcours connecté, tour 2 (`docs/ux/parcours-connecte-s26.md` §5, `goBack()`) : espace ouvert, un clic sur un
  // lien qui quitte la page (« Retour : Parcours », fil d'Ariane…) note l'étape ouverte et le défilement dans l'entrée
  // d'historique courante ; le retour du navigateur sur cette entrée les rend (effet d'arrivée plus bas), au lieu de
  // repartir de l'ancre `#etape-N` de l'adresse.
  useEffect(() => {
    if (!ESPACE_CLIENT_PUBLIE) return;
    const noter = (e: MouseEvent) => {
      const lien = e.target instanceof Element ? e.target.closest("a[href]") : null;
      if (!(lien instanceof HTMLAnchorElement)) return;
      const cible = new URL(lien.href, window.location.href);
      if (cible.origin !== window.location.origin || cible.pathname === window.location.pathname) return;
      noterPosition({ etape: expandedStep, y: window.scrollY });
    };
    document.addEventListener("click", noter, true);
    return () => document.removeEventListener("click", noter, true);
  }, [expandedStep]);

  // Ancre #etape-N à l'arrivée (HTML ISR) : l'étape s'ouvre et vient à l'écran.
  useEffect(() => {
    // s26 tour 2 : retour du navigateur sur une position notée, l'étape notée s'ouvre, l'ancre de l'adresse est ignorée.
    const position = ESPACE_CLIENT_PUBLIE ? lirePosition() : null;
    if (position) {
      positionARestaurer.current = position;
      setExpandedStep(position.etape);
      return;
    }
    hashStep.current = readHashStep();
    if (!initialPath || hashStep.current === null) return;
    const target = stepToOpen(pathDepart?.steps ?? initialPath.steps, progressDepart?.completedSteps ?? [], hashStep.current);
    if (target === null) return;
    setExpandedStep(target);
    ancreARecaler.current = target;
    // s26 parcours, tour 5 : `#fiche-N-M` de l'étape ouverte, le bloc de la fiche est recalé à la place de l'étape.
    const fiche = ESPACE_CLIENT_PUBLIE ? window.location.hash.match(/^#(fiche-(\d{1,3})-\d{1,2})$/) : null;
    if (fiche && Number(fiche[2]) === target) {
      ficheARecaler.current = fiche[1];
      setFicheActive(fiche[1]);
    }
    requestAnimationFrame(() => document.getElementById(`etape-${target}`)?.scrollIntoView?.({ block: "start" }));
    // Lecture unique à l'arrivée.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // s17 tour 4 (QA) : le défilement d'arrivée est calculé sur la page longue du HTML ISR ; quand le
  // chargement abonné aboutit (contenu) ou échoue (message), la page raccourcit et la carte passait
  // sous l'en-tête fixe. Recalage unique sous l'en-tête (scroll-mt-28), sans toucher au focus.
  useEffect(() => {
    // s26 tour 2 : position notée rendue une fois la page à sa hauteur (abonné : progression lue ; visiteur : tout de suite).
    if (positionARestaurer.current && (enrich !== "attente" || status === "unauthenticated")) {
      const { y } = positionARestaurer.current;
      positionARestaurer.current = null;
      recalerPosition(y);
      return;
    }
    if (ancreARecaler.current === null || enrich === "attente") return;
    const cible = expandedStep ?? ancreARecaler.current;
    ancreARecaler.current = null;
    // s26 parcours connecté (`docs/ux/parcours-connecte-s26.md` §5, « Reprendre ») : ouvert, recalé aussi à chaque
    // changement de hauteur de la page jusqu'à 600 ms de calme, puis focus sur l'en-tête de l'étape sans défilement.
    if (ESPACE_CLIENT_PUBLIE) {
      const fiche = ficheARecaler.current;
      ficheARecaler.current = null;
      if (fiche && fiche.startsWith(`fiche-${cible}-`) && document.getElementById(fiche)) {
        recalerAncre(fiche, { focusId: fiche });
        return;
      }
      recalerAncre(`etape-${cible}`, { focusId: `etape-${cible}-entete` });
      return;
    }
    document.getElementById(`etape-${cible}`)?.scrollIntoView?.({ behavior: "instant", block: "start" });
  }, [enrich, expandedStep, status]);

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

  // s24 mesure (lot 0, §5.2) : étape 2+ dépliée (clic, ancre ou ouverture automatique) chez un abonné,
  // contenu complet reçu de l'API = premier accès Premium. Signal sans retour : rendu inchangé.
  const contenuAbonneRecu = isPremium && (!!initialPath && status === "authenticated" ? enrich === "ok" : path !== null);
  useEffect(() => {
    if (!tracksProgress || !contenuAbonneRecu || expandedStep === null || expandedStep < 2) return;
    signalerAcces({ type: "etape", parcours: slug, etape: expandedStep });
  }, [tracksProgress, contenuAbonneRecu, expandedStep, slug]);

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

  useEffect(() => {
    if (ESPACE_CLIENT_PUBLIE && expandedStep !== null) setEtapeVue(expandedStep);
  }, [expandedStep]);

  // s26 parcours v2 (§2, sous 1024 px) : l'étape quittée se replie au-dessus de celle qu'on ouvre ; l'en-tête cliqué reste
  // sous le doigt (même haut avant et après, sans animation), au lieu du saut de 440 px mesuré.
  useLayoutEffectNavigateur(() => {
    const note = enteteClique.current;
    if (!note) return;
    enteteClique.current = null;
    const entete = document.getElementById(`etape-${note.order}-entete`);
    if (entete) window.scrollBy({ top: entete.getBoundingClientRect().top - note.top, behavior: "instant" });
  }, [expandedStep]);

  // s26 parcours v2 (§2) : l'ouverture suit aussi l'ancre `#etape-N` qui change après l'arrivée.
  useEffect(() => {
    if (!ESPACE_CLIENT_PUBLIE) return;
    const suivre = () => {
      const m = window.location.hash.match(/^#etape-(\d{1,3})$/);
      if (m) allerAEtapeRef.current?.(Number(m[1]));
      // s26 parcours, tour 5 : idem pour une sous-étape `#fiche-N-M`.
      const f = window.location.hash.match(/^#(fiche-\d{1,3}-\d{1,2})$/);
      if (f) allerAFicheRef.current?.(f[1]);
    };
    window.addEventListener("hashchange", suivre);
    return () => window.removeEventListener("hashchange", suivre);
  }, []);

  const toggleStep = (order: number, isExpanded: boolean) => {
    openTrigger.current = "manuel";
    if (ESPACE_CLIENT_PUBLIE && !estLarge()) {
      const entete = document.getElementById(`etape-${order}-entete`);
      if (entete) enteteClique.current = { order, top: entete.getBoundingClientRect().top };
    }
    setExpandedStep(isExpanded ? null : order);
  };

  /** s19 (N2b) : lien de la carte de progression, l'étape s'ouvre puis vient sous la barre fixe (scroll-mt-28). */
  const allerAEtape = (order: number) => {
    if (expandedStep !== order) openTrigger.current = "manuel";
    setExpandedStep(order);
    setFicheActive(null);
    const reduit = typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    requestAnimationFrame(() => {
      // s26 parcours connecté, tour 3 : ouvert, défilement gardé sur l'étape tant que la page change de hauteur (étape
      // quittée refermée au-dessus, contenu chargé) ; arrête le recalage d'arrivée encore actif (`recaler-ancre.ts`).
      if (ESPACE_CLIENT_PUBLIE) {
        // s26 parcours v2 (§2) : dès 1024 px, l'étape choisie remplace la précédente à la même place ; défilement seulement
        // si son haut est passé sous l'en-tête collant ou hors de l'écran, sinon focus seul (aucun saut).
        const haut = document.getElementById(`etape-${order}`)?.getBoundingClientRect().top;
        if (estLarge() && haut !== undefined && haut >= ANCRE_ETAPE - 2 && haut <= window.innerHeight - 120) {
          document.getElementById(`etape-${order}-entete`)?.focus({ preventScroll: true });
          return;
        }
        recalerAncre(`etape-${order}`, { focusId: `etape-${order}-entete`, behavior: reduit ? "instant" : "smooth" });
        return;
      }
      document.getElementById(`etape-${order}`)?.scrollIntoView?.({ behavior: reduit ? "auto" : "smooth", block: "start" });
      document.getElementById(`etape-${order}-entete`)?.focus({ preventScroll: true });
    });
  };

  allerAEtapeRef.current = allerAEtape;

  /**
   * s26 parcours, tour 5 (F1, relecture UX v2) : clic sur une sous-étape (menu ou liste de la carte). Son étape s'ouvre si
   * besoin, la fiche devient le seul état actif, son bloc arrive à 137 px (en-tête collant) et y reste pendant que la page
   * change de hauteur ; l'adresse prend `#fiche-N-M` sans nouvelle entrée d'historique (le retour quitte la page).
   */
  const allerAFiche = (ancre: string) => {
    const m = ancre.match(/^fiche-(\d{1,3})-\d{1,2}$/);
    if (!m) return;
    const order = Number(m[1]);
    if (expandedStep !== order) {
      openTrigger.current = "manuel";
      setExpandedStep(order);
    }
    setFicheActive(ancre);
    window.history.replaceState(window.history.state, "", `#${ancre}`);
    const reduit = typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    requestAnimationFrame(() => {
      recalerAncre(ancre, { focusId: ancre, behavior: reduit ? "instant" : "smooth" });
      repererBloc(ancre);
    });
  };
  allerAFicheRef.current = allerAFiche;
  const ficheContexte = { active: ficheActive, choisir: allerAFiche };

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
        if (ESPACE_CLIENT_PUBLIE) setValidationsEspace((n) => n + 1);
        // s21 : étapes validables dans n'importe quel ordre ; après la dernière, on revient à la première non validée.
        const nextStep =
          path.steps.find((s) => s.order > stepOrder && !completed.includes(s.order)) ??
          path.steps.find((s) => !completed.includes(s.order));
        if (pathCompleted || !nextStep) {
          focusAfterValidation.current = "fin";
          setExpandedStep(null);
        } else if (ESPACE_CLIENT_PUBLIE && estLarge()) {
          // s26 parcours v2 (§2) : dès 1024 px, une seule étape visible ; l'étape validée reste affichée avec son gain
          // (sinon remplacée aussitôt, le résultat ne se verrait pas) ; la suivante est au menu et au pied de l'étape.
        } else {
          focusAfterValidation.current = { validee: stepOrder, suivante: nextStep.order };
          setExpandedStep(nextStep.order);
        }
      } else {
        // Codes du lot A → motifs fermés de data-analyst §5.1.
        const motif =
          res.status === 429 ? "limite" : res.status === 403 ? "refus" : "serveur";
        trackUmami("parcours-erreur", { parcours: slug, etape: stepOrder, motif });
        setCompletionError({
          order: stepOrder,
          message:
            res.status === 429
              ? "Doucement, tu cliques plus vite que ton ombre. Attends un instant et réessaie."
              : "L’étape n’a pas voulu se valider. Réessaie.",
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
      <div className={ouvert(cn("space-y-4", COLONNE_DETAIL), "space-y-4")} aria-busy="true">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className={ouvert(cn(CADRE_CARTE_NEUTRE, FILET_MASQUE, "animate-pulse"), "animate-pulse")} filet={ESPACE_CLIENT_PUBLIE}>
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
      <Card filet={ESPACE_CLIENT_PUBLIE} className={ouvert(cn(CADRE_CARTE_NEUTRE, FILET_MASQUE, "p-6", COLONNE_DETAIL))}>
        <CardContent className="py-12 text-center">
          <p className="text-text-secondary">
            {fetchError
              ? "Ce parcours ne veut pas se charger pour l’instant. Réessaie un peu plus tard."
              : "Ce parcours n’existe pas, ou plus."}{" "}
            <Link href="/parcours" className="text-accent-link underline underline-offset-2">
              Voir tous les parcours
            </Link>
          </p>
        </CardContent>
      </Card>
    );
  }

  const completedSteps = progress?.completedSteps ?? [];
  // Finition du tour 3 (T3) : quand la carte de fin d'étape 1 est affichée (visiteur ou compte sans
  // abonnement, étape 1 ouverte, quiz fait), elle porte déjà l'étape 2 (« Étape 2 sur N », titre,
  // aperçu) : l'étape 2 n'est pas répétée dans la liste, et la lettre gratuite passe sous la liste.
  const etape1 = path?.steps.find((s) => s.order === 1);
  const carteFinEtape1 =
    !isPremium &&
    !!etape1 &&
    isParcoursSlug(slug) &&
    expandedStep === 1 &&
    !completedSteps.includes(1) &&
    (!etape1.quiz?.length || quizDone.has(1));
  const totalSteps = path.steps.length;
  const isPathCompleted = !!progress?.completedAt;
  const totalXp = serverXpTotal ?? totalParcoursXp(path.steps);
  const isSeedFallback = path.id.startsWith("seed-");
  // s17 tour 2 : HTML ISR = progression inconnue tant que l'API (ou le cache du compte) ne l'a pas donnée.
  const attendApi = !!initialPath && status === "authenticated";
  const chargementPremium = isPremium && attendApi && enrich === "attente";
  const echecPremium = isPremium && attendApi && enrich === "echec";
  const progressionConnue = progress !== null || !attendApi || enrich === "ok";
  // s21 (décision de Thomas du 18/10) : avec Premium, toutes les étapes sont ouvertes d'un coup ;
  // l'ordre et « une étape par semaine » restent des conseils (date conseillée, prochaine étape), jamais un verrou.
  const etapeAccessible = (order: number) => canAccessParcoursStep(order, isPremium ? "PREMIUM" : null);
  // s17 tour 3 (UXV-3-01) : étape dépliée qui affiche l'échec = elle porte l'alerte et le seul « Réessayer ».
  const etapeEnEchec = path.steps.findIndex((step) =>
    etapeAfficheEchec({
      step,
      isExpanded: expandedStep === step.order,
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
  // s19 (N2b) : étape à faire quand la date conseillée est passée (« La prochaine étape t'attend. »).
  const etapeAFaire = path.steps.find((s) => !completedSteps.includes(s.order)) ?? null;
  // v6 tour 1, point 12 : même condition que le rendu de `SommaireParcours` plus bas (fermé : toujours faux).
  const sommaireAffiche = espaceOuvert && progressionConnue;

  // s17 tour 2 (DES-2-11) : parcours terminé, l'argumentaire (intro, « Pour qui ? ») passe après la carte de fin.
  // s19 (N2 a @ux rendu) : abonné qui a déjà validé une étape, l'argumentaire passe après le programme.
  const argumentaireApresProgramme = !isPathCompleted && isPremium && progressionConnue && completedSteps.length > 0;
  // s26 parcours connecté (§3) : carte de progression affichée, et en-tête 7/5 quand l'argumentaire reste en tête.
  const carteProgression = !isPathCompleted || chargementPremium || echecPremium;
  // s26 parcours connecté, tour 3 (arbitrage de l'orchestrateur) : dès 5 étapes, le sommaire de l'abonné (lignes de 48 px)
  // dépasse la colonne de gauche (Confiance : 23 à 47 px vides sous l'en-tête ; Storytelling, Boulot : 61 à 109) ; il
  // passe sous l'en-tête sur 12 colonnes. 3 et 4 étapes : 7/5 gardé.
  const sommaireSous = isPremium && path.steps.length >= SOMMAIRE_SOUS_EN_TETE_DES;
  const enTete75 = carteProgression && !argumentaireApresProgramme && !sommaireSous;
  // s19 (N1 @design rendu) : typographie française au rendu (« 6 semaines », « « Redis-moi », « à midi »), tous parcours.
  // v6 tour 5, arbitrage 1 (ouvert seulement) : l'intro devient une colonne centrée de 672 px sous l'en-tête centré
  // (comme le sous-titre de la liste), « Pour qui ? » et la phrase du persona centrés ; le témoignage garde son encart.
  // Fermé : classes d'avant.
  const argumentaire = (
    <>
      {/* s26 (§2) : argumentaire aligné à gauche, sans violet (persona en texte courant, témoignage en méta italique).
          s26 parcours v2 (§1) : dans la carte d'en-tête, sur toute sa largeur, « Pour qui ? » sous un filet. */}
      <p className={ESPACE_CLIENT_PUBLIE ? cn(TEXTE, "mt-4 text-pretty") : "mt-4 text-pretty text-text-secondary"}>{frTypoTexte(stripEmDashes(path.description))}</p>
      {(path.personaTagline || path.testimonial) && (
        <section aria-labelledby="parcours-pour-qui" className={ESPACE_CLIENT_PUBLIE ? "mt-6 border-t border-border pt-6" : "mt-4"}>
          <h2 id="parcours-pour-qui" className={ESPACE_CLIENT_PUBLIE ? TEXTE_FORT : "font-display text-lg font-bold"}>{TITRES_SECTIONS.pourQui}</h2>
          {path.personaTagline && (
            <p className={ESPACE_CLIENT_PUBLIE ? cn(TEXTE, "mt-2 text-pretty") : "mt-2 text-pretty text-sm font-medium text-accent-link"}>{frTypoTexte(path.personaTagline)}</p>
          )}
          {path.testimonial && (
            <p className={ouvert(cn(META, "mt-4 text-pretty italic"), "mt-3 text-pretty rounded-lg bg-accent-primary/5 p-3 text-sm italic text-text-secondary")}>
              {frTypoTexte(stripEmDashes(path.testimonial))}
            </p>
          )}
        </section>
      )}
    </>
  );

  const titreParcours = (
    <div className="flex items-center gap-3">
      <span className={ouvert("font-display text-2xl font-semibold lg:text-3xl", "text-4xl")} aria-hidden="true">{withEmojiPresentation(path.icon)}</span>
      <div>
        <h1 className={ouvert(TITRE_PAGE, "font-display text-3xl font-bold")}>{frTypoTexte(path.title)}</h1>
        <div className={ESPACE_CLIENT_PUBLIE ? "mt-2 flex flex-wrap items-center gap-2" : "mt-1 flex flex-wrap items-center gap-2"}>
          <Badge variant="primary" className={ouvert(cn(META_FORT, "rounded-none bg-transparent px-0 py-0"))}>{formatDifficulty(path.difficultyLabel ?? path.difficulty)}</Badge>
          {/* s19 (N1 @ux rendu) : le rythme promis par le hub et la meta, repris dans l'en-tête ;
              durée et rythme forment un seul bloc (jamais « · » seul en bout ou en début de ligne). */}
          <span className={ouvert(cn(META, "whitespace-nowrap"), "whitespace-nowrap text-sm text-text-muted")}>
            {path.duration}
            {path.timePerWeek && (
              <>
                <span aria-hidden="true" className="mx-2">·</span>
                {path.timePerWeek}
              </>
            )}
          </span>
        </div>
      </div>
    </div>
  );

  // s26 parcours connecté, tour 2 (C3 : la carte du nouvel abonné dépassait la colonne de gauche de 127 à 147 px) : espace
  // ouvert, l'invitation au rappel (64 px sur deux lignes dans la carte de 5 colonnes) sort de la carte de progression ;
  // en-tête 7/5, elle ferme la colonne de gauche (qui gagne la hauteur que la carte perd), sinon elle suit la carte.
  // Mêmes textes, même lien. Fermé : dans la carte, inchangé.
  // s26 parcours, tour 6 (D5 design v3 : interligne de ~32 px à 375, le lien `inline-flex` de 44 px gonflait sa ligne) :
  // lien en ligne, interligne de la méta (14/20, `typo.ts`) ; cible de 44 px gardée par la marge interne verticale, qui ne
  // compte pas dans la hauteur de ligne.
  const invitationRappel =
    ESPACE_CLIENT_PUBLIE && isPremium && carteProgression && !isPathCompleted && rappelInvite ? (
      <>
        {frTypoTexte(RAPPEL_LIEN.texte)}{" "}
        <Link href="/profil#rappel-parcours" className="py-3.5 text-text-primary underline underline-offset-2">
          {frTypoTexte(RAPPEL_LIEN.lien)}
        </Link>
      </>
    ) : null;

  const rendreEtape = (step: Step, stepIndex: number, classeEtape?: (order: number) => string | undefined) => {
    if (carteFinEtape1 && step.order === 2) return null;
    const isCompleted = completedSteps.includes(step.order);
    return (
      <ParcoursStepCard
        key={step.id}
        classeOuverte={classeEtape?.(step.order)}
        step={step}
        slug={slug}
        timePerWeek={path.timePerWeek}
        isPremium={isPremium}
        isCompleted={isCompleted}
        isExpanded={expandedStep === step.order}
        // D1 : le visiteur ouvre l'aperçu ; l'abonné ouvre toutes les étapes (décision du 18/10).
        isPremiumLocked={!etapeAccessible(step.order)}
        etapeSuivante={path.steps[stepIndex + 1] ?? null}
        isQuizDone={quizDone.has(step.order)}
        isSeedFallback={isSeedFallback}
        completing={completing === step.order}
        abonnementHref={abonnementHref}
        finEtape1Href={finEtape1Href}
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
        // s26 parcours, tour 8 (relecture design v5, détail 1 : étiquette à l'étape 1 seulement, titre 24 px plus haut aux
        // autres) : espace ouvert, nulle part (le titre du parcours est dans la carte d'en-tête et en tête du menu collant).
        contexte={!ESPACE_CLIENT_PUBLIE && stepIndex === 0 ? etapeContexteTexte(path.title, path.duration) : null}
        ancresFiches={espaceOuvert}
        pied={
          espaceOuvert && etapeAccessible(step.order) ? (
            <PiedEtape
              slug={slug}
              suivante={
                path.steps[stepIndex + 1]
                  ? { order: path.steps[stepIndex + 1].order, titre: path.steps[stepIndex + 1].moduleTitle ?? path.steps[stepIndex + 1].tip.title }
                  : null
              }
              allerAEtape={allerAEtape}
            />
          ) : undefined
        }
      />
    );
  };

  /*
   * s26 parcours v2 (`docs/design/parcours-connecte-v2-s26.md` §1 et §2, espace ouvert seulement, 4 comptes) : dès 1024 px,
   * menu d'étapes collant à gauche (320 puis 360 px dès 1280, gouttière 24 puis 32) et, à droite, la carte d'en-tête puis UNE
   * étape (celle du menu) : plus d'accordéon ni de saut. Le fil d'Ariane porte le retour. Sous 1024 px : « Retour : Parcours »
   * en haut, carte d'en-tête, menu replié, étapes en accordéon (une seule ouverte, en-tête cliqué gardé sous le doigt).
   * Fermé : rendu d'avant, plus bas, inchangé.
   */
  const renduOuvert = () => {
    const etapeMenu = expandedStep ?? etapeVue;
    const faites = completedSteps.length;
    const aReprendre = isPremium && progressionConnue && !isPathCompleted ? etapeAFaire : null;
    // s26 parcours, tour 5 (F8 de la relecture UX v2, D14 design) : même libellé que la carte « En cours » de /parcours
    // (« Étape n sur N », n = première étape à faire ; « Étape 3 sur 3 » des deux côtés au lieu de « 2 sur 3 étapes »),
    // texte existant ; parcours fini : « N sur N étapes » (texte existant).
    const avancee = !isPremium ? (
      progressionVisiteurTexte()
    ) : progressionConnue ? (
      frEspace(
        etapeAFaire && !isPathCompleted
          ? TEXTES_PARCOURS_ESPACE.etapeSurTotal(etapeAFaire.order, totalSteps)
          : TEXTES_PARCOURS_ESPACE.sommaire.faites(faites, totalSteps),
      )
    ) : (
      <span aria-hidden="true" data-testid="progression-squelette" className="inline-block h-4 w-32 animate-pulse rounded bg-background-elevated motion-reduce:animate-none" />
    );
    const argumentaireEnTete = !isPathCompleted && !argumentaireApresProgramme;
    // s26 parcours, tour 8 (relecture UX v5, D1 : pastille « Étape 3 sur 3 » sur la fiche 2.2) : sous 1024 px, le bouton de la
    // barre compacte donne l'étape LUE, même libellé « Étape n sur N » ; le menu garde l'étape à reprendre.
    const avanceeBarre =
      isPremium && progressionConnue && etapeAFaire && !isPathCompleted && etapeMenu !== null
        ? frEspace(TEXTES_PARCOURS_ESPACE.etapeSurTotal(etapeMenu, totalSteps))
        : undefined;
    return (
      <FicheActiveContexte.Provider value={ficheContexte}>
      <div
        className="flex flex-col gap-6 lg:col-span-12 lg:grid lg:grid-cols-[20rem_minmax(0,1fr)] xl:grid-cols-[22.5rem_minmax(0,1fr)] xl:gap-x-8"
        data-parcours-detail=""
      >
        <div className="-mb-2 max-lg:hidden lg:col-span-2 lg:row-start-1">
          <nav aria-label="Fil d’Ariane" className="text-sm text-text-muted">
            <Link href="/" className="hover:text-text-primary">Accueil</Link>
            <span className="mx-2">/</span>
            {/* s26 parcours, tour 5 (F3, relecture UX v2) : même ancre que « Retour : Parcours » (carte du parcours). */}
            <Link href={`/parcours#parcours-${slug}`} className="hover:text-text-primary">Parcours</Link>
            <span className="mx-2">/</span>
            <span className="text-text-secondary">{frTypoTexte(path.title)}</span>
          </nav>
        </div>

        {/* s26 parcours, tour 7 (relecture UX v4, D5) : la cellule du menu précède la carte d'en-tête dans le document ; sous
            1024 px, c'est la barre collante (« Retour : Parcours » et bouton du menu) en tête de page ; dès 1024 px, place
            fixée par la grille (colonne de gauche), rendu inchangé. */}
        <div className="max-lg:contents lg:col-start-1 lg:row-span-2 lg:row-start-2">
          <MenuEtapes
            retour={<LienRetour href={`/parcours#parcours-${slug}`} label={TEXTES_ESPACE_NAVIGATION.parcours} />}
            slug={slug}
            titre={path.title}
            avancee={avancee}
            avanceeBarre={avanceeBarre}
            etapes={path.steps.map((s) => ({
              order: s.order,
              titre: s.moduleTitle ?? s.tip.title,
              libre: !isPremium && (!!s.free || s.order === 1),
              // s26 parcours, tour 5 (F2, relecture UX v2) : visiteur et gratuit, cadenas sur les étapes réservées.
              verrouillee: !isPremium && !s.free && s.order !== 1,
            }))}
            faites={completedSteps}
            active={etapeMenu}
            onChoisir={allerAEtape}
            // s26 parcours, tour 7 : sous-étapes de chaque étape ouverte à l'abonné (menu figé, `menu-etapes.tsx`).
            sousEtapes={
              espaceOuvert
                ? (order) => {
                    const etape = path.steps.find((s) => s.order === order);
                    return etape && etapeAccessible(order) ? (
                      <LignesFiches
                        slug={slug}
                        etape={etape}
                        etapeFaite={completedSteps.includes(order)}
                        quizFait={quizDone.has(order)}
                        variante="menu"
                        etapeAffichee={order === etapeMenu}
                      />
                    ) : null;
                  }
                : undefined
            }
            reprendre={
              aReprendre
                ? { order: aReprendre.order, libelle: frEspace(faites === 0 ? TEXTES_PARCOURS_ESPACE.sommaire.commencer : TEXTES_PARCOURS_ESPACE.sommaire.reprendre) }
                : null
            }
            details={
              isPremium && !isPathCompleted && !echecPremium && progressionConnue ? (
                <>
                  <p className={cn(META, "mt-2")}>{xpProgressionTexte(xpGagnesParcours(path.steps, completedSteps), totalXp)}</p>
                  {showRythme && (
                    <p className={cn(META, "mt-2")}>{nextDate ? prochaineEtapeTexte(formatDateConseillee(nextDate)) : PROCHAINE_ETAPE_DISPONIBLE}</p>
                  )}
                </>
              ) : undefined
            }
          />
        </div>

        <div className={cn(CADRE_CARTE_NEUTRE, "p-6 lg:col-start-2 lg:row-start-2")} data-entete-parcours="">
          {titreParcours}
          {argumentaireEnTete && argumentaire}
          {invitationRappel && <p className={cn(META, "mt-6 border-t border-border pt-6")}>{invitationRappel}</p>}
        </div>

        <div className="flex min-w-0 flex-col gap-6 lg:col-start-2 lg:row-start-3" aria-busy={chargementPremium || undefined}>
          {chargementPremium && <p role="status" className={META}>{CHARGEMENT_PREMIUM.enCours}</p>}
          {echecPremium && etapeEnEchec >= 0 && (
            <p className={META} data-testid="echec-premium-neutre">
              {CHARGEMENT_PREMIUM.echecTexte}
            </p>
          )}
          {echecPremium && etapeEnEchec < 0 && (
            <div role="alert" className="rounded-xl border-l-2 border-error-text bg-error/10 p-4 text-sm text-error-text">
              <p className="font-semibold">{CHARGEMENT_PREMIUM.echec}</p>
              <p className="mt-1">{CHARGEMENT_PREMIUM.echecTexte}</p>
              <Button ref={reessayerRef} variant="outline" className="mt-3 min-h-11 w-full border-text-muted hover:border-text-primary sm:w-auto" onClick={() => setReloadKey((k) => k + 1)}>
                {CHARGEMENT_PREMIUM.reessayer}
              </Button>
            </div>
          )}
          {espaceOuvert && <AnnonceApresValidation validations={validationsEspace} />}
          {isPathCompleted && (
            <PathCompletionCard
              ref={completionHeading}
              className="mb-0 rounded-xl border-border bg-background-card"
              slug={slug}
              title={path.title}
              totalXp={totalXp}
              stepTitles={path.steps.map((s) => s.moduleTitle ?? s.tip.title)}
              retours={retours}
              nextParcours={path.nextParcours}
              nextParcoursReason={path.nextParcoursReason}
              nextParcoursRanking={path.nextParcoursRanking}
            />
          )}
          <section aria-labelledby="parcours-programme">
            <h2 id="parcours-programme" className={cn(TITRE_CARTE, "mb-4 lg:sr-only")}>
              {TITRES_SECTIONS.programme}
            </h2>
            <div className={cn("space-y-4 [overflow-anchor:none] lg:space-y-0", ECHELLE_ETAPES)} role="list" aria-label="Étapes du parcours" aria-busy={chargementPremium || undefined}>
              {path.steps.map((step, stepIndex) => rendreEtape(step, stepIndex, (order) => (order === etapeMenu ? undefined : "lg:hidden")))}
            </div>
          </section>
          {carteFinEtape1 && <LettreRepliee emplacement="parcours" slug={slug} ligne={FIN_ETAPE_1.lettre.ligne} />}
          {!argumentaireEnTete && <div className={cn(CADRE_CARTE_NEUTRE, "p-6 [&>p:first-child]:mt-0")}>{argumentaire}</div>}
          {!isPathCompleted && !isPremium && path.nextParcours && (
            <div className={cn(CADRE_CARTE_NEUTRE, "p-6")}>
              <p className={META}>
                Tu y prends goût ?{" "}
                <Link href={`/parcours/${path.nextParcours}?src=suite`} className="text-text-primary underline underline-offset-2 hover:text-text-secondary">
                  Jette un œil au parcours suivant
                </Link>
              </p>
            </div>
          )}
        </div>

        {/* Zone d'annonce permanente du gain d'XP (UX-05, UX-09 c) : hors flux (`sr-only`), elle ne se démonte pas. */}
        <div aria-live="polite" aria-atomic="true" className="sr-only">
          {annonce}
        </div>
      </div>
      </FicheActiveContexte.Provider>
    );
  };

  if (ESPACE_CLIENT_PUBLIE) return renduOuvert();

  return (
    <>
      <div className={ouvert(cn("mb-8", enTete75 ? EN_TETE_GAUCHE : COLONNE_DETAIL), "mb-8")}>
        <nav aria-label="Fil d’Ariane" className="mb-4 text-sm text-text-muted">
          <Link href="/" className="hover:text-text-primary max-md:py-3.5">Accueil</Link>
          <span className="mx-2">/</span>
          <Link href="/parcours" className="hover:text-text-primary max-md:py-3.5">Parcours</Link>
          <span className="mx-2">/</span>
          <span className="text-text-secondary">{frTypoTexte(path.title)}</span>
        </nav>

        {/* v6 tour 3, point 1 (ouvert seulement) : en-tête centré comme le hero de l'accueil (icône, H1, niveau et
            rythme) ; le fil d'Ariane et l'argumentaire gardent leur alignement. Fermé : inchangé. */}
        {/* s26 (§2) : en-tête aligné à gauche, titre blanc `TITRE_PAGE`, icône à la taille du titre, niveau en méta forte
            sans fond. */}
        {titreParcours}
        {!isPathCompleted && !argumentaireApresProgramme && argumentaire}
        {/* s26 tour 2 : en-tête 7/5, l'invitation au rappel ferme la colonne de gauche (voir `invitationRappel`). */}
        {invitationRappel && enTete75 && <p className={cn(META, "mt-4")}>{invitationRappel}</p>}
      </div>

      {/* DES-1-16 : carte resserrée (une ligne pour le visiteur).
          s19 (N6 @ux rendu) : parcours terminé, la carte de fin suffit (sauf chargement ou échec à signaler). */}
      {carteProgression && (
      <Card
        className={cn(isPremium ? "mb-8" : "mb-8 py-3", ouvert(cn(CADRE_CARTE_NEUTRE, FILET_MASQUE, "p-6", enTete75 ? CARTE_DROITE : COLONNE_DETAIL)))}
        aria-busy={chargementPremium || undefined}
        filet={ESPACE_CLIENT_PUBLIE}
      >
        {/* s26 tour 2 : ouvert, plus de `py-2` (la carte a déjà ses 24 px) ; dès 1024 px, contenu en colonne qui occupe la
            carte étirée (les lignes de la liste se partagent la hauteur). Fermé : inchangé. */}
        <CardContent className={ouvert("lg:flex lg:flex-1 lg:flex-col", isPremium ? "py-2" : "")}>
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
              {/* s19 (S4 @design, S3 @ux rendu iter 2) : sans barre au-dessus, pas de marge (vide de 40 px). */}
              {echecPremium && etapeEnEchec < 0 && (
                <div role="alert" className={`${progressionConnue ? "mt-3 " : ""}rounded-lg border-l-2 border-error-text bg-error/10 p-3 text-sm text-error-text`}>
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
              {/* s19 (S4 @design, S3 @ux rendu iter 2) : masqué si le chargement a échoué (ligne orpheline).
                  s19 (S2 @ux rendu iter 2) : à gauche sous 640 px (« dernière étape » orphelin à droite). */}
              {!isPathCompleted && !echecPremium && (
                <p className={ouvert(cn(META, "mt-2"), "mt-2 text-left text-sm text-text-secondary sm:text-right")}>
                  {xpProgressionTexte(xpGagnesParcours(path.steps, completedSteps), totalXp)}
                </p>
              )}
              {showRythme && nextDate && (
                <p className="mt-2 text-sm text-text-secondary">{prochaineEtapeTexte(formatDateConseillee(nextDate))}</p>
              )}
              {/* s19 (N2b, S1 @ux rendu iter 2) : phrase validée cliquable vers l'étape à faire, numéro et titre
                  en second plan ; même ouverture que l'en-tête de l'étape (dépliée, calée sous la barre fixe). */}
              {/* v6 tour 1, point 12 : interrupteur ouvert, abonné avec sommaire, le bouton « Reprendre » du sommaire est
                  le seul chemin vers l'étape en cours ; la phrase reste, en texte simple (ligne ci-dessous). */}
              {showRythme && !nextDate && etapeAFaire && !sommaireAffiche && (
                <a
                  href={`#etape-${etapeAFaire.order}`}
                  onClick={(e) => {
                    e.preventDefault();
                    // s19 iter 4 (S14 @ux) : mesure du raccourci, sans donnée personnelle.
                    trackUmami("lien-etape-clic", { parcours: slug, etape: etapeAFaire.order });
                    allerAEtape(etapeAFaire.order);
                  }}
                  data-testid="lien-prochaine-etape"
                  className="group mt-2 flex min-h-[44px] flex-col justify-center rounded text-sm focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-primary"
                >
                  <span className="text-accent-link underline underline-offset-2">{PROCHAINE_ETAPE_DISPONIBLE}</span>
                  {/* s19 iter 4 (N-a @design) : la 2e ligne a aussi l'allure d'un lien (couleur, soulignement au survol). */}
                  <span className="text-accent-link underline-offset-2 group-hover:underline">
                    {frTypoTexte(etapeLienTexte(etapeAFaire.order, etapeAFaire.moduleTitle ?? etapeAFaire.tip.title))}
                  </span>
                </a>
              )}
              {showRythme && !nextDate && (!etapeAFaire || sommaireAffiche) && (
                <p className="mt-2 text-sm text-text-secondary">{PROCHAINE_ETAPE_DISPONIBLE}</p>
              )}
              {/* s19 iter 4 (C @design) : -mb-3 sous 640 px, le lien de 44 px ne creuse plus 40 px sous la carte.
                  s26 tour 2 : espace ouvert, l'invitation sort de la carte (sous l'en-tête, ci-dessous). */}
              {!ESPACE_CLIENT_PUBLIE && !isPathCompleted && rappelInvite && (
                <p className={ouvert(cn(META, "-mb-3 mt-2 sm:mb-0"), "-mb-3 mt-2 text-xs text-text-muted sm:mb-0")}>
                  {frTypoTexte(RAPPEL_LIEN.texte)}{" "}
                  <Link
                    href="/profil#rappel-parcours"
                    className={ouvert("inline-flex min-h-11 items-center text-text-primary underline underline-offset-2", "inline-flex min-h-[44px] items-center text-accent-link underline underline-offset-2 sm:min-h-0")}
                  >
                    {frTypoTexte(RAPPEL_LIEN.lien)}
                  </Link>
                </p>
              )}
            </>
          ) : (
            // QA-13 : pas de barre immobile pour un non-abonné.
            <p className="text-sm text-text-secondary">{progressionVisiteurTexte()}</p>
          )}
        </CardContent>
      </Card>
      )}
      {/* s26 tour 2 : sans en-tête 7/5 (abonné qui a validé une étape), l'invitation suit la carte, sur toute la largeur. */}
      {invitationRappel && !enTete75 && <p className={cn(META, "-mt-4 mb-8", COLONNE_DETAIL)}>{invitationRappel}</p>}

      {/* Zone d'annonce permanente du gain d'XP (UX-05, UX-09 c) : elle ne se démonte pas avec l'étape.
          s17 tour 1 : le texte visible est dans la carte validée ; ici, l'annonce vocale seule (plus de 16 px morts). */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {annonce}
      </div>

      {/* UXV-1-03 : parcours terminé, la carte de fin et le bilan passent avant « Le programme ». */}
      {isPathCompleted && (
        <PathCompletionCard
          ref={completionHeading}
          className={ouvert(cn(COLONNE_DETAIL, "rounded-xl border-border bg-background-card"))}
          slug={slug}
          title={path.title}
          totalXp={totalXp}
          stepTitles={path.steps.map((s) => s.moduleTitle ?? s.tip.title)}
          retours={retours}
          nextParcours={path.nextParcours}
          nextParcoursReason={path.nextParcoursReason}
          nextParcoursRanking={path.nextParcoursRanking}
        />
      )}
      {isPathCompleted && <div className={ouvert(cn("mb-8", COLONNE_DETAIL), "mb-8")}>{argumentaire}</div>}

      {espaceOuvert && <AnnonceApresValidation validations={validationsEspace} />}

      {/* v6 tour 5, arbitrage 1 (ouvert seulement) : titre de section centré comme l'accueil. Fermé : inchangé. */}
      <h2 className={ESPACE_CLIENT_PUBLIE ? cn(TITRE_CARTE, "mb-4", COLONNE_DETAIL) : "mb-4 font-display text-xl font-bold"}>{TITRES_SECTIONS.programme}</h2>
      <div className={ouvert(cn("space-y-4", COLONNE_DETAIL, ECHELLE_ETAPES), "space-y-4")} role="list" aria-label="Étapes du parcours" aria-busy={chargementPremium || undefined}>
        {path.steps.map((step, stepIndex) => rendreEtape(step, stepIndex))}
      </div>

      {/* Finition du tour 3 (T3) : la lettre gratuite sous la liste des étapes, loin du bouton payant. */}
      {carteFinEtape1 && (
        <LettreRepliee emplacement="parcours" slug={slug} ligne={FIN_ETAPE_1.lettre.ligne} className={ouvert(cn("mt-6", COLONNE_DETAIL), "mt-6 text-center")} />
      )}

      {argumentaireApresProgramme && <div className={ouvert(cn("mt-8", COLONNE_DETAIL), "mt-8")}>{argumentaire}</div>}

      {/* UX-06 : pas de « parcours suivant » en cours de route pour un abonné. */}
      {!isPathCompleted && !isPremium && path.nextParcours && (
        <div className={ouvert(cn(CADRE_CARTE_NEUTRE, "mt-8 p-6", COLONNE_DETAIL), "mt-8 rounded-lg border border-border p-4 text-center")}>
          <p className={ouvert(META, "text-sm text-text-muted")}>
            Tu y prends goût ?{" "}
            <Link
              href={`/parcours/${path.nextParcours}?src=suite`}
              className={ouvert("text-text-primary underline underline-offset-2 hover:text-text-secondary", "text-accent-link underline underline-offset-2")}
            >
              Jette un œil au parcours suivant
            </Link>
          </p>
        </div>
      )}
    </>
  );
}
