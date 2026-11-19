"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useUserStore } from "@/stores/user-store";
import { useSubscriptionSummary } from "@/hooks/use-subscription-summary";
import { toast } from "@/components/ui/toast";
import { trackCheckoutEchec, trackCheckoutOuvert } from "@/lib/checkout-tracking";
import { ReprendreParcours } from "@/components/home/reprendre-parcours";
import { AbonnementCard } from "@/components/profil/abonnement-card";
import { PrenomCard } from "@/components/profil/prenom-card";
import { SupprimerCompteCard } from "@/components/profil/supprimer-compte-card";
import { LettreHebdoReglage } from "@/components/lettre/lettre-hebdo-reglage";
import { RappelParcoursToggle } from "@/app/(dashboard)/profil/rappel-parcours-toggle";
import { CapProfil } from "@/components/espace/cap-profil";
import { LigneMesQuestions } from "@/components/espace/profil/ligne-mes-questions";
import { ErreurProfil } from "@/components/espace/profil/erreur-profil";
import { ConnexionProfil, MesParcours, ProchaineEtape, SqueletteProfil, Statistiques, type ParcoursProgress } from "@/components/espace/profil/profil-cartes";
import { CADRE_CARTE_NEUTRE } from "@/components/espace/carte/styles";
import { ECHELLE_CARTES_PARTAGEES } from "@/components/espace/typo";
import { cn } from "@/lib/utils";

/** Grille 12 colonnes ; les cartes partagées (`Card filet`) perdent leur filet violet ici seulement (un seul aplat). */
// « Ton cap » (`TonCap`, partagé) : points, flamme et filet en gris comme les segments d'« Aujourd'hui » ; le seul fond
// violet reste le bouton plein.
const NEUTRE_CAP =
  "[&_.bg-accent-primary]:bg-text-secondary [&_.border-accent-primary]:border-text-secondary [&_.text-accent-primary-hover]:text-text-secondary [&_[aria-labelledby=ton-cap-titre]]:before:hidden";
const GRILLE = `mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-12 lg:grid-rows-[auto_1fr] lg:items-start [&_[data-filet]]:hidden ${NEUTRE_CAP} ${ECHELLE_CARTES_PARTAGEES}`;
const COLONNE = "flex min-w-0 flex-col gap-6";

/**
 * « Mon profil », interrupteur OUVERT (s26, `docs/ux/questions-repliques-lettre-profil-s26.md` §4, design §7). Mêmes
 * lectures que `ProfilDashboard` (compte, parcours, résumé d'abonnement), mêmes cartes et mêmes textes ; la page fermée
 * garde `ProfilDashboard`, au caractère près. Ordre du DOM : prochaine action, abonnement, progression, réglages,
 * suppression. Dès 1024 : 8 colonnes à gauche (prochaine action, puis cap, statistiques et parcours), 4 à droite
 * (abonnement, puis réglages) ; suppression en bas, pleine largeur, discrète. Gratuit : pas de progression, ses
 * réglages passent sous la prochaine étape (8). Ancres `#abonnement` et `#rappel-parcours` portées par les cartes.
 */
export function ProfilOuvert() {
  const { status } = useSession();
  const { user, isLoading, fetchUser } = useUserStore();
  const [paiementEnCours, setPaiementEnCours] = useState(false);
  const [parcours, setParcours] = useState<ParcoursProgress[]>([]);
  const abonnement = useSubscriptionSummary(status === "authenticated");
  const [lectureFaite, setLectureFaite] = useState(false);

  useEffect(() => {
    if (status !== "authenticated") return;
    void Promise.resolve(fetchUser()).finally(() => setLectureFaite(true));
    fetch("/api/user/progress")
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { parcours?: ParcoursProgress[] } | null) => {
        if (data?.parcours) setParcours(data.parcours);
      })
      .catch(() => {});
  }, [status, fetchUser]);

  // Même passage au paiement que `ProfilDashboard` (mesure `profil`, messages d'erreur d'avant).
  const payer = async () => {
    setPaiementEnCours(true);
    try {
      const res = await fetch("/api/stripe/checkout", { method: "POST" });
      if (res.ok) {
        const data = (await res.json()) as { url: string };
        trackCheckoutOuvert("profil");
        window.location.href = data.url;
      } else {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        trackCheckoutEchec("profil", res.status === 409 ? "conflit" : "erreur");
        toast(data.error ?? "Le paiement n’a pas pu démarrer. Réessaie dans un instant.", "error");
      }
    } catch {
      trackCheckoutEchec("profil", "reseau");
      toast("Connexion perdue, réessaie", "error");
    } finally {
      setPaiementEnCours(false);
    }
  };

  if (status === "unauthenticated") {
    return (
      <div className={GRILLE}>
        <ConnexionProfil className="md:col-span-2 lg:col-span-8" />
      </div>
    );
  }
  if (lectureFaite && !isLoading && !user) {
    return (
      <div className="mt-8 lg:w-2/3">
        <ErreurProfil onReessayer={() => void fetchUser()} />
      </div>
    );
  }
  if (isLoading || !user) return <SqueletteProfil />;

  const premium = user.plan === "PREMIUM";
  const enCours = premium && parcours.some((p) => !p.completedAt && p.completedSteps < p.totalSteps);
  const reglages = (
    <>
      {premium && <RappelParcoursToggle className="md:col-span-2" />}
      <LettreHebdoReglage className="md:col-span-2" />
      <PrenomCard key={user.id} prenom={user.name} />
      {premium && (
        <div className={cn(CADRE_CARTE_NEUTRE, "min-w-0")} data-profil-questions-cadre="">
          <LigneMesQuestions className="rounded-xl" />
        </div>
      )}
    </>
  );

  return (
    // Dès 1024 : la colonne de droite (abonnement puis réglages) est UN bloc sur deux rangées, la progression monte
    // juste sous la prochaine action (pas de rangée commune qui creuserait un vide sous la plus courte). Sous 1024, ce
    // bloc s'efface (`contents`) et `order` rend l'ordre de la spec : action, abonnement, progression, réglages.
    // Rangées `auto 1fr` : la hauteur de la colonne de droite va à la 2e rangée, jamais sous la prochaine action.
    <div className={GRILLE} data-profil-ouvert>
      <div className={cn(COLONNE, "order-1 md:col-span-2 lg:col-span-8 lg:row-start-1")} data-profil-zone="action">
        {premium && <ReprendreParcours src="profil" />}
        {!enCours && <ProchaineEtape tips={user.stats.tipsCompleted} jokes={user.stats.jokesRead} aDesParcours={parcours.length > 0} />}
      </div>
      <div className="contents lg:col-span-4 lg:col-start-9 lg:row-span-2 lg:row-start-1 lg:flex lg:min-w-0 lg:flex-col lg:gap-6" data-profil-colonne>
        <div className={cn(COLONNE, "order-2 md:col-span-2")} data-profil-zone="abonnement">
          <AbonnementCard plan={user.plan} onCheckout={payer} isCheckoutLoading={paiementEnCours} abonnement={abonnement} />
        </div>
        <div
          // `md:col-span-2` des cartes partagées neutralisé dès 1024 (une colonne : sinon une piste implicite s'ajoute).
          className="order-4 grid min-w-0 grid-cols-1 gap-6 md:col-span-2 md:grid-cols-2 lg:grid-cols-1 lg:[&>*:nth-child(n)]:col-span-1"
          data-profil-zone="reglages"
        >
          {reglages}
        </div>
      </div>
      {premium && (
        <div className={cn(COLONNE, "order-3 md:col-span-2 lg:col-span-8 lg:row-start-2")} data-profil-zone="progression">
          <CapProfil xp={user.xp} serie={user.streak} />
          <Statistiques stats={user.stats} />
          <MesParcours parcours={parcours} />
        </div>
      )}
      <div className="order-5 mt-6 border-t border-border pt-6 md:col-span-2 lg:col-span-12" data-profil-zone="suppression">
        <SupprimerCompteCard abonne={premium} finPeriode={abonnement.summary?.currentPeriodEnd ?? null} resilie={abonnement.summary?.cancelAtPeriodEnd ?? false} />
      </div>
    </div>
  );
}
