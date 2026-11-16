# Relecture UX à l'aveugle, « Aujourd'hui », s25 v7 tour 10

Périmètre : `main` de la page, 4 comptes (visiteur, gratuit, en-cours, nouvel), captures 375, 768, 1280, 1920 (pleine page et premier écran, 1456 non ouverte car identique à 1280 par construction de la coque). En-tête global et bande des rubriques hors périmètre. Aucune relecture antérieure lue. Étalon : `etalon-accueil/visiteur-accueil-1280.png`.

Règle d'accent appliquée (celle du prompt) : abonné, la carte qui contient le bouton plein peut avoir teinte et bord violet doux ; aperçu, aucun violet hors du bouton d'offre.

## 1. Gate typographique mesurée (bloquante)

Citée de `TAILLES.md` (script `tailles-comptes.mjs`, premier écran, `main` seulement) :

| Compte | 375 | 768 | 1280 | 1920 |
|---|---|---|---|---|
| visiteur | 4 tailles (24, 20, 16, 14) / 6 combinaisons | 4 (24, 20, 16, 14) / 6 | 4 (30, 20, 16, 14) / 6 | 4 (30, 20, 16, 14) / 6 |
| gratuit | 4 / 6 | 4 / 6 | 4 / 6 | 4 / 6 |
| en-cours | 4 / 6 | 4 / 6 | 4 / 6 | 4 / 6 |
| nouvel | 4 / 6 | 4 / 6 | 4 / 6 | 4 / 6 |

Les 16 lignes sont à 4 tailles et 6 combinaisons au plus (30/600 ou 24/600, 20/600, 16/400, 16/600, 14/400, 14/600), graisses 400 et 600, aucune capitale. Tout est dans l'échelle de `typo-harmonie-espace-s25.md` §1. **Gate PASS, pas de faute dure typographique.** Réserve de méthode : la mesure ne couvre que le premier écran ; sous le pli, les captures ne montrent visuellement rien hors échelle (« Contenu du jour », C9, pied de tuile), mais ce n'est pas mesuré. Le tour 10 n'ajoute aucune taille (légende de l'aperçu en `META` 14/400, « Tes 4 premières semaines » passée en `ETIQUETTE` 14/600) : correct, et je n'ai aucune correction à proposer qui en ajoute.

Violet (vérifié capture et code `tableau.tsx`, `offre-apercu.tsx`, `hero-apercu.tsx`, `extrait-coupe.tsx`) :
- Aperçu : seul aplat = bouton d'offre (hero) ; la carte d'offre est neutre (`border-border-hover`), pastille « Premium » neutre, Z1 figée en `TUILE`. PASS. Le second bouton plein (fin d'extrait) est le même, hors premier écran à 1280 et 1920 (y 976 pour 900 de haut), jamais vu avec le premier. Le bouton violet de l'en-tête global est le même bouton, hors périmètre.
- Abonné : un aplat (« Commencer » ou « Les cartes du jour »), carte Z1 teintée `accent-primary/10` avec bord `accent-primary/40` (permis). Barres, cap, flamme, pieds de tuile neutres. PASS. Le point violet de la cloche (en-tête, comptes en-cours) est hors périmètre.

## 2. Ce que montrent les captures

**Visiteur / gratuit, 1280 (et 1920)** : colonne gauche pastille, H1 30 px, promesse, 6 pastilles, « 1 500+ » ; carte d'offre à droite, bouton plein en haut (y 202) ; légende « Voici un exemple… » ; extrait en grille 8/4 puis 3 colonnes, verrous nus, bouton « Commencer » en contour éteint, contenu à `opacity-75`, fondu vers le fond, « La suite est dans Premium » + 2e bouton, pied de page. L'ensemble se lit fermé : pastille mot, verrous, bouton éteint, fondu coupant les tuiles de la rangée 2. On voit le produit (premier pas, cap, étape, mission, contenu du jour) dès le premier écran. À 1920 la coque reste à 1216 px (marges de 350 px de chaque côté) : alignée sur l'en-tête, arbitrage documenté, pas un vide mort.

**Visiteur / gratuit, 375** : H1 et pastille « Premium » sur une ligne, promesse, 6 pastilles sur 2 lignes, carte d'offre avec bouton pleine largeur (y 374 / 812), réassurance, preuve, « Connexion » (visiteur) ; légende à y 620 ; première tuile de l'extrait à y 650 : on voit « Ton premier pas », « 5 min », le verrou et le titre sur 3 lignes ; le bouton éteint est coupé par le pli. Gratuit : la carte d'offre est plus haute (phrase d'objet + réassurance, deux phrases qui commencent par « Premium »), la tuile démarre à y 660.

**Abonné en-cours, 1280/1920** : titre à gauche, date ; Z1 (teinte violette, « Si tu as 5 minutes », bouton plein « Les cartes du jour », deux lignes Nouvelle / À revoir) 8/12 ; Z2 « Ton cap » 4/12 de même hauteur avec 250 XP, série 1, aide ; rangée 2 : Étape en cours (barre, « Reprendre ») et Mission ; « Contenu du jour » (vanne + conseil empilés à gauche, vidéo à droite) ; C9 pleine largeur. Aucun trou au milieu d'un bloc ; vides de fin de carte seulement (bas de Z2 environ 70 px).

**Nouvel, 1280/1920** : Z1 premier pas (bouton plein) 8/12 + Z2 cap 1 sur 5 / série à démarrer 4/12 ; rangée 2 : Étape conseillée (5/12) + « Tes 4 premières semaines » (7/12) ; contenu du jour. 375 : Z1 avec le bouton à y 417/812 (au premier écran), puis cap, étape, semaines, contenu.

## 3. Grille

### Design

| Critère | Note | Défaut précis et correction |
|---|---|---|
| 1 Élégance, fidélité à l'accueil | 8 | La page est sobre et cohérente (une échelle, un accent). Mais l'étalon accueil a des accents violets de titre et des filets de tuile ; ici l'aperçu est entièrement gris sur gris, ce qui est la règle imposée, donc pas une faute. Ce qui manque pour 10 : la vue produit de l'aperçu est entièrement délavée (`opacity-75` + fondu) ; une tuile garderait de la netteté sans violet si la tuile Z1 figée passait à `opacity-100` (fichier `tuile-fermee`/`tableau-verrouille.tsx`, piste, à juger sur contraste du bouton éteint). |
| 2 Hiérarchie (une zone dominante, un accent) | 8 | Abonné : Z1 domine par la teinte, la place et le bouton, mais son titre est en 20/600 comme les autres cartes et la carte est de même hauteur que Z2 : la dominance tient surtout à la teinte (piste : rien de plus à faire côté taille, c'est l'échelle). Aperçu : la carte d'offre et son bouton dominent bien ; pas de défaut. |
| 3 Largeur aux 5 largeurs | 8 | 1280 et 1920 : grilles 8/4, 5/7 ou 3 colonnes, aucune tuile creuse. 768 en-cours : Étape en cours et Mission sont chacune pleine largeur (spec : Z3 \| Z4 en 2 colonnes à 768) ; la mission court sur environ 95 caractères par ligne et la barre d'étape s'étire sur 400 px avec « Étape 3 sur 3 » à l'extrême droite. Piste : `md:grid-cols-2` sur la rangée Z3 \| Z4 dans `mon-espace/page.tsx`. Nouvel 768 : barre de 480 px pour « Étape 1 sur 4 », même remarque. 1920 : coque 1216 px, voulu. |
| 4 Cohérence entre comptes | 9 | L'extrait de l'aperçu reprend la grille du nouvel abonné à 1280 (mêmes places, mêmes tuiles) : le prospect voit le produit exact. Écarts mineurs : la pastille « Premium » est au-dessus du H1 à 1280 et à droite du H1 à 375 ; la preuve « 1 500+ » est dans la carte d'offre à 375/768 et sous les pastilles à 1280. Voulus, sans gêne. |
| 5 Finition au pixel | 8 | Cibles : « Connexion » `min-h-11 min-w-11` (code `offre-apercu.tsx` l. 87), pieds de tuile `min-h-12`, boutons `h-12` : OK. Contrastes : texte secondaire 7:1, atténué dans l'extrait 4,66:1 selon le commentaire de `tableau.tsx` (non remesuré par moi). Défaut visible : à 768 en-cours, dans la carte Z2 en bandeau, l'étiquette « Ton cap » (y 473) n'est pas alignée sur le haut de « 250 » (y 461), 12 px d'écart (les deux groupes sont centrés verticalement au lieu d'être calés en haut) : `items-start` sur la ligne du bandeau dans `cap-du-jour.tsx`. |

### UX

| Critère | Note | Défaut précis et correction |
|---|---|---|
| 1 Prospect : envie en 3 s, fermé lisible, valeur visible, offre en haut, une offre | 7 | « Fermé » : lu au premier coup d'œil à 375 comme à 1280 (pastille, verrous, bouton éteint, fondu). Offre en haut : oui, une seule (bouton plein). Valeur visible : à 1280 oui, 5 tuiles dès le premier écran. À 375 non assez : la carte d'offre et 6 pastilles occupent 650 px sur 812, une seule tuile apparaît, tronquée, son bouton éteint sous le pli ; en gratuit (660 px) c'est pire. Envie : le contenu est tout en gris atténué et la promesse (T1) reste fonctionnelle ; rien n'invite émotionnellement (l'accueil, lui, a du ton et du relief). Pour 10 : (a) à 375, retirer les 6 pastilles du flux visuel (`sr-only` sous 768, `hero-apercu.tsx` : `hidden md:flex` sur la liste mais leur contenu reste lu par la promesse ; elles dupliquent l'extrait) pour gagner environ 60 px ; (b) à 375, faire sortir « 1 500+ » de la carte (`Preuve` `place="hero"` visible dès le mobile) pour gagner environ 70 px ; la première tuile entière dont le bouton éteint serait au premier écran. Piste, pas faute dure : le prospect voit déjà produit et bouton d'offre. |
| 2 Abonné : je sais quoi faire en 3 s | 9 | Une carte teintée avec un seul bouton plein, en premier, dès le haut de page à tous les formats (375 : bouton à y 360 en-cours, 417 nouvel). « Étape 3 sur 3 » avec une barre à environ 2/3 (en-cours) se lit contradictoire : étape non finie mais « 3 sur 3 » ; texte signalé, pas réécrit (à vérifier : c'est « étape en cours », 3e de 3, ce que la barre à 2 faites sur 3 dit ; reformuler est l'affaire de Thomas). |
| 3 Abonné : envie de continuer | 8 | Cap 5 segments, XP, série avec flamme, mission « Facultative », contenu du jour : la récompense est visible. Faible : la série de l'abonné « avancé » vaut 1 jour pour 250 XP (donnée de la fixture, à confirmer qu'elle représente bien un J30), et la flamme est grise : la série ne « brille » pas. Aucune correction de taille ; piste : n'afficher la série qu'à partir de 2 jours et sinon l'aide seule. |
| 4 Nouvel abonné : jamais morte | 9 | Premier pas, cap 1 sur 5, série à démarrer sans reproche, étape conseillée, feuille de route des 4 semaines, contenu du jour : aucune zone vide, le premier écran à 1280 et à 375 est plein. Rien à corriger de dur. |
| 5 Accessibilité visible et cohérence | 8 | Cibles 44 px au code, focus en anneau intérieur sur les pieds de tuile, un seul H1, extrait inerte. Le bouton éteint (contour, `aria-disabled`) est lisible comme inactif. Réserve : 14/400 gris sur les lignes « Semaine n » et les eyebrows de l'extrait à 0,75 de transparence reste proche du seuil AA (4,66:1), pas de marge. |

## 4. Points de jugement

- Vides : aucun vide au milieu d'un bloc. Fins de carte seulement (Z1 et Z2 à 1280, bas de la colonne gauche du hero). La légende de l'aperçu à 1280 flotte à 80 px sous le hero et 50 px au-dessus de l'extrait : lue comme titre de l'extrait, acceptable.
- Textes signalés (non réécrits) : « Étape 3 sur 3 » avec barre incomplète ; en gratuit, deux phrases consécutives commencent par « Premium » (phrase d'objet, puis réassurance), lecture lourde.
- T1 et T2 jugés sur leur place : T1 sous le H1, bien placée ; T2 juste avant le second bouton, bien placée.

## 5. Verdict

Gate typographique PASS (4 tailles, 6 combinaisons partout). Un seul aplat violet par écran, règle d'accent respectée. Aucune faute dure détectée. Barre de 9/10 non atteinte à cause du critère prospect à 375 (7/10), qui est une piste sérieuse, pas une faute.

NOTE GLOBALE : 7/10

Fautes dures : aucune.

Pistes (non bloquantes) : 1. `hero-apercu.tsx` et `offre-apercu.tsx` (gagner 130 px au premier écran 375 pour montrer une tuile entière) ; 2. `mon-espace/page.tsx` (Z3 \| Z4 en 2 colonnes à 768) ; 3. `cap-du-jour.tsx` (alignement haut de la carte Z2 à 768) ; 4. `tableau-verrouille.tsx` (netteté de la tuile Z1 figée).
