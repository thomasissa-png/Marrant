import type { Metadata } from "next";
import { AdminBar } from "@/components/admin/admin-bar";

/**
 * Coquille du backoffice (s21, 18/10) : sans l'en-tête ni le pied de page du site
 * public (navigation, recherche, bouton d'achat). Barre dédiée, lien « Voir le site ».
 * S'applique à /admin et /admin/ceo ; /admin/social garde le layout (dashboard).
 */
export const metadata: Metadata = {
  title: "Administration",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <AdminBar />
      <main className="mx-auto max-w-7xl px-4 py-6 md:py-8">{children}</main>
    </div>
  );
}
