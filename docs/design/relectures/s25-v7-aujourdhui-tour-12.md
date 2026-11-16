# Relecture design à l'aveugle, « Aujourd'hui » s25 v7, tour 12

Preuves : 20 captures pleine page (4 comptes x 375, 768, 1280, 1456, 1920) ouvertes à 375, 768, 1280 et 1920 pour les 4 comptes (visiteur, gratuit, en-cours, nouvel) ; code lu : `typo.ts`, `tableau.tsx`, `action-du-jour.tsx`, `premier-pas.tsx`, `hero-apercu.tsx`, `offre-apercu.tsx`, `extrait-coupe.tsx`, `tableau-verrouille.tsx`. Non relus en détail (jugés au rendu seulement) : `cap-du-jour`, `contenu-du-jour`, `etape-en-cours`, `semaines-tuile`, `hero` de l'abonné.

## 0. Verdict d'ensemble (la question de Thomas)

Oui, la page est élégante et harmonieuse. Quatre tailles, deux graisses, deux gris, un rayon, un rythme de 8 px : la page se lit comme une seule famille, proche de l'accueil (même coque 1216 px, mêmes cartes sombres sans ombre). L'abonné a une vraie hiérarchie (carte d'action teintée, cap à droite, tuiles, contenu du jour) et le nouvel abonné n'a plus de page morte (cap 1, étape conseillée, « Tes 4 premières semaines »). Le visiteur lit « fermé » au premier coup d'œil (pastille Premium, verrous, bouton éteint en contour, fondu, bouton d'offre en haut à droite).

Ce qui retient d'écrire « niveau produit très soigné » sans réserve : elle est sobre jusqu'à la retenue côté prospect. Le hero (H1 30 px, promesse grise d'une ligne, six pastilles grises, preuve) est propre mais peu désirable ; l'envie vient du bouton et de l'extrait, pas d'un moment qui accroche. C'est une page qui rassure plus qu'elle ne donne envie. Pas une faute dure, un plafond.

## 1. Gate typographique MESURÉE (citée de `TAILLES.md`, tour 12)

Sortie de `tailles-comptes.mjs`, 16 lignes (4 comptes x 375, 768, 1280, 1920), premier écran de `main` :
- 375 et 768 : 4 tailles (24, 20, 16, 14), 6 combinaisons, pour les 4 comptes.
- 1280 et 1920 : 4 tailles (30, 20, 16, 14), 6 combinaisons, pour les 4 comptes.
- Combinaisons : 24 ou 30/600 display, 20/600 display, 16/400, 16/600, 14/400, 14/600 ; aucune capitale ; graisses 400 et 600 seulement.

Verdict : **PASS** (seuils : plus de 4 tailles ou plus de 6 combinaisons = faute dure ; ici 4 et 6, au plafond, sans marge). Vérifié au code : `typo.ts` est la source des 7 constantes, aucune autre taille. Toute correction de ce document qui ajouterait une taille ou une combinaison serait une faute dure : les pistes ci-dessous n'en ajoutent aucune. Réserve de méthode : la mesure couvre le premier écran ; sous le pli de l'abonné, « Karim Duval... » et « L'humour de trentenaire... » sont en 16/600 souligné (dans l'échelle), rien d'autre ne sort à l'œil.

## 2. Règle d'accent

- Abonné (en-cours, nouvel) : un seul aplat violet par écran, le bouton plein de Z1 (« Les cartes du jour », « Commencer »). Z1 porte teinte `accent-primary/10` et bord `accent-primary/40` (`CARTE_ACTION`), autorisé. Aucun autre violet dans la page (barres et segments gris, `bg-text-secondary`). PASS. Le point violet de la cloche est dans l'en-tête, hors périmètre.
- Aperçu (visiteur, gratuit) : aucun violet hors bouton d'offre ; Z1 figée prend `TUILE` neutre, bouton éteint en contour gris. Le bouton d'offre existe deux fois (hero, fin d'extrait) : jamais ensemble au premier écran (1280 x 900 : hero à y 202, fin à y 987 ; 375 et 768 aussi). PASS. Le bouton de l'en-tête global double celui du hero au premier écran : hors périmètre, signalé seulement.

## 3. Lecture par compte

**Visiteur et gratuit (aperçu).**
- 1280 et 1920 : hero 8/4, offre dans une carte encadrée en haut à droite, bouton plein à y 202. Premier pas (7 col.) et Ton cap (5 col.) entiers, rangée de 3 tuiles coupées par le fondu, « La suite est dans Premium » + bouton centré. Pas de vide mort ; le bas du hero à gauche (preuve) et la carte d'offre finissent à 17 px près.
- 768 : hero 3/2, pastilles en 2 lignes 4 + 2, offre à droite avec la preuve dans la carte, Premier pas pleine largeur, Cap pleine largeur, 2 tuiles coupées, fin d'extrait. Sous la rangée de pastilles, environ 110 px vides à gauche (la carte d'offre est plus haute) : vide de fin de colonne, permis.
- 375 : H1 et pastille Premium sur une ligne, promesse, preuve, carte d'offre pleine largeur, légende, Premier pas entier (bouton éteint pleine largeur), Ton cap entier, début d'Étape conseillée coupé, fin d'extrait. Le premier écran 375 x 812 contient le bouton d'offre et la première tuile. Bon.
- Gratuit : même mise en page, la phrase d'objet (« Premium ouvre tout... ») s'ajoute dans la carte. Cohérent avec le visiteur.
- « Se lit fermé » : oui. Deux signaux jouent seuls au premier coup d'œil (bouton éteint en contour, verrous) et deux le confirment (fondu, texte de fin). Je ne crois pas qu'on se croie dedans.

**Nouvel abonné.** 1280 : titre + date, Premier pas (violet doux, bouton plein bas droite, scène à gauche) à côté de Ton cap, puis Étape conseillée 5 col. + « Tes 4 premières semaines » 7 col. à hauteur égale, puis Contenu du jour (vanne et conseil empilés à gauche, vidéo à droite, mêmes hauteurs). Plus de page morte. 768 : tout en bandeaux, très lisible. 375 : 6 blocs empilés, Premier pas entier au premier écran avec le bouton.

**Abonné avancé.** 1280 : Z1 « Si tu as 5 minutes » (bouton plein, accroche, deux cartes Nouvelle et À revoir) 8/12, Ton cap (cap 2 sur 5, 250 XP, 1 jour, aide) 4/12, rangée Étape en cours 5/12 + Mission 7/12, Contenu du jour, question « Où veux-tu être plus à l'aise ? » sur toute la largeur. Série et progression visibles. Dense, mais chaque bloc a son titre en 20/600 et la hiérarchie tient.

**1920.** Même rendu que 1280 (coque plafonnée), marges latérales de 352 px. Identique à l'accueil, donc cohérent ; pas un défaut.

## 4. Mesures au code (contrastes, cibles)

- Pied de tuile `min-h-12` (48 px), « Connexion » `min-h-11 min-w-11` (44), boutons `buttonVariants lg` (48), « Une autre » et puces de la question mesurés à 44 px sur capture : cibles OK. Les lignes de l'extrait sont inertes (`inert`, `aria-hidden`), donc exemptées.
- Contraste : `text-secondary` #B3B3B3 sur carte 7:1 ; atténué à 0,75 dans l'extrait environ 5:1 sur #1F1F1F ; sous la teinte de Z1, 7,08:1 et 4,66:1 atténué (mesures annoncées en commentaire de `tableau.tsx` par le test e2e ; non recalculées par moi). Les libellés de tuiles fermées sont plus pâles mais restent au-dessus de 4,5:1 par calcul. Bouton éteint de Z1 de l'aperçu : texte gris secondaire sans atténuation (`nette`), 7:1.
- Verrous seuls (icônes) sur chaque tuile fermée : décoratifs, le mot « Premium » existe une fois dans le hero ; conforme à la spec design §2.2.

## 5. Notes par critère

| Critère | Note | Défaut précis et correction codable |
|---|---|---|
| Design 1, élégance et fidélité à l'accueil | 9 | Palette, rayons, coque identiques. Hero de l'aperçu sans le moindre moment de chaleur (pas d'image, pas de visuel produit hors tuiles grises). Piste : aucune qui ajoute une taille ; si Thomas veut plus de désir, une vignette de la vanne du jour dans l'offre, c'est du contenu (hors de mon périmètre) |
| Design 2, hiérarchie | 9 | Le bouton plein domine bien chez l'abonné et le visiteur. Côté abonné en-cours, Z1 porte quatre sous-blocs (accroche, compteur, deux cartes imbriquées avec chevrons) : lecture à deux niveaux de cadres. Piste : `contenu` des cartes Nouvelle / À revoir sans cadre propre (`divide-x`) dans `etape-en-cours` ou le composant de la rafale |
| Design 3, usage de la largeur aux 5 largeurs | 9 | Aucun vide au milieu d'un bloc relevé, aucune tuile creuse, aucun débordement. Pistes : (a) Z1 de l'aperçu 1280 et 1920, la scène (4 lignes) laisse un creux de 256 x 72 px au-dessus du bouton, à droite (L formé par le texte et le bouton) : lisible comme voulu, mais c'est la limite du « vide au milieu » ; (b) en-cours 1280, rangée 2 en 5/7 (Étape 465 px, Mission 660 px) alors que la spec disait 6/6 pour deux tuiles |
| Design 4, cohérence entre comptes | 8 | Z1 n'a pas le même agencement selon le compte : en-cours, bouton à gauche sous le titre, accroche dessous ; nouvel et aperçu, scène à gauche et bouton bas droite. Même carte, deux grammaires de bouton, et c'est le point focal. Correction : `action-du-jour.tsx`, appliquer le même placement au cas rafale (`apres`), ou conserver le bouton à gauche pour tous (retirer `md:self-end` et `md:flex-row` de `data-premier-pas-scene`) |
| Design 5, finition au pixel | 9 | Alignements nets (coque 1216, gouttières 24, pas de 8), 44 px tenus. Détail : légende « Voici un exemple... » à environ 83 px sous la carte d'offre et 24 px au-dessus des tuiles à 1280 (`lg:mt-16` + `lg:mb-6`), elle se rattache bien à l'extrait mais la bande reste notable. Piste : `lg:mt-12` si le bouton de fin reste sous le pli |
| UX 1, prospect : envie en 3 secondes | 8 | Fermé lisible, offre en haut, une seule offre : acquis. Mais promesse (T1) et pastilles grises se lisent comme un cahier des charges ; la preuve « 1 500+ » est loin du bouton à 1280 (à gauche, bouton à droite) alors qu'elle est dans la carte à 768. Correction : `hero-apercu.tsx` / `offre-apercu.tsx`, faire entrer `Preuve` dans la carte d'offre dès 1024 aussi (retirer `lg:hidden` et le `lg:block` du hero) ; la hauteur à 1280 est compensée par la carte, plus haute |
| UX 2, abonné : clarté | 9 | Une action dominante par écran. Piste : en-cours, « Les cartes du jour » est un bouton court (240 px) dans une carte de 660 px, il se lit moins comme l'action que « Commencer » |
| UX 3, abonné : envie de continuer | 9 | Cap, XP, série, étape n sur N, semaines à venir. Rien ne manque. |
| UX 4, nouvel abonné | 9 | Jamais une page morte : cap 1, étape conseillée, 4 semaines. |
| UX 5, accessibilité et cohérence | 9 | Cibles et contrastes OK au code ; extrait inerte ; une seule marque Premium. |

## 6. Fautes dures

Aucune. Gate typographique PASS (4 tailles, 6 combinaisons, 16 lignes), accent unique respecté, aucun vide au milieu d'un bloc, aucun débordement aux largeurs vues.

Sous la barre de 9 : le critère 4 (cohérence entre comptes, 8) et UX 1 (envie du prospect, 8). Ces deux critères sont des pistes, pas des fautes dures ; si Thomas fixe la barre à 9 sans exception, ce sont les deux points à retoucher.

NOTE GLOBALE : 8/10

Fautes dures : aucune.
