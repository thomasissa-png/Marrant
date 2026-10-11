import type { Metadata } from "next";
import { ProfilDashboard } from "@/components/profil/profil-dashboard";
import { UpgradeToast } from "@/components/profil/upgrade-toast";
import { ReprendreParcours } from "@/components/home/reprendre-parcours";

export const metadata: Metadata = {
  title: "Mon profil | Progression & Statistiques",
  description: "Suis ta progression en humour, tes statistiques et gère ton abonnement.",
  robots: { index: false, follow: true },
};

export default function ProfilPage({
  searchParams,
}: {
  searchParams: { upgrade?: string };
}) {
  return (
    <>
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
    </>
  );
}
