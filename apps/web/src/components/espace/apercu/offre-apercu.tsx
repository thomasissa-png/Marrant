import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Reassurance } from "@/components/ui/reassurance";
import { BOUTON_PRIX_UNE_LIGNE } from "@/components/layout/gabarit";
import { LIEN } from "@/components/espace/carte/styles";
import { TEXTES_APERCU } from "@/config/textes/espace-apercu";
import { ABONNEMENT_HAUT, PHRASE_OBJET_CONNECTE } from "@/config/textes/abonnement-vente";
import { buildLoginUrl } from "@/lib/auth-links";
import { frTypo } from "@/lib/fr-typo";
import { cn } from "@/lib/utils";

/** Bouton d'offre de l'aperçu (hero et fin d'extrait) : celui de l'en-tête, prix lu en config, même lien partout. */
export const BOUTON_OFFRE = cn(buttonVariants({ variant: "primary", size: "lg" }), "whitespace-normal text-center", BOUTON_PRIX_UNE_LIGNE);

/** Preuve coupée sur son nombre (spec design §7 point 3) : « 1 500+ » en grand, le reste en corps ; texte identique. */
function Preuve() {
  const texte = frTypo(ABONNEMENT_HAUT.preuve);
  const m = /^(\d[\d\s]*\+?)\s(.*)$/u.exec(texte);
  return (
    <p className="mt-5 border-t border-border pt-4 text-center text-sm text-text-secondary" data-preuve>
      {m ? (
        <>
          <span className="font-display text-xl font-bold tabular-nums text-text-primary">{m[1]}</span> {m[2]}
        </>
      ) : (
        texte
      )}
    </p>
  );
}

/**
 * Bloc d'offre de l'aperçu verrouillé, zone B (refonte s25, spec UX §2.1 et §2.3, design §3.2) : la carte Premium de
 * l'accueil sans son halo. Le bouton (seul plein de la page avec celui de la fin d'extrait, même action), la phrase
 * d'objet pour l'inscrit gratuit, la réassurance unique, la preuve, « Connexion » pour le visiteur seulement.
 */
export function OffreApercu({ href, adresse, visiteur }: { href: string; adresse: string; visiteur: boolean }) {
  return (
    <div className="relative rounded-2xl border-2 border-accent-primary bg-background-card p-5 shadow-lg shadow-accent-primary/10 md:p-6" data-apercu-offre>
      <Link href={href} aria-label={TEXTES_APERCU.offre.nomAccessible} className={cn(BOUTON_OFFRE, "w-full")} data-position="haut">
        {TEXTES_APERCU.offre.bouton}
      </Link>
      {!visiteur && <p className="mt-3 text-center text-sm text-text-secondary">{frTypo(PHRASE_OBJET_CONNECTE)}</p>}
      <Reassurance className="mt-3" />
      <Preuve />
      {visiteur && (
        <p className="mt-1 flex justify-center">
          <Link href={buildLoginUrl({ callbackUrl: adresse })} className={`${LIEN} min-w-11 justify-center`}>
            {TEXTES_APERCU.connexion}
          </Link>
        </p>
      )}
    </div>
  );
}
