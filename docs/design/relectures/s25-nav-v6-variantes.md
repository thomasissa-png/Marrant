# Relecture design à l'aveugle, navigation v6, variantes A / B / C (s25)

Méthode : captures lues une à une (visiteur-vannes 375/768/1280/1920 ×3, abonne-aujourdhui 375 et 1280 ×3, gratuit-apercu-1280 ×3, abonne-vannes-menu-1280 ×3), comparées à la référence de Thomas (barre en pastille, 1 rangée), à l'étalon accueil et à la première maquette « PowerPoint ». Aucune relecture ni commentaire de maquette consulté.
Limite : `c-visiteur-vannes-menu-1280.png` n'existe pas ; le menu « … » de C est jugé sur `c-abonne-vannes-menu-1280.png`. Cotes en px CSS estimées depuis les captures (2x), à vérifier à l'implémentation.

## Ce que fait chaque variante (constats visuels)

- **A** : 2 rangées. Logo + recherche (176 px) + Connexion + Premium, puis une rangée de liens nus alignée à gauche sur la marge de page, filet pleine largeur dessous. Actif = texte blanc + soulignement violet. Cadenas gris après le libellé. Les 3 groupes (5 Premium | Vannes…La lettre | Favoris, Carnet, …) ne sont séparés que par un blanc irrégulier. Aucune enveloppe.
- **B** : même structure qu'A, mais la rangée est dans une enveloppe en pastille (fond à peine plus clair que la page), actif = pastille violet sombre + texte blanc, bords en fondu à 375 et 768. Rangée plus haute (≈ 44 px + marge), en-tête total ≈ 91 px à 1280 contre ≈ 78 px pour A.
- **C** : 1 seule rangée. À 1280 et 1920 la nav est coincée entre logo et recherche et ne montre que 3 à 4 rubriques + « … » (abonné : Aujourd'hui, Parcours, Quoi répondre, Bibliothèque, Vannes, Conseils, « … » ; visiteur : Aujourd'hui, Parcours, Vannes, « … »). À 375 et 768 elle redevient identique à A (rangée défilante). Le menu « … » ouvert ne contient que « Mes questions » et « Mes répliques » : S'entraîner, Vidéos, Articles, La lettre, Favoris, Carnet ne sont visibles nulle part à 1280 / 1920.

## Notes /10

| Critère | A | B | C |
|---|---|---|---|
| 1 Élégance et finition | 7 | 8 | 7 |
| 2 Fidélité à la langue du site | 8 | 8 | 6 |
| 3 Lisibilité et hiérarchie | 7 | 8 | 5 |
| 4 Tenue aux 4 largeurs | 7 | 8 | 4 |
| 5 Respect des décisions | 9 | 9 | 2 |
| **Globale (minimum)** | **7** | **8** | **2** |

### A (7)
- Pour : la plus proche de l'étalon (liens nus, soulignement violet, même poids que « Parcours Vannes Conseils » de l'accueil). Sobre, aucun risque.
- Contre : la rangée flotte sans support, donc ressemble à un onglet de formulaire plutôt qu'à une barre de marque ; la séparation des groupes n'est qu'un blanc (≈ 40 à 70 px selon le point), lisible comme un trou ; cadenas gris ≈ 12 px à faible contraste ; à 768 la rangée est coupée sans fondu (« ndre » à gauche, « F » à droite) et à 375 « Vidéos » est tranché net ; au 375 le premier élément visible est « S'entraîner » (défilement centré sur l'actif), Aujourd'hui et Parcours sont cachés sans indice.
- Écart avec la référence : la référence a un conteneur pastille et une pastille active ; A n'a ni l'un ni l'autre.

### B (8)
- Pour : réponse directe au retour « ça manque d'élégance » : enveloppe pastille + pastille active = vocabulaire de la référence de Thomas et des filtres du site (chips arrondies sous « Vannes »). Les bords en fondu à 375/768 signalent le défilement. Le bord droit de l'enveloppe se cale presque sur la recherche à 1280 abonné (≈ 1775 / 1775). Menu « … » aligné sous l'enveloppe.
- Contre : enveloppe quasi invisible (≈ #141414 sur #0D0D0D), donc la forme se devine plus qu'elle ne se voit ; pastille active violet sombre peu contrastée avec l'enveloppe ; groupes toujours séparés par un blanc seulement ; à 1280 visiteur le bord droit de l'enveloppe (≈ 1908) ne s'aligne ni sur le bouton Premium (≈ 1950) ni sur le bas de la grille ; deux boîtes empilées (enveloppe + filet pleine largeur juste dessous) alourdissent l'en-tête ; mêmes points de défilement qu'A à 375 (S'entraîner en premier).

### C (2)
- Pour : en-tête le plus aéré et la plus faible hauteur (≈ 64 px) ; esthétiquement le plus « site de marque » quand on ne regarde que le haut.
- Contre : viole la décision fondatrice à 1280 et 1920 (rubriques absentes, pas seulement repliées : le « … » ne les contient pas) ; nav centrée avec ≈ 100 px de vide après le logo et un trou avant la recherche, pas d'alignement sur la grille ; comportement bimodal (1 rangée desktop, 2 rangées dès 768 : l'utilisateur voit deux navigations différentes) ; cadenas Premium visibles seulement sur 2 à 3 rubriques ; plus de pastille active, donc écart avec la référence.

## Recommandée : B

B est la seule à combiner conformité totale aux décisions (toutes les rubriques visibles à chaque largeur ou à un défilement) et réponse au « PowerPoint » par une vraie finition de barre. A est un repli sûr (7). C est éliminée à cause de la décision, indépendamment de son rendu.

## Retouches B pour atteindre 10 (codables, thème `apps/web/tailwind.config.ts`)

1. **Enveloppe visible** : fond `bg-background-light` (#1A1A1A) au lieu du gris actuel quasi noir, `rounded-full`, `p-1` ; pas de bordure (le contraste #1A1A1A / #0D0D0D suffit et évite la double boîte).
2. **Pastille active** : `bg-accent-primary/20 text-text-primary font-semibold ring-1 ring-inset ring-accent-primary/40` (au lieu du violet sombre plat). Vérifier le contraste texte/pastille ≥ 4,5:1 (blanc sur ≈ #2E2250 : OK).
3. **Séparateurs de groupes** : remplacer les blancs par un trait vertical `h-5 w-px bg-border mx-2 self-center` entre (Premium) | (Vannes…La lettre) | (Favoris, Carnet, …), identique à la référence. Même espacement partout : items `px-3.5 py-2` (hauteur ≈ 36 px, enveloppe ≈ 44 px).
4. **Cadenas** : `h-3 w-3 ml-1.5 text-text-muted` (#9A9A9A, déjà AA), `aria-hidden`, plus `<span class="sr-only">Premium</span>` ; le cadenas passe en `text-text-secondary` sur la pastille active pour ne pas disparaître.
5. **Alignement du bord droit** : l'enveloppe prend toute la largeur de la colonne de contenu (`w-full`, bord gauche et droit sur les mêmes marges que le titre et les cartes), « … » poussé à droite avec `ml-auto` ; à 1280 le bord droit tombe alors sur le bord droit du bouton Premium (visiteur) ou de l'avatar (abonné).
6. **Une seule ligne de séparation** : supprimer le filet `border-b` pleine largeur sous l'enveloppe, ou le garder et mettre l'enveloppe sans fond (au choix, pas les deux). Recommandé : garder l'enveloppe (point 1), retirer le filet, `pb-3` sous l'enveloppe, `border-b border-border` conservé seulement au scroll (sticky).
7. **Typo nav** : `text-sm` (14 px) `font-medium`, inactif `text-text-secondary` (#B3B3B3), survol `hover:text-text-primary hover:bg-white/5`, transition 150 ms. Focus visible : `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background-light`.
8. **Défilement mobile (375 et 768)** : à l'ouverture, `scrollIntoView({inline:"nearest"})` plutôt que centré, de façon que Aujourd'hui soit visible quand l'actif est parmi les premiers et que l'actif reste entier sinon ; ajouter `scroll-px-4`. Fondus de bord : `w-8 bg-gradient-to-r from-background-light` à gauche et `to-l` à droite, affichés seulement si du contenu est caché (aujourd'hui toujours présents ; à 768 le fondu droit coupe « Fa » en pleine lettre, forcer un item entier avec `snap-x snap-mandatory` et `snap-start` sur les items).
9. **Hauteur d'en-tête** : rangée 1 `h-14` (logo, recherche `w-44` = 176 px, Premium `h-10`), rangée 2 enveloppe `h-11`, `gap-2` entre les deux ; objectif ≈ 84 px à 1280 (aujourd'hui ≈ 91 px) et ≈ 108 px à 375 (aujourd'hui ≈ 116 px).
10. **Menu « … »** : conserver l'alignement actuel (bord droit calé sur l'enveloppe), `bg-background-card border border-border rounded-lg shadow-lg`, items `px-4 py-3` (cible ≥ 44 px), `mt-2`. Garder uniquement les rubriques réellement repliées, au minimum les deux actuelles, jamais de rubrique dans la barre ET dans le menu.
11. **1920** : borner l'en-tête et l'enveloppe à la même `max-w` que le contenu (visible sur A et B : la marge de page passe à ≈ 366 px) ; vérifier que l'enveloppe suit bien cette largeur et pas le viewport.
12. **Hors nav, à signaler** : le libellé de travail « [À VALIDER PAR THOMAS] » est rendu sur `gratuit-apercu` dans les trois variantes ; à masquer avant toute capture d'étalon.

Avec ces 12 points B est au niveau (étalon accueil : liens simples, chips arrondies, un seul bouton plein) sans ajouter de langage nouveau. Risque résiduel : la validation visuelle finale doit se faire sur de nouvelles captures aux 4 largeurs, pas sur ce texte.

RECOMMANDÉE : B — NOTE : 8/10
