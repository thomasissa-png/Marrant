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

/**
 * Preuve coupée sur son nombre (spec design §7 point 3) : « 1 500+ » en `TITRE_CARTE` dans une phrase `META`.
 * v7 tour 9 (faute dure UX du tour 8, vide sous les pastilles dès 1024) : deux places, une seule affichée à chaque
 * largeur (`display: none` sur l'autre, donc jamais lue deux fois). `carte` : sous la réassurance, sous un filet, dans
 * la carte d'offre (de 768 à 1023 px seulement si `preuveHors`). `hero` : dès 1024 px, sous les pastilles du hero, à
 * 24 px ; v7 tour 11 : aussi sous 768 px, sous la promesse à 16 px (les pastilles n'y sont plus que lues).
 */
export function Preuve({ place = "carte", masqueeLg = false }: { place?: "carte" | "hero"; masqueeLg?: boolean }) {
  const texte = frTypo(ABONNEMENT_HAUT.preuve);
  const m = /^(\d[\d\s]*\+?)\s(.*)$/u.exec(texte);
  // v7 tour 11 : la preuve du hero se lit aussi sous 768 px (16 px sous la promesse) ; celle de la carte, alors, seulement
  // de 768 à 1023 px (`masqueeLg` : la preuve est hors de la carte sous 768 et dès 1024).
  const classes =
    place === "hero"
      ? "mt-4 md:hidden lg:mt-6 lg:block"
      : cn("mt-4 border-t border-border pt-4 text-center md:mt-6 md:pt-6", masqueeLg && "max-md:hidden lg:hidden");
  return (
    <p className={cn(classes, META)} data-preuve={place}>
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
 * v7 tour 8 : sous 768 px, carte resserrée (`p-4`, preuve à 16 px au lieu de 24) pour que la première tuile de
 * l'extrait tienne au premier écran à 375 ; le bouton reste visible sans défiler ; le premier paragraphe à 8 px du
 * bouton (comme `Reassurance` sous tout plein à prix), 16 dès 768. Inscrit gratuit : la phrase d'objet
 * et la réassurance, qui commencent toutes deux par « Premium », sont séparées de 24 px (16 avant : un mur de quatre
 * lignes), la phrase d'objet restant collée au bouton qu'elle explique.
 * v7 tour 9 : `preuveHors` (le hero) masque la preuve de la carte dès 1024 px, le hero la rend sous ses pastilles.
 * v7 tour 11 : et sous 768 px (le hero la rend sous sa promesse).
 * « Connexion » reste dans la carte à toutes les largeurs.
 */
export function OffreApercu({
  href,
  adresse,
  visiteur,
  preuveHors = false,
}: {
  href: string;
  adresse: string;
  visiteur: boolean;
  preuveHors?: boolean;
}) {
  return (
    <div className="relative rounded-xl border border-border-hover bg-background-card p-4 md:p-6" data-apercu-offre>
      <Link href={href} aria-label={TEXTES_APERCU.offre.nomAccessible} className={cn(BOUTON_OFFRE, "w-full")} data-position="haut">
        {TEXTES_APERCU.offre.bouton}
      </Link>
      {!visiteur && <p className={cn("mt-2 text-center md:mt-4", META)}>{frTypo(PHRASE_OBJET_CONNECTE)}</p>}
      {/* Échelle s25 : réassurance en `META` (14 px, gris secondaire, 7:1 sur la carte), plus de 12 px ni de 3e gris. */}
      <Reassurance className={cn(visiteur ? "mt-2 md:mt-4" : "mt-6", META)} />
      <Preuve masqueeLg={preuveHors} />
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
