import { TEXTES_APERCU_VERROUILLE } from "@/config/textes/espace-apercu";
import { BadgePremium } from "@/components/espace/apercu/badge-premium";
import { OffreApercu } from "@/components/espace/apercu/offre-apercu";
import { META, TEXTE, TITRE_PAGE } from "@/components/espace/typo";
import { cn } from "@/lib/utils";

/**
 * Hero de l'aperçu verrouillé, zones A et B (refonte s25, spec UX §2.1 et §3.1, design §3.5) : pas de carte autour
 * du texte (posé sur le halo), la carte d'offre est le seul objet encadré. Pastille « Premium », H1 (nom de la
 * rubrique, aligné à gauche sur la barre), phrase lue seulement (T4), promesse, pastilles « ce qu'il y a dedans »
 * (non cliquables, sans bord) ; à droite dès 1024 px, le bloc d'offre. CTA au premier écran.
 * v7 tour 2 (piste) : 8/4 au lieu de 7/5 (la carte d'offre tient dans 4 colonnes), colonne de texte sans plafond à
 * 768 et pastilles un peu moins larges : les 6 pastilles tiennent sur une ligne à 768 et dès 1280, plus de
 * « Contenu du jour » seule sur sa ligne. La promesse garde son plafond de lecture (`max-w-xl`). Texte calé en haut
 * (`items-start`) : la pastille « Premium » reste à la hauteur du H1 des autres rubriques, même quand la carte d'offre,
 * plus étroite, est plus haute que le texte.
 * v7 tour 3 (piste hero) : promesse sur toute la colonne de texte (`max-w-3xl`, une ligne dès 1280 au lieu de deux
 * courtes qui laissaient environ 480 px de vide avant l'offre) ; l'offre alignée en haut, sur la pastille « Premium ».
 * v7 tour 4 (faute 1, 140 px de vide sous les pastilles dès 1024) : colonne de texte équilibrée avec la carte d'offre
 * (H1 `lg:text-6xl`, promesse `lg:text-2xl` sur deux lignes, pastilles `lg:mt-8`) : les deux bas à moins de 24 px.
 * Piste 768 : 60/40 dès 768 (spec UX §2.3), l'offre à droite au lieu d'une barre pleine largeur ; pastilles plafonnées
 * de 768 à 1023 (`max-w-md`) pour tomber en 3 + 3, jamais une seule sur sa ligne.
 * Échelle s25 (`docs/design/typo-harmonie-espace-s25.md` §2.6, retour de Thomas du 16/11) : H1 en `TITRE_PAGE` (24
 * puis 30), promesse en `TEXTE` sur `max-w-xl`, pastilles en `META` à point neutre. L'équilibre avec l'offre vient de
 * l'air, plus de la taille du texte : dès 768, les deux colonnes ont la même hauteur ; en haut, la pastille « Premium »
 * (à la hauteur du H1 des autres rubriques), le H1 et la promesse. Pastilles sans point (spec §2.6, « ou retiré ») et
 * à 10 px de marge : 3 + 3 à 375 px, jamais une seule sur sa ligne.
 * v7 tour 7 (rythme de 8 px) : 12 px de marge (`px-3`, comme `PASTILLE` et la pastille « Premium »). En retour à la
 * ligne libre, cela laissait « Contenu du jour » seule sur sa ligne (mesuré : 3 + 2 + 1 à 375, la 2e ligne demande
 * 344 px pour 343 ; 5 + 1 à 600 et à 1024). Répartition fixe, sans orpheline : 2 colonnes sous 768 px (2 + 2 + 2),
 * 3 colonnes de 768 à 1279 (3 + 3), à la largeur de leur plus longue pastille (`max-content`, pas de grand blanc entre
 * deux colonnes), une seule ligne dès 1280. Ordre inchangé.
 * v7 tour 6 (placement) : les pastilles ne sont plus calées sur le bas de la carte d'offre (environ 130 px de vide
 * ENTRE la promesse et elles, lu comme cassé) ; elles suivent la promesse à 24 px (`mt-6`) à toutes les largeurs et
 * le surplus de hauteur de l'offre passe sous elles, en bas de colonne (respiration). Un vide ne se comble jamais en
 * grossissant le texte.
 * v7 tour 8 (décisions de l'orchestrateur) : pastilles en retour à la ligne libre (`flex flex-wrap gap-2`) à toutes
 * les largeurs : un écart constant de 8 px, plus de colonnes ni de trous irréguliers (une pastille seule en fin de
 * ligne est acceptée). Sous 768 px, tout est resserré pour que la première tuile de l'extrait (étiquette et titre)
 * tienne au premier écran (375 x 812, étiquette et titre au-dessus de y = 760) : la pastille « Premium » passe sur la
 * ligne du H1, à droite (ordre du DOM inchangé : pastille puis titre ; 44 px de gagnés), pastilles compactes (même
 * 14 px, `px-2 py-0.5` : 3 + 3 sur deux lignes au lieu de trois), 16 px entre promesse et pastilles et entre le texte
 * et la carte d'offre (resserrée elle aussi). Dès 768, rien ne change : pastille au-dessus du H1, 16 px entre eux.
 * v7 tour 9 (faute dure UX du tour 8, environ 110 px vides sous les pastilles dès 1024) : la preuve sort de la carte
 * d'offre dès 1024 px et se pose sous les pastilles, à 24 px (`mt-6`), mêmes classes de l'échelle (`META`, nombre en
 * `TITRE_CARTE`). La carte perd sa preuve, la colonne de texte la gagne : les deux bas à 24 px près à 1280 et 1920.
 * Sous 1024, la preuve reste dans la carte. Une seule est affichée à chaque largeur (l'autre en `display: none`).
 * v7 tour 11 (relecture UX du tour 10 : à 375, offre et pastilles prenaient 650 px sur 812, une seule tuile tronquée) :
 * sous 768 px, les pastilles sortent du rendu visuel (`sr-only` : toujours lues, elles redisent l'extrait qui suit),
 * et la preuve sort de la carte d'offre pour se poser en ligne simple sous la promesse, comme dès 1024. La carte ne
 * garde sa preuve que de 768 à 1023 px. Mesuré à 375 x 812 : la tuile Z1 entière (étiquette, titre, bouton éteint) au
 * premier écran pour le visiteur et le gratuit, le bouton d'offre aussi.
 * v7 tour 12 : les marges compactes des pastilles (`px-2 py-0.5`, sous 768) sont retirées : sous 768, la liste est en
 * `sr-only`, elles ne servaient plus. Une seule marge, `px-3 py-1`.
 * s26 (décision de Thomas du 18/11) : une seule grille 8/4 pour le hero et l'extrait. Dès 1024, la gouttière du hero
 * (`lg:gap-12`, 48 px) est reprise par les rangées de l'extrait des 4 aperçus (`lg:gap-x-12`, spans 8 et 4) : la colonne
 * de droite de l'extrait a les bords de la carte d'offre, la colonne de gauche ceux du texte du hero.
 * s26 tour 2 des encarts (E2, relecture design du tour 1 : à 768, carte de 268 px et 122 px vides sous les pastilles) :
 * plus de 3/2 de 768 à 1023 ; la carte d'offre passe en pleine largeur SOUS le texte (24 px), contenu en ligne, et la
 * preuve reste sous les pastilles (24 px), comme dès 1024. Sous 768 et dès 1024 (8/4), rien ne change.
 * s26 liste et détail (`docs/design/liste-detail-quoi-repondre-s26.md` §5, spec UX §1) : « 1 500+ » retiré des aperçus de
 * l'espace (hero et carte d'offre ; l'accueil et /abonnement gardent le leur). Rééquilibrage sans texte ni visuel, au pas
 * de 8 px : grille `lg:items-start` et carte d'offre à sa hauteur propre (plus d'`etiree`), promesse `lg:mt-6` (+8),
 * pastilles `lg:mt-8` (+8) ; la carte se resserre de 16 px (`OffreApercu`). Cible : bas du texte et bas de la carte à
 * 32 px près dès 768 (`[ESTIMÉ]` environ 12 px à 1280, mesure @qa).
 * s26 liste et détail, tour 1 (mesures §5 : pastilles à 32 px de la promesse, au-delà de la règle des 24 du tour 6 ;
 * gratuit à 38 px du bas de la carte) : pastilles revenues à 24 px (`md:mt-6`), les 8 px passent au-dessus de la promesse
 * (`lg:mt-8`) ; la carte du gratuit se resserre de 8 px (`OffreApercu`). Cible : 13 px (visiteur), 30 px (gratuit).
 * s26 liste et détail, tour 8 (relecture design v5, Quoi répondre points 1 et 4 : 32 px titre-promesse puis 24 px
 * promesse-pastilles à 1280, 16 à 375 ; pastille « Premium » au-dessus du titre à 1280 et à droite à 375) : avec
 * `rythmeRegulier` (Quoi répondre seul), la pastille passe au-dessus du titre à toutes les largeurs (16 px) et le titre,
 * la promesse et les pastilles sont à 24 px l'un de l'autre, à 375 comme à 1280. Écartée (mesurée) : la pastille à
 * droite partout ; elle tient à 375, mais à 1280 la colonne de texte perd 44 px et finit 68 px au-dessus de la carte
 * d'offre (la règle des 48 px sous les pastilles du tour 7 ne tient plus). Les autres aperçus ne changent pas.
 */
export function HeroApercu({
  titre,
  promesse,
  pastilles,
  offre,
  rythmeRegulier = false,
}: {
  titre: string;
  promesse: string;
  pastilles: readonly string[];
  offre: React.ComponentProps<typeof OffreApercu>;
  /** Quoi répondre (s26, tour 8) : pastille au-dessus du titre partout, 24 px entre titre, promesse et pastilles. */
  rythmeRegulier?: boolean;
}) {
  const tete = (
    <>
      <BadgePremium className="flex-none" />
      {/* s26 (décision de Thomas du 18/11) : titre en BLANC, comme chez l'abonné (`TITRE_PAGE` seul) ; le texte en
          dégradé du tour 13 est retiré. Le seul aplat violet reste le bouton d'offre. */}
      <h1 id="apercu-titre" className={cn("min-w-0", TITRE_PAGE)}>
        {titre}
      </h1>
    </>
  );
  return (
    <div className="grid gap-4 md:gap-6 lg:grid-cols-12 lg:items-start lg:gap-12" data-apercu-hero>
      <div className="flex min-w-0 flex-col lg:col-span-8">
        {/* Tête : pastille « Premium » puis H1 (ordre du DOM fixe). Une classe écrite en entier par cas (test v7 tour 2). */}
        {!rythmeRegulier ? (
          <div className="flex flex-row-reverse items-center justify-between gap-4 md:flex-col md:items-start md:justify-start" data-apercu-tete>
            {tete}
          </div>
        ) : (
          <div className="flex flex-col items-start gap-4" data-apercu-tete>
            {tete}
          </div>
        )}
        <p className="sr-only">{TEXTES_APERCU_VERROUILLE.lecteurEcran}</p>
        <p className={cn("max-w-xl [text-wrap:balance]", rythmeRegulier ? "mt-6" : "mt-4 lg:mt-8", TEXTE)}>{promesse}</p>
        <ul className="mt-4 flex flex-wrap gap-2 max-md:sr-only md:mt-6" data-apercu-pastilles>
          {pastilles.map((p) => (
            <li key={p} className={cn("inline-flex items-center rounded-full bg-background-elevated px-3 py-1", META)}>
              {p}
            </li>
          ))}
        </ul>
      </div>
      <div className="min-w-0 lg:col-span-4">
        <OffreApercu {...offre} />
      </div>
    </div>
  );
}
