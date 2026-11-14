# Relecture design à l'aveugle, tour 2 : navigation universelle s24 (v2)

Note : 8/10. Mes 3 fautes dures du tour 1 sont corrigées. Deux nouvelles fautes dures, plus petites, retirent chacune 1 point.

## Vérification des 3 fautes du tour 1

| Faute tour 1 | Statut | Preuve dans la v2 |
|---|---|---|
| Rythme vertical absent | Corrigée | §3 : `pt-8 md:pt-10 xl:pt-12`, H1 `text-3xl md:text-4xl`, `mb-8 md:mb-10`, `gap-6`, `space-y-12`, `pb-16`, un seul `PageHeader`. Valeurs identiques à `page-header.tsx` (3xl/4xl, mb-8/10, mt-3/4) : aucune dérive |
| « Mon espace » sans état actif | Corrigée | §1 tableau d'état actif, soulignement `border-b-2 border-accent-primary`, `aria-current`, adresses listées |
| Cartes d'accès 2 ou 4 | Corrigée | §4 : une carte « Dans ton espace », lignes de 44 px, 1 colonne à 375, 2 dès 768 ; plus de rangée de 4 |

## Mesure de l'en-tête abonné (Plus Jakarta 700, logo mesuré 150 px à 16 px, 188 px à 20 px ; boutons de 44 px)

| Largeur | Utile | Contenu spécifié | Total | Verdict |
|---|---|---|---|---|
| 320 | 296 (marges 12) | logo 14 px = 131 + cloche 44 + Menu 44 + 2 gaps de 8 | ~235 | PASS, 61 px libres |
| 375 | 343 (marges 16) | logo 16 px = 150 + 44 + 44 + 2 gaps de 8 | ~254 | PASS, 89 px libres |
| 768 | 720 | logo 20 px = 188 + loupe + cloche + compte + Menu (4 x 44) + 4 gaps de 16 | ~428 | PASS, 292 px libres |
| 768 avec « Mon espace » en lien (~85 de texte + 16 de padding = 101) | 720 | 428 + 101 + 1 gap de 16 | ~545 | PASS, 175 px libres |
| 1024 | 992 | logo 188 + Mon espace 101 + 5 liens (262 + 60 padding + 16 gaps = 338) + 3 x 44 + 6 gaps de 16 | ~855 | PASS, 137 px libres |
| 1280 | 1216 | 188 + 101 + 358 + champ 176 + cloche + compte + 6 gaps de 12 | ~983 | PASS, 233 px libres |

Le visiteur (tour 1) reste inchangé : 604 px à 768, 884 à 1024, 1104 à 1280, 294 à 375. Rien ne se coupe de 320 à 1280.

## Fautes dures (2)

1. Carte du jour pleine largeur avec texte limité à 768 px (-1). §3 C : à 1280 la carte fait 1216 px et son texte 768 : un tiers vide à droite dans la carte, exactement l'interdit du §3 (« bloc collé à gauche avec vide à droite »), et c'est ce que montre la capture `espace-aujourdhui-1280.png` (cartes de 720 px à gauche). Correction : dès `md`, grille `grid-cols-1 md:grid-cols-2 gap-6`, carte du jour en colonne 1 (`min-w-0`), carte « Dans ton espace » en colonne 2 ; « Contenu du jour » en dessous sur 2 colonnes ; l'index n'a alors qu'une colonne de lignes (`grid-cols-1`). Supprimer « texte limité à 768 px » pour C (la mesure ne s'applique qu'aux paragraphes, `max-w-3xl`).
2. Plage 440 à 767 px non spécifiée (-1). §1 donne 375 et 768 mais pas où apparaissent loupe, icône compte et libellé du bouton d'offre entre les deux (aujourd'hui : l'icône compte n'existe pas sous 1024). Le critère 2 (identique au pixel) et `header-budget` ne sont pas testables sans cette règle. Correction : loupe dès `min-[440px]` (règle déjà écrite), icône compte dès `md` (768), cloche à toutes les largeurs, bouton d'offre « Premium » seul sous `sm` (640) et libellé complet dès `sm`. Mesuré à 640 abonné : logo 188 + 4 x 44 + 4 gaps de 16 = ~428 sur 592 : tient.

## Pistes

- Soulignement actif : `border-b-2` sur un lien de 40 px de haut ajoute 2 px à l'élément allumé seulement. Mettre `border-b-2 border-transparent` sur tous les liens, `border-accent-primary` sur l'actif (pas de saut), et `rounded-b-none` pour que le trait ne soit pas arrondi.
- 768 abonné : « Mon espace » est seulement dans le Menu (2 gestes) alors qu'il reste 175 px ; le logo y mène (1 geste), donc non bloquant. Option : lien « Mon espace » dans la barre dès `md`, ce qui aligne 768 sur 1024.
- 375 abonné : le lien « Mon espace » n'est que dans le Menu, donc aucun repère d'état actif visible dans la barre. Sur mobile, mettre `aria-current` et un point `bg-accent-primary` (8 px) sur le bouton Menu quand la page est dans l'espace ? À arbitrer, pas indispensable.
- Inscrit gratuit sur `/favoris` : rien n'est allumé (le tableau d'état actif parle de l'abonné). Allumer l'icône compte comme pour `/profil`.
- Le thème a `e400` mais pas 440 : écrire `min-[440px]` (déjà le cas dans le code), ne pas inventer de token.
- Mode clair : toujours non traité, à confirmer (spec le dit déjà).
