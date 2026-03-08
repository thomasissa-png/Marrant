import type { Metadata } from "next";
import { ProfilDashboard } from "@/components/profil/profil-dashboard";

export const metadata: Metadata = {
  title: "Mon profil — Progression & Statistiques",
  description: "Suis ta progression en humour, tes statistiques et gère ton abonnement.",
};

export default function ProfilPage() {
  return (
    <>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold md:text-4xl">
          Mon profil
        </h1>
      </div>

      <ProfilDashboard />
    </>
  );
}
