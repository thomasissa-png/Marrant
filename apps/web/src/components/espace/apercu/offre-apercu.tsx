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
 * Bouton de la CARTE DE FIN (fin d'extrait des aperçus, fin du Carnet non-abonné). s26, Thomas 19/11 : sur une fenêtre
 * d'au moins 960 px de haut, la carte de fin entre dans le premier écran avec la carte d'offre ; son bouton passe en
 * CONTOUR (bord violet 1 px, fond transparent, texte blanc, survol discret), même gabarit (`min-h-12`, `rounded-lg`),
 * même libellé, même lien : jamais deux aplats violets dans le même écran. La carte garde son bord et son halo. Sous
 * 960 px de haut, bouton plein. Variante CSS par media query de hauteur (`fenetre-haute:`, `@media (min-height:
 * 960px)`, nommée dans `tailwind.config.ts` : pas de valeur en px dans les composants de l'espace), aucun JavaScript.
 */
export const BOUTON_OFFRE_FIN = cn(
  BOUTON_OFFRE,
  "fenetre-haute:border fenetre-haute:border-accent-primary fenetre-haute:bg-transparent fenetre-haute:text-text-primary fenetre-haute:hover:bg-background-elevated",
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
  // s26 tour 2 des encarts (E2) : de 768 à 1023, la carte d'offre passe SOUS le texte du hero, en ligne ; la preuve reste
  // alors dans la colonne de texte (sous les pastilles, 24 px) à toutes les largeurs, la carte ne la rend plus (`hidden`).
  const classes =
    place === "hero"
      ? "mt-4 md:mt-6"
      : cn("mt-4 border-t border-border pt-4 text-center md:mt-6 md:pt-6", masqueeLg && "hidden");
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
 * « L'objet Premium » (s26, encarts Premium, Thomas 18/11, `docs/design/encarts-premium-s26.md`) : la matière de la
 * carte Premium de l'accueil (`home/premium-cta.tsx`), commune à la carte d'offre (a) et à la fin d'extrait (b). Bord
 * violet de 2 px (un trait, pas un aplat : 3,9:1 sur la carte), ombre violette à 10 %, halo décoratif à 5 % flouté en
 * coin (`HaloPremium`, `aria-hidden`, sans bord) ; le bouton plein reste la seule surface violette opaque.
 */
export const CARTE_PREMIUM =
  "relative overflow-hidden rounded-2xl border-2 border-accent-primary bg-background-card shadow-lg shadow-accent-primary/10";

/**
 * Halo de l'objet Premium, premier enfant de la carte ; le contenu qui suit porte `relative` pour passer devant.
 * s26 tour 2 des encarts (E3, relecture design du tour 1 : halo « invisible en pratique », 38 % de sa surface dans la
 * carte) : `-right-8 -top-8` au lieu de `-right-16 -top-16`, sur les deux cartes.
 */
export function HaloPremium() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-accent-primary/5 blur-3xl"
      data-halo-premium
    />
  );
}

/**
 * Bloc d'offre de l'aperçu verrouillé, zone B (refonte s25, spec UX §2.1 et §2.3, design §3.2). Le bouton (seul plein
 * de la page avec celui de la fin d'extrait, même action), la phrase d'objet pour l'inscrit gratuit, la réassurance
 * unique, la preuve, « Connexion » pour le visiteur seulement.
 * s26 (encarts Premium, Thomas 18/11 : « pas au niveau ») : l'objet Premium (`CARTE_PREMIUM`, `HaloPremium`) remplace
 * le bord simple sans violet de s25 §2.3. Padding égal des quatre côtés (16 sous 768, 24 dès 768). « Connexion » est
 * calée en bas (`mt-auto`) sous un filet : la carte étirée (`etiree`) n'a plus de vide subi sous son dernier élément,
 * l'air se place entre la réassurance et le filet. Le filet tombe quand la preuve (qui a le sien) est dans la carte.
 * v7 tour 8 : sous 768 px, carte resserrée (`p-4`, preuve à 16 px au lieu de 24) pour que la première tuile de
 * l'extrait tienne au premier écran à 375 ; le premier paragraphe à 8 px du bouton (comme `Reassurance` sous tout
 * plein à prix), 16 dès 768. Inscrit gratuit : la phrase d'objet et la réassurance, qui commencent toutes deux par
 * « Premium », sont séparées de 24 px (16 à toutes les largeurs depuis s26 liste et détail, tour 5), la phrase d'objet
 * restant collée au bouton qu'elle explique.
 * v7 tour 9 et 11 : `preuveHors` (le hero) masque la preuve de la carte sous 768 et dès 1024 px (le hero la rend).
 * s26 tour 2 des encarts (E2, relecture design du tour 1 : à 768, carte de 268 px, réassurance sur 3 lignes, 122 px vides
 * à gauche) : de 768 à 1023, la carte est en pleine largeur SOUS le texte du hero, contenu en ligne ; `preuveHors` la
 * masque alors à toutes les largeurs (la colonne de texte la rend). Dès 1024, rien ne change (8/4, colonne, filet de
 * « Connexion » en pied) ; sous 768 non plus.
 */
export function OffreApercu({ href, adresse, visiteur }: { href: string; adresse: string; visiteur: boolean }) {
  return (
    // s26 liste et détail, tour 1 (spec UX §1) : `data-signal` (posé par `SignalOffre`, 1,5 s depuis le tour 4) = contour
    // violet de 2 px, hors de la bordure, sans mouvement ni aplat.
    <div className={cn(CARTE_PREMIUM, "p-4 md:p-6 data-[signal]:outline data-[signal]:outline-2 data-[signal]:outline-offset-4 data-[signal]:outline-accent-primary")} data-apercu-offre>
      <HaloPremium />
      {/* s26 tour 2 des encarts (E2) : de 768 à 1023, contenu en ligne (bouton et phrase d'objet à gauche, réassurance et
          « Connexion » à droite) ; ailleurs, les deux groupes sont `display: contents` et la carte reste une colonne. */}
      {/* s26 tour 3 (point 6) : de 768 à 1023, les deux groupes alignés en haut (plus de centrage vertical) et le texte à
          gauche (phrase d'objet comprise). */}
      <div className="relative flex h-full flex-col md:max-lg:flex-row md:max-lg:items-start md:max-lg:gap-6 md:max-lg:text-left">
        <div className="contents md:max-lg:block md:max-lg:flex-1" data-offre-gauche>
          {/* s26 liste et détail, tour 4 : focus posé par `SignalOffre` après un clic sur une partie fermée ; son anneau
              (`data-focus-signal`, jusqu'à la perte du focus) est celui de `:focus-visible`. */}
          <Link
            href={href}
            aria-label={TEXTES_APERCU.offre.nomAccessible}
            className={cn(BOUTON_OFFRE, "w-full data-[focus-signal]:ring-2 data-[focus-signal]:ring-accent-link data-[focus-signal]:ring-offset-2 data-[focus-signal]:ring-offset-background")}
            data-position="haut"
          >
            {TEXTES_APERCU.offre.bouton}
          </Link>
          {/* s26 liste et détail, tour 2 (mesures A1 #11 : gratuit à 1024, 34 px entre le bas du texte du hero et celui de
              la carte, la plus étroite) : de 1024 à 1279, la phrase d'objet à 8 px du bouton (comme sous 768 et comme la
              réassurance du visiteur) au lieu de 16 (-8 px). 1280 et 1920 inchangés. */}
          {/* s26 liste et détail, tour 5 (relecture design v2 D3 : carte de 202 px chez le visiteur, 211 chez le gratuit à
              1280, tout l'extrait descendait de 9 px ; 9 à 375, 20 de 768 à 1023) : même hauteur, sans texte nouveau. Le
              pied du visiteur (« Connexion » sous son filet) fait 64 px avec la marge de sa réassurance ; le gratuit, phrase
              d'objet sur deux lignes à 8 px du bouton (partout, plus de `md:mt-4`) et réassurance à 16 px dessous (partout,
              comme dès 1024 : plus de 24 sous 1024), aussi : 8 + 40 + 16. Phrase d'objet sur trois lignes (de 1024 à
              environ 1130 px et sous environ 340) : 20 px de plus chez le gratuit, écart restant. */}
          {!visiteur && <p className={cn("mt-2 text-center md:max-lg:text-left", META)}>{frTypo(PHRASE_OBJET_CONNECTE)}</p>}
        </div>
        <div className="contents md:max-lg:block md:max-lg:flex-1" data-offre-droite>
          {/* Échelle s25 : réassurance en `META` (14 px, gris secondaire, 7:1 sur la carte), plus de 12 px ni de 3e gris. */}
          {/* s26 liste et détail (spec design §5.2) : réassurance du visiteur `md:mt-4` -> `mt-2` et « Connexion » `pt-6` -> `pt-4`
              (-16 px), plus de preuve « 1 500+ » dans la carte (retirée des aperçus de l'espace) : le filet de « Connexion »
              est toujours là. */}
          {/* Tour 1 (mesures §5 : gratuit, 38 px entre le bas du texte du hero et celui de la carte) : dès 1024, 16 px sous la
              phrase d'objet au lieu de 24 (-8 px). */}
          <Reassurance className={cn(visiteur ? "mt-2" : "mt-4", "md:max-lg:mt-0 md:max-lg:text-left", META)} />
          {visiteur && (
            // s26 tour 3 (piste 1 de la relecture design du tour 2) : le lien de 44 px centre son texte, d'où 38 px d'air
            // sous le texte contre 24 au-dessus du bouton (1280 ; 30 contre 16 à 375). `-mb-3.5` : la cible garde ses
            // 44 px et descend de 14 px dans la marge de la carte, l'air sous le texte égale celui du haut. De 768 à 1023
            // (contenu en ligne, centré), rien ne change.
            // s26 liste et détail, tour 5 (même hauteur que le gratuit, voir la phrase d'objet) : `pb-px`, le filet de 1 px
            // rendait le pied impair (8 + 16 + 1 + 8 + 44 + 1 - 14 = 64, comme 8 + 40 + 16 chez le gratuit) ; de 768 à
            // 1023, « Connexion » à 12 px sous la réassurance (84 + 12 = 96, la colonne gauche du gratuit : 48 + 8 + 40).
            <div className="-mb-3.5 mt-auto pb-px pt-4 md:max-lg:mb-0 md:max-lg:pb-0 md:max-lg:pt-3">
              <p className="flex justify-center border-t border-border pt-2 md:max-lg:justify-start md:max-lg:border-t-0 md:max-lg:pt-0">
                {/* v7 tour 2 (piste) : cible de 44 px en hauteur ET en largeur, posée ici (ne dépend pas seulement de `LIEN`). */}
                <Link href={buildLoginUrl({ callbackUrl: adresse })} className={cn(LIEN, "inline-flex min-h-11 min-w-11 items-center justify-center text-text-secondary")}>
                  {TEXTES_APERCU.connexion}
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
