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
import { CADRE_CARTE_NEUTRE, NEUTRE_CAP } from "@/components/espace/carte/styles";
import { ECHELLE_CARTES_PARTAGEES } from "@/components/espace/typo";
import { cn } from "@/lib/utils";

/** Grille 12 colonnes ; les cartes partagées (`Card filet`) perdent leur filet violet ici seulement (un seul aplat). */
// « Ton cap » (`TonCap`, partagé) : `NEUTRE_CAP` (`carte/styles.ts`), aussi posé sur le rail de « Parcours » (s26 tour 3).
// s26 tour 2 (Pr3) : un seul aplat violet par écran. Interrupteurs cochés (« La lettre de la semaine », rappel, cartes
// partagées) en NEUTRE : piste blanche (`bg-text-primary`), pastille sombre (`bg-background`) ; l'état se lit à la
// position et au contraste de la pastille (blanc sur fond de carte, sombre sur piste blanche : bien au-delà de 3:1).
// Pastille « Premium » de la carte Abonnement (Badge `primary`) sur fond neutre, comme « Aucun abonnement ».
const NEUTRE_INTERRUPTEURS =
  "[&_[role=switch]:checked]:border-text-primary [&_[role=switch]:checked]:bg-text-primary [&_[role=switch]:checked:hover]:border-text-primary [&_[role=switch]:checked:hover]:bg-text-primary [&_[role=switch]:checked~.inset-0]:border-text-primary [&_[role=switch]:checked~.inset-0]:bg-text-primary [&_[role=switch]:checked:hover~.inset-0]:bg-text-primary [&_[role=switch]:checked~.h-5]:bg-background [&_.rounded-full.text-accent-link]:bg-background-elevated";
// s26 tour 3 (point 10) : les cartes PARTAGÉES (`Card`, `p-4` : Abonnement, Rappel, La lettre de la semaine, Prénom,
// Supprimer mon compte) passent à 24 px de marge intérieure ici seulement, comme « Statistiques » ; code des cartes inchangé.
const MARGE_CARTES_PARTAGEES = "[&_.bg-background-card.p-4]:p-6";
const GRILLE = `mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-12 lg:items-start [&_[data-filet]]:hidden ${NEUTRE_CAP} ${NEUTRE_INTERRUPTEURS} ${ECHELLE_CARTES_PARTAGEES} ${MARGE_CARTES_PARTAGEES}`;
// s26 tour 2 (Pr1) : `[&>*]:shrink-0`, les cartes d'une colonne gardent leur hauteur propre (sous 1024, « Statistiques »
// et « Mes parcours » rétrécissaient et leur cadre rognait le contenu).
const COLONNE = "flex min-w-0 flex-col gap-6 [&>*]:shrink-0";
/**
 * s26 tour 2 (Pr2, WCAG 2.4.3) : deux enveloppes, effacées sous 1024 (`contents`) : ordre du DOM = ordre affiché (action,
 * progression, abonnement, réglages, suppression). Dès 1024, deux colonnes 8/4 comme avant.
 */
const ENVELOPPE_GAUCHE = "contents lg:col-span-8 lg:flex lg:min-w-0 lg:flex-col lg:gap-6";
const ENVELOPPE_DROITE = "contents lg:col-span-4 lg:col-start-9 lg:flex lg:min-w-0 lg:flex-col lg:gap-6";

/**
 * « Mon profil », interrupteur OUVERT (s26, `docs/ux/questions-repliques-lettre-profil-s26.md` §4, design §7). Mêmes
 * lectures que `ProfilDashboard` (compte, parcours, résumé d'abonnement), mêmes cartes et mêmes textes ; la page fermée
 * garde `ProfilDashboard`, au caractère près. Ordre du DOM (s26 tour 2) : prochaine action, progression, abonnement,
 * réglages, suppression, le même que l'ordre affiché à toutes les largeurs. Dès 1024 : 8 colonnes à gauche (prochaine action, puis cap, statistiques et parcours), 4 à droite
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
        // s26 tour 2 (Pr4) : cadre `p-6`, ligne sans carte interne (texte en haut), pleine largeur à 768.
        <div className={cn(CADRE_CARTE_NEUTRE, "min-w-0 p-6 md:col-span-2")} data-profil-questions-cadre="">
          <LigneMesQuestions nue />
        </div>
      )}
    </>
  );

  return (
    <div className={GRILLE} data-profil-ouvert>
      <div className={ENVELOPPE_GAUCHE} data-profil-colonne-principale>
        <div className={cn(COLONNE, "md:col-span-2")} data-profil-zone="action">
          {premium && <ReprendreParcours src="profil" />}
          {!enCours && <ProchaineEtape tips={user.stats.tipsCompleted} jokes={user.stats.jokesRead} aDesParcours={parcours.length > 0} />}
        </div>
        {premium && (
          <div className={cn(COLONNE, "md:col-span-2")} data-profil-zone="progression">
            {/* s26 tour 3 (point 10) : 24 px de marge intérieure, comme les autres cartes de la page. */}
            <CapProfil xp={user.xp} serie={user.streak} className="p-6" />
            <Statistiques stats={user.stats} />
            <MesParcours parcours={parcours} />
          </div>
        )}
      </div>
      <div className={ENVELOPPE_DROITE} data-profil-colonne>
        <div className={cn(COLONNE, "md:col-span-2")} data-profil-zone="abonnement">
          <AbonnementCard plan={user.plan} onCheckout={payer} isCheckoutLoading={paiementEnCours} abonnement={abonnement} />
        </div>
        <div
          // `md:col-span-2` des cartes partagées neutralisé dès 1024 (une colonne : sinon une piste implicite s'ajoute).
          className="grid min-w-0 grid-cols-1 gap-6 md:col-span-2 md:grid-cols-2 lg:grid-cols-1 lg:[&>*:nth-child(n)]:col-span-1"
          data-profil-zone="reglages"
        >
          {reglages}
        </div>
      </div>
      <div className="mt-6 border-t border-border pt-6 md:col-span-2 lg:col-span-12" data-profil-zone="suppression">
        <SupprimerCompteCard abonne={premium} finPeriode={abonnement.summary?.currentPeriodEnd ?? null} resilie={abonnement.summary?.cancelAtPeriodEnd ?? false} />
      </div>
    </div>
  );
}
