# Audit de conversion des blocs d'appel à l'action, s21 (18/10/2026)

> Auteur : @growth. Version auditée : branche `claude/marrant-s21-integration` (worktree `agent-a6072b0ac19da7774`), lot 2 (boutons, /abonnement, carnet) et lettre mensuelle intégrés, lien de test `https://47b8c826-marrant.thomas-issa.workers.dev/?ne-pas-compter=1`. Lecture du code et des captures `docs/qa/captures-s21/final/` et `tour2/`. Rien n'est déployé par cet audit, aucune ligne de code touchée, aucun texte final écrit (le copywriter écrira, et tout nouveau texte repasse la relecture à l'aveugle, règle d'or P0 s18).

## 0. Statut

| Élément | Statut |
|---|---|
| Chiffres réels des clics et vues (`docs/data/cta-chiffres-s21.md`) | **Intégrés** (extraction du 18/10, 4,2 jours après le lot 1 : 69 vues d'encarts, 0 clic). Trafic de fond : audit s20 (Umami 15/09 au 12/10, 28 jours). Rien n'est estimé : une donnée absente est écrite « absente ». |
| Notes | Jugement d'expert sur code, textes et captures, recalé sur les chiffres quand ils existent. Elles servent à classer, pas à prévoir un gain. |
| Volume | ≈ 690 visiteurs en 28 jours : aucune différence entre deux variantes n'est mesurable. Séquentiel (avant / après), un changement à la fois quand c'est possible, règle de décision écrite à l'avance. |
| Périmètre | 18 blocs notés (§3), plus une liste de blocs secondaires non notés (§3 bis). Les pages /parcours/*, /abonnement et /register n'ont reçu presque aucune visite depuis le 14/10 : leurs notes sont théoriques. |

## 1. Ce que disent les chiffres (à lire avant les notes)

Source : `docs/data/cta-chiffres-s21.md` (A = 14/10 au 18/10 05:05, 4,2 jours ; B = 28 jours avant).

| Constat | Chiffre | Lecture |
|---|---|---|
| Vues d'encarts d'articles | 69 vues, **0 clic** (milieu-1 : 50 vues, milieu-2 : 9, fin : 10) | Le 0 est net, mais la borne est large : avec 0 sur 69, le vrai taux peut aller jusqu'à ≈ 4,3 % (règle de trois). Seuil du lot 1 (3 %) : conclure « sous 3 % » demande ≥ 99 vues sans clic, soit vers le 21/10 au rythme de 13 vues de l'article n°1 par jour. |
| Article n°1 : où le lecteur s'arrête | milieu-1 vu par **56 %** des pages vues (31/55), milieu-2 par 16 % (9/55), **bloc de fin par 5 %** (3/55) | L'exposition du premier encart est bonne (avant le lot 1 : premier lien à 77 % de la page). Le bas de l'article est une zone morte : bloc de fin et lettre (placée juste après) ne sont atteints que par ≈ 1 lecteur sur 20. |
| Pages visées par les encarts | 0 vue de `/parcours/repartie`, `/parcours/boulot`, `/parcours/confiance` | Le 0 clic n'est pas un trou de mesure : personne n'arrive non plus par un autre chemin. |
| Ce que les lecteurs cliquent à la place | `blog-sortie-clic` : 7 en A (6 sur l'article n°1 : thèmes Famille, Soirées, Gaming, blague du jour, parcours Machine à Café, pilier « comment devenir drôle ») ; 12 en B | Les lecteurs cliquent, mais vers **plus de vannes**. 7 clics de sortie contre 0 sur les encarts, à vues comparables. C'est le meilleur indice de leur intention. |
| Aval | `/abonnement` 0,7 vue/jour (0,8 avant), 0 arrivée depuis un article, 0 clic de paiement (5 en B), 0 compte, 0 abonnement depuis le 14/10 | Aucun effet en aval. `abonnement-vu` « ×2 » est un artefact (sous-comptage en B) : suivre les pages vues. |
| Seule source de clic prouvée | `abonnement-vu` en B : direct 5, **header 2**, exercice-vanne 2 | L'en-tête est le seul bloc d'appel avec un clic mesuré sur 28 jours (2). Les encarts n'en ont aucun. |
| Audience de l'article n°1 | google.com 402 visiteurs sur 683 (B s20) ; pays : FR 435, US 59, CN 53, CA 34, BE 28 | Requête « meilleures blagues drôles 2026 » : on cherche des vannes à ressortir ou à envoyer, pas un entraînement. Une part du trafic (CN, US) n'est probablement pas la cible. [HYPOTHÈSE, non mesurée] |

**Hypothèses sur la cause du 0 clic, classées par vraisemblance** (détail par bloc au §4) :

1. **La proposition elle-même (la plus probable).** « Lire la première étape gratuite » demande un effort (lire une leçon) à quelqu'un qui est en mode divertissement et vient de lire des vannes. Preuve indirecte : il clique sur des liens qui prolongent le divertissement (7 sorties) et pas sur celui qui demande du travail. Ni le texte, ni la forme, ni la place ne corrigeront à eux seuls une proposition qui ne répond pas à l'intention du moment.
2. **Le texte sans démonstration.** L'encart promet (« une réplique se trouve sur le moment ») mais ne montre rien : pas de réplique, pas de décryptage, pas d'extrait. Le visiteur doit croire sur parole.
3. **La forme qui ressemble à du contenu.** Carte sobre, filet violet à gauche, bouton contour : l'encart se lit comme un intertitre qu'on dépasse en scrollant. « Vu à 50 % » (seuil de `blog-cta-vu`) n'est pas « lu ». [À MESURER : temps à l'écran]
4. **La place (la moins probable pour milieu-1, certaine pour le bas de page).** 56 % d'exposition du premier encart, donc ce n'est pas lui le problème. Pour le bloc de fin (5 %) et la lettre, c'est la place qui décide.

Ce que ces chiffres ne disent pas : si la cible (Yanis, Sophie, Marc) lit l'article n°1. La question « qui est ce lecteur » précède le choix du texte.

## 2. La grille de notation (posée avant les notes)

Quatre notes sur 10 par bloc, chacune faite de 5 critères valant 0, 1 ou 2 points. **Texte, Place et Forme** sont demandées par Thomas ; j'ajoute **Proposition (O)** parce que les chiffres du §1 montrent qu'un bloc bien placé, bien formé et lisible peut échouer sur ce qu'il demande.

| Note | 5 critères (0 = absent, 1 = partiel, 2 = net) |
|---|---|
| **T, Texte** | T1 promesse concrète pour le persona, dans ses mots · T2 réponse à l'objection principale de l'instant (prix, « est-ce pour moi », « et si ça ne marche pas ») · T3 clarté de ce qui se passe au clic (étape gratuite, compte, paiement) · T4 preuve ou démonstration de la valeur (extrait, exemple réel, fait vérifiable ; « 1 500+ » ne compte ni en bien ni en mal : [CHOIX UTILISATEUR] P0, non touché) · T5 libellé du bouton : verbe + objet, spécifique |
| **P, Place** | P1 moment du parcours compatible avec l'intention · P2 exposition réelle (qui voit le bloc, mesuré quand on peut) · P3 proximité de la valeur qui motive (juste après un contenu utile) · P4 une seule action principale à l'écran · P5 cohérence avec la page d'arrivée (la promesse tient au clic) |
| **F, Forme** | F1 hiérarchie (un seul plein, le bon niveau) · F2 lisibilité et cible tactile (44 px) · F3 poids visuel proportionné (ni noyé ni écrasant) · F4 friction de l'action (2 = un clic sans saisie ; 1 = étape annoncée ; 0 = saut aveugle vers compte puis paiement) · F5 cohérence du système (même objet, même forme, même libellé) |
| **O, Proposition** | O1 adéquation à l'intention du moment · O2 effort ou engagement demandé comparé à la valeur déjà reçue · O3 réversibilité et risque (gratuit, sans compte, sans carte, remboursement) · O4 adéquation au persona réel (Yanis : répartie ; Sophie : bureau ; Marc : légèreté) · O5 gain visible en moins de 5 secondes |

**Note globale G = 25 % T + 30 % P + 15 % F + 30 % O.** La forme pèse le moins (un bouton parfait sur une mauvaise offre ne convertit pas) ; place et proposition pèsent le plus (goulot d'exposition de l'audit s20, puis 0 clic malgré l'exposition).

**Écart** = 10 − G. **Indice d'impact** = exposition × écart, où l'exposition est le nombre de vues du bloc sur 28 jours : mesuré quand le fichier de chiffres le donne (vues d'encart A × 28 / 4,2, projection linéaire), sinon les pages vues de la page hôte (Umami s20, 28 jours, plancher car le top 50 est tronqué). L'indice classe, il ne prédit pas un nombre d'abonnés.

**Avertissement de calibrage.** Cette grille est plus indulgente que les notes du lot s20 (4,7 en moyenne) : des notes de 5 à 7 ne veulent pas dire « ça marche ». Le meilleur contre-exemple est l'encart milieu-1, noté 5,5 et qui fait 0 clic sur 50 vues. Lecture utile : la **moyenne pondérée par l'exposition** (§3), pas la moyenne simple.

## 3. Tableau des blocs (notes sur 10)

Textes exacts, formes et critères détaillés : §4. « Exposition » = vues sur 28 jours (mesurées si l'unité est « encart » ; sinon pages vues de la page hôte). Lot 2 et lettre = version de la branche `claude/marrant-s21-integration` (pas encore en ligne au 18/10).

| # | Bloc | Où, quand | Exposition 28 j | T | P | F | O | **G** | Écart | Indice | Rang |
|---|---|---|---|---|---|---|---|---|---|---|---|
| B6 | Bouton d'en-tête « Commencer » (ordinateur, mobile dès 360 px, menu) | Toutes les pages | 1 183 (pages vues B) | 4 | 5 | 6 | 2 | **4,0** | 6,0 | 7 098 | 1 |
| B1 | Encarts au fil des articles (milieu-1, milieu-2) | Article, 21 % et 32 % de la page (article n°1) | 393 (59 vues en A projetées) ; mesuré **0 clic** | 5 | 6 | 8 | 4 | **5,5** | 4,5 | 1 770 | 2 |
| B7 | Murs des listes /vannes, /conseils, /videos (bandeau, filtres, cartes verrouillées, bas de liste) | Après 10 vannes ou 3 conseils/vidéos | 114 (pages vues des listes et thèmes) | 4 | 6 | 6 | 5 | **5,2** | 4,8 | 547 | 3 |
| B2 | Bloc de fin d'article (étape 1 en contour + Premium en plein) | Bas de l'article | **67** (10 vues en A projetées ; 5 % des lecteurs de l'article n°1) ; 0 clic | 4 | 5 | 7 | 3 | **4,5** | 5,5 | 367 | 4 |
| B4 | Accueil : bloc « Tu crois avoir tout essayé pour être drôle ? » | Bas de l'accueil | 51 (pages vues de l'accueil) | 4 | 5 | 6 | 3 | **4,3** | 5,7 | 291 | 5 |
| B18 | Lettre mensuelle (article, quiz, /lettre, lien d'accueil, pied de page) | Juste après le bloc de fin ; sous le résultat du quiz | 67 pour l'article [HYPOTHÈSE : = bloc de fin, la lettre n'était pas en ligne en A] | 6 | 6 | 8 | 7 | **6,6** | 3,4 | 228 | 6 |
| B3 | Accueil : haut de page (H1, bouton « Accéder aux parcours complets », lien « Lire la première étape gratuite », pastilles) | Premier écran | 51 | 5 | 6 | 6 | 6 | **5,8** | 4,2 | 214 | 7 |
| B5 | Accueil : carte Premium « Pour t'y mettre, il y a Premium » | Bas de l'accueil | 51 | 6 | 5 | 8 | 6 | **6,0** | 4,0 | 204 | 8 |
| B11 | Fenêtre Premium (favoris, vote, défaut) | Au clic sur un cœur ou une carte verrouillée | ≤ 23 (`mur-vu` toutes catégories en B) | 7 | 6 | 7 | 4 | **5,8** | 4,2 | 97 | 9 |
| B14 | Fin de l'étape 1 gratuite et aperçus des étapes 2+ | Page d'un parcours | 19 (pages vues /parcours/<slug> en B) ; **0 en A** | 4 | 7 | 7 | 7 | **6,3** | 3,7 | 70 | 10 |
| B15 | Page /parcours (cartes, « Commencer ce parcours ») | Choix d'un parcours | 16 | 3 | 5 | 6 | 8 | **5,6** | 4,4 | 70 | 10 |
| B8 | Fiche vanne : exercice verrouillé + « Comment la ressortir » | Après le décryptage gratuit | ≈ 20 (plancher) | 5 | 7 | 8 | 7 | **6,7** | 3,3 | 66 | 12 |
| B16 | Page /abonnement (visiteur) | Intention forte | 22 | 7 | 8 | 9 | 7 | **7,6** | 2,4 | 53 | 13 |
| B17 | Page /register (« Étape 1 sur 2 ») | Après le clic d'achat | 14 | 6 | 8 | 9 | 6 | **7,1** | 2,9 | 41 | 14 |
| B10 | Fiche vidéo : « Analyse pédagogique complète » verrouillée | Sous la vidéo | ≈ 5 (plancher) | 4 | 6 | 8 | 4 | **5,2** | 4,8 | 24 | 15 |
| B12 | Résultat du quiz d'humour (/quiz-humour) | Après 12 questions | 8 | 6 | 8 | 7 | 8 | **7,4** | 2,6 | 21 | 16 |
| B9 | Fiche conseil : exercice verrouillé | Sous l'exemple concret | ≈ 3 (plancher) | 5 | 7 | 8 | 7 | **6,7** | 3,3 | 10 | 17 |
| B13 | Résultat du quiz d'onboarding (membres non abonnés) | Après 3 questions | n.c. (≈ 0 : comptes sans Premium) | 3 | 6 | 2 | 4 | **4,1** | 5,9 | n.c. | 18 |

**Moyennes.** Simple : **5,8**. Pondérée par l'exposition : **4,7** (l'en-tête, vu sur toutes les pages, pèse 56 % du total) ; **sans l'en-tête : 5,6**. Meilleurs : /abonnement 7,6, quiz 7,4, /register 7,1 (les pages où le visiteur est déjà décidé). Pires : en-tête 4,0, résultat du quiz d'onboarding 4,1, bloc d'accueil 4,3, bloc de fin d'article 4,5.

**Lecture d'ensemble.** Les blocs bien notés sont ceux que presque personne ne voit (/abonnement 22 vues, quiz 8, /register 14). Les blocs vus par tout le monde (en-tête, encarts, listes) sont les moins bien notés, et ceux qui sont le plus vus ne produisent aucun clic. Le problème n'est pas la finition des boutons (F moyen 7), c'est ce qu'on demande à qui, et quand (O moyen 5).

### 3 bis. Blocs secondaires non notés (code non relu en détail, inventaire du lot 2, trafic < 5 vues sur 28 j)

| Bloc | Libellé lu au lot 2 | Remarque |
|---|---|---|
| Carnet, fiches verrouillées | « S'abonner · 2,99 €/mois » | Lot 2 §4.4 : à passer en « Commencer à {prix} ». |
| Favoris (visiteur) | « Découvrir l'offre Premium » | Mur de la fonction favoris, trafic nul. |
| Fin du glossaire, À propos | « Commencer à 2,99 €/mois », « Accéder aux parcours complets » | Pages de lecture : même logique que le bloc d'accueil. |
| Profil (membre non abonné), page de retour de paiement, connexion | « S'abonner à 2,99 €/mois », « Voir Premium », « Créer mon compte et m'abonner » | Aucun trafic de visiteurs. |
| Lien d'accueil de la lettre | « Voir la lettre » | Placé après la carte Premium, discret (voir B18). |

**Un trou à signaler :** un compte créé sans abonnement (14 comptes en base, 2 abonnés de lancement) est un visiteur qui a lâché au paiement ; il n'existe aucune relance de ce moment (seul « Activer mon accès » dans l'en-tête). À traiter avec @legal (e-mail transactionnel ou commercial ?) : [NON NOTÉ].

## 4. Fiches par bloc, dans l'ordre de l'indice d'impact

Chaque fiche : où et quand · texte exact · forme · intention du visiteur · notes (critères dans l'ordre de la grille) · diagnostic · ce qui ferait cliquer les trois personas · direction (pas de rédaction finale) · **ce que la direction change par rapport aux textes validés**. Vecteurs de critères : T = T1-T2-T3-T4-T5, etc.

Rappel des protections : [CHOIX UTILISATEUR] « Accéder aux parcours complets » (E1, 06/10), « Commencer à {prix} » (étalon 1.1), « Créer mon compte » (2.1), « Lire la première étape gratuite » et ses déclinaisons (3.9 A, s17), « Tout débloquer » sur /vannes, « 1 500+ » (P0, non abordé ici), prix, 5 parcours, 14 jours sur le premier paiement seulement, étape 1 gratuite, pas de compte gratuit, pas de pop-up ni de barre collante dans les articles. Une proposition qui touche l'un d'eux le dit explicitement.

### B6. Bouton d'en-tête (rang 1, indice 7 098)

- **Où, quand** : en-tête de toutes les pages. Visiteur : ordinateur « Connexion » (fantôme) + « Commencer » (plein, petit) ; mobile : « Commencer » dès 360 px, « Connexion » dès 520 px ; menu mobile : les deux. Membre non abonné : « Activer mon accès ». Cible : `/register?src=header` (compte, puis paiement).
- **Texte exact** : « Commencer ». **Forme** : bouton plein violet, taille sm, 44 px en mobile. **Intention** : aucune en particulier, le visiteur lit un article ou une liste ; c'est un accès permanent.
- **Notes** : T 4 (1-0-1-0-2) · P 5 (1-2-0-1-1) · F 6 (1-2-2-0-1) · O 2 (0-0-1-1-0) → **G 4,0**.
- **Diagnostic** : c'est le seul appel dont un clic est mesuré (2 `abonnement-vu` en B avec `src=header`, 0 en A), et le plus exposé (1 183 pages vues). Mais il envoie un visiteur froid droit sur un formulaire (prénom, e-mail, mot de passe) avant qu'il ait vu le prix, une preuve ou l'alternative gratuite. Le mot « Commencer » désigne trois choses sur le site (entrer dans l'offre ici, acheter sur /abonnement, lire l'étape 1 dans /parcours : lot 2 §2.4). La page qui convertit le mieux quand on y arrive (/abonnement : 5 visiteurs sur 6 cliquent vers le paiement en B) n'est jamais la destination du bouton.
- **Ce qui ferait cliquer** : Yanis ne clique pas sur un bouton d'en-tête depuis un article de vannes. Sophie (jeune active, outillée, sait ce qu'est un abonnement) et Marc (cherche un parcours structuré) cliquent plus volontiers sur un bouton qui dit où il mène.
- **Direction** : (1) **tester la destination** : `/abonnement?src=header` au lieu de `/register?src=header`, libellé inchangé. Mesure : `abonnement-vu` puis `inscription-envoi` par `src=header`, sur 4 semaines, contre la période actuelle. (2) Ne pas réécrire le libellé avant ce test : le coût vient de la destination, et tout nouveau libellé repasse l'aveugle. Si un libellé qui nomme la destination est voulu, candidat à faire écrire : « Voir l'offre » (jamais « Premium » seul, que le visiteur ne connaît pas encore comme produit, lot 2 §4.3). (3) Ne pas retirer le bouton : seul clic mesuré.
- **Ce que ça change** : la décision s15 « tous les appels anonymes vont à /register, 1 saut » (mesurabilité du tunnel) : un saut de plus, mais vers la page qui montre le prix, le carnet, la garantie et l'étape gratuite. Aucun [CHOIX UTILISATEUR] touché, aucun texte changé.

### B1. Encarts au fil des articles (rang 2, indice 1 770, **0 clic sur 59 vues**)

- **Où, quand** : après un H2 choisi, vers 35 à 45 % du texte ; sur l'article n°1 deux encarts imposés : après « Quelles blagues sortir en soirée ? » (≈ 21 % de la page, vu par 56 % des lecteurs) et après « Quelles blagues au bureau ? » (≈ 32 %, vu par 16 %). Un encart par article ailleurs (34 articles, parcours par thème).
- **Texte exact (article n°1, milieu-1)** : surtitre « Parcours Répartie » ; titre « Et quand c'est toi qu'on chambre ? » ; texte « Une vanne se choisit à l'avance. Une réplique se trouve sur le moment, et le parcours Répartie t'y entraîne. » ; bouton « Lire la première étape gratuite de Répartie » → étape 1 de Répartie. (milieu-2 : « Drôle le samedi, ton de compte rendu le lundi ? » … « Lire la première étape gratuite de Boulot ».)
- **Forme** : carte sobre, filet violet à gauche, bouton **contour**, 44 px, pleine largeur en mobile, aucune image, aucune démonstration. **Intention** : le lecteur vient de lire des vannes de soirée ; il cherche des vannes à utiliser ou à envoyer, il est en mode divertissement.
- **Notes** : T 5 (1-1-1-0-2) · P 6 (0-2-1-2-1) · F 8 (1-2-1-2-2) · O 4 (0-1-2-1-0) → **G 5,5**.
- **Diagnostic** : exposition correcte (56 %), zéro clic, zéro vue de page parcours : la place n'est pas la cause principale. Trois causes cumulées. (1) **Proposition** : on demande de « lire une étape », donc du travail, à quelqu'un qui consomme du divertissement ; les 7 clics de sortie de la même période vont vers d'autres vannes (O1 0, O5 0). (2) **Texte sans preuve** : la différence « vanne / réplique » est une assertion, rien ne la montre (T4 0). (3) **Forme discrète** : un encart sobre au milieu d'un texte se lit comme un intertitre ; « vu à 50 % » ne dit pas « lu ». Le texte est pourtant bon sur le fond : il s'adresse à Yanis, avec l'accroche « Et quand c'est toi qu'on chambre ? ». Le risque est que l'article n°1 n'attire pas Yanis (requête « meilleures blagues drôles 2026 »).
- **Ce qui ferait cliquer** : **Yanis** : voir en cinq secondes, dans l'encart, la situation où il reste muet et la réplique qui l'aurait sauvé, avec une phrase qui dit pourquoi elle marche (il ne veut pas « apprendre », il veut ne plus rester bloqué). **Sophie** : une vanne de bureau décryptée en trois lignes (le lundi matin). **Marc** : n'arrive pas par cet article.
- **Directions** (à tester l'une après l'autre, pas ensemble) :
  - **D1a, démonstration sur place (recommandée en premier).** L'encart montre une vraie vanne du catalogue validé, liée à la section, avec son « Pourquoi ça marche » en deux ou trois lignes (déjà public sur la fiche), puis un lien vers la fiche de la vanne (suite de divertissement, ce que le lecteur clique déjà) où l'exercice verrouillé et l'étape gratuite attendent. Le copywriter écrit, relecture à l'aveugle (vanne du catalogue ou écrite pour l'occasion). **Ce que ça change** : la proposition de l'encart (étape 1 → fiche de vanne décryptée) et le bouton du milieu d'article ; le libellé [CHOIX] « Lire la première étape gratuite » n'est pas touché, il reste dans le bloc de fin, l'accueil, le quiz et /parcours. Les textes du lot 1 (2 sur 3 à l'aveugle) sont remplacés pour cet emplacement.
  - **D1b, forme seule, zéro texte.** Même encart, bouton plein au lieu de contour. **Ce que ça change** : rien d'écrit ; casse la règle « Premium plein, gratuit contour » du lot 2 (ce n'est pas un [CHOIX UTILISATEUR]) pour l'action gratuite sur trafic froid. Ne se lit proprement que seul.
  - **D1c, un seul encart.** Si milieu-2 reste à 16 % de vues sans clic, le supprimer et garder milieu-1 ; moins de bruit dans un article qui s'étire sur 18 écrans mobiles.
- **Règle de décision écrite d'avance** : au 21/10 environ (≥ 99 vues), 0 clic confirme « sous 3 % ». Lancer D1a. Garder la variante si ≥ 3 clics sur ≈ 60 vues (5 %), sinon passer à D1b, puis revoir la cible de l'article (voir §6). Avec 13 vues par jour, chaque variante prend une semaine pour dire « 0 » ou « pas 0 », rien de plus fin.

### B7. Murs des listes /vannes, /conseils, /videos (rang 3, indice 547)

- **Où, quand** : visiteur uniquement. (a) Bandeau **en haut** de /vannes ; (b) ligne « Filtres par catégorie disponibles avec l'abonnement Premium » (lien « Premium ») ; (c) cartes verrouillées floutées « Voir Premium » (ouvrent la fenêtre B11) ; (d) bloc de bas de liste avec bouton « Voir ce que contient Premium » (ouvre la fenêtre B11).
- **Texte exact** : « Aperçu gratuit : 10 vannes accessibles sans abonnement. » / « Passe à Premium à 2,99 €/mois : tout le catalogue, les filtres et les favoris. » / bouton plein sm « Tout débloquer » (→ /abonnement, [CHOIX]) ; bas de liste : « Accède à tout le catalogue pour 2,99 €/mois » + « Voir ce que contient Premium ».
- **Forme** : bandeau teinté, bouton plein sm ; cartes pointillées floutées sans contenu réel ; bloc centré de bas de liste, bouton plein sm. **Intention** : le visiteur veut plus de vannes ; la limite est le seul moment où il se heurte à un mur.
- **Notes** : T 4 (1-1-1-0-1) · P 6 (2-1-1-1-1) · F 6 (1-1-2-1-1) · O 5 (2-0-1-1-1) → **G 5,2**.
- **Diagnostic** : le mur vend du **volume** (« tout le catalogue »), alors que la valeur du produit est l'apprentissage (décision du 06/05 : « conseils > vannes », le produit s'apprend, il ne se vend pas). Et il est faible : chaque vanne a une fiche publique (décision du 04/10 : fiches lisibles sans compte), donc le visiteur peut contourner. Le bandeau du haut annonce la **limite avant** toute valeur, ce qui ressemble au « T'as touché la limite » écarté le 06/05. Trois destinations pour un même mur : /abonnement (bandeau), fenêtre (cartes, bas de liste). Cartes floutées sans rien de réel dedans : aucune démonstration.
- **Ce qui ferait cliquer** : **Yanis** : un mur qui dit ce qu'il y a derrière en termes d'usage (« l'exercice pour la sortir toi-même ») et non en volume. **Sophie** : idem avec le bureau. **Marc** : veut un parcours, pas un catalogue.
- **Direction** : (1) **déplacer le message de limite sous les 10 vannes** et ne garder en haut que ce qui sert (rien) : le libellé « Tout débloquer » [CHOIX] est conservé tel quel, seul son emplacement change. (2) Le mur de bas de liste vend ce qui est vraiment derrière (l'exercice « À toi de jouer » de chaque vanne, les parcours, le carnet) et propose à côté l'étape gratuite d'un parcours. (3) Une seule destination pour les murs de liste : /abonnement avec `src` et `returnTo`, la fenêtre étant réservée aux favoris et au vote. (4) Vérifier avant d'écrire qu'aucune phrase ne laisse croire que les fiches sont verrouillées (elles sont publiques). **Ce que ça change** : le bandeau du haut (supprimé ou déplacé), le texte du bloc de bas de liste, la destination des cartes ; protégés et intacts : « Tout débloquer », « Voir Premium » (lien court), prix, quotas 10/3/3.

### B2. Bloc de fin d'article (rang 4, indice 367, **vu par 5 % des lecteurs de l'article n°1**)

- **Où, quand** : après le corps (avant la FAQ sur 3 articles), suivi de la lettre B18 puis des articles liés. Atteint par 3 lecteurs sur 55 sur l'article n°1 (5 %), 3 sur 12 sur « phrases drôles » (25 %), 1 sur 6 sur « exercices » (17 %).
- **Texte exact (Répartie, version vue sur capture)** : surtitre « PARCOURS RÉPARTIE · 4 SEMAINES » ; titre « Ces techniques, travaille-les dans un parcours guidé » (l'article n°1 a son titre propre, config/blog-cta.ts, étalon 3.1, non relu ici) ; puces « Une étape par semaine, environ 20 minutes » et « Des situations que tu connais : le chambrage entre potes, la pique en TD, le raté à rattraper » ; bouton contour « Lire la première étape gratuite de Répartie » ; bouton plein « Accéder aux parcours complets » ; note « 2,99 €/mois, sans engagement. Cet article reste en lecture libre. »
- **Forme** : carte large, deux boutons empilés en mobile (contour puis plein), note en petit gris, puis la lettre dans la foulée. **Intention** : lecture terminée, départ imminent, mais 95 % sont déjà partis.
- **Notes** : T 4 (1-1-1-0-1) · P 5 (2-0-1-0-2) · F 7 (2-2-1-1-1) · O 3 (1-0-1-1-0) → **G 4,5**.
- **Diagnostic** : (1) **zone morte** : pour 95 % des lecteurs de l'article n°1 il n'existe pas. (2) Trois actions en cascade (étape gratuite, Premium, lettre) pour le lecteur qui arrive jusque-là, donc le plus chaud. (3) Le plein est « Accéder aux parcours complets » : abstrait pour un visiteur qui ne sait pas ce qu'est un parcours, sans ce qui se passe au clic (compte, puis paiement). (4) La note « Cet article reste en lecture libre. » répond à une question que personne ne se pose ; la vraie objection (« et si ça ne me va pas ? ») a sa réponse, déjà validée, ailleurs : le remboursement du premier paiement sous 14 jours (/abonnement, /register). (5) Aucune preuve.
- **Ce qui ferait cliquer** : le lecteur qui va jusqu'au bout est le plus engagé. **Yanis** : une dernière preuve (une réplique, une étape 1 décrite) puis un seul geste. **Sophie** : même chose avec le bureau.
- **Direction** : (1) **ne pas investir de texte ici avant d'avoir remonté l'ask** (B1) ; (2) remplacer « Cet article reste en lecture libre. » par le fait validé sur le remboursement (« premier paiement », jamais « remboursé » seul) ; (3) pour les 5 à 25 % qui arrivent au bas, **un seul bouton plein** : celui qui est la prochaine action naturelle (l'étape gratuite pour un lecteur qui n'a rien testé, jamais deux pleins) et Premium en lien texte E1 ; (4) la lettre B18 sort de la zone morte (voir B18). **Ce que ça change** : la note de l'étalon 3.1 (gardée au lot 1, 2 sur 3 à l'aveugle) et l'ordre contour/plein du bloc de fin (validé par Thomas le 13/10, « je valide tout ») ; le libellé E1 [CHOIX 06/10] reste, en lien texte ; aucun autre [CHOIX] touché. Tout texte neuf repasse l'aveugle.

### B4. Accueil, bloc « Tu crois avoir tout essayé pour être drôle ? » (rang 5, indice 291)

- **Où, quand** : visiteur, bas de l'accueil, juste au-dessus de la carte Premium (B5). **Texte exact** : titre « Tu crois avoir tout essayé pour être drôle ? » ; « {N}+ vannes, {N}+ conseils concrets et {N}+ vidéos analysées, le tout pour 2,99 € par mois, sans engagement. La seule chose que tu n'as pas encore essayée pour être plus drôle. » ; bouton plein « Accéder aux parcours complets » (→ /register) + note « 2,99 €/mois, sans engagement. » ; bouton contour « Voir les vannes gratuites » (→ /vannes). **Forme** : carte teintée, un plein, un contour. **Intention** : le lecteur a parcouru toute la page (cartes personas, articles) : curiosité réelle, pas encore de décision.
- **Notes** : T 4 (1-1-1-0-1) · P 5 (2-1-1-0-1) · F 6 (2-2-1-0-1) · O 3 (1-0-1-1-0) → **G 4,3**.
- **Diagnostic** : le texte vend du **volume** (comptes de vannes, conseils, vidéos) puis le bouton parle de **parcours** : la promesse et l'action ne se répondent pas. Il est empilé juste avant la carte Premium B5 : deux blocs d'offre, deux pleins, deux chemins vers /register (`src=accueil-cta` et `src=accueil-premium`), ce que @design avait déjà relevé en s20 (décision 6 restée ouverte). Le bouton contour « Voir les vannes gratuites » envoie vers la liste et son mur B7 : sortie vers un mur, pas vers la démonstration.
- **Ce qui ferait cliquer** : **Yanis** : sa situation dite dans ses mots (déjà au-dessus, dans les cartes personas). **Sophie** : idem. **Marc** : la carte « J'ai perdu ma légèreté » existe déjà plus haut ; ici rien pour lui.
- **Direction** : **fusionner B4 dans B5** (un seul bloc d'offre à l'accueil) ; garder l'accroche « Tu crois avoir tout essayé… » comme titre si elle passe l'aveugle sans le décompte de vannes ; l'alternative gratuite devient « Lire la première étape gratuite de {parcours}» (Répartie) au lieu de « Voir les vannes gratuites ». **Ce que ça change** : supprime un bloc et un plein ; aucun [CHOIX] touché (E1 et 1.1 restent) ; tranche la décision 6 de l'audit s20.

### B18. Lettre mensuelle (rang 6, indice 228 ; **la lettre n'était pas en ligne sur la période mesurée**)

- **Où, quand** : (a) **article**, juste après le bloc de fin (hors carte, filet au-dessus) ; (b) **résultat du quiz**, sous la carte ; (c) **/lettre** ; (d) accueil : ligne discrète après la carte Premium ; (e) menu « La lettre » et pied de page « La lettre du mois ». Masquée pour un abonné Premium connecté. Premier numéro le jeudi 05/11 à 8 h.
- **Texte exact (article)** : « Une vanne décryptée, chaque mois » ; « Tu la reçois par e-mail, avec un exercice pour t'entraîner. » ; champ « Ton adresse e-mail » ; case « Oui, je veux recevoir la lettre de Deviens Marrant une fois par mois. Elle contient une vanne décryptée et parfois une mention de Premium. Je peux me désinscrire en un clic, à tout moment. » ; bouton contour « Envoie-moi la lettre » ; « Gratuit, sans compte. » ; mention d'éditeur et lien « Confidentialité ». Accueil : « Voir la lettre → ».
- **Forme** : formulaire d'un champ, une case, un bouton **contour** (niveau 2 : le plein est réservé à Premium), 4 blocs de texte sous le titre. **Intention** : le lecteur qui n'achète pas, à l'instant où il va partir.
- **Notes** : T 6 (1-1-2-0-2) · P 6 (2-0-1-1-2) · F 8 (2-2-1-1-2) · O 7 (2-2-2-1-0) → **G 6,6**.
- **Diagnostic** : c'est le **seul bloc qui répond au 97 % de sortie** (audit s20 : « 0 moyen de recontacter un non-acheteur », 1,5/10), et sa proposition est la mieux calée du site sur l'intention (gratuit, sans compte, un e-mail, réversible). Deux faiblesses. (1) **Place** : posé après le bloc de fin, il n'est atteint que par ≈ 5 % des lecteurs de l'article n°1 : le meilleur filet de sécurité est sous la zone morte. (2) **Promesse mince** : « une vanne par mois » est peu face à la vanne du jour gratuite chaque jour ; ce qui la distingue (le décryptage et l'exercice) est dit en une demi-phrase ; rien ne montre à quoi ressemble un numéro (avant le 05/11, la page /lettre est vide). Le poids visuel vient de la case de consentement (exigence @legal, non touchée).
- **Ce qui ferait cliquer** : **Yanis** : voir un échantillon (une vanne, pourquoi elle marche, l'exercice) et savoir que ça tient en 2 minutes. **Sophie** : « à lire à la pause ». **Marc** : le rythme mensuel, sans pression, lui convient.
- **Direction** : (1) **sortir la lettre de la zone morte** : sur les articles longs, une ligne de lettre au niveau du second encart (≈ 16 % d'exposition) ou juste sous le premier, en ligne dans le texte, pas de pop-up ni de bandeau (décision 17/10) ; sur les articles courts, rien ne change. (2) **Montrer un numéro** : après l'envoi du n°1 (05/11), « À quoi ça ressemble » avec le vrai numéro, reliable depuis le bloc de l'article. (3) Ne pas réécrire la promesse avant d'avoir 4 semaines de `lettre-vu` / `lettre-confirmee` par emplacement : [CHIFFRES EN ATTENTE]. **Ce que ça change** : l'emplacement dans l'article (spec lettre §1.2 : « juste après le bloc de fin »), à faire valider par Thomas ; aucun texte validé réécrit.

### B3. Accueil, haut de page (rang 7, indice 214)

- **Où, quand** : premier écran, visiteur. H1 « Tu parles et personne rit. On va arranger ça. » ; « Tu restes muet quand on te chambre ? Tu galères à faire rire à la machine à café ? Tu voudrais retrouver ta légèreté ? On a les vannes, les techniques et les exercices. Toi, tu ramènes ta motivation. » ; « 1 500+ membres bossent leur humour. Rejoins-les. » ([CHOIX] P0, non abordé) ; bouton plein « Accéder aux parcours complets » ; « 2,99 €/mois, sans engagement. La première étape de chaque parcours reste en lecture libre. » ; lien souligné « Lire la première étape gratuite » ; 3 pastilles « Briller à la machine à café », « Avoir de la répartie », « Reprendre confiance en toi ».
- **Forme** : plein lg pleine largeur en mobile, lien de 44 px, pastilles bordées (cliquables). Sur mobile, l'en-tête ajoute un second plein « Commencer » au même écran. **Intention** : arrivée sur la marque ou exploration ; trafic faible (15 entrées en 4,2 jours).
- **Notes** : T 5 (2-1-1-0-1) · P 6 (2-2-1-0-1) · F 6 (1-2-2-0-1) · O 6 (1-1-1-2-1) → **G 5,8**.
- **Diagnostic** : la promesse est la meilleure du site pour Yanis (« muet quand on te chambre »), mais l'action phare est abstraite et envoie sur un formulaire de compte (F4 0). Le lien « Lire la première étape gratuite » **mène à Machine à Café** (le parcours le plus court, décision s17 UX-08), pas à Répartie, alors que le paragraphe commence par Yanis ; et le lien ne dit pas de quel parcours il s'agit (les pastilles, elles, nomment des situations). Cinq actions au premier écran mobile (« Commencer », bouton plein, lien, 3 pastilles).
- **Ce qui ferait cliquer** : **Yanis** : un lien qui dit « Répartie » ou « quand on te chambre » et non « un parcours ». **Sophie** : la pastille « Briller à la machine à café » (elle existe). **Marc** : « Reprendre confiance en toi » (existe) ; rien de plus.
- **Direction** : (1) faire pointer le lien gratuit vers l'étape 1 de Répartie, ou lui faire dire le parcours (patron « … de Répartie », déjà validé 3/3) ; (2) garder un seul plein par écran sur ordinateur (déjà vrai) et accepter les deux sur mobile (même destination). **Ce que ça change** : la destination décidée en s17 (parcours le plus court) ; le libellé [CHOIX] « Lire la première étape gratuite » n'est pas modifié si seule la destination change.

### B5. Accueil, carte Premium (rang 8, indice 204)

- **Où, quand** : bas de l'accueil, au-dessus de la FAQ. **Texte exact** : « Pour t'y mettre, il y a Premium » ; « Étudiant, jeune actif ou en train de tourner une page : tu trouves ici de quoi devenir drôle pour de bon, pas seulement le temps d'un apéro. » ; carte « Premium / 2,99 € TTC / mois / Sans engagement, annulable à tout moment · Droit de rétractation » ; 4 puces d'avantages ; bouton plein « Commencer à 2,99 €/mois » (→ /register puis paiement ouvert tout seul) ; « Tu as 14 jours pour te faire rembourser ton premier paiement, et tu résilies en ligne quand tu veux. » ; « Déjà 1 500+ inscrits, et toi ? » ([CHOIX] P0, non abordé).
- **Notes** : T 6 (1-2-1-0-2) · P 5 (1-0-1-1-2) · F 8 (2-2-2-0-2) · O 6 (1-1-1-2-1) → **G 6,0**.
- **Diagnostic** : bonne carte (prix, garantie, trois personas nommés dans l'intro), mais c'est une **seconde page d'achat** : elle ne montre ni l'annuel, ni l'extrait du carnet, ni la garantie « Tu annules quand tu veux » de /abonnement, et son bouton saute /abonnement (la page qui convertit le mieux une fois qu'on y est). « Sans engagement » est dit deux fois (ligne du haut et réassurance), alors que le lot 2 l'a retiré de /abonnement pour cette raison.
- **Direction** : un seul chemin d'achat canonique : soit le bouton va vers /abonnement, soit la carte reprend les ajouts du lot 2 (ligne annuelle, une seule mention « sans engagement »). À trancher avec la fusion de B4. **Ce que ça change** : texte de la ligne du haut seulement (réassurance déjà validée) ; E1 et 1.1 intacts.

### B11. Fenêtre Premium (rang 9, indice 97)

- **Où, quand** : ouverte par un cœur (favoris), un vote ou une carte verrouillée de liste. **Texte exact** : titre selon le geste (« Les favoris font partie de Premium », « Le vote sur les nouveautés fait partie de Premium », « Passe à Premium ») ; intro favoris : « Garder une vanne, un conseil ou une vidéo sous la main, ça fait partie de Premium. Avec, tu as aussi les 5 parcours en entier. » ; « 2,99 € TTC / mois » ; « Sans engagement, annulable à tout moment » ; les 4 avantages ; bouton plein « Créer mon compte et m'abonner » ; réassurance sur le premier paiement ; « Droit de rétractation ». **Intention** : garder une vanne ; elle est interrompue par un mur.
- **Notes** : T 7 (1-2-2-0-2) · P 6 (1-1-1-2-1) · F 7 (2-1-1-1-2) · O 4 (1-0-1-1-1) → **G 5,8**.
- **Diagnostic** : texte honnête (le bouton dit les deux gestes, compte puis paiement), mais le geste du visiteur (« garder ») ne reçoit aucune alternative, et la liste de quatre avantages, dont le premier tient sur huit lignes, repousse le bouton hors de l'écran sur un téléphone [À MESURER, pas de capture de la fenêtre]. Fonctionnement trop lourd pour ≈ 20 ouvertures par mois.
- **Direction** : n'afficher que l'avantage lié au geste (favoris : « tes favoris » + parcours), bouton visible sans défiler ; garder « Créer mon compte et m'abonner » (exception motivée du lot 2). **Ce que ça change** : la liste affichée dans la fenêtre seulement ; aucun libellé validé.

### B14. Fin de l'étape 1 gratuite et aperçus des étapes 2+ (rang 10, indice 70, **0 vue en A**)

- **Où, quand** : page d'un parcours, visiteur. Après le quiz de l'étape 1 : « Sans faute. » ou « 3 sur 4. Les explications sont là pour ça. », puis « Valider l'étape fait partie de Premium. » + bouton **plein** « Voir ce que contient Premium » (contour tant que le quiz n'est pas fini) + « 2,99 €/mois, sans engagement. ». Étapes 2+ : aperçu ouvrable (« Ce que tu vas apprendre », format) puis « Le conseil, les vannes, les vidéos et le quiz de cette étape font partie de Premium. » + bouton plein sm « Voir ce que contient Premium » + prix.
- **Intention** : le **sommet de la courbe de valeur** : le visiteur vient de lire une étape entière, de faire un quiz, il sait ce qu'est le produit.
- **Notes** : T 4 (0-1-2-1-0) · P 7 (2-1-2-1-1) · F 7 (2-2-1-1-1) · O 7 (2-1-1-2-1) → **G 6,3** (théorique : aucune visite en A).
- **Diagnostic** : le mur parle de **valider** (une mécanique : XP, progression), pas de ce que Yanis gagne à continuer ; il ne montre pas l'étape suivante (titre, promesse) alors que le texte d'aperçu existe déjà ; le libellé « Voir ce que contient Premium » est le libellé générique des murs de catalogue, pas un « continuer ». Rien ne félicite l'étape faite. Un plein par aperçu ouvert multiplie les mêmes boutons. Pas d'alternative pour qui n'est pas prêt (lettre). Le dernier point est aussi **un problème d'amont** : 0 visite de page parcours en 4 jours, donc ce bloc, le meilleur moment du funnel, n'est atteint par personne.
- **Ce qui ferait cliquer** : **Yanis** : « Étape 2 : » + ce qu'il va savoir faire (ses mots, pas ceux du produit) + un seul geste. **Sophie** : le gain de la semaine suivante. **Marc** : la progression, sans pression.
- **Direction** : (1) au-dessus de la phrase validée, une carte « Étape 2 » (titre et « Ce que tu vas apprendre » déjà publics, rien de payant dévoilé) ; (2) un seul plein à cet endroit ; (3) en repli discret, la lettre pour qui n'est pas prêt. **Ce que ça change** : ajoute une carte au-dessus de « Valider l'étape fait partie de Premium. » (étalon 4.1, validé s16, [CHOIX UTILISATEUR]) sans la modifier ; changer cette phrase elle-même exige l'accord de Thomas ; l'emplacement de la lettre (nouveau, hors des 3 prévus) aussi.

### B15. Page /parcours (rang 10, indice 70)

- **Où, quand** : liste des 5 parcours, visiteur. Par carte : difficulté, durée, rythme, titre, ligne de persona, description, **encart en italique** (exemple de membre fictif présenté comme tel, décision du 29/09), programme replié, bouton plein « Commencer ce parcours » (→ page du parcours, étape 1 en lecture libre).
- **Notes** : T 3 (2-0-0-1-0) · P 5 (2-1-1-0-1) · F 6 (0-2-2-2-0) · O 8 (2-2-2-1-1) → **G 5,6**.
- **Diagnostic** : la proposition est la bonne (étape 1 gratuite, sans compte), mais rien sur la page ne dit **où est la frontière** : pas de prix, pas de « étapes 2 à N avec Premium » (le badge « Lecture libre » est dans le programme replié). Le bouton est plein sur une action gratuite (cinq pleins dans la page) et son libellé est ambigu (lot 2 §4.4 ligne G9 prévoyait « Lire la première étape gratuite » pour le visiteur ; **non appliqué dans le code lu**, à confirmer). Aucun Premium n'est proposé sur la page.
- **Direction** : (1) appliquer G9 (déjà validé au lot 2) ; (2) une ligne par carte : « Étape 1 gratuite, étapes 2 à N avec Premium » ; (3) garder le plein sur l'étape gratuite (c'est ici la bonne action pour du trafic qui explore). **Ce que ça change** : rien de protégé ; applique une décision du lot 2.

### B8, B9, B10. Fiches vanne, conseil, vidéo (rangs 12, 17, 15 ; indices 66, 10, 24)

- **Fiche vanne (B8)** : sous le décryptage gratuit, bloc « À toi de jouer » : « L'exercice (consigne + exemple à réutiliser) fait partie de Premium. » + lien « Voir Premium » ; plus bas section « Comment la ressortir » : « Le meilleur moment ? Quand personne ne s'y attend. Retiens la structure (setup court + chute qui décale) et applique-la à ta propre situation. Les variantes et le parcours complet sont dans les parcours Premium. » + plein « Voir ce que contient Premium » + contour « Voir toutes les vannes ». **G 6,7** (T 5 : 1-0-2-1-1 · P 7 : 2-1-2-1-1 · F 8 · O 7).
- **Fiche conseil (B9)** : « À toi de jouer » : « L'exercice pour appliquer cette technique fait partie de Premium. » + plein « Voir ce que contient Premium » + contour « Voir tous les conseils ». **G 6,7**.
- **Fiche vidéo (B10)** : « Analyse pédagogique complète » : « Les points clés et l'exercice de cette vidéo font partie de Premium. » + plein + contour « Voir toutes les vidéos ». **G 5,2** (T 4 : on ne voit rien de l'analyse).
- **Intention** : le visiteur vient de lire le décryptage gratuit et veut l'appliquer : **c'est le moment où la démonstration de valeur est faite** (le « Pourquoi ça marche » public est le meilleur échantillon du produit). Les notes les plus hautes des blocs vus du site.
- **Diagnostic** : (1) **pas de prix ni de garantie** près des boutons (T2 0) : le visiteur clique « Voir ce que contient Premium » sans savoir à quoi s'attendre financièrement ; (2) **deux demandes en cascade** sur la fiche vanne (le lien de l'exercice, puis le bouton de « Comment la ressortir ») ; (3) **l'étape 1 gratuite n'apparaît que si la vanne est dans une étape de parcours** (quelques dizaines de vannes sur plusieurs centaines au catalogue : [À VÉRIFIER, ordre de grandeur lu dans les notes s17 et s20]) : sur les autres fiches, le visiteur n'a que le mur ; (4) « Les variantes et le parcours complet » : [À VÉRIFIER : des variantes existent-elles dans les parcours ? Sinon, promesse au-delà des faits, à retirer] ; (5) sur la vidéo, aucune trace de ce qui est derrière le mur.
- **Ce qui ferait cliquer** : **Yanis** : voir *une* ligne de l'exercice (« consigne » d'une phrase, sans l'exemple) ou son format (« 5 minutes, à tenter ce soir »), s'il est vrai pour cette vanne. **Sophie** : idem avec le bureau.
- **Direction** : (1) **fusionner** le lien d'exercice et la section « Comment la ressortir » en un seul bloc, avec un seul plein ; (2) **toujours** proposer l'étape 1 gratuite du parcours qui colle à la catégorie de la fiche (Répartie, Confiance…), pas seulement quand la vanne est dans une étape ; (3) une courte ligne de prix et de garantie près du plein (formules déjà validées) ; (4) vérifier la phrase « les variantes ». **Ce que ça change** : texte du bloc « Comment la ressortir » (non protégé), ajout de liens, aucun [CHOIX] touché (« Voir Premium » et « Voir ce que contient Premium » intacts).

### B16. Page /abonnement (rang 13, indice 53)

- **Où, quand** : visiteur, intention forte (5 sur 6 cliquent vers le paiement en B, volumes minuscules). **Texte exact** : surtitre « C'est pour toi si tu restes muet quand on te chambre. » ; H1 « Ta réplique pendant la soirée, pas dans le bus du retour » ; « 5 parcours pour t'entraîner, une étape par semaine, 15 à 20 minutes selon le parcours. La première étape de chacun reste en lecture libre. » ; carte « Premium » avec puces Mensuel / Annuel (badge « plus de 3 mois offerts »), « 2,99 € TTC / mois », « Ou 24,99 €/an, soit 2,08 € par mois et 10,89 € économisés par an. » ; plein « Commencer à 2,99 €/mois » ; « Tu as 14 jours pour te faire rembourser ton premier paiement, et tu résilies en ligne quand tu veux. » ; « Droit de rétractation · Paiement sécurisé par Stripe » ; avantages **sous** le bouton ; extrait du carnet « Le carnet, en vrai » (fiche « Le soleil dans l'ascenseur ») ; « Pas encore sûr ? Lis d'abord une étape » + 5 liens ; « Tu annules quand tu veux » ; FAQ. Sur capture 375 × 812 : bouton visible à y ≈ 600.
- **Notes** : T 7 (1-2-1-1-2) · P 8 (2-2-1-2-1) · F 9 (2-2-2-1-2) · O 7 (2-1-2-1-1) → **G 7,6**.
- **Diagnostic** : la page la plus travaillée (lot 2 validé 3/3 à l'aveugle). Marges restantes : (1) **le clic mène à un formulaire de compte** que rien n'annonce près du bouton (« Étape 1 sur 2 » n'apparaît qu'à l'arrivée sur /register) ; (2) **la preuve est sous le bouton** : l'extrait du carnet et l'étape gratuite viennent après la décision ; la valeur payante (étapes 2+) n'est montrée nulle part, alors que leurs aperçus sont publics dans /parcours ; (3) le surtitre ne parle qu'à Yanis, alors que `returnTo` indique déjà le parcours d'origine (Boulot, Machine à Café…) et sert déjà à adapter les liens « Pas encore sûr ? » ; (4) **un vide d'environ 60 px** entre la ligne annuelle et le bouton (réserve de hauteur de la ligne annuelle cachée, visible sur les captures 375 px) ; (5) première puce de huit lignes. Page vue 22 fois en 28 jours : à surveiller, pas à retoucher en priorité.
- **Direction** : (1) une phrase près du bouton qui dit ce qui suit (compte, puis paiement) : le copywriter écrit, aveugle ; (2) **réutiliser l'aperçu public de l'étape 2** du parcours d'origine comme preuve (titre et « Ce que tu vas apprendre » existent déjà) ; (3) surtitre variable selon `returnTo` (Sophie, Marc), chaque variante repassant l'aveugle ; (4) design : supprimer le vide ; (5) puce 1 en lignes courtes (lot 2 §5.2). **Ce que ça change** : le haut de page validé au tour 3 (surtitre) pour (3) seulement ; « Commencer à {prix} » [CHOIX 1.1] intact.

### B17. Page /register (rang 14, indice 41)

- **Texte exact** : « Étape 1 sur 2 » ; « Ton compte » ; rappel du plan ; champs Prénom, Email, Mot de passe (8 caractères) ; plein « Créer mon compte » ([CHOIX] 2.1) ; contour « S'inscrire avec Google » ; « Étape 2 : le paiement sécurisé, juste après. » ; « Tu as 14 jours pour te faire rembourser ton premier paiement. » ; CGU ; « Déjà un compte ? Connecte-toi ».
- **Notes** : T 6 (1-2-2-0-1) · P 8 (2-2-1-2-1) · F 9 (2-2-2-1-2) · O 6 (2-1-1-1-1) → **G 7,1**.
- **Diagnostic** : étapes annoncées, garantie rappelée, honnête. Marges : **trois champs** dont le prénom, alors que les e-mails ont déjà un repli sans prénom ; Google (le plus rapide pour un étudiant sur téléphone) est **sous** le formulaire (décision du 05/10, navigateurs intégrés des réseaux : à ne pas rouvrir) ; aucune sortie vers l'étape gratuite pour qui hésite devant le mot de passe. Volume 14 vues en 28 jours.
- **Direction** : prénom facultatif ou demandé après le paiement (@ux et @fullstack, effet sur la personnalisation des e-mails à vérifier) ; lien discret « Lire d'abord la première étape gratuite ». **Ce que ça change** : champ du formulaire, ajout d'un lien ; « Créer mon compte » [CHOIX 2.1] intact.

### B12. Résultat du quiz d'humour (rang 16, indice 21)

- **Texte exact** : profil (« L'Observateur » …), « Ta force », « Le conseil pour progresser », partage, « Ton point de départ : » + « Parcours Confiance » + raison personnalisée ; bouton **contour** « Lire la première étape gratuite » ; bouton **plein** « Accéder aux parcours complets » (→ /abonnement avec retour au parcours conseillé) ; puis la lettre (B18) et un long texte SEO.
- **Notes** : T 6 (2-1-1-1-1) · P 8 (2-1-2-1-2) · F 7 (2-2-1-1-1) · O 8 (2-2-2-2-0) → **G 7,4**.
- **Diagnostic** : le meilleur bloc du site : proposition de divertissement (deux minutes, résultat personnel, partageable), parcours conseillé avec sa raison, étape gratuite à un clic. Limites : le bouton gratuit ne nomme pas le parcours (il est dans la carte juste au-dessus), le plein Premium est la dernière action alors que le visiteur découvre le produit ; **8 vues, 1 quiz terminé en 28 jours** : c'est l'entrée la moins promue du site alors que c'est la forme d'appel qui colle le mieux à un lecteur de vannes.
- **Direction** : (1) le promouvoir comme sortie des articles de vannes (c'est la proposition qui répond à l'hypothèse n°1 du §1 : divertissement d'abord, parcours ensuite) ; (2) pour trafic froid, étape gratuite en plein et Premium en lien (même test que B1/D1b) ; (3) nommer le parcours dans le bouton gratuit (patron validé). **Ce que ça change** : emplacement du quiz dans les articles (nouveau bloc, voir §6) ; libellés [CHOIX] intacts.

### B13. Résultat du quiz d'onboarding (rang 18, bloc mineur)

- **B13 résultat du quiz d'onboarding (membres non abonnés)** : seul appel Premium = lien gris xs « Tout débloquer à 2,99 €/mois », visuellement plus faible que « Refaire le quiz » ; c'est pourtant l'audience la plus chaude (compte créé, paiement non fait). **G 4,1**. Direction : même bouton que le reste (E1 ou « Active mon accès · {prix} » pour un membre), en plein, et une relance du compte non payé (voir §3 bis). Trafic ≈ 0, ne pas y passer de temps avant la relance.

## 5. Priorités

### 5.1 Classement par indice d'impact (exposition × écart à 10)

| Rang | Bloc | Indice | Pourquoi ce rang |
|---|---|---|---|
| 1 | B6 en-tête | 7 098 | Vu sur toutes les pages, seul clic mesuré, mauvaise destination probable |
| 2 | B1 encarts d'articles | 1 770 | 56 % d'exposition, 0 clic : le plus gros écart mesuré |
| 3 | B7 murs des listes | 547 | Seul mur vu en nombre, mais vend un volume et se contourne |
| 4 | B2 bloc de fin | 367 | Zone morte (5 %), forte demande en cascade |
| 5 | B4 accueil, « Tu crois avoir tout essayé » | 291 | Doublon de B5, promesse et bouton qui ne se répondent pas |
| 6 | B18 lettre | 228 | Seul filet pour les 97 % qui partent, mais placé dans la zone morte |
| 7 à 8 | B3 haut d'accueil, B5 carte Premium | 214, 204 | Trafic faible, bon fond |
| 9 à 18 | B11, B14, B15, B8, B16, B17, B10, B12, B9, B13 | ≤ 97 | Peu de visites ; bons ou à compléter |

### 5.2 Classement retenu (trois priorités, avec l'indice corrigé par ce que disent les chiffres)

1. **B1, les encarts au fil des articles.** Ce n'est pas le plus gros indice, mais c'est le seul bloc dont l'échec est **mesuré** et le seul où une hypothèse (proposition ≠ intention) peut être testée cette semaine. Si le premier encart ne déclenche pas de clic à 56 % d'exposition, rien en aval ne change.
2. **B6, l'en-tête.** Plus gros indice, coût de test minimal (une destination, aucun texte, pas d'aveugle), seul appel avec un clic mesuré.
3. **B2 + B18, le bas des articles (bloc de fin et lettre).** Deux blocs, une même cause : ils sont atteints par ≈ 1 lecteur sur 20 de l'article n°1. La lettre est le filet le mieux calé sur l'intention et se trouve sous la zone morte.

Puis : **B4 + B5 (un seul bloc d'offre à l'accueil)**, **B7 (murs de liste)**, **B14 (fin d'étape 1)** dont la valeur est pilotée par le trafic amont (B1, B2, B3, B12 : si les encarts ne mènent à rien, B14 ne verra personne), puis les fiches B8 à B10.

### 5.3 Ordre d'exécution (par dépendances, pas par sprints)

| Étape | Action | Dépend de | Texte neuf ? | Mesure |
|---|---|---|---|---|
| 0 | Mise en ligne du lot 2 et de la lettre (décision du 17/10, déjà prise) | | non | Le bilan du 10/11 lira un effet combiné : le dire dans le rapport |
| 1 | **B6 : destination `/abonnement?src=header`** (config seule) | rien | non | `abonnement-vu` et `inscription-envoi` par `src=header`, 4 semaines |
| 2 | Préparer **D1a** (encart avec vanne décryptée) : copywriter, aveugle | rien (peut démarrer maintenant) | oui | |
| 3 | Vers le 21/10 (≥ 99 vues sans clic) : mettre D1a en ligne ; règle : ≥ 3 clics sur ≈ 60 vues, sinon D1b (forme seule), sinon revoir la cible | 2 | oui | `blog-cta-clic` par `data-blog-cta` et par emplacement |
| 4 | Bas d'article : lettre remontée, note du bloc de fin, un seul plein | accord de Thomas (spec lettre) | oui (note) | `lettre-vu`, `lettre-confirmee` par emplacement : [CHIFFRES EN ATTENTE] |
| 5 | Accueil : fusion B4 dans B5, lien gratuit vers Répartie | accord de Thomas (décision 6 s20) | oui (léger) | `abonnement-clic` `src=accueil-*` |
| 6 | B14 : carte « Étape 2 » ; B15 : application de G9 ; B8 à B10 : un seul plein, étape gratuite sur toute fiche | 3 (pour que ces pages reçoivent du trafic) | oui | `mur-vu` par type, `parcours` vues par `src` |
| 7 | Après le 05/11 : un vrai numéro de lettre montré dans les blocs | n°1 envoyé | non | |

**Premier levier activable en moins de 24 h avec les agents : l'étape 1** (destination de l'en-tête, aucun texte, aucune relecture à l'aveugle, une ligne dans `REPLIT_ACTIONS.md`). Le 2 démarre en parallèle (copywriter).

## 6. Ce qui traverse tous les blocs

**6.1 Qui est le lecteur de l'article n°1 ?** 43 à 50 % des entrées du site viennent d'une requête de vannes (google.com 402 visiteurs sur 683 en B) ; FR 435, mais aussi US 59 et CN 53 visiteurs (probablement hors cible, [HYPOTHÈSE]). Tant qu'on ne sait pas si ce lecteur est Yanis, on ne sait pas si l'échec du 0/69 vient du bloc ou du trafic. À lire par @data-analyst : pages par visite de ces lecteurs, part mobile, part FR, 6 sorties vers les thèmes (Soirées, Famille, Gaming) comme signal d'intention. Si ce lecteur est « chercheur de vannes », les encarts doivent prolonger le divertissement (fiche décryptée, quiz, thème), pas demander un apprentissage.

**6.2 Une règle de hiérarchie par température (hypothèse à tester, pas une règle à appliquer).** Aujourd'hui : « Premium en plein, gratuit en contour » partout, y compris pour un lecteur froid qui n'a rien testé : le seul plein qu'il voit est un abonnement. Proposition : **le plein est la prochaine action naturelle de CE visiteur** : trafic froid (articles, résultat du quiz, /parcours, accueil) → étape gratuite en plein, Premium en lien texte ; trafic chaud (/abonnement, fin d'étape 1, murs d'exercice des fiches, fenêtre) → Premium en plein. Elle va dans le sens de la décision du 06/05 (« le produit s'apprend, il ne se vend pas »). Preuve externe faible : les rares références trouvées comparent essais et freemium en SaaS, pas des visiteurs froids d'un site de contenu ; ce n'est qu'un indice. **Ce que ça change** : la règle de forme du lot 2 (ce n'est pas un [CHOIX UTILISATEUR]) et rien d'écrit ; à tester seule (D1b), après D1a.

**6.3 La chaîne de preuve est cassée.** Quatre pièces de preuve existent sans rien inventer : (i) le « Pourquoi ça marche » public d'une vanne ; (ii) la fiche offerte du carnet (déjà sur /abonnement) ; (iii) les aperçus publics des étapes 2+ ; (iv) l'étape 1 elle-même. Elles sont à peine utilisées là où le visiteur décide : encarts (aucune), bloc de fin (aucune), murs (aucune), fiches (aucune), /abonnement (seulement la fiche du carnet, sous le bouton). Il n'y a pas de témoignage réel : les exemples fictifs sont autorisés s'ils sont présentés comme tels (« Imagine Tom, 21 ans… », décision du 29/09).

**6.4 L'objection de Yanis n'est traitée que sur les pages où il est déjà décidé.** Sa vraie question est « est-ce que ça marche pour moi, et pourquoi créer un compte et payer sur un site que je ne connais pas ? ». Les faits disponibles : étape 1 lisible sans compte ; remboursement du **premier** paiement sous 14 jours ; résiliation en ligne ; sur Boulot, chaque exercice a une « version sans risque ». Ils apparaissent sur /abonnement, /register, la fenêtre et la carte d'accueil, **pas** dans les encarts, le bloc de fin (qui dit « Cet article reste en lecture libre ») ni les fiches. Aucune promesse de résultat n'est écrite ici et aucune ne doit l'être.

**6.5 Libellés.** Après le lot 2, la dispersion des libellés n'est plus le problème. Restent : « Commencer » (en-tête, ambigu), « Commencer ce parcours » (hub, ligne G9 du lot 2 non appliquée dans le code lu), « Accéder aux parcours complets » (E1, [CHOIX 06/10]) très abstrait pour un visiteur froid : sa place naturelle est en lien texte, pas en plein, sur trafic froid.

**6.6 Couverture des personas.** Yanis : B1, B3, B16, B2 (Répartie), B12. Sophie : B1 (Boulot, Machine à Café), pastille « Briller à la machine à café », B2 par parcours. Marc : pastille « Reprendre confiance en toi », carte personas, intro de B5 ; **aucun bloc d'appel ne lui parle en propre** (pas de surtitre /abonnement, pas d'encart hors des articles Confiance). À traiter après les trois priorités.

**6.7 Mesure à compléter avant le 10/11** (rapporté par le fichier de chiffres) : `checkout-ouvert` et `checkout-echec` n'ont jamais été codés ; `abonnement-vu` sous-compté en B (9 pour 22 pages vues) ; trafic de Thomas encore compté (2 pages vues `/admin` en A, hausse de `mur-vu` de 0,8 à 4,8 par jour non vérifiable) ; paiements Stripe non lisibles par l'API d'admin. À ajouter : chaîne par source (`src`) article → page parcours → `mur-vu` `parcours-validation` → `abonnement-vu` ; propriété `data-blog-cta` (étape 1 ou abonnement) dans `blog-cta-clic` (à vérifier dans `blog-article-tracking`) ; `lettre-vu` / `lettre-confirmee` par emplacement.

## 7. Unités économiques (hypothèses, pas de données)

| Grandeur | Valeur | Statut |
|---|---|---|
| CAC | 0 € : acquisition 100 % organique (budget acquisition 0 €) | donnée du projet |
| Prix | 2,99 € TTC par mois, soit ≈ 2,49 € HT avec une TVA à 20 % | calcul |
| Churn mensuel | [HYPOTHÈSE : 5 à 10 % par mois, ordre de grandeur de niche pour des abonnements grand public d'applications, source tierce non auditée, à remplacer par les données Stripe après 30 jours] | hypothèse |
| LTV | ≈ 2,49 € ÷ 0,075 ≈ 33 € (fourchette 25 à 50 €) | [HYPOTHÈSE] |
| LTV:CAC | non défini (CAC nul) : la contrainte n'est pas le coût d'acquisition, c'est le **volume** et la conversion | |
| Cible à 6 mois | 1 000 € de MRR ≈ 330 abonnés actifs à 2,99 € | calcul |
| Flux requis à l'équilibre | 330 abonnés × 7,5 % ≈ **25 nouveaux abonnés par mois** ; avec ≈ 690 visiteurs par mois, ≈ **3,7 % de visiteurs qui paient** | calcul sur [HYPOTHÈSE] |

Lecture : à la conversion observée (0 abonnement créé en 4,2 jours, 1 en 28 jours dont un probable test), l'écart avec la cible ne se comble pas par des retouches de boutons seules : il faut **à la fois** une conversion plus haute (ce document) et plus de visiteurs de la bonne cible (SEO et GEO, hors périmètre). Ces seuils arbitrent entre canaux, ils ne tranchent pas le GO du projet (valeur persona, CLAUDE.md n°5). Références : benchmarks de churn et de conversion trouvés par recherche web (RevenueCat, CrazyEgg), tous secondaires, non vérifiés sur des sites de contenu à trafic froid ; il n'existe pas de concurrent direct en ligne en français (project-context), donc pas de standard concurrent documenté à dépasser.

## 8. Ce que chaque proposition change par rapport aux textes validés

| Proposition | Touche | Statut du touché | Accord requis |
|---|---|---|---|
| B6 : destination de l'en-tête | décision s15 « tout vers /register » | décision d'agent, pas [CHOIX] | non (test), informer Thomas |
| B1 D1a : démonstration dans l'encart | textes du lot 1 des encarts (2 sur 3 à l'aveugle) ; libellé du bouton du milieu d'article | validé à l'aveugle, pas [CHOIX] ; « Lire la première étape gratuite » [CHOIX] intact ailleurs | non, mais aveugle obligatoire |
| B1 D1b / § 6.2 : plein pour l'étape gratuite (froid) | règle de forme du lot 2 | pas [CHOIX] | non, informer |
| B2 : note du bloc de fin, un seul plein, lien E1 | note étalon 3.1 ; ordre contour/plein du lot 1 (« je valide tout » du 13/10) | validé par Thomas ; E1 [CHOIX 06/10] conservé en lien texte | **oui** |
| B18 : lettre remontée dans l'article | spec lettre §1.2 (« juste après le bloc de fin ») | décision de spec, Thomas a validé la place | **oui** |
| B4 + B5 : fusion à l'accueil | texte de B4 ; décision 6 de l'audit s20 | ouvert | **oui** |
| B3 : lien gratuit vers Répartie | destination s17 UX-08 | décision d'agent | non, informer |
| B7 : bandeau du haut déplacé | emplacement seulement ; « Tout débloquer » [CHOIX] intact | | non, informer |
| B14 : carte « Étape 2 » au-dessus du mur | ajout ; étalon 4.1 non modifié | [CHOIX] s16 intact | non ; modifier la phrase du mur : **oui** |
| B14 / B18 : lettre en fin d'étape 1 | nouvel emplacement (spec : 3 emplacements) | | **oui** |
| B16 : phrase près du bouton, surtitre par parcours | haut de /abonnement validé 3/3 (tour 3) | validé à l'aveugle | non, aveugle obligatoire |
| B17 : prénom facultatif | champ du formulaire | exigence s16 (repli sans prénom déjà prévu) | non, @ux et @fullstack |
| B12 : quiz promu dans les articles | nouveau bloc d'article | | **oui** (pas de pop-up ni de bandeau) |

Aucune proposition ne touche à « 1 500+ », au prix, aux quotas, aux 14 jours (premier paiement seulement), à l'absence de compte gratuit, à l'identité du fondateur, ni ne promet au-delà des faits. Aucune fausse urgence ni faux chiffre.

## 9. Limites et décisions pour Thomas

- **Les notes ne sont pas des mesures.** Le seul chiffre solide : 0 clic sur 69 vues d'encart, borne haute ≈ 4,3 % ; tout le reste est à relire au 10/11 puis à J+28 de chaque changement. Un test A/B n'est pas faisable à ce volume ; le séquentiel donne un ordre de grandeur, pas une preuve.
- **Pages sans visite** : /parcours/*, /abonnement (3 vues en A), /register, fenêtre : notes théoriques, relues sur le code et les captures.
- **Non lu** : fenêtre Premium sur capture, page Stripe, menu mobile ouvert (captures présentes, non notées), blocs secondaires du §3 bis.
- **À trancher par Thomas** : (1) destination de l'en-tête ; (2) fusion B4 dans B5 ; (3) place de la lettre dans l'article et en fin d'étape 1 ; (4) note et ordre du bloc de fin ; (5) feu vert pour tester l'encart « vanne décryptée » (D1a) dès ≥ 99 vues sans clic ; (6) relance d'un compte créé sans paiement (avec @legal).

## 10. Handoff

**Handoff → @orchestrator** (puis @copywriter pour D1a, @fullstack pour l'étape 1, @data-analyst pour la mesure du §6.7)
- Fichier produit : `/home/user/Marrant/docs/growth/audit-cta-s21.md`.
- Note moyenne : 5,8 (simple), **4,7 pondérée par l'exposition**, 5,6 hors en-tête ; le meilleur : /abonnement 7,6, le pire : en-tête 4,0.
- Trois blocs prioritaires : (1) encarts au fil des articles (0 clic sur 69 vues, proposition à changer avant le texte), (2) bouton d'en-tête (destination), (3) bas d'article (bloc de fin et lettre, zone morte à 5 %).
- Ce qui manque le plus : une **démonstration de la valeur au moment du choix** (aucune preuve dans les blocs froids) et la **mesure par bloc et par source** (`checkout-*` jamais codés, trafic de Thomas encore compté).

Sources (recherche web, secondaires, non vérifiées sur un site de contenu) : [RevenueCat, State of Subscription Apps 2024](https://www-docs.revenuecat.com/state-of-subscription-apps-2024/) · [RevenueCat, churn des apps par abonnement](https://www.revenuecat.com/blog/growth/subscription-app-churn-reasons-how-to-fix.md) · [CrazyEgg, Free-to-Paid Conversion Rates Explained](https://www.crazyegg.com/blog/free-to-paid-conversion-rate/). Données internes : `docs/data/cta-chiffres-s21.md`, `docs/marrant/audit-conversion-s20/donnees/`, `docs/marrant/audit-conversion-s20.md`, `docs/copy/lot2-boutons-abonnement-s21.md`.
