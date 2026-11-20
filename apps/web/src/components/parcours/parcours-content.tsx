"use client";

import { ESPACE_CLIENT_PUBLIE } from "@/config/espace-client";
import { useState, useEffect, type ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle, FILET_MASQUE } from "@/components/ui/card";
import { CADRE_CARTE_NEUTRE } from "@/components/espace/carte/styles";
// s26 DA du site (décision de Thomas du 20/11) : cartes de parcours au style des cartes « Tu te reconnais ? » de l'accueil.
import { BLOC_EXEMPLE, DETAILS_SUMMARY, EMOJI_CARTE, TITRE_CARTE_ACCUEIL } from "@/components/home/da-site";
import { PASTILLE } from "@/components/espace/aujourdhui/tableau";
import { BarreSegmentee } from "@/components/espace/parcours/barre-segmentee";
import { useLienParcoursEnCours, useParcoursEnCours } from "@/lib/espace/parcours-en-cours";
import { TEXTES_AUJOURDHUI } from "@/config/textes/espace-aujourdhui";
import { META, META_FORT, TEXTE, TEXTE_FORT, TITRE_CARTE } from "@/components/espace/typo";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/ui/progress-bar";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { emojiReponseBoulot, recommendParcours, type ParcoursRecommendation } from "@/lib/parcours-orientation";
import { withEmojiPresentation } from "@/lib/parcours-labels";
import { stripEmDashes } from "@/lib/em-dash";
import { frTypo, frTypoParcours, frTypoTexte } from "@/lib/fr-typo";
import type { ParcoursCatalogueItem } from "@/lib/parcours-catalogue";
import { ETAPE_LIBRE_BADGE } from "@/config/textes/offre";
import { LISTE_PARCOURS } from "@/config/textes/parcours";
import { trackUmami } from "@/lib/umami";
import { isPremiumPlan } from "@/lib/parcours-access";
import Link from "next/link";
import { isParcoursSlug } from "@/lib/entrees-parcours";
import { LISTE_PARCOURS_CTA } from "@/config/textes/cta-pages";
import { totalParcoursXp } from "@/lib/parcours-xp";
import { CORPS_APPEL_MOBILE } from "@/components/layout/gabarit";
import { cn } from "@/lib/utils";
import { SANS_COMPTE } from "@/config/textes/cta-articles-accueil";
import { garderAncre, lireRetourListe, noterRetourListe, recalerAncre } from "@/lib/espace/recaler-ancre";

/**
 * Ligne frontière d'une carte de /parcours. v6 tour 2, point 14 (interrupteur ouvert seulement, `connecte` vrai pour
 * un compte connecté) : la phrase « Sans compte. », fausse pour lui, est masquée ; le reste de la ligne, vrai, est
 * gardé tel quel ; rien d'écrit à la place. Fermé ou visiteur : la ligne entière, inchangée.
 */
export function frontiereListe(slug: Parameters<typeof LISTE_PARCOURS_CTA.frontiere>[0], connecte: boolean): string {
  const ligne = LISTE_PARCOURS_CTA.frontiere(slug);
  return connecte && ligne.startsWith(SANS_COMPTE) ? ligne.slice(SANS_COMPTE.length).trimStart() : ligne;
}

/**
 * Grille des cartes de /parcours, interrupteur ouvert (visiteur, compte gratuit ET abonné). s26 parcours connecté, tour 2
 * (`docs/captures/s26/tour-2-quoi-repondre-parcours/MESURES.md` B1) : la sous-grille de deux cartes par rangée ne tient
 * pas la règle des 32 px quand deux textes voisins diffèrent trop (Confiance : 114 px de vide à 768, 66 dès 1024 ; titres
 * décalés de 20 px à 1024). Composition retenue : une carte par rangée sur les 12 colonnes ; tête (méta, titre, persona)
 * pleine largeur, description et témoignage côte à côte dès 768 px (tour 5 : deux cellules de grille, `ColonnesTexte`, bas
 * des deux blocs à une ligne près), barre, puis pied (« Programme » et bouton côte à côte dès 1024 px). Plus de rangée à
 * égaliser : ni `min-h` ni `mt-auto`, aucun vide interne au-delà d'une ligne.
 */
export const GRILLE_CARTES_OUVERTE = "grid gap-6 lg:col-span-12";
/**
 * s26 parcours connecté (§2.4), tour 2 : carte d'une rangée. Ancre de retour `#parcours-{slug}` à 137 px du haut de la
 * fenêtre : le `scroll-padding-top` de 128 px posé par l'en-tête universel (site entier, inchangé) s'ajoute à la marge
 * d'ancre, d'où 9 px (128 + 9 = 137 ; fenêtre de moins de 500 px de haut : en-tête non collant, 9 px seuls).
 */
const CARTE_RANGEE = "flex scroll-mt-[9px] flex-col p-6";

/*
 * s26 parcours connecté, tour 2 : description et témoignage côte à côte dès 768 px ; fermé, un fragment.
 * s26 parcours, tour 5 (faute dure D1 / F6 des relectures v2 : `columns-2` coupait le paragraphe de Storytelling et de
 * Boulot entre les deux colonnes) : plus aucune colonne CSS. Dès 768 px, une grille de deux cellules, une par bloc
 * (description, témoignage), `items-start`. Sous 768 px, l'un sous l'autre (16 px).
 * s26 parcours, tour 6 (D1 de la relecture design v3 : témoignage à x 699, 769 ou 719 selon la carte, bouton à 652) :
 * grille FIXE, la même dans les 5 cartes et dans le pied : le témoignage commence sur la ligne du bouton. Proportion 10/7
 * (description 16 px, témoignage 14 px) mesurée sur les 5 textes : bas des deux blocs à une ligne (24 px) près à 768,
 * 850 à 1024, 1280, 1366, 1440 et 1920 (moitiés, 3/2 ou 7/5 laissaient 48 à 96 px ; vers 800 px, Boulot garde 48 px).
 */
const GRILLE_TEXTE = "md:grid-cols-[minmax(0,10fr)_minmax(0,7fr)] md:gap-x-6";
/** Même grille pour le pied dès 1024 px (« Programme », bouton) : bord gauche du bouton = bord gauche du témoignage. */
const GRILLE_PIED = "lg:grid lg:grid-cols-[minmax(0,10fr)_minmax(0,7fr)] lg:gap-x-6";

function ColonnesTexte({ children }: { children: ReactNode }) {
  if (!ESPACE_CLIENT_PUBLIE) return <>{children}</>;
  return (
    <div className={cn("mt-4 grid gap-4 md:items-start md:gap-y-0", GRILLE_TEXTE)} data-parcours-texte="">
      {children}
    </div>
  );
}

/** s26 (§1.3) : contour neutre des boutons de carte (un seul aplat violet par écran : le bouton d'offre de l'en-tête). */
const CONTOUR_CARTE = "border-border-input hover:border-text-muted";
/** s26 (§1.1) : carte du quiz d'orientation, cadre neutre de 24 px (filet masqué), sous son titre. */
const CARTE_QUIZ_OUVERTE = cn(CADRE_CARTE_NEUTRE, FILET_MASQUE, "mt-6 p-6");
/** s26 (§1.3) : pastille ramenée à une méta (sans fond ni capitale), pour « Question n/2 » et la semaine d'une étape. */
const SANS_FOND_META = cn(META, "rounded-none bg-transparent px-0 py-0 font-normal");

/**
 * Pied d'une carte de /parcours (« Programme » + bouton) : bloc ouvert, fragment fermé (v6 tour 4, point 2). s26 tour 2 :
 * plus de `mt-auto` (cartes à leur hauteur propre, le pied suit le témoignage à 24 px).
 */
function PiedCarte({ children, className }: { children: ReactNode; className?: string }) {
  if (!ESPACE_CLIENT_PUBLIE) return <>{children}</>;
  return (
    <div className={className ?? "flex flex-col gap-6"} data-parcours-pied="">
      {children}
    </div>
  );
}

// Les données arrivent du Server Component (app/(dashboard)/parcours/(liste)/page.tsx) :
// le seed complet (quiz, vidéos, vannes) ne doit plus être embarqué côté client.

// ==============================
// Mini quiz d'orientation parcours
// ==============================

/** s26 parcours connecté (§2.5) : bloc de texte du résultat du quiz, ouvert seulement ; fermé, un fragment. */
function TexteResultat({ children }: { children: ReactNode }) {
  if (!ESPACE_CLIENT_PUBLIE) return <>{children}</>;
  return <div className="max-w-2xl">{children}</div>;
}

type QuizResult = ParcoursRecommendation;

const ORIENTATION_QUESTIONS = [
  {
    question: "Dans quelle situation tu voudrais être plus drôle ?",
    options: [
      // Icône lue au rendu par `emojiReponseBoulot()` (☕ tant que Boulot est masqué).
      { label: "Au boulot, en réunion, à la pause", value: "work", emoji: "☕" },
      { label: "En soirée, avec mes potes, en coloc", value: "social", emoji: "🎉" },
      { label: "Partout, je veux retrouver ma légèreté", value: "global", emoji: "🌱" },
    ],
  },
  {
    question: "Qu’est-ce qui coince le plus ?",
    options: [
      { label: "Je n’ai jamais rien de drôle à raconter", value: "content", emoji: "📝" },
      { label: "Je ne sais pas quoi répondre sur le moment", value: "repartie", emoji: "⚡" },
      { label: "J’ai perdu confiance en moi", value: "confiance", emoji: "💪" },
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
      <Card className={ESPACE_CLIENT_PUBLIE ? CARTE_QUIZ_OUVERTE : "p-4 text-center sm:p-6"} filet={ESPACE_CLIENT_PUBLIE}>
        {/* s26 parcours connecté (§2.5) : texte à gauche (`max-w-2xl`), boutons à droite dès 1024 px. Fermé : inchangé. */}
        <CardContent className={ESPACE_CLIENT_PUBLIE ? "flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between" : undefined}>
          <TexteResultat>
          <p className={ESPACE_CLIENT_PUBLIE ? META : "text-sm font-medium text-accent-link"}>Ton point de départ :</p>
          <h3 className={ESPACE_CLIENT_PUBLIE ? cn(TITRE_CARTE, "mt-2") : "mt-2 font-display text-xl font-bold"}>{result.title}</h3>
          <p className={ESPACE_CLIENT_PUBLIE ? cn(META, "mt-2") : "mt-2 text-sm text-text-secondary"}>{frTypo(result.reason)}</p>
          </TexteResultat>
          <div className={ESPACE_CLIENT_PUBLIE ? "flex flex-col items-start gap-2 sm:flex-row sm:items-center lg:shrink-0" : "mt-4 flex flex-col items-center gap-2 sm:flex-row sm:justify-center"}>
            {/* s26 (§1.1) : « Voir ce parcours » en contour, jamais plein ; « Refaire le quiz » en lien souligné. */}
            <Button
              variant={ESPACE_CLIENT_PUBLIE ? "outline" : "primary"}
              size="sm"
              className={ESPACE_CLIENT_PUBLIE ? cn("min-h-11", CONTOUR_CARTE) : undefined}
              onClick={() => onShowParcours(result.slug)}
            >
              Voir ce parcours
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={ESPACE_CLIENT_PUBLIE ? cn("-ml-3 min-h-11 underline underline-offset-2", META) : undefined}
              onClick={handleReset}
            >
              Refaire le quiz
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const q = ORIENTATION_QUESTIONS[step];
  return (
    <Card className={ESPACE_CLIENT_PUBLIE ? CARTE_QUIZ_OUVERTE : "p-4 sm:p-6"} filet={ESPACE_CLIENT_PUBLIE}>
      <CardContent>
        <div className="mb-4 flex items-center justify-between">
          <Badge variant="primary" className={ESPACE_CLIENT_PUBLIE ? SANS_FOND_META : undefined}>Question {step + 1}/{ORIENTATION_QUESTIONS.length}</Badge>
          <div className="flex gap-1">
            {ORIENTATION_QUESTIONS.map((_, i) => (
              <div
                key={i}
                className={`h-2 w-6 rounded-full transition-colors ${
                  ESPACE_CLIENT_PUBLIE
                    ? i <= step ? "bg-text-secondary" : "bg-border-hover"
                    : i <= step ? "bg-accent-primary" : "bg-background-elevated"
                }`}
              />
            ))}
          </div>
        </div>
        <h3 className={ESPACE_CLIENT_PUBLIE ? cn(TEXTE_FORT, "mb-4") : "mb-4 font-display text-lg font-bold"}>{q.question}</h3>
        <div className={ESPACE_CLIENT_PUBLIE ? "grid gap-2 md:grid-cols-3" : "flex flex-col gap-2 sm:flex-row"}>
          {q.options.map((o) => (
            <button
              key={o.value}
              onClick={() => handleAnswer(o.value)}
              className={ESPACE_CLIENT_PUBLIE
                ? cn("flex min-h-11 w-full items-center gap-2 rounded-xl border border-border-input bg-transparent px-4 py-2 text-left transition-colors hover:border-border-hover hover:bg-background-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary", META)
                : "flex flex-1 items-center gap-2 rounded-lg border border-border bg-background-card p-3 text-left text-sm font-medium transition-all hover:border-accent-primary hover:bg-background-elevated active:scale-[0.98]"}
            >
              <span className={ESPACE_CLIENT_PUBLIE ? "text-base" : "text-xl"} aria-hidden="true">
                {/* s19 iter 5 (N-3 @design) : 💼 sur « Au boulot » une fois Boulot publié, ☕ sinon. */}
                {withEmojiPresentation(o.value === "work" ? emojiReponseBoulot() : o.emoji)}
              </span>
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

  // s26 parcours connecté (`docs/ux/parcours-connecte-s26.md` §5, retour) : arrivée par `/parcours#parcours-{slug}`, la
  // carte du parcours est recalée sous l'en-tête collant pendant que l'en-tête de l'abonné et la progression se chargent.
  // Espace ouvert seulement.
  // s26 parcours, tour 5 (F3, relecture UX v2) : retour du navigateur depuis une page de parcours (1280 comme 375), la
  // carte du parcours quitté revient sous l'en-tête (slug noté dans l'entrée d'historique de /parcours au départ).
  useEffect(() => {
    if (!ESPACE_CLIENT_PUBLIE) return;
    const noter = (e: MouseEvent) => {
      const lien = e.target instanceof Element ? e.target.closest("a[href]") : null;
      if (!(lien instanceof HTMLAnchorElement)) return;
      const cible = new URL(lien.href, window.location.href);
      const m = cible.origin === window.location.origin ? cible.pathname.match(/^\/parcours\/([a-z0-9-]{1,60})$/) : null;
      if (m) noterRetourListe(m[1]);
    };
    document.addEventListener("click", noter, true);
    const ancre = window.location.hash.match(/^#(parcours-[a-z0-9-]+)$/);
    const retour = ancre ? null : lireRetourListe();
    const id = ancre ? ancre[1] : retour && document.getElementById(`parcours-${retour}`) ? `parcours-${retour}` : null;
    const arreter = id ? recalerAncre(id, { calmeMs: 1_000 }) : null;
    // Retour arrière : la restauration du navigateur passe après le recalage, la carte est gardée contre elle.
    const garder = !ancre && id ? garderAncre(id) : null;
    return () => {
      document.removeEventListener("click", noter, true);
      arreter?.();
      garder?.();
    };
  }, []);

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
  // s24 lot D4 : espace ouvert, l'abonné a l'en-tête de l'espace (étape à reprendre) au-dessus de la liste :
  // pas de second « Reprendre », le quiz d'orientation passe sous la liste (fermé : inchangé).
  const enteteEspace = ESPACE_CLIENT_PUBLIE && statut === "premium";
  // s26 (`docs/ux/parcours-vannes-s26.md` §1.3) : espace ouvert, le seul plein de l'abonné est l'étape à reprendre
  // (`QuatreSemaines`, au-dessus de la liste) ; toutes les cartes passent en contour (plus de plein sur `pleinUnique`).
  const enCoursSlug = useParcoursEnCours();
  const lienEnCours = useLienParcoursEnCours();
  const parcoursEntame = enteteEspace ||(statut === "premium" && Object.values(userProgress).some((p) => p.completed > 0));
  // s26 (`docs/design/parcours-vannes-s26.md` §1.1 et §1.2) : plus de colonne centrée ; chaque bloc prend sa place dans
  // la grille de 12 colonnes de la page (`parcours/(liste)/page.tsx`). Visiteur et compte gratuit : quiz compact dans
  // les 4 colonnes de droite du hero (sous la liste avant 1024 px, `order`) ; abonné : quiz sous la liste, colonne de 8.
  // s26 parcours connecté (§2.5) : quiz sous la liste pour tous, sur 12 colonnes ; visiteur et compte gratuit, `order-1`
  // (son DOM le met avant les cartes) à toutes les largeurs, le bas de page suit en `order-2` (`page.tsx`).
  const placeQuiz = parcoursEntame ? "mt-12 lg:col-span-12" : "mt-12 order-1 lg:col-span-12";
  const quizOrientation = (
    <div className={ESPACE_CLIENT_PUBLIE ? placeQuiz : parcoursEntame ? "mt-10" : "mb-10"}>
      {/* v6 tour 5, arbitrage 1 (ouvert seulement) : titre de section centré comme l'accueil. Fermé : inchangé. */}
      <h2 className={ESPACE_CLIENT_PUBLIE ? TITRE_CARTE : "mb-4 font-display text-xl font-bold"}>
        Quel parcours est fait pour toi ?
      </h2>
      <OrientationQuiz onShowParcours={showParcours} statut={statut} />
    </div>
  );

  // L'étape 1 se lit sans compte : « Commencer ce parcours » mène au parcours
  // pour tout le monde (s15 §2.7, avant : /register pour un visiteur).
  // s26 parcours v2 (`docs/design/parcours-connecte-v2-s26.md` §6) : espace ouvert, « Tester l'étape 1 » mène sur
  // l'étape 1 (`#etape-1`, ouverte à l'arrivée) au lieu du haut de la page du parcours. Fermé : inchangé.
  const handleCta = (slug: string, etape1 = false) => {
    // s26 parcours, tour 5 (F3) : bouton de carte (pas un lien), le parcours quitté est noté de la même façon.
    if (ESPACE_CLIENT_PUBLIE) noterRetourListe(slug);
    router.push(`/parcours/${slug}?src=hub${ESPACE_CLIENT_PUBLIE && etape1 ? "#etape-1" : ""}`);
  };
  // s26 parcours v2 (§6) : visiteur et compte gratuit sous 768 px, le bouton « Tester l'étape 1 » du premier parcours
  // remonte dans le premier écran (sous l'introduction, avant les cartes), en contour comme celui de la carte.
  const premierEtape1 = ESPACE_CLIENT_PUBLIE && statut !== "premium" ? parcours.find((p) => isParcoursSlug(p.slug)) : undefined;

  return (
    <>
      {/* Reprise pour la personne qui a un parcours en cours (UX-11) */}
      {!enteteEspace && reprise && userProgress[reprise.slug]?.nextStep && (
        <div
          className={
            ESPACE_CLIENT_PUBLIE
              ? cn(CADRE_CARTE_NEUTRE, "mb-8 p-6 lg:col-span-12")
              : "mb-8 rounded-lg border border-accent-primary/40 bg-accent-primary/5 p-4 text-center"
          }
        >
          {/* s26 : compte gratuit qui a entamé un parcours, « Reprendre » en contour (le plein de l'écran est l'offre de
              l'en-tête), bloc neutre aligné à gauche. Fermé : inchangé. */}
          <Link
            href={`/parcours/${reprise.slug}?src=hub#etape-${userProgress[reprise.slug].nextStep}`}
            className={ESPACE_CLIENT_PUBLIE ? cn(buttonVariants({ variant: "outline", size: "lg" }), "h-auto min-h-12 whitespace-normal py-2", CONTOUR_CARTE) : buttonVariants({ variant: "primary" })}
          >
            {LISTE_PARCOURS.reprendre}
          </Link>
          <p className={ESPACE_CLIENT_PUBLIE ? cn(META, "mt-2") : "mt-2 text-sm text-text-secondary"}>
            {/* Relecture des captures nav s24 (reviewer FD2) : ouvert seulement, apostrophes typographiques du titre. */}
            {(ESPACE_CLIENT_PUBLIE ? frTypo : (t: string) => t)(
              LISTE_PARCOURS.repriseLigne(
                reprise.title,
                userProgress[reprise.slug].nextStep as number,
                userProgress[reprise.slug].total || reprise.modules.length,
                reprise.modules[(userProgress[reprise.slug].nextStep as number) - 1]?.title ?? null,
              ),
            )}
          </p>
        </div>
      )}

      {premierEtape1 && isParcoursSlug(premierEtape1.slug) && (
        <Link
          href={`/parcours/${premierEtape1.slug}?src=hub#etape-1`}
          data-testid="tester-etape-1-mobile"
          className={cn(buttonVariants({ variant: "outline", size: "lg" }), "mb-8 h-auto min-h-12 w-full whitespace-normal py-2 md:hidden", CONTOUR_CARTE)}
        >
          {LISTE_PARCOURS_CTA.bouton(premierEtape1.slug)}
        </Link>
      )}

      {!parcoursEntame && quizOrientation}

      {/* Parcours cards */}
      <div
        className={
          ESPACE_CLIENT_PUBLIE
            ? GRILLE_CARTES_OUVERTE
            : "flex flex-col gap-6"
        }
        data-parcours-cartes={ESPACE_CLIENT_PUBLIE ? "" : undefined}
      >
        {parcours.map((p) => {
          // QA-07 : total réel, bonus de fin compris.
          const totalXp = totalParcoursXp(p.modules.map((m) => ({ moduleXp: m.xp })));
          const prog = userProgress[p.slug];
          const progressValue = prog ? prog.completed : 0;
          const isDone = !!prog?.done;
          // s21 B15 (froid) : visiteur ou membre qui n'a pas commencé ce parcours.
          const etape1Slug = statut !== "premium" && !isDone && progressValue === 0 && isParcoursSlug(p.slug) ? p.slug : null;
          const progressMax = prog ? prog.total : p.modules.length;
          // s26 parcours connecté, tour 2 : chaque carte prend toute la rangée (`GRILLE_CARTES_OUVERTE`) ; son pied passe
          // en ligne dès 1024 px (« Programme » et bouton, moitié chacun), comme l'ancienne dernière carte seule.
          // Sous 300 px (200 % de texte), marges de la carte réduites comme les cartes de l'en-tête de l'abonné
          // (`max-e300:px-3 max-e300:py-2`) : premier parcours dans les deux premiers écrans (N2, 188 x 406).
          const zones = ESPACE_CLIENT_PUBLIE;
          const o = (ouvert: string, ferme?: string) => (ESPACE_CLIENT_PUBLIE ? ouvert : ferme);
          return (
            <Card
              key={p.title}
              className={
                ESPACE_CLIENT_PUBLIE
                  ? cn(CADRE_CARTE_NEUTRE, FILET_MASQUE, CARTE_RANGEE, "max-e300:px-3 max-e300:py-2")
                  : "p-4 sm:p-6"
              }
              id={`parcours-${p.slug}`}
              filet={ESPACE_CLIENT_PUBLIE}
            >
              {/* s26 parcours v2 (`docs/design/parcours-connecte-v2-s26.md` §7) : `space-y-2` au lieu de `space-y-0`, qui
                  annulait les `mt-2` du titre et de la phrase (titre collé à sa phrase) : méta-titre 8 px, titre-texte 8 px. */}
              <CardHeader className={o("space-y-2 pb-0", "pb-2")}>
                {/* s26 DA du site (décision de Thomas du 20/11) : ouvert, l'émoji du parcours en tête de carte, comme les cartes
                    « Tu te reconnais ? » de l'accueil (fermé : dans le titre, inchangé). */}
                {ESPACE_CLIENT_PUBLIE && (
                  // Sous 300 px (200 % de texte, 188 x 406) : masqué, le premier parcours reste dans les deux premiers écrans.
                  <p className={cn(EMOJI_CARTE, "mb-3 max-e300:hidden")} aria-hidden="true">
                    {p.emoji}
                  </p>
                )}
                {/* s26 tour 3 (point 2, ouvert seulement) : plus aucun « · » (ni en fin ni en début de ligne), les items sont
                    séparés par l'espace seul (`gap-x-4`). Fermé : les spans d'avant. */}
                {/* s26 tour 2 (200 % de texte, 188 x 406) : sous 300 px, lignes de la méta jointives ; niveau sur plusieurs
                    lignes si besoin (« Débutant → Intermédiaire » débordait de 29 px à 188). */}
                {/* s26 parcours v2 (§7) : items en `whitespace-nowrap` (« 325 XP à gagner » ne s'orpheline plus), lignes
                    jointives. */}
                <div className={o(cn("flex min-h-6 flex-wrap items-center gap-x-4 gap-y-0", META), "flex flex-wrap items-center gap-x-3 gap-y-1")}>
                  <Badge variant="primary" className={o("min-w-0 shrink whitespace-normal")}>{p.difficulty}</Badge>
                  <span className={o("whitespace-nowrap text-sm text-text-secondary", "text-sm text-text-secondary")}>
                    {p.duration}
                  </span>
                  {!ESPACE_CLIENT_PUBLIE && <span aria-hidden="true" className="hidden text-sm text-text-muted sm:inline">·</span>}
                  <span className={o(cn(META, "whitespace-nowrap"), "text-sm text-text-muted")}>{p.timePerWeek}</span>
                  {!ESPACE_CLIENT_PUBLIE && <span aria-hidden="true" className="hidden text-sm text-text-muted sm:inline">·</span>}
                  <span className={o(cn(META, "whitespace-nowrap"), "text-sm text-text-muted")}>{totalXp} XP à gagner</span>
                  {isDone && <Badge variant="success" className={o(cn(PASTILLE, "font-normal text-success"))}>{LISTE_PARCOURS.termine}</Badge>}
                </div>
                <CardTitle className={o(cn(TITRE_CARTE_ACCUEIL, "mt-2 text-xl"), "mt-3 text-2xl")}>
                  {/* s26 tour 2 : titre à 137 px du haut (128 de `scroll-padding-top` de l'en-tête universel, + 9). */}
                  <span id={`parcours-title-${p.slug}`} tabIndex={-1} className={o("scroll-mt-[9px] focus:outline-none", "scroll-mt-24 focus:outline-none")}>
                    {!ESPACE_CLIENT_PUBLIE && <span className="mr-2" aria-hidden="true">{p.emoji}</span>}
                    {p.title}
                  </span>
                </CardTitle>
                {/* s19 (N1 @design rendu) : typographie française au rendu, tous parcours. */}
                <p className={o("mt-2 text-pretty text-base font-medium text-accent-link", "mt-1 text-pretty text-sm font-medium text-accent-link")}>
                  {frTypoTexte(p.persona)}
                </p>
              </CardHeader>
              <CardContent className={ESPACE_CLIENT_PUBLIE ? "contents" : undefined}>
                <ColonnesTexte>
                <p className={o(cn(TEXTE, "text-pretty"), "mb-4 text-pretty text-text-secondary")}>{frTypoTexte(stripEmDashes(p.description))}</p>

                {/* Testimonial (s26 : méta en italique, sans fond) */}
                {/* s26 tour 2 : interligne de 24 px dès 768 px, comme la description. Tour 5 : sa propre cellule de grille
                    (plus de `mt-4`, l'écart est le `gap` de la grille). */}
                <p className={o(cn(META, "text-pretty italic md:leading-6"), "mb-6 text-pretty rounded-lg bg-accent-primary/5 p-3 text-sm italic text-text-secondary")}>
                  {frTypoTexte(stripEmDashes(p.testimonial))}
                </p>
                </ColonnesTexte>

                {/* Progression : affichée seulement une fois le parcours commencé (T26). s26 parcours connecté (arbitrage de
                    l'orchestrateur du 19/11) : espace ouvert, l'abonné la voit sur TOUTES ses cartes (barre vide, même
                    gabarit `n/total`), juste avant le pied. */}
                {(progressValue > 0 || enteteEspace) && (
                  <div className={o("mt-4", "mb-6")}>
                    {/* Libellé passé à la barre : nom accessible de la progressbar (axe, s16). s26 : en tête de carte,
                        remplissage gris clair sur rail visible (comme `BarreProgression`), aucun violet. */}
                    {/* s26 parcours v2 (`docs/design/parcours-connecte-v2-s26.md` §4, piste 4) : même barre segmentée que la
                        carte « En cours » (étape à reprendre cernée ; pas entamé : tous les segments « à venir »). */}
                    {ESPACE_CLIENT_PUBLIE ? (
                      <div className="tabular-nums">
                        <p id={`parcours-avancee-${p.slug}`} className={cn(META, "mb-2")}>{`${progressValue}/${progressMax} étapes`}</p>
                        <BarreSegmentee
                          faites={progressValue}
                          total={progressMax}
                          enCours={progressValue > 0 && !isDone ? (prog?.nextStep ?? null) : null}
                          texte={`${progressValue}/${progressMax} étapes`}
                          labelledBy={`parcours-avancee-${p.slug}`}
                        />
                      </div>
                    ) : (
                    <ProgressBar
                      label={`${progressValue}/${progressMax} étapes`}
                      value={progressValue}
                      max={progressMax}
                      className={o("tabular-nums [&_[role=progressbar]>div]:bg-none [&_[role=progressbar]>div]:bg-text-secondary [&_[role=progressbar]]:bg-border-hover [&_span]:text-text-secondary")}
                    />
                    )}
                    {/* s26 tour 2 (P2) : ouvert, « XP à gagner » une seule fois par carte (déjà dans la méta). */}
                    {!ESPACE_CLIENT_PUBLIE && <p className="mt-2 text-right text-xs text-text-muted">{totalXp} XP à gagner</p>}
                  </div>
                )}

                {/* v6 tour 4, point 2 (ouvert seulement) : « Programme » et le bloc du bouton forment un seul bloc de fin
                    de carte (`mt-auto`, écart `gap-6` au lieu du `mb-6`) : plus de trou entre eux, barres « Programme » et
                    boutons alignés d'une carte jumelle à l'autre. Fermé : `PiedCarte` est un fragment, HTML d'avant. */}
                <PiedCarte
                  // s26 tour 2 : 16 px au-dessus dès 768 px, les colonnes équilibrées gardant jusqu'à 16 px de jeu sous leur
                  // texte (marge du témoignage) : 32 px au plus entre le texte et « Programme ».
                  // s26 parcours, tour 6 : dès 1024 px, la grille fixe du texte (`GRILLE_PIED`) au lieu de deux moitiés en flex.
                  className={o(cn("mt-6 flex flex-col gap-4", zones && cn("lg:items-start", GRILLE_PIED)))}
                >
                {/* Programme replié par défaut (T24) */}
                <details
                  className={ESPACE_CLIENT_PUBLIE ? cn("group", BLOC_EXEMPLE, zones && "lg:min-w-0") : "group mb-6"}
                  open={openSlugs.has(p.slug)}
                  onToggle={(e) => setProgrammeOpen(p.slug, e.currentTarget.open)}
                >
                  <summary
                    className={o(
                      // s26 tour 2 : 48 px dès 1024 px, à la hauteur du bouton voisin (pied en ligne).
                      // s26 DA du site (décision de Thomas du 20/11) : en-tête des accordéons de l'accueil (« Exemple concret »).
                      cn(DETAILS_SUMMARY, "rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary lg:min-h-12"),
                      "flex min-h-[44px] cursor-pointer list-none items-center justify-between gap-2 rounded-md border border-border px-3 text-sm font-semibold uppercase tracking-wider text-text-secondary hover:text-text-primary [&::-webkit-details-marker]:hidden",
                    )}
                  >
                    Programme
                    <svg className="h-4 w-4 shrink-0 transition-transform group-open:rotate-180" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <ol className={o("space-y-2 px-4 pb-4", "mt-3 space-y-2")}>
                    {p.modules.map((m) => (
                      <li
                        key={m.week}
                        className={o("flex flex-col gap-2 rounded-lg bg-background-card p-4 sm:flex-row sm:items-start sm:gap-3", "flex flex-col gap-2 rounded-md bg-background-elevated p-3 sm:flex-row sm:items-start sm:gap-3")}
                      >
                        <Badge
                          variant="secondary"
                          className={o(
                            "w-fit shrink-0 whitespace-nowrap sm:mt-0.5 sm:w-[5.25rem] sm:justify-center",
                            "w-fit shrink-0 whitespace-nowrap sm:mt-0.5 sm:w-[5.25rem] sm:justify-center",
                          )}
                        >
                          {m.week}
                        </Badge>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className={o(TEXTE_FORT, "font-medium text-text-primary")}>
                              {frTypo(m.title)}
                            </span>
                            {m.free && (
                              <Badge variant="success" className={o(cn(PASTILLE, "font-normal text-success"))}>{ETAPE_LIBRE_BADGE}</Badge>
                            )}
                          </div>
                          {/* s19 : sauts de paragraphe rendus ; typographie française (import-boulot.md §5),
                              tous parcours depuis l'iter 5 (H @design, S17 @ux). */}
                          <p className={o(cn(META, "mt-2 whitespace-pre-line"), "mt-1 whitespace-pre-line text-sm text-text-secondary")}>
                            {frTypoParcours(m.detail)}
                          </p>
                          <p className={o(cn(META, "mt-2"), "mt-1 text-xs text-text-muted")}>
                            Format : {m.format}
                          </p>
                          <span className={o(cn(META, "mt-1 inline-block"), "mt-1 inline-block text-xs text-accent-link")}>
                            +{m.xp} XP
                          </span>
                        </div>
                      </li>
                    ))}
                  </ol>
                </details>

                {/* v6 tour 3, point 12 : cartes jumelles de même hauteur ; tour 4, point 2 : le `mt-auto` passe au bloc
                    commun (`PiedCarte`). Forme et place du bouton inchangées (cta-forme-place-s21 §1.3). */}
                {/* s26 parcours, tour 7 (relecture design v4, point 14) : espace ouvert, la carte du parcours que « Reprendre »
                    fait reprendre (carte « En cours » au-dessus) n'a plus de « Continuer ce parcours » ; « Programme » reste. */}
                {/* s26 parcours, tour 8 (relecture design v5, liste 1 ; UX v5 D2) : la case laissée vide reçoit le « Reprendre »
                    existant de la carte « En cours », même lien, en CONTOUR (le plein reste celui de la carte « En cours »). */}
                {enteteEspace && enCoursSlug === p.slug ? (
                  lienEnCours && (
                    <div className="flex flex-col gap-2 lg:min-w-0">
                      <Link
                        href={lienEnCours}
                        data-testid="carte-parcours-reprendre"
                        className={cn(buttonVariants({ variant: "outline-accent", size: "lg" }), "h-auto min-h-12 w-full whitespace-normal py-2 sm:w-auto lg:w-full")}
                      >
                        {TEXTES_AUJOURDHUI.etape.reprendre}
                      </Link>
                    </div>
                  )
                ) : (
                <div
                  className={cn(
                    "flex flex-col gap-2",
                    zones && "lg:min-w-0",
                    // s26 parcours, tour 8 (relecture design v5, liste 2) : sous 768 px, quand « Tester l'étape 1 » de ce parcours
                    // est remonté au-dessus des cartes, le bloc entier est masqué (bouton ET « Sans compte. La suite : Premium. »,
                    // phrase orpheline sous « Programme » sinon).
                    premierEtape1?.slug === p.slug && etape1Slug && "max-md:hidden",
                  )}
                >
                  {/* s21 B15 (froid) : un plein par carte vers l'étape 1 gratuite, ligne frontière dessous. */}
                  <Button
                    // v6 tour 1, point 12 (interrupteur ouvert, abonné) : un seul plein, celui du parcours en cours
                    // ou, sans parcours entamé, du parcours conseillé ; les autres en contour (niveau 2). Le visiteur
                    // et le compte gratuit gardent l'exception (b) de s21 : un plein par carte, vers l'étape 1.
                    // s26 (choix de l'orchestrateur sur le double aplat, `docs/design/parcours-vannes-s26.md` §0) : espace
                    // ouvert, tous les boutons de carte en contour neutre, visiteur, compte gratuit et abonné. L'en-tête
                    // collant garde le bouton d'offre plein à chaque écran (visiteur, gratuit) et l'abonné a son plein
                    // dans « l'étape à reprendre » : un plein de carte ferait deux aplats violets dans le même écran.
                    // s26 DA du site (décision de Thomas du 20/11) : contour violet de l'accueil (« Révéler la chute »), jamais plein.
                    variant={ESPACE_CLIENT_PUBLIE ? "outline-accent" : "primary"}
                    size="lg"
                    // s26 parcours, tour 6 (D3 de la relecture design v3) : sous 768 px, le parcours dont « Tester l'étape 1 »
                    // est remonté en tête de liste (`premierEtape1`) n'a pas de second bouton dans sa carte.
                    className={cn(
                      "h-auto min-h-12 w-full whitespace-normal py-2 sm:w-auto",
                      !ESPACE_CLIENT_PUBLIE && CORPS_APPEL_MOBILE,
                      zones && "lg:w-full",
                    )}
                    onClick={() => handleCta(p.slug, etape1Slug !== null)}
                  >
                    {etape1Slug
                      ? LISTE_PARCOURS_CTA.bouton(etape1Slug)
                      : isDone
                        ? LISTE_PARCOURS.revoir
                        : progressValue > 0
                          ? "Continuer ce parcours"
                          : "Commencer ce parcours"}
                  </Button>
                  {etape1Slug && <p className={o(META, "text-xs text-text-muted")}>{frontiereListe(etape1Slug, ESPACE_CLIENT_PUBLIE && statut !== "visiteur")}</p>}
                </div>
                )}
                </PiedCarte>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {parcoursEntame && quizOrientation}
    </>
  );
}
