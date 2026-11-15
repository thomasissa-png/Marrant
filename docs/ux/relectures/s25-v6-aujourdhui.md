# Relecture à l'aveugle s25 v6, tour 1 : « Aujourd'hui » (/mon-espace)

Captures lues : les 20 de `docs/captures/s25/v6-tour-1/aujourdhui/` (4 comptes x 5 largeurs ; visiteur et gratuit voient l'aperçu). Code lu : `mon-espace/page.tsx`, `aujourdhui/premier-pas.tsx`, `cartes-du-jour.tsx`, `contenu-du-jour.tsx`, `apercu/apercu-rubrique.tsx`, `apercu/exemple.tsx`. Aucun texte validé réécrit.

## Notes

| Critère | Note | Verdict |
|---|---|---|
| D1 Fidélité à l'accueil | 6 | faute dure |
| D2 Hiérarchie, lisibilité | 7 | piste forte |
| D3 Mise en page 5 largeurs | 4 | faute dure |
| D4 Cohérence avec l'espace | 7 | piste |
| D5 Finition | 8 | piste |
| U1 Compréhension | 8 | piste |
| U2 Action principale évidente et unique | 7 | faute dure (nouvel abonné) |
| U3 États vides, nouvel abonné | 9 | piste |
| U4 Aperçu Premium | 8 | piste |
| U5 Accessibilité, cohérence entre comptes | 8 | piste |

**NOTE GLOBALE : 4/10** (minimum). Sous la barre de 9.

## Fautes dures

### FD1 : colonne 2 vide, la page est collée à gauche dès 768 px (D3)
- Preuves : `nouvel-aujourdhui-1280.png`, `nouvel-aujourdhui-1920.png`, `en-cours-aujourdhui-1280.png`, `en-cours-aujourdhui-768.png`. La carte du jour occupe 596 px sur 1216 (1280) ; la moitié droite, de « Aujourd'hui » à « Contenu du jour », est noire. À 1920, 620 px vides à droite de la carte dans la coque. Le commentaire de `page.tsx` (l. 99-101) l'avoue : « colonne 2 vide, à redessiner ». La grille `md:grid-cols-2` est conservée avec une seule colonne remplie.
- Correction codable, `apps/web/src/app/(dashboard)/mon-espace/page.tsx` : supprimer le conteneur à une colonne et la grille de la l. 116-117. Nouvel abonné : `PremierPas` pleine coque (voir FD3). Abonné avancé : `CartesDuJour` en pleine largeur, puis `<div className="grid grid-cols-1 gap-6 md:grid-cols-2">` pour `MissionLien` et `QuestionAise` côte à côte (à 375 : une colonne, ordre inchangé). Si un seul des deux existe, `md:col-span-2`.
- Ce qui ferait 10 : à 768, 1280, 1456, 1920, aucun bloc de plus de la moitié de la coque ne laisse un vide frontal à droite.

### FD2 : aperçu (visiteur et gratuit) collé à gauche à 1280 et plus (D3)
- Preuves : `visiteur-aujourdhui-1280.png` (carte de 768 px, vide de 416 px à droite), `gratuit-aujourdhui-1920.png` (vide de 450 px). Source : `max-w-3xl` dans `apercu-rubrique.tsx` l. 49.
- Correction, `apercu-rubrique.tsx` : à `lg`, deux colonnes `lg:grid lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-8 lg:items-start` ; la fiche (article) à gauche, le bloc d'offre (bouton unique et lien Connexion, gardant `data-apercu-offre`) sorti de l'article dans une carte `rounded-xl` à filet dégradé à droite, `lg:sticky lg:top-32` (114 px de bande + marge). Sous `lg`, ordre actuel (fiche puis offre). Retirer `max-w-3xl`. Les textes validés restent identiques.
- Ce qui ferait 10 : à 1280+, la coque est remplie, le bouton d'offre reste visible sans défiler.

### FD3 : l'action du jour ne domine pas, nouvel abonné compris (U2, D2)
- Preuves : `nouvel-aujourdhui-1280.png`. « Ton premier pas » est une carte de même fond (`bg-background-card`), même bordure et même poids que les trois cartes du dessous ; son titre fait 20 px (`lg:text-xl`, `premier-pas.tsx` l. 84), l'étiquette 12 px gris (`text-xs text-text-muted`). L'élément le plus voyant de l'écran est le bouton lecture rouge de la vidéo du jour (rouge saturé, 56 px), qui concurrence le bouton violet « Commencer » (147 px de large). À 375 (`nouvel-aujourdhui-375.png`) le bouton est visible au premier écran : bon point, c'est la seule bonne tenue.
- Correction, `premier-pas.tsx` (classes du thème uniquement) : `rounded-xl` + filet `<div aria-hidden className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-accent-primary-hover to-accent-secondary-hover"/>` (celui de l'aperçu, `apercu-rubrique.tsx` l. 51), `relative overflow-hidden`, `md:p-8`, titre `md:text-3xl`, étiquette en pastille. À `md+`, disposition en ligne : titre et durée à gauche, bouton `md:self-center md:ml-auto md:px-10` à droite, carte en pleine coque (FD1). `contenu-du-jour.tsx` : section « Contenu du jour » doit rester visiblement secondaire (titre `text-xl` conservé, vignette vidéo sans bouton rouge dominant : le rouge vient du lecteur YouTube, `youtube-player.tsx`, à atténuer par `opacity` au repos ou `[&_button]:scale-75` ; à valider @design).
- Ce qui ferait 10 : au premier écran à 1280, le regard va au premier pas, puis au bouton, puis au contenu du jour.

## Pistes (ne bloquent pas seules, mais retiennent la note)

### D1 Fidélité (6)
Cartes `rounded-lg` (12 px) sans filet dégradé (`premier-pas.tsx` l. 78, `cartes-du-jour.tsx` l. 34, `contenu-du-jour.tsx` l. 30), alors que l'étalon accueil et l'aperçu de la même route sont `rounded-xl` à filet violet. Titre « Aujourd'hui » aligné à gauche, sans sous-titre ni pastille. Correction : une constante partagée `CARTE_ESPACE = "relative overflow-hidden rounded-xl border border-border bg-background-card"` + filet, utilisée par les trois fichiers. Ce qui ferait 10 : une carte d'Aujourd'hui posée sur l'accueil ne se distingue pas.

### D2 Hiérarchie (7)
`en-cours-aujourdhui-1280.png` : le texte d'accroche (« La bonne réponse qui te vient en quittant la pièce... ») précède le titre « Si tu as 5 minutes » : l'ordre est voulu par `cartes-du-jour.tsx` (condition du libellé 7, validé), donc non touché. Le titre de section « Contenu du jour » est plus petit que la carte du jour : correct. La question « Où veux-tu être plus à l'aise ? » (quatre pastilles égales, 174 px de haut) pèse autant que la rafale : lui donner `bg-background-light` et `text-sm` pour la mettre sous la mission.

### D3 hors FD : cartes de hauteurs inégales et vignette courte
- `items-start` (`contenu-du-jour.tsx` l. 85) : à 1280 les trois cartes finissent à 755, 836 et 879 px (`nouvel-aujourdhui-1280.png`), bord bas en escalier. Remplacer par `items-stretch` (défaut) et laisser les liens en bas (`mt-auto`).
- À 768 (`nouvel-aujourdhui-768.png`), la vignette vidéo s'arrête à 495 px dans une carte de 717 : vide à droite à l'intérieur de la carte (`md:max-w-md`, l. 135). Soit disposition `md:grid md:grid-cols-[minmax(0,448px)_1fr] md:gap-6` (vignette à gauche, titre et lien à droite), soit retirer `md:max-w-md`.
- Texte de la vanne et du conseil coupé à environ 280 px dans une carte de 390 (1280) : mesure serrée avec vide à droite dans la carte ; chercher la cause dans `vanne-toucher.tsx` (largeur max du texte) et `max-w` du paragraphe conseil.

### D4 Cohérence (7)
Abonné : cartes sans filet ; aperçu du même écran : avec filet. Le passage gratuit vers abonné change la langue visuelle d'une même adresse. Corrigé par D1.

### D5 Finition (8)
- `visiteur-aujourdhui-1280.png` et `gratuit-aujourdhui-1920.png` : « Carnet » est coupé par le fondu devant « ... » (« Carne »), alors que la v6 §1 promet aucune rubrique tronquée à 1280 et plus. Hors périmètre (groupe bande), signalé : un groupe 2 + 3 + « ... » dépasse la coque quand les cadenas sont affichés.
- Boutons « Oui / À moitié / Rien » de l'aperçu (`visiteur-aujourdhui-1280.png`) : texte gris sur fond sombre, aspect désactivé. Si c'est voulu (lecture seule), le dire par `aria-disabled` et vérifier AA (4,5:1) ; non vérifiable à l'oeil, mesure à faire.

### U1 Compréhension (8)
Abonné : on comprend en 3 secondes. Visiteur : l'aperçu d'« Aujourd'hui » montre une fiche de situation, pas le rythme du jour (cartes, mission, contenu du jour) ; le visiteur ne voit pas ce qu'est cette rubrique. Piste : montrer en plus une ligne sur la rafale ; tout texte nouveau est à valider par Thomas.

### U3 États vides (9)
Nouvel abonné : jamais une page morte (premier pas + contenu du jour). Manque : aucun repère de la suite (pas de « tu auras des cartes demain »). Piste, texte à valider par Thomas.

### U4 Aperçu (8)
Valeur visible (vraie fiche lisible en entier), une seule offre dans la page, pas de mur, lien Connexion présent pour le visiteur et absent pour l'inscrit gratuit : cohérent. Réserve : bouton d'offre en bas de la fiche, sous le pli à 375 (`visiteur-aujourdhui-375.png`, 805 px sur 667) ; le bouton d'en-tête compense (« Premium »). Corrigé à 1280+ par FD2.

### U5 Accessibilité (8)
Boutons 44 px visibles (`h-11`, `h-12`) ; bon. `text-xs text-text-muted` de l'étiquette « Ton premier pas » : contraste à mesurer. Cohérence entre comptes : voir D4.

## Points conformes
Aucun retour ni fil d'Ariane ; l'index « Dans ton espace » a disparu sans trou à 375 ; un seul bouton plein par état ; états d'attente de « Contenu du jour » avec repli vers les pages gratuites ; typographie française (insécables) ; zéro tiret cadratin.

## Ordre de correction
1. FD1 + FD3 dans `page.tsx` et `premier-pas.tsx` (un seul passage, même grille).
2. FD2 dans `apercu-rubrique.tsx`.
3. Constante de carte partagée (D1/D4) et `items-stretch` (D3).
4. Nouveau tour de captures, 4 comptes x 5 largeurs.

NOTE GLOBALE : 4/10

Fautes dures :
1. Colonne 2 vide dès 768 px, page collée à gauche (nouvel et en cours) : `apps/web/src/app/(dashboard)/mon-espace/page.tsx`
2. Aperçu collé à gauche à 1280 et plus (visiteur et gratuit) : `apps/web/src/components/espace/apercu/apercu-rubrique.tsx`
3. Action du jour sans dominance (carte banale, titre 20 px, lecteur rouge plus voyant que « Commencer ») : `apps/web/src/components/espace/aujourdhui/premier-pas.tsx`
