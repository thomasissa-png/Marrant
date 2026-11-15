# Relecture design à l'aveugle, s25 v6 tour 1 : Favoris (aperçu) et Profil

Captures lues : `favoris/` (visiteur, gratuit : 375, 768, 1280, 1920 ; en-cours 1280 pour la cohérence), `profil/` (gratuit 375, 1280, 1920 ; en-cours 1280 ; nouvel 375), `entete/gratuit-profil-290.png` et `-320.png` (haut de page seulement). Non lues une à une : les 1456 et les pleines pages de chaque compte (même rendu que les largeurs voisines).
Code lu : `favoris/page.tsx`, `espace/apercu/{apercu-rubrique,exemple,favoris-ouvert}.tsx`, `profil/page.tsx`, `profil/profil-dashboard.tsx`, `profil/abonnement-card.tsx`, `profil/prenom-card.tsx`, `ui/reassurance.tsx`.
Limite : l'écran 290 n'est visible que sur son haut ; la cause exacte du débordement est déduite du code (voir PRO-1), pas mesurée.

## Notes

| Critère | Favoris (aperçu) | Profil |
|---|---|---|
| D1 fidélité accueil | 8 | 7 |
| D2 hiérarchie, lisibilité | 9 | 8 |
| D3 mise en page 5 largeurs | 6 | 5 |
| D4 cohérence espace | 8 | 6 |
| D5 finition pixel | 8 | 7 |
| U1 compréhension | 9 | 9 |
| U2 action principale unique | 9 | 9 |
| U3 états vides / nouvel abonné | 9 | 9 |
| U4 aperçu Premium | 8 | 9 |
| U5 accessibilité, cohérence | 8 | 8 |
| **Globale (minimum)** | **6** | **5** |

## Fautes dures

**FAV-1 (D3) Vide à droite à 1280+ sur l'aperçu Favoris.** `visiteur-favoris-1280.png` : la carte s'arrête à x=800 sur 1216 utiles (environ 37 % vide à droite) ; `gratuit-favoris-1920.png` : carte de 768 px dans 1216 (vide de 448 px), titre et carte collés à gauche, la page ressemble à une colonne de texte, pas à la langue de l'accueil (blocs centrés ou pleine largeur). Cause : `article ... max-w-3xl` dans `apercu-rubrique.tsx` (l.49), partagé par toutes les rubriques d'aperçu (coordonner avec les autres groupes).
Correction codable : à partir de `lg`, passer l'article en deux colonnes : `lg:max-w-none lg:grid lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-x-8` ; l'exemple (fiche ou état vide) en colonne gauche, le bloc `data-apercu-offre` en colonne droite (`lg:border-t-0 lg:border-l lg:pl-8 lg:pt-0 lg:flex-col lg:items-start`), `space-y-4` laissé en dessous de `lg`. La mesure de lecture des fiches reste bornée par la colonne. Alternative minimale : `max-w-3xl lg:mx-auto` (carte centrée comme les blocs de l'accueil), moins bonne car le titre reste à gauche.
Ce qui fait 10 : plus de vide à droite à 1280, 1456 et 1920, titre et carte alignés sur la grille de la bande.

**PRO-1 (D3) Débordement horizontal à 290 px sur `/profil`.** `entete/gratuit-profil-290.png` : la carte « Prochaine étape » et ses trois sous-cartes sortent à droite de l'écran (carte coupée au bord, aucune marge droite). À 320 (`gratuit-profil-320.png`) le haut de page tient (carte de 16 à 304). Cause probable : la grille de `profil-dashboard.tsx` est `grid gap-6 md:grid-cols-2` sans colonne définie sous `md`, donc la piste implicite est `auto` et prend la largeur minimale d'un enfant. Un enfant à contenu insécable (textes passés par `frTypo`/`lierComposes` : insécables, `Reassurance`, libellé du prénom) force la colonne à plus que 290 et toutes les cartes s'étirent avec elle. La grille interne de « Prochaine étape » (l.329) a le même défaut.
Correction codable (`apps/web/src/components/profil/profil-dashboard.tsx`) :
- l.162 et l.141 : `grid grid-cols-1 gap-6 md:grid-cols-2` (`grid-cols-1` = `minmax(0,1fr)`).
- l.329 : `grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3`.
- Garde-fou : `min-w-0` sur les Card de `abonnement-card.tsx` (l.99), `prenom-card.tsx` (l.55) et sur `Reassurance` au besoin `[overflow-wrap:anywhere]`.
- Vérifier ensuite `document.documentElement.scrollWidth === 290` en compte gratuit, en cours et nouvel, pleine page, aux largeurs 290 et 320.
Ce qui fait 10 : aucun défilement horizontal à 290, 320, 375 pour les trois comptes.

**PRO-2 (D4) H1 du Profil plus bas que celui des rubriques.** `gratuit-profil-1280.png` : « Mon profil » à y=210, alors que « Favoris » est à y=174 et « Mes favoris » (`en-cours-favoris-1280.png`) à y=174. Cause : `profil/page.tsx` l.31 rend encore `<div aria-hidden className={PLACE_REPERE} />` (spacer d'avant la bande v6), que `favoris/page.tsx` a retiré (son commentaire dit « H1 à la même hauteur que les rubriques de l'espace »). Environ 36 px de vide en plus sous la bande, et sur mobile 375 le titre est à y=205 contre 170.
Correction codable : supprimer la ligne 31 et l'import `PLACE_REPERE` (l.2) de `apps/web/src/app/(dashboard)/profil/page.tsx` ; vérifier le test d'inertie de l'interrupteur fermé (la ligne n'est rendue qu'ouvert, donc pas d'impact).
Ce qui fait 10 : H1 du Profil à la même ordonnée que Favoris et les autres rubriques.

## Pistes (ne retiennent pas la note seules, mais à corriger avec les fautes ci-dessus)

**PRO-3 (D5) Réassurance centrée sous un bouton aligné à gauche.** `gratuit-profil-1280.png` et `-1920.png` : « Premium : premier paiement remboursable sous 14 jours. » est centrée sur toute la largeur de la carte (x=361 à 919) alors que titre, phrase et bouton sont alignés à gauche (x=49). Elle flotte et semble détachée du bouton. Cause : `Reassurance` fait `text-center` (l.12) et `abonnement-card.tsx` l.168 n'écrase pas. Correction : `<Reassurance className="sm:text-left" />` (centré seulement sur mobile, où le bouton est pleine largeur). Ce qui fait 10 : réassurance collée à gauche sous le bouton à partir de `sm`. Même remarque possible sur les autres pages qui utilisent `Reassurance` (non vues ici).

**PRO-4 (D1, D5) Cartes du Profil gratuit à 1280 et 1920 : quatre blocs plats de pleine largeur.** Rythme régulier et lisible, cartes `rounded-xl` cohérentes avec l'espace, mais sans le filet dégradé violet de l'accueil et de l'aperçu (qui l'a). Même carte de l'aperçu Favoris : filet présent ; Profil : absent. Piste de cohérence : le filet sur la seule carte « Abonnement » (celle qui porte l'action). À valider par Thomas si la langue de l'accueil doit l'emporter sur le gris neutre des réglages ; l'existant est conforme à l'espace, la note n'est pas retenue pour cela.

**PRO-5 (D5) Zone vide dans le bandeau du haut du Profil en-cours 1280.** Aucune erreur : le bloc « Reprendre ton parcours » est bien le premier élément, cohérent avec le H1. Rien à corriger.

**FAV-2 (U4, D5) L'exemple de l'aperçu Favoris est un état vide.** Les captures montrent « Aucun favori pour l'instant » comme valeur du Premium : un non-abonné voit une carte vide, pas ce que Favoris lui donnera (comparer à `en-cours-favoris-1280.png`, où les cartes de vannes et conseils sauvegardés sont la vraie valeur). La décision documentée est de ne montrer aucun favori d'abonné : conforme, donc piste. Un texte nouveau est à valider par Thomas ; une option sans texte nouveau : montrer en lecture seule une vanne et un conseil réels de l'aperçu (comme les autres rubriques montrent une fiche réelle) avec le bouton « Retirer » inactif.

**FAV-3 (D5, U5) Lien « Connexion » trop petit en cible tactile.** `visiteur-favoris-375.png` : le lien souligné fait environ 20 px de haut à côté d'un bouton de 44 px. Correction : vérifier `LIEN` dans `components/espace/carte/styles` et ajouter `inline-flex min-h-11 items-center` (ou `py-3`) sur ce lien dans `apercu-rubrique.tsx` l.62. Cible 44 px exigée par le DS ; à tester, la hauteur exacte n'est pas mesurée.

**GEN-1 Donnée de test visible.** Les captures montrent « Inscrit gratuit (test) » et « Nouvel abonné (test) » dans le champ prénom : compte de recette, pas un défaut du produit. Ignoré.

## Points conformes (relevés pour ne pas les rouvrir)
- Aperçu Favoris : filet dégradé violet en haut de la carte, bouton unique `Premium · 1,99 €/mois`, lien « Connexion » seulement pour le visiteur (absent chez l'inscrit gratuit, comme prévu), aucun mur ni redirection, titre à la même hauteur que les autres rubriques. À 375 et 768 : pas de débordement, empilement propre, bouton et lien alignés.
- Profil 375 et 768 : cartes lisibles, ordre logique (cap, stats, parcours, rappel, abonnement, lettre, prénom, suppression), états vides du nouvel abonné non morts (« Découvrir les parcours »), zone dangereuse à la fin en rouge texte (contraste correct sur fond sombre), bouton « Enregistrer » plein sur mobile.
- Profil gratuit : une seule offre (carte Abonnement), badge « Aucun abonnement » explicite.

## Handoff @fullstack
Ordre conseillé : PRO-1 (une ligne par grille), PRO-2 (suppression d'une ligne), FAV-1 (`apercu-rubrique.tsx`, partagé : prévenir les groupes des autres rubriques), puis PRO-3 et FAV-3. Après correction : nouvelles captures Profil (290, 320, 375 pour trois comptes) et Favoris (1280, 1456, 1920) pour le tour 2.

NOTE GLOBALE : 5/10 (Profil) ; Favoris 6/10
