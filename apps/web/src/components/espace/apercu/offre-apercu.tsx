import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Reassurance } from "@/components/ui/reassurance";
import { BOUTON_PRIX_UNE_LIGNE, CORPS_APPEL_MOBILE } from "@/components/layout/gabarit";
import { LIEN } from "@/components/espace/carte/styles";
import { TEXTES_APERCU } from "@/config/textes/espace-apercu";
import { ABONNEMENT_HAUT, PHRASE_OBJET_CONNECTE } from "@/config/textes/abonnement-vente";
import { buildLoginUrl } from "@/lib/auth-links";
import { frTypo } from "@/lib/fr-typo";
import { cn } from "@/lib/utils";
import { META, TITRE_CARTE } from "@/components/espace/typo";

/**
 * Bouton d'offre de l'aperçu (hero et fin d'extrait) : celui de l'en-tête, prix lu en config, même lien partout.
 * Échelle s25 : `BOUTON_PRIX_UNE_LIGNE` sans son corps mobile (`CORPS_APPEL_MOBILE`, 15 px resserré sous 400 px, une
 * 5e taille) : 16 px à toutes les largeurs, le libellé tient sur une ligne dans la carte d'offre à 375 px.
 */
export const BOUTON_OFFRE = cn(
  buttonVariants({ variant: "primary", size: "lg" }),
  "whitespace-normal text-center",
  BOUTON_PRIX_UNE_LIGNE.replace(CORPS_APPEL_MOBILE, "").trim(),
);

/** Preuve coupée sur son nombre (spec design §7 point 3) : « 1 500+ » en `TITRE_CARTE` dans une phrase `META`. */
function Preuve() {
  const texte = frTypo(ABONNEMENT_HAUT.preuve);
  const m = /^(\d[\d\s]*\+?)\s(.*)$/u.exec(texte);
  return (
    <p className={cn("mt-6 border-t border-border pt-6 text-center", META)} data-preuve>
      {m ? (
        <>
          <span className={TITRE_CARTE}>{m[1]}</span> {m[2]}
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
 * Échelle s25 (§2.3) : bord simple de 1 px, sans ombre ni violet ; son poids vient du bouton plein, de sa place en
 * haut à droite et de l'air autour. Phrase d'objet et réassurance en `META`, « Connexion » en gris secondaire.
 */
export function OffreApercu({ href, adresse, visiteur }: { href: string; adresse: string; visiteur: boolean }) {
  return (
    <div className="relative rounded-xl border border-border-hover bg-background-card p-6" data-apercu-offre>
      <Link href={href} aria-label={TEXTES_APERCU.offre.nomAccessible} className={cn(BOUTON_OFFRE, "w-full")} data-position="haut">
        {TEXTES_APERCU.offre.bouton}
      </Link>
      {!visiteur && <p className={cn("mt-4 text-center", META)}>{frTypo(PHRASE_OBJET_CONNECTE)}</p>}
      {/* Échelle s25 : réassurance en `META` (14 px, gris secondaire, 7:1 sur la carte), plus de 12 px ni de 3e gris. */}
      <Reassurance className={cn("mt-4", META)} />
      <Preuve />
      {visiteur && (
        <p className="mt-2 flex justify-center">
          {/* v7 tour 2 (piste) : cible de 44 px en hauteur ET en largeur, posée ici (ne dépend pas seulement de `LIEN`). */}
          <Link href={buildLoginUrl({ callbackUrl: adresse })} className={cn(LIEN, "inline-flex min-h-11 min-w-11 items-center justify-center text-text-secondary")}>
            {TEXTES_APERCU.connexion}
          </Link>
        </p>
      )}
    </div>
  );
}
