import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { lireResiliation } from "@/lib/resiliation";
import { RecapContrat } from "@/components/resiliation/recap-contrat";
import { propsRecap, dateFinLisible } from "@/components/resiliation/recap-props";
import { LienReactivation } from "@/components/resiliation/lien-reactivation";
import { AideApresResiliation } from "@/components/resiliation/aide-apres-resiliation";
import { TitreAnnonce } from "@/components/resiliation/titre-annonce";
import { buttonVariants } from "@/components/ui/button";
import { RESILIATION_CONFIRMEE_HREF, RESILIATION_HREF, RESILIATION_PAGE_OUVERTE } from "@/config/resiliation";
import { TEXTES_RESILIATION_CONFIRMEE as T } from "@/config/textes/resiliation";

export const metadata: Metadata = {
  title: "Résiliation enregistrée",
  robots: { index: false, follow: false },
};

// Rendu : SSR dynamique, sans cache. Ouverte sans résiliation en cours : retour à /resiliation.
export const dynamic = "force-dynamic";

/** s23 : page finale de la résiliation (spec §2, textes §2). Aucune question, aucune offre. */
export default async function ResiliationConfirmeePage() {
  if (!RESILIATION_PAGE_OUVERTE) notFound();
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) redirect(`/login?callbackUrl=${encodeURIComponent(RESILIATION_CONFIRMEE_HREF)}`);

  const d = await lireResiliation(userId).catch(() => null);
  if (!d || d.etat !== "deja_resilie") redirect(RESILIATION_HREF);
  const dateFin = dateFinLisible(d.dateFin);

  return (
    <div className="mx-auto max-w-xl">
      <TitreAnnonce>{T.titre}</TitreAnnonce>
      <p className="mt-4 text-text-primary">{T.garde(dateFin)}</p>
      <p className="mt-1 text-sm text-text-secondary">{T.effets}</p>
      <RecapContrat {...propsRecap(d, "enregistree")} effets={false} className="mt-6" />
      <p className="mt-4 text-sm text-text-secondary">{T.email(d.email)}</p>
      <AideApresResiliation dateFin={dateFin} />
      <div className="mt-8 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-6">
        <Link href="/" className={`${buttonVariants({ variant: "outline", size: "lg" })} w-full sm:w-auto`}>
          {T.retourAccueil}
        </Link>
        <LienReactivation className="inline-flex min-h-11 items-center justify-center text-sm text-text-secondary underline underline-offset-4 hover:text-text-primary focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-link focus-visible:ring-offset-2 focus-visible:ring-offset-background">
          {T.changerDAvis}
        </LienReactivation>
      </div>
    </div>
  );
}
