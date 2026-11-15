# Relecture design à l'aveugle s25 v6 tour 1 : La lettre et Carnet

Périmètre : `/lettre` (visiteur, gratuit : inscription ; en-cours et nouvel : archive vide en préversion), `/carnet` (visiteur et gratuit : aperçu, en-cours et nouvel : carnet complet). Captures lues : `lettre/{visiteur,gratuit,en-cours,nouvel}-lettre-*` et `carnet/*-carnet-*`. Les pleines pages du carnet abonné (24 417 px, 33 304 px à 375) sont illisibles une fois réduites : le constat sur le carnet abonné s'appuie sur le code (`carnet-page.tsx`, `carnet-fiche-card.tsx`) et sur la hauteur annoncée dans `INDEX.md`. Les lettres envoyées n'existent pas en préversion : l'archive à lignes (`ArchiveLettres`) n'est pas vérifiable visuellement, seul son code est relu.

Étalon : accueil 1280 (hero centré, titres de section centrés, cartes `rounded-xl` à filet violet en haut, pastilles).

## Notes

| Critère | /lettre | /carnet | Retenue |
|---|---|---|---|
| D1 Fidélité à l'accueil | 5 | 6 | 5 |
| D2 Hiérarchie et lisibilité | 7 | 8 | 7 |
| D3 Mise en page 5 largeurs | 8 | 7 | 7 |
| D4 Cohérence espace | 8 | 7 | 7 |
| D5 Finition | 8 | 8 | 8 |
| U1 Compréhension | 8 | 9 | 8 |
| U2 Action principale | 6 | 9 | 6 |
| U3 États vides / nouvel | 8 | 8 | 8 |
| U4 Aperçu Premium | sans objet (page d'inscription, une seule offre : la lettre gratuite) | 9 | 9 |
| U5 Accessibilité, cohérence comptes | 8 | 8 | 8 |

**NOTE GLOBALE : 5/10** (minimum, D1). Sous la barre de 9.

## Défauts, corrections, ce qui ferait 10

### D1 Fidélité à l'accueil : 5 (faute dure)
- `lettre/visiteur-lettre-1280.png`, `gratuit-lettre-1280.png`, `visiteur-lettre-375.png` : la page d'inscription est un formulaire nu aligné à gauche dans une colonne `max-w-3xl`, sans carte, sans filet violet, sans pastille, titre non centré. C'est exactement le « tableau de bord gris à part » que le brief refuse. L'accueil, lui, centre ses titres et pose ses blocs dans des cartes à filet dégradé.
- `carnet/visiteur-carnet-1280.png` : titre et kicker alignés à gauche (acceptable pour une lecture), mais la fiche offerte, le bloc d'achat et les lignes « Au programme » sont des cartes `rounded-lg` (12 px) sans filet violet ; l'étalon est `rounded-xl` avec filet. `Card` (`apps/web/src/components/ui/card.tsx` : `rounded-lg`, aucun filet) en est la cause.
- Correction codable `/lettre` : dans `lettre-page-inscription.tsx`, centrer l'en-tête (`text-center`, `mx-auto max-w-2xl`) et envelopper `LettreInscription` dans une carte `rounded-xl border border-border bg-background-card p-6 md:p-8` avec le filet violet de l'accueil (reprendre la classe exacte de la carte d'accueil, à relever dans les composants de la page d'accueil, non lue ici). Pastille « Gratuit » au-dessus du titre, comme les pastilles de l'accueil (texte à valider par Thomas).
- Correction codable `/carnet` : `carnet-fiche-card.tsx` ligne 28 et `carnet-page.tsx` (`CarnetPaywall`, `BLOC_APPEL`) : passer les cartes en `rounded-xl` avec le même filet haut. Les sous-blocs internes (« On te dit », « Tu réponds ») peuvent rester `rounded-lg`.
- 10 = une inscription lisible comme une section de l'accueil (carte à filet centrée) et des cartes du carnet identiques à celles de l'accueil.

### D2 Hiérarchie : 7
- `visiteur-lettre-1280.png` : le seul élément fort de la page est le bouton violet « Premium · 1,99 €/mois » de l'en-tête ; la page elle-même n'a pas de point d'appui (voir U2). Le texte légal « Gratuit, sans compte… » est en 12 px gris, lisible mais proche de la limite.
- Carnet visiteur : bon (kicker, titre, fiche, bloc d'achat violet, programme). Piste : le kicker `text-xs` violet est fin à 375.
- 10 = un bouton principal plein sur la page lettre, et le texte légal en `text-sm`.

### D3 Mise en page : 7
- `visiteur-lettre-1920.png`, `en-cours-lettre-1920.png` : colonne de 768 px centrée, jamais de vide à droite, pas de débordement. Correct.
- `en-cours-carnet-*` : une seule colonne `max-w-3xl` avec 30 fiches complètes empilées (24 417 px à 1280, 33 304 px à 375) : à 1280+ environ 40 % de la largeur reste vide de chaque côté pour des fiches de 700 px de texte ; le défilement est interminable.
- Correction : `carnet-page.tsx`, pour `view.premium`, passer les fiches en grille `md:grid-cols-2` sur `max-w-6xl` ou replier chaque fiche (titre + contexte visibles, détail déplié au clic). Un repli sur les 30 fiches, avec ancre `#fiche-<id>` déjà présente, divise la hauteur par ~5.
- 10 = carnet abonné parcourable (sommaire ou repli) sans vide latéral excessif.

### D4 Cohérence avec l'espace : 7
- `en-cours-lettre-1280.png` : l'abonné voit « Lettres » (H1) alors que la rubrique s'appelle « La lettre » : écart de libellé entre bande et titre. Le visiteur voit un autre H1 (« Une situation, trois répliques, chaque mois ») : deux gabarits très différents sous la même rubrique, c'est voulu (décision du 14/11) mais le visiteur n'a ni PageHeader ni carte, l'abonné a les deux. Écart de langue entre les deux états.
- Texte « Lettres » : libellé validé, signalé seulement (`TEXTES_LETTRES.titre`).
- Carnet : le fil d'Ariane est retiré sur le premier niveau, cohérent avec v6.

### D5 Finition : 8
- `visiteur-carnet-1280.png` : le bloc d'achat aligne titre, paragraphe et bouton à gauche, mais la ligne de réassurance « Premium : premier paiement remboursable… » est centrée et d'un blanc plus fort que le paragraphe : alignement incohérent. Correction : `Reassurance` (`components/ui/reassurance`), `text-left` dans ce bloc ou `text-text-secondary`.
- `visiteur-lettre-1280.png` : case à cocher d'environ 24 px de côté, grise sans bordure violette ; la cible cliquable doit atteindre 44 px (à vérifier dans `lettre-inscription.tsx`, non lu : si le `label` englobe le texte, c'est conforme).
- Bande des rubriques (hors périmètre, signalé) : « Carnet » est coupé en « Carne » à 1280 et 1920 pour le visiteur (`visiteur-lettre-1280.png`, `-1920.png`), et « Aujourd'hui » est coupé à gauche sur `visiteur-carnet-1280.png`.

### U2 Action principale : 6 sur /lettre (faute dure)
- `visiteur-lettre-1280.png` : « Envoie-moi la lettre » est un bouton contour (fond sombre, bordure violette fine), alors que c'est l'unique action de la page ; elle rivalise mal avec le bouton plein « Premium » de l'en-tête, qui est visuellement dominant. L'œil va vers Premium, pas vers l'inscription.
- Correction : dans `lettre-inscription.tsx` (non lu), utiliser `buttonVariants({ variant: "primary", size: "lg" })` (fond violet plein, comme le bouton d'achat du carnet) pour la soumission. 10 = un bouton violet plein, seul de son type dans le contenu.
- Abonné : « Aller à Aujourd'hui » en contour sur l'état vide est une sortie secondaire acceptable (pas d'action principale à attendre, rien n'est envoyé).

### U1 Compréhension : 8
- Page abonné : l'état vide « Tes lettres s'affichent ici dès leur envoi. » est clair. Mais titre « Lettres » ≠ rubrique « La lettre » (voir D4).

### U3 États vides : 8
- `en-cours-lettre-*` et `nouvel-lettre-*` : jamais une page morte, avec sortie vers Aujourd'hui. Mais la carte vide est grise nue, sans filet ni ton éditorial ; la préversion ne permet pas de voir l'archive remplie (`archive-lettres.tsx` : lignes `rounded-md`, `min-h-14`, correct en code, non vérifié au rendu). Faute dure à ne pas exclure sur le rendu avec données : demander des captures avec 2 lettres en base.
- Carnet nouvel abonné : identique à l'abonné avancé (30 fiches), aucun état vide nécessaire, mais aucun repère « tu commences ici » (piste, texte à valider par Thomas).

### U4 Aperçu Premium carnet : 9
- `visiteur-carnet-1280.png` / `-375.png` : une fiche offerte entière (valeur visible), un bloc d'achat unique violet, 3 titres verrouillés et « Et 26 autres répliques ». Pas de mur. Piste : le bloc d'achat arrive à ~1000 px sur 1280, sous le pli ; il n'est pas bloquant car le bouton Premium reste dans l'en-tête.
- 9 → 10 : rien d'obligatoire.

### U5 Accessibilité : 8
- Focus : lignes d'archive avec `focus-visible:ring-2 ring-accent-link` : correct. Contrastes du gris 12 px et du placeholder `toi@exemple.fr` à vérifier (non mesurable sur capture).
- `gratuit-lettre-1280.png` : le compte gratuit voit l'e-mail pré-rempli mais la case non cochée : cohérent avec le consentement, pas un défaut.
- Piste : le carnet abonné, 30 fiches en `h2`, n'a pas de sommaire de navigation clavier.

## Pistes (ne retiennent pas la note)
- Lien « Les carnets précédents » (`carnet-page.tsx`, section `carnet-archives`) tout en bas d'une page de 24 000 px : les chips mensuelles sont quasiment inatteignables. À remonter en tête de page pour l'abonné (`chipClass`, sous l'intro) : réellement un défaut d'UX, mais classé piste faute de capture lisible.
- Les captures pleine page du carnet abonné sont inexploitables (réduites à 105 px de large) : fournir un cadrage de la zone du haut (1280×900) pour les prochains tours.

## Fautes dures
1. D1 : `/lettre` sans carte ni filet violet ni titre centré, hors langue de l'accueil : `apps/web/src/components/lettre/lettre-page-inscription.tsx`.
2. D1 : cartes du carnet en `rounded-lg` sans filet violet : `apps/web/src/components/ui/card.tsx` et `apps/web/src/components/carnet/carnet-fiche-card.tsx`.
3. U2 : bouton « Envoie-moi la lettre » en contour, éclipsé par le Premium de l'en-tête : `apps/web/src/components/lettre/lettre-inscription.tsx`.
