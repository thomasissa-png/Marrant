# Relecture UX à l'aveugle, « Aujourd'hui », s25 v7 tour 7

Périmètre : captures `docs/captures/s25/v7-aujourdhui-tour-7/aujourdhui/` (4 comptes ; 375 pleine page et premier écran, 768, 1280, 1920 ouverts pour le visiteur, 1280 pour les trois autres, 375 pour les abonnés), `TAILLES.md`, code de `apercu/{hero-apercu,extrait-coupe,offre-apercu}.tsx`. Aucune relecture antérieure lue. Non relu au code : `tableau-verrouille.tsx`, `mon-espace/page.tsx`, `aujourdhui/**` (jugés sur capture).

## 1. Gate typographique MESURÉE (bloquante)

Citée de `TAILLES.md` (premier écran de `main`, 375 x 812 et 1280 x 900, 4 comptes) :

| Compte | Largeur | Tailles | Combinaisons | Verdict |
|---|---|---|---|---|
| visiteur | 375 | 4 (24, 20, 16, 14) | 6 | PASS |
| visiteur | 1280 | 4 (30, 20, 16, 14) | 6 | PASS |
| gratuit | 375 | 4 (24, 20, 16, 14) | 6 | PASS |
| gratuit | 1280 | 4 (30, 20, 16, 14) | 6 | PASS |
| abonné avancé | 375 | 4 (24, 20, 16, 14) | 6 | PASS |
| abonné avancé | 1280 | 4 (30, 20, 16, 14) | 6 | PASS |
| nouvel abonné | 375 | 4 (24, 20, 16, 14) | 6 | PASS |
| nouvel abonné | 1280 | 4 (30, 20, 16, 14) | 6 | PASS |

Seuils : > 4 tailles ou > 6 combinaisons = faute dure. Ici 4 et 6 partout : pas de faute. Les graisses sont 400 et 600 seulement, toutes dans l'échelle du doc design (30/24, 20, 16, 14). Les captures concordent avec la mesure (H1 un cran au-dessus des titres de carte, aucune capitale dans `main`, chiffres « 1 500+ », « 250 » en 20/600).
Réserves honnêtes : (a) la mesure ne couvre que 375 et 1280 ; 768 et 1920 ne sont pas mesurés, mais ils reprennent les mêmes classes (`TITRE_PAGE` bascule à `lg`). (b) Le gate compte les nœuds `sr-only` (16/400) : il ne cache aucune taille. (c) Les capitales « PRODUIT », « LÉGAL » du pied de page sont hors périmètre (pied global). Aucune correction proposée n'ajoute une taille.
Accent violet : un seul dans `main` (le bouton plein, plus le bouton de fin d'extrait, même action, jamais visible avec le premier à 1280). Aucun second accent dans `main`. Le bouton « Premium » de l'en-tête global est le même bouton (accepté par la spec design §2.1, hors `main`).

## 2. Constat par compte

### Visiteur et gratuit, 1280 et 1920 (très bon)
- Se lit fermé du premier coup : pastille « Premium » avec verrou, H1, bouton d'offre plein en haut à droite, puis au premier écran les tuiles ternes (`opacity-75`), boutons « Commencer » en contour éteint, verrou nu en coin de chaque tuile, fondu avant le bas. On ne se croit pas dedans. Une seule offre, un seul plein.
- La page utilise la largeur : hero 8/4, rangée 8/4 (premier pas | cap), rangée 4/4/4. À 1920 la coque reste à 1216 px (marges de 352 px) : cohérent avec l'en-tête et l'étalon d'accueil, c'est l'arbitrage de la spec, donc piste et non faute.
- Gratuit : même rendu que visiteur, avec la phrase d'objet à la place de « Connexion ». Cohérent.
- Vide permis : sous les pastilles, la colonne de texte du hero reste vide sur environ 110 px à 1280 et 1920 (fin de colonne face à la carte d'offre plus haute). Lecture : c'est de la respiration, pas un trou, car l'offre est à droite et on lit la page en Z. Piste : voir 4.1.
- Fin d'extrait : « La suite est dans Premium », bouton, légende. Lisible, centré, sans rupture.

### Visiteur, 768
Hero en 60/40, offre à droite, extrait en 2 colonnes puis cap en bandeau. Bon. Défaut de finition : les pastilles du hero (3 colonnes `max-content`) ont des intervalles horizontaux irréguliers sur la capture (environ 28 px entre colonnes 1 et 2, environ 64 px entre 2 et 3 : « Série » et « Contenu du jour » flottent à droite de « Ton cap » et « Mission »). Pas un débordement, mais un alignement qui n'est pas au pixel.

### Visiteur et gratuit, 375 (problème)
Premier écran (375 x 812) : pastille, H1, promesse, 6 pastilles en 3 rangées (environ 112 px), carte d'offre complète (bouton, réassurance, preuve, Connexion, environ 280 px). La première tuile de l'extrait n'apparaît qu'à y = 777 : au premier écran on n'en voit que le haut (étiquette « Ton premier pas », « 5 min », verrou, coupés au bord). Le prospect voit un bouton Premium, une pastille et des verrous dans la bande, mais PAS le produit fermé. Le « fermé » se lit par la pastille et la bande, pas par l'extrait, donc moins fort qu'à 1280. La règle 8 du doc design (§4 : au premier écran, au moins une tuile avec son contenu atténué visible) n'est pas tenue à 375. Le bouton, lui, est visible sans défiler (y 470 à 517) : bon.

### Abonné avancé (en-cours), 1280 et 375 (très bon)
- Ordre lu en 3 secondes : étiquette « S'entraîner », titre « Si tu as 5 minutes », le seul bouton plein « Les cartes du jour », une phrase d'explication, puis les deux cartes Nouvelle et À revoir. L'ordre titre, bouton, explication, cartes se comprend : le bouton est tout de suite sous le titre, l'explication est du second niveau, les cartes sont de vrais raccourcis (lignes cliquables entières). Pas de friction.
- Z2 « Ton cap » à droite, même hauteur que Z1 : cap 2 sur 5, 250 XP, série 1 jour, aide. Récompense visible. Envie de continuer : oui.
- Rangée Étape en cours (5) | Mission (7) puis Contenu du jour en 2 colonnes (vanne et conseil empilés, vidéo à droite à hauteur égale) puis question d'aise. Aucun trou au milieu d'un bloc. À 375 : Z1 avec bouton dans le premier écran, ordre du DOM respecté.
- Vides de fin de carte (bas de Z2, bas de Z1) : permis.

### Nouvel abonné, 1280 et 375 (très bon)
- Jamais une page morte : « Ton premier pas » avec « Commencer » (seul plein), cap 1 sur 5, étape conseillée, « Tes 4 premières semaines » (feuille de route), contenu du jour. À 375, bouton à environ 417 px : visible sans défiler. Cohérent avec l'abonné avancé (même coque, mêmes tuiles, mêmes radius).

## 3. Grille de notes

| Critère | Note | Justification |
|---|---|---|
| D1 Élégance, fidélité à l'accueil | 9 | retenue, un seul accent, tuiles sobres ; proche de l'étalon |
| D2 Hiérarchie | 9 | zone dominante (premier pas ou action du jour), un seul plein par écran |
| D3 Largeur aux 5 largeurs | 9 | grilles 12 col, aucune tuile creuse ; marges de 352 px à 1920 par arbitrage de coque |
| D4 Cohérence entre comptes | 9 | mêmes tuiles, mêmes rayons et gouttières entre aperçu et abonné |
| D5 Finition au pixel | 8 | pastilles du hero irrégulières à 768 ; cibles et contrastes corrects au code (`min-h-11` sur Connexion, `size="lg"`, `META` 7:1) |
| U1 Prospect : envie en 3 s | 7 | fermé et offre excellents à 1280 ; à 375 le produit fermé n'est pas au premier écran |
| U2 Abonné : clarté | 10 | action, bouton, explication, cartes dans le bon ordre |
| U3 Abonné : envie de continuer | 9 | cap, XP, série, étape, mission visibles ; à 1 jour de série l'aide reste un peu longue (piste) |
| U4 Nouvel abonné | 9 | feuille de route des 4 semaines, cap 1, étape conseillée |
| U5 Accessibilité, cohérence | 9 | extrait `inert` et `aria-hidden`, cibles 44 px, un seul H1 ; rien lu au code pour les tuiles de l'abonné |

NOTE GLOBALE = minimum = 7, tenue par U1 (faute dure 1). Barre de 9 non atteinte.

## 4. Corrections codables

### Faute dure 1 : à 375, la première tuile de l'extrait est quasi hors du premier écran (fichier : `apercu/hero-apercu.tsx`, `apercu/extrait-coupe.tsx`, `apercu/offre-apercu.tsx`)
Défaut (captures `visiteur-aujourdhui-ecran-375.png`, `gratuit-aujourdhui-ecran-375.png`) : 3 rangées de pastilles + carte d'offre haute poussent la tuile à y = 777 sur 812. Correction codable, sans nouvelle taille de police :
- `hero-apercu.tsx` : sous 768, rendre les pastilles en une seule ligne défilante (`flex flex-nowrap gap-2 overflow-x-auto [scrollbar-width:none]`, bords `-mx-4 px-4`, `shrink-0` sur chaque `li`) à la place de `grid-cols-[repeat(2,max-content)]`. Gain environ 80 px : la tuile « Ton premier pas » commence vers y = 700 et on en voit environ 110 px (étiquette, titre de scène). Les pastilles redoublent les titres des tuiles, donc rien d'essentiel n'est caché.
- Variante sans défilement (si Thomas refuse le défilement horizontal) : `extrait-coupe.tsx` `mt-12` devient `mt-8` sous `md`, `hero-apercu.tsx` `gap-8` devient `gap-6` sous `lg`, `offre-apercu.tsx` `Preuve` en `mt-4 pt-4` sous `md`. Gain environ 40 px : étiquette et première ligne du titre visibles. Moins bon, mais respecte le rythme de 8 px (`mt-8`, `gap-6`, `mt-4`, `pt-4` sont des pas autorisés).
- Ce qui ferait 10 : à 375 x 812, au moins 100 px de la tuile « Ton premier pas » (étiquette, scène, début du bouton éteint) visibles avec le bouton d'offre, et le test navigateur « se lit fermé » (règle 8) vérifié à 375.

### 4.1 Pistes (non fautes)
1. 768, pastilles du hero (`hero-apercu.tsx`, ligne de la `ul`) : intervalles de colonnes irréguliers ; passer à `grid-cols-3` sur la largeur du conteneur avec `justify-items-start`, ou à `flex flex-wrap gap-2` avec `max-w-md`, pour que l'espacement soit uniforme. Ferait D5 = 9 ou 10.
2. 1280 et 1920 : environ 110 px de vide sous les pastilles du hero, à gauche de la carte d'offre. Permis (fin de colonne). Si on veut le réduire sans grossir un texte : `lg:items-center` sur la colonne gauche du hero, ou `lg:mt-8` entre promesse et pastilles (pas autorisé : le doc design fixe `mt-6`), donc ne pas y toucher ; laisser tel quel.
3. Extrait : la tuile « Contenu du jour » n'a pas d'étiquette, donc son titre à la hauteur des autres titres laisse un haut de tuile plus vide (environ 35 px) que ses voisines. Défaut léger, pas de texte à inventer ; acceptable.
4. Abonné avancé : pied de la tuile « Étape en cours » (filet et « Reprendre ») et pied de la tuile « Mission » (pastille « Facultative » et chevron seul) n'ont pas la même facture. Harmoniser avec un `PIED_TUILE` commun (filet `border-t border-border`, `min-h-12`) sur les deux. Les lignes du texte de la mission, à 7 colonnes, sont longues (environ 85 caractères) : `max-w-prose` sur l'accroche.
5. Série à 1 jour : l'aide « Un jour compte quand tu valides une étape… » occupe 2 lignes et alourdit Z2 ; à garder (texte validé), mais pourrait passer sous `META` seulement après 7 jours (décision produit).

## 5. Fautes dures

Une seule faute dure, hors gate typographique (PASS 8/8) :

1. À 375 px (visiteur et gratuit), la première tuile de l'extrait n'est pas lisible au premier écran : le produit fermé n'est pas visible, la règle « se lit fermé » (design §4.8) n'est pas tenue. `apps/web/src/components/espace/apercu/hero-apercu.tsx` (pastilles en une ligne), puis `extrait-coupe.tsx` et `offre-apercu.tsx` si variante.

NOTE GLOBALE : 7/10

Liste numérotée des fautes dures :
1. Visiteur et gratuit, 375 : première tuile de l'extrait hors du premier écran (pastilles en 3 rangées + carte d'offre haute, tuile à y = 777 sur 812) : `apps/web/src/components/espace/apercu/hero-apercu.tsx` (pastilles sur une ligne sous 768), à défaut `extrait-coupe.tsx` (`mt-8` sous `md`) et `offre-apercu.tsx` (`Preuve` en `mt-4 pt-4` sous `md`).
