# Niveaux et XP, tour 3, relecteur @ux (à l'aveugle) : `docs/espace-client/niveaux-xp-s24.md` (v3)

> Relu en entier (résumé, 1 à 5, annexes A et B). Références : mon tour 2, brief s24 §3.2 bloc 4, `architecture-contenu-v11.md` (placement), fait donné par la session : « palier » n'apparaît dans aucun texte client.
> Limites : pas de lecteurs réels (le test des 3 secondes est un raisonnement explicite, voir 3) ; je n'ai pas relu le code ni la v12 pour la place de la série [NON VÉRIFIÉ].

## 1. Notes (même grille)

| Critère | T1 | T2 | T3 | Justification courte |
|---|---|---|---|---|
| Lisibilité (où en suis-je en 3 secondes) | 7 | 8 | 9 | Le mot « palier » passe le test (section 3) ; le nom du palier porte le sens, le mot n'est qu'une étiquette ; résumé réécrit en langage simple |
| Motivation sans pression | 7 | 8 | 9 | Noms de chemin, jamais un talent ; courbe « Tu avais une réponse ? » protégée ; rien de débloqué ; jamais de baisse, exception bornée (Q6) |
| Affichage dans l'espace | 6 | 8 | 8 | Place dite (Parcours après les étapes faites), écart avec le brief assumé, série non placée mais signalée ; reste le voisinage « palier n sur 5 » / « étape n sur 6 » (section 3) |
| Noms au ton maison | 6 | 7 | 8 | Ma base E1 est reprise, le test de vérité est écrit ; mais la reco présente encore un nom que le document juge lui-même faux, et une preuve du palier 5 est inexacte (correction 1) |
| Accessibilité | 5 | 9 | 9 | Pastilles masquées, texte porteur, `aria-live` 5 s, contrastes, 44 px, aucun émoji ; rien à ajouter |
| Cohérence avec v11, v12, décisions | 6 | 9 | 7 | Critère 11, phrase « tes étapes et tes bonus » et seuil de l'audit se contredisent ; la correction « tout de suite » ne ferme pas la faille avant la réponse à Q1 ; « palier » encore noté [À VÉRIFIER] alors qu'il est vérifié |
| Qualité des questions | 7 | 8 | 8 | Ordre bon, options marquées ; Q4 B et C sans leurs seuils |

**Note globale : 8,3 / 10** (58 sur 70). T1 : 6,3 ; T2 : 8,1.

## 2. Statut de mes 8 corrections du tour 2

| # | Sujet | Statut | Commentaire |
|---|---|---|---|
| 1 | Noms qui disent une compétence (bloquant) | Traité, **reste une faille** | 2.1 et 3.4 : principe, E1 repris tel que proposé, test (4) écrit. Mais le test, passé par le rédacteur, trouve « Tu as pris ton rythme » fragile, et la reco de Q3 l'imprime quand même (« si le test l'exige » : il l'a déjà exigé). Voir correction 1 |
| 2 | Comptes aux XP irréguliers (bloquant) | Traité sur le fond, **deux incohérences** | 2.6 est complet (lecture seule, liste montrée en session, jamais commitée, comptes de test à part, seule exception marquée). Voir corrections 2 et 3 |
| 3 | Mot « cap » | OK | Trois mots comparés, reco « palier », repli « cap ». Le test des 3 secondes est fait ici (section 3) |
| 4 | Actions de l'API, appelants, unicité visible | OK avec réserve | Actions et montants listés, appelant unique, route supprimée si Q1 = B, « un conseil relu ne repaie plus ». Réserve : l'ordre « tout de suite » (correction 3) |
| 5 | Où vit la série | OK | « Après les étapes faites » seulement, série non placée, signalée pour la v12 |
| 6 | Résumé technique | OK | Deux phrases claires, mot « palier » expliqué (puce 6) |
| 7 | Critère 4 et textes validés | OK | Parenthèse sur « X XP gagnés sur N » |
| 8 | Pastilles et lecteurs d'écran | OK | 3.0 point 1 et critère 7 |

## 3. Test des 3 secondes : « palier », « cap », « repère », écran « Aujourd'hui » à 375 px

**Situation réelle.** Selon la v3, rien du palier n'est dans « Aujourd'hui » (écart assumé avec le brief §3.2 bloc 4). Le mot n'y apparaît qu'au moment d'un passage : « Nouveau palier : {nom}. » (annonce `aria-live` de 5 s). Je teste donc les deux cas : la phrase de passage, et la carte si Thomas suit le brief et la veut dans « Aujourd'hui ».

**Largeur.** 375 px moins 2 marges de 16 px = 343 px utiles ; texte 16 px, environ 8 px par caractère en moyenne, soit 40 à 42 caractères par ligne ; avec les cinq pastilles (environ 90 px) sur la même ligne il n'en reste que 31 : les pastilles passent donc sur leur propre ligne, au-dessus ou au-dessous du texte.

| Test | palier | cap | repère |
|---|---|---|---|
| Phrase de passage : « Nouveau palier : tu enchaînes. » / « Nouveau cap : … » / « Nouveau repère : … » | 31 caractères, une ligne, claire | 27, une ligne, claire | 33, une ligne, mais « nouveau repère » ne dit pas qu'on a avancé |
| Carte : « palier 3 sur 5 · Tu as pris ton rythme » (37 caractères) | une ligne, 305 px sur 343 | une ligne | une ligne |
| Lu seul, sans contexte (3 secondes) | « 3 sur 5 » indique une place sur une échelle ; « palier » dit une marche d'escalier ou une étape de progression | « cap 3 » peut se lire comme un cap de boussole ou « franchir un cap » (un seuil) ; le « sur 5 » rattrape à moitié | neutre mais vide : ne dit pas qu'on a avancé |
| Contresens possible | **« palier » dit aussi plateau** (« je suis sur un palier » = je stagne, usage courant en sport et en régime) | cap = direction, pas une position | aucun |
| Voisinage avec les mots déjà à l'écran | **« étape n sur 6 » dans le même écran « Parcours »** : deux compteurs « n sur m » en synonymes d'escalier | aucun | aucun, mais « repère neutre » (compteur de cartes) existe déjà |
| Texte agrandi à 200 % (WCAG 1.4.4) | passe à la ligne, sans troncature si le conteneur n'a pas de hauteur fixe | idem | idem |

**Verdict : « palier » gagne, sous deux conditions.**
1. **Jamais seul** : toujours « palier 3 sur 5 » (le « sur 5 » écarte le sens « plateau », qui ne se lit que sans échelle) et le nom du palier en premier, le mot en second : « Tu as pris ton rythme » puis « palier 3 sur 5 ». Le sens est porté par le nom, le mot n'est qu'une étiquette.
2. **Le risque que la v3 ne voit pas n'est pas « marche » mais « étape »** : sous la liste des étapes faites, « étape 3 sur 6 » et « palier 3 sur 5 » se suivent. Mitigation : le palier n'a jamais de compteur d'étapes à côté, et la carte est séparée par un intitulé (« Ton palier »). À vérifier au premier rendu réel de @design.
« Cap » reste un repli correct, sans collision. « Repère » est écarté (ne dit pas l'avancée, déjà pris). Aucun lecteur réel n'a été consulté : le test est un raisonnement, à confirmer par Thomas et un proche de Yanis sur l'écran réel.

## 4. Corrections nouvelles

### Bloquantes

**1. [BLOQUANT] Le test de vérité des noms est passé, mais pas appliqué, et une preuve est inexacte.**
Passages : 3.4 « E1 palier 3 fragile » ; 3.5 « avec “Tu es bien parti” au palier 3 si le test l'exige » ; Q3 reco « Tu as pris ton rythme » ; 3.4 « E1 palier 5 vrai (au moins quatre parcours, donc au moins 19 étapes) » ; 3.1 « aucun n'atteint le palier 5 avant au moins 19 semaines ».
Problème : (a) le document trouve lui-même que « Tu as pris ton rythme » est faux pour qui valide quatre étapes le même jour (300 XP suffisent), puis le laisse dans la reco présentée à Thomas. (b) Reconnaître 2 300 XP ne demande pas quatre parcours : Confiance (800), Storytelling (800) et Boulot (700) font exactement 2 300, soit 18 étapes. « Au moins quatre parcours, donc 19 étapes » est faux ; « 19 semaines » devient « 18 ». Le nom « Tu connais la maison » reste défendable (18 étapes sur 25), mais la preuve écrite pour lui est inexacte, et « terminer quatre parcours quelconques y fait arriver » (3.1) est une condition suffisante, pas nécessaire.
Correction : trancher dans la v4 : palier 3 = « Tu es bien parti » (vrai dès les premières validations, sans promettre une durée) ; Q3 et 3.5 listent ce nom, plus de « si le test l'exige ». Réécrire la preuve du palier 5 : « 2 300 XP = au moins 18 étapes (trois grands parcours) ; terminer quatre parcours quelconques y fait arriver » ; corriger « 19 semaines » en « 18 » (3.1, section sur Sophie, Yanis, Marc : revérifier chaque cumul). Vérifier à l'aveugle que « Tu es bien parti » et « Tu te lances » (palier 2) ne se lisent pas comme un doublon.

**2. [BLOQUANT] Critère 11, phrase « tes étapes et tes bonus » et seuil de l'audit se contredisent.**
Passages : 3.0 « 412 XP : tes étapes et tes bonus de parcours » (après l'audit) ; 2.6 « Irrégulier = écart supérieur à 10 × le nombre de conseils actifs ; les écarts plus petits ne sont pas listés (règle actuelle) » ; critère 11 « Aucun compte n'a plus d'XP que ses étapes et ses bonus ne le justifient » ; Q1 B « les XP déjà gagnés restent ».
Problème : un abonné honnête qui a ouvert 30 conseils a 300 XP de conseils. Il n'est pas listé (écart < 1 200), ses XP restent, et la phrase « 412 XP : tes étapes et tes bonus de parcours » est fausse pour lui, avec ou sans audit. Le critère 11 est aussi infaisable tel qu'écrit (son écart de 300 est toléré par 2.6). Le seuil 1 200 mélange en outre deux populations : la règle actuelle repaie à chaque rechargement, donc un abonné honnête peut dépasser 1 200 sans API ; « irrégulier » (et « triche » dans le résumé) juge une faute là où il n'y en a pas.
Correction : (a) phrase neutre et vraie pour tous les comptes : « 412 XP gagnés depuis ton arrivée » (ou « voir le détail ») ; le détail « dont X sur tes étapes et bonus de parcours » seulement quand l'écart est nul. (b) Critère 11 : « aucun compte de la liste 2.6 n'a d'écart sans décision écrite de Thomas ». (c) Remplacer « irrégulier » par « écart inhabituel » dans 2.6, 2.4 et Q6, et dire dans Q6 que l'écart peut venir de la règle actuelle (rechargements), pas d'une faute.

**3. [BLOQUANT] La correction « tout de suite » ne ferme pas la faille avant la réponse à Q1.**
Passages : 2.5 point 1 (« le serveur fixe le gain ; conseil lu (10) seulement si Q1 = A ou C ») et point 2 (anti-doublon « seulement si Q1 = A ou C ») ; 2.6 « suit la correction 2.5 pour que la liste ne grossisse plus » ; 1.1 vitesse « 300 XP par minute ».
Problème : tant que Q1 n'a pas de réponse, le point 1 laisse l'action « conseil lu » à 10 XP, sans unicité (point 2 n'existe pas encore). Un script appelle la route 30 fois par minute avec ce montant fixe : 300 XP par minute, « Légende » en 17 minutes, exactement comme avant. La liste de l'audit grossit donc jusqu'à la réponse de Thomas, ce que la phrase de 2.6 dit éviter.
Correction : fermer la faille sans trancher Q1 : « tout de suite » = gain serveur fixe **et** gel provisoire de l'action « conseil lu » (0 XP jusqu'à la réponse), ou unicité par conseil dès maintenant (ce qui coïncide avec A et C, et se supprime avec B). Dire lequel dans 2.5 et dans le résumé (« dès maintenant, lire un conseil ne rapporte plus de points en boucle »). Mettre à jour le critère 1.

### Non bloquantes (pour 10/10)

**4. [À VÉRIFIER] devenu un fait.** 1.4 (« palier n'a pas été recherché… ») et 3.4 (tableau « Collision ») disent encore le contraire de ce que la session a vérifié (aucun texte client ne contient « palier »). Mettre les deux à jour, y compris la note de bas de tableau « textes client non recherchés ».

**5. Q4 B et C sans leurs seuils.** Thomas choisit une distance sans voir les cinq seuils. Donner pour chaque option : A 0, 100, 300, 700, 2 300 ; B 0, 100, 300, 700, 1 600 (à recalculer sur le garde-fou 80 % : 1 600 = 52 % de 3 100) ; C 0, 100, 500, 1 500, 3 100 [HYPOTHÈSE de calage]. Et dire que « environ quatre parcours » (A) vaut « trois grands parcours ou quatre » (voir correction 1).

**6. C4 dite à Thomas en clair.** Annexe B point 3 demande de lui dire que C4 a été prise sans savoir que lire un conseil rapporte des points ; Q1 B ne le dit pas, seule la puce 1 du résumé le suggère. Ajouter une phrase en tête de Q1 : « Ta décision du 12/11 sur les points a été prise avant que nous voyions que lire un conseil en rapporte déjà. »

**7. Série et brief.** 3.0 renvoie à la v12 [À VÉRIFIER] pour la série. Donner la réponse (lue dans la v12), ou écrire que la série est absente de « Parcours » et « Aujourd'hui » et que l'écart avec le brief concerne aussi la série.

**8. Pastilles et couleur.** 3.0 point 2 dit « pastille pleine contre contour » : ajouter que le contour a le même contraste 3:1 que la pastille pleine, sinon un état « contour » à fond clair disparaît pour un daltonien ou en mode contraste élevé.

## 5. Ce qui reste solide

- Quatre sources d'XP, totaux 3 100 et 4 300, vitesses ; 2.6 : audit en lecture seule, liste montrée en session, jamais commitée ; exception à « jamais de baisse » bornée.
- Règle écrite : « Tu avais une réponse ? » ne rapporte ni XP ni palier (critère 8).
- Spécification d'accessibilité de 3.0 et critère 7 ; Annexe A fidèle (chaque numéro de mon tour 2 est traité à un endroit précis).
- Q5 (rien de débloqué, reco) et la liste « jamais » du résumé.

## 6. Verdict

Presque prêt pour Thomas. Trois bloquants courts : appliquer le test de vérité au nom du palier 3 et corriger la preuve du palier 5 (1) ; rendre vraies la phrase XP et le critère 11 pour les comptes honnêtes (2) ; fermer la faille « tout de suite » sans attendre Q1 (3). Le reste est de la précision.
