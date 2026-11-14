# Relecture UX à l'aveugle, captures navigation s24, tour 2

Dossier : `docs/captures/s24-nav-universelle-2/`. Vu à l'image : Aujourd'hui (375, 768, 1280, abonné et nouvel abonné), Bibliothèque, Quoi répondre, S'entraîner, Mes répliques, Favoris, Vannes abonné, Profil 768, Blog 375, Lettre 375, menu mobile abonné 375. Non vus : carnet, parcours et fiches au tour 2, états "inscrit gratuit" hors listes ; 768 vu seulement sur Aujourd'hui et Profil.

## Note d'ensemble : 8 / 10 (6,5 au tour 1)
Le fondateur voulait "clean, propre, universel" : c'est atteint. Même en-tête partout, "Mon espace" lisible, retour clair, pages d'espace alignées. Il reste 2 fautes dures, rapides à corriger. F4 est jugée à part.

## Vérification des fautes du tour 1
| Faute | Verdict | Preuve |
|---|---|---|
| F1 Bibliothèque | Corrigée | `abonne-en-cours-mon-espace-bibliotheque-1280.png` : 4 cartes en 2 colonnes, plus de trou, lignes entières cliquables avec chevron, un titre par groupe. Reste le préfixe répété (N2) |
| F2 Quoi répondre | Corrigée en grande partie | `-quoi-repondre-375.png` : titres Coloc (4), Soirée (6), Amis (5)… avec compteur. Liste encore longue et préfixes répétés (N2) |
| F3 Vannes vendues à l'abonné | Corrigée | `abonne-en-cours-vannes-375.png` : plus de "Avec Premium…" ; 1re vanne à environ 450 px |
| F5 Mes répliques | Corrigée | `nouvel-abonne-mon-espace-repliques-1280.png` : bouton "Écrire ma première réplique" |
| F6 Aujourd'hui | Corrigée | `abonne-en-cours-mon-espace-1280.png` : "Mission · Marche 3" en carte ; conseil avec 4 lignes ; vidéo avec vignette. Nouvel abonné 375 : plus de trou |

## Trois personnes
- Abonné quotidien : Aujourd'hui répond (un bouton plein, la mission, le contenu). Quoi répondre se lit par lieu. Il reste un doublon "Ton cap" (Profil, Parcours).
- Nouvel abonné : "Ton premier pas" puis index de 8 lignes ; l'état vide de Mes répliques le renvoie vers une action. Bon.
- Visiteur : en-tête sobre, lettre au 1er écran (`visiteur-lettre-375.png`), blog avec "Commence ici". H1 et intro de /blog prennent 380 px à 375.

## Fautes dures nouvelles (bloquent le 10)
**N1. Menu mobile abonné : "Articles" caché** (`abonne-en-cours-menu-mobile-mon-espace-375.png`). La ligne collée en bas ("Mon profil" et "Déconnexion", 72 px) recouvre la fin de la liste : à l'ouverture on voit Parcours, Vannes, Conseils, Vidéos, et "Articles" n'est plus visible, sans indice de défilement. Une rubrique de la barre est invisible. Correction : afficher Parcours, Vannes, Conseils, Vidéos, Articles sur deux colonnes (3 lignes de 44 px au lieu de 5, 88 px gagnés) pour que tout tienne avec la ligne profil à 812 px ; sinon retirer la barre collée et remettre Profil et Déconnexion à la suite avec un fondu de 24 px en bas.

**N2. Le nom du groupe répété à chaque ligne** (`abonne-en-cours-mon-espace-bibliotheque-1280.png`, `abonne-en-cours-mon-espace-quoi-repondre-375.png`). Sous "Vocabulaire", chaque ligne commence par "Vocabulaire :". Sous "Coloc (4)", "Coloc : …" ; idem Soirée, Amis, Famille, Couple, Boulot ; "5 min" répété sur 50 lignes. Correction : retirer le préfixe quand il égale le titre du groupe (afficher "quand on te lance une pique", "la poêle", « Ça va ? ») et la durée par ligne (mettre "5 min par carte" sous le titre de page).

## F4 (catégories de Vannes), à part, ne bloque pas la note
Inchangée : `visiteur-vannes-375.png`. Le visiteur voit 7 pastilles sans "Toutes" ni état actif, et 10 vannes gratuites toutes "Boulot & Collègues". L'abonné a "Toutes" actif et "Vie quotidienne". Le défaut est réel : on croit à une seule catégorie. Option minimale pour Thomas, sans toucher à l'offre : ajouter "Toutes" actif au visiteur et montrer 3 catégories différentes dans les 10 gratuites. Sinon à assumer en connaissance de cause.

## Pistes
- Aujourd'hui à 768 (`abonne-en-cours-mon-espace-768.png`) : "Vidéo du jour" seule sur la 3e ligne, vignette de 420 px, la page s'allonge de 450 px. Passer la vidéo en carte à vignette de 16:9 limitée à 280 px, ou 3 colonnes dès 768.
- Aujourd'hui à 1280 : environ 80 px de vide entre l'en-tête et le titre (place du "Retour" réservée) alors qu'il n'y a pas de retour.
- S'entraîner (`abonne-en-cours-mon-espace-s-entrainer-1280.png`) : la même intro qu'Aujourd'hui ; colonne droite vide sous "Boulot : Ça va ?" ; les scènes complètes sont déjà dans Quoi répondre. Écrire une intro propre : "Trois exercices pour aujourd'hui".
- Bibliothèque : la carte "Vannes, conseils, vidéos" (pastilles + 3 liens) double la barre ; la retirer ou la renommer "Par situation".
- Profil 768 (`abonne-en-cours-profil-768.png`) : "Ton cap" et "Mes parcours" répètent Aujourd'hui et Parcours ; carte vide "Ta question à l'équipe" sous le pli ; avertissement de suppression de 8 lignes. Mettre les réglages avant la progression.
- Quoi répondre à 375 : tout est ouvert (50 lignes) ; groupes repliés sauf celui du jour.
- Pied de page de l'abonné (40 % de la hauteur à 375) : "Nos offres" et "Renoncer au contrat ici" ("ici" flou).
- Blog 375 : H1 sur 4 lignes et intro de 5 lignes avant "Commence ici" ; réduire à 2 lignes.
- Libellés proches : "Lettres" et "La lettre" ; "Mes questions" (formulaire d'écriture) : "Écrire à l'équipe".

## Verdict
8/10. Corriger N1 et N2 donne 9 ; le 10 demande en plus la vidéo à 768, l'intro de S'entraîner et la décision de Thomas sur F4. Tour 3 utile pour contrôler N1 à 375 x 667 et à 320 px.
