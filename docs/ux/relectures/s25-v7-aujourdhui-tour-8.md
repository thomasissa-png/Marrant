# Relecture UX à l'aveugle : « Aujourd'hui », s25 v7, tour 8

Périmètre : `/mon-espace`, 4 comptes (visiteur, gratuit, en-cours, nouvel), captures `docs/captures/s25/v7-aujourdhui-tour-8/aujourdhui/`. Ouvertes : écran et pleine page à 375, 768, 1280, 1920 (visiteur : 375, 768, 1280, 1920 ; gratuit : 375, 1280, 1920 ; en-cours : 375, 768, 1280, 1920 ; nouvel : 375, 768, 1280, 1920). 1456 non ouvert (même rendu que 1280 par construction de la coque). Code relu : `hero-apercu.tsx`, `offre-apercu.tsx`. Les autres fichiers ont été jugés sur captures seulement : cibles 44 px confirmées au code uniquement pour le bouton d'offre et « Connexion » (`min-h-11`).
Hors périmètre respecté : en-tête global et son bouton Premium, bande des rubriques, vignettes vidéo en dégradé.

## 1. Gate typographique MESURÉE (`TAILLES.md`, même dossier)

Citation : « Tour 8 : aucune taille ni graisse ajoutée. [...] Gate PASS sur les 16 lignes ; aucune capitale ; graisses 400 et 600 seulement. »

| Compte | 375 | 768 | 1280 | 1920 |
|---|---|---|---|---|
| visiteur, gratuit, en-cours, nouvel | 4 tailles (24, 20, 16, 14), 6 combinaisons | idem | 4 tailles (30, 20, 16, 14), 6 combinaisons | idem |

- Seuils du brief (plus de 4 tailles OU plus de 6 combinaisons = faute dure) : **PASS sur 16/16**. Échelle de `typo-harmonie-espace-s25.md` §1 respectée : 14, 16, 20, 24 ou 30 ; 400 et 600 ; zéro capitale.
- Contre-lecture visuelle : rien d'évidemment hors échelle sur les 20 captures de premier écran (le « 1 500+ » est en 20/600, les chiffres XP et série en 20/600).
- Limite à connaître : le script mesure UN état par compte. L'abonné « rafale faite, Z1 = étape » et « revenant après 30 jours » ne sont pas mesurés. Le 1456 non plus. Ce n'est pas une faute, c'est un trou de preuve (piste P6).
- Accent violet : un seul aplat par premier écran de `main` (bouton d'offre du hero chez visiteur et gratuit ; « Commencer » ou « Les cartes du jour » chez les abonnés). La teinte et le bord violet de la carte Z1 sont admis par la consigne (point focal). Le second bouton d'offre (« La suite est dans Premium ») n'est jamais visible avec le premier. **PASS.**

## 2. Lecture par persona (3 secondes)

**Prospect (visiteur et gratuit).**
- 375 : le premier écran montre pastille « Premium » avec verrou à côté du H1, bouton plein à y 350, réassurance, preuve, puis la première tuile avec bouton fantôme et verrou. Il lit « fermé » : oui, par cumul (mot Premium, verrous par tuile, bouton contour éteint, texte atténué). Produit verrouillé dès le premier écran : oui (titre de la tuile « Quelqu'un te lance… » à y 745). Une seule offre : oui. Envie de s'inscrire : bonne, le « tableau de bord » se voit. Réserve : la tuile Z1 teintée violet est le seul objet « vivant » de l'extrait ; sur un fond sombre elle ressemble plus à un état actif qu'à un élément fermé, et elle attire l'œil avant les tuiles grises (piste P5).
- 1280 et 1920 : bouton en haut à droite, extrait visible (Z1, cap, trois tuiles coupées par le fondu). Lecture fermée nette. Valeur visible : oui. **Mais** une zone vide de ~110 px de haut sous les pastilles, à gauche de la carte d'offre (voir faute 1).
- 768 : hero 60/40 propre, Z1 en bandeau, cap en bandeau. Bon.
- Gratuit : même rendu, avec la phrase d'objet. À 375, quatre « Premium » en 240 px (pastille, bouton, phrase, réassurance) : lourd mais lisible, les deux paragraphes sont séparés de 24 px.

**Abonné (en-cours).** Sait quoi faire en 3 s : oui. À 375, bouton plein « Les cartes du jour » à y 338 dans la carte teintée. À 1280, Z1 à gauche (8 col.) et cap à droite, bouton à y 370. L'envie de continuer est portée par le cap, les 250 XP, la série et l'étape « 3 sur 3 » avec barre. Clair, élégant. Défaut : sous le texte d'aide de la série, ~80 px vides dans la carte Z2 à 1280 et 1920 (P2).

**Nouvel abonné.** La page n'est jamais morte : Z1 « Commencer », cap 1 sur 5, étape conseillée, « Tes 4 premières semaines » (feuille de route), contenu du jour. À 375, 768, 1280 et 1920 aucune tuile creuse. Défauts mineurs : bas de Z1 vide de ~50 px (P1), titre « Tes 4 premières semaines » non aligné sur les titres de sa voisine (P3).

## 3. Grille de notes

| Critère | Note | Défaut précis et correction codable | Ce qui ferait 10 |
|---|---|---|---|
| D1 Élégance, fidélité à l'accueil | 8 | Aperçu : vide mort du hero (faute 1) ; sinon retenue, un violet, rayons et bords constants | Faute 1 corrigée |
| D2 Hiérarchie (zone dominante, un accent) | 9 | Z1 teintée violette dans l'aperçu rivalise légèrement avec l'offre (P5). Sinon une zone dominante nette par compte | P5 tranchée par Thomas |
| D3 Largeur aux 5 largeurs | 8 | Hero : ~110 px sur ~800 px vides à 1280/1920 (faute 1). Z1 (aperçu, nouvel) et Z2 (en-cours) : 50 à 80 px vides en bas de carte, étirées à la hauteur de leur voisine | Faute 1 + P1 + P2 |
| D4 Cohérence entre comptes | 9 | Mêmes tuiles, mêmes gabarits, même grille ; seul écart : « Tes 4 premières semaines » sans étiquette (P3) | P3 |
| D5 Finition au pixel | 9 | Contraste du texte de l'extrait mesuré 4,66:1 au pire (marge faible, AA tenu). Cibles : lignes « Reprendre » 48 px vues en capture, « Connexion » 44 px au code | Mesurer les cibles des tuiles au code (P6) |
| U1 Prospect : envie en 3 s | 8 | Voir lecture prospect : vide hero au 1er écran 1280/1920 ; tuile Z1 teintée ambiguë (P5) | Faute 1 et P5 |
| U2 Abonné : clarté | 9 | Z1 évidente. Z1 « 5 minutes » porte un bouton plein et deux lignes cliquables : trois cibles pour une action (acceptable, secondaires) | RAS bloquant |
| U3 Abonné : envie de continuer | 9 | Cap, XP, série, étape visibles. Rien sur « ce qui vient demain » | Piste, pas un défaut |
| U4 Nouvel abonné | 9 | Jamais morte, feuille de route présente. Z1 vide en bas (P1) | P1 |
| U5 Accessibilité visible et cohérence | 9 | Contrastes AA tenus (4,66:1 mini), cibles OK, un seul H1. Non vérifié au code : focus et tabulation des tuiles | Preuve clavier (P6) |

**NOTE GLOBALE = minimum = 8/10.** Barre de validation (9, sans faute dure) : **non atteinte** à cause de la faute 1.

## 4. Faute dure

1. **Vide mort du hero de l'aperçu à 1024 et plus** (visiteur et gratuit, 1280 et 1920) : la colonne de texte finit à y ≈ 325 (pastilles), la carte d'offre à y ≈ 435 (visiteur) ou 447 (gratuit) ; ~110 px de haut sur ~800 px de large vides, à droite du « Premium » et sous les pastilles, sur le premier écran du prospect. Le brief l'interdit (« aucun vide mort »), et le code (`hero-apercu.tsx`) montre que ce même vide a déjà été une faute au tour 4. Interdits : grossir le texte, recentrer verticalement (essayé au tour 6, lu comme cassé). Correction codable : sur `lg`, sortir `Preuve` de `offre-apercu.tsx` (prop `preuveHors`, rendue par `hero-apercu.tsx` sous la liste des pastilles, `mt-6`, `META` et nombre en `TITRE_CARTE`, aucune taille nouvelle). La carte d'offre perd ~90 px (bouton, réassurance, Connexion) et la colonne de gauche gagne ~40 px : l'écart tombe sous ~24 px. Sous 1024 la preuve reste dans la carte. À re-mesurer : le bas des deux colonnes à 1280 et 1920, gratuit compris (la phrase d'objet allonge sa carte).

## 5. Pistes (non bloquantes)

- P1 : bas de Z1 vide (50 px, aperçu et nouvel à 1280/1920) : `tableau.tsx`, ancrer le bouton en bas de carte (`mt-auto`) au lieu de laisser le vide sous lui.
- P2 : Z2 en-cours, ~80 px vides à 1280/1920 : `cap-du-jour.tsx`, texte d'aide de la série en `mt-auto`.
- P3 : « Tes 4 premières semaines » (`semaines-tuile.tsx`) : ajouter l'`ETIQUETTE` existante (14/600) au-dessus du titre, comme « Étape conseillée », pour aligner les deux titres de la rangée. Texte à valider par Thomas, aucune taille nouvelle.
- P4 : à 375, quatre « Premium » en 240 px chez le gratuit : la phrase d'objet pourrait absorber la réassurance. Texte : décision de Thomas.
- P5 : décider si la carte Z1 de l'APERÇU garde la teinte violette (point focal voulu par Thomas) ou reste neutre pour renforcer le « fermé ». Je ne tranche pas : c'est un choix documenté.
- P6 : étendre `tailles-comptes.mjs` à 1456, à l'abonné « rafale faite » et au revenant J+30 ; ajouter un contrôle des cibles 44 px sur les pieds de tuile.

## 6. Ce qui est réussi (à ne pas casser)

- Gate typo 16/16, un seul aplat violet par écran.
- 375 visiteur : bouton d'offre avant tout, tuile produit dès l'écran, pas de mur de texte.
- Abonné : action du jour en 3 s, cap et série dès le premier jour, nouvel abonné jamais vide.

NOTE GLOBALE : 8/10

Fautes dures :
1. Vide mort de ~110 px sous les pastilles du hero de l'aperçu à 1024 et plus (visiteur, gratuit) : `apps/web/src/components/espace/apercu/hero-apercu.tsx` et `offre-apercu.tsx` (sortir la preuve de la carte sur `lg`).
