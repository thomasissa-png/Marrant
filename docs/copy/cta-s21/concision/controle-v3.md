# Contrôle v3 : concision du parcours d'achat

> Sources : `textes-v3-a.md`, `-b.md`, `-c.md`. v2 = `controle-v2.md`. Comptage selon `textes-v3-a.md` §0 (liens d'action exclus, REASS de 11 mots à part, sauf /abonnement où liens et REASS sont comptés). La v3 ne touche que ce que les relectures du tour 2 ont nommé ; les 14 arbitrages sont appliqués.

## 1. Tableau récapitulatif (mots hors bouton)

| # | Surface | v2 | v3 | Budget | OK |
|---|---|---|---|---|---|
| 1 | /abonnement visiteur (liens et REASS compris) | 106 max (annuel 104) | 103 max (annuel 101) | 120 | OK |
| 2 | /abonnement compte connecté | 95 max | 92 max | 120 | OK |
| 3 | Carte Premium accueil (+ REASS) | 19 (+11) | 19 (+11) | 40 | OK |
| 4 | Paywall /carnet (+ REASS) | 21 (+11) | 21 (+11) | 25 | OK |
| 5 | Fin d'article (n°1 / déclinaisons) | 22 / 18 à 20 | 18 / 18 à 20 | 25 | OK |
| 6 | Quiz d'humour | 19 à 25 | 19 à 25 | 25 | OK |
| 7 | Murs de liste (+ REASS) | 11 à 13 | 9 à 13 | 25 | OK |
| 8 | Fiche vanne / conseil / vidéo (+ REASS) | 17 / 18 / 21 | 15 / 18 / 17 | 25 | OK |
| 9 | Quiz d'orientation (+ REASS) | 14 à 18 | 14 à 18 | 25 | OK |
| 10 | Fin de /glossaire (+ REASS) | 21 | 21 | 25 | OK |
| 11 | Fin de /a-propos (+ REASS), titre de page exclu | 11 | 10 | 25 | OK |
| 12 | Fin d'étape 1 + lettre (+ REASS) | 23 | 19 | 25 | OK |
| 13 | /register | 20 (22 max) | 17 (19 max) | 25 | OK |
| 14 | Lettre dans l'article | 13 | 11 | 25 | OK |
| 15 | Fenêtre Premium, 7 gestes (+ REASS) | 6 à 10 | 6 à 10 | 25 | OK |
| 16 | /profil sans abonnement (+ REASS) | 9 | 10 | 25 | OK |
| 17 | Encart démo (hors scène) | 7 | 7 | 25 | OK |
| 18 | Haut de l'accueil (hors H1) | 18 | 18 | 40 | OK |
| 19 | Paywall web (+ REASS) | 12 | 13 | 25 | OK |
| 20 | Page d'un parcours, aperçu | 12 | 12 | 25 | OK |
| 21 | Page de retour après paiement (+ bouton de 3 mots) | 6 | 6 | 25 | OK |
| 22 | Cartes /parcours | 5 | 5 | 25 | OK |
| 23 | Carte d'accueil, compte connecté (+ REASS) | 23 (+11) | 19 (+11) | 40 | OK |
| 24 | Validation d'étape, quiz en cours (+ REASS) | 6 | 6 | 25 | OK |
| 25 | Bouton d'en-tête | 1 | 2 | 0 levé | OK |
| 26 | Avantages (/abonnement seulement) | 26 | 22 | 30 | OK |
| 27 | Intro /carnet (donnée) | 13 | 13 | 40 | OK |

Somme des maxima des surfaces 1 et 3 à 24 : **-20 mots** par rapport à la v2. Détail /abonnement (Répartie, mensuel) : 10 + 13 + 3 + 5 + 3 + 6 + 6 + 11 + 22 + 10 + 5 + 9 = 103. Variantes : Machine à Café 102 / 100, Boulot 100 / 98, Confiance 99 / 97, Storytelling 102 / 100 (mensuel / annuel). Seuls /profil (+1), paywall web (+1) et l'en-tête (+1) gagnent un mot, par arbitrage.

## 2. Mesure du diff v2 vers v3 (blocs de texte)

Base : 172 blocs (171 de la v2 + le bouton de la page de retour). **35 blocs changent (≈ 20 %)**, 137 restent identiques ; par partie : A 5, B 12, C 18.

- **A (5)** : bouton d'en-tête ; texte de l'article n°1 ; phrase de la carte d'accueil ; ligne de la carte connectée ; phrase de la lettre.
- **B (12)** : titre et limite de /vannes ; texte vanne, texte conseil, titre vidéo, texte vidéo ; titre du vote ; raison ABSURDE ; phrase Machine à Café et lien du quiz d'orientation ; titre et phrase de la fin d'étape 1.
- **C (18)** : titre Confiance et sous-titre de /abonnement ; avantages 1, 3, 4 ; réponses FAQ mensuelle et annuelle ; H1 et bouton Google de /register ; bouton de la page de retour (ajouté) ; intro et bouton du carnet ; phrase du profil ; paragraphe et corps de /a-propos ; titre et texte du paywall ; phrase de l'e-mail.

Intouchables vérifiés : slugs et H2 non touchés ; questions de la FAQ identiques (seules les réponses prix changent) ; prix et calculs (2,99 €, 24,99 €, 2,08 €, « plus de 3 mois offerts ») identiques ; « 15 à 20 minutes » présent ; « 1 500+ » une fois par page ; REASS identique partout ; nombres des limites (`FREE_*_LIMIT`) et `PARCOURS_COUNT` toujours lus dans la config. Les surfaces sans défaut nommé (haut d'accueil, démo, cartes /parcours, aperçu, murs /conseils et /videos, glossaire) ne bougent pas.

## 3. Libellés uniques et où ils sont

| Libellé | Emplacements |
|---|---|
| « Tester mes premières répliques, gratuit » | A§1 haut d'accueil ; A§3 fin d'article générique ; A§4 et A§5 lien de la carte |
| « Tester l'étape 1 de {P}, gratuite » | A§3 5 déclinaisons ; B§1 lien des 3 murs ; B§2 lien des 3 fiches ; B§4 bouton du quiz d'humour ; **B§5 lien du quiz d'orientation (remplace « Voir par où commencer »)** ; B§7 5 cartes ; C§1 « Pas encore sûr ? » ; C§4 /register ; C§8 /glossaire et /a-propos |
| « Ouvrir les 5 parcours · 2,99 €/mois » | A§3 lien ; A§4 bouton ; B§4 lien ; B§5 plein ; B§8 `APERCU_LIEN` et `MUR_PREMIUM_BOUTON` ; C§1 bouton ; C§7 profil ; C§8 boutons ; C§9 paywall. Libellé intact partout |
| Libellés de geste | « Voir la suite des vannes / conseils / vidéos · 2,99 €/mois » ; « Écrire la mienne », « Essayer ce conseil », « Décrypter cette vidéo » ; « Passer à l'étape 2 · 2,99 €/mois » ; **« Voir tout le carnet · 2,99 €/mois »** ; « Je m'abonne et … » ; « Créer mon compte et passer au paiement » ; **« Premium · 2,99 €/mois »** (en-tête) ; **« Choisir mon parcours »** (retour de paiement, mène à /parcours) ; **« Continuer avec Google »** |
| Supprimés (Grep = 0 hors lignes « Disparaît ») | « Voir par où commencer », « Voir les {N} autres répliques », « S'inscrire avec Google », « Passe Premium », « Ouvrir {P} en entier », « Ouvrir toutes les étapes » (l'aperçu garde OUVRIR, sans exception), « Tout ouvrir », « S'abonner », « Voir Premium » |

## 4. Comptes des tics (dans le texte exact, hors lignes « Disparaît »)

| Tic | Limite | Compte | Où |
|---|---|---|---|
| « d'un coup » | 2 dans tout le tunnel | **2** | sous-titre /abonnement ; phrase de fin d'étape 1. Retiré des deux cartes d'accueil |
| « s'ouvre » juste avant « Ouvrir… » | 0 | 0 | cartes d'accueil, /abonnement (« accessible »), /profil ; en fin d'étape 1 le bouton est « Passer à l'étape 2 » |
| « 5 parcours » juste au-dessus du bouton qui le dit | 0 | 0 | avantage 1 « Chaque parcours en entier » ; paywall sans « Les 5 parcours » ; cartes d'accueil sans le nombre |
| « X, pas Y » | 2 | 2 | fin d'article n°1 ; titre /abonnement Répartie |
| « sans (te) forcer » | 1 | 0 | retiré du titre Confiance |
| « Et si… ? » | 1 | 1 | titre de la carte d'accueil |
| « étape » à l'écran de fin d'étape 1 | 2 | 2 | bouton ; surtitre « Étape 2 sur {N} » |
| « 14 » dans le bloc du carnet | 2 | 2 | titre ; « 14 jours » de la REASS |
| « répliques » / « situations » sur /carnet | un seul mot | « répliques » | intro, titre, liste |
| « le soir où » | 1 | 1 | titre de la fiche conseil |
| « ça s'entraîne » | 1 par page | 1 | article n°1 ; déclinaison Répartie (articles différents) |
| « 1 500+ inscrits » | 1 par page | 1 | haut d'accueil ; fin de /a-propos |
| « au bon moment » | à surveiller | 3, sur 3 pages | déclinaison Machine à Café, raison ABSURDE, titre /abonnement Machine à Café et Boulot |
| « on te chambre » | à surveiller | 5, sur 4 surfaces | jamais deux fois sur la même page |

## 5. Conformité aux 14 arbitrages

1 En-tête « Premium · 2,99 €/mois » (A§2). 2 Libellés intacts ; « d'un coup » deux fois (§4) ; carte, profil et /abonnement ajustés autour du bouton. 3 Avantage 1 « Chaque parcours en entier » ; paywall et cartes d'accueil sans « 5 parcours » au-dessus du bouton. 4 /carnet : « répliques » partout, 14 deux fois, bouton « Voir tout le carnet » (celui qui supprime la répétition, « autres » ne reste qu'une fois). 5 /vannes « Encore des vannes à ressortir » (même idée que les deux propositions, la plus courte à garder le « encore » de continuité) ; « Fin des 10 gratuites. ». 6 ABSURDE reprise mot pour mot. 7 « Pour toi si tu veux faire rire à la pause. » ; lien unique GRATUIT_P. 8 Carte connectée = phrase de la carte visiteur. 9 Profil : « Chaque mois, un nouveau carnet de répartie s'ajoute aux parcours. » (verbe, rattaché au bouton « Ouvrir les 5 parcours » sans répéter le nombre). 10 Paywall : « La suite, avec Premium » ; « Le carnet du mois, tes favoris, tout le catalogue. » 11 E-mail : phrase exacte. 12 /register : « Ton compte » (le bouton porte le paiement). 13 Bouton « Choisir mon parcours » (3 mots). 14 Article n°1 : « La placer à voix haute, ça s'entraîne. » ; lettre « …avec un exercice. » ; vidéo : titre « L'humoriste a sa salle. Toi, une table suffit. » et texte sans le mot « vidéo » ; vote « Pour voter, il te faut Premium » ; FAQ « C'est le prix, point. Ça se renouvelle chaque mois, tant que tu ne résilies pas. » ; /a-propos sans « c'est tout le programme » ni affirmation sur les inscrits ; fin d'étape 1 : « étape » deux fois.

Autres retouches reprises des relectures : titre Confiance « Rire à table, sans monter sur scène » ; avantages 3 et 4 inversés (le catalogue avant les favoris) et « Tout le catalogue : vannes, conseils, vidéos » (même mot que le paywall) ; texte conseil « rater est sans risque » ; texte vanne « Une consigne, un exemple, et c'est à toi. » ; « Continuer avec Google » ; « Bien joué ! » ; « Voir par où commencer » supprimé ; lettre du bas d'article en bouton discret.

## 6. Vérifications « rien de faux »

- Vote réservé à Premium (vérifié dans le code) ; « 15 à 20 minutes » par étape = `DUREE_ETAPES`.
- « Tout est accessible d'un coup » : même fait qu'avant (toutes les étapes suivantes, 5 parcours), seul le verbe change.
- Résiliation : REASS seule ; FAQ « se renouvelle chaque mois, tant que tu ne résilies pas » (exact, mensuel et annuel).
- E-mail : « Tout est ouvert. Pour démarrer, choisis un parcours » ne suppose plus que l'étape 1 a été lue.
- Aucune promesse de résultat, aucun témoignage, aucun nom de concurrent ajouté.
- **Grep tiret cadratin (U+2014) dans `docs/copy/cta-s21/concision/` pour `textes-v3-a`, `-b`, `-c` et ce fichier : 0 occurrence.**

## 7. Points d'attention

1. **Titre vidéo** « L'humoriste a sa salle » suppose que les vidéos du site montrent un humoriste ; si une vidéo n'en montre pas, prévoir un titre générique pour ce cas.
2. **Carnet** : les étiquettes « Situation 15, offerte » (extrait de /abonnement) et « Situation offerte ce mois-ci » (démo d'article) restent en « situation » (autres pages) ; à aligner sur « réplique » si l'on veut un seul mot dans tout le site. Vérifier aussi l'étiquette de la fiche offerte sur /carnet.
3. **Phrase des cartes d'accueil** « un parcours par terrain » : formule évocatrice, pas un engagement de découpage (5 parcours, dont 2 pour le bureau) ; à confirmer en relecture à l'aveugle.
4. **Retour de paiement** : le bouton « Choisir mon parcours » mène à `/parcours`.
5. **Tests à relire** : textes en dur « Passe Premium », « Ton compte, puis le paiement » (H1), « Voir par où commencer », « S'inscrire avec Google », « Le vote est réservé à Premium ».
6. **Écran 375 px** : « Tester l'étape 1 de Machine à Café, gratuite » (8 mots) peut passer sur deux lignes ; à contrôler en capture.
