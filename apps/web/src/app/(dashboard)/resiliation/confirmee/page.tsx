import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { lireResiliation } from "@/lib/resiliation";
import { RecapContrat } from "@/components/resiliation/recap-contrat";
import { propsRecap, dateFinLisible } from "@/components/resiliation/recap-props";
import { LienReactivation } from "@/components/resiliation/lien-reactivation";
import { TitreAnnonce } from "@/components/resiliation/titre-annonce";
import { CLASSE_BOUTON_SECONDAIRE } from "@/components/resiliation/carte-app-store";
import { RESILIATION_CONFIRMEE_HREF, RESILIATION_HREF, RESILIATION_PAGE_OUVERTE } from "@/config/resiliation";
import { TEXTES_RESILIATION_CONFIRMEE as T } from "@/config/textes/resiliation";

export const metadata: Metadata = {
  title: "Résiliation enregistrée",
  robots: { index: false, follow: false },
};

// Rendu : SSR dynamique, sans cache. Ouverte sans résiliation en cours : retour à /resiliation.
export const dynamic = "force-dynamic";

/**
 * s23 : page finale de la résiliation (spec §2, textes §2). Aucune question, aucune offre, aucune
 * main tendue (UX O1 : ligne d'aide et « Merci d'avoir répondu. » retirées, `AideApresResiliation`
 * non rendu tant que Thomas ne l'a pas validé par écrit).
 */
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
      <p className="mt-2 text-sm text-text-secondary">{T.effets}</p>
      <RecapContrat {...propsRecap(d, "enregistree")} effets={false} className="mt-6" />
      <p className="mt-4 text-sm text-text-secondary">{T.email(d.email)}</p>
      <div className="mt-8 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-6">
        <Link href="/" className={CLASSE_BOUTON_SECONDAIRE}>
          {T.retourAccueil}
        </Link>
        <LienReactivation className="inline-flex min-h-11 items-center justify-center text-sm text-text-secondary underline underline-offset-4 hover:text-text-primary focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-link focus-visible:ring-offset-2 focus-visible:ring-offset-background">
          {T.changerDAvis}
        </LienReactivation>
      </div>
    </div>
  );
}
