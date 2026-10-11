# Itération 2, notation UX sur captures (@ux, s17, 07/10/2026)

Brief compris : noter /10 le rendu réel du tour 2 (`docs/qa/captures-parcours-apprentissage-s17/iter-2/`) et statuer sur UXV-1-01 à 11. Textes validés et `[CHOIX UTILISATEUR]` non re-questionnés. Aucun fichier touché hors ce rapport.

Captures lues (une à une, vues 375 de préférence) : accueil visiteur et Premium, arrivées accueil / blog / fiche vanne, liste visiteur et Premium (page entière), aperçu étape 2, quiz (bonne, mauvaise réponse visiteur et MàC Premium, fin visiteur), Répartie étapes 1 à 4 après validation, fin et rechargement, Confiance étapes 1, 3, 5, fin et rechargement, MàC étape 1, 2, fin, `resultat-carte-validee`, profils vérifié et non vérifié, ancre et interrupteur du rappel, arrivée « Reprendre », focus clavier (en-tête, réponse, Valider, rappel), « On valide… », bouton désactivé, chargement / échec / après « Réessayer », 1280 étape 3 et fin MàC. Non lus : les 768, les doublons 1280 des écrans déjà vus à 375.

## 1. Note globale : 9,2 / 10 (tour 1 : 7,0 ; audit initial : 4,2)

| Critère | T1 | T2 | Justification courte |
|---|---|---|---|
| Compréhension immédiate | 8 | 9,5 | Accueil : bouton, prix, « Lire la première étape gratuite » en lien lisible de 44 px. Arrivées : repère « PARCOURS CONFIANCE · 6 SEMAINES » au-dessus de l'étape 1. Fin de quiz visiteur : un seul bouton plein, « Refaire le quiz » en retrait |
| Continuité du chemin | 7 | 9 | Terminé rechargé : bilan et « Passer au parcours Confiance » juste sous la barre, étapes repliées. « Reprendre » (accueil, liste, profil) ouvre bien l'étape 3. Retire 1 point : chargement et échec d'une étape Premium remettent la progression à 0/4 sans message (UXV-2-01) |
| Retour d'action | 6 | 9 | « +75 XP gagnés ! » et la date dans la carte validée, visibles sans défiler, aux étapes 1 à 6 et à 375 comme à 1280. Retire : bouton « On valide… » et bouton désactivé peu lisibles (UXV-2-02), échec de validation non capturé |
| Motivation à revenir | 6,5 | 9 | Date conseillée vue à chaque étape ; interrupteur du rappel juste sous « Mes parcours », ancre qui amène dessus avec focus ; plus d'invitation vers du vide. Retire : sélecteur de jour actif interrupteur éteint (UXV-2-03) |
| Mobile 375 | 7,5 | 9,5 | Aucun débordement, cartes validées calées sous l'en-tête (pas de texte coupé), cibles 44 px, bilan lisible. Page Premium encore longue (UXV-2-05) |
| Accessibilité perçue | 7 | 9 | Focus violet visible prouvé sur en-tête d'étape, réponse, « Valider », interrupteur ; « Série » en violet lisible ; correction du quiz par coche / croix + texte + lettre. Retire : contraste du bouton désactivé, focus après validation non capturé |
| Cohérence promesse / écran | 8,5 | 9,5 | « Environ 15 / 20 min, hors vidéos », « 475 / 800 / 325 XP bonus compris », date, prix « 2,99 €/mois, sans engagement » près de chaque bouton Premium : tout est vrai à l'écran. Reste une phrase de bilan à confirmer (UXV-2-04) |

Ce n'est pas 10 : un bloquant restant (UXV-2-01, connu, en correction) et quatre finitions. Après UXV-2-01 corrigé et prouvé par capture, les finitions 02 et 03 suffisent à viser 10 ; 04 à 06 sont à trancher ou facultatives.

## 2. Statut de UXV-1-01 à 11

| ID | Statut | Capture / preuve |
|---|---|---|
| 01 gain d'XP et date cachés | RÉGLÉ | `p-375-repartie-etape2-apres-validation-vue`, `etape3-...`, `p-375-confiance-etape3/5-...-vue`, `p-375-machine-a-cafe-etape2-...-vue`, `p-1280-repartie-etape3-...-vue`, `p-375-resultat-carte-validee` : texte persistant dans la carte repliée, étape suivante ouverte juste dessous. Zone `aria-live` et focus après validation non prouvables sur capture (voir UXV-2-06) |
| 02 rappel sans interrupteur | RÉGLÉ | `p-375-rappel-arrivee-ancre` (section à l'écran, focus visible), `p-375-profil-verifie` (ordre : Mes parcours, Rappel, Abonnement, Supprimer), `p-375-rappel-coche` (« C'est noté. »), `p-375-profil-non-verifie` (aucune invitation, aucune contradiction) |
| 03 terminé rouvert sur étape 1 | RÉGLÉ | `p-375-repartie-termine-apres-rechargement` (barre, carte de fin + bilan, puis « Le programme » replié), idem Confiance `-vue` |
| 04 fin de quiz visiteur | RÉGLÉ | `v-375-repartie-quiz-fin-visiteur` : « Refaire le quiz » outline, un seul bouton plein « Voir l'offre Premium », filet, prix. Titre « Petit quiz pour t'entraîner » cohérent |
| 05 entrée blog | RÉGLÉ | `v-375-entree-blog` : « Lire la première étape gratuite » plein, même libellé qu'accueil et fiche. « Passer à Premium » (CTA de fin d'article, étalon) reste plein 100 px plus bas : acceptable, deux blocs distincts |
| 06 arrivée #etape-1 | RÉGLÉ | `v-375-accueil-vers-etape1`, `v-375-entree-blog-arrivee` : carte sous l'en-tête, repère de parcours et durée au-dessus du titre |
| 07 prix au moment de décider | RÉGLÉ | « 2,99 €/mois, sans engagement. » sous le bouton dans `v-375-repartie-apercu-etape2` et fin de quiz |
| 08 lien d'accueil | RÉGLÉ | `v-375-accueil` : lien gras blanc souligné violet, zone de toucher correcte |
| 09 profil : série, textes | RÉGLÉ | `p-375-profil-verifie` : « Série », « 1 jour de pratique d'affilée » en violet lisible, « Niveau Farceur atteint. Le prochain se gagne en pratiquant. », une seule carte « Reprendre » |
| 10 captures manquantes | PARTIEL | Fournies : MàC Premium (étapes 2, fin, « Léa » à l'étape 1 à l'arrivée), mauvaise réponse, focus, « Reprendre », accueil et liste Premium, Confiance 3 et 5, rechargé, interrupteur, carnet (`p-1280-trois-parcours-fin-bilan`). Manque : voir UXV-2-06 |
| 11 liste répétée | RÉGLÉ | `v-375-parcours-liste-vue` : titre, quiz, cartes. `p-375-parcours-liste-premium` : Répartie « Terminé » 4/4 « Revoir ce parcours », Confiance 2/6 « Continuer ce parcours », MàC « Commencer » |

## 3. Nouveaux écarts

### UXV-2-01 [BLOQUANT, connu, en correction] Chargement et échec d'une étape Premium
- Captures : `p-375-etape-echec-reessayer` (barre « 0/4 étapes complétées », étapes 2 à 4 « Termine l'étape 1 pour débloquer », ni message ni « Réessayer » à l'écran) ; `p-375-etape-chargement` ne montre que le pied de page (cadrage faux, rien à juger). Après « Réessayer » (`p-375-etape-apres-reessayer`) tout revient : le défaut est donc transitoire mais affiché comme un recul.
- Effet : Yanis à l'étape 3 voit « 0/4 », croit avoir tout perdu, quitte. C'est la peur n°1 d'un parcours gamifié.
- Attendu : (1) pendant le chargement, la barre, les coches et la progression restent exactement comme avant ; la carte de l'étape en cours affiche son titre + « Chargement de l'étape… » (`aria-busy`, bloc de 3 lignes grises, pas de saut de page) ; (2) échec : message DANS la carte, sous le titre, `role="alert"` : « Impossible de charger l'étape. Ta progression est intacte. » + bouton « Réessayer » à 44 px ; (3) jamais d'état « verrouillé » déduit d'une donnée absente : inconnu = neutre, pas bloqué ; (4) capture à fournir : chargement lent (≥ 3 s, avec la progression visible en haut de vue) et échec avec le message et le bouton à l'écran. Textes à faire écrire par @copywriter.

### UXV-2-02 [FINITION] Bouton désactivé et « On valide… » peu lisibles
- Captures : `p-1280-bouton-desactive-quiz-a-finir`, `p-1280-on-valide` : texte gris moyen sur violet foncé, contraste estimé autour de 2,5:1 (mesure à faire par @design). Le message « Termine le quiz pour valider cette étape » est la seule explication du blocage.
- On fait : texte clair (≥ 4,5:1) sur fond atténué, ou fond surface avec contour violet ; garder `aria-disabled` plutôt que `disabled` pour que le lecteur d'écran lise l'explication. « On valide… » : même traitement + petit indicateur de chargement. Fichier probable : `parcours-step-card.tsx`.

### UXV-2-03 [FINITION] Rappel : sélecteur de jour actif alors que l'interrupteur est éteint
- Captures : `p-375-rappel-arrivee-ancre` (interrupteur éteint, « Choisis un jour »), `p-1280-focus-rappel` (éteint, « lundi » déjà affiché : deux états initiaux différents selon la capture).
- Effet : Marc choisit un jour, croit avoir programmé, n'a rien. Le message « C'est noté. » n'apparaît qu'à l'allumage.
- On fait : sélecteur masqué (ou `disabled` et grisé) tant que l'interrupteur est éteint ; à l'allumage, jour par défaut = lundi, sélecteur actif, « C'est noté. » annoncé. Option : pour le compte non vérifié, une ligne « Vérifie ton e-mail pour recevoir un rappel » plutôt que le silence (copy à écrire). Fichier : `profil/rappel-parcours-toggle.tsx`.

### UXV-2-04 [À CONFIRMER, pas de note retirée] Même chute de bilan sur les trois parcours
- Captures : `p-375-machine-a-cafe-fin-bilan`, `p-375-repartie-fin-bilan`, `p-375-confiance-fin-bilan` : « Le plus dur, maintenant, c'est de ne pas le raconter à tout le monde. » Pour Machine à Café (Sophie), dont la promesse est de raconter une anecdote qu'on écoute, la phrase dit presque l'inverse. Si c'est un étalon validé par Thomas, on laisse. Je n'ai pas pu vérifier dans les textes (recherche indisponible). Question à poser à Thomas, pas une correction.

### UXV-2-05 [FINITION faible] Liste Premium : le quiz d'orientation reste en tête
- Capture : `p-375-parcours-liste-premium` : un abonné qui a déjà 2 parcours entamés (Répartie terminé, Confiance 2/6) voit « Quel parcours est fait pour toi ? » avant ses cartes ; les cartes commencent à environ 430 px sous le bouton « Reprendre ton parcours ».
- On fait : si au moins un parcours est commencé, passer le quiz en bas de liste sous « Pas sûr de ton prochain parcours ? ». Fichier : `app/(dashboard)/parcours/page.tsx`.

### UXV-2-06 [PREUVE MANQUANTE, bloque le 10 sur 3 points]
1. `p-375-etape-chargement` et `p-375-machine-a-cafe-etape1-avant-validation-vue` sont cadrées sur le pied de page (le second ne montre pas « Valider cette étape »).
2. Où va le focus clavier après « Valider » (capture 1280 avec l'anneau sur la carte suivante) et annonce `aria-live` (texte du `sr-only` visible dans le DOM, ou test).
3. Échec de la validation elle-même (réseau coupé au clic) : message et bouton, saisie du quiz conservée.
Les 768 n'ont pas été relus ; je ne note pas la tablette.

## 4. Passage par persona (375 px)

- **Yanis visiteur** : accueil, lien gratuit, étape 1, quiz, mauvaise réponse (« Pas tout à fait » avec la bonne réponse et l'explication), mur avec prix : compris sans aide, une seule action pleine au moment de décider.
- **Yanis Premium** : valide, voit le gain et la date tout de suite, enchaîne ; fin Répartie claire avec la suite Confiance. Seule crainte : UXV-2-01.
- **Sophie** : MàC en trois étapes, « Léa » à l'étape 1, « Environ 15 min, hors vidéos », fin avec lien vers le carnet. UXV-2-04 à trancher.
- **Marc** : « Reprendre l'étape 3 » depuis accueil, liste et profil arrive bien sur l'étape 3 ; Confiance 3 à 5 avec gain et date, bilan de fin avec 6 acquis. Le rappel est trouvable (UXV-2-03 à corriger). À l'arrivée sur l'étape 3, aucun repère de parcours n'est à l'écran (le repère n'existe que sur l'étape 1) : mineur, le profil l'a déjà dit.

## 5. Ordre de correction

UXV-2-01 (bloquant, preuve en capture), puis 02 et 03, puis 06 (captures), puis 05. UXV-2-04 : question à Thomas. Aucun point ne touche un étalon ou un `[CHOIX UTILISATEUR]` ; les textes nouveaux d'UXV-2-01 et 03 passent par @copywriter.

## 6. Vérifié / Non vérifié

Vérifié : tous les écrans listés en tête, à l'œil, vues 375 en priorité. Non vérifié : contrastes mesurés (estimation visuelle), annonce lecteur d'écran, 768, texte exact des étalons de bilan.

Handoff : @fullstack (UXV-2-01, 02, 03, 05), @design (UXV-2-02 contraste), @copywriter (messages d'UXV-2-01 et 03), @qa (UXV-2-06 captures aux noms stables).
