# Encarts Premium de l'aperçu : carte d'offre et fin d'extrait (s26, retour de Thomas du 18/11)

Étalon : carte Premium de l'accueil (`home/premium-cta.tsx`, `carte-premium-achat.tsx`), captures `docs/captures/s25/etalon-accueil/`.

## Diagnostic en 5 puces

1. **Matière : l'aperçu a retiré tout ce qui fait « la carte Premium » de l'accueil.** Accueil : `rounded-2xl border-2 border-accent-primary shadow-lg shadow-accent-primary/10` plus un halo violet à 5 % en coin. Aperçu : `rounded-xl border border-border-hover`, aucun halo (décision s25 §2.3 « sans violet, sans ombre »). Résultat : une carte grise de plus parmi les tuiles grises, alors que l'accueil la fait ressortir par son bord et sa lumière.
2. **Aucun objet commun.** La carte (a) est un cadre ; la fin (b) est un texte et un bouton nus sur le fondu noir, sans bord ni fond. Deux rendus pour une même offre : (b) ne se lit pas comme « la même chose, plus bas », ni comme appartenant à la page (il flotte sur le fondu).
3. **Rythme interne cassé dans (a).** Bouton, réassurance, « Connexion » sont empilés en haut ; la carte étirée (`etiree`) laisse un vide d'environ 56 px dessous (capture 1280 : Connexion à y 312, bas de carte à y 376). Ce vide est subi, non dessiné. Sur l'accueil, la carte se termine sur son dernier élément avec un padding égal.
4. **Le bouton est seul à porter l'offre.** À l'accueil, le bouton est précédé d'un titre en 36 px et d'une phrase ; ici il n'a rien au-dessus. La fin (b) n'a pas non plus sa réassurance : le bouton plein sans la garantie contredit la règle du dépôt (`Reassurance` sous tout plein à prix).
5. **Densité et alignements.** Padding 16/24 contre 24/32 à l'accueil ; « Connexion » souligné en gris flotte sans filet ; (b) fait 252 px de large (`sm:min-w-64`) sans rapport avec la colonne de l'extrait ; la preuve (hero) et l'encart n'ont aucun lien visuel. Le verrou n'est pas en cause : l'icône est déjà sur chaque tuile et dans le badge, en ajouter une serait le motif « icône au-dessus du paragraphe ».

## Direction retenue : « l'objet Premium » = la carte de l'accueil, transposée

Même matière que l'accueil, aucun texte ni taille nouveau. Un seul objet, deux emplacements : (a) en tête, (b) en fin d'extrait.

Matière commune (classes) : `rounded-2xl border-2 border-accent-primary bg-background-card shadow-lg shadow-accent-primary/10`, plus un halo décoratif `aria-hidden` : `pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-accent-primary/5 blur-3xl` (la carte porte `relative overflow-hidden`, le contenu `relative`).
- **Contre la règle « un seul aplat violet »** : un aplat est une surface pleine et opaque qui attire le clic ; ici le bord est un trait de 2 px (le bouton reste la seule surface pleine) et le halo est à 5 % d'opacité, flouté, sans contour (ombre à 10 %). Contraste mesuré : bord `#8B5CF6` 3,9:1 sur la carte `#1F1F1F` et 4,6:1 sur la page (WCAG 1.4.11 ≥ 3:1) ; texte `#B3B3B3` sur carte + halo : au moins 7:1.
- **Contre la règle des tailles** : aucune combinaison nouvelle. Bouton 16/600, réassurance 14/400 (`META`), « La suite est dans Premium » 20/600 (`TITRE_CARTE`), « Connexion » 14/400.
- Le bouton (`BOUTON_OFFRE`) reste en `w-full` dans les deux. Le prix reste dans le libellé du bouton, sans style séparé (ce serait une 7e combinaison).
- La décision s25 §2.3 (« bord simple, sans violet ») est remplacée par ce document (retour du 18/11) ; ce n'était pas un `[CHOIX UTILISATEUR]`.

### (a) Carte d'offre (`offre-apercu.tsx`)

Conteneur : `relative overflow-hidden rounded-2xl border-2 border-accent-primary bg-background-card p-4 shadow-lg shadow-accent-primary/10 md:p-6` + `etiree && "lg:h-full"`. Le halo est le premier enfant ; le contenu est dans `<div className="relative flex h-full flex-col">`.
Ordre : bouton, phrase d'objet (inscrit), réassurance, preuve (inchangé, aux mêmes seuils), puis la zone « Connexion » **calée en bas** : `<div className="mt-auto pt-4 md:pt-6">` contenant `<p className="flex justify-center border-t border-border pt-2 …">` (visiteur seulement). Le vide d'étirement disparaît : il se place entre la réassurance et le filet, au-dessus d'une zone qui s'accroche au bord bas.
Le filet de « Connexion » est supprimé quand la preuve (qui a déjà le sien) est affichée : `preuveHors ? "md:max-lg:border-t-0" : "border-t-0"`. « Connexion » garde `LIEN`, `min-h-11 min-w-11`, `text-text-secondary`.
- 375 : `p-4` (16, contrainte du premier écran du tour 8 conservée), bouton `mt-0`, réassurance `mt-2`, `pt-4` avant le filet.
- 768 : `md:p-6`, réassurance `md:mt-4`, preuve de la carte visible (768-1023) avec son filet, pas de filet de Connexion.
- 1024 et 1280 : `p-6` (24 ; pas de `p-8` : la colonne 4/12 ne fait que 309 px à 1024), carte étirée, Connexion sous filet en pied. La carte ne doit pas dépasser la colonne de texte de plus de 24 px ; au-delà, retirer `pt-4` de la zone Connexion.

### (b) Fin d'extrait (`extrait-coupe.tsx`, bloc `data-apercu-fin`) : devient une CARTE

Pourquoi une carte et pas un bandeau ou le texte nu : nu, il flotte sur le fondu et n'a pas de relation avec l'offre du haut (puces 2 et 5). Un bandeau pleine largeur (8/12) dilue le bouton dans 800 px et ressemble à un bandeau de cookies. Une carte de 448 px, centrée sous l'extrait, fait le pont : même objet que (a), à l'endroit où la décision se prend.
Classes : `relative mx-auto -mt-16 flex w-full max-w-md flex-col items-center gap-4 rounded-2xl border-2 border-accent-primary bg-background-card p-4 text-center shadow-lg shadow-accent-primary/10 md:-mt-[4.5rem] md:p-6 lg:-mt-10`.
Contenu : phrase `TITRE_CARTE`, puis une `div` `w-full` avec le bouton `w-full` (plus de `sm:min-w-64`, plus de `px-4`) et dessous `<Reassurance className="mt-2 md:mt-4 META" />` (texte existant, comme à l'accueil et en (a)). Sans halo à cet emplacement si le test de gate le lit comme un second violet (fallback : retirer le halo, garder bord et ombre).
Marges négatives recalculées pour que la phrase reste où elle est (le padding haut de la carte est repris par le chevauchement : 48 + 16 = 64 sous 768, 48 + 24 = 72 dès 768 ; 16 + 24 = 40 dès 1024). Le haut de la carte tombe à 24 px (16 à 375) sous la dernière tuile ; la phrase reste à 48 px comme dans la spec s26 tour 2 ; le bouton reste donc sous le pli à 900 px de haut.
- 375 : carte pleine largeur (343 px), bouton pleine largeur, réassurance sur 3 lignes.
- 768 : carte 448 px centrée sous l'extrait ; 1280 : centrée sous les 8 colonnes de l'extrait.

## Règle de l'« objet Premium » (commune à (a) et (b))
1. Même matière (bord 2 px violet, fond carte, ombre et halo violets à ≤ 10 %), même rayon `rounded-2xl`, même bouton.
2. Le bouton ne va jamais sans sa réassurance dessous (8 px sous 768, 16 dès 768).
3. Un seul aplat violet par écran (le bouton) ; jamais deux objets Premium entiers visibles ensemble au premier écran.
4. Pas d'icône, pas de pastille, pas de texte ajouté ; un vide se règle par le placement (`mt-auto`, marges du pas de 8), jamais par un texte plus grand.
5. Le titre (`TITRE_CARTE`) n'existe qu'en (b) ; en (a) le bouton ouvre la carte, comme dans le hero.

## Critères de relecture (mesurables)
- Gate typo : au plus 4 tailles, 6 combinaisons au premier écran, 2 graisses, aucune capitale ; aucune classe `text-*` nouvelle dans les deux fichiers.
- Aplat : un seul élément avec fond violet opaque par viewport ; halo `bg-accent-primary/5` seul, sans bord ni contour.
- Contrastes : bord 3:1 minimum (3,9:1 mesuré) ; textes 4,5:1 minimum ; bouton inchangé.
- Cibles : bouton, « Connexion » ≥ 44 px de haut (`min-h-11`) et de large ; `focus-visible` visible (anneau 2 px) sur fond carte.
- Alignements : (a) padding intérieur identique des quatre côtés (24 ou 16) ; bord bas de (a) à ≤ 24 px du bas de la colonne de texte à 1280 ; (b) centrée à ±1 px sur l'axe de l'extrait ; 48 px entre la dernière tuile et la phrase (inchangé) ; à 900 px de haut, bouton de (b) sous le pli à 1280, 1456, 1920.
- Aucun défilement horizontal à 375 et à 200 % de texte (e300) ; réassurance sans coupure dans le bouton.
- Relecture à l'aveugle : les quatre aperçus (Aujourd'hui, Quoi répondre, Bibliothèque, S'entraîner) à 375, 768, 1280 comparés à l'accueil ; critère 8 (une action dominante) et 9 (hiérarchie : bouton, puis phrase, puis le reste).

## Risques
Test de gate qui lit `accent-primary` comme aplat (le halo) ; deux bords violets visibles sur un viewport haut (1920 x 1080) ; allongement de la carte (a) à 1024 qui décale l'extrait (à mesurer) ; contradiction documentaire avec typo-harmonie s25 §2.3 à corriger.

**Handoff → @fullstack**
- Fichiers : `/home/user/Marrant/docs/design/encarts-premium-s26.md` (classes exactes (a) et (b), règle de l'objet Premium, critères) ; ne pas toucher au placement 8/4.
- À faire : appliquer les classes aux deux composants, capturer 375/768/1280 des quatre aperçus, mesurer le décalage de l'extrait et le pli à 900 px, puis @design relit les captures.
