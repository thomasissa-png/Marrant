# Niveaux et XP, tour 2, relecteur @ux (à l'aveugle) : `docs/espace-client/niveaux-xp-s24.md` (v2)

> Relu en entier (résumé, sections 1 à 5, annexes A et B). Références : mon tour 1, `architecture-contenu-v11.md`, `architecture-contenu-v12.md` (décisions du 12/11 : C4, Q6, Q9, cloche), brief s24 §3.2 (bloc 4 : étapes faites et série avant XP et niveau, dans « Aujourd'hui »), `founder-preferences.md` (29/09 : FAQ « 50 XP par semaine » ; 06/05 ; 07/10 ; 18/10 et 19/10).
> Limite : je n'ai pas relu le code ; je recompte les chiffres du document et je juge la cohérence.

## 1. Notes (même grille qu'au tour 1)

| Critère | T1 | T2 | Justification courte |
|---|---|---|---|
| Lisibilité pour l'abonné (3 secondes : où en suis-je ?) | 7 | 8 | « cap 3 sur 5 » en cinq repères et en toutes lettres, l'XP dans une phrase ou derrière « voir le détail », phrase de passage unique : lisible ; le mot « cap » est à tester (« cap 3 » peut se lire comme un cap de boussole) |
| Motivation sans pression ni culpabilité | 7 | 8 | Pas de pourcentage, pas d'XP restants, jamais de baisse, aucune relance, rien de débloqué, courbe « Tu avais une réponse ? » protégée par une règle écrite (Goodhart) ; entamé par des noms qui affirment un talent (voir 3, point 1) |
| Affichage dans l'espace (« Aujourd'hui », « Ton mois », Parcours) | 6 | 8 | Placement clair et assumé (Parcours après les étapes faites et la série, « Ton mois » plus tard, pas dans « Aujourd'hui », rendu côté navigateur pour l'abonné) ; « la série » n'a pas de lieu dans « Parcours » (point 5) |
| Noms au ton maison | 6 | 7 | Les noms de scène sont supprimés, « cap » règle la collision ; la reco E1 est la plus proche de la marque mais ses verbes (« Tu rebondis », « Tu tiens la conversation ») disent une compétence que l'XP ne prouve pas, contre 2.3 du document lui-même |
| Accessibilité | 5 | 9 | Ma spécification est reprise en entier (5 repères, état hors couleur, `aria-live` poli 5 s, fermable, contrastes, 44 px, aucun émoji, bulle comprise) et devient le critère 7 |
| Cohérence avec v11, v12 et les décisions du 12/11 | 6 | 9 | Le fait des 10 XP par conseil est intégré partout (1.1, 1.2, 2.5, Q1), C4 « déjà décidé », FAQ « 50 XP » intacte, cloche sans notification de cap, annexe B pour porter la correction dans l'architecture ; reste le cas des comptes qui ont déjà des XP irréguliers |
| Qualité des questions à Thomas | 7 | 8 | Cinq questions dans le bon ordre (Q1 fixe le total), trois options, réouvertures marquées (Q2 C, Q5 C), plus de doublon avec C4 ; le résumé reste technique par endroits |

**Note globale : 8,1 / 10** (57 sur 70). T1 : 6,3.

## 2. Statut de mes 9 corrections du tour 1

| # | Sujet | Statut | Commentaire |
|---|---|---|---|
| 1 | Lecture d'un conseil (10 XP), « conforme à C4 » faux | OK | 1.1 liste les quatre sources (étape, bonus, conseil ouvert, appel libre) ; totaux recalculés (3 100 ; 4 300 avec les conseils) ; vitesses justes (300 XP par minute au plus par clics, 15 000 à la main ; 5 000 en moins de 20 minutes, 2 300 en moins de 8) ; correction de sécurité (2.5) ; Q1 à trois options ; C4 dit « règle existante, non tranchée » |
| 2 | Noms de carrière de scène | OK sur le registre, voir point 1 | Plus aucun mot de scène, noms découplés des règles (Q2 et Q3 séparées), cap 1 non passif ; mais les verbes de E1 affirment une compétence |
| 3 | Inventaire des textes publics et de l'app | OK avec réserve | Table en 1.4 (FAQ « 50 XP » intacte, bulle, cinq phrases, filtre des conseils, `project-context`) ; e-mails, pages d'offre, App Store, app iPhone restent [À VÉRIFIER] par @fullstack (pas de recherche plein texte possible ici : dit honnêtement) |
| 4 | Accessibilité absente | OK | 3.0 points 1 à 5 + critère 7 |
| 5 | Placement, brief Q9, pages publiques, « Aujourd'hui » | OK | 3.0 : après les étapes et la série, rendu pour l'abonné connecté seulement, absence dans « Aujourd'hui » dite comme un écart assumé |
| 6 | Parcours non publiés | OK | 1.1 (2 300 sans Storytelling, 2 400 sans Boulot) et garde-fou 3.0 qui échoue si un parcours est dépublié |
| 7 | Forme des questions | OK | Q4 de C4 supprimée, Q2 distingue règle et noms, effet sur le test des 80 % dit dans Q4, Q5 C marquée |
| 8 | Phrase de passage | OK | « Nouveau cap : {nom}. » sans promesse |
| 9 | « 412 XP » sans échelle | OK | « 412 XP : tes étapes et tes bonus de parcours » ou « voir le détail » (voir point 2 pour une réserve) |

## 3. Corrections nouvelles

### Bloquantes

**1. [BLOQUANT] Les noms recommandés (E1) disent une compétence que le cap ne mesure pas.**
Passages : 3.4 E1 « Tu t'échauffes, Tu te lances, Tu rebondis, Tu places tes vannes, Tu tiens la conversation » ; 2.3 « Un cap fondé sur les XP dit seulement “tu as avancé dans les parcours” » ; 2.1 « Comique : un verdict de talent que rien ne prouve (XP déclarés) » ; 3.4 « Les plus exposés : “Tu tiens la conversation” (la plus proche d'un verdict) ».
Problème : le document rejette « Comique » parce que l'espace affirmerait un talent sans preuve, puis propose pour le cap 4 et 5 des verbes d'aptitude. « Tu rebondis » dit à l'abonné qu'il sait rebondir ; « Tu tiens la conversation » qu'il tient une conversation ; or le cap 4 s'atteint en finissant un grand parcours (XP déclaratifs), pas en prouvant quoi que ce soit. C'est le même verdict, écrit à la 2e personne. Le document le sent (« à tester ») sans le corriger. Seule la série E3 (marches) décrit un fait, parce que la règle C mesure un fait.
Correction : avec les règles A ou B, des noms qui disent ce qu'on a fait ou où l'on en est, pas ce qu'on sait faire, par exemple pour les seuils 0, 100, 300, 700, 2 300 : « Tu t'échauffes », « Tu te lances », « Tu as pris ton rythme », « Tu enchaînes », « Tu connais la maison » (le dernier correspond à « quatre parcours »). À passer aux trois tests déjà écrits (se comprend en 3 secondes ; ni rang ni verdict ; les trois personas s'y reconnaissent) et à un quatrième : « ce que dit le nom est-il vrai pour quelqu'un qui vient de valider l'étape qui le fait monter ? ». Garder E1 actuel comme témoin de comparaison, pas comme reco.

**2. [BLOQUANT] Les comptes qui ont déjà des XP irréguliers ne sont pas audités avant le recalcul unique.**
Passages : 2.5 « (3) les XP déjà acquis ne sont jamais retirés » ; 3.0 « Caps existants : recalculés une fois, vers le haut seulement » ; 3.0 « 412 XP : tes étapes et tes bonus de parcours » ; 1.1 (aucun anti-doublon côté serveur pour les conseils, montant libre).
Problème : tant que l'API accepte un montant libre et que le conseil se repaie à chaque chargement, l'XP d'un compte peut dépasser ce que les parcours permettent (les comptes de test de Thomas, un abonné curieux). Après la correction de sécurité et le retrait des 10 XP, ces comptes garderaient un cap 5 « Tu connais la maison » sans avoir fait un parcours, et la phrase « 412 XP : tes étapes et tes bonus de parcours » serait fausse pour eux. Le document pose « jamais de baisse » sans prévoir ce cas.
Correction : avant tout recalcul, une lecture en base (lecture seule) des comptes dont l'XP dépasse le total gagnable (3 100 ou 4 300) ou la somme de leurs étapes et bonus ; liste donnée à Thomas ; décision de sa part, case par case (laisser, ou recalculer l'XP sur les étapes et bonus réels avec son accord explicite : c'est la seule exception à « jamais de baisse », à marquer). Ajouter ce contrôle à la liste de @fullstack en 5, et le critère « aucun compte n'a plus d'XP que ses étapes et ses bonus ne le justifient, sauf décision écrite de Thomas ».

### Non bloquantes (à traiter pour 10/10)

**3. Le mot « cap » (lisibilité).** « Cap 3 sur 5 » peut se lire comme un numéro de cap de boussole ; « franchir un cap » dit un seuil, pas une position. Passer le mot au test de 3 secondes avec deux alternatives : « palier » (« palier 3 sur 5 ») et « repère » (« repère 3 sur 5 »), sans oublier que « palier » existe déjà dans l'architecture (paliers de lecture P1 à P3, interne) et « marche » dans les missions. Garder « cap » seulement s'il gagne.

**4. Correction de sécurité : clients de l'API et actions.** 2.5 (1) « le serveur fixe le gain selon l'action » : lister les actions et leurs montants (étape, bonus, conseil si Q1 A) ; [À VÉRIFIER @fullstack] qui d'autre appelle `POST /api/user/xp` (app iPhone, autre composant), car la route cesse d'accepter un montant ; idempotence (même conseil, même compte, une ligne). Le dire « sans te la demander » est juste pour le montant libre ; l'unicité par conseil est une règle visible (un conseil relu ne repaie plus) : l'écrire en une phrase dans le résumé.

**5. « Après les étapes faites et la série » dans « Parcours » (affichage).** 3.0 place le cap après la série, mais v11 n'affiche pas de série dans « Parcours » ni dans « Aujourd'hui » (le repère neutre « 12 cartes cette semaine » est dans « Aujourd'hui » ; la série en jours de pratique d'affilée vit au profil). Dire où la série apparaît, ou écrire « après les étapes faites » seulement.

**6. Résumé pour Thomas : un passage technique.** La première puce parle d'« anti-doublon », de « navigateur qui annonce le montant », de « 30 appels par minute ». Réécrire en deux phrases claires : « Aujourd'hui, n'importe quel abonné peut s'attribuer des points, et lire un conseil rapporte 10 points à chaque fois. Le niveau le plus haut s'atteint donc en quelques minutes. » ; et ajouter une ligne qui dit ce que « cap » veut dire (l'échelle des points, à ne pas confondre avec la difficulté des parcours).

**7. Critère 4 et textes validés.** « Aucun pourcentage ni XP restants » vaut pour la carte du cap ; le texte validé « X XP gagnés sur N » (parcours) reste. Le préciser en critère pour qu'un relecteur ne le prenne pas pour une contradiction.

**8. Les cinq repères pour un lecteur d'écran.** 3.0 dit « lisible sans attribut de valeur » ; préciser que les pastilles sont décoratives (masquées) et que le texte « cap 3 sur 5 » porte l'information, pour éviter une double annonce.

## 4. Ce qui reste solide (à garder)

- Section 1.1 (quatre sources d'XP), 1.2 (aucun plafond réel aujourd'hui), les recomptes : 3 100 = 2 600 + 500 ; 4 300 ; 2 300 = 74 % de 3 100 ; 3 000 = 70 % de 4 300 ; 1 200 = 39 % de 3 100.
- Règle écrite : la réponse à « Tu avais une réponse ? » ne rapporte ni XP ni cap (2.3, critère 8).
- Questions : ordre, options, réouvertures marquées, « déjà décidé » listé, « tranché sans question » borné.
- Spécification d'accessibilité en 3.0 et critère 7 ; annexe B pour porter la correction dans l'architecture.

## 5. Verdict

Presque prêt. Deux bloquants courts : remplacer les verbes de compétence de la reco de noms par des noms qui disent ce qu'on a fait (1), et auditer les XP déjà irréguliers avant tout recalcul (2). Le reste est de la précision.
