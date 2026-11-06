import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { lireResiliation, type DonneesResiliation } from "@/lib/resiliation";
import { RecapContrat } from "@/components/resiliation/recap-contrat";
import { propsRecap, dateFinLisible } from "@/components/resiliation/recap-props";
import { ResiliationFormulaire } from "@/components/resiliation/resiliation-formulaire";
import { LienReactivation } from "@/components/resiliation/lien-reactivation";
import { CLASSE_BOUTON_SECONDAIRE, HAUTEUR_MIN_PAGE } from "@/components/resiliation/carte-app-store";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { RESILIATION_HREF, RESILIATION_PAGE_OUVERTE } from "@/config/resiliation";
import { TEXTES_RESILIATION as T } from "@/config/textes/resiliation";

export const metadata: Metadata = {
  title: T.metaTitre,
  robots: { index: false, follow: false },
};

// Rendu : SSR dynamique, sans cache (spec §4 : état relu à chaque ouverture, jamais de valeur en
// cache). Session exigée : sans session, connexion puis retour ici (`callbackUrl`).
export const dynamic = "force-dynamic";

/** s23 : écran de résiliation maison (spec `docs/ux/page-resiliation-s23-spec.md` v3). */
export default async function ResiliationPage() {
  if (!RESILIATION_PAGE_OUVERTE) notFound();
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) redirect(`/login?callbackUrl=${encodeURIComponent(RESILIATION_HREF)}`);

  let d: DonneesResiliation | null = null;
  try {
    d = await lireResiliation(userId);
  } catch (err) {
    console.warn("[resiliation] Lecture du compte impossible :", err instanceof Error ? err.message : err);
  }
  // Lecture en échec : le bouton reste actif, sans date (« à la fin de la période déjà payée »).
  const donnees: DonneesResiliation = d ?? {
    etat: "a_resilier",
    email: session?.user?.email ?? "",
    prenom: null,
    formule: null,
    priceCents: null,
    dateFin: null,
  };

  return (
    // Design O5 : hauteur minimale locale (pied de page en bas du viewport sur les états courts),
    // sans toucher le layout partagé `(dashboard)/layout.tsx` (règle de Thomas : retouche minimale).
    <div className={cn("mx-auto max-w-xl", HAUTEUR_MIN_PAGE)}>
      <h1 className="font-display text-3xl font-bold md:text-4xl">{T.titre}</h1>
      <div className="mt-6">
        {donnees.etat === "a_resilier" && (
          <ResiliationFormulaire
            recap={<RecapContrat {...propsRecap(donnees, "formule")} />}
            appStorePossible={donnees.sansClientStripe ?? false}
            offert={donnees.sansAbonnementStripe ?? false}
          />
        )}
        {donnees.etat === "deja_resilie" && <DejaResilie donnees={donnees} />}
        {donnees.etat === "aucun" && <RienAResilier />}
      </div>
    </div>
  );
}

function DejaResilie({ donnees }: { donnees: DonneesResiliation }) {
  return (
    <>
      {/* @legal O7 : en impayé, les deux lignes d'effet prudentes remplacent « Tu gardes Premium jusqu'au… ». */}
      <RecapContrat {...propsRecap(donnees, "enregistree")} effets={donnees.impaye ?? false} />
      <p className="mt-6 text-text-primary">{donnees.impaye ? T.dejaResilieImpaye : T.dejaResilie(dateFinLisible(donnees.dateFin))}</p>
      <LienReactivation className={cn(CLASSE_BOUTON_SECONDAIRE, "mt-6")}>
        {T.reactiver}
      </LienReactivation>
    </>
  );
}

function RienAResilier() {
  return (
    <Card className="p-5 hover:border-border md:p-6">
      <p className="text-text-primary">{T.rienAResilier}</p>
      <Link href="/" className={cn(CLASSE_BOUTON_SECONDAIRE, "mt-4")}>
        {T.retourAccueil}
      </Link>
    </Card>
  );
}
