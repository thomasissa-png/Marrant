import { Fragment } from "react";
import type { Metadata } from "next";
import { ProfilDashboard } from "@/components/profil/profil-dashboard";
import { UpgradeToast } from "@/components/profil/upgrade-toast";
import { ReprendreParcours } from "@/components/home/reprendre-parcours";
import { ESPACE_CLIENT_PUBLIE } from "@/config/espace-client";
import { HistoriqueProfil } from "@/components/espace/profil/historique-profil";
import { AxeEspace } from "@/components/espace/axe-espace";

export const metadata: Metadata = {
  title: "Mon profil | Progression & Statistiques",
  description: "Suis ta progression en humour, tes statistiques et gère ton abonnement.",
  robots: { index: false, follow: true },
};

/**
 * « Mon profil » (rubrique des réglages ; s24, lot D10, plan §3 : adresse et ancres `#abonnement`,
 * `#rappel-parcours` conservées, aucune redirection). Rendu : SSR dynamique (layout), cartes du compte en
 * Client Components. Interrupteur de l'espace fermé : page d'aujourd'hui au caractère près (test
 * d'inertie), aucune lecture en plus. Ouvert : ancien abonné, « Mes questions » et « Mes répliques » en
 * lecture seule sous les cartes, chacune seulement si elle a des données.
 */
export default function ProfilPage({
  searchParams,
}: {
  searchParams: { upgrade?: string };
}) {
  // Lot D11c (revue d'harmonie, défaut 3) : ouvert, l'abonné lit son profil dans la colonne de l'espace.
  const Colonne = ESPACE_CLIENT_PUBLIE ? AxeEspace : Fragment;
  return (
    <Colonne>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold md:text-4xl">
          Mon profil
        </h1>
        <p className="mt-2 text-text-secondary">
          Ta progression, tes stats, ton parcours vers la l&#233;gende.
        </p>
      </div>

      {searchParams.upgrade && <UpgradeToast status={searchParams.upgrade} />}

      {/* Parcours en cours en tête (reco 5, s17) ; rien pour un compte sans Premium. */}
      <ReprendreParcours src="profil" className="mb-8" />

      {/* Rappel e-mail sur demande (D7, legal C1) : rendu dans ProfilDashboard, sous « Mes parcours » (s17 tour 1, UXV-1-02). */}
      <ProfilDashboard />

      {ESPACE_CLIENT_PUBLIE && <HistoriqueProfil />}
    </Colonne>
  );
}
