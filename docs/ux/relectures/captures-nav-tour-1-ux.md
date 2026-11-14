# Relecture UX à l'aveugle, captures navigation s24, tour 1

Vu : accueil, vannes, vidéos, menus mobiles (visiteur, abonné) ; Aujourd'hui, Bibliothèque, Quoi répondre, Mes questions, Mes répliques, S'entraîner, fiche situation, Favoris, Carnet, Parcours (375 et 1280, abonné et nouvel abonné). Non vus : blog, lettre, profil, 768 (hors consigne). Dossier : `docs/captures/s24-nav-universelle/`.

## Note d'ensemble : 6,5 / 10
La navigation est enfin propre : un seul en-tête de 65 px, "Mon espace" visible, un ordre unique, un retour clair ("Retour : Quoi répondre"), aucun débordement. Ce qui retient la note : le contenu des pages. Listes plates de 30 à 50 lignes, un trou de 600 px, une page Vannes qui vend Premium à l'abonné, une impasse. La spec est respectée, l'usage ne l'est pas encore.

| Page | Note | Raison |
|---|---|---|
| Aujourd'hui (abonné) | 8 | 1er écran juste (carte du jour, un bouton plein) ; "Marche 3" flou, cartes conseil/vidéo vides |
| Aujourd'hui (nouvel abonné) | 7 | "Ton premier pas" net ; trou d'environ 130 px dans la carte à 375 |
| Menu mobile abonné | 7,5 | Hiérarchie claire ; Profil et Déconnexion sous le pli |
| Menu mobile visiteur | 9 | Court, offre visible |
| Bibliothèque | 4 | Trou à 1280, 31 lignes au préfixe répété |
| Quoi répondre | 5 | 50+ cartes en vrac |
| S'entraîner | 7 | Utile ; colonne droite vide, intro copiée d'Aujourd'hui |
| Mes questions | 8 | Formulaire clair |
| Mes répliques (vide) | 4 | Impasse |
| Favoris (vide) | 8 | Vide avec bouton d'action |
| Vannes visiteur | 7 | Bon ; catégories sans effet visible |
| Vannes abonné | 5 | Intro de vente, 1re vanne sous le pli |
| Vidéos visiteur | 7,5 | Vignettes, paywall net |
| Parcours | 6 | 1er écran = accordéon + "Ton cap" opaque ; cartes très longues |
| Carnet | 6,5 | 30 situations sans sommaire |
| Accueil visiteur | 8 | Promesse et CTA au 1er écran |

## Trois personnes
- Abonné quotidien : Aujourd'hui sert son intention (carte du jour d'abord). Il perd du temps sur Quoi répondre et Bibliothèque, listes sans repère. À 375, "Mon espace" n'est pas dans la barre : 2 touchers pour tout, ce qui est acceptable.
- Nouvel abonné : le premier pas est clair, mais "Mes répliques" vide ne dit pas quoi faire. L'index de 8 rubriques d'un coup, dont "Mes questions" et "Quoi répondre" (libellés proches), est dense pour un débutant.
- Visiteur : il sait où il est (fil d'Ariane, lien allumé) et où payer. Les catégories de Vannes ne l'aident pas (F4).

## Fautes dures (bloquent le 10)
**F1. Bibliothèque** (`abonne-en-cours-mon-espace-bibliotheque-1280.png`, `-375.png`). À 1280, environ 600 px de noir entre la carte "Vannes, conseils, vidéos" et "Humour noir" : la colonne gauche est étirée par la hauteur de la liste de droite. Les 31 lignes commencent toutes par "Comment c'est construit :", "Vocabulaire :", "Formules à détourner :" et ont chacune un bouton "Voir". Le bloc "Vannes, conseils, vidéos" refait la navigation du haut. Correction : empiler les 3 blocs (Humour noir en tête de colonne gauche, `items-start`) ; remplacer les préfixes par 3 titres de groupe (Construire, Vocabulaire, Formules) en accordéons repliés avec compteur ; supprimer "Voir" (ligne entière cliquable, chevron) ; supprimer le bloc Vannes/Conseils/Vidéos.

**F2. Quoi répondre** (`abonne-en-cours-mon-espace-quoi-repondre-375.png`). Plus de 50 cartes à la suite, toutes "5 min", mélange de Boulot, Couple, Fac, Toast, sans titre de groupe ; "Filtrer les cartes" fermé ; "Le carnet du mois" en bouton isolé qui double l'entrée Carnet. Correction : grouper sous des titres de situation (Boulot, Soirée, Couple, Amis, Famille, Fac, Moments forts) avec 5 cartes visibles et "Voir les N" ; remonter "Nouvelle" et "À revoir" en tête ; retirer "5 min" de chaque ligne (mettre la durée unique dans le chapô) ; renommer le bouton "Carnet de novembre" ou le retirer.

**F3. Vannes vu par l'abonné** (`abonne-en-cours-vannes-375.png`). L'intro de vente reste : "Avec Premium, tu gardes tes préférées sous le coude". H1 sur 4 lignes et intro sur 6 : à 375, la 1re vanne est à 460 px, sous le pli. Correction : pour l'abonné, remplacer l'intro par une ligne "Tes vannes du jour" et monter les filtres ; garder le texte SEO pour le visiteur.

**F4. Catégories de Vannes** (`visiteur-vannes-375.png`, `visiteur-vannes-1280.png`, `abonne-en-cours-vannes-375.png`). Visiteur : 7 pastilles sans état actif ni "Toutes", et les 10 vannes gratuites sont toutes "Boulot & Collègues" : on croit que le catalogue est à une seule catégorie. Abonné : autre jeu de pastilles ("Toutes", "Vie quotidienne", "Boulot…"), donc deux logiques de catégories pour le même écran. À 375, la rangée est coupée sans indice. Correction : une seule liste de pastilles pour tous (Toutes active par défaut, puis les 7 situations), état actif visible, dégradé de bord pour montrer le défilement ; les 10 gratuites tirées dans au moins 5 catégories.

**F5. Impasse "Mes répliques"** (`nouvel-abonne-mon-espace-repliques-1280.png`). "Tu n'as pas encore écrit de réplique. Elles apparaissent ici." : aucune action, page vide sur 900 px. Correction : ajouter le bouton "Écrire ma première réplique" vers Quoi répondre, comme le vide de Favoris qui a "Explorer les vannes".

**F6. Aujourd'hui, 1er écran** (`abonne-en-cours-mon-espace-1280.png`, `nouvel-abonne-mon-espace-375.png`). (a) "Marche 3 · À un pote, en face" flotte hors carte, sans verbe ni lien explicite : on ne sait pas ce que c'est. (b) Les cartes "Conseil du jour" et "Vidéo du jour" ne contiennent qu'un lien sous un grand vide (environ 200 px à 1280), à côté d'une vanne complète. (c) Nouvel abonné à 375 : trou d'environ 130 px entre la phrase et "5 min". Correction : (a) l'intégrer à la carte du jour ("Défi de la semaine : À un pote, en face" + bouton) ; (b) ajouter 2 lignes de résumé et la durée, ou passer à une liste de 3 lignes ; (c) supprimer la hauteur minimale de la carte.

## Pistes (ne bloquent pas)
- Pied de page de l'abonné, 40 % de la hauteur à 375 (`abonne-en-cours-mon-espace-375.png`) : "Nos offres", "Renoncer au contrat ici" ("ici" est flou). Version courte pour l'abonné (Nos offres retiré, 2 liens contrat sous "Mon abonnement").
- Menu mobile abonné (`abonne-en-cours-menu-mobile-mon-espace-375.png`) : 13 lignes, Mon profil et Déconnexion sous le pli. Replier les 8 entrées sous "Mon espace" sauf sur les pages de l'espace, ou monter le profil.
- Sur Vannes, Conseils, Vidéos, rien ne rattache l'abonné à son espace : ajouter "Retour : Mon espace" pour lui.
- Parcours (`abonne-en-cours-parcours-1280.png`) : "Tes 4 premières semaines" avant les parcours, "Ton cap : 1 jour de pratique d'affilée · cap 2 sur 5" opaque, cartes de 340 px avec histoire fictive et accordéon "Programme". Mettre "Reprendre" d'abord, résumer le reste.
- Carnet : 30 situations sur 3 000 px sans sommaire ; ajouter un index "Situation 1 à 30".
- Libellés proches : "Lettres" (abonné) et "La lettre" (visiteur) ; "Mes questions" et "Quoi répondre". Préférer "Écrire à l'équipe" pour Mes questions.
- S'entraîner à 1280 : colonne droite vide sous la 2e carte, et la même intro que Aujourd'hui ("La bonne réponse qui te vient en quittant la pièce…") ; écrire une intro propre à la page.
- Mes répliques à 900 px : bande noire de 90 px sous le pied de page ; pied collé en bas.
- Données de test visibles ("Réplique de test (préversion)") : à purger avant ouverture.

## Verdict
Pas de 10 tant que F1 à F6 restent. Corrigées, la note monte à 8,5. Relecture des 768 px et des pages non vues (blog, lettre, profil) à faire au tour 2.
