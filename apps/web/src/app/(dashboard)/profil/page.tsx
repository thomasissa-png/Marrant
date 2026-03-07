import type { Metadata } from "next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ProfilDashboard } from "@/components/profil/profil-dashboard";

export const metadata: Metadata = {
  title: "Mon profil — Progression & Statistiques",
  description: "Suis ta progression en humour, tes statistiques et gère ton abonnement.",
};

export default function ProfilPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold md:text-4xl">
            Mon profil
          </h1>
        </div>

        <ProfilDashboard />
      </main>
      <Footer />
    </>
  );
}
