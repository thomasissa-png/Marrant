# Relecture design à l'aveugle, s25 v6 tour 1 : Bibliothèque et fiches construction, vocabulaire, formule, humour noir

Méthode : brief v6, nav v6, étalon accueil 1280, thème (`CARTE` = `rounded-lg` 12 px, aperçu = `rounded-xl`). Captures lues : bibliothèque en-cours 375, 768, 1280, 1920 ; visiteur 375, 1920 ; gratuit 1280 ; fiches en-cours construction 1280, vocabulaire 375, formule 768, humour noir 1280 ; nouvel humour noir 1920. Les autres tailles ne sont pas toutes ouvertes : l'INDEX donne les mêmes hauteurs de page pour en-cours et nouvel (2219 px à 1280+), donc même rendu, et visiteur et gratuit ont les mêmes hauteurs (1646 px). Pas de lecture de relecture existante.

## Constat d'ensemble

- Hub abonné (en-cours, nouvel) : titre H1 à gauche, 5 cartes en 2 colonnes dès 768, 1 colonne à 375. Propre, aéré, lisible, lignes de 44 px avec chevron, pastilles de thèmes, aucun débordement. Mais c'est la langue grise de l'espace, pas celle de l'accueil : cartes sans filet violet.
- Aperçu (visiteur, gratuit) : H1, sous-titre validé, UNE fiche réelle lue en entier (« Le faux secret »), un seul bouton plein, lien Connexion pour le visiteur. Conforme à la spec. La carte porte le filet dégradé et `rounded-xl` de l'accueil.
- Fiches : colonne de lecture centrée (768 px), retour, H1, étiquette de type + durée, carte de contenu, carte « À toi ». Cohérentes entre elles aux 4 types lus.

## Notes (grille du brief)

| Critère | Note | Verdict |
|---|---|---|
| D1 Fidélité à l'accueil | 7 | Cartes du hub et des fiches `rounded-lg`, sans filet violet, alors que l'aperçu de la MÊME rubrique l'a |
| D2 Hiérarchie, lisibilité | 9 | H1 net, titres de cartes `text-xl`, corps 16 px ; eyebrow `text-text-muted` 12 px à surveiller |
| D3 Mise en page 5 largeurs | 5 | Aperçu : carte `max-w-3xl` collée à gauche, 400 px vides à droite à 1280, 1456, 1920 |
| D4 Cohérence espace | 8 | Hub (`rounded-lg`, sans filet) contre aperçu (`rounded-xl`, filet) dans la même rubrique |
| D5 Finition au pixel | 7 | Double filet en haut de la carte « À toi » de chaque fiche |
| U1 Compréhension | 9 | Titre, bande allumée, cartes titrées |
| U2 Action principale | 9 | Hub : choisir une fiche (une seule action, évidente) ; aperçu : un seul bouton plein |
| U3 États vides, nouvel abonné | 9 | Hub jamais mort (même rendu qu'en-cours, aucun « Fait » à montrer) |
| U4 Aperçu Premium | 8 | Valeur visible, une offre, pas de mur ; la mise en page à gauche laisse l'offre isolée dans un coin |
| U5 Accessibilité, cohérence | 9 | Cibles 44 px, focus anneau, états par texte ; bande tronquée hors périmètre (voir plus bas) |

**NOTE GLOBALE : 5/10** (minimum, D3). Barre de 9 non atteinte.

## Défauts, corrections codables, ce qui fait 10

### F1 (faute dure, D3, U4) : aperçu collé à gauche, vide à droite à 1280+
- Captures : `bibliotheque/gratuit-bibliotheque-1280.png` (carte de x=32 à 800 sur 1216, soit 400 px vides), `visiteur-bibliotheque-1920.png` (carte 352 à 1120, vide jusqu'à 1568), identique à 1456.
- Code : `apps/web/src/components/espace/apercu/apercu-rubrique.tsx` ligne 49, `max-w-3xl` sans centrage, le `<header>` aussi.
- Correction : envelopper header et article dans `COLONNE_LECTURE` (`components/layout/gabarit.ts`, déjà utilisée par les fiches abonné, colonne centrée) ou `mx-auto max-w-3xl` ; sous-titre et H1 restent alignés sur la carte. Les fiches abonné étant déjà centrées, l'aperçu se superpose alors exactement à la vraie fiche.
- Fait 10 : aperçu centré identique à la page de fiche (même x de H1 et de carte à 1280, 1456, 1920) ; à 768 et 375 la colonne pleine largeur est déjà bonne.

### F2 (faute dure, D5) : double filet en haut de la carte « À toi »
- Captures : `fiches/en-cours-fiche-construction-1280.png` (trait à y=1032 juste sous le bord de la carte, avant « À TOI »), idem vocabulaire 375 et formule 768.
- Code : `components/espace/fiche.tsx` lignes 153 à 164 enveloppent `GesteFiche` dans `CARTE`, alors que `components/espace/carte/geste-fiche.tsx` ligne 56 porte `border-t border-border pt-4` (filet fait pour séparer d'un corps au-dessus, ici il n'a rien au-dessus).
- Correction : ajouter une prop `separe?: boolean` à `GesteFiche` (défaut vrai pour les cartes de rafale), passée à `false` depuis `fiche.tsx` qui retire `border-t pt-4`. Ne rien changer ailleurs.
- Fait 10 : carte « À toi » sans trait parasite, premier élément à 24 px du bord (`md:p-6`).

### F3 (faute dure, D1, D4) : cartes du hub et des fiches hors langue de l'accueil
- Captures : `bibliotheque/en-cours-bibliotheque-1280.png` contre `gratuit-bibliotheque-1280.png` (filet violet et coins plus ronds sur l'aperçu seulement) et `etalon-accueil/visiteur-accueil-1280.png` (cartes `rounded-xl`, filet dégradé).
- Code : `components/espace/carte/styles.ts` ligne 11, `CARTE` = `rounded-lg` sans filet ; filet de l'aperçu = `apercu-rubrique.tsx` ligne 51.
- Correction : sur `BlocBibliotheque` (`bloc-bibliotheque.tsx` ligne 14) et la carte de contenu de `fiche.tsx` ligne 149, passer en `relative overflow-hidden rounded-xl` et ajouter `<div aria-hidden className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-accent-primary-hover to-accent-secondary-hover" />` (même markup que l'aperçu). Extraire `CARTE_ACCUEIL` dans `carte/styles.ts` pour ne pas dupliquer. Ne PAS modifier `CARTE` globalement sans accord des autres groupes (il sert partout dans l'espace) : à signaler au chantier commun.
- Fait 10 : une carte de la Bibliothèque ressemble à une carte de l'accueil et à l'aperçu.

### P1 (piste, D4) : pas de rythme de section de l'accueil
Titre H1 à gauche (conforme aux autres pages de l'espace, donc non retenu). Si Thomas veut le titre centré comme sur l'accueil, c'est un chantier d'espace entier, pas de ce groupe.

### P2 (piste, D2) : eyebrow des fiches
`ETIQUETTE` (`text-xs`, `text-text-muted`) pour « COMMENT C'EST CONSTRUIT · 5 min » : AA à vérifier au contraste mesuré ; à `text-text-secondary` par sécurité (`fiche.tsx` ligne 129 colore déjà le `<p>` en secondary, seul l'`ETIQUETTE` est en muted).

### P3 (piste, hub) : colonnes déséquilibrées
À 1280, colonne gauche finit à y=1408, droite à 1540 (130 px d'écart), à 768 de même : acceptable (colonnes CSS, pas d'étirement). Non retenu.

## Signalements hors périmètre ou de texte (sans retenir la note)
- Bande des rubriques à 1280 pour visiteur et gratuit (`gratuit-bibliotheque-1280.png`, `visiteur-bibliotheque-1920.png`) : « Carnet » est rogné par le fondu avant le bouton « … » alors que la spec exige 80 px libres sans troncature. À signaler au groupe de la bande.
- Texte : dans la fiche formule, la grille « À toi » commence par « elle tient en une phrase ? » en minuscule alors que les deux autres lignes ont une majuscule (`en-cours-fiche-formule-768.png`). Texte validé : à signaler seulement.
- Aucun texte nouveau proposé.

## Points conformes (10 si c'était seul en jeu)
- Aperçu : sous-titre validé, une fiche réelle entière, un bouton plein, Connexion pour le visiteur seul, pas de mur ni de pop-up.
- Hub : jamais vide à 1280+ (2 colonnes pleines), pas de débordement à 375, cibles 44 px, chevrons, pastilles `min-h-11`.
- Écran d'entrée de l'humour noir (`en-cours-fiche-humour-noir-1280.png`, `nouvel-fiche-humour-noir-1920.png`) : seuil sobre, une phrase, un bouton « Entrer », colonne centrée alignée sur les autres fiches.

NOTE GLOBALE : 5/10

Fautes dures :
1. Aperçu collé à gauche, 400 px vides à 1280, 1456, 1920 : `apps/web/src/components/espace/apercu/apercu-rubrique.tsx`
2. Double filet en haut de la carte « À toi » de toutes les fiches : `apps/web/src/components/espace/fiche.tsx` et `apps/web/src/components/espace/carte/geste-fiche.tsx`
3. Cartes du hub et des fiches sans filet violet ni `rounded-xl`, contre l'accueil et l'aperçu de la même rubrique : `apps/web/src/components/espace/bloc-bibliotheque.tsx`, `apps/web/src/components/espace/fiche.tsx`, `apps/web/src/components/espace/carte/styles.ts`
