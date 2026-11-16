"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useSession } from "next-auth/react";
import { CARTE_A_FILET, Card, CardContent, CardHeader, CardTitle, FiletCarte } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/progress-bar";
import { progressionParcoursLabel } from "@/config/textes/accessibilite";
import { StreakCounter } from "@/components/ui/streak-counter";
import { useUserStore } from "@/stores/user-store";
import { USER_LEVELS, cn } from "@/lib/utils";
import { toast } from "@/components/ui/toast";
import Link from "next/link";
import { buildLoginUrl } from "@/lib/auth-links";
import { PARCOURS_MIN_WEEKS } from "@/config/premium";
import { AbonnementCard } from "@/components/profil/abonnement-card";
import { SupprimerCompteCard } from "@/components/profil/supprimer-compte-card";
import { PrenomCard } from "@/components/profil/prenom-card";
import { useSubscriptionSummary } from "@/hooks/use-subscription-summary";
import { PROGRESSION_NIVEAU, SERIE } from "@/config/textes/parcours";
import { RappelParcoursToggle } from "@/app/(dashboard)/profil/rappel-parcours-toggle";
import { LettreHebdoReglage } from "@/components/lettre/lettre-hebdo-reglage";
import { QuestionEquipeCard } from "@/components/profil/question-equipe-card";
import { trackCheckoutEchec, trackCheckoutOuvert } from "@/lib/checkout-tracking";
import { ESPACE_CLIENT_PUBLIE } from "@/config/espace-client";
import { CapProfil } from "@/components/espace/cap-profil";
import { LigneMesQuestions } from "@/components/espace/profil/ligne-mes-questions";
import { ErreurProfil } from "@/components/espace/profil/erreur-profil";

const LEVEL_ORDER: (keyof typeof USER_LEVELS)[] = [
  "NOVICE",
  "APPRENTI",
  "FARCEUR",
  "COMIQUE",
  "LEGENDE",
];

function getNextLevel(currentLevel: string) {
  const idx = LEVEL_ORDER.indexOf(currentLevel as keyof typeof USER_LEVELS);
  if (idx === -1 || idx >= LEVEL_ORDER.length - 1) return null;
  return LEVEL_ORDER[idx + 1];
}

function getXpProgress(xp: number, currentLevel: string) {
  const currentInfo = USER_LEVELS[currentLevel as keyof typeof USER_LEVELS];
  const nextKey = getNextLevel(currentLevel);
  if (!nextKey) return { value: 100, max: 100, label: "Niveau maximum atteint !" };
  const nextInfo = USER_LEVELS[nextKey];
  const currentMin = currentInfo?.minXp ?? 0;
  const nextMin = nextInfo.minXp;
  return {
    value: xp - currentMin,
    max: nextMin - currentMin,
    label: `Prochain niveau : ${nextInfo.label}`,
  };
}

interface ParcoursProgress {
  slug: string;
  title: string;
  icon: string;
  completedSteps: number;
  totalSteps: number;
  completedAt: string | null;
}

/**
 * v6 tour 1, point 13 : interrupteur ouvert, `grid-cols-1` (= `minmax(0, 1fr)`) sous 768 px ; sans lui, la piste
 * implicite prend la largeur minimale d'un enfant insécable et les cartes débordent à 290 px. Fermé : inchangé.
 */
const grilleProfil = () => (ESPACE_CLIENT_PUBLIE ? "grid grid-cols-1 gap-6 md:grid-cols-2" : "grid gap-6 md:grid-cols-2");

/**
 * v6 tour 3, point 5 (interrupteur ouvert seulement) : dès `lg`, les cartes courtes vont deux par ligne, de même
 * hauteur (`items-stretch`) ; le `md:col-span-2` que portent les cartes est neutralisé dans le groupe (sélecteur
 * plus précis). Les cartes longues (« Prochaine étape », « Mes parcours », suppression du compte) restent en pleine
 * largeur. v6 tour 4, point 4 : plus aucune carte seule en demi-largeur ; une carte impaire en fin de groupe prend la
 * ligne entière (`lg:col-span-2`). Pour qu'aucune carte ne soit étirée autour d'une seule ligne, « Ta question à
 * l'équipe » sort du groupe (ligne pleine largeur sous lui) et « Ton prénom » empile champ et bouton quand il a une
 * voisine (`prenom-card.tsx`).
 */
export const GROUPE_COURT = cn(
  "grid grid-cols-1 gap-6 md:col-span-2 lg:grid-cols-2 lg:items-stretch [&>*:nth-child(n)]:col-span-1",
  "lg:[&>:last-child:nth-child(odd)]:col-span-2",
);

/**
 * v6 tour 4, point 6 (interrupteur ouvert seulement) : les boutons `size="sm"` du profil (32 px dès 768) passent en
 * cible de 44 px à toutes les largeurs. Le composant `Button` n'est pas touché ; fermé, classes d'avant.
 */
export const CIBLE_44_MD = "md:h-11";

/** Groupe de cartes courtes ouvert ; fermé, un simple fragment (HTML d'avant au caractère près). */
function GroupeCourt({ children }: { children: ReactNode }) {
  if (!ESPACE_CLIENT_PUBLIE) return <>{children}</>;
  return (
    <div className={GROUPE_COURT} data-profil-groupe="">
      {children}
    </div>
  );
}

export function ProfilDashboard() {
  const { status } = useSession();
  const { user, isLoading, fetchUser } = useUserStore();
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
  const [parcoursProgress, setParcoursProgress] = useState<ParcoursProgress[]>([]);
  // Résumé d'abonnement lu une fois, partagé par les cartes Abonnement et Suppression (lot G).
  const abonnement = useSubscriptionSummary(status === "authenticated");
  // s24 lot D10 : lecture du compte terminée (succès ou échec), pour l'état d'erreur ouvert seulement.
  const [lectureFaite, setLectureFaite] = useState(false);

  const handleCheckout = async () => {
    setIsCheckoutLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        trackCheckoutOuvert("profil");
        window.location.href = data.url;
      } else {
        // s16 : message du serveur s'il existe (ex. abonnement déjà en cours, 409).
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        trackCheckoutEchec("profil", res.status === 409 ? "conflit" : "erreur");
        toast(data.error ?? "Le paiement n’a pas pu démarrer. Réessaie dans un instant.", "error");
      }
    } catch {
      trackCheckoutEchec("profil", "reseau");
      toast("Connexion perdue, réessaie", "error");
    } finally {
      setIsCheckoutLoading(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      void Promise.resolve(fetchUser()).finally(() => setLectureFaite(true));
      fetch("/api/user/progress")
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data?.parcours) {
            setParcoursProgress(data.parcours);
          }
        })
        .catch(() => {});
    }
  }, [status, fetchUser]);

  if (status === "unauthenticated") {
    return (
      <Card filet={ESPACE_CLIENT_PUBLIE}>
        <CardContent className="flex flex-col items-center py-12 text-center">
          <span className="text-4xl" role="img" aria-label="cadenas">
            🔒
          </span>
          <p className="mt-4 text-lg font-medium text-text-primary">
            Connecte-toi pour voir ton profil
          </p>
          <Link href={buildLoginUrl({ callbackUrl: "/profil" })} className="mt-4">
            <Button variant="primary" size="sm">
              Se connecter
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  // s24 lot D10 : espace ouvert, compte illisible = message et « Réessayer » (fermé : squelette, inchangé).
  if (ESPACE_CLIENT_PUBLIE && lectureFaite && !isLoading && !user) {
    return <ErreurProfil onReessayer={() => void fetchUser()} />;
  }

  if (isLoading || !user) {
    return (
      <div className={grilleProfil()}>
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="animate-pulse" filet={ESPACE_CLIENT_PUBLIE}>
            <CardContent className="py-8">
              <div className="h-6 w-1/3 rounded bg-background-elevated" />
              <div className="mt-4 h-4 w-2/3 rounded bg-background-elevated" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const levelInfo = USER_LEVELS[user.level as keyof typeof USER_LEVELS] ?? USER_LEVELS.NOVICE;
  const progress = getXpProgress(user.xp, user.level);
  // Progression, série, statistiques et parcours suivis = Premium (s15
  // §1.1). Hors abonnement, rien n'est effacé en base : seul l'affichage change.
  const isPremium = user.plan === "PREMIUM";
  const parcoursEnCours = isPremium && parcoursProgress.some((p) => !p.completedAt && p.completedSteps < p.totalSteps);

  // Prochaine étape : recommandation personnalisée. s17 tour 1 (UXV-1-09) : masquée quand
  // un parcours est en cours, « Reprendre ton parcours » (en tête de page) suffit.
  const prochaineEtape = (
    !parcoursEnCours && (
        <Card className="md:col-span-2" filet={ESPACE_CLIENT_PUBLIE}>
          <CardHeader>
            <CardTitle>Prochaine étape</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={ESPACE_CLIENT_PUBLIE ? "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3" : "grid gap-4 sm:grid-cols-2 lg:grid-cols-3"}>
              {user.stats.tipsCompleted < 3 && (
                <Link href="/conseils" className="group">
                  <div className="rounded-lg border border-border p-4 transition-colors group-hover:border-accent-primary">
                    <p className="font-semibold text-accent-link">Apprends les bases</p>
                    <p className="mt-1 text-sm text-text-secondary">
                      Commence par la répartie et le timing : les deux réflexes qui changent le plus vite une conversation.
                    </p>
                  </div>
                </Link>
              )}
              {user.stats.jokesRead < 10 && (
                <Link href="/vannes" className="group">
                  <div className="rounded-lg border border-border p-4 transition-colors group-hover:border-accent-primary">
                    <p className="font-semibold text-accent-link">Enrichis ton répertoire</p>
                    <p className="mt-1 text-sm text-text-secondary">
                      Pioche des vannes par situation et garde de côté celles que tu te vois déjà ressortir.
                    </p>
                  </div>
                </Link>
              )}
              {user.stats.tipsCompleted >= 3 && user.stats.jokesRead >= 10 && parcoursProgress.length === 0 && (
                <Link href="/parcours" className="group">
                  <div className="rounded-lg border border-border p-4 transition-colors group-hover:border-accent-primary">
                    <p className="font-semibold text-accent-link">Lance-⁠toi dans un parcours</p>
                    <p className="mt-1 text-sm text-text-secondary">
                      Tu as les bases. Un parcours te donne un fil à suivre, une étape après l’autre.
                    </p>
                  </div>
                </Link>
              )}
              {user.stats.tipsCompleted >= 3 && user.stats.jokesRead >= 10 && parcoursProgress.length > 0 && (
                <Link href="/conseils" className="group">
                  <div className="rounded-lg border border-border p-4 transition-colors group-hover:border-accent-primary">
                    <p className="font-semibold text-accent-link">Approfondis tes techniques</p>
                    <p className="mt-1 text-sm text-text-secondary">
                      Tu as les bases : passe aux conseils avancés, ceux qui font la différence entre drôle et vraiment drôle.
                    </p>
                  </div>
                </Link>
              )}
              <Link href="/videos" className="group">
                <div className="rounded-lg border border-border p-4 transition-colors group-hover:border-accent-primary">
                  <p className="font-semibold text-accent-link">Regarde les pros</p>
                  <p className="mt-1 text-sm text-text-secondary">
                    Décortique les techniques des meilleurs humoristes, puis pique-⁠leur ce qui te va.
                  </p>
                </div>
              </Link>
            </div>
          </CardContent>
        </Card>
        )
  );

  return (
    <div className={grilleProfil()}>
      {/* v6 tour 2, point 13 (interrupteur ouvert) : « Prochaine étape » en tête pour tous, nouvel abonné compris
          (même ordre que pour un compte sans abonnement : l'action d'abord, les compteurs à zéro ensuite). Fermé : inchangé. */}
      {ESPACE_CLIENT_PUBLIE && prochaineEtape}
      {isPremium && (
        <>
      {/* v6 tour 3, point 5 (ouvert) : « Ton cap » et « Statistiques » côte à côte dès `lg`. Fermé : fragment. */}
      <GroupeCourt>
      {/* s24 lot D4 : espace ouvert, la carte « Ton cap » remplace la carte « Progression » (fermé : inchangé). */}
      {ESPACE_CLIENT_PUBLIE ? (
        // Arbitrage @ux D4 n°2 (lot D5) : la carte « Série » est retirée espace ouvert, « Ton cap » prend la largeur.
        <CapProfil xp={user.xp} serie={user.streak} className="md:col-span-2" />
      ) : (
      <Card>
        <CardHeader>
          <CardTitle>Progression</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex items-center gap-3">
            <span className="text-3xl">{levelInfo.icon}</span>
            <div>
              <p className="font-bold text-text-primary">{levelInfo.label}</p>
              <p className="text-sm text-text-secondary">{user.xp} XP</p>
            </div>
          </div>
          <ProgressBar
            value={progress.value}
            max={progress.max}
            label={progress.label}
            showPercentage
            variant="gradient"
          />
          {/* s17 tour 1 (UXV-1-09) : « Premiers XP » seulement au premier niveau. */}
          <p className="mt-2 text-xs text-text-muted">
            {progress.value >= progress.max
              ? PROGRESSION_NIVEAU.max
              : progress.value / progress.max >= 0.75
                ? PROGRESSION_NIVEAU.presque
                : progress.value / progress.max >= 0.25
                  ? PROGRESSION_NIVEAU.milieu
                  : user.level === LEVEL_ORDER[0]
                    ? PROGRESSION_NIVEAU.debut
                    : PROGRESSION_NIVEAU.nouveauNiveau(levelInfo.label)}
          </p>
        </CardContent>
      </Card>
      )}

      {/* Série (s17 tour 1, DES-1-03 / DES-1-09 : titre français, carte resserrée). Lot D5 (arbitrage @ux D4
          n°2) : espace ouvert, la série vit sur « Ton cap » (une seule occurrence) ; fermé, inchangé. */}
      {!ESPACE_CLIENT_PUBLIE && (
      <Card>
        <CardHeader>
          <CardTitle>{SERIE.titre}</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-2">
          <StreakCounter count={user.streak} />
        </CardContent>
      </Card>
      )}

      {/* Statistiques (s17 tour 1, DES-1-09 : pleine largeur, plus de trou dans la grille) */}
      <Card className="md:col-span-2" filet={ESPACE_CLIENT_PUBLIE}>
        <CardHeader>
          <CardTitle>Statistiques</CardTitle>
        </CardHeader>
        <CardContent>
          {/* v6 tour 4, point 4 (ouvert) : à côté de « Ton cap » dès `lg`, les 4 compteurs passent en 2 × 2 (plus de
              carte étirée autour d'une seule ligne de chiffres). */}
          <div className={ESPACE_CLIENT_PUBLIE ? "grid grid-cols-2 gap-4 text-center sm:grid-cols-4 lg:grid-cols-2" : "grid grid-cols-2 gap-4 text-center sm:grid-cols-4"} data-profil-stats={ESPACE_CLIENT_PUBLIE ? "" : undefined}>
            <div>
              <p className="text-2xl font-bold text-accent-link">
                {user.stats.jokesRead}
              </p>
              <p className="text-xs text-text-muted">Vannes lues</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-accent-link">
                {user.stats.tipsCompleted}
              </p>
              <p className="text-xs text-text-muted">Conseils terminés</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-accent-link">
                {user.stats.totalFavorites}
              </p>
              <p className="text-xs text-text-muted">Favoris sauvegardés</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-accent-link">
                {user.stats.pathsCompleted}
              </p>
              <p className="text-xs text-text-muted">Parcours terminés</p>
            </div>
          </div>
        </CardContent>
      </Card>
      </GroupeCourt>

      {/* Parcours en cours */}
      <Card className="md:col-span-2" filet={ESPACE_CLIENT_PUBLIE}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Mes parcours</CardTitle>
            <Link href="/parcours">
              <Button variant="ghost" size="sm" className={ESPACE_CLIENT_PUBLIE ? CIBLE_44_MD : undefined}>
                Voir tout
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {parcoursProgress.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border p-6 text-center">
              <p className="text-sm text-text-secondary">
                Tu n’as pas encore commencé de parcours. Le plus court dure {PARCOURS_MIN_WEEKS} semaines, à peine le temps de t’y habituer.
              </p>
              <Link href="/parcours">
                <Button variant="primary" size="sm" className={ESPACE_CLIENT_PUBLIE ? cn("mt-3", CIBLE_44_MD) : "mt-3"}>
                  Découvrir les parcours
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {parcoursProgress.map((p) => {
                const pct = p.totalSteps > 0 ? Math.round((p.completedSteps / p.totalSteps) * 100) : 0;
                const isDone = p.completedAt !== null;
                return (
                  <Link
                    key={p.slug}
                    href={`/parcours/${p.slug}`}
                    className="block group"
                  >
                    <div className={`rounded-lg border p-4 transition-colors ${isDone ? "border-accent-primary/30 bg-accent-primary/5" : "border-border group-hover:border-accent-primary"}`}>
                      {/* v6 tour 1, point 13 : interrupteur ouvert, titre et « n/3 étapes » passent à la ligne à 290 et 320 px. */}
                      <div className={ESPACE_CLIENT_PUBLIE ? "mb-2 flex flex-wrap items-center justify-between gap-x-3 gap-y-1" : "flex items-center justify-between mb-2"}>
                        <div className={ESPACE_CLIENT_PUBLIE ? "flex min-w-0 items-center gap-2" : "flex items-center gap-2"}>
                          <span className="text-xl">{p.icon}</span>
                          <span className={ESPACE_CLIENT_PUBLIE ? "min-w-0 text-sm font-medium text-text-primary [overflow-wrap:anywhere]" : "font-medium text-text-primary text-sm"}>{p.title}</span>
                        </div>
                        {isDone ? (
                          <Badge variant="primary">Terminé</Badge>
                        ) : (
                          <span className="text-xs text-text-muted">{p.completedSteps}/{p.totalSteps} étapes</span>
                        )}
                      </div>
                      <ProgressBar
                        value={p.completedSteps}
                        max={p.totalSteps}
                        variant={isDone ? "gradient" : "primary"}
                        ariaLabel={progressionParcoursLabel(p.title, p.completedSteps, p.totalSteps)}
                      />
                      <p className="mt-1 text-xs text-text-muted text-right">{pct}%</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* s17 tour 1 (UXV-1-02, DES-1-08) : rappel juste sous « Mes parcours » (rien si le compte n'y a pas droit).
          v6 tour 3, point 5 : ouvert, il ouvre le groupe des cartes courtes ci-dessous (même place, sous « Mes parcours »). */}
      {!ESPACE_CLIENT_PUBLIE && <RappelParcoursToggle className="md:col-span-2" />}
        </>
      )}

      {/* Prochaine étape, interrupteur fermé : à sa place d'avant (après les cartes Premium). */}
      {!ESPACE_CLIENT_PUBLIE && prochaineEtape}

      {/* v6 tour 3, point 5 (ouvert) : rappel, abonnement, question à l'équipe, lettre et prénom deux par ligne dès
          `lg`. Fermé : fragment, cartes à leur place d'avant. */}
      <GroupeCourt>
      {ESPACE_CLIENT_PUBLIE && isPremium && <RappelParcoursToggle className="md:col-span-2" />}

      {/* Abonnement (s16 reco 11 : formule, échéance, impayé, changer de formule) */}
      <AbonnementCard
        plan={user.plan}
        onCheckout={handleCheckout}
        isCheckoutLoading={isCheckoutLoading}
        abonnement={abonnement}
      />

      {/* s22 : « Ta question à l'équipe », Premium seulement, sous la carte abonnement. Absente interrupteur fermé.
          s24 lot D10 (plan §6 T8) : espace ouvert, l'encadré devient une ligne de lien vers « Mes questions ». */}
      {/* v6 tour 2, point 13 : la ligne prend le cadre à filet des autres cartes du profil (`CARTE_A_FILET` + filet,
          carte intérieure en `rounded-xl` : même rendu qu'une `Card filet`), sans titre nouveau. La ligne elle-même
          (`components/espace/profil/ligne-mes-questions.tsx`) n'est pas touchée. */}
      {/* v6 tour 4, point 4 : ouvert, la ligne sort du groupe (rendue sous lui, pleine largeur, hauteur naturelle). */}
      {!ESPACE_CLIENT_PUBLIE && isPremium && <QuestionEquipeCard className="md:col-span-2" />}

      {/* s21 : lettre de la semaine (Premium), sous la carte abonnement (spec US-H2). Absente interrupteur fermé. */}
      <LettreHebdoReglage className="md:col-span-2" />

      {/* s21 concision (18/10) : prénom renseigné après coup (plus demandé à l'inscription). */}
      <PrenomCard key={user.id} prenom={user.name} />
      </GroupeCourt>

      {/* v6 tour 4, point 4 (ouvert) : « Ta question à l'équipe » hors de la grille des cartes courtes, une ligne pleine
          largeur de la coque à hauteur naturelle (plus de carte haute et vide autour d'une ligne). */}
      {ESPACE_CLIENT_PUBLIE && isPremium && (
        <div className={cn("md:col-span-2", CARTE_A_FILET)} data-profil-questions-cadre="">
          <FiletCarte />
          <LigneMesQuestions className="rounded-xl" />
        </div>
      )}

      {/* s16 reco 5 : suppression du compte en libre-service */}
      <SupprimerCompteCard
        abonne={isPremium}
        finPeriode={abonnement.summary?.currentPeriodEnd ?? null}
        resilie={abonnement.summary?.cancelAtPeriodEnd ?? false}
      />
    </div>
  );
}
