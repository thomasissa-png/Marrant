# Relecture DESIGN à l'aveugle, « Aujourd'hui » s25 v7, tour 2

Vue : captures `v7-aujourdhui-tour-2/aujourdhui/` (pleine page et `*-ecran-*`, comptes visiteur, gratuit, en-cours, nouvel ; 375, 768, 1280, 1920 ouvertes, 1456 jugée par parenté avec 1280/1920), étalon accueil 1280, code listé. Aucune relecture antérieure ni commit lu.

## Constat d'ensemble

La refonte est nettement au niveau de l'accueil : H1 à gauche aligné sur la barre, halo de page visible à 1920, un seul plein par zone côté abonné, cartes `rounded-xl`, bords fins, chiffres XP/série en gros, plus de bloc centré. L'aperçu visiteur se lit « fermé » : pastille Premium partout, tuiles atténuées, fondu, offre en haut à droite avec prix, réassurance, preuve, « Connexion ». Le prospect a le bouton dans le premier écran à 375 (y ≈ 470) et à 1280 (y ≈ 203).

Le point faible est unique et net : **la rangée 2 de l'extrait**, qui ne montre plus rien (voir faute 1).

## Notes par critère

### Design

| # | Critère | Note | Justification |
|---|---|---|---|
| 1 | Élégance, fidélité accueil | 9 | Même famille que l'accueil (filet violet Z1 et Z6, cartes réutilisées, `rounded-xl`, un violet plein). Reste : trois fragments de texte fantômes coupés net (faute 1). |
| 2 | Hiérarchie, un accent fort | 8 | Abonné : Z1 dominante, un seul plein, parfait à 1280 nouvel. Visiteur 1280 : en plissant les yeux, H1, carte d'offre, bouton : bon. Mais au premier écran 1280 le second bouton plein (zone D, y ≈ 877) apparaît avec celui du hero et celui du header : trois pleins identiques (faute 2). En-cours : Z1 « Si tu as 5 minutes » commence par une longue phrase en `text-sm` AVANT le titre, alors que le nouvel a une étiquette en capitales : hiérarchie inversée, incohérente (piste A). |
| 3 | Largeur aux 5 largeurs | 7 | 1280/1456/1920 : grille 8/4 puis 4/4/4 bien tenue, halo présent. Défauts : (a) visiteur, rangée 2 : tuiles sans corps ni bord bas, « Étape 1 sur 4 » flotte seul à droite (x ≈ 310-400, y ≈ 750) et « Vanne du jour » est un fantôme à peine lisible ; (b) 768 nouvel/en-cours : Étape conseillée, Mission, 4 semaines empilées pleine largeur : bandes de 700 px avec le contenu cantonné à gauche (barre d'étapes à 0 sur 420 px, texte « Tes premières répliques » seul) ; (c) 768 : la vidéo du jour devient une dalle de 490 x 280 qui domine toute la page et dépasse en poids Z1 ; (d) ≈ 100 px de noir entre la légende et le pied de page à tous les largeurs visiteur. |
| 4 | Cohérence entre comptes | 8 | Mêmes tuiles, mêmes bords, mêmes textes d'étiquette entre aperçu et abonné nouvel (le prospect reconnaît le produit). Écart : étiquette de Z1 absente en-cours (piste A). |
| 5 | Finition au pixel | 8 | Alignements nets (bord gauche des cartes = barre = H1). Boutons h-12, pieds de tuile `min-h-12`, `puce()` 44 px, anneaux de focus au code. Contrastes : texte de l'extrait atténué sous 3:1 par endroits (inerte, `aria-hidden`, exempté) ; réassurance en `text-xs text-text-muted` OK. « Étape 3 sur 3 » avec barre à 2/3 (en-cours) : le chiffre et la barre se contredisent à l'œil (piste B). |

### UX

| # | Critère | Note | Justification |
|---|---|---|---|
| 1 | Prospect : envie en 3 s | 8 | Offre en haut, un seul prix, preuve, réassurance, verrou lisible AVEC le mot : acquis. Mais la valeur visible se limite à la rangée 1 (Premier pas, Ton cap). Les trois autres blocs (Étape, Mission, Contenu du jour) ne montrent qu'un titre pâle : on ne voit ni la barre, ni la mission, ni les trois contenus. C'est le « ce qu'on achète » le plus fort, et il disparaît. |
| 2 | Abonné : clarté | 9 | « Commencer » / « Les cartes du jour » / « Reprendre » : une action évidente, bouton plein unique, date en tête. |
| 3 | Abonné : envie de continuer | 9 | Cap en segments, XP et série en gros, étape en cours avec barre, mission avec accroche. |
| 4 | Nouvel abonné | 9 | Jamais de page morte : premier pas, cap 1/5, étape conseillée, quatre semaines, contenu du jour. Série éteinte sans « 0 ». |
| 5 | Accessibilité, cohérence | 8 | Extrait inerte + `inert` + `aria-hidden`, promesse et pastilles portent le contenu : bon. Les deux boutons identiques visibles ensemble (faute 2) brouillent le « une seule offre ». |

## Défauts précis et corrections codables

**Faute 1 : rangée 2 de l'extrait illisible.** `SuiteCoupee` (`apercu/extrait-coupe.tsx`) fait `h-40` (160 px) avec un fondu qui finit à `calc(100%-3rem)` : sur 112 px utiles, il ne reste que l'étiquette et le titre. Les tuiles n'ont plus de bas, la barre d'étapes et la ligne « Étape 1 sur 4 » sont à moitié effacées (orphelin à droite), « Contenu du jour » n'affiche qu'un « Vanne du jour » invisible. Correction : `mt-6 h-40` devient `mt-6 h-52 lg:h-56`, le masque reste identique. Cela montre la barre d'étapes, le titre de la mission et les trois lignes de « Contenu du jour » (au moins deux), sans changer le fondu. Ce qui ferait 10 : on lit au moins deux lignes de contenu par tuile avant le fondu. Contrôle à 375 et 768 : la tuile « Étape conseillée » (≈ 180 px) doit montrer sa barre.

**Faute 2 : deux pleins visibles ensemble au premier écran 1280.** Le bouton de la zone D (y ≈ 853-900) entre dans les 900 px du premier écran avec le plein du hero (y ≈ 203) et celui du header. La spec dit qu'ils ne doivent jamais être vus ensemble. La correction de la faute 1 (+48 à +96 px) repousse D à y > 900 à 1280 : c'est le même changement dans `SuiteCoupee`. À re-capturer pour confirmer.

## Pistes (non bloquantes)

A. `aujourdhui/cartes-du-jour.tsx` (Z1 « Si tu as 5 minutes ») : placer la phrase d'accroche sous le titre (`mt-2 text-sm text-text-secondary`) et garder une étiquette `ETIQUETTE_ACTION` en tête, comme `premier-pas.tsx`. Le texte ne change pas, seulement sa place.

B. `etape-en-cours.tsx` : `Avancement` passe `faites={etape.ordre - 1}` : « Étape 3 sur 3 » à 67 %. Soit compter l'étape courante (`etape.ordre`), soit garder la règle et la laisser telle quelle ; à trancher par Thomas, c'est une lecture, pas un bug.

C. 768 : `ContenuDuJour` : la vidéo en dalle pleine largeur écrase la page ; la contraindre (`md:col-span-1` sur 2 colonnes avec la vanne et le conseil empilés en face) ou plafonner la vignette (`md:max-w-xl`). Le fond uni de la vignette est hors périmètre.

D. 768 : Z3 et Z4 pleine largeur (choix du tour 2, assumé) : pour que la bande ne sonne pas creuse, ranger barre et libellé sur une seule ligne `md:flex` avec l'étape à gauche et le pied à droite. Piste de composition, pas une faute.

E. Bas de page visiteur : retirer 48 à 64 px entre la légende et le pied (padding bas de `ApercuVerrouille`) pour que la page ne finisse pas sur du noir.

F. Z4 mission : bon (accroche, « Facultative », chevron), rien à changer.

## Ce qui est à 10

Abonné nouvel 1280 et en-cours 1280 : alignements, rythme vertical, deux zones de poids différents, un plein, cohérence avec l'accueil. Hero visiteur 375 : bouton en pleine largeur à y ≈ 470 dans le premier écran.

NOTE GLOBALE : 7/10

Fautes dures :
1. Rangée 2 de l'extrait aperçu illisible (tuiles sans corps, texte fantôme coupé) : `apps/web/src/components/espace/apercu/extrait-coupe.tsx` (`SuiteCoupee`, `h-40` à `h-52 lg:h-56`).
2. Second bouton plein (zone D) visible avec celui du hero dans le premier écran 1280 : même fichier, même correction (repousse D sous 900 px), à re-capturer.
