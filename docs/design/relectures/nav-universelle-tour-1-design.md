# Relecture design à l'aveugle, tour 1 : navigation universelle s24

Note : 7/10. Le principe tient (un seul en-tête, 65 px, pas de barre) et les largeurs passent. Il manque le rythme vertical et la lecture des états actifs, deux choses dont dépend l'harmonie réclamée par Thomas.

## Mesure des libellés (captures 1280 et 375, Inter 14 px medium, Plus Jakarta 16/20 px bold)

Largeurs lues sur `site-vannes-1280.png` : logo 188 px (32 à 220), 7 onglets 488 px (250 à 738), champ de recherche 176, « Connexion » ~73 de texte, bouton « Premium · 1,99 €/mois » 174. À 375 : logo 150 px, bouton « Premium » 84, burger 44.
Largeurs de texte des 6 liens : Parcours ~59, Vannes ~49, Conseils ~57, Vidéos ~46, Articles ~51, La lettre ~54 = 316 px. Les paddings de `header.tsx` (px-1.5 / px-2) et gap-1 s'y ajoutent.

| Largeur | Utile | Visiteur | Abonné | Verdict |
|---|---|---|---|---|
| 1280 | 1216 | 188 + 418 (sans Accueil) + 176 + ~100 + 174 + 4 gaps de 12 = ~1104 | 188 + Mon espace ~130 + 5 liens ~340 + 176 + cloche 44 + compte 44 + gaps = ~1000 | PASS, 110 à 215 px libres |
| 1024 | 992 | 188 + 408 + loupe 44 + ~90 + ~90 + 4 gaps de 16 = ~884 | 188 + ~480 + 3 x 44 + 5 gaps de 16 = ~880 | PASS, ~110 libres |
| 768 | 720 | logo 188 + loupe 44 + ~90 + 174 + 44 + 4 gaps de 16 = ~604 | logo + loupe + cloche + compte + Menu = ~450 | PASS |
| 375 | 343 | 150 + 84 + 44 + 2 gaps = ~294 | 150 + 3 x 44 + 3 gaps = ~306 | PASS, 37 px libres (à 320 : 287 sur 296, serré) |

## Fautes dures

1. Rythme vertical absent (-1). La spec fixe largeurs et marges latérales mais aucune valeur verticale ni de titre : sans elles @fullstack improvise, c'est ce qui a produit les « mini parties » désalignées. Correction : ajouter au §3 un tableau commun aux 3 gabarits. Haut de page : `pt-8` (32 px) à 375, `pt-10` (40) dès 768, `pt-12` (48) dès 1280. Fil d'Ariane puis H1 : `mb-4` (16 px). H1 : `font-display font-bold` 30 px (`text-3xl`) puis 36 px (`text-4xl`) dès 768, un seul composant `PageHeader` pour A, B, C (celui de `page-header.tsx`, `mb-8`/`md:mb-10`). Intro : `mt-3`/`md:mt-4`, `text-lg text-text-secondary`, `max-w-3xl`. Sections : `gap-6` (24 px) entre cartes, `space-y-12` (48 px) entre sections, bas de page `pb-16` (64 px).
2. « Mon espace » sans état actif quand on est dans l'espace (-1). La spec ne surligne que l'entrée dans le panneau (§4 point 3) : sur Bibliothèque ou Profil, aucun élément de la barre n'est allumé, l'abonné ne sait plus où il est. Correction : le déclencheur prend le style actif des liens (`bg-background-elevated text-accent-link`, `aria-current="true"`) quand le chemin est une page de l'espace ; entrée courante dans le panneau : même style plus `font-semibold` (poids déjà dans l'échelle, pas de 3e graisse).
3. Cartes d'accès de Aujourd'hui (-1). §3 C dit « grille 1 colonne (375), 2 (768 et 1280) » et §4 « rangée de 4 cartes ». À 1280 on ne sait pas : 2 x 2 ou 4 en ligne. Correction : 4 cartes = `grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6`, la carte du jour reste `col-span` pleine largeur au-dessus ; texte de chaque carte limité à une phrase de 2 lignes.

## Pistes (non retirées)

- Gabarit A à 1280 : colonne de 768 centrée (bord gauche x = 256) sous un logo à x = 32 ; le saut A vers B est net. Admis par le principe, mais fixer que le fil d'Ariane et le lien retour s'alignent sur la colonne (pas sur le logo), sinon un fil à gauche avec un H1 au centre.
- Abonné à 375 : loupe dans la barre, alors que visiteur et inscrit gratuit l'ont dans le menu sous 440 px (code actuel : `min-[440px]`). Le critère 1 (identique au pixel) ne vaut que par état ; harmoniser en mettant la loupe dans le menu pour tous sous 440 px, ce qui rend 44 px de marge à 320.
- Menu mobile : « Mon espace » ouvert par défaut = 10 lignes x 44 px = 440 px, « Parcours et contenus » tombe sous le pli à 667 px. Plier le groupe par défaut, ou le montrer en 3 sous-titres comme le panneau de bureau (mêmes mots, même ordre, critère du §1).
- Supprimer `maxWidth.lecture` (45rem, 720 px) de `tailwind.config.ts` quand l'espace passe en A/B/C : sinon deux colonnes de lecture (720 et 768) coexistent.
- États actifs : `text-accent-link` #A78BFA sur `background-elevated` #2A2A2A donne ~5,6:1 (AA) ; lisible sur la capture (Vannes). Le fond seul est discret : ajouter un soulignement `border-b-2 border-accent-primary` aux liens actifs pour ne pas dépendre de la teinte.
- Mode clair : la spec et les tokens ne parlent que du sombre ; confirmer que le site est sombre seul (`darkMode: "class"` sans bascule vue).
