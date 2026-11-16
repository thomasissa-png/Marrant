# Relecture design à l'aveugle : « Aujourd'hui » s25 v7, tour 1

Périmètre lu : specs UX et design, étalon accueil 1280, captures complètes 375/768/1280/1920 (visiteur), 375/1280 (nouvel, en-cours), `gratuit-ecran-375`, code `apercu/{tableau-verrouille,extrait-coupe,tuile-fermee,offre-apercu,hero-apercu}`, `aujourdhui/{tableau,etape-en-cours,semaines-tuile}`. Non relus en détail : 1456 (même coque que 1280 par construction), 1920 des comptes abonnés (idem), `page.tsx`.

## Ce qui est réussi (à ne pas toucher)

- Aperçu visiteur 1280 : lu FERMÉ au premier coup d'œil (tuiles atténuées, pastille Premium avec le mot, fondu), bouton d'offre en haut à droite dans la carte `border-2` de l'accueil, H1 aligné sur la barre. Le hero 7/5 utilise la largeur. Un seul plein dominant (le bouton du hero).
- Abonné : H1 à gauche + date, grille 8/4 puis 4/4/4 (ou 6/6), « Contenu du jour » en carte étalon de l'accueil. Une seule carte teintée (Z1), un seul plein. Chiffres en `font-display tabular-nums`, flamme et segments sobres. Cohérent entre comptes et avec l'accueil.
- Cibles : boutons `h-12` (`buttonVariants` lg), `PIED_TUILE` `min-h-12`, `puce()` 44 px, « Connexion » `LIEN min-w-11` (hauteur à vérifier : voir piste 4). Focus : anneaux présents dans les helpers. `inert` + `aria-hidden` sur l'extrait.
- Pas de dégradé de H1, pas d'icône dans un carré, pas d'emoji.

## Notes par critère

### Design

| Critère | Note | Constat |
|---|---|---|
| 1 Élégance, fidélité accueil | 8 | Au niveau de l'accueil. Six pastilles « Premium » sur le même écran à 1280 (hero, 4 tuiles, fin d'extrait) : répétition un peu bureaucratique, voir piste 1. |
| 2 Hiérarchie | 9 | Zone dominante nette (offre côté aperçu, Z1 côté abonné). Réserve : en Z1 « avancé » (`en-cours-1280`), la phrase d'accroche de la rafale passe AVANT le titre « Si tu as 5 minutes » : petit texte avant le titre, la hiérarchie se lit à l'envers (piste 2). |
| 3 Largeur, aucun vide mort, aucune tuile creuse | 6 | Trois vides morts, voir fautes dures 1 à 3. |
| 4 Cohérence entre comptes | 9 | Visiteur et gratuit identiques sauf la phrase d'objet ; les tuiles de l'extrait sont bien celles du nouvel abonné. |
| 5 Finition | 8 | Alignements propres, contrastes conformes à la spec. Défauts : pastille orpheline « Contenu du jour » seule sur la 2e rangée du hero à 768, 1280, 1456 et 1920 (piste 3) ; réassurance et phrase d'objet à 375 (gratuit) rendues en 14 px quasi blanc, plus visibles que la phrase d'objet : la spec dit `text-xs text-text-muted`, le composant `Reassurance` impose sa propre taille (piste 5). |

### UX

| Critère | Note | Constat |
|---|---|---|
| 1 Prospect, envie en 3 s | 7 | À 1280 : excellent. À 375 et 768 l'extrait ne montre qu'UNE tuile (« Ton premier pas ») ; « Ton cap » (la progression, la série, ce qui fait revenir) est un fondu illisible, juste avant « La suite est dans Premium ». La valeur gamifiée n'est donc pas visible sur mobile, qui est la cible du persona. Faute dure 3. |
| 2 Abonné, clarté | 9 | Action du jour évidente aux 3 largeurs. |
| 3 Abonné, envie de continuer | 8 | Cap, XP, série, étape n sur N visibles (`en-cours`). Réserve : le chiffre « 250 » est en blanc comme le reste, la progression n'a pas d'accent ; acceptable selon la spec (un seul accent). |
| 4 Nouvel abonné | 7 | Jamais une page morte, mais « Étape conseillée » est une tuile à moitié vide (faute dure 2) et « Tes 4 premières semaines » affiche des fragments commençant en minuscule (« le faux secret, une mission à voix haute. ») : « Semaine 1 : » n'est que `sr-only`, donc un voyant lit une phrase tronquée. Texte signalé à Thomas, pas réécrit (voir piste 6). |
| 5 Accessibilité visible et cohérence | 9 | Voir « réussi ». |

## Fautes dures (détail)

### 1. Z1 et Z2 creuses en bas à 1280+ (nouvel abonné, et même rendu dans l'extrait de l'aperçu)
Capture `nouvel-aujourdhui-1280` : Z1 de y=250 à 480, le contenu s'arrête à ~395 (le bouton) : 85 px de noir dans la carte dominante, idem sous la série dans Z2 (410 à 480). Cause : `CARTE_ACTION` pose `md:min-h-[14.5rem]` (232 px, repris de la spec design) alors que le contenu du nouvel abonné fait ~150 px. Correction : dans `components/espace/aujourdhui/tableau.tsx`, retirer `md:min-h-[14.5rem]` de `CARTE_ACTION` (la rangée se cale sur la plus haute des deux, Z2 réelle) et, côté `action-du-jour.tsx`, ancrer la rangée titre + bouton en bas (`md:mt-auto`) pour que le titre ne flotte pas. Ce qui fait 10 : aucune carte de la rangée 1 n'a plus de 24 px de vide sous son dernier élément. Les cas « avancé » restent propres (Z2 ~285 px, Z1 la remplit presque : vérifier que le vide de 50 px sous les deux lignes de cartes disparaît aussi).

### 2. « Étape conseillée » creuse (nouvel, 1280)
La tuile fait 305 px (alignée sur « Tes 4 premières semaines ») pour 3 lignes de contenu : 150 px de vide entre « Tes premières répliques » et le pied. Correction : dans `ParcoursTuile` (`etape-en-cours.tsx`), afficher aussi `Avancement` à l'état « conseillée » avec `faites=0` (barre vide + « Étape 1 sur N », donnée et texte `etapeSurTotal` déjà disponibles), ce qui donne un contenu réel à la tuile ; et réduire le gabarit de `SemainesTuile` (`py-3` à `py-2.5`) pour rapprocher les deux hauteurs. Variante si Thomas refuse : `lg:col-span-4` + `lg:col-span-8` n'aide pas ; la barre vide est la bonne piste. Ce qui fait 10 : vide interne < 40 px.

### 3. L'extrait de l'aperçu ne montre pas « Ton cap » à 375 et 768
Capture `visiteur-aujourdhui-375` et `-768` : le masque (`transparent_calc(100%_-_3rem)` + hauteur 320 / 400) ne laisse voir que la tuile du premier pas ; la tuile « Ton cap » est rabotée à 40 px de fondu (768 : une ligne illisible). Or c'est le bloc qui vend la progression et la série. Correction : `extrait-coupe.tsx`, hauteurs mobiles relevées pour contenir Z1 + Z2 : `h-[30rem] md:h-[28rem] lg:h-[27.5rem]` (à 375 : Z1 ~255 + gap 24 + Z2 ~190 + fondu ; à 768 les deux tuiles sont en `md:col-span-2`, donc ~230 + 24 + 150). La spec UX chiffrait 320/400 en supposant un autre empilement : l'écart vient de la mise en page réelle, la hauteur cible suit la valeur à montrer. Ce qui fait 10 : « Ton cap » lisible (nom, 5 segments) à 375 et 768 avant le fondu.

## Pistes (non bloquantes)

1. Réduire le bruit des pastilles Premium : une seule pastille par bloc est exigée par la spec, mais la tuile « Contenu du jour » et « Étape conseillée » pourraient la porter en `text-[11px]`... ou on garde. Le choix est du goût de Thomas.
2. `cartes-du-jour.tsx` : placer le titre « Si tu as 5 minutes » au-dessus de la phrase d'accroche, et la phrase en `text-sm` sous le titre.
3. Pastille orpheline : réduire à 5 pastilles dans `PASTILLES_AUJOURDHUI` (`tableau-verrouille.tsx`) ou passer `lg:col-span-7` à `lg:col-span-8` dans `hero-apercu.tsx` (5/4 au lieu de 7/5 inutile : la carte d'offre tient dans 4 colonnes). Aucun texte nouveau.
4. Vérifier au code que `LIEN` donne bien une hauteur de 44 px à « Connexion » (`min-w-11` ne règle que la largeur) : ajouter `min-h-11` dans `offre-apercu.tsx`.
5. `Reassurance` : forcer `text-xs text-text-muted` via `className` dans `offre-apercu.tsx` pour que la phrase d'objet (gratuit) ne soit pas dominée par la réassurance.
6. « Tes 4 premières semaines » : texte à faire valider par Thomas, les lignes commencent par un fragment en minuscule alors que « Semaine n : » est caché visuellement. Piste codable sans réécrire : afficher « Semaine n » en `text-xs uppercase text-text-muted` au-dessus du libellé (texte déjà dans `l.semaine`).
7. À 1920 la coque reste à 1216 px : 352 px de noir de chaque côté, le halo est à peine perceptible (72 px de haut, 10 %). Arbitrage de la spec, pas une faute ; si Thomas trouve que « ça ne remplit pas », augmenter `before:h-72` à `before:h-[28rem]` sur le conteneur de page.

NOTE GLOBALE : 6/10

Fautes dures :
1. Z1 et Z2 creuses de ~85 px à 1280+ (min-h 14.5rem de `CARTE_ACTION`) : `apps/web/src/components/espace/aujourdhui/tableau.tsx` (+ `action-du-jour.tsx`).
2. Tuile « Étape conseillée » du nouvel abonné vide à moitié (~150 px de vide) : `apps/web/src/components/espace/aujourdhui/etape-en-cours.tsx` (+ `semaines-tuile.tsx`).
3. Extrait de l'aperçu à 375 et 768 : « Ton cap » invisible (hauteurs 320/400 trop basses) : `apps/web/src/components/espace/apercu/extrait-coupe.tsx`.
